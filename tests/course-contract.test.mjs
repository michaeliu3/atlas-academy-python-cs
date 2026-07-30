import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  loadAdvancedModuleBridgeLedger,
  validateAdvancedModuleBridgeLedger,
} from "../scripts/advanced-module-bridge.mjs";
import {
  advancedReleaseDocumentationPath,
  isAllowedAdvancedProvenancePath,
  loadAdvancedModuleContractRegistry,
  validateAdvancedModuleContractRegistry,
} from "../scripts/advanced-module-contract.mjs";
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
import {
  loadLegacyModuleContractAudit,
  renderLegacyModuleContractAuditReport,
  validateLegacyModuleContractAudit,
} from "../scripts/validate-legacy-module-contract-audit.mjs";

const testDirectory = dirname(fileURLToPath(import.meta.url));
const siteRoot = resolve(testDirectory, "..");

test("the lifecycle-aware advanced contract validates M31 authoring evidence without publication", async () => {
  const [graph, registry] = await Promise.all([
    loadCourseGraph(),
    loadAdvancedModuleContractRegistry(),
  ]);
  const report = await validateAdvancedModuleContractRegistry(graph, registry);

  assert.deepEqual(report.summary, {
    authoringOnlyContracts: 1,
    plannedContracts: 1,
    pointerPresentContracts: 0,
    reviewedContracts: 0,
    releaseReadyContracts: 0,
    resolvedContractInputs: 15,
  });
  assert.equal(report.modules[0].moduleId, "m31");
  assert.equal(report.modules[0].publicationEffect, "none");
  assert.equal(report.modules[0].promotionBlock.learnerManifest, "absent");
});

test("the advanced contract rejects premature M31 promotion and broken authoring evidence", async () => {
  const [graph, registry] = await Promise.all([
    loadCourseGraph(),
    loadAdvancedModuleContractRegistry(),
  ]);

  const prematurePromotion = structuredClone(registry);
  prematurePromotion.modules[0].publicationEffect = "eligible-for-publication";
  await assert.rejects(
    validateAdvancedModuleContractRegistry(graph, prematurePromotion),
    /may not claim an eligible-for-publication effect/u,
  );

  const missingSession = structuredClone(registry);
  missingSession.modules[0].authoringPlan.plannedSessionSpine.pop();
  await assert.rejects(
    validateAdvancedModuleContractRegistry(graph, missingSession),
    /must declare exactly six planned session IDs/u,
  );

  const prematureDeliveryMap = structuredClone(registry);
  prematureDeliveryMap.modules[0].deliveryMapInputId = "m31-source-map-sessions";
  await assert.rejects(
    validateAdvancedModuleContractRegistry(graph, prematureDeliveryMap),
    /authoring-only delivery map must remain null/u,
  );

  const arbitraryProvenance = structuredClone(registry);
  arbitraryProvenance.modules[0].contractInputs.find(
    ({ id }) => id === "m31-readiness-audit",
  ).path = "docs/RELEASE_PROVENANCE.md";
  await assert.rejects(
    validateAdvancedModuleContractRegistry(graph, arbitraryProvenance),
    /provenance path must use a fixed historical record or a module-scoped advanced-evidence slot/u,
  );

  const brokenPointer = structuredClone(registry);
  brokenPointer.modules[0].contractInputs.find(
    ({ id }) => id === "m31-source-map-claims",
  ).locator = "not-a-real-visible-heading";
  await assert.rejects(
    validateAdvancedModuleContractRegistry(graph, brokenPointer),
    /does not contain that visible heading/u,
  );

  const alteredGraph = structuredClone(graph);
  alteredGraph.modules.find(({ id }) => id === "m31").sourceMap =
    "content/source-maps/module31_optimization_information_source_map.md";
  await assert.rejects(
    validateAdvancedModuleContractRegistry(alteredGraph, registry),
    /sourceMap must remain null while it is authoring-only/u,
  );

  const malformedInputs = structuredClone(registry);
  malformedInputs.modules[0].contractInputs = {};
  await assert.rejects(
    validateAdvancedModuleContractRegistry(graph, malformedInputs),
    /Advanced module-contract validation failed:[\s\S]*contract inputs must be an array/u,
  );

  const malformedEvidence = structuredClone(registry);
  malformedEvidence.modules[0].evidence[0] = null;
  await assert.rejects(
    validateAdvancedModuleContractRegistry(graph, malformedEvidence),
    /Advanced module-contract validation failed:[\s\S]*contract evidence must match/u,
  );

  const prematureLifecycleTransition = structuredClone(graph);
  const module32 = prematureLifecycleTransition.modules.find(({ id }) => id === "m32");
  module32.lifecycle = "published";
  module32.availability = "published";
  await assert.rejects(
    validateAdvancedModuleContractRegistry(prematureLifecycleTransition, registry),
    /requires lifecycle-aware contract entries for all Modules 31–36/u,
  );

  const brokenBridgeTopology = await loadAdvancedModuleBridgeLedger();
  brokenBridgeTopology.modules[0].prerequisiteBridges[0].firstConsumingSessionId = "m31-s06";
  await assert.rejects(
    validateAdvancedModuleContractRegistry(graph, registry, {
      canonicalBridgeLedger: brokenBridgeTopology,
    }),
    /must preserve canonical bridge topology[\s\S]*first declared use/u,
  );

  await assert.rejects(
    validateAdvancedModuleContractRegistry(graph, registry, {
      learnerManifest: { modules: [{ id: "m31", number: 31 }] },
      learnerReadableModuleIds: ["m31"],
    }),
    /authoring-only but appears in a learner manifest or route/u,
  );
});

