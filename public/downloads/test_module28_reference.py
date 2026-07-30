"""Behavioral seams for Module 28's finite linear-algebra teaching model."""

from __future__ import annotations

from fractions import Fraction
from math import isinf
import unittest

import module28_reference as model


class ExactMatrixSpaceTests(unittest.TestCase):
    def test_rref_rank_null_and_column_space_keep_distinct_evidence(self) -> None:
        report = model.analyze_matrix(
            (
                (1, 2, 3),
                (2, 4, 6),
            )
        )

        self.assertEqual(
            report.rref,
            ((Fraction(1), Fraction(2), Fraction(3)), (Fraction(0), Fraction(0), Fraction(0))),
        )
        self.assertEqual(report.rank, 1)
        self.assertEqual(report.pivot_columns, (0,))
        self.assertEqual(report.free_columns, (1, 2))
        self.assertEqual(
            report.null_space_basis,
            ((Fraction(-2), Fraction(1), Fraction(0)), (Fraction(-3), Fraction(0), Fraction(1))),
        )
        # Pivot *indices* come from RREF, but the basis vectors come from the
        # original matrix. This is the common column-space misunderstanding.
        self.assertEqual(report.column_space_basis, ((Fraction(1), Fraction(2)),))
        self.assertEqual(report.row_space_basis, ((Fraction(1), Fraction(2), Fraction(3)),))

    def test_full_rank_square_matrix_has_no_free_variables(self) -> None:
        report = model.analyze_matrix(((1, 2), (3, 4)))

        self.assertEqual(report.rank, 2)
        self.assertEqual(report.null_space_basis, ())
        self.assertEqual(report.column_space_basis, ((Fraction(1), Fraction(3)), (Fraction(2), Fraction(4))))

    def test_each_reported_null_vector_solves_the_original_homogeneous_system(self) -> None:
        matrix = ((1, 2, 3), (2, 4, 6))
        report = model.analyze_matrix(matrix)

        for vector in report.null_space_basis:
            self.assertEqual(
                tuple(
                    sum(Fraction(entry) * coordinate for entry, coordinate in zip(row, vector))
                    for row in matrix
                ),
                (Fraction(0), Fraction(0)),
            )

    def test_exact_model_rejects_ambiguous_floats_and_ragged_matrices(self) -> None:
        with self.assertRaisesRegex(model.ModelContractError, "integers or Fraction"):
            model.analyze_matrix(((1.0, 2.0),))
        with self.assertRaisesRegex(model.ModelContractError, "same positive length"):
            model.analyze_matrix(((1, 2), (3,)))


class ProjectionAndLeastSquaresTests(unittest.TestCase):
    def test_least_squares_residual_is_orthogonal_to_each_design_column(self) -> None:
        report = model.least_squares_projection(
            (
                (1, 0),
                (1, 1),
                (1, 2),
            ),
            (1, 2, 2),
        )

        self.assertEqual(report.coefficients, (Fraction(7, 6), Fraction(1, 2)))
        self.assertEqual(report.fitted, (Fraction(7, 6), Fraction(5, 3), Fraction(13, 6)))
        self.assertEqual(report.residual, (Fraction(-1, 6), Fraction(1, 3), Fraction(-1, 6)))
        self.assertEqual(report.residual_dot_columns, (Fraction(0), Fraction(0)))
        self.assertTrue(report.residual_is_orthogonal)
        self.assertEqual(report.squared_residual_norm, Fraction(1, 6))

    def test_rank_deficient_design_is_rejected_instead_of_claiming_one_solution(self) -> None:
        with self.assertRaisesRegex(model.ModelContractError, "full column rank"):
            model.least_squares_projection(((1, 1), (2, 2)), (1, 2))


class SymmetricAndSpectralTests(unittest.TestCase):
    def test_principal_minors_give_exact_psd_and_positive_definite_evidence(self) -> None:
        report = model.analyze_symmetric_psd(((2, -1), (-1, 2)))

        self.assertTrue(report.is_psd)
        self.assertTrue(report.is_positive_definite)
        self.assertEqual(report.rank, 2)
        self.assertEqual(report.first_negative_principal_minor, None)
        self.assertEqual(
            report.principal_minors,
            (((0,), Fraction(2)), ((1,), Fraction(2)), ((0, 1), Fraction(3))),
        )

    def test_negative_principal_minor_is_a_concrete_non_psd_witness(self) -> None:
        report = model.analyze_symmetric_psd(((1, 2), (2, 1)))

        self.assertFalse(report.is_psd)
        self.assertEqual(report.first_negative_principal_minor, ((0, 1), Fraction(-3)))

    def test_zero_principal_minor_can_be_psd_without_being_positive_definite(self) -> None:
        report = model.analyze_symmetric_psd(((1, 1), (1, 1)))

        self.assertTrue(report.is_psd)
        self.assertFalse(report.is_positive_definite)
        self.assertEqual(report.rank, 1)

    def test_psd_analysis_requires_the_symmetric_assumption(self) -> None:
        with self.assertRaisesRegex(model.ModelContractError, "symmetric"):
            model.analyze_symmetric_psd(((1, 1), (0, 1)))

    def test_symmetric_eigendecomposition_reconstructs_a_small_matrix(self) -> None:
        report = model.symmetric_eigendecomposition_2x2(((2, 1), (1, 2)))

        self.assertAlmostEqual(report.eigenvalues[0], 3.0)
        self.assertAlmostEqual(report.eigenvalues[1], 1.0)
        self.assertAlmostEqual(report.eigenvector_dot_product, 0.0, places=12)
        self.assertLess(report.reconstruction_max_abs_error, 1e-12)
        self.assertTrue(report.eigenvalue_psd_indicator)
        self.assertFalse(report.repeated_eigenvalue)

    def test_repeated_eigenvalue_marks_direction_as_non_unique(self) -> None:
        report = model.symmetric_eigendecomposition_2x2(((5, 0), (0, 5)))

        self.assertTrue(report.repeated_eigenvalue)
        self.assertLess(report.reconstruction_max_abs_error, 1e-12)


