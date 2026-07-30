import { createHash } from "node:crypto";
import { access, readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { loadCourseGraph, projectReadableModules } from "./course-graph.mjs";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const siteRoot = resolve(scriptDirectory, "..");
const moduleDirectory = resolve(siteRoot, "content", "modules");
const downloadsDirectory = resolve(siteRoot, "public", "downloads");
const contractPath = resolve(
  siteRoot,
  "content",
  "course",
  "contracts",
  "module-contracts.v1.json",
);
const graphPath = resolve(siteRoot, "content", "course", "course-graph.v1.json");
const manifestPath = resolve(moduleDirectory, "manifest.json");
const moduleContentPath = resolve(moduleDirectory, "module-content.ts");
const releaseInputsPath = resolve(
  siteRoot,
  "content",
  "course",
  "release-inputs.v1.json",
);

function moduleNumber(filename) {
  const match = filename.match(/^(\d{2})_.+\.md$/u);
  return match ? Number(match[1]) : null;
}

function moduleSlug(filename) {
  return filename
    .replace(/\.md$/u, "")
    .replaceAll("_", "-")
    .toLowerCase();
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function plainText(value) {
  return value
    .replace(/^>\s*/gmu, "")
    .replace(/!\[([^\]]*)\]\([^)]+\)/gu, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/gu, "$1")
    .replace(/[`*_~]/gu, "")
    .replace(/<[^>]+>/gu, "")
    .replace(/\s+/gu, " ")
    .trim();
}

function firstSubstantialParagraph(markdown) {
  const lines = markdown.split(/\r?\n/u);
  let inFence = false;
  let paragraph = [];

  for (const line of lines.slice(1)) {
    if (/^```/u.test(line.trim())) {
      inFence = !inFence;
      continue;
    }
    if (inFence || /^#{1,6}\s/u.test(line) || /^\s*[-*+]\s/u.test(line)) {
      continue;
    }
    if (line.trim() === "") {
      const candidate = plainText(paragraph.join(" "));
      if (candidate.length >= 80) {
        return candidate.length > 240
          ? `${candidate.slice(0, 237).trimEnd()}…`
          : candidate;
      }
      paragraph = [];
      continue;
    }
    paragraph.push(line.trim().replace(/^>\s*/u, ""));
  }

  return "A connected workbook for reading, reasoning about, and defending this layer of Atlas.";
}

function normalizeNewlines(value) {
  return value.replace(/\r\n?/gu, "\n");
}

async function writeIfChanged(path, content) {
  const normalizedContent = normalizeNewlines(content);
  const current = await readFile(path, "utf8").catch(() => null);
  if (current !== null && normalizeNewlines(current) === normalizedContent) {
    return false;
  }
  await writeFile(path, normalizedContent);
  return true;
}

function repositoryPath(path) {
  return relative(siteRoot, path).replaceAll("\\", "/");
}

async function listFilesRecursively(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const paths = await Promise.all(
    entries.map(async (entry) => {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) {
        return listFilesRecursively(path);
      }
      return entry.isFile() ? [path] : [];
    }),
  );
  return paths.flat();
}

async function requireFile(path, description) {
  await access(path).catch(() => {
    throw new Error(`${description} is missing: ${repositoryPath(path)}.`);
  });
}

async function releaseInputRecord(path) {
  const content = await readFile(path);
  return {
    path: repositoryPath(path),
    sha256: sha256(content),
  };
}

const courseGraph = await loadCourseGraph();
const projectedModules = projectReadableModules(courseGraph);
const graphByNumber = new Map(
  courseGraph.modules.map((courseModule) => [courseModule.number, courseModule]),
);
const filenames = await readdir(moduleDirectory);
const workbooksByNumber = new Map();

for (const filename of filenames) {
  const number = moduleNumber(filename);
  if (number === null) {
    continue;
  }
  const matching = workbooksByNumber.get(number) ?? [];
  matching.push(filename);
  workbooksByNumber.set(number, matching);
}

const modules = [];
const importLines = [];
const contentEntries = [];
const releaseInputPaths = new Set([graphPath, contractPath]);

