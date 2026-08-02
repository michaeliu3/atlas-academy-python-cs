import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
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
  assert.deepEqual(report.notionSessionNotes.recordingAuthorization, {
    initialState: "require-explicit-records-on-confirmation",
    activationPhrase: "records on",
    scope: "that designated chat until records are paused or material is off-record",
  });
  assert.deepEqual(report.notionSessionNotes.substantiveSession.minimumEvidence, [
    "a named module or learning topic",
    "learner reasoning, a concrete evidence artifact, a misconception, or a counterexample",
    "a learner-controlled next action or cross-role handoff",
  ]);
  assert.equal(report.notionSessionNotes.writeCadence, "at-most-one-concise-note-per-substantive-session");
  assert.ok(report.notionSessionNotes.requiredConditions.includes("the learning conversation is substantive"));
  assert.ok(report.notionSessionNotes.requiredConditions.includes("records are not paused and the material is not marked off-record"));
  assert.equal(report.notionSessionNotes.onUnavailable, "state-unavailable-and-keep-summary-in-chat");
  assert.deepEqual(report.notionSessionNotes.learnerControlAcknowledgements, {
    recordsOn: "Acknowledge records on as chat-level intent; do not claim a write or platform enforcement.",
    pauseOrOffRecord: "Acknowledge pause records or off-record as chat-level intent; do not claim platform enforcement.",
    confirmedSave: "After direct evidence of a save, report the note title and date, plus a link only if the platform provides one.",
    deletionUnavailable: "If deletion access is unavailable, say deletion did not occur and direct the learner to delete or archive the note in their own Notion UI.",
  });
  assert.deepEqual(report.roles.map(({ id }) => id), ["teaching-assistant", "study-partner"]);
  assert.match(report.roles[0].liveResponsibility, /oral defense/u);
  assert.match(report.roles[1].liveResponsibility, /non-grading/u);
  assert.ok(report.privacyBoundary.excludedFromRecords.includes("raw voice recordings"));
  assert.ok(report.learnerControls.includes("pause records"));
  assert.equal(report.learnerGuidePath, "docs/LIVE_CODEX_LEARNING_WORKFLOW.md");
});

test("the live Codex workflow makes record-control acknowledgements and the manual deletion fallback visible", async () => {
  const [guide, promptSource] = await Promise.all([
    readFile(new URL("../docs/LIVE_CODEX_LEARNING_WORKFLOW.md", import.meta.url), "utf8"),
    readFile(new URL("../lib/learning-partner-prompts.ts", import.meta.url), "utf8"),
  ]);

  assert.match(guide, /chat-level intent/u);
  assert.match(guide, /delete or archive.*own Notion UI/u);
  assert.match(promptSource, /chat-level intent/u);
  assert.match(promptSource, /delete or archive.*own Notion UI/u);
});

test("learner-facing policy summaries retain explicit records-on authority", async () => {
  const policySummaries = [
    ["../CONTEXT.md", /only after the learner\s+says `records on` in that exact designated chat/u],
    ["../docs/ARCHITECTURE.md", /only after the learner says\s+`records on` in that exact designated chat/u],
    ["../docs/PRIVACY.md", /only after the learner says `records on`\s+in that exact designated chat/u],
    ["../docs/LEARNER_ROUTE_PLANS.md", /only after the learner says `records on` in that\s+exact designated chat/u],
    ["../docs/GOAL_COMPLIANCE_MATRIX.md", /only after the learner says `records on` in that exact designated chat/u],
    ["../README.md", /only after the learner says `records on`\s+in that exact designated chat/u],
    ["../app/modules/[slug]/ModuleOralDefense.tsx", /only\s+after you say “records on” in that exact designated chat/u],
    ["../lib/learning-partner-prompts.ts", /only after I say “records on” in that exact designated chat/u],
  ];
  const texts = await Promise.all(policySummaries.map(([path]) => readFile(new URL(path, import.meta.url), "utf8")));

  for (const [index, [path, expected]] of policySummaries.entries()) {
    assert.match(texts[index], expected, `${path} must retain the explicit designated-chat recording authority.`);
  }
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

  const missingRecordsOnConfirmation = structuredClone(workflow);
  missingRecordsOnConfirmation.notionSessionNotes.recordingAuthorization.activationPhrase = "capture";
  await assert.rejects(
    validateLiveCodexLearningWorkflow(missingRecordsOnConfirmation),
    /scoped records-on confirmation/u,
  );

  const vagueSubstantiveSession = structuredClone(workflow);
  vagueSubstantiveSession.notionSessionNotes.substantiveSession.minimumEvidence.pop();
  await assert.rejects(
    validateLiveCodexLearningWorkflow(vagueSubstantiveSession),
    /substantiveSession\.minimumEvidence must preserve the reviewed values and order/u,
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

  const missingDeletionFallback = structuredClone(workflow);
  delete missingDeletionFallback.notionSessionNotes.learnerControlAcknowledgements;
  await assert.rejects(
    validateLiveCodexLearningWorkflow(missingDeletionFallback),
    /learnerControlAcknowledgements must preserve the reviewed values and order/u,
  );
});
