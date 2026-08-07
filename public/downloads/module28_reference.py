"""Finite, deterministic reasoning aids for Atlas Module 28.

This is a code-reading model, not a substitute for a numerical linear-algebra
library.  It makes a small number of linear-algebra claims inspectable on
deliberately bounded fixtures:

* exact RREF, rank, null-space, row-space, and column-space evidence;
* exact least-squares projection evidence, including an orthogonal residual;
* principal-minor PSD evidence and a tiny 2-by-2 spectral/PCA trace; and
* the difference between conditioning, a toy rounding rule, and an algorithm.

The exact functions accept only integers and ``fractions.Fraction`` values.
That boundary is intentional: coercing a binary float into a rational-looking
teaching result would hide the representation issue this module is meant to
make visible.  The few functions that report floating-point quantities label
their estimates and their finite-model boundaries explicitly.
"""

from __future__ import annotations

from dataclasses import dataclass
from fractions import Fraction
from itertools import combinations
from math import hypot, inf, isfinite, sqrt
from typing import Iterable, TypeAlias


Exact: TypeAlias = Fraction
Vector: TypeAlias = tuple[Exact, ...]
Matrix: TypeAlias = tuple[Vector, ...]
FloatVector: TypeAlias = tuple[float, ...]

MODEL_VERSION = "atlas-module28-reference/1"
MAX_EXACT_ROWS = 12
MAX_EXACT_COLUMNS = 8
MAX_PSD_DIMENSION = 5
MAX_DECIMAL_SIGNIFICANT_DIGITS = 12

EXACT_LINEAR_ALGEBRA_LIMITATION = (
    "Exact rational arithmetic on one deliberately small matrix. The returned "
    "basis and rank evidence describe only the supplied finite linear map; they "
    "do not establish a general theorem, a scalable algorithm, or production "
    "numerical behavior."
)
LEAST_SQUARES_LIMITATION = (
    "This exact normal-equation trace requires full column rank. In floating-point "
    "software, forming A^T A can worsen conditioning; use a stable factorization "
    "such as QR or SVD for serious numerical work."
)
PSD_LIMITATION = (
    "All principal minors are checked exactly for this small symmetric matrix. "
    "The PSD conclusion uses the principal-minor criterion; it does not license "
    "a conclusion about an unobserved matrix, data set, or implementation."
)
SPECTRAL_LIMITATION = (
    "Only a 2-by-2 symmetric eigendecomposition is modeled, and its displayed "
    "vectors and reconstruction error use native floating point. They are "
    "numerical evidence, not a symbolic proof, general SVD implementation, or "
    "a guarantee about larger matrices."
)
PCA_LIMITATION = (
    "This is population-covariance PCA for at most two features on a tiny, exact "
    "fixture. Centering, feature units, sample uncertainty, outliers, and the "
    "choice of retained rank remain modeling decisions."
)
NUMERICAL_ESTIMATE_LIMITATION = (
    "This 2-by-2 calculation distinguishes conditioning of the mathematical "
    "problem from an algorithm failure. Its singular values and relative norms "
    "are floating-point estimates; it neither benchmarks a solver nor predicts "
    "all finite-precision behavior."
)
TOY_DECIMAL_LIMITATION = (
    "This is a toy base-10 significant-digit rounding rule using exact rational "
    "arithmetic. It illustrates cancellation, but it is not an IEEE-754 emulator, "
    "a hardware measurement, or a claim about every numerical algorithm."
)


class ModelContractError(ValueError):
    """Raised when a teaching fixture is ambiguous, unsupported, or out of scope."""


@dataclass(frozen=True)
class MatrixSpaceReport:
    """Exact finite evidence for several distinct subspaces of one matrix.

    Pivot indices are zero-based because they are Python indices.  The pivot
    *positions* come from RREF, while `column_space_basis` deliberately uses
    columns from the original matrix.  This makes the usual row-reduction
    misconception visible instead of silently replacing the requested space.
    """

    matrix: Matrix
    rref: Matrix
    rank: int
    pivot_columns: tuple[int, ...]
    free_columns: tuple[int, ...]
    null_space_basis: tuple[Vector, ...]
    column_space_basis: tuple[Vector, ...]
    row_space_basis: tuple[Vector, ...]
    limitation: str = EXACT_LINEAR_ALGEBRA_LIMITATION


