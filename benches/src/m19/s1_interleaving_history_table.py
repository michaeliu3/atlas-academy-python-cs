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
# # Bench m19-s1 — interleaving history table
#
# **Session 19.1 — A second worker creates histories.** Rungs: **trace**
# (primary), recognize.
#
# The session derives `C(6, 3) = 20` on the page and asks you to build the history
# table by hand. This bench builds it by enumeration, which turns "a race is
# possible" into a number — and the number is the argument.
#
# The model is declared: `R`, `C`, `W` are application-level transitions, and the
# workbook says explicitly that they are *not* bytecodes. Every count below belongs
# to that model.
#
# **Requires:** Python 3.12+. Standard library only.

# %%
from _fixture import *  # noqa: F401,F403,E402  (sets up sys.path)

import sys  # noqa: E402
from itertools import combinations  # noqa: E402

from atlas_bench import (  # noqa: E402
    bench, check, checkpoint, claim, emit, non_claim, predict, resolve, reveal,
)
from module19_reference import explore_two_increment_schedules  # noqa: E402

assert sys.version_info >= (3, 12)

bench(module=19, session=1, emits="interleaving history table",
      rungs=["trace", "recognize"])

# %% [markdown]
# ## 1. The state space, counted before it is explored

# %%
positions = len(list(combinations(range(6), 3)))
print(f"two workers, three steps each (R, C, W)")
print(f"choose which three of six positions belong to worker A: C(6,3) = {positions}")
print(f"each worker's own program order R -> C -> W is preserved throughout")

# %%
predict(
    "Twenty schedules, each one a legal interleaving that no scheduler rule "
    "forbids. Both workers contribute one document to a shared value. How many of "
    "the twenty end with BOTH contributions present?",
    answer="",  # <- fill in
    confidence="",  # sure / fairly sure / guessing
)

# %% [markdown]
# ## 2. Trace — enumerate every legal history

# %%
exploration = explore_two_increment_schedules(initial_value=0)

print(f"schedules explored : {exploration.schedule_count}")
print(f"safety property    : {exploration.safety_property}")
print(f"\n{'final value':>12}  {'schedules':>9}  {'share':>7}")
for value in sorted(exploration.final_value_counts):
    count = exploration.final_value_counts[value]
    print(f"{value:>12}  {count:>9}  {count / exploration.schedule_count:>6.0%}")

print(f"\nthe {len(exploration.sequential_schedules)} correct schedules:")
for schedule in exploration.sequential_schedules:
    print(f"  {' '.join(schedule)}")

correct = exploration.final_value_counts[2]
lost = exploration.final_value_counts[1]

checkpoint("the enumeration is complete",
           exploration.schedule_count == positions == 20)
checkpoint("most legal schedules lose an update", lost > correct,
           f"{lost} of {exploration.schedule_count}")
checkpoint("the correct schedules are exactly the two sequential ones",
           correct == len(exploration.sequential_schedules) == 2,
           "one worker finishes entirely before the other begins")

# %%
resolve(
    "Twenty schedules, each one a legal interleaving that no scheduler rule "
    "forbids. Both workers contribute one document to a shared value. How many of "
    "the twenty end with BOTH contributions present?",
    "matched",  # matched / diverged / partial
)

# %%
reveal(
    "Twenty schedules, each one a legal interleaving that no scheduler rule "
    "forbids. Both workers contribute one document to a shared value. How many of "
    "the twenty end with BOTH contributions present?",
    """
    Two. Ninety percent of the legal histories lose an update.

    And the two that work are exactly the two where nothing interleaved at all —
    A finishes completely, then B, or the reverse. Every schedule that mixes the
    workers even slightly loses a contribution. There is no partial credit in this
    state space, and no "mostly fine" region: the moment a second worker's `R`
    lands between the first worker's `R` and `W`, the first worker's contribution
    is overwritten by a value computed before it existed.

    Take a moment on the ratio, because it inverts the intuition that makes this
    bug survive review. The felt model is "a race is a narrow window; you have to
    be unlucky." The state space says the opposite: correctness is the narrow
    window, and it is two schedules wide out of twenty.

    What makes the code *look* safe is that a real scheduler does not sample
    uniformly from this space. On CPython with two threads, the switch interval
    makes a short read-compute-write very likely to run without preemption, so the
    sequential schedules come up overwhelmingly often in practice. Which means the
    test passes. It passes on your machine, and in CI, a thousand times.

    That is the trap this session exists to close. The observed frequency of a
    correct outcome is not the safety property. It is a fact about a scheduler you
    do not control, on a machine you were using that day, at a load you did not
    set. Change the interval, add a worker, run on different hardware, insert an
    `await`, and the distribution moves — while the *state space* does not.

    So the argument that has to appear in the artifact is about the space, not the
    sample: **eighteen legal histories violate the invariant.** That sentence is
    true regardless of how often you observe them, and it is the only kind of
    statement a reviewer can act on. Session 2 asks what a lock does to it — and
    the answer there is more interesting than "makes it safe".

    One last thing about the model. `R`, `C`, `W` are declared application-level
    transitions. Nothing here claims they are bytecodes, and the module's text says
    so explicitly. A bytecode-level model of the same code would have a different
    step count and a different schedule count. It would not have a different
    conclusion, which is why the coarse model is the right one to reason with.
    """,
)

