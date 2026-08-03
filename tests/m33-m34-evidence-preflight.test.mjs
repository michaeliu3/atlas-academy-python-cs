import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import {
  scanMermaidBlocks,
  validateMermaidAccessibility,
} from "../lib/mermaid-accessibility.mjs";
import { extractTableOfContents } from "../lib/heading-ids.js";
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
    reviewSelectorPath: "content/course/contracts/review-candidates/m33.v1.json",
    expectedFrozenOutputCount: 6,
    expectedFrozenMermaidCount: 1,
    run: runM33AuthoringCandidateEvidencePreflight,
  },
  {
    moduleId: "m34",
    evidencePath: "content/course/contracts/evidence/m34.v1.json",
    workbookPath: "content/authoring/m34_classical_ai_search_constraints_decision_workbook.v1.md",
    substitutePath: "content/source-maps/module34_classical_ai_search_constraints_decision_source_research.md",
    substituteLocator: "the-connected-teaching-argument",
    reviewSelectorPath: "content/course/contracts/review-candidates/m34.v1.json",
    expectedFrozenOutputCount: 6,
    expectedFrozenMermaidCount: 1,
    run: runM34AuthoringCandidateEvidencePreflight,
  },
  {
    moduleId: "m35",
    evidencePath: "content/course/contracts/evidence/m35.v1.json",
    workbookPath: "content/authoring/m35_machine_learning_representation_workbook.v1.md",
    substitutePath: "content/source-maps/module35_machine_learning_statistical_learning_ai_eval_source_research.md",
    substituteLocator: "the-connected-teaching-argument",
    reviewSelectorPath: "content/course/contracts/review-candidates/m35.v1.json",
    expectedFrozenOutputCount: 8,
    expectedFrozenMermaidCount: 2,
    run: runM35AuthoringCandidateEvidencePreflight,
  },
  {
    moduleId: "m36",
    evidencePath: "content/course/contracts/evidence/m36.v1.json",
    workbookPath: "content/authoring/m36_statistical_learning_theory_reliable_deep_learning_workbook.v1.md",
    substitutePath: "content/source-maps/module36_statistical_learning_theory_reliable_deep_learning_source_research.md",
    substituteLocator: "the-connected-teaching-argument",
    reviewSelectorPath: "content/course/contracts/review-candidates/m36.v1.json",
    expectedFrozenOutputCount: 7,
    expectedFrozenMermaidCount: 2,
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

  test(`${candidate.moduleId.toUpperCase()} frozen review candidate retains its study-ready structural spine without promotion`, async () => {
    const selector = JSON.parse(
      await readFile(resolve(siteRoot, candidate.reviewSelectorPath), "utf8"),
    );
    assert.equal(selector.moduleId, candidate.moduleId);
    assert.match(selector.truthBoundary.learnerDelivery, /hidden/u);
    assert.match(selector.truthBoundary.release, /unrecorded/u);
    assert.equal(selector.visualContentPaths.length, 1);
    assert.equal(selector.visualContentPaths[0], selector.workbookPath);
    assert.equal(selector.sourceLedgerPaths.length, 1);

    const [workbook, ...sourceLedgers] = await Promise.all([
      readFile(resolve(siteRoot, selector.workbookPath), "utf8"),
      ...selector.sourceLedgerPaths.map((sourceLedgerPath) =>
        readFile(resolve(siteRoot, sourceLedgerPath), "utf8"),
      ),
    ]);
    const sessionMatches = [...workbook.matchAll(/^## Session (\d+) —.*$/gmu)];
    assert.deepEqual(
      sessionMatches.map((match) => Number(match[1])),
      [1, 2, 3, 4, 5, 6],
    );
    for (const [index, match] of sessionMatches.entries()) {
      const nextSession = sessionMatches[index + 1];
      const sessionText = workbook.slice(match.index, nextSession?.index);
      assert.match(sessionText, /^### Output:/mu);
    }
    assert.equal(
      extractTableOfContents(workbook).filter(
        ({ depth, title }) => depth === 3 && title.startsWith("Output:"),
      ).length,
      candidate.expectedFrozenOutputCount,
    );
    assert.match(workbook, /^## (?:\d+\. )?Confidence-aware diagnostic/mu);
    assert.match(workbook, /confidence/iu);
    assert.match(workbook, /<details>/u);
    assert.match(workbook, /\*\*Answer:/u);
    assert.match(workbook, /(?:Repair:|Misconception map:)/u);
    assert.match(
      workbook,
      new RegExp(`Teaching Assistant prompt — ${candidate.moduleId.toUpperCase()}`, "u"),
    );
    assert.match(
      workbook,
      new RegExp(`Study Partner prompt — ${candidate.moduleId.toUpperCase()}`, "u"),
    );
    assert.match(workbook, /oral defense/iu);
    assert.match(workbook, /^## Source and reuse boundary/mu);
    assert.match(workbook, /^## Candidate release boundary/mu);
    assert.match(workbook, /\]\(https?:\/\//u);

    for (const sourceLedger of sourceLedgers) {
      assert.match(sourceLedger, /^## Scope and truth boundary/mu);
      assert.match(sourceLedger, /^## Source ledger/mu);
      assert.match(sourceLedger, /Stable learner-facing source/u);
      assert.match(sourceLedger, /Access record and reuse status/u);
      assert.match(sourceLedger, /Accessed \d{4}-\d{2}-\d{2}/u);
      assert.match(sourceLedger, /reuse/iu);
    }

    const visualBlocks = scanMermaidBlocks(workbook, { sourcePath: selector.workbookPath });
    const visualReport = validateMermaidAccessibility(visualBlocks, { requireComplete: true });
    assert.equal(visualBlocks.length, candidate.expectedFrozenMermaidCount);
    assert.equal(visualReport.summary.completeBlocks, candidate.expectedFrozenMermaidCount);
    assert.ok(
      visualBlocks.every(({ metadata }) => metadata?.id.startsWith(`${candidate.moduleId}-`)),
    );
    assert.ok(visualBlocks.every(({ metadata }) => metadata?.alternative.length >= 40));
  });
}
