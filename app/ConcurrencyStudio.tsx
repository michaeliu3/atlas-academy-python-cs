"use client";

import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";
import { canExportApprovedDraft } from "@/lib/learner-controlled-export";
import {
  clearModule19Progress,
  hasMeaningfulModule19Progress,
  MODULE19_PROGRESS_STORAGE_KEY,
  module19ProgressCodec,
  restoreModule19Progress,
} from "@/lib/module19-progress-codec";
import styles from "./ConcurrencyStudio.module.css";

type ConcurrencyView =
  | "history"
  | "linearization"
  | "coordination"
  | "progress"
  | "models"
  | "evidence";
type Confidence = 1 | 2 | 3 | 4;
type AnswerState = {
  prediction: string | null;
  confidence: Confidence | null;
  revealed: boolean;
  revision: string;
};
type AnswerMap = Record<ConcurrencyView, AnswerState>;
type PersistedPredictionGate = {
  choice: string | null;
  confidence: Confidence | null;
  revealed: boolean;
};
type Module19ProgressRecord = Record<
  ConcurrencyView,
  PersistedPredictionGate
>;
type WorkerId = "A" | "B";
type LockPatch = "shared" | "narrow" | "wide" | "owner";
type CoordinationInstrument = "condition" | "semaphore" | "queue" | "future";
type CoordinationAction =
  | "put"
  | "get"
  | "wait"
  | "notify"
  | "task_done"
  | "commit"
  | "join"
  | "stop"
  | "immediate_stop"
  | "acquire"
  | "release";
type ProgressScenario = "cycle" | "capacity" | "starvation" | "livelock";
type ProgressEdge = "A→L2" | "L2→B" | "B→L1" | "L1→A";
type ModelChoiceRecord = {
  workload: "blocking" | "python" | "native" | "mixed" | null;
  independence: "independent" | "ordered" | null;
  sharing: "none" | "bounded" | "shared" | null;
  transfer: "small" | "large" | null;
  isolation: "acceptable" | "required" | "forbidden" | null;
  lifetime: "short" | "long" | null;
  failure: "shared" | "isolated" | null;
  cancellation: "pending" | "cooperative" | "terminate" | null;
  build: "standard" | "free-threaded" | "unknown" | null;
  gil: "enabled" | "disabled" | "unknown" | null;
  nativeContract: "releases" | "compatible" | "unknown" | null;
  candidate:
    | "sequential"
    | "threads"
    | "processes"
    | "interpreters"
    | "m21"
    | null;
  evidencePlan: "equivalence-first" | "profile-first" | "failure-first" | null;
};
type EvidenceVariant =
  | "owner"
  | "shared"
  | "narrow"
  | "callback"
  | "empty"
  | "swallowed"
  | "child"
  | "gil";
type PatchAxis =
  | "behavior"
  | "tests"
  | "portability"
  | "progress"
  | "modelFit"
  | "documentation";
type PatchDecision = "accept" | "reject" | "split";
type CheckpointRecord = {
  context: string;
  prediction: string | null;
  secondary: string | null;
  confidence: Confidence | null;
  revealed: boolean;
};
type StudioRecord = {
  historySchedule: WorkerId[];
  completedHistories: string[];
  historyCheckpoint: CheckpointRecord;
  historyCensusCheckpoint: CheckpointRecord;
  linearizationPatch: LockPatch;
  protectedSteps: number[];
  linearizationCheckpoint: CheckpointRecord;
  coordinationInstrument: CoordinationInstrument;
  coordinationActions: CoordinationAction[];
  coordinationPendingAction: CoordinationAction | null;
  coordinationCheckpoint: CheckpointRecord;
  progressScenario: ProgressScenario;
  progressEdges: ProgressEdge[];
  modelChoice: ModelChoiceRecord;
  evidenceVariant: EvidenceVariant;
  patchDecisions: Record<PatchAxis, PatchDecision | null>;
};

const CENTRAL_INVARIANT =
  "Every admitted Atlas partition reaches exactly one terminal classification—`COMMITTED`, `FAILED`, or `CANCELLED`. If Atlas publishes a new index, that index is the deterministic fold of all and only `COMMITTED` partial results, and publication is permitted only when every required partition is `COMMITTED`. Every worker-visible effect remains accounted for as a process-local operation, an OS-mediated resource transition, and one step in a declared concurrent history; each shared transition is justified by one named owner or synchronization protocol, every progress claim states its blocking and fairness assumptions, and neither a clean exit, a passing stress run, the GIL, nor observed speedup substitutes for safety, liveness, or model-fit evidence.";
const STUDIO_STORAGE_KEY = MODULE19_PROGRESS_STORAGE_KEY;
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const RUNTIME_PROFILE = {
  python: "CPython 3.14.6",
  build: "standard GIL-enabled build",
  buildSupportsFreeThreading: false,
  liveGil: "enabled",
  interpreters: "API available; adapter unvalidated",
} as const;
const HISTORY_OPERATIONS = ["R", "C", "W"] as const;
const PROGRESS_EDGES: ReadonlyArray<ProgressEdge> = [
  "A→L2",
  "L2→B",
  "B→L1",
  "L1→A",
];
const PATCH_AXES: ReadonlyArray<{
  id: PatchAxis;
  label: string;
}> = [
  { id: "behavior", label: "Behavior" },
  { id: "tests", label: "Tests" },
  { id: "portability", label: "Portability" },
  { id: "progress", label: "Progress" },
  { id: "modelFit", label: "Model fit" },
  { id: "documentation", label: "Documentation" },
];
const GATED_COORDINATION_ACTIONS: ReadonlyArray<CoordinationAction> = [
  "get",
  "notify",
  "join",
  "stop",
  "immediate_stop",
];

function enumerateTwoWorkerSchedules(
  prefix: WorkerId[] = [],
  aCount = 0,
  bCount = 0,
): WorkerId[][] {
  if (aCount === 3 && bCount === 3) return [prefix];
  const schedules: WorkerId[][] = [];
  if (aCount < 3) {
    schedules.push(
      ...enumerateTwoWorkerSchedules([...prefix, "A"], aCount + 1, bCount),
    );
  }
  if (bCount < 3) {
    schedules.push(
      ...enumerateTwoWorkerSchedules([...prefix, "B"], aCount, bCount + 1),
    );
  }
  return schedules;
}

const ALL_TWO_WORKER_SCHEDULES = enumerateTwoWorkerSchedules();
const HISTORY_SCHEDULE_KEYS = new Set(
  ALL_TWO_WORKER_SCHEDULES.map((schedule) => schedule.join("")),
);

type HistoryTraceRow = {
  order: number;
  event: string;
  invocation: string;
  response: string;
  a: string;
  b: string;
  shared: string;
  oracle: string;
};

function traceHistory(schedule: ReadonlyArray<WorkerId>) {
  const operationCounts: Record<WorkerId, number> = { A: 0, B: 0 };
  const reads: Record<WorkerId, number[] | null> = { A: null, B: null };
  const computed: Record<WorkerId, number[] | null> = { A: null, B: null };
  let shared = [1];
  const formatPostings = (postings: ReadonlyArray<number> | null) =>
    postings
      ? postings.length === 1
        ? `(${postings[0]},)`
        : `(${postings.join(", ")})`
      : "—";

  const describeLocal = (worker: WorkerId) => {
    if (computed[worker] !== null) {
      return `computed ${formatPostings(computed[worker])}`;
    }
    if (reads[worker] !== null) return `read ${formatPostings(reads[worker])}`;
    return "not invoked";
  };

  const rows: HistoryTraceRow[] = schedule.map((worker, index) => {
    const operationIndex = operationCounts[worker];
    const operation = HISTORY_OPERATIONS[operationIndex];
    operationCounts[worker] += 1;
    if (operation === "R") {
      reads[worker] = [...shared];
    } else if (operation === "C") {
      const contribution = worker === "A" ? 2 : 3;
      computed[worker] = [...new Set([...(reads[worker] ?? shared), contribution])]
        .sort((left, right) => left - right);
    } else {
      shared = [...(computed[worker] ?? shared)];
    }
    return {
      order: index + 1,
      event: `${worker}:${operation}`,
      invocation:
        operation === "R" ? `${worker} partition fold invoked` : "active",
      response: operation === "W" ? `${worker} partition fold returned` : "pending",
      a: describeLocal("A"),
      b: describeLocal("B"),
      shared: formatPostings(shared),
      oracle: "(1, 2, 3)",
    };
  });

  return {
    finalValue: formatPostings(shared),
    rows,
    serialEquivalent:
      schedule.length === 6 && formatPostings(shared) === "(1, 2, 3)",
  };
}

type CoordinationState = {
  queue: WorkerId[];
  inFlight: WorkerId[];
  partialReady: WorkerId[];
  terminal: WorkerId[];
  cancelled: WorkerId[];
  unfinished: number;
  permits: number;
  waiter: string;
  lockOwner: string;
  admissionOpen: boolean;
  immediateShutdown: boolean;
  last: string;
};

const initialCoordinationState = (): CoordinationState => ({
  queue: [],
  inFlight: [],
  partialReady: [],
  terminal: [],
  cancelled: [],
  unfinished: 0,
  permits: 2,
  waiter: "not waiting",
  lockOwner: "none",
  admissionOpen: true,
  immediateShutdown: false,
  last: "No operation has run.",
});

function applyCoordinationAction(
  state: CoordinationState,
  action: CoordinationAction,
): CoordinationState {
  const next: CoordinationState = {
    ...state,
    queue: [...state.queue],
    inFlight: [...state.inFlight],
    partialReady: [...state.partialReady],
    terminal: [...state.terminal],
    cancelled: [...state.cancelled],
  };
  const known = new Set([
    ...next.queue,
    ...next.inFlight,
    ...next.partialReady,
    ...next.terminal,
    ...next.cancelled,
  ]);

  if (action === "put") {
    const item = (["A", "B"] as const).find((candidate) => !known.has(candidate));
    if (!next.admissionOpen) {
      next.last = "put rejected: admission is closed.";
    } else if (!item) {
      next.last = "put rejected: both fixture partitions were already admitted.";
    } else if (next.queue.length >= 2) {
      next.last = "put would block: the local bounded queue is full.";
    } else {
      next.queue.push(item);
      next.unfinished += 1;
      next.lockOwner = "producer during put";
      next.last = `put(${item}) admitted one item and incremented unfinished work.`;
    }
  } else if (action === "get") {
    const item = next.queue.shift();
    if (!item) {
      next.last = "get would block: queue occupancy is zero.";
    } else {
      next.inFlight.push(item);
      next.lockOwner = "consumer during get";
      next.last = `get() transferred ${item} from queue ownership to the consumer.`;
    }
  } else if (action === "task_done") {
    const item = next.inFlight.shift();
    if (!item) {
      next.last = "task_done rejected: no consumer-owned item exists.";
    } else {
      next.unfinished = Math.max(0, next.unfinished - 1);
      next.partialReady.push(item);
      next.last = `task_done() acknowledged ${item}; PARTIAL_READY is still preterminal.`;
    }
  } else if (action === "commit") {
    const item = next.partialReady.shift();
    if (!item) {
      next.last = "commit rejected: no validated partial is ready.";
    } else {
      next.terminal.push(item);
      next.lockOwner = "single reducer";
      next.last = `Reducer classified ${item} COMMITTED after validation and fold.`;
    }
  } else if (action === "wait") {
    next.waiter = "waiting; associated lock released";
    next.lockOwner = "none";
    next.last = "wait() released the associated lock and suspended on a predicate.";
  } else if (action === "notify") {
    const predicate = next.terminal.length === 2;
    next.waiter = predicate
      ? "notified; predicate true after reacquire + re-check"
      : "notified; predicate false after reacquire + re-check";
    next.lockOwner = "notifier until it releases the lock";
    next.last = predicate
      ? "notify() woke the waiter; the re-checked predicate is now true."
      : "notify() woke the waiter, but notification did not make the predicate true.";
  } else if (action === "join") {
    next.last =
      next.unfinished === 0
        ? "join may return: unfinished-task accounting is zero."
        : `join still waits: ${next.unfinished} task(s) remain unfinished.`;
  } else if (action === "stop") {
    next.admissionOpen = false;
    next.last = "Graceful shutdown closed admission and preserved drain accounting.";
  } else if (action === "immediate_stop") {
    next.admissionOpen = false;
    const drainedCount = next.queue.length;
    next.cancelled.push(...next.queue);
    next.queue = [];
    next.unfinished = Math.max(0, next.unfinished - drainedCount);
    next.immediateShutdown = true;
    next.last =
      next.unfinished === 0
        ? "Immediate shutdown drained queued work and released join without proving that drained work completed."
        : `Immediate shutdown drained ${drainedCount} queued item(s), but ${next.unfinished} claimed task(s) still keep join waiting.`;
  } else if (action === "acquire") {
    if (next.permits === 0) {
      next.last = "acquire would block: no semaphore permit remains.";
    } else {
      next.permits -= 1;
      next.last = "acquire consumed one capacity permit; it did not transfer an item.";
    }
  } else if (next.permits === 2) {
    next.last = "release rejected: it would exceed the declared permit capacity.";
  } else {
    next.permits += 1;
    next.last = "release restored one capacity permit.";
  }
  return next;
}

