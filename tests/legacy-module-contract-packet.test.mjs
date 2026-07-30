import assert from "node:assert/strict";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { loadCourseGraph } from "../scripts/course-graph.mjs";
import {
  legacyModuleContractPacketRelativePath,
  loadLegacyModuleContractPacketRegistry,
  validateLegacyModuleContractPacketRegistry,
} from "../scripts/legacy-module-contract-packet.mjs";

const testDirectory = dirname(fileURLToPath(import.meta.url));
const siteRoot = resolve(testDirectory, "..");

async function packetFixture() {
  const [graph, registry] = await Promise.all([
    loadCourseGraph(),
    loadLegacyModuleContractPacketRegistry(siteRoot),
  ]);
  return { graph, registry };
}

test("the M29 structural packet resolves the canonical graph, audit, evidence, and bounded artifacts", async () => {
  const { graph, registry } = await packetFixture();
  const report = await validateLegacyModuleContractPacketRegistry(graph, registry, { siteRoot });

  assert.deepEqual(report.summary, {
    structuralCandidates: 1,
    resolvedPointers: 35,
    humanApprovals: 0,
    publicationChanges: 0,
  });
  const packet = report.packetById.get("m29-continuous-change-structural-candidate");
  assert.equal(packet.moduleId, "m29");
  assert.equal(packet.canonicalExpectation.forwardModuleId, "m30");
  assert.equal(packet.packetState, "structural-candidate");
  assert.equal(packet.publicationEffect, "none");
  assert.ok(
    report.releaseInputPaths.some((path) =>
      path.replaceAll("\\", "/").endsWith(legacyModuleContractPacketRelativePath),
    ),
  );
  assert.ok(
    report.releaseInputPaths.some((path) =>
      path
        .replaceAll("\\", "/")
        .endsWith("content/source-maps/module29_calculus_real_analysis_source_audit_addendum.md"),
    ),
  );
  assert.ok(report.releaseInputPaths.every((path) => path.replaceAll("\\", "/").includes("content/")));
});

test("the packet rejects route drift, audit-status laundering, unreviewed promotion, and missing typed roles", async () => {
  const { graph, registry } = await packetFixture();

  const wrongForward = structuredClone(registry);
  wrongForward.modules[0].canonicalExpectation.forwardModuleId = "m18";
  await assert.rejects(
    validateLegacyModuleContractPacketRegistry(graph, wrongForward, { siteRoot }),
    /forwardModuleId must match the canonical graph/u,
  );

  const launderedAudit = structuredClone(registry);
  launderedAudit.modules[0].criteria[3].legacyAuditStatus = "pointer-present";
  await assert.rejects(
    validateLegacyModuleContractPacketRegistry(graph, launderedAudit, { siteRoot }),
    /legacyAuditStatus must match the immutable legacy audit status/u,
  );

  const promotionAttempt = structuredClone(registry);
  promotionAttempt.modules[0].publicationEffect = "eligible-for-publication";
  await assert.rejects(
    validateLegacyModuleContractPacketRegistry(graph, promotionAttempt, { siteRoot }),
    /must remain a non-promoting, not-reviewed structural-candidate/u,
  );

  const brokenSession = structuredClone(registry);
  brokenSession.modules[0].sessionSpine[0].pointerId = "m29-session-2";
  await assert.rejects(
    validateLegacyModuleContractPacketRegistry(graph, brokenSession, { siteRoot }),
    /pointerId must resolve its matching session pointer/u,
  );

  const noDebugRole = structuredClone(registry);
  noDebugRole.modules[0].pointers.find(({ id }) => id === "m29-debug").roles = ["design"];
  await assert.rejects(
    validateLegacyModuleContractPacketRegistry(graph, noDebugRole, { siteRoot }),
    /requires a debugging pointer role/u,
  );

  const brokenAnchor = structuredClone(registry);
  brokenAnchor.modules[0].pointers.find(({ id }) => id === "m29-transfer").target.headingAnchor = "not-a-real-anchor";
  await assert.rejects(
    validateLegacyModuleContractPacketRegistry(graph, brokenAnchor, { siteRoot }),
    /not visible/u,
  );
});
