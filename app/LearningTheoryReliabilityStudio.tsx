"use client";

import Link from "next/link";
import { type KeyboardEvent as ReactKeyboardEvent, useRef, useState } from "react";
import { StudioFigure } from "./StudioFigure";
import styles from "./AdvancedStudio.module.css";

/**
 * Session 3's capacity fixture: as the hypothesis class grows, empirical risk
 * falls while the estimation gap widens. The sum is what matters.
 */
const capacityRiskFigureSpec = {
  kind: "plot",
  width: 440,
  height: 280,
  xLabel: "class capacity",
  yLabel: "risk",
  xRange: [0.5, 6.5],
  yRange: [0, 1.05],
  series: [
    {
      points: [
        [1, 0.72],
        [2, 0.48],
        [3, 0.32],
        [4, 0.2],
        [5, 0.12],
        [6, 0.06],
      ],
      label: "empirical risk",
    },
    {
      points: [
        [1, 0.08],
        [2, 0.13],
        [3, 0.21],
        [4, 0.34],
        [5, 0.52],
        [6, 0.78],
      ],
      tone: 4,
      label: "estimation gap",
    },
  ],
} as const;

type StudioView =
  | "gaps"
  | "capacity"
  | "bounds"
  | "numerics"
  | "shift"
  | "authority";

type Confidence = 1 | 2 | 3 | 4;

type ViewRecord = {
  choice: string | null;
  confidence: Confidence | null;
  revealed: boolean;
};

type StudioRecord = Record<StudioView, ViewRecord>;

const views: ReadonlyArray<{
  id: StudioView;
  number: string;
  label: string;
  question: string;
}> = [
  {
    id: "gaps",
    number: "01",
    label: "Three gaps",
    question: "Empirical risk is zero. What follows immediately?",
  },
  {
    id: "capacity",
    number: "02",
    label: "Capacity",
    question: "A richer class fits better. Is that an improvement?",
  },
  {
    id: "bounds",
    number: "03",
    label: "Theorem scope",
    question: "A bound holds with probability 1 − δ. Over what?",
  },
  {
    id: "numerics",
    number: "04",
    label: "Numerical evidence",
    question: "Two runs of identical code differ. What is established?",
  },
  {
    id: "shift",
    number: "05",
    label: "Shift & robustness",
    question: "The model is robust on the declared threat set. And beyond it?",
  },
  {
    id: "authority",
    number: "06",
    label: "Human control",
    question: "The bound holds and the monitor is green. May it run unattended?",
  },
];

const choices: Record<StudioView, ReadonlyArray<{ id: string; label: string }>> = {
  gaps: [
    {
      id: "finite-calculation-only",
      label:
        "A finite empirical-loss calculation is zero under this sample, loss, and procedure.",
    },
    { id: "population-risk-zero", label: "Population risk is zero." },
    { id: "generalizes-to-every-relation", label: "The model generalises to every future relation." },
  ],
  capacity: [
    {
      id: "gap-widens-as-fit-improves",
      label:
        "Not by itself — the empirical fit improves while the estimation gap widens; only their sum matters.",
    },
    { id: "lower-training-error-is-better", label: "Yes — lower training error is the goal." },
    { id: "capacity-always-helps", label: "Yes — a richer class can express more." },
  ],
  bounds: [
    {
      id: "over-draws-of-the-sample",
      label:
        "Over draws of the sample from the declared distribution — not over future inputs or deployments.",
    },
    { id: "over-future-inputs", label: "Over the inputs the model will see in production." },
    { id: "over-model-choices", label: "Over the choice of model." },
  ],
  numerics: [
    {
      id: "environment-is-part-of-the-result",
      label:
        "That the computation depends on more than the source: dtype, reduction order, kernel, and device are part of the result.",
    },
    { id: "one-run-is-wrong", label: "One of the two runs is wrong." },
    { id: "difference-is-negligible", label: "The difference is negligible and can be ignored." },
  ],
  shift: [
    {
      id: "threat-set-bounds-the-claim",
      label:
        "Nothing — robustness is defined relative to the declared perturbation set, and shift outside it is unconstrained.",
    },
    { id: "robust-means-robust", label: "It is robust generally." },
    { id: "larger-set-follows", label: "Robustness extends to any smaller perturbation." },
  ],
  authority: [
    {
      id: "monitors-detect-failure-only",
      label:
        "No — a green monitor is the absence of a detected failure, and a bound constrains one gap under its hypotheses.",
    },
    { id: "bound-plus-monitor-suffices", label: "Yes — a bound plus monitoring is sufficient evidence." },
    { id: "unattended-if-accurate", label: "Yes — sufficient accuracy justifies unattended operation." },
  ],
};

