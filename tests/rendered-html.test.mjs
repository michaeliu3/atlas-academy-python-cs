import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { diagnosticQuestions } from "../lib/diagnostic-model.js";
import { extractTableOfContents } from "../lib/heading-ids.js";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set(
    "test",
    `${process.pid}-${Date.now()}-${pathname.replaceAll("/", "-")}`,
  );
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

function extractFunctionSource(source, name) {
  const marker = new RegExp(`(?:export\\s+)?function\\s+${name}\\s*\\(`);
  const match = marker.exec(source);
  assert.ok(match, `expected function ${name}`);

  const rest = source.slice(match.index + match[0].length);
  const nextFunction = /\n(?:export\s+)?function\s+[A-Za-z0-9_]+\s*\(/.exec(rest);
  return source.slice(
    match.index,
    nextFunction
      ? match.index + match[0].length + nextFunction.index
      : source.length,
  );
}

function assertPredictionGated(componentSource, componentName) {
  const predictionGate = componentSource.indexOf("<PredictionGate");
  const revealBranch = componentSource.indexOf("!answer.revealed");
  const evidenceLock = componentSource.indexOf("<EvidenceLock");

  assert.ok(predictionGate >= 0, `${componentName} has a prediction gate`);
  assert.ok(
    revealBranch > predictionGate,
    `${componentName} branches on reveal only after the prediction gate`,
  );
  assert.ok(
    evidenceLock > revealBranch,
    `${componentName} covers answer-bearing evidence before reveal`,
  );
}

test("renders the Atlas Academy course portal", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Atlas Academy · Python &amp; Computer Science<\/title>/i);
  assert.match(html, /Learn to see the/);
  assert.match(html, /The knowledge spine/);
  assert.match(html, /Less typing\. More ownership\./);
  assert.match(html, /Data structures/);
  assert.match(html, /Durable software/);
  assert.match(html, /Course library/);
  assert.match(html, /Begin the diagnostic/);
  assert.match(html, /href="\/diagnostic"/);
  assert.match(html, /Thirteen multiple-choice investigations/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});

test("renders the accessible, confidence-aware Module 0 placement studio", async () => {
  const response = await render("/diagnostic");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /Module 0 Diagnostic · Atlas Academy/);
  assert.match(html, /Module 0 · 13 reasoning probes/);
  assert.match(html, /Which pair is correct at the end\?/);
  assert.match(html, /Choose the model that best predicts the result/);
  assert.match(html, /No penalty for uncertainty/);
  assert.match(html, /Restoring saved progress/);
  assert.match(html, /Answers remain in this browser/);
  assert.match(html, /type="radio"/);
  assert.match(html, /<fieldset/);
  assert.match(html, /<legend/);
  assert.match(html, /<progress/);
  assert.match(html, /aria-label="Diagnostic questions"/);
  assert.match(html, /Reset all answers/);
  assert.doesNotMatch(html, /role="radiogroup"/);
  assert.doesNotMatch(html, /window\.confirm/);
});

