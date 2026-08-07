"""Shared fixture for the m09 bench pack.

Defined once, traced six ways. The `Review` record and `review_priority` key are
the module's own, from workbook section 5.1 — reused here rather than
reintroduced, so the ordering contract the benches probe is the contract the
workbook declared.
"""

from __future__ import annotations

import sys
from dataclasses import dataclass
from datetime import datetime, timedelta
from pathlib import Path

_start = Path.cwd()
for _candidate in (_start, *list(_start.parents)[:4]):
    if (_candidate / "atlas_bench").is_dir():
        sys.path.insert(0, str(_candidate))
        break


@dataclass(frozen=True)
class Review:
    concept_id: str
    due_at: datetime
    difficulty: int
    title: str


def review_priority(review: Review) -> tuple[datetime, int, str]:
    """[ATLAS POLICY] earlier due first; then harder first; then id ascending."""
    return (review.due_at, -review.difficulty, review.concept_id)


BASE = datetime(2026, 8, 6, 9, 0)
REVIEWS = [
    Review("hashing", BASE + timedelta(hours=2), 3, "Hash tables"),
    Review("bst", BASE + timedelta(hours=1), 5, "Binary search trees"),
    Review("amortized", BASE + timedelta(hours=1), 5, "Amortized analysis"),
    Review("graphs", BASE + timedelta(hours=3), 1, "Graph traversal"),
    Review("heaps", BASE + timedelta(hours=1), 2, "Heap invariants"),
]


@dataclass
class Node:
    key: int
    left: "Node | None" = None
    right: "Node | None" = None

    def __repr__(self) -> str:
        """Compact parenthesised shape, so check output stays readable."""
        if self.left is None and self.right is None:
            return f"({self.key})"
        return f"({self.key} {self.left!r} {self.right!r})"


def insert(root: Node | None, key: int) -> Node:
    """Correct BST insert. Equal keys are rejected, per RI clause 4."""
    if root is None:
        return Node(key)
    if key < root.key:
        root.left = insert(root.left, key)
    elif key > root.key:
        root.right = insert(root.right, key)
    return root


def height(node: Node | None) -> int:
    if node is None:
        return 0
    return 1 + max(height(node.left), height(node.right))


def inorder(node: Node | None, out: list[int] | None = None) -> list[int]:
    out = [] if out is None else out
    if node is not None:
        inorder(node.left, out)
        out.append(node.key)
        inorder(node.right, out)
    return out


CONCEPTS = [
    "binary-search-tree", "binary-heap", "bfs", "bst-validate",
    "hash-table", "hashing", "heap-sort", "graph-traversal",
    "amortized-analysis", "merge-sort", "merge-intervals",
]
