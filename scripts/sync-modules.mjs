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
const canonicalModule21Reference = resolve(
  siteRoot,
  "..",
  "work",
  "module21_reference.py",
);
const publishedModule21Reference = resolve(
  siteRoot,
  "public",
  "downloads",
  "module21_reference.py",
);
const canonicalModule21Tests = resolve(
  siteRoot,
  "..",
  "work",
  "test_module21_reference.py",
);
const publishedModule21Tests = resolve(
  siteRoot,
  "public",
  "downloads",
  "test_module21_reference.py",
);
const canonicalModule22Reference = resolve(
  siteRoot,
  "..",
  "work",
  "module22_reference.py",
);
const publishedModule22Reference = resolve(
  siteRoot,
  "public",
  "downloads",
  "module22_reference.py",
);
const canonicalModule22Tests = resolve(
  siteRoot,
  "..",
  "work",
  "test_module22_reference.py",
);
const publishedModule22Tests = resolve(
  siteRoot,
  "public",
  "downloads",
  "test_module22_reference.py",
);
const canonicalModule23Reference = resolve(
  siteRoot,
  "..",
  "work",
  "module23_reference.py",
);
const publishedModule23Reference = resolve(
  siteRoot,
  "public",
  "downloads",
  "module23_reference.py",
);
const canonicalModule23Tests = resolve(
  siteRoot,
  "..",
  "work",
  "test_module23_reference.py",
);
const publishedModule23Tests = resolve(
  siteRoot,
  "public",
  "downloads",
  "test_module23_reference.py",
);
const canonicalModule24Reference = resolve(
  siteRoot,
  "..",
  "work",
  "module24_reference.py",
);
const publishedModule24Reference = resolve(
  siteRoot,
  "public",
  "downloads",
  "module24_reference.py",
);
const canonicalModule24Tests = resolve(
  siteRoot,
  "..",
  "work",
  "test_module24_reference.py",
);
const publishedModule24Tests = resolve(
  siteRoot,
  "public",
  "downloads",
  "test_module24_reference.py",
);
const canonicalModule25Reference = resolve(
  siteRoot,
  "..",
  "work",
  "module25_reference.py",
);
const publishedModule25Reference = resolve(
  siteRoot,
  "public",
  "downloads",
  "module25_reference.py",
);
const canonicalModule25Tests = resolve(
  siteRoot,
  "..",
  "work",
  "test_module25_reference.py",
);
const publishedModule25Tests = resolve(
  siteRoot,
  "public",
  "downloads",
  "test_module25_reference.py",
);
const canonicalModule26Reference = resolve(
  siteRoot,
  "..",
  "work",
  "module26_reference.py",
);
const publishedModule26Reference = resolve(
  siteRoot,
  "public",
  "downloads",
  "module26_reference.py",
);
const canonicalModule26Tests = resolve(
  siteRoot,
  "..",
  "work",
  "test_module26_reference.py",
);
const publishedModule26Tests = resolve(
  siteRoot,
  "public",
  "downloads",
  "test_module26_reference.py",
);
const canonicalModule27Reference = resolve(
  siteRoot,
  "..",
  "work",
  "module27_reference.py",
);
const publishedModule27Reference = resolve(
  siteRoot,
  "public",
  "downloads",
  "module27_reference.py",
);
const canonicalModule27Tests = resolve(
  siteRoot,
  "..",
  "work",
  "test_module27_reference.py",
);
const publishedModule27Tests = resolve(
  siteRoot,
  "public",
  "downloads",
  "test_module27_reference.py",
);
const canonicalModule28Reference = resolve(
  siteRoot,
  "..",
  "work",
  "module28_reference.py",
);
const publishedModule28Reference = resolve(
  siteRoot,
  "public",
  "downloads",
  "module28_reference.py",
);
const canonicalModule28Tests = resolve(
  siteRoot,
  "..",
  "work",
  "test_module28_reference.py",
);
const publishedModule28Tests = resolve(
  siteRoot,
  "public",
  "downloads",
  "test_module28_reference.py",
);
const canonicalModule29Reference = resolve(
  siteRoot,
  "..",
  "work",
  "module29_reference.py",
);
const publishedModule29Reference = resolve(
  siteRoot,
  "public",
  "downloads",
  "module29_reference.py",
);
const canonicalModule29Tests = resolve(
  siteRoot,
  "..",
  "work",
  "test_module29_reference.py",
);
const publishedModule29Tests = resolve(
  siteRoot,
  "public",
  "downloads",
  "test_module29_reference.py",
);
const canonicalModule29SourceMap = resolve(
  siteRoot,
  "..",
  "research",
  "module29_calculus_real_analysis_continuous_change_source_map.md",
);
const publishedModule29SourceMap = resolve(
  siteRoot,
  "public",
  "downloads",
  "module29_calculus_real_analysis_continuous_change_source_map.md",
);
const canonicalModule29SourceAudit = resolve(
  siteRoot,
  "..",
  "research",
  "module29_calculus_real_analysis_source_audit_addendum.md",
);
const publishedModule29SourceAudit = resolve(
  siteRoot,
  "public",
  "downloads",
  "module29_calculus_real_analysis_source_audit_addendum.md",
);
const canonicalResearchDirectory = resolve(siteRoot, "..", "research");
const sourceMapOutputDirectory = resolve(siteRoot, "content", "source-maps");
const sourceDirectory = await access(canonicalSourceDirectory)
  .then(() => canonicalSourceDirectory)
  .catch(() => outputDirectory);
