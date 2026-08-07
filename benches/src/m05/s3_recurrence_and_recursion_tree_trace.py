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
# # Bench m05-s3 — recurrence and recursion-tree trace
#
# **Session 5.3 — Call shape becomes a recurrence.** Rungs: trace, map.
#
# The session compares a chain traversal, merge sort, and naive Fibonacci, and
# exits with a recurrence carrying a base case, a level-work trace, a bound idea,
# and **a separate statement about active stack depth**.
#
# That separation is the point. Total calls and simultaneous frames are different
# quantities that recursive syntax conflates, and only one of them can exhaust
# memory. A workbook can assert the difference; this bench makes you watch it.
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

assert sys.version_info >= (3, 12)

bench(
    module=5,
    session=3,
    emits="recurrence and recursion-tree trace",
    rungs=["trace", "map"],
)

# %% [markdown]
# ## 1. Three recursive shapes
#
# All three are recursive. Their costs differ by an exponential factor.


# %%
class Frames:
    """Track total calls and the high-water mark of simultaneous frames."""

    def __init__(self) -> None:
        self.total = 0
        self.active = 0
        self.peak = 0
        self.level_calls: dict[int, int] = {}

    def enter(self, depth: int) -> None:
        self.total += 1
        self.active += 1
        self.peak = max(self.peak, self.active)
        self.level_calls[depth] = self.level_calls.get(depth, 0) + 1

    def exit(self) -> None:
        self.active -= 1


def chain_length(items: list[int], index: int, frames: Frames, depth: int = 0) -> int:
    """One call per element: T(n) = T(n-1) + 1."""
    frames.enter(depth)
    try:
        if index >= len(items):
            return 0
        return 1 + chain_length(items, index + 1, frames, depth + 1)
    finally:
        frames.exit()


def merge_sort(items: list[int], frames: Frames, depth: int = 0) -> list[int]:
    """Two halves plus linear combine: T(n) = 2T(n/2) + n."""
    frames.enter(depth)
    try:
        if len(items) <= 1:
            return items
        middle = len(items) // 2
        left = merge_sort(items[:middle], frames, depth + 1)
        right = merge_sort(items[middle:], frames, depth + 1)
        merged, i, j = [], 0, 0
        while i < len(left) and j < len(right):
            if left[i] <= right[j]:
                merged.append(left[i]); i += 1
            else:
                merged.append(right[j]); j += 1
        return merged + left[i:] + right[j:]
    finally:
        frames.exit()


def fibonacci(n: int, frames: Frames, depth: int = 0) -> int:
    """Two calls, barely smaller: T(n) = T(n-1) + T(n-2) + 1."""
    frames.enter(depth)
    try:
        if n < 2:
            return n
        return fibonacci(n - 1, frames, depth + 1) + fibonacci(n - 2, frames, depth + 1)
    finally:
        frames.exit()


# %%
predict(
    "At n=20, rank the three by TOTAL CALLS, then rank them by PEAK SIMULTANEOUS "
    "FRAMES. Do the two rankings agree?",
    answer="",
    confidence="",
)

# %% [markdown]
# ## 2. Trace — total calls versus peak frames

# %%
results = {}

f = Frames(); chain_length(list(range(20)), 0, f)
results["chain (n=20)"] = (f.total, f.peak)

f = Frames(); merge_sort(list(range(20, 0, -1)), f)
results["merge_sort (n=20)"] = (f.total, f.peak)

f = Frames(); fibonacci(20, f)
results["fibonacci (n=20)"] = (f.total, f.peak)
fib_levels = dict(f.level_calls)

print(f"{'shape':>20}  {'total calls':>12}  {'peak frames':>12}")
for name, (total, peak) in results.items():
    print(f"{name:>20}  {total:>12,}  {peak:>12,}")

# %%
resolve(
    "At n=20, rank the three by TOTAL CALLS, then rank them by PEAK SIMULTANEOUS "
    "FRAMES. Do the two rankings agree?",
    "matched",  # matched / diverged / partial
)

