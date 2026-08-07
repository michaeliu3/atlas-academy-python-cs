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
# # Bench m01-s3 — ownership contract card
#
# **Session 1.3 — Contracts and invariants.** Rungs: **recognize** (primary), trace.
#
# A contract written in prose is a wish. This bench turns each clause into a
# predicate you can run, and then violates the one clause that is easiest to break
# without noticing — the frame condition, which says what a call promises *not*
# to touch.
#
# **Requires:** Python 3.12+. Standard library only.

# %%
from _fixture import (  # noqa: E402  (sets up sys.path)
    EventLog, StudyEvent, fresh_raw, normalize_event,
)

import sys  # noqa: E402
from collections.abc import Mapping  # noqa: E402

from atlas_bench import (  # noqa: E402
    bench, check, checkpoint, claim, emit, non_claim, predict, resolve, reveal,
)

assert sys.version_info >= (3, 12)

bench(module=1, session=3, emits="ownership contract card",
      rungs=["recognize", "trace"])

# %% [markdown]
# ## 1. Four clauses, four predicates
#
# `EventLog.record(raw)` carries four separate promises. Each is checkable.

# %%
def precondition(raw) -> bool:
    """What the CALLER must guarantee before record() is entered."""
    return (
        isinstance(raw, Mapping)
        and "topic" in raw
        and "minutes" in raw
        and str(raw["topic"]).strip() != ""
        and int(raw["minutes"]) >= 0
    )


def postcondition(log, before_count: int) -> bool:
    """What the CALL guarantees on return."""
    snapshot = log.snapshot()
    return len(snapshot) == before_count + 1 and isinstance(snapshot[-1], StudyEvent)


def frame_condition(raw, raw_before: dict) -> bool:
    """What the call promises NOT to change: the caller's own mapping."""
    return raw == raw_before


def representation_invariant(log) -> bool:
    """What is true of the object between every pair of calls."""
    snapshot = log.snapshot()
    return isinstance(snapshot, tuple) and all(
        isinstance(event, StudyEvent) and event.minutes >= 0 and event.topic != ""
        and isinstance(event.tags, tuple)
        for event in snapshot
    )


# %%
log = EventLog()
raw = fresh_raw()
raw_before = {"topic": raw["topic"], "minutes": raw["minutes"], "tags": list(raw["tags"])}

print(f"precondition holds before the call : {precondition(raw)}")
print(f"RI holds before the call           : {representation_invariant(log)}")
log.record(raw)
print(f"postcondition holds after          : {postcondition(log, 0)}")
print(f"frame condition holds after        : {frame_condition(raw, raw_before)}")
print(f"RI holds after                     : {representation_invariant(log)}")

for label, ok in (("precondition", precondition(raw)),
                  ("postcondition", postcondition(log, 0)),
                  ("frame condition", frame_condition(raw, raw_before)),
                  ("representation invariant", representation_invariant(log))):
    checkpoint(f"{label} holds", ok)

# %% [markdown]
# ## 2. Prediction — the clause that breaks quietly

# %%
predict(
    "A later maintainer adds tag normalization that edits the caller's mapping "
    "in place instead of copying. Which of the four clauses fails first, and "
    "would the postcondition notice?",
    answer="",  # <- fill in
    confidence="",  # sure / fairly sure / guessing
)

# %% [markdown]
# ## 3. Trace — the well-meaning edit


# %%
class HelpfulEventLog(EventLog):
    """Adds an audit tag. Writes it into the caller's mapping."""

    def record(self, raw) -> None:
        tags = raw.get("tags")
        if isinstance(tags, list) and "audited" not in tags:
            tags.append("audited")     # the caller's list
        super().record(raw)


helpful = HelpfulEventLog()
raw2 = fresh_raw()
raw2_before = {"topic": raw2["topic"], "minutes": raw2["minutes"],
               "tags": list(raw2["tags"])}
helpful.record(raw2)

results = {
    "postcondition": postcondition(helpful, 0),
    "representation invariant": representation_invariant(helpful),
    "frame condition": frame_condition(raw2, raw2_before),
}
for label, ok in results.items():
    checkpoint(f"{label} holds", ok)

