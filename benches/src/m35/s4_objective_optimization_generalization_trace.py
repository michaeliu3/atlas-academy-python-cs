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
# # Bench m35-s4 — Objective–Optimization–Generalization Trace
#
# **Session 35.4 — Objectives, autodiff, optimization, and training systems.**
# Rungs: **debug and defend** (primary), review and verify.
#
# Training minimises a **loss**. Nobody wants a low loss; they want the thing the
# loss stands in for. When the two come apart, optimisation works perfectly and
# delivers the wrong system — and the training curve looks excellent throughout.
#
# This bench trains against a proxy on imbalanced data and watches the loss fall
# while the metric anyone actually cares about gets worse.
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

bench(module=35, session=4, emits="Objective–Optimization–Generalization Trace",
      rungs=["debug-and-defend", "review-and-verify"])

# %% [markdown]
# ## 1. An imbalanced problem
#
# 5% of records are faulty. The feature is weakly informative. What matters is
# **recall on the faulty class** — missing a fault is the expensive outcome — but
# training minimises average log-loss, which is dominated by the 95%.

# %%
SEED = 20260807
POSITIVE_RATE = 0.05


def make_rows(count: int, seed: int):
    generator = random.Random(seed)
    rows = []
    for _ in range(count):
        label = 1 if generator.random() < POSITIVE_RATE else 0
        # Faulty records skew high, but the distributions overlap heavily.
        feature = generator.gauss(1.0 if label else 0.0, 1.0)
        rows.append((feature, label))
    return rows


TRAIN = make_rows(2000, SEED)
HELD_OUT = make_rows(2000, SEED + 1)

positives = sum(label for _, label in TRAIN)
print(f"training rows: {len(TRAIN)}   faulty: {positives} "
      f"({positives / len(TRAIN):.1%})")
print(f"the metric that matters: recall on the faulty class")
print(f"the objective being minimised: average log-loss over all rows")


def sigmoid(z: float) -> float:
    if z >= 0:
        return 1 / (1 + math.exp(-z))
    exponent = math.exp(z)
    return exponent / (1 + exponent)


def log_loss(weight: float, bias: float, rows) -> float:
    total = 0.0
    for feature, label in rows:
        p = min(max(sigmoid(weight * feature + bias), 1e-12), 1 - 1e-12)
        total += -(label * math.log(p) + (1 - label) * math.log(1 - p))
    return total / len(rows)


def recall(weight: float, bias: float, rows, threshold: float = 0.5) -> float:
    faulty = [(f, y) for f, y in rows if y == 1]
    if not faulty:
        return float("nan")
    caught = sum(1 for f, _ in faulty
                 if sigmoid(weight * f + bias) >= threshold)
    return caught / len(faulty)


# %%
predict(
    "Gradient descent on average log-loss, 400 steps, on data that is 5% faulty. "
    "The loss falls the whole way. What happens to recall on the faulty class?",
    answer="",  # <- fill in
    confidence="",  # sure / fairly sure / guessing
)

# %% [markdown]
# ## 2. Debug — train, and watch both numbers

# %%
def train(rows, steps: int = 400, step_size: float = 0.5):
    weight, bias = 0.0, 0.0
    history = []
    for step in range(steps + 1):
        history.append((step, weight, bias))
        d_weight = d_bias = 0.0
        for feature, label in rows:
            error = sigmoid(weight * feature + bias) - label
            d_weight += error * feature
            d_bias += error
        weight -= step_size * d_weight / len(rows)
        bias -= step_size * d_bias / len(rows)
    return history


history = train(TRAIN)

print(f"{'step':>6}  {'train loss':>11}  {'held-out loss':>13}  "
      f"{'held-out recall':>15}  {'bias':>8}")
trace = {}
for step, weight, bias in history:
    if step in (0, 5, 20, 50, 100, 200, 400):
        row = {"trainLoss": log_loss(weight, bias, TRAIN),
               "heldLoss": log_loss(weight, bias, HELD_OUT),
               "recall": recall(weight, bias, HELD_OUT),
               "weight": weight, "bias": bias}
        trace[step] = row
        print(f"{step:>6}  {row['trainLoss']:>11.4f}  {row['heldLoss']:>13.4f}  "
              f"{row['recall']:>15.3f}  {bias:>8.3f}")

steps_seen = sorted(trace)
loss_fell = all(trace[a]["trainLoss"] >= trace[b]["trainLoss"] - 1e-9
                for a, b in zip(steps_seen, steps_seen[1:]))
recall_start = trace[steps_seen[0]]["recall"]
recall_end = trace[steps_seen[-1]]["recall"]

