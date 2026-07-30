"""Module 19: bounded concurrency and parallelism evidence reference.

The reference separates exhaustive teaching models from runtime observations.
It never treats one observed thread schedule, task completion, or elapsed time
as proof that all legal interleavings are safe.
"""

from __future__ import annotations

from collections import Counter
from collections.abc import Mapping, Sequence
import concurrent.futures
from dataclasses import asdict, dataclass, field, is_dataclass
import hashlib
from itertools import combinations
import json
import math
import multiprocessing
import os
from pathlib import Path
import platform
import re
import sys
import sysconfig


@dataclass(frozen=True, slots=True)
class ScheduleExploration:
    """Complete result for the declared two-worker increment model."""

    schedule_count: int
    final_value_counts: dict[int, int]
    sequential_schedules: tuple[tuple[str, ...], ...]
    safety_property: str


@dataclass(frozen=True, slots=True)
class LockedScheduleExploration:
    """Complete state-space result for the declared locked increment model."""

    schedule_count: int
    final_value_counts: dict[int, int]
    violating_schedules: tuple[tuple[str, ...], ...]
    linearization_events: tuple[str, ...]
    safety_property: str


@dataclass(frozen=True, slots=True)
class LockOrderAnalysis:
    """Static result for a declared set of nested lock acquisitions."""

    order_edges: tuple[tuple[str, str], ...]
    cycle: tuple[str, ...]
    deadlock_possible: bool
    global_order_satisfied: bool


@dataclass(frozen=True, slots=True)
class ExecutorWaitAnalysis:
    """Bounded dependency-graph evidence for executor self-waits."""

    wait_edges: tuple[tuple[str, str], ...]
    cycle: tuple[str, ...]
    blocked_pending_tasks: tuple[str, ...]
    deadlock_possible: bool
    capacity_deadlock_possible: bool
    scope: str


IDENTIFIER_PATTERN = re.compile(r"[a-z][a-z0-9-]{0,31}\Z")
TOKEN_PATTERN = re.compile(r"[A-Za-z][A-Za-z0-9-]*")
INPUT_SCHEMA = "atlas.concurrent-index-input.v1"
PARTIAL_SCHEMA = "atlas.concurrent-index-partial.v1"
SNAPSHOT_SCHEMA = "atlas.concurrent-inverted-index.v1"


class AccountingError(ValueError):
    """Admitted work and terminal worker contributions do not match exactly."""


class WorkTransitionError(ValueError):
    """A work item attempted an impossible or ambiguous lifecycle transition."""


class OracleMismatchError(RuntimeError):
    """A reducer result disagreed with the independent sequential oracle."""


class ExecutorStartupError(RuntimeError):
    """An executor failed before any Atlas partition was admitted."""

    def __init__(self, *, error_type: str, message_sha256: str) -> None:
        self.error_type = error_type
        self.message_sha256 = message_sha256
        super().__init__(
            "executor startup failed before admission "
            f"({error_type}, message_sha256={message_sha256})"
        )


@dataclass(frozen=True, slots=True)
class WorkTransition:
    """One supervisor-observed state change for an admitted work item."""

    doc_id: str
    before: str
    after: str


@dataclass(frozen=True, slots=True)
class WorkLedger:
    """Immutable lifecycle evidence owned by the supervisor."""

    states: tuple[tuple[str, str], ...]
    transitions: tuple[WorkTransition, ...]

    def __post_init__(self) -> None:
        _validate_work_ledger_contents(self.states, self.transitions)


@dataclass(frozen=True, slots=True)
class TerminalLedgerReport:
    """Proof that every admission has exactly one terminal classification."""

    terminal_by_id: tuple[tuple[str, str], ...]
    counts: tuple[tuple[str, int], ...]
    exactly_once: bool


@dataclass(frozen=True, slots=True)
class Partition:
    """Immutable, digest-bound unit of Atlas input."""

    partition_id: str
    document_ids: tuple[str, ...]
    documents_digest: str

    def __post_init__(self) -> None:
        if IDENTIFIER_PATTERN.fullmatch(self.partition_id) is None:
            raise ValueError(
                "partition_id must be a bounded lowercase identifier"
            )
        if type(self.document_ids) is not tuple:
            raise TypeError("document_ids must be an immutable tuple")
        if not self.document_ids:
            raise ValueError("a partition must contain at least one document")
        if any(
            not isinstance(doc_id, str)
            or IDENTIFIER_PATTERN.fullmatch(doc_id) is None
            for doc_id in self.document_ids
        ):
            raise ValueError(
                "document_ids must be bounded lowercase identifiers"
            )
        if tuple(sorted(set(self.document_ids))) != self.document_ids:
            raise ValueError("document_ids must be unique and sorted")
        _require_sha256(self.documents_digest, "documents_digest")


@dataclass(frozen=True, slots=True)
class PartialIndex:
    """One immutable worker result, bound to its exact input partition."""

    partition_id: str
    documents_digest: str
    postings: tuple[tuple[str, tuple[str, ...]], ...]
    partial_digest: str = field(init=False)

    def __post_init__(self) -> None:
        if IDENTIFIER_PATTERN.fullmatch(self.partition_id) is None:
            raise ValueError(
                "partition_id must be a bounded lowercase identifier"
            )
        _require_sha256(self.documents_digest, "documents_digest")
        if type(self.postings) is not tuple:
            raise TypeError("postings must be an immutable tuple")
        previous = ""
        for entry in self.postings:
            if type(entry) is not tuple or len(entry) != 2:
                raise TypeError(
                    "each posting must be an immutable "
                    "(term, document_ids) tuple"
                )
            token, document_ids = entry
            if (
                not isinstance(token, str)
                or IDENTIFIER_PATTERN.fullmatch(token) is None
            ):
                raise ValueError("tokens must be bounded lowercase identifiers")
            if token <= previous:
                raise ValueError("postings must have unique sorted terms")
            if type(document_ids) is not tuple:
                raise TypeError(
                    "posting document IDs must be an immutable tuple"
                )
            if not document_ids:
                raise ValueError("a posting list cannot be empty")
            if any(
                not isinstance(doc_id, str)
                or IDENTIFIER_PATTERN.fullmatch(doc_id) is None
                for doc_id in document_ids
            ):
                raise ValueError(
                    "posting document IDs must be bounded identifiers"
                )
            if tuple(sorted(set(document_ids))) != document_ids:
                raise ValueError(
                    "posting document IDs must be unique and sorted"
                )
            previous = token
        payload = _canonical_json_bytes(
            {
                "schema": PARTIAL_SCHEMA,
                "partition_id": self.partition_id,
                "documents_digest": self.documents_digest,
                "postings": {
                    term: list(document_ids)
                    for term, document_ids in self.postings
                },
            }
        )
        object.__setattr__(
            self,
            "partial_digest",
            hashlib.sha256(payload).hexdigest(),
        )


# Compatibility name for the earlier design draft. The canonical type is
# PartialIndex because one partition may contain more than one document.
DocumentContribution = PartialIndex


@dataclass(frozen=True, slots=True)
class WorkerOutcome:
    """Picklable proof that the worker callable actually began."""

    partition_id: str
    partial: PartialIndex | None
    error_type: str | None
    message_sha256: str | None

    def __post_init__(self) -> None:
        if IDENTIFIER_PATTERN.fullmatch(self.partition_id) is None:
            raise ValueError("invalid worker-outcome partition_id")
        success = self.partial is not None
        failure = self.error_type is not None or self.message_sha256 is not None
        if success == failure:
            raise ValueError(
                "worker outcome must contain exactly one success or failure"
            )
        if success:
            assert self.partial is not None
            if self.partial.partition_id != self.partition_id:
                raise ValueError(
                    "worker partial does not match outcome partition"
                )
        else:
            if not self.error_type or len(self.error_type) > 128:
                raise ValueError("worker error_type must be bounded")
            assert self.message_sha256 is not None
            _require_sha256(self.message_sha256, "message_sha256")


@dataclass(frozen=True, slots=True)
class IndexSnapshot:
    """Canonical aggregate that can be handed back to Module 18 for publication."""

    document_ids: tuple[str, ...]
    postings: tuple[tuple[str, tuple[str, ...]], ...]
    canonical_bytes: bytes
    sha256: str

    def __post_init__(self) -> None:
        if type(self.document_ids) is not tuple:
            raise TypeError("document_ids must be an immutable tuple")
        if not self.document_ids or any(
            not isinstance(doc_id, str)
            or IDENTIFIER_PATTERN.fullmatch(doc_id) is None
            for doc_id in self.document_ids
        ):
            raise ValueError(
                "snapshot document_ids must be nonempty bounded identifiers"
            )
        if tuple(sorted(set(self.document_ids))) != self.document_ids:
            raise ValueError("snapshot document_ids must be unique and sorted")
        if type(self.postings) is not tuple:
            raise TypeError("snapshot postings must be an immutable tuple")
        previous = ""
        for entry in self.postings:
            if type(entry) is not tuple or len(entry) != 2:
                raise TypeError(
                    "snapshot postings must contain immutable term/IDs tuples"
                )
            term, document_ids = entry
            if (
                not isinstance(term, str)
                or IDENTIFIER_PATTERN.fullmatch(term) is None
                or term <= previous
            ):
                raise ValueError(
                    "snapshot terms must be bounded, unique, and sorted"
                )
            if (
                type(document_ids) is not tuple
                or not document_ids
                or tuple(sorted(set(document_ids))) != document_ids
            ):
                raise ValueError(
                    "snapshot posting IDs must be nonempty, unique, and sorted"
                )
            if not set(document_ids).issubset(self.document_ids):
                raise ValueError(
                    "snapshot postings must name admitted documents"
                )
            previous = term
        if not isinstance(self.canonical_bytes, bytes):
            raise TypeError("canonical_bytes must be bytes")
        _require_sha256(self.sha256, "sha256")
        if hashlib.sha256(self.canonical_bytes).hexdigest() != self.sha256:
            raise ValueError("sha256 does not match canonical_bytes")
        expected_bytes = _canonical_json_bytes(
            {
                "schema": SNAPSHOT_SCHEMA,
                "document_ids": list(self.document_ids),
                "postings": {
                    term: list(document_ids)
                    for term, document_ids in self.postings
                },
            }
        )
        if self.canonical_bytes != expected_bytes:
            raise ValueError(
                "canonical_bytes do not encode the declared snapshot fields"
            )


