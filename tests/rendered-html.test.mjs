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

test("Module 19 preserves its invariant, six-view shell, and latest-module landing", async () => {
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
  assert.match(
    arc,
    /const \[activeModule, setActiveModule\] = useState\(2\)/,
    "Arc IV should open its latest published module, Module 19",
  );

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

test("generated module manifest covers Modules 1–19 exactly once", async () => {
  const manifestUrl = new URL("../content/modules/manifest.json", import.meta.url);
  const manifest = JSON.parse(await readFile(manifestUrl, "utf8"));
  const numbers = manifest.modules.map((courseModule) => courseModule.number);
  const slugs = manifest.modules.map((courseModule) => courseModule.slug);

  assert.equal(manifest.schemaVersion, 1);
  assert.equal(manifest.moduleCount, 19);
  assert.deepEqual(
    numbers,
    Array.from({ length: 19 }, (_, index) => index + 1),
  );
  assert.equal(new Set(slugs).size, 19);
  assert.equal(manifest.arcs.length, 4);

  const module16 = manifest.modules.find((courseModule) => courseModule.number === 16);
  const module17 = manifest.modules.find((courseModule) => courseModule.number === 17);
  const module18 = manifest.modules.find((courseModule) => courseModule.number === 18);
  const module19 = manifest.modules.find((courseModule) => courseModule.number === 19);
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
  assert.equal(module19.nextSlug, null);
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
  assert.match(html, /Values, State, and Execution/);
  assert.match(html, /Relational Data and Transactions/);
  assert.match(html, /Computer Architecture and the Execution Stack/);
  assert.match(html, /Operating Systems and Resource Mediation/);
  assert.match(html, /Concurrency and Parallelism/);
  assert.match(html, /<dt>19<\/dt>/);
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
