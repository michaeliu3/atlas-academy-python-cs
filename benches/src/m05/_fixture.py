"""Shared fixture for the m05 bench pack.

Defined once, traced six ways. Every bench in this pack imports from here so
that Session 1's counted deduplicator and Session 5's timed one are provably the
same code — otherwise a model/measurement mismatch could be an artefact of two
different implementations rather than a fact about cost.

Mirrors the two Atlas deduplication designs compared in workbook §9.
"""

from __future__ import annotations

import sys
from pathlib import Path
from typing import Callable

_start = Path.cwd()
for _candidate in (_start, *list(_start.parents)[:4]):
    if (_candidate / "atlas_bench").is_dir():
        sys.path.insert(0, str(_candidate))
        break

from atlas_bench import Counter  # noqa: E402


# --------------------------------------------------------------------------
# The two designs from workbook §9
# --------------------------------------------------------------------------

def dedup_scan(events: list[str]) -> list[str]:
    """Keep first occurrence. Membership tested against the output list."""
    seen: list[str] = []
    for event in events:
        if event not in seen:
            seen.append(event)
    return seen


def dedup_hashed(events: list[str]) -> list[str]:
    """Keep first occurrence. Membership tested against a set."""
    seen: set[str] = set()
    output: list[str] = []
    for event in events:
        if event not in seen:
            seen.add(event)
            output.append(event)
    return output


def dedup_scan_counted(events: list[str], counter: Counter) -> list[str]:
    """`dedup_scan` with the loop that `in` was hiding made explicit."""
    seen: list[str] = []
    for event in events:
        for candidate in seen:
            counter.hit("comparison")
            if candidate == event:
                break
        else:
            seen.append(event)
            counter.hit("append")
    return seen


# --------------------------------------------------------------------------
# Input families
#
# Built outside any timed region, as workbook §10 requires. Three families
# because a worst-case claim needs a witness, and "all distinct" is the only
# one of these that supplies it for dedup_scan.
# --------------------------------------------------------------------------

def all_distinct(n: int) -> list[str]:
    return [f"evt-{i}" for i in range(n)]


def all_equal(n: int) -> list[str]:
    return ["evt-0"] * n


def alternating_pair(n: int) -> list[str]:
    return [f"evt-{i % 2}" for i in range(n)]


INPUT_FAMILIES: dict[str, Callable[[int], list[str]]] = {
    "all-distinct": all_distinct,
    "all-equal": all_equal,
    "alternating-pair": alternating_pair,
}

SIZES = [500, 1000, 2000, 4000, 8000]
DISTINCT = {n: all_distinct(n) for n in SIZES}
