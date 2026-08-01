"""Small, local-only evidence models for Module 20: Networks and Protocols.

The reference deliberately models protocol boundaries without contacting a
network. It is not an HTTP server, DNS client, or a claim about a host TCP
implementation. Each public function supports a learner-visible contract.
"""

from __future__ import annotations

import argparse
from dataclasses import dataclass, replace
import hashlib
import json
import sys

FRAME_HEADER_BYTES = 4
MODEL_VERSION = "atlas-module20-reference/1"
EVIDENCE_SCHEMA_VERSION = "atlas.module20.evidence/1"
FIXTURE_ID = "snapshot-2026-07-30-a"
SUPPORTED_API_VERSION = "atlas-publish/1"
ATLAS_METHOD = "POST"
ATLAS_TARGET = "/v1/publications"
MODEL_TARGET_NAME = "atlas.example.invalid"
MODEL_ENDPOINT_CANDIDATE = "model://atlas-primary"
DEFAULT_MAX_FRAME_BYTES = 4_096


class ProtocolError(ValueError):
    """A declared application framing rule was violated."""


class FrameTooLarge(ProtocolError):
    """A frame length exceeds the caller-declared admission bound."""


class IncompleteFrameError(ProtocolError):
    """The byte source ended between declared frame boundaries."""


class DecoderTerminalError(ProtocolError):
    """A failed/ended decoder cannot safely admit later unrelated bytes."""


class IdempotencyConflict(ValueError):
    """One operation ID was reused for a different declared request."""


class InvalidRequest(ValueError):
    """A request failed Atlas validation before any decision was recorded."""


@dataclass(frozen=True)
class PublishRequest:
    """The small, synthetic publication request used throughout Module 20."""

    operation_id: str
    request_digest: str
    snapshot_id: str
    api_version: str = SUPPORTED_API_VERSION
    method: str = ATLAS_METHOD
    target: str = ATLAS_TARGET

    def __post_init__(self) -> None:
        for field_name, value in (
            ("operation_id", self.operation_id),
            ("request_digest", self.request_digest),
            ("snapshot_id", self.snapshot_id),
            ("api_version", self.api_version),
            ("method", self.method),
            ("target", self.target),
        ):
            if not isinstance(value, str) or not value:
                raise InvalidRequest(f"{field_name} must be a non-empty string")


def canonical_request_bytes(request: PublishRequest) -> bytes:
    """Encode the declared request meaning in one deterministic JSON form.

    The stored digest is deliberately excluded: it is a commitment *to* this
    canonical meaning, not an input that makes the meaning circular.
    """
    if not isinstance(request, PublishRequest):
        raise TypeError("request must be a PublishRequest")
    meaning = {
        "api_version": request.api_version,
        "method": request.method,
        "operation_id": request.operation_id,
        "snapshot_id": request.snapshot_id,
        "target": request.target,
    }
    return json.dumps(
        meaning,
        ensure_ascii=True,
        separators=(",", ":"),
        sort_keys=True,
    ).encode("ascii")


def request_digest(request: PublishRequest) -> str:
    """Return the stable SHA-256 label for the declared request meaning."""
    digest = hashlib.sha256(canonical_request_bytes(request)).hexdigest()
    return f"sha256:{digest}"


def make_publish_request(
    *,
    operation_id: str,
    snapshot_id: str,
    api_version: str = SUPPORTED_API_VERSION,
    method: str = ATLAS_METHOD,
    target: str = ATLAS_TARGET,
) -> PublishRequest:
    """Build a request whose declared digest matches its canonical meaning."""
    provisional = PublishRequest(
        operation_id=operation_id,
        request_digest="sha256:pending",
        snapshot_id=snapshot_id,
        api_version=api_version,
        method=method,
        target=target,
    )
    return replace(provisional, request_digest=request_digest(provisional))


