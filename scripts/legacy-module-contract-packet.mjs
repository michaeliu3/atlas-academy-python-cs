import { execFile } from "node:child_process";
import { lstat, readFile } from "node:fs/promises";
import { dirname, relative, resolve } from "node:path";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import { extractTableOfContents } from "../lib/heading-ids.js";
import {
  loadLegacyModuleContractAudit,
  validateLegacyModuleContractAudit,
} from "./validate-legacy-module-contract-audit.mjs";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const defaultSiteRoot = resolve(scriptDirectory, "..");
const execFileAsync = promisify(execFile);

export const legacyModuleContractPacketRelativePath =
  "content/course/contracts/legacy-module-contract-packets.v1.json";

const exactCriterionIds = [
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
];
const criterionRoles = new Map([
  ["prerequisite-forward-map", ["prerequisite-map", "forward-handoff"]],
  ["six-connected-sessions", ["session"]],
  ["first-principles", ["first-principles"]],
  [
    "rigor-definitions-assumptions-derivations-proofs-counterexamples-numerical-experiments",
    ["definition", "assumption", "derivation-proof", "counterexample", "numerical-experiment"],
  ],
  ["code-reading-debugging-design", ["code-reading", "debugging", "design"]],
  ["prediction-before-reveal", ["prediction"]],
  ["transfer-task", ["transfer"]],
  ["source-ledger", ["source-rationale", "claim-linkage", "license-reuse", "stable-learner-link"]],
  ["accessible-visual-text-alternative", ["visual", "text-alternative"]],
  ["confidence-diagnostic-misconceptions", ["diagnostic", "confidence", "misconception"]],
  ["retrieval-and-spaced-review", ["retrieval"]],
  ["project-and-evidence-rubric", ["dossier", "acceptance-criteria", "rubric"]],
  [
    "supportive-oral-defense",
    ["oral-protocol", "oral-hint", "oral-counterexample", "oral-transfer", "oral-reflection", "oral-summary"],
  ],
  ["ta-prompt", ["ta"]],
  ["study-partner-prompt", ["study-partner"]],
  ["forward-handoff", ["forward-handoff"]],
]);
const sessionOutputRole = "session-output";
const evidenceRoles = new Set([...criterionRoles.values()].flat().concat(sessionOutputRole));
const auditStatuses = new Set(["pointer-present", "ambiguous", "missing"]);
const supportedSurfaces = new Set(["workbook", "canonical-source-map", "source-audit-addendum"]);
const supportedArtifactKinds = new Set(["studio", "bounded-reference-model", "oral-guide"]);

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

function requireExactKeys(record, keys, label, errors) {
  if (!record || typeof record !== "object" || Array.isArray(record)) {
    errors.push(`${label} must be an object.`);
    return false;
  }
  const allowed = new Set(keys);
  for (const key of Object.keys(record)) {
    if (!allowed.has(key)) errors.push(`${label} has an unsupported field ${key}.`);
  }
  for (const key of keys) {
    if (!(key in record)) errors.push(`${label} is missing ${key}.`);
  }
  return true;
}

function packetFailure(errors) {
  if (errors.length > 0) {
    throw new Error(`Legacy module contract-packet validation failed:\n- ${errors.join("\n- ")}`);
  }
}

function normalizedRepositoryPath(value, label, errors, { contentOnly = true } = {}) {
  if (
    !hasText(value) ||
    value.includes("\\") ||
    value.includes("\0") ||
    value.startsWith("/") ||
    value.split("/").some((segment) => segment === "" || segment === "." || segment === "..")
  ) {
    errors.push(`${label} must be a normalized repository-relative path without escapes.`);
    return null;
  }
  if ((contentOnly && !value.startsWith("content/")) || !value.endsWith(".md")) {
    errors.push(`${label} must name a Markdown file below content/.`);
    return null;
  }
  return value;
}

