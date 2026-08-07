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
# # Bench m31-s5 — Stochastic Information Experiment Card
#
# **Session 31.5 — Noise is evidence, not a nuisance to hide.** Rungs: **trace**
# (primary), review and verify.
#
# A minibatch gradient is not a worse gradient. It is an **estimate** of the full
# gradient, with a bias and a variance, and those are measurable quantities rather
# than vague qualities. Treating the noise as something to be averaged away
# discards the thing that tells you how much to trust a step.
#
# This bench measures both directly against a full gradient it can compute
# exactly.
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

bench(module=31, session=5, emits="Stochastic Information Experiment Card",
      rungs=["trace", "review-and-verify"])

# %% [markdown]
# ## 1. A objective whose full gradient is computable
#
# Least squares over 1,000 fixed rows. The full gradient is the average over all
# of them; a minibatch gradient is the average over a random subset.

# %%
SEED = 20260807
generator = random.Random(SEED)
ROWS = [(x, 2.0 * x + 1.0 + generator.gauss(0, 1.0))
        for x in (generator.uniform(-3, 3) for _ in range(1000))]

WEIGHT, BIAS = 0.5, 0.0


def gradient(rows, weight: float = WEIGHT, bias: float = BIAS):
    d_weight = d_bias = 0.0
    for x, y in rows:
        error = (weight * x + bias) - y
        d_weight += 2 * error * x
        d_bias += 2 * error
    return d_weight / len(rows), d_bias / len(rows)


FULL = gradient(ROWS)
print(f"rows: {len(ROWS)}   evaluated at weight={WEIGHT}, bias={BIAS}")
print(f"full gradient: d_weight {FULL[0]:.6f}, d_bias {FULL[1]:.6f}")

# %%
predict(
    "Minibatch gradients of size 1, 10, 100, and 1000, each estimated 400 times. "
    "How does the average estimate compare to the full gradient, and how does the "
    "spread shrink as the batch grows?",
    answer="",  # <- fill in
    confidence="",  # sure / fairly sure / guessing
)

# %% [markdown]
# ## 2. Trace — measure the bias and the variance

# %%
TRIALS = 400
BATCH_SIZES = (1, 10, 100, 1000)


def sample_gradients(batch_size: int, trials: int = TRIALS):
    local = random.Random(SEED + batch_size)
    estimates = []
    for _ in range(trials):
        batch = local.sample(ROWS, batch_size)
        estimates.append(gradient(batch)[0])
    return estimates


def mean(values):
    return sum(values) / len(values)


def stdev(values):
    average = mean(values)
    return math.sqrt(sum((v - average) ** 2 for v in values) / (len(values) - 1))


print(f"{'batch':>6}  {'mean estimate':>14}  {'bias':>10}  {'std dev':>10}  "
      f"{'std dev x sqrt(n)':>18}")
statistics = {}
for size in BATCH_SIZES:
    estimates = sample_gradients(size)
    average, spread = mean(estimates), stdev(estimates)
    statistics[size] = {"mean": average, "bias": average - FULL[0],
                        "stdev": spread, "scaled": spread * math.sqrt(size)}
    print(f"{size:>6}  {average:>14.6f}  {average - FULL[0]:>10.6f}  "
          f"{spread:>10.6f}  {spread * math.sqrt(size):>18.4f}")

print(f"\nfull gradient d_weight: {FULL[0]:.6f}")

biases = [abs(row["bias"]) for row in statistics.values()]
scaled = [statistics[s]["scaled"] for s in BATCH_SIZES if s < len(ROWS)]

# A measured bias must be judged against the uncertainty of the measurement, not
# against a constant. With `trials` samples the mean has standard error
# stdev/sqrt(trials); a bias inside three of those is what zero looks like.
print(f"\n{'batch':>6}  {'|bias|':>10}  {'standard error':>15}  "
      f"{'|bias| / SE':>12}")
for size in BATCH_SIZES:
    standard_error = statistics[size]["stdev"] / math.sqrt(TRIALS)
    statistics[size]["standardError"] = standard_error
    z = (abs(statistics[size]["bias"]) / standard_error
         if standard_error > 1e-12 else 0.0)
    statistics[size]["biasInStandardErrors"] = z
    print(f"{size:>6}  {abs(statistics[size]['bias']):>10.4f}  "
          f"{standard_error:>15.4f}  {z:>12.2f}")

worst_z = max(row["biasInStandardErrors"] for row in statistics.values())

checkpoint("every batch size is unbiased within measurement error",
           worst_z < 3.0,
           f"largest deviation is {worst_z:.2f} standard errors — the batch-1 "
           f"|bias| of {statistics[1]['bias']:.3f} looks large next to nothing "
           f"and is small next to its own uncertainty of "
           f"{statistics[1]['standardError']:.3f}")
checkpoint("the spread shrinks as the batch grows",
           all(statistics[a]["stdev"] > statistics[b]["stdev"]
               for a, b in zip(BATCH_SIZES, BATCH_SIZES[1:])))
