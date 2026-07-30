"use client";

import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import styles from "./NetworkProtocolStudio.module.css";

type ProtocolView =
  | "naming"
  | "framing"
  | "evidence"
  | "http"
  | "retry"
  | "audit";
type Confidence = 1 | 2 | 3 | 4;
type FrameCase = "split" | "coalesced" | "incomplete" | "oversize";
type ViewRecord = {
  choice: string | null;
  confidence: Confidence | null;
  revealed: boolean;
};
type StudioRecord = Record<ProtocolView, ViewRecord>;

const CENTRAL_INVARIANT =
  "Every Atlas remote publication operation has one stable operation ID and canonical request digest. The client records the name-resolution and endpoint-attempt boundary, sends only a complete declared request framing, and never infers remote receipt, parsing, decision, commit, or acknowledgement from a local send, connection close, timeout, or retry. The server admits a complete valid request, records one decision for the pair (operation ID, request digest) before returning a response, replays that decision for an identical duplicate, and rejects reuse of the operation ID with a different digest. Only a valid matching response or a subsequent declared status lookup can confirm the server's recorded decision; every ambiguous client outcome remains explicitly UNKNOWN until resolved.";
const STUDIO_STORAGE_KEY = "atlas-academy.module20-protocol-studio.v1";

const views: ReadonlyArray<{
  id: ProtocolView;
  number: string;
  label: string;
  question: string;
}> = [
  {
    id: "naming",
    number: "01",
    label: "Name → candidate",
    question: "What does a resolver result actually establish?",
  },
  {
    id: "framing",
    number: "02",
    label: "Stream → frame",
    question: "When may a receiver emit a request frame?",
  },
  {
    id: "evidence",
    number: "03",
    label: "Evidence ladder",
    question: "Which local facts may promote knowledge?",
  },
  {
    id: "http",
    number: "04",
    label: "HTTP + Atlas",
    question: "Which policy must the application still own?",
  },
  {
    id: "retry",
    number: "05",
    label: "Unknown → retry",
    question: "How can a retry preserve meaning?",
  },
  {
    id: "audit",
    number: "06",
    label: "Patch auditor",
    question: "Can you catch the first unsupported claim?",
  },
];

const frameCases: Record<
  FrameCase,
  {
    label: string;
    summary: string;
    rows: ReadonlyArray<{
      chunk: string;
      before: string;
      action: string;
      emitted: string;
      after: string;
    }>;
    conclusion: string;
  }
> = {
  split: {
    label: "Split one frame",
    summary: "One declared payload arrives in three arbitrary byte chunks.",
    rows: [
      {
        chunk: "00 00",
        before: "∅ · need header",
        action: "retain partial header",
        emitted: "—",
        after: "00 00 · need header",
      },
      {
        chunk: "00 05 61 74",
        before: "00 00 · need header",
        action: "declare body length 5; retain 2 body bytes",
        emitted: "—",
        after: "61 74 · need 3 more body bytes",
      },
      {
        chunk: "6c 61 73",
        before: "61 74 · need 3 more body bytes",
        action: "complete declared body",
        emitted: "atlas",
        after: "∅ · need header",
      },
    ],
    conclusion:
      "No chunk is a request. The declared length permits one frame only after all five body bytes exist.",
  },
  coalesced: {
    label: "Coalesce two frames",
    summary: "One local receive chunk contains two complete declared payloads.",
    rows: [
      {
        chunk: "00 00 00 05 atlas 00 00 00 05 index",
        before: "∅ · need header",
        action: "decode first frame; continue over remaining bytes",
        emitted: "atlas, index",
        after: "∅ · need header",
      },
    ],
    conclusion:
      "One receive can contain more than one frame. A correct decoder continues after each emitted body.",
  },
  incomplete: {
    label: "EOF mid-frame",
    summary: "The source ends after a declared header but before its body completes.",
    rows: [
      {
        chunk: "00 00 00 05 61 74 6c 61",
        before: "∅ · need header",
        action: "retain four of five body bytes",
        emitted: "—",
        after: "61 74 6c 61 · need 1 more body byte",
      },
      {
        chunk: "EOF",
        before: "need 1 more body byte",
        action: "raise incomplete-frame terminal error",
        emitted: "—",
        after: "terminal; new source requires new decoder",
      },
    ],
    conclusion:
      "Source end is not permission to invent a last byte or validate a partial request.",
  },
  oversize: {
    label: "Declared oversize",
    summary: "The header declares a body beyond Atlas's admission bound.",
    rows: [
      {
        chunk: "00 00 10 01",
        before: "∅ · need header",
        action: "declared size exceeds max_frame_bytes; reject",
        emitted: "—",
        after: "terminal; no frame admitted",
      },
    ],
    conclusion:
      "The size limit is a parser-admission rule. It does not make a broad security or allocation claim outside this local model.",
  },
};

