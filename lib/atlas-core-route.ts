import {
  atlasCoreRoutePlan,
  courseCatalogTotals,
  getCourseGraphModule,
  type CourseModuleState,
} from "./course-catalog";

export type AtlasRouteEntry = {
  number: number;
  title: string;
  shortTitle: string;
  state: CourseModuleState;
  prerequisiteNumbers: number[];
  purpose: string;
  masteryGateId: string;
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
      };
    }),
  }),
);

export const atlasRouteEntries = atlasCoreRoute.flatMap(({ entries }) => entries);

export function getAtlasRouteEntry(number: number) {
  return atlasRouteEntries.find((entry) => entry.number === number);
}

export const atlasCoreRouteReleaseStatus = {
  "core-open": courseCatalogTotals.coreOpen,
  "preview-reader": courseCatalogTotals.previewReader,
  "authoring-only": courseCatalogTotals.authoring,
};

export const atlasCoreRouteTotals = {
  days: courseCatalogTotals.days,
  modules: courseCatalogTotals.modules,
  focusedHoursPerWeek: courseCatalogTotals.focusedHoursPerWeek,
  consolidation: courseCatalogTotals.consolidation,
};
