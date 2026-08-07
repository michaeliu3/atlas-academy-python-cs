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
# # Bench m11-s4 — pruning and state-sufficiency proof
#
# **Session 11.4 — Search, pruning, and state sufficiency.** Rungs: **debug and
# defend** (primary), review and verify.
#
# A prune that removes work is easy. A prune that removes only work you did not
# need is the claim, and it is checkable: run the search against an exhaustive
# oracle over every instance in a bounded family and report the first
# disagreement.
#
# **Requires:** Python 3.12+. Standard library only.

# %%
from _fixture import (  # noqa: E402
    SearchTrace, Session, backtracking_best, exhaustive_best, no_prune,
    safe_bound_prune, unsafe_score_prune,
)

import sys  # noqa: E402
from itertools import product  # noqa: E402

from atlas_bench import (  # noqa: E402
    bench, check, checkpoint, claim, emit, non_claim, predict, resolve, reveal,
)

assert sys.version_info >= (3, 12)

bench(module=11, session=4, emits="pruning and state-sufficiency proof",
      rungs=["debug-and-defend", "review-and-verify"])

# %% [markdown]
# ## 1. Three searches over one instance

# %%
ITEMS = (
    Session("survey", 10, 6),
    Session("proofs", 30, 15),
    Session("graphs", 25, 14),
    Session("review", 15, 7),
)
BUDGET = 50

PRUNES = {
    "none": no_prune,
    "safe bound": safe_bound_prune,
    "score only (suspect)": unsafe_score_prune,
}

optimal, _ = exhaustive_best(ITEMS, BUDGET)
print(f"oracle optimum: {optimal}")
print(f"{'prune':>22}  {'value':>6}  {'nodes':>6}  {'pruned':>7}")

single = {}
for name, prune in PRUNES.items():
    trace = SearchTrace()
    value, _ = backtracking_best(ITEMS, BUDGET, prune, trace)
    single[name] = {"value": value, "nodes": trace.nodes, "pruned": trace.pruned}
    print(f"{name:>22}  {value:>6}  {trace.nodes:>6}  {trace.pruned:>7}")

checkpoint("the unpruned search finds the optimum",
           single["none"]["value"] == optimal)
checkpoint("the safe prune finds it with less work",
           single["safe bound"]["value"] == optimal
           and single["safe bound"]["nodes"] < single["none"]["nodes"])

# %%
predict(
    "The suspect prune stops exploring whenever the partial value is below the "
    "best found so far. It agrees with the oracle on this instance. Will it agree "
    "on every instance?",
    answer="",  # <- fill in
    confidence="",  # sure / fairly sure / guessing
)

# %% [markdown]
# ## 2. Debug — check every instance in a bounded family

# %%
def first_disagreement(prune):
    """The first instance where this prune misses the optimum."""
    checked = 0
    for size in (2, 3, 4):
        for minutes in product([10, 20, 30], repeat=size):
            for values in product([2, 5, 9], repeat=size):
                items = tuple(
                    Session(chr(97 + i), minutes[i], values[i]) for i in range(size)
                )
                for budget in (30, 50):
                    checked += 1
                    best, _ = exhaustive_best(items, budget)
                    got, _ = backtracking_best(items, budget, prune, SearchTrace())
                    if got != best:
                        return checked, {
                            "items": [(s.name, s.minutes, s.value) for s in items],
                            "budget": budget, "search": got, "optimal": best,
                        }
    return checked, None


results = {}
for name, prune in PRUNES.items():
    checked, bad = first_disagreement(prune)
    results[name] = {"checked": checked, "disagreement": bad}
    verdict = "sound over the family" if bad is None else f"WRONG on {bad['items']}"
    print(f"{name:>22}: {checked:>5} instances checked — {verdict}")
    if bad:
        print(f"{'':>22}  budget {bad['budget']}: search {bad['search']}, "
              f"optimal {bad['optimal']}")

checkpoint("no pruning agrees with the oracle everywhere",
           results["none"]["disagreement"] is None)
checkpoint("the safe bound also agrees everywhere",
           results["safe bound"]["disagreement"] is None,
           "it prunes only branches that provably cannot win")
checkpoint("the score-only prune does not",
           results["score only (suspect)"]["disagreement"] is not None,
           "it prunes branches that could still improve")

# %%
resolve(
    "The suspect prune stops exploring whenever the partial value is below the "
    "best found so far. It agrees with the oracle on this instance. Will it agree "
    "on every instance?",
    "matched",  # matched / diverged / partial
)

