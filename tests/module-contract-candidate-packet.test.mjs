import assert from "node:assert/strict";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { loadCourseGraph } from "../scripts/course-graph.mjs";
import {
  combineModuleContractPacketReports,
  loadLegacyModuleContractPacketRegistry,
  loadModuleContractCandidatePacketRegistry,
  moduleContractCandidatePacketRelativePath,
  validateLegacyModuleContractPacketRegistry,
  validateModuleContractCandidatePacketRegistry,
} from "../scripts/legacy-module-contract-packet.mjs";

const testDirectory = dirname(fileURLToPath(import.meta.url));
const siteRoot = resolve(testDirectory, "..");

test("current M12/M13 structural packets are separate from immutable historic packets", async () => {
  const [graph, legacyRegistry, currentRegistry] = await Promise.all([
    loadCourseGraph(siteRoot),
    loadLegacyModuleContractPacketRegistry(siteRoot),
    loadModuleContractCandidatePacketRegistry(siteRoot),
  ]);
  const [legacyReport, currentReport] = await Promise.all([
    validateLegacyModuleContractPacketRegistry(graph, legacyRegistry, { siteRoot }),
    validateModuleContractCandidatePacketRegistry(graph, currentRegistry, { siteRoot }),
  ]);

  assert.deepEqual([...currentReport.packetByModuleId.keys()], ["m12", "m13"]);
  assert.equal(currentReport.summary.structuralCandidates, 2);
  assert.equal(currentReport.summary.humanApprovals, 0);
  assert.equal(currentReport.summary.publicationChanges, 0);
  assert.equal(legacyReport.summary.structuralCandidates, 27);
  assert.equal(
    legacyReport.packetByModuleId.get("m11")?.packetId,
    "m11-algorithm-design-paradigms-structural-candidate",
  );
  assert.equal(legacyReport.packetByModuleId.has("m12"), false);
  assert.equal(legacyReport.packetByModuleId.has("m13"), false);
  for (const moduleId of ["m12", "m13"]) {
    const implementationPaths = new Set(
      currentReport.packetByModuleId
        .get(moduleId)
        ?.implementationArtifacts.flatMap(({ paths }) => paths) ?? [],
    );
    assert.ok(implementationPaths.has("e2e/accessibility.spec.ts"));
    assert.ok(implementationPaths.has("package.json"));
    assert.ok(implementationPaths.has("playwright.config.ts"));
  }
  assert.ok(
    currentReport.releaseInputPaths.some((path) =>
      path.replaceAll("\\", "/").endsWith(moduleContractCandidatePacketRelativePath),
    ),
  );

  const combined = combineModuleContractPacketReports([legacyReport, currentReport]);
  assert.equal(combined.packetByModuleId.size, 29);
  assert.equal(
    combined.packetById.get("m12-modules-apis-types-dependencies-structural-candidate")?.moduleId,
    "m12",
  );
  assert.equal(
    combined.packetById.get("m13-specifications-testing-debugging-structural-candidate")?.moduleId,
    "m13",
  );
});

test("combined candidate packets reject duplicate module and packet identities", async () => {
  const [graph, legacyRegistry, currentRegistry] = await Promise.all([
    loadCourseGraph(siteRoot),
    loadLegacyModuleContractPacketRegistry(siteRoot),
    loadModuleContractCandidatePacketRegistry(siteRoot),
  ]);
  const [legacyReport, currentReport] = await Promise.all([
    validateLegacyModuleContractPacketRegistry(graph, legacyRegistry, { siteRoot }),
    validateModuleContractCandidatePacketRegistry(graph, currentRegistry, { siteRoot }),
  ]);
  const legacyPacket = legacyReport.packetByModuleId.get("m19");
  const duplicateCurrentReport = {
    ...currentReport,
    packetById: new Map([
      ...currentReport.packetById,
      [legacyPacket.packetId, legacyPacket],
    ]),
    packetByModuleId: new Map([
      ...currentReport.packetByModuleId,
      [legacyPacket.moduleId, legacyPacket],
    ]),
  };

  assert.throws(
    () => combineModuleContractPacketReports([legacyReport, duplicateCurrentReport]),
    /duplicate (?:moduleId|packetId)/iu,
  );
});
