import { lstat, readFile } from "node:fs/promises";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const defaultSiteRoot = resolve(scriptDirectory, "..");

export const manualLearningRecordWorkflowRelativePath =
  "content/course/manual-learning-record-workflow.v1.json";
export const manualLearningRecordWorkflowGuideRelativePath =
  "docs/LEARNER_RECORD_WORKFLOW.md";

const requiredPrivacyExclusions = [
  "Notion page and database IDs",
  "Notion API keys, integration tokens, or credentials",
  "raw oral-defense transcripts",
  "person-linked diagnostic responses",
  "private learner notes",
];

const requiredAutomationProhibitions = [
  "automatic portal-to-Notion writes",
  "automatic portal exports",
  "background learner-event tracking",
];

const requiredRecordCategories = [
  {
    id: "course-dashboard-current-route",
    fields: [
      "route-plan",
      "current-module",
      "current-session",
      "next-evidence",
      "next-review-date",
      "consent-decision",
    ],
    links: ["daily-learning-log", "module-notebook", "spaced-review-queue"],
  },
  {
    id: "daily-learning-log",
    fields: [
      "date",
      "module-session",
      "claim-tested",
      "evidence-pointer",
      "confidence",
      "repair-or-next-step",
      "next-review-date",
    ],
    links: [
      "course-dashboard-current-route",
      "module-notebook",
      "spaced-review-queue",
    ],
  },
  {
    id: "module-notebook",
    fields: [
      "module",
      "session",
      "first-principle",
      "prediction-and-reveal",
      "code-or-design-observation",
      "counterexample-or-boundary",
      "transfer-task",
      "evidence-pointer",
      "forward-bridge",
    ],
    links: [
      "misconceptions-debugging-log",
      "proof-derivation-counterexample-numerical-experiment-notebook",
      "math-ml-mastery-gates",
      "oral-defense-evidence",
      "projects-capstone-portfolio",
      "ta-study-partner-handoffs",
    ],
  },
  {
    id: "misconceptions-debugging-log",
    fields: [
      "misconception-or-bug",
      "trigger-or-reproduction",
      "repaired-model",
      "repair-experiment",
      "next-retrieval-date",
    ],
    links: ["module-notebook", "spaced-review-queue", "ta-study-partner-handoffs"],
  },
  {
    id: "proof-derivation-counterexample-numerical-experiment-notebook",
    fields: [
      "claim-or-theorem",
      "assumptions",
      "proof-or-derivation-idea",
      "counterexample-or-scope-boundary",
      "numerical-experiment",
      "result-and-limitation",
    ],
    links: ["math-ml-mastery-gates", "oral-defense-evidence", "projects-capstone-portfolio"],
  },
  {
    id: "math-ml-mastery-gates",
    fields: [
      "module-and-gate",
      "definition",
      "assumptions",
      "derivation-or-model",
      "test-or-evidence",
      "uncertainty",
      "next-gate",
    ],
    links: ["spaced-review-queue", "oral-defense-evidence", "projects-capstone-portfolio"],
  },
  {
    id: "spaced-review-queue",
    fields: ["retrieval-prompt", "last-attempt", "outcome", "repair", "next-due-date"],
    links: ["course-dashboard-current-route", "daily-learning-log", "module-notebook"],
  },
  {
    id: "oral-defense-evidence",
    fields: [
      "module",
      "claim-rehearsed",
      "evidence-shown",
      "hint-or-repair",
      "transfer-question",
      "learner-approved-summary",
      "next-question",
    ],
    links: ["module-notebook", "ta-study-partner-handoffs", "course-dashboard-current-route"],
  },
  {
    id: "projects-capstone-portfolio",
    fields: [
      "artifact",
      "problem-and-stakeholder",
      "design-decision",
      "evidence-and-test",
      "known-limitation",
      "next-falsifier-or-revision",
    ],
    links: ["course-dashboard-current-route", "ta-study-partner-handoffs"],
  },
  {
    id: "ta-study-partner-handoffs",
    fields: [
      "role",
      "learner-question",
      "learner-approved-context",
      "claim-and-evidence",
      "repair-or-recommendation",
      "next-handoff",
    ],
    links: ["course-dashboard-current-route", "module-notebook", "spaced-review-queue"],
  },
];

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function text(value) {
  return typeof value === "string" ? value.trim() : "";
}

function repositoryPath(siteRoot, path) {
  return relative(siteRoot, path).replaceAll("\\", "/");
}

function isPathWithinSite(siteRoot, path) {
  const fromRoot = repositoryPath(siteRoot, path);
  return fromRoot !== "" && !fromRoot.startsWith("../") && !fromRoot.includes(":");
}

function arraysMatch(left, right) {
  return Array.isArray(left) && left.length === right.length && left.every((value, index) => value === right[index]);
}