const correctChoice: Record<StudioView, string> = {
  gaps: "finite-calculation-only",
  capacity: "gap-widens-as-fit-improves",
  bounds: "over-draws-of-the-sample",
  numerics: "environment-is-part-of-the-result",
  shift: "threat-set-bounds-the-claim",
  authority: "monitors-detect-failure-only",
};

const feedback: Record<
  StudioView,
  { title: string; answer: string; whyOthersFail: string; boundary: string }
> = {
  gaps: {
    title: "Empirical risk is an average over the sample you have",
    answer:
      "Zero empirical risk says the loss summed to zero on those examples under that loss function. Population risk is an expectation over a distribution, and the difference between them is the estimation gap the whole module exists to name.",
    whyOthersFail:
      "Equating the two ignores that the sample is finite. A generalisation claim about every future relation additionally assumes the relation does not change, which nothing here establishes.",
    boundary:
      "Held-out data estimates the gap. It does not eliminate it, and it estimates it only for the distribution the held-out set came from.",
  },
  capacity: {
    title: "Fit and generalisation move in opposite directions",
    answer:
      "Enlarging the hypothesis class lowers the achievable empirical risk and raises the gap between empirical and population risk. The quantity of interest is the sum, which typically falls and then rises.",
    whyOthersFail:
      "Minimising training error selects the largest class every time. Expressiveness is a property of the class, not evidence about performance on unseen data.",
    boundary:
      "The trade-off shape depends on the sample size. Growing the sample moves the minimum, which is why capacity choices do not transfer between dataset sizes.",
  },
  bounds: {
    title: "The probability is over the sampling, not the future",
    answer:
      "A statement holding with probability at least 1 − δ quantifies over draws of the training sample from the declared distribution. It says that most samples yield a model whose gap is small — nothing about inputs from a different distribution.",
    whyOthersFail:
      "Reading it over production inputs silently assumes deployment matches the training distribution. Reading it over model choices confuses the randomness in the data with a choice made by a person.",
    boundary:
      "Confidence 1 − δ is not a guarantee. One sample in 1/δ is expected to violate the bound, by construction.",
  },
  numerics: {
    title: "The environment is part of the computation",
    answer:
      "Identical source can produce different numbers through a different reduction order, a different kernel, a different dtype, or non-deterministic device scheduling. The result is a property of source plus environment, not source alone.",
    whyOthersFail:
      "Calling one run wrong assumes a unique correct answer in floating-point, which non-associativity denies. Dismissing the difference discards the only signal that the environment matters here.",
    boundary:
      "Pinning dtype, kernels, and seeds bounds the variation on one device class. It does not make results portable across hardware.",
  },
  shift: {
    title: "Robustness is indexed by a declared set",
    answer:
      "A robustness claim states that performance holds for perturbations inside a named set — a norm ball, a corruption family, a stated transformation. Outside it, the claim is silent, and real distribution shift routinely leaves it.",
    whyOthersFail:
      "General robustness is not a well-formed claim without a set. Extension to smaller perturbations sounds safe but does not follow: a smaller set in one metric may not be contained in the declared one.",
    boundary:
      "Testing on a corruption family bounds that family. Every other shift remains unexamined.",
  },
  authority: {
    title: "A monitor detects the failures it was built to detect",
    answer:
      "A green monitor means no configured detector fired. That is the absence of one kind of evidence, not the presence of correctness. Combined with a bound whose hypotheses may no longer hold, it does not amount to authority to operate unattended.",
    whyOthersFail:
      "Bound plus monitor still leaves the unmonitored failure modes, and the bound's own conditions unchecked. Accuracy is a prediction property; unattended operation is a governance decision with a named owner and stop condition.",
    boundary:
      "Naming an owner and a stop condition does not establish that either is exercisable under load. That needs its own rehearsal.",
  },
};