@dataclass(frozen=True)
class ProjectionReport:
    """A full-column-rank least-squares trace with the normal equations exposed."""

    design_matrix: Matrix
    observations: Vector
    normal_matrix: Matrix
    normal_rhs: Vector
    coefficients: Vector
    fitted: Vector
    residual: Vector
    residual_dot_columns: Vector
    residual_is_orthogonal: bool
    squared_residual_norm: Exact
    limitation: str = LEAST_SQUARES_LIMITATION


@dataclass(frozen=True)
class PSDReport:
    """Exact principal-minor evidence for a small real symmetric matrix."""

    matrix: Matrix
    principal_minors: tuple[tuple[tuple[int, ...], Exact], ...]
    leading_principal_minors: tuple[Exact, ...]
    rank: int
    is_psd: bool
    is_positive_definite: bool
    first_negative_principal_minor: tuple[tuple[int, ...], Exact] | None
    limitation: str = PSD_LIMITATION


@dataclass(frozen=True)
class SymmetricEigenReport:
    """A reproducible floating-point trace for one 2-by-2 symmetric matrix.

    Eigenvalues are descending.  Each entry of `eigenvectors` is one unit vector
    in the corresponding eigendirection.  For a repeated eigenvalue, the
    returned standard basis is a valid choice, but the direction is not unique.
    """

    matrix: Matrix
    eigenvalues: tuple[float, float]
    eigenvectors: tuple[FloatVector, FloatVector]
    eigenvector_dot_product: float
    reconstruction_max_abs_error: float
    eigenvalue_psd_indicator: bool
    repeated_eigenvalue: bool
    limitation: str = SPECTRAL_LIMITATION


@dataclass(frozen=True)
class PCA2DReport:
    """A two-feature PCA trace connecting variance and rank-one reconstruction."""

    observations: Matrix
    mean: Vector
    centered_observations: Matrix
    covariance: Matrix
    eigenvalues: tuple[float, float]
    principal_direction: FloatVector
    scores: tuple[float, ...]
    rank_one_reconstructions: tuple[FloatVector, ...]
    retained_variance_ratio: float | None
    rank_one_reconstruction_sse: float
    discarded_variance_times_sample_count: float
    variance_reconstruction_identity_error: float
    repeated_top_eigenvalue: bool
    limitation: str = PCA_LIMITATION


@dataclass(frozen=True)
class ConditionReport:
    """A 2-norm condition-number estimate with exact singularity evidence."""

    matrix: Matrix
    determinant: Exact
    singular_values: tuple[float, float]
    condition_number_2: float
    is_singular: bool
    floating_resolution_lost: bool
    limitation: str = NUMERICAL_ESTIMATE_LIMITATION


@dataclass(frozen=True)
class SensitivityReport:
    """Exact solutions plus approximate relative-change evidence for one RHS tweak."""

    baseline_solution: Vector
    perturbed_solution: Vector
    relative_rhs_change: float
    relative_solution_change: float
    observed_amplification: float | None
    condition_number_2: float
    condition_bound: float
    obeys_condition_bound: bool
    limitation: str = NUMERICAL_ESTIMATE_LIMITATION


@dataclass(frozen=True)
class CancellationReport:
    """A visible significant-digit cancellation trace under one declared toy rule."""

    left: Exact
    right: Exact
    significant_digits: int
    rounded_left: Exact
    rounded_right: Exact
    exact_difference: Exact
    rounded_difference: Exact
    absolute_error: Exact
    limitation: str = TOY_DECIMAL_LIMITATION


def _as_tuple(values: Iterable[object], label: str) -> tuple[object, ...]:
    """Materialize a finite iterable without treating a string as data rows."""

    if isinstance(values, (str, bytes)):
        raise ModelContractError(f"{label} must be a finite iterable, not one string")
    try:
        return tuple(values)
    except TypeError as error:
        raise ModelContractError(f"{label} must be a finite iterable") from error


