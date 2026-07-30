"""Behavioral seams for Module 29's bounded analysis teaching model."""

from __future__ import annotations

from fractions import Fraction
import unittest

import module29_reference as model


class EpsilonDeltaTests(unittest.TestCase):
    def test_affine_certificate_derives_a_exact_delta_from_the_slope(self) -> None:
        report = model.affine_epsilon_delta_report(3, Fraction(1, 2), Fraction(1, 12))

        self.assertEqual(report.delta, Fraction(1, 6))
        self.assertEqual(report.probe_output_distance, Fraction(1, 4))
        self.assertTrue(report.probe_is_within_delta)
        self.assertTrue(report.probe_is_below_epsilon)
        self.assertTrue(report.probe_implication_holds)

    def test_affine_certificate_keeps_the_strict_boundary_visible(self) -> None:
        report = model.affine_epsilon_delta_report(3, Fraction(1, 2), Fraction(1, 6))

        self.assertFalse(report.probe_is_within_delta)
        self.assertFalse(report.probe_is_below_epsilon)
        self.assertTrue(report.probe_implication_holds)

    def test_constant_affine_difference_has_an_arbitrary_safe_delta_choice(self) -> None:
        report = model.affine_epsilon_delta_report(0, Fraction(1, 7), 99)

        self.assertEqual(report.delta, Fraction(1))
        self.assertEqual(report.probe_output_distance, Fraction(0))
        self.assertTrue(report.probe_is_below_epsilon)

    def test_affine_certificate_rejects_nonpositive_epsilon_and_floats(self) -> None:
        with self.assertRaisesRegex(model.ModelContractError, "greater than zero"):
            model.affine_epsilon_delta_report(1, 0)
        with self.assertRaisesRegex(model.ModelContractError, "integer or Fraction"):
            model.affine_epsilon_delta_report(1.0, 1)


class TaylorTests(unittest.TestCase):
    def test_sine_taylor_trace_has_an_exact_polynomial_and_remainder_bound(self) -> None:
        report = model.sine_taylor_report(Fraction(1, 2), 2)

        self.assertEqual(report.polynomial, Fraction(23, 48))
        self.assertEqual(report.next_omitted_term_bound, Fraction(1, 3840))
        self.assertLess(report.observed_float_absolute_error, float(report.next_omitted_term_bound))
        self.assertTrue(report.float_observation_is_within_bound)
        self.assertIn("floating-point", report.limitation)

    def test_sine_taylor_uses_the_alternating_pattern_for_negative_inputs(self) -> None:
        report = model.sine_taylor_report(Fraction(-1, 2), 3)

        self.assertEqual(report.polynomial, Fraction(-1_841, 3_840))
        self.assertEqual(report.next_omitted_term_bound, Fraction(1, 645_120))

    def test_sine_taylor_rejects_out_of_bound_points_and_invalid_counts(self) -> None:
        with self.assertRaisesRegex(model.ModelContractError, r"\|x\| <= 1"):
            model.sine_taylor_report(2, 1)
        with self.assertRaisesRegex(model.ModelContractError, "between 1 and 8"):
            model.sine_taylor_report(1, 9)


class DifferentialAndJacobianTests(unittest.TestCase):
    def test_quadratic_surface_exposes_gradient_hessian_and_exact_taylor_identity(self) -> None:
        report = model.quadratic_surface_report(
            ((2, 1), (1, 4)),
            (3, -2),
            (1, 2),
            (Fraction(1, 2), -1),
        )

        self.assertEqual(report.gradient_at_point, (Fraction(7), Fraction(7)))
        self.assertEqual(report.value_at_point, Fraction(10))
        self.assertEqual(report.linear_prediction, Fraction(13, 2))
        self.assertEqual(report.quadratic_correction, Fraction(7, 4))
        self.assertEqual(report.value_at_displaced_point, Fraction(33, 4))
        self.assertEqual(report.taylor_reconstruction, Fraction(33, 4))
        self.assertTrue(report.taylor_identity_holds)

    def test_quadratic_surface_requires_a_symmetric_two_by_two_hessian(self) -> None:
        with self.assertRaisesRegex(model.ModelContractError, "symmetric"):
            model.quadratic_surface_report(((1, 2), (0, 1)), (0, 0), (0, 0), (1, 1))
        with self.assertRaisesRegex(model.ModelContractError, "2-by-2"):
            model.quadratic_surface_report(((1,),), (0, 0), (0, 0), (1, 1))

    def test_affine_jacobian_reports_exact_output_change(self) -> None:
        report = model.affine_jacobian_report(
            ((1, 2), (-1, 3), (0, 4)),
            (2, -1),
            (3, Fraction(1, 2)),
        )

        self.assertEqual(report.output_at_point, (Fraction(0), Fraction(-5), Fraction(-4)))
        self.assertEqual(report.observed_output_change, (Fraction(4), Fraction(-3, 2), Fraction(2)))
        self.assertEqual(report.jacobian_times_displacement, report.observed_output_change)
        self.assertTrue(report.identity_holds)

    def test_affine_jacobian_rejects_dimension_mismatch_and_ambiguous_float(self) -> None:
        with self.assertRaisesRegex(model.ModelContractError, "length 2"):
            model.affine_jacobian_report(((1, 0), (0, 1)), (1,), (1, 1))
        with self.assertRaisesRegex(model.ModelContractError, "integer or Fraction"):
            model.affine_jacobian_report(((1.0, 0),), (1, 1), (1, 1))


