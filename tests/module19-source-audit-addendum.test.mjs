import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("the M19 source-audit addendum remains authoring-only and preserves the Study Partner gap", async () => {
  const addendum = await readFile(
    new URL(
      "../content/source-maps/module19_concurrency_parallelism_source_audit_addendum.md",
      import.meta.url,
    ),
    "utf8",
  );

  assert.match(addendum, /authoring-only/u);
  assert.match(
    addendum,
    /not a\s+public learner download or release-evidence-policy artifact/u,
  );
  assert.match(addendum, /does \*\*not\*\*\s+change[\s\S]*publication state/u);
  assert.match(addendum, /## Unresolved Study Partner route/u);
  assert.match(addendum, /module-specific Study Partner prompt is missing/u);
  assert.match(addendum, /generic\s+`\/learning-partners` package/u);
  assert.match(addendum, /must not be used to claim that M19 has a Study Partner/u);
});