test("Module 18 OS studio preserves its canonical interactive contract", async () => {
  const studioUrl = new URL("../app/OperatingSystemsStudio.tsx", import.meta.url);
  const arcUrl = new URL("../app/ArcFourStudio.tsx", import.meta.url);
  const [studio, arc] = await Promise.all([
    readFile(studioUrl, "utf8"),
    readFile(arcUrl, "utf8"),
  ]);

  const exactInvariant =
    "Every worker-visible effect is accounted for both as a process-local operation and as an OS-mediated resource transition. After interruption, Atlas publishes only a complete validated result, or leaves an explicitly classified recoverable state; an exit code, successful API return, or timing observation never silently substitutes for that evidence.";
  assert.ok(studio.includes(exactInvariant));
  assert.match(arc, /<OperatingSystemsStudio \/>/);
  assert.match(
    arc,
    /href: "\/modules\/18-operating-systems-resource-mediation"/,
  );

  for (const viewLabel of [
    "Boundary crossing",
    "Process lifecycle",
    "Virtual memory",
    "Open resources",
    "Publication cut",
    "Claim auditor",
  ]) {
    assert.ok(studio.includes(`label: "${viewLabel}"`), viewLabel);
  }
  assert.match(studio, /role="tablist"/);
  assert.match(studio, /role="tab"/);
  assert.match(studio, /role="tabpanel"/);
  assert.match(studio, /aria-controls=\{osPanelId\(view\.id\)\}/);
  assert.match(studio, /aria-selected=\{activeView === view\.id\}/);
  assert.match(studio, /event\.key === "ArrowRight"/);

  for (const phase of [
    "ADMITTED",
    "STARTED",
    "ENCODED",
    "STAGED",
    "VALIDATED",
    "PY_FLUSHED",
    "FILE_SYNC_RETURNED",
    "CLOSED",
    "REPLACED",
    "DIR_SYNC_RETURNED",
    "EXITED",
    "RECOVERED",
  ]) {
    assert.ok(studio.includes(`label: "${phase}"`), phase);
  }
  assert.match(studio, /\(\[1, 2, 3, 4\] as const\)/);
  assert.equal(
    [...studio.matchAll(/useState<Confidence \| null>\(null\)/gu)].length,
    3,
  );
  assert.doesNotMatch(studio, /useState<Confidence>\([1-4]\)/);
  assert.match(studio, /prediction === null \|\| confidence === null/);

  assert.match(studio, /16-bit virtual addresses, 256-byte pages/);
  assert.match(studio, /an 8-bit\s+VPN, an 8-bit offset/);
  assert.match(studio, /const vpn = address >>> 8/);
  assert.match(studio, /const offset = address & 0xff/);
  assert.match(studio, /\(entry\.frame << 8\) \| offset/);
  assert.match(studio, /0x2a:[\s\S]*?frame: 0x91/);
  assert.match(studio, /Process \{candidate\}/);
  assert.match(studio, /aria-pressed=\{editableVmEntry\.present\}/);
  assert.match(studio, /Commit the translation before reveal/);

  assert.match(studio, /run_id/);
  assert.match(studio, /PID/);
  assert.match(studio, /COLLECTED/);
  assert.match(studio, /B renames candidate/);
  assert.match(studio, /OS page cache/);
  assert.match(studio, /POSIX-like model/);
  assert.match(studio, /Windows profile/);
  assert.match(studio, /kill if distinct/);

  assert.match(studio, /Power-loss outcome: UNKNOWN/);
  assert.match(
    studio,
    /Controlled child exit is not OS crash or power loss/,
  );
  assert.doesNotMatch(studio, /sudden\s+power\s+loss\s+immediately\s+afterward/i);
  assert.match(studio, /No durability score is assigned/);

  assert.match(studio, /STUDIO_STORAGE_KEY/);
  assert.match(studio, /window\.localStorage\.getItem/);
  assert.match(studio, /window\.localStorage\.setItem/);
  assert.match(studio, /window\.localStorage\.removeItem/);
  assert.match(studio, /useEffect\(\(\) => \{/);
  assert.match(studio, /Reset saved studio/);
  assert.match(studio, /const resetStudio = \(\) =>/);
});

test("Module 19 preserves its invariant and six-view shell", async () => {
  const studioUrl = new URL("../app/ConcurrencyStudio.tsx", import.meta.url);
  const arcUrl = new URL("../app/ArcFourStudio.tsx", import.meta.url);
  const [studio, arc] = await Promise.all([
    readFile(studioUrl, "utf8"),
    readFile(arcUrl, "utf8"),
  ]);

  const exactInvariant =
    "Every admitted Atlas partition reaches exactly one terminal classification—`COMMITTED`, `FAILED`, or `CANCELLED`. If Atlas publishes a new index, that index is the deterministic fold of all and only `COMMITTED` partial results, and publication is permitted only when every required partition is `COMMITTED`. Every worker-visible effect remains accounted for as a process-local operation, an OS-mediated resource transition, and one step in a declared concurrent history; each shared transition is justified by one named owner or synchronization protocol, every progress claim states its blocking and fairness assumptions, and neither a clean exit, a passing stress run, the GIL, nor observed speedup substitutes for safety, liveness, or model-fit evidence.";
  assert.ok(studio.includes(exactInvariant));
  assert.match(arc, /<ConcurrencyStudio \/>/);
  assert.match(arc, /href: "\/modules\/19-concurrency-parallelism"/);

  for (const viewLabel of [
    "History explorer",
    "Linearization lab",
    "Coordination console",
    "Progress laboratory",
    "Python model chooser",
    "Evidence auditor",
  ]) {
    assert.ok(studio.includes(`label: "${viewLabel}"`), viewLabel);
  }

  assert.match(studio, /role="tablist"/);
  assert.match(studio, /role="tab"/);
  assert.match(studio, /role="tabpanel"/);
  assert.match(studio, /aria-controls=\{panelId\(view\.id\)\}/);
  assert.match(studio, /aria-selected=\{activeView === view\.id\}/);
  assert.match(studio, /event\.key === "ArrowRight"/);
  assert.match(studio, /event\.key === "ArrowDown"/);
  assert.match(studio, /event\.key === "ArrowLeft"/);
  assert.match(studio, /event\.key === "ArrowUp"/);
  assert.match(studio, /event\.key === "Home"/);
  assert.match(studio, /event\.key === "End"/);
  assert.match(studio, /aria-live="polite"/);
  assert.match(
    studio,
    /aria-labelledby="concurrency-studio-title"/,
    "the complete studio region needs an accessible name",
  );
  assert.match(studio, /id="concurrency-studio-title"/);
  assert.match(
    studio,
    /<progress[\s\S]*?aria-label=/,
    "coverage progress needs a programmatic label",
  );
  assert.match(studio, /aria-label="Executed Module 19 runtime profile"/);
  assert.match(studio, /prefers-reduced-motion/);
  assert.doesNotMatch(studio, /window\.confirm/);

  assert.match(studio, /Confidence/);
  assert.match(studio, /\(\[1, 2, 3, 4\] as const\)/);
  assert.match(studio, /prediction === null \|\| confidence === null/);
  assert.match(studio, /Revise after evidence/);
  assert.match(studio, /What this proves/);
  assert.match(studio, /What remains unknown/);
});

test("Module 20 preserves its invariant and six-view protocol observatory", async () => {
  const studioUrl = new URL("../app/NetworkProtocolStudio.tsx", import.meta.url);
  const styleUrl = new URL("../app/NetworkProtocolStudio.module.css", import.meta.url);
  const arcUrl = new URL("../app/ArcFourStudio.tsx", import.meta.url);
  const pageUrl = new URL("../app/modules/[slug]/page.tsx", import.meta.url);
  const [studio, style, arc, page] = await Promise.all([
    readFile(studioUrl, "utf8"),
    readFile(styleUrl, "utf8"),
    readFile(arcUrl, "utf8"),
    readFile(pageUrl, "utf8"),
  ]);

  const exactInvariant =
    "Every Atlas remote publication operation has one stable operation ID and canonical request digest. The client records the name-resolution and endpoint-attempt boundary, sends only a complete declared request framing, and never infers remote receipt, parsing, decision, commit, or acknowledgement from a local send, connection close, timeout, or retry. The server admits a complete valid request, records one decision for the pair (operation ID, request digest) before returning a response, replays that decision for an identical duplicate, and rejects reuse of the operation ID with a different digest. Only a valid matching response or a subsequent declared status lookup can confirm the server's recorded decision; every ambiguous client outcome remains explicitly UNKNOWN until resolved.";
  assert.ok(studio.includes(exactInvariant));
  assert.match(arc, /<NetworkProtocolStudio \/>/);
  assert.match(arc, /href: "\/modules\/20-networks-application-protocols"/);
  assert.match(page, /slug === "20-networks-application-protocols"/);
  assert.match(page, /<NetworkProtocolStudio \/>/);

  for (const viewLabel of [
    "Name → candidate",
    "Stream → frame",
    "Evidence ladder",
    "HTTP + Atlas",
    "Unknown → retry",
    "Patch auditor",
  ]) {
    assert.ok(studio.includes(`label: "${viewLabel}"`), viewLabel);
  }

  assert.match(studio, /role="tablist"/);
  assert.match(studio, /role="tab"/);
  assert.match(studio, /role="tabpanel"/);
  assert.match(studio, /aria-controls=\{panelId\(view\.id\)\}/);
  assert.match(studio, /aria-selected=\{activeView === view\.id\}/);
  assert.match(studio, /event\.key === "ArrowRight"/);
  assert.match(studio, /event\.key === "ArrowLeft"/);
  assert.match(studio, /event\.key === "Home"/);
  assert.match(studio, /event\.key === "End"/);
  assert.match(studio, /aria-labelledby="network-protocol-studio-title"/);
  assert.match(studio, /aria-label="Exploration coverage: revealed protocol studio views"/);
  assert.match(style, /prefers-reduced-motion/);
  assert.doesNotMatch(studio, /window\.confirm/);
  assert.doesNotMatch(studio, /<svg\b/i);

  assert.match(studio, /\(\[1, 2, 3, 4\] as const\)/);
  assert.equal(
    [...studio.matchAll(/<PredictionGate\b/gu)].length,
    6,
    "each observatory view has one confidence-aware prediction gate",
  );
  assert.match(studio, /record\.choice !== null && record\.confidence !== null/);
  assert.match(studio, /record\.revealed &&/);
  assert.match(studio, /STUDIO_STORAGE_KEY/);
  assert.match(studio, /window\.localStorage\.getItem/);
  assert.match(studio, /window\.localStorage\.setItem/);
  assert.match(studio, /storageReady/);
  assert.match(studio, /declared length/);
  assert.match(studio, /UNKNOWN/);
  assert.match(studio, /Idempotency-Key/);
  assert.match(studio, /scope-labelled model evidence/);
});

test("Module 21 preserves its async invariant and six-view run control room", async () => {
  const studioUrl = new URL("../app/AsyncDistributedStudio.tsx", import.meta.url);
  const styleUrl = new URL("../app/AsyncDistributedStudio.module.css", import.meta.url);
  const arcUrl = new URL("../app/ArcFourStudio.tsx", import.meta.url);
  const pageUrl = new URL("../app/modules/[slug]/page.tsx", import.meta.url);
  const [studio, style, arc, page] = await Promise.all([
    readFile(studioUrl, "utf8"),
    readFile(styleUrl, "utf8"),
    readFile(arcUrl, "utf8"),
    readFile(pageUrl, "utf8"),
  ]);

  const exactInvariant =
    "Every Atlas dispatch has one stable operation ID, canonical request digest, deadline, and evidence record. Local work is admitted through a bounded, explicitly owned async pipeline; every admitted local item receives one terminal local accounting record. Cancellation is cleaned up and propagated according to the owning structured scope, but is never mislabeled as a remote rollback. Every remote retry retains the same operation identity and is classified separately from a transport write, a server/replica observation, a matching reply, and an unresolved outcome. A trace context correlates declared observations; it does not authenticate them, make them complete, or prove causality, durability, or replicated agreement. In this collector case, the dispatch additionally declares its source set, admission bound, deadline/cancellation policy, and publication-cut rule before work starts.";
  assert.ok(studio.includes(exactInvariant));
  assert.match(arc, /<AsyncDistributedStudio \/>/);
  assert.match(arc, /href: "\/modules\/21-async-distributed-systems"/);
  assert.match(page, /slug === "21-async-distributed-systems"/);
  assert.match(page, /<AsyncDistributedStudio \/>/);

  for (const viewLabel of [
    "Coroutine → task",
    "Scope → cancellation",
    "Bound → admission",
    "RPC → UNKNOWN",
    "Trace → relation",
    "Claim → evidence",
  ]) {
    assert.ok(studio.includes(`label: "${viewLabel}"`), viewLabel);
  }

  assert.match(studio, /role="tablist"/);
  assert.match(studio, /role="tab"/);
  assert.match(studio, /role="tabpanel"/);
  assert.match(studio, /aria-controls=\{panelId\(view\.id\)\}/);
  assert.match(studio, /aria-selected=\{activeView === view\.id\}/);
  assert.match(studio, /event\.key === "ArrowRight"/);
  assert.match(studio, /event\.key === "ArrowLeft"/);
  assert.match(studio, /event\.key === "Home"/);
  assert.match(studio, /event\.key === "End"/);
  assert.match(studio, /aria-labelledby="async-run-control-studio-title"/);
  assert.match(studio, /aria-label="Exploration coverage: revealed async run control views"/);
  assert.match(style, /prefers-reduced-motion/);
  assert.doesNotMatch(studio, /window\.confirm/);
  assert.doesNotMatch(studio, /<svg\b/i);
  assert.doesNotMatch(studio, /dangerouslySetInnerHTML/);

  assert.match(studio, /\(\[1, 2, 3, 4\] as const\)/);
  assert.equal(
    [...studio.matchAll(/<PredictionGate\b/gu)].length,
    6,
    "each run-control view has one confidence-aware prediction gate",
  );
  assert.match(studio, /record\.choice !== null && record\.confidence !== null/);
  assert.match(studio, /!record\.revealed && <EvidenceLock \/>/);
  assert.match(studio, /STUDIO_STORAGE_KEY/);
  assert.match(studio, /window\.localStorage\.getItem/);
  assert.match(studio, /window\.localStorage\.setItem/);
  assert.match(studio, /storageReady/);
  assert.match(studio, /TaskGroup/);
  assert.match(studio, /UNKNOWN_REMOTE/);
  assert.match(studio, /max_in_flight/);
  assert.match(studio, /drain/);
  assert.match(studio, /traceparent/);
  assert.match(studio, /FULL collection cut/);
  assert.match(studio, /does not establish/);
});

test("Module 22 preserves its trust invariant, six-view control room, and latest Arc IV landing", async () => {
  const studioUrl = new URL("../app/SecurityTrustStudio.tsx", import.meta.url);
  const styleUrl = new URL("../app/SecurityTrustStudio.module.css", import.meta.url);
  const arcUrl = new URL("../app/ArcFourStudio.tsx", import.meta.url);
  const pageUrl = new URL("../app/modules/[slug]/page.tsx", import.meta.url);
  const [studio, style, arc, page] = await Promise.all([
    readFile(studioUrl, "utf8"),
    readFile(styleUrl, "utf8"),
    readFile(arcUrl, "utf8"),
    readFile(pageUrl, "utf8"),
  ]);

  const exactInvariant =
    "Atlas accepts an external value only as data until the receiving boundary validates its shape, size, provenance, and permitted meaning. Every security-sensitive effect has an authenticated subject, an explicit authorization decision scoped to action, resource, tenant, and purpose, and a redacted decision record. Untrusted data never selects arbitrary code, process execution, filesystem escape, database structure, network authority, or a raw secret-bearing log field. Release artifacts have declared dependency and build provenance; incident evidence is minimised and labelled with what it does and does not prove. A safe automatic denial/defer path explains the next accessible action and escalates unresolved authority to the named owner.";
  assert.ok(studio.includes(exactInvariant));
  assert.match(arc, /<SecurityTrustStudio \/>/);
  assert.match(arc, /href: "\/modules\/22-security-privacy-trust-boundaries"/);
  assert.match(
    arc,
    /const \[activeModule, setActiveModule\] = useState\(5\)/,
    "Arc IV should open its latest published module, Module 22",
  );
  assert.match(page, /slug === "22-security-privacy-trust-boundaries"/);
  assert.match(page, /<SecurityTrustStudio \/>/);

  for (const viewLabel of [
    "Claim → boundary",
    "Identity → decision",
    "Data → authority",
    "Crypto → purpose",
    "Release → provenance",
    "Incident → restraint",
  ]) {
    assert.ok(studio.includes(`label: "${viewLabel}"`), viewLabel);
  }

  assert.match(studio, /role="tablist"/);
  assert.match(studio, /role="tab"/);
  assert.match(studio, /role="tabpanel"/);
  assert.match(studio, /aria-controls=\{panelId\(view\.id\)\}/);
  assert.match(studio, /aria-selected=\{activeView === view\.id\}/);
  assert.match(studio, /event\.key === "ArrowRight"/);
  assert.match(studio, /event\.key === "ArrowLeft"/);
  assert.match(studio, /event\.key === "Home"/);
  assert.match(studio, /event\.key === "End"/);
  assert.match(studio, /aria-labelledby="security-trust-studio-title"/);
  assert.match(studio, /aria-label="Exploration coverage: revealed security and trust views"/);
  assert.match(style, /prefers-reduced-motion/);
  assert.match(style, /label:has\(input:focus-visible\)/);
  assert.match(style, /td::before/);
  assert.match(style, /attr\(data-label\)/);
  assert.doesNotMatch(studio, /window\.confirm/);
  assert.doesNotMatch(studio, /<svg\b/i);
  assert.doesNotMatch(studio, /dangerouslySetInnerHTML/);

  assert.match(studio, /\(\[1, 2, 3, 4\] as const\)/);
  assert.equal(
    [...studio.matchAll(/<PredictionGate\b/gu)].length,
    6,
    "each trust view has one confidence-aware prediction gate",
  );
  assert.match(studio, /record\.choice !== null && record\.confidence !== null/);
  assert.match(studio, /!record\.revealed && <EvidenceLock \/>/);
  assert.match(studio, /STUDIO_STORAGE_KEY/);
  assert.match(studio, /choiceIdsByView/);
  assert.match(studio, /window\.localStorage\.getItem/);
  assert.match(studio, /window\.localStorage\.setItem/);
  assert.match(studio, /storageReady/);
  assert.match(studio, /trace label supports correlation/);
  assert.match(studio, /worker-99/);
  assert.match(studio, /not established → deny\/defer/);
  assert.match(studio, /status lookup itself requires a separately authorized action/);
  assert.match(studio, /live effects/);
});

test("Module 23 preserves its language-boundary invariant, six-view studio, and safe local progress shape", async () => {
  const studioUrl = new URL("../app/LanguageInterpreterStudio.tsx", import.meta.url);
  const styleUrl = new URL("../app/LanguageInterpreterStudio.module.css", import.meta.url);
  const pageUrl = new URL("../app/modules/[slug]/page.tsx", import.meta.url);
  const [studio, style, page] = await Promise.all([
    readFile(studioUrl, "utf8"),
    readFile(styleUrl, "utf8"),
    readFile(pageUrl, "utf8"),
  ]);

  const invariant =
    "Structure is data; authority is separate and explicit. A successful parse establishes only the declared grammar shape. Atlas checks a bounded contract, resource budget, and authorization decision before a fixed-scope capability can support one local model operation. The evaluator has no ambient Python authority.";
  assert.ok(studio.includes(invariant));
  assert.match(page, /LanguageInterpreterStudio/);
  assert.match(page, /slug === "23-programming-languages-interpreters"/);
  assert.match(page, /<LanguageInterpreterStudio \/>/);

  for (const viewLabel of [
    "Text → tree",
    "Tokens → tree",
    "Names → closure",
    "Tree → meaning",
    "Contract → capability",
    "Source → observation",
  ]) {
    assert.ok(
      studio.includes("label: \"" + viewLabel + "\""),
      viewLabel,
    );
  }

  assert.match(studio, /role="tablist"/);
  assert.match(studio, /role="tab"/);
  assert.match(studio, /role="tabpanel"/);
  assert.match(studio, /event\.key === "ArrowRight"/);
  assert.match(studio, /event\.key === "ArrowLeft"/);
  assert.match(studio, /event\.key === "Home"/);
  assert.match(studio, /event\.key === "End"/);
  assert.match(studio, /aria-labelledby="language-interpreter-studio-title"/);
  assert.match(studio, /STUDIO_STORAGE_KEY/);
  assert.match(studio, /isStudioRecord/);
  assert.match(studio, /choiceIdsByView/);
  assert.match(studio, /window\.localStorage\.getItem/);
  assert.match(studio, /window\.localStorage\.setItem/);
  assert.match(studio, /storageReady/);
  assert.equal(
    [...studio.matchAll(/<PredictionGate\b/gu)].length,
    6,
    "each language view has one confidence-aware prediction gate",
  );
  assert.match(studio, /record\.choice !== null && record\.confidence !== null/);
  assert.match(studio, /!record\.revealed && <EvidenceLock \/>/);
  assert.match(
    studio,
    /\(!candidate\.revealed \|\| \(candidate\.choice !== null && candidate\.confidence !== null\)\)/,
    "stored progress cannot reveal evidence without a recorded choice and confidence",
  );
  assert.match(
    studio,
    /styles\.modeTabs} aria-label="Evaluation rule examples" role="group"/,
    "the semantic examples are ordinary pressed-button controls, not incomplete tabs",
  );
  for (const [scenario, outcome] of [
    ["lexical_rejection", "LEX_ERROR"],
    ["syntax_rejection", "PARSE_ERROR"],
    ["contract_rejection", "CONTRACT_ERROR"],
    ["authorization_denial", "DENIED_AUTHORIZATION"],
    ["successful_count", "RESULT · count = 2"],
  ]) {
    assert.match(studio, new RegExp('scenario: "' + scenario + '"'));
    assert.ok(studio.includes('status: "' + outcome + '"'), outcome);
  }
  assert.match(studio, /not a local evidence packet/);
  assert.match(studio, /no ambient Python authority/);
  assert.match(studio, /never selects its host adapter/);
  assert.doesNotMatch(studio, /window\.confirm/);
  assert.doesNotMatch(studio, /<svg\b/i);
  assert.doesNotMatch(studio, /dangerouslySetInnerHTML/);
  assert.match(style, /prefers-reduced-motion/);
  assert.match(style, /focus-visible/);
});

test("Module 24 preserves its runtime-evidence invariant, six-view observatory, and safe local progress shape", async () => {
  const studioUrl = new URL("../app/RuntimeEvidenceObservatory.tsx", import.meta.url);
  const styleUrl = new URL("../app/RuntimeEvidenceObservatory.module.css", import.meta.url);
  const pageUrl = new URL("../app/modules/[slug]/page.tsx", import.meta.url);
  const [studio, style, page] = await Promise.all([
    readFile(studioUrl, "utf8"),
    readFile(styleUrl, "utf8"),
    readFile(pageUrl, "utf8"),
  ]);

  assert.ok(
    studio.includes(
      "An optimization is accepted only after semantic behavior, privacy/retention boundaries, implementation scope, and a controlled measurement are kept distinct.",
    ),
  );
  assert.match(page, /RuntimeEvidenceObservatory/);
  assert.match(page, /slug === "24-cpython-performance-memory"/);
  assert.match(page, /<RuntimeEvidenceObservatory \/>/);

  for (const viewLabel of [
    "Contract → claim",
    "Names → graph",
    "Cycle → cleanup",
    "Metric → scope",
    "Source → runtime",
    "Patch → decision",
  ]) {
    assert.ok(studio.includes('label: "' + viewLabel + '"'), viewLabel);
  }

  assert.match(studio, /role="tablist"/);
  assert.match(studio, /role="tab"/);
  assert.match(studio, /role="tabpanel"/);
  assert.match(studio, /event\.key === "ArrowRight"/);
  assert.match(studio, /event\.key === "ArrowLeft"/);
  assert.match(studio, /event\.key === "Home"/);
  assert.match(studio, /event\.key === "End"/);
  assert.match(studio, /aria-labelledby="runtime-evidence-observatory-title"/);
  assert.match(studio, /STUDIO_STORAGE_KEY/);
  assert.match(studio, /isObservatoryRecord/);
  assert.match(studio, /choiceIdsByView/);
  assert.match(studio, /window\.localStorage\.getItem/);
  assert.match(studio, /window\.localStorage\.setItem/);
  assert.match(studio, /storageReady/);
  assert.equal(
    [...studio.matchAll(/<PredictionGate\b/gu)].length,
    6,
    "each runtime-evidence view has one confidence-aware prediction gate",
  );
  assert.match(studio, /record\.choice !== null && record\.confidence !== null/);
  assert.match(studio, /!record\.revealed && <EvidenceLock \/>/);
  assert.match(
    studio,
    /!record\.revealed \|\| \(record\.choice !== null && record\.confidence !== null\)/,
    "stored progress cannot reveal evidence without a recorded choice and confidence",
  );
  assert.match(studio, /not a profiler,/);
  assert.match(studio, /not a CPython emulator,/);
  assert.match(studio, /not a license\s+to collect\s+private learner traces/);
  assert.match(studio, /AI-generated patch, a green\s+CI run, private deployment, or a lower isolated metric/);
  assert.doesNotMatch(studio, /window\.confirm/);
  assert.doesNotMatch(studio, /<svg\b/i);
  assert.doesNotMatch(studio, /dangerouslySetInnerHTML/);
  assert.match(style, /prefers-reduced-motion/);
  assert.match(style, /focus-visible/);
});

test("Module 25 preserves its decision-support invariant, six-view studio, and safe local progress shape", async () => {
  const studioUrl = new URL("../app/EvidenceGroundedStudio.tsx", import.meta.url);
  const styleUrl = new URL("../app/EvidenceGroundedStudio.module.css", import.meta.url);
  const pageUrl = new URL("../app/modules/[slug]/page.tsx", import.meta.url);
  const [studio, style, page] = await Promise.all([
    readFile(studioUrl, "utf8"),
    readFile(styleUrl, "utf8"),
    readFile(pageUrl, "utf8"),
  ]);

  assert.ok(
    studio.includes(
      "A score never silently changes learner state, grants authority, proves truth, establishes causality, or turns feedback into ground truth.",
    ),
  );
  assert.match(page, /EvidenceGroundedStudio/);
  assert.match(page, /slug === "25-evidence-grounded-intelligent-systems"/);
  assert.match(page, /<EvidenceGroundedStudio \/>/);

  for (const viewLabel of [
    "Purpose → boundary",
    "Event → claim",
    "Candidates → reason",
    "Score → evidence",
    "Explanation → override",
    "Proposal → review",
  ]) {
    assert.ok(studio.includes('label: "' + viewLabel + '"'), viewLabel);
  }
  assert.ok(
    studio.indexOf('id: "transaction"') < studio.indexOf('id: "repair"'),
    "the visual baseline presents its 13-point candidate before its 8-point candidate",
  );

  assert.match(studio, /role="tablist"/);
  assert.match(studio, /role="tab"/);
  assert.match(studio, /role="tabpanel"/);
  assert.match(studio, /event\.key === "ArrowRight"/);
  assert.match(studio, /event\.key === "ArrowLeft"/);
  assert.match(studio, /event\.key === "Home"/);
  assert.match(studio, /event\.key === "End"/);
  assert.match(studio, /aria-labelledby="evidence-grounded-studio-title"/);
  assert.match(studio, /STUDIO_STORAGE_KEY/);
  assert.match(studio, /isStudioRecord/);
  assert.match(studio, /choiceIdsByView/);
  assert.match(studio, /window\.localStorage\.getItem/);
  assert.match(studio, /window\.localStorage\.setItem/);
  assert.match(studio, /storageReady/);
  assert.equal(
    [...studio.matchAll(/<PredictionGate\b/gu)].length,
    6,
    "each decision-support view has one confidence-aware prediction gate",
  );
  assert.match(studio, /record\.choice !== null && record\.confidence !== null/);
  assert.match(studio, /!record\.revealed && <EvidenceLock \/>/);
  assert.match(studio, /<b>0<\/b> live learner records/);
  assert.match(studio, /Never alter a plan, calendar, or record/);
  assert.match(studio, /setDecisionResponse/);
  assert.match(studio, /role="status"/);
  assert.match(studio, /changed no learner record, plan, or schedule/);
  assert.match(studio, /never sends or changes\s+personal data/);
  assert.doesNotMatch(studio, /window\.confirm/);
  assert.doesNotMatch(studio, /<svg\b/i);
  assert.doesNotMatch(studio, /dangerouslySetInnerHTML/);
  assert.match(style, /prefers-reduced-motion/);
  assert.match(style, /focus-visible/);
});

test("Module 26 preserves its evidence-first capstone flow and local-only boundary", async () => {
  const studioUrl = new URL("../app/CapstoneDefenseStudio.tsx", import.meta.url);
  const styleUrl = new URL("../app/CapstoneDefenseStudio.module.css", import.meta.url);
  const pageUrl = new URL("../app/modules/[slug]/page.tsx", import.meta.url);
  const [studio, style, page] = await Promise.all([
    readFile(studioUrl, "utf8"),
    readFile(styleUrl, "utf8"),
    readFile(pageUrl, "utf8"),
  ]);

  const exactInvariant =
    "A capstone release is a versioned evidence bundle, not a polished demo. Each consequential claim needs a named owner, representation or contract, appropriate test or observation, cost and failure boundary, security/privacy implication, human-impact evaluation, and explicit limitation. Agent-generated work remains an untrusted proposal until independently reviewed and verified.";
  assert.ok(studio.includes(exactInvariant));
  assert.match(page, /CapstoneDefenseStudio/);
  assert.match(page, /slug === "26-systems-capstone-open-source-stewardship"/);
  assert.match(page, /<CapstoneDefenseStudio \/>/);

  const orderedViewIds = ["brief", "threads", "failure", "patch", "ledger", "board"];
  for (const viewLabel of [
    "Release Brief",
    "System Threads",
    "Failure Playback",
    "Red-Team Patch Bay",
    "Evidence Ledger",
    "Release Board & Defense",
  ]) {
    assert.ok(studio.includes('label: "' + viewLabel + '"'), viewLabel);
  }
  for (const [index, viewId] of orderedViewIds.entries()) {
    const nextViewId = orderedViewIds[index + 1];
    if (nextViewId) {
      assert.ok(
        studio.indexOf('id: "' + viewId + '"') < studio.indexOf('id: "' + nextViewId + '"'),
        "capstone view order keeps failure and repair before evidence synthesis",
      );
    }
  }

  assert.match(studio, /role="tablist"/);
  assert.match(studio, /role="tab"/);
  assert.match(studio, /role="tabpanel"/);
  assert.match(studio, /aria-controls=\{`capstone-panel-\$\{view\.id\}`\}/);
  assert.match(studio, /id=\{`capstone-panel-\$\{view\.id\}`\}/);
  assert.match(studio, /hidden=\{!selected\}/);
  assert.match(studio, /role="group"/);
  assert.match(studio, /aria-pressed=\{selected\}/);
  assert.doesNotMatch(studio, /role="radiogroup"/);
  assert.match(studio, /"ArrowRight"/);
  assert.match(studio, /"ArrowLeft"/);
  assert.match(studio, /"Home"/);
  assert.match(studio, /"End"/);
  assert.match(studio, /STUDIO_STORAGE_KEY/);
  assert.match(studio, /isStudioRecord/);
  assert.match(studio, /window\.localStorage\.getItem/);
  assert.match(studio, /window\.localStorage\.setItem/);
  assert.match(studio, /0<\/b> live learner records/);
  assert.match(studio, /0<\/b> external calls/);
  assert.match(studio, /never applies, merges, publishes, or deploys a patch/);
  assert.doesNotMatch(studio, /window\.confirm/);
  assert.doesNotMatch(studio, /<svg\b/i);
  assert.doesNotMatch(studio, /dangerouslySetInnerHTML/);
  assert.match(style, /prefers-reduced-motion/);
  assert.match(style, /focus-visible/);
});

test("release architecture keeps Notion capture manual and out of the portal runtime", async () => {
  const architectureUrl = new URL("../docs/ARCHITECTURE.md", import.meta.url);
  const privacyUrl = new URL("../docs/PRIVACY.md", import.meta.url);
  const [architecture, privacy] = await Promise.all([
    readFile(architectureUrl, "utf8"),
    readFile(privacyUrl, "utf8"),
  ]);

  assert.match(architecture, /manual, learner-controlled capture only/);
  assert.match(architecture, /no Notion runtime integration or automatic/);
  assert.match(privacy, /Notion page exports, IDs, private notes, or learner journal content/);
});

test("Module 19 withholds each view's answer-bearing evidence until prediction and confidence", async () => {
  const studioUrl = new URL("../app/ConcurrencyStudio.tsx", import.meta.url);
  const studio = await readFile(studioUrl, "utf8");

  const answerSurfaces = new Map([
    ["HistoryExplorer", "metricTriptych"],
    ["LinearizationLab", "criticalSection"],
    ["CoordinationConsole", "coordinationInstrument"],
    ["ProgressLaboratory", "progressBuilder"],
    ["ModelChooser", "modelRecommendation"],
    ["EvidenceAuditor", "digestGate"],
  ]);
  for (const [componentName, answerSurface] of answerSurfaces) {
    const component = extractFunctionSource(studio, componentName);
    assertPredictionGated(component, componentName);
    assert.match(
      component,
      /<table/,
      `${componentName} supplies a text/table equivalent`,
    );
    assert.ok(
      component.indexOf(`styles.${answerSurface}`) >
        component.indexOf("!answer.revealed"),
      `${componentName}'s ${answerSurface} appears only in the post-reveal branch`,
    );
  }

  assert.equal(
    [...studio.matchAll(/<PredictionGate\b/gu)].length,
    6,
    "every view has exactly one prediction gate",
  );
  assert.equal(
    [...studio.matchAll(/<EvidenceLock\b/gu)].length,
    6,
    "every view has exactly one pre-reveal evidence cover",
  );

  const history = extractFunctionSource(studio, "HistoryExplorer");
  const linearization = extractFunctionSource(studio, "LinearizationLab");
  const coordination = extractFunctionSource(studio, "CoordinationConsole");
  assert.equal(
    [...history.matchAll(/<CheckpointGate\b/gu)].length,
    2,
    "history results and the 20-schedule census each need their own prediction checkpoint",
  );
  assert.match(history, /historyEvidenceRevealed/);
  assert.match(history, /historyCensusCheckpoint/);
  assert.match(history, /Commit this history prediction/);
  assert.match(history, /Commit the census prediction/);
  assert.equal(
    [...linearization.matchAll(/<CheckpointGate\b/gu)].length,
    1,
    "linearization needs a failing-history and point checkpoint",
  );
  assert.match(linearization, /linearizationEvidenceRevealed/);
  assert.match(linearization, /failing history/i);
  assert.match(linearization, /Where can this chosen protocol linearize/i);
  assert.equal(
    [...coordination.matchAll(/<CheckpointGate\b/gu)].length,
    1,
    "wake, queue, join, and shutdown actions share an action-specific checkpoint",
  );
  assert.match(coordination, /GATED_COORDINATION_ACTIONS/);
  assert.match(coordination, /coordinationPendingAction/);
  assert.match(coordination, /outcome, governing fact, and confidence/i);
});

test("Module 19 history explorer uses the shared postings fixture and all 20 legal schedules", async () => {
  const studioUrl = new URL("../app/ConcurrencyStudio.tsx", import.meta.url);
  const studio = await readFile(studioUrl, "utf8");
  const history = extractFunctionSource(studio, "HistoryExplorer");
  const enumerator = extractFunctionSource(
    studio,
    "enumerateTwoWorkerSchedules",
  );
  const tracer = extractFunctionSource(studio, "traceHistory");

  assert.match(history, /term(?:\s+is|:)\s*["“]?graph/i);
  assert.match(history, /postings[\s\S]*?\(1,\)/i);
  assert.match(history, /Partition A[\s\S]*?document 2/i);
  assert.match(history, /partition B[\s\S]*?document 3/i);
  assert.match(history, /\(1, 2, 3\)/);

  assert.match(enumerator, /aCount === 3 && bCount === 3/);
  assert.match(enumerator, /aCount < 3/);
  assert.match(enumerator, /bCount < 3/);
  assert.match(studio, /const ALL_TWO_WORKER_SCHEDULES = enumerateTwoWorkerSchedules\(\)/);
  assert.match(history, /ALL_TWO_WORKER_SCHEDULES\.map/);
  assert.match(history, /All 20 legal schedules and explored-state record/);
  assert.match(history, /record\.completedHistories/);
  assert.match(history, /Next A/);
  assert.match(history, /Next B/);
  assert.match(history, /aria-label="Choose the next enabled worker"/);
  assert.match(history, /role="group"/);
  assert.match(history, /serial-equivalent/i);
  assert.match(history, /violating/i);

  assert.match(tracer, /let shared = \[1\]/);
  assert.match(tracer, /postings\.length === 1/);
  assert.match(tracer, /worker === "A" \? 2 : 3/);
  assert.match(tracer, /oracle: "\(1, 2, 3\)"/);
  assert.match(tracer, /schedule\.length === 6/);
});

test("Module 19 keeps coordination lifecycle facts and terminal classifications distinct", async () => {
  const studioUrl = new URL("../app/ConcurrencyStudio.tsx", import.meta.url);
  const studio = await readFile(studioUrl, "utf8");
  const coordination = extractFunctionSource(studio, "CoordinationConsole");
  const applyAction = extractFunctionSource(studio, "applyCoordinationAction");
  const evidence = extractFunctionSource(studio, "EvidenceAuditor");

  for (const action of [
    "put",
    "get",
    "wait",
    "notify",
    "task_done",
    "join",
    "stop",
  ]) {
    assert.match(coordination, new RegExp(`["\`]${action}["\`]`), action);
  }
  for (const fact of [
    "Lock owner",
    "Queue contents",
    "Unfinished",
    "In flight",
    "Terminal",
    "Reduction gate",
  ]) {
    assert.match(coordination, new RegExp(fact, "i"), fact);
  }
  assert.match(coordination, /PARTIAL_READY[\s\S]{0,120}preterminal/i);
  assert.doesNotMatch(
    coordination,
    /Partition terminal<\/span>[\s\S]{0,80}<strong>PARTIAL_READY<\/strong>/,
    "PARTIAL_READY must not be labeled terminal",
  );
  assert.match(applyAction, /const drainedCount = next\.queue\.length/);
  assert.match(
    applyAction,
    /next\.unfinished = Math\.max\(0, next\.unfinished - drainedCount\)/,
  );
  assert.doesNotMatch(
    applyAction,
    /immediate_stop[\s\S]{0,240}next\.unfinished = 0/,
    "immediate shutdown may discard queued work but must not erase claimed work accounting",
  );
  assert.match(applyAction, /claimed task\(s\) still keep join waiting/);

  for (const state of [
    "ADMITTED",
    "ENQUEUED",
    "CLAIMED",
    "PARTIAL_READY",
    "COMMIT_STARTED",
    "COMMITTED",
    "FAILED",
    "CANCELLED",
  ]) {
    assert.match(evidence, new RegExp(`["\`]${state}["\`]`), state);
  }
  assert.match(
    evidence,
    /(?:terminal|terminals)\s*=\s*\[\s*"COMMITTED",\s*"FAILED",\s*"CANCELLED"\s*\]/,
  );
  assert.match(evidence, /PARTIAL_READY[\s\S]{0,160}preterminal/i);
  assert.match(evidence, /aria-label="[^"]*terminal[^"]*state[^"]*"/i);
});

test("Module 19 model chooser requires a complete decision record and guards native/GIL claims", async () => {
  const studioUrl = new URL("../app/ConcurrencyStudio.tsx", import.meta.url);
  const studio = await readFile(studioUrl, "utf8");
  const model = extractFunctionSource(studio, "ModelChooser");

  for (const field of [
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
    "nativeContract",
    "candidate",
    "evidencePlan",
  ]) {
    assert.match(model, new RegExp(`\\b${field}\\b`), field);
  }
  assert.match(model, /record\.modelChoice/);
  assert.match(model, /onRecordChange/);
  assert.match(model, /role="group"/);
  assert.match(model, /aria-label=/);
  assert.match(model, /recommendation[\s\S]{0,160}withheld/i);
  assert.match(model, /gil\s*===\s*"enabled"/);
  assert.match(model, /nativeContract\s*!==\s*"releases"/);
  assert.match(model, /build\s*===\s*"free-threaded"/);
  assert.match(model, /nativeContract\s*!==\s*"compatible"/);
  assert.match(model, /semantic[\s-]equivalence/i);
  assert.match(model, /speedup/i);
  assert.match(model, /documentation-only/);
});

test("Module 19 evidence auditor uses the real fixture digest and per-axis patch decisions", async () => {
  const studioUrl = new URL("../app/ConcurrencyStudio.tsx", import.meta.url);
  const studio = await readFile(studioUrl, "utf8");
  const evidence = extractFunctionSource(studio, "EvidenceAuditor");

  assert.match(evidence, /2 \/ 2 current partitions COMMITTED/);
  assert.match(evidence, /3-document snapshot/);
  assert.match(
    evidence,
    /3e2899703a3a5f16bbf6905d6ddd9b819a2e2f69ebe9fb4750f6ebda08c4da66/,
  );
  assert.doesNotMatch(evidence, /12 \/ 12|8fd2…c041/);

  for (const variant of [
    "owner",
    "shared",
    "narrow",
    "callback",
    "empty",
    "swallowed",
    "child",
    "gil",
  ]) {
    assert.match(evidence, new RegExp(`["\`]${variant}["\`]`), variant);
  }
  for (const axis of [
    "Behavior",
    "Tests",
    "Portability",
    "Progress",
    "Model fit",
    "Documentation",
  ]) {
    assert.match(studio, new RegExp(`label: ["\`]${axis}["\`]`), axis);
  }
  assert.match(evidence, /PATCH_AXES\.map/);
  assert.match(evidence, /record\.patchDecisions\[axis\.id\]/);
  assert.match(evidence, /\["accept", "reject", "split"\] as const/);
  assert.match(evidence, /aria-label="[^"]*patch[^"]*decision/i);
  assert.match(evidence, /Copy instructor brief/i);
  assert.match(evidence, /What this proves/);
  assert.match(evidence, /What remains unknown/);
});

test("Module 19 persists the bounded learning record and resets view-specific simulators", async () => {
  const studioUrl = new URL("../app/ConcurrencyStudio.tsx", import.meta.url);
  const studio = await readFile(studioUrl, "utf8");
  const root = extractFunctionSource(studio, "ConcurrencyStudio");

  assert.match(studio, /STUDIO_STORAGE_KEY/);
  assert.match(studio, /window\.localStorage\.getItem/);
  assert.match(studio, /window\.localStorage\.setItem/);
  assert.match(studio, /window\.localStorage\.removeItem/);
  assert.match(studio, /function clearStoredStudio/);
  assert.match(studio, /predictionSets\[view\.id\]\.options\.some/);
  assert.match(studio, /savedPrediction !== null/);
  assert.match(root, /useState<StudioRecord>\(initialRecord\)/);
  assert.match(root, /setRecord\(sanitizeStudioRecord\(stored\.record\)\)/);
  assert.match(root, /record,/);
  assert.match(root, /misconceptions:\s*misconceptionLabels\(answers\)/);
  assert.match(root, /activeView,/);
  assert.match(root, /answers:\s*safeAnswers/);

  const persistedAnswers = root.slice(
    root.indexOf("const safeAnswers"),
    root.indexOf("window.localStorage.setItem"),
  );
  assert.doesNotMatch(
    persistedAnswers,
    /revision/,
    "free-form revision text must stay out of localStorage",
  );

  assert.match(studio, /Reset saved studio/);
  assert.match(studio, /Reset this view/);
  assert.match(root, /const resetView = \(\) =>/);
  for (const viewState of [
    "historySchedule",
    "completedHistories",
    "historyCheckpoint",
    "historyCensusCheckpoint",
    "linearizationPatch",
    "protectedSteps",
    "linearizationCheckpoint",
    "coordinationInstrument",
    "coordinationActions",
    "coordinationPendingAction",
    "coordinationCheckpoint",
    "progressScenario",
    "progressEdges",
    "modelChoice",
    "evidenceVariant",
    "patchDecisions",
  ]) {
    assert.match(
      root.slice(root.indexOf("const resetView"), root.indexOf("const resetStudio")),
      new RegExp(`\\b${viewState}\\b`),
      `view reset covers ${viewState}`,
    );
  }
  assert.match(root, /setRecord\(initialRecord\(\)\)/);
  assert.match(root, /setActiveView\("history"\)/);
  assert.match(root, /<RuntimeProfilePlate \/>/);
  assert.match(studio, /module19-concurrency-studio\.v2/);
  assert.match(root, /stored\.version === 2/);
});

test("generated module manifest covers Modules 1–26 exactly once", async () => {
  const manifestUrl = new URL("../content/modules/manifest.json", import.meta.url);
  const manifest = JSON.parse(await readFile(manifestUrl, "utf8"));
  const numbers = manifest.modules.map((courseModule) => courseModule.number);
  const slugs = manifest.modules.map((courseModule) => courseModule.slug);

  assert.equal(manifest.schemaVersion, 1);
  assert.equal(manifest.moduleCount, 26);
  assert.deepEqual(
    numbers,
    Array.from({ length: 26 }, (_, index) => index + 1),
  );
  assert.equal(new Set(slugs).size, 26);
  assert.equal(manifest.arcs.length, 5);

  const module16 = manifest.modules.find((courseModule) => courseModule.number === 16);
  const module17 = manifest.modules.find((courseModule) => courseModule.number === 17);
  const module18 = manifest.modules.find((courseModule) => courseModule.number === 18);
  const module19 = manifest.modules.find((courseModule) => courseModule.number === 19);
  const module20 = manifest.modules.find((courseModule) => courseModule.number === 20);
  const module21 = manifest.modules.find((courseModule) => courseModule.number === 21);
  const module22 = manifest.modules.find((courseModule) => courseModule.number === 22);
  const module23 = manifest.modules.find((courseModule) => courseModule.number === 23);
  const module24 = manifest.modules.find((courseModule) => courseModule.number === 24);
  const module25 = manifest.modules.find((courseModule) => courseModule.number === 25);
  const module26 = manifest.modules.find((courseModule) => courseModule.number === 26);
  assert.equal(module17.arcId, "arc-iv");
  assert.equal(module18.arcId, "arc-iv");
  assert.equal(module19.arcId, "arc-iv");
  assert.equal(module16.nextSlug, module17.slug);
  assert.equal(module17.previousSlug, module16.slug);
  assert.equal(module17.prerequisiteSlug, module16.slug);
  assert.equal(module17.nextSlug, module18.slug);
  assert.equal(module18.previousSlug, module17.slug);
  assert.equal(module18.prerequisiteSlug, module17.slug);
  assert.equal(module18.nextSlug, module19.slug);
  assert.equal(module19.previousSlug, module18.slug);
  assert.equal(module19.prerequisiteSlug, module18.slug);
  assert.equal(module19.nextSlug, module20.slug);
  assert.equal(module20.previousSlug, module19.slug);
  assert.equal(module20.prerequisiteSlug, module19.slug);
  assert.equal(module20.nextSlug, module21.slug);
  assert.equal(module21.previousSlug, module20.slug);
  assert.equal(module21.prerequisiteSlug, module20.slug);
  assert.equal(module21.nextSlug, module22.slug);
  assert.equal(module22.previousSlug, module21.slug);
  assert.equal(module22.prerequisiteSlug, module21.slug);
  assert.equal(module22.nextSlug, module23.slug);
  assert.equal(module23.arcId, "arc-v");
  assert.equal(module23.previousSlug, module22.slug);
  assert.equal(module23.prerequisiteSlug, module22.slug);
  assert.equal(module23.nextSlug, module24.slug);
  assert.equal(module24.arcId, "arc-v");
  assert.equal(module24.previousSlug, module23.slug);
  assert.equal(module24.prerequisiteSlug, module23.slug);
  assert.equal(module24.nextSlug, module25.slug);
  assert.equal(module25.arcId, "arc-v");
  assert.equal(module25.previousSlug, module24.slug);
  assert.equal(module25.prerequisiteSlug, module24.slug);
  assert.equal(module25.nextSlug, module26.slug);
  assert.equal(module26.arcId, "arc-v");
  assert.equal(module26.previousSlug, module25.slug);
  assert.equal(module26.prerequisiteSlug, module25.slug);
  assert.equal(module26.nextSlug, null);
});

test("module synchronization normalizes checkout line endings before fingerprinting content", async () => {
  const syncUrl = new URL("../scripts/sync-modules.mjs", import.meta.url);
  const synchronizer = await readFile(syncUrl, "utf8");

  assert.match(synchronizer, /function normalizeNewlines\(value\)/);
  assert.match(synchronizer, /value\.replace\(\/\\r\\n\?\/gu, "\\n"\)/);
  assert.match(synchronizer, /normalizeNewlines\(current\) === normalizedContent/);
  assert.match(
    synchronizer,
    /const markdown = normalizeNewlines\(\s*await readFile\(join\(sourceDirectory, filename\), "utf8"\),\s*\);/,
  );
});

test("table-of-contents IDs account for lower-level heading collisions", () => {
  const markdown = [
    "## Start",
    "#### Repeated label",
    "## Repeated label",
    "### APIs named `__all__` and `_grow`",
    "```markdown",
    "##### Repeated label",
    "```",
    "### Finish",
  ].join("\n");

  assert.deepEqual(extractTableOfContents(markdown), [
    { id: "start", title: "Start", depth: 2 },
    { id: "repeated-label-1", title: "Repeated label", depth: 2 },
    {
      id: "apis-named-__all__-and-_grow",
      title: "APIs named __all__ and _grow",
      depth: 3,
    },
    { id: "finish", title: "Finish", depth: 3 },
  ]);
});

test("renders the arc-grouped course library", async () => {
  const response = await render("/modules");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /One course\./);
  assert.match(html, /Every connection visible\./);
  assert.match(html, /Computation &amp; reasoning/);
  assert.match(html, /Data &amp; algorithms/);
  assert.match(html, /Durable software/);
  assert.match(html, /Machine &amp; network/);
  assert.match(html, /Languages &amp; intelligence/);
  assert.match(html, /Values, State, and Execution/);
  assert.match(html, /Relational Data and Transactions/);
  assert.match(html, /Computer Architecture and the Execution Stack/);
  assert.match(html, /Operating Systems and Resource Mediation/);
  assert.match(html, /Concurrency and Parallelism/);
  assert.match(html, /Networks and Application Protocols/);
  assert.match(html, /Async and Distributed Systems/);
  assert.match(html, /Security, Privacy &amp; Trust Boundaries/);
  assert.match(html, /Programming Languages, Interpreters &amp; Bounded Evaluation/);
  assert.match(html, /CPython, Performance &amp; Memory Evidence/);
  assert.match(html, /Evidence-Grounded Intelligent &amp; Human-Centered Systems/);
  assert.match(html, /Systems Capstone, Open-Source Stewardship &amp; Oral Architecture Defense/);
  assert.match(html, /<dt>26<\/dt>/);
});

test("renders a complete generated module reading route", async () => {
  const response = await render("/modules/01-values-state-execution");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /Module 1: Values, State, and Execution · Atlas Academy/);
  assert.match(html, /Complete Module 1 workbook/);
  assert.match(html, /Why this module comes first/);
  assert.match(html, /On this page/);
  assert.match(html, /Foundation placement studio and learning brief/);
  assert.match(html, /role="progressbar"/);
  assert.match(html, /aria-valuemin="0"/);
  assert.match(html, /aria-valuemax="100"/);
  assert.match(html, /Diagram source and text fallback/);
  assert.match(html, /class="lesson-table-scroll"/);
  assert.doesNotMatch(html, /aria-label="Scrollable lesson table"/);
  assert.match(html, /Canonical workbook snapshot/);
  assert.match(html, /class="heading-anchor"/);
  assert.match(html, /aria-label="Link to this section"/);
  assert.match(
    html,
    /aria-hidden="true" class="external-link-mark">↗<\/span>/,
  );
});

test("all generated lessons have valid internal links and math", async () => {
  const manifestUrl = new URL("../content/modules/manifest.json", import.meta.url);
  const manifest = JSON.parse(await readFile(manifestUrl, "utf8"));

  for (const courseModule of manifest.modules) {
    const response = await render(`/modules/${courseModule.slug}`);
    assert.equal(response.status, 200, courseModule.slug);

    const html = await response.text();
    const ids = new Set(
      [...html.matchAll(/\sid="([^"]+)"/gu)].map((match) => match[1]),
    );
    const fragments = [
      ...html.matchAll(/\shref="#([^"]+)"/gu),
    ].map((match) => match[1]);

    assert.doesNotMatch(html, /katex-error/, courseModule.slug);
    for (const fragment of fragments) {
      assert.ok(
        ids.has(fragment),
        `${courseModule.slug} links to missing #${fragment}`,
      );
    }
  }
});

test("every diagnostic learning route resolves to a published lesson section", async () => {
  const routesByPath = new Map();
  for (const question of diagnosticQuestions) {
    const route = new URL(question.route.href, "http://localhost");
    const routes = routesByPath.get(route.pathname) ?? [];
    routes.push({
      fragment: decodeURIComponent(route.hash.slice(1)),
      questionId: question.id,
    });
    routesByPath.set(route.pathname, routes);
  }

  for (const [pathname, routes] of routesByPath) {
    const response = await render(pathname);
    assert.equal(response.status, 200, pathname);
    const html = await response.text();
    const ids = new Set(
      [...html.matchAll(/\sid="([^"]+)"/gu)].map((match) => match[1]),
    );
    for (const route of routes) {
      assert.ok(
        ids.has(route.fragment),
        `${route.questionId} links to missing ${pathname}#${route.fragment}`,
      );
    }
  }
});

test("renders the finalized relational-transactions workbook", async () => {
  const response = await render("/modules/16-relational-data-transactions");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /Module 16: Relational Data and Transactions · Atlas Academy/);
  assert.match(html, /Complete Module 16 workbook/);
  assert.match(html, /Relations, identity, functional dependencies, and normalization/);
  assert.match(html, /Runnable Atlas repository reference and adversarial checks/);
  assert.match(html, /ImportValidatedBundle/);
  assert.match(html, /SqliteEventRepository/);
  assert.match(html, /WAL, recovery, backup, and bounded durability claims/);
  assert.match(html, /Question 8 — Commit, retry, WAL, and backup/);
  assert.match(html, /class="katex-display"/);
  assert.doesNotMatch(html, /katex-error/);
});

