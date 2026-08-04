"use client";

import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { getBrowserProgressStorage } from "@/lib/browser-progress-storage";
import {
  clearModule26Progress,
  persistModule26Progress,
  restoreModule26Progress,
} from "@/lib/module26-progress-codec";
import styles from "./CapstoneDefenseStudio.module.css";

type StudioView =
  | "brief"
  | "threads"
  | "failure"
  | "patch"
  | "ledger"
  | "board";
type Confidence = 1 | 2 | 3 | 4;
type ViewRecord = {
  choice: string | null;
  confidence: Confidence | null;
  revealed: boolean;
};
type StudioRecord = Record<StudioView, ViewRecord>;
type ProgressPersistence = "loading" | "ready" | "saved" | "unavailable";
type PatchDecision = "accept" | "revise" | "reject" | null;
type FailureMode = "normal" | "retry" | "authority";
type Challenge = "rollback" | "dependency" | "invariant";

const CORE_RULE =
  "A capstone release is a versioned evidence bundle, not a polished demo. Each consequential claim needs a named owner, representation or contract, appropriate test or observation, cost and failure boundary, security/privacy implication, human-impact evaluation, and explicit limitation. Agent-generated work remains an untrusted proposal until independently reviewed and verified.";

const views: ReadonlyArray<{
  id: StudioView;
  number: string;
  label: string;
  question: string;
  artifact: string;
}> = [
  {
    id: "brief",
    number: "01",
    label: "Release Brief",
    question: "What is the narrow release claim?",
    artifact: "release contract",
  },
  {
    id: "threads",
    number: "02",
    label: "System Threads",
    question: "Which boundaries make that claim true?",
    artifact: "ownership map",
  },
  {
    id: "failure",
    number: "03",
    label: "Failure Playback",
    question: "Where can the invariant break?",
    artifact: "incident card",
  },
  {
    id: "patch",
    number: "04",
    label: "Red-Team Patch Bay",
    question: "Should this proposal cross the boundary?",
    artifact: "review decision",
  },
  {
    id: "ledger",
    number: "05",
    label: "Evidence Ledger",
    question: "What does each artifact actually establish?",
    artifact: "claim ledger",
  },
  {
    id: "board",
    number: "06",
    label: "Release Board & Defense",
    question: "Release, revise, defer, or roll back—and why?",
    artifact: "defense packet",
  },
];

const choices: Record<StudioView, ReadonlyArray<{ id: string; label: string }>> = {
  brief: [
    {
      id: "bounded",
      label: "Release one optional, reversible suggestion only under a named contract.",
    },
    {
      id: "demo",
      label: "Release the feature because the demo works and the UI is polished.",
    },
    {
      id: "metric",
      label: "Release automatically when enough checks and metrics are green.",
    },
  ],
  threads: [
    {
      id: "trace",
      label: "Trace one request through data, policy, authority, runtime, and recovery owners.",
    },
    {
      id: "diagram",
      label: "Trust the most detailed architecture diagram because it contains all components.",
    },
    {
      id: "folders",
      label: "Use the folder tree as the main proof of runtime responsibility.",
    },
  ],
  ledger: [
    {
      id: "scoped",
      label: "Treat every test, review, and observation as evidence for its named scope only.",
    },
    {
      id: "quality",
      label: "Combine passing checks into one universal quality score for release.",
    },
    {
      id: "security",
      label: "Call the system security-clean once the dependency scan is green.",
    },
  ],
  failure: [
    {
      id: "idempotent",
      label: "Preserve one logical event identity and bound its durable effect under retry.",
    },
    {
      id: "timeout",
      label: "Assume the server did nothing whenever the client sees a timeout.",
    },
    {
      id: "lock",
      label: "Use any in-process lock and claim every deployment shape is safe.",
    },
  ],
  patch: [
    {
      id: "review",
      label: "Review the full diff, new dependency/data/authority boundaries, tests, and rollback path.",
    },
    {
      id: "merge",
      label: "Merge because the agent explains the change confidently and cites a source.",
    },
    {
      id: "ban",
      label: "Ban all third-party code and agents without considering a bounded alternative.",
    },
  ],
  board: [
    {
      id: "defer",
      label: "Defer or revise until the missing owner, evidence, or recovery route is explicit.",
    },
    {
      id: "release",
      label: "Release anyway because the known facts look favorable.",
    },
    {
      id: "confidence",
      label: "Let a model confidence score choose the release outcome.",
    },
  ],
};

