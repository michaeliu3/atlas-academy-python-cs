"use client";

import Link from "next/link";
import {
  type KeyboardEvent as ReactKeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { getBrowserProgressStorage } from "@/lib/browser-progress-storage";
import {
  clearModule29Progress,
  persistModule29Progress,
  restoreModule29Progress,
} from "@/lib/module29-progress-codec";
import { StudioFigure } from "./StudioFigure";
import styles from "./CalculusContinuousChangeStudio.module.css";

/**
 * The limit-view fixture: f(x) = (x² − 1)/(x − 1) reduces to x + 1 away from
 * x = 1, so the graph is drawn as two segments with a gap there. Both carry
 * tone 0 so they read as one rule; the two marked points are the limit height
 * the rule approaches and the separately declared value f(1) = 0.
 */
const removableDiscontinuityFigureSpec = {
  kind: "plot",
  width: 420,
  height: 300,
  xLabel: "x",
  yLabel: "f(x)",
  xRange: [-0.4, 2.4],
  yRange: [-0.4, 3.6],
  series: [
    { points: [[-0.4, 0.6], [0.94, 1.94]], tone: 0, label: "x + 1" },
    { points: [[1.06, 2.06], [2.4, 3.4]], tone: 0 },
  ],
  points: [
    { at: [1, 2], label: "approach: 2" },
    { at: [1, 0], label: "declared f(1) = 0" },
  ],
} as const;

type StudioView =
  | "limit"
  | "local"
  | "area"
  | "chain"
  | "convergence"
  | "trajectory";

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
    id: "limit",
    number: "01",
    label: "Limit & continuity",
    question: "Which account of this punctured formula is justified?",
  },
  {
    id: "local",
    number: "02",
    label: "Local change",
    question: "What does this finite-difference fixture establish?",
  },
  {
    id: "area",
    number: "03",
    label: "Coordinates & area",
    question: "Which change-of-variables conclusion is legal here?",
  },
  {
    id: "chain",
    number: "04",
    label: "Jacobian chain",
    question: "Which derivative and array-contract trace is correct?",
  },
  {
    id: "convergence",
    number: "05",
    label: "Convergence",
    question: "Which convergence-and-exchange claim survives the domain?",
  },
  {
    id: "trajectory",
    number: "06",
    label: "Constraints & time",
    question: "Which candidate-and-simulation claim stays within evidence?",
  },
];

const choices: Record<StudioView, ReadonlyArray<{ id: string; label: string }>> = {
  limit: [
    {
      id: "removable",
      label:
        "The two-sided limit is 2 but the declared value is 0, so this is a removable discontinuity—not a continuous function at x = 1.",
    },
    {
      id: "value-controls-limit",
      label:
        "Because f(1) = 0 is explicitly declared, the limit must equal 0 and the function is continuous.",
    },
    {
      id: "graph-proof",
      label:
        "A sufficiently dense plot near x = 1 proves continuity even if no value is declared at the point.",
    },
  ],
  local: [
    {
      id: "forward-boundary",
      label:
        "The forward quotient is 12.61 while the derivative is 12: it overestimates in this exact cubic fixture. Smaller h reduces this truncation term in exact arithmetic, but roundoff creates a separate boundary.",
    },
    {
      id: "any-h-proves",
      label:
        "The finite quotient equals the derivative because h = 0.1 is already small, so it proves the local model over any interval.",
    },
    {
      id: "automatic-best",
      label:
        "Taking h as close to zero as possible is always numerically best, independent of dtype and subtraction cancellation.",
    },
  ],
  area: [
    {
      id: "absolute-determinant",
      label:
        "The signed determinant is −2, while the unit-square image has area |−2| × 1 = 2. The absolute factor needs the stated one-to-one coordinate-map and region assumptions.",
    },
    {
      id: "signed-area",
      label:
        "The transformed area is −2 because orientation reversal makes physical area negative.",
    },
    {
      id: "det-optional",
      label:
        "Any differentiable formula can be used for an area substitution without checking its determinant, region, or possible overlap.",
    },
  ],
  chain: [
    {
      id: "row-gradient",
      label:
        "With Jacobian rows = outputs and columns = inputs, ∇G(F(1, 2)) = [6, 1] and [6, 1] JF(1, 2) = [8, 7]. A batch shape being compatible does not prove the feature meaning or differentiation contract.",
    },
    {
      id: "transpose-free",
      label:
        "A Jacobian can be multiplied in either order because gradients and differentials have the same shape conceptually.",
    },
    {
      id: "autodiff-proof",
      label:
        "An autodiff result is automatically a valid derivative of the intended scientific model, regardless of branch, dtype, or nondifferentiable operation.",
    },
  ],
  convergence: [
    {
      id: "pointwise-not-uniform",
      label:
        "xⁿ converges pointwise to 0 below 1 and to 1 at 1, but not uniformly on [0, 1]. On [0, r] for r < 1 it is uniform; the domain changes the conclusion.",
    },
    {
      id: "pointwise-is-uniform",
      label:
        "Every fixed x below 1 eventually becomes small, so one N works for every x in [0, 1].",
    },
    {
      id: "finite-grid-exchange",
      label:
        "A dense finite grid with small errors authorizes exchanging this limit with continuity, integration, or expectation.",
    },
  ],
  trajectory: [
    {
      id: "candidate-not-certificate",
      label:
        "∇f = λ∇g yields candidates on the unit circle that still require comparison. Euler values 2 and 2.25 for y′ = y at t = 1 are finite traces, not a general convergence or safety certificate.",
    },
    {
      id: "multiplier-solves-all",
      label:
        "Once a Lagrange multiplier equation is solved, it has proved the unique global maximum and minimum without checking candidates or the constraint set.",
    },
    {
      id: "refinement-proves",
      label:
        "Because the half-step Euler value is closer to e in this example, every ODE solver is accurate enough after one refinement.",
    },
  ],
};

