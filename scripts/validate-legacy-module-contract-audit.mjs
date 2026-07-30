import { execFile } from "node:child_process";
import { lstat, readFile } from "node:fs/promises";
import { dirname, relative, resolve } from "node:path";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import { extractTableOfContents } from "../lib/heading-ids.js";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const defaultSiteRoot = resolve(scriptDirectory, "..");

export const legacyModuleContractAuditRelativePath =
  "content/course/contracts/legacy-module-contract-audit.v1.json";
export const canonicalCourseGraphRelativePath = "content/course/course-graph.v1.json";
export const canonicalModuleManifestRelativePath = "content/modules/manifest.json";

const execFileAsync = promisify(execFile);
const evidenceStatuses = new Set(["pointer-present", "ambiguous", "missing"]);
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
const exactTopLevelKeys = [
  "schemaVersion",
  "kind",
  "auditVersion",
  "purpose",
  "canonicalCourseGraph",
  "canonicalModuleManifest",
  "auditScope",
  "truthBoundary",
  "statusVocabulary",
  "criterionIds",
  "modules",
];
const exactTruthBoundaryKeys = [
  "pointerResolutionOnly",
  "qualityReview",
  "publication",
  "ambiguity",
  "provenance",
];
const exactStatusVocabularyKeys = ["pointer-present", "ambiguous", "missing"];
const exactAuditScopeKeys = ["moduleIds", "selectionRule"];
const exactModuleEntryKeys = [
  "moduleId",
  "workbookPath",
  "graphFields",
  "humanQualityReview",
  "sessionAnchors",
  "evidence",
];
const allowedEvidenceRecordKeys = new Set([
  "status",
  "anchors",
  "sourceReferences",
  "sessionAnchorSet",
  "note",
]);
const sourceReferenceCriteria = new Set(["source-ledger", "forward-handoff"]);

function hasText(value) {
  return typeof value === "string" && value.trim() !== "";
}

function auditFailure(errors) {
  if (errors.length > 0) {
    throw new Error(`Legacy module-contract audit validation failed:\n- ${errors.join("\n- ")}`);
  }
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

function normalizedContentPath(value, label, errors) {
  if (
    !hasText(value) ||
    value.includes("\\") ||
    value.includes("\0") ||
    !value.startsWith("content/") ||
    value.startsWith("/") ||
    value.split("/").some((segment) => segment === "" || segment === "." || segment === "..")
  ) {
    errors.push(`${label} must be a normalized repository-relative path below content/.`);
    return null;
  }
  return value;
}

function normalizedMarkdownPath(value, label, errors) {
  const normalized = normalizedContentPath(value, label, errors);
  if (normalized && !normalized.endsWith(".md")) {
    errors.push(`${label} must name a Markdown file.`);
    return null;
  }
  return normalized;
}

function normalizedAnchor(value, label, errors) {
  if (!hasText(value) || !/^[a-z0-9][a-z0-9-]*$/u.test(value)) {
    errors.push(`${label} must be a visible h2/h3 heading anchor without a leading #.`);
    return null;
  }
  return value;
}

function normalizeTitle(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/gu, " ").trim();
}

function anyHeadingMatches(headings, expression) {
  return headings.some(({ title }) => expression.test(normalizeTitle(title)));
}

function sessionNumberFromAnchor(anchor) {
  const match = anchor.match(/^(?:\d+-)?session-([1-6])(?:--|$)/u);
  return match ? Number(match[1]) : null;
}

function sameStrings(left, right) {
  return Array.isArray(left) &&
    left.length === right.length &&
    left.every((value, index) => value === right[index]);
}

async function isTrackedRegularFile(siteRoot, relativePath) {
  const absolutePath = resolve(siteRoot, relativePath);
  const pathFromRoot = relative(siteRoot, absolutePath).replaceAll("\\", "/");
  if (pathFromRoot !== relativePath || !pathFromRoot.startsWith("content/")) return false;
  const stats = await lstat(absolutePath).catch(() => null);
  if (!stats || !stats.isFile() || stats.isSymbolicLink()) return false;
  return execFileAsync("git", ["ls-files", "--error-unmatch", "--", relativePath], { cwd: siteRoot })
    .then(() => true)
    .catch(() => false);
}

