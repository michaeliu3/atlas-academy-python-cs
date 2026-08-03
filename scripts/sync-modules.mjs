import { createHash } from "node:crypto";
import { access, lstat, readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { advancedModuleBridgePath } from "./advanced-module-bridge.mjs";
import {
  applyCourseStatusSummary,
  courseStatusProjectionPath,
  courseStatusSurfaceRelativePaths,
  renderCourseStatusProjection,
} from "./course-status-projection.mjs";
import {
  advancedModuleContractPath,
  loadAdvancedModuleContractRegistry,
  validateAdvancedModuleContractRegistry,
} from "./advanced-module-contract.mjs";
import { loadCourseGraph, projectReaderModules } from "./course-graph.mjs";
import {
  legacyModuleContractAuditRelativePath,
  loadLegacyModuleContractAudit,
  renderLegacyModuleContractAuditReport,
  validateLegacyModuleContractAudit,
} from "./validate-legacy-module-contract-audit.mjs";
import {
  combineModuleContractPacketReports,
  loadLegacyModuleContractPacketRegistry,
  loadModuleContractCandidatePacketRegistry,
  validateLegacyModuleContractPacketRegistry,
  validateModuleContractCandidatePacketRegistry,
} from "./legacy-module-contract-packet.mjs";
import {
  legacyCandidatePreflightProfilesPath,
  loadLegacyCandidatePreflightProfiles,
  validateLegacyCandidatePreflightProfiles,
} from "./legacy-candidate-preflight-profiles.mjs";
import {
  loadReleaseInputPolicy,
  releaseInputPolicyPath,
} from "./release-input-policy.mjs";
import {
  loadReleaseEvidencePolicy,
  releaseEvidencePolicyPath,
} from "./release-evidence-verifier.mjs";
import {
  canonicalReleaseInputText,
  releaseInputSha256,
} from "./release-input-ledger.mjs";
import {
  loadManualLearningRecordWorkflow,
  validateManualLearningRecordWorkflow,
} from "./manual-learning-record-workflow.mjs";
import {
  loadLiveCodexLearningWorkflow,
  validateLiveCodexLearningWorkflow,
} from "./live-codex-learning-workflow.mjs";
import {
  loadModuleCompanionGuides,
  validateModuleCompanionGuides,
} from "./module-companion-guides.mjs";
import {
  loadModuleLearningCompanions,
  validateModuleLearningCompanions,
} from "./module-learning-companion.mjs";
import {
  loadBrowserProgressSurfacePolicy,
  validateBrowserProgressSurfacePolicy,
} from "./browser-progress-surface-policy.mjs";
import {
  loadModuleContractRegistry,
  moduleContractRegistryPath,
  validateModuleContractRegistry,
} from "./module-contract-registry.mjs";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const siteRoot = resolve(scriptDirectory, "..");
const moduleDirectory = resolve(siteRoot, "content", "modules");
const contractPath = moduleContractRegistryPath(siteRoot);
const graphPath = resolve(siteRoot, "content", "course", "course-graph.v2.json");
const synthesisPreviewConversationsPath = resolve(
  siteRoot,
  "content",
  "course",
  "synthesis-preview-conversations.v1.json",
);
const performanceBudgetPolicyPath = resolve(
  siteRoot,
  "content",
  "course",
  "client-performance-budget.v1.json",
);
const manifestPath = resolve(moduleDirectory, "manifest.json");
const moduleContentPath = resolve(moduleDirectory, "module-content.ts");
const releaseInputsPath = resolve(
  siteRoot,
  "content",
  "course",
  "release-inputs.v1.json",
);
const legacyModuleContractAuditPath = resolve(siteRoot, legacyModuleContractAuditRelativePath);
const legacyModuleContractAuditReportPath = resolve(
  siteRoot,
  "docs",
  "LEGACY_MODULE_CONTRACT_AUDIT.md",
);

function moduleNumber(filename) {
  const match = filename.match(/^(\d{2})_.+\.md$/u);
  return match ? Number(match[1]) : null;
}

function moduleSlug(filename) {
  return filename
    .replace(/\.md$/u, "")
    .replaceAll("_", "-")
    .toLowerCase();
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function plainText(value) {
  return value
    .replace(/^>\s*/gmu, "")
    .replace(/!\[([^\]]*)\]\([^)]+\)/gu, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/gu, "$1")
    .replace(/[`*_~]/gu, "")
    .replace(/<[^>]+>/gu, "")
    .replace(/\s+/gu, " ")
    .trim();
}

function firstSubstantialParagraph(markdown) {
  const lines = markdown.split(/\r?\n/u);
  let inFence = false;
  let paragraph = [];

  for (const line of lines.slice(1)) {
    if (/^```/u.test(line.trim())) {
      inFence = !inFence;
      continue;
    }
    if (inFence || /^#{1,6}\s/u.test(line) || /^\s*[-*+]\s/u.test(line)) {
      continue;
    }
    if (line.trim() === "") {
      const candidate = plainText(paragraph.join(" "));
      if (candidate.length >= 80) {
        return candidate.length > 240
          ? `${candidate.slice(0, 237).trimEnd()}…`
          : candidate;
      }
      paragraph = [];
      continue;
    }
    paragraph.push(line.trim().replace(/^>\s*/u, ""));
  }

  return "A connected workbook for reading, reasoning about, and defending this layer of Atlas.";
}

