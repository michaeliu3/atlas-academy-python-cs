import {
  atlasCoreRoutePlan,
  courseCatalog,
  courseCatalogTotals,
  getCourseGraphModule,
  type CourseModuleState,
  type FocusedStudyMinutes,
} from "./course-catalog";

export type AtlasRouteEntry = {
  number: number;
  title: string;
  shortTitle: string;
  state: CourseModuleState;
  prerequisiteNumbers: number[];
  purpose: string;
  masteryGateId: string;
  focusedStudyMinutes: FocusedStudyMinutes | null;
};

export type AtlasRoutePhase = {
  id: string;
  days: string;
  number: string;
  title: string;
  premise: string;
  gate: string;
  entries: AtlasRouteEntry[];
};

export const atlasCoreRoute: AtlasRoutePhase[] = atlasCoreRoutePlan.phases.map(
  (phase) => ({
    id: phase.id,
    days: phase.days,
    number: phase.number,
    title: phase.title,
    premise: phase.premise,
    gate: phase.gate,
    entries: phase.moduleNumbers.map((number) => {
      const courseModule = getCourseGraphModule(number);
      if (!courseModule) {
        throw new Error(`Atlas Core route references unknown Module ${number}.`);
      }
      return {
        number: courseModule.number,
        title: courseModule.title,
        shortTitle: courseModule.shortTitle,
        state: courseModule.state,
        prerequisiteNumbers: courseModule.academicPrerequisiteNumbers,
        purpose: courseModule.purpose,
        masteryGateId: courseModule.masteryGateId,
        focusedStudyMinutes: courseModule.focusedStudyMinutes ?? null,
      };
    }),
  }),
);

export const atlasRouteEntries = atlasCoreRoute.flatMap(({ entries }) => entries);

export function getAtlasRouteEntry(number: number) {
  return atlasRouteEntries.find((entry) => entry.number === number);
}

const availabilityCounts = courseCatalog.availabilityStates.reduce(
  (counts, availability) => {
    counts[availability] = courseCatalog.modules.filter(
      ({ state }) => state.availability === availability,
    ).length;
    return counts;
  },
  {} as Record<(typeof courseCatalog.availabilityStates)[number], number>,
);

const availabilityTotal = Object.values(availabilityCounts).reduce(
  (total, count) => total + count,
  0,
);
if (availabilityTotal !== courseCatalog.modules.length) {
  throw new Error(
    `Course availability projection covers ${availabilityTotal} modules, expected ${courseCatalog.modules.length}.`,
  );
}

export const atlasCoreRouteAvailabilityStatus = {
  ...availabilityCounts,
  "preview-reader": availabilityCounts.preview,
};

export const atlasCoreRouteTotals = {
  days: courseCatalogTotals.days,
  modules: courseCatalogTotals.modules,
  focusedHoursPerWeek: courseCatalogTotals.focusedHoursPerWeek,
  consolidation: courseCatalogTotals.consolidation,
};
