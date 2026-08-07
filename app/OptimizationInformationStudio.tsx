"use client";

import Link from "next/link";
import { type KeyboardEvent as ReactKeyboardEvent, useRef, useState } from "react";
import { StudioFigure } from "./StudioFigure";
import styles from "./AdvancedStudio.module.css";

/**
 * The constrained-stationarity fixture, drawn from the declared feasible set.
 * The unconstrained minimum sits outside it, so the constrained solution is on
 * the boundary — which is the whole point of Session 3's certificate work.
 */
const feasibleRegionFigureSpec = {
  kind: "vector2d",
  width: 420,
  height: 300,
  xRange: [-0.6, 2.4],
  yRange: [-0.6, 2.4],
  segments: [{ from: [0, 1.6], to: [1.6, 0], label: "x + y = 1.6" }],
  points: [
    { at: [1.5, 1.5], label: "unconstrained min" },
    { at: [0.8, 0.8], label: "boundary candidate" },
    { at: [0, 0], label: "origin" },
  ],
} as const;

/** Session 4's six recorded iterates. A trace, not a convergence theorem. */
const stoppingTraceFigureSpec = {
  kind: "plot",
  width: 420,
  height: 260,
  xLabel: "iteration",
  yLabel: "‖residual‖",
  xRange: [0.6, 6.4],
  yRange: [0, 1.05],
  series: [
    {
      points: [
        [1, 1],
        [2, 0.62],
        [3, 0.41],
        [4, 0.3],
        [5, 0.27],
        [6, 0.26],
      ],
      label: "recorded residual",
    },
  ],
} as const;

type StudioView =
  | "formulate"
  | "local"
  | "constraints"
  | "stopping"
  | "noise"
  | "information";

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
    id: "formulate",
    number: "01",
    label: "Formulation",
    question: "What has to be declared before any solver is chosen?",
  },
  {
    id: "local",
    number: "02",
    label: "Local vs global",
    question: "A gradient check disagrees. What does that establish?",
  },
  {
    id: "constraints",
    number: "03",
    label: "Constraints",
    question: "The Lagrangian is stationary. What has been earned?",
  },
  {
    id: "stopping",
    number: "04",
    label: "Stopping evidence",
    question: "Six iterates are recorded. Which claim do they support?",
  },
  {
    id: "noise",
    number: "05",
    label: "Noise as evidence",
    question: "A stochastic run finished. What is the scope of the result?",
  },
  {
    id: "information",
    number: "06",
    label: "Information trade-off",
    question: "A KL term hits a support mismatch. What is the honest move?",
  },
];

const choices: Record<StudioView, ReadonlyArray<{ id: string; label: string }>> = {
  formulate: [
    {
      id: "declare-target-and-excluded-harm",
      label:
        "State the target, the proxy standing in for it, the excluded harm or constraint, and who is accountable.",
    },
    {
      id: "smallest-reported-objective",
      label: "Select whichever solver reports the smallest objective value.",
    },
    {
      id: "more-training-data",
      label: "Add more data until the objective stabilises.",
    },
  ],
  local: [
    {
      id: "inspect-implementation-and-domain",
      label:
        "Inspect the implementation, domain, dtype, and step-size assumptions before concluding anything about the objective.",
    },
    { id: "conclude-nonconvex", label: "Conclude that the objective is nonconvex." },
    {
      id: "shrink-step-until-agreement",
      label: "Keep shrinking the finite-difference step until the numbers agree.",
    },
  ],
  constraints: [
    {
      id: "stationary-not-yet-certified",
      label:
        "An unconstrained stationary point of the Lagrangian — feasibility and certificate work still remain.",
    },
    { id: "constrained-optimum", label: "A constrained optimum." },
    {
      id: "constraint-discharged-by-solver",
      label: "The constraint is discharged once a solver has run.",
    },
  ],
  stopping: [
    {
      id: "bounded-observations-inspect-residuals",
      label:
        "This configuration produced six bounded observations; inspect residuals and the stopping rule before claiming more.",
    },
    {
      id: "converges-for-every-step-size",
      label: "The method converges for every step size.",
    },
    { id: "toy-problem-globally-solved", label: "The problem is globally solved." },
  ],
  noise: [
    {
      id: "declared-sequence-finite-observation",
      label:
        "This declared noise sequence and update rule produced one finite observation, under this seed.",
    },
    {
      id: "unbiased-for-every-distribution",
      label: "The estimator is unbiased for every distribution.",
    },
    {
      id: "general-convergence-guarantee",
      label: "The algorithm carries a general convergence guarantee.",
    },
  ],
  information: [
    {
      id: "repair-support-mismatch",
      label: "Repair the support mismatch explicitly rather than hiding it.",
    },
    { id: "treat-term-as-zero", label: "Treat the offending term as zero." },
    { id: "swap-the-log-base", label: "Replace it automatically with a different log base." },
  ],
};

