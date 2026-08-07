"""Finite, deterministic reasoning aids for Atlas Module 30.

This is a code-reading model for named, deliberately small probability and
inference fixtures.  It makes the seams between a probability model, a finite
calculation, an uncertainty procedure, and a scientific conclusion visible.
It never infers from learner data, calls a service, samples a production RNG,
fits an arbitrary model, or makes an individual-level decision.

Exact ``Fraction`` values are used wherever the fixture permits it.  A small
number of reports include a float only where the mathematical object itself is
an exponential or logistic transform; those reports label the finite-precision
boundary explicitly.
"""

from __future__ import annotations

from dataclasses import dataclass
from fractions import Fraction
from itertools import combinations, product
from math import comb, exp
from typing import Iterable, Literal, Mapping, Sequence, TypeAlias


Exact: TypeAlias = Fraction
Vector: TypeAlias = tuple[Exact, ...]
Matrix: TypeAlias = tuple[Vector, ...]
PosteriorModeStatus: TypeAlias = Literal[
    "unique interior",
    "unique boundary at zero",
    "unique boundary at one",
    "two boundary modes",
    "flat on [0, 1]",
]

MODEL_VERSION = "atlas-module30-reference/2"
MAX_OUTCOMES = 10
MAX_OBSERVATIONS = 64
MAX_MARKOV_STEPS = 16
MAX_PERMUTATION_OBSERVATIONS = 10
MAX_BOOTSTRAP_OBSERVATIONS = 5
MAX_BINOMIAL_TRIALS = 32

PROBABILITY_LIMITATION = (
    "This verifies one declared finite probability model. It does not show that "
    "a real sampling frame, measurement process, or data-generating process "
    "matches the model."
)
SIMULATION_LIMITATION = (
    "These supplied observations are a finite, deterministic fixture. Their "
    "frequency neither proves the declared Bernoulli probability nor validates "
    "independence, stationarity, a random-number generator, or a real population."
)
CONCENTRATION_LIMITATION = (
    "This evaluates Hoeffding's named IID bounded-variable bound for a declared "
    "epsilon. It does not test IID, quantify clustered/dependent data, or turn a "
    "bound into evidence that a particular population model is correct."
)
MARKOV_INEQUALITY_LIMITATION = (
    "This evaluates the algebraic Markov-inequality bound after the caller declares "
    "a nonnegative random variable with finite expectation and a positive threshold. "
    "It does not establish nonnegativity, a finite mean, a distribution, independence, "
    "or that this bound is informative for a real data-generating process."
)
MARKOV_LIMITATION = (
    "This is an exact finite-state, time-homogeneous Markov calculation under "
    "the supplied transition matrix. It does not establish that a real sequence "
    "is Markov, stationary, observed without selection, or adequately modeled by "
    "one transition matrix."
)
BIVARIATE_GAUSSIAN_LIMITATION = (
    "This carries a declared two-dimensional Gaussian mean/covariance through a "
    "declared affine map. It does not infer Gaussianity from data or a plot, "
    "validate sampling/selection/measurement, establish independence from zero "
    "covariance outside the declared Gaussian model, or make a causal claim."
)
BAYES_LIMITATION = (
    "This is a Beta--Binomial conjugate update for declared exchangeable Bernoulli "
    "trials and a declared prior. It does not validate the prior, likelihood, "
    "identifiability, exchangeability, measurement, or decision policy."
)
INTERVAL_LIMITATION = (
    "This constructs an interval from a supplied estimate, standard error, and "
    "critical multiplier. It does not derive the standard error, establish coverage, "
    "make the parameter random, or license a causal or individual-level claim."
)
PERMUTATION_LIMITATION = (
    "This enumerates a tiny two-group permutation distribution. Its p-value is "
    "conditional on the stated exchangeability/null assignment mechanism and chosen "
    "statistic; it is not the probability that the null is true."
)
MULTIPLE_TESTING_LIMITATION = (
    "These are arithmetic threshold procedures, not a blanket inferential guarantee. "
    "Bonferroni and Benjamini--Hochberg claims require their own family, dependence, "
    "selection, and interpretation conditions."
)
POWER_LIMITATION = (
    "This is an exact binomial rejection-probability calculation for one predeclared "
    "one-sided rule. It does not validate a study's sampling, outcome measurement, "
    "effect size, stopping rule, or causal design."
)
BOOTSTRAP_LIMITATION = (
    "This exhaustively enumerates a tiny empirical bootstrap distribution under an "
    "IID resampling model. A percentile range is not automatically a calibrated "
    "confidence interval, especially for small, dependent, selected, or nonsmooth data."
)
REGRESSION_LIMITATION = (
    "This is an exact least-squares line for a named small fixture. It does not make "
    "the relation causal, establish linearity/independence/homoskedasticity, validate "
    "an extrapolation, or provide an uncertainty statement."
)
LOGISTIC_LIMITATION = (
    "This evaluates one declared log-odds score and logistic transform. A number in "
    "[0, 1] is not thereby calibrated, fair, causal, suitable for a decision, or a "
    "probability for an individual outside the declared model and population."
)
MISSINGNESS_LIMITATION = (
    "A missingness label is an assumption about an unobserved process, not something "
    "the observed values alone generally prove. This report classifies the claim boundary; "
    "it does not repair missingness or identify a target estimand."
)
ROBUSTNESS_LIMITATION = (
    "A mean/median contrast on one finite contamination fixture illustrates sensitivity. "
    "It does not choose a universally robust estimator, prove a distributional guarantee, "
    "or justify deleting inconvenient observations."
)
HIGH_DIMENSION_LIMITATION = (
    "This is a linear-algebra dimension boundary. It does not compute a rank, select a "
    "regularizer, establish generalization, or resolve identification from observational data."
)


