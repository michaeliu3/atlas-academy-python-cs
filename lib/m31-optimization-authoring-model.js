/**
 * A deliberately small, deterministic M31 authoring fixture for Sessions 01
 * through 06. It has no learner route, persistence, network, filesystem,
 * subprocess, package-installation, or model-call capability. Its purpose is
 * to make the formulation/local-reasoning boundary inspectable before any
 * future learner-facing studio is designed or reviewed.
 */

const unconstrainedStationaryPoint = Object.freeze({ x: 2, y: 1 });
const constrainedBoundaryMinimizer = Object.freeze({ x: 1, y: 0 });
const kktConvention = Object.freeze({
  constraintSense: "g(x, y) <= 0",
  lagrangian: "L(x, y, λ) = f(x, y) + λ g(x, y)",
  multiplierDomain: "λ >= 0",
  constraintGradient: Object.freeze({ x: 1, y: 1 }),
  strictFeasibilityWitness: Object.freeze({ x: 0, y: 0 }),
  exactArithmeticBoundary:
    "This checker uses exact equality only for the declared analytic rational fixture; it does not define a numerical tolerance policy.",
});

export const M31_TWO_VARIABLE_CONSTRAINED_QUADRATIC = Object.freeze({
  id: "m31-s01-s03-two-variable-constrained-quadratic",
  variables: Object.freeze(["x", "y"]),
  objective: "f(x, y) = (x - 2)^2 + (y - 1)^2",
  hardConstraint: "g(x, y) = x + y - 1 <= 0",
  unconstrainedStationaryPoint,
  constrainedBoundaryMinimizer,
  kktConvention,
  truthBoundary:
    "This exact fixture demonstrates one smooth convex constrained problem. It does not validate a general solver, a proxy objective, a decision, or a constrained-optimality claim outside its declared objective and feasible set.",
});

function normalizedPoint(point) {
  if (
    point === null ||
    typeof point !== "object" ||
    Array.isArray(point) ||
    !Number.isFinite(point.x) ||
    !Number.isFinite(point.y)
  ) {
    throw new TypeError("M31 constrained-quadratic points need finite numeric x and y coordinates.");
  }
  return { x: point.x, y: point.y };
}

function normalizedTolerance(tolerance) {
  if (!Number.isFinite(tolerance) || tolerance < 0) {
    throw new TypeError("M31 constrained-quadratic feasibility tolerance must be finite and non-negative.");
  }
  return tolerance;
}

function objectiveAt({ x, y }) {
  return (x - 2) ** 2 + (y - 1) ** 2;
}

function gradientAt({ x, y }) {
  return { x: 2 * (x - 2), y: 2 * (y - 1) };
}

function constraintResidualAt({ x, y }) {
  return x + y - 1;
}

/**
 * Evaluate the declared objective f(x, y), not a penalty surrogate.
 *
 * @param {{ x: number, y: number }} point
 */
export function m31QuadraticObjective(point) {
  return objectiveAt(normalizedPoint(point));
}

/**
 * The analytic gradient of the declared objective, independent of the hard
 * constraint. A zero value therefore says nothing by itself about feasibility.
 *
 * @param {{ x: number, y: number }} point
 */
export function m31QuadraticGradient(point) {
  return gradientAt(normalizedPoint(point));
}

/**
 * Signed residual for g(x, y) <= 0. Positive values are hard-constraint
 * violations; zero is on the boundary; negative values are strictly feasible.
 *
 * @param {{ x: number, y: number }} point
 */
export function m31ConstraintResidual(point) {
  return constraintResidualAt(normalizedPoint(point));
}

/**
 * The non-negative amount by which the declared hard constraint is violated.
 *
 * @param {{ x: number, y: number }} point
 */
export function m31ConstraintViolation(point) {
  return Math.max(0, m31ConstraintResidual(point));
}

/**
 * @param {{ x: number, y: number }} point
 * @param {number} [tolerance]
 */
export function isM31ConstrainedQuadraticFeasible(point, tolerance = 0) {
  return m31ConstraintResidual(point) <= normalizedTolerance(tolerance);
}

/**
 * A bounded central-difference check for the objective gradient. It is an
 * independent numerical comparison, not a proof about another objective,
 * constraint set, dtype, or finite implementation.
 *
 * @param {{ x: number, y: number }} point
 * @param {number} [step]
 */
