import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(scriptDirectory, "..");
const packPath = path.join(siteRoot, "content/course/module-teaching-packs.v1.json");
const outputPath = path.join(siteRoot, "docs/MODULE_DELIVERY_COVERAGE.md");
const packs = JSON.parse(fs.readFileSync(packPath, "utf8"));

const availabilityLabel = {
  "legacy-open": "core",
  published: "core",
  preview: "preview / gated",
  "authoring-only": "private guided study",
};

function cell(value) {
  return String(value ?? "—").replaceAll("|", "\\|").replaceAll("\n", " ");
}

const lines = [
  "# Module Delivery Coverage",
  "",
  "This matrix is generated from the canonical teaching-pack registry. It is a delivery map, not learner evidence. `prepared-derived-*` means a source-bound launch card or project loop is ready to copy into the designated Codex chat and still requires live adaptation; `local-release-pipeline` means the deterministic PDF exporter and validator are available, while generated binaries and their manifest remain release artifacts rather than checked-in source.",
  "",
  "The authoritative machine-readable record is [`module-teaching-packs.v1.json`](../content/course/module-teaching-packs.v1.json). Availability labels preserve the access boundary: M25/M26 are preview/evidence-gated and M31–M36 are private guided study only.",
  "",
  "| Module | Availability | Workbook | Source map | Six sessions | TA lecture | Study Partner project | Code / execution | PDF | Visual fallback | Oral defense | Evidence card |",
  "|:--|:--|:--|:--|:--|:--|:--|:--|:--|:--|:--|:--|",
];

for (const pack of packs.modules ?? []) {
  const number = `M${String(pack.number).padStart(2, "0")}`;
  const coverage = pack.coverage ?? {};
  lines.push(
    `| ${number} · ${cell(pack.title)} | ${cell(availabilityLabel[pack.availability] ?? pack.availability)} | ${cell(coverage.workbook)} | ${cell(coverage.sourceMap)} | ${cell(coverage.sixSessionSpine)} | ${cell(coverage.taLecture)} | ${cell(coverage.studyPartnerProject)} | ${cell(coverage.codeFixture)} | ${cell(coverage.pdf)} | ${cell(coverage.visualFallback)} | ${cell(coverage.oralDefense)} | ${cell(coverage.evidenceCard)} |`,
  );
}

lines.push(
  "",
  "## Release reading",
  "",
  "A release candidate must run the local PDF render and validation commands, inspect representative rendered pages, and retain the generated manifest/checksums. The matrix deliberately does not turn a generated file, a prompt, or an unexecuted code locator into a claim that a learner session occurred.",
  "",
);

const output = lines.join("\n");
const checkOnly = process.argv.includes("--check");
if (checkOnly) {
  const current = fs.existsSync(outputPath) ? fs.readFileSync(outputPath, "utf8") : "";
  if (current !== output) {
    throw new Error(`Coverage matrix is stale: ${path.relative(siteRoot, outputPath)}`);
  }
  console.log(`Coverage matrix is current: ${path.relative(siteRoot, outputPath)}`);
} else {
  fs.writeFileSync(outputPath, output, "utf8");
  console.log(`Wrote ${path.relative(siteRoot, outputPath)}`);
}