class ModelContractError(ValueError):
    """Raised when a fixture is ambiguous, unsupported, or outside this model."""


def _exact(value: int | Fraction, label: str) -> Exact:
    if isinstance(value, bool) or not isinstance(value, (int, Fraction)):
        raise ModelContractError(f"{label} must be an integer or Fraction, not a float or bool")
    return Fraction(value)


def _positive_exact(value: int | Fraction, label: str) -> Exact:
    result = _exact(value, label)
    if result <= 0:
        raise ModelContractError(f"{label} must be greater than zero")
    return result


def _probability(value: int | Fraction, label: str) -> Exact:
    result = _exact(value, label)
    if result < 0 or result > 1:
        raise ModelContractError(f"{label} must be between zero and one")
    return result


def _probability_vector(values: Sequence[int | Fraction], label: str) -> Vector:
    if not values or len(values) > MAX_OUTCOMES:
        raise ModelContractError(f"{label} must contain between 1 and {MAX_OUTCOMES} values")
    result = tuple(_probability(value, f"{label}[{index}]") for index, value in enumerate(values))
    if sum(result, Fraction(0)) != 1:
        raise ModelContractError(f"{label} must sum exactly to one")
    return result


def _mean(values: Sequence[Exact]) -> Exact:
    if not values:
        raise ModelContractError("at least one value is required")
    return sum(values, Fraction(0)) / len(values)


def _median(values: Sequence[Exact]) -> Exact:
    ordered = tuple(sorted(values))
    middle = len(ordered) // 2
    if len(ordered) % 2:
        return ordered[middle]
    return (ordered[middle - 1] + ordered[middle]) / 2


@dataclass(frozen=True)
class FiniteEventReport:
    outcomes: tuple[str, ...]
    weights: Vector
    event: tuple[str, ...]
    event_probability: Exact
    complement_probability: Exact
    limitation: str = PROBABILITY_LIMITATION


def finite_event_report(
    outcome_weights: Mapping[str, int | Fraction], event: Iterable[str]
) -> FiniteEventReport:
    """Validate one finite PMF and calculate a declared event's probability."""

    if not outcome_weights or len(outcome_weights) > MAX_OUTCOMES:
        raise ModelContractError(f"outcome_weights must contain between 1 and {MAX_OUTCOMES} outcomes")
    outcomes = tuple(outcome_weights)
    if any(not isinstance(outcome, str) or not outcome for outcome in outcomes):
        raise ModelContractError("every outcome must be a nonempty string")
    weights = _probability_vector(tuple(outcome_weights.values()), "outcome_weights")
    if isinstance(event, str):
        raise ModelContractError("event must be an iterable of outcome names, not a string")
    event_set = set(event)
    if any(not isinstance(outcome, str) for outcome in event_set):
        raise ModelContractError("every event outcome must be a string")
    unknown = event_set.difference(outcomes)
    if unknown:
        raise ModelContractError(f"event contains outcomes outside the sample space: {sorted(unknown)!r}")
    ordered_event = tuple(outcome for outcome in outcomes if outcome in event_set)
    event_probability = sum(
        (weight for outcome, weight in zip(outcomes, weights) if outcome in event_set), Fraction(0)
    )
    return FiniteEventReport(
        outcomes=outcomes,
        weights=weights,
        event=ordered_event,
        event_probability=event_probability,
        complement_probability=1 - event_probability,
    )


@dataclass(frozen=True)
class JointDistributionReport:
    x_values: Vector
    y_values: Vector
    joint: Matrix
    x_marginal: Vector
    y_marginal: Vector
    conditioned_y_index: int
    conditioned_y_value: Exact
    probability_of_condition: Exact
    conditional_x_given_y: Vector
    expectation_x: Exact
    expectation_y: Exact
    covariance: Exact
    factors_as_independent: bool
    limitation: str = PROBABILITY_LIMITATION


