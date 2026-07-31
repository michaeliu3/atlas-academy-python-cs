"use client";

import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import {
  clearModule18Progress,
  MODULE18_BOUNDARY_STEP_COUNT,
  MODULE18_PUBLICATION_PHASE_COUNT,
  parseBoundedHexadecimal,
  persistModule18Progress,
  restoreModule18Progress,
} from "@/lib/module18-progress-codec";
import { getBrowserProgressStorage } from "@/lib/browser-progress-storage";

type OsView =
  | "boundary"
  | "process"
  | "memory"
  | "files"
  | "publication"
  | "shutdown";

type MemoryAccess = "read" | "write" | "execute";
type Prediction = "old" | "new" | "either" | "unknown";
type Confidence = 1 | 2 | 3 | 4;
type PlatformProfile = "portable" | "posix" | "windows";
type BoundaryPrediction = "user" | "crossing" | "kernel";
type ClaimLabel = "contract" | "model" | "observation" | "unknown";
type ProcessPolicy = "round-robin" | "fifo" | "priority";
type VmProcess = "A" | "B";
type VmPrediction = "mapped" | "not-present" | "protection" | "invalid";
type FileProfile = "posix" | "windows";
type PublicationScenario = "normal" | "cooperative" | "abrupt";

const CENTRAL_INVARIANT =
  "Every worker-visible effect is accounted for both as a process-local operation and as an OS-mediated resource transition. After interruption, Atlas publishes only a complete validated result, or leaves an explicitly classified recoverable state; an exit code, successful API return, or timing observation never silently substitutes for that evidence.";
const CLAIM_LABELS: ReadonlyArray<ClaimLabel> = [
  "contract",
  "model",
  "observation",
  "unknown",
];

const osViews: ReadonlyArray<{
  id: OsView;
  number: string;
  label: string;
  shortLabel: string;
}> = [
  {
    id: "boundary",
    number: "01",
    label: "Boundary crossing",
    shortLabel: "Cross",
  },
  {
    id: "process",
    number: "02",
    label: "Process lifecycle",
    shortLabel: "Schedule",
  },
  {
    id: "memory",
    number: "03",
    label: "Virtual memory",
    shortLabel: "Translate",
  },
  {
    id: "files",
    number: "04",
    label: "Open resources",
    shortLabel: "Resolve",
  },
  {
    id: "publication",
    number: "05",
    label: "Publication cut",
    shortLabel: "Predict",
  },
  {
    id: "shutdown",
    number: "06",
    label: "Claim auditor",
    shortLabel: "Bound",
  },
];

const boundarySteps = [
  {
    label: "Python request",
    mode: "user mode",
    privilege: "user" as const,
    claim: "contract" as const,
    token: "os.read(fd, 4096)",
    crosses: "A Python call enters a runtime wrapper with a descriptor and size.",
    remains:
      "The source-level intention and Atlas domain meaning remain outside the kernel.",
  },
  {
    label: "Runtime preparation",
    mode: "user mode",
    privilege: "user" as const,
    claim: "model" as const,
    token: "validate · marshal · convert errors",
    crosses:
      "The runtime validates arguments and prepares an operating-system request.",
    remains:
      "Implementation details such as buffering and error conversion are runtime- and version-specific.",
  },
  {
    label: "Protected entry",
    mode: "user → kernel",
    privilege: "crossing" as const,
    claim: "model" as const,
    token: "syscall boundary",
    crosses:
      "Control crosses a protected interface; the kernel validates the process-owned handle and memory range.",
    remains:
      "A syscall trace can observe this boundary, not every internal kernel or device transition.",
  },
  {
    label: "Kernel mediation",
    mode: "kernel mode",
    privilege: "kernel" as const,
    claim: "unknown" as const,
    token: "descriptor → open resource",
    crosses:
      "The kernel resolves the descriptor, permissions, current offset, and available data.",
    remains:
      "The declared contract does not choose one filesystem, cache policy, driver path, or physical transfer.",
  },
  {
    label: "Return",
    mode: "kernel → user",
    privilege: "crossing" as const,
    claim: "observation" as const,
    token: "bytes | short read | error",
    crosses:
      "A result, partial result, end-of-stream marker, or error returns to the runtime.",
    remains:
      "Receiving 4096 bytes does not prove one disk operation—or any disk operation at all.",
  },
] as const;

const schedulerSteps = [
  {
    event: "Process capsule created",
    atlas: "CREATED",
    running: "none",
    queue: "—",
    waiting: "—",
    reason:
      "The live resource capsule exists, but Atlas has not yet entered the runnable set.",
  },
  {
    event: "Admit Atlas",
    atlas: "RUNNABLE",
    running: "none",
    queue: "Atlas",
    waiting: "—",
    reason:
      "Runnable means eligible. It does not mean Atlas is executing yet.",
  },
  {
    event: "Dispatch Atlas",
    atlas: "RUNNING",
    running: "Atlas",
    queue: "Indexer · Exporter",
    waiting: "—",
    reason:
      "The declared scheduler selects Atlas from the runnable candidates.",
  },
  {
    event: "Atlas requests input",
    atlas: "BLOCKED",
    running: "Indexer",
    queue: "Exporter",
    waiting: "Atlas · input",
    reason:
      "Atlas is waiting for an event and is not scheduler-eligible in this teaching model.",
  },
  {
    event: "Input becomes ready",
    atlas: "RUNNABLE",
    running: "Indexer",
    queue: "Exporter · Atlas",
    waiting: "—",
    reason:
      "Completion makes Atlas eligible; it does not necessarily preempt the current process.",
  },
  {
    event: "Atlas dispatched again",
    atlas: "RUNNING",
    running: "Atlas",
    queue: "Indexer · Exporter",
    waiting: "—",
    reason:
      "A scheduler policy selects one runnable candidate; program correctness cannot depend on this toy order.",
  },
  {
    event: "Atlas exits",
    atlas: "TERMINATED",
    running: "Indexer",
    queue: "—",
    waiting: "—",
    reason:
      "Atlas can no longer be scheduled. Its exit status remains until its parent observes it.",
  },
  {
    event: "Supervisor waits and collects",
    atlas: "COLLECTED",
    running: "Indexer",
    queue: "—",
    waiting: "—",
    reason:
      "The supervisor records the raw return code and releases the lifecycle relationship; artifact state is still inspected separately.",
  },
] as const;

const processStates = [
  "CREATED",
  "RUNNABLE",
  "RUNNING",
  "BLOCKED",
  "TERMINATED",
  "COLLECTED",
] as const;

const schedulingPolicies: ReadonlyArray<{
  id: ProcessPolicy;
  label: string;
  next: string;
  rationale: string;
}> = [
  {
    id: "round-robin",
    label: "Round robin",
    next: "Indexer",
    rationale: "Rotate from Atlas to the next declared queue entry.",
  },
  {
    id: "fifo",
    label: "First admitted",
    next: "Exporter",
    rationale: "Choose the candidate with the earliest declared admission record.",
  },
  {
    id: "priority",
    label: "Static priority",
    next: "Atlas",
    rationale: "Choose the candidate with the highest declared teaching priority.",
  },
];

type PageEntry = {
  valid: boolean;
  present: boolean;
  frame: number | null;
  permissions: string;
  fileBacked: boolean;
};

type Module18Progress = {
  boundary: {
    step: number;
    choice: BoundaryPrediction | null;
    confidence: Confidence | null;
    revealed: boolean;
  };
  translation: {
    process: VmProcess;
    virtualAddress: number;
    access: MemoryAccess;
    pte: PageEntry | null;
    vpn: number | null;
    offset: number | null;
    outcome: VmPrediction | null;
    physical: number | null;
    confidence: Confidence | null;
    revealed: boolean;
  };
  publication: {
    scenario: PublicationScenario;
    phase: number;
    choice: Prediction | null;
    confidence: Confidence | null;
    revealed: boolean;
  };
};

const pageTables: Readonly<Record<VmProcess, Readonly<Record<number, PageEntry>>>> = {
  A: {
    0x2a: {
      valid: true,
      present: true,
      frame: 0x91,
      permissions: "rw-",
      fileBacked: false,
    },
    0x7b: {
      valid: true,
      present: false,
      frame: null,
      permissions: "r--",
      fileBacked: true,
    },
    0x44: {
      valid: true,
      present: true,
      frame: 0x31,
      permissions: "r--",
      fileBacked: false,
    },
    0xfe: {
      valid: false,
      present: false,
      frame: null,
      permissions: "---",
      fileBacked: false,
    },
  },
  B: {
    0x2a: {
      valid: true,
      present: true,
      frame: 0x52,
      permissions: "r-x",
      fileBacked: false,
    },
    0x7b: {
      valid: true,
      present: true,
      frame: 0xc4,
      permissions: "r--",
      fileBacked: true,
    },
    0x44: {
      valid: false,
      present: false,
      frame: null,
      permissions: "---",
      fileBacked: false,
    },
    0xfe: {
      valid: false,
      present: false,
      frame: null,
      permissions: "---",
      fileBacked: false,
    },
  },
};