function emptyRecord(): StudioRecord {
  return {
    naming: { choice: null, confidence: null, revealed: false },
    framing: { choice: null, confidence: null, revealed: false },
    evidence: { choice: null, confidence: null, revealed: false },
    http: { choice: null, confidence: null, revealed: false },
    retry: { choice: null, confidence: null, revealed: false },
    audit: { choice: null, confidence: null, revealed: false },
  };
}

function tabId(view: ProtocolView) {
  return `network-protocol-tab-${view}`;
}

function panelId(view: ProtocolView) {
  return `network-protocol-panel-${view}`;
}

function isStudioRecord(value: unknown): value is StudioRecord {
  if (!value || typeof value !== "object") return false;
  return views.every((view) => {
    const candidate = (value as Record<string, unknown>)[view.id];
    if (!candidate || typeof candidate !== "object") return false;
    const entry = candidate as Record<string, unknown>;
    return (
      (entry.choice === null || typeof entry.choice === "string") &&
      (entry.confidence === null ||
        entry.confidence === 1 ||
        entry.confidence === 2 ||
        entry.confidence === 3 ||
        entry.confidence === 4) &&
      typeof entry.revealed === "boolean"
    );
  });
}

function clearStoredStudio() {
  try {
    window.localStorage.removeItem(STUDIO_STORAGE_KEY);
  } catch {
    // The observatory remains usable when browser storage is unavailable.
  }
}

type PredictionGateProps = {
  id: ProtocolView;
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
      {!record.revealed && (
        <p className={styles.evidenceLock}>
          Evidence stays covered until you have committed a choice and
          confidence. The goal is calibration, not a surprise score.
        </p>
      )}
    </section>
  );
}

function InvariantPlate() {
  return (
    <aside className={styles.invariantPlate}>
      <span>Atlas remote-publication invariant</span>
      <p>{CENTRAL_INVARIANT}</p>
      <small>
        Model boundary: server-local replay is not global delivery, peer
        identity, or distributed exactly-once processing.
      </small>
    </aside>
  );
}

