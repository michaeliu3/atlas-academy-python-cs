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
# # Bench m09-s1 — ordered-operation decision ledger
#
# **Session 9.1 — Ordered questions force new operations.** Rungs: recognize.
#
# The session forbids container names and makes you name the *operation* each
# Atlas query needs. This bench holds you to that: the ledger you fill in is the
# session's declared artifact, and `emit()` refuses it while it is still blank.
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
from _fixture import REVIEWS, review_priority  # noqa: E402

assert sys.version_info >= (3, 12)

bench(module=9, session=1, emits="ordered-operation decision ledger", rungs=["recognize"])

# %% [markdown]
# ## 1. Five queries, no container names
#
# Workbook §4 gives Atlas five requests. Name the abstract operation each needs.

# %%
QUERIES = {
    "a": "Fetch the review for concept id 'bst'.",
    "b": "Which review is due next?",
    "c": "Which concepts start with 'hash'?",
    "d": "List every review due between 09:00 and 11:00.",
    "e": "After finishing 'bst', which review is next?",
}
for key, text in QUERIES.items():
    print(f"{key}. {text}")


def operation_for(key: str) -> str:
    """One of: exact-lookup, find-min, prefix-scan, range-scan, successor."""
    raise NotImplementedError("Name the operation each query requires")


# %%
check(
    "operation_for",
    operation_for,
    [
        (("a",), "exact-lookup"),
        (("b",), "find-min"),
        (("c",), "prefix-scan"),
        (("d",), "range-scan"),
        (("e",), "successor"),
    ],
)

# %% [markdown]
# ## 2. The four ordering decisions
#
# Workbook §5.2. An ordered collection missing any of these is underspecified,
# not merely imprecise.

# %%
ORDERING_DECISIONS = """
Key:
Direction:
Equality:
Tie:
"""
print(ORDERING_DECISIONS)
print("This IS the session's declared artifact. emit() refuses while it reads as")
print("a blank template — an earlier export in this course shipped exactly this")
print("template as though it were an answer, and nothing noticed.")

# %%
predict(
    "Two reviews share due_at and difficulty. Under review_priority, is their "
    "relative order stable, arbitrary, or determined?",
    answer="",
    confidence="",
)

# %%
ordered = sorted(REVIEWS, key=review_priority)
for review in ordered:
    print(f"{review.due_at:%H:%M}  d={review.difficulty}  {review.concept_id}")

tied = [r for r in REVIEWS if r.concept_id in {"bst", "amortized"}]
checkpoint(
    "the two tied reviews have identical due_at and difficulty",
    tied[0].due_at == tied[1].due_at and tied[0].difficulty == tied[1].difficulty,
)
checkpoint(
    "their order is fixed by the key's third element, not by input order",
    [r.concept_id for r in ordered].index("amortized")
    < [r.concept_id for r in ordered].index("bst"),
)

# %%
resolve(
    "Two reviews share due_at and difficulty. Under review_priority, is their "
    "relative order stable, arbitrary, or determined?",
    "matched",  # matched / diverged / partial
)

# %%
reveal(
    "Two reviews share due_at and difficulty. Under review_priority, is their "
    "relative order stable, arbitrary, or determined?",
    """
    Determined — by decision 4, not by luck.

    The key tuple's third element is concept_id, so "amortized" precedes "bst"
    by construction. The tie is broken *inside the key*, which is why the answer
    does not depend on which sort algorithm runs.

    Had the key been only (due_at, -difficulty), the answer would have been
    "stable" for `sorted` — Python's sort is stable, so input order would show
    through — and "arbitrary" for a heap, which is not stable. Same records, same
    intent, two different observable behaviours.

    That is the point of section 5.2: the tie decision belongs in the key, not in
    the data structure, because only the key travels with the policy. A heap that
    happens to produce the order you wanted is not a heap that guarantees it.
    """,
)

# %% [markdown]
# ## 3. The record

# %%
claim("ATLAS POLICY", ORDERING_DECISIONS)

claim(
    "FINITE EXPERIMENT",
    "Five Atlas queries require five distinct abstract operations; two records "
    "tied on due_at and difficulty resolve deterministically through the key's "
    "third element.",
    support={"queries": list(QUERIES), "drainOrder": [r.concept_id for r in ordered]},
)

non_claim(
    "Naming an operation does not select a representation. A hash table, a "
    "sorted array, a BST, a heap, and a trie each support a different subset of "
    "these five, and the choice needs the workload's operation mix — which this "
    "bench has not measured."
)

emit()

# %% [markdown]
# ## 4. Transfer
#
# 1. Which single representation supports all five operations, and what does it
#    cost relative to using two?
# 2. Query (b) asks only for the next review. Which of the other four would
#    become expensive if you optimised only for (b)?
#
# ---
#
# ## Attributions
#
# Authored for this course. No external material vendored.
