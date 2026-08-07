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
# # Bench m21-s2 — task lifetime boundary note
#
# **Session 21.2 — Structured lifetime gives a boundary, not magic rollback.**
# Rungs: **debug and defend** (primary), review and verify.
#
# `TaskGroup` is the rare concurrency primitive that does exactly what it says: no
# task outlives the block, and a failing child cancels its siblings. It is so
# clean that it invites a stronger reading — *the group either fully happened or
# fully did not.*
#
# This bench runs the real event loop and shows the sibling being cancelled
# **after** it has already recorded an effect that no cancellation touches.
#
# No sockets, no clocks, no second machine. `asyncio` is the subject here, and it
# is entirely in this process.
#
# **Requires:** Python 3.12+. Standard library only.

# %%
from _fixture import *  # noqa: F401,F403,E402  (sets up sys.path)

import asyncio  # noqa: E402
import sys  # noqa: E402

from atlas_bench import (  # noqa: E402
    bench, check, checkpoint, claim, emit, non_claim, predict, resolve, reveal,
    run_async,
)
from module21_reference import run_taskgroup_failure_probe  # noqa: E402

assert sys.version_info >= (3, 12)

bench(module=21, session=2, emits="task lifetime boundary note",
      rungs=["debug-and-defend", "review-and-verify"])

# %% [markdown]
# ## 1. The lifetime guarantee, observed

# %%
probe = run_async(run_taskgroup_failure_probe())

print("reference trace of one owned TaskGroup failure:")
for index, event in enumerate(probe.trace):
    print(f"  {index}. {event}")

print(f"\nevidence scope: {probe.evidence_scope}")
print(f"non-claim     : {probe.non_claim}")

checkpoint("the sibling is cancelled and cleaned up",
           "SIBLING_CANCELLED_AND_CLEANED" in probe.trace)
checkpoint("the owner observes an ExceptionGroup",
           "OWNER_OBSERVED_EXCEPTION_GROUP" in probe.trace)
checkpoint("cancellation happens after the sibling started",
           probe.trace.index("SIBLING_STARTED")
           < probe.trace.index("SIBLING_CANCELLED_AND_CLEANED"),
           "there is an interval in which the sibling was running")

# %%
predict(
    "A TaskGroup's failing child cancels its sibling, and the sibling is cleaned "
    "up. The sibling had already appended a row to a shared ledger. After the "
    "group exits, how many rows are in the ledger?",
    answer="",  # <- fill in
    confidence="",  # sure / fairly sure / guessing
)

# %% [markdown]
# ## 2. Debug — give the sibling an effect to leave behind

# %%
LEDGER: list[str] = []


async def sibling_that_commits(started: asyncio.Event) -> None:
    """Records a decision, then waits. The record happens before the failure."""
    LEDGER.append("sibling: decision recorded")
    started.set()
    try:
        await asyncio.sleep(3600)
    except asyncio.CancelledError:
        LEDGER.append("sibling: cancellation observed")
        raise


async def failing_child(started: asyncio.Event) -> None:
    await started.wait()          # ensure the sibling got to record first
    raise RuntimeError("upstream rejected the batch")


async def owned_group() -> str:
    started = asyncio.Event()
    observed = "no exception"
    try:
        async with asyncio.TaskGroup() as group:
            group.create_task(sibling_that_commits(started))
            group.create_task(failing_child(started))
    except* RuntimeError as errors:
        # `return` is not permitted inside an except* block.
        observed = f"ExceptionGroup with {len(errors.exceptions)} RuntimeError"
    return observed


outcome = run_async(owned_group())

print(f"group outcome: {outcome}\n")
print("ledger after the group exited:")
for row in LEDGER:
    print(f"  {row}")

decision_rows = [row for row in LEDGER if "decision recorded" in row]

checkpoint("the group raised, as structured concurrency promises",
           outcome.startswith("ExceptionGroup"))
checkpoint("the sibling did observe its cancellation",
           any("cancellation observed" in row for row in LEDGER),
           "so the cancellation genuinely reached it")
