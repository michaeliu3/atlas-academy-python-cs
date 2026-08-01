import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  M34_BOUNDED_CLASSICAL_AI_FIXTURE,
  chooseM34DeclaredFrontierEntry,
  evaluateM34BinaryRelaxationCandidate,
  m34AStarNoReopenCounterexample,
  m34TwoStageMdpBackupCard,
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

test("the M34 A-star card keeps admissibility, consistency, and reopen policy distinct", () => {
  const card = m34AStarNoReopenCounterexample();

  assert.equal(card.id, "m34-s02-admissible-inconsistent-no-reopen-card");
  assert.equal(card.noReopenResult.returnedGoalCost, 4);
  assert.equal(card.reopenResult.returnedGoalCost, 3);
  assert.equal(card.heuristic.admissible, true);
  assert.equal(card.heuristic.consistent, false);
  assert.deepEqual(card.heuristic.violatedEdge, { from: "B", to: "A", cost: 1 });
  for (const [state, value] of Object.entries(card.heuristic.values)) {
    assert.ok(value <= card.graph.trueRemainingCosts[state], `${state} must remain admissible`);
  }
  assert.ok(
    card.heuristic.values.B >
      card.heuristic.violatedEdge.cost + card.heuristic.values.A,
    "B -> A must witness the stated consistency violation",
  );
  assert.equal(
    card.policy.openFrontierPolicy,
    "replace an open frontier entry when a strictly lower g is found; discard a stale higher-g entry if it is later removed",
  );
  assert.equal(card.policy.goalTest, "when a goal is removed from the frontier");
  assert.match(card.reopenResult.trace[2], /replace open G with g=3/u);
  assert.match(card.truthBoundary, /not a general A-star implementation/u);
});

test("the M34 two-stage card exposes one Bellman backup without becoming an MDP solver", () => {
  const card = m34TwoStageMdpBackupCard();

  assert.equal(card.id, "m34-s05-two-stage-mdp-backup-card");
  assert.equal(card.horizon, 2);
  assert.equal(card.terminalValues.clear, 3);
  assert.equal(card.terminalValues.blocked, 1);
  assert.equal(card.rewards.inspectImmediate, -0.5);
  assert.equal(
    card.initialActionValues.inspect,
    card.rewards.inspectImmediate +
      0.5 * card.terminalValues.clear +
      0.5 * card.terminalValues.blocked,
  );
  assert.equal(card.initialActionValues.inspect, 1.5);
  assert.equal(card.initialActionValues.safe, 1.2);
  assert.equal(card.policyAtInitialState, "inspect");
  assert.deepEqual(card.policyAtTerminalStates, { clear: "dispatch", blocked: "wait" });
  assert.match(card.truthBoundary, /not a general MDP planner/u);
});

test("the M34 workbook puts both bounded fixtures in the relevant prediction and transfer sessions", async () => {
  const workbook = await readFile(
    "content/authoring/m34_classical_ai_search_constraints_decision_workbook.v1.md",
    "utf8",
  );

  assert.match(workbook, /### Bounded reference fixture — frontier policy/u);
  assert.match(workbook, /chooseM34DeclaredFrontierEntry/u);
  assert.match(workbook, /### Exact counterexample — admissible is not enough for no-reopen graph search/u);
  assert.ok(workbook.includes("no-reopen result has cost `4`"));
  assert.match(workbook, /reopened result has\s+cost `3`/u);
  assert.match(workbook, /m34AStarNoReopenCounterexample/u);
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
  assert.match(workbook, /### A two-step Bellman backup/u);
  assert.match(workbook, /Q_0\(s_0,\\text\{inspect\}\)=-0\.5\+0\.5\(3\)\+0\.5\(1\)=1\.5/u);
});

test("the M34 planning trace and CP-SAT status matrix retain their model boundaries", async () => {
  const [workbook, sourceResearch] = await Promise.all([
    readFile("content/authoring/m34_classical_ai_search_constraints_decision_workbook.v1.md", "utf8"),
    readFile(
      "content/source-maps/module34_classical_ai_search_constraints_decision_source_research.md",
      "utf8",
    ),
  ]);

  assert.match(workbook, /### Fixed planning trace — state and action effects/u);
  assert.match(workbook, /s_0=\(\\text\{room=Entry\}/u);
  assert.match(workbook, /take-key → move-to-vault → open-vault/u);
  assert.match(workbook, /access window has capacity for only two ticks/u);
  assert.match(workbook, /### CP-SAT status matrix — a model result is not a world conclusion/u);
  for (const status of ["OPTIMAL", "FEASIBLE", "INFEASIBLE", "MODEL_INVALID", "UNKNOWN"]) {
    assert.match(workbook, new RegExp("\\| `" + status + "` \\|", "u"));
  }
  assert.match(workbook, /none\s+turns a formal result into a decision authorization/u);
  assert.match(sourceResearch, /Karp.*https:\/\/doi\.org\/10\.1007\/978-1-4684-2001-2_9/iu);
  assert.doesNotMatch(sourceResearch, /https:\/\/doi\.org\/10\.1137\/0201010/u);
});
