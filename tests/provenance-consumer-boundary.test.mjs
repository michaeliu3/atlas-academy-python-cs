import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { copyFile, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import test from "node:test";

import { openGitIndexSnapshot } from "../scripts/git-index-snapshot.mjs";
import { validateLegacyCandidatePreflightProfiles } from "../scripts/legacy-candidate-preflight-profiles.mjs";
import { validateModuleEvidencePreflight } from "../scripts/module-evidence-preflight.mjs";
import { validateCourseContracts } from "../scripts/validate-course.mjs";

const execFileAsync = promisify(execFile);
const testDirectory = dirname(fileURLToPath(import.meta.url));
const sourceSiteRoot = resolve(testDirectory, "..");

async function git(root, args) {
  return execFileAsync("git", args, { cwd: root, encoding: "utf8" });
}

async function createIndexedFixture(t) {
  const root = await mkdtemp(join(tmpdir(), "atlas-provenance-consumer-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const prefix = `${root.replaceAll("\\", "/")}/`;

  // Materialize exactly the source repository's current Git index so these
  // tests never dirty the learner product's real worktree.
  await execFileAsync("git", ["checkout-index", "--all", `--prefix=${prefix}`], {
    cwd: sourceSiteRoot,
    maxBuffer: 64 * 1024 * 1024,
  });
  await git(root, ["init", "--quiet"]);
  await git(root, ["config", "user.email", "tests@example.invalid"]);
  await git(root, ["config", "user.name", "Atlas test"]);
  await git(root, ["add", "."]);
  await git(root, ["commit", "--quiet", "-m", "fixture"]);
  return root;
}

async function capturedCourseState(root) {
  const snapshot = await openGitIndexSnapshot(root);
  const [graph, registry] = await Promise.all([
    snapshot.readJson("content/course/course-graph.v2.json"),
    snapshot.readJson("content/course/contracts/module-contract-registry.v3.json"),
  ]);
  return { snapshot, graph: graph.value, registry: registry.value };
}

async function dirtyTrackedReadme(root) {
  const readmePath = join(root, "README.md");
  const original = await readFile(readmePath, "utf8");
  await writeFile(readmePath, `${original}\nTemporary worktree divergence for provenance testing.\n`, "utf8");
}

test("checked-in course validation rejects an unrelated tracked worktree divergence before semantic validation", async (t) => {
  const root = await createIndexedFixture(t);
  const { snapshot, graph, registry } = await capturedCourseState(root);
  await dirtyTrackedReadme(root);

  await assert.rejects(
    () => validateCourseContracts(graph, registry, {
      siteRoot: root,
      requireGitTracked: true,
      snapshot,
    }),
    /requires one clean captured Git-index workspace \(WORKTREE_DIVERGED\)/iu,
  );
});

test("candidate preflight rejects an unrelated tracked worktree divergence before reading candidate artifacts", async (t) => {
  const root = await createIndexedFixture(t);
  const snapshot = await openGitIndexSnapshot(root);
  await dirtyTrackedReadme(root);

  await assert.rejects(
    () => validateModuleEvidencePreflight({ moduleId: "m29" }, { siteRoot: root, snapshot }),
    /M29 evidence preflight requires one clean captured Git-index workspace \(WORKTREE_DIVERGED\)/iu,
  );
});

test("profile-derived source inputs remain tied to the captured Git-index closure", async (t) => {
  const root = await createIndexedFixture(t);
  const snapshot = await openGitIndexSnapshot(root);
  const profiles = (
    await snapshot.readJson("content/course/contracts/legacy-candidate-preflight-profiles.v1.json")
  ).value;
  const sourcePath = profiles.candidates[0].sourceLedgerPaths[0];
  const sourceFile = join(root, sourcePath);
  await writeFile(sourceFile, `${await readFile(sourceFile, "utf8")}\nLater staged source map.\n`, "utf8");
  await git(root, ["add", sourcePath]);

  await assert.rejects(
    () => validateLegacyCandidatePreflightProfiles(profiles, { siteRoot: root, snapshot }),
    /INDEX_SNAPSHOT_STALE/iu,
  );
});

test("strict course validation sees an unallowlisted public download despite an inherited alternate index", async (t) => {
  const root = await createIndexedFixture(t);
  const alternateIndexPath = join(root, "pre-rogue.index");
  const rogueDownloadPath = "public/downloads/rogue-unallowlisted.md";
  await copyFile(join(root, ".git", "index"), alternateIndexPath);
  await writeFile(join(root, rogueDownloadPath), "This teaching artifact is intentionally unallowlisted.\n", "utf8");
  await git(root, ["add", rogueDownloadPath]);
  const { snapshot, graph, registry } = await capturedCourseState(root);
  const priorIndexFile = process.env.GIT_INDEX_FILE;
  process.env.GIT_INDEX_FILE = alternateIndexPath;
  try {
    await assert.rejects(
      () => validateCourseContracts(graph, registry, {
        siteRoot: root,
        requireGitTracked: true,
        snapshot,
      }),
      /tracked public teaching artifact is absent from the release-input allowlist: public\/downloads\/rogue-unallowlisted\.md\./iu,
    );
  } finally {
    if (priorIndexFile === undefined) {
      delete process.env.GIT_INDEX_FILE;
    } else {
      process.env.GIT_INDEX_FILE = priorIndexFile;
    }
  }
});
