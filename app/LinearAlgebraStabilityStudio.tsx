"use client";

import Link from "next/link";
import {
  type KeyboardEvent as ReactKeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "./LinearAlgebraStabilityStudio.module.css";

type StudioView =
  | "space"
  | "map"
  | "projection"
  | "spectrum"
  | "stability"
  | "pca";

type Confidence = 1 | 2 | 3 | 4;

type ViewRecord = {
  choice: string | null;
  confidence: Confidence | null;
  revealed: boolean;
};

type StudioRecord = Record<StudioView, ViewRecord>;

const STORAGE_KEY = "atlas.module28.linear-algebra-stability-studio.v1";

const views: ReadonlyArray<{
  id: StudioView;
  number: string;
  label: string;
  question: string;
}> = [
  {
    id: "space",
    number: "01",
    label: "Space & basis",
    question: "Which diagnosis is correct under this declared vector-space model?",
  },
  {
    id: "map",
    number: "02",
    label: "Map & rank",
    question: "Which lost/surviving-direction account is justified?",
  },
  {
    id: "projection",
    number: "03",
    label: "Projection",
    question: "At the least-squares optimum, which residual relationship must hold?",
  },
  {
    id: "spectrum",
    number: "04",
    label: "Spectrum & PSD",
    question: "Which spectral and PSD account is supported?",
  },
  {
    id: "stability",
    number: "05",
    label: "Condition & error",
    question: "What does this small RHS change test?",
  },
  {
    id: "pca",
    number: "06",
    label: "PCA defense",
    question: "Which claim is justified by this centered Euclidean fixture?",
  },
];

const choices: Record<StudioView, ReadonlyArray<{ id: string; label: string }>> = {
  space: [
    {
      id: "not-subspace",
      label: "L is not a subspace because zero is absent; B spans the x-axis but is dependent, so it is not a basis.",
    },
    {
      id: "subspace-line",
      label: "L is a subspace because it is a line; B is a basis because it has two nonzero vectors.",
    },
    {
      id: "basis-only",
      label: "L fails only because it is one-dimensional; any two nonzero vectors are a basis.",
    },
  ],
  map: [
    {
      id: "kernel",
      label: "rank is 1; (−2, 1, 0) is lost; outputs are span{(1, 2)}.",
    },
    {
      id: "first-column",
      label: "rank is 2 because A has two rows, so the kernel is only zero.",
    },
    {
      id: "all-inputs",
      label: "rank is 1, but (1, 0) from RREF is an original column-space basis vector.",
    },
  ],
  projection: [
    {
      id: "columns",
      label: "r = b − A x̂ is orthogonal to each A column; here x̂ = 1/2 and (1, 1)ᵀr = 0.",
    },
    {
      id: "response",
      label: "The residual must be zero because normal equations exist.",
    },
    {
      id: "coefficients",
      label: "The residual is parallel to the column space.",
    },
  ],
  spectrum: [
    {
      id: "orthogonal-eigenbasis",
      label: "S sends q₊ to 3q₊ and q₋ to q₋; its positive eigenvalues make this fixture positive definite (hence PSD).",
    },
    {
      id: "all-square",
      label: "q₋ gets eigenvalue 3 and q₊ gets eigenvalue 1.",
    },
    {
      id: "invertible-only",
      label: "Equal diagonal entries make every direction an eigenvector.",
    },
  ],
  stability: [
    {
      id: "sensitivity",
      label: "A small RHS change can produce a large exact-solution change: the problem is ill-conditioned; a backward-stable algorithm can still have large forward error.",
    },
    {
      id: "residual-proof",
      label: "A changing solution proves the algorithm is unstable.",
    },
    {
      id: "condition-algorithm",
      label: "The matrix is singular, so the examples have no unique solutions.",
    },
  ],
  pca: [
    {
      id: "named-loss",
      label: "The ±(1, 1)/√2 direction maximizes projected variance and minimizes rank-1 Frobenius reconstruction error; its sign is arbitrary.",
    },
    {
      id: "importance",
      label: "Its positive sign establishes which named feature is important.",
    },
    {
      id: "causality",
      label: "Centering and scale cannot change PCA’s retained direction.",
    },
  ],
};

const correctChoice: Record<StudioView, string> = {
  space: "not-subspace",
  map: "kernel",
  projection: "columns",
  spectrum: "orthogonal-eigenbasis",
  stability: "sensitivity",
  pca: "named-loss",
};

const feedback: Record<
  StudioView,
  { title: string; answer: string; whyOthersFail: string; boundary: string }
> = {
  space: {
    title: "A flat-looking set still needs closure and a zero vector.",
    answer:
      "L = {(x, y) : x + y = 1} misses (0, 0), so it is an affine line rather than a subspace. B = ((1, 0), (2, 0)) is dependent because (2, 0) = 2(1, 0); it spans only the x-axis, not R².",
    whyOthersFail:
      "Straightness and nonzero entries are visual clues, not definitions. Dimension does not make arbitrary nonzero vectors independent or spanning.",
    boundary:
      "This is an exact R² counterexample under ordinary operations. An affine line has a displacement vector space, but it is not a linear subspace under the declared origin.",
  },
  map: {
    title: "Rank records surviving directions; the kernel records lost ones.",
    answer:
      "A(x₁, x₂, x₃) = (x₁ + 2x₂ + 3x₃)(1, 2). Its rank is 1, (−2, 1, 0) is a null-space witness, and its image is span{(1, 2)}. Rank-nullity gives 1 + 2 = 3.",
    whyOthersFail:
      "Two rows need not be independent. Pivot indices come from RREF, but a column-space basis uses the matching original columns: the RREF vector (1, 0) is not an original column-space basis vector.",
    boundary:
      "This is one exact map. A numerical rank routine adds a tolerance and may classify nearly lost directions differently; inspect its input scale and threshold.",
  },
  projection: {
    title: "Residual orthogonality is the certificate.",
    answer:
      "For A = (1, 1)ᵀ and b = (1, 0)ᵀ, x̂ = 1/2 and r = (1/2, −1/2)ᵀ. Thus (1, 1)ᵀr = 0. In general, Aᵀ(b − A x̂) = 0 is the residual certificate.",
    whyOthersFail:
      "The residual is generally not zero and need not be orthogonal to b. A normal equation does not make an arbitrary response exactly attainable.",
    boundary:
      "The result assumes the stated Euclidean squared-error objective. An idempotent matrix need not be an orthogonal projection, and rank-deficient designs do not make (AᵀA)⁻¹ available.",
  },
  spectrum: {
    title: "Symmetry earns an orthogonal spectral story.",
    answer:
      "For S = [[2, 1], [1, 2]], q₊ = (1, 1)/√2 has eigenvalue 3 and q₋ = (1, −1)/√2 has eigenvalue 1. Real symmetry gives an orthonormal eigenbasis; positive eigenvalues make this exact fixture positive definite and therefore PSD.",
    whyOthersFail:
      "General square matrices can fail to diagonalize. Equal diagonal entries or positive diagonal entries alone do not control every direction of a quadratic form.",
    boundary:
      "The Jordan block [[1, 1], [0, 1]] has repeated eigenvalue 1 but only one independent eigendirection. A floating array that is only approximately symmetric needs a declared tolerance, not an exact-theorem label.",
  },
  stability: {
    title: "A small residual can coexist with fragile coefficients.",
    answer:
      "For Aε = [[1, 1], [1, 1001/1000]], b₀ = (2, 2001/1000)ᵀ has x₀ = (1, 1)ᵀ while b₁ = (2, 2002/1000)ᵀ has x₁ = (0, 2)ᵀ. The exact problem is highly sensitive; that is not, by itself, a diagnosis of an algorithm.",
    whyOthersFail:
      "A changing solution need not prove an unstable algorithm. The matrix is nonsingular, so both fixtures have a unique exact solution. A condition number describes the posed problem, not an automatic blame assignment.",
    boundary:
      "This is a finite exact fixture. For full-column-rank A, κ₂(AᵀA) = κ₂(A)², so normal equations can worsen conditioning. Report dtype, norm, solver, tolerance, and perturbation in any real workflow.",
  },
  pca: {
    title: "PCA optimizes a geometry, not a human meaning.",
    answer:
      "For X = ((0, 0), (1, 1), (2, 2)) with mean (1, 1), the covariance under the stated 1/n convention has top direction ±(1, 1)/√2, eigenvalue 4/3, retained-variance ratio 1, and rank-1 reconstruction SSE 0. The variance and truncated-SVD routes agree under this model.",
    whyOthersFail:
      "The sign of an eigenvector is arbitrary. Variance is not causal importance, fairness, relevance, safety, or classifier performance; those require an explicit outcome and evaluation model.",
    boundary:
      "Centering, feature scale, missing-data policy, tied directions, and the selected loss can change the result. With tied top directions, rank-1 PCA is not unique; a low-variance signal may still have high consequence.",
  },
};

const blankViewRecord: ViewRecord = {
  choice: null,
  confidence: null,
  revealed: false,
};

const blankRecord: StudioRecord = {
  space: { ...blankViewRecord },
  map: { ...blankViewRecord },
  projection: { ...blankViewRecord },
  spectrum: { ...blankViewRecord },
  stability: { ...blankViewRecord },
  pca: { ...blankViewRecord },
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
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = availableChoices.length - 1;
    if (nextIndex === null) return;

    event.preventDefault();
    onChoice(availableChoices[nextIndex].id);
    const radios = event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>(
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
          Make a choice and record confidence before revealing the explanation.
          Revising a model is evidence of learning, not a penalty.
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
          The explanation packet remains hidden until you have made a
          prediction and named confidence.
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
        {record.revealed ? "Explanation revealed" : "Reveal the explanation packet"}
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
            confidence. {correct ? "Transfer the boundary to a new representation." : "Find the smallest counterexample before revising."}
          </p>
        </div>
      )}
    </section>
  );
}

