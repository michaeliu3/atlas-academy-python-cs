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
# # Bench m16-s3 — result contract and query reasoning
#
# **Session 16.3 — Specify query results before reading syntax.** Rungs: **trace**
# (primary), recognize.
#
# The workbook has you hand-trace a join, move a predicate between `ON` and
# `WHERE`, then query without `ORDER BY` and explain why the observed order proves
# nothing. All three are claims about what a *result contract* has to pin down.
#
# This bench executes them. The predicate move changes the answer; the missing
# `ORDER BY` produces a stable-looking order that an index then reverses.
#
# **Requires:** Python 3.12+. Standard library only (`sqlite3`).

# %%
from _fixture import connect  # noqa: E402  (sets up sys.path)

import sqlite3  # noqa: E402
import sys  # noqa: E402

from atlas_bench import (  # noqa: E402
    bench, check, checkpoint, claim, emit, non_claim, predict, resolve, reveal,
)

assert sys.version_info >= (3, 12)

bench(module=16, session=3, emits="result contract and query reasoning",
      rungs=["trace", "recognize"])

# %% [markdown]
# ## 1. The data, and the question
#
# Three concepts. `c-invariant` has three events (one with a null confidence),
# `c-locality` has one, and `c-orphan` has none. The empty concept is what makes
# a left join differ from an inner one.
#
# The logical question: **"list every concept together with its confident events,
# keeping concepts that have none."**

# %%
database = connect()

print(f"{'concept':>14}  {'events':>6}")
for concept_id, count in database.execute(
    "SELECT c.concept_id, count(e.event_id) FROM concept c "
    "LEFT JOIN event e ON e.concept_id = c.concept_id "
    "GROUP BY c.concept_id ORDER BY c.concept_id"
):
    print(f"{concept_id:>14}  {count:>6}")

ON_FORM = """
SELECT c.concept_id, e.event_id
  FROM concept c
  LEFT JOIN event e
    ON e.concept_id = c.concept_id
   AND e.confidence > 0.5
"""

WHERE_FORM = """
SELECT c.concept_id, e.event_id
  FROM concept c
  LEFT JOIN event e
    ON e.concept_id = c.concept_id
 WHERE e.confidence > 0.5
"""

# %%
predict(
    "Two LEFT JOINs, identical except that `e.confidence > 0.5` sits in the ON "
    "clause of one and the WHERE clause of the other. Do they return the same "
    "rows?",
    answer="",  # <- fill in
    confidence="",  # sure / fairly sure / guessing
)

# %% [markdown]
# ## 2. Trace — move one predicate between two clauses

# %%
on_rows = database.execute(ON_FORM).fetchall()
where_rows = database.execute(WHERE_FORM).fetchall()

print("predicate in ON:")
for row in on_rows:
    print(f"  {row}")
print("\npredicate in WHERE:")
for row in where_rows:
    print(f"  {row}")

on_concepts = {row[0] for row in on_rows}
where_concepts = {row[0] for row in where_rows}
dropped = sorted(on_concepts - where_concepts)

print(f"\nrows: {len(on_rows)} against {len(where_rows)}")
print(f"concepts present in ON and absent from WHERE: {dropped}")

checkpoint("the two forms do not agree", on_rows != where_rows)
checkpoint("the WHERE form silently drops the concept with no events",
           dropped == ["c-orphan"],
           "the outer join produced a NULL row, then WHERE tested NULL > 0.5")
checkpoint("every concept survives the ON form",
           on_concepts == {"c-invariant", "c-locality", "c-orphan"})

# %%
resolve(
    "Two LEFT JOINs, identical except that `e.confidence > 0.5` sits in the ON "
    "clause of one and the WHERE clause of the other. Do they return the same "
    "rows?",
    "matched",  # matched / diverged / partial
)

