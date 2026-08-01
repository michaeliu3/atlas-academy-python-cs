/**
 * A deliberately small, deterministic M34 authoring fixture for Sessions 2
 * and 3. It exposes two decisions from the workbook: a frontier policy must
 * name its key, and a relaxation result must be checked in the original
 * model. It has no learner route, persistence, network, filesystem,
 * subprocess, package-installation, model-call, or general solver capability.
 */

const declaredFrontierEntries = Object.freeze([
  Object.freeze({ state: "A", accumulatedCost: 1, insertionOrder: 0 }),
  Object.freeze({ state: "B", accumulatedCost: 5, insertionOrder: 1 }),
]);

const declaredBinaryAssignments = Object.freeze([
  Object.freeze({ x: 0, y: 0 }),
  Object.freeze({ x: 0, y: 1 }),
  Object.freeze({ x: 1, y: 0 }),
  Object.freeze({ x: 1, y: 1 }),
]);

export const M34_BOUNDED_CLASSICAL_AI_FIXTURE = Object.freeze({
  id: "m34-s02-s03-bounded-frontier-and-relaxation-fixture",
  frontier: Object.freeze({
    entries: declaredFrontierEntries,
    lowestAccumulatedCostWinner: "A",
    lastInFirstOutWinner: "B",
    requiredPolicyFields: Object.freeze([
      "priority key",
      "tie rule",
      "duplicate policy",
      "goal-test timing",
      "cost domain",
      "reopen policy",
    ]),
  }),
  binaryMaximization: Object.freeze({
    objective: "maximize 2x + 2y",
    sharedConstraint: "2x + 2y <= 3",
    originalDomain: "x, y in {0, 1}",
    relaxedDomain: "0 <= x, y <= 1",
    originalMaximum: 2,
    relaxationWitness: Object.freeze({ x: 1, y: 0.5, objective: 3 }),
    relaxationUpperBound: 3,
  }),
  truthBoundary:
    "This fixture chooses between exactly two declared frontier entries and checks one finite two-variable relaxation witness. It does not traverse an arbitrary graph, establish BFS/UCS/A-star conditions, enforce a duplicate policy, solve a general CSP or optimization problem, or act as a theorem or decision oracle.",
});

function normalizedPolicy(policy) {
  if (policy !== "lowest-accumulated-cost" && policy !== "last-in-first-out") {
    throw new RangeError(
      "M34 fixture policy must be 'lowest-accumulated-cost' or 'last-in-first-out'.",
    );
  }
  return policy;
}

/**
 * Apply one explicitly named policy to the fixture's two visible frontier
 * entries. This is deliberately not a graph-search implementation: it cannot
 * expand states, discover edges, maintain a closed set, or establish an
 * optimality claim.
 *
 * @param {"lowest-accumulated-cost" | "last-in-first-out"} policy
 */
export function chooseM34DeclaredFrontierEntry(policy) {
  const normalized = normalizedPolicy(policy);
  const selected =
    normalized === "lowest-accumulated-cost"
      ? declaredFrontierEntries.reduce((best, candidate) =>
          candidate.accumulatedCost < best.accumulatedCost ? candidate : best,
        )
      : declaredFrontierEntries.at(-1);

  return {
    id: "m34-s02-bounded-frontier-policy-decision",
    policy: normalized,
    selected: { ...selected },
    entries: declaredFrontierEntries.map((entry) => ({ ...entry })),
    expectedWinner:
      normalized === "lowest-accumulated-cost"
        ? M34_BOUNDED_CLASSICAL_AI_FIXTURE.frontier.lowestAccumulatedCostWinner
        : M34_BOUNDED_CLASSICAL_AI_FIXTURE.frontier.lastInFirstOutWinner,
    policyIsFullySpecified: false,
    missingPolicyFields: [...M34_BOUNDED_CLASSICAL_AI_FIXTURE.frontier.requiredPolicyFields],
    truthBoundary:
      "The result names only the next entry for this two-item frontier. It is not evidence that either policy implements UCS, establishes a search guarantee, or remains correct under a different graph, tie rule, cost domain, duplicate policy, goal test, or reopen rule.",
  };
}

