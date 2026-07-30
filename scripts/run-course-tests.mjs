import { spawn } from "node:child_process";
import { readdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const siteRoot = resolve(scriptDirectory, "..");
const testDirectory = resolve(siteRoot, "tests");
const testFiles = (await readdir(testDirectory))
  .filter((filename) => filename.endsWith(".test.mjs"))
  .sort()
  .map((filename) => resolve(testDirectory, filename));

if (testFiles.length === 0) {
  throw new Error("No Node course tests were discovered in tests/*.test.mjs.");
}

const exitCode = await new Promise((resolveExitCode, reject) => {
  const child = spawn(process.execPath, ["--test", ...testFiles], {
    cwd: siteRoot,
    stdio: "inherit",
  });
  child.once("error", reject);
  child.once("exit", (code, signal) => {
    if (signal) {
      reject(new Error(`Node course tests terminated with signal ${signal}.`));
      return;
    }
    resolveExitCode(code ?? 1);
  });
});

process.exitCode = exitCode;
