import { createHash } from "node:crypto";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  GitIndexSnapshotError,
  assertGitIndexSnapshotForSiteRoot,
  openGitIndexSnapshot,
  openCachedGitIndexSnapshot,
} from "./git-index-snapshot.mjs";
import {
  declaresBrowserTestTitle,
  isValidBrowserTestTitle,
  readTrackedText,
  teachingTestDiscoveryKind,
} from "./module-review-evidence.mjs";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const defaultSiteRoot = resolve(scriptDirectory, "..");

export const legacyCandidatePreflightProfilesRelativePath =
  "content/course/contracts/legacy-candidate-preflight-profiles.v1.json";
export const legacyCandidatePreflightProfilesKind =
  "atlas-legacy-candidate-preflight-profiles";
export const legacyCandidatePreflightProfilesRecordVersion = "v1";

const topLevelKeys = [
  "schemaVersion",
  "kind",
  "recordVersion",
  "purpose",
  "truthBoundary",
  "candidates",
];
const truthBoundaryKeys = ["candidate", "publication"];
const candidateKeys = [
  "moduleId",
  "packetId",
  "candidateDocumentation",
  "sourceLedgerPaths",
  "studioSourcePath",
  "visualTestPath",
];
const browserCandidateKeys = [...candidateKeys, "browserTestTitle"];
const candidateDocumentationKeys = ["path", "anchor", "digest"];
const moduleIdPattern = /^m(?:0[1-9]|[1-9]\d)$/u;
const identifierPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/u;
const digestPattern = /^sha256:[a-f0-9]{64}$/u;

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function hasText(value) {
  return typeof value === "string" && value.trim() !== "";
}

