import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function readJson(relativePath) {
  return JSON.parse(await readFile(new URL(relativePath, import.meta.url), "utf8"));
}

test("M32 primary-source research remains a bounded authoring input, not a source-map or release claim", async () => {
  const [research, graph, registry, releaseInputs, changelog, compliance] = await Promise.all([
    readFile(
      new URL(
        "../content/source-maps/module32_systems_languages_scientific_python_accelerators_source_research.md",
        import.meta.url,
      ),
      "utf8",
    ),
    readJson("../content/course/course-graph.v2.json"),
    readJson("../content/course/contracts/module-contract-registry.v3.json"),
    readJson("../content/course/release-inputs.v1.json"),
    readFile(new URL("../CHANGELOG.md", import.meta.url), "utf8"),
    readFile(new URL("../docs/GOAL_COMPLIANCE_HISTORY.md", import.meta.url), "utf8"),
  ]);

  assert.match(research, /^# Module 32 .*Primary-Source Research/mu);
  assert.match(research, /\*\*Status:\*\* instructor-facing, \*\*authoring-only\*\* research input/u);
  assert.match(research, /It is not a learner workbook, structured module contract,/u);
  assert.match(research, /does \*\*not\*\* change\s+the graph, manifest, route, navigation, availability,/u);
  assert.match(research, /## Primary-source ledger and reuse boundary/u);
  assert.match(research, /## Claim, assumption, and counterexample ledger/u);
  assert.match(research, /## Likely six-session source routing/u);
  assert.match(research, /## Required evidence record for any future experiment/u);
  assert.match(research, /## Research gaps and release blockers this file does not close/u);
  assert.match(research, /Bounded local references and focused teaching tests now exist/u);
  assert.match(research, /m32_numpy_layout_observation\.py/u);
  assert.match(research, /NumPy 2\.3\.5/u);
  assert.match(research, /no learner\s+studio or platform model exists/u);
  for (let number = 1; number <= 16; number += 1) {
    assert.match(research, new RegExp(`\\| S32-${String(number).padStart(2, "0")} \\|`, "u"));
  }
  assert.match(research, /M32-C13.*mixed-precision/u);
  assert.match(research, /M32-C14.*Distributed data parallelism/u);
  assert.match(research, /manual browser review on 2026-08-02/u);
  assert.match(research, /Automated requests can receive a 403/u);

  const m32GraphEntry = graph.modules.find(({ id }) => id === "m32");
  const contract = registry.modules.find(({ moduleId }) => moduleId === "m32");
  assert.equal(m32GraphEntry?.sourceMap, null);
  assert.equal(m32GraphEntry?.studioId, null);
  assert.deepEqual(m32GraphEntry?.state, {
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
      ({ path }) => path === "content/source-maps/module32_systems_languages_scientific_python_accelerators_source_research.md",
    ),
  );

  assert.match(changelog, /M32's authoring-only primary-source research ledger/u);
  assert.match(compliance, /\| M32 primary-source research \|/u);
  assert.match(compliance, /does not set M32's canonical source map or release state/u);
});