# %%
reveal(
    "Two LEFT JOINs, identical except that `e.confidence > 0.5` sits in the ON "
    "clause of one and the WHERE clause of the other. Do they return the same "
    "rows?",
    """
    No. The `WHERE` form quietly turns the outer join back into an inner one.

    Trace the order of operations. The join runs first, and because it is a LEFT
    JOIN it emits a row for `c-orphan` with every `event` column set to NULL. Then
    `WHERE e.confidence > 0.5` evaluates against that row — and `NULL > 0.5` is not
    false, it is **unknown**, which `WHERE` discards exactly as it discards false.
    The row the outer join was written to preserve is removed by the filter.

    In the `ON` form the predicate is part of the *join condition*. It decides
    which event rows match a concept; concepts that end up matching nothing still
    get their NULL-extended row, because that is what LEFT JOIN means.

    So the two queries answer different questions, and the English gives it away
    once you know to listen: "concepts with their confident events, keeping
    concepts that have none" is the ON form. "Confident events, labelled with their
    concept" is the WHERE form. Both are reasonable questions. Only one was asked.

    This is the failure mode the session is built around, and it has a specific
    shape: **the query returns rows, all of them correct, and the wrong number of
    them.** Nothing raises. There is no NULL in the output to notice, because the
    row that would have contained the NULL is the row that vanished. A test that
    checks "every returned row is a genuinely confident event" passes on both.

    Which is why the result contract has to be written first, and has to state
    cardinality: *one row per concept, three rows for three concepts.* That
    sentence distinguishes the two queries before either is written, and it is
    checkable. "Get the confident events for each concept" distinguishes nothing.

    The general rule, worth more than the SQLite specifics: a predicate on the
    nullable side of an outer join belongs in `ON`. If it is in `WHERE`, the outer
    join is decoration.
    """,
)

# %% [markdown]
# ## 3. Trace — the order that proves nothing

# %%
UNORDERED = "SELECT event_id, confidence FROM event WHERE confidence > 0.3"

plain = connect()
indexed = connect()
indexed.execute("CREATE INDEX idx_confidence ON event(confidence DESC)")

plain_plan = plain.execute("EXPLAIN QUERY PLAN " + UNORDERED).fetchall()
indexed_plan = indexed.execute("EXPLAIN QUERY PLAN " + UNORDERED).fetchall()

plain_order = [row[0] for row in plain.execute(UNORDERED)]
indexed_order = [row[0] for row in indexed.execute(UNORDERED)]

repeats = [[row[0] for row in plain.execute(UNORDERED)] for _ in range(5)]

print("same SQL text, same rows, same data:")
print(f"  without an index: {plain_order}")
print(f"  with an index   : {indexed_order}")
print(f"\n  plan without: {plain_plan[0][-1]}")
print(f"  plan with   : {indexed_plan[0][-1]}")
print(f"\n  five repeats of the unindexed query: "
      f"{'identical every time' if all(r == plain_order for r in repeats) else repeats}")

checkpoint("the unindexed order is perfectly repeatable",
           all(run == plain_order for run in repeats),
           "which is exactly what makes it tempting to rely on")
checkpoint("adding an index reverses it",
           indexed_order == list(reversed(plain_order)))
checkpoint("both results are correct",
           set(plain_order) == set(indexed_order),
           "the query never asked for an order, so neither answer is wrong")

# %% [markdown]
# ## 4. Trace — where the NULL goes in an aggregate

# %%
totals = database.execute(
    "SELECT count(*), count(confidence), avg(confidence), sum(confidence) "
    "FROM event WHERE concept_id = 'c-invariant'"
).fetchone()
rows, non_null, average, total = totals

print(f"c-invariant has {rows} events; {non_null} carry a confidence.")
print(f"  count(*)          = {rows}")
print(f"  count(confidence) = {non_null}")
print(f"  avg(confidence)   = {average}")
print(f"  sum(confidence)   = {total}")
print(f"\n  sum / count(*)          = {total / rows:.4f}   <- 'average confidence'?")
print(f"  sum / count(confidence) = {total / non_null:.4f}   <- what avg() returned")

