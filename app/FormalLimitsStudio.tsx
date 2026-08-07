"use client";

import Link from "next/link";
import { type KeyboardEvent as ReactKeyboardEvent, useRef, useState } from "react";
import { StudioFigure } from "./StudioFigure";
import styles from "./AdvancedStudio.module.css";

/**
 * Session 5's runtime observations. Growth on the measured range says nothing
 * about the class, which is exactly the confusion the view exists to break.
 */
const runtimeGrowthFigureSpec = {
  kind: "plot",
  width: 420,
  height: 260,
  xLabel: "input size n",
  yLabel: "observed ms",
  xRange: [0, 22],
  yRange: [0, 260],
  series: [
    {
      points: [
        [4, 3],
        [8, 11],
        [12, 38],
        [16, 96],
        [20, 240],
      ],
      label: "one implementation",
    },
  ],
} as const;

type StudioView =
  | "languages"
  | "finite-state"
  | "grammar"
  | "reduction"
  | "classes"
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
    id: "languages",
    number: "01",
    label: "Languages as objects",
    question: "A parser accepts the string. What has been established?",
  },
  {
    id: "finite-state",
    number: "02",
    label: "Finite state",
    question: "The automaton accepted 500 test strings. What follows?",
  },
  {
    id: "grammar",
    number: "03",
    label: "Grammar vs semantics",
    question: "The program parses. Does it halt?",
  },
  {
    id: "reduction",
    number: "04",
    label: "Reductions",
    question: "A reduces to B. Which direction does hardness travel?",
  },
  {
    id: "classes",
    number: "05",
    label: "Complexity classes",
    question: "Runtime quadrupled when n doubled. Which class is this?",
  },
  {
    id: "defense",
    number: "06",
    label: "Narrow claim",
    question: "Which formal claim does your evidence actually support?",
  },
];

const choices: Record<StudioView, ReadonlyArray<{ id: string; label: string }>> = {
  languages: [
    {
      id: "membership-under-this-grammar",
      label:
        "One string is in the language this parser implements — which may differ from the language you intended.",
    },
    { id: "program-is-correct", label: "The program is syntactically and semantically correct." },
    { id: "grammar-is-unambiguous", label: "The grammar is unambiguous." },
  ],
  "finite-state": [
    {
      id: "500-strings-not-a-proof",
      label:
        "500 membership observations. A language is usually infinite, so testing cannot establish equality.",
    },
    { id: "automaton-is-correct", label: "The automaton recognises the intended language." },
    { id: "language-is-regular", label: "The language is regular." },
  ],
  grammar: [
    {
      id: "parsing-says-nothing-about-halting",
      label:
        "Nothing — parsing decides membership in a syntactic set; halting is undecidable and is a different question.",
    },
    { id: "well-formed-therefore-terminates", label: "A well-formed program terminates." },
    { id: "run-it-and-see", label: "Run it; if it finishes, it halts." },
  ],
  reduction: [
    {
      id: "hardness-travels-to-b",
      label:
        "If A reduces to B and A is hard, then B is at least as hard — hardness travels along the reduction.",
    },
    { id: "hardness-travels-to-a", label: "B being hard makes A hard." },
    { id: "reduction-means-equivalent", label: "A reduction shows the two problems are equivalent." },
  ],
  classes: [
    {
      id: "one-implementation-on-a-range",
      label:
        "One implementation grew roughly quadratically over five measured sizes — a fit on a range, not a class.",
    },
    { id: "problem-is-in-p", label: "The problem is in P." },
    { id: "problem-is-quadratic", label: "The problem is quadratic." },
  ],
  defense: [
    {
      id: "scoped-formal-claim",
      label:
        "A claim naming the model of computation, the encoding, and the resource being bounded.",
    },
    { id: "np-means-impossible", label: "The problem is NP, so it cannot be solved." },
    { id: "timeout-proves-hardness", label: "The solver timed out, so the problem is hard." },
  ],
};

const correctChoice: Record<StudioView, string> = {
  languages: "membership-under-this-grammar",
  "finite-state": "500-strings-not-a-proof",
  grammar: "parsing-says-nothing-about-halting",
  reduction: "hardness-travels-to-b",
  classes: "one-implementation-on-a-range",
  defense: "scoped-formal-claim",
};

const feedback: Record<
  StudioView,
  { title: string; answer: string; whyOthersFail: string; boundary: string }