def _coerce_exact(value: object, label: str) -> Exact:
    """Accept exact teaching scalars while rejecting bools and binary floats."""

    if isinstance(value, bool):
        raise ModelContractError(f"{label} entries must be integers or Fraction values")
    if isinstance(value, Fraction):
        return value
    if isinstance(value, int):
        return Fraction(value)
    raise ModelContractError(f"{label} entries must be integers or Fraction values")


def _coerce_vector(
    values: Iterable[object],
    label: str,
    *,
    expected_length: int | None = None,
) -> Vector:
    """Validate a nonempty exact vector, optionally against a known dimension."""

    raw = _as_tuple(values, label)
    if not raw:
        raise ModelContractError(f"{label} must have positive length")
    result = tuple(_coerce_exact(value, label) for value in raw)
    if expected_length is not None and len(result) != expected_length:
        raise ModelContractError(f"{label} must have length {expected_length}")
    return result


def _coerce_matrix(values: Iterable[object], label: str = "matrix") -> Matrix:
    """Validate a bounded rectangular exact matrix with at least one entry."""

    raw_rows = _as_tuple(values, label)
    if not raw_rows:
        raise ModelContractError(f"{label} must have at least one row")
    if len(raw_rows) > MAX_EXACT_ROWS:
        raise ModelContractError(f"{label} supports at most {MAX_EXACT_ROWS} rows in this model")

    rows: list[Vector] = []
    width: int | None = None
    for index, raw_row in enumerate(raw_rows):
        row = _coerce_vector(raw_row, f"{label} row {index}")
        if width is None:
            width = len(row)
            if width > MAX_EXACT_COLUMNS:
                raise ModelContractError(
                    f"{label} supports at most {MAX_EXACT_COLUMNS} columns in this model"
                )
        elif len(row) != width:
            raise ModelContractError(f"{label} rows must have the same positive length")
        rows.append(row)
    return tuple(rows)


def _shape(matrix: Matrix) -> tuple[int, int]:
    """Return dimensions for a matrix already checked by `_coerce_matrix`."""

    return len(matrix), len(matrix[0])


def _transpose(matrix: Matrix) -> Matrix:
    """Return the finite transpose of a validated matrix."""

    rows, columns = _shape(matrix)
    return tuple(tuple(matrix[row][column] for row in range(rows)) for column in range(columns))


def _matmul(left: Matrix, right: Matrix) -> Matrix:
    """Multiply compatible exact matrices with dimensions kept deliberately small."""

    _, left_columns = _shape(left)
    right_rows, right_columns = _shape(right)
    if left_columns != right_rows:
        raise ModelContractError("internal matrix multiplication dimensions disagree")
    return tuple(
        tuple(
            sum(left[row][middle] * right[middle][column] for middle in range(left_columns))
            for column in range(right_columns)
        )
        for row in range(len(left))
    )


def _matvec(matrix: Matrix, vector: Vector) -> Vector:
    """Multiply a validated exact matrix by a compatible exact vector."""

    _, columns = _shape(matrix)
    if len(vector) != columns:
        raise ModelContractError("internal matrix-vector dimensions disagree")
    return tuple(sum(entry * value for entry, value in zip(row, vector)) for row in matrix)


def _dot(left: Vector, right: Vector) -> Exact:
    """Compute one exact inner product after enforcing matching dimensions."""

    if len(left) != len(right):
        raise ModelContractError("internal vectors must have the same length")
    return sum(first * second for first, second in zip(left, right))


def _rref(matrix: Matrix) -> tuple[Matrix, tuple[int, ...]]:
    """Use deterministic exact Gauss--Jordan elimination and expose pivot columns."""

    rows, columns = _shape(matrix)
    work = [list(row) for row in matrix]
    pivot_row = 0
    pivot_columns: list[int] = []
    for column in range(columns):
        candidate = next(
            (row for row in range(pivot_row, rows) if work[row][column] != 0),
            None,
        )
        if candidate is None:
            continue
        if candidate != pivot_row:
            work[pivot_row], work[candidate] = work[candidate], work[pivot_row]

        pivot = work[pivot_row][column]
        work[pivot_row] = [entry / pivot for entry in work[pivot_row]]
        for row in range(rows):
            if row == pivot_row:
                continue
            factor = work[row][column]
            if factor != 0:
                work[row] = [
                    entry - factor * pivot_entry
                    for entry, pivot_entry in zip(work[row], work[pivot_row])
                ]
        pivot_columns.append(column)
        pivot_row += 1
        if pivot_row == rows:
            break
    return tuple(tuple(row) for row in work), tuple(pivot_columns)


