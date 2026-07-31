import { createHash } from "node:crypto";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { loadCourseGraph } from "./course-graph.mjs";
import {
  criterionIds,
  loadModuleContractRegistry,
  promotionEvidenceRoleErrors,
  promotionEvidenceScopeErrors,
  promotionEvidenceTestErrors,
  promotionLearningCompanionErrors,
  promotionVisualAlternativeErrors,
  validateModuleContractRegistry,
} from "./module-contract-registry.mjs";
import {
  loadModuleEvidenceRecord,
  readTrackedText,
  validateModuleEvidenceRecord,
} from "./module-review-evidence.mjs";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const defaultSiteRoot = resolve(scriptDirectory, "..");

export const moduleEvidencePreflightDirectoryRelativePath =
  "content/course/contracts/evidence-preflight";
export const moduleEvidencePreflightKind = "atlas-module-evidence-preflight";
export const moduleEvidencePreflightRecordVersion = "v1";

const preflightKeys = [
  "schemaVersion",
  "kind",
  "recordVersion",
  "moduleId",
  "purpose",
  "truthBoundary",
  "state",
  "evidenceRecordPath",
  "openCriterionIds",
  "promotionBlockers",
];
const truthBoundaryKeys = ["candidate", "review", "release"];
const candidateState = "candidate-not-promoting";
const requiredM29OpenCriterionIds = ["release-provenance-ci-and-deployment-evidence"];
const requiredM29PromotionBlockers = [
  "human-review",
  "review-ready-commit",
  "source-commit-ci-run",
  "private-deployment-record",
];
const expectedM29PreflightReleaseBoundary =
  "This record is not CI, source-commit, private-deployment, security, release, or publication evidence. The required release criterion remains explicitly open.";
const expectedM29EvidenceRecordReleaseBoundary =
  "This candidate record is not a CI result, source-review record, deployment record, private release, security clearance, or publication claim.";
const expectedM29ReleaseCriterionClaim =
  "This candidate-only preflight and its documentation state their own scope: they do not bind or establish human-review, source-commit CI, deployment, or release evidence from local files.";
const expectedM29ReleaseCriterionLimitation =
  "This record does not itself bind a CI run, human source review, deployment record, release record, or publication evidence; the release criterion remains open.";
const expectedM29CandidateDocumentationPath = "docs/module-evidence/m29/candidate-preflight.md";
const expectedM29CandidateDocumentationDigest =
  "sha256:e6a9ce6345b84696a063747ddfa0127ee620b281be6c6d4080aae11921e2917e";

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function hasText(value) {
  return typeof value === "string" && value.trim() !== "";
}

function exactKeys(value, expectedKeys, label, errors) {
  if (!isPlainObject(value)) {
    errors.push(`${label} must be an object.`);
    return false;
  }
  const actual = Object.keys(value).sort();
  const expected = [...expectedKeys].sort();
  if (actual.length !== expected.length || actual.some((key, index) => key !== expected[index])) {
    errors.push(`${label} must use exactly these keys: ${expected.join(", ")}.`);
    return false;
  }
  return true;
}

function sameOrderedValues(actual, expected) {
  return (
    Array.isArray(actual) &&
    actual.length === expected.length &&
    actual.every((value, index) => value === expected[index])
  );
}

function preflightFailure(errors) {
  if (errors.length > 0) {
    throw new Error(`Module evidence preflight failed:\n- ${errors.join("\n- ")}`);
  }
}

export function moduleEvidencePreflightRelativePath(moduleId) {
  if (!/^m(?:0[1-9]|[1-9]\d)$/u.test(moduleId ?? "")) {
    throw new Error("A module evidence-preflight path requires a canonical module ID.");
  }
  return `${moduleEvidencePreflightDirectoryRelativePath}/${moduleId}.v1.json`;
}

export function moduleEvidencePreflightPath(moduleId, siteRoot = defaultSiteRoot) {
  return resolve(siteRoot, moduleEvidencePreflightRelativePath(moduleId));
}

function canonicalPreflightRepositoryPath(recordPath) {
  if (typeof recordPath !== "string") {
    throw new Error("A module evidence-preflight loader requires a canonical module-scoped path.");
  }
  const match = /^content\/course\/contracts\/evidence-preflight\/(m(?:0[1-9]|[1-9]\d))\.v1\.json$/u.exec(recordPath);
  if (!match || moduleEvidencePreflightRelativePath(match[1]) !== recordPath) {
    throw new Error("A module evidence-preflight loader requires a canonical module-scoped path.");
  }
  return recordPath;
}

