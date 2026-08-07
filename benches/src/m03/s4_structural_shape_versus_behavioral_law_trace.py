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
# # Bench m03-s4 — structural-shape versus behavioral-law trace
#
# **Session 3.4 — Read Python interface mechanisms.** Rungs: **review and verify**
# (primary), recognize.
#
# One object, three judges. `isinstance` under `@runtime_checkable`, a structural
# signature check, and a property suite encoding the protocol's laws. Two say yes.
# The disagreement is the session.
#
# **Requires:** Python 3.12+. Standard library only.

# %%
from _fixture import (  # noqa: E402
    EventStore, ListEventStore, ReversingStore, SAMPLE, StudyEvent,
)

import inspect  # noqa: E402
import sys  # noqa: E402

from atlas_bench import (  # noqa: E402
    bench, check, checkpoint, claim, emit, non_claim, predict, resolve, reveal,
)

assert sys.version_info >= (3, 12)

bench(module=3, session=4, emits="structural-shape versus behavioral-law trace",
      rungs=["review-and-verify", "recognize"])

# %% [markdown]
# ## 1. Three judges

# %%
def judge_isinstance(store) -> bool:
    """@runtime_checkable isinstance check."""
    return isinstance(store, EventStore)


def judge_signatures(store) -> bool:
    """Method names present with compatible arity."""
    for name, arity in (("append", 1), ("history", 0)):
        method = getattr(store, name, None)
        if method is None or not callable(method):
            return False
        required = [
            p for p in inspect.signature(method).parameters.values()
            if p.default is p.empty and p.kind in
            (p.POSITIONAL_ONLY, p.POSITIONAL_OR_KEYWORD)
        ]
        if len(required) != arity:
            return False
    return True


def judge_laws(store_class) -> bool:
    """The protocol's behavioural laws, not its shape."""
    store = store_class()
    if store.history() != ():
        return False
    for event in SAMPLE:
        store.append(event)
    if store.history() != tuple(SAMPLE):          # order is part of the contract
        return False
    snapshot = store.history()
    store.append(StudyEvent("later", 1))
    if snapshot != tuple(SAMPLE):                 # snapshots must be stable
        return False
    return len(store.history()) == len(SAMPLE) + 1


# %%
predict(
    "ReversingStore has both methods with the right signatures and returns "
    "history newest-first. How many of the three judges accept it?",
    answer="",  # <- fill in
    confidence="",  # sure / fairly sure / guessing
)

# %%
CANDIDATES = {"ListEventStore": ListEventStore, "ReversingStore": ReversingStore}

print(f"{'candidate':>18}  {'isinstance':>11}  {'signatures':>11}  {'laws':>6}")
verdicts = {}
for name, cls in CANDIDATES.items():
    row = {
        "isinstance": judge_isinstance(cls()),
        "signatures": judge_signatures(cls()),
        "laws": judge_laws(cls),
    }
    verdicts[name] = row
    print(f"{name:>18}  {str(row['isinstance']):>11}  "
          f"{str(row['signatures']):>11}  {str(row['laws']):>6}")

checkpoint("isinstance accepts ReversingStore", verdicts["ReversingStore"]["isinstance"])
checkpoint("the signature check accepts it too", verdicts["ReversingStore"]["signatures"])
checkpoint("only the law suite rejects it", not verdicts["ReversingStore"]["laws"],
           "two of three judges cannot see the defect")

# %%
resolve(
    "ReversingStore has both methods with the right signatures and returns "
    "history newest-first. How many of the three judges accept it?",
    "matched",  # matched / diverged / partial
)

