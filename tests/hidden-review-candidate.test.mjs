import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { openGitIndexSnapshot } from "../scripts/git-index-snapshot.mjs";
import {
  hiddenReviewCandidateRelativePath,
  resolveHiddenReviewCandidateScope,
  validateHiddenReviewCandidateSelector,
} from "../scripts/hidden-review-candidate.mjs";
import { resolvePromotionSnapshotContext } from "../scripts/module-contract-registry.mjs";

const execFileAsync = promisify(execFile);
const testDirectory = dirname(fileURLToPath(import.meta.url));
const sourceSiteRoot = resolve(testDirectory, "..");

async function git(root, args) {
  return execFileAsync("git", args, { cwd: root, encoding: "utf8" });
}

async function writeFixture(root, repositoryPath, contents) {
  const target = join(root, repositoryPath);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, contents, "utf8");
}

async function createRepository() {
  const root = await mkdtemp(join(tmpdir(), "atlas-hidden-review-candidate-"));
  await git(root, ["init", "--quiet"]);
  await git(root, ["config", "user.email", "tests@example.invalid"]);
  await git(root, ["config", "user.name", "Atlas test"]);
  return root;
}

function validSelector() {
  return {
    schemaVersion: 1,
    kind: "atlas-hidden-review-candidate-selector",
    selectorVersion: "v1",
    moduleId: "m31",
    purpose: "Freeze the hidden M31 learner-material scope for bounded review only.",
    truthBoundary: {
      review: "This selector identifies a review candidate; it is not a quality approval.",
      learnerDelivery: "The selected files remain hidden until a later verified reader release.",
      release: "This selector records neither deployment nor learner mastery.",
    },
    evidenceRecordPath: "content/course/contracts/evidence/m31.v1.json",
    workbookPath: "content/modules/31_optimization_information.md",
    sourceLedgerPaths: ["content/source-maps/module31_optimization_information.md"],
    visualContentPaths: ["content/modules/31_optimization_information.md"],
  };
}

async function writeCandidateFixture(root, selector = validSelector()) {
  await writeFixture(
    root,
    hiddenReviewCandidateRelativePath("m31"),
    `${JSON.stringify(selector, null, 2)}\n`,
  );
  await writeFixture(root, selector.evidenceRecordPath, "{}\n");
  await writeFixture(root, selector.workbookPath, "# Module 31 — Optimization & Information\n");
  for (const sourceLedgerPath of selector.sourceLedgerPaths) {
    await writeFixture(root, sourceLedgerPath, "# M31 source ledger\n");
  }
}

test("a fixed hidden review selector freezes future learner material without accepting authoring paths", async () => {
  const selector = validSelector();
  const report = validateHiddenReviewCandidateSelector(selector, {
    expectedModuleId: "m31",
    expectedEvidenceRecordPath: "content/course/contracts/evidence/m31.v1.json",
  });
  assert.equal(report.workbookPath, "content/modules/31_optimization_information.md");
  assert.deepEqual(report.visualContentPaths, [report.workbookPath]);

  const authoringSubstitute = structuredClone(selector);
  authoringSubstitute.workbookPath = "content/authoring/m31_optimization_information_workbook.v1.md";
  authoringSubstitute.visualContentPaths = [authoringSubstitute.workbookPath];
  assert.throws(
    () => validateHiddenReviewCandidateSelector(authoringSubstitute),
    /future module-scoped Markdown workbook/u,
  );

  const authoringMapSubstitute = structuredClone(selector);
  authoringMapSubstitute.authoringDeliveryMapPath =
    "content/course/contracts/authoring-delivery/m31.v1.json";
  assert.throws(
    () => validateHiddenReviewCandidateSelector(authoringMapSubstitute),
    /exactly these keys/u,
  );
});

test("the module synchronizer alone opts into the narrowly scoped pre-write manifest projection", async () => {
  const synchronizer = await readFile(resolve(sourceSiteRoot, "scripts/sync-modules.mjs"), "utf8");
  assert.match(synchronizer, /manifestTruth: "pre-write-projection"/u);
});

test("the hidden review selector resolves only its fixed, clean Git-index scope", async (t) => {
  const root = await createRepository();
  t.after(() => rm(root, { recursive: true, force: true }));
  const selector = validSelector();
  await writeCandidateFixture(root, selector);
  await git(root, ["add", "."]);
  await git(root, ["commit", "--quiet", "-m", "candidate fixture"]);

  const snapshot = await openGitIndexSnapshot(root);
  const resolved = await resolveHiddenReviewCandidateScope({
    siteRoot: root,
    moduleId: "m31",
    evidenceRecordPath: selector.evidenceRecordPath,
    snapshot,
  });
  assert.equal(resolved.selectorPath, hiddenReviewCandidateRelativePath("m31"));
  assert.deepEqual(resolved.candidateInputPaths, [
    "content/course/contracts/evidence/m31.v1.json",
    "content/course/contracts/review-candidates/m31.v1.json",
    "content/modules/31_optimization_information.md",
    "content/source-maps/module31_optimization_information.md",
  ]);

  await writeFixture(root, selector.workbookPath, "# Later M31 candidate\n");
  await git(root, ["add", selector.workbookPath]);
  await assert.rejects(
    () => resolveHiddenReviewCandidateScope({
      siteRoot: root,
      moduleId: "m31",
      evidenceRecordPath: selector.evidenceRecordPath,
      snapshot,
    }),
    /INDEX_SNAPSHOT_STALE/u,
  );
});