@dataclass(frozen=True, slots=True)
class FailureEvidence:
    """Privacy-safe structured cause retained for one terminal failure."""

    partition_id: str
    phase: str
    error_type: str
    message_sha256: str

    def __post_init__(self) -> None:
        if IDENTIFIER_PATTERN.fullmatch(self.partition_id) is None:
            raise ValueError("invalid failure partition_id")
        if self.phase not in {
            "SUBMISSION",
            "DISPATCH",
            "WORKER",
            "REDUCTION",
        }:
            raise ValueError("invalid failure phase")
        if not self.error_type or len(self.error_type) > 128:
            raise ValueError("error_type must be a bounded nonempty name")
        _require_sha256(self.message_sha256, "message_sha256")


@dataclass(frozen=True, slots=True)
class FutureObservation:
    """One ordered supervisor observation at the Future boundary."""

    sequence: int
    partition_id: str
    event: str


@dataclass(frozen=True, slots=True)
class CancellationAttempt:
    """One actual Future.cancel() request and its documented result."""

    partition_id: str
    trigger: str
    succeeded: bool


@dataclass(frozen=True, slots=True)
class CompletionWaitEvidence:
    """Observation-timeout evidence followed by owned-worker drainage."""

    timeout_seconds: float
    wait_timed_out: bool
    unfinished_ids_at_timeout: tuple[str, ...]
    cancellation_attempts: tuple[CancellationAttempt, ...]
    drain_completed: bool
    return_may_follow_timeout: bool


@dataclass(frozen=True, slots=True)
class IndexRunReport:
    """Supervisor evidence from one bounded executor run."""

    executor: str
    max_workers: int
    ledger: TerminalLedgerReport
    work_transitions: tuple[WorkTransition, ...]
    future_observations: tuple[FutureObservation, ...]
    observed_completion_order: tuple[str, ...]
    commit_order: tuple[str, ...]
    contributions: tuple[PartialIndex, ...]
    errors: tuple[FailureEvidence, ...]
    cancellation_causes: tuple[tuple[str, str], ...]
    completion_wait: CompletionWaitEvidence
    oracle_digest: str
    candidate_digest: str | None
    oracle_match: bool | None
    candidate_snapshot: IndexSnapshot | None
    publication_allowed: bool
    process_start_method: str | None
    process_context_source: str | None


@dataclass(frozen=True, slots=True)
class RuntimeConcurrencyProfile:
    """Public, non-identifying facts about this Python runtime."""

    executable: str
    implementation: str
    implementation_version: str
    python_version: str
    python_runtime: str
    platform_system: str
    platform_release: str
    platform_machine: str
    cpu_count: int | None
    build_configuration: tuple[tuple[str, str], ...]
    build_supports_free_threading: bool | None
    gil_enabled: bool | None
    executor_types: tuple[str, ...]
    reference_adapter_types: tuple[str, ...]
    unvalidated_executor_types: tuple[str, ...]
    command: tuple[str, ...]


@dataclass(frozen=True, slots=True)
class WorkloadProfile:
    """Facts that constrain, but do not benchmark, an execution-model choice."""

    dominant_work: str
    gil_enabled: bool | None
    native_code_releases_gil: bool
    payload_picklable: bool
    isolation_acceptable: bool
    free_threaded_extensions_audited: bool
    interpreter_pool_available: bool
    interpreter_pool_validated: bool = False

    def __post_init__(self) -> None:
        if self.dominant_work not in {
            "blocking-io",
            "python-cpu",
            "native-cpu",
        }:
            raise ValueError(
                "dominant_work must be blocking-io, python-cpu, or native-cpu"
            )
        if self.gil_enabled is not None and not isinstance(
            self.gil_enabled,
            bool,
        ):
            raise TypeError("gil_enabled must be a boolean or None")
        for field_name in (
            "native_code_releases_gil",
            "payload_picklable",
            "isolation_acceptable",
            "free_threaded_extensions_audited",
            "interpreter_pool_available",
            "interpreter_pool_validated",
        ):
            if not isinstance(getattr(self, field_name), bool):
                raise TypeError(f"{field_name} must be a boolean")
        if (
            self.interpreter_pool_validated
            and not self.interpreter_pool_available
        ):
            raise ValueError(
                "an interpreter pool cannot be validated when unavailable"
            )


@dataclass(frozen=True, slots=True)
class ExecutionModelChoice:
    """A falsifiable starting hypothesis, never a speedup promise."""

    primary_model: str
    ranked_candidates: tuple[str, ...]
    rationale: str
    measurement_required: bool


def choose_execution_model(profile: WorkloadProfile) -> ExecutionModelChoice:
    """Rank bounded executor models from declared workload evidence."""

    if not isinstance(profile, WorkloadProfile):
        raise TypeError("profile must be a WorkloadProfile")

    if profile.dominant_work == "blocking-io":
        return ExecutionModelChoice(
            primary_model="thread",
            ranked_candidates=("thread",),
            rationale=(
                "threads overlap blocking waits with low sharing and "
                "serialization overhead; bound concurrency and measure"
            ),
            measurement_required=True,
        )

    if (
        profile.dominant_work == "native-cpu"
        and profile.native_code_releases_gil
    ):
        return ExecutionModelChoice(
            primary_model="thread",
            ranked_candidates=("thread",),
            rationale=(
                "documented native code releases the GIL, so bounded threads "
                "are a candidate; verify extension safety and measure"
            ),
            measurement_required=True,
        )

    isolated_candidates: list[str] = []
    if profile.payload_picklable and profile.isolation_acceptable:
        isolated_candidates.append("process")
        if (
            profile.interpreter_pool_available
            and profile.interpreter_pool_validated
        ):
            isolated_candidates.append("interpreter")

    if (
        profile.gil_enabled is False
        and profile.free_threaded_extensions_audited
    ):
        return ExecutionModelChoice(
            primary_model="thread",
            ranked_candidates=("thread", *isolated_candidates),
            rationale=(
                "the live runtime has the GIL disabled and extensions were "
                "audited; explicit synchronization and measurement remain required"
            ),
            measurement_required=True,
        )

    if isolated_candidates:
        if profile.gil_enabled is True:
            if profile.dominant_work == "native-cpu":
                gil_boundary = (
                    "native CPU work that does not release the GIL needs an "
                    "isolation boundary for multicore execution"
                )
            else:
                gil_boundary = (
                    "GIL-enabled pure-Python CPU work needs an isolation "
                    "boundary for multicore execution"
                )
        elif profile.gil_enabled is False:
            gil_boundary = (
                "the live GIL is disabled, but extensions are not audited; "
                "an isolation boundary avoids claiming thread safety"
            )
        else:
            gil_boundary = (
                "the live GIL state is unknown, so an isolation boundary "
                "avoids assuming thread parallelism or safety"
            )
        return ExecutionModelChoice(
            primary_model=isolated_candidates[0],
            ranked_candidates=tuple(isolated_candidates),
            rationale=(
                f"{gil_boundary}; serialization and startup costs must "
                "be measured"
            ),
            measurement_required=True,
        )

    return ExecutionModelChoice(
        primary_model="redesign",
        ranked_candidates=(),
        rationale=(
            (
                "the live GIL is disabled but extensions are not audited, "
                "and the payload or state contract excludes isolated workers"
            )
            if profile.gil_enabled is False
            else (
                "the live GIL state is unknown and the payload or state "
                "contract excludes isolated workers"
            )
            if profile.gil_enabled is None
            else (
                "the workload evidence excludes safe thread parallelism and "
                "the payload or state contract excludes isolated workers"
            )
        ),
        measurement_required=True,
    )


@dataclass(frozen=True, slots=True)
class ParallelismBudget:
    """Analytic ceilings; never a substitute for measured workload evidence."""

    max_parallelism: float
    work_span_speedup_ceiling: float
    amdahl_speedup_ceiling: float
    combined_speedup_ceiling: float
    lower_bound_time_units: float
    measurement_required: bool


class QueueProtocolError(ValueError):
    """A declared bounded-queue trace violates its ownership protocol."""


