"use client";

import { type ReactNode, useId, useState } from "react";

type PredictionRevealGateProps = {
  children: ReactNode;
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
  summaryLabel,
}: PredictionRevealGateProps) {
  const reactId = useId();
  const [choice, setChoice] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const canReveal = choice !== null && confidence !== null;
  const hintId = `prediction-gate-${reactId}`;

  const revisePrediction = (nextChoice?: string, nextConfidence?: string) => {
    if (nextChoice !== undefined) setChoice(nextChoice);
    if (nextConfidence !== undefined) setConfidence(nextConfidence);
    setRevealed(false);
  };

  return (
    <section
      aria-label={`Multiple-choice prediction: ${summaryLabel}`}
      className="prediction-reveal-gate"
    >
      <p className="prediction-reveal-kicker">Prediction before reveal</p>
      <h4>Commit a choice and confidence</h4>
      <p>
        Choose the option you currently expect, then calibrate confidence. This
        is a private thinking aid: it does not assign a grade, save an answer,
        or claim mastery.
      </p>

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

      <fieldset>
        <legend>How confident is that prediction?</legend>
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
        Reveal answer rationale
      </button>
      <p aria-live="polite" className="prediction-reveal-note" id={hintId}>
        {canReveal
          ? "Your prediction is set. Reveal the rationale when you are ready."
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