function normalizedAnchor(value, label, errors) {
  if (!hasText(value) || !/^[a-z0-9][a-z0-9-]*$/u.test(value)) {
    errors.push(`${label} must be a visible heading anchor without a leading #.`);
    return null;
  }
  return value;
}

async function requireTrackedRegularFile(siteRoot, repositoryPath, label, errors) {
  const absolutePath = resolve(siteRoot, repositoryPath);
  if (relative(siteRoot, absolutePath).replaceAll("\\", "/") !== repositoryPath) {
    errors.push(`${label} resolves outside the repository.`);
    return null;
  }
  const stats = await lstat(absolutePath).catch(() => null);
  if (!stats || !stats.isFile() || stats.isSymbolicLink()) {
    errors.push(`${label} must resolve to a regular local file.`);
    return null;
  }
  const tracked = await execFileAsync("git", ["ls-files", "--error-unmatch", "--", repositoryPath], {
    cwd: siteRoot,
  })
    .then(() => true)
    .catch(() => false);
  if (!tracked) {
    errors.push(`${label} must target a Git-tracked file.`);
    return null;
  }
  return absolutePath;
}

async function headingsFor(siteRoot, repositoryPath, cache, label, errors) {
  if (cache.has(repositoryPath)) return cache.get(repositoryPath);
  const absolutePath = await requireTrackedRegularFile(siteRoot, repositoryPath, label, errors);
  if (!absolutePath) return null;
  const ordered = extractTableOfContents(await readFile(absolutePath, "utf8"));
  const headings = {
    ordered,
    byId: new Map(ordered.map((heading) => [heading.id, heading])),
  };
  cache.set(repositoryPath, headings);
  return headings;
}

function moduleIdForNumber(number) {
  return `m${String(number).padStart(2, "0")}`;
}

function packetPathForSurface(entry, surface) {
  return {
    workbook: entry.workbookPath,
    "canonical-source-map": entry.sourceMapPath,
    "source-audit-addendum": entry.sourceAuditAddendumPath,
  }[surface];
}

async function resolvePointer(entry, pointer, siteRoot, headingCache, errors) {
  const label = `Module ${entry?.moduleId ?? "(missing)"} packet pointer ${pointer?.id ?? "(missing)"}`;
  requireExactKeys(pointer, ["id", "roles", "label", "sessionNumber", "target"], label, errors);
  const id = hasText(pointer?.id) && /^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(pointer.id)
    ? pointer.id
    : null;
  if (!id) errors.push(`${label}.id must be lowercase kebab-case.`);
  if (!hasText(pointer?.label)) errors.push(`${label}.label must be non-empty.`);
  const rolesAreValid = (
    Array.isArray(pointer?.roles) &&
    pointer.roles.length > 0 &&
    new Set(pointer.roles).size === pointer.roles.length &&
    pointer.roles.every((role) => evidenceRoles.has(role))
  );
  if (!Array.isArray(pointer?.roles) || pointer.roles.length === 0 || new Set(pointer.roles).size !== pointer.roles.length) {
    errors.push(`${label}.roles must be a non-empty array of unique roles.`);
  } else {
    for (const role of pointer.roles) {
      if (!evidenceRoles.has(role)) errors.push(`${label}.roles contains unsupported role ${role}.`);
    }
  }
  if (pointer?.sessionNumber !== null && (!Number.isInteger(pointer?.sessionNumber) || pointer.sessionNumber < 1 || pointer.sessionNumber > 6)) {
    errors.push(`${label}.sessionNumber must be null or an integer from 1 through 6.`);
  }
  requireExactKeys(pointer?.target, ["surface", "path", "headingAnchor"], `${label}.target`, errors);
  const surface = pointer?.target?.surface;
  if (!supportedSurfaces.has(surface)) {
    errors.push(`${label}.target.surface is unsupported.`);
  }
  const path = normalizedRepositoryPath(pointer?.target?.path, `${label}.target.path`, errors);
  const anchor = normalizedAnchor(pointer?.target?.headingAnchor, `${label}.target.headingAnchor`, errors);
  if (!id || !rolesAreValid || !path || !anchor || !supportedSurfaces.has(surface)) return null;
  if (path !== packetPathForSurface(entry, surface)) {
    errors.push(`${label}.target.path must match its declared ${surface} path.`);
    return null;
  }
  const headings = await headingsFor(siteRoot, path, headingCache, label, errors);
  const heading = headings?.byId.get(anchor);
  if (!heading) {
    errors.push(`${label} points to #${anchor}, which is not visible in ${path}.`);
    return null;
  }
  if (heading.depth !== 2 && heading.depth !== 3) {
    errors.push(`${label} must target a visible h2/h3 teaching anchor.`);
    return null;
  }
  return { ...pointer, id, target: { surface, path, headingAnchor: anchor } };
}