@dataclass(frozen=True, slots=True)
class QueueProtocolState:
    """One state in a deterministic bounded-queue teaching trace."""

    operation_index: int
    buffer: tuple[str, ...]
    claimed_not_acknowledged: tuple[str, ...]
    unfinished_tasks: int
    blocked_predicate: str | None


@dataclass(frozen=True, slots=True)
class QueueProtocolReport:
    """Trace evidence for capacity and unfinished-task predicates."""

    final_buffer: tuple[str, ...]
    claimed_not_acknowledged: tuple[str, ...]
    acknowledged: tuple[str, ...]
    unfinished_tasks: int
    join_ready: bool
    blocked_actions: tuple[tuple[str, str, str, str], ...]
    trace: tuple[QueueProtocolState, ...]


class SemaphoreProtocolError(ValueError):
    """A declared semaphore trace violates permit accounting."""


@dataclass(frozen=True, slots=True)
class SemaphoreProtocolReport:
    """Permit evidence that deliberately carries no queue-item semantics."""

    initial_permits: int
    available_permits: int
    holders: tuple[str, ...]
    blocked_acquires: tuple[tuple[str, str], ...]
    balanced: bool
    transfers_items: bool


@dataclass(frozen=True, slots=True)
class ConditionWaitReport:
    """Outcome of an `if`-once or predicate-loop condition protocol."""

    strategy: str
    wait_count: int
    entered_critical_section: bool
    predicate_when_entered: bool | None
    invariant_preserved: bool


@dataclass(frozen=True, slots=True)
class StopActionOutcome:
    """Semantic classification of a wait, cancel, drain, or hard stop."""

    action: str
    initial_state: str
    resulting_state: str
    request_succeeded: bool
    work_may_continue: bool
    cleanup_path_preserved: bool


def classify_stop_action(*, action: str, task_state: str) -> StopActionOutcome:
    """Keep caller waiting, task cancellation, and termination distinct."""

    if task_state not in {"PENDING", "RUNNING", "FINISHED"}:
        raise ValueError("task_state must be PENDING, RUNNING, or FINISHED")
    if action == "wait-timeout":
        return StopActionOutcome(
            action=action,
            initial_state=task_state,
            resulting_state=task_state,
            request_succeeded=False,
            work_may_continue=task_state in {"PENDING", "RUNNING"},
            cleanup_path_preserved=True,
        )
    if action == "future-cancel":
        succeeded = task_state == "PENDING"
        return StopActionOutcome(
            action=action,
            initial_state=task_state,
            resulting_state=(
                "CANCELLED" if succeeded else task_state
            ),
            request_succeeded=succeeded,
            work_may_continue=task_state == "RUNNING",
            cleanup_path_preserved=True,
        )
    if action == "cooperative-request":
        requestable = task_state in {"PENDING", "RUNNING"}
        return StopActionOutcome(
            action=action,
            initial_state=task_state,
            resulting_state=(
                "STOP_REQUESTED" if requestable else task_state
            ),
            request_succeeded=requestable,
            work_may_continue=requestable,
            cleanup_path_preserved=True,
        )
    if action == "graceful-drain":
        draining = task_state in {"PENDING", "RUNNING"}
        return StopActionOutcome(
            action=action,
            initial_state=task_state,
            resulting_state="DRAINING" if draining else task_state,
            request_succeeded=draining,
            work_may_continue=draining,
            cleanup_path_preserved=True,
        )
    if action == "hard-terminate":
        terminable = task_state in {"PENDING", "RUNNING"}
        return StopActionOutcome(
            action=action,
            initial_state=task_state,
            resulting_state="TERMINATED" if terminable else task_state,
            request_succeeded=terminable,
            work_may_continue=False,
            cleanup_path_preserved=False,
        )
    raise ValueError(
        "action must be wait-timeout, future-cancel, cooperative-request, "
        "graceful-drain, or hard-terminate"
    )


def evaluate_condition_wait(
    *,
    predicate_observations: Sequence[bool],
    strategy: str,
) -> ConditionWaitReport:
    """Model predicate observations at entry and after each wake."""

    observations = tuple(predicate_observations)
    if not observations or any(
        not isinstance(value, bool) for value in observations
    ):
        raise ValueError("predicate_observations must be non-empty booleans")
    if strategy not in {"if-once", "while"}:
        raise ValueError("strategy must be 'if-once' or 'while'")

    if observations[0]:
        wait_count = 0
        predicate_at_entry: bool | None = True
    elif strategy == "if-once":
        wait_count = 1
        predicate_at_entry = observations[1] if len(observations) > 1 else None
    else:
        predicate_at_entry = None
        wait_count = 0
        for index, predicate in enumerate(observations):
            if predicate:
                wait_count = index
                predicate_at_entry = True
                break
        else:
            wait_count = len(observations)

    entered = predicate_at_entry is not None
    return ConditionWaitReport(
        strategy=strategy,
        wait_count=wait_count,
        entered_critical_section=entered,
        predicate_when_entered=predicate_at_entry,
        invariant_preserved=not entered or predicate_at_entry is True,
    )


def simulate_bounded_queue_protocol(
    *,
    capacity: int,
    operations: Sequence[tuple[str, str, str]],
) -> QueueProtocolReport:
    """Execute a declared queue trace without timing or real worker races."""

    if (
        isinstance(capacity, bool)
        or not isinstance(capacity, int)
        or not 1 <= capacity <= 16
    ):
        raise ValueError("capacity must be an integer from 1 through 16")
    if isinstance(operations, (str, bytes)) or not isinstance(
        operations,
        Sequence,
    ):
        raise TypeError("operations must be a sequence")
    if len(operations) > 128:
        raise ValueError("at most 128 queue operations may be modeled")

    buffer: list[str] = []
    claimed: set[str] = set()
    acknowledged: set[str] = set()
    admitted: set[str] = set()
    blocked: list[tuple[str, str, str, str]] = []
    trace: list[QueueProtocolState] = []
    unfinished = 0

    for index, operation in enumerate(operations):
        if not isinstance(operation, tuple) or len(operation) != 3:
            raise QueueProtocolError(
                "each operation must be an (actor, action, item) tuple"
            )
        actor, action, item = operation
        if not isinstance(actor, str) or not actor:
            raise QueueProtocolError("queue actors must be named")
        if (
            not isinstance(item, str)
            or IDENTIFIER_PATTERN.fullmatch(item) is None
        ):
            raise QueueProtocolError("queue items must be bounded identifiers")
        blocked_predicate: str | None = None

        if action == "PUT":
            if item in admitted:
                raise QueueProtocolError("one item cannot be put twice")
            if len(buffer) >= capacity:
                blocked_predicate = "queue-not-full"
                blocked.append((actor, action, item, blocked_predicate))
            else:
                buffer.append(item)
                admitted.add(item)
                unfinished += 1
        elif action == "GET":
            if not buffer:
                blocked_predicate = "queue-not-empty"
                blocked.append((actor, action, item, blocked_predicate))
            elif buffer[0] != item:
                raise QueueProtocolError(
                    f"declared GET expected {item}, but FIFO head is {buffer[0]}"
                )
            else:
                buffer.pop(0)
                claimed.add(item)
        elif action == "TASK_DONE":
            if item not in claimed:
                raise QueueProtocolError(
                    "TASK_DONE requires one prior successful GET"
                )
            claimed.remove(item)
            acknowledged.add(item)
            unfinished -= 1
        else:
            raise QueueProtocolError(f"unknown queue action: {action}")

        trace.append(
            QueueProtocolState(
                operation_index=index,
                buffer=tuple(buffer),
                claimed_not_acknowledged=tuple(sorted(claimed)),
                unfinished_tasks=unfinished,
                blocked_predicate=blocked_predicate,
            )
        )

    return QueueProtocolReport(
        final_buffer=tuple(buffer),
        claimed_not_acknowledged=tuple(sorted(claimed)),
        acknowledged=tuple(sorted(acknowledged)),
        unfinished_tasks=unfinished,
        join_ready=unfinished == 0,
        blocked_actions=tuple(blocked),
        trace=tuple(trace),
    )


def simulate_semaphore_protocol(
    *,
    permits: int,
    operations: Sequence[tuple[str, str]],
) -> SemaphoreProtocolReport:
    """Execute a pure permit trace without inventing queue ownership."""

    if (
        isinstance(permits, bool)
        or not isinstance(permits, int)
        or not 1 <= permits <= 16
    ):
        raise ValueError("permits must be an integer from 1 through 16")
    if isinstance(operations, (str, bytes)) or not isinstance(
        operations,
        Sequence,
    ):
        raise TypeError("operations must be a sequence")
    if len(operations) > 128:
        raise ValueError("at most 128 semaphore operations may be modeled")

    available = permits
    holders: set[str] = set()
    blocked: list[tuple[str, str]] = []
    for operation in operations:
        if type(operation) is not tuple or len(operation) != 2:
            raise SemaphoreProtocolError(
                "each operation must be an (actor, action) tuple"
            )
        actor, action = operation
        if not isinstance(actor, str) or not actor:
            raise SemaphoreProtocolError("semaphore actors must be named")
        if action == "ACQUIRE":
            if actor in holders:
                raise SemaphoreProtocolError(
                    "this teaching semaphore permits one held permit per actor"
                )
            if available == 0:
                blocked.append((actor, "no-permit"))
            else:
                available -= 1
                holders.add(actor)
        elif action == "RELEASE":
            if actor not in holders:
                raise SemaphoreProtocolError(
                    "RELEASE requires one successful held permit"
                )
            holders.remove(actor)
            available += 1
        else:
            raise SemaphoreProtocolError(
                f"unknown semaphore action: {action}"
            )
    return SemaphoreProtocolReport(
        initial_permits=permits,
        available_permits=available,
        holders=tuple(sorted(holders)),
        blocked_acquires=tuple(blocked),
        balanced=available == permits and not holders,
        transfers_items=False,
    )


