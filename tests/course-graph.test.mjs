import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  loadCourseGraph,
  projectReadableModules,
  validateCourseGraph,
} from "../scripts/course-graph.mjs";

test("the canonical course graph separates academic prerequisites from route order", async () => {
  const graph = await loadCourseGraph();
  const byNumber = new Map(graph.modules.map((courseModule) => [courseModule.number, courseModule]));

  assert.equal(graph.schemaVersion, 1);
  assert.equal(graph.modules.length, 36);
  assert.deepEqual(graph.sequence, [
    1, 2, 3, 4, 5, 27, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
    28, 29, 30, 31, 18, 19, 20, 21, 22, 23, 24, 32, 33, 34, 35, 36, 25,
    26,
  ]);

  assert.deepEqual(byNumber.get(18)?.academicPrerequisiteNumbers, [17]);
  assert.deepEqual(byNumber.get(25)?.academicPrerequisiteNumbers, [
    22, 24, 30, 31, 34, 35, 36,
  ]);
  assert.equal(byNumber.get(25)?.availability, "preview");
  assert.equal(byNumber.get(26)?.availability, "preview");
  assert.equal(byNumber.get(31)?.availability, "authoring-only");
});

test("readable projections stop at unavailable route nodes instead of bypassing them", async () => {
  const graph = await loadCourseGraph();
  const modules = projectReadableModules(graph);
  const byNumber = new Map(modules.map((courseModule) => [courseModule.number, courseModule]));

  assert.deepEqual(byNumber.get(18)?.prerequisiteNumbers, [17]);
  assert.equal(byNumber.get(30)?.nextRouteNumber, 31);
  assert.equal(byNumber.get(30)?.nextSlug, null);
  assert.equal(byNumber.get(24)?.nextRouteNumber, 32);
  assert.equal(byNumber.get(24)?.nextSlug, null);
  assert.equal(byNumber.get(25)?.availability, "preview");
  assert.equal(byNumber.get(25)?.previousRouteNumber, 36);
});

test("written route handoffs preserve M24's authoring-only continuation and the M26 preview boundary", async () => {
  const [m24Workbook, m24SourceMap, m26Workbook, roadmap] = await Promise.all([
    readFile(new URL("../content/modules/24_cpython_performance_memory.md", import.meta.url), "utf8"),
    readFile(new URL("../content/source-maps/module24_cpython_performance_memory_source_map.md", import.meta.url), "utf8"),
    readFile(new URL("../content/modules/26_systems_capstone_open_source_stewardship.md", import.meta.url), "utf8"),
    readFile(new URL("../ROADMAP.md", import.meta.url), "utf8"),
  ]);

  assert.match(m24Workbook, /Canonical forward handoff: Module 32/u);
  assert.match(m24Workbook, /Module 32 is authoring-only/u);
  assert.match(m24SourceMap, /Canonical forward connection: Module 32/u);
  assert.match(m24SourceMap, /M23 → M24 → M32 \(authoring-only\) connected sequence/u);
  assert.match(m26Workbook, /## Preview boundary/u);
  assert.match(m26Workbook, /orientation preview/u);
  assert.match(roadmap, /## Prospective 60-day checkpoints after M31–M36/u);
});

test("the graph rejects a source-map path that escapes the checked-in course inputs", async () => {
  const graph = await loadCourseGraph();
  const unsafeGraph = structuredClone(graph);
  unsafeGraph.modules[0].sourceMap = "content/source-maps/../../outside.md";

  assert.throws(
    () => validateCourseGraph(unsafeGraph),
    /checked-in source-map path/u,
  );
});

test("graph-declared studios have one bounded, code-split reader mapping", async () => {
  const [graphSource, registrySource, readerSource, loaderSource] = await Promise.all([
    readFile(new URL("../content/course/course-graph.v1.json", import.meta.url), "utf8"),
    readFile(new URL("../lib/module-studio-registry.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/modules/[slug]/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/modules/[slug]/StudioLoader.tsx", import.meta.url), "utf8"),
  ]);
  const graph = JSON.parse(graphSource);
  const declaredStudioIds = graph.modules
    .map((courseModule) => courseModule.studioId)
    .filter((studioId) => studioId !== null);
  const registeredStudioIds = [
    ...registrySource.matchAll(/studioId: "([^"]+)"/gu),
  ].map((match) => match[1]);

  assert.deepEqual(registeredStudioIds, declaredStudioIds);
  assert.equal(new Set(registeredStudioIds).size, registeredStudioIds.length);
  assert.match(
    readerSource,
    /<ModuleInteraction[\s\S]*courseModule=\{courseModule\}/,
  );
  assert.match(readerSource, /moduleInteraction\.kind !== "preview"/);
  assert.doesNotMatch(readerSource, /slug === "/);
  assert.match(loaderSource, /from "next\/dynamic"/);
  assert.match(loaderSource, /dynamic\(registration\.load/);
  assert.match(registrySource, /kind: "workbook-and-oral-defense"/);
  assert.match(registrySource, /kind: "preview"/);
  assert.match(registrySource, /kind: "unavailable"/);
  assert.match(
    registrySource,
    /no workbook or interactive studio is published/,
  );
  assert.match(
    registrySource,
    /studio, project evidence, and oral-defense route remain unavailable/,
  );
});
