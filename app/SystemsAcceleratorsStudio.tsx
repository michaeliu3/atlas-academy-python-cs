"use client";

import Link from "next/link";
import { type KeyboardEvent as ReactKeyboardEvent, useRef, useState } from "react";
import { StudioFigure } from "./StudioFigure";
import styles from "./AdvancedStudio.module.css";

/**
 * Session 2's recorded timings. Five repeats of the same call under one build,
 * one machine, one input size — a spread, not a speed.
 */
const timingSpreadFigureSpec = {
  kind: "bars",
  width: 420,
  height: 250,
  yLabel: "ms",
  bars: [
    { label: "r1", value: 41 },
    { label: "r2", value: 38 },
    { label: "r3", value: 57 },
    { label: "r4", value: 39 },
    { label: "r5", value: 40 },
  ],
} as const;

type StudioView =
  | "boundary"
  | "trace"
  | "metadata"
  | "ownership"
  | "autodiff"
  | "defense";

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
    id: "boundary",
    number: "01",
    label: "Responsibility",
    question: "Where does the Python boundary actually sit?",
  },
  {
    id: "trace",
    number: "02",
    label: "Trace before timing",
    question: "Five repeats span 38–57 ms. What is the honest summary?",
  },
  {
    id: "metadata",
    number: "03",
    label: "Array metadata",
    question: "The view is not contiguous. What follows?",
  },
  {
    id: "ownership",
    number: "04",
    label: "Ownership",
    question: "Two workers touch the same buffer. What must be shown first?",
  },
  {
    id: "autodiff",
    number: "05",
    label: "Autodiff contract",
    question: "The gradient check passes at 1e-4. What is established?",
  },
  {
    id: "defense",
    number: "06",
    label: "Bounded claim",
    question: "Which systems claim survives the evidence you actually have?",
  },
];

const choices: Record<StudioView, ReadonlyArray<{ id: string; label: string }>> = {
  boundary: [
    {
      id: "name-the-layer-and-owner",
      label:
        "Name which layer executes the work, which owns the memory, and which is being measured.",
    },
    { id: "python-is-slow", label: "Python is slow, so rewrite the loop in C." },
    { id: "vectorise-everything", label: "Vectorise everything and re-measure." },
  ],
  trace: [
    {
      id: "report-spread-and-conditions",
      label:
        "Report the spread with the build, machine, input size, and repeat count — one summary statistic hides the 57.",
    },
    { id: "report-the-minimum", label: "Report the minimum as the true cost." },
    { id: "report-the-mean", label: "Report the mean; outliers average out." },
  ],
  metadata: [
    {
      id: "layout-changes-the-algorithm",
      label:
        "Strides and contiguity are part of the algorithm: an operation may copy, and the copy is real work.",
    },
    { id: "views-are-free", label: "A view is free because it shares memory." },
    { id: "shape-is-all-that-matters", label: "Only the shape affects the result." },
  ],
  ownership: [
    {
      id: "draw-ownership-before-parallelism",
      label:
        "Draw who owns, who reads, and who writes the buffer before claiming the work parallelises.",
    },
    { id: "gil-makes-it-safe", label: "The GIL makes concurrent access safe." },
    { id: "more-workers-more-throughput", label: "Add workers until throughput stops rising." },
  ],
  autodiff: [
    {
      id: "one-point-one-direction",
      label:
        "Agreement at one point along one direction, at a tolerance the precision permits — nothing about other points.",
    },
    { id: "gradient-is-correct", label: "The gradient implementation is correct." },
    { id: "model-will-train", label: "The model will train." },
  ],
  defense: [
    {
      id: "scoped-to-configuration",
      label:
        "A claim scoped to this build, input, and machine, with the repeat spread attached.",
    },
    { id: "faster-in-general", label: "This approach is faster in general." },
    { id: "optimal-implementation", label: "This is the optimal implementation." },
  ],
};

const correctChoice: Record<StudioView, string> = {
  boundary: "name-the-layer-and-owner",
  trace: "report-spread-and-conditions",
  metadata: "layout-changes-the-algorithm",
  ownership: "draw-ownership-before-parallelism",
  autodiff: "one-point-one-direction",
  defense: "scoped-to-configuration",
};

const feedback: Record<
  StudioView,
  { title: string; answer: string; whyOthersFail: string; boundary: string }
