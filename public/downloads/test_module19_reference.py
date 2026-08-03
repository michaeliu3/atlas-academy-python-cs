"""Behavioral tests for the Module 19 concurrency evidence reference."""

from __future__ import annotations

from pathlib import Path
import concurrent.futures
import hashlib
import json
import os
import platform
import subprocess
import sys
import sysconfig
import threading
import unittest
from unittest import mock

sys.path.insert(0, str(Path(__file__).resolve().parent))

import module19_reference as reference


class Module19ReferenceTests(unittest.TestCase):
    def test_schedule_explorer_finds_the_literal_lost_update_space(self) -> None:
        report = reference.explore_two_increment_schedules(initial_value=0)

        self.assertEqual(report.schedule_count, 20)
        self.assertEqual(report.final_value_counts, {1: 18, 2: 2})
        self.assertEqual(
            report.sequential_schedules,
            (
                ("A:READ", "A:ADD", "A:WRITE", "B:READ", "B:ADD", "B:WRITE"),
                ("B:READ", "B:ADD", "B:WRITE", "A:READ", "A:ADD", "A:WRITE"),
            ),
        )
        self.assertEqual(report.safety_property, "final shared value equals 2")

    def test_lock_model_preserves_the_increment_invariant_for_every_schedule(
        self,
    ) -> None:
        report = reference.explore_locked_increment_schedules(initial_value=0)

        self.assertEqual(report.schedule_count, 2)
        self.assertEqual(report.final_value_counts, {2: 2})
        self.assertEqual(report.violating_schedules, ())
        self.assertEqual(report.linearization_events, ("A:WRITE", "B:WRITE"))

    def test_narrow_write_only_lock_still_allows_a_lost_update(self) -> None:
        report = reference.explore_narrow_locked_increment_schedules(
            initial_value=0,
        )

        self.assertGreater(report.schedule_count, 2)
        self.assertIn(1, report.final_value_counts)
        self.assertGreater(len(report.violating_schedules), 0)
        self.assertEqual(
            report.safety_property,
            "final shared value equals 2",
        )

    def test_lock_order_analyzer_returns_a_concrete_deadlock_cycle(self) -> None:
        report = reference.analyze_lock_orders(
            {
                "merge-worker": ("catalog", "snapshot"),
                "publish-worker": ("snapshot", "catalog"),
            }
        )

        self.assertEqual(
            report.order_edges,
            (("catalog", "snapshot"), ("snapshot", "catalog")),
        )
        self.assertEqual(report.cycle, ("catalog", "snapshot", "catalog"))
        self.assertTrue(report.deadlock_possible)
        self.assertFalse(report.global_order_satisfied)

    def test_one_global_lock_order_removes_the_static_deadlock_cycle(self) -> None:
        report = reference.analyze_lock_orders(
            {
                "merge-worker": ("catalog", "snapshot"),
                "publish-worker": ("catalog", "snapshot"),
                "audit-worker": ("catalog",),
            }
        )

        self.assertEqual(report.order_edges, (("catalog", "snapshot"),))
        self.assertEqual(report.cycle, ())
        self.assertFalse(report.deadlock_possible)
        self.assertTrue(report.global_order_satisfied)

    def test_executor_wait_model_detects_cycle_and_capacity_self_dependency(
        self,
    ) -> None:
        cycle = reference.analyze_executor_waits(
            wait_edges=(("task-a", "task-b"), ("task-b", "task-a")),
            running_tasks=("task-a", "task-b"),
            worker_capacity=2,
        )
        one_worker = reference.analyze_executor_waits(
            wait_edges=(("outer", "inner"),),
            running_tasks=("outer",),
            worker_capacity=1,
        )

        self.assertEqual(cycle.cycle, ("task-a", "task-b", "task-a"))
        self.assertTrue(cycle.deadlock_possible)
        self.assertTrue(one_worker.capacity_deadlock_possible)
        self.assertEqual(one_worker.blocked_pending_tasks, ("inner",))
        self.assertIn("declared model", one_worker.scope)

    def test_work_ledger_proves_one_terminal_classification_per_admission(
        self,
    ) -> None:
        ledger = reference.create_work_ledger(("doc-a", "doc-b", "doc-c"))
        for doc_id in ("doc-a", "doc-b", "doc-c"):
            ledger = reference.advance_work(ledger, doc_id, "ENQUEUED")
        ledger = reference.advance_work(ledger, "doc-a", "CLAIMED")
        ledger = reference.advance_work(ledger, "doc-a", "PARTIAL_READY")
        ledger = reference.advance_work(ledger, "doc-a", "COMMIT_STARTED")
        ledger = reference.advance_work(ledger, "doc-a", "COMMITTED")
        ledger = reference.advance_work(ledger, "doc-b", "CLAIMED")
        ledger = reference.advance_work(ledger, "doc-b", "FAILED")
        ledger = reference.advance_work(ledger, "doc-c", "CANCELLED")

        report = reference.terminal_ledger_report(ledger)

        self.assertEqual(
            report.terminal_by_id,
            (
                ("doc-a", "COMMITTED"),
                ("doc-b", "FAILED"),
                ("doc-c", "CANCELLED"),
            ),
        )
        self.assertEqual(
            report.counts,
            (("CANCELLED", 1), ("COMMITTED", 1), ("FAILED", 1)),
        )
        self.assertTrue(report.exactly_once)

    def test_work_ledger_rejects_duplicate_illegal_and_incomplete_evidence(
        self,
    ) -> None:
        with self.assertRaises(reference.AccountingError):
            reference.create_work_ledger(("doc-a", "doc-a"))

        ledger = reference.create_work_ledger(("doc-a",))
        with self.assertRaises(reference.WorkTransitionError):
            reference.advance_work(ledger, "doc-a", "CLAIMED")
        with self.assertRaises(reference.AccountingError):
            reference.terminal_ledger_report(ledger)

    def test_work_ledger_rejects_forged_duplicate_or_replay_inconsistent_evidence(
        self,
    ) -> None:
        with self.assertRaises(reference.AccountingError):
            reference.WorkLedger(
                states=(
                    ("doc-a", "COMMITTED"),
                    ("doc-a", "FAILED"),
                ),
                transitions=(),
            )

        with self.assertRaises(reference.AccountingError):
            reference.WorkLedger(
                states=(("doc-a", "COMMITTED"),),
                transitions=(),
            )

        with self.assertRaises(reference.AccountingError):
            reference.WorkLedger(
                states=(("doc-a", "COMMITTED"),),
                transitions=(
                    reference.WorkTransition(
                        doc_id="doc-a",
                        before="ADMITTED",
                        after="ENQUEUED",
                    ),
                ),
            )

    def test_document_worker_is_pure_and_returns_literal_unique_postings(
        self,
    ) -> None:
        contribution = reference.index_document(
            "doc-a",
            "Locks guard invariants; queues coordinate. LOCKS don't prove speed.",
        )

        self.assertEqual(contribution.partition_id, "doc-a")
        self.assertEqual(
            contribution.postings,
            (
                ("coordinate", ("doc-a",)),
                ("don", ("doc-a",)),
                ("guard", ("doc-a",)),
                ("invariants", ("doc-a",)),
                ("locks", ("doc-a",)),
                ("prove", ("doc-a",)),
                ("queues", ("doc-a",)),
                ("speed", ("doc-a",)),
                ("t", ("doc-a",)),
            ),
        )
        self.assertEqual(len(contribution.partial_digest), 64)
        self.assertEqual(
            contribution.documents_digest,
            reference.make_document_partition(
                "doc-a",
                "Locks guard invariants; queues coordinate. LOCKS don't prove speed.",
            ).documents_digest,
        )

    def test_partial_index_rejects_mutable_or_malformed_nested_data(self) -> None:
        partition = reference.make_document_partition("doc-a", "lock")

        with self.assertRaises(TypeError):
            reference.PartialIndex(
                partition_id=partition.partition_id,
                documents_digest=partition.documents_digest,
                postings=[("lock", ("doc-a",))],  # type: ignore[arg-type]
            )
        with self.assertRaises(TypeError):
            reference.PartialIndex(
                partition_id=partition.partition_id,
                documents_digest=partition.documents_digest,
                postings=(("lock", ["doc-a"]),),  # type: ignore[list-item]
            )
        with self.assertRaises(ValueError):
            reference.PartialIndex(
                partition_id=partition.partition_id,
                documents_digest=partition.documents_digest,
                postings=(
                    ("lock", ("doc-a",)),
                    ("lock", ("doc-a",)),
                ),
            )

    def test_snapshot_rejects_fields_that_disagree_with_canonical_bytes(
        self,
    ) -> None:
        encoded_lock = (
            b'{"document_ids":["doc-a"],'
            b'"postings":{"lock":["doc-a"]},'
            b'"schema":"atlas.concurrent-inverted-index.v1"}\n'
        )
        with self.assertRaises(ValueError):
            reference.IndexSnapshot(
                document_ids=("doc-a",),
                postings=(("queue", ("doc-a",)),),
                canonical_bytes=encoded_lock,
                sha256=hashlib.sha256(encoded_lock).hexdigest(),
            )
        with self.assertRaises(ValueError):
            reference.IndexSnapshot(
                document_ids=("NOT-VALID",),
                postings=(),
                canonical_bytes=b"{}\n",
                sha256=hashlib.sha256(b"{}\n").hexdigest(),
            )

    def test_thread_indexer_publishes_only_after_exact_success_accounting(
        self,
    ) -> None:
        report = reference.run_indexer(
            documents={
                "doc-b": "queue lock",
                "doc-a": "lock lock",
            },
            executor="thread",
            max_workers=2,
            timeout_seconds=5.0,
        )

        self.assertEqual(report.executor, "thread")
        self.assertEqual(report.max_workers, 2)
        self.assertEqual(
            report.ledger.terminal_by_id,
            (("doc-a", "COMMITTED"), ("doc-b", "COMMITTED")),
        )
        self.assertEqual(set(report.observed_completion_order), {"doc-a", "doc-b"})
        self.assertEqual(report.commit_order, ("doc-a", "doc-b"))
        self.assertEqual(report.errors, ())
        self.assertTrue(report.publication_allowed)
        self.assertTrue(report.oracle_match)
        self.assertEqual(
            report.candidate_digest,
            report.oracle_digest,
        )
        self.assertTrue(report.completion_wait.drain_completed)
        self.assertFalse(report.completion_wait.wait_timed_out)
        self.assertIsNotNone(report.candidate_snapshot)
        assert report.candidate_snapshot is not None
        self.assertEqual(
            report.candidate_snapshot.canonical_bytes,
            (
                b'{"document_ids":["doc-a","doc-b"],'
                b'"postings":{"lock":["doc-a","doc-b"],'
                b'"queue":["doc-b"]},'
                b'"schema":"atlas.concurrent-inverted-index.v1"}\n'
            ),
        )
        self.assertEqual(
            report.candidate_snapshot.postings,
            (
                ("lock", ("doc-a", "doc-b")),
                ("queue", ("doc-b",)),
            ),
        )
        self.assertTrue(
            all(
                transition.after != "COMMITTED"
                or transition.before == "COMMIT_STARTED"
                for transition in report.work_transitions
            )
        )

    def test_failed_or_cancelled_work_blocks_the_candidate_snapshot(self) -> None:
        report = reference.run_indexer(
            documents={
                "doc-a": "lock",
                "doc-b": "queue",
                "doc-c": "condition",
            },
            executor="thread",
            max_workers=2,
            timeout_seconds=5.0,
            fail_ids=("doc-b",),
            cancel_before_start_ids=("doc-c",),
        )

        self.assertEqual(
            report.ledger.terminal_by_id,
            (
                ("doc-a", "COMMITTED"),
                ("doc-b", "FAILED"),
                ("doc-c", "CANCELLED"),
            ),
        )
        self.assertEqual(
            report.errors,
            (
                reference.FailureEvidence(
                    partition_id="doc-b",
                    phase="WORKER",
                    error_type="RuntimeError",
                    message_sha256=hashlib.sha256(
                        b"injected worker failure for doc-b"
                    ).hexdigest(),
                ),
            ),
        )
        self.assertEqual(
            tuple(item.partition_id for item in report.contributions),
            ("doc-a",),
        )
        self.assertEqual(report.commit_order, ("doc-a",))
        self.assertEqual(
            report.cancellation_causes,
            (("doc-c", "cancelled-before-submission-policy"),),
        )
        self.assertEqual(
            tuple(
                (item.before, item.after)
                for item in report.work_transitions
                if item.doc_id == "doc-c"
            ),
            (("ADMITTED", "CANCELLED"),),
        )
        self.assertFalse(
            any(
                item.partition_id == "doc-c"
                for item in report.future_observations
            )
        )
        self.assertEqual(set(report.observed_completion_order), {"doc-a", "doc-b"})
        self.assertIsNone(report.candidate_snapshot)
        self.assertIsNone(report.oracle_match)
        self.assertIsNone(report.candidate_digest)
        self.assertEqual(len(report.oracle_digest), 64)
        self.assertFalse(report.publication_allowed)

    def test_process_indexer_uses_the_same_deterministic_reduction_contract(
        self,
    ) -> None:
        report = reference.run_indexer(
            documents={
                "doc-b": "queue lock",
                "doc-a": "lock lock",
            },
            executor="process",
            max_workers=2,
            timeout_seconds=10.0,
        )

        self.assertEqual(report.executor, "process")
        self.assertEqual(
            report.ledger.terminal_by_id,
            (("doc-a", "COMMITTED"), ("doc-b", "COMMITTED")),
        )
        self.assertEqual(report.commit_order, ("doc-a", "doc-b"))
        self.assertTrue(report.publication_allowed)
        self.assertIsNotNone(report.process_start_method)
        self.assertEqual(report.process_context_source, "runtime-default")
        self.assertTrue(report.oracle_match)
        self.assertIsNotNone(report.candidate_snapshot)
        assert report.candidate_snapshot is not None
        self.assertEqual(
            report.candidate_snapshot.postings,
            (
                ("lock", ("doc-a", "doc-b")),
                ("queue", ("doc-b",)),
            ),
        )

    def test_process_worker_failure_is_structured_and_blocks_publication(
        self,
    ) -> None:
        report = reference.run_indexer(
            documents={
                "doc-a": "lock",
                "doc-b": "queue",
            },
            executor="process",
            max_workers=2,
            timeout_seconds=10.0,
            fail_ids=("doc-b",),
        )

        self.assertEqual(
            report.ledger.terminal_by_id,
            (("doc-a", "COMMITTED"), ("doc-b", "FAILED")),
        )
        self.assertEqual(report.errors[0].partition_id, "doc-b")
        self.assertEqual(report.errors[0].phase, "WORKER")
        self.assertEqual(report.errors[0].error_type, "RuntimeError")
        self.assertRegex(report.errors[0].message_sha256, r"^[0-9a-f]{64}$")
        self.assertFalse(report.publication_allowed)
        self.assertIsNone(report.candidate_snapshot)

    def test_runtime_profile_separates_build_capability_from_live_gil_state(
        self,
    ) -> None:
        profile = reference.runtime_concurrency_profile()

        self.assertEqual(profile.implementation, sys.implementation.name)
        self.assertEqual(profile.python_version, sys.version.split()[0])
        self.assertEqual(profile.executable, Path(sys.executable).name)
        self.assertEqual(profile.platform_system, platform.system())
        self.assertEqual(profile.platform_release, platform.release())
        self.assertEqual(profile.platform_machine, platform.machine())
        self.assertEqual(profile.cpu_count, os.cpu_count())
        self.assertEqual(profile.python_runtime, " ".join(sys.version.split()))
        self.assertTrue(
            profile.implementation_version.startswith(
                f"{sys.version_info.major}.{sys.version_info.minor}."
            )
        )
        self.assertEqual(
            {key for key, _ in profile.build_configuration},
            {"Py_GIL_DISABLED", "Py_DEBUG", "ABIFLAGS", "COMPILER"},
        )
        self.assertGreaterEqual(len(profile.command), 1)
        self.assertNotIn(str(Path.home()), " ".join(profile.command))
        expected_build_flag = sysconfig.get_config_var("Py_GIL_DISABLED")
        self.assertEqual(
            profile.build_supports_free_threading,
            None if expected_build_flag is None else bool(expected_build_flag),
        )
        expected_live_state = (
            bool(sys._is_gil_enabled())  # type: ignore[attr-defined]
            if hasattr(sys, "_is_gil_enabled")
            else None
        )
        self.assertEqual(profile.gil_enabled, expected_live_state)
        self.assertEqual(
            profile.executor_types,
            (
                "thread",
                "process",
                *(
                    ("interpreter",)
                    if hasattr(concurrent.futures, "InterpreterPoolExecutor")
                    else ()
                ),
            ),
        )
        self.assertEqual(profile.reference_adapter_types, ("thread", "process"))
        self.assertEqual(
            profile.unvalidated_executor_types,
            (
                ("interpreter",)
                if hasattr(concurrent.futures, "InterpreterPoolExecutor")
                else ()
            ),
        )

    def test_parallel_budget_exposes_work_span_and_amdahl_ceilings(self) -> None:
        budget = reference.parallelism_budget(
            work_units=120.0,
            span_units=30.0,
            workers=4,
            serial_fraction=0.25,
        )

        self.assertEqual(budget.max_parallelism, 4.0)
        self.assertEqual(budget.work_span_speedup_ceiling, 4.0)
        self.assertAlmostEqual(budget.amdahl_speedup_ceiling, 16 / 7)
        self.assertAlmostEqual(budget.combined_speedup_ceiling, 16 / 7)
        self.assertEqual(budget.lower_bound_time_units, 30.0)
        self.assertTrue(budget.measurement_required)

    def test_bounded_queue_model_separates_empty_from_all_tasks_done(self) -> None:
        report = reference.simulate_bounded_queue_protocol(
            capacity=1,
            operations=(
                ("producer", "PUT", "doc-a"),
                ("producer", "PUT", "doc-b"),
                ("consumer", "GET", "doc-a"),
            ),
        )

        self.assertEqual(report.final_buffer, ())
        self.assertEqual(report.claimed_not_acknowledged, ("doc-a",))
        self.assertEqual(report.unfinished_tasks, 1)
        self.assertFalse(report.join_ready)
        self.assertEqual(
            report.blocked_actions,
            (("producer", "PUT", "doc-b", "queue-not-full"),),
        )

        drained = reference.simulate_bounded_queue_protocol(
            capacity=1,
            operations=(
                ("producer", "PUT", "doc-a"),
                ("consumer", "GET", "doc-a"),
                ("consumer", "TASK_DONE", "doc-a"),
            ),
        )
        self.assertEqual(drained.unfinished_tasks, 0)
        self.assertTrue(drained.join_ready)

    def test_queue_protocol_rejects_acknowledgement_without_ownership(self) -> None:
        with self.assertRaises(reference.QueueProtocolError):
            reference.simulate_bounded_queue_protocol(
                capacity=1,
                operations=(("consumer", "TASK_DONE", "doc-a"),),
            )
        with self.assertRaises(reference.QueueProtocolError):
            reference.simulate_bounded_queue_protocol(
                capacity=1,
                operations=(("producer", "PUT", 42),),  # type: ignore[arg-type]
            )

    def test_semaphore_model_tracks_permits_without_claiming_item_ownership(
        self,
    ) -> None:
        report = reference.simulate_semaphore_protocol(
            permits=2,
            operations=(
                ("worker-a", "ACQUIRE"),
                ("worker-b", "ACQUIRE"),
                ("worker-c", "ACQUIRE"),
                ("worker-a", "RELEASE"),
                ("worker-c", "ACQUIRE"),
                ("worker-b", "RELEASE"),
                ("worker-c", "RELEASE"),
            ),
        )

        self.assertEqual(report.available_permits, 2)
        self.assertEqual(report.holders, ())
        self.assertEqual(
            report.blocked_acquires,
            (("worker-c", "no-permit"),),
        )
        self.assertTrue(report.balanced)
        self.assertFalse(report.transfers_items)

        with self.assertRaises(reference.SemaphoreProtocolError):
            reference.simulate_semaphore_protocol(
                permits=1,
                operations=(("worker-a", "RELEASE"),),
            )

    def test_condition_wait_loop_rechecks_the_predicate_after_every_wake(
        self,
    ) -> None:
        unsafe = reference.evaluate_condition_wait(
            predicate_observations=(False, False, True),
            strategy="if-once",
        )
        safe = reference.evaluate_condition_wait(
            predicate_observations=(False, False, True),
            strategy="while",
        )

        self.assertEqual(unsafe.wait_count, 1)
        self.assertTrue(unsafe.entered_critical_section)
        self.assertFalse(unsafe.predicate_when_entered)
        self.assertFalse(unsafe.invariant_preserved)
        self.assertEqual(safe.wait_count, 2)
        self.assertTrue(safe.entered_critical_section)
        self.assertTrue(safe.predicate_when_entered)
        self.assertTrue(safe.invariant_preserved)

    def test_model_choice_starts_from_workload_and_runtime_evidence(self) -> None:
        io_choice = reference.choose_execution_model(
            reference.WorkloadProfile(
                dominant_work="blocking-io",
                gil_enabled=True,
                native_code_releases_gil=False,
                payload_picklable=True,
                isolation_acceptable=True,
                free_threaded_extensions_audited=False,
                interpreter_pool_available=True,
            )
        )
        cpu_choice = reference.choose_execution_model(
            reference.WorkloadProfile(
                dominant_work="python-cpu",
                gil_enabled=True,
                native_code_releases_gil=False,
                payload_picklable=True,
                isolation_acceptable=True,
                free_threaded_extensions_audited=False,
                interpreter_pool_available=True,
            )
        )

        self.assertEqual(io_choice.primary_model, "thread")
        self.assertEqual(io_choice.ranked_candidates[0], "thread")
        self.assertIn("overlap blocking waits", io_choice.rationale)
        self.assertEqual(cpu_choice.primary_model, "process")
        self.assertEqual(
            cpu_choice.ranked_candidates,
            ("process",),
        )
        self.assertIn(
            "GIL-enabled pure-Python CPU work",
            cpu_choice.rationale,
        )
        self.assertTrue(io_choice.measurement_required)
        self.assertTrue(cpu_choice.measurement_required)

    def test_free_threaded_choice_requires_audited_extensions(self) -> None:
        audited = reference.choose_execution_model(
            reference.WorkloadProfile(
                dominant_work="python-cpu",
                gil_enabled=False,
                native_code_releases_gil=False,
                payload_picklable=True,
                isolation_acceptable=True,
                free_threaded_extensions_audited=True,
                interpreter_pool_available=True,
            )
        )
        unaudited_and_unisolatable = reference.choose_execution_model(
            reference.WorkloadProfile(
                dominant_work="python-cpu",
                gil_enabled=False,
                native_code_releases_gil=False,
                payload_picklable=False,
                isolation_acceptable=False,
                free_threaded_extensions_audited=False,
                interpreter_pool_available=True,
            )
        )

        self.assertEqual(audited.primary_model, "thread")
        self.assertEqual(
            audited.ranked_candidates,
            ("thread", "process"),
        )
        self.assertEqual(unaudited_and_unisolatable.primary_model, "redesign")
        self.assertEqual(unaudited_and_unisolatable.ranked_candidates, ())

    def test_model_choice_distinguishes_enabled_disabled_and_unknown_gil_state(
        self,
    ) -> None:
        disabled_unaudited = reference.choose_execution_model(
            reference.WorkloadProfile(
                dominant_work="python-cpu",
                gil_enabled=False,
                native_code_releases_gil=False,
                payload_picklable=True,
                isolation_acceptable=True,
                free_threaded_extensions_audited=False,
                interpreter_pool_available=True,
            )
        )
        unknown = reference.choose_execution_model(
            reference.WorkloadProfile(
                dominant_work="python-cpu",
                gil_enabled=None,
                native_code_releases_gil=False,
                payload_picklable=True,
                isolation_acceptable=True,
                free_threaded_extensions_audited=False,
                interpreter_pool_available=True,
            )
        )
        interpreter_validated = reference.choose_execution_model(
            reference.WorkloadProfile(
                dominant_work="python-cpu",
                gil_enabled=True,
                native_code_releases_gil=False,
                payload_picklable=True,
                isolation_acceptable=True,
                free_threaded_extensions_audited=False,
                interpreter_pool_available=True,
                interpreter_pool_validated=True,
            )
        )
        native_holds_gil = reference.choose_execution_model(
            reference.WorkloadProfile(
                dominant_work="native-cpu",
                gil_enabled=True,
                native_code_releases_gil=False,
                payload_picklable=True,
                isolation_acceptable=True,
                free_threaded_extensions_audited=False,
                interpreter_pool_available=False,
            )
        )

        self.assertIn("disabled", disabled_unaudited.rationale)
        self.assertIn("extensions are not audited", disabled_unaudited.rationale)
        self.assertNotIn("GIL-enabled", disabled_unaudited.rationale)
        self.assertIn("unknown", unknown.rationale)
        self.assertNotIn("GIL-enabled", unknown.rationale)
        self.assertEqual(
            interpreter_validated.ranked_candidates,
            ("process", "interpreter"),
        )
        self.assertIn("native CPU work", native_holds_gil.rationale)
        self.assertIn("does not release the GIL", native_holds_gil.rationale)
        self.assertNotIn("pure-Python", native_holds_gil.rationale)

    def test_timeout_cancel_and_hard_stop_have_distinct_semantics(self) -> None:
        timeout = reference.classify_stop_action(
            action="wait-timeout",
            task_state="RUNNING",
        )
        cancel_running = reference.classify_stop_action(
            action="future-cancel",
            task_state="RUNNING",
        )
        cancel_pending = reference.classify_stop_action(
            action="future-cancel",
            task_state="PENDING",
        )
        hard_stop = reference.classify_stop_action(
            action="hard-terminate",
            task_state="RUNNING",
        )

        self.assertEqual(timeout.resulting_state, "RUNNING")
        self.assertFalse(timeout.request_succeeded)
        self.assertTrue(timeout.work_may_continue)
        self.assertEqual(cancel_running.resulting_state, "RUNNING")
        self.assertFalse(cancel_running.request_succeeded)
        self.assertEqual(cancel_pending.resulting_state, "CANCELLED")
        self.assertTrue(cancel_pending.request_succeeded)
        self.assertEqual(hard_stop.resulting_state, "TERMINATED")
        self.assertFalse(hard_stop.cleanup_path_preserved)

    def test_indexer_records_observation_timeout_then_drains_owned_workers(
        self,
    ) -> None:
        documents = {
            f"doc-{letter}": ("lock queue condition " * 4_000)
            for letter in "abcdefgh"
        }
        worker_entered = threading.Event()
        first_wait_finished = threading.Event()
        release_worker = threading.Event()
        releaser_finished = threading.Event()
        original_task = reference._index_document_task
        original_as_completed = reference.concurrent.futures.as_completed

        def held_index_task(*args: object, **kwargs: object) -> reference.WorkerOutcome:
            worker_entered.set()
            if not release_worker.wait(timeout=1):
                raise RuntimeError("test worker was not released after the first wait")
            return original_task(*args, **kwargs)

        def observed_as_completed(*args: object, **kwargs: object):
            iterator = original_as_completed(*args, **kwargs)
            try:
                yield from iterator
            finally:
                first_wait_finished.set()

        def release_after_first_wait() -> None:
            first_wait_finished.wait(timeout=1)
            release_worker.set()
            releaser_finished.set()

        releaser = threading.Thread(target=release_after_first_wait, daemon=True)
        releaser.start()
        try:
            with (
                mock.patch.object(reference, "_index_document_task", held_index_task),
                mock.patch.object(
                    reference.concurrent.futures,
                    "as_completed",
                    observed_as_completed,
                ),
            ):
                report = reference.run_indexer(
                    documents=documents,
                    executor="thread",
                    max_workers=1,
                    timeout_seconds=0.000001,
                )
        finally:
            release_worker.set()
            releaser.join(timeout=1)

        self.assertTrue(worker_entered.is_set())
        self.assertTrue(first_wait_finished.is_set())
        self.assertTrue(releaser_finished.is_set())

        wait = report.completion_wait
        self.assertEqual(wait.timeout_seconds, 0.000001)
        self.assertTrue(wait.wait_timed_out)
        self.assertGreater(len(wait.unfinished_ids_at_timeout), 0)
        self.assertTrue(wait.return_may_follow_timeout)
        self.assertTrue(wait.drain_completed)
        self.assertEqual(
            tuple(item.partition_id for item in wait.cancellation_attempts),
            wait.unfinished_ids_at_timeout,
        )
        terminal_by_id = dict(report.ledger.terminal_by_id)
        for attempt in wait.cancellation_attempts:
            if attempt.succeeded:
                self.assertEqual(
                    terminal_by_id[attempt.partition_id],
                    "CANCELLED",
                )
            else:
                self.assertNotEqual(
                    terminal_by_id[attempt.partition_id],
                    "CANCELLED",
                )
        self.assertTrue(
            all(
                state in {"COMMITTED", "FAILED", "CANCELLED"}
                for _, state in report.ledger.terminal_by_id
            )
        )
        self.assertTrue(
            any(
                item.event == "WAIT_TIMEOUT"
                for item in report.future_observations
            )
        )

    def test_pool_startup_fails_before_admission_and_hashes_the_cause(self) -> None:
        with mock.patch.object(
            reference.concurrent.futures,
            "ThreadPoolExecutor",
            side_effect=RuntimeError("private startup path"),
        ):
            with self.assertRaises(reference.ExecutorStartupError) as caught:
                reference.run_indexer(
                    documents={"doc-a": "lock"},
                    executor="thread",
                    max_workers=1,
                    timeout_seconds=5.0,
                )

        self.assertEqual(caught.exception.error_type, "RuntimeError")
        self.assertEqual(
            caught.exception.message_sha256,
            hashlib.sha256(b"private startup path").hexdigest(),
        )
        self.assertNotIn("private startup path", str(caught.exception))

    def test_submission_failure_still_terminally_accounts_for_every_admission(
        self,
    ) -> None:
        original_executor = reference.concurrent.futures.ThreadPoolExecutor

        class FailSecondSubmissionExecutor:
            def __init__(self, *, max_workers: int) -> None:
                self._inner = original_executor(max_workers=max_workers)
                self._submissions = 0

            def submit(self, fn, /, *args, **kwargs):
                self._submissions += 1
                if self._submissions == 2:
                    raise RuntimeError("private submit path")
                return self._inner.submit(fn, *args, **kwargs)

            def shutdown(self, *, wait: bool, cancel_futures: bool) -> None:
                self._inner.shutdown(
                    wait=wait,
                    cancel_futures=cancel_futures,
                )

        with mock.patch.object(
            reference.concurrent.futures,
            "ThreadPoolExecutor",
            FailSecondSubmissionExecutor,
        ):
            report = reference.run_indexer(
                documents={
                    "doc-a": "lock",
                    "doc-b": "queue",
                    "doc-c": "condition",
                },
                executor="thread",
                max_workers=1,
                timeout_seconds=5.0,
            )

        self.assertEqual(
            report.ledger.terminal_by_id,
            (
                ("doc-a", "COMMITTED"),
                ("doc-b", "FAILED"),
                ("doc-c", "FAILED"),
            ),
        )
        self.assertEqual(
            tuple((item.partition_id, item.phase) for item in report.errors),
            (("doc-b", "SUBMISSION"), ("doc-c", "SUBMISSION")),
        )
        self.assertFalse(report.publication_allowed)
        self.assertTrue(report.completion_wait.drain_completed)

    def test_future_exception_without_worker_envelope_does_not_invent_claimed(
        self,
    ) -> None:
        class PreCallFailureExecutor:
            def __init__(self, *, max_workers: int) -> None:
                self.max_workers = max_workers

            def submit(self, fn, /, *args, **kwargs):
                future: concurrent.futures.Future[
                    reference.WorkerOutcome
                ] = concurrent.futures.Future()
                future.set_exception(RuntimeError("dispatch failed before call"))
                return future

            def shutdown(self, *, wait: bool, cancel_futures: bool) -> None:
                return None

        with mock.patch.object(
            reference.concurrent.futures,
            "ThreadPoolExecutor",
            PreCallFailureExecutor,
        ):
            report = reference.run_indexer(
                documents={"doc-a": "lock"},
                executor="thread",
                max_workers=1,
                timeout_seconds=5.0,
            )

        self.assertEqual(report.ledger.terminal_by_id, (("doc-a", "FAILED"),))
        self.assertEqual(
            tuple(
                (item.before, item.after)
                for item in report.work_transitions
                if item.doc_id == "doc-a"
            ),
            (("ADMITTED", "ENQUEUED"), ("ENQUEUED", "FAILED")),
        )
        self.assertEqual(report.errors[0].phase, "DISPATCH")
        self.assertFalse(
            any(
                item.event == "WORKER_ENTERED"
                for item in report.future_observations
            )
        )

    def test_json_cli_exposes_the_declared_schedule_evidence(self) -> None:
        completed = subprocess.run(
            (
                sys.executable,
                str(Path(reference.__file__).resolve()),
                "--model",
                "schedule",
                "--json",
            ),
            check=False,
            capture_output=True,
            text=True,
            timeout=10,
        )

        self.assertEqual(completed.returncode, 0, completed.stderr)
        payload = json.loads(completed.stdout)
        self.assertEqual(payload["schema"], "atlas.module19-evidence.v1")
        self.assertEqual(payload["model"], "schedule")
        runtime = payload["runtime_profile"]
        self.assertEqual(runtime["executable"], Path(sys.executable).name)
        self.assertEqual(runtime["implementation"], sys.implementation.name)
        self.assertEqual(runtime["platform_system"], platform.system())
        self.assertEqual(runtime["cpu_count"], os.cpu_count())
        self.assertEqual(
            runtime["command"],
            [
                Path(sys.executable).name,
                Path(reference.__file__).name,
                "--model",
                "schedule",
                "--json",
            ],
        )
        self.assertNotIn(str(Path.home()), json.dumps(runtime, sort_keys=True))
        self.assertIn("build_configuration", runtime)
        self.assertIn("gil_enabled", runtime)
        self.assertEqual(payload["evidence"]["schedule_count"], 20)
        self.assertEqual(
            payload["evidence"]["final_value_counts"],
            {"1": 18, "2": 2},
        )

    def test_self_test_rejects_zero_discovered_tests(self) -> None:
        with mock.patch.object(
            unittest.defaultTestLoader,
            "discover",
            return_value=unittest.TestSuite(),
        ):
            self.assertEqual(reference.run_self_tests(), 2)

    def test_index_fold_is_order_independent_and_matches_a_literal_oracle(
        self,
    ) -> None:
        partition_a = reference.make_document_partition(
            "doc-a",
            "gil lock lock",
        )
        partition_b = reference.make_document_partition(
            "doc-b",
            "lock queue",
        )
        contributions = (
            reference.PartialIndex(
                partition_id="doc-b",
                documents_digest=partition_b.documents_digest,
                postings=(
                    ("lock", ("doc-b",)),
                    ("queue", ("doc-b",)),
                ),
            ),
            reference.PartialIndex(
                partition_id="doc-a",
                documents_digest=partition_a.documents_digest,
                postings=(
                    ("gil", ("doc-a",)),
                    ("lock", ("doc-a",)),
                ),
            ),
        )

        snapshot = reference.fold_contributions(
            partitions=(partition_a, partition_b),
            contributions=contributions,
        )

        expected_bytes = (
            b'{"document_ids":["doc-a","doc-b"],'
            b'"postings":{"gil":["doc-a"],'
            b'"lock":["doc-a","doc-b"],'
            b'"queue":["doc-b"]},'
            b'"schema":"atlas.concurrent-inverted-index.v1"}\n'
        )
        self.assertEqual(snapshot.canonical_bytes, expected_bytes)
        self.assertEqual(
            snapshot.sha256,
            hashlib.sha256(expected_bytes).hexdigest(),
        )
        self.assertEqual(snapshot.document_ids, ("doc-a", "doc-b"))
        self.assertEqual(
            snapshot.postings,
            (
                ("gil", ("doc-a",)),
                ("lock", ("doc-a", "doc-b")),
                ("queue", ("doc-b",)),
            ),
        )

        oracle = reference.sequential_index_oracle(
            {
                "doc-b": "lock queue",
                "doc-a": "gil lock lock",
            }
        )
        self.assertEqual(oracle.canonical_bytes, expected_bytes)
        self.assertEqual(oracle.sha256, snapshot.sha256)

    def test_index_fold_rejects_duplicate_missing_and_unexpected_work(self) -> None:
        partition_a = reference.make_document_partition("doc-a", "lock")
        partition_b = reference.make_document_partition("doc-b", "queue")
        contribution_a = reference.PartialIndex(
            partition_id="doc-a",
            documents_digest=partition_a.documents_digest,
            postings=(("lock", ("doc-a",)),),
        )
        contribution_b = reference.PartialIndex(
            partition_id="doc-b",
            documents_digest=partition_b.documents_digest,
            postings=(("queue", ("doc-b",)),),
        )
        cases = (
            ((partition_a, partition_a), (contribution_a,)),
            ((partition_a, partition_b), (contribution_a, contribution_a)),
            ((partition_a, partition_b), (contribution_a,)),
            ((partition_a,), (contribution_a, contribution_b)),
        )

        for partitions, contributions in cases:
            with self.subTest(
                partitions=partitions,
                contributions=contributions,
            ):
                with self.assertRaises(reference.AccountingError):
                    reference.fold_contributions(
                        partitions=partitions,
                        contributions=contributions,
                    )

        wrong_digest = reference.PartialIndex(
            partition_id="doc-a",
            documents_digest="0" * 64,
            postings=(("lock", ("doc-a",)),),
        )
        with self.assertRaises(reference.AccountingError):
            reference.fold_contributions(
                partitions=(partition_a,),
                contributions=(wrong_digest,),
            )

    def test_oracle_mismatch_fails_reduction_before_any_commit_or_publication(
        self,
    ) -> None:
        wrong_bytes = (
            b'{"document_ids":["doc-a"],'
            b'"postings":{"wrong":["doc-a"]},'
            b'"schema":"atlas.concurrent-inverted-index.v1"}\n'
        )
        wrong_snapshot = reference.IndexSnapshot(
            document_ids=("doc-a",),
            postings=(("wrong", ("doc-a",)),),
            canonical_bytes=wrong_bytes,
            sha256=hashlib.sha256(wrong_bytes).hexdigest(),
        )

        with mock.patch.object(
            reference,
            "fold_contributions",
            return_value=wrong_snapshot,
        ):
            report = reference.run_indexer(
                documents={"doc-a": "lock"},
                executor="thread",
                max_workers=1,
                timeout_seconds=5.0,
            )

        self.assertEqual(report.ledger.terminal_by_id, (("doc-a", "FAILED"),))
        self.assertEqual(report.commit_order, ())
        self.assertEqual(report.errors[0].phase, "REDUCTION")
        self.assertEqual(report.errors[0].error_type, "OracleMismatchError")
        self.assertFalse(report.oracle_match)
        self.assertIsNone(report.candidate_snapshot)
        self.assertIsNone(report.candidate_digest)
        self.assertFalse(report.publication_allowed)
        self.assertEqual(
            tuple(
                (transition.before, transition.after)
                for transition in report.work_transitions
                if transition.doc_id == "doc-a"
            )[-2:],
            (
                ("PARTIAL_READY", "COMMIT_STARTED"),
                ("COMMIT_STARTED", "FAILED"),
            ),
        )


if __name__ == "__main__":
    unittest.main()
