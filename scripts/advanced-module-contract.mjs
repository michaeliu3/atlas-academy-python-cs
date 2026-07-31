import { execFile } from "node:child_process";
import { lstat, readdir, readFile } from "node:fs/promises";
import { dirname, extname, relative, resolve } from "node:path";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import { extractTableOfContents } from "../lib/heading-ids.js";
import {
  advancedModuleBridgeRelativePath,
  loadAdvancedModuleBridgeLedger,
  validateAdvancedModuleBridgeTopology,
} from "./advanced-module-bridge.mjs";
import { validateAdvancedModuleDeliveryMap } from "./advanced-module-delivery-map.mjs";
import { projectReaderModules } from "./course-graph.mjs";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const defaultSiteRoot = resolve(scriptDirectory, "..");
const execFileAsync = promisify(execFile);

export const advancedModuleContractRelativePath =
  "content/course/contracts/advanced-module-contracts.v1.json";

const contractStates = ["authoring-only", "review-ready", "published"];
const evidenceStates = ["planned", "pointer-present", "reviewed", "release-ready"];
const allowedInputKinds = new Set(["file", "json-pointer", "markdown-heading"]);
const allowedInputRoles = new Set(["course-content", "provenance", "source-code", "test"]);
const ledgerInputRoles = new Set(["course-content", "provenance"]);
const allowedRoots = new Set(["app", "content", "docs", "lib", "public", "tests"]);
const allowedExtensions = new Set([".json", ".js", ".md", ".mjs", ".py", ".svg", ".ts", ".tsx"]);
const advancedModuleIds = new Set(["m31", "m32", "m33", "m34", "m35", "m36"]);
export const historicalAdvancedProvenanceLedgerPaths = [
  "docs/M31_M36_PUBLICATION_READINESS_AUDIT.v1.json",
];
const historicalAdvancedProvenancePaths = new Set(historicalAdvancedProvenanceLedgerPaths);
const advancedProvenanceDocumentSlots = new Set([
  "provenance.md",
  "source-review.md",
  "known-limitations.md",
]);
const humanReviewDimensions = [
  "first-principles-quality",
  "rigor-and-counterexamples",
  "source-claim-correctness",
  "visual-text-equivalent-quality",
  "assessment-explanation-quality",
  "project-evidence-quality",
  "ta-study-partner-usefulness",
  "oral-defense-quality",
];
const evidenceRequirements = [
  {
    id: "prerequisite-and-forward-map",
    evidenceDetailKeys: ["academic-prerequisite-map", "forward-handoff"],
  },
  {
    id: "six-connected-sessions",
    evidenceDetailKeys: ["session-anchors", "learning-progression"],
  },
  {
    id: "first-principles-code-reading-prediction-and-transfer",
    evidenceDetailKeys: [
      "first-principles-explanation",
      "code-reading-debugging-design",
      "prediction-before-reveal",
      "transfer-task",
    ],
  },
  {
    id: "rigor-derivations-counterexamples-and-numerical-experiments",
    evidenceDetailKeys: [
      "definitions-and-assumptions",
      "derivation-or-proof-idea",
      "counterexample",
      "numerical-experiment",
    ],
  },
  {
    id: "source-ledger-claim-license-and-link-boundary",
    evidenceDetailKeys: [
      "source-rationale",
      "claim-linkage",
      "access-date",
      "license-reuse-status",
      "stable-learner-link",
    ],
  },
  {
    id: "accessible-visuals-and-concise-text-alternatives",
    evidenceDetailKeys: ["visual-purpose", "concise-prose-alternative"],
  },
  {
    id: "confidence-aware-multiple-choice-diagnostic",
    evidenceDetailKeys: [
      "multiple-choice-items",
      "prediction-and-confidence-gate",
      "explanations",
      "misconception-map",
    ],
  },
  {
    id: "retrieval-and-spaced-review",
    evidenceDetailKeys: ["retrieval-prompts", "review-intervals"],
  },
  {
    id: "dossier-rubric-and-acceptance-evidence",
    evidenceDetailKeys: ["dossier", "acceptance-criteria", "evidence-rubric"],
  },
  {
    id: "supportive-oral-defense",
    evidenceDetailKeys: [
      "live-when-available",
      "accessible-text-flow",
      "hint-ladder",
      "counterexample",
      "transfer",
      "reflection",
      "learner-evidence-summary",
      "constructive-next-steps",
    ],
  },
  {
    id: "ta-study-partner-and-forward-handoff",
    evidenceDetailKeys: ["ta-prompt", "study-partner-prompt", "forward-handoff"],
  },
  {
    id: "studio-reference-model-and-teaching-tests",
    evidenceDetailKeys: [
      "interaction-kind",
      "implementation-path",
      "reference-model-path",
      "teaching-test-path",
    ],
  },
  {
    id: "release-provenance-ci-and-deployment-evidence",
    evidenceDetailKeys: [
      "source-commit",
      "provenance-path",
      "source-review",
      "ci-run-url",
      "private-deployment-version",
      "known-limitations",
    ],
  },
];
const literalEvidenceDetailValues = new Map([
  ["interaction-kind", new Set(["studio", "reference-model", "studio-and-reference-model"])],
]);
const releaseLiteralDetailFields = new Map([
  ["source-commit", "sourceCommit"],
  ["ci-run-url", "ciRunUrl"],
  ["private-deployment-version", "privateDeploymentVersion"],
]);
const releasePathDetailFields = new Map([
  ["provenance-path", "provenancePath"],
  ["source-review", "sourceReviewPath"],
  ["known-limitations", "knownLimitationsPath"],
]);
const releaseDocumentationFieldSlots = new Map([
  ["provenancePath", "provenance.md"],
  ["sourceReviewPath", "source-review.md"],
  ["knownLimitationsPath", "known-limitations.md"],
]);

function hasText(value) {
  return typeof value === "string" && value.trim() !== "";
}

function sameOrderedValues(actual, expected) {
  return (
    Array.isArray(actual) &&
    actual.length === expected.length &&
    actual.every((value, index) => value === expected[index])
  );
}

function sameMembers(actual, expected) {
  return (
    Array.isArray(actual) &&
    actual.length === expected.length &&
    new Set(actual).size === actual.length &&
    actual.every((value) => expected.includes(value))
  );
}

function advancedContractFailure(errors) {
  if (errors.length > 0) {
    throw new Error(`Advanced module-contract validation failed:\n- ${errors.join("\n- ")}`);
  }
}

function requireExactKeys(record, keys, label, errors) {
  if (!record || typeof record !== "object" || Array.isArray(record)) {
    errors.push(`${label} must be an object.`);
    return false;
  }
  const allowed = new Set(keys);
  for (const key of Object.keys(record)) {
    if (!allowed.has(key)) {
      errors.push(`${label} has an unsupported field ${key}.`);
    }
  }
  for (const key of keys) {
    if (!(key in record)) {
      errors.push(`${label} is missing ${key}.`);
    }
  }
  return true;
}

