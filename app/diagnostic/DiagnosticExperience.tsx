"use client";

import Link from "next/link";
import {
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import {
  DIAGNOSTIC_ASSESSMENT_VERSION,
  DIAGNOSTIC_STORAGE_KEY,
  buildDiagnosticResult,
  classifyResponse,
  confidenceLevels,
  createEmptyAttempt,
  diagnosticQuestions,
  diagnosticReducer,
  parseStoredAttempt,
  toLearningBrief,
} from "@/lib/diagnostic-model";

type DiagnosticAttempt = ReturnType<typeof createEmptyAttempt>;
type DiagnosticAction = Parameters<typeof diagnosticReducer>[1];
type CopyState = "idle" | "copied" | "failed";
type PersistenceState = "loading" | "saved" | "unavailable";

function reduceDiagnostic(
  state: DiagnosticAttempt,
  action: DiagnosticAction,
) {
  return diagnosticReducer(state, action);
}

function optionStateLabel(
  revealed: boolean,
  selected: boolean,
  correct: boolean,
) {
  if (!revealed) {
    return selected ? "Selected" : "";
  }
  if (correct) {
    return selected ? "Selected · correct" : "Correct answer";
  }
  return selected ? "Selected · review this model" : "";
}

export function DiagnosticExperience() {
  const [attempt, dispatch] = useReducer(
    reduceDiagnostic,
    undefined,
    createEmptyAttempt,
  );
  const [hydrated, setHydrated] = useState(false);
  const [persistence, setPersistence] =
    useState<PersistenceState>("loading");
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const [resetArmed, setResetArmed] = useState(false);
  const [restoredProgress, setRestoredProgress] = useState(false);
  const skipNextPersistence = useRef(false);
  const questionHeadingRef = useRef<HTMLHeadingElement>(null);
  const feedbackRef = useRef<HTMLDivElement>(null);
  const resultsHeadingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    let active = true;
    window.queueMicrotask(() => {
      if (!active) {
        return;
      }
      try {
        const raw = window.localStorage.getItem(DIAGNOSTIC_STORAGE_KEY);
        if (raw !== null) {
          const stored = parseStoredAttempt(raw);
          if (stored) {
            dispatch({ type: "hydrate", attempt: stored });
            setRestoredProgress(
              Object.keys(stored.responsesByQuestionId).length > 0,
            );
          } else {
            window.localStorage.removeItem(DIAGNOSTIC_STORAGE_KEY);
          }
        }
        setPersistence("saved");
      } catch {
        setPersistence("unavailable");
      } finally {
        setHydrated(true);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }
    if (skipNextPersistence.current) {
      skipNextPersistence.current = false;
      return;
    }
    try {
      window.localStorage.setItem(
        DIAGNOSTIC_STORAGE_KEY,
        JSON.stringify(attempt),
      );
    } catch {
      window.queueMicrotask(() => setPersistence("unavailable"));
    }
  }, [attempt, hydrated]);

  useEffect(() => {
    if (attempt.completed) {
      resultsHeadingRef.current?.focus();
    }
  }, [attempt.completed]);

  const currentIndex = Math.max(
    0,
    diagnosticQuestions.findIndex(
      (question) => question.id === attempt.currentQuestionId,
    ),
  );
  const question = diagnosticQuestions[currentIndex];
  const response = attempt.responsesByQuestionId[question.id];
  const signal = classifyResponse(question, response);
  const revealedCount = diagnosticQuestions.filter(
    (candidate) =>
      attempt.responsesByQuestionId[candidate.id]?.revealed === true,
  ).length;
  const allRevealed = revealedCount === diagnosticQuestions.length;
  const result = useMemo(
    () => buildDiagnosticResult(attempt),
    [attempt],
  );

  function goToQuestion(questionId: string) {
    setResetArmed(false);
    dispatch({ type: "goTo", questionId });
    window.requestAnimationFrame(() => questionHeadingRef.current?.focus());
  }

  function revealCurrentModel() {
    dispatch({ type: "reveal", questionId: question.id });
    window.requestAnimationFrame(() => feedbackRef.current?.focus());
  }

  function completeDiagnostic() {
    dispatch({ type: "complete" });
  }

  function resetDiagnostic() {
    skipNextPersistence.current = true;
    try {
      window.localStorage.removeItem(DIAGNOSTIC_STORAGE_KEY);
      setPersistence("saved");
    } catch {
      setPersistence("unavailable");
    }
    setCopyState("idle");
    setResetArmed(false);
    setRestoredProgress(false);
    dispatch({ type: "reset" });
    window.requestAnimationFrame(() => questionHeadingRef.current?.focus());
  }

  function requestReset() {
    if (resetArmed) {
      resetDiagnostic();
      return;
    }
    setResetArmed(true);
  }

  async function copyLearningBrief() {
    const brief = toLearningBrief(attempt);
    try {
      if (window.navigator.clipboard?.writeText) {
        await window.navigator.clipboard.writeText(brief);
      } else {
        const transfer = document.createElement("textarea");
        transfer.value = brief;
        transfer.setAttribute("readonly", "");
        transfer.style.position = "fixed";
        transfer.style.opacity = "0";
        document.body.appendChild(transfer);
        transfer.select();
        const copied = document.execCommand("copy");
        transfer.remove();
        if (!copied) {
          throw new Error("copy command was declined");
        }
      }
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }
  }

  if (attempt.completed) {
    return (
      <section
        className="diagnostic-results"
        aria-labelledby="diagnostic-results-title"
      >
        <header className="diagnostic-results-hero">
          <div>
            <p className="kicker">Module 0 · Learning-route synthesis</p>
            <h1
              id="diagnostic-results-title"
              ref={resultsHeadingRef}
              tabIndex={-1}
            >
              A map of what to transfer, verify, and repair.
            </h1>
            <p>
              This is not a grade. Each signal combines correctness with your
              confidence, then connects the underlying model to a precise
              course section.
            </p>
          </div>
          <dl
            className="diagnostic-result-score"
            aria-label="Diagnostic summary"
          >
            <div>
              <dt>{result.correctCount}</dt>
              <dd>models held</dd>
            </div>
            <div>
              <dt>{result.questionCount}</dt>
              <dd>models sampled</dd>
            </div>
          </dl>
        </header>

        <div className="diagnostic-tier-grid">
          <article className="diagnostic-tier-card tier-ready">
            <span aria-hidden="true">01</span>
            <h2>Ready to transfer</h2>
            <strong>{result.byTier.ready.length}</strong>
            <p>
              Correct with high confidence. We will still verify transfer in a
              new context before compressing instruction.
            </p>
          </article>
          <article className="diagnostic-tier-card tier-verify">
            <span aria-hidden="true">02</span>
            <h2>Verify and strengthen</h2>
            <strong>{result.byTier.verify.length}</strong>
            <p>
              Correct with uncertainty. A short explanation or counterexample
              should make the model easier to retrieve and defend.
            </p>
          </article>
          <article className="diagnostic-tier-card tier-repair">
            <span aria-hidden="true">03</span>
            <h2>Repair first</h2>
            <strong>{result.byTier.repair.length}</strong>
            <p>
              The selected explanation predicts the wrong behavior. We will
              rebuild it from a minimal case, not repeat a whole chapter.
            </p>
          </article>
        </div>

        <section
          className="diagnostic-learning-route"
          aria-labelledby="learning-route-title"
        >
          <header>
            <p className="kicker">Connected next steps</p>
            <h2 id="learning-route-title">Your evidence-led learning route</h2>
            <p>
              The sequence remains dependency ordered. A diagnostic can focus
              attention; it cannot erase prerequisites without a transfer
              check.
            </p>
          </header>

          {result.learningRoute.length > 0 ? (
            <ol>
              {result.learningRoute.map((route, index) => (
                <li key={route.href}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <p>
                      Module {route.moduleNumber} · Question{" "}
                      {route.questionNumber}
                    </p>
                    <h3>{route.moduleTitle}</h3>
                    <p>{route.section}</p>
                  </div>
                  <Link href={route.href}>
                    Open the exact section
                    <span aria-hidden="true"> ↗</span>
                  </Link>
                </li>
              ))}
            </ol>
          ) : (
            <div className="diagnostic-transfer-note">
              <strong>No automatic repair route was generated.</strong>
              <p>
                Begin with an instructor transfer interview. High-confidence
                answers are evidence to test, not permission to skip the
                connected foundation.
              </p>
              <Link href="/modules/01-values-state-execution">
                Open Module 1 <span aria-hidden="true">→</span>
              </Link>
            </div>
          )}
        </section>

        <section
          className="diagnostic-signal-ledger"
          aria-labelledby="signal-ledger-title"
        >
          <header>
            <p className="kicker">Reasoning evidence</p>
            <h2 id="signal-ledger-title">Question-by-question signal ledger</h2>
          </header>
          <ol>
            {result.prioritySignals.map((item) => (
              <li className={`signal-${item.tier}`} key={item.question.id}>
                <div className="diagnostic-signal-heading">
                  <span>Q{String(item.question.number).padStart(2, "0")}</span>
                  <div>
                    <h3>{item.question.category}</h3>
                    <p>{item.question.placementArea}</p>
                  </div>
                  <strong>{item.tier}</strong>
                </div>
                <dl>
                  <div>
                    <dt>Your signal</dt>
                    <dd>
                      Option {item.selectedOption.id} ·{" "}
                      {item.response.confidence} confidence
                    </dd>
                  </div>
                  <div>
                    <dt>Model evidence</dt>
                    <dd>{item.selectedOption.feedback}</dd>
                  </div>
                  <div>
                    <dt>Connection</dt>
                    <dd>{item.question.connection}</dd>
                  </div>
                </dl>
                {item.misconceptionTag ? (
                  <p className="diagnostic-misconception-tag">
                    Instructor routing tag: <code>{item.misconceptionTag}</code>
                  </p>
                ) : null}
              </li>
            ))}
          </ol>
        </section>

        <aside className="diagnostic-result-caveat">
          <strong>Interpretation boundary</strong>
          <p>
            These results are hypotheses for instruction. Before accelerating,
            your instructor will ask for an explanation, a code trace, or a
            transfer example. Progress is stored only in this browser.
          </p>
        </aside>

        <div className="diagnostic-result-actions">
          <button type="button" onClick={copyLearningBrief}>
            Copy learning brief
          </button>
          <button type="button" onClick={() => window.print()}>
            Print or save as PDF
          </button>
          <Link href="/modules">Open the course library</Link>
          <button
            className="diagnostic-reset-action"
            type="button"
            onClick={requestReset}
          >
            {resetArmed ? "Confirm reset all progress" : "Reset diagnostic"}
          </button>
          {resetArmed ? (
            <button type="button" onClick={() => setResetArmed(false)}>
              Keep my answers
            </button>
          ) : null}
          <p className="diagnostic-copy-status" aria-live="polite">
            {copyState === "copied"
              ? "Learning brief copied."
              : copyState === "failed"
                ? "Copy was unavailable. Use Print or save as PDF instead."
                : ""}
          </p>
        </div>
      </section>
    );
  }

  const nextQuestion =
    diagnosticQuestions[currentIndex + 1] ??
    diagnosticQuestions.find(
      (candidate) =>
        !attempt.responsesByQuestionId[candidate.id]?.revealed,
    );

  return (
    <section
      className="diagnostic-experience"
      aria-labelledby="diagnostic-title"
      data-hydrated={hydrated}
    >
      <header className="diagnostic-experience-hero">
        <div>
          <p className="kicker">Module 0 · 13 reasoning probes</p>
          <h1 id="diagnostic-title">
            Quick to answer.
            <em>Deep enough to route your learning.</em>
          </h1>
          <p>
            Read, predict, and choose. Then record confidence before seeing the
            explanation. The pair reveals more than a score ever could.
          </p>
        </div>
        <aside className="diagnostic-method-note">
          <strong>No penalty for uncertainty.</strong>
          <p>
            Low-confidence correctness needs strengthening. High-confidence
            error needs a counterexample. Both are useful evidence.
          </p>
        </aside>
      </header>

      <div className="diagnostic-progress-region">
        <div>
          <span>
            {revealedCount} of {diagnosticQuestions.length} models revealed
          </span>
          <span>
            {persistence === "loading"
              ? "Restoring saved progress…"
              : persistence === "saved"
                ? "Saved on this device"
                : "Browser storage unavailable"}
          </span>
        </div>
        <progress
          aria-label={`${revealedCount} of ${diagnosticQuestions.length} questions revealed`}
          max={diagnosticQuestions.length}
          value={revealedCount}
        />
      </div>

      {restoredProgress ? (
        <aside className="diagnostic-resume-note" role="status">
          <strong>Welcome back.</strong> Your locally saved responses were
          restored, so you can continue from the reasoning map.
        </aside>
      ) : null}

      <div className="diagnostic-workspace">
        <nav
          className="diagnostic-question-map"
          aria-label="Diagnostic questions"
        >
          <p>Reasoning map</p>
          <ol>
            {diagnosticQuestions.map((candidate) => {
              const candidateResponse =
                attempt.responsesByQuestionId[candidate.id];
              const isCurrent = candidate.id === question.id;
              const status = candidateResponse?.revealed
                ? "revealed"
                : candidateResponse?.optionId ||
                    candidateResponse?.confidence
                  ? "in progress"
                  : "not answered";
              return (
                <li key={candidate.id}>
                  <button
                    aria-current={isCurrent ? "step" : undefined}
                    aria-label={`Question ${candidate.number}: ${candidate.category}; ${status}`}
                    className={
                      candidateResponse?.revealed
                        ? "is-revealed"
                        : candidateResponse?.optionId ||
                            candidateResponse?.confidence
                          ? "is-started"
                          : ""
                    }
                    type="button"
                    onClick={() => goToQuestion(candidate.id)}
                  >
                    <span>{String(candidate.number).padStart(2, "0")}</span>
                    <small>Arc {candidate.arc}</small>
                  </button>
                </li>
              );
            })}
          </ol>
          <button
            className="diagnostic-map-reset"
            type="button"
            onClick={requestReset}
          >
            {resetArmed ? "Confirm reset" : "Reset all answers"}
          </button>
          {resetArmed ? (
            <button
              className="diagnostic-reset-cancel"
              type="button"
              onClick={() => setResetArmed(false)}
            >
              Keep answers
            </button>
          ) : null}
        </nav>

        <article className="diagnostic-question-card">
          <header className="diagnostic-question-heading">
            <div>
              <span>
                Question {question.number} / {diagnosticQuestions.length}
              </span>
              <span>Arc {question.arc}</span>
            </div>
            <p>{question.category}</p>
            <h2 ref={questionHeadingRef} tabIndex={-1}>
              {question.prompt}
            </h2>
            {question.context ? <p>{question.context}</p> : null}
          </header>

          {question.code ? (
            <figure className="diagnostic-code-frame">
              <figcaption>
                Read before answering · {question.codeLanguage ?? "code"}
              </figcaption>
              <pre>
                <code>{question.code}</code>
              </pre>
            </figure>
          ) : null}

          <fieldset className="diagnostic-option-fieldset">
            <legend>Choose the model that best predicts the result</legend>
            <div className="diagnostic-option-list">
              {question.options.map((option) => {
                const selected = response?.optionId === option.id;
                const correct = question.correctOptionId === option.id;
                const stateLabel = optionStateLabel(
                  Boolean(response?.revealed),
                  selected,
                  correct,
                );
                return (
                  <label
                    className={[
                      "diagnostic-option",
                      selected ? "is-selected" : "",
                      response?.revealed && correct ? "is-correct" : "",
                      response?.revealed && selected && !correct
                        ? "needs-review"
                        : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    key={option.id}
                  >
                    <input
                      checked={selected}
                      disabled={response?.revealed}
                      name={`answer-${question.id}`}
                      type="radio"
                      value={option.id}
                      onChange={() =>
                        dispatch({
                          type: "chooseOption",
                          questionId: question.id,
                          optionId: option.id,
                        })
                      }
                    />
                    <span className="diagnostic-option-letter">
                      {option.id}
                    </span>
                    <span className="diagnostic-option-copy">
                      {option.text}
                    </span>
                    {stateLabel ? (
                      <small className="diagnostic-option-state">
                        {stateLabel}
                      </small>
                    ) : null}
                  </label>
                );
              })}
            </div>
          </fieldset>

          <fieldset
            className="diagnostic-confidence-fieldset"
            disabled={response?.revealed}
          >
            <legend>{question.confidencePrompt}</legend>
            <div>
              {confidenceLevels.map((level) => (
                <label
                  className={
                    response?.confidence === level.id ? "is-selected" : ""
                  }
                  key={level.id}
                >
                  <input
                    checked={response?.confidence === level.id}
                    name={`confidence-${question.id}`}
                    type="radio"
                    value={level.id}
                    onChange={() =>
                      dispatch({
                        type: "setConfidence",
                        questionId: question.id,
                        confidence: level.id,
                      })
                    }
                  />
                  <strong>{level.label}</strong>
                  <span>{level.description}</span>
                </label>
              ))}
            </div>
          </fieldset>

          {response?.revealed && signal ? (
            <div
              className={`diagnostic-feedback feedback-${signal.tier}`}
              ref={feedbackRef}
              tabIndex={-1}
              aria-live="polite"
            >
              <header>
                <span>{signal.tier}</span>
                <h3>
                  {signal.correct
                    ? signal.tier === "ready"
                      ? "This model holds—and you can defend it."
                      : "This model holds; now make it easier to retrieve."
                    : "This is a useful model to repair."}
                </h3>
              </header>
              <p>{signal.selectedOption.feedback}</p>
              {!signal.correct ? (
                <p>
                  <strong>Correct model:</strong>{" "}
                  {signal.correctOption.text}
                </p>
              ) : null}
              <dl>
                <div>
                  <dt>Why</dt>
                  <dd>{question.rationale}</dd>
                </div>
                <div>
                  <dt>Why it matters later</dt>
                  <dd>{question.connection}</dd>
                </div>
                <div>
                  <dt>Connected repair or transfer</dt>
                  <dd>
                    <Link href={question.route.href}>
                      Module {question.route.moduleNumber}:{" "}
                      {question.route.section}
                      <span aria-hidden="true"> ↗</span>
                    </Link>
                  </dd>
                </div>
              </dl>
            </div>
          ) : (
            <div className="diagnostic-reveal-row">
              <button
                disabled={!response?.optionId || !response?.confidence}
                type="button"
                onClick={revealCurrentModel}
              >
                Reveal the model
              </button>
              <p>
                Answer and confidence are both required. They lock after the
                explanation appears.
              </p>
            </div>
          )}

          <footer className="diagnostic-question-controls">
            <button
              disabled={currentIndex === 0}
              type="button"
              onClick={() =>
                goToQuestion(diagnosticQuestions[currentIndex - 1].id)
              }
            >
              <span aria-hidden="true">←</span> Previous
            </button>
            {allRevealed ? (
              <button type="button" onClick={completeDiagnostic}>
                Build my learning route <span aria-hidden="true">→</span>
              </button>
            ) : nextQuestion ? (
              <button
                disabled={!response?.revealed}
                type="button"
                onClick={() => goToQuestion(nextQuestion.id)}
              >
                Next question <span aria-hidden="true">→</span>
              </button>
            ) : null}
          </footer>
        </article>
      </div>

      <p className="diagnostic-version-note">
        Assessment {DIAGNOSTIC_ASSESSMENT_VERSION}. Answers remain in this
        browser unless you copy or print the learning brief. On a shared
        device, use Reset all answers when you finish.
      </p>
    </section>
  );
}
