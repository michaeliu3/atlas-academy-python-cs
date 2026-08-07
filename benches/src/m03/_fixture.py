"""Shared fixture for the m03 bench pack.

Module 3 has no checked-in reference model. These types mirror workbook section
5's `EventStore` protocol and its `_check_rep()` discipline, plus three
implementations that agree with the protocol to different depths.
"""

from __future__ import annotations

import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Protocol, runtime_checkable

_start = Path.cwd()
for _candidate in (_start, *list(_start.parents)[:4]):
    if (_candidate / "atlas_bench").is_dir():
        sys.path.insert(0, str(_candidate))
        break
else:  # pragma: no cover
    raise RuntimeError(f"atlas_bench not found from {_start}")


@dataclass(frozen=True)
class StudyEvent:
    topic: str
    minutes: int


@runtime_checkable
class EventStore(Protocol):
    """An append-only ordered history of valid StudyEvent values."""

    def append(self, event: StudyEvent) -> None: ...
    def history(self) -> tuple[StudyEvent, ...]: ...


class ListEventStore:
    """The reference behaviour: append-only, ordered, snapshot on read."""

    def __init__(self) -> None:
        self._events: list[StudyEvent] = []
        self._check_rep()

    def append(self, event: StudyEvent) -> None:
        if not isinstance(event, StudyEvent):
            raise TypeError("event must be a StudyEvent")
        self._events.append(event)
        self._check_rep()

    def history(self) -> tuple[StudyEvent, ...]:
        self._check_rep()
        return tuple(self._events)

    def _check_rep(self) -> None:
        if not isinstance(self._events, list):
            raise AssertionError("_events must be a list")
        if not all(isinstance(e, StudyEvent) for e in self._events):
            raise AssertionError("_events must contain only StudyEvent values")


class ChunkedEventStore:
    """Stores events in fixed-size chunks.

    Its representation invariant says every chunk except the last is full. The
    invariant is genuinely violated *during* `append`, between allocating a new
    chunk and putting the event in it — a state no before/after check can see.
    """

    CHUNK = 3

    def __init__(self) -> None:
        self._chunks: list[list[StudyEvent]] = [[]]

    def append(self, event: StudyEvent, observer=None) -> None:
        if not isinstance(event, StudyEvent):
            raise TypeError("event must be a StudyEvent")
        if len(self._chunks[-1]) == self.CHUNK:
            self._chunks.append([])
            if observer is not None:
                observer(self)          # mid-operation: the new chunk is empty
        self._chunks[-1].append(event)

    def history(self) -> tuple[StudyEvent, ...]:
        return tuple(e for chunk in self._chunks for e in chunk)

    def check_rep(self) -> bool:
        """Every chunk but the last is full; the last is nonempty unless empty store."""
        if any(len(c) != self.CHUNK for c in self._chunks[:-1]):
            return False
        if len(self._chunks) > 1 and not self._chunks[-1]:
            return False
        return all(isinstance(e, StudyEvent) for c in self._chunks for e in c)


class ReversingStore:
    """Structurally an EventStore. Returns history newest-first."""

    def __init__(self) -> None:
        self._events: list[StudyEvent] = []

    def append(self, event: StudyEvent) -> None:
        self._events.append(event)

    def history(self) -> tuple[StudyEvent, ...]:
        return tuple(reversed(self._events))


class CachedEventStore:
    """Caches the history snapshot. One mutator forgets to invalidate."""

    def __init__(self) -> None:
        self._events: list[StudyEvent] = []
        self._cache: tuple[StudyEvent, ...] | None = None

    def append(self, event: StudyEvent) -> None:
        self._events.append(event)
        self._cache = None                      # invalidates correctly

    def append_many(self, events) -> None:
        self._events.extend(events)             # forgets to invalidate

    def history(self) -> tuple[StudyEvent, ...]:
        if self._cache is None:
            self._cache = tuple(self._events)
        return self._cache

    def recomputed_history(self) -> tuple[StudyEvent, ...]:
        return tuple(self._events)


SAMPLE = [StudyEvent("recursion", 30), StudyEvent("proof", 45), StudyEvent("heaps", 20)]