async function trackedJson(siteRoot, relativePath, label, errors) {
  const normalizedPath = normalizedContentPath(relativePath, label, errors);
  if (!normalizedPath) return null;
  if (!(await isTrackedRegularFile(siteRoot, normalizedPath))) {
    errors.push(`${label} must be a tracked regular local file.`);
    return null;
  }
  return JSON.parse(await readFile(resolve(siteRoot, normalizedPath), "utf8"));
}

async function headingsForPath(siteRoot, relativePath, cache, errors, label) {
  const cached = cache.get(relativePath);
  if (cached) return cached;
  if (!(await isTrackedRegularFile(siteRoot, relativePath))) {
    errors.push(`${label} must target a tracked regular local Markdown file.`);
    return null;
  }
  const contents = await readFile(resolve(siteRoot, relativePath), "utf8");
  const headings = new Map(
    extractTableOfContents(contents).map((heading) => [heading.id, heading]),
  );
  cache.set(relativePath, headings);
  return headings;
}

async function resolveAnchors({ siteRoot, path, anchors, cache, errors, label }) {
  if (anchors === undefined) return [];
  if (!Array.isArray(anchors)) {
    errors.push(`${label}.anchors must be an array when provided.`);
    return [];
  }
  if (new Set(anchors).size !== anchors.length) {
    errors.push(`${label}.anchors may not repeat a heading.`);
  }
  const normalizedPath = normalizedMarkdownPath(path, `${label} path`, errors);
  if (!normalizedPath) return [];
  const headings = await headingsForPath(siteRoot, normalizedPath, cache, errors, label);
  if (!headings) return [];
  const resolved = [];
  for (const [index, anchor] of anchors.entries()) {
    const normalized = normalizedAnchor(anchor, `${label}.anchors[${index}]`, errors);
    if (!normalized) continue;
    const heading = headings.get(normalized);
    if (!heading) {
      errors.push(`${label}.anchors[${index}] points to #${normalized}, which is not visible in ${normalizedPath}.`);
      continue;
    }
    resolved.push(heading);
  }
  return resolved;
}

async function resolveSourceReferences({
  siteRoot,
  criterionId,
  record,
  graphModule,
  cache,
  errors,
  label,
}) {
  if (record.sourceReferences === undefined) return [];
  if (!sourceReferenceCriteria.has(criterionId)) {
    errors.push(`${label}.sourceReferences are only allowed for source-ledger or forward-handoff.`);
    return [];
  }
  if (!Array.isArray(record.sourceReferences) || record.sourceReferences.length === 0) {
    errors.push(`${label}.sourceReferences must be a non-empty array when provided.`);
    return [];
  }
  const resolved = [];
  for (const [index, reference] of record.sourceReferences.entries()) {
    const sourceLabel = `${label}.sourceReferences[${index}]`;
    requireExactKeys(reference, ["path", "headingAnchor"], sourceLabel, errors);
    const sourcePath = normalizedMarkdownPath(reference?.path, `${sourceLabel}.path`, errors);
    const sourceAnchor = normalizedAnchor(reference?.headingAnchor, `${sourceLabel}.headingAnchor`, errors);
    if (!sourcePath || !sourceAnchor) continue;
    if (sourcePath !== graphModule.sourceMap) {
      errors.push(`${sourceLabel}.path must equal canonical graph sourceMap ${graphModule.sourceMap}.`);
      continue;
    }
    const headings = await headingsForPath(siteRoot, sourcePath, cache, errors, sourceLabel);
    const heading = headings?.get(sourceAnchor);
    if (!heading) {
      errors.push(`${sourceLabel} points to #${sourceAnchor}, which is not visible in ${sourcePath}.`);
      continue;
    }
    resolved.push(heading);
  }
  return resolved;
}

