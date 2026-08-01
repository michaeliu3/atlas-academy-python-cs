import assert from "node:assert/strict";
import test from "node:test";
import { loadCourseGraph } from "../scripts/course-graph.mjs";
import {
  loadModuleContractRegistry,
  promotionLearningCompanionErrors,
  promotionEvidenceRoleErrors,
  promotionEvidenceRoleRequirements,
  promotionReviewCandidateDeliveryErrors,
  promotionEvidenceScopeErrors,
  promotionVisualAlternativeErrors,
  validateModuleContractRegistry,
} from "../scripts/module-contract-registry.mjs";

function copy(value) {
  return structuredClone(value);
}

test("the unified v3 module-contract registry covers the canonical 36-module graph truthfully", async () => {
  const [graph, registry] = await Promise.all([
    loadCourseGraph(),
    loadModuleContractRegistry(),
  ]);
  const report = await validateModuleContractRegistry(graph, registry);
  const byId = new Map(registry.modules.map((module) => [module.moduleId, module]));

  assert.deepEqual(report.summary, {
    legacyBaselineModules: 30,
    authoringOnlyModules: 6,
    reviewReadyModules: 0,
    verifiedModules: 0,
  });
  assert.equal(registry.modules.length, 36);
  assert.equal(byId.get("m25").contractState, "legacy-baseline");
  assert.equal(
    byId.get("m25").criteria.find(({ id }) => id === "release-provenance-ci-and-deployment-evidence").status,
    "missing",
  );
  for (const moduleId of ["m31", "m32", "m33", "m34", "m35", "m36"]) {
    assert.equal(byId.get(moduleId).contractState, "authoring-only");
    assert.equal(
      byId.get(moduleId).criteria.find(({ id }) => id === "interaction-reference-model-and-teaching-tests").status,
      "pointer-present",
    );
    assert.equal(
      byId.get(moduleId).criteria.find(({ id }) => id === "release-provenance-ci-and-deployment-evidence").status,
      "planned",
    );
  }
});

test("the synchronizer-only pre-write manifest projection cannot weaken release validation", async () => {
  const [graph, registry] = await Promise.all([
    loadCourseGraph(),
    loadModuleContractRegistry(),
  ]);

  await assert.rejects(
    () => validateModuleContractRegistry(graph, registry, {
      manifestTruth: "pre-write-projection",
    }),
    /requires the synchronizer's supplied manifest/i,
  );
  await assert.rejects(
    () => validateModuleContractRegistry(graph, registry, {
      manifest: { modules: [] },
      mode: "strict",
      manifestTruth: "pre-write-projection",
    }),
    /only available to integrity validation/i,
  );
  await assert.rejects(
    () => validateModuleContractRegistry(graph, registry, {
      manifest: { modules: [] },
      manifestTruth: "untrusted-worktree",
    }),
    /Unknown module-contract registry v3 manifest truth mode/i,
  );
});

test("an M32 authoring adapter cannot become learner-visible before review and release evidence", async () => {
  const [graph, registry] = await Promise.all([
    loadCourseGraph(),
    loadModuleContractRegistry(),
  ]);
  const candidateGraph = copy(graph);
  const candidateRegistry = copy(registry);
  const m32 = candidateGraph.modules.find(({ id }) => id === "m32");

  m32.state.lifecycle = "learner-material-ready";
  m32.state.readerAccess = "full";
  m32.state.availability = "optional";

  await assert.rejects(
    () => validateModuleContractRegistry(candidateGraph, candidateRegistry),
    /m32 authoring-only v3 entry must remain hidden learner material/i,
  );
});

test("a promotion cannot bypass authored visual-alternative content and its test evidence", () => {
  assert.deepEqual(
    promotionEvidenceRoleRequirements["accessible-visual-text-alternative"],
    ["course-content", "test"],
  );
});

