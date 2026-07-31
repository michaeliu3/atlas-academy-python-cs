import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("the M20 source-audit addendum remains authoring-only and preserves its provenance blocker", async () => {
  const addendum = await readFile(
    new URL(
      "../content/source-maps/module20_networks_protocols_source_audit_addendum.md",
      import.meta.url,
    ),
    "utf8",
  );

  assert.match(addendum, /authoring-only/u);
  assert.match(
    addendum,
    /not a release-input-policy\s+artifact or a public learner download/u,
  );
  assert.match(addendum, /does \*\*not\*\* change the[\s\S]*publication state/u);
  assert.match(addendum, /expired Internet-Draft/iu);
  assert.match(addendum, /work\/module20_reference\.py/u);
  assert.match(addendum, /Do not call the missing path canonical/u);
});
