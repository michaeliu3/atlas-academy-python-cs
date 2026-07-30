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
import {
  loadModuleContractEvidenceRegistry,
  validateModuleContractEvidenceRegistry,
} from "../scripts/module-contract-evidence.mjs";

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
  assert.deepEqual(report.draftEvidence?.summary, {
    draftPilotModules: 2,
    resolvedPointers: 37,
    humanReviews: 0,
    publicationChanges: 0,
  });
});

test("the v2 draft evidence fixture resolves local visible anchors without review or release claims", async () => {
  const registry = await loadModuleContractEvidenceRegistry();
  const report = await validateModuleContractEvidenceRegistry(registry);

  assert.deepEqual(registry.pilotModuleIds, ["m21", "m27"]);
  assert.equal(report.summary.draftPilotModules, 2);
  assert.equal(report.summary.resolvedPointers, 37);
  assert.equal(report.summary.humanReviews, 0);
  assert.equal(report.summary.publicationChanges, 0);
  assert.ok(
    report.resolvedPointers.every(
      ({ path, heading }) => path.startsWith("content/") && heading.id.length > 0,
    ),
  );
});

test("the v2 evidence schema rejects unresolved anchors, path escapes, and approval-shaped pilot state", async () => {
  const registry = await loadModuleContractEvidenceRegistry();

  const badAnchor = structuredClone(registry);
  badAnchor.modules[0].pointers[0].headingAnchor = "not-a-real-visible-anchor";
  await assert.rejects(
    validateModuleContractEvidenceRegistry(badAnchor),
    /does not contain that visible h2\/h3 heading anchor/u,
  );

  const escapedPath = structuredClone(registry);
  escapedPath.modules[0].pointers[0].path = "content/modules/../outside.md";
  await assert.rejects(
    validateModuleContractEvidenceRegistry(escapedPath),
    /must stay below content\/ as a normalized Markdown path/u,
  );

  const approvalShapedState = structuredClone(registry);
  approvalShapedState.modules[0].reviewState = "approved";
  approvalShapedState.modules[0].publicationEffect = "verified";
  await assert.rejects(
    validateModuleContractEvidenceRegistry(approvalShapedState),
    /cannot record approval/u,
  );

  const excessPilot = structuredClone(registry);
  excessPilot.pilotModuleIds.push("m22");
  excessPilot.modules.push({
    ...structuredClone(excessPilot.modules[0]),
    moduleId: "m22",
  });
  await assert.rejects(
    validateModuleContractEvidenceRegistry(excessPilot),
    /may contain at most two pilot module IDs/u,
  );
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
    (error) => {
      assert.match(error.message, /30 legacy baseline module\(s\) cannot pass strict release validation/u);
      assert.doesNotMatch(error.message, /Draft v2 evidence/u);
      return true;
    },
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
