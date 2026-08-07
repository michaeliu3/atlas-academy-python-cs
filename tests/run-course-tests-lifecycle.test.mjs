import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const testDirectory = dirname(fileURLToPath(import.meta.url));
const siteRoot = resolve(testDirectory, "..");

test("the local Node suite forwards cancellation and cleans up its worker tree", async () => {
  const runner = await readFile(resolve(siteRoot, "scripts", "run-course-tests.mjs"), "utf8");

  assert.match(runner, /process\.once\(signal, handler\)/u);
  assert.match(runner, /signalHandlers\.clear\(\)/u);
  assert.match(runner, /taskkill.*?\/T.*?\/F/su);
  assert.match(runner, /windowsHide: true/u);
  assert.match(runner, /resolveExitCode\(receivedSignal === "SIGINT" \? 130 : 143\)/u);
});