def validate_publish_request(request: PublishRequest) -> None:
    """Enforce Atlas's narrow version, route, and digest admission contract."""
    if request.api_version != SUPPORTED_API_VERSION:
        raise InvalidRequest("unsupported api_version")
    if request.method != ATLAS_METHOD or request.target != ATLAS_TARGET:
        raise InvalidRequest("request is outside the declared Atlas operation scope")
    if request.request_digest != request_digest(request):
        raise InvalidRequest(
            "request_digest does not match the canonical request meaning"
        )


def serialize_publish_request(request: PublishRequest) -> bytes:
    """Serialize one declared request for the local framed-server seam.

    This function intentionally serializes even an invalid declared digest so
    server-admission tests can prove that parsing/validation rejects it before
    the ledger changes state.
    """
    if not isinstance(request, PublishRequest):
        raise TypeError("request must be a PublishRequest")
    wire_object = {
        "api_version": request.api_version,
        "method": request.method,
        "operation_id": request.operation_id,
        "request_digest": request.request_digest,
        "snapshot_id": request.snapshot_id,
        "target": request.target,
    }
    return json.dumps(
        wire_object,
        ensure_ascii=True,
        separators=(",", ":"),
        sort_keys=True,
    ).encode("ascii")


def parse_publish_request(payload: bytes) -> PublishRequest:
    """Parse and validate one complete local-model request frame payload."""
    if not isinstance(payload, bytes):
        raise TypeError("payload must be bytes")
    try:
        decoded = payload.decode("utf-8")
        wire_object = json.loads(decoded)
    except (UnicodeDecodeError, json.JSONDecodeError) as error:
        raise InvalidRequest("request payload is not one UTF-8 JSON object") from error

    expected_fields = {
        "api_version",
        "method",
        "operation_id",
        "request_digest",
        "snapshot_id",
        "target",
    }
    if not isinstance(wire_object, dict) or set(wire_object) != expected_fields:
        raise InvalidRequest("request payload has an unexpected field set")
    try:
        request = PublishRequest(**wire_object)
    except TypeError as error:
        raise InvalidRequest("request payload has an invalid object shape") from error
    validate_publish_request(request)
    return request


@dataclass(frozen=True)
class DecisionRecord:
    """A server-local decision, returned as first observation or replay."""

    operation_id: str
    request_digest: str
    snapshot_id: str
    decision: str
    replayed: bool


@dataclass(frozen=True)
class ServerResponse:
    """The small response shape Atlas declares after a server decision.

    It intentionally represents an application-level response object, not a
    parsed wire response, authenticated peer, real HTTP response, or a proof
    that a client has received it. Constructing this model type stands for an
    already-validated server-local response object.
    """

    operation_id: str
    request_digest: str
    decision: str
    replayed: bool
    evidence_scope: str = "SERVER_DECISION"

    def __post_init__(self) -> None:
        if not self.operation_id or not self.request_digest or not self.decision:
            raise ValueError("server response needs operation ID, digest, and decision")
        if self.evidence_scope != "SERVER_DECISION":
            raise ValueError("reference responses are scoped to SERVER_DECISION")

    @classmethod
    def from_record(cls, record: DecisionRecord) -> ServerResponse:
        """Make the response Atlas would attempt to return for one decision."""
        return cls(
            operation_id=record.operation_id,
            request_digest=record.request_digest,
            decision=record.decision,
            replayed=record.replayed,
        )


class IdempotencyLedger:
    """Record one server-local decision per operation ID and request digest.

    This finite teaching ledger is single-owner/sequential. A concurrent
    production adapter must serialize the whole lookup/first/replay/conflict
    transition; Module 19 explains why an unlocked get-then-set is not made
    atomic by a dictionary or a passing test.
    """

    def __init__(self) -> None:
        self._records: dict[str, DecisionRecord] = {}

    def apply(self, request: PublishRequest) -> DecisionRecord:
        """Publish once, replay an identical request, or reject key reuse."""
        validate_publish_request(request)
        prior = self._records.get(request.operation_id)
        if prior is None:
            record = DecisionRecord(
                operation_id=request.operation_id,
                request_digest=request.request_digest,
                snapshot_id=request.snapshot_id,
                decision="PUBLISHED",
                replayed=False,
            )
            self._records[request.operation_id] = record
            return record
        if prior.request_digest != request.request_digest:
            raise IdempotencyConflict(
                "operation_id is already bound to a different request digest"
            )
        return replace(prior, replayed=True)

    def lookup(self, operation_id: str) -> DecisionRecord | None:
        """Return the stored server-local decision without inventing a retry."""
        return self._records.get(operation_id)