function normalizedRepositoryPath(value, label, errors) {
  if (!hasText(value)) {
    errors.push(`${label} must be a non-empty repository-relative path.`);
    return null;
  }
  if (
    value.includes("\\") ||
    value.includes("\0") ||
    value.startsWith("/") ||
    value.split("/").some((segment) => segment === "" || segment === "." || segment === "..")
  ) {
    errors.push(`${label} must be a normalized path without escapes.`);
    return null;
  }
  if (!allowedRoots.has(value.split("/")[0]) || !allowedExtensions.has(extname(value))) {
    errors.push(`${label} must point to a supported checked-in Atlas source file.`);
    return null;
  }
  return value;
}

/**
 * Keep contract-derived documentation in a small, module-scoped namespace.
 * Historical readiness evidence remains readable, but future promotion records
 * cannot silently pull arbitrary docs into the deterministic release ledger.
 */
export function isAllowedAdvancedProvenancePath(moduleId, repositoryPath) {
  if (!advancedModuleIds.has(moduleId)) {
    return false;
  }
  if (historicalAdvancedProvenancePaths.has(repositoryPath)) {
    return true;
  }
  const prefix = `docs/advanced-evidence/${moduleId}/`;
  return (
    repositoryPath.startsWith(prefix) &&
    advancedProvenanceDocumentSlots.has(repositoryPath.slice(prefix.length))
  );
}

export function advancedReleaseDocumentationPath(moduleId, releaseField) {
  const filename = releaseDocumentationFieldSlots.get(releaseField);
  return advancedModuleIds.has(moduleId) && filename
    ? `docs/advanced-evidence/${moduleId}/${filename}`
    : null;
}

function roleAllowsPath(role, repositoryPath) {
  if (role === "course-content") {
    return repositoryPath.startsWith("content/") || repositoryPath.startsWith("public/downloads/");
  }
  if (role === "provenance") {
    return repositoryPath.startsWith("docs/") || repositoryPath.startsWith("content/course/");
  }
  if (role === "source-code") {
    return repositoryPath.startsWith("app/") || repositoryPath.startsWith("lib/");
  }
  return role === "test" && /^tests\/[^/]+\.test\.mjs$/u.test(repositoryPath);
}

async function requireTrackedRegularFile(siteRoot, repositoryPath, label, errors) {
  const absolutePath = resolve(siteRoot, repositoryPath);
  if (relative(siteRoot, absolutePath).replaceAll("\\", "/") !== repositoryPath) {
    errors.push(`${label} resolves outside the repository.`);
    return null;
  }
  const stats = await lstat(absolutePath).catch(() => null);
  if (!stats || !stats.isFile() || stats.isSymbolicLink()) {
    errors.push(`${label} must resolve to a regular local file.`);
    return null;
  }
  const tracked = await execFileAsync("git", ["ls-files", "--error-unmatch", "--", repositoryPath], {
    cwd: siteRoot,
  })
    .then(() => true)
    .catch(() => false);
  if (!tracked) {
    errors.push(`${label} must point to a Git-tracked file.`);
    return null;
  }
  return absolutePath;
}

function resolveJsonPointer(document, pointer, label, errors) {
  if (!hasText(pointer) || !pointer.startsWith("/") || pointer === "/") {
    errors.push(`${label} must be a non-root JSON pointer.`);
    return null;
  }
  let current = document;
  for (const encodedSegment of pointer.slice(1).split("/")) {
    const segment = encodedSegment.replaceAll("~1", "/").replaceAll("~0", "~");
    if (Array.isArray(current)) {
      if (!/^(0|[1-9]\d*)$/u.test(segment) || Number(segment) >= current.length) {
        errors.push(`${label} does not resolve in its JSON file.`);
        return null;
      }
      current = current[Number(segment)];
      continue;
    }
    if (!current || typeof current !== "object" || !Object.hasOwn(current, segment)) {
      errors.push(`${label} does not resolve in its JSON file.`);
      return null;
    }
    current = current[segment];
  }
  return current;
}

async function resolveContractInput(siteRoot, input, moduleId, caches, errors) {
  const label = `Module ${moduleId} contract input ${input?.id ?? "(missing id)"}`;
  requireExactKeys(input, ["id", "kind", "role", "path", "locator", "note"], label, errors);
  const validId = hasText(input?.id) && /^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(input.id);
  if (!validId) {
    errors.push(`${label} id must be lowercase kebab-case.`);
  }
  const validKind = allowedInputKinds.has(input?.kind);
  if (!validKind) {
    errors.push(`${label} kind is not supported.`);
  }
  const validRole = allowedInputRoles.has(input?.role);
  if (!validRole) {
    errors.push(`${label} role is not supported.`);
  }
  if (!hasText(input?.note)) {
    errors.push(`${label} must state why the checked-in input is useful.`);
  }
  const repositoryPath = normalizedRepositoryPath(input?.path, `${label} path`, errors);
  if (!validId || !validKind || !validRole || !repositoryPath) {
    return null;
  }
  if (!roleAllowsPath(input.role, repositoryPath)) {
    errors.push(`${label} role ${input.role} is incompatible with ${repositoryPath}.`);
    return null;
  }
  if (
    input.role === "provenance" &&
    repositoryPath.startsWith("docs/") &&
    !isAllowedAdvancedProvenancePath(moduleId, repositoryPath)
  ) {
    errors.push(
      `${label} provenance path must use a fixed historical record or a module-scoped advanced-evidence slot.`,
    );
    return null;
  }
  const absolutePath = await requireTrackedRegularFile(siteRoot, repositoryPath, label, errors);
  if (!absolutePath) {
    return null;
  }

  if (input.kind === "file") {
    if (input.locator !== null) {
      errors.push(`${label} locator must be null for a file input.`);
      return null;
    }
    return { ...input, path: repositoryPath, absolutePath, value: null, text: null };
  }

  if (input.kind === "json-pointer") {
    if (extname(repositoryPath) !== ".json") {
      errors.push(`${label} JSON pointer must target a JSON file.`);
      return null;
    }
    let document = caches.json.get(repositoryPath);
    if (!document) {
      try {
        document = JSON.parse(await readFile(absolutePath, "utf8"));
        caches.json.set(repositoryPath, document);
      } catch (error) {
        errors.push(`${label} JSON file cannot be read: ${error.message}`);
        return null;
      }
    }
    const value = resolveJsonPointer(document, input.locator, `${label} locator`, errors);
    return value === null ? null : { ...input, path: repositoryPath, absolutePath, value, text: null };
  }

  if (extname(repositoryPath) !== ".md") {
    errors.push(`${label} Markdown heading must target a Markdown file.`);
    return null;
  }
  if (!hasText(input.locator) || !/^[a-z0-9][a-z0-9-]*$/u.test(input.locator)) {
    errors.push(`${label} locator must be a visible Markdown heading ID.`);
    return null;
  }
  let markdown = caches.markdown.get(repositoryPath);
  if (!markdown) {
    try {
      markdown = await readFile(absolutePath, "utf8");
      caches.markdown.set(repositoryPath, markdown);
    } catch (error) {
      errors.push(`${label} Markdown file cannot be read: ${error.message}`);
      return null;
    }
  }
  const heading = extractTableOfContents(markdown).find(({ id }) => id === input.locator);
  if (!heading) {
    errors.push(`${label} does not contain that visible heading.`);
    return null;
  }
  return { ...input, path: repositoryPath, absolutePath, value: heading, text: markdown };
}

