import { createHash } from "node:crypto";
import { isAbsolute, relative } from "node:path";
import {
  GitIndexSnapshotError,
  assertGitIndexSnapshotForSiteRoot,
} from "./git-index-snapshot.mjs";

export const releaseInputLedgerRelativePath = "content/course/release-inputs.v1.json";
export const releaseInputLedgerGeneratedBy = "scripts/sync-modules.mjs";

const ledgerKeys = [
  "schemaVersion",
  "generatedBy",
  "courseGraphSchemaVersion",
  "contractVersion",
  "inputs",
];
const inputKeys = ["path", "sha256"];
const sha256Pattern = /^[a-f0-9]{64}$/u;

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
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
    typeof value !== "string" ||
    value.trim() === "" ||
    value.includes("\\") ||
    value.includes("\0") ||
    value.startsWith("/") ||
    value.startsWith(":") ||
    isAbsolute(value) ||
    value.split("/").some((part) => part === "" || part === "." || part === "..")
  ) {
    errors.push(`${label} must be a normalized repository-relative path.`);
    return null;
  }
  return value;
}

function requiredRepositoryPath(siteRoot, value, label, errors) {
  if (typeof value !== "string" || value.trim() === "") {
    errors.push(`${label} must be a non-empty path.`);
    return null;
  }
  const candidate = isAbsolute(value)
    ? relative(siteRoot, value).replaceAll("\\", "/")
    : value;
  return normalizedRepositoryPath(candidate, label, errors);
}

function ledgerFailure(errors) {
  if (errors.length > 0) {
    throw new Error(`Release-input ledger validation failed:\n- ${errors.join("\n- ")}`);
  }
}

function snapshotErrorDetail(error) {
  return error instanceof GitIndexSnapshotError ? ` (${error.code})` : "";
}

export function canonicalReleaseInputText(value) {
  return value.replace(/\r\n?/gu, "\n");
}

export function releaseInputSha256(value) {
  return createHash("sha256").update(canonicalReleaseInputText(value), "utf8").digest("hex");
}

/**
 * Verify the generated release-input ledger against one immutable, clean
 * Git-index snapshot. This is a release/provenance gate, not a generator:
 * authoring sync may still write a worktree projection before it is staged.
 */
