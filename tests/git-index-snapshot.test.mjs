import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { promisify } from "node:util";
import test from "node:test";
import {
  GitIndexSnapshotError,
  isolatedGitEnvironment,
  openGitIndexSnapshot,
  readGitIndexText,
} from "../scripts/git-index-snapshot.mjs";

const execFileAsync = promisify(execFile);

test("the isolated Git environment supplies only the current worktree safe-directory setting", () => {
  const environment = isolatedGitEnvironment({ safeDirectory: process.cwd() });
  assert.equal(environment.GIT_CONFIG_COUNT, "1");
  assert.equal(environment.GIT_CONFIG_KEY_0, "safe.directory");
  assert.equal(environment.GIT_CONFIG_VALUE_0, process.cwd());
});

async function git(root, args) {
  return execFileAsync("git", args, { cwd: root, encoding: "utf8" });
}

async function writeFixture(root, repositoryPath, contents) {
  const absolutePath = join(root, repositoryPath);
  await mkdir(dirname(absolutePath), { recursive: true });
  await writeFile(absolutePath, contents);
}

async function createRepository() {
  const root = await mkdtemp(join(tmpdir(), "atlas-git-index-snapshot-"));
  await git(root, ["init", "--quiet"]);
  // Keep disposable fixture cleanup deterministic: a large fixture can otherwise
  // trigger detached Git maintenance while the test hook removes its repository.
  await git(root, ["config", "maintenance.auto", "false"]);
  await git(root, ["config", "gc.auto", "0"]);
  await git(root, ["config", "user.email", "tests@example.invalid"]);
  await git(root, ["config", "user.name", "Atlas test"]);
  await writeFixture(root, "content/clean.txt", "committed text\n");
  await writeFixture(root, "content/conflict.txt", "base\n");
  await git(root, ["add", "."]);
  await git(root, ["commit", "--quiet", "-m", "fixture"]);
  return root;
}

async function expectSnapshotError(action, code) {
  await assert.rejects(action, (error) => {
    assert.ok(error instanceof GitIndexSnapshotError);
    assert.equal(error.code, code);
    return true;
  });
}

test("Git-index snapshot returns the exact committed stage-0 blob identity", async (t) => {
  const root = await createRepository();
  t.after(() => rm(root, { recursive: true, force: true }));

  const [{ stdout: expectedBlobOid }, record] = await Promise.all([
    git(root, ["rev-parse", ":content/clean.txt"]),
    readGitIndexText(root, "content/clean.txt"),
  ]);

  assert.equal(record.path, "content/clean.txt");
  assert.equal(record.blobOid, expectedBlobOid.trim());
  assert.equal(record.text, "committed text\n");
  assert.match(record.sha256, /^sha256:[a-f0-9]{64}$/u);
});

test("Git-index snapshot accepts clean staged candidate content before commit", async (t) => {
  const root = await createRepository();
  t.after(() => rm(root, { recursive: true, force: true }));

  await writeFixture(root, "content/clean.txt", "staged candidate text\n");
  await git(root, ["add", "content/clean.txt"]);

  const record = await readGitIndexText(root, "content/clean.txt");
  assert.equal(record.text, "staged candidate text\n");
});

test("a snapshot never substitutes a later dirty worktree replacement for its captured index blob", async (t) => {
  const root = await createRepository();
  t.after(() => rm(root, { recursive: true, force: true }));

  await writeFixture(root, "content/clean.txt", "staged candidate text\n");
  await git(root, ["add", "content/clean.txt"]);
  const snapshot = await openGitIndexSnapshot(root);
  await snapshot.assertClean(["content/clean.txt"]);

  await writeFixture(root, "content/clean.txt", "dirty replacement text\n");
  await expectSnapshotError(
    () => readGitIndexText(root, "content/clean.txt"),
    "WORKTREE_DIVERGED",
  );
  assert.equal((await snapshot.readText("content/clean.txt")).text, "staged candidate text\n");
});