function criterionPointerError(label, criterionId, explanation, errors) {
  errors.push(`${label} cannot be pointer-present: ${criterionId} ${explanation}.`);
}

function validatePointerPresentCriterion({
  criterionId,
  record,
  entry,
  workbookHeadings,
  sourceHeadings,
  label,
  errors,
}) {
  const has = (expression) => anyHeadingMatches(workbookHeadings, expression);
  const sourceHas = (expression) => anyHeadingMatches(sourceHeadings, expression);

  switch (criterionId) {
    case "prerequisite-forward-map":
      if (!sameStrings(entry.graphFields, ["academicPrerequisiteNumbers", "forwardModuleNumber"]) || !has(/prerequisite|forward|connection|position in the knowledge/u)) {
        criterionPointerError(label, criterionId, "needs canonical graph fields and a map-oriented workbook heading", errors);
      }
      break;
    case "six-connected-sessions":
      if (record.sessionAnchorSet !== "core-six") {
        criterionPointerError(label, criterionId, "needs sessionAnchorSet core-six", errors);
      }
      break;
    case "first-principles":
      if (!has(/first principle|first principles|derive.*first/u)) {
        criterionPointerError(label, criterionId, "needs a first-principles/derivation heading", errors);
      }
      break;
    case "rigor-definitions-assumptions-derivations-proofs-counterexamples-numerical-experiments":
      if (
        !has(/definition|vocabulary|contract|model/u) ||
        !has(/assumption|condition|scope|boundary/u) ||
        !has(/deriv|proof|theorem|induction|argument/u) ||
        !has(/counterexample|countermodel|broken|adversarial/u) ||
        !has(/experiment|numerical|measurement|simulation/u)
      ) {
        criterionPointerError(label, criterionId, "needs explicit definition, assumption/boundary, derivation/proof, counterexample, and numerical-experiment evidence headings", errors);
      }
      break;
    case "code-reading-debugging-design":
      if (!has(/code reading|reading studio|architecture reading/u) || !has(/debug|broken|failure|repair|adversarial/u) || !has(/design|agent|patch review|architecture/u)) {
        criterionPointerError(label, criterionId, "needs distinct code-reading, debugging/failure, and design/review headings", errors);
      }
      break;
    case "prediction-before-reveal":
      if (!has(/predict/u)) criterionPointerError(label, criterionId, "needs a prediction heading", errors);
      break;
    case "transfer-task":
      if (!has(/transfer/u)) criterionPointerError(label, criterionId, "needs a named transfer heading", errors);
      break;
    case "source-ledger":
      if (sourceHeadings.length === 0 || !has(/source|ledger|license|reuse|reading route/u) || !sourceHas(/source|ledger|license|reuse|access|claim|reading/u)) {
        criterionPointerError(label, criterionId, "needs a source/ledger workbook heading plus canonical-source-map evidence", errors);
      }
      break;
    case "accessible-visual-text-alternative":
      if (!has(/text equivalent|text alternative|accessible visual|accessible visualization|diagram and accessibility/u)) {
        criterionPointerError(label, criterionId, "needs an explicit visual text-equivalent/accessibility heading", errors);
      }
      break;
    case "confidence-diagnostic-misconceptions":
      if (!has(/diagnostic|understanding check|quiz/u) || !has(/confidence/u) || !has(/misconception|routing|interpretation|repair/u)) {
        criterionPointerError(label, criterionId, "needs diagnostic, confidence, and misconception-routing/repair headings", errors);
      }
      break;
    case "retrieval-and-spaced-review":
      if (!has(/retrieval|spaced review/u)) criterionPointerError(label, criterionId, "needs a retrieval/spaced-review heading", errors);
      break;
    case "project-and-evidence-rubric":
      if (!has(/project|dossier|milestone|checkpoint/u) || !has(/rubric|acceptance|evidence/u)) {
        criterionPointerError(label, criterionId, "needs project/dossier and rubric/acceptance/evidence headings", errors);
      }
      break;
    case "supportive-oral-defense":
      if (!has(/oral|defense/u) || !has(/hint|repair|constructive|agency/u) || !has(/evidence summary/u)) {
        criterionPointerError(label, criterionId, "needs oral-defense, supportive hint/repair, and learner evidence-summary headings", errors);
      }
      break;
    case "ta-prompt":
      if (!has(/teaching assistant|\bta\b/u) || !has(/guide|playbook|protocol|clinic|studio|role/u)) {
        criterionPointerError(label, criterionId, "needs a TA guide/playbook/protocol/clinic heading", errors);
      }
      break;
    case "study-partner-prompt":
      if (!has(/study partner/u) || !has(/routine|rehearsal|protocol|role/u)) {
        criterionPointerError(label, criterionId, "needs a Study Partner routine/rehearsal/protocol heading", errors);
      }
      break;
    case "forward-handoff":
      if (!has(/forward|handoff|next module/u) && !sourceHas(/handoff/u)) {
        criterionPointerError(label, criterionId, "needs a named forward handoff in the workbook or canonical source map", errors);
      }
      break;
    default:
      errors.push(`${label} uses an unsupported criterion ${criterionId}.`);
  }
}