const correctChoice: Record<StudioView, string> = {
  brief: "bounded",
  threads: "trace",
  ledger: "scoped",
  failure: "idempotent",
  patch: "review",
  board: "defer",
};

const feedback: Record<
  StudioView,
  { title: string; answer: string; whyOthersFail: string }
> = {
  brief: {
    title: "A release starts as a bounded promise—not a feature wish or score threshold.",
    answer:
      "The release brief names one optional, reversible study action, its owner, non-goal, evidence, and disable path. It does not quietly authorize state change.",
    whyOthersFail:
      "A polished demo may reveal a presentation path, not a durable contract. A collection of favorable metrics still lacks an owner, human-control boundary, and recovery decision.",
  },
  threads: {
    title: "Architecture becomes useful when a concrete path can be challenged.",
    answer:
      "Trace one event through its input, state, candidate policy, display boundary, and failure/recovery owner. Each arrow must point to code, configuration, a test, or an explicit unknown.",
    whyOthersFail:
      "A detailed diagram can still be aspirational or stale. A folder tree says where a file lives, not who owns authority, data, or a runtime failure.",
  },
  ledger: {
    title: "Evidence is a collection of scoped observations, never a magic quality total.",
    answer:
      "A test, CI result, keyboard observation, review, provenance record, and drill each support different claims. Keep their scope, version, limitation, and next falsifier visible.",
    whyOthersFail:
      "Adding partial observations does not prove universal quality. A dependency scan only reports against its known data and configuration; it cannot establish that every risk is gone.",
  },
  failure: {
    title: "Retry safety is about a logical effect, not a guarantee that networks behave perfectly.",
    answer:
      "Name a stable event identity, constrain the durable write, and make recovery observable. The intended scope is at-most-one durable effect for the declared boundary.",
    whyOthersFail:
      "A timeout is ambiguous: work may already have committed. An in-process lock may not cover other workers, processes, storage clients, or retry paths.",
  },
  patch: {
    title: "An AI or human patch is a proposal until a maintainer reads and verifies it.",
    answer:
      "Inspect the full diff and surrounding path, then challenge added recipients, dependencies, authority, tests, source/version, and rollback. A named human makes the decision.",
    whyOthersFail:
      "Fluency and citations do not confer permission. An absolute ban avoids the actual tradeoff and can hide a safer local, constrained alternative.",
  },
  board: {
    title: "A defensible defer is stronger than a cheerful release with a hidden gap.",
    answer:
      "When a required owner, recovery route, evidence card, or authority boundary is missing, narrow the claim and defer or revise. Release remains a human decision after evidence review.",
    whyOthersFail:
      "Favorable facts cannot compensate for an unowned gap. A confidence score is neither a recovery plan nor authority to expose a system to people.",
  },
};

const confidenceOptions: ReadonlyArray<{ value: Confidence; label: string }> = [
  { value: 1, label: "Guess" },
  { value: 2, label: "Somewhat" },
  { value: 3, label: "Strong" },
  { value: 4, label: "Certain" },
];

const architecturePath = [
  {
    id: "event",
    label: "synthetic event",
    detail: "one logical session record with a stable id",
    tag: "[CONTRACT]",
  },
  {
    id: "api",
    label: "event boundary",
    detail: "validate, deduplicate, and return one bounded outcome",
    tag: "[MECHANISM]",
  },
  {
    id: "store",
    label: "durable effect",
    detail: "one named record per idempotency key in the fixture",
    tag: "[TESTED BEHAVIOR]",
  },
  {
    id: "policy",
    label: "candidate + policy",
    detail: "declared actions precede a transparent ordinal rank",
    tag: "[CONTRACT]",
  },
  {
    id: "human",
    label: "human control",
    detail: "a visible option may be accepted, dismissed, or replaced",
    tag: "[OBSERVATION]",
  },
  {
    id: "release",
    label: "release evidence",
    detail: "named owner, source version, checks, limit, and rollback route",
    tag: "[DECISION]",
  },
] as const;