def _matrix_space_report(matrix: Matrix) -> MatrixSpaceReport:
    """Build the exact subspace report once validation has already happened."""

    _, columns = _shape(matrix)
    rref, pivots = _rref(matrix)
    pivot_set = set(pivots)
    free = tuple(column for column in range(columns) if column not in pivot_set)
    null_basis: list[Vector] = []
    for free_column in free:
        vector = [Fraction(0) for _ in range(columns)]
        vector[free_column] = Fraction(1)
        for row, pivot_column in enumerate(pivots):
            vector[pivot_column] = -rref[row][free_column]
        null_basis.append(tuple(vector))

    column_basis = tuple(
        tuple(row[pivot_column] for row in matrix) for pivot_column in pivots
    )
    row_basis = tuple(row for row in rref if any(entry != 0 for entry in row))
    return MatrixSpaceReport(
        matrix=matrix,
        rref=rref,
        rank=len(pivots),
        pivot_columns=pivots,
        free_columns=free,
        null_space_basis=tuple(null_basis),
        column_space_basis=column_basis,
        row_space_basis=row_basis,
    )


def analyze_matrix(matrix: Iterable[object]) -> MatrixSpaceReport:
    """Return exact RREF and basis evidence for one bounded finite matrix.

    This is a useful reading trace for the relationships among pivots, rank, and
    subspaces.  It is not a numerical algorithm: floats are intentionally
    rejected so that exact algebra and finite-precision behavior stay separate.
    """

    return _matrix_space_report(_coerce_matrix(matrix))


def _solve_invertible_square(matrix: Matrix, rhs: Vector) -> Vector:
    """Solve one already-validated invertible square exact system via augmented RREF."""

    rows, columns = _shape(matrix)
    if rows != columns:
        raise ModelContractError("internal exact solve requires a square matrix")
    if len(rhs) != rows:
        raise ModelContractError("internal exact solve dimensions disagree")
    augmented = tuple(matrix[row] + (rhs[row],) for row in range(rows))
    rref, pivots = _rref(augmented)
    if pivots != tuple(range(columns)):
        raise ModelContractError("internal exact solve requires an invertible matrix")
    return tuple(rref[row][columns] for row in range(rows))


def least_squares_projection(
    design_matrix: Iterable[object], observations: Iterable[object]
) -> ProjectionReport:
    """Project observations onto a full-column-rank design matrix exactly.

    The returned normal equations make the derivation inspectable: differentiating
    the squared residual produces ``A^T(Ax-b)=0``.  The final dot products expose
    the geometric consequence: the residual is orthogonal to every column of A.
    """

    design = _coerce_matrix(design_matrix, "design matrix")
    row_count, column_count = _shape(design)
    target = _coerce_vector(observations, "observations", expected_length=row_count)
    design_report = _matrix_space_report(design)
    if design_report.rank != column_count:
        raise ModelContractError(
            "least-squares teaching model requires full column rank; use a "
            "separate pseudoinverse/SVD discussion for rank-deficient designs"
        )

    transpose = _transpose(design)
    normal_matrix = _matmul(transpose, design)
    normal_rhs = _matvec(transpose, target)
    coefficients = _solve_invertible_square(normal_matrix, normal_rhs)
    fitted = _matvec(design, coefficients)
    residual = tuple(observed - predicted for observed, predicted in zip(target, fitted))
    column_vectors = _transpose(design)
    residual_dot_columns = tuple(_dot(column, residual) for column in column_vectors)
    return ProjectionReport(
        design_matrix=design,
        observations=target,
        normal_matrix=normal_matrix,
        normal_rhs=normal_rhs,
        coefficients=coefficients,
        fitted=fitted,
        residual=residual,
        residual_dot_columns=residual_dot_columns,
        residual_is_orthogonal=all(value == 0 for value in residual_dot_columns),
        squared_residual_norm=_dot(residual, residual),
    )


