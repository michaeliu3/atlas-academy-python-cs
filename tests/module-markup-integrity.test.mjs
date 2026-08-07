import assert from "node:assert/strict";
import test from "node:test";
import {
  formatMarkupIssues,
  scanModuleMarkup,
  scanStrippedMathCandidates,
  splitInlineCode,
} from "../lib/module-markup-integrity.mjs";
import { scanCourseMarkup } from "../scripts/validate-module-markup.mjs";

function kinds(markdown) {
  return scanModuleMarkup(markdown, { sourcePath: "fixture.md" }).issues.map(({ kind }) => kind);
}

test("an orphaned inline-math closer is reported, because the reader turns it into a stray $", () => {
  // This is the exact shape that corrupted Module 28: the opener was stripped
  // but the closer survived, so `normalizeMathDelimiters` emitted a lone `$`
  // that captured every following character up to the next one.
  assert.deepEqual(
    kinds("For a square matrix (A\\), a nonzero vector \\(v\\) is an eigenvector.\n"),
    ["math-delimiter-orphan"],
  );
  assert.deepEqual(kinds("A vector space \\(V\\) over a field \\(\\mathbb F\\).\n"), []);
});

test("unclosed and nested math delimiters are distinguished from balanced ones", () => {
  assert.deepEqual(kinds("The value \\(x is never closed.\n"), ["math-delimiter-unclosed"]);
  assert.deepEqual(kinds("\\[\nA=Q\\Lambda Q^\\mathsf T\n\\]\n"), []);
  assert.deepEqual(kinds("\\[\nx\n"), ["math-delimiter-unclosed"]);
  assert.deepEqual(
    kinds("Open \\(a\\(b\\)\\) twice.\n"),
    ["math-delimiter-nesting"],
  );
});

test("math delimiters inside code spans and fences are ignored", () => {
  // A code span documenting a regex must not be read as mathematics, and it
  // must not be able to unbalance the surrounding document.
  assert.deepEqual(kinds("Match a group with `\\(` and `\\)` in a pattern.\n"), []);
  assert.deepEqual(kinds("~~~text\n\\(unbalanced\n~~~\n"), []);
});

test("raw LaTeX stranded in a code span is reported, but regexes and paths are not", () => {
  assert.deepEqual(
    kinds("Let `X\\sim\\operatorname{Bernoulli}(1/2)` be the source.\n"),
    ["latex-in-code-span"],
  );
  // Single-letter escapes belong to regexes and string literals.
  assert.deepEqual(kinds("Unicode-aware `\\w+` token matches.\n"), []);
  assert.deepEqual(kinds("Append exactly `\"\\n\"` before encoding.\n"), []);
  assert.deepEqual(kinds("Run it from `python-advanced-course\\work`.\n"), []);
});

test("bare single-letter variables are surfaced as review candidates, not errors", () => {
  // `\(A\)` losing its delimiters leaves `(A)`, which no backslash-based check
  // can see. It is also shape-identical to correct prose, so this advises
  // rather than fails — four such options survived the first Module 28 repair.
  const found = scanStrippedMathCandidates(
    "Let \\(A\\) be square.\n\nA. (A) is any square matrix.\n",
  );
  assert.deepEqual(found.candidates.map(({ token }) => token), ["A"]);

  // A document with no inline math at all is not a candidate source.
  assert.deepEqual(scanStrippedMathCandidates("Answer (A) is correct.\n").candidates, []);

  // An already-delimited variable is not double-counted.
  assert.deepEqual(
    scanStrippedMathCandidates("Both \\(A\\) and \\(B\\) are square.\n").candidates,
    [],
  );

  // Fenced content is out of scope.
  assert.deepEqual(
    scanStrippedMathCandidates("Let \\(A\\) be square.\n\n~~~text\n(A) marker\n~~~\n").candidates,
    [],
  );
});

test("a delimiter row that disagrees with its header is reported", () => {
  // GFM does not render this as a table at all; it falls back to raw text.
  assert.deepEqual(
    kinds("| A | B | C | D |\n|---|---|---|\n| 1 | 2 | 3 | 4 |\n"),
    ["table-delimiter-mismatch"],
  );
  assert.deepEqual(kinds("| A | B |\n|---|---|\n| 1 | 2 |\n"), []);
});

test("an unescaped pipe inside a table code span is reported with its dropped column", () => {
  const issues = kinds("| Name | Role |\n| --- | --- |\n| `sensitivity` | `P(+ | H)` |\n");
  assert.ok(issues.includes("table-cell-count"), "the split row must be counted");
  assert.ok(issues.includes("pipe-in-table-code-span"), "the cause must be named");

  assert.deepEqual(kinds("| Name | Role |\n| --- | --- |\n| `x` | `a \\| b` |\n"), []);
  assert.deepEqual(kinds("| Name | Role |\n| --- | --- |\n| `x` | \\(P(+ \\mid H)\\) |\n"), []);
});

test("splitInlineCode preserves source order and marks code segments", () => {
  assert.deepEqual(
    splitInlineCode("a `b` c").map(({ code, text }) => [code, text]),
    [[false, "a "], [true, "b"], [false, " c"]],
  );
});

test("every authored workbook renders as written", async () => {
  const reports = await scanCourseMarkup();
  assert.ok(reports.length >= 36, "the scan must cover reader and authoring workbooks");
  assert.deepEqual(
    formatMarkupIssues(reports),
    [],
    "workbook Markdown must not contain orphaned math delimiters, stranded LaTeX, or split table rows",
  );
});
