"use client";

import Link from "next/link";
import { type KeyboardEvent as ReactKeyboardEvent, useRef, useState } from "react";
import { StudioFigure } from "./StudioFigure";
import styles from "./AdvancedStudio.module.css";

/**
 * Session 4's evaluation fixture: accuracy rises while the minority-class
 * recall falls. One aggregate number hides the movement that matters.
 */
const evaluationSplitFigureSpec = {
  kind: "plot",
  width: 420,
  height: 260,
  xLabel: "training round",
  yLabel: "rate",
  xRange: [0.6, 5.4],
  yRange: [0, 1.05],
  series: [
    {
      points: [
        [1, 0.71],
        [2, 0.78],
        [3, 0.84],
        [4, 0.88],
        [5, 0.91],
      ],
      label: "accuracy",
    },
    {
      points: [
        [1, 0.62],
        [2, 0.55],
        [3, 0.44],
        [4, 0.36],
        [5, 0.29],
      ],
      tone: 4,
      label: "minority recall",
    },
  ],
} as const;

type StudioView =
  | "representation"
  | "leakage"
  | "baseline"
  | "evaluation"
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
    id: "representation",
    number: "01",
    label: "Representation",
    question: "Two inputs collide in the representation. What follows?",
  },
  {
    id: "leakage",
    number: "02",
    label: "Splits & leakage",
    question: "The split was random and rows share an entity. What broke?",
  },
  {
    id: "baseline",
    number: "03",
    label: "Baselines",
    question: "The model beats the dummy. Is the comparison sound?",
  },
  {
    id: "evaluation",
    number: "04",
    label: "Evaluation",
    question: "Accuracy rose from 0.71 to 0.91. Did the model improve?",
  },
  {
    id: "shift",
    number: "05",
    label: "Shift",
    question: "Live performance dropped. What is the first thing to check?",
  },
  {
    id: "authority",
    number: "06",
    label: "Authority",
    question: "The model is accurate. May it decide?",
  },
];

const choices: Record<StudioView, ReadonlyArray<{ id: string; label: string }>> = {
  representation: [
    {
      id: "no-deterministic-predictor-can-separate",
      label:
        "No deterministic predictor can separate that pair from this representation alone.",
    },
    { id: "deeper-model-recovers", label: "A deeper classifier can always recover the distinction." },
    { id: "more-data-fixes-it", label: "More training data makes the collision disappear." },
  ],
  leakage: [
    {
      id: "same-entity-across-split",
      label:
        "The same entity appears on both sides, so the held-out set is not held out.",
    },
    { id: "nothing-random-is-fine", label: "Nothing — random splitting is the standard method." },
    { id: "just-increase-test-size", label: "Only the test size; enlarge it." },
  ],
  baseline: [
    {
      id: "information-boundary-mismatch",
      label:
        "Not if the baseline was denied a feature the model received — the comparison is confounded.",
    },
    { id: "model-architecture-superior", label: "Yes — it shows the architecture is superior." },
    { id: "baselines-not-useful", label: "Baselines are not informative in machine learning." },
  ],
  evaluation: [
    {
      id: "aggregate-hides-subgroup-collapse",
      label:
        "Unclear — minority recall fell from 0.62 to 0.29 over the same rounds. The aggregate hides it.",
    },
    { id: "accuracy-rose-so-yes", label: "Yes — accuracy is the headline metric." },
    { id: "twenty-points-is-decisive", label: "Yes — a twenty-point gain is decisive." },
  ],
  shift: [
    {
      id: "compare-input-distributions",
      label:
        "Whether the live input distribution still matches the one the model was fitted and evaluated on.",
    },
    { id: "retrain-immediately", label: "Retrain on the most recent data immediately." },
    { id: "model-degraded", label: "The model degraded and should be replaced." },
  ],
  authority: [
    {
      id: "accuracy-is-not-authority",
      label:
        "Accuracy is evidence about predictions; authority to act is assigned by a person and needs an override path.",
    },
    { id: "high-accuracy-grants-authority", label: "Yes — sufficient accuracy justifies automation." },
    { id: "human-review-always-required", label: "No — a human must approve every prediction." },
  ],
};

const correctChoice: Record<StudioView, string> = {
  representation: "no-deterministic-predictor-can-separate",
  leakage: "same-entity-across-split",
  baseline: "information-boundary-mismatch",
  evaluation: "aggregate-hides-subgroup-collapse",
  shift: "compare-input-distributions",
  authority: "accuracy-is-not-authority",
};

