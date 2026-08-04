import { execFile } from "node:child_process";
import { lstat } from "node:fs/promises";
import { dirname, relative, resolve } from "node:path";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import {
  loadAdvancedModuleContractRegistry,
  validateAdvancedModuleContractRegistry,
} from "./advanced-module-contract.mjs";
import { loadCourseGraph, validateCourseGraph } from "./course-graph.mjs";
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
  loadModuleLearningCompanions,
  validateModuleLearningCompanions,
} from "./module-learning-companion.mjs";
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
import { validateCourseStatusProjection } from "./course-status-projection.mjs";
import {
  loadReleaseEvidencePolicy,
  releaseEvidencePolicyPath,
} from "./release-evidence-verifier.mjs";
import {
  loadReleaseInputPolicy,
  releaseInputPolicyPath,
} from "./release-input-policy.mjs";
import {
  assertGitIndexSnapshotForSiteRoot,
  GitIndexSnapshotError,
  isolatedGitEnvironment,
  openGitIndexSnapshot,
} from "./git-index-snapshot.mjs";
import { validateReleaseInputLedger } from "./release-input-ledger.mjs";
import { validateReaderMermaidAlternatives } from "./validate-mermaid-alternatives.mjs";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const siteRoot = resolve(scriptDirectory, "..");
const canonicalCourseGraphRelativePath = "content/course/course-graph.v2.json";
const synthesisPreviewConversationsRelativePath =
  "content/course/synthesis-preview-conversations.v1.json";
const execFileAsync = promisify(execFile);

function courseGraphPathFor(root) {
  return resolve(root, canonicalCourseGraphRelativePath);
}

function synthesisPreviewConversationsPathFor(root) {
  return resolve(root, synthesisPreviewConversationsRelativePath);
}

function performanceBudgetPolicyPathFor(root) {
  return resolve(root, "content", "course", "client-performance-budget.v1.json");
}

function withinSite(root, relativePath) {
  const resolved = resolve(root, relativePath);
  const pathFromRoot = relative(root, resolved);
  return pathFromRoot !== "" && !pathFromRoot.startsWith("..") && !pathFromRoot.includes(":");
}

async function trackedPaths(root, pathspec) {
  const { stdout } = await execFileAsync("git", ["ls-files", "-z", "--", pathspec], {
    cwd: root,
    env: isolatedGitEnvironment(),
  });
  return stdout
    .split("\0")
    .filter(Boolean)
    .map((path) => path.replaceAll("\\", "/"));
}