export function m31CentralDifferenceGradient(point, step = 1e-6) {
  const normalized = normalizedPoint(point);
  if (!Number.isFinite(step) || step <= 0) {
    throw new TypeError("M31 constrained-quadratic finite-difference step must be finite and positive.");
  }
  return {
    x:
      (objectiveAt({ ...normalized, x: normalized.x + step }) -
        objectiveAt({ ...normalized, x: normalized.x - step })) /
      (2 * step),
    y:
      (objectiveAt({ ...normalized, y: normalized.y + step }) -
        objectiveAt({ ...normalized, y: normalized.y - step })) /
      (2 * step),
  };
}

/**
 * Return every small quantity needed to inspect the declared problem at one
 * point. The result does not assert that a point is globally optimal.
 *
 * @param {{ x: number, y: number }} point
 * @param {number} [feasibilityTolerance]
 */
export function evaluateM31ConstrainedQuadratic(point, feasibilityTolerance = 0) {
  const normalized = normalizedPoint(point);
  const tolerance = normalizedTolerance(feasibilityTolerance);
  const residual = constraintResidualAt(normalized);
  return {
    point: normalized,
    objective: objectiveAt(normalized),
    gradient: gradientAt(normalized),
    constraintResidual: residual,
    constraintViolation: Math.max(0, residual),
    feasible: residual <= tolerance,
  };
}

/**
 * Evaluate the KKT conditions for this one declared smooth, convex,
 * affine-constrained fixture using L(x, y, λ) = f(x, y) + λ g(x, y).
 * This is a worked certificate checker, not a general solver or a claim about
 * a different objective, constraint set, or optimization decision.
 *
 * @param {{ x: number, y: number }} point
 * @param {number} multiplier
 */
export function evaluateM31KktCertificate(point, multiplier) {
  const normalized = normalizedPoint(point);
  if (!Number.isFinite(multiplier)) {
    throw new TypeError("M31 KKT multipliers need to be finite numbers.");
  }
  const evaluation = evaluateM31ConstrainedQuadratic(normalized);
  const stationarityResidual = {
    x: evaluation.gradient.x + multiplier,
    y: evaluation.gradient.y + multiplier,
  };
  const complementarySlacknessProduct = multiplier * evaluation.constraintResidual;
  const primalFeasible = evaluation.feasible;
  const dualFeasible = multiplier >= 0;
  const stationaritySatisfied =
    stationarityResidual.x === 0 && stationarityResidual.y === 0;
  const complementarySlacknessSatisfied = complementarySlacknessProduct === 0;

  return {
    id: "m31-s03-bounded-kkt-certificate",
    point: normalized,
    multiplier,
    objective: evaluation.objective,
    gradient: evaluation.gradient,
    constraintResidual: evaluation.constraintResidual,
    kktConvention,
    primalFeasible,
    dualFeasible,
    stationarityResidual,
    stationaritySatisfied,
    complementarySlacknessProduct,
    complementarySlacknessResidual: complementarySlacknessProduct,
    complementarySlacknessSatisfied,
    satisfiesDeclaredKktConditions:
      primalFeasible &&
      dualFeasible &&
      stationaritySatisfied &&
      complementarySlacknessSatisfied,
    truthBoundary: M31_TWO_VARIABLE_CONSTRAINED_QUADRATIC.truthBoundary,
  };
}

/**
 * The exact, inspectable counterexample for M31-S02: the unconstrained
 * stationary point (2, 1) has gradient zero but violates x + y <= 1. The
 * exact constrained minimizer (1, 0) is feasible on the boundary and has a
 * nonzero ordinary objective gradient. Constraint-aware reasoning is needed.
 */
export function m31StationarityCounterexample() {
  const zeroGradientPoint = evaluateM31ConstrainedQuadratic(unconstrainedStationaryPoint);
  const boundaryConstrainedMinimum = evaluateM31ConstrainedQuadratic(
    constrainedBoundaryMinimizer,
  );
  return {
    id: "m31-s02-zero-unconstrained-gradient-is-not-constrained-certificate",
    zeroGradientPoint,
    boundaryConstrainedMinimum,
    zeroGradientPointHasZeroGradient:
      zeroGradientPoint.gradient.x === 0 && zeroGradientPoint.gradient.y === 0,
    zeroGradientPointIsFeasible: zeroGradientPoint.feasible,
    zeroGradientPointCanCertifyConstrainedOptimality: false,
    boundaryConstrainedMinimumHasZeroGradient:
      boundaryConstrainedMinimum.gradient.x === 0 &&
      boundaryConstrainedMinimum.gradient.y === 0,
    conclusion:
      "A zero unconstrained objective gradient at (2, 1) does not establish constrained feasibility or optimality here because that point violates the declared hard constraint by 2. The feasible boundary minimum (1, 0) instead needs constraint-aware reasoning.",
  };
}

function normalizedStepSize(stepSize, label) {
  if (!Number.isFinite(stepSize) || stepSize <= 0) {
    throw new TypeError(`${label} stepSize must be finite and positive.`);
  }
  return stepSize;
}

