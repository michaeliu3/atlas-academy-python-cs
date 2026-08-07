"use client";

import Link from "next/link";
import { type KeyboardEvent as ReactKeyboardEvent, useRef, useState } from "react";
import { StudioFigure } from "./StudioFigure";
import styles from "./AdvancedStudio.module.css";

/**
 * Session 2's search fixture. The greedy route reaches the goal first; the
 * cheaper route needs one more expansion — which is the point of the view.
 */
const searchCostFigureSpec = {
  kind: "vector2d",
  width: 420,
  height: 280,
  xRange: [-0.4, 2.4],
  yRange: [-0.4, 2.4],
  segments: [
    { from: [0, 1], to: [1, 2], label: "4" },
    { from: [1, 2], to: [2, 1], label: "4" },
    { from: [0, 1], to: [1, 0], label: "1" },
    { from: [1, 0], to: [2, 1], label: "2" },
  ],
  points: [
    { at: [0, 1], label: "start" },
    { at: [1, 2], label: "greedy pick" },
    { at: [1, 0], label: "cheaper" },
    { at: [2, 1], label: "goal" },
  ],
} as const;

type StudioView =
  | "model"
  | "search"
  | "constraints"
  | "planning"
  | "decision"
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
    id: "model",
    number: "01",
    label: "State model",
    question: "What does choosing a state representation commit you to?",
  },
  {
    id: "search",
    number: "02",
    label: "Informed search",
    question: "The heuristic found a path. Is it the cheapest?",
  },
  {
    id: "constraints",
    number: "03",
    label: "Constraints",
    question: "Propagation emptied a domain. What has been shown?",
  },
  {
    id: "planning",
    number: "04",
    label: "Planning",
    question: "The planner returned no plan. What follows?",
  },
  {
    id: "decision",
    number: "05",
    label: "Decisions under uncertainty",
    question: "The policy maximises expected utility. Is it the right action?",
  },
  {
    id: "defense",
    number: "06",
    label: "Bounded claim",
    question: "Which claim does a solved instance support?",
  },
];

const choices: Record<StudioView, ReadonlyArray<{ id: string; label: string }>> = {
  model: [
    {
      id: "state-fixes-what-is-comparable",
      label:
        "It fixes what counts as the same situation, and therefore which paths the search can ever merge or prune.",
    },
    { id: "representation-is-cosmetic", label: "Nothing — representation is an implementation detail." },
    { id: "bigger-state-is-safer", label: "A larger state is always safer." },
  ],
  search: [
    {
      id: "only-if-admissible-and-variant-named",
      label:
        "Only if the heuristic is admissible and the exact A* variant and reopen policy are named.",
    },
    { id: "a-star-is-optimal", label: "Yes — A* is optimal." },
    { id: "goal-first-means-cheapest", label: "Yes — it reached the goal first." },
  ],
  constraints: [
    {
      id: "no-solution-under-this-model",
      label:
        "No assignment satisfies the declared constraints — under this encoding of the problem.",
    },
    { id: "problem-is-impossible", label: "The real-world problem is impossible." },
    { id: "propagation-was-too-strong", label: "Propagation was too aggressive; weaken it." },
  ],
  planning: [
    {
      id: "no-plan-within-the-declared-model",
      label:
        "No plan exists within the declared actions, preconditions, effects, and horizon.",
    },
    { id: "goal-unreachable-in-reality", label: "The goal is unreachable in reality." },
    { id: "planner-is-broken", label: "The planner has a bug." },
  ],
  decision: [
    {
      id: "optimal-for-the-declared-utility",
      label:
        "It is optimal for the declared utility and probabilities — both of which someone chose.",
    },
    { id: "expected-utility-is-correct", label: "Yes — expected utility is the correct criterion." },
    { id: "highest-probability-outcome", label: "Yes — it picks the most likely good outcome." },
  ],
  defense: [
    {
      id: "one-instance-under-one-encoding",
      label:
        "That this instance, under this encoding and search configuration, was solved.",
    },
    { id: "method-scales", label: "The method scales to larger instances." },
    { id: "approach-is-best", label: "This approach is the best available." },
  ],
};

const correctChoice: Record<StudioView, string> = {
  model: "state-fixes-what-is-comparable",
  search: "only-if-admissible-and-variant-named",
  constraints: "no-solution-under-this-model",
  planning: "no-plan-within-the-declared-model",
  decision: "optimal-for-the-declared-utility",
  defense: "one-instance-under-one-encoding",
};