def parallelism_budget(
    *,
    work_units: float,
    span_units: float,
    workers: int,
    serial_fraction: float,
) -> ParallelismBudget:
    """Calculate work/span and Amdahl ceilings for a declared model."""

    numeric_values = (work_units, span_units, serial_fraction)
    if any(
        isinstance(value, bool)
        or not isinstance(value, (int, float))
        or not math.isfinite(value)
        for value in numeric_values
    ):
        raise ValueError("work, span, and serial fraction must be finite numbers")
    if work_units <= 0 or span_units <= 0 or span_units > work_units:
        raise ValueError("require 0 < span_units <= work_units")
    if isinstance(workers, bool) or not isinstance(workers, int) or workers <= 0:
        raise ValueError("workers must be a positive integer")
    if not 0 <= serial_fraction <= 1:
        raise ValueError("serial_fraction must be between zero and one")

    max_parallelism = float(work_units / span_units)
    work_span_ceiling = min(float(workers), max_parallelism)
    amdahl_ceiling = 1.0 / (
        float(serial_fraction)
        + (1.0 - float(serial_fraction)) / float(workers)
    )
    return ParallelismBudget(
        max_parallelism=max_parallelism,
        work_span_speedup_ceiling=work_span_ceiling,
        amdahl_speedup_ceiling=amdahl_ceiling,
        combined_speedup_ceiling=min(work_span_ceiling, amdahl_ceiling),
        lower_bound_time_units=max(
            float(work_units) / float(workers),
            float(span_units),
        ),
        measurement_required=True,
    )


def _path_safe_command(arguments: Sequence[object]) -> tuple[str, ...]:
    """Preserve exact arguments while reducing executable/script paths to basenames."""

    safe: list[str] = []
    for argument in arguments:
        text = str(argument)
        candidate = Path(text)
        safe.append(candidate.name if candidate.is_absolute() else text)
    return tuple(safe)


def runtime_concurrency_profile(
    *,
    command: Sequence[object] | None = None,
) -> RuntimeConcurrencyProfile:
    """Keep build capability, live GIL state, and executor APIs distinct."""

    build_flag = sysconfig.get_config_var("Py_GIL_DISABLED")
    debug_flag = sysconfig.get_config_var("Py_DEBUG")
    gil_probe = getattr(sys, "_is_gil_enabled", None)
    executor_types = ["thread", "process"]
    if hasattr(concurrent.futures, "InterpreterPoolExecutor"):
        executor_types.append("interpreter")
    version = sys.implementation.version
    implementation_version = (
        f"{version.major}.{version.minor}.{version.micro}"
        f"-{version.releaselevel}.{version.serial}"
    )
    command_source = (
        command
        if command is not None
        else getattr(sys, "orig_argv", tuple(sys.argv))
    )
    return RuntimeConcurrencyProfile(
        executable=Path(sys.executable).name,
        implementation=sys.implementation.name,
        implementation_version=implementation_version,
        python_version=sys.version.split()[0],
        python_runtime=" ".join(sys.version.split()),
        platform_system=platform.system(),
        platform_release=platform.release(),
        platform_machine=platform.machine(),
        cpu_count=os.cpu_count(),
        build_configuration=(
            (
                "Py_GIL_DISABLED",
                "unavailable" if build_flag is None else str(int(bool(build_flag))),
            ),
            (
                "Py_DEBUG",
                "unavailable" if debug_flag is None else str(int(bool(debug_flag))),
            ),
            ("ABIFLAGS", getattr(sys, "abiflags", "") or "none"),
            ("COMPILER", platform.python_compiler() or "unknown"),
        ),
        build_supports_free_threading=(
            None if build_flag is None else bool(build_flag)
        ),
        gil_enabled=None if gil_probe is None else bool(gil_probe()),
        executor_types=tuple(executor_types),
        reference_adapter_types=("thread", "process"),
        unvalidated_executor_types=(
            ("interpreter",)
            if "interpreter" in executor_types
            else ()
        ),
        command=_path_safe_command(command_source),
    )


def _validated_documents(
    documents: Mapping[str, str],
) -> tuple[tuple[str, str], ...]:
    if not isinstance(documents, Mapping) or not documents:
        raise ValueError("documents must be a non-empty mapping")
    if len(documents) > 32:
        raise ValueError("at most 32 documents may be indexed in one teaching run")
    raw = tuple(documents.items())
    if any(
        not isinstance(doc_id, str)
        or IDENTIFIER_PATTERN.fullmatch(doc_id) is None
        for doc_id, _ in raw
    ):
        raise ValueError(
            "document IDs must be bounded lowercase identifiers"
        )
    if len({doc_id for doc_id, _ in raw}) != len(raw):
        raise ValueError("document IDs must be unique")
    ordered = tuple(sorted(raw))
    if any(not isinstance(text, str) for _, text in ordered):
        raise TypeError("every document body must be a string")
    if any(len(text) > 100_000 for _, text in ordered):
        raise ValueError("document bodies may contain at most 100,000 characters")
    return ordered


def _documents_digest(documents: Sequence[tuple[str, str]]) -> str:
    payload = _canonical_json_bytes(
        {
            "schema": INPUT_SCHEMA,
            "documents": [
                {"document_id": doc_id, "text": text}
                for doc_id, text in documents
            ],
        }
    )
    return hashlib.sha256(payload).hexdigest()


def make_document_partition(doc_id: str, text: str) -> Partition:
    """Bind one synthetic document to a deterministic immutable partition."""

    ordered = _validated_documents({doc_id: text})
    return Partition(
        partition_id=doc_id,
        document_ids=(doc_id,),
        documents_digest=_documents_digest(ordered),
    )


def index_partition(
    partition: Partition,
    documents: Mapping[str, str],
) -> PartialIndex:
    """Build canonical local postings without executor or shared state."""

    if not isinstance(partition, Partition):
        raise TypeError("partition must be a Partition")
    ordered = _validated_documents(documents)
    if tuple(doc_id for doc_id, _ in ordered) != partition.document_ids:
        raise AccountingError(
            "partition documents do not match its declared document IDs"
        )
    if _documents_digest(ordered) != partition.documents_digest:
        raise AccountingError(
            "partition documents do not match its input digest"
        )
    postings: dict[str, set[str]] = {}
    for doc_id, text in ordered:
        tokens = {
            match.group(0).lower()
            for match in TOKEN_PATTERN.finditer(text)
        }
        if any(len(token) > 32 for token in tokens):
            raise ValueError("tokens may contain at most 32 characters")
        for token in tokens:
            postings.setdefault(token, set()).add(doc_id)
    return PartialIndex(
        partition_id=partition.partition_id,
        documents_digest=partition.documents_digest,
        postings=tuple(
            (term, tuple(sorted(document_ids)))
            for term, document_ids in sorted(postings.items())
        ),
    )


def index_document(doc_id: str, text: str) -> PartialIndex:
    """Convenience seam for one pure, immutable document partition."""

    partition = make_document_partition(doc_id, text)
    return index_partition(partition, {doc_id: text})


def _index_document_task(
    partition: Partition,
    text: str,
    should_fail: bool,
) -> WorkerOutcome:
    try:
        if should_fail:
            raise RuntimeError(
                f"injected worker failure for {partition.partition_id}"
            )
        partial = index_partition(
            partition,
            {partition.document_ids[0]: text},
        )
    except Exception as error:
        return WorkerOutcome(
            partition_id=partition.partition_id,
            partial=None,
            error_type=type(error).__name__,
            message_sha256=hashlib.sha256(
                str(error).encode("utf-8", errors="replace")
            ).hexdigest(),
        )
    return WorkerOutcome(
        partition_id=partition.partition_id,
        partial=partial,
        error_type=None,
        message_sha256=None,
    )