test("the selector cannot bind another module's evidence record or source ledger", () => {
  const wrongEvidence = validSelector();
  wrongEvidence.evidenceRecordPath = "content/course/contracts/evidence/m32.v1.json";
  assert.throws(
    () => validateHiddenReviewCandidateSelector(wrongEvidence),
    /evidenceRecordPath must be content\/course\/contracts\/evidence\/m31\.v1\.json/u,
  );

  const wrongSource = validSelector();
  wrongSource.sourceLedgerPaths = ["content/source-maps/module32_optimization_information.md"];
  assert.throws(
    () => validateHiddenReviewCandidateSelector(wrongSource),
    /module-scoped Markdown source ledgers/u,
  );
});

test("promotion scope facts come from the same clean graph and manifest snapshot", async (t) => {
  const root = await createRepository();
  t.after(() => rm(root, { recursive: true, force: true }));
  const graphPath = "content/course/course-graph.v2.json";
  const manifestPath = "content/modules/manifest.json";
  const registryPath = "content/course/contracts/module-contract-registry.v3.json";
  await Promise.all([
    writeFixture(root, graphPath, await readFile(resolve(sourceSiteRoot, graphPath), "utf8")),
    writeFixture(root, manifestPath, await readFile(resolve(sourceSiteRoot, manifestPath), "utf8")),
    writeFixture(root, registryPath, await readFile(resolve(sourceSiteRoot, registryPath), "utf8")),
  ]);
  await git(root, ["add", "."]);
  await git(root, ["commit", "--quiet", "-m", "promotion context fixture"]);

  const graph = JSON.parse(await readFile(join(root, graphPath), "utf8"));
  const manifest = JSON.parse(await readFile(join(root, manifestPath), "utf8"));
  const registry = JSON.parse(await readFile(join(root, registryPath), "utf8"));
  const graphModule = graph.modules.find(({ id }) => id === "m31");
  const manifestById = new Map(manifest.modules.map((module) => [module.id, module]));
  const moduleEntry = registry.modules.find(({ moduleId }) => moduleId === "m31");
  const snapshot = await openGitIndexSnapshot(root);
  const context = await resolvePromotionSnapshotContext({
    snapshot,
    graphModule,
    manifestById,
    moduleEntry,
    moduleId: "m31",
  });
  assert.equal(context.graphModule.id, "m31");
  assert.equal(context.manifestById.has("m31"), false);

  const forgedManifest = new Map(manifestById);
  forgedManifest.set("m31", { id: "m31", filename: "31_forged.md" });
  await assert.rejects(
    () => resolvePromotionSnapshotContext({
      snapshot,
      graphModule,
      manifestById: forgedManifest,
      moduleEntry,
      moduleId: "m31",
    }),
    /supplied m31 manifest facts must match/i,
  );

  const projectedManifest = new Map(manifestById);
  projectedManifest.set("m31", {
    id: "m31",
    filename: "31_optimization_information.md",
  });
  const projectionContext = await resolvePromotionSnapshotContext({
    snapshot,
    graphModule,
    manifestById: projectedManifest,
    moduleEntry,
    moduleId: "m31",
    manifestTruth: "pre-write-projection",
  });
  assert.deepEqual(projectionContext.manifestById.get("m31"), projectedManifest.get("m31"));

  const forgedProjectionGraph = { ...graphModule, slug: "forged-m31" };
  await assert.rejects(
    () => resolvePromotionSnapshotContext({
      snapshot,
      graphModule: forgedProjectionGraph,
      manifestById: projectedManifest,
      moduleEntry,
      moduleId: "m31",
      manifestTruth: "pre-write-projection",
    }),
    /supplied m31 graph facts must match/i,
  );

  const forgedEntry = { ...moduleEntry, contractState: "review-ready" };
  await assert.rejects(
    () => resolvePromotionSnapshotContext({
      snapshot,
      graphModule,
      manifestById,
      moduleEntry: forgedEntry,
      moduleId: "m31",
      manifestTruth: "pre-write-projection",
    }),
    /supplied m31 contract facts must match/i,
  );

  await writeFixture(root, manifestPath, `${JSON.stringify({ ...manifest, modules: [] }, null, 2)}\n`);
  await git(root, ["add", manifestPath]);
  await assert.rejects(
    () => resolvePromotionSnapshotContext({
      snapshot,
      graphModule,
      manifestById,
      moduleEntry,
      moduleId: "m31",
      manifestTruth: "pre-write-projection",
    }),
    (error) => error?.code === "INDEX_SNAPSHOT_STALE",
  );
});
