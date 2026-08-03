import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { loadCourseGraph, projectReaderModules } from "../scripts/course-graph.mjs";
import { runModuleCandidateEvidencePreflight } from "../scripts/module-evidence-preflight.mjs";

const testDirectory = dirname(fileURLToPath(import.meta.url));
const siteRoot = resolve(testDirectory, "..");

test("M17 is an inspectable candidate on the M16 → M17 → M28 route without promotion", async () => {
  const workbook = await readFile(
    resolve(siteRoot, "content/modules/17_computer_architecture_execution_stack.md"),
    "utf8",
  );

  assert.equal((workbook.match(/^## Session [1-6] —/gmu) ?? []).length, 6);
  assert.equal((workbook.match(/^### Session [1-6] output —/gmu) ?? []).length, 6);
  assert.match(workbook, /^## Conversational oral defense — M17$/mu);
  assert.match(workbook, /\b(?:not a score|not scored|non-scored)\b/iu);
  assert.match(workbook, /\b(?:not timed|non-timed)\b/iu);
  assert.match(workbook, /\bGPT(?:\s+Live)?\b[\s\S]*?\bwhiteboard\b/iu);
  assert.match(
    workbook,
    /cannot\s+control voice availability,\s+quality settings,\s+rendering,\s+retention,\s+or\s+integrations/u,
  );
  assert.match(workbook, /readable text\s+with Markdown and an ASCII trace/u);
  assert.match(workbook, /cannot write Notion evidence\s+automatically/u);
  assert.match(workbook, /M18's sole academic prerequisite is M17/u);
  assert.match(workbook, /canonical reader route/u);
  assert.doesNotMatch(workbook, /The arrows are prerequisites/u);
  assert.match(workbook, /\]\(\/downloads\/test_module17_reference\.py\)/u);
  assert.doesNotMatch(workbook, /\b(?:four|six)-minute\b/iu);

  const graph = await loadCourseGraph(siteRoot);
  const m17 = graph.modules.find(({ id }) => id === "m17");
  const m18 = graph.modules.find(({ id }) => id === "m18");
  assert.deepEqual(m17?.academicPrerequisiteNumbers, [16]);
  assert.equal(m17?.forwardModuleNumber, 28);
  assert.equal(m17?.state.lifecycle, "learner-material-ready");
  assert.equal(m17?.state.readerAccess, "full");
  assert.equal(m17?.state.availability, "legacy-open");
  assert.equal(m17?.state.contract.state, "legacy-baseline");
  assert.equal(m17?.state.release.state, "unrecorded");
  assert.deepEqual(m18?.academicPrerequisiteNumbers, [17]);

  const readerByNumber = new Map(
    projectReaderModules(graph).map((courseModule) => [courseModule.number, courseModule]),
  );
  assert.equal(readerByNumber.get(16)?.nextRouteNumber, 17);
  assert.equal(readerByNumber.get(17)?.previousRouteNumber, 16);
  assert.equal(readerByNumber.get(17)?.nextRouteNumber, 28);
  assert.equal(readerByNumber.get(28)?.previousRouteNumber, 17);

  const preflight = await runModuleCandidateEvidencePreflight("m17", { siteRoot });
  assert.equal(preflight.state, "candidate-not-promoting");
  assert.equal(preflight.contractState, "legacy-baseline");
  assert.equal(preflight.evidenceRecordPath, "content/course/contracts/evidence/m17.v1.json");
  assert.equal(preflight.evidenceReport.evidenceByCriterion.size, 18);
  assert.ok(preflight.evidenceReport.evidenceByCriterion.has("prediction-before-reveal"));
  assert.deepEqual(preflight.openCriterionIds, [
    "release-provenance-ci-and-deployment-evidence",
  ]);
});