async function resolveContractInputs(entry, siteRoot, errors) {
  const label = `Module ${entry?.moduleId ?? "(missing moduleId)"} contract inputs`;
  if (!Array.isArray(entry?.contractInputs)) {
    errors.push(`${label} must be an array.`);
    return { resolvedInputs: new Map(), ledgerInputPaths: [], provenanceDocumentationPaths: [] };
  }
  if (entry.contractInputs.length === 0) {
    errors.push(`${label} must declare at least one checked-in input.`);
  }
  const resolvedInputs = new Map();
  const caches = { json: new Map(), markdown: new Map() };
  for (const input of entry.contractInputs) {
    const resolved = await resolveContractInput(siteRoot, input, entry.moduleId, caches, errors);
    if (!resolved) {
      continue;
    }
    if (resolvedInputs.has(resolved.id)) {
      errors.push(`${label} IDs must be unique.`);
      continue;
    }
    resolvedInputs.set(resolved.id, resolved);
  }
  return {
    resolvedInputs,
    ledgerInputPaths: [...resolvedInputs.values()]
      .filter(({ role }) => ledgerInputRoles.has(role))
      .map(({ absolutePath }) => absolutePath),
    provenanceDocumentationPaths: [...resolvedInputs.values()]
      .filter(({ role, path }) => role === "provenance" && path.startsWith("docs/"))
      .map(({ absolutePath }) => absolutePath),
  };
}

function validateEvidenceRequirementDefinitions(registry, errors) {
  if (!Array.isArray(registry?.evidenceRequirements)) {
    errors.push("advanced module-contract registry must define evidenceRequirements.");
    return new Map();
  }
  const expectedIds = evidenceRequirements.map(({ id }) => id);
  if (
    !sameOrderedValues(
      registry.evidenceRequirements.map((requirement) => requirement?.id),
      expectedIds,
    )
  ) {
    errors.push("advanced module-contract evidence requirements must match the versioned taxonomy exactly.");
  }
  const result = new Map();
  for (const [index, requirement] of registry.evidenceRequirements.entries()) {
    const expected = evidenceRequirements[index];
    const label = `advanced evidence requirement ${requirement?.id ?? "(missing id)"}`;
    requireExactKeys(requirement, ["id", "evidenceDetailKeys"], label, errors);
    if (!expected || requirement?.id !== expected.id) {
      continue;
    }
    if (!sameOrderedValues(requirement.evidenceDetailKeys, expected.evidenceDetailKeys)) {
      errors.push(`${label} evidenceDetailKeys must match the versioned requirement exactly.`);
    }
    result.set(requirement.id, expected);
  }
  return result;
}

function validateGraphSnapshot(courseModule, snapshot, contractState, errors) {
  const label = `Module ${courseModule.number} graph snapshot`;
  requireExactKeys(
    snapshot,
    [
      "number",
      "slug",
      "academicPrerequisiteNumbers",
      "forwardModuleNumber",
      "state",
      "sourceMap",
      "studioId",
    ],
    label,
    errors,
  );
  for (const [field, expected] of [
    ["number", courseModule.number],
    ["slug", courseModule.slug],
    ["forwardModuleNumber", courseModule.forwardModuleNumber],
    ["sourceMap", courseModule.sourceMap],
    ["studioId", courseModule.studioId],
  ]) {
    if (snapshot?.[field] !== expected) {
      errors.push(`${label}.${field} must match the canonical course graph.`);
    }
  }
  if (!sameOrderedValues(snapshot?.academicPrerequisiteNumbers, courseModule.academicPrerequisiteNumbers)) {
    errors.push(`${label}.academicPrerequisiteNumbers must match the canonical course graph.`);
  }
  if (JSON.stringify(snapshot?.state) !== JSON.stringify(courseModule.state)) {
    errors.push(`${label}.state must match the canonical course graph.`);
  }

  if (contractState === "authoring-only") {
    if (courseModule.sourceMap !== null) {
      errors.push(`Module ${courseModule.number} sourceMap must remain null while it is authoring-only.`);
    }
    if (courseModule.studioId !== null) {
      errors.push(`Module ${courseModule.number} studioId must remain null while it is authoring-only.`);
    }
    if (courseModule.state?.release?.state !== "unrecorded") {
      errors.push(`Module ${courseModule.number} release state must remain unrecorded while it is authoring-only.`);
    }
  }
  if (contractState === "review-ready") {
    if (!hasText(courseModule.sourceMap) || !hasText(courseModule.studioId)) {
      errors.push(`Module ${courseModule.number} review-ready state requires a source map and studio or equivalent ID.`);
    }
    if (courseModule.state?.release?.state !== "unrecorded") {
      errors.push(`Module ${courseModule.number} review-ready state may not make a release record claim.`);
    }
  }
  if (contractState === "published") {
    if (!hasText(courseModule.sourceMap) || !hasText(courseModule.studioId)) {
      errors.push(`Module ${courseModule.number} published state requires a source map and studio or equivalent ID.`);
    }
    if (courseModule.state?.release?.state === "unrecorded") {
      errors.push(`Module ${courseModule.number} published state requires a recorded graph release state.`);
    }
  }
}

function validateHumanReview(entry, errors) {
  const label = `Module ${entry?.moduleId ?? "(missing moduleId)"} human review`;
  requireExactKeys(entry?.humanReview, humanReviewDimensions, label, errors);
  for (const dimension of humanReviewDimensions) {
    if (!new Set(["pending", "approved"]).has(entry?.humanReview?.[dimension])) {
      errors.push(`${label}.${dimension} must be pending or approved.`);
    }
  }
  const values = humanReviewDimensions.map((dimension) => entry?.humanReview?.[dimension]);
  return {
    allPending: values.every((value) => value === "pending"),
    allApproved: values.every((value) => value === "approved"),
  };
}

