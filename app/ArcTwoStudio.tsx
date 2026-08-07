"use client";

import {
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";

type ArcTwoStudioProps = {
  onOpenFoundation: () => void;
  onOpenDiagnostic: () => void;
};

const stages = [
  {
    module: "06",
    label: "Represent",
    title: "History buffer",
    need: "Preserve events and understand what storage really costs.",
    interface: "append · index · iterate",
    structure: "dynamic array ↔ linked nodes",
    invariant:
      "The logical sequence contains exactly the active events, in arrival order.",
    cost: "Amortized append, direct indexing, traversal locality, retained memory.",
    evidence: "Representation trace + predicted/observed cost comparison.",
    accent: "cobalt",
  },
  {
    module: "07",
    label: "Control",
    title: "Lazy ingestion",
    need: "Process a source larger than available working memory.",
    interface: "next · enqueue · dequeue",
    structure: "iterator + bounded queue",
    invariant:
      "Each source event is yielded at most once and the buffer never exceeds its bound.",
    cost: "Live memory depends on retained pipeline state, not total source size.",
    evidence: "Suspension trace + exhaustion and retention failure investigation.",
    accent: "moss",
  },
  {
    module: "08",
    label: "Index",
    title: "Inverted index",
    need: "Find notes by term without rescanning the entire history.",
    interface: "insert · membership · lookup",
    structure: "hash table of posting sets",
    invariant:
      "Equal keys reach one logical entry; every posting names an existing event.",
    cost: "Expected lookup, collision behavior, resizing, adversarial cases.",
    evidence: "Collision trace + equality/hash review + stale-posting tests.",
    accent: "saffron",
  },
  {
    module: "09",
    label: "Order",
    title: "Review scheduler",
    need: "Select the most urgent review and answer ordered queries.",
    interface: "insert · peek-min · extract-min · prefix",
    structure: "heap + ordered search structure",
    invariant:
      "Priority and search order survive every update.",
    cost: "Logarithmic updates; ordering assumptions and structure-specific space.",
    evidence: "Heap trace + coordinated dictionary/heap architecture defense.",
    accent: "plum",
  },
  {
    module: "10",
    label: "Navigate",
    title: "Prerequisite planner",
    need: "Discover what is unlocked and reconstruct valid learning routes.",
    interface: "neighbors · discover · relax · parent",
    structure: "adjacency map + frontier + evidence maps",
    invariant:
      "Discovery state and parent links justify every reported path.",
    cost: "Traversal cost follows vertices, edges, frontier discipline, and weights.",
    evidence: "Graph trace + earliest-invariant-violation diagnosis.",
    accent: "rose",
  },
  {
    module: "11",
    label: "Strategize",
    title: "Plan optimizer",
    need: "Choose high-value study under time and prerequisite constraints.",
    interface: "define state · choose · combine · reconstruct",
    structure: "subproblem DAG / memo / table",
    invariant:
      "Every state has one precise meaning and considers exactly the legal choices.",
    cost: "Number of states × transitions, plus reconstruction space.",
    evidence: "Recurrence defense + reviewed agent implementation.",
    accent: "ink",
  },
];

const recurringQuestions = [
  ["Identity", "Position, key, priority—or relationship?"],
  ["Order", "Intrinsic, imposed, partial, or irrelevant?"],
  ["State", "What must survive between operations?"],
  ["Invariant", "What promise makes the structure trustworthy?"],
  ["Cost", "Worst, expected, amortized—and under what model?"],
  ["Boundary", "Python guarantee, CPython detail, or course model?"],
];

export function ArcTwoStudio({
  onOpenFoundation,
  onOpenDiagnostic,
}: ArcTwoStudioProps) {
  const [activeStage, setActiveStage] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  function handleStageKeyDown(
    event: ReactKeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    const key = event.key;
    if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(key)) {
      return;
    }

    event.preventDefault();
    const nextIndex =
      key === "ArrowRight"
        ? (index + 1) % stages.length
        : key === "ArrowLeft"
          ? (index - 1 + stages.length) % stages.length
          : key === "Home"
            ? 0
            : stages.length - 1;
    setActiveStage(nextIndex);
    tabRefs.current[nextIndex]?.focus();
  }

  return (
    <article className="arc-two">
      <header className="arc-two-hero">
        <div>
          <p className="kicker">Arc II · Modules 6–11</p>
          <h1>
            From storage
            <em> to strategy.</em>
          </h1>
        </div>
        <div className="arc-two-thesis">
          <span>ONE ENGINEERING ARGUMENT</span>
          <p>
            Atlas must preserve, stream, find, order, navigate, and choose.
            Each pressure forces the next abstraction.
          </p>
        </div>
      </header>

      <section className="arc-two-intro">
        <p className="display-quote">
          A data structure is not a container name. It is a{" "}
          <strong>representation chosen for a workload</strong>, held together
          by an invariant, and defended with a cost model.
        </p>
        <div className="arc-two-rule">
          <span>THE RECURRING MOVE</span>
          <div>
            <strong>need</strong>
            <i>→</i>
            <strong>interface</strong>
            <i>→</i>
            <strong>representation</strong>
            <i>→</i>
            <strong>evidence</strong>
          </div>
        </div>
      </section>

      <section className="pipeline-section">
        <div className="section-heading">
          <span className="section-number">01</span>
          <div>
            <p className="kicker">The living Atlas pipeline</p>
            <h2>One system, six new capabilities</h2>
          </div>
        </div>

        <div className="pipeline-rail" role="tablist" aria-label="Arc II modules">
          {stages.map((stage, index) => (
            <button
              aria-selected={activeStage === index}
              aria-controls={`arc-two-stage-panel-${stage.module}`}
              className={`${stage.accent} ${
                activeStage === index ? "selected" : ""
              }`}
              id={`arc-two-stage-tab-${stage.module}`}
              key={stage.module}
              onClick={() => setActiveStage(index)}
              onKeyDown={(event) => handleStageKeyDown(event, index)}
              role="tab"
              tabIndex={activeStage === index ? 0 : -1}
              type="button"
              ref={(element) => {
                tabRefs.current[index] = element;
              }}
            >
              <span>M{stage.module}</span>
              <strong>{stage.label}</strong>
              <small>{stage.title}</small>
            </button>
          ))}
        </div>

        {stages.map((stage, index) => {
          const selected = activeStage === index;
          return (
            <div
              aria-labelledby={`arc-two-stage-tab-${stage.module}`}
              className={`stage-inspector ${stage.accent}`}
              hidden={!selected}
              id={`arc-two-stage-panel-${stage.module}`}
              key={stage.module}
              role="tabpanel"
              tabIndex={selected ? 0 : -1}
            >
              <div className="stage-index">
                <span>MODULE</span>
                <strong>{stage.module}</strong>
              </div>
              <div className="stage-story">
                <p className="kicker">{stage.label}</p>
                <h3>{stage.title}</h3>
                <p>{stage.need}</p>
              </div>
              <dl>
                <div>
                  <dt>Required interface</dt>
                  <dd>{stage.interface}</dd>
                </div>
                <div>
                  <dt>Representation</dt>
                  <dd>{stage.structure}</dd>
                </div>
                <div>
                  <dt>Invariant</dt>
                  <dd>{stage.invariant}</dd>
                </div>
                <div>
                  <dt>Cost lens</dt>
                  <dd>{stage.cost}</dd>
                </div>
                <div>
                  <dt>Mastery evidence</dt>
                  <dd>{stage.evidence}</dd>
                </div>
              </dl>
            </div>
          );
        })}
      </section>

      <section className="question-lens">
        <div className="question-lens-copy">
          <p className="kicker">The mental model</p>
          <h2>Six questions travel through every module.</h2>
          <p>
            Reusing the questions reduces learning friction while the answers
            become more sophisticated. This is how separate facts become a
            transferable design habit.
          </p>
        </div>
        <div className="question-wheel">
          {recurringQuestions.map(([title, prompt], index) => (
            <article key={title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{title}</strong>
              <p>{prompt}</p>
            </article>
          ))}
          <div className="wheel-core">
            <span>client</span>
            <strong>workload</strong>
          </div>
        </div>
      </section>

      <section className="claim-boundaries">
        <div className="section-heading">
          <span className="section-number">02</span>
          <div>
            <p className="kicker">Precision without needless jargon</p>
            <h2>Know which kind of claim you are making.</h2>
          </div>
        </div>
        <div className="boundary-cards">
          <article>
            <span className="claim-badge guarantee">PYTHON GUARANTEE</span>
            <h3>Clients may depend on it.</h3>
            <p>
              Example: an iterator supplies successive values through the
              iteration protocol; dictionaries preserve insertion order.
            </p>
          </article>
          <article>
            <span className="claim-badge observation">CPYTHON OBSERVATION</span>
            <h3>Useful, but implementation-bound.</h3>
            <p>
              Example: the current list growth rule or dictionary table layout
              can explain behavior without becoming a language promise.
            </p>
          </article>
          <article>
            <span className="claim-badge model">COURSE MODEL</span>
            <h3>Small enough to expose the mechanism.</h3>
            <p>
              Example: our chained hash table reveals collisions and invariants
              without pretending to reproduce CPython.
            </p>
          </article>
        </div>
      </section>

      <section className="invariant-section">
        <div className="invariant-copy">
          <p className="kicker">The invariant ladder</p>
          <h2>When the final answer is wrong, reason downward.</h2>
          <p>
            A bad plan may begin as a bad recurrence—or as a consumed iterator,
            stale posting, malformed graph edge, or aliased history record. The
            ladder makes cross-layer debugging visible.
          </p>
        </div>
        <ol className="invariant-ladder">
          <li>
            <span>M11</span>
            <strong>Subproblem meaning</strong>
          </li>
          <li>
            <span>M10</span>
            <strong>Traversal evidence</strong>
          </li>
          <li>
            <span>M09</span>
            <strong>Ordering & priority</strong>
          </li>
          <li>
            <span>M08</span>
            <strong>Key placement</strong>
          </li>
          <li>
            <span>M07</span>
            <strong>Protocol state</strong>
          </li>
          <li>
            <span>M06</span>
            <strong>Representation shape</strong>
          </li>
        </ol>
      </section>

      <section className="studio-brief">
        <div className="studio-stamp">
          <span>CUMULATIVE</span>
          <strong>ATLAS STUDIO</strong>
          <small>architecture defense</small>
        </div>
        <div className="studio-brief-copy">
          <p className="kicker">The real-life constraint</p>
          <h2>Ten million untrusted events. Fifty megabytes of live memory.</h2>
          <p>
            Atlas must preserve an audit trail, stream input, update search,
            serve prefix queries, respect prerequisites, and build a daily plan.
            You will not type the whole system. You will understand it well
            enough to design, direct, challenge, and verify it.
          </p>
          <div className="evidence-strip">
            {[
              "architecture",
              "trace",
              "invariant",
              "cost argument",
              "adversarial tests",
              "patch review",
            ].map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="arc-two-check">
        <div>
          <p className="kicker">One fast understanding check</p>
          <h2>Why might Atlas use both a dictionary and a heap?</h2>
        </div>
        <details>
          <summary>Reveal the design reason</summary>
          <p>
            The dictionary answers <strong>“find item by identity”</strong>;
            the heap answers <strong>“which item has highest priority?”</strong>.
            They implement different interfaces. The hard architectural question
            is how updates keep their coordinated state consistent.
          </p>
        </details>
      </section>

      <footer className="arc-two-actions">
        <button className="text-action" onClick={onOpenFoundation}>
          ← Revisit the foundation
        </button>
        <div>
          <span>Placement still matters.</span>
          <button className="primary-action" onClick={onOpenDiagnostic}>
            Take the diagnostic →
          </button>
        </div>
      </footer>
    </article>
  );
}