@dataclass(frozen=True)
class ClientObservation:
    """A client-local result; it intentionally carries no invented server fact."""

    kind: str
    operation_id: str
    request_digest: str
    response: ServerResponse | None = None

    def __post_init__(self) -> None:
        if self.kind not in {
            "TIMEOUT",
            "CONNECTION_ERROR",
            "MALFORMED_RESPONSE",
            "RESPONSE",
        }:
            raise ValueError("unsupported client observation kind")
        if not self.operation_id or not self.request_digest:
            raise ValueError("client observation needs operation ID and digest")
        if self.kind == "RESPONSE" and self.response is None:
            raise ValueError("a RESPONSE observation needs a response object")
        if self.kind != "RESPONSE" and self.response is not None:
            raise ValueError("only a RESPONSE observation may carry a response")


@dataclass(frozen=True)
class ClientOutcome:
    """The strongest client knowledge classification supported by one observation."""

    classification: str
    operation_id: str
    request_digest: str
    decision: str | None
    evidence_scope: str
    replayed: bool | None = None


def classify_client_observation(observation: ClientObservation) -> ClientOutcome:
    """Classify what a client can know without inventing a remote non-effect."""
    if observation.kind == "RESPONSE":
        response = observation.response
        assert response is not None  # enforced by ClientObservation validation
        if (
            response.operation_id == observation.operation_id
            and response.request_digest == observation.request_digest
        ):
            return ClientOutcome(
                classification="CONFIRMED",
                operation_id=observation.operation_id,
                request_digest=observation.request_digest,
                decision=response.decision,
                evidence_scope="MATCHING_RESPONSE",
                replayed=response.replayed,
            )
        return ClientOutcome(
            classification="UNKNOWN",
            operation_id=observation.operation_id,
            request_digest=observation.request_digest,
            decision=None,
            evidence_scope="RESPONSE_IDENTITY_MISMATCH",
            replayed=None,
        )
    return ClientOutcome(
        classification="UNKNOWN",
        operation_id=observation.operation_id,
        request_digest=observation.request_digest,
        decision=None,
        evidence_scope="CLIENT_OBSERVATION",
        replayed=None,
    )


