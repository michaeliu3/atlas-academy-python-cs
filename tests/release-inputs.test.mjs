import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { lstat, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const testDirectory = dirname(fileURLToPath(import.meta.url));
const siteRoot = resolve(testDirectory, "..");
const ledgerPath = resolve(siteRoot, "content", "course", "release-inputs.v1.json");

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

test("the release-input ledger is a reproducible local allowlist", async () => {
  const ledger = JSON.parse(await readFile(ledgerPath, "utf8"));
  assert.equal(ledger.schemaVersion, 1);
  assert.equal(ledger.generatedBy, "scripts/sync-modules.mjs");
  assert.ok(Array.isArray(ledger.inputs));
  assert.ok(ledger.inputs.length > 30);

  const paths = ledger.inputs.map(({ path }) => path);
  assert.deepEqual(paths, [...paths].sort((left, right) => left.localeCompare(right)));
  assert.ok(paths.includes("content/course/course-graph.v1.json"));
  assert.ok(paths.includes("content/course/contracts/module-contracts.v1.json"));
  assert.ok(paths.includes("content/modules/01_values_state_execution.md"));
  assert.ok(paths.includes("content/source-maps/python_curriculum_sources.md"));

  for (const input of ledger.inputs) {
    assert.match(input.path, /^(?:content|public)\//u);
    assert.doesNotMatch(input.path, /(?:^|\/)\.\.(?:\/|$)/u);
    const path = resolve(siteRoot, input.path);
    const stats = await lstat(path);
    assert.ok(stats.isFile(), `${input.path} is a regular file`);
    assert.ok(!stats.isSymbolicLink(), `${input.path} is not a symlink`);
    assert.equal(sha256(await readFile(path)), input.sha256, `${input.path} hash matches`);
  }
});
