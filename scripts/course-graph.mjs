import { readFile } from "node:fs/promises";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const siteRoot = resolve(scriptDirectory, "..");
const graphPath = resolve(siteRoot, "content", "course", "course-graph.v1.json");
const expectedAvailabilityStates = new Set([
  "published",
  "preview",
  "locked",
  "optional",
  "authoring-only",
]);
const expectedLifecycles = new Set(["published", "authoring-only"]);
const expectedRouteRoles = new Set(["required", "optional"]);

function fail(message) {
  throw new Error(`Invalid Atlas course graph: ${message}`);
}

function assertString(value, label) {
  if (typeof value !== "string" || value.trim() === "") {
    fail(`${label} must be a non-empty string.`);
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

export function validateCourseGraph(graph) {
  if (!graph || typeof graph !== "object") {
    fail("root must be an object.");
  }
  if (graph.schemaVersion !== 1) {
    fail("schemaVersion must be 1.");
  }
  if (!Array.isArray(graph.modules) || graph.modules.length !== 36) {
    fail("must define exactly 36 modules.");
  }
  if (!Array.isArray(graph.availabilityStates)) {
    fail("availabilityStates must be an array.");
  }
  const availabilityStates = new Set(graph.availabilityStates);
  for (const state of expectedAvailabilityStates) {
    if (!availabilityStates.has(state)) {
      fail(`availability state ${state} is missing.`);
    }
  }
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
    if (!expectedLifecycles.has(courseModule.lifecycle)) {
      fail(`Module ${courseModule.number} lifecycle is invalid.`);
    }
    if (!expectedAvailabilityStates.has(courseModule.availability)) {
      fail(`Module ${courseModule.number} availability is invalid.`);
    }
    if (!expectedRouteRoles.has(courseModule.routeRole)) {
      fail(`Module ${courseModule.number} routeRole is invalid.`);
    }
    if (
      courseModule.lifecycle === "authoring-only" &&
      courseModule.availability !== "authoring-only"
    ) {
      fail(`authoring-only Module ${courseModule.number} must be authoring-only in the route.`);
    }
    if (
      courseModule.lifecycle === "published" &&
      courseModule.availability === "authoring-only"
    ) {
      fail(`published Module ${courseModule.number} cannot be authoring-only in the route.`);
    }
    if (
      courseModule.referenceReadMinutes !== null &&
      (!Number.isInteger(courseModule.referenceReadMinutes) ||
        courseModule.referenceReadMinutes < 1)
    ) {
      fail(`Module ${courseModule.number} referenceReadMinutes must be a positive integer or null.`);
    }
    if (
      courseModule.sourceMap !== null &&
      !isCheckedInSourceMapPath(courseModule.sourceMap)
    ) {
      fail(`Module ${courseModule.number} sourceMap must be a checked-in source-map path or null.`);
    }
    if (!courseModule.releaseEvidence || typeof courseModule.releaseEvidence !== "object") {
      fail(`Module ${courseModule.number} needs releaseEvidence.`);
    }
    assertString(courseModule.releaseEvidence.id, `Module ${courseModule.number} release evidence id`);
    assertString(courseModule.releaseEvidence.status, `Module ${courseModule.number} release evidence status`);

    moduleByNumber.set(courseModule.number, courseModule);
    moduleById.set(courseModule.id, courseModule);
    moduleBySlug.set(courseModule.slug, courseModule);
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
  if (!Array.isArray(routePlan.phases) || routePlan.phases.length === 0) {
    fail("the Atlas Core route needs phases.");
  }
  const sequence = routePlan.phases.flatMap((phase) => {
    if (!Array.isArray(phase.moduleNumbers) || phase.moduleNumbers.length === 0) {
      fail(`route phase ${phase.id} needs moduleNumbers.`);
    }
    return phase.moduleNumbers;
  });
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

export function projectReadableModules(graph) {
  validateCourseGraph(graph);
  const routePlan = routePlanFor(graph);
  const sequence = routePlan.phases.flatMap(({ moduleNumbers }) => moduleNumbers);
  const moduleByNumber = new Map(graph.modules.map((courseModule) => [courseModule.number, courseModule]));

  return graph.modules
    .filter(({ lifecycle }) => lifecycle === "published")
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
        routePosition: routeIndex + 1,
        prerequisiteNumbers: courseModule.academicPrerequisiteNumbers,
        prerequisiteSlugs: prerequisites
          .filter(({ lifecycle }) => lifecycle === "published")
          .map(({ slug }) => slug),
        previousRouteNumber: previousRouteModule?.number ?? null,
        previousSlug:
          previousRouteModule?.lifecycle === "published"
            ? previousRouteModule.slug
            : null,
        nextRouteNumber: nextRouteModule?.number ?? null,
        nextSlug:
          nextRouteModule?.lifecycle === "published"
            ? nextRouteModule.slug
            : null,
      };
    });
}

export function projectRoutePlan(graph, routePlanId = "atlas-core-60") {
  validateCourseGraph(graph);
  const moduleByNumber = new Map(graph.modules.map((courseModule) => [courseModule.number, courseModule]));
  const routePlan = routePlanFor(graph, routePlanId);
  return {
    ...routePlan,
    phases: routePlan.phases.map((phase) => ({
      ...phase,
      entries: phase.moduleNumbers.map((number) => moduleByNumber.get(number)),
    })),
  };
}
