import { lstat, readFile, readdir } from "node:fs/promises";
import { dirname, isAbsolute, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const siteRoot = resolve(scriptDirectory, "..");

export const clientPerformanceBudgetPolicyRelativePath =
  "content/course/client-performance-budget.v1.json";

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function requireString(value, label) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${label} must be a non-empty string.`);
  }
  return value;
}

function requirePositiveInteger(value, label) {
  if (!Number.isSafeInteger(value) || value < 1) {
    throw new Error(`${label} must be a positive integer.`);
  }
  return value;
}

function requireObject(value, label) {
  if (!isPlainObject(value)) {
    throw new Error(`${label} must be an object.`);
  }
  return value;
}

function requireArray(value, label) {
  if (!Array.isArray(value)) {
    throw new Error(`${label} must be an array.`);
  }
  return value;
}

function requireStringArray(value, label) {
  const values = requireArray(value, label);
  if (values.length === 0 || values.some((item) => typeof item !== "string" || item.trim() === "")) {
    throw new Error(`${label} must be a non-empty array of non-empty strings.`);
  }
  return values;
}

function formatBytes(value) {
  return `${value.toLocaleString("en-US")} B`;
}

function normalizeOutputPath(value, label) {
  const path = requireString(value, label).replaceAll("\\", "/");
  if (
    isAbsolute(path) ||
    path.startsWith("/") ||
    path.split("/").includes("..") ||
    path.split("/").includes("")
  ) {
    throw new Error(`${label} must be a relative output path without traversal.`);
  }
  return path;
}

function normalizePolicy(policy) {
  const root = requireObject(policy, "Performance-budget policy");
  if (root.schemaVersion !== 1) {
    throw new Error("Performance-budget policy schemaVersion must be 1.");
  }

  const output = requireObject(root.output, "Performance-budget policy output");
  const measurement = requireObject(
    root.measurement,
    "Performance-budget policy measurement boundary",
  );
  const limits = requireObject(root.limits, "Performance-budget policy limits");
  const initialEntry = requireObject(limits.initialEntry, "Performance-budget initialEntry");
  const studios = requireObject(limits.studios, "Performance-budget studios");
  const studioEntries = requireArray(studios.entries, "Performance-budget studio entries");

  const normalizedStudioEntries = studioEntries.map((entry, index) => {
    const normalizedEntry = requireObject(entry, `Performance-budget studio entry ${index + 1}`);
    return {
      studioId: requireString(
        normalizedEntry.studioId,
        `Performance-budget studio entry ${index + 1} studioId`,
      ),
      manifestName: requireString(
        normalizedEntry.manifestName,
        `Performance-budget studio entry ${index + 1} manifestName`,
      ),
    };
  });
  if (new Set(normalizedStudioEntries.map(({ studioId }) => studioId)).size !== normalizedStudioEntries.length) {
    throw new Error("Performance-budget studio entry ids must be unique.");
  }
  if (new Set(normalizedStudioEntries.map(({ manifestName }) => manifestName)).size !== normalizedStudioEntries.length) {
    throw new Error("Performance-budget studio manifest names must be unique.");
  }

  return {
    schemaVersion: root.schemaVersion,
    policyVersion: requireString(root.policyVersion, "Performance-budget policyVersion"),
    description: requireString(root.description, "Performance-budget description"),
    measurement: {
      unit: requireString(measurement.unit, "Performance-budget measurement unit"),
      includes: requireStringArray(
        measurement.includes,
        "Performance-budget measurement includes",
      ),
      doesNotMeasure: requireStringArray(
        measurement.doesNotMeasure,
        "Performance-budget measurement doesNotMeasure",
      ),
    },
    output: {
      clientDirectory: normalizeOutputPath(
        output.clientDirectory,
        "Performance-budget output clientDirectory",
      ),
      assetDirectory: normalizeOutputPath(
        output.assetDirectory,
        "Performance-budget output assetDirectory",
      ),
      manifestPath: normalizeOutputPath(
        output.manifestPath,
        "Performance-budget output manifestPath",
      ),
    },
    limits: {
      maxClientAssetBytes: requirePositiveInteger(
        limits.maxClientAssetBytes,
        "Performance-budget maxClientAssetBytes",
      ),
      maxClientAssetCount: requirePositiveInteger(
        limits.maxClientAssetCount,
        "Performance-budget maxClientAssetCount",
      ),
      maxSingleAssetBytes: requirePositiveInteger(
        limits.maxSingleAssetBytes,
        "Performance-budget maxSingleAssetBytes",
      ),
      initialEntry: {
        manifestKey: requireString(
          initialEntry.manifestKey,
          "Performance-budget initialEntry manifestKey",
        ),
        maxStaticClosureBytes: requirePositiveInteger(
          initialEntry.maxStaticClosureBytes,
          "Performance-budget initialEntry maxStaticClosureBytes",
        ),
      },
      studios: {
        maxOwnEntryBytes: requirePositiveInteger(
          studios.maxOwnEntryBytes,
          "Performance-budget studio maxOwnEntryBytes",
        ),
        maxStaticClosureBytes: requirePositiveInteger(
          studios.maxStaticClosureBytes,
          "Performance-budget studio maxStaticClosureBytes",
        ),
        entries: normalizedStudioEntries,
      },
    },
  };
}

async function loadPolicy(root) {
  const policyPath = resolve(root, clientPerformanceBudgetPolicyRelativePath);
  const rawPolicy = await readFile(policyPath, "utf8").catch((error) => {
    throw new Error(`Cannot read client performance-budget policy: ${error.message}`);
  });
  let parsedPolicy;
  try {
    parsedPolicy = JSON.parse(rawPolicy);
  } catch (error) {
    throw new Error(`Client performance-budget policy is not valid JSON: ${error.message}`);
  }
  return normalizePolicy(parsedPolicy);
}

function ensureInside(root, candidate, label) {
  const rel = relative(root, candidate);
  if (
    rel === "" ||
    rel === ".." ||
    rel.startsWith("..\\") ||
    rel.startsWith("../") ||
    isAbsolute(rel)
  ) {
    throw new Error(`${label} escapes the built client output.`);
  }
  return candidate;
}

function resolveOutputFile(clientDirectory, outputPath, label) {
  const normalizedPath = normalizeOutputPath(outputPath, label);
  return ensureInside(clientDirectory, resolve(clientDirectory, normalizedPath), label);
}

async function listRegularFiles(directory, label) {
  const entries = await readdir(directory, { withFileTypes: true }).catch((error) => {
    throw new Error(`Cannot inspect ${label}: ${error.message}`);
  });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isSymbolicLink()) {
      throw new Error(`${label} must not contain symbolic links: ${path}.`);
    }
    if (entry.isDirectory()) {
      files.push(...(await listRegularFiles(path, label)));
      continue;
    }
    if (!entry.isFile()) {
      throw new Error(`${label} must contain only regular files: ${path}.`);
    }
    files.push(path);
  }
  return files;
}

async function readManifest(clientDirectory, manifestPath) {
  const absoluteManifestPath = resolveOutputFile(
    clientDirectory,
    manifestPath,
    "Performance-budget manifest path",
  );
  const rawManifest = await readFile(absoluteManifestPath, "utf8").catch((error) => {
    throw new Error(`Cannot read built client manifest: ${error.message}`);
  });
  let manifest;
  try {
    manifest = JSON.parse(rawManifest);
  } catch (error) {
    throw new Error(`Built client manifest is not valid JSON: ${error.message}`);
  }
  if (!isPlainObject(manifest)) {
    throw new Error("Built client manifest must be an object.");
  }
  return manifest;
}

function getManifestEntry(manifest, key) {
  const entry = manifest[key];
  if (!isPlainObject(entry)) {
    throw new Error(`Built client manifest is missing a usable entry for ${key}.`);
  }
  return entry;
}

function getManifestList(entry, field, key) {
  if (entry[field] === undefined) {
    return [];
  }
  if (!Array.isArray(entry[field]) || entry[field].some((value) => typeof value !== "string")) {
    throw new Error(`Built client manifest entry ${key} has an invalid ${field} list.`);
  }
  return entry[field];
}

function getManifestFile(entry, key) {
  return normalizeOutputPath(entry.file, `Built client manifest entry ${key} file`);
}

function getManifestCssFiles(entry, key) {
  return getManifestList(entry, "css", key).map((path, index) =>
    normalizeOutputPath(path, `Built client manifest entry ${key} css ${index + 1}`),
  );
}

async function getFileSize(clientDirectory, outputPath, fileSizes) {
  if (fileSizes.has(outputPath)) {
    return fileSizes.get(outputPath);
  }
  const absolutePath = resolveOutputFile(
    clientDirectory,
    outputPath,
    `Built client manifest output ${outputPath}`,
  );
  const stats = await lstat(absolutePath).catch((error) => {
    throw new Error(`Cannot inspect built client manifest output ${outputPath}: ${error.message}`);
  });
  if (!stats.isFile() || stats.isSymbolicLink()) {
    throw new Error(`Built client manifest output must be a regular file: ${outputPath}.`);
  }
  fileSizes.set(outputPath, stats.size);
  return stats.size;
}

function collectStaticEntryKeys(manifest, entryKey) {
  const entryKeys = new Set();
  function visit(key) {
    if (entryKeys.has(key)) {
      return;
    }
    entryKeys.add(key);
    const entry = getManifestEntry(manifest, key);
    for (const importedKey of getManifestList(entry, "imports", key)) {
      visit(importedKey);
    }
  }
  visit(entryKey);
  return entryKeys;
}

function collectReachableEntryKeys(manifest, entryKey) {
  const entryKeys = new Set();
  function visit(key) {
    if (entryKeys.has(key)) {
      return;
    }
    entryKeys.add(key);
    const entry = getManifestEntry(manifest, key);
    for (const importedKey of [
      ...getManifestList(entry, "imports", key),
      ...getManifestList(entry, "dynamicImports", key),
    ]) {
      visit(importedKey);
    }
  }
  visit(entryKey);
  return entryKeys;
}

async function measureEntryClosure({ clientDirectory, manifest, entryKeys, fileSizes }) {
  const outputPaths = new Set();
  for (const key of entryKeys) {
    const entry = getManifestEntry(manifest, key);
    outputPaths.add(getManifestFile(entry, key));
    for (const cssPath of getManifestCssFiles(entry, key)) {
      outputPaths.add(cssPath);
    }
  }
  let totalBytes = 0;
  for (const outputPath of outputPaths) {
    totalBytes += await getFileSize(clientDirectory, outputPath, fileSizes);
  }
  return { totalBytes, outputPaths };
}

async function measureOwnEntry({ clientDirectory, manifest, entryKey, fileSizes }) {
  const entry = getManifestEntry(manifest, entryKey);
  const outputPaths = new Set([
    getManifestFile(entry, entryKey),
    ...getManifestCssFiles(entry, entryKey),
  ]);
  let totalBytes = 0;
  for (const outputPath of outputPaths) {
    totalBytes += await getFileSize(clientDirectory, outputPath, fileSizes);
  }
  return { totalBytes, outputPaths };
}

function findStudioEntryKey(manifest, manifestName) {
  const matchingKeys = Object.entries(manifest)
    .filter(([, entry]) => isPlainObject(entry) && entry.name === manifestName)
    .map(([key]) => key);
  if (matchingKeys.length !== 1) {
    throw new Error(
      `Built client manifest must contain exactly one entry named ${manifestName}; found ${matchingKeys.length}.`,
    );
  }
  return matchingKeys[0];
}

function budgetFailure(actual, limit, description) {
  return `${description} ${formatBytes(actual)} exceed the ${formatBytes(limit)} limit.`;
}

export async function validateClientPerformanceBudget(root = siteRoot) {
  const policy = await loadPolicy(root);
  const clientDirectory = resolveOutputFile(
    root,
    policy.output.clientDirectory,
    "Performance-budget client directory",
  );
  const assetDirectory = resolveOutputFile(
    clientDirectory,
    policy.output.assetDirectory,
    "Performance-budget asset directory",
  );
  const manifest = await readManifest(clientDirectory, policy.output.manifestPath);
  const assetFiles = await listRegularFiles(assetDirectory, "built client asset directory");
  const assetMetrics = {
    fileCount: assetFiles.length,
    totalBytes: 0,
    largestAsset: { path: "", bytes: 0 },
  };
  const fileSizes = new Map();
  for (const path of assetFiles) {
    const stats = await lstat(path);
    const outputPath = relative(clientDirectory, path).replaceAll("\\", "/");
    fileSizes.set(outputPath, stats.size);
    assetMetrics.totalBytes += stats.size;
    if (stats.size > assetMetrics.largestAsset.bytes) {
      assetMetrics.largestAsset = { path: outputPath, bytes: stats.size };
    }
  }

  const initialEntryKey = policy.limits.initialEntry.manifestKey;
  const initialEntry = getManifestEntry(manifest, initialEntryKey);
  if (initialEntry.isEntry !== true) {
    throw new Error(
      `Performance-budget initial manifest key ${initialEntryKey} is not a manifest entry point.`,
    );
  }
  const initialStaticEntryKeys = collectStaticEntryKeys(manifest, initialEntryKey);
  const reachableEntryKeys = collectReachableEntryKeys(manifest, initialEntryKey);
  const initialClosure = await measureEntryClosure({
    clientDirectory,
    manifest,
    entryKeys: initialStaticEntryKeys,
    fileSizes,
  });

  const studios = [];
  for (const expectedStudio of policy.limits.studios.entries) {
    const entryKey = findStudioEntryKey(manifest, expectedStudio.manifestName);
    const ownEntry = await measureOwnEntry({
      clientDirectory,
      manifest,
      entryKey,
      fileSizes,
    });
    const staticClosure = await measureEntryClosure({
      clientDirectory,
      manifest,
      entryKeys: collectStaticEntryKeys(manifest, entryKey),
      fileSizes,
    });
    studios.push({
      ...expectedStudio,
      entryBytes: ownEntry.totalBytes,
      staticClosureBytes: staticClosure.totalBytes,
      codeSplitFromInitialEntry:
        reachableEntryKeys.has(entryKey) && !initialStaticEntryKeys.has(entryKey),
    });
  }

  const failures = [];
  if (assetMetrics.totalBytes > policy.limits.maxClientAssetBytes) {
    failures.push(
      budgetFailure(
        assetMetrics.totalBytes,
        policy.limits.maxClientAssetBytes,
        "client asset bytes",
      ),
    );
  }
  if (assetMetrics.fileCount > policy.limits.maxClientAssetCount) {
    failures.push(
      `client asset count ${assetMetrics.fileCount} exceed the ${policy.limits.maxClientAssetCount} limit.`,
    );
  }
  if (assetMetrics.largestAsset.bytes > policy.limits.maxSingleAssetBytes) {
    failures.push(
      budgetFailure(
        assetMetrics.largestAsset.bytes,
        policy.limits.maxSingleAssetBytes,
        `largest client asset (${assetMetrics.largestAsset.path})`,
      ),
    );
  }
  if (initialClosure.totalBytes > policy.limits.initialEntry.maxStaticClosureBytes) {
    failures.push(
      budgetFailure(
        initialClosure.totalBytes,
        policy.limits.initialEntry.maxStaticClosureBytes,
        "initial browser-entry static closure",
      ),
    );
  }
  for (const studio of studios) {
    if (!studio.codeSplitFromInitialEntry) {
      failures.push(`${studio.studioId} must remain code-split from the initial browser entry.`);
    }
    if (studio.entryBytes > policy.limits.studios.maxOwnEntryBytes) {
      failures.push(
        budgetFailure(
          studio.entryBytes,
          policy.limits.studios.maxOwnEntryBytes,
          `${studio.studioId} entry bytes`,
        ),
      );
    }
    if (studio.staticClosureBytes > policy.limits.studios.maxStaticClosureBytes) {
      failures.push(
        budgetFailure(
          studio.staticClosureBytes,
          policy.limits.studios.maxStaticClosureBytes,
          `${studio.studioId} static closure bytes`,
        ),
      );
    }
  }
  if (failures.length > 0) {
    throw new Error(`Client performance budget failed:\n- ${failures.join("\n- ")}`);
  }

  return {
    policyVersion: policy.policyVersion,
    measurement: policy.measurement,
    assetMetrics,
    initialEntry: {
      manifestKey: initialEntryKey,
      staticClosureBytes: initialClosure.totalBytes,
      staticFileCount: initialClosure.outputPaths.size,
    },
    studios,
    limits: policy.limits,
  };
}

export function formatClientPerformanceBudgetReport(report) {
  const lines = [
    `Client build performance budget ${report.policyVersion} passed (raw build-artifact evidence).`,
    `Assets: ${formatBytes(report.assetMetrics.totalBytes)} across ${report.assetMetrics.fileCount} files; largest ${report.assetMetrics.largestAsset.path} (${formatBytes(report.assetMetrics.largestAsset.bytes)}).`,
    `Initial static closure (${report.initialEntry.manifestKey}): ${formatBytes(report.initialEntry.staticClosureBytes)} across ${report.initialEntry.staticFileCount} files.`,
    `Code-split studio entries: ${report.studios.length}.`,
    ...report.studios.map(
      (studio) =>
        `- ${studio.studioId}: entry ${formatBytes(studio.entryBytes)}, static closure ${formatBytes(studio.staticClosureBytes)}.`,
    ),
    `Measures: ${report.measurement.includes.join("; ")}.`,
    `Does not measure: ${report.measurement.doesNotMeasure.join("; ")}.`,
  ];
  return lines.join("\n");
}

function parseCliRoot(argv) {
  if (argv.length === 0) {
    return siteRoot;
  }
  if (argv.length === 2 && argv[0] === "--root") {
    return resolve(argv[1]);
  }
  throw new Error("Usage: node scripts/validate-client-performance-budget.mjs [--root <site-root>]");
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = parseCliRoot(process.argv.slice(2));
  validateClientPerformanceBudget(root)
    .then((report) => {
      console.log(formatClientPerformanceBudgetReport(report));
    })
    .catch((error) => {
      console.error(error instanceof Error ? error.message : String(error));
      process.exitCode = 1;
    });
}