test("a snapshot rejects an index generation that changed after capture", async (t) => {
  const root = await createRepository();
  t.after(() => rm(root, { recursive: true, force: true }));

  const snapshot = await openGitIndexSnapshot(root);
  await writeFixture(root, "content/clean.txt", "newly staged text\n");
  await git(root, ["add", "content/clean.txt"]);

  await expectSnapshotError(
    () => snapshot.assertClean(["content/clean.txt", "content/conflict.txt"]),
    "INDEX_SNAPSHOT_STALE",
  );
  assert.equal((await snapshot.readText("content/clean.txt")).text, "committed text\n");
});

test("a snapshot can close every captured tracked entry as one generation", async (t) => {
  const root = await createRepository();
  t.after(() => rm(root, { recursive: true, force: true }));

  const snapshot = await openGitIndexSnapshot(root);
  await snapshot.assertAllClean();

  await writeFixture(root, "content/conflict.txt", "later staged supporting input\n");
  await git(root, ["add", "content/conflict.txt"]);
  await expectSnapshotError(() => snapshot.assertAllClean(), "INDEX_SNAPSHOT_STALE");
});

test("a whole-index closure rejects an unstaged tracked worktree mutation", async (t) => {
  const root = await createRepository();
  t.after(() => rm(root, { recursive: true, force: true }));

  const snapshot = await openGitIndexSnapshot(root);
  await writeFixture(root, "content/conflict.txt", "unstaged supporting input\n");

  await expectSnapshotError(() => snapshot.assertAllClean(), "WORKTREE_DIVERGED");
});

test("a whole-index closure rejects a newly staged path after capture", async (t) => {
  const root = await createRepository();
  t.after(() => rm(root, { recursive: true, force: true }));

  const snapshot = await openGitIndexSnapshot(root);
  await writeFixture(root, "content/newly-added.txt", "later staged supporting input\n");
  await git(root, ["add", "content/newly-added.txt"]);

  await expectSnapshotError(() => snapshot.assertAllClean(), "INDEX_SNAPSHOT_STALE");
});

test("a whole-index closure rejects a staged removal after capture", async (t) => {
  const root = await createRepository();
  t.after(() => rm(root, { recursive: true, force: true }));
  const snapshot = await openGitIndexSnapshot(root);

  await git(root, ["rm", "--quiet", "content/conflict.txt"]);

  await expectSnapshotError(() => snapshot.assertAllClean(), "INDEX_SNAPSHOT_STALE");
});

test("a whole-index closure rejects an unstaged tracked-file deletion", async (t) => {
  const root = await createRepository();
  t.after(() => rm(root, { recursive: true, force: true }));
  const snapshot = await openGitIndexSnapshot(root);

  await rm(join(root, "content", "conflict.txt"));

  await expectSnapshotError(() => snapshot.assertAllClean(), "WORKTREE_DIVERGED");
});

test("a whole-index closure avoids path-argument limits for a large tracked input set", async (t) => {
  const root = await createRepository();
  t.after(() => rm(root, { recursive: true, force: true }));

  const suffix = "x".repeat(88);
  for (let index = 0; index < 450; index += 1) {
    await writeFixture(
      root,
      `content/large-input-set/${String(index).padStart(4, "0")}-${suffix}.txt`,
      `${index}\n`,
    );
  }
  await git(root, ["add", "."]);
  await git(root, ["commit", "--quiet", "-m", "large input set"]);

  const snapshot = await openGitIndexSnapshot(root);
  await snapshot.assertAllClean();
});

test("Git-index snapshot ignores an inherited Git index override", async (t) => {
  const root = await createRepository();
  t.after(() => rm(root, { recursive: true, force: true }));
  const priorIndexFile = process.env.GIT_INDEX_FILE;
  process.env.GIT_INDEX_FILE = join(root, "untrusted.index");
  try {
    assert.equal((await readGitIndexText(root, "content/clean.txt")).text, "committed text\n");
  } finally {
    if (priorIndexFile === undefined) {
      delete process.env.GIT_INDEX_FILE;
    } else {
      process.env.GIT_INDEX_FILE = priorIndexFile;
    }
  }
});

