"""Module 13: finite terminal-signal and causal-repair reasoning.

The model makes the claims in a supplied run trace visible.  It distinguishes a
provisional progress signal from a terminal outcome and locates the first
analyst-marked contract contradiction in a causal trace.  It does not execute
an importer, collect telemetry, infer causes from a traceback, or prove remote
completion.
"""

from __future__ import annotations

from collections.abc import Iterable
from dataclasses import dataclass
import re
from typing import TypeVar


RUN_ID_PATTERN = re.compile(r"[a-z][a-z0-9-]{0,63}\Z")
SIGNAL_KINDS = frozenset({"started", "progress", "terminal"})
OUTCOMES = frozenset({"pending", "accepted", "rejected", "uncertain"})
CAUSAL_KINDS = frozenset({"mutation", "claim", "detection"})
MAX_RUN_SIGNALS = 256
MAX_CAUSAL_STEPS = 256

_T = TypeVar("_T")


class ModelContractError(ValueError):
    """Raised when a finite teaching-model trace is ambiguous or malformed."""


def _collect_bounded(
    items: Iterable[_T],
    *,
    label: str,
    limit: int,
) -> tuple[_T, ...]:
    """Materialize no more than one small, explicit teaching-model trace."""

    collected: list[_T] = []
    for item in items:
        if len(collected) >= limit:
            raise ModelContractError(f"{label} must contain at most {limit} items")
        collected.append(item)
    return tuple(collected)


def _require_nonempty_text(label: str, value: object) -> str:
    if not isinstance(value, str) or not value.strip():
        raise ModelContractError(f"{label} must be nonempty text")
    return value


@dataclass(frozen=True, slots=True)
class RunSignal:
    """One visible observation about a single import attempt."""

    run_id: str
    kind: str
    outcome: str
    reason: str

    def __post_init__(self) -> None:
        if not isinstance(self.run_id, str) or RUN_ID_PATTERN.fullmatch(self.run_id) is None:
            raise ModelContractError("run_id must be lowercase kebab-case text")
        if self.kind not in SIGNAL_KINDS:
            raise ModelContractError("signal kind must be started, progress, or terminal")
        if self.outcome not in OUTCOMES:
            raise ModelContractError(
                "signal outcome must be pending, accepted, rejected, or uncertain"
            )
        _require_nonempty_text("signal reason", self.reason)


@dataclass(frozen=True, slots=True)
class SignalViolation:
    """One contract mismatch in a declared trace, with its visible position."""

    kind: str
    index: int | None
    explanation: str


@dataclass(frozen=True, slots=True)
class TerminalContractReport:
    """The bounded terminal-contract result for one declared run trace."""

    run_id: str
    terminal_outcome: str | None
    terminal_reason: str | None
    violations: tuple[SignalViolation, ...]
    satisfies_terminal_contract: bool
    scope: str


@dataclass(frozen=True, slots=True)
class CausalStep:
    """An analyst-labelled step in an ordered causal investigation.

    ``contradicts_contract`` records comparison against a separately stated
    contract.  It is evidence supplied to this finite model, not automatic
    causal discovery.
    """

    owner: str
    kind: str
    observation: str
    contradicts_contract: bool

    def __post_init__(self) -> None:
        _require_nonempty_text("causal step owner", self.owner)
        if self.kind not in CAUSAL_KINDS:
            raise ModelContractError("causal step kind must be mutation, claim, or detection")
        _require_nonempty_text("causal step observation", self.observation)
        if not isinstance(self.contradicts_contract, bool):
            raise TypeError("contradicts_contract must be bool")


@dataclass(frozen=True, slots=True)
class CausalRepairBoundary:
    """The earliest declared mismatch and the next available detection point."""

    repair_owner: str | None
    repair_index: int | None
    first_detection_owner: str | None
    first_detection_index: int | None
    scope: str


