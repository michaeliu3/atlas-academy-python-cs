import registryData from "@/content/course/module-companion-guides.v1.json";

export type ModuleCompanionLens = "code" | "formal" | "systems" | "evidence";

export type ModuleCompanionGuide = {
  moduleId: string;
  lens: ModuleCompanionLens;
  centralModel: string;
  traceOrDerivation: string;
  misconception: string;
  boundary: string;
  transfer: string;
};

type ModuleCompanionGuideRegistry = {
  schemaVersion: 1;
  guideVersion: "v1";
  kind: "atlas-module-companion-guides";
  canonicalCourseGraph: "content/course/course-graph.v2.json";
  liveCodexLearningWorkflow: "content/course/live-codex-learning-workflow.v2.json";
  guides: ModuleCompanionGuide[];
};

export const moduleCompanionGuideRegistry =
  registryData as ModuleCompanionGuideRegistry;
export const moduleCompanionGuides = moduleCompanionGuideRegistry.guides;

const guidesByModuleId = new Map(
  moduleCompanionGuides.map((guide) => [guide.moduleId, guide]),
);

export function getModuleCompanionGuide(moduleId: string) {
  return guidesByModuleId.get(moduleId);
}
