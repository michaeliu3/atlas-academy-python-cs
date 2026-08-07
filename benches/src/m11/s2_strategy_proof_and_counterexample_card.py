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
# # Bench m11-s2 — strategy proof and counterexample card
#
# **Session 11.2 — Decomposition and safe commitment.** Rungs: **recognize**
# (primary), trace.
#
# The workbook asserts that a value-density greedy is not optimal for 0/1
# selection. Asserting it and *finding the smallest instance where it loses* are
# different artifacts, and only the second is a counterexample.
#
# **Requires:** Python 3.12+. Standard library only.

# %%
from _fixture import (  # noqa: E402
    Session, exhaustive_best, greedy_by_density, greedy_by_value,
)

import sys  # noqa: E402
from itertools import product  # noqa: E402

from atlas_bench import (  # noqa: E402
    bench, check, checkpoint, claim, emit, non_claim, predict, resolve, reveal,
)

assert sys.version_info >= (3, 12)

bench(module=11, session=2, emits="strategy proof and counterexample card",
      rungs=["recognize", "trace"])

# %% [markdown]
# ## 1. Two greedy strategies and an oracle

# %%
ITEMS = (
    Session("survey", 10, 6),
    Session("proofs", 30, 15),
    Session("graphs", 30, 14),
)
BUDGET = 40

optimal, optimal_set = exhaustive_best(ITEMS, BUDGET)
density, density_set = greedy_by_density(ITEMS, BUDGET)
by_value, value_set = greedy_by_value(ITEMS, BUDGET)

print(f"budget {BUDGET} minutes")
for item in ITEMS:
    print(f"  {item.name:>8}: {item.minutes:>3} min, value {item.value:>3}, "
          f"density {item.density:.2f}")
print()
print(f"exhaustive : {optimal} via {[s.name for s in optimal_set]}")
print(f"by density : {density} via {[s.name for s in density_set]}")
print(f"by value   : {by_value} via {[s.name for s in value_set]}")

# %%
predict(
    "Density-greedy takes the best value-per-minute first. On a 0/1 selection "
    "problem, is that optimal?",
    answer="",  # <- fill in
    confidence="",  # sure / fairly sure / guessing
)

# %% [markdown]
# ## 2. Trace — search for the smallest instance where it loses

# %%
def smallest_greedy_failure(strategy):
    """The smallest instance where `strategy` is beaten by the oracle."""
    for size in (1, 2, 3):
        for minutes in product([10, 20, 30, 40], repeat=size):
            for values in product([1, 2, 3, 5], repeat=size):
                items = tuple(
                    Session(chr(97 + i), minutes[i], values[i]) for i in range(size)
                )
                for budget in (30, 40, 50):
                    best, _ = exhaustive_best(items, budget)
                    got, _ = strategy(items, budget)
                    if got < best:
                        return {"size": size, "budget": budget,
                                "items": [(s.name, s.minutes, s.value) for s in items],
                                "greedy": got, "optimal": best}
    return None


witness = smallest_greedy_failure(greedy_by_density)
print(f"smallest density-greedy failure: {witness}")

checkpoint("a counterexample exists", witness is not None)
checkpoint("and it needs only two items",
           witness["size"] == 2,
           f"{witness['items']} under budget {witness['budget']}")
checkpoint("greedy leaves value on the table",
           witness["greedy"] < witness["optimal"],
           f"{witness['greedy']} against {witness['optimal']}")

# %%
resolve(
    "Density-greedy takes the best value-per-minute first. On a 0/1 selection "
    "problem, is that optimal?",
    "matched",  # matched / diverged / partial
)

