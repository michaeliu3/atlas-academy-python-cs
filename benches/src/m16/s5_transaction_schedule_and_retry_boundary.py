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
# # Bench m16-s5 — transaction schedule and retry boundary
#
# **Session 16.5 — Make import one transaction, then expose competition.** Rungs:
# **review and verify** (primary), debug and defend.
#
# The workbook asks for three things that look like one thing: inject a failure
# after event two and record what each connection sees; execute a written
# `A1, B1, A2, B2` schedule against a *named* engine and mode; and apply the
# `RetryClass` meanings exactly.
#
# They are three things, and the session's exit question is to tell them apart in
# a minute. This bench runs each one separately so the distinction is observed
# rather than recited: **atomicity** is about the prefix, **isolation** is about
# the other connection, **idempotency** is about the second attempt.
#
# Two connections need a shared database, so this bench writes a real file to a
# temporary directory rather than using `:memory:`, which is private per
# connection. The directory is removed at the end.
#
# **Requires:** Python 3.12+. Standard library only (`sqlite3`).

# %%
from _fixture import initialise, open_shared  # noqa: E402  (sets up sys.path)

import sqlite3  # noqa: E402
import sys  # noqa: E402
import tempfile  # noqa: E402
from pathlib import Path  # noqa: E402

from atlas_bench import (  # noqa: E402
    bench, check, checkpoint, claim, emit, non_claim, predict, resolve, reveal,
)

assert sys.version_info >= (3, 12)

bench(module=16, session=5, emits="transaction schedule and retry boundary",
      rungs=["review-and-verify", "debug-and-defend"])

workspace = tempfile.TemporaryDirectory(prefix="m16-s5-")
root = Path(workspace.name)

# %% [markdown]
# ## 1. The import, and the failure
#
# `ImportValidatedBundle.execute` applies four events. The third is rejected — a
# confidence above 1.0, which Session 2 established is one of the illegalities the
# schema genuinely stops.
#
# Two implementations of the same operation. One commits per event; one wraps the
# whole thing. Both are "correct" in the sense that neither writes an illegal row.

# %%
BUNDLE = [
    ("e-1", "c-invariant", 1, 0.4),
    ("e-2", "c-invariant", 2, 0.7),
    ("e-3", "c-invariant", 3, 1.5),   # <- rejected by the CHECK
    ("e-4", "c-locality", 1, 0.9),
]
INSERT = "INSERT INTO event VALUES (?, ?, ?, ?)"


def apply_per_event(connection, bundle) -> str:
    for row in bundle:
        try:
            connection.execute("BEGIN")
            connection.execute(INSERT, row)
            connection.execute("COMMIT")
        except sqlite3.Error as error:
            connection.execute("ROLLBACK")
            return type(error).__name__
    return "committed"


def apply_one_transaction(connection, bundle) -> str:
    try:
        connection.execute("BEGIN")
        for row in bundle:
            connection.execute(INSERT, row)
        connection.execute("COMMIT")
    except sqlite3.Error as error:
        connection.execute("ROLLBACK")
        return type(error).__name__
    return "committed"


# %%
predict(
    "The import fails on event three. A *second* connection queries the table "
    "afterwards. How many events does it see under each implementation?",
    answer="",  # <- fill in
    confidence="",  # sure / fairly sure / guessing
)

# %% [markdown]
# ## 2. Verify — atomicity, observed from the other connection

# %%
observed = {}
for label, implementation in (("commit per event", apply_per_event),
                              ("one transaction", apply_one_transaction)):
    path = root / f"{label.replace(' ', '-')}.db"
    writer = open_shared(path)
    initialise(writer)
    outcome = implementation(writer, BUNDLE)

    reader = open_shared(path)
    visible = reader.execute("SELECT event_id FROM event ORDER BY event_id").fetchall()
    observed[label] = {"outcome": outcome, "visible": [row[0] for row in visible]}
    writer.close()
    reader.close()

print(f"{'implementation':>18}  {'outcome':>16}  {'a second connection sees':>26}")
for label, row in observed.items():
    print(f"{label:>18}  {row['outcome']:>16}  {str(row['visible']):>26}")

prefix = observed["commit per event"]["visible"]
atomic = observed["one transaction"]["visible"]

checkpoint("both implementations report the same failure",
           observed["commit per event"]["outcome"]
           == observed["one transaction"]["outcome"] == "IntegrityError",
           "the caller cannot tell them apart from the exception")
checkpoint("commit-per-event leaves a visible prefix", prefix == ["e-1", "e-2"])
checkpoint("one transaction leaves nothing", atomic == [])
checkpoint("neither wrote an illegal row",
           "e-3" not in prefix and "e-3" not in atomic,
           "correctness of each row was never the question")

# %%
resolve(
    "The import fails on event three. A *second* connection queries the table "
    "afterwards. How many events does it see under each implementation?",
    "matched",  # matched / diverged / partial
)

