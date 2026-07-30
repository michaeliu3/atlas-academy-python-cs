import assert from "node:assert/strict";
import test from "node:test";
import {
  loadCourseGraph,
  projectReadableModules,
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
