#!/usr/bin/env node
// Append (or replace) a workbook's "## Bench pack" section without touching the
// line endings of anything already in the file.
//
//   node scripts/append-bench-section.mjs <workbook-path> <section-file>
//
// Why this exists: an earlier ad-hoc script did
//   fs.writeFileSync(path, source.replace(/\n/g, "\r\n") + section)
// on a file that was already CRLF, which turned every `\r\n` into `\r\r\n` — all
// 1,525 of them — and changed every session-slice hash in the workbook. The
// sync validator caught it, but only because it hashes those slices.
//
// The rule this encodes: never rewrite the existing bytes. Detect the file's
// dominant line ending, convert only the NEW section to match, and concatenate.

import fs from "node:fs";

const [workbookPath, sectionPath] = process.argv.slice(2);
if (!workbookPath || !sectionPath) {
  console.error(
    "usage: node scripts/append-bench-section.mjs <workbook-path> <section-file>",
  );
  process.exit(2);
}

// Read as latin1 so bytes round-trip exactly; we only ever slice and concatenate.
const original = fs.readFileSync(workbookPath, "latin1");
const section = fs.readFileSync(sectionPath, "utf8");

const crlfCount = (original.match(/\r\n/g) ?? []).length;
const lfCount = (original.match(/\n/g) ?? []).length;
const newline = crlfCount > 0 && crlfCount === lfCount ? "\r\n" : "\n";

// Locate an existing section by whole-line heading, accepting the numbered form
// (`## 21. Bench pack`). A plain indexOf would match the `### Bench pack
// completion record` heading that lives *inside* every section.
const probe = original.replace(/\r\n/g, "\n");
const heading = /^##\s+(?:\d+\.\s+)?Bench pack\s*$/mu.exec(probe);

let head = original;
if (heading) {
  // Map the index in the normalized probe back to the original by counting the
  // CRLFs that precede it.
  const precedingCrlf = newline === "\r\n"
    ? (probe.slice(0, heading.index).match(/\n/g) ?? []).length
    : 0;
  head = original.slice(0, heading.index + precedingCrlf);
}
head = head.replace(/[\s]*$/, "");

const body = Buffer.from(
  section.replace(/\r\n/g, "\n").replace(/\n/g, newline),
  "utf8",
).toString("latin1");

fs.writeFileSync(workbookPath, head + newline + newline + body, "latin1");

const after = fs.readFileSync(workbookPath, "latin1");
if (/\r\r/.test(after)) {
  console.error("ABORT: doubled carriage returns were introduced");
  fs.writeFileSync(workbookPath, original, "latin1");
  process.exit(1);
}
console.log(
  `${heading ? "replaced" : "appended"} bench section in ${workbookPath} ` +
    `(${newline === "\r\n" ? "CRLF" : "LF"})`,
);
