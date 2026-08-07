import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("the M24 source-audit addendum stays internal and distinguishes historical from current structural boundaries", async () => {
  const [addendum, research] = await Promise.all([
    readFile(
      new URL(
        "../content/source-maps/module24_cpython_performance_memory_source_audit_addendum.md",
        import.meta.url,
      ),
      "utf8",
    ),
    readFile(
      new URL(
        "../content/source-maps/module24_cpython_performance_memory_source_research.md",
        import.meta.url,
      ),
      "utf8",
    ),
  ]);

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
  assert.match(addendum, /## Preserved audit ambiguities and missing evidence \(historical snapshot\)/u);
  assert.match(addendum, /rigor bundle[\s\S]*\*\*ambiguous\*\*/u);
  assert.match(addendum, /transfer task[\s\S]*\*\*ambiguous\*\*/u);
  assert.match(addendum, /accessible visual\/text alternative[\s\S]*\*\*ambiguous\*\*/u);
  assert.match(addendum, /confidence diagnostic\/misconceptions[\s\S]*\*\*ambiguous\*\*/u);
  assert.match(addendum, /TA prompt[\s\S]*\*\*ambiguous\*\*/u);
  assert.match(addendum, /supportive oral defense[\s\S]*\*\*missing\*\*/u);
  assert.match(addendum, /## Historical supportive oral-defense gap, now structurally mapped/u);
  assert.match(
    addendum,
    /current canonical audit now resolves rigor, transfer, confidence diagnostic,\s+and supportive oral defense as \*\*pointer-present\*\*/u,
  );
  assert.match(addendum, /accessible visual\/text-alternative and TA-prompt criteria remain\s+\*\*ambiguous\*\*/u);
  assert.match(addendum, /Python 3\.14\.6/u);
  assert.match(addendum, /v3\.14\.6/u);
  assert.match(addendum, /PEP 744/u);
  assert.match(addendum, /M23\s*→\s*M24\s*→\s*M32/u);
  assert.match(
    addendum,
    /automatically makes the canonical map, this addendum, or the\s+research note\s+a learner-facing delivery artifact/u,
  );
  assert.match(research, /authoring-only research input; non-promoting/u);
  assert.match(research, /COURSE_MODEL/u);
  assert.match(research, /MANIFEST_READY/u);
  assert.doesNotMatch(research, /github\.com\/python\/cpython\/blob\/main\//u);
});

test("the M24 learner and authoring surfaces state the fixed-model, local-I/O, and illustrative-bytecode limits precisely", async () => {
  const [sourceMap, workbook, studio, referenceModel] = await Promise.all([
    readFile(
      new URL(
        "../content/source-maps/module24_cpython_performance_memory_source_map.md",
        import.meta.url,
      ),
      "utf8",
    ),
    readFile(
      new URL("../content/modules/24_cpython_performance_memory.md", import.meta.url),
      "utf8",
    ),
    readFile(new URL("../app/RuntimeEvidenceObservatory.tsx", import.meta.url), "utf8"),
    readFile(new URL("../public/downloads/module24_reference.py", import.meta.url), "utf8"),
  ]);

  assert.match(
    sourceMap,
    /no caller-provided program or data path; its\s+CLI\/test harness still has bounded process I\/O/u,
  );
  assert.match(sourceMap, /argument selection, local\s+import, and JSON written to stdout/u);
  assert.match(sourceMap, /PEP 744 was \*\*Draft\*\* when accessed on 2026-07-30/u);
  assert.match(sourceMap, /JIT is not supported in free-threaded builds/u);
  assert.match(
    sourceMap,
    /github\.com\/python\/cpython\/blob\/v3\.14\.6\/InternalDocs\/interpreter\.md/u,
  );
  assert.match(sourceMap, /`resource` module is Unix-only/u);
  assert.doesNotMatch(sourceMap, /This module is Unix-only/u);
  assert.match(workbook, /local Python implementation\/version evidence environment/u);
  assert.match(workbook, /Local test-harness I\/O:/u);
  assert.match(workbook, /Fixed source-inspection plan, not a captured disassembly/u);
  assert.match(workbook, /hypothesis, not a CPython\s+observation/u);
  assert.match(workbook, /Optional local measurement receipt/u);
  assert.match(
    workbook,
    /no portal upload, automatic collection, comparison leaderboard,\s+or production-performance claim/u,
  );
  assert.match(workbook, /Keep raw profiles, paths, payloads, and machine identifiers local/u);
  assert.match(studio, /illustrative bytecode card/u);
  assert.match(studio, /not a captured disassembly/u);
  assert.match(referenceModel, /fixed fixture label, not the detected interpreter/iu);
  assert.match(referenceModel, /writes one bounded JSON packet\s+to standard output/u);
  assert.match(studio, /Module 32 is authoring-only/u);
  assert.doesNotMatch(studio, /Module 25 applies the same distinction/u);
});
