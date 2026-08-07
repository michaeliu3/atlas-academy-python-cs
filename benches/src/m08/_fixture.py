"""Shared fixture for the m08 bench pack.

Module 8 has no checked-in reference model. These are the mutable key, the
adversarial collision key, and the open-addressing table the benches probe.
"""

from __future__ import annotations

import sys
from dataclasses import dataclass
from pathlib import Path

_start = Path.cwd()
for _candidate in (_start, *list(_start.parents)[:4]):
    if (_candidate / "atlas_bench").is_dir():
        sys.path.insert(0, str(_candidate))
        break
else:  # pragma: no cover
    raise RuntimeError(f"atlas_bench not found from {_start}")


@dataclass(eq=True)
class MutableTopic:
    """Hashable by slug, and the slug can change after insertion."""

    slug: str
    title: str = ""

    def __hash__(self) -> int:
        return hash(self.slug)


@dataclass(frozen=True)
class FrozenTopic:
    """The repaired version: hash and equality both fixed at construction."""

    slug: str
    title: str = ""


class CollisionKey:
    """Every instance lands in the same bucket. Equality is still by value."""

    __slots__ = ("value", "comparisons")

    def __init__(self, value: int) -> None:
        self.value = value

    def __hash__(self) -> int:
        return 0

    def __eq__(self, other: object) -> bool:
        if not isinstance(other, CollisionKey):
            return NotImplemented
        EQ_CALLS.append((self.value, other.value))
        return self.value == other.value


EQ_CALLS: list[tuple[int, int]] = []


EMPTY = object()
TOMBSTONE = object()


class OpenAddressed:
    """A fixed-size open-addressing table with linear probing.

    `delete_wrong` writes EMPTY where a tombstone is required; `delete_right`
    writes the tombstone. Both look correct in isolation.
    """

    def __init__(self, capacity: int = 8) -> None:
        self.capacity = capacity
        self.slots: list = [EMPTY] * capacity

    def _probe(self, key):
        index = hash(key) % self.capacity
        for _ in range(self.capacity):
            yield index
            index = (index + 1) % self.capacity

    def insert(self, key) -> None:
        for index in self._probe(key):
            entry = self.slots[index]
            if entry is EMPTY or entry is TOMBSTONE or entry == key:
                self.slots[index] = key
                return
        raise RuntimeError("table full")

    def contains(self, key) -> bool:
        for index in self._probe(key):
            entry = self.slots[index]
            if entry is EMPTY:
                return False          # a truly empty slot ends the probe
            if entry is not TOMBSTONE and entry == key:
                return True
        return False

    def delete_wrong(self, key) -> None:
        for index in self._probe(key):
            entry = self.slots[index]
            if entry is EMPTY:
                return
            if entry is not TOMBSTONE and entry == key:
                self.slots[index] = EMPTY      # breaks the probe chain
                return

    def delete_right(self, key) -> None:
        for index in self._probe(key):
            entry = self.slots[index]
            if entry is EMPTY:
                return
            if entry is not TOMBSTONE and entry == key:
                self.slots[index] = TOMBSTONE  # preserves the probe chain
                return


class FixedHash:
    """A key whose bucket is chosen by construction, for building collisions."""

    def __init__(self, bucket: int, name: str) -> None:
        self.bucket = bucket
        self.name = name

    def __hash__(self) -> int:
        return self.bucket

    def __eq__(self, other: object) -> bool:
        return isinstance(other, FixedHash) and self.name == other.name

    def __repr__(self) -> str:
        return f"K({self.name})"