const feedback: Record<
  StudioView,
  { title: string; answer: string; whyOthersFail: string; boundary: string }
> = {
  model: {
    title: "The state defines identity, and identity defines pruning",
    answer:
      "Two situations the state cannot distinguish are the same node. That determines which paths merge, which get pruned as visited, and therefore which solutions remain reachable. Choosing the representation is choosing the search space.",
    whyOthersFail:
      "Treating it as cosmetic hides that a coarse state can prune the only correct path. A larger state is not safer — it removes merging, so the frontier grows and the search may never finish.",
    boundary:
      "A representation adequate for one query can be inadequate for another over the same domain.",
  },
  search: {
    title: "Optimality is conditional, and the conditions are nameable",
    answer:
      "A* returns a cheapest path when the heuristic is admissible — and for graph search, either consistency or a reopen policy is needed too. Reaching the goal first shows the goal was expanded first, which under an inadmissible heuristic can happen on a costlier path.",
    whyOthersFail:
      "“A* is optimal” omits the hypotheses that make it true. Arrival order is a fact about expansion order, not about cost.",
    boundary:
      "Admissibility is a property of the heuristic against true remaining cost. Asserting it is not the same as checking it.",
  },
  constraints: {
    title: "An empty domain refutes the encoding, not the world",
    answer:
      "Propagation deduced that some variable has no permissible value, so the declared constraint set is unsatisfiable. That is a sound conclusion about the model, and the model is a human artefact that may over-constrain the real situation.",
    whyOthersFail:
      "Impossibility in reality needs the encoding to be faithful, which is a separate argument. Sound propagation never removes a value that could participate in a solution, so weakening it hides the finding rather than fixing it.",
    boundary:
      "The productive next step is to relax one declared constraint and see whether the domain refills — which identifies the binding assumption.",
  },
  planning: {
    title: "No plan means no plan in the model you wrote",
    answer:
      "Failure is relative to the declared action set, preconditions, effects, and horizon. A missing action, an over-strong precondition, or too short a horizon each produce the same empty result.",
    whyOthersFail:
      "Unreachability in reality requires the model to capture every available action. Blaming the planner skips the far more common cause: an incomplete domain description.",
    boundary:
      "Lengthening the horizon and re-running distinguishes a genuine dead end from a budget that was too small.",
  },
  decision: {
    title: "Expected utility is optimal with respect to a chosen utility",
    answer:
      "Maximising expected utility is optimal given the probabilities and the utility function. Both are modelling inputs, and the utility encodes what is valued — including whatever it silently leaves out.",
    whyOthersFail:
      "Calling expected utility simply correct skips the question of whose utility. Picking the most likely good outcome ignores magnitudes, and loses to a rare, very costly failure.",
    boundary:
      "Risk attitude lives in the utility's shape. A linear utility asserts risk neutrality, which is a claim about the decision-maker, not a default.",
  },
  defense: {
    title: "One solved instance is one solved instance",
    answer:
      "A search that terminated with a solution shows this instance is solvable under this encoding, heuristic, and resource budget. Everything larger is an extrapolation.",
    whyOthersFail:
      "Scaling claims need either a complexity argument or measurements across sizes. “Best available” requires a comparison that was not run.",
    boundary:
      "The cheapest probe against a scaling claim is a slightly larger instance — search costs often turn sharply.",
  },
};

const emptyRecord: StudioRecord = {
  model: { choice: null, confidence: null, revealed: false },
  search: { choice: null, confidence: null, revealed: false },
  constraints: { choice: null, confidence: null, revealed: false },
  planning: { choice: null, confidence: null, revealed: false },
  decision: { choice: null, confidence: null, revealed: false },
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
    <section className={styles.predictionGate} aria-labelledby={`m34-${view}-gate-title`}>
      <div className={styles.gateHeading}>
        <span>Prediction gate</span>
        <h3 id={`m34-${view}-gate-title`}>
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
              ? "Now change one modelling premise and say what the answer loses."
              : "Find the smallest changed assumption that repairs the claim."}
          </p>
        </div>
      )}
    </section>
  );
}

