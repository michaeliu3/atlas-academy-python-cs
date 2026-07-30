"""Small, local-only evidence models for Module 21: Async and Distributed Systems.

The reference uses synthetic fixtures and explicit evidence labels. It makes no
network connection and is not a production scheduler, distributed database, or
claim about an external service.
"""

from __future__ import annotations

import argparse
import asyncio
from dataclasses import dataclass, replace
import hashlib
import json
import sys
from typing import Mapping


MODEL_VERSION = "atlas-module21-reference/1"
EVIDENCE_SCHEMA_VERSION = "atlas.module21.evidence/1"
SUPPORTED_API_VERSION = "atlas-collect/1"
ATLAS_TARGET = "/v1/source-records"


class InvalidRunSpec(ValueError):
    """A collection-run declaration is incomplete or internally inconsistent."""


class InvalidSourceRequest(ValueError):
    """A source request failed Atlas admission before any model decision."""


class IdempotencyConflict(ValueError):
    """One source operation identity was reused for a different meaning."""


class LocalConnectionError(RuntimeError):
    """The scripted model knows no server decision was attempted."""


class LocalTimeoutAfterDecision(TimeoutError):
    """A local timeout that deliberately leaves the remote decision unknown."""


@dataclass(frozen=True)
class RunSpec:
    """The declared source set and narrow collection policy for one run."""

    run_id: str
    source_ids: tuple[str, ...]
    max_in_flight: int = 2
    requires_full_cut: bool = True
    api_version: str = SUPPORTED_API_VERSION

    def __post_init__(self) -> None:
        if not isinstance(self.run_id, str) or not self.run_id:
            raise InvalidRunSpec("run_id must be a non-empty string")
        if (
            not self.source_ids
            or any(not isinstance(source_id, str) or not source_id for source_id in self.source_ids)
            or len(set(self.source_ids)) != len(self.source_ids)
        ):
            raise InvalidRunSpec("source_ids must be a non-empty tuple of unique strings")
        if not isinstance(self.max_in_flight, int) or self.max_in_flight < 1:
            raise InvalidRunSpec("max_in_flight must be a positive integer")
        if not isinstance(self.requires_full_cut, bool):
            raise InvalidRunSpec("requires_full_cut must be a boolean")
        if self.api_version != SUPPORTED_API_VERSION:
            raise InvalidRunSpec("unsupported api_version")


@dataclass(frozen=True)
class SourceRequest:
    """One declared source operation in the finite Atlas collector model."""

    run_id: str
    source_id: str
    operation_id: str
    request_digest: str
    source_epoch: str
    api_version: str = SUPPORTED_API_VERSION
    target: str = ATLAS_TARGET


def canonical_source_request_bytes(request: SourceRequest) -> bytes:
    """Encode declared source-request meaning in one stable JSON form."""
    if not isinstance(request, SourceRequest):
        raise TypeError("request must be a SourceRequest")
    meaning = {
        "api_version": request.api_version,
        "operation_id": request.operation_id,
        "run_id": request.run_id,
        "source_epoch": request.source_epoch,
        "source_id": request.source_id,
        "target": request.target,
    }
    return json.dumps(
        meaning,
        ensure_ascii=True,
        separators=(",", ":"),
        sort_keys=True,
    ).encode("ascii")


def source_request_digest(request: SourceRequest) -> str:
    """Return the stable digest that binds one declared source operation."""
    return f"sha256:{hashlib.sha256(canonical_source_request_bytes(request)).hexdigest()}"


def make_source_request(
    *,
    run_id: str,
    source_id: str,
    source_epoch: str,
    api_version: str = SUPPORTED_API_VERSION,
    target: str = ATLAS_TARGET,
) -> SourceRequest:
    """Build one source request whose visible digest matches its meaning."""
    if not all(isinstance(value, str) and value for value in (run_id, source_id, source_epoch)):
        raise ValueError("run_id, source_id, and source_epoch must be non-empty strings")
    provisional = SourceRequest(
        run_id=run_id,
        source_id=source_id,
        operation_id=f"{run_id}/{source_id}",
        request_digest="sha256:pending",
        source_epoch=source_epoch,
        api_version=api_version,
        target=target,
    )
    return replace(provisional, request_digest=source_request_digest(provisional))


