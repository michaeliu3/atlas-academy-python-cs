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
# # Bench m36-s2 — Optimization–Generalization Gap Ledger
#
# **Session 36.2 — Optimization, estimation, and generalization are different
# gaps.** Rungs: **debug and defend** (primary), review and verify.
#
# "The model isn't good enough" is one sentence covering three unrelated
# shortfalls, each with a different repair. Train longer, collect more data, or
# change the hypothesis class — and choosing wrong costs weeks.
#
# This bench decomposes total error into its three parts on a problem where the
# best-in-class model is computable, so each gap is a measured number rather than
# a judgement.
#
# **Requires:** Python 3.12+. Standard library only.

# %%
from _fixture import *  # noqa: F401,F403,E402  (sets up sys.path)

import math  # noqa: E402
import random  # noqa: E402
import sys  # noqa: E402

from atlas_bench import (  # noqa: E402
    bench, check, checkpoint, claim, emit, non_claim, predict, resolve, reveal,
)

assert sys.version_info >= (3, 12)

bench(module=36, session=2, emits="Optimization–Generalization Gap Ledger",
      rungs=["debug-and-defend", "review-and-verify"])

# %% [markdown]
# ## 1. A problem where every gap is computable
#
# The truth is quadratic: `y = x² + noise`. The hypothesis class is **linear**, so
# it cannot represent the truth however well it is fitted. That makes the
# approximation gap real and measurable.

# %%
NOISE, SEED = 0.5, 20260807


def truth(x: float) -> float:
    return x * x


def sample(count: int, seed: int):
    generator = random.Random(seed)
    return [(lambda x: (x, truth(x) + generator.gauss(0, NOISE)))(
        generator.uniform(-2, 2)) for _ in range(count)]


TRAIN = sample(40, SEED)
POPULATION = sample(4000, SEED + 1)


def risk(model, rows) -> float:
    return sum((y - model(x)) ** 2 for x, y in rows) / len(rows)


def fit_linear(rows) -> tuple[float, float]:
    n = len(rows)
    mean_x = sum(x for x, _ in rows) / n
    mean_y = sum(y for _, y in rows) / n
    covariance = sum((x - mean_x) * (y - mean_y) for x, y in rows)
    variance = sum((x - mean_x) ** 2 for x, _ in rows)
    slope = covariance / variance
    return slope, mean_y - slope * mean_x


def linear(parameters):
    slope, intercept = parameters
    return lambda x: slope * x + intercept


# The best linear model on the POPULATION — the best the class can ever do.
BEST_IN_CLASS = fit_linear(POPULATION)
# The best linear model on the TRAINING SAMPLE — the best fitting can do here.
BEST_ON_SAMPLE = fit_linear(TRAIN)
# A deliberately under-trained model: gradient descent stopped early.
def undertrained(rows, steps: int = 12, step_size: float = 0.02):
    slope, intercept = 0.0, 0.0
    for _ in range(steps):
        d_slope = sum(-2 * x * (y - (slope * x + intercept)) for x, y in rows) / len(rows)
        d_intercept = sum(-2 * (y - (slope * x + intercept)) for x, y in rows) / len(rows)
        slope -= step_size * d_slope
        intercept -= step_size * d_intercept
    return slope, intercept


SHIPPED = undertrained(TRAIN)

print(f"truth            : y = x^2 + N(0, {NOISE})")
print(f"hypothesis class : linear — cannot represent the truth at any parameters")
print(f"\nbest linear on the population : slope {BEST_IN_CLASS[0]:.4f}, "
      f"intercept {BEST_IN_CLASS[1]:.4f}")
print(f"best linear on the sample     : slope {BEST_ON_SAMPLE[0]:.4f}, "
      f"intercept {BEST_ON_SAMPLE[1]:.4f}")
print(f"what we actually shipped      : slope {SHIPPED[0]:.4f}, "
      f"intercept {SHIPPED[1]:.4f}")

# %%
predict(
    "Total population risk for the shipped model splits into three gaps: what the "
    "class cannot represent, what a finite sample cost, and what stopping early "
    "cost. Which of the three is largest here?",
    answer="",  # <- fill in
    confidence="",  # sure / fairly sure / guessing
)

