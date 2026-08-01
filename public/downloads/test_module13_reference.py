"""Behavioral seams for Module 13's bounded evidence-and-repair model."""

from __future__ import annotations

import unittest

import module13_reference as model


class TerminalSignalContractTests(unittest.TestCase):
    def test_one_terminal_rejection_is_a_truthful_finite_run_trace(self) -> None:
        report = model.inspect_terminal_contract(
            (
                model.RunSignal("atlas-42", "started", "pending", "received-source"),
                model.RunSignal("atlas-42", "progress", "pending", "parsed-row-17"),
                model.RunSignal(
                    "atlas-42",
                    "terminal",
                    "rejected",
                    "duplicate-event-id",
                ),
            )
        )

        self.assertTrue(report.satisfies_terminal_contract)
        self.assertEqual(report.terminal_outcome, "rejected")
        self.assertEqual(report.terminal_reason, "duplicate-event-id")
        self.assertEqual(report.violations, ())
        self.assertIn("does not prove", report.scope)

    def test_success_looking_progress_before_rejection_is_a_premature_success(self) -> None:
        report = model.inspect_terminal_contract(
            (
                model.RunSignal("atlas-42", "started", "pending", "received-source"),
                model.RunSignal("atlas-42", "progress", "accepted", "import-complete"),
                model.RunSignal(
                    "atlas-42",
                    "terminal",
                    "rejected",
                    "duplicate-event-id",
                ),
            )
        )

        self.assertFalse(report.satisfies_terminal_contract)
        self.assertEqual(report.terminal_outcome, "rejected")
        self.assertEqual(
            [(item.kind, item.index) for item in report.violations],
            [("premature-success", 1)],
        )

    def test_earliest_contract_violation_identifies_a_repair_boundary_not_just_detection(self) -> None:
        repair = model.locate_causal_repair_boundary(
            (
                model.CausalStep(
                    "import-service",
                    "claim",
                    "reported accepted before duplicate validation",
                    True,
                ),
                model.CausalStep(
                    "deduplicator",
                    "detection",
                    "identified duplicate event id",
                    False,
                ),
                model.CausalStep(
                    "serializer",
                    "detection",
                    "serialized rejection for the caller",
                    False,
                ),
            )
        )

        self.assertEqual(repair.repair_owner, "import-service")
        self.assertEqual(repair.repair_index, 0)
        self.assertEqual(repair.first_detection_owner, "deduplicator")
        self.assertIn("does not prove", repair.scope)

    def test_multiple_runs_and_missing_terminal_are_not_silently_combined(self) -> None:
        with self.assertRaisesRegex(model.ModelContractError, "one run_id"):
            model.inspect_terminal_contract(
                (
                    model.RunSignal("atlas-42", "started", "pending", "received-source"),
                    model.RunSignal("atlas-43", "terminal", "accepted", "complete"),
                )
            )

        report = model.inspect_terminal_contract(
            (model.RunSignal("atlas-42", "started", "pending", "received-source"),)
        )
        self.assertFalse(report.satisfies_terminal_contract)
        self.assertEqual([(item.kind, item.index) for item in report.violations], [("missing-terminal", None)])

    def test_declared_run_and_causal_traces_are_explicitly_bounded(self) -> None:
        with self.assertRaisesRegex(model.ModelContractError, "signals must contain at most"):
            model.inspect_terminal_contract(
                (
                    model.RunSignal(
                        "atlas-42",
                        "progress",
                        "pending",
                        f"progress-{index}",
                    )
                    for index in range(model.MAX_RUN_SIGNALS + 1)
                )
            )

        with self.assertRaisesRegex(model.ModelContractError, "steps must contain at most"):
            model.locate_causal_repair_boundary(
                (
                    model.CausalStep(
                        "import-service",
                        "claim",
                        f"observation-{index}",
                        False,
                    )
                    for index in range(model.MAX_CAUSAL_STEPS + 1)
                )
            )


if __name__ == "__main__":
    unittest.main()