checkpoint("and the decision it had already recorded is still there",
           len(decision_rows) == 1,
           "cancellation unwound the task; it did not unwind the effect")

# %%
resolve(
    "A TaskGroup's failing child cancels its sibling, and the sibling is cleaned "
    "up. The sibling had already appended a row to a shared ledger. After the "
    "group exits, how many rows are in the ledger?",
    "matched",  # matched / diverged / partial
)

# %%
reveal(
    "A TaskGroup's failing child cancels its sibling, and the sibling is cleaned "
    "up. The sibling had already appended a row to a shared ledger. After the "
    "group exits, how many rows are in the ledger?",
    """
    The row is still there. Cancellation unwound the *task*; it did not unwind the
    *effect*.

    Everything `TaskGroup` promised was delivered. The failing child raised. The
    sibling was cancelled — it observed its own `CancelledError`, which is why the
    second ledger row exists. No task outlived the block. The owner got an
    `ExceptionGroup`. Every one of those is a real guarantee and worth having.

    None of them is a rollback, and the difference is precise: **structured
    concurrency bounds a lifetime, not a transaction.** `CancelledError` is raised
    *at the next await point*, which means everything the task already did — every
    append, every write, every request it already sent — has already happened.
    Cancellation is a request to stop continuing. It is not a request to undo.

    Sit with the sequencing, because it is the whole thing. The sibling recorded
    its decision, then awaited. The failure arrived during that await. There is no
    mechanism, and could not be one, by which arriving-later cancellation reaches
    backwards through an append that already completed. If the sibling had instead
    `POST`ed to a payment API before its await, the charge would be equally real,
    and equally uncancelled.

    So the sentence to be careful with is "the group failed, so nothing happened".
    What is true is: *the group failed, so no task is still running, and the owner
    has an ExceptionGroup naming what went wrong.* What happened before the failure
    is a separate question, and answering it requires the ledger — not the
    exception.

    The reference model states this itself, in a field named `non_claim`: *a
    TaskGroup's local cancellation and cleanup does not establish remote rollback
    or an external effect.* That is the same discipline this course asks of you,
    published by the artifact rather than left for the reader to infer.

    The repair is not to avoid `TaskGroup`. It is to notice that undo is a property
    of the *effect*, not of the concurrency primitive, and must be built where the
    effect lives — compensating actions, an idempotency key that makes replay
    safe, or a decision that is not durable until the group succeeds. Bench
    `m16-s5` established the database version of exactly this: atomicity is chosen
    by the application, and the engine only realizes it.
    """,
)

# %% [markdown]
# ## 3. Verify — what the boundary does guarantee

# %%
ESCAPED: list[str] = []


async def leaks_a_task() -> None:
    """The unstructured version: fire and forget."""
    async def background() -> None:
        await asyncio.sleep(0.05)
        ESCAPED.append("background task still ran")

    asyncio.create_task(background())
    raise RuntimeError("owner failed immediately")


async def compare_boundaries() -> dict:
    unstructured = "no exception"
    try:
        await leaks_a_task()
    except RuntimeError:
        unstructured = "RuntimeError"
    await asyncio.sleep(0.1)          # give the orphan time to finish
    leaked = list(ESCAPED)

    contained: list[str] = []

    async def child() -> None:
        try:
            await asyncio.sleep(0.05)
            contained.append("structured task still ran")
        except asyncio.CancelledError:
            raise

    try:
        async with asyncio.TaskGroup() as group:
            group.create_task(child())
            raise RuntimeError("owner failed immediately")
    except* RuntimeError:
        pass
    await asyncio.sleep(0.1)
    return {"unstructured": unstructured, "leaked": leaked, "contained": contained}


comparison = run_async(compare_boundaries())

print(f"{'style':>16}  {'owner raised':>13}  work that ran anyway")
print(f"{'create_task':>16}  {comparison['unstructured']:>13}  "
      f"{comparison['leaked']}")
