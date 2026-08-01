import { execFile } from "node:child_process";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import { isolatedGitEnvironment } from "./git-index-snapshot.mjs";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const defaultSiteRoot = resolve(scriptDirectory, "..");
const execFileAsync = promisify(execFile);

export const m31M36PublicationReadinessAuditRelativePath =
  "docs/M31_M36_PUBLICATION_READINESS_AUDIT.v1.json";
export const canonicalCourseGraphRelativePath = "content/course/course-graph.v1.json";
export const canonicalModuleManifestRelativePath = "content/modules/manifest.json";

const expectedModuleIds = ["m31", "m32", "m33", "m34", "m35", "m36"];
const expectedStatusTermIds = [
  "authoring-only",
  "authoring-plan-only",
  "authoring-research-only",
  "shared-infrastructure-only",
  "not-evidenced",
  "blocked-by-design",
];
const expectedPublicationArtifactIds = [
  "prerequisite-and-forward-map",
  "six-connected-sessions",
  "first-principles-and-transfer-work",
  "rigor-derivations-counterexamples-and-numerical-experiments",
  "source-ledger-and-license-boundary",
  "accessible-visual-equivalents",
  "confidence-aware-diagnostic-and-retrieval",
  "project-or-dossier-with-acceptance-evidence",
  "supportive-oral-defense",
  "module-specific-ta-study-partner-and-handoff",
  "bounded-studio-or-equivalent-reference-model-and-teaching-tests",
  "structured-module-contract-and-human-review",
  "learner-page-manifest-and-route-metadata",
  "release-provenance-ci-and-deployment-evidence",
];
const expectedTopLevelKeys = [
  "schemaVersion",
  "kind",
  "auditDate",
  "auditedGitHead",
  "scope",
  "statusTerms",
  "evidenceSources",
  "publicationArtifactIds",
  "sharedInfrastructureBoundary",
  "modules",
  "synthesisBoundary",
  "honestReleaseSequence",
  "findings",
  "checksRun",
  "noFixConfirmation",
];
const expectedModuleRowKeys = [
  "moduleId",
  "number",
  "title",
  "canonicalState",
  "academicDependencies",
  "existingAuthoringEvidence",
  "artifactStatus",
  "missingEvidence",
  "bridgeBlockerIds",
  "publicationVerdict",
];
const expectedCanonicalState = {
  lifecycle: "authoring-only",
  availability: "authoring-only",
  sourceMap: null,
  studioId: null,
  releaseEvidenceStatus: "planned",
};

const standardAdvancedArtifactMatrix = Object.freeze({
  "prerequisite-and-forward-map": "authoring-plan-only",
  "six-connected-sessions": "authoring-plan-only",
  "first-principles-and-transfer-work": "not-evidenced",
  "rigor-derivations-counterexamples-and-numerical-experiments": "not-evidenced",
  "source-ledger-and-license-boundary": "not-evidenced",
  "accessible-visual-equivalents": "not-evidenced",
  "confidence-aware-diagnostic-and-retrieval": "not-evidenced",
  "project-or-dossier-with-acceptance-evidence": "not-evidenced",
  "supportive-oral-defense": "shared-infrastructure-only",
  "module-specific-ta-study-partner-and-handoff": "not-evidenced",
  "bounded-studio-or-equivalent-reference-model-and-teaching-tests": "not-evidenced",
  "structured-module-contract-and-human-review": "not-evidenced",
  "learner-page-manifest-and-route-metadata": "blocked-by-design",
  "release-provenance-ci-and-deployment-evidence": "not-evidenced",
});