def joint_distribution_report(
    joint: Sequence[Sequence[int | Fraction]],
    x_values: Sequence[int | Fraction],
    y_values: Sequence[int | Fraction],
    conditioned_y_index: int,
) -> JointDistributionReport:
    """Trace marginals, conditioning, covariance, and an independence check."""

    if not joint or len(joint) > MAX_OUTCOMES:
        raise ModelContractError(f"joint must contain between 1 and {MAX_OUTCOMES} rows")
    x = tuple(_exact(value, f"x_values[{index}]") for index, value in enumerate(x_values))
    y = tuple(_exact(value, f"y_values[{index}]") for index, value in enumerate(y_values))
    if len(x) != len(joint) or not y or len(y) > MAX_OUTCOMES:
        raise ModelContractError("x_values and y_values must match the nonempty joint-table dimensions")
    table: Matrix = tuple(
        tuple(_probability(value, f"joint[{row_index}][{column_index}]") for column_index, value in enumerate(row))
        for row_index, row in enumerate(joint)
    )
    if any(len(row) != len(y) for row in table):
        raise ModelContractError("every joint row must have the same length as y_values")
    if sum((sum(row, Fraction(0)) for row in table), Fraction(0)) != 1:
        raise ModelContractError("joint probabilities must sum exactly to one")
    if not isinstance(conditioned_y_index, int) or isinstance(conditioned_y_index, bool):
        raise ModelContractError("conditioned_y_index must be an integer")
    if not 0 <= conditioned_y_index < len(y):
        raise ModelContractError("conditioned_y_index is outside y_values")
    x_marginal = tuple(sum(row, Fraction(0)) for row in table)
    y_marginal = tuple(sum((row[column] for row in table), Fraction(0)) for column in range(len(y)))
    p_y = y_marginal[conditioned_y_index]
    if p_y == 0:
        raise ModelContractError("conditional probability requires a condition with positive probability")
    conditional = tuple(row[conditioned_y_index] / p_y for row in table)
    expected_x = sum((value * probability for value, probability in zip(x, x_marginal)), Fraction(0))
    expected_y = sum((value * probability for value, probability in zip(y, y_marginal)), Fraction(0))
    expected_xy = sum(
        (
            x[row_index] * y[column_index] * table[row_index][column_index]
            for row_index in range(len(x))
            for column_index in range(len(y))
        ),
        Fraction(0),
    )
    independent = all(
        table[row_index][column_index] == x_marginal[row_index] * y_marginal[column_index]
        for row_index in range(len(x))
        for column_index in range(len(y))
    )
    return JointDistributionReport(
        x_values=x,
        y_values=y,
        joint=table,
        x_marginal=x_marginal,
        y_marginal=y_marginal,
        conditioned_y_index=conditioned_y_index,
        conditioned_y_value=y[conditioned_y_index],
        probability_of_condition=p_y,
        conditional_x_given_y=conditional,
        expectation_x=expected_x,
        expectation_y=expected_y,
        covariance=expected_xy - expected_x * expected_y,
        factors_as_independent=independent,
    )


@dataclass(frozen=True)
class BivariateNormalAffineReport:
    mean: tuple[Exact, Exact]
    covariance: tuple[tuple[Exact, Exact], tuple[Exact, Exact]]
    transform: tuple[tuple[Exact, Exact], tuple[Exact, Exact]]
    shift: tuple[Exact, Exact]
    transformed_mean: tuple[Exact, Exact]
    transformed_covariance: tuple[tuple[Exact, Exact], tuple[Exact, Exact]]
    limitation: str = BIVARIATE_GAUSSIAN_LIMITATION


def bivariate_normal_affine_report(
    mean: Sequence[int | Fraction],
    covariance: Sequence[Sequence[int | Fraction]],
    transform: Sequence[Sequence[int | Fraction]],
    shift: Sequence[int | Fraction],
) -> BivariateNormalAffineReport:
    """Trace ``Y = A X + b`` for one declared bivariate-normal fixture.

    The function validates the two-dimensional covariance's symmetry and PSD
    condition, then reports the model consequences ``E[Y] = A mu + b`` and
    ``Cov(Y) = A Sigma A^T`` using exact fractions. It deliberately does not
    fit a Gaussian or invert a conditioning block.
    """

    if len(mean) != 2 or len(shift) != 2:
        raise ModelContractError("mean and shift must each contain exactly two values")
    if len(covariance) != 2 or any(len(row) != 2 for row in covariance):
        raise ModelContractError("covariance must be a two-by-two matrix")
    if len(transform) != 2 or any(len(row) != 2 for row in transform):
        raise ModelContractError("transform must be a two-by-two matrix")

    mean_exact = tuple(_exact(value, f"mean[{index}]") for index, value in enumerate(mean))
    shift_exact = tuple(_exact(value, f"shift[{index}]") for index, value in enumerate(shift))
    covariance_exact = tuple(
        tuple(_exact(value, f"covariance[{row_index}][{column_index}]") for column_index, value in enumerate(row))
        for row_index, row in enumerate(covariance)
    )
    transform_exact = tuple(
        tuple(_exact(value, f"transform[{row_index}][{column_index}]") for column_index, value in enumerate(row))
        for row_index, row in enumerate(transform)
    )

    if covariance_exact[0][1] != covariance_exact[1][0]:
        raise ModelContractError("covariance must be symmetric")
    first_variance = covariance_exact[0][0]
    second_variance = covariance_exact[1][1]
    determinant = first_variance * second_variance - covariance_exact[0][1] ** 2
    if first_variance < 0 or second_variance < 0 or determinant < 0:
        raise ModelContractError("covariance must be positive semidefinite")

    transformed_mean = tuple(
        sum((transform_exact[row][column] * mean_exact[column] for column in range(2)), Fraction(0))
        + shift_exact[row]
        for row in range(2)
    )
    transformed_covariance = tuple(
        tuple(
            sum(
                (
                    transform_exact[row][first]
                    * covariance_exact[first][second]
                    * transform_exact[column][second]
                    for first in range(2)
                    for second in range(2)
                ),
                Fraction(0),
            )
            for column in range(2)
        )
        for row in range(2)
    )
    return BivariateNormalAffineReport(
        mean=mean_exact,
        covariance=covariance_exact,
        transform=transform_exact,
        shift=shift_exact,
        transformed_mean=transformed_mean,
        transformed_covariance=transformed_covariance,
    )


