import { lstat, readdir } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { loadReleaseInputPolicy } from "./release-input-policy.mjs";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const siteRoot = resolve(scriptDirectory, "..");

function comparePaths(left, right) {
  return left < right ? -1 : left > right ? 1 : 0;
}

async function listFilesRecursively(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      return listFilesRecursively(path);
    }
    return [path];
  }));
  return nested.flat();
}

export async function validateBuiltDownloads(root = siteRoot) {
  const outputDirectory = resolve(root, "dist", "client", "downloads");
  const { policy } = await loadReleaseInputPolicy(root);
  const outputFiles = await listFilesRecursively(outputDirectory).catch((error) => {
    throw new Error(`Cannot inspect built teaching downloads: ${error.message}`);
  });
  const outputPaths = [];

  for (const path of outputFiles) {
    const stats = await lstat(path);
    const outputPath = `public/downloads/${relative(outputDirectory, path).replaceAll("\\", "/")}`;
    if (!stats.isFile() || stats.isSymbolicLink()) {
      throw new Error(`Built teaching download must be a regular file: ${outputPath}.`);
    }
    if (/(?:^|\/)__pycache__(?:\/|$)|\.py[co]$/u.test(outputPath)) {
      throw new Error(`Built teaching download contains a runtime cache artifact: ${outputPath}.`);
    }
    outputPaths.push(outputPath);
  }

  const expectedPaths = [...policy.allowlistedDownloadPaths].sort(comparePaths);
  outputPaths.sort(comparePaths);
  if (JSON.stringify(outputPaths) !== JSON.stringify(expectedPaths)) {
    const expected = new Set(expectedPaths);
    const observed = new Set(outputPaths);
    const missing = expectedPaths.filter((path) => !observed.has(path));
    const unexpected = outputPaths.filter((path) => !expected.has(path));
    throw new Error(
      `Built teaching downloads do not match the release-input allowlist.` +
        `${missing.length ? ` Missing: ${missing.join(", ")}.` : ""}` +
        `${unexpected.length ? ` Unexpected: ${unexpected.join(", ")}.` : ""}`,
    );
  }

  return { expectedPaths, outputPaths };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const report = await validateBuiltDownloads();
  console.log(`Built teaching downloads match the ${report.outputPaths.length}-file allowlist.`);
}