const correctChoice: Record<StudioView, string> = {
  limit: "removable",
  local: "forward-boundary",
  area: "absolute-determinant",
  chain: "row-gradient",
  convergence: "pointwise-not-uniform",
  trajectory: "candidate-not-certificate",
};

const feedback: Record<
  StudioView,
  { title: string; answer: string; whyOthersFail: string; boundary: string }
> = {
  limit: {
    title: "A point value and a nearby-value rule answer different questions.",
    answer:
      "For x ≠ 1, (x² − 1)/(x − 1) = x + 1, so nearby values approach 2. The declared f(1) = 0 disagrees, hence f is not continuous at 1. Redefining only that value to 2 repairs this particular discontinuity.",
    whyOthersFail:
      "A value at the point does not force a limit; the limit concerns every sufficiently close input. A graph samples finitely many values and cannot discharge the quantified definition.",
    boundary:
      "This factorization is valid only away from x = 1—the very point where the original quotient is undefined. A numeric tolerance or plot is useful evidence for a program, not an epsilon–delta proof by itself.",
  },
  local: {
    title: "Local linearity has a remainder, and the machine has another error source.",
    answer:
      "For f(x) = x³ at a = 2, [f(2 + h) − f(2)]/h = 12 + 6h + h². At h = 0.1 it is 12.61, above the exact derivative 12. The Taylor expansion identifies the exact local remainder in this fixture.",
    whyOthersFail:
      "Small is not zero, and a local derivative does not make a global linear claim. Shrinking h reduces truncation in exact arithmetic but can magnify floating-point cancellation when two close values are subtracted.",
    boundary:
      "The conclusion is for a named smooth cubic and a forward difference. A cusp, discontinuity, finite dtype, adaptive method, or different stencil needs its own condition and error argument.",
  },
  area: {
    title: "Coordinates change density; orientation changes the sign, not physical area.",
    answer:
      "For T(u, v) = (u + v, u − v), DT = [[1, 1], [1, −1]] and det(DT) = −2. The image area of a one-to-one unit-square map is |det(DT)| times the source area: 2.",
    whyOthersFail:
      "Signed determinant records orientation. Area is nonnegative, so the change-of-variables formula uses its absolute value. Differentiability alone does not prevent folding or duplicate coverage.",
    boundary:
      "A full change-of-variables argument names a suitable domain, regularity, injectivity or a justified partition, transformed integrand, and measure. A determinant alone is not permission to substitute coordinates.",
  },
  chain: {
    title: "The chain rule is a shape-sensitive composition of local maps.",
    answer:
      "JF(1, 2) = [[1, 1], [2, 1]] for F(x, y) = (x + y, xy). With G(u, v) = u² + v, F(1, 2) = (3, 2), ∇G = [6, 1], and the stated row convention gives [6, 1]JF = [8, 7].",
    whyOthersFail:
      "A transpose is not cosmetic: it expresses whether a differential acts on a column displacement or a row covector. Autodiff differentiates the executed program, which may differ from the intended model.",
    boundary:
      "Name Jacobian convention, feature axis, dtype, branch behavior, and differentiability at the evaluated point. A compatible tensor product can still represent the wrong variables or a non-smooth operation.",
  },
  convergence: {
    title: "The order of quantifiers decides what an operation may inherit.",
    answer:
      "For every fixed x < 1, xⁿ → 0; at x = 1 it stays 1. Yet sup₍[0,1]₎ |fₙ − f| is 1, approached near the endpoint, so no single N works on the entire interval. Restricting to [0, r] changes the supremum to rⁿ.",
    whyOthersFail:
      "Pointwise convergence permits N to depend on x. A finite grid lacks the near-endpoint points needed for a supremum claim, and it supplies none of the hypotheses for an interchange theorem.",
    boundary:
      "Uniform convergence is one route for some operations, not a universal permit. Differentiation and expectation require their own named conditions; probability language and dominated convergence are developed formally in M30.",
  },
  trajectory: {
    title: "Candidate equations and numerical traces are evidence with a scope, not verdicts.",
    answer:
      "For f(x, y) = x + y and g(x, y) = x² + y² = 1, the multiplier equation produces the aligned and anti-aligned candidates; values or an appropriate second-order/global argument choose extrema. Euler h = 1 gives 2 while two h = 1/2 steps give 2.25 against e, an illustrative finite comparison.",
    whyOthersFail:
      "Multiplier equations are necessary candidate conditions under their hypotheses, not an automatic global proof. One refinement on one nonstiff scalar equation does not establish a solver’s error model, stability region, or safety.",
    boundary:
      "Name constraint qualification, feasible set, derivative assumptions, step rule, tolerance, interval, stiffness, and stopping criterion. Never turn a simulated trajectory into a decision without a model and error boundary.",
  },
};

