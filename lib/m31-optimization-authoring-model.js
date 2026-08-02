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

/**
 * A two-coordinate least-squares problem whose second feature is deliberately
 * scaled down.  It makes conditioning and the coordinate-dependent meaning of
 * a numeric ridge weight inspectable without pretending to be a general
 * numerical-optimization library.
 */
export const M31_RIDGE_CONDITIONING_FIXTURE = Object.freeze({
  id: "m31-s02-ridge-conditioning-card",
  objective: "1/2 ||A theta - y||_2^2 + lambda/2 ||theta||_2^2",
  designMatrix: Object.freeze([
    Object.freeze([1, 0]),
    Object.freeze([0, 0.01]),
  ]),
  target: Object.freeze([1, 0.01]),
  lambda: 0.01,
  featureRescaling: Object.freeze([1, 100]),
  truthBoundary:
    "This exact two-coordinate ridge card exposes one scaling and regularization trade-off. It is not a prescription for choosing lambda, an estimator of real-data conditioning, a solver, or a guarantee about another objective, feature transform, dtype, or dataset.",
});

function normalizedM31Pair(values, label) {
  if (!Array.isArray(values) || values.length !== 2 || values.some((value) => !Number.isFinite(value))) {
    throw new TypeError(`${label} must be an array of exactly two finite numbers.`);
  }
  return [...values];
}

function m31RidgeObjective(theta) {
  const [first, second] = normalizedM31Pair(theta, "M31 ridge theta");
  const [targetFirst, targetSecond] = M31_RIDGE_CONDITIONING_FIXTURE.target;
  const residualFirst = first - targetFirst;
  const residualSecond = 0.01 * second - targetSecond;
  const lambda = M31_RIDGE_CONDITIONING_FIXTURE.lambda;
  return (
    0.5 * (residualFirst ** 2 + residualSecond ** 2) +
    0.5 * lambda * (first ** 2 + second ** 2)
  );
}

function m31RidgeGradient(theta) {
  const [first, second] = normalizedM31Pair(theta, "M31 ridge theta");
  const [targetFirst, targetSecond] = M31_RIDGE_CONDITIONING_FIXTURE.target;
  const lambda = M31_RIDGE_CONDITIONING_FIXTURE.lambda;
  return [
    (first - targetFirst) + lambda * first,
    0.01 * (0.01 * second - targetSecond) + lambda * second,
  ];
}

function m31RidgeCentralDifference(theta, step = 1e-6) {
  const [first, second] = normalizedM31Pair(theta, "M31 ridge theta");
  if (!Number.isFinite(step) || step <= 0) {
    throw new TypeError("M31 ridge finite-difference step must be finite and positive.");
  }
  return [
    (m31RidgeObjective([first + step, second]) - m31RidgeObjective([first - step, second])) /
      (2 * step),
    (m31RidgeObjective([first, second + step]) - m31RidgeObjective([first, second - step])) /
      (2 * step),
  ];
}

/**
 * Evaluate one exact ridge-conditioning card.  The rescaling comparison keeps
 * the prediction model fixed while changing coordinates, so it surfaces why a
 * numeric lambda has units and is not invariant under arbitrary feature
 * rescaling.
 */
export function m31RidgeConditioningCard() {
  const lambda = M31_RIDGE_CONDITIONING_FIXTURE.lambda;
  const [targetFirst, targetSecond] = M31_RIDGE_CONDITIONING_FIXTURE.target;
  const hessianDiagonal = [1 + lambda, 0.01 ** 2 + lambda];
  const solution = [
    targetFirst / hessianDiagonal[0],
    (0.01 * targetSecond) / hessianDiagonal[1],
  ];
  const scaledCoordinateSolution = [
    targetFirst / (1 + lambda),
    targetSecond / (1 + lambda),
  ];
  const mappedBackSolution = [
    scaledCoordinateSolution[0],
    M31_RIDGE_CONDITIONING_FIXTURE.featureRescaling[1] * scaledCoordinateSolution[1],
  ];
  const gradient = m31RidgeGradient(solution);
  const finiteDifferenceGradient = m31RidgeCentralDifference(solution);

  return {
    id: M31_RIDGE_CONDITIONING_FIXTURE.id,
    fixture: M31_RIDGE_CONDITIONING_FIXTURE,
    normalEquation: {
      hessianDiagonal,
      unregularizedConditionNumber: 1 / 0.01 ** 2,
      ridgeConditionNumber: hessianDiagonal[0] / hessianDiagonal[1],
      solution,
      analyticGradientAtSolution: gradient,
      finiteDifferenceGradientAtSolution: finiteDifferenceGradient,
    },
    rescalingCounterexample: {
      coordinateChange: "theta = diag(1, 100) beta",
      rescaledDesignMatrix: "A diag(1, 100) = I",
      sameNumericLambda: lambda,
      betaSolutionUnderRescaledPenalty: scaledCoordinateSolution,
      mappedBackTheta: mappedBackSolution,
      predictionMeaning:
        "The data-fit predictions are represented in different coordinates, but applying the same numeric ridge weight penalizes a different physical direction. Lambda therefore needs declared units and feature scaling.",
    },
    truthBoundary: M31_RIDGE_CONDITIONING_FIXTURE.truthBoundary,
  };
}

