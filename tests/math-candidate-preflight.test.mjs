import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import {
  loadModuleEvidencePreflight,
  moduleEvidencePreflightRelativePath,
  runModuleCandidateEvidencePreflight,
  validateModuleEvidencePreflight,
} from "../scripts/module-evidence-preflight.mjs";
import { loadCourseGraph } from "../scripts/course-graph.mjs";
import { loadModuleContractRegistry } from "../scripts/module-contract-registry.mjs";
import { loadModuleEvidenceRecord } from "../scripts/module-review-evidence.mjs";

const testDirectory = dirname(fileURLToPath(import.meta.url));
const siteRoot = resolve(testDirectory, "..");
const mathCandidateModuleIds = ["m27", "m28", "m29", "m30"];

test("the M27-M30 mathematics cohort has candidate-only 18-criterion preflights", async () => {
  for (const moduleId of mathCandidateModuleIds) {
    const report = await runModuleCandidateEvidencePreflight(moduleId, { siteRoot });

    assert.equal(report.moduleId, moduleId);
    assert.equal(report.state, "candidate-not-promoting");
    assert.equal(report.contractState, "legacy-baseline");
    assert.equal(report.evidenceReport.evidenceByCriterion.size, 18);
    assert.deepEqual(report.openCriterionIds, ["release-provenance-ci-and-deployment-evidence"]);
    assert.deepEqual(report.promotionBlockers, [
      "human-review",
      "review-ready-commit",
      "source-commit-ci-run",
      "private-deployment-record",
    ]);
  }
});

test("the release-input ledger hashes every profile-backed mathematics candidate record", async () => {
  const releaseInputs = JSON.parse(
    await readFile(resolve(siteRoot, "content/course/release-inputs.v1.json"), "utf8"),
  );
  const hashedPaths = new Set(releaseInputs.inputs.map(({ path }) => path));

  for (const moduleId of mathCandidateModuleIds) {
    assert.ok(
      hashedPaths.has(`content/course/contracts/evidence/${moduleId}.v1.json`),
      `${moduleId} candidate evidence must be an allowlisted hashed release input.`,
    );
    assert.ok(
      hashedPaths.has(`content/course/contracts/evidence-preflight/${moduleId}.v1.json`),
      `${moduleId} candidate preflight must be an allowlisted hashed release input.`,
    );
  }
});

test("candidate preflights refuse supplied canonical state detached from their Git-index snapshot", async () => {
  const [preflight, graph, registry, manifestSource] = await Promise.all([
    loadModuleEvidencePreflight(moduleEvidencePreflightRelativePath("m29"), { siteRoot }),
    loadCourseGraph(siteRoot),
    loadModuleContractRegistry(siteRoot),
    readFile(resolve(siteRoot, "content/modules/manifest.json"), "utf8"),
  ]);
  const manifest = JSON.parse(manifestSource);

  const forgedGraph = structuredClone(graph);
  forgedGraph.modules.find(({ id }) => id === "m01").purpose =
    "A structurally plausible but detached graph value.";
  await assert.rejects(
    () => validateModuleEvidencePreflight(preflight, { siteRoot, graph: forgedGraph }),
    /M29 candidate supplied graph must match its captured Git-index graph context/i,
  );

  const forgedRegistry = structuredClone(registry);
  forgedRegistry.purpose = "A structurally plausible but detached registry value.";
  await assert.rejects(
    () => validateModuleEvidencePreflight(preflight, { siteRoot, registry: forgedRegistry }),
    /M29 candidate supplied registry must match its captured Git-index registry context/i,
  );

  const forgedManifest = structuredClone(manifest);
  forgedManifest.modules.find(({ id }) => id === "m01").summary =
    "A structurally plausible but detached manifest value.";
  await assert.rejects(
    () => validateModuleEvidencePreflight(preflight, { siteRoot, manifest: forgedManifest }),
    /M29 candidate supplied manifest must match its captured Git-index manifest context/i,
  );
});

test("legacy candidate preflights refuse injected preflight and evidence artifacts by default", async () => {
  const [preflight, evidenceRecord] = await Promise.all([
    loadModuleEvidencePreflight(moduleEvidencePreflightRelativePath("m29"), { siteRoot }),
    loadModuleEvidenceRecord("content/course/contracts/evidence/m29.v1.json", { siteRoot }),
  ]);

  const forgedPreflight = structuredClone(preflight);
  forgedPreflight.purpose = "A plausible but caller-injected candidate preflight.";
  await assert.rejects(
    () => validateModuleEvidencePreflight(forgedPreflight, { siteRoot }),
    /M29 candidate supplied preflight must match its captured Git-index preflight record/i,
  );

  const forgedEvidence = structuredClone(evidenceRecord);
  forgedEvidence.purpose = "A plausible but caller-injected candidate evidence record.";
  await assert.rejects(
    () => validateModuleEvidencePreflight(preflight, { siteRoot, evidenceRecord: forgedEvidence }),
    /M29 candidate supplied evidence record must match its captured Git-index evidence record/i,
  );
});
