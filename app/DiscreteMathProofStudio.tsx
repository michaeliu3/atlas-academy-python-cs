"use client";

import Link from "next/link";
import {
  type KeyboardEvent as ReactKeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "./DiscreteMathProofStudio.module.css";

type StudioView =
  | "scope"
  | "proof"
  | "invariant"
  | "count"
  | "graph"
  | "order";

type Confidence = 1 | 2 | 3 | 4;

type ViewRecord = {
  choice: string | null;
  confidence: Confidence | null;
  revealed: boolean;
};

type StudioRecord = Record<StudioView, ViewRecord>;

const STORAGE_KEY = "atlas.module27.proof-counterexample-studio.v1";

const views: ReadonlyArray<{
  id: StudioView;
  number: string;
  label: string;
  question: string;
}> = [
  {
    id: "scope",
    number: "01",
    label: "Claim scope",
    question: "Which claim has a witness for every task, rather than one witness for all tasks?",
  },
  {
    id: "proof",
    number: "02",
    label: "Proof repair",
    question: "What is the first missing obligation in the proposed proof?",
  },
  {
    id: "invariant",
    number: "03",
    label: "State & recurrence",
    question: "What turns a promising trace into an invariant or recurrence argument?",
  },
  {
    id: "count",
    number: "04",
    label: "Count & coefficient",
    question: "Which conclusion follows from the partition, without overclaiming?",
  },
  {
    id: "graph",
    number: "05",
    label: "Graph & matching",
    question: "Is the greedy matching maximum, merely maximal, or neither?",
  },
  {
    id: "order",
    number: "06",
    label: "Order defense",
    question: "What must be checked before calling this finite poset a lattice?",
  },
];

const choices: Record<StudioView, ReadonlyArray<{ id: string; label: string }>> = {
  scope: [
    {
      id: "forall-exists",
      label: "For every task x, there exists a compatible review y.",
    },
    {
      id: "exists-forall",
      label: "There exists one review y compatible with every task x.",
    },
    {
      id: "same",
      label: "They are equivalent because both use every and exists.",
    },
  ],
  proof: [
    {
      id: "base",
      label: "The proof needs an initialization/base case before a preservation claim.",
    },
    {
      id: "more-code",
      label: "The proof needs an implementation of the scheduler.",
    },
    {
      id: "diagram",
      label: "The proof needs a prettier graph diagram.",
    },
  ],
  invariant: [
    {
      id: "obligations",
      label: "State initialization, preservation for an arbitrary step, and the exit condition.",
    },
    {
      id: "samples",
      label: "Run the loop on three more inputs and generalize the pattern.",
    },
    {
      id: "measure",
      label: "State only that the loop finished once.",
    },
  ],
  count: [
    {
      id: "partition",
      label: "The two include/exclude cases are disjoint and exhaustive, so their counts add.",
    },
    {
      id: "values",
      label: "The first few Pascal rows prove every binomial identity.",
    },
    {
      id: "convergence",
      label: "Formal coefficient algebra proves numerical convergence for every x.",
    },
  ],
  graph: [
    {
      id: "maximal",
      label: "Maximal but not maximum.",
    },
    {
      id: "maximum",
      label: "Maximum, because no one edge can be added.",
    },
    {
      id: "invalid",
      label: "Not even a matching.",
    },
  ],
  order: [
    {
      id: "every-pair",
      label: "Check that every pair has a unique meet and a unique join.",
    },
    {
      id: "top-bottom",
      label: "Check only that a top and bottom exist.",
    },
    {
      id: "comparability",
      label: "Check that every pair is comparable.",
    },
  ],
};

const correctChoice: Record<StudioView, string> = {
  scope: "forall-exists",
  proof: "base",
  invariant: "obligations",
  count: "partition",
  graph: "maximal",
  order: "every-pair",
};

const feedback: Record<
  StudioView,
  { title: string; answer: string; whyOthersFail: string; boundary: string }
> = {
  scope: {
    title: "A witness may depend on the task.",
    answer:
      "For every x, there exists y allows a different compatible review for each task. The order of quantifiers is part of the model.",
    whyOthersFail:
      "One shared y is a stronger requirement. Counting symbols cannot make the two scopes equivalent.",
    boundary:
      "This two-task table is a countermodel for the converse-style claim; it is not evidence about every real scheduling policy.",
  },
  proof: {
    title: "A trace cannot start an induction for you.",
    answer:
      "An invariant argument needs a base/initialization case, preservation for an arbitrary permitted iteration, and an exit use. The first missing obligation here is initialization.",
    whyOthersFail:
      "Extra code or a clearer diagram might aid communication, but neither supplies a logical implication from one state to the next.",
    boundary:
      "A correct proof still applies only under its declared finite/stable input, comparison, and termination assumptions.",
  },
  invariant: {
    title: "The word arbitrary does real work.",
    answer:
      "Initialization, preservation, and exit use connect every reachable loop state; the recurrence also needs its domain and base terms.",
    whyOthersFail:
      "More sampled inputs and one observed termination are finite evidence, not a preservation proof for an arbitrary next candidate.",
    boundary:
      "The local trace illustrates the claim. It does not establish behavior for a side-effecting iterator or an unspecified tie policy.",
  },
  count: {
    title: "A partition is the reason the recurrence works.",
    answer:
      "A k-subset either excludes the distinguished element or includes it. Those cases are disjoint and exhaustive, yielding Pascal's recurrence.",
    whyOthersFail:
      "Several rows do not prove a universal identity, and formal power-series coefficient algebra does not imply analytic convergence.",
    boundary:
      "The coefficient table is finite evidence. A generating-function manipulation must name whether it is formal or analytic.",
  },
  graph: {
    title: "Locally complete is not globally largest.",
    answer:
      "The chosen edge p—2 blocks both remaining edges, so no edge can be added. Replacing it with p—1 and q—2 produces a matching of size two.",
    whyOthersFail:
      "No addable edge means maximal, not maximum. The choice is a valid matching, so it is not invalid.",
    boundary:
      "This witness refutes a universal greedy claim. It does not say every greedy method fails or analyze a scalable matching algorithm.",
  },
  order: {
    title: "A lattice is a universal pairwise claim.",
    answer:
      "For each pair, identify its greatest lower bound and least upper bound. One missing or non-unique result breaks the lattice claim.",
    whyOthersFail:
      "A top/bottom only helps some bounds; total comparability is stronger than needed and would reject many valid lattices.",
    boundary:
      "A Hasse diagram omits transitive edges. Read the declared relation before drawing a conclusion from its shape.",
  },
};

const blankViewRecord: ViewRecord = {
  choice: null,
  confidence: null,
  revealed: false,
};

const blankRecord: StudioRecord = {
  scope: { ...blankViewRecord },
  proof: { ...blankViewRecord },
  invariant: { ...blankViewRecord },
  count: { ...blankViewRecord },
  graph: { ...blankViewRecord },
  order: { ...blankViewRecord },
};

function isConfidence(value: unknown): value is Confidence {
  return value === 1 || value === 2 || value === 3 || value === 4;
}

function isViewRecord(value: unknown): value is ViewRecord {
  if (!value || typeof value !== "object") {
    return false;
  }
  const candidate = value as Partial<ViewRecord>;
  return (
    (candidate.choice === null || typeof candidate.choice === "string") &&
    (candidate.confidence === null || isConfidence(candidate.confidence)) &&
    typeof candidate.revealed === "boolean"
  );
}

function isStudioRecord(value: unknown): value is StudioRecord {
  if (!value || typeof value !== "object") {
    return false;
  }
  return views.every((view) =>
    isViewRecord((value as Partial<Record<StudioView, unknown>>)[view.id]),
  );
}

function confidenceLabel(confidence: Confidence | null) {
  if (confidence === 1) return "guess";
  if (confidence === 2) return "somewhat sure";
  if (confidence === 3) return "strong";
  if (confidence === 4) return "certain";
  return "not recorded";
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
  const correct = record.choice === answer;
  const availableChoices = choices[view];

  function onChoiceKeyDown(
    event: ReactKeyboardEvent<HTMLButtonElement>,
    choiceIndex: number,
  ) {
    let nextIndex: number | null = null;

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = (choiceIndex + 1) % availableChoices.length;
    }
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex =
        (choiceIndex - 1 + availableChoices.length) % availableChoices.length;
    }
    if (event.key === "Home") {
      nextIndex = 0;
    }
    if (event.key === "End") {
      nextIndex = availableChoices.length - 1;
    }
    if (nextIndex === null) {
      return;
    }

    event.preventDefault();
    onChoice(availableChoices[nextIndex].id);
    const radioButtons = event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>(
      '[role="radio"]',
    );
    radioButtons?.[nextIndex]?.focus();
  }

  return (
    <section className={styles.gate} aria-labelledby={view + "-gate-title"}>
      <div className={styles.gateHeading}>
        <span>Prediction gate</span>
        <h3 id={view + "-gate-title"}>
          {views.find((candidate) => candidate.id === view)?.question}
        </h3>
        <p>
          Choose an explanation and confidence before revealing the argument
          packet. A revision is evidence of learning, not a loss.
        </p>
      </div>

      <div
        aria-label={"Prediction for " + view}
        className={styles.choiceGrid}
        role="radiogroup"
      >
        {availableChoices.map((choice, choiceIndex) => (
          <button
            aria-checked={record.choice === choice.id}
            className={
              record.choice === choice.id
                ? styles.choiceSelected
                : styles.choice
            }
            disabled={record.revealed}
            key={choice.id}
            onClick={() => onChoice(choice.id)}
            onKeyDown={(event) => onChoiceKeyDown(event, choiceIndex)}
            role="radio"
            tabIndex={
              record.choice === null
                ? choiceIndex === 0
                  ? 0
                  : -1
                : record.choice === choice.id
                  ? 0
                  : -1
            }
            type="button"
          >
            <span aria-hidden="true">
              {record.choice === choice.id ? "●" : "○"}
            </span>
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
            {confidence === 1
              ? "Guess"
              : confidence === 2
                ? "Somewhat"
                : confidence === 3
                  ? "Strong"
                  : "Certain"}
          </button>
        ))}
      </div>

      {!record.revealed && (
        <p className={styles.lock} role="status">
          The explanation remains hidden until you make a prediction and record
          confidence.
        </p>
      )}

      <button
        className={styles.revealButton}
        disabled={
          record.choice === null ||
          record.confidence === null ||
          record.revealed
        }
        onClick={onReveal}
        type="button"
      >
        {record.revealed ? "Argument revealed" : "Reveal the argument packet"}
      </button>

      {record.revealed && (
        <div
          className={
            correct
              ? styles.revealCorrect
              : styles.revealRepair
          }
        >
          <span>{correct ? "Your model holds here" : "Repair the model"}</span>
          <h4>{result.title}</h4>
          <p>
            <strong>Reason:</strong> {result.answer}
          </p>
          <p>
            <strong>Why plausible alternatives fail:</strong>{" "}
            {result.whyOthersFail}
          </p>
          <p>
            <strong>Scope boundary:</strong> {result.boundary}
          </p>
          <p className={styles.confidenceReflection}>
            You chose <strong>{confidenceLabel(record.confidence)}</strong>{" "}
            confidence. {correct ? "Keep the boundary visible in a new case." : "Use the smallest counterexample before revising."}
          </p>
        </div>
      )}
    </section>
  );
}

