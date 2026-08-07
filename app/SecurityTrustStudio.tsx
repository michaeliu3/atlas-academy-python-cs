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
  clearModule22Progress,
  persistModule22Progress,
  restoreModule22Progress,
} from "@/lib/module22-progress-codec";
import styles from "./SecurityTrustStudio.module.css";

type TrustView =
  | "boundary"
  | "identity"
  | "pipeline"
  | "crypto"
  | "provenance"
  | "incident";
type Confidence = 1 | 2 | 3 | 4;
type ViewRecord = {
  choice: string | null;
  confidence: Confidence | null;
  revealed: boolean;
};
type StudioRecord = Record<TrustView, ViewRecord>;

const CENTRAL_INVARIANT =
  "Atlas accepts an external value only as data until the receiving boundary validates its shape, size, provenance, and permitted meaning. Every security-sensitive effect has an authenticated subject, an explicit authorization decision scoped to action, resource, tenant, and purpose, and a redacted decision record. Untrusted data never selects arbitrary code, process execution, filesystem escape, database structure, network authority, or a raw secret-bearing log field. Release artifacts have declared dependency and build provenance; incident evidence is minimised and labelled with what it does and does not prove. A safe automatic denial/defer path explains the next accessible action and escalates unresolved authority to the named owner.";

const views: ReadonlyArray<{
  id: TrustView;
  number: string;
  label: string;
  question: string;
}> = [
  {
    id: "boundary",
    number: "01",
    label: "Claim → boundary",
    question: "What has crossed, and what has not become true?",
  },
  {
    id: "identity",
    number: "02",
    label: "Identity → decision",
    question: "Who may perform this bounded action?",
  },
  {
    id: "pipeline",
    number: "03",
    label: "Data → authority",
    question: "Where could a value become power?",
  },
  {
    id: "crypto",
    number: "04",
    label: "Crypto → purpose",
    question: "Which claim does this primitive support?",
  },
  {
    id: "provenance",
    number: "05",
    label: "Release → provenance",
    question: "What evidence is still missing from a matching hash?",
  },
  {
    id: "incident",
    number: "06",
    label: "Incident → restraint",
    question: "How do we preserve a useful unknown safely?",
  },
];

const boundaryCards = [
  {
    id: "request",
    label: "external request",
    claim: "A value arrived at the importer boundary.",
    stop: "It is not an identity, permission, safe archive, or query structure.",
  },
  {
    id: "trace",
    label: "trace label",
    claim: "A declared observation can be correlated.",
    stop: "It does not authenticate a subject or authorize an action.",
  },
  {
    id: "session",
    label: "verified assertion",
    claim: "One named subject has passed the local authentication check.",
    stop: "Authentication alone does not choose a tenant, action, or purpose.",
  },
  {
    id: "decision",
    label: "authorization record",
    claim: "A policy version permitted one scoped model plan.",
    stop: "It is not a blanket capability for later work or another tenant.",
  },
] as const;

const authoritySteps = [
  ["01", "Authenticate", "Is this bounded assertion valid for `worker-99`?"],
  ["02", "Bind context", "Does the request bind worker, tenant, resource, purpose, and freshness?"],
  ["03", "Authorize", "Does policy-7 permit this exact action under that context?"],
  ["04", "Record", "Can the decision be redacted and later audited without raw secrets?"],
] as const;

const sinks = [
  {
    id: "resume",
    source: "resume state",
    unsafe: "general Python object deserializer",
    boundary: "Accept only a declared data format and schema; reject code-bearing object restoration.",
    outcome: "RESUME_FORMAT_REJECTED",
  },
  {
    id: "archive",
    source: "archive member name",
    unsafe: "extract before path/type/size policy",
    boundary: "Inspect metadata before any extraction; reject traversal, rooted, drive-qualified, special, and oversized entries.",
    outcome: "ARCHIVE_POLICY_REJECTED",
  },
  {
    id: "query",
    source: "learner-provided label",
    unsafe: "string-built database structure",
    boundary: "Bind a value through a fixed query shape; do not let input choose table, operator, or syntax.",
    outcome: "PARAMETERIZED_VALUE_PLAN",
  },
  {
    id: "transform",
    source: "transform request",
    unsafe: "shell-backed transform command",
    boundary: "Use a fixed adapter enum only after an explicit authorization decision; no shell construction.",
    outcome: "TRANSFORM_DENIED",
  },
] as const;

