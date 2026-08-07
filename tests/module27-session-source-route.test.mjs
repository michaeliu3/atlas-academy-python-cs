import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("M27 source routing follows the visible S3-S6 workbook progression", async () => {
  const [workbook, sourceMap, auditAddendum, calibration] = await Promise.all([
    readFile(
      new URL("../content/modules/27_discrete_mathematics_proof_counting_structures.md", import.meta.url),
      "utf8",
    ),
    readFile(
      new URL(
        "../content/source-maps/module27_discrete_mathematics_proof_counting_structures_source_map.md",
        import.meta.url,
      ),
      "utf8",
    ),
    readFile(new URL("../content/source-maps/module27_source_audit_addendum.md", import.meta.url), "utf8"),
    readFile(
      new URL(
        "../content/source-maps/module27_discrete_mathematics_official_course_calibration_2026-08-01.md",
        import.meta.url,
      ),
      "utf8",
    ),
  ]);

  assert.match(workbook, /Session 3 — Counting, recurrences, generating functions, and asymptotics/u);
  assert.match(workbook, /Session 4 — Graphs, trees, connectivity, and matchings/u);
  assert.match(workbook, /Session 5 — Partial orders, lattices, and elementary number theory/u);
  assert.match(workbook, /Session 6 — Integrate the models: proof dossier and AI review/u);

  assert.match(sourceMap, /\| 3\. Count, decompose, encode, and bound \|.*ordinary generating functions.*`O\/Ω\/Θ`/u);
  assert.match(sourceMap, /\| 4\. Relationships at scale \|.*Graphs\/trees\/connectivity, bipartite graphs\/matchings/u);
  assert.match(sourceMap, /\| 5\. Partial information and modular reasoning \|.*Partial orders, Hasse diagrams, lattices; divisibility, gcd, congruence, modular inverse/u);
  assert.match(sourceMap, /\| 6\. Integrate the models \|.*Capstone proof\/counterexample dossier, AI-proposal review, constructive oral defense/u);

  assert.match(auditAddendum, /\| 3 — counting, recurrences, generating functions, asymptotics \|/u);
  assert.match(auditAddendum, /\| 4 — graphs, trees, connectivity, and matchings \|/u);
  assert.match(auditAddendum, /\| 5 — partial orders, lattices, and elementary number theory \|/u);
  assert.match(auditAddendum, /\| 6 — integrate the models: proof dossier and AI review \|/u);
  assert.match(calibration, /## Routing correction to carry into the next M27 revision/u);
});