const feedback: Record<
  StudioView,
  { title: string; answer: string; whyOthersFail: string; boundary: string }
> = {
  representation: {
    title: "A collision is an information fact, not a capacity fact",
    answer:
      "If two inputs map to the same representation but carry different labels, every deterministic function of that representation assigns them the same prediction. The information required to separate them is absent before any model is chosen.",
    whyOthersFail:
      "Depth adds capacity, and capacity cannot recover information the representation discarded. More data supplies more examples of the same collision.",
    boundary:
      "This bounds the declared representation and task pair. A different feature map may separate them; that is a claim about the map.",
  },
  leakage: {
    title: "The split has to respect the unit the claim is about",
    answer:
      "When rows from one entity land on both sides, the evaluation measures memorising that entity as well as generalising to new ones. The reported score answers a question nobody asked.",
    whyOthersFail:
      "Random splitting is standard only when rows are independent. A larger test set makes a leaked estimate more precise, not less wrong.",
    boundary:
      "Grouped splitting fixes this leak. It does not address leakage through time or through features derived from the target.",
  },
  baseline: {
    title: "A comparison is only as sound as its information boundary",
    answer:
      "If the model saw a feature the baseline did not, the difference measures access to that feature as much as any modelling gain. The two are confounded and cannot be separated after the fact.",
    whyOthersFail:
      "Attributing the gap to the architecture assumes the boundary was equal. Dismissing baselines removes the only thing that makes a score interpretable.",
    boundary:
      "Re-running the baseline with the same features isolates the modelling contribution. That is a different experiment, not a reinterpretation.",
  },
  evaluation: {
    title: "An aggregate can rise while every part that matters falls",
    answer:
      "Accuracy is a weighted average over subgroups. When one subgroup is small, the model can improve on the majority and collapse on the minority while the headline number rises monotonically — which is exactly what the trace shows.",
    whyOthersFail:
      "Naming accuracy the headline metric restates the choice rather than defending it. The size of the gain says nothing about its distribution.",
    boundary:
      "Subgroup reporting reveals the movement. It does not tell you which subgroups matter — that is a decision about the use.",
  },
  shift: {
    title: "Compare the distributions before changing the model",
    answer:
      "A drop has at least three candidate causes: the inputs moved, the label relationship moved, or the pipeline broke. Comparing the live input distribution to the training one is the cheapest probe and distinguishes the first from the others.",
    whyOthersFail:
      "Retraining on recent data assumes the inputs moved and bakes in whatever caused the drop if it was a pipeline fault. Declaring degradation names a symptom as a cause.",
    boundary:
      "Matching input distributions does not rule out a changed label relationship, which needs fresh labels to detect.",
  },
  authority: {
    title: "Evidence and authority are different objects",
    answer:
      "A score bounds predictive performance on a distribution. Whether a system may act — and who can pause, override, or decline it — is a decision someone makes and remains accountable for. No accuracy threshold produces that.",
    whyOthersFail:
      "Treating accuracy as sufficient skips the question of consequence asymmetry. Requiring review of every prediction is a different policy, appropriate for some uses and not a general rule.",
    boundary:
      "An override path is a governance artifact. Its existence does not establish that it is usable in practice.",
  },
};

const emptyRecord: StudioRecord = {
  representation: { choice: null, confidence: null, revealed: false },
  leakage: { choice: null, confidence: null, revealed: false },
  baseline: { choice: null, confidence: null, revealed: false },
  evaluation: { choice: null, confidence: null, revealed: false },
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
    <section className={styles.predictionGate} aria-labelledby={`m35-${view}-gate-title`}>
      <div className={styles.gateHeading}>
        <span>Prediction gate</span>
        <h3 id={`m35-${view}-gate-title`}>
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
              ? "Now name the evidence that would change your mind."
              : "Find the smallest changed assumption that repairs the claim."}
          </p>
        </div>
      )}
    </section>
  );
}