# %%
reveal(
    "ReversingStore has both methods with the right signatures and returns "
    "history newest-first. How many of the three judges accept it?",
    """
    Two. Only the law suite rejects it.

    `@runtime_checkable` changes what `isinstance` does to a Protocol, and the
    change is narrower than it reads: it checks that the named attributes
    **exist**. Not their signatures, not their return types, and certainly not
    what they do. An object with two callables named `append` and `history`
    passes, whatever those callables are.

    The signature check goes one step further and still stops short. It confirms
    arity, which rules out a genuinely different method that happens to share a
    name — and says nothing about ordering, stability, or append-only behaviour.

    The protocol's actual content is in its docstrings: *"append event **after
    all existing events**"* and *"return a stable immutable snapshot **in
    insertion order**"*. Those are behavioural laws. `ReversingStore` violates
    the second while satisfying every mechanical check Python offers.

    The consequence for review: a passing `isinstance` against a runtime-checkable
    Protocol is evidence of **shape**, and shape is the cheapest thing about an
    interface. Treating it as conformance is the specific error this session
    exists to prevent, and it is easy to make because the code reads like a type
    check.

    What actually verifies conformance is a suite the *protocol* owns, run
    against each implementation — which is why the laws here are written once and
    applied to both candidates rather than being reimplemented per class.
    """,
)

# %% [markdown]
# ## 2. Recognize — which judge would catch each defect?

# %%
DEFECTS = {
    "a": "An implementation missing history() entirely.",
    "b": "An implementation whose append() takes two required arguments.",
    "c": "An implementation that returns history oldest-first but as a list.",
    "d": "An implementation whose history() returns events in insertion order "
         "but re-sorted by topic.",
}
for key, text in DEFECTS.items():
    print(f"{key}. {text}")


def caught_by(key: str) -> str:
    """One of: isinstance, signatures, laws."""
    raise NotImplementedError("Name the weakest judge that catches each defect")


# %%
check("caught_by", caught_by,
      [(("a",), "isinstance"), (("b",), "signatures"),
       (("c",), "laws"), (("d",), "laws")])
print()
print("Only (a) is visible to isinstance, and it is the least likely defect to")
print("survive review in the first place.")

# %% [markdown]
# ## 3. Review and verify — write the missing law

# %%
def append_only_law(store_class) -> bool:
    """True if no operation can shorten or reorder existing history.

    The three laws above cover emptiness, order, and snapshot stability. Add the
    one they miss: appending must leave the existing prefix untouched.
    """
    raise NotImplementedError("Implement the append-only law")


# %%
check("append_only_law", append_only_law,
      [((ListEventStore,), True), ((ReversingStore,), False)])

REVIEW = """
What a passing isinstance against a runtime-checkable Protocol establishes:
What it does not:
The law that caught ReversingStore, quoted from the protocol docstring:
Where the law suite should live so every implementation is judged by it:
"""
print(REVIEW)

# %% [markdown]
# ## 4. The trace

# %%
claim("REVIEW VERDICT", REVIEW)

claim(
    "FINITE EXPERIMENT",
    f"ReversingStore passes isinstance under @runtime_checkable "
    f"({verdicts['ReversingStore']['isinstance']}) and a required-arity signature "
    f"check ({verdicts['ReversingStore']['signatures']}) while failing the "
    f"protocol's behavioural laws ({verdicts['ReversingStore']['laws']}).",
    support={"verdicts": verdicts},
)

non_claim(
    "Three judges on two implementations. This shows structural checks are weaker "
    "than behavioural ones, not that this law suite is complete — it tests "
    "emptiness, order, snapshot stability, and append-only, and says nothing "
    "about type rejection, concurrency, or persistence."
)

emit()

# %% [markdown]
# ## 5. Transfer
#
# 1. `isinstance` returned True for a store that reverses history. Write the
#    one-sentence rule about what `@runtime_checkable` buys you.
# 2. The laws lived in the bench, not in either class. Argue for that placement.
# 3. Bench `m01-s4` found three implementations agreeing on output. Which of the
#    three judges here would have separated them?
#
# ---
#
# ## Attributions
#
# Authored for this course. Module 3 has no checked-in reference model; the
# `EventStore` protocol mirrors workbook section 5.
