import { lstat, readFile } from "node:fs/promises";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const defaultSiteRoot = resolve(scriptDirectory, "..");

export const liveCodexLearningWorkflowRelativePath =
  "content/course/live-codex-learning-workflow.v2.json";
export const liveCodexLearningWorkflowGuideRelativePath =
  "docs/LIVE_CODEX_LEARNING_WORKFLOW.md";

const requiredNoteConditions = [
  "this is the designated Teaching Assistant or Study Partner chat",
  "the configured private Notion destination is reachable",
  "the learning conversation is substantive",
  "records are not paused and the material is not marked off-record",
];
const requiredRecordingAuthorization = {
  initialState: "require-explicit-records-on-confirmation",
  activationPhrase: "records on",
  closurePhrase: "end session",
  scope: "the current substantive session in that designated chat; say end session to close automatic session-summary authority, then re-confirm records on for a later automatic note; an explicitly requested correction or deletion remains separately authorized",
  renewalRule:
    "A prior records on never carries into a new or ambiguously resumed substantive session; records are off until a fresh visible records on in that session.",
};
const requiredSubstantiveEvidence = [
  "a named module or learning topic",
  "learner reasoning, a concrete evidence artifact, a misconception, or a counterexample",
  "a learner-controlled next action or cross-role handoff",
];
const requiredLearnerControlAcknowledgements = {
  recordsOn: "Acknowledge records on as chat-level intent; do not claim a write or platform enforcement.",
  endSession: "Acknowledge end session as chat-level intent; stop automatic session-summary creation or updates until a new records on, while honoring an explicitly requested correction or deletion separately.",
  pauseOrOffRecord: "Acknowledge pause records or off-record as chat-level intent; do not claim platform enforcement.",
  confirmedSave: "After direct evidence of a save, report the note title and date, plus a link only if the platform provides one.",
  deletionUnavailable:
    "If deletion access is unavailable or a result cannot be verified, say no deletion is verified and direct the learner to delete or archive the note in their own Notion UI.",
};
const requiredRecordFields = [
  "date, role, module/topic, and learner question",
  "key definition, derivation, code/architecture trace, or whiteboard snapshot",
  "prediction, evidence, misconception, counterexample, uncertainty, and next action",
  "Teaching Assistant oral-defense evidence or Study Partner discussion/rehearsal handoff",
];
const requiredUnavailableNoteTemplate = {
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
};
const requiredRoles = [
  {
    id: "teaching-assistant",
    liveResponsibility: "first-principles teaching and the supportive post-module oral defense",
    recordFocus: "oral-defense prompt, repair, transfer, uncertainty, and constructive next bridge",
  },
  {
    id: "study-partner",
    liveResponsibility: "non-grading concept discussion, retrieval, rehearsal, and handoff preparation",
    recordFocus: "discussion, rehearsal, uncertainty, and focused Teaching Assistant handoff",
  },
];
const requiredWhiteboardRules = [
  "supported display math with defined symbols",
  "language-labelled fenced code with explicit state traces",
  "prose or ASCII fallback for math, code, and diagrams",
  "no speech-only or visual-only explanation",
];
const requiredLiveQualityPreference =
  "If the exact live chat offers a setting labelled GPT Live High, select or request it for voice; otherwise prefer the highest available quality/reasoning setting. The learner and platform own that setting; Atlas does not control it.";
const requiredExclusions = [
  "raw voice recordings",
  "full chat transcripts",
  "credentials, keys, or tokens",
  "sensitive personal data",
  "off-record material",
];
const requiredControls = [
  "end session",
  "pause records",
  "off-record",
  "correct a saved note",
  "delete a saved note",
];

