"use client";

import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { getBrowserProgressStorage } from "@/lib/browser-progress-storage";
import {
  clearModule24Progress,
  persistModule24Progress,
  restoreModule24Progress,
} from "@/lib/module24-progress-codec";
import styles from "./RuntimeEvidenceObservatory.module.css";

type ObservatoryView =
  | "contract"
  | "graph"
  | "cycle"
  | "lens"
  | "runtime"
  | "decision";
type Confidence = 1 | 2 | 3 | 4;
type ViewRecord = {
  choice: string | null;
  confidence: Confidence | null;
  revealed: boolean;
};
type ObservatoryRecord = Record<ObservatoryView, ViewRecord>;

const CORE_RULE =
  "An optimization is accepted only after semantic behavior, privacy/retention boundaries, implementation scope, and a controlled measurement are kept distinct. A number is evidence only for the question and manifest that produced it.";

const views: ReadonlyArray<{
  id: ObservatoryView;
  number: string;
  label: string;
  question: string;
}> = [
  {
    id: "contract",
    number: "01",
    label: "Contract → claim",
    question: "What must remain true before faster matters?",
  },
  {
    id: "graph",
    number: "02",
    label: "Names → graph",
    question: "Which root still retains the object?",
  },
  {
    id: "cycle",
    number: "03",
    label: "Cycle → cleanup",
    question: "What can a cycle model establish?",
  },
  {
    id: "lens",
    number: "04",
    label: "Metric → scope",
    question: "Which memory question did this metric answer?",
  },
  {
    id: "runtime",
    number: "05",
    label: "Source → runtime",
    question: "What does version-pinned bytecode evidence support?",
  },
  {
    id: "decision",
    number: "06",
    label: "Patch → decision",
    question: "Should Atlas accept, reject, or defer the patch?",
  },
];

const claimLayers = [
  {
    id: "semantic",
    label: "semantic contract",
    badge: "[PYTHON / PRODUCT CONTRACT]",
    establishes: "The fixed baseline and candidate agree on declared output, error, and redaction fixtures.",
    doesNot: "It does not establish a speedup, lower memory, CPython internals, or permission to retain data.",
  },
  {
    id: "cpython",
    label: "CPython 3.14.6 observation",
    badge: "[VERSION-PINNED IMPLEMENTATION]",
    establishes: "A small source, bytecode, refcount, or allocator observation was read on a named CPython build.",
    doesNot: "It does not become a Python-language guarantee, another-VM fact, or benchmark result.",
  },
  {
    id: "measurement",
    label: "measurement manifest",
    badge: "[WORKLOAD + METHOD + SAMPLES]",
    establishes: "A named metric produced a result under the declared runtime, host, workload, warm-up, GC, and sample policy.",
    doesNot: "It does not establish production causality, all-process memory, or a human benefit.",
  },
  {
    id: "decision",
    label: "bounded release decision",
    badge: "[ACCEPT / REJECT / DEFER]",
    establishes: "An owner recorded the evidence, retention boundary, limitation, and next falsifier.",
    doesNot: "It does not erase uncertainty or authorize a broader deployment.",
  },
] as const;

const memoryLenses = [
  {
    id: "shallow",
    label: "shallow object size",
    metric: "sys.getsizeof",
    supports: "a direct/shallow size report for one object on the named runtime",
    excludes: "the retained graph, allocator overhead, native buffers, and process RSS",
  },
  {
    id: "traced",
    label: "traced Python allocations",
    metric: "tracemalloc",
    supports: "a scoped allocation trace or current/peak measurement under a declared trace window",
    excludes: "all native allocations, process RSS, and a production memory SLO",
  },
  {
    id: "native",
    label: "native / extension path",
    metric: "C allocator or extension evidence",
    supports: "a narrow observation of an explicitly instrumented native path",
    excludes: "a complete Python-object owner graph or portable conclusion",
  },
  {
    id: "rss",
    label: "process / OS memory",
    metric: "RSS or host observation",
    supports: "a host/process-level observation under a declared condition",
    excludes: "which Python list caused it or a portable allocation attribution",
  },
] as const;

type ClaimLayerId = (typeof claimLayers)[number]["id"];
type MemoryLensId = (typeof memoryLenses)[number]["id"];

