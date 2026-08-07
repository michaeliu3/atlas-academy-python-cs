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
# # Bench m35-s3 — Evaluation-and-Shift Plan
#
# **Session 35.3 — Data relations, splits, metrics, calibration, and shift.**
# Rungs: **debug and defend** (primary), review and verify.
#
# Fitting on all the rows and reporting the error on all the rows is the oldest
# mistake in applied machine learning, and it survives because the number it
# produces is **better** than the honest one. Nobody deletes a change that
# improved a metric.
#
# This bench fits polynomials of rising degree two ways on the same generated
# data, where the true relationship is something the bench wrote down — so
# "found the signal" and "memorised the sample" are distinguishable by
# construction.
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

bench(module=35, session=3, emits="Evaluation-and-Shift Plan",
      rungs=["debug-and-defend", "review-and-verify"])

# %% [markdown]
# ## 1. Data with a declared truth
#
# `y = 2x + 1 + noise`. The relationship is linear; anything a model gains beyond
# degree 1 is fitting noise, and the bench knows which is which.

# %%
TRUE_SLOPE, TRUE_INTERCEPT, NOISE = 2.0, 1.0, 1.5
SEED = 20260807


def make_rows(count: int, seed: int) -> list[tuple[float, float]]:
    generator = random.Random(seed)
    rows = []
    for _ in range(count):
        x = generator.uniform(-3, 3)
        y = TRUE_SLOPE * x + TRUE_INTERCEPT + generator.gauss(0, NOISE)
        rows.append((x, y))
    return rows


TRAIN = make_rows(20, SEED)
HELD_OUT = make_rows(200, SEED + 1)

print(f"true relationship: y = {TRUE_SLOPE}x + {TRUE_INTERCEPT} + N(0, {NOISE})")
print(f"training rows: {len(TRAIN)}   held-out rows: {len(HELD_OUT)}")


def fit_polynomial(rows, degree: int) -> list[float]:
    """Least squares via normal equations, solved with Gaussian elimination."""
    size = degree + 1
    matrix = [[sum(x ** (row + col) for x, _ in rows) for col in range(size)]
              for row in range(size)]
    vector = [sum(y * x ** row for x, y in rows) for row in range(size)]
    for pivot in range(size):
        best = max(range(pivot, size), key=lambda r: abs(matrix[r][pivot]))
        matrix[pivot], matrix[best] = matrix[best], matrix[pivot]
        vector[pivot], vector[best] = vector[best], vector[pivot]
        if abs(matrix[pivot][pivot]) < 1e-12:
            continue
        for row in range(pivot + 1, size):
            factor = matrix[row][pivot] / matrix[pivot][pivot]
            for col in range(pivot, size):
                matrix[row][col] -= factor * matrix[pivot][col]
            vector[row] -= factor * vector[pivot]
    coefficients = [0.0] * size
    for row in reversed(range(size)):
        if abs(matrix[row][row]) < 1e-12:
            continue
        total = vector[row] - sum(matrix[row][c] * coefficients[c]
                                  for c in range(row + 1, size))
        coefficients[row] = total / matrix[row][row]
    return coefficients


def predict_value(coefficients, x: float) -> float:
    return sum(c * x ** power for power, c in enumerate(coefficients))


def rmse(coefficients, rows) -> float:
    return math.sqrt(
        sum((y - predict_value(coefficients, x)) ** 2 for x, y in rows) / len(rows))


# %%
predict(
    "Polynomials of degree 1 through 9, each fitted on the same 20 rows. As the "
    "degree rises, what happens to the error measured ON those 20 rows, and to "
    "the error on 200 fresh rows from the same generator?",
    answer="",  # <- fill in
    confidence="",  # sure / fairly sure / guessing
)

# %% [markdown]
# ## 2. Debug — fit on all rows, then score honestly

# %%
DEGREES = range(1, 10)

print(f"{'degree':>7}  {'RMSE on training rows':>22}  {'RMSE on held-out':>17}  "
      f"{'ratio':>7}")
