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
# # Bench m19-s2 — critical-section boundary note
#
# **Session 19.2 — Protect one logical transition.** Rungs: **debug and defend**
# (primary), review and verify.
#
# Bench 1 established that 18 of 20 legal histories lose an update. The obvious
# repair is a lock, and this session's title says what the hard part is: *one
# logical transition*, not one statement.
#
# So this bench explores two locked models. Both use a real mutex. Both are code a
# reviewer would sign off on. One of them is worse than having no lock at all,
# measured in violating schedules — and the state space says so with a number.
#
# **Requires:** Python 3.12+. Standard library only.

# %%
from _fixture import *  # noqa: F401,F403,E402  (sets up sys.path)

import sys  # noqa: E402

from atlas_bench import (  # noqa: E402
    bench, check, checkpoint, claim, emit, non_claim, predict, resolve, reveal,
)
from module19_reference import (  # noqa: E402
    explore_locked_increment_schedules,
    explore_narrow_locked_increment_schedules,
    explore_two_increment_schedules,
)

assert sys.version_info >= (3, 12)

bench(module=19, session=2, emits="critical-section boundary note",
      rungs=["debug-and-defend", "review-and-verify"])

# %% [markdown]
# ## 1. Two placements of the same lock
#
# ```text
# whole transition          narrow critical section
# -----------------------   -----------------------
#   acquire                   R: read old value
#   R: read old value         C: compute new value
#   C: compute new value      acquire
#   W: write new value        W: write new value
#   release                   release
# ```
#
# Both hold a lock across the write. Both are mutual exclusion, correctly
# implemented, with no deadlock. The difference is where the boundary falls
# relative to the **read** — and the narrow version's critical section is the one
# a reviewer is most likely to call sufficient, because it protects the mutation.

# %%
unlocked = explore_two_increment_schedules(initial_value=0)
print(f"baseline with no lock at all: {unlocked.schedule_count} schedules, "
      f"{unlocked.final_value_counts}")

# %%
predict(
    "One version acquires before the read; the other acquires after it. Both hold "
    "the lock through the write. How many schedules does each admit, and how many "
    "of those violate the invariant?",
    answer="",  # <- fill in
    confidence="",  # sure / fairly sure / guessing
)

# %% [markdown]
# ## 2. Debug — explore both locked state spaces

# %%
explorations = {
    "no lock": unlocked,
    "lock spans the whole transition": explore_locked_increment_schedules(initial_value=0),
    "lock acquired after the read": explore_narrow_locked_increment_schedules(initial_value=0),
}

print(f"{'model':>34}  {'schedules':>9}  {'outcomes':>16}  {'violating':>9}")
for label, result in explorations.items():
    violating = getattr(result, "violating_schedules", ())
    outcomes = {k: v for k, v in sorted(result.final_value_counts.items())}
    count = len(violating) if hasattr(result, "violating_schedules") \
        else result.final_value_counts.get(1, 0)
    print(f"{label:>34}  {result.schedule_count:>9}  {str(outcomes):>16}  {count:>9}")

whole = explorations["lock spans the whole transition"]
narrow = explorations["lock acquired after the read"]

print(f"\nlinearization events, whole-transition lock: {whole.linearization_events}")
print(f"linearization events, narrow lock          : {narrow.linearization_events}")
print(f"\none violating schedule under the narrow lock:")
for step in narrow.violating_schedules[0]:
    print(f"  {step}")

checkpoint("the whole-transition lock collapses the space to the safe schedules",
           whole.schedule_count == 2 and not whole.violating_schedules,
           "exactly the two sequential histories bench 1 identified")
checkpoint("the narrow lock admits MORE schedules than having no lock",
           narrow.schedule_count > unlocked.schedule_count,
           f"{narrow.schedule_count} against {unlocked.schedule_count} — acquire "
           f"and release are themselves steps that can interleave")
checkpoint("and more violating ones",
           len(narrow.violating_schedules) > unlocked.final_value_counts[1],
           f"{len(narrow.violating_schedules)} against "
           f"{unlocked.final_value_counts[1]}")
checkpoint("only the whole-transition lock has linearization events",
           bool(whole.linearization_events) and not narrow.linearization_events,
           "there is no point at which the narrow version's update takes effect "
           "atomically")

# %%
resolve(
    "One version acquires before the read; the other acquires after it. Both hold "
    "the lock through the write. How many schedules does each admit, and how many "
    "of those violate the invariant?",
    "matched",  # matched / diverged / partial
)