# %%
reveal(
    "The suspect prune stops exploring whenever the partial value is below the "
    "best found so far. It agrees with the oracle on this instance. Will it agree "
    "on every instance?",
    """
    No. It agrees on the worked instance and fails elsewhere in the same family.

    The two prunes differ in what they compare:

    - **The safe bound** compares an *optimistic* estimate — current value plus
      everything still available — against the best found. If even taking
      everything remaining cannot beat the incumbent, no completion of this branch
      can either, so discarding it loses nothing. That is a proof, and it is why
      the prune is sound regardless of instance.
    - **The score-only prune** compares the *current* value against the best. But
      a partial solution is supposed to be worse than a complete one; that is what
      partial means. Items not yet considered could carry it past the incumbent,
      and cutting there discards branches that would have won.

    The distinction is exactly the session's "state sufficiency" question: is the
    state you are testing enough to justify the decision you are making with it?
    Current value alone is not sufficient to decide that a branch is hopeless.
    Current value *plus a bound on what remains* is.

    What makes this worth running rather than reasoning about: the suspect prune
    is right on the worked example, and on most instances. It removes real work
    and returns real answers. A test suite built from a handful of hand-chosen
    cases would very plausibly pass, and the pruning would ship. Sweeping a
    bounded family is what turns "seems fine" into "sound over this family, and
    here is the first case where the other one is not".

    Note the scope of what that buys. Agreeing with the oracle across a few
    hundred instances is not a proof of soundness in general — the optimistic-bound
    argument above is. The sweep's job is to *refute*, and it did.
    """,
)

# %% [markdown]
# ## 3. Review and verify — what did the safe prune cost?

# %%
saved = 1 - single["safe bound"]["nodes"] / single["none"]["nodes"]
print(f"nodes visited without pruning: {single['none']['nodes']}")
print(f"nodes visited with safe bound: {single['safe bound']['nodes']}")
print(f"work removed                 : {saved:.0%}")

checkpoint("the safe prune removes real work", saved > 0)

# %% [markdown]
# ## 4. Recognize — is each prune sound?

# %%
PRUNE_RULES = {
    "a": "Stop if the minutes used already exceed the budget.",
    "b": "Stop if the current value is below the best found so far.",
    "c": "Stop if the current value plus all remaining value cannot beat the best.",
    "d": "Stop if fewer than half the items have been considered.",
}
for key, text in PRUNE_RULES.items():
    print(f"{key}. {text}")


def is_sound(key: str) -> bool:
    """True when the prune can never discard a branch containing an optimum."""
    raise NotImplementedError("Judge each prune")


# %%
check("is_sound", is_sound,
      [(("a",), True), (("b",), False), (("c",), True), (("d",), False)])

# %% [markdown]
# ## 5. The proof

# %%
PROOF = """
The prune I am claiming is safe, stated as a rule:
The quantity it compares, and why that quantity is sufficient:
The argument that no optimal branch is ever discarded:
The instance that refuted the unsound prune:
Why passing my hand-written tests would not have caught it:
"""
print(PROOF)

# %%
claim("THEOREM / PROOF", PROOF)

claim(
    "COUNTEREXAMPLE",
    f"Across {results['score only (suspect)']['checked']} instances, a prune "
    f"comparing current value against the incumbent first disagrees with the "
    f"oracle on {results['score only (suspect)']['disagreement']['items']} at "
    f"budget {results['score only (suspect)']['disagreement']['budget']}: "
    f"{results['score only (suspect)']['disagreement']['search']} against "
    f"{results['score only (suspect)']['disagreement']['optimal']}. An "
    f"optimistic-bound prune agrees everywhere while removing {saved:.0%} of the "
    f"search nodes.",
    support={"singleInstance": single, "oracleOptimum": optimal,
             "familySweep": results, "workRemoved": saved},
)

non_claim(
    "The sweep covers instances built from three minute values and three value "
    "values at up to four items. Agreement across that family refutes nothing "
    "about the safe prune's soundness in general — that comes from the "
    "optimistic-bound argument, not the sweep. What the sweep establishes is a "
    "refutation of the other prune, which needs only one instance."
)

emit()

# %% [markdown]
# ## 6. Transfer
#
# 1. Both prunes removed work and only one was sound. Write the rule for what a
#    prune must compare.
# 2. The unsound prune passed the worked example. State what a hand-chosen test
#    set can and cannot establish about a search optimisation.
# 3. Bench `m04-s4` sweeps a bounded domain to refute an optimisation. Name what
#    both benches needed in order to sweep at all.
#
# ---
#
# ## Attributions
#
# Authored for this course. Module 11 has no checked-in reference model.
