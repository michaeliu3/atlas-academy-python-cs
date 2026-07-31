import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { loadReleaseInputPolicy } from "../scripts/release-input-policy.mjs";

const testDirectory = dirname(fileURLToPath(import.meta.url));
const siteRoot = resolve(testDirectory, "..");
const moduleDirectory = resolve(siteRoot, "content", "modules");
const canonicalSourceDirectory = resolve(siteRoot, "content", "source-maps");
const downloadDirectory = resolve(siteRoot, "public", "downloads");

function canonicalText(value) {
  return value.replace(/\r\n?/gu, "\n");
}

test("published workbooks do not expose retired research-directory source-map links", async () => {
  const workbookNames = (await readdir(moduleDirectory)).filter((name) => name.endsWith(".md"));
  const retiredLinks = [];

  for (const workbookName of workbookNames) {
    const workbook = await readFile(resolve(moduleDirectory, workbookName), "utf8");
    for (const match of workbook.matchAll(/\]\((\.\.\/research\/[^)\s]+)\)/gu)) {
      retiredLinks.push({ workbookName, href: match[1] });
    }
  }

  assert.deepEqual(retiredLinks, []);
});

test("downloadable source maps and addenda match their canonical source artifacts", async () => {
  const [downloadEntries, releaseInputPolicy] = await Promise.all([
    readdir(downloadDirectory),
    loadReleaseInputPolicy(siteRoot),
  ]);
  const downloadNames = downloadEntries.filter((name) => /_source_(?:map|audit).*\.md$/u.test(name));
  const copiedDownloadNames = releaseInputPolicy.sourceArtifactCopies
    .map(({ publicPath }) => publicPath.split(/[\\/]/u).at(-1))
    .sort();
  const missingCanonicalSources = [];
  const staleDownloads = [];

  for (const downloadName of downloadNames) {
    const [canonicalSource, download] = await Promise.all([
      readFile(resolve(canonicalSourceDirectory, downloadName), "utf8").catch(() => null),
      readFile(resolve(downloadDirectory, downloadName), "utf8"),
    ]);
    if (canonicalSource === null) {
      missingCanonicalSources.push(downloadName);
    } else if (canonicalText(download) !== canonicalText(canonicalSource)) {
      staleDownloads.push(downloadName);
    }
  }

  assert.deepEqual([...downloadNames].sort(), copiedDownloadNames);
  assert.deepEqual(missingCanonicalSources, []);
  assert.deepEqual(staleDownloads, []);
});
