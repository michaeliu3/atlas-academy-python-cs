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
const moduleId = "m01";

test("M1 has an inspectable event-log comparison and a non-promoting candidate dossier", async () => {
  const workbook = await readFile(
    resolve(siteRoot, "content/modules/01_values_state_execution.md"),
    "utf8",
  );
  assert.match(workbook, /^## Session 4 — Code-reading and investigation studio$/mu);
  assert.match(workbook, /class ConciseEventLog:/u);
  assert.match(workbook, /class GeneratedEventPipeline:/u);
  assert.match(workbook, /class EventLog:/u);
  assert.match(workbook, /same observable\s+contract: `record\(raw\)` returns nothing/u);
  assert.match(workbook, /Reveal after writing your prediction and confidence\./u);
  assert.match(workbook, /assert tags_after_later_edit\(EventLog\(\)\) == \("python",\)/u);
  assert.match(workbook, /^### Output: event-log comparison and repair memo$/mu);

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
  const graphModule = graph.modules.find(({ id }) => id === moduleId);
  assert.equal(graphModule?.state.lifecycle, "learner-material-ready");
  assert.equal(graphModule?.state.readerAccess, "full");
  assert.equal(graphModule?.state.availability, "legacy-open");
  assert.equal(graphModule?.state.contract.state, "legacy-baseline");
  assert.equal(graphModule?.state.release.state, "unrecorded");
  const packet = packetReport.packetByModuleId.get(moduleId);
  assert.ok(packet, "M1 must have a typed non-promoting structural packet");
  assert.equal(packet.packetState, "structural-candidate");
  assert.equal(packet.humanReviewState, "not-reviewed");
  assert.equal(packet.publicationEffect, "none");

  const profileReport = await validateLegacyCandidatePreflightProfiles(profiles, { siteRoot });
  assert.equal(
    profileReport.candidateByModuleId.get(moduleId)?.packetId,
    "m01-values-state-execution-structural-candidate",
  );

  const preflight = await runModuleCandidateEvidencePreflight(moduleId, { siteRoot });
  assert.equal(preflight.state, "candidate-not-promoting");
  assert.equal(preflight.contractState, "legacy-baseline");
  assert.equal(preflight.evidenceReport.evidenceByCriterion.size, 18);
  assert.deepEqual(preflight.openCriterionIds, [
    "release-provenance-ci-and-deployment-evidence",
  ]);
});
