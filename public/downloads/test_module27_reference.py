"""Behavioral seams for Module 27's finite discrete-mathematics model."""

from __future__ import annotations

import unittest

import module27_reference as model


class RelationClassificationTests(unittest.TestCase):
    def test_equivalence_relation_has_the_three_required_properties(self) -> None:
        report = model.classify_relation(
            ("a", "b", "c"),
            (
                ("a", "a"),
                ("a", "b"),
                ("b", "a"),
                ("b", "b"),
                ("c", "c"),
            ),
        )

        self.assertTrue(report.reflexive)
        self.assertTrue(report.symmetric)
        self.assertTrue(report.transitive)
        self.assertTrue(report.is_equivalence_relation)
        self.assertFalse(report.is_partial_order)

    def test_missing_composed_pair_is_a_transitivity_counterexample(self) -> None:
        report = model.classify_relation(
            ("a", "b", "c"),
            (("a", "b"), ("b", "c")),
        )

        self.assertFalse(report.transitive)
        self.assertEqual(report.transitivity_counterexample, ("a", "b", "c"))
        self.assertIn(("a", "c"), report.missing_transitive_pairs)

    def test_partial_order_is_not_mistaken_for_a_symmetric_relation(self) -> None:
        report = model.classify_relation(
            ("low", "middle", "high"),
            (
                ("low", "low"),
                ("middle", "middle"),
                ("high", "high"),
                ("low", "middle"),
                ("middle", "high"),
                ("low", "high"),
            ),
        )

        self.assertTrue(report.is_partial_order)
        self.assertTrue(report.antisymmetric)
        self.assertFalse(report.symmetric)

    def test_relation_edge_outside_the_declared_domain_is_rejected(self) -> None:
        with self.assertRaisesRegex(model.ModelContractError, "declared domain"):
            model.classify_relation(("a",), (("a", "outside"),))

    def test_duplicate_domain_labels_are_rejected_instead_of_becoming_ambiguous(self) -> None:
        with self.assertRaisesRegex(model.ModelContractError, "unique"):
            model.classify_relation(("a", "a"), ())


class GraphReasoningTests(unittest.TestCase):
    def test_transitive_closure_is_reachability_not_automatic_reflexivity(self) -> None:
        closure = model.transitive_closure(
            ("a", "b", "c"),
            (("a", "b"), ("b", "c")),
        )

        self.assertEqual(closure, (("a", "b"), ("a", "c"), ("b", "c")))
        self.assertNotIn(("a", "a"), closure)

    def test_cycle_creates_self_reachability_in_the_transitive_closure(self) -> None:
        closure = model.transitive_closure(
            ("a", "b"),
            (("a", "b"), ("b", "a")),
        )

        self.assertEqual(
            closure,
            (("a", "a"), ("a", "b"), ("b", "a"), ("b", "b")),
        )

    def test_topological_order_uses_declared_node_order_to_break_ties(self) -> None:
        result = model.topological_order_or_cycle(
            ("plan", "build", "test", "ship"),
            (("plan", "build"), ("build", "test"), ("test", "ship")),
        )

        self.assertTrue(result.is_dag)
        self.assertEqual(result.order, ("plan", "build", "test", "ship"))
        self.assertEqual(result.cycle, ())

    def test_cycle_result_contains_a_closed_deterministic_witness(self) -> None:
        result = model.topological_order_or_cycle(
            ("a", "b", "c"),
            (("a", "b"), ("b", "c"), ("c", "a")),
        )

        self.assertFalse(result.is_dag)
        self.assertEqual(result.order, ())
        self.assertEqual(result.cycle, ("a", "b", "c", "a"))