function normalizeNewlines(value) {
  return value.replace(/\r\n?/gu, "\n");
}

async function writeIfChanged(path, content) {
  const normalizedContent = normalizeNewlines(content);
  const current = await readFile(path, "utf8").catch(() => null);
  if (current !== null && normalizeNewlines(current) === normalizedContent) {
    return false;
  }
  await writeFile(path, normalizedContent);
  return true;
}

async function synchronizeCourseStatusSurfaces(courseGraph) {
  const changes = [
    writeIfChanged(
      courseStatusProjectionPath(siteRoot),
      renderCourseStatusProjection(courseGraph),
    ),
  ];
  for (const surfacePath of courseStatusSurfaceRelativePaths) {
    const path = resolve(siteRoot, surfacePath);
    const content = await readFile(path, "utf8");
    changes.push(writeIfChanged(path, applyCourseStatusSummary(content, courseGraph)));
  }
  return Promise.all(changes);
}

async function synchronizeSourceArtifactCopies(sourceArtifactCopies) {
  let changed = 0;
  for (const { canonicalPath, publicPath } of sourceArtifactCopies) {
    await requireFile(canonicalPath, `Canonical source artifact ${repositoryPath(canonicalPath)}`);
    const canonicalSource = await readFile(canonicalPath, "utf8");
    if (await writeIfChanged(publicPath, canonicalSource)) {
      changed += 1;
    }
  }
  return changed;
}

function repositoryPath(path) {
  return relative(siteRoot, path).replaceAll("\\", "/");
}

function compareRepositoryPaths(left, right) {
  const leftPath = repositoryPath(left);
  const rightPath = repositoryPath(right);
  return leftPath < rightPath ? -1 : leftPath > rightPath ? 1 : 0;
}

async function requireFile(path, description) {
  await access(path).catch(() => {
    throw new Error(`${description} is missing: ${repositoryPath(path)}.`);
  });
  const stats = await lstat(path);
  if (!stats.isFile() || stats.isSymbolicLink()) {
    throw new Error(`${description} must be a regular file: ${repositoryPath(path)}.`);
  }
}

async function releaseInputRecord(path) {
  // All current allowlisted course inputs are UTF-8 source, workbook, map, or
  // local teaching-model text. Canonicalize line endings so a Git checkout on
  // Windows produces the same content-provenance ledger as Linux CI.
  const content = canonicalReleaseInputText(await readFile(path, "utf8"));
  return {
    path: repositoryPath(path),
    sha256: releaseInputSha256(content),
  };
}

const courseGraph = await loadCourseGraph();
const courseStatusChanges = await synchronizeCourseStatusSurfaces(courseGraph);
const projectedModules = projectReaderModules(courseGraph);
const graphByNumber = new Map(
  courseGraph.modules.map((courseModule) => [courseModule.number, courseModule]),
);
const filenames = await readdir(moduleDirectory);
const workbooksByNumber = new Map();