const requiredModuleLoopPhases = [
  {
    id: "orient",
    label: "Orient",
    role: "study-partner",
    objective: "Name the graph-approved module, session, prerequisite, and one learner question.",
    requiredOutputs: ["module and session", "prerequisite or bridge", "learner question"],
    nextPhase: "predict-inspect",
  },
  {
    id: "predict-inspect",
    label: "Predict and inspect",
    role: "study-partner",
    objective: "State a prediction and confidence before reading the code, diagram, derivation, or architecture trace; then change one premise.",
    requiredOutputs: ["prediction and confidence", "inspected trace", "one changed premise"],
    nextPhase: "artifact",
  },
  {
    id: "artifact",
    label: "Make one artifact",
    role: "study-partner",
    objective: "Create the smallest useful state trace, counterexample, proof step, numerical check, design card, or debugging note.",
    requiredOutputs: ["smallest evidence artifact", "observation", "boundary or non-claim"],
    nextPhase: "repair-defense",
  },
  {
    id: "repair-defense",
    label: "Repair and defend",
    role: "teaching-assistant",
    objective: "Repair one fragile model and conduct an encouraging oral defense with a changed-premise or counterexample and a transfer question.",
    requiredOutputs: ["repaired model", "oral-defense synthesis", "transfer response"],
    nextPhase: "record",
  },
  {
    id: "record",
    label: "Record only what is useful",
    role: "designated-chat",
    objective: "After a fresh records-on confirmation, keep at most one concise learner-approved note for the substantive session; otherwise keep the fallback local.",
    requiredOutputs: ["question and prediction", "compact whiteboard or code trace", "misconception or uncertainty", "next action and handoff"],
    nextPhase: "improve-forward",
  },
  {
    id: "improve-forward",
    label: "Retrieve and improve",
    role: "learner",
    objective: "Schedule one retrieval prompt, carry the smallest next action into the next session, and bridge a repeated misconception instead of silently skipping it.",
    requiredOutputs: ["retrieval prompt and due date", "uncertainty or repair", "forward-module handoff"],
    nextPhase: null,
  },
];
const requiredStartNowEntrySteps = [
  ["choose", "learner"],
  ["launch-study-partner", "study-partner"],
  ["make-evidence", "study-partner"],
  ["repair-and-defend", "teaching-assistant"],
  ["record", "learner"],
  ["improve-forward", "learner"],
];
const requiredStartNowAvailabilityRoutes = ["M01-M24 and M27-M30", "M25-M26", "M31-M36"];
const requiredStartNowEvidenceStates = [
  "waived-build-human-review",
  "automated-structural-evidence",
  "learner-produced-session-evidence",
  "platform-observed-evidence",
  "human-reviewed-release-evidence",
];
const requiredStartNowClaimBoundary =
  "Starting and completing a conversation creates learning evidence and improvement signals; it does not create a grade, mastery claim, route unlock, release decision, university equivalence, or human-review evidence.";
const requiredModuleLoopRecordFields = [
  "question and prediction with confidence",
  "code, architecture, derivation, diagram, or state-trace observation",
  "smallest evidence artifact and explicit boundary or non-claim",
  "repaired misconception or unresolved uncertainty",
  "retrieval prompt, next action, and cross-role handoff",
];
const requiredModuleLoopCompletionBoundary =
  "Completing the loop creates learning evidence for the next step; it is not a pass/fail grade, route unlock, release decision, mastery claim, or university-equivalence claim.";
const requiredImprovementAfterEachSession = [
  "retain one honest uncertainty or repaired misconception",
  "schedule one retrieval prompt with a due date",
  "carry one learner-controlled next action or cross-role handoff",
];
const requiredImprovementWhenMisconceptionRepeats = [
  "name the prerequisite bridge",
  "change one example, input, premise, or representation",
  "slow the pace or reschedule the module rather than silently bypassing the dependency",
];
const requiredImprovementInspect = [
  "confidence compared with observed reasoning evidence",
  "retrieval outcomes and repeated repair patterns",
  "time spent and unresolved prerequisite bridges",
];
const requiredImprovementPossibleActions = [
  "adjust the pace between the 60-, 90-, and 180-day routes",
  "add a bridge example or targeted retrieval prompt",
  "carry a bounded uncertainty into the next Teaching Assistant handoff",
];
const requiredImprovementCourseChangeBoundary =
  "Learner records can propose a content or prompt improvement, but they never silently mutate the canonical graph or release state; a course change requires an explicit reviewed Git commit and regenerated evidence.";

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function text(value) {
  return typeof value === "string" ? value.trim() : "";
}

function arraysMatch(left, right) {
  return Array.isArray(left) && left.length === right.length && left.every((value, index) => value === right[index]);
}

function repositoryPath(siteRoot, path) {
  return relative(siteRoot, path).replaceAll("\\", "/");
}

function isPathWithinSite(siteRoot, path) {
  const fromRoot = repositoryPath(siteRoot, path);
  return fromRoot !== "" && !fromRoot.startsWith("../") && !fromRoot.includes(":");
}

function requiredStringArray(value, label, expected, errors) {
  if (!arraysMatch(value, expected)) {
    errors.push(`${label} must preserve the reviewed values and order.`);
  }
}

