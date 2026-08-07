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
# # Bench m28-s6 — linear-algebra evidence dossier
#
# **Session 28.6 — PCA from variance and low-rank approximation.** Rungs:
# **review and verify** (primary), trace.
#
# The session asks for a dossier that names one claim the numerics cannot
# support. This bench builds the dataset that makes the obvious claim false:
# a first component retaining **99.95% of the variance** while discarding
# **100% of the decision**.
#
# **Requires:** Python 3.12+. Standard library only.

# %%
from _fixture import LABELS, OBSERVATIONS  # noqa: E402  (sets up sys.path)

import sys  # noqa: E402

from atlas_bench import (  # noqa: E402
    bench, check, checkpoint, claim, emit, non_claim, predict, resolve, reveal,
)
from module28_reference import pca_2d  # noqa: E402

assert sys.version_info >= (3, 12)

bench(module=28, session=6, emits="linear-algebra evidence dossier",
      rungs=["review-and-verify", "trace"])

# %% [markdown]
# ## 1. The dataset
#
# Two features. The first spreads widely. The second is a balanced 0/1 label —
# small in magnitude, and the only thing that matters.

# %%
print(f"{'x':>6}  {'label':>6}")
for (x, y) in OBSERVATIONS:
    print(f"{x:>6}  {y:>6}")

# %%
predict(
    "The first principal component will retain over 99% of the variance. Will a "
    "rank-one reconstruction still let you tell label 0 from label 1?",
    answer="",  # <- fill in
    confidence="",  # sure / fairly sure / guessing
)

# %% [markdown]
# ## 2. Trace — run PCA and keep one component

# %%
report = pca_2d(OBSERVATIONS)

print(f"mean                   : {tuple(str(v) for v in report.mean)}")
print(f"eigenvalues            : {report.eigenvalues[0]:.4f}, {report.eigenvalues[1]:.4f}")
print(f"principal direction    : ({report.principal_direction[0]:.4f}, "
      f"{report.principal_direction[1]:.4f})")
print(f"retained variance ratio: {report.retained_variance_ratio:.6f}")

checkpoint("the first component retains over 99% of the variance",
           report.retained_variance_ratio > 0.99,
           f"{report.retained_variance_ratio * 100:.3f}%")

# %% [markdown]
# ### What survived the reconstruction?

# %%
print(f"{'x':>6}  {'true label':>11}  {'reconstructed 2nd feature':>26}")
reconstructed = []
for (x, y), (rx, ry) in zip(OBSERVATIONS, report.rank_one_reconstructions):
    reconstructed.append(ry)
    print(f"{x:>6}  {y:>11}  {ry:>26.4f}")

spread = max(reconstructed) - min(reconstructed)
label_gap = 1.0
print(f"\nreconstructed spread : {spread:.4f}")
print(f"true label gap       : {label_gap:.4f}")

checkpoint("every reconstructed label collapses toward the same value",
           spread < 0.2,
           f"spread {spread:.4f} against a true gap of {label_gap}")

# %% [markdown]
# ### Can a threshold recover the label?

# %%
def best_threshold_accuracy(values, labels):
    """Best achievable accuracy from any single threshold on `values`."""
    best = 0.0
    candidates = sorted(set(values))
    cuts = [(a + b) / 2 for a, b in zip(candidates, candidates[1:])]
    for cut in cuts or [0.0]:
        for polarity in (1, -1):
            correct = sum(
                1 for v, y in zip(values, labels)
                if ((v > cut) == (polarity == 1)) == (y == 1)
            )
            best = max(best, correct / len(labels))
    return best


accuracy = best_threshold_accuracy(reconstructed, LABELS)
print(f"best threshold accuracy on the reconstruction: {accuracy:.0%}")
print(f"accuracy from always guessing one class       : {max(LABELS.count(0), LABELS.count(1)) / len(LABELS):.0%}")

checkpoint("the reconstruction is no better than guessing",
           accuracy <= 0.75,
           "99.95% of the variance kept, and the label is gone")

# %%
resolve(
    "The first principal component will retain over 99% of the variance. Will a "
    "rank-one reconstruction still let you tell label 0 from label 1?",
    "diverged",  # matched / diverged / partial
)