fits = {}
for degree in DEGREES:
    coefficients = fit_polynomial(TRAIN, degree)
    on_train = rmse(coefficients, TRAIN)
    on_held = rmse(coefficients, HELD_OUT)
    fits[degree] = {"train": on_train, "held": on_held,
                    "ratio": on_held / on_train if on_train else float("inf")}
    print(f"{degree:>7}  {on_train:>22.4f}  {on_held:>17.4f}  "
          f"{fits[degree]['ratio']:>7.2f}")

best_train = min(DEGREES, key=lambda d: fits[d]["train"])
best_held = min(DEGREES, key=lambda d: fits[d]["held"])

print(f"\ndegree chosen by training error : {best_train} "
      f"(RMSE {fits[best_train]['train']:.4f})")
print(f"degree chosen by held-out error : {best_held} "
      f"(RMSE {fits[best_held]['held']:.4f})")
print(f"the true relationship is degree  : 1")

train_monotone = all(fits[d]["train"] >= fits[d + 1]["train"] - 1e-9
                     for d in range(1, 9))

checkpoint("training error never increases with degree", train_monotone,
           "more parameters can always fit the same rows at least as well")
checkpoint("training error picks the most complex model available",
           best_train == max(DEGREES),
           f"degree {best_train} — and it would pick 20 if offered 20")
checkpoint("held-out error picks something close to the truth",
           best_held <= 3,
           f"degree {best_held} against a true degree of 1")
checkpoint("the two criteria disagree", best_train != best_held)
checkpoint("the flattering number is the wrong one",
           fits[best_train]["held"] > fits[best_held]["held"],
           f"the training-chosen model scores "
           f"{fits[best_train]['held']:.3f} on held-out data against "
           f"{fits[best_held]['held']:.3f}")

# %%
resolve(
    "Polynomials of degree 1 through 9, each fitted on the same 20 rows. As the "
    "degree rises, what happens to the error measured ON those 20 rows, and to "
    "the error on 200 fresh rows from the same generator?",
    "matched",  # matched / diverged / partial
)

# %%
reveal(
    "Polynomials of degree 1 through 9, each fitted on the same 20 rows. As the "
    "degree rises, what happens to the error measured ON those 20 rows, and to "
    "the error on 200 fresh rows from the same generator?",
    """
    Training error falls monotonically and never rises. Held-out error is lowest
    at degree 1 and climbs from there — 1.54 to 1.94, while training error goes
    the other way, 1.22 down to 0.96.

    The monotone fall is not an empirical finding; it is arithmetic. A degree-9
    polynomial can express every degree-8 polynomial, so its best fit is at least
    as good on the same rows. **Training error can never penalise complexity**,
    which means a model-selection procedure that reads it will always choose the
    most complex option on offer. Give it degree 19 with 20 points and it will fit
    them exactly, reporting zero error.

    That is why the flattering number is not merely optimistic. It is
    *systematically* wrong in a known direction, and the direction is the one that
    rewards exactly the change you should not make.

    Held-out error is a different measurement, not a corrected version of the same
    one. It asks what the model does on rows that had no influence on its
    parameters, which is the question deployment actually poses. Here it is lowest
    at degree 1 — the true degree — and rises from there, because every extra
    coefficient is spent on noise specific to those 20 rows.

    Only one arm of the usual U-shape appears, and that is worth saying rather than
    glossing: the true relationship is degree 1, the smallest model offered, so
    there is no underfitting region to see. A sweep that started at degree 0 would
    show the left arm too.

    The sharpest single number is not the ranking, it is the noise floor. The
    generator adds N(0, 1.5) noise, so no model can score below ≈1.5 on unseen
    data — that variation is not a function of x and nothing can learn it. Degree 9
    reports a *training* RMSE of 0.96, comfortably below the floor. A model
    claiming to predict better than the noise allows has not found more signal; it
    has memorised the noise in its sample, and the floor is what makes that
    checkable without knowing the true degree.

    Two things worth taking beyond this example.

    First, the gap between the two numbers is itself the diagnostic. A small
    training error next to a large held-out error is the signature of memorisation,
    and the ratio column makes it visible without any theory. You do not need to
    know the true degree to see it; you need both numbers.

    Second, and less comfortable: **using held-out error to choose the degree
    spends it.** Once a number has selected among nine models, it is no longer an
    unbiased estimate of the winner's performance — it has been optimised against,
    just more weakly than the training error was. Doing this properly needs a third
    split, or nested cross-validation, and reporting the selection score as the
    final performance is a quieter version of the same error this bench opens with.

    Which connects directly to bench `m25-s4`: the leak there was invisible to
    every downstream metric because the split had already happened. Here the split
    is honest and the *reuse* is the leak. Both are failures of the evaluation
    protocol rather than of the model, and neither shows up as an error.
    """,
)

