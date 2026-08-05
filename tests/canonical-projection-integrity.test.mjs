import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  loadCourseGraph,
  projectReaderModules,
} from "../scripts/course-graph.mjs";

function graphProjectionFields(projected) {
  return {
    number: projected.number,
    slug: projected.slug,
    title: projected.title,
    arcId: projected.knowledgeArcId,
    estimatedMinutes: projected.referenceReadMinutes,
    focusedStudyMinutes: projected.focusedStudyMinutes ?? null,
    id: projected.id,
    state: projected.state,
    routeRole: projected.routeRole,
    routePosition: projected.routePosition,
    masteryGateId: projected.masteryGateId,
    sourceMap: projected.sourceMap,
    studioId: projected.studioId,
    prerequisiteNumbers: projected.prerequisiteNumbers,
    prerequisiteSlugs: projected.prerequisiteSlugs,
    previousRouteNumber: projected.previousRouteNumber,
    previousSlug: projected.previousSlug,
    nextRouteNumber: projected.nextRouteNumber,
    nextSlug: projected.nextSlug,
  };
}

function manifestProjectionFields(manifestModule) {
  return {
    number: manifestModule.number,
    slug: manifestModule.slug,
    title: manifestModule.title,
    arcId: manifestModule.arcId,
    estimatedMinutes: manifestModule.estimatedMinutes,
    focusedStudyMinutes: manifestModule.focusedStudyMinutes,
    id: manifestModule.id,
    state: manifestModule.state,
    routeRole: manifestModule.routeRole,
    routePosition: manifestModule.routePosition,
    masteryGateId: manifestModule.masteryGateId,
    sourceMap: manifestModule.sourceMap,
    studioId: manifestModule.studioId,
    prerequisiteNumbers: manifestModule.prerequisiteNumbers,
    prerequisiteSlugs: manifestModule.prerequisiteSlugs,
    previousRouteNumber: manifestModule.previousRouteNumber,
    previousSlug: manifestModule.previousSlug,
    nextRouteNumber: manifestModule.nextRouteNumber,
    nextSlug: manifestModule.nextSlug,
  };
}

test("the reader manifest is an exact projection of the canonical graph", async () => {
  const [graph, manifest] = await Promise.all([
    loadCourseGraph(),
    readFile(new URL("../content/modules/manifest.json", import.meta.url), "utf8").then(JSON.parse),
  ]);
  const projectedModules = projectReaderModules(graph);
  const projectedByNumber = new Map(projectedModules.map((module) => [module.number, module]));

  assert.equal(manifest.courseGraphSchemaVersion, graph.schemaVersion);
  assert.equal(manifest.routePlanId, graph.routePlan.id);
  assert.equal(manifest.definedModuleCount, graph.modules.length);
  assert.equal(manifest.readerVisibleModuleCount, projectedModules.length);
  assert.equal(
    manifest.legacyOpenModuleCount,
    projectedModules.filter(({ state }) => state.availability === "legacy-open").length,
  );
  assert.equal(
    manifest.publishedModuleCount,
    projectedModules.filter(({ state }) => state.availability === "published").length,
  );
  assert.equal(
    manifest.previewReaderModuleCount,
    projectedModules.filter(({ state }) => state.readerAccess === "preview").length,
  );
  const readerArcIds = new Set(projectedModules.map(({ knowledgeArcId }) => knowledgeArcId));
  assert.deepEqual(
    manifest.arcs,
    graph.knowledgeArcs.filter(({ id }) => readerArcIds.has(id)),
    "the reader manifest must project only arcs represented by reader-visible modules",
  );

  assert.deepEqual(
    manifest.modules.map(({ number }) => number),
    projectedModules.map(({ number }) => number),
    "the manifest must not add, drop, or reorder reader-visible graph modules",
  );
  for (const manifestModule of manifest.modules) {
    const projected = projectedByNumber.get(manifestModule.number);
    assert.ok(projected, `manifest contains an unprojected Module ${manifestModule.number}`);
    assert.deepEqual(
      manifestProjectionFields(manifestModule),
      graphProjectionFields(projected),
      `manifest Module ${manifestModule.number} must preserve graph-derived route and state fields`,
    );
  }
});