function collectStringArray(value, label, errors) {
  if (!Array.isArray(value) || value.some((entry) => text(entry) === "")) {
    errors.push(`${label} must be an array of non-empty strings.`);
    return [];
  }
  if (new Set(value).size !== value.length) {
    errors.push(`${label} must not contain duplicates.`);
  }
  return value;
}

function validateRecordCategories(recordCategories, errors) {
  if (!Array.isArray(recordCategories)) {
    errors.push("Manual record workflow recordCategories must be an array.");
    return [];
  }

  const ids = recordCategories.map((category) => category?.id);
  const expectedIds = requiredRecordCategories.map(({ id }) => id);
  if (!arraysMatch(ids, expectedIds)) {
    errors.push("Manual record workflow must declare exactly the ten required record categories in the canonical order.");
  }

  const actualIds = new Set(ids.filter((id) => typeof id === "string"));
  const normalizedCategories = [];
  for (const [index, expected] of requiredRecordCategories.entries()) {
    const category = recordCategories[index];
    const label = `Manual record category ${expected.id}`;
    if (!isPlainObject(category)) {
      errors.push(`${label} must be an object.`);
      continue;
    }
    if (category.id !== expected.id) {
      continue;
    }
    if (text(category.title) === "" || text(category.purpose) === "") {
      errors.push(`${label} must define a non-empty title and purpose.`);
    }
    const fields = Array.isArray(category.minimalFields) ? category.minimalFields : null;
    if (!fields) {
      errors.push(`${label} minimalFields must be an array.`);
    } else {
      const fieldIds = fields.map((field) => field?.id);
      if (!arraysMatch(fieldIds, expected.fields)) {
        errors.push(`${label} must preserve its reviewed minimum field order.`);
      }
      for (const field of fields) {
        if (!isPlainObject(field) || text(field.id) === "" || text(field.label) === "") {
          errors.push(`${label} minimal fields must each define a non-empty id and label.`);
          break;
        }
      }
    }
    const links = collectStringArray(category.linksToRecordCategoryIds, `${label} linksToRecordCategoryIds`, errors);
    if (!arraysMatch(links, expected.links)) {
      errors.push(`${label} must preserve its reviewed record links.`);
    }
    for (const linkedId of links) {
      if (!actualIds.has(linkedId)) {
        errors.push(`${label} links to an unknown record category: ${linkedId}.`);
      }
      if (linkedId === expected.id) {
        errors.push(`${label} may not link to itself.`);
      }
    }
    normalizedCategories.push(category);
  }
  return normalizedCategories;
}

function recordCategoriesReachableFromDashboard(recordCategories) {
  const byId = new Map(recordCategories.map((category) => [category.id, category]));
  const reachable = new Set(["course-dashboard-current-route"]);
  const pending = ["course-dashboard-current-route"];
  while (pending.length > 0) {
    const id = pending.shift();
    for (const linkedId of byId.get(id)?.linksToRecordCategoryIds ?? []) {
      if (!reachable.has(linkedId)) {
        reachable.add(linkedId);
        pending.push(linkedId);
      }
    }
  }
  return reachable;
}

async function validateLearnerGuide(path, recordCategories, siteRoot, errors) {
  const absolutePath = resolve(siteRoot, path);
  if (!isPathWithinSite(siteRoot, absolutePath) || repositoryPath(siteRoot, absolutePath) !== manualLearningRecordWorkflowGuideRelativePath) {
    errors.push(`Manual record workflow learnerGuidePath must be ${manualLearningRecordWorkflowGuideRelativePath}.`);
    return null;
  }
  const stats = await lstat(absolutePath).catch(() => null);
  if (!stats || !stats.isFile() || stats.isSymbolicLink()) {
    errors.push("Manual record workflow learner guide must be a regular checked-in documentation file.");
    return null;
  }
  const guide = await readFile(absolutePath, "utf8");
  if (!guide.includes("No portal-to-Notion connection exists")) {
    errors.push("Manual record workflow learner guide must state the absence of a portal-to-Notion connection.");
  }
  if (!guide.includes("I reviewed this minimal summary and choose to copy it manually.")) {
    errors.push("Manual record workflow learner guide must state the learner approval rule verbatim.");
  }
  for (const category of recordCategories) {
    if (!guide.includes(`<!-- record-template: ${category.id} -->`)) {
      errors.push(`Manual record workflow learner guide is missing the ${category.id} template marker.`);
    }
  }
  return absolutePath;
}

export function manualLearningRecordWorkflowPath(siteRoot = defaultSiteRoot) {
  return resolve(siteRoot, manualLearningRecordWorkflowRelativePath);
}