print()
print(f"caller's tags before: {raw2_before['tags']}")
print(f"caller's tags after : {raw2['tags']}")
print(f"stored snapshot     : {helpful.snapshot()[0].tags}")

# %%
resolve(
    "A later maintainer adds tag normalization that edits the caller's mapping "
    "in place instead of copying. Which of the four clauses fails first, and "
    "would the postcondition notice?",
    "matched",  # matched / diverged / partial
)

# %%
reveal(
    "A later maintainer adds tag normalization that edits the caller's mapping "
    "in place instead of copying. Which of the four clauses fails first, and "
    "would the postcondition notice?",
    """
    The frame condition fails, and nothing else does.

    The postcondition holds: one more event, correct type. The representation
    invariant holds: the stored snapshot is a tuple of well-formed `StudyEvent`s
    with nonnegative minutes and tuple tags. By every clause that describes the
    log's *own* state, the call succeeded.

    The caller's list gained an element it did not put there. That is the frame
    condition — the promise about what the call leaves alone — and it is the only
    clause that mentions anything outside the object.

    Why this is the clause that breaks quietly:

    - **Postconditions describe the callee's state.** A frame violation happens
      somewhere else by definition, so a postcondition cannot see it.
    - **The RI is checked between calls on the object.** The caller's dict is not
      part of the object, so it is outside the invariant's scope.
    - **The edit looks like an improvement.** Adding an audit tag is a reasonable
      feature. The defect is not the tag; it is writing it through a reference the
      caller still owns.

    A test that only asserted on `snapshot()` would pass. Catching this requires
    asserting on something the function was supposed to *not* do, which is why a
    frame condition has to be written down — it is the one clause you cannot
    infer from the return value.
    """,
)

# %% [markdown]
# ## 4. Recognize — assign each statement to a clause

# %%
STATEMENTS = {
    "a": "minutes must be nonnegative when record() is called.",
    "b": "After record(), the snapshot is one longer than before.",
    "c": "record() does not modify the mapping the caller passed in.",
    "d": "Between any two calls, every stored event has tuple tags.",
}
for key, text in STATEMENTS.items():
    print(f"{key}. {text}")


def clause(key: str) -> str:
    """One of: precondition, postcondition, frame, invariant."""
    raise NotImplementedError("Assign each statement to its clause")


# %%
check("clause", clause,
      [(("a",), "precondition"), (("b",), "postcondition"),
       (("c",), "frame"), (("d",), "invariant")])

# %% [markdown]
# ## 5. The card

# %%
CONTRACT_CARD = """
Precondition, and who is responsible for it:
Postcondition, stated so a test could check it:
Frame condition, naming the specific thing left alone:
Representation invariant, and when it must hold:
"""
print(CONTRACT_CARD)

# %%
claim("DEFINITION / MODEL", CONTRACT_CARD)

claim(
    "COUNTEREXAMPLE",
    f"A subclass that appends an audit tag to the caller's list satisfies the "
    f"postcondition ({results['postcondition']}) and the representation "
    f"invariant ({results['representation invariant']}) while violating the "
    f"frame condition ({results['frame condition']}).",
    support={"clauseResults": results,
             "callerTagsBefore": raw2_before["tags"],
             "callerTagsAfter": list(raw2["tags"])},
)

non_claim(
    "Four predicates on one method. They establish that these clauses are "
    "independent — one can fail while the others hold — not that they are "
    "complete. Nothing here checks concurrency, exception safety, or what the "
    "contract promises when the precondition is violated."
)

emit()

# %% [markdown]
# ## 6. Transfer
#
# 1. Only the frame condition failed. Write the rule about which contract clauses
#    a return-value assertion can and cannot check.
# 2. The offending change was a feature, not a bug. Name what a reviewer would
#    have had to be looking for.
# 3. Session 4 compares three logs under a caller edit. Which clause is that
#    comparison testing?
#
# ---
#
# ## Attributions
#
# Authored for this course. Module 1 has no checked-in reference model.
