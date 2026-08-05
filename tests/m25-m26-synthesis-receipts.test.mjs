import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("M25 and M26 name the actual advanced candidate receipts", async () => {
  const [m25, m26, m25SourceMap, m26SourceMap, contracts, guidedRoute] = await Promise.all([
    readFile(new URL("../content/modules/25_evidence_grounded_intelligent_systems.md", import.meta.url), "utf8"),
    readFile(
      new URL("../content/modules/26_systems_capstone_open_source_stewardship.md", import.meta.url),
      "utf8",
    ),
    readFile(new URL("../content/source-maps/module25_evidence_grounded_intelligent_systems_source_map.md", import.meta.url), "utf8"),
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
  assert.match(m25, /### Cross-module re-entry — formulate the claim before the score/u);
  assert.match(m25, /### Cross-module re-entry — lineage, representation, and execution/u);
  assert.match(m25, /### Cross-module re-entry — control, calibration, and reliability/u);
  for (const artifact of [
    /Optimization and Information Evidence\s+Dossier/u,
    /Formal Limits Claim Packet/u,
    /Classical AI Search, Constraints\s+& Decision Packet/u,
    /Machine Learning & Representation Dossier/u,
    /Statistical Learning Theory & Reliable Deep-Learning Systems\s+Dossier/u,
  ]) {
    assert.match(m25, artifact);
    assert.match(m25SourceMap, artifact);
  }
  assert.match(m25, /\[UNAVAILABLE — reason and affected\s+claim\]/u);
  assert.match(m25SourceMap, /Advanced re-entry/u);
  assert.match(m26SourceMap, /M24 evidence thread → M31–M36 synthesis gate → M25 → M26/u);
  assert.match(m26SourceMap, /connected \*\*evidence roles\*\*, not next\/previous navigation/u);
  assert.doesNotMatch(m26SourceMap, /M24 → M25 → M26 connected sequence/u);
  for (const sourceMap of [m25SourceMap, m26SourceMap]) {
    assert.match(sourceMap, /## Two access gates: portal promotion and private guided study/u);
    assert.match(sourceMap, /Private guided study may begin only from learner-supplied upstream artifacts/u);
    assert.match(sourceMap, /PRIVATE_GUIDED_LEARNING_ROUTE\.md/u);
    assert.match(sourceMap, /never changes portal\s+access,\s+route\s+credit,\s+publication,\s+or\s+release state/u);
  }
  assert.match(contracts, /Machine Learning & Representation Dossier and learner-controlled oral-defense summary/u);
  assert.match(
    contracts,
    /Statistical Learning Theory & Reliable Deep-Learning Systems Dossier and learner-controlled oral-defense summary/u,
  );
  for (const material of [m25, m26]) {
    assert.match(material, /said `records on` in that exact chat/u);
    assert.match(material, /`pause records` nor\s+`off-record`/u);
  }
  assert.match(guidedRoute, /## Private M25\/M26 evidence gate/u);
  assert.match(guidedRoute, /Start M25 private study/u);
  assert.match(guidedRoute, /Start M26 private study/u);
  assert.match(guidedRoute, /final named dossier\/packet from \*\*each of\s+M31–M36\*\*/u);
  assert.match(
    guidedRoute,
    /simulated\/local `RELEASE`\/`REVISE`\/`DEFER`\/`ROLLBACK`\s+recommendation/u,
  );
  assert.match(guidedRoute, /Portal M25\/M26 preview guides/u);
  assert.match(guidedRoute, /M25 evidence-synthesis orientation/u);
  assert.match(guidedRoute, /M26 pre-capstone architecture rehearsal/u);
  assert.match(guidedRoute, /\[UNAVAILABLE — PRESERVE PREVIEW GATE\]/u);
  assert.match(guidedRoute, /`REHEARSAL ONLY`/u);

  assert.match(
    m25,
    /Preview mode now: as preview artifacts, you may create only a `PREVIEW ONLY`[\s>]+gate card and one future-M26 question[\s\S]{0,260}built-in bounded,[\s>]+non-credit orientation diagnostics/u,
  );
  assert.match(
    m25,
    /Do not use the[\s>]+later studio, dossier, oral-defense, project, or Module 26 handoff\/unlock[\s>]+language as current learner work/u,
  );
  assert.match(m25, /private guided-study evidence gate/u);
  assert.match(m25, /Full-module outcome — after the gate opens/u);
  assert.match(
    m25,
    /Preview reading boundary:[\s\S]{0,720}private guided-study evidence gate/u,
  );
  const m25TaPromptStart = m25.indexOf("### Teaching Assistant oral-defense prompt — M25");
  const m25TaPromptEnd = m25.indexOf("### Study Partner live-rehearsal prompt — M25", m25TaPromptStart);
  const m25TaPrompt = m25.slice(m25TaPromptStart, m25TaPromptEnd);
  assert.match(m25TaPrompt, /one prospective M26 question[\s\S]{0,120}does\s+not itself unlock M26/u);
  assert.doesNotMatch(m25TaPrompt, /remaining uncertainty, and M26 handoff/u);
  assert.match(
    m25TaPrompt,
    /Use this full-module\s+oral-defense prompt only after the private guided-study evidence gate is met/u,
  );
  const m25StudyPartnerStart = m25TaPromptEnd;
  const m25StudyPartnerEnd = m25.indexOf("### Learner-controlled note boundary", m25StudyPartnerStart);
  const m25StudyPartner = m25.slice(m25StudyPartnerStart, m25StudyPartnerEnd);
  assert.match(
    m25StudyPartner,
    /Use this full-module\s+rehearsal\s+prompt only after the private guided-study evidence gate is met/u,
  );
  const m25ProjectStart = m25.indexOf("### Project — Atlas Next-Step Evidence Studio");
  const m25ProjectEnd = m25.indexOf("### Advanced Evidence Annex", m25ProjectStart);
  const m25Project = m25.slice(m25ProjectStart, m25ProjectEnd);
  assert.match(
    m25Project,
    /Full private-module project:\*{0,2}\s+Use this only after the private guided-study[\s>]+evidence gate is satisfied/u,
  );

  assert.match(
    m26,
    /Private guided Days 56–60[\s\S]{0,180}private\s+guided-study evidence gate is met/u,
  );
  assert.match(
    m26,
    /(?:>\s*)?\*{0,2}Portal preview mode now:\*{0,2}\s+as a preview artifact, you may make only a[\s>]+`REHEARSAL ONLY` framing[\s>]+card[\s\S]{0,260}built-in bounded,[\s>]+non-credit orientation diagnostics/u,
  );
  assert.match(
    m26,
    /Do not[\s>]+use the later studio, project, oral defense, or[\s>]+`RELEASE`\/`REVISE`\/`DEFER`\/`ROLLBACK` language as a current capstone decision/u,
  );
  assert.match(
    m26,
    /Preview reading boundary:[\s\S]{0,720}private guided-study[\s>]+evidence gate above permits[\s>]+the same six sessions/u,
  );
  const m26TaPromptStart = m26.indexOf("### Teaching Assistant oral-defense prompt — M26");
  const m26TaPromptEnd = m26.indexOf("### Study Partner live-rehearsal prompt — M26", m26TaPromptStart);
  const m26TaPrompt = m26.slice(m26TaPromptStart, m26TaPromptEnd);
  assert.match(
    m26TaPrompt,
    /Use this full-module\s+oral-defense prompt only after the private guided-study evidence gate is met/u,
  );
  const m26StudyPartnerStart = m26TaPromptEnd;
  const m26StudyPartnerEnd = m26.indexOf("### Learner-controlled note boundary", m26StudyPartnerStart);
  const m26StudyPartner = m26.slice(m26StudyPartnerStart, m26StudyPartnerEnd);
  assert.match(
    m26StudyPartner,
    /Use this full-module\s+rehearsal\s+prompt only after the private guided-study evidence gate is met/u,
  );
  const m26ProjectStart = m26.indexOf("### Project — Atlas Release Dossier / Open-Source Stewardship Track");
  const m26ProjectEnd = m26.indexOf("### Release decisions are not pass/fail theater", m26ProjectStart);
  const m26Project = m26.slice(m26ProjectStart, m26ProjectEnd);
  assert.match(
    m26Project,
    /Full private-module project:\*{0,2}\s+Use this only after the private[\s>]+guided-study evidence gate is satisfied/u,
  );
  assert.match(
    m26Project,
    /In the portal preview, create only[\s>]+the `REHEARSAL ONLY` framing card/u,
  );
  assert.match(m26, /### External-track selection check/u);
  assert.match(m26, /recent release, commit, issue, or contribution\s+activity/u);
  assert.match(m26, /documented issue\/request/u);
  assert.match(m26, /### Versioning, compatibility, deprecation, and license obligations/u);
  assert.match(m26, /\|\s*Deprecation\s*\|\s*owner,\s*reason,\s*affected versions/u);
  assert.match(m26, /\|\s*Dependency and license\s*\|/u);
  assert.match(
    m26,
    /Private guided-route constraint:[\s\S]{0,420}outside this[\s>]+private guided route[\s\S]{0,220}not a[\s>]+requested course artifact or evidence/u,
  );
  assert.match(m26SourceMap, /Open Source\s+Excursion/u);
});

test("the v1 M31–M36 audit identifies its graph as a frozen historical fixture", async () => {
  const audit = JSON.parse(
    await readFile(new URL("../docs/archive/publication-readiness/M31_M36_PUBLICATION_READINESS_AUDIT.v1.json", import.meta.url), "utf8"),
  );

  assert.match(audit.scope.purpose, /audited historical commit/u);
  assert.match(audit.scope.purpose, /frozen historical fixture/u);
  assert.match(audit.evidenceSources[0].observation, /Frozen historical source/u);
  assert.match(audit.evidenceSources[0].observation, /active repository canonical graph is v2/u);
});