test("renders the finalized computer-architecture workbook", async () => {
  const response = await render(
    "/modules/17-computer-architecture-execution-stack",
  );
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(
    html,
    /Module 17: Computer Architecture and the Execution Stack · Atlas Academy/,
  );
  assert.match(html, /Complete Module 17 workbook/);
  assert.match(html, /Bits, width, signedness, and byte order/);
  assert.match(html, /ISA state and the load\/store contract/);
  assert.match(html, /Memory hierarchy, cache lines, and locality/);
  assert.match(html, /I\/O is a boundary, not a single transfer/);
  assert.match(html, /Runnable Atlas architecture evidence reference/);
  assert.match(html, /count_due/);
  assert.match(html, /not the host CPU cache/);
  assert.match(html, /href="\/downloads\/module17_reference\.py"/);
  assert.match(html, /Question 8 — Benchmark evidence and causal claims/);
  assert.match(html, /class="katex-display"/);
  assert.doesNotMatch(html, /katex-error/);

  const referenceUrl = new URL(
    "../public/downloads/module17_reference.py",
    import.meta.url,
  );
  const reference = await readFile(referenceUrl, "utf8");
  assert.match(reference, /atlas\.module17\.architecture-evidence\.v2/);
  assert.match(reference, /first-timed-block-for-condition/);
  assert.doesNotMatch(reference, /tracemalloc|sys\.getsizeof/);
});

