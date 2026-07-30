import { access, lstat, readFile, readdir } from "node:fs/promises";
import { execFile } from "node:child_process";
import { dirname, relative, resolve } from "node:path";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import { loadCourseGraph } from "./course-graph.mjs";
import {
  loadReleaseInputPolicy,
  releaseInputPolicyPath,
} from "./release-input-policy.mjs";

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
const requiredVerifiedEvidence = [
  "prerequisiteAndForwardMap",
  "sessionAnchors",
  "sourceLedger",
  "visualTextAlternatives",
  "diagnosticAndRetrieval",
  "projectEvidence",
  "oralDefense",
  "taPrompt",
  "studyPartnerPrompt",
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

async function validateTrackedRegularFiles(paths, errors) {
  for (const path of paths) {
    const repositoryPath = relative(siteRoot, path).replaceAll("\\", "/");
    if (!withinSite(repositoryPath)) {
      errors.push(`release input escapes the repository: ${repositoryPath}.`);
      continue;
    }
    const stats = await lstat(path).catch(() => null);
    if (!stats || !stats.isFile() || stats.isSymbolicLink()) {
      errors.push(`release input must be a regular checked-in file: ${repositoryPath}.`);
      continue;
    }
    await execFileAsync("git", ["ls-files", "--error-unmatch", "--", repositoryPath], {
      cwd: siteRoot,
    }).catch(() => {
      errors.push(`release input is not tracked by Git: ${repositoryPath}.`);
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
  const verification = moduleContract.verification;
  if (!verification || typeof verification !== "object") {
    errors.push(`Module ${courseModule.number} is verified without a verification record.`);
    return;
  }
  for (const key of requiredVerifiedEvidence) {
    const value = verification[key];
    if (typeof value !== "string" || value.trim() === "") {
      errors.push(`Module ${courseModule.number} verified evidence ${key} is missing.`);
    }
  }
  for (const dimension of requiredHumanReviewDimensions) {
    if (review[dimension] !== "approved") {
      errors.push(`Module ${courseModule.number} is verified but ${dimension} is not approved.`);
    }
  }
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
    }
  }

  let legacyBaselineModules = 0;
  let verifiedModules = 0;
  const releaseInputPaths = new Set([graphPath, contractsPath]);
  for (const courseModule of graph.modules.filter(
    ({ lifecycle }) => lifecycle === "published",
  )) {
    if (
      courseModule.releaseEvidence.status === "legacy-audit-pending" &&
      !legacyBaselineIds.has(courseModule.id)
    ) {
      errors.push(`Module ${courseModule.number} may not use the legacy contract exception.`);
    }
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
    await validateTrackedRegularFiles(releaseInputPaths, errors);
  }

  contractError(errors);
  return {
    errors,
    warnings,
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
    `Course contract: ${report.summary.legacyBaselineModules} legacy baselines, ${report.summary.verifiedModules} verified, ${report.summary.authoringOnlyModules} authoring-only.`,
  );
  for (const warning of report.warnings) {
    console.warn(`warning: ${warning}`);
  }
}