function normalizedIterationCount(iterations, label) {
  if (!Number.isInteger(iterations) || iterations < 1 || iterations > 64) {
    throw new RangeError(`${label} iterations must be an integer from 1 through 64.`);
  }
  return iterations;
}

function projectedOntoM31FeasibleHalfspace(point) {
  const normalized = normalizedPoint(point);
  const residual = constraintResidualAt(normalized);
  if (residual <= 0) {
    return { point: normalized, projectionApplied: false };
  }
  const correction = residual / 2;
  return {
    point: { x: normalized.x - correction, y: normalized.y - correction },
    projectionApplied: true,
  };
}

function m31TraceRecord(iteration, point, { projectionApplied, rawCandidate } = {}) {
  const evaluation = evaluateM31ConstrainedQuadratic(point);
  return {
    iteration,
    point: evaluation.point,
    objective: evaluation.objective,
    gradient: evaluation.gradient,
    gradientNorm: Math.hypot(evaluation.gradient.x, evaluation.gradient.y),
    constraintResidual: evaluation.constraintResidual,
    constraintViolation: evaluation.constraintViolation,
    feasible: evaluation.feasible,
    projectionApplied: Boolean(projectionApplied),
    rawCandidate: rawCandidate ?? null,
  };
}

/**
 * Trace one explicit projected-gradient update rule against the exact M31
 * constrained-quadratic fixture. Each row exposes the raw candidate and the
 * half-space projection; it does not choose a general solver or prove a rate.
 *
 * @param {{ initialPoint: { x: number, y: number }, stepSize: number, iterations: number }} configuration
 */
export function m31ProjectedGradientTrace({ initialPoint, stepSize, iterations }) {
  const normalizedInitialPoint = normalizedPoint(initialPoint);
  const normalizedStep = normalizedStepSize(stepSize, "M31 projected-gradient");
  const normalizedIterations = normalizedIterationCount(iterations, "M31 projected-gradient");
  const initialProjection = projectedOntoM31FeasibleHalfspace(normalizedInitialPoint);
  let currentPoint = initialProjection.point;
  const records = [
    m31TraceRecord(0, currentPoint, {
      projectionApplied: initialProjection.projectionApplied,
      rawCandidate: initialProjection.projectionApplied ? normalizedInitialPoint : null,
    }),
  ];

  for (let iteration = 1; iteration <= normalizedIterations; iteration += 1) {
    const gradient = gradientAt(currentPoint);
    const rawCandidate = {
      x: currentPoint.x - normalizedStep * gradient.x,
      y: currentPoint.y - normalizedStep * gradient.y,
    };
    const projected = projectedOntoM31FeasibleHalfspace(rawCandidate);
    currentPoint = projected.point;
    records.push(
      m31TraceRecord(iteration, currentPoint, {
        projectionApplied: projected.projectionApplied,
        rawCandidate,
      }),
    );
  }

  return {
    id: "m31-s04-projected-gradient-trace",
    problem: M31_TWO_VARIABLE_CONSTRAINED_QUADRATIC,
    configuration: {
      initialPoint: normalizedInitialPoint,
      stepSize: normalizedStep,
      iterations: normalizedIterations,
      updateRule: "x_next = projection_{x+y<=1}(x - stepSize * gradient f(x))",
    },
    records,
    truthBoundary:
      "This trace applies one projected update rule to one exact two-variable fixture. Its objective decrease or residual rows do not establish a general convergence theorem, a solver comparison, numerical robustness, or decision validity.",
  };
}

export const M31_STOCHASTIC_GRADIENT_FIXTURE = Object.freeze({
  id: "m31-s05-fixed-noisy-gradient-fixture",
  targetParameter: 1,
  objective: "r(theta) = (theta - 1)^2",
  fullGradient: "2(theta - 1)",
  noiseSequence: Object.freeze([-1.5, 1.5, -0.5, 0.5]),
  seedLabel: "fixed-four-step-balanced-noise",
  truthBoundary:
    "The finite zero-mean noise sequence is a declared teaching fixture, not a random-sampling process, a distributional proof, or evidence about SGD in another objective or implementation.",
});

function normalizedFiniteSequence(values, label) {
  if (!Array.isArray(values) || values.length === 0 || values.some((value) => !Number.isFinite(value))) {
    throw new TypeError(`${label} must be a non-empty finite noise sequence.`);
  }
  return [...values];
}

function m31ScalarObjective(parameter) {
  return (parameter - M31_STOCHASTIC_GRADIENT_FIXTURE.targetParameter) ** 2;
}