function Fixture({ view }: { view: StudioView }) {
  if (view === "model") {
    return (
      <>
        <div className={styles.fixtureLead}>
          <div>
            <span>State fixture</span>
            <h3>Two encodings of the same situation.</h3>
            <p className={styles.formula}>S₁ = (position) · S₂ = (position, fuel)</p>
          </div>
          <p>
            Under S₁ two visits to the same position are the same node, so the
            second is pruned. If fuel differs between them, the pruned branch may
            have been the only one that could reach the goal.
          </p>
        </div>
        <table className={styles.dataTable}>
          <caption>What each encoding can express</caption>
          <thead>
            <tr><th scope="col">Question</th><th scope="col">S₁</th><th scope="col">S₂</th></tr>
          </thead>
          <tbody>
            <tr><td>where am I?</td><td>yes</td><td>yes</td></tr>
            <tr><td>can I still reach the goal?</td><td><strong>no</strong></td><td>yes</td></tr>
            <tr><td>is this a repeat visit?</td><td>coarsely</td><td>precisely</td></tr>
            <tr><td>frontier size</td><td>smaller</td><td>larger</td></tr>
          </tbody>
        </table>
        <p className={styles.textEquivalent}>
          <strong>Text equivalent:</strong> the coarser state prunes more and can
          discard a needed path; the finer state keeps correctness at the cost of
          a larger frontier. Neither is universally right.
        </p>
      </>
    );
  }

  if (view === "search") {
    return (
      <>
        <div className={styles.fixtureLead}>
          <div>
            <span>Search fixture</span>
            <h3>Two routes to the goal, different costs.</h3>
            <p className={styles.formula}>upper: 4 + 4 = 8 · lower: 1 + 2 = 3</p>
          </div>
          <p>
            A heuristic that rates the upper node attractive expands it first and
            can reach the goal along the costlier route. Whether the cheaper
            route is still found depends on admissibility and the reopen policy.
          </p>
        </div>
        <StudioFigure
          spec={searchCostFigureSpec}
          label="Two routes from start to goal: an upper route costing eight and a lower route costing three"
          describedById="m34-search-alternative"
        />
        <p className={styles.textEquivalent} id="m34-search-alternative">
          <strong>Text equivalent:</strong> from the start node, an upper path
          through the greedy pick costs four plus four; a lower path through the
          cheaper node costs one plus two. The lower route is cheaper by five,
          but a heuristic favouring the upper node expands it first.
        </p>
      </>
    );
  }

  if (view === "constraints") {
    return (
      <>
        <div className={styles.fixtureLead}>
          <div>
            <span>CSP fixture</span>
            <h3>A domain emptied during propagation.</h3>
            <p className={styles.formula}>dom(C) = ∅ after arc consistency</p>
          </div>
          <p>
            Sound propagation only removes values that cannot appear in any
            solution. An empty domain therefore proves the declared constraints
            are jointly unsatisfiable — a fact about the encoding.
          </p>
        </div>
        <table className={styles.dataTable}>
          <caption>Reading an empty domain correctly</caption>
          <thead>
            <tr><th scope="col">Conclusion</th><th scope="col">Warranted?</th></tr>
          </thead>
          <tbody>
            <tr><td>no assignment satisfies the declared constraints</td><td>yes</td></tr>
            <tr><td>the real situation admits no solution</td><td>no — needs a faithful encoding</td></tr>
            <tr><td>propagation was too strong</td><td>no — sound propagation cannot over-prune</td></tr>
            <tr><td>some declared constraint is wrong</td><td>plausible; test by relaxing one</td></tr>
          </tbody>
        </table>
        <p className={styles.codeContract}>
          <strong>Code-reading contract:</strong> record which constraint emptied
          which domain. That pair localises the conflict and is the input to any
          relaxation argument.
        </p>
      </>
    );
  }

  if (view === "planning") {
    return (
      <>
        <div className={styles.fixtureLead}>
          <div>
            <span>Planning fixture</span>
            <h3>The planner returned nothing.</h3>
            <p className={styles.formula}>actions: 4 · horizon: 6 · result: no plan</p>
          </div>
          <p>
            Three different causes produce this identical output, and the result
            alone does not distinguish them. Each has a distinct cheapest probe.
          </p>
        </div>
        <table className={styles.dataTable}>
          <caption>Causes of an empty plan and how to separate them</caption>
          <thead>
            <tr><th scope="col">Cause</th><th scope="col">Cheapest probe</th></tr>
          </thead>
          <tbody>
            <tr><td>horizon too short</td><td>raise the horizon and re-run</td></tr>
            <tr><td>missing action</td><td>hand-write a plan; see which step has no action</td></tr>
            <tr><td>over-strong precondition</td><td>relax one precondition and re-run</td></tr>
            <tr><td>genuine dead end</td><td>survives all three probes</td></tr>
          </tbody>
        </table>
        <p className={styles.textEquivalent}>
          <strong>Text equivalent:</strong> the first three rows are model
          defects with cheap tests. Only a result that survives all three
          supports the stronger reading.
        </p>
      </>
    );
  }

  if (view === "decision") {
    return (
      <>
        <div className={styles.fixtureLead}>
          <div>
            <span>Decision fixture</span>
            <h3>Two actions, same expected value.</h3>
            <p className={styles.formula}>A: 10 with p=1 · B: 100 with p=0.1, else 0</p>
          </div>
          <p>
            Both have expected value 10. A linear utility rates them equal — an
            assertion that the decision-maker is risk neutral. That assertion is
            a modelling choice, not a consequence of the arithmetic.
          </p>
        </div>
        <table className={styles.dataTable}>
          <caption>What the utility&apos;s shape encodes</caption>
          <thead>
            <tr><th scope="col">Utility</th><th scope="col">Prefers</th><th scope="col">Asserts</th></tr>
          </thead>
          <tbody>
            <tr><td>linear</td><td>indifferent</td><td>risk neutrality</td></tr>
            <tr><td>concave</td><td>A</td><td>risk aversion</td></tr>
            <tr><td>convex</td><td>B</td><td>risk seeking</td></tr>
          </tbody>
        </table>
        <p className={styles.textEquivalent}>
          <strong>Text equivalent:</strong> the same two actions and the same
          probabilities yield three different recommendations depending only on
          the utility&apos;s curvature, which someone chose.
        </p>
      </>
    );
  }

  return (
    <>
      <div className={styles.fixtureLead}>
        <div>
          <span>Claim card</span>
          <h3>What a solved instance licenses.</h3>
          <p className={styles.formula}>instance · encoding · configuration · budget</p>
        </div>
        <p>
          A terminated search with a returned solution is evidence about four
          things at once. Dropping any of them from the claim widens it past the
          evidence.
        </p>
      </div>
      <table className={styles.dataTable}>
        <caption>Candidate claims against a single solved instance</caption>
        <thead>
          <tr><th scope="col">Claim</th><th scope="col">Supported?</th></tr>
        </thead>
        <tbody>
          <tr><td>this instance is solvable under this encoding</td><td>yes</td></tr>
          <tr><td>the returned path is cheapest</td><td>only with admissibility named</td></tr>
          <tr><td>the method scales</td><td>no — needs sizes or an argument</td></tr>
          <tr><td>this approach is best</td><td>no — needs a comparison</td></tr>
        </tbody>
      </table>
      <p className={styles.textEquivalent}>
        <strong>Text equivalent:</strong> only the first claim follows directly.
        The second needs a stated heuristic property; the last two need evidence
        that was never collected.
      </p>
    </>
  );
}

