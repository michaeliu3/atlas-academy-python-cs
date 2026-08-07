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
# # Bench m01-s4 — event-log comparison and repair memo
#
# **Session 1.4 — Code-reading and investigation studio.** Rungs: **debug and
# defend** (primary), review and verify.
#
# Three implementations, one public contract, three different ownership claims.
# The workbook says they differ in *when the stored value becomes owned*. This
# bench makes that difference observable, and then checks the properties a single
# equality assertion would miss.
#
# **Requires:** Python 3.12+. Standard library only.

# %%
from _fixture import (  # noqa: E402  (sets up sys.path)
    IMPLEMENTATIONS, StudyEvent, fresh_raw, normalize_event,
)

import sys  # noqa: E402

from atlas_bench import (  # noqa: E402
    bench, check, checkpoint, claim, emit, non_claim, predict, resolve, reveal,
)

assert sys.version_info >= (3, 12)

bench(module=1, session=4, emits="event-log comparison and repair memo",
      rungs=["debug-and-defend", "review-and-verify"])

# %% [markdown]
# ## 1. They agree on the obvious test

# %%
expected = normalize_event(fresh_raw())
print(f"expected snapshot: ({expected},)")
print()
for name, cls in IMPLEMENTATIONS.items():
    log = cls()
    log.record(fresh_raw())
    print(f"{name:>24}: {log.snapshot() == (expected,)}")

checkpoint(
    "all three pass an equality check on a fresh recording",
    all(
        (lambda log: (log.record(fresh_raw()), log.snapshot() == (expected,))[1])(cls())
        for cls in IMPLEMENTATIONS.values()
    ),
    "which is why one assertion is not a test suite",
)

# %%
predict(
    "The caller keeps a reference to the mapping it passed to record(), then "
    "edits it. How many of the three logs change their snapshot?",
    answer="",  # <- fill in
    confidence="",  # sure / fairly sure / guessing
)

# %% [markdown]
# ## 2. Debug — the caller edits what it already handed over

# %%
results = {}
for name, cls in IMPLEMENTATIONS.items():
    log = cls()
    raw = fresh_raw()
    log.record(raw)
    before = log.snapshot()
    raw["minutes"] = 999            # the caller still owns this dict
    raw["tags"].append("SPURIOUS")  # and this list
    after = log.snapshot()
    results[name] = {"changed": before != after, "before": before, "after": after}
    mark = "CHANGED" if before != after else "stable"
    print(f"{name:>24}: {mark}")
    if before != after:
        print(f"{'':>24}  {before[0].minutes} min {before[0].tags}")
        print(f"{'':>24}  -> {after[0].minutes} min {after[0].tags}")

changed = [n for n, r in results.items() if r["changed"]]
checkpoint("two of the three follow the caller's later edit", len(changed) == 2,
           ", ".join(changed))
checkpoint("EventLog does not", not results["EventLog"]["changed"],
           "it normalized on write, so it owns an immutable value")

# %%
resolve(
    "The caller keeps a reference to the mapping it passed to record(), then "
    "edits it. How many of the three logs change their snapshot?",
    "matched",  # matched / diverged / partial
)

# %%
reveal(
    "The caller keeps a reference to the mapping it passed to record(), then "
    "edits it. How many of the three logs change their snapshot?",
    """
    Two. `ConciseEventLog` and `GeneratedEventPipeline` both change; `EventLog`
    does not.

    The first two store the caller's mapping and normalize lazily, on read. So
    `snapshot()` is not reporting what was recorded — it is reporting whatever
    the mapping happens to contain *now*. Wrapping it in an envelope, as
    `GeneratedEventPipeline` does, changes nothing: the envelope holds the same
    object.

    `EventLog` normalizes on write. From that moment it holds a frozen
    `StudyEvent` with a tuple of tags, and the caller's later edits reach nothing.

    Three things worth separating:

    - **The public contract is identical.** Same method names, same return types,
      same behaviour on the happy path. No amount of reading the signatures
      distinguishes them.
    - **The bug is in the caller's timeline, not the log's code.** Each
      implementation is internally consistent. What differs is *when* ownership
      transfers, and that is invisible until someone exercises the window.
    - **`tags` is the sharper failure.** Even a shallow copy of the mapping would
      not save the first two, because the list inside it is still shared. Copying
      one level deep is a decision about how far ownership extends, and it is
      easy to make without noticing you made it.
    """,
)

