import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { loadCourseGraph } from "./course-graph.mjs";
import {
  loadModuleCompanionGuides,
  moduleCompanionGuidesRelativePath,
  validateModuleCompanionGuides,
} from "./module-companion-guides.mjs";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const defaultSiteRoot = resolve(scriptDirectory, "..");

export const moduleLearningCompanionDirectoryRelativePath =
  "content/course/contracts/companions";
export const moduleLearningCompanionKind = "atlas-module-learning-companion";
export const moduleLearningCompanionRecordVersion = "v1";

const moduleIdPattern = /^m(?:0[1-9]|[1-9]\d)$/u;
const digestPattern = /^sha256:[a-f0-9]{64}$/u;
const allowedLenses = new Set(["code", "formal", "systems", "evidence"]);
const recordKeys = [
  "schemaVersion",
  "kind",
  "recordVersion",
  "moduleId",
  "purpose",
  "truthBoundary",
  "guideBinding",
  "teachingAssistant",
  "studyPartner",
  "forwardHandoff",
];
const truthBoundaryKeys = ["platform", "records", "mastery"];
const guideBindingKeys = ["path", "locator", "digest"];
const teachingAssistantKeys = ["role", "openingMove", "artifactFocus", "repairMove"];
const studyPartnerKeys = ["role", "rehearsalMove", "changedPremise", "taHandoff"];
const forwardHandoffKeys = ["targetModuleId", "carryArtifact", "targetQuestion", "boundary"];

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

function boundedText(value, label, errors, { maxLength = 1400 } = {}) {
  if (!hasText(value)) {
    errors.push(`${label} must be non-empty text.`);
    return null;
  }
  const normalized = value.trim();
  if (normalized.length > maxLength) {
    errors.push(`${label} must stay within ${maxLength} characters.`);
  }
  return normalized;
}

function moduleId(value, label, errors) {
  if (!hasText(value) || !moduleIdPattern.test(value)) {
    errors.push(`${label} must be a canonical lower-case module ID such as m31.`);
    return null;
  }
  return value;
}

function guideEntryDigest(guide) {
  return `sha256:${createHash("sha256").update(JSON.stringify(guide), "utf8").digest("hex")}`;
}

function validationFailure(errors) {
  if (errors.length > 0) {
    throw new Error(`Module learning companion validation failed:\n- ${errors.join("\n- ")}`);
  }
}

function guideAtPointer(registry, pointer) {
  const match = /^\/guides\/(0|[1-9]\d*)$/u.exec(pointer ?? "");
  if (!match || !Array.isArray(registry?.guides)) return undefined;
  return registry.guides[Number(match[1])];
}

export function moduleLearningCompanionRelativePath(moduleIdValue) {
  if (!moduleIdPattern.test(moduleIdValue ?? "")) {
    throw new Error("A module learning companion path requires a canonical module ID.");
  }
  return `${moduleLearningCompanionDirectoryRelativePath}/${moduleIdValue}.v1.json`;
}

export function moduleLearningCompanionPath(moduleIdValue, siteRoot = defaultSiteRoot) {
  return resolve(siteRoot, moduleLearningCompanionRelativePath(moduleIdValue));
}

export function moduleLearningCompanionDirectoryPath(siteRoot = defaultSiteRoot) {
  return resolve(siteRoot, moduleLearningCompanionDirectoryRelativePath);
}

/**
 * Reads the independently versioned, module-scoped companion records. A
 * record is intentionally separate from the shared reader guide: future
 * promotion evidence must not be invalidated by unrelated module edits.
 */
export async function loadModuleLearningCompanions(siteRoot = defaultSiteRoot) {
  const directory = moduleLearningCompanionDirectoryPath(siteRoot);
  const entries = await readdir(directory, { withFileTypes: true });
  const unexpected = entries.filter(
    (entry) => !entry.isFile() || !/^m(?:0[1-9]|[1-9]\d)\.v1\.json$/u.test(entry.name),
  );
  if (unexpected.length > 0) {
    throw new Error(
      `Module learning companion directory may contain only canonical v1 JSON files: ${unexpected.map(({ name }) => name).join(", ")}.`,
    );
  }
  const names = entries.map(({ name }) => name).sort();
  const paths = names.map(
    (name) => `${moduleLearningCompanionDirectoryRelativePath}/${name}`,
  );
  const records = await Promise.all(
    paths.map(async (repositoryPath) =>
      JSON.parse(await readFile(resolve(siteRoot, repositoryPath), "utf8"))),
  );
  return { paths, records };
}