export function DiscreteMathProofStudio() {
  const [activeView, setActiveView] = useState<StudioView>("scope");
  const [record, setRecord] = useState<StudioRecord>(blankRecord);
  const [storageReady, setStorageReady] = useState(false);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const activeRecord = record[activeView];

  useEffect(() => {
    const hydrationTimer = window.setTimeout(() => {
      try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed: unknown = JSON.parse(stored);
          if (isStudioRecord(parsed)) {
            setRecord(parsed);
          }
        }
      } catch {
        // Local progress is optional. This studio stores only choice, confidence,
        // and reveal state; unavailable storage never blocks the lesson.
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
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
    } catch {
      // Browser privacy settings can block storage; the in-memory lesson remains usable.
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
    setActiveView(views[normalized].id);
    if (focus) {
      tabRefs.current[normalized]?.focus();
    }
  }

  function onTabKeyDown(
    event: ReactKeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
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
    <section className={styles.studio} aria-labelledby="discrete-proof-studio-title">
      <div className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.kicker}>Module 27 interactive proof studio</p>
          <h2 id="discrete-proof-studio-title">
            Proof &amp; Counterexample Workbench
          </h2>
          <p>
            A definition earns a domain. A proof earns a conclusion under its
            assumptions. A trace earns one observed result. Make those
            boundaries visible before you accept an answer from code or an AI.
          </p>
          <div className={styles.heroFacts}>
            <span>
              <b>6</b> reasoning lenses
            </span>
            <span>
              <b>0</b> live learner records
            </span>
            <span>
              <b>1</b> claim at a time
            </span>
          </div>
        </div>
        <div className={styles.proofCompass} aria-hidden="true">
          <div className={styles.compassRingOne} />
          <div className={styles.compassRingTwo} />
          <div className={styles.compassCenter}>
            <strong>CLAIM</strong>
            <small>check scope</small>
          </div>
          <span className={styles.compassNorth}>domain</span>
          <span className={styles.compassEast}>proof</span>
          <span className={styles.compassSouth}>boundary</span>
          <span className={styles.compassWest}>trace</span>
        </div>
      </div>

      <div className={styles.invariantPlate}>
        <span>M27 working invariant</span>
        <p>
          Name the domain, definition, assumptions, argument, counterexample
          boundary, and evidence type before accepting a claim.
        </p>
      </div>

      <ol className={styles.reasoningChain} aria-label="M27 reasoning chain">
        <li>
          <strong>1</strong>
          <span>define</span>
        </li>
        <li>
          <strong>2</strong>
          <span>predict</span>
        </li>
        <li>
          <strong>3</strong>
          <span>counterexample</span>
        </li>
        <li>
          <strong>4</strong>
          <span>prove / repair</span>
        </li>
        <li>
          <strong>5</strong>
          <span>trace carefully</span>
        </li>
        <li>
          <strong>6</strong>
          <span>transfer</span>
        </li>
      </ol>

      <div className={styles.tabWrap}>
        <div
          aria-label="Discrete mathematics proof studio views"
          className={styles.tabs}
          role="tablist"
        >
          {views.map((view, index) => (
            <button
              aria-controls={view.id + "-panel"}
              aria-selected={activeView === view.id}
              className={activeView === view.id ? styles.tabActive : ""}
              id={view.id + "-tab"}
              key={view.id}
              onClick={() => selectView(index)}
              onKeyDown={(event) => onTabKeyDown(event, index)}
              ref={(element) => {
                tabRefs.current[index] = element;
              }}
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
          aria-labelledby={activeView + "-tab"}
          className={styles.panel}
          id={activeView + "-panel"}
          role="tabpanel"
          tabIndex={0}
        >
          {activeView === "scope" && (
            <div className={styles.viewGrid}>
              <section className={styles.storyCard}>
                <span>Claim scope lab</span>
                <h3>Quantifiers are choices made in an order.</h3>
                <p>
                  The table is a finite interpretation. A check mark means the
                  left task can be paired with the right review. It gives a
                  small countermodel to the claim that one review must work for
                  every task.
                </p>
                <div className={styles.quantifierBoard}>
                  <div className={styles.quantifierEquation}>
                    <strong>For every task</strong>
                    <i>→ choose a review that may depend on it</i>
                  </div>
                  <table>
                    <caption>Compatibility relation on a two-task fixture</caption>
                    <thead>
                      <tr>
                        <th scope="col">task / review</th>
                        <th scope="col">r1</th>
                        <th scope="col">r2</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th scope="row">t1</th>
                        <td>yes</td>
                        <td>no</td>
                      </tr>
                      <tr>
                        <th scope="row">t2</th>
                        <td>no</td>
                        <td>yes</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className={styles.boundary}>
                  Text equivalent: t1 can use r1 only; t2 can use r2 only.
                  Every task has some compatible review, while no fixed review
                  works for both. This is a countermodel to the stronger
                  fixed-review claim.
                </p>
              </section>
              <PredictionGate view="scope" {...gateProps} />
            </div>
          )}

          {activeView === "proof" && (
            <div className={styles.viewGrid}>
              <section className={styles.storyCard}>
                <span>Proof repair bench</span>
                <h3>Find the first unearned arrow.</h3>
                <p>
                  An agent claims that a scan always returns a maximum-score
                  task. The line numbers make the proof structure inspectable.
                  Do not fix the code yet; locate the missing logical duty.
                </p>
                <ol className={styles.proofLines}>
                  <li>
                    <b>1</b>
                    <p>After three tested inputs, best held the largest score seen.</p>
                  </li>
                  <li className={styles.proofGap}>
                    <b>2</b>
                    <p>Therefore best is largest after every loop iteration.</p>
                  </li>
                  <li>
                    <b>3</b>
                    <p>When the loop ends, best is a maximum of all candidates.</p>
                  </li>
                </ol>
                <div className={styles.repairStrip}>
                  <strong>Repair skeleton</strong>
                  <span>initialize</span>
                  <i aria-hidden="true">→</i>
                  <span>preserve for an arbitrary next item</span>
                  <i aria-hidden="true">→</i>
                  <span>use at exit</span>
                </div>
                <p className={styles.boundary}>
                  The skeleton is not a full proof until score comparison,
                  candidate domain, tie policy, and termination assumptions are
                  stated.
                </p>
              </section>
              <PredictionGate view="proof" {...gateProps} />
            </div>
          )}

          {activeView === "invariant" && (
            <div className={styles.viewGrid}>
              <section className={styles.storyCard}>
                <span>State and recurrence traceboard</span>
                <h3>Trace a pattern; then earn the universal claim.</h3>
                <p>
                  The current best follows a visible pattern for three
                  candidates. The recurrence panel has two base values and a
                  relation. Both panes expose what a trace needs before it
                  becomes a general argument.
                </p>
                <div className={styles.traceColumns}>
                  <article>
                    <h4>Prefix maximum</h4>
                    <table>
                      <caption>Finite scan trace</caption>
                      <thead>
                        <tr>
                          <th scope="col">processed</th>
                          <th scope="col">best</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr><td>none</td><td>none</td></tr>
                        <tr><td>a: 4</td><td>a: 4</td></tr>
                        <tr><td>a, b: 2</td><td>a: 4</td></tr>
                        <tr><td>a, b, c: 7</td><td>c: 7</td></tr>
                      </tbody>
                    </table>
                  </article>
                  <article>
                    <h4>Recurrence trace</h4>
                    <dl className={styles.recurrenceCard}>
                      <div><dt>domain</dt><dd>n ≥ 0</dd></div>
                      <div><dt>bases</dt><dd>a0 = 0, a1 = 1</dd></div>
                      <div><dt>rule</dt><dd>an = a(n−1) + a(n−2)</dd></div>
                      <div><dt>values</dt><dd>0, 1, 1, 2, 3, 5</dd></div>
                    </dl>
                  </article>
                </div>
                <p className={styles.boundary}>
                  The trace is a finite example. The invariant needs
                  initialization, preservation, and exit use; the recurrence
                  needs its domain and base terms before a solution is unique.
                </p>
              </section>
              <PredictionGate view="invariant" {...gateProps} />
            </div>
          )}

          {activeView === "count" && (
            <div className={styles.viewGrid}>
              <section className={styles.storyCard}>
                <span>Counting and coefficient lab</span>
                <h3>Partition the objects before adding numbers.</h3>
                <p>
                  Count the ways to choose k tasks from n by fixing one
                  distinguished task. The coefficient row turns the same
                  include/exclude partition into a formal sequence.
                </p>
                <div className={styles.partitionBoard}>
                  <article>
                    <strong>omit focus task</strong>
                    <span>choose k from n − 1</span>
                    <b>C(n−1, k)</b>
                  </article>
                  <i aria-hidden="true">+</i>
                  <article>
                    <strong>include focus task</strong>
                    <span>choose k − 1 from n − 1</span>
                    <b>C(n−1, k−1)</b>
                  </article>
                </div>
                <div className={styles.coefficientTable}>
                  <span>n</span><span>coefficients by k</span>
                  <span>0</span><span>1</span>
                  <span>1</span><span>1  1</span>
                  <span>2</span><span>1  2  1</span>
                  <span>3</span><span>1  3  3  1</span>
                </div>
                <p className={styles.boundary}>
                  Text equivalent: each row starts and ends with one. Every
                  interior entry is the sum of the two entries above it. This
                  is a finite view of Pascal&apos;s recurrence, not a proof that an
                  analytic series converges.
                </p>
              </section>
              <PredictionGate view="count" {...gateProps} />
            </div>
          )}

          {activeView === "graph" && (
            <div className={styles.viewGrid}>
              <section className={styles.storyCard}>
                <span>Graph and matching lab</span>
                <h3>One greedy edge can block a better assignment.</h3>
                <p>
                  Edges run from task to available reviewer. The chosen
                  matching contains p—2. Inspect its endpoint use before
                  claiming it is globally largest.
                </p>
                <div className={styles.matchingBoard}>
                  <div className={styles.matchingSide}>
                    <strong>tasks</strong>
                    <span>p</span>
                    <span>q</span>
                  </div>
                  <div className={styles.edgeList}>
                    <strong>declared edges</strong>
                    <span>p — 1</span>
                    <span className={styles.chosenEdge}>p — 2 (chosen)</span>
                    <span>q — 2</span>
                  </div>
                  <div className={styles.matchingSide}>
                    <strong>reviewers</strong>
                    <span>1</span>
                    <span>2</span>
                  </div>
                </div>
                <div className={styles.alternatingWitness}>
                  <strong>Repair witness</strong>
                  <span>replace p—2 with p—1 and q—2</span>
                  <b>size 2</b>
                </div>
                <p className={styles.boundary}>
                  Text equivalent: the selected edge uses p and 2, so neither
                  remaining edge can be added. It is maximal. Replacing it
                  exposes a matching of size two, so it was not maximum.
                </p>
              </section>
              <PredictionGate view="graph" {...gateProps} />
            </div>
          )}

          {activeView === "order" && (
            <div className={styles.viewGrid}>
              <section className={styles.storyCard}>
                <span>Order defense board</span>
                <h3>Incomparable is not undefined.</h3>
                <p>
                  A Hasse-style relation table shows requirement bundles under
                  subset. It omits reflexive and transitive edges on purpose.
                  Check meet and join for every pair before using the word
                  lattice.
                </p>
                <div className={styles.orderBoard}>
                  <article>
                    <strong>cover relations</strong>
                    <span>∅ &lt; {"{proof}"}</span>
                    <span>∅ &lt; {"{graphs}"}</span>
                    <span>{"{proof}"} &lt; {"{proof, graphs}"}</span>
                    <span>{"{graphs}"} &lt; {"{proof, graphs}"}</span>
                  </article>
                  <article>
                    <strong>pair to inspect</strong>
                    <span>{"{proof}"} and {"{graphs}"}</span>
                    <b>meet: ∅</b>
                    <b>join: {"{proof, graphs}"}</b>
                  </article>
                </div>
                <p className={styles.boundary}>
                  Text equivalent: proof and graphs are incomparable, yet the
                  empty bundle is their greatest lower bound and the combined
                  bundle is their least upper bound. A single successful pair
                  still does not prove the every-pair lattice condition.
                </p>
              </section>
              <PredictionGate view="order" {...gateProps} />
            </div>
          )}
        </div>
      </div>

      <div className={styles.footerBand}>
        <div>
          <span>Local finite teaching model</span>
          <p>
            The downloadable model can classify a finite relation, trace a DAG
            or cycle witness, expose maximal-versus-maximum matching, make bases
            visible in a recurrence, and check a modular-inverse precondition.
            It is deliberately not a theorem prover or production planner.
          </p>
        </div>
        <div className={styles.footerLinks}>
          <a href="/downloads/module27_reference.py">Download model</a>
          <a href="/downloads/test_module27_reference.py">Download tests</a>
          <Link href="#module-reading-article">
            Read the complete Module 27 workbook
          </Link>
        </div>
      </div>
    </section>
  );
}
