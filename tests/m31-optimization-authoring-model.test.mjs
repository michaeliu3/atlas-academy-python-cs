import assert from "node:assert/strict";
import test from "node:test";

import {
  M31_STOCHASTIC_GRADIENT_FIXTURE,
  M31_TWO_VARIABLE_CONSTRAINED_QUADRATIC,
  evaluateM31BinaryChannelDistortion,
  evaluateM31DiscreteInformation,
  evaluateM31ConstrainedQuadratic,
  evaluateM31KktCertificate,
  isM31ConstrainedQuadraticFeasible,
  m31CentralDifferenceGradient,
  m31ConstraintResidual,
  m31ConstraintViolation,
  m31DoubleWellMultipleStartCard,
  m31ProjectedGradientTrace,
  m31QuadraticGradient,
  m31QuadraticObjective,
  m31StationarityCounterexample,
  m31StochasticGradientTrace,
} from "../lib/m31-optimization-authoring-model.js";

function assertApproximately(actual, expected, tolerance = 1e-7) {
  assert.ok(
    Math.abs(actual - expected) <= tolerance,
    `Expected ${actual} to be within ${tolerance} of ${expected}.`,
  );
}

test("the M31 fixture fixes a small, inspectable constrained quadratic", () => {
  assert.equal(
    M31_TWO_VARIABLE_CONSTRAINED_QUADRATIC.id,
    "m31-s01-s03-two-variable-constrained-quadratic",
  );
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

test("the declared M31 boundary minimizer has an inspectable bounded KKT certificate", () => {
  const certificate = evaluateM31KktCertificate({ x: 1, y: 0 }, 2);

  assert.deepEqual(certificate.point, { x: 1, y: 0 });
  assert.equal(certificate.multiplier, 2);
  assert.equal(certificate.primalFeasible, true);
  assert.equal(certificate.dualFeasible, true);
  assert.deepEqual(certificate.stationarityResidual, { x: 0, y: 0 });
  assert.equal(certificate.stationaritySatisfied, true);
  assert.equal(certificate.complementarySlacknessResidual, 0);
  assert.equal(certificate.complementarySlacknessProduct, 0);
  assert.equal(certificate.complementarySlacknessSatisfied, true);
  assert.equal(certificate.satisfiesDeclaredKktConditions, true);
  assert.match(certificate.truthBoundary, /one smooth convex constrained problem/u);
});

test("the M31 KKT fixture exposes its sign convention and exact-arithmetic boundary", () => {
  const convention = M31_TWO_VARIABLE_CONSTRAINED_QUADRATIC.kktConvention;

  assert.equal(convention.constraintSense, "g(x, y) <= 0");
  assert.equal(convention.lagrangian, "L(x, y, λ) = f(x, y) + λ g(x, y)");
  assert.equal(convention.multiplierDomain, "λ >= 0");
  assert.deepEqual(convention.constraintGradient, { x: 1, y: 1 });
  assert.deepEqual(convention.strictFeasibilityWitness, { x: 0, y: 0 });
  assert.equal(isM31ConstrainedQuadraticFeasible(convention.strictFeasibilityWitness), true);
  assert.equal(m31ConstraintResidual(convention.strictFeasibilityWitness), -1);
  assert.match(convention.exactArithmeticBoundary, /does not define a numerical tolerance policy/u);

  const certificate = evaluateM31KktCertificate({ x: 1, y: 0 }, 2);
  assert.equal(certificate.kktConvention, convention);
  assert.throws(
    () => evaluateM31KktCertificate({ x: 1, y: 0 }, Number.NaN),
    /multipliers need to be finite/u,
  );
});

test("the bounded KKT evaluator keeps each failed condition visible without making a general solver claim", () => {
  const negativeMultiplier = evaluateM31KktCertificate({ x: 1, y: 0 }, -2);
  assert.equal(negativeMultiplier.primalFeasible, true);
  assert.equal(negativeMultiplier.dualFeasible, false);
  assert.deepEqual(negativeMultiplier.stationarityResidual, { x: -4, y: -4 });
  assert.equal(negativeMultiplier.satisfiesDeclaredKktConditions, false);

  const zeroMultiplier = evaluateM31KktCertificate({ x: 1, y: 0 }, 0);
  assert.equal(zeroMultiplier.primalFeasible, true);
  assert.equal(zeroMultiplier.dualFeasible, true);
  assert.deepEqual(zeroMultiplier.stationarityResidual, { x: -2, y: -2 });
  assert.equal(zeroMultiplier.stationaritySatisfied, false);
  assert.equal(zeroMultiplier.satisfiesDeclaredKktConditions, false);

  const strictFeasiblePoint = evaluateM31KktCertificate({ x: 0.5, y: -0.5 }, 3);
  assert.equal(strictFeasiblePoint.primalFeasible, true);
  assert.equal(strictFeasiblePoint.dualFeasible, true);
  assert.deepEqual(strictFeasiblePoint.stationarityResidual, { x: 0, y: 0 });
  assert.equal(strictFeasiblePoint.complementarySlacknessResidual, -3);
  assert.equal(strictFeasiblePoint.complementarySlacknessSatisfied, false);
  assert.equal(strictFeasiblePoint.satisfiesDeclaredKktConditions, false);

  const infeasibleStationaryPoint = evaluateM31KktCertificate({ x: 2, y: 1 }, 0);
  assert.equal(infeasibleStationaryPoint.primalFeasible, false);
  assert.equal(infeasibleStationaryPoint.dualFeasible, true);
  assert.deepEqual(infeasibleStationaryPoint.stationarityResidual, { x: 0, y: 0 });
  assert.equal(infeasibleStationaryPoint.complementarySlacknessSatisfied, true);
  assert.equal(infeasibleStationaryPoint.satisfiesDeclaredKktConditions, false);
  assert.match(infeasibleStationaryPoint.truthBoundary, /does not validate a general solver/u);
});

test("the M31 projected-gradient trace keeps objective, projection, and hard-constraint evidence separate", () => {
  const trace = m31ProjectedGradientTrace({
    initialPoint: { x: 0, y: 0 },
    stepSize: 0.25,
    iterations: 6,
  });

  assert.equal(trace.id, "m31-s04-projected-gradient-trace");
  assert.equal(trace.records.length, 7);
  assert.deepEqual(trace.records[0].point, { x: 0, y: 0 });
  assert.equal(trace.records[0].iteration, 0);
  assert.ok(trace.records.every(({ feasible, constraintViolation }) => feasible && constraintViolation === 0));
  assert.ok(trace.records.at(-1).objective < trace.records[0].objective);
  assert.ok(trace.records.some(({ projectionApplied }) => projectionApplied));
  assert.match(trace.truthBoundary, /one projected update rule/u);
  assert.throws(
    () => m31ProjectedGradientTrace({ initialPoint: { x: 0, y: 0 }, stepSize: 0.25, iterations: 0 }),
    /iterations must be an integer from 1 through 64/u,
  );
});

test("the M31 stochastic trace makes estimator noise and a finite run visible", () => {
  const trace = m31StochasticGradientTrace({
    initialParameter: 0,
    stepSize: 0.1,
    noiseSequence: M31_STOCHASTIC_GRADIENT_FIXTURE.noiseSequence,
  });

  assert.equal(trace.id, "m31-s05-fixed-noisy-gradient-trace");
  assert.equal(trace.records.length, M31_STOCHASTIC_GRADIENT_FIXTURE.noiseSequence.length + 1);
  assert.equal(trace.meanDeclaredNoise, 0);
  assert.equal(trace.records[0].parameter, 0);
  assert.ok(
    trace.records.slice(1).some(({ gradientEstimate, fullGradient }) => gradientEstimate !== fullGradient),
  );
  assert.ok(Number.isFinite(trace.records.at(-1).objective));
  assert.match(trace.truthBoundary, /does not establish a convergence theorem/u);
  assert.throws(
    () => m31StochasticGradientTrace({ initialParameter: 0, stepSize: 0.1, noiseSequence: [] }),
    /non-empty finite noise sequence/u,
  );
});

test("the M31 multiple-start card makes a nonconvex stationary maximum visible", () => {
  const card = m31DoubleWellMultipleStartCard();

  assert.equal(card.id, "m31-s05-double-well-multiple-start-card");
  assert.equal(card.stepSize, 0.1);
  assert.deepEqual(
    card.records.map(({ initialParameter }) => initialParameter),
    [-0.2, 0, 0.2],
  );
  assertApproximately(card.records[0].nextParameter, -0.2768);
  assertApproximately(card.records[1].nextParameter, 0);
  assertApproximately(card.records[2].nextParameter, 0.2768);
  assert.equal(card.records[1].stationaryClassification, "stationary local maximum in the declared analytic fixture");
  assert.deepEqual(card.knownStationaryPoints, [
    { parameter: -1, classification: "global minimum" },
    { parameter: 0, classification: "local maximum" },
    { parameter: 1, classification: "global minimum" },
  ]);
  assert.match(card.truthBoundary, /does not establish convergence/u);
});

test("the M31 finite information card distinguishes entropy, cross-entropy, and KL with support checks", () => {
  const metrics = evaluateM31DiscreteInformation([0.5, 0.5], [0.75, 0.25]);
  const identity = evaluateM31DiscreteInformation([0.5, 0.5], [0.5, 0.5]);

  assertApproximately(metrics.entropyNats, Math.log(2));
  assertApproximately(metrics.crossEntropyNats - metrics.entropyNats, metrics.klDivergenceNats);
  assert.ok(metrics.klDivergenceNats > 0);
  assertApproximately(identity.klDivergenceNats, 0);
  assert.equal(metrics.supportCompatible, true);
  assert.match(metrics.truthBoundary, /finite categorical distributions/u);
  assert.throws(
    () => evaluateM31DiscreteInformation([0.5, 0.5], [1, 0]),
    /strictly positive wherever the reference distribution is positive/u,
  );
});

test("the M31 binary information card keeps channel and distortion formulas in their declared scope", () => {
  const card = evaluateM31BinaryChannelDistortion({
    crossoverProbability: 0.1,
    distortionLevel: 0.1,
  });
  const maximallyNoisy = evaluateM31BinaryChannelDistortion({
    crossoverProbability: 0.5,
    distortionLevel: 0.5,
  });

  assert.equal(card.id, "m31-s06-binary-channel-distortion-card");
  assertApproximately(card.mutualInformationBits, 0.5310044064107188);
  assertApproximately(card.rateDistortionBitsPerSymbol, 0.5310044064107188);
  assertApproximately(maximallyNoisy.mutualInformationBits, 0);
  assertApproximately(maximallyNoisy.rateDistortionBitsPerSymbol, 0);
  assert.match(card.theoremScope, /uniform iid binary source/u);
  assert.match(card.truthBoundary, /changed source law or distortion measure/u);
  assert.throws(
    () => evaluateM31BinaryChannelDistortion({ crossoverProbability: 0.6, distortionLevel: 0.1 }),
    /crossoverProbability must be a finite probability from 0 through 0.5/u,
  );
});
