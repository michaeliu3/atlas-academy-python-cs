import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("M25 and M26 name the actual M35/M36 candidate receipts", async () => {
  const [m25, m26, contracts] = await Promise.all([
    readFile(new URL("../content/modules/25_evidence_grounded_intelligent_systems.md", import.meta.url), "utf8"),
    readFile(
      new URL("../content/modules/26_systems_capstone_open_source_stewardship.md", import.meta.url),
      "utf8",
    ),
    readFile(new URL("../content/course/contracts/advanced-module-contracts.v1.json", import.meta.url), "utf8"),
  ]);

  for (const material of [m25, m26]) {
    assert.match(material, /Machine Learning & Representation Dossier/u);
    assert.match(material, /Statistical Learning Theory & Reliable Deep-Learning Systems Dossier/u);
  }
  assert.match(contracts, /Machine Learning & Representation Dossier and learner-controlled oral-defense summary/u);
  assert.match(
    contracts,
    /Statistical Learning Theory & Reliable Deep-Learning Systems Dossier and learner-controlled oral-defense summary/u,
  );
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
