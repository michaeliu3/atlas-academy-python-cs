import { readFile } from "node:fs/promises";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  scanMermaidBlocks,
  validateMermaidAccessibility,
} from "../lib/mermaid-accessibility.mjs";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const defaultSiteRoot = resolve(scriptDirectory, "..");
const manifestRelativePath = "content/modules/manifest.json";

function normalizedModulePath(siteRoot, filename) {
  if (typeof filename !== "string" || !/^[A-Za-z0-9][A-Za-z0-9_.-]*\.md$/u.test(filename)) {
    throw new Error("Module manifest filename must be a simple Markdown filename.");
  }
  const absolutePath = resolve(siteRoot, "content", "modules", filename);
  const repositoryPath = relative(siteRoot, absolutePath).replaceAll("\\", "/");
  if (!repositoryPath.startsWith("content/modules/") || repositoryPath.includes("..")) {
    throw new Error(`Module manifest filename escapes content/modules: ${filename}.`);
  }
  return { absolutePath, repositoryPath };
}

/**
 * Scan the reader manifest only. Hidden authoring material is deliberately
 * outside this report until it is attached to a learner-facing module route.
 */
export async function scanReaderMermaidAlternatives({ siteRoot = defaultSiteRoot } = {}) {
  const resolvedSiteRoot = resolve(siteRoot);
  const manifestPath = resolve(resolvedSiteRoot, manifestRelativePath);
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  if (!Array.isArray(manifest?.modules)) {
    throw new Error("Module manifest must declare a modules array.");
  }

  const blocks = [];
  const modulePaths = [];
  for (const courseModule of manifest.modules) {
    const { absolutePath, repositoryPath } = normalizedModulePath(
      resolvedSiteRoot,
      courseModule?.filename,
    );
    const markdown = await readFile(absolutePath, "utf8");
    modulePaths.push(repositoryPath);
    blocks.push(...scanMermaidBlocks(markdown, { sourcePath: repositoryPath }));
  }

  return { manifestPath, modulePaths, blocks };
}

export async function validateReaderMermaidAlternatives({
  siteRoot = defaultSiteRoot,
  requireComplete = false,
} = {}) {
  const scan = await scanReaderMermaidAlternatives({ siteRoot });
  return {
    ...scan,
    ...validateMermaidAccessibility(scan.blocks, { requireComplete }),
  };
}

function modulesWithIncompleteAlternatives(incompleteBlocks) {
  const counts = new Map();
  for (const block of incompleteBlocks) {
    counts.set(block.sourcePath, (counts.get(block.sourcePath) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort(([first], [second]) => first.localeCompare(second))
    .map(([sourcePath, count]) => `${sourcePath}: ${count}`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const requireComplete = process.argv.includes("--require-complete");
  const report = await validateReaderMermaidAlternatives({ requireComplete });
  const { totalBlocks, completeBlocks, incompleteBlocks } = report.summary;
  console.log(
    `Mermaid text alternatives: ${completeBlocks}/${totalBlocks} complete; ${incompleteBlocks} incomplete.`,
  );
  if (report.incompleteBlocks.length > 0) {
    console.warn("warning: incomplete Mermaid alternatives by module:");
    for (const summary of modulesWithIncompleteAlternatives(report.incompleteBlocks)) {
      console.warn(`- ${summary}`);
    }
  }
}
