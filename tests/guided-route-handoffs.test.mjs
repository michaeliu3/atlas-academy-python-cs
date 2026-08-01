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
    /continue to M28; retain M18 questions for the later systems bridge/u,
  );
});

test("private guided continuation remains distinct from portal release", async () => {
  const [graph, moduleTwentyFour, moduleThirtyOne, moduleThirtyTwo, moduleThirtySix, privateRoute, routePage] = await Promise.all([
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
    readFile(new URL("../app/route/page.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(
    moduleTwentyFour,
    /private instructor-led draft study[\s\S]{0,260}not a portal unlock, Core credit, or\s+release claim/u,
  );
  assert.match(privateRoute, /M18–M24 → M32/u);
  assert.equal(graph.modules.find(({ id }) => id === "m31").forwardModuleNumber, 18);
  assert.match(moduleThirtyTwo, /\*\*Canonical academic prerequisites:\*\*/u);
  assert.match(
    moduleThirtyTwo,
    /required\s+learning bridges for private instructor-led study[\s\S]{0,220}not make their academic prerequisites optional/u,
  );
  assert.match(moduleThirtyOne, /next academic continuation is \*\*M18\*\*/u);
  assert.match(moduleThirtyOne, /reader-visible reference previews[\s\S]{0,180}Core-credit-gated/u);
  assert.match(
    moduleThirtySix,
    /Private study does not unlock[\s\S]{0,180}grant Core credit/u,
  );
  assert.match(
    moduleThirtySix,
    /non-credit discussion of M25's reader-visible reference preview[\s\S]{0,240}M25's separate promotion requirements still apply/u,
  );
  assert.match(routePage, /Private guided continuation/u);
  assert.match(routePage, /Teaching Assistant and Study Partner guide/u);
});
