"""Shared fixture for the m01 bench pack.

Module 1 has no checked-in reference model, so these benches carry their own
fixture. The three event-log implementations mirror the ones read in workbook
session 4: same public contract — `record(raw)` returns nothing, `snapshot()`
returns an ordered immutable tuple — and different ownership claims.

That sameness is the point. Nothing in the interface distinguishes them.
"""

from __future__ import annotations

import sys
from collections.abc import Iterable, Mapping
from dataclasses import dataclass
from pathlib import Path

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
    tags: tuple[str, ...]


def normalize_event(raw: Mapping[str, object]) -> StudyEvent:
    """Workbook section 4's normalizer, unchanged."""
    topic = str(raw["topic"]).strip().casefold()
    minutes = int(raw["minutes"])
    if not topic:
        raise ValueError("topic must not be empty")
    if minutes < 0:
        raise ValueError("minutes must be nonnegative")

    incoming_tags = raw.get("tags", ())
    if not isinstance(incoming_tags, Iterable) or isinstance(incoming_tags, (str, bytes)):
        raise TypeError("tags must be a non-string iterable")

    tags = tuple(str(tag).strip().casefold() for tag in incoming_tags)
    return StudyEvent(topic=topic, minutes=minutes, tags=tags)


class ConciseEventLog:
    """Stores the caller's mapping. Normalizes only on read."""

    def __init__(self) -> None:
        self._events: list[Mapping[str, object]] = []

    def record(self, raw: Mapping[str, object]) -> None:
        self._events.append(raw)

    def snapshot(self) -> tuple[StudyEvent, ...]:
        return tuple(normalize_event(raw) for raw in self._events)


class GeneratedEventPipeline:
    """Wraps the caller's mapping in an envelope. Still stores the mapping."""

    def __init__(self) -> None:
        self._records: list[dict[str, object]] = []

    def _wrap(self, raw: Mapping[str, object]) -> dict[str, object]:
        return {"schema": "event/v1", "payload": raw}

    def record(self, raw: Mapping[str, object]) -> None:
        self._records.append(self._wrap(raw))

    def snapshot(self) -> tuple[StudyEvent, ...]:
        return tuple(normalize_event(record["payload"]) for record in self._records)


class EventLog:
    """Normalizes on write. Owns an immutable value from that moment."""

    def __init__(self) -> None:
        self._events: list[StudyEvent] = []

    def record(self, raw: Mapping[str, object]) -> None:
        self._events.append(normalize_event(raw))

    def snapshot(self) -> tuple[StudyEvent, ...]:
        return tuple(self._events)


IMPLEMENTATIONS = {
    "ConciseEventLog": ConciseEventLog,
    "GeneratedEventPipeline": GeneratedEventPipeline,
    "EventLog": EventLog,
}


def fresh_raw() -> dict[str, object]:
    """A valid raw mapping the caller still holds a reference to."""
    return {"topic": "  Recursion ", "minutes": 45, "tags": ["Proof", " induction "]}