function validateEvidence(entry, requirementById, resolvedInputs, errors) {
  const label = `Module ${entry?.moduleId ?? "(missing moduleId)"} contract evidence`;
  if (!Array.isArray(entry?.evidence)) {
    errors.push(`${label} must be an array.`);
    return { byId: new Map(), minimumState: "planned" };
  }
  const expectedIds = [...requirementById.keys()];
  if (!sameOrderedValues(entry.evidence.map((record) => record?.id), expectedIds)) {
    errors.push(`${label} must match the versioned evidence taxonomy exactly.`);
  }

  const byId = new Map();
  let minimumStateIndex = evidenceStates.length - 1;
  for (const record of entry.evidence) {
    const recordLabel = `${label} ${record?.id ?? "(missing id)"}`;
    const validRecord = requireExactKeys(
      record,
      ["id", "state", "inputIds", "note", "evidenceDetails"],
      recordLabel,
      errors,
    );
    if (!validRecord) {
      continue;
    }
    const requirement = requirementById.get(record.id);
    if (!requirement || byId.has(record.id)) {
      errors.push(`${recordLabel} ID must be present, unique, and versioned.`);
      continue;
    }
    byId.set(record.id, record);
    const stateIndex = evidenceStates.indexOf(record.state);
    if (stateIndex < 0) {
      errors.push(`${recordLabel} state is not recognized.`);
      continue;
    }
    minimumStateIndex = Math.min(minimumStateIndex, stateIndex);
    if (!hasText(record.note)) {
      errors.push(`${recordLabel} must state its evidence boundary.`);
    }
    if (!Array.isArray(record.inputIds)) {
      errors.push(`${recordLabel} inputIds must be an array.`);
    } else {
      if (
        new Set(record.inputIds).size !== record.inputIds.length ||
        record.inputIds.some((id) => !resolvedInputs.has(id))
      ) {
        errors.push(`${recordLabel} must name unique resolved contract inputs only.`);
      }
      if (record.state === "planned" && record.inputIds.length !== 0) {
        errors.push(`${recordLabel} may not cite inputs while its state is planned.`);
      }
      if (record.state !== "planned" && record.inputIds.length === 0) {
        errors.push(`${recordLabel} needs at least one resolved contract input.`);
      }
    }

    if (record.state === "planned" || record.state === "pointer-present") {
      if (record.evidenceDetails !== null) {
        errors.push(`${recordLabel} may not claim structured delivery details before review.`);
      }
      continue;
    }

    requireExactKeys(
      record.evidenceDetails,
      requirement.evidenceDetailKeys,
      `${recordLabel} evidenceDetails`,
      errors,
    );
    for (const detail of requirement.evidenceDetailKeys) {
      const value = record.evidenceDetails?.[detail];
      if (!hasText(value)) {
        errors.push(`${recordLabel} evidenceDetails.${detail} must be a non-empty input or bounded literal.`);
        continue;
      }
      const allowedLiterals = literalEvidenceDetailValues.get(detail);
      if (allowedLiterals) {
        if (!allowedLiterals.has(value)) {
          errors.push(`${recordLabel} evidenceDetails.${detail} must use a versioned interaction kind.`);
        }
        continue;
      }
      if (releaseLiteralDetailFields.has(detail)) {
        continue;
      }
      if (!resolvedInputs.has(value)) {
        errors.push(`${recordLabel} evidenceDetails.${detail} must name a resolved contract input.`);
      } else if (Array.isArray(record.inputIds) && !record.inputIds.includes(value)) {
        errors.push(`${recordLabel} evidenceDetails.${detail} must also appear in inputIds.`);
      }
    }
  }
  return { byId, minimumState: evidenceStates[minimumStateIndex] };
}

function validateAuthoringPlan(entry, courseModule, resolvedInputs, canonicalBridgePath, errors) {
  const label = `Module ${courseModule.number} authoring plan`;
  requireExactKeys(
    entry?.authoringPlan,
    ["plannedSessionSpine", "plannedCoverage", "promotionBlock"],
    label,
    errors,
  );
  const plan = entry?.authoringPlan;
  const bridgeInputs = [...resolvedInputs.values()].filter(
    ({ kind, path, value }) =>
      kind === "json-pointer" &&
      path === canonicalBridgePath &&
      value?.moduleId === entry.moduleId &&
      Array.isArray(value.sessionSpine),
  );
  if (bridgeInputs.length !== 1) {
    errors.push(`${label} must resolve exactly one canonical prerequisite-session bridge input.`);
  }
  const bridge = bridgeInputs[0]?.value;
  if (!Array.isArray(plan?.plannedSessionSpine) || plan.plannedSessionSpine.length !== 6) {
    errors.push(`Module ${courseModule.number} must declare exactly six planned session IDs.`);
  } else if (!Array.isArray(bridge?.sessionSpine) || bridge.sessionSpine.length !== 6) {
    errors.push(`${label} prerequisite-session bridge must expose exactly six sessions.`);
  } else {
    for (const [index, session] of plan.plannedSessionSpine.entries()) {
      const bridgeSession = bridge.sessionSpine[index];
      const sessionLabel = `Module ${courseModule.number} planned session ${index + 1}`;
      requireExactKeys(session, ["id", "title", "plannedArtifact"], sessionLabel, errors);
      if (session?.id !== bridgeSession?.id || session?.title !== bridgeSession?.title) {
        errors.push(`${sessionLabel} must match the ordered canonical prerequisite-session bridge.`);
      }
      if (
        !hasText(session?.plannedArtifact) ||
        !bridgeSession?.plannedEvidence?.toLowerCase().includes(session.plannedArtifact.toLowerCase())
      ) {
        errors.push(`${sessionLabel} plannedArtifact must remain visible in bridge planned evidence.`);
      }
      if (!hasText(bridgeSession?.progression) || !Array.isArray(bridgeSession?.usesPrerequisiteModuleIds)) {
        errors.push(`${sessionLabel} bridge session must retain progression and prerequisite use.`);
      }
    }
  }

  if (!Array.isArray(plan?.plannedCoverage) || plan.plannedCoverage.length === 0) {
    errors.push(`${label} plannedCoverage must be a non-empty array.`);
  } else {
    const coverageInputs = new Set();
    for (const coverage of plan.plannedCoverage) {
      const coverageLabel = `${label} coverage ${coverage?.inputId ?? "(missing input)"}`;
      requireExactKeys(coverage, ["inputId", "markers"], coverageLabel, errors);
      if (coverageInputs.has(coverage?.inputId)) {
        errors.push(`${coverageLabel} may occur only once.`);
      }
      coverageInputs.add(coverage?.inputId);
      const input = resolvedInputs.get(coverage?.inputId);
      if (!input || input.kind !== "markdown-heading" || !input.text) {
        errors.push(`${coverageLabel} must point to a resolved Markdown contract input.`);
        continue;
      }
      if (!Array.isArray(coverage.markers) || coverage.markers.length === 0) {
        errors.push(`${coverageLabel} must declare one or more markers.`);
        continue;
      }
      if (new Set(coverage.markers).size !== coverage.markers.length) {
        errors.push(`${coverageLabel} markers must be unique.`);
      }
      for (const marker of coverage.markers) {
        if (!hasText(marker) || !input.text.includes(marker)) {
          errors.push(`${coverageLabel} marker ${marker} is not present in its checked-in contract input.`);
        }
      }
    }
  }

  requireExactKeys(
    plan?.promotionBlock,
    ["learnerManifest", "learnerRoute", "humanReview", "releaseEvidence"],
    `${label} promotion block`,
    errors,
  );
  for (const [field, expected] of Object.entries({
    learnerManifest: "absent",
    learnerRoute: "absent",
    humanReview: "not-reviewed",
    releaseEvidence: "not-evidenced",
  })) {
    if (plan?.promotionBlock?.[field] !== expected) {
      errors.push(`${label} promotionBlock.${field} must retain the original ${expected} boundary.`);
    }
  }
}