print(f"\ntrain loss fell monotonically at every sampled step: {loss_fell}")
print(f"held-out recall: {recall_start:.3f} at step 0 -> "
      f"{recall_end:.3f} at step {steps_seen[-1]}")
print(f"final bias: {trace[steps_seen[-1]]['bias']:.3f} — pushed negative, so "
      f"every prediction drifts toward 'sound'")

checkpoint("the objective is minimised as intended", loss_fell,
           "optimisation is working; nothing is broken about the training loop")
checkpoint("held-out loss falls too, so this is not overfitting",
           trace[steps_seen[-1]]["heldLoss"] < trace[steps_seen[0]]["heldLoss"],
           "the model genuinely generalises — on the objective it was given")
checkpoint("and recall on the faulty class collapses",
           recall_end < recall_start,
           f"{recall_start:.3f} -> {recall_end:.3f}")
checkpoint("the bias is driven negative",
           trace[steps_seen[-1]]["bias"] < -0.5,
           "predicting 'sound' is the cheapest way to reduce average loss when "
           "95% of rows are sound")

# %%
resolve(
    "Gradient descent on average log-loss, 400 steps, on data that is 5% faulty. "
    "The loss falls the whole way. What happens to recall on the faulty class?",
    "matched",  # matched / diverged / partial
)

# %%
reveal(
    "Gradient descent on average log-loss, 400 steps, on data that is 5% faulty. "
    "The loss falls the whole way. What happens to recall on the faulty class?",
    """
    Recall collapses from **1.000 to 0.000** while both training and held-out loss
    fall the entire way.

    Be precise about that starting point, because it is not a good model. At step 0
    the weights are zero, every record scores exactly 0.5, and the threshold catches
    all of them — recall 1.0 by flagging everything, which is worthless. Training
    then does something genuinely useful *and* destroys the metric on the way, which
    is why the collapse is not simply "the untrained model was better".

    Every part of the machinery is working. The gradient is correct. The
    optimiser converges. The held-out loss falls with the training loss, so this
    is **not** overfitting — the model generalises well on the objective it was
    handed. It is simply that the objective is not the goal.

    The mechanism is visible in the bias term. With 95% of rows labelled sound, the
    cheapest available reduction in average log-loss is to shift every prediction
    toward "sound". That trade is worth it 19 times out of 20 by the loss's own
    accounting, so gradient descent takes it, and the bias marches negative.
    Predictions cross below the 0.5 threshold, and recall falls off.

    Nothing in the training curve shows this. The loss curve is the picture of a
    healthy run, and it is the picture people look at.

    So there are three separate things that a single "the model is training well"
    conflates, and this session's trace is meant to keep them apart:

    **Optimisation** — is the loss going down? Here, yes, perfectly.

    **Generalisation** — does the loss stay down on unseen data? Here, yes.
    Bench `m35-s3` covers what happens when this one fails.

    **Objective alignment** — does the loss measure what we want? Here, **no**, and
    this is the only one of the three that no amount of training data or compute
    can fix, because it is a specification error rather than a fitting error.

    The repairs are all specification changes, and section 3 tries three: reweight
    the classes so a faulty row counts more, move the decision threshold, or
    optimise recall directly. Each is a decision about what matters, made by a
    person, and none of them is a hyperparameter to be tuned by the same loop that
    caused the problem.

    Worth noticing which repair is cheapest. Moving the threshold requires **no
    retraining at all** — and it recovers a real amount: 0.000 to 0.231 at 0.1, and
    0.906 at 0.02. So the 0.5 was genuinely part of the error, and 0.5 is a default
    nobody chose.

    It is not the whole error, though, and the sweep is honest about that. Recall
    climbs only as the flagged share climbs — 0.906 recall costs flagging 67% of
    the population for review — because the class-conditional distributions
    overlap. No threshold on this score separates what these features do not. That
    curve *is* the trade, and picking a point on it is exactly the
    belief-plus-utility decision bench `m34-s5` measured: the model supplies the
    ranking, and someone has to supply the cost of a miss against the cost of a
    review.

    Which is the useful decomposition. The threshold is a decision, the class
    weighting is a different specification of the objective, and the overlap is a
    property of the features — three distinct levers, and the training loop moves
    none of them.
    """,
)

# %% [markdown]
# ## 3. Verify — three repairs

# %%
final_weight, final_bias = history[-1][1], history[-1][2]


