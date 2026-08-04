import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const siteRoot = resolve(scriptDirectory, "..");
const graphPath = resolve(siteRoot, "content", "course", "course-graph.v2.json");

const expectedAvailabilityStates = new Set([
  "legacy-open",
  "published",
  "preview",
  "locked",
  "optional",
  "authoring-only",
]);
const expectedLifecycles = new Set(["learner-material-ready", "authoring-only"]);
const expectedReaderAccessStates = new Set(["hidden", "preview", "full"]);
const expectedContractTracks = new Set(["legacy-v1", "advanced-v1"]);
const expectedContractStates = new Set([
  "not-started",
  "authoring-only",
  "legacy-baseline",
  "review-ready",
  "verified",
]);
const expectedReleaseStates = new Set([
  "unrecorded",
  "candidate-recorded",
  "deployed-recorded",
]);
const expectedRouteRoles = new Set(["required", "optional"]);
const expectedScopeStates = new Set([
  "core-mastery",
  "scoped-exposure",
  "post-core-specialization",
  "explicitly-deferred",
]);
const expectedScopeCapabilities = new Set([
  "recognize",
  "read",
  "derive",
  "debug",
  "design",
  "implement",
]);
const expectedInventoryDirectives = new Set([
  "master",
  "graduate-master",
  "also-know",
  "study",
]);
const expectedAtomicInventoryItemCount = 362;
const focusedStudyModuleNumbers = new Set([21, 22, 23, 24, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36]);
// Kept in server-side validation only: the canonical graph is client-reachable.
const privateGuidedStudyWorkbookPaths = new Map([
  [31, "content/authoring/m31_optimization_information_workbook.v1.md"],
  [32, "content/authoring/m32_systems_languages_scientific_python_accelerators_workbook.v1.md"],
  [33, "content/authoring/m33_formal_languages_computability_complexity_workbook.v1.md"],
  [34, "content/authoring/m34_classical_ai_search_constraints_decision_workbook.v1.md"],
  [35, "content/authoring/m35_machine_learning_representation_workbook.v1.md"],
  [36, "content/authoring/m36_statistical_learning_theory_reliable_deep_learning_workbook.v1.md"],
]);
const privateGuidedReadyModuleNumbers = new Set(privateGuidedStudyWorkbookPaths.keys());

