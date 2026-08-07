"""Behavioral seams for Module 24's deterministic runtime-evidence model."""

from __future__ import annotations

from contextlib import redirect_stderr, redirect_stdout
from io import StringIO
from pathlib import Path
import json
import sys
import unittest

sys.path.insert(0, str(Path(__file__).resolve().parent))
import module24_reference as model


class ObjectGraphSeamTests(unittest.TestCase):
    def test_alias_root_keeps_shared_object_reachable(self) -> None:
        graph = model.ObjectGraph(
            edges={"report": ("events",), "audit": ("events",), "events": ()},
            roots=frozenset({"audit"}),
        )

        self.assertEqual(model.reachable_nodes(graph), ("audit", "events"))

    def test_acyclic_unrooted_node_is_collected_by_simplified_sweep(self) -> None:
        graph = model.ObjectGraph(edges={"orphan": ()}, roots=frozenset())
        result = model.reference_count_sweep(graph)

        self.assertEqual(result.collected, ("orphan",))
        self.assertEqual(result.remaining, ())
        self.assertIn("Simplified graph rule", result.limitation)

    def test_unrooted_cycle_survives_reference_count_sweep_then_is_reachable_for_cycle_phase(
        self,
    ) -> None:
        graph = model.ObjectGraph(
            edges={"A": ("B",), "B": ("A",)},
            roots=frozenset(),
        )
        sweep = model.reference_count_sweep(graph)

        self.assertEqual(sweep.remaining, ("A", "B"))
        self.assertEqual(model.collect_unreachable_cycles(graph), ("A", "B"))

    def test_rooted_cycle_is_not_an_unreachable_cycle_candidate(self) -> None:
        graph = model.ObjectGraph(
            edges={"root": ("A",), "A": ("B",), "B": ("A",)},
            roots=frozenset({"root"}),
        )

        self.assertEqual(model.collect_unreachable_cycles(graph), ())

    def test_graph_model_does_not_claim_resource_release(self) -> None:
        graph = model.ObjectGraph(edges={"socket_owner": ()}, roots=frozenset())

        self.assertIn("native resources", model.reference_count_sweep(graph).limitation)


