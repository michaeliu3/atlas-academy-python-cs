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

  assertExactKeys(
    courseModule.state,
    ["lifecycle", "readerAccess", "availability", "contract", "release"],
    `Module ${number} state`,
  );
  const { lifecycle, readerAccess, availability, contract, release } = courseModule.state;
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
