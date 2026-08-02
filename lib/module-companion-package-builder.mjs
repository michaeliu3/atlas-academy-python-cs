const guideFields = [
  "moduleId",
  "lens",
  "centralModel",
  "traceOrDerivation",
  "misconception",
  "boundary",
  "transfer",
];
const requiredRecordingAuthorization = {
  initialState: "require-explicit-records-on-confirmation",
  activationPhrase: "records on",
  scope: "that designated chat until records are paused or material is off-record",
};
const requiredSubstantiveEvidence = [
  "a named module or learning topic",
  "learner reasoning, a concrete evidence artifact, a misconception, or a counterexample",
  "a learner-controlled next action or cross-role handoff",
];
const requiredNotionReachability = "the configured private Notion destination is reachable";
const requiredUnavailableWriteBehavior = "state-unavailable-and-keep-summary-in-chat";

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function text(value, label) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${label} must be non-empty text.`);
  }
  return value.trim();
}

function moduleLabel(courseModule) {
  return `Module ${courseModule.number}: ${courseModule.title}`;
}

function requireCourseModule(courseModule, label) {
  if (!isPlainObject(courseModule)) throw new Error(`${label} must be a course-module object.`);
  if (!Number.isInteger(courseModule.number) || courseModule.number < 1) {
    throw new Error(`${label}.number must be a positive integer.`);
  }
  text(courseModule.id, `${label}.id`);
  text(courseModule.title, `${label}.title`);
  text(courseModule.purpose, `${label}.purpose`);
  if (!Array.isArray(courseModule.academicPrerequisiteNumbers)) {
    throw new Error(`${label}.academicPrerequisiteNumbers must be an array.`);
  }
  if (courseModule.forwardModuleNumber !== null && !Number.isInteger(courseModule.forwardModuleNumber)) {
    throw new Error(`${label}.forwardModuleNumber must be an integer or null.`);
  }
  if (!isPlainObject(courseModule.state)) {
    throw new Error(`${label}.state must be present.`);
  }
  text(courseModule.state.availability, `${label}.state.availability`);
}

function requireGuide(guide, courseModule) {
  if (!isPlainObject(guide)) throw new Error("module companion guide must be an object.");
  for (const field of guideFields) text(guide[field], `module companion guide.${field}`);
  if (guide.moduleId !== courseModule.id) {
    throw new Error(`module companion guide ${guide.moduleId} does not match ${courseModule.id}.`);
  }
  return guide;
}

function workflowRules(liveWorkflow) {
  if (
    !isPlainObject(liveWorkflow) ||
    !isPlainObject(liveWorkflow.delivery) ||
    !isPlainObject(liveWorkflow.notionSessionNotes)
  ) {
    throw new Error("module companion package requires the validated Live Codex workflow.");
  }
  const { delivery, notionSessionNotes, whiteboardProtocol } = liveWorkflow;
  if (delivery.portalRuntimeIntegration !== "none") {
    throw new Error("Live Codex workflow must not grant the portal Notion runtime integration.");
  }
  if (delivery.chatSurface !== "user-designated-platform-chat") {
    throw new Error("Live Codex workflow must preserve the designated-chat boundary.");
  }
  if (!Array.isArray(whiteboardProtocol?.required) || whiteboardProtocol.required.length === 0) {
    throw new Error("module companion package requires the Live Codex whiteboard protocol.");
  }
  const portableStartupMode = text(
    notionSessionNotes.portableStartupMode,
    "Live Codex portableStartupMode",
  );
  const designatedChatMode = text(
    notionSessionNotes.designatedChatMode,
    "Live Codex designatedChatMode",
  );
  if (portableStartupMode !== "keep-local") {
    throw new Error("Live Codex portable startup mode must remain keep-local.");
  }
  if (designatedChatMode !== "automatic-after-substantive-session") {
    throw new Error(
      "Live Codex designated chat mode must remain automatic-after-substantive-session.",
    );
  }
  const recordingAuthorization = notionSessionNotes.recordingAuthorization;
  if (
    !isPlainObject(recordingAuthorization) ||
    recordingAuthorization.initialState !== requiredRecordingAuthorization.initialState ||
    recordingAuthorization.activationPhrase !== requiredRecordingAuthorization.activationPhrase ||
    recordingAuthorization.scope !== requiredRecordingAuthorization.scope
  ) {
    throw new Error("Live Codex workflow must require a scoped records-on confirmation.");
  }
  const substantiveSession = notionSessionNotes.substantiveSession;
  if (
    !isPlainObject(substantiveSession) ||
    !Array.isArray(substantiveSession.minimumEvidence) ||
    substantiveSession.minimumEvidence.length !== requiredSubstantiveEvidence.length ||
    !requiredSubstantiveEvidence.every(
      (evidence, index) => substantiveSession.minimumEvidence[index] === evidence,
    )
  ) {
    throw new Error("Live Codex workflow must define the reviewed substantive-session threshold.");
  }
  if (notionSessionNotes.writeCadence !== "at-most-one-concise-note-per-substantive-session") {
    throw new Error("Live Codex session-note cadence must remain bounded to one concise note per substantive session.");
  }
  if (notionSessionNotes.onUnavailable !== requiredUnavailableWriteBehavior) {
    throw new Error("Live Codex unavailable-write behavior must retain the summary in chat.");
  }
  const requiredConditions = [
    "this is the designated Teaching Assistant or Study Partner chat",
    requiredNotionReachability,
    "the learning conversation is substantive",
    "records are not paused and the material is not marked off-record",
  ];
  if (
    !Array.isArray(notionSessionNotes.requiredConditions) ||
    notionSessionNotes.requiredConditions.length !== requiredConditions.length ||
    !requiredConditions.every((condition, index) => notionSessionNotes.requiredConditions[index] === condition)
  ) {
    throw new Error("Live Codex session-note conditions must preserve designated-chat, privacy, and substantive-session boundaries.");
  }
  if (liveWorkflow.claimBoundary?.successfulWriteRequiresDirectEvidence !== true) {
    throw new Error("Live Codex workflow must require direct evidence before a saved-note claim.");
  }
  return {
    whiteboardProtocol: [...whiteboardProtocol.required],
    recordBoundary: {
      portableStartupMode,
      designatedChatMode,
    },
    recordPolicy: {
      reachabilityCondition: requiredNotionReachability,
      unavailableWriteBehavior: requiredUnavailableWriteBehavior,
    },
  };
}

function graphContext(courseModule, graphModules) {
  if (!Array.isArray(graphModules)) {
    throw new Error("module companion package requires canonical graph modules.");
  }
  const modulesByNumber = new Map(graphModules.map((entry) => [entry?.number, entry]));
  const academicPrerequisites = courseModule.academicPrerequisiteNumbers.map((number) => {
    const prerequisite = modulesByNumber.get(number);
    requireCourseModule(prerequisite, `academic prerequisite ${number}`);
    return {
      moduleId: prerequisite.id,
      number: prerequisite.number,
      title: prerequisite.title,
      availability: prerequisite.state.availability,
    };
  });
  const forward = courseModule.forwardModuleNumber === null
    ? null
    : modulesByNumber.get(courseModule.forwardModuleNumber);
  if (courseModule.forwardModuleNumber !== null) {
    requireCourseModule(forward, `forward module ${courseModule.forwardModuleNumber}`);
  }
  return {
    academicPrerequisites,
    declaredForwardHandoff: forward === null
      ? null
      : {
        moduleId: forward.id,
        number: forward.number,
        title: forward.title,
        availability: forward.state.availability,
      },
  };
}

function prerequisiteSentence(academicPrerequisites) {
  if (academicPrerequisites.length === 0) {
    return "This module has no academic prerequisite modules in the canonical graph.";
  }
  return `Academic prerequisites: ${academicPrerequisites.map(({ number, title }) => `M${number} (${title})`).join("; ")}. These are learning dependencies, not evidence that I have completed them.`;
}

function availabilitySentence(availability) {
  switch (availability) {
    case "legacy-open":
      return "open learning material; contract and release verification pending";
    case "published":
      return "verified published learning material";
    case "preview":
      return "reference preview; not an unlocked Core step";
    case "optional":
      return "optional reference material";
    case "locked":
      return "locked pending its release boundary";
    case "authoring-only":
      return "in authoring; unavailable to learners";
    default:
      return "an unrecognized availability state";
  }
}

function forwardSentence(declaredForwardHandoff) {
  if (declaredForwardHandoff === null) {
    return "There is no declared forward module. End with an honest next specialization or maintenance question rather than inventing a continuation.";
  }
  return `Canonical forward handoff: M${declaredForwardHandoff.number} (${declaredForwardHandoff.title}; ${availabilitySentence(declaredForwardHandoff.availability)}). Carry forward the model, uncertainty, and smallest evidence artifact—not a claim of mastery.`;
}

function whiteboardSentence() {
  return "Keep the visible chat as an accessible whiteboard: use supported display math with defined symbols; use language-labelled fenced code with explicit state traces; add a prose or ASCII fallback for math, code, and diagrams when rendering is uncertain; never rely on speech-only or visual-only explanation.";
}

function recordSentence(recordBoundary, recordPolicy) {
  return `A portable copied prompt begins in “${recordBoundary.portableStartupMode}” mode. In my learner-designated Teaching Assistant or Study Partner chat, the configured private Notion record is authorized to use “${recordBoundary.designatedChatMode}”: automatically create at most one concise note after a substantive learning conversation, not after every exchange. Automatic note behavior is possible only when the chat is designated, ${recordPolicy.reachabilityCondition}, the learning conversation is substantive, and records are neither paused nor off-record. Before the first automatic note, I must confirm “records on” in that designated chat; it remains active until records are paused or material is off-record. Treat a session as substantive only when it names a module or learning topic, includes learner reasoning, a concrete evidence artifact, a misconception, or a counterexample, and ends with a learner-controlled next action or cross-role handoff. Never save raw voice, full transcripts, credentials, sensitive personal data, or off-record material. If that destination is unavailable, say plainly that no write occurred and keep a ready-to-paste concise summary in chat. Honor pause, off-record, correction, and deletion requests. Do not claim a saved note without direct evidence of the successful write.`;
}

/**
 * Build a single module-specific handoff package. The graph is the only source
 * of prerequisites and forward continuation; the guide supplies the teaching
 * focus that cannot be safely inferred from a module title.
 */
export function buildModuleCompanionPackage({
  courseModule,
  graphModules,
  guide,
  liveWorkflow,
}) {
  requireCourseModule(courseModule, "course module");
  const validatedGuide = requireGuide(guide, courseModule);
  const { academicPrerequisites, declaredForwardHandoff } = graphContext(courseModule, graphModules);
  const { whiteboardProtocol, recordBoundary, recordPolicy } = workflowRules(liveWorkflow);
  const currentModule = moduleLabel(courseModule);
  const prerequisites = prerequisiteSentence(academicPrerequisites);
  const forward = forwardSentence(declaredForwardHandoff);
  const whiteboard = whiteboardSentence();
  const records = recordSentence(recordBoundary, recordPolicy);

  return {
    schemaVersion: 2,
    module: {
      id: courseModule.id,
      number: courseModule.number,
      title: courseModule.title,
      purpose: courseModule.purpose,
      availability: courseModule.state.availability,
      academicPrerequisites,
      declaredForwardHandoff,
    },
    guide: { ...validatedGuide },
    whiteboardProtocol,
    recordBoundary,
    teachingAssistant: {
      role: "supportive-oral-defense",
      contextPrompt: `Act as my encouraging Atlas Academy Teaching Assistant for ${currentModule}. This is a formative oral defense conversation, not a grade. The central model is: ${validatedGuide.centralModel}. Ask me to ${validatedGuide.traceOrDerivation}. Watch gently for this likely misconception: ${validatedGuide.misconception}. Ask me to name this boundary: ${validatedGuide.boundary}. Then ask me to transfer the model through: ${validatedGuide.transfer}.

