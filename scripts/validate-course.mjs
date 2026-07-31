import { execFile } from "node:child_process";
import { lstat } from "node:fs/promises";
import { dirname, relative, resolve } from "node:path";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import {
  loadAdvancedModuleContractRegistry,
  validateAdvancedModuleContractRegistry,
} from "./advanced-module-contract.mjs";
import { loadCourseGraph } from "./course-graph.mjs";
import {
  loadLegacyModuleContractPacketRegistry,
  validateLegacyModuleContractPacketRegistry,
} from "./legacy-module-contract-packet.mjs";
import {
  loadLiveCodexLearningWorkflow,
  liveCodexLearningWorkflowPath,
  validateLiveCodexLearningWorkflow,
} from "./live-codex-learning-workflow.mjs";
import {
  loadModuleCompanionGuides,
  moduleCompanionGuidesPath,
  validateModuleCompanionGuides,
} from "./module-companion-guides.mjs";
import {
  loadManualLearningRecordWorkflow,
  manualLearningRecordWorkflowPath,
  validateManualLearningRecordWorkflow,
} from "./manual-learning-record-workflow.mjs";
import {
  loadModuleContractEvidenceRegistry,
  validateModuleContractEvidenceRegistry,
} from "./module-contract-evidence.mjs";
import {
  loadModuleContractRegistry,
  moduleContractRegistryPath,
  validateModuleContractRegistry,
} from "./module-contract-registry.mjs";
import {
  browserProgressSurfacePolicyPath,
  loadBrowserProgressSurfacePolicy,
  validateBrowserProgressSurfacePolicy,
} from "./browser-progress-surface-policy.mjs";
import {
  loadReleaseEvidencePolicy,
  releaseEvidencePolicyPath,
} from "./release-evidence-verifier.mjs";
import {
  loadReleaseInputPolicy,
  releaseInputPolicyPath,
} from "./release-input-policy.mjs";
import { validateReaderMermaidAlternatives } from "./validate-mermaid-alternatives.mjs";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const siteRoot = resolve(scriptDirectory, "..");
const graphPath = resolve(siteRoot, "content", "course", "course-graph.v2.json");
const execFileAsync = promisify(execFile);

function withinSite(relativePath) {
  const resolved = resolve(siteRoot, relativePath);
  const pathFromRoot = relative(siteRoot, resolved);
  return pathFromRoot !== "" && !pathFromRoot.startsWith("..") && !pathFromRoot.includes(":");
}

async function trackedPaths(pathspec) {
  const { stdout } = await execFileAsync("git", ["ls-files", "-z", "--", pathspec], {
    cwd: siteRoot,
  });
  return stdout
    .split("\0")
    .filter(Boolean)
    .map((path) => path.replaceAll("\\", "/"));
}

async function validateTrackedRegularFiles(paths, errors, { label = "release input" } = {}) {
  for (const path of paths) {
    const repositoryPath = relative(siteRoot, path).replaceAll("\\", "/");
    if (!withinSite(repositoryPath)) {
      errors.push(`${label} escapes the repository: ${repositoryPath}.`);
      continue;
    }
    const stats = await lstat(path).catch(() => null);
    if (!stats || !stats.isFile() || stats.isSymbolicLink()) {
      errors.push(`${label} must be a regular checked-in file: ${repositoryPath}.`);
      continue;
    }
    await execFileAsync("git", ["ls-files", "--error-unmatch", "--", repositoryPath], {
      cwd: siteRoot,
    }).catch(() => {
      errors.push(`${label} is not tracked by Git: ${repositoryPath}.`);
    });
  }
}

function contractError(errors) {
  if (errors.length > 0) {
    throw new Error(`Course contract validation failed:\n- ${errors.join("\n- ")}`);
  }
}

// Compatibility name for integrations that previously loaded the legacy v1
// registry. The active course validator now reads only the unified v3 source.
export async function loadCourseContracts() {
  return loadModuleContractRegistry(siteRoot);
}

