"use client";

import { useState } from "react";

type ArcThreeStudioProps = {
  onOpenDataStructures: () => void;
  onOpenDiagnostic: () => void;
};

type Accent = "plum" | "cobalt" | "moss" | "saffron" | "rose";

const stages: Array<{
  module: string;
  verb: string;
  title: string;
  pressure: string;
  model: string;
  invariant: string;
  evidence: string;
  handoff: string;
  accent: Accent;
}> = [
  {
    module: "12",
    verb: "Separate",
    title: "Typed component boundaries",
    pressure:
      "Concrete imports, selection rules, and representations spread through callers.",
    model:
      "Public API + structural port + inward dependency direction + outer composition root.",
    invariant:
      "Domain and application policy never import a concrete plugin or deployment choice.",
    evidence:
      "Import-state trace, API dossier, dependency graph, fresh-process imports, and adversarial plugin output.",
    handoff:
      "The boundary has a shape, but blank rows, partial yields, failures, and trust still need behavioral ownership.",
    accent: "plum",
  },
  {
    module: "13",
    verb: "Specify",
    title: "Claims and failure evidence",
    pressure:
      "Two providers match the same Protocol while disagreeing about observable behavior.",
    model:
      "Declarative specification → input partitions → layered tests → causal debugging → privacy-aware signals.",
    invariant:
      "One import attempt has one run identity, explicit failure semantics, and no raw private content in its signals.",
    evidence:
      "Shared contract suite, minimal reproduction, hypothesis log, regression, captured events, and field review.",
    handoff:
      "Evidence can protect behavior, but construction, control flow, and reasons to change are still coupled.",
    accent: "cobalt",
  },
  {
    module: "14",
    verb: "Change",
    title: "Architecture under pressure",
    pressure:
      "A small change edits parsing, retry, ranking, compatibility output, construction, and tests at once.",
    model:
      "PlannerService + immutable PlanSnapshot + distinct BatchEventLoader + LegacyPlanFacade + explicit composition.",
    invariant:
      "Every structural change names preserved observations, one owner, and a rollback route.",
    evidence:
      "Before/after architecture, characterization tests, coherent commit graph, reviewed diff, and bisect predicate.",
    handoff:
      "The planning path is understandable and changeable, but learning events and executable behavior still die with the process or checkout.",
    accent: "moss",
  },
  {
    module: "15",
    verb: "Deliver",
    title: "Versioned artifacts",
    pressure:
      "Objects vanish at process exit, old data outlives classes, and source-checkout success is not installation.",
    model:
      "Object → schema → text → bytes → file, then source → sdist → wheel → clean installation.",
    invariant:
      "External formats declare versions; built metadata, contents, entry point, and compatibility match the release claim.",
    evidence:
      "Golden migrations, corrupt fixtures, interruption timeline, artifact inventory, digest, and clean-environment CLI run.",
    handoff:
      "A validated versioned bundle can survive and move, but relationships and competing multi-record updates expose its limits.",
    accent: "saffron",
  },
  {
    module: "16",
    verb: "Commit",
    title: "Relational transactions",
    pressure:
      "Redundant records, multi-step invariants, concurrent readers/writers, and crashes make whole-file updates unsafe.",
    model:
      "ImportValidatedBundle + new EventRepository port + relations + constraints + justified access paths + transaction boundary.",
    invariant:
      "A successful import exposes its run and events together; a failed import exposes neither as committed work.",
    evidence:
      "Normalization argument, constraint probes, saved plans, two-connection schedule, failure injection, and recovery assumptions.",
    handoff:
      "The local durable contract is ready for the wider machine, process, concurrency, and network fault models of Arc IV.",
    accent: "rose",
  },
];