${prerequisites}
${forward}

Use one question at a time and invite a prediction before revealing a correction. Follow a hint ladder: recognition clue → representation or trace → partial worked step → explanation after my revision. Invite a counterexample or changed premise. End with a learner-controlled evidence summary: demonstrated model, repaired misconception, fragile idea, calibrated confidence, one retrieval prompt, and the smallest next bridge. Do not score, grade, or make a binary outcome judgment.

${whiteboard}
${records}`,
    },
    studyPartner: {
      role: "non-grading-rehearsal",
      contextPrompt: `Act as my Atlas Academy Study Partner for ${currentModule}. Lead a non-grading rehearsal, not the formal oral defense. Start from the central model: ${validatedGuide.centralModel}. Ask me to explain or trace: ${validatedGuide.traceOrDerivation}. Change one premise to test this boundary: ${validatedGuide.boundary}. If I repeat this misconception, help me repair it with the smallest useful counterexample: ${validatedGuide.misconception}. Finish by asking for this transfer: ${validatedGuide.transfer}.

${prerequisites}
${forward}

Ask one clear retrieval question at a time and wait for my reasoning. Distinguish a definition, assumption, theorem, API contract, finite observation, and decision claim. Treat AI-generated code or explanations as proposals to inspect, not authority. End with one retrieval sentence, one uncertainty worth keeping, and a focused Teaching Assistant handoff: current question, attempted reasoning, smallest evidence artifact, and a suggested defense focus. Do not score or grade me.

${whiteboard}
${records}`,
    },
  };
}
