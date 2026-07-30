import { createHash } from "node:crypto";
import {
  access,
  mkdir,
  readdir,
  readFile,
  rm,
  writeFile,
} from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const siteRoot = resolve(scriptDirectory, "..");
const canonicalSourceDirectory = resolve(siteRoot, "..", "modules");
const outputDirectory = resolve(siteRoot, "content", "modules");
const canonicalModule17Reference = resolve(
  siteRoot,
  "..",
  "work",
  "module17_reference_candidate.py",
);
const publishedModule17Reference = resolve(
  siteRoot,
  "public",
  "downloads",
  "module17_reference.py",
);
const canonicalModule18Reference = resolve(
  siteRoot,
  "..",
  "work",
  "module18_reference.py",
);
const publishedModule18Reference = resolve(
  siteRoot,
  "public",
  "downloads",
  "module18_reference.py",
);
const canonicalModule18Tests = resolve(
  siteRoot,
  "..",
  "work",
  "test_module18_reference.py",
);
const publishedModule18Tests = resolve(
  siteRoot,
  "public",
  "downloads",
  "test_module18_reference.py",
);
const canonicalModule19Reference = resolve(
  siteRoot,
  "..",
  "work",
  "module19_reference.py",
);
const publishedModule19Reference = resolve(
  siteRoot,
  "public",
  "downloads",
  "module19_reference.py",
);
const canonicalModule19Tests = resolve(
  siteRoot,
  "..",
  "work",
  "test_module19_reference.py",
);
const publishedModule19Tests = resolve(
  siteRoot,
  "public",
  "downloads",
  "test_module19_reference.py",
);
const canonicalModule20Reference = resolve(
  siteRoot,
  "..",
  "work",
  "module20_reference.py",
);
const publishedModule20Reference = resolve(
  siteRoot,
  "public",
  "downloads",
  "module20_reference.py",
);
const canonicalModule20Tests = resolve(
  siteRoot,
  "..",
  "work",
  "test_module20_reference.py",
);
const publishedModule20Tests = resolve(
  siteRoot,
  "public",
  "downloads",
  "test_module20_reference.py",
);
const sourceDirectory = await access(canonicalSourceDirectory)
  .then(() => canonicalSourceDirectory)
  .catch(() => outputDirectory);
const publishedThrough = 20;
const expectedNumbers = Array.from(
  { length: publishedThrough },
  (_, index) => index + 1,
);

const arcs = [
  {
    id: "arc-i",
    numeral: "I",
    title: "Computation & reasoning",
    range: "Modules 1–5",
    description:
      "Build the execution, abstraction, proof, and cost models that every later system depends on.",
    start: 1,
    end: 5,
  },
  {
    id: "arc-ii",
    numeral: "II",
    title: "Data & algorithms",
    range: "Modules 6–11",
    description:
      "Connect representation choices to operations, invariants, performance, and algorithmic strategy.",
    start: 6,
    end: 11,
  },
  {
    id: "arc-iii",
    numeral: "III",
    title: "Durable software",
    range: "Modules 12–16",
    description:
      "Turn local reasoning into stable APIs, evidence, maintainable architecture, delivery, and transactions.",
    start: 12,
    end: 16,
  },
  {
    id: "arc-iv",
    numeral: "IV",
    title: "Machine & network",
    range: "Modules 17–22",
    description:
      "Modules 17–20 connect machine execution and OS mediation to explicit concurrent histories, synchronization, progress, deterministic reduction, and evidence-aware network protocols.",
    start: 17,
    end: 22,
  },
];

function moduleNumber(filename) {
  const match = filename.match(/^(\d{2})_.+\.md$/);
  return match ? Number(match[1]) : null;
}

