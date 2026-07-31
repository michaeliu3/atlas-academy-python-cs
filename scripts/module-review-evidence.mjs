import { createHash } from "node:crypto";
import { execFile } from "node:child_process";
import { lstat, readFile } from "node:fs/promises";
import { dirname, isAbsolute, relative, resolve } from "node:path";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import { extractTableOfContents } from "../lib/heading-ids.js";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const defaultSiteRoot = resolve(scriptDirectory, "..");
const execFileAsync = promisify(execFile);

export const moduleEvidenceRecordKind = "atlas-module-evidence-record";
export const moduleReviewRecordKind = "atlas-module-review-record";
export const moduleReviewEvidenceRecordVersion = "v1";

const evidenceTopLevelKeys = [
  "schemaVersion",
  "kind",
  "recordVersion",
  "moduleId",
  "purpose",
  "truthBoundary",
  "evidence",
];
const evidenceTruthBoundaryKeys = ["structuralResolution", "humanReview", "release"];
const evidenceEntryKeys = ["id", "criterionId", "claim", "inputs", "limitations"];
const inputKeys = ["kind", "role", "path", "locator"];
const reviewTopLevelKeys = [
  "schemaVersion",
  "kind",
  "recordVersion",
  "moduleId",
  "evidenceRecordPath",
  "evidenceRecordDigest",
  "purpose",
  "truthBoundary",
  "review",
  "criteria",
];
const reviewTruthBoundaryKeys = ["evidenceBinding", "qualityDecision", "learnerMastery", "release"];
const reviewKeys = ["reviewerRole", "reviewedAt", "overallOutcome", "summary", "knownLimitations"];
const reviewCriterionKeys = ["criterionId", "outcome", "rationale"];
const inputKinds = new Set(["markdown-heading", "json-pointer", "file"]);
const inputRoles = new Set([
  "course-content",
  "source-ledger",
  "source-code",
  "reference-model",
  "test",
  "provenance",
  "learning-companion",
]);
const learningCompanionPathPattern =
  /^content\/course\/contracts\/companions\/m(?:0[1-9]|[1-9]\d)\.v1\.json$/u;
const reviewOutcomes = new Set(["approved", "changes-requested"]);