const ledgerRows = [
  {
    label: "[CONTRACT]",
    claim: "A score cannot change a plan or approve a release.",
    artifact: "decision contract + review rule",
    scope: "fixed Atlas capability",
    nonClaim: "not proof of every implementation path",
  },
  {
    label: "[TESTED BEHAVIOR]",
    claim: "A retry key is deduplicated in the named fixture.",
    artifact: "deterministic incident case",
    scope: "synthetic event order",
    nonClaim: "not exactly-once delivery everywhere",
  },
  {
    label: "[OBSERVATION]",
    claim: "The named keyboard path reaches explanation and override.",
    artifact: "manual task observation",
    scope: "declared browser/task",
    nonClaim: "not universal accessibility or benefit",
  },
  {
    label: "[DECISION]",
    claim: "The candidate may be released only within stated evidence scope.",
    artifact: "reviewed release board",
    scope: "named source/version",
    nonClaim: "not security, privacy, or correctness certification",
  },
] as const;

const challenges: Record<
  Challenge,
  { title: string; condition: string; recommendation: string; reason: string }
> = {
  rollback: {
    title: "Rollback owner disappears",
    condition: "The candidate has tests and a clear UI, but nobody can name a known-good version or owner who may disable it.",
    recommendation: "DEFER / REVISE",
    reason: "The recovery claim is unowned. Record the missing route rather than converting favorable checks into authority.",
  },
  dependency: {
    title: "New provider has unknown retention",
    condition: "A patch adds an external summarizer, but its retention and availability terms are unknown.",
    recommendation: "DEFER / REMOVE PROVIDER PATH",
    reason: "The data and availability boundary changed. Use the local baseline or obtain a reviewed, explicit contract before making any provider-dependent claim.",
  },
  invariant: {
    title: "Retry creates two durable effects",
    condition: "A failure replay shows one logical event can update progress twice on retry.",
    recommendation: "ROLL BACK / DISABLE",
    reason: "A named invariant is broken. Contain the path, restore a known-good boundary, and preserve evidence for the regression repair.",
  },
};

function emptyRecord(): StudioRecord {
  return {
    brief: { choice: null, confidence: null, revealed: false },
    threads: { choice: null, confidence: null, revealed: false },
    ledger: { choice: null, confidence: null, revealed: false },
    failure: { choice: null, confidence: null, revealed: false },
    patch: { choice: null, confidence: null, revealed: false },
    board: { choice: null, confidence: null, revealed: false },
  };
}

function EvidenceLock({ artifact }: { artifact: string }) {
  return (
    <div className={styles.evidenceLock} role="status">
      <span aria-hidden="true">◇</span>
      <div>
        <strong>Predict before opening the {artifact}.</strong>
        <p>Choose a conclusion and confidence first. A wrong answer opens a repair bridge; it never blocks you.</p>
      </div>
    </div>
  );
}

function PredictionGate({
  view,
  record,
  onChoice,
  onConfidence,
  onReveal,
}: {
  view: (typeof views)[number];
  record: ViewRecord;
  onChoice: (choice: string) => void;
  onConfidence: (confidence: Confidence) => void;
  onReveal: () => void;
}) {
  const result = record.choice === correctChoice[view.id];
  return (
    <section className={styles.prediction} aria-labelledby={`capstone-${view.id}-prediction`}>
      <div className={styles.predictionHeader}>
        <span className={styles.eyebrow}>Decision before evidence</span>
        <h3 id={`capstone-${view.id}-prediction`}>{view.question}</h3>
      </div>
      <div className={styles.choiceGrid} role="group" aria-label={`${view.label} prediction`}>
        {choices[view.id].map((choice) => {
          const selected = record.choice === choice.id;
          return (
            <button
              className={`${styles.choice} ${selected ? styles.choiceSelected : ""}`}
              key={choice.id}
              type="button"
              aria-pressed={selected}
              onClick={() => onChoice(choice.id)}
            >
              <span className={styles.choiceMark} aria-hidden="true">{selected ? "●" : "○"}</span>
              {choice.label}
            </button>
          );
        })}
      </div>
      <div className={styles.confidenceRow} aria-label="Confidence before reveal">
        <span>Confidence</span>
        <div className={styles.confidenceChoices}>
          {confidenceOptions.map((option) => {
            const selected = record.confidence === option.value;
            return (
              <button
                className={`${styles.confidenceChoice} ${selected ? styles.confidenceSelected : ""}`}
                key={option.value}
                type="button"
                aria-pressed={selected}
                onClick={() => onConfidence(option.value)}
              >
                {option.label}
              </button>
            );
          })}
        </div>
        <button
          className={styles.revealButton}
          type="button"
          disabled={record.choice === null || record.confidence === null}
          onClick={onReveal}
        >
          Reveal evidence
        </button>
      </div>
      {record.revealed && (
        <div className={`${styles.feedback} ${result ? styles.feedbackCorrect : styles.feedbackRepair}`} role="status">
          <span className={styles.feedbackSignal} aria-hidden="true">{result ? "✓" : "↗"}</span>
          <div>
            <strong>{feedback[view.id].title}</strong>
            <p>{feedback[view.id].answer}</p>
            <p><b>Why the alternatives fail:</b> {feedback[view.id].whyOthersFail}</p>
            {!result && <p className={styles.repairNote}>Repair bridge: reopen the central invariant, then locate the smallest trace or artifact that counters your original choice.</p>}
          </div>
        </div>
      )}
    </section>
  );
}