const addressPresets: ReadonlyArray<{
  label: string;
  address: number;
  access: MemoryAccess;
}> = [
  { label: "Mapped read", address: 0x2a3f, access: "read" },
  { label: "Not present", address: 0x7b10, access: "read" },
  { label: "Write denied", address: 0x4420, access: "write" },
  { label: "Invalid mapping", address: 0xfe01, access: "execute" },
];

const fileStages = [
  {
    action: "Initial namespace",
    pathname: "current.json → F_old",
    candidate: "—",
    open: false,
    resource: false,
    openObject: "—",
    note:
      "The stable name resolves to complete object F_old. No process-local reference has opened it.",
  },
  {
    action: "A opens current",
    pathname: "current.json → F_old",
    candidate: "—",
    open: true,
    resource: true,
    openObject: "O_old → F_old",
    note:
      "Process A receives a process-local reference to open resource O_old. The path-resolution event is over.",
  },
  {
    action: "B stages candidate",
    pathname: "current.json → F_old",
    candidate: "candidate.tmp → F_new",
    open: true,
    resource: true,
    openObject: "O_old → F_old",
    note:
      "A complete candidate exists under a temporary name; it is not yet the committed target.",
  },
  {
    action: "B renames candidate",
    pathname: "current.json → F_new",
    candidate: "candidate name removed",
    open: true,
    resource: true,
    openObject: "O_old → F_old",
    note:
      "The stable name now resolves to F_new, while A’s already-open resource still reaches F_old in the POSIX-like model.",
  },
  {
    action: "A reads old open object",
    pathname: "current.json → F_new",
    candidate: "—",
    open: true,
    resource: true,
    openObject: "O_old → F_old",
    note:
      "Name resolution and open-resource identity are separate; the existing reference retains F_old.",
  },
  {
    action: "B unlinks current",
    pathname: "name removed",
    candidate: "—",
    open: true,
    resource: true,
    openObject: "O_old → F_old",
    note:
      "Removing the stable name does not revoke A’s existing open reference.",
  },
  {
    action: "A closes reference",
    pathname: "name removed",
    candidate: "—",
    open: false,
    resource: false,
    openObject: "closed",
    note:
      "F_old may become reclaimable if no other reference or link remains. This model does not observe reclamation timing.",
  },
] as const;

const publicationPhases: ReadonlyArray<{
  label: string;
  operation: string;
  doesNotEstablish: string;
}> = [
  {
    label: "ADMITTED",
    operation: "Supervisor accepted the validated synthetic job.",
    doesNotEstablish: "A child process exists.",
  },
  {
    label: "STARTED",
    operation: "The child entry point reported start.",
    doesNotEstablish: "The scheduler currently runs it.",
  },
  {
    label: "ENCODED",
    operation: "Deterministic candidate bytes exist in worker memory.",
    doesNotEstablish: "A file exists or bytes are durable.",
  },
  {
    label: "STAGED",
    operation: "Candidate bytes were supplied to the named staging stream.",
    doesNotEstablish: "Python or OS buffers are synchronized.",
  },
  {
    label: "VALIDATED",
    operation: "Candidate bytes agree with the semantic and digest oracle.",
    doesNotEstablish: "Storage or namespace durability.",
  },
  {
    label: "PY_FLUSHED",
    operation: "Python buffering flush returned.",
    doesNotEstablish: "OS or device persistence.",
  },
  {
    label: "FILE_SYNC_RETURNED",
    operation: "The named file-synchronization request returned.",
    doesNotEstablish: "Containing-directory durability on every platform.",
  },
  {
    label: "CLOSED",
    operation: "The staging handle was closed.",
    doesNotEstablish: "The committed target name changed.",
  },
  {
    label: "REPLACED",
    operation: "os.replace(temp, target) returned.",
    doesNotEstablish:
      "Universal power-loss durability or absence of a competing writer.",
  },
  {
    label: "DIR_SYNC_RETURNED",
    operation: "An optional named platform directory-sync adapter returned.",
    doesNotEstablish: "Universal device honesty.",
  },
  {
    label: "EXITED",
    operation: "Worker termination was observed with its raw return code.",
    doesNotEstablish: "The result is committed or uncommitted.",
  },
  {
    label: "RECOVERED",
    operation: "The supervisor classified current artifacts under policy.",
    doesNotEstablish: "Every lost external effect was reconstructed.",
  },
];

if (
  boundarySteps.length !== MODULE18_BOUNDARY_STEP_COUNT ||
  publicationPhases.length !== MODULE18_PUBLICATION_PHASE_COUNT
) {
  throw new Error("Module 18 local-progress bounds no longer match its teaching model.");
}

const predictionLabels: Readonly<Record<Prediction, string>> = {
  old: "Old",
  new: "New",
  either: "Either old or new",
  unknown: "Inspect / unknown",
};

const cacheLayers = [
  {
    id: "python",
    label: "Python buffer",
    owner: "Python/runtime",
    shows: "flush() can move buffered bytes toward the raw file layer.",
    cannot: "It cannot establish OS-cache, filesystem, or device persistence.",
  },
  {
    id: "page-cache",
    label: "OS page cache",
    owner: "Operating system",
    shows: "Named platform documentation or tools may expose selected cached-file state.",
    cannot: "This studio fabricates no cache-hit or physical-transfer counter.",
  },
  {
    id: "filesystem",
    label: "Filesystem",
    owner: "Named platform/filesystem",
    shows: "Namespace replacement and synchronization have platform-scoped contracts.",
    cannot: "A successful call is not universal power-loss evidence.",
  },
  {
    id: "device",
    label: "Device path",
    owner: "Driver/controller/storage",
    shows: "Only relevant telemetry under named assumptions can support a physical claim.",
    cannot: "Python API output does not reveal device transfers or durable cells.",
  },
] as const;

const publicationScenarios: ReadonlyArray<{
  id: PublicationScenario;
  label: string;
  description: string;
}> = [
  {
    id: "normal",
    label: "Normal progress",
    description:
      "Inspect a live snapshot after each successful phase; no interruption is injected.",
  },
  {
    id: "cooperative",
    label: "Cooperative stop",
    description:
      "A lab-owned stop request is observed at a declared safe point; policy classifies or completes owned work.",
  },
  {
    id: "abrupt",
    label: "Abrupt child exit",
    description:
      "Only the disposable spawned child is stopped at the named boundary; ordinary Python cleanup is not assumed.",
  },
];

const shutdownSteps = [
  {
    label: "request",
    detail:
      "Send the application-defined cooperative stop request; notification is not cleanup.",
  },
  {
    label: "deadline",
    detail:
      "Wait to a declared deadline and observe whether the worker exits.",
  },
  {
    label: "terminate",
    detail:
      "Use the recorded terminate capability only if the child remains live.",
  },
  {
    label: "wait",
    detail:
      "Wait again and record the raw child outcome after termination.",
  },
  {
    label: "kill if distinct",
    detail:
      "Use a stronger kill capability only when the named platform exposes one distinctly.",
  },
  {
    label: "wait",
    detail:
      "Always observe/reap the child after the final escalation attempt.",
  },
  {
    label: "recovery",
    detail:
      "Classify target, owned temp, evidence, and exit independently; never infer artifact state from the exit code.",
  },
] as const;

const platformProfiles: ReadonlyArray<{
  id: PlatformProfile;
  label: string;
  summary: string;
}> = [
  {
    id: "portable",
    label: "Portable core",
    summary:
      "Claims supported by documented Python behavior without assuming one operating-system family.",
  },
  {
    id: "posix",
    label: "POSIX profile",
    summary:
      "A teaching profile with POSIX process, descriptor, signal, rename, and synchronization semantics.",
  },
  {
    id: "windows",
    label: "Windows profile",
    summary:
      "A teaching profile with Windows handles, process control, sharing rules, and platform-specific durability APIs.",
  },
];

type ClaimAudit = {
  verdict: string;
  explanation: string;
  shows: string;
  cannot: string;
};

