import assert from "node:assert/strict";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import {
  scanMermaidBlocks,
  validateMermaidAccessibility,
} from "../lib/mermaid-accessibility.mjs";
import { extractTableOfContents } from "../lib/heading-ids.js";
import { projectReaderModules } from "../scripts/course-graph.mjs";
import { openGitIndexSnapshot } from "../scripts/git-index-snapshot.mjs";
import { resolveHiddenReviewCandidateScope } from "../scripts/hidden-review-candidate.mjs";

const testDirectory = dirname(fileURLToPath(import.meta.url));
const siteRoot = resolve(testDirectory, "..");
const reviewCandidatePath = "content/modules/32_systems_languages_scientific_python_accelerators.md";

test("M32 freezes a hidden review candidate without changing its authoring-only route", async () => {
  const snapshot = await openGitIndexSnapshot(siteRoot);
  await snapshot.assertClean([
    "content/course/course-graph.v2.json",
    "content/modules/manifest.json",
  ]);
  const [graphRecord, manifestRecord] = await Promise.all([
    snapshot.readJson("content/course/course-graph.v2.json"),
    snapshot.readJson("content/modules/manifest.json"),
  ]);
  const graph = graphRecord.value;
  const manifest = manifestRecord.value;
  const candidate = await resolveHiddenReviewCandidateScope({
    siteRoot,
    moduleId: "m32",
    evidenceRecordPath: "content/course/contracts/evidence/m32.v1.json",
    snapshot,
  });

  assert.deepEqual(candidate.candidateInputPaths, [
    "content/course/contracts/evidence/m32.v1.json",
    "content/course/contracts/review-candidates/m32.v1.json",
    reviewCandidatePath,
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
  assert.equal(m32?.state.contract?.state, "authoring-only");
  assert.equal(m32?.sourceMap, null);
  assert.equal(m32?.studioId, null);
  assert.ok(!projectReaderModules(graph).some(({ id }) => id === "m32"));
  assert.ok(!manifest.modules.some(({ id }) => id === "m32"));
});

test("the frozen M32 review candidate retains the study-ready structural spine", async () => {
  const snapshot = await openGitIndexSnapshot(siteRoot);
  await snapshot.assertClean([reviewCandidatePath]);
  const candidate = (await snapshot.readText(reviewCandidatePath)).text;

  for (const sessionNumber of [1, 2, 3, 4, 5, 6]) {
    assert.match(candidate, new RegExp(`^## Session ${sessionNumber} —`, "mu"));
  }
  assert.deepEqual(
    extractTableOfContents(candidate)
      .filter(({ depth, title }) => depth === 3 && title.startsWith("Output:"))
      .map(({ id }) => id),
    [
      "output-boundary-contract-map",
      "output-execution-transfer-trace",
      "output-layout-numerics-note",
      "output-performance-evidence-card",
      "output-buffer-ownership-timeline",
      "output-autodiff-execution-trace",
      "output-scientific-python--accelerators-dossier",
    ],
  );
  assert.match(candidate, /^## Confidence-aware diagnostic and spaced review/mu);
  assert.match(candidate, /Teaching Assistant — M32 systems evidence clinic/u);
  assert.match(candidate, /Study Partner — M32 live rehearsal/u);
  assert.match(candidate, /Conversational oral defense — M32/u);
  assert.match(candidate, /^## Sources, licensing, and responsible reading route/mu);
  assert.match(candidate, /^## Candidate release boundary/mu);

  const visualBlocks = scanMermaidBlocks(candidate, { sourcePath: reviewCandidatePath });
  const visualReport = validateMermaidAccessibility(visualBlocks, { requireComplete: true });
  assert.equal(visualBlocks.length, 3);
  assert.equal(visualReport.summary.completeBlocks, 3);
  assert.ok(visualBlocks.every(({ metadata }) => metadata?.id.startsWith("m32-")));
  assert.ok(visualBlocks.every(({ metadata }) => metadata?.alternative.length >= 40));
});
