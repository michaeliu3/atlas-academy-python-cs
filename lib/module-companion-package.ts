import workflowData from "@/content/course/live-codex-learning-workflow.v2.json";
import {
  courseCatalog,
  getCourseGraphModule,
  type CourseAvailability,
  type CoursePrivateGuidedStudy,
} from "./course-catalog";
import { getModuleCompanionGuide, type ModuleCompanionGuide } from "./module-companion-guides";
import { buildModuleCompanionPackage } from "./module-companion-package-builder.mjs";

export type ModuleCompanionForwardHandoff = {
  moduleId: string;
  number: number;
  title: string;
  availability: CourseAvailability;
  privateGuidedStudy: CoursePrivateGuidedStudy | null;
};

export type ModuleCompanionPackage = {
  schemaVersion: 2;
  module: {
    id: string;
    number: number;
    title: string;
    purpose: string;
    availability: CourseAvailability;
    privateGuidedStudy: CoursePrivateGuidedStudy | null;
    academicPrerequisites: ModuleCompanionForwardHandoff[];
    declaredForwardHandoff: ModuleCompanionForwardHandoff | null;
  };
  guide: ModuleCompanionGuide;
  whiteboardProtocol: string[];
  recordBoundary: {
    portableStartupMode: "keep-local";
    designatedChatMode: "automatic-after-substantive-session";
    closurePhrase: "end session";
  };
  teachingAssistant: {
    role: "supportive-oral-defense";
    contextPrompt: string;
  };
  studyPartner: {
    role: "non-grading-rehearsal";
    contextPrompt: string;
  };
};

export function getModuleCompanionPackage(moduleNumber: number): ModuleCompanionPackage {
  const courseModule = getCourseGraphModule(moduleNumber);
  if (!courseModule) {
    throw new Error(`Atlas has no canonical Module ${moduleNumber} companion package.`);
  }
  const guide = getModuleCompanionGuide(courseModule.id);
  if (!guide) {
    throw new Error(`Atlas has no companion guide for ${courseModule.id}.`);
  }
  return buildModuleCompanionPackage({
    courseModule,
    graphModules: courseCatalog.modules,
    guide,
    liveWorkflow: workflowData,
  }) as ModuleCompanionPackage;
}
