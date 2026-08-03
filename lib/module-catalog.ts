import manifestData from "@/content/modules/manifest.json";
import { moduleMarkdownBySlug } from "@/content/modules/module-content";
import {
  extractSessionLaunches,
  extractTableOfContents,
  stripDocumentTitle,
} from "./heading-ids.js";
import type {
  CourseModuleState,
  CourseRouteRole,
} from "./course-catalog";
import type { ModuleStudioId } from "./module-studio-registry";

export { extractSessionLaunches, extractTableOfContents, stripDocumentTitle };

export type CourseArc = {
  id: string;
  numeral: string;
  title: string;
  range: string;
  description: string;
};

export type CourseModule = {
  id: string;
  number: number;
  slug: string;
  filename: string;
  title: string;
  summary: string;
  arcId: string;
  wordCount: number;
  estimatedMinutes: number;
  sourceHash: string;
  state: CourseModuleState;
  routeRole: CourseRouteRole;
  routePosition: number;
  masteryGateId: string;
  sourceMap: string | null;
  studioId: ModuleStudioId | null;
  prerequisiteNumbers: number[];
  prerequisiteSlugs: string[];
  previousRouteNumber: number | null;
  previousSlug: string | null;
  nextRouteNumber: number | null;
  nextSlug: string | null;
};

export type TableOfContentsItem = {
  id: string;
  title: string;
  depth: 2 | 3;
};

export type ModuleSessionLaunch = {
  number: number;
  id: string;
  title: string;
  launch: string | null;
  output: string | null;
};

type ModuleManifest = {
  schemaVersion: 4;
  courseGraphSchemaVersion: number;
  routePlanId: string;
  definedModuleCount: number;
  readerVisibleModuleCount: number;
  legacyOpenModuleCount: number;
  publishedModuleCount: number;
  previewReaderModuleCount: number;
  arcs: CourseArc[];
  modules: CourseModule[];
};

export const moduleManifest = manifestData as ModuleManifest;

export function getModuleBySlug(slug: string) {
  return moduleManifest.modules.find((courseModule) => courseModule.slug === slug);
}

export function getModuleMarkdown(slug: string) {
  return moduleMarkdownBySlug[slug];
}

export function getArcById(arcId: string) {
  return moduleManifest.arcs.find((arc) => arc.id === arcId);
}

export function moduleHref(slug: string) {
  return `/modules/${slug}`;
}