async function validateImplementationArtifact(entry, artifact, siteRoot, errors) {
  const label = `Module ${entry?.moduleId ?? "(missing)"} implementation artifact ${artifact?.id ?? "(missing)"}`;
  requireExactKeys(artifact, ["id", "kind", "paths"], label, errors);
  if (!hasText(artifact?.id) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(artifact.id)) {
    errors.push(`${label}.id must be lowercase kebab-case.`);
  }
  if (!supportedArtifactKinds.has(artifact?.kind)) {
    errors.push(`${label}.kind is unsupported.`);
  }
  if (!Array.isArray(artifact?.paths) || artifact.paths.length === 0 || new Set(artifact.paths).size !== artifact.paths.length) {
    errors.push(`${label}.paths must be a non-empty array of unique repository paths.`);
    return [];
  }
  const paths = [];
  for (const [index, path] of artifact.paths.entries()) {
    if (!hasText(path) || path.includes("\\") || path.includes("\0") || path.startsWith("/") || path.split("/").some((segment) => segment === "" || segment === "." || segment === "..")) {
      errors.push(`${label}.paths[${index}] must be a normalized repository path.`);
      continue;
    }
    const absolutePath = await requireTrackedRegularFile(siteRoot, path, `${label}.paths[${index}]`, errors);
    if (absolutePath) paths.push(absolutePath);
  }
  return paths;
}