const correctChoice: Record<StudioView, string> = {
  formulate: "declare-target-and-excluded-harm",
  local: "inspect-implementation-and-domain",
  constraints: "stationary-not-yet-certified",
  stopping: "bounded-observations-inspect-residuals",
  noise: "declared-sequence-finite-observation",
  information: "repair-support-mismatch",
};

const feedback: Record<
  StudioView,
  { title: string; answer: string; whyOthersFail: string; boundary: string }
> = {
  formulate: {
    title: "An objective is a modelling claim before it is a computation",
    answer:
      "Optimisation minimises the objective it was given. Everything the objective omits — the excluded harm, the unstated constraint, the person accountable for the trade — is omitted from the result too, silently and by construction.",
    whyOthersFail:
      "Picking the smallest reported objective compares solvers across possibly different formulations, so the number is not a common scale. Adding data changes the estimate, not the target being estimated.",
    boundary:
      "Declaring the four fields does not make the proxy adequate. It makes the gap between proxy and target inspectable, which is a precondition for arguing about it.",
  },
  local: {
    title: "A disagreement locates a discrepancy, not its cause",
    answer:
      "Finite differences and analytic gradients disagree for several distinct reasons: a wrong derivative, a non-differentiable point, a step size in the cancellation regime, or a dtype too narrow for the chosen step. The disagreement alone does not distinguish them.",
    whyOthersFail:
      "Nonconvexity is a property of the objective and is not evidenced by a numerical mismatch. Shrinking the step drives the check into catastrophic cancellation, so agreement obtained that way is an artifact.",
    boundary:
      "Agreement after inspection bounds a disagreement at one point in one direction. It does not certify the gradient everywhere.",
  },
  constraints: {
    title: "Stationarity is a necessary condition under qualifications",
    answer:
      "A stationary point of the Lagrangian satisfies a first-order necessary condition. Turning that into a constrained optimum needs feasibility, a constraint qualification, and — for a sufficiency claim — convexity or a second-order condition.",
    whyOthersFail:
      "Calling it a constrained optimum skips exactly the conditions that make the multiplier meaningful. Treating the constraint as discharged confuses running a solver with satisfying a hypothesis.",
    boundary:
      "The multiplier is a certificate only when its qualification holds. Report the qualification you are relying on by name.",
  },
  stopping: {
    title: "A stopping rule fired; that is the observation",
    answer:
      "Six recorded residuals under one step size, one initialisation, and one stopping tolerance are six observations. The trace shows the residual flattening near 0.26 — which is consistent with convergence and equally consistent with a tolerance reached too early.",
    whyOthersFail:
      "Convergence for every step size is a theorem with hypotheses that this run does not check. A global-solution claim needs either convexity or an exhaustive argument, neither of which a trace supplies.",
    boundary:
      "Changing the initialisation is the cheapest probe that distinguishes a converged run from a satisfied tolerance.",
  },
  noise: {
    title: "The seed is part of the result",
    answer:
      "A stochastic method's output is a random variable. One run is one draw. Reporting it as the method's behaviour drops the sampling distribution that makes the number interpretable.",
    whyOthersFail:
      "Unbiasedness holds under stated conditions on the noise, not universally. A convergence guarantee similarly carries step-size and variance hypotheses that a single finished run does not establish.",
    boundary:
      "Repeat runs under different seeds bound the spread. They still say nothing about a different objective or noise model.",
  },
  information: {
    title: "A divergence has a support condition",
    answer:
      "KL divergence is defined when the second distribution's support contains the first's. Where it does not, the term is genuinely infinite — that is information, not an inconvenience. The honest move is to state the mismatch and decide explicitly how to handle it.",
    whyOthersFail:
      "Treating the term as zero silently replaces an infinite divergence with a finite number. Changing the log base rescales every term uniformly and cannot repair a support problem.",
    boundary:
      "Smoothing repairs the computation by changing the distribution. Report the smoothed distribution, not the original, as the thing measured.",
  },
};