export async function validateModuleLearningCompanion(
  record,
  {
    graph = null,
    expectedModuleId = null,
    repositoryPath = null,
    siteRoot = defaultSiteRoot,
  } = {},
) {
  const errors = [];
  const courseGraph = graph ?? await loadCourseGraph(siteRoot);
  const graphById = new Map((courseGraph?.modules ?? []).map((courseModule) => [courseModule.id, courseModule]));

  exactKeys(record, recordKeys, "module learning companion", errors);
  if (
    record?.schemaVersion !== 1 ||
    record?.kind !== moduleLearningCompanionKind ||
    record?.recordVersion !== moduleLearningCompanionRecordVersion
  ) {
    errors.push("module learning companion must use schemaVersion 1, the expected kind, and recordVersion v1.");
  }
  const recordModuleId = moduleId(record?.moduleId, "module learning companion.moduleId", errors);
  const expectedId = expectedModuleId === null
    ? null
    : moduleId(expectedModuleId, "module learning companion expectedModuleId", errors);
  if (recordModuleId && expectedId && recordModuleId !== expectedId) {
    errors.push(`module learning companion.moduleId must equal expectedModuleId ${expectedId}.`);
  }
  const graphModule = recordModuleId ? graphById.get(recordModuleId) : null;
  if (recordModuleId && !graphModule) {
    errors.push(`module learning companion references unknown canonical module ${recordModuleId}.`);
  }
  if (repositoryPath !== null && recordModuleId) {
    const expectedPath = moduleLearningCompanionRelativePath(recordModuleId);
    if (repositoryPath !== expectedPath) {
      errors.push(`module learning companion must live at ${expectedPath}.`);
    }
  }

  boundedText(record?.purpose, "module learning companion.purpose", errors, { maxLength: 400 });
  exactKeys(record?.truthBoundary, truthBoundaryKeys, "module learning companion.truthBoundary", errors);
  for (const key of truthBoundaryKeys) {
    boundedText(record?.truthBoundary?.[key], `module learning companion.truthBoundary.${key}`, errors);
  }

  exactKeys(record?.guideBinding, guideBindingKeys, "module learning companion.guideBinding", errors);
  const guidePath = boundedText(
    record?.guideBinding?.path,
    "module learning companion.guideBinding.path",
    errors,
    { maxLength: 160 },
  );
  const guideLocator = boundedText(
    record?.guideBinding?.locator,
    "module learning companion.guideBinding.locator",
    errors,
    { maxLength: 80 },
  );
  const guideDigest = boundedText(
    record?.guideBinding?.digest,
    "module learning companion.guideBinding.digest",
    errors,
    { maxLength: 80 },
  );
  if (guidePath && guidePath !== moduleCompanionGuidesRelativePath) {
    errors.push(`module learning companion.guideBinding.path must be ${moduleCompanionGuidesRelativePath}.`);
  }
  if (guideLocator && !/^\/guides\/(0|[1-9]\d*)$/u.test(guideLocator)) {
    errors.push("module learning companion.guideBinding.locator must be a non-root /guides/N JSON Pointer.");
  }
  if (guideDigest && !digestPattern.test(guideDigest)) {
    errors.push("module learning companion.guideBinding.digest must be a sha256 digest.");
  }

  exactKeys(record?.teachingAssistant, teachingAssistantKeys, "module learning companion.teachingAssistant", errors);
  if (record?.teachingAssistant?.role !== "supportive-oral-defense") {
    errors.push("module learning companion.teachingAssistant.role must be supportive-oral-defense.");
  }
  for (const key of teachingAssistantKeys.slice(1)) {
    boundedText(record?.teachingAssistant?.[key], `module learning companion.teachingAssistant.${key}`, errors);
  }

  exactKeys(record?.studyPartner, studyPartnerKeys, "module learning companion.studyPartner", errors);
  if (record?.studyPartner?.role !== "non-grading-rehearsal") {
    errors.push("module learning companion.studyPartner.role must be non-grading-rehearsal.");
  }
  for (const key of studyPartnerKeys.slice(1)) {
    boundedText(record?.studyPartner?.[key], `module learning companion.studyPartner.${key}`, errors);
  }

  exactKeys(record?.forwardHandoff, forwardHandoffKeys, "module learning companion.forwardHandoff", errors);
  const targetModuleId = record?.forwardHandoff?.targetModuleId;
  if (targetModuleId !== null) {
    moduleId(targetModuleId, "module learning companion.forwardHandoff.targetModuleId", errors);
  }
  for (const key of forwardHandoffKeys.slice(1)) {
    boundedText(record?.forwardHandoff?.[key], `module learning companion.forwardHandoff.${key}`, errors);
  }
  if (graphModule) {
    const forwardModule = courseGraph.modules.find(
      ({ number }) => number === graphModule.forwardModuleNumber,
    ) ?? null;
    if (forwardModule && targetModuleId !== forwardModule.id) {
      errors.push(`module learning companion.forwardHandoff must target canonical forward module ${forwardModule.id}.`);
    }
    if (!forwardModule && targetModuleId !== null) {
      errors.push("module learning companion.forwardHandoff.targetModuleId must be null when the canonical graph has no forward module.");
    }
  }

  let guide = null;
  if (guidePath === moduleCompanionGuidesRelativePath && guideLocator && digestPattern.test(guideDigest ?? "")) {
    try {
      const guideRegistry = await loadModuleCompanionGuides(siteRoot);
      await validateModuleCompanionGuides(guideRegistry, { graph: courseGraph, siteRoot });
      guide = guideAtPointer(guideRegistry, guideLocator);
      if (!isPlainObject(guide) || guide.moduleId !== recordModuleId) {
        errors.push("module learning companion.guideBinding must resolve the same module's global guide.");
      } else if (guideEntryDigest(guide) !== guideDigest) {
        errors.push("module learning companion.guideBinding.digest must match the exact bound global-guide entry.");
      } else if (!allowedLenses.has(guide.lens)) {
        errors.push("module learning companion.guideBinding must resolve a guide with a supported lens.");
      }
    } catch (error) {
      errors.push(`module learning companion.guideBinding could not validate: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  validationFailure(errors);
  return {
    record,
    graphModule,
    guide,
    repositoryPath,
    releaseInputPaths: repositoryPath === null ? [] : [resolve(siteRoot, repositoryPath)],
  };
}

export async function validateModuleLearningCompanions(
  collection,
  { graph = null, siteRoot = defaultSiteRoot } = {},
) {
  const errors = [];
  const courseGraph = graph ?? await loadCourseGraph(siteRoot);
  if (!isPlainObject(collection) || !Array.isArray(collection.records) || !Array.isArray(collection.paths)) {
    throw new Error("Module learning companion collection must contain records and paths arrays.");
  }
  if (collection.records.length !== collection.paths.length) {
    errors.push("Module learning companion collection must keep one path for every record.");
  }
  const reports = [];
  const byModuleId = new Map();
  for (const [index, record] of collection.records.entries()) {
    const repositoryPath = collection.paths[index] ?? null;
    const filenameMatch = /\/(m(?:0[1-9]|[1-9]\d))\.v1\.json$/u.exec(repositoryPath ?? "");
    const expectedModuleId = filenameMatch?.[1] ?? null;
    if (!expectedModuleId) {
      errors.push(`Module learning companion path ${String(repositoryPath)} is not canonical.`);
      continue;
    }
    try {
      const report = await validateModuleLearningCompanion(record, {
        graph: courseGraph,
        expectedModuleId,
        repositoryPath,
        siteRoot,
      });
      if (byModuleId.has(report.record.moduleId)) {
        errors.push(`Module learning companion records may not duplicate ${report.record.moduleId}.`);
      }
      byModuleId.set(report.record.moduleId, report.record);
      reports.push(report);
    } catch (error) {
      errors.push(error instanceof Error ? error.message : String(error));
    }
  }
  if (!byModuleId.has("m31")) {
    errors.push("Module learning companion collection must retain the module-scoped M31 record.");
  }
  validationFailure(errors);
  return {
    records: collection.records,
    byModuleId,
    releaseInputPaths: reports.flatMap(({ releaseInputPaths }) => releaseInputPaths),
    summary: {
      companionCount: reports.length,
      moduleIds: [...byModuleId.keys()].sort(),
    },
  };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const graph = await loadCourseGraph();
  const report = await validateModuleLearningCompanions(
    await loadModuleLearningCompanions(),
    { graph },
  );
  console.log(`Module learning companions: ${report.summary.companionCount} module-scoped record(s).`);
}
