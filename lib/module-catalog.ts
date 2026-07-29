import manifestData from "@/content/modules/manifest.json";
import { moduleMarkdownBySlug } from "@/content/modules/module-content";
import {
  extractTableOfContents,
  stripDocumentTitle,
} from "./heading-ids.js";

export { extractTableOfContents, stripDocumentTitle };

export type CourseArc = {
  id: string;
  numeral: string;
  title: string;
  range: string;
  description: string;
};

export type CourseModule = {
  number: number;
  slug: string;
  filename: string;
  title: string;
  summary: string;
  arcId: string;
  wordCount: number;
  estimatedMinutes: number;
  sourceHash: string;
  prerequisiteSlug: string | null;
  previousSlug: string | null;
  nextSlug: string | null;
};

export type TableOfContentsItem = {
  id: string;
  title: string;
  depth: 2 | 3;
};

type ModuleManifest = {
  schemaVersion: number;
  moduleCount: number;
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
