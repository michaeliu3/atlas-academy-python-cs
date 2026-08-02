import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function workbook(filename) {
  return readFile(new URL(`../content/modules/${filename}`, import.meta.url), "utf8");
}

function isValidIsoDate(match) {
  if (!match) return false;
  const [year, month, day] = match.slice(1).map(Number);
  const candidate = new Date(Date.UTC(year, month - 1, day));
  return (
    year >= 2000 &&
    candidate.getUTCFullYear() === year &&
    candidate.getUTCMonth() === month - 1 &&
    candidate.getUTCDate() === day &&
    candidate.getTime() <= Date.UTC(
      new Date().getUTCFullYear(),
      new Date().getUTCMonth(),
      new Date().getUTCDate(),
    )
  );
}

function hasValidSourceDate(markdown) {
  return isValidIsoDate(
    markdown.match(/Sources were checked \*\*(\d{4})-(\d{2})-(\d{2})\*\*/u),
  );
}

function hasValidAuditDate(markdown) {
  return isValidIsoDate(markdown.match(/\*\*Audit date:\*\*\s*(\d{4})-(\d{2})-(\d{2})/u));
}

test("source-ledger date checks reject impossible and future provenance dates", () => {
  assert.equal(hasValidSourceDate("Sources were checked **2026-02-30**"), false);
  assert.equal(hasValidSourceDate("Sources were checked **2099-02-28**"), false);
});

test("Arc II keeps compact session-level source and evidence boundaries", async () => {
  const [m6, m7, m8, m9, m10, sourceMap, ...addendums] = await Promise.all([
    workbook("06_representation_memory_sequences_linked.md"),
    workbook("07_stacks_queues_iteration_lazy.md"),
    workbook("08_hashing_dictionaries_sets_indexing.md"),
    workbook("09_trees_heaps_sorting_ordered.md"),
    workbook("10_graph_algorithms_network_models.md"),
    readFile(new URL("../content/source-maps/arc_ii_source_map.md", import.meta.url), "utf8"),
    readFile(new URL("../content/source-maps/module6_representation_memory_sequences_linked_source_audit_addendum.md", import.meta.url), "utf8"),
    readFile(new URL("../content/source-maps/module7_stacks_queues_iteration_lazy_source_audit_addendum.md", import.meta.url), "utf8"),
    readFile(new URL("../content/source-maps/module8_hashing_dictionaries_sets_indexing_source_audit_addendum.md", import.meta.url), "utf8"),
    readFile(new URL("../content/source-maps/module9_trees_heaps_sorting_ordered_source_audit_addendum.md", import.meta.url), "utf8"),
    readFile(new URL("../content/source-maps/module10_graph_algorithms_network_models_source_audit_addendum.md", import.meta.url), "utf8"),
  ]);

  for (const [moduleId, markdown] of [
    ["M6", m6],
    ["M7", m7],
    ["M8", m8],
    ["M9", m9],
    ["M10", m10],
  ]) {
    assert.match(markdown, /### Session-to-source-and-evidence route/u, `${moduleId} needs a learner-facing source route.`);
    assert.equal(hasValidSourceDate(markdown), true, `${moduleId} needs a valid ISO access date.`);
    assert.match(markdown, /link(?:\/cite|-cite|ed\s+or\s+briefly paraphrased)\s+only/u, `${moduleId} needs a reuse boundary.`);
    assert.match(markdown, /\| 6 \|/u, `${moduleId} needs a source/evidence route through Session 6.`);
  }

  for (const [moduleId, addendum] of ["M6", "M7", "M8", "M9", "M10"].map(
    (moduleId, index) => [moduleId, addendums[index]],
  )) {
    assert.equal(hasValidAuditDate(addendum), true, `${moduleId} addendum needs a valid audit date.`);
  }

  for (const [moduleId, markdown, nextModule] of [
    ["M6", m6, "M7"],
    ["M7", m7, "M8"],
    ["M8", m8, "M9"],
    ["M9", m9, "M10"],
    ["M10", m10, "M11"],
  ]) {
    assert.match(markdown, /Constructive next-step guide/u, `${moduleId} needs a constructive next-step guide.`);
    assert.doesNotMatch(markdown, /Instructor decision rule/u, `${moduleId} must not frame its evidence as an instructor gate.`);
    assert.doesNotMatch(markdown, /Advance when/u, `${moduleId} must not use advancement wording for learner evidence.`);
    assert.doesNotMatch(markdown, /ready to advance/iu, `${moduleId} must not use readiness-to-advance labels for learner evidence.`);
    assert.match(
      markdown,
      /not a score, grade, release approval, Core advance, or mastery declaration/u,
      `${moduleId} needs a non-promoting evidence boundary.`,
    );
    assert.match(markdown, new RegExp(`continue with the ${nextModule} handoff`, "u"), `${moduleId} needs its next bridge.`);
    assert.match(markdown, /Otherwise,/u, `${moduleId} needs a named repair route.`);
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
