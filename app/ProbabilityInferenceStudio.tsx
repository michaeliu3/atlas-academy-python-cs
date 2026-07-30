"use client";

import {
  type KeyboardEvent as ReactKeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "./ProbabilityInferenceStudio.module.css";

type StudioView =
  | "base-rate"
  | "variation"
  | "repetition"
  | "likelihood"
  | "procedure"
  | "design";

type Confidence = 1 | 2 | 3 | 4;

type ViewRecord = {
  choice: string | null;
  confidence: Confidence | null;
  revealed: boolean;
};

type StudioRecord = Record<StudioView, ViewRecord>;

const STORAGE_KEY = "atlas.module30.probability-inference-studio.v1";

const views: ReadonlyArray<{
  id: StudioView;
  number: string;
  label: string;
  question: string;
}> = [
  {
    id: "base-rate",
    number: "01",
    label: "Events & base rates",
    question: "Which posterior account respects the declared base rate?",
  },
  {
    id: "variation",
    number: "02",
    label: "Distribution & variation",
    question: "Which comparison separates a mean from uncertainty?",
  },
  {
    id: "repetition",
    number: "03",
    label: "Samples & convergence",
    question: "Which claim is earned by this finite repetition trace?",
  },
  {
    id: "likelihood",
    number: "04",
    label: "Likelihood & fit",
    question: "Which object changes when a prior is introduced?",
  },
  {
    id: "procedure",
    number: "05",
    label: "Intervals & procedures",
    question: "Which interpretation keeps the procedure contract intact?",
  },
  {
    id: "design",
    number: "06",
    label: "Design & decision",
    question: "Which missing design record weakens the recommendation first?",
  },
];

const choices: Record<StudioView, ReadonlyArray<{ id: string; label: string }>> = {
  "base-rate": [
    {
      id: "conditional-update",
      label:
        "A positive signal updates the declared 1% base rate to 2/13 under the stated sensitivity and false-positive model; it is not a causal or population conclusion outside that model.",
    },
    {
      id: "sensitivity-is-posterior",
      label:
        "Because sensitivity is 90%, a positive signal means there is a 90% chance that the hidden condition is true.",
    },
    {
      id: "joint-is-posterior",
      label:
        "The posterior is 0.009 because prior × sensitivity is the complete answer after a positive signal.",
    },
  ],
  variation: [
    {
      id: "same-mean-different-risk",
      label:
        "Two declared distributions can share a mean while having different variance and tail behavior. The mean alone neither identifies risk nor proves the data model.",
    },
    {
      id: "same-mean-same-law",
      label:
        "Equal means prove that two distributions have the same uncertainty and the same expected loss for every decision.",
    },
    {
      id: "zero-covariance-cause",
      label:
        "Zero covariance establishes that neither variable can cause the other and that a fitted relation is unnecessary.",
    },
  ],
  repetition: [
    {
      id: "finite-not-theorem",
      label:
        "The trace is a finite observation. A law of large numbers, CLT approximation, or Hoeffding bound needs its own sampling, dependence, and moment/boundedness assumptions.",
    },
    {
      id: "settled-proves-iid",
      label:
        "Because the running average appears stable, the rows are proven IID and the exact population probability is known.",
    },
    {
      id: "clt-means-normal-data",
      label:
        "The CLT says the original data must be normally distributed whenever the sample mean is plotted.",
    },
  ],
  likelihood: [
    {
      id: "prior-changes-posterior",
      label:
        "A prior combines with a likelihood to form a posterior; an MLE maximizes likelihood, while a MAP maximizes a declared posterior. Neither validates the Bernoulli model or data collection.",
    },
    {
      id: "likelihood-parameter-probability",
      label:
        "A likelihood is already a probability distribution over parameters, so no prior or normalization is needed.",
    },
    {
      id: "fit-proves-cause",
      label:
        "A sharp likelihood peak proves the parameter is causal, identified, and stable for a new population.",
    },
  ],
  procedure: [
    {
      id: "procedure-meaning",
      label:
        "A 95% frequentist interval is produced by a procedure with stated repeated-sampling coverage; a p-value is a tail probability under a named null procedure, not P(null | data).",
    },
    {
      id: "interval-parameter-probability",
      label:
        "A realized 95% confidence interval gives a 95% probability that its fixed parameter lies inside it without any further model statement.",
    },
    {
      id: "smallest-p-is-replication",
      label:
        "After trying many outcomes, the smallest unadjusted p-value is automatically a replication and needs no family or selection record.",
    },
  ],
  design: [
    {
      id: "assignment-and-observation",
      label:
        "First audit who was eligible, assigned, delivered, observed, and retained. An observed group-mean difference is not a causal effect without the assignment, measurement, attrition, and analysis-plan contract.",
    },
    {
      id: "fit-is-design",
      label:
        "A model fit creates representativeness and repairs missing outcomes, post-hoc metrics, and unrecorded assignment failures.",
    },
    {
      id: "selected-features-cause",
      label:
        "If p is larger than n, a regularized model’s selected features establish the causes that should drive a policy.",
    },
  ],
};

const correctChoice: Record<StudioView, string> = {
  "base-rate": "conditional-update",
  variation: "same-mean-different-risk",
  repetition: "finite-not-theorem",
  likelihood: "prior-changes-posterior",
  procedure: "procedure-meaning",
  design: "assignment-and-observation",
};

const feedback: Record<
  StudioView,
  { title: string; answer: string; whyOthersFail: string; boundary: string }
> = {
  "base-rate": {
    title: "Bayes updates a declared joint model; it does not erase the base rate.",
    answer:
      "With P(H)=0.01, P(+|H)=0.9, and P(+|not H)=0.05, P(+)=0.0585 and P(H|+)=0.009/0.0585=2/13. The denominator is the probability of the observed evidence in the same model.",
    whyOthersFail:
      "Sensitivity answers P(+|H), the reverse question. Prior × sensitivity is P(H and +), a joint mass that must still be divided by P(+).",
    boundary:
      "The update inherits its population, base-rate, labeling, measurement, selection, and conditional-independence assumptions. It is not a causal explanation or a policy verdict.",
  },
  variation: {
    title: "A central tendency is not a full distribution or a decision rule.",
    answer:
      "Two distributions may both have mean 1 while one is constant and another has rare large outcomes. Variance and tail/loss behavior differ. Covariance is a model-based second-moment quantity, not a causal arrow.",
    whyOthersFail:
      "Equal means do not fix variance, quantiles, dependence, or expected nonlinear loss. Zero covariance normally falls far short of independence or causality.",
    boundary:
      "Expectation and covariance need declared laws and relevant moments. A finite sample mean/covariance is an estimator, not proof that a population distribution has the observed structure.",
  },
  repetition: {
    title: "A finite trace can suggest a question; a theorem or bound needs a contract.",
    answer:
      "The LLN describes convergence of averages under stated conditions. A CLT describes a normalized sampling-distribution approximation in an asymptotic regime. A concentration inequality supplies a finite tail bound under its own hypotheses.",
    whyOthersFail:
      "A stable-looking graph cannot prove IID or identify a population parameter. The CLT is not a statement that raw data are normal, and no theorem validates the data-generating process by appearance.",
    boundary:
      "Record sampling unit, dependence/clustering, seed/RNG, target, stopping rule, n, representation, and the actual theorem/procedure. Retries and repeated users can invalidate a row-count story.",
  },
  likelihood: {
    title: "Data, model, likelihood, prior, posterior, and optimizer output are distinct objects.",
    answer:
      "For a Bernoulli count, a likelihood ranks p values for observed data. The MLE maximizes it; a Beta prior creates a posterior and can shift a MAP/posterior mean. The model still needs an identifiability and data-path audit.",
    whyOthersFail:
      "Likelihood is not normalized over parameters without a prior. A fitted peak can arise in a misspecified, dependent, selected, or poorly measured data set and does not establish causality.",
    boundary:
      "Name support, parameter space, prior, likelihood, independence/exchangeability, observation process, computation/grid/optimizer, and what posterior or estimate will not decide.",
  },
  procedure: {
    title: "Intervals, tests, and multiplicity rules are procedures with assumptions—not labels of certainty.",
    answer:
      "A confidence procedure has a coverage property under its design/model regime. A p-value is a null-procedure tail probability. Bootstrap and permutation routes also need a resampling/exchangeability contract; families and selection matter for multiplicity.",
    whyOthersFail:
      "A frequentist interval does not by itself make a fixed parameter random, and a smallest p-value after many tries does not represent a preplanned single-test error rate.",
    boundary:
      "State estimand, null/alternative, statistic, sampling or assignment mechanism, alpha/error target, stopping/reporting rule, resampling unit/method/seed, and practical decision consequences.",
  },
  design: {
    title: "Design and provenance decide which question a calculation can answer.",
    answer:
      "Trace the unit from eligibility through assignment, delivery, measurement, observation, and retention. Randomization helps only under recorded execution/measurement/attrition conditions. Missingness and p>n add model/structure requirements rather than disappearing inside a fit call.",
    whyOthersFail:
      "Statistical software cannot manufacture representativeness, recover unobserved outcomes, or turn regularized selected features into causes. A group comparison is an association unless the design earns more.",
    boundary:
      "Use synthetic, consented, minimized fixtures here. Any real action needs human authority, privacy review, potential harms, reversibility, appeal, and evidence that matches the proposed scope.",
  },
};

const emptyViewRecord: ViewRecord = {
  choice: null,
  confidence: null,
  revealed: false,
};

const emptyRecord: StudioRecord = {
  "base-rate": { ...emptyViewRecord },
  variation: { ...emptyViewRecord },
  repetition: { ...emptyViewRecord },
  likelihood: { ...emptyViewRecord },
  procedure: { ...emptyViewRecord },
  design: { ...emptyViewRecord },
};

function isConfidence(value: unknown): value is Confidence {
  return value === 1 || value === 2 || value === 3 || value === 4;
}

function isViewRecord(value: unknown): value is ViewRecord {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<ViewRecord>;
  return (
    (candidate.choice === null || typeof candidate.choice === "string") &&
    (candidate.confidence === null || isConfidence(candidate.confidence)) &&
    typeof candidate.revealed === "boolean"
  );
}

function isStudioRecord(value: unknown): value is StudioRecord {
  if (!value || typeof value !== "object") return false;
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
    <section className={styles.predictionGate} aria-labelledby={`${view}-gate-title`}>
      <div className={styles.gateHeading}>
        <span>Prediction gate</span>
        <h3 id={`${view}-gate-title`}>
          {views.find((candidate) => candidate.id === view)?.question}
        </h3>
        <p>
          Choose a claim and name your confidence before opening the explanation.
          A repaired prediction is useful evidence—not a penalty.
        </p>
      </div>

      <div className={styles.choiceGrid} role="radiogroup" aria-label={`Prediction for ${view}`}>
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
              record.choice === null ? (index === 0 ? 0 : -1) : record.choice === choice.id ? 0 : -1
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
          <p><strong>Reason:</strong> {result.answer}</p>
          <p><strong>Why plausible alternatives fail:</strong> {result.whyOthersFail}</p>
          <p><strong>Scope boundary:</strong> {result.boundary}</p>
          <p className={styles.reflection}>
            You chose <strong>{confidenceLabel(record.confidence)}</strong> confidence. {correct
              ? "Now alter one population, condition, or design assumption."
              : "Find the smallest changed assumption that repairs the claim."}
          </p>
        </div>
      )}
    </section>
  );
}