def validate_source_request(spec: RunSpec, request: SourceRequest) -> None:
    """Admit only a request that belongs to one declared run and source set."""
    if not isinstance(spec, RunSpec):
        raise TypeError("spec must be a RunSpec")
    if not isinstance(request, SourceRequest):
        raise TypeError("request must be a SourceRequest")
    for field_name, value in (
        ("run_id", request.run_id),
        ("source_id", request.source_id),
        ("operation_id", request.operation_id),
        ("request_digest", request.request_digest),
        ("source_epoch", request.source_epoch),
        ("api_version", request.api_version),
        ("target", request.target),
    ):
        if not isinstance(value, str) or not value:
            raise InvalidSourceRequest(f"{field_name} must be a non-empty string")
    if request.run_id != spec.run_id:
        raise InvalidSourceRequest("request does not belong to this run")
    if request.source_id not in spec.source_ids:
        raise InvalidSourceRequest("request source is outside the declared source set")
    if request.operation_id != f"{request.run_id}/{request.source_id}":
        raise InvalidSourceRequest("operation_id is not the declared source identity")
    if request.api_version != spec.api_version or request.target != ATLAS_TARGET:
        raise InvalidSourceRequest("request is outside the declared Atlas source scope")
    if request.request_digest != source_request_digest(request):
        raise InvalidSourceRequest("request_digest does not match canonical request meaning")


@dataclass(frozen=True)
class SourceDecisionRecord:
    """One server-model decision for a source operation; scope is explicit."""

    source_id: str
    operation_id: str
    request_digest: str
    source_epoch: str
    decision: str
    replayed: bool
    evidence_scope: str = "SERVER_MODEL"


class SourceLedger:
    """Single-owner synthetic replay/conflict ledger inherited from Module 20.

    This object models one serialized server-side admission transition. It does
    not make an asynchronous or distributed atomicity claim; Module 19 owns the
    proof obligation for a concurrent real adapter.
    """

    def __init__(self) -> None:
        self._records: dict[str, SourceDecisionRecord] = {}

    @property
    def record_count(self) -> int:
        return len(self._records)

    @property
    def records(self) -> tuple[SourceDecisionRecord, ...]:
        """Return deterministic server-model records for evidence rendering."""
        return tuple(
            sorted(self._records.values(), key=lambda record: record.source_id)
        )

    def apply(self, spec: RunSpec, request: SourceRequest) -> SourceDecisionRecord:
        """Record first collection, replay an identical request, or conflict."""
        validate_source_request(spec, request)
        prior = self._records.get(request.operation_id)
        if prior is None:
            record = SourceDecisionRecord(
                source_id=request.source_id,
                operation_id=request.operation_id,
                request_digest=request.request_digest,
                source_epoch=request.source_epoch,
                decision="COLLECTED",
                replayed=False,
            )
            self._records[request.operation_id] = record
            return record
        if prior.request_digest != request.request_digest:
            raise IdempotencyConflict(
                "operation_id is already bound to a different source request digest"
            )
        return replace(prior, replayed=True)

    def lookup(
        self,
        spec: RunSpec,
        request: SourceRequest,
    ) -> SourceDecisionRecord | None:
        """Return one matching retained server-model decision, if declared."""
        validate_source_request(spec, request)
        record = self._records.get(request.operation_id)
        if record is None or record.request_digest != request.request_digest:
            return None
        return record


@dataclass(frozen=True)
class SourceResponse:
    """One server-model response object, not proof that a client saw it."""

    source_id: str
    operation_id: str
    request_digest: str
    source_epoch: str
    decision: str
    replayed: bool
    evidence_scope: str = "SERVER_MODEL"

    @classmethod
    def from_record(cls, record: SourceDecisionRecord) -> "SourceResponse":
        return cls(
            source_id=record.source_id,
            operation_id=record.operation_id,
            request_digest=record.request_digest,
            source_epoch=record.source_epoch,
            decision=record.decision,
            replayed=record.replayed,
        )


@dataclass(frozen=True)
class SourceRecord:
    """Atlas's local accounting record for one source task in one run."""

    source_id: str
    operation_id: str
    request_digest: str
    source_epoch: str
    lifecycle: str
    observation: str
    evidence_scope: str
    unknowns: tuple[str, ...] = ()


@dataclass(frozen=True)
class CollectionCut:
    """A policy-scoped selection of local source records for one collection run."""

    run_id: str
    classification: str
    records: tuple[SourceRecord, ...]
    missing_sources: tuple[str, ...]
    evidence_scope: str = "ATLAS_POLICY"