> = {
  languages: {
    title: "A parser implements a language; it does not define the one you meant",
    answer:
      "Acceptance is a membership fact about the grammar the parser actually implements. When that grammar differs from the intended language — and it often does at the edges — acceptance certifies the implementation, not the intention.",
    whyOthersFail:
      "Semantic correctness is not a syntactic property; a well-formed program can compute the wrong thing. Ambiguity is a property of the grammar and needs its own argument.",
    boundary:
      "To compare the implemented and intended languages you need a string where they disagree. Finding one is the work.",
  },
  "finite-state": {
    title: "Testing samples a language; it cannot exhaust an infinite one",
    answer:
      "Five hundred accepted strings are five hundred membership observations. If the language is infinite, no finite test set establishes that the automaton recognises exactly it — the pumping lemma exists precisely because finite evidence cannot settle the question.",
    whyOthersFail:
      "Correctness would require agreement on every string. Regularity is a claim about the language itself, provable or refutable by an argument, not by passing tests.",
    boundary:
      "A single rejected string that should be accepted refutes correctness immediately. That asymmetry is what makes counterexamples valuable.",
  },
  grammar: {
    title: "Syntax and semantics are different questions with different answers",
    answer:
      "Parsing decides membership in a context-free set and always terminates. Halting is undecidable: no algorithm decides it for all programs. A parser therefore cannot answer it, however sophisticated.",
    whyOthersFail:
      "Well-formedness places no bound on execution. Running the program is a semi-decision procedure — it confirms halting when it halts and tells you nothing while it runs.",
    boundary:
      "Halting is decidable for restricted families, such as programs with bounded loops. The restriction is what buys decidability.",
  },
  reduction: {
    title: "A reduction is directed",
    answer:
      "A reduction from A to B transforms instances of A into instances of B, so a solver for B solves A. Hardness therefore flows forward: if A is hard, B must be at least as hard. Easiness flows backward.",
    whyOthersFail:
      "Reversing the direction is the standard error and proves nothing about A. Equivalence requires reductions both ways, which is a strictly stronger statement.",
    boundary:
      "The reduction must be efficient relative to the class in question. A reduction costing more than the class allows proves nothing about it.",
  },
  classes: {
    title: "A measured curve is a fit, not a classification",
    answer:
      "Five points growing fourfold per doubling are consistent with quadratic behaviour on that range. A complexity class is a statement about all inputs for the best possible algorithm, and no measurement of one implementation reaches it.",
    whyOthersFail:
      "Membership in P is a claim about the problem, not about one program. Calling the problem quadratic attributes an implementation's behaviour to the problem itself.",
    boundary:
      "Extrapolating past the measured range assumes the same regime continues — often false once memory hierarchy or a different code path engages.",
  },
  defense: {
    title: "A formal claim names its model, encoding, and resource",
    answer:
      "Without the machine model, the input encoding, and the resource being bounded, a complexity statement is not well formed. Those three fields turn a slogan into something that can be argued with.",
    whyOthersFail:
      "NP contains problems solved routinely at practical sizes; membership is not impossibility. A timeout is a fact about one solver on one instance, and one instance never determines a class.",
    boundary:
      "A well-formed claim can still be false. Being refutable is the point.",
  },
};

const emptyRecord: StudioRecord = {
  languages: { choice: null, confidence: null, revealed: false },
  "finite-state": { choice: null, confidence: null, revealed: false },
  grammar: { choice: null, confidence: null, revealed: false },
  reduction: { choice: null, confidence: null, revealed: false },
  classes: { choice: null, confidence: null, revealed: false },
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
    <section className={styles.predictionGate} aria-labelledby={`m33-${view}-gate-title`}>
      <div className={styles.gateHeading}>
        <span>Prediction gate</span>
        <h3 id={`m33-${view}-gate-title`}>
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
              ? "Now state the smallest counterexample that would refute it."
              : "Find the smallest changed assumption that repairs the claim."}
          </p>
        </div>
      )}
    </section>
  );
}