const expectedArtifactMatrixByModuleId = Object.freeze({
  m31: Object.freeze({
    "prerequisite-and-forward-map": "authoring-plan-only",
    "six-connected-sessions": "authoring-plan-only",
    "first-principles-and-transfer-work": "authoring-plan-only",
    "rigor-derivations-counterexamples-and-numerical-experiments": "authoring-plan-only",
    "source-ledger-and-license-boundary": "authoring-research-only",
    "accessible-visual-equivalents": "authoring-plan-only",
    "confidence-aware-diagnostic-and-retrieval": "authoring-plan-only",
    "project-or-dossier-with-acceptance-evidence": "authoring-plan-only",
    "supportive-oral-defense": "authoring-plan-only",
    "module-specific-ta-study-partner-and-handoff": "authoring-plan-only",
    "bounded-studio-or-equivalent-reference-model-and-teaching-tests": "not-evidenced",
    "structured-module-contract-and-human-review": "not-evidenced",
    "learner-page-manifest-and-route-metadata": "blocked-by-design",
    "release-provenance-ci-and-deployment-evidence": "not-evidenced",
  }),
  m32: standardAdvancedArtifactMatrix,
  m33: standardAdvancedArtifactMatrix,
  m34: standardAdvancedArtifactMatrix,
  m35: standardAdvancedArtifactMatrix,
  m36: standardAdvancedArtifactMatrix,
});

function hasText(value) {
  return typeof value === "string" && value.trim() !== "";
}

function sameOrderedValues(actual, expected) {
  return (
    Array.isArray(actual) &&
    actual.length === expected.length &&
    actual.every((value, index) => value === expected[index])
  );
}

function objectValue(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function requireExactKeys(value, expectedKeys, label, errors) {
  if (!objectValue(value)) {
    errors.push(`${label} must be an object.`);
    return false;
  }
  const actualKeys = Object.keys(value).sort();
  const orderedExpectedKeys = [...expectedKeys].sort();
  if (
    actualKeys.length !== orderedExpectedKeys.length ||
    actualKeys.some((key, index) => key !== orderedExpectedKeys[index])
  ) {
    errors.push(`${label} keys must match the v1 readiness-audit schema exactly.`);
    return false;
  }
  return true;
}

function validateText(value, label, errors) {
  if (!hasText(value)) {
    errors.push(`${label} must be a non-empty string.`);
  }
}

function validateTextArray(value, label, errors, { minimum = 1 } = {}) {
  if (!Array.isArray(value) || value.length < minimum || value.some((item) => !hasText(item))) {
    errors.push(`${label} must be an array of at least ${minimum} non-empty string(s).`);
    return false;
  }
  return true;
}

function validateRepositoryReference(value, label, errors) {
  if (!hasText(value)) {
    errors.push(`${label} must be a non-empty repository-relative reference.`);
    return false;
  }
  const hashIndex = value.indexOf("#");
  const path = hashIndex === -1 ? value : value.slice(0, hashIndex);
  const fragment = hashIndex === -1 ? "" : value.slice(hashIndex + 1);
  if (
    !path ||
    path.includes("\\") ||
    path.includes("\0") ||
    path.startsWith("/") ||
    path.split("/").some((segment) => segment === "" || segment === "." || segment === "..") ||
    (!path.startsWith("app/") && !path.startsWith("content/") && !path.startsWith("lib/") && !path.startsWith("scripts/") && !path.startsWith("tests/"))
  ) {
    errors.push(`${label} must use a normalized repository-relative project path.`);
    return false;
  }
  if (hashIndex !== -1 && (!fragment || !fragment.startsWith("/"))) {
    errors.push(`${label} must use an RFC 6901-style JSON-pointer fragment when a fragment is present.`);
    return false;
  }
  return true;
}

function validateAuditDate(value, errors) {
  if (!/^\d{4}-\d{2}-\d{2}$/u.test(value ?? "")) {
    errors.push("auditDate must use YYYY-MM-DD.");
    return;
  }
  const parsed = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(parsed.valueOf()) || parsed.toISOString().slice(0, 10) !== value) {
    errors.push("auditDate must be a real calendar date.");
  }
}

function auditFailure(errors) {
  if (errors.length > 0) {
    throw new Error(`M31–M36 publication-readiness audit validation failed:\n- ${errors.join("\n- ")}`);
  }
}

async function commitExists(siteRoot, commit) {
  return execFileAsync("git", ["cat-file", "-e", `${commit}^{commit}`], {
    cwd: siteRoot,
    env: isolatedGitEnvironment(),
  })
    .then(() => true)
    .catch(() => false);
}

