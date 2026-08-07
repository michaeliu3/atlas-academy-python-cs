"""Behavioral tests for the Module 17 architecture-evidence reference."""

from __future__ import annotations

import json
from pathlib import Path
import sys
import unittest

sys.path.insert(0, str(Path(__file__).resolve().parent))

import module17_reference as reference


class Module17ReferenceBehaviorTests(unittest.TestCase):
    def test_equivalent_orders_keep_the_semantic_witness_fixed(self) -> None:
        codes = reference.priority_codes(64)
        witness = reference.semantic_witness(
            codes,
            reference.sequential_order(len(codes)),
            reference.deterministic_permutation(len(codes)),
            reference.DEFAULT_THRESHOLD,
        )

        self.assertTrue(witness["all_results_equal"])
        self.assertEqual(witness["same_kernel"], "count_due")

    def test_declared_cache_model_stays_explicitly_non_host(self) -> None:
        observation = reference.toy_cache_observation(
            "small-sequential",
            tuple(range(16)),
            item_bytes=4,
            line_bytes=16,
            cache_slots=2,
        )

        self.assertEqual((observation.accesses, observation.hits, observation.misses), (16, 12, 4))
        self.assertIn("not the host CPU cache", observation.scope)

    def test_no_timing_report_preserves_uncertainty_without_a_ratio(self) -> None:
        report = reference.build_report(
            size=64,
            blocks=1,
            number=1,
            include_timing=False,
        )

        self.assertEqual(report["timing_trials"], [])
        self.assertEqual(report["timing_cells"], {})
        self.assertNotIn("timing_comparison_ratio", report)
        self.assertIn("unmeasured_hypotheses", json.dumps(report).lower())


if __name__ == "__main__":
    unittest.main()