function Fixture({ view }: { view: StudioView }) {
  if (view === "representation") {
    return (
      <>
        <div className={styles.fixtureLead}>
          <div>
            <span>Representation fixture</span>
            <h3>Two rows, one vector.</h3>
            <p className={styles.formula}>φ(x₁) = φ(x₂) = (1, 0) · y₁ = 0, y₂ = 1</p>
          </div>
          <p>
            The feature map discards whatever distinguished the two inputs. Any
            deterministic predictor reads only the vector, so it must answer both
            the same way and must be wrong on one.
          </p>
        </div>
        <table className={styles.dataTable}>
          <caption>The declared collision</caption>
          <thead>
            <tr><th scope="col">row</th><th scope="col">raw input</th><th scope="col">φ(x)</th><th scope="col">label</th></tr>
          </thead>
          <tbody>
            <tr><td>x₁</td><td>signal=1, context=0, source=A</td><td>(1, 0)</td><td>0</td></tr>
            <tr><td>x₂</td><td>signal=1, context=0, source=B</td><td>(1, 0)</td><td>1</td></tr>
          </tbody>
        </table>
        <p className={styles.textEquivalent}>
          <strong>Text equivalent:</strong> the two rows differ only in a source
          field the feature map drops, yet carry opposite labels. The best
          achievable accuracy on this pair is one half.
        </p>
      </>
    );
  }

  if (view === "leakage") {
    return (
      <>
        <div className={styles.fixtureLead}>
          <div>
            <span>Split fixture</span>
            <h3>One entity, twelve rows, both sides.</h3>
            <p className={styles.formula}>random split: entity E has 8 rows in train, 4 in test</p>
          </div>
          <p>
            The held-out rows come from an entity the model already saw. The
            score measures recall of that entity alongside generalisation to new
            ones, and cannot separate the two contributions.
          </p>
        </div>
        <table className={styles.dataTable}>
          <caption>Which split answers which question</caption>
          <thead>
            <tr><th scope="col">Split</th><th scope="col">Question answered</th></tr>
          </thead>
          <tbody>
            <tr><td>row-random</td><td>new rows from seen entities</td></tr>
            <tr><td>grouped by entity</td><td>new entities</td></tr>
            <tr><td>by time</td><td>future periods</td></tr>
          </tbody>
        </table>
        <p className={styles.codeContract}>
          <strong>Code-reading contract:</strong> state the unit the claim is
          about, then choose the split that isolates it. A split chosen for
          convenience answers a question of its own choosing.
        </p>
      </>
    );
  }

  if (view === "baseline") {
    return (
      <>
        <div className={styles.fixtureLead}>
          <div>
            <span>Comparison fixture</span>
            <h3>Unequal access, one reported gap.</h3>
            <p className={styles.formula}>model: 12 features · dummy: 3 features</p>
          </div>
          <p>
            The gap combines two effects — a modelling difference and a nine
            feature difference — with no way to attribute it after the run. The
            comparison was decided before the numbers arrived.
          </p>
        </div>
        <table className={styles.dataTable}>
          <caption>What each comparison isolates</caption>
          <thead>
            <tr><th scope="col">Baseline</th><th scope="col">Isolates</th></tr>
          </thead>
          <tbody>
            <tr><td>same features, simpler model</td><td>the modelling contribution</td></tr>
            <tr><td>fewer features, same model</td><td>the feature contribution</td></tr>
            <tr><td>fewer features, simpler model</td><td>neither — confounded</td></tr>
          </tbody>
        </table>
        <p className={styles.textEquivalent}>
          <strong>Text equivalent:</strong> only the first two rows support an
          attribution. The third measures both differences at once and can
          separate neither.
        </p>
      </>
    );
  }

  if (view === "evaluation") {
    return (
      <>
        <div className={styles.fixtureLead}>
          <div>
            <span>Evaluation fixture</span>
            <h3>The headline rises; a subgroup falls.</h3>
            <p className={styles.formula}>accuracy 0.71 → 0.91 · minority recall 0.62 → 0.29</p>
          </div>
          <p>
            Over five rounds accuracy improves monotonically while recall on the
            minority class halves. Both traces come from the same runs; only one
            of them is usually reported.
          </p>
        </div>
        <StudioFigure
          spec={evaluationSplitFigureSpec}
          label="Accuracy rising from 0.71 to 0.91 while minority-class recall falls from 0.62 to 0.29"
          describedById="m35-evaluation-alternative"
        />
        <p className={styles.textEquivalent} id="m35-evaluation-alternative">
          <strong>Text equivalent:</strong> two traces over five rounds. Accuracy
          climbs steadily to 0.91; minority recall declines steadily to 0.29. The
          lines cross between rounds one and two and diverge thereafter.
        </p>
      </>
    );
  }

  if (view === "shift") {
    return (
      <>
        <div className={styles.fixtureLead}>
          <div>
            <span>Shift fixture</span>
            <h3>Live performance fell; nothing was deployed.</h3>
            <p className={styles.formula}>no model change · no code change · score down 14 points</p>
          </div>
          <p>
            With the artifact fixed, the change is upstream. Three causes remain,
            and they call for different responses — so identifying which one is
            the first task, not retraining.
          </p>
        </div>
        <table className={styles.dataTable}>
          <caption>Candidate causes and their probes</caption>
          <thead>
            <tr><th scope="col">Cause</th><th scope="col">Probe</th><th scope="col">Response</th></tr>
          </thead>
          <tbody>
            <tr><td>input distribution moved</td><td>compare feature histograms</td><td>retrain or re-scope</td></tr>
            <tr><td>label relationship moved</td><td>needs fresh labels</td><td>re-model</td></tr>
            <tr><td>pipeline fault</td><td>check nulls, encodings, joins</td><td>fix the pipeline</td></tr>
          </tbody>
        </table>
        <p className={styles.codeContract}>
          <strong>Code-reading contract:</strong> retraining on recent data
          before the probe converts a pipeline fault into a permanently
          mis-specified model.
        </p>
      </>
    );
  }

  return (
    <>
      <div className={styles.fixtureLead}>
        <div>
          <span>Authority card</span>
          <h3>The score does not name the decider.</h3>
          <p className={styles.formula}>evidence ≠ authority</p>
        </div>
        <p>
          A performance number bounds prediction quality on a distribution.
          Whether the system may act, and who can stop it, is assigned by a
          person who remains accountable for the assignment.
        </p>
      </div>
      <table className={styles.dataTable}>
        <caption>Fields an automation decision needs beyond a score</caption>
        <tbody>
          <tr><th scope="row">Consequence</th><td>what a wrong prediction costs, and to whom</td></tr>
          <tr><th scope="row">Owner</th><td>who may pause, override, or decline</td></tr>
          <tr><th scope="row">Appeal</th><td>how an affected party contests an outcome</td></tr>
          <tr><th scope="row">Stop condition</th><td>the observation that ends the deployment</td></tr>
        </tbody>
      </table>
      <p className={styles.textEquivalent}>
        <strong>Text equivalent:</strong> four fields — consequence, owner,
        appeal, stop condition — none of which any accuracy number supplies.
      </p>
    </>
  );
}