test("renders the finalized operating-systems workbook", async () => {
  const response = await render(
    "/modules/18-operating-systems-resource-mediation",
  );
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(
    html,
    /Module 18: Operating Systems and Resource Mediation · Atlas Academy/,
  );
  assert.match(html, /Complete Module 18 workbook/);
  assert.match(html, /Finite resources force a mediator/);
  assert.match(html, /A program becomes a process/);
  assert.match(html, /Virtual memory: the private-address-space illusion/);
  assert.match(
    html,
    /Files are names, open resources, caches, and persistence protocols/,
  );
  assert.match(html, /Interruption and shutdown/);
  assert.match(html, /Runnable Atlas operating-systems reference/);
  assert.match(html, /Six connected teaching sessions/);
  assert.match(html, /Eight-level problem ladder/);
  assert.match(html, /Confidence-aware understanding check/);
  assert.match(html, /Cumulative project, TA protocol, and mastery evidence/);
  assert.match(html, /Explicit backward and forward connections/);
  assert.match(
    html,
    /Source ledger, licensing, claim boundaries, and freshness/,
  );
  assert.match(html, /href="\/downloads\/module18_reference\.py"/);
  assert.match(html, /href="\/downloads\/test_module18_reference\.py"/);
  assert.match(html, /class="katex-display"/);
  assert.doesNotMatch(html, /katex-error/);

  const referenceUrl = new URL(
    "../public/downloads/module18_reference.py",
    import.meta.url,
  );
  const reference = await readFile(referenceUrl, "utf8");
  const testsUrl = new URL(
    "../public/downloads/test_module18_reference.py",
    import.meta.url,
  );
  const referenceTests = await readFile(testsUrl, "utf8");
  assert.match(reference, /atlas\.module18\.os-evidence\.v1/);
  assert.match(reference, /phase_observations/);
  assert.match(reference, /artifact_observations/);
  assert.match(reference, /runtime_profile/);
  assert.match(reference, /claim_boundaries/);
  assert.match(reference, /WORKER_PHASE_EDGES = frozenset/);
  assert.match(reference, /status = "INVALID_MAPPING"/);
  assert.match(reference, /valid_mapping=valid_mapping/);
  assert.match(reference, /file_backed=file_backed/);
  assert.match(reference, /exceeds-bounded-read-limit/);
  assert.doesNotMatch(
    reference,
    /(?:^|\n)\s*(?:from|import)\s+(?:threading|multiprocessing|socket|tracemalloc|gc)\b/,
  );
  assert.match(referenceTests, /import module18_reference as reference/);
  assert.match(referenceTests, /\("STARTED", "VALIDATED"\)/);
  assert.match(referenceTests, /"INVALID_MAPPING"/);
  assert.match(referenceTests, /oversized-foreign\.tmp/);
  assert.match(referenceTests, /Module18ReferenceTests/);
});