function Fixture({ view }: { view: StudioView }) {
  if (view === "languages") {
    return (
      <>
        <div className={styles.fixtureLead}>
          <div>
            <span>Declared language</span>
            <h3>Two grammars, one accepted string.</h3>
            <p className={styles.formula}>L₁ = {"{"} aⁿbⁿ : n ≥ 1 {"}"} · L₂ = {"{"} a…ab…b {"}"}</p>
          </div>
          <p>
            The string <code>aabb</code> is in both. The intended language pairs
            the counts; the implemented one only requires a block of a&apos;s
            followed by a block of b&apos;s. One accepted string cannot tell them
            apart.
          </p>
        </div>
        <table className={styles.dataTable}>
          <caption>Where the two languages agree and disagree</caption>
          <thead>
            <tr><th scope="col">string</th><th scope="col">in L₁?</th><th scope="col">in L₂?</th></tr>
          </thead>
          <tbody>
            <tr><td>aabb</td><td>yes</td><td>yes</td></tr>
            <tr><td>ab</td><td>yes</td><td>yes</td></tr>
            <tr><td>aaabb</td><td><strong>no</strong></td><td><strong>yes</strong></td></tr>
            <tr><td>abab</td><td>no</td><td>no</td></tr>
          </tbody>
        </table>
        <p className={styles.textEquivalent}>
          <strong>Text equivalent:</strong> the third row is the discriminating
          string. <code>aaabb</code> has unequal counts, so it is outside the
          intended language but inside the implemented one.
        </p>
      </>
    );
  }

  if (view === "finite-state") {
    return (
      <>
        <div className={styles.fixtureLead}>
          <div>
            <span>Test evidence</span>
            <h3>500 strings accepted, none rejected wrongly.</h3>
            <p className={styles.formula}>|tested| = 500 · |L| = ∞</p>
          </div>
          <p>
            The tested set is finite and the language is not. Whatever the pass
            rate, an infinite remainder is untested — and the pumping lemma shows
            that for some languages no finite automaton can be correct at all.
          </p>
        </div>
        <table className={styles.dataTable}>
          <caption>What finite testing settles</caption>
          <thead>
            <tr><th scope="col">Question</th><th scope="col">Settled by 500 tests?</th></tr>
          </thead>
          <tbody>
            <tr><td>Does it accept these 500 strings?</td><td>yes</td></tr>
            <tr><td>Does it accept exactly L?</td><td>no</td></tr>
            <tr><td>Is L regular?</td><td>no — needs an argument</td></tr>
            <tr><td>Is there a rejected string that should pass?</td><td>refutable, not confirmable</td></tr>
          </tbody>
        </table>
        <p className={styles.textEquivalent}>
          <strong>Text equivalent:</strong> only the first question is answered
          by the tests. The others need a proof or a counterexample, and the last
          can be refuted by one example but never confirmed by many.
        </p>
      </>
    );
  }

  if (view === "grammar") {
    return (
      <>
        <div className={styles.fixtureLead}>
          <div>
            <span>Two questions</span>
            <h3>One is decidable; one is not.</h3>
            <p className={styles.formula}>parse(p) terminates · halts(p) does not exist</p>
          </div>
          <p>
            A parser for a context-free grammar always terminates and returns a
            yes or no. No total procedure decides halting for arbitrary programs.
            Stacking more syntactic analysis never crosses that line.
          </p>
        </div>
        <table className={styles.dataTable}>
          <caption>Syntactic and semantic questions kept apart</caption>
          <thead>
            <tr><th scope="col">Question</th><th scope="col">Status</th></tr>
          </thead>
          <tbody>
            <tr><td>is the token sequence well formed?</td><td>decidable</td></tr>
            <tr><td>does this identifier resolve?</td><td>decidable under a scope model</td></tr>
            <tr><td>does the program halt on all inputs?</td><td>undecidable</td></tr>
            <tr><td>does it halt within 10⁶ steps?</td><td>decidable — the bound buys it</td></tr>
          </tbody>
        </table>
        <p className={styles.codeContract}>
          <strong>Code-reading contract:</strong> the fourth row shows where the
          line moves. Adding a resource bound converts an undecidable question
          into a decidable one about a different, smaller claim.
        </p>
      </>
    );
  }

  if (view === "reduction") {
    return (
      <>
        <div className={styles.fixtureLead}>
          <div>
            <span>Reduction fixture</span>
            <h3>The arrow has a direction and it matters.</h3>
            <p className={styles.formula}>A ≤ B: solve A by transforming it into B</p>
          </div>
          <p>
            Given an instance of A, map it to an instance of B, solve B, and map
            the answer back. A solver for B therefore yields a solver for A — so
            B is at least as hard as A, never the reverse.
          </p>
        </div>
        <table className={styles.dataTable}>
          <caption>What A ≤ B does and does not license</caption>
          <thead>
            <tr><th scope="col">Statement</th><th scope="col">Follows?</th></tr>
          </thead>
          <tbody>
            <tr><td>A is hard ⟹ B is hard</td><td>yes</td></tr>
            <tr><td>B is easy ⟹ A is easy</td><td>yes</td></tr>
            <tr><td>B is hard ⟹ A is hard</td><td><strong>no</strong></td></tr>
            <tr><td>A and B are equivalent</td><td>no — needs B ≤ A as well</td></tr>
          </tbody>
        </table>
        <p className={styles.textEquivalent}>
          <strong>Text equivalent:</strong> the first two rows follow from the
          reduction; the third reverses it and is the common error; the fourth
          requires a second reduction in the opposite direction.
        </p>
      </>
    );
  }

  if (view === "classes") {
    return (
      <>
        <div className={styles.fixtureLead}>
          <div>
            <span>Measured growth</span>
            <h3>Fourfold per doubling, over five sizes.</h3>
            <p className={styles.formula}>n: 4, 8, 12, 16, 20 → 3, 11, 38, 96, 240 ms</p>
          </div>
          <p>
            The curve is consistent with quadratic growth on this range. It was
            produced by one implementation, in one language, on one machine — the
            three things a complexity class deliberately abstracts away.
          </p>
        </div>
        <StudioFigure
          spec={runtimeGrowthFigureSpec}
          label="Observed runtime growing roughly fourfold each time the input size doubles"
          describedById="m33-classes-alternative"
        />
        <p className={styles.textEquivalent} id="m33-classes-alternative">
          <strong>Text equivalent:</strong> five measured points rise from 3 ms
          at n=4 to 240 ms at n=20, roughly quadrupling as n doubles. The shape
          describes this implementation over this range and does not classify the
          underlying problem.
        </p>
      </>
    );
  }

  return (
    <>
      <div className={styles.fixtureLead}>
        <div>
          <span>Claim card</span>
          <h3>Three fields make a complexity claim well formed.</h3>
          <p className={styles.formula}>model · encoding · resource</p>
        </div>
        <p>
          Without a machine model the statement has no cost function; without an
          encoding the input size is undefined; without a named resource the
          bound is on nothing in particular. All three are cheap to state.
        </p>
      </div>
      <table className={styles.dataTable}>
        <caption>Candidate claims against the evidence held</caption>
        <thead>
          <tr><th scope="col">Claim</th><th scope="col">Supported?</th></tr>
        </thead>
        <tbody>
          <tr><td>this implementation grew ~quadratically for n ≤ 20</td><td>yes</td></tr>
          <tr><td>the problem is in P</td><td>no — a claim about all algorithms</td></tr>
          <tr><td>the solver timed out, so the problem is hard</td><td>no — one instance, one solver</td></tr>
          <tr><td>NP membership means it cannot be solved</td><td>no — NP problems are solved daily</td></tr>
        </tbody>
      </table>
      <p className={styles.textEquivalent}>
        <strong>Text equivalent:</strong> only the measured, scoped statement is
        supported. The other three each promote an observation about one run into
        a claim about a class.
      </p>
    </>
  );
}

