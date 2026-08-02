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

test("software, systems, mathematics, and authoring companions remain graph-bound without lifecycle promotion", async () => {
  const [graph, companions] = await Promise.all([
    loadCourseGraph(),
    loadModuleLearningCompanions(),
  ]);
  const report = await validateModuleLearningCompanions(companions, { graph });
  const m12 = report.byModuleId.get("m12");
  const m13 = report.byModuleId.get("m13");
  const m27 = report.byModuleId.get("m27");
  const m28 = report.byModuleId.get("m28");
  const m29 = report.byModuleId.get("m29");
  const m30 = report.byModuleId.get("m30");
  const m31 = report.byModuleId.get("m31");
  const m32 = report.byModuleId.get("m32");
  const m33 = report.byModuleId.get("m33");
  const m34 = report.byModuleId.get("m34");
  const m35 = report.byModuleId.get("m35");
  const m36 = report.byModuleId.get("m36");

  const m19 = report.byModuleId.get("m19");
  const m20 = report.byModuleId.get("m20");
  const m21 = report.byModuleId.get("m21");
  const m22 = report.byModuleId.get("m22");
  const m23 = report.byModuleId.get("m23");
  const m24 = report.byModuleId.get("m24");

  assert.equal(report.summary.companionCount, 18);
  assert.deepEqual(report.summary.moduleIds, [
    "m12",
    "m13",
    "m19",
    "m20",
    "m21",
    "m22",
    "m23",
    "m24",
    "m27",
    "m28",
    "m29",
    "m30",
    "m31",
    "m32",
    "m33",
    "m34",
    "m35",
    "m36",
  ]);
  assert.equal(m12.guideBinding.locator, "/guides/11");
  assert.equal(m12.teachingAssistant.role, "supportive-oral-defense");
  assert.equal(m12.studyPartner.role, "non-grading-rehearsal");
  assert.equal(m12.forwardHandoff.targetModuleId, "m13");
  assert.equal(moduleLearningCompanionRelativePath("m12"), "content/course/contracts/companions/m12.v1.json");
  assert.equal(m13.guideBinding.locator, "/guides/12");
  assert.equal(m13.teachingAssistant.role, "supportive-oral-defense");
  assert.equal(m13.studyPartner.role, "non-grading-rehearsal");
  assert.equal(m13.forwardHandoff.targetModuleId, "m14");
  assert.equal(moduleLearningCompanionRelativePath("m13"), "content/course/contracts/companions/m13.v1.json");
  assert.equal(m19.guideBinding.locator, "/guides/18");
  assert.equal(m19.forwardHandoff.targetModuleId, "m20");
  assert.equal(m20.guideBinding.locator, "/guides/19");
  assert.equal(m20.forwardHandoff.targetModuleId, "m21");
  assert.equal(m21.guideBinding.locator, "/guides/20");
  assert.equal(m21.forwardHandoff.targetModuleId, "m22");
  assert.equal(m22.guideBinding.locator, "/guides/21");
  assert.equal(m22.forwardHandoff.targetModuleId, "m23");
  assert.equal(m23.guideBinding.locator, "/guides/22");
  assert.equal(m23.forwardHandoff.targetModuleId, "m24");
  assert.equal(m24.guideBinding.locator, "/guides/23");
  assert.equal(m24.forwardHandoff.targetModuleId, "m32");
  assert.match(m24.forwardHandoff.boundary, /authoring-only and hidden/i);
  assert.equal(m27.guideBinding.locator, "/guides/26");
  assert.equal(m27.forwardHandoff.targetModuleId, "m06");
  assert.equal(m28.guideBinding.locator, "/guides/27");
  assert.equal(m28.forwardHandoff.targetModuleId, "m29");
  assert.equal(m29.moduleId, "m29");
  assert.equal(m29.guideBinding.locator, "/guides/28");
  assert.equal(m29.teachingAssistant.role, "supportive-oral-defense");
  assert.equal(m29.studyPartner.role, "non-grading-rehearsal");
  assert.equal(m29.forwardHandoff.targetModuleId, "m30");
  assert.equal(moduleLearningCompanionRelativePath("m29"), "content/course/contracts/companions/m29.v1.json");
  assert.equal(m30.guideBinding.locator, "/guides/29");
  assert.equal(m30.forwardHandoff.targetModuleId, "m31");
  assert.equal(m31.moduleId, "m31");
  assert.equal(m31.guideBinding.locator, "/guides/30");
  assert.equal(m31.teachingAssistant.role, "supportive-oral-defense");
  assert.equal(m31.studyPartner.role, "non-grading-rehearsal");
  assert.match(m31.studyPartner.rehearsalMove, /M28\/M29\/M30 retrieval checks/u);
  assert.match(m31.studyPartner.rehearsalMove, /0–100 confidence/u);
  assert.match(m31.teachingAssistant.artifactFocus, /0–100 confidence/u);
  assert.equal(m31.forwardHandoff.targetModuleId, "m18");
  assert.equal(moduleLearningCompanionRelativePath("m31"), "content/course/contracts/companions/m31.v1.json");
  assert.match(m32.studyPartner.rehearsalMove, /M12, M17, M24\/M28, M19, or M31/u);
  assert.match(m32.studyPartner.rehearsalMove, /0–100 confidence/u);
  assert.match(m32.teachingAssistant.artifactFocus, /0–100 confidence/u);
  for (const [courseModule, guideLocator, forwardModuleId] of [
    [m32, "/guides/31", "m33"],
    [m33, "/guides/32", "m34"],
    [m34, "/guides/33", "m35"],
    [m35, "/guides/34", "m36"],
    [m36, "/guides/35", "m25"],
  ]) {
    assert.ok(courseModule);
    assert.equal(courseModule.guideBinding.locator, guideLocator);
    assert.equal(courseModule.teachingAssistant.role, "supportive-oral-defense");
    assert.equal(courseModule.studyPartner.role, "non-grading-rehearsal");
    assert.equal(courseModule.forwardHandoff.targetModuleId, forwardModuleId);
    assert.match(courseModule.forwardHandoff.boundary, /not learner navigation, release evidence, or credit/i);
  }

  const graphM31 = graph.modules.find(({ id }) => id === "m31");
  assert.equal(graphM31.state.lifecycle, "authoring-only");
  assert.equal(graphM31.state.readerAccess, "hidden");
  for (const moduleId of ["m32", "m33", "m34", "m35", "m36"]) {
    const graphModule = graph.modules.find(({ id }) => id === moduleId);
    assert.equal(graphModule.state.lifecycle, "authoring-only");
    assert.equal(graphModule.state.readerAccess, "hidden");
    assert.equal(graphModule.state.contract.state, "authoring-only");
    assert.equal(graphModule.state.release.state, "unrecorded");
  }
  const graphM29 = graph.modules.find(({ id }) => id === "m29");
  assert.equal(graphM29.state.contract.state, "legacy-baseline");
  assert.equal(graphM29.state.release.state, "unrecorded");
  const graphM12 = graph.modules.find(({ id }) => id === "m12");
  const graphM13 = graph.modules.find(({ id }) => id === "m13");
  const graphM19 = graph.modules.find(({ id }) => id === "m19");
  const graphM24 = graph.modules.find(({ id }) => id === "m24");
  assert.equal(graphM12.state.lifecycle, "learner-material-ready");
  assert.equal(graphM12.state.contract.state, "legacy-baseline");
  assert.equal(graphM12.state.release.state, "unrecorded");
  assert.equal(graphM13.state.lifecycle, "learner-material-ready");
  assert.equal(graphM13.state.contract.state, "legacy-baseline");
  assert.equal(graphM13.state.release.state, "unrecorded");
  assert.equal(graphM19.state.contract.state, "legacy-baseline");
  assert.equal(graphM19.state.release.state, "unrecorded");
  assert.equal(graphM24.state.contract.state, "legacy-baseline");
  assert.equal(graphM24.state.release.state, "unrecorded");
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
