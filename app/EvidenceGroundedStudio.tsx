"use client";

import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import styles from "./EvidenceGroundedStudio.module.css";

type StudioView =
  | "purpose"
  | "lineage"
  | "ranking"
  | "evaluation"
  | "control"
  | "agent";
type Confidence = 1 | 2 | 3 | 4;
type ViewRecord = {
  choice: string | null;
  confidence: Confidence | null;
  revealed: boolean;
};
type StudioRecord = Record<StudioView, ViewRecord>;

const STUDIO_STORAGE_KEY = "atlas-academy.module25-evidence-studio.v1";
const CORE_RULE =
  "Atlas may present a versioned, purpose-scoped suggestion only from authorized minimal data, a declared candidate set, and a named policy or model. Every suggestion preserves provenance, version, evaluation scope, and limitations; it exposes an accessible explanation and meaningful override. A score never silently changes learner state, grants authority, proves truth, establishes causality, or turns feedback into ground truth.";

const views: ReadonlyArray<{
  id: StudioView;
  number: string;
  label: string;
  question: string;
}> = [
  {
    id: "purpose",
    number: "01",
    label: "Purpose → boundary",
    question: "What may the feature decide?",
  },
  {
    id: "lineage",
    number: "02",
    label: "Event → claim",
    question: "Which event can become a feature?",
  },
  {
    id: "ranking",
    number: "03",
    label: "Candidates → reason",
    question: "What comes before a score?",
  },
  {
    id: "evaluation",
    number: "04",
    label: "Score → evidence",
    question: "What does this card actually establish?",
  },
  {
    id: "control",
    number: "05",
    label: "Explanation → override",
    question: "Who owns the next action?",
  },
  {
    id: "agent",
    number: "06",
    label: "Proposal → review",
    question: "What does an AI output authorize?",
  },
];

const choiceIdsByView: Record<StudioView, ReadonlyArray<string>> = {
  purpose: ["optional", "automatic", "engagement"],
  lineage: ["before", "after", "all"],
  ranking: ["set", "score", "click"],
  evaluation: ["bounded", "truth", "fair"],
  control: ["person", "policy", "score"],
  agent: ["proposal", "permission", "citation"],
};

const choices: Record<StudioView, ReadonlyArray<{ id: string; label: string }>> = {
  purpose: [
    { id: "optional", label: "Offer one optional, reversible next-study action." },
    { id: "automatic", label: "Move the learner’s schedule when the score is high." },
    { id: "engagement", label: "Maximize time spent in the product by any available signal." },
  ],
  lineage: [
    { id: "before", label: "A permitted event recorded before the outcome and cutoff." },
    { id: "after", label: "An event recorded after the outcome because it predicts perfectly." },
    { id: "all", label: "Every available event, because more data is always safer." },
  ],
  ranking: [
    { id: "set", label: "A declared candidate set and a transparent baseline." },
    { id: "score", label: "A score first; the system can discover possible actions afterward." },
    { id: "click", label: "The last click, because it already proves preference." },
  ],
  evaluation: [
    { id: "bounded", label: "A limited result on a named held-out fixture and threshold." },
    { id: "truth", label: "That high scores are true and low scores are false." },
    { id: "fair", label: "That the feature is fair, helpful, calibrated, and ready to deploy." },
  ],
  control: [
    { id: "person", label: "The person chooses: accept, dismiss, defer, or choose another action." },
    { id: "policy", label: "The ranking policy chooses once its score crosses a threshold." },
    { id: "score", label: "The largest score chooses because numbers are objective." },
  ],
  agent: [
    { id: "proposal", label: "Only a proposal that still needs source, contract, and test review." },
    { id: "permission", label: "Permission to call tools and change state if the answer is confident." },
    { id: "citation", label: "A verified fact because a citation appears beside it." },
  ],
};

const correctChoice: Record<StudioView, string> = {
  purpose: "optional",
  lineage: "before",
  ranking: "set",
  evaluation: "bounded",
  control: "person",
  agent: "proposal",
};

