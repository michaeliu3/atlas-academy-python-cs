import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("the M23 source-audit addendum remains internal and preserves its unresolved contract boundaries", async () => {
  const addendum = await readFile(
    new URL(
      "../content/source-maps/module23_languages_interpreters_source_audit_addendum.md",
      import.meta.url,
    ),
    "utf8",
  );

  assert.match(addendum, /authoring-only/u);
  assert.match(
    addendum,
    /not a\s+public learner download or\s+release-evidence-policy artifact/u,
  );
  assert.match(addendum, /not learner-downloadable/u);
  assert.match(addendum, /hashable internal release input/u);
  assert.match(addendum, /does \*\*not\*\*\s+change[\s\S]*publication state/u);
  assert.match(addendum, /## Source and reuse ledger/u);
  assert.match(addendum, /## Six-session claim linkage/u);
  assert.match(addendum, /## Preserved audit ambiguities and missing evidence/u);
  assert.match(addendum, /rigor bundle[\s\S]*\*\*ambiguous\*\*/u);
  assert.match(addendum, /code-reading\/debugging\/design[\s\S]*\*\*ambiguous\*\*/u);
  assert.match(addendum, /prediction before reveal[\s\S]*\*\*ambiguous\*\*/u);
  assert.match(addendum, /transfer task[\s\S]*\*\*ambiguous\*\*/u);
  assert.match(addendum, /confidence diagnostic\/misconceptions[\s\S]*\*\*ambiguous\*\*/u);
  assert.match(addendum, /supportive oral defense[\s\S]*\*\*missing\*\*/u);
  assert.match(addendum, /## Unresolved supportive oral-defense route/u);
  assert.match(
    addendum,
    /generic oral infrastructure does not satisfy the\s+module-specific\s+missing criterion/u,
  );
  assert.match(addendum, /Python 3\.14\.6/u);
  assert.match(addendum, /typing\.python\.org\/en\/latest/u);
  assert.match(addendum, /v3\.14\.6/u);
  assert.match(
    addendum,
    /automatically makes the canonical map or this\s+addendum a learner-facing delivery artifact/u,
  );
});

test("the M23 source map and learner surfaces label their local bridge and bounded I/O truthfully", async () => {
  const [sourceMap, workbook, studio] = await Promise.all([
    readFile(
      new URL(
        "../content/source-maps/module23_languages_interpreters_source_map.md",
        import.meta.url,
      ),
      "utf8",
    ),
    readFile(
      new URL(
        "../content/modules/23_programming_languages_interpreters.md",
        import.meta.url,
      ),
      "utf8",
    ),
    readFile(new URL("../app/LanguageInterpreterStudio.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(
    sourceMap,
    /github\.com\/python\/cpython\/blob\/v3\.14\.6\/Grammar\/python\.gram/u,
  );
  assert.match(
    sourceMap,
    /github\.com\/python\/cpython\/blob\/v3\.14\.6\/Python\/bltinmodule\.c/u,
  );
  assert.match(
    sourceMap,
    /github\.com\/python\/cpython\/blob\/v3\.14\.6\/Doc\/library\/dis\.rst/u,
  );
  assert.doesNotMatch(sourceMap, /github\.com\/python\/cpython\/blob\/main\//u);
  assert.match(sourceMap, /bounded evaluator and reference-model execution\s+path/u);
  assert.match(sourceMap, /separately defined matching function/u);
  assert.match(sourceMap, /does not compile the displayed source at bridge time/u);
  assert.doesNotMatch(
    sourceMap,
    /The module performs no process, filesystem, shell, database, network, package,\s+credential, browser, or remote-code operation\./u,
  );
  assert.match(workbook, /local Python implementation\/version evidence environment/u);
  assert.match(workbook, /Local test-harness I\/O:/u);
  assert.match(studio, /not a captured disassembly/u);
  assert.match(studio, /local Python implementation\/build/u);
});
