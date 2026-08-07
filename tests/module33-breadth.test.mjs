import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const workbookPath = new URL(
  "../content/authoring/m33_formal_languages_computability_complexity_workbook.v1.md",
  import.meta.url,
);
const sourceMapPath = new URL(
  "../content/source-maps/module33_formal_languages_computability_complexity_source_research.md",
  import.meta.url,
);

test("M33 authoring workbook exposes the promised theory-breadth spine", async () => {
  const [workbook, sourceMap] = await Promise.all([
    readFile(workbookPath, "utf8"),
    readFile(sourceMapPath, "utf8"),
  ]);

  assert.match(workbook, /### Chomsky hierarchy/u);
  assert.match(workbook, /\\mathrm\{REG\}\\subsetneq\\mathrm\{CFL\}\\subsetneq\\mathrm\{CSL\}\\subsetneq\\mathrm\{RE\}/u);
  assert.match(workbook, /### Rice's theorem/u);
  assert.match(workbook, /nontrivial semantic property/u);
  assert.match(workbook, /effective program encoding/u);
  assert.match(workbook, /### Complexity breadth map/u);
  for (const topic of ["coNP", "PSPACE", "Savitch", "BPP/RP", "approximation hardness", "circuit complexity"]) {
    assert.match(workbook, new RegExp(topic.replace("/", "\\/"), "u"));
  }
  assert.match(workbook, /### Breadth practice ladder/u);
  assert.match(workbook, /Recognize:.*P, NP, coNP/u);
  assert.match(workbook, /Read:.*reachability recursion/u);
  assert.match(workbook, /Derive:.*gap reduction/u);

  for (const sourceId of ["S33-03", "S33-05", "S33-11", "S33-12", "S33-13"]) {
    assert.match(sourceMap, new RegExp("\\| " + sourceId + " \\|", "u"));
  }
  assert.match(
    sourceMap,
    /Chomsky|grammar-model comparison|Rice's theorem|PDA.*CFG|complexity.*progression/isu,
  );
});