const feedback: Record<StudioView, { title: string; answer: string; whyOthersFail: string }> = {
  purpose: {
    title: "A feature begins with a bounded human purpose, not an optimization target.",
    answer:
      "The feature may offer a reversible suggestion. It cannot silently update a plan or turn a business proxy into a learner’s goal.",
    whyOthersFail:
      "Automatic schedule mutation crosses the human-control boundary. Maximizing engagement confuses an operator’s metric with a learner’s stated outcome.",
  },
  lineage: {
    title: "Temporal order is part of the data contract.",
    answer:
      "A feature must be permitted and known before both the decision cutoff and the outcome it tries to predict or explain.",
    whyOthersFail:
      "An after-the-outcome event leaks the answer. Collecting every event ignores purpose limitation, provenance, consent, and future misuse.",
  },
  ranking: {
    title: "Candidates and policy come before model output.",
    answer:
      "First name the legitimate options, then compare a readable baseline with any learned score. A ranker cannot justify an undefined action space.",
    whyOthersFail:
      "Scoring before candidate design hides what was eligible. A click can be noisy, constrained, or affected by prior recommendations; it is not automatic ground truth.",
  },
  evaluation: {
    title: "Evaluation is evidence with a denominator, scope, and limitation.",
    answer:
      "The card reports one threshold’s behavior on named held-out synthetic cases. It is a measurement, not a universal product verdict.",
    whyOthersFail:
      "Scores do not prove truth. One aggregate metric does not establish calibration, causal benefit, slice behavior, accessibility, fairness, or safety.",
  },
  control: {
    title: "A recommendation is a decision-support interface, not a command channel.",
    answer:
      "The person sees why the item appeared and can accept, dismiss, defer, or choose another path. Recording that response need not mutate a profile.",
    whyOthersFail:
      "Policy and score express a bounded computation; neither owns a person’s goal, consent, or schedule.",
  },
  agent: {
    title: "Generated text is untrusted input, even when it is fluent or cited.",
    answer:
      "The output can be reviewed as a proposal. A human must inspect provenance, retrieve and verify the evidence, apply the policy, and approve any action separately.",
    whyOthersFail:
      "Confidence does not grant capability. A citation may be irrelevant, stale, fabricated, or insufficient for the particular claim.",
  },
};

const pipeline = [
  {
    id: "need",
    number: "01",
    label: "purpose + harm",
    note: "Who needs what outcome; what must never happen?",
    evidence: "[DECISION CONTRACT]",
  },
  {
    id: "data",
    number: "02",
    label: "minimal lineage",
    note: "Which permitted, time-valid evidence can enter?",
    evidence: "[DATA CONTRACT]",
  },
  {
    id: "set",
    number: "03",
    label: "candidate set",
    note: "What actions are eligible before ranking?",
    evidence: "[POLICY SCOPE]",
  },
  {
    id: "rank",
    number: "04",
    label: "baseline / model",
    note: "What rule yields a labeled ordinal score?",
    evidence: "[VERSIONED METHOD]",
  },
  {
    id: "review",
    number: "05",
    label: "evaluation + limits",
    note: "What does held-out evidence support—and exclude?",
    evidence: "[MEASUREMENT]",
  },
  {
    id: "human",
    number: "06",
    label: "human action",
    note: "Can the person understand, override, or decline?",
    evidence: "[HUMAN CONTROL]",
  },
] as const;

const lineageRows = [
  {
    id: "event",
    stage: "synthetic event",
    value: "Module 16 confidence = low",
    day: "day 12",
    status: "permitted minimal signal",
    tone: "good",
  },
  {
    id: "cutoff",
    stage: "decision cutoff",
    value: "What was knowable when the suggestion was made?",
    day: "day 14",
    status: "boundary",
    tone: "neutral",
  },
  {
    id: "outcome",
    stage: "outcome / label",
    value: "Did the learner later choose and complete a review?",
    day: "day 19",
    status: "not available at day 14",
    tone: "neutral",
  },
  {
    id: "leak",
    stage: "forbidden shortcut",
    value: "Use the day-19 outcome as a day-14 feature",
    day: "day 19 → 14",
    status: "temporal leakage",
    tone: "bad",
  },
] as const;

const rankingCards = [
  {
    id: "repair",
    action: "Repair the cost-model trace",
    signal: "Module 5 prerequisite incomplete",
    score: 8,
    kind: "prerequisite",
  },
  {
    id: "transaction",
    action: "Trace a transaction invariant",
    signal: "Module 16 low-confidence + prerequisite gap",
    score: 13,
    kind: "reasoned baseline",
  },
  {
    id: "runtime",
    action: "Retrieve M24 measurement limits",
    signal: "14-day fixed review interval",
    score: 2,
    kind: "spaced review",
  },
] as const;