for (const flag of ["skip-worktree", "assume-unchanged"]) {
  test(`Git-index snapshot rejects ${flag} inputs at capture`, async (t) => {
    const root = await createRepository();
    t.after(() => rm(root, { recursive: true, force: true }));

    await git(root, ["update-index", `--${flag}`, "content/clean.txt"]);

    await expectSnapshotError(() => openGitIndexSnapshot(root), "INDEX_WORKTREE_FLAGGED");
  });

  test(`whole-index closure rejects ${flag} flags introduced after capture`, async (t) => {
    const root = await createRepository();
    t.after(() => rm(root, { recursive: true, force: true }));
    const snapshot = await openGitIndexSnapshot(root);

    await git(root, ["update-index", `--${flag}`, "content/clean.txt"]);
    await writeFixture(root, "content/clean.txt", `hidden ${flag} replacement\n`);

    await expectSnapshotError(() => snapshot.assertAllClean(), "INDEX_WORKTREE_FLAGGED");
  });
}

test("Git-index snapshot rejects unsafe repository paths and nested roots", async (t) => {
  const root = await createRepository();
  t.after(() => rm(root, { recursive: true, force: true }));

  for (const repositoryPath of ["../content/clean.txt", "/content/clean.txt", "content\\clean.txt", ":(glob)*", "content/\u0000clean.txt"]) {
    await expectSnapshotError(
      () => readGitIndexText(root, repositoryPath),
      "INVALID_REPOSITORY_PATH",
    );
  }
  await expectSnapshotError(() => openGitIndexSnapshot(join(root, "content")), "INVALID_SITE_ROOT");
});

test("Git-index snapshot rejects unmerged and non-regular stage entries", async (t) => {
  const root = await createRepository();
  t.after(() => rm(root, { recursive: true, force: true }));

  const { stdout: baseBranch } = await git(root, ["branch", "--show-current"]);
  await git(root, ["checkout", "--quiet", "-b", "other"]);
  await writeFixture(root, "content/conflict.txt", "other branch\n");
  await git(root, ["add", "content/conflict.txt"]);
  await git(root, ["commit", "--quiet", "-m", "other"]);
  await git(root, ["checkout", "--quiet", baseBranch.trim()]);
  await writeFixture(root, "content/conflict.txt", "current branch\n");
  await git(root, ["add", "content/conflict.txt"]);
  await git(root, ["commit", "--quiet", "-m", "current"]);
  await assert.rejects(() => git(root, ["merge", "--no-edit", "other"]));

  const conflictedSnapshot = await openGitIndexSnapshot(root);
  await expectSnapshotError(
    () => conflictedSnapshot.readText("content/conflict.txt"),
    "INDEX_ENTRY_UNMERGED",
  );
  await git(root, ["merge", "--abort"]);

  const { stdout: blobOid } = await git(root, ["rev-parse", ":content/clean.txt"]);
  await git(root, [
    "update-index",
    "--add",
    "--cacheinfo",
    `120000,${blobOid.trim()},content/symlink.txt`,
  ]);
  const symlinkSnapshot = await openGitIndexSnapshot(root);
  await expectSnapshotError(
    () => symlinkSnapshot.readText("content/symlink.txt"),
    "INDEX_ENTRY_NOT_REGULAR",
  );
});

test("Git-index snapshot rejects non-UTF-8 blobs and enforces its text-size cap", async (t) => {
  const root = await createRepository();
  t.after(() => rm(root, { recursive: true, force: true }));

  await writeFixture(root, "content/not-utf8.bin", Buffer.from([0xff, 0xfe, 0x00]));
  await writeFixture(root, "content/oversized.txt", "123456789012345678901");
  await git(root, ["add", "content/not-utf8.bin", "content/oversized.txt"]);

  const snapshot = await openGitIndexSnapshot(root, { maximumTextBytes: 20 });
  assert.equal((await snapshot.readText("content/clean.txt")).text, "committed text\n");
  await expectSnapshotError(() => snapshot.readText("content/not-utf8.bin"), "BLOB_NOT_UTF8");
  await expectSnapshotError(() => snapshot.readText("content/oversized.txt"), "BLOB_TOO_LARGE");
});