> = {
  boundary: {
    title: "A performance claim needs a named layer",
    answer:
      "Interpreted bytecode, a compiled kernel, and a memory allocator are different layers with different costs. Until you say which one executes the work and which one you measured, a speed statement has no referent.",
    whyOthersFail:
      "“Python is slow” names a language, not a layer, and is false for work that dispatches immediately into a compiled kernel. Vectorising without locating the cost can move work rather than remove it.",
    boundary:
      "Naming the layer does not measure it. It makes the measurement interpretable.",
  },
  trace: {
    title: "Five repeats are a distribution, not a number",
    answer:
      "38, 39, 40, 41, 57 has a median near 40 and one clear outlier. Reporting a single number discards the fact that something occasionally costs 40% more — which is usually the interesting finding.",
    whyOthersFail:
      "The minimum is the luckiest run, not the typical cost. The mean is dragged by the outlier while hiding that it exists.",
    boundary:
      "Five repeats bound this configuration. They say nothing about another machine, build, or input size.",
  },
  metadata: {
    title: "Layout is part of the computation",
    answer:
      "Strides, contiguity, and dtype determine whether an operation reads in place or materialises a copy. A non-contiguous view handed to a kernel that requires contiguity produces a copy the caller never wrote down.",
    whyOthersFail:
      "A view is free to create and not free to use. Shape alone does not determine the traversal cost or whether a copy occurs.",
    boundary:
      "Checking contiguity tells you a copy may happen; measuring tells you whether it did.",
  },
  ownership: {
    title: "Parallelism is an ownership claim before it is a speed claim",
    answer:
      "Two workers sharing a buffer need a stated owner, a stated reader set, and a stated writer set. Without those, a correct-looking result may depend on a scheduling accident that will not repeat.",
    whyOthersFail:
      "The GIL serialises bytecode, not memory access from released-GIL extension code or separate processes. Adding workers until throughput plateaus measures a curve without establishing correctness.",
    boundary:
      "An ownership diagram is a precondition for a parallelism claim, not evidence that the parallel result is right.",
  },
  autodiff: {
    title: "A gradient check is a point comparison",
    answer:
      "Reverse mode and finite differences agreed at one evaluation point, along one direction, within a tolerance that float32 differencing can support. A tolerance of 1e-4 is loose enough to hide a small systematic error.",
    whyOthersFail:
      "Correctness is a claim about all points. Trainability additionally depends on the objective, data, and optimiser, none of which this check touches.",
    boundary:
      "Run the check in float64 along a random direction to tighten it. It remains a point comparison.",
  },
  defense: {
    title: "Scope is the whole claim",
    answer:
      "A defensible systems result names the build, input, machine, repeat count, and observed spread, and claims only what those support. That is a smaller statement than “faster” and a far more useful one.",
    whyOthersFail:
      "“Faster in general” quantifies over configurations you did not run. “Optimal” requires a lower-bound argument, which measurement cannot supply.",
    boundary:
      "A scoped claim transfers only by re-running. That is the cost of it being true.",
  },
};

const emptyRecord: StudioRecord = {
  boundary: { choice: null, confidence: null, revealed: false },
  trace: { choice: null, confidence: null, revealed: false },
  metadata: { choice: null, confidence: null, revealed: false },
  ownership: { choice: null, confidence: null, revealed: false },
  autodiff: { choice: null, confidence: null, revealed: false },
  defense: { choice: null, confidence: null, revealed: false },
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
    <section className={styles.predictionGate} aria-labelledby={`m32-${view}-gate-title`}>
      <div className={styles.gateHeading}>
        <span>Prediction gate</span>
        <h3 id={`m32-${view}-gate-title`}>
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
              ? "Now change one configuration variable and say what the claim loses."
              : "Find the smallest changed assumption that repairs the claim."}
          </p>
        </div>
      )}
    </section>
  );
}