class PCAAndNumericalBoundaryTests(unittest.TestCase):
    def test_pca_connects_variance_maximization_to_rank_one_reconstruction(self) -> None:
        report = model.pca_2d(((0, 0), (1, 1), (2, 2)))

        self.assertEqual(report.mean, (Fraction(1), Fraction(1)))
        self.assertEqual(
            report.covariance,
            ((Fraction(2, 3), Fraction(2, 3)), (Fraction(2, 3), Fraction(2, 3))),
        )
        self.assertAlmostEqual(report.eigenvalues[0], 4.0 / 3.0)
        self.assertAlmostEqual(report.eigenvalues[1], 0.0, places=12)
        self.assertAlmostEqual(report.retained_variance_ratio or 0.0, 1.0)
        self.assertLess(report.rank_one_reconstruction_sse, 1e-12)
        self.assertLess(report.variance_reconstruction_identity_error, 1e-12)

    def test_isotropic_data_makes_the_first_pca_direction_non_unique(self) -> None:
        report = model.pca_2d(((-1, 0), (1, 0), (0, -1), (0, 1)))

        self.assertTrue(report.repeated_top_eigenvalue)
        self.assertAlmostEqual(report.retained_variance_ratio or 0.0, 0.5)
        self.assertAlmostEqual(report.rank_one_reconstruction_sse, 2.0)
        self.assertLess(report.variance_reconstruction_identity_error, 1e-12)

    def test_condition_report_exposes_exact_singularity_and_an_ill_conditioned_case(self) -> None:
        stable = model.condition_report_2x2(((1, 0), (0, 1)))
        ill_conditioned = model.condition_report_2x2(
            ((1, 1), (1, Fraction(1001, 1000)))
        )
        singular = model.condition_report_2x2(((1, 2), (2, 4)))

        self.assertFalse(stable.is_singular)
        self.assertAlmostEqual(stable.condition_number_2, 1.0)
        self.assertFalse(ill_conditioned.is_singular)
        self.assertGreater(ill_conditioned.condition_number_2, 1_000.0)
        self.assertTrue(singular.is_singular)
        self.assertTrue(isinf(singular.condition_number_2))

    def test_numerical_estimate_rejects_an_exact_value_that_underflows_to_zero(self) -> None:
        with self.assertRaisesRegex(model.ModelContractError, "finite float"):
            model.condition_report_2x2(((Fraction(1, 10**200), 0), (0, 1)))

    def test_rhs_sensitivity_distinguishes_conditioning_from_an_algorithm_failure(self) -> None:
        report = model.rhs_sensitivity_2x2(
            ((1, 1), (1, Fraction(1001, 1000))),
            (2, Fraction(2001, 1000)),
            (2, Fraction(2002, 1000)),
        )

        self.assertEqual(report.baseline_solution, (Fraction(1), Fraction(1)))
        self.assertEqual(report.perturbed_solution, (Fraction(0), Fraction(2)))
        self.assertGreater(report.observed_amplification or 0.0, 1_000.0)
        self.assertTrue(report.obeys_condition_bound)
        self.assertIn("algorithm", report.limitation.lower())

    def test_decimal_cancellation_demo_makes_the_toy_rounding_rule_visible(self) -> None:
        report = model.decimal_cancellation_demo(1_234_567, 1_234_566, significant_digits=4)

        self.assertEqual(report.exact_difference, Fraction(1))
        self.assertEqual(report.rounded_left, Fraction(1_235_000))
        self.assertEqual(report.rounded_right, Fraction(1_235_000))
        self.assertEqual(report.rounded_difference, Fraction(0))
        self.assertEqual(report.absolute_error, Fraction(1))
        self.assertIn("toy", report.limitation.lower())

    def test_decimal_cancellation_digits_have_a_bounded_model_contract(self) -> None:
        with self.assertRaisesRegex(model.ModelContractError, "between 1 and 12"):
            model.decimal_cancellation_demo(1, 0, significant_digits=13)

    def test_decimal_cancellation_documents_ties_to_even(self) -> None:
        report = model.decimal_cancellation_demo(1_250, 0, significant_digits=2)

        self.assertEqual(report.rounded_left, Fraction(1_200))


if __name__ == "__main__":
    unittest.main()