async function validateSessionSpine(entry, courseModule, auditEntry, pointerById, workbookPath, siteRoot, headingCache, errors) {
  const label = `Module ${entry.moduleId} packet sessionSpine`;
  if (!Array.isArray(entry?.sessionSpine) || entry.sessionSpine.length !== 6) {
    errors.push(`${label} must declare exactly six ordered sessions.`);
    return;
  }
  const workbookHeadings = workbookPath
    ? await headingsFor(siteRoot, workbookPath, headingCache, `${label} workbook`, errors)
    : null;
  const artifactIds = new Set();
  const expectedPrerequisites = courseModule.academicPrerequisiteNumbers.map(moduleIdForNumber);
  for (const [index, session] of entry.sessionSpine.entries()) {
    const sessionLabel = `${label}[${index}]`;
    requireExactKeys(session, ["sessionNumber", "pointerId", "usesPrerequisiteModuleIds", "forwardArtifactId"], sessionLabel, errors);
    if (session?.sessionNumber !== index + 1) {
      errors.push(`${sessionLabel}.sessionNumber must be ${index + 1}.`);
    }
    const pointer = pointerById.get(session?.pointerId);
    if (!pointer || !Array.isArray(pointer.roles) || !pointer.roles.includes("session") || pointer.sessionNumber !== index + 1) {
      errors.push(`${sessionLabel}.pointerId must resolve its matching session pointer.`);
    } else if (pointer.target.path !== entry.workbookPath || pointer.target.headingAnchor !== auditEntry.sessionAnchors[index]) {
      errors.push(`${sessionLabel}.pointerId must match the legacy audit's ordered session anchor.`);
    }
    const expectedUse = index === 0 ? expectedPrerequisites : [];
    if (!sameOrderedValues(session?.usesPrerequisiteModuleIds, expectedUse)) {
      errors.push(`${sessionLabel}.usesPrerequisiteModuleIds must preserve the declared prerequisite-first route.`);
    }
    if (!hasText(session?.forwardArtifactId) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(session.forwardArtifactId)) {
      errors.push(`${sessionLabel}.forwardArtifactId must be lowercase kebab-case.`);
    } else if (artifactIds.has(session.forwardArtifactId)) {
      errors.push(`${label}.forwardArtifactId values must be unique.`);
    } else {
      artifactIds.add(session.forwardArtifactId);
    }

    const outputPointer = pointerById.get(session?.forwardArtifactId);
    if (
      !outputPointer ||
      !Array.isArray(outputPointer.roles) ||
      !outputPointer.roles.includes(sessionOutputRole) ||
      outputPointer.sessionNumber !== index + 1
    ) {
      errors.push(`${sessionLabel}.forwardArtifactId must resolve its matching session-output pointer.`);
      continue;
    }
    if (outputPointer.target.surface !== "workbook" || outputPointer.target.path !== workbookPath) {
      errors.push(`${sessionLabel}.forwardArtifactId must target its canonical workbook.`);
      continue;
    }
    const sessionHeading = workbookHeadings?.byId.get(pointer?.target?.headingAnchor);
    const outputHeading = workbookHeadings?.byId.get(outputPointer.target.headingAnchor);
    const sessionIndex = workbookHeadings?.ordered.findIndex(
      ({ id }) => id === pointer?.target?.headingAnchor,
    ) ?? -1;
    const outputIndex = workbookHeadings?.ordered.findIndex(
      ({ id }) => id === outputPointer.target.headingAnchor,
    ) ?? -1;
    const nextSessionIndex = workbookHeadings?.ordered.findIndex(
      (heading, headingIndex) => headingIndex > sessionIndex && heading.depth <= sessionHeading?.depth,
    ) ?? -1;
    if (
      !sessionHeading ||
      !outputHeading ||
      sessionHeading.depth !== 2 ||
      outputHeading.depth !== 3 ||
      outputIndex <= sessionIndex ||
      (nextSessionIndex !== -1 && outputIndex >= nextSessionIndex)
    ) {
      errors.push(`${sessionLabel}.forwardArtifactId must resolve a visible h3 inside its matching session.`);
    }
  }

  const sessionOutputPointers = [...pointerById.values()].filter(
    (pointer) => Array.isArray(pointer.roles) && pointer.roles.includes(sessionOutputRole),
  );
  if (
    sessionOutputPointers.length !== artifactIds.size ||
    sessionOutputPointers.some((pointer) => !artifactIds.has(pointer.id))
  ) {
    errors.push(`${label}.session-output pointers must bind exactly the declared forward artifacts.`);
  }
}