function matrixCode(status) {
  return { "pointer-present": "P", ambiguous: "A", missing: "M" }[status];
}

function criterionLabel(criterionId) {
  return criterionId.replaceAll("-", " ");
}

/**
 * Render the checked-in review report from the validated audit registry. The
 * output intentionally contains only pointer status and scope—not approval,
 * publication, accessibility conformance, or learner-mastery claims.
 */
export function renderLegacyModuleContractAuditReport(audit, report) {
  const columns = [
    ["Map", "prerequisite-forward-map"],
    ["Six", "six-connected-sessions"],
    ["First", "first-principles"],
    ["Rigor", "rigor-definitions-assumptions-derivations-proofs-counterexamples-numerical-experiments"],
    ["Read", "code-reading-debugging-design"],
    ["Predict", "prediction-before-reveal"],
    ["Transfer", "transfer-task"],
    ["Source", "source-ledger"],
    ["Visual", "accessible-visual-text-alternative"],
    ["Quiz", "confidence-diagnostic-misconceptions"],
    ["Review", "retrieval-and-spaced-review"],
    ["Project", "project-and-evidence-rubric"],
    ["Oral", "supportive-oral-defense"],
    ["TA", "ta-prompt"],
    ["Partner", "study-partner-prompt"],
    ["Handoff", "forward-handoff"],
  ];
  const header = `| Module | ${columns.map(([label]) => label).join(" | ")} |`;
  const divider = `| --- | ${columns.map(() => "---").join(" | ")} |`;
  const rows = audit.modules.map((entry) =>
    `| ${entry.moduleId.toUpperCase()} | ${columns
      .map(([, criterionId]) => matrixCode(entry.evidence[criterionId].status))
      .join(" | ")} |`,
  );
  const criterionRows = audit.criterionIds.map((criterionId) => {
    const counts = report.summary.byCriterion[criterionId];
    return `| ${criterionLabel(criterionId)} | ${counts["pointer-present"]} | ${counts.ambiguous} | ${counts.missing} |`;
  });

  return `# Legacy module-contract evidence audit

> Generated by \`scripts/sync-modules.mjs\` from \`${legacyModuleContractAuditRelativePath}\`. Do not edit this report by hand.

## Boundary

- \`P\` means a criterion-specific structural pointer resolves in Git-tracked local content. It is not a quality, accessibility, source-license, psychological-safety, or mastery judgment.
- \`A\` means evidence is partial, generic, inline-only, or insufficiently specific for the criterion.
- \`M\` means no bounded module-specific pointer was recorded in the audit input.
- Each module's \`humanQualityReview: not-reviewed\` uniformly applies to all 16 criteria. This audit records no per-criterion approvals; future granular human review needs a different reviewed contract record.
- M25/M26 remain preview-only in the canonical graph. This audit neither changes their availability nor permits their authoring-only prerequisites to be bypassed.

The validator resolved ${report.summary.modules} modules and ${report.summary.totalCriteria} criteria: **${report.summary.byStatus["pointer-present"]} P**, **${report.summary.byStatus.ambiguous} A**, **${report.summary.byStatus.missing} M**. It records **0 human approvals** and **0 publication changes**.

## Matrix

${header}
${divider}
${rows.join("\n")}

## Criterion queue

| Contract evidence | P | A | M |
| --- | ---: | ---: | ---: |
${criterionRows.join("\n")}

## Verification

\`pnpm sync:modules\` deterministically regenerates this report and the SHA-256 release-input ledger. The audit input is allowlisted and hashed in \`content/course/release-inputs.v1.json\`; \`pnpm check:generated\` and the focused tests reject drift.

\`\`\`powershell
node scripts/validate-legacy-module-contract-audit.mjs
pnpm sync:modules
pnpm check:generated
node --test tests/course-contract.test.mjs tests/release-inputs.test.mjs
\`\`\`
`;
}

