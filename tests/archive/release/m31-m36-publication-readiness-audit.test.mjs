import assert from "node:assert/strict";
import test from "node:test";
import {
  loadM31M36PublicationReadinessAudit,
  validateM31M36PublicationReadinessAudit,
} from "../../../scripts/archive/publication-readiness/validate-m31-m36-publication-readiness-audit.mjs";

test("the M31–M36 readiness audit is a non-publication snapshot of its audited Git commit", async () => {
  const audit = await loadM31M36PublicationReadinessAudit();
  const report = await validateM31M36PublicationReadinessAudit(audit);

  assert.equal(report.auditedGitHead, audit.auditedGitHead);
  assert.equal(report.summary.modules, 6);
  assert.equal(report.summary.artifactCells, 84);
  assert.equal(report.summary.publicationVerdicts, 0);
  assert.deepEqual(report.manifestSnapshot, {
    moduleCount: 30,
    readableModuleCount: 28,
    previewModuleCount: 2,
    advancedModuleEntries: 0,
  });
  assert.ok(audit.findings.every((finding) => !("nextKeystoneModule" in finding)));
  assert.deepEqual(report.moduleStates, [
    {
      moduleId: "m31",
      number: 31,
      lifecycle: "authoring-only",
      availability: "authoring-only",
      sourceMap: null,
      studioId: null,
      releaseEvidenceStatus: "planned",
    },
    {
      moduleId: "m32",
      number: 32,
      lifecycle: "authoring-only",
      availability: "authoring-only",
      sourceMap: null,
      studioId: null,
      releaseEvidenceStatus: "planned",
    },
    {
      moduleId: "m33",
      number: 33,
      lifecycle: "authoring-only",
      availability: "authoring-only",
      sourceMap: null,
      studioId: null,
      releaseEvidenceStatus: "planned",
    },
    {
      moduleId: "m34",
      number: 34,
      lifecycle: "authoring-only",
      availability: "authoring-only",
      sourceMap: null,
      studioId: null,
      releaseEvidenceStatus: "planned",
    },
    {
      moduleId: "m35",
      number: 35,
      lifecycle: "authoring-only",
      availability: "authoring-only",
      sourceMap: null,
      studioId: null,
      releaseEvidenceStatus: "planned",
    },
    {
      moduleId: "m36",
      number: 36,
      lifecycle: "authoring-only",
      availability: "authoring-only",
      sourceMap: null,
      studioId: null,
      releaseEvidenceStatus: "planned",
    },
  ]);
});

test("the readiness audit rejects schema drift, scope drift, and unsupported artifact states", async () => {
  const audit = await loadM31M36PublicationReadinessAudit();

  const unexpectedTopLevel = structuredClone(audit);
  unexpectedTopLevel.releaseReady = true;
  await assert.rejects(
    validateM31M36PublicationReadinessAudit(unexpectedTopLevel),
    /top-level keys must match the v1 readiness-audit schema/u,
  );

  const wrongScope = structuredClone(audit);
  wrongScope.scope.moduleIds = ["m31", "m32", "m33", "m34", "m35", "m99"];
  await assert.rejects(
    validateM31M36PublicationReadinessAudit(wrongScope),
    /scope\.moduleIds must be exactly M31–M36 in canonical order/u,
  );

  const unsupportedArtifactState = structuredClone(audit);
  unsupportedArtifactState.modules[0].artifactStatus[
    "source-ledger-and-license-boundary"
  ] = "release-ready";
  await assert.rejects(
    validateM31M36PublicationReadinessAudit(unsupportedArtifactState),
    /artifactStatus\.source-ledger-and-license-boundary has an unsupported status/u,
  );

  const implementationJargon = structuredClone(audit);
  implementationJargon.findings[0].nextKeystoneModule = "implementation";
  await assert.rejects(
    validateM31M36PublicationReadinessAudit(implementationJargon),
    /findings\[0\] keys must match the v1 readiness-audit schema exactly/u,
  );

  const malformedModuleRow = structuredClone(audit);
  malformedModuleRow.modules[0] = null;
  await assert.rejects(
    validateM31M36PublicationReadinessAudit(malformedModuleRow),
    /Module 31 readiness-audit row must be an object/u,
  );

  const unexpectedModuleField = structuredClone(audit);
  unexpectedModuleField.modules[0].releaseReady = true;
  await assert.rejects(
    validateM31M36PublicationReadinessAudit(unexpectedModuleField),
    /Module 31 readiness-audit row keys must match the v1 readiness-audit schema exactly/u,
  );
});

test("the readiness audit rejects a nonexistent commit and facts that disagree with the audited graph", async () => {
  const audit = await loadM31M36PublicationReadinessAudit();

  const nonexistentCommit = structuredClone(audit);
  nonexistentCommit.auditedGitHead = "0000000000000000000000000000000000000000";
  await assert.rejects(
    validateM31M36PublicationReadinessAudit(nonexistentCommit),
    /auditedGitHead must resolve to an existing Git commit/u,
  );

  const incorrectGraphFact = structuredClone(audit);
  incorrectGraphFact.modules[0].canonicalState.availability = "published";
  await assert.rejects(
    validateM31M36PublicationReadinessAudit(incorrectGraphFact),
    /Module 31 canonicalState\.availability does not match the graph at auditedGitHead/u,
  );
});

test("the readiness audit pins the full v1 artifact matrix instead of accepting a softer non-ready status", async () => {
  const audit = await loadM31M36PublicationReadinessAudit();
  const alteredMatrix = structuredClone(audit);
  alteredMatrix.modules[0].artifactStatus[
    "source-ledger-and-license-boundary"
  ] = "not-evidenced";

  await assert.rejects(
    validateM31M36PublicationReadinessAudit(alteredMatrix),
    /Module 31 artifact matrix does not match the audited v1 record/u,
  );
});