function Fixture({ view }: { view: StudioView }) {
  if (view === "base-rate") {
    return (
      <>
        <div className={styles.fixtureLead}>
          <div>
            <span>Declared binary model</span>
            <p className={styles.formula}>P(H)=1/100 · P(+|H)=9/10 · P(+|not H)=1/20</p>
          </div>
          <p>Read the probability tree as a joint-model ledger: every branch lives in the same declared population and selection frame.</p>
        </div>
        <div className={styles.tree} aria-hidden="true">
          <div className={styles.treeRoot}>population</div>
          <div className={styles.treeBranch}><b>H</b><span>1%</span><i>+</i><em>0.009</em></div>
          <div className={styles.treeBranch}><b>not H</b><span>99%</span><i>+</i><em>0.0495</em></div>
        </div>
        <table className={styles.dataTable}>
          <caption>Exact joint-table audit</caption>
          <thead><tr><th scope="col">event</th><th scope="col">mass</th><th scope="col">question</th></tr></thead>
          <tbody>
            <tr><th scope="row">H and +</th><td>0.009</td><td>joint mass</td></tr>
            <tr><th scope="row">+</th><td>0.0585</td><td>evidence denominator</td></tr>
            <tr><th scope="row">H given +</th><td>2/13</td><td>posterior in this model</td></tr>
          </tbody>
        </table>
        <p className={styles.textEquivalent}><strong>Text equivalent:</strong> a two-branch ledger shows a rare H path and common not-H path, each ending in a positive-signal joint mass. The visual does not imply causality.</p>
      </>
    );
  }

  if (view === "variation") {
    return (
      <>
        <div className={styles.fixtureLead}>
          <div><span>Two laws, one mean</span><p className={styles.formula}>E[A] = E[B] = 1</p></div>
          <p>Distribution A is fixed at 1. Distribution B is 0 most of the time and 4 occasionally. The mean alone cannot narrate variability, tails, or loss.</p>
        </div>
        <div className={styles.distributionBoard} aria-hidden="true">
          <div><span>law A</span><i className={styles.barFull} /><b>all mass at 1</b></div>
          <div><span>law B</span><i className={styles.barTall} /><i className={styles.barSmall} /><b>rare large outcome</b></div>
          <div className={styles.meanMarker}>mean = 1</div>
        </div>
        <p className={styles.textEquivalent}><strong>Text equivalent:</strong> the first distribution has a single outcome at 1. The second has a large mass at 0 and smaller mass at 4; both average to 1 under their declared laws.</p>
        <p className={styles.codeContract}><strong>Code-reading contract:</strong> audit units, population versus sample denominator, second moments, missingness, and whether a covariance/correlation is being upgraded into a causal story.</p>
      </>
    );
  }

  if (view === "repetition") {
    return (
      <>
        <div className={styles.fixtureLead}>
          <div><span>Fixed repetition fixture</span><p className={styles.formula}>running means: 1, 1/2, 2/3, 1/2, 3/5, 1/2</p></div>
          <p>One trace is a finite observation. Keep target law, sampling unit, dependence, seed, stopping rule, and named convergence/bound conditions outside the line.</p>
        </div>
        <div className={styles.traceBoard} aria-hidden="true">
          {[100, 50, 67, 50, 60, 50].map((height, index) => <i key={height + index} style={{ height: `${height}%` }} />)}
          <span>finite running-average trace</span>
        </div>
        <div className={styles.assumptionRail}>
          <span>target expectation</span><i aria-hidden="true" /><span>sampling/dependence model</span><i aria-hidden="true" /><span>theorem or procedure</span><i aria-hidden="true" /><span>finite output</span>
        </div>
      </>
    );
  }

  if (view === "likelihood") {
    return (
      <>
        <div className={styles.fixtureLead}>
          <div><span>Bernoulli count fixture</span><p className={styles.formula}>k=3 successes in n=4 declared trials</p></div>
          <p>The likelihood ranks parameter values for these data under a model. A Beta prior changes posterior shape; neither validates exchangeability, labeling, or the decision objective.</p>
        </div>
        <div className={styles.likelihoodBoard} aria-hidden="true">
          <div><span>p=1/4</span><i style={{ height: "11%" }} /></div>
          <div><span>p=1/2</span><i style={{ height: "59%" }} /></div>
          <div className={styles.likelihoodPeak}><span>p=3/4</span><i style={{ height: "100%" }} /></div>
          <div><span>p=1</span><i style={{ height: "0%" }} /></div>
        </div>
        <p className={styles.textEquivalent}>
          <strong>Text equivalent:</strong> for this fixture,
          <code> L(p) = p^3(1-p) </code>. Relative to the displayed maximum at
          <code> p=3/4 </code>, the four shown likelihoods rank as
          <code> p=3/4 </code> (100%), <code> p=1/2 </code> (about 59%),
          <code> p=1/4 </code> (about 11%), then <code> p=1 </code> (0%).
          This ranks only these declared parameter values; it neither normalizes
          a posterior nor validates the Bernoulli trial model.
        </p>
        <table className={styles.dataTable}>
          <caption>Objects kept separate</caption>
          <tbody>
            <tr><th scope="row">likelihood</th><td>ranks p for observed data</td></tr>
            <tr><th scope="row">MLE</th><td>maximizes likelihood</td></tr>
            <tr><th scope="row">posterior</th><td>prior × likelihood, normalized</td></tr>
            <tr><th scope="row">MAP</th><td>maximizes declared posterior</td></tr>
          </tbody>
        </table>
      </>
    );
  }

  if (view === "procedure") {
    return (
      <>
        <div className={styles.fixtureLead}>
          <div><span>Procedure cards</span><p className={styles.formula}>estimand → design → statistic → error target → report</p></div>
          <p>An interval, p-value, multiple-testing rule, bootstrap, and permutation test each have a different contract. Do not use a familiar label as an explanation.</p>
        </div>
        <div className={styles.procedureCards}>
          <div><span>Interval</span><b>coverage procedure</b><p>model + standard error + critical rule</p></div>
          <div><span>P-value</span><b>null tail probability</b><p>test statistic + sampling/assignment rule</p></div>
          <div><span>Resampling</span><b>synthetic procedure</b><p>unit + exchangeability/IID + method + seed</p></div>
        </div>
        <p className={styles.textEquivalent}><strong>Text equivalent:</strong> three cards distinguish coverage, a null tail probability, and a resampling contract. None reports whether a null is true or whether an action is wise.</p>
      </>
    );
  }

  return (
    <>
      <div className={styles.fixtureLead}>
        <div><span>Synthetic study path</span><p className={styles.formula}>eligible → assigned → delivered → measured → observed → analyzed</p></div>
        <p>A calculation only answers the question supported by this path. Attrition, retries, selection, missingness, unplanned metrics, and p&gt;n change the claim before an estimator is chosen.</p>
      </div>
      <div className={styles.designMap} aria-hidden="true">
        {['eligible', 'assigned', 'delivered', 'measured', 'observed', 'analyzed'].map((stage, index) => (
          <div key={stage}><span>{String(index + 1).padStart(2, '0')}</span><b>{stage}</b></div>
        ))}
      </div>
      <div className={styles.warningTiles}>
        <div><span>missingness</span><p>MCAR/MAR/MNAR are model claims, not labels proven by an NA mask.</p></div>
        <div><span>dimension</span><p>When p ≥ n, rank/nullity and structural assumptions precede a unique fit claim.</p></div>
        <div><span>authority</span><p>Evidence may support a reversible next study, not an automated learner decision.</p></div>
      </div>
    </>
  );
}