checkpoint("full-batch estimates have no spread at all",
           statistics[len(ROWS)]["stdev"] < 1e-9,
           "sampling all 1000 rows without replacement returns the full gradient "
           "every time")
checkpoint("std dev times sqrt(batch) is roughly constant",
           max(scaled) / min(scaled) < 1.5,
           f"{[round(v, 2) for v in scaled]} — the 1/sqrt(n) law, measured")

# %%
resolve(
    "Minibatch gradients of size 1, 10, 100, and 1000, each estimated 400 times. "
    "How does the average estimate compare to the full gradient, and how does the "
    "spread shrink as the batch grows?",
    "matched",  # matched / diverged / partial
)

# %%
reveal(
    "Minibatch gradients of size 1, 10, 100, and 1000, each estimated 400 times. "
    "How does the average estimate compare to the full gradient, and how does the "
    "spread shrink as the batch grows?",
    """
    Every batch size is **unbiased** — the average estimate lands on the full
    gradient — and the spread falls as `1 / sqrt(batch size)`, which the measured
    `std dev × sqrt(n)` column shows staying roughly constant.

    Those are two different properties and conflating them is the mistake this
    session is about. A minibatch gradient is not "the gradient, but worse". It is
    a random variable whose *expectation* is the gradient. Averaging over enough
    trials recovers the exact value, because there is no systematic error to
    recover from — only spread.

    The `1 / sqrt(n)` law is the practically important half, and it is
    unforgiving: to halve the noise you need **four times** the batch, and to get
    a tenth of it you need a hundred times. That is why enormous batches buy so
    little accuracy per unit of compute, and why small batches remain competitive
    despite being individually terrible estimates — you get many more of them for
    the same cost.

    Now the part the session's title is pointing at. Because the noise is a
    measurable quantity rather than a nuisance, it carries information you can act
    on. Section 3 measures the ratio of the gradient's magnitude to the estimate's
    standard deviation — a signal-to-noise ratio for the step. When it is large,
    the direction is real and worth following. When it approaches 1, the step is
    mostly noise, and taking it is not optimisation, it is a random walk with a
    learning rate attached.

    That ratio is what a stopping rule should read. "The loss stopped improving"
    conflates *reaching an optimum* with *the noise floor exceeding the signal* —
    and those need opposite responses. At an optimum you stop. At the noise floor
    you can still make progress by enlarging the batch, lowering the step size, or
    averaging iterates, all of which reduce the variance without changing the
    objective. Bench `m31-s4` found "completed" hiding three different outcomes;
    this is the same conflation one level down, inside the convergence criterion
    itself.

    Two limits worth stating. The sampling here is without replacement, so a
    "batch" of all 1,000 rows *is* the full gradient and has exactly zero spread —
    that column is a consistency check on the apparatus, not a measurement. And
    unbiasedness is a property of uniform sampling: a batch drawn by any rule
    correlated with the data — sorted order, a curriculum, a class-balanced
    sampler — is a different estimator with a bias this bench does not measure and
    would not detect.
    """,
)

# %% [markdown]
# ## 3. Verify — the signal-to-noise ratio of a step

# %%
print(f"{'batch':>6}  {'|full gradient|':>16}  {'noise (std dev)':>16}  "
      f"{'signal / noise':>15}")
ratios = {}
for size in BATCH_SIZES:
    noise = statistics[size]["stdev"]
    ratio = abs(FULL[0]) / noise if noise > 1e-12 else float("inf")
    ratios[size] = ratio
    display = "inf" if math.isinf(ratio) else f"{ratio:.2f}"
    print(f"{size:>6}  {abs(FULL[0]):>16.6f}  {noise:>16.6f}  {display:>15}")

finite = {s: r for s, r in ratios.items() if math.isfinite(r)}
print(f"\nat batch 1 the direction is barely distinguishable from noise: "
      f"ratio {ratios[1]:.2f}")
print(f"at batch 100 it is clear: ratio {ratios[100]:.2f}")

# Near an optimum the gradient shrinks and the ratio collapses, whatever the batch.
NEAR_OPTIMUM = gradient(ROWS, weight=2.0, bias=1.0)
near_noise = stdev([gradient(random.Random(1 + i).sample(ROWS, 100))[0]
                    for i in range(TRIALS)])
near_ratio = abs(NEAR_OPTIMUM[0]) / near_noise

print(f"\nevaluated near the optimum (weight 2.0, bias 1.0):")
print(f"  full gradient  : {NEAR_OPTIMUM[0]:.6f}")
print(f"  batch-100 noise: {near_noise:.6f}")
print(f"  signal / noise : {near_ratio:.2f}")

checkpoint("the ratio rises with batch size",
           all(finite[a] < finite[b]
               for a, b in zip(sorted(finite), sorted(finite)[1:])))
