"""Shared fixture for the m02 bench pack.

Module 2 has no checked-in reference model, so these benches carry their own.

Deliberate non-overlap with m05-s3: that bench compares a chain traversal, merge
sort, and naive Fibonacci to show total calls and peak frames rank differently.
This pack does not repeat that comparison. It takes the question m05-s3 leaves as
transfer work — what memoization actually buys — and answers it.
"""

from __future__ import annotations

import sys
from dataclasses import dataclass, field
from pathlib import Path

_start = Path.cwd()
for _candidate in (_start, *list(_start.parents)[:4]):
    if (_candidate / "atlas_bench").is_dir():
        sys.path.insert(0, str(_candidate))
        break
else:  # pragma: no cover
    raise RuntimeError(f"atlas_bench not found from {_start}")


@dataclass
class CallTrace:
    """Total calls and the high-water mark of simultaneous frames."""

    total: int = 0
    active: int = 0
    peak: int = 0
    arguments: list[tuple] = field(default_factory=list)

    def enter(self, *args) -> None:
        self.total += 1
        self.active += 1
        self.peak = max(self.peak, self.active)
        if len(self.arguments) < 200:
            self.arguments.append(args)

    def leave(self) -> None:
        self.active -= 1


def fib_naive(n: int, trace: CallTrace) -> int:
    """T(n) = T(n-1) + T(n-2) + 1."""
    trace.enter(n)
    try:
        return n if n < 2 else fib_naive(n - 1, trace) + fib_naive(n - 2, trace)
    finally:
        trace.leave()


def fib_memoized(n: int, trace: CallTrace, memo: dict[int, int] | None = None) -> int:
    """Same recursion, with results remembered. Still recursive."""
    memo = {} if memo is None else memo
    trace.enter(n)
    try:
        if n in memo:
            return memo[n]
        value = n if n < 2 else (
            fib_memoized(n - 1, trace, memo) + fib_memoized(n - 2, trace, memo)
        )
        memo[n] = value
        return value
    finally:
        trace.leave()


def fib_iterative(n: int, trace: CallTrace) -> int:
    """One frame, whatever n is."""
    trace.enter(n)
    try:
        previous, current = 0, 1
        for _ in range(n):
            previous, current = current, previous + current
        return previous
    finally:
        trace.leave()


VARIANTS = {
    "naive": fib_naive,
    "memoized": fib_memoized,
    "iterative": fib_iterative,
}
