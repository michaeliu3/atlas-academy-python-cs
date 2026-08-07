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
# # Bench m11-s5 — probability and quality-bound ledger
#
# **Session 11.5 — Randomness, approximation, and uncertainty.** Rungs:
# **trace** (primary), recognize.
#
# A randomised algorithm's correctness claim is about a *distribution*. One run
# — however carefully seeded and reproducible — is a single draw, and a
# reproducible draw is still a draw.
#
# **Requires:** Python 3.12+. Standard library only.

# %%
from _fixture import *  # noqa: F401,F403,E402  (sets up sys.path)

import random  # noqa: E402
import sys  # noqa: E402
from collections import Counter as Tally  # noqa: E402

from atlas_bench import (  # noqa: E402
    bench, check, checkpoint, claim, emit, non_claim, predict, resolve, reveal,
)

assert sys.version_info >= (3, 12)

bench(module=11, session=5, emits="probability and quality-bound ledger",
      rungs=["trace", "recognize"])

# %% [markdown]
# ## 1. Reservoir sampling
#
# Choose one item uniformly from a stream of unknown length, holding one slot.

# %%
STREAM = list(range(10))


def reservoir_one(stream, rng: random.Random):
    chosen = None
    for index, item in enumerate(stream, start=1):
        if rng.randrange(index) == 0:
            chosen = item
    return chosen


single = reservoir_one(STREAM, random.Random(11))
print(f"one seeded run returns: {single}")
print(f"the same seed always returns: "
      f"{[reservoir_one(STREAM, random.Random(11)) for _ in range(3)]}")

checkpoint("the run is reproducible",
           len({reservoir_one(STREAM, random.Random(11)) for _ in range(5)}) == 1)

# %%
predict(
    "The run above is fully reproducible — same seed, same answer, every time. "
    "Does that establish the algorithm samples uniformly?",
    answer="",  # <- fill in
    confidence="",  # sure / fairly sure / guessing
)

# %% [markdown]
# ## 2. Trace — the distribution needs many runs

# %%
TRIALS = 100_000
rng = random.Random(2024)
tally = Tally(reservoir_one(STREAM, rng) for _ in range(TRIALS))

expected = TRIALS / len(STREAM)
print(f"{TRIALS:,} runs over a {len(STREAM)}-item stream")
print(f"{'item':>5}  {'count':>8}  {'share':>7}  {'expected 1/n':>13}")
shares = {}
for item in STREAM:
    shares[item] = tally[item] / TRIALS
    print(f"{item:>5}  {tally[item]:>8,}  {shares[item]:>7.4f}  "
          f"{1 / len(STREAM):>13.4f}")

worst = max(abs(s - 1 / len(STREAM)) for s in shares.values())
print(f"\nlargest deviation from 1/n: {worst:.4f}")

checkpoint("every item is selected sometimes", len(tally) == len(STREAM))
checkpoint("the empirical shares are close to uniform",
           worst < 0.01,
           f"largest deviation {worst:.4f} over {TRIALS:,} runs")

# %%
resolve(
    "The run above is fully reproducible — same seed, same answer, every time. "
    "Does that establish the algorithm samples uniformly?",
    "matched",  # matched / diverged / partial
)

# %%
reveal(
    "The run above is fully reproducible — same seed, same answer, every time. "
    "Does that establish the algorithm samples uniformly?",
    """
    No. It establishes that the run is reproducible, which is a different
    property and a weaker one.

    Reproducibility is about the *implementation*: given the same seed, the same
    sequence of decisions occurs. Uniformity is about the *distribution over
    seeds*: across all the runs you did not do, is each item equally likely?
    Fixing the seed removes exactly the variation the claim is about.

    The confusion is easy because a seeded run has every surface property of good
    evidence. It is deterministic, it is auditable, another person can re-run it
    and get your number. All of that is true and none of it bears on the claim.

    What settles uniformity is the frequency table: 100,000 runs, every share
    within a fraction of a percent of 1/n. That is evidence about the
    distribution, and it is still not a proof — the proof is the induction showing
    item k survives with probability 1/n at every step.

    So a randomised algorithm carries two independent claims and needs two
    different arguments:

    - **A correctness or quality claim** — "uniform", or "within a factor of two
      of optimal" — which is a statement about the distribution and needs either
      an argument or a frequency experiment.
    - **A reproducibility claim** — "this run can be repeated" — which is a
      statement about the implementation and seed handling.

    A ledger that records only the second, and reports one seeded run as though
    it demonstrated the first, has recorded the wrong thing carefully.
    """,
)