async function readTrackedPreflightJson(siteRoot, repositoryPath) {
  const errors = [];
  const textRecord = await readTrackedText(
    siteRoot,
    repositoryPath,
    `Module evidence-preflight ${repositoryPath}`,
    errors,
  );
  if (!textRecord) {
    throw new Error(errors.join("\n"));
  }
  try {
    return JSON.parse(textRecord.text);
  } catch (error) {
    throw new Error(
      `Module evidence-preflight ${repositoryPath} must contain parseable JSON: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

export async function loadModuleEvidencePreflight(
  recordPath,
  { siteRoot = defaultSiteRoot } = {},
) {
  return readTrackedPreflightJson(siteRoot, canonicalPreflightRepositoryPath(recordPath));
}

function validatePreflightRecord(preflight, errors) {
  exactKeys(preflight, preflightKeys, "module evidence preflight", errors);
  if (
    preflight?.schemaVersion !== 1 ||
    preflight?.kind !== moduleEvidencePreflightKind ||
    preflight?.recordVersion !== moduleEvidencePreflightRecordVersion
  ) {
    errors.push(
      `module evidence preflight must use schemaVersion 1, kind ${moduleEvidencePreflightKind}, and recordVersion ${moduleEvidencePreflightRecordVersion}.`,
    );
  }
  if (preflight?.moduleId !== "m29") {
    errors.push("The first candidate evidence preflight is intentionally scoped to m29.");
  }
  if (!hasText(preflight?.purpose)) {
    errors.push("module evidence preflight.purpose must be non-empty text.");
  }
  exactKeys(preflight?.truthBoundary, truthBoundaryKeys, "module evidence preflight.truthBoundary", errors);
  for (const key of truthBoundaryKeys) {
    if (!hasText(preflight?.truthBoundary?.[key])) {
      errors.push(`module evidence preflight.truthBoundary.${key} must be non-empty text.`);
    }
  }
  if (preflight?.truthBoundary?.release !== expectedM29PreflightReleaseBoundary) {
    errors.push("M29 evidence preflight must preserve the exact candidate-only release nonclaim.");
  }
  if (preflight?.state !== candidateState) {
    errors.push(`module evidence preflight.state must be ${candidateState}; it may not label a candidate review-ready or published.`);
  }
  if (preflight?.evidenceRecordPath !== "content/course/contracts/evidence/m29.v1.json") {
    errors.push("M29 evidence preflight must bind content/course/contracts/evidence/m29.v1.json.");
  }
  if (!sameOrderedValues(preflight?.openCriterionIds, requiredM29OpenCriterionIds)) {
    errors.push("M29 evidence preflight must leave only release-provenance-ci-and-deployment-evidence open.");
  }
  if (!sameOrderedValues(preflight?.promotionBlockers, requiredM29PromotionBlockers)) {
    errors.push("M29 evidence preflight must name every unresolved human-review, commit, CI, and deployment blocker.");
  }
}

function validateNonPromotionState(moduleEntry, graphModule, errors) {
  if (!moduleEntry) {
    errors.push("M29 evidence preflight requires a canonical M29 registry entry.");
    return;
  }
  if (
    moduleEntry.contractState !== "legacy-baseline" ||
    moduleEntry.evidenceRecord !== null ||
    moduleEntry.reviewRecord !== null ||
    moduleEntry.reviewReadyCommit !== null ||
    moduleEntry.release !== null
  ) {
    errors.push("M29 evidence preflight requires the canonical registry to remain legacy-baseline with no promotion records.");
  }
  if (Object.values(moduleEntry.humanReview ?? {}).some((outcome) => outcome !== "pending")) {
    errors.push("M29 evidence preflight requires every canonical human-review dimension to remain pending.");
  }
  if (
    graphModule?.state?.contract?.track !== "legacy-v1" ||
    graphModule.state.contract.state !== "legacy-baseline" ||
    graphModule.state.release?.state !== "unrecorded" ||
    graphModule.state.release?.recordId !== null
  ) {
    errors.push("M29 evidence preflight must preserve the canonical graph legacy-v1/legacy-baseline and unrecorded release tuple.");
  }
}

async function validateCandidateReleaseBoundary(preflight, evidenceReport, errors, { siteRoot }) {
  const releaseEntry = evidenceReport.evidenceByCriterion.get(
    "release-provenance-ci-and-deployment-evidence",
  );
  const releaseInputs = releaseEntry?.resolvedInputs ?? [];
  const selfBound = releaseInputs.filter(
    ({ kind, role, path, locator }) =>
      kind === "json-pointer" &&
      role === "provenance" &&
      path === moduleEvidencePreflightRelativePath("m29") &&
      locator === "/truthBoundary/release",
  );
  const documentationBound = releaseInputs.filter(
    ({ kind, role, path, locator }) =>
      kind === "markdown-heading" &&
      role === "provenance" &&
      path === expectedM29CandidateDocumentationPath &&
      locator === "candidate-boundary",
  );
  if (releaseInputs.length !== 2 || selfBound.length !== 1 || documentationBound.length !== 1) {
    errors.push("M29 candidate release evidence must bind exactly its explicit release nonclaim and candidate-boundary documentation.");
  }
  if (evidenceReport.record?.truthBoundary?.release !== expectedM29EvidenceRecordReleaseBoundary) {
    errors.push("M29 candidate evidence record must preserve the exact candidate-only evidence-record release nonclaim.");
  }
  if (releaseEntry?.claim !== expectedM29ReleaseCriterionClaim) {
    errors.push("M29 candidate release evidence must preserve the exact candidate-only release-boundary claim.");
  }
  if (
    !Array.isArray(releaseEntry?.limitations) ||
    releaseEntry.limitations.length !== 1 ||
    releaseEntry.limitations[0] !== expectedM29ReleaseCriterionLimitation
  ) {
    errors.push("M29 candidate release evidence must preserve its exact open-criterion limitation.");
  }
  if (preflight.truthBoundary?.release !== expectedM29PreflightReleaseBoundary) {
    errors.push("M29 candidate release evidence must preserve the preflight's exact release nonclaim.");
  }
  const documentationErrors = [];
  const documentation = await readTrackedText(
    siteRoot,
    expectedM29CandidateDocumentationPath,
    "M29 candidate release documentation",
    documentationErrors,
  );
  if (!documentation) {
    errors.push(...documentationErrors);
  } else {
    const digest = `sha256:${createHash("sha256").update(documentation.text, "utf8").digest("hex")}`;
    if (digest !== expectedM29CandidateDocumentationDigest) {
      errors.push("M29 candidate release evidence must preserve the reviewed candidate-boundary documentation digest.");
    }
  }
  if (!sameOrderedValues(preflight?.openCriterionIds, requiredM29OpenCriterionIds)) {
    errors.push("M29 candidate release criterion may not be silently closed by structural input resolution.");
  }
}

/**
 * Validate an M29 candidate evidence dossier without changing lifecycle state.
 * A passing report means only that module-scoped structural inputs resolve and
 * meet the profile; it is not a human review, learner-mastery, CI, deployment,
 * or publication result.
 */
export async function validateModuleEvidencePreflight(
  preflight,
  {
    siteRoot = defaultSiteRoot,
    evidenceRecord: suppliedEvidenceRecord = null,
    graph: suppliedGraph = null,
    registry: suppliedRegistry = null,
  } = {},
) {
  const errors = [];
  validatePreflightRecord(preflight, errors);

  const [graph, registry] = await Promise.all([
    suppliedGraph ?? loadCourseGraph(siteRoot),
    suppliedRegistry ?? loadModuleContractRegistry(siteRoot),
  ]);
  let registryReport = null;
  try {
    registryReport = await validateModuleContractRegistry(graph, registry, { siteRoot });
  } catch (error) {
    errors.push(`M29 evidence preflight requires the current canonical registry to validate: ${error instanceof Error ? error.message : String(error)}`);
  }

  const graphModule = graph.modules?.find(({ id }) => id === "m29") ?? null;
  const moduleEntry = registry.modules?.find(({ moduleId }) => moduleId === "m29") ?? null;
  if (!graphModule) errors.push("M29 evidence preflight requires canonical graph module m29.");
  validateNonPromotionState(moduleEntry, graphModule, errors);

  let evidenceRecord = suppliedEvidenceRecord;
  if (!evidenceRecord && preflight?.evidenceRecordPath) {
    try {
      evidenceRecord = await loadModuleEvidenceRecord(preflight.evidenceRecordPath, { siteRoot });
    } catch (error) {
      errors.push(`M29 evidence preflight could not load its candidate evidence record: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  let evidenceReport = null;
  if (evidenceRecord) {
    try {
      evidenceReport = await validateModuleEvidenceRecord(evidenceRecord, {
        siteRoot,
        expectedModuleId: "m29",
        requiredCriterionIds: criterionIds,
      });
    } catch (error) {
      errors.push(`M29 evidence preflight requires all 18 candidate evidence criteria to resolve: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  if (evidenceReport && graphModule && moduleEntry && registryReport) {
    errors.push(...promotionEvidenceRoleErrors(moduleEntry, graphModule, evidenceReport));
    errors.push(...promotionEvidenceScopeErrors({
      moduleEntry,
      graphModule,
      manifestById: new Map(registryReport.manifest.modules.map((module) => [module.id, module])),
      evidenceReport,
    }));
    errors.push(...await promotionEvidenceTestErrors({
      siteRoot,
      moduleEntry,
      graphModule,
      evidenceReport,
    }));
    errors.push(...await promotionLearningCompanionErrors({
      siteRoot,
      moduleEntry,
      graph,
      evidenceReport,
    }));
    const visual = await promotionVisualAlternativeErrors({
      siteRoot,
      moduleEntry,
      graphModule,
      manifestById: new Map(registryReport.manifest.modules.map((module) => [module.id, module])),
      evidenceReport,
    });
    errors.push(...visual.errors);
    await validateCandidateReleaseBoundary(preflight, evidenceReport, errors, { siteRoot });
  }

  preflightFailure(errors);
  return {
    moduleId: "m29",
    state: candidateState,
    contractState: moduleEntry.contractState,
    evidenceRecordPath: preflight.evidenceRecordPath,
    openCriterionIds: [...preflight.openCriterionIds],
    promotionBlockers: [...preflight.promotionBlockers],
    evidenceReport,
  };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const preflight = await loadModuleEvidencePreflight(moduleEvidencePreflightRelativePath("m29"));
  const report = await validateModuleEvidencePreflight(preflight);
  console.log(
    `M29 candidate evidence preflight passed: ${report.evidenceReport.summary.evidenceItems} criteria resolve; ${report.openCriterionIds.join(", ")} remains open.`,
  );
}