checkpoint("count(*) and count(confidence) disagree", rows != non_null)
checkpoint("avg() divides by the non-null count, not the row count",
           abs(average - total / non_null) < 1e-12)
checkpoint("the two readings of 'average confidence' differ",
           abs(total / rows - average) > 1e-9,
           f"{total / rows:.4f} against {average:.4f} — the contract must say which")

# %% [markdown]
# ## 5. Recognize — what a result contract has to pin down

# %%
CONTRACT_TERMS = {
    "a": "Which columns, and their types.",
    "b": "Cardinality — how many rows for a given input.",
    "c": "Whether the row order is guaranteed.",
    "d": "How NULLs are treated by each aggregate.",
    "e": "Which index the engine will use.",
}
for key, text in CONTRACT_TERMS.items():
    print(f"{key}. {text}")


def belongs_in_contract(key: str) -> bool:
    """True when this is part of the LOGICAL result contract."""
    raise NotImplementedError("Decide which terms the contract owns")


# %%
check("belongs_in_contract", belongs_in_contract,
      [(("a",), True), (("b",), True), (("c",), True),
       (("d",), True), (("e",), False)])
print()
print("(e) is the one to argue about. The index changed the row order above, so it")
print("clearly affects what you observe — but a contract the engine is free to")
print("satisfy any way it likes is the only kind that survives a new index.")
print("That separation is what Session 4 measures.")

# %% [markdown]
# ## 6. The result contract

# %%
RESULT_CONTRACT = """
The question in English, phrased so ON and WHERE are distinguishable:
Columns and types:
Cardinality, stated as a number for this fixture:
Order — guaranteed, or explicitly unspecified:
NULL rules, one line per aggregate used:
The observation from this bench that I would have got wrong:
"""
print(RESULT_CONTRACT)

# %%
claim("COURSE MODEL", RESULT_CONTRACT)

claim(
    "LOCAL REFERENCE RESULT",
    f"On stdlib sqlite3 {sqlite3.sqlite_version}, moving `e.confidence > 0.5` from "
    f"the ON clause of a LEFT JOIN to the WHERE clause drops {len(on_rows) - len(where_rows)} "
    f"row(s) — the concept with no events — leaving every remaining row correct. "
    f"An unordered query returns {plain_order} repeatably across five runs and "
    f"{indexed_order} once a descending index exists, with no change to the SQL "
    f"text. On the same data, avg(confidence) is {average} while sum/count(*) is "
    f"{total / rows:.4f}.",
    support={"sqliteVersion": sqlite3.sqlite_version,
             "onRows": on_rows, "whereRows": where_rows, "droppedConcepts": dropped,
             "unorderedWithoutIndex": plain_order,
             "unorderedWithIndex": indexed_order,
             "plans": {"withoutIndex": plain_plan[0][-1],
                       "withIndex": indexed_plan[0][-1]},
             "aggregate": {"countStar": rows, "countConfidence": non_null,
                           "avg": average, "sum": total}},
)

non_claim(
    "These are results from one in-memory SQLite database with four event rows. "
    "The ON/WHERE difference and the NULL aggregate rules are standard SQL and "
    "hold generally; the specific row orders are artifacts of this engine's "
    "planner on this data and would be different — and equally unguaranteed — on "
    "another engine, another version, or more rows. This bench measures no "
    "performance and establishes nothing about which plan is faster."
)

emit()

# %% [markdown]
# ## 7. Transfer
#
# 1. The unordered query was repeatable five times and still unguaranteed. Write
#    the rule this implies about inferring a contract from observed behaviour.
# 2. Both queries returned only correct rows. Name the property a test must have
#    to catch the WHERE-form defect, and say why row-level assertions cannot.
# 3. Bench `m16-s2` found a constraint that was configuration-dependent. State
#    what that and the index-dependent row order have in common.
#
# ---
#
# ## Attributions
#
# Module 16 has no checked-in reference model. The schema, the two join forms, and
# the index-order demonstration are this bench's own, built on stdlib `sqlite3`.