export function ClassicalAIDecisionStudio() {
  const [activeView, setActiveView] = useState<StudioView>("model");
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
    <section className={styles.studio} aria-labelledby="classical-ai-decision-studio-title">
      <div className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.kicker}>Module 34 interactive reasoning studio</p>
          <h2 id="classical-ai-decision-studio-title">
            Search, Constraints &amp; Decisions Studio
          </h2>
          <p>
            Every classical AI guarantee is conditional on a model someone wrote:
            a state encoding, a heuristic property, a constraint set, a utility.
            Six fixed synthetic fixtures keep the guarantee attached to its
            hypothesis.
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
        <span>M34 working invariant</span>
        <p>
          A solver answers the model it was given. Name the state encoding, the
          heuristic property, and the utility before reading any result as a
          statement about the situation.
        </p>
      </div>

      <ol className={styles.reasoningChain} aria-label="Classical AI reasoning chain">
        {["state", "actions", "guarantee", "search", "utility", "claim"].map(
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
          aria-label="Search, constraint, and decision investigations"
        >
          {views.map((view, index) => (
            <button
              aria-controls={`m34-${view.id}-panel`}
              aria-selected={activeView === view.id}
              className={activeView === view.id ? styles.tabActive : undefined}
              id={`m34-${view.id}-tab`}
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
          aria-labelledby={`m34-${activeView}-tab`}
          className={styles.panel}
          id={`m34-${activeView}-panel`}
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
              claim. The workbook remains the authority for every guarantee and
              condition shown here.
            </p>
            {clearNotice ? <p role="status">{clearNotice}</p> : null}
          </div>
          <div className={styles.footerLinks}>
            <button onClick={clearPredictionEvidence} type="button">
              Reset predictions
            </button>
            <Link href="/modules/34-classical-ai-search-constraints-decision">
              Open the workbook
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