function ReleaseBriefEvidence() {
  return (
    <section className={styles.evidencePanel} aria-label="Release brief evidence">
      <div className={styles.panelIntro}>
        <span className={styles.sectionNumber}>01</span>
        <div>
          <span className={styles.eyebrow}>[CONTRACT]</span>
          <h3>One release claim. Four deliberate limits.</h3>
          <p>Start with a promise a maintainer could revoke, not a feature list that sounds impressive.</p>
        </div>
      </div>
      <div className={styles.briefGrid}>
        <article className={styles.claimCard}>
          <span className={styles.cardLabel}>Claim</span>
          <p>Offer an optional next-study action for a fixed synthetic case.</p>
        </article>
        <article className={styles.claimCard}>
          <span className={styles.cardLabel}>Invariant</span>
          <p>No score silently writes a plan, calendar, record, merge, or release.</p>
        </article>
        <article className={styles.claimCard}>
          <span className={styles.cardLabel}>Owner</span>
          <p>Learner owns the choice; course maintainer owns release and rollback.</p>
        </article>
        <article className={styles.claimCard}>
          <span className={styles.cardLabel}>Open risk</span>
          <p>A claim with no known-good version or disable path must be deferred.</p>
        </article>
      </div>
      <div className={styles.nonClaim}>
        <b>[UNKNOWN]</b> A clean card does not establish production readiness, universal accessibility, privacy compliance, security, or learning benefit.
      </div>
    </section>
  );
}

function SystemThreadsEvidence({
  selectedThread,
  onThreadChange,
}: {
  selectedThread: "record" | "proposal";
  onThreadChange: (thread: "record" | "proposal") => void;
}) {
  const isRecord = selectedThread === "record";
  return (
    <section className={styles.evidencePanel} aria-label="System threads evidence">
      <div className={styles.panelIntro}>
        <span className={styles.sectionNumber}>02</span>
        <div>
          <span className={styles.eyebrow}>[SYSTEM MAP]</span>
          <h3>Follow one thread; do not open the whole repository at once.</h3>
          <p>The active path is intentionally small. Adjacent concerns stay available as audit detail rather than competing for attention.</p>
        </div>
      </div>
      <div className={styles.threadChooser} aria-label="Choose a system thread">
        <button type="button" className={isRecord ? styles.threadActive : ""} aria-pressed={isRecord} onClick={() => onThreadChange("record")}>Trace durable event</button>
        <button type="button" className={!isRecord ? styles.threadActive : ""} aria-pressed={!isRecord} onClick={() => onThreadChange("proposal")}>Trace optional proposal</button>
      </div>
      <div className={styles.flow}>
        {architecturePath.map((stage, index) => {
          const muted = isRecord
            ? stage.id === "policy" || stage.id === "human"
            : stage.id === "store";
          return (
            <div className={`${styles.flowStep} ${muted ? styles.flowMuted : ""}`} key={stage.id}>
              <article className={styles.flowNode}>
                <span className={styles.cardLabel}>{stage.tag}</span>
                <strong>{stage.label}</strong>
                <p>{stage.detail}</p>
              </article>
              {index < architecturePath.length - 1 && <span className={styles.flowArrow} aria-hidden="true">→</span>}
            </div>
          );
        })}
      </div>
      <p className={styles.textEquivalent}><b>Text equivalent:</b> {isRecord ? "A synthetic event is validated, deduplicated, and recorded before an optional display path is considered. A lost response may cause retry; it must not cause a second durable effect." : "After the bounded event path, a declared candidate set is ranked by a transparent policy. The interface exposes an explanation and human choice; no score owns a state write."}</p>
    </section>
  );
}

