import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import { lstat, readFile } from "node:fs/promises";
import { dirname, relative, resolve } from "node:path";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import {
  scanMermaidBlocks,
  validateMermaidAccessibility,
} from "../lib/mermaid-accessibility.mjs";
import {
  advancedModuleContractRelativePath,
  loadAdvancedModuleContractRegistry,
  validateAdvancedModuleContractRegistry,
} from "./advanced-module-contract.mjs";
import {
  advancedModuleBridgeRelativePath,
  loadAdvancedModuleBridgeLedger,
  validateAdvancedModuleBridgeLedger,
} from "./advanced-module-bridge.mjs";
import {
  legacyModuleContractAuditRelativePath,
  loadLegacyModuleContractAudit,
  validateLegacyModuleContractAudit,
} from "./validate-legacy-module-contract-audit.mjs";
import {
  loadModuleEvidenceRecord,
  loadModuleReviewRecord,
  validateModuleEvidenceRecord,
  validateModuleReviewRecord,
} from "./module-review-evidence.mjs";
import {
  moduleLearningCompanionRelativePath,
  validateModuleLearningCompanion,
} from "./module-learning-companion.mjs";
import {
  releaseEvidencePolicyRelativePath,
  validateReleaseEvidencePolicy,
  verifyCourseCiEvidence,
} from "./release-evidence-verifier.mjs";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const defaultSiteRoot = resolve(scriptDirectory, "..");
const execFileAsync = promisify(execFile);

export const moduleContractRegistryRelativePath =
  "content/course/contracts/module-contract-registry.v3.json";

const expectedTopLevelKeys = [
  "schemaVersion",
  "contractVersion",
  "kind",
  "purpose",
  "canonicalCourseGraph",
  "canonicalModuleManifest",
  "truthBoundary",
  "contractStates",
  "evidenceStates",
  "criterionIds",
  "humanReviewDimensions",
  "modules",
];
const expectedTruthBoundaryKeys = [
  "legacyBaseline",
  "authoringOnly",
  "reviewReady",
  "verified",
];
const expectedModuleKeys = [
  "moduleId",
  "contractState",
  "migration",
  "criteria",
  "humanReview",
  "evidenceRecord",
  "reviewRecord",
  "reviewReadyCommit",
  "release",
];
const expectedMigrationKeys = ["kind", "path", "locator"];
const expectedCriterionKeys = ["id", "status", "source"];
const expectedSourceKeys = ["kind", "path", "locator"];
const expectedRecordReferenceKeys = ["kind", "path", "locator"];
const expectedReleaseKeys = [
  "recordId",
  "sourceCommit",
  "ciRunUrl",
  "ciEvidencePath",
  "candidateInputPaths",
  "provenancePath",
  "sourceReviewPath",
  "knownLimitationsPath",
  "privateDeploymentVersion",
];
export const contractStates = [
  "not-started",
  "authoring-only",
  "legacy-baseline",
  "review-ready",
  "verified",
];
export const evidenceStates = [
  "planned",
  "pointer-present",
  "ambiguous",
  "missing",
  "reviewed",
  "release-ready",
];
export const criterionIds = [
  "prerequisite-forward-map",
  "six-connected-sessions",
  "first-principles",
  "rigor-definitions-assumptions-derivations-proofs-counterexamples-numerical-experiments",
  "code-reading-debugging-design",
  "prediction-before-reveal",
  "transfer-task",
  "source-ledger",
  "accessible-visual-text-alternative",
  "confidence-diagnostic-misconceptions",
  "retrieval-and-spaced-review",
  "project-and-evidence-rubric",
  "supportive-oral-defense",
  "ta-prompt",
  "study-partner-prompt",
  "forward-handoff",
  "interaction-reference-model-and-teaching-tests",
  "release-provenance-ci-and-deployment-evidence",
];

export const promotionEvidenceRoleRequirements = Object.freeze({
  "source-ledger": ["source-ledger"],
  "accessible-visual-text-alternative": ["course-content", "test"],
  "release-provenance-ci-and-deployment-evidence": ["provenance"],
});
export const humanReviewDimensions = [
  "first-principles-quality",
  "rigor-and-counterexamples",
  "source-claim-correctness",
  "visual-text-equivalent-quality",
  "assessment-explanation-quality",
  "project-evidence-quality",
  "ta-study-partner-usefulness",
  "oral-defense-quality",
];

const legacyCriterionIds = new Set(criterionIds.slice(0, 16));
const m31EvidenceByCriterion = {
  "prerequisite-forward-map": "prerequisite-and-forward-map",
  "six-connected-sessions": "six-connected-sessions",
  "first-principles": "first-principles-code-reading-prediction-and-transfer",
  "rigor-definitions-assumptions-derivations-proofs-counterexamples-numerical-experiments":
    "rigor-derivations-counterexamples-and-numerical-experiments",
  "code-reading-debugging-design": "first-principles-code-reading-prediction-and-transfer",
  "prediction-before-reveal": "first-principles-code-reading-prediction-and-transfer",
  "transfer-task": "first-principles-code-reading-prediction-and-transfer",
  "source-ledger": "source-ledger-claim-license-and-link-boundary",
  "accessible-visual-text-alternative": "accessible-visuals-and-concise-text-alternatives",
  "confidence-diagnostic-misconceptions": "confidence-aware-multiple-choice-diagnostic",
  "retrieval-and-spaced-review": "retrieval-and-spaced-review",
  "project-and-evidence-rubric": "dossier-rubric-and-acceptance-evidence",
  "supportive-oral-defense": "supportive-oral-defense",
  "ta-prompt": "ta-study-partner-and-forward-handoff",
  "study-partner-prompt": "ta-study-partner-and-forward-handoff",
  "forward-handoff": "ta-study-partner-and-forward-handoff",
  "interaction-reference-model-and-teaching-tests":
    "studio-reference-model-and-teaching-tests",
  "release-provenance-ci-and-deployment-evidence":
    "release-provenance-ci-and-deployment-evidence",
};