@dataclass(frozen=True)
class BinaryBayesReport:
    prior_hypothesis: Exact
    sensitivity: Exact
    false_positive_rate: Exact
    evidence_probability: Exact
    posterior_hypothesis_given_positive: Exact
    likelihood_ratio: Exact | None
    limitation: str = PROBABILITY_LIMITATION


def binary_bayes_report(
    prior_hypothesis: int | Fraction,
    sensitivity: int | Fraction,
    false_positive_rate: int | Fraction,
) -> BinaryBayesReport:
    """Calculate one explicit base-rate-sensitive Bayes update."""

    prior = _probability(prior_hypothesis, "prior_hypothesis")
    true_positive = _probability(sensitivity, "sensitivity")
    false_positive = _probability(false_positive_rate, "false_positive_rate")
    evidence = true_positive * prior + false_positive * (1 - prior)
    if evidence == 0:
        raise ModelContractError("the positive-evidence event must have positive probability")
    likelihood_ratio = None if false_positive == 0 else true_positive / false_positive
    return BinaryBayesReport(
        prior_hypothesis=prior,
        sensitivity=true_positive,
        false_positive_rate=false_positive,
        evidence_probability=evidence,
        posterior_hypothesis_given_positive=true_positive * prior / evidence,
        likelihood_ratio=likelihood_ratio,
    )


@dataclass(frozen=True)
class BernoulliObservationReport:
    declared_success_probability: Exact
    observations: tuple[int, ...]
    success_count: int
    observed_frequency: Exact
    deviation_from_declared_probability: Exact
    limitation: str = SIMULATION_LIMITATION


def bernoulli_observation_report(
    declared_success_probability: int | Fraction, observations: Sequence[int]
) -> BernoulliObservationReport:
    """Label a finite observed frequency separately from its probability model."""

    probability = _probability(declared_success_probability, "declared_success_probability")
    if not observations or len(observations) > MAX_OBSERVATIONS:
        raise ModelContractError(f"observations must contain between 1 and {MAX_OBSERVATIONS} binary values")
    if any(value not in (0, 1) or isinstance(value, bool) for value in observations):
        raise ModelContractError("observations must contain integer 0/1 values, not bools")
    values = tuple(observations)
    successes = sum(values)
    frequency = Fraction(successes, len(values))
    return BernoulliObservationReport(
        declared_success_probability=probability,
        observations=values,
        success_count=successes,
        observed_frequency=frequency,
        deviation_from_declared_probability=abs(frequency - probability),
    )


@dataclass(frozen=True)
class HoeffdingBoundReport:
    sample_size: int
    epsilon: Exact
    exact_exponent: Exact
    upper_bound: float
    limitation: str = CONCENTRATION_LIMITATION


def hoeffding_bernoulli_bound_report(sample_size: int, epsilon: int | Fraction) -> HoeffdingBoundReport:
    """Evaluate ``2 exp(-2 n epsilon^2)`` for one named Bernoulli/IID boundary."""

    if not isinstance(sample_size, int) or isinstance(sample_size, bool) or not 1 <= sample_size <= MAX_OBSERVATIONS:
        raise ModelContractError(f"sample_size must be an integer between 1 and {MAX_OBSERVATIONS}")
    epsilon_exact = _positive_exact(epsilon, "epsilon")
    if epsilon_exact > 1:
        raise ModelContractError("epsilon must be at most one for this Bernoulli report")
    exponent = -2 * sample_size * epsilon_exact * epsilon_exact
    return HoeffdingBoundReport(
        sample_size=sample_size,
        epsilon=epsilon_exact,
        exact_exponent=exponent,
        upper_bound=min(1.0, 2.0 * exp(float(exponent))),
    )


@dataclass(frozen=True)
class MarkovInequalityReport:
    expected_value: Exact
    threshold: Exact
    named_upper_bound: Exact
    probability_upper_bound: Exact
    limitation: str = MARKOV_INEQUALITY_LIMITATION


