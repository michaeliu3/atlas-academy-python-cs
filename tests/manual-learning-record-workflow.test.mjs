import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  manualLearningRecordWorkflowRelativePath,
  loadManualLearningRecordWorkflow,
  validateManualLearningRecordWorkflow,
} from "../scripts/manual-learning-record-workflow.mjs";

const testDirectory = dirname(fileURLToPath(import.meta.url));
const siteRoot = resolve(testDirectory, "..");

const expectedCategoryIds = [
  "course-dashboard-current-route",
  "daily-learning-log",
  "module-notebook",
  "misconceptions-debugging-log",
  "proof-derivation-counterexample-numerical-experiment-notebook",
  "math-ml-mastery-gates",
  "spaced-review-queue",
  "oral-defense-evidence",
  "projects-capstone-portfolio",
  "ta-study-partner-handoffs",
];

test("the manual learning record kit preserves the ten connected, consent-based record types", async () => {
  const workflow = await loadManualLearningRecordWorkflow(siteRoot);
  const report = await validateManualLearningRecordWorkflow(workflow, { siteRoot });

  assert.equal(report.workflowPath, manualLearningRecordWorkflowRelativePath);
  assert.equal(report.delivery.mode, "manual-copy-only");
  assert.equal(report.delivery.portalToNotionIntegration, "none");
  assert.equal(report.copyApproval.requiredBeforeManualCopy, true);
  assert.deepEqual(
    report.recordCategories.map(({ id }) => id),
    expectedCategoryIds,
  );
  assert.ok(report.privacyBoundary.excludedFromGit.includes("Notion page and database IDs"));
  assert.ok(report.privacyBoundary.excludedFromGit.includes("raw oral-defense transcripts"));
  assert.ok(report.privacyBoundary.prohibitedAutomation.includes("automatic portal-to-Notion writes"));
  assert.equal(report.learnerGuidePath, "docs/LEARNER_RECORD_WORKFLOW.md");
});

test("the manual learning record kit fails closed if a required record, approval boundary, or privacy exclusion drifts", async () => {
  const workflow = await loadManualLearningRecordWorkflow(siteRoot);

  const missingRecord = structuredClone(workflow);
  missingRecord.recordCategories.pop();
  await assert.rejects(
    validateManualLearningRecordWorkflow(missingRecord, { siteRoot }),
    /must declare exactly the ten required record categories/u,
  );

  const automaticWrite = structuredClone(workflow);
  automaticWrite.delivery.portalToNotionIntegration = "automatic-write";
  await assert.rejects(
    validateManualLearningRecordWorkflow(automaticWrite, { siteRoot }),
    /must remain none/u,
  );

  const missingApproval = structuredClone(workflow);
  missingApproval.copyApproval.requiredBeforeManualCopy = false;
  await assert.rejects(
    validateManualLearningRecordWorkflow(missingApproval, { siteRoot }),
    /must require learner approval before any manual copy/u,
  );

  const rawTranscriptLeak = structuredClone(workflow);
  rawTranscriptLeak.privacyBoundary.excludedFromGit = rawTranscriptLeak.privacyBoundary.excludedFromGit.filter(
    (value) => value !== "raw oral-defense transcripts",
  );
  await assert.rejects(
    validateManualLearningRecordWorkflow(rawTranscriptLeak, { siteRoot }),
    /must exclude raw oral-defense transcripts from Git/u,
  );
});

test("the learner guide exposes a concise manual-copy template for each record category", async () => {
  const guidePath = resolve(siteRoot, "docs", "LEARNER_RECORD_WORKFLOW.md");
  const guide = await readFile(guidePath, "utf8");

  assert.match(guide, /^# Atlas manual learning record kit$/mu);
  assert.match(guide, /No portal-to-Notion connection exists/u);
  assert.match(guide, /I reviewed this minimal summary and choose to copy it manually./u);
  for (const categoryId of expectedCategoryIds) {
    assert.match(guide, new RegExp(`<!-- record-template: ${categoryId} -->`, "u"));
  }
});
