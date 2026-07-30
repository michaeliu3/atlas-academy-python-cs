"use client";

import Link from "next/link";
import { useState } from "react";
import { ArcFourStudio } from "./ArcFourStudio";
import { ArcThreeStudio } from "./ArcThreeStudio";
import { ArcTwoStudio } from "./ArcTwoStudio";
import { FoundationBlock } from "./FoundationBlock";
import { ModuleTwoReader } from "./ModuleTwoReader";

type View =
  | "path"
  | "foundation"
  | "module"
  | "module2"
  | "arc2"
  | "arc3"
  | "arc4";

const viewLabels: Record<View, string> = {
  path: "Learning path",
  foundation: "Foundation",
  module: "Module 1",
  module2: "Module 2",
  arc2: "Data structures",
  arc3: "Durable software",
  arc4: "Machine and network",
};

const arcs = [
  {
    number: "I",
    title: "Computation & reasoning",
    range: "Modules 0–5",
    description:
      "State, functions, recursion, abstraction, proof, probability, and cost models.",
    accent: "saffron",
  },
  {
    number: "II",
    title: "Data & algorithms",
    range: "Modules 6–11",
    description:
      "Representation, collections, hashing, trees, graphs, and algorithm design.",
    accent: "cobalt",
  },
  {
    number: "III",
    title: "Durable software",
    range: "Modules 12–16",
    description:
      "APIs, types, tests, architecture, packaging, databases, and transactions.",
    accent: "plum",
  },
  {
    number: "IV",
    title: "Machine & network",
    range: "Modules 17–22",
    description:
      "Architecture, operating systems, concurrency, networks, distribution, and security.",
    accent: "moss",
  },
  {
    number: "V",
    title: "Languages & intelligence",
    range: "Modules 23–26",
    description:
      "Interpreters, CPython, performance, intelligent systems, and capstone defense.",
    accent: "rose",
  },
];