test("a hidden review candidate supplies the scope that a review-ready module deliberately lacks", () => {
  const materialScope = {
    workbookPath: "content/modules/31_optimization_information.md",
    sourceLedgerPaths: ["content/source-maps/module31_optimization_information.md"],
    visualContentPaths: ["content/modules/31_optimization_information.md"],
  };
  const evidenceReport = {
    evidenceByCriterion: new Map([
      [
        "six-connected-sessions",
        {
          criterionId: "six-connected-sessions",
          resolvedInputs: [
            {
              role: "course-content",
              path: materialScope.workbookPath,
            },
          ],
        },
      ],
      [
        "source-ledger-claim-license-reuse-links",
        {
          criterionId: "source-ledger-claim-license-reuse-links",
          resolvedInputs: [
            {
              role: "source-ledger",
              path: materialScope.sourceLedgerPaths[0],
            },
          ],
        },
      ],
    ]),
  };
  const reviewReady = promotionEvidenceScopeErrors({
    moduleEntry: { moduleId: "m31", contractState: "review-ready" },
    graphModule: { sourceMap: null },
    manifestById: new Map(),
    evidenceReport,
    materialScope,
  });
  assert.deepEqual(reviewReady, []);

  const verified = promotionEvidenceScopeErrors({
    moduleEntry: { moduleId: "m31", contractState: "verified" },
    graphModule: { sourceMap: materialScope.sourceLedgerPaths[0] },
    manifestById: new Map([["m31", { filename: "31_optimization_information.md" }]]),
    evidenceReport,
    materialScope,
  });
  assert.deepEqual(verified, []);

  const swappedManifest = promotionEvidenceScopeErrors({
    moduleEntry: { moduleId: "m31", contractState: "verified" },
    graphModule: { sourceMap: materialScope.sourceLedgerPaths[0] },
    manifestById: new Map([["m31", { filename: "31_different_workbook.md" }]]),
    evidenceReport,
    materialScope,
  });
  assert.ok(swappedManifest.some((error) => error.includes("frozen hidden candidate workbook")));
});

test("a promotion evidence record binds the exact hidden selector before human review", () => {
  const selectorPath = "content/course/contracts/review-candidates/m31.v1.json";
  const materialScope = {
    selectorPath,
    selectorBlobOid: "a".repeat(40),
    selectorSha256: `sha256:${"b".repeat(64)}`,
    selector: { moduleId: "m31", workbookPath: "content/modules/31_optimization_information.md" },
  };
  const exactInput = {
    kind: "json-pointer",
    role: "review-candidate-delivery",
    path: selectorPath,
    locator: "",
    blobOid: materialScope.selectorBlobOid,
    sha256: materialScope.selectorSha256,
    value: structuredClone(materialScope.selector),
  };
  const evidenceReport = { resolvedInputs: [exactInput] };
  assert.deepEqual(
    promotionReviewCandidateDeliveryErrors({ moduleId: "m31" }, evidenceReport, materialScope),
    [],
  );

  const changedBlob = {
    resolvedInputs: [{ ...exactInput, sha256: `sha256:${"c".repeat(64)}` }],
  };
  assert.ok(
    promotionReviewCandidateDeliveryErrors({ moduleId: "m31" }, changedBlob, materialScope)
      .some((error) => error.includes("exact captured selector blob")),
  );

  const missingRole = { resolvedInputs: [] };
  assert.ok(
    promotionReviewCandidateDeliveryErrors({ moduleId: "m31" }, missingRole, materialScope)
      .some((error) => error.includes("exactly one review-candidate-delivery")),
  );
});

test("a future promotion needs its own typed TA, Study Partner, and forward-handoff companion", async () => {
  const graph = await loadCourseGraph();
  const path = "content/course/contracts/companions/m31.v1.json";
  const companionEvidence = (overrides = {}) => ({
    evidenceByCriterion: new Map([
      [
        "ta-prompt",
        {
          resolvedInputs: [
            {
              kind: "json-pointer",
              role: "learning-companion",
              path,
              locator: "/teachingAssistant",
              ...overrides.ta,
            },
          ],
        },
      ],
      [
        "study-partner-prompt",
        {
          resolvedInputs: [
            {
              kind: "json-pointer",
              role: "learning-companion",
              path,
              locator: "/studyPartner",
              ...overrides.studyPartner,
            },
          ],
        },
      ],
      [
        "forward-handoff",
        {
          resolvedInputs: [
            {
              kind: "json-pointer",
              role: "learning-companion",
              path,
              locator: "/forwardHandoff",
              ...overrides.forward,
            },
          ],
        },
      ],
    ]),
  });

  const valid = await promotionLearningCompanionErrors({
    siteRoot: process.cwd(),
    moduleEntry: { moduleId: "m31" },
    graph,
    evidenceReport: companionEvidence(),
  });
  assert.deepEqual(valid, []);

  const wrongPointer = await promotionLearningCompanionErrors({
    siteRoot: process.cwd(),
    moduleEntry: { moduleId: "m31" },
    graph,
    evidenceReport: companionEvidence({
      studyPartner: { locator: "/teachingAssistant" },
    }),
  });
  assert.ok(wrongPointer.some((error) => error.includes("study-partner-prompt")));

  const crossModule = await promotionLearningCompanionErrors({
    siteRoot: process.cwd(),
    moduleEntry: { moduleId: "m31" },
    graph,
    evidenceReport: companionEvidence({
      forward: { path: "content/course/contracts/companions/m32.v1.json" },
    }),
  });
  assert.ok(crossModule.some((error) => error.includes("forward-handoff")));

  const markdownSubstitute = await promotionLearningCompanionErrors({
    siteRoot: process.cwd(),
    moduleEntry: { moduleId: "m31" },
    graph,
    evidenceReport: companionEvidence({
      ta: {
        kind: "markdown-heading",
        role: "course-content",
        path: "content/authoring/m31_optimization_information_workbook.v1.md",
        locator: "teaching-assistant-prompt--m31",
      },
    }),
  });
  assert.ok(markdownSubstitute.some((error) => error.includes("ta-prompt")));
});

