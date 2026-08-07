import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  scanMermaidBlocks,
  validateMermaidAccessibility,
} from "../lib/mermaid-accessibility.mjs";

const retrofittedModules = [
  {
    number: 19,
    path: "content/modules/19_concurrency_parallelism.md",
    expectedBlocks: 19,
  },
  {
    number: 20,
    path: "content/modules/20_networks_application_protocols.md",
    expectedBlocks: 8,
  },
  {
    number: 21,
    path: "content/modules/21_async_distributed_systems.md",
    expectedBlocks: 5,
  },
  {
    number: 22,
    path: "content/modules/22_security_privacy_trust_boundaries.md",
    expectedBlocks: 8,
  },
  {
    number: 23,
    path: "content/modules/23_programming_languages_interpreters.md",
    expectedBlocks: 6,
  },
  {
    number: 24,
    path: "content/modules/24_cpython_performance_memory.md",
    expectedBlocks: 3,
  },
];

for (const { number, path, expectedBlocks } of retrofittedModules) {
  test(`Module ${number} has complete, module-scoped Mermaid text alternatives`, async () => {
    const markdown = await readFile(new URL(`../${path}`, import.meta.url), "utf8");
    const blocks = scanMermaidBlocks(markdown, { sourcePath: path });
    const report = validateMermaidAccessibility(blocks, { requireComplete: true });
    const ids = blocks.map(({ metadata }) => metadata?.id);

    assert.equal(blocks.length, expectedBlocks);
    assert.equal(report.summary.completeBlocks, expectedBlocks);
    assert.equal(report.summary.incompleteBlocks, 0);
    assert.ok(blocks.every(({ metadata }) => metadata?.id.startsWith(`m${String(number).padStart(2, "0")}-`)));
    assert.ok(blocks.every(({ metadata }) => metadata?.title.length <= 120));
    assert.ok(blocks.every(({ metadata }) => metadata?.alternative.length >= 24));
    assert.equal(new Set(ids).size, expectedBlocks);
  });
}