test("renders the finalized concurrency-and-parallelism workbook", async () => {
  const response = await render("/modules/19-concurrency-parallelism");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(
    html,
    /Module 19: Concurrency and Parallelism · Atlas Academy/,
  );
  assert.match(html, /Complete Module 19 workbook/);
  assert.match(html, /A second worker creates histories/);
  assert.match(html, /Protect one logical transition/);
  assert.match(html, /Predicates, permits, and item ownership/);
  assert.match(html, /Progress can fail/);
  assert.match(html, /Choose the Python execution model from first principles/);
  assert.match(html, /Atlas multi-worker evidence defense/);
  assert.match(html, /Eight-level problem ladder/);
  assert.match(html, /Confidence-aware understanding check/);
  assert.match(html, /TA Studio A — History and linearization coroner/);
  assert.match(html, /TA Studio B — Coordination and progress clinic/);
  assert.match(html, /TA Studio C — Execution-model and agent-patch defense/);
  assert.match(html, /href="\/downloads\/module19_reference\.py"/);
  assert.match(html, /href="\/downloads\/test_module19_reference\.py"/);
  assert.doesNotMatch(html, /katex-error/);

  const referenceUrl = new URL(
    "../public/downloads/module19_reference.py",
    import.meta.url,
  );
  const reference = await readFile(referenceUrl, "utf8");
  const testsUrl = new URL(
    "../public/downloads/test_module19_reference.py",
    import.meta.url,
  );
  const referenceTests = await readFile(testsUrl, "utf8");
  assert.match(reference, /atlas\.module19-evidence\.v1/);
  assert.match(reference, /explore_two_increment_schedules/);
  assert.match(reference, /explore_locked_increment_schedules/);
  assert.match(reference, /analyze_lock_orders/);
  assert.match(reference, /run_indexer/);
  assert.match(reference, /runtime_concurrency_profile/);
  assert.match(reference, /choose_execution_model/);
  assert.match(reference, /classify_stop_action/);
  assert.match(reference, /observed_completion_order/);
  assert.match(reference, /commit_order/);
  assert.match(reference, /cancellation_causes/);
  assert.match(referenceTests, /import module19_reference as reference/);
  assert.match(referenceTests, /Module19ReferenceTests/);
});