const emptyRecord: StudioRecord = {
  gaps: { choice: null, confidence: null, revealed: false },
  capacity: { choice: null, confidence: null, revealed: false },
  bounds: { choice: null, confidence: null, revealed: false },
  numerics: { choice: null, confidence: null, revealed: false },
  shift: { choice: null, confidence: null, revealed: false },
  authority: { choice: null, confidence: null, revealed: false },
};

function confidenceLabel(confidence: Confidence | null) {
  if (confidence === 1) return "guess";
  if (confidence === 2) return "somewhat sure";
  if (confidence === 3) return "strong";
  if (confidence === 4) return "certain";
  return "unrecorded";
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
  const choicesForView = choices[view];

  function onChoiceKeyDown(
    event: ReactKeyboardEvent<HTMLButtonElement>,
    choiceIndex: number,
  ) {
    let nextIndex: number | null = null;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = (choiceIndex + 1) % choicesForView.length;
    }
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = (choiceIndex - 1 + choicesForView.length) % choicesForView.length;
    }
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = choicesForView.length - 1;
    if (nextIndex === null) return;
    event.preventDefault();
    onChoice(choicesForView[nextIndex].id);
    const radios = event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>(
      '[role="radio"]',
    );
    radios?.[nextIndex]?.focus();
  }

  return (
    <section className={styles.predictionGate} aria-labelledby={`m36-${view}-gate-title`}>
      <div className={styles.gateHeading}>
        <span>Prediction gate</span>
        <h3 id={`m36-${view}-gate-title`}>
          {views.find((candidate) => candidate.id === view)?.question}
        </h3>
        <p>
          Choose a claim and name your confidence before opening the explanation.
          A repaired prediction is useful evidence—not a penalty.
        </p>
      </div>

      <div
        className={styles.choiceGrid}
        role="radiogroup"
        aria-label={`Prediction for ${view}`}
      >
        {choicesForView.map((choice, index) => (
          <button
            aria-checked={record.choice === choice.id}
            className={record.choice === choice.id ? styles.choiceSelected : styles.choice}
            disabled={record.revealed}
            key={choice.id}
            onClick={() => onChoice(choice.id)}
            onKeyDown={(event) => onChoiceKeyDown(event, index)}
            role="radio"
            tabIndex={
              record.choice === null
                ? index === 0
                  ? 0
                  : -1
                : record.choice === choice.id
                  ? 0
                  : -1
            }
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
          The explanation opens after both a prediction and confidence are visible.
        </p>
      )}

      <button
        className={styles.revealButton}
        disabled={record.choice === null || record.confidence === null || record.revealed}
        onClick={onReveal}
        type="button"
      >
        {record.revealed ? "Explanation revealed" : "Reveal explanation packet"}
      </button>

      {record.revealed && (
        <div
          aria-atomic="true"
          aria-live="polite"
          className={correct ? styles.revealCorrect : styles.revealRepair}
        >
          <span>{correct ? "Your model holds here" : "Repair the model"}</span>
          <h4>{result.title}</h4>
          <p>
            <strong>Reason:</strong> {result.answer}
          </p>
          <p>
            <strong>Why plausible alternatives fail:</strong> {result.whyOthersFail}
          </p>
          <p>
            <strong>Scope boundary:</strong> {result.boundary}
          </p>
          <p className={styles.reflection}>
            You chose <strong>{confidenceLabel(record.confidence)}</strong> confidence.{" "}
            {correct
              ? "Now remove one hypothesis and rewrite the strongest remaining claim."
              : "Find the smallest changed assumption that repairs the claim."}
          </p>
        </div>
      )}
    </section>
  );
}