# %% [markdown]
# ## 2. Debug — decompose the risk

# %%
IRREDUCIBLE = NOISE ** 2

risk_best_in_class = risk(linear(BEST_IN_CLASS), POPULATION)
risk_best_on_sample = risk(linear(BEST_ON_SAMPLE), POPULATION)
risk_shipped = risk(linear(SHIPPED), POPULATION)

approximation = risk_best_in_class - IRREDUCIBLE
estimation = risk_best_on_sample - risk_best_in_class
optimization = risk_shipped - risk_best_on_sample

gaps = {
    "irreducible (noise)": IRREDUCIBLE,
    "approximation (class too small)": approximation,
    "estimation (finite sample)": estimation,
    "optimization (stopped early)": optimization,
}

print(f"{'component':>34}  {'population risk':>16}")
print(f"{'irreducible noise':>34}  {IRREDUCIBLE:>16.4f}")
print(f"{'best linear on population':>34}  {risk_best_in_class:>16.4f}")
print(f"{'best linear on sample':>34}  {risk_best_on_sample:>16.4f}")
print(f"{'shipped model':>34}  {risk_shipped:>16.4f}")

print(f"\n{'gap':>34}  {'size':>10}  {'share of total':>15}")
for name, size in gaps.items():
    print(f"{name:>34}  {size:>10.4f}  {size / risk_shipped:>14.1%}")

largest = max(gaps, key=lambda k: gaps[k])
print(f"\nlargest component: {largest}")
print(f"total population risk: {risk_shipped:.4f}  "
      f"(sum of parts: {sum(gaps.values()):.4f})")

checkpoint("the parts sum to the total",
           abs(sum(gaps.values()) - risk_shipped) < 1e-9)
checkpoint("the approximation gap is real and positive",
           approximation > 0,
           "a linear class cannot represent a quadratic truth at any parameters")
checkpoint("every gap is non-negative",
           all(size >= -1e-9 for size in gaps.values()))
checkpoint("the largest gap is not the one 'train longer' would fix",
           largest != "optimization (stopped early)",
           f"{largest} dominates; more training steps address "
           f"{gaps['optimization (stopped early)'] / risk_shipped:.1%} of the risk")

# %%
resolve(
    "Total population risk for the shipped model splits into three gaps: what the "
    "class cannot represent, what a finite sample cost, and what stopping early "
    "cost. Which of the three is largest here?",
    "matched",  # matched / diverged / partial
)

# %%
reveal(
    "Total population risk for the shipped model splits into three gaps: what the "
    "class cannot represent, what a finite sample cost, and what stopping early "
    "cost. Which of the three is largest here?",
    """
    The approximation gap dominates, and it is the one that no amount of training
    and no amount of data will touch.

    The decomposition is exact here because every reference point is computable.
    Total population risk splits into four terms, and each has a different name for
    what went wrong:

    **Irreducible** — the noise. `N(0, 0.5)` contributes 0.25 to squared error and
    nothing can remove it. A model reporting risk below this on unseen data has an
    evaluation bug, not a breakthrough.

    **Approximation** — the best *linear* model on the whole population still
    misses, because the truth is quadratic. This gap is a property of the
    hypothesis class alone. Infinite data does not shrink it. Infinite compute does
    not shrink it. Only changing the class does.

    **Estimation** — the best linear model on 40 samples is not the best linear
    model on the population. This is the gap more data closes, and the only one
    that responds to collecting more.

    **Optimization** — we stopped gradient descent after 12 steps, so we did not
    even reach the best linear fit on the sample we had. This is the gap more
    training steps close.

    Now the practical point. Three different repairs — change the class, collect
    more data, train longer — and each addresses exactly one term. Reading "the
    model isn't good enough" as a single quantity means picking one of the three at
    random, and the usual reflex is to train longer because it is cheapest to try.
    Here that reflex would chase the smallest term.

    The awkward part is that **only the optimization gap is measurable in
    practice**. You can always compare your model against a longer run. You cannot
    compute the best-in-class model without the population, and you cannot separate
    approximation from estimation without knowing the truth — which is why this
    bench had to generate the data to make the split exact.

    What you *can* do outside a bench is bound the terms indirectly, and the
    diagnostics are standard once you know which gap each one probes: train and
    held-out error close together with both high suggests approximation
    (bench `m35-s3`'s underfitting arm); a large train/held-out gap suggests
    estimation; and training loss still falling when you stopped is the
    optimization gap, and the only one you can read off a curve.

    The honest ledger therefore has three lines and two of them carry an argument
    rather than a number. That is worth more than one line carrying a number that
    silently merges all three.
    """,
)