async function validateGuide(path, siteRoot, errors) {
  const absolutePath = resolve(siteRoot, path);
  if (
    !isPathWithinSite(siteRoot, absolutePath) ||
    repositoryPath(siteRoot, absolutePath) !== liveCodexLearningWorkflowGuideRelativePath
  ) {
    errors.push(`Live Codex workflow learnerGuidePath must be ${liveCodexLearningWorkflowGuideRelativePath}.`);
    return null;
  }
  const stats = await lstat(absolutePath).catch(() => null);
  if (!stats || !stats.isFile() || stats.isSymbolicLink()) {
    errors.push("Live Codex workflow learner guide must be a regular checked-in documentation file.");
    return null;
  }
  const guide = await readFile(absolutePath, "utf8");
  for (const marker of [
    "<!-- live-codex-workflow: boundaries -->",
    "<!-- live-codex-workflow: activation -->",
    "<!-- live-codex-workflow: controls -->",
    "<!-- live-codex-workflow: module-loop -->",
  ]) {
    if (!guide.includes(marker)) {
      errors.push(`Live Codex workflow learner guide is missing the ${marker} marker.`);
    }
  }
  if (!guide.includes("portable copyable prompt stays") || !guide.includes("`keep local`")) {
    errors.push("Live Codex workflow learner guide must distinguish the portable local default.");
  }
  if (!guide.includes("automatic concise Notion note")) {
    errors.push("Live Codex workflow learner guide must name the designated-chat automatic note policy.");
  }
  if (!/at\s+most\s+one\s+concise\s+note\s+for\s+the\s+current\s+substantive\s+session/u.test(guide)) {
    errors.push("Live Codex workflow learner guide must state the session-level write cadence.");
  }
  if (!guide.includes("say “records on”") || !guide.includes("say “end session”") || !guide.includes("all three are present")) {
    errors.push("Live Codex workflow learner guide must define recording activation and a substantive-session threshold.");
  }
  if (!/A prior `records on` never carries into a new or ambiguously resumed\s+substantive session\. When the boundary is uncertain, records are \*\*off\*\* until\s+the learner makes a fresh visible `records on` request/u.test(guide)) {
    errors.push("Live Codex workflow learner guide must require fresh records-on intent when a session is new or ambiguous.");
  }
  if (!guide.includes("direct evidence")) {
    errors.push("Live Codex workflow learner guide must retain the direct-evidence claim boundary.");
  }
  const guideLower = guide.toLowerCase();
  if (!guideLower.includes("six-phase module loop") || !guideLower.includes("after three modules") || !guideLower.includes("never silently skip")) {
    errors.push("Live Codex workflow learner guide must expose the six-phase record-and-improve loop.");
  }
  return absolutePath;
}

export function liveCodexLearningWorkflowPath(siteRoot = defaultSiteRoot) {
  return resolve(siteRoot, liveCodexLearningWorkflowRelativePath);
}

export async function loadLiveCodexLearningWorkflow(siteRoot = defaultSiteRoot) {
  return JSON.parse(await readFile(liveCodexLearningWorkflowPath(siteRoot), "utf8"));
}