function fail(message) {
  throw new Error(`Invalid Atlas course graph: ${message}`);
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function assertString(value, label) {
  if (typeof value !== "string" || value.trim() === "") {
    fail(`${label} must be a non-empty string.`);
  }
}

function assertExactKeys(value, keys, label) {
  if (!isPlainObject(value)) {
    fail(`${label} must be an object.`);
  }
  const actual = Object.keys(value).sort();
  const expected = [...keys].sort();
  if (actual.length !== expected.length || actual.some((key, index) => key !== expected[index])) {
    fail(`${label} must use exactly these keys: ${expected.join(", ")}.`);
  }
}

function validateFocusedStudyMinutes(value, number) {
  assertExactKeys(value, ["minimumEvidence", "deepDossier"], `Module ${number} focusedStudyMinutes`);

  for (const [label, range] of Object.entries(value)) {
    if (!Array.isArray(range) || range.length !== 2) {
      fail(`Module ${number} focusedStudyMinutes.${label} must be a two-value minute range.`);
    }
    const [minimum, maximum] = range;
    if (
      !Number.isInteger(minimum) ||
      !Number.isInteger(maximum) ||
      minimum < 1 ||
      maximum < minimum
    ) {
      fail(`Module ${number} focusedStudyMinutes.${label} must use increasing positive integer minutes.`);
    }
  }

  if (value.deepDossier[0] < value.minimumEvidence[1]) {
    fail(`Module ${number} deep dossier time must include the complete minimum-evidence band.`);
  }
}

function validatePrivateGuidedStudy(value, number) {
  assertExactKeys(value, ["status"], `Module ${number} private guided study`);
  if (value.status !== "ready") {
    fail(`Module ${number} private guided study must be ready when it is declared.`);
  }
  const workbookPath = privateGuidedStudyWorkbookPaths.get(number);
  if (!workbookPath || !existsSync(resolve(siteRoot, workbookPath))) {
    fail(`Module ${number} private guided-study pack must have its checked-in authoring workbook.`);
  }
}

function assertDeclaredStates(value, expected, label) {
  if (!Array.isArray(value)) {
    fail(`${label} must be an array.`);
  }
  const actual = new Set(value);
  if (actual.size !== value.length || actual.size !== expected.size) {
    fail(`${label} must declare each supported state exactly once.`);
  }
  for (const state of expected) {
    if (!actual.has(state)) {
      fail(`${label} is missing state ${state}.`);
    }
  }
}

function isCheckedInSourceMapPath(value) {
  if (
    typeof value !== "string" ||
    !value.startsWith("content/source-maps/") ||
    !value.endsWith(".md") ||
    value.includes("\\") ||
    value.split("/").includes("..")
  ) {
    return false;
  }
  const pathFromRoot = relative(siteRoot, resolve(siteRoot, value)).replaceAll("\\", "/");
  return pathFromRoot.startsWith("content/source-maps/");
}

function routePlanFor(graph, routePlanId = "atlas-core-60") {
  const routePlan = graph.routePlans.find(({ id }) => id === routePlanId);
  if (!routePlan) {
    fail(`route plan ${routePlanId} is missing.`);
  }
  return routePlan;
}

function routeDayLabel({ startDay, endDay }) {
  return startDay === endDay ? `Day ${startDay}` : `Days ${startDay}–${endDay}`;
}

function validateModuleState(courseModule) {
  const number = courseModule.number;
  if (Object.hasOwn(courseModule, "lifecycle") || Object.hasOwn(courseModule, "availability")) {
    fail(`Module ${number} must place lifecycle and availability in its canonical state object.`);
  }
  if (Object.hasOwn(courseModule, "releaseEvidence")) {
    fail(`Module ${number} must place release evidence in its canonical state object.`);
  }

  const hasPrivateGuidedStudy = Object.hasOwn(courseModule.state, "privateGuidedStudy");
  assertExactKeys(
    courseModule.state,
    [
      "lifecycle",
      "readerAccess",
      "availability",
      "contract",
      "release",
      ...(hasPrivateGuidedStudy ? ["privateGuidedStudy"] : []),
    ],
    `Module ${number} state`,
  );
  const { lifecycle, readerAccess, availability, contract, release, privateGuidedStudy } = courseModule.state;
  if (!expectedLifecycles.has(lifecycle)) {
    fail(`Module ${number} lifecycle is invalid.`);
  }
  if (!expectedReaderAccessStates.has(readerAccess)) {
    fail(`Module ${number} reader access is invalid.`);
  }
  if (!expectedAvailabilityStates.has(availability)) {
    fail(`Module ${number} availability is invalid.`);
  }
  assertExactKeys(contract, ["track", "state"], `Module ${number} contract state`);
  if (!expectedContractTracks.has(contract.track)) {
    fail(`Module ${number} contract track is invalid.`);
  }
  if (!expectedContractStates.has(contract.state)) {
    fail(`Module ${number} contract state is invalid.`);
  }
  assertExactKeys(release, ["state", "recordId"], `Module ${number} release state`);
  if (!expectedReleaseStates.has(release.state)) {
    fail(`Module ${number} release state is invalid.`);
  }
  if (release.state === "unrecorded" && release.recordId !== null) {
    fail(`unrecorded Module ${number} release state must use a null recordId.`);
  }
  if (release.state !== "unrecorded") {
    assertString(release.recordId, `Module ${number} release recordId`);
  }

  const expectedAccess = {
    "legacy-open": ["learner-material-ready", "full"],
    published: ["learner-material-ready", "full"],
    preview: ["learner-material-ready", "preview"],
    locked: ["learner-material-ready", "hidden"],
    optional: ["learner-material-ready", "full"],
    "authoring-only": ["authoring-only", "hidden"],
  }[availability];
  if (lifecycle !== expectedAccess[0] || readerAccess !== expectedAccess[1]) {
    if (availability === "preview") {
      fail(`preview Module ${number} must use preview reader access.`);
    }
    if (availability === "authoring-only") {
      fail(`authoring-only Module ${number} must be hidden from the reader.`);
    }
    fail(
      `${availability} Module ${number} must use lifecycle ${expectedAccess[0]} and reader access ${expectedAccess[1]}.`,
    );
  }
  if (contract.track === "legacy-v1" && number > 30) {
    fail(`advanced Module ${number} may not use the legacy-v1 contract track.`);
  }
  if (contract.track === "advanced-v1" && number <= 30) {
    fail(`legacy Module ${number} may not use the advanced-v1 contract track.`);
  }
  if (contract.state === "legacy-baseline" && contract.track !== "legacy-v1") {
    fail(`Module ${number} legacy-baseline state must use the legacy-v1 contract track.`);
  }
  if (
    availability === "legacy-open" &&
    (contract.track !== "legacy-v1" || contract.state !== "legacy-baseline")
  ) {
    fail(`legacy-open Module ${number} must retain a legacy-v1 legacy-baseline contract until a verified publication promotion.`);
  }
  if (
    availability === "legacy-open" &&
    (release.state !== "unrecorded" || release.recordId !== null)
  ) {
    fail(`legacy-open Module ${number} must leave release evidence unrecorded until a verified publication promotion.`);
  }
  if (availability === "published" && contract.state !== "verified") {
    fail(`published Module ${number} requires a verified contract before it can be learner-released.`);
  }
  if (
    availability === "published" &&
    (release.state !== "deployed-recorded" || typeof release.recordId !== "string")
  ) {
    fail(`published Module ${number} requires deployed release evidence before it can be learner-released.`);
  }
  if (
    (contract.state === "not-started" || contract.state === "authoring-only") &&
    contract.track !== "advanced-v1"
  ) {
    fail(`Module ${number} authoring contract state must use the advanced-v1 contract track.`);
  }
  if (contract.state === "verified" && release.state !== "deployed-recorded") {
    fail(`verified Module ${number} needs a deployed-recorded release with a stable recordId.`);
  }
  if (contract.state === "verified" && availability !== "published") {
    fail(`verified Module ${number} must use published availability after its release evidence is recorded.`);
  }
  if (
    contract.state !== "verified" &&
    (release.state !== "unrecorded" || release.recordId !== null)
  ) {
    fail(
      `${contract.state} Module ${number} must leave release state unrecorded with a null recordId.`,
    );
  }
  if (privateGuidedReadyModuleNumbers.has(number)) {
    if (!hasPrivateGuidedStudy) {
      fail(`Module ${number} must declare its private guided-study readiness.`);
    }
    if (availability !== "authoring-only") {
      fail(`Module ${number} private guided study must not change its portal availability.`);
    }
    validatePrivateGuidedStudy(privateGuidedStudy, number);
  } else if (hasPrivateGuidedStudy) {
    fail(`Only M31–M36 may declare a private guided-study pack in the canonical graph.`);
  }
}

function validateScopeMatrix(scopeMatrix, moduleById) {
  assertExactKeys(
    scopeMatrix,
    ["schemaVersion", "benchmark", "scopeStates", "capabilities", "topics", "extensionTracks"],
    "scopeMatrix",
  );
  if (scopeMatrix.schemaVersion !== 4) {
    fail("scopeMatrix schemaVersion must be 4.");
  }
  assertExactKeys(
    scopeMatrix.benchmark,
    [
      "id",
      "title",
      "accessedOn",
      "sourceDigest",
      "sourceBoundary",
      "items",
      "sourceLists",
      "atomicItemCount",
      "atomicItems",
    ],
    "scopeMatrix benchmark",
  );
  assertString(scopeMatrix.benchmark.id, "scopeMatrix benchmark id");
  assertString(scopeMatrix.benchmark.title, "scopeMatrix benchmark title");
  if (!/^\d{4}-\d{2}-\d{2}$/u.test(scopeMatrix.benchmark.accessedOn)) {
    fail("scopeMatrix benchmark accessedOn must use YYYY-MM-DD.");
  }
  if (!/^sha256:[a-f0-9]{64}$/u.test(scopeMatrix.benchmark.sourceDigest)) {
    fail("scopeMatrix benchmark sourceDigest must be a lowercase sha256 digest.");
  }
  assertString(scopeMatrix.benchmark.sourceBoundary, "scopeMatrix benchmark sourceBoundary");
  if (!Array.isArray(scopeMatrix.benchmark.items) || scopeMatrix.benchmark.items.length === 0) {
    fail("scopeMatrix benchmark must define source-inventory items.");
  }
  const benchmarkItemIds = new Set();
  const benchmarkItemsById = new Map();
  const benchmarkLevels = new Set();
  for (const item of scopeMatrix.benchmark.items) {
    assertExactKeys(item, ["id", "level", "label", "scopeTopicIds"], "scopeMatrix benchmark item");
    assertString(item.id, "scopeMatrix benchmark item id");
    if (benchmarkItemIds.has(item.id)) {
      fail(`scopeMatrix benchmark item ${item.id} is duplicated.`);
    }
    benchmarkItemIds.add(item.id);
    benchmarkItemsById.set(item.id, item);
    if (!Number.isInteger(item.level) || item.level < 1 || item.level > 9) {
      fail(`scopeMatrix benchmark item ${item.id} level must be an integer from 1 through 9.`);
    }
    benchmarkLevels.add(item.level);
    assertString(item.label, `scopeMatrix benchmark item ${item.id} label`);
    if (!Array.isArray(item.scopeTopicIds) || item.scopeTopicIds.length === 0) {
      fail(`scopeMatrix benchmark item ${item.id} needs mapped Scope Matrix topics.`);
    }
    if (new Set(item.scopeTopicIds).size !== item.scopeTopicIds.length) {
      fail(`scopeMatrix benchmark item ${item.id} repeats a mapped Scope Matrix topic.`);
    }
    for (const topicId of item.scopeTopicIds) {
      assertString(topicId, `scopeMatrix benchmark item ${item.id} mapped topic`);
    }
  }
  if (scopeMatrix.benchmark.atomicItemCount !== expectedAtomicInventoryItemCount) {
    fail(
      `scopeMatrix benchmark atomicItemCount must be ${expectedAtomicInventoryItemCount} for its pinned inventory digest.`,
    );
  }
  if (!Array.isArray(scopeMatrix.benchmark.sourceLists) || scopeMatrix.benchmark.sourceLists.length !== 25) {
    fail("scopeMatrix benchmark must define its 25 source target lists.");
  }
  const declaredSourceLines = new Map();
  for (const sourceList of scopeMatrix.benchmark.sourceLists) {
    assertExactKeys(
      sourceList,
      ["sectionId", "directive", "sourceLineStart", "sourceLineEnd"],
      "scopeMatrix benchmark source list",
    );
    assertString(sourceList.sectionId, "scopeMatrix benchmark source list sectionId");
    if (!benchmarkItemsById.has(sourceList.sectionId)) {
      fail(`scopeMatrix benchmark source list references unknown section ${sourceList.sectionId}.`);
    }
    if (!expectedInventoryDirectives.has(sourceList.directive)) {
      fail(`scopeMatrix benchmark source list ${sourceList.sectionId} has an invalid directive.`);
    }
    if (
      !Number.isInteger(sourceList.sourceLineStart) ||
      !Number.isInteger(sourceList.sourceLineEnd) ||
      sourceList.sourceLineStart < 1 ||
      sourceList.sourceLineEnd < sourceList.sourceLineStart
    ) {
      fail(`scopeMatrix benchmark source list ${sourceList.sectionId} needs an ordered positive source-line range.`);
    }
    for (let sourceLine = sourceList.sourceLineStart; sourceLine <= sourceList.sourceLineEnd; sourceLine += 1) {
      if (declaredSourceLines.has(sourceLine)) {
        fail(`scopeMatrix benchmark source line ${sourceLine} is declared more than once.`);
      }
      declaredSourceLines.set(sourceLine, sourceList.sectionId);
    }
  }
  if (declaredSourceLines.size !== expectedAtomicInventoryItemCount) {
    fail(
      `scopeMatrix benchmark source lists must declare exactly ${expectedAtomicInventoryItemCount} atomic source lines.`,
    );
  }
  if (
    !Array.isArray(scopeMatrix.benchmark.atomicItems) ||
    scopeMatrix.benchmark.atomicItems.length !== scopeMatrix.benchmark.atomicItemCount
  ) {
    fail("scopeMatrix benchmark atomicItems must match atomicItemCount.");
  }
  for (let level = 1; level <= 9; level += 1) {
    if (!benchmarkLevels.has(level)) {
      fail(`scopeMatrix benchmark must index Level ${level}.`);
    }
  }
  assertDeclaredStates(scopeMatrix.scopeStates, expectedScopeStates, "scopeMatrix scopeStates");
  assertDeclaredStates(scopeMatrix.capabilities, expectedScopeCapabilities, "scopeMatrix capabilities");
  if (!Array.isArray(scopeMatrix.extensionTracks) || scopeMatrix.extensionTracks.length === 0) {
    fail("scopeMatrix must define design-only extension tracks.");
  }

  const trackIds = new Set();
  for (const track of scopeMatrix.extensionTracks) {
    assertExactKeys(
      track,
      [
        "id",
        "title",
        "status",
        "cadence",
        "prerequisiteModuleIds",
        "calibrationUrls",
        "project",
        "oralDefense",
        "nonClaim",
      ],
      "scopeMatrix extension track",
    );
    assertString(track.id, "scopeMatrix extension track id");
    if (trackIds.has(track.id)) {
      fail(`scopeMatrix extension track ${track.id} is duplicated.`);
    }
    trackIds.add(track.id);
    assertString(track.title, `scopeMatrix extension track ${track.id} title`);
    if (track.status !== "design-only") {
      fail(`scopeMatrix extension track ${track.id} must remain design-only.`);
    }
    assertExactKeys(
      track.cadence,
      ["firstPassDays", "recommendedDays", "rationale"],
      `scopeMatrix extension track ${track.id} cadence`,
    );
    if (track.cadence.firstPassDays !== 90 || track.cadence.recommendedDays !== 180) {
      fail(`scopeMatrix extension track ${track.id} cadence must define 90 and 180 days.`);
    }
    if (track.cadence.firstPassDays >= track.cadence.recommendedDays) {
      fail(`scopeMatrix extension track ${track.id} cadence must increase from first pass to durable study.`);
    }
    assertString(track.cadence.rationale, `scopeMatrix extension track ${track.id} cadence rationale`);
    if (!Array.isArray(track.prerequisiteModuleIds) || track.prerequisiteModuleIds.length === 0) {
      fail(`scopeMatrix extension track ${track.id} needs prerequisiteModuleIds.`);
    }
    if (new Set(track.prerequisiteModuleIds).size !== track.prerequisiteModuleIds.length) {
      fail(`scopeMatrix extension track ${track.id} repeats a prerequisite module.`);
    }
    for (const moduleId of track.prerequisiteModuleIds) {
      if (!moduleById.has(moduleId)) {
        fail(`scopeMatrix extension track ${track.id} references missing module ${moduleId}.`);
      }
    }
    if (!track.prerequisiteModuleIds.includes("m26")) {
      fail(`scopeMatrix extension track ${track.id} must retain M26 as its post-core evidence boundary.`);
    }
    if (!Array.isArray(track.calibrationUrls) || track.calibrationUrls.length < 2) {
      fail(`scopeMatrix extension track ${track.id} needs at least two official calibration URLs.`);
    }
    for (const calibrationUrl of track.calibrationUrls) {
      try {
        const parsed = new URL(calibrationUrl);
        if (parsed.protocol !== "https:") {
          fail(`scopeMatrix extension track ${track.id} calibration URLs must use HTTPS.`);
        }
      } catch {
        fail(`scopeMatrix extension track ${track.id} has an invalid calibration URL.`);
      }
    }
    for (const [field, value] of Object.entries({
      project: track.project,
      oralDefense: track.oralDefense,
      nonClaim: track.nonClaim,
    })) {
      assertString(value, `scopeMatrix extension track ${track.id} ${field}`);
    }
  }

  if (!Array.isArray(scopeMatrix.topics) || scopeMatrix.topics.length === 0) {
    fail("scopeMatrix must map benchmark topics.");
  }
  const topicIds = new Set();
  const topicsById = new Map();
  const levels = new Set();
  const scopes = new Set();
  for (const topic of scopeMatrix.topics) {
    assertExactKeys(
      topic,
      [
        "id",
        "level",
        "label",
        "scope",
        "targetCapabilities",
        "anchors",
        "sourceModuleIds",
        "evidenceArtifact",
        "trackId",
      ],
      "scopeMatrix topic",
    );
    assertString(topic.id, "scopeMatrix topic id");
    if (topicIds.has(topic.id)) {
      fail(`scopeMatrix topic ${topic.id} is duplicated.`);
    }
    topicIds.add(topic.id);
    topicsById.set(topic.id, topic);
    if (!Number.isInteger(topic.level) || topic.level < 1 || topic.level > 9) {
      fail(`scopeMatrix topic ${topic.id} level must be an integer from 1 through 9.`);
    }
    levels.add(topic.level);
    assertString(topic.label, `scopeMatrix topic ${topic.id} label`);
    if (!expectedScopeStates.has(topic.scope)) {
      fail(`scopeMatrix topic ${topic.id} has an invalid scope state.`);
    }
    scopes.add(topic.scope);
    if (!Array.isArray(topic.targetCapabilities) || topic.targetCapabilities.length === 0) {
      fail(`scopeMatrix topic ${topic.id} needs target capabilities.`);
    }
    if (new Set(topic.targetCapabilities).size !== topic.targetCapabilities.length) {
      fail(`scopeMatrix topic ${topic.id} repeats a target capability.`);
    }
    for (const capability of topic.targetCapabilities) {
      if (!expectedScopeCapabilities.has(capability)) {
        fail(`scopeMatrix topic ${topic.id} has an invalid target capability.`);
      }
    }
    if (!Array.isArray(topic.anchors) || topic.anchors.length === 0) {
      fail(`scopeMatrix topic ${topic.id} needs at least one module/session anchor.`);
    }
    const anchorKeys = new Set();
    for (const anchor of topic.anchors) {
      assertExactKeys(anchor, ["moduleId", "sessions"], `scopeMatrix topic ${topic.id} anchor`);
      if (!moduleById.has(anchor.moduleId)) {
        fail(`scopeMatrix topic ${topic.id} anchor references missing module ${anchor.moduleId}.`);
      }
      if (!Array.isArray(anchor.sessions) || anchor.sessions.length === 0) {
        fail(`scopeMatrix topic ${topic.id} anchor ${anchor.moduleId} needs sessions.`);
      }
      if (new Set(anchor.sessions).size !== anchor.sessions.length) {
        fail(`scopeMatrix topic ${topic.id} anchor ${anchor.moduleId} repeats a session.`);
      }
      for (const session of anchor.sessions) {
        if (!Number.isInteger(session) || session < 1 || session > 6) {
          fail(`scopeMatrix topic ${topic.id} anchor ${anchor.moduleId} sessions must be 1 through 6.`);
        }
      }
      const anchorKey = `${anchor.moduleId}:${anchor.sessions.join(",")}`;
      if (anchorKeys.has(anchorKey)) {
        fail(`scopeMatrix topic ${topic.id} repeats an anchor.`);
      }
      anchorKeys.add(anchorKey);
    }
    if (!Array.isArray(topic.sourceModuleIds) || topic.sourceModuleIds.length === 0) {
      fail(`scopeMatrix topic ${topic.id} needs source module routes.`);
    }
    if (new Set(topic.sourceModuleIds).size !== topic.sourceModuleIds.length) {
      fail(`scopeMatrix topic ${topic.id} repeats a source module route.`);
    }
    for (const moduleId of topic.sourceModuleIds) {
      if (!moduleById.has(moduleId)) {
        fail(`scopeMatrix topic ${topic.id} source route references missing module ${moduleId}.`);
      }
    }
    assertString(topic.evidenceArtifact, `scopeMatrix topic ${topic.id} evidence artifact`);
    if (topic.scope === "post-core-specialization") {
      if (typeof topic.trackId !== "string" || !trackIds.has(topic.trackId)) {
        fail(`post-core scopeMatrix topic ${topic.id} needs a declared extension track.`);
      }
    } else if (topic.trackId !== null) {
      fail(`non-specialization scopeMatrix topic ${topic.id} must use a null trackId.`);
    }
  }
  for (let level = 1; level <= 9; level += 1) {
    if (!levels.has(level)) {
      fail(`scopeMatrix must map Level ${level}.`);
    }
  }
  for (const scope of expectedScopeStates) {
    if (!scopes.has(scope)) {
      fail(`scopeMatrix must use ${scope} at least once.`);
    }
  }

  const mappedTopicIds = new Set();
  const atomicSourceLines = new Set();
  const atomicTopicIdsBySection = new Map();
  for (const atomicItem of scopeMatrix.benchmark.atomicItems) {
    assertExactKeys(
      atomicItem,
      ["sourceLine", "sectionId", "label", "scopeTopicIds"],
      "scopeMatrix benchmark atomic item",
    );
    if (!Number.isInteger(atomicItem.sourceLine) || atomicItem.sourceLine < 1) {
      fail("scopeMatrix benchmark atomic item needs a positive integer sourceLine.");
    }
    if (atomicSourceLines.has(atomicItem.sourceLine)) {
      fail(`scopeMatrix benchmark atomic source line ${atomicItem.sourceLine} is duplicated.`);
    }
    atomicSourceLines.add(atomicItem.sourceLine);
    const declaredSectionId = declaredSourceLines.get(atomicItem.sourceLine);
    if (!declaredSectionId) {
      fail(`scopeMatrix benchmark atomic source line ${atomicItem.sourceLine} is not declared by a source list.`);
    }
    assertString(atomicItem.sectionId, "scopeMatrix benchmark atomic item sectionId");
    if (atomicItem.sectionId !== declaredSectionId) {
      fail(
        `scopeMatrix benchmark atomic source line ${atomicItem.sourceLine} must remain in section ${declaredSectionId}.`,
      );
    }
    assertString(atomicItem.label, `scopeMatrix benchmark atomic item ${atomicItem.sourceLine} label`);
    if (!Array.isArray(atomicItem.scopeTopicIds) || atomicItem.scopeTopicIds.length === 0) {
      fail(`scopeMatrix benchmark atomic item ${atomicItem.sourceLine} needs mapped Scope Matrix topics.`);
    }
    if (new Set(atomicItem.scopeTopicIds).size !== atomicItem.scopeTopicIds.length) {
      fail(`scopeMatrix benchmark atomic item ${atomicItem.sourceLine} repeats a mapped Scope Matrix topic.`);
    }
    const item = benchmarkItemsById.get(atomicItem.sectionId);
    const sectionTopicIds = atomicTopicIdsBySection.get(item.id) ?? new Set();
    for (const topicId of atomicItem.scopeTopicIds) {
      const topic = topicsById.get(topicId);
      if (!topic) {
        fail(`scopeMatrix benchmark atomic item ${atomicItem.sourceLine} references missing Scope Matrix topic ${topicId}.`);
      }
      if (topic.level !== item.level) {
        fail(`scopeMatrix benchmark atomic item ${atomicItem.sourceLine} must map only Level ${item.level} Scope Matrix topics.`);
      }
      mappedTopicIds.add(topicId);
      sectionTopicIds.add(topicId);
    }
    atomicTopicIdsBySection.set(item.id, sectionTopicIds);
  }
  if (atomicSourceLines.size !== declaredSourceLines.size) {
    fail("scopeMatrix benchmark must index every declared atomic source line exactly once.");
  }
  for (const sourceLine of declaredSourceLines.keys()) {
    if (!atomicSourceLines.has(sourceLine)) {
      fail(`scopeMatrix benchmark source line ${sourceLine} is missing its atomic crosswalk.`);
    }
  }
  for (const item of benchmarkItemsById.values()) {
    const declaredTopicIds = [...item.scopeTopicIds].sort();
    const derivedTopicIds = [...(atomicTopicIdsBySection.get(item.id) ?? new Set())].sort();
    if (
      declaredTopicIds.length !== derivedTopicIds.length ||
      declaredTopicIds.some((topicId, index) => topicId !== derivedTopicIds[index])
    ) {
      fail(`scopeMatrix benchmark item ${item.id} must match its derived atomic topic rollup.`);
    }
  }
  for (const topic of scopeMatrix.topics) {
    if (topic.scope === "explicitly-deferred") {
      if (mappedTopicIds.has(topic.id)) {
        fail(`explicitly deferred Scope Matrix topic ${topic.id} must remain an Atlas boundary, not an inventory-coverage claim.`);
      }
      continue;
    }
    if (!mappedTopicIds.has(topic.id)) {
      fail(`Scope Matrix topic ${topic.id} is missing a learner-inventory crosswalk.`);
    }
  }
}

export function resolveLearnerAccess(courseModule) {
  if (!courseModule?.state) {
    fail("learner-access projection needs a module state.");
  }
  const { availability, readerAccess } = courseModule.state;
  if (availability === "legacy-open") {
    return { mode: "legacy-route", readerAccess };
  }
  if (availability === "published") {
    return { mode: "core-step", readerAccess };
  }
  if (availability === "preview" || availability === "optional") {
    return { mode: "reference", readerAccess };
  }
  return { mode: "unavailable", readerAccess };
}

export function validateCourseGraph(graph) {
  if (!isPlainObject(graph)) {
    fail("root must be an object.");
  }
  if (graph.schemaVersion !== 2) {
    fail("schemaVersion must be 2.");
  }
  if (!Array.isArray(graph.modules) || graph.modules.length !== 36) {
    fail("must define exactly 36 modules.");
  }
  const declaredModuleNumbers = new Set(graph.modules.map(({ number }) => number));
  if (
    declaredModuleNumbers.size !== 36 ||
    [...declaredModuleNumbers].some((number) => !Number.isInteger(number) || number < 1 || number > 36)
  ) {
    fail("must define modules numbered exactly 1 through 36.");
  }
  assertDeclaredStates(graph.availabilityStates, expectedAvailabilityStates, "availabilityStates");
  assertDeclaredStates(graph.lifecycleStates, expectedLifecycles, "lifecycleStates");
  assertDeclaredStates(graph.readerAccessStates, expectedReaderAccessStates, "readerAccessStates");
  assertDeclaredStates(graph.contractTracks, expectedContractTracks, "contractTracks");
  assertDeclaredStates(graph.contractStates, expectedContractStates, "contractStates");
  assertDeclaredStates(graph.releaseStates, expectedReleaseStates, "releaseStates");
  if (!Array.isArray(graph.knowledgeArcs) || graph.knowledgeArcs.length === 0) {
    fail("must define knowledge arcs.");
  }
  if (!Array.isArray(graph.routePlans) || graph.routePlans.length === 0) {
    fail("must define route plans.");
  }

  const moduleByNumber = new Map();
  const moduleById = new Map();
  const moduleBySlug = new Map();
  const arcIds = new Set(graph.knowledgeArcs.map(({ id }) => id));

  for (const courseModule of graph.modules) {
    if (!Number.isInteger(courseModule.number) || courseModule.number < 1) {
      fail("every module needs a positive integer number.");
    }
    if (moduleByNumber.has(courseModule.number)) {
      fail(`module number ${courseModule.number} is duplicated.`);
    }
    if (courseModule.id !== `m${String(courseModule.number).padStart(2, "0")}`) {
      fail(`Module ${courseModule.number} id must be zero-padded.`);
    }
    assertString(courseModule.slug, `Module ${courseModule.number} slug`);
    assertString(courseModule.title, `Module ${courseModule.number} title`);
    assertString(courseModule.shortTitle, `Module ${courseModule.number} shortTitle`);
    assertString(courseModule.purpose, `Module ${courseModule.number} purpose`);
    assertString(courseModule.knowledgeArcId, `Module ${courseModule.number} knowledgeArcId`);
    if (!arcIds.has(courseModule.knowledgeArcId)) {
      fail(`Module ${courseModule.number} references an unknown knowledge arc.`);
    }
    if (!Array.isArray(courseModule.academicPrerequisiteNumbers)) {
      fail(`Module ${courseModule.number} academicPrerequisiteNumbers must be an array.`);
    }
    if (!expectedRouteRoles.has(courseModule.routeRole)) {
      fail(`Module ${courseModule.number} routeRole is invalid.`);
    }
    if (
      courseModule.referenceReadMinutes !== null &&
      (!Number.isInteger(courseModule.referenceReadMinutes) || courseModule.referenceReadMinutes < 1)
    ) {
      fail(`Module ${courseModule.number} referenceReadMinutes must be a positive integer or null.`);
    }
    if (courseModule.focusedStudyMinutes !== undefined) {
      validateFocusedStudyMinutes(courseModule.focusedStudyMinutes, courseModule.number);
    } else if (focusedStudyModuleNumbers.has(courseModule.number)) {
      fail(`Module ${courseModule.number} needs focusedStudyMinutes for its evidence-planning route.`);
    }
    if (
      courseModule.sourceMap !== null &&
      !isCheckedInSourceMapPath(courseModule.sourceMap)
    ) {
      fail(`Module ${courseModule.number} sourceMap must be a checked-in source-map path or null.`);
    }
    if (!Number.isInteger(courseModule.sequencePosition) || courseModule.sequencePosition < 1) {
      fail(`Module ${courseModule.number} sequencePosition must be a positive integer.`);
    }
    validateModuleState(courseModule);

    moduleByNumber.set(courseModule.number, courseModule);
    moduleById.set(courseModule.id, courseModule);
    moduleBySlug.set(courseModule.slug, courseModule);
  }

  for (let number = 1; number <= 36; number += 1) {
    if (!moduleByNumber.has(number)) {
      fail("must define modules numbered exactly 1 through 36.");
    }
  }

  if (moduleById.size !== graph.modules.length || moduleBySlug.size !== graph.modules.length) {
    fail("module IDs and slugs must be unique.");
  }

  for (const courseModule of graph.modules) {
    const prerequisiteNumbers = new Set(courseModule.academicPrerequisiteNumbers);
    if (prerequisiteNumbers.size !== courseModule.academicPrerequisiteNumbers.length) {
      fail(`Module ${courseModule.number} repeats an academic prerequisite.`);
    }
    for (const prerequisiteNumber of prerequisiteNumbers) {
      if (!moduleByNumber.has(prerequisiteNumber)) {
        fail(`Module ${courseModule.number} references missing prerequisite ${prerequisiteNumber}.`);
      }
      if (prerequisiteNumber === courseModule.number) {
        fail(`Module ${courseModule.number} cannot require itself.`);
      }
    }
    if (
      courseModule.forwardModuleNumber !== null &&
      !moduleByNumber.has(courseModule.forwardModuleNumber)
    ) {
      fail(`Module ${courseModule.number} references a missing forward module.`);
    }
  }

  validateScopeMatrix(graph.scopeMatrix, moduleById);

  const routePlan = routePlanFor(graph);
  if (!Number.isInteger(routePlan.days) || routePlan.days < 1) {
    fail("the Atlas Core route needs a positive day count.");
  }
  if (routePlan.days !== graph.course.days) {
    fail("the Atlas Core route day count must equal the course day count.");
  }
  if (!Number.isInteger(routePlan.intakeDay) || routePlan.intakeDay !== 1) {
    fail("the Atlas Core route must reserve day 1 for intake.");
  }
  if (!Array.isArray(routePlan.phases) || routePlan.phases.length === 0) {
    fail("the Atlas Core route needs phases.");
  }
  let expectedStartDay = routePlan.intakeDay + 1;
  const sequence = routePlan.phases.flatMap((phase) => {
    if (!Array.isArray(phase.moduleNumbers) || phase.moduleNumbers.length === 0) {
      fail(`route phase ${phase.id} needs moduleNumbers.`);
    }
    assertExactKeys(phase.schedule, ["startDay", "endDay"], `route phase ${phase.id} schedule`);
    if (!Number.isInteger(phase.schedule.startDay) || !Number.isInteger(phase.schedule.endDay)) {
      fail(`route phase ${phase.id} schedule must use integer days.`);
    }
    if (phase.schedule.startDay !== expectedStartDay || phase.schedule.endDay < phase.schedule.startDay) {
      fail(`route phase ${phase.id} schedule must continue the preceding phase without a gap.`);
    }
    expectedStartDay = phase.schedule.endDay + 1;
    return phase.moduleNumbers;
  });
  if (expectedStartDay - 1 !== routePlan.days) {
    fail("the Atlas Core route phases must cover every non-intake course day.");
  }
  if (sequence.length !== graph.modules.length || new Set(sequence).size !== sequence.length) {
    fail("the Atlas Core route must contain every module exactly once.");
  }
  const routePositionByNumber = new Map(sequence.map((number, index) => [number, index]));
  for (const number of sequence) {
    if (!moduleByNumber.has(number)) {
      fail(`route references missing Module ${number}.`);
    }
  }
  for (const courseModule of graph.modules) {
    const routePosition = routePositionByNumber.get(courseModule.number);
    if (courseModule.sequencePosition !== routePosition + 1) {
      fail(`Module ${courseModule.number} sequencePosition must match the canonical route.`);
    }
    for (const prerequisiteNumber of courseModule.academicPrerequisiteNumbers) {
      if (routePositionByNumber.get(prerequisiteNumber) >= routePosition) {
        fail(`Module ${courseModule.number} precedes academic prerequisite ${prerequisiteNumber} in the route.`);
      }
    }
  }

  return graph;
}

export async function loadCourseGraph() {
  const graph = JSON.parse(await readFile(graphPath, "utf8"));
  validateCourseGraph(graph);
  const routePlan = routePlanFor(graph);
  return {
    ...graph,
    routePlan,
    sequence: routePlan.phases.flatMap(({ moduleNumbers }) => moduleNumbers),
  };
}

export function projectReaderModules(graph) {
  validateCourseGraph(graph);
  const routePlan = routePlanFor(graph);
  const sequence = routePlan.phases.flatMap(({ moduleNumbers }) => moduleNumbers);
  const moduleByNumber = new Map(graph.modules.map((courseModule) => [courseModule.number, courseModule]));

  return graph.modules
    .filter((courseModule) => resolveLearnerAccess(courseModule).readerAccess !== "hidden")
    .sort((left, right) => left.number - right.number)
    .map((courseModule) => {
      const routeIndex = sequence.indexOf(courseModule.number);
      const previousRouteModule = routeIndex > 0 ? moduleByNumber.get(sequence[routeIndex - 1]) : null;
      const nextRouteModule = routeIndex < sequence.length - 1 ? moduleByNumber.get(sequence[routeIndex + 1]) : null;
      const prerequisites = courseModule.academicPrerequisiteNumbers.map((number) => {
        const prerequisite = moduleByNumber.get(number);
        if (!prerequisite) {
          fail(`Module ${courseModule.number} projection has missing prerequisite ${number}.`);
        }
        return prerequisite;
      });

      return {
        ...courseModule,
        routePosition: courseModule.sequencePosition,
        prerequisiteNumbers: courseModule.academicPrerequisiteNumbers,
        prerequisiteSlugs: prerequisites
          .filter((prerequisite) => resolveLearnerAccess(prerequisite).readerAccess !== "hidden")
          .map(({ slug }) => slug),
        previousRouteNumber: previousRouteModule?.number ?? null,
        previousSlug:
          previousRouteModule && resolveLearnerAccess(previousRouteModule).readerAccess !== "hidden"
            ? previousRouteModule.slug
            : null,
        nextRouteNumber: nextRouteModule?.number ?? null,
        nextSlug:
          nextRouteModule && resolveLearnerAccess(nextRouteModule).readerAccess !== "hidden"
            ? nextRouteModule.slug
            : null,
      };
    });
}

// Kept as a short-lived migration alias for integrations that still use the
// old projection name. New callers must use projectReaderModules so the
// distinction is visible in code review.
export const projectReadableModules = projectReaderModules;

export function projectRoutePlan(graph, routePlanId = "atlas-core-60") {
  validateCourseGraph(graph);
  const moduleByNumber = new Map(graph.modules.map((courseModule) => [courseModule.number, courseModule]));
  const routePlan = routePlanFor(graph, routePlanId);
  return {
    ...routePlan,
    phases: routePlan.phases.map((phase) => ({
      ...phase,
      days: routeDayLabel(phase.schedule),
      entries: phase.moduleNumbers.map((number) => moduleByNumber.get(number)),
    })),
  };
}
