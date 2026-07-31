/**
 * A deliberately small, deterministic M31 authoring fixture for Sessions 01
 * through 03. It has no learner route, persistence, network, filesystem,
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
