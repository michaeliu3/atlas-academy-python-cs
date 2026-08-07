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
# # Bench m34-s5 — Decision-under-Uncertainty Card
#
# **Session 34.5 — Belief, utility, and authority are different inputs.** Rungs:
# **review and verify** (primary), recognize.
#
# "The model is 90% confident, so we should act" collapses three separate inputs
# into one. A decision needs a **belief** (what is likely), a **utility** (what
# outcomes are worth), and an **authority** (who may act) — and the first does not
# determine the second.
#
# This bench holds the belief fixed and varies only the utilities, and finds the
# recommended action changing.
#
# **Requires:** Python 3.12+. Standard library only.

# %%
from _fixture import *  # noqa: F401,F403,E402  (sets up sys.path)

import sys  # noqa: E402

from atlas_bench import (  # noqa: E402
    bench, check, checkpoint, claim, emit, non_claim, predict, resolve, reveal,
)

assert sys.version_info >= (3, 12)

bench(module=34, session=5, emits="Decision-under-Uncertainty Card",
      rungs=["review-and-verify", "recognize"])

# %% [markdown]
# ## 1. One belief, three utility functions
#
# A classifier says a record is faulty with probability 0.1. That number is the
# **belief**, and it is the same in every column below.

# %%
BELIEF = {"faulty": 0.1, "sound": 0.9}
ACTIONS = ("flag for review", "let it through")

# utility[action][state] — what that outcome is worth, in whatever unit the
# organisation has agreed on. These are three DIFFERENT organisations looking at
# the SAME classifier output.
UTILITIES = {
    "cheap review, costly miss": {
        "flag for review": {"faulty": -1, "sound": -1},
        "let it through": {"faulty": -100, "sound": 0},
    },
    "costly review, cheap miss": {
        "flag for review": {"faulty": -30, "sound": -30},
        "let it through": {"faulty": -50, "sound": 0},
    },
    # Tuned so the two actions are nearly tied at the current belief: review
    # costs 12 and a miss costs 100, so the crossover sits at 12/100 = 0.12,
    # two hundredths away from the 0.1 the classifier reported.
    "marginal": {
        "flag for review": {"faulty": -12, "sound": -12},
        "let it through": {"faulty": -100, "sound": 0},
    },
}

print(f"belief: {BELIEF}   (identical in every column)\n")
for name, utility in UTILITIES.items():
    print(f"{name}:")
    for action in ACTIONS:
        print(f"    {action:>16}: faulty {utility[action]['faulty']:>5}, "
              f"sound {utility[action]['sound']:>5}")


def expected_utility(utility, action) -> float:
    return sum(BELIEF[state] * utility[action][state] for state in BELIEF)


# %%
predict(
    "The belief is 0.1 in all three columns — the same classifier, the same "
    "record. Do all three organisations take the same action?",
    answer="",  # <- fill in
    confidence="",  # sure / fairly sure / guessing
)

# %% [markdown]
# ## 2. Verify — maximise expected utility in each column

# %%
print(f"{'utility function':>28}  " +
      "  ".join(f"{a:>16}" for a in ACTIONS) + "   chosen")
decisions = {}
for name, utility in UTILITIES.items():
    values = {action: expected_utility(utility, action) for action in ACTIONS}
    chosen = max(ACTIONS, key=lambda a: values[a])
    decisions[name] = {"values": values, "chosen": chosen}
    row = "  ".join(f"{values[a]:>16.1f}" for a in ACTIONS)
    print(f"{name:>28}  {row}   {chosen}")

chosen_actions = {row["chosen"] for row in decisions.values()}

print(f"\ndistinct actions chosen from the same belief: {len(chosen_actions)}")
print(f"  {sorted(chosen_actions)}")

checkpoint("the belief is identical in every column",
           len({tuple(sorted(BELIEF.items()))}) == 1)
checkpoint("the chosen action is not",
           len(chosen_actions) > 1,
           f"{sorted(chosen_actions)} — from one probability")
checkpoint("cheap review with a costly miss flags it",
           decisions["cheap review, costly miss"]["chosen"] == "flag for review")