export function FormalLimitsStudio() {
  const [activeView, setActiveView] = useState<StudioView>("languages");
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
    <section className={styles.studio} aria-labelledby="formal-limits-studio-title">
      <div className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.kicker}>Module 33 interactive reasoning studio</p>
          <h2 id="formal-limits-studio-title">Formal Languages &amp; Limits Studio</h2>
          <p>
            A language is an object, a reduction is directed, and a complexity
            class is a statement about every algorithm. Six fixed synthetic
            fixtures separate what a run shows from what a proof would need.
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
        <span>M33 working invariant</span>
        <p>
          Finite evidence can refute a formal claim and cannot confirm one. Name
          the model, the encoding, and the resource before any statement about a
          class.
        </p>
      </div>

      <ol className={styles.reasoningChain} aria-label="Formal reasoning chain">
        {["language", "model", "question", "reduction", "class", "claim"].map(
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
          aria-label="Formal languages and limits investigations"
        >
          {views.map((view, index) => (
            <button
              aria-controls={`m33-${view.id}-panel`}
              aria-selected={activeView === view.id}
              className={activeView === view.id ? styles.tabActive : undefined}
              id={`m33-${view.id}-tab`}
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
          aria-labelledby={`m33-${activeView}-tab`}
          className={styles.panel}
          id={`m33-${activeView}-panel`}
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
              claim. The workbook remains the authority for every definition and
              proof sketch shown here.
            </p>
            {clearNotice ? <p role="status">{clearNotice}</p> : null}
          </div>
          <div className={styles.footerLinks}>
            <button onClick={clearPredictionEvidence} type="button">
              Reset predictions
            </button>
            <Link href="/modules/33-formal-languages-computability-complexity">
              Open the workbook
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
