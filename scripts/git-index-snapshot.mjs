import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import { isAbsolute, relative, resolve } from "node:path";
import { realpath } from "node:fs/promises";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const snapshotMetadata = new WeakMap();
// readGitIndexText is the compatibility path used by high-volume structural
// validators. Capturing the complete index for every one-path read turns a
// deterministic check into hundreds of Git child processes. Cache only the
// immutable snapshot object; each read still calls assertClean for its path,
// and a stale-generation/path miss below evicts and recaptures it.
const readSnapshotCache = new Map();

export const defaultMaximumGitIndexTextBytes = 2 * 1024 * 1024;

function snapshotCacheKey(siteRoot, maximumTextBytes) {
  return `${resolve(siteRoot)}\u0000${maximumTextBytes}`;
}

/**
 * Share one immutable snapshot across high-volume validators in a test worker.
 * This is opt-in from scripts/run-course-tests.mjs; direct callers retain the
 * historical fresh-snapshot behavior unless they explicitly enable the cache.
 */
export async function openCachedGitIndexSnapshot(
  siteRoot,
  options = {},
) {
  if (process.env.ATLAS_GIT_INDEX_SNAPSHOT_CACHE !== "1") {
    return openGitIndexSnapshot(siteRoot, options);
  }
  const maximumTextBytes = options.maximumTextBytes ?? defaultMaximumGitIndexTextBytes;
  const cacheKey = snapshotCacheKey(siteRoot, maximumTextBytes);
  let snapshotPromise = readSnapshotCache.get(cacheKey);
  if (!snapshotPromise) {
    snapshotPromise = openGitIndexSnapshot(siteRoot, options);
    readSnapshotCache.set(cacheKey, snapshotPromise);
    snapshotPromise.catch(() => {
      if (readSnapshotCache.get(cacheKey) === snapshotPromise) {
        readSnapshotCache.delete(cacheKey);
      }
    });
  }
  return snapshotPromise;
}

export function invalidateCachedGitIndexSnapshot(siteRoot, options = {}) {
  const maximumTextBytes = options.maximumTextBytes ?? defaultMaximumGitIndexTextBytes;
  readSnapshotCache.delete(snapshotCacheKey(siteRoot, maximumTextBytes));
}

export class GitIndexSnapshotError extends Error {
  constructor(code, message, { cause = undefined } = {}) {
    super(message, cause === undefined ? undefined : { cause });
    this.name = "GitIndexSnapshotError";
    this.code = code;
  }
}

function fail(code, message, options) {
  throw new GitIndexSnapshotError(code, message, options);
}

function normalizedRepositoryPath(value) {
  if (
    typeof value !== "string" ||
    value.trim() === "" ||
    value.includes("\\") ||
    /[\u0000-\u001f\u007f]/u.test(value) ||
    isAbsolute(value) ||
    value.startsWith("/") ||
    value.startsWith(":") ||
    value.split("/").some((part) => part === "" || part === "." || part === "..")
  ) {
    fail(
      "INVALID_REPOSITORY_PATH",
      "Git-index text reads require a normalized repository-relative path.",
    );
  }
  return value;
}

function literalPathspec(repositoryPath) {
  return `:(literal)${repositoryPath}`;
}

function commandFailure(command, error) {
  return new GitIndexSnapshotError(
    "GIT_COMMAND_FAILED",
    `Git-index snapshot command failed: git ${command.join(" ")}.`,
    { cause: error },
  );
}

// Git child processes in release validation must describe the worktree selected
// by their `cwd`, not a caller-selected alternate Git directory, worktree, or
// index. Keep this boundary shared so transitive validators cannot quietly read
// different repository facts from the snapshot that anchors their proof. The
// one generated Git setting is the exact current worktree's safe-directory
// allowance; it replaces, rather than inherits, any caller-supplied Git config.
export function isolatedGitEnvironment({ safeDirectory = process.cwd() } = {}) {
  if (typeof safeDirectory !== "string" || safeDirectory.trim() === "" || !isAbsolute(safeDirectory)) {
    throw new TypeError("Git-index snapshot needs an absolute safe-directory path.");
  }
  const environment = { ...process.env };
  for (const key of Object.keys(environment)) {
    if (key.toUpperCase().startsWith("GIT_")) {
      delete environment[key];
    }
  }
  environment.GIT_CONFIG_COUNT = "1";
  environment.GIT_CONFIG_KEY_0 = "safe.directory";
  environment.GIT_CONFIG_VALUE_0 = safeDirectory;
  return environment;
}