class ChangeOfVariablesAndSeriesTests(unittest.TestCase):
    def test_change_of_variables_keeps_orientation_and_absolute_area_distinct(self) -> None:
        report = model.affine_change_of_variables_rectangle_report(
            ((2, 0), (0, -3)),
            4,
            5,
            Fraction(7, 2),
        )

        self.assertEqual(report.source_area, Fraction(20))
        self.assertEqual(report.signed_jacobian, Fraction(-6))
        self.assertEqual(report.absolute_jacobian, Fraction(6))
        self.assertEqual(report.transformed_area, Fraction(120))
        self.assertEqual(report.source_integral, Fraction(70))
        self.assertEqual(report.transformed_integral, Fraction(420))
        self.assertEqual(report.transformed_integral, report.jacobian_scaled_source_integral)
        self.assertTrue(report.identity_holds)
        self.assertEqual(report.transformed_vertices[3], (Fraction(8), Fraction(-15)))

    def test_change_of_variables_requires_an_invertible_map_and_positive_rectangle(self) -> None:
        with self.assertRaisesRegex(model.ModelContractError, "invertible"):
            model.affine_change_of_variables_rectangle_report(((1, 2), (2, 4)), 1, 1, 1)
        with self.assertRaisesRegex(model.ModelContractError, "greater than zero"):
            model.affine_change_of_variables_rectangle_report(((1, 0), (0, 1)), 0, 1, 1)

    def test_geometric_series_has_a_exact_prefix_limit_and_signed_tail(self) -> None:
        report = model.geometric_series_report(Fraction(-1, 2), 3)

        self.assertEqual(report.partial_sum, Fraction(3, 4))
        self.assertEqual(report.exact_limit, Fraction(2, 3))
        self.assertEqual(report.signed_remainder, Fraction(-1, 12))
        self.assertEqual(report.absolute_tail, Fraction(1, 12))
        self.assertEqual(report.next_term, Fraction(-1, 8))

    def test_geometric_series_rejects_a_ratio_without_the_stated_convergence_assumption(self) -> None:
        with self.assertRaisesRegex(model.ModelContractError, r"\|ratio\| < 1"):
            model.geometric_series_report(1, 3)
        with self.assertRaisesRegex(model.ModelContractError, "between 0 and 64"):
            model.geometric_series_report(Fraction(1, 2), 65)