test("promotion evidence must bind and scan the module's own Mermaid content", async () => {
  const [graph, registry] = await Promise.all([
    loadCourseGraph(),
    loadModuleContractRegistry(),
  ]);
  const baseline = await validateModuleContractRegistry(graph, registry);
  const graphById = new Map(graph.modules.map((courseModule) => [courseModule.id, courseModule]));
  const manifestById = new Map(baseline.manifest.modules.map((courseModule) => [courseModule.id, courseModule]));
  const visualCriterion = "accessible-visual-text-alternative";
  const visualEvidence = (path, includeTest = true) => ({
    evidenceByCriterion: new Map([
      [
        visualCriterion,
        {
          resolvedInputs: [
            { kind: "file", role: "course-content", path, locator: null },
            ...(includeTest
              ? [{ kind: "file", role: "test", path: "tests/mermaid-accessibility.test.mjs", locator: null }]
              : []),
          ],
        },
      ],
    ]),
  });

  const m01 = graphById.get("m01");
  const complete = await promotionVisualAlternativeErrors({
    siteRoot: process.cwd(),
    moduleEntry: { moduleId: "m01" },
    graphModule: m01,
    manifestById,
    evidenceReport: visualEvidence("content/modules/01_values_state_execution.md"),
  });
  assert.deepEqual(complete.errors, []);

  const missingTest = promotionEvidenceRoleErrors(
    { moduleId: "m01" },
    m01,
    visualEvidence("content/modules/01_values_state_execution.md", false),
  );
  assert.ok(
    missingTest.some((error) => error.includes("accessible-visual-text-alternative must include a test input")),
  );

  const unrelated = await promotionVisualAlternativeErrors({
    siteRoot: process.cwd(),
    moduleEntry: { moduleId: "m01" },
    graphModule: m01,
    manifestById,
    evidenceReport: visualEvidence("content/modules/02_functions_recursion_induction.md"),
  });
  assert.ok(unrelated.errors.some((error) => error.includes("canonical workbook")));
  assert.ok(unrelated.errors.some((error) => error.includes("unrelated course content")));

  const m09 = graphById.get("m09");
  const completeM09 = await promotionVisualAlternativeErrors({
    siteRoot: process.cwd(),
    moduleEntry: { moduleId: "m09" },
    graphModule: m09,
    manifestById,
    evidenceReport: visualEvidence("content/modules/09_trees_heaps_sorting_ordered.md"),
  });
  assert.deepEqual(completeM09.errors, []);
});

test("the registry rejects missing modules, forged audit evidence, and a direct preview-to-verified jump", async () => {
  const [graph, registry] = await Promise.all([
    loadCourseGraph(),
    loadModuleContractRegistry(),
  ]);

  const missingModule = copy(registry);
  missingModule.modules.pop();
  await assert.rejects(
    () => validateModuleContractRegistry(graph, missingModule),
    /exactly one entry for every canonical module/i,
  );

  const forgedAuditEvidence = copy(registry);
  forgedAuditEvidence.modules[0].criteria[0].status = "reviewed";
  await assert.rejects(
    () => validateModuleContractRegistry(graph, forgedAuditEvidence),
    /must preserve the immutable legacy audit status/i,
  );

  const forgedPromotionGraph = copy(graph);
  const forgedPromotionRegistry = copy(registry);
  const graphM25 = forgedPromotionGraph.modules.find(({ id }) => id === "m25");
  const registryM25 = forgedPromotionRegistry.modules.find(({ moduleId }) => moduleId === "m25");
  graphM25.state.contract.state = "verified";
  graphM25.state.availability = "published";
  graphM25.state.readerAccess = "full";
  graphM25.state.release = {
    state: "deployed-recorded",
    recordId: "m25-forged-deployment",
  };
  registryM25.contractState = "verified";
  registryM25.release = {
    sourceCommit: "0123456789abcdef0123456789abcdef01234567",
    ciRunUrl: "https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/1",
    provenancePath: "docs/RELEASE_PROVENANCE.md",
  };
  await assert.rejects(
    () => validateModuleContractRegistry(forgedPromotionGraph, forgedPromotionRegistry),
    /reviewReadyCommit/i,
  );
});

