import assert from "node:assert/strict";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { projectReaderModules } from "../scripts/course-graph.mjs";
import { openGitIndexSnapshot } from "../scripts/git-index-snapshot.mjs";
import { resolveHiddenReviewCandidateScope } from "../scripts/hidden-review-candidate.mjs";

const testDirectory = dirname(fileURLToPath(import.meta.url));
const siteRoot = resolve(testDirectory, "..");

test("M34 freezes a hidden review candidate without changing its authoring-only route", async () => {
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
    moduleId: "m34",
    evidenceRecordPath: "content/course/contracts/evidence/m34.v1.json",
    snapshot,
  });

  assert.deepEqual(candidate.candidateInputPaths, [
    "content/course/contracts/evidence/m34.v1.json",
    "content/course/contracts/review-candidates/m34.v1.json",
    "content/modules/34_classical_ai_search_constraints_decision.md",
    "content/source-maps/module34_classical_ai_search_constraints_decision.md",
  ]);
  assert.ok(
    !candidate.candidateInputPaths.includes(
      "content/authoring/m34_classical_ai_search_constraints_decision_workbook.v1.md",
    ),
  );
  assert.ok(
    !candidate.candidateInputPaths.includes("content/course/contracts/authoring-delivery/m34.v1.json"),
  );

  const m34 = graph.modules.find(({ id }) => id === "m34");
  assert.equal(m34?.state.availability, "authoring-only");
  assert.equal(m34?.state.readerAccess, "hidden");
  assert.equal(m34?.state.release?.state, "unrecorded");
  assert.equal(m34?.state.contract?.state, "authoring-only");
  assert.equal(m34?.sourceMap, null);
  assert.equal(m34?.studioId, null);
  assert.ok(!projectReaderModules(graph).some(({ id }) => id === "m34"));
  assert.ok(!manifest.modules.some(({ id }) => id === "m34"));

  const [frozenCandidate, frozenLedger] = await Promise.all([
    snapshot.readText("content/modules/34_classical_ai_search_constraints_decision.md"),
    snapshot.readText("content/source-maps/module34_classical_ai_search_constraints_decision.md"),
  ]);
  assert.match(
    frozenCandidate.text,
    /finite or otherwise stated termination regime/u,
    "The no-reopen A* regime must state a termination condition.",
  );
  for (const sourceUrl of [
    "https://inst.eecs.berkeley.edu/~cs188/textbook/vpis/decision-networks.html",
    "https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.100-1.pdf",
  ]) {
    assert.ok(frozenCandidate.text.includes(sourceUrl));
    assert.ok(frozenLedger.text.includes(sourceUrl));
  }
});