function m31ScalarFullGradient(parameter) {
  return 2 * (parameter - M31_STOCHASTIC_GRADIENT_FIXTURE.targetParameter);
}

/**
 * Produce a bounded trace for r(theta) = (theta - 1)^2 using a supplied,
 * visible finite noise sequence. The row records expose the full gradient,
 * noisy estimate, and resulting finite path independently.
 *
 * @param {{ initialParameter: number, stepSize: number, noiseSequence: number[] }} configuration
 */
export function m31StochasticGradientTrace({ initialParameter, stepSize, noiseSequence }) {
  if (!Number.isFinite(initialParameter)) {
    throw new TypeError("M31 stochastic-gradient initialParameter must be finite.");
  }
  const normalizedStep = normalizedStepSize(stepSize, "M31 stochastic-gradient");
  const normalizedNoise = normalizedFiniteSequence(noiseSequence, "M31 stochastic-gradient");
  let parameter = initialParameter;
  const records = [
    {
      iteration: 0,
      parameter,
      objective: m31ScalarObjective(parameter),
      fullGradient: m31ScalarFullGradient(parameter),
      gradientEstimate: null,
      declaredNoise: null,
    },
  ];

  for (const [index, declaredNoise] of normalizedNoise.entries()) {
    const fullGradient = m31ScalarFullGradient(parameter);
    const gradientEstimate = fullGradient + declaredNoise;
    parameter -= normalizedStep * gradientEstimate;
    records.push({
      iteration: index + 1,
      parameter,
      objective: m31ScalarObjective(parameter),
      fullGradient: m31ScalarFullGradient(parameter),
      gradientEstimate,
      declaredNoise,
    });
  }

  const meanDeclaredNoise = normalizedNoise.reduce((total, noise) => total + noise, 0) /
    normalizedNoise.length;
  return {
    id: "m31-s05-fixed-noisy-gradient-trace",
    fixture: M31_STOCHASTIC_GRADIENT_FIXTURE,
    configuration: {
      initialParameter,
      stepSize: normalizedStep,
      noiseSequence: normalizedNoise,
    },
    records,
    meanDeclaredNoise,
    truthBoundary:
      "This finite fixed-noise trace exposes one estimator path. A zero mean over this declared sequence does not establish a convergence theorem, an unbiased minibatch process, an optimizer guarantee, or a useful result for another model/data distribution.",
  };
}

function normalizedDistribution(values, label) {
  if (!Array.isArray(values) || values.length === 0 || values.some((value) => !Number.isFinite(value) || value < 0)) {
    throw new TypeError(`${label} must be a non-empty finite non-negative probability vector.`);
  }
  const total = values.reduce((sum, value) => sum + value, 0);
  if (Math.abs(total - 1) > 1e-12) {
    throw new RangeError(`${label} must sum to 1 within 1e-12.`);
  }
  return [...values];
}

/**
 * Evaluate entropy, cross-entropy, and KL divergence for two explicitly
 * finite categorical distributions in natural-log units. Support failures are
 * surfaced rather than hidden behind a library convention.
 *
 * @param {number[]} referenceDistribution
 * @param {number[]} approximationDistribution
 */
export function evaluateM31DiscreteInformation(referenceDistribution, approximationDistribution) {
  const reference = normalizedDistribution(referenceDistribution, "M31 reference distribution");
  const approximation = normalizedDistribution(
    approximationDistribution,
    "M31 approximation distribution",
  );
  if (reference.length !== approximation.length) {
    throw new RangeError("M31 discrete information distributions must have the same support length.");
  }
  for (const [index, probability] of reference.entries()) {
    if (probability > 0 && approximation[index] <= 0) {
      throw new RangeError(
        "M31 approximation distribution must be strictly positive wherever the reference distribution is positive.",
      );
    }
  }
  const entropyNats = -reference.reduce(
    (total, probability) => total + (probability === 0 ? 0 : probability * Math.log(probability)),
    0,
  );
  const crossEntropyNats = -reference.reduce(
    (total, probability, index) =>
      total + (probability === 0 ? 0 : probability * Math.log(approximation[index])),
    0,
  );
  const klDivergenceNats = crossEntropyNats - entropyNats;
  return {
    id: "m31-s06-finite-categorical-information-card",
    referenceDistribution: reference,
    approximationDistribution: approximation,
    entropyNats,
    crossEntropyNats,
    klDivergenceNats,
    supportCompatible: true,
    truthBoundary:
      "These quantities describe only the declared finite categorical distributions in natural-log units. They do not identify a real data-generating law, a stakeholder utility, a calibrated model, or an ELBO/generalization claim outside its stated assumptions.",
  };
}
