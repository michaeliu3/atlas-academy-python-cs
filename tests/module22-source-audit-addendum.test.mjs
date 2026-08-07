import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("the M22 source-audit addendum remains internal and preserves every unresolved audit boundary", async () => {
  const addendum = await readFile(
    new URL(
      "../content/source-maps/module22_security_trust_source_audit_addendum.md",
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
  assert.match(addendum, /not learner-downloadable/u);
  assert.match(addendum, /RFC 9846/u);
});

test("the M22 learner source route does not retain obsolete TLS guidance as current", async () => {
  const [sourceMap, workbook] = await Promise.all([
    readFile(
      new URL(
        "../content/source-maps/module22_security_trust_source_map.md",
        import.meta.url,
      ),
      "utf8",
    ),
    readFile(
      new URL(
        "../content/modules/22_security_privacy_trust_boundaries.md",
        import.meta.url,
      ),
      "utf8",
    ),
  ]);

  assert.match(sourceMap, /RFC 8446 is obsolete and RFC 9846 is the current TLS 1\.3 specification/u);
  assert.match(sourceMap, /RFC 9325 remains baseline TLS\/DTLS guidance with later updates/u);
  assert.match(workbook, /TLS 1\.3, RFC 9846/u);
  assert.match(workbook, /BCP 195 TLS\/DTLS guidance status/u);
});
