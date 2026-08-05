import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relativePath) => fs.readFileSync(path.join(siteRoot, relativePath), "utf8");

test("print route preserves private and preview boundaries", () => {
  const route = read("app/print/modules/[slug]/page.tsx");
  assert.match(route, /availability === "authoring-only"/u);
  assert.match(route, /ATLAS_PRIVATE_PDF_EXPORT/u);
  assert.match(route, /evidence-gated/u);
  assert.match(route, /static-print-companion-required/u);
  assert.match(route, /authoringModuleMarkdownBySlug/u);
});

test("PDF exporter waits for rendered teaching surfaces and writes provenance", () => {
  const exporter = read("scripts/render-module-pdfs.mjs");
  assert.match(exporter, /document\.fonts/u);
  assert.match(exporter, /diagram-canvas\[aria-busy='true'\]/u);
  assert.match(exporter, /page\.pdf/u);
  assert.match(exporter, /print\/handbook/u);
  assert.match(exporter, /Atlas-Academy-course-handbook\.pdf/u);
  assert.match(exporter, /sourceHash/u);
  assert.match(exporter, /manifest\.v1\.json/u);
});

test("PDF validator checks bytes, source hashes, and optional page geometry", () => {
  const validator = read("scripts/validate-module-pdfs.mjs");
  assert.match(validator, /output hash does not match/u);
  assert.match(validator, /source hash differs/u);
  assert.match(validator, /--pdfinfo/u);
  assert.match(validator, /Letter page size/u);
});

test("private authoring print projection covers M31-M36 without reader exposure", () => {
  const generated = read("content/authoring/module-authoring-content.ts");
  for (let number = 31; number <= 36; number += 1) {
    assert.match(generated, new RegExp(`"${number}-`, "u"));
  }
  const readerCatalog = read("content/modules/module-content.ts");
  assert.doesNotMatch(readerCatalog, /module31|module36/u);
});

test("print mode opens disclosures and removes navigation glyphs from PDF output", () => {
  const markdown = read("app/modules/[slug]/ModuleMarkdown.tsx");
  const styles = read("app/globals.css");
  assert.match(markdown, /open=\{printMode \? true : open\}/u);
  assert.match(styles, /\.print-module-prose \.heading-anchor\s*\{\s*display: none/u);
  assert.match(styles, /\.print-module-prose \.diagram-source\s*\{\s*display: none/u);
});
