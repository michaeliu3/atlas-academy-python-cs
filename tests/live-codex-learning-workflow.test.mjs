import assert from "node:assert/strict";
import test from "node:test";
import {
  liveCodexLearningWorkflowRelativePath,
  loadLiveCodexLearningWorkflow,
  validateLiveCodexLearningWorkflow,
} from "../scripts/live-codex-learning-workflow.mjs";

test("the live Codex workflow keeps portal isolation while authorizing designated automatic session notes", async () => {
  const workflow = await loadLiveCodexLearningWorkflow();
  const report = await validateLiveCodexLearningWorkflow(workflow);

  assert.equal(report.workflowPath, liveCodexLearningWorkflowRelativePath);
  assert.equal(report.delivery.portalRuntimeIntegration, "none");
  assert.equal(report.notionSessionNotes.portableStartupMode, "keep-local");
  assert.equal(report.notionSessionNotes.designatedChatMode, "automatic-after-substantive-session");
  assert.equal(report.notionSessionNotes.writeCadence, "at-most-one-concise-note-per-substantive-session");
  assert.ok(report.notionSessionNotes.requiredConditions.includes("the learning conversation is substantive"));
  assert.ok(report.notionSessionNotes.requiredConditions.includes("records are not paused and the material is not marked off-record"));
  assert.equal(report.notionSessionNotes.onUnavailable, "state-unavailable-and-keep-summary-in-chat");
  assert.deepEqual(report.roles.map(({ id }) => id), ["teaching-assistant", "study-partner"]);
  assert.match(report.roles[0].liveResponsibility, /oral defense/u);
  assert.match(report.roles[1].liveResponsibility, /non-grading/u);
  assert.ok(report.privacyBoundary.excludedFromRecords.includes("raw voice recordings"));
  assert.ok(report.learnerControls.includes("pause records"));
  assert.equal(report.learnerGuidePath, "docs/LIVE_CODEX_LEARNING_WORKFLOW.md");
});

test("the live Codex workflow fails closed if note authority, cadence, controls, or privacy boundaries drift", async () => {
  const workflow = await loadLiveCodexLearningWorkflow();

  const unsafePortablePrompt = structuredClone(workflow);
  unsafePortablePrompt.notionSessionNotes.portableStartupMode = "capture-everything";
  await assert.rejects(
    validateLiveCodexLearningWorkflow(unsafePortablePrompt),
    /portableStartupMode must remain keep-local/u,
  );

  const manualModeRegression = structuredClone(workflow);
  manualModeRegression.notionSessionNotes.designatedChatMode = "configured-notion-session-note";
  await assert.rejects(
    validateLiveCodexLearningWorkflow(manualModeRegression),
    /designatedChatMode must require automatic concise notes/u,
  );

  const unscopedWrite = structuredClone(workflow);
  unscopedWrite.notionSessionNotes.writeCadence = "one-note-per-exchange";
  await assert.rejects(
    validateLiveCodexLearningWorkflow(unscopedWrite),
    /limit writes to one concise note per substantive session/u,
  );

  const missingActivation = structuredClone(workflow);
  missingActivation.notionSessionNotes.requiredConditions.pop();
  await assert.rejects(
    validateLiveCodexLearningWorkflow(missingActivation),
    /requiredConditions must preserve the reviewed values and order/u,
  );

  const unprovenWriteClaim = structuredClone(workflow);
  unprovenWriteClaim.claimBoundary.successfulWriteRequiresDirectEvidence = false;
  await assert.rejects(
    validateLiveCodexLearningWorkflow(unprovenWriteClaim),
    /claimBoundary must require platform acceptance evidence/u,
  );

  const transcriptLeak = structuredClone(workflow);
  transcriptLeak.privacyBoundary.excludedFromRecords = transcriptLeak.privacyBoundary.excludedFromRecords.filter(
    (value) => value !== "full chat transcripts",
  );
  await assert.rejects(
    validateLiveCodexLearningWorkflow(transcriptLeak),
    /excludedFromRecords must preserve the reviewed values and order/u,
  );

  const missingPause = structuredClone(workflow);
  missingPause.learnerControls = missingPause.learnerControls.filter((value) => value !== "pause records");
  await assert.rejects(
    validateLiveCodexLearningWorkflow(missingPause),
    /learnerControls must preserve the reviewed values and order/u,
  );
});
