import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(scriptDirectory, "..");
const outputDirectory = path.resolve(siteRoot, process.argv.find((item) => item.startsWith("--output-dir="))?.slice(13) ?? "output/pdf");
const pack = JSON.parse(fs.readFileSync(path.join(siteRoot, "content/course/module-teaching-packs.v1.json"), "utf8"));
const packById = new Map(pack.modules.map((packModule) => [packModule.moduleId, packModule]));
const manifestPath = path.join(outputDirectory, "manifest.v1.json");
if (!fs.existsSync(manifestPath)) throw new Error(`PDF manifest missing: ${manifestPath}`);
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const errors = [];
const pdfInfoRequested = process.argv.includes("--pdfinfo");
const selectedIds = process.argv.find((item) => item.startsWith("--modules="))?.slice(10)?.split(",").filter(Boolean) ?? null;
const expectedModuleIds = new Set(
  pack.modules
    .filter((packModule) => !selectedIds || selectedIds.includes(packModule.moduleId) || selectedIds.includes(packModule.slug))
    .map(({ moduleId }) => moduleId),
);
const handbookExpected = !selectedIds || process.argv.includes("--handbook");
const expectedHandbookSourceHash = crypto
  .createHash("sha256")
  .update(fs.readFileSync(path.join(siteRoot, "content/course/course-graph.v2.json")))
  .update(fs.readFileSync(path.join(siteRoot, "content/course/arc-projects.v1.json")))
  .update(fs.readFileSync(path.join(siteRoot, "content/course/module-teaching-packs.v1.json")))
  .digest("hex");
const seen = new Set();
const moduleEntries = [];
const handbookEntries = [];
for (const file of manifest.files ?? []) {
  if (seen.has(file.moduleId)) errors.push(`${file.moduleId}: duplicate manifest entry`);
  seen.add(file.moduleId);
  const filePath = path.join(outputDirectory, file.filename);
  const label = file.moduleId ?? file.filename;
  if (!fs.existsSync(filePath)) errors.push(`${file.moduleId}: missing PDF ${file.filename}`);
  else if (fs.statSync(filePath).size < 1024) errors.push(`${label}: suspiciously small PDF`);
  if (file.kind === "handbook") {
    handbookEntries.push(file);
    if (file.moduleId !== "handbook") errors.push(`${label}: handbook entry must use moduleId handbook`);
    if (file.sourceHash !== expectedHandbookSourceHash) errors.push(`${label}: handbook source hash differs from canonical inputs`);
  } else {
    moduleEntries.push(file);
    if (!expectedModuleIds.has(file.moduleId)) errors.push(`${label}: not in teaching-pack registry`);
  }
  const sourcePack = packById.get(file.moduleId);
  if (!file.sourceHash || !file.sha256) errors.push(`${label}: source/output hash missing`);
  if (file.kind !== "handbook" && sourcePack && file.sourceHash !== sourcePack.workbook.sourceHash) {
    errors.push(`${label}: source hash differs from teaching-pack source`);
  }
  if (fs.existsSync(filePath)) {
    const actualHash = crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
    if (file.sha256 !== actualHash) errors.push(`${label}: output hash does not match PDF bytes`);
  }
  if (pdfInfoRequested && fs.existsSync(filePath)) {
    let info = null;
    for (const command of ["pdfinfo", "pdfinfo.exe", "pdfinfo.cmd"]) {
      try {
        info = execFileSync(command, [filePath], { encoding: "utf8" });
        break;
      } catch {
        // Try the next platform-specific command name.
      }
    }
    if (!info) {
      errors.push(`${label}: --pdfinfo requested but Poppler pdfinfo was not available`);
    } else {
      const pages = Number(info.match(/^Pages:\s+(\d+)/mu)?.[1] ?? 0);
      const pageSize = info.match(/^Page size:\s+(.+)$/mu)?.[1]?.trim() ?? "";
      if (pages < 1) errors.push(`${label}: pdfinfo reported no pages`);
      if (!/^(612\s+x\s+792|8\.5\s+x\s+11)\b/iu.test(pageSize)) {
        errors.push(`${label}: expected Letter page size, got ${pageSize || "unknown"}`);
      }
    }
  }
}
if (moduleEntries.length !== expectedModuleIds.size) {
  errors.push(`module manifest count ${moduleEntries.length} does not equal expected ${expectedModuleIds.size}`);
}
for (const moduleId of expectedModuleIds) {
  if (!moduleEntries.some((file) => file.moduleId === moduleId)) errors.push(`${moduleId}: missing from PDF manifest`);
}
if (handbookExpected && handbookEntries.length !== 1) {
  errors.push(`handbook manifest count ${handbookEntries.length} does not equal expected 1`);
}
if (!handbookExpected && handbookEntries.length !== 0) {
  errors.push("handbook was not requested for this scoped export");
}

if (errors.length) {
  console.error(JSON.stringify({ errors }, null, 2));
  process.exitCode = 1;
} else {
  console.log(`Validated ${moduleEntries.length} module PDFs${handbookEntries.length ? " plus the course handbook" : ""} in ${path.relative(siteRoot, outputDirectory)}.`);
}
