import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { loadCourseGraph } from "../scripts/course-graph.mjs";
import {
  loadLegacyCandidatePreflightProfiles,
  validateLegacyCandidatePreflightProfiles,
} from "../scripts/legacy-candidate-preflight-profiles.mjs";
import {
  loadLegacyModuleContractPacketRegistry,
  validateLegacyModuleContractPacketRegistry,
} from "../scripts/legacy-module-contract-packet.mjs";
import { runModuleCandidateEvidencePreflight } from "../scripts/module-evidence-preflight.mjs";

const testDirectory = dirname(fileURLToPath(import.meta.url));
const siteRoot = resolve(testDirectory, "..");

const modules = [
  {
    id: "m04",
    workbook: "content/modules/04_logic_sets_relations_graphs_proof.md",
    packetId: "m04-logic-sets-relations-graphs-proof-structural-candidate",
    forwardModuleId: "m05",
    sessionOnePattern: /^## Session 1 — Claims that can be checked$/mu,
    codeAnchor: /def route_violations\(/u,
    firstPrinciplesPattern: /each represented prerequisite edge whose\s+dependent appears in that route/u,
  },
  {
    id: "m05",
    workbook: "content/modules/05_cost_models_algorithm_analysis.md",
    packetId: "m05-cost-models-algorithm-analysis-structural-candidate",
    forwardModuleId: "m27",
    sessionOnePattern: /^## Session 1 — Count what the program actually does$/mu,
    codeAnchor: /def unique_topics_slow\(/u,
  },
];

test("M4 and M5 make formal claims and cost models inspectable without promotion", async () => {
  const workbooks = await Promise.all(
    modules.map(async ({ workbook }) => readFile(resolve(siteRoot, workbook), "utf8")),
  );
  for (const [index, courseModule] of modules.entries()) {
    const workbook = workbooks[index];
    assert.match(workbook, courseModule.sessionOnePattern);
    assert.match(workbook, /^### Output:/mu);
    assert.match(workbook, courseModule.codeAnchor);
    if (courseModule.firstPrinciplesPattern) {
      assert.match(workbook, courseModule.firstPrinciplesPattern);
    }
  }

  const [graph, packetRegistry, profiles] = await Promise.all([
    loadCourseGraph(siteRoot),
    loadLegacyModuleContractPacketRegistry(siteRoot),
    loadLegacyCandidatePreflightProfiles(siteRoot),
  ]);
  const packetReport = await validateLegacyModuleContractPacketRegistry(
    graph,
    packetRegistry,
    { siteRoot },
  );
  const profileReport = await validateLegacyCandidatePreflightProfiles(profiles, { siteRoot });

  for (const courseModule of modules) {
    const graphModule = graph.modules.find(({ id }) => id === courseModule.id);
    assert.equal(graphModule?.state.lifecycle, "learner-material-ready");
    assert.equal(graphModule?.state.readerAccess, "full");
    assert.equal(graphModule?.state.availability, "legacy-open");
    assert.equal(graphModule?.state.contract.state, "legacy-baseline");
    assert.equal(graphModule?.state.release.state, "unrecorded");

    const packet = packetReport.packetByModuleId.get(courseModule.id);
    assert.equal(packet?.packetId, courseModule.packetId);
    assert.equal(packet?.canonicalExpectation.forwardModuleId, courseModule.forwardModuleId);
    assert.equal(packet?.packetState, "structural-candidate");
    assert.equal(packet?.humanReviewState, "not-reviewed");
    assert.equal(packet?.publicationEffect, "none");
    assert.equal(profileReport.candidateByModuleId.get(courseModule.id)?.packetId, courseModule.packetId);

    const preflight = await runModuleCandidateEvidencePreflight(courseModule.id, { siteRoot });
    assert.equal(preflight.state, "candidate-not-promoting");
    assert.equal(preflight.contractState, "legacy-baseline");
    assert.equal(preflight.evidenceReport.evidenceByCriterion.size, 18);
    assert.deepEqual(preflight.openCriterionIds, [
      "release-provenance-ci-and-deployment-evidence",
    ]);
  }
});