export function ProbabilityInferenceStudio() {
  const [activeView, setActiveView] = useState<StudioView>("base-rate");
  const [record, setRecord] = useState<StudioRecord>(emptyRecord);
  const [storageReady, setStorageReady] = useState(false);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const activeRecord = record[activeView];

  useEffect(() => {
    const hydrationTimer = window.setTimeout(() => {
      try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed: unknown = JSON.parse(stored);
          if (isStudioRecord(parsed)) setRecord(parsed);
        }
      } catch {
        // Local progress is optional. Only choice/confidence/reveal state is retained.
      } finally {
        setStorageReady(true);
      }
    }, 0);
    return () => window.clearTimeout(hydrationTimer);
  }, []);

  useEffect(() => {
    if (!storageReady) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
    } catch {
      // A private browser may deny storage; in-memory study remains available.
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
      if (!candidate.choice || !candidate.confidence) return current;
      return { ...current, [activeView]: { ...candidate, revealed: true } };
    });
  }

  function selectView(nextIndex: number, focus = false) {
    const normalized = (nextIndex + views.length) % views.length;
    setActiveView(views[normalized].id);
    if (focus) tabRefs.current[normalized]?.focus();
  }

  function onTabKeyDown(event: ReactKeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key === "ArrowRight") { event.preventDefault(); selectView(index + 1, true); }
    if (event.key === "ArrowLeft") { event.preventDefault(); selectView(index - 1, true); }
    if (event.key === "Home") { event.preventDefault(); selectView(0, true); }
    if (event.key === "End") { event.preventDefault(); selectView(views.length - 1, true); }
  }

  const currentIndex = views.findIndex((view) => view.id === activeView);

  return (
    <section className={styles.studio} aria-labelledby="probability-inference-studio-title">
      <div className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.kicker}>Module 30 interactive reasoning studio</p>
          <h2 id="probability-inference-studio-title">Probability &amp; Inference Studio</h2>
          <p>
            A number becomes meaningful only inside a visible argument: target,
            probability model, data path, procedure, uncertainty, boundary, and
            limited human decision. Explore six fixed synthetic fixtures before
            opening the full workbook.
          </p>
          <div className={styles.heroFacts}>
            <span><b>6</b> connected lenses</span>
            <span><b>0</b> server records</span>
            <span><b>1</b> inference card</span>
          </div>
        </div>
        <div className={styles.orbit} aria-hidden="true">
          <span>target</span><i className={styles.orbitOne} /><i className={styles.orbitTwo} /><i className={styles.orbitThree} />
          <b>?</b>
        </div>
      </div>

      <div className={styles.invariantPlate}>
        <span>M30 working invariant</span>
        <p>Keep population, estimand, sampling/assignment, model, finite procedure, uncertainty, and decision boundary in the same frame.</p>
      </div>

      <ol className={styles.reasoningChain} aria-label="Inference reasoning chain">
        {['target', 'model', 'data path', 'procedure', 'boundary', 'decision'].map((step, index) => <li key={step}><strong>{index + 1}</strong><span>{step}</span></li>)}
      </ol>

      <div className={styles.workspace}>
        <div className={styles.tabs} role="tablist" aria-label="Probability and inference investigations">
          {views.map((view, index) => (
            <button
              aria-controls={`${view.id}-panel`}
              aria-selected={activeView === view.id}
              className={activeView === view.id ? styles.tabActive : undefined}
              id={`${view.id}-tab`}
              key={view.id}
              onClick={() => selectView(index)}
              onKeyDown={(event) => onTabKeyDown(event, index)}
              ref={(element) => { tabRefs.current[index] = element; }}
              role="tab"
              tabIndex={activeView === view.id ? 0 : -1}
              type="button"
            >
              <span>{view.number}</span>{view.label}
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
          <Fixture view={activeView} />
          <PredictionGate view={activeView} record={activeRecord} onChoice={choose} onConfidence={setConfidence} onReveal={reveal} />
        </div>
      </div>

      <footer className={styles.footerBand}>
        <div>
          <span>Bounded teaching boundary</span>
          <p>This studio uses finite fixtures and is not a theorem prover, data-analysis service, causal estimator, or decision engine.</p>
        </div>
        <div className={styles.footerLinks}>
          <a href="#diagnostic-repair-key">Diagnostic repair key</a>
          <a href="#11-project--uncertainty--inference-evidence-dossier">Evidence dossier</a>
          <a href="#13-conversational-oral-defense--m30">Constructive oral defense</a>
        </div>
        <p className={styles.progress} aria-live="polite">
          Lens {currentIndex + 1} of {views.length}: {activeRecord.revealed ? "explanation recorded locally" : "prediction open"}.
        </p>
      </footer>
    </section>
  );
}