export function MachineLearningRepresentationStudio() {
  const [activeView, setActiveView] = useState<StudioView>("representation");
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
      aria-labelledby="machine-learning-representation-studio-title"
    >
      <div className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.kicker}>Module 35 interactive reasoning studio</p>
          <h2 id="machine-learning-representation-studio-title">
            Representation &amp; Evaluation Studio
          </h2>
          <p>
            A model claim travels through a representation, a split, a baseline,
            a metric, a distribution, and a decision. Six fixed synthetic
            fixtures keep each step visible instead of collapsing them into one
            score.
          </p>
          <div className={styles.heroFacts}>
            <span>
              <b>6</b> connected lenses
            </span>
            <span>
              <b>0</b> server records
            </span>
            <span>
              <b>1</b> evidence card
            </span>
          </div>
        </div>
      </div>

      <div className={styles.invariantPlate}>
        <span>M35 working invariant</span>
        <p>
          A score is produced by a representation, a split, and a metric that
          someone chose. Name all three before reading it as a statement about
          the world, and never read it as authority to act.
        </p>
      </div>

      <ol className={styles.reasoningChain} aria-label="Machine learning reasoning chain">
        {["representation", "split", "baseline", "metric", "shift", "authority"].map(
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
          aria-label="Representation and evaluation investigations"
        >
          {views.map((view, index) => (
            <button
              aria-controls={`m35-${view.id}-panel`}
              aria-selected={activeView === view.id}
              className={activeView === view.id ? styles.tabActive : undefined}
              id={`m35-${view.id}-tab`}
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
          aria-labelledby={`m35-${activeView}-tab`}
          className={styles.panel}
          id={`m35-${activeView}-panel`}
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
              claim. The workbook remains the authority for every evaluation
              convention shown here.
            </p>
            {clearNotice ? <p role="status">{clearNotice}</p> : null}
          </div>
          <div className={styles.footerLinks}>
            <button onClick={clearPredictionEvidence} type="button">
              Reset predictions
            </button>
            <Link href="/modules/35-machine-learning-representation">
              Open the workbook
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