def run_indexer(
    *,
    documents: Mapping[str, str],
    executor: str,
    max_workers: int,
    timeout_seconds: float,
    fail_ids: Sequence[str] = (),
    cancel_before_start_ids: Sequence[str] = (),
) -> IndexRunReport:
    """Run pure workers under an observation timeout, then drain ownership.

    ``timeout_seconds`` bounds the first completion wait, not this function's
    wall-clock duration. If that observation times out, the report records the
    unfinished set and every real ``Future.cancel()`` result. Running work is
    then drained because Python threads cannot be safely forced to stop and the
    coordinator must not abandon owned workers.
    """

    ordered_documents = _validated_documents(documents)
    if executor not in {"thread", "process"}:
        raise ValueError("executor must be 'thread' or 'process'")
    if (
        isinstance(max_workers, bool)
        or not isinstance(max_workers, int)
        or not 1 <= max_workers <= 4
    ):
        raise ValueError("max_workers must be an integer from 1 through 4")
    if (
        isinstance(timeout_seconds, bool)
        or not isinstance(timeout_seconds, (int, float))
        or not math.isfinite(timeout_seconds)
        or not 0 < timeout_seconds <= 30
    ):
        raise ValueError("timeout_seconds must be finite and in (0, 30]")

    partitions = tuple(
        make_document_partition(doc_id, text)
        for doc_id, text in ordered_documents
    )
    partition_by_id = {
        partition.partition_id: partition
        for partition in partitions
    }
    text_by_id = dict(ordered_documents)
    admitted = set(partition_by_id)
    failures = tuple(fail_ids)
    cancellations = tuple(cancel_before_start_ids)
    if len(set(failures)) != len(failures):
        raise AccountingError("fail_ids contains a duplicate")
    if len(set(cancellations)) != len(cancellations):
        raise AccountingError("cancel_before_start_ids contains a duplicate")
    if not set(failures).issubset(admitted):
        raise AccountingError("fail_ids contains work that was not admitted")
    if not set(cancellations).issubset(admitted):
        raise AccountingError(
            "cancel_before_start_ids contains work that was not admitted"
        )
    if set(failures) & set(cancellations):
        raise AccountingError("work cannot be both failed and cancelled")

    oracle = sequential_index_oracle(dict(ordered_documents))
    executor_type = (
        concurrent.futures.ThreadPoolExecutor
        if executor == "thread"
        else concurrent.futures.ProcessPoolExecutor
    )
    process_start_method: str | None = None
    process_context_source: str | None = None
    try:
        if executor == "process":
            process_context = multiprocessing.get_context()
            process_start_method = process_context.get_start_method()
            process_context_source = "runtime-default"
            pool = executor_type(
                max_workers=max_workers,
                mp_context=process_context,
            )
        else:
            pool = executor_type(max_workers=max_workers)
    except Exception as error:
        raise ExecutorStartupError(
            error_type=type(error).__name__,
            message_sha256=hashlib.sha256(
                str(error).encode("utf-8", errors="replace")
            ).hexdigest(),
        ) from None

    ledger = create_work_ledger(
        tuple(partition.partition_id for partition in partitions)
    )
    cancellation_causes: list[tuple[str, str]] = []
    for partition_id in sorted(cancellations):
        ledger = advance_work(ledger, partition_id, "CANCELLED")
        cancellation_causes.append(
            (partition_id, "cancelled-before-submission-policy")
        )

    future_to_id: dict[
        concurrent.futures.Future[WorkerOutcome],
        str,
    ] = {}
    contributions: list[PartialIndex] = []
    errors: list[FailureEvidence] = []
    completion_order: list[str] = []
    observations: list[FutureObservation] = []
    cancellation_attempts: list[CancellationAttempt] = []
    wait_timed_out = False
    unfinished_ids_at_timeout: tuple[str, ...] = ()
    drain_completed = False

    def observe(partition_id: str, event: str) -> None:
        observations.append(
            FutureObservation(
                sequence=len(observations) + 1,
                partition_id=partition_id,
                event=event,
            )
        )

    def failure_evidence(
        partition_id: str,
        phase: str,
        error: BaseException,
    ) -> FailureEvidence:
        return FailureEvidence(
            partition_id=partition_id,
            phase=phase,
            error_type=type(error).__name__,
            message_sha256=hashlib.sha256(
                str(error).encode("utf-8", errors="replace")
            ).hexdigest(),
        )

    try:
        submission_failed = False
        for partition in partitions:
            partition_id = partition.partition_id
            if partition_id in cancellations:
                continue
            if submission_failed:
                error = RuntimeError(
                    "submission skipped after an earlier executor rejection"
                )
                ledger = advance_work(ledger, partition_id, "FAILED")
                errors.append(
                    failure_evidence(partition_id, "SUBMISSION", error)
                )
                observe(partition_id, "SUBMISSION_SKIPPED")
                continue
            try:
                future = pool.submit(
                    _index_document_task,
                    partition,
                    text_by_id[partition_id],
                    partition_id in failures,
                )
            except Exception as error:
                submission_failed = True
                ledger = advance_work(ledger, partition_id, "FAILED")
                errors.append(
                    failure_evidence(partition_id, "SUBMISSION", error)
                )
                observe(partition_id, "SUBMISSION_FAILED")
                continue
            ledger = advance_work(ledger, partition_id, "ENQUEUED")
            future_to_id[future] = partition_id
            observe(partition_id, "SUBMITTED")

        pending = set(future_to_id)

        def account(
            future: concurrent.futures.Future[WorkerOutcome],
        ) -> None:
            nonlocal ledger
            partition_id = future_to_id[future]
            if future.cancelled():
                ledger = advance_work(
                    ledger,
                    partition_id,
                    "CANCELLED",
                )
                cancellation_causes.append(
                    (partition_id, "future-cancel-succeeded")
                )
                observe(partition_id, "CANCELLED")
                return
            completion_order.append(partition_id)
            try:
                outcome = future.result()
                if not isinstance(outcome, WorkerOutcome):
                    raise TypeError(
                        "Future returned no valid worker-entry envelope"
                    )
                if outcome.partition_id != partition_id:
                    raise AccountingError(
                        "worker outcome partition ID does not match submission"
                    )
            except Exception as error:
                ledger = advance_work(
                    ledger,
                    partition_id,
                    "FAILED",
                )
                errors.append(
                    failure_evidence(partition_id, "DISPATCH", error)
                )
                observe(partition_id, "DISPATCH_EXCEPTION")
            else:
                ledger = advance_work(ledger, partition_id, "CLAIMED")
                observe(partition_id, "WORKER_ENTERED")
                if outcome.partial is None:
                    assert outcome.error_type is not None
                    assert outcome.message_sha256 is not None
                    ledger = advance_work(ledger, partition_id, "FAILED")
                    errors.append(
                        FailureEvidence(
                            partition_id=partition_id,
                            phase="WORKER",
                            error_type=outcome.error_type,
                            message_sha256=outcome.message_sha256,
                        )
                    )
                    observe(partition_id, "EXCEPTION")
                else:
                    contributions.append(outcome.partial)
                    ledger = advance_work(
                        ledger,
                        partition_id,
                        "PARTIAL_READY",
                    )
                    observe(partition_id, "RESULT")

        try:
            for future in concurrent.futures.as_completed(
                tuple(future_to_id),
                timeout=float(timeout_seconds),
            ):
                pending.remove(future)
                account(future)
        except TimeoutError:
            wait_timed_out = True
            unfinished_ids_at_timeout = tuple(
                sorted(future_to_id[future] for future in pending)
            )
            for partition_id in unfinished_ids_at_timeout:
                observe(partition_id, "WAIT_TIMEOUT")
            for future in sorted(
                tuple(pending),
                key=lambda item: future_to_id[item],
            ):
                partition_id = future_to_id[future]
                succeeded = future.cancel()
                cancellation_attempts.append(
                    CancellationAttempt(
                        partition_id=partition_id,
                        trigger="observation-timeout",
                        succeeded=succeeded,
                    )
                )
                observe(
                    partition_id,
                    (
                        "CANCEL_ATTEMPT_SUCCEEDED"
                        if succeeded
                        else "CANCEL_ATTEMPT_REFUSED"
                    ),
                )
                if succeeded:
                    pending.remove(future)
                    account(future)
            for future in concurrent.futures.as_completed(tuple(pending)):
                pending.remove(future)
                account(future)
    finally:
        pool.shutdown(wait=True, cancel_futures=True)
        drain_completed = True

    ordered_contributions = tuple(
        sorted(contributions, key=lambda item: item.partition_id)
    )
    commit_order: list[str] = []
    reducer_snapshot: IndexSnapshot | None = None
    reduction_mismatch = False
    if ordered_contributions:
        ready_ids = tuple(
            contribution.partition_id
            for contribution in ordered_contributions
        )
        ready_partitions = tuple(
            partition_by_id[partition_id]
            for partition_id in ready_ids
        )
        for partition_id in ready_ids:
            ledger = advance_work(
                ledger,
                partition_id,
                "COMMIT_STARTED",
            )
        try:
            reducer_snapshot = fold_contributions(
                partitions=ready_partitions,
                contributions=ordered_contributions,
            )
            subset_oracle = sequential_index_oracle(
                {
                    partition_id: text_by_id[partition_id]
                    for partition_id in ready_ids
                }
            )
            if (
                reducer_snapshot.sha256 != subset_oracle.sha256
                or reducer_snapshot.canonical_bytes
                != subset_oracle.canonical_bytes
            ):
                raise OracleMismatchError(
                    "reducer digest disagrees with the sequential oracle"
                )
        except Exception as error:
            reduction_mismatch = isinstance(error, OracleMismatchError)
            reducer_snapshot = None
            for partition_id in ready_ids:
                ledger = advance_work(ledger, partition_id, "FAILED")
                errors.append(
                    failure_evidence(partition_id, "REDUCTION", error)
                )
        else:
            for partition_id in ready_ids:
                ledger = advance_work(ledger, partition_id, "COMMITTED")
                commit_order.append(partition_id)

    terminal = terminal_ledger_report(ledger)
    all_committed = all(
        state == "COMMITTED" for _, state in terminal.terminal_by_id
    )
    oracle_match: bool | None
    candidate: IndexSnapshot | None
    if all_committed and reducer_snapshot is not None:
        oracle_match = (
            reducer_snapshot.sha256 == oracle.sha256
            and reducer_snapshot.canonical_bytes == oracle.canonical_bytes
        )
        candidate = reducer_snapshot if oracle_match else None
    elif reduction_mismatch:
        oracle_match = False
        candidate = None
    else:
        oracle_match = None
        candidate = None
    return IndexRunReport(
        executor=executor,
        max_workers=max_workers,
        ledger=terminal,
        work_transitions=ledger.transitions,
        future_observations=tuple(observations),
        observed_completion_order=tuple(completion_order),
        commit_order=tuple(commit_order),
        contributions=ordered_contributions,
        errors=tuple(
            sorted(
                errors,
                key=lambda item: (
                    item.partition_id,
                    item.phase,
                    item.error_type,
                ),
            )
        ),
        cancellation_causes=tuple(sorted(cancellation_causes)),
        completion_wait=CompletionWaitEvidence(
            timeout_seconds=float(timeout_seconds),
            wait_timed_out=wait_timed_out,
            unfinished_ids_at_timeout=unfinished_ids_at_timeout,
            cancellation_attempts=tuple(cancellation_attempts),
            drain_completed=drain_completed,
            return_may_follow_timeout=wait_timed_out,
        ),
        oracle_digest=oracle.sha256,
        candidate_digest=None if candidate is None else candidate.sha256,
        oracle_match=oracle_match,
        candidate_snapshot=candidate,
        publication_allowed=(
            candidate is not None
            and oracle_match is True
            and all_committed
        ),
        process_start_method=process_start_method,
        process_context_source=process_context_source,
    )


