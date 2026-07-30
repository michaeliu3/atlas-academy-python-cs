"""Finite, deterministic reasoning aids for Atlas Module 29.

This is a code-reading model for *particular, named mathematical families*.
It does not turn a finite collection of outputs into a proof of a theorem.
Instead, it exposes several seams that are easy to blur when mathematics meets
software:

* an epsilon--delta certificate for one affine difference formula;
* an exact Taylor polynomial and a theorem-backed remainder bound under stated
  hypotheses;
* exact gradients, Hessians, and Jacobians for tiny quadratic or affine maps;
* one constant-density change-of-variables trace;
* exact geometric-series tails and a canonical pointwise/non-uniform example;
  and
* truncation error on deliberately simple differentiation, quadrature, and
  Euler fixtures.

All algebraic inputs are integers or :class:`fractions.Fraction` values.  That
boundary is deliberate: silently converting a binary float into an exact-
looking result would hide representation and rounding decisions.  Where the
model displays a native floating-point observation (only the sine comparison),
the corresponding field and limitation say so explicitly.
"""

from __future__ import annotations

from dataclasses import dataclass
from fractions import Fraction
from math import factorial, isfinite, sin
from typing import Iterable, TypeAlias


Exact: TypeAlias = Fraction
Vector: TypeAlias = tuple[Exact, ...]
Matrix: TypeAlias = tuple[Vector, ...]

MODEL_VERSION = "atlas-module29-reference/1"
MAX_MATRIX_DIMENSION = 3
MAX_TAYLOR_TERMS = 8
MAX_SERIES_TERMS = 64
MAX_QUADRATURE_PANELS = 64
MAX_EULER_STEPS = 32

AFFINE_LIMIT_LIMITATION = (
    "This is a symbolic epsilon--delta derivation for the affine difference "
    "f(a + h) - f(a) = m h. A single probe illustrates the strict hypothesis; "
    "it does not test every input or establish continuity for an arbitrary "
    "program, function, or data-generating process."
)
TAYLOR_LIMITATION = (
    "The exact polynomial and bound use the alternating-series remainder for "
    "sin(x) with |x| <= 1. The displayed math.sin comparison is only a native "
    "floating-point observation, not the proof of that bound or a general "
    "Taylor-error engine."
)
QUADRATIC_DIFFERENTIAL_LIMITATION = (
    "This trace differentiates one exact two-variable quadratic. Its Hessian "
    "identity is exact for that family, but it does not establish smoothness, "
    "convexity, or a Taylor remainder for an arbitrary function."
)
JACOBIAN_LIMITATION = (
    "This is an exact difference identity for a small linear map. It makes a "
    "Jacobian's local-linear role inspectable, but it is not numerical "
    "automatic differentiation or evidence about a nonlinear implementation."
)
CHANGE_OF_VARIABLES_LIMITATION = (
    "This models a constant density on one rectangle under one invertible "
    "linear map. It exposes the absolute determinant factor, but it is not a "
    "general change-of-variables proof, numerical integration routine, or "
    "license to ignore bijectivity and regularity assumptions."
)
SERIES_LIMITATION = (
    "The tail identity is exact only for this geometric series with |r| < 1. "
    "It does not decide convergence of an arbitrary sequence or series from a "
    "finite prefix."
)
UNIFORMITY_LIMITATION = (
    "The non-uniform conclusion is an analytic fact about the named family "
    "f_n(x) = x^n on [0, 1], using its supremum; it is not inferred from a "
    "finite grid, and it says nothing about unrelated function sequences."
)
FINITE_DIFFERENCE_LIMITATION = (
    "These are exact truncation-error identities for one quadratic polynomial. "
    "They deliberately omit floating-point roundoff and cancellation, so they "
    "are not a full step-size-selection rule for numerical differentiation."
)
QUADRATURE_LIMITATION = (
    "This is the composite trapezoid rule on one quadratic over one finite "
    "interval. Its exact error does not prove convergence rates for other "
    "integrands, singularities, adaptive rules, or floating-point code."
)
EULER_LIMITATION = (
    "This is forward Euler for the special forced ODE y'(t) = 2t. The exact "
    "global error shown here neither proves stability nor supplies an error "
    "bound for general ODEs, stiff systems, variable steps, or floating-point "
    "solvers."
)


