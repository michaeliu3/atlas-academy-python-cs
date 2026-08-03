import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { loadCourseGraph, projectReaderModules } from "../scripts/course-graph.mjs";
import { runModuleCandidateEvidencePreflight } from "../scripts/module-evidence-preflight.mjs";

const testDirectory = dirname(fileURLToPath(import.meta.url));
const siteRoot = resolve(testDirectory, "..");

test("M18 is an inspectable candidate bridge from M17 foundations into M19 without promotion", async () => {
  const workbook = await readFile(
    resolve(siteRoot, "content/modules/18_operating_systems_resource_mediation.md"),
    "utf8",
  );

  assert.equal((workbook.match(/^## Session [1-6] —/gmu) ?? []).length, 6);
  assert.equal((workbook.match(/^### Session [1-6] output —/gmu) ?? []).length, 6);
  assert.match(workbook, /^## Conversational oral defense — M18$/mu);
  assert.match(workbook, /\b(?:not a score|not scored|non-scored)\b/iu);
  assert.match(workbook, /\b(?:not timed|non-timed)\b/iu);
  assert.match(workbook, /\bGPT(?:\s+Live)?\b[\s\S]*?\bwhiteboard\b/iu);
  assert.match(workbook, /GPT\s+Live\s+at\s+a\s+preferred\s+High\s+setting\s+when\s+available/iu);
  assert.match(
    workbook,
    /cannot\s+control voice availability,\s+quality settings,\s+rendering,\s+retention,\s+or\s+integrations/u,
  );
  assert.match(workbook, /readable text\s+with Markdown and an ASCII/u);
  assert.match(workbook, /cannot write Notion evidence\s+automatically/u);
  assert.match(workbook, /M18's sole academic prerequisite is M17/u);
  assert.match(
    workbook,
    /M31[\s\S]*?reader[\s\S]*?narrative[\s\S]*?not[\s\S]*?academic prerequisite/iu,
  );
  assert.match(workbook, /^### Prediction before reveal —/mu);
  assert.match(workbook, /\]\(\/downloads\/test_module18_reference\.py\)/u);
  assert.doesNotMatch(workbook, /\bfive-minute oral defense\b/iu);

  const graph = await loadCourseGraph(siteRoot);
  const m18 = graph.modules.find(({ id }) => id === "m18");
  const m19 = graph.modules.find(({ id }) => id === "m19");
  assert.deepEqual(m18?.academicPrerequisiteNumbers, [17]);
  assert.equal(m18?.forwardModuleNumber, 19);
  assert.equal(m18?.state.lifecycle, "learner-material-ready");
  assert.equal(m18?.state.readerAccess, "full");
  assert.equal(m18?.state.availability, "legacy-open");
  assert.equal(m18?.state.contract.state, "legacy-baseline");
  assert.equal(m18?.state.release.state, "unrecorded");
  assert.deepEqual(m19?.academicPrerequisiteNumbers, [18]);

  const readerByNumber = new Map(
    projectReaderModules(graph).map((courseModule) => [courseModule.number, courseModule]),
  );
  assert.equal(readerByNumber.get(18)?.nextRouteNumber, 19);
  assert.equal(readerByNumber.get(19)?.previousRouteNumber, 18);

  const preflight = await runModuleCandidateEvidencePreflight("m18", { siteRoot });
  assert.equal(preflight.state, "candidate-not-promoting");
  assert.equal(preflight.contractState, "legacy-baseline");
  assert.equal(preflight.evidenceRecordPath, "content/course/contracts/evidence/m18.v1.json");
  assert.equal(preflight.evidenceReport.evidenceByCriterion.size, 18);
  assert.ok(preflight.evidenceReport.evidenceByCriterion.has("prediction-before-reveal"));
  assert.deepEqual(preflight.openCriterionIds, [
    "release-provenance-ci-and-deployment-evidence",
  ]);
});