test("renders the finalized networks-and-application-protocols workbook", async () => {
  const response = await render("/modules/20-networks-application-protocols");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(
    html,
    /Module 20: Networks and Application Protocols · Atlas Academy/,
  );
  assert.match(html, /Complete Module 20 workbook/);
  assert.match(html, /Protocol observatory/);
  assert.match(html, /Cross the boundary\./);
  assert.match(html, /A name is not a remote effect/);
  assert.match(html, /Transport carries bytes, not your request/);
  assert.match(html, /A response is evidence with a scope/);
  assert.match(html, /HTTP gives semantics; Atlas still owns policy/);
  assert.match(html, /Retry is an epistemic problem before it is a loop/);
  assert.match(html, /Make network knowledge auditable/);
  assert.match(html, /Eight-level problem ladder/);
  assert.match(html, /Confidence-aware understanding check/);
  assert.match(html, /TA Studio A — Framing coroner/);
  assert.match(html, /TA Studio B — Timeout incident board/);
  assert.match(html, /TA Studio C — Agent patch and evidence clinic/);
  assert.match(html, /Atlas remote-publication protocol dossier/);
  assert.match(html, /href="\/downloads\/module20_reference\.py"/);
  assert.match(html, /href="\/downloads\/test_module20_reference\.py"/);
  assert.doesNotMatch(html, /katex-error/);

  const referenceUrl = new URL(
    "../public/downloads/module20_reference.py",
    import.meta.url,
  );
  const testsUrl = new URL(
    "../public/downloads/test_module20_reference.py",
    import.meta.url,
  );
  const [reference, referenceTests] = await Promise.all([
    readFile(referenceUrl, "utf8"),
    readFile(testsUrl, "utf8"),
  ]);
  assert.match(reference, /class FrameDecoder/);
  assert.match(reference, /class AtlasPublicationServer/);
  assert.match(reference, /class IdempotencyLedger/);
  assert.match(reference, /atlas\.module20\.evidence\/1/);
  assert.match(reference, /timeout_then_lookup/);
  assert.doesNotMatch(
    reference,
    /(?:^|\n)\s*(?:from|import)\s+(?:socket|requests|urllib|http\.client)\b/,
  );
  assert.match(referenceTests, /import module20_reference as reference/);
  assert.match(referenceTests, /Module20ReferenceTests/);
  assert.match(
    referenceTests,
    /test_every_two_chunk_partition_reaches_the_ledger_only_after_one_frame/,
  );
});

