import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { loadCourseGraph } from "./course-graph.mjs";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const defaultSiteRoot = resolve(scriptDirectory, "..");

export const moduleCompanionGuidesRelativePath =
  "content/course/module-companion-guides.v1.json";

const allowedLenses = new Set(["code", "formal", "systems", "evidence"]);
const guideKeys = [
  "moduleId",
  "lens",
  "centralModel",
  "traceOrDerivation",
  "misconception",
  "boundary",
  "transfer",
];

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function hasText(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function exactKeys(value, keys) {
  if (!isPlainObject(value)) return false;
  const actual = Object.keys(value).sort();
  const expected = [...keys].sort();
  return actual.length === expected.length && actual.every((key, index) => key === expected[index]);
}

function boundedText(value, label, errors) {
  if (!hasText(value)) {
    errors.push(`${label} must be non-empty text.`);
  } else if (value.trim().length > 900) {
    errors.push(`${label} must stay within 900 characters so the live brief remains readable.`);
  }
}

export function moduleCompanionGuidesPath(siteRoot = defaultSiteRoot) {
  return resolve(siteRoot, moduleCompanionGuidesRelativePath);
}

export async function loadModuleCompanionGuides(siteRoot = defaultSiteRoot) {
  return JSON.parse(await readFile(moduleCompanionGuidesPath(siteRoot), "utf8"));
}

/**
 * Validate the non-promoting companion-guide registry that feeds the module
 * reader. Module-specific promotion evidence is deliberately stricter and
 * lives in its own versioned module record.
 */
export async function validateModuleCompanionGuides(
  registry,
  { graph = null, siteRoot = defaultSiteRoot } = {},
) {
  const errors = [];
  const courseGraph = graph ?? await loadCourseGraph();

  if (!exactKeys(registry, [
    "schemaVersion",
    "guideVersion",
    "kind",
    "canonicalCourseGraph",
    "liveCodexLearningWorkflow",
    "guides",
  ])) {
    errors.push("module companion guide registry must use the exact v1 schema keys.");
  }
  if (
    registry?.schemaVersion !== 1 ||
    registry?.guideVersion !== "v1" ||
    registry?.kind !== "atlas-module-companion-guides"
  ) {
    errors.push("module companion guide registry must use schemaVersion 1, guideVersion v1, and the expected kind.");
  }
  if (registry?.canonicalCourseGraph !== "content/course/course-graph.v2.json") {
    errors.push("module companion guide registry must bind to the canonical course graph.");
  }
  if (registry?.liveCodexLearningWorkflow !== "content/course/live-codex-learning-workflow.v1.json") {
    errors.push("module companion guide registry must bind to the reviewed Live Codex workflow.");
  }
  if (!Array.isArray(registry?.guides)) {
    errors.push("module companion guide registry must contain a guides array.");
  }

  const moduleById = new Map((courseGraph?.modules ?? []).map((courseModule) => [courseModule.id, courseModule]));
  const guideById = new Map();
  for (const [index, guide] of (registry?.guides ?? []).entries()) {
    const label = `module companion guide ${index + 1}`;
    if (!exactKeys(guide, guideKeys)) {
      errors.push(`${label} must use exactly these keys: ${guideKeys.join(", ")}.`);
      continue;
    }
    if (!moduleById.has(guide.moduleId)) {
      errors.push(`${label} references an unknown moduleId ${String(guide.moduleId)}.`);
    }
    if (guideById.has(guide.moduleId)) {
      errors.push(`${label} duplicates moduleId ${guide.moduleId}.`);
    }
    guideById.set(guide.moduleId, guide);
    if (!allowedLenses.has(guide.lens)) {
      errors.push(`${label}.lens must be one of code, formal, systems, or evidence.`);
    }
    for (const field of guideKeys.slice(2)) {
      boundedText(guide[field], `${label}.${field}`, errors);
    }
  }

  if (guideById.size !== moduleById.size || (registry?.guides?.length ?? 0) !== moduleById.size) {
    errors.push("module companion guide registry must contain exactly one guide for every canonical module.");
  }
  for (const moduleId of moduleById.keys()) {
    if (!guideById.has(moduleId)) {
      errors.push(`module companion guide registry is missing canonical module ${moduleId}.`);
    }
  }

  if (errors.length > 0) {
    throw new Error(`Module companion guide validation failed:\n- ${errors.join("\n- ")}`);
  }
  return {
    guidePath: moduleCompanionGuidesRelativePath,
    guides: registry.guides,
    guideByModuleId: guideById,
    releaseInputPaths: [moduleCompanionGuidesPath(siteRoot)],
    summary: {
      guideCount: registry.guides.length,
      graphModuleCount: moduleById.size,
    },
  };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const report = await validateModuleCompanionGuides(await loadModuleCompanionGuides());
  console.log(`Module companion guides: ${report.summary.guideCount} graph-bound guides.`);
}