function Fixture({ view }: { view: StudioView }) {
  if (view === "boundary") {
    return (
      <>
        <div className={styles.fixtureLead}>
          <div>
            <span>Layer map</span>
            <h3>Three layers, one reported number.</h3>
            <p className={styles.formula}>total = interpreter + kernel + allocation</p>
          </div>
          <p>
            The same call spends time dispatching in the interpreter, executing a
            compiled kernel, and allocating a result buffer. A single timing
            number sums all three and attributes them to none.
          </p>
        </div>
        <table className={styles.dataTable}>
          <caption>Where the work lives in the declared fixture</caption>
          <thead>
            <tr>
              <th scope="col">Layer</th>
              <th scope="col">Owns</th>
              <th scope="col">Visible to a timer?</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>interpreter dispatch</td><td>bytecode execution</td><td>only in aggregate</td></tr>
            <tr><td>compiled kernel</td><td>the arithmetic</td><td>only in aggregate</td></tr>
            <tr><td>allocator</td><td>the result buffer</td><td>often invisible</td></tr>
          </tbody>
        </table>
        <p className={styles.textEquivalent}>
          <strong>Text equivalent:</strong> three layers each own part of the
          cost, and a wall-clock timer around the call reports their sum. Naming
          the layer under study is what makes a later comparison meaningful.
        </p>
      </>
    );
  }

  if (view === "trace") {
    return (
      <>
        <div className={styles.fixtureLead}>
          <div>
            <span>Recorded repeats</span>
            <h3>Same call, five times.</h3>
            <p className={styles.formula}>41, 38, 57, 39, 40 ms</p>
          </div>
          <p>
            One repeat costs 40% more than its neighbours. That outlier is the
            most informative value in the set, and it is exactly what a single
            summary statistic removes.
          </p>
        </div>
        <StudioFigure
          spec={timingSpreadFigureSpec}
          label="Five recorded timings with one clear outlier at 57 milliseconds"
          describedById="m32-trace-alternative"
        />
        <p className={styles.textEquivalent} id="m32-trace-alternative">
          <strong>Text equivalent:</strong> four repeats cluster between 38 and
          41 milliseconds; the third reaches 57. The median is about 40 and the
          range is 19, so the spread is roughly half the typical value.
        </p>
      </>
    );
  }

  if (view === "metadata") {
    return (
      <>
        <div className={styles.fixtureLead}>
          <div>
            <span>Array fixture</span>
            <h3>A slice that is not contiguous.</h3>
            <p className={styles.formula}>b = a[:, ::2] — shape (1000, 500), strides unchanged</p>
          </div>
          <p>
            The slice shares memory and costs nothing to create. Handing it to an
            operation that requires contiguous input materialises a copy of half
            a million elements — work that appears in no line of the caller.
          </p>
        </div>
        <table className={styles.dataTable}>
          <caption>Metadata that changes the work, not just the description</caption>
          <tbody>
            <tr><th scope="row">shape</th><td>what the result looks like</td></tr>
            <tr><th scope="row">strides</th><td>how far apart consecutive elements sit</td></tr>
            <tr><th scope="row">contiguity</th><td>whether a kernel can read in place</td></tr>
            <tr><th scope="row">dtype</th><td>element width, and whether a cast copies</td></tr>
          </tbody>
        </table>
        <p className={styles.codeContract}>
          <strong>Code-reading contract:</strong> before timing an array
          operation, record shape, strides, contiguity, and dtype. A timing
          difference between two runs is uninterpretable if any of the four
          changed.
        </p>
      </>
    );
  }

  if (view === "ownership") {
    return (
      <>
        <div className={styles.fixtureLead}>
          <div>
            <span>Shared buffer</span>
            <h3>Two workers, one array.</h3>
            <p className={styles.formula}>worker A writes rows 0–499; worker B reads all rows</p>
          </div>
          <p>
            The read and the write overlap in time and in memory. Whether the
            result is correct depends on ordering the code never states, so a run
            that produces the right answer may simply have been lucky.
          </p>
        </div>
        <table className={styles.dataTable}>
          <caption>Ownership questions that precede any speedup claim</caption>
          <tbody>
            <tr><th scope="row">Owner</th><td>which worker may free or resize the buffer</td></tr>
            <tr><th scope="row">Readers</th><td>who may read, and during which phase</td></tr>
            <tr><th scope="row">Writers</th><td>who may write, and under what exclusion</td></tr>
            <tr><th scope="row">Barrier</th><td>what guarantees the write precedes the read</td></tr>
          </tbody>
        </table>
        <p className={styles.textEquivalent}>
          <strong>Text equivalent:</strong> the table lists four questions — owner,
          readers, writers, barrier. A parallel implementation that cannot answer
          all four has an unstated ordering assumption.
        </p>
      </>
    );
  }

  if (view === "autodiff") {
    return (
      <>
        <div className={styles.fixtureLead}>
          <div>
            <span>Gradient check</span>
            <h3>Agreement to one part in ten thousand.</h3>
            <p className={styles.formula}>|reverse − central| / |reverse| ≈ 1 × 10⁻⁴, float32</p>
          </div>
          <p>
            In float32 the central difference cannot do much better: truncation
            falls as h² while cancellation grows as ε/h, and the best achievable
            agreement is around 1e-4. Passing at that tolerance is the floor, not
            a strong result.
          </p>
        </div>
        <table className={styles.dataTable}>
          <caption>What the tolerance can and cannot detect</caption>
          <thead>
            <tr><th scope="col">Defect</th><th scope="col">Detected at 1e-4?</th></tr>
          </thead>
          <tbody>
            <tr><td>sign error on a large component</td><td>yes</td></tr>
            <tr><td>missing term of relative size 1e-3</td><td>usually</td></tr>
            <tr><td>missing term of relative size 1e-5</td><td>no</td></tr>
            <tr><td>error at a different evaluation point</td><td>no</td></tr>
          </tbody>
        </table>
        <p className={styles.codeContract}>
          <strong>Code-reading contract:</strong> record dtype, step size,
          direction, and the tolerance chosen before the run. A tolerance picked
          after seeing the disagreement is not a test.
        </p>
      </>
    );
  }

  return (
    <>
      <div className={styles.fixtureLead}>
        <div>
          <span>Claim card</span>
          <h3>Write the smallest true sentence.</h3>
          <p className={styles.formula}>claim ⊆ evidence, always</p>
        </div>
        <p>
          The dossier holds five repeats on one machine, one build, one input
          size, with array metadata recorded and a gradient check at 1e-4. The
          defensible claim is the largest statement those five facts support —
          and no larger.
        </p>
      </div>
      <table className={styles.dataTable}>
        <caption>Evidence held versus claims attempted</caption>
        <thead>
          <tr><th scope="col">Claim</th><th scope="col">Supported?</th></tr>
        </thead>
        <tbody>
          <tr><td>faster on this build, input, and machine</td><td>yes, with the spread attached</td></tr>
          <tr><td>faster in general</td><td>no — quantifies over unrun configurations</td></tr>
          <tr><td>optimal</td><td>no — needs a lower bound, not a measurement</td></tr>
          <tr><td>gradient implementation correct</td><td>no — one point, one direction</td></tr>
        </tbody>
      </table>
      <p className={styles.textEquivalent}>
        <strong>Text equivalent:</strong> of four candidate claims, only the one
        scoped to the measured configuration is supported. The other three each
        extend beyond the evidence in a different direction.
      </p>
    </>
  );
}