# %% [markdown]
# ## 3. Trace — a subtly wrong variant that one run cannot catch

# %%
def reservoir_biased(stream, rng: random.Random):
    """Off-by-one: uses randrange(index + 1) with a 0-based index."""
    chosen = None
    for index, item in enumerate(stream):
        if rng.randrange(index + 2) == 0:
            chosen = item
    return chosen


biased_rng = random.Random(2024)
biased = Tally(reservoir_biased(STREAM, biased_rng) for _ in range(TRIALS))
biased_shares = {item: biased[item] / TRIALS for item in STREAM}
biased_worst = max(abs(s - 1 / len(STREAM)) for s in biased_shares.values())

print(f"{'item':>5}  {'correct':>8}  {'biased':>8}")
for item in STREAM[:5]:
    print(f"{item:>5}  {shares[item]:>8.4f}  {biased_shares[item]:>8.4f}")
print(f"  ...")
print(f"\nlargest deviation, biased variant: {biased_worst:.4f}")

one_run_correct = reservoir_one(STREAM, random.Random(7))
one_run_biased = reservoir_biased(STREAM, random.Random(7))
print(f"\na single seeded run of each: correct -> {one_run_correct}, "
      f"biased -> {one_run_biased}")

checkpoint("the biased variant is measurably non-uniform",
           biased_worst > worst * 3,
           f"{biased_worst:.4f} against {worst:.4f}")
checkpoint("but a single run of each returns a perfectly ordinary item",
           one_run_correct in STREAM and one_run_biased in STREAM,
           "nothing about either run looks wrong")

# %% [markdown]
# ## 4. Recognize — what does each observation establish?

# %%
OBSERVATIONS = {
    "a": "The same seed produces the same result every time.",
    "b": "100,000 runs give each item a share within 0.01 of 1/n.",
    "c": "One seeded run returned item 6.",
    "d": "An induction shows item k survives with probability 1/n.",
}
for key, text in OBSERVATIONS.items():
    print(f"{key}. {text}")


def supports_uniformity(key: str) -> bool:
    """True when the observation is evidence about the distribution."""
    raise NotImplementedError("Classify each observation")


# %%
check("supports_uniformity", supports_uniformity,
      [(("a",), False), (("b",), True), (("c",), False), (("d",), True)])
print()
print("(b) and (d) both bear on uniformity and are not the same kind of thing:")
print("one is evidence, the other is proof.")

# %% [markdown]
# ## 5. The ledger

# %%
LEDGER = """
The quality claim, stated as a property of the distribution:
The evidence I have for it, and its kind (argument / frequency / neither):
The reproducibility claim, stated separately:
What my seeded run does and does not establish:
The variant this evidence would have caught, and the one it would not:
"""
print(LEDGER)

# %%
claim("DEFINITION / MODEL", LEDGER)

claim(
    "FINITE EXPERIMENT",
    f"Over {TRIALS:,} runs the reservoir sampler's largest deviation from 1/n was "
    f"{worst:.4f}; a variant with an off-by-one in its acceptance probability "
    f"deviated by {biased_worst:.4f}. A single seeded run of either returns an "
    f"unremarkable item and distinguishes nothing.",
    support={"trials": TRIALS, "shares": shares, "worstDeviation": worst,
             "biasedShares": biased_shares, "biasedWorst": biased_worst,
             "singleRuns": {"correct": one_run_correct, "biased": one_run_biased}},
)

non_claim(
    "A frequency table over 100,000 runs is evidence about the distribution, not "
    "a proof of uniformity — the proof is the per-step induction, which this "
    "bench does not carry out. The experiment also uses one stream length and one "
    "generator, and says nothing about the quality of that generator."
)

emit()

# %% [markdown]
# ## 6. Transfer
#
# 1. Reproducibility and uniformity are independent. Name a third property of a
#    randomised algorithm that is independent of both.
# 2. The biased variant needed 100,000 runs to expose. State what determines how
#    many runs a frequency experiment needs.
# 3. Bench `m30-s3` separates a convergence theorem from a finite simulation.
#    State the distinction both benches are drawing, in one sentence.
#
# ---
#
# ## Attributions
#
# Authored for this course. Module 11 has no checked-in reference model.
