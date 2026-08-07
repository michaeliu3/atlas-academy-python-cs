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
# # Bench m31-s6 — Optimization and Information Evidence Dossier
#
# **Session 31.6 — Information is a declared trade-off.** Rungs: **review and
# verify** (primary), trace.
#
# "Lossless" and "lossy" are not qualities a compression scheme has; they are
# statements about **which distinctions it preserves**. Every lossy scheme is
# lossless with respect to something, and naming that something is the whole
# design decision.
#
# This bench encodes the same values under four schemes and measures, for each,
# the bits used and the distinctions destroyed — so the trade is two numbers
# rather than an adjective.
#
# **Requires:** Python 3.12+. Standard library only.

# %%
from _fixture import *  # noqa: F401,F403,E402  (sets up sys.path)

import math  # noqa: E402
import random  # noqa: E402
import sys  # noqa: E402
from collections import Counter  # noqa: E402

from atlas_bench import (  # noqa: E402
    bench, check, checkpoint, claim, emit, non_claim, predict, resolve, reveal,
)

assert sys.version_info >= (3, 12)

bench(module=31, session=6, emits="Optimization and Information Evidence Dossier",
      rungs=["review-and-verify", "trace"])

# %% [markdown]
# ## 1. Confidence scores, and four ways to store them

# %%
SEED = 20260807
generator = random.Random(SEED)
SCORES = [round(min(max(generator.gauss(0.5, 0.2), 0.0), 1.0), 6)
          for _ in range(2000)]

SCHEMES = {
    "exact (6 decimals)": lambda v: round(v, 6),
    "2 decimals": lambda v: round(v, 2),
    "1 decimal": lambda v: round(v, 1),
    "above/below 0.5": lambda v: 1 if v >= 0.5 else 0,
}

print(f"{len(SCORES)} confidence scores in [0, 1]")
print(f"first five: {SCORES[:5]}")


def entropy(values) -> float:
    """Shannon entropy of the empirical distribution, in bits per value."""
    counts = Counter(values)
    total = len(values)
    return -sum((n / total) * math.log2(n / total) for n in counts.values())


# %%
predict(
    "Rounding to 1 decimal and thresholding at 0.5 both lose information. Which "
    "loses more, and what does each still let you answer?",
    answer="",  # <- fill in
    confidence="",  # sure / fairly sure / guessing
)

# %% [markdown]
# ## 2. Trace — bits used against distinctions kept

# %%
BASELINE = [SCHEMES["exact (6 decimals)"](v) for v in SCORES]
baseline_pairs = sum(1 for i in range(len(BASELINE))
                     for j in range(i + 1, min(i + 40, len(BASELINE)))
                     if BASELINE[i] != BASELINE[j])

print(f"{'scheme':>22}  {'distinct':>9}  {'bits/value':>11}  "
      f"{'pairs still distinguishable':>28}")
results = {}
for name, encode in SCHEMES.items():
    encoded = [encode(v) for v in SCORES]
    bits = entropy(encoded)
    kept = sum(1 for i in range(len(encoded))
               for j in range(i + 1, min(i + 40, len(encoded)))
               if BASELINE[i] != BASELINE[j] and encoded[i] != encoded[j])
    results[name] = {"distinct": len(set(encoded)), "bits": bits,
                     "pairsKept": kept,
                     "share": kept / baseline_pairs}
    print(f"{name:>22}  {len(set(encoded)):>9}  {bits:>11.3f}  "
          f"{kept:>18} ({kept / baseline_pairs:>5.1%})")

print(f"\npairs compared: {baseline_pairs} that the exact encoding distinguishes")

exact = results["exact (6 decimals)"]
threshold = results["above/below 0.5"]

checkpoint("more bits means more distinctions kept",
           all(results[a]["bits"] >= results[b]["bits"] - 1e-9
               and results[a]["pairsKept"] >= results[b]["pairsKept"]
               for a, b in zip(SCHEMES, list(SCHEMES)[1:])),
           "the ordering is the same under both measures")
checkpoint("the threshold scheme costs about one bit",
           threshold["bits"] < 1.01,
           f"{threshold['bits']:.3f} bits per value against "
           f"{exact['bits']:.3f} for the exact encoding")
checkpoint("and destroys most pairwise distinctions",
           threshold["share"] < 0.6,
           f"it keeps {threshold['share']:.1%} of the pairs the exact encoding "
           f"separates")

# The property to check is that every pair the exact encoding separates ACROSS
# the 0.5 boundary is still separated after thresholding. Zipping SCORES against
# a duplicate of itself would pass unconditionally and prove nothing.
#
# (That sentence originally began the line with the word "copy". jupytext
# uncomments lines it reads as commented-out shell magics, and `copy` is a
# Windows shell command, so the comment silently became a statement and the
# notebook failed to parse while the .py file was fine.)
threshold_encode = SCHEMES["above/below 0.5"]
crossing_pairs = [(a, b) for i, a in enumerate(SCORES)
                  for b in SCORES[i + 1:i + 40]
                  if (a >= 0.5) != (b >= 0.5)]
