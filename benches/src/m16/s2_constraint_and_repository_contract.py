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
# # Bench m16-s2 — constraint and repository contract
#
# **Session 16.2 — Turn legal-state claims into constraints and a narrow port.**
# Rungs: **debug and defend** (primary), review and verify.
#
# The workbook asks you to predict an orphan insert *and name the foreign-key
# configuration assumption*. This bench runs the probe under both configurations,
# because the assumption is the answer.
#
# The session's exit question is a three-way sort: which illegality is
# **schema-impossible**, which is **application-rejected**, and which is
# **configuration-dependent**. Only running the probes tells you which bucket a
# given rule is actually in — the DDL looks the same either way.
#
# **Requires:** Python 3.12+. Standard library only (`sqlite3`).

# %%
from _fixture import connect, foreign_keys_enabled  # noqa: E402  (sets up sys.path)

import sqlite3  # noqa: E402
import sys  # noqa: E402

from atlas_bench import (  # noqa: E402
    bench, check, checkpoint, claim, emit, non_claim, predict, resolve, reveal,
)

assert sys.version_info >= (3, 12)

bench(module=16, session=2, emits="constraint and repository contract",
      rungs=["debug-and-defend", "review-and-verify"])

# %% [markdown]
# ## 1. The DDL, read in dependency order
#
# `event.concept_id` is declared `NOT NULL REFERENCES concept(concept_id)`. Read
# as a claim about legal states, that says: an event always names a concept, and
# the concept it names exists.
#
# One of those two halves is enforced by the schema. The other is not.

# %%
ORPHAN = ("e-orphan", "c-does-not-exist", 1, 0.5)
INSERT = "INSERT INTO event VALUES (?, ?, ?, ?)"


def attempt(connection, statement, values) -> str:
    """Run one statement; return 'accepted' or the exception class name."""
    try:
        connection.execute(statement, values)
    except sqlite3.Error as error:
        return type(error).__name__
    return "accepted"


# %%
predict(
    "The DDL says event.concept_id REFERENCES concept(concept_id). Insert an "
    "event naming a concept that does not exist. What happens?",
    answer="",  # <- fill in
    confidence="",  # sure / fairly sure / guessing
)

# %% [markdown]
# ## 2. Debug — the same insert under two configurations

# %%
default_connection = connect()
enforced_connection = connect(foreign_keys=True)

results = {
    "default connection": {
        "pragma": foreign_keys_enabled(default_connection),
        "orphan insert": attempt(default_connection, INSERT, ORPHAN),
    },
    "PRAGMA foreign_keys = ON": {
        "pragma": foreign_keys_enabled(enforced_connection),
        "orphan insert": attempt(enforced_connection, INSERT, ORPHAN),
    },
}

print(f"{'connection':>26}  {'pragma':>7}  {'orphan insert':>16}")
for name, row in results.items():
    print(f"{name:>26}  {str(row['pragma']):>7}  {row['orphan insert']:>16}")

orphans_present = default_connection.execute(
    "SELECT count(*) FROM event WHERE concept_id NOT IN (SELECT concept_id FROM concept)"
).fetchone()[0]
print(f"\norphan rows now sitting in the default connection's table: {orphans_present}")

checkpoint("the orphan insert is accepted by default",
           results["default connection"]["orphan insert"] == "accepted",
           "the REFERENCES clause parsed, was stored, and enforced nothing")
checkpoint("the identical statement is rejected with the pragma on",
           results["PRAGMA foreign_keys = ON"]["orphan insert"] == "IntegrityError")
checkpoint("the schema text is byte-identical in both cases", True,
           "nothing about the DDL distinguishes the two outcomes")

# %%
resolve(
    "The DDL says event.concept_id REFERENCES concept(concept_id). Insert an "
    "event naming a concept that does not exist. What happens?",
    "matched",  # matched / diverged / partial
)

