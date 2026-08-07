import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const siteRoot = fileURLToPath(new URL("../", import.meta.url));
const registryPath = resolve(siteRoot, "content/course/contracts/advanced-module-contracts.v1.json");

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
}

function repositoryPath(path) {
  return resolve(siteRoot, ...path.split("/"));
}

test("M31–M36 source ledgers bind their planned source and claim markers", async () => {
  const registry = JSON.parse(await readFile(registryPath, "utf8"));

  for (const moduleContract of registry.modules) {
    const inputById = new Map(moduleContract.contractInputs.map((input) => [input.id, input]));
    const plannedCoverage = moduleContract.authoringPlan?.plannedCoverage ?? [];
    assert.ok(plannedCoverage.length > 0, `${moduleContract.moduleId} needs planned source coverage`);

    for (const coverage of plannedCoverage) {
      const input = inputById.get(coverage.inputId);
      assert.ok(input, `${moduleContract.moduleId} coverage must bind ${coverage.inputId}`);
      const sourceText = await readFile(repositoryPath(input.path), "utf8");
      for (const marker of coverage.markers) {
        assert.match(
          sourceText,
          new RegExp(escapeRegExp(marker), "u"),
          `${moduleContract.moduleId} source input ${coverage.inputId} must retain ${marker}`,
        );
      }
    }

    const ledgerInputs = moduleContract.contractInputs.filter(({ id }) =>
      /source-(?:research|map)-ledger|source-audit-sources/u.test(id),
    );
    assert.ok(ledgerInputs.length > 0, `${moduleContract.moduleId} needs a source-ledger input`);
    const uniqueLedgerPaths = [...new Set(ledgerInputs.map(({ path }) => path))];
    for (const ledgerPath of uniqueLedgerPaths) {
      const ledger = await readFile(repositoryPath(ledgerPath), "utf8");
      assert.match(ledger, /https?:\/\//u, `${moduleContract.moduleId} ledger needs stable source links`);
      assert.match(ledger, /access(?:ed| record| date)|rechecked/iu, `${moduleContract.moduleId} ledger needs access provenance`);
      assert.match(ledger, /license|reuse/iu, `${moduleContract.moduleId} ledger needs a reuse boundary`);
      assert.match(ledger, /claim|rationale/iu, `${moduleContract.moduleId} ledger needs claim linkage`);
    }
  }
});