async function loadGraphAtAuditedCommit(siteRoot, commit) {
  const specification = `${commit}:${canonicalCourseGraphRelativePath}`;
  const { stdout } = await execFileAsync("git", ["show", "--no-textconv", specification], {
    cwd: siteRoot,
    env: isolatedGitEnvironment(),
  });
  return JSON.parse(stdout);
}

async function loadManifestAtAuditedCommit(siteRoot, commit) {
  const specification = `${commit}:${canonicalModuleManifestRelativePath}`;
  const { stdout } = await execFileAsync("git", ["show", "--no-textconv", specification], {
    cwd: siteRoot,
    env: isolatedGitEnvironment(),
  });
  return JSON.parse(stdout);
}

function validateInformationalSections(audit, errors) {
  if (!Array.isArray(audit?.evidenceSources) || audit.evidenceSources.length === 0) {
    errors.push("evidenceSources must contain at least one checked-in evidence source.");
  } else {
    for (const [index, source] of audit.evidenceSources.entries()) {
      const label = `evidenceSources[${index}]`;
      if (requireExactKeys(source, ["path", "observation"], label, errors)) {
        validateRepositoryReference(source.path, `${label}.path`, errors);
        validateText(source.observation, `${label}.observation`, errors);
      }
    }
  }

  if (requireExactKeys(audit?.sharedInfrastructureBoundary, ["paths", "finding"], "sharedInfrastructureBoundary", errors)) {
    validateTextArray(audit.sharedInfrastructureBoundary.paths, "sharedInfrastructureBoundary.paths", errors);
    for (const [index, path] of (audit.sharedInfrastructureBoundary.paths ?? []).entries()) {
      validateRepositoryReference(path, `sharedInfrastructureBoundary.paths[${index}]`, errors);
    }
    validateText(audit.sharedInfrastructureBoundary.finding, "sharedInfrastructureBoundary.finding", errors);
  }

  if (!Array.isArray(audit?.honestReleaseSequence) || audit.honestReleaseSequence.length !== 6) {
    errors.push("honestReleaseSequence must contain exactly six non-mutating release-order records.");
  } else {
    for (const [index, step] of audit.honestReleaseSequence.entries()) {
      const label = `honestReleaseSequence[${index}]`;
      if (requireExactKeys(step, ["order", "action", "releaseEffect"], label, errors)) {
        if (step.order !== index + 1) {
          errors.push(`${label}.order must follow the declared 1–6 sequence.`);
        }
        validateText(step.action, `${label}.action`, errors);
        validateText(step.releaseEffect, `${label}.releaseEffect`, errors);
      }
    }
  }

  const validFindingSeverities = new Set(["Critical", "Watch", "Info"]);
  if (!Array.isArray(audit?.findings) || audit.findings.length === 0) {
    errors.push("findings must contain at least one audit finding.");
  } else {
    for (const [index, finding] of audit.findings.entries()) {
      const label = `findings[${index}]`;
      if (
        requireExactKeys(
          finding,
          ["severity", "state", "finding", "evidence", "impact", "confidence"],
          label,
          errors,
        )
      ) {
        if (!validFindingSeverities.has(finding.severity)) {
          errors.push(`${label}.severity must be Critical, Watch, or Info.`);
        }
        for (const field of ["state", "finding", "impact", "confidence"]) {
          validateText(finding[field], `${label}.${field}`, errors);
        }
        validateTextArray(finding.evidence, `${label}.evidence`, errors);
        for (const [evidenceIndex, path] of (finding.evidence ?? []).entries()) {
          validateRepositoryReference(path, `${label}.evidence[${evidenceIndex}]`, errors);
        }
      }
    }
  }

  if (!Array.isArray(audit?.checksRun) || audit.checksRun.length === 0) {
    errors.push("checksRun must contain historical audit check records.");
  } else {
    for (const [index, check] of audit.checksRun.entries()) {
      const label = `checksRun[${index}]`;
      if (requireExactKeys(check, ["command", "result"], label, errors)) {
        validateText(check.command, `${label}.command`, errors);
        validateText(check.result, `${label}.result`, errors);
      }
    }
  }
  // These are historical notes only. This validator deliberately does not replay
  // command strings or elevate their recorded results into release evidence.
  validateText(audit?.noFixConfirmation, "noFixConfirmation", errors);
}

