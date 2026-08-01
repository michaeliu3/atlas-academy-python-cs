import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function workbook(filename) {
  return readFile(new URL(`../content/modules/${filename}`, import.meta.url), "utf8");
}

test("foundation remediation keeps the five direct misconception repairs study-ready", async () => {
  const [m1, m2, m3, m4, m5] = await Promise.all([
    workbook("01_values_state_execution.md"),
    workbook("02_functions_recursion_induction.md"),
    workbook("03_abstraction_interfaces_adts.md"),
    workbook("04_logic_sets_relations_graphs_proof.md"),
    workbook("05_cost_models_algorithm_analysis.md"),
  ]);

  for (const [moduleId, markdown] of [
    ["M1", m1],
    ["M2", m2],
    ["M3", m3],
    ["M4", m4],
    ["M5", m5],
  ]) {
    assert.match(markdown, /### Session-to-source-and-evidence route/u, `${moduleId} needs a compact claim-linked source route.`);
    assert.match(markdown, /\| 6 \|/u, `${moduleId} needs a source/evidence route through Session 6.`);
  }

  assert.match(m1, /Prediction gate — lexical scope is a binding trace/u);
  assert.match(m1, /nonlocal label/u);
  assert.match(m1, /Reveal after writing your prediction and confidence\./u);
  assert.match(m1, /\| Binding\/state trace \|/u);

  assert.match(m2, /Transfer checkpoint — a decreasing measure need not be one tree size/u);
  assert.match(m2, /lexicographic pair/u);
  assert.match(m2, /Reveal after committing to a measure and confidence\./u);

  assert.match(m3, /Required trace — right shape, wrong behavior/u);
  assert.match(m3, /class ReversingStore/u);
  assert.match(m3, /assert store\.history\(\) == \(first_event, second_event\)/u);
  assert.match(m3, /behavioral law/u);

  assert.match(m4, /branch-counting condition, not a probability-independence claim/u);
  assert.match(m4, /Prediction gate — unequal branches need a sum/u);
  assert.match(m4, /There are `1 \+ 3 \+ 0 = 4` valid pairs/u);
  assert.match(m4, /Full counting techniques, discrete probability/u);

  assert.match(m5, /def elapsed_samples\(/u);
  assert.match(m5, /def summarize_samples\(/u);
  assert.match(m5, /"median_seconds": median\(samples\)/u);
  assert.match(m5, /raw sample list/u);
  assert.match(m5, /\| Reproducible measurement \|/u);
});
