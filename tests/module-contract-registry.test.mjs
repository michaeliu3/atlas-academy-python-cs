import assert from "node:assert/strict";
import test from "node:test";
import { loadCourseGraph } from "../scripts/course-graph.mjs";
import {
  loadModuleContractRegistry,
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

  const m02 = graphById.get("m02");
  const incomplete = await promotionVisualAlternativeErrors({
    siteRoot: process.cwd(),
    moduleEntry: { moduleId: "m02" },
    graphModule: m02,
    manifestById,
    evidenceReport: visualEvidence("content/modules/02_functions_recursion_induction.md"),
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