test("advanced provenance inputs use fixed historical records or narrow module-scoped slots", () => {
  assert.equal(
    isAllowedAdvancedProvenancePath("m31", "docs/M31_M36_PUBLICATION_READINESS_AUDIT.v1.json"),
    true,
  );
  assert.equal(
    isAllowedAdvancedProvenancePath("m36", "docs/M31_M36_PUBLICATION_READINESS_AUDIT.v1.json"),
    true,
  );
  assert.equal(
    isAllowedAdvancedProvenancePath("m31", "docs/advanced-evidence/m31/provenance.md"),
    true,
  );
  assert.equal(
    isAllowedAdvancedProvenancePath("m31", "docs/advanced-evidence/m31/source-review.md"),
    true,
  );
  assert.equal(
    isAllowedAdvancedProvenancePath("m31", "docs/advanced-evidence/m32/provenance.md"),
    false,
  );
  assert.equal(isAllowedAdvancedProvenancePath("m31", "docs/RELEASE_PROVENANCE.md"), false);
  assert.equal(
    isAllowedAdvancedProvenancePath("m31", "docs/advanced-evidence/m31/anything-else.md"),
    false,
  );
  assert.equal(
    advancedReleaseDocumentationPath("m31", "provenancePath"),
    "docs/advanced-evidence/m31/provenance.md",
  );
  assert.equal(
    advancedReleaseDocumentationPath("m31", "sourceReviewPath"),
    "docs/advanced-evidence/m31/source-review.md",
  );
  assert.equal(
    advancedReleaseDocumentationPath("m31", "knownLimitationsPath"),
    "docs/advanced-evidence/m31/known-limitations.md",
  );
  assert.equal(advancedReleaseDocumentationPath("m31", "unknownPath"), null);
  assert.equal(advancedReleaseDocumentationPath("m30", "provenancePath"), null);
});