async function moduleWorkbookPaths(siteRoot, moduleNumber) {
  const filenames = await readdir(resolve(siteRoot, "content", "modules"));
  const prefix = `${String(moduleNumber).padStart(2, "0")}_`;
  return filenames
    .filter((filename) => filename.startsWith(prefix) && filename.endsWith(".md"))
    .map((filename) => resolve(siteRoot, "content", "modules", filename));
}

async function validateVisibleMaterials(
  courseModule,
  resolvedInputs,
  manifest,
  readableModuleIds,
  lifecycle,
  siteRoot,
  errors,
) {
  const label = `Module ${courseModule.number} ${lifecycle} materials`;
  const manifestHasModule = manifest?.modules?.some(
    ({ id, number }) => id === courseModule.id || number === courseModule.number,
  );
  const readable = readableModuleIds.has(courseModule.id);
  if (lifecycle === "authoring-only") {
    if (manifestHasModule || readable) {
      errors.push(`Module ${courseModule.number} is authoring-only but appears in a learner manifest or route.`);
    }
    const workbooks = await moduleWorkbookPaths(siteRoot, courseModule.number);
    if (workbooks.length > 0) {
      errors.push(`Module ${courseModule.number} is authoring-only but has a learner workbook in content/modules.`);
    }
    return;
  }

  if (lifecycle === "review-ready" && (manifestHasModule || readable)) {
    errors.push(`Module ${courseModule.number} review-ready material must remain absent from learner manifests and routes.`);
  }
  if (lifecycle === "published" && (!manifestHasModule || !readable)) {
    errors.push(`Module ${courseModule.number} published material must appear in both the learner manifest and route.`);
  }
  if (!hasText(courseModule.sourceMap)) {
    errors.push(`${label} requires a checked-in canonical source map.`);
  } else {
    await requireTrackedRegularFile(siteRoot, courseModule.sourceMap, `${label} source map`, errors);
    const sourceMapInput = [...resolvedInputs.values()].find(({ path }) => path === courseModule.sourceMap);
    if (!sourceMapInput || sourceMapInput.role !== "course-content") {
      errors.push(`${label} must bind the canonical source map as a course-content contract input.`);
    }
  }
  if (!hasText(courseModule.studioId)) {
    errors.push(`${label} requires a studio or equivalent interaction ID.`);
  }
  const workbooks = await moduleWorkbookPaths(siteRoot, courseModule.number);
  if (workbooks.length !== 1) {
    errors.push(`${label} requires exactly one workbook; found ${workbooks.length}.`);
    return;
  }
  const workbookPath = workbooks[0];
  const workbookRepositoryPath = relative(siteRoot, workbookPath).replaceAll("\\", "/");
  await requireTrackedRegularFile(siteRoot, workbookRepositoryPath, `${label} workbook`, errors);
  const workbookInput = [...resolvedInputs.values()].find(({ path }) => path === workbookRepositoryPath);
  if (!workbookInput || workbookInput.role !== "course-content") {
    errors.push(`${label} must bind its workbook as a course-content contract input.`);
  }
  const markdown = await readFile(workbookPath, "utf8").catch((error) => {
    errors.push(`${label} workbook cannot be read: ${error.message}`);
    return "";
  });
  const sessions = new Set(
    [...markdown.matchAll(/\bSession\s+([1-6])\b/giu)].map((match) => Number(match[1])),
  );
  for (const sessionNumber of [1, 2, 3, 4, 5, 6]) {
    if (!sessions.has(sessionNumber)) {
      errors.push(`${label} workbook is missing Session ${sessionNumber}.`);
    }
  }
}

async function validateDeliveredSessionMap(
  entry,
  courseModule,
  resolvedInputs,
  lifecycle,
  bridgeEntry,
  siteRoot,
  errors,
) {
  const label = `Module ${courseModule.number} ${lifecycle} delivery map`;
  if (lifecycle === "authoring-only") {
    if (entry?.deliveryMapInputId !== null) {
      errors.push(`${label} must remain null while the module has no delivered learner material.`);
    }
    return;
  }

  if (!hasText(entry?.deliveryMapInputId)) {
    errors.push(`${label} must name a candidate-hashed delivery-map contract input.`);
    return;
  }
  const input = resolvedInputs.get(entry.deliveryMapInputId);
  if (!input || input.role !== "course-content" || input.kind !== "file" || extname(input.path) !== ".json") {
    errors.push(`${label} must resolve a course-content JSON file input.`);
    return;
  }
  const workbooks = await moduleWorkbookPaths(siteRoot, courseModule.number);
  if (workbooks.length !== 1 || !hasText(courseModule.sourceMap)) {
    errors.push(`${label} cannot bind material until the workbook and source map resolve uniquely.`);
    return;
  }
  const workbookPath = relative(siteRoot, workbooks[0]).replaceAll("\\", "/");
  let deliveryMap;
  try {
    deliveryMap = JSON.parse(await readFile(input.absolutePath, "utf8"));
  } catch (error) {
    errors.push(`${label} cannot read JSON: ${error.message}`);
    return;
  }
  try {
    validateAdvancedModuleDeliveryMap(deliveryMap, {
      courseModule,
      bridgeEntry,
      workbookPath,
      sourceMapPath: courseModule.sourceMap,
    });
  } catch (error) {
    errors.push(`${label} must preserve the canonical delivered-session topology: ${error.message}`);
  }
}

function validateInteractionEvidence(entry, evidence, resolvedInputs, lifecycle, errors) {
  if (lifecycle === "authoring-only") {
    return;
  }
  const record = evidence.byId.get("studio-reference-model-and-teaching-tests");
  const label = `Module ${entry.moduleId} interaction evidence`;
  if (!record || !record.evidenceDetails) {
    errors.push(`${label} must be structurally detailed before review or publication.`);
    return;
  }
  const implementation = resolvedInputs.get(record.evidenceDetails["implementation-path"]);
  const referenceModel = resolvedInputs.get(record.evidenceDetails["reference-model-path"]);
  const teachingTest = resolvedInputs.get(record.evidenceDetails["teaching-test-path"]);
  if (!implementation || implementation.role !== "source-code") {
    errors.push(`${label} implementation-path must resolve to a source-code contract input.`);
  }
  if (!referenceModel || referenceModel.role !== "course-content") {
    errors.push(`${label} reference-model-path must resolve to a course-content contract input.`);
  }
  if (!teachingTest || teachingTest.role !== "test") {
    errors.push(`${label} teaching-test-path must resolve to a test contract input.`);
  }
}