# %%
reveal(
    "The DDL says event.concept_id REFERENCES concept(concept_id). Insert an "
    "event naming a concept that does not exist. What happens?",
    """
    It is accepted. The row lands in the table, and a query for events whose
    concept does not exist now returns it.

    SQLite parses `REFERENCES`, stores it, reports it back through
    `PRAGMA foreign_key_list`, and by default **does not enforce it**. Foreign-key
    enforcement is off unless a connection turns it on, for backward-compatibility
    reasons that are entirely about SQLite's history and not at all about your
    schema. The same DDL is a hard constraint or a comment depending on a runtime
    setting made somewhere else.

    That is what makes this the sharpest example in the module of a rule being
    **configuration-dependent** rather than schema-impossible. A `PRIMARY KEY`
    collision cannot happen on this table under any configuration: the storage
    layer would have to be broken. An orphan reference can happen on Tuesday and
    not on Wednesday, decided by one line in whatever code opened the connection.

    Three consequences follow, and they are the whole reason the session asks you
    to name the assumption:

    First, the pragma is **per connection**, not per database. A pool that opens
    ten connections must set it ten times. One that forgets on the tenth has a
    database with intermittent referential integrity.

    Second — and this is the trap the next cell demonstrates — the pragma is a
    **no-op inside a transaction**. It does not raise, does not warn, and does not
    return an error. It silently does nothing, and the code that issued it reads
    exactly like the code that worked.

    Third, the repository port is where this gets decided. `EventRepository` is an
    interface about events; `SqliteEventRepository` is where "and the concept it
    names exists" either becomes true or does not. A reviewer who reads only the
    DDL cannot tell which, and that is precisely why the session makes you read
    the port before the adapter.
    """,
)

# %% [markdown]
# ## 3. Debug — the pragma that silently does nothing

# %%
inside = connect()
inside.execute("BEGIN")
pragma_result = attempt(inside, "PRAGMA foreign_keys = ON", ())
took_effect_inside = foreign_keys_enabled(inside)
orphan_inside = attempt(inside, INSERT, ORPHAN)
inside.execute("ROLLBACK")

after_commit = attempt(inside, "PRAGMA foreign_keys = ON", ())
took_effect_outside = foreign_keys_enabled(inside)

print(f"pragma issued inside a transaction : {pragma_result}")
print(f"  foreign_keys afterwards          : {took_effect_inside}")
print(f"  orphan insert afterwards         : {orphan_inside}")
print(f"pragma issued outside              : {after_commit}")
print(f"  foreign_keys afterwards          : {took_effect_outside}")

checkpoint("the pragma inside a transaction raises nothing",
           pragma_result == "accepted",
           "no exception, no warning, no return value to check")
checkpoint("and has no effect", not took_effect_inside)
checkpoint("the identical statement outside a transaction works",
           took_effect_outside,
           "same text, same connection, different result")

# %% [markdown]
# ## 4. Review and verify — sort every rule into its bucket

# %%
probes = {
    "duplicate identity": ("e-1", "c-invariant", 9, 0.5),
    "duplicate position": ("e-9", "c-invariant", 1, 0.5),
    "null concept": ("e-9", None, 9, 0.5),
    "confidence above 1": ("e-9", "c-invariant", 9, 1.5),
    "confidence NaN": ("e-9", "c-invariant", 9, float("nan")),
    "orphan concept": ("e-9", "c-nope", 9, 0.5),
    "position 'seven'": ("e-9", "c-invariant", "seven", 0.5),
}

print(f"{'probe':>20}  {'FK off':>16}  {'FK on':>16}")
outcomes = {}
for label, values in probes.items():
    off = attempt(connect(), INSERT, values)
    on = attempt(connect(foreign_keys=True), INSERT, values)
    outcomes[label] = {"off": off, "on": on}
    print(f"{label:>20}  {off:>16}  {on:>16}")

configuration_dependent = [k for k, v in outcomes.items() if v["off"] != v["on"]]
accepted_everywhere = [k for k, v in outcomes.items()
                       if v["off"] == v["on"] == "accepted"]

print(f"\nconfiguration-dependent: {configuration_dependent}")
print(f"accepted under both    : {accepted_everywhere}")

checkpoint("exactly one probe changes verdict with configuration",
           configuration_dependent == ["orphan concept"])
checkpoint("at least one illegal-looking value is accepted under both",
           len(accepted_everywhere) > 0,
           f"{accepted_everywhere} — the schema never claimed to stop these")

# %% [markdown]
# ### What "accepted" actually means
#
# Two probes were accepted. Neither was *stored as sent*, and the difference
# between the two failures is worth more than the fact that both got through.

# %%
stored = connect()
stored.execute(INSERT, ("e-9", "c-invariant", 9, float("nan")))
stored.execute(INSERT, ("e-10", "c-invariant", "seven", 0.5))

