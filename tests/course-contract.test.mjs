import assert from "node:assert/strict";
import test from "node:test";
import {
  loadAdvancedModuleBridgeLedger,
  validateAdvancedModuleBridgeLedger,
} from "../scripts/advanced-module-bridge.mjs";
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

test("the advanced prerequisite-session bridge covers every authoring-only graph edge", async () => {
  const [graph, bridgeLedger] = await Promise.all([
    loadCourseGraph(),
    loadAdvancedModuleBridgeLedger(),
  ]);

  assert.doesNotThrow(() => validateAdvancedModuleBridgeLedger(graph, bridgeLedger));
  assert.equal(bridgeLedger.modules.length, 6);
  assert.equal(
    bridgeLedger.modules.reduce(
      (count, moduleBridge) => count + moduleBridge.prerequisiteBridges.length,
      0,
    ),
    30,
  );
  assert.ok(
    bridgeLedger.modules.every((moduleBridge) => moduleBridge.sessionSpine.length === 6),
  );
});

test("the advanced bridge rejects a prerequisite that is not first consumed where claimed", async () => {
  const [graph, bridgeLedger] = await Promise.all([
    loadCourseGraph(),
    loadAdvancedModuleBridgeLedger(),
  ]);
  const invalidLedger = structuredClone(bridgeLedger);
  invalidLedger.modules[0].prerequisiteBridges[0].firstConsumingSessionId = "m31-s06";

  assert.throws(
    () => validateAdvancedModuleBridgeLedger(graph, invalidLedger),
    /first consuming session must be the first declared use/u,
  );
});
