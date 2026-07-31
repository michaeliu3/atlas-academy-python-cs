"use client";

import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { getBrowserProgressStorage } from "@/lib/browser-progress-storage";
import {
  clearModule21Progress,
  persistModule21Progress,
  restoreModule21Progress,
} from "@/lib/module21-progress-codec";
import styles from "./AsyncDistributedStudio.module.css";

type RunView = "task" | "scope" | "pressure" | "reconcile" | "order" | "audit";
type Confidence = 1 | 2 | 3 | 4;
type ViewRecord = {
  choice: string | null;
  confidence: Confidence | null;
  revealed: boolean;
};
type StudioRecord = Record<RunView, ViewRecord>;

const CENTRAL_INVARIANT =
  "Every Atlas dispatch has one stable operation ID, canonical request digest, deadline, and evidence record. Local work is admitted through a bounded, explicitly owned async pipeline; every admitted local item receives one terminal local accounting record. Cancellation is cleaned up and propagated according to the owning structured scope, but is never mislabeled as a remote rollback. Every remote retry retains the same operation identity and is classified separately from a transport write, a server/replica observation, a matching reply, and an unresolved outcome. A trace context correlates declared observations; it does not authenticate them, make them complete, or prove causality, durability, or replicated agreement. In this collector case, the dispatch additionally declares its source set, admission bound, deadline/cancellation policy, and publication-cut rule before work starts.";

const views: ReadonlyArray<{
  id: RunView;
  number: string;
  label: string;
  question: string;
}> = [
  {
    id: "task",
    number: "01",
    label: "Coroutine → task",
    question: "What has the owner actually established?",
  },
  {
    id: "scope",
    number: "02",
    label: "Scope → cancellation",
    question: "What does structured cleanup leave unknown?",
  },
  {
    id: "pressure",
    number: "03",
    label: "Bound → admission",
    question: "Which boundary is locally controlled?",
  },
  {
    id: "reconcile",
    number: "04",
    label: "RPC → UNKNOWN",
    question: "How can a retry keep one meaning?",
  },
  {
    id: "order",
    number: "05",
    label: "Trace → relation",
    question: "Which edge is genuinely causal?",
  },
  {
    id: "audit",
    number: "06",
    label: "Claim → evidence",
    question: "What does a FULL cut actually defend?",
  },
];

const predictionChoices: Record<
  RunView,
  ReadonlyArray<{ id: string; label: string }>
> = {
  task: [
    { id: "owned", label: "A locally scheduled task has a declared owner." },
    { id: "received", label: "Catalog received the source request." },
    { id: "self", label: "The coroutine now owns its own cleanup." },
  ],
  scope: [
    { id: "scope", label: "Local sibling cancellation and cleanup are owned; catalog's remote result is separate." },
    { id: "rollback", label: "Catalog's source-side effect is rolled back." },
    { id: "full", label: "The group has produced a valid full collection cut." },
  ],
  pressure: [
    { id: "slot", label: "One local admission slot can be used under Atlas policy." },
    { id: "capacity", label: "The upstream has capacity for a new request." },
    { id: "rollback", label: "The timed-out source operation did not happen." },
  ],
  reconcile: [
    { id: "same", label: "Retain the source operation ID and canonical digest; classify UNKNOWN_REMOTE, then reconcile." },
    { id: "new", label: "Generate a new ID so the retry cannot conflict." },
    { id: "failed", label: "Log remote failure because the response timed out." },
  ],
  order: [
    { id: "local", label: "Only local callback order and correlation are established." },
    { id: "causal", label: "Progress causally followed catalog." },
    { id: "fresh", label: "Progress has the newer source epoch." },
  ],
  audit: [
    { id: "full", label: "The named synthetic fixture produced a FULL cut under the declared Atlas policy." },
    { id: "global", label: "Atlas now guarantees global consistency and exactly-once refresh." },
    { id: "trust", label: "Trace correlation authenticated every source." },
  ],
};