async function resolveReleaseRecord(entry, siteRoot, resolvedInputs, errors) {
  const label = `Module ${entry?.moduleId ?? "(missing moduleId)"} release record`;
  requireExactKeys(
    entry?.release,
    [
      "sourceCommit",
      "candidateInputIds",
      "provenancePath",
      "sourceReviewPath",
      "ciRunUrl",
      "privateDeploymentVersion",
      "knownLimitationsPath",
    ],
    label,
    errors,
  );
  const sourceCommit = entry?.release?.sourceCommit;
  if (!/^[0-9a-f]{40}$/u.test(sourceCommit ?? "")) {
    errors.push(`${label}.sourceCommit must be a full Git SHA.`);
  } else {
    const exists = await execFileAsync("git", ["cat-file", "-e", `${sourceCommit}^{commit}`], {
      cwd: siteRoot,
    })
      .then(() => true)
      .catch(() => false);
    if (!exists) {
      errors.push(`${label}.sourceCommit must resolve to a local Git commit.`);
    } else {
      const isAncestor = await execFileAsync(
        "git",
        ["merge-base", "--is-ancestor", sourceCommit, "HEAD"],
        { cwd: siteRoot },
      )
        .then(() => true)
        .catch(() => false);
      if (!isAncestor) {
        errors.push(`${label}.sourceCommit must be an ancestor of the recorded provenance commit.`);
      }
      const { stdout: head } = await execFileAsync("git", ["rev-parse", "HEAD"], {
        cwd: siteRoot,
      });
      if (sourceCommit === head.trim()) {
        errors.push(`${label}.sourceCommit must be a strict ancestor of the recorded provenance commit.`);
      }
    }
  }

  const expectedCandidateInputIds = [...resolvedInputs.values()]
    .filter(({ role }) => role !== "provenance")
    .map(({ id }) => id)
    .sort();
  if (!sameOrderedValues(entry?.release?.candidateInputIds, expectedCandidateInputIds)) {
    errors.push(`${label}.candidateInputIds must exactly name the sorted non-provenance contract inputs.`);
  }
  if (/^[0-9a-f]{40}$/u.test(sourceCommit ?? "")) {
    for (const input of resolvedInputs.values()) {
      if (input.role === "provenance") {
        continue;
      }
      const existsAtCandidate = await execFileAsync(
        "git",
        ["cat-file", "-e", `${sourceCommit}:${input.path}`],
        { cwd: siteRoot },
      )
        .then(() => true)
        .catch(() => false);
      if (!existsAtCandidate) {
        errors.push(`${label} candidate sourceCommit does not contain contract input ${input.id}.`);
        continue;
      }
      const unchangedSinceCandidate = await execFileAsync(
        "git",
        ["diff", "--quiet", sourceCommit, "--", input.path],
        { cwd: siteRoot },
      )
        .then(() => true)
        .catch(() => false);
      if (!unchangedSinceCandidate) {
        errors.push(`${label} contract input ${input.id} must match its sourceCommit blob.`);
      }
    }
  }

  const paths = [];
  const normalizedPaths = {};
  for (const field of ["provenancePath", "sourceReviewPath", "knownLimitationsPath"]) {
    const repositoryPath = normalizedRepositoryPath(entry?.release?.[field], `${label}.${field}`, errors);
    if (!repositoryPath) {
      continue;
    }
    const expectedPath = advancedReleaseDocumentationPath(entry?.moduleId, field);
    if (repositoryPath !== expectedPath) {
      errors.push(`${label}.${field} must use its exact module-scoped evidence slot.`);
    }
    await requireTrackedRegularFile(siteRoot, repositoryPath, `${label}.${field}`, errors);
    normalizedPaths[field] = repositoryPath;
    paths.push(resolve(siteRoot, repositoryPath));
    const matchingInput = [...resolvedInputs.values()].find(({ path }) => path === repositoryPath);
    if (!matchingInput || matchingInput.role !== "provenance") {
      errors.push(`${label}.${field} must be declared as a provenance contract input.`);
    }
  }
  if (!/^https:\/\/github\.com\/[^/]+\/[^/]+\/actions\/runs\/\d+$/u.test(entry?.release?.ciRunUrl ?? "")) {
    errors.push(`${label}.ciRunUrl must be a GitHub Actions run URL.`);
  }
  if (!hasText(entry?.release?.privateDeploymentVersion)) {
    errors.push(`${label}.privateDeploymentVersion must be a non-empty deployment identifier.`);
  }
  for (const field of ["provenancePath", "sourceReviewPath"]) {
    const repositoryPath = normalizedPaths[field];
    if (!repositoryPath || !hasText(sourceCommit) || !hasText(entry?.release?.ciRunUrl)) {
      continue;
    }
    const text = await readFile(resolve(siteRoot, repositoryPath), "utf8").catch((error) => {
      errors.push(`${label}.${field} cannot be read: ${error.message}`);
      return "";
    });
    if (!text.includes(sourceCommit) || !text.includes(entry.release.ciRunUrl)) {
      errors.push(`${label}.${field} must visibly bind the sourceCommit and ciRunUrl.`);
    }
  }
  return { ...entry?.release, ...normalizedPaths, paths };
}

function validateReleaseEvidenceBindings(entry, evidence, release, resolvedInputs, errors) {
  const record = evidence.byId.get("release-provenance-ci-and-deployment-evidence");
  const label = `Module ${entry.moduleId} release-provenance evidence`;
  if (!record?.evidenceDetails || !release) {
    errors.push(`${label} must bind a structured release record.`);
    return;
  }
  for (const [detail, field] of releaseLiteralDetailFields) {
    if (record.evidenceDetails[detail] !== release[field]) {
      errors.push(`${label} evidenceDetails.${detail} must equal release.${field}.`);
    }
  }
  for (const [detail, field] of releasePathDetailFields) {
    const input = resolvedInputs.get(record.evidenceDetails[detail]);
    if (!input || input.role !== "provenance" || input.path !== release[field]) {
      errors.push(`${label} evidenceDetails.${detail} must bind release.${field} through a contract input.`);
    }
  }
}