async function gitText(siteRoot, command) {
  try {
    const { stdout } = await execFileAsync("git", command, {
      cwd: siteRoot,
      env: isolatedGitEnvironment(),
      encoding: "utf8",
      maxBuffer: defaultMaximumGitIndexTextBytes,
    });
    return stdout;
  } catch (error) {
    throw commandFailure(command, error);
  }
}

async function gitBuffer(siteRoot, command, { maxBuffer = defaultMaximumGitIndexTextBytes } = {}) {
  try {
    const { stdout } = await execFileAsync("git", command, {
      cwd: siteRoot,
      env: isolatedGitEnvironment(),
      encoding: "buffer",
      maxBuffer,
    });
    return Buffer.isBuffer(stdout) ? stdout : Buffer.from(stdout);
  } catch (error) {
    throw commandFailure(command, error);
  }
}

async function checkedRepositoryRoot(siteRoot) {
  let realSiteRoot;
  try {
    realSiteRoot = await realpath(siteRoot);
  } catch (error) {
    fail("INVALID_SITE_ROOT", "Git-index snapshot needs an existing Git worktree root.", { cause: error });
  }

  let reportedRoot;
  let bare;
  try {
    [reportedRoot, bare] = await Promise.all([
      gitText(realSiteRoot, ["rev-parse", "--show-toplevel"]),
      gitText(realSiteRoot, ["rev-parse", "--is-bare-repository"]),
    ]);
  } catch (error) {
    if (error instanceof GitIndexSnapshotError) {
      fail("INVALID_SITE_ROOT", "Git-index snapshot needs a non-bare Git worktree root.", { cause: error });
    }
    throw error;
  }
  if (bare.trim() !== "false") {
    fail("INVALID_SITE_ROOT", "Git-index snapshot cannot read a bare repository.");
  }

  let realReportedRoot;
  try {
    realReportedRoot = await realpath(reportedRoot.trimEnd());
  } catch (error) {
    fail("INVALID_SITE_ROOT", "Git-index snapshot could not resolve its Git worktree root.", { cause: error });
  }
  if (relative(realSiteRoot, realReportedRoot) !== "" || relative(realReportedRoot, realSiteRoot) !== "") {
    fail("INVALID_SITE_ROOT", "Git-index snapshot siteRoot must equal the Git worktree root.");
  }
  return realSiteRoot;
}

function parseIndexEntries(buffer, { includeWorktreeStatus = false } = {}) {
  const entriesByPath = new Map();
  let start = 0;
  while (start < buffer.length) {
    const end = buffer.indexOf(0, start);
    if (end === -1) {
      fail("GIT_COMMAND_FAILED", "Git-index snapshot received an unterminated stage listing.");
    }
    const entry = buffer.subarray(start, end);
    start = end + 1;
    if (entry.length === 0) continue;
    let stageEntry = entry;
    if (includeWorktreeStatus) {
      if (entry.length < 3 || entry[1] !== 0x20) {
        fail("GIT_COMMAND_FAILED", "Git-index snapshot received an invalid worktree-status stage listing.");
      }
      const worktreeStatus = String.fromCharCode(entry[0]);
      // `git ls-files --stage -v` renders skip-worktree as `S` and every
      // assume-unchanged entry with a lowercase status. Both flags suppress
      // ordinary worktree-change detection, so they are incompatible with a
      // full-worktree provenance claim.
      if (worktreeStatus === "S" || /[a-z]/u.test(worktreeStatus)) {
        fail(
          "INDEX_WORKTREE_FLAGGED",
          "Git-index snapshot refuses skip-worktree or assume-unchanged entries in a provenance workspace.",
        );
      }
      stageEntry = entry.subarray(2);
    }
    const separator = stageEntry.indexOf(0x09);
    const header = separator === -1 ? "" : stageEntry.subarray(0, separator).toString("ascii");
    const match = /^(\d{6}) ([0-9a-f]{40,64}) ([0-3])$/u.exec(header);
    if (!match || separator === -1) {
      fail("GIT_COMMAND_FAILED", "Git-index snapshot received an invalid stage listing.");
    }
    let repositoryPath;
    try {
      repositoryPath = new TextDecoder("utf-8", { fatal: true }).decode(stageEntry.subarray(separator + 1));
    } catch {
      // An unrelated non-UTF-8 filename must not make a valid text evidence
      // path unreadable. Such a filename can never be a supported input path.
      continue;
    }
    if (repositoryPath === "") {
      fail("GIT_COMMAND_FAILED", "Git-index snapshot received an empty repository path.");
    }
    const record = Object.freeze({
      mode: match[1],
      blobOid: match[2],
      stage: Number(match[3]),
    });
    const existing = entriesByPath.get(repositoryPath) ?? [];
    existing.push(record);
    entriesByPath.set(repositoryPath, existing);
  }
  return entriesByPath;
}