const taskStages = [
  {
    label: "definition",
    fact: "`fetch_catalog` is a callable coroutine function.",
    nonClaim: "No coroutine object, Task, source request, or result exists yet.",
  },
  {
    label: "coroutine object",
    fact: "Calling the function constructs a coroutine object.",
    nonClaim: "Construction does not schedule or begin the source operation.",
  },
  {
    label: "owned task",
    fact: "`TaskGroup.create_task` gives one local task a named owner.",
    nonClaim: "A source receipt, remote start, or matching response is not implied.",
  },
  {
    label: "await / suspend",
    fact: "The task reached a cooperative local await boundary.",
    nonClaim: "The event loop did not prove a fair schedule or a peer effect.",
  },
  {
    label: "parent observes",
    fact: "The parent can classify this task's local terminal outcome.",
    nonClaim: "The whole distributed system is not thereby known to be done.",
  },
] as const;

const scopeRows = [
  ["`TaskGroup` child failure", "owner cancels/waits for owned siblings", "remote rollback"],
  ["`asyncio.timeout()`", "current task receives local cancellation; outside sees `TimeoutError`", "awaited operation never happened"],
  ["`wait_for()`", "awaited task is cancelled and local cancellation is awaited", "peer/source cancellation"],
  ["`wait()`", "returns local done and pending sets", "automatic pending-task cancellation"],
  ["`shield()`", "caller cancellation does not cancel the nested awaitable", "immunity from every cancellation/effect"],
] as const;

const pressureSteps = [
  {
    title: "Declare",
    detail: "catalog, exercises, and progress exist as named work; max_in_flight = 2.",
    lanes: ["DECLARED", "DECLARED", "DECLARED"],
  },
  {
    title: "Admit two",
    detail: "Atlas owns two local attempt slots; progress remains waiting by policy.",
    lanes: ["ATTEMPTING", "ATTEMPTING", "WAITING_ADMISSION"],
  },
  {
    title: "Record one local terminal state",
    detail: "catalog becomes UNKNOWN_REMOTE after a local timeout; the slot releases locally.",
    lanes: ["UNKNOWN_REMOTE", "ATTEMPTING", "WAITING_ADMISSION"],
  },
  {
    title: "Use the local slot",
    detail: "progress may now be admitted; catalog's remote history remains unresolved.",
    lanes: ["UNKNOWN_REMOTE", "COLLECTED", "ATTEMPTING"],
  },
] as const;

const reconciliationStages = [
  {
    label: "attempt",
    fact: "Attempt `run-2026-07-30-a/catalog` with its canonical digest.",
    unknown: "A local adapter call is not a matching client response or source decision.",
  },
  {
    label: "timeout",
    fact: "Record a local timeout and classify the task `UNKNOWN_REMOTE`.",
    unknown: "No admission, decision-plus-lost-reply, and delayed-reply histories remain possible.",
  },
  {
    label: "same-ID reconciliation",
    fact: "Use the same operation ID and digest for retry/status lookup.",
    unknown: "A new ID would create a new intended operation instead of resolving this one.",
  },
  {
    label: "matching status",
    fact: "A matching retained source-model status can scope a `COLLECTED` confirmation.",
    unknown: "The synthetic status seam is not a claim about a live replica group or durability.",
  },
] as const;

const orderRows = [
  ["local callback order", "order of these recorded callbacks", "source freshness / global order"],
  ["source epoch under its rule", "order within one source's version scheme", "comparison with unrelated source epochs"],
  ["explicit send → receive", "one happens-before relation", "a total global clock"],
  ["shared traceparent", "correlation of declared observations", "causality, trust, completeness, delivery"],
  ["wall timestamp", "a recorded time reading", "clock synchronization or atomic cut"],
] as const;

const auditFields = [
  {
    id: "task_trace",
    label: "task_trace",
    scope: "CLIENT/TASK OBSERVATION",
    verdict: "Keep: local accounting of named Atlas task records.",
  },
  {
    id: "traceparent",
    label: "traceparent",
    scope: "ASYNC MODEL CORRELATION",
    verdict: "Keep: correlation only; it does not authenticate or prove causality.",
  },
  {
    id: "node-a",
    label: "node-A observation",
    scope: "REPLICA MODEL",
    verdict: "Keep: a named node observation; node-B/global agreement remains unobserved.",
  },
  {
    id: "collection_cut",
    label: "collection_cut",
    scope: "ATLAS POLICY",
    verdict: "Keep: FULL only under the declared source set and validation policy.",
  },
  {
    id: "payload",
    label: "raw payload / token",
    scope: "UNNECESSARY SENSITIVE DATA",
    verdict: "Reject/redact: it is not needed to reproduce this bounded evidence claim.",
  },
] as const;

