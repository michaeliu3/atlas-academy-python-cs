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

test("Module 5 is a complete algorithm-analysis retrofit with unique visual explanations", async () => {
  const moduleFive = await readFile(
    new URL("../content/modules/05_cost_models_algorithm_analysis.md", import.meta.url),
    "utf8",
  );
  const blocks = scanMermaidBlocks(moduleFive, {
    sourcePath: "content/modules/05_cost_models_algorithm_analysis.md",
  });
  const report = validateMermaidAccessibility(blocks, { requireComplete: true });

  assert.equal(blocks.length, 6);
  assert.equal(report.summary.completeBlocks, 6);
  assert.equal(report.summary.incompleteBlocks, 0);
  assert.ok(blocks.every(({ metadata }) => metadata?.id.startsWith("m05-")));
  assert.ok(blocks.every(({ metadata }) => metadata?.alternative.length >= 40));
});

test("Module 6 is a complete representation-and-memory retrofit with model boundaries", async () => {
  const moduleSix = await readFile(
    new URL("../content/modules/06_representation_memory_sequences_linked.md", import.meta.url),
    "utf8",
  );
  const blocks = scanMermaidBlocks(moduleSix, {
    sourcePath: "content/modules/06_representation_memory_sequences_linked.md",
  });
  const report = validateMermaidAccessibility(blocks, { requireComplete: true });

  assert.equal(blocks.length, 13);
  assert.equal(report.summary.completeBlocks, 13);
  assert.equal(report.summary.incompleteBlocks, 0);
  assert.ok(blocks.every(({ metadata }) => metadata?.id.startsWith("m06-")));
  assert.ok(blocks.every(({ metadata }) => metadata?.alternative.length >= 40));
  assert.ok(
    blocks.some(({ metadata }) => metadata?.alternative.includes("not a diagram of Python object storage")),
  );
  assert.ok(
    blocks.some(({ metadata }) => metadata?.alternative.includes("implementation-dependent")),
  );
});

test("Module 7 is a complete stack-and-lazy-flow retrofit with corrected control boundaries", async () => {
  const moduleSeven = await readFile(
    new URL("../content/modules/07_stacks_queues_iteration_lazy.md", import.meta.url),
    "utf8",
  );
  const blocks = scanMermaidBlocks(moduleSeven, {
    sourcePath: "content/modules/07_stacks_queues_iteration_lazy.md",
  });
  const report = validateMermaidAccessibility(blocks, { requireComplete: true });

  assert.equal(blocks.length, 10);
  assert.equal(report.summary.completeBlocks, 10);
  assert.equal(report.summary.incompleteBlocks, 0);
  assert.ok(blocks.every(({ metadata }) => metadata?.id.startsWith("m07-")));
  assert.ok(blocks.every(({ metadata }) => metadata?.alternative.length >= 40));
  assert.ok(
    blocks.some(({ metadata }) => metadata?.alternative.includes("release capacity")),
  );
  assert.ok(
    !moduleSeven.includes("Iterator --> Iterator : next() advances"),
    "the protocol diagram must not imply next creates a separate iterator",
  );
});

test("Module 8 is a complete hashing retrofit with corrected causal and repair models", async () => {
  const moduleEight = await readFile(
    new URL("../content/modules/08_hashing_dictionaries_sets_indexing.md", import.meta.url),
    "utf8",
  );
  const blocks = scanMermaidBlocks(moduleEight, {
    sourcePath: "content/modules/08_hashing_dictionaries_sets_indexing.md",
  });
  const report = validateMermaidAccessibility(blocks, { requireComplete: true });

  assert.equal(blocks.length, 9);
  assert.equal(report.summary.completeBlocks, 9);
  assert.equal(report.summary.incompleteBlocks, 0);
  assert.ok(blocks.every(({ metadata }) => metadata?.id.startsWith("m08-")));
  assert.ok(blocks.every(({ metadata }) => metadata?.alternative.length >= 40));
  assert.ok(moduleEight.includes("HASH --> COLLIDE"));
  assert.ok(!moduleEight.includes("COLLIDE --> HASH"));
  assert.ok(moduleEight.includes('MAP -. "choose one" .-> R1'));
  assert.ok(!moduleEight.includes("MAP --> R1"));
  assert.ok(moduleEight.includes("report missing key"));
  assert.ok(moduleEight.includes("adopt new buckets"));
  assert.ok(moduleEight.includes("collision → {n1}"));
  assert.ok(moduleEight.includes("relation → {n2}"));
  assert.ok(moduleEight.includes("expected → {n3}"));
  assert.ok(moduleEight.includes("read old note"));
  assert.ok(moduleEight.includes("write replacement text"));
  assert.ok(moduleEight.includes("old minus new"));
  assert.ok(moduleEight.includes("new minus old"));
});

test("Module 9 is a complete ordered-structures retrofit with scoped visual explanations", async () => {
  const moduleNine = await readFile(
    new URL("../content/modules/09_trees_heaps_sorting_ordered.md", import.meta.url),
    "utf8",
  );
  const blocks = scanMermaidBlocks(moduleNine, {
    sourcePath: "content/modules/09_trees_heaps_sorting_ordered.md",
  });
  const report = validateMermaidAccessibility(blocks, { requireComplete: true });

  assert.equal(blocks.length, 13);
  assert.equal(report.summary.completeBlocks, 13);
  assert.equal(report.summary.incompleteBlocks, 0);
  assert.ok(blocks.every(({ metadata }) => metadata?.id.startsWith("m09-")));
  assert.ok(blocks.every(({ metadata }) => metadata?.alternative.length >= 40));
  assert.ok(moduleNine.includes("m09-scheduler-authority"));
});

