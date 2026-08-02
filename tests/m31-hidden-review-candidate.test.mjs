import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { loadCourseGraph, projectReaderModules } from "../scripts/course-graph.mjs";
import { openGitIndexSnapshot } from "../scripts/git-index-snapshot.mjs";
import { resolveHiddenReviewCandidateScope } from "../scripts/hidden-review-candidate.mjs";

const testDirectory = dirname(fileURLToPath(import.meta.url));
const siteRoot = resolve(testDirectory, "..");

test("M31 freezes a hidden review candidate without changing its authoring-only route", async () => {
  const [graph, manifest, snapshot] = await Promise.all([
    loadCourseGraph(),
    readFile(resolve(siteRoot, "content", "modules", "manifest.json"), "utf8").then(JSON.parse),
    openGitIndexSnapshot(siteRoot),
  ]);
  const candidate = await resolveHiddenReviewCandidateScope({
    siteRoot,
    moduleId: "m31",
    evidenceRecordPath: "content/course/contracts/evidence/m31.v1.json",
    snapshot,
  });

  assert.deepEqual(candidate.candidateInputPaths, [
    "content/course/contracts/evidence/m31.v1.json",
    "content/course/contracts/review-candidates/m31.v1.json",
    "content/modules/31_optimization_information.md",
    "content/source-maps/module31_optimization_information.md",
  ]);
  assert.ok(
    !candidate.candidateInputPaths.includes(
      "content/authoring/m31_optimization_information_workbook.v1.md",
    ),
  );
  assert.ok(
    !candidate.candidateInputPaths.includes("content/course/contracts/authoring-delivery/m31.v1.json"),
  );

  const m31 = graph.modules.find(({ id }) => id === "m31");
  assert.equal(m31?.state.availability, "authoring-only");
  assert.equal(m31?.state.readerAccess, "hidden");
  assert.equal(m31?.state.release?.state, "unrecorded");
  assert.ok(!projectReaderModules(graph).some(({ id }) => id === "m31"));
  assert.ok(!manifest.modules.some(({ id }) => id === "m31"));
});
