import assert from "node:assert/strict";
import test from "node:test";
import {
  liveCodexLearningWorkflowRelativePath,
  loadLiveCodexLearningWorkflow,
  validateLiveCodexLearningWorkflow,
} from "../scripts/live-codex-learning-workflow.mjs";

test("the live Codex workflow defaults to local notes and separates the two partner roles", async () => {
  const workflow = await loadLiveCodexLearningWorkflow();
  const report = await validateLiveCodexLearningWorkflow(workflow);

  assert.equal(report.workflowPath, liveCodexLearningWorkflowRelativePath);
  assert.equal(report.delivery.portalRuntimeIntegration, "none");
  assert.equal(report.delivery.defaultRecordMode, "keep-local");
  assert.equal(report.delivery.enabledRecordMode, "configured-notion-session-note");
  assert.equal(report.delivery.writeCadence, "at-most-one-concise-note-per-substantive-session");
  assert.deepEqual(report.roles.map(({ id }) => id), ["teaching-assistant", "study-partner"]);
  assert.match(report.roles[0].liveResponsibility, /oral defense/u);
  assert.match(report.roles[1].liveResponsibility, /non-grading/u);
  assert.ok(report.privacyBoundary.excludedFromRecords.includes("raw voice recordings"));
  assert.ok(report.learnerControls.includes("pause records"));
  assert.equal(report.learnerGuidePath, "docs/LIVE_CODEX_LEARNING_WORKFLOW.md");
});

test("the live Codex workflow fails closed if record activation, cadence, controls, or privacy boundaries drift", async () => {
  const workflow = await loadLiveCodexLearningWorkflow();

  const automaticByDefault = structuredClone(workflow);
  automaticByDefault.delivery.defaultRecordMode = "configured-notion-session-note";
  await assert.rejects(
    validateLiveCodexLearningWorkflow(automaticByDefault),
    /defaultRecordMode must remain keep-local/u,
  );

  const unscopedWrite = structuredClone(workflow);
  unscopedWrite.delivery.writeCadence = "one-note-per-exchange";
  await assert.rejects(
    validateLiveCodexLearningWorkflow(unscopedWrite),
    /limit writes to one concise note per substantive session/u,
  );

  const missingActivation = structuredClone(workflow);
  missingActivation.delivery.requiredActivation.pop();
  await assert.rejects(
    validateLiveCodexLearningWorkflow(missingActivation),
    /requiredActivation must preserve the reviewed values and order/u,
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