const cryptoPurposes = [
  {
    id: "mac",
    label: "fixture MAC",
    supports: "integrity and origin for one secret-bearing verification context",
    doesNot: "authorization, confidentiality, replay protection by itself, or a real identity provider",
  },
  {
    id: "tls",
    label: "TLS configuration",
    supports: "a reviewed transport configuration boundary and peer-authentication design",
    doesNot: "application authorization, a data-handling policy, or proof that a remote action occurred",
  },
  {
    id: "hash",
    label: "artifact hash",
    supports: "a comparison to a declared digest for named bytes",
    doesNot: "publisher identity, dependency review, a reproducible build, or a safe release",
  },
  {
    id: "secret",
    label: "entropy source",
    supports: "unpredictable secret material when a cryptographic secret is genuinely needed",
    doesNot: "a substitute for purpose limitation, authorization, or redaction",
  },
] as const;

const provenanceLinks = [
  {
    id: "publisher",
    label: "publisher identity",
    detail: "Who is allowed to publish this release, and how was that authority verified?",
  },
  {
    id: "source",
    label: "source revision",
    detail: "Which reviewed source and dependency lock state produced the artifact?",
  },
  {
    id: "build",
    label: "build environment",
    detail: "What declared builder, commands, and isolation boundary produced it?",
  },
  {
    id: "artifact",
    label: "artifact digest",
    detail: "Which exact bytes were verified against the declared release record?",
  },
] as const;

const incidentSlices = [
  {
    id: "facts",
    label: "facts",
    content: "local timeout observed · authentication denial observed · no live remote effect was attempted",
  },
  {
    id: "hypotheses",
    label: "hypotheses",
    content: "a remote importer may have acted before the local timeout; this remains a hypothesis, not a fact",
  },
  {
    id: "unknowns",
    label: "unknowns",
    content: "remote outcome unknown · status lookup itself requires a separately authorized action",
  },
  {
    id: "redaction",
    label: "redaction",
    content: "preserve run ID, decision labels, version, and digest; omit raw request, fixture assertion, secret, and learner data",
  },
] as const;

function emptyRecord(): StudioRecord {
  return {
    boundary: { choice: null, confidence: null, revealed: false },
    identity: { choice: null, confidence: null, revealed: false },
    pipeline: { choice: null, confidence: null, revealed: false },
    crypto: { choice: null, confidence: null, revealed: false },
    provenance: { choice: null, confidence: null, revealed: false },
    incident: { choice: null, confidence: null, revealed: false },
  };
}

function tabId(view: TrustView) {
  return `security-trust-tab-${view}`;
}

function panelId(view: TrustView) {
  return `security-trust-panel-${view}`;
}

function EvidenceLock() {
  return (
    <p className={styles.evidenceLock}>
      Commit an answer and confidence before evidence appears. Calibration is
      the point; this is not a surprise score.
    </p>
  );
}

type PredictionGateProps = {
  id: TrustView;
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
        <legend>Choose the strongest boundary claim</legend>
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
      <span>Atlas trust invariant</span>
      <p>{CENTRAL_INVARIANT}</p>
      <small>
        Control-room rule: a check establishes only its named decision at its
        named boundary. It never silently becomes trust in every other layer.
      </small>
    </aside>
  );
}

