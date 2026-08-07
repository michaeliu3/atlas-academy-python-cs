"""Behavioral seams for Module 30's bounded probability/inference model."""

from __future__ import annotations

from fractions import Fraction
import unittest

import module30_reference as model


class ProbabilityModelTests(unittest.TestCase):
    def test_finite_event_separates_declared_event_from_its_complement(self) -> None:
        report = model.finite_event_report(
            {"a": Fraction(1, 2), "b": Fraction(1, 3), "c": Fraction(1, 6)},
            ["a", "c"],
        )

        self.assertEqual(report.event, ("a", "c"))
        self.assertEqual(report.event_probability, Fraction(2, 3))
        self.assertEqual(report.complement_probability, Fraction(1, 3))
        self.assertIn("sampling frame", report.limitation)

    def test_finite_event_rejects_an_unknown_outcome_and_non_normalized_model(self) -> None:
        with self.assertRaisesRegex(model.ModelContractError, "outside the sample space"):
            model.finite_event_report({"a": 1}, ["missing"])
        with self.assertRaisesRegex(model.ModelContractError, "sum exactly to one"):
            model.finite_event_report({"a": Fraction(1, 3), "b": Fraction(1, 3)}, ["a"])

    def test_joint_report_traces_marginals_conditionals_covariance_and_dependence(self) -> None:
        report = model.joint_distribution_report(
            ((Fraction(1, 4), Fraction(1, 4)), (Fraction(1, 8), Fraction(3, 8))),
            (0, 1),
            (0, 1),
            1,
        )

        self.assertEqual(report.x_marginal, (Fraction(1, 2), Fraction(1, 2)))
        self.assertEqual(report.y_marginal, (Fraction(3, 8), Fraction(5, 8)))
        self.assertEqual(report.conditional_x_given_y, (Fraction(2, 5), Fraction(3, 5)))
        self.assertEqual(report.covariance, Fraction(1, 16))
        self.assertFalse(report.factors_as_independent)

    def test_joint_report_requires_a_positive_conditioning_event(self) -> None:
        with self.assertRaisesRegex(model.ModelContractError, "positive probability"):
            model.joint_distribution_report(((1, 0), (0, 0)), (0, 1), (0, 1), 1)

    def test_bivariate_gaussian_affine_report_keeps_the_declared_model_and_exact_moments_visible(self) -> None:
        report = model.bivariate_normal_affine_report(
            (1, 2),
            ((2, 1), (1, 2)),
            ((1, 1), (1, -1)),
            (0, 0),
        )

        self.assertEqual(report.transformed_mean, (Fraction(3), Fraction(-1)))
        self.assertEqual(
            report.transformed_covariance,
            ((Fraction(6), Fraction(0)), (Fraction(0), Fraction(2))),
        )
        self.assertIn("does not infer Gaussianity", report.limitation)

    def test_bivariate_gaussian_affine_report_rejects_non_psd_or_nonsymmetric_covariance(self) -> None:
        with self.assertRaisesRegex(model.ModelContractError, "symmetric"):
            model.bivariate_normal_affine_report((0, 0), ((1, 0), (1, 1)), ((1, 0), (0, 1)), (0, 0))
        with self.assertRaisesRegex(model.ModelContractError, "positive semidefinite"):
            model.bivariate_normal_affine_report((0, 0), ((1, 2), (2, 1)), ((1, 0), (0, 1)), (0, 0))

    def test_binary_bayes_keeps_base_rate_and_evidence_visible(self) -> None:
        report = model.binary_bayes_report(Fraction(1, 100), Fraction(9, 10), Fraction(1, 20))

        self.assertEqual(report.evidence_probability, Fraction(117, 2000))
        self.assertEqual(report.posterior_hypothesis_given_positive, Fraction(2, 13))
        self.assertEqual(report.likelihood_ratio, Fraction(18))


