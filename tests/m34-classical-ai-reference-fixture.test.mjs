import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  scanMermaidBlocks,
  validateMermaidAccessibility,
} from "../lib/mermaid-accessibility.mjs";
import {
  M34_BOUNDED_CLASSICAL_AI_FIXTURE,
  chooseM34DeclaredFrontierEntry,
  evaluateM34BinaryRelaxationCandidate,
  m34Ac3RequeueCard,
  m34AStarNoReopenCounterexample,
  m34ObservationBoundaryCard,
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
  assert.equal(card.objectiveConvention, "finite-horizon, undiscounted total reward");
  assert.equal(card.policyAtInitialState, "inspect");
  assert.deepEqual(card.policyAtTerminalStates, { clear: "dispatch", blocked: "wait" });
  assert.equal(card.observationModel.terminalPolicyRequiresObservedSuccessor, true);
  assert.match(card.observationModel.terminalObservation, /clear.*blocked/u);
  assert.match(card.observationModel.hiddenSuccessorBoundary, /belief-state model/u);
  assert.match(card.truthBoundary, /not a general MDP planner/u);
});

test("the M34 observation card separates a world state from a shared signal and exposes a countermodel", () => {
  const card = m34ObservationBoundaryCard();

  assert.equal(card.id, "m34-s01-observation-versus-world-card");
  assert.equal(card.observation.keyRackLight, "lit");
  assert.equal(card.worlds.length, 2);
  assert.equal(card.worlds[0].takeKeyLegal, true);
  assert.equal(card.worlds[1].takeKeyLegal, false);
  assert.equal(card.sameObservationDifferentLegalAction, true);
  assert.equal(card.finiteModelCheck.proposition, "light-lit -> key-at-rack");
  assert.equal(card.finiteModelCheck.validInDeclaredWorldSet, false);
  assert.equal(card.finiteModelCheck.countermodel.worldId, "key-absent-light-lit");
  for (const evaluation of card.finiteModelCheck.evaluations) {
    assert.equal(evaluation.propositionTrue, !evaluation.lightLit || evaluation.keyAtRack);
  }
  assert.equal(
    card.finiteModelCheck.evaluations.some(({ propositionTrue }) => !propositionTrue),
    true,
  );
  assert.match(card.truthBoundary, /not a belief-state updater/u);
});

test("the M34 AC-3 card makes the predecessor requeue and empty-domain boundary inspectable", () => {
  const card = m34Ac3RequeueCard();

  assert.equal(card.id, "m34-s03-ac3-requeue-card");
  assert.deepEqual(card.initialDomains, { A: [1, 2], B: [1, 2], C: [2] });
  assert.deepEqual(card.steps[0].processedArc, "B->C");
  assert.deepEqual(card.steps[0].removed, { variable: "B", values: [2] });
  assert.deepEqual(card.steps[0].reEnqueuedPredecessorArcs, ["A->B"]);
  assert.deepEqual(card.steps[1].processedArc, "A->B");
  assert.deepEqual(card.steps[1].removed, { variable: "A", values: [1, 2] });
  assert.equal(card.steps[1].emptyDomain, "A");
  assert.equal(
    card.steps[0].removed.values.every(
      (value) => !card.steps[0].domainsAfter.C.some((support) => value < support),
    ),
    true,
  );
  assert.equal(
    card.steps[1].removed.values.every(
      (value) => !card.steps[1].domainsAfter.B.some((support) => value < support),
    ),
    true,
  );
  assert.match(card.truthBoundary, /not a general AC-3 implementation/u);
});

