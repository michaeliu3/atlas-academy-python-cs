import assert from "node:assert/strict";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import {
  loadModuleEvidencePreflight,
  moduleEvidencePreflightRelativePath,
  runM32AuthoringCandidateEvidencePreflight,
  validateModuleEvidencePreflight,
} from "../scripts/module-evidence-preflight.mjs";
import {
  createIndexedCourseFixture,
  stageJsonMutation,
} from "./support/candidate-preflight-fixture.mjs";

const testDirectory = dirname(fileURLToPath(import.meta.url));
const siteRoot = resolve(testDirectory, "..");
const moduleId = "m32";
const evidencePath = "content/course/contracts/evidence/m32.v1.json";
const workbookPath =
  "content/authoring/m32_systems_languages_scientific_python_accelerators_workbook.v1.md";
const deliveryMapPath = "content/course/contracts/authoring-delivery/m32.v1.json";
const numpyObservationPath = "scripts/m32_numpy_layout_observation.py";
const numpyObservationTestPath = "scripts/test_m32_numpy_layout_observation.py";

async function stagedM32Candidate(t, { mutateEvidence, mutatePreflight } = {}) {
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

test("M32 authoring candidate evidence resolves without granting learner access or release status", async () => {
  const report = await runM32AuthoringCandidateEvidencePreflight({ siteRoot });

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

test("M32 authoring candidate rejects a substitute workbook and missing pinned NumPy observation", async (t) => {
  const { root: workbookRoot, preflight: workbookPreflight } = await stagedM32Candidate(t, {
    mutateEvidence(evidenceRecord) {
      const firstPrinciples = evidenceRecord.evidence.find(
        ({ criterionId }) => criterionId === "first-principles",
      );
      firstPrinciples.inputs[0] = {
        kind: "markdown-heading",
        role: "course-content",
        path: "content/source-maps/module32_systems_languages_scientific_python_accelerators_source_research.md",
        locator: "the-connected-teaching-argument",
      };
      return evidenceRecord;
    },
  });
  await assert.rejects(
    () => validateModuleEvidencePreflight(workbookPreflight, { siteRoot: workbookRoot }),
    new RegExp(`must bind hidden authoring workbook ${workbookPath.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&")}`, "i"),
  );

  const { root: observationRoot, preflight: observationPreflight } = await stagedM32Candidate(t, {
    mutateEvidence(evidenceRecord) {
      const interaction = evidenceRecord.evidence.find(
        ({ criterionId }) => criterionId === "interaction-reference-model-and-teaching-tests",
      );
      interaction.inputs = interaction.inputs.filter(({ path }) => path !== numpyObservationTestPath);
      return evidenceRecord;
    },
  });
  await assert.rejects(
    () => validateModuleEvidencePreflight(observationPreflight, { siteRoot: observationRoot }),
    /must bind scripts\/test_m32_numpy_layout_observation\.py/i,
  );
  assert.equal(numpyObservationPath, "scripts/m32_numpy_layout_observation.py");
});

test("M32 authoring candidate requires snapshot-bound delivery-map evidence", async (t) => {
  const { root, preflight } = await stagedM32Candidate(t, {
    mutateEvidence(evidenceRecord) {
      const sessions = evidenceRecord.evidence.find(
        ({ criterionId }) => criterionId === "six-connected-sessions",
      );
      sessions.inputs = sessions.inputs.filter(({ path }) => path !== deliveryMapPath);
      return evidenceRecord;
    },
  });

  await assert.rejects(
    () => validateModuleEvidencePreflight(preflight, { siteRoot: root }),
    /must bind exactly one hidden authoring delivery-map sessions pointer/i,
  );
});

test("M32 authoring candidate fails closed on a forged release assertion", async (t) => {
  const { root: preflightRoot, preflight: forgedPreflight } = await stagedM32Candidate(t, {
    mutatePreflight(preflight) {
      preflight.truthBoundary.release = "M32 is learner-deliverable and released.";
      return preflight;
    },
  });
  await assert.rejects(
    () => validateModuleEvidencePreflight(forgedPreflight, { siteRoot: preflightRoot }),
    /must preserve the exact candidate-only release nonclaim/i,
  );

  const { root: evidenceRoot, preflight: evidencePreflight } = await stagedM32Candidate(t, {
    mutateEvidence(evidenceRecord) {
      evidenceRecord.evidence.find(
        ({ criterionId }) => criterionId === "release-provenance-ci-and-deployment-evidence",
      ).claim = "M32 is released after CI.";
      return evidenceRecord;
    },
  });
  await assert.rejects(
    () => validateModuleEvidencePreflight(evidencePreflight, { siteRoot: evidenceRoot }),
    /must preserve the exact candidate-only release-boundary claim/i,
  );
});