class RepetitionAndStochasticProcessTests(unittest.TestCase):
    def test_finite_observation_is_not_promoted_to_a_probability_proof(self) -> None:
        report = model.bernoulli_observation_report(Fraction(1, 2), (1, 0, 1, 1))

        self.assertEqual(report.success_count, 3)
        self.assertEqual(report.observed_frequency, Fraction(3, 4))
        self.assertEqual(report.deviation_from_declared_probability, Fraction(1, 4))
        self.assertIn("neither proves", report.limitation)

    def test_observation_rejects_bool_and_nonbinary_values(self) -> None:
        with self.assertRaisesRegex(model.ModelContractError, "integer 0/1"):
            model.bernoulli_observation_report(Fraction(1, 2), (True, 0))
        with self.assertRaisesRegex(model.ModelContractError, "integer 0/1"):
            model.bernoulli_observation_report(Fraction(1, 2), (2, 0))

    def test_hoeffding_report_keeps_the_exact_exponent_and_float_bound_distinct(self) -> None:
        report = model.hoeffding_bernoulli_bound_report(8, Fraction(1, 2))

        self.assertEqual(report.exact_exponent, Fraction(-4))
        self.assertLess(report.upper_bound, 0.04)
        self.assertIn("IID", report.limitation)

    def test_markov_inequality_keeps_the_named_mean_bound_and_probability_cap_distinct(self) -> None:
        report = model.markov_inequality_report(3, 6)

        self.assertEqual(report.named_upper_bound, Fraction(1, 2))
        self.assertEqual(report.probability_upper_bound, Fraction(1, 2))
        self.assertIn("nonnegative", report.limitation)

    def test_markov_inequality_requires_a_nonnegative_mean_and_positive_threshold(self) -> None:
        with self.assertRaisesRegex(model.ModelContractError, "nonnegative"):
            model.markov_inequality_report(-1, 2)
        with self.assertRaisesRegex(model.ModelContractError, "greater than zero"):
            model.markov_inequality_report(1, 0)

    def test_finite_markov_chain_uses_the_declared_transition_matrix(self) -> None:
        report = model.finite_markov_chain_report(
            (1, 0),
            ((Fraction(1, 2), Fraction(1, 2)), (Fraction(1, 4), Fraction(3, 4))),
            2,
        )

        self.assertEqual(report.distribution_after_steps, (Fraction(3, 8), Fraction(5, 8)))
        self.assertIn("time-homogeneous", report.limitation)

    def test_markov_chain_rejects_nonstochastic_rows(self) -> None:
        with self.assertRaisesRegex(model.ModelContractError, "sum exactly to one"):
            model.finite_markov_chain_report((1, 0), ((Fraction(1, 3), Fraction(1, 3)), (0, 1)), 1)