function emptyRecord(): ObservatoryRecord {
  return {
    contract: { choice: null, confidence: null, revealed: false },
    graph: { choice: null, confidence: null, revealed: false },
    cycle: { choice: null, confidence: null, revealed: false },
    lens: { choice: null, confidence: null, revealed: false },
    runtime: { choice: null, confidence: null, revealed: false },
    decision: { choice: null, confidence: null, revealed: false },
  };
}

function tabId(view: ObservatoryView) {
  return "runtime-observatory-tab-" + view;
}

function panelId(view: ObservatoryView) {
  return "runtime-observatory-panel-" + view;
}

function EvidenceLock() {
  return (
    <p className={styles.evidenceLock}>
      Record an answer and confidence before evidence appears. The practice is
      calibration: name what you know, what you do not, and what would change
      your decision.
    </p>
  );
}

function PredictionGate({
  id,
  question,
  choices,
  record,
  onChange,
}: {
  id: ObservatoryView;
  question: string;
  choices: ReadonlyArray<{ id: string; label: string }>;
  record: ViewRecord;
  onChange: (next: Partial<ViewRecord>) => void;
}) {
  const ready = record.choice !== null && record.confidence !== null;
  return (
    <section className={styles.predictionGate} aria-label={id + " prediction checkpoint"}>
      <div className={styles.gateHeading}>
        <span>Prediction checkpoint</span>
        <p>{question}</p>
      </div>
      <fieldset>
        <legend>Choose the strongest statement</legend>
        <div className={styles.choiceGrid}>
          {choices.map((choice) => (
            <label key={choice.id}>
              <input
                checked={record.choice === choice.id}
                name={id + "-prediction"}
                onChange={() => onChange({ choice: choice.id, revealed: false })}
                type="radio"
                value={choice.id}
              />
              <span>{choice.label}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend>How confident are you?</legend>
        <div className={styles.confidenceScale}>
          {([1, 2, 3, 4] as const).map((confidence) => (
            <label key={confidence}>
              <input
                checked={record.confidence === confidence}
                name={id + "-confidence"}
                onChange={() => onChange({ confidence, revealed: false })}
                type="radio"
                value={confidence}
              />
              <span>
                <strong>{confidence}</strong>
                <small>
                  {confidence === 1
                    ? "guess"
                    : confidence === 2
                      ? "partial"
                      : confidence === 3
                        ? "defensible"
                        : "teach it"}
                </small>
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <button
        className={styles.revealButton}
        disabled={!ready}
        onClick={() => onChange({ revealed: true })}
        type="button"
      >
        {record.revealed ? "Review the evidence" : "Commit prediction & reveal evidence"}
      </button>
      {!record.revealed && <EvidenceLock />}
    </section>
  );
}

function InvariantPlate() {
  return (
    <aside className={styles.invariantPlate}>
      <span>Module 24 working invariant</span>
      <p>{CORE_RULE}</p>
      <small>
        The observatory uses fixed illustrative packets. It is not a profiler,
        not a CPython emulator, not a memory-leak detector, and not a license
        to collect private learner traces.
      </small>
    </aside>
  );
}

function ContractView({
  record,
  onChange,
  selected,
  onSelected,
}: {
  record: ViewRecord;
  onChange: (next: Partial<ViewRecord>) => void;
  selected: ClaimLayerId;
  onSelected: (value: ClaimLayerId) => void;
}) {
  const layer = claimLayers.find((entry) => entry.id === selected) ?? claimLayers[0];
  return (
    <div className={styles.viewStack}>
      <PredictionGate
        choices={[
          { id: "semantic", label: "Keep the declared output, error, redaction, and retention contract stable before interpreting speed." },
          { id: "timing", label: "A single lower elapsed time makes the patch correct and ready." },
          { id: "global", label: "A CPython observation proves all Python programs behave this way." },
        ]}
        id="contract"
        onChange={onChange}
        question="What must stay true before the claim that the candidate is faster can matter?"
        record={record}
      />
      {record.revealed && (
        <section className={styles.revealCard} aria-live="polite">
          <div className={styles.revealHeader}>
            <span className={styles.scopeTag}>CLAIM OWNER STACK</span>
            <h3>Move one claim upward only when the earlier boundary is intact.</h3>
          </div>
          <div className={styles.claimRail} aria-label="Evidence layer selector">
            {claimLayers.map((entry) => (
              <button
                aria-pressed={selected === entry.id}
                key={entry.id}
                onClick={() => onSelected(entry.id)}
                type="button"
              >
                <span>{entry.badge}</span>
                <strong>{entry.label}</strong>
              </button>
            ))}
          </div>
          <div className={styles.inspectorCard}>
            <span>{layer.badge}</span>
            <h4>{layer.label}</h4>
            <p>{layer.establishes}</p>
            <span className={styles.stopLabel}>does not establish</span>
            <p>{layer.doesNot}</p>
          </div>
          <div className={styles.textEquivalent}>
            <strong>Text equivalent</strong>
            A correct semantic fixture is necessary before a benchmark. A
            CPython card is not a language rule. A controlled sample is not a
            production conclusion. A release decision records both evidence and
            a limitation.
          </div>
        </section>
      )}
    </div>
  );
}

function GraphView({
  record,
  onChange,
  root,
  onRoot,
}: {
  record: ViewRecord;
  onChange: (next: Partial<ViewRecord>) => void;
  root: "audit" | "none";
  onRoot: (value: "audit" | "none") => void;
}) {
  const retained = root === "audit";
  return (
    <div className={styles.viewStack}>
      <PredictionGate
        choices={[
          { id: "audit", label: "audit_view still roots the original event list; deleting another name does not make it unreachable." },
          { id: "deleted", label: "del report immediately destroys every object that report ever named." },
          { id: "address", label: "The graph lets us infer a portable address and exact reclamation time." },
        ]}
        id="graph"
        onChange={onChange}
        question="After report is removed, which fact best explains whether the original list remains reachable?"
        record={record}
      />
      {record.revealed && (
        <section className={styles.revealCard} aria-live="polite">
          <div className={styles.revealHeader}>
            <span className={styles.scopeTag}>BINDING IS NOT UNIQUE OWNERSHIP</span>
            <h3>Switch the remaining root, then inspect the only conclusion the graph earns.</h3>
          </div>
          <div className={styles.toggleRow} role="group" aria-label="Object graph roots">
            <button aria-pressed={root === "audit"} onClick={() => onRoot("audit")} type="button">
              keep audit_view root
            </button>
            <button aria-pressed={root === "none"} onClick={() => onRoot("none")} type="button">
              remove every root
            </button>
          </div>
          <div className={styles.objectDiagram} aria-label="Object graph text diagram">
            <div className={styles.rootNode}>report <small>removed binding</small></div>
            <i aria-hidden="true">×</i>
            <div className={styles.rootNode + " " + (retained ? styles.liveRoot : styles.mutedRoot)}>
              audit_view <small>{retained ? "remaining root" : "removed binding"}</small>
            </div>
            <i aria-hidden="true">→</i>
            <div className={styles.objectNode}>shared event list</div>
            <i aria-hidden="true">→</i>
            <div className={styles.objectNode}>redacted events</div>
          </div>
          <div className={styles.inspectorCard}>
            <span>[PYTHON CONTRACT + GRAPH MODEL]</span>
            <h4>{retained ? "The event list remains reachable." : "The graph has no declared root."}</h4>
            <p>
              {retained
                ? "Removing report does not mutate the shared list or remove audit_view. The graph supports reachability from the remaining root."
                : "The simplified graph can now call the list unreachable. The next question is implementation-specific collection and explicit resource ownership."}
            </p>
            <span className={styles.stopLabel}>does not establish</span>
            <p>an address, exact refcount, exact reclamation time, allocator decision, or resource close.</p>
          </div>
        </section>
      )}
    </div>
  );
}

function CycleView({
  record,
  onChange,
  phase,
  onPhase,
}: {
  record: ViewRecord;
  onChange: (next: Partial<ViewRecord>) => void;
  phase: "sweep" | "reachability" | "resource";
  onPhase: (value: "sweep" | "reachability" | "resource") => void;
}) {
  const messages = {
    sweep: {
      title: "A simplified local-count sweep stalls on an unreachable cycle.",
      copy: "A points to B and B points to A. With no roots, their internal links still keep a simple local count nonzero. This is a teaching model, not CPython's exact collector.",
      badge: "[SIMPLIFIED GRAPH MODEL]",
    },
    reachability: {
      title: "A root-reachability phase can identify both cycle nodes as unreachable.",
      copy: "Comparing the graph against the declared roots identifies A and B as outside every root path. CPython collector details, generations, thresholds, and finalizers remain version-specific.",
      badge: "[REACHABILITY OBSERVATION]",
    },
    resource: {
      title: "Unreachable objects are not an explicit resource-lifecycle proof.",
      copy: "Files, sockets, transactions, locks, executors, and capabilities need a close, context-manager, or lifecycle protocol whose completion is directly tested.",
      badge: "[RESOURCE OWNERSHIP]",
    },
  } as const;
  const message = messages[phase];
  return (
    <div className={styles.viewStack}>
      <PredictionGate
        choices={[
          { id: "model", label: "A simplified count model can leave a cycle after roots disappear; reachability adds a different question." },
          { id: "resource", label: "Garbage collection proves every file, socket, and transaction was closed correctly." },
          { id: "immediate", label: "Reference counting guarantees every unreachable object is immediately released everywhere." },
        ]}
        id="cycle"
        onChange={onChange}
        question="What is the strongest statement about an unrooted A ↔ B cycle?"
        record={record}
      />
      {record.revealed && (
        <section className={styles.revealCard} aria-live="polite">
          <div className={styles.revealHeader}>
            <span className={styles.scopeTag}>CYCLE / RESOURCE BOUNDARY</span>
            <h3>Follow the model in layers; never replace ownership with hope.</h3>
          </div>
          <div className={styles.phaseTabs} role="group" aria-label="Cycle evidence phase">
            {(["sweep", "reachability", "resource"] as const).map((entry) => (
              <button aria-pressed={phase === entry} key={entry} onClick={() => onPhase(entry)} type="button">
                {entry === "sweep" ? "1 · count sweep" : entry === "reachability" ? "2 · root check" : "3 · close explicitly"}
              </button>
            ))}
          </div>
          <div className={styles.cycleDiagram} aria-label="Unrooted cycle diagram">
            <div>A</div><i aria-hidden="true">→</i><div>B</div><i aria-hidden="true">↘</i><span>no declared root</span>
          </div>
          <div className={styles.inspectorCard}>
            <span>{message.badge}</span>
            <h4>{message.title}</h4>
            <p>{message.copy}</p>
          </div>
        </section>
      )}
    </div>
  );
}

function LensView({
  record,
  onChange,
  lensId,
  onLens,
}: {
  record: ViewRecord;
  onChange: (next: Partial<ViewRecord>) => void;
  lensId: MemoryLensId;
  onLens: (value: MemoryLensId) => void;
}) {
  const lens = memoryLenses.find((entry) => entry.id === lensId) ?? memoryLenses[0];
  return (
    <div className={styles.viewStack}>
      <PredictionGate
        choices={[
          { id: "traced", label: "A lower tracemalloc peak supports a scoped claim about traced Python allocations under its manifest." },
          { id: "rss", label: "A lower traced peak proves lower process RSS and every native allocation." },
          { id: "all", label: "One shallow object-size value names every retained object and leak cause." },
        ]}
        id="lens"
        onChange={onChange}
        question="Which conclusion does a lower tracemalloc peak most directly support?"
        record={record}
      />
      {record.revealed && (
        <section className={styles.revealCard} aria-live="polite">
          <div className={styles.revealHeader}>
            <span className={styles.scopeTag}>MEMORY LENS SELECTOR</span>
            <h3>Choose a metric from the question—not the other way around.</h3>
          </div>
          <div className={styles.lensGrid} aria-label="Memory metric choices">
            {memoryLenses.map((entry) => (
              <button aria-pressed={lensId === entry.id} key={entry.id} onClick={() => onLens(entry.id)} type="button">
                <span>{entry.metric}</span>
                <strong>{entry.label}</strong>
              </button>
            ))}
          </div>
          <div className={styles.inspectorCard}>
            <span>[{lens.metric}]</span>
            <h4>{lens.label}</h4>
            <p><strong>Can support:</strong> {lens.supports}</p>
            <span className={styles.stopLabel}>cannot silently become</span>
            <p>{lens.excludes}</p>
          </div>
          <p className={styles.warningLine}>
            Privacy boundary: a profile, heap dump, or cache key can carry
            sensitive context. Atlas uses fixed synthetic/redacted packets here;
            no learner upload or live memory capture is accepted.
          </p>
        </section>
      )}
    </div>
  );
}

function RuntimeView({
  record,
  onChange,
  stage,
  onStage,
}: {
  record: ViewRecord;
  onChange: (next: Partial<ViewRecord>) => void;
  stage: "source" | "code" | "frame" | "bytecode" | "measurement";
  onStage: (value: "source" | "code" | "frame" | "bytecode" | "measurement") => void;
}) {
  const stages = {
    source: ["trusted source", "A small bundled function is a language-level input to a compiler path; it is not learner-supplied code."],
    code: ["code object route", "A code object is an implementation bridge. Its representation is not the Python language specification."],
    frame: ["frame observation", "Frames make execution context inspectable in a scoped CPython/debugging setting, not a general safety boundary."],
    bytecode: ["CPython 3.14.6 illustrative bytecode card", "This static teaching sequence is illustrative, not a captured disassembly from the browser or learner runtime. A real bytecode observation needs recorded dis options, output, and implementation/version."],
    measurement: ["controlled measurement", "A timing/allocation conclusion needs a workload, build, warm-up, GC, samples, metric scope, and confounders."],
  } as const;
  const [title, copy] = stages[stage];
  return (
    <div className={styles.viewStack}>
      <PredictionGate
        choices={[
          { id: "pinned", label: "An illustrative bytecode card names the evidence a version-pinned CPython observation would need; its speed effect still needs experiment evidence." },
          { id: "language", label: "A bytecode instruction is Python-language semantics for all implementations." },
          { id: "speed", label: "A specialized instruction proves every workload is faster." },
        ]}
        id="runtime"
        onChange={onChange}
        question="What would a version-labelled CPython bytecode observation establish once it is actually captured?"
        record={record}
      />
      {record.revealed && (
        <section className={styles.revealCard} aria-live="polite">
          <div className={styles.revealHeader}>
            <span className={styles.scopeTag}>TRUSTED SOURCE → IMPLEMENTATION ROUTE</span>
            <h3>Read one layer at a time, then stop before an overclaim.</h3>
          </div>
          <div className={styles.executionRail} aria-label="Runtime evidence route">
            {(["source", "code", "frame", "bytecode", "measurement"] as const).map((entry, index) => (
              <div key={entry}>
                <button aria-pressed={stage === entry} onClick={() => onStage(entry)} type="button">
                  <span>0{index + 1}</span>
                  <strong>{entry}</strong>
                </button>
                {index < 4 && <i aria-hidden="true">→</i>}
              </div>
            ))}
          </div>
          <div className={styles.runtimeReadout}>
            <span>[{stage === "bytecode" ? "ILLUSTRATIVE CPYTHON 3.14.6 CARD" : stage === "measurement" ? "MANIFEST REQUIRED" : "SCOPED ROUTE"}]</span>
            <h4>{title}</h4>
            <p>{copy}</p>
            <code>
              {stage === "bytecode"
                ? "illustrative: RESUME · LOAD_FAST · LOAD_CONST · BINARY_OP · RETURN_VALUE (not captured output)"
                : stage === "measurement"
                  ? "runtime + build + workload + warm-up + GC + metric + samples"
                  : "trusted source → compiler / interpreter implementation boundary"}
            </code>
          </div>
        </section>
      )}
    </div>
  );
}

function DecisionView({
  record,
  onChange,
  selected,
  onSelected,
}: {
  record: ViewRecord;
  onChange: (next: Partial<ViewRecord>) => void;
  selected: "semantic" | "manifest" | "retention" | "decision";
  onSelected: (value: "semantic" | "manifest" | "retention" | "decision") => void;
}) {
  const cards = {
    semantic: ["semantic fixtures", "Candidate must preserve declared result, error, and redaction behavior before a performance conclusion is considered.", "PASS in the fixed packet"],
    manifest: ["comparison manifest", "Workload, CPython build, GC policy, warm-up, metric scope, host class, and samples must match the question.", "MISSING: candidate changed GC policy"],
    retention: ["cache / retention review", "A global cache can retain cohort-derived values across requests. It needs purpose, key scope, expiry, invalidation, access, and rollback rules.", "MISSING: retention contract"],
    decision: ["bounded decision", "With semantic behavior intact but controls and retention missing, defer the patch rather than converting a plausible idea into a release.", "DECISION_DEFER"],
  } as const;
  const [title, copy, status] = cards[selected];
  return (
    <div className={styles.viewStack}>
      <PredictionGate
        choices={[
          { id: "defer", label: "Defer: semantic tests are necessary, but the changed GC condition and global-cache retention boundary prevent a controlled release decision." },
          { id: "accept", label: "Accept: a green test suite and one lower number make the cache safe." },
          { id: "ignore", label: "Ignore: performance work never needs a privacy or retention review." },
        ]}
        id="decision"
        onChange={onChange}
        question="The candidate keeps fixed outputs but changes GC policy and adds a global cohort cache. What is the strongest decision?"
        record={record}
      />
      {record.revealed && (
        <section className={styles.revealCard} aria-live="polite">
          <div className={styles.revealHeader}>
            <span className={styles.scopeTag}>AI PATCH REVIEW</span>
            <h3>Split the proposal until every owner can defend its claim.</h3>
          </div>
          <div className={styles.patchSnippet}>
            <span>generated patch fragment · fixed code-reading fixture</span>
            <code>{"_summary_cache[cohort] = answer\n# benchmark run used GC disabled"}</code>
          </div>
          <div className={styles.reviewGrid} role="group" aria-label="Patch review cards">
            {(["semantic", "manifest", "retention", "decision"] as const).map((entry) => (
              <button aria-pressed={selected === entry} key={entry} onClick={() => onSelected(entry)} type="button">
                <span>{entry}</span>
              </button>
            ))}
          </div>
          <div className={styles.inspectorCard}>
            <span>{status}</span>
            <h4>{title}</h4>
            <p>{copy}</p>
          </div>
          <div className={styles.nonClaimPlate}>
            <strong>Release boundary:</strong> an AI-generated patch, a green
            CI run, private deployment, or a lower isolated metric does not
            independently establish correctness, performance, privacy, or
            human benefit. Name the missing evidence and the next falsifier.
          </div>
        </section>
      )}
    </div>
  );
}

export function RuntimeEvidenceObservatory() {
  const [activeView, setActiveView] = useState<ObservatoryView>("contract");
  const [records, setRecords] = useState<ObservatoryRecord>(emptyRecord);
  const [storageReady, setStorageReady] = useState(false);
  const [claimLayer, setClaimLayer] = useState<ClaimLayerId>("semantic");
  const [graphRoot, setGraphRoot] = useState<"audit" | "none">("audit");
  const [cyclePhase, setCyclePhase] = useState<"sweep" | "reachability" | "resource">("sweep");
  const [lens, setLens] = useState<MemoryLensId>("traced");
  const [runtimeStage, setRuntimeStage] = useState<"source" | "code" | "frame" | "bytecode" | "measurement">("source");
  const [reviewCard, setReviewCard] = useState<"semantic" | "manifest" | "retention" | "decision">("semantic");
  const tabRefs = useRef<Record<ObservatoryView, HTMLButtonElement | null>>({
    contract: null,
    graph: null,
    cycle: null,
    lens: null,
    runtime: null,
    decision: null,
  });
  const progressDirtyRef = useRef(false);

  useEffect(() => {
    const hydrationTimer = window.setTimeout(() => {
      try {
        const storage = getBrowserProgressStorage();
        if (storage) {
          const stored = restoreModule24Progress(storage);
          if (stored) setRecords(stored as ObservatoryRecord);
        }
      } catch {
        // Progress is optional and contains only allowlisted local prediction evidence.
      } finally {
        setStorageReady(true);
      }
    }, 0);
    return () => window.clearTimeout(hydrationTimer);
  }, []);

  useEffect(() => {
    if (!storageReady || !progressDirtyRef.current) return;
    try {
      const storage = getBrowserProgressStorage();
      if (storage) persistModule24Progress(storage, records);
    } catch {
      // The observatory remains useful if local storage is unavailable.
    } finally {
      progressDirtyRef.current = false;
    }
  }, [records, storageReady]);

  const updateRecord = (view: ObservatoryView, next: Partial<ViewRecord>) => {
    progressDirtyRef.current = true;
    setRecords((current) => ({
      ...current,
      [view]: { ...current[view], ...next },
    }));
  };

  const resetProgress = () => {
    progressDirtyRef.current = false;
    setRecords(emptyRecord());
    try {
      const storage = getBrowserProgressStorage();
      if (storage) clearModule24Progress(storage);
    } catch {
      // Local persistence is optional.
    }
  };

  const handleTabKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>, index: number) => {
    const currentIndex = index;
    let nextIndex: number | null = null;
    if (event.key === "ArrowRight") nextIndex = (currentIndex + 1) % views.length;
    if (event.key === "ArrowLeft") nextIndex = (currentIndex - 1 + views.length) % views.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = views.length - 1;
    if (nextIndex === null) return;
    event.preventDefault();
    const next = views[nextIndex];
    setActiveView(next.id);
    tabRefs.current[next.id]?.focus();
  };

  const revealed = views.filter((view) => records[view.id].revealed).length;
  const current = records[activeView];

  return (
    <section className={styles.observatory} aria-labelledby="runtime-evidence-observatory-title">
      <header className={styles.hero}>
        <div>
          <p className={styles.kicker}>Module 24 interactive field studio</p>
          <h2 id="runtime-evidence-observatory-title">Runtime Evidence Observatory</h2>
          <p>
            Read a performance story as a layered argument: semantic contract,
            object graph, CPython observation, metric scope, experiment
            manifest, and bounded engineering decision.
          </p>
        </div>
        <div className={styles.heroBadge} aria-hidden="true">
          <span>SEMANTICS</span><i>→</i><span>RUNTIME</span><i>→</i><span>EVIDENCE</span>
        </div>
      </header>

      <InvariantPlate />

      <div className={styles.metaRow}>
        <div>
          <span>Exploration coverage: revealed runtime-evidence views</span>
          <strong>{revealed} / {views.length}</strong>
          <div className={styles.coverageMeter} aria-label={"Exploration coverage: revealed runtime-evidence views " + revealed + " of " + views.length}>
            <span style={{ width: (revealed / views.length) * 100 + "%" }} />
          </div>
        </div>
        <button className={styles.resetButton} onClick={resetProgress} type="button">Reset local progress</button>
      </div>

      <div className={styles.tabScroller}>
        <div className={styles.tabs} role="tablist" aria-label="Runtime evidence observatory views">
          {views.map((view, index) => (
            <button
              aria-controls={panelId(view.id)}
              aria-selected={activeView === view.id}
              id={tabId(view.id)}
              key={view.id}
              onClick={() => setActiveView(view.id)}
              onKeyDown={(event) => handleTabKeyDown(event, index)}
              ref={(node) => { tabRefs.current[view.id] = node; }}
              role="tab"
              tabIndex={activeView === view.id ? 0 : -1}
              type="button"
            >
              <span>{view.number}</span>
              <strong>{view.label}</strong>
              <small>{view.question}</small>
            </button>
          ))}
        </div>
      </div>

      <div
        aria-labelledby={tabId(activeView)}
        className={styles.panel}
        id={panelId(activeView)}
        role="tabpanel"
        tabIndex={0}
      >
        {activeView === "contract" && <ContractView record={current} onChange={(next) => updateRecord("contract", next)} selected={claimLayer} onSelected={setClaimLayer} />}
        {activeView === "graph" && <GraphView record={current} onChange={(next) => updateRecord("graph", next)} root={graphRoot} onRoot={setGraphRoot} />}
        {activeView === "cycle" && <CycleView record={current} onChange={(next) => updateRecord("cycle", next)} phase={cyclePhase} onPhase={setCyclePhase} />}
        {activeView === "lens" && <LensView record={current} onChange={(next) => updateRecord("lens", next)} lensId={lens} onLens={setLens} />}
        {activeView === "runtime" && <RuntimeView record={current} onChange={(next) => updateRecord("runtime", next)} stage={runtimeStage} onStage={setRuntimeStage} />}
        {activeView === "decision" && <DecisionView record={current} onChange={(next) => updateRecord("decision", next)} selected={reviewCard} onSelected={setReviewCard} />}
      </div>

      <footer className={styles.footer}>
        <p>
          <strong>Hand off:</strong> Module 32 is authoring-only, so this
          runtime-evidence route ends here rather than unlocking a next Core
          module. M25/M26 reuse this distinction only as later preview-only
          synthesis after M31–M36; they are not a direct Module 24 path.
        </p>
        <a href="#module-reading-article">Read the complete Module 24 workbook</a>
      </footer>
    </section>
  );
}
