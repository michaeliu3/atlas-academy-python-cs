import { execFile } from "node:child_process";
import { lstat, readFile } from "node:fs/promises";
import { dirname, relative, resolve } from "node:path";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import { extractTableOfContents } from "../lib/heading-ids.js";
import { isolatedGitEnvironment } from "./git-index-snapshot.mjs";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const defaultSiteRoot = resolve(scriptDirectory, "..");
const execFileAsync = promisify(execFile);

export const moduleContractEvidenceRelativePath =
  "content/course/contracts/module-contract-evidence.v2.json";

const pilotTracks = new Map([
  ["m21", "systems"],
  ["m27", "mathematics"],
]);
const permittedEvidenceKinds = new Set([
  "course-map",
  "session",
  "first-principles",
  "code-reading",
  "visual-text-alternative",
  "source-ledger",
  "diagnostic",
  "retrieval",
  "project",
  "rubric",
  "oral-defense",
  "ta",
  "study-partner",
  "handoff",
]);

function hasText(value) {
  return typeof value === "string" && value.trim() !== "";
}

function evidenceFailure(errors) {
  if (errors.length > 0) {
    throw new Error(`Draft module-contract evidence validation failed:\n- ${errors.join("\n- ")}`);
  }
}

function requireExactKeys(record, keys, label, errors) {
  if (!record || typeof record !== "object" || Array.isArray(record)) {
    errors.push(`${label} must be an object.`);
    return false;
  }
  const allowed = new Set(keys);
  for (const key of Object.keys(record)) {
    if (!allowed.has(key)) {
      errors.push(`${label} has an unsupported field ${key}.`);
    }
  }
  for (const key of keys) {
    if (!(key in record)) {
      errors.push(`${label} is missing ${key}.`);
    }
  }
  return true;
}

function normalizedContentPath(value, label, errors) {
  if (!hasText(value)) {
    errors.push(`${label} must be a non-empty repository-relative Markdown path.`);
    return null;
  }
  if (
    value.includes("\\") ||
    value.includes("\0") ||
    !value.startsWith("content/") ||
    !value.endsWith(".md") ||
    value.startsWith("/") ||
    value.split("/").some((segment) => segment === "" || segment === "." || segment === "..")
  ) {
    errors.push(`${label} must stay below content/ as a normalized Markdown path.`);
    return null;
  }
  return value;
}

function normalizedHeadingAnchor(value, label, errors) {
  if (!hasText(value) || !/^[a-z0-9][a-z0-9-]*$/u.test(value)) {
    errors.push(`${label} must be a visible h2/h3 heading anchor without a leading #.`);
    return null;
  }
  return value;
}

async function checkedInMarkdownHeadings(siteRoot, relativePath, label, headingCache, errors) {
  const cachedHeadings = headingCache.get(relativePath);
  if (cachedHeadings) {
    return cachedHeadings;
  }
  const absolutePath = resolve(siteRoot, relativePath);
  const pathFromRoot = relative(siteRoot, absolutePath).replaceAll("\\", "/");
  if (pathFromRoot !== relativePath || !pathFromRoot.startsWith("content/")) {
    errors.push(`${label} resolves outside the checked-in content tree.`);
    return null;
  }

  const stats = await lstat(absolutePath).catch(() => null);
  if (!stats || !stats.isFile() || stats.isSymbolicLink()) {
    errors.push(`${label} must resolve to a regular local file.`);
    return null;
  }

  const tracked = await execFileAsync("git", ["ls-files", "--error-unmatch", "--", relativePath], {
    cwd: siteRoot,
    env: isolatedGitEnvironment(),
  })
    .then(() => true)
    .catch(() => false);
  if (!tracked) {
    errors.push(`${label} must target a file tracked by Git.`);
    return null;
  }

  const headings = extractTableOfContents(await readFile(absolutePath, "utf8"));
  headingCache.set(relativePath, headings);
  return headings;
}

