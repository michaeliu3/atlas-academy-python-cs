/**
 * Count the reviewable structure of the six hidden advanced candidates.
 *
 * The eight human-review dimensions in the v3 registry are judgement calls, but
 * a reviewer should not also have to hunt for what exists. This prints the
 * structural facts — sessions, gates, diagrams, labels, prompts — so the review
 * worksheet can point at counted evidence instead of adjectives.
 *
 * Counting is not approving: nothing here says the material is good, only that
 * it is present and how much of it there is.
 */
import { readFile, readdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { scanMermaidBlocks } from "../lib/mermaid-accessibility.mjs";

const siteRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const modulesDirectory = resolve(siteRoot, "content", "modules");

const names = (await readdir(modulesDirectory)).filter((name) => /^3[1-6]_.*\.md$/u.test(name)).sort();

const rows = [];
for (const name of names) {
  const text = await readFile(resolve(modulesDirectory, name), "utf8");
  const count = (pattern) => (text.match(pattern) ?? []).length;
  const unique = (pattern) => new Set(text.match(pattern) ?? []).size;

  rows.push({
    module: `M${name.slice(0, 2)}`,
    words: text.split(/\s+/u).length,
    sessions: new Set([...text.matchAll(/^## Session ([1-6])/gmu)].map((match) => match[1])).size,
    diagrams: scanMermaidBlocks(text, { sourcePath: name }).length,
    figures: count(/^```atlas-figure/gmu),
    // Both gate shapes: per-question disclosure and the batched repair key.
    gates: count(/Reveal after recording your answer and confidence/gu) + count(/Diagnostic repair key/gu),
    ladderSteps: count(/^### Ladder step \d/gmu),
    evidenceLabels: count(/\*\*\[[A-Z][A-Z \/-]+\]\*\*/gu),
    claimCodes: unique(/M3\d-C\d\d/gu),
    sourceLinks: unique(/https?:\/\/[^\s)"'`]+/gu),
    // Heading wording varies across the arc: "Teaching Assistant prompt — M36"
    // and "Teaching Assistant — M32 systems evidence clinic" are the same
    // device, and "oral defense" appears both hyphenated and not. Match the
    // device, not one module's phrasing, or the flags report false gaps.
    hasTeachingAssistant: /^#{2,4} .*Teaching Assistant/mu.test(text),
    hasStudyPartner: /^#{2,4} .*Study Partner/mu.test(text),
    hasOralDefense: /oral[\s-]defense/iu.test(text),
    hasAcceptanceRubric: /Acceptance rubric/u.test(text),
    hasConceptMap: /One-page concept map/u.test(text),
    hasEvidenceLabelLegend: /^#{2,4} Evidence labels/mu.test(text),
  });
}

const columns = [
  ["module", 7],
  ["words", 7],
  ["sessions", 9],
  ["diagrams", 9],
  ["figures", 8],
  ["gates", 6],
  ["ladderSteps", 12],
  ["evidenceLabels", 15],
  ["claimCodes", 11],
  ["sourceLinks", 12],
];

console.log(columns.map(([key, width]) => key.padEnd(width)).join(""));
for (const row of rows) {
  console.log(columns.map(([key, width]) => String(row[key]).padEnd(width)).join(""));
}

const flags = [
  "hasTeachingAssistant",
  "hasStudyPartner",
  "hasOralDefense",
  "hasAcceptanceRubric",
  "hasConceptMap",
  "hasEvidenceLabelLegend",
];
console.log("");
for (const flag of flags) {
  const missing = rows.filter((row) => !row[flag]).map((row) => row.module);
  console.log(`${flag.padEnd(22)} ${missing.length === 0 ? "present in all six" : `MISSING: ${missing.join(", ")}`}`);
}