print(f"{'TaskGroup':>16}  {'RuntimeError':>13}  {comparison['contained']}")

checkpoint("an unstructured task outlives its failed owner",
           comparison["leaked"] == ["background task still ran"])
checkpoint("a TaskGroup child does not", comparison["contained"] == [],
           "this is the guarantee, and it is worth having")

# %% [markdown]
# ## 4. Review and verify — audit four statements about the failed group

# %%
STATEMENTS = {
    "a": "No task from the group is still running.",
    "b": "The owner can name what failed.",
    "c": "Nothing the group did took effect.",
    "d": "Any request a child already sent has been undone.",
    "e": "A child that had not yet started never ran.",
}
for key, text in STATEMENTS.items():
    print(f"{key}. {text}")


def guaranteed_by_taskgroup(key: str) -> bool:
    """True when the structured-concurrency boundary establishes this."""
    raise NotImplementedError("Separate the lifetime guarantee from a transaction")


# %%
check("guaranteed_by_taskgroup", guaranteed_by_taskgroup,
      [(("a",), True), (("b",), True), (("c",), False), (("d",), False),
       (("e",), True)])
print()
print("(c) and (d) are the transaction reading. The ledger above refutes (c)")
print("directly, and (d) is worse: it asserts something about a peer this process")
print("never contacted. (e) is true and easy to miss — it is why the guarantee is")
print("about lifetime rather than about effects.")

# %% [markdown]
# ## 5. The boundary note

# %%
BOUNDARY_NOTE = """
What the TaskGroup boundary guarantees, in one sentence per guarantee:
The effect my sibling left behind, and the exact moment it became durable:
Why cancellation could not have reached it:
The compensating action or idempotency key I would add, and where it lives:
The sentence "the group failed, so nothing happened" — rewritten to be true:
"""
print(BOUNDARY_NOTE)

# %%
claim("DEFENDED REPAIR", BOUNDARY_NOTE)

claim(
    "LOCAL REFERENCE RESULT",
    f"On CPython {sys.version_info.major}.{sys.version_info.minor} with the real "
    f"event loop, a TaskGroup whose child raises produces the reference trace "
    f"{list(probe.trace)} and, in this bench's own group, an ExceptionGroup while "
    f"leaving the sibling's already-recorded ledger row in place — the sibling "
    f"having observed its own CancelledError. Separately, a task created with "
    f"create_task outlives an owner that raised immediately, while a TaskGroup "
    f"child does not.",
    support={"pythonVersion": f"{sys.version_info.major}.{sys.version_info.minor}",
             "referenceTrace": list(probe.trace),
             "referenceScope": probe.evidence_scope,
             "referenceNonClaim": probe.non_claim,
             "ledgerAfterFailure": LEDGER,
             "boundaryComparison": comparison},
)

non_claim(
    "This runs one event loop in one process with no I/O of any kind. It "
    "establishes what cancellation does to a task and what it does not do to an "
    "effect the task already performed locally. It contacts no peer, so it says "
    "nothing about whether a remote system would see a partial result, nothing "
    "about network-level retries or timeouts, and nothing about what any real "
    "service does with a request that was sent and then abandoned — which is "
    "Module 20's subject and needs an actual protocol."
)

emit()

# %% [markdown]
# ## 6. Transfer
#
# 1. Every guarantee was delivered and the conclusion was still wrong. Write the
#    rule this implies about reading a primitive's documentation.
# 2. The sibling observed its own cancellation and the effect survived. Name what
#    would have to be true of an effect for cancellation to undo it.
# 3. Bench `m16-s5` found that SQLite realizes atomicity without choosing it.
#    State the general principle that bench and this one are both instances of.
#
# ---
#
# ## Attributions
#
# Probes `public/downloads/module21_reference.py` — `run_taskgroup_failure_probe`.
# Not reimplemented. The ledger-surviving-cancellation experiment and the
# structured/unstructured comparison are this bench's own, on the real event loop.