# %% [markdown]
# ## 3. Verify — apply each repair and see which gap moves

# %%
REPAIRS = {
    "train longer (200 steps)": (
        linear(undertrained(TRAIN, steps=200)), POPULATION),
    "more data (400 samples)": (
        linear(fit_linear(sample(400, SEED + 7))), POPULATION),
    "richer class (quadratic)": (None, POPULATION),
}


def fit_quadratic(rows):
    """Least squares for a + bx + cx^2, by normal equations."""
    size = 3
    matrix = [[sum(x ** (r + c) for x, _ in rows) for c in range(size)]
              for r in range(size)]
    vector = [sum(y * x ** r for x, y in rows) for r in range(size)]
    for pivot in range(size):
        best = max(range(pivot, size), key=lambda r: abs(matrix[r][pivot]))
        matrix[pivot], matrix[best] = matrix[best], matrix[pivot]
        vector[pivot], vector[best] = vector[best], vector[pivot]
        for row in range(pivot + 1, size):
            factor = matrix[row][pivot] / matrix[pivot][pivot]
            for col in range(pivot, size):
                matrix[row][col] -= factor * matrix[pivot][col]
            vector[row] -= factor * vector[pivot]
    coefficients = [0.0] * size
    for row in reversed(range(size)):
        total = vector[row] - sum(matrix[row][c] * coefficients[c]
                                  for c in range(row + 1, size))
        coefficients[row] = total / matrix[row][row]
    return lambda x: coefficients[0] + coefficients[1] * x + coefficients[2] * x * x


REPAIRS["richer class (quadratic)"] = (fit_quadratic(TRAIN), POPULATION)

print(f"{'repair':>26}  {'population risk':>16}  {'improvement':>12}")
repairs = {}
for name, (model, rows) in REPAIRS.items():
    value = risk(model, rows)
    repairs[name] = {"risk": value, "improvement": risk_shipped - value}
    print(f"{name:>26}  {value:>16.4f}  "
          f"{risk_shipped - value:>12.4f}")

best_repair = max(repairs, key=lambda k: repairs[k]["improvement"])

print(f"\nshipped model risk: {risk_shipped:.4f}")
print(f"largest improvement: {best_repair}")
print(f"irreducible floor  : {IRREDUCIBLE:.4f}")

checkpoint("changing the class helps most",
           best_repair == "richer class (quadratic)",
           f"{repairs[best_repair]['improvement']:.4f} improvement against "
           f"{repairs['train longer (200 steps)']['improvement']:.4f} for training "
           f"longer")
checkpoint("the richer class approaches the irreducible floor",
           abs(repairs["richer class (quadratic)"]["risk"] - IRREDUCIBLE) < 0.15,
           f"{repairs['richer class (quadratic)']['risk']:.4f} against a floor of "
           f"{IRREDUCIBLE:.4f} — the approximation gap is essentially gone")
checkpoint("more data alone does not reach it",
           repairs["more data (400 samples)"]["risk"] > IRREDUCIBLE * 2,
           "ten times the data, still a linear model, still cannot bend")
checkpoint("the repair that helped matches the gap that dominated",
           largest.startswith("approximation")
           and best_repair.startswith("richer class"),
           "which is the whole point of decomposing before choosing")

# %% [markdown]
# ## 4. Recognize — which gap does each repair address?

# %%
REPAIR_LIST = {
    "a": "Run 10x more gradient steps.",
    "b": "Collect 10x more training data.",
    "c": "Add polynomial features.",
    "d": "Reduce label noise by improving the measurement instrument.",
}
for key, text in REPAIR_LIST.items():
    print(f"{key}. {text}")


