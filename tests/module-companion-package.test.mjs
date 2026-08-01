import assert from "node:assert/strict";
import test from "node:test";
import { loadCourseGraph } from "../scripts/course-graph.mjs";
import {
  loadModuleCompanionGuides,
  validateModuleCompanionGuides,
} from "../scripts/module-companion-guides.mjs";
import { buildModuleCompanionPackage } from "../lib/module-companion-package-builder.mjs";
import { loadLiveCodexLearningWorkflow } from "../scripts/live-codex-learning-workflow.mjs";

function clone(value) {
  return structuredClone(value);
}

test("module companion guides bind one-to-one to the canonical graph", async () => {
  const [graph, guides] = await Promise.all([
    loadCourseGraph(),
    loadModuleCompanionGuides(),
  ]);
  const report = await validateModuleCompanionGuides(guides, { graph });

  assert.deepEqual(report.summary, {
    guideCount: 36,
    graphModuleCount: 36,
  });
  assert.deepEqual(
    new Set(report.guides.map(({ moduleId }) => moduleId)),
    new Set(graph.modules.map(({ id }) => id)),
  );
});

test("the companion package derives prerequisite and forward-handoff facts from the graph", async () => {
  const [graph, guides, workflow] = await Promise.all([
    loadCourseGraph(),
    loadModuleCompanionGuides(),
    loadLiveCodexLearningWorkflow(),
  ]);
  const m01 = graph.modules.find(({ id }) => id === "m01");
  const guide = guides.guides.find(({ moduleId }) => moduleId === "m01");
  assert.ok(m01);
  assert.ok(guide);

  const packageForM01 = buildModuleCompanionPackage({
    courseModule: m01,
    graphModules: graph.modules,
    guide,
    liveWorkflow: workflow,
  });
  assert.deepEqual(packageForM01.module.academicPrerequisites, []);
  assert.deepEqual(packageForM01.module.declaredForwardHandoff, {
    moduleId: "m02",
    number: 2,
    title: "Functions, Recursion, and Induction",
    availability: "legacy-open",
  });

  const changedGraph = clone(graph.modules);
  changedGraph.find(({ id }) => id === "m01").forwardModuleNumber = 4;
  const changedPackage = buildModuleCompanionPackage({
    courseModule: changedGraph.find(({ id }) => id === "m01"),
    graphModules: changedGraph,
    guide,
    liveWorkflow: workflow,
  });
  assert.equal(changedPackage.module.declaredForwardHandoff.moduleId, "m04");
  assert.equal(changedPackage.module.declaredForwardHandoff.number, 4);
});

test("the TA and Study Partner packets stay distinct, constructive, and bounded", async () => {
  const [graph, guides, workflow] = await Promise.all([
    loadCourseGraph(),
    loadModuleCompanionGuides(),
    loadLiveCodexLearningWorkflow(),
  ]);
  const m04 = graph.modules.find(({ id }) => id === "m04");
  const guide = guides.guides.find(({ moduleId }) => moduleId === "m04");
  assert.ok(m04);
  assert.ok(guide);

  const companion = buildModuleCompanionPackage({
    courseModule: m04,
    graphModules: graph.modules,
    guide,
    liveWorkflow: workflow,
  });
  assert.equal(companion.schemaVersion, 2);
  assert.notEqual(
    companion.teachingAssistant.contextPrompt,
    companion.studyPartner.contextPrompt,
  );
  assert.match(companion.teachingAssistant.contextPrompt, /oral defense/i);
  assert.match(companion.studyPartner.contextPrompt, /non-grading/i);
  assert.doesNotMatch(companion.teachingAssistant.contextPrompt, /pass\/fail verdict/i);
  assert.doesNotMatch(companion.studyPartner.contextPrompt, /pass\/fail verdict/i);
  assert.deepEqual(companion.recordBoundary, {
    portableStartupMode: "keep-local",
    designatedChatMode: "automatic-after-substantive-session",
  });
  assert.deepEqual(
    companion.whiteboardProtocol,
    workflow.whiteboardProtocol.required,
  );
  assert.match(companion.teachingAssistant.contextPrompt, /prose or ASCII fallback/i);
  assert.match(companion.studyPartner.contextPrompt, /language-labelled fenced code/i);
  assert.match(companion.teachingAssistant.contextPrompt, /contract and release verification pending/i);
  assert.doesNotMatch(companion.studyPartner.contextPrompt, /; legacy-open\)/i);
  assert.match(companion.teachingAssistant.contextPrompt, /automatically create at most one concise note/i);
  assert.match(companion.teachingAssistant.contextPrompt, /confirm “records on”/u);
  assert.match(companion.studyPartner.contextPrompt, /names a module or learning topic/i);
  assert.match(companion.studyPartner.contextPrompt, /direct evidence of the successful write/i);
});

test("guide validation fails closed for a missing or forged module guide", async () => {
  const [graph, guides] = await Promise.all([
    loadCourseGraph(),
    loadModuleCompanionGuides(),
  ]);
  const missing = clone(guides);
  missing.guides = missing.guides.filter(({ moduleId }) => moduleId !== "m36");
  await assert.rejects(
    () => validateModuleCompanionGuides(missing, { graph }),
    /exactly one guide for every canonical module/i,
  );

  const forged = clone(guides);
  forged.guides[0].moduleId = "m99";
  await assert.rejects(
    () => validateModuleCompanionGuides(forged, { graph }),
    /unknown moduleId|exactly one guide/i,
  );
});

test("the companion package refuses a workflow that changes the learner-record boundary", async () => {
  const [graph, guides, workflow] = await Promise.all([
    loadCourseGraph(),
    loadModuleCompanionGuides(),
    loadLiveCodexLearningWorkflow(),
  ]);
  const m01 = graph.modules.find(({ id }) => id === "m01");
  const guide = guides.guides.find(({ moduleId }) => moduleId === "m01");
  assert.ok(m01);
  assert.ok(guide);

  const forgedWorkflow = clone(workflow);
  forgedWorkflow.notionSessionNotes.portableStartupMode = "capture-everything";
  assert.throws(
    () =>
      buildModuleCompanionPackage({
        courseModule: m01,
        graphModules: graph.modules,
        guide,
        liveWorkflow: forgedWorkflow,
      }),
    /portable startup mode must remain keep-local/i,
  );

  const unscopedWorkflow = clone(workflow);
  unscopedWorkflow.notionSessionNotes.requiredConditions.pop();
  assert.throws(
    () =>
      buildModuleCompanionPackage({
        courseModule: m01,
        graphModules: graph.modules,
        guide,
        liveWorkflow: unscopedWorkflow,
      }),
    /session-note conditions must preserve designated-chat, privacy, and substantive-session boundaries/i,
  );

  const missingRecordsOnConfirmation = clone(workflow);
  missingRecordsOnConfirmation.notionSessionNotes.recordingAuthorization.activationPhrase = "capture";
  assert.throws(
    () =>
      buildModuleCompanionPackage({
        courseModule: m01,
        graphModules: graph.modules,
        guide,
        liveWorkflow: missingRecordsOnConfirmation,
      }),
    /scoped records-on confirmation/i,
  );
});
