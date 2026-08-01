"""Behavioral tests for the Module 20 network-protocol evidence reference."""

from __future__ import annotations

import json
from pathlib import Path
import subprocess
import sys
import unittest

sys.path.insert(0, str(Path(__file__).resolve().parent))

import module20_reference as reference


class Module20ReferenceTests(unittest.TestCase):
    def request(self, *, operation_id: str = "op-0007") -> reference.PublishRequest:
        """Build the one canonical Atlas request used by most scenarios."""
        return reference.make_publish_request(
            operation_id=operation_id,
            snapshot_id="snapshot-2026-07-30-a",
        )

    def framed(self, request: reference.PublishRequest) -> bytes:
        """Encode one whole model request for the server-admission seam."""
        return reference.encode_frame(reference.serialize_publish_request(request))

    def test_frame_decoder_reassembles_one_declared_payload_across_chunks(
        self,
    ) -> None:
        """A byte stream is not a message stream: one frame may arrive in pieces."""
        decoder = reference.FrameDecoder(max_frame_bytes=64)
        encoded = reference.encode_frame(b"atlas")

        self.assertEqual(decoder.feed(encoded[:2]), ())
        self.assertEqual(decoder.feed(encoded[2:6]), ())
        self.assertEqual(decoder.feed(encoded[6:]), (b"atlas",))
        decoder.finish()

    def test_identical_retry_replays_one_server_local_decision(self) -> None:
        """A retry needs one stable ID and identical request meaning."""
        ledger = reference.IdempotencyLedger()
        request = self.request()

        first = ledger.apply(request)
        replay = ledger.apply(request)

        self.assertEqual(first.decision, "PUBLISHED")
        self.assertFalse(first.replayed)
        self.assertEqual(replay.decision, "PUBLISHED")
        self.assertTrue(replay.replayed)
        self.assertEqual(replay.operation_id, "op-0007")

    def test_client_timeout_is_an_unknown_remote_outcome(self) -> None:
        """Stopping the wait does not establish rollback or remote no-effect."""
        outcome = reference.classify_client_observation(
            reference.ClientObservation(
                kind="TIMEOUT",
                operation_id="op-0007",
                request_digest=self.request().request_digest,
            )
        )

        self.assertEqual(outcome.classification, "UNKNOWN")
        self.assertIsNone(outcome.decision)
        self.assertEqual(outcome.evidence_scope, "CLIENT_OBSERVATION")

    def test_canonical_request_digest_is_stable_and_binds_declared_meaning(
        self,
    ) -> None:
        """The ledger needs a reproducible request meaning, not an ad hoc label."""
        request = self.request()

        self.assertEqual(
            reference.canonical_request_bytes(request),
            (
                b'{"api_version":"atlas-publish/1",'
                b'"method":"POST",'
                b'"operation_id":"op-0007",'
                b'"snapshot_id":"snapshot-2026-07-30-a",'
                b'"target":"/v1/publications"}'
            ),
        )
        self.assertEqual(request.request_digest, reference.request_digest(request))
        self.assertTrue(request.request_digest.startswith("sha256:"))

    def test_invalid_declared_digest_rejects_before_a_ledger_decision(self) -> None:
        """Server validation is earlier than first-decision or replay logic."""
        ledger = reference.IdempotencyLedger()
        invalid = reference.PublishRequest(
            operation_id="op-0007",
            request_digest="sha256:not-the-canonical-request",
            snapshot_id="snapshot-2026-07-30-a",
        )

        with self.assertRaises(reference.InvalidRequest):
            ledger.apply(invalid)

        self.assertIsNone(ledger.lookup("op-0007"))

    def test_one_chunk_can_carry_two_complete_declared_frames(self) -> None:
        """A stream can coalesce messages just as easily as it can split one."""
        decoder = reference.FrameDecoder(max_frame_bytes=64)
        chunk = reference.encode_frame(b"atlas") + reference.encode_frame(b"index")

        self.assertEqual(decoder.feed(chunk), (b"atlas", b"index"))
        decoder.finish()

    def test_declared_oversize_rejects_before_message_admission(self) -> None:
        """A declared oversize is never emitted as an admitted frame."""
        decoder = reference.FrameDecoder(max_frame_bytes=64)

        with self.assertRaises(reference.FrameTooLarge):
            decoder.feed((65).to_bytes(reference.FRAME_HEADER_BYTES, "big"))

        with self.assertRaises(reference.DecoderTerminalError):
            decoder.feed(reference.encode_frame(b"later"))

    def test_end_between_frame_boundaries_is_not_a_complete_request(self) -> None:
        """EOF is evidence of source end, not permission to invent a body."""
        decoder = reference.FrameDecoder(max_frame_bytes=64)
        decoder.feed(reference.encode_frame(b"atlas")[:-1])

        with self.assertRaises(reference.IncompleteFrameError):
            decoder.finish()

        with self.assertRaises(reference.DecoderTerminalError):
            decoder.feed(reference.encode_frame(b"new-connection-needed"))

    def test_oversize_header_and_body_in_one_chunk_is_never_admitted(self) -> None:
        """A bad declared length remains terminal even if trailing bytes exist."""
        decoder = reference.FrameDecoder(max_frame_bytes=4)
        oversized_wire = (5).to_bytes(reference.FRAME_HEADER_BYTES, "big") + b"abcde"

        with self.assertRaises(reference.FrameTooLarge):
            decoder.feed(oversized_wire)

        with self.assertRaises(reference.DecoderTerminalError):
            decoder.finish()

    def test_same_operation_id_with_different_request_meaning_conflicts(self) -> None:
        """A key binds one canonical request, rather than silently overwriting it."""
        ledger = reference.IdempotencyLedger()
        first = self.request()
        conflicting = reference.make_publish_request(
            operation_id="op-0007",
            snapshot_id="snapshot-2026-07-30-b",
        )
        ledger.apply(first)

        with self.assertRaises(reference.IdempotencyConflict):
            ledger.apply(conflicting)

        stored = ledger.lookup("op-0007")
        self.assertIsNotNone(stored)
        self.assertEqual(stored.request_digest, first.request_digest)
        self.assertFalse(stored.replayed)

    def test_unsupported_api_version_rejects_before_a_ledger_decision(self) -> None:
        """Version is part of declared meaning and a bounded admission rule."""
        ledger = reference.IdempotencyLedger()
        unsupported = reference.make_publish_request(
            operation_id="op-0007",
            snapshot_id="snapshot-2026-07-30-a",
            api_version="atlas-publish/0",
        )

        with self.assertRaises(reference.InvalidRequest):
            ledger.apply(unsupported)

        self.assertIsNone(ledger.lookup("op-0007"))

    def test_every_two_chunk_partition_reaches_the_ledger_only_after_one_frame(
        self,
    ) -> None:
        """Framing, parsing, validation, and decision are one admission chain."""
        request = self.request()
        wire = self.framed(request)

        for split in range(len(wire) + 1):
            with self.subTest(split=split):
                ledger = reference.IdempotencyLedger()
                server = reference.AtlasPublicationServer(
                    ledger,
                    max_frame_bytes=512,
                )
                first = server.receive(wire[:split])
                if split < len(wire):
                    self.assertEqual(first, ())
                    self.assertIsNone(ledger.lookup(request.operation_id))
                second = server.receive(wire[split:])

                responses = first + second
                self.assertEqual(len(responses), 1)
                self.assertEqual(responses[0].operation_id, request.operation_id)
                self.assertEqual(responses[0].request_digest, request.request_digest)
                self.assertEqual(responses[0].decision, "PUBLISHED")
                server.finish()

    def test_bad_request_bytes_cannot_reach_the_ledger(self) -> None:
        """A valid frame still needs request/digest validation before decision."""
        ledger = reference.IdempotencyLedger()
        server = reference.AtlasPublicationServer(ledger, max_frame_bytes=512)
        invalid = reference.PublishRequest(
            operation_id="op-0007",
            request_digest="sha256:not-the-canonical-request",
            snapshot_id="snapshot-2026-07-30-a",
        )

        with self.assertRaises(reference.InvalidRequest):
            server.receive(self.framed(invalid))

        self.assertIsNone(ledger.lookup("op-0007"))

    def test_non_string_wire_field_cannot_reach_the_ledger(self) -> None:
        """A complete JSON frame is not valid until each declared field is typed."""
        ledger = reference.IdempotencyLedger()
        server = reference.AtlasPublicationServer(ledger, max_frame_bytes=512)
        malformed_object = {
            "api_version": reference.SUPPORTED_API_VERSION,
            "method": reference.ATLAS_METHOD,
            "operation_id": "op-0007",
            "request_digest": "sha256:placeholder",
            "snapshot_id": 7,
            "target": reference.ATLAS_TARGET,
        }
        wire = reference.encode_frame(
            json.dumps(malformed_object, sort_keys=True).encode("ascii")
        )

        with self.assertRaises(reference.InvalidRequest):
            server.receive(wire)

        self.assertIsNone(ledger.lookup("op-0007"))

    def test_matching_response_confirms_one_matching_server_decision(self) -> None:
        """Only a response bound to this operation and digest promotes knowledge."""
        request = self.request()
        record = reference.IdempotencyLedger().apply(request)
        observation = reference.ClientObservation(
            kind="RESPONSE",
            operation_id=request.operation_id,
            request_digest=request.request_digest,
            response=reference.ServerResponse.from_record(record),
        )

        outcome = reference.classify_client_observation(observation)

        self.assertEqual(outcome.classification, "CONFIRMED")
        self.assertEqual(outcome.decision, "PUBLISHED")
        self.assertEqual(outcome.evidence_scope, "MATCHING_RESPONSE")

    def test_mismatched_response_remains_unknown(self) -> None:
        """A well-shaped response for another request cannot confirm this one."""
        request = self.request()
        other = self.request(operation_id="op-0008")
        record = reference.IdempotencyLedger().apply(other)
        observation = reference.ClientObservation(
            kind="RESPONSE",
            operation_id=request.operation_id,
            request_digest=request.request_digest,
            response=reference.ServerResponse.from_record(record),
        )

        outcome = reference.classify_client_observation(observation)

        self.assertEqual(outcome.classification, "UNKNOWN")
        self.assertIsNone(outcome.decision)
        self.assertEqual(outcome.evidence_scope, "RESPONSE_IDENTITY_MISMATCH")

    def test_timeout_after_a_server_decision_stays_unknown_until_status_lookup(
        self,
    ) -> None:
        """Server fact and client knowledge intentionally diverge in this trace."""
        transport = reference.ScriptedTransport(
            reference.IdempotencyLedger(),
            mode="TIMEOUT_AFTER_DECISION",
        )
        client = reference.AtlasPublicationClient(transport)
        request = self.request()

        after_publish = client.publish(request)
        after_lookup = client.status(request)

        self.assertEqual(after_publish.classification, "UNKNOWN")
        self.assertEqual(after_publish.evidence_scope, "CLIENT_OBSERVATION")
        self.assertEqual(after_lookup.classification, "CONFIRMED")
        self.assertEqual(after_lookup.decision, "PUBLISHED")
        self.assertEqual(after_lookup.evidence_scope, "STATUS_LOOKUP")

    def test_timeout_then_same_identity_retry_replays_one_record(self) -> None:
        """A retry is same operation only when it preserves ID and digest."""
        ledger = reference.IdempotencyLedger()
        timed_out_client = reference.AtlasPublicationClient(
            reference.ScriptedTransport(ledger, mode="TIMEOUT_AFTER_DECISION")
        )
        replay_client = reference.AtlasPublicationClient(
            reference.ScriptedTransport(ledger, mode="MATCHING_RESPONSE")
        )
        request = self.request()

        self.assertEqual(timed_out_client.publish(request).classification, "UNKNOWN")
        replay = replay_client.publish(request)

        self.assertEqual(replay.classification, "CONFIRMED")
        self.assertEqual(replay.decision, "PUBLISHED")
        self.assertTrue(replay.replayed)

    def test_new_operation_id_after_timeout_creates_a_distinct_server_record(self) -> None:
        """Changing the key deliberately changes the operation, not its retry count."""
        ledger = reference.IdempotencyLedger()
        client = reference.AtlasPublicationClient(
            reference.ScriptedTransport(ledger, mode="TIMEOUT_AFTER_DECISION")
        )
        first = self.request(operation_id="op-0007")
        second = self.request(operation_id="op-0008")

        client.publish(first)
        client.publish(second)

        self.assertIsNotNone(ledger.lookup("op-0007"))
        self.assertIsNotNone(ledger.lookup("op-0008"))
        self.assertNotEqual(
            ledger.lookup("op-0007").operation_id,
            ledger.lookup("op-0008").operation_id,
        )

    def test_status_lookup_without_a_matching_decision_remains_unknown(self) -> None:
        """A lookup is evidence only when it binds this request to a record."""
        transport = reference.ScriptedTransport(
            reference.IdempotencyLedger(),
            mode="CONNECTION_ERROR_BEFORE_DECISION",
        )
        client = reference.AtlasPublicationClient(transport)
        request = self.request()

        self.assertEqual(client.publish(request).classification, "UNKNOWN")
        outcome = client.status(request)

        self.assertEqual(outcome.classification, "UNKNOWN")
        self.assertIsNone(outcome.decision)
        self.assertEqual(outcome.evidence_scope, "STATUS_LOOKUP_UNRESOLVED")

    def test_status_lookup_with_same_id_but_different_digest_remains_unknown(
        self,
    ) -> None:
        """Operation-ID lookup cannot confirm a different declared request meaning."""
        ledger = reference.IdempotencyLedger()
        original = self.request()
        changed_meaning = reference.make_publish_request(
            operation_id=original.operation_id,
            snapshot_id="snapshot-2026-07-30-b",
        )
        ledger.apply(original)
        client = reference.AtlasPublicationClient(
            reference.ScriptedTransport(ledger, mode="CONNECTION_ERROR_BEFORE_DECISION")
        )

        outcome = client.status(changed_meaning)

        self.assertEqual(outcome.classification, "UNKNOWN")
        self.assertIsNone(outcome.decision)
        self.assertEqual(outcome.evidence_scope, "STATUS_LOOKUP_UNRESOLVED")

    def test_malformed_response_observation_stays_unknown(self) -> None:
        """Parser failure is not evidence that the server chose no effect."""
        request = self.request()

        outcome = reference.classify_client_observation(
            reference.ClientObservation(
                kind="MALFORMED_RESPONSE",
                operation_id=request.operation_id,
                request_digest=request.request_digest,
            )
        )

        self.assertEqual(outcome.classification, "UNKNOWN")
        self.assertIsNone(outcome.decision)
        self.assertEqual(outcome.evidence_scope, "CLIENT_OBSERVATION")

    def test_timeout_scenario_packet_is_deterministic_scope_labeled_and_private(
        self,
    ) -> None:
        """The teaching trace preserves client unknown and server-local scope."""
        first = reference.render_scenario_evidence("timeout_then_lookup")
        second = reference.render_scenario_evidence("timeout_then_lookup")
        packet = json.loads(first)

        self.assertEqual(first, second)
        self.assertEqual(packet["schema_version"], "atlas.module20.evidence/1")
        self.assertEqual(packet["fixture_id"], "snapshot-2026-07-30-a")
        self.assertEqual(packet["attempt"]["classification"], "UNKNOWN")
        self.assertEqual(packet["attempt"]["evidence_scope"], "CLIENT_OBSERVATION")
        self.assertEqual(packet["server_local"]["evidence_scope"], "SERVER_DECISION")
        self.assertEqual(packet["status_lookup"]["classification"], "CONFIRMED")
        self.assertEqual(packet["endpoint_attempt"]["evidence_scope"], "PROTOCOL_MODEL")
        self.assertEqual(packet["attempt_history"][0]["attempt_number"], 1)
        self.assertTrue(packet["fixture_digest"].startswith("sha256:"))
        self.assertTrue(packet["framing_trace_digest"].startswith("sha256:"))
        self.assertFalse(packet["test_summary"]["executed_by_scenario"])
        self.assertEqual(
            packet["command"],
            "python public/downloads/module20_reference.py "
            "--scenario timeout_then_lookup",
        )
        self.assertEqual(packet["canonical_command_base"], "repository root")
        self.assertIn("remote effect", packet["unknowns_after_attempt"][0])
        self.assertNotIn("C:\\", first)
        self.assertNotIn("raw_payload", first)

    def test_cli_emits_one_parseable_local_matching_response_packet(self) -> None:
        """The learner can reproduce a named trace with the course runtime."""
        completed = subprocess.run(
            [
                sys.executable,
                str(Path(reference.__file__).resolve()),
                "--scenario",
                "matching_response",
            ],
            check=True,
            capture_output=True,
            text=True,
        )
        packet = json.loads(completed.stdout)

        self.assertEqual(packet["scenario"], "matching_response")
        self.assertEqual(packet["attempt"]["classification"], "CONFIRMED")
        self.assertEqual(packet["status_lookup"]["classification"], "CONFIRMED")
        self.assertEqual(completed.stderr, "")


if __name__ == "__main__":
    unittest.main()
