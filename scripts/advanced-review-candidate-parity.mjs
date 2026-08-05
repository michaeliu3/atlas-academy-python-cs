import { readFile, writeFile } from "node:fs/promises";
import { basename, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const defaultSiteRoot = resolve(scriptDirectory, "..");

const candidateReleaseBoundary = [
  "## Candidate release boundary",
  "",
  "Before this candidate can move into the released portal learner route, it still",
  "needs the versioned review-ready delivery map, complete source/claim and",
  "accessibility review, a bounded interaction or equivalent activity,",
  "diagnostic/review evidence, exact CI and deployment provenance, and human",
  "approval. Until then it remains hidden and authoring-only; it is not a",
  "published module, live-chat event, Notion record, or learner-mastery claim.",
].join("\n");

// The authoring workbook is the only canonical learning body. A frozen hidden
// candidate is a generated review copy, not a second hand-maintained source.
// Keep this allow-list deliberately small so parity failures cannot be hidden
// behind an informal "candidate edit" convention.
export const advancedReviewCandidateParityPolicy = Object.freeze({
  canonicalSource: "authoring-workbook",
  allowedDifferences: Object.freeze([
    "candidate-preamble",
    "source-ledger-relative-link-rewrite",
    "candidate-release-boundary-footer",
  ]),
});

function standardPreamble(number, title, finalLine) {
  return [
    "# Module " + number + " — " + title,
    "",
    "**Hidden review candidate — not learner-delivered.** This is the fixed",
    "learner-material scope for a future qualified review. M" + number + " remains",
    "authoring-only, hidden from the reader manifest, and unrecorded for release.",
    finalLine,
  ].join("\n");
}

function arcPreamble(number, title, finalLines) {
  return [
    "# Module " + number + " — " + title,
    "",
    "**Arc VII — Formal limits, classical AI, and learning systems**",
    "",
    "> **Hidden review candidate — not learner-delivered.** This is the fixed",
    "> learner-material scope for a future qualified review. M" + number + " remains",
    "> authoring-only, hidden from the reader manifest, and unrecorded for release.",
    ...finalLines.map((line) => "> " + line),
  ].join("\n");
}

export const advancedReviewCandidateSpecs = Object.freeze([
  {
    moduleId: "m31",
    number: 31,
    title: "Optimization & Information",
    slug: "optimization_information",
    candidatePreamble: standardPreamble(
      31,
      "Optimization & Information",
      "This file neither opens a portal route nor grants Core credit, publication, review, release, or mastery evidence.",
    ),
  },
  {
    moduleId: "m32",
    number: 32,
    title: "Systems Languages, Scientific Python & Accelerators",
    slug: "systems_languages_scientific_python_accelerators",
    candidatePreamble: standardPreamble(
      32,
      "Systems Languages, Scientific Python & Accelerators",
      "This file neither opens a portal route nor grants Core credit, contract review, source-map approval, release, or learner mastery.",
    ),
  },
  {
    moduleId: "m33",
    number: 33,
    title: "Formal Languages, Computability & Complexity",
    slug: "formal_languages_computability_complexity",
    candidatePreamble: standardPreamble(
      33,
      "Formal Languages, Computability & Complexity",
      "This file does not change the course graph, availability, prerequisite policy, source-map binding, release state, publication claim, or Core credit.",
    ),
  },
  {
    moduleId: "m34",
    number: 34,
    title: "Classical AI: Search, Constraints & Decision",
    slug: "classical_ai_search_constraints_decision",
    candidatePreamble: standardPreamble(
      34,
      "Classical AI: Search, Constraints & Decision",
      "This file does not change the course graph, availability, prerequisite policy, source-map binding, release state, publication claim, or Core credit.",
    ),
  },
  {
    moduleId: "m35",
    number: 35,
    title: "Machine Learning & Representation",
    slug: "machine_learning_representation",
    candidatePreamble: arcPreamble(35, "Machine Learning & Representation", [
      "It does not change the course graph, availability, prerequisite policy,",
      "source-map binding, release state, publication claim, or Core credit;",
      "nothing in this workbook satisfies its prerequisites or opens M36, M25, or",
      "M26.",
    ]),
  },
  {
    moduleId: "m36",
    number: 36,
    title: "Statistical Learning Theory & Reliable Deep-Learning Systems",
    slug: "statistical_learning_theory_reliable_deep_learning",
    candidatePreamble: arcPreamble(36, "Statistical Learning Theory & Reliable Deep-Learning Systems", [
      "It does not change the course graph, availability, prerequisite policy,",
      "source-map binding, release state, publication claim, or Core credit;",
      "nothing in this workbook satisfies its prerequisites or opens M25 or M26.",
    ]),
  },
].map((spec) => Object.freeze({
  ...spec,
  authoringPath: "content/authoring/m" + spec.number + "_" + spec.slug + "_workbook.v1.md",
  candidatePath: "content/modules/" + spec.number + "_" + spec.slug + ".md",
  candidateSourceLedgerPath: "content/source-maps/module" + spec.number + "_" + spec.slug + ".md",
  releaseBoundary: candidateReleaseBoundary,
})));

function normalizeNewlines(value) {
  return value.replace(/\r\n?/gu, "\n");
}

function bodyAfterPreamble(markdown, label) {
  const normalized = normalizeNewlines(markdown);
  const separator = normalized.indexOf("\n---\n");
  if (separator < 0) {
    throw new Error(label + " must contain a front-matter separator before its learning body.");
  }
  return normalized.slice(separator + "\n---\n".length).trim();
}

function sourceLedgerLink(spec) {
  return "../source-maps/" + basename(spec.candidateSourceLedgerPath);
}

function rewriteSourceLedgerLinks(body, spec) {
  return body.replace(/\.\.\/source-maps\/[^)\s]+/gu, sourceLedgerLink(spec));
}

function withoutCandidateReleaseBoundary(body) {
  return body.replace(/\n## Candidate release boundary[\s\S]*$/u, "").trim();
}

export function canonicalAdvancedReviewBody(markdown, spec) {
  return withoutCandidateReleaseBoundary(
    rewriteSourceLedgerLinks(bodyAfterPreamble(markdown, spec.moduleId + " candidate"), spec),
  );
}

export function renderAdvancedReviewCandidate(authoringMarkdown, spec) {
  const body = rewriteSourceLedgerLinks(
    bodyAfterPreamble(authoringMarkdown, spec.moduleId + " authoring workbook"),
    spec,
  );
  return spec.candidatePreamble + "\n\n---\n\n" + body + "\n\n" + spec.releaseBoundary + "\n";
}

export async function synchronizeAdvancedReviewCandidates(siteRoot = defaultSiteRoot) {
  let changed = 0;
  for (const spec of advancedReviewCandidateSpecs) {
    const authoringMarkdown = await readFile(resolve(siteRoot, spec.authoringPath), "utf8");
    const expected = renderAdvancedReviewCandidate(authoringMarkdown, spec);
    const candidatePath = resolve(siteRoot, spec.candidatePath);
    const current = await readFile(candidatePath, "utf8").catch(() => null);
    if (current !== expected) {
      await writeFile(candidatePath, expected, "utf8");
      changed += 1;
    }
  }
  return changed;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const changed = await synchronizeAdvancedReviewCandidates();
  console.log("Synchronized " + changed + " hidden advanced review candidate(s) from their canonical workbooks.");
}