class ScriptedTransport:
    """A deterministic local adapter for distinct client/server histories.

    This is not a socket, resolver, or HTTP implementation. It lets the
    lesson hold the server's finite decision model constant while changing
    only what reaches the client.
    """

    _MODES = {
        "CONNECTION_ERROR_BEFORE_DECISION",
        "TIMEOUT_AFTER_DECISION",
        "MATCHING_RESPONSE",
    }

    def __init__(
        self,
        ledger: IdempotencyLedger,
        *,
        mode: str,
        max_frame_bytes: int = DEFAULT_MAX_FRAME_BYTES,
    ) -> None:
        if mode not in self._MODES:
            raise ValueError(f"unsupported scripted transport mode: {mode}")
        self._ledger = ledger
        self._mode = mode
        self._max_frame_bytes = max_frame_bytes
        self._server: AtlasPublicationServer | None = None
        self._attempt_history: list[dict[str, object]] = []
        self._last_framing_trace_digest: str | None = None

    def attempt(self, request: PublishRequest) -> ClientObservation:
        """Model one whole framed client attempt without network claims."""
        frame = encode_frame(serialize_publish_request(request))
        self._last_framing_trace_digest = _sha256_label(frame)
        attempt_number = len(self._attempt_history) + 1

        if self._mode == "CONNECTION_ERROR_BEFORE_DECISION":
            observation = ClientObservation(
                kind="CONNECTION_ERROR",
                operation_id=request.operation_id,
                request_digest=request.request_digest,
            )
            self._record_attempt(attempt_number, observation)
            return observation

        if self._server is None:
            self._server = AtlasPublicationServer(
                self._ledger,
                max_frame_bytes=self._max_frame_bytes,
            )
        responses = self._server.receive(frame)
        if len(responses) != 1:
            raise ProtocolError("scripted one-request attempt expected one response")
        response = responses[0]
        if self._mode == "TIMEOUT_AFTER_DECISION":
            observation = ClientObservation(
                kind="TIMEOUT",
                operation_id=request.operation_id,
                request_digest=request.request_digest,
            )
            self._record_attempt(attempt_number, observation)
            return observation

        observation = ClientObservation(
            kind="RESPONSE",
            operation_id=request.operation_id,
            request_digest=request.request_digest,
            response=response,
        )
        self._record_attempt(attempt_number, observation)
        return observation

    def lookup(self, operation_id: str) -> DecisionRecord | None:
        """Expose the declared server-local status-query seam."""
        return self._ledger.lookup(operation_id)

    @property
    def attempt_history(self) -> tuple[dict[str, object], ...]:
        """Return copy-safe, synthetic model attempt records for evidence."""
        return tuple(dict(record) for record in self._attempt_history)

    @property
    def endpoint_attempt(self) -> dict[str, object]:
        """Expose a synthetic candidate record, never a reachability claim."""
        return {
            "candidate": MODEL_ENDPOINT_CANDIDATE,
            "evidence_scope": "PROTOCOL_MODEL",
            "target_name": MODEL_TARGET_NAME,
        }

    @property
    def framing_trace_digest(self) -> str | None:
        """Expose a digest of synthetic framed bytes, not raw request data."""
        return self._last_framing_trace_digest

    def _record_attempt(
        self,
        attempt_number: int,
        observation: ClientObservation,
    ) -> None:
        self._attempt_history.append(
            {
                "attempt_number": attempt_number,
                "client_observation_kind": observation.kind,
                "evidence_scope": "PROTOCOL_MODEL",
            }
        )


class AtlasPublicationClient:
    """Apply the Atlas knowledge rule over a replaceable local adapter."""

    def __init__(self, transport: ScriptedTransport) -> None:
        self._transport = transport

    def publish(self, request: PublishRequest) -> ClientOutcome:
        """Classify one attempt; UNKNOWN never becomes a fabricated rollback."""
        return classify_client_observation(self._transport.attempt(request))

    def status(self, request: PublishRequest) -> ClientOutcome:
        """Confirm only a status result bound to this operation and digest."""
        record = self._transport.lookup(request.operation_id)
        if record is None or record.request_digest != request.request_digest:
            return ClientOutcome(
                classification="UNKNOWN",
                operation_id=request.operation_id,
                request_digest=request.request_digest,
                decision=None,
                evidence_scope="STATUS_LOOKUP_UNRESOLVED",
            )
        return ClientOutcome(
            classification="CONFIRMED",
            operation_id=request.operation_id,
            request_digest=request.request_digest,
            decision=record.decision,
            evidence_scope="STATUS_LOOKUP",
        )


def _outcome_packet(outcome: ClientOutcome) -> dict[str, str | bool | None]:
    """Project a client outcome into a small, scope-labelled evidence shape."""
    return {
        "classification": outcome.classification,
        "decision": outcome.decision,
        "evidence_scope": outcome.evidence_scope,
        "replayed": outcome.replayed,
    }


def _decision_packet(record: DecisionRecord | None) -> dict[str, object] | None:
    """Project only synthetic server-local facts; no raw request payload exists."""
    if record is None:
        return None
    return {
        "decision": record.decision,
        "evidence_scope": "SERVER_DECISION",
        "replayed": record.replayed,
    }