class ModelContractError(ValueError):
    """Raised when a fixture is ambiguous, unsupported, or outside this model."""


@dataclass(frozen=True)
class AffineLimitReport:
    """An epsilon--delta certificate for the affine difference ``m * h``.

    ``delta`` is chosen so that every offset satisfying ``|h| < delta`` has
    ``|m h| < epsilon``.  The optional-like `probe_offset` is retained to make
    the strict inequality boundary visible in a code-reading session.
    """

    slope: Exact
    epsilon: Exact
    delta: Exact
    probe_offset: Exact
    probe_input_distance: Exact
    probe_output_distance: Exact
    probe_is_within_delta: bool
    probe_is_below_epsilon: bool
    probe_implication_holds: bool
    limitation: str = AFFINE_LIMIT_LIMITATION


@dataclass(frozen=True)
class SineTaylorReport:
    """A bounded Taylor trace for ``sin(x)`` centered at zero."""

    x: Exact
    term_count: int
    polynomial: Exact
    next_omitted_term_bound: Exact
    float_sine_estimate: float
    float_polynomial_estimate: float
    observed_float_absolute_error: float
    float_observation_is_within_bound: bool
    limitation: str = TAYLOR_LIMITATION


@dataclass(frozen=True)
class QuadraticSurfaceReport:
    """Exact first- and second-order evidence for one bivariate quadratic."""

    hessian: Matrix
    linear_term: Vector
    point: Vector
    displacement: Vector
    value_at_point: Exact
    gradient_at_point: Vector
    value_at_displaced_point: Exact
    linear_prediction: Exact
    quadratic_correction: Exact
    taylor_reconstruction: Exact
    taylor_identity_holds: bool
    limitation: str = QUADRATIC_DIFFERENTIAL_LIMITATION


@dataclass(frozen=True)
class AffineJacobianReport:
    """A finite exact trace of ``F(p + h) - F(p) = J h`` for ``F(x) = Jx``."""

    jacobian: Matrix
    point: Vector
    displacement: Vector
    output_at_point: Vector
    output_at_displaced_point: Vector
    observed_output_change: Vector
    jacobian_times_displacement: Vector
    identity_holds: bool
    limitation: str = JACOBIAN_LIMITATION


@dataclass(frozen=True)
class ChangeOfVariablesReport:
    """A constant-density rectangle trace under a 2-by-2 invertible map."""

    linear_map: Matrix
    width: Exact
    height: Exact
    density: Exact
    source_area: Exact
    signed_jacobian: Exact
    absolute_jacobian: Exact
    transformed_area: Exact
    source_integral: Exact
    transformed_integral: Exact
    jacobian_scaled_source_integral: Exact
    transformed_vertices: tuple[Vector, ...]
    identity_holds: bool
    limitation: str = CHANGE_OF_VARIABLES_LIMITATION


@dataclass(frozen=True)
class GeometricSeriesReport:
    """An exact finite-prefix and tail trace for ``sum_{k=0}^∞ r^k``."""

    ratio: Exact
    term_count: int
    partial_sum: Exact
    exact_limit: Exact
    signed_remainder: Exact
    absolute_tail: Exact
    next_term: Exact
    limitation: str = SERIES_LIMITATION


@dataclass(frozen=True)
class PowerSequenceUniformityReport:
    """One pointwise-but-not-uniform convergence witness for ``x**n``."""

    index: int
    point: Exact
    function_value: Exact
    pointwise_limit_value: Exact
    pointwise_error: Exact
    supremum_error_on_unit_interval: Exact
    near_endpoint_witness: Exact
    near_endpoint_witness_error: Exact
    supremum_is_attained: bool
    converges_uniformly_on_unit_interval: bool
    limitation: str = UNIFORMITY_LIMITATION


@dataclass(frozen=True)
class QuadraticFiniteDifferenceReport:
    """Forward and centered derivative traces for ``a*x**2 + b*x + c``."""

    quadratic_coefficient: Exact
    linear_coefficient: Exact
    constant_coefficient: Exact
    point: Exact
    step: Exact
    exact_derivative: Exact
    forward_difference: Exact
    centered_difference: Exact
    forward_signed_error: Exact
    centered_signed_error: Exact
    limitation: str = FINITE_DIFFERENCE_LIMITATION