print(f"{'event':>8}  {'sent':>10}  {'stored':>10}  {'typeof':>9}  {'column declared':>16}")
readback = {}
for event_id, column, sent, declared in (
    ("e-9", "confidence", "nan", "REAL"),
    ("e-10", "position", "'seven'", "INTEGER NOT NULL"),
):
    value, kind = stored.execute(
        f"SELECT {column}, typeof({column}) FROM event WHERE event_id = ?", (event_id,)
    ).fetchone()
    readback[event_id] = {"column": column, "sent": sent, "stored": value, "typeof": kind}
    print(f"{event_id:>8}  {sent:>10}  {str(value):>10}  {kind:>9}  {declared:>16}")

checkpoint("the NaN was not stored — it was converted to NULL",
           readback["e-9"]["typeof"] == "null",
           "the CHECK then passed on its `confidence IS NULL` branch, so the "
           "constraint was satisfied by a value the caller never sent")
checkpoint("'seven' is sitting in an INTEGER NOT NULL column, as text",
           readback["e-10"]["typeof"] == "text",
           "a declared column type is an affinity, not a constraint")

# %%
BUCKETS = """
schema-impossible      — no configuration permits it
configuration-dependent — one runtime setting decides
application-rejected   — the database will store it; something above must not send it
"""
print(BUCKETS)


def bucket(probe: str) -> str:
    """One of: schema-impossible, configuration-dependent, application-rejected."""
    raise NotImplementedError("Sort each probe using the table above")


# %%
check("bucket", bucket,
      [(("duplicate identity",), "schema-impossible"),
       (("duplicate position",), "schema-impossible"),
       (("null concept",), "schema-impossible"),
       (("confidence above 1",), "schema-impossible"),
       (("orphan concept",), "configuration-dependent"),
       (("confidence NaN",), "application-rejected"),
       (("position 'seven'",), "application-rejected")])
print()
print("The last two are the ones worth arguing about. Both looked covered — one by")
print("a CHECK, one by a column type — and neither was, in different ways:")
print("  the NaN was changed to satisfy the CHECK;")
print("  'seven' was stored as-is because a column type is an affinity, not a rule.")

# %% [markdown]
# ## 5. The constraint matrix

# %%
CONSTRAINT_MATRIX = """
The rule I assumed the DDL enforced, and what it actually enforced:
The configuration assumption, stated as a sentence a reviewer could check:
Where in the architecture that assumption must be established, and by whom:
The two illegal values the schema accepts, and what must reject them instead:
Why M15 validation and DB constraints defend different boundaries:
"""
print(CONSTRAINT_MATRIX)

# %%
claim("DEFENDED REPAIR", CONSTRAINT_MATRIX)

claim(
    "LOCAL REFERENCE RESULT",
    f"Against this schema on stdlib sqlite3 {sqlite3.sqlite_version}, an insert "
    f"naming a nonexistent concept is accepted on a default connection and raises "
    f"IntegrityError with PRAGMA foreign_keys = ON — the DDL text being identical. "
    f"Issuing that pragma inside a transaction raises nothing and has no effect. "
    f"Of {len(probes)} negative probes, {len(configuration_dependent)} changes "
    f"verdict with configuration and {len(accepted_everywhere)} are accepted under "
    f"both. Of those two, a NaN confidence is stored as NULL rather than rejected, "
    f"and the string 'seven' is stored as text in an INTEGER NOT NULL column.",
    support={"sqliteVersion": sqlite3.sqlite_version,
             "outcomes": outcomes,
             "configurationDependent": configuration_dependent,
             "acceptedUnderBoth": accepted_everywhere,
             "storedValues": readback,
             "pragmaInsideTransaction": {"raised": pragma_result,
                                         "tookEffect": took_effect_inside}},
)

non_claim(
    "This is one in-memory SQLite database opened by one process, on a non-STRICT "
    "table. It establishes that these rules are configuration-dependent *in "
    "SQLite*; it says nothing about PostgreSQL, MySQL, or any engine where foreign "
    "keys are enforced by default and column types are checked, does not test "
    "whether STRICT tables close the affinity gap, and measures no concurrency, no "
    "durability, and no performance."
)

emit()

# %% [markdown]
# ## 6. Transfer
#
# 1. The same DDL gave two different answers. Write the reviewing rule this
#    implies about reading a schema file.
# 2. The pragma failed silently inside a transaction. Name the general property
#    that makes a setting dangerous, independent of what it sets.
# 3. Bench `m15-s1` will separate validation at the boundary from validation in
#    the store. State which of `confidence NaN` and `orphan concept` belongs to
#    which, and why the answer is not symmetric.
#
# ---
#
# ## Attributions
#
# Module 16 has no checked-in reference model. The schema, the probe set, and the
# three-bucket sort are this bench's own, built on stdlib `sqlite3`.
