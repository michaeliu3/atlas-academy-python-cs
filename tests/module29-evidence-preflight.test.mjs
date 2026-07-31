import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import {
  loadModuleEvidencePreflight,
  moduleEvidencePreflightRelativePath,
  runM29CandidateEvidencePreflight,
  validateModuleEvidencePreflight,
} from "../scripts/module-evidence-preflight.mjs";
import { loadCourseGraph } from "../scripts/course-graph.mjs";
import { loadModuleEvidenceRecord } from "../scripts/module-review-evidence.mjs";

const testDirectory = dirname(fileURLToPath(import.meta.url));
const siteRoot = resolve(testDirectory, "..");
const moduleId = "m29";
const evidencePath = "content/course/contracts/evidence/m29.v1.json";

async function loadCandidateArtifacts() {
  const [preflight, evidenceRecord] = await Promise.all([
    loadModuleEvidencePreflight(moduleEvidencePreflightRelativePath(moduleId), { siteRoot }),
    loadModuleEvidenceRecord(evidencePath, { siteRoot }),
  ]);
  return { preflight, evidenceRecord };
}

test("M29 has a complete candidate evidence dossier without a false promotion claim", async () => {
  assert.equal(
    moduleEvidencePreflightRelativePath(moduleId),
    "content/course/contracts/evidence-preflight/m29.v1.json",
  );
  const report = await runM29CandidateEvidencePreflight({ siteRoot });

  assert.equal(report.moduleId, moduleId);
  assert.equal(report.state, "candidate-not-promoting");
  assert.equal(report.contractState, "legacy-baseline");
  assert.equal(report.evidenceRecordPath, evidencePath);
  assert.equal(report.evidenceReport.evidenceByCriterion.size, 18);
  assert.deepEqual(report.openCriterionIds, ["release-provenance-ci-and-deployment-evidence"]);
  assert.deepEqual(report.promotionBlockers, [
    "human-review",
    "review-ready-commit",
    "source-commit-ci-run",
    "private-deployment-record",
  ]);
});

test("M29 preflight rejects unrelated tests and a thin rigor bundle", async () => {
  const { preflight, evidenceRecord } = await loadCandidateArtifacts();

  const unrelatedTest = structuredClone(evidenceRecord);
  const interaction = unrelatedTest.evidence.find(
    ({ criterionId }) => criterionId === "interaction-reference-model-and-teaching-tests",
  );
  interaction.inputs.find(({ role }) => role === "test").path = "tests/ci-workflow.test.mjs";
  await assert.rejects(
    () => validateModuleEvidencePreflight(preflight, { siteRoot, evidenceRecord: unrelatedTest }),
    /module-specific discovered test/i,
  );

  const thinRigor = structuredClone(evidenceRecord);
  const rigor = thinRigor.evidence.find(
    ({ criterionId }) =>
      criterionId === "rigor-definitions-assumptions-derivations-proofs-counterexamples-numerical-experiments",
  );
  rigor.inputs = [rigor.inputs[0]];
  await assert.rejects(
    () => validateModuleEvidencePreflight(preflight, { siteRoot, evidenceRecord: thinRigor }),
    /rigor-definitions-assumptions-derivations-proofs-counterexamples-numerical-experiments.*five course-content Markdown headings/i,
  );
});

test("M29 preflight rejects a renderer-only stand-in for its behavioral reference-model test", async () => {
  const { preflight, evidenceRecord } = await loadCandidateArtifacts();
  const rendererOnlyTest = structuredClone(evidenceRecord);
  const interaction = rendererOnlyTest.evidence.find(
    ({ criterionId }) => criterionId === "interaction-reference-model-and-teaching-tests",
  );
  interaction.inputs.find(({ role }) => role === "test").path = "tests/rendered-html.test.mjs";

  await assert.rejects(
    () => validateModuleEvidencePreflight(preflight, { siteRoot, evidenceRecord: rendererOnlyTest }),
    /must bind behavioral Python test public\/downloads\/test_module29_reference\.py/i,
  );
});

test("M29 preflight rejects cross-module workbook evidence", async () => {
  const { preflight, evidenceRecord } = await loadCandidateArtifacts();
  const crossModuleEvidence = structuredClone(evidenceRecord);
  const firstPrinciples = crossModuleEvidence.evidence.find(
    ({ criterionId }) => criterionId === "first-principles",
  );
  firstPrinciples.inputs[0] = {
    ...firstPrinciples.inputs[0],
    path: "content/modules/28_linear_algebra_numerical_stability_representation.md",
    locator: "first-principle-a-vector-space-is-a-promise-about-allowed-combinations",
  };

  await assert.rejects(
    () => validateModuleEvidencePreflight(preflight, { siteRoot, evidenceRecord: crossModuleEvidence }),
    /must bind canonical workbook content\/modules\/29_calculus_real_analysis_continuous_change\.md/i,
  );
});

