import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const execFileAsync = promisify(execFile);
const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const siteRoot = resolve(scriptDirectory, "..");
const generatedPaths = [
  "content/modules/manifest.json",
  "content/modules/module-content.ts",
  "content/course/release-inputs.v1.json",
  "docs/LEGACY_MODULE_CONTRACT_AUDIT.md",
];

const { stdout } = await execFileAsync(
  "git",
  ["status", "--porcelain=v1", "--untracked-files=all", "--", ...generatedPaths],
  { cwd: siteRoot },
);

if (stdout.trim() !== "") {
  const { stdout: diff } = await execFileAsync(
    "git",
    ["diff", "--no-ext-diff", "--unified=0", "--", ...generatedPaths],
    { cwd: siteRoot },
  );
  const diffDetail = diff.trim()
    ? `\n\nGenerated diff:\n${diff.trim().slice(0, 12000)}`
    : "";
  throw new Error(
    `Generated course artifacts are stale or uncommitted:\n${stdout.trim()}${diffDetail}`,
  );
}

console.log("Generated course artifacts match the checked-in projection.");