@dataclass(frozen=True)
class QuadraticTrapezoidReport:
    """Composite trapezoid evidence for an exact one-dimensional quadratic."""

    quadratic_coefficient: Exact
    linear_coefficient: Exact
    constant_coefficient: Exact
    left: Exact
    right: Exact
    panel_count: int
    step: Exact
    exact_integral: Exact
    trapezoid_estimate: Exact
    signed_error: Exact
    absolute_error: Exact
    limitation: str = QUADRATURE_LIMITATION


@dataclass(frozen=True)
class EulerTracePoint:
    """One exact state in a bounded forward-Euler trace."""

    index: int
    time: Exact
    euler_value: Exact
    exact_value: Exact


@dataclass(frozen=True)
class EulerForcedOdeReport:
    """Forward Euler evidence for the named ODE ``y'(t) = 2t``."""

    initial_value: Exact
    step: Exact
    step_count: int
    final_time: Exact
    trace: tuple[EulerTracePoint, ...]
    euler_final_value: Exact
    exact_final_value: Exact
    signed_global_error: Exact
    absolute_global_error: Exact
    derived_error_magnitude: Exact
    limitation: str = EULER_LIMITATION


def _bounded_items(values: Iterable[object], label: str, limit: int) -> tuple[object, ...]:
    """Materialize a short iterable without treating strings as mathematical data."""

    if isinstance(values, (str, bytes)):
        raise ModelContractError(f"{label} must be a finite iterable, not a string")
    try:
        iterator = iter(values)
    except TypeError as error:
        raise ModelContractError(f"{label} must be a finite iterable") from error

    result: list[object] = []
    for item in iterator:
        if len(result) >= limit:
            raise ModelContractError(f"{label} supports at most {limit} entries in this model")
        result.append(item)
    return tuple(result)


def _coerce_exact(value: object, label: str) -> Exact:
    """Accept only unambiguous exact teaching scalars."""

    if isinstance(value, bool):
        raise ModelContractError(f"{label} must be an integer or Fraction value")
    if isinstance(value, Fraction):
        return value
    if isinstance(value, int):
        return Fraction(value)
    raise ModelContractError(f"{label} must be an integer or Fraction value")


def _coerce_positive_exact(value: object, label: str) -> Exact:
    """Require an exact scalar greater than zero."""

    exact = _coerce_exact(value, label)
    if exact <= 0:
        raise ModelContractError(f"{label} must be greater than zero")
    return exact


def _coerce_small_count(value: object, label: str, maximum: int, *, minimum: int = 0) -> int:
    """Validate a bounded integer count without silently accepting booleans."""

    if isinstance(value, bool) or not isinstance(value, int):
        raise ModelContractError(f"{label} must be an integer")
    if not minimum <= value <= maximum:
        raise ModelContractError(f"{label} must be between {minimum} and {maximum}")
    return value


def _coerce_vector(
    values: Iterable[object],
    label: str,
    *,
    expected_length: int | None = None,
) -> Vector:
    """Validate a short nonempty exact vector."""

    raw = _bounded_items(values, label, MAX_MATRIX_DIMENSION)
    if not raw:
        raise ModelContractError(f"{label} must have positive length")
    vector = tuple(_coerce_exact(value, f"{label} entry") for value in raw)
    if expected_length is not None and len(vector) != expected_length:
        raise ModelContractError(f"{label} must have length {expected_length}")
    return vector


def _coerce_matrix(values: Iterable[object], label: str) -> Matrix:
    """Validate a nonempty, bounded rectangular exact matrix."""

    raw_rows = _bounded_items(values, label, MAX_MATRIX_DIMENSION)
    if not raw_rows:
        raise ModelContractError(f"{label} must have at least one row")

    rows: list[Vector] = []
    width: int | None = None
    for raw_row in raw_rows:
        row = _coerce_vector(raw_row, f"{label} row")
        if width is None:
            width = len(row)
        elif len(row) != width:
            raise ModelContractError(f"{label} rows must have the same positive length")
        rows.append(row)
    return tuple(rows)


def _shape(matrix: Matrix) -> tuple[int, int]:
    """Return dimensions after matrix validation has established rectangularity."""

    return len(matrix), len(matrix[0])