export async function validateLiveCodexLearningWorkflow(
  workflow,
  { siteRoot = defaultSiteRoot } = {},
) {
  const errors = [];
  if (!isPlainObject(workflow)) {
    throw new Error("Live Codex learning workflow validation failed:\n- workflow must be an object.");
  }
  if (
    workflow.schemaVersion !== 2 ||
    workflow.workflowVersion !== "v2" ||
    workflow.kind !== "atlas-live-codex-learning-workflow"
  ) {
    errors.push("Live Codex workflow must use schemaVersion 2, workflowVersion v2, and the expected kind.");
  }
  if (text(workflow.title) === "" || text(workflow.purpose) === "") {
    errors.push("Live Codex workflow must define a non-empty title and purpose.");
  }

  const delivery = isPlainObject(workflow.delivery) ? workflow.delivery : null;
  if (!delivery) {
    errors.push("Live Codex workflow delivery must be an object.");
  } else {
    if (delivery.portalRuntimeIntegration !== "none") {
      errors.push("Live Codex workflow portalRuntimeIntegration must remain none.");
    }
    if (delivery.chatSurface !== "user-designated-platform-chat") {
      errors.push("Live Codex workflow must keep the user-designated platform-chat boundary.");
    }
    if (text(delivery.learnerGuidePath) === "") {
      errors.push("Live Codex workflow delivery must declare learnerGuidePath.");
    }
  }

  const startNow = isPlainObject(workflow.startNow) ? workflow.startNow : null;
  if (!startNow) {
    errors.push("Live Codex workflow startNow must be an object so the learner can begin without human review.");
  } else {
    if (startNow.version !== 1 || text(startNow.purpose) === "") {
      errors.push("Live Codex workflow startNow must declare version 1 and a non-empty purpose.");
    }
    if (startNow.canBeginBeforeHumanReview !== true || startNow.buildPhaseHumanEvidenceState !== "waived") {
      errors.push("Live Codex workflow startNow must allow study to begin while build-phase human-only evidence is waived.");
    }
    if (!Array.isArray(startNow.entrySteps) || startNow.entrySteps.length !== requiredStartNowEntrySteps.length) {
      errors.push("Live Codex workflow startNow must declare exactly six entry steps.");
    } else {
      for (const [index, [expectedId, expectedOwner]] of requiredStartNowEntrySteps.entries()) {
        const actual = startNow.entrySteps[index];
        if (
          !isPlainObject(actual) ||
          actual.id !== expectedId ||
          actual.owner !== expectedOwner ||
          text(actual.label) === "" ||
          text(actual.action) === "" ||
          text(actual.output) === ""
        ) {
          errors.push(`Live Codex workflow startNow entry step ${expectedId} must preserve its owner and actionable output.`);
        }
      }
    }
    const firstSessionDefaults = isPlainObject(startNow.firstSessionDefaults)
      ? startNow.firstSessionDefaults
      : null;
    if (
      !firstSessionDefaults ||
      firstSessionDefaults.preferredStart !== "placement-diagnostic" ||
      firstSessionDefaults.fallbackStart !== "M01 Session 1" ||
      text(firstSessionDefaults.starterRequest) === "" ||
      firstSessionDefaults.recordsDefault !== "off"
    ) {
      errors.push("Live Codex workflow startNow must provide a placement-first, records-off first-session default.");
    }
    if (!Array.isArray(startNow.availabilityBoundary) || startNow.availabilityBoundary.length !== requiredStartNowAvailabilityRoutes.length) {
      errors.push("Live Codex workflow startNow must distinguish the three learner availability boundaries.");
    } else {
      for (const [index, route] of requiredStartNowAvailabilityRoutes.entries()) {
        const actual = startNow.availabilityBoundary[index];
        if (!isPlainObject(actual) || actual.route !== route || text(actual.delivery) === "" || text(actual.claim) === "") {
          errors.push(`Live Codex workflow startNow availability boundary ${route} must declare delivery and claim limits.`);
        }
      }
    }
    requiredStringArray(startNow.evidenceStates, "Live Codex workflow startNow.evidenceStates", requiredStartNowEvidenceStates, errors);
    if (startNow.claimBoundary !== requiredStartNowClaimBoundary) {
      errors.push("Live Codex workflow startNow claimBoundary must preserve the start-now evidence boundary.");
    }
  }

  const notionSessionNotes = isPlainObject(workflow.notionSessionNotes)
    ? workflow.notionSessionNotes
    : null;
  if (!notionSessionNotes) {
    errors.push("Live Codex workflow notionSessionNotes must be an object.");
  } else {
    if (notionSessionNotes.portableStartupMode !== "keep-local") {
      errors.push("Live Codex workflow portableStartupMode must remain keep-local.");
    }
    if (notionSessionNotes.designatedChatMode !== "automatic-after-substantive-session") {
      errors.push("Live Codex workflow designatedChatMode must require automatic concise notes only after substantive learning.");
    }
    const recordingAuthorization = notionSessionNotes.recordingAuthorization;
    if (
      !isPlainObject(recordingAuthorization) ||
      recordingAuthorization.initialState !== requiredRecordingAuthorization.initialState ||
      recordingAuthorization.activationPhrase !== requiredRecordingAuthorization.activationPhrase ||
      recordingAuthorization.closurePhrase !== requiredRecordingAuthorization.closurePhrase ||
      recordingAuthorization.scope !== requiredRecordingAuthorization.scope ||
      recordingAuthorization.renewalRule !== requiredRecordingAuthorization.renewalRule
    ) {
      errors.push("Live Codex workflow must require a scoped records-on confirmation before automatic notes.");
    }
    const substantiveSession = notionSessionNotes.substantiveSession;
    if (!isPlainObject(substantiveSession)) {
      errors.push("Live Codex workflow must define a substantive-session threshold.");
    } else {
      requiredStringArray(
        substantiveSession.minimumEvidence,
        "Live Codex workflow substantiveSession.minimumEvidence",
        requiredSubstantiveEvidence,
        errors,
      );
    }
    requiredStringArray(
      notionSessionNotes.requiredConditions,
      "Live Codex workflow requiredConditions",
      requiredNoteConditions,
      errors,
    );
    if (notionSessionNotes.writeCadence !== "at-most-one-concise-note-per-substantive-session") {
      errors.push("Live Codex workflow must limit writes to one concise note per substantive session.");
    }
    if (notionSessionNotes.onUnavailable !== "state-write-unverified-and-provide-ready-to-paste-summary") {
      errors.push("Live Codex workflow must state unverified writes plainly and provide a ready-to-paste local summary.");
    }
    const unavailableNoteTemplate = notionSessionNotes.unavailableNoteTemplate;
    if (
      !isPlainObject(unavailableNoteTemplate) ||
      unavailableNoteTemplate.title !== requiredUnavailableNoteTemplate.title ||
      unavailableNoteTemplate.intro !== requiredUnavailableNoteTemplate.intro ||
      !arraysMatch(unavailableNoteTemplate.fields, requiredUnavailableNoteTemplate.fields) ||
      unavailableNoteTemplate.privacyReminder !== requiredUnavailableNoteTemplate.privacyReminder
    ) {
      errors.push("Live Codex workflow must preserve the bounded ready-to-paste unavailable-write note template.");
    }
    const learnerControlAcknowledgements = notionSessionNotes.learnerControlAcknowledgements;
    if (
      !isPlainObject(learnerControlAcknowledgements) ||
      Object.keys(learnerControlAcknowledgements).length !== Object.keys(requiredLearnerControlAcknowledgements).length ||
      Object.entries(requiredLearnerControlAcknowledgements).some(
        ([key, value]) => learnerControlAcknowledgements[key] !== value,
      )
    ) {
      errors.push(
        "Live Codex workflow learnerControlAcknowledgements must preserve the reviewed values and order.",
      );
    }
    requiredStringArray(
      notionSessionNotes.recordFields,
      "Live Codex workflow recordFields",
      requiredRecordFields,
      errors,
    );
  }

  if (!Array.isArray(workflow.roles) || workflow.roles.length !== requiredRoles.length) {
    errors.push("Live Codex workflow must declare exactly the two bounded partner roles.");
  } else {
    for (const [index, expected] of requiredRoles.entries()) {
      const actual = workflow.roles[index];
      if (!isPlainObject(actual) || actual.id !== expected.id || actual.liveResponsibility !== expected.liveResponsibility || actual.recordFocus !== expected.recordFocus) {
        errors.push(`Live Codex workflow role ${expected.id} must preserve its reviewed responsibility and record focus.`);
      }
    }
  }

  const whiteboardProtocol = isPlainObject(workflow.whiteboardProtocol) ? workflow.whiteboardProtocol : null;
  if (!whiteboardProtocol) {
    errors.push("Live Codex workflow whiteboardProtocol must be an object.");
  } else {
    requiredStringArray(whiteboardProtocol.required, "Live Codex workflow whiteboardProtocol.required", requiredWhiteboardRules, errors);
    if (whiteboardProtocol.liveQualityPreference !== requiredLiveQualityPreference) {
      errors.push("Live Codex workflow must preserve the platform-owned GPT Live High quality preference.");
    }
  }

  const moduleLoop = isPlainObject(workflow.moduleLoop) ? workflow.moduleLoop : null;
  if (!moduleLoop || moduleLoop.version !== 1 || text(moduleLoop.purpose) === "") {
    errors.push("Live Codex workflow moduleLoop must declare version 1 and a non-empty purpose.");
  } else {
    if (!Array.isArray(moduleLoop.phases) || moduleLoop.phases.length !== requiredModuleLoopPhases.length) {
      errors.push("Live Codex workflow moduleLoop must declare exactly six connected phases.");
    } else {
      for (const [index, expected] of requiredModuleLoopPhases.entries()) {
        const actual = moduleLoop.phases[index];
        if (
          !isPlainObject(actual) ||
          actual.id !== expected.id ||
          actual.label !== expected.label ||
          actual.role !== expected.role ||
          actual.objective !== expected.objective ||
          actual.nextPhase !== expected.nextPhase
        ) {
          errors.push(`Live Codex workflow moduleLoop phase ${expected.id} must preserve its reviewed role, objective, and transition.`);
          continue;
        }
        requiredStringArray(
          actual.requiredOutputs,
          `Live Codex workflow moduleLoop phase ${expected.id}.requiredOutputs`,
          expected.requiredOutputs,
          errors,
        );
      }
    }
    requiredStringArray(
      moduleLoop.sessionRecordFields,
      "Live Codex workflow moduleLoop.sessionRecordFields",
      requiredModuleLoopRecordFields,
      errors,
    );
    if (moduleLoop.completionBoundary !== requiredModuleLoopCompletionBoundary) {
      errors.push("Live Codex workflow moduleLoop completionBoundary must preserve the non-grading claim boundary.");
    }
  }

  const improvementPolicy = isPlainObject(workflow.improvementPolicy) ? workflow.improvementPolicy : null;
  if (!improvementPolicy || improvementPolicy.version !== 1) {
    errors.push("Live Codex workflow improvementPolicy must declare version 1.");
  } else {
    requiredStringArray(
      improvementPolicy.afterEachSession,
      "Live Codex workflow improvementPolicy.afterEachSession",
      requiredImprovementAfterEachSession,
      errors,
    );
    requiredStringArray(
      improvementPolicy.whenMisconceptionRepeats,
      "Live Codex workflow improvementPolicy.whenMisconceptionRepeats",
      requiredImprovementWhenMisconceptionRepeats,
      errors,
    );
    const cadence = isPlainObject(improvementPolicy.cadenceCalibration) ? improvementPolicy.cadenceCalibration : null;
    if (!cadence || cadence.afterModuleCount !== 3) {
      errors.push("Live Codex workflow improvementPolicy must calibrate after three modules.");
    } else {
      requiredStringArray(cadence.inspect, "Live Codex workflow improvementPolicy.cadenceCalibration.inspect", requiredImprovementInspect, errors);
      requiredStringArray(cadence.possibleActions, "Live Codex workflow improvementPolicy.cadenceCalibration.possibleActions", requiredImprovementPossibleActions, errors);
    }
    if (improvementPolicy.courseChangeBoundary !== requiredImprovementCourseChangeBoundary) {
      errors.push("Live Codex workflow improvementPolicy must preserve the explicit Git/course-change boundary.");
    }
  }

  const privacyBoundary = isPlainObject(workflow.privacyBoundary) ? workflow.privacyBoundary : null;
  if (!privacyBoundary) {
    errors.push("Live Codex workflow privacyBoundary must be an object.");
  } else {
    requiredStringArray(privacyBoundary.excludedFromRecords, "Live Codex workflow excludedFromRecords", requiredExclusions, errors);
    const claims = privacyBoundary.forbiddenClaims;
    if (!Array.isArray(claims) || claims.length !== 2 || claims.some((claim) => text(claim) === "")) {
      errors.push("Live Codex workflow forbiddenClaims must contain the two reviewed truth boundaries.");
    }
  }

  requiredStringArray(workflow.learnerControls, "Live Codex workflow learnerControls", requiredControls, errors);
  const claimBoundary = isPlainObject(workflow.claimBoundary) ? workflow.claimBoundary : null;
  if (!claimBoundary || claimBoundary.platformAcceptanceEvidenceRequired !== true || claimBoundary.successfulWriteRequiresDirectEvidence !== true || claimBoundary.noPassFail !== true) {
    errors.push("Live Codex workflow claimBoundary must require platform acceptance evidence and retain the no-pass/fail boundary.");
  }

  let guidePath = null;
  if (delivery && text(delivery.learnerGuidePath) !== "") {
    guidePath = await validateGuide(delivery.learnerGuidePath, siteRoot, errors);
  }
  if (errors.length > 0) {
    throw new Error(`Live Codex learning workflow validation failed:\n- ${errors.join("\n- ")}`);
  }
  return {
    workflowPath: liveCodexLearningWorkflowRelativePath,
    learnerGuidePath: delivery.learnerGuidePath,
    delivery,
    startNow,
    moduleLoop,
    improvementPolicy,
    notionSessionNotes,
    roles: workflow.roles,
    whiteboardProtocol,
    privacyBoundary,
    learnerControls: workflow.learnerControls,
    releaseInputPaths: [liveCodexLearningWorkflowPath(siteRoot), guidePath],
  };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const workflow = await loadLiveCodexLearningWorkflow();
  const report = await validateLiveCodexLearningWorkflow(workflow);
  console.log(
    `Live Codex learning workflow: ${report.roles.length} designated roles; ${report.notionSessionNotes.designatedChatMode} note policy.`,
  );
}