export function SystemsAcceleratorsStudio() {
  const [activeView, setActiveView] = useState<StudioView>("boundary");
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
    <section className={styles.studio} aria-labelledby="systems-accelerators-studio-title">
      <div className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.kicker}>Module 32 interactive reasoning studio</p>
          <h2 id="systems-accelerators-studio-title">
            Systems &amp; Accelerators Studio
          </h2>
          <p>
            A performance number is produced by a build, a machine, an input, and
            a layer. Six fixed synthetic fixtures separate the measurement from
            the configuration that produced it.
          </p>
          <div className={styles.heroFacts}>
            <span>
              <b>6</b> connected lenses
            </span>
            <span>
              <b>0</b> server records
            </span>
            <span>
              <b>1</b> claim card
            </span>
          </div>
        </div>
      </div>

      <div className={styles.invariantPlate}>
        <span>M32 working invariant</span>
        <p>
          Name the layer before timing it, the metadata before comparing arrays,
          and the ownership before claiming parallelism. A timing is evidence
          about one configuration.
        </p>
      </div>

      <ol className={styles.reasoningChain} aria-label="Systems reasoning chain">
        {["layer", "trace", "metadata", "ownership", "numerics", "claim"].map(
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
          aria-label="Systems and accelerator investigations"
        >
          {views.map((view, index) => (
            <button
              aria-controls={`m32-${view.id}-panel`}
              aria-selected={activeView === view.id}
              className={activeView === view.id ? styles.tabActive : undefined}
              id={`m32-${view.id}-tab`}
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
          aria-labelledby={`m32-${activeView}-tab`}
          className={styles.panel}
          id={`m32-${activeView}-panel`}
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
              claim. The workbook remains the authority for every measurement
              convention shown here.
            </p>
            {clearNotice ? <p role="status">{clearNotice}</p> : null}
          </div>
          <div className={styles.footerLinks}>
            <button onClick={clearPredictionEvidence} type="button">
              Reset predictions
            </button>
            <Link href="/modules/32-systems-languages-scientific-python-accelerators">
              Open the workbook
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
