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

test("generated module manifest covers Modules 1–18 exactly once", async () => {
  const manifestUrl = new URL("../content/modules/manifest.json", import.meta.url);
  const manifest = JSON.parse(await readFile(manifestUrl, "utf8"));
  const numbers = manifest.modules.map((courseModule) => courseModule.number);
  const slugs = manifest.modules.map((courseModule) => courseModule.slug);

  assert.equal(manifest.schemaVersion, 1);
  assert.equal(manifest.moduleCount, 18);
  assert.deepEqual(
    numbers,
    Array.from({ length: 18 }, (_, index) => index + 1),
  );
  assert.equal(new Set(slugs).size, 18);
  assert.equal(manifest.arcs.length, 4);

  const module16 = manifest.modules.find((courseModule) => courseModule.number === 16);
  const module17 = manifest.modules.find((courseModule) => courseModule.number === 17);
  const module18 = manifest.modules.find((courseModule) => courseModule.number === 18);
  assert.equal(module17.arcId, "arc-iv");
  assert.equal(module18.arcId, "arc-iv");
  assert.equal(module16.nextSlug, module17.slug);
  assert.equal(module17.previousSlug, module16.slug);
  assert.equal(module17.prerequisiteSlug, module16.slug);
  assert.equal(module17.nextSlug, module18.slug);
  assert.equal(module18.previousSlug, module17.slug);
  assert.equal(module18.prerequisiteSlug, module17.slug);
  assert.equal(module18.nextSlug, null);
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
  assert.match(html, /<dt>18<\/dt>/);
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
