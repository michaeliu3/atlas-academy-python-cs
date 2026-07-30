import courseGraphData from "@/content/course/course-graph.v1.json";

export type CourseLifecycle = "published" | "authoring-only";
export type CourseAvailability =
  | "published"
  | "preview"
  | "locked"
  | "optional"
  | "authoring-only";
export type CourseRouteRole = "required" | "optional";

export type CourseReleaseEvidence = {
  id: string;
  status: "legacy-audit-pending" | "verified" | "planned";
};

export type CourseGraphModule = {
  id: string;
  number: number;
  slug: string;
  title: string;
  shortTitle: string;
  purpose: string;
  knowledgeArcId: string;
  academicPrerequisiteNumbers: number[];
  forwardModuleNumber: number | null;
  masteryGateId: string;
  lifecycle: CourseLifecycle;
  availability: CourseAvailability;
  routeRole: CourseRouteRole;
  referenceReadMinutes: number | null;
  sourceMap: string | null;
  studioId: string | null;
  releaseEvidence: CourseReleaseEvidence;
};

export type KnowledgeArc = {
  id: string;
  numeral: string;
  title: string;
  range: string;
  description: string;
};

export type RoutePhase = {
  id: string;
  days: string;
  number: string;
  title: string;
  premise: string;
  gate: string;
  moduleNumbers: number[];
};

export type CourseRoutePlan = {
  id: string;
  days: number;
  phases: RoutePhase[];
};

type CourseGraph = {
  schemaVersion: 1;
  course: {
    id: string;
    title: string;
    days: number;
    focusedHoursPerWeek: string;
    consolidation: string;
  };
  availabilityStates: CourseAvailability[];
  knowledgeArcs: KnowledgeArc[];
  routePlans: CourseRoutePlan[];
  modules: CourseGraphModule[];
};

export const courseCatalog = courseGraphData as CourseGraph;

const primaryRoutePlan = courseCatalog.routePlans.find(
  ({ id }) => id === "atlas-core-60",
);

if (!primaryRoutePlan) {
  throw new Error("Atlas course catalog is missing the primary 60-day route.");
}

export const atlasCoreRoutePlan = primaryRoutePlan;
export const atlasCoreRouteSequence = atlasCoreRoutePlan.phases.flatMap(
  ({ moduleNumbers }) => moduleNumbers,
);
export const courseGraphModulesByNumber = new Map(
  courseCatalog.modules.map((courseModule) => [courseModule.number, courseModule]),
);
export const courseGraphModulesBySlug = new Map(
  courseCatalog.modules.map((courseModule) => [courseModule.slug, courseModule]),
);

export function getCourseGraphModule(number: number) {
  return courseGraphModulesByNumber.get(number);
}

export function getCourseGraphModuleBySlug(slug: string) {
  return courseGraphModulesBySlug.get(slug);
}

export function getKnowledgeArc(arcId: string) {
  return courseCatalog.knowledgeArcs.find((arc) => arc.id === arcId);
}

export function getRouteNeighbors(number: number) {
  const routeIndex = atlasCoreRouteSequence.indexOf(number);
  if (routeIndex < 0) {
    return { previous: undefined, next: undefined };
  }
  return {
    previous:
      routeIndex > 0
        ? getCourseGraphModule(atlasCoreRouteSequence[routeIndex - 1])
        : undefined,
    next:
      routeIndex < atlasCoreRouteSequence.length - 1
        ? getCourseGraphModule(atlasCoreRouteSequence[routeIndex + 1])
        : undefined,
  };
}

export function isReaderReleased(courseModule: CourseGraphModule) {
  return courseModule.lifecycle === "published";
}

export function isCoreOpen(courseModule: CourseGraphModule) {
  return courseModule.lifecycle === "published" && courseModule.availability === "published";
}

export function isPreview(courseModule: CourseGraphModule) {
  return courseModule.lifecycle === "published" && courseModule.availability === "preview";
}

export const courseCatalogTotals = {
  modules: courseCatalog.modules.length,
  published: courseCatalog.modules.filter(isCoreOpen).length,
  previews: courseCatalog.modules.filter(isPreview).length,
  authoring: courseCatalog.modules.filter(
    ({ lifecycle }) => lifecycle === "authoring-only",
  ).length,
  days: courseCatalog.course.days,
  focusedHoursPerWeek: courseCatalog.course.focusedHoursPerWeek,
  consolidation: courseCatalog.course.consolidation,
};