const importRun = [
  {
    label: "Select",
    owner: "PluginCatalog",
    known: "Exactly one importer supports the source under API version 1.",
    failure: "No match, ambiguous match, invalid version, or non-boolean support claim.",
    evidence: "Registration and deterministic-selection contract tests.",
  },
  {
    label: "Parse",
    owner: "EventImporter",
    known: "Rows are visited in source order under an explicit partial-yield policy.",
    failure: "Malformed late row, duplicate identity, invalid domain value, or resource limit.",
    evidence: "Iterator trace, partition table, provider contract suite, and contextual error.",
  },
  {
    label: "Observe",
    owner: "ObservableImportRunner + SignalSink",
    known: "The terminal ImportSignal has one correlation ID and a deliberately bounded field vocabulary.",
    failure: "Duplicate terminal event, lost correlation, swallowed programming error, or private content leak.",
    evidence: "Captured signal sequence, privacy allowlist, and causal regression.",
  },
  {
    label: "Validate",
    owner: "BatchEventLoader + bundle decoder",
    known: "A bounded batch and decoded bundle satisfy their declared invariants before durable mutation.",
    failure: "Invalid confidence, duplicate event, unsupported schema, or exceeded batch policy.",
    evidence: "Domain constructors, independent verifier, boundary cases, and stated memory limit.",
  },
  {
    label: "Commit",
    owner: "ImportValidatedBundle + EventRepository",
    known: "Run metadata and events become visible as one application operation.",
    failure: "Constraint violation, busy/serialization outcome, mid-write error, or uncertain retry.",
    evidence: "Injected rollback, second-connection visibility, idempotency decision, and engine configuration.",
  },
  {
    label: "Deliver",
    owner: "CLI + release process",
    known: "A named artifact exposes a stable command and reports the operation outcome.",
    failure: "Wrong metadata, missing files, incompatible tag, unstable output, or unreviewed dependency.",
    evidence: "Artifact inspection, external digest, clean install, subprocess contract, and rollback artifact.",
  },
];

const evidenceClaims = [
  {
    claim: "The plugin is acceptable.",
    weak: "It has the expected method names.",
    strong:
      "Named static result + API-version check + runtime boundary validation + behavioral contract evidence + trust policy.",
    limit:
      "Even this does not isolate malicious code running in the same process.",
  },
  {
    claim: "The refactor preserved behavior.",
    weak: "Tests are green and the diff looks cleaner.",
    strong:
      "Preserved observations stated first + characterization/contract regressions + improved dependency graph + reviewed change sequence.",
    limit:
      "Finite evidence remains scoped to the named clients, inputs, and environment.",
  },
  {
    claim: "Atlas is installable.",
    weak: "It runs from the repository.",
    strong:
      "Inspected sdist/wheel + matching metadata and entry point + clean-environment installation + CLI contract run.",
    limit:
      "Installability does not establish safety, universal reproducibility, or data compatibility.",
  },
  {
    claim: "The import is atomic.",
    weak: "The code contains a context manager.",
    strong:
      "Application transaction boundary + injected late failure + rollback inspection + second-connection visibility evidence.",
    limit:
      "Durability still depends on the named engine, configuration, filesystem, and storage assumptions.",
  },
];

const checkOptions = [
  "Accept it: three green tools are independent proof of correctness.",
  "Reject it: generated code cannot produce trustworthy evidence.",
  "Map each result to its narrow claim, then test the uncovered runtime, architecture, trust, transaction, and recovery boundaries.",
  "Add more unit tests until the coverage number reaches 100%.",
];

