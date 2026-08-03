import assert from "node:assert/strict";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { projectReaderModules } from "../scripts/course-graph.mjs";
import { openGitIndexSnapshot } from "../scripts/git-index-snapshot.mjs";
import { resolveHiddenReviewCandidateScope } from "../scripts/hidden-review-candidate.mjs";

const testDirectory = dirname(fileURLToPath(import.meta.url));
const siteRoot = resolve(testDirectory, "..");

test("M36 freezes a hidden review candidate without changing its authoring-only route", async () => {
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
    moduleId: "m36",
    evidenceRecordPath: "content/course/contracts/evidence/m36.v1.json",
    snapshot,
  });

  assert.deepEqual(candidate.candidateInputPaths, [
    "content/course/contracts/evidence/m36.v1.json",
    "content/course/contracts/review-candidates/m36.v1.json",
    "content/modules/36_statistical_learning_theory_reliable_deep_learning.md",
    "content/source-maps/module36_statistical_learning_theory_reliable_deep_learning.md",
  ]);
  assert.ok(
    !candidate.candidateInputPaths.includes(
      "content/authoring/m36_statistical_learning_theory_reliable_deep_learning_workbook.v1.md",
    ),
  );
  assert.ok(
    !candidate.candidateInputPaths.includes("content/course/contracts/authoring-delivery/m36.v1.json"),
  );

  const m36 = graph.modules.find(({ id }) => id === "m36");
  assert.equal(m36?.state.availability, "authoring-only");
  assert.equal(m36?.state.readerAccess, "hidden");
  assert.equal(m36?.state.release?.state, "unrecorded");
  assert.equal(m36?.state.contract?.state, "authoring-only");
  assert.equal(m36?.sourceMap, null);
  assert.equal(m36?.studioId, null);
  assert.ok(!projectReaderModules(graph).some(({ id }) => id === "m36"));
  assert.ok(!manifest.modules.some(({ id }) => id === "m36"));

  const frozenCandidate = (
    await snapshot.readText("content/modules/36_statistical_learning_theory_reliable_deep_learning.md")
  ).text;
  assert.ok(
    frozenCandidate.includes("\\forall m\\ge m_{\\mathcal H}(\\varepsilon,\\delta)"),
    "The frozen M36 candidate must retain the PAC sample-threshold quantifier.",
  );
  assert.ok(frozenCandidate.includes("\\Pr_{S\\sim P^m,\\,A}"));
});
