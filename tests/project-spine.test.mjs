import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const registry = JSON.parse(
  fs.readFileSync(path.join(siteRoot, "content/course/arc-projects.v1.json"), "utf8"),
);
const packs = JSON.parse(
  fs.readFileSync(path.join(siteRoot, "content/course/module-teaching-packs.v1.json"), "utf8"),
);

test("six cumulative projects cover the 36-module spine", () => {
  assert.equal(registry.projects.length, 6);
  const slices = registry.projects.flatMap((project) => project.moduleSlices);
  assert.equal(slices.length, 36);
  assert.equal(new Set(slices.map((slice) => slice.moduleId)).size, 36);
  assert.equal(registry.capstone.moduleId, "m26");
  assert.equal(registry.capstone.requiredInputs.length, 6);
});

test("every teaching pack binds its project slice to the canonical spine", () => {
  const assignmentByModule = new Map(
    registry.projects.flatMap((project) => project.moduleSlices.map((slice) => [slice.moduleId, project.id])),
  );
  for (const packModule of packs.modules) {
    assert.equal(packModule.project.arcProjectId, assignmentByModule.get(packModule.moduleId));
    assert.equal(packModule.project.moduleSlice.moduleId, packModule.moduleId);
    assert.equal(packModule.project.status, "prepared-derived");
    assert.equal(packModule.project.implementationPlan.length, 3);
    assert.equal(packModule.project.expectedPatchSequence.length, 6);
    assert.equal(packModule.project.tests.length, 3);
    assert.equal(packModule.project.debuggingScenarios.length, 3);
    assert.equal(packModule.project.codeReviewChecklist.length, 4);
    assert.ok(packModule.sourceMap.path);
    assert.match(packModule.sourceMap.sourceHash, /^[0-9a-f]{64}$/u);
    assert.equal(packModule.rendering.pdfStatus, "local-release-pipeline");
    assert.equal(packModule.deliverySchedule.recommendedRoute, "90-day");
    assert.deepEqual(packModule.deliverySchedule.studyPartnerBlocks, [2, 3]);
    assert.deepEqual(packModule.sessions[0].studyPartner.durationMinutes, [60, 90]);
    assert.equal(packModule.sessions[0].taLecture.launchCard.stateTrace.columns.length, 5);
    assert.ok(packModule.sessions[0].taLecture.launchCard.boundedWalk.expectedReveal);
    assert.equal(
      packModule.sessions[0].taLecture.launchCard.boundedWalk.expectedReveal.expectedOutputKind,
      "learner-prediction-before-observation",
    );
    assert.equal(packModule.sessions.length, 6);
  }
});
