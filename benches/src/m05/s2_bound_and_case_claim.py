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
# # Bench m05-s2 — bound-and-case claim
#
# **Session 5.2 — Bounds and cases.** Rungs: recognize, review and verify.
#
# The session launches by *"critiquing four underspecified performance statements
# from an agent"* and exits with a claim that distinguishes upper, lower, or tight
# bound, states its case and assumptions, and gives either a witness or a reason
# the statement is weak.
#
# This is a **review** bench. You will write almost no code. Patch review and
# agent-directed work is 20% of the course's evidence weight; targeted
# implementation is 5%.
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
    Counter, bench, check, checkpoint, claim, emit, non_claim, predict, resolve, reveal,
)
from _fixture import all_distinct, all_equal, dedup_scan_counted  # noqa: E402

assert sys.version_info >= (3, 12)

bench(
    module=5,
    session=2,
    emits="bound-and-case claim",
    rungs=["recognize", "review-and-verify"],
)

# %% [markdown]
# ## 1. Four statements from an agent
#
# These are the kind of thing a competent assistant produces: each is *defensible*,
# and each is missing something. Your job is to name what.

# %%
AGENT_STATEMENTS = {
    1: "dedup_scan is O(n^2), so it is slower than dedup_hashed.",
    2: "dedup_scan is Omega(n), because it must look at every event.",
    3: "dedup_hashed is O(n), so it scales linearly no matter what you feed it.",
    4: "dedup_scan takes n(n-1)/2 comparisons.",
}
for key, text in AGENT_STATEMENTS.items():
    print(f"{key}. {text}")

# %%
predict(
    "Exactly one of the four statements is true as written but too weak to be "
    "useful. Which number, and what would strengthen it?",
    answer="",
    confidence="",
)

# %% [markdown]
# ## 2. Recognize — classify each statement
#
# One of: `"unfalsifiable"` (no case given, so it is true of the best case too),
# `"true-but-weak"` (a correct bound that a stronger one supersedes),
# `"unconditional"` (a conditional claim stated without its condition), or
# `"case-free-exact"` (an exact count asserted without naming the input it holds for).

# %%
def classify_statement(number: int) -> str:
    """Return the defect in AGENT_STATEMENTS[number]."""
    raise NotImplementedError("Classify each of the four")


# %%
check(
    "classify_statement",
    classify_statement,
    [
        ((1,), "unfalsifiable"),
        ((2,), "true-but-weak"),
        ((3,), "unconditional"),
        ((4,), "case-free-exact"),
    ],
)

# %% [markdown]
# ## 3. Verify statement 4 against evidence
#
# Statement 4 asserts an exact count. Exact counts are checkable, so check it —
# on two different input families.

# %%
n = 64
counts = {}
for name, build in (("all-distinct", all_distinct), ("all-equal", all_equal)):
    counter = Counter()
    dedup_scan_counted(build(n), counter)
    counts[name] = counter.counts.get("comparison", 0)
    print(f"{name:>14}: {counts[name]:>6,} comparisons")
print(f"{'n(n-1)/2':>14}: {n * (n - 1) // 2:>6,}")

checkpoint(
    "statement 4 holds on all-distinct input",
    counts["all-distinct"] == n * (n - 1) // 2,
)
checkpoint(
    "statement 4 fails on all-equal input",
    counts["all-equal"] != n * (n - 1) // 2,
    f"actual {counts['all-equal']}, claimed {n * (n - 1) // 2}",
)

# %%
resolve(
    "Exactly one of the four statements is true as written but too weak to be "
    "useful. Which number, and what would strengthen it?",
    "matched",  # matched / diverged / partial
)

