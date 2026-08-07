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
# # Bench m30-s3 — convergence and simulation record
#
# **Session 30.3 — Repetition, convergence, concentration, and Monte Carlo.**
# Rungs: **trace** (primary), recognize.
#
# The session's declared output separates a convergence theorem from a finite
# simulation and states the concentration bound connecting them. This bench
# instantiates that bound with real numbers — and finds it says nothing at all
# for most of the sample sizes anyone actually uses.
#
# **Requires:** Python 3.12+. Standard library only.

# %%
from _fixture import MAX_OBSERVATIONS  # noqa: E402  (sets up sys.path)

import sys  # noqa: E402
from fractions import Fraction  # noqa: E402

from atlas_bench import (  # noqa: E402
    bench, check, checkpoint, claim, emit, non_claim, predict, resolve, reveal,
)
from module30_reference import (  # noqa: E402
    bernoulli_observation_report, hoeffding_bernoulli_bound_report,
    markov_inequality_report,
)

assert sys.version_info >= (3, 12)

bench(module=30, session=3, emits="convergence and simulation record",
      rungs=["trace", "recognize"])

# %% [markdown]
# ## 1. The law of large numbers promises convergence
#
# The sample mean of a fair coin converges to 1/2. That is a theorem about the
# limit. Concentration bounds are what turn it into a statement about a *finite*
# sample — which is the only kind anyone ever has.

# %%
predict(
    "Hoeffding bounds the probability that a sample frequency deviates from the "
    "true rate by more than epsilon. For 32 fair coin flips and epsilon = 0.1, "
    "roughly what does it guarantee — under 5%, around 30%, or nothing useful?",
    answer="",  # <- fill in
    confidence="",  # sure / fairly sure / guessing
)

# %% [markdown]
# ## 2. Trace — instantiate the bound

# %%
EPSILONS = (Fraction(1, 10), Fraction(1, 5), Fraction(1, 4))
SIZES = (8, 16, 32, MAX_OBSERVATIONS)

print(f"{'n':>5}" + "".join(f"  eps={float(e):<6}" for e in EPSILONS))
bounds = {}
for n in SIZES:
    row = []
    for epsilon in EPSILONS:
        value = hoeffding_bernoulli_bound_report(n, epsilon).upper_bound
        bounds[(n, epsilon)] = value
        row.append(f"  {value:<10.4f}")
    print(f"{n:>5}" + "".join(row))

vacuous = [(n, float(e)) for (n, e), v in bounds.items() if v >= 1.0]
print(f"\ncells where the bound is >= 1 (i.e. vacuous): {len(vacuous)} of {len(bounds)}")
for n, e in sorted(vacuous):
    print(f"  n={n}, eps={e}")

checkpoint("at eps=0.1 the bound is vacuous for n = 8, 16, and 32",
           all(bounds[(n, Fraction(1, 10))] >= 1.0 for n in (8, 16, 32)),
           "it says the probability is at most 100%")
checkpoint("it becomes informative at n=64",
           bounds[(64, Fraction(1, 10))] < 1.0,
           f"{bounds[(64, Fraction(1, 10))]:.4f} — still over half")

# %%
resolve(
    "Hoeffding bounds the probability that a sample frequency deviates from the "
    "true rate by more than epsilon. For 32 fair coin flips and epsilon = 0.1, "
    "roughly what does it guarantee — under 5%, around 30%, or nothing useful?",
    "diverged",  # matched / diverged / partial
)

# %%
reveal(
    "Hoeffding bounds the probability that a sample frequency deviates from the "
    "true rate by more than epsilon. For 32 fair coin flips and epsilon = 0.1, "
    "roughly what does it guarantee — under 5%, around 30%, or nothing useful?",
    """
    Nothing useful. The bound evaluates to exactly 1.0000 — "the probability is
    at most 100%", which was already true before anyone proved a theorem.

    The bound is 2·exp(−2nε²). At n=32 and ε=0.1 the exponent is −0.64, and twice
    its exponential is about 1.05, which gets clipped to 1. It only drops below 1
    at n=64, and even there it is 0.556.

    The theorem is correct. It is also, at these sample sizes, empty — and that
    is the distinction the session is built on:

    - **The law of large numbers** says the sample mean converges. It is a
      statement about a limit, and limits do not describe any particular n.
    - **A concentration bound** converts that into a finite-n statement, but the
      conversion costs something, and at small n the cost exceeds the content.
    - **A finite simulation** produces one number. It is neither the limit nor
      the bound; it is a draw.

    Three different objects, routinely reported as though they were the same
    evidence. "It converges" and "with 32 samples I have a guarantee" are not the
    same sentence, and the second one here is false.

    The practical move is the one the numbers make obvious: notice the bound is
    vacuous *before* citing it. A guarantee of "at most 1" is not a weak result
    to be reported cautiously — it is no result.
    """,
)