def _matvec(matrix: Matrix, vector: Vector) -> Vector:
    """Multiply one already-validated tiny matrix by a compatible vector."""

    _, columns = _shape(matrix)
    if len(vector) != columns:
        raise ModelContractError("internal matrix-vector dimensions disagree")
    return tuple(sum(entry * coordinate for entry, coordinate in zip(row, vector)) for row in matrix)


def _dot(left: Vector, right: Vector) -> Exact:
    """Compute an exact dot product after checking dimensions."""

    if len(left) != len(right):
        raise ModelContractError("internal vector dimensions disagree")
    return sum((first * second for first, second in zip(left, right)), Fraction(0))


def _require_symmetric_2_by_2(matrix: Matrix, label: str) -> None:
    """Keep the quadratic and area examples readable by hand."""

    if _shape(matrix) != (2, 2):
        raise ModelContractError(f"{label} must be a 2-by-2 matrix in this teaching model")
    if matrix[0][1] != matrix[1][0]:
        raise ModelContractError(f"{label} must be symmetric for this quadratic model")


def _determinant_2_by_2(matrix: Matrix) -> Exact:
    """Return the determinant of an already-validated 2-by-2 matrix."""

    return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]


def affine_epsilon_delta_report(
    slope: object,
    epsilon: object,
    probe_offset: object = 0,
) -> AffineLimitReport:
    """Make an epsilon--delta choice explicit for ``f(a+h)-f(a)=slope*h``.

    For nonzero slope, ``delta = epsilon / |slope|``.  The strict input
    inequality is important: an offset exactly equal to delta is *not* a valid
    epsilon--delta premise, even though it is tempting to use a non-strict
    comparison in code.
    """

    exact_slope = _coerce_exact(slope, "slope")
    exact_epsilon = _coerce_positive_exact(epsilon, "epsilon")
    exact_probe = _coerce_exact(probe_offset, "probe_offset")
    delta = Fraction(1) if exact_slope == 0 else exact_epsilon / abs(exact_slope)
    input_distance = abs(exact_probe)
    output_distance = abs(exact_slope * exact_probe)
    within_delta = input_distance < delta
    below_epsilon = output_distance < exact_epsilon
    return AffineLimitReport(
        slope=exact_slope,
        epsilon=exact_epsilon,
        delta=delta,
        probe_offset=exact_probe,
        probe_input_distance=input_distance,
        probe_output_distance=output_distance,
        probe_is_within_delta=within_delta,
        probe_is_below_epsilon=below_epsilon,
        probe_implication_holds=(not within_delta) or below_epsilon,
    )


def sine_taylor_report(x: object, term_count: object) -> SineTaylorReport:
    """Return a bounded Maclaurin trace for ``sin(x)`` and its next-term bound.

    With ``term_count`` terms, the polynomial is
    ``sum((-1)^k x^(2k+1)/(2k+1)!, k=0..term_count-1)``.  On ``|x| <= 1`` the
    alternating-series theorem bounds the exact remainder by the magnitude of
    the next omitted term.
    """

    exact_x = _coerce_exact(x, "x")
    if abs(exact_x) > 1:
        raise ModelContractError("x must satisfy |x| <= 1 for this remainder model")
    count = _coerce_small_count(term_count, "term_count", MAX_TAYLOR_TERMS, minimum=1)
    polynomial = sum(
        (
            Fraction((-1) ** index) * exact_x ** (2 * index + 1)
            / factorial(2 * index + 1)
            for index in range(count)
        ),
        Fraction(0),
    )
    remainder_bound = abs(exact_x) ** (2 * count + 1) / factorial(2 * count + 1)
    float_x = float(exact_x)
    if not isfinite(float_x):  # Defensive: the input contract makes this unreachable today.
        raise ModelContractError("x cannot be represented as a finite float for the observation")
    float_sine = sin(float_x)
    float_polynomial = float(polynomial)
    observed_error = abs(float_sine - float_polynomial)
    return SineTaylorReport(
        x=exact_x,
        term_count=count,
        polynomial=polynomial,
        next_omitted_term_bound=remainder_bound,
        float_sine_estimate=float_sine,
        float_polynomial_estimate=float_polynomial,
        observed_float_absolute_error=observed_error,
        float_observation_is_within_bound=observed_error <= float(remainder_bound) + 1e-15,
    )