class EstimationAndUncertaintyTests(unittest.TestCase):
    def test_beta_binomial_compares_mle_with_a_declared_posterior(self) -> None:
        report = model.beta_binomial_report(3, 4, 2, 2)

        self.assertEqual(report.mle_success_probability, Fraction(3, 4))
        self.assertEqual(report.likelihood_at_mle, Fraction(27, 64))
        self.assertEqual((report.posterior_alpha, report.posterior_beta), (Fraction(5), Fraction(3)))
        self.assertEqual(report.posterior_mean, Fraction(5, 8))
        self.assertEqual(report.posterior_mode, Fraction(2, 3))
        self.assertEqual(report.posterior_mode_status, "unique interior")
        self.assertIn("prior", report.limitation)

    def test_beta_binomial_distinguishes_boundary_map_cases_from_an_absent_interior_mode(self) -> None:
        zero_boundary = model.beta_binomial_report(0, 1, 1, 1)
        one_boundary = model.beta_binomial_report(1, 1, 1, 1)

        self.assertEqual((zero_boundary.posterior_alpha, zero_boundary.posterior_beta), (Fraction(1), Fraction(2)))
        self.assertEqual(zero_boundary.posterior_mode, Fraction(0))
        self.assertEqual(zero_boundary.posterior_mode_candidates, (Fraction(0),))
        self.assertEqual(zero_boundary.posterior_mode_status, "unique boundary at zero")
        self.assertEqual(one_boundary.posterior_mode, Fraction(1))
        self.assertEqual(one_boundary.posterior_mode_candidates, (Fraction(1),))
        self.assertEqual(one_boundary.posterior_mode_status, "unique boundary at one")

    def test_interval_report_exposes_supplied_standard_error_contract(self) -> None:
        report = model.standard_error_interval_report(10, Fraction(1, 2), 2)

        self.assertEqual(report.margin, 1)
        self.assertEqual((report.lower, report.upper), (Fraction(9), Fraction(11)))
        self.assertIn("coverage", report.limitation)

    def test_exact_permutation_report_uses_all_tiny_assignments(self) -> None:
        report = model.exact_permutation_mean_difference_report((1, 3), (5, 7))

        self.assertEqual(report.observed_mean_difference, -4)
        self.assertEqual(report.assignment_count, 6)
        self.assertEqual(report.as_or_more_extreme_count, 2)
        self.assertEqual(report.two_sided_p_value, Fraction(1, 3))
        self.assertIn("null", report.limitation)

    def test_multiple_testing_distinguishes_unadjusted_bonferroni_and_bh(self) -> None:
        report = model.multiple_testing_report((Fraction(1, 100), Fraction(1, 25), Fraction(1, 5)), Fraction(1, 20))

        self.assertEqual(report.unadjusted_rejections, (0, 1))
        self.assertEqual(report.bonferroni_threshold, Fraction(1, 60))
        self.assertEqual(report.bonferroni_rejections, (0,))
        self.assertEqual(report.benjamini_hochberg_rejections, (0,))

    def test_binomial_design_makes_size_and_power_conditional_on_the_design(self) -> None:
        report = model.binomial_design_report(3, Fraction(1, 2), Fraction(3, 4), 3)

        self.assertEqual(report.type_one_error_under_null, Fraction(1, 8))
        self.assertEqual(report.power_under_alternative, Fraction(27, 64))
        self.assertIn("predeclared", report.limitation)

    def test_bootstrap_enumeration_is_bounded_and_explicit_about_quantiles(self) -> None:
        report = model.exact_bootstrap_mean_report((0, 2), Fraction(1, 4), Fraction(3, 4))

        self.assertEqual(report.resample_count, 4)
        self.assertEqual(report.bootstrap_mean, 1)
        self.assertEqual((report.lower_estimate, report.upper_estimate), (Fraction(0), Fraction(1)))
        self.assertIn("IID", report.limitation)


class ModelingBoundaryTests(unittest.TestCase):
    def test_exact_linear_regression_is_not_a_causal_conclusion(self) -> None:
        report = model.linear_least_squares_report((0, 1, 2), (1, 3, 5))

        self.assertEqual((report.intercept, report.slope), (Fraction(1), Fraction(2)))
        self.assertEqual(report.residual_sum_of_squares, 0)
        self.assertIn("causal", report.limitation)

    def test_linear_regression_rejects_a_degenerate_design(self) -> None:
        with self.assertRaisesRegex(model.ModelContractError, "distinct x values"):
            model.linear_least_squares_report((1, 1), (2, 3))

    def test_logistic_score_separates_log_odds_from_calibration(self) -> None:
        report = model.logistic_score_report(0)

        self.assertEqual(report.odds, 1.0)
        self.assertEqual(report.logistic_output, 0.5)
        self.assertIn("calibrated", report.limitation)

    def test_missingness_labels_are_not_proved_by_observed_values(self) -> None:
        report = model.missingness_boundary_report("MAR")

        self.assertEqual(report.mechanism_label, "mar")
        self.assertFalse(report.observed_data_alone_proves_label)
        self.assertIn("sensitivity", report.minimal_next_evidence)
        with self.assertRaisesRegex(model.ModelContractError, "mcar, mar, mnar, unknown"):
            model.missingness_boundary_report("complete")

    def test_mean_median_gap_is_a_fixture_not_a_deletion_rule(self) -> None:
        report = model.robust_location_report((0, 0, 0, 100))

        self.assertEqual(report.arithmetic_mean, 25)
        self.assertEqual(report.median, 0)
        self.assertEqual(report.absolute_gap, 25)
        self.assertIn("deleting", report.limitation)

    def test_high_dimensional_report_makes_nullity_visible(self) -> None:
        report = model.high_dimensional_boundary_report(3, 5, 3)

        self.assertEqual(report.coefficient_nullity, 2)
        self.assertFalse(report.unique_unregularized_least_squares_coefficients_possible)
        self.assertIn("regularizer", report.limitation)
        with self.assertRaisesRegex(model.ModelContractError, r"min\(observation_count, feature_count\)"):
            model.high_dimensional_boundary_report(3, 5, 4)


if __name__ == "__main__":
    unittest.main()