function EvidenceLedgerEvidence() {
  return (
    <section className={styles.evidencePanel} aria-label="Evidence ledger">
      <div className={styles.panelIntro}>
        <span className={styles.sectionNumber}>05</span>
        <div>
          <span className={styles.eyebrow}>[OBSERVATION] → [LIMIT]</span>
          <h3>Keep the conclusion beside the evidence it cannot provide.</h3>
          <p>The ledger resists the most common release error: turning compatible observations into one oversized claim.</p>
        </div>
      </div>
      <div className={styles.ledgerWrap}>
        <table className={styles.ledgerTable}>
          <thead>
            <tr>
              <th>Label</th>
              <th>Bounded claim</th>
              <th>Artifact</th>
              <th>Scope</th>
              <th>Does not establish</th>
            </tr>
          </thead>
          <tbody>
            {ledgerRows.map((row) => (
              <tr key={row.label}>
                <td><span className={styles.ledgerLabel}>{row.label}</span></td>
                <td>{row.claim}</td>
                <td>{row.artifact}</td>
                <td>{row.scope}</td>
                <td>{row.nonClaim}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={styles.falsifier}><b>Next falsifier:</b> What smallest changed input, environment, dependency, user task, or failure would force this card to narrow or disappear?</div>
    </section>
  );
}

function FailurePlaybackEvidence({
  mode,
  onModeChange,
}: {
  mode: FailureMode;
  onModeChange: (mode: FailureMode) => void;
}) {
  const steps =
    mode === "normal"
      ? [
          ["01", "client", "submit event e-204"],
          ["02", "event boundary", "validate one logical identity"],
          ["03", "store", "commit one durable record"],
          ["04", "interface", "show optional outcome"],
        ]
      : mode === "retry"
        ? [
            ["01", "client", "submit event e-204"],
            ["02", "store", "commit one durable record"],
            ["03", "network", "response is lost"],
            ["04", "client", "retry same e-204"],
            ["05", "event boundary", "recognize existing record; return same logical outcome"],
          ]
        : [
            ["01", "proposal", "asks to overwrite a study plan"],
            ["02", "authority boundary", "record request as disallowed"],
            ["03", "state", "no plan or schedule mutation occurs"],
            ["04", "release board", "defer or disable the offending path"],
          ];
  const status = mode === "normal" ? "Expected path" : mode === "retry" ? "Partial-failure replay" : "Authority-boundary replay";
  return (
    <section className={styles.evidencePanel} aria-label="Failure playback evidence">
      <div className={styles.panelIntro}>
        <span className={styles.sectionNumber}>03</span>
        <div>
          <span className={styles.eyebrow}>[FAILURE TRACE]</span>
          <h3>Change the event sequence, not just the error message.</h3>
          <p>Trace what may already be true when a caller sees a timeout or a proposal asks for more authority.</p>
        </div>
      </div>
      <div className={styles.scenarioButtons} aria-label="Choose a fixed failure replay">
        <button type="button" className={mode === "normal" ? styles.scenarioActive : ""} aria-pressed={mode === "normal"} onClick={() => onModeChange("normal")}>Normal request</button>
        <button type="button" className={mode === "retry" ? styles.scenarioActive : ""} aria-pressed={mode === "retry"} onClick={() => onModeChange("retry")}>Lost response → retry</button>
        <button type="button" className={mode === "authority" ? styles.scenarioActive : ""} aria-pressed={mode === "authority"} onClick={() => onModeChange("authority")}>Disallowed authority</button>
      </div>
      <div className={styles.timeline}>
        <div className={styles.timelineStatus}><span>{status}</span><b>{mode === "retry" ? "invariant: durable_effects(e-204) ≤ 1" : mode === "authority" ? "invariant: zero automatic state writes" : "invariant: named logical event has one stated outcome"}</b></div>
        {steps.map(([number, owner, detail]) => (
          <article className={styles.timelineStep} key={number}>
            <span className={styles.timelineNumber}>{number}</span>
            <div><strong>{owner}</strong><p>{detail}</p></div>
          </article>
        ))}
      </div>
      <p className={styles.textEquivalent}><b>Text equivalent:</b> This is a fixed synthetic playback. It records a sequence and its intended boundary; it does not emulate a real queue, transaction manager, network, or deployment.</p>
    </section>
  );
}

function PatchBayEvidence({
  decision,
  onDecision,
}: {
  decision: PatchDecision;
  onDecision: (decision: PatchDecision) => void;
}) {
  const response = decision === "accept"
    ? "Accept only after the hosted-provider and moving-reference changes are removed or independently justified with bounded data, provenance, tests, and rollback evidence."
    : decision === "revise"
      ? "Revise is the strongest current response: restore a pinned dependency, keep the local template, then make any new capability reviewable as a separate proposal."
      : decision === "reject"
        ? "Reject is justified if the change cannot meet the current contract. Record why, preserve the local baseline, and name the evidence that could reopen review."
        : "Choose a rehearsal response. This studio never applies, merges, publishes, or deploys a patch.";
  return (
    <section className={styles.evidencePanel} aria-label="Red-team patch evidence">
      <div className={styles.panelIntro}>
        <span className={styles.sectionNumber}>04</span>
        <div>
          <span className={styles.eyebrow}>[UNTRUSTED PROPOSAL]</span>
          <h3>Read the changed boundary before debating style.</h3>
          <p>The smallest visible diff can introduce a data recipient, mutable supply-chain reference, new authority, or loss of recovery.</p>
        </div>
      </div>
      <pre
        aria-label="Scrollable small proposed patch"
        className={styles.patchCode}
        tabIndex={0}
      >
        <code><span className={styles.patchContext}>def render_release_note(packet):</span>{"\n"}<span className={styles.patchRemove}>-    return local_template(packet)</span>{"\n"}<span className={styles.patchAdd}>+    return hosted_agent.summarize(packet)</span>{"\n\n"}<span className={styles.patchContext}>workflow:</span>{"\n"}<span className={styles.patchRemove}>-  uses: actions/checkout@&lt;pinned-revision&gt;</span>{"\n"}<span className={styles.patchAdd}>+  uses: some-action/checkout-helper@main</span></code>
      </pre>
      <div className={styles.patchQuestions}>
        <span>[DATA] Which new recipient/retention boundary exists?</span>
        <span>[PROVENANCE] Which reference became mutable?</span>
        <span>[AUTHORITY] Who can review/approve the resulting output?</span>
        <span>[RECOVERY] What local baseline remains if the provider fails?</span>
      </div>
      <div className={styles.patchActions} aria-label="Patch review rehearsal">
        <button type="button" className={decision === "accept" ? styles.patchAccept : ""} aria-pressed={decision === "accept"} onClick={() => onDecision("accept")}>Accept conditionally</button>
        <button type="button" className={decision === "revise" ? styles.patchRevise : ""} aria-pressed={decision === "revise"} onClick={() => onDecision("revise")}>Request revision</button>
        <button type="button" className={decision === "reject" ? styles.patchReject : ""} aria-pressed={decision === "reject"} onClick={() => onDecision("reject")}>Reject boundary crossing</button>
      </div>
      <div className={styles.localStatus} role="status">{response}</div>
    </section>
  );
}

function ReleaseBoardEvidence({
  challenge,
  onChallenge,
}: {
  challenge: Challenge;
  onChallenge: (challenge: Challenge) => void;
}) {
  const selected = challenges[challenge];
  return (
    <section className={styles.evidencePanel} aria-label="Release board and defense evidence">
      <div className={styles.panelIntro}>
        <span className={styles.sectionNumber}>06</span>
        <div>
          <span className={styles.eyebrow}>[DECISION] + [UNKNOWN]</span>
          <h3>A review board changes one premise and watches the claim narrow honestly.</h3>
          <p>The decision card contains evidence, owner, risk, and recovery—not an automated threshold.</p>
        </div>
      </div>
      <div className={styles.boardGrid}>
        <article className={styles.boardCard}>
          <span className={styles.cardLabel}>Candidate</span>
          <strong>Optional next-study suggestion</strong>
          <p>Fixed synthetic context; no automatic learner-state mutation.</p>
        </article>
        <article className={styles.boardCard}>
          <span className={styles.cardLabel}>Evidence status</span>
          <strong>Named artifacts present</strong>
          <p>Contract, trace, fixture test, human-control task, review, and limitation remain separately legible.</p>
        </article>
        <article className={styles.boardCard}>
          <span className={styles.cardLabel}>Release owner</span>
          <strong>Human maintainer</strong>
          <p>May release, defer, or roll back after independent review; the model and score cannot decide.</p>
        </article>
      </div>
      <div className={styles.challengeChooser} aria-label="Choose a changed constraint">
        {(Object.keys(challenges) as Challenge[]).map((key) => (
          <button key={key} type="button" className={challenge === key ? styles.challengeActive : ""} aria-pressed={challenge === key} onClick={() => onChallenge(key)}>{challenges[key].title}</button>
        ))}
      </div>
      <article className={styles.challengeCard}>
        <span className={styles.cardLabel}>Changed constraint</span>
        <h4>{selected.title}</h4>
        <p>{selected.condition}</p>
        <div className={styles.recommendation}><span>Recommended decision</span><strong>{selected.recommendation}</strong></div>
        <p><b>Why:</b> {selected.reason}</p>
      </article>
      <div className={styles.defensePrompt}><b>Oral-defense prompt:</b> State the initial claim, identify the exact evidence changed by this condition, name the owner, then give the smallest next falsifier or recovery action.</div>
    </section>
  );
}

export function CapstoneDefenseStudio() {
  const [activeView, setActiveView] = useState<StudioView>("brief");
  const [record, setRecord] = useState<StudioRecord>(emptyRecord);
  const [storageReady, setStorageReady] = useState(false);
  const [persistence, setPersistence] = useState<ProgressPersistence>("loading");
  const [selectedThread, setSelectedThread] = useState<"record" | "proposal">("record");
  const [failureMode, setFailureMode] = useState<FailureMode>("retry");
  const [patchDecision, setPatchDecision] = useState<PatchDecision>(null);
  const [challenge, setChallenge] = useState<Challenge>("rollback");
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const progressDirtyRef = useRef(false);

  useEffect(() => {
    const hydrationTimer = window.setTimeout(() => {
      try {
        const storage = getBrowserProgressStorage();
        if (!storage) {
          setPersistence("unavailable");
        } else {
          const stored = restoreModule26Progress(storage);
          if (stored) {
            setRecord(stored as StudioRecord);
            setPersistence("saved");
          } else {
            setPersistence("ready");
          }
        }
      } catch {
        // Local learning progress is optional; an unavailable/corrupt store never blocks the studio.
        setPersistence("unavailable");
      } finally {
        setStorageReady(true);
      }
    }, 0);
    return () => window.clearTimeout(hydrationTimer);
  }, []);

  useEffect(() => {
    if (!storageReady || !progressDirtyRef.current) {
      return;
    }
    try {
      const storage = getBrowserProgressStorage();
      const nextPersistence =
        storage && persistModule26Progress(storage, record)
          ? "saved"
          : "unavailable";
      window.queueMicrotask(() => setPersistence(nextPersistence));
    } catch {
      // Deliberately no remote fallback: this studio never sends learning data elsewhere.
    } finally {
      progressDirtyRef.current = false;
    }
  }, [record, storageReady]);

  const current = views.find((view) => view.id === activeView) ?? views[0];
  const currentRecord = record[activeView];
  const revealedCount = views.filter((view) => record[view.id].revealed).length;

  function updateRecord(view: StudioView, update: Partial<ViewRecord>) {
    progressDirtyRef.current = true;
    setRecord((currentRecordValue) => ({
      ...currentRecordValue,
      [view]: { ...currentRecordValue[view], ...update },
    }));
  }

  function resetProgress() {
    progressDirtyRef.current = false;
    try {
      const storage = getBrowserProgressStorage();
      setPersistence(
        storage && clearModule26Progress(storage) ? "ready" : "unavailable",
      );
    } catch {
      // Local persistence is optional; reset the in-memory study state either way.
    }
    setRecord(emptyRecord());
  }

  function handleTabKeyDown(event: ReactKeyboardEvent<HTMLButtonElement>, index: number) {
    const key = event.key;
    if (![
      "ArrowRight",
      "ArrowLeft",
      "Home",
      "End",
    ].includes(key)) {
      return;
    }
    event.preventDefault();
    const nextIndex = key === "ArrowRight"
      ? (index + 1) % views.length
      : key === "ArrowLeft"
        ? (index - 1 + views.length) % views.length
        : key === "Home"
          ? 0
          : views.length - 1;
    setActiveView(views[nextIndex].id);
    tabRefs.current[nextIndex]?.focus();
  }

  function renderEvidence() {
    if (!currentRecord.revealed) {
      return <EvidenceLock artifact={current.artifact} />;
    }
    if (activeView === "brief") {
      return <ReleaseBriefEvidence />;
    }
    if (activeView === "threads") {
      return <SystemThreadsEvidence selectedThread={selectedThread} onThreadChange={setSelectedThread} />;
    }
    if (activeView === "failure") {
      return <FailurePlaybackEvidence mode={failureMode} onModeChange={setFailureMode} />;
    }
    if (activeView === "patch") {
      return <PatchBayEvidence decision={patchDecision} onDecision={setPatchDecision} />;
    }
    if (activeView === "ledger") {
      return <EvidenceLedgerEvidence />;
    }
    return <ReleaseBoardEvidence challenge={challenge} onChallenge={setChallenge} />;
  }

  return (
    <section className={styles.studio} aria-labelledby="capstone-defense-studio-title">
      <header className={styles.hero}>
        <div className={styles.heroEyebrow}><span>Module 26</span><span aria-hidden="true">/</span><span>Days 56–60</span><span aria-hidden="true">/</span><span>Capstone evidence studio</span></div>
        <h2 id="capstone-defense-studio-title">Make the release argument.</h2>
        <p>Read one bounded capability like a maintainer: define what it may promise, trace how it works, challenge its evidence, and decide whether to release, revise, defer, or roll back.</p>
      </header>

      <div className={styles.metaStrip} aria-label="Persistent capstone context">
        <div><span>Current claim</span><strong>Optional, reversible suggestion</strong></div>
        <div><span>Invariant</span><strong>No score becomes authority</strong></div>
        <div><span>Evidence status</span><strong>{revealedCount}/6 views inspected</strong></div>
        <div><span>Open risk</span><strong>Recovery or scope may be missing</strong></div>
      </div>

      <div className={styles.ruleCard}>
        <span className={styles.ruleMarker}>×</span>
        <p>{CORE_RULE}</p>
      </div>

      <div className={styles.progressNote}>
        <span role="status">
          {persistence === "loading"
            ? "Preparing optional local-only progress…"
            : persistence === "saved"
              ? "Your answers and confidence are saved only in this browser."
              : persistence === "ready"
                ? "Local-only progress is available in this browser."
                : "Browser storage is unavailable; this visit stays in memory."}
        </span>
        <span><b>0</b> live learner records · <b>0</b> external calls · no release, merge, plan, or schedule can change here.</span>
        <button className={styles.resetProgress} onClick={resetProgress} type="button">Reset local progress</button>
      </div>

      <div className={styles.tabList} role="tablist" aria-label="Capstone studio views">
        {views.map((view, index) => {
          const selected = view.id === activeView;
          const inspected = record[view.id].revealed;
          return (
            <button
              className={`${styles.tab} ${selected ? styles.tabSelected : ""}`}
              key={view.id}
              id={`capstone-tab-${view.id}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`capstone-panel-${view.id}`}
              tabIndex={selected ? 0 : -1}
              ref={(element) => { tabRefs.current[index] = element; }}
              onClick={() => setActiveView(view.id)}
              onKeyDown={(event) => handleTabKeyDown(event, index)}
            >
              <span className={styles.tabNumber}>{view.number}</span>
              <span>{view.label}</span>
              <span className={styles.tabState} aria-label={inspected ? "Evidence inspected" : "Evidence not yet inspected"}>{inspected ? "●" : "○"}</span>
            </button>
          );
        })}
      </div>

      {views.map((view) => {
        const selected = view.id === activeView;
        return (
          <div
            className={styles.panel}
            id={`capstone-panel-${view.id}`}
            key={view.id}
            role="tabpanel"
            aria-labelledby={`capstone-tab-${view.id}`}
            hidden={!selected}
          >
            {selected && (
              <>
                <div className={styles.panelLead}>
                  <span className={styles.panelNumber}>{current.number}</span>
                  <div>
                    <span className={styles.eyebrow}>{current.label} · {current.artifact}</span>
                    <h3>{current.question}</h3>
                    <p>Answer first. Then open a small mechanism and its audit boundary rather than a wall of details.</p>
                  </div>
                </div>
                <PredictionGate
                  view={current}
                  record={currentRecord}
                  onChoice={(choice) => updateRecord(activeView, { choice, revealed: false })}
                  onConfidence={(confidence) => updateRecord(activeView, { confidence, revealed: false })}
                  onReveal={() => updateRecord(activeView, { revealed: true })}
                />
                {renderEvidence()}
              </>
            )}
          </div>
        );
      })}

      <footer className={styles.footer}>
        <div>
          <span className={styles.eyebrow}>Audit layer</span>
          <p>Use the workbook for the six-session release dossier, architecture defense, TA protocol, and source route. The deterministic reference model remains a private preview input until M26 is released.</p>
        </div>
      </footer>
    </section>
  );
}
