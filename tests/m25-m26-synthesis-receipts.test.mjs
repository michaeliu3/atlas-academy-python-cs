import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("M25 and M26 name the actual advanced candidate receipts", async () => {
  const [m25, m26, m26SourceMap, contracts, guidedRoute] = await Promise.all([
    readFile(new URL("../content/modules/25_evidence_grounded_intelligent_systems.md", import.meta.url), "utf8"),
    readFile(
      new URL("../content/modules/26_systems_capstone_open_source_stewardship.md", import.meta.url),
      "utf8",
    ),
    readFile(new URL("../content/source-maps/module26_systems_capstone_source_map.md", import.meta.url), "utf8"),
    readFile(new URL("../content/course/contracts/advanced-module-contracts.v1.json", import.meta.url), "utf8"),
    readFile(new URL("../docs/PRIVATE_GUIDED_LEARNING_ROUTE.md", import.meta.url), "utf8"),
  ]);

  for (const material of [m25, m26]) {
    assert.match(material, /Optimization and Information Evidence Dossier/u);
    assert.match(material, /Scientific Python & Accelerators Dossier/u);
    assert.match(material, /Formal Limits Claim Packet/u);
    assert.match(material, /Classical AI Search, Constraints & Decision Packet/u);
    assert.match(material, /Machine Learning & Representation Dossier/u);
    assert.match(material, /Statistical Learning Theory & Reliable Deep-Learning Systems Dossier/u);
    assert.match(material, /Limit-and-Nonclaim Card/u);
    assert.match(material, /Theory–System Reproducibility Record/u);
    assert.match(material, /Monitoring Extension to Reliable-Learning Evidence Map/u);
  }
  assert.doesNotMatch(m25, /ML representation\/evaluation evidence packet/u);
  assert.doesNotMatch(m26, /\| M35 \| ML evidence packet \|/u);
  assert.doesNotMatch(m26, /\| M36 \| reliable-learning limit\/non-claim and reproducibility record \|/u);
  assert.match(m26SourceMap, /M24 evidence thread → M31–M36 synthesis gate → M25 → M26/u);
  assert.match(m26SourceMap, /connected \*\*evidence roles\*\*, not next\/previous navigation/u);
  assert.doesNotMatch(m26SourceMap, /M24 → M25 → M26 connected sequence/u);
  assert.match(contracts, /Machine Learning & Representation Dossier and learner-controlled oral-defense summary/u);
  assert.match(
    contracts,
    /Statistical Learning Theory & Reliable Deep-Learning Systems Dossier and learner-controlled oral-defense summary/u,
  );
  for (const material of [m25, m26]) {
    assert.match(material, /said `records on` in that exact chat/u);
    assert.match(material, /`pause records` nor\s+`off-record`/u);
  }
  assert.match(guidedRoute, /M25 evidence-synthesis orientation/u);
  assert.match(guidedRoute, /M26 pre-capstone architecture rehearsal/u);
  assert.match(guidedRoute, /\[UNAVAILABLE — PRESERVE PREVIEW GATE\]/u);
  assert.match(guidedRoute, /`REHEARSAL ONLY`/u);
});

test("the v1 M31–M36 audit identifies its graph as a frozen historical fixture", async () => {
  const audit = JSON.parse(
    await readFile(new URL("../docs/M31_M36_PUBLICATION_READINESS_AUDIT.v1.json", import.meta.url), "utf8"),
  );

  assert.match(audit.scope.purpose, /audited historical commit/u);
  assert.match(audit.scope.purpose, /frozen historical fixture/u);
  assert.match(audit.evidenceSources[0].observation, /Frozen historical source/u);
  assert.match(audit.evidenceSources[0].observation, /active repository canonical graph is v2/u);
});
