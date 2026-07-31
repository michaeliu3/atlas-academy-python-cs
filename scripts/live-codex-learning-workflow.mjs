import { lstat, readFile } from "node:fs/promises";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const defaultSiteRoot = resolve(scriptDirectory, "..");

export const liveCodexLearningWorkflowRelativePath =
  "content/course/live-codex-learning-workflow.v1.json";
export const liveCodexLearningWorkflowGuideRelativePath =
  "docs/LIVE_CODEX_LEARNING_WORKFLOW.md";

const requiredActivation = [
  "the exact enabled record mode is selected",
  "this is the designated Teaching Assistant or Study Partner chat",
  "the configured private Notion destination is reachable",
  "a substantive session has ended or the learner asks for its concise summary",
];
const requiredRoles = [
  {
    id: "teaching-assistant",
    liveResponsibility: "first-principles teaching and the supportive post-module oral defense",
    recordFocus: "oral-defense prompt, repair, transfer, uncertainty, and constructive next bridge",
  },
  {
    id: "study-partner",
    liveResponsibility: "non-grading concept discussion, retrieval, rehearsal, and handoff preparation",
    recordFocus: "discussion, rehearsal, uncertainty, and focused Teaching Assistant handoff",
  },
];
const requiredWhiteboardRules = [
  "supported display math with defined symbols",
  "language-labelled fenced code with explicit state traces",
  "prose or ASCII fallback for math, code, and diagrams",
  "no speech-only or visual-only explanation",
];
const requiredExclusions = [
  "raw voice recordings",
  "full chat transcripts",
  "credentials, keys, or tokens",
  "sensitive personal data",
  "off-record material",
];
const requiredControls = [
  "pause records",
  "off-record",
  "correct a saved note",
  "delete a saved note",
];

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function text(value) {
  return typeof value === "string" ? value.trim() : "";
}

function arraysMatch(left, right) {
  return Array.isArray(left) && left.length === right.length && left.every((value, index) => value === right[index]);
}

function repositoryPath(siteRoot, path) {
  return relative(siteRoot, path).replaceAll("\\", "/");
}

function isPathWithinSite(siteRoot, path) {
  const fromRoot = repositoryPath(siteRoot, path);
  return fromRoot !== "" && !fromRoot.startsWith("../") && !fromRoot.includes(":");
}

function requiredStringArray(value, label, expected, errors) {
  if (!arraysMatch(value, expected)) {
    errors.push(`${label} must preserve the reviewed values and order.`);
  }
}

async function validateGuide(path, siteRoot, errors) {
  const absolutePath = resolve(siteRoot, path);
  if (
    !isPathWithinSite(siteRoot, absolutePath) ||
    repositoryPath(siteRoot, absolutePath) !== liveCodexLearningWorkflowGuideRelativePath
  ) {
    errors.push(`Live Codex workflow learnerGuidePath must be ${liveCodexLearningWorkflowGuideRelativePath}.`);
    return null;
  }
  const stats = await lstat(absolutePath).catch(() => null);
  if (!stats || !stats.isFile() || stats.isSymbolicLink()) {
    errors.push("Live Codex workflow learner guide must be a regular checked-in documentation file.");
    return null;
  }
  const guide = await readFile(absolutePath, "utf8");
  for (const marker of [
    "<!-- live-codex-workflow: boundaries -->",
    "<!-- live-codex-workflow: activation -->",
    "<!-- live-codex-workflow: controls -->",
  ]) {
    if (!guide.includes(marker)) {
      errors.push(`Live Codex workflow learner guide is missing the ${marker} marker.`);
    }
  }
  if (!guide.includes("Record mode: keep local")) {
    errors.push("Live Codex workflow learner guide must expose the safe local default.");
  }
  if (!guide.includes("configured-notion-session-note")) {
    errors.push("Live Codex workflow learner guide must name the exact enabled record mode.");
  }
  if (!guide.includes("at most one concise note per substantive session")) {
    errors.push("Live Codex workflow learner guide must state the session-level write cadence.");
  }
  return absolutePath;
}

export function liveCodexLearningWorkflowPath(siteRoot = defaultSiteRoot) {
  return resolve(siteRoot, liveCodexLearningWorkflowRelativePath);
}

export async function loadLiveCodexLearningWorkflow(siteRoot = defaultSiteRoot) {
  return JSON.parse(await readFile(liveCodexLearningWorkflowPath(siteRoot), "utf8"));
}

