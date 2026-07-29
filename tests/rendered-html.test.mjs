import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
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
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});

test("generated module manifest covers Modules 1–16 exactly once", async () => {
  const manifestUrl = new URL("../content/modules/manifest.json", import.meta.url);
  const manifest = JSON.parse(await readFile(manifestUrl, "utf8"));
  const numbers = manifest.modules.map((courseModule) => courseModule.number);
  const slugs = manifest.modules.map((courseModule) => courseModule.slug);

  assert.equal(manifest.schemaVersion, 1);
  assert.equal(manifest.moduleCount, 16);
  assert.deepEqual(
    numbers,
    Array.from({ length: 16 }, (_, index) => index + 1),
  );
  assert.equal(new Set(slugs).size, 16);
  assert.equal(manifest.arcs.length, 3);
  assert.equal(manifest.modules.at(-1).nextSlug, null);
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
  assert.match(html, /Values, State, and Execution/);
  assert.match(html, /Relational Data and Transactions/);
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
  assert.match(html, /Foundation orientation and diagnostic/);
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
