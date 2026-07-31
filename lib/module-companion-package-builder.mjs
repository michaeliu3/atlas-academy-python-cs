const guideFields = [
  "moduleId",
  "lens",
  "centralModel",
  "traceOrDerivation",
  "misconception",
  "boundary",
  "transfer",
];

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
  if (!isPlainObject(liveWorkflow) || !isPlainObject(liveWorkflow.delivery)) {
    throw new Error("module companion package requires the validated Live Codex workflow.");
  }
  const { delivery, whiteboardProtocol } = liveWorkflow;
  if (!Array.isArray(whiteboardProtocol?.required) || whiteboardProtocol.required.length === 0) {
    throw new Error("module companion package requires the Live Codex whiteboard protocol.");
  }
  const defaultMode = text(delivery.defaultRecordMode, "Live Codex defaultRecordMode");
  const enabledMode = text(delivery.enabledRecordMode, "Live Codex enabledRecordMode");
  if (defaultMode !== "keep-local") {
    throw new Error("Live Codex default record mode must remain keep-local.");
  }
  if (enabledMode !== "configured-notion-session-note") {
    throw new Error(
      "Live Codex enabled record mode must remain configured-notion-session-note.",
    );
  }
  return {
    whiteboardProtocol: [...whiteboardProtocol.required],
    recordBoundary: {
      defaultMode,
      enabledMode,
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

function forwardSentence(declaredForwardHandoff) {
  if (declaredForwardHandoff === null) {
    return "There is no declared forward module. End with an honest next specialization or maintenance question rather than inventing a continuation.";
  }
  return `Canonical forward handoff: M${declaredForwardHandoff.number} (${declaredForwardHandoff.title}; ${declaredForwardHandoff.availability}). Carry forward the model, uncertainty, and smallest evidence artifact—not a claim of mastery.`;
}

function whiteboardSentence() {
  return "Keep the visible chat as an accessible whiteboard: use supported display math with defined symbols; use language-labelled fenced code with explicit state traces; add a prose or ASCII fallback for math, code, and diagrams when rendering is uncertain; never rely on speech-only or visual-only explanation.";
}

function recordSentence(recordBoundary) {
  return `Record mode begins as “${recordBoundary.defaultMode}”. Create at most one concise Notion session note only when I explicitly select “${recordBoundary.enabledMode}”, this is my designated chat, its configured private destination is reachable, and I end the substantive session or ask for a summary. Never save raw voice, full transcripts, credentials, sensitive personal data, or off-record material. Honor pause, off-record, correction, and deletion requests, and say plainly if a requested write did not occur.`;
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
  const { whiteboardProtocol, recordBoundary } = workflowRules(liveWorkflow);
  const currentModule = moduleLabel(courseModule);
  const prerequisites = prerequisiteSentence(academicPrerequisites);
  const forward = forwardSentence(declaredForwardHandoff);
  const whiteboard = whiteboardSentence();
  const records = recordSentence(recordBoundary);

  return {
    schemaVersion: 1,
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
