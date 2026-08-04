import assert from "node:assert/strict";
import test from "node:test";

import {
  auditSourceCorpus,
  extractReviewDates,
  extractUrls,
  validateProvenance,
} from "../scripts/check-source-links.mjs";

test("source corpus has HTTPS links and a fresh document-level provenance date", async () => {
  const audit = await auditSourceCorpus({ today: "2026-08-04" });
  assert.deepEqual(audit.errors, []);
  assert.ok(audit.files.length >= 60);
  assert.ok(audit.urls.size >= 300);
});

test("provenance validation rejects future and stale review dates", () => {
  assert.deepEqual(extractReviewDates("Research snapshot: 2026-08-03"), ["2026-08-03"]);
  assert.match(
    validateProvenance("**Audit date:** 2026-08-05", { today: "2026-08-04" }).errors.join(" "),
    /future review date/u,
  );
  assert.match(
    validateProvenance("**Reviewed:** 2025-01-01", { today: "2026-08-04", maxAgeDays: 180 }).errors.join(" "),
    /days old/u,
  );
});

test("URL extraction removes Markdown punctuation without changing query strings", () => {
  assert.deepEqual(
    extractUrls("[source](https://example.com/path?q=one&x=two)."),
    ["https://example.com/path?q=one&x=two"],
  );
});