function stageZeroRecord(entriesByPath, repositoryPath) {
  const entries = entriesByPath.get(repositoryPath) ?? [];
  if (entries.length === 0) {
    fail("INDEX_ENTRY_MISSING", `Git index has no entry for ${repositoryPath}.`);
  }
  if (entries.some(({ stage }) => stage !== 0)) {
    fail("INDEX_ENTRY_UNMERGED", `Git index entry ${repositoryPath} is unmerged.`);
  }
  if (entries.length !== 1 || entries[0].stage !== 0) {
    fail("INDEX_ENTRY_MISSING", `Git index must contain exactly one stage-0 entry for ${repositoryPath}.`);
  }
  const entry = entries[0];
  if (entry.mode !== "100644" && entry.mode !== "100755") {
    fail("INDEX_ENTRY_NOT_REGULAR", `Git index entry ${repositoryPath} must be a regular file.`);
  }
  return entry;
}

async function assertWorktreeMatchesIndex(siteRoot, repositoryPath, { wholeIndex = false } = {}) {
  const paths = Array.isArray(repositoryPath) ? repositoryPath : [repositoryPath];
  // A large pathspec list is disproportionately expensive on Windows. Ask Git
  // for changed tracked paths once, then intersect in memory. Unrelated dirty
  // files remain outside the clean boundary.
  if (!wholeIndex && paths.length > 32) {
    const changed = await gitBuffer(siteRoot, ["diff", "--name-only", "--no-ext-diff", "-z"]);
    const changedPaths = new Set(changed.toString("utf8").split("\0").filter(Boolean));
    if (paths.some((path) => changedPaths.has(path))) {
      fail("WORKTREE_DIVERGED", "Worktree content differs from the captured Git-index input set.");
    }
    return;
  }
  const command = wholeIndex
    ? ["diff", "--quiet", "--no-ext-diff"]
    : ["diff", "--quiet", "--no-ext-diff", "--", ...paths.map(literalPathspec)];
  try {
    await execFileAsync("git", command, { cwd: siteRoot, env: isolatedGitEnvironment() });
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === 1) {
      fail("WORKTREE_DIVERGED", "Worktree content differs from the captured Git-index input set.");
    }
    throw commandFailure(command, error);
  }
}

function sameFilesystemPath(left, right) {
  return relative(left, right) === "" && relative(right, left) === "";
}

/**
 * Reject a forged reader or a snapshot captured from another repository before
 * a validator uses it as evidence. The WeakMap brand is intentionally not
 * exposed through the snapshot's public shape.
 */
export async function assertGitIndexSnapshotForSiteRoot(snapshot, siteRoot) {
  const metadata = snapshotMetadata.get(snapshot);
  if (!metadata) {
    fail("INVALID_SNAPSHOT", "A Git-index evidence reader must be an Atlas Git-index snapshot.");
  }
  let realSiteRoot;
  try {
    realSiteRoot = await realpath(siteRoot);
  } catch (error) {
    fail("INVALID_SITE_ROOT", "Git-index snapshot needs an existing Git worktree root.", { cause: error });
  }
  if (!sameFilesystemPath(metadata.siteRoot, realSiteRoot)) {
    fail("SNAPSHOT_SITE_ROOT_MISMATCH", "Git-index snapshot belongs to a different Git worktree root.");
  }
  return snapshot;
}

