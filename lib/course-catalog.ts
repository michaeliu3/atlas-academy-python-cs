import courseGraphData from "@/content/course/course-graph.v2.json";
import type { ModuleStudioId } from "./module-studio-registry";

export type CourseLifecycle = "learner-material-ready" | "authoring-only";
export type CourseAvailability =
  | "legacy-open"
  | "published"
  | "preview"
  | "locked"
  | "optional"
  | "authoring-only";
export type CourseReaderAccess = "hidden" | "preview" | "full";
export type CourseContractTrack = "legacy-v1" | "advanced-v1";
export type CourseContractState =
  | "not-started"
  | "authoring-only"
  | "legacy-baseline"
  | "review-ready"
  | "verified";
export type CourseReleaseState =
  | "unrecorded"
  | "candidate-recorded"
  | "deployed-recorded";
export type CourseRouteRole = "required" | "optional";

export type CoursePrivateGuidedStudy = {
  status: "ready";
  delivery: "designated-codex-chats";
};

export type FocusedStudyMinutes = {
  minimumEvidence: [number, number];
  deepDossier: [number, number];
};
export type ScopeMatrixState =
  | "core-mastery"
  | "scoped-exposure"
  | "post-core-specialization"
  | "explicitly-deferred";
export type ScopeMatrixCapability =
  | "recognize"
  | "read"
  | "derive"
  | "debug"
  | "design"
  | "implement";

export type ScopeMatrixAnchor = {
  moduleId: string;
  sessions: number[];
};

export type ScopeMatrixTopic = {
  id: string;
  level: number;
  label: string;
  scope: ScopeMatrixState;
  targetCapabilities: ScopeMatrixCapability[];
  anchors: ScopeMatrixAnchor[];
  sourceModuleIds: string[];
  evidenceArtifact: string;
  trackId: string | null;
};

export type ScopeMatrixExtensionTrack = {
  id: string;
  title: string;
  status: "design-only";
  cadence: {
    firstPassDays: 90;
    recommendedDays: 180;
    rationale: string;
  };
  prerequisiteModuleIds: string[];
  calibrationUrls: string[];
  project: string;
  oralDefense: string;
  nonClaim: string;
};

export type ScopeMatrixBenchmarkItem = {
  id: string;
  level: number;
  label: string;
  scopeTopicIds: string[];
};

export type ScopeMatrixInventoryDirective =
  | "master"
  | "graduate-master"
  | "also-know"
  | "study";

export type ScopeMatrixBenchmarkSourceList = {
  sectionId: string;
  directive: ScopeMatrixInventoryDirective;
  sourceLineStart: number;
  sourceLineEnd: number;
};

export type ScopeMatrixBenchmarkAtomicItem = {
  sourceLine: number;
  sectionId: string;
  label: string;
  scopeTopicIds: string[];
};

export type CourseScopeMatrix = {
  schemaVersion: 4;
  benchmark: {
    id: string;
    title: string;
    accessedOn: string;
    sourceDigest: string;
    sourceBoundary: string;
    items: ScopeMatrixBenchmarkItem[];
    sourceLists: ScopeMatrixBenchmarkSourceList[];
    atomicItemCount: number;
    atomicItems: ScopeMatrixBenchmarkAtomicItem[];
  };
  scopeStates: ScopeMatrixState[];
  capabilities: ScopeMatrixCapability[];
  topics: ScopeMatrixTopic[];
  extensionTracks: ScopeMatrixExtensionTrack[];
};

export type CourseModuleState = {
  lifecycle: CourseLifecycle;
  readerAccess: CourseReaderAccess;
  availability: CourseAvailability;
  contract: {
    track: CourseContractTrack;
    state: CourseContractState;
  };
  release: {
    state: CourseReleaseState;
    recordId: string | null;
  };
  privateGuidedStudy?: CoursePrivateGuidedStudy;
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
  routeRole: CourseRouteRole;
  referenceReadMinutes: number | null;
  focusedStudyMinutes?: FocusedStudyMinutes;
  sourceMap: string | null;
  studioId: ModuleStudioId | null;
  sequencePosition: number;
  state: CourseModuleState;
};

export type KnowledgeArc = {
  id: string;
  numeral: string;
  title: string;
  range: string;
  description: string;
};

export type RouteSchedule = {
  startDay: number;
  endDay: number;
};

export type RoutePhase = {
  id: string;
  schedule: RouteSchedule;
  number: string;
  title: string;
  premise: string;
  gate: string;
  moduleNumbers: number[];
};

export type DisplayRoutePhase = RoutePhase & {
  days: string;
};