function moduleSlug(filename) {
  return filename
    .replace(/\.md$/u, "")
    .replaceAll("_", "-")
    .toLowerCase();
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

function writeIfChanged(path, content) {
  return readFile(path, "utf8")
    .catch(() => null)
    .then((current) => (current === content ? false : writeFile(path, content).then(() => true)));
}

await mkdir(outputDirectory, { recursive: true });

const sourceFiles = (await readdir(sourceDirectory))
  .filter((filename) => moduleNumber(filename) !== null)
  .sort((left, right) => moduleNumber(left) - moduleNumber(right));

const selectedFiles = sourceFiles.filter((filename) =>
  expectedNumbers.includes(moduleNumber(filename)),
);
const selectedNumbers = selectedFiles.map(moduleNumber);

if (
  selectedNumbers.length !== expectedNumbers.length ||
  selectedNumbers.some((number, index) => number !== expectedNumbers[index])
) {
  throw new Error(
    `Expected exactly Modules 1–${publishedThrough} in ${sourceDirectory}; found ${selectedNumbers.join(", ")}.`,
  );
}

const existingDerived = (await readdir(outputDirectory)).filter((filename) =>
  filename.endsWith(".md"),
);
const selectedSet = new Set(selectedFiles);
for (const staleFilename of existingDerived) {
  if (!selectedSet.has(staleFilename)) {
    await rm(join(outputDirectory, staleFilename));
  }
}

const modules = [];
const importLines = [];
const contentEntries = [];
let changedFiles = 0;

await mkdir(dirname(publishedModule17Reference), { recursive: true });
const module17ReferenceSource = await access(canonicalModule17Reference)
  .then(() => canonicalModule17Reference)
  .catch(() => publishedModule17Reference);
const module17Reference = await readFile(module17ReferenceSource, "utf8");
if (
  await writeIfChanged(
    publishedModule17Reference,
    module17Reference,
  )
) {
  changedFiles += 1;
}

const module18ReferenceSource = await access(canonicalModule18Reference)
  .then(() => canonicalModule18Reference)
  .catch(() => publishedModule18Reference);
const module18Reference = await readFile(module18ReferenceSource, "utf8");
if (
  await writeIfChanged(
    publishedModule18Reference,
    module18Reference,
  )
) {
  changedFiles += 1;
}

const module18TestsSource = await access(canonicalModule18Tests)
  .then(() => canonicalModule18Tests)
  .catch(() => publishedModule18Tests);
const module18Tests = await readFile(module18TestsSource, "utf8");
if (
  await writeIfChanged(
    publishedModule18Tests,
    module18Tests,
  )
) {
  changedFiles += 1;
}

const module19ReferenceSource = await access(canonicalModule19Reference)
  .then(() => canonicalModule19Reference)
  .catch(() => publishedModule19Reference);
const module19Reference = await readFile(module19ReferenceSource, "utf8");
if (
  await writeIfChanged(
    publishedModule19Reference,
    module19Reference,
  )
) {
  changedFiles += 1;
}

const module19TestsSource = await access(canonicalModule19Tests)
  .then(() => canonicalModule19Tests)
  .catch(() => publishedModule19Tests);
const module19Tests = await readFile(module19TestsSource, "utf8");
if (
  await writeIfChanged(
    publishedModule19Tests,
    module19Tests,
  )
) {
  changedFiles += 1;
}

const module20ReferenceSource = await access(canonicalModule20Reference)
  .then(() => canonicalModule20Reference)
  .catch(() => publishedModule20Reference);
const module20Reference = await readFile(module20ReferenceSource, "utf8");
if (
  await writeIfChanged(
    publishedModule20Reference,
    module20Reference,
  )
) {
  changedFiles += 1;
}

const module20TestsSource = await access(canonicalModule20Tests)
  .then(() => canonicalModule20Tests)
  .catch(() => publishedModule20Tests);
const module20Tests = await readFile(module20TestsSource, "utf8");
if (
  await writeIfChanged(
    publishedModule20Tests,
    module20Tests,
  )
) {
  changedFiles += 1;
}

for (const filename of selectedFiles) {
  const number = moduleNumber(filename);
  const markdown = await readFile(join(sourceDirectory, filename), "utf8");
  const heading = markdown.match(/^#\s+(.+)$/mu)?.[1]?.trim();
  if (!heading) {
    throw new Error(`${filename} has no level-one title.`);
  }

  const title =
    heading.replace(new RegExp(`^Module\\s+${number}\\s+[—–-]\\s*`, "iu"), "").trim() ||
    heading;
  const slug = moduleSlug(filename);
  const arc = arcs.find(({ start, end }) => number >= start && number <= end);
  if (!arc) {
    throw new Error(`No arc is configured for Module ${number}.`);
  }

  if (await writeIfChanged(join(outputDirectory, filename), markdown)) {
    changedFiles += 1;
  }

  const previousFilename = selectedFiles[number - 2] ?? null;
  const nextFilename = selectedFiles[number] ?? null;
  const variableName = `module${String(number).padStart(2, "0")}`;
  importLines.push(`import ${variableName} from "./${filename}?raw";`);
  contentEntries.push(`  "${slug}": ${variableName},`);

  modules.push({
    number,
    slug,
    filename,
    title,
    summary: firstSubstantialParagraph(markdown),
    arcId: arc.id,
    wordCount: markdown.trim().split(/\s+/u).length,
    estimatedMinutes: Math.max(
      1,
      Math.ceil(markdown.trim().split(/\s+/u).length / 210),
    ),
    sourceHash: createHash("sha256").update(markdown).digest("hex"),
    prerequisiteSlug: previousFilename ? moduleSlug(previousFilename) : null,
    previousSlug: previousFilename ? moduleSlug(previousFilename) : null,
    nextSlug: nextFilename ? moduleSlug(nextFilename) : null,
  });
}

const manifest = {
  schemaVersion: 1,
  moduleCount: modules.length,
  arcs: arcs.map((arc) => ({
    id: arc.id,
    numeral: arc.numeral,
    title: arc.title,
    range: arc.range,
    description: arc.description,
  })),
  modules,
};

const manifestContent = `${JSON.stringify(manifest, null, 2)}\n`;
const generatedModuleContent = `${[
  "/* This file is generated by scripts/sync-modules.mjs. Do not edit by hand. */",
  ...importLines,
  "",
  "export const moduleMarkdownBySlug: Readonly<Record<string, string>> = {",
  ...contentEntries,
  "};",
  "",
].join("\n")}`;

if (await writeIfChanged(join(outputDirectory, "manifest.json"), manifestContent)) {
  changedFiles += 1;
}
if (
  await writeIfChanged(
    join(outputDirectory, "module-content.ts"),
    generatedModuleContent,
  )
) {
  changedFiles += 1;
}

const sourceLabel = relative(siteRoot, sourceDirectory).replaceAll("\\", "/");
const outputLabel = relative(siteRoot, outputDirectory).replaceAll("\\", "/");
console.log(
  `Synced ${modules.length} modules from ${sourceLabel} to ${outputLabel} (${changedFiles} files updated).`,
);
