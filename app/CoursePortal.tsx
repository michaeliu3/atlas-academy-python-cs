"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
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
  | "diagnostic";
type Confidence = "low" | "medium" | "high";

type Question = {
  category: string;
  prompt: string;
  code?: string;
  options: string[];
  answer: number;
  explanation: string;
  misconception: string;
  connection: string;
};

const questions: Question[] = [
  {
    category: "State & aliasing",
    prompt: "What does this program print?",
    code: `a = [[0], [1]]
b = a[:]
b[0].append(2)
b[1] = [9]
print(a)
print(b)`,
    options: [
      "[[0], [1]] then [[0, 2], [9]]",
      "[[0, 2], [1]] then [[0, 2], [9]]",
      "[[0, 2], [9]] then [[0, 2], [9]]",
      "It raises an exception because nested lists cannot be copied",
    ],
    answer: 1,
    explanation:
      "The slice creates a new outer list, but both outer lists still reference the same inner lists. Appending mutates the shared first inner list. Reassigning b[1] changes only the second slot of b.",
    misconception:
      "A shallow copy makes the outer container independent; it does not recursively duplicate nested objects.",
    connection:
      "This same ownership question later governs hash keys, transaction boundaries, and concurrency safety.",
  },
  {
    category: "Functions & state",
    prompt: "Why can a mutable default argument create order-dependent behavior?",
    code: `def collect(value, bucket=[]):
    bucket.append(value)
    return bucket`,
    options: [
      "Python randomly chooses a default on every call",
      "The default object is created once and reused by calls that omit bucket",
      "Lists are copied only on even-numbered calls",
      "Function parameters are global variables",
    ],
    answer: 1,
    explanation:
      "The default expression is evaluated when the function is defined. Later calls bind bucket to that same list unless a caller supplies another object.",
    misconception:
      "A function call creates new parameter bindings, but it does not recreate objects captured in its defaults.",
    connection:
      "Hidden shared state is a common cause of flaky tests, cache contamination, and unsafe service handlers.",
  },
  {
    category: "Iteration",
    prompt: "After next(items) returns 10, what do the two list calls produce?",
    code: `items = iter([10, 20, 30])
print(next(items))
print(list(items))
print(list(items))`,
    options: [
      "[10, 20, 30] and [10, 20, 30]",
      "[20, 30] and [20, 30]",
      "[20, 30] and []",
      "[] and []",
    ],
    answer: 2,
    explanation:
      "An iterator carries traversal state. The first list call consumes the remaining elements; the second sees an exhausted iterator.",
    misconception:
      "An iterable can usually create a fresh iterator. An iterator itself is a one-pass stateful object.",
    connection:
      "The distinction becomes essential in streaming pipelines, generators, async streams, and database cursors.",
  },
  {
    category: "Data model",
    prompt: "Which statement best describes the equality–hashing contract?",
    options: [
      "Equal objects must have equal hashes while they are used as keys",
      "Objects with equal hashes must always be equal",
      "Every mutable object should define a hash",
      "Identity and equality are required to be the same",
    ],
    answer: 0,
    explanation:
      "If a == b, then hash(a) must equal hash(b). The reverse is not required because collisions are possible. A key's hash-relevant state must not change while stored.",
    misconception:
      "Hashing narrows the search; equality resolves collisions. Hash equality alone does not establish value equality.",
    connection:
      "This contract is the bridge from Python's object model to hash-table correctness and adversarial-input analysis.",
  },
  {
    category: "Algorithms",
    prompt:
      "A nested scan compares every unordered pair in a list of n items. What is the tight growth rate?",
    options: ["Θ(log n)", "Θ(n)", "Θ(n log n)", "Θ(n²)"],
    answer: 3,
    explanation:
      "There are n(n−1)/2 unordered pairs. Constant factors disappear asymptotically, leaving quadratic growth.",
    misconception:
      "Two loops are not automatically quadratic, but these loop bounds collectively enumerate a quadratic number of pairs.",
    connection:
      "If the goal is only duplicate detection, a hash set can trade additional memory for expected linear-time scanning.",
  },
  {
    category: "Correctness",
    prompt:
      "Which loop invariant best supports a left-to-right maximum scan?",
    options: [
      "The current maximum equals the final answer before the loop begins",
      "After processing position i, current_max is the maximum of the processed prefix",
      "Every unprocessed value is smaller than current_max",
      "The list is sorted after each iteration",
    ],
    answer: 1,
    explanation:
      "The invariant describes what is known after each prefix. Initialization, preservation, and termination then connect the local claim to the final result.",
    misconception:
      "A useful invariant must be true initially and preserved; it cannot assume facts about unexamined data.",
    connection:
      "Invariants later describe data structures, transactions, protocols, and safe concurrent state.",
  },
  {
    category: "Persistence",
    prompt:
      "A quiz update writes the score, then crashes before writing mastery status. Which property was missing?",
    options: [
      "Caching: every value should remain in memory",
      "Atomicity: the combined update should happen entirely or not at all",
      "Compression: both values should occupy fewer bytes",
      "Parallelism: both writes should run on different CPUs",
    ],
    answer: 1,
    explanation:
      "The two writes represent one logical state transition. Atomicity prevents other states from observing a half-completed transition.",
    misconception:
      "Faster or simultaneous writes do not make the combined operation indivisible.",
    connection:
      "The state-transition model from Python becomes the transaction model in databases.",
  },
  {
    category: "Concurrency",
    prompt: "How can two correct workers lose an increment?",
    code: `counter = counter + 1`,
    options: [
      "Integers occasionally forget their value",
      "Both workers can read the same old value and then overwrite each other",
      "Addition is undefined in concurrent programs",
      "The operating system always executes the statement twice",
    ],
    answer: 1,
    explanation:
      "The statement contains a read, computation, and write. Their steps can interleave: both workers read 10, both compute 11, and both write 11.",
    misconception:
      "A source-code line is not automatically one indivisible machine or runtime operation.",
    connection:
      "Concurrency reasoning extends ordinary state traces by considering multiple valid interleavings.",
  },
  {
    category: "Networks",
    prompt: "Why is automatically retrying a timed-out request sometimes unsafe?",
    options: [
      "A timeout proves the server did nothing",
      "The first request may have succeeded even though its response was lost",
      "Networks never permit the same request twice",
      "Retries always corrupt transmitted bytes",
    ],
    answer: 1,
    explanation:
      "The client knows it did not receive a response; it does not necessarily know whether the server applied the operation. A retry can duplicate a payment or message.",
    misconception:
      "Failure to observe success is not proof of failure. Distributed systems must represent uncertainty.",
    connection:
      "Idempotency keys and operation design make retries safe under partial failure.",
  },
  {
    category: "Debugging & architecture",
    prompt:
      "A report class uses a class-level cache, live HTTP calls, and a bare except that returns None. What is the best first debugging move?",
    options: [
      "Rewrite the class with more design patterns",
      "Add random print statements throughout the project",
      "Define one failing behavior and isolate it with a controlled dependency",
      "Catch even more exceptions so the program cannot fail",
    ],
    answer: 2,
    explanation:
      "A precise failing claim plus a controlled HTTP dependency separates observation from guesswork. It also reveals whether shared cache state affects test order.",
    misconception:
      "Architecture changes before diagnosis can erase evidence and introduce new causes.",
    connection:
      "This investigation pattern scales from a function to a service: claim, boundary, observation, minimal repair, regression evidence.",
  },
];

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
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [confidences, setConfidences] = useState<
    Record<number, Confidence>
  >({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});

  const score = useMemo(
    () =>
      questions.reduce(
        (total, question, index) =>
          total + (answers[index] === question.answer ? 1 : 0),
        0,
      ),
    [answers],
  );

  const reviewCategories = useMemo(
    () =>
      Array.from(
        new Set(
          questions
            .map((question, index) => ({ question, index }))
            .filter(
              ({ question, index }) =>
                answers[index] !== question.answer ||
                confidences[index] === "low",
            )
            .map(({ question }) => question.category),
        ),
      ),
    [answers, confidences],
  );

  const navigate = (next: View) => {
    setView(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetDiagnostic = () => {
    setQuestionIndex(0);
    setAnswers({});
    setConfidences({});
    setRevealed({});
  };

  return (
    <main>
      <header className="site-header">
        <button className="brand" onClick={() => navigate("path")}>
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
          <button
            className={view === "path" ? "active" : ""}
            onClick={() => navigate("path")}
          >
            Learning path
          </button>
          <button
            className={view === "foundation" ? "active" : ""}
            onClick={() => navigate("foundation")}
          >
            Foundation
          </button>
          <button
            className={view === "module" ? "active" : ""}
            onClick={() => navigate("module")}
          >
            Module 1
          </button>
          <button
            className={view === "module2" ? "active" : ""}
            onClick={() => navigate("module2")}
          >
            Module 2
          </button>
          <button
            className={view === "arc2" ? "active" : ""}
            onClick={() => navigate("arc2")}
          >
            Data structures
          </button>
          <button
            className={view === "arc3" ? "active" : ""}
            onClick={() => navigate("arc3")}
          >
            Durable software
          </button>
          <button
            className={view === "diagnostic" ? "active" : ""}
            onClick={() => navigate("diagnostic")}
          >
            Diagnostic
          </button>
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
              <button
                className="primary-action"
                onClick={() => navigate("diagnostic")}
              >
                Begin the diagnostic <span aria-hidden="true">→</span>
              </button>
              <button
                className="text-action"
                onClick={() => navigate("foundation")}
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
              Ten multiple-choice questions use carefully designed distractors
              and confidence ratings to reveal the mental model behind each
              answer. Every choice teaches.
            </p>
            <button
              className="primary-action"
              onClick={() => navigate("diagnostic")}
            >
              Start now <span aria-hidden="true">→</span>
            </button>
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
            <pre>
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
            >
              Continue to Module 2 <span aria-hidden="true">→</span>
            </button>
          </footer>
        </article>
      )}

      {view === "module2" && (
        <ModuleTwoReader
          onBack={() => navigate("foundation")}
          onDiagnostic={() => navigate("diagnostic")}
        />
      )}

      {view === "arc2" && (
        <ArcTwoStudio
          onOpenFoundation={() => navigate("foundation")}
          onOpenDiagnostic={() => navigate("diagnostic")}
        />
      )}

      {view === "arc3" && (
        <ArcThreeStudio
          onOpenDataStructures={() => navigate("arc2")}
          onOpenDiagnostic={() => navigate("diagnostic")}
        />
      )}

      {view === "diagnostic" && (
        <section className="diagnostic-shell">
          <header className="diagnostic-header">
            <div>
              <p className="kicker">Placement studio · 10 questions</p>
              <h1>Quick to answer. Built to reveal how you think.</h1>
              <p>
                Choose an answer and your confidence. The explanation diagnoses
                the mental model—not just whether the letter was correct.
              </p>
            </div>
            <div className="diagnostic-principle">
              <strong>No penalty for uncertainty.</strong>
              <span>
                A low-confidence correct answer tells us something different
                from a high-confidence misconception.
              </span>
            </div>
          </header>

          <div className="progress-track" aria-label="Diagnostic progress">
            <span
              style={{
                width: `${Math.min(questionIndex, questions.length) / questions.length * 100}%`,
              }}
            />
          </div>

          {questionIndex < questions.length ? (
            (() => {
              const question = questions[questionIndex];
              const selected = answers[questionIndex];
              const confidence = confidences[questionIndex];
              const isRevealed = revealed[questionIndex];
              const isCorrect = selected === question.answer;

              return (
                <div className="question-card">
                  <div className="question-meta">
                    <span>
                      Question {questionIndex + 1} of {questions.length}
                    </span>
                    <span>{question.category}</span>
                  </div>
                  <h2>{question.prompt}</h2>
                  {question.code && (
                    <pre>
                      <code>{question.code}</code>
                    </pre>
                  )}
                  <div className="options" role="radiogroup">
                    {question.options.map((option, index) => {
                      const optionCorrect = index === question.answer;
                      const chosen = selected === index;
                      const feedbackClass = isRevealed
                        ? optionCorrect
                          ? "correct"
                          : chosen
                            ? "incorrect"
                            : ""
                        : "";
                      return (
                        <button
                          key={option}
                          className={`${chosen ? "selected" : ""} ${feedbackClass}`}
                          onClick={() =>
                            !isRevealed &&
                            setAnswers((previous) => ({
                              ...previous,
                              [questionIndex]: index,
                            }))
                          }
                          role="radio"
                          aria-checked={chosen}
                          disabled={isRevealed}
                        >
                          <span>{String.fromCharCode(65 + index)}</span>
                          {option}
                        </button>
                      );
                    })}
                  </div>

                  {!isRevealed && (
                    <div className="confidence-row">
                      <span>How confident are you?</span>
                      {(["low", "medium", "high"] as Confidence[]).map(
                        (level) => (
                          <button
                            key={level}
                            className={confidence === level ? "selected" : ""}
                            onClick={() =>
                              setConfidences((previous) => ({
                                ...previous,
                                [questionIndex]: level,
                              }))
                            }
                          >
                            {level}
                          </button>
                        ),
                      )}
                    </div>
                  )}

                  {isRevealed ? (
                    <div
                      className={`answer-panel ${isCorrect ? "correct-panel" : "review-panel"}`}
                    >
                      <div className="answer-verdict">
                        <strong>
                          {isCorrect
                            ? "Your model holds here."
                            : "This reveals a useful gap."}
                        </strong>
                        <span>Confidence: {confidence}</span>
                      </div>
                      <p>{question.explanation}</p>
                      <dl>
                        <div>
                          <dt>Important distinction</dt>
                          <dd>{question.misconception}</dd>
                        </div>
                        <div>
                          <dt>Why it matters later</dt>
                          <dd>{question.connection}</dd>
                        </div>
                      </dl>
                    </div>
                  ) : (
                    <button
                      className="primary-action reveal-button"
                      disabled={selected === undefined || !confidence}
                      onClick={() =>
                        setRevealed((previous) => ({
                          ...previous,
                          [questionIndex]: true,
                        }))
                      }
                    >
                      Reveal the model
                    </button>
                  )}

                  <div className="question-nav">
                    <button
                      disabled={questionIndex === 0}
                      onClick={() => setQuestionIndex((index) => index - 1)}
                    >
                      ← Previous
                    </button>
                    <button
                      disabled={!isRevealed}
                      onClick={() => setQuestionIndex((index) => index + 1)}
                    >
                      {questionIndex === questions.length - 1
                        ? "See synthesis →"
                        : "Next question →"}
                    </button>
                  </div>
                </div>
              );
            })()
          ) : (
            <div className="results-card">
              <p className="kicker">Diagnostic synthesis</p>
              <h2>
                {score} of {questions.length} mental models held.
              </h2>
              <p>
                The number is only the surface. Your confidence pattern and the
                categories below determine where explanation or retrieval will
                help most.
              </p>
              <div className="result-scale">
                <span style={{ width: `${score / questions.length * 100}%` }} />
              </div>
              <div className="result-grid">
                <div>
                  <strong>Ready to build on</strong>
                  <p>
                    Categories answered correctly with medium or high confidence
                    can move quickly into transfer problems.
                  </p>
                </div>
                <div>
                  <strong>Review with a counterexample</strong>
                  {reviewCategories.length ? (
                    <ul>
                      {reviewCategories.map((category) => (
                        <li key={category}>{category}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>No immediate categories flagged. We will verify through code reading.</p>
                  )}
                </div>
              </div>
              <div className="callout">
                <strong>What happens next</strong>
                <p>
                  The instructor uses these signals to compress familiar
                  foundations and select targeted code-reading or explanation
                  work. There is no remedial punishment and no exam ranking.
                </p>
              </div>
              <div className="results-actions">
                <button className="text-action" onClick={resetDiagnostic}>
                  Retake diagnostic
                </button>
                <button
                  className="primary-action"
                  onClick={() => navigate("module")}
                >
                  Enter Module 1 →
                </button>
              </div>
            </div>
          )}
        </section>
      )}

      <footer className="site-footer">
        <span>Atlas Academy</span>
        <p>Understand deeply. Design clearly. Verify relentlessly.</p>
      </footer>
    </main>
  );
}
