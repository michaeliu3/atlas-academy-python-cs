import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  hasCompleteMermaidAccessibilityMetadata,
  scanMermaidBlocks,
  validateMermaidAccessibility,
} from "../lib/mermaid-accessibility.mjs";

test("Mermaid accessibility metadata supplies a stable title, concise text alternative, and clean render source", () => {
  const markdown = `Before the visual.

\`\`\`mermaid
%% atlas-diagram-id: m99-example-route
%% atlas-diagram-title: From input to checked result
%% atlas-diagram-alt: An input is checked before a result is returned; a failed check stops the route.
flowchart LR
  I["Input"] --> C{"Check"}
  C -->|pass| R["Result"]
\`\`\``;
  const blocks = scanMermaidBlocks(markdown, { sourcePath: "content/modules/99_example.md" });

  assert.equal(blocks.length, 1);
  assert.deepEqual(blocks[0].metadata, {
    id: "m99-example-route",
    title: "From input to checked result",
    alternative: "An input is checked before a result is returned; a failed check stops the route.",
  });
  assert.doesNotMatch(blocks[0].renderSource, /atlas-diagram-(?:id|title|alt)/u);
  assert.equal(
    validateMermaidAccessibility(blocks, { requireComplete: true }).summary.completeBlocks,
    1,
  );
  assert.equal(hasCompleteMermaidAccessibilityMetadata(blocks[0]), true);
});

test("a strict Mermaid alternative check rejects missing, duplicate, and partial authoring metadata", () => {
  const partial = scanMermaidBlocks(
    `\`\`\`mermaid
%% atlas-diagram-id: m99-incomplete
flowchart LR
  A --> B
\`\`\``,
    { sourcePath: "content/modules/99_example.md" },
  );
  assert.throws(
    () => validateMermaidAccessibility(partial, { requireComplete: true }),
    /requires complete title and text-alternative metadata/u,
  );

  const duplicate = scanMermaidBlocks(
    `\`\`\`mermaid
%% atlas-diagram-id: m99-reused
%% atlas-diagram-title: First visual
%% atlas-diagram-alt: First distinct alternative.
flowchart LR
  A --> B
\`\`\`

\`\`\`mermaid
%% atlas-diagram-id: m99-reused
%% atlas-diagram-title: Second visual
%% atlas-diagram-alt: Second distinct alternative.
flowchart LR
  B --> C
\`\`\``,
    { sourcePath: "content/modules/99_example.md" },
  );
  assert.throws(
    () => validateMermaidAccessibility(duplicate, { requireComplete: true }),
    /reuses visual ID m99-reused/u,
  );

  const invalid = scanMermaidBlocks(
    `\`\`\`mermaid
%% atlas-diagram-id: M99-not-kebab
%% atlas-diagram-title: A title
%% atlas-diagram-alt: This alternative is deliberately long enough to meet the lower length boundary.
flowchart LR
  A --> B
\`\`\``,
    { sourcePath: "content/modules/99_example.md" },
  );
  assert.equal(hasCompleteMermaidAccessibilityMetadata(invalid[0]), false);
});

test("Module 1 is the complete reference retrofit while the global validator can honestly report remaining work", async () => {
  const moduleOne = await readFile(
    new URL("../content/modules/01_values_state_execution.md", import.meta.url),
    "utf8",
  );
  const blocks = scanMermaidBlocks(moduleOne, {
    sourcePath: "content/modules/01_values_state_execution.md",
  });
  const report = validateMermaidAccessibility(blocks, { requireComplete: true });

  assert.equal(blocks.length, 4);
  assert.equal(report.summary.completeBlocks, 4);
  assert.equal(report.summary.incompleteBlocks, 0);
  assert.ok(blocks.every(({ metadata }) => metadata?.id.startsWith("m01-")));
  assert.ok(blocks.every(({ metadata }) => metadata?.alternative.length >= 40));
});

test("Module 2 is a complete recursion-and-induction retrofit with unique visual explanations", async () => {
  const moduleTwo = await readFile(
    new URL("../content/modules/02_functions_recursion_induction.md", import.meta.url),
    "utf8",
  );
  const blocks = scanMermaidBlocks(moduleTwo, {
    sourcePath: "content/modules/02_functions_recursion_induction.md",
  });
  const report = validateMermaidAccessibility(blocks, { requireComplete: true });

  assert.equal(blocks.length, 9);
  assert.equal(report.summary.completeBlocks, 9);
  assert.equal(report.summary.incompleteBlocks, 0);
  assert.ok(blocks.every(({ metadata }) => metadata?.id.startsWith("m02-")));
  assert.ok(blocks.every(({ metadata }) => metadata?.alternative.length >= 40));
});

test("Module 3 is a complete abstraction-and-ADT retrofit with unique visual explanations", async () => {
  const moduleThree = await readFile(
    new URL("../content/modules/03_abstraction_interfaces_adts.md", import.meta.url),
    "utf8",
  );
  const blocks = scanMermaidBlocks(moduleThree, {
    sourcePath: "content/modules/03_abstraction_interfaces_adts.md",
  });
  const report = validateMermaidAccessibility(blocks, { requireComplete: true });

  assert.equal(blocks.length, 7);
  assert.equal(report.summary.completeBlocks, 7);
  assert.equal(report.summary.incompleteBlocks, 0);
  assert.ok(blocks.every(({ metadata }) => metadata?.id.startsWith("m03-")));
  assert.ok(blocks.every(({ metadata }) => metadata?.alternative.length >= 40));
});

test("Module 4 is a complete logic-and-proof retrofit with unique visual explanations", async () => {
  const moduleFour = await readFile(
    new URL("../content/modules/04_logic_sets_relations_graphs_proof.md", import.meta.url),
    "utf8",
  );
  const blocks = scanMermaidBlocks(moduleFour, {
    sourcePath: "content/modules/04_logic_sets_relations_graphs_proof.md",
  });
  const report = validateMermaidAccessibility(blocks, { requireComplete: true });

  assert.equal(blocks.length, 5);
  assert.equal(report.summary.completeBlocks, 5);
  assert.equal(report.summary.incompleteBlocks, 0);
  assert.ok(blocks.every(({ metadata }) => metadata?.id.startsWith("m04-")));
  assert.ok(blocks.every(({ metadata }) => metadata?.alternative.length >= 40));
});
