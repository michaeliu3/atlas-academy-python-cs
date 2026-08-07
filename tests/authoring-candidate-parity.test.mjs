import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";
import {
  advancedReviewCandidateParityPolicy,
  advancedReviewCandidateSpecs,
  canonicalAdvancedReviewBody,
  renderAdvancedReviewCandidate,
} from "../scripts/advanced-review-candidate-parity.mjs";

const siteRoot = resolve(import.meta.dirname, "..");

test("advanced candidate parity has one canonical source and an explicit allow-list", () => {
  assert.equal(advancedReviewCandidateParityPolicy.canonicalSource, "authoring-workbook");
  assert.deepEqual(advancedReviewCandidateParityPolicy.allowedDifferences, [
    "candidate-preamble",
    "source-ledger-relative-link-rewrite",
    "candidate-release-boundary-footer",
  ]);

  const moduleIds = advancedReviewCandidateSpecs.map((spec) => spec.moduleId);
  assert.deepEqual(moduleIds, ["m31", "m32", "m33", "m34", "m35", "m36"]);
  assert.equal(new Set(advancedReviewCandidateSpecs.map((spec) => spec.authoringPath)).size, moduleIds.length);
  assert.equal(new Set(advancedReviewCandidateSpecs.map((spec) => spec.candidatePath)).size, moduleIds.length);
});

test("M31–M36 hidden candidates are generated from their canonical authoring workbooks", async () => {
  for (const spec of advancedReviewCandidateSpecs) {
    const [authoringMarkdown, candidateMarkdown] = await Promise.all([
      readFile(resolve(siteRoot, spec.authoringPath), "utf8"),
      readFile(resolve(siteRoot, spec.candidatePath), "utf8"),
    ]);

    assert.equal(
      candidateMarkdown,
      renderAdvancedReviewCandidate(authoringMarkdown, spec),
      spec.moduleId + " candidate may differ only through the generator's explicit preamble, source-ledger rewrite, and release-boundary footer",
    );
    assert.equal(
      canonicalAdvancedReviewBody(candidateMarkdown, spec),
      canonicalAdvancedReviewBody(authoringMarkdown, spec),
      spec.moduleId + " candidate body must remain aligned with its authoring workbook",
    );
    if (spec.moduleId === "m35" || spec.moduleId === "m36") {
      assert.match(
        authoringMarkdown,
        /^## Confidence-aware diagnostic and spaced review/mu,
        spec.moduleId + " must use the shared diagnostic section heading",
      );
      assert.doesNotMatch(
        authoringMarkdown,
        /^## 9\. Confidence-aware diagnostic and spaced review/mu,
        spec.moduleId + " must not retain the stale numbered diagnostic heading",
      );
    }
  }
});