function validateArtifactMatrix(entry, errors) {
  const moduleNumber = entry?.number ?? "(unknown)";
  const label = `Module ${moduleNumber}`;
  if (!requireExactKeys(entry?.artifactStatus, expectedPublicationArtifactIds, `${label} artifactStatus`, errors)) {
    return;
  }

  const expectedMatrix = expectedArtifactMatrixByModuleId[entry.moduleId];
  for (const artifactId of expectedPublicationArtifactIds) {
    const status = entry.artifactStatus[artifactId];
    if (!expectedStatusTermIds.includes(status)) {
      errors.push(`${label} artifactStatus.${artifactId} has an unsupported status.`);
      continue;
    }
    if (status !== expectedMatrix?.[artifactId]) {
      errors.push(`${label} artifact matrix does not match the audited v1 record.`);
    }
  }
}

function validateModuleRecord(entry, index, errors) {
  const expectedModuleId = expectedModuleIds[index];
  const expectedNumber = 31 + index;
  const label = `Module ${expectedNumber}`;
  if (!requireExactKeys(entry, expectedModuleRowKeys, `${label} readiness-audit row`, errors)) {
    return;
  }
  if (entry.moduleId !== expectedModuleId || entry.number !== expectedNumber) {
    errors.push(`${label} row identity must match ${expectedModuleId}.`);
  }
  validateText(entry.title, `${label}.title`, errors);

  if (
    requireExactKeys(
      entry.canonicalState,
      ["lifecycle", "availability", "sourceMap", "studioId", "releaseEvidenceStatus", "evidence"],
      `${label} canonicalState`,
      errors,
    )
  ) {
    if (entry.canonicalState.evidence !== `${canonicalCourseGraphRelativePath}#/modules/${30 + index}`) {
      errors.push(`${label} canonicalState.evidence must identify its graph row.`);
    }
  }

  const expectedDependencyKeys =
    entry.moduleId === "m31"
      ? ["prerequisiteModuleNumbers", "forwardModuleNumber", "plannedDirectConsumers", "evidence"]
      : ["prerequisiteModuleNumbers", "forwardModuleNumber", "evidence"];
  if (requireExactKeys(entry.academicDependencies, expectedDependencyKeys, `${label} academicDependencies`, errors)) {
    if (!Array.isArray(entry.academicDependencies.prerequisiteModuleNumbers)) {
      errors.push(`${label} academicDependencies.prerequisiteModuleNumbers must be an array.`);
    }
    if (entry.academicDependencies.evidence !== `content/course/m31-m36-prerequisite-session-bridge.v1.json#/modules/${index}`) {
      errors.push(`${label} academicDependencies.evidence must identify its bridge row.`);
    }
    if (entry.moduleId === "m31" && !sameOrderedValues(entry.academicDependencies.plannedDirectConsumers, [32, 34, 35, 36])) {
      errors.push("Module 31 plannedDirectConsumers must list its four audited direct consumers in canonical order.");
    }
  }

  if (!Array.isArray(entry.existingAuthoringEvidence) || entry.existingAuthoringEvidence.length === 0) {
    errors.push(`${label} existingAuthoringEvidence must contain bounded non-publication evidence.`);
  } else {
    for (const [evidenceIndex, evidence] of entry.existingAuthoringEvidence.entries()) {
      const evidenceLabel = `${label} existingAuthoringEvidence[${evidenceIndex}]`;
      if (requireExactKeys(evidence, ["path", "classification", "coverage"], evidenceLabel, errors)) {
        validateRepositoryReference(evidence.path, `${evidenceLabel}.path`, errors);
        if (!expectedStatusTermIds.includes(evidence.classification)) {
          errors.push(`${evidenceLabel}.classification must use the readiness-audit status vocabulary.`);
        }
        validateText(evidence.coverage, `${evidenceLabel}.coverage`, errors);
      }
    }
  }

  validateArtifactMatrix(entry, errors);
  validateTextArray(entry.missingEvidence, `${label} missingEvidence`, errors);
  if (validateTextArray(entry.bridgeBlockerIds, `${label} bridgeBlockerIds`, errors)) {
    if (
      new Set(entry.bridgeBlockerIds).size !== entry.bridgeBlockerIds.length ||
      entry.bridgeBlockerIds.some((blockerId) => !blockerId.startsWith(`${entry.moduleId}-`))
    ) {
      errors.push(`${label} bridgeBlockerIds must be unique and module-specific.`);
    }
  }
  if (!hasText(entry.publicationVerdict) || !entry.publicationVerdict.startsWith("Do not publish.")) {
    errors.push(`${label} publicationVerdict must remain an explicit non-publication statement.`);
  }
}