const shutdownClaims: ReadonlyArray<{
  id: string;
  claim: string;
  audits: Readonly<Record<PlatformProfile, ClaimAudit>>;
}> = [
  {
    id: "finally",
    claim: "“A finally block always runs when the process stops.”",
    audits: {
      portable: {
        verdict: "Reject the universal",
        explanation:
          "A cooperative exception or normal return may execute finally. Abrupt interpreter or machine termination may not.",
        shows:
          "Tests can establish cleanup behavior for the graceful paths they exercise.",
        cannot:
          "They cannot establish cleanup after power loss, runtime failure, or forced termination.",
      },
      posix: {
        verdict: "Reject the universal",
        explanation:
          "Normal exit and catchable-signal paths can cooperate. SIGKILL and power loss provide no Python cleanup opportunity.",
        shows:
          "A controlled SIGTERM experiment can show one handler and shutdown path.",
        cannot:
          "It says nothing about SIGKILL, kernel failure, or whether every handler completes.",
      },
      windows: {
        verdict: "Reject the universal",
        explanation:
          "A cooperative application exit can clean up. Forced process termination and system failure need not run Python cleanup.",
        shows:
          "A controlled graceful-close path can show owned handles being released by application logic.",
        cannot:
          "It cannot generalize to TerminateProcess, host failure, or sudden power loss.",
      },
    },
  },
  {
    id: "replace",
    claim: "“os.replace() alone makes the new file crash-durable.”",
    audits: {
      portable: {
        verdict: "Evidence missing",
        explanation:
          "Python exposes replacement behavior, but no single portable call sequence proves persistence across all systems.",
        shows:
          "A successful return supports the live namespace result documented for that platform.",
        cannot:
          "It does not prove file data and directory metadata survive a crash.",
      },
      posix: {
        verdict: "Conditional protocol",
        explanation:
          "Atomic replacement can separate readers from partial publication. Crash durability remains UNKNOWN until the exact POSIX contract, filesystem, synchronization results, device-honesty assumption, and failure model are named.",
        shows:
          "Fault injection can support outcomes for one mounted filesystem, operation order, and failure model.",
        cannot:
          "It cannot establish a universal rule for every filesystem, controller, or failure mode.",
      },
      windows: {
        verdict: "Platform-specific protocol",
        explanation:
          "Replacement, sharing, write-through, and volume behavior require Windows-specific APIs and assumptions; crash durability is UNKNOWN until the exact volume, synchronization, device, and failure model are named.",
        shows:
          "A documented Windows protocol plus fault tests can support that exact environment.",
        cannot:
          "A POSIX directory-fsync recipe cannot be imported as a Windows guarantee.",
      },
    },
  },
  {
    id: "close",
    claim: "“Closing a Python file means its bytes reached durable media.”",
    audits: {
      portable: {
        verdict: "Too strong",
        explanation:
          "Close releases the language-level resource and flushes relevant Python buffers; storage durability is a different claim.",
        shows:
          "Subsequent reads in the running environment may observe the written bytes.",
        cannot:
          "That observation cannot prove survival after power loss.",
      },
      posix: {
        verdict: "Too strong",
        explanation:
          "close() and fsync()-style synchronization have different contracts; metadata may require separate treatment.",
        shows:
          "System-call traces can show which synchronization requests were issued and returned.",
        cannot:
          "A trace alone cannot prove the storage stack honored every request through a physical failure.",
      },
      windows: {
        verdict: "Too strong",
        explanation:
          "Closing a handle and requesting buffers be flushed are distinct operations with device and filesystem conditions.",
        shows:
          "API traces can show successful close and platform-specific flush requests.",
        cannot:
          "They do not automatically prove persistence through every hardware failure.",
      },
    },
  },
  {
    id: "signal",
    claim: "“The same SIGTERM shutdown design works everywhere.”",
    audits: {
      portable: {
        verdict: "Not portable",
        explanation:
          "Python exposes a platform-dependent signal set and delivery model. Portable application shutdown needs an explicit cooperative control path.",
        shows:
          "Feature checks and tests can establish behavior on named Python and OS versions.",
        cannot:
          "They cannot turn platform-dependent signals into a cross-platform contract.",
      },
      posix: {
        verdict: "Bounded support",
        explanation:
          "SIGTERM is normally catchable, but delivery, interruption, masking, and handler completion still require a declared model.",
        shows:
          "A trace can show SIGTERM delivery and an orderly transition for one process.",
        cannot:
          "It does not cover SIGKILL, deadlocked cleanup, or power loss.",
      },
      windows: {
        verdict: "Different control model",
        explanation:
          "Console control events, services, window messages, and forced termination are not one-for-one POSIX signal equivalents.",
        shows:
          "A Windows-specific harness can establish the behavior of the chosen control mechanism.",
        cannot:
          "Calling every mechanism “SIGTERM” hides materially different contracts.",
      },
    },
  },
  {
    id: "graceful",
    claim: "“A graceful shutdown can preserve explicit ownership invariants.”",
    audits: {
      portable: {
        verdict: "Defensible when bounded",
        explanation:
          "If the application owns the control path, stops accepting work, drains or cancels it, publishes under explicitly named persistence assumptions, and observes cleanup results, the claim can cover that graceful protocol.",
        shows:
          "State-machine tests can establish order and outcomes for controlled shutdown paths.",
        cannot:
          "Graceful evidence does not extend to abrupt termination.",
      },
      posix: {
        verdict: "Defensible when bounded",
        explanation:
          "A catchable notification can initiate the protocol, while process, descriptor, child, and durability obligations remain explicit.",
        shows:
          "Integration and fault tests can support the named notification and drain sequence.",
        cannot:
          "They cannot promise progress if cleanup blocks forever or the process receives SIGKILL.",
      },
      windows: {
        verdict: "Defensible when bounded",
        explanation:
          "A selected service, console, or application control path can initiate the same ownership protocol with Windows-specific mechanisms.",
        shows:
          "Tests can support the chosen control path, deadlines, child handling, and handle release.",
        cannot:
          "They cannot cover forced termination or claim POSIX signal semantics.",
      },
    },
  },
];

function osTabId(view: OsView) {
  return `os-studio-tab-${view}`;
}

function osPanelId(view: OsView) {
  return `os-studio-panel-${view}`;
}

function hexadecimal(value: number, width = 4) {
  return `0x${value.toString(16).padStart(width, "0").toUpperCase()}`;
}

function hexadecimalInput(value: number | null, width: number) {
  return value === null ? "" : value.toString(16).padStart(width, "0").toUpperCase();
}

function pageEntriesMatch(
  left: PageEntry | null | undefined,
  right: PageEntry | null | undefined,
) {
  if (left === null || left === undefined || right === null || right === undefined) {
    return left === right;
  }
  return (
    left.valid === right.valid &&
    left.present === right.present &&
    left.frame === right.frame &&
    left.permissions === right.permissions &&
    left.fileBacked === right.fileBacked
  );
}

function classifyTranslation(
  address: number,
  access: MemoryAccess,
  entry: PageEntry | undefined,
) {
  const vpn = address >>> 8;
  const offset = address & 0xff;

  if (!entry || !entry.valid) {
    return {
      status: "invalid" as const,
      label: "Invalid mapping fault",
      detail: `VPN ${hexadecimal(vpn, 2)} has no valid mapping in this teaching page table.`,
      physical: null,
      vpn,
      offset,
    };
  }

  if (!entry.present || entry.frame === null) {
    return {
      status: "not-present" as const,
      label: "Not-present fault",
      detail:
        "The mapping is valid but not present. The model does not decide whether the OS resolves the fault or rejects the access.",
      physical: null,
      vpn,
      offset,
    };
  }

  const permissionToken =
    access === "read" ? "r" : access === "write" ? "w" : "x";
  if (!entry.permissions.includes(permissionToken)) {
    return {
      status: "protection" as const,
      label: "Protection fault",
      detail: `VPN ${hexadecimal(vpn, 2)} is mapped ${entry.permissions}, which does not permit ${access}.`,
      physical: null,
      vpn,
      offset,
    };
  }

  return {
    status: "mapped" as const,
    label: "Translation succeeds",
    detail: `VPN ${hexadecimal(vpn, 2)} selects frame ${hexadecimal(entry.frame, 2)}; the ${hexadecimal(offset, 2)} offset is preserved.`,
    physical: (entry.frame << 8) | offset,
    vpn,
    offset,
  };
}