test("M29 preflight fails closed on forged release assertions", async () => {
  const { preflight, evidenceRecord } = await loadCandidateArtifacts();
  const forgedBoundary = structuredClone(preflight);
  forgedBoundary.truthBoundary.release = "M29 is deployed and released with verified CI evidence.";
  await assert.rejects(
    () => validateModuleEvidencePreflight(forgedBoundary, { siteRoot }),
    /must preserve the exact candidate-only release nonclaim/i,
  );

  const forgedClaim = structuredClone(evidenceRecord);
  forgedClaim.evidence.find(
    ({ criterionId }) => criterionId === "release-provenance-ci-and-deployment-evidence",
  ).claim = "M29 is deployed and released after successful CI.";
  await assert.rejects(
    () => validateModuleEvidencePreflight(preflight, { siteRoot, evidenceRecord: forgedClaim }),
    /must preserve the exact candidate-only release-boundary claim/i,
  );

  const forgedEvidenceBoundary = structuredClone(evidenceRecord);
  forgedEvidenceBoundary.truthBoundary.release = "M29 is a deployed private release.";
  await assert.rejects(
    () => validateModuleEvidencePreflight(preflight, { siteRoot, evidenceRecord: forgedEvidenceBoundary }),
    /must preserve the exact candidate-only evidence-record release nonclaim/i,
  );
});

test("M29 preflight pins its canonical graph contract and release tuple", async () => {
  const [preflight, graph] = await Promise.all([
    loadModuleEvidencePreflight(moduleEvidencePreflightRelativePath(moduleId), { siteRoot }),
    loadCourseGraph(),
  ]);
  for (const releaseState of ["candidate-recorded", "deployed-recorded"]) {
    const forgedGraph = structuredClone(graph);
    const m29 = forgedGraph.modules.find(({ id }) => id === moduleId);
    m29.state.release = { state: releaseState, recordId: `m29-forged-${releaseState}` };
    await assert.rejects(
      () => validateModuleEvidencePreflight(preflight, { siteRoot, graph: forgedGraph }),
      /must preserve the canonical graph legacy-v1\/legacy-baseline and unrecorded release tuple/i,
    );
  }
});

test("M29 candidate release wording is stable scope language, not a time-sensitive CI absence claim", async () => {
  const [{ preflight, evidenceRecord }, candidateDocumentation] = await Promise.all([
    loadCandidateArtifacts(),
    readFile(resolve(siteRoot, "docs", "module-evidence", "m29", "candidate-preflight.md"), "utf8"),
  ]);
  const releaseCriterion = evidenceRecord.evidence.find(
    ({ criterionId }) => criterionId === "release-provenance-ci-and-deployment-evidence",
  );
  assert.match(preflight.truthBoundary.release, /not CI.*release.*publication evidence/i);
  assert.match(releaseCriterion.claim, /do not bind or establish.*source-commit CI/i);
  assert.doesNotMatch(releaseCriterion.claim, /absent human-review|absent.*CI/i);
  assert.match(candidateDocumentation, /does not bind an exact source commit to a successful CI run/i);
  assert.doesNotMatch(candidateDocumentation, /No exact source commit has recorded a successful CI run/i);
});

test("M29 preflight loader refuses noncanonical paths", async () => {
  await assert.rejects(
    () => loadModuleEvidencePreflight("../release-m26-20260730-1129/package.json", { siteRoot }),
    /canonical module-scoped path/i,
  );
  await assert.rejects(
    () => loadModuleEvidencePreflight("package.json", { siteRoot }),
    /canonical module-scoped path/i,
  );
  await assert.rejects(
    () => loadModuleEvidencePreflight(moduleEvidencePreflightRelativePath("m30"), { siteRoot }),
    /Git-tracked regular local file/i,
  );
});

test("M29 preflight rejects a review-ready label and binds a CI-configured runtime model-exercise check", async () => {
  const { preflight } = await loadCandidateArtifacts();
  const falsePromotion = { ...preflight, state: "review-ready" };
  await assert.rejects(
    () => validateModuleEvidencePreflight(falsePromotion, { siteRoot }),
    /candidate-not-promoting/i,
  );

  const [modelTest, workflow] = await Promise.all([
    readFile(resolve(siteRoot, "public", "downloads", "test_module29_reference.py"), "utf8"),
    readFile(resolve(siteRoot, ".github", "workflows", "ci.yml"), "utf8"),
  ]);
  assert.match(modelTest, /import module29_reference as model/u);
  assert.match(
    workflow,
    /python -m unittest discover -s public\/downloads -p "test_module\*_reference\.py"/u,
  );
  assert.match(workflow, /python scripts\/verify_teaching_model_exercises\.py/u);
  assert.match(
    workflow,
    /python -m unittest discover -s scripts -p "test_verify_teaching_model_exercises\.py"/u,
  );
});