function validateSynthesisBoundary(audit, graphById, errors) {
  if (!requireExactKeys(audit?.synthesisBoundary, ["m25", "m26"], "synthesisBoundary", errors)) {
    return;
  }

  for (const moduleId of ["m25", "m26"]) {
    const number = Number(moduleId.slice(1));
    const entry = audit.synthesisBoundary[moduleId];
    const label = `synthesisBoundary.${moduleId}`;
    if (
      !requireExactKeys(
        entry,
        ["canonicalState", "academicPrerequisiteModuleNumbers", "constraint", "evidence"],
        label,
        errors,
      )
    ) {
      continue;
    }
    if (entry.canonicalState !== "published lifecycle, preview availability") {
      errors.push(`${label}.canonicalState must preserve the published-lifecycle preview boundary.`);
    }
    validateText(entry.constraint, `${label}.constraint`, errors);
    validateTextArray(entry.evidence, `${label}.evidence`, errors);
    for (const [index, path] of (entry.evidence ?? []).entries()) {
      validateRepositoryReference(path, `${label}.evidence[${index}]`, errors);
    }

    const graphModule = graphById.get(moduleId);
    if (!graphModule) {
      errors.push(`${label} has no canonical graph module at auditedGitHead.`);
      continue;
    }
    if (graphModule.lifecycle !== "published" || graphModule.availability !== "preview") {
      errors.push(`${label} must remain a published-lifecycle preview in the audited graph.`);
    }
    if (!sameOrderedValues(entry.academicPrerequisiteModuleNumbers, graphModule.academicPrerequisiteNumbers)) {
      errors.push(`${label}.academicPrerequisiteModuleNumbers does not match the graph at auditedGitHead.`);
    }
    if (graphModule.number !== number) {
      errors.push(`${label} must identify Module ${number}.`);
    }
  }
}

