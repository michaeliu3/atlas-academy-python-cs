/**
 * A deliberately local, deterministic structure for the text oral-defense
 * route. It contains teaching prompts rather than answer evaluation: the
 * learner controls when to request a hint, move on, or copy a summary.
 */
export const textDefenseStepIds = [
  "explain",
  "predict",
  "boundary",
  "transfer",
  "reflect",
];

const conciseLimit = 360;

function conciseText(value) {
  const normalized = String(value ?? "").replace(/\s+/gu, " ").trim();
  if (!normalized) {
    return "Not recorded.";
  }
  return normalized.length <= conciseLimit
    ? normalized
    : `${normalized.slice(0, conciseLimit - 1)}…`;
}

/**
 * @param {{ centralModel: string; traceOrDerivation: string; misconception: string; boundary: string; transfer: string }} guide
 */
export function createTextDefensePlan(guide) {
  return [
    {
      id: "explain",
      title: "Explain the model",
      prompt: `In plain language, what is ${guide.centralModel}? Name the distinction, representation, or invariant you would want another learner to keep in view.`,
      responseLabel: "Your plain-language explanation",
      placeholder: "Start with what the model represents and why it matters…",
      requiresConfidence: false,
      predictionBeforeReveal: false,
      hintLadder: [],
    },
    {
      id: "predict",
      title: "Predict, then trace or derive",
      prompt: `Before seeing a hint or route, ${guide.traceOrDerivation}. State your prediction, the assumption that makes it plausible, and what would change your mind.`,
      responseLabel: "Your prediction and reasoning",
      placeholder: "I predict… because… The assumption I am relying on is…",
      requiresConfidence: true,
      predictionBeforeReveal: true,
      hintLadder: [
        {
          lowConfidence:
            "Take a smaller starting point: name one object, state, quantity, or relation, then say what must remain true after one step.",
          highConfidence:
            "Stress-test your prediction before extending it: name one object, state, quantity, or relation, then say what must remain true after one step.",
        },
        {
          lowConfidence: `Use the central model as a lens: ${guide.centralModel}. Which assumption makes your next step legal?`,
          highConfidence: `Try to falsify your first route with this lens: ${guide.centralModel}. Which assumption could make your next step illegal?`,
        },
        {
          lowConfidence: `One defensible reasoning route is to connect the prediction to ${guide.traceOrDerivation}, then state the limit of the observation. This is a route to examine, not a verdict.`,
          highConfidence: `A useful challenge route is to connect the prediction to ${guide.traceOrDerivation}, then name what observation would fail to establish. This is a route to examine, not a verdict.`,
        },
      ],
    },
    {
      id: "boundary",
      title: "Stress the boundary",
      prompt: `Construct a counterexample, failure mode, ambiguity, or missing condition for this question: ${guide.boundary}`,
      responseLabel: "Your boundary or counterexample",
      placeholder: "This claim would fail, become uncertain, or need a new condition when…",
      requiresConfidence: false,
      predictionBeforeReveal: false,
      hintLadder: [],
    },
    {
      id: "transfer",
      title: "Transfer the idea",
      prompt: `Apply the same model to ${guide.transfer}. What changes in the new situation, and what must remain true?`,
      responseLabel: "Your transfer reasoning",
      placeholder: "In the new situation I would… The shared constraint is…",
      requiresConfidence: false,
      predictionBeforeReveal: false,
      hintLadder: [],
    },
    {
      id: "reflect",
      title: "Choose the next bridge",
      prompt: `Name one fragile idea you want to revisit, one misconception you repaired or still suspect, the smallest next bridge, and one retrieval question you want to answer later without notes. Keep it honest rather than graded.`,
      responseLabel: "Your reflection and next bridge",
      placeholder: "A fragile idea is… I will next…",
      requiresConfidence: false,
      predictionBeforeReveal: false,
      hintLadder: [],
    },
  ];
}

export function isTextDefenseResponseReady(response) {
  return typeof response === "string" && response.trim().length > 0;
}

export function hasTextDefenseConfidence(confidence) {
  return Number.isInteger(confidence) && confidence >= 1 && confidence <= 4;
}

export function canAdvanceTextDefenseStep(step, response, confidence) {
  return (
    isTextDefenseResponseReady(response) &&
    (!step.requiresConfidence || hasTextDefenseConfidence(confidence))
  );
}

export function canRevealTextDefenseHint(step, response, confidence) {
  return (
    step.predictionBeforeReveal &&
    step.hintLadder.length > 0 &&
    canAdvanceTextDefenseStep(step, response, confidence)
  );
}

export function getTextDefenseHint(step, hintIndex, confidence) {
  const hint = step.hintLadder[hintIndex];
  if (!hint) {
    return null;
  }
  return hasTextDefenseConfidence(confidence) && confidence <= 2
    ? hint.lowConfidence
    : hint.highConfidence;
}

/**
 * Builds only a page-local draft. The caller must separately request and
 * receive learner approval before copying it anywhere.
 */
export function buildTextDefenseEvidenceDraft({
  moduleNumber,
  moduleTitle,
  guide,
  answers,
  confidence,
}) {
  return `Atlas Academy — Module ${moduleNumber}: ${moduleTitle}
Local oral-defense evidence draft

Central model: ${guide.centralModel}
Demonstrated model: ${conciseText(answers.explain)}
Prediction / trace (confidence ${hasTextDefenseConfidence(confidence) ? confidence : "not recorded"}/4): ${conciseText(answers.predict)}
Boundary or counterexample: ${conciseText(answers.boundary)}
Transfer: ${conciseText(answers.transfer)}
Fragile idea: ${conciseText(answers.reflect)}
Likely misconception to revisit: ${guide.misconception}
Retrieval prompt: Without notes, explain ${guide.centralModel}, name one assumption, and give one boundary or counterexample.

Privacy check: I chose to copy this concise summary. It contains no automatically saved transcript, recording, or private data I do not wish to keep.`;
}

export function canCopyTextDefenseEvidence(learnerApproved) {
  return learnerApproved === true;
}