/**
 * A fixed, anisotropic unconstrained quadratic for reading a quantitative
 * gradient-descent bound beside a finite trace.  It deliberately does not
 * reuse the constrained projected-gradient fixture, because the displayed
 * rate theorem has a different hypothesis set.
 *
 * @param {number} [iterations]
 */
export function m31GradientDescentRateCard(iterations = 10) {
  const normalizedIterations = normalizedIterationCount(iterations, "M31 rate-card");
  const strongConvexity = 1;
  const smoothness = 100;
  const stepSize = 1 / smoothness;
  const contraction = 1 - strongConvexity * stepSize;
  const initialPoint = [1, 1];
  const objectiveAt = ([first, second]) => 0.5 * (first ** 2 + smoothness * second ** 2);
  const initialGap = objectiveAt(initialPoint);
  const records = [];
  for (let iteration = 0; iteration <= normalizedIterations; iteration += 1) {
    const point = [
      initialPoint[0] * (1 - stepSize * strongConvexity) ** iteration,
      initialPoint[1] * (1 - stepSize * smoothness) ** iteration,
    ];
    records.push({
      iteration,
      point,
      actualSuboptimality: objectiveAt(point),
      statedFunctionGapUpperBound: initialGap * contraction ** iteration,
    });
  }

  return {
    id: "m31-s04-unconstrained-gradient-descent-rate-card",
    objective: "r(u, v) = 1/2 (u^2 + 100 v^2)",
    assumptions: [
      "unconstrained differentiable objective",
      "exact gradients",
      "mu = 1 strong convexity and L = 100 smoothness in the declared Euclidean coordinates",
      "step size eta = 1/L = 0.01",
    ],
    strongConvexity,
    smoothness,
    stepSize,
    contraction,
    initialSuboptimality: initialGap,
    records,
    theoremStatement:
      "For the declared assumptions, f(x_k) - f* <= (1 - mu/L)^k (f(x_0) - f*).",
    truthBoundary:
      "This fixed unconstrained exact-gradient card makes one linear-rate upper bound inspectable. It does not prove that the bound is tight, that a projected or stochastic trace inherits it, or that a different objective, step rule, precision, constraint set, or solver satisfies its assumptions.",
  };
}

/**
 * An exact two-latent-state ELBO identity card.  It makes the finite equality
 * and the support-mismatch failure mode inspectable without implementing a
 * variational-inference framework or claiming a learned model.
 */
export function m31TwoStateElboCard() {
  const jointAtObservation = [0.18, 0.12];
  const evidence = jointAtObservation.reduce((total, probability) => total + probability, 0);
  const posterior = jointAtObservation.map((probability) => probability / evidence);
  const variationalDistribution = [0.75, 0.25];
  const elboNats = variationalDistribution.reduce(
    (total, probability, index) =>
      total + probability * (Math.log(jointAtObservation[index]) - Math.log(probability)),
    0,
  );
  const klToPosteriorNats = variationalDistribution.reduce(
    (total, probability, index) => total + probability * Math.log(probability / posterior[index]),
    0,
  );
  const logEvidenceNats = Math.log(evidence);
  const identityResidual = logEvidenceNats - (elboNats + klToPosteriorNats);

  return {
    id: "m31-s06-two-state-elbo-identity-card",
    validFiniteCase: {
      jointAtObservation,
      evidence,
      posterior,
      variationalDistribution,
      elboNats,
      klToPosteriorNats,
      logEvidenceNats,
      identityResidual,
      supportCompatible: true,
    },
    supportMismatchCase: {
      jointAtObservation: [0.3, 0],
      variationalDistribution: [0.5, 0.5],
      supportCompatible: false,
      finiteIdentityAvailable: false,
      reason:
        "The variational distribution assigns positive mass to a latent state whose declared joint probability is zero, so the finite log-ratio expression cannot be reported as a finite ELBO/KL equality.",
    },
    truthBoundary:
      "This two-state calculation checks one finite algebraic identity under explicit support. It does not train a variational model, establish posterior approximation quality beyond the declared distributions, validate a likelihood, or imply calibration, causal validity, or decision value.",
  };
}