function sameJsonValue(left, right) {
  if (Object.is(left, right)) return true;
  if (Array.isArray(left) || Array.isArray(right)) {
    return (
      Array.isArray(left) &&
      Array.isArray(right) &&
      left.length === right.length &&
      left.every((value, index) => sameJsonValue(value, right[index]))
    );
  }
  if (!isPlainObject(left) || !isPlainObject(right)) return false;
  const leftKeys = Object.keys(left).sort();
  const rightKeys = Object.keys(right).sort();
  return (
    leftKeys.length === rightKeys.length &&
    leftKeys.every(
      (key, index) => key === rightKeys[index] && sameJsonValue(left[key], right[key]),
    )
  );
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

function exactCandidateKeys(value, label, errors) {
  const expectedKeys =
    isPlainObject(value) && Object.hasOwn(value, "browserTestTitle")
      ? browserCandidateKeys
      : candidateKeys;
  return exactKeys(value, expectedKeys, label, errors);
}

function normalizedRepositoryPath(value, label, errors) {
  if (
    !hasText(value) ||
    value.includes("\\") ||
    value.includes("\0") ||
    value.startsWith("/") ||
    value.split("/").some((part) => part === "" || part === "." || part === "..")
  ) {
    errors.push(`${label} must be a normalized repository-relative path.`);
    return null;
  }
  return value;
}

function moduleNumber(moduleId) {
  return Number(moduleId.slice(1));
}

function validationFailure(errors) {
  if (errors.length > 0) {
    throw new Error(`Legacy candidate preflight-profile validation failed:\n- ${errors.join("\n- ")}`);
  }
}

function documentationPathFor(moduleId) {
  return `docs/module-evidence/${moduleId}/candidate-preflight.md`;
}

function evidencePathFor(moduleId) {
  return `content/course/contracts/evidence/${moduleId}.v1.json`;
}

function preflightPathFor(moduleId) {
  return `content/course/contracts/evidence/preflight/${moduleId}.v1.json`;
}

function digest(value) {
  return `sha256:${createHash("sha256").update(value, "utf8").digest("hex")}`;
}

export function legacyCandidatePreflightProfilesPath(siteRoot = defaultSiteRoot) {
  return resolve(siteRoot, legacyCandidatePreflightProfilesRelativePath);
}

/**
 * This registry is a versioned allowlist for structural, non-promoting
 * preflights. It is deliberately independent of review-candidates/, which is
 * reserved for a later human-review/promotion lifecycle.
 */
export async function loadLegacyCandidatePreflightProfiles(
  siteRoot = defaultSiteRoot,
  { snapshot = null } = {},
) {
  const errors = [];
  const record = await readTrackedText(
    siteRoot,
    legacyCandidatePreflightProfilesRelativePath,
    "legacy candidate preflight-profile registry",
    errors,
    { snapshot },
  );
  if (!record) validationFailure(errors);
  try {
    return JSON.parse(record.text);
  } catch (error) {
    throw new Error(
      `Legacy candidate preflight-profile registry must contain parseable JSON: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

/**
 * Validate only the frozen non-promotion profile material. A passing report
 * proves that an allowlisted package and its local references are coherent; it
 * does not approve content, human review, CI, deployment, or publication.
 */
export async function validateLegacyCandidatePreflightProfiles(
  profileRegistry,
  { siteRoot = defaultSiteRoot, snapshot = null } = {},
) {
  const errors = [];
  const snapshotInputPaths = new Set([
    legacyCandidatePreflightProfilesRelativePath,
  ]);
  const releaseInputPaths = new Set([
    legacyCandidatePreflightProfilesPath(siteRoot),
  ]);
  const suppliedSnapshot = snapshot !== null;
  // A complete preflight touches hundreds of inputs. Capture one immutable
  // index generation for the whole closure, then perform one final clean check
  // instead of spawning Git for every individual read. Callers may supply a
  // stronger shared snapshot; otherwise this function owns the bounded one.
  if (!snapshot) {
    try {
      snapshot = process.env.ATLAS_GIT_INDEX_SNAPSHOT_CACHE === "1"
        ? await openCachedGitIndexSnapshot(siteRoot)
        : await openGitIndexSnapshot(siteRoot);
    } catch (error) {
      errors.push(
        `legacy candidate preflight-profile registry must resolve from one immutable Git-index snapshot: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
  if (snapshot) {
    try {
      await assertGitIndexSnapshotForSiteRoot(snapshot, siteRoot);
      await snapshot.assertClean([legacyCandidatePreflightProfilesRelativePath]);
      if (suppliedSnapshot) {
        const capturedProfileRegistry = (
          await snapshot.readJson(legacyCandidatePreflightProfilesRelativePath)
        ).value;
        if (!sameJsonValue(profileRegistry, capturedProfileRegistry)) {
          errors.push(
            "legacy candidate preflight-profile supplied profile registry must match its captured Git-index profile registry.",
          );
        }
        // Snapshot-bound callers may provide values for a diagnostic comparison,
        // but all semantic work below must use immutable captured JSON rather
        // than a mutable object that could change after that comparison.
        profileRegistry = capturedProfileRegistry;
      }
    } catch (error) {
      const errorCode = error instanceof GitIndexSnapshotError ? ` (${error.code})` : "";
      errors.push(
        `legacy candidate preflight-profile registry must resolve from one immutable Git-index snapshot${errorCode}: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
  exactKeys(
    profileRegistry,
    topLevelKeys,
    "legacy candidate preflight-profile registry",
    errors,
  );
  if (
    profileRegistry?.schemaVersion !== 1 ||
    profileRegistry?.kind !== legacyCandidatePreflightProfilesKind ||
    profileRegistry?.recordVersion !== legacyCandidatePreflightProfilesRecordVersion
  ) {
    errors.push(
      `legacy candidate preflight-profile registry must use schemaVersion 1, kind ${legacyCandidatePreflightProfilesKind}, and recordVersion ${legacyCandidatePreflightProfilesRecordVersion}.`,
    );
  }
  if (!hasText(profileRegistry?.purpose)) {
    errors.push("legacy candidate preflight-profile registry.purpose must be non-empty text.");
  }
  exactKeys(
    profileRegistry?.truthBoundary,
    truthBoundaryKeys,
    "legacy candidate preflight-profile registry.truthBoundary",
    errors,
  );
  for (const key of truthBoundaryKeys) {
    if (!hasText(profileRegistry?.truthBoundary?.[key])) {
      errors.push(`legacy candidate preflight-profile registry.truthBoundary.${key} must be non-empty text.`);
    }
  }
  if (!Array.isArray(profileRegistry?.candidates) || profileRegistry.candidates.length === 0) {
    errors.push("legacy candidate preflight-profile registry.candidates must be a non-empty array.");
  }

  const candidateByModuleId = new Map();
  const packetIds = new Set();
  for (const [index, candidate] of (profileRegistry?.candidates ?? []).entries()) {
    const label = `legacy candidate preflight-profile registry.candidates[${index}]`;
    exactCandidateKeys(candidate, label, errors);
    const moduleId = candidate?.moduleId;
    if (!hasText(moduleId) || !moduleIdPattern.test(moduleId) || moduleNumber(moduleId) > 30) {
      errors.push(`${label}.moduleId must name one canonical M01–M30 legacy module.`);
    } else if (candidateByModuleId.has(moduleId)) {
      errors.push(`${label}.moduleId must be unique.`);
    }
    if (moduleIdPattern.test(moduleId ?? "") && moduleNumber(moduleId) <= 30) {
      for (const [role, path] of [
        ["candidate evidence record", evidencePathFor(moduleId)],
        ["candidate preflight record", preflightPathFor(moduleId)],
      ]) {
        snapshotInputPaths.add(path);
        const record = await readTrackedText(siteRoot, path, `${label}.${role}`, errors, {
          snapshot,
          inputsAlreadyChecked: Boolean(snapshot),
        });
        if (record) releaseInputPaths.add(resolve(siteRoot, path));
      }
    }
    if (!hasText(candidate?.packetId) || !identifierPattern.test(candidate.packetId)) {
      errors.push(`${label}.packetId must be lower-case kebab-case.`);
    } else if (packetIds.has(candidate.packetId)) {
      errors.push(`${label}.packetId must be unique.`);
    }
    if (hasText(candidate?.packetId)) packetIds.add(candidate.packetId);

    exactKeys(candidate?.candidateDocumentation, candidateDocumentationKeys, `${label}.candidateDocumentation`, errors);
    const documentationPath = normalizedRepositoryPath(
      candidate?.candidateDocumentation?.path,
      `${label}.candidateDocumentation.path`,
      errors,
    );
    const expectedDocumentationPath = moduleIdPattern.test(moduleId ?? "")
      ? documentationPathFor(moduleId)
      : null;
    if (documentationPath && documentationPath !== expectedDocumentationPath) {
      errors.push(`${label}.candidateDocumentation.path must be ${expectedDocumentationPath}.`);
    }
    if (candidate?.candidateDocumentation?.anchor !== "candidate-boundary") {
      errors.push(`${label}.candidateDocumentation.anchor must be candidate-boundary.`);
    }
    if (!digestPattern.test(candidate?.candidateDocumentation?.digest ?? "")) {
      errors.push(`${label}.candidateDocumentation.digest must be a sha256 digest.`);
    }

    const sourceLedgerPaths = candidate?.sourceLedgerPaths;
    if (
      !Array.isArray(sourceLedgerPaths) ||
      sourceLedgerPaths.length === 0 ||
      new Set(sourceLedgerPaths).size !== sourceLedgerPaths.length
    ) {
      errors.push(`${label}.sourceLedgerPaths must be a non-empty array of unique paths.`);
    }
    for (const [pathIndex, path] of (sourceLedgerPaths ?? []).entries()) {
      const normalized = normalizedRepositoryPath(path, `${label}.sourceLedgerPaths[${pathIndex}]`, errors);
      if (
        normalized &&
        (!normalized.startsWith("content/source-maps/") || !normalized.endsWith(".md"))
      ) {
        errors.push(`${label}.sourceLedgerPaths[${pathIndex}] must name a Markdown source-map artifact.`);
      }
      if (normalized) {
        snapshotInputPaths.add(normalized);
        const record = await readTrackedText(
          siteRoot,
          normalized,
          `${label}.sourceLedgerPaths[${pathIndex}]`,
          errors,
          { snapshot, inputsAlreadyChecked: Boolean(snapshot) },
        );
        if (record) releaseInputPaths.add(resolve(siteRoot, normalized));
      }
    }

    const studioSourcePath = normalizedRepositoryPath(
      candidate?.studioSourcePath,
      `${label}.studioSourcePath`,
      errors,
    );
    if (studioSourcePath && (!studioSourcePath.startsWith("app/") || !studioSourcePath.endsWith(".tsx"))) {
      errors.push(`${label}.studioSourcePath must name an app/*.tsx studio source file.`);
    }
    if (studioSourcePath) {
      snapshotInputPaths.add(studioSourcePath);
      const record = await readTrackedText(
        siteRoot,
        studioSourcePath,
        `${label}.studioSourcePath`,
        errors,
        { snapshot, inputsAlreadyChecked: Boolean(snapshot) },
      );
      if (record) releaseInputPaths.add(resolve(siteRoot, studioSourcePath));
    }

    const visualTestPath = normalizedRepositoryPath(
      candidate?.visualTestPath,
      `${label}.visualTestPath`,
      errors,
    );
    const visualTestKind = visualTestPath ? teachingTestDiscoveryKind(visualTestPath) : null;
    if (visualTestPath && visualTestKind !== "node" && visualTestKind !== "browser") {
      errors.push(`${label}.visualTestPath must name a discovered top-level Node or Playwright browser test.`);
    }
    const browserTestTitle = candidate?.browserTestTitle;
    if (visualTestKind === "browser" && !isValidBrowserTestTitle(browserTestTitle)) {
      errors.push(`${label}.browserTestTitle must name one non-empty literal Playwright test title.`);
    }
    if (visualTestKind !== "browser" && Object.hasOwn(candidate ?? {}, "browserTestTitle")) {
      errors.push(`${label}.browserTestTitle is allowed only with a discovered Playwright browser test.`);
    }
    if (visualTestPath) {
      snapshotInputPaths.add(visualTestPath);
      const record = await readTrackedText(
        siteRoot,
        visualTestPath,
        `${label}.visualTestPath`,
        errors,
        { snapshot, inputsAlreadyChecked: Boolean(snapshot) },
      );
        if (record) {
          releaseInputPaths.add(resolve(siteRoot, visualTestPath));
          if (
            visualTestKind === "browser" &&
            isValidBrowserTestTitle(browserTestTitle) &&
            !declaresBrowserTestTitle(record.text, browserTestTitle)
          ) {
            errors.push(`${label}.browserTestTitle must name a declared Playwright test title in ${visualTestPath}.`);
          }
        }
    }

    if (documentationPath) {
      snapshotInputPaths.add(documentationPath);
      const record = await readTrackedText(
        siteRoot,
        documentationPath,
        `${label}.candidateDocumentation`,
        errors,
        { snapshot, inputsAlreadyChecked: Boolean(snapshot) },
      );
      if (record) {
        releaseInputPaths.add(resolve(siteRoot, documentationPath));
        if (digest(record.text) !== candidate?.candidateDocumentation?.digest) {
          errors.push(`${label}.candidateDocumentation.digest must match the checked-in candidate-boundary document.`);
        }
      }
    }

    if (
      moduleIdPattern.test(moduleId ?? "") &&
      !candidateByModuleId.has(moduleId) &&
      hasText(candidate?.packetId) &&
      documentationPath &&
      Array.isArray(sourceLedgerPaths) &&
      studioSourcePath &&
      visualTestPath
    ) {
      candidateByModuleId.set(moduleId, Object.freeze({
        moduleId,
        packetId: candidate.packetId,
        candidateDocumentationPath: documentationPath,
        candidateDocumentationAnchor: candidate.candidateDocumentation.anchor,
        candidateDocumentationDigest: candidate.candidateDocumentation.digest,
        sourceLedgerPaths: Object.freeze([...sourceLedgerPaths]),
        studioSourcePath,
        visualTestPath,
        visualTestTitle: visualTestKind === "browser" ? browserTestTitle : null,
      }));
    }
  }

  try {
    // The final closure covers the registry plus every profile-derived record,
    // source ledger, studio, visual test, and candidate-boundary document
    // resolved during validation. Individual reads guard early failures; this
    // final check prevents a mixed generation after a successful early read.
    if (snapshot) await snapshot.assertClean([...snapshotInputPaths].sort());
  } catch (error) {
    const errorCode = error instanceof GitIndexSnapshotError ? ` (${error.code})` : "";
    errors.push(
      `legacy candidate preflight-profile registry must remain in the captured Git-index generation${errorCode}: ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  validationFailure(errors);
  return {
    profileRegistry,
    candidateByModuleId,
    releaseInputPaths: [...releaseInputPaths].sort(),
    snapshotInputPaths: [...snapshotInputPaths].sort(),
  };
}