WORK_TRANSITIONS = {
    "ADMITTED": frozenset({"ENQUEUED", "FAILED", "CANCELLED"}),
    "ENQUEUED": frozenset({"CLAIMED", "FAILED", "CANCELLED"}),
    "CLAIMED": frozenset({"PARTIAL_READY", "FAILED"}),
    "PARTIAL_READY": frozenset({"COMMIT_STARTED", "FAILED"}),
    "COMMIT_STARTED": frozenset({"COMMITTED", "FAILED"}),
    "COMMITTED": frozenset(),
    "FAILED": frozenset(),
    "CANCELLED": frozenset(),
}
TERMINAL_WORK_STATES = frozenset({"COMMITTED", "FAILED", "CANCELLED"})


def _validate_work_ledger_contents(
    states: tuple[tuple[str, str], ...],
    transitions: tuple[WorkTransition, ...],
) -> None:
    """Replay an immutable ledger so exactly-once evidence cannot be forged."""

    if type(states) is not tuple or type(transitions) is not tuple:
        raise AccountingError("ledger states and transitions must be tuples")
    if not states:
        raise AccountingError("a work ledger must contain admitted work")
    parsed: list[tuple[str, str]] = []
    for row in states:
        if type(row) is not tuple or len(row) != 2:
            raise AccountingError("each ledger state must be an ID/state tuple")
        doc_id, state = row
        if (
            not isinstance(doc_id, str)
            or IDENTIFIER_PATTERN.fullmatch(doc_id) is None
        ):
            raise AccountingError("ledger IDs must be bounded identifiers")
        if state not in WORK_TRANSITIONS:
            raise AccountingError(f"unknown ledger state: {state}")
        parsed.append((doc_id, state))
    identifiers = tuple(doc_id for doc_id, _ in parsed)
    if len(set(identifiers)) != len(identifiers):
        raise AccountingError("ledger contains a duplicate work ID")
    if tuple(sorted(parsed)) != states:
        raise AccountingError("ledger states must be sorted by work ID")

    replay = {doc_id: "ADMITTED" for doc_id in identifiers}
    for transition in transitions:
        if not isinstance(transition, WorkTransition):
            raise AccountingError(
                "ledger transitions must be WorkTransition values"
            )
        if transition.doc_id not in replay:
            raise AccountingError(
                "ledger transition names work that was not admitted"
            )
        current = replay[transition.doc_id]
        if transition.before != current:
            raise AccountingError(
                "ledger transition history is not replay-consistent"
            )
        if transition.after not in WORK_TRANSITIONS[current]:
            raise AccountingError(
                f"illegal ledger transition: {current} -> {transition.after}"
            )
        replay[transition.doc_id] = transition.after
    if tuple(sorted(replay.items())) != states:
        raise AccountingError(
            "ledger states do not equal replayed transition history"
        )


def create_work_ledger(admitted_ids: Sequence[str]) -> WorkLedger:
    """Admit a bounded, unique set of work IDs into an immutable ledger."""

    admitted = tuple(admitted_ids)
    if not admitted:
        raise AccountingError("at least one work item must be admitted")
    if len(admitted) > 256:
        raise AccountingError("at most 256 work items may be admitted")
    if any(
        not isinstance(doc_id, str)
        or IDENTIFIER_PATTERN.fullmatch(doc_id) is None
        for doc_id in admitted
    ):
        raise AccountingError("admitted IDs must be bounded lowercase identifiers")
    if len(set(admitted)) != len(admitted):
        raise AccountingError("admitted work contains a duplicate ID")
    return WorkLedger(
        states=tuple((doc_id, "ADMITTED") for doc_id in sorted(admitted)),
        transitions=(),
    )


def advance_work(ledger: WorkLedger, doc_id: str, after: str) -> WorkLedger:
    """Return a new ledger after one legal supervisor-observed transition."""

    if not isinstance(ledger, WorkLedger):
        raise TypeError("ledger must be a WorkLedger")
    if after not in WORK_TRANSITIONS:
        raise WorkTransitionError(f"unknown work state: {after}")
    states = dict(ledger.states)
    if doc_id not in states:
        raise WorkTransitionError(f"work item was not admitted: {doc_id}")
    before = states[doc_id]
    if after not in WORK_TRANSITIONS[before]:
        raise WorkTransitionError(f"illegal work transition: {before} -> {after}")
    states[doc_id] = after
    return WorkLedger(
        states=tuple(sorted(states.items())),
        transitions=(
            *ledger.transitions,
            WorkTransition(doc_id=doc_id, before=before, after=after),
        ),
    )


def terminal_ledger_report(ledger: WorkLedger) -> TerminalLedgerReport:
    """Require and summarize one terminal state for every admitted item."""

    if not isinstance(ledger, WorkLedger):
        raise TypeError("ledger must be a WorkLedger")
    _validate_work_ledger_contents(ledger.states, ledger.transitions)
    nonterminal = tuple(
        doc_id for doc_id, state in ledger.states if state not in TERMINAL_WORK_STATES
    )
    if nonterminal:
        raise AccountingError(
            "work ledger is not terminal for: " + ", ".join(nonterminal)
        )
    counts = Counter(state for _, state in ledger.states)
    return TerminalLedgerReport(
        terminal_by_id=ledger.states,
        counts=tuple(sorted(counts.items())),
        exactly_once=True,
    )


def _require_sha256(value: str, field_name: str) -> None:
    if (
        not isinstance(value, str)
        or len(value) != 64
        or any(character not in "0123456789abcdef" for character in value)
    ):
        raise ValueError(f"{field_name} must be a lowercase SHA-256 hex digest")


def _canonical_json_bytes(value: object) -> bytes:
    return (
        json.dumps(
            value,
            ensure_ascii=True,
            sort_keys=True,
            separators=(",", ":"),
            allow_nan=False,
        ).encode("utf-8")
        + b"\n"
    )


def _increment_schedule(worker_a_positions: tuple[int, ...]) -> tuple[str, ...]:
    labels = {"A": ("READ", "ADD", "WRITE"), "B": ("READ", "ADD", "WRITE")}
    positions = set(worker_a_positions)
    progress = {"A": 0, "B": 0}
    schedule: list[str] = []
    for index in range(6):
        worker = "A" if index in positions else "B"
        action = labels[worker][progress[worker]]
        progress[worker] += 1
        schedule.append(f"{worker}:{action}")
    return tuple(schedule)


def _run_increment_schedule(schedule: tuple[str, ...], initial_value: int) -> int:
    shared = initial_value
    registers: dict[str, int | None] = {"A": None, "B": None}
    for event in schedule:
        worker, action = event.split(":", maxsplit=1)
        if action == "READ":
            registers[worker] = shared
        elif action == "ADD":
            value = registers[worker]
            if value is None:
                raise ValueError("ADD requires a prior READ")
            registers[worker] = value + 1
        elif action == "WRITE":
            value = registers[worker]
            if value is None:
                raise ValueError("WRITE requires a prior READ")
            shared = value
        else:
            raise ValueError(f"unknown schedule action: {action}")
    return shared