function hasText(value) {
  return typeof value === "string" && value.trim() !== "";
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function failure(label, errors) {
  if (errors.length > 0) {
    throw new Error(`${label} validation failed:\n- ${errors.join("\n- ")}`);
  }
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

function moduleIdentifier(value, label, errors) {
  if (!hasText(value) || !/^m(?:0[1-9]|[1-9]\d)$/u.test(value)) {
    errors.push(`${label} must be a lower-case module ID such as m01.`);
    return null;
  }
  return value;
}

function identifier(value, label, errors) {
  if (!hasText(value) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(value)) {
    errors.push(`${label} must be lower-case kebab-case.`);
    return null;
  }
  return value;
}

function normalizedRepositoryPath(value, label, errors) {
  if (
    !hasText(value) ||
    value.includes("\\") ||
    value.includes("\0") ||
    isAbsolute(value) ||
    value.startsWith("/") ||
    value.split("/").some((part) => part === "" || part === "." || part === "..")
  ) {
    errors.push(`${label} must be a normalized repository-relative path.`);
    return null;
  }
  return value;
}

function headingAnchor(value, label, errors) {
  if (!hasText(value) || !/^[a-z0-9][a-z0-9-]*$/u.test(value)) {
    errors.push(`${label} must be a visible Markdown heading anchor without a leading #.`);
    return null;
  }
  return value;
}

function jsonPointer(value, label, errors) {
  if (typeof value !== "string" || (value !== "" && !value.startsWith("/"))) {
    errors.push(`${label} must be a JSON Pointer.`);
    return null;
  }
  return value;
}

function decodePointerSegment(segment) {
  return segment.replaceAll("~1", "/").replaceAll("~0", "~");
}

function resolveJsonPointer(root, pointer) {
  if (pointer === "") return root;
  let current = root;
  for (const rawSegment of pointer.slice(1).split("/")) {
    const segment = decodePointerSegment(rawSegment);
    if (Array.isArray(current)) {
      if (!/^(?:0|[1-9]\d*)$/u.test(segment)) return undefined;
      current = current[Number(segment)];
    } else if (isPlainObject(current) && Object.hasOwn(current, segment)) {
      current = current[segment];
    } else {
      return undefined;
    }
  }
  return current;
}

function digestText(value) {
  return `sha256:${createHash("sha256").update(value, "utf8").digest("hex")}`;
}

async function isTrackedRegularFile(siteRoot, repositoryPath) {
  const absolutePath = resolve(siteRoot, repositoryPath);
  const pathFromRoot = relative(siteRoot, absolutePath).replaceAll("\\", "/");
  if (pathFromRoot !== repositoryPath) return false;
  const stats = await lstat(absolutePath).catch(() => null);
  if (!stats || !stats.isFile() || stats.isSymbolicLink()) return false;
  return execFileAsync("git", ["ls-files", "--error-unmatch", "--", repositoryPath], {
    cwd: siteRoot,
  })
    .then(() => true)
    .catch(() => false);
}

async function readTrackedText(siteRoot, repositoryPath, label, errors) {
  const normalizedPath = normalizedRepositoryPath(repositoryPath, label, errors);
  if (!normalizedPath) return null;
  if (!(await isTrackedRegularFile(siteRoot, normalizedPath))) {
    errors.push(`${label} must resolve to a Git-tracked regular local file.`);
    return null;
  }
  try {
    return {
      path: normalizedPath,
      text: await readFile(resolve(siteRoot, normalizedPath), "utf8"),
    };
  } catch (error) {
    errors.push(`${label} could not be read: ${error instanceof Error ? error.message : String(error)}`);
    return null;
  }
}

async function readTrackedJson(siteRoot, repositoryPath, label, errors) {
  const textRecord = await readTrackedText(siteRoot, repositoryPath, label, errors);
  if (!textRecord) return null;
  if (!textRecord.path.endsWith(".json")) {
    errors.push(`${label} must name a JSON file.`);
    return null;
  }
  try {
    return { ...textRecord, value: JSON.parse(textRecord.text), digest: digestText(textRecord.text) };
  } catch (error) {
    errors.push(`${label} must contain parseable JSON: ${error instanceof Error ? error.message : String(error)}`);
    return null;
  }
}

async function resolveEvidenceInput(siteRoot, input, context, caches, errors) {
  const label = `${context} input`;
  if (!exactKeys(input, inputKeys, label, errors)) return null;
  if (!inputKinds.has(input.kind)) {
    errors.push(`${label}.kind must be markdown-heading, json-pointer, or file.`);
    return null;
  }
  if (!inputRoles.has(input.role)) {
    errors.push(`${label}.role must name an allowlisted contract-input role.`);
    return null;
  }
  const validLearningCompanionKind =
    input.role !== "learning-companion" || input.kind === "json-pointer";
  if (!validLearningCompanionKind) {
    errors.push(`${label} learning-companion role must use a JSON Pointer input.`);
  }
  const repositoryPath = normalizedRepositoryPath(input.path, `${label}.path`, errors);
  const validLearningCompanionPath =
    input.role !== "learning-companion" ||
    (repositoryPath !== null && learningCompanionPathPattern.test(repositoryPath));
  if (!validLearningCompanionPath) {
    errors.push(`${label} learning-companion role must use a canonical module-scoped companion JSON path.`);
  }
  if (!repositoryPath || !validLearningCompanionKind || !validLearningCompanionPath) return null;
  if (input.kind === "file") {
    if (input.locator !== null) errors.push(`${label}.locator must be null for a file input.`);
    const text = await readTrackedText(siteRoot, repositoryPath, label, errors);
    return text ? { kind: input.kind, role: input.role, path: repositoryPath, locator: null } : null;
  }
  if (input.kind === "markdown-heading") {
    if (!repositoryPath.endsWith(".md")) {
      errors.push(`${label}.path must name a Markdown file for a markdown-heading input.`);
      return null;
    }
    const locator = headingAnchor(input.locator, `${label}.locator`, errors);
    if (!locator) return null;
    let headings = caches.headings.get(repositoryPath);
    if (!headings) {
      const text = await readTrackedText(siteRoot, repositoryPath, label, errors);
      if (!text) return null;
      headings = new Map(extractTableOfContents(text.text).map((heading) => [heading.id, heading]));
      caches.headings.set(repositoryPath, headings);
    }
    const heading = headings.get(locator);
    if (!heading) {
      errors.push(`${label} points to #${locator}, which is not a visible h2/h3 heading in ${repositoryPath}.`);
      return null;
    }
    return { kind: input.kind, role: input.role, path: repositoryPath, locator, heading };
  }
  if (!repositoryPath.endsWith(".json")) {
    errors.push(`${label}.path must name a JSON file for a json-pointer input.`);
    return null;
  }
  const locator = jsonPointer(input.locator, `${label}.locator`, errors);
  if (locator === null) return null;
  let jsonRecord = caches.json.get(repositoryPath);
  if (!jsonRecord) {
    jsonRecord = await readTrackedJson(siteRoot, repositoryPath, label, errors);
    if (!jsonRecord) return null;
    caches.json.set(repositoryPath, jsonRecord);
  }
  const value = resolveJsonPointer(jsonRecord.value, locator);
  if (value === undefined) {
    errors.push(`${label} JSON Pointer ${locator || "(root)"} does not resolve in ${repositoryPath}.`);
    return null;
  }
  return { kind: input.kind, role: input.role, path: repositoryPath, locator, value };
}

function validateExpectedModuleId(recordModuleId, expectedModuleId, label, errors) {
  if (expectedModuleId === null || expectedModuleId === undefined) return;
  const normalized = moduleIdentifier(expectedModuleId, `${label} expectedModuleId`, errors);
  if (normalized && recordModuleId && normalized !== recordModuleId) {
    errors.push(`${label} moduleId must equal expectedModuleId ${normalized}.`);
  }
}

function validateRequiredCriterionIds(evidenceByCriterion, requiredCriterionIds, label, errors) {
  if (requiredCriterionIds === null || requiredCriterionIds === undefined) return;
  if (!Array.isArray(requiredCriterionIds) || requiredCriterionIds.length === 0) {
    errors.push(`${label} requiredCriterionIds must be a non-empty array when supplied.`);
    return;
  }
  const normalized = [];
  for (const [index, criterionId] of requiredCriterionIds.entries()) {
    const identifierValue = identifier(criterionId, `${label} requiredCriterionIds[${index}]`, errors);
    if (identifierValue) normalized.push(identifierValue);
  }
  if (new Set(normalized).size !== normalized.length) {
    errors.push(`${label} requiredCriterionIds must not repeat a criterion.`);
  }
  if (
    normalized.length !== evidenceByCriterion.size ||
    normalized.some((criterionId) => !evidenceByCriterion.has(criterionId))
  ) {
    errors.push(`${label} evidence must exactly cover requiredCriterionIds.`);
  }
}

export async function loadModuleEvidenceRecord(recordPath, { siteRoot = defaultSiteRoot } = {}) {
  const errors = [];
  const record = await readTrackedJson(siteRoot, recordPath, "module evidence record", errors);
  failure("Module evidence record load", errors);
  return record.value;
}

/**
 * Validate a module-specific structural evidence record. A successful result
 * establishes only that declared, Git-tracked local inputs and locators resolve
 * in this revision; it does not approve teaching quality, learner mastery,
 * release readiness, deployment, or security.
 */
export async function validateModuleEvidenceRecord(
  record,
  { siteRoot = defaultSiteRoot, expectedModuleId = null, requiredCriterionIds = null } = {},
) {
  const errors = [];
  exactKeys(record, evidenceTopLevelKeys, "module evidence record", errors);
  if (record?.schemaVersion !== 1 || record?.kind !== moduleEvidenceRecordKind || record?.recordVersion !== moduleReviewEvidenceRecordVersion) {
    errors.push(`module evidence record must use schemaVersion 1, kind ${moduleEvidenceRecordKind}, and recordVersion ${moduleReviewEvidenceRecordVersion}.`);
  }
  const moduleId = moduleIdentifier(record?.moduleId, "module evidence record.moduleId", errors);
  validateExpectedModuleId(moduleId, expectedModuleId, "module evidence record", errors);
  if (!hasText(record?.purpose)) errors.push("module evidence record.purpose must be a non-empty string.");
  exactKeys(record?.truthBoundary, evidenceTruthBoundaryKeys, "module evidence record.truthBoundary", errors);
  for (const key of evidenceTruthBoundaryKeys) {
    if (!hasText(record?.truthBoundary?.[key])) {
      errors.push(`module evidence record.truthBoundary.${key} must be a non-empty statement.`);
    }
  }
  if (!Array.isArray(record?.evidence) || record.evidence.length === 0) {
    errors.push("module evidence record.evidence must be a non-empty array.");
  }

  const evidenceByCriterion = new Map();
  const evidenceIds = new Set();
  const resolvedInputs = [];
  const releaseInputPaths = new Set();
  const caches = { headings: new Map(), json: new Map() };
  for (const [index, entry] of (record?.evidence ?? []).entries()) {
    const label = `module evidence record.evidence[${index}]`;
    if (!exactKeys(entry, evidenceEntryKeys, label, errors)) continue;
    const evidenceId = identifier(entry.id, `${label}.id`, errors);
    const criterionId = identifier(entry.criterionId, `${label}.criterionId`, errors);
    if (evidenceId && evidenceIds.has(evidenceId)) errors.push(`${label}.id must be unique.`);
    if (evidenceId) evidenceIds.add(evidenceId);
    if (criterionId && evidenceByCriterion.has(criterionId)) {
      errors.push(`${label}.criterionId must be unique.`);
    }
    if (!hasText(entry.claim)) errors.push(`${label}.claim must be a non-empty statement.`);
    if (!Array.isArray(entry.inputs) || entry.inputs.length === 0) {
      errors.push(`${label}.inputs must be a non-empty array.`);
    }
    if (!Array.isArray(entry.limitations) || entry.limitations.length === 0) {
      errors.push(`${label}.limitations must be a non-empty array.`);
    } else {
      for (const [limitationIndex, limitation] of entry.limitations.entries()) {
        if (!hasText(limitation)) errors.push(`${label}.limitations[${limitationIndex}] must be non-empty.`);
      }
    }

    const seenInputs = new Set();
    const entryResolvedInputs = [];
    for (const input of entry.inputs ?? []) {
      const resolved = await resolveEvidenceInput(siteRoot, input, label, caches, errors);
      if (!resolved) continue;
      const key = `${resolved.kind}\u0000${resolved.path}\u0000${resolved.locator ?? ""}`;
      if (seenInputs.has(key)) errors.push(`${label}.inputs may not repeat the same resolved input.`);
      seenInputs.add(key);
      entryResolvedInputs.push({ ...resolved, evidenceId, criterionId });
      releaseInputPaths.add(resolved.path);
    }
    if (criterionId) {
      evidenceByCriterion.set(criterionId, {
        ...entry,
        id: evidenceId,
        criterionId,
        resolvedInputs: entryResolvedInputs,
      });
    }
    resolvedInputs.push(...entryResolvedInputs);
  }
  validateRequiredCriterionIds(evidenceByCriterion, requiredCriterionIds, "module evidence record", errors);
  failure("Module evidence record", errors);
  return {
    record,
    evidenceByCriterion,
    resolvedInputs,
    releaseInputPaths: [...releaseInputPaths].sort(),
    summary: {
      evidenceItems: evidenceByCriterion.size,
      resolvedInputs: resolvedInputs.length,
    },
  };
}

export async function loadModuleReviewRecord(recordPath, { siteRoot = defaultSiteRoot } = {}) {
  const errors = [];
  const record = await readTrackedJson(siteRoot, recordPath, "module review record", errors);
  failure("Module review record load", errors);
  return record.value;
}

/**
 * Validate a human review record bound to the exact content digest of an
 * evidence record. Approval is a bounded reviewer judgment, never a learner
 * grade or a deployment/release/security claim.
 */
export async function validateModuleReviewRecord(
  record,
  {
    siteRoot = defaultSiteRoot,
    expectedModuleId = null,
    expectedEvidenceRecordPath = null,
    expectedEvidenceRecordDigest = null,
    requiredCriterionIds = null,
  } = {},
) {
  const errors = [];
  exactKeys(record, reviewTopLevelKeys, "module review record", errors);
  if (record?.schemaVersion !== 1 || record?.kind !== moduleReviewRecordKind || record?.recordVersion !== moduleReviewEvidenceRecordVersion) {
    errors.push(`module review record must use schemaVersion 1, kind ${moduleReviewRecordKind}, and recordVersion ${moduleReviewEvidenceRecordVersion}.`);
  }
  const moduleId = moduleIdentifier(record?.moduleId, "module review record.moduleId", errors);
  validateExpectedModuleId(moduleId, expectedModuleId, "module review record", errors);
  if (!hasText(record?.purpose)) errors.push("module review record.purpose must be a non-empty string.");
  exactKeys(record?.truthBoundary, reviewTruthBoundaryKeys, "module review record.truthBoundary", errors);
  for (const key of reviewTruthBoundaryKeys) {
    if (!hasText(record?.truthBoundary?.[key])) {
      errors.push(`module review record.truthBoundary.${key} must be a non-empty statement.`);
    }
  }

  const evidencePath = normalizedRepositoryPath(
    record?.evidenceRecordPath,
    "module review record.evidenceRecordPath",
    errors,
  );
  if (expectedEvidenceRecordPath !== null && expectedEvidenceRecordPath !== undefined) {
    const normalizedExpectedPath = normalizedRepositoryPath(
      expectedEvidenceRecordPath,
      "module review record expectedEvidenceRecordPath",
      errors,
    );
    if (normalizedExpectedPath && evidencePath && normalizedExpectedPath !== evidencePath) {
      errors.push(`module review record.evidenceRecordPath must equal expectedEvidenceRecordPath ${normalizedExpectedPath}.`);
    }
  }
  if (!/^sha256:[0-9a-f]{64}$/u.test(record?.evidenceRecordDigest ?? "")) {
    errors.push("module review record.evidenceRecordDigest must be a sha256: digest.");
  }
  if (
    expectedEvidenceRecordDigest !== null &&
    expectedEvidenceRecordDigest !== undefined &&
    record?.evidenceRecordDigest !== expectedEvidenceRecordDigest
  ) {
    errors.push("module review record.evidenceRecordDigest must equal expectedEvidenceRecordDigest.");
  }

  let evidenceRecord = null;
  let evidenceReport = null;
  if (evidencePath) {
    const loadedEvidence = await readTrackedJson(siteRoot, evidencePath, "module review record evidenceRecordPath", errors);
    if (loadedEvidence) {
      evidenceRecord = loadedEvidence.value;
      if (record?.evidenceRecordDigest !== loadedEvidence.digest) {
        errors.push("module review record.evidenceRecordDigest must match the exact checked-in evidence record.");
      }
      try {
        evidenceReport = await validateModuleEvidenceRecord(evidenceRecord, {
          siteRoot,
          expectedModuleId: moduleId,
          requiredCriterionIds,
        });
      } catch (error) {
        errors.push(`module review record evidenceRecordPath is invalid: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  }

  exactKeys(record?.review, reviewKeys, "module review record.review", errors);
  if (!hasText(record?.review?.reviewerRole)) {
    errors.push("module review record.review.reviewerRole must be a non-empty role, not a learner grade.");
  }
  if (!/^\d{4}-\d{2}-\d{2}$/u.test(record?.review?.reviewedAt ?? "")) {
    errors.push("module review record.review.reviewedAt must use YYYY-MM-DD.");
  }
  if (!reviewOutcomes.has(record?.review?.overallOutcome)) {
    errors.push("module review record.review.overallOutcome must be approved or changes-requested.");
  }
  if (!hasText(record?.review?.summary)) errors.push("module review record.review.summary must be non-empty.");
  if (!Array.isArray(record?.review?.knownLimitations) || record.review.knownLimitations.length === 0) {
    errors.push("module review record.review.knownLimitations must be a non-empty array.");
  } else {
    for (const [index, limitation] of record.review.knownLimitations.entries()) {
      if (!hasText(limitation)) errors.push(`module review record.review.knownLimitations[${index}] must be non-empty.`);
    }
  }

  const reviewByCriterion = new Map();
  if (!Array.isArray(record?.criteria) || record.criteria.length === 0) {
    errors.push("module review record.criteria must be a non-empty array.");
  }
  for (const [index, criterionReview] of (record?.criteria ?? []).entries()) {
    const label = `module review record.criteria[${index}]`;
    if (!exactKeys(criterionReview, reviewCriterionKeys, label, errors)) continue;
    const criterionId = identifier(criterionReview.criterionId, `${label}.criterionId`, errors);
    if (criterionId && reviewByCriterion.has(criterionId)) errors.push(`${label}.criterionId must be unique.`);
    if (!reviewOutcomes.has(criterionReview.outcome)) {
      errors.push(`${label}.outcome must be approved or changes-requested.`);
    }
    if (!hasText(criterionReview.rationale)) errors.push(`${label}.rationale must be non-empty.`);
    if (criterionId) reviewByCriterion.set(criterionId, criterionReview);
  }
  if (evidenceReport) {
    if (
      reviewByCriterion.size !== evidenceReport.evidenceByCriterion.size ||
      [...evidenceReport.evidenceByCriterion.keys()].some((criterionId) => !reviewByCriterion.has(criterionId))
    ) {
      errors.push("module review record.criteria must exactly cover the evidence record criteria.");
    }
  }
  const outcomes = [...reviewByCriterion.values()].map(({ outcome }) => outcome);
  if (record?.review?.overallOutcome === "approved" && outcomes.some((outcome) => outcome !== "approved")) {
    errors.push("module review record approved outcome requires every criterion review to be approved.");
  }
  if (
    record?.review?.overallOutcome === "changes-requested" &&
    outcomes.length > 0 &&
    outcomes.every((outcome) => outcome !== "changes-requested")
  ) {
    errors.push("module review record changes-requested outcome requires at least one requested change.");
  }
  failure("Module review record", errors);
  return {
    record,
    evidenceRecord,
    evidenceReport,
    evidenceByCriterion: evidenceReport.evidenceByCriterion,
    reviewByCriterion,
    evidenceRecordPath: evidencePath,
    evidenceRecordDigest: record.evidenceRecordDigest,
    releaseInputPaths: [...new Set([evidencePath, ...evidenceReport.releaseInputPaths])].sort(),
    summary: {
      reviewedCriteria: reviewByCriterion.size,
      approvedCriteria: outcomes.filter((outcome) => outcome === "approved").length,
      changesRequestedCriteria: outcomes.filter((outcome) => outcome === "changes-requested").length,
    },
  };
}