# %%
reveal(
    "Density-greedy takes the best value-per-minute first. On a 0/1 selection "
    "problem, is that optimal?",
    """
    No, and the smallest counterexample has two items.

    With a 10-minute item worth 1 and a 30-minute item worth 2, under a 30-minute
    budget: the first has density 0.10 and the second 0.067, so greedy takes the
    small one, uses 10 of 30 minutes, and cannot fit the other. Total 1. Taking
    the larger item alone scores 2.

    Two items is as small as it can be. With one item there is nothing to choose
    between, so greedy and the oracle agree trivially — which the search confirms
    before reporting the two-item case.

    The reason density-greedy fails here and succeeds on the *fractional* version
    of the same problem is the commitment structure:

    - **Fractional selection** lets you take part of an item. Filling the budget
      with the highest density available is then provably optimal, because there
      is never a leftover gap you cannot use.
    - **0/1 selection** forces all-or-nothing. Now a high-density item can occupy
      space that a lower-density item needed *entirely*, and the leftover minutes
      are wasted. Greedy has no way to unmake that choice.

    That is what "safe commitment" means in this session. A greedy step is safe
    when some optimal solution is still reachable after taking it. Density-greedy
    on fractional items is safe; on 0/1 items it is not, and the difference is not
    the strategy but the problem.

    Note what the search bought over the assertion. The workbook can say a
    counterexample exists. The search hands you the smallest one, which is
    checkable by hand in ten seconds and is therefore usable as evidence rather
    than as a claim to be trusted.
    """,
)

# %% [markdown]
# ## 3. Recognize — is each greedy step safe?

# %%
SETTINGS = {
    "a": "Fractional selection: items may be taken in part.",
    "b": "0/1 selection: items are all-or-nothing.",
    "c": "0/1 selection where every item has the same minutes.",
    "d": "0/1 selection where the budget exceeds the total of all items.",
}
for key, text in SETTINGS.items():
    print(f"{key}. {text}")


def density_greedy_is_optimal(key: str) -> bool:
    """True when taking the highest density first is safe in that setting."""
    raise NotImplementedError("Judge each setting")


# %%
check("density_greedy_is_optimal", density_greedy_is_optimal,
      [(("a",), True), (("b",), False), (("c",), True), (("d",), True)])
print()
print("(c) and (d) are the interesting ones: greedy becomes optimal again when")
print("the structure that broke it — leftover unusable budget — cannot arise.")

# %% [markdown]
# ## 4. Verify the two rescued cases

# %%
EQUAL_MINUTES = (Session("a", 20, 3), Session("b", 20, 7), Session("c", 20, 5))
AMPLE_BUDGET = 200

for label, items, budget in (
    ("equal minutes, budget 40", EQUAL_MINUTES, 40),
    ("budget exceeds everything", ITEMS, AMPLE_BUDGET),
):
    best, _ = exhaustive_best(items, budget)
    got, _ = greedy_by_density(items, budget)
    print(f"{label:>28}: greedy {got}, optimal {best}, "
          f"{'agree' if got == best else 'DISAGREE'}")
    checkpoint(f"greedy is optimal — {label}", got == best)

# %% [markdown]
# ## 5. The card

# %%
CARD = """
The strategy, stated as a rule:
The setting where it is provably optimal, and the safety argument:
The setting where it is not, and the smallest counterexample:
The structural feature that separates the two:
"""
print(CARD)

# %%
claim("DEFINITION / MODEL", CARD)

claim(
    "COUNTEREXAMPLE",
    f"Density-greedy on 0/1 selection is beaten by the exhaustive oracle on the "
    f"two-item instance {witness['items']} under budget {witness['budget']}: "
    f"{witness['greedy']} against {witness['optimal']}. One item is never enough, "
    f"so two is minimal.",
    support={"witness": witness,
             "workedExample": {"items": [(s.name, s.minutes, s.value) for s in ITEMS],
                               "budget": BUDGET, "optimal": optimal,
                               "density": density, "byValue": by_value}},
)

non_claim(
    "The search covers instances built from four minute values and four value "
    "values at up to three items. It establishes that a counterexample exists and "
    "that two items suffice for one; it does not establish greedy's worst-case "
    "approximation ratio, and it proves nothing about the fractional case, which "
    "needs the exchange argument rather than a search."
)

emit()

# %% [markdown]
# ## 6. Transfer
#
# 1. Greedy was optimal in three of four settings. Write the rule about what makes
#    a greedy step safe.
# 2. The search returned the *smallest* counterexample. State why size matters for
#    a counterexample's usefulness.
# 3. Bench `m27-s4` finds a greedy matching that is maximal but not maximum. Name
#    what the two failures have in common.
#
# ---
#
# ## Attributions
#
# Authored for this course. Module 11 has no checked-in reference model.