function registryFailure(errors) {
  if (errors.length > 0) {
    throw new Error(`Module-contract registry v3 validation failed:\n- ${errors.join("\n- ")}`);
  }
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function hasText(value) {
  return typeof value === "string" && value.trim() !== "";
}

function exactKeys(value, keys, label, errors) {
  if (!isPlainObject(value)) {
    errors.push(`${label} must be an object.`);
    return false;
  }
  const actual = Object.keys(value).sort();
  const expected = [...keys].sort();
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

function normalizedRepositoryPath(value) {
  return (
    hasText(value) &&
    !value.includes("\\") &&
    !value.includes("\0") &&
    !value.startsWith("/") &&
    !value.split("/").some((part) => part === "" || part === "." || part === "..")
  );
}

function decodePointerSegment(segment) {
  return segment.replaceAll("~1", "/").replaceAll("~0", "~");
}

function resolveJsonPointer(root, pointer) {
  if (pointer === "") return root;
  if (!hasText(pointer) || !pointer.startsWith("/")) return undefined;
  let current = root;
  for (const rawSegment of pointer.slice(1).split("/")) {
    const segment = decodePointerSegment(rawSegment);
    if (Array.isArray(current)) {
      if (!/^(?:0|[1-9]\d*)$/u.test(segment)) return undefined;
      current = current[Number(segment)];
    } else if (isPlainObject(current)) {
      if (!Object.hasOwn(current, segment)) return undefined;
      current = current[segment];
    } else {
      return undefined;
    }
  }
  return current;
}

async function isTrackedRegularFile(siteRoot, relativePath) {
  if (!normalizedRepositoryPath(relativePath)) return false;
  const absolutePath = resolve(siteRoot, relativePath);
  const pathFromRoot = relative(siteRoot, absolutePath).replaceAll("\\", "/");
  if (pathFromRoot !== relativePath) return false;
  const stats = await lstat(absolutePath).catch(() => null);
  if (!stats || !stats.isFile() || stats.isSymbolicLink()) return false;
  return execFileAsync("git", ["ls-files", "--error-unmatch", "--", relativePath], {
    cwd: siteRoot,
  })
    .then(() => true)
    .catch(() => false);
}

async function readTrackedJson(siteRoot, relativePath, label, errors) {
  if (!normalizedRepositoryPath(relativePath)) {
    errors.push(`${label} must be a normalized repository-relative path.`);
    return null;
  }
  if (!(await isTrackedRegularFile(siteRoot, relativePath))) {
    errors.push(`${label} must be a tracked regular local file.`);
    return null;
  }
  try {
    return JSON.parse(await readFile(resolve(siteRoot, relativePath), "utf8"));
  } catch (error) {
    errors.push(`${label} must be parseable JSON: ${error instanceof Error ? error.message : String(error)}`);
    return null;
  }
}

function validCommit(value) {
  return typeof value === "string" && /^[0-9a-f]{40}$/u.test(value);
}

async function checkedInRegistryAtCommit(siteRoot, commit, moduleId, errors) {
  try {
    const { stdout } = await execFileAsync(
      "git",
      ["show", `${commit}:${moduleContractRegistryRelativePath}`],
      { cwd: siteRoot },
    );
    const historical = JSON.parse(stdout);
    return historical.modules?.find((module) => module.moduleId === moduleId) ?? null;
  } catch (error) {
    errors.push(
      `reviewReadyCommit ${commit} must contain a readable prior v3 registry entry for ${moduleId}: ${error instanceof Error ? error.message : String(error)}`,
    );
    return null;
  }
}

async function isAncestor(siteRoot, ancestor, descendant = "HEAD") {
  return execFileAsync("git", ["merge-base", "--is-ancestor", ancestor, descendant], {
    cwd: siteRoot,
  })
    .then(() => true)
    .catch(() => false);
}

async function validatePromotionHistory(siteRoot, moduleEntry, promotionEvidence, errors) {
  if (!validCommit(moduleEntry.reviewReadyCommit)) {
    errors.push(`Module ${moduleEntry.moduleId} verified state requires a full reviewReadyCommit.`);
    return null;
  }
  const { reviewReadyCommit } = moduleEntry;
  if (!(await isAncestor(siteRoot, reviewReadyCommit))) {
    errors.push(`Module ${moduleEntry.moduleId} reviewReadyCommit must be an ancestor of HEAD.`);
    return null;
  }
  const historical = await checkedInRegistryAtCommit(
    siteRoot,
    reviewReadyCommit,
    moduleEntry.moduleId,
    errors,
  );
  if (historical?.contractState !== "review-ready") {
    errors.push(
      `Module ${moduleEntry.moduleId} verified state requires reviewReadyCommit to record review-ready, not ${historical?.contractState ?? "no entry"}.`,
    );
    return null;
  }
  if (
    JSON.stringify(historical.evidenceRecord) !== JSON.stringify(moduleEntry.evidenceRecord) ||
    JSON.stringify(historical.reviewRecord) !== JSON.stringify(moduleEntry.reviewRecord)
  ) {
    errors.push(`Module ${moduleEntry.moduleId} verified state must preserve the review-ready evidence and review record references.`);
  }
  for (const path of promotionEvidence?.candidateInputPaths ?? []) {
    const unchanged = await execFileAsync(
      "git",
      ["diff", "--quiet", reviewReadyCommit, "--", path],
      { cwd: siteRoot },
    )
      .then(() => true)
      .catch(() => false);
    if (!unchanged) {
      errors.push(`Module ${moduleEntry.moduleId} evidence input ${path} changed after reviewReadyCommit.`);
    }
  }
  return historical;
}

function validateSource(source, label, errors) {
  if (!exactKeys(source, expectedSourceKeys, `${label}.source`, errors)) return;
  if (source.kind === "none") {
    if (source.path !== null || source.locator !== null) {
      errors.push(`${label}.source none must use null path and locator.`);
    }
    return;
  }
  const allowedKinds = new Set([
    "legacy-audit-criterion",
    "advanced-authoring-adapter-evidence",
    "advanced-bridge-plan",
    "module-evidence-criterion",
  ]);
  if (!allowedKinds.has(source.kind)) {
    errors.push(`${label}.source kind is unsupported.`);
  }
  if (!normalizedRepositoryPath(source.path)) {
    errors.push(`${label}.source path must be a normalized repository-relative path.`);
  }
  if (!hasText(source.locator) || !source.locator.startsWith("/")) {
    errors.push(`${label}.source locator must be a JSON pointer.`);
  }
}

function recordReference(reference, expectedKind, label, errors) {
  if (!exactKeys(reference, expectedRecordReferenceKeys, label, errors)) return null;
  if (reference.kind !== expectedKind) {
    errors.push(`${label}.kind must be ${expectedKind}.`);
  }
  const path = normalizedRepositoryPath(reference.path) ? reference.path : null;
  if (!path || !path.endsWith(".json")) {
    errors.push(`${label}.path must be a normalized repository-relative JSON path.`);
  }
  if (reference.locator !== "") {
    errors.push(`${label}.locator must be the JSON-document root string.`);
  }
  return reference.kind === expectedKind && path && path.endsWith(".json") && reference.locator === ""
    ? path
    : null;
}

function sha256(value) {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

function moduleReleaseDocumentationPath(moduleId, field) {
  const filenameByField = {
    provenancePath: "provenance.md",
    sourceReviewPath: "source-review.md",
    knownLimitationsPath: "known-limitations.md",
    ciEvidencePath: "course-ci-evidence.v1.json",
  };
  const filename = filenameByField[field];
  return filename ? `docs/module-evidence/${moduleId}/${filename}` : null;
}

function validateHumanReview(moduleEntry, errors) {
  if (!exactKeys(moduleEntry.humanReview, humanReviewDimensions, `Module ${moduleEntry.moduleId} humanReview`, errors)) {
    return;
  }
  for (const dimension of humanReviewDimensions) {
    if (!["pending", "approved"].includes(moduleEntry.humanReview[dimension])) {
      errors.push(`Module ${moduleEntry.moduleId} human-review status for ${dimension} is invalid.`);
    }
  }
}

function requirePendingReview(moduleEntry, errors) {
  for (const dimension of humanReviewDimensions) {
    if (moduleEntry.humanReview?.[dimension] !== "pending") {
      errors.push(`${moduleEntry.contractState} Module ${moduleEntry.moduleId} may not contain human approval.`);
    }
  }
}

function requireNoPromotionRecords(moduleEntry, errors) {
  if (moduleEntry.evidenceRecord !== null || moduleEntry.reviewRecord !== null) {
    errors.push(`${moduleEntry.contractState} Module ${moduleEntry.moduleId} may not declare reviewed evidence or review records.`);
  }
}

async function readTextAtCommit(siteRoot, commit, repositoryPath, label, errors) {
  try {
    const { stdout } = await execFileAsync("git", ["show", `${commit}:${repositoryPath}`], {
      cwd: siteRoot,
    });
    return stdout;
  } catch (error) {
    errors.push(
      `${label} must exist at sourceCommit ${commit}: ${error instanceof Error ? error.message : String(error)}`,
    );
    return null;
  }
}

async function validateRelease(siteRoot, moduleEntry, graphModule, promotionEvidence, errors) {
  const label = `Module ${moduleEntry.moduleId} release`;
  if (moduleEntry.release === null) {
    errors.push(`${label} must be recorded before a module can be verified.`);
    return [];
  }
  if (!exactKeys(moduleEntry.release, expectedReleaseKeys, label, errors)) {
    return [];
  }
  const release = moduleEntry.release;
  if (!hasText(release.recordId) || !new RegExp(`^${moduleEntry.moduleId}-[a-z0-9][a-z0-9-]*$`, "u").test(release.recordId)) {
    errors.push(`${label}.recordId must be a module-prefixed stable identifier.`);
  }
  if (
    graphModule.state.release.state !== "deployed-recorded" ||
    graphModule.state.release.recordId !== release.recordId
  ) {
    errors.push(`${label} must match a deployed-recorded canonical graph release recordId.`);
  }
  if (!validCommit(release.sourceCommit)) {
    errors.push(`${label}.sourceCommit must be a full commit SHA.`);
  } else {
    const exists = await execFileAsync("git", ["cat-file", "-e", `${release.sourceCommit}^{commit}`], {
      cwd: siteRoot,
    })
      .then(() => true)
      .catch(() => false);
    if (!exists) {
      errors.push(`${label}.sourceCommit must resolve to a local Git commit.`);
    } else if (!(await isAncestor(siteRoot, release.sourceCommit))) {
      errors.push(`${label}.sourceCommit must be an ancestor of HEAD.`);
    } else {
      const { stdout: head } = await execFileAsync("git", ["rev-parse", "HEAD"], { cwd: siteRoot });
      if (release.sourceCommit === head.trim()) {
        errors.push(`${label}.sourceCommit must be a strict ancestor of the release-record commit.`);
      }
      if (
        validCommit(moduleEntry.reviewReadyCommit) &&
        !(await isAncestor(siteRoot, moduleEntry.reviewReadyCommit, release.sourceCommit))
      ) {
        errors.push(`${label}.sourceCommit must follow reviewReadyCommit.`);
      }
    }
  }

  const candidateInputPaths = [...new Set(promotionEvidence?.candidateInputPaths ?? [])].sort();
  if (!sameOrderedValues(release.candidateInputPaths, candidateInputPaths)) {
    errors.push(`${label}.candidateInputPaths must exactly name the sorted reviewed evidence inputs.`);
  }
  if (validCommit(release.sourceCommit)) {
    for (const path of candidateInputPaths) {
      const existsAtCandidate = await execFileAsync(
        "git",
        ["cat-file", "-e", `${release.sourceCommit}:${path}`],
        { cwd: siteRoot },
      )
        .then(() => true)
        .catch(() => false);
      if (!existsAtCandidate) {
        errors.push(`${label}.sourceCommit does not contain candidate input ${path}.`);
        continue;
      }
      const unchanged = await execFileAsync(
        "git",
        ["diff", "--quiet", release.sourceCommit, "--", path],
        { cwd: siteRoot },
      )
        .then(() => true)
        .catch(() => false);
      if (!unchanged) {
        errors.push(`${label} candidate input ${path} must match its sourceCommit blob.`);
      }
    }
  }

  const releasePaths = [];
  for (const field of [
    "provenancePath",
    "sourceReviewPath",
    "knownLimitationsPath",
    "ciEvidencePath",
  ]) {
    const expectedPath = moduleReleaseDocumentationPath(moduleEntry.moduleId, field);
    if (release[field] !== expectedPath) {
      errors.push(`${label}.${field} must use its exact module-scoped evidence slot.`);
      continue;
    }
    if (!(await isTrackedRegularFile(siteRoot, release[field]))) {
      errors.push(`${label}.${field} must be a tracked regular local file.`);
      continue;
    }
    releasePaths.push(release[field]);
  }
  if (!hasText(release.privateDeploymentVersion)) {
    errors.push(`${label}.privateDeploymentVersion must be non-empty.`);
  }

  const policyText = validCommit(release.sourceCommit)
    ? await readTextAtCommit(
      siteRoot,
      release.sourceCommit,
      releaseEvidencePolicyRelativePath,
      `${label} Course CI policy`,
      errors,
    )
    : null;
  let policy = null;
  let policyReport = null;
  if (policyText !== null) {
    try {
      policy = JSON.parse(policyText);
      const workflowPath = policy?.courseCi?.workflowPath;
      const workflowText = await readTextAtCommit(
        siteRoot,
        release.sourceCommit,
        workflowPath,
        `${label} Course CI workflow`,
        errors,
      );
      if (workflowText !== null) {
        policyReport = validateReleaseEvidencePolicy(policy, { workflowContent: workflowText });
      }
    } catch (error) {
      errors.push(`${label} must use a valid sourceCommit Course CI policy: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  if (policyReport) {
    const expectedRunUrl = `https://github.com/${policyReport.repository}/actions/runs/`;
    if (!hasText(release.ciRunUrl) || !release.ciRunUrl.startsWith(expectedRunUrl)) {
      errors.push(`${label}.ciRunUrl must target the sourceCommit policy repository's GitHub Actions run.`);
    }
  }

  if (release.ciEvidencePath === moduleReleaseDocumentationPath(moduleEntry.moduleId, "ciEvidencePath")) {
    try {
      const ciEvidence = JSON.parse(await readFile(resolve(siteRoot, release.ciEvidencePath), "utf8"));
      if (policy) {
        const ciReport = verifyCourseCiEvidence({
          policy,
          evidence: ciEvidence,
          expectedSourceHeadSha: release.sourceCommit,
        });
        if (ciReport.runUrl !== release.ciRunUrl) {
          errors.push(`${label}.ciRunUrl must equal the validated local Course CI evidence run URL.`);
        }
      }
    } catch (error) {
      errors.push(`${label}.ciEvidencePath must contain valid sourceCommit Course CI evidence: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  for (const field of ["provenancePath", "sourceReviewPath", "knownLimitationsPath"]) {
    if (!releasePaths.includes(release[field])) continue;
    const text = await readFile(resolve(siteRoot, release[field]), "utf8").catch((error) => {
      errors.push(`${label}.${field} cannot be read: ${error.message}`);
      return "";
    });
    for (const requiredText of [
      moduleEntry.moduleId,
      release.recordId,
      release.sourceCommit,
      release.ciRunUrl,
      release.privateDeploymentVersion,
    ]) {
      if (hasText(requiredText) && !text.includes(requiredText)) {
        errors.push(`${label}.${field} must visibly bind ${requiredText}.`);
      }
    }
  }
  return releasePaths;
}

function migrationPointer(registryObject, migration, expectedKind, expectedPath, expectedLocator, label, errors) {
  if (!exactKeys(migration, expectedMigrationKeys, `${label} migration`, errors)) return;
  if (
    migration.kind !== expectedKind ||
    migration.path !== expectedPath ||
    migration.locator !== expectedLocator
  ) {
    errors.push(`${label} migration must bind ${expectedKind} at ${expectedPath}${expectedLocator}.`);
  }
  if (resolveJsonPointer(registryObject, migration.locator) === undefined) {
    errors.push(`${label} migration locator does not resolve in ${migration.path}.`);
  }
}

function validateLegacyBaseline(moduleEntry, graphModule, audit, manifestById, errors) {
  const auditIndex = audit.modules.findIndex(({ moduleId }) => moduleId === moduleEntry.moduleId);
  const auditModule = audit.modules[auditIndex];
  if (!auditModule) {
    errors.push(`Legacy-baseline Module ${moduleEntry.moduleId} is absent from the immutable audit.`);
    return;
  }
  if (graphModule.number > 30 || graphModule.state.lifecycle !== "learner-material-ready") {
    errors.push(`Module ${moduleEntry.moduleId} may not use the legacy-baseline contract state.`);
  }
  migrationPointer(
    audit,
    moduleEntry.migration,
    "legacy-audit",
    legacyModuleContractAuditRelativePath,
    `/modules/${auditIndex}`,
    `Legacy-baseline Module ${moduleEntry.moduleId}`,
    errors,
  );
  if (!manifestById.has(moduleEntry.moduleId)) {
    errors.push(`Legacy-baseline Module ${moduleEntry.moduleId} must remain bound to a reader manifest entry.`);
  }
  requirePendingReview(moduleEntry, errors);
  requireNoPromotionRecords(moduleEntry, errors);
  if (moduleEntry.reviewReadyCommit !== null) {
    errors.push(`Legacy-baseline Module ${moduleEntry.moduleId} may not declare reviewReadyCommit.`);
  }
  if (moduleEntry.release !== null) {
    errors.push(`Legacy-baseline Module ${moduleEntry.moduleId} may not declare release evidence.`);
  }
  for (const criterion of moduleEntry.criteria) {
    if (legacyCriterionIds.has(criterion.id)) {
      const auditEvidence = auditModule.evidence[criterion.id];
      const expectedLocator = `/modules/${auditIndex}/evidence/${criterion.id}`;
      if (criterion.status !== auditEvidence?.status) {
        errors.push(
          `Legacy-baseline Module ${moduleEntry.moduleId} criterion ${criterion.id} must preserve the immutable legacy audit status ${auditEvidence?.status ?? "missing"}.`,
        );
      }
      if (
        criterion.source.kind !== "legacy-audit-criterion" ||
        criterion.source.path !== legacyModuleContractAuditRelativePath ||
        criterion.source.locator !== expectedLocator ||
        resolveJsonPointer(audit, criterion.source.locator) !== auditEvidence
      ) {
        errors.push(`Legacy-baseline Module ${moduleEntry.moduleId} criterion ${criterion.id} must bind its immutable audit evidence.`);
      }
    } else if (
      criterion.status !== "missing" ||
      criterion.source.kind !== "none" ||
      criterion.source.path !== null ||
      criterion.source.locator !== null
    ) {
      errors.push(
        `Legacy-baseline Module ${moduleEntry.moduleId} criterion ${criterion.id} must remain an explicit missing v3 gap until reviewed evidence exists.`,
      );
    }
  }
}

function validateM31AuthoringAdapter(moduleEntry, graphModule, advancedRegistry, manifestById, errors) {
  const advancedIndex = advancedRegistry.modules.findIndex(({ moduleId }) => moduleId === "m31");
  const advancedModule = advancedRegistry.modules[advancedIndex];
  if (!advancedModule) {
    errors.push("M31 authoring-only v3 entry requires the retained advanced authoring adapter record.");
    return;
  }
  if (
    graphModule.id !== "m31" ||
    graphModule.state.lifecycle !== "authoring-only" ||
    graphModule.state.readerAccess !== "hidden" ||
    manifestById.has("m31")
  ) {
    errors.push("M31 authoring-only v3 entry must remain hidden learner material.");
  }
  migrationPointer(
    advancedRegistry,
    moduleEntry.migration,
    "advanced-authoring-adapter",
    advancedModuleContractRelativePath,
    `/modules/${advancedIndex}`,
    "M31 authoring-only adapter",
    errors,
  );
  requirePendingReview(moduleEntry, errors);
  requireNoPromotionRecords(moduleEntry, errors);
  if (moduleEntry.reviewReadyCommit !== null || moduleEntry.release !== null) {
    errors.push("M31 authoring-only v3 entry may not declare promotion or release evidence.");
  }
  const advancedEvidenceById = new Map(
    advancedModule.evidence.map((evidence, index) => [evidence.id, { evidence, index }]),
  );
  for (const criterion of moduleEntry.criteria) {
    const sourceEvidence = advancedEvidenceById.get(m31EvidenceByCriterion[criterion.id]);
    if (!sourceEvidence) {
      errors.push(`M31 criterion ${criterion.id} has no mapped advanced contract evidence.`);
      continue;
    }
    const expectedLocator = `/modules/${advancedIndex}/evidence/${sourceEvidence.index}`;
    if (criterion.status !== sourceEvidence.evidence.state) {
      errors.push(`M31 criterion ${criterion.id} must preserve its advanced contract evidence state.`);
    }
    if (
      criterion.source.kind !== "advanced-authoring-adapter-evidence" ||
      criterion.source.path !== advancedModuleContractRelativePath ||
      criterion.source.locator !== expectedLocator ||
      resolveJsonPointer(advancedRegistry, criterion.source.locator) !== sourceEvidence.evidence
    ) {
      errors.push(`M31 criterion ${criterion.id} must bind its advanced authoring-adapter evidence.`);
    }
  }
}

function requireV3PromotionAuthority(moduleEntry, errors) {
  const adapterCriteria = moduleEntry.criteria.filter(
    ({ source }) => source?.kind === "advanced-authoring-adapter-evidence",
  );
  if (adapterCriteria.length > 0) {
    errors.push(
      `Module ${moduleEntry.moduleId} ${moduleEntry.contractState} state may not use advanced authoring-adapter evidence as promotion authority; every criterion must bind its module-evidence record.`,
    );
  }
}

function validateAdvancedPlan(moduleEntry, graphModule, bridge, manifestById, errors) {
  const bridgeIndex = bridge.modules.findIndex(({ moduleId }) => moduleId === moduleEntry.moduleId);
  const bridgeModule = bridge.modules[bridgeIndex];
  if (!bridgeModule) {
    errors.push(`${moduleEntry.moduleId} not-started entry requires an advanced bridge plan.`);
    return;
  }
  if (
    graphModule.number <= 31 ||
    graphModule.state.lifecycle !== "authoring-only" ||
    graphModule.state.readerAccess !== "hidden" ||
    manifestById.has(moduleEntry.moduleId)
  ) {
    errors.push(`${moduleEntry.moduleId} not-started v3 entry must remain hidden authoring material.`);
  }
  migrationPointer(
    bridge,
    moduleEntry.migration,
    "advanced-bridge-plan",
    advancedModuleBridgeRelativePath,
    `/modules/${bridgeIndex}`,
    `${moduleEntry.moduleId} not-started`,
    errors,
  );
  requirePendingReview(moduleEntry, errors);
  requireNoPromotionRecords(moduleEntry, errors);
  if (moduleEntry.reviewReadyCommit !== null || moduleEntry.release !== null) {
    errors.push(`${moduleEntry.moduleId} not-started entry may not declare promotion or release evidence.`);
  }
  for (const criterion of moduleEntry.criteria) {
    if (
      criterion.status !== "planned" ||
      criterion.source.kind !== "advanced-bridge-plan" ||
      criterion.source.path !== advancedModuleBridgeRelativePath ||
      criterion.source.locator !== `/modules/${bridgeIndex}` ||
      resolveJsonPointer(bridge, criterion.source.locator) !== bridgeModule
    ) {
      errors.push(`${moduleEntry.moduleId} not-started criterion ${criterion.id} must remain a bridge-plan-only planned item.`);
    }
  }
}

export function promotionEvidenceRoleErrors(moduleEntry, graphModule, evidenceReport) {
  const label = `Module ${moduleEntry.moduleId} reviewed evidence`;
  const errors = [];
  const entryFor = (criterionId) => evidenceReport.evidenceByCriterion.get(criterionId);
  const rolesFor = (criterionId) => new Set(
    (entryFor(criterionId)?.resolvedInputs ?? []).map(({ role }) => role),
  );
  const requireRoles = (criterionId, roles) => {
    const available = rolesFor(criterionId);
    for (const role of roles) {
      if (!available.has(role)) {
        errors.push(`${label} criterion ${criterionId} must include a ${role} input.`);
      }
    }
  };

  const sessionInputs = (entryFor("six-connected-sessions")?.resolvedInputs ?? []).filter(
    ({ kind, role }) => kind === "markdown-heading" && role === "course-content",
  );
  if (sessionInputs.length < 6) {
    errors.push(`${label} criterion six-connected-sessions must bind six course-content session headings.`);
  }
  for (const [criterionId, roles] of Object.entries(promotionEvidenceRoleRequirements)) {
    requireRoles(criterionId, roles);
  }
  if (graphModule.studioId) {
    requireRoles("interaction-reference-model-and-teaching-tests", [
      "source-code",
      "reference-model",
      "test",
    ]);
  } else {
    requireRoles("interaction-reference-model-and-teaching-tests", ["course-content"]);
  }
  return errors;
}

function requirePromotionEvidenceRoles(moduleEntry, graphModule, evidenceReport, errors) {
  errors.push(...promotionEvidenceRoleErrors(moduleEntry, graphModule, evidenceReport));
}

const promotionLearningCompanionPointers = Object.freeze({
  "ta-prompt": "/teachingAssistant",
  "study-partner-prompt": "/studyPartner",
  "forward-handoff": "/forwardHandoff",
});

/**
 * A future review-ready/verified module must use its own immutable companion
 * record for its TA, Study Partner, and canonical-forward evidence. The
 * shared reader registry is intentionally insufficient: editing M32's guide
 * must never rewrite evidence frozen for M31.
 */
export async function promotionLearningCompanionErrors({
  siteRoot,
  moduleEntry,
  graph,
  evidenceReport,
}) {
  const label = `Module ${moduleEntry.moduleId} reviewed learning companion`;
  const errors = [];
  const expectedPath = moduleLearningCompanionRelativePath(moduleEntry.moduleId);
  const entryFor = (criterionId) => evidenceReport.evidenceByCriterion.get(criterionId);

  for (const [criterionId, locator] of Object.entries(promotionLearningCompanionPointers)) {
    const companionInputs = (entryFor(criterionId)?.resolvedInputs ?? []).filter(
      ({ role }) => role === "learning-companion",
    );
    const exactInputs = companionInputs.filter(
      (input) =>
        input.kind === "json-pointer" &&
        input.path === expectedPath &&
        input.locator === locator,
    );
    if (companionInputs.length !== 1 || exactInputs.length !== 1) {
      errors.push(
        `${label} criterion ${criterionId} must bind exactly one learning-companion JSON Pointer ${expectedPath}${locator}.`,
      );
    }
  }

  try {
    const record = JSON.parse(await readFile(resolve(siteRoot, expectedPath), "utf8"));
    await validateModuleLearningCompanion(record, {
      graph,
      expectedModuleId: moduleEntry.moduleId,
      repositoryPath: expectedPath,
      siteRoot,
    });
  } catch (error) {
    errors.push(
      `${label} must validate its module-scoped companion record: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
  return errors;
}

function moduleScopedVisualContentPath(graphModule, repositoryPath) {
  if (
    typeof repositoryPath !== "string" ||
    !repositoryPath.startsWith("content/") ||
    !repositoryPath.endsWith(".md")
  ) {
    return false;
  }
  const number = String(graphModule.number);
  const moduleToken = new RegExp(
    `(?:^|[/_-])(?:m0?${number}|module0?${number}|0?${number})(?=[/_.-]|$)`,
    "iu",
  );
  return moduleToken.test(repositoryPath);
}

/**
 * A review-ready or verified record must bind and scan the promoted module's
 * own Markdown visual content. Role labels alone are not enough: a different
 * module's clean fixture cannot stand in for the actual workbook.
 */
export async function promotionVisualAlternativeErrors({
  siteRoot,
  moduleEntry,
  graphModule,
  manifestById,
  evidenceReport,
}) {
  const label = `Module ${moduleEntry.moduleId} reviewed visual evidence`;
  const errors = [];
  const visualEvidence = evidenceReport.evidenceByCriterion.get(
    "accessible-visual-text-alternative",
  );
  const contentPaths = [...new Set(
    (visualEvidence?.resolvedInputs ?? [])
      .filter(
        ({ role, path }) => role === "course-content" && typeof path === "string" && path.endsWith(".md"),
      )
      .map(({ path }) => path),
  )];
  const manifestModule = manifestById.get(moduleEntry.moduleId);
  const canonicalWorkbookPath = manifestModule?.filename
    ? `content/modules/${manifestModule.filename}`
    : null;

  if (contentPaths.length === 0) {
    errors.push(`${label} must bind module-scoped course-content Markdown for its Mermaid alternatives.`);
    return { contentPaths, errors };
  }
  if (canonicalWorkbookPath && !contentPaths.includes(canonicalWorkbookPath)) {
    errors.push(`${label} must bind canonical workbook ${canonicalWorkbookPath}.`);
  }
  for (const contentPath of contentPaths) {
    if (!moduleScopedVisualContentPath(graphModule, contentPath)) {
      errors.push(`${label} may not use unrelated course content: ${contentPath}.`);
    }
  }
  if (errors.length > 0) return { contentPaths, errors };

  const blocks = [];
  for (const contentPath of contentPaths) {
    try {
      const markdown = await readFile(resolve(siteRoot, contentPath), "utf8");
      blocks.push(...scanMermaidBlocks(markdown, { sourcePath: contentPath }));
    } catch (error) {
      errors.push(
        `${label} could not scan ${contentPath}: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
  if (errors.length === 0) {
    try {
      validateMermaidAccessibility(blocks, { requireComplete: true });
    } catch (error) {
      errors.push(
        `${label} must have complete Mermaid text alternatives: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
  return { contentPaths, errors };
}

async function resolvePromotionEvidence(siteRoot, moduleEntry, graphModule, manifestById, graph, errors) {
  const label = `Module ${moduleEntry.moduleId}`;
  const evidencePath = recordReference(
    moduleEntry.evidenceRecord,
    "module-evidence-record",
    `${label} evidenceRecord`,
    errors,
  );
  const reviewPath = recordReference(
    moduleEntry.reviewRecord,
    "module-review-record",
    `${label} reviewRecord`,
    errors,
  );
  if (!evidencePath || !reviewPath) {
    errors.push(`${label} ${moduleEntry.contractState} state requires resolved module-specific evidence and review records.`);
    return null;
  }
  const expectedEvidencePath = `content/course/contracts/evidence/${moduleEntry.moduleId}.v1.json`;
  const expectedReviewPath = `content/course/contracts/reviews/${moduleEntry.moduleId}.v1.json`;
  if (evidencePath !== expectedEvidencePath) {
    errors.push(`${label} evidenceRecord.path must be ${expectedEvidencePath}.`);
  }
  if (reviewPath !== expectedReviewPath) {
    errors.push(`${label} reviewRecord.path must be ${expectedReviewPath}.`);
  }

  let evidenceRecord = null;
  let evidenceReport = null;
  let evidenceDigest = null;
  try {
    evidenceRecord = await loadModuleEvidenceRecord(evidencePath, { siteRoot });
    evidenceReport = await validateModuleEvidenceRecord(evidenceRecord, {
      siteRoot,
      expectedModuleId: moduleEntry.moduleId,
      requiredCriterionIds: criterionIds,
    });
    evidenceDigest = `sha256:${sha256(await readFile(resolve(siteRoot, evidencePath), "utf8"))}`;
  } catch (error) {
    errors.push(`${label} requires resolved module-specific evidence: ${error instanceof Error ? error.message : String(error)}`);
  }

  let reviewRecord = null;
  let reviewReport = null;
  if (evidenceDigest) {
    try {
      reviewRecord = await loadModuleReviewRecord(reviewPath, { siteRoot });
      reviewReport = await validateModuleReviewRecord(reviewRecord, {
        siteRoot,
        expectedModuleId: moduleEntry.moduleId,
        expectedEvidenceRecordPath: evidencePath,
        expectedEvidenceRecordDigest: evidenceDigest,
        requiredCriterionIds: criterionIds,
      });
    } catch (error) {
      errors.push(`${label} requires a review record bound to its resolved evidence: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  if (!evidenceRecord || !evidenceReport || !reviewRecord || !reviewReport) {
    return null;
  }

  if (reviewRecord.review?.overallOutcome !== "approved") {
    errors.push(`${label} reviewRecord must record an approved overall outcome.`);
  }
  for (const dimension of humanReviewDimensions) {
    if (moduleEntry.humanReview?.[dimension] !== "approved") {
      errors.push(`${label} ${moduleEntry.contractState} state requires approved ${dimension}.`);
    }
  }
  for (const criterion of moduleEntry.criteria) {
    const entryIndex = evidenceRecord.evidence.findIndex(
      ({ criterionId }) => criterionId === criterion.id,
    );
    const criterionReview = reviewReport.reviewByCriterion.get(criterion.id);
    if (!criterionReview || criterionReview.outcome !== "approved") {
      errors.push(`${label} reviewRecord must approve criterion ${criterion.id}.`);
    }
    if (
      entryIndex < 0 ||
      criterion.source.kind !== "module-evidence-criterion" ||
      criterion.source.path !== evidencePath ||
      criterion.source.locator !== `/evidence/${entryIndex}`
    ) {
      errors.push(`${label} criterion ${criterion.id} must bind its exact resolved module-evidence record entry.`);
    }
  }
  requirePromotionEvidenceRoles(moduleEntry, graphModule, evidenceReport, errors);
  const learningCompanionErrors = await promotionLearningCompanionErrors({
    siteRoot,
    moduleEntry,
    graph,
    evidenceReport,
  });
  errors.push(...learningCompanionErrors);
  const visualEvidence = await promotionVisualAlternativeErrors({
    siteRoot,
    moduleEntry,
    graphModule,
    manifestById,
    evidenceReport,
  });
  errors.push(...visualEvidence.errors);
  return {
    evidencePath,
    reviewPath,
    evidenceReport,
    reviewReport,
    candidateInputPaths: [
      evidencePath,
      reviewPath,
      ...evidenceReport.releaseInputPaths,
    ].filter((path, index, paths) => paths.indexOf(path) === index).sort(),
  };
}

async function validatePromotableState(siteRoot, moduleEntry, graphModule, manifestById, graph, errors) {
  requireV3PromotionAuthority(moduleEntry, errors);
  const promotionEvidence = await resolvePromotionEvidence(
    siteRoot,
    moduleEntry,
    graphModule,
    manifestById,
    graph,
    errors,
  );
  if (moduleEntry.contractState === "review-ready") {
    if (
      graphModule.state.lifecycle !== "authoring-only" ||
      graphModule.state.readerAccess !== "hidden" ||
      manifestById.has(moduleEntry.moduleId)
    ) {
      errors.push(`Review-ready Module ${moduleEntry.moduleId} must remain hidden until verified release.`);
    }
    if (moduleEntry.reviewReadyCommit !== null) {
      errors.push(`Review-ready Module ${moduleEntry.moduleId} must leave reviewReadyCommit null until a later verified release records this commit.`);
    }
    if (moduleEntry.release !== null) {
      errors.push(`Review-ready Module ${moduleEntry.moduleId} may not declare release evidence.`);
    }
    for (const criterion of moduleEntry.criteria) {
      if (criterion.status !== "reviewed") {
        errors.push(`Review-ready Module ${moduleEntry.moduleId} criterion ${criterion.id} must be reviewed.`);
      }
    }
    return promotionEvidence;
  }

  if (moduleEntry.contractState === "verified") {
    if (
      graphModule.state.lifecycle !== "learner-material-ready" ||
      graphModule.state.readerAccess !== "full" ||
      graphModule.state.availability !== "published" ||
      graphModule.state.release.state !== "deployed-recorded" ||
      !manifestById.has(moduleEntry.moduleId)
    ) {
      errors.push(`Verified Module ${moduleEntry.moduleId} requires full reader access, Core availability, a manifest entry, and deployed release evidence.`);
    }
    for (const criterion of moduleEntry.criteria) {
      if (criterion.status !== "release-ready") {
        errors.push(`Verified Module ${moduleEntry.moduleId} criterion ${criterion.id} must be release-ready.`);
      }
    }
    await validatePromotionHistory(siteRoot, moduleEntry, promotionEvidence, errors);
    const releasePaths = await validateRelease(
      siteRoot,
      moduleEntry,
      graphModule,
      promotionEvidence,
      errors,
    );
    if (["m25", "m26"].includes(moduleEntry.moduleId)) {
      for (const prerequisiteNumber of graphModule.academicPrerequisiteNumbers) {
        const prerequisiteModule = graphModule.__moduleByNumber?.get(prerequisiteNumber);
        if (prerequisiteModule?.state.contract.state !== "verified") {
          errors.push(`Verified ${moduleEntry.moduleId} requires verified academic prerequisite m${String(prerequisiteNumber).padStart(2, "0")}.`);
        }
      }
    }
    return {
      ...promotionEvidence,
      releasePaths,
      candidateInputPaths: [
        ...(promotionEvidence?.candidateInputPaths ?? []),
        ...releasePaths,
      ].filter((path, index, paths) => paths.indexOf(path) === index).sort(),
    };
  }
  return null;
}

export function moduleContractRegistryPath(siteRoot = defaultSiteRoot) {
  return resolve(siteRoot, moduleContractRegistryRelativePath);
}

export async function loadModuleContractRegistry(siteRoot = defaultSiteRoot) {
  return JSON.parse(await readFile(moduleContractRegistryPath(siteRoot), "utf8"));
}

export async function validateModuleContractRegistry(
  graph,
  registry,
  { siteRoot = defaultSiteRoot, manifest: suppliedManifest = null, mode = "integrity" } = {},
) {
  const errors = [];
  if (!isPlainObject(graph) || !Array.isArray(graph.modules)) {
    throw new Error("Module-contract registry v3 needs a validated canonical graph with modules.");
  }
  if (!["integrity", "strict", "complete"].includes(mode)) {
    throw new Error(`Unknown module-contract registry v3 validation mode: ${mode}.`);
  }
  if (!exactKeys(registry, expectedTopLevelKeys, "Module-contract registry", errors)) {
    registryFailure(errors);
  }
  if (registry.schemaVersion !== 3 || registry.contractVersion !== "v3" || registry.kind !== "atlas-module-contract-registry") {
    errors.push("Module-contract registry must declare schemaVersion 3, contractVersion v3, and the expected kind.");
  }
  if (!hasText(registry.purpose)) errors.push("Module-contract registry purpose must be non-empty.");
  if (registry.canonicalCourseGraph !== "content/course/course-graph.v2.json") {
    errors.push("Module-contract registry must bind the active v2 course graph.");
  }
  if (registry.canonicalModuleManifest !== "content/modules/manifest.json") {
    errors.push("Module-contract registry must bind the generated module manifest.");
  }
  exactKeys(registry.truthBoundary, expectedTruthBoundaryKeys, "Module-contract registry truthBoundary", errors);
  for (const value of Object.values(registry.truthBoundary ?? {})) {
    if (!hasText(value)) errors.push("Module-contract registry truthBoundary fields must be non-empty text.");
  }
  if (!sameOrderedValues(registry.contractStates, contractStates)) {
    errors.push("Module-contract registry must declare the exact ordered v3 contract states.");
  }
  if (!sameOrderedValues(registry.evidenceStates, evidenceStates)) {
    errors.push("Module-contract registry must declare the exact ordered v3 evidence states.");
  }
  if (!sameOrderedValues(registry.criterionIds, criterionIds)) {
    errors.push("Module-contract registry must declare the exact ordered 18-criterion contract taxonomy.");
  }
  if (!sameOrderedValues(registry.humanReviewDimensions, humanReviewDimensions)) {
    errors.push("Module-contract registry must declare the exact human-review dimensions.");
  }

  const manifest = suppliedManifest ?? await readTrackedJson(siteRoot, registry.canonicalModuleManifest, "Canonical module manifest", errors);
  const manifestById = new Map((manifest?.modules ?? []).map((module) => [module.id, module]));
  const graphById = new Map(graph.modules.map((module) => [module.id, module]));
  const graphByNumber = new Map(graph.modules.map((module) => [module.number, module]));

  let legacyAudit = null;
  let advancedRegistry = null;
  let bridgeLedger = null;
  try {
    legacyAudit = await loadLegacyModuleContractAudit(siteRoot);
    await validateLegacyModuleContractAudit(legacyAudit, { siteRoot });
  } catch (error) {
    errors.push(`Immutable legacy audit must validate before v3 registry use: ${error instanceof Error ? error.message : String(error)}`);
  }
  try {
    advancedRegistry = await loadAdvancedModuleContractRegistry(siteRoot);
    await validateAdvancedModuleContractRegistry(graph, advancedRegistry, { siteRoot });
  } catch (error) {
    errors.push(`Advanced authoring contract must validate before v3 registry use: ${error instanceof Error ? error.message : String(error)}`);
  }
  try {
    bridgeLedger = await loadAdvancedModuleBridgeLedger(siteRoot);
    validateAdvancedModuleBridgeLedger(graph, bridgeLedger);
  } catch (error) {
    errors.push(`Advanced prerequisite/session bridge must validate before v3 registry use: ${error instanceof Error ? error.message : String(error)}`);
  }

  if (!Array.isArray(registry.modules) || registry.modules.length !== graph.modules.length) {
    errors.push("Module-contract registry must contain exactly one entry for every canonical module.");
    registryFailure(errors);
  }
  const orderedGraph = graph.modules.slice().sort((left, right) => left.number - right.number);
  const seenIds = new Set();
  const referencedPaths = new Set([moduleContractRegistryRelativePath]);
  const contextualGraph = {
    ...graph,
    modules: graph.modules.map((module) => ({ ...module, __moduleByNumber: graphByNumber })),
  };
  const contextualGraphById = new Map(contextualGraph.modules.map((module) => [module.id, module]));

  for (const [index, moduleEntry] of registry.modules.entries()) {
    if (!exactKeys(moduleEntry, expectedModuleKeys, `Registry module at index ${index}`, errors)) continue;
    if (normalizedRepositoryPath(moduleEntry.migration?.path)) {
      referencedPaths.add(moduleEntry.migration.path);
    }
    const expectedGraphModule = orderedGraph[index];
    if (moduleEntry.moduleId !== expectedGraphModule?.id || seenIds.has(moduleEntry.moduleId)) {
      errors.push("Module-contract registry entries must be unique and ordered by canonical module number.");
      continue;
    }
    seenIds.add(moduleEntry.moduleId);
    const graphModule = contextualGraphById.get(moduleEntry.moduleId);
    if (!graphModule) {
      errors.push(`Registry module ${moduleEntry.moduleId} does not exist in the canonical graph.`);
      continue;
    }
    if (moduleEntry.contractState !== graphModule.state.contract.state) {
      errors.push(`Registry module ${moduleEntry.moduleId} contractState must match the canonical graph.`);
    }
    if (!contractStates.includes(moduleEntry.contractState)) {
      errors.push(`Registry module ${moduleEntry.moduleId} has an unsupported contractState.`);
    }
    if (!Array.isArray(moduleEntry.criteria) || moduleEntry.criteria.length !== criterionIds.length) {
      errors.push(`Registry module ${moduleEntry.moduleId} must declare every contract criterion exactly once.`);
      continue;
    }
    for (const [criterionIndex, criterion] of moduleEntry.criteria.entries()) {
      if (!exactKeys(criterion, expectedCriterionKeys, `Module ${moduleEntry.moduleId} criterion ${criterionIndex}`, errors)) continue;
      if (criterion.id !== criterionIds[criterionIndex]) {
        errors.push(`Module ${moduleEntry.moduleId} criterion order must match the canonical taxonomy.`);
      }
      if (!evidenceStates.includes(criterion.status)) {
        errors.push(`Module ${moduleEntry.moduleId} criterion ${criterion.id} has an unsupported evidence state.`);
      }
      validateSource(criterion.source, `Module ${moduleEntry.moduleId} criterion ${criterion.id}`, errors);
      if (criterion.source?.kind !== "none" && normalizedRepositoryPath(criterion.source?.path)) {
        referencedPaths.add(criterion.source.path);
      }
    }
    validateHumanReview(moduleEntry, errors);

    if (moduleEntry.contractState === "legacy-baseline" && legacyAudit) {
      validateLegacyBaseline(moduleEntry, graphModule, legacyAudit, manifestById, errors);
    } else if (moduleEntry.contractState === "authoring-only" && advancedRegistry) {
      validateM31AuthoringAdapter(moduleEntry, graphModule, advancedRegistry, manifestById, errors);
    } else if (moduleEntry.contractState === "not-started" && bridgeLedger) {
      validateAdvancedPlan(moduleEntry, graphModule, bridgeLedger, manifestById, errors);
    } else if (["review-ready", "verified"].includes(moduleEntry.contractState)) {
      const promotionReport = await validatePromotableState(
        siteRoot,
        moduleEntry,
        graphModule,
        manifestById,
        contextualGraph,
        errors,
      );
      for (const path of promotionReport?.candidateInputPaths ?? []) {
        referencedPaths.add(path);
      }
    }
  }

  if (seenIds.size !== graph.modules.length) {
    errors.push("Module-contract registry must contain exactly one entry for every canonical module.");
  }
  for (const path of referencedPaths) {
    if (!(await isTrackedRegularFile(siteRoot, path))) {
      errors.push(`Module-contract registry evidence path must be a tracked regular local file: ${path}.`);
    }
  }
  const summary = {
    legacyBaselineModules: registry.modules.filter(({ contractState }) => contractState === "legacy-baseline").length,
    authoringOnlyModules: registry.modules.filter(({ contractState }) => ["authoring-only", "not-started"].includes(contractState)).length,
    reviewReadyModules: registry.modules.filter(({ contractState }) => contractState === "review-ready").length,
    verifiedModules: registry.modules.filter(({ contractState }) => contractState === "verified").length,
  };
  if (mode === "strict") {
    const nonPreviewLearnerModules = graph.modules.filter(
      ({ state }) => state.readerAccess !== "hidden" && state.availability !== "preview",
    );
    const nonVerified = nonPreviewLearnerModules.filter(
      (module) => registry.modules.find(({ moduleId }) => moduleId === module.id)?.contractState !== "verified",
    );
    if (nonVerified.length > 0) {
      errors.push(`${nonVerified.length} non-preview learner module(s) cannot pass strict contract validation.`);
    }
  }
  if (mode === "complete") {
    if (summary.verifiedModules !== graph.modules.length) {
      errors.push("Complete contract validation requires every one of the 36 modules to be verified.");
    }
    for (const id of ["m25", "m26"]) {
      const graphModule = graphById.get(id);
      if (graphModule?.state.availability !== "published") {
        errors.push(`Complete contract validation requires ${id} to be Core-open rather than preview-only.`);
      }
    }
  }

  registryFailure(errors);
  return {
    summary,
    manifest,
    releaseInputPaths: [...referencedPaths].map((path) => resolve(siteRoot, path)),
  };
}
