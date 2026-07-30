"""Behavioral seams for the local-only Module 21 async collector model."""

from __future__ import annotations

from dataclasses import replace
from pathlib import Path
import json
import subprocess
import sys
import unittest

sys.path.insert(0, str(Path(__file__).resolve().parent))

import module21_reference as reference


class Module21ReferenceTests(unittest.IsolatedAsyncioTestCase):
    async def test_canonical_source_request_digest_binds_declared_meaning(self) -> None:
        request = reference.make_source_request(
            run_id="run-2026-07-30-a",
            source_id="catalog",
            source_epoch="catalog-v7",
        )

        self.assertEqual(
            request.request_digest,
            "sha256:54622368d2e2e83b90b3db716b99710d97bd40e9566bdf1de3ec3d60fa589744",
        )
        changed_epoch = reference.make_source_request(
            run_id="run-2026-07-30-a",
            source_id="catalog",
            source_epoch="catalog-v8",
        )
        self.assertNotEqual(request.request_digest, changed_epoch.request_digest)

    async def test_same_source_identity_and_digest_replay_one_server_model_decision(
        self,
    ) -> None:
        spec = reference.RunSpec(
            run_id="run-2026-07-30-a",
            source_ids=("catalog", "exercises", "progress"),
        )
        request = reference.make_source_request(
            run_id=spec.run_id,
            source_id="catalog",
            source_epoch="catalog-v7",
        )
        ledger = reference.SourceLedger()

        first = ledger.apply(spec, request)
        replay = ledger.apply(spec, request)

        self.assertEqual(first.decision, "COLLECTED")
        self.assertFalse(first.replayed)
        self.assertTrue(replay.replayed)
        self.assertEqual(replay.operation_id, first.operation_id)
        self.assertEqual(ledger.record_count, 1)

    async def test_same_source_identity_with_changed_digest_conflicts_before_another_decision(
        self,
    ) -> None:
        spec = reference.RunSpec(
            run_id="run-2026-07-30-a",
            source_ids=("catalog", "exercises", "progress"),
        )
        ledger = reference.SourceLedger()
        first = reference.make_source_request(
            run_id=spec.run_id,
            source_id="catalog",
            source_epoch="catalog-v7",
        )
        changed = reference.make_source_request(
            run_id=spec.run_id,
            source_id="catalog",
            source_epoch="catalog-v8",
        )

        ledger.apply(spec, first)
        with self.assertRaises(reference.IdempotencyConflict):
            ledger.apply(spec, changed)

        self.assertEqual(ledger.record_count, 1)

    async def test_invalid_request_is_rejected_before_it_can_enter_the_server_model_ledger(
        self,
    ) -> None:
        spec = reference.RunSpec(
            run_id="run-2026-07-30-a",
            source_ids=("catalog", "exercises", "progress"),
        )
        request = reference.make_source_request(
            run_id=spec.run_id,
            source_id="catalog",
            source_epoch="catalog-v7",
        )
        tampered = replace(request, request_digest="sha256:tampered")
        ledger = reference.SourceLedger()

        with self.assertRaises(reference.InvalidSourceRequest):
            ledger.apply(spec, tampered)

        self.assertEqual(ledger.record_count, 0)

    async def test_collector_publishes_only_a_declared_full_cut_after_matching_source_results(
        self,
    ) -> None:
        spec = reference.RunSpec(
            run_id="run-2026-07-30-a",
            source_ids=("catalog", "exercises", "progress"),
            max_in_flight=2,
            requires_full_cut=True,
        )
        transport = reference.ScriptedAsyncTransport(reference.SourceLedger())

        cut = await reference.AtlasAsyncCollector().collect(spec, transport)

        self.assertEqual(cut.classification, "FULL")
        self.assertEqual(cut.evidence_scope, "ATLAS_POLICY")
        self.assertEqual(cut.missing_sources, ())
        self.assertEqual(
            [(record.source_id, record.lifecycle) for record in cut.records],
            [
                ("catalog", "COLLECTED"),
                ("exercises", "COLLECTED"),
                ("progress", "COLLECTED"),
            ],
        )
        self.assertEqual(transport.ledger.record_count, 3)

    async def test_timeout_after_server_model_decision_stays_unknown_until_same_identity_reconciliation(
        self,
    ) -> None:
        spec = reference.RunSpec(
            run_id="run-2026-07-30-a",
            source_ids=("catalog", "exercises", "progress"),
            requires_full_cut=True,
        )
        transport = reference.ScriptedAsyncTransport(
            reference.SourceLedger(),
            modes={"catalog": "TIMEOUT_AFTER_DECISION"},
        )
        collector = reference.AtlasAsyncCollector()

        cut = await collector.collect(spec, transport)
        timed_out = cut.records[0]

        self.assertEqual(cut.classification, "REJECTED_INCOMPLETE")
        self.assertEqual(timed_out.lifecycle, "UNKNOWN_REMOTE")
        self.assertEqual(timed_out.observation, "LOCAL_TIMEOUT")
        self.assertEqual(transport.ledger.record_count, 3)

        reconciled = await collector.reconcile(spec, transport, timed_out)

        self.assertEqual(reconciled.lifecycle, "COLLECTED")
        self.assertEqual(reconciled.observation, "STATUS_LOOKUP")
        self.assertEqual(reconciled.evidence_scope, "STATUS_LOOKUP")
        self.assertEqual(reconciled.unknowns, ())

    async def test_declared_bound_limits_in_flight_source_attempts_without_claiming_scheduler_order(
        self,
    ) -> None:
        spec = reference.RunSpec(
            run_id="run-2026-07-30-a",
            source_ids=("catalog", "exercises", "progress"),
            max_in_flight=2,
        )
        transport = reference.ScriptedAsyncTransport(reference.SourceLedger())

        cut = await reference.AtlasAsyncCollector().collect(spec, transport)

        self.assertEqual(cut.classification, "FULL")
        self.assertLessEqual(transport.max_observed_in_flight, 2)
        self.assertEqual(
            sorted({source_id for source_id, phase, _ in transport.attempt_trace if phase == "ATTEMPTING"}),
            ["catalog", "exercises", "progress"],
        )

    async def test_scripted_predecision_connection_error_is_a_local_definite_failure_only_in_that_model(
        self,
    ) -> None:
        spec = reference.RunSpec(
            run_id="run-2026-07-30-a",
            source_ids=("catalog", "exercises", "progress"),
            requires_full_cut=True,
        )
        transport = reference.ScriptedAsyncTransport(
            reference.SourceLedger(),
            modes={"progress": "CONNECTION_ERROR_BEFORE_DECISION"},
        )

        cut = await reference.AtlasAsyncCollector().collect(spec, transport)
        failed = next(record for record in cut.records if record.source_id == "progress")

        self.assertEqual(cut.classification, "REJECTED_INCOMPLETE")
        self.assertEqual(failed.lifecycle, "LOCAL_FAILURE_DEFINITE")
        self.assertEqual(failed.observation, "CONNECTION_ERROR_BEFORE_DECISION")
        self.assertEqual(failed.evidence_scope, "ASYNC_MODEL")
        self.assertEqual(transport.ledger.record_count, 2)

    async def test_local_task_cancellation_after_server_model_decision_is_not_labeled_remote_rollback(
        self,
    ) -> None:
        spec = reference.RunSpec(
            run_id="run-2026-07-30-a",
            source_ids=("catalog", "exercises", "progress"),
            requires_full_cut=True,
        )
        transport = reference.ScriptedAsyncTransport(
            reference.SourceLedger(),
            modes={"catalog": "CANCEL_AFTER_DECISION"},
        )

        cut = await reference.AtlasAsyncCollector().collect(spec, transport)
        cancelled = cut.records[0]

        self.assertEqual(cut.classification, "REJECTED_INCOMPLETE")
        self.assertEqual(cancelled.lifecycle, "CANCELLED_LOCAL")
        self.assertEqual(cancelled.observation, "LOCAL_TASK_CANCEL_REQUESTED")
        self.assertEqual(cancelled.evidence_scope, "CLIENT_TASK")
        self.assertIn("server-model decision", " ".join(cancelled.unknowns))
        self.assertEqual(transport.ledger.record_count, 3)

    async def test_mismatched_response_identity_stays_unknown_despite_a_server_model_record(
        self,
    ) -> None:
        spec = reference.RunSpec(
            run_id="run-2026-07-30-a",
            source_ids=("catalog", "exercises", "progress"),
        )
        transport = reference.ScriptedAsyncTransport(
            reference.SourceLedger(),
            modes={"exercises": "MISMATCHED_RESPONSE"},
        )

        cut = await reference.AtlasAsyncCollector().collect(spec, transport)
        unknown = cut.records[1]

        self.assertEqual(cut.classification, "REJECTED_INCOMPLETE")
        self.assertEqual(unknown.lifecycle, "UNKNOWN_REMOTE")
        self.assertEqual(unknown.observation, "MISMATCHED_RESPONSE")
        self.assertEqual(unknown.evidence_scope, "CLIENT_RESPONSE")
        self.assertEqual(transport.ledger.record_count, 3)

    async def test_partial_cut_is_labeled_policy_when_the_declared_run_does_not_require_full_completeness(
        self,
    ) -> None:
        spec = reference.RunSpec(
            run_id="run-2026-07-30-a",
            source_ids=("catalog", "exercises", "progress"),
            requires_full_cut=False,
        )
        transport = reference.ScriptedAsyncTransport(
            reference.SourceLedger(),
            modes={"progress": "CONNECTION_ERROR_BEFORE_DECISION"},
        )

        cut = await reference.AtlasAsyncCollector().collect(spec, transport)

        self.assertEqual(cut.classification, "PARTIAL_PERMITTED")
        self.assertEqual(cut.missing_sources, ("progress",))
        self.assertEqual(cut.evidence_scope, "ATLAS_POLICY")

    async def test_timeout_reconciliation_packet_is_deterministic_scope_labeled_and_private(
        self,
    ) -> None:
        packet = await reference.run_scenario("timeout_then_reconcile")
        repeat_packet = await reference.run_scenario("timeout_then_reconcile")
        encoded = reference.render_evidence_packet(packet)
        decoded = json.loads(encoded)

        self.assertEqual(decoded["schema_version"], "atlas.module21.evidence/1")
        self.assertEqual(decoded["scenario"], "timeout_then_reconcile")
        self.assertEqual(decoded["run"]["run_id"], "run-2026-07-30-a")
        self.assertEqual(decoded["policy"]["max_in_flight"], 2)
        self.assertEqual(
            decoded["initial_collection_cut"]["classification"],
            "REJECTED_INCOMPLETE",
        )
        self.assertEqual(decoded["collection_cut"]["classification"], "FULL")
        self.assertEqual(
            decoded["reconciliation"]["observation"],
            "STATUS_LOOKUP",
        )
        self.assertIn(
            "local timeout did not establish the remote source result",
            decoded["unknowns_after_initial_attempt"],
        )
        self.assertEqual(decoded["unknowns_after_reconciliation"], [])
        self.assertEqual(
            decoded["trace_context"]["evidence_scope"],
            "ASYNC_MODEL_CORRELATION",
        )
        self.assertEqual(decoded["redaction"]["raw_payloads"], "OMITTED")
        self.assertEqual(decoded["redaction"]["credentials"], "OMITTED")
        self.assertIn("not a distributed-system proof", decoded["limitations"])
        self.assertEqual(decoded["tests"]["status"], "NOT_RUN")
        self.assertNotIn("localhost", encoded)
        self.assertNotIn("socket", encoded)
        self.assertEqual(encoded, reference.render_evidence_packet(repeat_packet))

    async def test_unlinked_events_remain_incomparable_despite_wall_time_or_trace_correlation(
        self,
    ) -> None:
        ledger = reference.CausalLedger(
            (
                reference.CausalEvent("catalog-send", "catalog", 1),
                reference.CausalEvent("catalog-receive", "collector", 1),
                reference.CausalEvent("progress-local", "progress", 1),
            ),
            send_receive_edges=(("catalog-send", "catalog-receive"),),
        )

        self.assertEqual(
            ledger.relation("catalog-send", "catalog-receive"),
            "HAPPENS_BEFORE",
        )
        self.assertEqual(
            ledger.relation("catalog-receive", "progress-local"),
            "INCOMPARABLE",
        )
        self.assertEqual(
            ledger.claim_boundary,
            "local sequences and explicit edges only; no wall-clock or trace-ID inference",
        )

    async def test_one_replica_observation_cannot_be_promoted_to_global_agreement(
        self,
    ) -> None:
        assessment = reference.assess_replica_claim(
            expected_replicas=("node-a", "node-b"),
            observed_applied_replicas=("node-a",),
        )

        self.assertEqual(assessment.classification, "REPLICA_OBSERVATION_ONLY")
        self.assertEqual(assessment.observed_replicas, ("node-a",))
        self.assertEqual(assessment.unobserved_replicas, ("node-b",))
        self.assertIn("does not establish", assessment.non_claim)

    async def test_incomplete_local_stream_frame_is_not_a_peer_parse_or_commit_claim(
        self,
    ) -> None:
        observation = await reference.read_scripted_frame(
            chunks=(b"AT", b"L"),
            expected_bytes=4,
        )

        self.assertEqual(observation.classification, "FRAME_INCOMPLETE")
        self.assertEqual(observation.available_bytes, 3)
        self.assertEqual(observation.expected_bytes, 4)
        self.assertEqual(observation.evidence_scope, "ASYNC_STREAM_MODEL")
        self.assertIn("does not establish", observation.non_claim)

    async def test_taskgroup_failure_probe_states_only_the_owned_local_scope_boundary(
        self,
    ) -> None:
        probe = await reference.run_taskgroup_failure_probe()

        self.assertEqual(
            probe.trace,
            (
                "OWNER_ENTERED",
                "SIBLING_STARTED",
                "FAILING_CHILD_RAISED",
                "SIBLING_CANCELLED_AND_CLEANED",
                "OWNER_OBSERVED_EXCEPTION_GROUP",
            ),
        )
        self.assertEqual(probe.evidence_scope, "PYTHON_TASKGROUP_MODEL")
        self.assertIn("does not establish", probe.non_claim)

    async def test_same_identity_conflict_packet_refuses_a_second_server_model_decision(
        self,
    ) -> None:
        packet = await reference.run_scenario("same_id_conflict")

        conflict = packet["scenario_observations"]["same_id_conflict"]
        self.assertEqual(conflict["classification"], "IDEMPOTENCY_CONFLICT")
        self.assertEqual(conflict["ledger_record_count"], 3)
        self.assertEqual(packet["collection_cut"]["classification"], "FULL")

    async def test_order_claim_packet_keeps_unlinked_events_and_one_replica_below_global_claims(
        self,
    ) -> None:
        packet = await reference.run_scenario("order_claim")

        order = packet["scenario_observations"]["causal_order"]
        replica = packet["scenario_observations"]["replica_observation"]
        self.assertEqual(order["catalog_send_to_receive"], "HAPPENS_BEFORE")
        self.assertEqual(order["receive_to_progress"], "INCOMPARABLE")
        self.assertEqual(replica["classification"], "REPLICA_OBSERVATION_ONLY")
        self.assertIn("does not establish", replica["non_claim"])

    async def test_stream_incomplete_packet_labels_only_a_local_frame_fixture(
        self,
    ) -> None:
        packet = await reference.run_scenario("stream_incomplete")

        frame = packet["scenario_observations"]["stream_frame"]
        self.assertEqual(frame["classification"], "FRAME_INCOMPLETE")
        self.assertEqual(frame["available_bytes"], 3)
        self.assertEqual(frame["evidence_scope"], "ASYNC_STREAM_MODEL")

    def test_reference_keeps_its_local_only_no_network_boundary_visible(self) -> None:
        source = Path(reference.__file__).read_text(encoding="utf-8")

        for forbidden in (
            "\nimport socket",
            "\nimport requests",
            "\nfrom urllib",
            "\nimport http.client",
            "asyncio.open_connection",
            "asyncio.start_server",
        ):
            self.assertNotIn(forbidden, source)

    def test_cli_emits_one_parseable_local_full_cut_packet(self) -> None:
        result = subprocess.run(
            [
                sys.executable,
                str(Path(__file__).with_name("module21_reference.py")),
                "--scenario",
                "full_cut",
            ],
            check=False,
            capture_output=True,
            encoding="utf-8",
        )

        self.assertEqual(result.returncode, 0, result.stderr)
        packet = json.loads(result.stdout)
        self.assertEqual(packet["scenario"], "full_cut")
        self.assertEqual(packet["collection_cut"]["classification"], "FULL")
        self.assertEqual(packet["tests"]["status"], "NOT_RUN")


if __name__ == "__main__":
    unittest.main()
