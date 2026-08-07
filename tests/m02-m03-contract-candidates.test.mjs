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
    id: "m02",
    workbook: "content/modules/02_functions_recursion_induction.md",
    packetId: "m02-functions-recursion-induction-structural-candidate",
    sessionOnePattern: /^## Session 1 — Functions as contracts, not syntax$/mu,
    codeAnchor: /def total_minutes\(/u,
  },
  {
    id: "m03",
    workbook: "content/modules/03_abstraction_interfaces_adts.md",
    packetId: "m03-abstraction-interfaces-adts-structural-candidate",
    sessionOnePattern: /^## Session 1 — Discover the boundary \(75 minutes\)$/mu,
    codeAnchor: /class EventStore/u,
  },
];

test("M2 and M3 expose inspectable foundations and non-promoting candidate dossiers", async () => {
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

    const packet = packetReport.packetByModuleId.get(courseModule.id);
    assert.equal(packet?.packetId, courseModule.packetId);
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