async function currentIndexEntries(siteRoot, repositoryPaths) {
  return parseIndexEntries(
    await gitBuffer(
      siteRoot,
      ["ls-files", "--stage", "-v", "-z", "--", ...repositoryPaths.map(literalPathspec)],
      { maxBuffer: 32 * 1024 * 1024 },
    ),
    { includeWorktreeStatus: true },
  );
}

async function blobText(siteRoot, repositoryPath, entry, maximumTextBytes) {
  let sizeText;
  try {
    sizeText = await gitText(siteRoot, ["cat-file", "-s", entry.blobOid]);
  } catch (error) {
    if (error instanceof GitIndexSnapshotError) {
      fail("BLOB_UNAVAILABLE", `Git index blob for ${repositoryPath} is unavailable.`, { cause: error });
    }
    throw error;
  }
  const byteLength = Number(sizeText.trim());
  if (!Number.isSafeInteger(byteLength) || byteLength < 0) {
    fail("BLOB_UNAVAILABLE", `Git index blob for ${repositoryPath} has an invalid size.`);
  }
  if (byteLength > maximumTextBytes) {
    fail(
      "BLOB_TOO_LARGE",
      `Git index blob for ${repositoryPath} exceeds the ${maximumTextBytes}-byte text limit.`,
    );
  }

  let bytes;
  try {
    bytes = await gitBuffer(siteRoot, ["cat-file", "blob", entry.blobOid], {
      maxBuffer: maximumTextBytes + 1,
    });
  } catch (error) {
    if (error instanceof GitIndexSnapshotError) {
      fail("BLOB_UNAVAILABLE", `Git index blob for ${repositoryPath} is unavailable.`, { cause: error });
    }
    throw error;
  }
  if (bytes.byteLength !== byteLength || bytes.byteLength > maximumTextBytes) {
    fail("BLOB_UNAVAILABLE", `Git index blob for ${repositoryPath} changed while being read.`);
  }
  let text;
  try {
    text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch (error) {
    fail("BLOB_NOT_UTF8", `Git index blob for ${repositoryPath} is not valid UTF-8 text.`, { cause: error });
  }
  return Object.freeze({
    path: repositoryPath,
    mode: entry.mode,
    blobOid: entry.blobOid,
    byteLength,
    sha256: `sha256:${createHash("sha256").update(bytes).digest("hex")}`,
    text,
  });
}

/**
 * Capture the current Git index exactly once. The returned reader never falls
 * back to worktree bytes; callers that need a clean candidate must explicitly
 * call assertClean before trusting one or more paths as a consistent input set.
 */
export async function openGitIndexSnapshot(
  siteRoot,
  { maximumTextBytes = defaultMaximumGitIndexTextBytes } = {},
) {
  if (!Number.isSafeInteger(maximumTextBytes) || maximumTextBytes < 1) {
    fail("INVALID_MAXIMUM_TEXT_BYTES", "Git-index snapshot maximumTextBytes must be a positive safe integer.");
  }
  const repositoryRoot = await checkedRepositoryRoot(siteRoot);
  const capturedIndexStage = await gitBuffer(repositoryRoot, ["ls-files", "--stage", "-v", "-z"], {
    maxBuffer: 32 * 1024 * 1024,
  });
  const indexEntries = parseIndexEntries(capturedIndexStage, { includeWorktreeStatus: true });
  const capturedRepositoryPaths = Object.freeze([...indexEntries.keys()].sort());
  const textCache = new Map();

  const readText = async (repositoryPath) => {
    const normalizedPath = normalizedRepositoryPath(repositoryPath);
    const entry = stageZeroRecord(indexEntries, normalizedPath);
    let recordPromise = textCache.get(normalizedPath);
    if (!recordPromise) {
      recordPromise = blobText(repositoryRoot, normalizedPath, entry, maximumTextBytes);
      textCache.set(normalizedPath, recordPromise);
      recordPromise.catch(() => {
        if (textCache.get(normalizedPath) === recordPromise) {
          textCache.delete(normalizedPath);
        }
      });
    }
    return recordPromise;
  };
  const readJson = async (repositoryPath) => {
    const record = await readText(repositoryPath);
    if (!record.path.endsWith(".json")) {
      fail("BLOB_NOT_JSON", `Git index text ${record.path} must name a JSON file.`);
    }
    try {
      return Object.freeze({ ...record, value: JSON.parse(record.text) });
    } catch (error) {
      fail("BLOB_NOT_JSON", `Git index text ${record.path} is not parseable JSON.`, { cause: error });
    }
  };
  const assertClean = async (repositoryPaths) => {
    if (!Array.isArray(repositoryPaths) || repositoryPaths.length === 0) {
      fail("INVALID_REPOSITORY_PATH", "Git-index snapshot clean checks need at least one repository path.");
    }
    const normalizedPaths = [...new Set(repositoryPaths.map(normalizedRepositoryPath))].sort();
    const liveEntries = await currentIndexEntries(repositoryRoot, normalizedPaths);
    for (const repositoryPath of normalizedPaths) {
      const captured = stageZeroRecord(indexEntries, repositoryPath);
      const current = stageZeroRecord(liveEntries, repositoryPath);
      if (captured.mode !== current.mode || captured.blobOid !== current.blobOid) {
        fail(
          "INDEX_SNAPSHOT_STALE",
          `Git index entry ${repositoryPath} changed after this snapshot was captured.`,
        );
      }
    }
    await assertWorktreeMatchesIndex(repositoryRoot, normalizedPaths);
    return Object.freeze([...normalizedPaths]);
  };
  const assertAllClean = async () => {
    const liveIndexStage = await gitBuffer(repositoryRoot, ["ls-files", "--stage", "-v", "-z"], {
      maxBuffer: 32 * 1024 * 1024,
    });
    parseIndexEntries(liveIndexStage, { includeWorktreeStatus: true });
    if (!liveIndexStage.equals(capturedIndexStage)) {
      fail(
        "INDEX_SNAPSHOT_STALE",
        "Git index entries changed after this snapshot was captured.",
      );
    }
    if (capturedRepositoryPaths.length > 0) {
      await assertWorktreeMatchesIndex(repositoryRoot, capturedRepositoryPaths, { wholeIndex: true });
    }
    return capturedRepositoryPaths;
  };

  const snapshot = Object.freeze({
    siteRoot: repositoryRoot,
    maximumTextBytes,
    readText,
    readJson,
    assertClean,
    assertAllClean,
  });
  snapshotMetadata.set(snapshot, Object.freeze({ siteRoot: repositoryRoot }));
  return snapshot;
}

/**
 * Compatibility helper for a one-path clean, immutable Git-index read.
 * Multi-file callers should open one snapshot and clean their whole closure
 * before reading, so later index mutations cannot mix generations.
 */
export async function readGitIndexText(siteRoot, repositoryPath, options = {}) {
  if (process.env.ATLAS_GIT_INDEX_SNAPSHOT_CACHE !== "1") {
    const snapshot = await openGitIndexSnapshot(siteRoot, options);
    await snapshot.assertClean([repositoryPath]);
    return snapshot.readText(repositoryPath);
  }
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const snapshotPromise = openCachedGitIndexSnapshot(siteRoot, options);
    const snapshot = await snapshotPromise;
    try {
      await snapshot.assertClean([repositoryPath]);
      return snapshot.readText(repositoryPath);
    } catch (error) {
      // The old one-shot helper captured a fresh index on every call. Preserve
      // that behavior when a cached generation is no longer usable, while
      // never retrying worktree/encoding/size failures that should remain
      // visible to the caller.
      const refreshable =
        error instanceof GitIndexSnapshotError &&
        ["INDEX_SNAPSHOT_STALE", "INDEX_ENTRY_MISSING", "INDEX_ENTRY_UNMERGED", "INDEX_ENTRY_NOT_REGULAR"].includes(error.code);
      if (!refreshable || attempt === 1) throw error;
      invalidateCachedGitIndexSnapshot(siteRoot, options);
    }
  }
  throw new GitIndexSnapshotError("GIT_COMMAND_FAILED", "Git-index text read did not produce a snapshot.");
}