function NamingLab({
  record,
  onChange,
}: {
  record: ViewRecord;
  onChange: (next: Partial<ViewRecord>) => void;
}) {
  return (
    <div className={styles.viewStack}>
      <PredictionGate
        choices={[
          { id: "candidate", label: "The local resolver API returned endpoint candidates the client may attempt." },
          { id: "reachable", label: "Atlas is reachable at a verified server." },
          { id: "identity", label: "The address and port authenticate the Atlas service." },
        ]}
        id="naming"
        onChange={onChange}
        prompt="A resolver returns two address/port candidates. What is the strongest justified conclusion?"
        record={record}
      />
      {record.revealed && (
        <section className={styles.revealCard} aria-live="polite">
          <div className={styles.revealHeader}>
            <span className={styles.scopeTag}>CLIENT OBSERVATION</span>
            <h3>Candidate is the correct boundary.</h3>
          </div>
          <p>
            A URI expresses interaction intent. A name enters resolver/cache
            machinery. An address plus port is a candidate a client may try.
            Connection, application decision, and verified identity are later
            and separate facts.
          </p>
          <div className={styles.namingRail} aria-label="Name to candidate model">
            {[
              ["URI", "intent"],
              ["name", "resolver input"],
              ["candidate", "address + port"],
              ["attempt", "client-local result"],
              ["decision", "not yet established"],
            ].map(([label, detail], index) => (
              <div key={label}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{label}</strong>
                <small>{detail}</small>
              </div>
            ))}
          </div>
          <table>
            <thead>
              <tr>
                <th>Observed</th>
                <th>May say</th>
                <th>Must not say</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>resolver candidate</td>
                <td>client may attempt it</td>
                <td>service is reachable/verified</td>
              </tr>
              <tr>
                <td>address + port</td>
                <td>transport endpoint candidate</td>
                <td>business operation exists</td>
              </tr>
              <tr>
                <td>local connect result</td>
                <td>named local API outcome</td>
                <td>request parsed or committed</td>
              </tr>
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}

function FramingLab({
  record,
  onChange,
  frameCase,
  onFrameCaseChange,
  frameStep,
  onFrameStepChange,
}: {
  record: ViewRecord;
  onChange: (next: Partial<ViewRecord>) => void;
  frameCase: FrameCase;
  onFrameCaseChange: (next: FrameCase) => void;
  frameStep: number;
  onFrameStepChange: (next: number) => void;
}) {
  const selected = frameCases[frameCase];
  const visibleRows = selected.rows.slice(0, frameStep + 1);
  return (
    <div className={styles.viewStack}>
      <PredictionGate
        choices={[
          { id: "frame", label: "Emit only after the declared header and whole bounded body are present." },
          { id: "chunk", label: "Treat each receive chunk as one request." },
          { id: "eof", label: "Use EOF as the body delimiter for any partial frame." },
        ]}
        id="framing"
        onChange={onChange}
        prompt="What rule allows an Atlas parser to emit a payload from a TCP-like byte stream?"
        record={record}
      />
      {record.revealed && (
        <section className={styles.revealCard} aria-live="polite">
          <div className={styles.labToolbar}>
            <div>
              <span className={styles.scopeTag}>PROTOCOL MODEL</span>
              <h3>Stream laboratory</h3>
            </div>
            <label>
              Fixture
              <select
                onChange={(event) => onFrameCaseChange(event.target.value as FrameCase)}
                value={frameCase}
              >
                {(Object.keys(frameCases) as FrameCase[]).map((key) => (
                  <option key={key} value={key}>
                    {frameCases[key].label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <p>{selected.summary}</p>
          <div className={styles.frameStage}>
            <div className={styles.frameWire} aria-label="Declared byte source">
              <span>declared wire source</span>
              <strong>{selected.rows[0]?.chunk}</strong>
            </div>
            <div className={styles.framePulse} aria-hidden="true">
              <i />
              <i />
              <i />
            </div>
            <div className={styles.frameBuffer}>
              <span>decoder state</span>
              <strong>{visibleRows[visibleRows.length - 1]?.after ?? "need header"}</strong>
            </div>
          </div>
          <div className={styles.stepControls}>
            <button
              disabled={frameStep === 0}
              onClick={() => onFrameStepChange(frameStep - 1)}
              type="button"
            >
              ← Previous byte event
            </button>
            <span>
              event {frameStep + 1} / {selected.rows.length}
            </span>
            <button
              disabled={frameStep >= selected.rows.length - 1}
              onClick={() => onFrameStepChange(frameStep + 1)}
              type="button"
            >
              Next byte event →
            </button>
          </div>
          <div className={styles.tableScroll}>
            <table>
              <thead>
                <tr>
                  <th>Chunk</th>
                  <th>Before</th>
                  <th>Decoder action</th>
                  <th>Emits</th>
                  <th>After</th>
                </tr>
              </thead>
              <tbody>
                {visibleRows.map((row, index) => (
                  <tr key={`${row.chunk}-${index}`}>
                    <td><code>{row.chunk}</code></td>
                    <td>{row.before}</td>
                    <td>{row.action}</td>
                    <td>{row.emitted}</td>
                    <td>{row.after}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className={styles.boundaryNote}>
            <strong>Conclusion:</strong> {selected.conclusion}
          </p>
        </section>
      )}
    </div>
  );
}

function EvidenceLab({
  record,
  onChange,
}: {
  record: ViewRecord;
  onChange: (next: Partial<ViewRecord>) => void;
}) {
  const rungs = [
    ["client local write", "bytes accepted by this local API", "server parsing or decision"],
    ["TCP acknowledgement", "transport receive-state progress", "business acknowledgement"],
    ["complete server frame", "framing boundary in server scope", "client saw a response"],
    ["server ledger", "one server-local decision", "client/global observation"],
    ["matching response", "client can confirm this model decision", "authenticated/global exactly-once work"],
    ["status lookup", "matching retained record under Atlas policy", "replica/security guarantee"],
  ] as const;
  return (
    <div className={styles.viewStack}>
      <PredictionGate
        choices={[
          { id: "unknown", label: "UNKNOWN: timeout without matching response leaves remote effect unresolved." },
          { id: "rollback", label: "NOT_COMMITTED: no client response proves the server did nothing." },
          { id: "published", label: "PUBLISHED: TCP reliability proves the domain decision." },
        ]}
        id="evidence"
        onChange={onChange}
        prompt="A client deadline expires after a local send, before any valid matching response. What is the strongest outcome?"
        record={record}
      />
      {record.revealed && (
        <section className={styles.revealCard} aria-live="polite">
          <div className={styles.revealHeader}>
            <span className={styles.scopeTag}>EVIDENCE LADDER</span>
            <h3>Timeout is a knowledge boundary, not a rollback signal.</h3>
          </div>
          <ol className={styles.evidenceLadder}>
            {rungs.map(([label, supports, stops], index) => (
              <li key={label}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <strong>{label}</strong>
                  <p><b>Supports:</b> {supports}</p>
                  <small><b>Stops before:</b> {stops}</small>
                </div>
              </li>
            ))}
          </ol>
          <table>
            <thead>
              <tr><th>Same client timeout</th><th>Compatible server history</th></tr>
            </thead>
            <tbody>
              <tr><td>deadline, no matching response</td><td>no complete frame</td></tr>
              <tr><td>deadline, no matching response</td><td>validation reject</td></tr>
              <tr><td>deadline, no matching response</td><td>decision recorded; response lost</td></tr>
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}

function HttpLab({
  record,
  onChange,
}: {
  record: ViewRecord;
  onChange: (next: Partial<ViewRecord>) => void;
}) {
  return (
    <div className={styles.viewStack}>
      <PredictionGate
        choices={[
          { id: "atlas", label: "Atlas must define ID scope, digest binding, replay/conflict, retention, and correlation." },
          { id: "post", label: "POST automatically makes duplicate operations safe." },
          { id: "key", label: "A header name alone makes exactly-once universal." },
        ]}
        id="http"
        onChange={onChange}
        prompt="HTTP gives method/status/representation semantics. What must Atlas still declare for a safe publication retry rule?"
        record={record}
      />
      {record.revealed && (
        <section className={styles.revealCard} aria-live="polite">
          <div className={styles.contractGrid}>
            <article>
              <span>HTTP semantic layer</span>
              <h3>Shared interaction vocabulary</h3>
              <ul>
                <li>method and target semantics</li>
                <li>status families and representation fields</li>
                <li>HTTP-version-specific framing boundary</li>
                <li>scoped idempotency/retry guidance</li>
              </ul>
            </article>
            <article>
              <span>Atlas policy layer</span>
              <h3>One declared operation</h3>
              <ul>
                <li>version, fixed method/target, request schema</li>
                <li>operation ID + canonical digest binding</li>
                <li>first / replay / conflict decision</li>
                <li>retention, status lookup, response correlation</li>
              </ul>
            </article>
          </div>
          <div className={styles.httpStrip}>
            <code>POST /v1/publications</code>
            <span>API version</span>
            <span>operation ID</span>
            <span>digest</span>
            <span>matching decision</span>
          </div>
          <p className={styles.boundaryNote}>
            <strong>Draft-status boundary:</strong> the related
            <code> Idempotency-Key </code> draft was expired at this course
            snapshot. Atlas may use a familiar header name, but the rule remains
            Atlas policy—not a universal final HTTP guarantee.
          </p>
        </section>
      )}
    </div>
  );
}

function RetryLab({
  record,
  onChange,
}: {
  record: ViewRecord;
  onChange: (next: Partial<ViewRecord>) => void;
}) {
  return (
    <div className={styles.viewStack}>
      <PredictionGate
        choices={[
          { id: "same", label: "Retry the same operation ID with the same canonical digest, or query declared status." },
          { id: "new", label: "Create a new ID because the timeout proves no first operation occurred." },
          { id: "changed", label: "Reuse the ID but change its digest so the server treats it as fresh." },
        ]}
        id="retry"
        onChange={onChange}
        prompt="Atlas timed out after an ambiguous attempt. The intended request has not changed. What action preserves the original operation?"
        record={record}
      />
      {record.revealed && (
        <section className={styles.revealCard} aria-live="polite">
          <div className={styles.retryTimeline}>
            <div>
              <span>01</span><strong>attempt</strong><small>op-0007 / digest A</small>
            </div>
            <i aria-hidden="true">→</i>
            <div className={styles.unknownNode}>
              <span>02</span><strong>UNKNOWN</strong><small>no matching response</small>
            </div>
            <i aria-hidden="true">→</i>
            <div>
              <span>03</span><strong>same-ID retry</strong><small>or declared lookup</small>
            </div>
            <i aria-hidden="true">→</i>
            <div className={styles.confirmedNode}>
              <span>04</span><strong>CONFIRMED</strong><small>matching record/response</small>
            </div>
          </div>
          <div className={styles.ledgerMatrix}>
            <div><span>ABSENT</span><strong>valid ID + digest</strong><em>record `PUBLISHED`</em></div>
            <div><span>RECORDED</span><strong>same ID + digest</strong><em>replay decision</em></div>
            <div><span>RECORDED</span><strong>same ID + different digest</strong><em>conflict</em></div>
          </div>
          <p className={styles.boundaryNote}>
            A same-ID replay gives one server-local duplicate rule. It does not
            establish delivery, replicas, secure identity, or global exactly
            once. Those missing properties retain their own module boundary.
          </p>
        </section>
      )}
    </div>
  );
}

function AuditLab({
  record,
  onChange,
}: {
  record: ViewRecord;
  onChange: (next: Partial<ViewRecord>) => void;
}) {
  return (
    <div className={styles.viewStack}>
      <PredictionGate
        choices={[
          { id: "timeout", label: "“publish never reached the server” is unsupported after timeout/non-200." },
          { id: "framework", label: "Using a client library is always an unsupported claim." },
          { id: "boolean", label: "Returning a boolean is syntactically invalid Python." },
        ]}
        id="audit"
        onChange={onChange}
        prompt="Which is the first unsupported inference in this generated patch?"
        record={record}
      />
      {record.revealed && (
        <section className={styles.revealCard} aria-live="polite">
          <div className={styles.auditSplit}>
            <pre aria-label="Generated patch to audit"><code>{`def publish(snapshot):
    response = requests.post(URL, json=snapshot, timeout=1)
    if response.status_code != 200:
        logger.error("publish never reached the server: %s", snapshot)
        return False
    return True`}</code></pre>
            <div>
              <span className={styles.scopeTag}>PATCH VERDICT</span>
              <h3>Timeout/non-200 does not prove no server effect.</h3>
              <ol>
                <li>the message is a client/library observation;</li>
                <li>it collapses many response/error states into one claim;</li>
                <li>it leaks raw snapshot data into a log;</li>
                <li>it lacks stable operation ID/digest and evidence result;</li>
                <li>the boolean erases `UNKNOWN`, conflict, and confirmation.</li>
              </ol>
            </div>
          </div>
          <div className={styles.evidenceJson}>
            <header>
              <span>scope-labelled model evidence</span>
              <small>synthetic · no external connection</small>
            </header>
            <pre><code>{`{
  "attempt": {"classification": "UNKNOWN", "evidence_scope": "CLIENT_OBSERVATION"},
  "endpoint_attempt": {"candidate": "model://atlas-primary", "evidence_scope": "PROTOCOL_MODEL"},
  "server_local": {"decision": "PUBLISHED", "evidence_scope": "SERVER_DECISION"},
  "status_lookup": {"classification": "CONFIRMED", "evidence_scope": "STATUS_LOOKUP"},
  "unknowns_after_attempt": ["remote effect was unresolved at timeout"]
}`}</code></pre>
          </div>
        </section>
      )}
    </div>
  );
}

export function NetworkProtocolStudio() {
  const [activeView, setActiveView] = useState<ProtocolView>("naming");
  const [record, setRecord] = useState<StudioRecord>(emptyRecord);
  const [frameCase, setFrameCase] = useState<FrameCase>("split");
  const [frameStep, setFrameStep] = useState(0);
  const [resetArmed, setResetArmed] = useState(false);
  const [storageReady, setStorageReady] = useState(false);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    const hydrationTimer = window.setTimeout(() => {
      try {
        const stored = window.localStorage.getItem(STUDIO_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (isStudioRecord(parsed)) {
            setRecord(parsed);
          } else {
            clearStoredStudio();
          }
        }
      } catch {
        clearStoredStudio();
      } finally {
        setStorageReady(true);
      }
    }, 0);
    return () => window.clearTimeout(hydrationTimer);
  }, []);

  useEffect(() => {
    if (!storageReady) return;
    try {
      window.localStorage.setItem(STUDIO_STORAGE_KEY, JSON.stringify(record));
    } catch {
      // Progress remains in memory when storage is unavailable or full.
    }
  }, [record, storageReady]);

  const updateRecord = (view: ProtocolView, next: Partial<ViewRecord>) => {
    setRecord((current) => ({
      ...current,
      [view]: { ...current[view], ...next },
    }));
  };

  const selectView = (view: ProtocolView, focus = false) => {
    const nextIndex = views.findIndex((candidate) => candidate.id === view);
    setActiveView(view);
    if (focus) {
      window.requestAnimationFrame(() => tabRefs.current[nextIndex]?.focus());
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
    updateRecord(activeView, { choice: null, confidence: null, revealed: false });
    if (activeView === "framing") {
      setFrameCase("split");
      setFrameStep(0);
    }
  };

  const resetStudio = () => {
    if (!resetArmed) {
      setResetArmed(true);
      return;
    }
    const fresh = emptyRecord();
    clearStoredStudio();
    setRecord(fresh);
    setFrameCase("split");
    setFrameStep(0);
    setResetArmed(false);
  };

  const completed = views.filter((view) => record[view.id].revealed).length;

  return (
    <section
      aria-labelledby="network-protocol-studio-title"
      className={styles.studio}
    >
      <header className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>Module 20 · Protocol observatory</p>
          <h2 id="network-protocol-studio-title">
            Cross the boundary.
            <em> Keep the claim honest.</em>
          </h2>
          <p>
            An interactive six-view studio for reading a networked Python
            system as contracts: intent, candidates, bytes, frames, decisions,
            evidence, retry, and uncertainty.
          </p>
          <div className={styles.heroActions}>
            <Link href="/modules/20-networks-application-protocols">
              Open the complete workbook <span aria-hidden="true">↗</span>
            </Link>
            <Link href="/downloads/module20_reference.py">
              Read the local reference
            </Link>
          </div>
        </div>
        <div className={styles.signalWeave} aria-label="Atlas protocol evidence layers">
          {[
            ["intent", "URI / name"],
            ["candidate", "address + port"],
            ["bytes", "transport"],
            ["frame", "parser rule"],
            ["decision", "server ledger"],
            ["knowledge", "response / unknown"],
          ].map(([label, detail], index) => (
            <div key={label}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{label}</strong>
              <small>{detail}</small>
            </div>
          ))}
        </div>
      </header>

      <div className={styles.studioStatus}>
        <div>
          <span id="network-protocol-coverage-label">Exploration coverage</span>
          <strong>{completed} / 6 views revealed</strong>
          <small>Coverage is not protocol correctness or mastery.</small>
        </div>
        <progress
          aria-label="Exploration coverage: revealed protocol studio views"
          max={6}
          value={completed}
        >
          {completed} of 6
        </progress>
        <div className={styles.resetActions}>
          <button onClick={resetView} type="button">Reset this view</button>
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

      <InvariantPlate />

      <div aria-label="Network protocol studio views" className={styles.tabs} role="tablist">
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
            <span>{view.number}</span>
            <strong>{view.label}</strong>
            <small>{view.question}</small>
          </button>
        ))}
      </div>

      <div
        aria-labelledby={tabId("naming")}
        className={styles.panel}
        hidden={activeView !== "naming"}
        id={panelId("naming")}
        role="tabpanel"
        tabIndex={0}
      >
        <NamingLab record={record.naming} onChange={(next) => updateRecord("naming", next)} />
      </div>
      <div
        aria-labelledby={tabId("framing")}
        className={styles.panel}
        hidden={activeView !== "framing"}
        id={panelId("framing")}
        role="tabpanel"
        tabIndex={0}
      >
        <FramingLab
          frameCase={frameCase}
          frameStep={frameStep}
          onChange={(next) => updateRecord("framing", next)}
          onFrameCaseChange={(next) => { setFrameCase(next); setFrameStep(0); }}
          onFrameStepChange={setFrameStep}
          record={record.framing}
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
        <EvidenceLab record={record.evidence} onChange={(next) => updateRecord("evidence", next)} />
      </div>
      <div
        aria-labelledby={tabId("http")}
        className={styles.panel}
        hidden={activeView !== "http"}
        id={panelId("http")}
        role="tabpanel"
        tabIndex={0}
      >
        <HttpLab record={record.http} onChange={(next) => updateRecord("http", next)} />
      </div>
      <div
        aria-labelledby={tabId("retry")}
        className={styles.panel}
        hidden={activeView !== "retry"}
        id={panelId("retry")}
        role="tabpanel"
        tabIndex={0}
      >
        <RetryLab record={record.retry} onChange={(next) => updateRecord("retry", next)} />
      </div>
      <div
        aria-labelledby={tabId("audit")}
        className={styles.panel}
        hidden={activeView !== "audit"}
        id={panelId("audit")}
        role="tabpanel"
        tabIndex={0}
      >
        <AuditLab record={record.audit} onChange={(next) => updateRecord("audit", next)} />
      </div>

      <footer className={styles.footer}>
        <p>
          Continue in the workbook for six teaching sessions, an eight-level
          problem ladder, confidence-aware checks, TA studios, and the Atlas
          remote-publication protocol dossier.
        </p>
        <Link href="/modules/20-networks-application-protocols">
          Enter Module 20 <span aria-hidden="true">→</span>
        </Link>
      </footer>
    </section>
  );
}
