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
const workbookPath = "content/modules/11_algorithm_design_paradigms.md";
const packetId = "m11-algorithm-design-paradigms-structural-candidate";

test("M11 makes strategy selection inspectable without promotion", async () => {
  const workbook = await readFile(resolve(siteRoot, workbookPath), "utf8");
  assert.match(workbook, /^## Session 1 — Formulate before optimizing$/mu);
  assert.match(workbook, /^### Session 1 output — problem contract and oracle boundary$/mu);
  assert.match(workbook, /^## Conversational oral defense — M11$/mu);
  assert.match(workbook, /^### Misconception repair map — claims before tactics$/mu);
  assert.match(workbook, /def best_independent_subset\(/u);
  assert.match(workbook, /Sources were checked \*\*2026-08-02\*\*/u);
  assert.match(workbook, /linked\/cited or briefly paraphrased only/u);
  assert.match(workbook, /\| 6 \| The generated Atlas planner diff and its local tests \|/u);

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
  const graphModule = graph.modules.find(({ id }) => id === "m11");

  assert.equal(graphModule?.state.lifecycle, "learner-material-ready");
  assert.equal(graphModule?.state.readerAccess, "full");
  assert.equal(graphModule?.state.availability, "legacy-open");
  assert.equal(graphModule?.state.contract.state, "legacy-baseline");
  assert.equal(graphModule?.state.release.state, "unrecorded");
  assert.deepEqual(graphModule?.academicPrerequisiteNumbers, [10]);

  const packet = packetReport.packetByModuleId.get("m11");
  assert.equal(packet?.packetId, packetId);
  assert.deepEqual(packet?.canonicalExpectation.academicPrerequisiteModuleIds, ["m10"]);
  assert.equal(packet?.canonicalExpectation.forwardModuleId, "m12");
  assert.equal(packet?.packetState, "structural-candidate");
  assert.equal(packet?.humanReviewState, "not-reviewed");
  assert.equal(packet?.publicationEffect, "none");
  assert.equal(profileReport.candidateByModuleId.get("m11")?.packetId, packetId);

  const preflight = await runModuleCandidateEvidencePreflight("m11", { siteRoot });
  assert.equal(preflight.state, "candidate-not-promoting");
  assert.equal(preflight.contractState, "legacy-baseline");
  assert.equal(preflight.evidenceReport.evidenceByCriterion.size, 18);
  assert.deepEqual(preflight.openCriterionIds, [
    "release-provenance-ci-and-deployment-evidence",
  ]);

  const readerByNumber = new Map(
    projectReaderModules(graph).map((courseModule) => [courseModule.number, courseModule]),
  );
  assert.equal(readerByNumber.get(10)?.nextRouteNumber, 11);
  assert.equal(readerByNumber.get(11)?.previousRouteNumber, 10);
  assert.equal(readerByNumber.get(11)?.nextRouteNumber, 12);
  assert.equal(readerByNumber.get(12)?.previousRouteNumber, 11);
});