test("Module 10 is a complete graph-algorithms retrofit with scoped visual explanations", async () => {
  const moduleTen = await readFile(
    new URL("../content/modules/10_graph_algorithms_network_models.md", import.meta.url),
    "utf8",
  );
  const blocks = scanMermaidBlocks(moduleTen, {
    sourcePath: "content/modules/10_graph_algorithms_network_models.md",
  });
  const report = validateMermaidAccessibility(blocks, { requireComplete: true });

  assert.equal(blocks.length, 11);
  assert.equal(report.summary.completeBlocks, 11);
  assert.equal(report.summary.incompleteBlocks, 0);
  assert.ok(blocks.every(({ metadata }) => metadata?.id.startsWith("m10-")));
  assert.ok(blocks.every(({ metadata }) => metadata?.alternative.length >= 40));
  assert.ok(moduleTen.includes("m10-planner-architecture"));
});

test("Module 11 is a complete algorithm-strategy retrofit with scoped visual explanations", async () => {
  const moduleEleven = await readFile(
    new URL("../content/modules/11_algorithm_design_paradigms.md", import.meta.url),
    "utf8",
  );
  const blocks = scanMermaidBlocks(moduleEleven, {
    sourcePath: "content/modules/11_algorithm_design_paradigms.md",
  });
  const report = validateMermaidAccessibility(blocks, { requireComplete: true });

  assert.equal(blocks.length, 10);
  assert.equal(report.summary.completeBlocks, 10);
  assert.equal(report.summary.incompleteBlocks, 0);
  assert.ok(blocks.every(({ metadata }) => metadata?.id.startsWith("m11-")));
  assert.ok(blocks.every(({ metadata }) => metadata?.alternative.length >= 40));
  assert.ok(moduleEleven.includes("m11-algorithm-selection-knowledge-map"));
});

test("Modules 14 through 18 retain complete, readable visual explanations", async () => {
  for (const [moduleNumber, filename, expectedBlocks, knowledgeMapId] of [
    ["14", "14_software_design_and_change.md", 8, "m14-design-change-knowledge-map"],
    ["15", "15_files_serialization_packaging_delivery.md", 19, "m15-durable-delivery-knowledge-map"],
    ["16", "16_relational_data_transactions.md", 9, "m16-relational-one-page-map"],
    ["17", "17_computer_architecture_execution_stack.md", 11, "m17-execution-stack-roadmap"],
    ["18", "18_operating_systems_resource_mediation.md", 19, "m18-os-pressure-bridge"],
  ]) {
    const markdown = await readFile(
      new URL(`../content/modules/${filename}`, import.meta.url),
      "utf8",
    );
    const blocks = scanMermaidBlocks(markdown, {
      sourcePath: `content/modules/${filename}`,
    });
    const report = validateMermaidAccessibility(blocks, { requireComplete: true });

    assert.equal(blocks.length, expectedBlocks);
    assert.equal(report.summary.completeBlocks, expectedBlocks);
    assert.equal(report.summary.incompleteBlocks, 0);
    assert.ok(blocks.every(({ metadata }) => metadata?.id.startsWith(`m${moduleNumber}-`)));
    assert.ok(blocks.every(({ metadata }) => metadata?.alternative.length >= 40));
    assert.ok(blocks.some(({ metadata }) => metadata?.id === knowledgeMapId));
  }
});

test("Module 29's continuous-change prerequisite map has a concise, scoped text alternative", async () => {
  const moduleTwentyNine = await readFile(
    new URL("../content/modules/29_calculus_real_analysis_continuous_change.md", import.meta.url),
    "utf8",
  );
  const blocks = scanMermaidBlocks(moduleTwentyNine, {
    sourcePath: "content/modules/29_calculus_real_analysis_continuous_change.md",
  });
  const report = validateMermaidAccessibility(blocks, { requireComplete: true });

  assert.equal(blocks.length, 1);
  assert.equal(report.summary.completeBlocks, 1);
  assert.equal(report.summary.incompleteBlocks, 0);
  assert.equal(blocks[0].metadata.id, "m29-continuous-change-prerequisite-map");
  assert.match(blocks[0].metadata.alternative, /M25 remains later synthesis/u);
});

test("canonical workbooks do not duplicate renderer-owned Mermaid alternatives", async () => {
  const manifest = JSON.parse(
    await readFile(new URL("../content/modules/manifest.json", import.meta.url), "utf8"),
  );
  const duplicateAlternative = /```mermaid[\s\S]*?```(?:\r?\n){1,2}\*\*Text (?:alternative|equivalent)(?::|\.\*\*)/gu;

  for (const { filename } of manifest.modules) {
    const markdown = await readFile(
      new URL(`../content/modules/${filename}`, import.meta.url),
      "utf8",
    );
    assert.doesNotMatch(
      markdown,
      duplicateAlternative,
      `${filename} must leave the single visible Mermaid alternative to MermaidDiagram.`,
    );
  }
});