# %%
reveal(
    "At n=20, rank the three by TOTAL CALLS, then rank them by PEAK SIMULTANEOUS "
    "FRAMES. Do the two rankings agree?",
    """
    They do not agree, and that disagreement is the whole session.

    By total calls: fibonacci (~13,500) >> merge_sort (39) > chain (21). By peak
    frames: chain (21) > fibonacci (20) > merge_sort (6).

    Naive Fibonacci does roughly six hundred times the *work* of the chain
    traversal while holding *fewer* frames at once. Its tree is enormously wide
    and no deeper than n. The chain is the opposite: minimal work, maximal depth,
    and it is the one that will hit the recursion limit first.

    So "recursive" predicts neither quantity. The recurrence's *shape* does:

    - `T(n) = T(n-1) + 1` — one branch, depth n: linear work, linear frames.
    - `T(n) = 2T(n/2) + n` — two branches but halving, depth log n: n log n work,
      logarithmic frames.
    - `T(n) = T(n-1) + T(n-2) + 1` — two branches, barely smaller: exponential
      work, linear frames.

    Branching factor drives work. Depth drives memory. They are independent, and
    a cost model that reports only one of them is incomplete — which is why the
    session's declared output demands the stack-depth statement *separately*.
    """,
)

# %% [markdown]
# ## 3. Map — level work in the Fibonacci tree
#
# Recover the tree's shape from the level counts.

# %%
print(f"{'depth':>6}  {'calls':>8}  {'2^depth':>8}")
for depth in sorted(fib_levels)[:10]:
    print(f"{depth:>6}  {fib_levels[depth]:>8,}  {2 ** depth:>8,}")
print()
print("Early levels double exactly; later levels fall short because the two")
print("branches shrink at different rates and the shallow side bottoms out first.")

# %% [markdown]
# ## 4. Map — write each recurrence

# %%
def recurrence_for(shape: str) -> str:
    """Return the recurrence for 'chain', 'merge_sort', or 'fibonacci'.

    Normal form: "T(n) = <recursive terms> + <combine>", base case omitted.
    Use T(n-1), 2T(n/2), T(n-1) + T(n-2); combine is "1" or "n".
    """
    raise NotImplementedError("Write the three recurrences")


# %%
check(
    "recurrence_for",
    recurrence_for,
    [
        (("chain",), "T(n) = T(n-1) + 1"),
        (("merge_sort",), "T(n) = 2T(n/2) + n"),
        (("fibonacci",), "T(n) = T(n-1) + T(n-2) + 1"),
    ],
)

# %% [markdown]
# ## 5. Depth is the thing that crashes

# %%
checkpoint(
    "chain peak frames grows with n",
    results["chain (n=20)"][1] == 21,
    "one frame per element plus the base call",
)
checkpoint(
    "merge_sort peak frames is logarithmic",
    results["merge_sort (n=20)"][1] <= 6,
    f"peak {results['merge_sort (n=20)'][1]} at n=20; log2(20) ~ 4.3",
)
print()
print(f"Default recursion limit: {sys.getrecursionlimit():,}")
print("chain_length hits it at roughly that n. fibonacci does not, at any n you")
print("would wait for — it runs out of *time* long before *stack*.")

# %% [markdown]
# ## 6. The record

# %%
STACK_DEPTH_STATEMENT = """
Chain, depth as a function of n, and the stack consequence:
Merge sort, depth as a function of n, and the stack consequence:
Fibonacci, depth as a function of n, and the stack consequence:
"""
print(STACK_DEPTH_STATEMENT)

# %%
claim("COURSE MODEL", STACK_DEPTH_STATEMENT)

claim(
    "FINITE EXPERIMENT",
    f"At n=20, naive Fibonacci performs {results['fibonacci (n=20)'][0]:,} calls "
    f"against merge sort's {results['merge_sort (n=20)'][0]}, while holding fewer "
    f"peak frames ({results['fibonacci (n=20)'][1]}) than the linear chain "
    f"({results['chain (n=20)'][1]}).",
    support={name: {"totalCalls": t, "peakFrames": p} for name, (t, p) in results.items()},
)

non_claim(
    "A single trace at n=20 does not establish any of the three bounds. It shows "
    "the shapes differ; the bounds follow from solving the recurrences, not from "
    "counting one input. In particular, nothing here proves Fibonacci is "
    "exponential rather than merely large at n=20."
)

emit()

# %% [markdown]
# ## 7. Transfer
#
# 1. Memoizing Fibonacci collapses total calls to O(n). What happens to peak
#    frames, and why does that make it a *space* trade rather than a free win?
# 2. Which of the three shapes would survive being rewritten iteratively without
#    changing its asymptotic memory? Which would not?
# 3. Session 4 accounts for amortized time and complete space. Which of the two
#    quantities you traced here belongs in that account?
#
# ---
#
# ## Attributions
#
# Authored for this course. No external material vendored.
