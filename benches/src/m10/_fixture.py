"""Shared fixture for the m10 bench pack.

Module 10 has no checked-in reference model. These are the small graphs and the
instrumented traversals the benches probe.
"""

from __future__ import annotations

import heapq
import sys
from collections import deque
from dataclasses import dataclass, field
from pathlib import Path

_start = Path.cwd()
for _candidate in (_start, *list(_start.parents)[:4]):
    if (_candidate / "atlas_bench").is_dir():
        sys.path.insert(0, str(_candidate))
        break
else:  # pragma: no cover
    raise RuntimeError(f"atlas_bench not found from {_start}")


# The smallest DAG that fools a visited-set cycle detector: a and b both point
# at c, and there is no cycle anywhere.
DIAMOND_TAIL = {"a": ["c"], "b": ["c"], "c": []}

# A genuine cycle.
CYCLIC = {"a": ["b"], "b": ["c"], "c": ["a"]}

# Weighted graph where the fewest-edges path is not the cheapest path.
WEIGHTED = {
    "s": [("a", 10), ("c", 1)],
    "a": [("g", 1)],
    "c": [("d", 1)],
    "d": [("g", 1)],
    "g": [],
}

# One negative edge, arranged so the cheaper route is found only AFTER the
# vertex it improves has already been finalized.
NEGATIVE = {
    "s": [("a", 1), ("b", 2)],
    "a": [("g", 5)],
    "b": [("a", -2)],
    "g": [],
}


def seen_only_has_cycle(graph: dict[str, list[str]], root: str) -> bool:
    """Report a cycle whenever a node is reached twice. This is wrong."""
    seen: set[str] = set()

    def visit(node: str) -> bool:
        if node in seen:
            return True
        seen.add(node)
        return any(visit(child) for child in graph.get(node, ()))

    return visit(root)


def coloured_has_cycle(graph: dict[str, list[str]], root: str) -> bool:
    """Report a cycle only on an edge back to a node still on the current path."""
    grey: set[str] = set()
    black: set[str] = set()

    def visit(node: str) -> bool:
        grey.add(node)
        for child in graph.get(node, ()):
            if child in grey:
                return True
            if child not in black and visit(child):
                return True
        grey.discard(node)
        black.add(node)
        return False

    return visit(root)


@dataclass
class HeapTrace:
    pushes: int = 0
    pops: int = 0
    stale_pops: int = 0
    max_occupancy: int = 0
    finalized: list[str] = field(default_factory=list)


def dijkstra(graph, source: str, trace: HeapTrace) -> dict[str, float]:
    """Lazy-deletion Dijkstra. Pushes a new entry rather than decreasing a key.

    Returns the distances **as finalized** — the value committed when a vertex is
    popped — not a running tentative table. That is what the algorithm actually
    promises, and returning the tentative table instead would hide the failure a
    negative edge causes.
    """
    tentative = {source: 0}
    heap = [(0, source)]
    trace.pushes += 1
    done: dict[str, float] = {}
    while heap:
        trace.max_occupancy = max(trace.max_occupancy, len(heap))
        distance, node = heapq.heappop(heap)
        trace.pops += 1
        if node in done:
            trace.stale_pops += 1
            continue
        done[node] = distance          # committed here, never revised
        trace.finalized.append(node)
        for child, weight in graph.get(node, ()):
            candidate = distance + weight
            if candidate < tentative.get(child, float("inf")):
                tentative[child] = candidate
                heapq.heappush(heap, (candidate, child))
                trace.pushes += 1
    return done


def bfs_parents(graph, source: str, *, discover_at_dequeue: bool):
    """BFS recording parents. Two discovery policies, two enqueue counts."""
    parent: dict[str, str | None] = {source: None}
    queue = deque([source])
    enqueued = 1
    seen = {source}
    while queue:
        node = queue.popleft()
        for child, _ in graph.get(node, ()):
            if discover_at_dequeue:
                queue.append(child)
                enqueued += 1
                parent[child] = node          # last writer wins
            elif child not in seen:
                seen.add(child)
                queue.append(child)
                enqueued += 1
                parent[child] = node
    return parent, enqueued