test("the M34 workbook puts both bounded fixtures in the relevant prediction and transfer sessions", async () => {
  const [workbook, candidate] = await Promise.all([
    readFile(
      "content/authoring/m34_classical_ai_search_constraints_decision_workbook.v1.md",
      "utf8",
    ),
    readFile("content/modules/34_classical_ai_search_constraints_decision.md", "utf8"),
  ]);

  assert.match(workbook, /### Bounded reference fixture — frontier policy/u);
  assert.match(
    workbook,
    /\[`m34-classical-ai-reference-fixture\.js`\]\(\.\.\/\.\.\/lib\/m34-classical-ai-reference-fixture\.js\)/u,
  );
  assert.match(
    candidate,
    /\[`m34-classical-ai-reference-fixture\.js`\]\(\.\.\/\.\.\/lib\/m34-classical-ai-reference-fixture\.js\)/u,
  );
  assert.match(workbook, /chooseM34DeclaredFrontierEntry/u);
  assert.match(workbook, /### Exact counterexample — admissible is not enough for no-reopen graph search/u);
  assert.ok(workbook.includes("no-reopen result has cost `4`"));
  assert.match(workbook, /reopened result has\s+cost `3`/u);
  assert.match(workbook, /m34AStarNoReopenCounterexample/u);
  assert.match(workbook, /0\\le h\(n\)\\le h\^\*\(n\)/u);
  assert.match(workbook, /### A-star guarantee regime audit/u);
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

test("the M34 workbook makes the model-construction audits explicit", async () => {
  const workbook = await readFile(
    "content/authoring/m34_classical_ai_search_constraints_decision_workbook.v1.md",
    "utf8",
  );

  assert.match(workbook, /### Relaxed-model heuristic audit — derive, then re-audit/u);
  assert.match(workbook, /M34-C01 -> S34-01, S34-04–S34-05, S34-18/u);
  assert.match(workbook, /h_\{\\mathrm\{relaxed\}\}\(n\)\\le h\^\*\(n\)/u);
  assert.match(workbook, /removes only the declared key precondition of `open-vault`/u);
  assert.match(workbook, /Every original route remains legal in the relaxed model/u);
  assert.match(workbook, /old heuristic can overestimate after a model change/u);
  assert.match(workbook, /### CSP as partial-assignment search/u);
  assert.match(workbook, /AC-3 queue/u);
  assert.match(workbook, /m34Ac3RequeueCard/u);
  assert.match(workbook, /re-enqueue `A->B`/u);
  assert.match(workbook, /### State-update card — name what changes and what persists/u);
  assert.match(workbook, /T\(s,a\) = \(s \\setminus Del\(a\)\) \\cup Add\(a\)/u);
  assert.match(workbook, /### Markov-sufficiency and horizon audit/u);
  assert.match(workbook, /finite-horizon, undiscounted/u);
  assert.match(workbook, /m34ObservationBoundaryCard/u);
  assert.match(workbook, /light-lit -> key-at-rack/u);
  assert.match(workbook, /observation becomes `clear` or `blocked` before the terminal action/u);
});

test("the M34 theory-breadth cards keep formal, probabilistic, partial-observation, and game claims bounded", async () => {
  const [workbook, candidate, sourceResearch] = await Promise.all([
    readFile("content/authoring/m34_classical_ai_search_constraints_decision_workbook.v1.md", "utf8"),
    readFile("content/modules/34_classical_ai_search_constraints_decision.md", "utf8"),
    readFile(
      "content/source-maps/module34_classical_ai_search_constraints_decision_source_research.md",
      "utf8",
    ),
  ]);

  for (const pack of [workbook, candidate]) {
    assert.match(pack, /### First-order logic and resolution/u);
    assert.match(pack, /### Bayesian networks and hidden Markov models/u);
    assert.match(pack, /### POMDPs and games/u);
    assert.match(pack, /Nash equilibrium/u);
    assert.match(pack, /M34-C10–M34-C12 -> S34-20–S34-22/u);
    assert.match(pack, /not refuted by this search/u);
    assert.match(pack, /belief distribution rather than a\s+known state/u);
  }

  for (const sourceId of ["S34-20", "S34-21", "S34-22"]) {
    assert.match(sourceResearch, new RegExp(`\\| ${sourceId} \\|`, "u"));
  }
  assert.match(sourceResearch, /\| M34-C10 \|/u);
  assert.match(sourceResearch, /\| M34-C11 \|/u);
  assert.match(sourceResearch, /\| M34-C12 \|/u);
});

test("the M34 final dossier keeps one-shot and sequential decision claims distinct", async () => {
  const workbook = await readFile(
    "content/authoring/m34_classical_ai_search_constraints_decision_workbook.v1.md",
    "utf8",
  );
  const packetStart = workbook.indexOf(
    "### Output: Classical AI Search, Constraints & Decision Packet",
  );
  const rubricStart = workbook.indexOf("### Acceptance rubric", packetStart);

  assert.ok(packetStart >= 0, "M34 should define its final connected packet");
  assert.ok(rubricStart > packetStart, "M34 should place an acceptance rubric after its packet");

  const packet = workbook.slice(packetStart, rubricStart);

  assert.match(
    packet,
    /decision artifact explicitly labelled `one-shot` or `sequential`/u,
  );
  assert.match(
    packet,
    /one-shot artifact must state that it does not establish a transition model or\s+policy/u,
  );
  assert.match(
    packet,
    /sequential artifact must name state, action, transition,\s+reward\/cost,\s+horizon, and continuation policy/u,
  );
  assert.match(workbook, /decision model[\s\S]{0,220}one-shot versus sequential/u);
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

test("the M34 authoring diagram keeps its declared prose alternative", async () => {
  const sourcePath = "content/authoring/m34_classical_ai_search_constraints_decision_workbook.v1.md";
  const workbook = await readFile(sourcePath, "utf8");
  const blocks = scanMermaidBlocks(workbook, { sourcePath });
  const report = validateMermaidAccessibility(blocks, { requireComplete: true });

  assert.equal(blocks.length, 2);
  assert.equal(report.summary.completeBlocks, 2);
  assert.deepEqual(blocks[0].metadata, {
    id: "m34-classical-ai-evidence-route",
    title: "The M34 route from a narrative to a bounded decision claim",
    alternative: "An accountable owner turns a narrative into states, observations, actions, goals, costs, constraints, and utilities. A search, CSP, planner, relaxation, or decision calculation is checked against theorem and implementation conditions. The result becomes a bounded recommendation with an abstention or review point, not automatic authority.",
  });
  assert.deepEqual(blocks[1].metadata, {
    id: "m34-model-search-decision-loop",
    title: "Model-search-decision loop",
    alternative: "The loop moves from a state or observation to a belief or feasible set, an action or expansion policy, an outcome, and a value and authority check before updating the model.",
  });
});