/**
 * Validate an audit as a non-approval migration inventory. A successful result
 * proves only exact schema, canonical module/source-map binding, and the
 * structural evidence pointers declared by the inventory.
 */
export async function validateLegacyModuleContractAudit(
  audit,
  { siteRoot = defaultSiteRoot } = {},
) {
  const errors = [];
  requireExactKeys(audit, exactTopLevelKeys, "legacy module-contract audit", errors);
  if (audit?.schemaVersion !== 1 || audit?.kind !== "atlas-legacy-module-contract-audit" || audit?.auditVersion !== "v1") {
    errors.push("Audit must use schemaVersion 1, kind atlas-legacy-module-contract-audit, and auditVersion v1.");
  }
  if (!hasText(audit?.purpose)) errors.push("Audit purpose must be a non-empty string.");
  if (audit?.canonicalCourseGraph !== canonicalCourseGraphRelativePath) {
    errors.push("Audit must point at the canonical course graph.");
  }
  if (audit?.canonicalModuleManifest !== canonicalModuleManifestRelativePath) {
    errors.push("Audit must point at the canonical generated module manifest.");
  }
  requireExactKeys(audit?.auditScope, exactAuditScopeKeys, "auditScope", errors);
  if (!hasText(audit?.auditScope?.selectionRule)) errors.push("auditScope.selectionRule must be non-empty.");
  requireExactKeys(audit?.truthBoundary, exactTruthBoundaryKeys, "truthBoundary", errors);
  for (const key of exactTruthBoundaryKeys) {
    if (!hasText(audit?.truthBoundary?.[key])) errors.push(`truthBoundary.${key} must be a non-empty statement.`);
  }
  requireExactKeys(audit?.statusVocabulary, exactStatusVocabularyKeys, "statusVocabulary", errors);
  for (const key of exactStatusVocabularyKeys) {
    if (!hasText(audit?.statusVocabulary?.[key])) errors.push(`statusVocabulary.${key} must be a non-empty statement.`);
  }
  if (!sameStrings(audit?.criterionIds, exactCriterionIds)) {
    errors.push("Audit criterionIds must exactly match the versioned 16-criterion taxonomy in order.");
  }
  if (!Array.isArray(audit?.modules) || audit.modules.length !== 30) {
    errors.push("Audit must contain exactly the 30 legacy-baseline module entries.");
  }

  const graph = await trackedJson(siteRoot, canonicalCourseGraphRelativePath, "canonical course graph", errors);
  const manifest = await trackedJson(siteRoot, canonicalModuleManifestRelativePath, "canonical module manifest", errors);
  if (!graph || !manifest) auditFailure(errors);

  const publishedGraphModules = graph.modules.filter(
    (courseModule) => courseModule.lifecycle === "published" && courseModule.number <= 30,
  );
  const expectedModuleIds = new Set(publishedGraphModules.map(({ id }) => id));
  const declaredScope = Array.isArray(audit?.auditScope?.moduleIds)
    ? new Set(audit.auditScope.moduleIds)
    : new Set();
  if (declaredScope.size !== expectedModuleIds.size || [...declaredScope].some((id) => !expectedModuleIds.has(id))) {
    errors.push("Audit scope module IDs must exactly match canonical lifecycle-published M1–M30 IDs.");
  }
  const manifestById = new Map((manifest.modules ?? []).map((module) => [module.id, module]));
  const headingCache = new Map();
  const seenModuleIds = new Set();
  const summary = {
    modules: 0,
    totalCriteria: 0,
    humanApprovals: 0,
    publicationChanges: 0,
    byStatus: Object.fromEntries([...evidenceStatuses].map((status) => [status, 0])),
    byCriterion: Object.fromEntries(exactCriterionIds.map((criterionId) => [criterionId, {
      "pointer-present": 0,
      ambiguous: 0,
      missing: 0,
    }])),
  };

  for (const entry of audit?.modules ?? []) {
    const label = `Audit module ${entry?.moduleId ?? "(missing moduleId)"}`;
    requireExactKeys(entry, exactModuleEntryKeys, label, errors);
    if (!hasText(entry?.moduleId) || seenModuleIds.has(entry.moduleId)) {
      errors.push(`${label} must have a unique moduleId.`);
      continue;
    }
    seenModuleIds.add(entry.moduleId);
    const graphModule = publishedGraphModules.find(({ id }) => id === entry.moduleId);
    const manifestModule = manifestById.get(entry.moduleId);
    if (!graphModule || !manifestModule) {
      errors.push(`${label} must map to a canonical lifecycle-published graph and manifest module.`);
      continue;
    }
    const expectedWorkbookPath = `content/modules/${manifestModule.filename}`;
    if (entry.workbookPath !== expectedWorkbookPath) {
      errors.push(`${label}.workbookPath must equal canonical manifest workbook ${expectedWorkbookPath}.`);
    }
    if (manifestModule.sourceMap !== graphModule.sourceMap) {
      errors.push(`${label} canonical manifest sourceMap must agree with the canonical graph.`);
    }
    if (entry.humanQualityReview !== "not-reviewed") {
      errors.push(`${label} must remain not-reviewed; this audit cannot record human approval.`);
    }
    if (!sameStrings(entry.graphFields, ["academicPrerequisiteNumbers", "forwardModuleNumber"])) {
      errors.push(`${label}.graphFields must exactly declare academicPrerequisiteNumbers then forwardModuleNumber.`);
    }

    const sessionHeadings = await resolveAnchors({
      siteRoot,
      path: entry.workbookPath,
      anchors: entry.sessionAnchors,
      cache: headingCache,
      errors,
      label: `${label}.sessionAnchors`,
    });
    if (!Array.isArray(entry.sessionAnchors) || entry.sessionAnchors.length !== 6) {
      errors.push(`${label}.sessionAnchors must contain exactly six visible session anchors.`);
    }
    for (const [index, anchor] of (entry.sessionAnchors ?? []).entries()) {
      const number = typeof anchor === "string" ? sessionNumberFromAnchor(anchor) : null;
      if (number !== index + 1) {
        errors.push(`${label}.sessionAnchors[${index}] must be the unique ordered Session ${index + 1} anchor.`);
      }
    }
    for (const [index, heading] of sessionHeadings.entries()) {
      if (!new RegExp(`\\bSession\\s+${index + 1}\\b`, "iu").test(heading.title)) {
        errors.push(`${label}.sessionAnchors[${index}] must resolve a visible Session ${index + 1} heading.`);
      }
    }
    if (sessionHeadings.length !== 6) errors.push(`${label}.sessionAnchors must resolve six visible headings.`);

    const evidence = entry.evidence;
    if (!evidence || typeof evidence !== "object" || Array.isArray(evidence)) {
      errors.push(`${label}.evidence must be an object.`);
      continue;
    }
    const evidenceKeys = Object.keys(evidence);
    if (!sameStrings(evidenceKeys, exactCriterionIds)) {
      errors.push(`${label}.evidence must contain the exact 16-criterion taxonomy in order.`);
    }

    for (const criterionId of exactCriterionIds) {
      const record = evidence[criterionId];
      const criterionLabel = `${label}.evidence.${criterionId}`;
      if (!record || typeof record !== "object" || Array.isArray(record)) {
        errors.push(`${criterionLabel} must be an object.`);
        continue;
      }
      for (const key of Object.keys(record)) {
        if (!allowedEvidenceRecordKeys.has(key)) errors.push(`${criterionLabel} has an unsupported field ${key}.`);
      }
      if (!evidenceStatuses.has(record.status)) {
        errors.push(`${criterionLabel}.status must be pointer-present, ambiguous, or missing.`);
        continue;
      }
      if (record.note !== undefined && !hasText(record.note)) {
        errors.push(`${criterionLabel}.note must be a non-empty string when provided.`);
      }
      if (record.sessionAnchorSet !== undefined && record.sessionAnchorSet !== "core-six") {
        errors.push(`${criterionLabel}.sessionAnchorSet must be core-six when provided.`);
      }
      if (criterionId === "six-connected-sessions" && record.sessionAnchorSet !== "core-six") {
        errors.push(`${criterionLabel} must use sessionAnchorSet core-six.`);
      }
      if (criterionId !== "six-connected-sessions" && record.sessionAnchorSet !== undefined) {
        errors.push(`${criterionLabel}.sessionAnchorSet is only valid for six-connected-sessions.`);
      }
      const workbookHeadings = await resolveAnchors({
        siteRoot,
        path: entry.workbookPath,
        anchors: record.anchors,
        cache: headingCache,
        errors,
        label: criterionLabel,
      });
      const sourceHeadings = await resolveSourceReferences({
        siteRoot,
        criterionId,
        record,
        graphModule,
        cache: headingCache,
        errors,
        label: criterionLabel,
      });
      if (record.status === "missing" && (
        workbookHeadings.length > 0 || sourceHeadings.length > 0 || record.sessionAnchorSet !== undefined
      )) {
        errors.push(`${criterionLabel} is missing but declares evidence pointers.`);
      }
      if (record.status === "pointer-present") {
        validatePointerPresentCriterion({
          criterionId,
          record,
          entry,
          workbookHeadings,
          sourceHeadings,
          label: criterionLabel,
          errors,
        });
      }
      summary.byStatus[record.status] += 1;
      summary.byCriterion[criterionId][record.status] += 1;
      summary.totalCriteria += 1;
    }
    summary.modules += 1;
  }

  if (seenModuleIds.size !== expectedModuleIds.size || [...expectedModuleIds].some((id) => !seenModuleIds.has(id))) {
    errors.push("Audit module entries must exactly match canonical lifecycle-published M1–M30 scope.");
  }

  auditFailure(errors);
  return { audit, summary };
}

export async function loadLegacyModuleContractAudit(siteRoot = defaultSiteRoot) {
  return JSON.parse(await readFile(resolve(siteRoot, legacyModuleContractAuditRelativePath), "utf8"));
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const audit = await loadLegacyModuleContractAudit();
  const report = await validateLegacyModuleContractAudit(audit);
  const statuses = Object.entries(report.summary.byStatus)
    .map(([status, count]) => `${status}=${count}`)
    .join(", ");
  console.log(`Legacy module-contract audit: ${report.summary.modules} modules; ${statuses}; human approvals=0; publication changes=0.`);
}
