import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function readJson(relativePath) {
  return JSON.parse(await readFile(new URL(relativePath, import.meta.url), "utf8"));
}

test("M34 primary-source research remains a bounded authoring input, not a source-map, release, or publication claim", async () => {
  const [research, candidateLedger, candidateWorkbook, authoringWorkbook, graph, registry, releaseInputs] = await Promise.all([
    readFile(
      new URL(
        "../content/source-maps/module34_classical_ai_search_constraints_decision_source_research.md",
        import.meta.url,
      ),
      "utf8",
    ),
    readFile(
      new URL(
        "../content/source-maps/module34_classical_ai_search_constraints_decision.md",
        import.meta.url,
      ),
      "utf8",
    ),
    readFile(
      new URL("../content/modules/34_classical_ai_search_constraints_decision.md", import.meta.url),
      "utf8",
    ),
    readFile(
      new URL(
        "../content/authoring/m34_classical_ai_search_constraints_decision_workbook.v1.md",
        import.meta.url,
      ),
      "utf8",
    ),
    readJson("../content/course/course-graph.v2.json"),
    readJson("../content/course/contracts/module-contract-registry.v3.json"),
    readJson("../content/course/release-inputs.v1.json"),
  ]);

  assert.match(research, /^# Module 34 .*Primary-Source Research/mu);
  assert.match(research, /\*\*Status:\*\* instructor-facing, \*\*authoring-only\*\* research input/u);
  assert.match(research, /It is not a learner workbook, structured module contract,/u);
  assert.match(
    research,
    /It is not a learner workbook, structured module contract,\s+release-input record, review approval, provenance ledger, deployment record, or\s+publication decision\./u,
  );
  assert.match(research, /does \*\*not\*\* change\s+the graph, manifest, route,\s+navigation, availability,/u);
  assert.match(research, /## Primary-source ledger and reuse boundary/u);
  assert.match(research, /## Definitions, assumptions, proof ideas, and counterexamples/u);
  assert.match(research, /## Likely six-session source routing/u);
  assert.match(research, /## Bounded project and numerical-experiment plan/u);
  assert.match(research, /## Research gaps and release blockers this file does not close/u);
  assert.match(research, /\*\*Canonical source map remains null\.\*\*/u);
  assert.match(research, /\*\*No privacy, Notion, deployment, CI, GitHub provenance, or release\s+evidence exists\.\*\*/u);
  assert.match(
    research,
    /The portal and portable copied prompts keep this record\s+local-first; only the designated Codex chats may create at most one bounded\s+concise Notion session note under the active policy\. That note must not contain\s+a raw transcript and no saved-note claim is valid without direct evidence\./u,
  );
  for (let number = 1; number <= 19; number += 1) {
    assert.match(research, new RegExp(`\\| S34-${String(number).padStart(2, "0")} \\|`, "u"));
  }
  assert.match(research, /CMU course staff; official university-hosted course notes/u);
  assert.match(research, /closed-world convention/u);
  assert.match(research, /UC Berkeley course staff; official course textbook routes/u);
  assert.match(research, /one-shot expected-utility table/u);
  assert.match(candidateLedger, /\\| S34-19 \\|/u);
  for (const workbook of [candidateWorkbook, authoringWorkbook]) {
    assert.match(workbook, /^### State semantics card: false, unknown, or unmodelled$/mu);
    assert.match(workbook, /silent sensor/u);
    assert.match(workbook, /model-false, missing observation, and omitted representation/u);
  }

  const m34GraphEntry = graph.modules.find(({ id }) => id === "m34");
  const contract = registry.modules.find(({ moduleId }) => moduleId === "m34");
  assert.equal(m34GraphEntry?.sourceMap, null);
  assert.equal(m34GraphEntry?.studioId, null);
  assert.deepEqual(m34GraphEntry?.state, {
    lifecycle: "authoring-only",
    readerAccess: "hidden",
    availability: "authoring-only",
    contract: { track: "advanced-v1", state: "authoring-only" },
    release: { state: "unrecorded", recordId: null },
    privateGuidedStudy: { status: "ready", delivery: "designated-codex-chats" },
  });
  assert.equal(contract?.contractState, "authoring-only");
  assert.deepEqual([...new Set(contract?.criteria.map(({ status }) => status))].sort(), [
    "planned",
    "pointer-present",
  ]);
  assert.ok(
    releaseInputs.inputs.some(
      ({ path }) => path === "content/source-maps/module34_classical_ai_search_constraints_decision_source_research.md",
    ),
  );
});
