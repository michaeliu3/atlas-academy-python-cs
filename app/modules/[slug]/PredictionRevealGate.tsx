"use client";

import { type ReactNode, useId, useState } from "react";

type PredictionRevealGateProps = {
  children: ReactNode;
  mode?: "batch" | "individual";
  summaryLabel: string;
};

const answerChoices = ["A", "B", "C", "D"] as const;

const confidenceChoices = [
  { value: "C1", label: "C1 — tentative" },
  { value: "C2", label: "C2 — reasoned" },
  { value: "C3", label: "C3 — ready to defend" },
] as const;

/**
 * A deliberately small, local-only prompt before an existing MCQ rationale.
 * It does not score, save, unlock, or report anything; it simply prevents a
 * learner from accidentally seeing the explanation before making a prediction.
 */
export function PredictionRevealGate({
  children,
  mode = "individual",
  summaryLabel,
}: PredictionRevealGateProps) {
  const reactId = useId();
  const [choice, setChoice] = useState<string | null>(null);
  const [batchPredictionRecorded, setBatchPredictionRecorded] = useState(false);
  const [confidence, setConfidence] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const canReveal =
    (mode === "batch" ? batchPredictionRecorded : choice !== null) && confidence !== null;
  const hintId = `prediction-gate-${reactId}`;

  const revisePrediction = (nextChoice?: string, nextConfidence?: string) => {
    if (nextChoice !== undefined) setChoice(nextChoice);
    if (nextConfidence !== undefined) setConfidence(nextConfidence);
    setRevealed(false);
  };

  const reviseBatchPrediction = (nextRecorded: boolean) => {
    setBatchPredictionRecorded(nextRecorded);
    setRevealed(false);
  };

  return (
    <section
      aria-label={`${mode === "batch" ? "Multiple-choice diagnostic batch" : "Multiple-choice"} prediction: ${summaryLabel}`}
      className="prediction-reveal-gate"
    >
      <p className="prediction-reveal-kicker">Prediction before reveal</p>
      <h4>{mode === "batch" ? "Commit the batch and confidence" : "Commit a choice and confidence"}</h4>
      <p>
        {mode === "batch"
          ? "Record a prediction for each diagnostic question, then calibrate the answer you find least certain. This is a private thinking aid: it does not assign a grade, save an answer, or claim mastery."
          : "Choose the option you currently expect, then calibrate confidence. This is a private thinking aid: it does not assign a grade, save an answer, or claim mastery."}
      </p>

      {mode === "batch" ? (
        <fieldset>
          <legend>Have you recorded a prediction for each question?</legend>
          <label>
            <input
              checked={batchPredictionRecorded}
              onChange={(event) => reviseBatchPrediction(event.target.checked)}
              type="checkbox"
            />
            I recorded a prediction for each diagnostic question before opening the repair key.
          </label>
        </fieldset>
      ) : (
        <fieldset>
          <legend>Which option do you predict?</legend>
          <div className="prediction-choice-list">
            {answerChoices.map((option) => (
              <label key={option}>
                <input
                  checked={choice === option}
                  name={`prediction-choice-${reactId}`}
                  onChange={() => revisePrediction(option)}
                  type="radio"
                  value={option}
                />
                {option}.
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <fieldset>
        <legend>
          {mode === "batch"
            ? "How confident is your least-certain recorded answer?"
            : "How confident is that prediction?"}
        </legend>
        <div className="prediction-choice-list">
          {confidenceChoices.map((option) => (
            <label key={option.value}>
              <input
                checked={confidence === option.value}
                name={`prediction-confidence-${reactId}`}
                onChange={() => revisePrediction(undefined, option.value)}
                type="radio"
                value={option.value}
              />
              {option.label}
            </label>
          ))}
        </div>
      </fieldset>

      <button
        aria-describedby={hintId}
        disabled={!canReveal}
        onClick={() => setRevealed(true)}
        type="button"
      >
        {mode === "batch" ? "Reveal diagnostic repair key" : "Reveal answer rationale"}
      </button>
      <p aria-live="polite" className="prediction-reveal-note" id={hintId}>
        {canReveal
          ? mode === "batch"
            ? "Your batch prediction is set. Reveal the repair key when you are ready."
            : "Your prediction is set. Reveal the rationale when you are ready."
          : mode === "batch"
            ? "Record the batch prediction and choose a confidence level first; the repair key stays hidden until then."
            : "Choose an option and confidence first; the rationale stays hidden until then."}
      </p>

      {revealed ? (
        <details className="lesson-details" open>
          {children}
        </details>
      ) : null}
    </section>
  );
}