def addresses_approximation(key: str) -> bool:
    """True when this repair shrinks the approximation gap."""
    raise NotImplementedError("Match each repair to the gap it moves")


# %%
check("addresses_approximation", addresses_approximation,
      [(("a",), False), (("b",), False), (("c",), True), (("d",), False)])
print()
print("(d) is the one worth noticing: it shrinks the IRREDUCIBLE term, which most")
print("decompositions treat as fixed. It is fixed given the data-generating")
print("process — and that process is sometimes something you own. Better sensors,")
print("clearer labelling guidelines, and adjudicated labels all move a floor that")
print("modelling work treats as a constant.")

# %% [markdown]
# ## 5. The gap ledger

# %%
GAP_LEDGER = """
Gap | Size (or the argument bounding it) | How I know | The repair it responds to
----+-----------------------------------+------------+--------------------------
    |                                   |            |
    |                                   |            |
    |                                   |            |

The gap I believe dominates, and the evidence:
The gap I can actually measure, and the two I can only bound:
The repair I would try first, and the gap it addresses:
What I would expect to see if I had the diagnosis wrong:
"""
print(GAP_LEDGER)

# %%
claim("DEFENDED REPAIR", GAP_LEDGER)

claim(
    "LOCAL REFERENCE RESULT",
    f"For a linear model fitted to a quadratic truth with N(0, {NOISE}) noise, "
    f"total population risk {risk_shipped:.4f} decomposes exactly into "
    f"irreducible {IRREDUCIBLE:.4f}, approximation {approximation:.4f}, "
    f"estimation {estimation:.4f}, and optimization {optimization:.4f} — the "
    f"largest being {largest} at {max(gaps.values()) / risk_shipped:.1%} of the "
    f"total. Applying each repair confirms the diagnosis: a quadratic class "
    f"reaches {repairs['richer class (quadratic)']['risk']:.4f}, close to the "
    f"{IRREDUCIBLE:.4f} floor, while ten times the data leaves a linear model at "
    f"{repairs['more data (400 samples)']['risk']:.4f} and 200 gradient steps at "
    f"{repairs['train longer (200 steps)']['risk']:.4f}.",
    support={"noise": NOISE, "seed": SEED,
             "trainRows": len(TRAIN), "populationRows": len(POPULATION),
             "bestInClass": list(BEST_IN_CLASS),
             "bestOnSample": list(BEST_ON_SAMPLE),
             "shipped": list(SHIPPED),
             "risks": {"bestInClass": risk_best_in_class,
                       "bestOnSample": risk_best_on_sample,
                       "shipped": risk_shipped},
             "gaps": gaps, "largestGap": largest,
             "repairs": repairs, "bestRepair": best_repair},
)

non_claim(
    "This decomposition is exact only because the bench generated the data: the "
    "population, the truth, and the noise level are all known, so 'best in class' "
    "and 'irreducible' are computable. Outside a bench they are not. In practice "
    "only the optimization gap is directly measurable, and approximation and "
    "estimation must be bounded by argument or by proxy diagnostics — which is the "
    "point rather than an aside. The specific sizes here follow from one seed, one "
    "quadratic truth, one linear class, and one early-stopping choice; a different "
    "under-training schedule would move the optimization term without changing the "
    "structure. Nothing here measures a real model, and squared error is assumed "
    "throughout, which makes the decomposition clean in a way other losses do not."
)

emit()

# %% [markdown]
# ## 6. Transfer
#
# 1. Three repairs each moved one term. Write the diagnostic question that should
#    precede choosing one.
# 2. Only one gap is measurable in practice. Name the two proxies you would use for
#    the others, and what each could get wrong.
# 3. Bench `m35-s3` measured a train/held-out gap. State which term of this
#    decomposition that gap probes.
#
# ---
#
# ## Attributions
#
# Module 36 is authoring-only and has no checked-in reference model. The generator,
# the three reference models, and the repair sweep are this bench's own, in plain
# Python.
