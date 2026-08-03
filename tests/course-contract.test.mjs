import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
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
import { openGitIndexSnapshot } from "../scripts/git-index-snapshot.mjs";

const testDirectory = dirname(fileURLToPath(import.meta.url));
const siteRoot = resolve(testDirectory, "..");

test("the retained advanced authoring adapter validates M31-M36 evidence without publication", async () => {
  const [graph, registry] = await Promise.all([
    loadCourseGraph(),
    loadAdvancedModuleContractRegistry(),
  ]);
  const report = await validateAdvancedModuleContractRegistry(graph, registry);

  assert.deepEqual(report.summary, {
    authoringOnlyContracts: 6,
    plannedContracts: 6,
    pointerPresentContracts: 0,
    reviewedContracts: 0,
    releaseReadyContracts: 0,
    resolvedContractInputs: 75,
  });
  assert.deepEqual(
    report.modules.map(({ moduleId }) => moduleId),
    ["m31", "m32", "m33", "m34", "m35", "m36"],
  );
  for (const courseModule of report.modules) {
    assert.equal(courseModule.publicationEffect, "none");
    assert.equal(courseModule.promotionBlock.learnerManifest, "absent");
  }
});

test("the retained advanced contract is an authoring adapter, not M31's later promotion authority", async () => {
  const [graph, registry] = await Promise.all([
    loadCourseGraph(),
    loadAdvancedModuleContractRegistry(),
  ]);
  const laterGraph = structuredClone(graph);
  const m31 = laterGraph.modules.find(({ id }) => id === "m31");
  m31.sourceMap = "content/source-maps/module31_optimization_information_source_map.md";
  m31.studioId = "optimization-information";
  m31.state.contract.state = "review-ready";

  const report = await validateAdvancedModuleContractRegistry(laterGraph, registry);
  assert.equal(report.modules[0].moduleId, "m31");
  assert.equal(report.modules[0].contractState, "authoring-only");
  assert.equal(report.modules[0].publicationEffect, "none");

  const forgedLifecycle = structuredClone(registry);
  forgedLifecycle.modules[0].contractState = "review-ready";
  await assert.rejects(
    validateAdvancedModuleContractRegistry(graph, forgedLifecycle),
    /advanced authoring adapter.*authoring-only/i,
  );

  const forgedApproval = structuredClone(registry);
  forgedApproval.modules[0].humanReview["first-principles-quality"] = "approved";
  await assert.rejects(
    validateAdvancedModuleContractRegistry(graph, forgedApproval),
    /advanced authoring adapter.*pending/i,
  );
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
    /advanced authoring adapter may not claim a publication effect/u,
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

  const missingAuthoringDeliveryMap = structuredClone(registry);
  missingAuthoringDeliveryMap.modules[0].authoringDeliveryMapInputId = null;
  await assert.rejects(
    validateAdvancedModuleContractRegistry(graph, missingAuthoringDeliveryMap),
    /must name the hidden authoring delivery-map contract input/u,
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

  const alteredSnapshot = structuredClone(registry);
  alteredSnapshot.modules[0].graphSnapshot.sourceMap =
    "content/source-maps/module31_optimization_information_source_map.md";
  await assert.rejects(
    validateAdvancedModuleContractRegistry(graph, alteredSnapshot),
    /preserve null sourceMap and studioId from the authoring snapshot/u,
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

  const brokenBridgeTopology = await loadAdvancedModuleBridgeLedger();
  brokenBridgeTopology.modules[0].prerequisiteBridges[0].firstConsumingSessionId = "m31-s06";
  await assert.rejects(
    validateAdvancedModuleContractRegistry(graph, registry, {
      canonicalBridgeLedger: brokenBridgeTopology,
    }),
    /must preserve canonical bridge topology[\s\S]*first declared use/u,
  );

  const manifestIndependent = await validateAdvancedModuleContractRegistry(graph, registry, {
      learnerManifest: { modules: [{ id: "m31", number: 31 }] },
      learnerReadableModuleIds: ["m31"],
    });
  assert.equal(manifestIndependent.modules[0].moduleId, "m31");
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
  const forgedM29Graph = forgedGraph.modules.find(({ id }) => id === "m29");
  forgedM29Graph.state.availability = "published";
  forgedM29Graph.state.contract.state = "verified";
  forgedM29Graph.state.release.state = "deployed-recorded";
  forgedM29Graph.state.release.recordId = "m29-forged-deployment";
  const forgedContracts = structuredClone(contracts);
  const forgedM29 = forgedContracts.modules.find(({ moduleId }) => moduleId === "m29");
  forgedM29.contractState = "verified";
  forgedM29.criteria = forgedM29.criteria.map((criterion) => ({
    ...criterion,
    status: "release-ready",
  }));
  forgedM29.humanReview = Object.fromEntries(
    forgedContracts.humanReviewDimensions.map((dimension) => [dimension, "approved"]),
  );
  forgedM29.reviewReadyCommit = "0123456789abcdef0123456789abcdef01234567";
  forgedM29.release = {
    sourceCommit: "0123456789abcdef0123456789abcdef01234567",
    ciRunUrl: "https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/1",
    provenancePath: "docs/RELEASE_PROVENANCE.md",
    sourceReviewPath: "docs/advanced-evidence/m29/source-review.md",
    knownLimitationsPath: "docs/advanced-evidence/m29/known-limitations.md",
    privateDeploymentVersion: "forged",
  };
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
    /must use exactly these keys/u,
  );
});

test("the v3 contract registry covers every legacy reader module structurally", async () => {
  const [graph, contracts] = await Promise.all([
    loadCourseGraph(),
    loadCourseContracts(),
  ]);
  const report = await validateCourseContracts(graph, contracts);

  assert.deepEqual(report.errors, []);
  assert.equal(report.summary.legacyBaselineModules, 30);
  assert.equal(report.summary.verifiedModules, 0);
  assert.equal(report.summary.authoringOnlyModules, 6);
  assert.deepEqual(report.mermaidAlternatives?.summary, {
    totalBlocks: 245,
    completeBlocks: 245,
    incompleteBlocks: 0,
  });
  assert.equal(
    report.warnings.some((warning) => warning.includes("Mermaid visual(s) lack complete")),
    false,
  );
  assert.deepEqual(report.advancedContract?.summary, {
    authoringOnlyContracts: 6,
    plannedContracts: 6,
    pointerPresentContracts: 0,
    reviewedContracts: 0,
    releaseReadyContracts: 0,
    resolvedContractInputs: 75,
  });
  assert.deepEqual(report.moduleLearningCompanions?.summary, {
    companionCount: 34,
    moduleIds: [
      "m01",
      "m02",
      "m03",
      "m04",
      "m05",
      "m06",
      "m07",
      "m08",
      "m09",
      "m10",
      "m11",
      "m12",
      "m13",
      "m14",
      "m15",
      "m16",
      "m17",
      "m18",
      "m19",
      "m20",
      "m21",
      "m22",
      "m23",
      "m24",
      "m27",
      "m28",
      "m29",
      "m30",
      "m31",
      "m32",
      "m33",
      "m34",
      "m35",
      "m36",
    ],
  });
  assert.equal(report.legacyCandidatePreflightProfiles?.candidateByModuleId.size, 28);
  assert.ok(report.warnings.some((warning) => warning.includes("human review")));
  assert.deepEqual(report.draftEvidence?.summary, {
    draftPilotModules: 2,
    resolvedPointers: 37,
    humanReviews: 0,
    publicationChanges: 0,
  });
  assert.deepEqual(report.legacyPackets?.summary, {
    structuralCandidates: 27,
    resolvedPointers: 1190,
    humanApprovals: 0,
    publicationChanges: 0,
  });
  assert.equal(report.currentCandidatePackets?.summary.structuralCandidates, 2);
  assert.equal(report.currentCandidatePackets?.summary.humanApprovals, 0);
  assert.equal(report.currentCandidatePackets?.summary.publicationChanges, 0);
  assert.equal(report.candidatePackets?.summary.structuralCandidates, 29);
  assert.equal(report.candidatePackets?.summary.humanApprovals, 0);
  assert.equal(report.candidatePackets?.summary.publicationChanges, 0);
});

test("checked-in provenance rejects detached caller-supplied canonical graph facts", async () => {
  const [graph, contracts, snapshot] = await Promise.all([
    loadCourseGraph(),
    loadCourseContracts(),
    openGitIndexSnapshot(siteRoot),
  ]);
  const detachedGraph = structuredClone(graph);
  detachedGraph.modules[0].purpose = "A plausible but detached M01 purpose.";

  await assert.rejects(
    () => validateCourseContracts(detachedGraph, contracts, {
      requireGitTracked: true,
      snapshot,
    }),
    /supplied graph must match its captured Git-index graph/i,
  );
});

test("checked-in provenance rejects detached caller-supplied canonical registry facts", async () => {
  const snapshot = await openGitIndexSnapshot(siteRoot);
  const graph = (await snapshot.readJson("content/course/course-graph.v2.json")).value;
  const detachedRegistry = structuredClone(
    (await snapshot.readJson("content/course/contracts/module-contract-registry.v3.json")).value,
  );
  detachedRegistry.purpose = "A plausible but detached v3 registry purpose.";

  await assert.rejects(
    () => validateCourseContracts(graph, detachedRegistry, {
      requireGitTracked: true,
      snapshot,
    }),
    /supplied registry must match its captured Git-index registry/i,
  );
});

test("checked-in provenance accepts the canonical derived graph projection", async () => {
  const [graph, contracts, snapshot] = await Promise.all([
    loadCourseGraph(),
    loadCourseContracts(),
    openGitIndexSnapshot(siteRoot),
  ]);

  const report = await validateCourseContracts(graph, contracts, {
    requireGitTracked: true,
    snapshot,
  });

  assert.equal(report.releaseInputLedger?.inputPaths.length, 299);
  assert.ok(
    report.releaseInputLedger?.inputPaths.includes(
      "content/course/synthesis-preview-conversations.v1.json",
    ),
  );
  assert.equal(report.summary.legacyBaselineModules, 30);
});

test("checked-in provenance validates captured JSON instead of stateful caller facts", async () => {
  const snapshot = await openGitIndexSnapshot(siteRoot);
  const graph = (await snapshot.readJson("content/course/course-graph.v2.json")).value;
  const registry = (
    await snapshot.readJson("content/course/contracts/module-contract-registry.v3.json")
  ).value;
  const canonicalModulePurpose = graph.modules[0].purpose;
  const canonicalRegistryPurpose = registry.purpose;
  let graphPurposeReads = 0;
  let registryPurposeReads = 0;
  Object.defineProperty(graph.modules[0], "purpose", {
    enumerable: true,
    configurable: true,
    get() {
      graphPurposeReads += 1;
      return graphPurposeReads === 1 ? canonicalModulePurpose : "";
    },
  });
  Object.defineProperty(registry, "purpose", {
    enumerable: true,
    configurable: true,
    get() {
      registryPurposeReads += 1;
      return registryPurposeReads === 1 ? canonicalRegistryPurpose : "";
    },
  });

  const report = await validateCourseContracts(graph, registry, {
    requireGitTracked: true,
    snapshot,
  });

  assert.equal(graphPurposeReads, 1);
  assert.equal(registryPurposeReads, 1);
  assert.equal(report.releaseInputLedger?.inputPaths.length, 299);
});

test("checked-in provenance ignores inherited Git index overrides end to end", async () => {
  const [graph, contracts, snapshot] = await Promise.all([
    loadCourseGraph(),
    loadCourseContracts(),
    openGitIndexSnapshot(siteRoot),
  ]);
  const previousIndexOverride = process.env.GIT_INDEX_FILE;
  process.env.GIT_INDEX_FILE = join(siteRoot, "untrusted-course-contract.index");
  try {
    const report = await validateCourseContracts(graph, contracts, {
      requireGitTracked: true,
      snapshot,
    });
    assert.equal(report.releaseInputLedger?.inputPaths.length, 299);
  } finally {
    if (previousIndexOverride === undefined) {
      delete process.env.GIT_INDEX_FILE;
    } else {
      process.env.GIT_INDEX_FILE = previousIndexOverride;
    }
  }
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

test("a newly published advanced module cannot assume a legacy contract track", async () => {
  const [graph, contracts] = await Promise.all([
    loadCourseGraph(),
    loadCourseContracts(),
  ]);
  const candidate = structuredClone(graph);
  const candidateContracts = structuredClone(contracts);
  const module31 = candidate.modules.find((courseModule) => courseModule.number === 31);
  const module31Contract = candidateContracts.modules.find(({ moduleId }) => moduleId === "m31");
  module31.state.lifecycle = "learner-material-ready";
  module31.state.readerAccess = "full";
  module31.state.availability = "published";
  module31.state.contract.track = "legacy-v1";
  module31.state.contract.state = "legacy-baseline";
  module31Contract.contractState = "legacy-baseline";

  await assert.rejects(
    validateCourseContracts(candidate, candidateContracts),
    /advanced Module 31 may not use the legacy-v1 contract track/,
  );
});

test("strict release validation refuses legacy baseline evidence", async () => {
  await assert.rejects(
    () => runCourseValidation({ strict: true }),
    (error) => {
      assert.match(error.message, /28 non-preview learner module\(s\) cannot pass strict contract validation/u);
      assert.doesNotMatch(error.message, /Draft v2 evidence/u);
      return true;
    },
  );
});

test("complete validation remains fail-closed until all modules are verified and synthesis is published", async () => {
  await assert.rejects(
    () => runCourseValidation({ complete: true }),
    (error) => {
      assert.match(
        error.message,
        /Complete contract validation requires every one of the 36 modules to be verified/u,
      );
      assert.match(
        error.message,
        /Complete contract validation requires m25 to be published rather than preview-only/u,
      );
      assert.match(
        error.message,
        /Complete contract validation requires m26 to be published rather than preview-only/u,
      );
      assert.doesNotMatch(
        error.message,
        /Reader Mermaid text alternatives must validate before a complete-course claim/u,
      );
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
    "pointer-present": 419,
    ambiguous: 60,
    missing: 1,
  });
  assert.equal(audit.criterionIds.length, 16);
  assert.equal(
    report.summary.byCriterion["rigor-definitions-assumptions-derivations-proofs-counterexamples-numerical-experiments"].ambiguous,
    13,
  );
  assert.equal(report.summary.byCriterion["study-partner-prompt"].missing, 0);
  assert.equal(report.summary.byCriterion["supportive-oral-defense"].missing, 1);
  assert.ok(
    audit.modules
      .filter(({ moduleId }) => ["m01", "m02", "m03", "m04", "m05", "m06", "m07", "m10", "m23"].includes(moduleId))
      .every(({ evidence }) => Object.values(evidence).every(({ status }) => status === "pointer-present")),
  );
  const expectedAmbiguousByModule = new Map([
    ["m08", ["first-principles"]],
    ["m09", ["first-principles"]],
    ["m11", ["code-reading-debugging-design", "accessible-visual-text-alternative"]],
    ["m12", ["accessible-visual-text-alternative"]],
    ["m13", ["accessible-visual-text-alternative"]],
    ["m14", ["first-principles", "rigor-definitions-assumptions-derivations-proofs-counterexamples-numerical-experiments", "accessible-visual-text-alternative"]],
    ["m15", ["rigor-definitions-assumptions-derivations-proofs-counterexamples-numerical-experiments", "accessible-visual-text-alternative"]],
    ["m16", ["first-principles", "accessible-visual-text-alternative"]],
    ["m17", ["first-principles", "code-reading-debugging-design", "accessible-visual-text-alternative"]],
    ["m18", ["first-principles", "rigor-definitions-assumptions-derivations-proofs-counterexamples-numerical-experiments", "accessible-visual-text-alternative"]],
    ["m19", ["rigor-definitions-assumptions-derivations-proofs-counterexamples-numerical-experiments", "accessible-visual-text-alternative", "supportive-oral-defense"]],
    ["m20", ["rigor-definitions-assumptions-derivations-proofs-counterexamples-numerical-experiments", "accessible-visual-text-alternative", "supportive-oral-defense"]],
    ["m21", ["rigor-definitions-assumptions-derivations-proofs-counterexamples-numerical-experiments"]],
    ["m22", ["rigor-definitions-assumptions-derivations-proofs-counterexamples-numerical-experiments", "code-reading-debugging-design"]],
    ["m24", ["accessible-visual-text-alternative", "ta-prompt"]],
  ]);
  for (const [moduleId, ambiguousCriteria] of expectedAmbiguousByModule) {
    const evidence = audit.modules.find((module) => module.moduleId === moduleId)?.evidence;
    assert.deepEqual(
      Object.entries(evidence)
        .filter(([, { status }]) => status === "ambiguous")
        .map(([criterionId]) => criterionId),
      ambiguousCriteria,
    );
    assert.ok(
      Object.entries(evidence)
        .filter(([criterionId]) => !ambiguousCriteria.includes(criterionId))
        .every(([, { status }]) => status === "pointer-present"),
    );
  }
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