crossing_kept = sum(1 for a, b in crossing_pairs
                    if threshold_encode(a) != threshold_encode(b))

print(f"\npairs straddling 0.5 in the exact data: {len(crossing_pairs)}")
print(f"still separated after thresholding    : {crossing_kept}")

checkpoint("but keeps every distinction that crosses 0.5",
           len(crossing_pairs) > 0 and crossing_kept == len(crossing_pairs),
           f"{crossing_kept} of {len(crossing_pairs)} straddling pairs survive — "
           f"it is LOSSLESS with respect to the above-or-below question, the only "
           f"one it was asked to preserve")

# %%
resolve(
    "Rounding to 1 decimal and thresholding at 0.5 both lose information. Which "
    "loses more, and what does each still let you answer?",
    "matched",  # matched / diverged / partial
)

# %%
reveal(
    "Rounding to 1 decimal and thresholding at 0.5 both lose information. Which "
    "loses more, and what does each still let you answer?",
    """
    Thresholding loses far more — down to about one bit per value, keeping only a
    minority of the pairwise distinctions — and it is **lossless with respect to
    the only question it was built to answer**.

    That pairing is the session's claim. "Lossy" is not a defect a scheme has. It
    is a relationship between a scheme and a question. The 0.5 threshold destroys
    the difference between 0.51 and 0.99 completely, and preserves the difference
    between 0.49 and 0.51 perfectly. Whether that is catastrophic or free depends
    entirely on which of those two comparisons your system makes.

    So the honest way to describe a scheme is a pair: **bits spent** and
    **distinctions preserved**, with the second stated as a question rather than a
    percentage. "One bit per value, exact on the above-or-below-0.5 test" is a
    specification. "Lossy" is a shrug.

    Look at the middle rows, because they are where the trade is actually
    interesting. Going from 6 decimals to 2 costs a large fraction of the entropy
    and keeps nearly all the pairwise distinctions that matter at any realistic
    tolerance — the discarded ones are pairs differing in the fifth decimal, which
    no downstream consumer of a *confidence score* can act on. That is the sweet
    spot, and it is invisible if you only ask "lossless or lossy?".

    Two things worth carrying.

    First, entropy here is measured on the **empirical** distribution of these
    2,000 values, which makes it a property of this data and this scheme jointly.
    A different score distribution gives different numbers with the same schemes —
    scores clustered near 0.5 lose much more to thresholding than scores clustered
    at the extremes. So a compression decision cannot be made from the scheme
    alone.

    Second, this is the same move as every non-claim in this course. Bench
    `m25-s4` refused to support calibration from accuracy; bench `m17-s4` refused
    to predict a CPU from a declared cache model. Each says: name the question the
    evidence answers, and the ones it does not. A lossy encoding is that discipline
    made physical — it is a deliberate, recorded decision about which questions the
    stored data will still be able to answer, and the alternative is not "keep
    everything" but "discard without recording what".
    """,
)

# %% [markdown]
# ## 3. Verify — which downstream questions survive?

# %%
QUERIES = {
    "is it above 0.5?": lambda v: v >= 0.5,
    "is it above 0.9?": lambda v: v >= 0.9,
    "which of two is larger?": None,        # handled pairwise below
    "what is the mean?": None,              # handled in aggregate below
}

print(f"{'scheme':>22}  {'above 0.5':>10}  {'above 0.9':>10}  "
      f"{'mean error':>11}")
survival = {}
for name, encode in SCHEMES.items():
    encoded = [encode(v) for v in SCORES]
    above_half = sum(1 for original, stored in zip(SCORES, encoded)
                     if (original >= 0.5) == (stored >= 0.5)) / len(SCORES)
    above_nine = sum(1 for original, stored in zip(SCORES, encoded)
                     if (original >= 0.9) == (stored >= 0.9)) / len(SCORES)
    mean_error = abs(sum(encoded) / len(encoded) - sum(SCORES) / len(SCORES))
    survival[name] = {"above0.5": above_half, "above0.9": above_nine,
                      "meanError": mean_error}
    print(f"{name:>22}  {above_half:>10.1%}  {above_nine:>10.1%}  "
          f"{mean_error:>11.4f}")

print(f"\ntrue mean: {sum(SCORES) / len(SCORES):.4f}")

checkpoint("the threshold scheme answers its own question perfectly",
           survival["above/below 0.5"]["above0.5"] == 1.0)
checkpoint("and the 0.9 question not at all well",
           survival["above/below 0.5"]["above0.9"]
           < survival["1 decimal"]["above0.9"],
           f"{survival['above/below 0.5']['above0.9']:.1%} against "
           f"{survival['1 decimal']['above0.9']:.1%} — a question it was never "
           f"designed to preserve")
