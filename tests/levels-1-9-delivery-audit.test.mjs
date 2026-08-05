import assert from "node:assert/strict";
import test from "node:test";
import { loadCourseGraph } from "../scripts/course-graph.mjs";

const levelNumbers = Array.from({ length: 9 }, (_, index) => index + 1);
const availabilityStates = new Set([
  "legacy-open",
  "published",
  "preview",
  "locked",
  "optional",
  "authoring-only",
]);

test("Levels 1–9 audit maps every target to graph-backed delivery evidence", async () => {
  const graph = await loadCourseGraph();
  const modulesById = new Map(graph.modules.map((courseModule) => [courseModule.id, courseModule]));
  const tracksById = new Map(graph.scopeMatrix.extensionTracks.map((track) => [track.id, track]));
  const topics = graph.scopeMatrix.topics;

  assert.equal(topics.length, 63, "the calibrated scope matrix must retain all 63 mapped areas");
  assert.deepEqual(
    [...new Set(topics.map(({ level }) => level))].sort((left, right) => left - right),
    levelNumbers,
    "every inventory level must have at least one mapped topic",
  );

  for (const topic of topics) {
    assert.ok(topic.id && topic.label, "each topic needs a stable id and reader label");
    assert.ok(topic.targetCapabilities.length > 0, `${topic.id} needs target capabilities`);
    assert.ok(topic.evidenceArtifact, `${topic.id} needs a named evidence artifact`);
    assert.ok(topic.anchors.length > 0, `${topic.id} needs graph-backed session anchors`);
    assert.ok(topic.sourceModuleIds.length > 0, `${topic.id} needs graph-backed source modules`);
    if (topic.trackId !== null) {
      assert.ok(tracksById.has(topic.trackId), `${topic.id} references an unknown extension track`);
    }
    if (topic.scope === "post-core-specialization") {
      assert.ok(topic.trackId, `${topic.id} must name its post-core extension track`);
    }
    if (topic.scope === "explicitly-deferred") {
      assert.equal(topic.trackId, null, `${topic.id} must not imply an active extension route`);
    }

    for (const { moduleId, sessions } of topic.anchors) {
      const courseModule = modulesById.get(moduleId);
      assert.ok(courseModule, `${topic.id} references unknown anchor module ${moduleId}`);
      assert.ok(sessions.length > 0, `${topic.id}/${moduleId} needs at least one session`);
      assert.equal(new Set(sessions).size, sessions.length, `${topic.id}/${moduleId} repeats a session`);
      assert.ok(
        sessions.every((session) => Number.isInteger(session) && session >= 1 && session <= 6),
        `${topic.id}/${moduleId} must use sessions 1–6`,
      );

      const state = courseModule.state;
      assert.ok(availabilityStates.has(state.availability), `${moduleId} has unknown availability`);
      if (state.readerAccess === "hidden") {
        assert.equal(state.availability, "authoring-only", `${moduleId} hidden delivery must be authoring-only`);
        assert.equal(
          state.privateGuidedStudy?.status,
          "ready",
          `${moduleId} hidden delivery must explicitly identify a ready private-chat pack`,
        );
      }
      if (state.availability === "authoring-only") {
        assert.equal(state.readerAccess, "hidden", `${moduleId} authoring-only delivery must stay hidden`);
      }
      if (state.availability === "preview") {
        assert.equal(state.readerAccess, "preview", `${moduleId} preview delivery must be reader preview`);
      }
    }

    for (const moduleId of topic.sourceModuleIds) {
      const courseModule = modulesById.get(moduleId);
      assert.ok(courseModule, `${topic.id} references unknown source module ${moduleId}`);
      const state = courseModule.state;
      const hasBoundedDelivery = state.readerAccess !== "hidden" || state.privateGuidedStudy?.status === "ready";
      assert.ok(
        hasBoundedDelivery,
        `${topic.id}/${moduleId} source route must name either reader delivery or an explicit private pack`,
      );
    }
  }
});
