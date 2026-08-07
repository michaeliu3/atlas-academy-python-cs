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
# # Bench m05-s1 — explicit cost-model card
#
# **Session 5.1 — Count what the program actually does.** Rungs: recognize, trace.
#
# The session asks you to *"instrument equality checks for tiny inputs and compare
# observations with n(n−1)/2"*, and to leave with a card naming the input
# parameter, counted resource, primitive-operation assumption, worst-case witness,
# exact tiny-input count, and confidence.
#
# The workbook can state that formula. It cannot instrument anything. That is the
# whole reason this bench exists.
#
# **Requires:** Python 3.12+. Standard library only.

# %%
import sys
from pathlib import Path

# Benches run from their own pack directory, so `_fixture` is already importable.
# `atlas_bench` lives at the benches root, found by searching upward.
_start = Path.cwd()
for _candidate in (_start, *list(_start.parents)[:4]):
    if (_candidate / "atlas_bench").is_dir():
        sys.path.insert(0, str(_candidate))
        break
else:  # pragma: no cover
    raise RuntimeError(f"atlas_bench not found from {_start}")

from atlas_bench import (  # noqa: E402
    Counter, bench, check, checkpoint, claim, emit, non_claim, predict, resolve, reveal,
)
from _fixture import INPUT_FAMILIES, dedup_scan_counted  # noqa: E402

assert sys.version_info >= (3, 12), "Bench floor is CPython 3.12 (matches CI)."

bench(
    module=5,
    session=1,
    emits="explicit cost-model card",
    rungs=["recognize", "trace"],
)

# %% [markdown]
# ## 1. Recognize — what is actually being counted?
#
# Workbook §2 insists a cost model is an *explicit simplification*. Before any
# measurement, name the four things the model needs. A claim missing any of them
# is underspecified, not merely imprecise.

# %%
COST_MODEL_CARD = """
1. Input parameter    :
2. Counted resource   :
3. Primitive operation:
4. Case               : (best / worst / expected / amortized)
"""
print(COST_MODEL_CARD)
print("This card IS the session's declared artifact, so it goes into the record")
print("verbatim. emit() refuses while it still reads as a blank template — an")
print("earlier export in this course shipped exactly this template as if it were")
print("an answer, and nothing noticed.")

# %% [markdown]
# ## 2. Prediction
#
# Three input families, one function. Commit before you count.

# %%
predict(
    "Which of the three input families makes dedup_scan do the most comparisons "
    "at a given n: all-distinct, all-equal, or alternating-pair?",
    answer="",  # <- fill in
    confidence="",  # sure / fairly sure / guessing
)

# %% [markdown]
# ## 3. Trace — count, do not time
#
# Workbook §3: *count first; simplify second*. Counting measures the algorithm;
# timing measures your machine running it. This bench only counts. Session 5 is
# where the clock comes out, and where the two are made to disagree.

# %%
print(f"{'n':>6}  {'all-distinct':>13}  {'all-equal':>10}  {'alternating':>12}  {'n(n-1)/2':>10}")
counted: dict[str, list[int]] = {name: [] for name in INPUT_FAMILIES}

for n in [4, 8, 16, 32, 64]:
    row = []
    for name, build in INPUT_FAMILIES.items():
        counter = Counter()
        dedup_scan_counted(build(n), counter)
        comparisons = counter.counts.get("comparison", 0)
        counted[name].append(comparisons)
        row.append(comparisons)
    print(f"{n:>6}  {row[0]:>13,}  {row[1]:>10,}  {row[2]:>12,}  {n * (n - 1) // 2:>10,}")

# %%
resolve(
    "Which of the three input families makes dedup_scan do the most comparisons "
    "at a given n: all-distinct, all-equal, or alternating-pair?",
    "matched",  # matched / diverged / partial
)