@dataclass(frozen=True)
class CausalEvent:
    """One named event in a finite causal model, not a clock reading."""

    event_id: str
    process_id: str
    local_sequence: int

    def __post_init__(self) -> None:
        if not isinstance(self.event_id, str) or not self.event_id:
            raise ValueError("event_id must be a non-empty string")
        if not isinstance(self.process_id, str) or not self.process_id:
            raise ValueError("process_id must be a non-empty string")
        if not isinstance(self.local_sequence, int) or self.local_sequence < 1:
            raise ValueError("local_sequence must be a positive integer")


class CausalLedger:
    """Derive only a partial causal order from local and explicit edges.

    Events in one process receive order from their declared local sequence.
    Cross-process order exists only when the fixture provides a named
    send-to-receive edge. Wall-clock timestamps and shared trace IDs are
    deliberately absent: neither is causal evidence in this model.
    """

    claim_boundary = (
        "local sequences and explicit edges only; no wall-clock or trace-ID inference"
    )

    def __init__(
        self,
        events: tuple[CausalEvent, ...],
        *,
        send_receive_edges: tuple[tuple[str, str], ...] = (),
    ) -> None:
        if not events:
            raise ValueError("events must contain at least one CausalEvent")
        if any(not isinstance(event, CausalEvent) for event in events):
            raise TypeError("events must contain CausalEvent instances")
        self._events = {event.event_id: event for event in events}
        if len(self._events) != len(events):
            raise ValueError("event_id values must be unique")

        by_process: dict[str, list[CausalEvent]] = {}
        for event in events:
            by_process.setdefault(event.process_id, []).append(event)
        edges: dict[str, set[str]] = {event.event_id: set() for event in events}
        for process_events in by_process.values():
            ordered = sorted(process_events, key=lambda event: event.local_sequence)
            sequences = [event.local_sequence for event in ordered]
            if len(set(sequences)) != len(sequences):
                raise ValueError("local_sequence values must be unique within one process")
            for earlier, later in zip(ordered, ordered[1:]):
                edges[earlier.event_id].add(later.event_id)
        for edge in send_receive_edges:
            if not isinstance(edge, tuple) or len(edge) != 2:
                raise TypeError("send_receive_edges must contain (from_event, to_event) tuples")
            earlier, later = edge
            if earlier not in self._events or later not in self._events:
                raise ValueError("each causal edge must name declared events")
            if earlier == later:
                raise ValueError("a causal edge cannot point to itself")
            edges[earlier].add(later)
        self._edges = edges
        if any(self._reachable(event_id, event_id, require_edge=True) for event_id in edges):
            raise ValueError("causal edges must be acyclic")

    def _reachable(
        self,
        earlier_event_id: str,
        later_event_id: str,
        *,
        require_edge: bool = False,
    ) -> bool:
        pending = list(self._edges[earlier_event_id])
        visited: set[str] = set()
        while pending:
            current = pending.pop()
            if current == later_event_id:
                return True
            if current not in visited:
                visited.add(current)
                pending.extend(self._edges[current])
        return False

    def relation(self, first_event_id: str, second_event_id: str) -> str:
        """Classify only the causal relation established by declared edges."""
        if first_event_id not in self._events or second_event_id not in self._events:
            raise ValueError("relation requires declared event IDs")
        if first_event_id == second_event_id:
            return "SAME_EVENT"
        if self._reachable(first_event_id, second_event_id):
            return "HAPPENS_BEFORE"
        if self._reachable(second_event_id, first_event_id):
            return "HAPPENS_AFTER"
        return "INCOMPARABLE"


@dataclass(frozen=True)
class ReplicaClaimAssessment:
    """A scope-labelled assessment of what named replica observations support."""

    classification: str
    observed_replicas: tuple[str, ...]
    unobserved_replicas: tuple[str, ...]
    evidence_scope: str = "REPLICA_MODEL"
    non_claim: str = (
        "a named replica observation does not establish global agreement, durability, "
        "availability, or linearizability"
    )


