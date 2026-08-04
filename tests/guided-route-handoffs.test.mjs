import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { loadCourseGraph } from "../scripts/course-graph.mjs";

async function workbook(filename) {
  return readFile(new URL(`../content/modules/${filename}`, import.meta.url), "utf8");
}

test("guided handoff copy preserves the required mathematical bridges", async () => {
  const [graph, moduleFive, moduleSeventeen] = await Promise.all([
    loadCourseGraph(),
    workbook("05_cost_models_algorithm_analysis.md"),
    workbook("17_computer_architecture_execution_stack.md"),
  ]);
  const m05 = graph.modules.find(({ id }) => id === "m05");
  const m17 = graph.modules.find(({ id }) => id === "m17");

  assert.equal(m05.forwardModuleNumber, 27);
  assert.match(
    moduleFive,
    /Carry the representation\/cost trade-off into \*\*M27\*\*[\s\S]{0,260}\*\*M6\*\*/u,
  );
  assert.match(moduleFive, /EXPLAIN --> M27/u);
  assert.equal(m17.forwardModuleNumber, 28);
  assert.match(moduleSeventeen, /### Forward handoff — M28/u);
  assert.match(
    moduleSeventeen,
    /M28–M31[\s\S]{0,260}\*\*M18\*\*/u,
  );
  assert.match(moduleSeventeen, /CLAIM --> M28/u);
  assert.doesNotMatch(
    moduleSeventeen,
    /\| Ready \| reasoning transfers and all boundaries hold \| proceed to M18 \|/u,
  );
  assert.match(
    moduleSeventeen,
    /continue with the M28 handoff; retain M18 questions for the later systems bridge/u,
  );
});

test("private guided continuation remains distinct from portal release", async () => {
  const [graph, moduleTwentyFour, moduleThirtyOne, moduleThirtyTwo, moduleThirtySix, privateRoute, openMaterialPlans, routePage, liveWorkflow, completionSnapshot, complianceMatrix] = await Promise.all([
    loadCourseGraph(),
    workbook("24_cpython_performance_memory.md"),
    readFile(
      new URL(
        "../content/authoring/m31_optimization_information_workbook.v1.md",
        import.meta.url,
      ),
      "utf8",
    ),
    readFile(
      new URL(
        "../content/authoring/m32_systems_languages_scientific_python_accelerators_workbook.v1.md",
        import.meta.url,
      ),
      "utf8",
    ),
    readFile(
      new URL(
        "../content/authoring/m36_statistical_learning_theory_reliable_deep_learning_workbook.v1.md",
        import.meta.url,
      ),
      "utf8",
    ),
    readFile(new URL("../docs/PRIVATE_GUIDED_LEARNING_ROUTE.md", import.meta.url), "utf8"),
    readFile(new URL("../docs/LEARNER_ROUTE_PLANS.md", import.meta.url), "utf8"),
    readFile(new URL("../app/route/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../docs/LIVE_CODEX_LEARNING_WORKFLOW.md", import.meta.url), "utf8"),
    readFile(new URL("../docs/COURSE_COMPLETION_SNAPSHOT.md", import.meta.url), "utf8"),
    readFile(new URL("../docs/GOAL_COMPLIANCE_MATRIX.md", import.meta.url), "utf8"),
  ]);

  assert.match(
    moduleTwentyFour,
    /designated private guided study[\s\S]{0,260}not a portal unlock, Core credit, or\s+release claim/u,
  );
  assert.match(privateRoute, /M18–M24 → M32/u);
  assert.equal(graph.modules.find(({ id }) => id === "m31").forwardModuleNumber, 18);
  assert.match(
    routePage,
    /ready for designated private guided study[\s\S]{0,180}formal review and release evidence remain pending/u,
  );
  assert.doesNotMatch(routePage, /release material is reviewed/u);
  assert.match(
    privateRoute,
    /four short M28\/M29\/M30\s+retrieval checks/u,
  );
  assert.match(privateRoute, /for a finite joint distribution/u);
  assert.ok(privateRoute.includes("\\mathbb E[\\widehat g_t\\mid\\mathcal F_{t-1}]"));
  assert.match(privateRoute, /M31 bounded reference-card set/u);
  assert.match(privateRoute, /Start M31 private study/u);
  assert.match(privateRoute, /no separate pilot or rehearsal\s+is needed to begin/u);
  assert.match(
    privateRoute,
    /M31 authoring workbook[\s\S]{0,480}separate scope-review copy/u,
  );
  assert.doesNotMatch(privateRoute, /M31 20–40-minute pilot run card/u);
  assert.match(privateRoute, /m31RidgeConditioningCard\(\)/u);
  assert.match(privateRoute, /m31GradientDescentRateCard\(10\)/u);
  assert.match(privateRoute, /evaluateM31BinaryChannelDistortion/u);
  assert.match(privateRoute, /m31TwoStateElboCard\(\)/u);
  assert.match(
    privateRoute,
    /Start M33, Session 1[\s\S]{0,360}named M33 authoring-workbook Session 1 section, not\s+the\s+frozen\s+review\s+candidate[\s\S]{0,260}Language–Machine Separation Sheet/u,
  );
  assert.match(
    privateRoute,
    /Start M34, Session 1[\s\S]{0,360}named M34 authoring-workbook Session 1 section, not\s+the\s+frozen\s+review\s+candidate[\s\S]{0,260}State-Space Model Card/u,
  );
  assert.match(
    privateRoute,
    /Start M35, Session 1[\s\S]{0,720}named M35 authoring-workbook Session 1 section, not\s+the\s+frozen\s+review\s+candidate[\s\S]{0,320}Representation-Assumption Sheet/u,
  );
  assert.match(
    privateRoute,
    /Start M36, Session 1[\s\S]{0,720}named M36 authoring-workbook Session 1 section, not\s+the\s+frozen\s+review\s+candidate[\s\S]{0,420}Assumption-Scope Sheet, Empirical–Population Scope Card, and Initial\s+Reliable-Learning Evidence Map/u,
  );
  assert.match(moduleThirtyTwo, /\*\*Canonical academic prerequisites:\*\*/u);
  assert.match(
    moduleThirtyTwo,
    /required\s+learning bridges for private instructor-led study[\s\S]{0,220}not make their academic prerequisites optional/u,
  );
  assert.match(
    moduleThirtyOne,
    /canonical forward handoff is a conceptual systems cross-link to \*\*M18\*\*/u,
  );
  assert.match(moduleThirtyOne, /reader-visible reference previews[\s\S]{0,180}Core-credit-gated/u);
  assert.match(
    moduleThirtySix,
    /Private study does not unlock[\s\S]{0,180}grant Core credit/u,
  );
  assert.match(
    moduleThirtySix,
    /non-credit discussion of M25's reader-visible reference preview[\s\S]{0,240}M25's separate promotion requirements still apply/u,
  );
  assert.match(
    privateRoute,
    /M25 private evidence-gated synthesis[\s\S]{0,220}M26 private evidence-gated local capstone/u,
  );
  assert.match(privateRoute, /## Private M25\/M26 evidence gate/u);
  assert.match(privateRoute, /Start M25 private study/u);
  assert.match(privateRoute, /Start M26 private study/u);
  assert.match(
    privateRoute,
    /final named dossier\/packet from \*\*each of\s+M31–M36\*\*/u,
  );
  assert.match(privateRoute, /instruction-start gate, not a grade, platform feature, or portal-state\s+change/u);
  assert.match(
    privateRoute,
    /simulated\/local `RELEASE`\/`REVISE`\/`DEFER`\/`ROLLBACK` recommendation[\s\S]{0,260}never authorizes an\s+actual deployment/u,
  );
  for (const summary of [openMaterialPlans, liveWorkflow, completionSnapshot, complianceMatrix]) {
    assert.match(
      summary,
      /M26 additionally requires the\s+resulting M25 Next-Step Evidence Dossier, Advanced Evidence Annex, and\s+carried-forward receipts/u,
    );
  }
  const m25 = graph.modules.find(({ id }) => id === "m25");
  const m26 = graph.modules.find(({ id }) => id === "m26");
  assert.equal(m25?.state.readerAccess, "preview");
  assert.equal(m25?.state.availability, "preview");
  assert.equal(m26?.state.readerAccess, "preview");
  assert.equal(m26?.state.availability, "preview");
  assert.match(
    openMaterialPlans,
    /## Choose the study surface before choosing a calendar[\s\S]{0,720}Private guided course/u,
  );
  assert.match(
    openMaterialPlans,
    /In the \*\*portal\/open-material route\*\*,[\s\S]{0,300}private chat-led guided study/u,
  );
  assert.match(routePage, /intended 36-module dependency sequence/u);
  assert.match(routePage, /Primary guided learning happens in Codex/u);
  assert.match(routePage, /Teaching Assistant and Study Partner guide/u);
  assert.match(routePage, /eligible learner-ready work/u);
  assert.match(
    routePage,
    /portal click, preview, or oral conversation never\s+automatically creates a record or Core credit/u,
  );
});

test("private advanced packs provide a bounded Session 2–6 chat continuation", async () => {
  const privateRoute = await readFile(
    new URL("../docs/PRIVATE_GUIDED_LEARNING_ROUTE.md", import.meta.url),
    "utf8",
  );

  assert.match(privateRoute, /## Continue M31–M36 after Session 1/u);
  assert.match(privateRoute, /M31, M32, M33, M34, M35, and M36/u);
  assert.match(
    privateRoute,
    /Sessions 2–5[\s\S]{0,900}Study Partner → TA checkpoint/u,
  );
  assert.match(privateRoute, /optional\s+short checkpoint/u);
  assert.match(privateRoute, /not the module oral defense/u);
  assert.match(
    privateRoute,
    /predict the result and give my confidence[\s\S]{0,80}\(0–100\)/u,
  );
  assert.match(
    privateRoute,
    /Session 6[\s\S]{0,900}supportive Teaching Assistant oral defense/u,
  );
  assert.match(privateRoute, /adaptive and non-grading/u);
  assert.match(
    privateRoute,
    /not a grade, release, unlock, or credit/u,
  );
  assert.match(
    privateRoute,
    /records on[\s\S]{0,260}off-record/u,
  );
  assert.match(privateRoute, /Replace each bracketed field before sending/u);
  assert.match(privateRoute, /exact artifact name\(s\); list each when the session has more than one/u);
  assert.match(
    privateRoute,
    /readable equations, labelled code, or compact traces[\s\S]{0,180}prose\/ASCII fallback/u,
  );
  assert.match(
    privateRoute,
    /approved integration is available, and the session is\s+substantive/u,
  );
});