def quadratic_surface_report(
    hessian: Iterable[object],
    linear_term: Iterable[object],
    point: Iterable[object],
    displacement: Iterable[object],
) -> QuadraticSurfaceReport:
    """Trace the exact second-order identity of a bivariate quadratic.

    The modeled function is ``q(z) = 1/2 z^T H z + b^T z``.  A symmetric H
    makes its gradient ``H z + b`` and its Hessian H.  For any displacement d,
    the Taylor expansion has no hidden remainder:
    ``q(p+d) = q(p) + grad(q)(p)^T d + 1/2 d^T H d``.
    """

    exact_hessian = _coerce_matrix(hessian, "hessian")
    _require_symmetric_2_by_2(exact_hessian, "hessian")
    exact_linear = _coerce_vector(linear_term, "linear_term", expected_length=2)
    exact_point = _coerce_vector(point, "point", expected_length=2)
    exact_displacement = _coerce_vector(displacement, "displacement", expected_length=2)
    hessian_point = _matvec(exact_hessian, exact_point)
    gradient = tuple(value + linear for value, linear in zip(hessian_point, exact_linear))
    value_at_point = Fraction(1, 2) * _dot(exact_point, hessian_point) + _dot(
        exact_linear, exact_point
    )
    displaced_point = tuple(
        coordinate + change for coordinate, change in zip(exact_point, exact_displacement)
    )
    hessian_displaced = _matvec(exact_hessian, displaced_point)
    value_at_displaced = Fraction(1, 2) * _dot(
        displaced_point, hessian_displaced
    ) + _dot(exact_linear, displaced_point)
    linear_prediction = value_at_point + _dot(gradient, exact_displacement)
    quadratic_correction = Fraction(1, 2) * _dot(
        exact_displacement, _matvec(exact_hessian, exact_displacement)
    )
    reconstruction = linear_prediction + quadratic_correction
    return QuadraticSurfaceReport(
        hessian=exact_hessian,
        linear_term=exact_linear,
        point=exact_point,
        displacement=exact_displacement,
        value_at_point=value_at_point,
        gradient_at_point=gradient,
        value_at_displaced_point=value_at_displaced,
        linear_prediction=linear_prediction,
        quadratic_correction=quadratic_correction,
        taylor_reconstruction=reconstruction,
        taylor_identity_holds=reconstruction == value_at_displaced,
    )


def affine_jacobian_report(
    jacobian: Iterable[object], point: Iterable[object], displacement: Iterable[object]
) -> AffineJacobianReport:
    """Expose an exact Jacobian difference identity for the map ``F(x)=Jx``."""

    exact_jacobian = _coerce_matrix(jacobian, "jacobian")
    _, input_dimension = _shape(exact_jacobian)
    exact_point = _coerce_vector(point, "point", expected_length=input_dimension)
    exact_displacement = _coerce_vector(
        displacement, "displacement", expected_length=input_dimension
    )
    output_at_point = _matvec(exact_jacobian, exact_point)
    displaced_point = tuple(
        coordinate + change for coordinate, change in zip(exact_point, exact_displacement)
    )
    output_at_displaced = _matvec(exact_jacobian, displaced_point)
    observed_change = tuple(
        after - before for before, after in zip(output_at_point, output_at_displaced)
    )
    jacobian_change = _matvec(exact_jacobian, exact_displacement)
    return AffineJacobianReport(
        jacobian=exact_jacobian,
        point=exact_point,
        displacement=exact_displacement,
        output_at_point=output_at_point,
        output_at_displaced_point=output_at_displaced,
        observed_output_change=observed_change,
        jacobian_times_displacement=jacobian_change,
        identity_holds=observed_change == jacobian_change,
    )