checkpoint("costly review with a cheap miss does not",
           decisions["costly review, cheap miss"]["chosen"] == "let it through")

# %%
resolve(
    "The belief is 0.1 in all three columns — the same classifier, the same "
    "record. Do all three organisations take the same action?",
    "matched",  # matched / diverged / partial
)

# %%
reveal(
    "The belief is 0.1 in all three columns — the same classifier, the same "
    "record. Do all three organisations take the same action?",
    """
    No. The same 0.1 leads to flagging in one column and letting it through in
    another, and nothing about the classifier changed.

    That is the session's whole claim, made arithmetic. A probability is a
    statement about **what is likely**. A decision requires that *plus* a statement
    about **what outcomes are worth**, and the second is not derivable from the
    first. Ten percent is worth acting on when a miss costs a hundred times a
    review, and not worth acting on when the review costs more than the miss.

    So "the model is 90% confident, so we should act" is not a strong argument
    stated briefly. It is an argument with a missing premise, and the missing
    premise is the one that carries the organisation's values.

    This is why a **threshold** is not a modelling decision. Picking 0.5, or 0.8,
    or 0.05 is picking a point where the expected utilities cross, and where they
    cross depends entirely on the cost matrix. A model handed to two teams with
    different cost structures should get two different thresholds from the same
    scores — and bench `m25-s4` found the matching gap on the evaluation side: an
    accuracy figure cannot tell you the right operating point, because it never
    received the costs.

    Notice what the third column does. It also says "let it through" — the same
    argmax as the second — and it says so by a margin of 2 against a crossover at
    0.12, two hundredths from the reported belief. The second column's crossover
    sits at 0.60, half the probability scale away. Identical recommendations,
    utterly different amounts to stand on, and the argmax reports neither.

    That is worth carrying into any decision output. A recommendation that would
    reverse under a 0.02 change in probability is a different kind of thing from
    one that holds across the whole plausible range, and the person who has to
    override it needs to know which they are looking at. Section 3 computes the
    crossover for each column, which is one bisection and turns "how confident is
    this recommendation?" into a number.

    And there is a third input this bench does not compute at all: **authority**.
    Expected utility says which action is *better*. It does not say who is
    permitted to take it, whether a human must confirm, or whether the system may
    act automatically. Bench `m25-s2` found a data contract carrying
    `human_override_required` and `automatic_mutation_allowed` as explicit fields
    precisely because those are not consequences of the arithmetic — they are
    constraints on who may use its output, and a decision procedure that returns
    only an argmax has dropped them silently.
    """,
)

# %% [markdown]
# ## 3. Verify — where each column changes its mind

# %%
def flip_point(utility) -> float | None:
    """The belief at which the two actions have equal expected utility."""
    low, high = 0.0, 1.0
    def better(probability: float) -> str:
        belief = {"faulty": probability, "sound": 1 - probability}
        values = {a: sum(belief[s] * utility[a][s] for s in belief) for a in ACTIONS}
        return max(ACTIONS, key=lambda a: values[a])

    if better(low) == better(high):
        return None
    for _ in range(60):
        middle = (low + high) / 2
        if better(middle) == better(low):
            low = middle
        else:
            high = middle
    return (low + high) / 2


print(f"{'utility function':>28}  {'flips at belief':>16}  "
      f"{'distance from 0.1':>18}")
flips = {}
for name, utility in UTILITIES.items():
    point = flip_point(utility)
    flips[name] = point
    if point is None:
        print(f"{name:>28}  {'never':>16}  {'-':>18}")
    else:
        print(f"{name:>28}  {point:>16.4f}  {abs(point - 0.1):>18.4f}")

fragile = [name for name, point in flips.items()
           if point is not None and abs(point - BELIEF["faulty"]) < 0.05]

print(f"\ncolumns whose recommendation would reverse within 0.05 of the current "
      f"belief: {fragile}")

checkpoint("each column has its own flip point",
           len({p for p in flips.values() if p is not None}) > 1)
