import { dirname, isAbsolute, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  assertGitIndexSnapshotForSiteRoot,
  GitIndexSnapshotError,
  openGitIndexSnapshot,
} from "./git-index-snapshot.mjs";
import { readTrackedText } from "./module-review-evidence.mjs";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const defaultSiteRoot = resolve(scriptDirectory, "..");

export const hiddenReviewCandidateSelectorKind = "atlas-hidden-review-candidate-selector";
export const hiddenReviewCandidateSelectorVersion = "v1";

const selectorKeys = [
  "schemaVersion",
  "kind",
  "selectorVersion",
  "moduleId",
  "purpose",
  "truthBoundary",
  "evidenceRecordPath",
  "workbookPath",
  "sourceLedgerPaths",
  "visualContentPaths",
];
const truthBoundaryKeys = ["review", "learnerDelivery", "release"];

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

function normalizedRepositoryPath(value, label, errors) {
  if (
    !hasText(value) ||
    value.includes("\\") ||
    /[\u0000-\u001f\u007f]/u.test(value) ||
    isAbsolute(value) ||
    value.startsWith("/") ||
    value.split("/").some((part) => part === "" || part === "." || part === "..")
  ) {
    errors.push(`${label} must be a normalized repository-relative path.`);
    return null;
  }
  return value;
}

function moduleIdentifier(value, label, errors) {
  if (!hasText(value) || !/^m(?:0[1-9]|[1-9]\d)$/u.test(value)) {
    errors.push(`${label} must be a lower-case module ID such as m31.`);
    return null;
  }
  return value;
}

function moduleNumber(moduleId) {
  return Number(moduleId.slice(1));
}

function moduleScopedSourceLedgerPath(repositoryPath, moduleId) {
  if (
    typeof repositoryPath !== "string" ||
    !repositoryPath.startsWith("content/source-maps/") ||
    !repositoryPath.endsWith(".md")
  ) {
    return false;
  }
  const number = moduleNumber(moduleId);
  const token = new RegExp(
    `(?:^|[/_.-])(?:m0?${number}|module0?${number}|0?${number})(?=[/_.-]|$)`,
    "iu",
  );
  return token.test(repositoryPath);
}

function orderedUniquePaths(value, label, errors) {
  if (!Array.isArray(value) || value.length === 0) {
    errors.push(`${label} must be a non-empty array of paths.`);
    return [];
  }
  const paths = [];
  for (const [index, path] of value.entries()) {
    const normalized = normalizedRepositoryPath(path, `${label}[${index}]`, errors);
    if (normalized) paths.push(normalized);
  }
  const expected = [...new Set(paths)].sort();
  if (paths.length !== expected.length || paths.some((path, index) => path !== expected[index])) {
    errors.push(`${label} must be sorted and contain no duplicate paths.`);
  }
  return paths;
}

function selectorFailure(errors) {
  if (errors.length > 0) {
    throw new Error(`Hidden review candidate selector validation failed:\n- ${errors.join("\n- ")}`);
  }
}

function snapshotErrorDetail(error) {
  const code = error instanceof GitIndexSnapshotError ? ` (${error.code})` : "";
  return `${error instanceof Error ? error.message : String(error)}${code}`;
}

export function hiddenReviewCandidateRelativePath(moduleId) {
  if (typeof moduleId !== "string" || !/^m(?:0[1-9]|[1-9]\d)$/u.test(moduleId)) {
    throw new Error("Hidden review candidate selectors require a lower-case module ID such as m31.");
  }
  return `content/course/contracts/review-candidates/${moduleId}.v1.json`;
}

/**
 * A hidden review-candidate selector freezes the learner-material scope that
 * a future review can inspect without making that candidate reader-visible or
 * released. It is deliberately not an authoring-delivery map, approval, or
 * deployment record.
 */