test("renders the finalized async-and-distributed-systems workbook", async () => {
  const response = await render("/modules/21-async-distributed-systems");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(
    html,
    /Module 21: Async and Distributed Systems · Atlas Academy/,
  );
  assert.match(html, /Complete Module 21 workbook/);
  assert.match(html, /Atlas Run Control Room/);
  assert.match(html, /await releases control; it does not transfer responsibility/);
  assert.match(html, /Structured lifetime gives a boundary, not magic rollback/);
  assert.match(html, /Bounded admission makes overload a policy decision/);
  assert.match(html, /Partial failure is an evidence problem before it is retry code/);
  assert.match(html, /Time is a local instrument; order is a declared relation/);
  assert.match(html, /Consistency and availability are choices with assumptions/);
  assert.match(html, /Eight-level problem ladder/);
  assert.match(html, /Atlas async collector evidence dossier/);
  assert.match(html, /Task-lifetime coroner/);
  assert.match(html, /href="\/downloads\/module21_reference\.py"/);
  assert.match(html, /href="\/downloads\/test_module21_reference\.py"/);
  assert.doesNotMatch(html, /katex-error/);

  const referenceUrl = new URL(
    "../public/downloads/module21_reference.py",
    import.meta.url,
  );
  const testsUrl = new URL(
    "../public/downloads/test_module21_reference.py",
    import.meta.url,
  );
  const [reference, referenceTests] = await Promise.all([
    readFile(referenceUrl, "utf8"),
    readFile(testsUrl, "utf8"),
  ]);
  assert.match(reference, /class AtlasAsyncCollector/);
  assert.match(reference, /class CausalLedger/);
  assert.match(reference, /read_scripted_frame/);
  assert.match(reference, /atlas\.module21\.evidence\/1/);
  assert.match(reference, /timeout_then_reconcile/);
  assert.match(reference, /not a distributed-system proof/);
  assert.doesNotMatch(
    reference,
    /(?:^|\n)\s*(?:from|import)\s+(?:socket|requests|urllib|http\.client)\b/,
  );
  assert.match(referenceTests, /import module21_reference as reference/);
  assert.match(referenceTests, /Module21ReferenceTests/);
  assert.match(referenceTests, /test_taskgroup_failure_probe_states_only_the_owned_local_scope_boundary/);
});