const metricCards = [
  { label: "held-out cases", value: "4", note: "synthetic fixture; named denominator" },
  { label: "selected @ 0.70", value: "2", note: "threshold changes the decision rule" },
  { label: "precision", value: "1 / 2", note: "one selected case had the label" },
  { label: "recall", value: "1 / 2", note: "one positive case was not selected" },
] as const;

function blankRecord(): StudioRecord {
  return Object.fromEntries(
    views.map(({ id }) => [id, { choice: null, confidence: null, revealed: false }]),
  ) as StudioRecord;
}

function isConfidence(value: unknown): value is Confidence {
  return value === 1 || value === 2 || value === 3 || value === 4;
}

function isStudioRecord(value: unknown): value is StudioRecord {
  if (!value || typeof value !== "object") {
    return false;
  }
  return views.every(({ id }) => {
    const candidate = (value as Record<string, unknown>)[id];
    if (!candidate || typeof candidate !== "object") {
      return false;
    }
    const record = candidate as Record<string, unknown>;
    return (
      (record.choice === null || choiceIdsByView[id].includes(String(record.choice))) &&
      (record.confidence === null || isConfidence(record.confidence)) &&
      typeof record.revealed === "boolean" &&
      (!record.revealed || (record.choice !== null && record.confidence !== null))
    );
  });
}

function EvidenceLock() {
  return (
    <div className={styles.evidenceLock} role="status">
      <span aria-hidden="true">◎</span>
      <p>
        Make a prediction and name your confidence first. The studio then reveals
        the bounded evidence and the non-claim.
      </p>
    </div>
  );
}

type PredictionGateProps = {
  view: StudioView;
  record: ViewRecord;
  onChoice: (choice: string) => void;
  onConfidence: (confidence: Confidence) => void;
  onReveal: () => void;
};

function PredictionGate({
  view,
  record,
  onChoice,
  onConfidence,
  onReveal,
}: PredictionGateProps) {
  const answer = correctChoice[view];
  const result = feedback[view];
  const isCorrect = record.choice === answer;

  return (
    <section className={styles.gate} aria-labelledby={`${view}-gate-title`}>
      <div className={styles.gateHeading}>
        <span>Prediction gate</span>
        <h3 id={`${view}-gate-title`}>{views.find((item) => item.id === view)?.question}</h3>
        <p>Choose a claim, then rate how sure you are before revealing the review packet.</p>
      </div>

      <div className={styles.choiceGrid} role="radiogroup" aria-label={`Prediction for ${view}`}>
        {choices[view].map((choice) => (
          <button
            aria-checked={record.choice === choice.id}
            className={`${styles.choice} ${record.choice === choice.id ? styles.choiceSelected : ""}`}
            disabled={record.revealed}
            key={choice.id}
            onClick={() => onChoice(choice.id)}
            role="radio"
            type="button"
          >
            <span aria-hidden="true">{record.choice === choice.id ? "●" : "○"}</span>
            {choice.label}
          </button>
        ))}
      </div>

      <div className={styles.confidenceRow} role="group" aria-label="Confidence">
        <span>Confidence</span>
        {([1, 2, 3, 4] as const).map((confidence) => (
          <button
            aria-pressed={record.confidence === confidence}
            disabled={record.revealed}
            key={confidence}
            onClick={() => onConfidence(confidence)}
            type="button"
          >
            {confidence === 1 ? "Guess" : confidence === 2 ? "Somewhat" : confidence === 3 ? "Strong" : "Certain"}
          </button>
        ))}
      </div>

      {!record.revealed && <EvidenceLock />}
      <button
        className={styles.revealButton}
        disabled={record.choice === null || record.confidence === null || record.revealed}
        onClick={onReveal}
        type="button"
      >
        {record.revealed ? "Evidence revealed" : "Reveal the review packet"}
      </button>

      {record.revealed && (
        <div className={`${styles.reveal} ${isCorrect ? styles.revealCorrect : styles.revealRepair}`}>
          <p className={styles.revealLabel}>{isCorrect ? "Your model holds" : "Repair the model"}</p>
          <h4>{result.title}</h4>
          <p><strong>Answer:</strong> {result.answer}</p>
          <p><strong>Why plausible alternatives fail:</strong> {result.whyOthersFail}</p>
          <p className={styles.confidenceReflection}>
            You chose <strong>{record.confidence === 4 ? "certain" : record.confidence === 3 ? "strong" : record.confidence === 2 ? "somewhat" : "guess"}</strong> confidence.
            {isCorrect ? " Keep the evidence boundary in your next design review." : " Revisit the stated boundary before moving on."}
          </p>
        </div>
      )}
    </section>
  );
}

