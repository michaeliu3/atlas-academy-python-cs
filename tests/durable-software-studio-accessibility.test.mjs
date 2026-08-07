import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const testDirectory = dirname(fileURLToPath(import.meta.url));
const siteRoot = resolve(testDirectory, "..");
const studioStylePath = resolve(siteRoot, "app", "DurableSoftwareStudio.module.css");

test("the shared M12/M13 studio declares explicit focus and forced-color boundaries", async () => {
  const style = await readFile(studioStylePath, "utf8");

  for (const selector of [
    ".tab:focus-visible",
    ".tabActive:focus-visible",
    ".confidence input:focus-visible",
    ".reveal:focus-visible",
  ]) {
    assert.match(style, new RegExp(selector.replaceAll(".", "\\."), "u"));
  }
  assert.match(style, /outline:\s*3px solid var\(--studio-accent\)/u);
  assert.match(style, /@media \(forced-colors: active\)/u);
  assert.match(style, /background:\s*Highlight/u);
  assert.match(style, /color:\s*HighlightText/u);
  assert.match(style, /border-color:\s*ButtonText/u);
  assert.match(style, /outline-color:\s*Highlight/u);
  assert.match(style, /color:\s*GrayText/u);
});
