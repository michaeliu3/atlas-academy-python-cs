"use client";

import Link from "next/link";
import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import {
  DIAGNOSTIC_ASSESSMENT_VERSION,
  buildDiagnosticResult,
  classifyResponse,
  confidenceLevels,
  createEmptyAttempt,
  diagnosticQuestions,
  diagnosticReducer,
  toLearningBrief,
} from "@/lib/diagnostic-model";
import {
  clearDiagnosticProgress,
  persistDiagnosticProgress,
  restoreDiagnosticProgress,
} from "@/lib/diagnostic-progress-codec";
import { getBrowserProgressStorage } from "@/lib/browser-progress-storage";
import { canExportApprovedDraft } from "@/lib/learner-controlled-export";

type DiagnosticAttempt = ReturnType<typeof createEmptyAttempt>;
type DiagnosticAction = Parameters<typeof diagnosticReducer>[1];
type CopyState = "idle" | "approval-required" | "copied" | "printed" | "failed";
type PersistenceState = "loading" | "ready" | "saved" | "unavailable";
type AcademicPrerequisite = {
  moduleNumber: number;
  moduleTitle: string;
  availability: string;
  lifecycle: string;
};
const diagnosticProbeKicker = `Module 0 · ${diagnosticQuestions.length} reasoning probes`;

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
  const [approvedLearningBrief, setApprovedLearningBrief] = useState<string | null>(null);
  const [resetArmed, setResetArmed] = useState(false);
  const [restoredProgress, setRestoredProgress] = useState(false);
  const [questionFocusVersion, setQuestionFocusVersion] = useState(0);
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
        const storage = getBrowserProgressStorage();
        if (!storage) {
          setPersistence("unavailable");
          return;
        }
        const stored = restoreDiagnosticProgress(storage) as DiagnosticAttempt | null;
        if (stored) {
          dispatch({ type: "hydrate", attempt: stored });
          setRestoredProgress(
            Object.keys(stored.responsesByQuestionId).length > 0,
          );
          setPersistence("saved");
        } else {
          setPersistence("ready");
        }
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
    try {
      const storage = getBrowserProgressStorage();
      if (!storage) {
        window.queueMicrotask(() => setPersistence("unavailable"));
        return;
      }
      const persisted = persistDiagnosticProgress(storage, attempt);
      if (persisted) {
        window.queueMicrotask(() => setPersistence("saved"));
      } else if (Object.keys(attempt.responsesByQuestionId).length > 0) {
        window.queueMicrotask(() => setPersistence("unavailable"));
      } else {
        window.queueMicrotask(() => setPersistence("ready"));
      }
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
  const learningBrief = useMemo(() => toLearningBrief(attempt), [attempt]);
  const learningBriefApproved = canExportApprovedDraft(
    approvedLearningBrief,
    learningBrief,
  );

  useLayoutEffect(() => {
    if (questionFocusVersion === 0) {
      return;
    }
    questionHeadingRef.current?.focus();
  }, [question.id, questionFocusVersion]);

  function goToQuestion(questionId: string) {
    setResetArmed(false);
    setQuestionFocusVersion((version) => version + 1);
    dispatch({ type: "goTo", questionId });
  }

  function revealCurrentModel() {
    dispatch({ type: "reveal", questionId: question.id });
    window.requestAnimationFrame(() => feedbackRef.current?.focus());
  }

  function completeDiagnostic() {
    dispatch({ type: "complete" });
  }

  function resetDiagnostic() {
    try {
      const storage = getBrowserProgressStorage();
      if (!storage) {
        setPersistence("unavailable");
      } else {
        setPersistence(clearDiagnosticProgress(storage) ? "ready" : "unavailable");
      }
    } catch {
      setPersistence("unavailable");
    }
    setCopyState("idle");
    setApprovedLearningBrief(null);
    setResetArmed(false);
    setRestoredProgress(false);
    setQuestionFocusVersion((version) => version + 1);
    dispatch({ type: "reset" });
  }

  function requestReset() {
    if (resetArmed) {
      resetDiagnostic();
      return;
    }
    setResetArmed(true);
  }

  async function copyLearningBrief() {
    if (!learningBriefApproved) {
      setCopyState("approval-required");
      return;
    }
    try {
      if (window.navigator.clipboard?.writeText) {
        await window.navigator.clipboard.writeText(learningBrief);
      } else {
        const transfer = document.createElement("textarea");
        transfer.value = learningBrief;
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

  function printLearningBrief() {
    if (!learningBriefApproved) {
      setCopyState("approval-required");
      return;
    }
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      setCopyState("failed");
      return;
    }
    printWindow.opener = null;
    const printDocument = printWindow.document;
    printDocument.title = "Atlas Academy learning brief";
    const main = printDocument.createElement("main");
    const heading = printDocument.createElement("h1");
    const boundary = printDocument.createElement("p");
    const brief = printDocument.createElement("pre");
    heading.textContent = "Atlas Academy learning brief";
    boundary.textContent =
      "Learner-approved, minimal summary. This page omits the full diagnostic ledger.";
    brief.textContent = learningBrief;
    main.appendChild(heading);
    main.appendChild(boundary);
    main.appendChild(brief);
    printDocument.body.replaceChildren(main);
    printDocument.body.style.cssText =
      "color: #101322; font-family: system-ui, sans-serif; margin: 2rem;";
    heading.style.cssText = "font-size: 1.4rem; margin: 0 0 0.5rem;";
    boundary.style.cssText = "color: #3a4652; line-height: 1.5; margin: 0 0 1.5rem;";
    brief.style.cssText =
      "font-family: ui-monospace, SFMono-Regular, Consolas, monospace; font-size: 0.78rem; line-height: 1.55; white-space: pre-wrap;";
    printWindow.focus();
    window.setTimeout(() => printWindow.print(), 0);
    setCopyState("printed");
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
            <h2 id="learning-route-title">Your evidence-led repair queue</h2>
            <p>
              This prioritized queue sits inside, rather than replaces, the
              canonical route. A diagnostic can focus attention; it cannot
              erase prerequisites without a transfer check.
            </p>
            <p>
              <Link href="/route">Open the canonical 60-day route</Link>
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
                  {route.academicPrerequisites.length > 0 ? (
                    <p className="diagnostic-prerequisite-note">
                      <strong>Keep the academic route intact:</strong>{" "}
                      {route.academicPrerequisites.map(
                        (
                          prerequisite: AcademicPrerequisite,
                          prerequisiteIndex: number,
                        ) => (
                          <span key={prerequisite.moduleNumber}>
                            {prerequisiteIndex > 0 ? "; " : ""}
                            Module {prerequisite.moduleNumber} —{" "}
                            {prerequisite.moduleTitle}
                          </span>
                        ),
                      )}{" "}
                      must be secured before this section is treated as a
                      repair target.
                    </p>
                  ) : null}
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
          className="diagnostic-bridge-plan"
          aria-labelledby="bridge-plan-title"
        >
          <header>
            <p className="kicker">Adaptive foundation bridges</p>
            <h2 id="bridge-plan-title">What to rebuild before moving faster</h2>
            <p>
              Each recommendation is tied to the reasoning signal that raised
              it. It starts with an open foundation; a later extension is
              named only when it is not yet available.
            </p>
          </header>

          {result.bridgeRecommendations.length > 0 ? (
            <ol>
              {result.bridgeRecommendations.map((recommendation) => (
                <li key={recommendation.area.id}>
                  <div>
                    <p className="diagnostic-bridge-area">
                      {recommendation.area.label}
                    </p>
                    <h3>{recommendation.questionCategory}</h3>
                    <p>{recommendation.area.whyItMatters}</p>
                  </div>
                  <div className="diagnostic-bridge-action">
                    <p>
                      Q{String(recommendation.questionNumber).padStart(2, "0")}
                      {" · "}
                      <strong>{recommendation.tier}</strong> signal
                    </p>
                    <Link href={recommendation.route.href}>
                      Rebuild with open Module {recommendation.route.moduleNumber}
                      <span aria-hidden="true"> ↗</span>
                    </Link>
                    {recommendation.route.academicPrerequisites.length > 0 ? (
                      <p className="diagnostic-prerequisite-note">
                        <strong>
                          Direct academic prerequisite
                          {recommendation.route.academicPrerequisites.length === 1
                            ? ""
                            : "s"}
                          :
                        </strong>{" "}
                        {recommendation.route.academicPrerequisites.map(
                          (
                            prerequisite: AcademicPrerequisite,
                            prerequisiteIndex: number,
                          ) => (
                            <span key={prerequisite.moduleNumber}>
                              {prerequisiteIndex > 0 ? "; " : ""}
                              Module {prerequisite.moduleNumber} —{" "}
                              {prerequisite.moduleTitle}
                            </span>
                          ),
                        )}{" "}
                        This repair link does not waive that route.
                      </p>
                    ) : null}
                    {recommendation.extension ? (
                      <p className="diagnostic-extension-boundary">
                        <strong>
                          Future extension: Module {recommendation.extension.moduleNumber} {recommendation.extension.title} is {recommendation.extension.status}.
                        </strong>{" "}
                        {recommendation.extension.note}
                      </p>
                    ) : null}
                  </div>
                </li>
              ))}
            </ol>
          ) : (
            <div className="diagnostic-transfer-note">
              <strong>No foundation bridge needs automatic repair.</strong>
              <p>
                Use an instructor transfer conversation to test your ready
                models in a new context. The connected route remains intact.
              </p>
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
          <fieldset className="diagnostic-export-consent">
            <legend>Review before manual copy or print</legend>
            <label>
              <input
                checked={learningBriefApproved}
                onChange={(event) => {
                  setApprovedLearningBrief(event.target.checked ? learningBrief : null);
                  setCopyState("idle");
                }}
                type="checkbox"
              />
              <span>I reviewed this learning brief and approve copying or printing it myself.</span>
            </label>
            <p id="diagnostic-export-consent-note">
              Only the concise learning brief is copied or printed. Your full results stay in this portal and local browser state.
            </p>
          </fieldset>
          <button
            aria-describedby="diagnostic-export-consent-note"
            disabled={!learningBriefApproved}
            type="button"
            onClick={copyLearningBrief}
          >
            Copy learning brief
          </button>
          <button
            aria-describedby="diagnostic-export-consent-note"
            disabled={!learningBriefApproved}
            type="button"
            onClick={printLearningBrief}
          >
            Print approved brief
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
              : copyState === "printed"
                ? "Printable learning brief opened."
                : copyState === "approval-required"
                  ? "Review the current brief before copying or printing it."
              : copyState === "failed"
                ? "Copy or print was unavailable. You can select only the reviewed brief manually."
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
          <p className="kicker">{diagnosticProbeKicker}</p>
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
              ? "Preparing optional local-only progress…"
              : persistence === "saved"
                ? "Progress saved only in this browser"
                : persistence === "ready"
                  ? "Local-only progress is available"
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
              <pre
                aria-label={`Scrollable ${question.codeLanguage ?? "code"} diagnostic example`}
                tabIndex={0}
              >
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
                    <strong>{level.label}</strong>{" "}
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
