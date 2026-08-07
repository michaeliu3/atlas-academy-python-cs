import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("the M21 source-audit addendum remains authoring-only and preserves every unresolved audit boundary", async () => {
  const addendum = await readFile(
    new URL(
      "../content/source-maps/module21_async_distributed_source_audit_addendum.md",
      import.meta.url,
    ),
    "utf8",
  );

  assert.match(addendum, /authoring-only/u);
  assert.match(
    addendum,
    /not a\s+public learner download or release-evidence-policy artifact/u,
  );
  assert.match(addendum, /hashable internal release input/u);
  assert.match(addendum, /does \*\*not\*\*\s+change[\s\S]*publication state/u);
  assert.match(addendum, /## Source and reuse ledger/u);
  assert.match(addendum, /## Six-session claim linkage/u);
  assert.match(addendum, /## Preserved audit ambiguities and non-claims/u);
  assert.match(addendum, /rigor bundle/u);
  assert.match(addendum, /code-reading\/debugging\/design/u);
  assert.match(addendum, /prediction before reveal/u);
  assert.match(addendum, /transfer task/u);
  assert.match(addendum, /confidence diagnostic\/misconceptions/u);
  assert.match(addendum, /supportive oral defense/u);
  assert.match(addendum, /learner-facing source artifact/u);
});