function replayCoordination(actions: ReadonlyArray<CoordinationAction>) {
  return actions.reduce(applyCoordinationAction, initialCoordinationState());
}

const views: ReadonlyArray<{
  id: ConcurrencyView;
  number: string;
  label: string;
  shortLabel: string;
  question: string;
}> = [
  {
    id: "history",
    number: "01",
    label: "History explorer",
    shortLabel: "Interleave",
    question: "Which legal histories preserve the sequential result?",
  },
  {
    id: "linearization",
    number: "02",
    label: "Linearization lab",
    shortLabel: "Protect",
    question: "Which logical transition must appear indivisible?",
  },
  {
    id: "coordination",
    number: "03",
    label: "Coordination console",
    shortLabel: "Coordinate",
    question: "Is this fact a predicate, permit, item, or lifecycle state?",
  },
  {
    id: "progress",
    number: "04",
    label: "Progress laboratory",
    shortLabel: "Unknot",
    question: "What prevents progress, and under which assumptions?",
  },
  {
    id: "models",
    number: "05",
    label: "Python model chooser",
    shortLabel: "Choose",
    question: "Which execution boundary fits the actual workload?",
  },
  {
    id: "evidence",
    number: "06",
    label: "Evidence auditor",
    shortLabel: "Defend",
    question: "What does each artifact prove—and what remains unknown?",
  },
];

const predictionSets: Record<
  ConcurrencyView,
  {
    legend: string;
    options: ReadonlyArray<{ value: string; label: string }>;
    correct: string;
    reveal: string;
  }
> = {
  history: {
    legend:
      "For A:R → B:R → A:C → B:C → A:W → B:W, predict the final postings.",
    options: [
      { value: "old", label: "(1,) — neither contribution survives" },
      {
        value: "lost",
        label: "(1, 2) or (1, 3) — one contribution is lost",
      },
      {
        value: "both",
        label: "(1, 2, 3) — both contributions compose",
      },
      { value: "unknown", label: "Unknown from this declared history" },
    ],
    correct: "lost",
    reveal:
      "Both workers read the old postings (1,) before either writes. A computes (1, 2); B computes (1, 3). B writes last, so the final postings are (1, 3) and document 2 is lost.",
  },
  linearization: {
    legend: "Which patch protects the complete Atlas update invariant?",
    options: [
      { value: "write", label: "Lock only the final dictionary assignment" },
      { value: "read-write", label: "Lock the read and final assignment" },
      {
        value: "logical",
        label: "Protect validate + fold + ledger transition as one unit",
      },
      { value: "gil", label: "Remove the lock because CPython has a GIL" },
    ],
    correct: "logical",
    reveal:
      "The invariant spans validation, reducer-state incorporation, digest update, and terminal classification. Protecting a smaller syntactic region leaves a legal lost-update or split-ledger history.",
  },
  coordination: {
    legend: "The queue is empty but one consumer still owns an item. What follows?",
    options: [
      { value: "published", label: "Publication is permitted" },
      { value: "joined", label: "Queue join must already be ready" },
      { value: "unfinished", label: "Work may remain unfinished" },
      { value: "cancelled", label: "The consumer was cancelled" },
    ],
    correct: "unfinished",
    reveal:
      "Queue empty describes container occupancy. The claimed item still contributes to unfinished-task accounting until its owner acknowledges it; Atlas also needs terminal and semantic commit evidence.",
  },
  progress: {
    legend: "What does the displayed A→B→A wait cycle establish?",
    options: [
      { value: "always", label: "Universal deadlock on every Python runtime" },
      {
        value: "declared",
        label: "Deadlock in the declared non-preemptible resource model",
      },
      { value: "starvation", label: "Starvation freedom" },
      { value: "timeout", label: "Only that a timeout must have fired" },
    ],
    correct: "declared",
    reveal:
      "The cycle is a deadlock witness only with the model’s ownership, capacity, and non-preemption assumptions. A timeout can expose delay; it does not supply those missing assumptions.",
  },
  models: {
    legend:
      "Pure-Python CPU work, live GIL enabled, picklable payload, isolation acceptable: first candidate?",
    options: [
      { value: "thread", label: "Thread pool" },
      { value: "process", label: "Process pool" },
      { value: "async", label: "Async event loop" },
      { value: "more", label: "Whichever model has more workers" },
    ],
    correct: "process",
    reveal:
      "A process pool is the first falsifiable candidate for this declared profile. It crosses serialization and startup boundaries, so result equivalence must be established before timing.",
  },
  evidence: {
    legend: "Which evidence packet permits the Module 18 publication handoff?",
    options: [
      { value: "futures", label: "Every Future is done" },
      { value: "exit", label: "Every worker exited cleanly" },
      { value: "stress", label: "One thousand stress runs passed" },
      {
        value: "oracle",
        label: "All required partitions committed and candidate equals oracle",
      },
    ],
    correct: "oracle",
    reveal:
      "Future completion and process exit are lifecycle evidence. Publication additionally requires exact terminal accounting and byte-for-byte canonical agreement with the independent sequential oracle.",
  },
};

const emptyAnswer = (): AnswerState => ({
  prediction: null,
  confidence: null,
  revealed: false,
  revision: "",
});

const initialAnswers = (): AnswerMap => ({
  history: emptyAnswer(),
  linearization: emptyAnswer(),
  coordination: emptyAnswer(),
  progress: emptyAnswer(),
  models: emptyAnswer(),
  evidence: emptyAnswer(),
});

function progressRecordFromAnswers(answers: AnswerMap): Module19ProgressRecord {
  const gate = (answer: AnswerState): PersistedPredictionGate => ({
    choice: answer.prediction,
    confidence: answer.confidence,
    revealed: answer.revealed,
  });
  return {
    history: gate(answers.history),
    linearization: gate(answers.linearization),
    coordination: gate(answers.coordination),
    progress: gate(answers.progress),
    models: gate(answers.models),
    evidence: gate(answers.evidence),
  };
}

function answersFromProgress(record: Module19ProgressRecord): AnswerMap {
  const answers = initialAnswers();
  for (const view of views) {
    const gate = record[view.id];
    answers[view.id] = {
      prediction: gate.choice,
      confidence: gate.confidence,
      revealed: gate.revealed,
      revision: "",
    };
  }
  return answers;
}

const emptyModelChoice = (): ModelChoiceRecord => ({
  workload: null,
  independence: null,
  sharing: null,
  transfer: null,
  isolation: null,
  lifetime: null,
  failure: null,
  cancellation: null,
  build: null,
  gil: null,
  nativeContract: null,
  candidate: null,
  evidencePlan: null,
});

const emptyCheckpoint = (context = ""): CheckpointRecord => ({
  context,
  prediction: null,
  secondary: null,
  confidence: null,
  revealed: false,
});

const emptyPatchDecisions = (): Record<
  PatchAxis,
  PatchDecision | null
> => ({
  behavior: null,
  tests: null,
  portability: null,
  progress: null,
  modelFit: null,
  documentation: null,
});

const initialRecord = (): StudioRecord => ({
  historySchedule: [],
  completedHistories: [],
  historyCheckpoint: emptyCheckpoint(),
  historyCensusCheckpoint: emptyCheckpoint("all-20-census"),
  linearizationPatch: "narrow",
  protectedSteps: [4],
  linearizationCheckpoint: emptyCheckpoint(),
  coordinationInstrument: "queue",
  coordinationActions: [],
  coordinationPendingAction: null,
  coordinationCheckpoint: emptyCheckpoint(),
  progressScenario: "cycle",
  progressEdges: [],
  modelChoice: emptyModelChoice(),
  evidenceVariant: "owner",
  patchDecisions: emptyPatchDecisions(),
});

function misconceptionLabels(answers: AnswerMap) {
  return views
    .filter((view) => {
      const answer = answers[view.id];
      return (
        answer.revealed &&
        answer.prediction !== null &&
        answer.prediction !== predictionSets[view.id].correct
      );
    })
    .map((view) => view.label);
}

function panelId(view: ConcurrencyView) {
  return `concurrency-panel-${view}`;
}

function tabId(view: ConcurrencyView) {
  return `concurrency-tab-${view}`;
}

function clearStoredStudio() {
  try {
    clearModule19Progress(window.localStorage);
  } catch {
    return false;
  }
  return true;
}

function InvariantPlate() {
  return (
    <details className={styles.invariantPlate}>
      <summary>
        <span>Cumulative invariant</span>
        <strong>Keep the whole proof in view</strong>
      </summary>
      <p>{CENTRAL_INVARIANT}</p>
    </details>
  );
}

function RuntimeProfilePlate() {
  return (
    <aside
      aria-label="Executed Module 19 runtime profile"
      className={styles.runtimeCompact}
    >
      <div>
        <span>Executed profile</span>
        <strong>{RUNTIME_PROFILE.python}</strong>
      </div>
      <div>
        <span>Build</span>
        <strong>{RUNTIME_PROFILE.build}</strong>
      </div>
      <div>
        <span>Live GIL</span>
        <strong>{RUNTIME_PROFILE.liveGil}</strong>
      </div>
      <div>
        <span>Unvalidated adapters</span>
        <strong>free-threaded · interpreters</strong>
      </div>
      <p>
        This is an executed local profile, not a portable language guarantee or
        a speedup result.
      </p>
    </aside>
  );
}

function EvidenceLock({ children }: { children: ReactNode }) {
  return (
    <div className={styles.evidenceLock} role="status">
      <span>Evidence covered</span>
      <p>{children}</p>
    </div>
  );
}

