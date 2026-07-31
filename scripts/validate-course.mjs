import { access, lstat, readFile, readdir } from "node:fs/promises";
import { execFile } from "node:child_process";
import { dirname, relative, resolve } from "node:path";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import {
  advancedModuleBridgePath,
  loadAdvancedModuleBridgeLedger,
  validateAdvancedModuleBridgeLedger,
} from "./advanced-module-bridge.mjs";
import {
  advancedModuleContractPath,
  loadAdvancedModuleContractRegistry,
  validateAdvancedModuleContractRegistry,
} from "./advanced-module-contract.mjs";
import { loadCourseGraph } from "./course-graph.mjs";
import {
  loadReleaseInputPolicy,
  releaseInputPolicyPath,
} from "./release-input-policy.mjs";
import {
  loadReleaseEvidencePolicy,
  releaseEvidencePolicyPath,
} from "./release-evidence-verifier.mjs";
import {
  loadManualLearningRecordWorkflow,
  manualLearningRecordWorkflowPath,
  validateManualLearningRecordWorkflow,
} from "./manual-learning-record-workflow.mjs";
import {
  liveCodexLearningWorkflowPath,
  loadLiveCodexLearningWorkflow,
  validateLiveCodexLearningWorkflow,
} from "./live-codex-learning-workflow.mjs";
import {
  loadModuleContractEvidenceRegistry,
  validateModuleContractEvidenceRegistry,
} from "./module-contract-evidence.mjs";
import {
  legacyModuleContractAuditRelativePath,
  loadLegacyModuleContractAudit,
  validateLegacyModuleContractAudit,
} from "./validate-legacy-module-contract-audit.mjs";
import {
  loadLegacyModuleContractPacketRegistry,
  validateLegacyModuleContractPacketRegistry,
} from "./legacy-module-contract-packet.mjs";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const siteRoot = resolve(scriptDirectory, "..");
const contractsPath = resolve(
  siteRoot,
  "content",
  "course",
  "contracts",
  "module-contracts.v1.json",
);
const graphPath = resolve(siteRoot, "content", "course", "course-graph.v1.json");
const requiredHumanReviewDimensions = [
  "first-principles-quality",
  "rigor-and-counterexamples",
  "source-claim-correctness",
  "visual-text-equivalent-quality",
  "assessment-explanation-quality",
  "project-evidence-quality",
  "ta-study-partner-usefulness",
  "oral-defense-quality",
];
const execFileAsync = promisify(execFile);

function withinSite(relativePath) {
  const resolved = resolve(siteRoot, relativePath);
  const pathFromRoot = relative(siteRoot, resolved);
  return pathFromRoot !== "" && !pathFromRoot.startsWith("..") && !pathFromRoot.includes(":");
}

function collectSessionNumbers(markdown) {
  return new Set(
    [...markdown.matchAll(/\bSession\s+([1-6])\b/giu)].map((match) => Number(match[1])),
  );
}

function missingSignals(markdown) {
  const signals = [
    ["prediction", /\bpredict(?:ion)?\b/iu],
    ["diagnostic", /\b(diagnostic|understanding check|quiz)\b/iu],
    ["retrieval", /\b(retrieval|spaced review)\b/iu],
    ["project", /\b(project|dossier)\b/iu],
    ["oral defense", /\boral defense\b/iu],
    ["TA", /\bTA\b/u],
    ["Study Partner", /\bStudy Partner\b/iu],
  ];
  return signals
    .filter(([, expression]) => !expression.test(markdown))
    .map(([label]) => label);
}