# %% [markdown]
# ## 3. Review and verify — the properties one assertion misses
#
# The workbook's studio uses a single equality assert. Write the checks that
# would have caught the difference.


# %%
def survives_caller_mutation(log_class) -> bool:
    """True if the log's snapshot is unaffected by later edits to the raw mapping."""
    raise NotImplementedError("Implement the ownership property")


def snapshot_is_immutable(log_class) -> bool:
    """True if the returned snapshot cannot be used to mutate stored state."""
    raise NotImplementedError("Implement the immutability property")


def preserves_order(log_class) -> bool:
    """True if snapshot() returns events in the order they were recorded."""
    raise NotImplementedError("Implement the order property")


def rejects_invalid_minutes(log_class) -> bool:
    """True if recording minutes=-1 is refused at some observable point."""
    raise NotImplementedError("Implement the validation property")


def repeated_record_is_independent(log_class) -> bool:
    """True if recording the SAME mapping twice yields two independent entries."""
    raise NotImplementedError("Implement the aliasing property")


# %%
PROPERTIES = {
    "survives caller mutation": survives_caller_mutation,
    "snapshot is immutable": snapshot_is_immutable,
    "preserves order": preserves_order,
    "rejects invalid minutes": rejects_invalid_minutes,
    "repeated record independent": repeated_record_is_independent,
}

for label, prop in PROPERTIES.items():
    check(
        label,
        prop,
        [((cls,), name == "EventLog") for name, cls in IMPLEMENTATIONS.items()],
    )

# %% [markdown]
# ## 4. Agent-directed repair
#
# **Prompt to give the agent:**
#
# > `ConciseEventLog` stores the caller's mapping and normalizes on read. Make it
# > own its data at `record()` time. Do not change the public contract, do not add
# > a dependency, and do not alter `EventLog` or `GeneratedEventPipeline`.
#
# Paste the patch below and run it **unmodified** against the five properties.
# The interesting failure is a patch that copies the mapping one level deep and
# leaves the `tags` list shared — it passes an equality test and fails the first
# property.

# %%
AGENT_PATCH = """
Paste the class here, then re-run the property checks against it.
"""

REVIEW = """
Which properties the patch passes:
Which it fails, and the exact input that shows it:
Whether it changed the public contract:
The one non-claim I would attach to this repair:
"""
print(REVIEW)

# %% [markdown]
# ## 5. The memo

# %%
claim("REVIEW VERDICT", REVIEW)

claim(
    "FINITE EXPERIMENT",
    f"Three implementations sharing one public contract diverge under a caller "
    f"edit after record(): {', '.join(changed)} follow the edit while EventLog "
    f"does not. All three pass a single equality assertion on a fresh recording.",
    support={"changed": changed,
             "stable": [n for n, r in results.items() if not r["changed"]]},
)

non_claim(
    "This exercises one mutation window — a caller editing a mapping it still "
    "holds. It does not establish that EventLog is correct, only that it survives "
    "this failure. Concurrent recording, deeply nested payloads, and objects with "
    "custom __eq__ are separate questions, and Module 19 owns the first."
)

emit()

# %% [markdown]
# ## 6. Transfer
#
# 1. All three passed the equality test. Write the rule about what an equality
#    assertion establishes about ownership.
# 2. A one-level copy would fix `minutes` and not `tags`. State the general
#    question that choice is silently answering.
# 3. Session 3 asks for a contract card. Which of the five properties belongs in
#    a postcondition, and which in a frame condition?
#
# ---
#
# ## Attributions
#
# Authored for this course. The three implementations mirror workbook session 4;
# Module 1 has no checked-in reference model, so the fixture is the bench's own.
