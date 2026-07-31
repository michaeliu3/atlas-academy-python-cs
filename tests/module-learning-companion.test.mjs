import assert from "node:assert/strict";
import test from "node:test";
import { loadCourseGraph } from "../scripts/course-graph.mjs";
import {
  loadModuleLearningCompanions,
  moduleLearningCompanionRelativePath,
  validateModuleLearningCompanion,
  validateModuleLearningCompanions,
} from "../scripts/module-learning-companion.mjs";

function copy(value) {
  return structuredClone(value);
}

test("M29 candidate and M31 authoring companions remain graph-bound without lifecycle promotion", async () => {
  const [graph, companions] = await Promise.all([
    loadCourseGraph(),
    loadModuleLearningCompanions(),
  ]);
  const report = await validateModuleLearningCompanions(companions, { graph });
  const m29 = report.byModuleId.get("m29");
  const m31 = report.byModuleId.get("m31");

  assert.equal(report.summary.companionCount, 2);
  assert.deepEqual(report.summary.moduleIds, ["m29", "m31"]);
  assert.equal(m29.moduleId, "m29");
  assert.equal(m29.guideBinding.locator, "/guides/28");
  assert.equal(m29.teachingAssistant.role, "supportive-oral-defense");
  assert.equal(m29.studyPartner.role, "non-grading-rehearsal");
  assert.equal(m29.forwardHandoff.targetModuleId, "m30");
  assert.equal(moduleLearningCompanionRelativePath("m29"), "content/course/contracts/companions/m29.v1.json");
  assert.equal(m31.moduleId, "m31");
  assert.equal(m31.guideBinding.locator, "/guides/30");
  assert.equal(m31.teachingAssistant.role, "supportive-oral-defense");
  assert.equal(m31.studyPartner.role, "non-grading-rehearsal");
  assert.equal(m31.forwardHandoff.targetModuleId, "m18");
  assert.equal(moduleLearningCompanionRelativePath("m31"), "content/course/contracts/companions/m31.v1.json");

  const graphM31 = graph.modules.find(({ id }) => id === "m31");
  assert.equal(graphM31.state.lifecycle, "authoring-only");
  assert.equal(graphM31.state.readerAccess, "hidden");
  const graphM29 = graph.modules.find(({ id }) => id === "m29");
  assert.equal(graphM29.state.contract.state, "legacy-baseline");
  assert.equal(graphM29.state.release.state, "unrecorded");
});

test("a learning companion fails closed when it forges a graph handoff or module identity", async () => {
  const [graph, companions] = await Promise.all([
    loadCourseGraph(),
    loadModuleLearningCompanions(),
  ]);
  const m31 = companions.records.find(({ moduleId }) => moduleId === "m31");

  const wrongHandoff = copy(m31);
  wrongHandoff.forwardHandoff.targetModuleId = "m32";
  await assert.rejects(
    () => validateModuleLearningCompanion(wrongHandoff, { graph, expectedModuleId: "m31" }),
    /must target canonical forward module m18/i,
  );

  const wrongIdentity = copy(m31);
  wrongIdentity.moduleId = "m32";
  await assert.rejects(
    () => validateModuleLearningCompanion(wrongIdentity, { graph, expectedModuleId: "m31" }),
    /must equal expectedModuleId m31/i,
  );

  const staleGuide = copy(m31);
  staleGuide.guideBinding.digest = `sha256:${"0".repeat(64)}`;
  await assert.rejects(
    () => validateModuleLearningCompanion(staleGuide, { graph, expectedModuleId: "m31" }),
    /must match the exact bound global-guide entry/i,
  );
});