export type CourseRoutePlan = {
  id: string;
  days: number;
  intakeDay: number;
  phases: RoutePhase[];
};

export type DisplayCourseRoutePlan = Omit<CourseRoutePlan, "phases"> & {
  phases: DisplayRoutePhase[];
};

type CourseGraph = {
  schemaVersion: 2;
  course: {
    id: string;
    title: string;
    days: number;
    focusedHoursPerWeek: string;
    consolidation: string;
  };
  availabilityStates: CourseAvailability[];
  lifecycleStates: CourseLifecycle[];
  readerAccessStates: CourseReaderAccess[];
  contractTracks: CourseContractTrack[];
  contractStates: CourseContractState[];
  releaseStates: CourseReleaseState[];
  knowledgeArcs: KnowledgeArc[];
  scopeMatrix: CourseScopeMatrix;
  routePlans: CourseRoutePlan[];
  modules: CourseGraphModule[];
};

export const courseCatalog = courseGraphData as CourseGraph;
export const courseScopeMatrix = courseCatalog.scopeMatrix;

const primaryRoutePlan = courseCatalog.routePlans.find(
  ({ id }) => id === "atlas-core-60",
);

if (!primaryRoutePlan) {
  throw new Error("Atlas course catalog is missing the primary 60-day route.");
}

function routeDayLabel({ startDay, endDay }: RouteSchedule) {
  return startDay === endDay ? `Day ${startDay}` : `Days ${startDay}–${endDay}`;
}

export const atlasCoreRoutePlan: DisplayCourseRoutePlan = {
  ...primaryRoutePlan,
  phases: primaryRoutePlan.phases.map((phase) => ({
    ...phase,
    days: routeDayLabel(phase.schedule),
  })),
};
export const atlasCoreRouteSequence = atlasCoreRoutePlan.phases.flatMap(
  ({ moduleNumbers }) => moduleNumbers,
);
export const courseGraphModulesByNumber = new Map(
  courseCatalog.modules.map((courseModule) => [courseModule.number, courseModule]),
);
export const courseGraphModulesBySlug = new Map(
  courseCatalog.modules.map((courseModule) => [courseModule.slug, courseModule]),
);

export function formatFocusedStudyHours([minimum, maximum]: [number, number]) {
  const formatHours = (minutes: number) => {
    const hours = minutes / 60;
    return Number.isInteger(hours) ? String(hours) : hours.toFixed(1).replace(/\.0$/u, "");
  };

  return `${formatHours(minimum)}–${formatHours(maximum)} h`;
}

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

export function isReaderVisible(courseModule: CourseGraphModule) {
  return courseModule.state.readerAccess !== "hidden";
}

export function isLegacyOpen(courseModule: CourseGraphModule) {
  return (
    courseModule.state.readerAccess === "full" &&
    courseModule.state.availability === "legacy-open" &&
    courseModule.state.contract.track === "legacy-v1" &&
    courseModule.state.contract.state === "legacy-baseline" &&
    courseModule.state.release.state === "unrecorded"
  );
}

export function isPublishedCourseModule(courseModule: CourseGraphModule) {
  return (
    courseModule.state.readerAccess === "full" &&
    courseModule.state.availability === "published" &&
    courseModule.state.contract.state === "verified" &&
    courseModule.state.release.state === "deployed-recorded"
  );
}

export function isOpenRouteMaterial(courseModule: CourseGraphModule) {
  return isLegacyOpen(courseModule) || isPublishedCourseModule(courseModule);
}

export function isPreviewReader(courseModule: CourseGraphModule) {
  return courseModule.state.readerAccess === "preview";
}

export function isReferenceOnly(
  courseModule: { state: Pick<CourseModuleState, "availability"> },
) {
  return (
    courseModule.state.availability === "preview" ||
    courseModule.state.availability === "optional"
  );
}

export const courseCatalogTotals = {
  modules: courseCatalog.modules.length,
  readerVisible: courseCatalog.modules.filter(isReaderVisible).length,
  legacyOpen: courseCatalog.modules.filter(isLegacyOpen).length,
  published: courseCatalog.modules.filter(isPublishedCourseModule).length,
  openRouteMaterial: courseCatalog.modules.filter(isOpenRouteMaterial).length,
  previewReader: courseCatalog.modules.filter(isPreviewReader).length,
  authoring: courseCatalog.modules.filter(
    ({ state }) => state.lifecycle === "authoring-only",
  ).length,
  days: courseCatalog.course.days,
  focusedHoursPerWeek: courseCatalog.course.focusedHoursPerWeek,
  consolidation: courseCatalog.course.consolidation,
};
