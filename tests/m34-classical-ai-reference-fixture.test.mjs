import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  M34_BOUNDED_CLASSICAL_AI_FIXTURE,
  chooseM34DeclaredFrontierEntry,
  evaluateM34BinaryRelaxationCandidate,
} from "../lib/m34-classical-ai-reference-fixture.js";

test("the M34 fixture makes two distinct frontier policies choose their declared next entries", () => {
  const lowestCost = chooseM34DeclaredFrontierEntry("lowest-accumulated-cost");
  const lastInFirstOut = chooseM34DeclaredFrontierEntry("last-in-first-out");

  assert.equal(M34_BOUNDED_CLASSICAL_AI_FIXTURE.id, "m34-s02-s03-bounded-frontier-and-relaxation-fixture");
  assert.deepEqual(lowestCost.selected, {
    state: "A",
    accumulatedCost: 1,
    insertionOrder: 0,
  });
  assert.equal(lowestCost.expectedWinner, "A");
  assert.deepEqual(lastInFirstOut.selected, {
    state: "B",
    accumulatedCost: 5,
    insertionOrder: 1,
  });
  assert.equal(lastInFirstOut.expectedWinner, "B");
  assert.equal(lowestCost.policyIsFullySpecified, false);
  assert.ok(lowestCost.missingPolicyFields.includes("duplicate policy"));
  assert.match(lowestCost.truthBoundary, /not evidence that either policy implements UCS/u);
  assert.throws(
    () => chooseM34DeclaredFrontierEntry("lowest-f"),
    /must be 'lowest-accumulated-cost' or 'last-in-first-out'/u,
  );
});

test("the M34 relaxation witness stays distinct from an original binary solution", () => {
  const witness = evaluateM34BinaryRelaxationCandidate({ x: 1, y: 0.5 });
  const originalFeasible = evaluateM34BinaryRelaxationCandidate({ x: 1, y: 0 });

  assert.equal(witness.objective, 3);
  assert.equal(witness.sharedConstraintSatisfied, true);
  assert.equal(witness.relaxedDomainSatisfied, true);
  assert.equal(witness.originalBinaryDomainSatisfied, false);
  assert.equal(witness.relaxationFeasible, true);
  assert.equal(witness.originalFeasible, false);
  assert.equal(witness.status, "relaxation-only-candidate");
  assert.equal(witness.candidateMatchesDeclaredRelaxationWitness, true);
  assert.equal(witness.declaredOriginalMaximum, 2);
  assert.equal(witness.declaredRelaxationUpperBound, 3);
  assert.deepEqual(witness.originalFeasibleAssignments, [
    { x: 0, y: 0, objective: 0 },
    { x: 0, y: 1, objective: 2 },
    { x: 1, y: 0, objective: 2 },
  ]);
  assert.match(witness.validInference, /upper bound/u);
  assert.match(witness.invalidInference, /does not solve the original binary problem/u);
  assert.match(witness.truthBoundary, /not a general linear\/integer-programming solver/u);

  assert.equal(originalFeasible.originalFeasible, true);
  assert.equal(originalFeasible.status, "original-feasible-candidate");
  assert.equal(originalFeasible.objective, 2);
  assert.throws(
    () => evaluateM34BinaryRelaxationCandidate({ x: Number.NaN, y: 0 }),
    /need finite numeric x and y/u,
  );
});

test("the M34 workbook puts both bounded fixtures in the relevant prediction and transfer sessions", async () => {
  const workbook = await readFile(
    "content/authoring/m34_classical_ai_search_constraints_decision_workbook.v1.md",
    "utf8",
  );

  assert.match(workbook, /### Bounded reference fixture — frontier policy/u);
  assert.match(workbook, /chooseM34DeclaredFrontierEntry/u);
  assert.match(workbook, /### Bounded reference fixture — relaxation status/u);
  assert.match(workbook, /evaluateM34BinaryRelaxationCandidate\(\{ x: 1, y: 0\.5 \}\)/u);
});

test("the M34 workbook makes propagation and decision-horizon boundaries inspectable", async () => {
  const workbook = await readFile(
    "content/authoring/m34_classical_ai_search_constraints_decision_workbook.v1.md",
    "utf8",
  );

  assert.match(workbook, /### Prediction before reveal — propagation and branching trace/u);
  assert.ok(workbook.includes("Arc consistency removes \\(C=1\\)"));
  assert.match(workbook, /declared alphabetical MRV tie-break/u);
  assert.ok(workbook.includes("the stated MRV tie-break selects \\(A\\)"));
  assert.match(workbook, /LCV compares its\s+legal values/u);
  assert.match(workbook, /### One-shot expected utility is not an MDP policy/u);
  assert.ok(workbook.includes("transition model \\(P(s'\\mid s,a)\\)"));
  assert.match(workbook, /Repetition alone supplies neither a transition model nor a\s+long-run objective/u);
});