export function ArcThreeStudio({
  onOpenDataStructures,
  onOpenDiagnostic,
}: ArcThreeStudioProps) {
  const [activeStage, setActiveStage] = useState(0);
  const [activeRunStep, setActiveRunStep] = useState(0);
  const [activeClaim, setActiveClaim] = useState(0);
  const [selectedCheck, setSelectedCheck] = useState<number | null>(null);
  const [confidence, setConfidence] = useState<"low" | "medium" | "high" | null>(
    null,
  );
  const [revealed, setRevealed] = useState(false);

  const stage = stages[activeStage];
  const runStep = importRun[activeRunStep];
  const evidence = evidenceClaims[activeClaim];

  return (
    <article className="arc-three">
      <header className="arc-three-hero">
        <div className="arc-three-hero-copy">
          <p className="kicker">Arc III · Modules 12–16</p>
          <h1>
            Correct today.
            <em> Trustworthy tomorrow.</em>
          </h1>
          <p>
            One Atlas import path crosses component, evidence, architecture,
            artifact, and transaction boundaries. Every layer keeps the earlier
            promises—and names the new ways they can fail.
          </p>
        </div>
        <div className="durability-seal" aria-label="Five meanings of durability">
          <span className="seal-ring ring-five">STATE</span>
          <span className="seal-ring ring-four">ARTIFACT</span>
          <span className="seal-ring ring-three">ARCHITECTURE</span>
          <span className="seal-ring ring-two">CHANGE</span>
          <span className="seal-ring ring-one">CONTRACT</span>
          <strong>ATLAS</strong>
        </div>
      </header>

      <section className="arc-three-thesis">
        <p className="display-quote">
          Durable software is not code that merely keeps running. It is a system
          whose <strong>promises remain visible</strong> while implementations,
          environments, and failure modes change.
        </p>
        <div className="durability-equation" aria-label="Arc III pressure chain">
          <span>choice</span>
          <i>→</i>
          <span>contract</span>
          <i>→</i>
          <span>evidence</span>
          <i>→</i>
          <span>change</span>
          <i>→</i>
          <span>artifact</span>
          <i>→</i>
          <span>transaction</span>
        </div>
      </section>

      <section className="pressure-section">
        <div className="section-heading">
          <span className="section-number">01</span>
          <div>
            <p className="kicker">The pressure chain</p>
            <h2>Five modules. One widening boundary.</h2>
          </div>
        </div>

        <div
          className="pressure-rail"
          role="tablist"
          aria-label="Durable software modules"
        >
          {stages.map((item, index) => (
            <button
              aria-selected={activeStage === index}
              className={`${item.accent} ${
                activeStage === index ? "selected" : ""
              }`}
              key={item.module}
              onClick={() => setActiveStage(index)}
              role="tab"
            >
              <span>M{item.module}</span>
              <strong>{item.verb}</strong>
              <small>{item.title}</small>
            </button>
          ))}
        </div>

        <div
          className={`pressure-inspector ${stage.accent}`}
          role="tabpanel"
          aria-live="polite"
        >
          <div className="pressure-module">
            <span>MODULE</span>
            <strong>{stage.module}</strong>
          </div>
          <div className="pressure-story">
            <p className="kicker">{stage.verb}</p>
            <h3>{stage.title}</h3>
            <p>{stage.pressure}</p>
          </div>
          <dl>
            <div>
              <dt>Model derived</dt>
              <dd>{stage.model}</dd>
            </div>
            <div>
              <dt>Invariant retained</dt>
              <dd>{stage.invariant}</dd>
            </div>
            <div>
              <dt>Mastery evidence</dt>
              <dd>{stage.evidence}</dd>
            </div>
            <div>
              <dt>Pressure handed forward</dt>
              <dd>{stage.handoff}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="architecture-section">
        <div className="architecture-copy">
          <p className="kicker">Dependency direction</p>
          <h2>The center states needs. The edges supply mechanisms.</h2>
          <p>
            Runtime calls can move outward while source dependencies point
            inward. The composition root is deliberately concrete: choosing and
            connecting mechanisms is its responsibility.
          </p>
          <div className="architecture-legend">
            <span><i className="legend-core" /> stable policy</span>
            <span><i className="legend-port" /> application-owned port</span>
            <span><i className="legend-adapter" /> replaceable adapter</span>
          </div>
        </div>
        <div
          className="architecture-map"
          aria-label="Atlas dependency architecture"
        >
          <div className="architecture-node root-node">composition roots · M14–M16</div>
          <div className="architecture-node adapter-node cli-node">Bundle CLI · M15</div>
          <div className="architecture-node adapter-node importer-node">
            PipeImporter · v1
          </div>
          <div className="architecture-node adapter-node observer-node">
            MemorySignals / log sink
          </div>
          <div className="architecture-node adapter-node repository-node">
            SQLite adapter · M16
          </div>
          <div className="architecture-node port-node catalog-node">
            EventImporter · RankingPolicy
          </div>
          <div className="architecture-node port-node repo-port-node">
            EventRepository · M16
          </div>
          <div className="architecture-node port-node observer-port-node">
            SignalSink · M13
          </div>
          <div className="architecture-node core-node app-node">
            <span>APPLICATION CORE</span>
            <strong>PluginCatalog · ObservableImportRunner · PlannerService</strong>
            <small>PlanSnapshot · BatchEventLoader · ImportValidatedBundle</small>
          </div>
        </div>
      </section>

      <section className="run-section">
        <div className="section-heading">
          <span className="section-number">02</span>
          <div>
            <p className="kicker">Interactive execution trace</p>
            <h2>Follow one import across every owner.</h2>
          </div>
        </div>
        <p className="section-intro">
          A final symptom is not a cause. Step through the operation and locate
          the earliest boundary whose invariant became false.
        </p>

        <div className="run-rail" role="tablist" aria-label="Import run stages">
          {importRun.map((item, index) => (
            <button
              aria-selected={activeRunStep === index}
              className={activeRunStep === index ? "selected" : ""}
              key={item.label}
              onClick={() => setActiveRunStep(index)}
              role="tab"
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{item.label}</strong>
            </button>
          ))}
        </div>

        <div className="run-inspector" role="tabpanel" aria-live="polite">
          <div className="run-owner">
            <span>OWNER</span>
            <strong>{runStep.owner}</strong>
          </div>
          <div>
            <span className="inspector-label">WHAT MAY BE CLAIMED</span>
            <p>{runStep.known}</p>
          </div>
          <div>
            <span className="inspector-label">EARLIEST FAILURE HERE</span>
            <p>{runStep.failure}</p>
          </div>
          <div>
            <span className="inspector-label">APPROPRIATE EVIDENCE</span>
            <p>{runStep.evidence}</p>
          </div>
        </div>
      </section>

      <section className="evidence-section">
        <div className="evidence-copy">
          <p className="kicker">The evidence discipline</p>
          <h2>Success does not upgrade its own meaning.</h2>
          <p>
            A checker, test, build, install, transaction, and recovery rehearsal
            answer different questions. Select a claim to compare tempting
            evidence with a defensible witness.
          </p>
          <div className="claim-selector" role="tablist" aria-label="Evidence claims">
            {evidenceClaims.map((item, index) => (
              <button
                aria-selected={activeClaim === index}
                className={activeClaim === index ? "selected" : ""}
                key={item.claim}
                onClick={() => setActiveClaim(index)}
                role="tab"
              >
                {String(index + 1).padStart(2, "0")}
              </button>
            ))}
          </div>
        </div>
        <div className="evidence-card" role="tabpanel" aria-live="polite">
          <p className="kicker">Claim {String(activeClaim + 1).padStart(2, "0")}</p>
          <h3>{evidence.claim}</h3>
          <div className="evidence-comparison">
            <div>
              <span>TEMPTING SHORTCUT</span>
              <p>{evidence.weak}</p>
            </div>
            <div>
              <span>DEFENSIBLE EVIDENCE</span>
              <p>{evidence.strong}</p>
            </div>
          </div>
          <div className="evidence-limit">
            <span>BOUNDARY THAT REMAINS</span>
            <p>{evidence.limit}</p>
          </div>
        </div>
      </section>

      <section className="durability-stack-section">
        <div>
          <p className="kicker">The invariant stack</p>
          <h2>When the answer is wrong, diagnose downward.</h2>
          <p>
            A missing event may be a transaction rollback, schema rejection,
            importer decision, invalid domain value, or earlier algorithmic
            mistake. “The database lost it” is a hypothesis, not a conclusion.
          </p>
        </div>
        <ol className="durability-stack">
          <li><span>05</span><strong>Recovery assumptions</strong><small>engine · configuration · storage</small></li>
          <li><span>04</span><strong>Transaction visibility</strong><small>run + events, all or nothing</small></li>
          <li><span>03</span><strong>Artifact compatibility</strong><small>schema · wheel · environment</small></li>
          <li><span>02</span><strong>Architecture ownership</strong><small>policy points inward</small></li>
          <li><span>01</span><strong>Behavioral contract</strong><small>identity · order · failure</small></li>
          <li><span>00</span><strong>Domain and algorithm</strong><small>valid value · feasible plan</small></li>
        </ol>
      </section>

      <section className="arc-three-check">
        <div className="check-copy">
          <p className="kicker">Fast, confidence-aware check</p>
          <h2>
            An agent says: “types pass, tests pass, and the wheel builds.”
            What should you do next?
          </h2>
          <p>
            Commit to both an answer and confidence before opening the
            explanation. The distractors reveal which boundaries have collapsed.
          </p>
        </div>
        <div className="mini-check-card">
          <div className="mini-options" role="radiogroup">
            {checkOptions.map((option, index) => {
              const isCorrect = index === 2;
              const isSelected = selectedCheck === index;
              const feedback = revealed
                ? isCorrect
                  ? "correct"
                  : isSelected
                    ? "incorrect"
                    : ""
                : "";
              return (
                <button
                  aria-checked={isSelected}
                  className={`${isSelected ? "selected" : ""} ${feedback}`}
                  disabled={revealed}
                  key={option}
                  onClick={() => setSelectedCheck(index)}
                  role="radio"
                >
                  <span>{String.fromCharCode(65 + index)}</span>
                  {option}
                </button>
              );
            })}
          </div>
          <div className="mini-confidence">
            <span>Confidence</span>
            {(["low", "medium", "high"] as const).map((level) => (
              <button
                className={confidence === level ? "selected" : ""}
                disabled={revealed}
                key={level}
                onClick={() => setConfidence(level)}
              >
                {level}
              </button>
            ))}
          </div>
          {!revealed ? (
            <button
              className="primary-action"
              disabled={selectedCheck === null || confidence === null}
              onClick={() => setRevealed(true)}
            >
              Reveal the model →
            </button>
          ) : (
            <div
              className={`mini-answer ${
                selectedCheck === 2 ? "correct-answer" : "repair-answer"
              }`}
              aria-live="polite"
            >
              <strong>
                {selectedCheck === 2
                  ? "Good boundary discipline."
                  : "One or more evidence layers collapsed."}
              </strong>
              <p>
                Choice C is strongest. Static shape, sampled behavior, and
                buildability are useful but bounded. They do not automatically
                establish hostile runtime validation, dependency direction,
                plugin trust, installability, atomic persistence, or recovery.
              </p>
              <small>
                A high-confidence miss becomes a priority misconception: build
                the smallest counterexample, then retest after a delay.
              </small>
            </div>
          )}
        </div>
      </section>

      <section className="arc-three-studio-brief">
        <div className="arc-three-stamp">
          <span>CUMULATIVE</span>
          <strong>DURABILITY DEFENSE</strong>
          <small>Modules 12–16</small>
        </div>
        <div>
          <p className="kicker">The real-life application</p>
          <h2>One late malformed row. Two processes. One truthful outcome.</h2>
          <p>
            You will recover the import path, choose its contracts, direct a
            bounded change, inspect the patch and artifacts, then prove what a
            second connection can—and cannot—observe. Most code may be generated.
            The architecture, evidence design, and acceptance decision remain yours.
          </p>
          <div className="evidence-strip">
            {[
              "dependency graph",
              "contract suite",
              "causal dossier",
              "reviewed diff",
              "artifact inventory",
              "two-connection trace",
            ].map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
      </section>

      <footer className="arc-three-actions">
        <button className="text-action" onClick={onOpenDataStructures}>
          ← Revisit data structures
        </button>
        <div>
          <span>Personalize the depth from evidence.</span>
          <button className="primary-action" onClick={onOpenDiagnostic}>
            Take the diagnostic →
          </button>
        </div>
      </footer>
    </article>
  );
}
