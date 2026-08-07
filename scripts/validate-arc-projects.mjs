import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const graph = JSON.parse(fs.readFileSync(path.join(siteRoot, "content/course/course-graph.v2.json"), "utf8"));
const registry = JSON.parse(fs.readFileSync(path.join(siteRoot, "content/course/arc-projects.v1.json"), "utf8"));
const errors = [];
const expectedModules = new Set(graph.modules.map((graphModule) => graphModule.id));
const seenModules = new Set();
const projectIds = new Set();

if (registry.projects?.length !== 6) errors.push(`expected six cumulative arc projects, found ${registry.projects?.length ?? 0}`);
for (const project of registry.projects ?? []) {
  if (!project.id || projectIds.has(project.id)) errors.push(`duplicate or missing project id: ${project.id ?? "<missing>"}`);
  projectIds.add(project.id);
  if (!project.moduleIds?.length || project.moduleIds.length !== project.moduleSlices?.length) {
    errors.push(`${project.id}: moduleIds and moduleSlices must have the same non-zero length`);
  }
  if (project.deliveryLoop?.length !== 7) errors.push(`${project.id}: delivery loop must have seven collaborative stages`);
  for (const slice of project.moduleSlices ?? []) {
    if (!expectedModules.has(slice.moduleId)) errors.push(`${project.id}: unknown module slice ${slice.moduleId}`);
    if (seenModules.has(slice.moduleId)) errors.push(`${slice.moduleId}: assigned to more than one arc project`);
    seenModules.add(slice.moduleId);
    if (!slice.scope || !slice.learnerArtifact) errors.push(`${slice.moduleId}: scope and learner artifact are required`);
  }
}
for (const moduleId of expectedModules) {
  if (!seenModules.has(moduleId)) errors.push(`${moduleId}: missing from cumulative arc project spine`);
}
const capstone = registry.capstone;
if (capstone?.moduleId !== "m26" || capstone?.status !== "evidence-gated-preview") {
  errors.push("capstone must be the evidence-gated M26 local capstone");
}
if (!capstone?.requiredInputs?.length || capstone.requiredInputs.some((projectId) => !projectIds.has(projectId))) {
  errors.push("capstone must require all six cumulative arc projects");
}

const summary = {
  projects: registry.projects?.length ?? 0,
  moduleSlices: seenModules.size,
  capstone: capstone?.moduleId ?? null,
  errors: errors.length,
};
if (errors.length) {
  console.error(JSON.stringify({ summary, errors }, null, 2));
  process.exitCode = 1;
} else {
  console.log(JSON.stringify(summary, null, 2));
}