def assess_replica_claim(
    *,
    expected_replicas: tuple[str, ...],
    observed_applied_replicas: tuple[str, ...],
) -> ReplicaClaimAssessment:
    """Keep a finite node observation below an unmodelled system-wide claim."""
    if (
        not expected_replicas
        or any(not isinstance(replica, str) or not replica for replica in expected_replicas)
        or len(set(expected_replicas)) != len(expected_replicas)
    ):
        raise ValueError("expected_replicas must be non-empty unique strings")
    if (
        any(not isinstance(replica, str) or not replica for replica in observed_applied_replicas)
        or len(set(observed_applied_replicas)) != len(observed_applied_replicas)
        or not set(observed_applied_replicas).issubset(expected_replicas)
    ):
        raise ValueError("observed replicas must be unique members of expected_replicas")
    unobserved = tuple(
        replica for replica in expected_replicas if replica not in observed_applied_replicas
    )
    classification = (
        "ALL_NAMED_REPLICAS_OBSERVED"
        if not unobserved
        else "REPLICA_OBSERVATION_ONLY"
    )
    return ReplicaClaimAssessment(
        classification=classification,
        observed_replicas=observed_applied_replicas,
        unobserved_replicas=unobserved,
    )


@dataclass(frozen=True)
class FrameReadObservation:
    """Outcome of a local in-memory `StreamReader.readexactly` fixture."""

    classification: str
    expected_bytes: int
    available_bytes: int
    evidence_scope: str = "ASYNC_STREAM_MODEL"
    non_claim: str = (
        "a local frame observation does not establish peer parse, acknowledgement, "
        "or commit"
    )


async def read_scripted_frame(
    *,
    chunks: tuple[bytes, ...],
    expected_bytes: int,
) -> FrameReadObservation:
    """Read one finite in-memory frame without opening a transport.

    This deliberately exercises the public `asyncio.StreamReader.readexactly`
    boundary using `feed_data`/`feed_eof`. It is neither a socket test nor an
    assertion about a peer. `StreamWriter.drain()` is intentionally absent: a
    drain is local write-buffer flow control, not a peer-parse/commit signal.
    """
    if not isinstance(expected_bytes, int) or expected_bytes < 1:
        raise ValueError("expected_bytes must be a positive integer")
    if any(not isinstance(chunk, bytes) for chunk in chunks):
        raise TypeError("chunks must contain bytes values")
    reader = asyncio.StreamReader()
    for chunk in chunks:
        reader.feed_data(chunk)
    reader.feed_eof()
    try:
        payload = await reader.readexactly(expected_bytes)
    except asyncio.IncompleteReadError as error:
        return FrameReadObservation(
            classification="FRAME_INCOMPLETE",
            expected_bytes=expected_bytes,
            available_bytes=len(error.partial),
        )
    return FrameReadObservation(
        classification="FRAME_COMPLETE",
        expected_bytes=expected_bytes,
        available_bytes=len(payload),
    )


class SyntheticTaskGroupFailure(RuntimeError):
    """A deliberate local child failure used only by the teaching probe."""


@dataclass(frozen=True)
class TaskGroupFailureProbe:
    """Evidence from one owned TaskGroup failure/cancellation trace."""

    trace: tuple[str, ...]
    evidence_scope: str = "PYTHON_TASKGROUP_MODEL"
    non_claim: str = (
        "a TaskGroup's local cancellation and cleanup does not establish remote rollback "
        "or an external effect"
    )


async def run_taskgroup_failure_probe() -> TaskGroupFailureProbe:
    """Expose one deterministic structured-failure boundary without a timer.

    The parent owns a sibling and a failing child. The sibling waits at an
    explicit cooperative `Event.wait()` boundary; the failing child raises a
    non-cancellation exception only after that wait is armed. Python's
    `TaskGroup` then cancels/waits for the sibling before the owner receives
    the exception group. This is evidence about the local scope only.
    """
    trace: list[str] = ["OWNER_ENTERED"]
    sibling_started = asyncio.Event()

    async def sibling() -> None:
        trace.append("SIBLING_STARTED")
        sibling_started.set()
        try:
            await asyncio.Event().wait()
        except asyncio.CancelledError:
            trace.append("SIBLING_CANCELLED_AND_CLEANED")
            raise

    async def failing_child() -> None:
        await sibling_started.wait()
        trace.append("FAILING_CHILD_RAISED")
        raise SyntheticTaskGroupFailure("scripted child failure")

    try:
        async with asyncio.TaskGroup() as group:
            group.create_task(sibling(), name="atlas-probe:sibling")
            group.create_task(failing_child(), name="atlas-probe:failing")
    except* SyntheticTaskGroupFailure:
        trace.append("OWNER_OBSERVED_EXCEPTION_GROUP")
    return TaskGroupFailureProbe(trace=tuple(trace))


