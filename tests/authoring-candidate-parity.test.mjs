import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";
import {
  advancedReviewCandidateSpecs,
  canonicalAdvancedReviewBody,
  renderAdvancedReviewCandidate,
} from "../scripts/advanced-review-candidate-parity.mjs";

const siteRoot = resolve(import.meta.dirname, "..");

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
  }
});