# %%
reveal(
    "The import fails on event three. A *second* connection queries the table "
    "afterwards. How many events does it see under each implementation?",
    """
    Two events under commit-per-event, and none under one transaction.

    The prefix is the whole point. Both implementations raised the same
    `IntegrityError`, both refused to write the illegal row, and both are
    defensible line by line. The difference is a state that only one of them can
    produce: a database containing events 1 and 2 of a four-event import, with no
    record anywhere that it is a fragment.

    That state is worse than either success or failure, because it is
    *indistinguishable from success* to anyone who arrives later. A reader sees two
    events for `c-invariant`. Nothing marks them as partial. A retry that skips
    what is "already there" now builds on a prefix nobody chose.

    Notice where the choice lives. SQLite offers `BEGIN` and `COMMIT`; it does not
    decide how many statements go between them. `apply_import` does, which is why
    the session puts atomicity ownership at `ImportValidatedBundle.execute` and not
    in the adapter. The engine *realizes* atomicity; the application *chooses* the
    unit.

    That unit is the definition of the operation. "Import this bundle" either
    happened or did not; there is no bundle-shaped meaning to "two of four". If the
    code allows a state the domain has no name for, the transaction boundary is in
    the wrong place — and the test that catches it is not "did it raise", because
    both did. It is *what can another connection see*, which is why the second
    connection is in this experiment at all.

    One consequence for review: a receipt may only be written after the commit
    returns. A receipt written alongside the events, inside the same failed
    attempt, would have rolled back with them under one transaction — and survived
    under commit-per-event, claiming an import that did not happen.
    """,
)

# %% [markdown]
# ## 3. Verify — isolation, on a named engine and mode
#
# The schedule from the workbook, executed literally: **A1, B1, A2, B2**.

# %%
path = root / "schedule.db"
setup = open_shared(path)
initialise(setup)
journal_mode = setup.execute("PRAGMA journal_mode").fetchone()[0]
setup.close()

a = open_shared(path)
b = open_shared(path)


def step(connection, statement, values=()) -> str:
    try:
        connection.execute(statement, values)
    except sqlite3.Error as error:
        return f"{type(error).__name__}: {error}"
    return "ok"


step(a, "BEGIN")
schedule = [
    ("A1  insert e-1", step(a, INSERT, BUNDLE[0])),
    ("B1  insert e-4 (no BEGIN)", step(b, INSERT, BUNDLE[3])),
    ("A2  insert e-2", step(a, INSERT, BUNDLE[1])),
    ("B2  read count", str(b.execute("SELECT count(*) FROM event").fetchone()[0])),
]

print(f"engine: sqlite3 {sqlite3.sqlite_version}   journal_mode: {journal_mode}   "
      f"transactions: deferred   busy timeout: 0.2s\n")
for label, result in schedule:
    print(f"  {label:>26}  ->  {result}")

a.execute("COMMIT")
after_commit = b.execute("SELECT count(*) FROM event").fetchone()[0]
print(f"\n  after A commits, B reads     ->  {after_commit}")

b_blocked = schedule[1][1].startswith("OperationalError")
b_read_zero = schedule[3][1] == "0"

checkpoint("B's write is refused while A holds the write lock", b_blocked,
           schedule[1][1])
checkpoint("B's read sees none of A's uncommitted work", b_read_zero)
checkpoint("B sees them after A commits", after_commit == 2)
checkpoint("the mode is named, not assumed",
           journal_mode in {"delete", "wal", "truncate", "persist", "memory", "off"},
           f"journal_mode={journal_mode} — a different mode gives a different answer")

a.close()
b.close()

# %% [markdown]
# ## 4. Debug — idempotency, which is neither of the above
#
# The import committed. The process then died before the caller learned it had.
# The caller retries the whole operation with identical inputs, which is exactly
# what `SAME_IDENTITY` authorizes.

# %%
def replay(identity_from_run: bool) -> dict:
    path = root / f"replay-{identity_from_run}.db"
    if path.exists():
        path.unlink()
    connection = open_shared(path)
    initialise(connection)
    good = [row for row in BUNDLE if row[0] != "e-3"]

    attempts = []
    for run in (1, 2):
        rows = [(f"{row[0]}-run{run}" if identity_from_run else row[0], *row[1:])
                for row in good]
        # Positions must not collide either; give the replay its own block.
        rows = [(event_id, concept, position + (100 * (run - 1) if identity_from_run else 0),
                 confidence) for event_id, concept, position, confidence in rows]
        try:
            connection.execute("BEGIN")
            for row in rows:
                connection.execute(INSERT, row)
            connection.execute("COMMIT")
            attempts.append("committed")
        except sqlite3.Error as error:
            connection.execute("ROLLBACK")
            attempts.append(type(error).__name__)

    total = connection.execute("SELECT count(*) FROM event").fetchone()[0]
    connection.close()
    return {"attempts": attempts, "rows": total}


deterministic = replay(identity_from_run=False)
run_scoped = replay(identity_from_run=True)

print(f"{'event identity derived from':>30}  {'attempt 1':>11}  {'attempt 2':>15}  {'rows':>5}")
print(f"{'the bundle content':>30}  {deterministic['attempts'][0]:>11}  "
      f"{deterministic['attempts'][1]:>15}  {deterministic['rows']:>5}")
