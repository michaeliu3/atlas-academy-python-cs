import { createHash } from "node:crypto";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { validateCourseGraph } from "./course-graph.mjs";
import {
  criterionIds,
  moduleContractRegistryRelativePath,
  promotionEvidenceRoleErrors,
  promotionEvidenceScopeErrors,
  promotionEvidenceTestErrors,
  promotionLearningCompanionErrors,
  promotionVisualAlternativeErrors,
  validateModuleContractRegistry,
} from "./module-contract-registry.mjs";
import {
  legacyCandidatePreflightProfilesRelativePath,
  loadLegacyCandidatePreflightProfiles,
  validateLegacyCandidatePreflightProfiles,
} from "./legacy-candidate-preflight-profiles.mjs";
import {
  combineModuleContractPacketReports,
  legacyModuleContractPacketRelativePath,
  moduleContractCandidatePacketRelativePath,
  validateLegacyModuleContractPacketRegistry,
  validateModuleContractCandidatePacketRegistry,
} from "./legacy-module-contract-packet.mjs";
import {
  browserTestConfigPath,
  browserTestRunnerCommand,
  browserTestRunnerLocator,
  browserTestRunnerPath,
  loadModuleEvidenceRecord,
  readTrackedText,
  validateModuleEvidenceRecord,
} from "./module-review-evidence.mjs";
import {
  GitIndexSnapshotError,
  assertGitIndexSnapshotForSiteRoot,
  openGitIndexSnapshot,
} from "./git-index-snapshot.mjs";
import { advancedModuleBridgeRelativePath } from "./advanced-module-bridge.mjs";
import { validateAdvancedAuthoringDeliveryMap } from "./advanced-module-delivery-map.mjs";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const defaultSiteRoot = resolve(scriptDirectory, "..");
const canonicalCourseGraphPath = "content/course/course-graph.v2.json";
const canonicalModuleManifestPath = "content/modules/manifest.json";

export const moduleEvidencePreflightDirectoryRelativePath =
  "content/course/contracts/evidence-preflight";
export const moduleEvidencePreflightKind = "atlas-module-evidence-preflight";
export const moduleEvidencePreflightRecordVersion = "v1";

const preflightKeys = [
  "schemaVersion",
  "kind",
  "recordVersion",
  "moduleId",
  "purpose",
  "truthBoundary",
  "state",
  "evidenceRecordPath",
  "openCriterionIds",
  "promotionBlockers",
];
const truthBoundaryKeys = ["candidate", "review", "release"];
const candidateState = "candidate-not-promoting";
const requiredM29OpenCriterionIds = ["release-provenance-ci-and-deployment-evidence"];
const requiredM29PromotionBlockers = [
  "human-review",
  "review-ready-commit",
  "source-commit-ci-run",
  "private-deployment-record",
];
const requiredM31OpenCriterionIds = ["release-provenance-ci-and-deployment-evidence"];
const requiredM31PromotionBlockers = [
  "human-review",
  "review-ready-commit",
  "source-commit-ci-run",
  "private-deployment-record",
  "learner-delivery-review",
];
const expectedM29PreflightReleaseBoundary =
  "This record is not CI, source-commit, private-deployment, security, release, or publication evidence. The required release criterion remains explicitly open.";
const expectedM29EvidenceRecordReleaseBoundary =
  "This candidate record is not a CI result, source-review record, deployment record, private release, security clearance, or publication claim.";
const expectedM29ReleaseCriterionClaim =
  "This candidate-only preflight and its documentation state their own scope: they do not bind or establish human-review, source-commit CI, deployment, or release evidence from local files.";
const expectedM29ReleaseCriterionLimitation =
  "This record does not itself bind a CI run, human source review, deployment record, release record, or publication evidence; the release criterion remains open.";
const expectedM31PreflightReleaseBoundary =
  "This record is not CI, source-commit, private-deployment, security, release, or publication evidence. M31 remains authoring-only, hidden from the reader, and unreleased; the required release criterion remains explicitly open.";
const expectedM31EvidenceRecordReleaseBoundary =
  "This candidate record is not CI, source-commit, security, private-deployment, release, publication, or GitHub provenance evidence. M31 remains authoring-only, hidden from the reader, and unreleased.";
const expectedM31ReleaseCriterionClaim =
  "This candidate-only package and its documentation state their own non-release boundary: they do not bind or establish human review, exact-source-commit CI, a canonical learner source-map or learner-delivery binding, deployment, or publication evidence for hidden M31 material.";
const expectedM31ReleaseCriterionLimitation =
  "This record does not bind a human review, canonical learner-delivery/source-map decision, CI run, source review, deployment record, release record, or publication evidence; the release criterion remains open.";
const expectedM31CandidateDocumentationPath = "docs/module-evidence/m31/candidate-preflight.md";
const expectedM31CandidateDocumentationDigest =
  "sha256:d33e105b3fecf19cfb41d16e15e444db671a6cf5fc2964d7f800575309eac01c";
const expectedM31AuthoringWorkbookPath =
  "content/authoring/m31_optimization_information_workbook.v1.md";
const expectedM31AuthoringDeliveryMapPath =
  "content/course/contracts/authoring-delivery/m31.v1.json";
const expectedM31AuthoringSourcePlanPath =
  "content/source-maps/module31_optimization_information_source_map.md";
const expectedM31AuthoringSourceMapPaths = new Set([
  expectedM31AuthoringSourcePlanPath,
  "content/source-maps/module31_optimization_information_source_audit.md",
]);
const expectedM31AuthoringModelPath = "lib/m31-optimization-authoring-model.js";
const expectedM31AuthoringModelTestPath = "tests/m31-optimization-authoring-model.test.mjs";
const expectedM31AuthoringVisualTestPath = "tests/m31-authoring-workbook.test.mjs";

const m31CandidatePreflightProfile = Object.freeze({
  moduleId: "m31",
  state: "authoring-only-candidate-not-promoting",
  evidenceRecordPath: "content/course/contracts/evidence/m31.v1.json",
  openCriterionIds: requiredM31OpenCriterionIds,
  promotionBlockers: requiredM31PromotionBlockers,
  preflightReleaseBoundary: expectedM31PreflightReleaseBoundary,
  evidenceRecordReleaseBoundary: expectedM31EvidenceRecordReleaseBoundary,
  releaseCriterionClaim: expectedM31ReleaseCriterionClaim,
  releaseCriterionLimitation: expectedM31ReleaseCriterionLimitation,
  candidateDocumentationPath: expectedM31CandidateDocumentationPath,
  candidateDocumentationAnchor: "authoring-candidate-boundary",
  candidateDocumentationDigest: expectedM31CandidateDocumentationDigest,
  scope: "authoring-only",
});