def train_weighted(rows, positive_weight: float, steps: int = 400,
                   step_size: float = 0.5):
    weight, bias = 0.0, 0.0
    for _ in range(steps):
        d_weight = d_bias = total = 0.0
        for feature, label in rows:
            scale = positive_weight if label == 1 else 1.0
            error = (sigmoid(weight * feature + bias) - label) * scale
            d_weight += error * feature
            d_bias += error
            total += scale
        weight -= step_size * d_weight / total
        bias -= step_size * d_bias / total
    return weight, bias


weighted_weight, weighted_bias = train_weighted(TRAIN, 1 / POSITIVE_RATE)

REPAIRS = {
    "as trained (threshold 0.5)": (final_weight, final_bias, 0.5),
    "same model, threshold 0.1": (final_weight, final_bias, 0.1),
    "class-weighted training": (weighted_weight, weighted_bias, 0.5),
}

print(f"{'configuration':>28}  {'recall':>7}  {'flagged share':>14}  "
        f"{'retrained?':>11}")
repairs = {}
for label, (w, b, threshold) in REPAIRS.items():
    value = recall(w, b, HELD_OUT, threshold)
    flagged = sum(1 for f, _ in HELD_OUT
                  if sigmoid(w * f + b) >= threshold) / len(HELD_OUT)
    repairs[label] = {"recall": value, "flaggedShare": flagged,
                      "threshold": threshold}
    print(f"{label:>28}  {value:>7.3f}  {flagged:>14.1%}  "
          f"{('yes' if 'weighted' in label else 'no'):>11}")

print(f"\nthe faulty share of the population is {POSITIVE_RATE:.0%}, so flagging "
      f"more than that is the price of recall")

checkpoint("moving the threshold recovers recall without retraining",
           repairs["same model, threshold 0.1"]["recall"]
           > repairs["as trained (threshold 0.5)"]["recall"],
           f"{repairs['as trained (threshold 0.5)']['recall']:.3f} -> "
           f"{repairs['same model, threshold 0.1']['recall']:.3f}, same weights")
checkpoint("class weighting also recovers it",
           repairs["class-weighted training"]["recall"]
           > repairs["as trained (threshold 0.5)"]["recall"])
checkpoint("both flag a larger share of the population",
           all(repairs[k]["flaggedShare"]
               > repairs["as trained (threshold 0.5)"]["flaggedShare"]
               for k in ("same model, threshold 0.1", "class-weighted training")),
           "recall is bought with review capacity — there is no free version")
checkpoint("but the threshold move does not fully recover it",
           repairs["same model, threshold 0.1"]["recall"]
           < repairs["class-weighted training"]["recall"],
           f"{repairs['same model, threshold 0.1']['recall']:.3f} against "
           f"{repairs['class-weighted training']['recall']:.3f} — the 0.5 was "
           f"part of the error and not all of it")

# %% [markdown]
# ### The trade curve the threshold actually buys

# %%
print(f"{'threshold':>10}  {'recall':>7}  {'flagged share':>14}  "
      f"{'faulty among flagged':>21}")
sweep = {}
for threshold in (0.5, 0.3, 0.2, 0.1, 0.05, 0.02):
    flagged = [(f, y) for f, y in HELD_OUT
               if sigmoid(final_weight * f + final_bias) >= threshold]
    value = recall(final_weight, final_bias, HELD_OUT, threshold)
    precision = (sum(y for _, y in flagged) / len(flagged)) if flagged else 0.0
    sweep[threshold] = {"recall": value,
                        "flaggedShare": len(flagged) / len(HELD_OUT),
                        "precision": precision}
    print(f"{threshold:>10}  {value:>7.3f}  "
          f"{len(flagged) / len(HELD_OUT):>14.1%}  {precision:>21.1%}")

print(f"\nno threshold on these weights reaches recall 1.0 without flagging "
      f"nearly everything — the features overlap.")

checkpoint("recall rises monotonically as the threshold falls",
           all(sweep[a]["recall"] <= sweep[b]["recall"] + 1e-9
               for a, b in zip(sorted(sweep, reverse=True),
                               sorted(sweep, reverse=True)[1:])))
checkpoint("and so does the share flagged for review",
           all(sweep[a]["flaggedShare"] <= sweep[b]["flaggedShare"] + 1e-9
               for a, b in zip(sorted(sweep, reverse=True),
                               sorted(sweep, reverse=True)[1:])),
           "the curve is the trade; picking a point on it is the decision")
checkpoint("the threshold alone cannot separate what the features do not",
           max(row["recall"] for row in sweep.values()) < 1.0
           or sweep[0.02]["flaggedShare"] > 0.5,
           "overlapping class-conditional distributions bound what any threshold "
           "on this score can achieve")