def _cut_for_records(
    spec: RunSpec,
    records: tuple[SourceRecord, ...],
) -> CollectionCut:
    """Apply Atlas's explicit full/partial cut policy to named source records."""
    by_source = {record.source_id: record for record in records}
    ordered_records = tuple(by_source[source_id] for source_id in spec.source_ids)
    missing_sources = tuple(
        record.source_id
        for record in ordered_records
        if record.lifecycle != "COLLECTED"
    )
    if not missing_sources:
        classification = "FULL"
    elif spec.requires_full_cut:
        classification = "REJECTED_INCOMPLETE"
    else:
        classification = "PARTIAL_PERMITTED"
    return CollectionCut(
        run_id=spec.run_id,
        classification=classification,
        records=ordered_records,
        missing_sources=missing_sources,
    )


class ScriptedAsyncTransport:
    """A synthetic async adapter with explicit server-model and client seams.

    The adapter has no socket, DNS, HTTP, timer, or public service behavior.
    One `await asyncio.sleep(0)` only creates a visible cooperative suspension
    point for the local model; it is not a scheduler timing or fairness claim.
    """

    def __init__(
        self,
        ledger: SourceLedger,
        *,
        modes: Mapping[str, str] | None = None,
    ) -> None:
        if not isinstance(ledger, SourceLedger):
            raise TypeError("ledger must be a SourceLedger")
        self.ledger = ledger
        self._modes = dict(modes or {})
        self._in_flight = 0
        self.max_observed_in_flight = 0
        self.attempt_trace: list[tuple[str, str, int]] = []

    async def attempt(self, spec: RunSpec, request: SourceRequest) -> SourceResponse:
        """Attempt one source operation in a named, finite local scenario."""
        self._in_flight += 1
        self.max_observed_in_flight = max(
            self.max_observed_in_flight,
            self._in_flight,
        )
        self.attempt_trace.append((request.source_id, "ATTEMPTING", self._in_flight))
        try:
            await asyncio.sleep(0)
            mode = self._modes.get(request.source_id, "MATCHING_RESPONSE")
            if mode == "CONNECTION_ERROR_BEFORE_DECISION":
                raise LocalConnectionError("scripted connection error before server-model decision")
            record = self.ledger.apply(spec, request)
            if mode == "TIMEOUT_AFTER_DECISION":
                raise LocalTimeoutAfterDecision(
                    "scripted local timeout after server-model decision"
                )
            if mode == "CANCEL_AFTER_DECISION":
                raise asyncio.CancelledError(
                    "scripted local task cancellation after server-model decision"
                )
            if mode == "MISMATCHED_RESPONSE":
                return replace(
                    SourceResponse.from_record(record),
                    request_digest="sha256:mismatched-response",
                )
            if mode != "MATCHING_RESPONSE":
                raise ValueError(f"unknown scripted transport mode: {mode}")
            return SourceResponse.from_record(record)
        finally:
            self.attempt_trace.append((request.source_id, "ATTEMPT_FINISHED", self._in_flight))
            self._in_flight -= 1

    async def status_lookup(
        self,
        spec: RunSpec,
        request: SourceRequest,
    ) -> SourceResponse | None:
        """Return a matching server-model record only through declared lookup.

        This is a local model of a retained status record, not a live RPC,
        authenticated server, replica lookup, or durable distributed fact.
        """
        record = self.ledger.lookup(spec, request)
        if record is None:
            return None
        await asyncio.sleep(0)
        return SourceResponse.from_record(record)


