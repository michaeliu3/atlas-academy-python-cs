import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("the M25 source-audit addendum stays internal and preserves preview and unresolved-contract boundaries", async () => {
  const addendum = await readFile(
    new URL(
      "../content/source-maps/module25_evidence_grounded_intelligent_systems_source_audit_addendum.md",
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
  assert.match(
    addendum,
    /The non-promoting M25 structural packet now includes this addendum/u,
  );
  assert.match(addendum, /does \*\*not\*\* change[\s\S]*publication state/u);
  assert.match(addendum, /M24 → M32 → M33 → M34 → M35 → M36 → M25 → M26/u);
  assert.match(addendum, /full\s+canonical route reaches M31 before M18–M24/u);
  assert.match(addendum, /downstream\s+navigation\s+segment from M24/u);
  assert.match(addendum, /direct academic prerequisites/u);
  assert.match(addendum, /transitive[\s\S]*closure/u);
  assert.match(addendum, /scikit-learn[\s\S]*\*\*1\.9\.0\*\*/u);
  assert.match(addendum, /Initial Public Draft/u);
  assert.match(addendum, /2025-11-25/u);
  assert.match(addendum, /OWASP[\s\S]*v2025/u);
  assert.match(addendum, /## Six-session claim linkage/u);
  assert.match(addendum, /## Bounded reference-model and preview truth/u);
  assert.match(addendum, /CLI parses one enumerated[\s\S]*JSON packet/u);
  assert.match(addendum, /## Preserved audit ambiguities and review boundary/u);
  assert.match(addendum, /prerequisite\/forward map[\s\S]*\*\*ambiguous\*\*/u);
  assert.match(addendum, /rigor bundle[\s\S]*\*\*ambiguous\*\*/u);
  assert.match(
    addendum,
    /Prediction, transfer,[\s\S]*confidence-diagnostic, and supportive-oral pointers are present structurally/u,
  );
  assert.match(
    addendum,
    /structurally mapped but unreviewed M25 oral-defense route/u,
  );
  assert.doesNotMatch(addendum, /## Unresolved supportive oral-defense route/u);
});

test("the M25 learner and authoring surfaces distinguish route, preview, source freshness, and bounded I/O", async () => {
  const [workbook, sourceMap, referenceModel] = await Promise.all([
    readFile(
      new URL("../content/modules/25_evidence_grounded_intelligent_systems.md", import.meta.url),
      "utf8",
    ),
    readFile(
      new URL(
        "../content/source-maps/module25_evidence_grounded_intelligent_systems_source_map.md",
        import.meta.url,
      ),
      "utf8",
    ),
    readFile(new URL("../public/downloads/module25_reference.py", import.meta.url), "utf8"),
  ]);

  assert.match(workbook, /Preview boundary/u);
  assert.match(workbook, /M24 → M32 → M33 → M34 → M35 → M36 → M25 → M26/u);
  assert.match(workbook, /full\s+canonical route reaches M31 before M18–M24/u);
  assert.match(workbook, /From M24, the downstream\s+navigation\s+segment/u);
  assert.match(workbook, /concept\/evidence map, not next\/previous navigation/u);
  assert.match(workbook, /Tooling I\/O:/u);
  assert.match(workbook, /Session artifact/u);
  assert.match(workbook, /preparation\s+artifact only/u);
  assert.match(workbook, /current\s+preview records this interaction specification/u);

  assert.match(sourceMap, /gated, preview-only synthesis/u);
  assert.match(sourceMap, /M24 → M32 → M33 → M34 → M35 → M36\s+→\s+M25 → M26/u);
  assert.match(sourceMap, /full\s+canonical route reaches M31 before M18–M24/u);
  assert.match(sourceMap, /downstream\s+navigation\s+segment from M24/u);
  assert.match(sourceMap, /transitive closure supplies the M27–M36 evidence spine/u);
  assert.match(sourceMap, /M24 evidence thread → M31–M36 synthesis gate → M25 → M26/u);
  assert.match(sourceMap, /scikit-learn 1\.9\.0/u);
  assert.match(sourceMap, /Initial Public Draft/u);
  assert.match(
    sourceMap,
    /modelcontextprotocol\.io\/specification\/2025-11-25\/basic\/authorization/u,
  );
  assert.match(sourceMap, /OWASP-Top-10-for-LLMs-v2025\.pdf/u);
  assert.doesNotMatch(sourceMap, /2025-06-18/u);
  assert.doesNotMatch(sourceMap, /Module 25 follows Module 24/u);
  assert.doesNotMatch(sourceMap, /M24 → M25 → M26 connected sequence/u);

  assert.match(referenceModel, /choices=SCENARIOS/u);
  assert.match(referenceModel, /print\(json\.dumps\(run_scenario/u);
  assert.match(referenceModel, /does not train a model, call an LLM or network service/u);
});