export async function validateCourseContracts(
  graph,
  registry,
  { strict = false, complete = false, requireGitTracked = false } = {},
) {
  const errors = [];
  const warnings = [];
  let contractRegistry = null;
  let advancedContract = null;
  let legacyPackets = null;
  let draftEvidence = null;
  let releaseEvidencePolicy = null;
  let manualLearningRecordWorkflow = null;
  let liveCodexLearningWorkflow = null;
  let moduleCompanionGuides = null;
  let browserProgressSurfacePolicy = null;
  let mermaidAlternatives = null;
  const releaseInputPaths = new Set([
    graphPath,
    moduleContractRegistryPath(siteRoot),
    releaseInputPolicyPath(siteRoot),
    releaseEvidencePolicyPath(siteRoot),
    manualLearningRecordWorkflowPath(siteRoot),
    liveCodexLearningWorkflowPath(siteRoot),
    moduleCompanionGuidesPath(siteRoot),
    browserProgressSurfacePolicyPath(siteRoot),
  ]);

  try {
    contractRegistry = await validateModuleContractRegistry(graph, registry, {
      siteRoot,
      mode: complete ? "complete" : strict ? "strict" : "integrity",
    });
    for (const path of contractRegistry.releaseInputPaths) {
      releaseInputPaths.add(path);
    }
  } catch (error) {
    errors.push(
      `Unified v3 module-contract registry must validate: ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  try {
    const packetRegistry = await loadLegacyModuleContractPacketRegistry(siteRoot);
    legacyPackets = await validateLegacyModuleContractPacketRegistry(graph, packetRegistry, {
      siteRoot,
    });
    for (const path of legacyPackets.releaseInputPaths) {
      releaseInputPaths.add(path);
    }
    warnings.push(
      `Legacy contract packets resolved for ${legacyPackets.summary.structuralCandidates} structural candidate module(s); this is not human review or publication evidence.`,
    );
  } catch (error) {
    errors.push(
      `Legacy typed contract-packet migration adapter must remain valid: ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  try {
    draftEvidence = await validateModuleContractEvidenceRegistry(
      await loadModuleContractEvidenceRegistry(siteRoot),
      { siteRoot },
    );
    warnings.push(
      `Draft v2 evidence pointers resolved for ${draftEvidence.summary.draftPilotModules} pilot module(s); this is not human review or publication evidence.`,
    );
  } catch (error) {
    warnings.push(
      `Draft v2 evidence-pointer lint is informational and unresolved: ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  try {
    advancedContract = await validateAdvancedModuleContractRegistry(
      graph,
      await loadAdvancedModuleContractRegistry(siteRoot),
      { siteRoot },
    );
    for (const path of advancedContract.releaseInputPaths) {
      releaseInputPaths.add(path);
    }
  } catch (error) {
    errors.push(
      `Lifecycle-aware advanced module contract must remain valid before advanced authoring or publication: ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  try {
    releaseEvidencePolicy = await loadReleaseEvidencePolicy(siteRoot);
    releaseInputPaths.add(releaseEvidencePolicy.path);
    releaseInputPaths.add(releaseEvidencePolicy.workflowPath);
  } catch (error) {
    errors.push(
      `Release-evidence policy must remain valid before a CI run can be cited as evidence: ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  try {
    manualLearningRecordWorkflow = await validateManualLearningRecordWorkflow(
      await loadManualLearningRecordWorkflow(siteRoot),
      { siteRoot },
    );
    for (const path of manualLearningRecordWorkflow.releaseInputPaths) {
      releaseInputPaths.add(path);
    }
  } catch (error) {
    errors.push(
      `Manual learning record workflow must remain valid before it can be offered as a learner evidence route: ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  try {
    liveCodexLearningWorkflow = await validateLiveCodexLearningWorkflow(
      await loadLiveCodexLearningWorkflow(siteRoot),
      { siteRoot },
    );
    for (const path of liveCodexLearningWorkflow.releaseInputPaths) {
      releaseInputPaths.add(path);
    }
  } catch (error) {
    errors.push(
      `Live Codex learning workflow must remain valid before it can be offered as a configured external evidence route: ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  try {
    moduleCompanionGuides = await validateModuleCompanionGuides(
      await loadModuleCompanionGuides(siteRoot),
      { graph, siteRoot },
    );
    for (const path of moduleCompanionGuides.releaseInputPaths) {
      releaseInputPaths.add(path);
    }
  } catch (error) {
    errors.push(
      `Module companion guides must remain graph-bound before a module-specific Codex brief can be offered: ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  try {
    browserProgressSurfacePolicy = await validateBrowserProgressSurfacePolicy(
      await loadBrowserProgressSurfacePolicy(siteRoot),
      { siteRoot },
    );
    for (const path of browserProgressSurfacePolicy.releaseInputPaths) {
      releaseInputPaths.add(path);
    }
  } catch (error) {
    errors.push(
      `Browser-progress surface policy must remain valid before a learner studio can retain local evidence: ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  try {
    mermaidAlternatives = await validateReaderMermaidAlternatives({
      siteRoot,
      requireComplete: complete,
    });
    if (mermaidAlternatives.summary.incompleteBlocks > 0) {
      warnings.push(
        `${mermaidAlternatives.summary.incompleteBlocks} Mermaid visual(s) lack complete authored text alternatives; these cannot satisfy a future promotion review.`,
      );
    }
  } catch (error) {
    errors.push(
      `Reader Mermaid text alternatives must validate before a complete-course claim: ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  if (contractRegistry) {
    for (const manifestModule of contractRegistry.manifest.modules) {
      releaseInputPaths.add(resolve(siteRoot, "content", "modules", manifestModule.filename));
      if (manifestModule.sourceMap) releaseInputPaths.add(resolve(siteRoot, manifestModule.sourceMap));
    }
    if (contractRegistry.summary.legacyBaselineModules > 0) {
      warnings.push(
        `${contractRegistry.summary.legacyBaselineModules} legacy baseline module(s) remain structurally mapped but are not contract-verified.`,
      );
    }
  }

  if (requireGitTracked) {
    try {
      const policy = await loadReleaseInputPolicy(siteRoot);
      for (const path of policy.downloadPaths) releaseInputPaths.add(path);
      const allowedDownloads = new Set(
        policy.downloadPaths.map((path) => relative(siteRoot, path).replaceAll("\\", "/")),
      );
      for (const trackedPath of await trackedPaths("public/downloads")) {
        if (!allowedDownloads.has(trackedPath)) {
          errors.push(
            `tracked public teaching artifact is absent from the release-input allowlist: ${trackedPath}.`,
          );
        }
      }
    } catch (error) {
      errors.push(error instanceof Error ? error.message : String(error));
    }
    await validateTrackedRegularFiles(releaseInputPaths, errors);
  }

  contractError(errors);
  return {
    errors,
    warnings,
    contractRegistry,
    advancedContract,
    legacyPackets,
    draftEvidence,
    manualLearningRecordWorkflow,
    liveCodexLearningWorkflow,
    moduleCompanionGuides,
    browserProgressSurfacePolicy,
    mermaidAlternatives,
    summary: contractRegistry.summary,
  };
}

export async function runCourseValidation({ strict = false, complete = false, requireGitTracked = false } = {}) {
  const [graph, contracts] = await Promise.all([loadCourseGraph(), loadCourseContracts()]);
  return validateCourseContracts(graph, contracts, { strict, complete, requireGitTracked });
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const report = await runCourseValidation({
    strict: process.argv.includes("--strict"),
    complete: process.argv.includes("--complete"),
    requireGitTracked: process.argv.includes("--require-git-tracked"),
  });
  console.log(
    `Course contract v3: ${report.summary.legacyBaselineModules} legacy baselines, ${report.summary.verifiedModules} verified, ${report.summary.authoringOnlyModules} authoring-only, ${report.summary.reviewReadyModules} review-ready.`,
  );
  for (const warning of report.warnings) {
    console.warn(`warning: ${warning}`);
  }
}
