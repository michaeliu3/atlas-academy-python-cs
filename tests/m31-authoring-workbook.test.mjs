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
import { extractTableOfContents } from "../lib/heading-ids.js";

const authoringWorkbookPath = "content/authoring/m31_optimization_information_workbook.v1.md";
const reviewCandidatePath = "content/modules/31_optimization_information.md";

test("the M31 six-session candidate is tracked as authoring evidence without becoming learner access", async () => {
  const [graph, contract, candidate] = await Promise.all([
    loadCourseGraph(),
    loadAdvancedModuleContractRegistry(),
    readFile(authoringWorkbookPath, "utf8"),
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
    path: authoringWorkbookPath,
    locator: null,
    note: "Complete authoring-only M31 workbook candidate; it is not a reader route, review approval, or release record.",
  });
  assert.ok(
    report.releaseInputPaths.some((path) => path.replaceAll("\\", "/").endsWith(authoringWorkbookPath)),
  );
  for (const sessionNumber of [1, 2, 3, 4, 5, 6]) {
    assert.match(candidate, new RegExp(`^## Session ${sessionNumber} —`, "mu"));
  }
  assert.deepEqual(
    extractTableOfContents(candidate)
      .filter(({ depth, title }) => depth === 3 && title.startsWith("Output:"))
      .map(({ id }) => id),
    [
      "output-objective-geometry-sheet",
      "output-stationarity-and-feasibility-ledger",
      "output-constraint-claim-table",
      "output-solver-selection-rationale",
      "output-stochastic-information-experiment-card",
      "output-optimization-and-information-evidence-dossier",
    ],
  );
  assert.deepEqual(
    extractTableOfContents(candidate)
      .filter(({ depth, title }) => depth === 3 && title.startsWith("Transfer task"))
      .map(({ id }) => id),
    [
      "transfer-task--changed-authority-boundary",
      "transfer-task--changed-representation",
      "transfer-task--changed-constraint-type",
      "transfer-task--changed-workload",
      "transfer-task--changed-sampling-story",
      "transfer-task--changed-source-or-distortion",
    ],
  );
  assert.match(candidate, /\*\*Text alternative:\*\*/u);
  assert.match(candidate, /```python/u);
  assert.match(candidate, /Teaching Assistant prompt — M31/u);
  assert.match(candidate, /Study Partner prompt — M31/u);
  assert.match(candidate, /not in the reader\s+manifest/u);
  assert.match(candidate, /Worked primal\/dual mini-case — derive the gap before trusting it/u);
  assert.match(candidate, /p\^\\star=2,\\qquad d\^\\star=q\(2\)=2,\\qquad p\^\\star-d\^\\star=0/u);
  assert.match(candidate, /usual convex\s+Slater\/KKT theorem applies/u);
  assert.match(candidate, /Convexity, smoothness, and strong-convexity bridge/u);
  assert.ok(candidate.includes("A declared feasible domain \\(C\\) is **convex**"));
  assert.ok(candidate.includes("A function \\(f:C\\to\\mathbb R\\) is **convex**"));
  assert.match(candidate, /Ridge and conditioning card/u);
  assert.match(candidate, /m31RidgeConditioningCard\(\)/u);
  assert.match(candidate, /h\(t\)=t\^4/u);
  assert.match(candidate, /Rate versus trace/u);
  assert.match(candidate, /m31GradientDescentRateCard\(10\)/u);
  assert.match(candidate, /Same problem, different solver contract/u);
  assert.match(candidate, /result\.success/u);
  assert.match(candidate, /Find one mathematical bug and one branch\/tolerance question\s+before executing/u);
  assert.match(candidate, /at exact `raw\.x \+ raw\.y = 1`/u);
  assert.match(candidate, /Expected-gradient assumption card/u);
  assert.ok(candidate.includes("\\mathbb E[\\widehat g_t\\mid\\mathcal F_{t-1}]"));
  assert.match(candidate, /For a finite joint distribution/u);
  assert.match(candidate, /Counterexample — cached, dependent sampling/u);
  assert.match(candidate, /Multiple-start counterexample — a small gradient is not a good basin/u);
  assert.match(candidate, /cached estimate is `-1`/u);
  assert.match(candidate, /Conditional entropy before mutual information/u);
  assert.ok(candidate.includes("H(Y\\mid X)=\\sum_x P(X=x)H(Y\\mid X=x)"));
  assert.match(candidate, /Mutual-information and distortion card — derive one BSC first/u);
  assert.match(candidate, /P\(Y=1\)[\s\S]{0,180}\\tfrac12/u);
  assert.match(candidate, /not the generic mutual information for a biased\s+input/u);
  assert.match(candidate, /R\(D\)=1-h_2\(D\)/u);
  assert.match(candidate, /One-step ELBO identity — derive the gap before trusting the objective/u);
  assert.match(candidate, /Two-state ELBO equality table/u);
  assert.match(candidate, /m31TwoStateElboCard\(\)/u);
  assert.match(candidate, /needed log-ratio expectations are\s+integrable/u);
  assert.match(candidate, /posterior may not belong to the\s+family/u);
  assert.match(candidate, /small displayed primal\/dual gap/u);
  assert.match(candidate, /mean-field variational family reaches a higher ELBO/u);
  assert.match(candidate, /CMU 10-725 Convex Optimization/u);
  assert.match(candidate, /M25 evidence receipt/u);
  assert.match(candidate, /Distractor-to-misconception map/u);
  assert.match(candidate, /The card itself remains\s+local\/copyable/u);
  assert.match(candidate, /only when\s+the learner has said `records on`/u);
  assert.match(candidate, /configured private destination is\s+reachable/u);
  assert.match(candidate, /may report a saved note only after\s+direct evidence of a\s+successful write/u);

  const visualBlocks = scanMermaidBlocks(candidate, { sourcePath: authoringWorkbookPath });
  const visualReport = validateMermaidAccessibility(visualBlocks, { requireComplete: true });
  assert.equal(visualBlocks.length, 2);
  assert.equal(visualReport.summary.completeBlocks, 2);
  assert.ok(visualBlocks.every(({ metadata }) => metadata?.id.startsWith("m31-")));
  assert.ok(visualBlocks.every(({ metadata }) => metadata?.alternative.length >= 40));
});

test("the frozen M31 review candidate retains the study-ready structural spine", async () => {
  const candidate = await readFile(reviewCandidatePath, "utf8");

  for (const sessionNumber of [1, 2, 3, 4, 5, 6]) {
    assert.match(candidate, new RegExp(`^## Session ${sessionNumber} —`, "mu"));
  }
  assert.deepEqual(
    extractTableOfContents(candidate)
      .filter(({ depth, title }) => depth === 3 && title.startsWith("Output:"))
      .map(({ id }) => id),
    [
      "output-objective-geometry-sheet",
      "output-stationarity-and-feasibility-ledger",
      "output-constraint-claim-table",
      "output-solver-selection-rationale",
      "output-stochastic-information-experiment-card",
      "output-optimization-and-information-evidence-dossier",
    ],
  );
  assert.match(candidate, /^## Confidence-aware diagnostic and spaced review/mu);
  assert.match(candidate, /Teaching Assistant prompt — M31/u);
  assert.match(candidate, /Study Partner prompt — M31/u);
  assert.match(candidate, /^## Source and reuse boundary/mu);
  assert.match(candidate, /^## Candidate release boundary/mu);
  assert.ok(candidate.includes("A declared feasible domain \\(C\\) is **convex**"));
  assert.match(candidate, /at exact `raw\.x \+ raw\.y = 1`/u);
  assert.match(candidate, /For a finite joint distribution/u);
  assert.match(candidate, /Conditional entropy before mutual information/u);
  assert.ok(candidate.includes("H(Y\\mid X)=\\sum_x P(X=x)H(Y\\mid X=x)"));
  assert.match(candidate, /not the generic mutual information for a biased\s+input/u);
  assert.match(candidate, /small displayed primal\/dual gap/u);
  assert.match(candidate, /mean-field variational family reaches a higher ELBO/u);

  const visualBlocks = scanMermaidBlocks(candidate, { sourcePath: reviewCandidatePath });
  const visualReport = validateMermaidAccessibility(visualBlocks, { requireComplete: true });
  assert.equal(visualBlocks.length, 2);
  assert.equal(visualReport.summary.completeBlocks, 2);
  assert.ok(visualBlocks.every(({ metadata }) => metadata?.id.startsWith("m31-")));
  assert.ok(visualBlocks.every(({ metadata }) => metadata?.alternative.length >= 40));
});
