import { readdir, readFile } from "node:fs/promises";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  formatMarkupIssues,
  scanEmphasisDensity,
  scanModuleMarkup,
  scanStrippedMathCandidates,
  validateModuleMarkup,
} from "../lib/module-markup-integrity.mjs";
import { buildAtlasFigure } from "../lib/atlas-figure.mjs";
import {
  mermaidAccessibilityMetadataErrors,
  scanMermaidBlocks,
} from "../lib/mermaid-accessibility.mjs";

// Guidance threshold, not a contract. Above roughly this rate the page has so
// much bold that none of it reads as emphasis.
const boldPerThousandWordsAdvisory = 9;

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const defaultSiteRoot = resolve(scriptDirectory, "..");

/**
 * Unlike the Mermaid text-alternative report, this scan covers authoring
 * material as well as the reader manifest. A broken delimiter or a dropped
 * table column is wrong in the source regardless of whether the module has a
 * learner route yet, and M31–M36 are being prepared for exactly that route.
 */
const scannedDirectories = ["content/modules", "content/authoring"];

async function markdownFilesIn(siteRoot, relativeDirectory) {
  const absoluteDirectory = resolve(siteRoot, relativeDirectory);
  const entries = await readdir(absoluteDirectory, { withFileTypes: true }).catch(() => []);
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => resolve(absoluteDirectory, entry.name))
    .sort();
}

export async function scanCourseMarkup({ siteRoot = defaultSiteRoot } = {}) {
  const resolvedSiteRoot = resolve(siteRoot);
  const reports = [];
  for (const relativeDirectory of scannedDirectories) {
    for (const absolutePath of await markdownFilesIn(resolvedSiteRoot, relativeDirectory)) {
      const repositoryPath = relative(resolvedSiteRoot, absolutePath).replaceAll("\\", "/");
      const markdown = await readFile(absolutePath, "utf8");
      const report = scanModuleMarkup(markdown, { sourcePath: repositoryPath });
      report.issues.push(...atlasFigureIssues(markdown));
      reports.push(report);
    }
  }
  return reports;
}

/**
 * An Atlas figure fails closed on two counts: a spec that cannot be laid out
 * would render an error box to the learner, and a figure without an authored
 * text alternative is unusable by a screen reader. Both are caught here rather
 * than at request time.
 */
function atlasFigureIssues(markdown) {
  const issues = [];
  for (const block of scanMermaidBlocks(markdown, { language: "atlas-figure" })) {
    for (const error of mermaidAccessibilityMetadataErrors(block)) {
      issues.push({ line: block.line, kind: "figure-alternative", message: error });
    }
    const built = buildAtlasFigure(block.renderSource);
    if (!built.ok) {
      issues.push({ line: block.line, kind: "figure-spec", message: built.error });
    }
  }
  return issues;
}

export async function scanCourseEmphasis({ siteRoot = defaultSiteRoot } = {}) {
  const resolvedSiteRoot = resolve(siteRoot);
  const reports = [];
  for (const relativeDirectory of scannedDirectories) {
    for (const absolutePath of await markdownFilesIn(resolvedSiteRoot, relativeDirectory)) {
      const repositoryPath = relative(resolvedSiteRoot, absolutePath).replaceAll("\\", "/");
      const markdown = await readFile(absolutePath, "utf8");
      reports.push(scanEmphasisDensity(markdown, { sourcePath: repositoryPath }));
    }
  }
  return reports;
}

export async function validateCourseMarkup({ siteRoot = defaultSiteRoot } = {}) {
  return validateModuleMarkup(await scanCourseMarkup({ siteRoot }));
}

/**
 * A second copy of the workbooks outside `content/modules` is a trap, not a
 * backup: nothing in the build reads it, so edits made there are silently
 * discarded, and it drifts until it misrepresents the course. One such mirror
 * already existed at `../modules` with all thirty files behind canonical.
 *
 * Reported rather than thrown, because the sibling directory is outside this
 * repository and removing it is the course owner's decision.
 */
export async function findDuplicateModuleMirrors({ siteRoot = defaultSiteRoot } = {}) {
  const candidates = [resolve(siteRoot, "..", "modules")];
  const mirrors = [];
  for (const directory of candidates) {
    const entries = await readdir(directory, { withFileTypes: true }).catch(() => []);
    const workbooks = entries.filter(
      (entry) => entry.isFile() && /^\d{2}_.+\.md$/u.test(entry.name),
    );
    if (workbooks.length > 0) {
      mirrors.push({ directory, workbooks: workbooks.length });
    }
  }
  return mirrors;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const reports = await scanCourseMarkup();
  const failures = formatMarkupIssues(reports);
  if (failures.length > 0) {
    console.error(`Module markup: ${failures.length} issue(s) across ${reports.length} documents.`);
    for (const failure of failures) {
      console.error(`- ${failure}`);
    }
    process.exitCode = 1;
  } else {
    console.log(`Module markup: ${reports.length} documents clean (math delimiters, code spans, table structure).`);
  }

  const stripped = [];
  for (const relativeDirectory of scannedDirectories) {
    for (const absolutePath of await markdownFilesIn(defaultSiteRoot, relativeDirectory)) {
      const repositoryPath = relative(defaultSiteRoot, absolutePath).replaceAll("\\", "/");
      const found = scanStrippedMathCandidates(await readFile(absolutePath, "utf8"), {
        sourcePath: repositoryPath,
      });
      stripped.push(...found.candidates.map((candidate) => ({ ...candidate, sourcePath: repositoryPath })));
    }
  }
  if (stripped.length > 0) {
    console.warn(
      `advisory: ${stripped.length} bare "(X)" token(s) in documents that use inline math — check whether the delimiters were stripped.`,
    );
    for (const candidate of stripped.slice(0, 20)) {
      console.warn(`- ${candidate.sourcePath}:${candidate.line} (${candidate.token}) ${candidate.text.slice(0, 70)}`);
    }
  }

  for (const mirror of await findDuplicateModuleMirrors()) {
    console.warn(
      `advisory: ${mirror.workbooks} workbook copies exist at ${mirror.directory}. Nothing in the build reads them, so edits made there are lost. Archive or delete.`,
    );
  }

  const emphasis = (await scanCourseEmphasis())
    .filter((report) => report.boldPerThousandWords > boldPerThousandWordsAdvisory)
    .sort((left, right) => right.boldPerThousandWords - left.boldPerThousandWords);
  if (emphasis.length > 0) {
    console.warn(
      `advisory: ${emphasis.length} document(s) exceed ${boldPerThousandWordsAdvisory} bold runs per 1,000 words of prose.`,
    );
    for (const report of emphasis) {
      console.warn(
        `- ${report.sourcePath}: ${report.boldPerThousandWords}/1k bold, ${report.italic} italic`,
      );
    }
  }
}