async function resolveEvidencePointer(siteRoot, pointer, moduleId, headingCache, errors) {
  const label = `Module ${moduleId} evidence pointer ${pointer?.id ?? "(missing id)"}`;
  requireExactKeys(
    pointer,
    ["id", "kind", "label", "path", "headingAnchor", "sessionNumber"],
    label,
    errors,
  );
  if (!hasText(pointer?.id) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(pointer.id)) {
    errors.push(`${label} id must be lowercase kebab-case.`);
  }
  if (!permittedEvidenceKinds.has(pointer?.kind)) {
    errors.push(`${label} kind is not recognized.`);
  }
  if (!hasText(pointer?.label)) {
    errors.push(`${label} label must be a non-empty string.`);
  }

  const relativePath = normalizedContentPath(pointer?.path, `${label} path`, errors);
  const headingAnchor = normalizedHeadingAnchor(
    pointer?.headingAnchor,
    `${label} headingAnchor`,
    errors,
  );
  if (pointer?.kind === "session") {
    if (!Number.isInteger(pointer.sessionNumber) || pointer.sessionNumber < 1 || pointer.sessionNumber > 6) {
      errors.push(`${label} sessionNumber must be an integer from 1 through 6.`);
    }
  } else if (pointer?.sessionNumber !== null) {
    errors.push(`${label} sessionNumber must be null unless kind is session.`);
  }
  if (!relativePath || !headingAnchor) {
    return null;
  }

  const headings = await checkedInMarkdownHeadings(
    siteRoot,
    relativePath,
    label,
    headingCache,
    errors,
  );
  if (!headings) {
    return null;
  }
  const heading = headings.find(({ id }) => id === headingAnchor);
  if (!heading) {
    errors.push(
      `${label} points to #${headingAnchor}, but ${relativePath} does not contain that visible h2/h3 heading anchor.`,
    );
    return null;
  }

  return {
    moduleId,
    id: pointer.id,
    kind: pointer.kind,
    path: relativePath,
    heading,
    sessionNumber: pointer.sessionNumber,
  };
}

export function moduleContractEvidencePath(siteRoot = defaultSiteRoot) {
  return resolve(siteRoot, moduleContractEvidenceRelativePath);
}

export async function loadModuleContractEvidenceRegistry(siteRoot = defaultSiteRoot) {
  return JSON.parse(await readFile(moduleContractEvidencePath(siteRoot), "utf8"));
}

/**
 * Resolve draft evidence pointers without changing publication, release, or
 * human-review state. A successful result means only that each target file and
 * visible heading anchor exists in this checked-out revision.
 */
