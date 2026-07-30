"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { CourseModule } from "@/lib/module-catalog";
import type { OralDefenseGuide } from "@/lib/oral-defense-guide";
import {
  buildTextDefenseEvidenceDraft,
  canAdvanceTextDefenseStep,
  canCopyTextDefenseEvidence,
  canRevealTextDefenseHint,
  createTextDefensePlan,
  getTextDefenseHint,
} from "@/lib/oral-defense-text-flow";
import styles from "./ModuleOralDefense.module.css";

type TextDefenseStepId =
  | "explain"
  | "predict"
  | "boundary"
  | "transfer"
  | "reflect";

type TextDefenseAnswers = Record<TextDefenseStepId, string>;

type ModuleTextOralDefenseProps = {
  courseModule: CourseModule;
  guide: OralDefenseGuide;
};

const confidenceOptions = [
  { value: 1, label: "1 · very uncertain" },
  { value: 2, label: "2 · tentative" },
  { value: 3, label: "3 · mostly confident" },
  { value: 4, label: "4 · ready to stress-test" },
] as const;

function emptyAnswers(): TextDefenseAnswers {
  return {
    explain: "",
    predict: "",
    boundary: "",
    transfer: "",
    reflect: "",
  };
}

export function ModuleTextOralDefense({
  courseModule,
  guide,
}: ModuleTextOralDefenseProps) {
  const plan = useMemo(() => createTextDefensePlan(guide), [guide]);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [answers, setAnswers] = useState<TextDefenseAnswers>(emptyAnswers);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [hintCount, setHintCount] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [summaryApproved, setSummaryApproved] = useState(false);
  const [status, setStatus] = useState("");
  const [copyStatus, setCopyStatus] = useState("");
  const questionHeadingRef = useRef<HTMLHeadingElement>(null);
  const summaryHeadingRef = useRef<HTMLHeadingElement>(null);
  const restartFocusRequested = useRef(false);

  const currentStep = plan[activeStepIndex];
  const currentStepId = currentStep.id as TextDefenseStepId;
  const currentAnswer = answers[currentStepId];
  const canAdvance = canAdvanceTextDefenseStep(
    currentStep,
    currentAnswer,
    confidence,
  );
  const canRevealHint = canRevealTextDefenseHint(
    currentStep,
    currentAnswer,
    confidence,
  );
  const evidenceDraft = useMemo(
    () =>
      buildTextDefenseEvidenceDraft({
        moduleNumber: courseModule.number,
        moduleTitle: courseModule.title,
        guide,
        answers,
        confidence,
      }),
    [answers, confidence, courseModule.number, courseModule.title, guide],
  );

  useEffect(() => {
    if (completed) {
      summaryHeadingRef.current?.focus();
      return;
    }

    if (activeStepIndex > 0 || restartFocusRequested.current) {
      questionHeadingRef.current?.focus();
      restartFocusRequested.current = false;
    }
  }, [activeStepIndex, completed]);

  const updateAnswer = (value: string) => {
    setAnswers((currentAnswers) => ({
      ...currentAnswers,
      [currentStepId]: value,
    }));
    setStatus("");
  };

  const advance = () => {
    if (!canAdvance) {
      setStatus(
        currentStep.requiresConfidence
          ? "Write a prediction and select a confidence level before continuing."
          : "Write a short response before continuing. You can revise it later.",
      );
      return;
    }

    if (activeStepIndex === plan.length - 1) {
      setCompleted(true);
      setStatus("Your local concise evidence draft is ready to review.");
      return;
    }

    const nextIndex = activeStepIndex + 1;
    setActiveStepIndex(nextIndex);
    setStatus(`Question ${nextIndex + 1} of ${plan.length}.`);
  };

  const goBack = () => {
    if (activeStepIndex === 0) {
      return;
    }
    setActiveStepIndex((index) => index - 1);
    setStatus("Previous response restored. You can revise it before continuing.");
  };

  const revealHint = () => {
    if (!canRevealHint) {
      setStatus(
        "Write a prediction and choose confidence first. The hint ladder stays closed until your reasoning is visible.",
      );
      return;
    }

    setHintCount((count) => Math.min(count + 1, currentStep.hintLadder.length));
    setStatus(
      "A hint is available. It is a reasoning prompt, not a score or final answer.",
    );
  };

  const copyEvidence = async () => {
    if (!canCopyTextDefenseEvidence(summaryApproved)) {
      setCopyStatus("Choose approval before copying your concise evidence summary.");
      return;
    }

    try {
      await navigator.clipboard.writeText(evidenceDraft);
      setCopyStatus(
        "Your approved concise summary is copied. Atlas did not save or send it.",
      );
    } catch {
      setCopyStatus(
        "Copy is unavailable here. Select the local draft below and copy only what you approve.",
      );
    }
  };

  const restart = () => {
    restartFocusRequested.current = true;
    setActiveStepIndex(0);
    setAnswers(emptyAnswers());
    setConfidence(null);
    setHintCount(0);
    setCompleted(false);
    setSummaryApproved(false);
    setStatus("The local conversation was cleared. Nothing was stored or sent.");
    setCopyStatus("");
  };

  if (completed) {
    return (
      <section
        aria-labelledby={`text-defense-summary-${courseModule.number}`}
        className={styles.textFlow}
      >
        <p className={styles.cardEyebrow}>Text conversation complete</p>
        <h3
          id={`text-defense-summary-${courseModule.number}`}
          ref={summaryHeadingRef}
          tabIndex={-1}
        >
          Review your concise evidence draft.
        </h3>
        <p>
          This draft exists only on this page. It is not graded, stored,
          transmitted, or exported unless you deliberately copy it.
        </p>
        <pre
          aria-label="Scrollable concise oral-defense evidence draft"
          className={styles.evidenceDraft}
          tabIndex={0}
        >
          <code>{evidenceDraft}</code>
        </pre>
        <div className={styles.summaryActions}>
          <label className={styles.summaryApproval}>
            <input
              checked={summaryApproved}
              onChange={(event) => setSummaryApproved(event.target.checked)}
              type="checkbox"
            />
            I approve copying this concise summary myself. I will remove any
            sensitive or unnecessary detail before saving it elsewhere.
          </label>
          <div className={styles.summaryButtons}>
            <button
              disabled={!summaryApproved}
              onClick={copyEvidence}
              type="button"
            >
              Copy approved evidence summary
            </button>
            <button className={styles.secondaryButton} onClick={restart} type="button">
              Start a new local conversation
            </button>
          </div>
          <p aria-live="polite" className={styles.flowStatus}>
            {copyStatus ||
              "Copying is optional. The read-only draft remains available for manual selection."}
          </p>
        </div>
      </section>
    );
  }

  const hintMessages = Array.from({ length: hintCount }, (_, index) =>
    getTextDefenseHint(currentStep, index, confidence),
  ).filter((hint): hint is string => hint !== null);

  return (
    <section
      aria-describedby={`text-defense-privacy-${courseModule.number}`}
      aria-labelledby={`text-defense-${courseModule.number}`}
      className={styles.textFlow}
    >
      <p className={styles.cardEyebrow}>Equivalent text conversation</p>
      <h3 id={`text-defense-${courseModule.number}`}>
        Work through one question at a time.
      </h3>
      <p id={`text-defense-privacy-${courseModule.number}`}>
        This is a fully equivalent text conversation in learning moves: type,
        dictate, use a screen reader, or paste a small trace. Your responses
        remain in this page&apos;s temporary state: Atlas makes no API call and
        does not automatically store or export them.
      </p>

      <div className={styles.flowProgress}>
        <span>
          Question {activeStepIndex + 1} of {plan.length} · {currentStep.title}
        </span>
        <progress
          aria-label={`Oral-defense question ${activeStepIndex + 1} of ${plan.length}`}
          max={plan.length}
          value={activeStepIndex + 1}
        />
      </div>

      <form
        className={styles.flowForm}
        onSubmit={(event) => {
          event.preventDefault();
          advance();
        }}
      >
        <h4 ref={questionHeadingRef} tabIndex={-1}>
          {currentStep.title}
        </h4>
        <p>{currentStep.prompt}</p>
        {currentStep.predictionBeforeReveal ? (
          <p className={styles.predictionGate}>
            Prediction before reveal: write your own route and calibrate
            confidence before the optional hint ladder opens.
          </p>
        ) : null}

        <label htmlFor={`text-defense-answer-${courseModule.number}`}>
          {currentStep.responseLabel}
        </label>
        <textarea
          id={`text-defense-answer-${courseModule.number}`}
          onChange={(event) => updateAnswer(event.target.value)}
          placeholder={currentStep.placeholder}
          rows={6}
          value={currentAnswer}
        />

        {currentStep.requiresConfidence ? (
          <fieldset className={styles.confidenceFieldset}>
            <legend>How confident are you in this prediction right now?</legend>
            <p>No penalty for uncertainty. This changes the first hint&apos;s starting point, not a score.</p>
            <div>
              {confidenceOptions.map((option) => (
                <label key={option.value}>
                  <input
                    checked={confidence === option.value}
                    name={`text-defense-confidence-${courseModule.number}`}
                    onChange={() => {
                      setConfidence(option.value);
                      setStatus("");
                    }}
                    type="radio"
                    value={option.value}
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </fieldset>
        ) : null}

        {currentStep.predictionBeforeReveal ? (
          <section
            aria-labelledby={`text-defense-hints-${courseModule.number}`}
            className={styles.hintLadder}
          >
            <h5 id={`text-defense-hints-${courseModule.number}`}>Optional hint ladder</h5>
            <p>
              Each hint is deliberately smaller than a worked answer. You can
              continue without opening it.
            </p>
            {hintMessages.length > 0 ? (
              <ol aria-live="polite">
                {hintMessages.map((hint, index) => (
                  <li key={hint}>
                    <strong>Hint {index + 1}:</strong> {hint}
                  </li>
                ))}
              </ol>
            ) : null}
            {hintCount < currentStep.hintLadder.length ? (
              <button
                aria-describedby={`text-defense-hint-note-${courseModule.number}`}
                aria-disabled={!canRevealHint}
                className={styles.hintButton}
                onClick={revealHint}
                type="button"
              >
                Reveal hint {hintCount + 1} of {currentStep.hintLadder.length}
              </button>
            ) : null}
            <p id={`text-defense-hint-note-${courseModule.number}`} className={styles.gateNote}>
              {canRevealHint
                ? "Your prediction is visible. A hint can now support revision."
                : "Add a prediction and confidence first; the ladder will stay closed until then."}
            </p>
          </section>
        ) : null}

        <div className={styles.flowActions}>
          <button
            className={styles.secondaryButton}
            disabled={activeStepIndex === 0}
            onClick={goBack}
            type="button"
          >
            Back
          </button>
          <button
            aria-describedby={`text-defense-continue-note-${courseModule.number}`}
            aria-disabled={!canAdvance}
            type="submit"
          >
            {activeStepIndex === plan.length - 1
              ? "Create a local evidence draft"
              : "Continue to the next question"}
          </button>
        </div>
        <p
          className={styles.gateNote}
          id={`text-defense-continue-note-${courseModule.number}`}
        >
          {canAdvance
            ? "You can continue now or revise this response first."
            : currentStep.requiresConfidence
              ? "A response and confidence choice are needed before the next question."
              : "A short response is needed before the next question."}
        </p>
        <p aria-live="polite" className={styles.flowStatus} role="status">
          {status}
        </p>
      </form>
    </section>
  );
}
