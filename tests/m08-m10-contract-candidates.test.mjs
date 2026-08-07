import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { loadCourseGraph, projectReaderModules } from "../scripts/course-graph.mjs";
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
    id: "m08",
    workbook: "content/modules/08_hashing_dictionaries_sets_indexing.md",
    packetId: "m08-hashing-dictionaries-sets-indexing-structural-candidate",
    academicPrerequisiteNumbers: [7],
    academicPrerequisiteModuleIds: ["m07"],
    forwardModuleId: "m09",
    sessionOnePattern: /^## Session 1 — Why lookup creates an index$/mu,
    codeAnchor: /class ChainedMap/u,
  },
  {
    id: "m09",
    workbook: "content/modules/09_trees_heaps_sorting_ordered.md",
    packetId: "m09-trees-heaps-sorting-ordered-structural-candidate",
    academicPrerequisiteNumbers: [8],
    academicPrerequisiteModuleIds: ["m08"],
    forwardModuleId: "m10",
    sessionOnePattern: /^## Session 1 — Ordered questions force new operations$/mu,
    codeAnchor: /class ReviewScheduler/u,
  },
  {
    id: "m10",
    workbook: "content/modules/10_graph_algorithms_network_models.md",
    packetId: "m10-graph-algorithms-network-models-structural-candidate",
    academicPrerequisiteNumbers: [9],
    academicPrerequisiteModuleIds: ["m09"],
    forwardModuleId: "m11",
    sessionOnePattern: /^## Session 1 — Turn graph questions into representations$/mu,
    codeAnchor: /def bfs_tree\(/u,
  },
];

test("M8–M10 make indexing, ordering, and graph contracts inspectable without promotion", async () => {
  const workbooks = await Promise.all(
    modules.map(async ({ workbook }) => readFile(resolve(siteRoot, workbook), "utf8")),
  );
  for (const [index, courseModule] of modules.entries()) {
    const workbook = workbooks[index];
    assert.match(workbook, courseModule.sessionOnePattern);
    assert.match(workbook, /^### Output:/mu);
    assert.match(workbook, courseModule.codeAnchor);
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
    assert.deepEqual(
      graphModule?.academicPrerequisiteNumbers,
      courseModule.academicPrerequisiteNumbers,
    );

    const packet = packetReport.packetByModuleId.get(courseModule.id);
    assert.equal(packet?.packetId, courseModule.packetId);
    assert.deepEqual(
      packet?.canonicalExpectation.academicPrerequisiteModuleIds,
      courseModule.academicPrerequisiteModuleIds,
    );
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

  const readerByNumber = new Map(
    projectReaderModules(graph).map((courseModule) => [courseModule.number, courseModule]),
  );
  assert.equal(readerByNumber.get(7)?.nextRouteNumber, 8);
  assert.equal(readerByNumber.get(8)?.previousRouteNumber, 7);
  assert.equal(readerByNumber.get(8)?.nextRouteNumber, 9);
  assert.equal(readerByNumber.get(9)?.previousRouteNumber, 8);
  assert.equal(readerByNumber.get(9)?.nextRouteNumber, 10);
  assert.equal(readerByNumber.get(10)?.previousRouteNumber, 9);
  assert.equal(readerByNumber.get(10)?.nextRouteNumber, 11);
});
