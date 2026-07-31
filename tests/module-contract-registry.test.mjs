import assert from "node:assert/strict";
import test from "node:test";
import { loadCourseGraph } from "../scripts/course-graph.mjs";
import {
  loadModuleContractRegistry,
  promotionLearningCompanionErrors,
  promotionEvidenceRoleErrors,
  promotionEvidenceRoleRequirements,
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
  assert.equal(byId.get("m31").contractState, "authoring-only");
  assert.equal(byId.get("m32").contractState, "not-started");
  assert.equal(
    byId.get("m31").criteria.find(({ id }) => id === "interaction-reference-model-and-teaching-tests").status,
    "pointer-present",
  );
});

test("a promotion cannot bypass authored visual-alternative content and its test evidence", () => {
  assert.deepEqual(
    promotionEvidenceRoleRequirements["accessible-visual-text-alternative"],
    ["course-content", "test"],
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

  const m05 = graphById.get("m05");
  const incomplete = await promotionVisualAlternativeErrors({
    siteRoot: process.cwd(),
    moduleEntry: { moduleId: "m05" },
    graphModule: m05,
    manifestById,
    evidenceReport: visualEvidence("content/modules/05_cost_models_algorithm_analysis.md"),
  });
  assert.ok(incomplete.errors.some((error) => error.includes("complete Mermaid text alternatives")));
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
    state: "candidate-recorded",
    recordId: "candidate-m25",
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
