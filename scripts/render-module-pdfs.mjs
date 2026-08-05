import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(scriptDirectory, "..");
const packPath = path.join(siteRoot, "content/course/module-teaching-packs.v1.json");
const packs = JSON.parse(fs.readFileSync(packPath, "utf8"));
const graphPath = path.join(siteRoot, "content/course/course-graph.v2.json");
const arcProjectsPath = path.join(siteRoot, "content/course/arc-projects.v1.json");

function argument(name, fallback) {
  const prefix = `--${name}=`;
  const value = process.argv.find((item) => item.startsWith(prefix));
  return value ? value.slice(prefix.length) : fallback;
}

const baseUrl = argument("base-url", "http://localhost:4173").replace(/\/$/u, "");
const outputDirectory = path.resolve(siteRoot, argument("output-dir", "output/pdf"));
const requestedModules = argument("modules", null);
const requestedIds = requestedModules
  ? new Set(requestedModules.split(",").map((value) => value.trim()).filter(Boolean))
  : null;
const selectedPacks = packs.modules.filter((pack) => !requestedIds || requestedIds.has(pack.moduleId) || requestedIds.has(pack.slug));
const includeHandbook = !requestedIds || process.argv.includes("--handbook");
if (!selectedPacks.length && !includeHandbook) throw new Error("No modules selected for PDF export.");

fs.mkdirSync(outputDirectory, { recursive: true });
let commit = "unknown";
try {
  commit = execFileSync("git", ["rev-parse", "HEAD"], { cwd: siteRoot, encoding: "utf8" }).trim();
} catch {
  // A source archive may not contain Git metadata; the source hashes still identify the inputs.
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  viewport: { width: 1440, height: 1100 },
  deviceScaleFactor: 1,
});
const files = [];

async function waitForRenderedPage() {
  await page.waitForFunction(() => document.fonts?.status === "loaded", null, { timeout: 30_000 });
  await page.waitForFunction(() => {
    const pending = document.querySelectorAll(".diagram-canvas[aria-busy='true']").length;
    const failed = document.querySelectorAll(".katex-error").length;
    return pending === 0 && failed === 0;
  }, null, { timeout: 120_000 });
}

async function renderPdf({ url, outputPath, label }) {
  await page.goto(url, { waitUntil: "networkidle", timeout: 120_000 });
  await waitForRenderedPage();
  const checks = await page.evaluate(() => ({
    title: document.querySelector("h1")?.textContent?.trim() ?? "",
    pendingDiagrams: document.querySelectorAll(".diagram-canvas[aria-busy='true']").length,
    failedMath: document.querySelectorAll(".katex-error").length,
    rawMermaid: [...document.querySelectorAll("pre code.language-mermaid")].filter(
      (node) => !node.closest(".diagram-source"),
    ).length,
    diagrams: document.querySelectorAll(".mermaid-figure svg[role='img']").length,
    codeBlocks: document.querySelectorAll(".lesson-code pre").length,
  }));
  if (checks.pendingDiagrams || checks.failedMath || checks.rawMermaid) {
    throw new Error(`${label}: render readiness failed: ${JSON.stringify(checks)}`);
  }
  await page.pdf({
    path: outputPath,
    format: "Letter",
    printBackground: true,
    preferCSSPageSize: true,
    displayHeaderFooter: true,
    headerTemplate: "<span></span>",
    footerTemplate: `<div style="width:100%;font-size:8px;color:#53635b;text-align:center;">Atlas Academy · ${label.replaceAll("&", "&amp;")} · <span class="pageNumber"></span>/<span class="totalPages"></span></div>`,
    margin: { top: "0.7in", bottom: "0.65in", left: "0.7in", right: "0.7in" },
  });
  const bytes = fs.readFileSync(outputPath);
  return {
    bytes: bytes.length,
    sha256: crypto.createHash("sha256").update(bytes).digest("hex"),
    checks,
  };
}

try {
  if (includeHandbook) {
    const filename = "Atlas-Academy-course-handbook.pdf";
    const outputPath = path.join(outputDirectory, filename);
    const rendered = await renderPdf({
      url: `${baseUrl}/print/handbook`,
      outputPath,
      label: "Course handbook",
    });
    const sourceHash = crypto
      .createHash("sha256")
      .update(fs.readFileSync(graphPath))
      .update(fs.readFileSync(arcProjectsPath))
      .update(fs.readFileSync(packPath))
      .digest("hex");
    files.push({
      kind: "handbook",
      moduleId: "handbook",
      number: null,
      title: "Atlas Academy course handbook",
      availability: "route-reference",
      filename,
      ...rendered,
      sourceHash,
    });
    console.log(`handbook: ${filename} (${rendered.bytes} bytes)`);
  }
  for (const pack of selectedPacks) {
    const url = `${baseUrl}/print/modules/${pack.slug}`;
    const filename = `M${String(pack.number).padStart(2, "0")}-${pack.slug}.pdf`;
    const outputPath = path.join(outputDirectory, filename);
    const rendered = await renderPdf({ url, outputPath, label: pack.title });
    files.push({
      kind: "module",
      moduleId: pack.moduleId,
      number: pack.number,
      title: pack.title,
      availability: pack.availability,
      filename,
      ...rendered,
      sourceHash: pack.workbook.sourceHash,
    });
    console.log(`${pack.moduleId}: ${filename} (${rendered.bytes} bytes; ${rendered.checks.diagrams} diagrams, ${rendered.checks.codeBlocks} code blocks)`);
  }
} finally {
  await browser.close();
}

const manifest = {
  schemaVersion: 1,
  kind: "atlas-pdf-export",
  sourcePack: "content/course/module-teaching-packs.v1.json",
  commit,
  baseUrl,
  files,
};
fs.writeFileSync(path.join(outputDirectory, "manifest.v1.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Wrote ${files.length} PDF manifest entries to ${path.relative(siteRoot, outputDirectory)}.`);