def _determinant(matrix: Matrix) -> Exact:
    """Compute one small exact determinant by elimination without normalizing pivots."""

    rows, columns = _shape(matrix)
    if rows != columns:
        raise ModelContractError("internal determinant requires a square matrix")
    work = [list(row) for row in matrix]
    sign = 1
    determinant = Fraction(1)
    for column in range(columns):
        candidate = next(
            (row for row in range(column, rows) if work[row][column] != 0),
            None,
        )
        if candidate is None:
            return Fraction(0)
        if candidate != column:
            work[column], work[candidate] = work[candidate], work[column]
            sign *= -1
        pivot = work[column][column]
        determinant *= pivot
        for row in range(column + 1, rows):
            if work[row][column] == 0:
                continue
            factor = work[row][column] / pivot
            for index in range(column, columns):
                work[row][index] -= factor * work[column][index]
    return determinant if sign == 1 else -determinant


def _principal_submatrix(matrix: Matrix, indices: tuple[int, ...]) -> Matrix:
    """Extract a square principal submatrix in deterministic index order."""

    return tuple(tuple(matrix[row][column] for column in indices) for row in indices)


def _require_square_symmetric(matrix: Matrix, label: str) -> None:
    """Make the symmetry assumption explicit before PSD/spectral reasoning."""

    rows, columns = _shape(matrix)
    if rows != columns:
        raise ModelContractError(f"{label} must be square")
    if any(matrix[row][column] != matrix[column][row] for row in range(rows) for column in range(rows)):
        raise ModelContractError(f"{label} must be symmetric for this reasoning model")


def analyze_symmetric_psd(matrix: Iterable[object]) -> PSDReport:
    """Check PSD/PD evidence through exact principal-minor criteria.

    For a real symmetric matrix, nonnegative *all* principal minors are
    equivalent to positive semidefiniteness.  Positive leading principal minors
    are Sylvester's criterion for positive definiteness.  Both criteria and their
    assumptions are visible in the result instead of being reduced to a label.
    """

    exact_matrix = _coerce_matrix(matrix)
    _require_square_symmetric(exact_matrix, "matrix")
    dimension, _ = _shape(exact_matrix)
    if dimension > MAX_PSD_DIMENSION:
        raise ModelContractError(
            f"PSD principal-minor teaching check supports at most {MAX_PSD_DIMENSION} dimensions"
        )

    principal_minors: list[tuple[tuple[int, ...], Exact]] = []
    first_negative: tuple[tuple[int, ...], Exact] | None = None
    for size in range(1, dimension + 1):
        for indices in combinations(range(dimension), size):
            determinant = _determinant(_principal_submatrix(exact_matrix, indices))
            evidence = (indices, determinant)
            principal_minors.append(evidence)
            if determinant < 0 and first_negative is None:
                first_negative = evidence

    leading = tuple(
        _determinant(_principal_submatrix(exact_matrix, tuple(range(size))))
        for size in range(1, dimension + 1)
    )
    return PSDReport(
        matrix=exact_matrix,
        principal_minors=tuple(principal_minors),
        leading_principal_minors=leading,
        rank=_matrix_space_report(exact_matrix).rank,
        is_psd=first_negative is None,
        is_positive_definite=all(value > 0 for value in leading),
        first_negative_principal_minor=first_negative,
    )


def _finite_float(value: Exact, label: str) -> float:
    """Convert exact fixture data only where an explicitly numerical report needs it."""

    try:
        result = float(value)
    except OverflowError as error:
        raise ModelContractError(
            f"{label} must be representable as a finite float for this numerical estimate"
        ) from error
    if not isfinite(result) or (result == 0.0 and value != 0):
        raise ModelContractError(
            f"{label} must be representable as a finite float without underflow "
            "for this numerical estimate"
        )
    return result


def _unit_eigenvector_2x2(a: float, b: float, d: float, eigenvalue: float) -> FloatVector:
    """Choose a deterministic nonzero 2D eigenvector candidate and normalize it."""

    first = (b, eigenvalue - a)
    second = (eigenvalue - d, b)
    candidate = first if hypot(*first) >= hypot(*second) else second
    norm = hypot(*candidate)
    if norm == 0:
        raise RuntimeError("non-diagonal symmetric 2-by-2 matrix produced a zero eigenvector")
    return candidate[0] / norm, candidate[1] / norm