class AtlasAsyncCollector:
    """Collect one declared source set through an owned bounded task group."""

    async def collect(
        self,
        spec: RunSpec,
        transport: ScriptedAsyncTransport,
    ) -> CollectionCut:
        """Return the cut permitted by one narrow Atlas collection policy."""
        if not isinstance(spec, RunSpec):
            raise TypeError("spec must be a RunSpec")
        if not isinstance(transport, ScriptedAsyncTransport):
            raise TypeError("transport must be a ScriptedAsyncTransport")

        gate = asyncio.Semaphore(spec.max_in_flight)
        records: dict[str, SourceRecord] = {}

        async def collect_one(source_id: str) -> None:
            request = make_source_request(
                run_id=spec.run_id,
                source_id=source_id,
                source_epoch=f"{source_id}-v1",
                api_version=spec.api_version,
            )
            async with gate:
                try:
                    response = await transport.attempt(spec, request)
                except LocalConnectionError:
                    records[source_id] = SourceRecord(
                        source_id=source_id,
                        operation_id=request.operation_id,
                        request_digest=request.request_digest,
                        source_epoch=request.source_epoch,
                        lifecycle="LOCAL_FAILURE_DEFINITE",
                        observation="CONNECTION_ERROR_BEFORE_DECISION",
                        evidence_scope="ASYNC_MODEL",
                    )
                    return
                except LocalTimeoutAfterDecision:
                    records[source_id] = SourceRecord(
                        source_id=source_id,
                        operation_id=request.operation_id,
                        request_digest=request.request_digest,
                        source_epoch=request.source_epoch,
                        lifecycle="UNKNOWN_REMOTE",
                        observation="LOCAL_TIMEOUT",
                        evidence_scope="CLIENT_TASK",
                        unknowns=(
                            "local timeout did not establish the remote source result",
                        ),
                    )
                    return
                except asyncio.CancelledError:
                    records[source_id] = SourceRecord(
                        source_id=source_id,
                        operation_id=request.operation_id,
                        request_digest=request.request_digest,
                        source_epoch=request.source_epoch,
                        lifecycle="CANCELLED_LOCAL",
                        observation="LOCAL_TASK_CANCEL_REQUESTED",
                        evidence_scope="CLIENT_TASK",
                        unknowns=(
                            "local cancellation did not establish whether the server-model decision was externally observed or rolled back",
                        ),
                    )
                    raise

            if (
                response.source_id != request.source_id
                or response.operation_id != request.operation_id
                or response.request_digest != request.request_digest
                or response.source_epoch != request.source_epoch
            ):
                records[source_id] = SourceRecord(
                    source_id=source_id,
                    operation_id=request.operation_id,
                    request_digest=request.request_digest,
                    source_epoch=request.source_epoch,
                    lifecycle="UNKNOWN_REMOTE",
                    observation="MISMATCHED_RESPONSE",
                    evidence_scope="CLIENT_RESPONSE",
                    unknowns=(
                        "response did not match the declared source operation",
                    ),
                )
                return

            records[source_id] = SourceRecord(
                source_id=source_id,
                operation_id=request.operation_id,
                request_digest=request.request_digest,
                source_epoch=request.source_epoch,
                lifecycle="COLLECTED",
                observation="MATCHING_RESPONSE",
                evidence_scope="CLIENT_RESPONSE",
            )

        async with asyncio.TaskGroup() as group:
            for source_id in spec.source_ids:
                group.create_task(collect_one(source_id), name=f"atlas-collect:{source_id}")

        return _cut_for_records(spec, tuple(records.values()))

    async def reconcile(
        self,
        spec: RunSpec,
        transport: ScriptedAsyncTransport,
        prior: SourceRecord,
    ) -> SourceRecord:
        """Use only a declared matching status lookup to refine one record.

        A no-match result remains an explicitly unresolved local model outcome;
        it is not evidence that a remote source effect did not occur.
        """
        if not isinstance(prior, SourceRecord):
            raise TypeError("prior must be a SourceRecord")
        request = SourceRequest(
            run_id=spec.run_id,
            source_id=prior.source_id,
            operation_id=prior.operation_id,
            request_digest=prior.request_digest,
            source_epoch=prior.source_epoch,
            api_version=spec.api_version,
        )
        response = await transport.status_lookup(spec, request)
        if (
            response is not None
            and response.source_id == request.source_id
            and response.operation_id == request.operation_id
            and response.request_digest == request.request_digest
            and response.source_epoch == request.source_epoch
        ):
            return SourceRecord(
                source_id=request.source_id,
                operation_id=request.operation_id,
                request_digest=request.request_digest,
                source_epoch=request.source_epoch,
                lifecycle="COLLECTED",
                observation="STATUS_LOOKUP",
                evidence_scope="STATUS_LOOKUP",
            )
        return SourceRecord(
            source_id=request.source_id,
            operation_id=request.operation_id,
            request_digest=request.request_digest,
            source_epoch=request.source_epoch,
            lifecycle="UNKNOWN_REMOTE",
            observation="STATUS_LOOKUP_NO_MATCH",
            evidence_scope="STATUS_LOOKUP",
            unknowns=(
                "status lookup did not produce a matching retained source decision",
            ),
        )