/**
 * The profile data itself is versioned and allowlisted; policy that could
 * accidentally close the release criterion remains code-owned and identical
 * for every legacy candidate. A profile can therefore add structural input
 * scope but cannot create promotion authority.
 */
function legacyCandidatePreflightProfile(candidate) {
  if (!candidate) return null;
  return Object.freeze({
    ...candidate,
    state: candidateState,
    evidenceRecordPath: `content/course/contracts/evidence/${candidate.moduleId}.v1.json`,
    openCriterionIds: requiredM29OpenCriterionIds,
    promotionBlockers: requiredM29PromotionBlockers,
    preflightReleaseBoundary: expectedM29PreflightReleaseBoundary,
    evidenceRecordReleaseBoundary: expectedM29EvidenceRecordReleaseBoundary,
    releaseCriterionClaim: expectedM29ReleaseCriterionClaim,
    releaseCriterionLimitation: expectedM29ReleaseCriterionLimitation,
    scope: "legacy-canonical",
  });
}

function candidatePreflightProfile(moduleId, legacyCandidateProfiles = null) {
  if (moduleId === "m31") return m31CandidatePreflightProfile;
  return legacyCandidatePreflightProfile(
    legacyCandidateProfiles?.candidateByModuleId?.get(moduleId) ?? null,
  );
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function hasText(value) {
  return typeof value === "string" && value.trim() !== "";
}

function graphWithoutDerivedProjection(graph) {
  if (!isPlainObject(graph)) return graph;
  const canonicalGraph = { ...graph };
  delete canonicalGraph.routePlan;
  delete canonicalGraph.sequence;
  return canonicalGraph;
}

function candidateContextLabel(profile) {
  const moduleLabel = profile.moduleId.toUpperCase();
  return profile.scope === "authoring-only"
    ? `${moduleLabel} authoring candidate`
    : `${moduleLabel} candidate`;
}

function suppliedCandidateContextMatchesSnapshot(
  profile,
  suppliedGraph,
  suppliedRegistry,
  suppliedManifest,
  context,
  errors,
) {
  const label = candidateContextLabel(profile);
  if (
    suppliedGraph !== null &&
    JSON.stringify(graphWithoutDerivedProjection(suppliedGraph)) !== JSON.stringify(context.graph)
  ) {
    errors.push(`${label} supplied graph must match its captured Git-index graph context.`);
  }
  if (
    suppliedRegistry !== null &&
    JSON.stringify(suppliedRegistry) !== JSON.stringify(context.registry)
  ) {
    errors.push(`${label} supplied registry must match its captured Git-index registry context.`);
  }
  if (
    suppliedManifest !== null &&
    JSON.stringify(suppliedManifest) !== JSON.stringify(context.manifest)
  ) {
    errors.push(`${label} supplied manifest must match its captured Git-index manifest context.`);
  }
}

/**
 * State is evidence for every candidate: a staged reader or release transition
 * cannot be hidden by restoring an older worktree copy. The context deliberately
 * captures the graph, v3 registry, and generated reader manifest from one Git
 * snapshot before a structural candidate can read its evidence inputs.
 */
export async function loadCandidateStateContextFromSnapshot(
  siteRoot,
  snapshot,
  errors,
  { label = "Candidate" } = {},
) {
  const contextPaths = [
    canonicalCourseGraphPath,
    moduleContractRegistryRelativePath,
    canonicalModuleManifestPath,
  ];
  try {
    await assertGitIndexSnapshotForSiteRoot(snapshot, siteRoot);
    await snapshot.assertClean(contextPaths);
    const [graphRecord, registryRecord, manifestRecord] = await Promise.all(
      contextPaths.map((repositoryPath) => snapshot.readJson(repositoryPath)),
    );
    const graph = graphRecord.value;
    const registry = registryRecord.value;
    const manifest = manifestRecord.value;
    validateCourseGraph(graph);
    if (!isPlainObject(registry) || !Array.isArray(registry.modules)) {
      throw new Error(`${label} Git-index registry context must contain a modules array.`);
    }
    if (!isPlainObject(manifest) || !Array.isArray(manifest.modules)) {
      throw new Error(`${label} Git-index manifest context must contain a modules array.`);
    }
    return {
      graph,
      registry,
      manifest,
      records: Object.freeze({
        graph: graphRecord,
        registry: registryRecord,
        manifest: manifestRecord,
      }),
    };
  } catch (error) {
    const errorCode = error instanceof GitIndexSnapshotError ? ` (${error.code})` : "";
    errors.push(
      `${label} could not capture its graph, registry, and manifest state context from one immutable Git-index snapshot${errorCode}: ${error instanceof Error ? error.message : String(error)}`,
    );
    return null;
  }
}

// Kept as a narrow compatibility export for M31-focused tests and callers.
export function loadM31AuthoringStateContextFromSnapshot(siteRoot, snapshot, errors) {
  return loadCandidateStateContextFromSnapshot(siteRoot, snapshot, errors, {
    label: "M31 authoring candidate",
  });
}

function exactKeys(value, expectedKeys, label, errors) {
  if (!isPlainObject(value)) {
    errors.push(`${label} must be an object.`);
    return false;
  }
  const actual = Object.keys(value).sort();
  const expected = [...expectedKeys].sort();
  if (actual.length !== expected.length || actual.some((key, index) => key !== expected[index])) {
    errors.push(`${label} must use exactly these keys: ${expected.join(", ")}.`);
    return false;
  }
  return true;
}

function sameOrderedValues(actual, expected) {
  return (
    Array.isArray(actual) &&
    actual.length === expected.length &&
    actual.every((value, index) => value === expected[index])
  );
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
      (key, index) =>
        key === rightKeys[index] && sameJsonValue(left[key], right[key]),
    )
  );
}

function addSnapshotInputPath(paths, siteRoot, path, label, errors) {
  if (typeof path !== "string" || path.trim() === "") {
    errors.push(`${label} must resolve to a non-empty repository path.`);
    return;
  }
  const repositoryPath = relative(siteRoot, resolve(siteRoot, path)).replaceAll("\\", "/");
  if (
    repositoryPath === "" ||
    repositoryPath.startsWith("../") ||
    repositoryPath.includes(":") ||
    repositoryPath.includes("\\") ||
    repositoryPath.split("/").some((part) => part === "" || part === "." || part === "..")
  ) {
    errors.push(`${label} must resolve inside the candidate Git worktree.`);
    return;
  }
  paths.add(repositoryPath);
}