function Fixture({ view }: { view: StudioView }) {
  if (view === "gaps") {
    return (
      <>
        <div className={styles.fixtureLead}>
          <div>
            <span>Gap ledger</span>
            <h3>One number, three distinct gaps.</h3>
            <p className={styles.formula}>R(h) − R̂(h) = approximation + estimation + optimization</p>
          </div>
          <p>
            A single reported loss merges what the class cannot express, what the
            finite sample cannot reveal, and what the run did not reach. Each has
            a different remedy, so keeping them apart is the practical point.
          </p>
        </div>
        <table className={styles.dataTable}>
          <caption>The three gaps and what closes each</caption>
          <thead>
            <tr><th scope="col">Gap</th><th scope="col">Source</th><th scope="col">Remedy</th></tr>
          </thead>
          <tbody>
            <tr><td>approximation</td><td>the hypothesis class</td><td>a richer class</td></tr>
            <tr><td>estimation</td><td>finite data</td><td>more data, or less capacity</td></tr>
            <tr><td>optimization</td><td>the run</td><td>better algorithm or budget</td></tr>
          </tbody>
        </table>
        <p className={styles.textEquivalent}>
          <strong>Text equivalent:</strong> three rows with different sources and
          different remedies. Applying the remedy for one gap to another is the
          most common wasted effort in the table.
        </p>
      </>
    );
  }

  if (view === "capacity") {
    return (
      <>
        <div className={styles.fixtureLead}>
          <div>
            <span>Capacity fixture</span>
            <h3>Fit improves; the gap widens.</h3>
            <p className={styles.formula}>empirical 0.72 → 0.06 · gap 0.08 → 0.78</p>
          </div>
          <p>
            Across six capacities the empirical risk falls steadily and the
            estimation gap rises faster. Their sum reaches its minimum in the
            middle, which no single trace shows on its own.
          </p>
        </div>
        <StudioFigure
          spec={capacityRiskFigureSpec}
          label="Empirical risk falling as class capacity grows while the estimation gap rises faster"
          describedById="m36-capacity-alternative"
        />
        <p className={styles.textEquivalent} id="m36-capacity-alternative">
          <strong>Text equivalent:</strong> two traces over six capacities.
          Empirical risk declines from 0.72 to 0.06; the estimation gap climbs
          from 0.08 to 0.78. They cross near the third capacity, and the sum is
          smallest around there.
        </p>
      </>
    );
  }

  if (view === "bounds") {
    return (
      <>
        <div className={styles.fixtureLead}>
          <div>
            <span>Theorem card</span>
            <h3>Read the quantifiers before the number.</h3>
            <p className={styles.formula}>with prob. ≥ 1 − δ over S ~ Pⁿ: R(h) ≤ R̂(h) + ε(n, δ, class)</p>
          </div>
          <p>
            The probability is over the draw of the training sample. The bound
            constrains the estimation gap for that draw, under an assumption that
            the sample was drawn from P — which deployment routinely violates.
          </p>
        </div>
        <table className={styles.dataTable}>
          <caption>What the statement quantifies over</caption>
          <thead>
            <tr><th scope="col">Reading</th><th scope="col">Correct?</th></tr>
          </thead>
          <tbody>
            <tr><td>over draws of the training sample</td><td>yes</td></tr>
            <tr><td>over future production inputs</td><td>no</td></tr>
            <tr><td>over choices of model class</td><td>no — the class is fixed in advance</td></tr>
            <tr><td>a guarantee rather than a probability</td><td>no — δ of samples violate it</td></tr>
          </tbody>
        </table>
        <p className={styles.codeContract}>
          <strong>Code-reading contract:</strong> record n, δ, the class, and the
          distribution assumption alongside any reported bound. Without them the
          number is not interpretable.
        </p>
      </>
    );
  }

  if (view === "numerics") {
    return (
      <>
        <div className={styles.fixtureLead}>
          <div>
            <span>Reproduction record</span>
            <h3>Same source, two results.</h3>
            <p className={styles.formula}>run A: 0.8413 · run B: 0.8411 · identical commit</p>
          </div>
          <p>
            Floating-point addition is not associative, so a parallel reduction
            that splits work differently produces a different sum. The commit is
            identical; the computation is not.
          </p>
        </div>
        <table className={styles.dataTable}>
          <caption>Fields that make a numerical result reproducible</caption>
          <tbody>
            <tr><th scope="row">dtype</th><td>parameters, activations, accumulation</td></tr>
            <tr><th scope="row">reduction order</th><td>fixed or topology-dependent</td></tr>
            <tr><th scope="row">kernels</th><td>library and version, deterministic flags</td></tr>
            <tr><th scope="row">device</th><td>class and count</td></tr>
            <tr><th scope="row">seed</th><td>and every source of randomness it covers</td></tr>
          </tbody>
        </table>
        <p className={styles.textEquivalent}>
          <strong>Text equivalent:</strong> five fields beyond the source code.
          A reproduction claim that names none of them is a claim about the
          repository, not about the result.
        </p>
      </>
    );
  }

  if (view === "shift") {
    return (
      <>
        <div className={styles.fixtureLead}>
          <div>
            <span>Threat card</span>
            <h3>Robust — within a stated ball.</h3>
            <p className={styles.formula}>accuracy ≥ 0.86 for ‖perturbation‖∞ ≤ 8/255</p>
          </div>
          <p>
            The claim is indexed by a norm, a radius, and a perturbation model.
            Outside that set — a new lighting condition, a new population, a
            reformatted input — the statement makes no prediction at all.
          </p>
        </div>
        <table className={styles.dataTable}>
          <caption>Inside and outside the declared set</caption>
          <thead>
            <tr><th scope="col">Perturbation</th><th scope="col">Covered?</th></tr>
          </thead>
          <tbody>
            <tr><td>‖·‖∞ ≤ 8/255</td><td>yes — as stated</td></tr>
            <tr><td>‖·‖₂ of similar magnitude</td><td>no — a different set</td></tr>
            <tr><td>a new subpopulation</td><td>no — distribution shift, not perturbation</td></tr>
            <tr><td>a changed input encoding</td><td>no — outside the model entirely</td></tr>
          </tbody>
        </table>
        <p className={styles.textEquivalent}>
          <strong>Text equivalent:</strong> only the first row is covered. The
          remaining three are the shifts a deployment actually encounters, and
          the robustness claim is silent on all of them.
        </p>
      </>
    );
  }

  return (
    <>
      <div className={styles.fixtureLead}>
        <div>
          <span>Control card</span>
          <h3>Green is the absence of a detection.</h3>
          <p className={styles.formula}>no alert ≠ no failure</p>
        </div>
        <p>
          A monitor fires on what it was configured to notice. Silence means the
          configured detectors did not trigger — which is compatible with a
          failure mode nobody anticipated.
        </p>
      </div>
      <table className={styles.dataTable}>
        <caption>What each artifact does and does not establish</caption>
        <thead>
          <tr><th scope="col">Artifact</th><th scope="col">Establishes</th><th scope="col">Does not establish</th></tr>
        </thead>
        <tbody>
          <tr><td>a generalisation bound</td><td>a gap constraint under hypotheses</td><td>that the hypotheses still hold</td></tr>
          <tr><td>a green monitor</td><td>no configured detector fired</td><td>that no failure occurred</td></tr>
          <tr><td>a robustness result</td><td>behaviour in a declared set</td><td>behaviour outside it</td></tr>
          <tr><td>an owner and stop condition</td><td>who decides and when to halt</td><td>that either is exercisable under load</td></tr>
        </tbody>
      </table>
      <p className={styles.textEquivalent}>
        <strong>Text equivalent:</strong> four artifacts, each with a real
        contribution in the middle column and a specific limit in the right.
        Unattended operation would need all four limits addressed, not assumed.
      </p>
    </>
  );
}