def markov_inequality_report(
    expected_value: int | Fraction, threshold: int | Fraction
) -> MarkovInequalityReport:
    """Calculate Markov's bound for declared ``X >= 0, E[X] < infinity, t > 0``.

    ``named_upper_bound`` preserves the theorem's ``E[X] / t`` expression;
    ``probability_upper_bound`` also uses the universal probability cap of one.
    """

    expectation = _exact(expected_value, "expected_value")
    if expectation < 0:
        raise ModelContractError("expected_value must be nonnegative for Markov's inequality")
    threshold_exact = _positive_exact(threshold, "threshold")
    named_upper_bound = expectation / threshold_exact
    return MarkovInequalityReport(
        expected_value=expectation,
        threshold=threshold_exact,
        named_upper_bound=named_upper_bound,
        probability_upper_bound=min(Fraction(1), named_upper_bound),
    )


@dataclass(frozen=True)
class MarkovChainReport:
    initial_distribution: Vector
    transition: Matrix
    steps: int
    distribution_after_steps: Vector
    limitation: str = MARKOV_LIMITATION


def finite_markov_chain_report(
    initial_distribution: Sequence[int | Fraction],
    transition: Sequence[Sequence[int | Fraction]],
    steps: int,
) -> MarkovChainReport:
    """Compute a finite-state distribution after bounded homogeneous transitions."""

    initial = _probability_vector(initial_distribution, "initial_distribution")
    if len(transition) != len(initial):
        raise ModelContractError("transition must have one row per state")
    matrix = tuple(_probability_vector(row, f"transition[{index}]") for index, row in enumerate(transition))
    if any(len(row) != len(initial) for row in matrix):
        raise ModelContractError("transition must be square with the state count")
    if not isinstance(steps, int) or isinstance(steps, bool) or not 0 <= steps <= MAX_MARKOV_STEPS:
        raise ModelContractError(f"steps must be an integer between 0 and {MAX_MARKOV_STEPS}")
    distribution = initial
    for _ in range(steps):
        distribution = tuple(
            sum((distribution[row] * matrix[row][column] for row in range(len(initial))), Fraction(0))
            for column in range(len(initial))
        )
    return MarkovChainReport(
        initial_distribution=initial,
        transition=matrix,
        steps=steps,
        distribution_after_steps=distribution,
    )


@dataclass(frozen=True)
class BetaBinomialReport:
    successes: int
    trials: int
    mle_success_probability: Exact
    likelihood_at_mle: Exact
    prior_alpha: Exact
    prior_beta: Exact
    posterior_alpha: Exact
    posterior_beta: Exact
    posterior_mean: Exact
    posterior_predictive_next_success: Exact
    posterior_mode: Exact | None
    posterior_mode_candidates: tuple[Exact, ...]
    posterior_mode_status: PosteriorModeStatus
    limitation: str = BAYES_LIMITATION


def beta_binomial_report(
    successes: int,
    trials: int,
    prior_alpha: int | Fraction,
    prior_beta: int | Fraction,
) -> BetaBinomialReport:
    """Compare a binomial MLE with one declared conjugate Bayesian update."""

    if not isinstance(trials, int) or isinstance(trials, bool) or not 1 <= trials <= MAX_BINOMIAL_TRIALS:
        raise ModelContractError(f"trials must be an integer between 1 and {MAX_BINOMIAL_TRIALS}")
    if not isinstance(successes, int) or isinstance(successes, bool) or not 0 <= successes <= trials:
        raise ModelContractError("successes must be an integer between zero and trials")
    alpha = _positive_exact(prior_alpha, "prior_alpha")
    beta = _positive_exact(prior_beta, "prior_beta")
    mle = Fraction(successes, trials)
    likelihood = Fraction(comb(trials, successes)) * mle**successes * (1 - mle) ** (trials - successes)
    posterior_alpha = alpha + successes
    posterior_beta = beta + trials - successes
    if posterior_alpha > 1 and posterior_beta > 1:
        mode: Exact | None = (posterior_alpha - 1) / (posterior_alpha + posterior_beta - 2)
        mode_candidates = (mode,)
        mode_status: PosteriorModeStatus = "unique interior"
    elif posterior_alpha == 1 and posterior_beta == 1:
        mode = None
        mode_candidates = ()
        mode_status = "flat on [0, 1]"
    elif posterior_alpha <= 1 and posterior_beta <= 1:
        if posterior_alpha == 1:
            mode = Fraction(1)
            mode_candidates = (mode,)
            mode_status = "unique boundary at one"
        elif posterior_beta == 1:
            mode = Fraction(0)
            mode_candidates = (mode,)
            mode_status = "unique boundary at zero"
        else:
            mode = None
            mode_candidates = (Fraction(0), Fraction(1))
            mode_status = "two boundary modes"
    elif posterior_alpha <= 1:
        mode = Fraction(0)
        mode_candidates = (mode,)
        mode_status = "unique boundary at zero"
    else:
        mode = Fraction(1)
        mode_candidates = (mode,)
        mode_status = "unique boundary at one"
    posterior_mean = posterior_alpha / (posterior_alpha + posterior_beta)
    return BetaBinomialReport(
        successes=successes,
        trials=trials,
        mle_success_probability=mle,
        likelihood_at_mle=likelihood,
        prior_alpha=alpha,
        prior_beta=beta,
        posterior_alpha=posterior_alpha,
        posterior_beta=posterior_beta,
        posterior_mean=posterior_mean,
        posterior_predictive_next_success=posterior_mean,
        posterior_mode=mode,
        posterior_mode_candidates=mode_candidates,
        posterior_mode_status=mode_status,
    )