/**
 * Production-style validation refuses caller-injected JSON that differs from
 * the captured source. The scope-specific overrides keep structural negative
 * tests possible, but neither override is a provenance-grade entry point.
 */
async function validateSuppliedCandidateArtifactsMatchSnapshot(
  profile,
  preflight,
  suppliedEvidenceRecord,
  siteRoot,
  snapshot,
  errors,
) {
  const label = candidateContextLabel(profile);
  const preflightPath = moduleEvidencePreflightRelativePath(profile.moduleId);
  const artifactPaths = [preflightPath];
  if (suppliedEvidenceRecord !== null) artifactPaths.push(profile.evidenceRecordPath);
  let canonicalPreflight = null;
  let canonicalEvidenceRecord = null;
  try {
    await assertGitIndexSnapshotForSiteRoot(snapshot, siteRoot);
    await snapshot.assertClean(artifactPaths);
    canonicalPreflight = (await snapshot.readJson(preflightPath)).value;
    if (!sameJsonValue(preflight, canonicalPreflight)) {
      errors.push(`${label} supplied preflight must match its captured Git-index preflight record.`);
    }
    if (suppliedEvidenceRecord !== null) {
      canonicalEvidenceRecord = (
        await snapshot.readJson(profile.evidenceRecordPath)
      ).value;
      if (!sameJsonValue(suppliedEvidenceRecord, canonicalEvidenceRecord)) {
        errors.push(`${label} supplied evidence record must match its captured Git-index evidence record.`);
      }
    }
  } catch (error) {
    const errorCode = error instanceof GitIndexSnapshotError ? ` (${error.code})` : "";
    errors.push(
      `${label} could not capture its supplied artifact context from one immutable Git-index snapshot${errorCode}: ${error instanceof Error ? error.message : String(error)}`,
    );
    return null;
  }
  return Object.freeze({ canonicalPreflight, canonicalEvidenceRecord });
}

function preflightFailure(errors) {
  if (errors.length > 0) {
    throw new Error(`Module evidence preflight failed:\n- ${errors.join("\n- ")}`);
  }
}

export function moduleEvidencePreflightRelativePath(moduleId) {
  if (!/^m(?:0[1-9]|[1-9]\d)$/u.test(moduleId ?? "")) {
    throw new Error("A module evidence-preflight path requires a canonical module ID.");
  }
  return `${moduleEvidencePreflightDirectoryRelativePath}/${moduleId}.v1.json`;
}

export function moduleEvidencePreflightPath(moduleId, siteRoot = defaultSiteRoot) {
  return resolve(siteRoot, moduleEvidencePreflightRelativePath(moduleId));
}

function canonicalPreflightRepositoryPath(recordPath) {
  if (typeof recordPath !== "string") {
    throw new Error("A module evidence-preflight loader requires a canonical module-scoped path.");
  }
  const match = /^content\/course\/contracts\/evidence-preflight\/(m(?:0[1-9]|[1-9]\d))\.v1\.json$/u.exec(recordPath);
  if (!match || moduleEvidencePreflightRelativePath(match[1]) !== recordPath) {
    throw new Error("A module evidence-preflight loader requires a canonical module-scoped path.");
  }
  return recordPath;
}