def _sha256_label(value: bytes) -> str:
    """Return a digest label for synthetic evidence without retaining bytes."""
    return "sha256:" + hashlib.sha256(value).hexdigest()


def scenario_evidence(scenario: str) -> dict[str, object]:
    """Run one finite teaching scenario and return a deterministic evidence packet.

    The returned server record is intentionally labelled separately from the
    client outcome. It allows a learner to compare what happened in the model
    with what the client could know at each point; it is not a claim that a
    real client would possess server-local data after a timeout.
    """
    modes = {
        "connection_error": "CONNECTION_ERROR_BEFORE_DECISION",
        "matching_response": "MATCHING_RESPONSE",
        "timeout_then_lookup": "TIMEOUT_AFTER_DECISION",
    }
    try:
        mode = modes[scenario]
    except KeyError as error:
        allowed = ", ".join(sorted(modes))
        raise ValueError(f"unknown scenario {scenario!r}; choose one of {allowed}") from error

    request = make_publish_request(
        operation_id="op-0007",
        snapshot_id=FIXTURE_ID,
    )
    transport = ScriptedTransport(IdempotencyLedger(), mode=mode)
    client = AtlasPublicationClient(transport)
    attempt = client.publish(request)
    status_lookup = client.status(request)
    server_record = transport.lookup(request.operation_id)

    if attempt.classification == "UNKNOWN":
        unknowns_after_attempt = [
            "The client cannot determine the remote effect from this observation alone."
        ]
    else:
        unknowns_after_attempt = [
            "A matching Atlas response confirms this declared server decision, not global delivery or exactly-once processing."
        ]

    return {
        "attempt": _outcome_packet(attempt),
        "attempt_history": list(transport.attempt_history),
        "command": (
            "python public/downloads/module20_reference.py "
            f"--scenario {scenario}"
        ),
        "endpoint_attempt": transport.endpoint_attempt,
        "fixture_id": FIXTURE_ID,
        "fixture_digest": _sha256_label(FIXTURE_ID.encode("ascii")),
        "framing_trace_digest": transport.framing_trace_digest,
        "model_version": MODEL_VERSION,
        "operation": {
            "operation_id": request.operation_id,
            "request_digest": request.request_digest,
        },
        "runtime": {
            "implementation": sys.implementation.name,
            "python": ".".join(str(part) for part in sys.version_info[:3]),
        },
        "scenario": scenario,
        "schema_version": EVIDENCE_SCHEMA_VERSION,
        "server_local": _decision_packet(server_record),
        "status_lookup": _outcome_packet(status_lookup),
        "test_summary": {
            "executed_by_scenario": False,
            "scope": "scenario rendering does not execute the unit suite",
            "status": "NOT_RUN",
        },
        "canonical_command_base": "repository root",
        "unknowns_after_attempt": unknowns_after_attempt,
    }


def render_scenario_evidence(scenario: str) -> str:
    """Render one scenario as stable, privacy-safe JSON for the workbook."""
    return json.dumps(
        scenario_evidence(scenario),
        ensure_ascii=True,
        indent=2,
        sort_keys=True,
    ) + "\n"


def main(argv: list[str] | None = None) -> int:
    """Run a named finite model scenario without contacting any network."""
    parser = argparse.ArgumentParser(
        description="Emit a deterministic Module 20 local evidence packet."
    )
    parser.add_argument(
        "--scenario",
        choices=("connection_error", "matching_response", "timeout_then_lookup"),
        default="timeout_then_lookup",
        help="synthetic model history to render",
    )
    args = parser.parse_args(argv)
    print(render_scenario_evidence(args.scenario), end="")
    return 0


def encode_frame(payload: bytes) -> bytes:
    """Return one unsigned-32-bit length-prefixed application frame."""
    if not isinstance(payload, bytes):
        raise TypeError("payload must be bytes")
    if len(payload) > (2**32 - 1):
        raise FrameTooLarge("payload exceeds the wire-format length field")
    return len(payload).to_bytes(FRAME_HEADER_BYTES, "big") + payload