# %%
reveal(
    "Exactly one of the four statements is true as written but too weak to be "
    "useful. Which number, and what would strengthen it?",
    """
    Statement 2. It is *true*: dedup_scan is Omega(n), because it must inspect
    every event. But Omega(n) is also satisfied by an algorithm that is
    quadratic, cubic, or exponential — a lower bound of n rules almost nothing
    out. The strengthening is Omega(n^2) **on all-distinct input**, which you
    have a witness for from Session 1.

    Note what makes it weak. It is not wrong, imprecise, or missing a case. It is
    a correct claim that a stronger correct claim supersedes, and that is the
    hardest defect to see in review — nothing about it looks like an error.

    The other three fail differently:

    - **1** gives a bound with no case, so it is true of the best case too, where
      dedup_scan is linear. "O(n^2)" without a case cannot be contradicted by any
      input, which makes it unfalsifiable rather than strong. And "so it is
      slower" does not follow from an upper bound at all — workbook section 4,
      *faster is not a property of a symbol*.
    - **3** drops the condition. dedup_hashed is O(n) **expected**, assuming hash
      collisions stay rare. Feed it adversarially-chosen colliding keys and it is
      quadratic. "No matter what you feed it" is precisely the assumption the
      claim depends on, deleted.
    - **4** asserts an exact count with no input family. You just measured it
      failing on all-equal input by a factor of 32.
    """,
)

# %% [markdown]
# ## 4. Asymptotically better, observably slower
#
# The session's exit synthesis asks for one case where asymptotically better code
# is slower over the observed range. Construct it rather than asserting it.

# %%
def linear_with_big_constant(events: list[str]) -> int:
    """O(n), but pays ~200 units of work per element."""
    total = 0
    for event in events:
        for _ in range(200):
            total += len(event)
    return total


def quadratic_with_tiny_constant(events: list[str]) -> int:
    """O(n^2), but each unit of work is trivial."""
    total = 0
    for i in range(len(events)):
        for _ in range(i):
            total += 1
    return total


from atlas_bench import measure  # noqa: E402

for size in [50, 100, 200, 400]:
    data = all_distinct(size)
    linear = measure(lambda _: linear_with_big_constant(data), [0], repeats=3)[0]
    quad = measure(lambda _: quadratic_with_tiny_constant(data), [0], repeats=3)[0]
    verdict = "quadratic wins" if quad < linear else "linear wins"
    print(f"n={size:>4}  linear {linear * 1e6:>8.0f}us   quadratic {quad * 1e6:>8.0f}us   {verdict}")

print()
print("Somewhere in that range the ordering flips. Asymptotic claims describe the")
print("limit; the crossover point is where engineering actually happens, and no")
print("O() symbol tells you where it is.")

# %% [markdown]
# ## 5. The record
#
# Write the one bound-and-case claim you would defend. It must name the bound
# type, the case, the assumption, and either a witness or the reason it is weak.

# %%
MY_CLAIM = """
Bound type :
Case       :
Assumption :
Witness    :
"""
print(MY_CLAIM)

# %%
claim("MATHEMATICAL CLAIM", MY_CLAIM)

claim(
    "FINITE EXPERIMENT",
    f"An exact-count claim stated without a case fails by a factor of "
    f"{counts['all-distinct'] // max(counts['all-equal'], 1)} between all-distinct "
    f"and all-equal input at n={n}.",
    support=counts,
)

non_claim(
    "Reviewing four statements does not establish that these are the only ways a "
    "cost claim can be underspecified, nor that a statement passing all four "
    "checks is therefore true. Review finds defects; it does not confer "
    "correctness."
)

emit()

# %% [markdown]
# ## 6. Transfer
#
# 1. Statement 2 was wrong by being *weak*, not by being false. Name one place in
#    your own code review habits where a true-but-weak claim would pass.
# 2. Statement 3 deleted an assumption. Which module will explain the adversarial
#    input that breaks it?
# 3. Session 3 turns call shape into a recurrence. Before you start it: does a
#    recurrence give you an upper bound, a tight bound, or neither?
#
# ---
#
# ## Attributions
#
# Authored for this course. No external material vendored.