export function CoursePortal() {
  const [view, setView] = useState<View>("path");
  const currentViewLabel = viewLabels[view];

  const navigate = (next: View) => {
    setView(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <main id="main-content" tabIndex={-1}>
      <p
        aria-live="polite"
        className="portal-view-status"
        role="status"
      >
        {currentViewLabel} selected.
      </p>
      <header className="site-header">
        <button
          aria-label="Show learning path"
          className="brand"
          onClick={() => navigate("path")}
          type="button"
        >
          <span className="brand-mark">A</span>
          <span>
            <strong>Atlas Academy</strong>
            <small>Python & computer science</small>
          </span>
        </button>
        <nav aria-label="Course navigation">
          <Link className="header-link" href="/modules">
            Course library
          </Link>
          <Link className="header-link" href="/route">
            60-day route
          </Link>
          <button
            aria-pressed={view === "path"}
            className={view === "path" ? "active" : ""}
            onClick={() => navigate("path")}
            type="button"
          >
            Learning path
          </button>
          <button
            aria-pressed={view === "foundation"}
            className={view === "foundation" ? "active" : ""}
            onClick={() => navigate("foundation")}
            type="button"
          >
            Foundation
          </button>
          <button
            aria-pressed={view === "module"}
            className={view === "module" ? "active" : ""}
            onClick={() => navigate("module")}
            type="button"
          >
            Module 1
          </button>
          <button
            aria-pressed={view === "module2"}
            className={view === "module2" ? "active" : ""}
            onClick={() => navigate("module2")}
            type="button"
          >
            Module 2
          </button>
          <button
            aria-pressed={view === "arc2"}
            className={view === "arc2" ? "active" : ""}
            onClick={() => navigate("arc2")}
            type="button"
          >
            Data structures
          </button>
          <button
            aria-pressed={view === "arc3"}
            className={view === "arc3" ? "active" : ""}
            onClick={() => navigate("arc3")}
            type="button"
          >
            Durable software
          </button>
          <button
            aria-pressed={view === "arc4"}
            className={view === "arc4" ? "active" : ""}
            onClick={() => navigate("arc4")}
            type="button"
          >
            Machine & network
          </button>
          <Link className="header-link" href="/diagnostic">
            Diagnostic
          </Link>
        </nav>
      </header>

      {view === "path" && (
        <>
          <section className="hero">
            <div className="eyebrow">A connected, AI-native CS education</div>
            <h1>
              Learn to see the
              <em> whole system.</em>
            </h1>
            <p className="hero-copy">
              Advanced computer science taught through Python—designed around
              understanding, architecture, debugging, creation, and the
              judgment to direct intelligent agents.
            </p>
            <div className="hero-actions">
              <Link className="primary-action" href="/diagnostic">
                Begin the diagnostic <span aria-hidden="true">→</span>
              </Link>
              <Link className="text-action" href="/route">
                See the 60-day route
              </Link>
              <button
                className="text-action"
                onClick={() => navigate("foundation")}
                type="button"
              >
                Explore the foundation
              </button>
            </div>
            <div className="hero-note">
              <span>Not exam-oriented</span>
              <span>Comprehension before production</span>
              <span>One cumulative system</span>
            </div>
          </section>

          <section className="spine-section">
            <div className="section-heading">
              <span className="section-number">01</span>
              <div>
                <p className="kicker">The knowledge spine</p>
                <h2>One model, increasing resolution</h2>
              </div>
            </div>
            <p className="section-intro">
              Every arc reuses the same questions: What is represented? What
              changes? What is the contract? Why is it correct? What does it
              cost? What can fail—and who is affected?
            </p>
            <div className="arc-flow">
              {arcs.map((arc, index) => (
                <article className={`arc-card ${arc.accent}`} key={arc.number}>
                  <div className="arc-topline">
                    <span className="arc-number">{arc.number}</span>
                    <span className="arc-range">{arc.range}</span>
                  </div>
                  <h3>{arc.title}</h3>
                  <p>{arc.description}</p>
                  {index < arcs.length - 1 && (
                    <span className="arc-arrow" aria-hidden="true">
                      →
                    </span>
                  )}
                </article>
              ))}
            </div>
          </section>

          <section className="atlas-section">
            <div className="atlas-copy">
              <p className="kicker">The cumulative application</p>
              <h2>Atlas grows as your mental model grows.</h2>
              <p>
                A local learning-event stream becomes a searchable, durable,
                concurrent, networked, secure knowledge system. New concepts
                alter the same architecture, so no module floats alone.
              </p>
            </div>
            <div className="atlas-orbit" aria-label="Atlas capability growth">
              <div className="orbit-center">
                <span>ATLAS</span>
                <small>one living system</small>
              </div>
              <span className="orbit-item item-one">events</span>
              <span className="orbit-item item-two">index</span>
              <span className="orbit-item item-three">database</span>
              <span className="orbit-item item-four">API</span>
              <span className="orbit-item item-five">security</span>
              <span className="orbit-item item-six">intelligence</span>
            </div>
          </section>

          <section className="method-section">
            <div className="section-heading">
              <span className="section-number">02</span>
              <div>
                <p className="kicker">How learning works</p>
                <h2>Less typing. More ownership.</h2>
              </div>
            </div>
            <div className="method-grid">
              {[
                ["Read", "Trace unfamiliar code from public contract to state."],
                ["Map", "Recover components, dependencies, and trust boundaries."],
                ["Debug", "Replace guesses with observations and falsifiable claims."],
                ["Design", "Compare representations, interfaces, and tradeoffs."],
                ["Direct", "Give agents bounded tasks and explicit acceptance evidence."],
                ["Verify", "Challenge patches, test failures, and defend the result."],
              ].map(([title, description], index) => (
                <article key={title}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="closing-panel">
            <p className="kicker">Your first step</p>
            <h2>Fast answers. Deep diagnosis.</h2>
            <p>
              Twenty multiple-choice investigations pair carefully designed
              distractors with confidence evidence. Each choice explains the
              mental model it reveals and routes you to the exact lesson that
              will strengthen it.
            </p>
            <Link className="primary-action" href="/diagnostic">
              Start now <span aria-hidden="true">→</span>
            </Link>
          </section>
        </>
      )}

      {view === "foundation" && (
        <FoundationBlock
          onOpenModuleOne={() => navigate("module")}
          onOpenModuleTwo={() => navigate("module2")}
        />
      )}

      {view === "module" && (
        <article className="reader">
          <header className="reader-hero">
            <p className="kicker">Module 1 · Computation & reasoning</p>
            <h1>Values, state, and execution</h1>
            <p>
              Before algorithms, databases, or concurrency, we need a precise
              answer to one deceptively simple question:{" "}
              <strong>what changes when Python runs a statement?</strong>
            </p>
          </header>

          <aside className="reader-map">
            <span>source</span>
            <i>→</i>
            <span>evaluation</span>
            <i>→</i>
            <span>bindings</span>
            <i>→</i>
            <span>objects</span>
            <i>→</i>
            <span>state</span>
            <i>→</i>
            <span>invariants</span>
          </aside>

          <section className="reader-section">
            <span className="margin-label">The problem</span>
            <h2>The historical record that changes itself</h2>
            <p>
              Atlas records study events. A prototype reuses lists and
              dictionaries across records. Later edits mysteriously change
              history, and tests pass or fail depending on order.
            </p>
            <div className="callout question-callout">
              <strong>Driving question</strong>
              <p>
                What exists while a program runs, what can change, and how can
                we state what must remain true?
              </p>
            </div>
          </section>

          <section className="reader-section">
            <span className="margin-label">First principles</span>
            <h2>Five ideas are enough to begin</h2>
            <div className="definition-grid">
              {[
                ["Object", "A runtime entity with identity, type, and state."],
                ["Value", "The abstract information an object represents."],
                ["Name", "An identifier used to refer to an object."],
                ["Binding", "The association from a name to an object."],
                ["Transition", "A change from one observable state to another."],
              ].map(([term, definition]) => (
                <div key={term}>
                  <strong>{term}</strong>
                  <p>{definition}</p>
                </div>
              ))}
            </div>
            <p className="plain-precise">
              <span>
                <strong>Plain language:</strong> a name is a label that points
                to an object.
              </span>
              <span>
                <strong>Precise model:</strong> a name is resolved in an
                environment to a binding whose value is an object reference.
              </span>
            </p>
          </section>

          <section className="reader-section">
            <span className="margin-label">Observe</span>
            <h2>Draw before running</h2>
            <pre aria-label="Scrollable Python state-trace example" tabIndex={0}>
              <code>{`original = {"tags": ["python"]}
history = [original]
current = original
current["tags"].append("algorithms")
current = {"tags": ["databases"]}`}</code>
            </pre>
            <div className="object-graph" aria-label="Object binding diagram">
              <div className="names-column">
                <span>original</span>
                <span>current</span>
                <span>history</span>
              </div>
              <div className="binding-lines">
                <span>→</span>
                <span>↗</span>
                <span>↘</span>
              </div>
              <div className="object-node">
                <strong>dictionary object</strong>
                <span>tags</span>
                <i>→</i>
                <em>[python, algorithms]</em>
              </div>
            </div>
            <p>
              Appending mutates the shared tags list. Reassigning{" "}
              <code>current</code> later changes one binding; it does not repair
              the objects already reachable through <code>history</code>.
            </p>
          </section>

          <section className="reader-section">
            <span className="margin-label">Connect</span>
            <h2>This small model scales surprisingly far</h2>
            <div className="connection-list">
              <div>
                <span>Module 3</span>
                <p>Object invariants become representation invariants in ADTs.</p>
              </div>
              <div>
                <span>Module 8</span>
                <p>Equality and mutation determine whether hashing is safe.</p>
              </div>
              <div>
                <span>Module 16</span>
                <p>State transitions become database transactions.</p>
              </div>
              <div>
                <span>Module 19</span>
                <p>Shared mutation becomes a concurrency race.</p>
              </div>
              <div>
                <span>Module 23</span>
                <p>Environments become data structures inside an interpreter.</p>
              </div>
            </div>
          </section>

          <section className="reader-section studio-section">
            <span className="margin-label">Studio</span>
            <h2>Read, investigate, then direct</h2>
            <ol>
              <li>Compare three event-log implementations.</li>
              <li>Locate public contracts, state, and every side effect.</li>
              <li>Draw one concrete object graph.</li>
              <li>Predict a failure before running tests.</li>
              <li>Write a bounded repair task for an agent.</li>
              <li>Review the patch and identify one unproven claim.</li>
            </ol>
            <div className="callout">
              <strong>Mastery is ownership</strong>
              <p>
                You advance when you can explain unfamiliar code, diagnose the
                hidden alias, specify the repair, review the change, and defend
                the evidence—not when you have typed the most lines.
              </p>
            </div>
          </section>

          <footer className="reader-footer">
            <button
              className="primary-action"
              onClick={() => navigate("module2")}
              type="button"
            >
              Continue to Module 2 <span aria-hidden="true">→</span>
            </button>
          </footer>
        </article>
      )}

      {view === "module2" && (
        <ModuleTwoReader
          onBack={() => navigate("foundation")}
          onDiagnostic={() => window.location.assign("/diagnostic")}
        />
      )}

      {view === "arc2" && (
        <ArcTwoStudio
          onOpenFoundation={() => navigate("foundation")}
          onOpenDiagnostic={() => window.location.assign("/diagnostic")}
        />
      )}

      {view === "arc3" && (
        <ArcThreeStudio
          onOpenDataStructures={() => navigate("arc2")}
          onOpenDiagnostic={() => window.location.assign("/diagnostic")}
        />
      )}

      {view === "arc4" && (
        <ArcFourStudio onOpenDurableSoftware={() => navigate("arc3")} />
      )}

      <footer className="site-footer">
        <span>Atlas Academy</span>
        <p>Understand deeply. Design clearly. Verify relentlessly.</p>
      </footer>
      </main>
    </>
  );
}