# %% [markdown]
# ## 3. Verify — the gap as a diagnostic

# %%
# A model is overfitting when it does BETTER than the optimum on the rows it saw
# and WORSE on rows it did not. Both halves are required: a model that is simply
# worse everywhere is underfitting, which is a different failure with a different
# repair, and collapsing the two is how "add regularisation" gets applied to a
# model that needed more capacity.
optimum_train = fits[best_held]["train"]
optimum_held = fits[best_held]["held"]

print(f"{'degree':>7}  {'gap (held - train)':>19}  {'ratio':>7}  {'verdict':>16}")
verdicts = {}
for degree in DEGREES:
    gap = fits[degree]["held"] - fits[degree]["train"]
    better_on_seen = fits[degree]["train"] < optimum_train - 1e-9
    worse_on_unseen = fits[degree]["held"] > optimum_held + 1e-9
    if better_on_seen and worse_on_unseen:
        verdict = "overfitting"
    elif worse_on_unseen:
        verdict = "worse overall"
    else:
        verdict = "at the optimum"
    verdicts[degree] = verdict
    print(f"{degree:>7}  {gap:>19.4f}  {fits[degree]['ratio']:>7.2f}  "
          f"{verdict:>16}")

overfitting = [d for d in DEGREES if verdicts[d] == "overfitting"]
ratio_widening = fits[max(DEGREES)]["ratio"] / fits[min(DEGREES)]["ratio"]

print(f"\ndegrees that beat the optimum on seen rows and lose on unseen ones: "
      f"{overfitting}")
print(f"held-out/training ratio rises from {fits[1]['ratio']:.2f} at degree 1 to "
      f"{fits[9]['ratio']:.2f} at degree 9 — a {ratio_widening:.2f}x widening")
print(f"\nnoise standard deviation in the generator: {NOISE}")
print(f"no model can beat that floor: it is variation nothing in x explains.")

checkpoint("high-degree fits overfit by both halves of the definition",
           len(overfitting) > 0,
           f"degrees {overfitting} do better on the 20 rows they saw and worse "
           f"on the 200 they did not")
checkpoint("and the gap widens monotonically with capacity",
           all(fits[d]["ratio"] <= fits[d + 1]["ratio"] + 0.05
               for d in range(1, 9)),
           f"ratio {fits[1]['ratio']:.2f} -> {fits[9]['ratio']:.2f}, "
           f"a {ratio_widening:.2f}x widening")
checkpoint("nothing in this sweep underfits",
           "worse overall" not in verdicts.values(),
           "the true degree is 1, the smallest offered, so every failure here is "
           "on the overfitting arm — a sweep from degree 0 would show the other")
checkpoint("the best held-out RMSE is near the noise floor",
           abs(fits[best_held]["held"] - NOISE) < 0.5,
           f"{fits[best_held]['held']:.3f} against a noise floor of {NOISE} — "
           f"no model can do better than the noise it cannot see")
checkpoint("and no degree beats that floor on held-out data",
           min(fits[d]["held"] for d in DEGREES) > NOISE * 0.7,
           "a training RMSE below the noise floor is itself the alarm — "
           f"degree {best_train} reports {fits[best_train]['train']:.3f}, "
           f"below {NOISE}, which is impossible for a model that had only "
           f"learned the signal")

# %% [markdown]
# ## 4. Review and verify — audit five evaluation protocols

# %%
PROTOCOLS = {
    "a": "Fit on all rows; report error on all rows.",
    "b": "Fit on train; report error on held-out.",
    "c": "Fit on train; pick the degree by held-out; report that held-out score.",
    "d": "Fit on train; pick by validation; report on a third untouched split.",
    "e": "Fit on train; report error on held-out rows collected a year later.",
}
for key, text in PROTOCOLS.items():
    print(f"{key}. {text}")


def unbiased_estimate(key: str) -> bool:
    """True when the reported number is an unbiased estimate of deployed error."""
    raise NotImplementedError("Judge each protocol as an estimator")