for (const filename of filenames) {
  const number = moduleNumber(filename);
  if (number === null) {
    continue;
  }
  const matching = workbooksByNumber.get(number) ?? [];
  matching.push(filename);
  workbooksByNumber.set(number, matching);
}

const modules = [];
const importLines = [];
const contentEntries = [];
const releaseInputPolicy = await loadReleaseInputPolicy(siteRoot);
const releaseEvidencePolicy = await loadReleaseEvidencePolicy(siteRoot);
const manualLearningRecordWorkflow = await loadManualLearningRecordWorkflow(siteRoot);
const manualLearningRecordWorkflowReport = await validateManualLearningRecordWorkflow(
  manualLearningRecordWorkflow,
  { siteRoot },
);
const liveCodexLearningWorkflow = await loadLiveCodexLearningWorkflow(siteRoot);
const liveCodexLearningWorkflowReport = await validateLiveCodexLearningWorkflow(
  liveCodexLearningWorkflow,
  { siteRoot },
);
const moduleCompanionGuides = await loadModuleCompanionGuides(siteRoot);
const moduleCompanionGuidesReport = await validateModuleCompanionGuides(
  moduleCompanionGuides,
  { graph: courseGraph, siteRoot },
);
const moduleLearningCompanions = await loadModuleLearningCompanions(siteRoot);
const moduleLearningCompanionsReport = await validateModuleLearningCompanions(
  moduleLearningCompanions,
  { graph: courseGraph, siteRoot },
);
const browserProgressSurfacePolicy = await loadBrowserProgressSurfacePolicy(siteRoot);
const browserProgressSurfacePolicyReport = await validateBrowserProgressSurfacePolicy(
  browserProgressSurfacePolicy,
  { siteRoot },
);
const legacyModuleContractAudit = await loadLegacyModuleContractAudit(siteRoot);
const legacyModuleContractAuditReport = await validateLegacyModuleContractAudit(
  legacyModuleContractAudit,
  { siteRoot },
);
const legacyCandidatePreflightProfiles = await loadLegacyCandidatePreflightProfiles(siteRoot);
const legacyCandidatePreflightProfilesReport = await validateLegacyCandidatePreflightProfiles(
  legacyCandidatePreflightProfiles,
  { siteRoot },
);
const releaseInputPaths = new Set([
  graphPath,
  synthesisPreviewConversationsPath,
  performanceBudgetPolicyPath,
  contractPath,
  advancedModuleBridgePath(siteRoot),
  advancedModuleContractPath(siteRoot),
  releaseInputPolicyPath(siteRoot),
  releaseEvidencePolicyPath(siteRoot),
  legacyModuleContractAuditPath,
  legacyCandidatePreflightProfilesPath(siteRoot),
]);
releaseInputPaths.add(releaseEvidencePolicy.workflowPath);
const sourceArtifactChanges = await synchronizeSourceArtifactCopies(
  releaseInputPolicy.sourceArtifactCopies,
);
for (const { canonicalPath } of releaseInputPolicy.sourceArtifactCopies) {
  releaseInputPaths.add(canonicalPath);
}
for (const path of manualLearningRecordWorkflowReport.releaseInputPaths) {
  releaseInputPaths.add(path);
}
for (const path of liveCodexLearningWorkflowReport.releaseInputPaths) {
  releaseInputPaths.add(path);
}
for (const path of moduleCompanionGuidesReport.releaseInputPaths) {
  releaseInputPaths.add(path);
}
for (const path of moduleLearningCompanionsReport.releaseInputPaths) {
  releaseInputPaths.add(path);
}
for (const path of browserProgressSurfacePolicyReport.releaseInputPaths) {
  releaseInputPaths.add(path);
}
for (const path of legacyCandidatePreflightProfilesReport.releaseInputPaths) {
  releaseInputPaths.add(path);
}