function emptyRecord(): StudioRecord {
  return {
    task: { choice: null, confidence: null, revealed: false },
    scope: { choice: null, confidence: null, revealed: false },
    pressure: { choice: null, confidence: null, revealed: false },
    reconcile: { choice: null, confidence: null, revealed: false },
    order: { choice: null, confidence: null, revealed: false },
    audit: { choice: null, confidence: null, revealed: false },
  };
}

function tabId(view: RunView) {
  return `async-run-control-tab-${view}`;
}

function panelId(view: RunView) {
  return `async-run-control-panel-${view}`;
}

function EvidenceLock() {
  return (
    <p className={styles.evidenceLock}>
      Evidence stays covered until you commit a prediction and confidence.
      This is calibration, not a surprise score.
    </p>
  );
}

type PredictionGateProps = {
  id: RunView;
  prompt: string;
  choices: ReadonlyArray<{ id: string; label: string }>;
  record: ViewRecord;
  onChange: (next: Partial<ViewRecord>) => void;
};

function PredictionGate({
  id,
  prompt,
  choices,
  record,
  onChange,
}: PredictionGateProps) {
  const ready = record.choice !== null && record.confidence !== null;

  return (
    <section className={styles.predictionGate} aria-label={`${id} prediction`}>
      <div className={styles.gateHeading}>
        <span>Prediction checkpoint</span>
        <p>{prompt}</p>
      </div>
      <fieldset>
        <legend>Choose the strongest answer before reveal</legend>
        <div className={styles.choiceGrid}>
          {choices.map((choice) => (
            <label key={choice.id}>
              <input
                checked={record.choice === choice.id}
                name={`${id}-prediction`}
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
                name={`${id}-confidence`}
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
        {record.revealed ? "Refresh the evidence" : "Commit prediction & reveal evidence"}
      </button>
      {!record.revealed && <EvidenceLock />}
    </section>
  );
}

function InvariantPlate() {
  return (
    <aside className={styles.invariantPlate}>
      <span>Atlas dispatch invariant</span>
      <p>{CENTRAL_INVARIANT}</p>
      <small>
        Control-room rule: a local task outcome, trace correlation, or one
        replica observation must not be promoted across its evidence boundary.
      </small>
    </aside>
  );
}

function TaskLab({
  record,
  onChange,
  stage,
  onStageChange,
}: {
  record: ViewRecord;
  onChange: (next: Partial<ViewRecord>) => void;
  stage: number;
  onStageChange: (next: number) => void;
}) {
  const selected = taskStages[stage];
  return (
    <div className={styles.viewStack}>
      <PredictionGate
        choices={predictionChoices.task}
        id="task"
        onChange={onChange}
        prompt="Immediately after TaskGroup.create_task(fetch(catalog)), what is established?"
        record={record}
      />
      {record.revealed && (
        <section className={styles.revealCard} aria-live="polite">
          <div className={styles.revealHeader}>
            <span className={styles.scopeTag}>PYTHON 3.14 CONTRACT</span>
            <h3>Ownership begins locally.</h3>
          </div>
          <p>
            The correct answer is the owner-held local Task. Step through the
            rail; every station names one fact and one stopping line.
          </p>
          <div className={styles.taskRail} aria-label="Coroutine to task lifecycle rail">
            {taskStages.map((item, index) => (
              <button
                aria-pressed={stage === index}
                className={stage === index ? styles.selectedStage : undefined}
                key={item.label}
                onClick={() => onStageChange(index)}
                type="button"
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{item.label}</strong>
              </button>
            ))}
          </div>
          <div className={styles.factWindow}>
            <div>
              <span>may say</span>
              <p>{selected.fact}</p>
            </div>
            <div>
              <span>must not say</span>
              <p>{selected.nonClaim}</p>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Local event</th>
                <th>Owner</th>
                <th>Remote question still open</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>task scheduled</td>
                <td>collector TaskGroup</td>
                <td>was any request received?</td>
              </tr>
              <tr>
                <td>task awaits adapter</td>
                <td>same local scope</td>
                <td>did a source decide?</td>
              </tr>
              <tr>
                <td>parent observes terminal task state</td>
                <td>parent policy</td>
                <td>is a wider system result known?</td>
              </tr>
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}

function ScopeLab({
  record,
  onChange,
  step,
  onStepChange,
}: {
  record: ViewRecord;
  onChange: (next: Partial<ViewRecord>) => void;
  step: number;
  onStepChange: (next: number) => void;
}) {
  const trace = [
    "owner enters TaskGroup",
    "catalog awaits after a modelled server decision",
    "exercises raises non-CancelledError",
    "TaskGroup cancels/waits for progress",
    "owner observes local ExceptionGroup",
  ];
  return (
    <div className={styles.viewStack}>
      <PredictionGate
        choices={predictionChoices.scope}
        id="scope"
        onChange={onChange}
        prompt="Exercises raises a non-cancellation error after catalog has a modelled decision but before its matching reply. What does TaskGroup establish?"
        record={record}
      />
      {record.revealed && (
        <section className={styles.revealCard} aria-live="polite">
          <div className={styles.revealHeader}>
            <span className={styles.scopeTag}>LOCAL STRUCTURED LIFETIME</span>
            <h3>Cleanup is a boundary, not a time machine.</h3>
          </div>
          <div className={styles.scopeTree} aria-label="TaskGroup ownership tree">
            <div><strong>Atlas owner</strong><span>declared failure policy</span></div>
            <i aria-hidden="true">↙</i><i aria-hidden="true">↓</i><i aria-hidden="true">↘</i>
            <div><strong>catalog</strong><span>possible remote decision</span></div>
            <div><strong>exercises</strong><span>non-cancellation failure</span></div>
            <div><strong>progress</strong><span>local cancellation + cleanup</span></div>
          </div>
          <div className={styles.stepControls}>
            <button disabled={step === 0} onClick={() => onStepChange(step - 1)} type="button">← Previous</button>
            <span>Trace {step + 1} / {trace.length}</span>
            <button disabled={step === trace.length - 1} onClick={() => onStepChange(step + 1)} type="button">Next →</button>
          </div>
          <p className={styles.traceLine}>{trace[step]}</p>
          <table>
            <thead><tr><th>Local mechanism</th><th>May say</th><th>Must not say</th></tr></thead>
            <tbody>
              {scopeRows.map(([mechanism, fact, nonClaim]) => (
                <tr key={mechanism}><td>{mechanism}</td><td>{fact}</td><td>{nonClaim}</td></tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}

function PressureLab({
  record,
  onChange,
  step,
  onStepChange,
}: {
  record: ViewRecord;
  onChange: (next: Partial<ViewRecord>) => void;
  step: number;
  onStepChange: (next: number) => void;
}) {
  const selected = pressureSteps[step];
  return (
    <div className={styles.viewStack}>
      <PredictionGate
        choices={predictionChoices.pressure}
        id="pressure"
        onChange={onChange}
        prompt="With three sources and max_in_flight = 2, catalog reaches a named local terminal record. What changes?"
        record={record}
      />
      {record.revealed && (
        <section className={styles.revealCard} aria-live="polite">
          <div className={styles.revealHeader}>
            <span className={styles.scopeTag}>ASYNC MODEL · LOCAL PRESSURE</span>
            <h3>A bound is an owned local policy.</h3>
          </div>
          <div className={styles.pressureBoard}>
            <div className={styles.pressureHeader}>
              <span>Step {step + 1}</span><strong>{selected.title}</strong><small>{selected.detail}</small>
            </div>
            {(["catalog", "exercises", "progress"] as const).map((source, index) => (
              <div className={styles.pressureLane} key={source}>
                <span>{source}</span>
                <i className={selected.lanes[index] === "WAITING_ADMISSION" ? styles.waiting : undefined} />
                <strong>{selected.lanes[index]}</strong>
              </div>
            ))}
          </div>
          <div className={styles.stepControls}>
            <button disabled={step === 0} onClick={() => onStepChange(step - 1)} type="button">← Previous state</button>
            <button disabled={step === pressureSteps.length - 1} onClick={() => onStepChange(step + 1)} type="button">Next state →</button>
          </div>
          <div className={styles.boundaryGrid}>
            <div><span>queue / semaphore</span><p>positive queue capacity and semaphore permits regulate local admission.</p></div>
            <div><span>task_done / join</span><p>local task accounting is not an external completion receipt.</p></div>
            <div><span>stream drain</span><p>`drain` is local write-buffer flow control, not peer parse or commit.</p></div>
            <div><span>upstream service</span><p>its capacity, queueing, and durability remain outside this local trace.</p></div>
          </div>
        </section>
      )}
    </div>
  );
}

function ReconcileLab({
  record,
  onChange,
  stage,
  onStageChange,
}: {
  record: ViewRecord;
  onChange: (next: Partial<ViewRecord>) => void;
  stage: number;
  onStageChange: (next: number) => void;
}) {
  const selected = reconciliationStages[stage];
  return (
    <div className={styles.viewStack}>
      <PredictionGate
        choices={predictionChoices.reconcile}
        id="reconcile"
        onChange={onChange}
        prompt="A source attempt times out before a matching reply and the intended request is unchanged. What preserves meaning?"
        record={record}
      />
      {record.revealed && (
        <section className={styles.revealCard} aria-live="polite">
          <div className={styles.revealHeader}>
            <span className={styles.scopeTag}>CLIENT/TASK OBSERVATION</span>
            <h3>UNKNOWN is a useful record, not a missing error branch.</h3>
          </div>
          <div className={styles.identityStrip}>
            <span>operation ID</span><code>run-2026-07-30-a/catalog</code>
            <span>canonical digest</span><code>sha256:54622368…589744</code>
          </div>
          <div className={styles.reconcileRail}>
            {reconciliationStages.map((item, index) => (
              <button
                aria-pressed={stage === index}
                className={stage === index ? styles.selectedStage : undefined}
                key={item.label}
                onClick={() => onStageChange(index)}
                type="button"
              >
                <span>{String(index + 1).padStart(2, "0")}</span><strong>{item.label}</strong>
              </button>
            ))}
          </div>
          <div className={styles.factWindow}>
            <div><span>evidence now</span><p>{selected.fact}</p></div>
            <div><span>still open</span><p>{selected.unknown}</p></div>
          </div>
          <table>
            <thead><tr><th>Compatible history after local timeout</th><th>Same timeout?</th><th>Discriminating evidence</th></tr></thead>
            <tbody>
              <tr><td>no remote/source admission</td><td>yes</td><td>declared retained status record</td></tr>
              <tr><td>decision plus lost reply</td><td>yes</td><td>matching replay/status evidence</td></tr>
              <tr><td>late response</td><td>yes</td><td>valid response bound to original ID/digest</td></tr>
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}

function OrderLab({
  record,
  onChange,
  edge,
  onEdgeChange,
}: {
  record: ViewRecord;
  onChange: (next: Partial<ViewRecord>) => void;
  edge: "none" | "send" | "trace";
  onEdgeChange: (next: "none" | "send" | "trace") => void;
}) {
  const verdict =
    edge === "send"
      ? "The explicit send → receive relation is one causal edge."
      : edge === "trace"
        ? "Rejected: shared trace correlation is not a causal edge."
        : "No cross-source relation is established; events remain incomparable.";
  return (
    <div className={styles.viewStack}>
      <PredictionGate
        choices={predictionChoices.order}
        id="order"
        onChange={onChange}
        prompt="Catalog's callback runs before progress's callback locally; both have the same trace ID. What follows?"
        record={record}
      />
      {record.revealed && (
        <section className={styles.revealCard} aria-live="polite">
          <div className={styles.revealHeader}>
            <span className={styles.scopeTag}>DISTRIBUTED MODEL · PARTIAL ORDER</span>
            <h3>Trace is a map, not a universal clock.</h3>
          </div>
          <div className={styles.causalityBoard} aria-label="Causal edge selector">
            <div><strong>catalog-send</strong><small>catalog local sequence 1</small></div>
            <button aria-pressed={edge === "send"} onClick={() => onEdgeChange("send")} type="button">declare send → receive</button>
            <div><strong>collector-receive</strong><small>collector local sequence 1</small></div>
            <button aria-pressed={edge === "trace"} onClick={() => onEdgeChange("trace")} type="button">try trace-ID edge</button>
            <div><strong>progress-local</strong><small>progress local sequence 1</small></div>
          </div>
          <p className={styles.traceLine}>{verdict}</p>
          <table>
            <thead><tr><th>Evidence</th><th>Supports</th><th>Does not support</th></tr></thead>
            <tbody>
              {orderRows.map(([evidence, supports, nonClaim]) => (
                <tr key={evidence}><td>{evidence}</td><td>{supports}</td><td>{nonClaim}</td></tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}

function AuditLab({
  record,
  onChange,
  field,
  onFieldChange,
}: {
  record: ViewRecord;
  onChange: (next: Partial<ViewRecord>) => void;
  field: (typeof auditFields)[number]["id"];
  onFieldChange: (next: (typeof auditFields)[number]["id"]) => void;
}) {
  const selected = auditFields.find((item) => item.id === field) ?? auditFields[0];
  return (
    <div className={styles.viewStack}>
      <PredictionGate
        choices={predictionChoices.audit}
        id="audit"
        onChange={onChange}
        prompt="After three validating synthetic records under the declared full-cut policy, which claim can Atlas defend?"
        record={record}
      />
      {record.revealed && (
        <section className={styles.revealCard} aria-live="polite">
          <div className={styles.revealHeader}>
            <span className={styles.scopeTag}>ATLAS POLICY + EVIDENCE AUDIT</span>
            <h3>Climb only as far as the evidence reaches.</h3>
          </div>
          <ol className={styles.claimLadder}>
            <li><span>01</span><div><strong>local task record</strong><p>one Atlas task classified a local attempt.</p></div></li>
            <li><span>02</span><div><strong>synthetic server-model decision</strong><p>one finite ledger retained a named record.</p></div></li>
            <li><span>03</span><div><strong>node-A observation</strong><p>does not establish node-B, quorum, durability, or agreement.</p></div></li>
            <li className={styles.ladderCurrent}><span>04</span><div><strong>Atlas FULL collection cut</strong><p>all declared records validate under the fixed policy.</p></div></li>
            <li><span>05</span><div><strong>linearizable / convergent system claim</strong><p>requires a separately named mechanism, assumptions, and proof.</p></div></li>
          </ol>
          <div className={styles.fieldInspector}>
            <div className={styles.fieldPicker}>
              <span>Inspect packet field</span>
              {auditFields.map((item) => (
                <button aria-pressed={field === item.id} key={item.id} onClick={() => onFieldChange(item.id)} type="button">{item.label}</button>
              ))}
            </div>
            <div className={styles.fieldVerdict}>
              <span>{selected.scope}</span><h4>{selected.label}</h4><p>{selected.verdict}</p>
            </div>
          </div>
          <table>
            <thead><tr><th>Requirement</th><th>mechanism/policy</th><th>evidence</th><th>non-claim</th></tr></thead>
            <tbody>
              <tr><td>all declared sources present</td><td>same-ID reconciliation + full-cut rule</td><td>matching synthetic records</td><td>global atomic snapshot</td></tr>
              <tr><td>bounded local pressure</td><td>admission bound two</td><td>local attempt trace</td><td>upstream capacity/fairness</td></tr>
              <tr><td>incident navigation</td><td>trace context + redaction</td><td>correlated packet fields</td><td>trust/completeness/causality</td></tr>
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}

export function AsyncDistributedStudio() {
  const [activeView, setActiveView] = useState<RunView>("task");
  const [record, setRecord] = useState<StudioRecord>(emptyRecord);
  const [storageReady, setStorageReady] = useState(false);
  const [taskStage, setTaskStage] = useState(2);
  const [scopeStep, setScopeStep] = useState(0);
  const [pressureStep, setPressureStep] = useState(1);
  const [reconcileStage, setReconcileStage] = useState(0);
  const [causalEdge, setCausalEdge] = useState<"none" | "send" | "trace">("none");
  const [auditField, setAuditField] = useState<(typeof auditFields)[number]["id"]>("task_trace");
  const [resetArmed, setResetArmed] = useState(false);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const progressStorageRef = useRef<ReturnType<typeof getBrowserProgressStorage>>(null);
  const revealedCount = views.filter((view) => record[view.id].revealed).length;
  const coverage = Math.round((revealedCount / views.length) * 100);

  useEffect(() => {
    const hydrationTimer = window.setTimeout(() => {
      try {
        const storage = getBrowserProgressStorage();
        progressStorageRef.current = storage;
        const stored = storage ? restoreModule21Progress(storage) : null;
        if (stored) setRecord(stored as StudioRecord);
      } catch {
        // Ignore corrupted/unavailable browser storage; no learner record is required.
      } finally {
        setStorageReady(true);
      }
    }, 0);
    return () => window.clearTimeout(hydrationTimer);
  }, []);

  useEffect(() => {
    if (!storageReady) return;
    try {
      const storage = progressStorageRef.current;
      if (storage) persistModule21Progress(storage, record);
    } catch {
      // Local persistence is optional and contains no notes, payloads, or endpoints.
    }
  }, [record, storageReady]);

  const updateRecord = (view: RunView, next: Partial<ViewRecord>) => {
    setRecord((current) => ({
      ...current,
      [view]: { ...current[view], ...next },
    }));
  };

  const selectView = (view: RunView) => {
    setActiveView(view);
    setResetArmed(false);
  };

  const handleTabKeyDown = (
    event: ReactKeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    let nextIndex: number | null = null;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % views.length;
    if (event.key === "ArrowLeft") nextIndex = (index - 1 + views.length) % views.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = views.length - 1;
    if (nextIndex === null) return;
    event.preventDefault();
    selectView(views[nextIndex].id);
    tabRefs.current[nextIndex]?.focus();
  };

  const resetView = () => {
    updateRecord(activeView, { choice: null, confidence: null, revealed: false });
    if (activeView === "task") setTaskStage(2);
    if (activeView === "scope") setScopeStep(0);
    if (activeView === "pressure") setPressureStep(1);
    if (activeView === "reconcile") setReconcileStage(0);
    if (activeView === "order") setCausalEdge("none");
    if (activeView === "audit") setAuditField("task_trace");
  };

  const resetStudio = () => {
    if (!resetArmed) {
      setResetArmed(true);
      return;
    }
    const storage = progressStorageRef.current ?? getBrowserProgressStorage();
    progressStorageRef.current = storage;
    if (storage) clearModule21Progress(storage);
    setRecord(emptyRecord());
    setActiveView("task");
    setTaskStage(2);
    setScopeStep(0);
    setPressureStep(1);
    setReconcileStage(0);
    setCausalEdge("none");
    setAuditField("task_trace");
    setResetArmed(false);
  };

  return (
    <section className={styles.studio} aria-labelledby="async-run-control-studio-title">
      <header className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.kicker}>Module 21 visual studio</p>
          <h2 id="async-run-control-studio-title">Atlas Run Control Room</h2>
          <p>
            Operate one source collector as six connected boundary checks:
            ownership, cancellation, pressure, ambiguity, causal relation, and
            the final claim an evidence packet can defend.
          </p>
          <div className={styles.heroFacts}>
            <span><b>3</b> declared sources</span>
            <span><b>2</b> local admission slots</span>
            <span><b>1</b> operation identity per source</span>
          </div>
        </div>
        <div className={styles.controlOrb} aria-label="Atlas collector control diagram">
          <span className={styles.orbCenter}>ATLAS<small>run control</small></span>
          <i className={styles.orbRingOne} aria-hidden="true" />
          <i className={styles.orbRingTwo} aria-hidden="true" />
          <span className={`${styles.orbitToken} ${styles.catalog}`}>catalog</span>
          <span className={`${styles.orbitToken} ${styles.exercises}`}>exercises</span>
          <span className={`${styles.orbitToken} ${styles.progress}`}>progress</span>
          <small className={styles.orbCaption}>local ownership · scoped evidence · UNKNOWN allowed</small>
        </div>
      </header>

      <InvariantPlate />

      <div className={styles.studioMeta}>
        <div>
          <span>Exploration coverage</span>
          <strong>{revealedCount} / {views.length} views revealed</strong>
          <p>Coverage records exploration only; it is not a mastery score.</p>
        </div>
        <div
          aria-label="Exploration coverage: revealed async run control views"
          aria-valuemax={100}
          aria-valuemin={0}
          aria-valuenow={coverage}
          className={styles.coverageMeter}
          role="progressbar"
        >
          <span style={{ width: `${coverage}%` }} />
        </div>
        <div className={styles.resetActions}>
          <button onClick={resetView} type="button">Reset this view</button>
          <button onClick={resetStudio} type="button">{resetArmed ? "Confirm reset all" : "Reset saved studio"}</button>
        </div>
      </div>

      <div className={styles.tabs} aria-label="Atlas Run Control Room views" role="tablist">
        {views.map((view, index) => (
          <button
            aria-controls={panelId(view.id)}
            aria-selected={activeView === view.id}
            id={tabId(view.id)}
            key={view.id}
            onClick={() => selectView(view.id)}
            onKeyDown={(event) => handleTabKeyDown(event, index)}
            ref={(element) => { tabRefs.current[index] = element; }}
            role="tab"
            tabIndex={activeView === view.id ? 0 : -1}
            type="button"
          >
            <span>{view.number}</span><strong>{view.label}</strong><small>{view.question}</small>
          </button>
        ))}
      </div>

      <div aria-labelledby={tabId("task")} className={styles.panel} hidden={activeView !== "task"} id={panelId("task")} role="tabpanel" tabIndex={0}>
        <TaskLab onChange={(next) => updateRecord("task", next)} onStageChange={setTaskStage} record={record.task} stage={taskStage} />
      </div>
      <div aria-labelledby={tabId("scope")} className={styles.panel} hidden={activeView !== "scope"} id={panelId("scope")} role="tabpanel" tabIndex={0}>
        <ScopeLab onChange={(next) => updateRecord("scope", next)} onStepChange={setScopeStep} record={record.scope} step={scopeStep} />
      </div>
      <div aria-labelledby={tabId("pressure")} className={styles.panel} hidden={activeView !== "pressure"} id={panelId("pressure")} role="tabpanel" tabIndex={0}>
        <PressureLab onChange={(next) => updateRecord("pressure", next)} onStepChange={setPressureStep} record={record.pressure} step={pressureStep} />
      </div>
      <div aria-labelledby={tabId("reconcile")} className={styles.panel} hidden={activeView !== "reconcile"} id={panelId("reconcile")} role="tabpanel" tabIndex={0}>
        <ReconcileLab onChange={(next) => updateRecord("reconcile", next)} onStageChange={setReconcileStage} record={record.reconcile} stage={reconcileStage} />
      </div>
      <div aria-labelledby={tabId("order")} className={styles.panel} hidden={activeView !== "order"} id={panelId("order")} role="tabpanel" tabIndex={0}>
        <OrderLab edge={causalEdge} onChange={(next) => updateRecord("order", next)} onEdgeChange={setCausalEdge} record={record.order} />
      </div>
      <div aria-labelledby={tabId("audit")} className={styles.panel} hidden={activeView !== "audit"} id={panelId("audit")} role="tabpanel" tabIndex={0}>
        <AuditLab field={auditField} onChange={(next) => updateRecord("audit", next)} onFieldChange={setAuditField} record={record.audit} />
      </div>

      <footer className={styles.footer}>
        <p>
          Continue in the workbook for six connected teaching sessions, the
          eight-level problem ladder, confidence-aware diagnostic, TA studios,
          study-partner routine, and Atlas async collector evidence dossier.
        </p>
        <Link href="/modules/21-async-distributed-systems">Enter Module 21 <span aria-hidden="true">→</span></Link>
      </footer>
    </section>
  );
}
