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
  assert.equal(report.startNow.version, 1);
  assert.equal(report.startNow.canBeginBeforeHumanReview, true);
  assert.equal(report.startNow.buildPhaseHumanEvidenceState, "waived");
  assert.deepEqual(report.startNow.entrySteps.map(({ id, owner }) => [id, owner]), [
    ["choose", "learner"],
    ["launch-study-partner", "study-partner"],
    ["make-evidence", "study-partner"],
    ["repair-and-defend", "teaching-assistant"],
    ["record", "learner"],
    ["improve-forward", "learner"],
  ]);
  assert.equal(report.startNow.firstSessionDefaults.preferredStart, "placement-diagnostic");
  assert.equal(report.startNow.firstSessionDefaults.fallbackStart, "M01 Session 1");
  assert.equal(report.startNow.firstSessionDefaults.recordsDefault, "off");
  assert.deepEqual(report.startNow.availabilityBoundary.map(({ route }) => route), [
    "M01-M24 and M27-M30",
    "M25-M26",
    "M31-M36",
  ]);
  assert.ok(report.startNow.evidenceStates.includes("learner-produced-session-evidence"));
  assert.match(report.startNow.claimBoundary, /does not create a grade, mastery claim/u);
  assert.equal(report.moduleLoop.version, 1);
  assert.deepEqual(report.moduleLoop.phases.map(({ id }) => id), [
    "orient",
    "predict-inspect",
    "artifact",
    "repair-defense",
    "record",
    "improve-forward",
  ]);
  assert.deepEqual(report.moduleLoop.sessionRecordFields, [
    "question and prediction with confidence",
    "code, architecture, derivation, diagram, or state-trace observation",
    "smallest evidence artifact and explicit boundary or non-claim",
    "repaired misconception or unresolved uncertainty",
    "retrieval prompt, next action, and cross-role handoff",
  ]);
  assert.equal(report.improvementPolicy.version, 1);
  assert.equal(report.improvementPolicy.cadenceCalibration.afterModuleCount, 3);
  assert.equal(report.notionSessionNotes.portableStartupMode, "keep-local");
  assert.equal(report.notionSessionNotes.designatedChatMode, "automatic-after-substantive-session");
  assert.deepEqual(report.notionSessionNotes.recordingAuthorization, {
    initialState: "require-explicit-records-on-confirmation",
    activationPhrase: "records on",
    closurePhrase: "end session",
    scope: "the current substantive session in that designated chat; say end session to close automatic session-summary authority, then re-confirm records on for a later automatic note; an explicitly requested correction or deletion remains separately authorized",
    renewalRule:
      "A prior records on never carries into a new or ambiguously resumed substantive session; records are off until a fresh visible records on in that session.",
  });
  assert.deepEqual(report.notionSessionNotes.substantiveSession.minimumEvidence, [
    "a named module or learning topic",
    "learner reasoning, a concrete evidence artifact, a misconception, or a counterexample",
    "a learner-controlled next action or cross-role handoff",
  ]);
  assert.equal(report.notionSessionNotes.writeCadence, "at-most-one-concise-note-per-substantive-session");
  assert.ok(report.notionSessionNotes.requiredConditions.includes("the learning conversation is substantive"));
  assert.ok(report.notionSessionNotes.requiredConditions.includes("records are not paused and the material is not marked off-record"));
  assert.equal(report.notionSessionNotes.onUnavailable, "state-write-unverified-and-provide-ready-to-paste-summary");
  assert.deepEqual(report.notionSessionNotes.unavailableNoteTemplate, {
    title: "Notion write unverified — local session note",
    intro: "No Notion write is verified. Copy only this concise, learner-approved summary if useful.",
    fields: [
      "Date / role / module or topic:",
      "Question and prediction:",
      "Whiteboard trace: definition, derivation, code/architecture observation, or counterexample:",
      "Misconception, uncertainty, or boundary:",
      "Smallest next action and cross-role handoff:",
    ],
    privacyReminder:
      "Do not include raw voice, full transcripts, credentials, sensitive data, or off-record material.",
  });
  assert.deepEqual(report.notionSessionNotes.learnerControlAcknowledgements, {
    recordsOn: "Acknowledge records on as chat-level intent; do not claim a write or platform enforcement.",
    endSession: "Acknowledge end session as chat-level intent; stop automatic session-summary creation or updates until a new records on, while honoring an explicitly requested correction or deletion separately.",
    pauseOrOffRecord: "Acknowledge pause records or off-record as chat-level intent; do not claim platform enforcement.",
    confirmedSave: "After direct evidence of a save, report the note title and date, plus a link only if the platform provides one.",
    deletionUnavailable: "If deletion access is unavailable or a result cannot be verified, say no deletion is verified and direct the learner to delete or archive the note in their own Notion UI.",
  });
  assert.deepEqual(report.roles.map(({ id }) => id), ["teaching-assistant", "study-partner"]);
  assert.match(report.roles[0].liveResponsibility, /oral defense/u);
  assert.match(report.roles[1].liveResponsibility, /non-grading/u);
  assert.match(report.whiteboardProtocol.liveQualityPreference, /GPT Live High/u);
  assert.match(report.whiteboardProtocol.liveQualityPreference, /Atlas does not control it/u);
  assert.ok(report.privacyBoundary.excludedFromRecords.includes("raw voice recordings"));
  assert.ok(report.learnerControls.includes("pause records"));
  assert.ok(report.learnerControls.includes("end session"));
  assert.equal(report.learnerGuidePath, "docs/LIVE_CODEX_LEARNING_WORKFLOW.md");
});