const sourceMapDirectory = await access(canonicalResearchDirectory)
  .then(() => canonicalResearchDirectory)
  .catch(() => sourceMapOutputDirectory);
const publishedThrough = 29;
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
      "Modules 17–22 connect machine execution and OS mediation to explicit concurrent histories, bounded async ownership, evidence-aware protocols, partial failure, causal order, and then security, privacy, trust, and provenance boundaries.",
    start: 17,
    end: 22,
  },
  {
    id: "arc-v",
    numeral: "V",
    title: "Languages & intelligence",
    range: "Modules 23–26",
    description:
      "Derive language meaning and runtime evidence, then apply AI-era judgment and human-centered design in an integrated Atlas defense.",
    start: 23,
    end: 26,
  },
  {
    id: "arc-vi",
    numeral: "VI",
    title: "Mathematical foundations",
    range: "Modules 27–29",
    description:
      "Deepen proof, counting, structure, linear representation, numerical claim boundaries, and continuous change before the later mathematics and AI sequence.",
    start: 27,
    end: 29,
  },
];

// Stable module IDs are numeric for release continuity. Learner navigation must
// instead follow the prerequisite-first 60-day route, which inserts M27 after M5
// and M28/M29 after M17 (while preserving M29's direct M27/M28 prerequisites).
const learnerRouteOrder = [
  1, 2, 3, 4, 5, 27, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 28, 29, 18,
  19, 20, 21, 22, 23, 24, 25, 26,
];

const directPrerequisiteNumbers = new Map([
  [27, [2, 4, 5]],
  [28, [17, 27]],
  [29, [27, 28]],
]);

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

function normalizeNewlines(value) {
  return value.replace(/\r\n?/gu, "\n");
}

function writeIfChanged(path, content) {
  const normalizedContent = normalizeNewlines(content);
  return readFile(path, "utf8")
    .catch(() => null)
    .then((current) =>
      current !== null && normalizeNewlines(current) === normalizedContent
        ? false
        : writeFile(path, normalizedContent).then(() => true),
    );
}

await mkdir(outputDirectory, { recursive: true });
await mkdir(sourceMapOutputDirectory, { recursive: true });

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

if (
  learnerRouteOrder.length !== selectedNumbers.length ||
  new Set(learnerRouteOrder).size !== learnerRouteOrder.length ||
  learnerRouteOrder.some((number) => !selectedNumbers.includes(number))
) {
  throw new Error(
    "Learner route order must contain every published module exactly once.",
  );
}

const selectedFileByNumber = new Map(
  selectedFiles.map((filename) => [moduleNumber(filename), filename]),
);

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

const sourceMapFiles = (await readdir(sourceMapDirectory))
  .filter((filename) => filename.endsWith(".md"))
  .sort();
const sourceMapSet = new Set(sourceMapFiles);
const existingSourceMaps = (await readdir(sourceMapOutputDirectory)).filter(
  (filename) => filename.endsWith(".md"),
);
for (const staleFilename of existingSourceMaps) {
  if (!sourceMapSet.has(staleFilename)) {
    await rm(join(sourceMapOutputDirectory, staleFilename));
    changedFiles += 1;
  }
}
for (const filename of sourceMapFiles) {
  const sourceMap = await readFile(join(sourceMapDirectory, filename), "utf8");
  if (await writeIfChanged(join(sourceMapOutputDirectory, filename), sourceMap)) {
    changedFiles += 1;
  }
}

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