export function LinearAlgebraStabilityStudio() {
  const [activeView, setActiveView] = useState<StudioView>("space");
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
          if (isStudioRecord(parsed)) setRecord(parsed);
        }
      } catch {
        // Local progress is optional. Only choice, confidence, and reveal state
        // are stored; unavailable storage never blocks the lesson.
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
      // Private-browser policies may block storage; the in-memory lesson still works.
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
      return {
        ...current,
        [activeView]: { ...candidate, revealed: true },
      };
    });
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

  const gateProps = {
    record: activeRecord,
    onChoice: choose,
    onConfidence: setConfidence,
    onReveal: reveal,
  };

  return (
    <section className={styles.studio} aria-labelledby="linear-stability-studio-title">
      <div className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.kicker}>Module 28 interactive representation studio</p>
          <h2 id="linear-stability-studio-title">
            Linear Algebra &amp; Stability Studio
          </h2>
          <p>
            A coordinate system is a model. A matrix is a map in that model. A
            numerical answer is evidence only after its norm, tolerance, dtype,
            and condition boundary are visible.
          </p>
          <div className={styles.heroFacts}>
            <span>
              <b>6</b> reasoning lenses
            </span>
            <span>
              <b>0</b> live learner records
            </span>
            <span>
              <b>1</b> named error boundary
            </span>
          </div>
        </div>
        <div className={styles.matrixBeacon} aria-hidden="true">
          <div className={styles.beaconFrame}>
            <i /><i /><i />
            <i /><i /><i />
            <i /><i /><i />
          </div>
          <span className={styles.beaconVectorOne}>v₁</span>
          <span className={styles.beaconVectorTwo}>v₂</span>
          <strong>A</strong>
        </div>
      </div>

      <div className={styles.invariantPlate}>
        <span>M28 working invariant</span>
        <p>
          Name the spaces, coordinates, metric, assumptions, algorithm, and
          error boundary before accepting a matrix conclusion.
        </p>
      </div>

      <p className={styles.coordinateContract}>
        <strong>Coordinate contract:</strong> X: (n, d), rows = observations;
        W: (d, p); XW: (n, p). Shape compatibility is not semantic meaning.
      </p>

      <ol className={styles.reasoningChain} aria-label="M28 reasoning chain">
        <li><strong>1</strong><span>objects</span></li>
        <li><strong>2</strong><span>coordinates</span></li>
        <li><strong>3</strong><span>geometry</span></li>
        <li><strong>4</strong><span>derive</span></li>
        <li><strong>5</strong><span>error boundary</span></li>
        <li><strong>6</strong><span>transfer</span></li>
      </ol>

      <div className={styles.tabWrap}>
        <div
          aria-label="Linear algebra and numerical stability studio views"
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
          {activeView === "space" && (
            <div className={styles.viewGrid}>
              <section className={styles.storyCard}>
                <span>Space and basis lab</span>
                <h3>Flat is a shape—not yet a subspace claim.</h3>
                <p>
                  Work over R² with ordinary addition and scalar multiplication.
                  Inspect the candidate set L = {"{"}(x, y) : x + y = 1{"}"} and the
                  candidate list B = ((1, 0), (2, 0)) before trusting either
                  its picture or its nonzero entries.
                </p>
                <div className={styles.spaceBoard}>
                  <div className={styles.coordinateBoard} aria-hidden="true">
                    <i className={styles.axisX} /><i className={styles.axisY} />
                    <b className={styles.affineLine} />
                    <em className={styles.originDot} />
                    <span className={styles.linePointOne}>0, 1</span>
                    <span className={styles.linePointTwo}>1, 0</span>
                  </div>
                  <div className={styles.definitionStack}>
                    <strong>declared model</strong>
                    <code>R²; ordinary operations</code>
                    <span>L = {"{"}(x, y) : x + y = 1{"}"}</span>
                    <span>B = ((1, 0), (2, 0))</span>
                    <span>zero vector: (0, 0)</span>
                  </div>
                </div>
                <p className={styles.boundary}>
                  Text equivalent: the board contains the candidate line, the
                  origin, and two sample points. Test whether zero belongs to L,
                  then whether B spans R² without a nontrivial relation.
                </p>
              </section>
              <PredictionGate view="space" {...gateProps} />
            </div>
          )}

          {activeView === "map" && (
            <div className={styles.viewGrid}>
              <section className={styles.storyCard}>
                <span>Map and rank lab</span>
                <h3>Some directions survive; some disappear.</h3>
                <p>
                  The fixture is a declared map A: R³ → R² with the standard
                  column-vector convention. Read columns as images of input
                  basis directions; predict the image and a lost direction.
                </p>
                <div className={styles.mapBoard}>
                  <table>
                    <caption>A: R³ → R²</caption>
                    <tbody>
                      <tr><td>1</td><td>2</td><td>3</td></tr>
                      <tr><td>2</td><td>4</td><td>6</td></tr>
                    </tbody>
                  </table>
                  <div className={styles.mapArrow} aria-hidden="true">→</div>
                  <div className={styles.spacePairs}>
                    <span>input R³</span>
                    <strong>output R²</strong>
                    <small>columns as input-basis images</small>
                  </div>
                </div>
                <div className={styles.kernelStrip}>
                  <strong>trace prompt</strong>
                  <span>What input relation leaves output unchanged?</span>
                  <i aria-hidden="true">→</i>
                  <b>name image and kernel</b>
                </div>
                <p className={styles.boundary}>
                  Text equivalent: the second row is a multiple of the first,
                  but do not replace an original column-space basis with a
                  row-reduced column. Explain why after the reveal.
                </p>
              </section>
              <PredictionGate view="map" {...gateProps} />
            </div>
          )}

          {activeView === "projection" && (
            <div className={styles.viewGrid}>
              <section className={styles.storyCard}>
                <span>Projection and residual lab</span>
                <h3>Closest fit leaves a perpendicular remainder.</h3>
                <p>
                  Under the ordinary Euclidean inner product, fit b = (1, 0)ᵀ
                  with the one-column design A = (1, 1)ᵀ by minimizing
                  ||Ax − b||². Predict the certificate before calculating.
                </p>
                <div className={styles.projectionBoard}>
                  <article>
                    <strong>design A</strong>
                    <span>1</span><span>1</span>
                  </article>
                  <article className={styles.fitColumn}>
                    <strong>response b</strong>
                    <span>1</span><span>0</span>
                  </article>
                  <article className={styles.residualColumn}>
                    <strong>objective</strong>
                    <span>minimize</span><span>||Ax − b||²</span>
                  </article>
                </div>
                <div className={styles.orthogonalStrip}>
                  <strong>target question</strong>
                  <span>Which residual relationship certifies the minimum?</span>
                  <b>name the metric</b>
                </div>
                <p className={styles.boundary}>
                  Text equivalent: A and b are both two-entry vectors, while x
                  is a scalar. The word “closest” depends on the declared
                  inner product and loss.
                </p>
              </section>
              <PredictionGate view="projection" {...gateProps} />
            </div>
          )}

          {activeView === "spectrum" && (
            <div className={styles.viewGrid}>
              <section className={styles.storyCard}>
                <span>Spectrum and PSD lab</span>
                <h3>Symmetry makes directions mutually legible.</h3>
                <p>
                  Inspect the real symmetric fixture and two candidate unit
                  directions. Multiply first; only then decide what symmetry
                  permits you to conclude about eigendirections and the form.
                </p>
                <div className={styles.spectrumBoard}>
                  <table>
                    <caption>S = Sᵀ</caption>
                    <tbody>
                      <tr><td>2</td><td>1</td></tr>
                      <tr><td>1</td><td>2</td></tr>
                    </tbody>
                  </table>
                  <div className={styles.eigenRays} aria-hidden="true">
                    <i className={styles.rayOne} /><i className={styles.rayTwo} />
                    <b>0</b>
                    <span>q₊</span><span>q₋</span>
                  </div>
                  <dl>
                    <div><dt>q₊</dt><dd>(1, 1) / √2</dd></div>
                    <div><dt>q₋</dt><dd>(1, −1) / √2</dd></div>
                    <div><dt>task</dt><dd>compute Sq₊, Sq₋</dd></div>
                  </dl>
                </div>
                <p className={styles.boundary}>
                  Text equivalent: the candidate diagonal directions are
                  perpendicular. Check their images and eigenvalue signs; do
                  not infer the spectral theorem for a nonsymmetric matrix.
                </p>
              </section>
              <PredictionGate view="spectrum" {...gateProps} />
            </div>
          )}

          {activeView === "stability" && (
            <div className={styles.viewGrid}>
              <section className={styles.storyCard}>
                <span>Conditioning and error lab</span>
                <h3>Fit quality and coefficient reliability can diverge.</h3>
                <p>
                  Keep exact arithmetic for this two-by-two fixture. Only the
                  second entry of the right-hand side changes by 1/1000; decide
                  whether that fact diagnoses the posed problem or an algorithm.
                </p>
                <div className={styles.stabilityBoard}>
                  <div className={styles.conditionColumn}>
                    <strong>declared Aε</strong>
                    <span>Aε = [[1, 1], [1, 1001/1000]]</span>
                  </div>
                  <div className={styles.barColumn}>
                    <strong>RHS pair</strong>
                    <span>b₀ = (2, 2001/1000)ᵀ</span>
                    <span>b₁ = (2, 2002/1000)ᵀ</span>
                  </div>
                  <div className={styles.solverColumn}>
                    <strong>classify before solve</strong>
                    <span>problem sensitivity?</span><span>algorithm stability?</span>
                  </div>
                </div>
                <div className={styles.errorFork}>
                  <span>conditioning: posed problem sensitivity</span>
                  <i aria-hidden="true">≠</i>
                  <span>stability: finite-algorithm behavior</span>
                </div>
                <p className={styles.boundary}>
                  Text equivalent: both rows of Aε are close but not identical.
                  Solve both exact systems, then name what evidence would be
                  needed to judge a floating-point implementation.
                </p>
              </section>
              <PredictionGate view="stability" {...gateProps} />
            </div>
          )}

          {activeView === "pca" && (
            <div className={styles.viewGrid}>
              <section className={styles.storyCard}>
                <span>PCA defense board</span>
                <h3>One subspace, two derivations, many boundaries.</h3>
                <p>
                  Rows are observations: X = ((0, 0), (1, 1), (2, 2)). Use the
                  stated mean (1, 1), ordinary Euclidean scaling, and rank 1.
                  Ask what PCA optimizes before asking what it “means.”
                </p>
                <div className={styles.pcaBoard}>
                  <article>
                    <strong>variance route</strong>
                    <span>center X</span>
                    <b>maximize vᵀXᵀXv / n</b>
                    <small>subject to ‖v‖ = 1</small>
                  </article>
                  <i aria-hidden="true">=</i>
                  <article>
                    <strong>reconstruction route</strong>
                    <span>X = UΣVᵀ</span>
                    <b>minimize ‖X − X₁‖F</b>
                    <small>rank(X₁) ≤ 1</small>
                  </article>
                </div>
                <div className={styles.pcaBoundaryCards}>
                  <span>center first</span>
                  <span>name scale</span>
                  <span>inspect residual</span>
                  <span>do not call variance “importance”</span>
                </div>
                <p className={styles.boundary}>
                  Text equivalent: the variance and reconstruction routes use
                  the declared centered/scaled matrix and loss. Derive their
                  shared direction before interpreting a component as important.
                </p>
              </section>
              <PredictionGate view="pca" {...gateProps} />
            </div>
          )}
        </div>
      </div>

      <div className={styles.footerBand}>
        <div>
          <span>Local finite teaching model</span>
          <p>
            The downloadable model exposes exact small-matrix rank/null-space
            evidence, projection residuals, symmetric/PSD and 2×2 eigen
            fixtures, PCA on tiny data, and deliberately bounded conditioning
            demonstrations. It is not a theorem prover, a general numerical
            library, or a production representation service.
          </p>
        </div>
        <div className={styles.footerLinks}>
          <a href="/downloads/module28_reference.py">Download model</a>
          <a href="/downloads/test_module28_reference.py">Download tests</a>
          <Link href="#module-reading-article">
            Read the complete Module 28 workbook
          </Link>
        </div>
      </div>
    </section>
  );
}