checkpoint("a batch of 1 is close to pure noise",
           ratios[1] < 2.0,
           f"ratio {ratios[1]:.2f} — the sign of a single-row gradient is barely "
           f"better than a coin flip here")
checkpoint("near the optimum the ratio collapses at the same batch size",
           near_ratio < ratios[100],
           f"{near_ratio:.2f} against {ratios[100]:.2f} at batch 100 — the noise "
           f"did not change, the signal did")
checkpoint("so a stalled loss has two possible causes",
           near_ratio < 2.0,
           "at an optimum, and at the noise floor, the steps look equally "
           "useless — and the repairs are opposite")

# %% [markdown]
# ## 4. Recognize — what does a noisy step tell you?

# %%
OBSERVATIONS = {
    "a": "The minibatch gradient points the wrong way on this batch.",
    "b": "The average of many minibatch gradients differs from the full gradient.",
    "c": "The loss has stopped improving.",
    "d": "The signal-to-noise ratio of the step has fallen below 1.",
}
for key, text in OBSERVATIONS.items():
    print(f"{key}. {text}")


def indicates_a_problem(key: str) -> bool:
    """True when this observation means something is actually wrong."""
    raise NotImplementedError("Separate expected noise from evidence of a defect")


# %%
check("indicates_a_problem", indicates_a_problem,
      [(("a",), False), (("b",), True), (("c",), False), (("d",), False)])
print()
print("(a) is expected: individual estimates point every which way and that is")
print("what unbiasedness permits. (b) is a real defect — a persistent gap means")
print("the sampler is not uniform, or the gradient is wrong. (c) and (d) are")
print("informative and not problems: (c) is ambiguous between two causes, and (d)")
print("identifies which one, which is exactly why it is worth computing.")

# %% [markdown]
# ## 5. The stochastic experiment card

# %%
EXPERIMENT_CARD = """
The estimator, and the quantity it estimates:
Measured bias at each batch size, with the trial count:
Measured standard deviation, and whether it follows 1/sqrt(n):
The signal-to-noise ratio at my current iterate:
Whether a stalled loss here is an optimum or a noise floor, and how I can tell:
The sampling rule, and the argument that it is uniform:
What I would change to reduce variance without changing the objective:
"""
print(EXPERIMENT_CARD)

# %%
claim("COURSE MODEL", EXPERIMENT_CARD)

claim(
    "LOCAL REFERENCE RESULT",
    f"Over {len(ROWS)} fixed rows with a full gradient of {FULL[0]:.6f}, "
    f"minibatch gradient estimates at sizes {list(BATCH_SIZES)} across "
    f"{TRIALS} trials each are unbiased to within {max(biases):.4f}, and their "
    f"standard deviations scale as 1/sqrt(n) — std dev x sqrt(n) staying within "
    f"{max(scaled) / min(scaled):.2f}x across the sampled sizes. The "
    f"signal-to-noise ratio rises from {ratios[1]:.2f} at batch 1 to "
    f"{ratios[100]:.2f} at batch 100; evaluated near the optimum it falls to "
    f"{near_ratio:.2f} at that same batch size, with the noise unchanged and the "
    f"signal gone.",
    support={"rows": len(ROWS), "seed": SEED, "trials": TRIALS,
             "evaluatedAt": {"weight": WEIGHT, "bias": BIAS},
             "fullGradient": {"dWeight": FULL[0], "dBias": FULL[1]},
             "statistics": {str(k): v for k, v in statistics.items()},
             "signalToNoise": {str(k): (None if math.isinf(v) else v)
                               for k, v in ratios.items()},
             "nearOptimum": {"gradient": NEAR_OPTIMUM[0], "noise": near_noise,
                             "ratio": near_ratio}},
)

non_claim(
    "This measures one estimator on one fixed dataset at two chosen iterates, with "
    "uniform sampling without replacement. It establishes that minibatch gradients "
    "are unbiased here and that their spread follows 1/sqrt(n) on this problem. It "
    "does not establish that the 1/sqrt(n) law holds for any estimator — a "
    "non-uniform sampler is a different estimator with a bias this apparatus would "
    "not detect — and it measures no training run, no convergence rate, and no "
    "wall-clock cost, so nothing here says which batch size is worth using. The "
    "least-squares objective is convex with a computable full gradient, which is "
    "what makes the reference exact and is not the situation the technique is "
    "usually applied in."
)

emit()

# %% [markdown]
# ## 6. Transfer
#
# 1. Halving the noise costs four times the batch. Write what that implies about
#    scaling batch size to improve gradient quality.
# 2. A stalled loss had two causes with opposite repairs. Name the measurement
#    that distinguishes them, and what it costs to compute.
# 3. Bench `m31-s4` found "completed" hiding three outcomes. State the version of
#    that conflation this bench locates inside a convergence criterion.
#
# ---
#
# ## Attributions
#
# Module 31 is authoring-only and has no checked-in reference model. The dataset,
# the gradient, and the bias/variance measurement are this bench's own, in plain
# Python floats with no numerical library.