@dataclass(frozen=True)
class StandardErrorIntervalReport:
    estimate: Exact
    standard_error: Exact
    critical_multiplier: Exact
    margin: Exact
    lower: Exact
    upper: Exact
    limitation: str = INTERVAL_LIMITATION


def standard_error_interval_report(
    estimate: int | Fraction,
    standard_error: int | Fraction,
    critical_multiplier: int | Fraction,
) -> StandardErrorIntervalReport:
    """Build a transparent interval from a deliberately supplied uncertainty contract."""

    center = _exact(estimate, "estimate")
    error = _positive_exact(standard_error, "standard_error")
    multiplier = _positive_exact(critical_multiplier, "critical_multiplier")
    margin = error * multiplier
    return StandardErrorIntervalReport(
        estimate=center,
        standard_error=error,
        critical_multiplier=multiplier,
        margin=margin,
        lower=center - margin,
        upper=center + margin,
    )


@dataclass(frozen=True)
class ExactPermutationReport:
    first_group: Vector
    second_group: Vector
    observed_mean_difference: Exact
    assignment_count: int
    as_or_more_extreme_count: int
    two_sided_p_value: Exact
    limitation: str = PERMUTATION_LIMITATION


def exact_permutation_mean_difference_report(
    first_group: Sequence[int | Fraction], second_group: Sequence[int | Fraction]
) -> ExactPermutationReport:
    """Enumerate all tiny assignments for an exact two-sided mean-difference test."""

    if not first_group or not second_group:
        raise ModelContractError("both groups must contain at least one observation")
    if len(first_group) + len(second_group) > MAX_PERMUTATION_OBSERVATIONS:
        raise ModelContractError(
            f"the two groups may contain at most {MAX_PERMUTATION_OBSERVATIONS} observations in total"
        )
    first = tuple(_exact(value, f"first_group[{index}]") for index, value in enumerate(first_group))
    second = tuple(_exact(value, f"second_group[{index}]") for index, value in enumerate(second_group))
    combined = first + second
    first_size = len(first)
    observed = _mean(first) - _mean(second)
    extreme = 0
    assignments = 0
    all_indices = tuple(range(len(combined)))
    for first_indices in combinations(all_indices, first_size):
        first_index_set = set(first_indices)
        permuted_first = tuple(combined[index] for index in first_indices)
        permuted_second = tuple(combined[index] for index in all_indices if index not in first_index_set)
        difference = _mean(permuted_first) - _mean(permuted_second)
        assignments += 1
        if abs(difference) >= abs(observed):
            extreme += 1
    return ExactPermutationReport(
        first_group=first,
        second_group=second,
        observed_mean_difference=observed,
        assignment_count=assignments,
        as_or_more_extreme_count=extreme,
        two_sided_p_value=Fraction(extreme, assignments),
    )


@dataclass(frozen=True)
class MultipleTestingReport:
    p_values: Vector
    alpha: Exact
    unadjusted_rejections: tuple[int, ...]
    bonferroni_threshold: Exact
    bonferroni_rejections: tuple[int, ...]
    benjamini_hochberg_rejections: tuple[int, ...]
    limitation: str = MULTIPLE_TESTING_LIMITATION


def multiple_testing_report(p_values: Sequence[int | Fraction], alpha: int | Fraction) -> MultipleTestingReport:
    """Make family-wise and FDR-style arithmetic thresholds inspectable."""

    if not p_values or len(p_values) > MAX_OUTCOMES:
        raise ModelContractError(f"p_values must contain between 1 and {MAX_OUTCOMES} values")
    p = tuple(_probability(value, f"p_values[{index}]") for index, value in enumerate(p_values))
    level = _positive_exact(alpha, "alpha")
    if level > 1:
        raise ModelContractError("alpha must be at most one")
    count = len(p)
    unadjusted = tuple(index for index, value in enumerate(p) if value <= level)
    bonferroni_threshold = level / count
    bonferroni = tuple(index for index, value in enumerate(p) if value <= bonferroni_threshold)
    ordered = sorted(enumerate(p), key=lambda entry: (entry[1], entry[0]))
    last_accepted_rank = 0
    for rank, (_, value) in enumerate(ordered, start=1):
        if value <= level * rank / count:
            last_accepted_rank = rank
    benjamini_hochberg = tuple(sorted(index for index, _ in ordered[:last_accepted_rank]))
    return MultipleTestingReport(
        p_values=p,
        alpha=level,
        unadjusted_rejections=unadjusted,
        bonferroni_threshold=bonferroni_threshold,
        bonferroni_rejections=bonferroni,
        benjamini_hochberg_rejections=benjamini_hochberg,
    )


