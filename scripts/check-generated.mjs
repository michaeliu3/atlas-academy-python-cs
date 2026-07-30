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
];

const { stdout } = await execFileAsync(
  "git",
  ["status", "--porcelain=v1", "--untracked-files=all", "--", ...generatedPaths],
  { cwd: siteRoot },
);

if (stdout.trim() !== "") {
  throw new Error(
    `Generated course artifacts are stale or uncommitted:\n${stdout.trim()}`,
  );
}

console.log("Generated course artifacts match the checked-in projection.");
