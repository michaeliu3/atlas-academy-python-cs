import assert from "node:assert/strict";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import {
  loadModuleEvidencePreflight,
  moduleEvidencePreflightRelativePath,
  runM31AuthoringCandidateEvidencePreflight,
  validateModuleEvidencePreflight,
} from "../scripts/module-evidence-preflight.mjs";
import { loadCourseGraph } from "../scripts/course-graph.mjs";
import { loadModuleContractRegistry } from "../scripts/module-contract-registry.mjs";
import { loadModuleEvidenceRecord } from "../scripts/module-review-evidence.mjs";
import {
  createIndexedCourseFixture,
  stageJsonMutation,
} from "./support/candidate-preflight-fixture.mjs";

const testDirectory = dirname(fileURLToPath(import.meta.url));
const siteRoot = resolve(testDirectory, "..");
const moduleId = "m31";
const evidencePath = "content/course/contracts/evidence/m31.v1.json";

async function loadCandidateArtifacts() {
  const [preflight, evidenceRecord] = await Promise.all([
    loadModuleEvidencePreflight(moduleEvidencePreflightRelativePath(moduleId), { siteRoot }),
    loadModuleEvidenceRecord(evidencePath, { siteRoot }),
  ]);
  return { preflight, evidenceRecord };
}

async function stagedM31Candidate(t, { mutateEvidence, mutatePreflight } = {}) {
  const root = await createIndexedCourseFixture(t);
  if (mutateEvidence) {
    await stageJsonMutation(root, evidencePath, mutateEvidence);
  }
  if (mutatePreflight) {
    await stageJsonMutation(root, moduleEvidencePreflightRelativePath(moduleId), mutatePreflight);
  }
  return {
    root,
    preflight: await loadModuleEvidencePreflight(
      moduleEvidencePreflightRelativePath(moduleId),
      { siteRoot: root },
    ),
  };
}

test("M31 authoring candidate evidence resolves without granting learner access or release status", async () => {
  const report = await runM31AuthoringCandidateEvidencePreflight({ siteRoot });

  assert.equal(report.moduleId, moduleId);
  assert.equal(report.state, "authoring-only-candidate-not-promoting");
  assert.equal(report.contractState, "authoring-only");
  assert.equal(report.evidenceRecordPath, evidencePath);
  assert.equal(report.evidenceReport.evidenceByCriterion.size, 18);
  assert.deepEqual(report.openCriterionIds, ["release-provenance-ci-and-deployment-evidence"]);
  assert.deepEqual(report.promotionBlockers, [
    "human-review",
    "review-ready-commit",
    "source-commit-ci-run",
    "private-deployment-record",
    "learner-delivery-review",
  ]);
});

test("M31 authoring candidate rejects a reader-access or release transition", async () => {
  const [preflight, graph] = await Promise.all([
    loadModuleEvidencePreflight(moduleEvidencePreflightRelativePath(moduleId), { siteRoot }),
    loadCourseGraph(siteRoot),
  ]);
  const exposedGraph = structuredClone(graph);
  const m31 = exposedGraph.modules.find(({ id }) => id === moduleId);
  m31.state.readerAccess = "reader";

  await assert.rejects(
    () => validateModuleEvidencePreflight(preflight, { siteRoot, graph: exposedGraph }),
    /must match its captured Git-index graph context/i,
  );

  const releasedGraph = structuredClone(graph);
  releasedGraph.modules.find(({ id }) => id === moduleId).state.release = {
    state: "candidate-recorded",
    recordId: "forged-m31-release",
  };
  await assert.rejects(
    () => validateModuleEvidencePreflight(preflight, { siteRoot, graph: releasedGraph }),
    /must match its captured Git-index graph context/i,
  );

  const learnerArtifactGraph = structuredClone(graph);
  const learnerArtifact = learnerArtifactGraph.modules.find(({ id }) => id === moduleId);
  learnerArtifact.sourceMap = "content/source-maps/module31_optimization_information_source_map.md";
  learnerArtifact.studioId = "forged-m31-studio";
  await assert.rejects(
    () => validateModuleEvidencePreflight(preflight, { siteRoot, graph: learnerArtifactGraph }),
    /must match its captured Git-index graph context/i,
  );

  const registry = await loadModuleContractRegistry(siteRoot);
  const promotedRegistry = structuredClone(registry);
  promotedRegistry.modules.find(({ moduleId: entryModuleId }) => entryModuleId === moduleId).contractState = "review-ready";
  await assert.rejects(
    () => validateModuleEvidencePreflight(preflight, { siteRoot, registry: promotedRegistry }),
    /must match its captured Git-index registry context/i,
  );
});