function validateCriteria(entry, auditEntry, pointerById, errors) {
  const label = `Module ${entry.moduleId} packet criteria`;
  if (!Array.isArray(entry?.criteria) || entry.criteria.length !== exactCriterionIds.length) {
    errors.push(`${label} must contain the exact 16-criterion taxonomy.`);
    return;
  }
  for (const [index, criterion] of entry.criteria.entries()) {
    const criterionId = exactCriterionIds[index];
    const criterionLabel = `${label}[${index}]`;
    requireExactKeys(criterion, ["criterionId", "legacyAuditStatus", "structuralState", "pointerIds"], criterionLabel, errors);
    if (criterion?.criterionId !== criterionId) {
      errors.push(`${criterionLabel}.criterionId must be ${criterionId}.`);
    }
    const auditedStatus = auditEntry.evidence?.[criterionId]?.status;
    if (!auditStatuses.has(criterion?.legacyAuditStatus) || criterion.legacyAuditStatus !== auditedStatus) {
      errors.push(`${criterionLabel}.legacyAuditStatus must match the immutable legacy audit status.`);
    }
    if (criterion?.structuralState !== "mapped-not-reviewed") {
      errors.push(`${criterionLabel}.structuralState must remain mapped-not-reviewed.`);
    }
    if (!Array.isArray(criterion?.pointerIds) || criterion.pointerIds.length === 0 || new Set(criterion.pointerIds).size !== criterion.pointerIds.length) {
      errors.push(`${criterionLabel}.pointerIds must be a non-empty array of unique pointer IDs.`);
      continue;
    }
    const pointers = criterion.pointerIds.map((pointerId) => pointerById.get(pointerId)).filter(Boolean);
    if (pointers.length !== criterion.pointerIds.length) {
      errors.push(`${criterionLabel}.pointerIds must all resolve in the packet pointer table.`);
    }
    for (const requiredRole of criterionRoles.get(criterionId) ?? []) {
      if (!pointers.some((pointer) => Array.isArray(pointer.roles) && pointer.roles.includes(requiredRole))) {
        errors.push(`${criterionLabel} requires a ${requiredRole} pointer role.`);
      }
    }
  }
}

function validateCanonicalExpectation(entry, courseModule, auditEntry, errors) {
  const label = `Module ${entry.moduleId} packet canonicalExpectation`;
  requireExactKeys(
    entry?.canonicalExpectation,
    ["academicPrerequisiteModuleIds", "forwardModuleId", "masteryGateId", "studioId"],
    label,
    errors,
  );
  const prerequisiteIds = courseModule.academicPrerequisiteNumbers.map(moduleIdForNumber);
  const forwardModuleId = courseModule.forwardModuleNumber === null
    ? null
    : moduleIdForNumber(courseModule.forwardModuleNumber);
  if (!sameOrderedValues(entry?.canonicalExpectation?.academicPrerequisiteModuleIds, prerequisiteIds)) {
    errors.push(`${label}.academicPrerequisiteModuleIds must match the canonical graph.`);
  }
  if (entry?.canonicalExpectation?.forwardModuleId !== forwardModuleId) {
    errors.push(`${label}.forwardModuleId must match the canonical graph.`);
  }
  if (entry?.canonicalExpectation?.masteryGateId !== courseModule.masteryGateId) {
    errors.push(`${label}.masteryGateId must match the canonical graph.`);
  }
  if (entry?.canonicalExpectation?.studioId !== courseModule.studioId) {
    errors.push(`${label}.studioId must match the canonical graph.`);
  }
  if (entry?.workbookPath !== auditEntry.workbookPath) {
    errors.push(`${label} workbookPath must match the canonical legacy audit/manifest workbook.`);
  }
  if (entry?.sourceMapPath !== courseModule.sourceMap) {
    errors.push(`${label} sourceMapPath must match the canonical graph.`);
  }
}

export function legacyModuleContractPacketPath(siteRoot = defaultSiteRoot) {
  return resolve(siteRoot, legacyModuleContractPacketRelativePath);
}

export async function loadLegacyModuleContractPacketRegistry(siteRoot = defaultSiteRoot) {
  return JSON.parse(await readFile(legacyModuleContractPacketPath(siteRoot), "utf8"));
}

/**
 * Resolve a non-promoting packet against the canonical graph and immutable
 * legacy audit. This proves only that typed local evidence pointers exist and
 * agree with the audit's present ambiguity; it does not approve quality,
 * accessibility, source licenses, CI, release, deployment, or mastery.
 */