function validateLifecycleEvidence(entry, evidence, lifecycle, errors) {
  const label = `advanced module-contract entry ${entry.moduleId}`;
  const records = [...evidence.byId.values()];
  if (lifecycle === "authoring-only") {
    if (records.some(({ state }) => !["planned", "pointer-present"].includes(state))) {
      errors.push(`${label} authoring-only state may contain only planned or pointer-present evidence.`);
    }
    return;
  }
  if (lifecycle === "review-ready") {
    for (const record of records) {
      const expected =
        record.id === "release-provenance-ci-and-deployment-evidence" ? "planned" : "reviewed";
      if (record.state !== expected) {
        errors.push(`${label} review-ready state requires ${expected} evidence for ${record.id}.`);
      }
    }
    return;
  }
  if (records.some(({ state }) => state !== "release-ready")) {
    errors.push(`${label} published state requires every evidence record to be release-ready.`);
  }
}

export function advancedModuleContractPath(siteRoot = defaultSiteRoot) {
  return resolve(siteRoot, advancedModuleContractRelativePath);
}

export async function loadAdvancedModuleContractRegistry(siteRoot = defaultSiteRoot) {
  return JSON.parse(await readFile(advancedModuleContractPath(siteRoot), "utf8"));
}

/**
 * A passing result proves only checked-in structure and state relationships.
 * Human review, GitHub CI, private deployment, and learner mastery remain
 * distinct evidence that must be recorded outside this local structural gate.
 */