function BoundaryLab({
  record,
  onChange,
  selectedCard,
  onCardChange,
}: {
  record: ViewRecord;
  onChange: (next: Partial<ViewRecord>) => void;
  selectedCard: (typeof boundaryCards)[number]["id"];
  onCardChange: (next: (typeof boundaryCards)[number]["id"]) => void;
}) {
  const card = boundaryCards.find((item) => item.id === selectedCard) ?? boundaryCards[0];
  return (
    <div className={styles.viewStack}>
      <PredictionGate
        choices={[
          { id: "correlation", label: "A trace label supports correlation of declared observations only." },
          { id: "identity", label: "A trace label authenticates the worker that sent it." },
          { id: "permission", label: "A trace label permits the importer to extract the archive." },
        ]}
        id="boundary"
        onChange={onChange}
        prompt="A delayed importer request carries the same trace label as an earlier async operation. What has that label established?"
        record={record}
      />
      {record.revealed && (
        <section className={styles.revealCard} aria-live="polite">
          <div className={styles.revealHeader}>
            <span className={styles.scopeTag}>TRUST-BOUNDARY ATLAS</span>
            <h3>Arrival is not promotion.</h3>
          </div>
          <p>
            The correct answer is correlation only. Inspect one boundary card at
            a time; every card has a fact it may support and a claim it must stop.
          </p>
          <div className={styles.boundaryMap} aria-label="Trust boundary map">
            <span>external input</span><i aria-hidden="true">→</i><span>parse + size</span><i aria-hidden="true">→</i><span>authenticate</span><i aria-hidden="true">→</i><span>authorize</span><i aria-hidden="true">→</i><span>fixed adapter</span>
          </div>
          <div className={styles.selectorLayout}>
            <div className={styles.selectorList}>
              <span>Inspect a boundary artifact</span>
              {boundaryCards.map((item) => (
                <button
                  aria-pressed={selectedCard === item.id}
                  key={item.id}
                  onClick={() => onCardChange(item.id)}
                  type="button"
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div className={styles.inspectorCard}>
              <span>may say</span><h4>{card.label}</h4><p>{card.claim}</p>
              <span className={styles.stopLabel}>must not say</span><p>{card.stop}</p>
            </div>
          </div>
          <div className={styles.textEquivalent}>
            <strong>Text equivalent</strong>
            Input becomes bounded data at parse; authentication binds a subject;
            authorization binds one purpose and effect; a fixed adapter prevents
            external data from choosing arbitrary authority.
          </div>
        </section>
      )}
    </div>
  );
}

function IdentityLab({
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
  const current = authoritySteps[step];
  return (
    <div className={styles.viewStack}>
      <PredictionGate
        choices={[
          { id: "tuple", label: "Verify the subject, then authorize the exact action, tenant, resource, purpose, policy, and freshness." },
          { id: "session", label: "A valid session automatically permits every importer action." },
          { id: "trace", label: "Reuse the async trace ID as the authorization credential." },
        ]}
        id="identity"
        onChange={onChange}
        prompt="`worker-99` has a valid fixture assertion but presents a retry for a policy tuple approved only for `worker-17`. What must happen before a release-related effect?"
        record={record}
      />
      {record.revealed && (
        <section className={styles.revealCard} aria-live="polite">
          <div className={styles.revealHeader}>
            <span className={styles.scopeTag}>IDENTITY-TO-DECISION LADDER</span>
            <h3>Authentication answers a narrower question than permission.</h3>
          </div>
          <div className={styles.decisionTuple}>
            <span>subject</span><b>worker-99</b><i>×</i><span>tenant</span><b>atlas-learning</b><i>×</i><span>resource</span><b>guide-042</b><i>×</i><span>action</span><b>publish</b><i>×</i><span>purpose</span><b>reconcile-import</b><i>×</i><span>policy</span><b>policy-7</b><i>×</i><span>freshness</span><b>not established → deny/defer</b>
          </div>
          <ol className={styles.authorityLadder}>
            {authoritySteps.map(([number, label, detail], index) => (
              <li className={step === index ? styles.currentStep : undefined} key={label}>
                <button aria-pressed={step === index} onClick={() => onStepChange(index)} type="button">
                  <span>{number}</span><strong>{label}</strong><small>{detail}</small>
                </button>
              </li>
            ))}
          </ol>
          <div className={styles.stepReadout}>
            <span>current control</span><h4>{current[1]}</h4><p>{current[2]}</p>
          </div>
          <table>
            <thead><tr><th>Evidence</th><th>May support</th><th>Does not support</th></tr></thead>
            <tbody>
              <tr><td data-label="Evidence">fixture assertion verifies</td><td data-label="May support">the named local authentication result</td><td data-label="Does not support">cross-tenant permission</td></tr>
              <tr><td data-label="Evidence">policy-7 decision record</td><td data-label="May support">one scoped model plan</td><td data-label="Does not support">future actions or another purpose</td></tr>
              <tr><td data-label="Evidence">retry operation ID</td><td data-label="May support">correlation/reconciliation of an operation</td><td data-label="Does not support">an identity credential</td></tr>
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}

function PipelineLab({
  record,
  onChange,
  sinkId,
  onSinkChange,
}: {
  record: ViewRecord;
  onChange: (next: Partial<ViewRecord>) => void;
  sinkId: (typeof sinks)[number]["id"];
  onSinkChange: (next: (typeof sinks)[number]["id"]) => void;
}) {
  const sink = sinks.find((item) => item.id === sinkId) ?? sinks[0];
  return (
    <div className={styles.viewStack}>
      <PredictionGate
        choices={[
          { id: "sink", label: "Passing generic API validation does not make the value safe for an authority-bearing sink." },
          { id: "clean", label: "Schema validation makes every archive, query, process, and deserializer safe." },
          { id: "sanitize", label: "A generic sanitization step proves every downstream use safe." },
        ]}
        id="pipeline"
        onChange={onChange}
        prompt="The importer has parsed an incoming request. May it now pass learner-controlled values to archive, query, resume, or transform adapters?"
        record={record}
      />
      {record.revealed && (
        <section className={styles.revealCard} aria-live="polite">
          <div className={styles.revealHeader}>
            <span className={styles.scopeTag}>DATA-TO-AUTHORITY PIPELINE</span>
            <h3>Validate at the effect boundary, not just at the door.</h3>
          </div>
          <div className={styles.pipelineRail} aria-label="Data to authority pipeline">
            <span>untrusted value</span><i aria-hidden="true">→</i><span>declared shape</span><i aria-hidden="true">→</i><span>context policy</span><i aria-hidden="true">→</i><span>authorized fixed adapter</span>
          </div>
          <div className={styles.selectorLayout}>
            <div className={styles.selectorList}>
              <span>Inspect a sink</span>
              {sinks.map((item) => (
                <button aria-pressed={sinkId === item.id} key={item.id} onClick={() => onSinkChange(item.id)} type="button">
                  {item.source}
                </button>
              ))}
            </div>
            <div className={styles.inspectorCard}>
              <span>unsafe promotion</span><h4>{sink.unsafe}</h4>
              <span className={styles.stopLabel}>controlled receiving boundary</span><p>{sink.boundary}</p>
              <code>{sink.outcome}</code>
            </div>
          </div>
          <p className={styles.boundaryNote}>
            This is a local teaching model. It neither extracts an archive nor
            executes a process, talks to a database, opens a socket, or restores
            a general Python object.
          </p>
        </section>
      )}
    </div>
  );
}

function CryptoLab({
  record,
  onChange,
  purposeId,
  onPurposeChange,
}: {
  record: ViewRecord;
  onChange: (next: Partial<ViewRecord>) => void;
  purposeId: (typeof cryptoPurposes)[number]["id"];
  onPurposeChange: (next: (typeof cryptoPurposes)[number]["id"]) => void;
}) {
  const purpose = cryptoPurposes.find((item) => item.id === purposeId) ?? cryptoPurposes[0];
  return (
    <div className={styles.viewStack}>
      <PredictionGate
        choices={[
          { id: "narrow", label: "A cryptographic check supports its named purpose and context; authorization remains separate." },
          { id: "blanket", label: "A matching MAC automatically authorizes the requested importer action." },
          { id: "remote", label: "A reviewed TLS setting proves a remote effect occurred." },
        ]}
        id="crypto"
        onChange={onChange}
        prompt="A fixture MAC matches and the client has a reviewed TLS configuration. What is the strongest defensible conclusion?"
        record={record}
      />
      {record.revealed && (
        <section className={styles.revealCard} aria-live="polite">
          <div className={styles.revealHeader}>
            <span className={styles.scopeTag}>CRYPTOGRAPHIC PURPOSE MAP</span>
            <h3>Cryptography narrows a claim; policy chooses an effect.</h3>
          </div>
          <div className={styles.cryptoMap} aria-label="Cryptographic purpose map">
            <div><span>integrity / origin</span><strong>MAC</strong></div>
            <div><span>transport protection</span><strong>TLS</strong></div>
            <div><span>byte comparison</span><strong>HASH</strong></div>
            <div><span>secret material</span><strong>ENTROPY</strong></div>
          </div>
          <div className={styles.selectorLayout}>
            <div className={styles.selectorList}>
              <span>Inspect a primitive purpose</span>
              {cryptoPurposes.map((item) => (
                <button aria-pressed={purposeId === item.id} key={item.id} onClick={() => onPurposeChange(item.id)} type="button">
                  {item.label}
                </button>
              ))}
            </div>
            <div className={styles.inspectorCard}>
              <span>supports</span><h4>{purpose.label}</h4><p>{purpose.supports}</p>
              <span className={styles.stopLabel}>does not support</span><p>{purpose.doesNot}</p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function ProvenanceLab({
  record,
  onChange,
  linkId,
  onLinkChange,
}: {
  record: ViewRecord;
  onChange: (next: Partial<ViewRecord>) => void;
  linkId: (typeof provenanceLinks)[number]["id"];
  onLinkChange: (next: (typeof provenanceLinks)[number]["id"]) => void;
}) {
  const link = provenanceLinks.find((item) => item.id === linkId) ?? provenanceLinks[0];
  return (
    <div className={styles.viewStack}>
      <PredictionGate
        choices={[
          { id: "gap", label: "The digest comparison says only that named bytes match; publisher, source, review, and builder evidence may still be unknown." },
          { id: "safe", label: "A matching digest proves the package is safe and responsibly released." },
          { id: "author", label: "A matching digest establishes who authored every dependency." },
        ]}
        id="provenance"
        onChange={onChange}
        prompt="A release artifact matches its expected SHA-256 digest. Which release claim can Atlas responsibly make?"
        record={record}
      />
      {record.revealed && (
        <section className={styles.revealCard} aria-live="polite">
          <div className={styles.revealHeader}>
            <span className={styles.scopeTag}>RELEASE-PROVENANCE CHAIN</span>
            <h3>Integrity is one link, not the whole release story.</h3>
          </div>
          <div className={styles.provenanceChain} aria-label="Release provenance chain">
            {provenanceLinks.map((item, index) => (
              <div key={item.id}>
                <button aria-pressed={linkId === item.id} onClick={() => onLinkChange(item.id)} type="button">
                  <span>{String(index + 1).padStart(2, "0")}</span><strong>{item.label}</strong>
                </button>
                {index < provenanceLinks.length - 1 && <i aria-hidden="true">→</i>}
              </div>
            ))}
          </div>
          <div className={styles.stepReadout}>
            <span>selected provenance question</span><h4>{link.label}</h4><p>{link.detail}</p>
          </div>
          <table>
            <thead><tr><th>Control</th><th>Useful evidence</th><th>Non-claim</th></tr></thead>
            <tbody>
              <tr><td data-label="Control">dependency constraint</td><td data-label="Useful evidence">declared version and digest</td><td data-label="Non-claim">the dependency has no vulnerabilities</td></tr>
              <tr><td data-label="Control">isolated build</td><td data-label="Useful evidence">named builder and build record</td><td data-label="Non-claim">the source was reviewed or harmless</td></tr>
              <tr><td data-label="Control">artifact verification</td><td data-label="Useful evidence">matching named bytes</td><td data-label="Non-claim">publisher identity or complete provenance</td></tr>
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}

function IncidentLab({
  record,
  onChange,
  sliceId,
  onSliceChange,
}: {
  record: ViewRecord;
  onChange: (next: Partial<ViewRecord>) => void;
  sliceId: (typeof incidentSlices)[number]["id"];
  onSliceChange: (next: (typeof incidentSlices)[number]["id"]) => void;
}) {
  const slice = incidentSlices.find((item) => item.id === sliceId) ?? incidentSlices[0];
  return (
    <div className={styles.viewStack}>
      <PredictionGate
        choices={[
          { id: "unknown", label: "Preserve the remote outcome as UNKNOWN, keep a redacted local packet, and require separate authorization for status lookup/escalation." },
          { id: "failure", label: "Call the remote importer failed because the local request timed out." },
          { id: "dump", label: "Record the full raw request and fixture assertion so the incident has more detail." },
        ]}
        id="incident"
        onChange={onChange}
        prompt="The local model observes a timeout and an authentication denial. What is the right next evidence posture?"
        record={record}
      />
      {record.revealed && (
        <section className={styles.revealCard} aria-live="polite">
          <div className={styles.revealHeader}>
            <span className={styles.scopeTag}>PRIVACY-AWARE INCIDENT TIMELINE</span>
            <h3>Useful evidence records facts, hypotheses, and unknowns apart.</h3>
          </div>
          <div className={styles.incidentTimeline} aria-label="Privacy-aware incident timeline">
            <div><span>01</span><p>local timeout</p></div><i aria-hidden="true">→</i>
            <div><span>02</span><p>authentication denial</p></div><i aria-hidden="true">→</i>
            <div><span>03</span><p>redacted packet</p></div><i aria-hidden="true">→</i>
            <div><span>04</span><p>authorized escalation</p></div>
          </div>
          <div className={styles.selectorLayout}>
            <div className={styles.selectorList}>
              <span>Inspect the evidence packet</span>
              {incidentSlices.map((item) => (
                <button aria-pressed={sliceId === item.id} key={item.id} onClick={() => onSliceChange(item.id)} type="button">
                  {item.label}
                </button>
              ))}
            </div>
            <div className={styles.inspectorCard}>
              <span>packet slice</span><h4>{slice.label}</h4><p>{slice.content}</p>
            </div>
          </div>
          <div className={styles.textEquivalent}>
            <strong>Accessible incident rule</strong>
            Decision state is conveyed in text, not color alone. The packet is
            deliberately local and redacted; it is not a live security assessment
            or evidence that a remote system did—or did not—act.
          </div>
        </section>
      )}
    </div>
  );
}

export function SecurityTrustStudio() {
  const [activeView, setActiveView] = useState<TrustView>("boundary");
  const [record, setRecord] = useState<StudioRecord>(emptyRecord);
  const [storageReady, setStorageReady] = useState(false);
  const [boundaryCard, setBoundaryCard] = useState<(typeof boundaryCards)[number]["id"]>("request");
  const [authorityStep, setAuthorityStep] = useState(0);
  const [sinkId, setSinkId] = useState<(typeof sinks)[number]["id"]>("resume");
  const [purposeId, setPurposeId] = useState<(typeof cryptoPurposes)[number]["id"]>("mac");
  const [linkId, setLinkId] = useState<(typeof provenanceLinks)[number]["id"]>("publisher");
  const [sliceId, setSliceId] = useState<(typeof incidentSlices)[number]["id"]>("facts");
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
        const stored = storage ? restoreModule22Progress(storage) : null;
        if (stored) setRecord(stored as StudioRecord);
      } catch {
        // Ignore corrupt or unavailable optional learner storage.
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
      if (storage) persistModule22Progress(storage, record);
    } catch {
      // Only bounded prediction state is optional; no request/secret is retained.
    }
  }, [record, storageReady]);

  const updateRecord = (view: TrustView, next: Partial<ViewRecord>) => {
    setRecord((current) => ({
      ...current,
      [view]: { ...current[view], ...next },
    }));
  };

  const selectView = (view: TrustView) => {
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
    if (activeView === "boundary") setBoundaryCard("request");
    if (activeView === "identity") setAuthorityStep(0);
    if (activeView === "pipeline") setSinkId("resume");
    if (activeView === "crypto") setPurposeId("mac");
    if (activeView === "provenance") setLinkId("publisher");
    if (activeView === "incident") setSliceId("facts");
  };

  const resetStudio = () => {
    if (!resetArmed) {
      setResetArmed(true);
      return;
    }
    const storage = progressStorageRef.current ?? getBrowserProgressStorage();
    progressStorageRef.current = storage;
    if (storage) clearModule22Progress(storage);
    setRecord(emptyRecord());
    setActiveView("boundary");
    setBoundaryCard("request");
    setAuthorityStep(0);
    setSinkId("resume");
    setPurposeId("mac");
    setLinkId("publisher");
    setSliceId("facts");
    setResetArmed(false);
  };

  return (
    <section className={styles.studio} aria-labelledby="security-trust-studio-title">
      <header className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.kicker}>Module 22 visual studio</p>
          <h2 id="security-trust-studio-title">Atlas Trust Control Room</h2>
          <p>
            Trace one delayed importer through six connected controls: boundary,
            identity, authority sinks, cryptographic purpose, release evidence,
            and privacy-aware incident restraint.
          </p>
          <div className={styles.heroFacts}>
            <span><b>6</b> boundary views</span>
            <span><b>0</b> live effects</span>
            <span><b>1</b> redacted evidence posture</span>
          </div>
        </div>
        <div className={styles.trustOrb} aria-label="Atlas trust boundary diagram">
          <span className={styles.orbCore}>ATLAS<small>trust control</small></span>
          <i className={styles.orbRingOne} aria-hidden="true" />
          <i className={styles.orbRingTwo} aria-hidden="true" />
          <span className={`${styles.orbitToken} ${styles.inputToken}`}>untrusted input</span>
          <span className={`${styles.orbitToken} ${styles.policyToken}`}>policy-7</span>
          <span className={`${styles.orbitToken} ${styles.evidenceToken}`}>redacted evidence</span>
          <small className={styles.orbCaption}>data stays data until a named, permitted boundary</small>
        </div>
      </header>

      <InvariantPlate />

      <div className={styles.studioMeta}>
        <div>
          <span>Exploration coverage</span>
          <strong>{revealedCount} / {views.length} views revealed</strong>
          <p>Coverage records exploration only; it is not a security score.</p>
        </div>
        <div
          aria-label="Exploration coverage: revealed security and trust views"
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
          <button onClick={resetStudio} type="button">
            {resetArmed ? "Confirm reset all" : "Reset saved studio"}
          </button>
        </div>
      </div>

      <div className={styles.tabs} aria-label="Atlas Trust Control Room views" role="tablist">
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

      <div aria-labelledby={tabId("boundary")} className={styles.panel} hidden={activeView !== "boundary"} id={panelId("boundary")} role="tabpanel" tabIndex={0}>
        <BoundaryLab onCardChange={setBoundaryCard} onChange={(next) => updateRecord("boundary", next)} record={record.boundary} selectedCard={boundaryCard} />
      </div>
      <div aria-labelledby={tabId("identity")} className={styles.panel} hidden={activeView !== "identity"} id={panelId("identity")} role="tabpanel" tabIndex={0}>
        <IdentityLab onChange={(next) => updateRecord("identity", next)} onStepChange={setAuthorityStep} record={record.identity} step={authorityStep} />
      </div>
      <div aria-labelledby={tabId("pipeline")} className={styles.panel} hidden={activeView !== "pipeline"} id={panelId("pipeline")} role="tabpanel" tabIndex={0}>
        <PipelineLab onChange={(next) => updateRecord("pipeline", next)} onSinkChange={setSinkId} record={record.pipeline} sinkId={sinkId} />
      </div>
      <div aria-labelledby={tabId("crypto")} className={styles.panel} hidden={activeView !== "crypto"} id={panelId("crypto")} role="tabpanel" tabIndex={0}>
        <CryptoLab onChange={(next) => updateRecord("crypto", next)} onPurposeChange={setPurposeId} purposeId={purposeId} record={record.crypto} />
      </div>
      <div aria-labelledby={tabId("provenance")} className={styles.panel} hidden={activeView !== "provenance"} id={panelId("provenance")} role="tabpanel" tabIndex={0}>
        <ProvenanceLab linkId={linkId} onChange={(next) => updateRecord("provenance", next)} onLinkChange={setLinkId} record={record.provenance} />
      </div>
      <div aria-labelledby={tabId("incident")} className={styles.panel} hidden={activeView !== "incident"} id={panelId("incident")} role="tabpanel" tabIndex={0}>
        <IncidentLab onChange={(next) => updateRecord("incident", next)} onSliceChange={setSliceId} record={record.incident} sliceId={sliceId} />
      </div>

      <footer className={styles.footer}>
        <p>
          Continue in the workbook for six connected teaching sessions, an
          eight-level problem ladder, confidence-aware diagnostic, TA clinics,
          study-partner routine, and the Atlas Trust & Release Dossier.
        </p>
        <Link href="/modules/22-security-privacy-trust-boundaries">
          Enter Module 22 <span aria-hidden="true">→</span>
        </Link>
      </footer>
    </section>
  );
}