# %%
reveal(
    "Which of the three input families makes dedup_scan do the most comparisons "
    "at a given n: all-distinct, all-equal, or alternating-pair?",
    """
    All-distinct, and it matches n(n-1)/2 exactly.

    `event not in seen` scans until it finds a match. With all-distinct input it
    never finds one, so iteration i costs i comparisons and the total is the
    triangular number. That exactness is worth pausing on: the count is not
    approximately quadratic, it is precisely n(n-1)/2, because nothing about the
    counting is statistical.

    All-equal costs exactly n-1: after the first insert, every scan hits on the
    first element. Alternating-pair is barely worse. Both are *best*-case shapes.

    This is what workbook §5 means by four different questions. "How expensive is
    dedup_scan?" has no answer. "How expensive is it on all-distinct input?" has
    an exact one — and all-distinct is the worst-case **witness**, which is the
    thing a worst-case claim actually requires. Without exhibiting an input that
    achieves the bound, a worst-case claim is an assertion, not a claim.
    """,
)

# %% [markdown]
# ## 4. The exact-count check
#
# A witness is only a witness if it hits the bound. Check it rather than trusting
# the table.

# %%
for index, n in enumerate([4, 8, 16, 32, 64]):
    checkpoint(
        f"all-distinct at n={n} equals n(n-1)/2",
        counted["all-distinct"][index] == n * (n - 1) // 2,
        f"counted {counted['all-distinct'][index]:,}",
    )

checkpoint(
    "all-equal is linear, not quadratic",
    counted["all-equal"][-1] == 63,
    f"counted {counted['all-equal'][-1]} at n=64; n-1 = 63",
)

# %% [markdown]
# ## 5. Recognize — classify four claims
#
# Each statement below is either well-formed or underspecified. A claim is
# underspecified when it omits the input parameter, the counted resource, or the
# case. Return `True` for well-formed.

# %%
CLAIMS = {
    "a": "dedup_scan performs n(n-1)/2 comparisons on all-distinct input of length n.",
    "b": "dedup_scan is slow.",
    "c": "dedup_scan is O(n^2).",
    "d": "dedup_hashed performs O(n) expected hash lookups on input of length n, "
         "assuming collisions stay rare.",
}


def well_formed(claim_key: str) -> bool:
    """True when the claim names input parameter, resource, and case."""
    raise NotImplementedError("Classify each claim")


# %%
check(
    "well_formed",
    well_formed,
    [(("a",), True), (("b",), False), (("c",), False), (("d",), True)],
)
print()
print("If you marked (c) well-formed: it names a bound and a resource by")
print("implication, but no case. Workbook §4 — 'Big O is not exactly' — and §5.")
print("An O() claim without a case is true of the best case too, which makes it")
print("unfalsifiable rather than strong.")

# %% [markdown]
# ## 6. The record

# %%
claim(
    "FINITE EXPERIMENT",
    "dedup_scan performs exactly n(n-1)/2 comparisons on all-distinct input, "
    "verified at n in {4, 8, 16, 32, 64}; all-equal input costs exactly n-1.",
    support={"sizes": [4, 8, 16, 32, 64], "counts": counted},
)

# The declared artifact itself. Left blank above, emit() refuses below.
claim("COURSE MODEL", COST_MODEL_CARD)

non_claim(
    "Five exact counts at n <= 64 do not establish the asymptotic bound. They are "
    "consistent with n(n-1)/2 and with infinitely many functions that agree there "
    "and diverge later. The bound comes from the argument in workbook section 3, "
    "not from this table."
)

emit()

# %% [markdown]
# ## 7. Exit synthesis
#
# The session's exit condition, in prose:
#
# 1. State why "one loop" does not establish linear time. Name the loop that
#    `dedup_scan`'s source does not show you.
# 2. You produced an exact count and a worst-case witness. Which of the two would
#    survive a change from `list` to `set` for `seen`, and which would not?
# 3. Session 2 asks for a *bound-and-case claim*. Write the one sentence you would
#    carry forward, and mark which part of it this bench actually established.
#
# ---
#
# ## Attributions
#
# Authored for this course. No external material vendored.