export async function validateReleaseInputLedger({
  siteRoot,
  snapshot,
  requiredInputPaths = [],
  expectedCourseGraphSchemaVersion = null,
  expectedContractVersion = null,
} = {}) {
  const errors = [];
  if (!Array.isArray(requiredInputPaths)) {
    errors.push("release-input ledger requiredInputPaths must be an array.");
  }

  try {
    await assertGitIndexSnapshotForSiteRoot(snapshot, siteRoot);
    await snapshot.assertClean([releaseInputLedgerRelativePath]);
  } catch (error) {
    errors.push(
      `release-input ledger must begin from its captured clean Git-index record${snapshotErrorDetail(error)}: ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  let ledger = null;
  if (errors.length === 0) {
    try {
      ledger = (await snapshot.readJson(releaseInputLedgerRelativePath)).value;
    } catch (error) {
      errors.push(
        `release-input ledger must contain parseable JSON in its captured Git-index record${snapshotErrorDetail(error)}: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  exactKeys(ledger, ledgerKeys, "release-input ledger", errors);
  if (ledger?.schemaVersion !== 1) {
    errors.push("release-input ledger must use schemaVersion 1.");
  }
  if (ledger?.generatedBy !== releaseInputLedgerGeneratedBy) {
    errors.push(`release-input ledger.generatedBy must equal ${releaseInputLedgerGeneratedBy}.`);
  }
  if (!Number.isSafeInteger(ledger?.courseGraphSchemaVersion) || ledger.courseGraphSchemaVersion < 1) {
    errors.push("release-input ledger.courseGraphSchemaVersion must be a positive safe integer.");
  }
  if (
    expectedCourseGraphSchemaVersion !== null &&
    ledger?.courseGraphSchemaVersion !== expectedCourseGraphSchemaVersion
  ) {
    errors.push(
      `release-input ledger.courseGraphSchemaVersion must match the captured canonical graph schema ${expectedCourseGraphSchemaVersion}.`,
    );
  }
  if (typeof ledger?.contractVersion !== "string" || ledger.contractVersion.trim() === "") {
    errors.push("release-input ledger.contractVersion must be non-empty text.");
  }
  if (expectedContractVersion !== null && ledger?.contractVersion !== expectedContractVersion) {
    errors.push(`release-input ledger.contractVersion must match ${expectedContractVersion}.`);
  }
  if (!Array.isArray(ledger?.inputs) || ledger.inputs.length === 0) {
    errors.push("release-input ledger.inputs must be a non-empty array.");
  }

  const inputPaths = [];
  const inputByPath = new Map();
  for (const [index, input] of (ledger?.inputs ?? []).entries()) {
    const label = `release-input ledger.inputs[${index}]`;
    exactKeys(input, inputKeys, label, errors);
    const path = normalizedRepositoryPath(input?.path, `${label}.path`, errors);
    if (path === releaseInputLedgerRelativePath) {
      errors.push(`${label}.path may not include the self-referential release-input ledger.`);
    }
    if (path && inputByPath.has(path)) {
      errors.push(`${label}.path must be unique.`);
    }
    if (typeof input?.sha256 !== "string" || !sha256Pattern.test(input.sha256)) {
      errors.push(`${label}.sha256 must be a lowercase SHA-256 digest.`);
    }
    if (path && !inputByPath.has(path)) {
      inputByPath.set(path, input);
      inputPaths.push(path);
    }
  }
  const sortedInputPaths = [...inputPaths].sort();
  if (inputPaths.some((path, index) => path !== sortedInputPaths[index])) {
    errors.push("release-input ledger.inputs must be ordered by normalized repository path.");
  }

  const requiredPaths = new Set();
  for (const [index, path] of (requiredInputPaths ?? []).entries()) {
    const normalized = requiredRepositoryPath(
      siteRoot,
      path,
      `release-input ledger requiredInputPaths[${index}]`,
      errors,
    );
    if (normalized) requiredPaths.add(normalized);
  }
  if (requiredPaths.size === 0) {
    errors.push("release-input ledger requiredInputPaths must name at least one expected release input.");
  }
  for (const path of requiredPaths) {
    if (!inputByPath.has(path)) {
      errors.push(`required release input is absent from the release-input ledger: ${path}.`);
    }
  }
  for (const path of sortedInputPaths) {
    if (!requiredPaths.has(path)) {
      errors.push(`ledger input is absent from the expected release-input closure: ${path}.`);
    }
  }

  ledgerFailure(errors);

  const closurePaths = [
    releaseInputLedgerRelativePath,
    ...sortedInputPaths,
    ...requiredPaths,
  ].filter((path, index, paths) => paths.indexOf(path) === index).sort();
  try {
    await snapshot.assertClean(closurePaths);
  } catch (error) {
    errors.push(
      `release-input ledger inputs must remain one clean captured Git-index generation${snapshotErrorDetail(error)}: ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  if (errors.length === 0) {
    for (const path of sortedInputPaths) {
      const record = inputByPath.get(path);
      try {
        const source = await snapshot.readText(path);
        if (releaseInputSha256(source.text) !== record.sha256) {
          errors.push(`release-input ledger hash must match the captured Git-index input: ${path}.`);
        }
      } catch (error) {
        errors.push(
          `release-input ledger input must resolve in the captured Git-index snapshot${snapshotErrorDetail(error)}: ${path}: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    }
  }

  if (errors.length === 0) {
    try {
      await snapshot.assertClean(closurePaths);
    } catch (error) {
      errors.push(
        `release-input ledger hash verification must finish in one clean captured Git-index generation${snapshotErrorDetail(error)}: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  ledgerFailure(errors);
  return Object.freeze({
    ledger,
    inputPaths: Object.freeze(sortedInputPaths),
    requiredInputPaths: Object.freeze([...requiredPaths].sort()),
  });
}