function validateAuditedGraphFacts(audit, graph, errors) {
  if (!Array.isArray(graph?.modules)) {
    errors.push("the canonical graph at auditedGitHead must define modules.");
    return [];
  }
  const graphById = new Map(graph.modules.map((courseModule) => [courseModule.id, courseModule]));
  const auditRows = new Map((audit.modules ?? []).map((entry) => [entry?.moduleId, entry]));
  const moduleStates = [];

  for (const [index, moduleId] of expectedModuleIds.entries()) {
    const number = 31 + index;
    const graphModule = graphById.get(moduleId);
    const auditRow = auditRows.get(moduleId);
    if (!graphModule) {
      errors.push(`Module ${number} is missing from the canonical graph at auditedGitHead.`);
      continue;
    }
    if (!auditRow) {
      errors.push(`Module ${number} is missing from the readiness audit.`);
      continue;
    }
    if (graphModule.number !== number || auditRow.number !== graphModule.number) {
      errors.push(`Module ${number} number does not match the graph at auditedGitHead.`);
    }
    if (auditRow.title !== graphModule.title) {
      errors.push(`Module ${number} title does not match the graph at auditedGitHead.`);
    }
    for (const [auditField, graphValue] of [
      ["lifecycle", graphModule.lifecycle],
      ["availability", graphModule.availability],
      ["sourceMap", graphModule.sourceMap],
      ["studioId", graphModule.studioId],
      ["releaseEvidenceStatus", graphModule.releaseEvidence?.status],
    ]) {
      if (auditRow.canonicalState?.[auditField] !== graphValue) {
        errors.push(`Module ${number} canonicalState.${auditField} does not match the graph at auditedGitHead.`);
      }
      if (graphValue !== expectedCanonicalState[auditField]) {
        errors.push(`Module ${number} must remain ${String(expectedCanonicalState[auditField])} for ${auditField} at auditedGitHead.`);
      }
    }
    if (!sameOrderedValues(auditRow.academicDependencies?.prerequisiteModuleNumbers, graphModule.academicPrerequisiteNumbers)) {
      errors.push(`Module ${number} academic prerequisites do not match the graph at auditedGitHead.`);
    }
    if (auditRow.academicDependencies?.forwardModuleNumber !== graphModule.forwardModuleNumber) {
      errors.push(`Module ${number} forward handoff does not match the graph at auditedGitHead.`);
    }
    moduleStates.push({
      moduleId,
      number,
      lifecycle: graphModule.lifecycle,
      availability: graphModule.availability,
      sourceMap: graphModule.sourceMap,
      studioId: graphModule.studioId,
      releaseEvidenceStatus: graphModule.releaseEvidence?.status,
    });
  }

  validateSynthesisBoundary(audit, graphById, errors);
  return moduleStates;
}

function validateAuditedManifestFacts(manifest, errors) {
  if (!objectValue(manifest) || !Array.isArray(manifest.modules)) {
    errors.push("the module manifest at auditedGitHead must define a module array.");
    return null;
  }
  const expectedManifestKeys = [
    "schemaVersion",
    "courseGraphSchemaVersion",
    "routePlanId",
    "moduleCount",
    "readableModuleCount",
    "previewModuleCount",
    "arcs",
    "modules",
  ];
  requireExactKeys(manifest, expectedManifestKeys, "manifest snapshot", errors);
  if (manifest.moduleCount !== 30 || manifest.modules.length !== 30) {
    errors.push("the manifest at auditedGitHead must contain exactly 30 modules.");
  }
  if (manifest.readableModuleCount !== 28) {
    errors.push("the manifest at auditedGitHead must report exactly 28 readable modules.");
  }
  if (manifest.previewModuleCount !== 2) {
    errors.push("the manifest at auditedGitHead must report exactly two preview modules.");
  }
  const availabilityCounts = manifest.modules.reduce(
    (counts, courseModule) => {
      counts[courseModule?.availability] = (counts[courseModule?.availability] ?? 0) + 1;
      return counts;
    },
    {},
  );
  if (availabilityCounts.published !== 28 || availabilityCounts.preview !== 2 || Object.keys(availabilityCounts).length !== 2) {
    errors.push("the manifest at auditedGitHead must contain 28 published-readable and two preview rows only.");
  }
  if (
    manifest.modules.some(
      (courseModule) =>
        expectedModuleIds.includes(courseModule?.id) ||
        (Number.isInteger(courseModule?.number) && courseModule.number >= 31 && courseModule.number <= 36),
    )
  ) {
    errors.push("the manifest at auditedGitHead must not expose M31–M36 entries.");
  }
  return {
    moduleCount: manifest.moduleCount,
    readableModuleCount: manifest.readableModuleCount,
    previewModuleCount: manifest.previewModuleCount,
    advancedModuleEntries: manifest.modules.filter(
      (courseModule) =>
        expectedModuleIds.includes(courseModule?.id) ||
        (Number.isInteger(courseModule?.number) && courseModule.number >= 31 && courseModule.number <= 36),
    ).length,
  };
}

/**
 * Validate the historical status/audit record only. It does not run recorded
 * commands, alter course state, or establish learner-readiness evidence.
 */
