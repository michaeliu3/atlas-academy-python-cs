import assert from "node:assert/strict";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import {
  loadModuleEvidencePreflight,
  moduleEvidencePreflightRelativePath,
  runM33AuthoringCandidateEvidencePreflight,
  runM34AuthoringCandidateEvidencePreflight,
  runM35AuthoringCandidateEvidencePreflight,
  runM36AuthoringCandidateEvidencePreflight,
  validateModuleEvidencePreflight,
} from "../scripts/module-evidence-preflight.mjs";
import {
  createIndexedCourseFixture,
  stageJsonMutation,
} from "./support/candidate-preflight-fixture.mjs";

const testDirectory = dirname(fileURLToPath(import.meta.url));
const siteRoot = resolve(testDirectory, "..");

const authoringCandidates = [
  {
    moduleId: "m33",
    evidencePath: "content/course/contracts/evidence/m33.v1.json",
    workbookPath: "content/authoring/m33_formal_languages_computability_complexity_workbook.v1.md",
    substitutePath: "content/source-maps/module33_formal_languages_computability_complexity_source_research.md",
    substituteLocator: "the-connected-teaching-argument",
    run: runM33AuthoringCandidateEvidencePreflight,
  },
  {
    moduleId: "m34",
    evidencePath: "content/course/contracts/evidence/m34.v1.json",
    workbookPath: "content/authoring/m34_classical_ai_search_constraints_decision_workbook.v1.md",
    substitutePath: "content/source-maps/module34_classical_ai_search_constraints_decision_source_research.md",
    substituteLocator: "the-connected-teaching-argument",
    run: runM34AuthoringCandidateEvidencePreflight,
  },
  {
    moduleId: "m35",
    evidencePath: "content/course/contracts/evidence/m35.v1.json",
    workbookPath: "content/authoring/m35_machine_learning_representation_workbook.v1.md",
    substitutePath: "content/source-maps/module35_machine_learning_statistical_learning_ai_eval_source_research.md",
    substituteLocator: "the-connected-teaching-argument",
    run: runM35AuthoringCandidateEvidencePreflight,
  },
  {
    moduleId: "m36",
    evidencePath: "content/course/contracts/evidence/m36.v1.json",
    workbookPath: "content/authoring/m36_statistical_learning_theory_reliable_deep_learning_workbook.v1.md",
    substitutePath: "content/source-maps/module36_statistical_learning_theory_reliable_deep_learning_source_research.md",
    substituteLocator: "the-connected-teaching-argument",
    run: runM36AuthoringCandidateEvidencePreflight,
  },
];

async function stagedCandidate(t, candidate, { mutateEvidence, mutatePreflight } = {}) {
  const root = await createIndexedCourseFixture(t);
  if (mutateEvidence) {
    await stageJsonMutation(root, candidate.evidencePath, mutateEvidence);
  }
  if (mutatePreflight) {
    await stageJsonMutation(root, moduleEvidencePreflightRelativePath(candidate.moduleId), mutatePreflight);
  }
  return {
    root,
    preflight: await loadModuleEvidencePreflight(
      moduleEvidencePreflightRelativePath(candidate.moduleId),
      { siteRoot: root },
    ),
  };
}

for (const candidate of authoringCandidates) {
  test(`${candidate.moduleId.toUpperCase()} authoring candidate evidence resolves without learner access or release status`, async () => {
    const report = await candidate.run({ siteRoot });

    assert.equal(report.moduleId, candidate.moduleId);
    assert.equal(report.state, "authoring-only-candidate-not-promoting");
    assert.equal(report.contractState, "authoring-only");
    assert.equal(report.evidenceRecordPath, candidate.evidencePath);
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

  test(`${candidate.moduleId.toUpperCase()} authoring candidate rejects a substitute workbook`, async (t) => {
    const { root, preflight } = await stagedCandidate(t, candidate, {
      mutateEvidence(evidenceRecord) {
        const firstPrinciples = evidenceRecord.evidence.find(
          ({ criterionId }) => criterionId === "first-principles",
        );
        firstPrinciples.inputs[0] = {
          kind: "markdown-heading",
          role: "course-content",
          path: candidate.substitutePath,
          locator: candidate.substituteLocator,
        };
        return evidenceRecord;
      },
    });

    await assert.rejects(
      () => validateModuleEvidencePreflight(preflight, { siteRoot: root }),
      new RegExp(`must bind hidden authoring workbook ${candidate.workbookPath.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&")}`, "i"),
    );
  });

  test(`${candidate.moduleId.toUpperCase()} authoring candidate fails closed on a forged release assertion`, async (t) => {
    const { root, preflight } = await stagedCandidate(t, candidate, {
      mutatePreflight(preflightRecord) {
        preflightRecord.truthBoundary.release = `${candidate.moduleId.toUpperCase()} is learner-deliverable and released.`;
        return preflightRecord;
      },
    });

    await assert.rejects(
      () => validateModuleEvidencePreflight(preflight, { siteRoot: root }),
      /must preserve the exact candidate-only release nonclaim/i,
    );
  });
}
