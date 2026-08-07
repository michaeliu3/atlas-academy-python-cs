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
# # Bench m02-s3 — termination-and-induction proof note
#
# **Session 2.3 — Termination and induction.** Rungs: **recognize** (primary), trace.
#
# A termination argument names a quantity that strictly decreases and cannot
# decrease forever. This bench instruments the recursion so the measure is
# *recorded at every call* — which turns "it decreases" from an assertion into a
# checked property, and shows exactly where the argument dies outside its domain.
#
# **Requires:** Python 3.12+. Standard library only.

# %%
from _fixture import *  # noqa: F401,F403,E402  (sets up sys.path)

import sys  # noqa: E402

from atlas_bench import (  # noqa: E402
    bench, check, checkpoint, claim, emit, non_claim, predict, resolve, reveal,
)

assert sys.version_info >= (3, 12)

bench(module=2, session=3, emits="termination-and-induction proof note",
      rungs=["recognize", "trace"])

# %% [markdown]
# ## 1. A countdown with an equality base case
#
# `steps_to_zero(n)` recurses on `n - 2` and stops when `n == 0`. The measure is
# `n` itself.

# %%
MEASURES: list[int] = []


def steps_to_zero(n: int, depth_cap: int = 60) -> int:
    """Count how many steps of size 2 reach zero. Base case: n == 0."""
    if depth_cap <= 0:
        raise RecursionError("depth cap reached")
    MEASURES.append(n)
    if n == 0:
        return 0
    return 1 + steps_to_zero(n - 2, depth_cap - 1)


def strictly_decreasing(measures: list[int]) -> bool:
    return all(later < earlier for earlier, later in zip(measures, measures[1:]))


# %%
MEASURES.clear()
steps = steps_to_zero(6)
print(f"steps_to_zero(6) = {steps}")
print(f"measure sequence : {MEASURES}")

checkpoint("it terminates on an even start", steps == 3)
checkpoint("the measure strictly decreases at every step",
           strictly_decreasing(MEASURES))
checkpoint("and it stays in the naturals",
           all(m >= 0 for m in MEASURES),
           "a strictly decreasing sequence of naturals must stop")

# %%
predict(
    "steps_to_zero recurses on n-2 and stops at n == 0. Called with an ODD "
    "number, which half of the termination argument fails — the strict decrease, "
    "or the lower bound?",
    answer="",  # <- fill in
    confidence="",  # sure / fairly sure / guessing
)

# %% [markdown]
# ## 2. Trace — start from an odd number

# %%
MEASURES.clear()
try:
    steps_to_zero(5)
    outcome = "completed"
except RecursionError:
    outcome = "hit the depth cap"

decrease_held = strictly_decreasing(MEASURES)
below_zero = [m for m in MEASURES if m < 0]

print(f"outcome              : {outcome}")
print(f"calls made           : {len(MEASURES)}")
print(f"first eight measures : {MEASURES[:8]}")
print(f"strict decrease held : {decrease_held}")
print(f"measures below zero  : {len(below_zero)}  e.g. {below_zero[:3]}")

checkpoint("the recursion does not terminate on its own", outcome == "hit the depth cap")
checkpoint("the strict decrease still holds", decrease_held,
           "the decreasing half of the argument is fine")
checkpoint("the lower bound is what fails",
           len(below_zero) > 0,
           "the measure steps over zero and runs off the bottom")

# %%
resolve(
    "steps_to_zero recurses on n-2 and stops at n == 0. Called with an ODD "
    "number, which half of the termination argument fails — the strict decrease, "
    "or the lower bound?",
    "matched",  # matched / diverged / partial
)

# %%
reveal(
    "steps_to_zero recurses on n-2 and stops at n == 0. Called with an ODD "
    "number, which half of the termination argument fails — the strict decrease, "
    "or the lower bound?",
    """
    The lower bound. The decrease never fails.

    A termination argument has two halves and they are independent:

    1. the measure **strictly decreases** on every recursive call;
    2. the measure is **bounded below** in a well-ordered set.

    From an odd start, the first half stays perfectly intact — 5, 3, 1, −1, −3,
    −5, every consecutive pair strictly smaller, which the check confirms. What
    breaks is the second: the base case is `n == 0`, the sequence steps *over*
    zero rather than landing on it, and the measure descends into negatives that
    no longer live in a well-ordered set.

    This is why "it obviously terminates, the argument keeps shrinking" is not a
    proof. Shrinking forever is exactly what a non-terminating recursion does.
    The well-ordering is what makes shrinking *finite*, and here it is destroyed
    by a base case testing equality where the step size is 2.

    The repair is one character of intent: `if n <= 0`. That turns the base case
    from a point the recursion must hit exactly into a region it cannot escape —
    and the difference only matters for inputs the even case never exercises.

    Notice what the depth cap did. Without it this cell would raise a genuine
    `RecursionError`, which reads like a stack problem and is really a domain
    problem. The cap makes the distinction visible: the recursion is not too
    deep, it is unbounded, and no larger stack would help.

    So the proof note owes three things, not one: the measure, the decrease, and
    **the precondition that keeps the measure in its well-ordered set**.
    """,
)

# %% [markdown]
# ## 3. Recognize — which half does each failure break?

# %%
FAILURES = {
    "a": "steps_to_zero(5) — an odd start with an `n == 0` base case.",
    "b": "A version that recurses on `n` unchanged.",
    "c": "A version recursing on `n - 2` with base case `n <= 0`, called with 5.",
    "d": "steps_to_zero(6) with the depth cap set to 2.",
}
for key, text in FAILURES.items():
    print(f"{key}. {text}")


def broken_half(key: str) -> str:
    """One of: decrease, lower-bound, neither."""
    raise NotImplementedError("Classify each failure")


# %%
check("broken_half", broken_half,
      [(("a",), "lower-bound"), (("b",), "decrease"),
       (("c",), "neither"), (("d",), "neither")])
print()
print("(c) and (d) are both 'neither', for different reasons: (c) is the repair,")
print("and (d) is a sound argument stopped by an external resource limit.")

# %% [markdown]
# ## 4. The proof note

# %%
PROOF_NOTE = """
The measure, as a function of the arguments:
Why it strictly decreases on every recursive call:
The well-ordered set it lives in:
The precondition that keeps it there, and what happens without it:
"""
print(PROOF_NOTE)

# %%
claim("THEOREM / PROOF", PROOF_NOTE)

claim(
    "COUNTEREXAMPLE",
    f"Called outside its precondition (an odd start), the measure still decreases "
    f"strictly at every step ({decrease_held}) while descending past zero "
    f"({len(below_zero)} measures below zero), so the recursion does not "
    f"terminate. The failing half of the argument is the lower bound, not the "
    f"decrease.",
    support={"strictDecreaseHeld": decrease_held,
             "measuresBelowZero": len(below_zero),
             "firstMeasures": MEASURES[:6],
             "outcome": outcome},
)

non_claim(
    "One measure on one recursion. This shows the two halves of a termination "
    "argument are independent — one can hold while the other fails — not that "
    "this measure is the only valid one, nor that every non-terminating "
    "recursion fails the same half."
)

emit()

# %% [markdown]
# ## 5. Transfer
#
# 1. The decrease held and the recursion did not terminate. Write the rule about
#    what a decreasing measure alone establishes.
# 2. Case (d) stopped for a reason that was not a termination failure. Name the
#    distinction that separates it from cases (a) and (c).
# 3. Session 4 measures stack depth. Is a recursion-limit crash evidence about
#    termination, about depth, or about neither?
#
# ---
#
# ## Attributions
#
# Authored for this course. Module 2 has no checked-in reference model.