export function OperatingSystemsStudio() {
  const [activeView, setActiveView] = useState<OsView>("boundary");
  const [boundaryStep, setBoundaryStep] = useState(0);
  const [boundaryPrediction, setBoundaryPrediction] =
    useState<BoundaryPrediction | null>(null);
  const [boundaryConfidence, setBoundaryConfidence] =
    useState<Confidence | null>(null);
  const [boundaryRevealed, setBoundaryRevealed] = useState(false);
  const [showClaimLabels, setShowClaimLabels] = useState(true);
  const [schedulerStep, setSchedulerStep] = useState(0);
  const [processPolicy, setProcessPolicy] =
    useState<ProcessPolicy>("round-robin");
  const [virtualAddress, setVirtualAddress] = useState(0x2a3f);
  const [memoryAccess, setMemoryAccess] = useState<MemoryAccess>("read");
  const [vmProcess, setVmProcess] = useState<VmProcess>("A");
  const [vmEntryOverride, setVmEntryOverride] = useState<PageEntry | null>(null);
  const [vmPredictedVpn, setVmPredictedVpn] = useState("");
  const [vmPredictedOffset, setVmPredictedOffset] = useState("");
  const [vmPredictedOutcome, setVmPredictedOutcome] =
    useState<VmPrediction | null>(null);
  const [vmPredictedPhysical, setVmPredictedPhysical] = useState("");
  const [vmConfidence, setVmConfidence] = useState<Confidence | null>(null);
  const [vmRevealed, setVmRevealed] = useState(false);
  const [fileStep, setFileStep] = useState(0);
  const [fileProfile, setFileProfile] = useState<FileProfile>("posix");
  const [activeCacheLayer, setActiveCacheLayer] = useState(0);
  const [publicationPhase, setPublicationPhase] = useState(0);
  const [publicationScenario, setPublicationScenario] =
    useState<PublicationScenario>("normal");
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [confidence, setConfidence] = useState<Confidence | null>(null);
  const [showPublicationAnswer, setShowPublicationAnswer] = useState(false);
  const [profile, setProfile] = useState<PlatformProfile>("portable");
  const [shutdownStep, setShutdownStep] = useState(0);
  const [activeClaim, setActiveClaim] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const boundary = boundarySteps[boundaryStep];
  const scheduler = schedulerSteps[schedulerStep];
  const selectedPolicy =
    schedulingPolicies.find((candidate) => candidate.id === processPolicy) ??
    schedulingPolicies[0];
  const virtualPage = virtualAddress >>> 8;
  const baseVmEntry = pageTables[vmProcess][virtualPage];
  const effectiveVmEntry = vmEntryOverride ?? baseVmEntry;
  const translation = classifyTranslation(
    virtualAddress,
    memoryAccess,
    effectiveVmEntry,
  );
  const editableVmEntry: PageEntry = effectiveVmEntry ?? {
    valid: false,
    present: false,
    frame: 0x20,
    permissions: "r--",
    fileBacked: false,
  };
  const binaryAddress = virtualAddress.toString(2).padStart(16, "0");
  const predictedVpnValue = parseBoundedHexadecimal(vmPredictedVpn, 0xff);
  const predictedOffsetValue = parseBoundedHexadecimal(
    vmPredictedOffset,
    0xff,
  );
  const predictedPhysicalValue = parseBoundedHexadecimal(
    vmPredictedPhysical,
    0xffff,
  );
  const vmCanReveal =
    predictedVpnValue !== null &&
    predictedOffsetValue !== null &&
    vmPredictedOutcome !== null &&
    vmConfidence !== null &&
    (vmPredictedOutcome !== "mapped" ||
      predictedPhysicalValue !== null);
  const vmArithmeticAligned =
    predictedVpnValue === translation.vpn &&
    predictedOffsetValue === translation.offset &&
    (translation.physical === null ||
      predictedPhysicalValue === translation.physical);
  const fileStage = fileStages[fileStep];
  const fileVocabulary =
    fileProfile === "posix"
      ? {
          reference: "fd 7",
          table: "descriptor table",
          openResource: "open file description",
          object: "filesystem object",
          replacement:
            "Declared POSIX-like result: successful same-filesystem rename changes the name while an existing open reference retains F_old.",
        }
      : {
          reference: "HANDLE H7",
          table: "process handle table",
          openResource: "open file object",
          object: "volume file record",
          replacement:
            "Windows profile: replacement may be rejected by sharing, access, or volume conditions; do not import the POSIX outcome as a guarantee.",
        };
  const cacheLayer = cacheLayers[activeCacheLayer];
  const publication = publicationPhases[publicationPhase];
  const replacedPhase = publicationPhases.findIndex(
    (candidate) => candidate.label === "REPLACED",
  );
  const publicationNeedsInspection =
    publication.label === "EXITED" || publication.label === "RECOVERED";
  const publicationExpected: Prediction =
    publicationNeedsInspection
      ? "unknown"
      : publicationPhase >= replacedPhase
        ? "new"
        : "old";
  const tempState =
    publicationNeedsInspection
      ? "inspect the exact run-owned temporary name; terminal phase evidence does not decide its existence"
      : publicationPhase < 3
      ? "none observed"
      : publicationPhase < replacedPhase
        ? "owned candidate may exist; inspect bytes and digest"
        : "temporary name normally absent after successful replacement";
  const processScenarioSummary =
    publicationScenario === "normal"
      ? "Live snapshot after successful progress; no interruption injected."
      : publicationScenario === "cooperative"
        ? "A cooperative request is observed at a declared safe point; the application policy must complete or classify owned work."
        : "The disposable child alone exits abruptly at this named boundary; finally, handlers, and buffer flush are not assumed.";
  const claim = shutdownClaims[activeClaim];
  const audit = claim.audits[profile];
  const shutdown = shutdownSteps[shutdownStep];
  const shutdownCapabilityNote =
    shutdown.label === "kill if distinct"
      ? profile === "windows"
        ? "Windows profile: Python kill() is not a stronger distinct rung than terminate(); skip this capability and wait."
        : profile === "posix"
          ? "POSIX profile: the named kill capability may use SIGKILL after the second deadline; cleanup is not assumed."
          : "Portable core: use only a capability explicitly reported by the platform adapter; otherwise mark unavailable."
      : shutdown.detail;

  useEffect(() => {
    const hydrationTimer = window.setTimeout(() => {
      try {
        const storage = getBrowserProgressStorage();
        const saved = storage
          ? (restoreModule18Progress(storage) as Module18Progress | null)
          : null;
        if (saved) {
          setBoundaryStep(saved.boundary.step);
          setBoundaryPrediction(saved.boundary.choice);
          setBoundaryConfidence(saved.boundary.confidence);
          setBoundaryRevealed(saved.boundary.revealed);

          const savedTranslation = saved.translation;
          const baseEntry =
            pageTables[savedTranslation.process][
              savedTranslation.virtualAddress >>> 8
            ];
          const canRestoreTranslation =
            savedTranslation.pte !== null || baseEntry === undefined;
          if (canRestoreTranslation) {
            setVmProcess(savedTranslation.process);
            setVirtualAddress(savedTranslation.virtualAddress);
            setMemoryAccess(savedTranslation.access);
            setVmEntryOverride(
              savedTranslation.pte === null ||
                pageEntriesMatch(savedTranslation.pte, baseEntry)
                ? null
                : savedTranslation.pte,
            );
            setVmPredictedVpn(hexadecimalInput(savedTranslation.vpn, 2));
            setVmPredictedOffset(hexadecimalInput(savedTranslation.offset, 2));
            setVmPredictedOutcome(savedTranslation.outcome);
            setVmPredictedPhysical(
              hexadecimalInput(savedTranslation.physical, 4),
            );
            setVmConfidence(savedTranslation.confidence);
            setVmRevealed(savedTranslation.revealed);
          }

          setPublicationScenario(saved.publication.scenario);
          setPublicationPhase(saved.publication.phase);
          setPrediction(saved.publication.choice);
          setConfidence(saved.publication.confidence);
          setShowPublicationAnswer(saved.publication.revealed);
        }
      } catch {
        // Browser storage is optional; the full studio remains usable in memory.
      } finally {
        setHydrated(true);
      }
    }, 0);

    return () => window.clearTimeout(hydrationTimer);
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }
    try {
      const progress: Module18Progress = {
        boundary: {
          step: boundaryStep,
          choice: boundaryPrediction,
          confidence: boundaryConfidence,
          revealed: boundaryRevealed,
        },
        translation: {
          process: vmProcess,
          virtualAddress,
          access: memoryAccess,
          pte: effectiveVmEntry ? { ...effectiveVmEntry } : null,
          vpn: parseBoundedHexadecimal(vmPredictedVpn, 0xff),
          offset: parseBoundedHexadecimal(vmPredictedOffset, 0xff),
          outcome: vmPredictedOutcome,
          physical:
            vmPredictedOutcome === "mapped"
              ? parseBoundedHexadecimal(vmPredictedPhysical, 0xffff)
              : null,
          confidence: vmConfidence,
          revealed: vmRevealed,
        },
        publication: {
          scenario: publicationScenario,
          phase: publicationPhase,
          choice: prediction,
          confidence,
          revealed: showPublicationAnswer,
        },
      };
      const storage = getBrowserProgressStorage();
      if (storage) {
        persistModule18Progress(storage, progress);
      }
    } catch {
      // Persistence is an enhancement; interactions continue in memory.
    }
  }, [
    boundaryConfidence,
    boundaryPrediction,
    boundaryRevealed,
    boundaryStep,
    confidence,
    effectiveVmEntry,
    hydrated,
    memoryAccess,
    prediction,
    publicationPhase,
    publicationScenario,
    showPublicationAnswer,
    virtualAddress,
    vmConfidence,
    vmPredictedOffset,
    vmPredictedOutcome,
    vmPredictedPhysical,
    vmPredictedVpn,
    vmProcess,
    vmRevealed,
  ]);

  const selectView = (view: OsView, focus = false) => {
    const index = osViews.findIndex((candidate) => candidate.id === view);
    setActiveView(view);
    if (focus) {
      window.requestAnimationFrame(() => tabRefs.current[index]?.focus());
    }
  };

  const handleTabKeyDown = (
    event: ReactKeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    let nextIndex: number | null = null;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = (index + 1) % osViews.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = (index - 1 + osViews.length) % osViews.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = osViews.length - 1;
    }
    if (nextIndex !== null) {
      event.preventDefault();
      selectView(osViews[nextIndex].id, true);
    }
  };

  const resetBoundaryPrediction = () => {
    setBoundaryPrediction(null);
    setBoundaryConfidence(null);
    setBoundaryRevealed(false);
  };

  const resetVmPrediction = () => {
    setVmPredictedVpn("");
    setVmPredictedOffset("");
    setVmPredictedOutcome(null);
    setVmPredictedPhysical("");
    setVmConfidence(null);
    setVmRevealed(false);
  };

  const choosePublicationPhase = (nextPhase: number) => {
    setPublicationPhase(nextPhase);
    setPrediction(null);
    setConfidence(null);
    setShowPublicationAnswer(false);
  };

  const resetStudio = () => {
    try {
      const storage = getBrowserProgressStorage();
      if (storage) {
        clearModule18Progress(storage);
      }
    } catch {
      // Browser storage is optional; reset the in-memory studio regardless.
    }
    setActiveView("boundary");
    setBoundaryStep(0);
    resetBoundaryPrediction();
    setShowClaimLabels(true);
    setSchedulerStep(0);
    setProcessPolicy("round-robin");
    setVirtualAddress(0x2a3f);
    setMemoryAccess("read");
    setVmProcess("A");
    setVmEntryOverride(null);
    resetVmPrediction();
    setFileStep(0);
    setFileProfile("posix");
    setActiveCacheLayer(0);
    setPublicationPhase(0);
    setPublicationScenario("normal");
    setPrediction(null);
    setConfidence(null);
    setShowPublicationAnswer(false);
    setProfile("portable");
    setShutdownStep(0);
    setActiveClaim(0);
  };

  return (
    <section className="os-studio" aria-labelledby="os-studio-title">
      <header className="os-studio-heading">
        <div>
          <p className="kicker">Interactive operating-systems studio</p>
          <h2 id="os-studio-title">
            Resources are mediated.
            <em> Evidence has jurisdiction.</em>
          </h2>
        </div>
        <div className="os-studio-contract">
          <span>Exact central invariant</span>
          <blockquote>{CENTRAL_INVARIANT}</blockquote>
          <div className="os-studio-header-actions">
            <Link href="/modules/18-operating-systems-resource-mediation">
              Read Module 18 <span aria-hidden="true">↗</span>
            </Link>
            <button onClick={resetStudio} type="button">
              Reset saved studio
            </button>
          </div>
        </div>
      </header>

      <div
        aria-label="Operating-systems learning views"
        className="os-studio-tabs"
        role="tablist"
      >
        {osViews.map((view, index) => (
          <button
            aria-controls={osPanelId(view.id)}
            aria-selected={activeView === view.id}
            id={osTabId(view.id)}
            key={view.id}
            onClick={() => selectView(view.id)}
            onKeyDown={(event) => handleTabKeyDown(event, index)}
            ref={(node) => {
              tabRefs.current[index] = node;
            }}
            role="tab"
            tabIndex={activeView === view.id ? 0 : -1}
            type="button"
          >
            <span>{view.number}</span>
            <strong>{view.shortLabel}</strong>
            <small>{view.label}</small>
          </button>
        ))}
      </div>

      <div
        aria-labelledby={osTabId("boundary")}
        className="os-studio-panel boundary-crossing-panel"
        hidden={activeView !== "boundary"}
        id={osPanelId("boundary")}
        role="tabpanel"
        tabIndex={0}
      >
        <div className="os-panel-intro">
          <div>
            <p className="kicker">Boundary crossing</p>
            <h3>One read request, five contracts.</h3>
          </div>
          <p>
            Step through an API request. The boundary moves control and bounded
            data—not the meaning of the whole application.
          </p>
        </div>

        <ol className="boundary-track" aria-label="Read-request boundary steps">
          {boundarySteps.map((step, index) => (
            <li key={step.label}>
              <button
                aria-current={boundaryStep === index ? "step" : undefined}
                className={boundaryStep === index ? "selected" : undefined}
                onClick={() => {
                  setBoundaryStep(index);
                  resetBoundaryPrediction();
                }}
                type="button"
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{step.label}</strong>
                <small>
                  {showClaimLabels ? `[${step.claim.toUpperCase()}]` : "claim label hidden"}
                </small>
              </button>
            </li>
          ))}
        </ol>

        <button
          aria-pressed={showClaimLabels}
          className="claim-label-toggle"
          onClick={() => setShowClaimLabels((visible) => !visible)}
          type="button"
        >
          Claim labels {showClaimLabels ? "shown" : "hidden"} ·{" "}
          {CLAIM_LABELS.join(" / ")}
        </button>

        <div className="boundary-prediction-grid">
          <fieldset className="prediction-fieldset">
            <legend>Predict the privilege context before reveal</legend>
            <div>
              {([
                ["user", "User mode"],
                ["crossing", "Boundary crossing"],
                ["kernel", "Kernel mode"],
              ] as const).map(([value, label]) => (
                <button
                  aria-pressed={boundaryPrediction === value}
                  key={value}
                  onClick={() => {
                    setBoundaryPrediction(value);
                    setBoundaryRevealed(false);
                  }}
                  type="button"
                >
                  {label}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset className="confidence-fieldset">
            <legend>Confidence 1–4</legend>
            <div>
              {([1, 2, 3, 4] as const).map((level) => (
                <button
                  aria-pressed={boundaryConfidence === level}
                  key={level}
                  onClick={() => {
                    setBoundaryConfidence(level);
                    setBoundaryRevealed(false);
                  }}
                  type="button"
                >
                  <span>{level}</span>
                  {level === 1 ? "Unsure" : level === 4 ? "Can defend" : "Developing"}
                </button>
              ))}
            </div>
          </fieldset>
        </div>

        <button
          className="reveal-model-answer"
          disabled={boundaryPrediction === null || boundaryConfidence === null}
          onClick={() => setBoundaryRevealed(true)}
          type="button"
        >
          Reveal boundary evidence
        </button>

        <div className="boundary-inspector" aria-live="polite">
          <div className="boundary-token">
            <small>Current contract</small>
            <code>{boundary.token}</code>
            <span>
              {boundaryRevealed
                ? boundary.mode
                : "Privilege hidden until prediction + confidence"}
            </span>
          </div>
          {boundaryRevealed && boundaryPrediction && boundaryConfidence ? (
            <dl>
              <div>
                <dt>
                  {boundaryPrediction === boundary.privilege
                    ? "Prediction aligned"
                    : "Revise the privilege model"}{" "}
                  · confidence {boundaryConfidence}/4
                </dt>
                <dd>{boundary.crosses}</dd>
              </div>
              <div>
                <dt>
                  {showClaimLabels
                    ? `[${boundary.claim.toUpperCase()}] Evidence boundary`
                    : "Evidence boundary"}
                </dt>
                <dd>{boundary.remains}</dd>
              </div>
            </dl>
          ) : (
            <p className="prediction-placeholder">
              Commit a privilege prediction and confidence 1–4 before the
              explanation appears.
            </p>
          )}
        </div>

        <div className="scope-boundary">
          <p>
            <strong>Shows</strong>
            Which contract is active and which result may return at this
            declared boundary.
          </p>
          <p>
            <strong>Cannot show</strong>
            One syscall does not reveal every kernel transition, filesystem
            cache event, driver action, or device transfer.
          </p>
        </div>
      </div>

      <div
        aria-labelledby={osTabId("process")}
        className="os-studio-panel process-lifecycle-panel"
        hidden={activeView !== "process"}
        id={osPanelId("process")}
        role="tabpanel"
        tabIndex={0}
      >
        <div className="os-panel-intro">
          <div>
            <p className="kicker">Process lifecycle & scheduler model</p>
            <h3>Eligible is not the same as executing.</h3>
          </div>
          <p>
            Declared machine: one logical CPU, three runnable candidates, and
            one blocking input. Change policy without changing Atlas’s semantic
            result. This is a model—not your host scheduler.
          </p>
        </div>

        <div className="process-capsules">
          <section>
            <small>Passive program artifact</small>
            <h4>atlas_worker.py</h4>
            <p>Stored instructions, defaults, and launch metadata. It has no PID.</p>
          </section>
          <span aria-hidden="true">launch →</span>
          <section>
            <small>Live process resource capsule</small>
            <ul>
              <li>execution state</li>
              <li>virtual address space</li>
              <li>open resources</li>
              <li>cwd + environment</li>
              <li>authority context</li>
              <li>lifecycle status</li>
            </ul>
          </section>
          <section className="identity-capsule">
            <small>Identity is layered</small>
            <dl>
              <div>
                <dt>run_id</dt>
                <dd>atlas-run-018 · application identity</dd>
              </div>
              <div>
                <dt>PID</dt>
                <dd>4312 · one observed OS identity with start provenance</dd>
              </div>
            </dl>
          </section>
        </div>

        <div className="policy-switch" aria-label="Declared scheduling policy">
          {schedulingPolicies.map((policy) => (
            <button
              aria-pressed={processPolicy === policy.id}
              key={policy.id}
              onClick={() => setProcessPolicy(policy.id)}
              type="button"
            >
              <strong>{policy.label}</strong>
              <small>next: {policy.next}</small>
            </button>
          ))}
        </div>
        <p className="policy-result" aria-live="polite">
          <strong>{selectedPolicy.label} selects {selectedPolicy.next}.</strong>{" "}
          {selectedPolicy.rationale} Selection order is not an Atlas correctness
          contract.
        </p>

        <div className="scheduler-layout">
          <div className="process-state-map" aria-label="Atlas process states">
            {processStates.map((state, index) => (
              <div
                className={scheduler.atlas === state ? "active" : undefined}
                key={state}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{state}</strong>
              </div>
            ))}
          </div>

          <div className="scheduler-console">
            <div className="scheduler-event">
              <small>Event {schedulerStep + 1} of {schedulerSteps.length}</small>
              <h4>{scheduler.event}</h4>
              <p aria-live="polite">{scheduler.reason}</p>
            </div>
            <dl>
              <div>
                <dt>Running</dt>
                <dd>{scheduler.running}</dd>
              </div>
              <div>
                <dt>Ready queue</dt>
                <dd>{scheduler.queue}</dd>
              </div>
              <div>
                <dt>Waiting</dt>
                <dd>{scheduler.waiting}</dd>
              </div>
              <div>
                <dt>Policy choice</dt>
                <dd>{selectedPolicy.next}</dd>
              </div>
            </dl>
            <div className="os-step-controls">
              <button
                disabled={schedulerStep === 0}
                onClick={() => setSchedulerStep((step) => Math.max(0, step - 1))}
                type="button"
              >
                ← Previous event
              </button>
              <span>{scheduler.atlas}</span>
              <button
                disabled={schedulerStep === schedulerSteps.length - 1}
                onClick={() =>
                  setSchedulerStep((step) =>
                    Math.min(schedulerSteps.length - 1, step + 1),
                  )
                }
                type="button"
              >
                Next event →
              </button>
            </div>
          </div>
        </div>

        <div className="scope-boundary">
          <p>
            <strong>Shows</strong>
            State eligibility, a declared policy, and why blocking changes the
            ready set.
          </p>
          <p>
            <strong>Cannot show</strong>
            This trace does not predict host timing, fairness, priorities,
            multicore behavior, or a particular OS implementation.
          </p>
        </div>
      </div>

      <div
        aria-labelledby={osTabId("memory")}
        className="os-studio-panel virtual-memory-panel"
        hidden={activeView !== "memory"}
        id={osPanelId("memory")}
        role="tabpanel"
        tabIndex={0}
      >
        <div className="os-panel-intro">
          <div>
            <p className="kicker">16-bit address translation</p>
            <h3>Translate first. Classify faults second.</h3>
          </div>
          <p>
            Declared model: 16-bit virtual addresses, 256-byte pages, an 8-bit
            VPN, an 8-bit offset, and a 256-entry teaching page table.
          </p>
        </div>

        <p className="teaching-model-banner">
          Teaching page table, not a host-memory inspector. Physical address
          when mapped: <code>(frame &lt;&lt; 8) | offset</code>.
        </p>

        <div className="vm-process-switch" aria-label="Teaching address space">
          {(["A", "B"] as const).map((candidate) => (
            <button
              aria-pressed={vmProcess === candidate}
              key={candidate}
              onClick={() => {
                setVmProcess(candidate);
                setVmEntryOverride(null);
                resetVmPrediction();
              }}
              type="button"
            >
              Process {candidate}
              <small>
                VA 0x2A3F →{" "}
                {candidate === "A" ? "frame 0x91" : "frame 0x52"}
              </small>
            </button>
          ))}
        </div>

        <div className="memory-workbench">
          <div className="address-controls">
            <label htmlFor="virtual-address">
              Virtual address
              <output htmlFor="virtual-address">{hexadecimal(virtualAddress)}</output>
            </label>
            <input
              aria-describedby="virtual-address-description"
              aria-valuetext={hexadecimal(virtualAddress)}
              id="virtual-address"
              max={0xffff}
              min={0}
              onChange={(event) => {
                setVirtualAddress(Number(event.target.value));
                setVmEntryOverride(null);
                resetVmPrediction();
              }}
              step={1}
              type="range"
              value={virtualAddress}
            />
            <p id="virtual-address-description">
              Move across the complete 16-bit virtual-address range.
            </p>
            <div className="address-presets" aria-label="Address examples">
              {addressPresets.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => {
                    setVirtualAddress(preset.address);
                    setMemoryAccess(preset.access);
                    setVmEntryOverride(null);
                    resetVmPrediction();
                  }}
                  type="button"
                >
                  {preset.label}
                </button>
              ))}
            </div>
            <div className="memory-access-switch" aria-label="Requested access">
              {(["read", "write", "execute"] as const).map((access) => (
                <button
                  aria-pressed={memoryAccess === access}
                  key={access}
                  onClick={() => {
                    setMemoryAccess(access);
                    resetVmPrediction();
                  }}
                  type="button"
                >
                  {access}
                </button>
              ))}
            </div>
          </div>

          <div className="pte-controls">
            <small>
              Editable PTE · process {vmProcess} · VPN{" "}
              {hexadecimal(virtualPage, 2)}
            </small>
            <div>
              <button
                aria-pressed={editableVmEntry.valid}
                onClick={() => {
                  setVmEntryOverride({
                    ...editableVmEntry,
                    valid: !editableVmEntry.valid,
                  });
                  resetVmPrediction();
                }}
                type="button"
              >
                valid
              </button>
              <button
                aria-pressed={editableVmEntry.present}
                onClick={() => {
                  setVmEntryOverride({
                    ...editableVmEntry,
                    present: !editableVmEntry.present,
                    frame: editableVmEntry.frame ?? 0x20,
                  });
                  resetVmPrediction();
                }}
                type="button"
              >
                present
              </button>
              {(["r", "w", "x"] as const).map((permission) => (
                <button
                  aria-pressed={editableVmEntry.permissions.includes(permission)}
                  key={permission}
                  onClick={() => {
                    const current = editableVmEntry.permissions;
                    const index = { r: 0, w: 1, x: 2 }[permission];
                    const next = current
                      .padEnd(3, "-")
                      .split("")
                      .map((token, tokenIndex) =>
                        tokenIndex === index
                          ? token === permission
                            ? "-"
                            : permission
                          : token,
                      )
                      .join("");
                    setVmEntryOverride({
                      ...editableVmEntry,
                      permissions: next,
                    });
                    resetVmPrediction();
                  }}
                  type="button"
                >
                  {permission.toUpperCase()}
                </button>
              ))}
            </div>
            <p>
              frame{" "}
              {editableVmEntry.frame === null
                ? "—"
                : hexadecimal(editableVmEntry.frame, 2)}
              {" · "}
              {editableVmEntry.fileBacked ? "file-backed" : "anonymous"}
            </p>
          </div>

          <div className="vm-prediction-form">
            <small>Commit the translation before reveal</small>
            <div className="vm-field-grid">
              <label>
                VPN (hex)
                <input
                  onChange={(event) => {
                    setVmPredictedVpn(event.target.value);
                    setVmRevealed(false);
                  }}
                  placeholder="2A"
                  value={vmPredictedVpn}
                />
              </label>
              <label>
                Offset (hex)
                <input
                  onChange={(event) => {
                    setVmPredictedOffset(event.target.value);
                    setVmRevealed(false);
                  }}
                  placeholder="3F"
                  value={vmPredictedOffset}
                />
              </label>
            </div>
            <div className="vm-outcome-switch" aria-label="Predicted translation outcome">
              {([
                ["mapped", "Mapped"],
                ["not-present", "Not present"],
                ["protection", "Protection fault"],
                ["invalid", "Invalid mapping"],
              ] as const).map(([value, label]) => (
                <button
                  aria-pressed={vmPredictedOutcome === value}
                  key={value}
                  onClick={() => {
                    setVmPredictedOutcome(value);
                    setVmRevealed(false);
                  }}
                  type="button"
                >
                  {label}
                </button>
              ))}
            </div>
            {vmPredictedOutcome === "mapped" && (
              <label>
                Predicted physical address (hex)
                <input
                  onChange={(event) => {
                    setVmPredictedPhysical(event.target.value);
                    setVmRevealed(false);
                  }}
                  placeholder="913F"
                  value={vmPredictedPhysical}
                />
              </label>
            )}
            <fieldset className="confidence-fieldset">
              <legend>Confidence 1–4</legend>
              <div>
                {([1, 2, 3, 4] as const).map((level) => (
                  <button
                    aria-pressed={vmConfidence === level}
                    key={level}
                    onClick={() => {
                      setVmConfidence(level);
                      setVmRevealed(false);
                    }}
                    type="button"
                  >
                    <span>{level}</span>
                    {level === 1 ? "Unsure" : level === 4 ? "Can defend" : "Developing"}
                  </button>
                ))}
              </div>
            </fieldset>
            <button
              className="reveal-model-answer"
              disabled={!vmCanReveal}
              onClick={() => setVmRevealed(true)}
              type="button"
            >
              Reveal translation
            </button>
          </div>
        </div>

        <div
          aria-live="polite"
          className={`translation-result ${vmRevealed ? "revealed" : ""}`}
        >
          {vmRevealed && vmPredictedOutcome && vmConfidence ? (
            <>
              <span>
                {vmPredictedOutcome === translation.status &&
                vmArithmeticAligned
                  ? "Outcome aligned"
                  : "Revise the split, PTE, or fault model"}{" "}
                · confidence {vmConfidence}/4
              </span>
              <div className="address-split" aria-label="Revealed address bit fields">
                <div>
                  <small>VPN · high 8 bits</small>
                  <code>{binaryAddress.slice(0, 8)}</code>
                  <span>{hexadecimal(translation.vpn, 2)}</span>
                </div>
                <div>
                  <small>Offset · low 8 bits</small>
                  <code>{binaryAddress.slice(8)}</code>
                  <span>{hexadecimal(translation.offset, 2)}</span>
                </div>
              </div>
              <h4>
                {translation.physical === null
                  ? translation.label
                  : `Physical ${hexadecimal(translation.physical)}`}
              </h4>
              <p>{translation.detail}</p>
            </>
          ) : (
            <p>
              Enter VPN, offset, predicted PTE outcome, any mapped physical
              address, and confidence 1–4 before the result appears.
            </p>
          )}
        </div>

        <div className="page-table-wrap">
          <table>
            <caption>
              Canonical page-table examples · process {vmProcess}
            </caption>
            <thead>
              <tr>
                <th scope="col">VPN</th>
                <th scope="col">Valid</th>
                <th scope="col">Present</th>
                <th scope="col">Frame</th>
                <th scope="col">Permission</th>
                <th scope="col">Backing</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(pageTables[vmProcess]).map(([vpn, baseEntry]) => {
                const entry =
                  Number(vpn) === virtualPage && vmEntryOverride
                    ? vmEntryOverride
                    : baseEntry;
                return (
                  <tr
                    className={
                      translation.vpn === Number(vpn) ? "active" : undefined
                    }
                    key={vpn}
                  >
                    <th scope="row">{hexadecimal(Number(vpn), 2)}</th>
                    <td>{entry.valid ? "yes" : "no"}</td>
                    <td>{entry.present ? "yes" : "no"}</td>
                    <td>
                      {entry.frame === null
                        ? "—"
                        : hexadecimal(entry.frame, 2)}
                    </td>
                    <td><code>{entry.permissions}</code></td>
                    <td>{entry.fileBacked ? "file" : "anonymous"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="scope-boundary">
          <p>
            <strong>Shows</strong>
            Exact VPN/offset arithmetic and fault classification for this
            declared page table.
          </p>
          <p>
            <strong>Cannot show</strong>
            It does not inspect your process, host page tables, TLB, page
            replacement, cache, swap policy, or physical RAM.
          </p>
        </div>
      </div>

      <div
        aria-labelledby={osTabId("files")}
        className="os-studio-panel open-resource-panel"
        hidden={activeView !== "files"}
        id={osPanelId("files")}
        role="tabpanel"
        tabIndex={0}
      >
        <div className="os-panel-intro">
          <div>
            <p className="kicker">Pathname & open-resource graph</p>
            <h3>A name is not an open file.</h3>
          </div>
          <p>
            Advance one declared name/open-resource trace, then change platform
            vocabulary without changing the application invariant.
          </p>
        </div>

        <div className="vm-process-switch" aria-label="File platform vocabulary">
          {(["posix", "windows"] as const).map((candidate) => (
            <button
              aria-pressed={fileProfile === candidate}
              key={candidate}
              onClick={() => setFileProfile(candidate)}
              type="button"
            >
              {candidate === "posix" ? "POSIX-like model" : "Windows profile"}
              <small>
                {candidate === "posix"
                  ? "descriptor · open description · rename"
                  : "handle · file object · replacement conditions"}
              </small>
            </button>
          ))}
        </div>
        <p className="policy-result" aria-live="polite">
          {fileVocabulary.replacement}
        </p>

        <div className="file-stage-controls">
          {fileStages.map((stage, index) => (
            <button
              aria-current={fileStep === index ? "step" : undefined}
              className={fileStep === index ? "selected" : undefined}
              key={stage.action}
              onClick={() => setFileStep(index)}
              type="button"
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              {stage.action}
            </button>
          ))}
        </div>

        <div className="resource-graph" aria-label={`Resource graph after ${fileStage.action}`}>
          <div className="resource-column">
            <small>Directory namespace</small>
            <div className={fileStage.pathname === "name removed" ? "removed" : undefined}>
              <strong>name edge</strong>
              <code>{fileStage.pathname}</code>
            </div>
            <div className={fileStage.candidate === "—" ? "removed" : undefined}>
              <strong>candidate edge</strong>
              <code>{fileStage.candidate}</code>
            </div>
          </div>
          <span className="resource-arrow" aria-hidden="true">→</span>
          <div className="resource-column descriptor-column">
            <small>Atlas {fileVocabulary.table}</small>
            <div className={fileStage.open ? undefined : "removed"}>
              <strong>{fileVocabulary.reference}</strong>
              <code>
                {fileStage.open
                  ? `→ ${fileVocabulary.openResource} O_old`
                  : "closed"}
              </code>
            </div>
          </div>
          <span className="resource-arrow" aria-hidden="true">→</span>
          <div className="resource-column">
            <small>{fileVocabulary.openResource}</small>
            <div className={fileStage.resource ? undefined : "removed"}>
              <strong>O_old · offset 128</strong>
              <code>{fileStage.openObject}</code>
            </div>
          </div>
          <span className="resource-arrow" aria-hidden="true">→</span>
          <div className="resource-column">
            <small>{fileVocabulary.object}</small>
            <div className={!fileStage.resource && fileStage.pathname === "name removed" ? "removed" : undefined}>
              <strong>F_old / F_new</strong>
              <code>{fileStage.candidate}</code>
            </div>
          </div>
        </div>

        <p className="resource-narration" aria-live="polite">
          <strong>{fileStage.action}.</strong> {fileStage.note}
        </p>

        <div className="cache-inspector">
          <div className="cache-layer-rail" aria-label="Buffer and cache layers">
            {cacheLayers.map((layer, index) => (
              <button
                aria-pressed={activeCacheLayer === index}
                key={layer.id}
                onClick={() => setActiveCacheLayer(index)}
                type="button"
              >
                <strong>{layer.label}</strong>
                <small>{layer.owner}</small>
              </button>
            ))}
          </div>
          <div aria-live="polite" className="cache-layer-detail">
            <span>{cacheLayer.owner}</span>
            <h4>{cacheLayer.label}</h4>
            <p><strong>Can show:</strong> {cacheLayer.shows}</p>
            <p><strong>Cannot show:</strong> {cacheLayer.cannot}</p>
          </div>
        </div>

        <div className="scope-boundary">
          <p>
            <strong>Shows</strong>
            Why path resolution, descriptors, shared open state, and object
            lifetime are separate relationships.
          </p>
          <p>
            <strong>Cannot show</strong>
            Neither vocabulary profile observes physical transfer, durability,
            network filesystems, object reuse, or a concurrent writer. Those
            claims require named contracts and evidence; concurrency begins in
            Module 19.
          </p>
        </div>
      </div>

      <div
        aria-labelledby={osTabId("publication")}
        className="os-studio-panel publication-cut-panel"
        hidden={activeView !== "publication"}
        id={osPanelId("publication")}
        role="tabpanel"
        tabIndex={0}
      >
        <div className="os-panel-intro">
          <div>
            <p className="kicker">Controlled publication-cut lab</p>
            <h3>Predict before you reveal.</h3>
          </div>
          <p>
            Cut only a disposable spawned child at an exact application
            boundary. This tests process interruption—not OS crash, sudden
            power loss, or dishonest storage.
          </p>
        </div>

        <div className="publication-assumptions">
          <span>Declared assumptions for the scored process experiment</span>
          <p>
            One worker; one disposable marked workspace; a valid old target;
            one same-directory owned temp; successful calls through the selected
            phase; no competing writer; exact target/temp inspection afterward.
          </p>
          <strong>
            Power-loss outcome: UNKNOWN unless a named OS, filesystem, device,
            synchronization protocol, and failure model are supplied.
          </strong>
        </div>

        <div className="profile-switch" aria-label="Publication process scenario">
          {publicationScenarios.map((scenario) => (
            <button
              aria-pressed={publicationScenario === scenario.id}
              key={scenario.id}
              onClick={() => {
                setPublicationScenario(scenario.id);
                setPrediction(null);
                setConfidence(null);
                setShowPublicationAnswer(false);
              }}
              type="button"
            >
              <strong>{scenario.label}</strong>
              <small>{scenario.description}</small>
            </button>
          ))}
        </div>

        <div className="publication-phase-control">
          <label htmlFor="publication-phase">
            Last observed phase {publicationPhase + 1} of{" "}
            {publicationPhases.length} · <strong>{publication.label}</strong>
          </label>
          <input
            aria-valuetext={`Last observed phase ${publication.label}`}
            id="publication-phase"
            max={publicationPhases.length - 1}
            min={0}
            onChange={(event) =>
              choosePublicationPhase(Number(event.target.value))
            }
            step={1}
            type="range"
            value={publicationPhase}
          />
          <div className="publication-phase-markers" aria-hidden="true">
            {publicationPhases.map((phase, index) => (
              <span
                className={
                  publicationNeedsInspection
                    ? index === publicationPhase
                      ? "passed"
                      : undefined
                    : index <= publicationPhase
                      ? "passed"
                      : undefined
                }
                key={phase.label}
              >
                {index + 1}
              </span>
            ))}
          </div>
          <ol
            className="publication-phase-vocabulary"
            aria-label="Canonical publication phases"
          >
            {publicationPhases.map((phase, index) => (
              <li key={phase.label}>
                <button
                  aria-current={publicationPhase === index ? "step" : undefined}
                  className={publicationPhase === index ? "selected" : undefined}
                  onClick={() => choosePublicationPhase(index)}
                  type="button"
                >
                  {phase.label}
                </button>
              </li>
            ))}
          </ol>
        </div>

        <div className="publication-scenario">
          <div>
            <small>Last completed operation</small>
            <code>{publication.operation}</code>
          </div>
          <div>
            <small>Does not establish</small>
            <p>{publication.doesNotEstablish}</p>
          </div>
          <div>
            <small>Process scenario</small>
            <p>{processScenarioSummary}</p>
          </div>
          <div>
            <small>Physical persistence</small>
            <p>UNKNOWN under this child-process experiment.</p>
          </div>
        </div>

        <fieldset className="prediction-fieldset">
          <legend>
            After this controlled child cut, what does the stable public target
            name resolve to in the declared model?
          </legend>
          <div>
            {(Object.keys(predictionLabels) as Prediction[]).map((choice) => (
              <button
                aria-pressed={prediction === choice}
                key={choice}
                onClick={() => {
                  setPrediction(choice);
                  setShowPublicationAnswer(false);
                }}
                type="button"
              >
                {predictionLabels[choice]}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="confidence-fieldset">
          <legend>Confidence 1–4</legend>
          <div>
            {([1, 2, 3, 4] as const).map((level) => (
              <button
                aria-pressed={confidence === level}
                key={level}
                onClick={() => {
                  setConfidence(level);
                  setShowPublicationAnswer(false);
                }}
                type="button"
              >
                <span>{level}</span>
                {level === 1 ? "Unsure" : level === 4 ? "Can defend" : "Developing"}
              </button>
            ))}
          </div>
        </fieldset>

        <button
          className="reveal-model-answer"
          disabled={prediction === null || confidence === null}
          onClick={() => setShowPublicationAnswer(true)}
          type="button"
        >
          Reveal artifact and evidence state
        </button>

        <div
          aria-live="polite"
          className={`publication-answer ${showPublicationAnswer ? "revealed" : ""}`}
        >
          {showPublicationAnswer && prediction && confidence ? (
            <>
              <span>
                {prediction === publicationExpected
                  ? "Process-cut model aligned"
                  : "Revise target-name versus process-exit state"}{" "}
                · confidence {confidence}/4
              </span>
              <h4>
                Stable target: {predictionLabels[publicationExpected]}
              </h4>
              <dl className="artifact-evidence-grid">
                <div>
                  <dt>Target artifact</dt>
                  <dd>
                    {publicationExpected === "new"
                      ? "Successful runtime replacement makes current.json resolve to F_new; inspect and validate it."
                      : publicationExpected === "old"
                        ? "The previously valid F_old remains at current.json in this declared process-cut model."
                        : "Inspect and validate current.json. EXITED or RECOVERED evidence alone cannot choose old versus new."}
                  </dd>
                </div>
                <div>
                  <dt>Owned temp artifact</dt>
                  <dd>{tempState}</dd>
                </div>
                <div>
                  <dt>Phase evidence</dt>
                  <dd>
                    {publicationNeedsInspection
                      ? `${publication.label} was observed; inspect the recorded worker-phase prefix instead of assuming every earlier publication phase occurred.`
                      : `${publication.label} was observed; later phases were not.`}
                  </dd>
                </div>
                <div>
                  <dt>Exit evidence</dt>
                  <dd>
                    {publicationScenario === "normal"
                      ? "No injected exit at this snapshot."
                      : publicationScenario === "cooperative"
                        ? "Record cooperative request and eventual raw return code separately."
                        : "Record abrupt child exit separately; cleanup is not inferred."}
                  </dd>
                </div>
                <div>
                  <dt>Power-loss durability</dt>
                  <dd>
                    UNKNOWN. No durability score is assigned without explicit
                    named platform and storage assumptions.
                  </dd>
                </div>
              </dl>
            </>
          ) : (
            <p>
              Choose a target-state prediction and an explicit confidence from
              1–4 before artifact and evidence states appear.
            </p>
          )}
        </div>

        <div className="scope-boundary">
          <p>
            <strong>Shows</strong>
            The exact canonical phase vocabulary and artifact/exit evidence
            produced by a controlled child-process interruption.
          </p>
          <p>
            <strong>Cannot show</strong>
            Controlled child exit is not OS crash or power loss. Durability,
            concurrent publication, distributed acknowledgement, and CPython
            cleanup internals require named evidence or later modules.
          </p>
        </div>
      </div>

      <div
        aria-labelledby={osTabId("shutdown")}
        className="os-studio-panel shutdown-auditor-panel"
        hidden={activeView !== "shutdown"}
        id={osPanelId("shutdown")}
        role="tabpanel"
        tabIndex={0}
      >
        <div className="os-panel-intro">
          <div>
            <p className="kicker">Shutdown & claim auditor</p>
            <h3>Choose the jurisdiction before the verdict.</h3>
          </div>
          <p>
            The same sentence can be defensible, conditional, or meaningless
            when its platform and failure model change.
          </p>
        </div>

        <div className="profile-switch" aria-label="Operating-system claim profile">
          {platformProfiles.map((candidate) => (
            <button
              aria-pressed={profile === candidate.id}
              key={candidate.id}
              onClick={() => setProfile(candidate.id)}
              type="button"
            >
              <strong>{candidate.label}</strong>
              <small>{candidate.summary}</small>
            </button>
          ))}
        </div>

        <div className="shutdown-sequence">
          <ol aria-label="Supervisor shutdown escalation sequence">
            {shutdownSteps.map((step, index) => (
              <li key={`${step.label}-${index}`}>
                <button
                  aria-current={shutdownStep === index ? "step" : undefined}
                  className={shutdownStep === index ? "selected" : undefined}
                  onClick={() => setShutdownStep(index)}
                  type="button"
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {step.label}
                </button>
              </li>
            ))}
          </ol>
          <div aria-live="polite">
            <small>
              {platformProfiles.find((candidate) => candidate.id === profile)?.label}
            </small>
            <h4>{shutdown.label}</h4>
            <p>{shutdownCapabilityNote}</p>
          </div>
        </div>

        <div className="claim-auditor-layout">
          <div className="shutdown-claim-list" aria-label="Claims to audit">
            {shutdownClaims.map((candidate, index) => (
              <button
                aria-pressed={activeClaim === index}
                key={candidate.id}
                onClick={() => setActiveClaim(index)}
                type="button"
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                {candidate.claim}
              </button>
            ))}
          </div>

          <div className="shutdown-verdict" aria-live="polite">
            <span>{platformProfiles.find((candidate) => candidate.id === profile)?.label}</span>
            <h4>{audit.verdict}</h4>
            <blockquote>{claim.claim}</blockquote>
            <p>{audit.explanation}</p>
            <dl>
              <div>
                <dt>Evidence can show</dt>
                <dd>{audit.shows}</dd>
              </div>
              <div>
                <dt>Evidence cannot show</dt>
                <dd>{audit.cannot}</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="scope-boundary">
          <p>
            <strong>Shows</strong>
            How portability, platform semantics, failure mode, and observation
            change a shutdown claim.
          </p>
          <p>
            <strong>Cannot show</strong>
            This auditor is a reasoning instrument—not legal wording,
            production certification, or proof for an untested environment.
            Multi-worker races belong to Module 19, remote acknowledgement to
            Modules 20–21, and CPython cleanup internals to Module 24.
          </p>
        </div>
      </div>

      <footer className="os-studio-footer">
        <div>
          <span>Module 17</span>
          <strong>What state can the machine expose?</strong>
        </div>
        <i aria-hidden="true">→</i>
        <div>
          <span>Module 18</span>
          <strong>Who mediates each resource transition?</strong>
        </div>
        <i aria-hidden="true">→</i>
        <div>
          <span>Module 19 handoff</span>
          <strong>What changes when execution overlaps?</strong>
        </div>
      </footer>
    </section>
  );
}
