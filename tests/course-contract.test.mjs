import assert from "node:assert/strict";
import test from "node:test";
import { loadCourseGraph } from "../scripts/course-graph.mjs";
import {
  loadCourseContracts,
  runCourseValidation,
  validateCourseContracts,
} from "../scripts/validate-course.mjs";

test("the v1 contract registry covers every legacy published workbook structurally", async () => {
  const [graph, contracts] = await Promise.all([
    loadCourseGraph(),
    loadCourseContracts(),
  ]);
  const report = await validateCourseContracts(graph, contracts);

  assert.deepEqual(report.errors, []);
  assert.equal(report.summary.legacyBaselineModules, 30);
  assert.equal(report.summary.verifiedModules, 0);
  assert.equal(report.summary.authoringOnlyModules, 6);
  assert.ok(report.warnings.some((warning) => warning.includes("human review")));
});

test("a newly published module cannot use the legacy contract exception", async () => {
  const [graph, contracts] = await Promise.all([
    loadCourseGraph(),
    loadCourseContracts(),
  ]);
  const candidate = structuredClone(graph);
  const module31 = candidate.modules.find((courseModule) => courseModule.number === 31);
  module31.lifecycle = "published";
  module31.availability = "published";
  module31.releaseEvidence.status = "legacy-audit-pending";

  await assert.rejects(
    validateCourseContracts(candidate, contracts),
    /may not use the legacy contract exception/,
  );
});

test("strict release validation refuses legacy baseline evidence", async () => {
  await assert.rejects(
    () => runCourseValidation({ strict: true }),
    /cannot pass strict release validation/u,
  );
});