async function workbookPathFor(courseModule) {
  const moduleDirectory = resolve(siteRoot, "content", "modules");
  const prefix = `${String(courseModule.number).padStart(2, "0")}_`;
  const filenames = await readdir(moduleDirectory);
  const filename = filenames.find((candidate) =>
    candidate.startsWith(prefix) && candidate.endsWith(".md"),
  );
  return filename ? resolve(moduleDirectory, filename) : null;
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

function effectiveHumanReview(contracts, moduleContract) {
  return {
    ...contracts.defaultHumanReview,
    ...(moduleContract.humanReview ?? {}),
  };
}

function validateVerifiedContract(courseModule, moduleContract, review, errors) {
  if (Object.hasOwn(moduleContract, "verification")) {
    errors.push(
      `Module ${courseModule.number} may not use retired free-form verification evidence; it requires a typed contract packet.`,
    );
  }
  if (
    typeof moduleContract.contractPacketId !== "string" ||
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(moduleContract.contractPacketId)
  ) {
    errors.push(`Module ${courseModule.number} is verified without a typed contractPacketId.`);
  }
  for (const dimension of requiredHumanReviewDimensions) {
    if (review[dimension] !== "approved") {
      errors.push(`Module ${courseModule.number} is verified but ${dimension} is not approved.`);
    }
  }
  errors.push(
    `Module ${courseModule.number} verified state requires a separately reviewed typed contract record; current structural packets cannot promote a legacy module.`,
  );
}

export async function loadCourseContracts() {
  return JSON.parse(await readFile(contractsPath, "utf8"));
}

export async function validateCourseContracts(
  graph,
  contracts,
  { strict = false, requireGitTracked = false } = {},
) {
  const errors = [];
  const warnings = [];
  let draftEvidence = null;
  let advancedContract = null;
  let legacyPackets = null;
  let releaseEvidencePolicy = null;
  let manualLearningRecordWorkflow = null;
  let liveCodexLearningWorkflow = null;

  try {
    const legacyAudit = await loadLegacyModuleContractAudit(siteRoot);
    await validateLegacyModuleContractAudit(legacyAudit, { siteRoot });
  } catch (error) {
    errors.push(
      `Legacy module-contract audit must remain a valid canonical evidence inventory: ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  try {
    const packetRegistry = await loadLegacyModuleContractPacketRegistry(siteRoot);
    legacyPackets = await validateLegacyModuleContractPacketRegistry(graph, packetRegistry, {
      siteRoot,
    });
    warnings.push(
      `Legacy contract packets resolved for ${legacyPackets.summary.structuralCandidates} structural candidate module(s); this is not human review or publication evidence.`,
    );
  } catch (error) {
    errors.push(
      `Legacy typed contract-packet gate must remain valid before legacy verification: ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  try {
    const draftRegistry = await loadModuleContractEvidenceRegistry(siteRoot);
    draftEvidence = await validateModuleContractEvidenceRegistry(draftRegistry, { siteRoot });
    warnings.push(
      `Draft v2 evidence pointers resolved for ${draftEvidence.summary.draftPilotModules} pilot module(s); this is not human review or publication evidence.`,
    );
  } catch (error) {
    warnings.push(
      `Draft v2 evidence-pointer lint is informational and unresolved: ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  try {
    const advancedRegistry = await loadAdvancedModuleContractRegistry(siteRoot);
    advancedContract = await validateAdvancedModuleContractRegistry(graph, advancedRegistry, {
      siteRoot,
    });
  } catch (error) {
    errors.push(
      `Lifecycle-aware advanced module contract must remain valid before advanced authoring or publication: ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  try {
    releaseEvidencePolicy = await loadReleaseEvidencePolicy(siteRoot);
  } catch (error) {
    errors.push(
      `Release-evidence policy must remain valid before a CI run can be cited as evidence: ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  try {
    const workflow = await loadManualLearningRecordWorkflow(siteRoot);
    manualLearningRecordWorkflow = await validateManualLearningRecordWorkflow(workflow, {
      siteRoot,
    });
  } catch (error) {
    errors.push(
      `Manual learning record workflow must remain valid before it can be offered as a learner evidence route: ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  try {
    const workflow = await loadLiveCodexLearningWorkflow(siteRoot);
    liveCodexLearningWorkflow = await validateLiveCodexLearningWorkflow(workflow, {
      siteRoot,
    });
  } catch (error) {
    errors.push(
      `Live Codex learning workflow must remain valid before it can be offered as a configured external evidence route: ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  if (contracts?.schemaVersion !== 1 || contracts?.contractVersion !== "v1") {
    errors.push("module contract registry must use schemaVersion 1 and contractVersion v1.");
  }
  if (!Array.isArray(contracts?.modules)) {
    errors.push("module contract registry must define modules.");
    contractError(errors);
  }
  if (!contracts.defaultHumanReview || typeof contracts.defaultHumanReview !== "object") {
    errors.push("module contract registry must define defaultHumanReview.");
  }
  if (!Array.isArray(contracts.legacyBaselineModuleIds)) {
    errors.push("module contract registry must declare legacyBaselineModuleIds.");
  }
  const legacyBaselineIds = new Set(contracts.legacyBaselineModuleIds ?? []);
  if (legacyBaselineIds.size !== (contracts.legacyBaselineModuleIds ?? []).length) {
    errors.push("legacyBaselineModuleIds must not contain duplicates.");
  }
  for (const dimension of requiredHumanReviewDimensions) {
    const status = contracts.defaultHumanReview?.[dimension];
    if (status !== "pending" && status !== "approved") {
      errors.push(`default human-review status for ${dimension} is invalid.`);
    }
  }

  const contractById = new Map();
  for (const moduleContract of contracts.modules) {
    if (!moduleContract?.moduleId || contractById.has(moduleContract.moduleId)) {
      errors.push("module contract IDs must be present and unique.");
      continue;
    }
    if (!new Set(["legacy-baseline", "verified"]).has(moduleContract.publicationState)) {
      errors.push(`contract ${moduleContract.moduleId} has an invalid publicationState.`);
    }
    if (
      moduleContract.publicationState === "legacy-baseline" &&
      !legacyBaselineIds.has(moduleContract.moduleId)
    ) {
      errors.push(
        `Module contract ${moduleContract.moduleId} may not use the legacy contract exception.`,
      );
    }
    contractById.set(moduleContract.moduleId, moduleContract);
  }

  const graphById = new Map(graph.modules.map((courseModule) => [courseModule.id, courseModule]));
  for (const moduleId of contractById.keys()) {
    const courseModule = graphById.get(moduleId);
    if (!courseModule || courseModule.lifecycle !== "published") {
      errors.push(`contract ${moduleId} does not correspond to a published graph module.`);
    } else if (courseModule.number >= 31) {
      errors.push(
        `Module ${courseModule.number} must use the lifecycle-aware advanced contract instead of module-contracts.v1.json.`,
      );
    }
  }

  let legacyBaselineModules = 0;
  let verifiedModules = 0;
  const releaseInputPaths = new Set([
    graphPath,
    contractsPath,
    advancedModuleBridgePath(siteRoot),
    advancedModuleContractPath(siteRoot),
    releaseEvidencePolicyPath(siteRoot),
    manualLearningRecordWorkflowPath(siteRoot),
    liveCodexLearningWorkflowPath(siteRoot),
    resolve(siteRoot, legacyModuleContractAuditRelativePath),
  ]);
  if (advancedContract) {
    for (const path of advancedContract.releaseInputPaths) {
      releaseInputPaths.add(path);
    }
  }
  if (legacyPackets) {
    for (const path of legacyPackets.releaseInputPaths) {
      releaseInputPaths.add(path);
    }
  }
  if (manualLearningRecordWorkflow) {
    for (const path of manualLearningRecordWorkflow.releaseInputPaths) {
      releaseInputPaths.add(path);
    }
  }
  if (liveCodexLearningWorkflow) {
    for (const path of liveCodexLearningWorkflow.releaseInputPaths) {
      releaseInputPaths.add(path);
    }
  }
  if (advancedContract && !advancedContract.legacyBridgeValidationRequired) {
    warnings.push(
      "The M31–M36 prerequisite-session bridge remains retained historical authoring evidence; the lifecycle-aware contract now validates its canonical prerequisite/session topology after an advanced-module lifecycle transition.",
    );
  } else {
    try {
      const bridgeLedger = await loadAdvancedModuleBridgeLedger(siteRoot);
      validateAdvancedModuleBridgeLedger(graph, bridgeLedger);
    } catch (error) {
      errors.push(error instanceof Error ? error.message : String(error));
    }
  }
  for (const courseModule of graph.modules) {
    if (
      courseModule.lifecycle === "published" &&
      courseModule.releaseEvidence.status === "legacy-audit-pending" &&
      !legacyBaselineIds.has(courseModule.id)
    ) {
      errors.push(`Module ${courseModule.number} may not use the legacy contract exception.`);
    }
  }
  for (const courseModule of graph.modules.filter(
    ({ lifecycle, number }) => lifecycle === "published" && number <= 30,
  )) {
    const moduleContract = contractById.get(courseModule.id);
    if (!moduleContract) {
      errors.push(`published Module ${courseModule.number} has no module contract.`);
      continue;
    }
    const review = effectiveHumanReview(contracts, moduleContract);
    const workbookPath = await workbookPathFor(courseModule);
    if (!workbookPath) {
      errors.push(`published Module ${courseModule.number} has no checked-in workbook.`);
      continue;
    }
    const markdown = await readFile(workbookPath, "utf8");
    releaseInputPaths.add(workbookPath);
    const sessions = collectSessionNumbers(markdown);
    for (const sessionNumber of [1, 2, 3, 4, 5, 6]) {
      if (!sessions.has(sessionNumber)) {
        errors.push(`Module ${courseModule.number} is missing Session ${sessionNumber}.`);
      }
    }
    if (!courseModule.sourceMap || !withinSite(courseModule.sourceMap)) {
      errors.push(`published Module ${courseModule.number} lacks a repository-local source map.`);
    } else {
      const sourceMapPath = resolve(siteRoot, courseModule.sourceMap);
      releaseInputPaths.add(sourceMapPath);
      await access(sourceMapPath).catch(() => {
        errors.push(`Module ${courseModule.number} source map is missing from the repository.`);
      });
    }
    if (courseModule.forwardModuleNumber === null && courseModule.number !== 26) {
      errors.push(`Module ${courseModule.number} lacks a forward handoff in the canonical graph.`);
    }

    if (moduleContract.publicationState === "legacy-baseline") {
      if (!legacyBaselineIds.has(courseModule.id)) {
        errors.push(`Module ${courseModule.number} may not use the legacy contract exception.`);
      }
      if (courseModule.releaseEvidence.status !== "legacy-audit-pending") {
        errors.push(`Module ${courseModule.number} has a legacy contract state but non-legacy release evidence.`);
      }
      legacyBaselineModules += 1;
      warnings.push(
        `Module ${courseModule.number} passed structural checks; human review remains pending before verified publication evidence.`,
      );
    }
    if (moduleContract.publicationState === "verified") {
      verifiedModules += 1;
      if (courseModule.releaseEvidence.status !== "verified") {
        errors.push(`Module ${courseModule.number} has a verified contract but unverified release evidence.`);
      }
      validateVerifiedContract(courseModule, moduleContract, review, errors);
    }

    const missing = missingSignals(markdown);
    if (missing.length > 0) {
      warnings.push(
        `Module ${courseModule.number} needs explicit contract evidence for: ${missing.join(", ")}.`,
      );
    }
  }

  if (strict && legacyBaselineModules > 0) {
    errors.push(
      `${legacyBaselineModules} legacy baseline module(s) cannot pass strict release validation.`,
    );
  }

  if (requireGitTracked) {
    let releaseInputPolicy;
    try {
      releaseInputPolicy = await loadReleaseInputPolicy(siteRoot);
    } catch (error) {
      errors.push(error.message);
    }
    if (releaseInputPolicy) {
      releaseInputPaths.add(releaseInputPolicyPath(siteRoot));
      for (const path of releaseInputPolicy.downloadPaths) {
        releaseInputPaths.add(path);
      }

      const allowedDownloadPaths = new Set(
        releaseInputPolicy.downloadPaths.map((path) => relative(siteRoot, path).replaceAll("\\", "/")),
      );
      for (const trackedPath of await trackedPaths("public/downloads")) {
        if (!allowedDownloadPaths.has(trackedPath)) {
          errors.push(
            `tracked public teaching artifact is absent from the release-input allowlist: ${trackedPath}.`,
          );
        }
      }
    }
    if (releaseEvidencePolicy) {
      await validateTrackedRegularFiles([releaseEvidencePolicy.workflowPath], errors, {
        label: "pinned Course CI workflow",
      });
    }
    await validateTrackedRegularFiles(releaseInputPaths, errors);
  }

  contractError(errors);
  return {
    errors,
    warnings,
    draftEvidence,
    advancedContract,
    legacyPackets,
    summary: {
      legacyBaselineModules,
      verifiedModules,
      authoringOnlyModules: graph.modules.filter(
        ({ lifecycle }) => lifecycle === "authoring-only",
      ).length,
    },
  };
}

export async function runCourseValidation({ strict = false, requireGitTracked = false } = {}) {
  const [graph, contracts] = await Promise.all([
    loadCourseGraph(),
    loadCourseContracts(),
  ]);
  return validateCourseContracts(graph, contracts, { strict, requireGitTracked });
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const report = await runCourseValidation({
    strict: process.argv.includes("--strict"),
    requireGitTracked: process.argv.includes("--require-git-tracked"),
  });
  console.log(
    `Course contract: ${report.summary.legacyBaselineModules} legacy baselines, ${report.summary.verifiedModules} verified, ${report.summary.authoringOnlyModules} authoring-only; ${report.advancedContract?.summary.authoringOnlyContracts ?? 0} lifecycle-aware advanced authoring contract(s).`,
  );
  for (const warning of report.warnings) {
    console.warn(`warning: ${warning}`);
  }
}