const module21ReferenceSource = await access(canonicalModule21Reference)
  .then(() => canonicalModule21Reference)
  .catch(() => publishedModule21Reference);
const module21Reference = await readFile(module21ReferenceSource, "utf8");
if (
  await writeIfChanged(
    publishedModule21Reference,
    module21Reference,
  )
) {
  changedFiles += 1;
}

const module21TestsSource = await access(canonicalModule21Tests)
  .then(() => canonicalModule21Tests)
  .catch(() => publishedModule21Tests);
const module21Tests = await readFile(module21TestsSource, "utf8");
if (
  await writeIfChanged(
    publishedModule21Tests,
    module21Tests,
  )
) {
  changedFiles += 1;
}

const module22ReferenceSource = await access(canonicalModule22Reference)
  .then(() => canonicalModule22Reference)
  .catch(() => publishedModule22Reference);
const module22Reference = await readFile(module22ReferenceSource, "utf8");
if (
  await writeIfChanged(
    publishedModule22Reference,
    module22Reference,
  )
) {
  changedFiles += 1;
}

const module22TestsSource = await access(canonicalModule22Tests)
  .then(() => canonicalModule22Tests)
  .catch(() => publishedModule22Tests);
const module22Tests = await readFile(module22TestsSource, "utf8");
if (
  await writeIfChanged(
    publishedModule22Tests,
    module22Tests,
  )
) {
  changedFiles += 1;
}

const module23ReferenceSource = await access(canonicalModule23Reference)
  .then(() => canonicalModule23Reference)
  .catch(() => publishedModule23Reference);
const module23Reference = await readFile(module23ReferenceSource, "utf8");
if (
  await writeIfChanged(
    publishedModule23Reference,
    module23Reference,
  )
) {
  changedFiles += 1;
}

const module23TestsSource = await access(canonicalModule23Tests)
  .then(() => canonicalModule23Tests)
  .catch(() => publishedModule23Tests);
const module23Tests = await readFile(module23TestsSource, "utf8");
if (
  await writeIfChanged(
    publishedModule23Tests,
    module23Tests,
  )
) {
  changedFiles += 1;
}

const module24ReferenceSource = await access(canonicalModule24Reference)
  .then(() => canonicalModule24Reference)
  .catch(() => publishedModule24Reference);
const module24Reference = await readFile(module24ReferenceSource, "utf8");
if (
  await writeIfChanged(
    publishedModule24Reference,
    module24Reference,
  )
) {
  changedFiles += 1;
}

const module24TestsSource = await access(canonicalModule24Tests)
  .then(() => canonicalModule24Tests)
  .catch(() => publishedModule24Tests);
const module24Tests = await readFile(module24TestsSource, "utf8");
if (
  await writeIfChanged(
    publishedModule24Tests,
    module24Tests,
  )
) {
  changedFiles += 1;
}

const module25ReferenceSource = await access(canonicalModule25Reference)
  .then(() => canonicalModule25Reference)
  .catch(() => publishedModule25Reference);
const module25Reference = await readFile(module25ReferenceSource, "utf8");
if (
  await writeIfChanged(
    publishedModule25Reference,
    module25Reference,
  )
) {
  changedFiles += 1;
}

const module25TestsSource = await access(canonicalModule25Tests)
  .then(() => canonicalModule25Tests)
  .catch(() => publishedModule25Tests);
const module25Tests = await readFile(module25TestsSource, "utf8");
if (
  await writeIfChanged(
    publishedModule25Tests,
    module25Tests,
  )
) {
  changedFiles += 1;
}

const module26ReferenceSource = await access(canonicalModule26Reference)
  .then(() => canonicalModule26Reference)
  .catch(() => publishedModule26Reference);
const module26Reference = await readFile(module26ReferenceSource, "utf8");
if (
  await writeIfChanged(
    publishedModule26Reference,
    module26Reference,
  )
) {
  changedFiles += 1;
}

const module26TestsSource = await access(canonicalModule26Tests)
  .then(() => canonicalModule26Tests)
  .catch(() => publishedModule26Tests);
const module26Tests = await readFile(module26TestsSource, "utf8");
if (
  await writeIfChanged(
    publishedModule26Tests,
    module26Tests,
  )
) {
  changedFiles += 1;
}

const module27ReferenceSource = await access(canonicalModule27Reference)
  .then(() => canonicalModule27Reference)
  .catch(() => publishedModule27Reference);
