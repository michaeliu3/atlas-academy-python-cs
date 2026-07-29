"use client";

type ModuleTwoReaderProps = {
  onBack: () => void;
  onDiagnostic: () => void;
};

const obligations = [
  ["Base", "Which smallest structure can be answered directly?"],
  ["Recur", "How is a larger structure made from smaller structures of the same kind?"],
  ["Progress", "Which nonnegative measure strictly decreases on every recursive call?"],
  ["Combine", "How do returned sub-results become the parent result?"],
];

const checks = [
  {
    prompt: "A recursive function has a base case but calls itself with n − 2. Why can n = 3 still fail?",
    answer:
      "The sequence 3, 1, −1, … never reaches zero. A written base case is not enough; every supported recursive path must make well-founded progress toward one.",
  },
  {
    prompt: "A traversal visits n tree nodes once. What determines its maximum call-stack space?",
    answer:
      "Tree height h, not total node count by itself. At one moment the active calls form one root-to-current-node path, so stack space is Θ(h).",
  },
  {
    prompt: "What may a structural-induction hypothesis assume?",
    answer:
      "The claim for each structurally smaller child subtree. It may not assume the claim for the current parent; that would be circular.",
  },
];

export function ModuleTwoReader({
  onBack,
  onDiagnostic,
}: ModuleTwoReaderProps) {
  return (
    <article className="reader module-two-reader">
      <header className="reader-hero module-two-hero">
        <p className="kicker">Module 2 · Computation & reasoning</p>
        <h1>Functions, recursion, and induction</h1>
        <p>
          A function gives computation a boundary. Recursion gives repeated
          structure an executable form. Induction gives that same structure a
          correctness argument.
        </p>
      </header>

      <aside className="reader-map">
        <span>contract</span>
        <i>→</i>
        <span>frames</span>
        <i>→</i>
        <span>recursion</span>
        <i>→</i>
        <span>termination</span>
        <i>→</i>
        <span>induction</span>
        <i>→</i>
        <span>cost</span>
      </aside>

      <section className="reader-section">
        <span className="margin-label">The need</span>
        <h2>Fixed syntax meets unknown depth</h2>
        <p>
          Atlas groups notes into a hierarchy. One branch can be a leaf; another
          can be fifty levels deep. Writing one loop per level only moves the
          failure farther away.
        </p>
        <div className="note-tree" aria-label="Atlas note hierarchy">
          <div className="tree-root">
            <strong>Python execution</strong>
            <small>5 min</small>
          </div>
          <div className="tree-branches">
            <div>
              <span />
              <strong>Names & bindings</strong>
              <small>12 min</small>
            </div>
            <div className="branch-parent">
              <span />
              <strong>Mutation</strong>
              <small>8 min</small>
              <div className="tree-leaves">
                <em>Aliasing · 10</em>
                <em>Immutable boundaries · 7</em>
              </div>
            </div>
          </div>
        </div>
        <div className="callout question-callout">
          <strong>Driving question</strong>
          <p>
            How can one finite rule handle every finite depth—and how can we
            know it terminates, returns the right total, and uses acceptable
            resources?
          </p>
        </div>
      </section>

      <section className="reader-section">
        <span className="margin-label">Derive</span>
        <h2>Safe recursion has four obligations</h2>
        <div className="obligation-grid">
          {obligations.map(([title, explanation], index) => (
            <div key={title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{title}</strong>
              <p>{explanation}</p>
            </div>
          ))}
        </div>
        <p className="plain-precise">
          <span>
            <strong>Plain language:</strong> solve the small case; ask smaller
            versions for help; combine their answers.
          </span>
          <span>
            <strong>Precise model:</strong> every supported recursive call must
            strictly decrease a well-founded measure, and the combination rule
            must establish the postcondition from smaller correct results.
          </span>
        </p>
      </section>

      <section className="reader-section">
        <span className="margin-label">Trace</span>
        <h2>Calls descend. Results return.</h2>
        <pre>
          <code>{`def total_minutes(note: Note) -> int:
    subtotal = note.minutes
    for child in note.children:
        subtotal += total_minutes(child)
    return subtotal`}</code>
        </pre>
        <div className="frame-story" aria-label="Recursive call and return trace">
          <div className="frame-column descend">
            <p>Calls descend</p>
            <span>total(execution)</span>
            <span>total(mutation)</span>
            <span>total(aliasing)</span>
          </div>
          <div className="frame-pivot">turn</div>
          <div className="frame-column return">
            <p>Results return</p>
            <span>10</span>
            <span>8 + 10 + 7 = 25</span>
            <span>5 + 12 + 25 = 42</span>
          </div>
        </div>
        <p>
          Five nodes are visited, but only three traversal frames are active at
          the deepest moment. Total work follows node count; stack use follows
          tree height.
        </p>
      </section>

      <section className="reader-section proof-section">
        <span className="margin-label">Justify</span>
        <h2>The data, code, and proof share one shape</h2>
        <div className="proof-triptych">
          <article>
            <span>Data</span>
            <strong>Tree definition</strong>
            <p>One note plus zero or more smaller note trees.</p>
          </article>
          <i>→</i>
          <article>
            <span>Code</span>
            <strong>Recursive call</strong>
            <p>Root minutes plus the returned total of every child tree.</p>
          </article>
          <i>→</i>
          <article>
            <span>Proof</span>
            <strong>Structural induction</strong>
            <p>Assume each child result is correct; prove their combination is correct.</p>
          </article>
        </div>
        <div className="two-claims">
          <div>
            <strong>Termination</strong>
            <p>
              The node-count measure strictly decreases for every child
              subtree of a finite tree.
            </p>
          </div>
          <div>
            <strong>Partial correctness</strong>
            <p>
              If child calls return correct subtree totals, adding them to the
              root minutes returns the mathematical total.
            </p>
          </div>
        </div>
      </section>

      <section className="reader-section">
        <span className="margin-label">Challenge</span>
        <h2>A tree-shaped field does not guarantee a tree</h2>
        <p>
          Python objects can share children or form cycles. If two parents
          reference one note, should Atlas count one domain entity once or one
          occurrence per path? Adding a <code>visited</code> set makes execution
          terminate, but cannot choose that meaning for us.
        </p>
        <div className="cycle-visual" aria-label="Two nodes forming a cycle">
          <div>A</div>
          <span>depends on</span>
          <div>B</div>
          <i>↺</i>
        </div>
        <div className="callout">
          <strong>Architecture before patching</strong>
          <p>
            First choose a tree or graph contract. Then align representation,
            algorithm, proof, tests, and cost with that decision.
          </p>
        </div>
      </section>

      <section className="reader-section studio-section">
        <span className="margin-label">Studio</span>
        <h2>Read in dependency order</h2>
        <ol>
          <li>Recover the <code>Note</code> domain and construction invariant.</li>
          <li>Trace the public traversal operation down and back up.</li>
          <li>Mark effects, shared state, and input-domain assumptions.</li>
          <li>Write the termination measure and induction hypothesis.</li>
          <li>Direct an agent to add one bounded <code>TreeSummary</code> feature.</li>
          <li>Challenge the patch with a deep chain, shared node, and repeat call.</li>
          <li>Defend time, stack, and semantic claims separately.</li>
        </ol>
      </section>

      <section className="reader-section">
        <span className="margin-label">Quick check</span>
        <h2>Commit to a claim before opening the answer</h2>
        <p>
          State an answer and confidence—unsure, reasoned, or teach-it—before
          expanding each explanation.
        </p>
        <div className="mini-checks">
          {checks.map((check, index) => (
            <details key={check.prompt}>
              <summary>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {check.prompt}
              </summary>
              <p>{check.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="reader-section">
        <span className="margin-label">Carry forward</span>
        <h2>Recursion is a bridge, not a destination</h2>
        <div className="connection-list">
          <div>
            <span>Module 3</span>
            <p>Clients depend on traversal behavior without depending on the note representation.</p>
          </div>
          <div>
            <span>Module 4</span>
            <p>Induction joins a larger toolkit of logic, relations, graphs, and proof.</p>
          </div>
          <div>
            <span>Module 5</span>
            <p>The call tree becomes a recurrence for time and stack cost.</p>
          </div>
          <div>
            <span>Module 10</span>
            <p>Shared nodes and cycles require graph semantics and visited state.</p>
          </div>
          <div>
            <span>Module 23</span>
            <p>Syntax trees and interpreters reuse recursive definitions and environments.</p>
          </div>
        </div>
      </section>

      <footer className="reader-footer module-reader-actions">
        <button className="text-action" onClick={onBack}>
          Back to the foundation
        </button>
        <button className="primary-action" onClick={onDiagnostic}>
          Check the wider foundation <span aria-hidden="true">→</span>
        </button>
      </footer>
    </article>
  );
}