export async function validateAdvancedModuleContractRegistry(
  graph,
  registry,
  {
    siteRoot = defaultSiteRoot,
    learnerManifest = null,
    learnerReadableModuleIds = null,
    canonicalBridgeLedger = null,
  } = {},
) {
  const errors = [];
  requireExactKeys(
    registry,
    [
      "schemaVersion",
      "contractVersion",
      "kind",
      "purpose",
      "canonicalCourseGraph",
      "canonicalAuthoringBridge",
      "truthBoundary",
      "contractStates",
      "evidenceStates",
      "humanReviewDimensions",
      "evidenceRequirements",
      "scopeModuleIds",
      "modules",
    ],
    "advanced module-contract registry",
    errors,
  );
  if (registry?.schemaVersion !== 1 || registry?.contractVersion !== "v1") {
    errors.push("advanced module-contract registry must use schemaVersion 1 and contractVersion v1.");
  }
  if (registry?.kind !== "atlas-advanced-module-contract-registry") {
    errors.push("advanced module-contract registry has an invalid kind.");
  }
  if (!hasText(registry?.purpose) || registry?.canonicalCourseGraph !== "content/course/course-graph.v2.json") {
    errors.push("advanced module-contract registry must declare its purpose and canonical course graph.");
  }
  if (registry?.canonicalAuthoringBridge !== advancedModuleBridgeRelativePath) {
    errors.push("advanced module-contract registry must bind the canonical advanced prerequisite-session bridge.");
  }
  requireExactKeys(
    registry?.truthBoundary,
    ["pointerPresent", "reviewReady", "published"],
    "advanced module-contract truthBoundary",
    errors,
  );
  for (const field of ["pointerPresent", "reviewReady", "published"]) {
    if (!hasText(registry?.truthBoundary?.[field])) {
      errors.push(`advanced module-contract truthBoundary.${field} must be a non-empty statement.`);
    }
  }
  if (!sameOrderedValues(registry?.contractStates, contractStates)) {
    errors.push("advanced module-contract registry must use the versioned contract-state sequence.");
  }
  if (!sameOrderedValues(registry?.evidenceStates, evidenceStates)) {
    errors.push("advanced module-contract registry must use the versioned evidence-state sequence.");
  }
  if (!sameOrderedValues(registry?.humanReviewDimensions, humanReviewDimensions)) {
    errors.push("advanced module-contract registry must use the versioned human-review dimensions.");
  }
  const requirementById = validateEvidenceRequirementDefinitions(registry, errors);

  const graphModules = Array.isArray(graph?.modules) ? graph.modules : [];
  const advancedModules = graphModules
    .filter(({ number }) => Number.isInteger(number) && number >= 31 && number <= 36)
    .sort((left, right) => left.number - right.number);
  if (advancedModules.length !== 6) {
    errors.push("canonical course graph must define exactly Modules 31–36 for the advanced contract.");
  }
  const expectedScopeIds = advancedModules.map(({ id }) => id);
  if (!sameOrderedValues(registry?.scopeModuleIds, expectedScopeIds)) {
    errors.push("advanced module-contract scopeModuleIds must match Modules 31–36 exactly.");
  }
  if (!Array.isArray(registry?.modules) || registry.modules.length === 0) {
    errors.push("advanced module-contract registry must define at least one module entry.");
    advancedContractFailure(errors);
  }

  let manifest = learnerManifest;
  if (manifest === null) {
    try {
      manifest = JSON.parse(await readFile(resolve(siteRoot, "content", "modules", "manifest.json"), "utf8"));
    } catch (error) {
      errors.push(`advanced module-contract registry cannot read the canonical manifest: ${error.message}`);
    }
  }
  let readableModuleIds = new Set();
  if (learnerReadableModuleIds !== null) {
    if (!Array.isArray(learnerReadableModuleIds)) {
      errors.push("advanced module-contract learnerReadableModuleIds must be an array when supplied.");
    } else {
      readableModuleIds = new Set(learnerReadableModuleIds);
    }
  } else {
    try {
      readableModuleIds = new Set(projectReaderModules(graph).map(({ id }) => id));
    } catch (error) {
      errors.push(`advanced module-contract registry cannot project learner routes: ${error.message}`);
    }
  }

  let bridgeLedger = canonicalBridgeLedger;
  let bridgeTopologyValidated = false;
  try {
    bridgeLedger ??= await loadAdvancedModuleBridgeLedger(siteRoot);
    validateAdvancedModuleBridgeTopology(graph, bridgeLedger);
    bridgeTopologyValidated = true;
  } catch (error) {
    errors.push(
      `Lifecycle-aware advanced contracts must preserve canonical bridge topology: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
  const bridgeEntriesByModuleId = new Map(
    Array.isArray(bridgeLedger?.modules)
      ? bridgeLedger.modules.map((bridgeEntry) => [bridgeEntry?.moduleId, bridgeEntry])
      : [],
  );

  const graphById = new Map(graphModules.map((courseModule) => [courseModule.id, courseModule]));
  const entriesByModuleId = new Map();
  const reportModules = [];
  const releaseInputPaths = new Set([advancedModuleContractPath(siteRoot)]);
  const provenanceDocumentationPaths = new Set(historicalAdvancedProvenanceLedgerPaths);
  for (const repositoryPath of historicalAdvancedProvenanceLedgerPaths) {
    releaseInputPaths.add(resolve(siteRoot, repositoryPath));
  }
  let plannedContracts = 0;
  let pointerPresentContracts = 0;
  let reviewedContracts = 0;
  let releaseReadyContracts = 0;
  let resolvedContractInputs = 0;

  for (const entry of registry.modules) {
    const entryLabel = `advanced module-contract entry ${entry?.moduleId ?? "(missing moduleId)"}`;
    if (!hasText(entry?.moduleId) || entriesByModuleId.has(entry.moduleId)) {
      errors.push(`${entryLabel} moduleId values must be present and unique.`);
      continue;
    }
    entriesByModuleId.set(entry.moduleId, entry);
    const courseModule = graphById.get(entry.moduleId);
    if (!courseModule || !expectedScopeIds.includes(entry.moduleId)) {
      errors.push(`${entryLabel} must correspond to an advanced graph module.`);
      continue;
    }
    requireExactKeys(
      entry,
      [
        "moduleId",
        "contractState",
        "publicationEffect",
        "graphSnapshot",
        "contractInputs",
        "deliveryMapInputId",
        "authoringPlan",
        "humanReview",
        "evidence",
        "release",
      ],
      entryLabel,
      errors,
    );
    const lifecycle = entry.contractState;
    if (!contractStates.includes(lifecycle)) {
      errors.push(`${entryLabel} contractState is not recognized.`);
      continue;
    }
    const expectedPublicationEffect = lifecycle === "published" ? "published" : "none";
    if (entry.publicationEffect !== expectedPublicationEffect) {
      errors.push(
        `${entryLabel} may not claim an eligible-for-publication effect before the graph and full release contract are published.`,
      );
    }
    if (
      (lifecycle === "authoring-only" || lifecycle === "review-ready") &&
      (courseModule.state?.lifecycle !== "authoring-only" ||
        courseModule.state?.availability !== "authoring-only")
    ) {
      errors.push(`${entryLabel} ${lifecycle} state must remain authoring-only and unavailable to learners.`);
    }
    if (
      lifecycle === "published" &&
      (courseModule.state?.lifecycle !== "learner-material-ready" ||
        courseModule.state?.availability !== "published")
    ) {
      errors.push(`${entryLabel} published state must match a published graph module.`);
    }
    validateGraphSnapshot(courseModule, entry.graphSnapshot, lifecycle, errors);

    const inputs = await resolveContractInputs(entry, siteRoot, errors);
    for (const path of inputs.ledgerInputPaths) {
      releaseInputPaths.add(path);
    }
    for (const path of inputs.provenanceDocumentationPaths) {
      provenanceDocumentationPaths.add(relative(siteRoot, path).replaceAll("\\", "/"));
    }
    validateAuthoringPlan(
      entry,
      courseModule,
      inputs.resolvedInputs,
      registry?.canonicalAuthoringBridge,
      errors,
    );
    const review = validateHumanReview(entry, errors);
    const evidence = validateEvidence(entry, requirementById, inputs.resolvedInputs, errors);
    validateLifecycleEvidence(entry, evidence, lifecycle, errors);
    await validateVisibleMaterials(
      courseModule,
      inputs.resolvedInputs,
      manifest,
      readableModuleIds,
      lifecycle,
      siteRoot,
      errors,
    );
    await validateDeliveredSessionMap(
      entry,
      courseModule,
      inputs.resolvedInputs,
      lifecycle,
      bridgeEntriesByModuleId.get(entry.moduleId),
      siteRoot,
      errors,
    );

    if (lifecycle === "authoring-only") {
      if (!review.allPending) {
        errors.push(`${entryLabel} may not record human approval before publication.`);
      }
      if (entry.release !== null) {
        errors.push(`${entryLabel} may not declare a release record before publication.`);
      }
      if (evidence.minimumState === "planned") {
        plannedContracts += 1;
      } else {
        pointerPresentContracts += 1;
      }
    }
    if (lifecycle === "review-ready") {
      if (!review.allPending) {
        errors.push(`${entryLabel} review-ready state records structure, not human approval.`);
      }
      if (entry.release !== null) {
        errors.push(`${entryLabel} review-ready state may not declare a release record.`);
      }
      validateInteractionEvidence(entry, evidence, inputs.resolvedInputs, lifecycle, errors);
      reviewedContracts += 1;
    }
    if (lifecycle === "published") {
      if (!review.allApproved) {
        errors.push(`${entryLabel} published state requires approval for every human-review dimension.`);
      }
      validateInteractionEvidence(entry, evidence, inputs.resolvedInputs, lifecycle, errors);
      const release = await resolveReleaseRecord(entry, siteRoot, inputs.resolvedInputs, errors);
      for (const path of release.paths ?? []) {
        releaseInputPaths.add(path);
      }
      validateReleaseEvidenceBindings(entry, evidence, release, inputs.resolvedInputs, errors);
      releaseReadyContracts += 1;
    }
    resolvedContractInputs += inputs.resolvedInputs.size;
    reportModules.push({
      moduleId: entry.moduleId,
      contractState: lifecycle,
      publicationEffect: entry.publicationEffect,
      promotionBlock: entry.authoringPlan?.promotionBlock ?? null,
      resolvedContractInputs: inputs.resolvedInputs.size,
    });
  }

  const advancedLifecycleHasTransitioned = advancedModules.some(
    ({ state }) => state?.lifecycle !== "authoring-only",
  );
  if (advancedLifecycleHasTransitioned && !sameMembers([...entriesByModuleId.keys()], expectedScopeIds)) {
    errors.push(
      "A transitioned advanced lifecycle requires lifecycle-aware contract entries for all Modules 31–36 before the legacy bridge can become historical-only validation evidence.",
    );
  }
  for (const courseModule of advancedModules) {
    if (courseModule.state?.lifecycle !== "authoring-only" && !entriesByModuleId.has(courseModule.id)) {
      errors.push(`transitioned advanced Module ${courseModule.number} requires a lifecycle-aware contract entry.`);
    }
  }
  advancedContractFailure(errors);
  return {
    registry,
    modules: reportModules,
    releaseInputPaths: [...releaseInputPaths],
    provenanceDocumentationPaths: [...provenanceDocumentationPaths].sort(),
    legacyBridgeValidationRequired: !advancedLifecycleHasTransitioned,
    bridgeTopologyValidated,
    summary: {
      authoringOnlyContracts: reportModules.filter(({ contractState }) => contractState === "authoring-only").length,
      plannedContracts,
      pointerPresentContracts,
      reviewedContracts,
      releaseReadyContracts,
      resolvedContractInputs,
    },
  };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [registry, graph] = await Promise.all([
    loadAdvancedModuleContractRegistry(),
    (async () => JSON.parse(await readFile(resolve(defaultSiteRoot, "content/course/course-graph.v2.json"), "utf8")))(),
  ]);
  const report = await validateAdvancedModuleContractRegistry(graph, registry);
  console.log(
    `Advanced module contract: ${report.summary.authoringOnlyContracts} authoring-only, ${report.summary.reviewedContracts} review-ready, ${report.summary.releaseReadyContracts} published; ${report.summary.resolvedContractInputs} resolved contract inputs.`,
  );
}