export function EvidenceGroundedStudio() {
  const [activeView, setActiveView] = useState<StudioView>("purpose");
  const [record, setRecord] = useState<StudioRecord>(blankRecord);
  const [storageReady, setStorageReady] = useState(false);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const activeRecord = record[activeView];

  useEffect(() => {
    const hydrationTimer = window.setTimeout(() => {
      try {
        const stored = window.localStorage.getItem(STUDIO_STORAGE_KEY);
        if (stored) {
          const parsed: unknown = JSON.parse(stored);
          if (isStudioRecord(parsed)) {
            setRecord(parsed);
          }
        }
      } catch {
        // Local progress is optional. A malformed or unavailable store changes no lesson evidence.
      } finally {
        setStorageReady(true);
      }
    }, 0);
    return () => window.clearTimeout(hydrationTimer);
  }, []);

  useEffect(() => {
    if (!storageReady) {
      return;
    }
    try {
      window.localStorage.setItem(STUDIO_STORAGE_KEY, JSON.stringify(record));
    } catch {
      // Privacy/browser settings may block local storage; the studio still works in-memory.
    }
  }, [record, storageReady]);

  function updateActiveRecord(update: Partial<ViewRecord>) {
    setRecord((current) => ({
      ...current,
      [activeView]: { ...current[activeView], ...update },
    }));
  }

  function choose(choice: string) {
    updateActiveRecord({ choice, revealed: false });
  }

  function setConfidence(confidence: Confidence) {
    updateActiveRecord({ confidence, revealed: false });
  }

  function reveal() {
    setRecord((current) => {
      const candidate = current[activeView];
      if (!candidate.choice || !candidate.confidence) {
        return current;
      }
      return {
        ...current,
        [activeView]: { ...candidate, revealed: true },
      };
    });
  }

  function selectView(nextIndex: number, focus = false) {
    const normalized = (nextIndex + views.length) % views.length;
    const nextView = views[normalized];
    setActiveView(nextView.id);
    if (focus) {
      tabRefs.current[normalized]?.focus();
    }
  }

  function onTabKeyDown(event: ReactKeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      selectView(index + 1, true);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      selectView(index - 1, true);
    }
    if (event.key === "Home") {
      event.preventDefault();
      selectView(0, true);
    }
    if (event.key === "End") {
      event.preventDefault();
      selectView(views.length - 1, true);
    }
  }

  const gateProps = {
    record: activeRecord,
    onChoice: choose,
    onConfidence: setConfidence,
    onReveal: reveal,
  };

  return (
    <section className={styles.studio} aria-labelledby="evidence-grounded-studio-title">
      <div className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.kicker}>Module 25 interactive decision studio</p>
          <h2 id="evidence-grounded-studio-title">Next-Step Evidence Studio</h2>
          <p>
            A recommendation is not a verdict. Build and review one small Atlas
            suggestion from purpose through evidence, explanation, and a person’s
            right to decline it.
          </p>
          <div className={styles.heroFacts}>
            <span><b>6</b> decision seams</span>
            <span><b>0</b> live learner records</span>
            <span><b>1</b> human owner</span>
          </div>
        </div>
        <div className={styles.constellation} aria-hidden="true">
          <div className={styles.orbitOne} />
          <div className={styles.orbitTwo} />
          <div className={styles.constellationCore}>
            <strong>ASK</strong>
            <small>not command</small>
          </div>
          <span className={styles.starOne}>purpose</span>
          <span className={styles.starTwo}>evidence</span>
          <span className={styles.starThree}>override</span>
        </div>
      </div>

      <div className={styles.invariantPlate}>
        <span>Module 25 working invariant</span>
        <p>{CORE_RULE}</p>
      </div>

      <div className={styles.pipeline} aria-label="Decision-support evidence chain">
        {pipeline.map((stage, index) => (
          <div className={styles.pipelineStage} key={stage.id}>
            <span className={styles.pipelineNumber}>{stage.number}</span>
            <span className={styles.pipelineEvidence}>{stage.evidence}</span>
            <strong>{stage.label}</strong>
            <p>{stage.note}</p>
            {index < pipeline.length - 1 && <i aria-hidden="true">→</i>}
          </div>
        ))}
      </div>

      <div className={styles.tabWrap}>
        <div className={styles.tabs} aria-label="Evidence studio views" role="tablist">
          {views.map((view, index) => (
            <button
              aria-controls={`${view.id}-panel`}
              aria-selected={activeView === view.id}
              className={activeView === view.id ? styles.tabActive : ""}
              id={`${view.id}-tab`}
              key={view.id}
              onClick={() => selectView(index)}
              onKeyDown={(event) => onTabKeyDown(event, index)}
              ref={(element) => { tabRefs.current[index] = element; }}
              role="tab"
              tabIndex={activeView === view.id ? 0 : -1}
              type="button"
            >
              <span>{view.number}</span>
              {view.label}
            </button>
          ))}
        </div>

        <div
          aria-labelledby={`${activeView}-tab`}
          className={styles.panel}
          id={`${activeView}-panel`}
          role="tabpanel"
          tabIndex={0}
        >
          {activeView === "purpose" && (
            <div className={styles.viewGrid}>
              <section className={styles.storyCard}>
                <span>Decision contract</span>
                <h3>Start before prediction.</h3>
                <p>
                  A team asks for “the best next learning step.” That is not a
                  specification. Name the learner’s purpose, the non-goals, the
                  permitted signals, candidate set, policy version, retention
                  boundary, and the action that remains human-owned.
                </p>
                <div className={styles.contractGrid}>
                  <article><b>Purpose</b><p>Offer one optional study action.</p></article>
                  <article><b>Non-goal</b><p>Do not diagnose ability or maximize engagement.</p></article>
                  <article><b>Authority</b><p>Never alter a plan, calendar, or record.</p></article>
                  <article><b>Falsifier</b><p>Reject if a required field or override is missing.</p></article>
                </div>
              </section>
              <PredictionGate view="purpose" {...gateProps} />
            </div>
          )}

          {activeView === "lineage" && (
            <div className={styles.viewGrid}>
              <section className={styles.storyCard}>
                <span>Time-travel inspector</span>
                <h3>Data becomes a claim only through a lineage.</h3>
                <p>
                  Trace each datum through time. A feature may be predictive and
                  still be invalid because it was unknown at the moment a decision
                  had to be made.
                </p>
                <div className={styles.timeline}>
                  {lineageRows.map((row) => (
                    <article className={`${styles.timelineRow} ${styles[`tone${row.tone[0].toUpperCase()}${row.tone.slice(1)}`]}`} key={row.id}>
                      <span>{row.day}</span>
                      <div><b>{row.stage}</b><p>{row.value}</p></div>
                      <em>{row.status}</em>
                    </article>
                  ))}
                </div>
                <p className={styles.nonClaim}>
                  A temporal split protects a particular evaluation question. It
                  does not solve consent, sampling bias, missingness, causality,
                  or future distribution shift.
                </p>
              </section>
              <PredictionGate view="lineage" {...gateProps} />
            </div>
          )}

          {activeView === "ranking" && (
            <div className={styles.viewGrid}>
              <section className={styles.storyCard}>
                <span>Transparent baseline</span>
                <h3>Make the action space and reason readable.</h3>
                <p>
                  The model receives a declared local candidate set. The baseline
                  adds visible points for a prerequisite gap, low confidence, and
                  an overdue review—then labels its output as ordinal priority.
                </p>
                <div className={styles.rankingStack}>
                  {rankingCards.map((card, index) => (
                    <article key={card.id}>
                      <span className={styles.rankPlace}>#{index + 1}</span>
                      <div><b>{card.action}</b><p>{card.signal}</p><em>{card.kind}</em></div>
                      <strong>{card.score}<small>points</small></strong>
                    </article>
                  ))}
                </div>
                <p className={styles.nonClaim}>
                  The points expose a policy. They are not a probability of
                  success, causal estimate, truth value, learner diagnosis, or
                  authority to change anything.
                </p>
              </section>
              <PredictionGate view="ranking" {...gateProps} />
            </div>
          )}

          {activeView === "evaluation" && (
            <div className={styles.viewGrid}>
              <section className={styles.storyCard}>
                <span>Evaluation card</span>
                <h3>Ask what a metric can—not cannot—say.</h3>
                <p>
                  A small synthetic held-out fixture makes threshold tradeoffs
                  visible. It is deliberately too small to support a product claim.
                </p>
                <div className={styles.metricGrid}>
                  {metricCards.map((metric) => (
                    <article key={metric.label}>
                      <span>{metric.label}</span><strong>{metric.value}</strong><p>{metric.note}</p>
                    </article>
                  ))}
                </div>
                <div className={styles.sliceBar} aria-label="Synthetic evaluation slices">
                  <span>new-to-graph</span><i style={{ width: "50%" }} /><span>returning</span><i style={{ width: "50%" }} />
                </div>
                <p className={styles.nonClaim}>
                  Before calling a 0–1 score a probability, demand a target
                  definition, calibration evidence, proper held-out data, and
                  scope. Before calling a feature useful, compare a human-centered
                  baseline and harms as well as numbers.
                </p>
              </section>
              <PredictionGate view="evaluation" {...gateProps} />
            </div>
          )}

          {activeView === "control" && (
            <div className={styles.viewGrid}>
              <section className={styles.storyCard}>
                <span>Accessible decision card</span>
                <h3>“Why this?” must work as a contract.</h3>
                <p>
                  Explanation is not decoration. It lets a person inspect the
                  candidate, policy, limits, and meaningful alternatives before
                  choosing what happens next.
                </p>
                <article className={styles.decisionCard}>
                  <span>Suggested—not scheduled</span>
                  <h4>Trace a transaction invariant</h4>
                  <p><strong>Why it appeared:</strong> Module 16 is marked low-confidence and remains a prerequisite for the capstone dossier.</p>
                  <p><strong>Policy:</strong> transparent-prerequisite-review/v1 · <strong>data:</strong> synthetic local fixture only.</p>
                  <p><strong>Limit:</strong> this does not predict your outcome or decide your plan.</p>
                  <div><button type="button">Accept as an idea</button><button type="button">Dismiss</button><button type="button">Choose another route</button></div>
                </article>
                <p className={styles.nonClaim}>
                  The buttons are an interface specimen, not a connected learner
                  record. Module 25 never sends or changes personal data from this
                  portal.
                </p>
              </section>
              <PredictionGate view="control" {...gateProps} />
            </div>
          )}

          {activeView === "agent" && (
            <div className={styles.viewGrid}>
              <section className={styles.storyCard}>
                <span>Agent boundary map</span>
                <h3>Keep generation outside authority.</h3>
                <p>
                  An LLM, retrieval system, or agent can help draft a proposal.
                  It must remain behind fixed context, redaction, provenance,
                  tests, capability policy, and human approval.
                </p>
                <div className={styles.agentMap}>
                  <article><span>01</span><b>fixed, redacted context</b><p>No ambient profile, credentials, or open-ended source selection.</p></article>
                  <article><span>02</span><b>proposal text + sources</b><p>Output is attributed, inspectable, and allowed to be wrong.</p></article>
                  <article><span>03</span><b>human/evidence review</b><p>Check claim, retrieval, contract, limitations, and tests.</p></article>
                  <article><span>04</span><b>separate approval path</b><p>A named policy and person—not the model—decide any action.</p></article>
                </div>
                <p className={styles.nonClaim}>
                  Retrieval does not prove an answer. A capable model is not a
                  trusted controller. Passing generated tests is not independent
                  evidence when the same agent chose the specification.
                </p>
              </section>
              <PredictionGate view="agent" {...gateProps} />
            </div>
          )}
        </div>
      </div>

      <div className={styles.footerBand}>
        <div>
          <span>Local reference model</span>
          <p>
            A deterministic, synthetic casebook makes each boundary executable
            without live data, an ML API, a model download, or agent tools.
          </p>
        </div>
        <div className={styles.footerLinks}>
          <a href="/downloads/module25_reference.py">Download model</a>
          <a href="/downloads/test_module25_reference.py">Download tests</a>
          <Link href="#module-reading-article">Read the complete Module 25 workbook</Link>
        </div>
      </div>
    </section>
  );
}
