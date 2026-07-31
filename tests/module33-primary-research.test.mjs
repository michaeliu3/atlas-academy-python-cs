import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function readJson(relativePath) {
  return JSON.parse(await readFile(new URL(relativePath, import.meta.url), "utf8"));
}

test("M33 primary-source research remains a bounded authoring input, not a source-map or release claim", async () => {
  const [research, graph, registry, releaseInputs] = await Promise.all([
    readFile(
      new URL(
        "../content/source-maps/module33_formal_languages_computability_complexity_source_research.md",
        import.meta.url,
      ),
      "utf8",
    ),
    readJson("../content/course/course-graph.v2.json"),
    readJson("../content/course/contracts/module-contract-registry.v3.json"),
    readJson("../content/course/release-inputs.v1.json"),
  ]);

  assert.match(research, /^# Module 33 .*Primary-Source Research/mu);
  assert.match(research, /\*\*Status:\*\* instructor-facing, \*\*authoring-only\*\* research input/u);
  assert.match(research, /It is not a learner workbook, canonical source map, structured\s+module contract,/u);
  assert.match(research, /does \*\*not\*\*\s+change the graph, manifest, reader route, navigation, availability,/u);
  assert.match(research, /## Primary\/official source ledger and reuse boundary/u);
  assert.match(research, /## Claim, assumption, and counterexample ledger/u);
  assert.match(research, /## Likely six-session source routing/u);
  assert.match(research, /## Research gaps and release blockers this file does not close/u);
  assert.match(research, /the Atlas portal and portable\s+copied prompts stay local by default\./iu);
  assert.match(
    research,
    /Do not automatically transmit a raw oral\s+transcript, voice\/audio recording, proof attempt,\s+confidence signal, or\s+implementation trace to Notion or any external service\./u,
  );
  assert.match(
    research,
    /The designated Codex\s+chats may instead write only their separate bounded concise session note under\s+the active workflow; that does not authorize a transcript\/export or prove any\s+write\./u,
  );
  assert.match(research, /A saved-note claim requires direct evidence\./u);
  for (let number = 1; number <= 7; number += 1) {
    assert.match(research, new RegExp(`\\| S33-${String(number).padStart(2, "0")} \\|`, "u"));
  }

  const m33GraphEntry = graph.modules.find(({ id }) => id === "m33");
  const contract = registry.modules.find(({ moduleId }) => moduleId === "m33");
  assert.equal(m33GraphEntry?.sourceMap, null);
  assert.equal(m33GraphEntry?.studioId, null);
  assert.deepEqual(m33GraphEntry?.state, {
    lifecycle: "authoring-only",
    readerAccess: "hidden",
    availability: "authoring-only",
    contract: { track: "advanced-v1", state: "not-started" },
    release: { state: "unrecorded", recordId: null },
  });
  assert.equal(contract?.contractState, "not-started");
  assert.ok(contract?.criteria.every(({ status }) => status === "planned"));
  assert.ok(
    !releaseInputs.inputs.some(
      ({ path }) => path === "content/source-maps/module33_formal_languages_computability_complexity_source_research.md",
    ),
  );
});