function PredictionGate({
  view,
  answer,
  onChange,
}: {
  view: ConcurrencyView;
  answer: AnswerState;
  onChange: (next: AnswerState) => void;
}) {
  const prompt = predictionSets[view];
  const { prediction, confidence } = answer;
  const revealDisabled = prediction === null || confidence === null;
  const correct = prediction === prompt.correct;

  return (
    <section className={styles.predictionGate} aria-label="Prediction gate">
      <div className={styles.gateHeader}>
        <span>Predict → commit confidence → inspect evidence → revise</span>
        <small>No answer is preselected.</small>
      </div>
      <fieldset>
        <legend>{prompt.legend}</legend>
        <div className={styles.optionGrid}>
          {prompt.options.map((option) => (
            <label key={option.value}>
              <input
                checked={prediction === option.value}
                disabled={answer.revealed}
                name={`${view}-prediction`}
                onChange={() =>
                  onChange({ ...answer, prediction: option.value })
                }
                type="radio"
                value={option.value}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend>Confidence</legend>
        <div className={styles.confidenceScale}>
          {([1, 2, 3, 4] as const).map((value) => (
            <label key={value}>
              <input
                checked={confidence === value}
                disabled={answer.revealed}
                name={`${view}-confidence`}
                onChange={() => onChange({ ...answer, confidence: value })}
                type="radio"
                value={value}
              />
              <span>
                {value}
                <small>
                  {value === 1
                    ? "guess"
                    : value === 2
                      ? "lean"
                      : value === 3
                        ? "reasoned"
                        : "can defend"}
                </small>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {!answer.revealed ? (
        <button
          className={styles.revealButton}
          disabled={revealDisabled}
          onClick={() => onChange({ ...answer, revealed: true })}
          type="button"
        >
          Reveal the trace evidence
        </button>
      ) : (
        <div className={styles.revealCard} aria-live="polite">
          <span className={correct ? styles.correct : styles.rethink}>
            {correct ? "Model aligned" : "Revise the model"}
          </span>
          <p>{prompt.reveal}</p>
          <label>
            <strong>Revise after evidence</strong>
            <textarea
              maxLength={480}
              onChange={(event) =>
                onChange({ ...answer, revision: event.target.value })
              }
              placeholder="What changed in your mental model? Keep private data and raw code out of this field."
              value={answer.revision}
            />
          </label>
          <small>
            Revision text stays in memory for this visit and is not persisted.
          </small>
        </div>
      )}
    </section>
  );
}

function CheckpointGate({
  id,
  title,
  note,
  context,
  record,
  onChange,
  primaryLegend,
  primaryOptions,
  secondaryLegend,
  secondaryOptions,
  commitLabel,
}: {
  id: string;
  title: string;
  note: string;
  context: string;
  record: CheckpointRecord;
  onChange: (next: CheckpointRecord) => void;
  primaryLegend: string;
  primaryOptions: ReadonlyArray<{ value: string; label: string }>;
  secondaryLegend: string;
  secondaryOptions: ReadonlyArray<{ value: string; label: string }>;
  commitLabel: string;
}) {
  const active =
    record.context === context ? record : emptyCheckpoint(context);
  const disabled =
    active.prediction === null ||
    active.secondary === null ||
    active.confidence === null;

  const revise = (patch: Partial<CheckpointRecord>) => {
    onChange({
      ...active,
      ...patch,
      context,
      revealed: false,
    });
  };

  return (
    <section
      aria-label={`${title} prediction checkpoint`}
      className={`${styles.predictionGate} ${styles.checkpointGate}`}
    >
      <div className={styles.gateHeader}>
        <span>{title}</span>
        <small>{note}</small>
      </div>
      <fieldset>
        <legend>{primaryLegend}</legend>
        <div className={styles.optionGrid}>
          {primaryOptions.map((option) => (
            <label key={option.value}>
              <input
                checked={active.prediction === option.value}
                disabled={active.revealed}
                name={`${id}-${context}-primary`}
                onChange={() => revise({ prediction: option.value })}
                type="radio"
                value={option.value}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend>{secondaryLegend}</legend>
        <div className={styles.optionGrid}>
          {secondaryOptions.map((option) => (
            <label key={option.value}>
              <input
                checked={active.secondary === option.value}
                disabled={active.revealed}
                name={`${id}-${context}-secondary`}
                onChange={() => revise({ secondary: option.value })}
                type="radio"
                value={option.value}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend>Confidence before this evidence</legend>
        <div className={styles.confidenceScale}>
          {([1, 2, 3, 4] as const).map((value) => (
            <label key={value}>
              <input
                checked={active.confidence === value}
                disabled={active.revealed}
                name={`${id}-${context}-confidence`}
                onChange={() => revise({ confidence: value })}
                type="radio"
                value={value}
              />
              <span>
                {value}
                <small>
                  {value === 1
                    ? "guess"
                    : value === 2
                      ? "lean"
                      : value === 3
                        ? "reasoned"
                        : "can defend"}
                </small>
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      {!active.revealed ? (
        <button
          className={styles.revealButton}
          disabled={disabled}
          onClick={() => onChange({ ...active, context, revealed: true })}
          type="button"
        >
          {commitLabel}
        </button>
      ) : (
        <div className={styles.checkpointReleased} role="status">
          Prediction and confidence committed. The bounded evidence below is now
          available for this exact state.
        </div>
      )}
    </section>
  );
}

function EvidenceBoundary({
  proves,
  unknown,
}: {
  proves: ReactNode;
  unknown: ReactNode;
}) {
  return (
    <div className={styles.evidenceBoundary}>
      <div>
        <span>What this proves</span>
        <p>{proves}</p>
      </div>
      <div>
        <span>What remains unknown</span>
        <p>{unknown}</p>
      </div>
    </div>
  );
}

function HistoryExplorer({
  answer,
  onChange,
  record,
  onRecordChange,
}: {
  answer: AnswerState;
  onChange: (next: AnswerState) => void;
  record: StudioRecord;
  onRecordChange: (next: StudioRecord) => void;
}) {
  const schedule = record.historySchedule;
  const trace = traceHistory(schedule);
  const aCount = schedule.filter((worker) => worker === "A").length;
  const bCount = schedule.filter((worker) => worker === "B").length;
  const slots = Array.from({ length: 6 }, (_, index) => trace.rows[index]);
  const historyContext = schedule.length === 6 ? schedule.join("") : "";
  const historyEvidenceRevealed =
    historyContext !== "" &&
    record.historyCheckpoint.context === historyContext &&
    record.historyCheckpoint.revealed;
  const censusEvidenceRevealed =
    record.historyCensusCheckpoint.context === "all-20-census" &&
    record.historyCensusCheckpoint.revealed;

  const formatSchedule = (candidate: ReadonlyArray<WorkerId>) => {
    const counts: Record<WorkerId, number> = { A: 0, B: 0 };
    return candidate
      .map((worker) => {
        const operation = HISTORY_OPERATIONS[counts[worker]];
        counts[worker] += 1;
        return `${worker}:${operation}`;
      })
      .join(" → ");
  };

  const setSchedule = (nextSchedule: WorkerId[]) => {
    onRecordChange({
      ...record,
      historySchedule: nextSchedule,
    });
  };

  const appendWorker = (worker: WorkerId) => {
    const workerCount = worker === "A" ? aCount : bCount;
    if (workerCount >= 3 || schedule.length >= 6) return;
    const nextSchedule = [...schedule, worker];
    setSchedule(nextSchedule);
  };

  const inspectNextUnexplored = () => {
    const next =
      ALL_TWO_WORKER_SCHEDULES.find(
        (candidate) => !record.completedHistories.includes(candidate.join("")),
      ) ?? ALL_TWO_WORKER_SCHEDULES[0];
    setSchedule(next);
  };

  const updateHistoryCheckpoint = (next: CheckpointRecord) => {
    const completedHistories =
      next.revealed && HISTORY_SCHEDULE_KEYS.has(historyContext)
        ? [...new Set([...record.completedHistories, historyContext])]
        : record.completedHistories;
    onRecordChange({
      ...record,
      historyCheckpoint: next,
      completedHistories,
    });
  };

  return (
    <div className={styles.viewStack}>
      <div className={styles.viewIntro}>
        <div>
          <p className={styles.eyebrow}>Finite model · complete state space</p>
          <h3>The second worker creates histories.</h3>
          <p>
            The term is “graph”, and the fixture starts with postings{" "}
            <strong>(1,)</strong>. Partition A contributes document 2 and
            partition B contributes document 3. Their two R→C→W workers have{" "}
            <strong>20 legal schedules</strong>.
          </p>
        </div>
      </div>

      <PredictionGate answer={answer} onChange={onChange} view="history" />

      {!answer.revealed ? (
        <EvidenceLock>
          Commit a postings prediction and confidence before the finite-model
          result, schedule builder, and oracle comparison are shown.
        </EvidenceLock>
      ) : (
        <>
          <section
            aria-label="Construct a legal two-worker history"
            className={styles.historyBuilder}
          >
            <div>
              <span>Explored finite histories</span>
              <strong>{record.completedHistories.length} / 20</strong>
              <small>
                Model coverage only; this is not a host scheduler trace.
              </small>
            </div>
            <div
              aria-label="Choose the next enabled worker"
              className={styles.builderControls}
              role="group"
            >
              <button
                disabled={aCount >= 3 || schedule.length >= 6}
                onClick={() => appendWorker("A")}
                type="button"
              >
                Next A · {HISTORY_OPERATIONS[aCount] ?? "done"}
              </button>
              <button
                disabled={bCount >= 3 || schedule.length >= 6}
                onClick={() => appendWorker("B")}
                type="button"
              >
                Next B · {HISTORY_OPERATIONS[bCount] ?? "done"}
              </button>
              <button
                disabled={schedule.length === 0}
                onClick={() => setSchedule(schedule.slice(0, -1))}
                type="button"
              >
                Undo event
              </button>
              <button onClick={() => setSchedule([])} type="button">
                Clear history
              </button>
              <button onClick={inspectNextUnexplored} type="button">
                Inspect next unexplored
              </button>
            </div>
          </section>

          {schedule.length === 6 ? (
            <CheckpointGate
              commitLabel="Commit this history prediction"
              context={historyContext}
              id="history-result"
              note="The event order is visible; local/shared state and the verdict remain covered."
              onChange={updateHistoryCheckpoint}
              primaryLegend="Predict the final shared postings for this exact six-event history."
              primaryOptions={[
                { value: "postings-1", label: "(1,)" },
                { value: "postings-12", label: "(1, 2)" },
                { value: "postings-13", label: "(1, 3)" },
                { value: "postings-123", label: "(1, 2, 3)" },
              ]}
              record={record.historyCheckpoint}
              secondaryLegend="Predict the safety verdict relative to the sequential oracle."
              secondaryOptions={[
                {
                  value: "serial-equivalent",
                  label: "Serial-equivalent for this fixture",
                },
                {
                  value: "violating",
                  label: "Violating: a contribution is lost",
                },
                {
                  value: "insufficient",
                  label: "Insufficient information from the event order",
                },
              ]}
              title="Per-history checkpoint"
            />
          ) : (
            <div className={styles.checkpointReleased} role="status">
              Construct all six enabled events. The schedule is a plan; its
              local snapshots, shared states, and safety verdict stay covered
              until you predict them with confidence.
            </div>
          )}

          <div className={styles.executionScore}>
            <div className={styles.scoreLegend}>
              <span>R · read postings</span>
              <span>C · compute local union</span>
              <span>W · write shared postings</span>
            </div>
            <div className={styles.rail}>
              <strong>worker A</strong>
              {slots.map((item, index) => (
                <i
                  className={
                    item?.event.startsWith("A") ? styles.eventActive : undefined
                  }
                  key={`a-${index}`}
                >
                  {item?.event.startsWith("A") ? item.event.slice(2) : "·"}
                </i>
              ))}
            </div>
            <div className={styles.sharedSpine}>
              <strong>shared</strong>
              {slots.map((item, index) => (
                <i
                  className={item ? styles.eventActive : undefined}
                  key={`s-${index}`}
                >
                  {item
                    ? historyEvidenceRevealed
                      ? item.shared
                      : "?"
                    : "·"}
                </i>
              ))}
            </div>
            <div className={styles.rail}>
              <strong>worker B</strong>
              {slots.map((item, index) => (
                <i
                  className={
                    item?.event.startsWith("B") ? styles.eventActive : undefined
                  }
                  key={`b-${index}`}
                >
                  {item?.event.startsWith("B") ? item.event.slice(2) : "·"}
                </i>
              ))}
            </div>
            <div className={styles.historyVerdict} aria-live="polite">
              <span>{schedule.length} / 6 events chosen</span>
              {schedule.length === 6 && historyEvidenceRevealed ? (
                <strong>
                  {trace.serialEquivalent
                    ? `Serial-equivalent · ${trace.finalValue}`
                    : `Violating · ${trace.finalValue} ≠ (1, 2, 3)`}
                </strong>
              ) : schedule.length === 6 ? (
                <strong>Commit next-state, safety, and confidence first.</strong>
              ) : (
                <strong>Choose the next enabled worker.</strong>
              )}
            </div>
          </div>

          {historyEvidenceRevealed ? (
            <details className={styles.textEquivalent} open>
              <summary>Text/table equivalent of the execution score</summary>
              <div className={styles.tableScroll}>
                <table>
                  <thead>
                    <tr>
                      <th>Order</th>
                      <th>Event</th>
                      <th>Invocation / response</th>
                      <th>Worker A local</th>
                      <th>Worker B local</th>
                      <th>Shared postings</th>
                      <th>Sequential oracle</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trace.rows.map((item) => (
                      <tr key={`${item.order}-${item.event}`}>
                        <td>{item.order}</td>
                        <td>{item.event}</td>
                        <td>
                          {item.invocation}; {item.response}
                        </td>
                        <td>{item.a}</td>
                        <td>{item.b}</td>
                        <td>{item.shared}</td>
                        <td>{item.oracle}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
          ) : (
            <div className={styles.checkpointReleased} role="status">
              The invocation/response trace and shared-state table remain
              covered for this schedule.
            </div>
          )}

          <CheckpointGate
            commitLabel="Commit the census prediction"
            context="all-20-census"
            id="history-census"
            note="This is a second, aggregate claim—not the answer to one chosen history."
            onChange={(next) =>
              onRecordChange({ ...record, historyCensusCheckpoint: next })
            }
            primaryLegend="Before opening the census, how many of the 20 legal schedules preserve the oracle postings?"
            primaryOptions={[
              { value: "count-2", label: "2 schedules" },
              { value: "count-6", label: "6 schedules" },
              { value: "count-18", label: "18 schedules" },
              { value: "count-20", label: "all 20 schedules" },
            ]}
            record={record.historyCensusCheckpoint}
            secondaryLegend="What dominates the violating histories in this declared model?"
            secondaryOptions={[
              {
                value: "lost-update",
                label: "A stale read–compute–write loses one contribution",
              },
              { value: "split-ledger", label: "A terminal-ledger split" },
              {
                value: "no-counterexample",
                label: "No counterexample exists",
              },
              {
                value: "insufficient",
                label: "The finite model cannot classify its own histories",
              },
            ]}
            title="Complete-state-space checkpoint"
          />

          {censusEvidenceRevealed && (
            <>
              <dl className={styles.metricTriptych}>
                <div>
                  <dt>20</dt>
                  <dd>legal schedules</dd>
                </div>
                <div>
                  <dt>18</dt>
                  <dd>one contribution lost</dd>
                </div>
                <div>
                  <dt>2</dt>
                  <dd>oracle postings preserved</dd>
                </div>
              </dl>

              <details className={styles.textEquivalent}>
                <summary>All 20 legal schedules and explored-state record</summary>
                <div className={styles.tableScroll}>
                  <table>
                    <thead>
                      <tr>
                        <th>Schedule</th>
                        <th>Finite-model result</th>
                        <th>Explored here</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ALL_TWO_WORKER_SCHEDULES.map((candidate) => {
                        const key = candidate.join("");
                        const candidateTrace = traceHistory(candidate);
                        return (
                          <tr key={key}>
                            <td>{formatSchedule(candidate)}</td>
                            <td>
                              {candidateTrace.serialEquivalent
                                ? `serial-equivalent · ${candidateTrace.finalValue}`
                                : `violating · ${candidateTrace.finalValue}`}
                            </td>
                            <td>
                              {record.completedHistories.includes(key)
                                ? "yes"
                                : "no"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </details>
            </>
          )}

          <EvidenceBoundary
            proves="All 20 merges preserving each worker’s local R→C→W order are enumerated for the declared two-partition postings fixture."
            unknown="Which schedule a host OS will choose, what other shared state exists, or whether any unmodeled history is safe."
          />
        </>
      )}
      <InvariantPlate />
    </div>
  );
}

function LinearizationLab({
  answer,
  onChange,
  record,
  onRecordChange,
}: {
  answer: AnswerState;
  onChange: (next: AnswerState) => void;
  record: StudioRecord;
  onRecordChange: (next: StudioRecord) => void;
}) {
  const steps = [
    "read current postings",
    "compute local union",
    "validate immutable partial",
    "update terminal ledger",
    "fold postings + digest",
  ];
  const patches: Record<
    LockPatch,
    {
      label: string;
      verdict: string;
      protected: number[];
      note: string;
      owner: string;
    }
  > = {
    shared: {
      label: "Sharded worker-local locks",
      verdict: "Shared reducer race exposed",
      protected: [],
      note: "Each local shard is valid, but separate locks do not compose the shared fold.",
      owner: "several workers behind unrelated locks",
    },
    narrow: {
      label: "Narrow assignment lock",
      verdict: "Still unsafe",
      protected: [4],
      note: "Both workers can compute from the same stale snapshot.",
      owner: "several workers around one write",
    },
    wide: {
      label: "Invariant-wide lock",
      verdict: "Safe if progress assumptions hold",
      protected: [0, 1, 2, 3, 4],
      note: "The linearization point is inside one protected logical transition.",
      owner: "current lock holder",
    },
    owner: {
      label: "Single-owner reducer",
      verdict: "Preferred Atlas shape",
      protected: [0, 1, 2, 3, 4],
      note: "Workers share results, not the reducer’s mutable state.",
      owner: "one reducer",
    },
  };
  const selected = patches[record.linearizationPatch];
  const completeBoundary = steps.every((_, index) =>
    record.protectedSteps.includes(index),
  );
  const counterexampleRemains =
    record.linearizationPatch !== "owner" && !completeBoundary;
  const linearizationContext = `${record.linearizationPatch}:${
    record.protectedSteps.join(",") || "none"
  }`;
  const linearizationEvidenceRevealed =
    record.linearizationCheckpoint.context === linearizationContext &&
    record.linearizationCheckpoint.revealed;

  const selectPatch = (patch: LockPatch) => {
    onRecordChange({
      ...record,
      linearizationPatch: patch,
      protectedSteps: patches[patch].protected,
    });
  };

  const toggleProtectedStep = (index: number) => {
    const protectedSteps = record.protectedSteps.includes(index)
      ? record.protectedSteps.filter((candidate) => candidate !== index)
      : [...record.protectedSteps, index].sort((left, right) => left - right);
    onRecordChange({ ...record, protectedSteps });
  };

  return (
    <div className={styles.viewStack}>
      <div className={styles.viewIntro}>
        <div>
          <p className={styles.eyebrow}>Safety · linearizability · ownership</p>
          <h3>A lock protects an invariant, not a line.</h3>
          <p>
            First name the sequential transition. Then choose a protocol whose
            scope makes every legal concurrent history appear as a legal
            sequential one.
          </p>
        </div>
      </div>

      <PredictionGate
        answer={answer}
        onChange={onChange}
        view="linearization"
      />

      {!answer.revealed ? (
        <EvidenceLock>
          Predict the patch and commit confidence before counterexamples,
          protected steps, or a linearization verdict appear.
        </EvidenceLock>
      ) : (
        <>
          <div
            aria-label="Compare synchronization protocols"
            className={styles.segmentedControl}
            role="group"
          >
            {(Object.keys(patches) as LockPatch[]).map((key) => (
              <button
                aria-pressed={record.linearizationPatch === key}
                key={key}
                onClick={() => selectPatch(key)}
                type="button"
              >
                {patches[key].label}
              </button>
            ))}
          </div>

          <div className={styles.persistentCard}>
            <strong>Atomic line ≠ atomic application operation</strong>
            <p>
              The proof boundary must cover every shared step in one logical
              validate→ledger→fold transition, or assign that transition to one
              owner.
            </p>
            <small>
              Declared order: validated partial → terminal ledger → reducer
              snapshot → Module 18 publisher. Release on every exception path;
              never call an unbounded callback while owning the transition.
            </small>
          </div>

          <div className={styles.criticalSection}>
            <header>
              <span>Boundary proposal · evidence covered</span>
              <strong>{selected.label}</strong>
            </header>
            <ol
              aria-label="Toggle the declared critical-section boundary"
              className={styles.boundarySteps}
            >
              {steps.map((item, index) => (
                <li
                  className={
                    record.protectedSteps.includes(index)
                      ? styles.protectedStep
                      : undefined
                  }
                  key={item}
                >
                  <button
                    aria-pressed={record.protectedSteps.includes(index)}
                    onClick={() => toggleProtectedStep(index)}
                    type="button"
                  >
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <strong>{item}</strong>
                    <small>
                      {record.protectedSteps.includes(index)
                        ? record.linearizationPatch === "owner"
                          ? "single-owner protocol"
                          : "inside declared lock boundary"
                        : "outside declared protocol"}
                    </small>
                  </button>
                </li>
              ))}
            </ol>
            <p>
              Place the boundary first. The finite counterexample and candidate
              linearization point stay hidden until you predict both.
            </p>
          </div>

          <CheckpointGate
            commitLabel="Commit failing-history and linearization predictions"
            context={linearizationContext}
            id="linearization-probe"
            note="Changing the protocol or any protected step creates a new checkpoint."
            onChange={(next) =>
              onRecordChange({ ...record, linearizationCheckpoint: next })
            }
            primaryLegend="Predict the failing history that remains for this exact boundary."
            primaryOptions={[
              {
                value: "lost-update",
                label: "Stale reads permit a lost reducer update",
              },
              {
                value: "split-ledger",
                label: "Fold and terminal ledger can split",
              },
              {
                value: "no-counterexample",
                label: "No counterexample remains in the declared model",
              },
              {
                value: "insufficient",
                label: "Insufficient evidence to predict",
              },
            ]}
            record={record.linearizationCheckpoint}
            secondaryLegend="Where can this chosen protocol linearize the logical Atlas transition?"
            secondaryOptions={[
              {
                value: "point-none",
                label: "Nowhere justified; the transition may split",
              },
              {
                value: "point-validation",
                label: "At immutable-partial validation alone",
              },
              {
                value: "point-assignment",
                label: "At the final postings assignment alone",
              },
              {
                value: "point-fold-ledger",
                label: "At the protected fold + terminal classification",
              },
              {
                value: "point-owner",
                label: "At the single reducer’s owned fold + classification",
              },
            ]}
            title="Counterexample checkpoint"
          />

          {linearizationEvidenceRevealed && (
            <>
              <div className={styles.criticalSection}>
                <header>
                  <span>
                    {counterexampleRemains
                      ? "Finite counterexample remains"
                      : selected.verdict}
                  </span>
                  <strong>{selected.label}</strong>
                </header>
                <p>{selected.note}</p>
                <p aria-live="polite">
                  <strong>Candidate linearization point:</strong>{" "}
                  {counterexampleRemains
                    ? "none justified—the shared transition can split"
                    : record.linearizationPatch === "owner"
                      ? "the single reducer’s validated fold + ledger classification"
                      : "the protected fold + ledger classification"}
                </p>
              </div>

              <div className={styles.tableScroll}>
            <table>
              <caption>
                Text equivalent: candidate protocol, owner, exception, and
                progress boundary
              </caption>
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Shared-transition owner</th>
                  <th>Safety reading</th>
                  <th>Exception / progress boundary</th>
                </tr>
              </thead>
              <tbody>
                {(Object.keys(patches) as LockPatch[]).map((key) => (
                  <tr key={key}>
                    <td>{patches[key].label}</td>
                    <td>{patches[key].owner}</td>
                    <td>
                      {key === "shared" || key === "narrow"
                        ? "finite counterexample exists"
                        : "declared transition can linearize"}
                    </td>
                    <td>
                      release on exception; waiter order and fairness remain
                      unspecified
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
              </div>

              <EvidenceBoundary
                proves="The exhaustive narrow-lock model still contains a lost update; the full-boundary and single-owner teaching models preserve the declared postings transition."
                unknown="Fair acquisition, blocking callbacks, exception cleanup outside the shown protocol, and any state omitted from the finite model."
              />
            </>
          )}
        </>
      )}

      <InvariantPlate />
    </div>
  );
}

function CoordinationConsole({
  answer,
  onChange,
  record,
  onRecordChange,
}: {
  answer: AnswerState;
  onChange: (next: AnswerState) => void;
  record: StudioRecord;
  onRecordChange: (next: StudioRecord) => void;
}) {
  const instruments = {
    condition: {
      noun: "predicate",
      question: "May this waiter proceed while holding the associated lock?",
      rule: "Wait in a loop; notification is a hint to re-check.",
      anti: "notify() does not transfer a specific item or prove fairness.",
    },
    semaphore: {
      noun: "permit",
      question: "Is capacity available under the declared permit count?",
      rule: "One successful acquire consumes one permit; release restores it.",
      anti: "A permit does not identify or transfer a queue item.",
    },
    queue: {
      noun: "item ownership",
      question: "Who owns the item, and has its work been acknowledged?",
      rule: "get() claims an item; task_done() discharges unfinished work.",
      anti: "empty() and qsize() are observations, not completion proofs.",
    },
    future: {
      noun: "task lifecycle",
      question: "Is the task pending, running, cancelled, or finished?",
      rule: "A pending Future may cancel; a running Future need not.",
      anti: "result(timeout) stops waiting—it does not stop the function.",
    },
  };
  const selected = instruments[record.coordinationInstrument];
  const state = replayCoordination(record.coordinationActions);
  const publicationPermitted =
    state.terminal.length === 2 && !state.immediateShutdown;
  const joinReady = state.unfinished === 0;
  const actionLabels: Record<CoordinationAction, string> = {
    put: "put item",
    get: "get item",
    task_done: "task_done",
    commit: "commit partial",
    wait: "condition wait",
    notify: "condition notify",
    join: "queue join",
    stop: "graceful stop",
    immediate_stop: "immediate stop",
    acquire: "acquire permit",
    release: "release permit",
  };

  const appendAction = (action: CoordinationAction) => {
    onRecordChange({
      ...record,
      coordinationActions: [...record.coordinationActions, action].slice(-40),
    });
  };
  const coordinationCheckpointContext =
    record.coordinationPendingAction === null
      ? ""
      : `${
          record.coordinationActions.join(",") || "start"
        }|${record.coordinationPendingAction}`;
  const requestAction = (action: CoordinationAction) => {
    if (!GATED_COORDINATION_ACTIONS.includes(action)) {
      appendAction(action);
      return;
    }
    const context = `${
      record.coordinationActions.join(",") || "start"
    }|${action}`;
    onRecordChange({
      ...record,
      coordinationPendingAction: action,
      coordinationCheckpoint: emptyCheckpoint(context),
    });
  };
  const updateCoordinationCheckpoint = (next: CheckpointRecord) => {
    const pending = record.coordinationPendingAction;
    if (next.revealed && pending !== null) {
      onRecordChange({
        ...record,
        coordinationActions: [...record.coordinationActions, pending].slice(-40),
        coordinationPendingAction: null,
        coordinationCheckpoint: next,
      });
      return;
    }
    onRecordChange({ ...record, coordinationCheckpoint: next });
  };

  const partitionState = (worker: WorkerId) => {
    if (state.terminal.includes(worker)) return "COMMITTED";
    if (state.cancelled.includes(worker)) return "CANCELLED";
    if (state.partialReady.includes(worker)) return "PARTIAL_READY · preterminal";
    if (state.inFlight.includes(worker)) return "CLAIMED";
    if (state.queue.includes(worker)) return "ENQUEUED";
    return "not admitted";
  };

  return (
    <div className={styles.viewStack}>
      <div className={styles.viewIntro}>
        <div>
          <p className={styles.eyebrow}>Predicates · permits · items · Futures</p>
          <h3>Choose the primitive by the question it answers.</h3>
          <p>
            Similar-looking blocking APIs carry different state and ownership
            contracts. Atlas keeps their ledgers separate.
          </p>
        </div>
      </div>

      <PredictionGate
        answer={answer}
        onChange={onChange}
        view="coordination"
      />

      {!answer.revealed ? (
        <EvidenceLock>
          Commit the claimed-item prediction and confidence before queue
          occupancy, unfinished work, or the stepwise protocol state appears.
        </EvidenceLock>
      ) : (
        <>
          <div
            aria-label="Choose a coordination instrument"
            className={styles.instrumentDial}
            role="group"
          >
            {(Object.keys(instruments) as CoordinationInstrument[]).map(
              (key) => (
                <button
                  aria-pressed={record.coordinationInstrument === key}
                  key={key}
                  onClick={() =>
                    onRecordChange({
                      ...record,
                      coordinationInstrument: key,
                    })
                  }
                  type="button"
                >
                  {key}
                </button>
              ),
            )}
          </div>

          <div className={styles.coordinationInstrument} aria-live="polite">
            <span>{selected.noun}</span>
            <h4>{selected.question}</h4>
            <div>
              <p>
                <strong>Protocol</strong>
                {selected.rule}
              </p>
              <p>
                <strong>Do not infer</strong>
                {selected.anti}
              </p>
            </div>
          </div>

          <section
            aria-label="Step the coordination protocol"
            className={styles.protocolConsole}
          >
            <header>
              <div>
                <span>Stepwise teaching model</span>
                <strong>{state.last}</strong>
                <small>
                  maxsize=2 is local admission and flow control—not distributed
                  backpressure.
                </small>
              </div>
              <div className={styles.builderControls}>
                <button
                  onClick={() =>
                    onRecordChange({
                      ...record,
                      coordinationActions: ["put", "get"],
                      coordinationPendingAction: null,
                      coordinationCheckpoint: emptyCheckpoint(),
                    })
                  }
                  type="button"
                >
                  Load claimed-item counterexample
                </button>
                <button
                  onClick={() =>
                    onRecordChange({
                      ...record,
                      coordinationActions: [],
                      coordinationPendingAction: null,
                      coordinationCheckpoint: emptyCheckpoint(),
                    })
                  }
                  type="button"
                >
                  Clear protocol trace
                </button>
              </div>
            </header>
            <div
              aria-label="Queue and reducer actions"
              className={styles.actionPalette}
              role="group"
            >
              {(
                [
                  "put",
                  "get",
                  "task_done",
                  "commit",
                  "join",
                  "stop",
                  "immediate_stop",
                ] as CoordinationAction[]
              ).map((action) => (
                <button
                  disabled={record.coordinationPendingAction !== null}
                  key={action}
                  onClick={() => requestAction(action)}
                  type="button"
                >
                  {actionLabels[action]}
                </button>
              ))}
            </div>
            <div
              aria-label="Condition and semaphore actions"
              className={styles.actionPalette}
              role="group"
            >
              {(
                ["wait", "notify", "acquire", "release"] as CoordinationAction[]
              ).map((action) => (
                <button
                  disabled={record.coordinationPendingAction !== null}
                  key={action}
                  onClick={() => requestAction(action)}
                  type="button"
                >
                  {actionLabels[action]}
                </button>
              ))}
            </div>
          </section>

          {record.coordinationPendingAction !== null && (
            <CheckpointGate
              commitLabel={`Commit prediction, then execute ${actionLabels[record.coordinationPendingAction]}`}
              context={coordinationCheckpointContext}
              id="coordination-action"
              note="The selected operation has not executed; its wake/block/accounting result is still covered."
              onChange={updateCoordinationCheckpoint}
              primaryLegend={`What will ${actionLabels[record.coordinationPendingAction]} do in the current state?`}
              primaryOptions={[
                {
                  value: "operation-proceeds",
                  label: "The operation proceeds and changes protocol state",
                },
                {
                  value: "operation-blocks",
                  label: "The operation remains waiting or would block",
                },
                {
                  value: "wake-recheck",
                  label: "A waiter wakes but must reacquire and re-check",
                },
                {
                  value: "admission-closes",
                  label: "Admission closes; existing accounting still governs",
                },
              ]}
              record={record.coordinationCheckpoint}
              secondaryLegend="Which fact decides the observation?"
              secondaryOptions={[
                {
                  value: "fact-occupancy",
                  label: "Queue occupancy at the instant of get",
                },
                {
                  value: "fact-unfinished",
                  label: "Unfinished-task accounting, including claimed work",
                },
                {
                  value: "fact-predicate",
                  label: "The condition predicate after lock reacquisition",
                },
                {
                  value: "fact-terminal",
                  label: "Atlas terminal classifications and reduction gate",
                },
                {
                  value: "fact-permit",
                  label: "The semaphore permit count",
                },
              ]}
              title="Action-specific coordination checkpoint"
            />
          )}

          {record.coordinationPendingAction === null &&
            record.coordinationCheckpoint.revealed && (
              <div className={styles.checkpointReleased} role="status">
                The last gated wake/queue/join/shutdown operation executed only
                after an outcome, governing fact, and confidence were committed.
              </div>
            )}

          <div className={styles.completionLedger}>
            <div>
              <span>Queue contents</span>
              <strong>{state.queue.length}</strong>
              <small>{state.queue.join(", ") || "container empty"}</small>
            </div>
            <div>
              <span>Unfinished tasks · In flight items</span>
              <strong>{state.unfinished}</strong>
              <small>
                {state.inFlight.length
                  ? `${state.inFlight.join(", ")} consumer-owned`
                  : "no claimed item"}
              </small>
            </div>
            <div>
              <span>Queue join gate</span>
              <strong>{joinReady ? "ready" : "waiting"}</strong>
              <small>
                {state.immediateShutdown
                  ? joinReady
                    ? "drained queued work broke the usual work-complete inference"
                    : "claimed work remains unfinished, so join still waits"
                  : "derived only from unfinished-task accounting"}
              </small>
            </div>
            <div>
              <span>Condition state</span>
              <strong>{state.waiter}</strong>
              <small>notification still requires lock reacquire + re-check</small>
            </div>
            <div>
              <span>Semaphore permits</span>
              <strong>{state.permits} / 2</strong>
              <small>capacity only; no item identity</small>
            </div>
            <div>
              <span>Lock owner</span>
              <strong>{state.lockOwner}</strong>
              <small>ownership at the last modeled transition</small>
            </div>
            <div>
              <span>Terminal set</span>
              <strong>
                COMMITTED: {state.terminal.join(", ") || "none"} · CANCELLED:{" "}
                {state.cancelled.join(", ") || "none"} · FAILED: none
              </strong>
              <small>exactly one terminal class per admitted partition</small>
            </div>
          </div>

          <div className={styles.partitionLifecycle}>
            <div>
              <span>Partition A lifecycle</span>
              <strong>{partitionState("A")}</strong>
            </div>
            <div>
              <span>Partition B lifecycle</span>
              <strong>{partitionState("B")}</strong>
            </div>
            <div>
              <span>Reduction gate</span>
              <strong>{publicationPermitted ? "eligible" : "closed"}</strong>
              <small>
                semantic oracle equality is still a separate evidence axis
              </small>
            </div>
          </div>

          <div className={styles.tableScroll}>
            <table>
              <caption>
                Text equivalent: action log and the four ledgers it changes
              </caption>
              <thead>
                <tr>
                  <th>Step</th>
                  <th>Action</th>
                  <th>Queue</th>
                  <th>Claimed</th>
                  <th>Preterminal</th>
                  <th>Terminal</th>
                  <th>Unfinished</th>
                </tr>
              </thead>
              <tbody>
                {record.coordinationActions.length === 0 ? (
                  <tr>
                    <td colSpan={7}>No coordination action has run yet.</td>
                  </tr>
                ) : (
                  record.coordinationActions.map((action, index) => {
                    const snapshot = replayCoordination(
                      record.coordinationActions.slice(0, index + 1),
                    );
                    return (
                      <tr key={`${index}-${action}`}>
                        <td>{index + 1}</td>
                        <td>{actionLabels[action]}</td>
                        <td>{snapshot.queue.join(", ") || "empty"}</td>
                        <td>{snapshot.inFlight.join(", ") || "none"}</td>
                        <td>{snapshot.partialReady.join(", ") || "none"}</td>
                        <td>
                          {[
                            ...snapshot.terminal.map(
                              (worker) => `${worker}:COMMITTED`,
                            ),
                            ...snapshot.cancelled.map(
                              (worker) => `${worker}:CANCELLED`,
                            ),
                          ].join(", ") || "none"}
                        </td>
                        <td>{snapshot.unfinished}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <EvidenceBoundary
            proves="The pure protocol replay separates occupancy, consumer ownership, unfinished accounting, preterminal partial readiness, terminal classification, condition predicates, and permit balance."
            unknown="Host scheduling order, waiter fairness, external side effects, and end-to-end async backpressure, which belongs to Module 21."
          />
        </>
      )}
      <InvariantPlate />
    </div>
  );
}

function ProgressLaboratory({
  answer,
  onChange,
  record,
  onRecordChange,
}: {
  answer: AnswerState;
  onChange: (next: AnswerState) => void;
  record: StudioRecord;
  onRecordChange: (next: StudioRecord) => void;
}) {
  const scenarios = {
    cycle: {
      title: "Lock-order knot",
      edges: ["merge waits for snapshot", "publish waits for catalog"],
      center: "A → B → A",
      finding: "Deadlock possible under declared single-instance resources.",
      remedy: "One global order or one owner removes the modeled cycle.",
    },
    capacity: {
      title: "One-worker Future self-wait",
      edges: ["outer occupies worker", "outer waits for pending inner"],
      center: "capacity 1",
      finding: "No worker remains to start the dependency.",
      remedy: "Remove nested wait, widen architecture, or submit at the owner.",
    },
    starvation: {
      title: "Eligible but never selected",
      edges: ["high-rate arrivals", "undefined waiter selection"],
      center: "no bound",
      finding: "Safety can hold while one participant makes no progress.",
      remedy: "State the scheduling/fairness assumption or design a bound.",
    },
    livelock: {
      title: "Both polite, neither advances",
      edges: ["A observes conflict and yields", "B observes conflict and yields"],
      center: "state changes",
      finding: "Participants run, but the useful goal does not advance.",
      remedy: "Break symmetry with ownership, order, or randomized backoff.",
    },
  };
  const selected = scenarios[record.progressScenario];
  const cycleComplete = PROGRESS_EDGES.every((edge) =>
    record.progressEdges.includes(edge),
  );

  const toggleEdge = (edge: ProgressEdge) => {
    const progressEdges = record.progressEdges.includes(edge)
      ? record.progressEdges.filter((candidate) => candidate !== edge)
      : [...record.progressEdges, edge];
    onRecordChange({ ...record, progressEdges });
  };

  return (
    <div className={styles.viewStack}>
      <div className={styles.viewIntro}>
        <div>
          <p className={styles.eyebrow}>Liveness is conditional</p>
          <h3>A safe system can still fail to move.</h3>
          <p>
            Name the desired transition, the blocking relation, resource
            capacity, failure assumptions, and fairness boundary before saying
            “eventually.”
          </p>
        </div>
      </div>

      <PredictionGate answer={answer} onChange={onChange} view="progress" />

      {!answer.revealed ? (
        <EvidenceLock>
          Commit the wait-cycle prediction and confidence before the graph
          builder, model result, or remedies are shown.
        </EvidenceLock>
      ) : (
        <>
          <div
            aria-label="Choose a progress failure model"
            className={styles.segmentedControl}
            role="group"
          >
            {(Object.keys(scenarios) as ProgressScenario[]).map((key) => (
              <button
                aria-pressed={record.progressScenario === key}
                key={key}
                onClick={() =>
                  onRecordChange({ ...record, progressScenario: key })
                }
                type="button"
              >
                {key}
              </button>
            ))}
          </div>

          <section
            aria-label="Build the declared wait-for cycle"
            className={styles.progressBuilder}
          >
            <header>
              <span>Wait-for graph · choose only declared edges</span>
              <strong>
                {record.progressEdges.length} / {PROGRESS_EDGES.length} edges
              </strong>
            </header>
            <div
              aria-label="Wait-for graph edges"
              className={styles.edgePalette}
              role="group"
            >
              {PROGRESS_EDGES.map((edge) => (
                <button
                  aria-pressed={record.progressEdges.includes(edge)}
                  key={edge}
                  onClick={() => toggleEdge(edge)}
                  type="button"
                >
                  {edge}
                </button>
              ))}
            </div>
            <div className={styles.progressGraph}>
              <span>A owns L1</span>
              <i aria-hidden="true">→</i>
              <span>L2 owned by B</span>
              <i aria-hidden="true">→</i>
              <span>B waits for L1</span>
              <i aria-hidden="true">→</i>
              <strong>{cycleComplete ? "cycle closed" : "path incomplete"}</strong>
            </div>
            <p aria-live="polite">
              <strong>Finite model result: </strong>
              {cycleComplete
                ? "Deadlock is possible under the declared single-instance, hold-and-wait, non-preemptible resource model."
                : "No complete deadlock witness is justified by the selected edges."}
            </p>
          </section>

          <div className={styles.waitKnot} aria-live="polite">
            <div className={styles.knotOrbit} aria-hidden="true">
              <span>A</span>
              <i>{selected.center}</i>
              <span>B</span>
            </div>
            <div>
              <span>{selected.title} · teaching model</span>
              <h4>
                {record.progressScenario === "cycle" && !cycleComplete
                  ? "Insufficient evidence: the selected edges do not close a cycle."
                  : selected.finding}
              </h4>
              <p>{selected.remedy}</p>
            </div>
          </div>

          <div className={styles.tableScroll}>
            <table>
              <caption>
                Text equivalent: declared wait-for evidence and assumption
                boundary
              </caption>
              <thead>
                <tr>
                  <th>Edge / condition</th>
                  <th>Interpretation</th>
                  <th>Empirical host claim?</th>
                </tr>
              </thead>
              <tbody>
                {record.progressScenario === "cycle" &&
                  PROGRESS_EDGES.map((edge) => (
                    <tr key={edge}>
                      <td>{edge}</td>
                      <td>
                        {record.progressEdges.includes(edge)
                          ? "included in the current finite model"
                          : "not declared; cannot support the cycle"}
                      </td>
                      <td>No — model edge only</td>
                    </tr>
                  ))}
                {record.progressScenario !== "cycle" &&
                  selected.edges.map((edge, index) => (
                    <tr key={edge}>
                      <td>{edge}</td>
                      <td>
                        {index === 0
                          ? "first declared dependency"
                          : "condition that sustains the progress failure"}
                      </td>
                      <td>No — model condition only</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <EvidenceBoundary
            proves="The finite wait-for analyzer recognizes the selected cycle only when every declared edge is present; the capacity model identifies a one-worker pending dependency."
            unknown="Whether an undeclared external event can break a wait, whether a host scheduler realizes this graph, or whether any fairness property holds."
          />
        </>
      )}
      <InvariantPlate />
    </div>
  );
}

function ModelChooser({
  answer,
  onChange,
  record,
  onRecordChange,
}: {
  answer: AnswerState;
  onChange: (next: AnswerState) => void;
  record: StudioRecord;
  onRecordChange: (next: StudioRecord) => void;
}) {
  const model = record.modelChoice;
  const nativeContractRequired =
    model.workload === "native" || model.workload === "mixed";
  const requiredKeys: Array<keyof ModelChoiceRecord> = [
    "workload",
    "independence",
    "sharing",
    "transfer",
    "isolation",
    "lifetime",
    "failure",
    "cancellation",
    "build",
    "gil",
    "candidate",
    "evidencePlan",
    ...(nativeContractRequired
      ? (["nativeContract"] as Array<keyof ModelChoiceRecord>)
      : []),
  ];
  const missing = requiredKeys.filter((key) => model[key] === null);
  const profileContradiction =
    model.build === "standard" && model.gil === "disabled";
  const freeThreadedLive =
    model.build === "free-threaded" && model.gil === "disabled";

  function updateModel<K extends keyof ModelChoiceRecord>(
    key: K,
    value: ModelChoiceRecord[K],
  ) {
    const next = { ...model, [key]: value };
    if (
      key === "workload" &&
      value !== "native" &&
      value !== "mixed"
    ) {
      next.nativeContract = null;
    }
    onRecordChange({ ...record, modelChoice: next });
  }

  const renderChoiceGroup = (
    label: string,
    current: string | null,
    options: ReadonlyArray<readonly [string, string]>,
    onSelect: (value: string) => void,
  ) => (
    <div className={styles.modelQuestion}>
      <span>{label}</span>
      <div aria-label={label} className={styles.instrumentDial} role="group">
        {options.map(([value, optionLabel]) => (
          <button
            aria-pressed={current === value}
            key={value}
            onClick={() => onSelect(value)}
            type="button"
          >
            {optionLabel}
          </button>
        ))}
      </div>
    </div>
  );

  const recommendation = (() => {
    if (missing.length > 0) return null;
    if (profileContradiction) {
      return {
        primary: "Resolve the runtime-profile contradiction",
        why: "A standard CPython build cannot report the GIL disabled; re-run the capability and live-state probes before choosing an adapter.",
      };
    }
    if (model.gil === "unknown" || model.build === "unknown") {
      return {
        primary: "Profile the runtime before selecting an executor",
        why: "Unknown build capability or live GIL state cannot support a parallel-execution claim.",
      };
    }
    if (model.build === "free-threaded") {
      return {
        primary: "Supply a separate executed free-threaded profile",
        why: `${
          freeThreadedLive
            ? "The categorical record says this build has the GIL disabled, but that is not executed evidence."
            : "A free-threaded build can still run with the GIL enabled."
        } This course packet executed only the standard build; verify build capability, live GIL state, and dependency compatibility in the proposed environment.`,
      };
    }
    if (
      (model.workload === "native" || model.workload === "mixed") &&
      model.gil === "enabled" &&
      model.nativeContract !== "releases"
    ) {
      return {
        primary: "Do not recommend threads yet",
        why: "With the live GIL enabled, a native CPU hypothesis needs a documented contract that the hot operation releases the GIL.",
      };
    }
    if (
      (model.workload === "native" || model.workload === "mixed") &&
      model.gil === "disabled" &&
      model.nativeContract !== "compatible"
    ) {
      return {
        primary: "Do not recommend threads yet",
        why: "A free-threaded runtime hypothesis needs every native dependency to declare compatible behavior.",
      };
    }
    if (model.isolation === "required" || model.failure === "isolated") {
      return {
        primary: "Process boundary as the first falsifiable candidate",
        why: "The declared isolation and failure-containment requirements dominate transfer cost; establish semantic equivalence across serialization first.",
      };
    }
    if (model.independence === "ordered") {
      return {
        primary:
          model.workload === "blocking"
            ? "Sequential baseline, then Module 21 structured async"
            : "Sequential owner before parallel decomposition",
        why: "The declared ordering dependency removes the independence needed for a simple worker-pool transformation.",
      };
    }
    if (model.workload === "blocking") {
      return {
        primary: "Bounded threads as the first falsifiable candidate",
        why: "Blocking waits can overlap while shared Python state remains behind an explicit owner or synchronization protocol.",
      };
    }
    if (model.workload === "python") {
      return model.gil === "enabled"
        ? {
            primary: "Process pool as the first falsifiable candidate",
            why: "Pure-Python CPU work on this live GIL profile needs an isolation boundary for multicore execution; compare oracle bytes before timing.",
          }
        : {
            primary: "Threads after a dependency and invariant audit",
            why: "Parallel capability is declared. Extension compatibility and compound shared-state safety remain separate obligations.",
          };
    }
    if (model.workload === "native") {
      return {
        primary: "Bounded threads as a contract-backed hypothesis",
        why: "The declared native dependency contract satisfies the live GIL profile; preserve oracle equality before measuring.",
      };
    }
    return {
      primary: "Split the mixed pipeline at an ownership boundary",
      why: "A single executor label hides unlike blocking and CPU phases; validate each adapter against one sequential oracle before composing them.",
    };
  })();
  const recommendationHeading =
    recommendation?.primary ?? "Recommendation withheld";

  return (
    <div className={styles.viewStack}>
      <div className={styles.viewIntro}>
        <div>
          <p className={styles.eyebrow}>Workload first · executor second</p>
          <h3>The same interface does not mean the same machine.</h3>
          <p>
            Threads share Python objects. Processes serialize across address
            spaces. Isolated interpreters transfer values while remaining in
            one process. Each changes ownership, failure, and cost.
          </p>
        </div>
      </div>

      <PredictionGate answer={answer} onChange={onChange} view="models" />

      {!answer.revealed ? (
        <EvidenceLock>
          Commit the execution-model prediction and confidence before the
          workload record, runtime profile, or recommendation appears.
        </EvidenceLock>
      ) : (
        <>
          <div className={styles.modelConsole}>
            {renderChoiceGroup(
              "Dominant work",
              model.workload,
              [
                ["blocking", "blocking I/O"],
                ["python", "Python CPU"],
                ["native", "native CPU"],
                ["mixed", "mixed phases"],
              ],
              (value) =>
                updateModel(
                  "workload",
                  value as NonNullable<ModelChoiceRecord["workload"]>,
                ),
            )}
            {renderChoiceGroup(
              "Task relationship",
              model.independence,
              [
                ["independent", "independent"],
                ["ordered", "order-dependent"],
              ],
              (value) =>
                updateModel(
                  "independence",
                  value as NonNullable<ModelChoiceRecord["independence"]>,
                ),
            )}
            {renderChoiceGroup(
              "Mutable sharing",
              model.sharing,
              [
                ["none", "none"],
                ["bounded", "owned boundary"],
                ["shared", "shared mutation"],
              ],
              (value) =>
                updateModel(
                  "sharing",
                  value as NonNullable<ModelChoiceRecord["sharing"]>,
                ),
            )}
            {renderChoiceGroup(
              "Transfer volume",
              model.transfer,
              [
                ["small", "small / cheap"],
                ["large", "large / costly"],
              ],
              (value) =>
                updateModel(
                  "transfer",
                  value as NonNullable<ModelChoiceRecord["transfer"]>,
                ),
            )}
            {renderChoiceGroup(
              "Isolation requirement",
              model.isolation,
              [
                ["acceptable", "acceptable"],
                ["required", "required"],
                ["forbidden", "forbidden"],
              ],
              (value) =>
                updateModel(
                  "isolation",
                  value as NonNullable<ModelChoiceRecord["isolation"]>,
                ),
            )}
            {renderChoiceGroup(
              "Task lifetime",
              model.lifetime,
              [
                ["short", "short"],
                ["long", "long-running"],
              ],
              (value) =>
                updateModel(
                  "lifetime",
                  value as NonNullable<ModelChoiceRecord["lifetime"]>,
                ),
            )}
            {renderChoiceGroup(
              "Failure boundary",
              model.failure,
              [
                ["shared", "shared process"],
                ["isolated", "isolated failure"],
              ],
              (value) =>
                updateModel(
                  "failure",
                  value as NonNullable<ModelChoiceRecord["failure"]>,
                ),
            )}
            {renderChoiceGroup(
              "Cancellation contract",
              model.cancellation,
              [
                ["pending", "pending only"],
                ["cooperative", "cooperative"],
                ["terminate", "hard termination"],
              ],
              (value) =>
                updateModel(
                  "cancellation",
                  value as NonNullable<ModelChoiceRecord["cancellation"]>,
                ),
            )}
            {renderChoiceGroup(
              "Python build",
              model.build,
              [
                ["standard", "standard"],
                ["free-threaded", "free-threaded"],
                ["unknown", "unknown"],
              ],
              (value) =>
                updateModel(
                  "build",
                  value as NonNullable<ModelChoiceRecord["build"]>,
                ),
            )}
            {renderChoiceGroup(
              "Live GIL state",
              model.gil,
              [
                ["enabled", "enabled"],
                ["disabled", "disabled"],
                ["unknown", "unknown"],
              ],
              (value) =>
                updateModel(
                  "gil",
                  value as NonNullable<ModelChoiceRecord["gil"]>,
                ),
            )}
            {nativeContractRequired &&
              renderChoiceGroup(
                model.gil === "disabled"
                  ? "Native dependency free-threading contract"
                  : "Native dependency GIL-release contract",
                model.nativeContract,
                [
                  ["releases", "releases GIL"],
                  ["compatible", "free-thread compatible"],
                  ["unknown", "unknown"],
                ],
                (value) =>
                  updateModel(
                    "nativeContract",
                    value as NonNullable<
                      ModelChoiceRecord["nativeContract"]
                    >,
                  ),
              )}
            {renderChoiceGroup(
              "Your first candidate",
              model.candidate,
              [
                ["sequential", "sequential"],
                ["threads", "threads"],
                ["processes", "processes"],
                ["interpreters", "interpreters"],
                ["m21", "Module 21 async"],
              ],
              (value) =>
                updateModel(
                  "candidate",
                  value as NonNullable<ModelChoiceRecord["candidate"]>,
                ),
            )}
            {renderChoiceGroup(
              "First evidence plan",
              model.evidencePlan,
              [
                ["equivalence-first", "oracle equivalence"],
                ["profile-first", "runtime profile"],
                ["failure-first", "failure injection"],
              ],
              (value) =>
                updateModel(
                  "evidencePlan",
                  value as NonNullable<ModelChoiceRecord["evidencePlan"]>,
                ),
            )}

            <div className={styles.modelRecommendation} aria-live="polite">
              <span>First falsifiable candidate</span>
              {recommendation ? (
                <>
                  <strong>{recommendationHeading}</strong>
                  <p>{recommendation.why}</p>
                  <small>
                    Your hypothesis: {model.candidate}; first evidence:{" "}
                    {model.evidencePlan}. No speedup is claimed here.
                  </small>
                </>
              ) : (
                <>
                  <strong>{recommendationHeading}</strong>
                  <p>
                    Complete the model record first. Missing:{" "}
                    {missing.join(", ")}.
                  </p>
                </>
              )}
            </div>
          </div>

          <RuntimeProfilePlate />

          <div className={styles.tableScroll}>
            <table>
              <caption>
                Text equivalent: execution-model ownership and executed-evidence
                matrix
              </caption>
              <thead>
                <tr>
                  <th>Model</th>
                  <th>Python-object sharing</th>
                  <th>Transfer / lifecycle boundary</th>
                  <th>Executed in this packet</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Sequential</td>
                  <td>One owner</td>
                  <td>No executor boundary</td>
                  <td>Yes — independent oracle</td>
                </tr>
                <tr>
                  <td>Threads</td>
                  <td>Shared</td>
                  <td>Synchronization + cooperative lifecycle</td>
                  <td>Yes — standard GIL-enabled build</td>
                </tr>
                <tr>
                  <td>Processes</td>
                  <td>Separate</td>
                  <td>Pickle, importable main, start context</td>
                  <td>Yes — semantic adapter checks</td>
                </tr>
                <tr>
                  <td>Interpreters</td>
                  <td>Isolated Python runtime state</td>
                  <td>Serialized/shareable values; process globals remain</td>
                  <td>No — API availability only</td>
                </tr>
                <tr>
                  <td>Free-threaded threads</td>
                  <td>Shared, internally synchronized containers</td>
                  <td>Explicit application invariants still required</td>
                  <td>No — documentation-only boundary</td>
                </tr>
              </tbody>
            </table>
          </div>

          <EvidenceBoundary
            proves="The local suite executes semantically equivalent sequential, thread, and process paths and records the actual standard build, live GIL probe, and process boundary."
            unknown="Free-threaded behavior, interpreter-pool behavior, undeclared dependency contracts, production transfer costs, and every workload speedup claim."
          />
        </>
      )}
      <InvariantPlate />
    </div>
  );
}

function EvidenceAuditor({
  answer,
  onChange,
  answers,
  record,
  onRecordChange,
}: {
  answer: AnswerState;
  onChange: (next: AnswerState) => void;
  answers: AnswerMap;
  record: StudioRecord;
  onRecordChange: (next: StudioRecord) => void;
}) {
  const [approvedBrief, setApprovedBrief] = useState<string | null>(null);
  const [copyFeedback, setCopyFeedback] = useState<{
    context: string;
    state: "idle" | "approval-required" | "copied" | "failed";
  }>({ context: "", state: "idle" });
  const preterminalStates = [
    "ADMITTED",
    "ENQUEUED",
    "CLAIMED",
    "PARTIAL_READY",
    "COMMIT_STARTED",
  ];
  const terminal = ["COMMITTED", "FAILED", "CANCELLED"];
  const variants: Record<
    EvidenceVariant,
    { label: string; observation: string; risk: string }
  > = {
    "owner": {
      label: "single owner",
      observation: "Reducer owns validation, ledger classification, and fold.",
      risk: "Progress still depends on the reducer draining admitted work.",
    },
    "shared": {
      label: "shared fold",
      observation: "Workers mutate shared postings without one protocol.",
      risk: "Reject behavior: the finite model contains lost updates.",
    },
    "narrow": {
      label: "narrow lock",
      observation: "Only the final assignment is protected.",
      risk: "Reject behavior: stale reads still split the logical transition.",
    },
    "callback": {
      label: "blocking callback",
      observation: "A callback waits while holding reducer ownership.",
      risk: "Split progress from behavior; safety evidence does not prove drain.",
    },
    "empty": {
      label: "empty() probe",
      observation: "A consumer treats queue.empty() as a reservation.",
      risk: "Reject behavior: the observation races with the next operation.",
    },
    "swallowed": {
      label: "swallowed failure",
      observation: "Worker exception is logged but no terminal row is written.",
      risk: "Reject tests and behavior: exact terminal accounting is broken.",
    },
    "child": {
      label: "child hard-stop",
      observation: "A process is terminated while owning an IPC resource.",
      risk: "Split cancellation from cleanup; queue integrity remains unknown.",
    },
    "gil": {
      label: "GIL claim",
      observation: "Patch prose calls a multistep update safe because of the GIL.",
      risk: "Reject portability and documentation; no application invariant follows.",
    },
  };
  const selectedVariant = variants[record.evidenceVariant];
  const decisionCount = PATCH_AXES.filter(
    (axis) => record.patchDecisions[axis.id] !== null,
  ).length;
  const misconceptions = misconceptionLabels(answers);
  const brief = [
    "ATLAS MODULE 19 — AGENT PATCH REVIEW",
    `Variant: ${selectedVariant.label}`,
    `Observation: ${selectedVariant.observation}`,
    `Primary risk: ${selectedVariant.risk}`,
    `Finite-history coverage: ${record.completedHistories.length}/20`,
    `Model candidate: ${record.modelChoice.candidate ?? "not recorded"}`,
    `Evidence plan: ${record.modelChoice.evidencePlan ?? "not recorded"}`,
    `Runtime: ${RUNTIME_PROFILE.python}; ${RUNTIME_PROFILE.build}; live GIL ${RUNTIME_PROFILE.liveGil}`,
    `Misconception labels: ${misconceptions.join(", ") || "none revealed"}`,
    "Axis decisions:",
    ...PATCH_AXES.map(
      (axis) =>
        `- ${axis.label}: ${record.patchDecisions[axis.id] ?? "pending"}`,
    ),
    "Required semantic gate: 2/2 current partitions COMMITTED; three-document candidate digest equals independent oracle digest.",
    "Digest: 3e2899703a3a5f16bbf6905d6ddd9b819a2e2f69ebe9fb4750f6ebda08c4da66",
    "Residual boundary: scheduler fairness, free-threaded/interpreter behavior, external effects, and Module 18 durability remain unproved here.",
  ].join("\n");
  const briefApproved = canExportApprovedDraft(approvedBrief, brief);
  const copyState = copyFeedback.context === brief ? copyFeedback.state : "idle";

  const copyBrief = async () => {
    if (!briefApproved) {
      setCopyFeedback({ context: brief, state: "approval-required" });
      return;
    }
    try {
      await navigator.clipboard.writeText(brief);
      setCopyFeedback({ context: brief, state: "copied" });
    } catch {
      setCopyFeedback({ context: brief, state: "failed" });
    }
  };

  return (
    <div className={styles.viewStack}>
      <div className={styles.viewIntro}>
        <div>
          <p className={styles.eyebrow}>Architecture review · evidence defense</p>
          <h3>Passing is not the same as proved.</h3>
          <p>
            Audit behavior, tests, progress, portability, model fit, and prose
            separately. A defensible agent patch states both its evidence and
            its remaining uncertainty.
          </p>
        </div>
      </div>

      <PredictionGate answer={answer} onChange={onChange} view="evidence" />

      {!answer.revealed ? (
        <EvidenceLock>
          Commit the publication-gate prediction and confidence before terminal
          branches, canonical digests, or patch decisions are shown.
        </EvidenceLock>
      ) : (
        <>
          <div
            aria-label="Choose an agent patch variant to audit"
            className={styles.segmentedControl}
            role="group"
          >
            {(Object.keys(variants) as EvidenceVariant[]).map((variant) => (
              <button
                aria-pressed={record.evidenceVariant === variant}
                key={variant}
                onClick={() =>
                  onRecordChange({ ...record, evidenceVariant: variant })
                }
                type="button"
              >
                {variants[variant].label}
              </button>
            ))}
          </div>

          <div className={styles.patchVariant} aria-live="polite">
            <span>Patch under review · {selectedVariant.label}</span>
            <strong>{selectedVariant.observation}</strong>
            <p>{selectedVariant.risk}</p>
          </div>

          <div className={styles.terminalScore}>
            <div className={styles.stateRail}>
              {preterminalStates.map((state, index) => (
                <span key={state}>
                  <i>{String(index + 1).padStart(2, "0")}</i>
                  <strong>{state}</strong>
                  {state === "PARTIAL_READY" && <small>preterminal</small>}
                </span>
              ))}
            </div>
            <div
              aria-label="Exactly one terminal state branch"
              className={styles.terminalFork}
            >
              {terminal.map((state) => (
                <span
                  className={
                    state === "COMMITTED"
                      ? styles.terminalCommitted
                      : state === "FAILED"
                        ? styles.terminalFailed
                        : styles.terminalCancelled
                  }
                  key={state}
                >
                  {state}
                </span>
              ))}
            </div>
            <p>
              Each admitted partition leaves the preterminal lifecycle through
              exactly one branch: COMMITTED, FAILED, or CANCELLED.
            </p>
          </div>

          <div className={styles.digestGate}>
            <div>
              <span>current fixture partitions</span>
              <strong>2 / 2 current partitions COMMITTED</strong>
              <small>A and B; baseline doc-1 is not current work</small>
            </div>
            <i aria-hidden="true">+</i>
            <div>
              <span>3-document snapshot · candidate</span>
              <code>3e289970…c4da66</code>
              <small>doc-1 · doc-2 · doc-3</small>
            </div>
            <i aria-hidden="true">=</i>
            <div>
              <span>independent oracle digest</span>
              <code>3e289970…c4da66</code>
              <small>136 canonical bytes</small>
            </div>
            <i aria-hidden="true">→</i>
            <div className={styles.publicationGateOpen}>
              <span>Module 18 handoff</span>
              <strong>PERMITTED</strong>
              <small>durability still belongs to Module 18</small>
            </div>
          </div>

          <section
            aria-label="Agent patch decision matrix"
            className={styles.axisAuditor}
          >
            <header>
              <span>Evidence axes are independent</span>
              <strong>{decisionCount} / {PATCH_AXES.length} decided</strong>
            </header>
            {PATCH_AXES.map((axis) => (
              <div className={styles.axisRow} key={axis.id}>
                <strong>{axis.label}</strong>
                <div
                  aria-label={`${axis.label} patch decision`}
                  className={styles.patchDecision}
                  role="group"
                >
                  {(["accept", "reject", "split"] as const).map(
                    (decision) => (
                      <button
                        aria-pressed={
                          record.patchDecisions[axis.id] === decision
                        }
                        key={decision}
                        onClick={() =>
                          onRecordChange({
                            ...record,
                            patchDecisions: {
                              ...record.patchDecisions,
                              [axis.id]: decision,
                            },
                          })
                        }
                        type="button"
                      >
                        {decision}
                      </button>
                    ),
                  )}
                </div>
              </div>
            ))}
          </section>

          <div className={styles.tableScroll}>
            <table>
              <caption>
                Text equivalent: evidence packet, supported claim, and unknown
              </caption>
              <thead>
                <tr>
                  <th>Artifact</th>
                  <th>Observed result</th>
                  <th>What this proves</th>
                  <th>What remains unknown</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Finite history explorer</td>
                  <td>20 schedules; 18 violating</td>
                  <td>Complete declared two-worker R→C→W state space</td>
                  <td>Host scheduler choices and omitted state</td>
                </tr>
                <tr>
                  <td>Terminal ledger replay</td>
                  <td>One terminal row per admission</td>
                  <td>Process-local exact terminal accounting</td>
                  <td>External exactly-once side effects</td>
                </tr>
                <tr>
                  <td>Reducer vs oracle</td>
                  <td>136 canonical bytes and SHA-256 equal</td>
                  <td>Semantic equivalence for the declared fixture</td>
                  <td>Durable publication and every production input</td>
                </tr>
                <tr>
                  <td>35 behavioral tests</td>
                  <td>CPython 3.14.6 and 3.12.13 pass</td>
                  <td>Executed adapter, cancellation, and failure cases</td>
                  <td>Free-threaded and interpreter-pool behavior</td>
                </tr>
                <tr>
                  <td>Runtime profile</td>
                  <td>Standard build; live GIL enabled</td>
                  <td>The environment in which local evidence ran</td>
                  <td>Portability or workload speedup</td>
                </tr>
              </tbody>
            </table>
          </div>

          <section className={styles.reviewBrief}>
            <header>
              <div>
                <span>Generated agent-review brief</span>
                <strong>Categorical studio evidence only</strong>
              </div>
            </header>
            <textarea aria-label="Generated agent patch review brief" readOnly value={brief} />
            <label className={styles.reviewBriefConsent}>
              <input
                checked={briefApproved}
                onChange={(event) => {
                  setApprovedBrief(event.target.checked ? brief : null);
                  setCopyFeedback({ context: "", state: "idle" });
                }}
                type="checkbox"
              />
              <span>I reviewed this concise, categorical brief and choose to copy it manually.</span>
            </label>
            <button disabled={!briefApproved} onClick={copyBrief} type="button">
              Copy approved instructor brief
            </button>
            <small aria-live="polite">
              {copyState === "copied"
                ? "Copied."
                : copyState === "approval-required"
                  ? "Review the current brief before copying it."
                : copyState === "failed"
                  ? "Clipboard unavailable; select only the reviewed brief manually."
                  : "No paths, raw code, or private revision text are included."}
            </small>
          </section>

          <EvidenceBoundary
            proves="The runnable packet exposes immutable postings, canonical input and partial digests, replay-valid terminal evidence, Future observations, oracle equality, timeout/cancellation evidence, and executed thread/process boundaries."
            unknown="All production histories, scheduler fairness, free-threaded and interpreter behavior, external side effects, network completion, and Module 18 durability until that protocol runs."
          />
        </>
      )}
      <InvariantPlate />
    </div>
  );
}

export function ConcurrencyStudio() {
  const [activeView, setActiveView] =
    useState<ConcurrencyView>("history");
  const [answers, setAnswers] = useState<AnswerMap>(initialAnswers);
  const [record, setRecord] = useState<StudioRecord>(initialRecord);
  const [hydrated, setHydrated] = useState(false);
  const [resetArmed, setResetArmed] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const persistProgressRef = useRef(false);

  useEffect(() => {
    const media = window.matchMedia(REDUCED_MOTION_QUERY);
    const updateMotion = () => setReduceMotion(media.matches);
    updateMotion();
    media.addEventListener?.("change", updateMotion);
    return () => media.removeEventListener?.("change", updateMotion);
  }, []);

  useEffect(() => {
    const hydrationTimer = window.setTimeout(() => {
      try {
        const stored = restoreModule19Progress(window.localStorage) as
          | Module19ProgressRecord
          | null;
        if (stored) setAnswers(answersFromProgress(stored));
      } catch {
        // Browser storage is optional. Keep the current in-memory studio.
      } finally {
        setHydrated(true);
      }
    }, 0);
    return () => {
      window.clearTimeout(hydrationTimer);
    };
  }, []);

  useEffect(() => {
    if (!hydrated || !persistProgressRef.current) return;
    persistProgressRef.current = false;
    const progress = progressRecordFromAnswers(answers);
    try {
      if (!hasMeaningfulModule19Progress(progress)) {
        clearModule19Progress(window.localStorage);
        return;
      }
      window.localStorage.setItem(
        STUDIO_STORAGE_KEY,
        module19ProgressCodec.serialize(progress),
      );
    } catch {
      return;
    }
  }, [answers, hydrated]);

  const updateAnswer = (view: ConcurrencyView, next: AnswerState) => {
    persistProgressRef.current = true;
    setAnswers((current) => ({ ...current, [view]: next }));
  };

  const selectView = (view: ConcurrencyView, focus = false) => {
    setActiveView(view);
    if (focus) {
      const index = views.findIndex((candidate) => candidate.id === view);
      window.requestAnimationFrame(() => tabRefs.current[index]?.focus());
    }
  };

  const handleTabKeyDown = (
    event: ReactKeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    let nextIndex: number | null = null;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = (index + 1) % views.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = (index - 1 + views.length) % views.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = views.length - 1;
    }
    if (nextIndex !== null) {
      event.preventDefault();
      selectView(views[nextIndex].id, true);
    }
  };

  const resetView = () => {
    persistProgressRef.current = true;
    setAnswers((current) => ({
      ...current,
      [activeView]: emptyAnswer(),
    }));
    const defaults = initialRecord();
    setRecord((current) => {
      if (activeView === "history") {
        return {
          ...current,
          historySchedule: defaults.historySchedule,
          completedHistories: defaults.completedHistories,
          historyCheckpoint: defaults.historyCheckpoint,
          historyCensusCheckpoint: defaults.historyCensusCheckpoint,
        };
      }
      if (activeView === "linearization") {
        return {
          ...current,
          linearizationPatch: defaults.linearizationPatch,
          protectedSteps: defaults.protectedSteps,
          linearizationCheckpoint: defaults.linearizationCheckpoint,
        };
      }
      if (activeView === "coordination") {
        return {
          ...current,
          coordinationInstrument: defaults.coordinationInstrument,
          coordinationActions: defaults.coordinationActions,
          coordinationPendingAction: defaults.coordinationPendingAction,
          coordinationCheckpoint: defaults.coordinationCheckpoint,
        };
      }
      if (activeView === "progress") {
        return {
          ...current,
          progressScenario: defaults.progressScenario,
          progressEdges: defaults.progressEdges,
        };
      }
      if (activeView === "models") {
        return { ...current, modelChoice: defaults.modelChoice };
      }
      return {
        ...current,
        evidenceVariant: defaults.evidenceVariant,
        patchDecisions: defaults.patchDecisions,
      };
    });
  };

  const resetStudio = () => {
    if (!resetArmed) {
      setResetArmed(true);
      return;
    }
    persistProgressRef.current = false;
    clearStoredStudio();
    setAnswers(initialAnswers());
    setRecord(initialRecord());
    setActiveView("history");
    setResetArmed(false);
  };

  const completed = views.filter((view) => answers[view.id].revealed).length;

  return (
    <section
      aria-labelledby="concurrency-studio-title"
      className={styles.studio}
      data-reduced-motion={reduceMotion ? "true" : "false"}
      id="concurrency-observatory"
    >
      <header className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>Module 19 · Concurrency observatory</p>
          <h2 id="concurrency-studio-title">
            Read the weave.
            <em> Defend the history.</em>
          </h2>
          <p>
            An artistic six-view laboratory for seeing interleavings,
            ownership, coordination, progress, Python execution models, and
            evidence as one connected system.
          </p>
          <div className={styles.heroActions}>
            <Link href="/modules/19-concurrency-parallelism">
              Open the complete workbook <span aria-hidden="true">↗</span>
            </Link>
            <Link href="/downloads/module19_reference.py">
              Read the runnable reference
            </Link>
          </div>
        </div>
        <div className={styles.signalLoom} aria-hidden="true">
          <span>worker A</span>
          <i />
          <i />
          <strong>reducer</strong>
          <i />
          <i />
          <span>worker B</span>
        </div>
      </header>

      <div className={styles.studioStatus}>
        <div>
          <span id="concurrency-coverage-label">Exploration coverage</span>
          <strong>{completed} / 6 views revealed</strong>
          <small>Coverage is not a correctness or mastery score.</small>
        </div>
        <progress aria-label="Exploration coverage: revealed studio views" max={6} value={completed}>
          {completed} of 6
        </progress>
        <div className={styles.resetActions}>
          <button onClick={resetView} type="button">
            Reset this view
          </button>
          <button
            className={resetArmed ? styles.resetArmed : undefined}
            onBlur={() => setResetArmed(false)}
            onClick={resetStudio}
            type="button"
          >
            {resetArmed ? "Reset saved studio now" : "Reset saved studio"}
          </button>
        </div>
      </div>

      <div className={styles.globalPlates}>
        <InvariantPlate />
        <RuntimeProfilePlate />
      </div>

      <div
        aria-label="Concurrency studio views"
        className={styles.tabs}
        role="tablist"
      >
        {views.map((view, index) => (
          <button
            aria-controls={panelId(view.id)}
            aria-selected={activeView === view.id}
            id={tabId(view.id)}
            key={view.id}
            onClick={() => selectView(view.id)}
            onKeyDown={(event) => handleTabKeyDown(event, index)}
            ref={(element) => {
              tabRefs.current[index] = element;
            }}
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

      <div
        aria-labelledby={tabId("history")}
        className={styles.panel}
        hidden={activeView !== "history"}
        id={panelId("history")}
        role="tabpanel"
        tabIndex={0}
      >
        <HistoryExplorer
          answer={answers.history}
          onChange={(next) => updateAnswer("history", next)}
          onRecordChange={setRecord}
          record={record}
        />
      </div>

      <div
        aria-labelledby={tabId("linearization")}
        className={styles.panel}
        hidden={activeView !== "linearization"}
        id={panelId("linearization")}
        role="tabpanel"
        tabIndex={0}
      >
        <LinearizationLab
          answer={answers.linearization}
          onChange={(next) => updateAnswer("linearization", next)}
          onRecordChange={setRecord}
          record={record}
        />
      </div>

      <div
        aria-labelledby={tabId("coordination")}
        className={styles.panel}
        hidden={activeView !== "coordination"}
        id={panelId("coordination")}
        role="tabpanel"
        tabIndex={0}
      >
        <CoordinationConsole
          answer={answers.coordination}
          onChange={(next) => updateAnswer("coordination", next)}
          onRecordChange={setRecord}
          record={record}
        />
      </div>

      <div
        aria-labelledby={tabId("progress")}
        className={styles.panel}
        hidden={activeView !== "progress"}
        id={panelId("progress")}
        role="tabpanel"
        tabIndex={0}
      >
        <ProgressLaboratory
          answer={answers.progress}
          onChange={(next) => updateAnswer("progress", next)}
          onRecordChange={setRecord}
          record={record}
        />
      </div>

      <div
        aria-labelledby={tabId("models")}
        className={styles.panel}
        hidden={activeView !== "models"}
        id={panelId("models")}
        role="tabpanel"
        tabIndex={0}
      >
        <ModelChooser
          answer={answers.models}
          onChange={(next) => updateAnswer("models", next)}
          onRecordChange={setRecord}
          record={record}
        />
      </div>

      <div
        aria-labelledby={tabId("evidence")}
        className={styles.panel}
        hidden={activeView !== "evidence"}
        id={panelId("evidence")}
        role="tabpanel"
        tabIndex={0}
      >
        <EvidenceAuditor
          answer={answers.evidence}
          answers={answers}
          onChange={(next) => updateAnswer("evidence", next)}
          onRecordChange={setRecord}
          record={record}
        />
      </div>

      <footer className={styles.footer}>
        <p>
          Continue in the workbook for six teaching sessions, eight problem
          levels, eight confidence-aware questions, three TA studios, and the
          complete Atlas evidence project.
        </p>
        <Link href="/modules/19-concurrency-parallelism">
          Enter Module 19 <span aria-hidden="true">→</span>
        </Link>
      </footer>
    </section>
  );
}