# %% [markdown]
# ## 4. Review and verify — which failure is this?

# %%
SYMPTOMS = {
    "a": "Training loss falls; held-out loss rises.",
    "b": "Training loss falls; held-out loss falls; the target metric worsens.",
    "c": "Training loss plateaus well above zero on a rich model.",
    "d": "Training loss falls; the target metric improves; users complain.",
}
for key, text in SYMPTOMS.items():
    print(f"{key}. {text}")


def objective_misalignment(key: str) -> bool:
    """True when the diagnosis is that the loss is not the goal."""
    raise NotImplementedError("Diagnose each symptom")


# %%
check("objective_misalignment", objective_misalignment,
      [(("a",), False), (("b",), True), (("c",), False), (("d",), True)])
print()
print("(a) is overfitting and (c) is underfitting or an optimisation problem —")
print("both are fitting failures with fitting repairs. (b) and (d) are both")
print("specification failures, one step apart: in (b) the loss does not match the")
print("metric, and in (d) the metric does not match what users need. The second")
print("is the same error committed one level up, and it is the harder one.")

# %% [markdown]
# ## 5. The objective trace

# %%
OBJECTIVE_TRACE = """
The objective being minimised, written out:
The metric that actually matters, and who says so:
Where they agree, and where they come apart:
The training curve, and what it shows about optimisation and generalisation:
The target metric over the same run:
Which of the three failures this is, and the evidence separating it from the others:
The repair, stated as a specification change and not a hyperparameter:
Who decided the threshold, and when:
"""
print(OBJECTIVE_TRACE)

# %%
claim("DEFENDED REPAIR", OBJECTIVE_TRACE)

claim(
    "LOCAL REFERENCE RESULT",
    f"Training logistic regression by gradient descent on average log-loss over "
    f"{len(TRAIN)} rows with a {POSITIVE_RATE:.0%} positive rate, training loss "
    f"falls monotonically from {trace[0]['trainLoss']:.4f} to "
    f"{trace[400]['trainLoss']:.4f} and held-out loss falls with it — so this is "
    f"not overfitting — while held-out recall on the positive class falls from "
    f"{recall_start:.3f} to {recall_end:.3f} and the bias is driven to "
    f"{trace[400]['bias']:.3f}. Reading the same weights at threshold 0.1 "
    f"recovers recall to {repairs['same model, threshold 0.1']['recall']:.3f} "
    f"with no retraining; class-weighted training reaches "
    f"{repairs['class-weighted training']['recall']:.3f}. A threshold sweep on "
    f"the unchanged weights traces the whole trade: recall {sweep[0.5]['recall']:.3f} "
    f"at {sweep[0.5]['flaggedShare']:.1%} flagged, up to {sweep[0.02]['recall']:.3f} "
    f"at {sweep[0.02]['flaggedShare']:.1%} — so the 0.5 was part of the error and "
    f"the class overlap bounds the rest.",
    support={"seed": SEED, "positiveRate": POSITIVE_RATE,
             "trainRows": len(TRAIN), "heldOutRows": len(HELD_OUT),
             "trace": {str(k): v for k, v in trace.items()},
             "lossFellMonotonically": loss_fell,
             "recallStart": recall_start, "recallEnd": recall_end,
             "repairs": repairs,
             "thresholdSweep": {str(k): v for k, v in sweep.items()}},
)

non_claim(
    "This is one synthetic imbalanced problem with one feature, one seed, logistic "
    "regression, and plain gradient descent. It establishes that a falling loss "
    "with a falling held-out loss is compatible with a collapsing target metric, "
    "and that the failure is a specification error rather than a fitting one. It "
    "does not measure how often this happens in practice, uses no regularisation "
    "or early stopping, and the specific recall numbers depend on the seed and the "
    "class overlap. It also does not establish that any of the three repairs is "
    "the right one — that is a decision requiring the cost of a miss against the "
    "cost of a review, which no training run contains."
)

emit()

# %% [markdown]
# ## 6. Transfer
#
# 1. Both loss curves looked healthy throughout. Write what a training dashboard
#    must plot alongside the loss, and why the loss alone cannot show it.
# 2. One repair needed no retraining. Name what that says about where the error
#    actually was.
# 3. Bench `m34-s5` found a threshold to be a utility decision. State how that
#    bench and this one jointly locate the 0.5 default.
#
# ---
#
# ## Attributions
#
# Module 35 is authoring-only and has no checked-in reference model. The generator,
# the training loop, the weighted variant, and the repair comparison are this
# bench's own, in plain Python.