def inspect_terminal_contract(signals: Iterable[RunSignal]) -> TerminalContractReport:
    """Check one finite run trace for a truthful, last terminal observation.

    ``started`` and ``progress`` are provisional and therefore must use the
    ``pending`` outcome.  One final ``terminal`` signal must report ``accepted``,
    ``rejected``, or ``uncertain``.  A progress signal that says ``accepted`` is
    deliberately reported as a premature success rather than silently treated
    as a final result.
    """

    trace = _collect_bounded(
        signals,
        label="signals",
        limit=MAX_RUN_SIGNALS,
    )
    if not trace:
        raise ModelContractError("at least one run signal is required")
    if any(not isinstance(signal, RunSignal) for signal in trace):
        raise TypeError("signals must contain RunSignal instances")
    run_ids = {signal.run_id for signal in trace}
    if len(run_ids) != 1:
        raise ModelContractError("a terminal-contract inspection requires one run_id")

    violations: list[SignalViolation] = []
    terminal_indices: list[int] = []
    for index, signal in enumerate(trace):
        if signal.kind == "terminal":
            terminal_indices.append(index)
            if signal.outcome == "pending":
                violations.append(
                    SignalViolation(
                        "pending-terminal",
                        index,
                        "A terminal signal must state accepted, rejected, or uncertain.",
                    )
                )
        elif signal.outcome == "accepted":
            violations.append(
                SignalViolation(
                    "premature-success",
                    index,
                    "Only a terminal signal may claim accepted completion.",
                )
            )
        elif signal.outcome != "pending":
            violations.append(
                SignalViolation(
                    "nonterminal-outcome",
                    index,
                    "A started or progress signal must remain explicitly provisional.",
                )
            )

    if not terminal_indices:
        violations.append(
            SignalViolation(
                "missing-terminal",
                None,
                "The trace has no terminal outcome for the caller to interpret.",
            )
        )
        terminal_outcome = None
        terminal_reason = None
    elif len(terminal_indices) > 1:
        for index in terminal_indices[1:]:
            violations.append(
                SignalViolation(
                    "multiple-terminal",
                    index,
                    "One run must expose exactly one terminal outcome.",
                )
            )
        terminal_outcome = None
        terminal_reason = None
    else:
        terminal_index = terminal_indices[0]
        terminal = trace[terminal_index]
        terminal_outcome = terminal.outcome
        terminal_reason = terminal.reason
        for index in range(terminal_index + 1, len(trace)):
            violations.append(
                SignalViolation(
                    "signal-after-terminal",
                    index,
                    "A later signal makes the purported terminal outcome ambiguous.",
                )
            )

    ordered_violations = tuple(
        sorted(
            violations,
            key=lambda item: (item.index is None, item.index if item.index is not None else -1, item.kind),
        )
    )
    return TerminalContractReport(
        run_id=trace[0].run_id,
        terminal_outcome=terminal_outcome,
        terminal_reason=terminal_reason,
        violations=ordered_violations,
        satisfies_terminal_contract=not ordered_violations,
        scope=(
            "This report checks only the declared finite local trace; it does "
            "not prove remote completion, durable storage, all failure modes, "
            "or causal correctness beyond the supplied observations."
        ),
    )


def locate_causal_repair_boundary(
    steps: Iterable[CausalStep],
) -> CausalRepairBoundary:
    """Locate the earliest analyst-marked contract mismatch in one trace.

    The result deliberately distinguishes where an inconsistency was first
    marked from where it was detected later.  That is a repair-planning aid, not
    proof that a traceback or a labelled event establishes the complete cause.
    """

    trace = _collect_bounded(
        steps,
        label="steps",
        limit=MAX_CAUSAL_STEPS,
    )
    if not trace:
        raise ModelContractError("at least one causal step is required")
    if any(not isinstance(step, CausalStep) for step in trace):
        raise TypeError("steps must contain CausalStep instances")

    repair_index = next(
        (index for index, step in enumerate(trace) if step.contradicts_contract),
        None,
    )
    if repair_index is None:
        return CausalRepairBoundary(
            repair_owner=None,
            repair_index=None,
            first_detection_owner=None,
            first_detection_index=None,
            scope=(
                "No supplied step was marked as contradicting the contract; "
                "this does not prove the trace is correct or complete."
            ),
        )

    detection_index = next(
        (
            index
            for index in range(repair_index, len(trace))
            if trace[index].kind == "detection"
        ),
        None,
    )
    return CausalRepairBoundary(
        repair_owner=trace[repair_index].owner,
        repair_index=repair_index,
        first_detection_owner=(
            trace[detection_index].owner if detection_index is not None else None
        ),
        first_detection_index=detection_index,
        scope=(
            "This identifies the earliest analyst-marked contradiction in the "
            "declared trace; it does not prove a complete cause, a universal "
            "repair, or that a later detection is the original defect."
        ),
    )