# %% [markdown]
# ## 3. What a finite sample actually shows

# %%
FLIPS = [1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0]
observed = bernoulli_observation_report(Fraction(1, 2), FLIPS)

print(f"observations       : {len(FLIPS)} flips")
print(f"successes          : {observed.success_count}")
print(f"observed frequency : {observed.observed_frequency} "
      f"({float(observed.observed_frequency):.4f})")
print(f"declared rate      : {observed.declared_success_probability}")
print(f"deviation          : {observed.deviation_from_declared_probability} "
      f"({float(observed.deviation_from_declared_probability):.4f})")

bound_here = hoeffding_bernoulli_bound_report(
    len(FLIPS), observed.deviation_from_declared_probability
).upper_bound
print(f"\nHoeffding bound at this deviation and n: {bound_here:.4f}")

checkpoint("the observed deviation is small",
           observed.deviation_from_declared_probability < Fraction(1, 5))
checkpoint("but the bound for it is still uninformative",
           bound_here > 0.5,
           "a small observed deviation is not a guarantee of a small one")

# %% [markdown]
# ### Markov, for contrast — a weaker bound needing fewer assumptions

# %%
markov = markov_inequality_report(Fraction(1, 2), Fraction(3, 4))
print(f"Markov: {markov}")

# %% [markdown]
# ## 4. Recognize — three objects, one label each

# %%
STATEMENTS = {
    "a": "The sample mean converges to 1/2 as n grows without bound.",
    "b": "With 32 flips, the frequency is within 0.1 of 1/2 with high probability.",
    "c": "In this run of 16 flips the frequency was 0.5625.",
    "d": "The Hoeffding bound proves the coin is fair.",
}
for key, text in STATEMENTS.items():
    print(f"{key}. {text}")


def label(key: str) -> str:
    """One of: theorem, unsupported, observation."""
    raise NotImplementedError("Label each statement")


# %%
check("label", label,
      [(("a",), "theorem"), (("b",), "unsupported"),
       (("c",), "observation"), (("d",), "unsupported")])
print()
print("(d) inverts the direction: the bound assumes a rate and constrains the")
print("frequency. It cannot conclude anything about the rate from the frequency.")

# %% [markdown]
# ## 5. The record

# %%
RECORD = """
The theorem, stated with its quantifier:
The bound, instantiated at my actual n and epsilon:
The observation, stated as one draw:
The sample size at which the bound would first become worth citing:
"""
print(RECORD)

# %%
claim("DEFINITION / MODEL", RECORD)

claim(
    "THEOREM / PROOF",
    f"Hoeffding's bound for a Bernoulli mean at epsilon=0.1 evaluates to 1.0 "
    f"(vacuous) at n = 8, 16, and 32, and to "
    f"{bounds[(64, Fraction(1, 10))]:.4f} at n = 64.",
    support={"bounds": {f"n={n},eps={float(e)}": v for (n, e), v in bounds.items()},
             "vacuousCells": len(vacuous), "totalCells": len(bounds)},
)

claim(
    "FINITE EXPERIMENT",
    f"A fixed 16-flip fixture gave frequency "
    f"{float(observed.observed_frequency):.4f} against a declared rate of 0.5, "
    f"a deviation of {float(observed.deviation_from_declared_probability):.4f}.",
    support={"n": len(FLIPS), "successes": observed.success_count,
             "observedFrequency": str(observed.observed_frequency),
             "deviation": str(observed.deviation_from_declared_probability),
             "boundAtThisDeviation": bound_here},
)

non_claim(
    "The observations are a fixed deterministic fixture, not a random draw — the "
    "reference says so in its own limitation. Their frequency neither validates "
    "independence nor establishes that the declared rate is correct. And a bound "
    "being vacuous at these n does not mean Hoeffding is a poor bound; it means "
    "this epsilon needs more samples than the reference's 64-observation cap "
    "allows."
)

emit()

# %% [markdown]
# ## 6. Transfer
#
# 1. The bound was exactly 1.0 and therefore true. Write the rule about
#    distinguishing a true statement from an informative one.
# 2. Statement (d) inverted the direction of the inference. Name the general form
#    of that error and one other place in this course it appears.
# 3. Session 5 corrects for multiplicity. If you evaluated this bound at ten
#    different epsilons and reported the tightest, what would you owe the reader?
#
# ---
#
# ## Attributions
#
# Probes `public/downloads/module30_reference.py` —
# `hoeffding_bernoulli_bound_report`, `bernoulli_observation_report`,
# `markov_inequality_report`, and their `limitation` fields, in exact rational
# arithmetic. Not reimplemented. The vacuity sweep and the three-object
# classification are this bench's own.
