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
# # Bench m09-s4 — heap invariant trace
#
# **Session 9.4 — A complete tree becomes a priority mechanism.** Rungs:
# **modify** (primary), trace.
#
# The pack's one implementation-primary bench. Targeted mechanism implementation
# is 5% of the course's evidence weight, so exactly one of six gets to be about
# writing code — and building a heap once exposes the state that `heapq` hides.
#
# This is the Atlas scheduler half of the module's project evidence.
#
# *Problem framing adapted from
# [donnemartin/interactive-coding-challenges](https://github.com/donnemartin/interactive-coding-challenges)
# `graphs_trees/min_heap` (Apache-2.0), pinned at `358f2cc`.*
#
# **Requires:** Python 3.12+. Standard library only.

# %%
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
from _fixture import REVIEWS, Review, review_priority  # noqa: E402

assert sys.version_info >= (3, 12)

bench(module=9, session=4, emits="heap invariant trace", rungs=["modify", "trace"])

# %% [markdown]
# ## 1. The scheduler
#
# **Constraints:**
#
# - Duplicates allowed? **Yes** — two reviews may share a priority key.
# - Ordering? **Min-first**, per the [ATLAS POLICY] key.
# - Backing store? A list with the standard index arithmetic: parent `(i-1)//2`,
#   children `2i+1` and `2i+2`.
#
# Keep the two invariants separate: **shape** (complete tree, maintained by
# construction) and **order** (every parent's key at most its children's).


# %%
class ReviewScheduler:
    """Min-heap of Review records ordered by review_priority."""

    def __init__(self) -> None:
        self._items: list[Review] = []
        self.sift_steps = 0

    def __len__(self) -> int:
        return len(self._items)

    def _key(self, index: int) -> tuple:
        return review_priority(self._items[index])

    def satisfies_heap_property(self) -> bool:
        for child in range(1, len(self._items)):
            if self._key((child - 1) // 2) > self._key(child):
                return False
        return True

    def snapshot(self) -> list[str]:
        return [item.concept_id for item in self._items]

    def push(self, review: Review) -> None:
        """Append, then sift up until the order invariant holds. Count each swap
        in `self.sift_steps` so the trace can show the work."""
        raise NotImplementedError("Implement push")

    def pop(self) -> Review:
        """Remove and return the minimum, preserving both invariants.

        Swap root with last, drop the last, sift the new root down. Raise
        IndexError when empty. Count each swap in `self.sift_steps`.
        """
        raise NotImplementedError("Implement pop")


# %% [markdown]
# ## 2. Trace — the invariant after every operation

# %%
scheduler = ReviewScheduler()
trace = []
try:
    for review in REVIEWS:
        scheduler.push(review)
        holds = scheduler.satisfies_heap_property()
        trace.append({"op": f"push({review.concept_id})", "array": scheduler.snapshot(),
                      "invariant": holds})
        checkpoint(f"invariant holds after push({review.concept_id})", holds)

    print()
    drained = []
    while len(scheduler):
        drained.append(scheduler.pop().concept_id)
    expected = [r.concept_id for r in sorted(REVIEWS, key=review_priority)]
    checkpoint("drain order matches the ordering contract", drained == expected,
               f"{drained}")
    print(f"\ntotal sift steps: {scheduler.sift_steps}")
except NotImplementedError:
    drained, expected = [], []
    print("ReviewScheduler not implemented yet — skipping trace.")

# %%
predict(
    "After pushing all five reviews, is the scheduler's internal list in sorted "
    "order?",
    answer="",
    confidence="",
)

# %%
resolve(
    "After pushing all five reviews, is the scheduler's internal list in sorted "
    "order?",
    "matched",  # matched / diverged / partial
)

# %%
reveal(
    "After pushing all five reviews, is the scheduler's internal list in sorted "
    "order?",
    """
    No, and it is not supposed to be.

    The heap property constrains each parent against its own children and says
    nothing about siblings or cousins. Many distinct arrays satisfy it for the
    same key set. Sorted order is one of them — the strongest one — which is why
    every sorted array is a valid heap but almost no valid heap is sorted.

    That weakness is the whole bargain. Maintaining full order on insert costs
    O(n); maintaining only the parent-child relation costs O(log n). You buy
    cheap insertion by promising less.

    Consequence for Atlas: the scheduler answers "what is next" in O(1) and
    "everything in order" only by draining, in O(n log n). If a screen needs the
    full ordered list on every render, a heap is the wrong structure — and the
    ordering contract from Session 1 should have said so.
    """,
)

# %% [markdown]
# ## 3. The record

# %%
claim(
    "FINITE EXPERIMENT",
    f"The order invariant held after every push, and draining produced "
    f"{drained or '(not implemented)'}, matching the contract order "
    f"{expected or '(not implemented)'}.",
    support={"trace": trace, "drained": drained, "expected": expected},
)

non_claim(
    "Five elements do not exercise the sift paths that matter. Every push here "
    "sifts at most two levels, so the trace shows the invariant is *maintained* "
    "but not that it is maintained at depth. It also says nothing about the "
    "amortized cost of a mixed push/pop workload."
)

emit()

# %% [markdown]
# ## 4. Transfer
#
# 1. Session 3's BST degenerated on sorted input. Explain why the heap is
#    unaffected by the input order that destroyed it.
# 2. Your `satisfies_heap_property` checks the order invariant. Write the check
#    you would add for the *shape* invariant, and say why the list representation
#    makes it nearly free.
#
# ---
#
# ## Attributions
#
# Problem framing and the sift-up/sift-down structure adapted from
# [donnemartin/interactive-coding-challenges](https://github.com/donnemartin/interactive-coding-challenges)
# `graphs_trees/min_heap`, Apache-2.0, © 2015 Donne Martin, pinned at
# `358f2cc60426d5c4c3d7d580910eec9a7b393fa9`. The Review ordering contract, the
# per-operation invariant trace, and all Atlas framing are this course's own.
