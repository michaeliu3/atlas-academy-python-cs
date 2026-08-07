"""Shared fixture for the m04 bench pack.

Module 4 has no checked-in reference model. These are small prerequisite graphs
over Atlas concepts, plus the two validators that disagree about them.
"""

from __future__ import annotations

import sys
from pathlib import Path

_start = Path.cwd()
for _candidate in (_start, *list(_start.parents)[:4]):
    if (_candidate / "atlas_bench").is_dir():
        sys.path.insert(0, str(_candidate))
        break
else:  # pragma: no cover
    raise RuntimeError(f"atlas_bench not found from {_start}")


# A genuine tree: every node reachable once from the root.
TREE = {
    "values": ["functions", "logic"],
    "functions": ["recursion"],
    "logic": ["proof"],
    "recursion": [],
    "proof": [],
}

# Not a tree: `proof` is reachable by two paths, and `proof -> values` closes a
# cycle. The `children` field looks identical in shape.
SHARED_AND_CYCLIC = {
    "values": ["functions", "logic"],
    "functions": ["proof"],
    "logic": ["proof"],
    "proof": ["values"],
}

# A DAG with a shared child but no cycle.
SHARED_ONLY = {
    "values": ["functions", "logic"],
    "functions": ["proof"],
    "logic": ["proof"],
    "proof": [],
}


def child_count_validator(graph: dict[str, list[str]], root: str) -> bool:
    """Accepts if every node has at most two children and all names resolve.

    Trusts the `children` field to describe a tree. Never asks whether a node is
    reachable twice, and never follows an edge back to somewhere it has been.
    """
    for node, children in graph.items():
        if len(children) > 2:
            return False
        for child in children:
            if child not in graph:
                return False
    return root in graph


def cycle_witness(graph: dict[str, list[str]], root: str) -> tuple[str, ...] | None:
    """Return the edge sequence of a cycle reachable from `root`, or None.

    Colours nodes white/grey/black so a back edge to a grey node is a cycle, and
    a second visit to a black node is merely a shared child.
    """
    grey: dict[str, bool] = {}
    black: set[str] = set()
    path: list[str] = []

    def visit(node: str) -> tuple[str, ...] | None:
        grey[node] = True
        path.append(node)
        for child in graph.get(node, ()):
            if grey.get(child):
                return tuple(path[path.index(child):] + [child])
            if child not in black:
                found = visit(child)
                if found:
                    return found
        grey[node] = False
        black.add(node)
        path.pop()
        return None

    return visit(root)


def reachable_twice(graph: dict[str, list[str]], root: str) -> tuple[str, ...]:
    """Nodes reachable by more than one distinct parent."""
    parents: dict[str, int] = {}
    seen: set[str] = set()
    stack = [root]
    while stack:
        node = stack.pop()
        if node in seen:
            continue
        seen.add(node)
        for child in graph.get(node, ()):
            parents[child] = parents.get(child, 0) + 1
            stack.append(child)
    return tuple(sorted(n for n, count in parents.items() if count > 1))
