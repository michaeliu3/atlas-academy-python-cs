"use client";

type FoundationBlockProps = {
  onOpenModuleOne: () => void;
  onOpenModuleTwo: () => void;
};

const foundationModules = [
  {
    number: "01",
    title: "Values, state & execution",
    question: "What changes when Python runs a statement?",
    model: "names → bindings → objects → state transitions",
    atlas: "A trustworthy immutable study-event stream.",
    color: "saffron",
  },
  {
    number: "02",
    title: "Functions, recursion & induction",
    question: "How can one rule solve a problem built from smaller versions of itself?",
    model: "contract → call frame → recursive structure → induction",
    atlas: "A note-tree traversal with a termination argument.",
    color: "cobalt",
  },
  {
    number: "03",
    title: "Abstraction, interfaces & ADTs",
    question: "How can clients rely on behavior without depending on representation?",
    model: "operations → laws → invariant → representation independence",
    atlas: "An event store whose storage can change safely.",
    color: "plum",
  },
  {
    number: "04",
    title: "Logic, relations, graphs & proof",
    question: "How can Atlas know that every prerequisite is respected?",
    model: "claim → quantifier → relation → graph → proof + witness",
    atlas: "A prerequisite graph and explainable route validator.",
    color: "moss",
  },
  {
    number: "05",
    title: "Cost models & analysis",
    question: "How will the same correct design behave when Atlas grows?",
    model: "input size → counted operations → bound → measurement",
    atlas: "A scaling study that separates prediction from observation.",
    color: "rose",
  },
];

const recurringQuestions = [
  ["Represent", "What information exists, and what distinctions must survive?"],
  ["Specify", "What may clients assume before and after an operation?"],
  ["Execute", "What state changes, in what order, and through which boundary?"],
  ["Prove", "Why does the claim follow for every allowed case?"],
  ["Measure", "What resource grows, and under which assumptions?"],
  ["Connect", "Where will this model reappear in a larger system?"],
];

export function FoundationBlock({
  onOpenModuleOne,
  onOpenModuleTwo,
}: FoundationBlockProps) {
  return (
    <article className="foundation">
      <header className="foundation-hero">
        <div>
          <p className="kicker">Arc I · Modules 1–5</p>
          <h1>
            The foundation is
            <em> one argument.</em>
          </h1>
        </div>
        <p>
          We begin with what a program changes, turn repeated behavior into
          functions, protect it behind abstractions, express its claims with
          mathematics, and finally ask what those claims cost at scale.
        </p>
      </header>

      <section className="foundation-chain" aria-label="Foundation dependency chain">
        {foundationModules.map((module, index) => (
          <article className={`foundation-node ${module.color}`} key={module.number}>
            <div className="foundation-node-top">
              <span>{module.number}</span>
              {index < foundationModules.length - 1 && (
                <i aria-hidden="true">→</i>
              )}
            </div>
            <h2>{module.title}</h2>
            <p>{module.question}</p>
            <dl>
              <div>
                <dt>Mental model</dt>
                <dd>{module.model}</dd>
              </div>
              <div>
                <dt>Atlas evidence</dt>
                <dd>{module.atlas}</dd>
              </div>
            </dl>
          </article>
        ))}
      </section>

      <section className="foundation-story">
        <div className="foundation-story-copy">
          <p className="kicker">Why this order exists</p>
          <h2>Each module repairs a limitation in the one before it.</h2>
        </div>
        <div className="limitation-ladder">
          <div>
            <span>01 → 02</span>
            <p>
              A state trace explains one execution. Functions and induction let
              us explain an entire recursively structured family of executions.
            </p>
          </div>
          <div>
            <span>02 → 03</span>
            <p>
              A correct function is still easy to couple to. An ADT protects
              behavior so its representation can change without breaking clients.
            </p>
          </div>
          <div>
            <span>03 → 04</span>
            <p>
              A contract written only in prose can hide ambiguity. Logic and
              proof expose its quantifiers, assumptions, and counterexamples.
            </p>
          </div>
          <div>
            <span>04 → 05</span>
            <p>
              Proof establishes modeled correctness. Cost analysis asks whether
              evaluating that correct model remains feasible as inputs grow.
            </p>
          </div>
        </div>
      </section>

      <section className="recurring-lens">
        <p className="kicker">The recurring lens</p>
        <h2>Six questions follow us through all 27 modules.</h2>
        <div className="lens-grid">
          {recurringQuestions.map(([verb, question], index) => (
            <div key={verb}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{verb}</strong>
              <p>{question}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="foundation-studio">
        <div>
          <p className="kicker">Foundation studio</p>
          <h2>One Atlas feature, viewed five ways.</h2>
          <p>
            The same prerequisite planner appears as mutable state, recursive
            traversal, an abstract interface, a graph theorem, and a scaling
            experiment. Repetition is deliberate: each pass adds resolution.
          </p>
        </div>
        <ol>
          <li>
            <span>Read</span>
            Trace an unfamiliar implementation without running it.
          </li>
          <li>
            <span>Model</span>
            Draw state, call, architecture, and graph views.
          </li>
          <li>
            <span>Challenge</span>
            Construct a counterexample to an underspecified claim.
          </li>
          <li>
            <span>Direct</span>
            Give an agent one bounded change and explicit evidence.
          </li>
          <li>
            <span>Verify</span>
            Review the patch, its proof idea, tests, and cost claim.
          </li>
        </ol>
      </section>

      <footer className="foundation-actions">
        <button className="primary-action" onClick={onOpenModuleOne}>
          Read Module 1 <span aria-hidden="true">→</span>
        </button>
        <button className="text-action" onClick={onOpenModuleTwo}>
          Continue to Module 2
        </button>
      </footer>
    </article>
  );
}