@dataclass(frozen=True)
class BinomialDesignReport:
    trials: int
    null_success_probability: Exact
    alternative_success_probability: Exact
    reject_at_or_above: int
    type_one_error_under_null: Exact
    power_under_alternative: Exact
    limitation: str = POWER_LIMITATION


def _binomial_upper_tail(trials: int, probability: Exact, cutoff: int) -> Exact:
    return sum(
        (Fraction(comb(trials, successes)) * probability**successes * (1 - probability) ** (trials - successes)
        for successes in range(cutoff, trials + 1)),
        Fraction(0),
    )


def binomial_design_report(
    trials: int,
    null_success_probability: int | Fraction,
    alternative_success_probability: int | Fraction,
    reject_at_or_above: int,
) -> BinomialDesignReport:
    """Calculate size and power for one fixed one-sided binomial design."""

    if not isinstance(trials, int) or isinstance(trials, bool) or not 1 <= trials <= MAX_BINOMIAL_TRIALS:
        raise ModelContractError(f"trials must be an integer between 1 and {MAX_BINOMIAL_TRIALS}")
    if not isinstance(reject_at_or_above, int) or isinstance(reject_at_or_above, bool) or not 0 <= reject_at_or_above <= trials:
        raise ModelContractError("reject_at_or_above must be an integer between zero and trials")
    null = _probability(null_success_probability, "null_success_probability")
    alternative = _probability(alternative_success_probability, "alternative_success_probability")
    return BinomialDesignReport(
        trials=trials,
        null_success_probability=null,
        alternative_success_probability=alternative,
        reject_at_or_above=reject_at_or_above,
        type_one_error_under_null=_binomial_upper_tail(trials, null, reject_at_or_above),
        power_under_alternative=_binomial_upper_tail(trials, alternative, reject_at_or_above),
    )


@dataclass(frozen=True)
class ExactBootstrapMeanReport:
    observations: Vector
    lower_quantile: Exact
    upper_quantile: Exact
    resample_count: int
    bootstrap_mean: Exact
    lower_estimate: Exact
    upper_estimate: Exact
    limitation: str = BOOTSTRAP_LIMITATION


def exact_bootstrap_mean_report(
    observations: Sequence[int | Fraction], lower_quantile: int | Fraction, upper_quantile: int | Fraction
) -> ExactBootstrapMeanReport:
    """Enumerate a tiny empirical-bootstrap mean distribution and named quantiles."""

    if not 2 <= len(observations) <= MAX_BOOTSTRAP_OBSERVATIONS:
        raise ModelContractError(
            f"observations must contain between 2 and {MAX_BOOTSTRAP_OBSERVATIONS} values for exhaustive bootstrap"
        )
    values = tuple(_exact(value, f"observations[{index}]") for index, value in enumerate(observations))
    lower = _probability(lower_quantile, "lower_quantile")
    upper = _probability(upper_quantile, "upper_quantile")
    if lower >= upper:
        raise ModelContractError("lower_quantile must be strictly below upper_quantile")
    means = sorted(_mean(tuple(values[index] for index in indices)) for indices in product(range(len(values)), repeat=len(values)))
    lower_index = (lower * (len(means) - 1)).numerator // (lower * (len(means) - 1)).denominator
    upper_index = (upper * (len(means) - 1)).numerator // (upper * (len(means) - 1)).denominator
    return ExactBootstrapMeanReport(
        observations=values,
        lower_quantile=lower,
        upper_quantile=upper,
        resample_count=len(means),
        bootstrap_mean=_mean(means),
        lower_estimate=means[lower_index],
        upper_estimate=means[upper_index],
    )


@dataclass(frozen=True)
class LinearLeastSquaresReport:
    x_values: Vector
    y_values: Vector
    intercept: Exact
    slope: Exact
    predictions: Vector
    residuals: Vector
    residual_sum_of_squares: Exact
    limitation: str = REGRESSION_LIMITATION


def linear_least_squares_report(
    x_values: Sequence[int | Fraction], y_values: Sequence[int | Fraction]
) -> LinearLeastSquaresReport:
    """Fit and expose one exact univariate least-squares trace."""

    if not 2 <= len(x_values) <= MAX_OUTCOMES or len(x_values) != len(y_values):
        raise ModelContractError(f"x_values and y_values must have the same length between 2 and {MAX_OUTCOMES}")
    x = tuple(_exact(value, f"x_values[{index}]") for index, value in enumerate(x_values))
    y = tuple(_exact(value, f"y_values[{index}]") for index, value in enumerate(y_values))
    x_mean = _mean(x)
    y_mean = _mean(y)
    s_xx = sum(((value - x_mean) ** 2 for value in x), Fraction(0))
    if s_xx == 0:
        raise ModelContractError("least squares needs at least two distinct x values")
    s_xy = sum(((x[index] - x_mean) * (y[index] - y_mean) for index in range(len(x))), Fraction(0))
    slope = s_xy / s_xx
    intercept = y_mean - slope * x_mean
    predictions = tuple(intercept + slope * value for value in x)
    residuals = tuple(observed - predicted for observed, predicted in zip(y, predictions))
    return LinearLeastSquaresReport(
        x_values=x,
        y_values=y,
        intercept=intercept,
        slope=slope,
        predictions=predictions,
        residuals=residuals,
        residual_sum_of_squares=sum((residual * residual for residual in residuals), Fraction(0)),
    )