class PointwiseAndNumericalBoundaryTests(unittest.TestCase):
    def test_power_sequence_distinguishes_an_interior_point_from_the_endpoint(self) -> None:
        interior = model.power_sequence_uniformity_report(4, Fraction(1, 2))
        endpoint = model.power_sequence_uniformity_report(4, 1)

        self.assertEqual(interior.function_value, Fraction(1, 16))
        self.assertEqual(interior.pointwise_limit_value, Fraction(0))
        self.assertEqual(endpoint.function_value, Fraction(1))
        self.assertEqual(endpoint.pointwise_limit_value, Fraction(1))
        self.assertEqual(endpoint.pointwise_error, Fraction(0))

    def test_power_sequence_uses_a_supremum_not_a_finite_grid_to_expose_nonuniformity(self) -> None:
        report = model.power_sequence_uniformity_report(10, Fraction(9, 10))

        self.assertEqual(report.supremum_error_on_unit_interval, Fraction(1))
        self.assertFalse(report.supremum_is_attained)
        self.assertFalse(report.converges_uniformly_on_unit_interval)
        self.assertGreater(report.near_endpoint_witness_error, Fraction(1, 3))
        self.assertIn("finite grid", report.limitation)

    def test_power_sequence_rejects_invalid_index_and_domain_point(self) -> None:
        with self.assertRaisesRegex(model.ModelContractError, "between 2 and 64"):
            model.power_sequence_uniformity_report(1, Fraction(1, 2))
        with self.assertRaisesRegex(model.ModelContractError, "closed interval"):
            model.power_sequence_uniformity_report(2, Fraction(3, 2))

    def test_finite_difference_shows_forward_truncation_and_centered_exactness_for_a_quadratic(self) -> None:
        report = model.quadratic_finite_difference_report(3, -2, 5, 4, Fraction(1, 10))

        self.assertEqual(report.exact_derivative, Fraction(22))
        self.assertEqual(report.forward_difference, Fraction(223, 10))
        self.assertEqual(report.centered_difference, Fraction(22))
        self.assertEqual(report.forward_signed_error, Fraction(3, 10))
        self.assertEqual(report.centered_signed_error, Fraction(0))

    def test_finite_difference_rejects_zero_or_ambiguous_step(self) -> None:
        with self.assertRaisesRegex(model.ModelContractError, "greater than zero"):
            model.quadratic_finite_difference_report(1, 0, 0, 0, 0)
        with self.assertRaisesRegex(model.ModelContractError, "integer or Fraction"):
            model.quadratic_finite_difference_report(1, 0, 0, 0, 0.1)

    def test_composite_trapezoid_has_exact_quadratic_error_and_refinement_reduces_it(self) -> None:
        coarse = model.composite_trapezoid_quadratic_report(1, 0, 0, 0, 1, 2)
        fine = model.composite_trapezoid_quadratic_report(1, 0, 0, 0, 1, 4)

        self.assertEqual(coarse.exact_integral, Fraction(1, 3))
        self.assertEqual(coarse.trapezoid_estimate, Fraction(3, 8))
        self.assertEqual(coarse.signed_error, Fraction(1, 24))
        self.assertEqual(fine.absolute_error, Fraction(1, 96))
        self.assertLess(fine.absolute_error, coarse.absolute_error)

    def test_composite_trapezoid_rejects_reversed_interval_and_excess_panels(self) -> None:
        with self.assertRaisesRegex(model.ModelContractError, "right must be greater"):
            model.composite_trapezoid_quadratic_report(1, 0, 0, 1, 1, 1)
        with self.assertRaisesRegex(model.ModelContractError, "between 1 and 64"):
            model.composite_trapezoid_quadratic_report(1, 0, 0, 0, 1, 65)

    def test_forward_euler_trace_exposes_the_exact_global_error_for_the_named_ode(self) -> None:
        report = model.euler_forced_quadratic_ode_report(5, Fraction(1, 4), 4)

        self.assertEqual(report.final_time, Fraction(1))
        self.assertEqual(report.euler_final_value, Fraction(23, 4))
        self.assertEqual(report.exact_final_value, Fraction(6))
        self.assertEqual(report.signed_global_error, Fraction(-1, 4))
        self.assertEqual(report.absolute_global_error, Fraction(1, 4))
        self.assertEqual(report.derived_error_magnitude, Fraction(1, 4))
        self.assertEqual(report.trace[2], model.EulerTracePoint(2, Fraction(1, 2), Fraction(41, 8), Fraction(21, 4)))

    def test_forward_euler_error_halves_when_the_step_halves_at_the_same_final_time(self) -> None:
        coarse = model.euler_forced_quadratic_ode_report(0, Fraction(1, 4), 4)
        fine = model.euler_forced_quadratic_ode_report(0, Fraction(1, 8), 8)

        self.assertEqual(coarse.final_time, fine.final_time)
        self.assertEqual(fine.absolute_global_error * 2, coarse.absolute_global_error)

    def test_forward_euler_rejects_invalid_step_and_unbounded_trace_request(self) -> None:
        with self.assertRaisesRegex(model.ModelContractError, "greater than zero"):
            model.euler_forced_quadratic_ode_report(0, 0, 1)
        with self.assertRaisesRegex(model.ModelContractError, "between 1 and 32"):
            model.euler_forced_quadratic_ode_report(0, 1, 33)


if __name__ == "__main__":
    unittest.main()
