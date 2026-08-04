import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  applyCourseStatusSummary,
  courseStatusMarker,
  deriveCourseStatus,
  renderCourseStatusProjection,
  renderCourseStatusSummary,
  validateCourseStatusProjection,
} from "../scripts/course-status-projection.mjs";
import { loadCourseGraph } from "../scripts/course-graph.mjs";

test("the generated course-status projection derives the current availability tuple from the canonical graph", async () => {
  const graph = await loadCourseGraph();
  const status = deriveCourseStatus(graph);
  const projection = renderCourseStatusProjection(graph);
  const summary = renderCourseStatusSummary(graph);
  const checkedInProjection = await readFile(
    new URL("../docs/COURSE_STATUS.md", import.meta.url),
    "utf8",
  );

  assert.equal(status.definedModules, 36);
  assert.equal(status.readerVisible, 30);
  assert.equal(status.openForStudy, 28);
  assert.deepEqual(status.privateGuidedStudyReady, {
    count: 6,
    moduleNumbers: [31, 32, 33, 34, 35, 36],
  });
  assert.equal(
    status.availability.find(({ availability }) => availability === "legacy-open")?.count,
    28,
  );
  assert.equal(
    status.availability.find(({ availability }) => availability === "published")?.count,
    0,
  );
  assert.match(summary, /\*\*28\*\* `legacy-open` \(M1–M24, M27–M30\)/u);
  assert.match(summary, /\*\*0\*\* `published` \(—\)/u);
  assert.match(
    summary,
    /Designated private guided-study packs: \*\*6\*\* \(M31–M36\); portal reader remains hidden and this creates no route credit, release, or mastery evidence\./u,
  );
  assert.match(projection, /\| `authoring-only` \| 6 \| M31–M36 \| hidden \|/u);
  assert.match(projection, /## Private guided-study availability/u);
  assert.match(
    projection,
    /\*\*6\*\* designated private guided-study packs are ready \(M31–M36\); the portal reader remains hidden/u,
  );
  assert.doesNotMatch(projection, /content\/authoring|workbookPath/u);
  assert.equal(checkedInProjection, projection);
  await validateCourseStatusProjection(graph);
});

test("status surfaces replace only their explicit generated marker block", async () => {
  const graph = await loadCourseGraph();
  const source = [
    "Before",
    courseStatusMarker.start,
    "stale status",
    courseStatusMarker.end,
    "After",
    "",
  ].join("\n");
  const rendered = applyCourseStatusSummary(source, graph);

  assert.match(rendered, /^Before\n<!-- atlas-course-status:start -->/u);
  assert.match(rendered, /\*\*28\*\* `legacy-open`/u);
  assert.match(rendered, /<!-- atlas-course-status:end -->\nAfter\n$/u);
  assert.throws(
    () => applyCourseStatusSummary("No generated status marker", graph),
    /marker pair/u,
  );
});