const emptyRecord: StudioRecord = {
  formulate: { choice: null, confidence: null, revealed: false },
  local: { choice: null, confidence: null, revealed: false },
  constraints: { choice: null, confidence: null, revealed: false },
  stopping: { choice: null, confidence: null, revealed: false },
  noise: { choice: null, confidence: null, revealed: false },
  information: { choice: null, confidence: null, revealed: false },
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
    <section className={styles.predictionGate} aria-labelledby={`m31-${view}-gate-title`}>
      <div className={styles.gateHeading}>
        <span>Prediction gate</span>
        <h3 id={`m31-${view}-gate-title`}>
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
              ? "Now remove one hypothesis and say what survives."
              : "Find the smallest changed assumption that repairs the claim."}
          </p>
        </div>
      )}
    </section>
  );
}

function Fixture({ view }: { view: StudioView }) {
  if (view === "formulate") {
    return (
      <>
        <div className={styles.fixtureLead}>
          <div>
            <span>Declared objective</span>
            <h3>The proxy is not the target.</h3>
            <p className={styles.formula}>minimise mean_queue_wait(x) subject to x ∈ X</p>
          </div>
          <p>
            A routing policy is scored by mean wait. The target is a service the
            queue exists to deliver; the excluded quantity is the tail nobody put
            in the objective. Name all four fields before comparing solvers.
          </p>
        </div>
        <table className={styles.dataTable}>
          <caption>Formulation card for the declared fixture</caption>
          <tbody>
            <tr><th scope="row">Target</th><td>timely service for every request</td></tr>
            <tr><th scope="row">Proxy</th><td>mean queue wait over one hour</td></tr>
            <tr><th scope="row">Excluded</th><td>the 99th-percentile tail</td></tr>
            <tr><th scope="row">Accountable</th><td>named before deployment, not after</td></tr>
          </tbody>
        </table>
        <p className={styles.textEquivalent}>
          <strong>Text equivalent:</strong> the card lists a target, the proxy
          standing in for it, one quantity the proxy omits, and an owner. A
          minimiser of the proxy can move the omitted quantity freely.
        </p>
      </>
    );
  }

  if (view === "local") {
    return (
      <>
        <div className={styles.fixtureLead}>
          <div>
            <span>Gradient check</span>
            <h3>Two computations disagree in the fourth digit.</h3>
            <p className={styles.formula}>|analytic − central difference| ≈ 3.1 × 10⁻⁴</p>
          </div>
          <p>
            The central difference has truncation error O(h²) and a cancellation
            term that grows as ε/h. Both are present at once, so the observed gap
            is a sum of at least two effects before any bug is considered.
          </p>
        </div>
        <table className={styles.dataTable}>
          <caption>Candidate causes, none excluded by the number alone</caption>
          <thead>
            <tr><th scope="col">Cause</th><th scope="col">Cheapest discriminating probe</th></tr>
          </thead>
          <tbody>
            <tr><td>wrong analytic derivative</td><td>check a second point and a second direction</td></tr>
            <tr><td>non-differentiable point</td><td>perturb the evaluation point</td></tr>
            <tr><td>step in the cancellation regime</td><td>sweep h; look for the U-shaped error curve</td></tr>
            <tr><td>dtype too narrow</td><td>rerun the check in float64</td></tr>
          </tbody>
        </table>
        <p className={styles.codeContract}>
          <strong>Code-reading contract:</strong> record dtype, step size, the
          evaluation point, and the direction. A gradient check without those
          four fields cannot be repeated, so it cannot be refuted.
        </p>
      </>
    );
  }

  if (view === "constraints") {
    return (
      <>
        <div className={styles.fixtureLead}>
          <div>
            <span>Feasible set</span>
            <h3>The unconstrained minimum is outside the region.</h3>
            <p className={styles.formula}>min f(x, y) s.t. x + y ≤ 1.6, x ≥ 0, y ≥ 0</p>
          </div>
          <p>
            When the unconstrained minimiser is infeasible, the constrained
            solution sits on the boundary and the active constraint carries a
            multiplier. That is the situation in which a certificate means
            something — and in which its qualification must be named.
          </p>
        </div>
        <StudioFigure
          spec={feasibleRegionFigureSpec}
          label="The unconstrained minimum lies outside the feasible set, so the solution sits on the boundary"
          describedById="m31-constraints-alternative"
        />
        <p className={styles.textEquivalent} id="m31-constraints-alternative">
          <strong>Text equivalent:</strong> the line x + y = 1.6 bounds the
          feasible region. The unconstrained minimum is marked beyond it, a
          boundary candidate is marked on it, and the origin is marked inside.
          Because the unconstrained point is infeasible, the constraint is active
          at the solution.
        </p>
      </>
    );
  }

  if (view === "stopping") {
    return (
      <>
        <div className={styles.fixtureLead}>
          <div>
            <span>Recorded run</span>
            <h3>Six iterates, one stopping tolerance.</h3>
            <p className={styles.formula}>residuals: 1.00, 0.62, 0.41, 0.30, 0.27, 0.26</p>
          </div>
          <p>
            The residual flattens near 0.26. That shape is consistent with
            convergence to a stationary point and equally consistent with a
            tolerance reached before one. The trace does not separate them.
          </p>
        </div>
        <StudioFigure
          spec={stoppingTraceFigureSpec}
          label="Six recorded residuals decreasing then flattening near 0.26"
          describedById="m31-stopping-alternative"
        />
        <p className={styles.textEquivalent} id="m31-stopping-alternative">
          <strong>Text equivalent:</strong> the residual falls steeply for three
          iterations, then flattens, changing by 0.01 between the fifth and
          sixth. A flattening trace is an observation about this run under this
          step size and initialisation.
        </p>
      </>
    );
  }

  if (view === "noise") {
    return (
      <>
        <div className={styles.fixtureLead}>
          <div>
            <span>Stochastic run</span>
            <h3>One seed, one draw.</h3>
            <p className={styles.formula}>x₊ = x − η(∇f(x) + ξ), ξ ~ declared noise, seed fixed</p>
          </div>
          <p>
            The update rule is deterministic given the noise sequence. Fix the
            seed and the run is reproducible; change it and the output changes.
            Both facts have to appear in the record for the number to mean
            anything.
          </p>
        </div>
        <table className={styles.dataTable}>
          <caption>What the record must carry for a stochastic result</caption>
          <tbody>
            <tr><th scope="row">Noise model</th><td>declared distribution and independence assumption</td></tr>
            <tr><th scope="row">Seed</th><td>recorded, because it selects the draw</td></tr>
            <tr><th scope="row">Step size</th><td>fixed or scheduled, stated either way</td></tr>
            <tr><th scope="row">Repeats</th><td>how many, and the observed spread</td></tr>
          </tbody>
        </table>
        <p className={styles.codeContract}>
          <strong>Code-reading contract:</strong> a single reported final value
          from a stochastic method is a point estimate of a distribution whose
          spread was not reported. Ask for the repeats before comparing methods.
        </p>
      </>
    );
  }

  return (
    <>
      <div className={styles.fixtureLead}>
        <div>
          <span>Divergence fixture</span>
          <h3>The reference assigns zero where the model does not.</h3>
          <p className={styles.formula}>D(p ‖ q) = Σ p(x) log( p(x) / q(x) )</p>
        </div>
        <p>
          KL requires q to be positive wherever p is. The fixture violates that
          at one outcome, so the sum contains a genuinely infinite term. The
          infinity is the finding, not an obstacle to route around.
        </p>
      </div>
      <table className={styles.dataTable}>
        <caption>Declared distributions over four outcomes</caption>
        <thead>
          <tr><th scope="col">outcome</th><th scope="col">p</th><th scope="col">q</th><th scope="col">term</th></tr>
        </thead>
        <tbody>
          <tr><td>a</td><td>0.4</td><td>0.5</td><td>finite</td></tr>
          <tr><td>b</td><td>0.3</td><td>0.3</td><td>0</td></tr>
          <tr><td>c</td><td>0.2</td><td>0.2</td><td>0</td></tr>
          <tr><td>d</td><td>0.1</td><td>0.0</td><td>infinite</td></tr>
        </tbody>
      </table>
      <p className={styles.textEquivalent}>
        <strong>Text equivalent:</strong> three outcomes contribute finite terms.
        The fourth has p positive and q zero, so its term diverges. Any finite
        number reported for this pair has silently changed one of the two
        distributions.
      </p>
    </>
  );
}