# %%
reveal(
    "One version acquires before the read; the other acquires after it. Both hold "
    "the lock through the write. How many schedules does each admit, and how many "
    "of those violate the invariant?",
    """
    The whole-transition lock admits 2 schedules and violates nothing. The narrow
    lock admits 42 and violates 36 — worse, by count, than the 18 violations of
    having no lock at all.

    Start with why the narrow version fails, because "it still has a race" is not
    the interesting part. The lock does exactly what a lock does: two workers
    cannot be inside the critical section at once, and the write is genuinely
    protected. What is *not* protected is the read — and the value being written
    was computed from a read taken outside. So worker B can read the old value,
    wait politely for A's lock, acquire it, and write a value derived from data
    that A has already superseded. Mutual exclusion held throughout. The invariant
    did not.

    That is the session's title, stated precisely: a lock protects a **region of
    code**, and the thing that needs protecting is a **logical transition**. If the
    transition begins at the read, a critical section that begins after the read
    protects the wrong interval. The mutex is not defective; the boundary is in the
    wrong place.

    Now the count, which is the part worth carrying. The narrow version admits
    *more* schedules than the unlocked one — 42 against 20 — because `acquire` and
    `release` are themselves steps in the model, and steps can interleave. Adding
    synchronization enlarged the state space. It bought a guarantee about one
    interval and paid for it with more interleavings everywhere else, and the
    guarantee it bought was not the one the invariant needed.

    This is why "we added a lock" is not a review answer, and why "is there a
    lock?" is not a review question. The question is: **what is the transition,
    where does it begin, and does the critical section contain all of it?** Here
    the transition begins at the read, because the write's correctness depends on
    the value read. Any boundary drawn after that point protects an interval that
    was never the problem.

    Compare the linearization events. The whole-transition model reports
    `('A:WRITE', 'B:WRITE')` — two points at which an update takes effect
    atomically, in some order, which is exactly what makes the outcome
    equivalent-to-sequential. The narrow model reports **none**. There is no
    instant at which either update can be said to have happened atomically,
    because half of each update happened outside the protected region. The empty
    tuple is the diagnosis, and it is available without running a single thread.

    Finally: the whole-transition lock reduced 20 schedules to 2, and those 2 are
    exactly bench 1's sequential schedules. That is what correct synchronization
    does — it does not make the bad interleavings rare, it removes them from the
    space. Rarity is a scheduler's opinion. Absence is a property.
    """,
)

# %% [markdown]
# ## 3. Review and verify — audit four repair proposals

# %%
PROPOSALS = {
    "a": "Wrap the write in a lock.",
    "b": "Wrap the read, compute, and write in one lock.",
    "c": "Make the shared value immutable so reads cannot tear.",
    "d": "Retry the whole transition when the value changed since the read.",
}
for key, text in PROPOSALS.items():
    print(f"{key}. {text}")


def restores_the_invariant(key: str) -> bool:
    """True when this makes the violating schedules unreachable."""
    raise NotImplementedError("Audit each proposal against the state space")


# %%
check("restores_the_invariant", restores_the_invariant,
      [(("a",), False), (("b",), True), (("c",), False), (("d",), True)])
print()
print("(d) is the one worth defending: compare-and-swap does not exclude the")
print("interleaving, it DETECTS it and redoes the transition. Different mechanism,")
print("same property — no schedule ends with a lost update. A reviewer who accepts")
print("only (b) has learned a lock rather than the invariant.")

# %% [markdown]
# ## 4. The boundary note

# %%
BOUNDARY_NOTE = """
The logical transition, stated as one sentence with a beginning and an end:
Where the critical section begins in each version, relative to that transition:
The schedule count and violation count for each:
Why the narrow version's linearization events are empty:
Why adding synchronization enlarged the state space:
The review question I would ask instead of "is it locked?":
"""
print(BOUNDARY_NOTE)

# %%
claim("DEFENDED REPAIR", BOUNDARY_NOTE)

claim(
    "LOCAL REFERENCE RESULT",
    f"Under the declared model, a lock spanning the whole read-compute-write "
    f"transition admits {whole.schedule_count} schedules with "
    f"{len(whole.violating_schedules)} violations and linearization events "
    f"{whole.linearization_events}. A lock acquired after the read admits "
    f"{narrow.schedule_count} schedules with {len(narrow.violating_schedules)} "
    f"violations and no linearization events — more violating schedules than the "
    f"{unlocked.final_value_counts[1]} produced by no lock at all, across a state "
    f"space enlarged from {unlocked.schedule_count} to {narrow.schedule_count} by "
    f"the acquire and release steps themselves.",
    support={"unlocked": {"schedules": unlocked.schedule_count,
                          "outcomes": {str(k): v for k, v
                                       in unlocked.final_value_counts.items()}},
             "wholeTransition": {"schedules": whole.schedule_count,
                                 "violating": len(whole.violating_schedules),
                                 "linearizationEvents": list(whole.linearization_events)},
             "narrow": {"schedules": narrow.schedule_count,
                        "violating": len(narrow.violating_schedules),
                        "linearizationEvents": list(narrow.linearization_events),
                        "exampleViolation": list(narrow.violating_schedules[0])}},
)

non_claim(
    "These are complete enumerations of declared models in which acquire, read, "
    "compute, write, and release are application-level transitions. They establish "
    "that a critical section beginning after the read admits violating schedules "
    "in that model. They do not measure any real lock's cost, do not model "
    "reentrancy, fairness, priority inversion, or the GIL, and the schedule counts "
    "are properties of this step decomposition — a finer decomposition would give "
    "different numbers and the same verdict."
)

emit()

# %% [markdown]
# ## 5. Transfer
#
# 1. Adding synchronization enlarged the state space. Write the rule this implies
#    about reviewing a change that adds a lock.
# 2. The narrow model's linearization events were empty. Say what an empty list
#    means there, and why it is a stronger diagnosis than a violation count.
# 3. Bench `m12-s1` classified fixes as symptom relief or graph repair. State which
#    of those two the narrow lock is, and defend it.
#
# ---
#
# ## Attributions
#
# Probes `public/downloads/module19_reference.py` — `explore_locked_increment_schedules`,
# `explore_narrow_locked_increment_schedules`, `explore_two_increment_schedules`.
# Not reimplemented. The three-way comparison and the proposal audit are this
# bench's own.
