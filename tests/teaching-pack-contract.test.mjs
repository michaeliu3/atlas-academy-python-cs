import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const graph = JSON.parse(fs.readFileSync(path.join(siteRoot, "content/course/course-graph.v2.json"), "utf8"));
const packs = JSON.parse(fs.readFileSync(path.join(siteRoot, "content/course/module-teaching-packs.v1.json"), "utf8"));

test("teaching-pack registry covers the canonical 36-module graph", () => {
  assert.equal(packs.schemaVersion, 1);
  assert.equal(packs.modules.length, graph.modules.length);
  assert.equal(new Set(packs.modules.map(({ moduleId }) => moduleId)).size, graph.modules.length);
  for (const pack of packs.modules) {
    assert.equal(pack.sessions.length, 6, `${pack.moduleId} session count`);
    assert.equal(pack.sessions.every(({ studyPartner }) => studyPartner.partnerMayWriteCode === true), true, `${pack.moduleId} partner authorship`);
    assert.ok(pack.code.executionBoundary, `${pack.moduleId} execution boundary`);
    assert.ok(pack.project.arcProjectId, `${pack.moduleId} arc project`);
  }
});
