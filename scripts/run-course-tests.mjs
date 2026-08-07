import { spawn } from "node:child_process";
import { readdir } from "node:fs/promises";
import { availableParallelism } from "node:os";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const siteRoot = resolve(scriptDirectory, "..");
const testDirectory = resolve(siteRoot, "tests");
const testFiles = (await readdir(testDirectory))
  .filter((filename) => filename.endsWith(".test.mjs"))
  .sort()
  .map((filename) => resolve(testDirectory, filename));
const archivedReleaseTestDirectory = resolve(testDirectory, "archive", "release");
const archivedReleaseTestFiles = (await readdir(archivedReleaseTestDirectory))
  .filter((filename) => filename.endsWith(".test.mjs"))
  .sort()
  .map((filename) => resolve(archivedReleaseTestDirectory, filename));

const apparatusTestPatterns = [
  /^(?:advanced-|browser-harness|browser-progress-storage|browser-progress-surface-policy|candidate-preflight|ci-workflow|client-performance-budget|cloudflare-|course-ci-observer|course-contract|course-graph|course-status|dependency-risk|diagnostic-progress-codec|durable-software-studio-accessibility|git-index|guided-route-handoffs|hidden-review|http-security-headers|learner-controlled-export|legacy-|live-codex-learning-workflow|local-progress-codec|manual-learning-record-workflow|math-candidate|mermaid-accessibility|module-companion-package|module-contract|module-learning-companion|module-review|module-session-launches|multiple-choice-prediction-gate|rendered-html|rich-rendering|source-artifact|vinext-)/u,
  /^module-bench-registry/u,
  /^module(?:18-progress-codec|19-23-24-26-progress-lifecycle|19-progress-codec|20-22-25-progress-lifecycle|23-local-progress|24-local-progress|25-local-progress|26-local-progress|27-30-progress-codec|29-evidence-preflight|31-evidence-preflight|32-evidence-preflight)/u,
  /^m(?:0[1-9]|1[1-9]|2[0-4])-contract-candidate/u,
  /^m(?:0[2-8]-|1[14]-|11-m16-evidence-thread|17-m24-learning-route-boundary|19-m24-mermaid-accessibility|25-m26-synthesis-receipts|31-|32-hidden|33-|34-hidden|35-hidden|36-hidden)/u,
  /^(?:provenance|release-)/u,
];

function isApparatusTest(path) {
  return apparatusTestPatterns.some((pattern) => pattern.test(path.split(/[\\/]/u).pop() ?? ""));
}

const suiteArgument = process.argv.find((argument) => argument.startsWith("--suite="));
const suite = suiteArgument?.slice("--suite=".length) ?? "all";
if (!["all", "content", "apparatus", "release"].includes(suite)) {
  throw new Error(`Unknown test suite ${suite}; expected all, content, apparatus, or release.`);
}
const selectedTestFiles = suite === "release"
  ? archivedReleaseTestFiles
  : testFiles.filter((path) =>
    suite === "all" || (suite === "apparatus" ? isApparatusTest(path) : !isApparatusTest(path)),
  );

// Several contract/preflight suites each take a Git-index snapshot and verify
// a large cohort. Letting Node fan every file out to all host cores causes
// contention rather than faster feedback on high-core developer machines.
// Keep the full suite, but use a small deterministic worker pool in local and
// CI runs alike.
if (selectedTestFiles.length === 0) {
  throw new Error("No Node course tests were discovered in tests/*.test.mjs.");
}

const testConcurrency = Math.min(4, Math.max(1, availableParallelism() - 1));
console.log(
  `Running ${suite} Node course suite: ${selectedTestFiles.length}/${testFiles.length} test files with ${testConcurrency} worker(s).`,
);

const exitCode = await new Promise((resolveExitCode, reject) => {
  const child = spawn(process.execPath, [
    "--test",
    `--test-concurrency=${testConcurrency}`,
    ...selectedTestFiles,
  ], {
    cwd: siteRoot,
    // High-volume validators share one immutable Git-index snapshot per test
    // worker. The read helper still verifies every requested path and refreshes
    // on an index-generation change; this only removes redundant full-index
    // captures from the apparatus/content runner.
    env: { ...process.env, ATLAS_GIT_INDEX_SNAPSHOT_CACHE: "1" },
    stdio: "inherit",
    windowsHide: true,
  });

  let receivedSignal = null;
  let childClosed = false;
  const signalHandlers = new Map();
  const removeSignalHandlers = () => {
    for (const [signal, handler] of signalHandlers) {
      process.removeListener(signal, handler);
    }
    signalHandlers.clear();
  };
  const terminateChildTree = (signal) => {
    if (childClosed || receivedSignal) return;
    receivedSignal = signal;
    if (process.platform === "win32") {
      // Node's child.kill() does not reliably include the test workers on
      // Windows. taskkill /T terminates the exact runner tree; the fallback
      // keeps the cleanup bounded if taskkill cannot be started.
      try {
        const killer = spawn("taskkill", ["/PID", String(child.pid), "/T", "/F"], {
          stdio: "ignore",
          windowsHide: true,
        });
        killer.once("error", () => child.kill());
      } catch {
        child.kill();
      }
      return;
    }
    child.kill(signal);
  };
  for (const signal of ["SIGINT", "SIGTERM"]) {
    const handler = () => terminateChildTree(signal);
    signalHandlers.set(signal, handler);
    process.once(signal, handler);
  }

  child.once("error", (error) => {
    childClosed = true;
    removeSignalHandlers();
    reject(error);
  });
  child.once("exit", (code, signal) => {
    childClosed = true;
    removeSignalHandlers();
    if (receivedSignal) {
      resolveExitCode(receivedSignal === "SIGINT" ? 130 : 143);
      return;
    }
    if (signal) {
      reject(new Error(`Node course tests terminated with signal ${signal}.`));
      return;
    }
    resolveExitCode(code ?? 1);
  });
});

process.exitCode = exitCode;