@dataclass(frozen=True)
class LogisticScoreReport:
    log_odds: Exact
    odds: float
    logistic_output: float
    limitation: str = LOGISTIC_LIMITATION


def logistic_score_report(log_odds: int | Fraction) -> LogisticScoreReport:
    """Expose the distinction between a linear log-odds score and a calibrated claim."""

    score = _exact(log_odds, "log_odds")
    if abs(score) > 10:
        raise ModelContractError("this bounded report accepts log_odds with absolute value at most 10")
    odds = exp(float(score))
    return LogisticScoreReport(log_odds=score, odds=odds, logistic_output=odds / (1.0 + odds))


@dataclass(frozen=True)
class MissingnessBoundaryReport:
    mechanism_label: str
    what_the_label_conditions_on: str
    observed_data_alone_proves_label: bool
    minimal_next_evidence: str
    limitation: str = MISSINGNESS_LIMITATION


def missingness_boundary_report(mechanism_label: str) -> MissingnessBoundaryReport:
    """Classify MCAR/MAR/MNAR as modeling assumptions, not data-cleaning facts."""

    if not isinstance(mechanism_label, str):
        raise ModelContractError("mechanism_label must be a string")
    label = mechanism_label.lower().strip()
    details = {
        "mcar": ("neither observed nor unobserved values", "sampling/process evidence that could support independence of missingness"),
        "mar": ("observed values, conditional on the modeled observed variables", "a declared observed-data model, measurement/process knowledge, and sensitivity analysis"),
        "mnar": ("unobserved value or missingness mechanism itself", "external process knowledge and a sensitivity/selection model; observed values alone do not identify it"),
        "unknown": ("an unspecified missingness process", "instrumentation, follow-up, data provenance, and a predeclared sensitivity plan"),
    }
    if label not in details:
        raise ModelContractError("mechanism_label must be one of: mcar, mar, mnar, unknown")
    condition, evidence = details[label]
    return MissingnessBoundaryReport(
        mechanism_label=label,
        what_the_label_conditions_on=condition,
        observed_data_alone_proves_label=False,
        minimal_next_evidence=evidence,
    )


@dataclass(frozen=True)
class RobustLocationReport:
    observations: Vector
    arithmetic_mean: Exact
    median: Exact
    absolute_gap: Exact
    limitation: str = ROBUSTNESS_LIMITATION


def robust_location_report(observations: Sequence[int | Fraction]) -> RobustLocationReport:
    """Contrast mean and median on one small, visible contamination fixture."""

    if not 3 <= len(observations) <= MAX_OBSERVATIONS:
        raise ModelContractError(f"observations must contain between 3 and {MAX_OBSERVATIONS} values")
    values = tuple(_exact(value, f"observations[{index}]") for index, value in enumerate(observations))
    mean = _mean(values)
    median = _median(values)
    return RobustLocationReport(
        observations=values,
        arithmetic_mean=mean,
        median=median,
        absolute_gap=abs(mean - median),
    )


@dataclass(frozen=True)
class HighDimensionalBoundaryReport:
    observation_count: int
    feature_count: int
    declared_design_rank: int
    coefficient_nullity: int
    unique_unregularized_least_squares_coefficients_possible: bool
    limitation: str = HIGH_DIMENSION_LIMITATION


def high_dimensional_boundary_report(
    observation_count: int, feature_count: int, declared_design_rank: int
) -> HighDimensionalBoundaryReport:
    """State the rank/nullity condition before claiming a unique linear fit."""

    if any(not isinstance(value, int) or isinstance(value, bool) for value in (observation_count, feature_count, declared_design_rank)):
        raise ModelContractError("observation_count, feature_count, and declared_design_rank must be integers")
    if observation_count < 1 or feature_count < 1:
        raise ModelContractError("observation_count and feature_count must be greater than zero")
    if not 0 <= declared_design_rank <= min(observation_count, feature_count):
        raise ModelContractError("declared_design_rank must be between zero and min(observation_count, feature_count)")
    nullity = feature_count - declared_design_rank
    return HighDimensionalBoundaryReport(
        observation_count=observation_count,
        feature_count=feature_count,
        declared_design_rank=declared_design_rank,
        coefficient_nullity=nullity,
        unique_unregularized_least_squares_coefficients_possible=declared_design_rank == feature_count,
    )
