"use client";

import Link from "next/link";
import {
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { ConcurrencyStudio } from "./ConcurrencyStudio";
import { NetworkProtocolStudio } from "./NetworkProtocolStudio";
import { OperatingSystemsStudio } from "./OperatingSystemsStudio";

type ArcFourStudioProps = {
  onOpenDurableSoftware: () => void;
};

type StudioView = "stack" | "state" | "locality" | "claims";

const arcModules = [
  {
    number: "17",
    status: "Published",
    href: "/modules/17-computer-architecture-execution-stack",
    title: "Computer architecture & execution stack",
    question: "What changes below a Python operation—and what can we observe?",
    inherits: "A transactional Atlas workload with explicit semantics.",
    handoff:
      "A cross-layer trace and a bounded performance claim, ready for the operating-system boundary.",
  },
  {
    number: "18",
    status: "Published",
    href: "/modules/18-operating-systems-resource-mediation",
    title: "Operating systems & resource mediation",
    question:
      "Who owns each resource transition—and which boundary can observe it?",
    inherits: "The architecture and I/O boundary named in Module 17.",
    handoff:
      "Explicit process, virtual-memory, open-resource, publication, and shutdown models.",
  },
  {
    number: "19",
    status: "Published",
    href: "/modules/19-concurrency-parallelism",
    title: "Concurrency & parallelism",
    question: "What becomes possible—and unsafe—when execution overlaps?",
    inherits: "OS-managed execution contexts and shared resource models.",
    handoff:
      "Interleavings, synchronization, progress, deadlock, and parallel design.",
  },
  {
    number: "20",
    status: "Published",
    href: "/modules/20-networks-application-protocols",
    title: "Networks & application protocols",
    question: "How do local bytes become bounded remote knowledge?",
    inherits: "Concurrent processes with explicit I/O and failure boundaries.",
    handoff:
      "Names, endpoint candidates, framing, server-local decisions, retries, and scope-labelled evidence.",
  },
  {
    number: "21",
    status: "Forward handoff",
    href: null,
    title: "Async & distributed systems",
    question: "How does Atlas reason when time, order, and failure are partial?",
    inherits: "Networked operations whose completion is delayed or uncertain.",
    handoff:
      "Async structure, partial failure, coordination, retries, and consistency choices.",
  },
  {
    number: "22",
    status: "Forward handoff",
    href: null,
    title: "Security & trust boundaries",
    question: "Who may cause which state transition under what evidence?",
    inherits: "A distributed Atlas with explicit components and data flows.",
    handoff:
      "Threat models, least privilege, authentication, authorization, and secure defaults.",
  },
] as const;

const studioViews: Array<{
  id: StudioView;
  number: string;
  label: string;
  shortLabel: string;
  prompt: string;
}> = [
  {
    id: "stack",
    number: "01",
    label: "Execution stack",
    shortLabel: "Trace layers",
    prompt: "Follow one operation without collapsing its abstraction layers.",
  },
  {
    id: "state",
    number: "02",
    label: "Architectural state",
    shortLabel: "Step state",
    prompt: "Advance a teaching instruction trace and inspect only declared state.",
  },
  {
    id: "locality",
    number: "03",
    label: "Locality experiment",
    shortLabel: "Compare visits",
    prompt: "Hold semantics and Θ(n) fixed while access order changes.",
  },
  {
    id: "claims",
    number: "04",
    label: "Claim boundary",
    shortLabel: "Audit evidence",
    prompt: "Match every conclusion to the layer its evidence can actually see.",
  },
];

const executionLayers = [
  {
    label: "Python operation",
    eyebrow: "Semantic layer",
    state: "The function contract, values, iteration order, and returned count.",
    observe:
      "Inputs, outputs, exceptions, tests, and a source-level trace establish what the operation means.",
    boundary:
      "A Python operator is not one bytecode instruction, one ISA instruction, or one cycle.",
    token: "count_due(codes, order, 4)",
  },
  {
    label: "CPython runtime",
    eyebrow: "Implementation layer",
    state:
      "A named Python implementation advances its interpreter-level instruction state while preserving Python semantics.",
    observe:
      "A version-scoped dis inventory and the pinned interpreter overview provide a deliberately thin execution bridge.",
    boundary:
      "Bytecode is interpreter input—not native assembly. Object layout, allocation, garbage collection, and profiling belong to Module 24.",
    token: "LOAD_FAST · BINARY_SUBSCR · COMPARE_OP",
  },
  {
    label: "Instruction set",
    eyebrow: "Architectural layer",
    state:
      "A declared machine model exposes registers, a program counter, addressed memory, and instruction transitions.",
    observe:
      "A teaching trace can show which architectural locations a load, add, branch, or store is defined to change.",
    boundary:
      "The ISA defines visible behavior; it does not require one pipeline, cache, or cycle count.",
    token: "LOAD → ADD → STORE",
  },
  {
    label: "Processor",
    eyebrow: "Microarchitecture layer",
    state:
      "Fetch, decode, execute, memory, and write-back resources realize architectural transitions.",
    observe:
      "Hardware counters, controlled experiments, and vendor documentation may expose selected implementation events.",
    boundary:
      "A pipeline is not a thread, and an instruction need not complete in exactly one cycle.",
    token: "fetch · decode · execute · memory · write-back",
  },
  {
    label: "Memory hierarchy",
    eyebrow: "Data-movement layer",
    state:
      "Data moves through a hierarchy in blocks under policies that vary by machine and workload.",
    observe:
      "Address order, representation, toy models, counters, and timings offer distinct—not interchangeable—evidence.",
    boundary:
      "Contiguous storage can support locality; it does not prove residency or a measured cache-hit rate.",
    token: "register ↔ cache ↔ memory ↔ storage",
  },
  {
    label: "I/O boundary",
    eyebrow: "System handoff",
    state:
      "A runtime request crosses buffering and OS-mediated interfaces before any device-level work is inferred.",
    observe:
      "API return values, syscall traces, runtime traces, and device telemetry answer progressively different questions.",
    boundary:
      "A call such as read(1) requests one byte at an API boundary; it does not prove one physical transfer.",
    token: "Python API → runtime → OS boundary → device path",
  },
] as const;

const stateTrace = [
  {
    label: "Initial state",
    instruction: "—",
    pc: "0x0000",
    x5: "0",
    x10: "0x1000",
    memory: "3",
    changed: "Nothing yet. The initial architectural state is declared.",
    explanation:
      "x10 names the address of one memory word. x5 is scratch state. Memory at 0x1000 contains 3.",
  },
  {
    label: "Load",
    instruction: "LOAD x5, 0(x10)",
    pc: "0x0004",
    x5: "3",
    x10: "0x1000",
    memory: "3",
    changed: "x5 receives the addressed value; the program counter advances.",
    explanation:
      "The load reads memory. It does not modify the memory word or the base-address register.",
  },
  {
    label: "Add",
    instruction: "ADDI x5, x5, 1",
    pc: "0x0008",
    x5: "4",
    x10: "0x1000",
    memory: "3",
    changed: "x5 changes from 3 to 4; memory is still unchanged.",
    explanation:
      "Register arithmetic changes its declared destination. A later store is still required to update memory.",
  },
  {
    label: "Store",
    instruction: "STORE x5, 0(x10)",
    pc: "0x000c",
    x5: "4",
    x10: "0x1000",
    memory: "4",
    changed: "Memory at 0x1000 receives 4; the source registers remain.",
    explanation:
      "The visible result is now committed to this teaching machine’s addressed memory.",
  },
] as const;

const values = [1, 7, 3, 9, 2, 8, 4, 6, 5, 0, 9, 1, 7, 3, 8, 2];

const localityPatterns = {
  sequential: {
    label: "Sequential visits",
    order: Array.from({ length: 16 }, (_, index) => index),
    lineSwitches: 3,
    description:
      "Visit all four values in one toy line before advancing to the next.",
  },
  permuted: {
    label: "Deterministic permutation",
    order: [0, 4, 8, 12, 1, 5, 9, 13, 2, 6, 10, 14, 3, 7, 11, 15],
    lineSwitches: 15,
    description:
      "Visit the same values once each while alternating among toy lines.",
  },
} as const;

type LocalityPattern = keyof typeof localityPatterns;

const claimCases = [
  {
    claim: "The toy model proves the permuted scan will run slower here.",
    verdict: "Model-to-machine leap",
    summary:
      "The declared model counts toy-line transitions. It illustrates one locality mechanism but does not measure this processor or predict a timing multiplier.",
    evidence: [
      {
        label: "Semantic comparison",
        state: "supports",
        text: "Confirms both scans return the same sampled result.",
      },
      {
        label: "Toy transition count",
        state: "supports",
        text: "Supports the exact result produced by the declared toy model.",
      },
      {
        label: "Machine behavior",
        state: "missing",
        text: "The model does not observe the real hierarchy or its policies.",
      },
      {
        label: "Elapsed behavior",
        state: "missing",
        text: "No bounded timing observation follows from the toy result alone.",
      },
    ],
  },
  {
    claim: "The dis output is the native instruction stream executed by the CPU.",
    verdict: "Representation layers were collapsed",
    summary:
      "The version-scoped disassembly exposes interpreter instructions for a named Python implementation. It is not an ISA trace.",
    evidence: [
      {
        label: "Python dis inventory",
        state: "supports",
        text: "Supports the reported interpreter-instruction inventory for the named runtime.",
      },
      {
        label: "Pinned interpreter overview",
        state: "supports",
        text: "Supports the thin bridge from interpreter instructions to runtime dispatch.",
      },
      {
        label: "Native instruction trace",
        state: "missing",
        text: "No processor-visible instruction stream was observed.",
      },
      {
        label: "Defensible rewrite",
        state: "suggests",
        text: "Call it version-scoped interpreter disassembly and stop at that boundary.",
      },
    ],
  },
  {
    claim: "The two kernels are semantically equivalent for every possible input.",
    verdict: "Sampled evidence is not a proof",
    summary:
      "Equal results across fixtures and randomized samples strengthen confidence over those inputs, not all possible values and failure paths.",
    evidence: [
      {
        label: "Examples",
        state: "supports",
        text: "Support equivalence for the exact fixtures exercised.",
      },
      {
        label: "Property samples",
        state: "supports",
        text: "Broaden sampled input coverage under the generator’s domain.",
      },
      {
        label: "Preconditions",
        state: "missing",
        text: "The valid input domain and exception policy must be explicit.",
      },
      {
        label: "Universal argument",
        state: "missing",
        text: "A proof or exhaustive finite-domain argument is needed for “every.”",
      },
    ],
  },
  {
    claim: "read(1) performs exactly one physical storage transfer.",
    verdict: "Abstraction layers were collapsed",
    summary:
      "The call expresses a one-byte request at one API. Runtime buffering, OS caches, filesystem behavior, and devices remain separate layers.",
    evidence: [
      {
        label: "API trace",
        state: "supports",
        text: "Supports that the program requested and received a bounded result.",
      },
      {
        label: "System-call trace",
        state: "suggests",
        text: "Can reveal OS-boundary calls, not necessarily physical device transfers.",
      },
      {
        label: "Device telemetry",
        state: "missing",
        text: "A physical-transfer claim needs evidence from the relevant device path.",
      },
      {
        label: "Defensible rewrite",
        state: "suggests",
        text: "Describe the observed API or syscall event and stop at that boundary.",
      },
    ],
  },
] as const;

function tabPanelId(view: StudioView) {
  return `arc-four-panel-${view}`;
}

function tabId(view: StudioView) {
  return `arc-four-tab-${view}`;
}

export function ArcFourStudio({
  onOpenDurableSoftware,
}: ArcFourStudioProps) {
  const [activeModule, setActiveModule] = useState(3);
  const [activeView, setActiveView] = useState<StudioView>("stack");
  const [activeLayer, setActiveLayer] = useState(0);
  const [traceStep, setTraceStep] = useState(0);
  const [localityPattern, setLocalityPattern] =
    useState<LocalityPattern>("sequential");
  const [activeClaim, setActiveClaim] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const selectedModule = arcModules[activeModule];
  const layer = executionLayers[activeLayer];
  const trace = stateTrace[traceStep];
  const pattern = localityPatterns[localityPattern];
  const claim = claimCases[activeClaim];
  const visitPositions = new Map(
    pattern.order.map((valueIndex, visitIndex) => [valueIndex, visitIndex + 1]),
  );

  const selectView = (view: StudioView, focus = false) => {
    const nextIndex = studioViews.findIndex((candidate) => candidate.id === view);
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
      nextIndex = (index + 1) % studioViews.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = (index - 1 + studioViews.length) % studioViews.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = studioViews.length - 1;
    }

    if (nextIndex !== null) {
      event.preventDefault();
      selectView(studioViews[nextIndex].id, true);
    }
  };

  return (
    <article className="arc-four">
      <header className="arc-four-hero">
        <div className="arc-four-hero-copy">
          <p className="kicker">Arc IV · Modules 17–22</p>
          <h1>
            Make the system
            <em> legible.</em>
          </h1>
          <p>
            Trace one Atlas operation from machine state into OS-mediated
            processes, memory, files, and shutdown—then say exactly where each
            observation stops.
          </p>
          <div className="arc-four-hero-actions">
            <Link
              className="primary-action arc-four-primary"
              href="/modules/20-networks-application-protocols"
            >
              Enter the protocol observatory <span aria-hidden="true">→</span>
            </Link>
            <span>Modules 17–20 are published · Modules 21–22 are forward handoffs</span>
          </div>
        </div>

        <div
          className="machine-cutaway"
          aria-label="Execution stack from Python semantics through OS-mediated I/O"
        >
          <div className="machine-signal">
            <span>operation</span>
            <i aria-hidden="true">↓</i>
          </div>
          {["Python", "runtime", "ISA", "processor", "memory", "OS / I/O"].map(
            (label, index) => (
              <div className="machine-layer" key={label}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{label}</strong>
              </div>
            ),
          )}
          <div className="machine-pulse" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        </div>
      </header>

      <section className="arc-four-thesis">
        <p className="display-quote">
          A systems explanation is credible only when it names the{" "}
          <strong>workload, state, owner, boundary, failure model, evidence,</strong>{" "}
          and uncertainty.
        </p>
        <div className="arc-four-invariant">
          <span>Cumulative invariant</span>
          <p>
            Preserve the same semantic result while every explanation keeps
            machine state, resource ownership, failure, and evidence boundaries
            distinct.
          </p>
        </div>
      </section>

      <section className="arc-four-path" aria-labelledby="arc-four-path-title">
        <div className="section-heading">
          <span className="section-number">01</span>
          <div>
            <p className="kicker">The systems handoff</p>
            <h2 id="arc-four-path-title">
              One operation. Six widening boundaries.
            </h2>
          </div>
        </div>

        <ol className="arc-four-module-rail" aria-label="Arc IV module path">
          {arcModules.map((candidate, index) => (
            <li key={candidate.number}>
              <button
                aria-pressed={activeModule === index}
                className={activeModule === index ? "selected" : undefined}
                onClick={() => setActiveModule(index)}
                type="button"
              >
                <span>{candidate.number}</span>
                <strong>{candidate.title}</strong>
                <small
                  className={
                    candidate.status === "Published"
                      ? "module-status-published"
                      : undefined
                  }
                >
                  {candidate.status}
                </small>
              </button>
            </li>
          ))}
        </ol>

        <div className="arc-four-module-inspector" aria-live="polite">
          <div className="arc-four-module-mark" aria-hidden="true">
            <span>{selectedModule.number}</span>
            <small>{selectedModule.status}</small>
          </div>
          <div>
            <p className="kicker">{selectedModule.question}</p>
            <h3>{selectedModule.title}</h3>
            <dl>
              <div>
                <dt>Inherits</dt>
                <dd>{selectedModule.inherits}</dd>
              </div>
              <div>
                <dt>Hands forward</dt>
                <dd>{selectedModule.handoff}</dd>
              </div>
            </dl>
            {selectedModule.href ? (
              <Link href={selectedModule.href}>
                Open the complete published workbook{" "}
                <span aria-hidden="true">↗</span>
              </Link>
            ) : (
              <p className="forward-note">
                This card marks a dependency boundary, not a published lesson.
                Modules 17–20 name what this later module must inherit.
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="machine-lab" aria-labelledby="machine-lab-title">
        <header className="machine-lab-heading">
          <div>
            <p className="kicker">Interactive architecture studio</p>
            <h2 id="machine-lab-title">Change the lens. Keep the claim bounded.</h2>
          </div>
          <p>
            Each view answers a different question. Moving between them is the
            skill: no single instrument sees the whole execution.
          </p>
        </header>

        <div
          aria-label="Architecture studio views"
          className="machine-lab-tabs"
          role="tablist"
        >
          {studioViews.map((view, index) => (
            <button
              aria-controls={tabPanelId(view.id)}
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
              <small>{view.prompt}</small>
            </button>
          ))}
        </div>

        <div
          aria-labelledby={tabId("stack")}
          className="machine-lab-panel execution-stack-panel"
          hidden={activeView !== "stack"}
          id={tabPanelId("stack")}
          role="tabpanel"
          tabIndex={0}
        >
          <div className="execution-stack-controls">
            <p>Choose an abstraction layer</p>
            <ol>
              {executionLayers.map((candidate, index) => (
                <li key={candidate.label}>
                  <button
                    aria-pressed={activeLayer === index}
                    className={activeLayer === index ? "selected" : undefined}
                    onClick={() => setActiveLayer(index)}
                    type="button"
                  >
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <strong>{candidate.label}</strong>
                  </button>
                </li>
              ))}
            </ol>
          </div>
          <div className="execution-layer-inspector" aria-live="polite">
            <p className="kicker">{layer.eyebrow}</p>
            <h3>{layer.label}</h3>
            <code>{layer.token}</code>
            <dl>
              <div>
                <dt>State in view</dt>
                <dd>{layer.state}</dd>
              </div>
              <div>
                <dt>Evidence available</dt>
                <dd>{layer.observe}</dd>
              </div>
              <div>
                <dt>Do not infer</dt>
                <dd>{layer.boundary}</dd>
              </div>
            </dl>
          </div>
        </div>

        <div
          aria-labelledby={tabId("state")}
          className="machine-lab-panel state-trace-panel"
          hidden={activeView !== "state"}
          id={tabPanelId("state")}
          role="tabpanel"
          tabIndex={0}
        >
          <div className="state-trace-copy">
            <p className="kicker">Teaching ISA · declared state only</p>
            <h3>{trace.label}</h3>
            <code>{trace.instruction}</code>
            <p>{trace.explanation}</p>
            <div className="trace-controls">
              <button
                disabled={traceStep === 0}
                onClick={() => setTraceStep((step) => Math.max(0, step - 1))}
                type="button"
              >
                ← Previous state
              </button>
              <span aria-live="polite">
                State {traceStep + 1} of {stateTrace.length}
              </span>
              <button
                disabled={traceStep === stateTrace.length - 1}
                onClick={() =>
                  setTraceStep((step) =>
                    Math.min(stateTrace.length - 1, step + 1),
                  )
                }
                type="button"
              >
                Apply instruction →
              </button>
            </div>
            <p className="trace-boundary">
              This is an architectural teaching trace. It is not CPython
              bytecode, emitted native code, or a cycle-accurate processor model.
            </p>
          </div>

          <div className="architectural-state" aria-live="polite">
            <div className="state-registers">
              <div>
                <span>PC</span>
                <strong>{trace.pc}</strong>
              </div>
              <div>
                <span>x5</span>
                <strong>{trace.x5}</strong>
              </div>
              <div>
                <span>x10</span>
                <strong>{trace.x10}</strong>
              </div>
            </div>
            <div className="state-bus" aria-hidden="true">
              <span />
              <i>addressed transition</i>
              <span />
            </div>
            <div className="state-memory">
              <span>memory[0x1000]</span>
              <strong>{trace.memory}</strong>
            </div>
            <p>{trace.changed}</p>
          </div>
        </div>

        <div
          aria-labelledby={tabId("locality")}
          className="machine-lab-panel locality-panel"
          hidden={activeView !== "locality"}
          id={tabPanelId("locality")}
          role="tabpanel"
          tabIndex={0}
        >
          <div className="locality-heading">
            <div>
              <p className="kicker">Same values · same result · same Θ(n)</p>
              <h3>Only the visit order changes.</h3>
              <p>{pattern.description}</p>
            </div>
            <div className="locality-switch" aria-label="Choose visit order">
              {(Object.keys(localityPatterns) as LocalityPattern[]).map((key) => (
                <button
                  aria-pressed={localityPattern === key}
                  key={key}
                  onClick={() => setLocalityPattern(key)}
                  type="button"
                >
                  {localityPatterns[key].label}
                </button>
              ))}
            </div>
          </div>

          <div
            className="toy-memory"
            aria-label={`${pattern.label}. Sixteen values grouped into four toy cache lines; each value shows its visit position.`}
          >
            {Array.from({ length: 4 }, (_, lineIndex) => (
              <div className="toy-cache-line" key={lineIndex}>
                <span>toy line {lineIndex}</span>
                <div>
                  {values
                    .slice(lineIndex * 4, lineIndex * 4 + 4)
                    .map((value, offset) => {
                      const valueIndex = lineIndex * 4 + offset;
                      return (
                        <div className="toy-memory-cell" key={valueIndex}>
                          <small>visit {visitPositions.get(valueIndex)}</small>
                          <strong>{value}</strong>
                          <span>index {valueIndex}</span>
                        </div>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>

          <dl className="locality-measures">
            <div>
              <dt>8</dt>
              <dd>values ≤ threshold 4</dd>
            </div>
            <div>
              <dt>Θ(n)</dt>
              <dd>work in both kernels</dd>
            </div>
            <div>
              <dt>{pattern.lineSwitches}</dt>
              <dd>toy line transitions</dd>
            </div>
          </dl>
          <p className="toy-model-boundary">
            <strong>Model boundary:</strong> toy line transitions illustrate
            access order. They are not measured hardware cache misses and do
            not promise a timing multiplier.
          </p>
        </div>

        <div
          aria-labelledby={tabId("claims")}
          className="machine-lab-panel claim-boundary-panel"
          hidden={activeView !== "claims"}
          id={tabPanelId("claims")}
          role="tabpanel"
          tabIndex={0}
        >
          <div className="claim-selector">
            <p>Choose a claim to audit</p>
            {claimCases.map((candidate, index) => (
              <button
                aria-pressed={activeClaim === index}
                className={activeClaim === index ? "selected" : undefined}
                key={candidate.claim}
                onClick={() => setActiveClaim(index)}
                type="button"
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                {candidate.claim}
              </button>
            ))}
          </div>
          <div className="claim-inspector" aria-live="polite">
            <span className="claim-verdict">{claim.verdict}</span>
            <h3>{claim.claim}</h3>
            <p>{claim.summary}</p>
            <ol className="evidence-ladder">
              {claim.evidence.map((item) => (
                <li className={`evidence-${item.state}`} key={item.label}>
                  <span aria-hidden="true" />
                  <div>
                    <strong>{item.label}</strong>
                    <small>{item.state}</small>
                    <p>{item.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <OperatingSystemsStudio />
      <ConcurrencyStudio />
      <NetworkProtocolStudio />

      <section className="arc-four-bridge">
        <div>
          <p className="kicker">The Arc IV discipline</p>
          <h2>Explain across layers. Conclude within evidence.</h2>
          <p>
            Module 17 supplies representation, machine, hierarchy, and
            observation vocabulary. Module 18 adds OS mediation, ownership,
            lifetime, and failure. Module 19 adds overlapping histories,
            synchronization, progress, and model choice. Module 20 carries a
            local result across names, endpoints, bytes, frames, decisions,
            retries, and explicit unknowns. Modules 21–22 widen that protocol
            boundary into distributed and adversarial conditions.
          </p>
        </div>
        <div className="arc-four-bridge-map" aria-label="Arc IV knowledge bridge">
          <span>17 · machine</span>
          <i aria-hidden="true">→</i>
          <span>18 · OS</span>
          <i aria-hidden="true">→</i>
          <span>19 · concurrency</span>
          <i aria-hidden="true">→</i>
          <span>20 · network</span>
          <i aria-hidden="true">→</i>
          <span>21 · distribution</span>
          <i aria-hidden="true">→</i>
          <span>22 · security</span>
        </div>
      </section>

      <footer className="arc-four-actions">
        <button className="text-action" onClick={onOpenDurableSoftware}>
          ← Revisit durable software
        </button>
        <div>
          <span>Latest published workbook · complete models, labs, quiz, and project</span>
          <Link
            className="primary-action arc-four-primary"
            href="/modules/20-networks-application-protocols"
          >
            Enter Module 20 <span aria-hidden="true">→</span>
          </Link>
        </div>
      </footer>
    </article>
  );
}