for (const projectedModule of projectedModules) {
  const candidates = workbooksByNumber.get(projectedModule.number) ?? [];
  if (candidates.length !== 1) {
    throw new Error(
      `Reader-visible Module ${projectedModule.number} must have exactly one checked-in workbook; found ${candidates.length}.`,
    );
  }

  const filename = candidates[0];
  const workbookPath = join(moduleDirectory, filename);
  const graphModule = graphByNumber.get(projectedModule.number);
  if (!graphModule) {
    throw new Error(`Module ${projectedModule.number} is missing from the canonical course graph.`);
  }
  const markdown = normalizeNewlines(await readFile(workbookPath, "utf8"));
  const heading = markdown.match(/^#\s+(.+)$/mu)?.[1]?.trim();
  if (!heading) {
    throw new Error(`${filename} has no level-one title.`);
  }

  const title =
    heading.replace(new RegExp(`^Module\\s+${graphModule.number}\\s+[—–-]\\s*`, "iu"), "").trim() ||
    heading;
  const slug = moduleSlug(filename);
  if (title !== graphModule.title) {
    throw new Error(`Module ${graphModule.number} workbook title does not match the canonical course graph.`);
  }
  if (slug !== graphModule.slug) {
    throw new Error(`Module ${graphModule.number} workbook slug does not match the canonical course graph.`);
  }
  if (!graphModule.sourceMap) {
    throw new Error(`Reader-visible Module ${graphModule.number} must declare a source map.`);
  }
  const sourceMapPath = resolve(siteRoot, graphModule.sourceMap);
  await requireFile(sourceMapPath, `Module ${graphModule.number} source map`);
  releaseInputPaths.add(workbookPath);
  releaseInputPaths.add(sourceMapPath);

  const arc = courseGraph.knowledgeArcs.find(({ id }) => id === graphModule.knowledgeArcId);
  if (!arc) {
    throw new Error(`No knowledge arc is configured for Module ${graphModule.number}.`);
  }
  const variableName = `module${String(graphModule.number).padStart(2, "0")}`;
  importLines.push(`import ${variableName} from "./${filename}?raw";`);
  contentEntries.push(`  "${slug}": ${variableName},`);
  modules.push({
    number: graphModule.number,
    slug,
    filename,
    title,
    summary: firstSubstantialParagraph(markdown),
    arcId: arc.id,
    wordCount: markdown.trim().split(/\s+/u).length,
    estimatedMinutes: graphModule.referenceReadMinutes,
    focusedStudyMinutes: graphModule.focusedStudyMinutes ?? null,
    sourceHash: sha256(markdown),
    id: graphModule.id,
    state: graphModule.state,
    routeRole: graphModule.routeRole,
    routePosition: projectedModule.routePosition,
    masteryGateId: graphModule.masteryGateId,
    sourceMap: graphModule.sourceMap,
    studioId: graphModule.studioId,
    prerequisiteNumbers: projectedModule.prerequisiteNumbers,
    prerequisiteSlugs: projectedModule.prerequisiteSlugs,
    previousRouteNumber: projectedModule.previousRouteNumber,
    previousSlug: projectedModule.previousSlug,
    nextRouteNumber: projectedModule.nextRouteNumber,
    nextSlug: projectedModule.nextSlug,
  });
}

await requireFile(contractPath, "Module contract registry v3");
await requireFile(synthesisPreviewConversationsPath, "Synthesis preview conversations");
await requireFile(performanceBudgetPolicyPath, "Client performance-budget policy");
await requireFile(advancedModuleBridgePath(siteRoot), "Advanced module prerequisite-session bridge");
await requireFile(advancedModuleContractPath(siteRoot), "Lifecycle-aware advanced module contract");
await requireFile(legacyModuleContractAuditPath, "Legacy module-contract audit input");
await requireFile(releaseEvidencePolicy.path, "Release-evidence policy");
await requireFile(releaseEvidencePolicy.workflowPath, "Pinned Course CI workflow");
for (const path of releaseInputPolicy.downloadPaths) {
  await requireFile(path, "Allowlisted local teaching artifact");
  releaseInputPaths.add(path);
}

const manifest = {
  schemaVersion: 5,
  courseGraphSchemaVersion: courseGraph.schemaVersion,
  routePlanId: courseGraph.routePlan.id,
  definedModuleCount: courseGraph.modules.length,
  readerVisibleModuleCount: modules.length,
  legacyOpenModuleCount: modules.filter(
    ({ state }) => state.readerAccess === "full" && state.availability === "legacy-open",
  ).length,
  publishedModuleCount: modules.filter(
    ({ state }) => state.readerAccess === "full" && state.availability === "published",
  ).length,
  previewReaderModuleCount: modules.filter(
    ({ state }) => state.readerAccess === "preview",
  ).length,
  arcs: courseGraph.knowledgeArcs.filter((arc) => modules.some(({ arcId }) => arcId === arc.id)),
  modules,
};
// During a publication promotion, the clean Git index still contains the
// previous manifest until this synchronizer writes the new deterministic
// projection. The narrowly scoped pre-write mode permits only that manifest
// projection; promotion graph, registry, evidence, review, and selector facts
// must still match one clean Git-index snapshot. validate-course.mjs then
// verifies the generated manifest normally after it has been staged.
const advancedModuleContractRegistry = await loadAdvancedModuleContractRegistry(siteRoot);
const advancedModuleContractReport = await validateAdvancedModuleContractRegistry(
  courseGraph,
  advancedModuleContractRegistry,
  {
    siteRoot,
    learnerManifest: manifest,
    learnerReadableModuleIds: projectedModules.map(({ id }) => id),
  },
);
for (const path of advancedModuleContractReport.releaseInputPaths) {
  releaseInputPaths.add(path);
}
const moduleContractRegistry = await loadModuleContractRegistry(siteRoot);
const moduleContractRegistryReport = await validateModuleContractRegistry(
  courseGraph,
  moduleContractRegistry,
  { siteRoot, manifest, manifestTruth: "pre-write-projection" },
);
for (const path of moduleContractRegistryReport.releaseInputPaths) {
  releaseInputPaths.add(path);
}
const [legacyModuleContractPacketRegistry, currentModuleContractCandidatePacketRegistry] = await Promise.all([
  loadLegacyModuleContractPacketRegistry(siteRoot),
  loadModuleContractCandidatePacketRegistry(siteRoot),
]);
const [legacyModuleContractPacketReport, currentModuleContractCandidatePacketReport] = await Promise.all([
  validateLegacyModuleContractPacketRegistry(
    courseGraph,
    legacyModuleContractPacketRegistry,
    { siteRoot },
  ),
  validateModuleContractCandidatePacketRegistry(
    courseGraph,
    currentModuleContractCandidatePacketRegistry,
    { siteRoot },
  ),
]);
const moduleContractPacketCohort = combineModuleContractPacketReports([
  legacyModuleContractPacketReport,
  currentModuleContractCandidatePacketReport,
]);
for (const path of moduleContractPacketCohort.releaseInputPaths) {
  releaseInputPaths.add(path);
}
const generatedModuleContent = `${[
  "/* This file is generated by scripts/sync-modules.mjs. Do not edit by hand. */",
  ...importLines,
  "",
  "export const moduleMarkdownBySlug: Readonly<Record<string, string>> = {",
  ...contentEntries,
  "};",
  "",
].join("\n")}`;
const releaseInputs = {
  schemaVersion: 1,
  generatedBy: "scripts/sync-modules.mjs",
  courseGraphSchemaVersion: courseGraph.schemaVersion,
  contractVersion: "v3",
  inputs: await Promise.all(
    [...releaseInputPaths]
      .sort(compareRepositoryPaths)
      .map(releaseInputRecord),
  ),
};

const changed = await Promise.all([
  writeIfChanged(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`),
  writeIfChanged(moduleContentPath, generatedModuleContent),
  writeIfChanged(releaseInputsPath, `${JSON.stringify(releaseInputs, null, 2)}\n`),
  writeIfChanged(
    legacyModuleContractAuditReportPath,
    renderLegacyModuleContractAuditReport(legacyModuleContractAudit, legacyModuleContractAuditReport),
  ),
]);
console.log(
  `Synced ${modules.length} modules from checked-in content; ${releaseInputs.inputs.length} hashed release inputs (${changed.filter(Boolean).length + courseStatusChanges.filter(Boolean).length + sourceArtifactChanges} generated files updated).`,
);