class FrameDecoder:
    """Incrementally reconstruct bounded frames from arbitrary byte chunks.

    A call to feed does not assume that a chunk starts or ends on a frame
    boundary. Complete payloads are emitted only after their declared body
    length has arrived. The decoder owns its remaining buffer.
    """

    def __init__(self, *, max_frame_bytes: int) -> None:
        if not isinstance(max_frame_bytes, int) or max_frame_bytes < 0:
            raise ValueError("max_frame_bytes must be a non-negative integer")
        self._max_frame_bytes = max_frame_bytes
        self._buffer = bytearray()
        self._expected_body_bytes: int | None = None
        self._terminal_error: ProtocolError | None = None

    def feed(self, chunk: bytes) -> tuple[bytes, ...]:
        """Consume an arbitrary byte chunk and emit zero or more payloads."""
        self._raise_if_terminal()
        if not isinstance(chunk, bytes):
            raise TypeError("chunk must be bytes")
        self._buffer.extend(chunk)
        emitted: list[bytes] = []

        while True:
            if self._expected_body_bytes is None:
                if len(self._buffer) < FRAME_HEADER_BYTES:
                    break
                self._expected_body_bytes = int.from_bytes(
                    self._buffer[:FRAME_HEADER_BYTES],
                    "big",
                )
                del self._buffer[:FRAME_HEADER_BYTES]
                if self._expected_body_bytes > self._max_frame_bytes:
                    self._terminate(
                        FrameTooLarge(
                            "declared frame exceeds max_frame_bytes; parser is terminal"
                        )
                    )

            if len(self._buffer) < self._expected_body_bytes:
                break

            body_end = self._expected_body_bytes
            emitted.append(bytes(self._buffer[:body_end]))
            del self._buffer[:body_end]
            self._expected_body_bytes = None

        return tuple(emitted)

    def finish(self) -> None:
        """Assert that the source ended exactly at a frame boundary."""
        self._raise_if_terminal()
        if self._expected_body_bytes is not None or self._buffer:
            self._terminate(
                IncompleteFrameError(
                    "byte source ended before one declared frame was complete"
                )
            )

    def _terminate(self, error: ProtocolError) -> None:
        """Make a decoder error terminal rather than parsing a new message mix."""
        self._terminal_error = error
        self._buffer.clear()
        self._expected_body_bytes = None
        raise error

    def _raise_if_terminal(self) -> None:
        """Reject reuse after a malformed/ended stream without pretending reset."""
        if self._terminal_error is not None:
            raise DecoderTerminalError(
                "decoder is terminal after a prior protocol error; create a new decoder"
            ) from self._terminal_error


class AtlasPublicationServer:
    """Join framing, parsing, validation, and the single-owner ledger.

    The server owns one decoder for one synthetic byte source. It is a
    sequential local model: one caller must own `receive()` and the ledger
    transition. It is not a socket server, HTTP server, or concurrent service.
    """

    def __init__(
        self,
        ledger: IdempotencyLedger,
        *,
        max_frame_bytes: int,
    ) -> None:
        self._ledger = ledger
        self._decoder = FrameDecoder(max_frame_bytes=max_frame_bytes)

    def receive(self, chunk: bytes) -> tuple[ServerResponse, ...]:
        """Admit only fully decoded, parsed, and validated request payloads."""
        payloads = self._decoder.feed(chunk)
        responses: list[ServerResponse] = []
        for payload in payloads:
            request = parse_publish_request(payload)
            record = self._ledger.apply(request)
            responses.append(ServerResponse.from_record(record))
        return tuple(responses)

    def finish(self) -> None:
        """Declare source end; partial framing remains a terminal protocol error."""
        self._decoder.finish()


if __name__ == "__main__":
    raise SystemExit(main())