# %% [markdown]
# ## 3. Recognize — what changes the number, and what does not

# %%
CHANGES = {
    "a": "Running the code a thousand times and seeing the correct result.",
    "b": "Adding a third worker.",
    "c": "Running on a machine with more cores.",
    "d": "Making the shared value immutable.",
}
for key, text in CHANGES.items():
    print(f"{key}. {text}")


def changes_the_state_space(key: str) -> bool:
    """True when this changes the SET of legal histories, not their frequency."""
    raise NotImplementedError("Separate the space from the sample")


# %%
check("changes_the_state_space", changes_the_state_space,
      [(("a",), False), (("b",), True), (("c",), False), (("d",), False)])
print()
print("(d) is the one people get wrong. The value in this model is ALREADY")
print("immutable — the workers exchange whole tuples. Immutability removes torn")
print("reads; it does nothing about a lost update, because the loss happens in the")
print("gap between reading a value and writing its successor.")

# %% [markdown]
# ## 4. The history table

# %%
HISTORY_TABLE = """
The three transitions, and why they are application-level rather than bytecodes:
The schedule count, with the argument that produces it:
The outcome distribution:
The schedules that satisfy the invariant, and what they have in common:
Why observing the correct result many times is not evidence of safety:
The claim I would put in a review, phrased about the space and not the sample:
"""
print(HISTORY_TABLE)

# %%
claim("COURSE MODEL", HISTORY_TABLE)

claim(
    "LOCAL REFERENCE RESULT",
    f"Under the declared three-transition model, two workers each contributing one "
    f"document produce {exploration.schedule_count} legal schedules. "
    f"{lost} of them end with one contribution lost and {correct} preserve both — "
    f"and those {correct} are exactly the schedules in which one worker completes "
    f"before the other starts. The safety property is '{exploration.safety_property}'.",
    support={"scheduleCount": exploration.schedule_count,
             "finalValueCounts": {str(k): v for k, v
                                  in exploration.final_value_counts.items()},
             "sequentialSchedules": [list(s) for s
                                     in exploration.sequential_schedules],
             "safetyProperty": exploration.safety_property},
)

non_claim(
    "This is a complete enumeration of a declared model in which one shared update "
    "is three application-level transitions. It establishes that 18 of 20 legal "
    "histories violate the invariant *in that model*. It is not a bytecode-level "
    "analysis, does not model the GIL, the switch interval, memory ordering, or "
    "any real scheduler, and predicts nothing about how often a given machine "
    "would produce a wrong answer — which is precisely the quantity this bench "
    "argues you should stop reasoning from."
)

emit()

# %% [markdown]
# ## 5. Transfer
#
# 1. Ninety percent of legal histories are wrong and the test passes anyway. Write
#    the rule this implies about what a passing concurrency test establishes.
# 2. The two correct schedules had one property in common. State it, and say what
#    Session 2 must therefore make a lock accomplish.
# 3. Bench `m13-s2` found mutants a green suite could not see. State what a
#    surviving mutant and an unobserved interleaving have in common.
#
# ---
#
# ## Attributions
#
# Probes `public/downloads/module19_reference.py` — `explore_two_increment_schedules`.
# Not reimplemented. The state-space framing and the change/frequency sort are this
# bench's own.
