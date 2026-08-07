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
# # Bench m05-s4 — amortized and space account
#
# **Session 5.4 — Amortized time and complete space accounts.** Rungs: **modify**
# (primary), trace.
#
# This is the pack's one implementation-primary bench. Targeted mechanism
# implementation is 5% of the course's evidence weight, so exactly one of the six
# gets to be about writing code — and even here it is one function under one
# constraint, wrapped in tracing.
#
# The session exits with an account that totals copied elements across a doubling
# sequence and separately names output, auxiliary, stack, and retained space.
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
    bench, check, checkpoint, claim, emit, non_claim, peak_memory, predict, resolve, reveal,
)
from _fixture import DISTINCT, dedup_hashed, dedup_scan  # noqa: E402

assert sys.version_info >= (3, 12)

bench(
    module=5,
    session=4,
    emits="amortized and space account",
    rungs=["modify", "trace"],
)

# %% [markdown]
# ## 1. Watch the resizes
#
# Workbook §6 argues `list.append` is amortized constant despite occasional
# resizes. Observe the resizes rather than trusting the argument.

# %%
data: list[int] = []
capacity_changes: list[tuple[int, int]] = []
last_size = -1

for i in range(2000):
    data.append(i)
    size = sys.getsizeof(data)
    if size != last_size:
        capacity_changes.append((len(data), size))
        last_size = size

print(f"{len(capacity_changes)} reallocations across 2000 appends")
print(f"{'length':>8}  {'bytes':>8}")
for length, size in capacity_changes[:8]:
    print(f"{length:>8}  {size:>8}")

lengths = [length for length, _ in capacity_changes]
factors = [b / a for a, b in zip(lengths, lengths[1:]) if a > 0]
mean_factor = sum(factors[3:]) / len(factors[3:])
print(f"\ngrowth factor between reallocations: ~{mean_factor:.2f}")

# %%
predict(
    "Across n appends, how many times is a given element copied on average — "
    "constant, logarithmic in n, or linear in n?",
    answer="",
    confidence="",
)

# %% [markdown]
# ## 2. Modify — total the copied elements
#
# The amortized argument stands or falls on this total. Implement it.
#
# **Constraint:** count copies only, using the capacity sequence. Do not time
# anything, and do not assume a growth factor — read it from `lengths`.


# %%
def total_elements_copied(capacity_lengths: list[int]) -> int:
    """Total element copies across a sequence of reallocations.

    Each reallocation at length L copies the L elements already present into the
    new buffer. Given the lengths at which reallocation occurred, return the sum.

        total_elements_copied([1, 5, 9]) == 1 + 5 + 9 == 15
        total_elements_copied([]) == 0
    """
    raise NotImplementedError("Implement total_elements_copied")


# %%
check(
    "total_elements_copied",
    total_elements_copied,
    [
        (([1, 5, 9],), 15),
        (([],), 0),
        (([4],), 4),
        (([1, 2, 4, 8],), 15),
    ],
)

# %%
try:
    copied = total_elements_copied(lengths)
    ratio = copied / 2000
    print(f"total copies across 2000 appends : {copied:,}")
    print(f"copies per append                : {ratio:.2f}")
    checkpoint(
        "copies per append is bounded by a small constant",
        ratio < 10,
        f"{ratio:.2f} — this is the amortized argument, as a number",
    )
except NotImplementedError:
    copied, ratio = None, None
    print("total_elements_copied not implemented yet — skipping.")

# %%
resolve(
    "Across n appends, how many times is a given element copied on average — "
    "constant, logarithmic in n, or linear in n?",
    "matched",  # matched / diverged / partial
)

# %%
reveal(
    "Across n appends, how many times is a given element copied on average — "
    "constant, logarithmic in n, or linear in n?",
    """
    Constant — bounded, and small.

    Because capacity grows *geometrically*, the reallocation lengths form a
    near-geometric series, and a geometric series summing to n has total
    O(n). Divide by n appends and you get a constant. Roughly 33 reallocations
    covered 2000 appends here; a fixed-size bump of, say, 8 would have needed 250.

    The failure mode is worth naming precisely: if capacity grew by a *constant*
    instead of a factor, the lengths would form an arithmetic series summing to
    O(n^2), and appending would be amortized *linear*. Same code, same interface,
    same big-O for a single append in the worst case — and a quadratic program.

    So "append is amortized O(1)" is not a fact about append. It is a fact about
    the growth policy, which lives in the implementation and which nothing in the
    interface guarantees. Workbook section 6's aggregate argument is doing real
    work here.

    Note also what amortized does NOT mean: it does not say every append is
    cheap. One of these appends copied 2000 elements. It says the *sequence*
    costs O(n) total. For a latency-sensitive path that distinction matters.
    """,
)

# %% [markdown]
# ## 3. Trace — the complete space account
#
# Workbook §8: space is more than returned data. Four categories, and the return
# value is only the first.

# %%
sample = DISTINCT[4000]
scan_peak = peak_memory(lambda: dedup_scan(sample))
hashed_peak = peak_memory(lambda: dedup_hashed(sample))

print(f"dedup_scan   peak: {scan_peak:>10,} bytes")
print(f"dedup_hashed peak: {hashed_peak:>10,} bytes")
print(f"ratio: {hashed_peak / scan_peak:.2f}x")
print()
print("Identical return values. dedup_hashed buys its linear time with a second")
print("data structure — that is auxiliary space, and it is invisible in the")
print("signature.")

# %%
SPACE_ACCOUNT = """
For dedup_hashed on n distinct events:
  Output space    :
  Auxiliary space :
  Stack space     :
  Retained space  :
"""
print(SPACE_ACCOUNT)

# %% [markdown]
# ## 4. The record

# %%
claim("COURSE MODEL", SPACE_ACCOUNT)

claim(
    "FINITE EXPERIMENT",
    f"2000 appends triggered {len(capacity_changes)} reallocations with a mean "
    f"growth factor of {mean_factor:.2f}; dedup_hashed peaks at "
    f"{hashed_peak / scan_peak:.2f}x dedup_scan's memory for the same return value.",
    support={
        "reallocations": len(capacity_changes),
        "meanGrowthFactor": round(mean_factor, 3),
        "elementsCopied": copied,
        "peakBytes": {"dedup_scan": scan_peak, "dedup_hashed": hashed_peak},
    },
)

non_claim(
    "tracemalloc counts Python-level allocations only — not the interpreter, not "
    "the OS allocator, not fragmentation. These numbers compare two "
    "representations against each other on one interpreter; they do not support "
    "any absolute claim about how much memory the program needs."
)

emit()

# %% [markdown]
# ## 5. Transfer
#
# 1. You measured a growth factor near 1.12. Nothing documents it. What would you
#    have to write in a cost model that depends on it, and would you rely on it?
# 2. Amortized O(1) says nothing about the worst single append. Name a system
#    where that distinction decides the design.
# 3. Session 5 puts a clock on the two deduplicators. Which of the four space
#    categories will the clock be unable to see?
#
# ---
#
# ## Attributions
#
# Authored for this course. No external material vendored.
