import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { lstat, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { advancedModuleBridgeRelativePath } from "../scripts/advanced-module-bridge.mjs";
import { legacyModuleContractAuditRelativePath } from "../scripts/validate-legacy-module-contract-audit.mjs";
import { loadReleaseInputPolicy } from "../scripts/release-input-policy.mjs";
import { validateBuiltDownloads } from "../scripts/validate-built-downloads.mjs";

const testDirectory = dirname(fileURLToPath(import.meta.url));
const siteRoot = resolve(testDirectory, "..");
const ledgerPath = resolve(siteRoot, "content", "course", "release-inputs.v1.json");

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function canonicalTextContent(value) {
  return value.replace(/\r\n?/gu, "\n");
}

function comparePaths(left, right) {
  return left < right ? -1 : left > right ? 1 : 0;
}

test("the release-input ledger is a reproducible local allowlist", async () => {
  const ledger = JSON.parse(await readFile(ledgerPath, "utf8"));
  assert.equal(ledger.schemaVersion, 1);
  assert.equal(ledger.generatedBy, "scripts/sync-modules.mjs");
  assert.ok(Array.isArray(ledger.inputs));
  assert.ok(ledger.inputs.length > 30);

  const paths = ledger.inputs.map(({ path }) => path);
  assert.deepEqual(paths, [...paths].sort(comparePaths));
  assert.ok(paths.includes("content/course/course-graph.v1.json"));
  assert.ok(paths.includes("content/course/client-performance-budget.v1.json"));
  assert.ok(paths.includes("content/course/contracts/module-contracts.v1.json"));
  assert.ok(paths.includes(advancedModuleBridgeRelativePath));
  assert.ok(paths.includes(legacyModuleContractAuditRelativePath));
  assert.ok(paths.includes("content/course/release-input-policy.v1.json"));
  assert.ok(paths.includes("content/modules/01_values_state_execution.md"));
  assert.ok(paths.includes("content/source-maps/python_curriculum_sources.md"));
  assert.ok(paths.includes("public/downloads/module18_reference.py"));
  assert.doesNotMatch(paths.join("\n"), /(?:^|\/)__pycache__(?:\/|$)|\.py[co](?:\n|$)/u);

  const releaseInputPolicy = await loadReleaseInputPolicy(siteRoot);
  const policyPaths = releaseInputPolicy.policy.allowlistedDownloadPaths;
  assert.deepEqual(policyPaths, [...policyPaths].sort(comparePaths));
  for (const policyPath of policyPaths) {
    assert.ok(paths.includes(policyPath), `${policyPath} appears in the release-input ledger`);
  }

  for (const input of ledger.inputs) {
    assert.match(input.path, /^(?:content|public)\//u);
    assert.doesNotMatch(input.path, /(?:^|\/)\.\.(?:\/|$)/u);
    const path = resolve(siteRoot, input.path);
    const stats = await lstat(path);
    assert.ok(stats.isFile(), `${input.path} is a regular file`);
    assert.ok(!stats.isSymbolicLink(), `${input.path} is not a symlink`);
    assert.equal(
      sha256(canonicalTextContent(await readFile(path, "utf8"))),
      input.sha256,
      `${input.path} hash matches`,
    );
  }
});

test("the production client exposes only allowlisted teaching downloads", async () => {
  const report = await validateBuiltDownloads(siteRoot);
  assert.deepEqual(report.outputPaths, report.expectedPaths);
});
