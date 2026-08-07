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
# # Bench m02-s5 — recursive-failure-investigation memo
#
# **Session 2.5 — Code-reading and debugging studio.** Rungs: **debug and defend**
# (primary), trace.
#
# A recursive accumulator with a mutable default parameter. The first call is
# correct, every test that calls it once passes, and the bug needs two calls to
# exist at all.
#
# **Requires:** Python 3.12+. Standard library only.

# %%
from _fixture import *  # noqa: F401,F403,E402  (sets up sys.path)

import sys  # noqa: E402

from atlas_bench import (  # noqa: E402
    bench, check, checkpoint, claim, emit, non_claim, predict, resolve, reveal,
)

assert sys.version_info >= (3, 12)

bench(module=2, session=5, emits="recursive-failure-investigation memo",
      rungs=["debug-and-defend", "trace"])

# %% [markdown]
# ## 1. The function
#
# `flatten_topics` walks a nested structure and accumulates leaves.


# %%
def flatten_topics(node, accumulator=[]):
    """Collect every leaf string from a nested list into `accumulator`."""
    for item in node:
        if isinstance(item, list):
            flatten_topics(item, accumulator)
        else:
            accumulator.append(item)
    return accumulator


NESTED = ["recursion", ["induction", ["proof"]], "frames"]
EXPECTED = ["recursion", "induction", "proof", "frames"]

first = flatten_topics(NESTED)
print(f"first call : {first}")
checkpoint("the first call is correct", first == EXPECTED)

# %%
predict(
    "The first call returned the right answer. What does a second call with the "
    "same input return?",
    answer="",  # <- fill in
    confidence="",  # sure / fairly sure / guessing
)

# %% [markdown]
# ## 2. Trace — call it again

# %%
# Lengths must be captured AT the call. Every call returns the same object, so
# reading len() afterwards reports the final state for all of them — which is
# itself the clearest evidence of the aliasing.
length_at_call = [len(first)]
second = flatten_topics(NESTED)
length_at_call.append(len(second))
third = flatten_topics(NESTED)
length_at_call.append(len(third))

print(f"length at each call : {length_at_call}")
print(f"length read now     : {[len(first), len(second), len(third)]}")
print(f"\nsecond call returned: {second}")

checkpoint("the result grows by the input size on every call",
           length_at_call == [4, 8, 12])
checkpoint("the second call is wrong", length_at_call[1] != len(EXPECTED))
checkpoint("and all three names refer to ONE list",
           first is second is third,
           "so reading len() now reports 12 for all three")

# %% [markdown]
# ### Where the list actually lives

# %%
print(f"flatten_topics.__defaults__      : {flatten_topics.__defaults__}")
print(f"the default IS the returned list : "
      f"{flatten_topics.__defaults__[0] is first}")
print(f"id(default)                      : {id(flatten_topics.__defaults__[0])}")
print(f"id(first)                        : {id(first)}")

checkpoint("the default object is the accumulated list",
           flatten_topics.__defaults__[0] is first,
           "evaluated once, at def time — not once per call")

# %%
resolve(
    "The first call returned the right answer. What does a second call with the "
    "same input return?",
    "diverged",  # matched / diverged / partial
)

# %%
reveal(
    "The first call returned the right answer. What does a second call with the "
    "same input return?",
    """
    Eight items — the four correct ones, twice. The third returns twelve.

    Note how that had to be measured. Reading `len()` afterwards reports 12 for
    all three names, because there are not three lists to compare. The growth is
    only visible if you record the length *at* each call, and needing that
    workaround is already the answer.

    Default parameter values are evaluated **once, when the `def` statement
    runs**, and stored on the function object. `flatten_topics.__defaults__[0]`
    *is* the list every call has been appending to. It was never a fresh `[]` per
    call; there has only ever been one list, and `first is second is third`
    proves it.

    Three things this makes visible:

    - **Recursion is not the cause, but it hides the cause.** The recursive calls
      pass `accumulator` explicitly, so they behave correctly. Only the top-level
      call takes the default, which means the bug fires once per *external* call
      and is invisible inside the recursion you would naturally trace.
    - **A single-call test cannot see it.** The first call is genuinely correct.
      Any suite that constructs fresh inputs and asserts once passes forever. The
      reproduction requires calling twice, which is a property of the *test*, not
      of the input.
    - **The output being right is not evidence.** This is the same lesson as
      bench `m01-s4` from a different direction: there, three implementations
      agreed on output and differed in ownership. Here one implementation agrees
      with itself on the first call and differs on the second. Equality of one
      observation is the weakest evidence a test can offer.

    The repair is `accumulator=None` with `accumulator = [] if accumulator is
    None else accumulator` — which creates the list at *call* time, where the
    reader assumed it was being created all along.
    """,
)

# %% [markdown]
# ## 3. Debug and defend — repair it and prove the repair


# %%
def flatten_topics_fixed(node, accumulator=None):
    """Same contract, without shared state between calls."""
    raise NotImplementedError("Implement the repair")


# %%
def repeated_calls_are_independent(function) -> bool:
    """True if calling twice with the same input gives the same answer."""
    return function(NESTED) == function(NESTED) == EXPECTED


def caller_supplied_accumulator_still_works(function) -> bool:
    """True if an explicitly passed accumulator is still appended to."""
    supplied = ["existing"]
    result = function(NESTED, supplied)
    return result is supplied and result == ["existing"] + EXPECTED


check("repeated calls are independent", repeated_calls_are_independent,
      [((flatten_topics_fixed,), True)])
check("caller-supplied accumulator still works",
      caller_supplied_accumulator_still_works,
      [((flatten_topics_fixed,), True)])

print()
print("The second property matters: a repair that always allocates internally")
print("and ignores the argument would pass the first check and break callers")
print("who rely on accumulating into their own list.")

DEFENCE = """
Where the shared object lives, named precisely:
When it was created, and when the reader assumed it was created:
Why a single-call test cannot detect this:
Why my repair does not break a caller who passes their own accumulator:
"""
print(DEFENCE)

# %% [markdown]
# ## 4. The memo

# %%
claim("DEFENDED REPAIR", DEFENCE)

claim(
    "COUNTEREXAMPLE",
    f"flatten_topics returns {len(first)}, {len(second)}, then {len(third)} items "
    f"across three identical calls; all three results are the same object, which "
    f"is flatten_topics.__defaults__[0]. The first call is correct.",
    support={"lengths": [len(first), len(second), len(third)],
             "sameObject": first is second is third,
             "defaultIsResult": flatten_topics.__defaults__[0] is first},
)

non_claim(
    "`__defaults__` is a CPython-visible attribute; the once-at-definition "
    "evaluation rule is a language guarantee, but the ability to inspect the "
    "stored object is not. This also exercises one shared-state mechanism — a "
    "mutable default — and says nothing about class attributes, closures, or "
    "module-level state, which fail the same way for different reasons."
)

emit()

# %% [markdown]
# ## 5. Transfer
#
# 1. The first call was correct. Write the rule about what a passing test
#    establishes when the test calls the function once.
# 2. The recursive calls were innocent. Explain why tracing the recursion would
#    not have found this bug.
# 3. Bench `m01-s4` found three implementations agreeing on output and differing
#    in ownership. State what both benches have in common about *evidence*.
#
# ---
#
# ## Attributions
#
# Authored for this course. Module 2 has no checked-in reference model.