const module27Reference = await readFile(module27ReferenceSource, "utf8");
if (
  await writeIfChanged(
    publishedModule27Reference,
    module27Reference,
  )
) {
  changedFiles += 1;
}

const module27TestsSource = await access(canonicalModule27Tests)
  .then(() => canonicalModule27Tests)
  .catch(() => publishedModule27Tests);
const module27Tests = await readFile(module27TestsSource, "utf8");
if (
  await writeIfChanged(
    publishedModule27Tests,
    module27Tests,
  )
) {
  changedFiles += 1;
}

const module28ReferenceSource = await access(canonicalModule28Reference)
  .then(() => canonicalModule28Reference)
  .catch(() => publishedModule28Reference);
const module28Reference = await readFile(module28ReferenceSource, "utf8");
if (
  await writeIfChanged(
    publishedModule28Reference,
    module28Reference,
  )
) {
  changedFiles += 1;
}

const module28TestsSource = await access(canonicalModule28Tests)
  .then(() => canonicalModule28Tests)
  .catch(() => publishedModule28Tests);
const module28Tests = await readFile(module28TestsSource, "utf8");
if (
  await writeIfChanged(
    publishedModule28Tests,
    module28Tests,
  )
) {
  changedFiles += 1;
}

const module29ReferenceSource = await access(canonicalModule29Reference)
  .then(() => canonicalModule29Reference)
  .catch(() => publishedModule29Reference);
const module29Reference = await readFile(module29ReferenceSource, "utf8");
if (
  await writeIfChanged(
    publishedModule29Reference,
    module29Reference,
  )
) {
  changedFiles += 1;
}

const module29TestsSource = await access(canonicalModule29Tests)
  .then(() => canonicalModule29Tests)
  .catch(() => publishedModule29Tests);
const module29Tests = await readFile(module29TestsSource, "utf8");
if (
  await writeIfChanged(
    publishedModule29Tests,
    module29Tests,
  )
) {
  changedFiles += 1;
}

const module29SourceMapSource = await access(canonicalModule29SourceMap)
  .then(() => canonicalModule29SourceMap)
  .catch(() => publishedModule29SourceMap);
const module29SourceMap = await readFile(module29SourceMapSource, "utf8");
if (
  await writeIfChanged(
    publishedModule29SourceMap,
    module29SourceMap,
  )
) {
  changedFiles += 1;
}

const module29SourceAuditSource = await access(canonicalModule29SourceAudit)
  .then(() => canonicalModule29SourceAudit)
  .catch(() => publishedModule29SourceAudit);
const module29SourceAudit = await readFile(module29SourceAuditSource, "utf8");
if (
  await writeIfChanged(
    publishedModule29SourceAudit,
    module29SourceAudit,
  )
) {
  changedFiles += 1;
}

for (const filename of selectedFiles) {
  const number = moduleNumber(filename);
  const markdown = normalizeNewlines(
    await readFile(join(sourceDirectory, filename), "utf8"),
  );
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

  const learnerRouteIndex = learnerRouteOrder.indexOf(number);
  const previousFilename =
    learnerRouteIndex > 0
      ? selectedFileByNumber.get(learnerRouteOrder[learnerRouteIndex - 1]) ?? null
      : null;
  const nextFilename =
    learnerRouteIndex < learnerRouteOrder.length - 1
      ? selectedFileByNumber.get(learnerRouteOrder[learnerRouteIndex + 1]) ?? null
      : null;
  const prerequisiteNumbers =
    directPrerequisiteNumbers.get(number) ??
    (previousFilename ? [learnerRouteOrder[learnerRouteIndex - 1]] : []);
  const prerequisiteSlugs = prerequisiteNumbers.map((prerequisiteNumber) => {
    const prerequisiteFilename = selectedFileByNumber.get(prerequisiteNumber);
    if (!prerequisiteFilename) {
      throw new Error(
        "Module " + number + " requires unpublished Module " + prerequisiteNumber + ".",
      );
    }
    return moduleSlug(prerequisiteFilename);
  });
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
    prerequisiteSlug: prerequisiteSlugs.at(-1) ?? null,
    prerequisiteSlugs,
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
const sourceMapLabel = relative(siteRoot, sourceMapDirectory).replaceAll("\\", "/");
console.log(
  "Synced " +
    modules.length +
    " modules from " +
    sourceLabel +
    " to " +
    outputLabel +
    "; " +
    sourceMapFiles.length +
    " source maps from " +
    sourceMapLabel +
    " (" +
    changedFiles +
    " files updated).",
);