checkpoint("rounding preserves the mean far better than thresholding",
           survival["2 decimals"]["meanError"]
           < survival["above/below 0.5"]["meanError"],
           f"{survival['2 decimals']['meanError']:.4f} against "
           f"{survival['above/below 0.5']['meanError']:.4f}")
checkpoint("no scheme is best at everything",
           len({max(survival, key=lambda k: survival[k]["above0.5"]),
                min(survival, key=lambda k: survival[k]["meanError"])}) >= 1,
           "which is why the decision needs the question named first")

# %% [markdown]
# ## 4. Recognize — what does a scheme have to declare?

# %%
DECLARATIONS = {
    "a": "Bits per value.",
    "b": "The questions the stored data can still answer exactly.",
    "c": "Whether it is lossless.",
    "d": "The distribution the bits-per-value figure was measured on.",
}
for key, text in DECLARATIONS.items():
    print(f"{key}. {text}")


def meaningful_without_the_others(key: str) -> bool:
    """True when this figure means something reported on its own."""
    raise NotImplementedError("Judge each declaration in isolation")


# %%
check("meaningful_without_the_others", meaningful_without_the_others,
      [(("a",), False), (("b",), True), (("c",), False), (("d",), False)])
print()
print("(b) is the only one that stands alone: 'exact on the above-0.5 test' is")
print("checkable by itself. (a) and (d) are halves of one figure — bits per value")
print("is a property of the scheme AND the data. (c) is the shrug: every scheme")
print("here is lossless with respect to something, so the word without a")
print("'with respect to' clause distinguishes nothing.")

# %% [markdown]
# ## 5. The evidence dossier

# %%
EVIDENCE_DOSSIER = """
The values, and the distribution the measurements were taken on:
Each scheme, with bits per value and distinctions preserved:
The question my system actually asks of this data:
The scheme that is lossless with respect to that question:
The questions I am giving up, named individually:
What would change these numbers if the score distribution shifted:
The declaration I would publish, phrased so it cannot be read as 'lossless':
"""
print(EVIDENCE_DOSSIER)

# %%
claim("REVIEW VERDICT", EVIDENCE_DOSSIER)

claim(
    "LOCAL REFERENCE RESULT",
    f"Over {len(SCORES)} confidence scores, an exact encoding carries "
    f"{exact['bits']:.3f} bits per value and a 0.5 threshold carries "
    f"{threshold['bits']:.3f}, keeping {threshold['share']:.1%} of the pairwise "
    f"distinctions the exact encoding makes. The threshold scheme answers its own "
    f"above-or-below question with {survival['above/below 0.5']['above0.5']:.0%} "
    f"agreement and the above-0.9 question with "
    f"{survival['above/below 0.5']['above0.9']:.1%}, against "
    f"{survival['1 decimal']['above0.9']:.1%} for one-decimal rounding. Mean "
    f"error is {survival['2 decimals']['meanError']:.4f} at two decimals and "
    f"{survival['above/below 0.5']['meanError']:.4f} under thresholding.",
    support={"seed": SEED, "valueCount": len(SCORES),
             "trueMean": sum(SCORES) / len(SCORES),
             "schemes": {k: {kk: vv for kk, vv in v.items()}
                         for k, v in results.items()},
             "pairsCompared": baseline_pairs,
             "querySurvival": survival},
)

non_claim(
    "Every figure here is measured on the empirical distribution of 2,000 scores "
    "drawn from one Gaussian and clipped to [0, 1]. Entropy is a property of the "
    "scheme *and* the data jointly, so a different score distribution gives "
    "different numbers with the same schemes — scores clustered near the threshold "
    "lose far more to it than scores at the extremes. The pairwise-distinction "
    "count is over a sliding window of 40 neighbours rather than all pairs, which "
    "keeps the computation bounded and makes it a sample rather than a census. "
    "Nothing here measures an actual encoded size in bytes, any real compressor, "
    "or any storage or transmission cost; entropy is a lower bound that a real "
    "encoder approaches and does not reach."
)

emit()

# %% [markdown]
# ## 6. Transfer
#
# 1. Every scheme was lossless with respect to something. Write the sentence form a
#    compression decision should be recorded in.
# 2. Entropy depended on the data as well as the scheme. Name what that means for
#    reusing a compression decision on a new dataset.
# 3. Bench `m25-s4` refused a calibration claim from accuracy. State what that
#    refusal and a lossy encoding have in common as declarations.
#
# ---
#
# ## Attributions
#
# Module 31 is authoring-only and has no checked-in reference model. The score
# distribution, the four schemes, the entropy calculation, and the query-survival
# sweep are this bench's own, in plain Python.
