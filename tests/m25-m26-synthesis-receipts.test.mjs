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

  assert.match(
    m25,
    /Preview mode now: you may create only a `PREVIEW ONLY` gate card and one future-M26 question/u,
  );
  assert.match(
    m25,
    /Do not use the later studio, dossier, oral-defense, project, or Module 26 handoff\/unlock language as current learner work/u,
  );
  assert.match(m25, /Full-module outcome — after the gate opens/u);
  assert.match(
    m25,
    /Preview reading boundary:[\s\S]{0,260}orientation map for after the gate opens/u,
  );
  const m25TaPromptStart = m25.indexOf("### Teaching Assistant oral-defense prompt — M25");
  const m25TaPromptEnd = m25.indexOf("### Study Partner live-rehearsal prompt — M25", m25TaPromptStart);
  const m25TaPrompt = m25.slice(m25TaPromptStart, m25TaPromptEnd);
  assert.match(m25TaPrompt, /one future-M26 question, without a handoff or\s+unlock/u);
  assert.doesNotMatch(m25TaPrompt, /remaining uncertainty, and M26 handoff/u);
  assert.match(
    m25TaPrompt,
    /Use this full-module\s+oral-defense prompt only after the M25 preview\s+gate opens/u,
  );
  const m25StudyPartnerStart = m25TaPromptEnd;
  const m25StudyPartnerEnd = m25.indexOf("### Learner-controlled note boundary", m25StudyPartnerStart);
  const m25StudyPartner = m25.slice(m25StudyPartnerStart, m25StudyPartnerEnd);
  assert.match(
    m25StudyPartner,
    /Use this full-module\s+rehearsal\s+prompt only after the M25\s+preview gate opens/u,
  );
  const m25ProjectStart = m25.indexOf("### Project — Atlas Next-Step Evidence Studio");
  const m25ProjectEnd = m25.indexOf("### Advanced Evidence Annex", m25ProjectStart);
  const m25Project = m25.slice(m25ProjectStart, m25ProjectEnd);
  assert.match(
    m25Project,
    /Future full-module project:\*{0,2}\s+Use this only after the M25 preview gate opens/u,
  );

  assert.match(
    m26,
    /only after M25 and its\s+M31–M36\s+prerequisite chain have actual learner-ready\s+release evidence/u,
  );
  assert.match(
    m26,
    /Preview mode now: you may make only a `REHEARSAL ONLY` framing card/u,
  );
  assert.match(
    m26,
    /Do not use the later studio, project, oral defense, or `RELEASE`\/`REVISE`\/`DEFER`\/`ROLLBACK` language as a current capstone decision/u,
  );
  assert.match(
    m26,
    /Preview reading boundary:[\s\S]{0,260}for after the prerequisite gate opens/u,
  );
  const m26TaPromptStart = m26.indexOf("### Teaching Assistant oral-defense prompt — M26");
  const m26TaPromptEnd = m26.indexOf("### Study Partner live-rehearsal prompt — M26", m26TaPromptStart);
  const m26TaPrompt = m26.slice(m26TaPromptStart, m26TaPromptEnd);
  assert.match(
    m26TaPrompt,
    /Use this full-module\s+oral-defense prompt only after M25 and its\s+M31–M36\s+prerequisite chain has\s+actual learner-ready\s+release evidence/u,
  );
  const m26StudyPartnerStart = m26TaPromptEnd;
  const m26StudyPartnerEnd = m26.indexOf("### Learner-controlled note boundary", m26StudyPartnerStart);
  const m26StudyPartner = m26.slice(m26StudyPartnerStart, m26StudyPartnerEnd);
  assert.match(
    m26StudyPartner,
    /Use this full-module\s+rehearsal\s+prompt only after M25 and its\s+M31–M36\s+prerequisite chain has\s+actual learner-ready\s+release evidence/u,
  );
  const m26ProjectStart = m26.indexOf("### Project — Atlas Release Dossier / Open-Source Stewardship Track");
  const m26ProjectEnd = m26.indexOf("### Release decisions are not pass/fail theater", m26ProjectStart);
  const m26Project = m26.slice(m26ProjectStart, m26ProjectEnd);
  assert.match(
    m26Project,
    /Future full-module project:\*{0,2}\s+Use this only after M25 and its M31–M36/u,
  );
  assert.match(m26Project, /prerequisite chain has actual learner-ready release evidence/u);
  assert.match(m26, /### External-track selection check/u);
  assert.match(m26, /recent release, commit, issue, or contribution\s+activity/u);
  assert.match(m26, /documented issue\/request/u);
  assert.match(m26SourceMap, /Open Source\s+Excursion/u);
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
