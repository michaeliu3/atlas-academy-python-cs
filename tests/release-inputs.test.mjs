import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { lstat, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { advancedModuleBridgeRelativePath } from "../scripts/advanced-module-bridge.mjs";
import {
  advancedModuleContractRelativePath,
  historicalAdvancedProvenanceLedgerPaths,
  loadAdvancedModuleContractRegistry,
  validateAdvancedModuleContractRegistry,
} from "../scripts/advanced-module-contract.mjs";
import { loadCourseGraph } from "../scripts/course-graph.mjs";
import { legacyModuleContractPacketRelativePath } from "../scripts/legacy-module-contract-packet.mjs";
import { legacyModuleContractAuditRelativePath } from "../scripts/validate-legacy-module-contract-audit.mjs";
import { loadReleaseInputPolicy } from "../scripts/release-input-policy.mjs";
import { validateBuiltDownloads } from "../scripts/validate-built-downloads.mjs";

const testDirectory = dirname(fileURLToPath(import.meta.url));
const siteRoot = resolve(testDirectory, "..");
const ledgerPath = resolve(siteRoot, "content", "course", "release-inputs.v1.json");
const advancedProvenanceDocumentPath =
  /^docs\/advanced-evidence\/(m3[1-6])\/(?:provenance|source-review|known-limitations)\.md$/u;
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
  const [ledger, graph, advancedRegistry] = await Promise.all([
    readFile(ledgerPath, "utf8").then(JSON.parse),
    loadCourseGraph(),
    loadAdvancedModuleContractRegistry(),
  ]);
  const advancedContractReport = await validateAdvancedModuleContractRegistry(
    graph,
    advancedRegistry,
    { siteRoot },
  );
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
  assert.ok(paths.includes(advancedModuleContractRelativePath));
  assert.ok(paths.includes(legacyModuleContractAuditRelativePath));
  assert.ok(paths.includes(legacyModuleContractPacketRelativePath));
  assert.ok(paths.includes("content/course/release-input-policy.v1.json"));
  assert.ok(paths.includes("content/modules/01_values_state_execution.md"));
  assert.ok(paths.includes("content/source-maps/python_curriculum_sources.md"));
  assert.ok(paths.includes("content/source-maps/module31_optimization_information_source_map.md"));
  assert.ok(paths.includes("content/source-maps/module31_optimization_information_source_audit.md"));
  assert.ok(paths.includes("content/source-maps/module29_calculus_real_analysis_source_audit_addendum.md"));
  assert.ok(paths.includes("docs/M31_M36_PUBLICATION_READINESS_AUDIT.v1.json"));
  assert.ok(paths.includes("public/downloads/module18_reference.py"));
  assert.doesNotMatch(paths.join("\n"), /(?:^|\/)__pycache__(?:\/|$)|\.py[co](?:\n|$)/u);

  const releaseInputPolicy = await loadReleaseInputPolicy(siteRoot);
  const policyPaths = releaseInputPolicy.policy.allowlistedDownloadPaths;
  assert.deepEqual(policyPaths, [...policyPaths].sort(comparePaths));
  for (const policyPath of policyPaths) {
    assert.ok(paths.includes(policyPath), `${policyPath} appears in the release-input ledger`);
  }

  const documentationLedgerPaths = paths.filter((path) => path.startsWith("docs/"));
  const expectedDocumentationLedgerPaths = new Set(historicalAdvancedProvenanceLedgerPaths);
  for (const entry of advancedRegistry.modules) {
    for (const input of entry.contractInputs ?? []) {
      if (input?.role !== "provenance" || !input.path?.startsWith("docs/")) {
        continue;
      }
      const match = input.path.match(advancedProvenanceDocumentPath);
      assert.ok(
        historicalAdvancedProvenanceLedgerPaths.includes(input.path) ||
          (match && match[1] === entry.moduleId),
        `${input.path} is a fixed historical record or a same-module advanced-evidence slot`,
      );
      expectedDocumentationLedgerPaths.add(input.path);
    }
  }
  assert.deepEqual(
    documentationLedgerPaths,
    [...expectedDocumentationLedgerPaths].sort(comparePaths),
  );
  assert.deepEqual(
    advancedContractReport.provenanceDocumentationPaths,
    [...expectedDocumentationLedgerPaths].sort(comparePaths),
  );

  for (const input of ledger.inputs) {
    if (input.path.startsWith("docs/")) {
      assert.ok(
        expectedDocumentationLedgerPaths.has(input.path),
        `${input.path} is a contract-declared, module-scoped provenance ledger input`,
      );
    } else {
      assert.match(input.path, /^(?:content|public)\//u);
    }
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
