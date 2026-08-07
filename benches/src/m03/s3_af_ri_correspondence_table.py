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
# # Bench m03-s3 — AF/RI correspondence table
#
# **Session 3.3 — Connect representation to meaning.** Rungs: **trace**
# (primary), recognize.
#
# An AF/RI table is a static document: here is the representation, here is what
# it means, here is what must always be true. What it structurally cannot show is
# a state that is *temporarily illegal* — legal before the call, legal after, and
# invalid in between.
#
# **Requires:** Python 3.12+. Standard library only.

# %%
from _fixture import ChunkedEventStore, SAMPLE, StudyEvent  # noqa: E402

import sys  # noqa: E402

from atlas_bench import (  # noqa: E402
    bench, check, checkpoint, claim, emit, non_claim, predict, resolve, reveal,
)

assert sys.version_info >= (3, 12)

bench(module=3, session=3, emits="AF/RI correspondence table",
      rungs=["trace", "recognize"])

# %% [markdown]
# ## 1. The representation and its invariant
#
# `ChunkedEventStore` keeps events in fixed chunks of three.
#
# **RI:** every chunk except the last is full; the last is nonempty once any
# chunk has been added.
# **AF:** the abstract history is the chunks concatenated in order.

# %%
store = ChunkedEventStore()
print(f"empty store  : chunks={store._chunks}  RI holds={store.check_rep()}")
for event in SAMPLE:
    store.append(event)
print(f"after 3 events: chunks={[len(c) for c in store._chunks]}  "
      f"RI holds={store.check_rep()}")
print(f"history       : {[e.topic for e in store.history()]}")

checkpoint("the RI holds on an empty store", ChunkedEventStore().check_rep())
checkpoint("and after filling exactly one chunk", store.check_rep())

# %%
predict(
    "Appending a fourth event allocates a new chunk. Is there a moment during "
    "that call when the representation invariant is false?",
    answer="",  # <- fill in
    confidence="",  # sure / fairly sure / guessing
)

# %% [markdown]
# ## 2. Trace — check the invariant *during* the mutator

# %%
observations = []


def watch(target: ChunkedEventStore) -> None:
    observations.append({
        "chunks": [len(c) for c in target._chunks],
        "ri_holds": target.check_rep(),
    })


before = store.check_rep()
store.append(StudyEvent("graphs", 15), observer=watch)
after = store.check_rep()

print(f"RI before the call : {before}")
print(f"RI mid-call        : {observations[0]['ri_holds']}   chunks={observations[0]['chunks']}")
print(f"RI after the call  : {after}")

checkpoint("the RI holds before", before)
checkpoint("the RI is FALSE mid-operation", not observations[0]["ri_holds"],
           f"chunks {observations[0]['chunks']} — the new chunk is empty")
checkpoint("the RI holds again after", after)

# %%
resolve(
    "Appending a fourth event allocates a new chunk. Is there a moment during "
    "that call when the representation invariant is false?",
    "matched",  # matched / diverged / partial
)

# %%
reveal(
    "Appending a fourth event allocates a new chunk. Is there a moment during "
    "that call when the representation invariant is false?",
    """
    Yes — between allocating the new chunk and putting the event into it, the
    last chunk is empty, which the RI forbids.

    That window is invisible to every check placed at a call boundary. The
    workbook's `_check_rep()` discipline runs at the *start and end* of public
    operations, and both of those observations report `True`. The state in
    between is real, reachable, and illegal.

    Why it matters rather than being a curiosity:

    - **The RI is a contract about observable states, not about every instant.**
      An operation is allowed to pass through an invalid state as long as nothing
      can observe it. Naming that permission is part of what an AF/RI table is
      for, and it is exactly the part a table has no column for.
    - **"Nothing can observe it" is an assumption with a lifetime.** It holds
      while the mutator is single-threaded and exception-free. Add a callback, an
      exception between the two lines, or a second thread, and the window becomes
      observable — the callback here is precisely that.
    - **This is why `_check_rep()` is a tripwire, not a proof.** The workbook says
      as much: it is evidence and a debugging aid, not a security boundary. It
      samples the invariant where you chose to sample it.

    So the correspondence table needs a third column beyond representation and
    meaning: *when* the invariant is required to hold, and what makes the gap
    unobservable.
    """,
)

# %% [markdown]
# ## 3. What an exception in the window would leave behind

# %%
broken = ChunkedEventStore()
for event in SAMPLE:
    broken.append(event)


def raise_midway(target):
    raise RuntimeError("interrupted between allocation and insertion")


try:
    broken.append(StudyEvent("interrupted", 5), observer=raise_midway)
except RuntimeError as error:
    outcome = str(error)

print(f"exception raised    : {outcome}")
print(f"RI after the failure: {broken.check_rep()}")
print(f"chunks              : {[len(c) for c in broken._chunks]}")

checkpoint("the object is left in an illegal state", not broken.check_rep(),
           "the operation was not atomic with respect to the invariant")

# %% [markdown]
# ## 4. Recognize — where must the invariant hold?

# %%
MOMENTS = {
    "a": "Immediately after __init__ returns.",
    "b": "Between two statements inside append().",
    "c": "Immediately after append() returns normally.",
    "d": "After append() raises an exception.",
}
for key, text in MOMENTS.items():
    print(f"{key}. {text}")


def required(key: str) -> bool:
    """True when the RI must hold at that moment."""
    raise NotImplementedError("Decide where the RI is required")


# %%
check("required", required,
      [(("a",), True), (("b",), False), (("c",), True), (("d",), True)])
print()
print("(d) is the one this bench just violated. An operation that can raise")
print("owes the invariant on the failure path too, or it owes a documented")
print("exception-safety level that says otherwise.")

# %% [markdown]
# ## 5. The correspondence table

# %%
TABLE = """
Representation:
Abstraction function — what the representation means:
Representation invariant — what must always be true:
When 'always' actually means, including the mid-operation window:
What makes that window unobservable, and what would break that:
"""
print(TABLE)

# %%
claim("DEFINITION / MODEL", TABLE)

claim(
    "COUNTEREXAMPLE",
    f"ChunkedEventStore satisfies its representation invariant before and after "
    f"append ({before} / {after}) and violates it mid-operation "
    f"({observations[0]['ri_holds']}, chunks {observations[0]['chunks']}). An "
    f"exception raised in that window leaves the object permanently invalid.",
    support={"riBefore": before, "riMid": observations[0]["ri_holds"],
             "riAfter": after, "midChunks": observations[0]["chunks"],
             "riAfterException": broken.check_rep()},
)

non_claim(
    "One mutator on one representation. This shows a boundary check cannot see a "
    "mid-operation state, not that every mutator has such a window, nor that this "
    "store is otherwise correct. Concurrency makes the window observable for "
    "reasons Module 19 owns; nothing here tests that."
)

emit()

# %% [markdown]
# ## 6. Transfer
#
# 1. The invariant was false and no public operation could observe it. Write the
#    rule about what a representation invariant actually constrains.
# 2. The exception left the object invalid. Name the property an operation needs
#    so that failure does not corrupt state, and say which module owns it.
# 3. `_check_rep()` passed at both boundaries. State what a passing tripwire
#    establishes.
#
# ---
#
# ## Attributions
#
# Authored for this course. Module 3 has no checked-in reference model; the
# `_check_rep()` discipline mirrors workbook section 5.