def symmetric_eigendecomposition_2x2(matrix: Iterable[object]) -> SymmetricEigenReport:
    """Return a tiny spectral trace for a symmetric 2-by-2 matrix.

    This deliberately stops at two dimensions so the characteristic-polynomial
    formula and the reconstruction are readable.  Larger-matrix eigen/SVD work
    belongs to a stable library and its separate numerical error analysis.
    """

    exact_matrix = _coerce_matrix(matrix)
    _require_square_symmetric(exact_matrix, "matrix")
    if _shape(exact_matrix) != (2, 2):
        raise ModelContractError("symmetric eigendecomposition teaching model requires a 2-by-2 matrix")

    a_exact, b_exact, d_exact = (
        exact_matrix[0][0],
        exact_matrix[0][1],
        exact_matrix[1][1],
    )
    a = _finite_float(a_exact, "matrix")
    b = _finite_float(b_exact, "matrix")
    d = _finite_float(d_exact, "matrix")
    center = (a + d) / 2.0
    radius = sqrt(((a - d) / 2.0) ** 2 + b**2)
    high = center + radius
    low = center - radius
    repeated = a_exact == d_exact and b_exact == 0

    if b_exact == 0:
        if a_exact > d_exact:
            vectors: tuple[FloatVector, FloatVector] = ((1.0, 0.0), (0.0, 1.0))
        elif d_exact > a_exact:
            vectors = ((0.0, 1.0), (1.0, 0.0))
        else:
            vectors = ((1.0, 0.0), (0.0, 1.0))
    else:
        vectors = (
            _unit_eigenvector_2x2(a, b, d, high),
            _unit_eigenvector_2x2(a, b, d, low),
        )

    reconstruction_error = 0.0
    for row in range(2):
        for column in range(2):
            reconstructed = sum(
                eigenvalue * vector[row] * vector[column]
                for eigenvalue, vector in zip((high, low), vectors)
            )
            reconstruction_error = max(
                reconstruction_error,
                abs(reconstructed - _finite_float(exact_matrix[row][column], "matrix")),
            )
    tolerance = 1e-12 * max(1.0, abs(high), abs(low))
    return SymmetricEigenReport(
        matrix=exact_matrix,
        eigenvalues=(high, low),
        eigenvectors=vectors,
        eigenvector_dot_product=_dot_float(vectors[0], vectors[1]),
        reconstruction_max_abs_error=reconstruction_error,
        eigenvalue_psd_indicator=low >= -tolerance,
        repeated_eigenvalue=repeated,
    )


def _dot_float(left: FloatVector, right: FloatVector) -> float:
    """Compute a small floating-point inner product for labeled numerical evidence."""

    return sum(first * second for first, second in zip(left, right))


def _coerce_2d_observations(observations: Iterable[object]) -> Matrix:
    """Validate a small exact point cloud with exactly two coordinates per point."""

    data = _coerce_matrix(observations, "observations")
    rows, columns = _shape(data)
    if rows < 2:
        raise ModelContractError("PCA teaching model requires at least two observations")
    if columns != 2:
        raise ModelContractError("PCA teaching model requires exactly two features")
    return data


