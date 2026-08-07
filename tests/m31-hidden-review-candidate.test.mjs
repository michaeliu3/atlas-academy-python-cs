import assert from "node:assert/strict";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { projectReaderModules } from "../scripts/course-graph.mjs";
import { openGitIndexSnapshot } from "../scripts/git-index-snapshot.mjs";
import { resolveHiddenReviewCandidateScope } from "../scripts/hidden-review-candidate.mjs";

const testDirectory = dirname(fileURLToPath(import.meta.url));
const siteRoot = resolve(testDirectory, "..");

test("M31 freezes a hidden review candidate without changing its authoring-only route", async () => {
  const snapshot = await openGitIndexSnapshot(siteRoot);
  await snapshot.assertClean([
    "content/course/course-graph.v2.json",
    "content/modules/manifest.json",
  ]);
  const [graphRecord, manifestRecord] = await Promise.all([
    snapshot.readJson("content/course/course-graph.v2.json"),
    snapshot.readJson("content/modules/manifest.json"),
  ]);
  const graph = graphRecord.value;
  const manifest = manifestRecord.value;
  const candidate = await resolveHiddenReviewCandidateScope({
    siteRoot,
    moduleId: "m31",
    evidenceRecordPath: "content/course/contracts/evidence/m31.v1.json",
    snapshot,
  });

  assert.deepEqual(candidate.candidateInputPaths, [
    "content/course/contracts/evidence/m31.v1.json",
    "content/course/contracts/review-candidates/m31.v1.json",
    "content/modules/31_optimization_information.md",
    "content/source-maps/module31_optimization_information.md",
  ]);
  assert.ok(
    !candidate.candidateInputPaths.includes(
      "content/authoring/m31_optimization_information_workbook.v1.md",
    ),
  );
  assert.ok(
    !candidate.candidateInputPaths.includes("content/course/contracts/authoring-delivery/m31.v1.json"),
  );

  const m31 = graph.modules.find(({ id }) => id === "m31");
  assert.equal(m31?.state.availability, "authoring-only");
  assert.equal(m31?.state.readerAccess, "hidden");
  assert.equal(m31?.state.release?.state, "unrecorded");
  assert.equal(m31?.state.contract?.state, "authoring-only");
  assert.equal(m31?.sourceMap, null);
  assert.equal(m31?.studioId, null);
  assert.ok(!projectReaderModules(graph).some(({ id }) => id === "m31"));
  assert.ok(!manifest.modules.some(({ id }) => id === "m31"));
});