# %%
reveal(
    "The first principal component will retain over 99% of the variance. Will a "
    "rank-one reconstruction still let you tell label 0 from label 1?",
    """
    No. The reconstruction keeps 99.95% of the variance and destroys the label
    completely — every reconstructed value collapses to roughly 0.5, and no
    threshold beats guessing.

    PCA maximises *retained variance*. It has no notion of what the data is for.
    Here the first feature has a spread of 60 and the label has a spread of 1, so
    the direction of greatest variance is essentially the x-axis, and the label
    lives almost entirely in the direction PCA throws away.

    The dangerous part is that every number looks excellent. 99.95% retained is
    the figure that gets reported, and it is true. It is simply not a statement
    about whether the discarded 0.05% mattered.

    Two consequences worth carrying forward:

    - **Variance is not information.** They coincide only when the thing you care
      about happens to vary a lot. Scale one feature by 1000 and PCA's answer
      changes completely, though the data means the same thing — which is why
      standardisation is a modelling decision, not a preprocessing detail.
    - **The retained-variance ratio cannot detect this failure.** No threshold on
      it would have warned you. Detecting it requires evaluating against the
      decision, which is a different experiment from the one PCA runs.

    The reference model says as much in its own `limitation` field: the choice of
    retained rank remains a modelling decision. This bench is what that sentence
    means when it goes wrong.
    """,
)

# %% [markdown]
# ## 3. Review and verify — audit four claims

# %%
CLAIMS = {
    "a": "The first component retains more than 99% of the variance.",
    "b": "Therefore the rank-one reconstruction preserves what the data is for.",
    "c": "A higher retained-variance ratio would have prevented this failure.",
    "d": "Rescaling the first feature would change which direction PCA selects.",
}
for key, text in CLAIMS.items():
    print(f"{key}. {text}")


def supported(key: str) -> bool:
    """True when this bench's evidence supports the claim as written."""
    raise NotImplementedError("Audit the four claims")


# %%
check("supported", supported,
      [(("a",), True), (("b",), False), (("c",), False), (("d",), True)])

# %% [markdown]
# ## 4. The dossier

# %%
DOSSIER = """
The claim I reject, stated as someone would actually say it:
The measurement that refutes it:
What evidence WOULD justify discarding a component:
The modelling decision hiding inside "99.95% retained":
"""
print(DOSSIER)

# %%
claim("REVIEW VERDICT", DOSSIER)

claim(
    "FINITE EXPERIMENT",
    f"A rank-one PCA reconstruction retaining "
    f"{report.retained_variance_ratio * 100:.3f}% of the variance collapsed an "
    f"eight-sample binary label to a spread of {spread:.4f} against a true gap "
    f"of 1.0; the best single threshold on the reconstruction achieved "
    f"{accuracy:.0%} accuracy, no better than the majority class.",
    support={"retainedVarianceRatio": report.retained_variance_ratio,
             "eigenvalues": list(report.eigenvalues),
             "reconstructedSpread": spread,
             "bestThresholdAccuracy": accuracy,
             "labels": list(LABELS)},
)

non_claim(
    "Eight hand-built observations in two dimensions establish that retained "
    "variance can be uninformative about a decision — one counterexample is "
    "enough for that. They establish nothing about how often it happens on real "
    "data, and nothing about PCA's behaviour in higher dimensions, where the "
    "reference model does not operate at all."
)

emit()

# %% [markdown]
# ## 5. Transfer
#
# 1. The reported metric was true and the conclusion drawn from it was false.
#    Name one other metric in this course with the same property.
# 2. Rescaling feature one changes PCA's answer while changing nothing about what
#    the data means. State what that implies about PCA's inputs.
# 3. Which module will give you the vocabulary for "evaluate against the decision
#    rather than against the representation"?
#
# ---
#
# ## Attributions
#
# Probes `public/downloads/module28_reference.py` — `pca_2d`, its
# `rank_one_reconstructions`, `retained_variance_ratio`, and its `limitation`
# field. Not reimplemented. The adversarial dataset, the threshold recovery test,
# and the claim audit are this bench's own.
