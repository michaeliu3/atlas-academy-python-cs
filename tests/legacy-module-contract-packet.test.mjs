import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
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

test("the immutable historic packet registry retains its canonical digest", async () => {
  const source = await readFile(
    resolve(siteRoot, legacyModuleContractPacketRelativePath),
    "utf8",
  );
  const digest = createHash("sha256")
    .update(source.replace(/\r\n?/gu, "\n"))
    .digest("hex");

  assert.equal(digest, "f30a2c8d2a28ac1602e45261985fab044d1893c533903b8a04ad5f7ade1ec2fb");
});

test("the M29 structural packet resolves the canonical graph, audit, evidence, and bounded artifacts", async () => {
  const { graph, registry } = await packetFixture();
  const report = await validateLegacyModuleContractPacketRegistry(graph, registry, { siteRoot });

  assert.deepEqual(report.summary, {
    structuralCandidates: 11,
    resolvedPointers: 467,
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
  const sessionOutput = packet.pointers.find(({ id }) => id === "m29-limit-continuity-calibration-note");
  assert.deepEqual(sessionOutput?.roles, ["session-output"]);
  assert.equal(sessionOutput?.sessionNumber, 1);
  assert.equal(sessionOutput?.target.headingAnchor, "session-1-code-reading-task");
});

test("the M20 structural packet binds the networking spine without promoting its ambiguous evidence", async () => {
  const { graph, registry } = await packetFixture();
  const report = await validateLegacyModuleContractPacketRegistry(graph, registry, { siteRoot });

  const packet = report.packetById.get("m20-networks-protocols-structural-candidate");
  assert.equal(packet?.moduleId, "m20");
  assert.deepEqual(packet?.canonicalExpectation.academicPrerequisiteModuleIds, ["m19"]);
  assert.equal(packet?.canonicalExpectation.forwardModuleId, "m21");
  assert.equal(packet?.canonicalExpectation.masteryGateId, "systems");
  assert.equal(packet?.canonicalExpectation.studioId, "network-protocol");
  assert.equal(packet?.packetState, "structural-candidate");
  assert.equal(packet?.humanReviewState, "not-reviewed");
  assert.equal(packet?.publicationEffect, "none");

  for (const session of packet?.sessionSpine ?? []) {
    const outputPointer = packet?.pointers.find(({ id }) => id === session.forwardArtifactId);
    assert.deepEqual(outputPointer?.roles, ["session-output"]);
    assert.equal(outputPointer?.sessionNumber, session.sessionNumber);
    assert.equal(outputPointer?.target.surface, "workbook");
  }

  const statusByCriterion = new Map(
    packet?.criteria.map((criterion) => [criterion.criterionId, criterion.legacyAuditStatus]),
  );
  assert.equal(
    statusByCriterion.get(
      "rigor-definitions-assumptions-derivations-proofs-counterexamples-numerical-experiments",
    ),
    "ambiguous",
  );
  assert.equal(statusByCriterion.get("accessible-visual-text-alternative"), "ambiguous");
  assert.equal(statusByCriterion.get("confidence-diagnostic-misconceptions"), "ambiguous");
  assert.equal(statusByCriterion.get("supportive-oral-defense"), "ambiguous");
  assert.equal(statusByCriterion.get("code-reading-debugging-design"), "pointer-present");
  assert.ok(
    report.releaseInputPaths.some((path) =>
      path
        .replaceAll("\\", "/")
        .endsWith("content/source-maps/module20_networks_protocols_source_audit_addendum.md"),
    ),
  );
});

test("the M21 structural packet binds the direct async continuation without laundering its unresolved evidence", async () => {
  const { graph, registry } = await packetFixture();
  const report = await validateLegacyModuleContractPacketRegistry(graph, registry, { siteRoot });

  const packet = report.packetById.get("m21-async-distributed-structural-candidate");
  assert.equal(packet?.moduleId, "m21");
  assert.deepEqual(packet?.canonicalExpectation.academicPrerequisiteModuleIds, ["m20"]);
  assert.equal(packet?.canonicalExpectation.forwardModuleId, "m22");
  assert.equal(packet?.canonicalExpectation.masteryGateId, "systems");
  assert.equal(packet?.canonicalExpectation.studioId, "async-distributed");
  assert.equal(packet?.packetState, "structural-candidate");
  assert.equal(packet?.humanReviewState, "not-reviewed");
  assert.equal(packet?.publicationEffect, "none");

  const statusByCriterion = new Map(
    packet?.criteria.map((criterion) => [criterion.criterionId, criterion.legacyAuditStatus]),
  );
  assert.equal(
    statusByCriterion.get(
      "rigor-definitions-assumptions-derivations-proofs-counterexamples-numerical-experiments",
    ),
    "ambiguous",
  );
  assert.equal(statusByCriterion.get("code-reading-debugging-design"), "ambiguous");
  assert.equal(statusByCriterion.get("prediction-before-reveal"), "ambiguous");
  assert.equal(statusByCriterion.get("transfer-task"), "ambiguous");
  assert.equal(statusByCriterion.get("confidence-diagnostic-misconceptions"), "ambiguous");
  assert.equal(statusByCriterion.get("supportive-oral-defense"), "ambiguous");
  assert.equal(statusByCriterion.get("study-partner-prompt"), "pointer-present");
  assert.ok(
    report.releaseInputPaths.some((path) =>
      path
        .replaceAll("\\", "/")
        .endsWith("content/source-maps/module21_async_distributed_source_audit_addendum.md"),
    ),
  );
});

test("the M22 structural packet binds the trust continuation without promoting its unresolved evidence", async () => {
  const { graph, registry } = await packetFixture();
  const report = await validateLegacyModuleContractPacketRegistry(graph, registry, { siteRoot });

  const packet = report.packetById.get("m22-security-trust-structural-candidate");
  assert.equal(packet?.moduleId, "m22");
  assert.deepEqual(packet?.canonicalExpectation.academicPrerequisiteModuleIds, ["m21"]);
  assert.equal(packet?.canonicalExpectation.forwardModuleId, "m23");
  assert.equal(packet?.canonicalExpectation.masteryGateId, "systems");
  assert.equal(packet?.canonicalExpectation.studioId, "security-trust");
  assert.equal(packet?.packetState, "structural-candidate");
  assert.equal(packet?.humanReviewState, "not-reviewed");
  assert.equal(packet?.publicationEffect, "none");

  const statusByCriterion = new Map(
    packet?.criteria.map((criterion) => [criterion.criterionId, criterion.legacyAuditStatus]),
  );
  assert.equal(
    statusByCriterion.get(
      "rigor-definitions-assumptions-derivations-proofs-counterexamples-numerical-experiments",
    ),
    "ambiguous",
  );
  assert.equal(statusByCriterion.get("code-reading-debugging-design"), "ambiguous");
  assert.equal(statusByCriterion.get("prediction-before-reveal"), "ambiguous");
  assert.equal(statusByCriterion.get("transfer-task"), "ambiguous");
  assert.equal(statusByCriterion.get("confidence-diagnostic-misconceptions"), "ambiguous");
  assert.equal(statusByCriterion.get("supportive-oral-defense"), "ambiguous");
  assert.equal(statusByCriterion.get("study-partner-prompt"), "pointer-present");
  assert.ok(
    report.releaseInputPaths.some((path) =>
      path
        .replaceAll("\\", "/")
        .endsWith("content/source-maps/module22_security_trust_source_audit_addendum.md"),
    ),
  );
});

test("the M23 structural packet maps the language spine without hiding its missing oral-defense protocol", async () => {
  const { graph, registry } = await packetFixture();
  const report = await validateLegacyModuleContractPacketRegistry(graph, registry, { siteRoot });

  const packet = report.packetById.get("m23-languages-interpreters-structural-candidate");
  assert.equal(packet?.moduleId, "m23");
  assert.deepEqual(packet?.canonicalExpectation.academicPrerequisiteModuleIds, ["m22"]);
  assert.equal(packet?.canonicalExpectation.forwardModuleId, "m24");
  assert.equal(packet?.canonicalExpectation.masteryGateId, "systems");
  assert.equal(packet?.canonicalExpectation.studioId, "language-interpreter");
  assert.equal(packet?.packetState, "structural-candidate");
  assert.equal(packet?.humanReviewState, "not-reviewed");
  assert.equal(packet?.publicationEffect, "none");

  const statusByCriterion = new Map(
    packet?.criteria.map((criterion) => [criterion.criterionId, criterion.legacyAuditStatus]),
  );
  assert.equal(
    statusByCriterion.get(
      "rigor-definitions-assumptions-derivations-proofs-counterexamples-numerical-experiments",
    ),
    "ambiguous",
  );
  assert.equal(statusByCriterion.get("code-reading-debugging-design"), "ambiguous");
  assert.equal(statusByCriterion.get("prediction-before-reveal"), "ambiguous");
  assert.equal(statusByCriterion.get("transfer-task"), "ambiguous");
  assert.equal(statusByCriterion.get("confidence-diagnostic-misconceptions"), "ambiguous");
  assert.equal(statusByCriterion.get("supportive-oral-defense"), "missing");

  const oralCriterion = packet?.criteria.find(
    ({ criterionId }) => criterionId === "supportive-oral-defense",
  );
  assert.deepEqual(oralCriterion?.pointerIds, [
    "m23-oral-missing-protocol-hint",
    "m23-oral-missing-counterexample",
    "m23-oral-missing-transfer",
    "m23-oral-missing-reflection-summary",
  ]);
  const missingOralPointer = packet?.pointers.find(
    ({ id }) => id === "m23-oral-missing-protocol-hint",
  );
  assert.deepEqual(missingOralPointer?.roles, ["oral-protocol", "oral-hint"]);
  assert.equal(
    missingOralPointer?.target.headingAnchor,
    "unresolved-supportive-oral-defense-route",
  );
  assert.ok(
    report.releaseInputPaths.some((path) =>
      path
        .replaceAll("\\", "/")
        .endsWith("content/source-maps/module23_languages_interpreters_source_audit_addendum.md"),
    ),
  );
});

test("the M24 structural packet maps the runtime-evidence spine without laundering its unresolved evidence", async () => {
  const { graph, registry } = await packetFixture();
  const report = await validateLegacyModuleContractPacketRegistry(graph, registry, { siteRoot });

  const packet = report.packetById.get("m24-cpython-performance-memory-structural-candidate");
  assert.equal(packet?.moduleId, "m24");
  assert.deepEqual(packet?.canonicalExpectation.academicPrerequisiteModuleIds, ["m23"]);
  assert.equal(packet?.canonicalExpectation.forwardModuleId, "m32");
  assert.equal(packet?.canonicalExpectation.masteryGateId, "systems");
  assert.equal(packet?.canonicalExpectation.studioId, "runtime-evidence");
  assert.equal(packet?.packetState, "structural-candidate");
  assert.equal(packet?.humanReviewState, "not-reviewed");
  assert.equal(packet?.publicationEffect, "none");

  const statusByCriterion = new Map(
    packet?.criteria.map((criterion) => [criterion.criterionId, criterion.legacyAuditStatus]),
  );
  assert.equal(
    statusByCriterion.get(
      "rigor-definitions-assumptions-derivations-proofs-counterexamples-numerical-experiments",
    ),
    "ambiguous",
  );
  assert.equal(statusByCriterion.get("transfer-task"), "ambiguous");
  assert.equal(statusByCriterion.get("accessible-visual-text-alternative"), "ambiguous");
  assert.equal(statusByCriterion.get("confidence-diagnostic-misconceptions"), "ambiguous");
  assert.equal(statusByCriterion.get("ta-prompt"), "ambiguous");
  assert.equal(statusByCriterion.get("supportive-oral-defense"), "missing");

  const oralCriterion = packet?.criteria.find(
    ({ criterionId }) => criterionId === "supportive-oral-defense",
  );
  assert.deepEqual(oralCriterion?.pointerIds, [
    "m24-oral-missing-protocol-hint",
    "m24-oral-missing-counterexample",
    "m24-oral-missing-transfer",
    "m24-oral-missing-reflection-summary",
  ]);
  const missingOralPointer = packet?.pointers.find(
    ({ id }) => id === "m24-oral-missing-protocol-hint",
  );
  assert.deepEqual(missingOralPointer?.roles, ["oral-protocol", "oral-hint"]);
  assert.equal(
    missingOralPointer?.target.headingAnchor,
    "unresolved-supportive-oral-defense-route",
  );
  assert.ok(
    report.releaseInputPaths.some((path) =>
      path
        .replaceAll("\\", "/")
        .endsWith("content/source-maps/module24_cpython_performance_memory_source_audit_addendum.md"),
    ),
  );
  assert.ok(
    report.releaseInputPaths.every(
      (path) =>
        !path
          .replaceAll("\\", "/")
          .endsWith("content/source-maps/module24_cpython_performance_memory_source_research.md"),
    ),
  );
});

test("the M25 structural packet records its preview-gated synthesis spine without laundering ambiguity", async () => {
  const { graph, registry } = await packetFixture();
  const report = await validateLegacyModuleContractPacketRegistry(graph, registry, { siteRoot });

  const packet = report.packetById.get(
    "m25-evidence-grounded-intelligent-systems-structural-candidate",
  );
  assert.equal(packet?.moduleId, "m25");
  assert.deepEqual(packet?.canonicalExpectation.academicPrerequisiteModuleIds, [
    "m22",
    "m24",
    "m30",
    "m31",
    "m34",
    "m35",
    "m36",
  ]);
  assert.equal(packet?.canonicalExpectation.forwardModuleId, "m26");
  assert.equal(packet?.canonicalExpectation.masteryGateId, "evidence");
  assert.equal(packet?.canonicalExpectation.studioId, "evidence-grounded");
  assert.equal(packet?.packetState, "structural-candidate");
  assert.equal(packet?.humanReviewState, "not-reviewed");
  assert.equal(packet?.publicationEffect, "none");

  const statusByCriterion = new Map(
    packet?.criteria.map((criterion) => [criterion.criterionId, criterion.legacyAuditStatus]),
  );
  assert.equal(statusByCriterion.get("prerequisite-forward-map"), "ambiguous");
  assert.equal(
    statusByCriterion.get(
      "rigor-definitions-assumptions-derivations-proofs-counterexamples-numerical-experiments",
    ),
    "ambiguous",
  );
  assert.equal(statusByCriterion.get("transfer-task"), "ambiguous");
  assert.equal(statusByCriterion.get("confidence-diagnostic-misconceptions"), "ambiguous");
  assert.equal(statusByCriterion.get("supportive-oral-defense"), "missing");

  const sessionSixOutput = packet?.pointers.find(
    ({ id }) => id === "m25-proposal-boundary-packet",
  );
  assert.deepEqual(sessionSixOutput?.roles, ["session-output"]);
  assert.equal(sessionSixOutput?.sessionNumber, 6);
  assert.equal(sessionSixOutput?.target.headingAnchor, "session-artifact-5");

  const oralCriterion = packet?.criteria.find(
    ({ criterionId }) => criterionId === "supportive-oral-defense",
  );
  assert.deepEqual(oralCriterion?.pointerIds, [
    "m25-oral-missing-protocol-hint",
    "m25-oral-missing-counterexample",
    "m25-oral-missing-transfer",
    "m25-oral-missing-reflection-summary",
  ]);
  const missingOralPointer = packet?.pointers.find(
    ({ id }) => id === "m25-oral-missing-protocol-hint",
  );
  assert.deepEqual(missingOralPointer?.roles, ["oral-protocol", "oral-hint"]);
  assert.equal(
    missingOralPointer?.target.headingAnchor,
    "unresolved-supportive-oral-defense-route",
  );
  assert.ok(
    report.releaseInputPaths.some((path) =>
      path
        .replaceAll("\\", "/")
        .endsWith("content/source-maps/module25_evidence_grounded_intelligent_systems_source_audit_addendum.md"),
    ),
  );
});

test("the M19 structural packet records the concurrency spine without hiding its missing Study Partner route", async () => {
  const { graph, registry } = await packetFixture();
  const report = await validateLegacyModuleContractPacketRegistry(graph, registry, { siteRoot });

  const packet = report.packetById.get("m19-concurrency-parallelism-structural-candidate");
  assert.equal(packet?.moduleId, "m19");
  assert.deepEqual(packet?.canonicalExpectation.academicPrerequisiteModuleIds, ["m18"]);
  assert.equal(packet?.canonicalExpectation.forwardModuleId, "m20");
  assert.equal(packet?.canonicalExpectation.masteryGateId, "systems");
  assert.equal(packet?.canonicalExpectation.studioId, "concurrency");
  assert.equal(packet?.packetState, "structural-candidate");
  assert.equal(packet?.humanReviewState, "not-reviewed");
  assert.equal(packet?.publicationEffect, "none");

  const statusByCriterion = new Map(
    packet?.criteria.map((criterion) => [criterion.criterionId, criterion.legacyAuditStatus]),
  );
  assert.equal(
    statusByCriterion.get(
      "rigor-definitions-assumptions-derivations-proofs-counterexamples-numerical-experiments",
    ),
    "ambiguous",
  );
  assert.equal(statusByCriterion.get("code-reading-debugging-design"), "ambiguous");
  assert.equal(statusByCriterion.get("accessible-visual-text-alternative"), "ambiguous");
  assert.equal(statusByCriterion.get("confidence-diagnostic-misconceptions"), "ambiguous");
  assert.equal(statusByCriterion.get("supportive-oral-defense"), "ambiguous");
  assert.equal(statusByCriterion.get("study-partner-prompt"), "missing");
  assert.ok(
    report.releaseInputPaths.some((path) =>
      path
        .replaceAll("\\", "/")
        .endsWith("content/source-maps/module19_concurrency_parallelism_source_audit_addendum.md"),
    ),
  );
});

test("the M27 structural packet binds the discrete-mathematics spine without laundering ambiguous evidence", async () => {
  const { graph, registry } = await packetFixture();
  const report = await validateLegacyModuleContractPacketRegistry(graph, registry, { siteRoot });

  const packet = report.packetById.get("m27-discrete-mathematics-structural-candidate");
  assert.equal(packet?.moduleId, "m27");
  assert.deepEqual(packet?.canonicalExpectation.academicPrerequisiteModuleIds, ["m02", "m04", "m05"]);
  assert.equal(packet?.canonicalExpectation.forwardModuleId, "m06");
  assert.equal(packet?.packetState, "structural-candidate");
  assert.equal(packet?.humanReviewState, "not-reviewed");
  assert.equal(packet?.publicationEffect, "none");

  const statusByCriterion = new Map(
    packet?.criteria.map((criterion) => [criterion.criterionId, criterion.legacyAuditStatus]),
  );
  assert.equal(
    statusByCriterion.get(
      "rigor-definitions-assumptions-derivations-proofs-counterexamples-numerical-experiments",
    ),
    "ambiguous",
  );
  assert.equal(statusByCriterion.get("code-reading-debugging-design"), "ambiguous");
  assert.equal(statusByCriterion.get("source-ledger"), "ambiguous");
  assert.equal(statusByCriterion.get("accessible-visual-text-alternative"), "ambiguous");
  assert.equal(statusByCriterion.get("confidence-diagnostic-misconceptions"), "ambiguous");
  assert.ok(
    report.releaseInputPaths.some((path) =>
      path
        .replaceAll("\\", "/")
        .endsWith("content/source-maps/module27_source_audit_addendum.md"),
    ),
  );
});

test("the M28 structural packet binds the linear-algebra spine without laundering ambiguous evidence", async () => {
  const { graph, registry } = await packetFixture();
  const report = await validateLegacyModuleContractPacketRegistry(graph, registry, { siteRoot });

  const packet = report.packetById.get("m28-linear-algebra-stability-structural-candidate");
  assert.equal(packet?.moduleId, "m28");
  assert.deepEqual(packet?.canonicalExpectation.academicPrerequisiteModuleIds, ["m17", "m27"]);
  assert.equal(packet?.canonicalExpectation.forwardModuleId, "m29");
  assert.equal(packet?.packetState, "structural-candidate");
  assert.equal(packet?.humanReviewState, "not-reviewed");
  assert.equal(packet?.publicationEffect, "none");

  const statusByCriterion = new Map(
    packet?.criteria.map((criterion) => [criterion.criterionId, criterion.legacyAuditStatus]),
  );
  assert.equal(
    statusByCriterion.get(
      "rigor-definitions-assumptions-derivations-proofs-counterexamples-numerical-experiments",
    ),
    "ambiguous",
  );
  assert.equal(statusByCriterion.get("code-reading-debugging-design"), "ambiguous");
  assert.equal(statusByCriterion.get("source-ledger"), "ambiguous");
  assert.equal(statusByCriterion.get("accessible-visual-text-alternative"), "ambiguous");
  assert.equal(statusByCriterion.get("confidence-diagnostic-misconceptions"), "ambiguous");
  assert.ok(
    report.releaseInputPaths.some((path) =>
      path
        .replaceAll("\\", "/")
        .endsWith("content/source-maps/module28_linear_algebra_source_audit_addendum.md"),
    ),
  );
});

test("the M30 structural packet binds its mathematics spine without laundering ambiguous evidence", async () => {
  const { graph, registry } = await packetFixture();
  const report = await validateLegacyModuleContractPacketRegistry(graph, registry, { siteRoot });

  assert.equal(report.summary.structuralCandidates, 11);
  const packet = report.packetById.get("m30-probability-inference-structural-candidate");
  assert.equal(packet?.moduleId, "m30");
  assert.deepEqual(packet?.canonicalExpectation.academicPrerequisiteModuleIds, ["m27", "m29"]);
  assert.equal(packet?.canonicalExpectation.forwardModuleId, "m31");
  assert.equal(packet?.packetState, "structural-candidate");
  assert.equal(packet?.humanReviewState, "not-reviewed");
  assert.equal(packet?.publicationEffect, "none");

  const statusByCriterion = new Map(
    packet?.criteria.map((criterion) => [criterion.criterionId, criterion.legacyAuditStatus]),
  );
  assert.equal(statusByCriterion.get("first-principles"), "ambiguous");
  assert.equal(
    statusByCriterion.get(
      "rigor-definitions-assumptions-derivations-proofs-counterexamples-numerical-experiments",
    ),
    "ambiguous",
  );
  assert.equal(statusByCriterion.get("source-ledger"), "ambiguous");
  assert.ok(
    report.releaseInputPaths.some((path) =>
      path
        .replaceAll("\\", "/")
        .endsWith("content/source-maps/module30_probability_statistics_scientific_inference_source_audit_addendum.md"),
    ),
  );
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

  const unboundForwardArtifact = structuredClone(registry);
  unboundForwardArtifact.modules[0].sessionSpine[0].forwardArtifactId = "m29-unbound-artifact";
  await assert.rejects(
    validateLegacyModuleContractPacketRegistry(graph, unboundForwardArtifact, { siteRoot }),
    /forwardArtifactId must resolve its matching session-output pointer/u,
  );

  const misplacedForwardArtifact = structuredClone(registry);
  misplacedForwardArtifact.modules[0].pointers.find(
    ({ id }) => id === "m29-limit-continuity-calibration-note",
  ).target.headingAnchor = "3-session-1--limits-continuity-metric-spaces-and-compactness";
  await assert.rejects(
    validateLegacyModuleContractPacketRegistry(graph, misplacedForwardArtifact, { siteRoot }),
    /forwardArtifactId must resolve a visible h3 inside its matching session/u,
  );

  const crossSessionForwardArtifact = structuredClone(registry);
  crossSessionForwardArtifact.modules[0].pointers.find(
    ({ id }) => id === "m29-limit-continuity-calibration-note",
  ).target.headingAnchor = "session-2-prediction-before-reveal";
  await assert.rejects(
    validateLegacyModuleContractPacketRegistry(graph, crossSessionForwardArtifact, { siteRoot }),
    /forwardArtifactId must resolve a visible h3 inside its matching session/u,
  );

  const malformedOutputRoles = structuredClone(registry);
  malformedOutputRoles.modules[0].pointers.find(
    ({ id }) => id === "m29-limit-continuity-calibration-note",
  ).roles = null;
  await assert.rejects(
    validateLegacyModuleContractPacketRegistry(graph, malformedOutputRoles, { siteRoot }),
    /roles must be a non-empty array of unique roles/u,
  );

  const malformedWorkbookPath = structuredClone(registry);
  malformedWorkbookPath.modules[0].workbookPath = null;
  await assert.rejects(
    validateLegacyModuleContractPacketRegistry(graph, malformedWorkbookPath, { siteRoot }),
    /workbookPath must be a normalized repository-relative path without escapes/u,
  );

  const orphanSessionOutput = structuredClone(registry);
  orphanSessionOutput.modules[0].pointers.push({
    ...orphanSessionOutput.modules[0].pointers.find(
      ({ id }) => id === "m29-limit-continuity-calibration-note",
    ),
    id: "m29-orphan-session-output",
    label: "Orphan session output",
  });
  await assert.rejects(
    validateLegacyModuleContractPacketRegistry(graph, orphanSessionOutput, { siteRoot }),
    /session-output pointers must bind exactly the declared forward artifacts/u,
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