async function validateTrackedRegularFiles(root, paths, errors, { label = "release input" } = {}) {
  for (const path of paths) {
    const repositoryPath = relative(root, path).replaceAll("\\", "/");
    if (!withinSite(root, repositoryPath)) {
      errors.push(`${label} escapes the repository: ${repositoryPath}.`);
      continue;
    }
    const stats = await lstat(path).catch(() => null);
    if (!stats || !stats.isFile() || stats.isSymbolicLink()) {
      errors.push(`${label} must be a regular checked-in file: ${repositoryPath}.`);
      continue;
    }
    await execFileAsync("git", ["ls-files", "--error-unmatch", "--", repositoryPath], {
      cwd: root,
      env: isolatedGitEnvironment(),
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

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
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

function canonicalGraphForSnapshotComparison(graph) {
  if (!isPlainObject(graph)) return graph;
  // loadCourseGraph intentionally adds these reader-facing derived values.
  // They are not serialized canonical facts and therefore are not compared to
  // the raw Git-index JSON source.
  const canonicalGraph = { ...graph };
  delete canonicalGraph.routePlan;
  delete canonicalGraph.sequence;
  return canonicalGraph;
}

// Compatibility name for integrations that previously loaded the legacy v1
// registry. The active course validator now reads only the unified v3 source.
export async function loadCourseContracts() {
  return loadModuleContractRegistry(siteRoot);
}

export async function validateCourseContracts(
  graph,
  registry,
  {
    strict = false,
    complete = false,
    requireGitTracked = false,
    snapshot: suppliedSnapshot = null,
    siteRoot: requestedSiteRoot = null,
  } = {},
) {
  const validationSiteRoot = requestedSiteRoot ?? siteRoot;
  let validationGraph = graph;
  let validationRegistry = registry;
  const errors = [];
  const warnings = [];
  let contractRegistry = null;
  let advancedContract = null;
  let legacyPackets = null;
  let currentCandidatePackets = null;
  let candidatePackets = null;
  let legacyCandidatePreflightProfiles = null;
  let draftEvidence = null;
  let releaseEvidencePolicy = null;
  let manualLearningRecordWorkflow = null;
  let liveCodexLearningWorkflow = null;
  let moduleCompanionGuides = null;
  let moduleLearningCompanions = null;
  let browserProgressSurfacePolicy = null;
  let courseStatusProjection = null;
  let mermaidAlternatives = null;
  let releaseInputLedger = null;
  let provenanceSnapshot = null;
  let provenanceSourceReady = false;
  const releaseInputPaths = new Set([
    courseGraphPathFor(validationSiteRoot),
    resolve(validationSiteRoot, "content", "course", "goal-compliance.v1.json"),
    synthesisPreviewConversationsPathFor(validationSiteRoot),
    performanceBudgetPolicyPathFor(validationSiteRoot),
    moduleContractRegistryPath(validationSiteRoot),
    releaseInputPolicyPath(validationSiteRoot),
    releaseEvidencePolicyPath(validationSiteRoot),
    resolve(
      validationSiteRoot,
      "content",
      "course",
      "contracts",
      "m26-preview-contract-packet.v1.json",
    ),
    resolve(validationSiteRoot, "content", "course", "reference-models", "module26_reference.py"),
    resolve(
      validationSiteRoot,
      "content",
      "course",
      "reference-models",
      "test_module26_reference.py",
    ),
    legacyCandidatePreflightProfilesPath(validationSiteRoot),
    manualLearningRecordWorkflowPath(validationSiteRoot),
    liveCodexLearningWorkflowPath(validationSiteRoot),
    moduleCompanionGuidesPath(validationSiteRoot),
    browserProgressSurfacePolicyPath(validationSiteRoot),
  ]);

  if (requireGitTracked) {
    try {
      provenanceSnapshot = suppliedSnapshot ?? await openGitIndexSnapshot(validationSiteRoot);
      await assertGitIndexSnapshotForSiteRoot(provenanceSnapshot, validationSiteRoot);
      await provenanceSnapshot.assertAllClean();
      const registryPath = relative(
        validationSiteRoot,
        moduleContractRegistryPath(validationSiteRoot),
      ).replaceAll("\\", "/");
      const [capturedGraph, capturedRegistry] = await Promise.all([
        provenanceSnapshot.readJson(canonicalCourseGraphRelativePath),
        provenanceSnapshot.readJson(registryPath),
      ]);
      if (!sameJsonValue(canonicalGraphForSnapshotComparison(graph), capturedGraph.value)) {
        errors.push("supplied graph must match its captured Git-index graph.");
      }
      if (!sameJsonValue(registry, capturedRegistry.value)) {
        errors.push("supplied registry must match its captured Git-index registry.");
      }
      // A checked-in result is an assertion about the captured Git-index JSON,
      // never about mutable caller-owned objects that merely compared equal.
      validationGraph = capturedGraph.value;
      validationRegistry = capturedRegistry.value;
      provenanceSourceReady = true;
    } catch (error) {
      const errorCode = error instanceof GitIndexSnapshotError ? ` (${error.code})` : "";
      errors.push(
        `Checked-in course validation requires one clean captured Git-index workspace${errorCode}: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
    if (!provenanceSourceReady) contractError(errors);
  }

  try {
    contractRegistry = await validateModuleContractRegistry(validationGraph, validationRegistry, {
      siteRoot: validationSiteRoot,
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
    const packetRegistry = await loadLegacyModuleContractPacketRegistry(validationSiteRoot);
    legacyPackets = await validateLegacyModuleContractPacketRegistry(validationGraph, packetRegistry, {
      siteRoot: validationSiteRoot,
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
    const packetRegistry = await loadModuleContractCandidatePacketRegistry(validationSiteRoot);
    currentCandidatePackets = await validateModuleContractCandidatePacketRegistry(
      validationGraph,
      packetRegistry,
      { siteRoot: validationSiteRoot },
    );
    for (const path of currentCandidatePackets.releaseInputPaths) {
      releaseInputPaths.add(path);
    }
    warnings.push(
      `Current contract packets resolved for ${currentCandidatePackets.summary.structuralCandidates} structural candidate module(s); this is not human review or publication evidence.`,
    );
  } catch (error) {
    errors.push(
      `Current typed contract-packet cohort must remain valid as non-promoting structural evidence: ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  if (legacyPackets && currentCandidatePackets) {
    try {
      candidatePackets = combineModuleContractPacketReports([
        legacyPackets,
        currentCandidatePackets,
      ]);
      for (const path of candidatePackets.releaseInputPaths) {
        releaseInputPaths.add(path);
      }
    } catch (error) {
      errors.push(
        `Candidate packet cohorts must not shadow module or packet identities: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  try {
    const profileRegistry = requireGitTracked
      ? (
        await provenanceSnapshot.readJson(
          relative(
            validationSiteRoot,
            legacyCandidatePreflightProfilesPath(validationSiteRoot),
          ).replaceAll("\\", "/"),
        )
      ).value
      : await loadLegacyCandidatePreflightProfiles(validationSiteRoot);
    legacyCandidatePreflightProfiles = await validateLegacyCandidatePreflightProfiles(
      profileRegistry,
      {
        siteRoot: validationSiteRoot,
        snapshot: requireGitTracked ? provenanceSnapshot : null,
      },
    );
    for (const path of legacyCandidatePreflightProfiles.releaseInputPaths) {
      releaseInputPaths.add(path);
    }
    warnings.push(
      `Candidate preflight profiles resolved for ${legacyCandidatePreflightProfiles.candidateByModuleId.size} structural candidate module(s); this is not human review or publication evidence.`,
    );
  } catch (error) {
    errors.push(
      `Legacy candidate preflight-profile registry must remain valid as non-promoting structural evidence: ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  try {
    draftEvidence = await validateModuleContractEvidenceRegistry(
      await loadModuleContractEvidenceRegistry(validationSiteRoot),
      { siteRoot: validationSiteRoot },
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
      validationGraph,
      await loadAdvancedModuleContractRegistry(validationSiteRoot),
      { siteRoot: validationSiteRoot },
    );
    for (const path of advancedContract.releaseInputPaths) {
      releaseInputPaths.add(path);
    }
  } catch (error) {
    errors.push(
      `Retained advanced authoring adapter must remain valid as checked-in authoring evidence: ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  try {
    releaseEvidencePolicy = await loadReleaseEvidencePolicy(validationSiteRoot);
    releaseInputPaths.add(releaseEvidencePolicy.path);
    releaseInputPaths.add(releaseEvidencePolicy.workflowPath);
  } catch (error) {
    errors.push(
      `Release-evidence policy must remain valid before a CI run can be cited as evidence: ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  try {
    manualLearningRecordWorkflow = await validateManualLearningRecordWorkflow(
      await loadManualLearningRecordWorkflow(validationSiteRoot),
      { siteRoot: validationSiteRoot },
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
      await loadLiveCodexLearningWorkflow(validationSiteRoot),
      { siteRoot: validationSiteRoot },
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
      await loadModuleCompanionGuides(validationSiteRoot),
      { graph: validationGraph, siteRoot: validationSiteRoot },
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
    moduleLearningCompanions = await validateModuleLearningCompanions(
      await loadModuleLearningCompanions(validationSiteRoot),
      { graph: validationGraph, siteRoot: validationSiteRoot },
    );
    for (const path of moduleLearningCompanions.releaseInputPaths) {
      releaseInputPaths.add(path);
    }
  } catch (error) {
    errors.push(
      `Module-scoped learning companions must validate before future review-ready promotion: ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  try {
    browserProgressSurfacePolicy = await validateBrowserProgressSurfacePolicy(
      await loadBrowserProgressSurfacePolicy(validationSiteRoot),
      { siteRoot: validationSiteRoot },
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
    courseStatusProjection = await validateCourseStatusProjection(validationGraph, {
      siteRoot: validationSiteRoot,
    });
  } catch (error) {
    errors.push(
      `Generated course-status projection and status surfaces must match the canonical graph: ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  try {
    mermaidAlternatives = await validateReaderMermaidAlternatives({
      siteRoot: validationSiteRoot,
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
      releaseInputPaths.add(resolve(validationSiteRoot, "content", "modules", manifestModule.filename));
      if (manifestModule.sourceMap) releaseInputPaths.add(resolve(validationSiteRoot, manifestModule.sourceMap));
    }
    if (contractRegistry.summary.legacyBaselineModules > 0) {
      warnings.push(
        `${contractRegistry.summary.legacyBaselineModules} legacy baseline module(s) remain structurally mapped but are not contract-verified.`,
      );
    }
  }

  if (requireGitTracked) {
    try {
      const policy = await loadReleaseInputPolicy(validationSiteRoot);
      for (const path of policy.downloadPaths) releaseInputPaths.add(path);
      const allowedDownloads = new Set(
        policy.downloadPaths.map((path) => relative(validationSiteRoot, path).replaceAll("\\", "/")),
      );
      for (const trackedPath of await trackedPaths(validationSiteRoot, "public/downloads")) {
        if (!allowedDownloads.has(trackedPath)) {
          errors.push(
            `tracked public teaching artifact is absent from the release-input allowlist: ${trackedPath}.`,
          );
        }
      }
    } catch (error) {
      errors.push(error instanceof Error ? error.message : String(error));
    }
    await validateTrackedRegularFiles(validationSiteRoot, releaseInputPaths, errors);
    try {
      if (!provenanceSnapshot) {
        throw new Error("Checked-in course validation could not retain its captured Git-index snapshot.");
      }
      await provenanceSnapshot.assertAllClean();
      releaseInputLedger = await validateReleaseInputLedger({
        siteRoot: validationSiteRoot,
        snapshot: provenanceSnapshot,
        requiredInputPaths: [...releaseInputPaths],
        expectedCourseGraphSchemaVersion: validationGraph.schemaVersion,
        expectedContractVersion: "v3",
      });
    } catch (error) {
      errors.push(
        `Release-input ledger must bind every allowlisted course input to one clean Git-index snapshot: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  contractError(errors);
  return {
    errors,
    warnings,
    contractRegistry,
    advancedContract,
    legacyPackets,
    currentCandidatePackets,
    candidatePackets,
    legacyCandidatePreflightProfiles,
    draftEvidence,
    manualLearningRecordWorkflow,
    liveCodexLearningWorkflow,
    moduleCompanionGuides,
    moduleLearningCompanions,
    browserProgressSurfacePolicy,
    courseStatusProjection,
    mermaidAlternatives,
    releaseInputLedger,
    summary: contractRegistry.summary,
  };
}

export async function runCourseValidation({ strict = false, complete = false, requireGitTracked = false } = {}) {
  if (!requireGitTracked) {
    const [graph, contracts] = await Promise.all([loadCourseGraph(), loadCourseContracts()]);
    return validateCourseContracts(graph, contracts, { strict, complete, requireGitTracked });
  }

  const snapshot = await openGitIndexSnapshot(siteRoot);
  await snapshot.assertAllClean();
  const registryPath = relative(siteRoot, moduleContractRegistryPath(siteRoot)).replaceAll("\\", "/");
  await snapshot.assertClean([canonicalCourseGraphRelativePath, registryPath]);
  const [graphRecord, registryRecord] = await Promise.all([
    snapshot.readJson(canonicalCourseGraphRelativePath),
    snapshot.readJson(registryPath),
  ]);
  validateCourseGraph(graphRecord.value);
  return validateCourseContracts(graphRecord.value, registryRecord.value, {
    strict,
    complete,
    requireGitTracked,
    snapshot,
  });
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