const blankViewRecord: ViewRecord = {
  choice: null,
  confidence: null,
  revealed: false,
};

const blankRecord: StudioRecord = {
  limit: { ...blankViewRecord },
  local: { ...blankViewRecord },
  area: { ...blankViewRecord },
  chain: { ...blankViewRecord },
  convergence: { ...blankViewRecord },
  trajectory: { ...blankViewRecord },
};

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
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = availableChoices.length - 1;
    if (nextIndex === null) return;

    event.preventDefault();
    onChoice(availableChoices[nextIndex].id);
    const radios =
      event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>(
        '[role="radio"]',
      );
    radios?.[nextIndex]?.focus();
  }

  return (
    <section className={styles.gate} aria-labelledby={view + "-gate-title"}>
      <div className={styles.gateHeading}>
        <span>Prediction gate</span>
        <h3 id={view + "-gate-title"}>
          {views.find((candidate) => candidate.id === view)?.question}
        </h3>
        <p>
          Commit to a model and name your confidence before the explanation
          packet appears. A repaired prediction is durable learning evidence,
          not a deduction.
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
          The explanation remains hidden until your prediction and confidence
          are both visible.
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
        {record.revealed
          ? "Explanation revealed"
          : "Reveal the explanation packet"}
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
            <strong>Why plausible alternatives fail:</strong>{" "}
            {result.whyOthersFail}
          </p>
          <p>
            <strong>Scope boundary:</strong> {result.boundary}
          </p>
          <p className={styles.confidenceReflection}>
            You chose <strong>{confidenceLabel(record.confidence)}</strong>{" "}
            confidence. {correct ? "Try moving the domain, representation, or condition." : "Find the smallest counterexample before revising."}
          </p>
        </div>
      )}
    </section>
  );
}