test("the live Codex workflow makes record-control acknowledgements and the manual deletion fallback visible", async () => {
  const [guide, promptSource] = await Promise.all([
    readFile(new URL("../docs/LIVE_CODEX_LEARNING_WORKFLOW.md", import.meta.url), "utf8"),
    readFile(new URL("../lib/learning-partner-prompts.ts", import.meta.url), "utf8"),
  ]);

  assert.match(guide, /chat-level intent/u);
  assert.match(guide, /delete or archive.*own Notion UI/u);
  assert.match(guide, /current substantive session/u);
  assert.match(guide, /prior `records on` never carries into a new or ambiguously resumed/u);
  assert.match(guide, /When the boundary is uncertain, records are \*\*off\*\* until\s+the learner makes a fresh visible `records on` request/u);
  assert.match(guide, /say “end session” to close automatic\s+session-summary authorization/iu);
  assert.match(
    guide,
    /explicitly\s+requested\s+correction\s+or\s+deletion\s+remains\s+separately\s+authorized/iu,
  );
  assert.match(guide, /Notion write unverified — local session note/u);
  assert.match(guide, /No Notion write is verified/u);
  assert.doesNotMatch(guide, /No Notion write occurred/u);
  assert.match(promptSource, /chat-level intent/u);
  assert.match(promptSource, /delete or archive.*own Notion UI/u);
  assert.match(promptSource, /close automatic session-summary authority/u);
  assert.match(promptSource, /explicit correction or deletion request remains separately learner-authorized/u);
  assert.match(promptSource, /end session/u);
  assert.match(promptSource, /new or ambiguously resumed substantive session, keep records off/u);
  assert.match(promptSource, /GPT Live High/u);
  const voiceGuide = await readFile(new URL("../docs/LIVE_CODEX_LEARNING_WORKFLOW.md", import.meta.url), "utf8");
  assert.match(voiceGuide, /GPT Live High/u);
  assert.match(promptSource, /unavailableNoteTemplate/u);
});

test("the Learning Partners surface renders the canonical six-phase loop", async () => {
  const page = await readFile(new URL("../app/learning-partners/page.tsx", import.meta.url), "utf8");
  assert.match(page, /liveModuleLoop\.phases\.map/u);
  assert.match(page, /liveStartNow\.entrySteps\.map/u);
  assert.match(page, /Start now · no human gate/u);
  assert.match(page, /A six-phase operating rhythm/u);
  assert.doesNotMatch(page, /<strong>Study Partner:<\/strong> retrieve, explain/u);
});

test("learner-facing policy summaries retain explicit records-on authority", async () => {
  const policySummaries = [
    ["../CONTEXT.md", /only after the learner\s+says `records on` in that exact designated chat/u],
    ["../docs/ARCHITECTURE.md", /only after the learner says\s+`records on` in that exact designated chat/u],
    ["../docs/PRIVACY.md", /only after the learner says `records on`\s+in that exact designated chat/u],
    ["../docs/LEARNER_ROUTE_PLANS.md", /only after the learner says `records on` in that\s+exact designated chat/u],
    ["../docs/GOAL_COMPLIANCE_HISTORY.md", /only after the learner says `records on` in that exact designated chat/u],
    ["../README.md", /only after the learner says `records on`\s+in that exact designated chat/u],
    ["../app/modules/[slug]/ModuleOralDefense.tsx", /only\s+after you say “records on” in that exact designated chat/u],
    ["../lib/learning-partner-prompts.ts", /only after I say “records on” in that exact designated chat/u],
  ];
  const texts = await Promise.all(policySummaries.map(([path]) => readFile(new URL(path, import.meta.url), "utf8")));

  for (const [index, [path, expected]] of policySummaries.entries()) {
    assert.match(texts[index], expected, `${path} must retain the explicit designated-chat recording authority.`);
  }

  for (const [path, expected] of [
    ["../docs/LIVE_CODEX_LEARNING_WORKFLOW.md", /prior `records on` never carries into a new or ambiguously resumed/u],
    ["../app/learning-partners/page.tsx", /prior “records on”\s+never carries into a new or ambiguously resumed/u],
    ["../app/modules/[slug]/ModuleOralDefense.tsx", /prior “records on”\s+never carries into a new or ambiguously resumed/u],
    ["../lib/learning-partner-prompts.ts", /new or ambiguously resumed substantive session, keep records off/u],
  ]) {
    const text = await readFile(new URL(path, import.meta.url), "utf8");
    assert.match(text, expected, `${path} must default an ambiguous resumed session to records-off.`);
  }
});

