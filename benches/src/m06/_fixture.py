"""Shared fixture for the m06 bench pack.

Module 6 has no checked-in reference model.

Deliberate non-overlap with `m05-s4`: that bench measures *amortized time* —
total element copies across a doubling sequence, and the copies-per-append
constant. This pack asks a representation question instead: what the list object
actually stores, what `sys.getsizeof` therefore counts, and which of those facts
are portable.
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


@dataclass
class StudyEvent:
    topic: str
    minutes: int
    tags: tuple[str, ...] = ()


def make_events(count: int) -> list[StudyEvent]:
    return [StudyEvent(f"topic-{i:05d}", i % 120, ("proof", "induction"))
            for i in range(count)]


def capacity_ladder(appends: int) -> list[tuple[int, int]]:
    """(length, bytes) at each point the list object's size changes."""
    data: list[int] = []
    ladder: list[tuple[int, int]] = []
    last = -1
    for i in range(appends):
        data.append(i)
        size = sys.getsizeof(data)
        if size != last:
            ladder.append((len(data), size))
            last = size
    return ladder


# --------------------------------------------------------------------------
# A singly linked queue with a tail pointer. Its invariant has three clauses,
# and one operation breaks exactly one of them.
# --------------------------------------------------------------------------

@dataclass
class Node:
    value: object
    next: "Node | None" = None


class LinkedQueue:
    """Append at the tail, evict from the head."""

    def __init__(self) -> None:
        self.head: Node | None = None
        self.tail: Node | None = None
        self.length = 0

    def append(self, value: object) -> None:
        node = Node(value)
        if self.tail is None:
            self.head = self.tail = node
        else:
            self.tail.next = node
            self.tail = node
        self.length += 1

    def evict(self) -> object:
        """Remove the head. Forgets to clear `tail` when the queue empties."""
        if self.head is None:
            raise IndexError("evict from empty queue")
        node = self.head
        self.head = node.next
        self.length -= 1
        return node.value

    # -- the representation invariant, one clause per method ---------------

    def acyclic(self) -> bool:
        slow = fast = self.head
        while fast is not None and fast.next is not None:
            slow, fast = slow.next, fast.next.next
            if slow is fast:
                return False
        return True

    def tail_reachable(self) -> bool:
        if self.head is None:
            return self.tail is None
        node = self.head
        while node is not None:
            if node is self.tail:
                return node.next is None
            node = node.next
        return False

    def length_agrees(self) -> bool:
        counted, node = 0, self.head
        while node is not None:
            counted += 1
            node = node.next
        return counted == self.length

    def check_rep(self) -> dict[str, bool]:
        return {
            "acyclic": self.acyclic(),
            "tail reachable": self.tail_reachable(),
            "length agrees": self.length_agrees(),
        }