test("renders the finalized security-privacy-and-trust-boundaries workbook", async () => {
  const response = await render("/modules/22-security-privacy-trust-boundaries");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(
    html,
    /Module 22: Security, Privacy &amp; Trust Boundaries · Atlas Academy/,
  );
  assert.match(html, /Complete Module 22 workbook/);
  assert.match(html, /Atlas Trust Control Room/);
  assert.match(html, /Trust-boundary atlas/);
  assert.match(html, /Identity-to-decision ladder/);
  assert.match(html, /Data-to-authority pipeline/);
  assert.match(html, /Cryptographic purpose map/);
  assert.match(html, /Release provenance and human impact/);
  assert.match(html, /Privacy-aware incident reconstruction/);
  assert.match(html, /Eight-level problem ladder/);
  assert.match(html, /Atlas Trust &amp; Release Dossier/);
  assert.match(html, /TA intake rule/);
  assert.match(html, /href="\/downloads\/module22_reference\.py"/);
  assert.match(html, /href="\/downloads\/test_module22_reference\.py"/);
  assert.doesNotMatch(html, /katex-error/);

  const referenceUrl = new URL(
    "../public/downloads/module22_reference.py",
    import.meta.url,
  );
  const testsUrl = new URL(
    "../public/downloads/test_module22_reference.py",
    import.meta.url,
  );
  const [reference, referenceTests] = await Promise.all([
    readFile(referenceUrl, "utf8"),
    readFile(testsUrl, "utf8"),
  ]);
  assert.match(reference, /atlas\.module22\.evidence\/1/);
  assert.match(reference, /class ParsedImporterRequest/);
  assert.match(reference, /class RedactedEvidencePacket/);
  assert.match(reference, /incident_unknown/);
  assert.match(reference, /not a live security assessment/);
  assert.doesNotMatch(
    reference,
    /(?:^|\n)\s*(?:from|import)\s+(?:socket|requests|urllib|http\.client|subprocess|pickle|marshal|sqlite3|tarfile|zipfile)\b/,
  );
  assert.match(referenceTests, /import module22_reference as model/);
  assert.match(referenceTests, /ArchivePolicySeamTests/);
  assert.match(
    referenceTests,
    /test_all_scenarios_emit_the_closed_evidence_schema/,
  );
});

test("renders the finalized programming-languages-and-bounded-evaluation workbook", async () => {
  const response = await render("/modules/23-programming-languages-interpreters");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(
    html,
    /Module 23: Programming Languages, Interpreters &amp; Bounded Evaluation · Atlas Academy/,
  );
  assert.match(html, /Complete Module 23 workbook/);
  assert.match(html, /Atlas Language Lab/);
  assert.match(html, /Text → tree/);
  assert.match(html, /Contract → capability/);
  assert.match(html, /Structure is data; authority is separate and explicit/);
  assert.match(html, /Eight-level problem ladder/);
  assert.match(html, /Atlas Query Language Dossier/);
  assert.match(html, /href="\/downloads\/module23_reference\.py"/);
  assert.match(html, /href="\/downloads\/test_module23_reference\.py"/);
  assert.doesNotMatch(html, /katex-error/);

  const referenceUrl = new URL(
    "../public/downloads/module23_reference.py",
    import.meta.url,
  );
  const testsUrl = new URL(
    "../public/downloads/test_module23_reference.py",
    import.meta.url,
  );
  const [reference, referenceTests] = await Promise.all([
    readFile(referenceUrl, "utf8"),
    readFile(testsUrl, "utf8"),
  ]);
  assert.match(reference, /def lex_query/);
  assert.match(reference, /def parse_query/);
  assert.match(reference, /def validate_query/);
  assert.match(reference, /def run_scenario/);
  assert.match(reference, /def trusted_compilation_bridge/);
  assert.match(reference, /SCENARIOS/);
  assert.doesNotMatch(
    reference,
    /(?:^|\n)\s*(?:from|import)\s+(?:socket|requests|urllib|http\.client|subprocess|pickle|marshal|sqlite3|tarfile|zipfile)\b/,
  );
  assert.match(referenceTests, /import module23_reference as model/);
  assert.match(referenceTests, /ContractAuthorityCapabilitySeamTests/);
  assert.match(
    referenceTests,
    /test_reference_model_has_no_dynamic_execution_or_external_adapter_surface/,
  );
});

test("renders the finalized CPython-performance-and-memory-evidence workbook", async () => {
  const response = await render("/modules/24-cpython-performance-memory");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(
    html,
    /Module 24: CPython, Performance &amp; Memory Evidence · Atlas Academy/,
  );
  assert.match(html, /Complete Module 24 workbook/);
  assert.match(html, /Runtime Evidence Observatory/);
  assert.match(html, /Contract → claim/);
  assert.match(html, /Names → graph/);
  assert.match(html, /Patch → decision/);
  assert.match(html, /A cache is data retention and authority design, not a neutral speed/);
  assert.match(html, /Problem ladder and Atlas project/);
  assert.match(html, /Runtime Evidence Dossier/);
  assert.match(html, /href="\/downloads\/module24_reference\.py"/);
  assert.match(html, /href="\/downloads\/test_module24_reference\.py"/);
  assert.doesNotMatch(html, /katex-error/);

  const referenceUrl = new URL(
    "../public/downloads/module24_reference.py",
    import.meta.url,
  );
  const testsUrl = new URL(
    "../public/downloads/test_module24_reference.py",
    import.meta.url,
  );
  const [reference, referenceTests] = await Promise.all([
    readFile(referenceUrl, "utf8"),
    readFile(testsUrl, "utf8"),
  ]);
  assert.match(reference, /def reachable_nodes/);
  assert.match(reference, /def reference_count_sweep/);
  assert.match(reference, /def classify_observation/);
  assert.match(reference, /def validate_experiment/);
  assert.match(reference, /def validate_conclusion/);
  assert.match(reference, /SCENARIOS/);
  assert.doesNotMatch(
    reference,
    /(?:^|\n)\s*(?:from|import)\s+(?:socket|requests|urllib|http\.client|subprocess|pickle|marshal|sqlite3|tarfile|zipfile)\b/,
  );
  assert.match(referenceTests, /import module24_reference as model/);
  assert.match(referenceTests, /ObjectGraphSeamTests/);
  assert.match(
    referenceTests,
    /test_unknown_scenario_does_not_accept_dynamic_input/,
  );
});

test("renders the finalized evidence-grounded-intelligent-systems workbook", async () => {
  const response = await render("/modules/25-evidence-grounded-intelligent-systems");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(
    html,
    /Module 25: Evidence-Grounded Intelligent &amp; Human-Centered Systems · Atlas Academy/,
  );
  assert.match(html, /Complete Module 25 workbook/);
  assert.match(html, /Next-Step Evidence Studio/);
  assert.match(html, /Purpose → boundary/);
  assert.match(html, /Proposal → review/);
  assert.match(html, /A score never silently changes learner state/);
  assert.match(html, /Problem ladder and Atlas project/);
  assert.match(html, /Next-Step Evidence Dossier/);
  assert.match(html, /href="\/downloads\/module25_reference\.py"/);
  assert.match(html, /href="\/downloads\/test_module25_reference\.py"/);
  assert.doesNotMatch(html, /katex-error/);

  const referenceUrl = new URL(
    "../public/downloads/module25_reference.py",
    import.meta.url,
  );
  const testsUrl = new URL(
    "../public/downloads/test_module25_reference.py",
    import.meta.url,
  );
  const [reference, referenceTests] = await Promise.all([
    readFile(referenceUrl, "utf8"),
    readFile(testsUrl, "utf8"),
  ]);
  assert.match(reference, /def validate_contract/);
  assert.match(reference, /def rank_transparent_baseline/);
  assert.match(reference, /def validate_training_rows/);
  assert.match(reference, /def evaluate_held_out/);
  assert.match(reference, /def review_agent_proposal/);
  assert.match(reference, /SCENARIOS/);
  assert.doesNotMatch(
    reference,
    /(?:^|\n)\s*(?:from|import)\s+(?:socket|requests|urllib|http\.client|subprocess|pickle|marshal|sqlite3|tarfile|zipfile)\b/,
  );
  assert.match(referenceTests, /import module25_reference as model/);
  assert.match(referenceTests, /DecisionContractSeamTests/);
  assert.match(
    referenceTests,
    /test_fixed_scenarios_cover_each_boundary_without_dynamic_input/,
  );
});

test("renders the systems-capstone workbook and publishes its bounded model", async () => {
  const response = await render("/modules/26-systems-capstone-open-source-stewardship");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(
    html,
    /Module 26: Systems Capstone, Open-Source Stewardship &amp; Oral Architecture Defense · Atlas Academy/,
  );
  assert.match(html, /Complete Module 26 workbook/);
  assert.match(html, /Make the release argument\./);
  assert.match(html, /Release Brief/);
  assert.match(html, /Failure Playback/);
  assert.match(html, /Red-Team Patch Bay/);
  assert.match(html, /Evidence Ledger/);
  assert.match(html, /A capstone release is a versioned evidence bundle/);
  assert.match(html, /Atlas Release Dossier \/ Open-Source Stewardship Track/);
  assert.match(html, /href="\/downloads\/module26_reference\.py"/);
  assert.match(html, /href="\/downloads\/test_module26_reference\.py"/);
  assert.doesNotMatch(html, /katex-error/);

  const referenceUrl = new URL(
    "../public/downloads/module26_reference.py",
    import.meta.url,
  );
  const testsUrl = new URL(
    "../public/downloads/test_module26_reference.py",
    import.meta.url,
  );
  const [reference, referenceTests] = await Promise.all([
    readFile(referenceUrl, "utf8"),
    readFile(testsUrl, "utf8"),
  ]);
  assert.match(reference, /def validate_release_contract/);
  assert.match(reference, /def trace_dependency_closure/);
  assert.match(reference, /def replay_incident/);
  assert.match(reference, /def evaluate_claim_ledger/);
  assert.match(reference, /def review_change_request/);
  assert.match(reference, /def decide_release/);
  assert.match(reference, /ALLOWED_REQUESTED_ACTIONS = frozenset\(\)/);
  assert.match(reference, /human-impact-review/);
  assert.doesNotMatch(
    reference,
    /(?:^|\n)\s*(?:from|import)\s+(?:socket|requests|urllib|http\.client|subprocess|pickle|marshal|sqlite3|tarfile|zipfile)\b/,
  );
  assert.match(referenceTests, /import module26_reference as model/);
  assert.match(referenceTests, /test_unknown_or_alias_external_action_is_a_hard_rejection/);
  assert.match(referenceTests, /test_stale_raw_claims_and_artifacts_cannot_support_the_candidate/);
  assert.match(referenceTests, /test_missing_raw_human_impact_record_requires_revision/);
});
