import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function read(relativePath) {
  return readFile(new URL(`../${relativePath}`, import.meta.url), "utf8");
}

test("M5–M11 expose the required analysis, flow, and streaming algorithm spine", async () => {
  const [m5, m10, m11, arcMap, m11Audit] = await Promise.all([
    read("content/modules/05_cost_models_algorithm_analysis.md"),
    read("content/modules/10_graph_algorithms_network_models.md"),
    read("content/modules/11_algorithm_design_paradigms.md"),
    read("content/source-maps/arc_ii_source_map.md"),
    read("content/source-maps/module11_algorithm_design_paradigms_source_audit_addendum.md"),
  ]);

  assert.match(m5, /worst-case[\s\S]{0,180}expected[\s\S]{0,180}amortized/u);
  for (const phrase of [
    "Network flow bridge",
    "feasible flow",
    "reverse residual capacity",
    "max-flow/min-cut theorem",
  ]) {
    assert.match(m10, new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "u"));
  }
  for (const phrase of [
    "Streaming algorithms: bounded state and heavy hitters",
    "Misra–Gries as an inspectable summary",
    "candidate set",
    "second pass",
    "Question 9 — Streaming summary boundary",
    "CMU 15-451/651 Lecture 20",
  ]) {
    assert.match(m11, new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "u"));
  }
  assert.match(arcMap, /Streaming state and error boundary/u);
  assert.match(arcMap, /bounded heavy-hitter summary/u);
  assert.match(m11Audit, /\*\*U07\*\*[\s\S]*Streaming Algorithms/u);
  assert.match(m11Audit, /first-pass counter is not an exact frequency/u);
  assert.match(m11, /not a grade/u);
});