export async function validateM31M36PublicationReadinessAudit(
  audit,
  { siteRoot = defaultSiteRoot } = {},
) {
  const errors = [];
  requireExactKeys(audit, expectedTopLevelKeys, "readiness audit top-level", errors);
  if (audit?.schemaVersion !== 1 || audit?.kind !== "atlas-advanced-module-publication-readiness-audit") {
    errors.push("readiness audit must use schemaVersion 1 and kind atlas-advanced-module-publication-readiness-audit.");
  }
  validateAuditDate(audit?.auditDate, errors);
  const validCommitShape = /^[0-9a-f]{40}$/u.test(audit?.auditedGitHead ?? "");
  if (!validCommitShape) {
    errors.push("auditedGitHead must be a full lowercase Git commit SHA.");
  }

  if (requireExactKeys(audit?.scope, ["moduleIds", "purpose", "evidenceRule"], "scope", errors)) {
    if (!sameOrderedValues(audit.scope.moduleIds, expectedModuleIds)) {
      errors.push("scope.moduleIds must be exactly M31–M36 in canonical order.");
    }
    validateText(audit.scope.purpose, "scope.purpose", errors);
    validateText(audit.scope.evidenceRule, "scope.evidenceRule", errors);
  }

  if (requireExactKeys(audit?.statusTerms, expectedStatusTermIds, "statusTerms", errors)) {
    for (const statusTermId of expectedStatusTermIds) {
      validateText(audit.statusTerms[statusTermId], `statusTerms.${statusTermId}`, errors);
    }
  }
  if (!sameOrderedValues(audit?.publicationArtifactIds, expectedPublicationArtifactIds)) {
    errors.push("publicationArtifactIds must match the exact v1 release-readiness artifact matrix.");
  }

  if (!Array.isArray(audit?.modules) || audit.modules.length !== expectedModuleIds.length) {
    errors.push("modules must contain exactly M31–M36 readiness-audit rows.");
  } else {
    for (const [index, entry] of audit.modules.entries()) {
      validateModuleRecord(entry, index, errors);
    }
    if (!sameOrderedValues(audit.modules.map((entry) => entry?.moduleId), expectedModuleIds)) {
      errors.push("readiness-audit module rows must be M31–M36 in canonical order.");
    }
  }
  validateInformationalSections(audit, errors);

  let graph = null;
  let manifest = null;
  if (validCommitShape) {
    const hasCommit = await commitExists(siteRoot, audit.auditedGitHead);
    if (!hasCommit) {
      errors.push("auditedGitHead must resolve to an existing Git commit.");
    } else {
      try {
        graph = await loadGraphAtAuditedCommit(siteRoot, audit.auditedGitHead);
      } catch {
        errors.push("canonical course graph must be readable from auditedGitHead via git show.");
      }
      try {
        manifest = await loadManifestAtAuditedCommit(siteRoot, audit.auditedGitHead);
      } catch {
        errors.push("module manifest must be readable from auditedGitHead via git show.");
      }
    }
  }
  const moduleStates = graph ? validateAuditedGraphFacts(audit, graph, errors) : [];
  // This is a historical route-projection fact, not advanced-module readiness evidence.
  const manifestSnapshot = manifest ? validateAuditedManifestFacts(manifest, errors) : null;

  auditFailure(errors);
  return {
    auditedGitHead: audit.auditedGitHead,
    summary: {
      modules: expectedModuleIds.length,
      artifactCells: expectedModuleIds.length * expectedPublicationArtifactIds.length,
      publicationVerdicts: audit.modules.filter(
        ({ publicationVerdict }) => !publicationVerdict.startsWith("Do not publish."),
      ).length,
    },
    moduleStates,
    manifestSnapshot,
  };
}

export async function loadM31M36PublicationReadinessAudit(siteRoot = defaultSiteRoot) {
  return JSON.parse(
    await readFile(resolve(siteRoot, m31M36PublicationReadinessAuditRelativePath), "utf8"),
  );
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const audit = await loadM31M36PublicationReadinessAudit();
  const report = await validateM31M36PublicationReadinessAudit(audit);
  console.log(
    `M31–M36 publication-readiness audit: ${report.summary.modules} authoring-only modules; ${report.summary.artifactCells} non-publication artifact cells; audited Git head ${report.auditedGitHead}.`,
  );
}