export async function validateModuleContractEvidenceRegistry(
  registry,
  { siteRoot = defaultSiteRoot } = {},
) {
  const errors = [];
  requireExactKeys(
    registry,
    [
      "schemaVersion",
      "contractVersion",
      "kind",
      "purpose",
      "canonicalCourseGraph",
      "truthBoundary",
      "pilotModuleIds",
      "modules",
    ],
    "draft module-contract evidence registry",
    errors,
  );
  if (registry?.schemaVersion !== 2 || registry?.contractVersion !== "v2-draft") {
    errors.push("draft module-contract evidence registry must use schemaVersion 2 and contractVersion v2-draft.");
  }
  if (registry?.kind !== "atlas-module-contract-evidence") {
    errors.push("draft module-contract evidence registry has an invalid kind.");
  }
  if (!hasText(registry?.purpose)) {
    errors.push("draft module-contract evidence registry must state its limited purpose.");
  }
  if (registry?.canonicalCourseGraph !== "content/course/course-graph.v2.json") {
    errors.push("draft module-contract evidence registry must name the canonical course graph.");
  }
  requireExactKeys(
    registry?.truthBoundary,
    ["pointerResolutionOnly", "humanReview", "publication"],
    "draft module-contract evidence truthBoundary",
    errors,
  );
  for (const field of ["pointerResolutionOnly", "humanReview", "publication"]) {
    if (!hasText(registry?.truthBoundary?.[field])) {
      errors.push(`draft module-contract evidence truthBoundary.${field} must be a non-empty statement.`);
    }
  }

  const pilotModuleIds = registry?.pilotModuleIds;
  const declaredPilotModuleIds = Array.isArray(pilotModuleIds) ? pilotModuleIds : [];
  if (!Array.isArray(pilotModuleIds) || declaredPilotModuleIds.length > 2) {
    errors.push("draft module-contract evidence registry may contain at most two pilot module IDs.");
  }
  const pilotIdSet = new Set(declaredPilotModuleIds);
  if (pilotIdSet.size !== declaredPilotModuleIds.length) {
    errors.push("draft module-contract evidence pilot module IDs must be unique.");
  }
  for (const moduleId of pilotIdSet) {
    if (!pilotTracks.has(moduleId)) {
      errors.push("draft module-contract evidence pilots are limited to M21 systems and M27 mathematics.");
    }
  }

  if (!Array.isArray(registry?.modules) || registry.modules.length > 2) {
    errors.push("draft module-contract evidence registry may contain at most two module entries.");
    evidenceFailure(errors);
  }

  const entryByModuleId = new Map();
  const resolvedPointers = [];
  const headingCache = new Map();
  for (const entry of registry.modules) {
    const entryLabel = `draft module-contract evidence entry ${entry?.moduleId ?? "(missing moduleId)"}`;
    requireExactKeys(
      entry,
      ["moduleId", "track", "draftState", "reviewState", "publicationEffect", "pointers"],
      entryLabel,
      errors,
    );
    if (!hasText(entry?.moduleId) || entryByModuleId.has(entry.moduleId)) {
      errors.push("draft module-contract evidence entry moduleId values must be present and unique.");
      continue;
    }
    entryByModuleId.set(entry.moduleId, entry);
    if (!pilotTracks.has(entry.moduleId)) {
      errors.push(`${entryLabel} is outside the M21/M27 pilot boundary.`);
    }
    if (entry?.track !== pilotTracks.get(entry.moduleId)) {
      errors.push(`${entryLabel} track must match its bounded pilot discipline.`);
    }
    if (entry?.draftState !== "draft-pointer-map") {
      errors.push(`${entryLabel} must remain a draft-pointer-map.`);
    }
    if (entry?.reviewState !== "not-reviewed") {
      errors.push(`${entryLabel} must remain not-reviewed; this registry cannot record approval.`);
    }
    if (entry?.publicationEffect !== "none") {
      errors.push(`${entryLabel} publicationEffect must be none.`);
    }
    if (!Array.isArray(entry?.pointers) || entry.pointers.length === 0) {
      errors.push(`${entryLabel} must contain at least one draft evidence pointer.`);
      continue;
    }

    const pointerIds = new Set();
    const sessionNumbers = new Set();
    for (const pointer of entry.pointers) {
      if (hasText(pointer?.id) && pointerIds.has(pointer.id)) {
        errors.push(`${entryLabel} pointer IDs must be unique.`);
      }
      if (hasText(pointer?.id)) {
        pointerIds.add(pointer.id);
      }
      if (pointer?.kind === "session" && Number.isInteger(pointer.sessionNumber)) {
        if (sessionNumbers.has(pointer.sessionNumber)) {
          errors.push(`${entryLabel} may not repeat a session evidence pointer.`);
        }
        sessionNumbers.add(pointer.sessionNumber);
      }
      const resolved = await resolveEvidencePointer(
        siteRoot,
        pointer,
        entry.moduleId,
        headingCache,
        errors,
      );
      if (resolved) {
        resolvedPointers.push(resolved);
      }
    }
  }

  if (
    entryByModuleId.size !== pilotIdSet.size ||
    [...entryByModuleId.keys()].some((moduleId) => !pilotIdSet.has(moduleId))
  ) {
    errors.push("draft module-contract evidence entries must match pilotModuleIds exactly.");
  }

  evidenceFailure(errors);
  return {
    registry,
    resolvedPointers,
    summary: {
      draftPilotModules: entryByModuleId.size,
      resolvedPointers: resolvedPointers.length,
      humanReviews: 0,
      publicationChanges: 0,
    },
  };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const registry = await loadModuleContractEvidenceRegistry();
  const report = await validateModuleContractEvidenceRegistry(registry);
  console.log(
    `Draft module-contract evidence: ${report.summary.draftPilotModules} pilot modules, ${report.summary.resolvedPointers} resolved pointers, ${report.summary.humanReviews} human reviews, ${report.summary.publicationChanges} publication changes.`,
  );
}
