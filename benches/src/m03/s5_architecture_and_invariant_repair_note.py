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
# # Bench m03-s5 — architecture and invariant repair note
#
# **Session 3.5 — Recover architecture and debug an invariant.** Rungs: **debug
# and defend** (primary), map.
#
# A cache adds a second source of truth. The invariant that keeps them agreeing
# is unwritten, holds for most operations, and fails for exactly one — which the
# bench locates rather than the reader guessing.
#
# **Requires:** Python 3.12+. Standard library only.

# %%
from _fixture import CachedEventStore, SAMPLE, StudyEvent  # noqa: E402

import sys  # noqa: E402

from atlas_bench import (  # noqa: E402
    bench, check, checkpoint, claim, emit, non_claim, predict, resolve, reveal,
)

assert sys.version_info >= (3, 12)

bench(module=3, session=5, emits="architecture and invariant repair note",
      rungs=["debug-and-defend", "map"])

# %% [markdown]
# ## 1. Map — the second source of truth
#
# `CachedEventStore` holds `_events` and a memoised `_cache`. The unwritten
# invariant is: **whenever `_cache` is not None, it equals `tuple(_events)`.**

# %%
def cache_invariant(store: CachedEventStore) -> bool:
    return store._cache is None or store._cache == store.recomputed_history()


store = CachedEventStore()
print(f"fresh store       : invariant holds = {cache_invariant(store)}")
store.append(SAMPLE[0])
store.history()
print(f"after append+read : invariant holds = {cache_invariant(store)}")

checkpoint("the invariant holds after append and a read", cache_invariant(store))

# %%
predict(
    "CachedEventStore has two mutators: append() and append_many(). After "
    "exercising each and reading history(), which mutator leaves the cache "
    "disagreeing with the events?",
    answer="",  # <- fill in
    confidence="",  # sure / fairly sure / guessing
)

# %% [markdown]
# ## 2. Debug — check the invariant after every mutator

# %%
MUTATORS = {
    "append": lambda s: s.append(StudyEvent("added", 10)),
    "append_many": lambda s: s.append_many([StudyEvent("bulk-a", 5),
                                            StudyEvent("bulk-b", 5)]),
}

findings = {}
for name, mutate in MUTATORS.items():
    subject = CachedEventStore()
    subject.append(SAMPLE[0])
    subject.history()               # populate the cache
    mutate(subject)
    findings[name] = {
        "invariant": cache_invariant(subject),
        "cached": [e.topic for e in subject.history()],
        "actual": [e.topic for e in subject.recomputed_history()],
    }
    mark = "holds" if findings[name]["invariant"] else "VIOLATED"
    print(f"{name:>12}: invariant {mark}")
    if not findings[name]["invariant"]:
        print(f"{'':>12}  history()          -> {findings[name]['cached']}")
        print(f"{'':>12}  recomputed_history -> {findings[name]['actual']}")

culprit = [n for n, f in findings.items() if not f["invariant"]]
checkpoint("exactly one mutator breaks the invariant", len(culprit) == 1, culprit[0])
checkpoint("append is not the one", findings["append"]["invariant"])

# %%
resolve(
    "CachedEventStore has two mutators: append() and append_many(). After "
    "exercising each and reading history(), which mutator leaves the cache "
    "disagreeing with the events?",
    "matched",  # matched / diverged / partial
)

# %%
reveal(
    "CachedEventStore has two mutators: append() and append_many(). After "
    "exercising each and reading history(), which mutator leaves the cache "
    "disagreeing with the events?",
    """
    `append_many`. It extends `_events` and never clears `_cache`, so
    `history()` keeps returning the stale snapshot while the real events have
    moved on.

    What makes this the archetypal caching bug is not the missing line — it is
    the architecture that made the line necessary and did not enforce it:

    - **The cache introduced a second source of truth.** Before it, `history()`
      derived everything from `_events` and could not disagree with anything.
      After it, agreement is a property somebody has to maintain by hand.
    - **The invariant is unwritten.** No docstring says "`_cache` is None or
      equals `tuple(_events)`". It lives only in the author's head, which is why
      the second mutator does not obviously violate anything.
    - **It scales with the number of mutators, not with the size of the cache.**
      Every future method that touches `_events` inherits an obligation nothing
      reminds it of. `append_many` was almost certainly added later.

    The one-line repair — set `_cache = None` — is correct and is the weaker fix.
    The structural repair is to make invalidation impossible to forget: funnel
    every mutation through one private method that owns both fields, so the
    obligation lives in one place rather than in each new mutator.

    Note also how it was found. Reading `append_many` in isolation shows nothing
    wrong; it does exactly what its name says. The defect is only visible when
    you state the cross-field invariant and check it after every mutator — which
    is the technique, not the answer.
    """,
)

# %% [markdown]
# ## 3. Debug and defend — repair it structurally


# %%
class RepairedEventStore(CachedEventStore):
    """Same public behaviour, invalidation impossible to forget.

    Route every mutation through one place that owns both `_events` and
    `_cache`. A future mutator that uses that route cannot skip invalidation.
    """

    def append(self, event: StudyEvent) -> None:
        raise NotImplementedError("Implement via the shared mutation route")

    def append_many(self, events) -> None:
        raise NotImplementedError("Implement via the shared mutation route")


# %%
def survives_every_mutator(store_class) -> bool:
    """True when the cache invariant holds after each mutator in turn."""
    for mutate in MUTATORS.values():
        subject = store_class()
        subject.append(SAMPLE[0])
        subject.history()
        mutate(subject)
        if not cache_invariant(subject):
            return False
    return True


def history_still_correct(store_class) -> bool:
    """True when history() reflects everything appended, in order."""
    subject = store_class()
    subject.append(SAMPLE[0])
    subject.history()
    subject.append_many(SAMPLE[1:])
    return subject.history() == tuple(SAMPLE)


check("survives every mutator", survives_every_mutator,
      [((CachedEventStore,), False), ((RepairedEventStore,), True)])
check("history still correct", history_still_correct,
      [((RepairedEventStore,), True)])

REPAIR_NOTE = """
The unwritten invariant, stated:
The mutator that violated it, and why reading it alone looks fine:
The one-line fix, and why it is the weaker repair:
The structural fix, and what it makes impossible:
"""
print(REPAIR_NOTE)

# %% [markdown]
# ## 4. The note

# %%
claim("DEFENDED REPAIR", REPAIR_NOTE)

claim(
    "COUNTEREXAMPLE",
    f"Of two mutators on CachedEventStore, {culprit[0]} leaves the cache "
    f"disagreeing with the events: history() returns "
    f"{findings[culprit[0]]['cached']} while the events are "
    f"{findings[culprit[0]]['actual']}.",
    support={"findings": findings, "culprit": culprit},
)

non_claim(
    "Two mutators and one invariant. This locates a stale-cache defect and shows "
    "the technique that finds it; it does not establish that the repaired store "
    "is correct under concurrency, exceptions mid-mutation, or a mutator added "
    "later that bypasses the shared route entirely."
)

emit()

# %% [markdown]
# ## 5. Transfer
#
# 1. The cache created an obligation for every future mutator. State the general
#    cost of adding a second source of truth.
# 2. Reading `append_many` alone showed nothing wrong. Name what a reviewer would
#    need in front of them to catch it.
# 3. Bench `m03-s3` found an invariant violated mid-operation. Is this the same
#    kind of failure or a different one?
#
# ---
#
# ## Attributions
#
# Authored for this course. Module 3 has no checked-in reference model.