function m31DoubleWellObjective(parameter) {
  return (parameter ** 2 - 1) ** 2;
}

function m31DoubleWellGradient(parameter) {
  return 4 * parameter * (parameter ** 2 - 1);
}

/**
 * A deliberately tiny multiple-initialization card for the nonconvex
 * double-well w(t) = (t^2 - 1)^2. It exposes one update from three fixed
 * starts; it does not select a global optimizer or prove behavior from other
 * starts, step sizes, dtypes, or numerical libraries.
 */
export function m31DoubleWellMultipleStartCard() {
  const stepSize = 0.1;
  const starts = [-0.2, 0, 0.2];
  return {
    id: "m31-s05-double-well-multiple-start-card",
    objective: "w(t) = (t^2 - 1)^2",
    gradient: "w'(t) = 4t(t^2 - 1)",
    stepSize,
    records: starts.map((initialParameter) => {
      const gradient = m31DoubleWellGradient(initialParameter);
      return {
        initialParameter,
        initialObjective: m31DoubleWellObjective(initialParameter),
        gradient,
        nextParameter: initialParameter - stepSize * gradient,
        stationaryClassification:
          initialParameter === 0
            ? "stationary local maximum in the declared analytic fixture"
            : "nonstationary start",
      };
    }),
    knownStationaryPoints: [
      { parameter: -1, classification: "global minimum" },
      { parameter: 0, classification: "local maximum" },
      { parameter: 1, classification: "global minimum" },
    ],
    truthBoundary:
      "This fixed three-start, one-step nonconvex card makes initialization and local curvature visible. It does not establish convergence, basin membership, global optimality, stability, or a recommendation for another objective, step rule, precision, or implementation.",
  };
}

function normalizedHalfProbability(value, label) {
  if (!Number.isFinite(value) || value < 0 || value > 0.5) {
    throw new RangeError(`${label} must be a finite probability from 0 through 0.5.`);
  }
  return value;
}

function binaryEntropyBits(probability) {
  if (probability === 0) return 0;
  return -(
    probability * Math.log2(probability) +
    (1 - probability) * Math.log2(1 - probability)
  );
}

/**
 * Evaluate two formulas for one explicitly declared setting: a uniform binary
 * source, a binary-symmetric observation channel, and Hamming distortion.
 * The result is a source/loss-specific information card, not a generic model
 * score, finite-code result, privacy calculation, or decision rule.
 *
 * @param {{ crossoverProbability: number, distortionLevel: number }} configuration
 */
export function evaluateM31BinaryChannelDistortion({ crossoverProbability, distortionLevel }) {
  const crossover = normalizedHalfProbability(
    crossoverProbability,
    "M31 binary-channel crossoverProbability",
  );
  const distortion = normalizedHalfProbability(
    distortionLevel,
    "M31 binary Hamming distortionLevel",
  );
  const channelNoiseEntropyBits = binaryEntropyBits(crossover);
  const distortionEntropyBits = binaryEntropyBits(distortion);
  return {
    id: "m31-s06-binary-channel-distortion-card",
    source: "X ~ Bernoulli(1/2), iid in the rate-distortion statement",
    observationChannel: "Y = X XOR N, N ~ Bernoulli(q), independent of X",
    distortion: "d(x, x_hat) = 1[x != x_hat]",
    crossoverProbability: crossover,
    distortionLevel: distortion,
    channelNoiseEntropyBits,
    mutualInformationBits: 1 - channelNoiseEntropyBits,
    rateDistortionBitsPerSymbol: 1 - distortionEntropyBits,
    theoremScope:
      "R(D) = 1 - h_2(D) is the rate-distortion function here only for the declared uniform iid binary source, Hamming distortion, D from 0 through 1/2, and asymptotic coding regime.",
    truthBoundary:
      "This card evaluates source- and loss-specific formulas. It does not establish a finite-code rate, model quality, privacy, utility, acceptable harm, causality, or authority to act; a changed source law or distortion measure needs a new derivation.",
  };
}