export function validateHiddenReviewCandidateSelector(
  selector,
  { expectedModuleId = null, expectedEvidenceRecordPath = null } = {},
) {
  const errors = [];
  exactKeys(selector, selectorKeys, "hidden review candidate selector", errors);
  if (
    selector?.schemaVersion !== 1 ||
    selector?.kind !== hiddenReviewCandidateSelectorKind ||
    selector?.selectorVersion !== hiddenReviewCandidateSelectorVersion
  ) {
    errors.push(
      `hidden review candidate selector must use schemaVersion 1, kind ${hiddenReviewCandidateSelectorKind}, and selectorVersion ${hiddenReviewCandidateSelectorVersion}.`,
    );
  }
  const moduleId = moduleIdentifier(selector?.moduleId, "hidden review candidate selector.moduleId", errors);
  if (expectedModuleId !== null && moduleId !== expectedModuleId) {
    errors.push(`hidden review candidate selector.moduleId must equal ${expectedModuleId}.`);
  }
  if (!hasText(selector?.purpose)) {
    errors.push("hidden review candidate selector.purpose must be a non-empty statement.");
  }
  exactKeys(
    selector?.truthBoundary,
    truthBoundaryKeys,
    "hidden review candidate selector.truthBoundary",
    errors,
  );
  for (const key of truthBoundaryKeys) {
    if (!hasText(selector?.truthBoundary?.[key])) {
      errors.push(`hidden review candidate selector.truthBoundary.${key} must be a non-empty statement.`);
    }
  }

  const evidenceRecordPath = normalizedRepositoryPath(
    selector?.evidenceRecordPath,
    "hidden review candidate selector.evidenceRecordPath",
    errors,
  );
  const canonicalEvidenceRecordPath = moduleId
    ? `content/course/contracts/evidence/${moduleId}.v1.json`
    : null;
  if (evidenceRecordPath && evidenceRecordPath !== canonicalEvidenceRecordPath) {
    errors.push(
      `hidden review candidate selector.evidenceRecordPath must be ${canonicalEvidenceRecordPath}.`,
    );
  }
  if (expectedEvidenceRecordPath !== null && evidenceRecordPath !== expectedEvidenceRecordPath) {
    errors.push(
      `hidden review candidate selector.evidenceRecordPath must equal ${expectedEvidenceRecordPath}.`,
    );
  }

  const workbookPath = normalizedRepositoryPath(
    selector?.workbookPath,
    "hidden review candidate selector.workbookPath",
    errors,
  );
  const expectedWorkbookPrefix = moduleId
    ? `content/modules/${String(moduleNumber(moduleId)).padStart(2, "0")}_`
    : null;
  if (
    workbookPath &&
    (!expectedWorkbookPrefix || !workbookPath.startsWith(expectedWorkbookPrefix) || !workbookPath.endsWith(".md"))
  ) {
    errors.push(
      `hidden review candidate selector.workbookPath must name the future module-scoped Markdown workbook under ${expectedWorkbookPrefix}.`,
    );
  }

  const sourceLedgerPaths = orderedUniquePaths(
    selector?.sourceLedgerPaths,
    "hidden review candidate selector.sourceLedgerPaths",
    errors,
  );
  for (const sourceLedgerPath of sourceLedgerPaths) {
    if (!moduleId || !moduleScopedSourceLedgerPath(sourceLedgerPath, moduleId)) {
      errors.push(
        `hidden review candidate selector.sourceLedgerPaths must contain module-scoped Markdown source ledgers under content/source-maps/.`,
      );
    }
  }

  const visualContentPaths = orderedUniquePaths(
    selector?.visualContentPaths,
    "hidden review candidate selector.visualContentPaths",
    errors,
  );
  if (
    workbookPath &&
    (visualContentPaths.length !== 1 || visualContentPaths[0] !== workbookPath)
  ) {
    errors.push(
      "hidden review candidate selector.visualContentPaths must contain exactly its hidden workbook, so the candidate's visual scope cannot drift.",
    );
  }

  selectorFailure(errors);
  return Object.freeze({
    selector,
    moduleId,
    evidenceRecordPath,
    workbookPath,
    sourceLedgerPaths: Object.freeze([...sourceLedgerPaths]),
    visualContentPaths: Object.freeze([...visualContentPaths]),
  });
}

/**
 * Resolve a candidate only from its fixed module-scoped selector and one
 * captured Git index. Callers cannot inject an arbitrary candidate object.
 */
export async function resolveHiddenReviewCandidateScope({
  siteRoot = defaultSiteRoot,
  moduleId,
  evidenceRecordPath,
  snapshot = null,
}) {
  const selectorPath = hiddenReviewCandidateRelativePath(moduleId);
  let candidateSnapshot = snapshot;
  try {
    candidateSnapshot = candidateSnapshot
      ? await assertGitIndexSnapshotForSiteRoot(candidateSnapshot, siteRoot)
      : await openGitIndexSnapshot(siteRoot);
  } catch (error) {
    throw new Error(
      `Hidden review candidate selector requires an immutable Git-index snapshot: ${snapshotErrorDetail(error)}`,
    );
  }

  const errors = [];
  const selectorRecord = await readTrackedText(
    siteRoot,
    selectorPath,
    "hidden review candidate selector",
    errors,
    { snapshot: candidateSnapshot },
  );
  if (!selectorRecord) selectorFailure(errors);

  let selector;
  try {
    selector = JSON.parse(selectorRecord.text);
  } catch (error) {
    throw new Error(
      `Hidden review candidate selector must contain parseable JSON: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
  const validated = validateHiddenReviewCandidateSelector(selector, {
    expectedModuleId: moduleId,
    expectedEvidenceRecordPath: evidenceRecordPath,
  });
  const candidateInputPaths = [
    selectorPath,
    validated.evidenceRecordPath,
    validated.workbookPath,
    ...validated.sourceLedgerPaths,
    ...validated.visualContentPaths,
  ].filter((path, index, paths) => paths.indexOf(path) === index).sort();
  try {
    await candidateSnapshot.assertClean(candidateInputPaths);
  } catch (error) {
    throw new Error(
      `Hidden review candidate selector must resolve one clean Git-index candidate scope: ${snapshotErrorDetail(error)}`,
    );
  }
  return Object.freeze({
    selectorPath,
    selectorBlobOid: selectorRecord.blobOid,
    selectorSha256: selectorRecord.sha256,
    candidateInputPaths: Object.freeze(candidateInputPaths),
    ...validated,
  });
}