function ViewFixture({ view }: { view: StudioView }) {
  if (view === "limit") {
    return (
      <>
        <div className={styles.fixtureLead}>
          <div>
            <span>Declared function</span>
            <p className={styles.formula}>
              f(x) = (x² − 1)/(x − 1), x ≠ 1; &nbsp; f(1) = 0
            </p>
          </div>
          <p>
            The algebraic rule is deliberately punctured at the same point
            where a separate value is declared. Name the question before
            simplifying: nearby behavior, point behavior, or continuity?
          </p>
        </div>
        <div className={styles.limitLandscape}>
          <StudioFigure
            spec={removableDiscontinuityFigureSpec}
            label="The algebraic rule approaches 2 at x = 1 while the declared value there is 0"
            describedById="calculus-limit-alternative"
          />
        </div>
        <p className={styles.textEquivalent} id="calculus-limit-alternative">
          <strong>Text equivalent:</strong> the rule simplifies to x + 1 away
          from x = 1, so the graph is a rising line broken at x = 1. The
          two-sided approach heads toward the height 2, while the separately
          declared value f(1) = 0 sits well below it. The picture is a fixture,
          not a proof.
        </p>
      </>
    );
  }

  if (view === "local") {
    return (
      <>
        <div className={styles.fixtureLead}>
          <div>
            <span>Named local fixture</span>
            <p className={styles.formula}>f(x) = x³, a = 2, h = 1/10</p>
          </div>
          <p>
            Compare a finite secant with a tangent claim. Keep the symbolic
            truncation remainder separate from the machine’s subtraction and
            rounding behavior.
          </p>
        </div>
        <table className={styles.dataTable}>
          <caption>Inputs available before a derivative conclusion</caption>
          <thead>
            <tr>
              <th scope="col">quantity</th>
              <th scope="col">expression</th>
              <th scope="col">role</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">forward quotient</th>
              <td>[f(2 + h) − f(2)] / h</td>
              <td>finite observation</td>
            </tr>
            <tr>
              <th scope="row">local polynomial</th>
              <td>f(2 + h) = 8 + 12h + 6h² + h³</td>
              <td>exact fixture identity</td>
            </tr>
            <tr>
              <th scope="row">dtype / method</th>
              <td>not yet declared</td>
              <td>numerical boundary still open</td>
            </tr>
          </tbody>
        </table>
      </>
    );
  }

  if (view === "area") {
    return (
      <>
        <div className={styles.fixtureLead}>
          <div>
            <span>Coordinate map</span>
            <p className={styles.formula}>T(u, v) = (u + v, u − v)</p>
          </div>
          <p>
            A unit square in source coordinates becomes a tilted region. The
            determinant tells a local signed scale; a valid integral argument
            also needs a region and coordinate-map contract.
          </p>
        </div>
        <div className={styles.matrixAndRegion}>
          <table className={styles.dataTable}>
            <caption>Map contract</caption>
            <tbody>
              <tr>
                <th scope="row">source U</th>
                <td>[0, 1] × [0, 1]</td>
              </tr>
              <tr>
                <th scope="row">DT</th>
                <td>[[1, 1], [1, −1]]</td>
              </tr>
              <tr>
                <th scope="row">orientation</th>
                <td>may reverse</td>
              </tr>
            </tbody>
          </table>
          <div className={styles.parallelogram} aria-hidden="true">
            <i /><i /><i /><i />
            <span>image of U</span>
          </div>
        </div>
        <p className={styles.textEquivalent}>
          <strong>Text equivalent:</strong> the visual is a parallelogram made
          from the four images of the unit-square corners. It stands for a
          one-to-one linear fixture only.
        </p>
      </>
    );
  }

  if (view === "chain") {
    return (
      <>
        <div className={styles.fixtureLead}>
          <div>
            <span>Composed map</span>
            <p className={styles.formula}>
              F(x, y) = (x + y, xy); &nbsp; G(u, v) = u² + v
            </p>
          </div>
          <p>
            Evaluate at (x, y) = (1, 2). Use the stated convention: a Jacobian
            has output rows and input columns; gradients are row covectors for
            this trace.
          </p>
        </div>
        <div className={styles.chainBoard}>
          <div>
            <span>source</span>
            <b>(1, 2)</b>
          </div>
          <i aria-hidden="true">F</i>
          <div>
            <span>intermediate</span>
            <b>(u, v)</b>
          </div>
          <i aria-hidden="true">G</i>
          <div>
            <span>scalar</span>
            <b>G(F(x, y))</b>
          </div>
        </div>
        <p className={styles.codeContract}>
          <strong>Code-reading contract:</strong> batch X: (n, 2); local
          Jacobian JF: (n, 2, 2); upstream row gradient: (n, 2). Compatible
          shapes do not establish feature order, units, differentiability, or
          the intended program path.
        </p>
      </>
    );
  }

  if (view === "convergence") {
    return (
      <>
        <div className={styles.fixtureLead}>
          <div>
            <span>Sequence on a declared domain</span>
            <p className={styles.formula}>fₙ(x) = xⁿ, &nbsp; x ∈ [0, 1]</p>
          </div>
          <p>
            Do not begin with a graph. Begin with quantifier order: may the
            stage N depend on x, or must one N work for the whole domain?
          </p>
        </div>
        <div className={styles.quantifierCards}>
          <div>
            <span>Pointwise pattern</span>
            <p>For each x, choose a later stage.</p>
          </div>
          <div>
            <span>Uniform pattern</span>
            <p>Choose one stage before choosing x.</p>
          </div>
          <div>
            <span>Interchange request</span>
            <p>Name the theorem and every hypothesis.</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className={styles.fixtureLead}>
        <div>
          <span>Candidate + trajectory fixture</span>
          <p className={styles.formula}>
            maximize/minimize x + y, &nbsp; x² + y² = 1; &nbsp; y′ = y, y(0) = 1
          </p>
        </div>
        <p>
          The first model asks which directions are allowed by a constraint.
          The second turns a local rule into finite steps. Keep candidate,
          approximation, and decision claims distinct.
        </p>
      </div>
      <div className={styles.trajectoryGrid}>
        <table className={styles.dataTable}>
          <caption>Constrained-extrema trace</caption>
          <tbody>
            <tr>
              <th scope="row">objective f</th>
              <td>x + y</td>
            </tr>
            <tr>
              <th scope="row">constraint g</th>
              <td>x² + y² = 1</td>
            </tr>
            <tr>
              <th scope="row">candidate equation</th>
              <td>∇f = λ∇g</td>
            </tr>
          </tbody>
        </table>
        <table className={styles.dataTable}>
          <caption>Euler comparison at t = 1</caption>
          <tbody>
            <tr>
              <th scope="row">h = 1</th>
              <td>one finite step</td>
            </tr>
            <tr>
              <th scope="row">h = 1/2</th>
              <td>two finite steps</td>
            </tr>
            <tr>
              <th scope="row">reference</th>
              <td>exact e for this named ODE</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

export function CalculusContinuousChangeStudio() {
  const [activeView, setActiveView] = useState<StudioView>("limit");
  const [record, setRecord] = useState<StudioRecord>(blankRecord);
  const [storageReady, setStorageReady] = useState(false);
  const [clearNotice, setClearNotice] = useState("");
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const activeRecord = record[activeView];

  useEffect(() => {
    const hydrationTimer = window.setTimeout(() => {
      try {
        const storage = getBrowserProgressStorage();
        const restored = storage
          ? restoreModule29Progress(storage)
          : null;
        if (restored) setRecord(restored as StudioRecord);
      } catch {
        // Local progress is optional; unavailable storage never blocks study.
      } finally {
        setStorageReady(true);
      }
    }, 0);
    return () => window.clearTimeout(hydrationTimer);
  }, []);

  useEffect(() => {
    if (!storageReady) return;
    const storage = getBrowserProgressStorage();
    if (!storage) return;
    try {
      persistModule29Progress(storage, record);
    } catch {
      // Private-browser policies may block storage; in-memory study still works.
    }
  }, [record, storageReady]);

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
      return {
        ...current,
        [activeView]: { ...candidate, revealed: true },
      };
    });
  }

  function clearSavedPredictionEvidence() {
    const storage = getBrowserProgressStorage();
    const cleared = storage ? clearModule29Progress(storage) : false;
    setRecord(blankRecord);
    setClearNotice(
      cleared
        ? "Saved prediction evidence cleared from this browser."
        : "Browser storage is unavailable; this visit was reset in memory.",
    );
  }

  function selectView(nextIndex: number, focus = false) {
    const normalized = (nextIndex + views.length) % views.length;
    setActiveView(views[normalized].id);
    if (focus) tabRefs.current[normalized]?.focus();
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

  return (
    <section className={styles.studio} aria-labelledby="continuous-change-studio-title">
      <div className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.kicker}>Module 29 interactive reasoning studio</p>
          <h2 id="continuous-change-studio-title">
            Limits, Change &amp; Convergence Studio
          </h2>
          <p>
            Continuous mathematics is not permission to smooth over a gap. Name
            the domain, local model, coordinate convention, approximation, and
            exchange condition before trusting a derivative, integral, solver,
            or AI-generated claim.
          </p>
          <div className={styles.heroFacts}>
            <span><b>6</b> connected lenses</span>
            <span><b>0</b> server records</span>
            <span><b>1</b> condition per claim</span>
          </div>
        </div>
        <div className={styles.flowBeacon} aria-hidden="true">
          <i className={styles.flowOne} />
          <i className={styles.flowTwo} />
          <i className={styles.flowThree} />
          <span>Δ</span>
          <b>→</b>
        </div>
      </div>

      <div className={styles.invariantPlate}>
        <span>M29 working invariant</span>
        <p>
          A continuous-change conclusion is trustworthy only after its domain,
          metric or coordinates, regularity, approximation/error boundary, and
          any operation-exchange hypothesis are explicit.
        </p>
      </div>

      <ol className={styles.reasoningChain} aria-label="M29 reasoning chain">
        <li><strong>1</strong><span>name domain</span></li>
        <li><strong>2</strong><span>state claim</span></li>
        <li><strong>3</strong><span>choose condition</span></li>
        <li><strong>4</strong><span>trace model</span></li>
        <li><strong>5</strong><span>break shortcut</span></li>
        <li><strong>6</strong><span>decide scope</span></li>
      </ol>

      <div className={styles.tabWrap}>
        <div className={styles.tabs} role="tablist" aria-label="Continuous-change views">
          {views.map((view, index) => (
            <button
              aria-controls={view.id + "-panel"}
              aria-selected={activeView === view.id}
              className={activeView === view.id ? styles.tabActive : undefined}
              id={view.id + "-tab"}
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
          aria-labelledby={activeView + "-tab"}
          className={styles.panel}
          id={activeView + "-panel"}
          role="tabpanel"
          tabIndex={0}
        >
          <ViewFixture view={activeView} />
          <PredictionGate
            view={activeView}
            record={activeRecord}
            onChoice={choose}
            onConfidence={setConfidence}
            onReveal={reveal}
          />
        </div>
      </div>

      <div className={styles.footerBand}>
        <div>
          <span>Local finite teaching model</span>
          <p>
            The downloadable model exposes exact epsilon–delta, Taylor,
            gradient/Hessian, Jacobian, coordinate-area, series, finite-
            difference, quadrature, and Euler fixtures. It is not a theorem prover, a general numerical library, model validator, or decision service.
          </p>
        </div>
        <div className={styles.footerLinks}>
          <a href="/downloads/module29_reference.py">Download model</a>
          <a href="/downloads/test_module29_reference.py">Download tests</a>
          <a href="/downloads/module29_calculus_real_analysis_continuous_change_source_map.md">
            Open source map
          </a>
          <a href="/downloads/module29_calculus_real_analysis_source_audit_addendum.md">
            Open source audit
          </a>
          <Link href="#module-reading-article">
            Read the complete Module 29 workbook
          </Link>
          <button
            aria-describedby="module29-clear-progress-description"
            className={styles.revealButton}
            onClick={clearSavedPredictionEvidence}
            type="button"
          >
            Clear saved prediction evidence
          </button>
          <p id="module29-clear-progress-description">
            This clears only saved choices, confidence, and revealed explanations
            from this browser.
          </p>
          <p aria-live="polite" role="status">
            {clearNotice}
          </p>
        </div>
      </div>
    </section>
  );
}
