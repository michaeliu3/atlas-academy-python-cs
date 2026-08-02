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

test("M32 freezes a hidden review candidate without changing its authoring-only route", async () => {
  const [graph, manifest, snapshot] = await Promise.all([
    loadCourseGraph(),
    readFile(resolve(siteRoot, "content", "modules", "manifest.json"), "utf8").then(JSON.parse),
    openGitIndexSnapshot(siteRoot),
  ]);
  const candidate = await resolveHiddenReviewCandidateScope({
    siteRoot,
    moduleId: "m32",
    evidenceRecordPath: "content/course/contracts/evidence/m32.v1.json",
    snapshot,
  });

  assert.deepEqual(candidate.candidateInputPaths, [
    "content/course/contracts/evidence/m32.v1.json",
    "content/course/contracts/review-candidates/m32.v1.json",
    "content/modules/32_systems_languages_scientific_python_accelerators.md",
    "content/source-maps/module32_systems_languages_scientific_python_accelerators.md",
  ]);
  assert.ok(
    !candidate.candidateInputPaths.includes(
      "content/authoring/m32_systems_languages_scientific_python_accelerators_workbook.v1.md",
    ),
  );
  assert.ok(
    !candidate.candidateInputPaths.includes("content/course/contracts/authoring-delivery/m32.v1.json"),
  );

  const m32 = graph.modules.find(({ id }) => id === "m32");
  assert.equal(m32?.state.availability, "authoring-only");
  assert.equal(m32?.state.readerAccess, "hidden");
  assert.equal(m32?.state.release?.state, "unrecorded");
  assert.ok(!projectReaderModules(graph).some(({ id }) => id === "m32"));
  assert.ok(!manifest.modules.some(({ id }) => id === "m32"));
});
