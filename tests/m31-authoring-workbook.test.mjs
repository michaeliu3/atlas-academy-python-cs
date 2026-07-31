import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  loadAdvancedModuleContractRegistry,
  validateAdvancedModuleContractRegistry,
} from "../scripts/advanced-module-contract.mjs";
import { loadCourseGraph } from "../scripts/course-graph.mjs";
import {
  scanMermaidBlocks,
  validateMermaidAccessibility,
} from "../lib/mermaid-accessibility.mjs";

const candidatePath = "content/authoring/m31_optimization_information_workbook.v1.md";

test("the M31 six-session candidate is tracked as authoring evidence without becoming learner access", async () => {
  const [graph, contract, candidate] = await Promise.all([
    loadCourseGraph(),
    loadAdvancedModuleContractRegistry(),
    readFile(candidatePath, "utf8"),
  ]);
  const report = await validateAdvancedModuleContractRegistry(graph, contract);
  const m31Graph = graph.modules.find(({ id }) => id === "m31");
  const m31Contract = contract.modules.find(({ moduleId }) => moduleId === "m31");
  const workbookInput = m31Contract.contractInputs.find(
    ({ id }) => id === "m31-authoring-workbook-draft",
  );

  assert.deepEqual(
    m31Graph.state,
    {
      lifecycle: "authoring-only",
      readerAccess: "hidden",
      availability: "authoring-only",
      contract: { track: "advanced-v1", state: "authoring-only" },
      release: { state: "unrecorded", recordId: null },
    },
  );
  assert.deepEqual(workbookInput, {
    id: "m31-authoring-workbook-draft",
    kind: "file",
    role: "course-content",
    path: candidatePath,
    locator: null,
    note: "Complete authoring-only M31 workbook candidate; it is not a reader route, review approval, or release record.",
  });
  assert.ok(
    report.releaseInputPaths.some((path) => path.replaceAll("\\", "/").endsWith(candidatePath)),
  );
  for (const sessionNumber of [1, 2, 3, 4, 5, 6]) {
    assert.match(candidate, new RegExp(`^## Session ${sessionNumber} —`, "mu"));
  }
  assert.match(candidate, /\*\*Text alternative:\*\*/u);
  assert.match(candidate, /```python/u);
  assert.match(candidate, /Teaching Assistant prompt — M31/u);
  assert.match(candidate, /Study Partner prompt — M31/u);
  assert.match(candidate, /not in the reader\s+manifest/u);

  const visualBlocks = scanMermaidBlocks(candidate, { sourcePath: candidatePath });
  const visualReport = validateMermaidAccessibility(visualBlocks, { requireComplete: true });
  assert.equal(visualBlocks.length, 2);
  assert.equal(visualReport.summary.completeBlocks, 2);
  assert.ok(visualBlocks.every(({ metadata }) => metadata?.id.startsWith("m31-")));
  assert.ok(visualBlocks.every(({ metadata }) => metadata?.alternative.length >= 40));
});