def pca_2d(observations: Iterable[object]) -> PCA2DReport:
    """Derive two-feature PCA from centered variance and rank-one reconstruction.

    With population covariance ``C = X^T X / n``, the largest eigenvalue is the
    maximum variance over unit directions.  Reconstructing each centered point
    from that direction leaves squared error ``n * lambda_2``.  The report puts
    those two claims side by side, subject to its explicitly small numeric model.
    """

    data = _coerce_2d_observations(observations)
    sample_count, _ = _shape(data)
    mean = tuple(sum(row[column] for row in data) / sample_count for column in range(2))
    centered = tuple(
        tuple(row[column] - mean[column] for column in range(2)) for row in data
    )
    centered_transpose = _transpose(centered)
    covariance_product = _matmul(centered_transpose, centered)
    covariance = tuple(
        tuple(entry / sample_count for entry in row) for row in covariance_product
    )
    spectral = symmetric_eigendecomposition_2x2(covariance)
    direction = spectral.eigenvectors[0]
    scores = tuple(
        sum(_finite_float(point[index], "centered observation") * direction[index] for index in range(2))
        for point in centered
    )
    reconstructions = tuple(
        tuple(_finite_float(mean[index], "mean") + score * direction[index] for index in range(2))
        for score in scores
    )
    reconstruction_sse = sum(
        (
            _finite_float(point[index], "observation") - reconstruction[index]
        )
        ** 2
        for point, reconstruction in zip(data, reconstructions)
        for index in range(2)
    )
    high, low = spectral.eigenvalues
    total_variance = high + low
    retained = high / total_variance if total_variance > 1e-15 else None
    discarded = sample_count * low
    return PCA2DReport(
        observations=data,
        mean=mean,
        centered_observations=centered,
        covariance=covariance,
        eigenvalues=spectral.eigenvalues,
        principal_direction=direction,
        scores=scores,
        rank_one_reconstructions=reconstructions,
        retained_variance_ratio=retained,
        rank_one_reconstruction_sse=reconstruction_sse,
        discarded_variance_times_sample_count=discarded,
        variance_reconstruction_identity_error=abs(reconstruction_sse - discarded),
        repeated_top_eigenvalue=spectral.repeated_eigenvalue,
    )


def _require_2_by_2(matrix: Matrix, label: str) -> None:
    """Keep numerical demonstrations bounded enough to inspect by hand."""

    if _shape(matrix) != (2, 2):
        raise ModelContractError(f"{label} must be a 2-by-2 matrix in this teaching model")


def condition_report_2x2(matrix: Iterable[object]) -> ConditionReport:
    """Estimate the 2-norm condition number using the eigenvalues of A^T A.

    Exact determinant zero is the authority for singularity.  A finite float may
    still lose a very small nonzero singular value; that is reported separately
    instead of being mislabeled as a mathematical proof of singularity.
    """

    exact_matrix = _coerce_matrix(matrix)
    _require_2_by_2(exact_matrix, "matrix")
    determinant = _determinant(exact_matrix)
    gram = _matmul(_transpose(exact_matrix), exact_matrix)
    spectral = symmetric_eigendecomposition_2x2(gram)
    high_eigenvalue, low_eigenvalue = spectral.eigenvalues
    sigma_high = sqrt(max(0.0, high_eigenvalue))
    sigma_low = sqrt(max(0.0, low_eigenvalue))
    singular = determinant == 0
    resolution_lost = not singular and sigma_low == 0.0
    if singular or sigma_low == 0.0:
        condition = inf
    else:
        condition = sigma_high / sigma_low
    return ConditionReport(
        matrix=exact_matrix,
        determinant=determinant,
        singular_values=(sigma_high, sigma_low),
        condition_number_2=condition,
        is_singular=singular,
        floating_resolution_lost=resolution_lost,
    )


def _euclidean_norm(vector: Vector, label: str) -> float:
    """Compute a labeled floating norm after validating all entries are representable."""

    return sqrt(sum(_finite_float(entry, label) ** 2 for entry in vector))


