import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";

import {
  auditSourceCorpus,
  extractReviewDates,
  extractUrls,
  parseCurlProbe,
  siteRoot,
  validateProvenance,
} from "../scripts/check-source-links.mjs";

test("source corpus has HTTPS links and a fresh document-level provenance date", async () => {
  const audit = await auditSourceCorpus({ today: "2026-08-05" });
  assert.deepEqual(audit.errors, []);
  assert.ok(audit.files.length >= 60);
  assert.ok(audit.urls.size >= 300);
});

test("active calibration records pin the same current Stanford CS103 quarter", async () => {
  const audit = await auditSourceCorpus({ today: "2026-08-05" });
  const calibrationFiles = audit.files.filter(
    (file) => file === "docs/ACADEMIC_CALIBRATION.md" || file.startsWith("docs/research/"),
  );
  const records = await Promise.all(
    calibrationFiles.map(async (file) => [file, await readFile(resolve(siteRoot, file), "utf8")]),
  );
  const joined = records.map(([file, text]) => file + "\n" + text).join("\n");
  assert.doesNotMatch(joined, /cs103\.1264/u);
  assert.match(joined, /cs103\.1266/u);
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

test("URL extraction stops before a prose em dash after a Markdown link", () => {
  assert.deepEqual(
    extractUrls("[CMU](https://csd.cs.cmu.edu/15213-introduction-to-computer-systems)—followed"),
    ["https://csd.cs.cmu.edu/15213-introduction-to-computer-systems"],
  );
});

test("curl probe parsing keeps the final redirected status and URL", () => {
  assert.deepEqual(
    parseCurlProbe(
      "HTTP/2 301\nATLAS_STATUS:301\nATLAS_URL:https://example.test/old\n" +
        "HTTP/2 200\nATLAS_STATUS:200\nATLAS_URL:https://example.test/new\n",
    ),
    { status: 200, finalUrl: "https://example.test/new" },
  );
  assert.match(parseCurlProbe("curl: could not resolve host").error, /final HTTP status/u);
});
