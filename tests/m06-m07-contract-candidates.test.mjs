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
    id: "m06",
    workbook: "content/modules/06_representation_memory_sequences_linked.md",
    packetId: "m06-representation-memory-sequences-linked-structural-candidate",
    academicPrerequisiteNumbers: [5],
    academicPrerequisiteModuleIds: ["m05"],
    forwardModuleId: "m07",
    sessionOnePattern: /^## Session 1 — From values to bits without losing meaning$/mu,
    codeAnchor: /class MiniDynamicArray/u,
  },
  {
    id: "m07",
    workbook: "content/modules/07_stacks_queues_iteration_lazy.md",
    packetId: "m07-stacks-queues-iteration-lazy-structural-candidate",
    academicPrerequisiteNumbers: [6],
    academicPrerequisiteModuleIds: ["m06"],
    forwardModuleId: "m08",
    sessionOnePattern: /^## Session 1 — Access constraints create behavior$/mu,
    codeAnchor: /class TakeIterator/u,
  },
];

test("M6 and M7 make representation and demand contracts inspectable without promotion", async () => {
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
  assert.equal(readerByNumber.get(5)?.nextRouteNumber, 27);
  assert.equal(readerByNumber.get(27)?.previousRouteNumber, 5);
  assert.equal(readerByNumber.get(27)?.nextRouteNumber, 6);
  assert.equal(readerByNumber.get(6)?.previousRouteNumber, 27);
  assert.equal(readerByNumber.get(6)?.nextRouteNumber, 7);
  assert.equal(readerByNumber.get(7)?.previousRouteNumber, 6);
  assert.equal(readerByNumber.get(7)?.nextRouteNumber, 8);
});