def rhs_sensitivity_2x2(
    matrix: Iterable[object],
    baseline_rhs: Iterable[object],
    perturbed_rhs: Iterable[object],
) -> SensitivityReport:
    """Compare exact solutions after a small right-hand-side perturbation.

    For fixed invertible A, the report checks the familiar relative perturbation
    inequality against its 2-norm condition-number estimate.  A large response
    can therefore be a property of the problem, even though this model solves
    both tiny systems exactly and has no unstable implementation step to blame.
    """

    exact_matrix = _coerce_matrix(matrix)
    _require_2_by_2(exact_matrix, "matrix")
    if _determinant(exact_matrix) == 0:
        raise ModelContractError("RHS sensitivity requires an invertible matrix")
    baseline = _coerce_vector(baseline_rhs, "baseline RHS", expected_length=2)
    perturbed = _coerce_vector(perturbed_rhs, "perturbed RHS", expected_length=2)
    baseline_norm = _euclidean_norm(baseline, "baseline RHS")
    if baseline_norm == 0.0:
        raise ModelContractError("baseline RHS must be nonzero for a relative-change report")

    baseline_solution = _solve_invertible_square(exact_matrix, baseline)
    perturbed_solution = _solve_invertible_square(exact_matrix, perturbed)
    baseline_solution_norm = _euclidean_norm(baseline_solution, "baseline solution")
    if baseline_solution_norm == 0.0:
        raise ModelContractError("baseline solution must be nonzero for a relative-change report")

    rhs_delta = tuple(new - old for old, new in zip(baseline, perturbed))
    solution_delta = tuple(
        new - old for old, new in zip(baseline_solution, perturbed_solution)
    )
    relative_rhs = _euclidean_norm(rhs_delta, "RHS perturbation") / baseline_norm
    relative_solution = (
        _euclidean_norm(solution_delta, "solution perturbation") / baseline_solution_norm
    )
    condition = condition_report_2x2(exact_matrix).condition_number_2
    observed = relative_solution / relative_rhs if relative_rhs != 0.0 else None
    bound = condition * relative_rhs
    tolerance = 1e-10 * max(1.0, abs(bound))
    obeys = relative_solution <= bound + tolerance
    return SensitivityReport(
        baseline_solution=baseline_solution,
        perturbed_solution=perturbed_solution,
        relative_rhs_change=relative_rhs,
        relative_solution_change=relative_solution,
        observed_amplification=observed,
        condition_number_2=condition,
        condition_bound=bound,
        obeys_condition_bound=obeys,
    )


def _require_significant_digits(value: object) -> int:
    """Validate a deliberately small decimal precision for the toy model."""

    if isinstance(value, bool) or not isinstance(value, int):
        raise ModelContractError("significant_digits must be an integer")
    if not 1 <= value <= MAX_DECIMAL_SIGNIFICANT_DIGITS:
        raise ModelContractError(
            f"significant_digits must be between 1 and {MAX_DECIMAL_SIGNIFICANT_DIGITS}"
        )
    return value


def _decimal_exponent(value: Exact) -> int:
    """Return floor(log10(abs(value))) using only exact fraction comparisons."""

    magnitude = abs(value)
    if magnitude == 0:
        raise ModelContractError("zero has no significant-digit exponent")
    if magnitude >= 1:
        exponent = 0
        threshold = Fraction(10)
        while magnitude >= threshold:
            exponent += 1
            threshold *= 10
        return exponent

    exponent = -1
    threshold = Fraction(1, 10)
    while magnitude < threshold:
        exponent -= 1
        threshold /= 10
    return exponent


def _round_half_even(value: Exact) -> int:
    """Round an exact rational to the nearest integer, breaking exact ties to even."""

    lower = value.numerator // value.denominator
    remainder = value - lower
    half = Fraction(1, 2)
    if remainder < half:
        return lower
    if remainder > half:
        return lower + 1
    return lower if lower % 2 == 0 else lower + 1


def _round_to_significant(value: Exact, digits: int) -> Exact:
    """Apply one explicitly documented base-10 significant-digit rounding step."""

    if value == 0:
        return Fraction(0)
    exponent = _decimal_exponent(value)
    shift = digits - 1 - exponent
    scale = Fraction(10**shift) if shift >= 0 else Fraction(1, 10 ** (-shift))
    return Fraction(_round_half_even(value * scale)) / scale


def decimal_cancellation_demo(
    left: object, right: object, *, significant_digits: int
) -> CancellationReport:
    """Expose cancellation after each operand is stored with toy decimal precision.

    The model rounds both inputs and the subtraction result using round-to-nearest,
    ties-to-even.  It deliberately does not impersonate one machine's binary
    floating-point instruction sequence.
    """

    exact_left = _coerce_exact(left, "left")
    exact_right = _coerce_exact(right, "right")
    digits = _require_significant_digits(significant_digits)
    rounded_left = _round_to_significant(exact_left, digits)
    rounded_right = _round_to_significant(exact_right, digits)
    exact_difference = exact_left - exact_right
    rounded_difference = _round_to_significant(rounded_left - rounded_right, digits)
    return CancellationReport(
        left=exact_left,
        right=exact_right,
        significant_digits=digits,
        rounded_left=rounded_left,
        rounded_right=rounded_right,
        exact_difference=exact_difference,
        rounded_difference=rounded_difference,
        absolute_error=abs(rounded_difference - exact_difference),
    )
