import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function workbook(filename) {
  return readFile(new URL(`../content/modules/${filename}`, import.meta.url), "utf8");
}

test("Arc II keeps compact session-level source and evidence boundaries", async () => {
  const [m6, m7, m8, m9, m10, sourceMap] = await Promise.all([
    workbook("06_representation_memory_sequences_linked.md"),
    workbook("07_stacks_queues_iteration_lazy.md"),
    workbook("08_hashing_dictionaries_sets_indexing.md"),
    workbook("09_trees_heaps_sorting_ordered.md"),
    workbook("10_graph_algorithms_network_models.md"),
    readFile(new URL("../content/source-maps/arc_ii_source_map.md", import.meta.url), "utf8"),
  ]);

  for (const [moduleId, markdown] of [
    ["M6", m6],
    ["M7", m7],
    ["M8", m8],
    ["M9", m9],
    ["M10", m10],
  ]) {
    assert.match(markdown, /### Session-to-source-and-evidence route/u, `${moduleId} needs a learner-facing source route.`);
    assert.match(markdown, /Sources were checked \*\*2026-08-01\*\*/u, `${moduleId} needs an access date.`);
    assert.match(markdown, /link(?:\/cite|-cite|ed\s+or\s+briefly paraphrased)\s+only/u, `${moduleId} needs a reuse boundary.`);
    assert.match(markdown, /\| 6 \|/u, `${moduleId} needs a source/evidence route through Session 6.`);
  }

  assert.match(m6, /CPython `v3\.14\.6` `listobject\.c`/u);
  assert.match(m7, /### Evidence rubric/u);
  assert.match(m7, /synchronous-buffer non-claim/u);
  assert.match(m8, /CPython `v3\.14\.6` `Objects\/dictobject\.c`/u);
  assert.match(m9, /CPython `v3\.14\.6` `heapq\.py`/u);
  assert.match(m10, /MIT 6\.006 Lecture 10/u);
  assert.match(m10, /MIT 6\.046J MST notes/u);

  assert.match(sourceMap, /\*\*Access and reuse record\.\*\*.*2026-08-01/us);
  assert.match(sourceMap, /blob\/v3\.14\.6\/Objects\/listobject\.c/u);
  assert.match(sourceMap, /blob\/v3\.14\.6\/Objects\/dictobject\.c/u);
  assert.match(sourceMap, /blob\/v3\.14\.6\/Lib\/heapq\.py/u);
  assert.match(sourceMap, /Session 5 source for nonnegative-edge finalization/u);
});
