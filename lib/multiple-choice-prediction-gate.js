const ANSWER_CONFIDENCE_LABEL =
  "Reveal after recording your answer and confidence.";

const answerRationaleCue =
  /\b(?:distractors?|rationales?|diagnos(?:is|tic|es)|misconceptions?|analysis|repair)\b/u;

/**
 * Identify the narrow set of existing native-disclosure labels that hide a
 * multiple-choice answer and its rationale. Retrieval and free-prediction
 * disclosures deliberately remain outside this gate.
 *
 * @param {unknown} summaryLabel
 * @returns {boolean}
 */
export function isMultipleChoiceAnswerRationaleSummary(summaryLabel) {
  if (typeof summaryLabel !== "string") return false;
  const label = summaryLabel.trim();

  if (label === ANSWER_CONFIDENCE_LABEL) return true;
  if (/^Reveal answer(?:\b|[,:])/u.test(label)) return true;
  return /^Answer(?:\b|[,:])/u.test(label) && answerRationaleCue.test(label);
}