export async function loadManualLearningRecordWorkflow(siteRoot = defaultSiteRoot) {
  return JSON.parse(await readFile(manualLearningRecordWorkflowPath(siteRoot), "utf8"));
}

export async function validateManualLearningRecordWorkflow(
  workflow,
  { siteRoot = defaultSiteRoot } = {},
) {
  const errors = [];
  if (!isPlainObject(workflow)) {
    throw new Error("Manual learning record workflow validation failed:\n- workflow must be an object.");
  }
  if (workflow.schemaVersion !== 1 || workflow.workflowVersion !== "v1" || workflow.kind !== "atlas-manual-learning-record-workflow") {
    errors.push("Manual record workflow must use schemaVersion 1, workflowVersion v1, and the expected kind.");
  }
  if (text(workflow.title) === "" || text(workflow.purpose) === "") {
    errors.push("Manual record workflow must define a non-empty title and purpose.");
  }

  const delivery = isPlainObject(workflow.delivery) ? workflow.delivery : null;
  if (!delivery) {
    errors.push("Manual record workflow delivery must be an object.");
  } else {
    if (delivery.mode !== "manual-copy-only") {
      errors.push("Manual record workflow delivery mode must remain manual-copy-only.");
    }
    if (delivery.portalToNotionIntegration !== "none") {
      errors.push("Manual record workflow portalToNotionIntegration must remain none.");
    }
    if (text(delivery.learnerGuidePath) === "") {
      errors.push("Manual record workflow delivery must declare learnerGuidePath.");
    }
  }

  const copyApproval = isPlainObject(workflow.copyApproval) ? workflow.copyApproval : null;
  if (!copyApproval) {
    errors.push("Manual record workflow copyApproval must be an object.");
  } else {
    if (copyApproval.requiredBeforeManualCopy !== true) {
      errors.push("Manual record workflow must require learner approval before any manual copy.");
    }
    if (copyApproval.learnerControlled !== true) {
      errors.push("Manual record workflow copy approval must remain learner-controlled.");
    }
    if (copyApproval.approvalStatement !== "I reviewed this minimal summary and choose to copy it manually.") {
      errors.push("Manual record workflow copy approval must use the reviewed minimal-summary statement.");
    }
  }

  const privacyBoundary = isPlainObject(workflow.privacyBoundary) ? workflow.privacyBoundary : null;
  if (!privacyBoundary) {
    errors.push("Manual record workflow privacyBoundary must be an object.");
  } else {
    const exclusions = collectStringArray(
      privacyBoundary.excludedFromGit,
      "Manual record workflow excludedFromGit",
      errors,
    );
    const prohibitions = collectStringArray(
      privacyBoundary.prohibitedAutomation,
      "Manual record workflow prohibitedAutomation",
      errors,
    );
    for (const exclusion of requiredPrivacyExclusions) {
      if (!exclusions.includes(exclusion)) {
        errors.push(`Manual record workflow must exclude ${exclusion} from Git.`);
      }
    }
    for (const prohibition of requiredAutomationProhibitions) {
      if (!prohibitions.includes(prohibition)) {
        errors.push(`Manual record workflow must prohibit ${prohibition}.`);
      }
    }
    if (text(privacyBoundary.minimumDataRule) === "") {
      errors.push("Manual record workflow privacyBoundary must define a minimumDataRule.");
    }
  }

  const recordCategories = validateRecordCategories(workflow.recordCategories, errors);
  const reachable = recordCategoriesReachableFromDashboard(recordCategories);
  if (recordCategories.length === requiredRecordCategories.length && reachable.size !== requiredRecordCategories.length) {
    errors.push("Manual record workflow categories must form one route reachable from the course dashboard.");
  }

  let learnerGuideAbsolutePath = null;
  if (delivery && text(delivery.learnerGuidePath) !== "") {
    learnerGuideAbsolutePath = await validateLearnerGuide(
      delivery.learnerGuidePath,
      recordCategories,
      siteRoot,
      errors,
    );
  }

  if (errors.length > 0) {
    throw new Error(`Manual learning record workflow validation failed:\n- ${errors.join("\n- ")}`);
  }

  return {
    workflowPath: manualLearningRecordWorkflowRelativePath,
    learnerGuidePath: delivery.learnerGuidePath,
    delivery,
    copyApproval,
    privacyBoundary,
    recordCategories,
    releaseInputPaths: [manualLearningRecordWorkflowPath(siteRoot), learnerGuideAbsolutePath],
  };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const workflow = await loadManualLearningRecordWorkflow();
  const report = await validateManualLearningRecordWorkflow(workflow);
  console.log(
    `Manual learning record workflow: ${report.recordCategories.length} consent-based categories; ${report.delivery.portalToNotionIntegration} portal-to-Notion integration.`,
  );
}