test("a review-ready transition needs resolved module-specific evidence rather than status labels", async () => {
  const [graph, registry] = await Promise.all([
    loadCourseGraph(),
    loadModuleContractRegistry(),
  ]);
  const candidateGraph = copy(graph);
  const candidateRegistry = copy(registry);
  const baseline = await validateModuleContractRegistry(graph, registry);
  const candidateManifest = copy(baseline.manifest);
  candidateManifest.modules = candidateManifest.modules.filter(({ id }) => id !== "m01");
  const graphM01 = candidateGraph.modules.find(({ id }) => id === "m01");
  const registryM01 = candidateRegistry.modules.find(({ moduleId }) => moduleId === "m01");

  graphM01.state.lifecycle = "authoring-only";
  graphM01.state.readerAccess = "hidden";
  graphM01.state.availability = "authoring-only";
  graphM01.state.contract.state = "review-ready";
  registryM01.contractState = "review-ready";
  registryM01.criteria = registryM01.criteria.map((criterion) => ({
    ...criterion,
    status: "reviewed",
    source: { kind: "none", path: null, locator: null },
  }));
  registryM01.humanReview = Object.fromEntries(
    candidateRegistry.humanReviewDimensions.map((dimension) => [dimension, "approved"]),
  );
  registryM01.reviewReadyCommit = "0123456789abcdef0123456789abcdef01234567";

  await assert.rejects(
    () => validateModuleContractRegistry(candidateGraph, candidateRegistry, {
      manifest: candidateManifest,
    }),
    /requires resolved module-specific evidence/i,
  );
});

test("a review-ready M31 cannot promote its retained authoring-adapter pointers", async () => {
  const [graph, registry] = await Promise.all([
    loadCourseGraph(),
    loadModuleContractRegistry(),
  ]);
  const candidateGraph = copy(graph);
  const candidateRegistry = copy(registry);
  const graphM31 = candidateGraph.modules.find(({ id }) => id === "m31");
  const registryM31 = candidateRegistry.modules.find(({ moduleId }) => moduleId === "m31");

  graphM31.sourceMap = "content/source-maps/module31_optimization_information_source_map.md";
  graphM31.studioId = "optimization-information";
  graphM31.state.contract.state = "review-ready";
  registryM31.contractState = "review-ready";
  registryM31.criteria = registryM31.criteria.map((criterion) => ({
    ...criterion,
    status: "reviewed",
  }));
  registryM31.humanReview = Object.fromEntries(
    candidateRegistry.humanReviewDimensions.map((dimension) => [dimension, "approved"]),
  );

  await assert.rejects(
    () => validateModuleContractRegistry(candidateGraph, candidateRegistry),
    /may not use advanced authoring-adapter evidence as promotion authority/i,
  );
});

test("a future M31 lifecycle keeps the authoring bridge topology without treating it as promotion authority", async () => {
  const [graph, registry] = await Promise.all([
    loadCourseGraph(),
    loadModuleContractRegistry(),
  ]);
  const candidateGraph = copy(graph);
  const candidateRegistry = copy(registry);
  const graphM31 = candidateGraph.modules.find(({ id }) => id === "m31");
  const registryM31 = candidateRegistry.modules.find(({ moduleId }) => moduleId === "m31");

  graphM31.sourceMap = "content/source-maps/module31_optimization_information_source_map.md";
  graphM31.studioId = "optimization-information";
  graphM31.state = {
    lifecycle: "learner-material-ready",
    readerAccess: "full",
    availability: "published",
    contract: { track: "advanced-v1", state: "verified" },
    release: { state: "deployed-recorded", recordId: "m31-future-deployment" },
  };
  registryM31.contractState = "verified";
  registryM31.criteria = registryM31.criteria.map((criterion) => ({
    ...criterion,
    status: "release-ready",
  }));
  registryM31.humanReview = Object.fromEntries(
    candidateRegistry.humanReviewDimensions.map((dimension) => [dimension, "approved"]),
  );
  registryM31.reviewReadyCommit = "0123456789abcdef0123456789abcdef01234567";
  registryM31.release = {
    recordId: "m31-future-deployment",
    sourceCommit: "0123456789abcdef0123456789abcdef01234567",
    ciRunUrl: "https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/1",
    ciEvidencePath: "docs/module-evidence/m31/course-ci-evidence.v1.json",
    candidateInputPaths: [],
    provenancePath: "docs/module-evidence/m31/provenance.md",
    sourceReviewPath: "docs/module-evidence/m31/source-review.md",
    knownLimitationsPath: "docs/module-evidence/m31/known-limitations.md",
    privateDeploymentVersion: "future-fixture",
  };

  await assert.rejects(
    () => validateModuleContractRegistry(candidateGraph, candidateRegistry),
    (error) => {
      assert.match(error.message, /requires resolved module-specific evidence/i);
      assert.doesNotMatch(error.message, /bridge is an authoring-only plan/i);
      return true;
    },
  );
});