export async function validateLegacyModuleContractPacketRegistry(
  graph,
  registry,
  { siteRoot = defaultSiteRoot, canonicalLegacyAudit = null } = {},
) {
  const errors = [];
  requireExactKeys(
    registry,
    ["schemaVersion", "contractVersion", "kind", "purpose", "canonicalCourseGraph", "truthBoundary", "modules"],
    "legacy module contract-packet registry",
    errors,
  );
  if (registry?.schemaVersion !== 1 || registry?.contractVersion !== "v1" || registry?.kind !== "atlas-legacy-module-contract-packets") {
    errors.push("legacy module contract-packet registry must use schemaVersion 1, contractVersion v1, and the expected kind.");
  }
  if (!hasText(registry?.purpose)) errors.push("legacy module contract-packet registry must state its limited purpose.");
  if (registry?.canonicalCourseGraph !== "content/course/course-graph.v2.json") {
    errors.push("legacy module contract-packet registry must name the canonical course graph.");
  }
  requireExactKeys(
    registry?.truthBoundary,
    ["pointerResolutionOnly", "humanReview", "publication", "legacyAudit"],
    "legacy module contract-packet truthBoundary",
    errors,
  );
  for (const field of ["pointerResolutionOnly", "humanReview", "publication", "legacyAudit"]) {
    if (!hasText(registry?.truthBoundary?.[field])) {
      errors.push(`legacy module contract-packet truthBoundary.${field} must be non-empty.`);
    }
  }
  if (!Array.isArray(registry?.modules) || registry.modules.length === 0) {
    errors.push("legacy module contract-packet registry must contain at least one non-promoting packet.");
  }
  await requireTrackedRegularFile(
    siteRoot,
    legacyModuleContractPacketRelativePath,
    "legacy module contract-packet registry",
    errors,
  );

  let audit = canonicalLegacyAudit;
  try {
    audit ??= await loadLegacyModuleContractAudit(siteRoot);
    await validateLegacyModuleContractAudit(audit, { siteRoot });
  } catch (error) {
    errors.push(`legacy module contract-packet registry requires the canonical audit: ${error instanceof Error ? error.message : String(error)}`);
  }
  const graphById = new Map((graph?.modules ?? []).map((courseModule) => [courseModule.id, courseModule]));
  const auditByModuleId = new Map((audit?.modules ?? []).map((entry) => [entry.moduleId, entry]));
  const seenModuleIds = new Set();
  const seenPacketIds = new Set();
  const packetById = new Map();
  const packetByModuleId = new Map();
  const headingCache = new Map();
  const releaseInputPaths = new Set([legacyModuleContractPacketPath(siteRoot)]);

  for (const entry of registry?.modules ?? []) {
    const label = `legacy module contract-packet ${entry?.moduleId ?? "(missing)"}`;
    requireExactKeys(
      entry,
      [
        "moduleId",
        "packetId",
        "packetState",
        "humanReviewState",
        "publicationEffect",
        "canonicalExpectation",
        "workbookPath",
        "sourceMapPath",
        "sourceAuditAddendumPath",
        "sessionSpine",
        "pointers",
        "criteria",
        "implementationArtifacts",
      ],
      label,
      errors,
    );
    if (!hasText(entry?.moduleId) || seenModuleIds.has(entry.moduleId)) {
      errors.push(`${label}.moduleId must be present and unique.`);
      continue;
    }
    seenModuleIds.add(entry.moduleId);
    if (!hasText(entry?.packetId) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(entry.packetId) || seenPacketIds.has(entry.packetId)) {
      errors.push(`${label}.packetId must be unique lowercase kebab-case.`);
      continue;
    }
    seenPacketIds.add(entry.packetId);
    const courseModule = graphById.get(entry.moduleId);
    const auditEntry = auditByModuleId.get(entry.moduleId);
    if (
      !courseModule ||
      courseModule.state?.lifecycle !== "learner-material-ready" ||
      courseModule.number > 30 ||
      !auditEntry
    ) {
      errors.push(`${label} must bind one canonical M1–M30 learner-ready graph/audit module.`);
      continue;
    }
    if (entry.packetState !== "structural-candidate" || entry.humanReviewState !== "not-reviewed" || entry.publicationEffect !== "none") {
      errors.push(`${label} must remain a non-promoting, not-reviewed structural-candidate.`);
    }
    validateCanonicalExpectation(entry, courseModule, auditEntry, errors);
    const workbookPath = normalizedRepositoryPath(entry.workbookPath, `${label}.workbookPath`, errors);
    const sourceMapPath = normalizedRepositoryPath(entry.sourceMapPath, `${label}.sourceMapPath`, errors);
    const addendumPath = normalizedRepositoryPath(entry.sourceAuditAddendumPath, `${label}.sourceAuditAddendumPath`, errors);
    for (const [field, path] of [["workbookPath", workbookPath], ["sourceMapPath", sourceMapPath], ["sourceAuditAddendumPath", addendumPath]]) {
      if (path) {
        const absolutePath = await requireTrackedRegularFile(siteRoot, path, `${label}.${field}`, errors);
        if (absolutePath) releaseInputPaths.add(absolutePath);
      }
    }
    if (addendumPath && !addendumPath.startsWith(`content/source-maps/module${courseModule.number}_`)) {
      errors.push(`${label}.sourceAuditAddendumPath must be module-scoped.`);
    }

    if (!Array.isArray(entry?.pointers) || entry.pointers.length === 0) {
      errors.push(`${label}.pointers must be a non-empty table.`);
      continue;
    }
    const pointerById = new Map();
    for (const pointer of entry.pointers) {
      const resolved = await resolvePointer(entry, pointer, siteRoot, headingCache, errors);
      if (!resolved) continue;
      if (pointerById.has(resolved.id)) {
        errors.push(`${label}.pointers IDs must be unique.`);
      } else {
        pointerById.set(resolved.id, resolved);
        releaseInputPaths.add(resolve(siteRoot, resolved.target.path));
      }
    }
    await validateSessionSpine(
      entry,
      courseModule,
      auditEntry,
      pointerById,
      workbookPath,
      siteRoot,
      headingCache,
      errors,
    );
    validateCriteria(entry, auditEntry, pointerById, errors);

    if (!Array.isArray(entry?.implementationArtifacts) || entry.implementationArtifacts.length === 0) {
      errors.push(`${label}.implementationArtifacts must bind the studio/model/test surface.`);
    } else {
      const artifactIds = new Set();
      for (const artifact of entry.implementationArtifacts) {
        if (hasText(artifact?.id) && artifactIds.has(artifact.id)) {
          errors.push(`${label}.implementationArtifacts IDs must be unique.`);
        }
        if (hasText(artifact?.id)) artifactIds.add(artifact.id);
        await validateImplementationArtifact(entry, artifact, siteRoot, errors);
      }
    }
    const packet = { ...entry, resolvedPointerIds: [...pointerById.keys()].sort() };
    packetById.set(entry.packetId, packet);
    packetByModuleId.set(entry.moduleId, packet);
  }
  packetFailure(errors);
  return {
    registry,
    packetById,
    packetByModuleId,
    releaseInputPaths: [...releaseInputPaths],
    summary: {
      structuralCandidates: packetById.size,
      resolvedPointers: [...packetById.values()].reduce(
        (total, packet) => total + packet.resolvedPointerIds.length,
        0,
      ),
      humanApprovals: 0,
      publicationChanges: 0,
    },
  };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [registry, graph] = await Promise.all([
    loadLegacyModuleContractPacketRegistry(),
    (await import("./course-graph.mjs")).loadCourseGraph(),
  ]);
  const report = await validateLegacyModuleContractPacketRegistry(graph, registry);
  console.log(
    `Legacy module contract packets: ${report.summary.structuralCandidates} structural candidate(s), ${report.summary.resolvedPointers} resolved pointers, 0 human approvals, 0 publication changes.`,
  );
}