def affine_change_of_variables_rectangle_report(
    linear_map: Iterable[object], width: object, height: object, density: object
) -> ChangeOfVariablesReport:
    """Trace area and a constant-density integral through an invertible map.

    The source rectangle is ``[0,width] x [0,height]`` and the target is its
    image under the supplied linear map.  Restricting the density to a constant
    makes the determinant factor visible without pretending to integrate an
    arbitrary transformed function.
    """

    exact_map = _coerce_matrix(linear_map, "linear_map")
    if _shape(exact_map) != (2, 2):
        raise ModelContractError("linear_map must be a 2-by-2 matrix in this teaching model")
    exact_width = _coerce_positive_exact(width, "width")
    exact_height = _coerce_positive_exact(height, "height")
    exact_density = _coerce_exact(density, "density")
    determinant = _determinant_2_by_2(exact_map)
    if determinant == 0:
        raise ModelContractError(
            "linear_map must be invertible; a zero Jacobian breaks this change-of-variables fixture"
        )
    source_area = exact_width * exact_height
    absolute_determinant = abs(determinant)
    transformed_area = absolute_determinant * source_area
    source_integral = exact_density * source_area
    transformed_integral = exact_density * transformed_area
    scaled_source_integral = absolute_determinant * source_integral
    source_vertices: tuple[Vector, ...] = (
        (Fraction(0), Fraction(0)),
        (exact_width, Fraction(0)),
        (Fraction(0), exact_height),
        (exact_width, exact_height),
    )
    transformed_vertices = tuple(_matvec(exact_map, vertex) for vertex in source_vertices)
    return ChangeOfVariablesReport(
        linear_map=exact_map,
        width=exact_width,
        height=exact_height,
        density=exact_density,
        source_area=source_area,
        signed_jacobian=determinant,
        absolute_jacobian=absolute_determinant,
        transformed_area=transformed_area,
        source_integral=source_integral,
        transformed_integral=transformed_integral,
        jacobian_scaled_source_integral=scaled_source_integral,
        transformed_vertices=transformed_vertices,
        identity_holds=transformed_integral == scaled_source_integral,
    )


def geometric_series_report(ratio: object, term_count: object) -> GeometricSeriesReport:
    """Return an exact prefix and tail for a convergent geometric series."""

    exact_ratio = _coerce_exact(ratio, "ratio")
    if abs(exact_ratio) >= 1:
        raise ModelContractError("ratio must satisfy |ratio| < 1 for this convergent-series model")
    count = _coerce_small_count(term_count, "term_count", MAX_SERIES_TERMS)
    partial_sum = sum((exact_ratio**index for index in range(count)), Fraction(0))
    exact_limit = Fraction(1, 1) / (Fraction(1) - exact_ratio)
    remainder = exact_limit - partial_sum
    return GeometricSeriesReport(
        ratio=exact_ratio,
        term_count=count,
        partial_sum=partial_sum,
        exact_limit=exact_limit,
        signed_remainder=remainder,
        absolute_tail=abs(remainder),
        next_term=exact_ratio**count,
    )


def power_sequence_uniformity_report(
    index: object, point: object
) -> PowerSequenceUniformityReport:
    """Analyze one point of the canonical sequence ``f_n(x) = x**n`` on [0, 1].

    The pointwise limit is zero below 1 and one at 1.  Each finite n has
    supremum error 1 against that discontinuous limit on [0, 1], although that
    supremum is not attained.  This is an analytic argument, not a sampling
    result.
    """

    exact_index = _coerce_small_count(index, "index", MAX_SERIES_TERMS, minimum=2)
    exact_point = _coerce_exact(point, "point")
    if not Fraction(0) <= exact_point <= Fraction(1):
        raise ModelContractError("point must lie in the closed interval [0, 1]")
    function_value = exact_point**exact_index
    pointwise_limit = Fraction(1) if exact_point == 1 else Fraction(0)
    pointwise_error = abs(function_value - pointwise_limit)
    witness = Fraction(1) - Fraction(1, exact_index**2)
    witness_error = witness**exact_index
    return PowerSequenceUniformityReport(
        index=exact_index,
        point=exact_point,
        function_value=function_value,
        pointwise_limit_value=pointwise_limit,
        pointwise_error=pointwise_error,
        supremum_error_on_unit_interval=Fraction(1),
        near_endpoint_witness=witness,
        near_endpoint_witness_error=witness_error,
        supremum_is_attained=False,
        converges_uniformly_on_unit_interval=False,
    )


def _quadratic_value(
    quadratic_coefficient: Exact, linear_coefficient: Exact, constant_coefficient: Exact, x: Exact
) -> Exact:
    """Evaluate the named exact one-dimensional quadratic."""

    return quadratic_coefficient * x * x + linear_coefficient * x + constant_coefficient