def explore_two_increment_schedules(*, initial_value: int) -> ScheduleExploration:
    """Enumerate every merge that preserves each worker's program order."""

    if isinstance(initial_value, bool) or not isinstance(initial_value, int):
        raise TypeError("initial_value must be an integer")

    schedules = tuple(
        _increment_schedule(worker_a_positions)
        for worker_a_positions in combinations(range(6), 3)
    )
    final_counts = Counter(
        _run_increment_schedule(schedule, initial_value) for schedule in schedules
    )
    sequential = tuple(
        schedule
        for schedule in schedules
        if schedule
        in {
            (
                "A:READ",
                "A:ADD",
                "A:WRITE",
                "B:READ",
                "B:ADD",
                "B:WRITE",
            ),
            (
                "B:READ",
                "B:ADD",
                "B:WRITE",
                "A:READ",
                "A:ADD",
                "A:WRITE",
            ),
        }
    )
    return ScheduleExploration(
        schedule_count=len(schedules),
        final_value_counts=dict(sorted(final_counts.items())),
        sequential_schedules=sequential,
        safety_property=f"final shared value equals {initial_value + 2}",
    )


def explore_locked_increment_schedules(
    *,
    initial_value: int,
) -> LockedScheduleExploration:
    """Explore every enabled transition when both workers share one lock."""

    if isinstance(initial_value, bool) or not isinstance(initial_value, int):
        raise TypeError("initial_value must be an integer")

    actions = ("ACQUIRE", "READ", "ADD", "WRITE", "RELEASE")
    completed: list[tuple[tuple[str, ...], int]] = []

    def visit(
        shared: int,
        progress_a: int,
        progress_b: int,
        register_a: int | None,
        register_b: int | None,
        lock_owner: str | None,
        schedule: tuple[str, ...],
    ) -> None:
        if progress_a == len(actions) and progress_b == len(actions):
            completed.append((schedule, shared))
            return

        for worker in ("A", "B"):
            progress = progress_a if worker == "A" else progress_b
            register = register_a if worker == "A" else register_b
            if progress == len(actions):
                continue
            action = actions[progress]
            if action == "ACQUIRE" and lock_owner is not None:
                continue
            if action != "ACQUIRE" and lock_owner != worker:
                continue

            next_shared = shared
            next_register = register
            next_owner = lock_owner
            if action == "ACQUIRE":
                next_owner = worker
            elif action == "READ":
                next_register = shared
            elif action == "ADD":
                assert register is not None
                next_register = register + 1
            elif action == "WRITE":
                assert register is not None
                next_shared = register
            elif action == "RELEASE":
                next_owner = None

            visit(
                next_shared,
                progress + 1 if worker == "A" else progress_a,
                progress + 1 if worker == "B" else progress_b,
                next_register if worker == "A" else register_a,
                next_register if worker == "B" else register_b,
                next_owner,
                (*schedule, f"{worker}:{action}"),
            )

    visit(initial_value, 0, 0, None, None, None, ())
    expected = initial_value + 2
    final_counts = Counter(final for _, final in completed)
    return LockedScheduleExploration(
        schedule_count=len(completed),
        final_value_counts=dict(sorted(final_counts.items())),
        violating_schedules=tuple(
            schedule for schedule, final in completed if final != expected
        ),
        linearization_events=("A:WRITE", "B:WRITE"),
        safety_property=f"final shared value equals {expected}",
    )


def explore_narrow_locked_increment_schedules(
    *,
    initial_value: int,
) -> LockedScheduleExploration:
    """Show why protecting only WRITE does not protect read-modify-write."""

    if isinstance(initial_value, bool) or not isinstance(initial_value, int):
        raise TypeError("initial_value must be an integer")

    actions = ("READ", "ADD", "ACQUIRE", "WRITE", "RELEASE")
    completed: list[tuple[tuple[str, ...], int]] = []

    def visit(
        shared: int,
        progress_a: int,
        progress_b: int,
        register_a: int | None,
        register_b: int | None,
        lock_owner: str | None,
        schedule: tuple[str, ...],
    ) -> None:
        if progress_a == len(actions) and progress_b == len(actions):
            completed.append((schedule, shared))
            return
        for worker in ("A", "B"):
            progress = progress_a if worker == "A" else progress_b
            register = register_a if worker == "A" else register_b
            if progress == len(actions):
                continue
            action = actions[progress]
            if action == "ACQUIRE" and lock_owner is not None:
                continue
            if action in {"WRITE", "RELEASE"} and lock_owner != worker:
                continue

            next_shared = shared
            next_register = register
            next_owner = lock_owner
            if action == "READ":
                next_register = shared
            elif action == "ADD":
                assert register is not None
                next_register = register + 1
            elif action == "ACQUIRE":
                next_owner = worker
            elif action == "WRITE":
                assert register is not None
                next_shared = register
            elif action == "RELEASE":
                next_owner = None

            visit(
                next_shared,
                progress + 1 if worker == "A" else progress_a,
                progress + 1 if worker == "B" else progress_b,
                next_register if worker == "A" else register_a,
                next_register if worker == "B" else register_b,
                next_owner,
                (*schedule, f"{worker}:{action}"),
            )

    visit(initial_value, 0, 0, None, None, None, ())
    expected = initial_value + 2
    final_counts = Counter(final for _, final in completed)
    return LockedScheduleExploration(
        schedule_count=len(completed),
        final_value_counts=dict(sorted(final_counts.items())),
        violating_schedules=tuple(
            schedule for schedule, final in completed if final != expected
        ),
        linearization_events=(),
        safety_property=f"final shared value equals {expected}",
    )


def analyze_lock_orders(
    acquisitions: Mapping[str, Sequence[str]],
) -> LockOrderAnalysis:
    """Find a cycle in the declared lock-order constraints, if one exists."""

    if not isinstance(acquisitions, Mapping) or not acquisitions:
        raise ValueError("acquisitions must be a non-empty mapping")
    edges: set[tuple[str, str]] = set()
    nodes: set[str] = set()
    for worker, order in acquisitions.items():
        if not isinstance(worker, str) or not worker:
            raise ValueError("worker names must be non-empty strings")
        if isinstance(order, (str, bytes)) or not isinstance(order, Sequence):
            raise TypeError("each acquisition order must be a sequence of locks")
        locks = tuple(order)
        if any(not isinstance(lock, str) or not lock for lock in locks):
            raise ValueError("lock names must be non-empty strings")
        if len(set(locks)) != len(locks):
            raise ValueError("one worker cannot acquire the same primitive twice")
        nodes.update(locks)
        for earlier_index, earlier in enumerate(locks):
            for later in locks[earlier_index + 1 :]:
                edges.add((earlier, later))

    adjacency = {
        node: tuple(sorted(target for source, target in edges if source == node))
        for node in sorted(nodes)
    }
    visiting: set[str] = set()
    visited: set[str] = set()
    path: list[str] = []

    def find_cycle(node: str) -> tuple[str, ...]:
        visiting.add(node)
        path.append(node)
        for target in adjacency[node]:
            if target in visiting:
                start = path.index(target)
                return (*path[start:], target)
            if target not in visited:
                found = find_cycle(target)
                if found:
                    return found
        path.pop()
        visiting.remove(node)
        visited.add(node)
        return ()

    cycle: tuple[str, ...] = ()
    for node in sorted(nodes):
        if node not in visited:
            cycle = find_cycle(node)
            if cycle:
                break

    return LockOrderAnalysis(
        order_edges=tuple(sorted(edges)),
        cycle=cycle,
        deadlock_possible=bool(cycle),
        global_order_satisfied=not cycle,
    )


def analyze_executor_waits(
    *,
    wait_edges: Sequence[tuple[str, str]],
    running_tasks: Sequence[str],
    worker_capacity: int,
) -> ExecutorWaitAnalysis:
    """Analyze a finite Future-wait graph and one capacity snapshot."""

    if (
        isinstance(worker_capacity, bool)
        or not isinstance(worker_capacity, int)
        or not 1 <= worker_capacity <= 32
    ):
        raise ValueError("worker_capacity must be an integer from 1 through 32")
    running = tuple(running_tasks)
    if (
        len(set(running)) != len(running)
        or any(
            not isinstance(task, str)
            or IDENTIFIER_PATTERN.fullmatch(task) is None
            for task in running
        )
    ):
        raise ValueError("running_tasks must be unique bounded identifiers")
    edges: set[tuple[str, str]] = set()
    for edge in wait_edges:
        if type(edge) is not tuple or len(edge) != 2:
            raise ValueError("each wait edge must be a (waiter, target) tuple")
        waiter, target = edge
        if any(
            not isinstance(task, str)
            or IDENTIFIER_PATTERN.fullmatch(task) is None
            for task in edge
        ):
            raise ValueError("wait edges must use bounded identifiers")
        edges.add((waiter, target))
    ordered_edges = tuple(sorted(edges))
    nodes = set(running)
    nodes.update(source for source, _ in ordered_edges)
    nodes.update(target for _, target in ordered_edges)
    adjacency = {
        node: tuple(
            sorted(target for source, target in ordered_edges if source == node)
        )
        for node in sorted(nodes)
    }
    visiting: set[str] = set()
    visited: set[str] = set()
    path: list[str] = []

    def find_cycle(node: str) -> tuple[str, ...]:
        visiting.add(node)
        path.append(node)
        for target in adjacency[node]:
            if target in visiting:
                start = path.index(target)
                return (*path[start:], target)
            if target not in visited:
                found = find_cycle(target)
                if found:
                    return found
        path.pop()
        visiting.remove(node)
        visited.add(node)
        return ()

    cycle: tuple[str, ...] = ()
    for node in sorted(nodes):
        if node not in visited:
            cycle = find_cycle(node)
            if cycle:
                break

    running_set = set(running)
    pending_targets = tuple(
        sorted(
            {
                target
                for source, target in ordered_edges
                if source in running_set and target not in running_set
            }
        )
    )
    all_running_wait = bool(running) and all(
        any(source == task for source, _ in ordered_edges)
        for task in running
    )
    capacity_deadlock = (
        len(running) >= worker_capacity
        and all_running_wait
        and bool(pending_targets)
    )
    return ExecutorWaitAnalysis(
        wait_edges=ordered_edges,
        cycle=cycle,
        blocked_pending_tasks=pending_targets,
        deadlock_possible=bool(cycle) or capacity_deadlock,
        capacity_deadlock_possible=capacity_deadlock,
        scope=(
            "finite declared model only; scheduler fairness, external "
            "completion, and undeclared waits remain unknown"
        ),
    )