test("a legacy module cannot become verified with free-form evidence strings", async () => {
  const [graph, contracts] = await Promise.all([
    loadCourseGraph(),
    loadCourseContracts(),
  ]);
  const forgedGraph = structuredClone(graph);
  forgedGraph.modules.find(({ id }) => id === "m29").releaseEvidence.status = "verified";
  const forgedContracts = structuredClone(contracts);
  const forgedM29 = forgedContracts.modules.find(({ moduleId }) => moduleId === "m29");
  forgedM29.publicationState = "verified";
  forgedM29.contractPacketId = "m29-forged-packet";
  forgedM29.humanReview = Object.fromEntries(
    Object.keys(forgedContracts.defaultHumanReview).map((dimension) => [dimension, "approved"]),
  );
  forgedM29.verification = {
    prerequisiteAndForwardMap: "x",
    sessionAnchors: "x",
    sourceLedger: "x",
    visualTextAlternatives: "x",
    diagnosticAndRetrieval: "x",
    projectEvidence: "x",
    oralDefense: "x",
    taPrompt: "x",
    studyPartnerPrompt: "x",
  };

  await assert.rejects(
    validateCourseContracts(forgedGraph, forgedContracts, { strict: true }),
    /may not use retired free-form verification evidence[\s\S]*requires a separately reviewed typed contract record/u,
  );
});

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
  assert.deepEqual(report.advancedContract?.summary, {
    authoringOnlyContracts: 1,
    plannedContracts: 1,
    pointerPresentContracts: 0,
    reviewedContracts: 0,
    releaseReadyContracts: 0,
    resolvedContractInputs: 15,
  });
  assert.ok(report.warnings.some((warning) => warning.includes("human review")));
  assert.deepEqual(report.draftEvidence?.summary, {
    draftPilotModules: 2,
    resolvedPointers: 37,
    humanReviews: 0,
    publicationChanges: 0,
  });
  assert.deepEqual(report.legacyPackets?.summary, {
    structuralCandidates: 2,
    resolvedPointers: 71,
    humanApprovals: 0,
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

test("the legacy module-contract audit resolves every M1–M30 pointer without approval or publication claims", async () => {
  const audit = await loadLegacyModuleContractAudit();
  const report = await validateLegacyModuleContractAudit(audit);

  assert.equal(report.summary.modules, 30);
  assert.equal(report.summary.totalCriteria, 480);
  assert.equal(report.summary.humanApprovals, 0);
  assert.equal(report.summary.publicationChanges, 0);
  assert.deepEqual(report.summary.byStatus, {
    "pointer-present": 283,
    ambiguous: 171,
    missing: 26,
  });
  assert.equal(audit.criterionIds.length, 16);
  assert.equal(
    report.summary.byCriterion["rigor-definitions-assumptions-derivations-proofs-counterexamples-numerical-experiments"].ambiguous,
    30,
  );
  assert.equal(report.summary.byCriterion["study-partner-prompt"].missing, 19);
  assert.equal(report.summary.byCriterion["supportive-oral-defense"].missing, 6);
});

test("the legacy module-contract report is a deterministic projection of the validated audit", async () => {
  const audit = await loadLegacyModuleContractAudit();
  const report = await validateLegacyModuleContractAudit(audit);
  const checkedInReport = await readFile(
    resolve(siteRoot, "docs", "LEGACY_MODULE_CONTRACT_AUDIT.md"),
    "utf8",
  );

  assert.equal(
    checkedInReport,
    renderLegacyModuleContractAuditReport(audit, report),
  );
});

test("the legacy module-contract audit rejects approval-shaped review state and unresolved anchors", async () => {
  const audit = await loadLegacyModuleContractAudit();

  const approvalShaped = structuredClone(audit);
  approvalShaped.modules[0].humanQualityReview = "approved";
  await assert.rejects(
    validateLegacyModuleContractAudit(approvalShaped),
    /cannot record human approval/u,
  );

  const unresolvedAnchor = structuredClone(audit);
  unresolvedAnchor.modules[0].evidence["first-principles"].anchors = ["not-a-visible-heading"];
  await assert.rejects(
    validateLegacyModuleContractAudit(unresolvedAnchor),
    /not visible in content\/modules\/01_values_state_execution\.md/u,
  );
});

test("the legacy module-contract audit rejects canonical-binding, schema, session, and unrelated-pointer mutations", async () => {
  const audit = await loadLegacyModuleContractAudit();

  const wrongWorkbook = structuredClone(audit);
  wrongWorkbook.modules[0].workbookPath = wrongWorkbook.modules[1].workbookPath;
  await assert.rejects(
    validateLegacyModuleContractAudit(wrongWorkbook),
    /workbookPath must equal canonical manifest workbook/u,
  );

  const duplicateSession = structuredClone(audit);
  duplicateSession.modules[0].sessionAnchors[1] = duplicateSession.modules[0].sessionAnchors[0];
  await assert.rejects(
    validateLegacyModuleContractAudit(duplicateSession),
    /sessionAnchors\.anchors may not repeat a heading/u,
  );

  const wrongOrderedSession = structuredClone(audit);
  wrongOrderedSession.modules[0].sessionAnchors[0] = wrongOrderedSession.modules[0].sessionAnchors[1];
  await assert.rejects(
    validateLegacyModuleContractAudit(wrongOrderedSession),
    /must be the unique ordered Session 1 anchor/u,
  );

  const arbitraryTaxonomy = structuredClone(audit);
  arbitraryTaxonomy.criterionIds[0] = "arbitrary-criterion";
  await assert.rejects(
    validateLegacyModuleContractAudit(arbitraryTaxonomy),
    /exactly match the versioned 16-criterion taxonomy/u,
  );

  const missingTruthBoundary = structuredClone(audit);
  delete missingTruthBoundary.truthBoundary;
  await assert.rejects(
    validateLegacyModuleContractAudit(missingTruthBoundary),
    /truthBoundary must be an object/u,
  );

  const unrelatedVisual = structuredClone(audit);
  const visualModule = unrelatedVisual.modules.find(({ moduleId }) => moduleId === "m21");
  visualModule.evidence["accessible-visual-text-alternative"] = {
    status: "pointer-present",
    anchors: [visualModule.sessionAnchors[0]],
  };
  await assert.rejects(
    validateLegacyModuleContractAudit(unrelatedVisual),
    /needs an explicit visual text-equivalent\/accessibility heading/u,
  );

  const unrelatedCanonicalSource = structuredClone(audit);
  const sourceModule = unrelatedCanonicalSource.modules.find(({ moduleId }) => moduleId === "m12");
  sourceModule.evidence["source-ledger"].sourceReferences[0].headingAnchor =
    "module-12--modules-apis-types-and-dependency-direction";
  await assert.rejects(
    validateLegacyModuleContractAudit(unrelatedCanonicalSource),
    /source-ledger needs a source\/ledger workbook heading plus canonical-source-map evidence/u,
  );

  const wrongSourceMap = structuredClone(audit);
  const wrongSourceModule = wrongSourceMap.modules.find(({ moduleId }) => moduleId === "m12");
  wrongSourceModule.evidence["source-ledger"].sourceReferences[0] = {
    path: "content/source-maps/python_curriculum_sources.md",
    headingAnchor: "python-and-computational-thinking-spine",
  };
  await assert.rejects(
    validateLegacyModuleContractAudit(wrongSourceMap),
    /path must equal canonical graph sourceMap/u,
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
