import assert from "node:assert/strict";
import test from "node:test";

import {
  M31_TWO_VARIABLE_CONSTRAINED_QUADRATIC,
  evaluateM31ConstrainedQuadratic,
  isM31ConstrainedQuadraticFeasible,
  m31CentralDifferenceGradient,
  m31ConstraintResidual,
  m31ConstraintViolation,
  m31QuadraticGradient,
  m31QuadraticObjective,
  m31StationarityCounterexample,
} from "../lib/m31-optimization-authoring-model.js";

function assertApproximately(actual, expected, tolerance = 1e-7) {
  assert.ok(
    Math.abs(actual - expected) <= tolerance,
    `Expected ${actual} to be within ${tolerance} of ${expected}.`,
  );
}

test("the M31 fixture fixes a small, inspectable constrained quadratic", () => {
  assert.deepEqual(M31_TWO_VARIABLE_CONSTRAINED_QUADRATIC.variables, ["x", "y"]);
  assert.deepEqual(M31_TWO_VARIABLE_CONSTRAINED_QUADRATIC.unconstrainedStationaryPoint, {
    x: 2,
    y: 1,
  });
  assert.deepEqual(M31_TWO_VARIABLE_CONSTRAINED_QUADRATIC.constrainedBoundaryMinimizer, {
    x: 1,
    y: 0,
  });

  const stationary = evaluateM31ConstrainedQuadratic({ x: 2, y: 1 });
  assert.equal(stationary.objective, 0);
  assert.deepEqual(stationary.gradient, { x: 0, y: 0 });
  assert.equal(stationary.constraintResidual, 2);
  assert.equal(stationary.constraintViolation, 2);
  assert.equal(stationary.feasible, false);
});

test("the M31 fixture distinguishes an exactly feasible boundary from infeasible points", () => {
  const boundary = evaluateM31ConstrainedQuadratic({ x: 1, y: 0 });
  assert.equal(boundary.objective, 2);
  assert.deepEqual(boundary.gradient, { x: -2, y: -2 });
  assert.equal(boundary.constraintResidual, 0);
  assert.equal(boundary.constraintViolation, 0);
  assert.equal(boundary.feasible, true);

  assert.equal(isM31ConstrainedQuadraticFeasible({ x: 0, y: 0 }), true);
  assert.equal(isM31ConstrainedQuadraticFeasible({ x: 1, y: 0.25 }), false);
  assert.equal(m31ConstraintResidual({ x: 1, y: 0.25 }), 0.25);
  assert.equal(m31ConstraintViolation({ x: 1, y: 0.25 }), 0.25);
});

test("the analytic gradient agrees with a bounded central finite-difference check", () => {
  const point = { x: 1.25, y: -0.5 };
  const analytic = m31QuadraticGradient(point);
  const numerical = m31CentralDifferenceGradient(point, 1e-6);

  assert.equal(m31QuadraticObjective(point), 2.8125);
  assertApproximately(numerical.x, analytic.x);
  assertApproximately(numerical.y, analytic.y);
});

test("zero unconstrained gradient does not establish constrained feasibility or optimality", () => {
  const counterexample = m31StationarityCounterexample();

  assert.equal(counterexample.zeroGradientPointHasZeroGradient, true);
  assert.equal(counterexample.zeroGradientPointIsFeasible, false);
  assert.equal(counterexample.zeroGradientPointCanCertifyConstrainedOptimality, false);
  assert.equal(counterexample.boundaryConstrainedMinimumHasZeroGradient, false);
  assert.equal(counterexample.zeroGradientPoint.constraintViolation, 2);
  assert.equal(counterexample.boundaryConstrainedMinimum.constraintResidual, 0);
});
