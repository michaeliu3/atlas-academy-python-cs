# ---
# jupyter:
#   jupytext:
#     text_representation:
#       extension: .py
#       format_name: percent
#       format_version: '1.3'
#   kernelspec:
#     display_name: Python 3
#     language: python
#     name: python3
# ---

# %% [markdown]
# # Bench m09-s3 — rotation-preservation dossier
#
# **Session 9.3 — Balance is a repairable shape constraint.** Rungs: trace, map.
#
# Workbook §8 shows a BST degenerating; §9 introduces rotations as *local
# rewrites with global obligations*. This bench measures the degeneration, then
# checks what a rotation preserves and what it deliberately changes.
#
# **Requires:** Python 3.12+. Standard library only.

# %%
import random
import sys
from pathlib import Path

_start = Path.cwd()
for _candidate in (_start, *list(_start.parents)[:4]):
    if (_candidate / "atlas_bench").is_dir():
        sys.path.insert(0, str(_candidate))
        break
else:  # pragma: no cover
    raise RuntimeError(f"atlas_bench not found from {_start}")

from atlas_bench import (  # noqa: E402
    bench, check, checkpoint, claim, emit, non_claim, predict, resolve, reveal,
)
from _fixture import Node, height, inorder, insert  # noqa: E402

assert sys.version_info >= (3, 12)
sys.setrecursionlimit(20000)

bench(module=9, session=3, emits="rotation-preservation dossier", rungs=["trace", "map"])

# %% [markdown]
# ## 1. Produce the degeneration

# %%
predict(
    "Inserting 0..n-1 in ascending order, what height does the BST reach — "
    "about log n, about sqrt(n), or exactly n?",
    answer="",
    confidence="",
)

# %%
random.seed(9)
degeneration = {}
print(f"{'n':>6}  {'sorted':>8}  {'shuffled':>9}  {'ideal':>6}")
for n in [100, 200, 400, 800]:
    ascending = None
    for k in range(n):
        ascending = insert(ascending, k)
    keys = list(range(n))
    random.shuffle(keys)
    shuffled = None
    for k in keys:
        shuffled = insert(shuffled, k)
    degeneration[n] = {"sorted": height(ascending), "shuffled": height(shuffled),
                       "ideal": n.bit_length()}
    print(f"{n:>6}  {height(ascending):>8}  {height(shuffled):>9}  {n.bit_length():>6}")

checkpoint("sorted input degenerates to height n",
           all(degeneration[n]["sorted"] == n for n in degeneration))

# %%
resolve(
    "Inserting 0..n-1 in ascending order, what height does the BST reach — "
    "about log n, about sqrt(n), or exactly n?",
    "matched",  # matched / diverged / partial
)

# %%
reveal(
    "Inserting 0..n-1 in ascending order, what height does the BST reach — "
    "about log n, about sqrt(n), or exactly n?",
    """
    Exactly n. The tree has become a linked list — Module 6's structure.

    Every insert goes right, so no comparison ever discards a subtree. The
    O(log n) search argument depended entirely on height being logarithmic, and
    nothing in the RI guarantees that. The invariant constrains *order*; it says
    nothing about *shape*.

    Note the failure mode: the degenerate input is sorted data, which is the most
    natural thing in the world to feed a review scheduler. The worst case is not
    adversarial, it is Tuesday.
    """,
)

# %% [markdown]
# ## 2. Map — what a rotation preserves
#
# A right rotation at `y` makes its left child `x` the new root of that subtree.
# Implement it, then check the two obligations separately.


# %%
def rotate_right(y: Node) -> Node:
    """Right rotation at y. Returns the new subtree root.

        y            x
       / \\          / \\
      x   C   ->    A   y
     / \\              / \\
    A   B            B   C
    """
    raise NotImplementedError("Implement rotate_right")


# %%
subtree = Node(50, Node(30, Node(20), Node(40)), Node(70))
before_order = inorder(subtree)
before_height = height(subtree)

check("rotate_right returns the left child as new root", rotate_right,
      [((Node(50, Node(30, Node(20), Node(40)), Node(70)),), Node(30, Node(20), Node(50, Node(40), Node(70))))])

try:
    rotated = rotate_right(subtree)
    checkpoint("in-order sequence is preserved", inorder(rotated) == before_order,
               f"{before_order} -> {inorder(rotated)}")
    checkpoint("the root changed", rotated.key != 50, f"new root {rotated.key}")
    print(f"height before {before_height}, after {height(rotated)}")
except NotImplementedError:
    print("rotate_right not implemented yet — skipping.")

# %% [markdown]
# ## 3. The two obligations, separated

# %%
PRESERVATION_MAP = """
What a rotation must preserve:
What a rotation is allowed to change:
The global obligation a local rewrite creates:
"""
print(PRESERVATION_MAP)

# %% [markdown]
# ## 4. The record

# %%
claim("COURSE MODEL", PRESERVATION_MAP)

claim(
    "FINITE EXPERIMENT",
    "Ascending insertion produces height exactly n at n in {100, 200, 400, 800}; "
    "shuffled insertion stays within a small factor of the ideal bit-length bound.",
    support=degeneration,
)

non_claim(
    "One rotation preserving in-order order does not establish that a rebalancing "
    "scheme terminates, or that it restores a height bound. Those are properties "
    "of the *policy* choosing rotations, not of a single rewrite."
)

emit()

# %% [markdown]
# ## 5. Transfer
#
# 1. Rotation preserves in-order order. Which RI clause does that correspond to,
#    and which clause does it not touch?
# 2. Session 4 builds a heap, whose shape is maintained by construction rather
#    than repaired. What does a heap give up in exchange?
#
# ---
#
# ## Attributions
#
# Authored for this course. No external material vendored.