print(f"{'the run':>30}  {run_scoped['attempts'][0]:>11}  "
      f"{run_scoped['attempts'][1]:>15}  {run_scoped['rows']:>5}")

checkpoint("the identical retry is refused when identity comes from content",
           deterministic["attempts"][1] == "IntegrityError")
checkpoint("and leaves exactly one copy", deterministic["rows"] == 3)
checkpoint("the identical retry succeeds when identity comes from the run",
           run_scoped["attempts"][1] == "committed")
checkpoint("silently doubling the import", run_scoped["rows"] == 6,
           "same retry policy, same code path, same inputs — different key")

# %% [markdown]
# ## 5. Review and verify — apply the RetryClass meanings exactly
#
# - `NEVER` — unchanged replay cannot repair.
# - `SAME_IDENTITY` — retry the whole operation with identical identity and
#   fingerprint, **after a known abort or rollback**.
# - `CALLER_DECISION` — reconcile or escalate; automatic replay is not authorized
#   by the evidence available.

# %%
SITUATIONS = {
    "a": "IntegrityError on the CHECK; one transaction; rollback confirmed.",
    "b": "OperationalError 'database is locked'; nothing was written.",
    "c": "The process died between COMMIT and the caller learning the outcome.",
    "d": "Commit-per-event failed at event three, leaving a prefix.",
    "e": "The bundle committed; a later report says the numbers look wrong.",
}
for key, text in SITUATIONS.items():
    print(f"{key}. {text}")


def retry_class(key: str) -> str:
    """One of: NEVER, SAME_IDENTITY, CALLER_DECISION."""
    raise NotImplementedError("Apply the three definitions above, exactly")


# %%
check("retry_class", retry_class,
      [(("a",), "NEVER"), (("b",), "SAME_IDENTITY"), (("c",), "CALLER_DECISION"),
       (("d",), "CALLER_DECISION"), (("e",), "CALLER_DECISION")])
print()
print("(c) is the one that gets misclassified as SAME_IDENTITY: the inputs are")
print("identical and the operation is repeatable, so the definition looks to fit.")
print("It does not — the abort is not KNOWN. Section 4 shows what that costs when")
print("the identity is run-scoped, and why a content-derived key is the repair.")

# %% [markdown]
# ## 6. The retry boundary

# %%
RETRY_BOUNDARY = """
Atomicity, isolation, and idempotency — one sentence each, naming which
experiment above distinguishes it:
The transaction unit, and the domain reason it is that and not smaller:
The engine and mode I observed, stated so a reader knows what would change it:
The retry key, and what it is derived from:
The situation I would escalate rather than retry, and the evidence I lack:
"""
print(RETRY_BOUNDARY)

# %%
claim("REVIEW VERDICT", RETRY_BOUNDARY)

claim(
    "LOCAL REFERENCE RESULT",
    f"On sqlite3 {sqlite3.sqlite_version} in journal_mode={journal_mode} with "
    f"deferred transactions, a four-event import failing on event three leaves a "
    f"{len(prefix)}-event prefix visible to a second connection when each event is "
    f"committed separately, and {len(atomic)} events when the import is one "
    f"transaction — both raising IntegrityError. Under the A1,B1,A2,B2 schedule, "
    f"B's write is refused while A holds the write lock and B's read returns 0 "
    f"until A commits. An identical replay of a committed import inserts "
    f"{run_scoped['rows'] - deterministic['rows']} extra rows when event identity "
    f"is derived from the run rather than from the bundle content.",
    support={"sqliteVersion": sqlite3.sqlite_version, "journalMode": journal_mode,
             "atomicity": observed,
             "schedule": [{"step": s, "result": r} for s, r in schedule],
             "visibleAfterCommit": after_commit,
             "replay": {"contentDerivedIdentity": deterministic,
                        "runScopedIdentity": run_scoped}},
)

non_claim(
    "This is one SQLite database file, two connections, one process, and no real "
    "concurrency — the schedule is executed in a fixed order rather than raced. It "
    "establishes what these two implementations expose and how this engine responds "
    "to this interleaving in this journal mode. It does not measure lock contention "
    "under load, does not test WAL mode, does not establish any isolation level "
    "beyond what was observed, and demonstrates nothing about durability or crash "
    "recovery, which is Session 6's subject and needs a different apparatus."
)

emit()

# %%
workspace.cleanup()

# %% [markdown]
# ## 7. Transfer
#
# 1. Both implementations raised the same exception and only one was safe. Write
#    the reviewing rule this implies about what an error path proves.
# 2. The replay was authorized, identical, and wrong. Name the property an
#    operation needs before "retry with the same inputs" is safe.
# 3. Bench `m16-s2` found a rule that a runtime setting decided. State what the
#    journal mode and the foreign-key pragma have in common as review hazards.
#
# ---
#
# ## Attributions
#
# Module 16 has no checked-in reference model. The two import implementations, the
# executed schedule, and the replay comparison are this bench's own, built on
# stdlib `sqlite3`.
