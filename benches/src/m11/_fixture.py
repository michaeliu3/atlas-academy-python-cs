"""Shared fixture for the m11 bench pack.

Module 11 has no checked-in reference model.

The problem: choose study sessions to maximise value under a minutes budget.
Small enough to solve exhaustively, which gives every bench an oracle.
"""

from __future__ import annotations

import sys
from dataclasses import dataclass
from itertools import combinations
from pathlib import Path

_start = Path.cwd()
for _candidate in (_start, *list(_start.parents)[:4]):
    if (_candidate / "atlas_bench").is_dir():
        sys.path.insert(0, str(_candidate))
        break
else:  # pragma: no cover
    raise RuntimeError(f"atlas_bench not found from {_start}")


@dataclass(frozen=True)
class Session:
    name: str
    minutes: int
    value: int

    @property
    def density(self) -> float:
        return self.value / self.minutes


def exhaustive_best(items: tuple[Session, ...], budget: int) -> tuple[int, tuple]:
    """The oracle: try every subset."""
    best_value, best_set = 0, ()
    for size in range(len(items) + 1):
        for subset in combinations(items, size):
            if sum(s.minutes for s in subset) <= budget:
                total = sum(s.value for s in subset)
                if total > best_value:
                    best_value, best_set = total, subset
    return best_value, best_set


def greedy_by_density(items: tuple[Session, ...], budget: int) -> tuple[int, tuple]:
    """Take the best value-per-minute that still fits."""
    chosen, remaining = [], budget
    for item in sorted(items, key=lambda s: s.density, reverse=True):
        if item.minutes <= remaining:
            chosen.append(item)
            remaining -= item.minutes
    return sum(s.value for s in chosen), tuple(chosen)


def greedy_by_value(items: tuple[Session, ...], budget: int) -> tuple[int, tuple]:
    """Take the highest absolute value that still fits."""
    chosen, remaining = [], budget
    for item in sorted(items, key=lambda s: s.value, reverse=True):
        if item.minutes <= remaining:
            chosen.append(item)
            remaining -= item.minutes
    return sum(s.value for s in chosen), tuple(chosen)


# --------------------------------------------------------------------------
# Backtracking search with pluggable pruning, instrumented.
# --------------------------------------------------------------------------

@dataclass
class SearchTrace:
    nodes: int = 0
    pruned: int = 0


def backtracking_best(items, budget, prune, trace: SearchTrace):
    """Depth-first search over include/exclude, with a pluggable prune test."""
    best = {"value": 0, "set": ()}

    def visit(index: int, chosen: tuple, minutes: int, value: int) -> None:
        trace.nodes += 1
        if prune(index, items, budget, minutes, value, best["value"]):
            trace.pruned += 1
            return
        if index == len(items):
            if value > best["value"]:
                best["value"], best["set"] = value, chosen
            return
        item = items[index]
        if minutes + item.minutes <= budget:
            visit(index + 1, chosen + (item,), minutes + item.minutes, value + item.value)
        visit(index + 1, chosen, minutes, value)

    visit(0, (), 0, 0)
    return best["value"], best["set"]


def no_prune(index, items, budget, minutes, value, best) -> bool:
    return False


def safe_bound_prune(index, items, budget, minutes, value, best) -> bool:
    """Prune when even taking everything remaining cannot beat the best so far."""
    optimistic = value + sum(s.value for s in items[index:])
    return optimistic <= best


def unsafe_score_prune(index, items, budget, minutes, value, best) -> bool:
    """Prune when the partial value is already below the best. Not sound."""
    return value < best and index > 0