export function OptimizationInformationStudio() {
  const [activeView, setActiveView] = useState<StudioView>("formulate");
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
    <section className={styles.studio} aria-labelledby="optimization-information-studio-title">
      <div className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.kicker}>Module 31 interactive reasoning studio</p>
          <h2 id="optimization-information-studio-title">
            Optimization &amp; Information Studio
          </h2>
          <p>
            An optimiser returns the minimiser of the objective it was handed,
            under the conditions that actually held. Six fixed synthetic fixtures
            separate the formulation from the run, the run from the theorem, and
            the theorem from the decision.
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
        <span>M31 working invariant</span>
        <p>
          An objective is a modelling claim; a stationary point is a condition
          under qualifications; a finished run is one observation. Keep the
          formulation, the certificate, and the trace in separate columns.
        </p>
      </div>

      <ol className={styles.reasoningChain} aria-label="Optimization reasoning chain">
        {["target", "objective", "conditions", "algorithm", "trace", "claim"].map(
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
          aria-label="Optimization and information investigations"
        >
          {views.map((view, index) => (
            <button
              aria-controls={`m31-${view.id}-panel`}
              aria-selected={activeView === view.id}
              className={activeView === view.id ? styles.tabActive : undefined}
              id={`m31-${view.id}-tab`}
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
          aria-labelledby={`m31-${activeView}-tab`}
          className={styles.panel}
          id={`m31-${activeView}-panel`}
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
          {answered} of {views.length} explanation packets opened in this browser.
        </p>

        <div className={styles.footerBand}>
          <div>
            <span>Boundary</span>
            <p>
              This studio keeps predictions in memory for this visit only. It
              writes nothing to browser storage, records no learner identity,
              sends nothing to a server, and creates no course credit or mastery
              claim. Persistence arrives with M31&apos;s learner release, when a
              reviewed progress surface can be declared for it. The workbook
              remains the authority for every derivation shown here.
            </p>
            {clearNotice ? <p role="status">{clearNotice}</p> : null}
          </div>
          <div className={styles.footerLinks}>
            <button onClick={clearPredictionEvidence} type="button">
              Reset predictions
            </button>
            <Link href="/modules/31-optimization-information">Open the workbook</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
