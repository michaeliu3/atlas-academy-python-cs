import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function readJson(relativePath) {
  return JSON.parse(await readFile(new URL(relativePath, import.meta.url), "utf8"));
}

test("M35 primary-source research remains a bounded authoring input, not a source-map or release claim", async () => {
  const [research, graph, registry, releaseInputs] = await Promise.all([
    readFile(
      new URL(
        "../content/source-maps/module35_machine_learning_statistical_learning_ai_eval_source_research.md",
        import.meta.url,
      ),
      "utf8",
    ),
    readJson("../content/course/course-graph.v2.json"),
    readJson("../content/course/contracts/module-contract-registry.v3.json"),
    readJson("../content/course/release-inputs.v1.json"),
  ]);

  assert.match(research, /^# Module 35 .*Primary-Source Research/mu);
  assert.match(research, /\*\*Status on 2026-07-31:\*\* authoring-only research/u);
  assert.match(research, /not a learner workbook, canonical source map, module-contract record,/u);
  assert.match(research, /This note must not be used to\s+mark M35 published, review-ready, available, or complete\./u);
  assert.match(research, /## Primary-source ledger and reuse boundary/u);
  assert.match(research, /## First-principles definition and derivation sheet/u);
  assert.match(research, /## Claim, assumption, derivation, and counterexample ledger/u);
  assert.match(research, /## Likely six-session source routing/u);
  assert.match(research, /## Bounded project and numerical-experiment plan/u);
  assert.match(research, /## Research gaps and release blockers this file does not close/u);
  assert.match(research, /A bounded local reference fixture and focused teaching test now exist/u);
  assert.match(research, /no learner studio or release validation exists/u);
  assert.match(research, /The portal and portable copied prompts remain\s+local-first/u);
  assert.match(research, /only the learner-designated Codex Teaching Assistant or Study Partner\s+chat may create at most one concise, privacy-bounded Notion session note/u);
  assert.match(research, /no saved-note claim is valid without direct\s+evidence\./u);
  for (let number = 1; number <= 16; number += 1) {
    assert.match(research, new RegExp(`\\| S35-${String(number).padStart(2, "0")} \\|`, "u"));
  }

  const m35GraphEntry = graph.modules.find(({ id }) => id === "m35");
  const contract = registry.modules.find(({ moduleId }) => moduleId === "m35");
  assert.equal(m35GraphEntry?.sourceMap, null);
  assert.equal(m35GraphEntry?.studioId, null);
  assert.deepEqual(m35GraphEntry?.state, {
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
      ({ path }) => path === "content/source-maps/module35_machine_learning_statistical_learning_ai_eval_source_research.md",
    ),
  );
});