class MatchingTests(unittest.TestCase):
    def setUp(self) -> None:
        self.left = ("a", "b")
        self.right = ("1", "2")
        self.edges = (("a", "1"), ("a", "2"), ("b", "1"))

    def test_maximal_matching_can_still_fail_to_be_maximum(self) -> None:
        report = model.analyze_bipartite_matching(
            self.left,
            self.right,
            self.edges,
            (("a", "1"),),
        )

        self.assertTrue(report.is_matching)
        self.assertTrue(report.is_maximal)
        self.assertFalse(report.is_maximum)
        self.assertEqual(report.chosen_size, 1)
        self.assertEqual(report.maximum_size, 2)
        self.assertEqual(report.maximum_matching, (("a", "2"), ("b", "1")))

    def test_valid_maximum_matching_is_recognized(self) -> None:
        report = model.analyze_bipartite_matching(
            self.left,
            self.right,
            self.edges,
            (("a", "2"), ("b", "1")),
        )

        self.assertTrue(report.is_matching)
        self.assertTrue(report.is_maximal)
        self.assertTrue(report.is_maximum)
        self.assertEqual(report.maximum_size, 2)

    def test_reused_left_endpoint_is_not_a_matching(self) -> None:
        report = model.analyze_bipartite_matching(
            self.left,
            self.right,
            self.edges,
            (("a", "1"), ("a", "2")),
        )

        self.assertFalse(report.is_matching)
        self.assertIsNone(report.is_maximal)
        self.assertIsNone(report.maximum_size)
        self.assertIn("reuses left endpoint", report.reason)

    def test_unavailable_selected_edge_is_not_silently_accepted(self) -> None:
        report = model.analyze_bipartite_matching(
            self.left,
            self.right,
            self.edges,
            (("b", "2"),),
        )

        self.assertFalse(report.is_matching)
        self.assertIn("not an available bipartite edge", report.reason)

    def test_exhaustive_optimality_check_has_an_explicit_small_graph_limit(self) -> None:
        edges = tuple(("a", str(index)) for index in range(13))
        with self.assertRaisesRegex(model.ModelContractError, "at most 12 edges"):
            model.analyze_bipartite_matching(
                ("a",),
                tuple(str(index) for index in range(13)),
                edges,
                (),
            )


class CountingAndNumberTheoryTests(unittest.TestCase):
    def test_pascal_recurrence_produces_a_binomial_coefficient(self) -> None:
        self.assertEqual(model.binomial_coefficient(5, 2), 10)
        self.assertEqual(model.binomial_coefficient(6, 0), 1)
        self.assertEqual(model.binomial_coefficient(6, 6), 1)

    def test_binomial_domain_is_explicit(self) -> None:
        with self.assertRaisesRegex(model.ModelContractError, "0 <= k <= n"):
            model.binomial_coefficient(4, 5)

    def test_linear_recurrence_keeps_its_base_terms_visible(self) -> None:
        terms = model.linear_recurrence_terms((0, 1), (1, 1), 8)
        self.assertEqual(terms, (0, 1, 1, 2, 3, 5, 8, 13))

    def test_linear_recurrence_rejects_missing_or_misaligned_base_terms(self) -> None:
        with self.assertRaisesRegex(model.ModelContractError, "same positive length"):
            model.linear_recurrence_terms((1,), (1, 1), 5)
        with self.assertRaisesRegex(model.ModelContractError, "at least the order"):
            model.linear_recurrence_terms((0, 1), (1, 1), 1)

    def test_modular_inverse_is_checked_against_the_coprime_precondition(self) -> None:
        inverse = model.modular_inverse(3, 11)
        self.assertEqual(inverse, 4)
        self.assertEqual((3 * inverse) % 11, 1)

    def test_negative_value_can_have_a_canonical_modular_inverse(self) -> None:
        inverse = model.modular_inverse(-3, 11)
        self.assertEqual(inverse, 7)
        self.assertEqual((-3 * inverse) % 11, 1)

    def test_non_coprime_values_have_no_modular_inverse(self) -> None:
        with self.assertRaisesRegex(model.ModelContractError, "coprime"):
            model.modular_inverse(6, 15)

    def test_modulus_must_describe_a_nontrivial_congruence_class(self) -> None:
        with self.assertRaisesRegex(model.ModelContractError, "greater than one"):
            model.modular_inverse(1, 1)


if __name__ == "__main__":
    unittest.main()
