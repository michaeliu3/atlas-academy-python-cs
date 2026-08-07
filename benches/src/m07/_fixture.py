"""Shared fixture for the m07 bench pack.

Module 7 has no checked-in reference model. These are the counting source, the
two take-implementations, and the eager/lazy ingestion pair the benches probe.
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
class CountingSource:
    """An iterable that records how many items were actually pulled from it."""

    items: list
    pulls: int = 0

    def __iter__(self):
        for item in self.items:
            self.pulls += 1
            yield item


class TakeIterator:
    """Yield the first k items, pulling exactly k."""

    def __init__(self, source, k: int) -> None:
        self._source = iter(source)
        self._remaining = k

    def __iter__(self):
        return self

    def __next__(self):
        if self._remaining <= 0:
            raise StopIteration
        value = next(self._source)
        self._remaining -= 1
        return value


class BrokenTake:
    """Yield the first k items, but look one ahead before deciding to stop."""

    def __init__(self, source, k: int) -> None:
        self._source = iter(source)
        self._remaining = k
        self._peeked = None
        self._has_peek = False

    def __iter__(self):
        return self

    def __next__(self):
        if not self._has_peek:
            self._peeked = next(self._source)
            self._has_peek = True
        if self._remaining <= 0:
            raise StopIteration
        value = self._peeked
        self._has_peek = False
        self._remaining -= 1
        return value


def running_total(values):
    """A generator whose locals visibly change between suspensions."""
    total = 0
    seen = 0
    for value in values:
        seen += 1
        total += value
        yield total


# --------------------------------------------------------------------------
# Eager and lazy ingestion of the same batches.
# --------------------------------------------------------------------------

def batches(count: int, size: int):
    """Yield batches one at a time.

    A generator, not a list: if this materialized everything up front there
    would be no difference left for the eager and lazy consumers to have.
    """
    for i in range(count):
        yield [i * size + j for j in range(size)]


def ingest_eager(source):
    """Materialize every batch, then hand them all over."""
    return [list(batch) for batch in source]


def ingest_lazy(source):
    """Hand each batch over as it arrives, without copying."""
    for batch in source:
        yield batch