async function readTrackedPreflightJson(siteRoot, repositoryPath, { snapshot = null } = {}) {
  const errors = [];
  const textRecord = await readTrackedText(
    siteRoot,
    repositoryPath,
    `Module evidence-preflight ${repositoryPath}`,
    errors,
    { snapshot },
  );
  if (!textRecord) {
    throw new Error(errors.join("\n"));
  }
  try {
    return JSON.parse(textRecord.text);
  } catch (error) {
    throw new Error(
      `Module evidence-preflight ${repositoryPath} must contain parseable JSON: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

export async function loadModuleEvidencePreflight(
  recordPath,
  { siteRoot = defaultSiteRoot, snapshot = null } = {},
) {
  return readTrackedPreflightJson(siteRoot, canonicalPreflightRepositoryPath(recordPath), { snapshot });
}

function validatePreflightRecord(preflight, errors, legacyCandidateProfiles = null) {
  exactKeys(preflight, preflightKeys, "module evidence preflight", errors);
  if (
    preflight?.schemaVersion !== 1 ||
    preflight?.kind !== moduleEvidencePreflightKind ||
    preflight?.recordVersion !== moduleEvidencePreflightRecordVersion
  ) {
    errors.push(
      `module evidence preflight must use schemaVersion 1, kind ${moduleEvidencePreflightKind}, and recordVersion ${moduleEvidencePreflightRecordVersion}.`,
    );
  }
  const profile = candidatePreflightProfile(preflight?.moduleId, legacyCandidateProfiles);
  if (!profile) {
    errors.push("Module evidence preflight must use an explicitly allowlisted candidate module ID.");
  }
  if (!hasText(preflight?.purpose)) {
    errors.push("module evidence preflight.purpose must be non-empty text.");
  }
  exactKeys(preflight?.truthBoundary, truthBoundaryKeys, "module evidence preflight.truthBoundary", errors);
  for (const key of truthBoundaryKeys) {
    if (!hasText(preflight?.truthBoundary?.[key])) {
      errors.push(`module evidence preflight.truthBoundary.${key} must be non-empty text.`);
    }
  }
  if (!profile) return null;
  const moduleLabel = profile.moduleId.toUpperCase();
  if (preflight?.truthBoundary?.release !== profile.preflightReleaseBoundary) {
    errors.push(`${moduleLabel} evidence preflight must preserve the exact candidate-only release nonclaim.`);
  }
  if (preflight?.state !== profile.state) {
    errors.push(
      `module evidence preflight.state must be ${profile.state}; it may not label a candidate review-ready, learner-deliverable, or published.`,
    );
  }
  if (preflight?.evidenceRecordPath !== profile.evidenceRecordPath) {
    errors.push(`${moduleLabel} evidence preflight must bind ${profile.evidenceRecordPath}.`);
  }
  if (!sameOrderedValues(preflight?.openCriterionIds, profile.openCriterionIds)) {
    errors.push(`${moduleLabel} evidence preflight must leave only release-provenance-ci-and-deployment-evidence open.`);
  }
  if (!sameOrderedValues(preflight?.promotionBlockers, profile.promotionBlockers)) {
    errors.push(`${moduleLabel} evidence preflight must name every unresolved review, commit, CI, deployment, and delivery blocker.`);
  }
  return profile;
}

function validateNonPromotionState(profile, moduleEntry, graphModule, errors, { manifestById = null } = {}) {
  const moduleLabel = profile.moduleId.toUpperCase();
  if (!moduleEntry) {
    errors.push(`${moduleLabel} evidence preflight requires a canonical ${moduleLabel} registry entry.`);
    return;
  }
  if (profile.scope === "authoring-only") {
    const graphState = graphModule?.state;
    if (
      moduleEntry.contractState !== "authoring-only" ||
      moduleEntry.evidenceRecord !== null ||
      moduleEntry.reviewRecord !== null ||
      moduleEntry.reviewReadyCommit !== null ||
      moduleEntry.release !== null ||
      moduleEntry.migration?.kind !== "advanced-authoring-adapter" ||
      moduleEntry.migration?.path !== "content/course/contracts/advanced-module-contracts.v1.json" ||
      moduleEntry.migration?.locator !== "/modules/0"
    ) {
      errors.push("M31 authoring candidate requires the canonical registry to remain authoring-only with no promotion records.");
    }
    if (Object.values(moduleEntry.humanReview ?? {}).some((outcome) => outcome !== "pending")) {
      errors.push("M31 authoring candidate requires every canonical human-review dimension to remain pending.");
    }
    if (
      graphState?.lifecycle !== "authoring-only" ||
      graphState?.readerAccess !== "hidden" ||
      graphState?.availability !== "authoring-only" ||
      graphState?.contract?.track !== "advanced-v1" ||
      graphState?.contract?.state !== "authoring-only" ||
      graphState?.release?.state !== "unrecorded" ||
      graphState?.release?.recordId !== null ||
      graphModule?.sourceMap !== null ||
      graphModule?.studioId !== null ||
      manifestById?.has("m31")
    ) {
      errors.push("M31 authoring candidate must remain authoring-only and hidden with no canonical source map, studio, manifest entry, or release record.");
    }
    return;
  }
  if (
    moduleEntry.contractState !== "legacy-baseline" ||
    moduleEntry.evidenceRecord !== null ||
    moduleEntry.reviewRecord !== null ||
    moduleEntry.reviewReadyCommit !== null ||
    moduleEntry.release !== null
  ) {
    errors.push(`${moduleLabel} evidence preflight requires the canonical registry to remain legacy-baseline with no promotion records.`);
  }
  if (Object.values(moduleEntry.humanReview ?? {}).some((outcome) => outcome !== "pending")) {
    errors.push(`${moduleLabel} evidence preflight requires every canonical human-review dimension to remain pending.`);
  }
  if (
    graphModule?.state?.contract?.track !== "legacy-v1" ||
    graphModule?.state?.contract?.state !== "legacy-baseline" ||
    graphModule?.state?.release?.state !== "unrecorded" ||
    graphModule?.state?.release?.recordId !== null
  ) {
    errors.push(`${moduleLabel} evidence preflight must preserve the canonical graph legacy-v1/legacy-baseline and unrecorded release tuple.`);
  }
}

async function loadLegacyCandidateProfileReportFromSnapshot(siteRoot, snapshot, errors) {
  try {
    const profiles = await loadLegacyCandidatePreflightProfiles(siteRoot, { snapshot });
    return await validateLegacyCandidatePreflightProfiles(profiles, { siteRoot, snapshot });
  } catch (error) {
    const errorCode = error instanceof GitIndexSnapshotError ? ` (${error.code})` : "";
    errors.push(
      `Legacy candidate preflight profiles could not be captured from one immutable Git-index snapshot${errorCode}: ${error instanceof Error ? error.message : String(error)}`,
    );
    return null;
  }
}

/**
 * A legacy-baseline candidate profile may expand source-ledger scope only to
 * artifacts already named by one collision-free non-promoting typed packet.
 * It cannot point a candidate at a different workbook, future review selector,
 * or unrelated studio/test surface.
 */
async function validateLegacyCandidateProfileContext(
  profile,
  stateContext,
  siteRoot,
  snapshot,
  errors,
) {
  const moduleLabel = profile.moduleId.toUpperCase();
  const label = `${moduleLabel} legacy candidate profile`;
  try {
    await assertGitIndexSnapshotForSiteRoot(snapshot, siteRoot);
    await snapshot.assertClean([
      legacyCandidatePreflightProfilesRelativePath,
      legacyModuleContractPacketRelativePath,
      moduleContractCandidatePacketRelativePath,
    ]);
    const [legacyPacketRegistry, currentPacketRegistry] = await Promise.all([
      snapshot.readJson(legacyModuleContractPacketRelativePath),
      snapshot.readJson(moduleContractCandidatePacketRelativePath),
    ]);
    const [legacyPacketReport, currentPacketReport] = await Promise.all([
      validateLegacyModuleContractPacketRegistry(stateContext.graph, legacyPacketRegistry.value, {
        siteRoot,
      }),
      validateModuleContractCandidatePacketRegistry(stateContext.graph, currentPacketRegistry.value, {
        siteRoot,
      }),
    ]);
    const packetCohort = combineModuleContractPacketReports([
      legacyPacketReport,
      currentPacketReport,
    ]);
    const packet = packetCohort.packetByModuleId.get(profile.moduleId) ?? null;
    if (!packet || packet.packetId !== profile.packetId) {
      errors.push(`${label} must resolve exactly one matching typed candidate packet.`);
      return null;
    }
    const graphModule = stateContext.graph.modules?.find(
      ({ id }) => id === profile.moduleId,
    ) ?? null;
    const manifestModule = stateContext.manifest.modules?.find(
      ({ id }) => id === profile.moduleId,
    ) ?? null;
    const expectedWorkbookPath = manifestModule?.filename
      ? `content/modules/${manifestModule.filename}`
      : null;
    if (!graphModule || !expectedWorkbookPath) {
      errors.push(`${label} requires a manifest-selected canonical workbook and graph module.`);
      return null;
    }
    if (packet.workbookPath !== expectedWorkbookPath) {
      errors.push(`${label} must bind its manifest-selected workbook ${expectedWorkbookPath}.`);
    }
    if (packet.sourceMapPath !== graphModule.sourceMap) {
      errors.push(`${label} packet source map must match its captured canonical graph source map.`);
    }
    const permittedSourceLedgerPaths = new Set([
      packet.sourceMapPath,
      packet.sourceAuditAddendumPath,
    ]);
    if (!profile.sourceLedgerPaths.includes(packet.sourceMapPath)) {
      errors.push(`${label} must include its canonical graph source map in sourceLedgerPaths.`);
    }
    for (const sourceLedgerPath of profile.sourceLedgerPaths) {
      if (!permittedSourceLedgerPaths.has(sourceLedgerPath)) {
        errors.push(`${label} may not bind an unscoped source ledger ${sourceLedgerPath}.`);
      }
    }
    const expectedForwardModule = stateContext.graph.modules?.find(
      ({ number }) => number === graphModule.forwardModuleNumber,
    ) ?? null;
    if (packet.canonicalExpectation?.forwardModuleId !== expectedForwardModule?.id) {
      errors.push(`${label} typed packet must retain canonical forward handoff ${expectedForwardModule?.id ?? "null"}.`);
    }
    const implementationPaths = new Set(
      (packet.implementationArtifacts ?? []).flatMap(({ paths }) => paths ?? []),
    );
    if (!implementationPaths.has(profile.studioSourcePath)) {
      errors.push(`${label} studioSourcePath must be named by its captured typed legacy packet.`);
    }
    if (!implementationPaths.has(profile.visualTestPath)) {
      errors.push(`${label} visualTestPath must be named by its captured typed legacy packet.`);
    }
    if (
      profile.visualTestTitle !== null &&
      (!implementationPaths.has(browserTestRunnerPath) || !implementationPaths.has(browserTestConfigPath))
    ) {
      errors.push(`${label} browser visual test must name its package runner and Playwright configuration in the captured typed legacy packet.`);
    }
    return {
      packet,
      snapshotInputPaths: Object.freeze([
        legacyCandidatePreflightProfilesRelativePath,
        legacyModuleContractPacketRelativePath,
        moduleContractCandidatePacketRelativePath,
      ]),
      materialScope: Object.freeze({
        workbookPath: expectedWorkbookPath,
        sourceLedgerPaths: Object.freeze([...profile.sourceLedgerPaths]),
        visualContentPaths: Object.freeze([expectedWorkbookPath]),
      }),
    };
  } catch (error) {
    const errorCode = error instanceof GitIndexSnapshotError ? ` (${error.code})` : "";
    errors.push(
      `${label} could not capture its packet-bound material scope from one immutable Git-index snapshot${errorCode}: ${error instanceof Error ? error.message : String(error)}`,
    );
    return null;
  }
}

function escapeRegularExpression(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
}

function browserTestBody(source, title) {
  const declaration = new RegExp(
    String.raw`test\s*\(\s*["']${escapeRegularExpression(title)}["']\s*,`,
    "u",
  );
  const match = declaration.exec(source);
  if (!match || match.index === undefined) return null;
  const closingOffset = source.indexOf("\n});", match.index + match[0].length);
  return closingOffset < 0 ? null : source.slice(match.index, closingOffset + "\n});".length);
}

async function validateLegacyCandidateProfileEvidenceBindings(
  profile,
  evidenceReport,
  errors,
  { siteRoot, snapshot = null },
) {
  const moduleLabel = profile.moduleId.toUpperCase();
  const visualInputs = evidenceReport.evidenceByCriterion.get(
    "accessible-visual-text-alternative",
  )?.resolvedInputs ?? [];
  const visualStudio = visualInputs.filter(
    ({ kind, role, path }) =>
      kind === "file" && role === "source-code" && path === profile.studioSourcePath,
  );
  const visualTest = visualInputs.filter(
    ({ kind, role, path, locator }) =>
      kind === (profile.visualTestTitle === null ? "file" : "browser-test") &&
      role === "test" &&
      path === profile.visualTestPath &&
      locator === profile.visualTestTitle,
  );
  const browserRunner = visualInputs.filter(
    ({ kind, role, path, locator, value }) =>
      kind === "browser-test-runner" &&
      role === "test-runner" &&
      path === browserTestRunnerPath &&
      locator === browserTestRunnerLocator &&
      value === browserTestRunnerCommand,
  );
  const browserConfig = visualInputs.filter(
    ({ kind, role, path, locator }) =>
      kind === "browser-test-config" &&
      role === "test-runner" &&
      path === browserTestConfigPath &&
      locator === null,
  );
  const browserRunnerBound =
    profile.visualTestTitle === null ||
    (browserRunner.length === 1 && browserConfig.length === 1);
  if (visualStudio.length !== 1 || visualTest.length !== 1 || !browserRunnerBound) {
    errors.push(
      `${moduleLabel} legacy candidate visual evidence must bind its profiled studio ${profile.studioSourcePath}, visual test ${profile.visualTestPath}, and any declared browser runner/configuration.`,
    );
  }
  if (profile.visualTestTitle !== null && visualTest.length === 1) {
    const source = await readTrackedText(
      siteRoot,
      profile.visualTestPath,
      `${moduleLabel} candidate visual browser test`,
      errors,
      { snapshot },
    );
    const body = source ? browserTestBody(source.text, profile.visualTestTitle) : null;
    if (
      !body ||
      !body.includes("page.goto(") ||
      !(body.includes("selectRadioWithKeyboard") || body.includes("page.keyboard.")) ||
      !body.includes("new AxeBuilder") ||
      !body.includes(".analyze()") ||
      !body.includes("expect(")
    ) {
      errors.push(`${moduleLabel} browser visual test must retain a module-route interaction, keyboard exercise, assertion, and direct Axe analysis in its declared Playwright test body.`);
    }
  }
  const interactionInputs = evidenceReport.evidenceByCriterion.get(
    "interaction-reference-model-and-teaching-tests",
  )?.resolvedInputs ?? [];
  const interactionStudio = interactionInputs.filter(
    ({ kind, role, path }) =>
      kind === "file" && role === "source-code" && path === profile.studioSourcePath,
  );
  if (interactionStudio.length !== 1) {
    errors.push(
      `${moduleLabel} legacy candidate interaction evidence must bind its profiled studio ${profile.studioSourcePath}.`,
    );
  }
}

async function validateCandidateReleaseBoundary(
  profile,
  preflight,
  evidenceReport,
  errors,
  { siteRoot, snapshot = null },
) {
  const moduleLabel = profile.moduleId.toUpperCase();
  const releaseEntry = evidenceReport.evidenceByCriterion.get(
    "release-provenance-ci-and-deployment-evidence",
  );
  const releaseInputs = releaseEntry?.resolvedInputs ?? [];
  const selfBound = releaseInputs.filter(
    ({ kind, role, path, locator }) =>
      kind === "json-pointer" &&
      role === "provenance" &&
      path === moduleEvidencePreflightRelativePath(profile.moduleId) &&
      locator === "/truthBoundary/release",
  );
  const documentationBound = releaseInputs.filter(
    ({ kind, role, path, locator }) =>
      kind === "markdown-heading" &&
      role === "provenance" &&
      path === profile.candidateDocumentationPath &&
      locator === profile.candidateDocumentationAnchor,
  );
  if (releaseInputs.length !== 2 || selfBound.length !== 1 || documentationBound.length !== 1) {
    errors.push(`${moduleLabel} candidate release evidence must bind exactly its explicit release nonclaim and candidate-boundary documentation.`);
  }
  if (evidenceReport.record?.truthBoundary?.release !== profile.evidenceRecordReleaseBoundary) {
    errors.push(`${moduleLabel} candidate evidence record must preserve the exact candidate-only evidence-record release nonclaim.`);
  }
  if (releaseEntry?.claim !== profile.releaseCriterionClaim) {
    errors.push(`${moduleLabel} candidate release evidence must preserve the exact candidate-only release-boundary claim.`);
  }
  if (
    !Array.isArray(releaseEntry?.limitations) ||
    releaseEntry.limitations.length !== 1 ||
    releaseEntry.limitations[0] !== profile.releaseCriterionLimitation
  ) {
    errors.push(`${moduleLabel} candidate release evidence must preserve its exact open-criterion limitation.`);
  }
  if (preflight.truthBoundary?.release !== profile.preflightReleaseBoundary) {
    errors.push(`${moduleLabel} candidate release evidence must preserve the preflight's exact release nonclaim.`);
  }
  const documentationErrors = [];
  const documentation = await readTrackedText(
    siteRoot,
    profile.candidateDocumentationPath,
    `${moduleLabel} candidate release documentation`,
    documentationErrors,
    { snapshot },
  );
  if (!documentation) {
    errors.push(...documentationErrors);
  } else {
    const digest = `sha256:${createHash("sha256").update(documentation.text, "utf8").digest("hex")}`;
    if (digest !== profile.candidateDocumentationDigest) {
      errors.push(`${moduleLabel} candidate release evidence must preserve the reviewed candidate-boundary documentation digest.`);
    }
  }
  if (!sameOrderedValues(preflight?.openCriterionIds, profile.openCriterionIds)) {
    errors.push(`${moduleLabel} candidate release criterion may not be silently closed by structural input resolution.`);
  }
}

/**
 * M31 has intentionally not selected a learner workbook, canonical graph
 * source map, or studio. Its candidate dossier therefore gets a strict
 * authoring-only scope check instead of borrowing the promoted-module scope
 * rule, which would incorrectly require the absent learner-facing artifacts.
 */
async function validateM31AuthoringCandidateScope(
  evidenceReport,
  graphModule,
  errors,
  { siteRoot, snapshot },
) {
  const label = "M31 authoring candidate evidence";
  for (const entry of evidenceReport.evidenceByCriterion.values()) {
    for (const input of entry.resolvedInputs ?? []) {
      if (input.role === "course-content" && input.path !== expectedM31AuthoringWorkbookPath) {
        errors.push(
          `${label} criterion ${entry.criterionId} must bind hidden authoring workbook ${expectedM31AuthoringWorkbookPath}; found ${input.path}.`,
        );
      }
      if (input.role === "source-ledger" && !expectedM31AuthoringSourceMapPaths.has(input.path)) {
        errors.push(
          `${label} criterion ${entry.criterionId} may bind only the M31 instructor-facing source map or source audit; found ${input.path}.`,
        );
      }
      if (typeof input.path === "string" && input.path.startsWith("content/modules/")) {
        errors.push(
          `${label} criterion ${entry.criterionId} may not substitute a learner-facing canonical workbook for M31's hidden authoring draft.`,
        );
      }
    }
  }

  const sessionEvidence = evidenceReport.evidenceByCriterion.get("six-connected-sessions");
  const sessionDeliveryBindings = (sessionEvidence?.resolvedInputs ?? []).filter(
    ({ kind, role, path, locator }) =>
      kind === "json-pointer" &&
      role === "provenance" &&
      path === expectedM31AuthoringDeliveryMapPath &&
      locator === "/sessions",
  );
  if (sessionDeliveryBindings.length !== 1) {
    errors.push(`${label} criterion six-connected-sessions must bind exactly one hidden authoring delivery-map sessions pointer.`);
  }
  const prerequisiteEvidence = evidenceReport.evidenceByCriterion.get("prerequisite-forward-map");
  const handoffDeliveryBindings = (prerequisiteEvidence?.resolvedInputs ?? []).filter(
    ({ kind, role, path, locator }) =>
      kind === "json-pointer" &&
      role === "provenance" &&
      path === expectedM31AuthoringDeliveryMapPath &&
      locator === "/forwardHandoff",
  );
  if (handoffDeliveryBindings.length !== 1) {
    errors.push(`${label} criterion prerequisite-forward-map must bind exactly one hidden authoring delivery-map forward-handoff pointer.`);
  }

  const deliveryMapErrors = [];
  const [deliveryMapRecord, workbookRecord, bridgeRecord] = await Promise.all([
    readTrackedText(
      siteRoot,
      expectedM31AuthoringDeliveryMapPath,
      `${label} delivery map`,
      deliveryMapErrors,
      { snapshot },
    ),
    readTrackedText(
      siteRoot,
      expectedM31AuthoringWorkbookPath,
      `${label} workbook`,
      deliveryMapErrors,
      { snapshot },
    ),
    readTrackedText(
      siteRoot,
      advancedModuleBridgeRelativePath,
      `${label} prerequisite-session bridge`,
      deliveryMapErrors,
      { snapshot },
    ),
  ]);
  if (deliveryMapRecord && workbookRecord && bridgeRecord) {
    try {
      const deliveryMap = JSON.parse(deliveryMapRecord.text);
      const bridge = JSON.parse(bridgeRecord.text);
      const bridgeEntry = bridge.modules?.find(({ moduleId }) => moduleId === "m31");
      validateAdvancedAuthoringDeliveryMap(deliveryMap, {
        courseModule: graphModule,
        bridgeEntry,
        bridgePath: advancedModuleBridgeRelativePath,
        workbookPath: expectedM31AuthoringWorkbookPath,
        authoringSourcePlanPath: expectedM31AuthoringSourcePlanPath,
        workbookMarkdown: workbookRecord.text,
      });
    } catch (error) {
      deliveryMapErrors.push(
        `${label} must preserve a hidden, snapshot-bound session/output topology: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
  errors.push(...deliveryMapErrors);

  const sourceLedger = evidenceReport.evidenceByCriterion.get("source-ledger");
  const sourceLedgerPaths = new Set(
    (sourceLedger?.resolvedInputs ?? [])
      .filter(({ role }) => role === "source-ledger")
      .map(({ path }) => path),
  );
  for (const requiredPath of expectedM31AuthoringSourceMapPaths) {
    if (!sourceLedgerPaths.has(requiredPath)) {
      errors.push(`${label} criterion source-ledger must bind ${requiredPath}.`);
    }
  }

  const visual = evidenceReport.evidenceByCriterion.get("accessible-visual-text-alternative");
  const visualTests = (visual?.resolvedInputs ?? []).filter(({ role }) => role === "test");
  if (
    visualTests.length !== 1 ||
    visualTests[0]?.kind !== "file" ||
    visualTests[0]?.path !== expectedM31AuthoringVisualTestPath
  ) {
    errors.push(`${label} criterion accessible-visual-text-alternative must bind ${expectedM31AuthoringVisualTestPath}.`);
  }

  const interaction = evidenceReport.evidenceByCriterion.get(
    "interaction-reference-model-and-teaching-tests",
  );
  const authoringModels = (interaction?.resolvedInputs ?? []).filter(
    ({ role }) => role === "reference-model",
  );
  const authoringModelTests = (interaction?.resolvedInputs ?? []).filter(
    ({ role }) => role === "test",
  );
  if (
    authoringModels.length !== 1 ||
    authoringModels[0]?.kind !== "file" ||
    authoringModels[0]?.path !== expectedM31AuthoringModelPath
  ) {
    errors.push(`${label} criterion interaction-reference-model-and-teaching-tests must bind ${expectedM31AuthoringModelPath}.`);
  }
  if (
    authoringModelTests.length !== 1 ||
    authoringModelTests[0]?.kind !== "file" ||
    authoringModelTests[0]?.path !== expectedM31AuthoringModelTestPath
  ) {
    errors.push(`${label} criterion interaction-reference-model-and-teaching-tests must bind ${expectedM31AuthoringModelTestPath}.`);
  }
}

/**
 * Validate one explicitly allowlisted candidate evidence dossier without
 * changing its lifecycle state. A passing report means only that its
 * module-scoped structural inputs resolve and meet the selected profile; it is
 * not a human review, learner-mastery, CI, deployment, or publication result.
 * The source-bound `run…` entry points bind profile, state, preflight, and
 * declared evidence inputs to one Git-index generation. Direct validation
 * always uses those snapshot artifacts after comparing any supplied values;
 * structural negative tests use isolated staged Git fixtures rather than a
 * caller-selectable artifact-injection path.
 */
export async function validateModuleEvidencePreflight(
  preflight,
  {
    siteRoot = defaultSiteRoot,
    evidenceRecord: suppliedEvidenceRecord = null,
    graph: suppliedGraph = null,
    registry: suppliedRegistry = null,
    manifest: suppliedManifest = null,
    snapshot = null,
  } = {},
) {
  const errors = [];
  const suppliedModuleLabel = typeof preflight?.moduleId === "string"
    ? preflight.moduleId.toUpperCase()
    : "Candidate";
  let evidenceSnapshot = snapshot;
  if (!evidenceSnapshot) {
    try {
      evidenceSnapshot = await openGitIndexSnapshot(siteRoot);
    } catch (error) {
      errors.push(
        `${suppliedModuleLabel} evidence preflight could not capture its immutable Git-index evidence inputs: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
  if (!evidenceSnapshot) preflightFailure(errors);
  try {
    await assertGitIndexSnapshotForSiteRoot(evidenceSnapshot, siteRoot);
    await evidenceSnapshot.assertAllClean();
  } catch (error) {
    const errorCode = error instanceof GitIndexSnapshotError ? ` (${error.code})` : "";
    errors.push(
      `${suppliedModuleLabel} evidence preflight requires one clean captured Git-index workspace${errorCode}: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
  if (errors.length > 0) preflightFailure(errors);

  const legacyCandidateProfiles = preflight?.moduleId === "m31"
    ? null
    : await loadLegacyCandidateProfileReportFromSnapshot(siteRoot, evidenceSnapshot, errors);
  let profile = validatePreflightRecord(preflight, errors, legacyCandidateProfiles);
  if (!profile) preflightFailure(errors);
  let moduleLabel = profile.moduleId.toUpperCase();
  const snapshotInputPaths = new Set([
    canonicalCourseGraphPath,
    moduleContractRegistryRelativePath,
    canonicalModuleManifestPath,
    moduleEvidencePreflightRelativePath(profile.moduleId),
    profile.evidenceRecordPath,
    profile.candidateDocumentationPath,
    "content/course/module-companion-guides.v1.json",
    `content/course/contracts/companions/${profile.moduleId}.v1.json`,
    "scripts/run-course-tests.mjs",
    ".github/workflows/ci.yml",
  ]);
  if (profile.scope === "legacy-canonical") {
    for (const path of legacyCandidateProfiles?.snapshotInputPaths ?? []) {
      addSnapshotInputPath(
        snapshotInputPaths,
        siteRoot,
        path,
        `${moduleLabel} legacy profile snapshot input`,
        errors,
      );
    }
  } else {
    for (const path of [
      expectedM31AuthoringWorkbookPath,
      expectedM31AuthoringDeliveryMapPath,
      expectedM31AuthoringModelPath,
      expectedM31AuthoringModelTestPath,
      expectedM31AuthoringVisualTestPath,
      advancedModuleBridgeRelativePath,
      ...expectedM31AuthoringSourceMapPaths,
    ]) {
      addSnapshotInputPath(
        snapshotInputPaths,
        siteRoot,
        path,
        `${moduleLabel} authoring snapshot input`,
        errors,
      );
    }
  }

  const snapshotArtifacts = await validateSuppliedCandidateArtifactsMatchSnapshot(
    profile,
    preflight,
    suppliedEvidenceRecord,
    siteRoot,
    evidenceSnapshot,
    errors,
  );
  if (!snapshotArtifacts?.canonicalPreflight) preflightFailure(errors);
  // Report a caller mismatch, then discard caller-owned artifacts. All
  // subsequent semantics and returned evidence are based on immutable snapshot
  // records instead.
  preflight = snapshotArtifacts.canonicalPreflight;
  profile = validatePreflightRecord(preflight, errors, legacyCandidateProfiles);
  if (!profile) preflightFailure(errors);
  moduleLabel = profile.moduleId.toUpperCase();

  const stateContext = await loadCandidateStateContextFromSnapshot(
    siteRoot,
    evidenceSnapshot,
    errors,
    { label: candidateContextLabel(profile) },
  );
  if (!stateContext) preflightFailure(errors);
  suppliedCandidateContextMatchesSnapshot(
    profile,
    suppliedGraph,
    suppliedRegistry,
    suppliedManifest,
    stateContext,
    errors,
  );
  const graph = stateContext.graph;
  const registry = stateContext.registry;
  let registryReport = null;
  try {
    registryReport = await validateModuleContractRegistry(
      graph,
      registry,
      { siteRoot, manifest: stateContext.manifest },
    );
    for (const path of registryReport.releaseInputPaths) {
      addSnapshotInputPath(
        snapshotInputPaths,
        siteRoot,
        path,
        `${moduleLabel} canonical registry input`,
        errors,
      );
    }
  } catch (error) {
    errors.push(`${moduleLabel} evidence preflight requires the current canonical registry to validate: ${error instanceof Error ? error.message : String(error)}`);
  }

  const manifestById = new Map(stateContext.manifest.modules.map((module) => [module.id, module]));
  const legacyCandidateContext = profile.scope === "legacy-canonical"
    ? await validateLegacyCandidateProfileContext(
      profile,
      stateContext,
      siteRoot,
      evidenceSnapshot,
      errors,
    )
    : null;
  if (profile.scope === "legacy-canonical" && !legacyCandidateContext) {
    preflightFailure(errors);
  }
  for (const path of legacyCandidateContext?.snapshotInputPaths ?? []) {
    addSnapshotInputPath(
      snapshotInputPaths,
      siteRoot,
      path,
      `${moduleLabel} packet-bound snapshot input`,
      errors,
    );
  }
  const graphModule = graph.modules?.find(({ id }) => id === profile.moduleId) ?? null;
  const moduleEntry = registry.modules?.find(({ moduleId }) => moduleId === profile.moduleId) ?? null;
  if (!graphModule) errors.push(`${moduleLabel} evidence preflight requires canonical graph module ${profile.moduleId}.`);
  validateNonPromotionState(profile, moduleEntry, graphModule, errors, { manifestById });

  let evidenceRecord = snapshotArtifacts?.canonicalEvidenceRecord ?? null;
  if (!evidenceRecord && preflight?.evidenceRecordPath) {
    try {
      evidenceRecord = await loadModuleEvidenceRecord(preflight.evidenceRecordPath, {
        siteRoot,
        snapshot: evidenceSnapshot,
      });
    } catch (error) {
      errors.push(`${moduleLabel} evidence preflight could not load its candidate evidence record: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  let evidenceReport = null;
  if (evidenceRecord) {
    try {
      evidenceReport = await validateModuleEvidenceRecord(evidenceRecord, {
        siteRoot,
        expectedModuleId: profile.moduleId,
        requiredCriterionIds: criterionIds,
        snapshot: evidenceSnapshot,
      });
      for (const path of evidenceReport.releaseInputPaths) {
        addSnapshotInputPath(
          snapshotInputPaths,
          siteRoot,
          path,
          `${moduleLabel} resolved evidence input`,
          errors,
        );
      }
    } catch (error) {
      errors.push(`${moduleLabel} evidence preflight requires all 18 candidate evidence criteria to resolve: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  if (evidenceReport && graphModule && moduleEntry && registryReport) {
    errors.push(...promotionEvidenceRoleErrors(moduleEntry, graphModule, evidenceReport));
    if (profile.scope === "legacy-canonical") {
      errors.push(...promotionEvidenceScopeErrors({
        moduleEntry,
        graphModule,
        manifestById,
        evidenceReport,
        materialScope: legacyCandidateContext.materialScope,
      }));
      await validateLegacyCandidateProfileEvidenceBindings(profile, evidenceReport, errors, {
        siteRoot,
        snapshot: evidenceSnapshot,
      });
    } else {
      await validateM31AuthoringCandidateScope(evidenceReport, graphModule, errors, {
        siteRoot,
        snapshot: evidenceSnapshot,
      });
    }
    errors.push(...await promotionEvidenceTestErrors({
      siteRoot,
      moduleEntry,
      graphModule,
      evidenceReport,
      snapshot: evidenceSnapshot,
    }));
    errors.push(...await promotionLearningCompanionErrors({
      siteRoot,
      moduleEntry,
      graph,
      evidenceReport,
      snapshot: evidenceSnapshot,
    }));
    const visual = await promotionVisualAlternativeErrors({
      siteRoot,
      moduleEntry,
      graphModule,
      manifestById,
      evidenceReport,
      materialScope: legacyCandidateContext?.materialScope ?? null,
      snapshot: evidenceSnapshot,
    });
    errors.push(...visual.errors);
    await validateCandidateReleaseBoundary(profile, preflight, evidenceReport, errors, {
      siteRoot,
      snapshot: evidenceSnapshot,
    });
  }

  try {
    await evidenceSnapshot.assertClean([...snapshotInputPaths].sort());
    await evidenceSnapshot.assertAllClean();
  } catch (error) {
    const errorCode = error instanceof GitIndexSnapshotError ? ` (${error.code})` : "";
    errors.push(
      `${moduleLabel} evidence preflight must finish against one clean captured candidate input generation${errorCode}: ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  preflightFailure(errors);
  return {
    moduleId: profile.moduleId,
    state: profile.state,
    contractState: moduleEntry.contractState,
    evidenceRecordPath: preflight.evidenceRecordPath,
    openCriterionIds: [...preflight.openCriterionIds],
    promotionBlockers: [...preflight.promotionBlockers],
    evidenceReport,
  };
}

/**
 * Run one allowlisted candidate with one captured Git-index snapshot for its
 * preflight record and direct evidence-input resolver. The canonical graph,
 * registry, and downstream promotion checks intentionally retain their own
 * validation boundary; this is not an end-to-end release provenance claim.
 */
export async function runModuleCandidateEvidencePreflight(
  moduleId,
  { siteRoot = defaultSiteRoot } = {},
) {
  const snapshot = await openGitIndexSnapshot(siteRoot);
  const errors = [];
  const legacyCandidateProfiles = moduleId === "m31"
    ? null
    : await loadLegacyCandidateProfileReportFromSnapshot(siteRoot, snapshot, errors);
  if (errors.length > 0) preflightFailure(errors);
  if (!candidatePreflightProfile(moduleId, legacyCandidateProfiles)) {
    throw new Error("A candidate evidence preflight runner requires an explicitly allowlisted module ID.");
  }
  const preflight = await loadModuleEvidencePreflight(
    moduleEvidencePreflightRelativePath(moduleId),
    { siteRoot, snapshot },
  );
  return validateModuleEvidencePreflight(preflight, { siteRoot, snapshot });
}

export function runM29CandidateEvidencePreflight(options = {}) {
  return runModuleCandidateEvidencePreflight("m29", options);
}

export function runM31AuthoringCandidateEvidencePreflight(options = {}) {
  return runModuleCandidateEvidencePreflight("m31", options);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const report = await runM29CandidateEvidencePreflight();
  console.log(
    `M29 candidate evidence preflight passed: ${report.evidenceReport.summary.evidenceItems} criteria resolve; ${report.openCriterionIds.join(", ")} remains open.`,
  );
}