export function LearningTheoryReliabilityStudio() {
  const [activeView, setActiveView] = useState<StudioView>("gaps");
  const [record, setRecord] = useState<StudioRecord>(emptyRecord);
  const [clearNotice, setClearNotice] = useState("");
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const activeRecord = record[activeView];

  function updateActiveRecord(update: Partial<ViewRecord>) {
    setClearNotice("");
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
    setClearNotice("");
    setRecord((current) => {
      const candidate = current[activeView];
      if (!candidate.choice || !candidate.confidence) return current;
      return { ...current, [activeView]: { ...candidate, revealed: true } };
    });
  }

  function clearPredictionEvidence() {
    setRecord(emptyRecord);
    setClearNotice("This visit's predictions were reset.");
  }

  function selectView(nextIndex: number, focus = false) {
    const normalized = (nextIndex + views.length) % views.length;
    setActiveView(views[normalized].id);
    if (focus) tabRefs.current[normalized]?.focus();
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

  const answered = views.filter((view) => record[view.id].revealed).length;

  return (
    <section
      className={styles.studio}
      aria-labelledby="learning-theory-reliability-studio-title"
    >
      <div className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.kicker}>Module 36 interactive reasoning studio</p>
          <h2 id="learning-theory-reliability-studio-title">
            Learning Theory &amp; Reliability Studio
          </h2>
          <p>
            A theorem is a quantified implication, an experiment is a finite
            observation, and a reliable-system claim needs both plus an
            accountable owner. Six fixed synthetic fixtures keep them from
            collapsing into one another.
          </p>
          <div className={styles.heroFacts}>
            <span>
              <b>6</b> connected lenses
            </span>
            <span>
              <b>0</b> server records
            </span>
            <span>
              <b>1</b> reliability card
            </span>
          </div>
        </div>
      </div>

      <div className={styles.invariantPlate}>
        <span>M36 working invariant</span>
        <p>
          A theorem constrains one gap under its hypotheses; an experiment
          observes one configuration; a monitor detects what it was built to
          detect. None substitutes for the others, and none confers authority.
        </p>
      </div>

      <ol className={styles.reasoningChain} aria-label="Learning theory reasoning chain">
        {["population", "class", "gap", "theorem", "experiment", "authority"].map(
          (step, index) => (
            <li key={step}>
              <strong>{index + 1}</strong>
              <span>{step}</span>
            </li>
          ),
        )}
      </ol>

      <div className={styles.workspace}>
        <div
          className={styles.tabs}
          role="tablist"
          aria-label="Learning theory and reliability investigations"
        >
          {views.map((view, index) => (
            <button
              aria-controls={`m36-${view.id}-panel`}
              aria-selected={activeView === view.id}
              className={activeView === view.id ? styles.tabActive : undefined}
              id={`m36-${view.id}-tab`}
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
          aria-labelledby={`m36-${activeView}-tab`}
          className={styles.panel}
          id={`m36-${activeView}-panel`}
          role="tabpanel"
          tabIndex={0}
        >
          <Fixture view={activeView} />
          <PredictionGate
            onChoice={choose}
            onConfidence={setConfidence}
            onReveal={reveal}
            record={activeRecord}
            view={activeView}
          />
        </div>

        <p className={styles.progress} role="status">
          {answered} of {views.length} explanation packets opened in this visit.
        </p>

        <div className={styles.footerBand}>
          <div>
            <span>Boundary</span>
            <p>
              This studio keeps predictions in memory for this visit only. It
              writes nothing to browser storage, records no learner identity,
              sends nothing to a server, and creates no course credit or mastery
              claim. The workbook remains the authority for every theorem
              statement and non-claim shown here.
            </p>
            {clearNotice ? <p role="status">{clearNotice}</p> : null}
          </div>
          <div className={styles.footerLinks}>
            <button onClick={clearPredictionEvidence} type="button">
              Reset predictions
            </button>
            <Link href="/modules/36-statistical-learning-theory-reliable-deep-learning">
              Open the workbook
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
