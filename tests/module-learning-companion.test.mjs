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

test("foundations, software, systems, mathematics, and authoring companions remain graph-bound without lifecycle promotion", async () => {
  const [graph, companions] = await Promise.all([
    loadCourseGraph(),
    loadModuleLearningCompanions(),
  ]);
  const report = await validateModuleLearningCompanions(companions, { graph });
  const m01 = report.byModuleId.get("m01");
  const m02 = report.byModuleId.get("m02");
  const m03 = report.byModuleId.get("m03");
  const m04 = report.byModuleId.get("m04");
  const m05 = report.byModuleId.get("m05");
  const m06 = report.byModuleId.get("m06");
  const m07 = report.byModuleId.get("m07");
  const m08 = report.byModuleId.get("m08");
  const m09 = report.byModuleId.get("m09");
  const m10 = report.byModuleId.get("m10");
  const m11 = report.byModuleId.get("m11");
  const m12 = report.byModuleId.get("m12");
  const m13 = report.byModuleId.get("m13");
  const m14 = report.byModuleId.get("m14");
  const m15 = report.byModuleId.get("m15");
  const m16 = report.byModuleId.get("m16");
  const m17 = report.byModuleId.get("m17");
  const m18 = report.byModuleId.get("m18");
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

  assert.equal(report.summary.companionCount, 34);
  assert.deepEqual(report.summary.moduleIds, [
    "m01",
    "m02",
    "m03",
    "m04",
    "m05",
    "m06",
    "m07",
    "m08",
    "m09",
    "m10",
    "m11",
    "m12",
    "m13",
    "m14",
    "m15",
    "m16",
    "m17",
    "m18",
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
  assert.equal(m01.guideBinding.locator, "/guides/0");
  assert.equal(m01.teachingAssistant.role, "supportive-oral-defense");
  assert.equal(m01.studyPartner.role, "non-grading-rehearsal");
  assert.equal(m01.forwardHandoff.targetModuleId, "m02");
  assert.equal(moduleLearningCompanionRelativePath("m01"), "content/course/contracts/companions/m01.v1.json");
  assert.equal(m02.guideBinding.locator, "/guides/1");
  assert.equal(m02.teachingAssistant.role, "supportive-oral-defense");
  assert.equal(m02.studyPartner.role, "non-grading-rehearsal");
  assert.equal(m02.forwardHandoff.targetModuleId, "m03");
  assert.equal(moduleLearningCompanionRelativePath("m02"), "content/course/contracts/companions/m02.v1.json");
  assert.equal(m03.guideBinding.locator, "/guides/2");
  assert.equal(m03.teachingAssistant.role, "supportive-oral-defense");
  assert.equal(m03.studyPartner.role, "non-grading-rehearsal");
  assert.equal(m03.forwardHandoff.targetModuleId, "m04");
  assert.equal(moduleLearningCompanionRelativePath("m03"), "content/course/contracts/companions/m03.v1.json");
  assert.equal(m04.guideBinding.locator, "/guides/3");
  assert.equal(m04.teachingAssistant.role, "supportive-oral-defense");
  assert.equal(m04.studyPartner.role, "non-grading-rehearsal");
  assert.equal(m04.forwardHandoff.targetModuleId, "m05");
  assert.equal(moduleLearningCompanionRelativePath("m04"), "content/course/contracts/companions/m04.v1.json");
  assert.equal(m05.guideBinding.locator, "/guides/4");
  assert.equal(m05.teachingAssistant.role, "supportive-oral-defense");
  assert.equal(m05.studyPartner.role, "non-grading-rehearsal");
  assert.equal(m05.forwardHandoff.targetModuleId, "m27");
  assert.equal(moduleLearningCompanionRelativePath("m05"), "content/course/contracts/companions/m05.v1.json");
  assert.equal(m06.guideBinding.locator, "/guides/5");
  assert.equal(m06.teachingAssistant.role, "supportive-oral-defense");
  assert.equal(m06.studyPartner.role, "non-grading-rehearsal");
  assert.equal(m06.forwardHandoff.targetModuleId, "m07");
  assert.equal(moduleLearningCompanionRelativePath("m06"), "content/course/contracts/companions/m06.v1.json");
  assert.equal(m07.guideBinding.locator, "/guides/6");
  assert.equal(m07.teachingAssistant.role, "supportive-oral-defense");
  assert.equal(m07.studyPartner.role, "non-grading-rehearsal");
  assert.equal(m07.forwardHandoff.targetModuleId, "m08");
  assert.equal(moduleLearningCompanionRelativePath("m07"), "content/course/contracts/companions/m07.v1.json");
  assert.equal(m08.guideBinding.locator, "/guides/7");
  assert.equal(m08.forwardHandoff.targetModuleId, "m09");
  assert.equal(moduleLearningCompanionRelativePath("m08"), "content/course/contracts/companions/m08.v1.json");
  assert.equal(m09.guideBinding.locator, "/guides/8");
  assert.equal(m09.forwardHandoff.targetModuleId, "m10");
  assert.equal(moduleLearningCompanionRelativePath("m09"), "content/course/contracts/companions/m09.v1.json");
  assert.equal(m10.guideBinding.locator, "/guides/9");
  assert.equal(m10.forwardHandoff.targetModuleId, "m11");
  assert.equal(moduleLearningCompanionRelativePath("m10"), "content/course/contracts/companions/m10.v1.json");
  assert.equal(m11.guideBinding.locator, "/guides/10");
  assert.equal(m11.teachingAssistant.role, "supportive-oral-defense");
  assert.equal(m11.studyPartner.role, "non-grading-rehearsal");
  assert.equal(m11.forwardHandoff.targetModuleId, "m12");
  assert.equal(moduleLearningCompanionRelativePath("m11"), "content/course/contracts/companions/m11.v1.json");
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
  assert.equal(m14.guideBinding.locator, "/guides/13");
  assert.equal(m14.teachingAssistant.role, "supportive-oral-defense");
  assert.equal(m14.studyPartner.role, "non-grading-rehearsal");
  assert.equal(m14.forwardHandoff.targetModuleId, "m15");
  assert.equal(moduleLearningCompanionRelativePath("m14"), "content/course/contracts/companions/m14.v1.json");
  assert.equal(m15.guideBinding.locator, "/guides/14");
  assert.equal(m15.teachingAssistant.role, "supportive-oral-defense");
  assert.equal(m15.studyPartner.role, "non-grading-rehearsal");
  assert.equal(m15.forwardHandoff.targetModuleId, "m16");
  assert.equal(moduleLearningCompanionRelativePath("m15"), "content/course/contracts/companions/m15.v1.json");
  assert.equal(m16.guideBinding.locator, "/guides/15");
  assert.equal(m16.teachingAssistant.role, "supportive-oral-defense");
  assert.equal(m16.studyPartner.role, "non-grading-rehearsal");
  assert.equal(m16.forwardHandoff.targetModuleId, "m17");
  assert.equal(moduleLearningCompanionRelativePath("m16"), "content/course/contracts/companions/m16.v1.json");
  assert.equal(m17.guideBinding.locator, "/guides/16");
  assert.equal(m17.teachingAssistant.role, "supportive-oral-defense");
  assert.equal(m17.studyPartner.role, "non-grading-rehearsal");
  assert.equal(m17.forwardHandoff.targetModuleId, "m28");
  assert.match(m17.forwardHandoff.boundary, /M18 is a separate open systems branch/i);
  assert.match(m17.forwardHandoff.boundary, /sole academic prerequisite is M17/i);
  assert.match(m17.forwardHandoff.boundary, /M31-to-M18 reader continuation is narrative navigation/i);
  assert.equal(moduleLearningCompanionRelativePath("m17"), "content/course/contracts/companions/m17.v1.json");
  assert.equal(m18.guideBinding.locator, "/guides/17");
  assert.equal(m18.teachingAssistant.role, "supportive-oral-defense");
  assert.equal(m18.studyPartner.role, "non-grading-rehearsal");
  assert.equal(m18.forwardHandoff.targetModuleId, "m19");
  assert.match(m18.forwardHandoff.boundary, /M17 is M18's sole academic prerequisite/i);
  assert.match(m18.forwardHandoff.boundary, /M31-to-M18 reader continuation is narrative reader order/i);
  assert.equal(moduleLearningCompanionRelativePath("m18"), "content/course/contracts/companions/m18.v1.json");
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
  assert.match(m31.studyPartner.rehearsalMove, /M28\/M29\/M30 bridges/u);
  assert.match(m31.studyPartner.rehearsalMove, /four short retrieval prompts across the three M28\/M29\/M30 bridges/u);
  assert.match(m31.studyPartner.rehearsalMove, /conditional probability/u);
  assert.match(m31.studyPartner.rehearsalMove, /support boundary/u);
  assert.match(m31.studyPartner.rehearsalMove, /past history is fixed/u);
  assert.match(m31.studyPartner.rehearsalMove, /0–100 confidence/u);
  assert.match(m31.teachingAssistant.artifactFocus, /0–100 confidence/u);
  assert.equal(m31.forwardHandoff.targetModuleId, "m18");
  assert.equal(moduleLearningCompanionRelativePath("m31"), "content/course/contracts/companions/m31.v1.json");
  assert.match(m32.studyPartner.rehearsalMove, /M12, M17, M24\/M28, M19, or M31/u);
  assert.match(m32.studyPartner.rehearsalMove, /0–100 confidence/u);
  assert.match(m32.teachingAssistant.artifactFocus, /0–100 confidence/u);
  assert.match(m33.studyPartner.rehearsalMove, /M27 all-input proof versus finite trace/u);
  assert.match(m33.studyPartner.rehearsalMove, /0–100 confidence/u);
  assert.match(m34.studyPartner.rehearsalMove, /six retrieval checks/u);
  assert.match(m34.studyPartner.rehearsalMove, /0–100 confidence/u);
  assert.match(m35.studyPartner.rehearsalMove, /claim\/failure probe/u);
  assert.match(m35.studyPartner.rehearsalMove, /0–100 confidence/u);
  assert.match(
    m35.forwardHandoff.carryArtifact,
    /Carry one remaining uncertainty; it is not a mastery claim\./u,
  );
  assert.match(m36.studyPartner.rehearsalMove, /finite average versus population expectation/u);
  assert.match(m36.studyPartner.rehearsalMove, /0–100 confidence/u);
  assert.match(
    m36.forwardHandoff.carryArtifact,
    /Carry one remaining uncertainty; it is not a mastery claim\./u,
  );
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
  const graphM14 = graph.modules.find(({ id }) => id === "m14");
  const graphM15 = graph.modules.find(({ id }) => id === "m15");
  const graphM16 = graph.modules.find(({ id }) => id === "m16");
  const graphM17 = graph.modules.find(({ id }) => id === "m17");
  const graphM19 = graph.modules.find(({ id }) => id === "m19");
  const graphM24 = graph.modules.find(({ id }) => id === "m24");
  assert.equal(graphM12.state.lifecycle, "learner-material-ready");
  assert.equal(graphM12.state.contract.state, "legacy-baseline");
  assert.equal(graphM12.state.release.state, "unrecorded");
  assert.equal(graphM13.state.lifecycle, "learner-material-ready");
  assert.equal(graphM13.state.contract.state, "legacy-baseline");
  assert.equal(graphM13.state.release.state, "unrecorded");
  for (const graphModule of [graphM14, graphM15, graphM16, graphM17]) {
    assert.equal(graphModule.state.lifecycle, "learner-material-ready");
    assert.equal(graphModule.state.contract.state, "legacy-baseline");
    assert.equal(graphModule.state.release.state, "unrecorded");
  }
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