checkpoint("at least one is far from the current belief",
           any(p is not None and abs(p - BELIEF["faulty"]) > 0.05
               for p in flips.values()),
           "a robust recommendation — the belief would have to move a long way")
checkpoint("and at least one is close",
           len(fragile) > 0,
           f"{fragile} — the same argmax, and far less to stand on")
checkpoint("the argmax alone does not distinguish them",
           all("chosen" in row for row in decisions.values()),
           "both report a single recommended action with no sensitivity attached")

# %% [markdown]
# ## 4. Recognize — which input supplies what?

# %%
QUESTIONS = {
    "a": "How likely is it that this record is faulty?",
    "b": "Is flagging worth its cost here?",
    "c": "At what probability should we switch from one action to the other?",
    "d": "May this system flag the record without a human?",
}
for key, text in QUESTIONS.items():
    print(f"{key}. {text}")


def answered_by_the_belief(key: str) -> bool:
    """True when the probability alone settles this."""
    raise NotImplementedError("Assign each question to belief, utility, or authority")


# %%
check("answered_by_the_belief", answered_by_the_belief,
      [(("a",), True), (("b",), False), (("c",), False), (("d",), False)])
print()
print("Only (a). (b) and (c) need the cost matrix — and (c) is the one that gets")
print("mislabelled as a modelling choice when it is entirely a utility question.")
print("(d) needs neither: no arithmetic over beliefs and costs says who is")
print("permitted to act, and a procedure that returns only an argmax has dropped")
print("that input without recording that it did.")

# %% [markdown]
# ## 5. The decision card

# %%
DECISION_CARD = """
The belief, with the model and evidence it came from:
The utility table, with the unit and who agreed on it:
The expected utility of each action:
The recommended action, and the belief at which it would reverse:
How far that flip point is from the current belief:
The authority constraint: who may act, and whether confirmation is required:
What I would report alongside the recommendation so it can be overridden well:
"""
print(DECISION_CARD)

# %%
claim("REVIEW VERDICT", DECISION_CARD)

claim(
    "LOCAL REFERENCE RESULT",
    f"Holding a belief of {BELIEF['faulty']} fixed and varying only the utility "
    f"table across {len(UTILITIES)} cost structures, expected-utility "
    f"maximisation selects {len(chosen_actions)} different actions: "
    f"{sorted(chosen_actions)}. Each column flips at its own belief — "
    f"{ {k: (round(v, 4) if v is not None else None) for k, v in flips.items()} } "
    f"— and {len(fragile)} of them would reverse within 0.05 of the current "
    f"belief, which the argmax alone does not report.",
    support={"belief": BELIEF, "actions": list(ACTIONS),
             "utilities": UTILITIES,
             "decisions": {k: {"values": v["values"], "chosen": v["chosen"]}
                           for k, v in decisions.items()},
             "flipPoints": {k: v for k, v in flips.items()},
             "fragileColumns": fragile},
)

non_claim(
    "These are three declared utility tables over a two-state, two-action decision "
    "with a declared belief; no classifier was run and no cost was measured. It "
    "establishes that expected-utility maximisation is not determined by the "
    "probability alone and that the flip point is a property of the costs. It does "
    "not establish that expected-utility maximisation is the right decision rule — "
    "risk aversion, regret minimisation, and bounded-loss criteria all give "
    "different answers on the same inputs and are defensible. It computes nothing "
    "about authority, which is a constraint rather than a quantity, and says "
    "nothing about where a real cost matrix comes from, which is usually the "
    "hardest part and is a question for the people who bear the costs."
)

emit()

# %% [markdown]
# ## 6. Transfer
#
# 1. One probability produced two actions. Write the missing premise that "90%
#    confident, so act" leaves implicit.
# 2. One column would reverse within 0.05. Name what a recommendation should carry
#    alongside the argmax, and who needs it.
# 3. Bench `m25-s4` found an accuracy figure that could not identify an operating
#    point. State what that bench and this one jointly establish about thresholds.
#
# ---
#
# ## Attributions
#
# Module 34 is authoring-only and has no checked-in reference model. The belief,
# the three utility tables, and the flip-point search are this bench's own.