def _record_packet(record: SourceRecord) -> dict[str, object]:
    return {
        "source_id": record.source_id,
        "operation_id": record.operation_id,
        "request_digest": record.request_digest,
        "source_epoch": record.source_epoch,
        "lifecycle": record.lifecycle,
        "observation": record.observation,
        "evidence_scope": record.evidence_scope,
        "unknowns": list(record.unknowns),
    }


def _decision_packet(record: SourceDecisionRecord) -> dict[str, object]:
    return {
        "source_id": record.source_id,
        "operation_id": record.operation_id,
        "request_digest": record.request_digest,
        "source_epoch": record.source_epoch,
        "decision": record.decision,
        "replayed": record.replayed,
        "evidence_scope": record.evidence_scope,
    }


def _cut_packet(cut: CollectionCut) -> dict[str, object]:
    return {
        "classification": cut.classification,
        "missing_sources": list(cut.missing_sources),
        "evidence_scope": cut.evidence_scope,
    }


async def run_scenario(scenario: str) -> dict[str, object]:
    """Run one named local-only collector scenario and return an evidence packet.

    This is a deterministic teaching fixture. It does not run tests, create an
    externally reachable listener, resolve a host name, or contact a network.
    """
    modes_by_scenario: dict[str, Mapping[str, str]] = {
        "full_cut": {},
        "bound_two": {},
        "timeout_then_reconcile": {"catalog": "TIMEOUT_AFTER_DECISION"},
        "cancel_after_decision": {"catalog": "CANCEL_AFTER_DECISION"},
        "connection_error": {"progress": "CONNECTION_ERROR_BEFORE_DECISION"},
        "mismatched_response": {"exercises": "MISMATCHED_RESPONSE"},
        "incomplete_cut": {"progress": "CONNECTION_ERROR_BEFORE_DECISION"},
        "same_id_conflict": {},
        "order_claim": {},
        "stream_incomplete": {},
    }
    if scenario not in modes_by_scenario:
        raise ValueError(f"unknown scenario: {scenario}")

    spec = RunSpec(
        run_id="run-2026-07-30-a",
        source_ids=("catalog", "exercises", "progress"),
        max_in_flight=2,
        requires_full_cut=True,
    )
    transport = ScriptedAsyncTransport(
        SourceLedger(),
        modes=modes_by_scenario[scenario],
    )
    collector = AtlasAsyncCollector()
    initial_cut = await collector.collect(spec, transport)
    reconciliation: SourceRecord | None = None
    final_cut = initial_cut
    scenario_observations: dict[str, object] = {}

    if scenario == "timeout_then_reconcile":
        prior = next(
            record for record in initial_cut.records if record.source_id == "catalog"
        )
        reconciliation = await collector.reconcile(spec, transport, prior)
        final_records = tuple(
            reconciliation if record.source_id == reconciliation.source_id else record
            for record in initial_cut.records
        )
        final_cut = _cut_for_records(spec, final_records)

    if scenario == "same_id_conflict":
        changed_meaning = make_source_request(
            run_id=spec.run_id,
            source_id="catalog",
            source_epoch="catalog-v2",
            api_version=spec.api_version,
        )
        try:
            transport.ledger.apply(spec, changed_meaning)
        except IdempotencyConflict:
            scenario_observations["same_id_conflict"] = {
                "classification": "IDEMPOTENCY_CONFLICT",
                "operation_id": changed_meaning.operation_id,
                "changed_request_digest": changed_meaning.request_digest,
                "ledger_record_count": transport.ledger.record_count,
                "evidence_scope": "SERVER_MODEL",
                "non_claim": "one finite ledger conflict is not a universal idempotency guarantee",
            }
        else:
            raise AssertionError("same operation ID with changed meaning must conflict")

    if scenario == "order_claim":
        causal = CausalLedger(
            (
                CausalEvent("catalog-send", "catalog", 1),
                CausalEvent("catalog-receive", "collector", 1),
                CausalEvent("progress-local", "progress", 1),
            ),
            send_receive_edges=(("catalog-send", "catalog-receive"),),
        )
        replica = assess_replica_claim(
            expected_replicas=("node-a", "node-b"),
            observed_applied_replicas=("node-a",),
        )
        scenario_observations["causal_order"] = {
            "catalog_send_to_receive": causal.relation(
                "catalog-send", "catalog-receive"
            ),
            "receive_to_progress": causal.relation(
                "catalog-receive", "progress-local"
            ),
            "claim_boundary": causal.claim_boundary,
            "evidence_scope": "DISTRIBUTED_MODEL",
        }
        scenario_observations["replica_observation"] = {
            "classification": replica.classification,
            "observed_replicas": list(replica.observed_replicas),
            "unobserved_replicas": list(replica.unobserved_replicas),
            "evidence_scope": replica.evidence_scope,
            "non_claim": replica.non_claim,
        }

    if scenario == "stream_incomplete":
        frame = await read_scripted_frame(
            chunks=(b"AT", b"L"),
            expected_bytes=4,
        )
        scenario_observations["stream_frame"] = {
            "classification": frame.classification,
            "expected_bytes": frame.expected_bytes,
            "available_bytes": frame.available_bytes,
            "evidence_scope": frame.evidence_scope,
            "non_claim": frame.non_claim,
        }

    initial_unknowns = [
        unknown
        for record in initial_cut.records
        for unknown in record.unknowns
    ]
    final_unknowns = [
        unknown
        for record in final_cut.records
        for unknown in record.unknowns
    ]
    return {
        "schema_version": EVIDENCE_SCHEMA_VERSION,
        "model_version": MODEL_VERSION,
        "scenario": scenario,
        "command": f"python module21_reference.py --scenario {scenario}",
        "runtime": {
            "implementation": sys.implementation.name,
            "python": ".".join(str(part) for part in sys.version_info[:3]),
        },
        "run": {
            "run_id": spec.run_id,
            "source_ids": list(spec.source_ids),
        },
        "policy": {
            "max_in_flight": spec.max_in_flight,
            "requires_full_cut": spec.requires_full_cut,
        },
        "trace_context": {
            "trace_id": "0123456789abcdef0123456789abcdef",
            "evidence_scope": "ASYNC_MODEL_CORRELATION",
            "claim_boundary": "correlates declared local model observations only",
        },
        "redaction": {
            "raw_payloads": "OMITTED",
            "credentials": "OMITTED",
            "external_endpoints": "OMITTED",
            "environment_values": "OMITTED",
        },
        "limitations": [
            "synthetic single-owner asyncio model",
            "not a distributed-system proof",
            "trace correlation does not establish delivery, causality, durability, or trust",
            "no real endpoint, peer, replica, payload, or credential was contacted or recorded",
        ],
        "task_trace": [_record_packet(record) for record in initial_cut.records],
        "attempt_trace": [
            {
                "source_id": source_id,
                "phase": phase,
                "in_flight": in_flight,
                "evidence_scope": "ASYNC_MODEL",
            }
            for source_id, phase, in_flight in transport.attempt_trace
        ],
        "server_model": [_decision_packet(record) for record in transport.ledger.records],
        "initial_collection_cut": _cut_packet(initial_cut),
        "reconciliation": _record_packet(reconciliation)
        if reconciliation is not None
        else None,
        "collection_cut": _cut_packet(final_cut),
        "unknowns_after_initial_attempt": initial_unknowns,
        "unknowns_after_reconciliation": final_unknowns,
        "scenario_observations": scenario_observations,
        "tests": {"executed_by_scenario": False, "status": "NOT_RUN"},
    }


def render_evidence_packet(packet: Mapping[str, object]) -> str:
    """Render one deterministic, inspectable evidence packet as JSON."""
    return json.dumps(packet, ensure_ascii=True, indent=2, sort_keys=True)


def main(argv: list[str] | None = None) -> int:
    """Run one named synthetic scenario from the local command line."""
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--scenario",
        choices=(
            "full_cut",
            "bound_two",
            "timeout_then_reconcile",
            "cancel_after_decision",
            "connection_error",
            "mismatched_response",
            "incomplete_cut",
            "same_id_conflict",
            "order_claim",
            "stream_incomplete",
        ),
        default="full_cut",
    )
    args = parser.parse_args(argv)
    print(render_evidence_packet(asyncio.run(run_scenario(args.scenario))))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