class ObservationScopeSeamTests(unittest.TestCase):
    def test_semantic_fixture_is_a_course_model_and_does_not_establish_performance(self) -> None:
        observed = model.classify_observation("semantic_fixture")
        decision = model.validate_conclusion(observed, "performance")

        self.assertEqual(observed.label, model.COURSE_MODEL)
        self.assertEqual(observed.required_evidence_label, model.SEMANTIC_CONTRACT)
        self.assertEqual(decision.outcome, model.DECISION_REJECT)

    def test_static_scope_cards_name_required_evidence_instead_of_claiming_observations(
        self,
    ) -> None:
        cases = (
            ("shallow_size", model.CPYTHON_OBSERVATION),
            ("traced_peak", model.MEASUREMENT),
            ("process_rss", model.OS_NATIVE_OBSERVATION),
            ("bytecode_card", model.CPYTHON_OBSERVATION),
        )

        for metric, required_label in cases:
            with self.subTest(metric=metric):
                observed = model.classify_observation(metric, model.PINNED_RUNTIME)
                self.assertEqual(observed.label, model.COURSE_MODEL)
                self.assertEqual(observed.required_evidence_label, required_label)
                self.assertEqual(observed.required_runtime, model.PINNED_RUNTIME)

    def test_shallow_size_card_refuses_retained_graph_and_rss_conclusions(self) -> None:
        observed = model.classify_observation("shallow_size", model.PINNED_RUNTIME)

        self.assertEqual(
            model.validate_conclusion(observed, "retained graph").outcome,
            model.DECISION_REJECT,
        )
        self.assertEqual(
            model.validate_conclusion(observed, "RSS").outcome,
            model.DECISION_REJECT,
        )

    def test_traced_peak_card_refuses_native_and_process_scope_then_defers_real_claims(self) -> None:
        observed = model.classify_observation("traced_peak", model.PINNED_RUNTIME)

        self.assertEqual(observed.label, model.COURSE_MODEL)
        self.assertEqual(
            model.validate_conclusion(observed, "all native allocation").outcome,
            model.DECISION_REJECT,
        )
        self.assertEqual(
            model.validate_conclusion(observed, "production SLO").outcome,
            model.DECISION_REJECT,
        )
        self.assertEqual(
            model.validate_conclusion(observed, "traced allocation peak").outcome,
            model.DECISION_DEFER,
        )

    def test_process_rss_card_does_not_name_a_python_owner_or_fake_an_os_result(self) -> None:
        observed = model.classify_observation("process_rss", model.PINNED_RUNTIME)
        decision = model.validate_conclusion(observed, "Python object attribution")

        self.assertEqual(observed.label, model.COURSE_MODEL)
        self.assertEqual(observed.required_evidence_label, model.OS_NATIVE_OBSERVATION)
        self.assertEqual(decision.outcome, model.DECISION_REJECT)
        self.assertEqual(
            model.validate_conclusion(observed, "host/process memory observation").outcome,
            model.DECISION_DEFER,
        )

    def test_bytecode_card_without_version_is_deferred(self) -> None:
        observed = model.classify_observation("bytecode_card")
        decision = model.validate_conclusion(observed, "implementation observation")

        self.assertEqual(decision.outcome, model.DECISION_DEFER)
        self.assertIn("runtime/version", decision.reason)

    def test_unknown_metric_is_a_hypothesis_not_measurement(self) -> None:
        observed = model.classify_observation("hand_wavy_speed")
        decision = model.validate_conclusion(observed, "faster")

        self.assertEqual(observed.label, model.HYPOTHESIS)
        self.assertEqual(decision.outcome, model.DECISION_DEFER)

    def test_versioned_bytecode_card_remains_narrow(self) -> None:
        observed = model.classify_observation("bytecode_card", model.PINNED_RUNTIME)

        self.assertEqual(
            model.validate_conclusion(observed, "Python language guarantee").outcome,
            model.DECISION_REJECT,
        )
        self.assertEqual(
            model.validate_conclusion(observed, "speedup").outcome,
            model.DECISION_REJECT,
        )
        self.assertEqual(
            model.validate_conclusion(observed, "implementation observation").outcome,
            model.DECISION_DEFER,
        )

    def test_fixture_runtime_label_is_not_the_detected_interpreter(self) -> None:
        self.assertEqual(model.FIXTURE_RUNTIME_LABEL, "CPython 3.14.6")
        self.assertEqual(model.PINNED_RUNTIME, model.FIXTURE_RUNTIME_LABEL)


class ExperimentManifestSeamTests(unittest.TestCase):
    def test_matching_manifest_with_enough_samples_is_ready_for_evidence_not_a_measurement(
        self,
    ) -> None:
        baseline = model._manifest()
        review = model.validate_experiment(baseline, model._manifest())

        self.assertEqual(review.outcome, model.MANIFEST_READY)
        self.assertEqual(review.missing_or_changed, ())

    def test_semantic_change_is_rejected_before_performance_interpretation(self) -> None:
        review = model.validate_experiment(
            model._manifest(),
            model._manifest(semantic_fingerprint="changed-errors/v2"),
        )

        self.assertEqual(review.outcome, model.CONFOUNDED_EXPERIMENT)
        self.assertEqual(review.missing_or_changed, ("semantic_fingerprint",))

    def test_workload_and_gc_drift_are_explicit_confounds(self) -> None:
        review = model.validate_experiment(
            model._manifest(),
            model._manifest(workload_id="larger-cohort", gc_policy="disabled"),
        )

        self.assertEqual(review.outcome, model.CONFOUNDED_EXPERIMENT)
        self.assertEqual(review.missing_or_changed, ("workload_id", "gc_policy"))

    def test_runtime_build_metric_and_privacy_boundaries_are_controls(self) -> None:
        review = model.validate_experiment(
            model._manifest(),
            model._manifest(
                runtime="CPython 3.15.0",
                build="free-threaded",
                metric="process_rss",
                privacy_review="raw-record-capture",
            ),
        )

        self.assertEqual(review.outcome, model.CONFOUNDED_EXPERIMENT)
        self.assertEqual(
            review.missing_or_changed,
            ("runtime", "build", "metric", "privacy_review"),
        )

    def test_fewer_than_three_samples_is_insufficient_evidence(self) -> None:
        review = model.validate_experiment(
            model._manifest(sample_count=2),
            model._manifest(sample_count=2),
        )

        self.assertEqual(review.outcome, model.INSUFFICIENT_EVIDENCE)
        self.assertEqual(review.missing_or_changed, ("sample_count",))

    def test_missing_build_metadata_is_not_a_valid_scoped_measurement(self) -> None:
        review = model.validate_experiment(
            model._manifest(build=""),
            model._manifest(build=""),
        )

        self.assertEqual(review.outcome, model.INSUFFICIENT_EVIDENCE)
        self.assertEqual(review.missing_or_changed, ("runtime", "build"))