for (const projectedModule of projectedModules) {
  const candidates = workbooksByNumber.get(projectedModule.number) ?? [];
  if (candidates.length !== 1) {
    throw new Error(
      `Published Module ${projectedModule.number} must have exactly one checked-in workbook; found ${candidates.length}.`,
    );
  }

  const filename = candidates[0];
  const workbookPath = join(moduleDirectory, filename);
  const graphModule = graphByNumber.get(projectedModule.number);
  if (!graphModule) {
    throw new Error(`Module ${projectedModule.number} is missing from the canonical course graph.`);
  }
  const markdown = normalizeNewlines(await readFile(workbookPath, "utf8"));
  const heading = markdown.match(/^#\s+(.+)$/mu)?.[1]?.trim();
  if (!heading) {
    throw new Error(`${filename} has no level-one title.`);
  }

  const title =
    heading.replace(new RegExp(`^Module\\s+${graphModule.number}\\s+[—–-]\\s*`, "iu"), "").trim() ||
    heading;
  const slug = moduleSlug(filename);
  if (title !== graphModule.title) {
    throw new Error(`Module ${graphModule.number} workbook title does not match the canonical course graph.`);
  }
  if (slug !== graphModule.slug) {
    throw new Error(`Module ${graphModule.number} workbook slug does not match the canonical course graph.`);
  }
  if (!graphModule.sourceMap) {
    throw new Error(`Published Module ${graphModule.number} must declare a source map.`);
  }
  const sourceMapPath = resolve(siteRoot, graphModule.sourceMap);
  await requireFile(sourceMapPath, `Module ${graphModule.number} source map`);
  releaseInputPaths.add(workbookPath);
  releaseInputPaths.add(sourceMapPath);

  const arc = courseGraph.knowledgeArcs.find(({ id }) => id === graphModule.knowledgeArcId);
  if (!arc) {
    throw new Error(`No knowledge arc is configured for Module ${graphModule.number}.`);
  }
  const variableName = `module${String(graphModule.number).padStart(2, "0")}`;
  importLines.push(`import ${variableName} from "./${filename}?raw";`);
  contentEntries.push(`  "${slug}": ${variableName},`);
  modules.push({
    number: graphModule.number,
    slug,
    filename,
    title,
    summary: firstSubstantialParagraph(markdown),
    arcId: arc.id,
    wordCount: markdown.trim().split(/\s+/u).length,
    estimatedMinutes: Math.max(1, Math.ceil(markdown.trim().split(/\s+/u).length / 210)),
    sourceHash: sha256(markdown),
    id: graphModule.id,
    availability: graphModule.availability,
    lifecycle: graphModule.lifecycle,
    routeRole: graphModule.routeRole,
    routePosition: projectedModule.routePosition,
    masteryGateId: graphModule.masteryGateId,
    sourceMap: graphModule.sourceMap,
    studioId: graphModule.studioId,
    releaseEvidence: graphModule.releaseEvidence,
    prerequisiteNumbers: projectedModule.prerequisiteNumbers,
    prerequisiteSlugs: projectedModule.prerequisiteSlugs,
    previousRouteNumber: projectedModule.previousRouteNumber,
    previousSlug: projectedModule.previousSlug,
    nextRouteNumber: projectedModule.nextRouteNumber,
    nextSlug: projectedModule.nextSlug,
  });
}

await requireFile(contractPath, "Module contract registry");
await requireFile(downloadsDirectory, "Local teaching-model directory");
for (const path of await listFilesRecursively(downloadsDirectory)) {
  releaseInputPaths.add(path);
}

const manifest = {
  schemaVersion: 2,
  courseGraphSchemaVersion: courseGraph.schemaVersion,
  routePlanId: courseGraph.routePlan.id,
  moduleCount: modules.length,
  readableModuleCount: modules.filter(({ availability }) => availability === "published").length,
  previewModuleCount: modules.filter(({ availability }) => availability === "preview").length,
  arcs: courseGraph.knowledgeArcs.filter((arc) => modules.some(({ arcId }) => arcId === arc.id)),
  modules,
};
const generatedModuleContent = `${[
  "/* This file is generated by scripts/sync-modules.mjs. Do not edit by hand. */",
  ...importLines,
  "",
  "export const moduleMarkdownBySlug: Readonly<Record<string, string>> = {",
  ...contentEntries,
  "};",
  "",
].join("\n")}`;
const releaseInputs = {
  schemaVersion: 1,
  generatedBy: "scripts/sync-modules.mjs",
  courseGraphSchemaVersion: courseGraph.schemaVersion,
  contractVersion: "v1",
  inputs: await Promise.all(
    [...releaseInputPaths]
      .sort((left, right) => repositoryPath(left).localeCompare(repositoryPath(right)))
      .map(releaseInputRecord),
  ),
};

const changed = await Promise.all([
  writeIfChanged(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`),
  writeIfChanged(moduleContentPath, generatedModuleContent),
  writeIfChanged(releaseInputsPath, `${JSON.stringify(releaseInputs, null, 2)}\n`),
]);
console.log(
  `Synced ${modules.length} modules from checked-in content; ${releaseInputs.inputs.length} hashed release inputs (${changed.filter(Boolean).length} generated files updated).`,
);