test("the live Codex workflow fails closed if note authority, cadence, controls, or privacy boundaries drift", async () => {
  const workflow = await loadLiveCodexLearningWorkflow();

  const missingStartNow = structuredClone(workflow);
  delete missingStartNow.startNow;
  await assert.rejects(
    validateLiveCodexLearningWorkflow(missingStartNow),
    /startNow must be an object/u,
  );

  const unsafePortablePrompt = structuredClone(workflow);
  unsafePortablePrompt.notionSessionNotes.portableStartupMode = "capture-everything";
  await assert.rejects(
    validateLiveCodexLearningWorkflow(unsafePortablePrompt),
    /portableStartupMode must remain keep-local/u,
  );

  const qualityControlRegression = structuredClone(workflow);
  qualityControlRegression.whiteboardProtocol.liveQualityPreference = "Atlas controls the voice quality setting.";
  await assert.rejects(
    validateLiveCodexLearningWorkflow(qualityControlRegression),
    /platform-owned GPT Live High quality preference/u,
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

  const persistentAuthorization = structuredClone(workflow);
  persistentAuthorization.notionSessionNotes.recordingAuthorization.scope =
    "that designated chat until records are paused or material is off-record";
  await assert.rejects(
    validateLiveCodexLearningWorkflow(persistentAuthorization),
    /scoped records-on confirmation/u,
  );

  const missingSessionClosure = structuredClone(workflow);
  missingSessionClosure.notionSessionNotes.recordingAuthorization.closurePhrase = "close records";
  await assert.rejects(
    validateLiveCodexLearningWorkflow(missingSessionClosure),
    /scoped records-on confirmation/u,
  );

  const staleSessionAuthorization = structuredClone(workflow);
  staleSessionAuthorization.notionSessionNotes.recordingAuthorization.renewalRule =
    "A prior records on remains active until the learner pauses records.";
  await assert.rejects(
    validateLiveCodexLearningWorkflow(staleSessionAuthorization),
    /scoped records-on confirmation/u,
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

  const vagueUnavailableNote = structuredClone(workflow);
  vagueUnavailableNote.notionSessionNotes.unavailableNoteTemplate.fields.pop();
  await assert.rejects(
    validateLiveCodexLearningWorkflow(vagueUnavailableNote),
    /ready-to-paste unavailable-write note template/u,
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

  const missingEndSession = structuredClone(workflow);
  missingEndSession.learnerControls = missingEndSession.learnerControls.filter((value) => value !== "end session");
  await assert.rejects(
    validateLiveCodexLearningWorkflow(missingEndSession),
    /learnerControls must preserve the reviewed values and order/u,
  );

  const missingDeletionFallback = structuredClone(workflow);
  delete missingDeletionFallback.notionSessionNotes.learnerControlAcknowledgements;
  await assert.rejects(
    validateLiveCodexLearningWorkflow(missingDeletionFallback),
    /learnerControlAcknowledgements must preserve the reviewed values and order/u,
  );

  const missingModulePhase = structuredClone(workflow);
  missingModulePhase.moduleLoop.phases.pop();
  await assert.rejects(
    validateLiveCodexLearningWorkflow(missingModulePhase),
    /moduleLoop must declare exactly six connected phases/u,
  );

  const bypassedDependency = structuredClone(workflow);
  bypassedDependency.improvementPolicy.whenMisconceptionRepeats[2] = "skip the dependency and continue";
  await assert.rejects(
    validateLiveCodexLearningWorkflow(bypassedDependency),
    /improvementPolicy\.whenMisconceptionRepeats must preserve the reviewed values and order/u,
  );
});