class FixedScenarioAndCliTests(unittest.TestCase):
    def test_scenarios_are_fixed_and_cover_key_teaching_outcomes(self) -> None:
        self.assertEqual(
            model.SCENARIOS,
            (
                "alias_rebind",
                "cycle_collection",
                "shallow_scope",
                "traced_scope",
                "reject_confound",
                "defer_without_results",
                "defer_missing_version",
            ),
        )

    def test_alias_and_cycle_packets_are_bounded_models(self) -> None:
        alias = model.run_scenario("alias_rebind")
        cycle = model.run_scenario("cycle_collection")

        self.assertEqual(alias["outcome"], model.COURSE_MODEL)
        self.assertEqual(cycle["outcome"], model.COURSE_MODEL)
        self.assertEqual(alias["reachable"], ("audit_view", "events"))
        self.assertEqual(cycle["sweep_remaining"], ("A", "B"))
        self.assertEqual(cycle["cycle_candidates"], ("A", "B"))

    def test_scope_packets_preserve_their_nonclaims(self) -> None:
        shallow = model.run_scenario("shallow_scope")
        traced = model.run_scenario("traced_scope")

        self.assertEqual(shallow["outcome"], model.MEASUREMENT_SCOPE_ERROR)
        self.assertEqual(shallow["decision"]["outcome"], model.DECISION_REJECT)
        self.assertEqual(traced["outcome"], model.COURSE_MODEL)
        self.assertEqual(traced["decision"]["outcome"], model.DECISION_DEFER)

    def test_confound_missing_results_and_missing_version_packets_are_distinct(self) -> None:
        confounded = model.run_scenario("reject_confound")
        missing_results = model.run_scenario("defer_without_results")
        deferred = model.run_scenario("defer_missing_version")

        self.assertEqual(confounded["outcome"], model.CONFOUNDED_EXPERIMENT)
        self.assertEqual(missing_results["outcome"], model.DECISION_DEFER)
        self.assertEqual(missing_results["review"]["outcome"], model.MANIFEST_READY)
        self.assertEqual(deferred["outcome"], model.DECISION_DEFER)

    def test_unknown_scenario_does_not_accept_dynamic_input(self) -> None:
        with self.assertRaisesRegex(ValueError, "unknown fixed scenario"):
            model.run_scenario("run arbitrary text")

    def test_cli_writes_one_bounded_json_packet_to_stdout_and_no_stderr(self) -> None:
        stdout = StringIO()
        stderr = StringIO()
        with redirect_stdout(stdout), redirect_stderr(stderr):
            exit_code = model.main(["reject_confound"])

        packet = json.loads(stdout.getvalue())
        self.assertEqual(exit_code, 0)
        self.assertEqual(packet["outcome"], model.CONFOUNDED_EXPERIMENT)
        self.assertEqual(stderr.getvalue(), "")


if __name__ == "__main__":
    unittest.main()