test("M31 authoring candidate rejects a substitute workbook or visual-test stand-in", async (t) => {
  const { root: workbookRoot, preflight: workbookPreflight } = await stagedM31Candidate(t, {
    mutateEvidence(evidenceRecord) {
      const firstPrinciples = evidenceRecord.evidence.find(
        ({ criterionId }) => criterionId === "first-principles",
      );
      firstPrinciples.inputs[0] = {
        kind: "markdown-heading",
        role: "course-content",
        path: "content/source-maps/module31_optimization_information_source_map.md",
        locator: "the-one-connected-argument",
      };
      return evidenceRecord;
    },
  });
  await assert.rejects(
    () => validateModuleEvidencePreflight(workbookPreflight, { siteRoot: workbookRoot }),
    /must bind hidden authoring workbook/i,
  );

  const { root: visualRoot, preflight: visualPreflight } = await stagedM31Candidate(t, {
    mutateEvidence(evidenceRecord) {
      const visual = evidenceRecord.evidence.find(
        ({ criterionId }) => criterionId === "accessible-visual-text-alternative",
      );
      visual.inputs.find(({ role }) => role === "test").path = "tests/mermaid-accessibility.test.mjs";
      return evidenceRecord;
    },
  });
  await assert.rejects(
    () => validateModuleEvidencePreflight(visualPreflight, { siteRoot: visualRoot }),
    /must bind tests\/m31-authoring-workbook\.test\.mjs/i,
  );
});

test("M31 authoring candidate requires snapshot-bound delivery-map evidence", async (t) => {
  const { root, preflight } = await stagedM31Candidate(t, {
    mutateEvidence(evidenceRecord) {
      const sessions = evidenceRecord.evidence.find(
        ({ criterionId }) => criterionId === "six-connected-sessions",
      );
      sessions.inputs = sessions.inputs.filter(
        ({ path }) => path !== "content/course/contracts/authoring-delivery/m31.v1.json",
      );
      return evidenceRecord;
    },
  });

  await assert.rejects(
    () => validateModuleEvidencePreflight(preflight, { siteRoot: root }),
    /must bind exactly one hidden authoring delivery-map sessions pointer/i,
  );
});

test("M31 authoring candidate fails closed on a forged release assertion", async (t) => {
  const { root: preflightRoot, preflight: forgedPreflight } = await stagedM31Candidate(t, {
    mutatePreflight(preflight) {
      preflight.truthBoundary.release = "M31 is learner-deliverable and released.";
      return preflight;
    },
  });
  await assert.rejects(
    () => validateModuleEvidencePreflight(forgedPreflight, { siteRoot: preflightRoot }),
    /must preserve the exact candidate-only release nonclaim/i,
  );

  const { root: evidenceRoot, preflight: evidencePreflight } = await stagedM31Candidate(t, {
    mutateEvidence(evidenceRecord) {
      evidenceRecord.evidence.find(
        ({ criterionId }) => criterionId === "release-provenance-ci-and-deployment-evidence",
      ).claim = "M31 is released after CI.";
      return evidenceRecord;
    },
  });
  await assert.rejects(
    () => validateModuleEvidencePreflight(evidencePreflight, { siteRoot: evidenceRoot }),
    /must preserve the exact candidate-only release-boundary claim/i,
  );
});

test("M31 default preflight rejects in-memory candidate artifacts that differ from the snapshot", async () => {
  const { preflight, evidenceRecord } = await loadCandidateArtifacts();
  const changedPreflight = structuredClone(preflight);
  changedPreflight.purpose = "An unbound in-memory preflight object.";
  await assert.rejects(
    () => validateModuleEvidencePreflight(changedPreflight, { siteRoot }),
    /supplied preflight must match its captured Git-index preflight record/i,
  );

  const changedEvidence = structuredClone(evidenceRecord);
  changedEvidence.purpose = "An unbound in-memory evidence object.";
  await assert.rejects(
    () => validateModuleEvidencePreflight(preflight, { siteRoot, evidenceRecord: changedEvidence }),
    /supplied evidence record must match its captured Git-index evidence record/i,
  );
});