export async function validateLiveCodexLearningWorkflow(
  workflow,
  { siteRoot = defaultSiteRoot } = {},
) {
  const errors = [];
  if (!isPlainObject(workflow)) {
    throw new Error("Live Codex learning workflow validation failed:\n- workflow must be an object.");
  }
  if (
    workflow.schemaVersion !== 1 ||
    workflow.workflowVersion !== "v1" ||
    workflow.kind !== "atlas-live-codex-learning-workflow"
  ) {
    errors.push("Live Codex workflow must use schemaVersion 1, workflowVersion v1, and the expected kind.");
  }
  if (text(workflow.title) === "" || text(workflow.purpose) === "") {
    errors.push("Live Codex workflow must define a non-empty title and purpose.");
  }

  const delivery = isPlainObject(workflow.delivery) ? workflow.delivery : null;
  if (!delivery) {
    errors.push("Live Codex workflow delivery must be an object.");
  } else {
    if (delivery.portalRuntimeIntegration !== "none") {
      errors.push("Live Codex workflow portalRuntimeIntegration must remain none.");
    }
    if (delivery.chatSurface !== "user-designated-platform-chat") {
      errors.push("Live Codex workflow must keep the user-designated platform-chat boundary.");
    }
    if (delivery.defaultRecordMode !== "keep-local") {
      errors.push("Live Codex workflow defaultRecordMode must remain keep-local.");
    }
    if (delivery.enabledRecordMode !== "configured-notion-session-note") {
      errors.push("Live Codex workflow must require the exact configured Notion session-note mode.");
    }
    requiredStringArray(delivery.requiredActivation, "Live Codex workflow requiredActivation", requiredActivation, errors);
    if (delivery.writeCadence !== "at-most-one-concise-note-per-substantive-session") {
      errors.push("Live Codex workflow must limit writes to one concise note per substantive session.");
    }
    if (text(delivery.learnerGuidePath) === "") {
      errors.push("Live Codex workflow delivery must declare learnerGuidePath.");
    }
  }

  if (!Array.isArray(workflow.roles) || workflow.roles.length !== requiredRoles.length) {
    errors.push("Live Codex workflow must declare exactly the two bounded partner roles.");
  } else {
    for (const [index, expected] of requiredRoles.entries()) {
      const actual = workflow.roles[index];
      if (!isPlainObject(actual) || actual.id !== expected.id || actual.liveResponsibility !== expected.liveResponsibility || actual.recordFocus !== expected.recordFocus) {
        errors.push(`Live Codex workflow role ${expected.id} must preserve its reviewed responsibility and record focus.`);
      }
    }
  }

  const whiteboardProtocol = isPlainObject(workflow.whiteboardProtocol) ? workflow.whiteboardProtocol : null;
  if (!whiteboardProtocol) {
    errors.push("Live Codex workflow whiteboardProtocol must be an object.");
  } else {
    requiredStringArray(whiteboardProtocol.required, "Live Codex workflow whiteboardProtocol.required", requiredWhiteboardRules, errors);
  }

  const privacyBoundary = isPlainObject(workflow.privacyBoundary) ? workflow.privacyBoundary : null;
  if (!privacyBoundary) {
    errors.push("Live Codex workflow privacyBoundary must be an object.");
  } else {
    requiredStringArray(privacyBoundary.excludedFromRecords, "Live Codex workflow excludedFromRecords", requiredExclusions, errors);
    const claims = privacyBoundary.forbiddenClaims;
    if (!Array.isArray(claims) || claims.length !== 2 || claims.some((claim) => text(claim) === "")) {
      errors.push("Live Codex workflow forbiddenClaims must contain the two reviewed truth boundaries.");
    }
  }

  requiredStringArray(workflow.learnerControls, "Live Codex workflow learnerControls", requiredControls, errors);
  const claimBoundary = isPlainObject(workflow.claimBoundary) ? workflow.claimBoundary : null;
  if (!claimBoundary || claimBoundary.manualPlatformAcceptanceRequired !== true || claimBoundary.configuredWriteClaimRequiresEvidence !== true || claimBoundary.noPassFail !== true) {
    errors.push("Live Codex workflow claimBoundary must require platform acceptance evidence and retain the no-pass/fail boundary.");
  }

  let guidePath = null;
  if (delivery && text(delivery.learnerGuidePath) !== "") {
    guidePath = await validateGuide(delivery.learnerGuidePath, siteRoot, errors);
  }
  if (errors.length > 0) {
    throw new Error(`Live Codex learning workflow validation failed:\n- ${errors.join("\n- ")}`);
  }
  return {
    workflowPath: liveCodexLearningWorkflowRelativePath,
    learnerGuidePath: delivery.learnerGuidePath,
    delivery,
    roles: workflow.roles,
    privacyBoundary,
    learnerControls: workflow.learnerControls,
    releaseInputPaths: [liveCodexLearningWorkflowPath(siteRoot), guidePath],
  };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const workflow = await loadLiveCodexLearningWorkflow();
  const report = await validateLiveCodexLearningWorkflow(workflow);
  console.log(
    `Live Codex learning workflow: ${report.roles.length} designated roles; ${report.delivery.defaultRecordMode} default record mode.`,
  );
}
