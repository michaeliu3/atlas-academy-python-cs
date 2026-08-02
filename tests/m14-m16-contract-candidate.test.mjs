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
    id: "m14",
    workbook: "content/modules/14_software_design_and_change.md",
    packetId: "m14-software-design-change-structural-candidate",
    academicPrerequisiteNumbers: [13],
    academicPrerequisiteModuleIds: ["m13"],
    forwardModuleId: "m15",
    sessionOnePattern: /^## Session 1 — Reconstruct pressure and observable behavior$/mu,
    outputPattern: /^### Session 6 output — change defense and M15 durable-boundary handoff$/mu,
    codeAnchor: /class PlannerService/u,
    oralAnchor: /^## Conversational oral defense — M14$/mu,
  },
  {
    id: "m15",
    workbook: "content/modules/15_files_serialization_packaging_delivery.md",
    packetId: "m15-files-serialization-packaging-delivery-structural-candidate",
    academicPrerequisiteNumbers: [14],
    academicPrerequisiteModuleIds: ["m14"],
    forwardModuleId: "m16",
    sessionOnePattern: /^## Session 1 — One event crosses text, byte, and path boundaries$/mu,
    outputPattern: /^### Session 6 output — release and rollback defense with M16 handoff$/mu,
    codeAnchor: /def canonical_json_bytes\(/u,
    oralAnchor: /^## Conversational oral defense — M15$/mu,
  },
  {
    id: "m16",
    workbook: "content/modules/16_relational_data_transactions.md",
    packetId: "m16-relational-data-transactions-structural-candidate",
    academicPrerequisiteNumbers: [15],
    academicPrerequisiteModuleIds: ["m15"],
    forwardModuleId: "m17",
    sessionOnePattern: /^## Session 1 — Derive relations from repeated facts, not table-shaped habit$/mu,
    outputPattern: /^### Session 6 output — recovery, restore, and claim boundary$/mu,
    codeAnchor: /class SqliteEventRepository/u,
    oralAnchor: /^## Conversational oral defense — M16$/mu,
  },
];

test("M14–M16 make one durable-software evidence thread inspectable without promotion", async () => {
  const workbooks = await Promise.all(
    modules.map(async ({ workbook }) => readFile(resolve(siteRoot, workbook), "utf8")),
  );
  for (const [index, courseModule] of modules.entries()) {
    const workbook = workbooks[index];
    assert.match(workbook, courseModule.sessionOnePattern);
    assert.match(workbook, courseModule.outputPattern);
    assert.match(workbook, courseModule.codeAnchor);
    assert.match(workbook, courseModule.oralAnchor);
    assert.equal((workbook.match(courseModule.oralAnchor) ?? []).length, 1);
    assert.match(
      workbook,
      /cannot\s+control voice availability,\s+quality settings,\s+rendering,\s+retention,\s+or\s+integrations/u,
    );
    assert.doesNotMatch(workbook, /^### \d+\.\d+ Oral defense$/mu);
    assert.doesNotMatch(workbook, /\b(?:four|six)-minute\b/iu);
    assert.equal((workbook.match(/^## Session [1-6] —/gmu) ?? []).length, 6);
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
  assert.equal(readerByNumber.get(13)?.nextRouteNumber, 14);
  assert.equal(readerByNumber.get(14)?.previousRouteNumber, 13);
  assert.equal(readerByNumber.get(14)?.nextRouteNumber, 15);
  assert.equal(readerByNumber.get(15)?.previousRouteNumber, 14);
  assert.equal(readerByNumber.get(15)?.nextRouteNumber, 16);
  assert.equal(readerByNumber.get(16)?.previousRouteNumber, 15);
  assert.equal(readerByNumber.get(16)?.nextRouteNumber, 17);
});