def quadratic_finite_difference_report(
    quadratic_coefficient: object,
    linear_coefficient: object,
    constant_coefficient: object,
    point: object,
    step: object,
) -> QuadraticFiniteDifferenceReport:
    """Compare forward and centered differences on one exact quadratic."""

    a = _coerce_exact(quadratic_coefficient, "quadratic_coefficient")
    b = _coerce_exact(linear_coefficient, "linear_coefficient")
    c = _coerce_exact(constant_coefficient, "constant_coefficient")
    x = _coerce_exact(point, "point")
    h = _coerce_positive_exact(step, "step")
    exact_derivative = 2 * a * x + b
    forward = (_quadratic_value(a, b, c, x + h) - _quadratic_value(a, b, c, x)) / h
    centered = (
        _quadratic_value(a, b, c, x + h) - _quadratic_value(a, b, c, x - h)
    ) / (2 * h)
    return QuadraticFiniteDifferenceReport(
        quadratic_coefficient=a,
        linear_coefficient=b,
        constant_coefficient=c,
        point=x,
        step=h,
        exact_derivative=exact_derivative,
        forward_difference=forward,
        centered_difference=centered,
        forward_signed_error=forward - exact_derivative,
        centered_signed_error=centered - exact_derivative,
    )


def composite_trapezoid_quadratic_report(
    quadratic_coefficient: object,
    linear_coefficient: object,
    constant_coefficient: object,
    left: object,
    right: object,
    panel_count: object,
) -> QuadraticTrapezoidReport:
    """Evaluate the composite trapezoid rule on one exact quadratic."""

    a = _coerce_exact(quadratic_coefficient, "quadratic_coefficient")
    b = _coerce_exact(linear_coefficient, "linear_coefficient")
    c = _coerce_exact(constant_coefficient, "constant_coefficient")
    exact_left = _coerce_exact(left, "left")
    exact_right = _coerce_exact(right, "right")
    if exact_right <= exact_left:
        raise ModelContractError("right must be greater than left")
    count = _coerce_small_count(panel_count, "panel_count", MAX_QUADRATURE_PANELS, minimum=1)
    step = (exact_right - exact_left) / count
    weighted_sum = Fraction(0)
    for index in range(count + 1):
        x = exact_left + index * step
        weight = Fraction(1) if index in (0, count) else Fraction(2)
        weighted_sum += weight * _quadratic_value(a, b, c, x)
    trapezoid = step * weighted_sum / 2
    exact_integral = (
        a * (exact_right**3 - exact_left**3) / 3
        + b * (exact_right**2 - exact_left**2) / 2
        + c * (exact_right - exact_left)
    )
    signed_error = trapezoid - exact_integral
    return QuadraticTrapezoidReport(
        quadratic_coefficient=a,
        linear_coefficient=b,
        constant_coefficient=c,
        left=exact_left,
        right=exact_right,
        panel_count=count,
        step=step,
        exact_integral=exact_integral,
        trapezoid_estimate=trapezoid,
        signed_error=signed_error,
        absolute_error=abs(signed_error),
    )


def euler_forced_quadratic_ode_report(
    initial_value: object, step: object, step_count: object
) -> EulerForcedOdeReport:
    """Trace forward Euler for ``y'(t) = 2t``, ``y(0) = initial_value``.

    The exact solution is ``y(t) = initial_value + t**2``.  Keeping the forcing
    this simple isolates the method's left-endpoint truncation error from any
    question of symbolic solving, adaptive control, stiffness, or roundoff.
    """

    initial = _coerce_exact(initial_value, "initial_value")
    exact_step = _coerce_positive_exact(step, "step")
    count = _coerce_small_count(step_count, "step_count", MAX_EULER_STEPS, minimum=1)
    euler_value = initial
    trace: list[EulerTracePoint] = []
    for index in range(count + 1):
        time = index * exact_step
        exact_value = initial + time * time
        trace.append(
            EulerTracePoint(
                index=index,
                time=time,
                euler_value=euler_value,
                exact_value=exact_value,
            )
        )
        if index < count:
            euler_value += exact_step * (2 * time)
    final_time = count * exact_step
    exact_final = initial + final_time * final_time
    signed_error = euler_value - exact_final
    derived_error = final_time * exact_step
    return EulerForcedOdeReport(
        initial_value=initial,
        step=exact_step,
        step_count=count,
        final_time=final_time,
        trace=tuple(trace),
        euler_final_value=euler_value,
        exact_final_value=exact_final,
        signed_global_error=signed_error,
        absolute_global_error=abs(signed_error),
        derived_error_magnitude=derived_error,
    )
