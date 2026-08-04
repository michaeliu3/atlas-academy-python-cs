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

// Several contract/preflight suites each take a Git-index snapshot and verify
// a large cohort. Letting Node fan every file out to all host cores causes
// contention rather than faster feedback on high-core developer machines.
// Keep the full suite, but use a small deterministic worker pool in local and
// CI runs alike.
const testConcurrency = 4;

if (testFiles.length === 0) {
  throw new Error("No Node course tests were discovered in tests/*.test.mjs.");
}

const exitCode = await new Promise((resolveExitCode, reject) => {
  const child = spawn(process.execPath, [
    "--test",
    `--test-concurrency=${testConcurrency}`,
    ...testFiles,
  ], {
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