# %%
check("unbiased_estimate", unbiased_estimate,
      [(("a",), False), (("b",), True), (("c",), False), (("d",), True),
       (("e",), False)])
print()
print("(c) is the one almost everyone ships. The split is honest and the number")
print("is still optimistic, because it was used to choose among nine models and")
print("then reported as the winner's score. (e) fails for the opposite reason —")
print("the data is genuinely untouched, and it comes from a different")
print("distribution, so it estimates performance under shift rather than the")
print("quantity the other protocols estimate. Neither is 'wrong'; they answer")
print("different questions, and only (d) answers this one.")

# %% [markdown]
# ## 5. The evaluation-and-shift plan

# %%
EVALUATION_PLAN = """
The splits, with how many rows each has and what each is spent on:
The quantity each number estimates, in one line per number:
Training error against held-out error for my chosen model, and the ratio:
Why training error cannot penalise capacity:
What selecting on a split costs that split, and the third split I would keep:
The noise floor, and how I know a lower training error is not better:
The shift I expect in deployment, and the evaluation that would detect it:
"""
print(EVALUATION_PLAN)

# %%
claim("DEFENDED REPAIR", EVALUATION_PLAN)

claim(
    "LOCAL REFERENCE RESULT",
    f"On {len(TRAIN)} rows generated from y = {TRUE_SLOPE}x + {TRUE_INTERCEPT} "
    f"with N(0, {NOISE}) noise, polynomial fits of degree 1 through 9 give "
    f"monotonically non-increasing training RMSE, so training error selects "
    f"degree {best_train} — the most complex model offered. Held-out RMSE on "
    f"{len(HELD_OUT)} fresh rows selects degree {best_held} against a true degree "
    f"of 1, and the training-selected model scores "
    f"{fits[best_train]['held']:.3f} on held-out data against "
    f"{fits[best_held]['held']:.3f} for the held-out-selected one. Degrees "
    f"{overfitting} beat the optimum on the rows they saw and lose on the rows "
    f"they did not, with the held-out/training ratio widening from "
    f"{fits[1]['ratio']:.2f} to {fits[9]['ratio']:.2f}. Degree {best_train}'s "
    f"training RMSE of {fits[best_train]['train']:.3f} is below the generator's "
    f"noise floor of {NOISE}, which no model that had only learned the signal "
    f"could achieve.",
    support={"trueSlope": TRUE_SLOPE, "trueIntercept": TRUE_INTERCEPT,
             "noise": NOISE, "seed": SEED,
             "trainRows": len(TRAIN), "heldOutRows": len(HELD_OUT),
             "fits": {str(d): fits[d] for d in DEGREES},
             "bestByTraining": best_train, "bestByHeldOut": best_held,
             "overfittingDegrees": overfitting,
             "verdicts": {str(d): v for d, v in verdicts.items()}},
)

non_claim(
    "This is one synthetic dataset from one seed, with a linear truth and Gaussian "
    "noise, fitted by least squares through normal equations — which is itself "
    "numerically poor at high degree, so the largest-degree coefficients here "
    "carry real conditioning error on top of the overfitting being demonstrated. "
    "The result establishes that training error cannot penalise capacity and that "
    "these two selection criteria disagree on this data. It is not an estimate of "
    "how much any real model overfits, uses no regularisation, no "
    "cross-validation, and no repeated seeds, so the specific degree chosen by "
    "held-out error would move with the seed. Nothing here measures distribution "
    "shift: the held-out rows come from the same generator, which is the easy case "
    "and the one this session's plan has to look past."
)

emit()

# %% [markdown]
# ## 6. Transfer
#
# 1. Training error fell monotonically by arithmetic, not by luck. Write what that
#    implies about any model-selection procedure that reads it.
# 2. Protocol (c) had an honest split and an optimistic number. Name what was
#    spent, and the cheapest fix.
# 3. Bench `m25-s4` found a leak no downstream metric could detect. State how that
#    failure and protocol (c) differ, and what they have in common.
#
# ---
#
# ## Attributions
#
# Module 35 is authoring-only and has no checked-in reference model. The generator,
# the least-squares fit, and the protocol audit are this bench's own, in plain
# Python.