function normalizedCandidate(candidate) {
  if (
    candidate === null ||
    typeof candidate !== "object" ||
    Array.isArray(candidate) ||
    !Number.isFinite(candidate.x) ||
    !Number.isFinite(candidate.y)
  ) {
    throw new TypeError("M34 binary-relaxation candidates need finite numeric x and y values.");
  }
  return { x: candidate.x, y: candidate.y };
}

function binaryObjective({ x, y }) {
  return 2 * x + 2 * y;
}

function satisfiesSharedConstraint({ x, y }) {
  return 2 * x + 2 * y <= 3;
}

function liesInRelaxedDomain({ x, y }) {
  return x >= 0 && x <= 1 && y >= 0 && y <= 1;
}

function liesInOriginalBinaryDomain({ x, y }) {
  return (x === 0 || x === 1) && (y === 0 || y === 1);
}

/**
 * Check a candidate against both mathematical objects in the declared M34
 * fixture. The exact relaxed optimum is justified here only because the shared
 * capacity inequality gives objective <= 3 and the declared witness attains
 * 3. This function does not infer such a certificate for another model.
 *
 * @param {{ x: number, y: number }} candidate
 */
export function evaluateM34BinaryRelaxationCandidate(candidate) {
  const normalized = normalizedCandidate(candidate);
  const objective = binaryObjective(normalized);
  const sharedConstraintSatisfied = satisfiesSharedConstraint(normalized);
  const relaxedDomainSatisfied = liesInRelaxedDomain(normalized);
  const originalBinaryDomainSatisfied = liesInOriginalBinaryDomain(normalized);
  const relaxationFeasible = sharedConstraintSatisfied && relaxedDomainSatisfied;
  const originalFeasible = sharedConstraintSatisfied && originalBinaryDomainSatisfied;

  return {
    id: "m34-s03-binary-relaxation-status-check",
    candidate: normalized,
    objective,
    sharedConstraintSatisfied,
    relaxedDomainSatisfied,
    originalBinaryDomainSatisfied,
    relaxationFeasible,
    originalFeasible,
    status:
      relaxationFeasible && !originalFeasible
        ? "relaxation-only-candidate"
        : originalFeasible
          ? "original-feasible-candidate"
          : "outside-declared-relaxation",
    declaredOriginalMaximum:
      M34_BOUNDED_CLASSICAL_AI_FIXTURE.binaryMaximization.originalMaximum,
    declaredRelaxationUpperBound:
      M34_BOUNDED_CLASSICAL_AI_FIXTURE.binaryMaximization.relaxationUpperBound,
    candidateMatchesDeclaredRelaxationWitness:
      normalized.x === 1 && normalized.y === 0.5,
    originalFeasibleAssignments: declaredBinaryAssignments
      .filter(satisfiesSharedConstraint)
      .map((assignment) => ({
        ...assignment,
        objective: binaryObjective(assignment),
      })),
    exactRelaxationBoundJustification:
      "For this declared maximization fixture, the shared inequality is exactly the objective bound 2x + 2y <= 3, and the declared relaxed witness (1, 0.5) attains 3.",
    validInference:
      "A relaxation-feasible fractional candidate must still be checked against the original binary domain. The exact relaxed optimum of 3 is an upper bound on this declared original maximization problem, whose finite binary maximum is 2.",
    invalidInference:
      "A relaxation status or fractional witness does not solve the original binary problem merely because it is feasible for the relaxed model.",
    truthBoundary:
      "This evaluator checks stated constraints and a finite binary enumeration for one synthetic two-variable problem. It is not a general linear/integer-programming solver, rounding method, proof system, or decision recommendation.",
  };
}