def fold_contributions(
    *,
    partitions: Sequence[Partition],
    contributions: Sequence[PartialIndex],
) -> IndexSnapshot:
    """Validate exact immutable partials, then fold in partition-ID order."""

    declared = tuple(partitions)
    if not declared:
        raise AccountingError("at least one partition is required")
    if any(not isinstance(item, Partition) for item in declared):
        raise TypeError("partitions must contain only Partition values")
    ordered_partitions = tuple(
        sorted(declared, key=lambda item: item.partition_id)
    )
    partition_ids = tuple(item.partition_id for item in ordered_partitions)
    if len(set(partition_ids)) != len(partition_ids):
        raise AccountingError("partitions contain a duplicate ID")
    all_document_ids = tuple(
        doc_id
        for partition in ordered_partitions
        for doc_id in partition.document_ids
    )
    if len(set(all_document_ids)) != len(all_document_ids):
        raise AccountingError(
            "one document cannot belong to two declared partitions"
        )

    raw_contributions = tuple(contributions)
    if any(not isinstance(item, PartialIndex) for item in raw_contributions):
        raise TypeError("contributions must contain only PartialIndex values")
    ordered = tuple(
        sorted(raw_contributions, key=lambda item: item.partition_id)
    )
    contribution_ids = tuple(item.partition_id for item in ordered)
    if len(set(contribution_ids)) != len(contribution_ids):
        raise AccountingError("worker contributions contain a duplicate ID")
    if contribution_ids != partition_ids:
        raise AccountingError(
            "worker contributions do not exactly match declared partitions"
        )
    partition_by_id = {
        item.partition_id: item
        for item in ordered_partitions
    }
    posting_sets: dict[str, set[str]] = {}
    for contribution in ordered:
        partition = partition_by_id[contribution.partition_id]
        if contribution.documents_digest != partition.documents_digest:
            raise AccountingError(
                "worker contribution input digest does not match its partition"
            )
        allowed_ids = set(partition.document_ids)
        for term, document_ids in contribution.postings:
            if not set(document_ids).issubset(allowed_ids):
                raise AccountingError(
                    "worker contribution contains a foreign document ID"
                )
            posting_sets.setdefault(term, set()).update(document_ids)
    return _snapshot_from_posting_sets(
        document_ids=tuple(sorted(all_document_ids)),
        posting_sets=posting_sets,
    )


def _snapshot_from_posting_sets(
    *,
    document_ids: tuple[str, ...],
    posting_sets: Mapping[str, set[str]],
) -> IndexSnapshot:
    postings = tuple(
        (term, tuple(sorted(ids)))
        for term, ids in sorted(posting_sets.items())
    )
    payload = _canonical_json_bytes(
        {
            "schema": SNAPSHOT_SCHEMA,
            "document_ids": list(document_ids),
            "postings": {
                term: list(ids)
                for term, ids in postings
            },
        }
    )
    return IndexSnapshot(
        document_ids=document_ids,
        postings=postings,
        canonical_bytes=payload,
        sha256=hashlib.sha256(payload).hexdigest(),
    )


def sequential_index_oracle(
    documents: Mapping[str, str],
) -> IndexSnapshot:
    """Compute the semantic authority without workers, partials, or fold."""

    ordered = _validated_documents(documents)
    posting_sets: dict[str, set[str]] = {}
    for doc_id, text in ordered:
        seen_terms: set[str] = set()
        for match in TOKEN_PATTERN.finditer(text):
            term = match.group(0).lower()
            if len(term) > 32:
                raise ValueError("tokens may contain at most 32 characters")
            seen_terms.add(term)
        for term in seen_terms:
            posting_sets.setdefault(term, set()).add(doc_id)
    return _snapshot_from_posting_sets(
        document_ids=tuple(doc_id for doc_id, _ in ordered),
        posting_sets=posting_sets,
    )


def _json_ready(value: object) -> object:
    if is_dataclass(value):
        return _json_ready(asdict(value))
    if isinstance(value, bytes):
        return value.decode("utf-8")
    if isinstance(value, Mapping):
        return {
            str(key): _json_ready(item)
            for key, item in value.items()
        }
    if isinstance(value, (tuple, list)):
        return [_json_ready(item) for item in value]
    return value


def build_demo_evidence(
    *,
    model: str,
    executor: str,
    command: Sequence[object] | None = None,
) -> dict[str, object]:
    """Build one bounded, synthetic evidence payload for the JSON CLI."""

    runtime_profile = runtime_concurrency_profile(command=command)
    if model == "schedule":
        evidence: object = explore_two_increment_schedules(initial_value=0)
    elif model == "locked":
        evidence = explore_locked_increment_schedules(initial_value=0)
    elif model == "deadlock":
        evidence = analyze_lock_orders(
            {
                "merge-worker": ("catalog", "snapshot"),
                "publish-worker": ("snapshot", "catalog"),
            }
        )
    elif model == "condition":
        evidence = evaluate_condition_wait(
            predicate_observations=(False, False, True),
            strategy="while",
        )
    elif model == "queue":
        evidence = simulate_bounded_queue_protocol(
            capacity=2,
            operations=(
                ("producer", "PUT", "doc-a"),
                ("consumer", "GET", "doc-a"),
                ("consumer", "TASK_DONE", "doc-a"),
            ),
        )
    elif model == "runtime":
        evidence = runtime_profile
    elif model == "budget":
        evidence = parallelism_budget(
            work_units=120.0,
            span_units=30.0,
            workers=4,
            serial_fraction=0.25,
        )
    elif model == "indexer":
        evidence = run_indexer(
            documents={
                "doc-a": "locks protect invariants",
                "doc-b": "queues coordinate workers",
            },
            executor=executor,
            max_workers=2,
            timeout_seconds=10.0,
        )
    else:
        raise ValueError(f"unknown demonstration model: {model}")
    return {
        "schema": "atlas.module19-evidence.v1",
        "model": model,
        "runtime_profile": _json_ready(runtime_profile),
        "evidence": _json_ready(evidence),
    }


def run_self_tests() -> int:
    """Discover the companion suite and reject absent or zero-test runs."""

    from pathlib import Path
    import unittest

    work_directory = Path(__file__).resolve().parent
    suite = unittest.defaultTestLoader.discover(
        start_dir=str(work_directory),
        pattern="test_module19_reference.py",
    )
    count = suite.countTestCases()
    if count == 0:
        print("SELF-TEST ERROR: zero tests discovered", file=sys.stderr)
        return 2
    result = unittest.TextTestRunner(verbosity=2).run(suite)
    print(f"SELF-TEST COUNT: {count}", file=sys.stderr)
    return 0 if result.wasSuccessful() else 1


def main(argv: Sequence[str] | None = None) -> int:
    """Run a bounded teaching model or the companion behavioral test suite."""

    import argparse

    raw_arguments = list(sys.argv[1:] if argv is None else argv)
    command_entry = sys.argv[0] if argv is None else __file__
    parser = argparse.ArgumentParser(
        description="Module 19 concurrency and parallelism evidence reference"
    )
    parser.add_argument(
        "--model",
        choices=(
            "schedule",
            "locked",
            "deadlock",
            "condition",
            "queue",
            "runtime",
            "budget",
            "indexer",
        ),
        default="schedule",
    )
    parser.add_argument(
        "--executor",
        choices=("thread", "process"),
        default="thread",
    )
    parser.add_argument(
        "--json",
        action="store_true",
        help="emit compact machine-readable JSON",
    )
    parser.add_argument(
        "--self-test",
        action="store_true",
        help="run the companion suite; zero discovered tests is an error",
    )
    arguments = parser.parse_args(raw_arguments)
    if arguments.self_test:
        return run_self_tests()
    payload = build_demo_evidence(
        model=arguments.model,
        executor=arguments.executor,
        command=(sys.executable, command_entry, *raw_arguments),
    )
    print(
        json.dumps(
            payload,
            ensure_ascii=True,
            sort_keys=True,
            separators=(",", ":") if arguments.json else None,
            indent=None if arguments.json else 2,
            allow_nan=False,
        )
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
