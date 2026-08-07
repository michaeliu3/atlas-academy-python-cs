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
# # Bench m36-s3 — Limit-and-Nonclaim Card
#
# **Session 36.3 — Capacity, learnability, computational limits, and theorem
# scope.** Rungs: **review and verify** (primary), trace.
#
# A generalization bound is a theorem, and a theorem is true. That is exactly what
# makes it dangerous to quote: **true** and **informative** are different
# properties, and a bound can be perfectly true while saying nothing at all.
#
# This bench instantiates a standard uniform-deviation bound across six realistic
# settings. In two of them it guarantees that the true error is at most 1.14 —
# which every probability already satisfies. In the other four it is genuinely
# informative. Same formula; only the arithmetic at *your* n decides which.
#
# **Requires:** Python 3.12+. Standard library only.

# %%
from _fixture import *  # noqa: F401,F403,E402  (sets up sys.path)

import math  # noqa: E402
import sys  # noqa: E402

from atlas_bench import (  # noqa: E402
    bench, check, checkpoint, claim, emit, non_claim, predict, resolve, reveal,
)

assert sys.version_info >= (3, 12)

bench(module=36, session=3, emits="Limit-and-Nonclaim Card",
      rungs=["review-and-verify", "trace"])

# %% [markdown]
# ## 1. The bound
#
# For a finite hypothesis class of size `|H|`, with probability at least `1 − δ`,
# every hypothesis satisfies
#
# ```text
#   true error  ≤  training error  +  sqrt( ( ln|H| + ln(2/δ) ) / (2n) )
# ```
#
# The square-root term is the **uniform deviation** ε. It is what the theorem buys
# you, and it depends on the class size and the sample size — not on the data.

# %%
def deviation(hypothesis_count: float, n: int, delta: float = 0.05) -> float:
    """The uniform-deviation term epsilon."""
    return math.sqrt((math.log(hypothesis_count) + math.log(2 / delta)) / (2 * n))


# A linear model over d binary features, with 32-bit floats, is a finite class:
# 2^(32(d+1)) representable parameter settings. Log of that is what the bound uses.
def log_class_size(dimension: int, bits: int = 32) -> float:
    return bits * (dimension + 1) * math.log(2)


def deviation_from_log(log_size: float, n: int, delta: float = 0.05) -> float:
    return math.sqrt((log_size + math.log(2 / delta)) / (2 * n))


print(f"a linear model over d float32 parameters is a finite class of size "
      f"2^(32(d+1))")
for dimension in (10, 100, 1000):
    print(f"  d = {dimension:>5}: ln|H| = {log_class_size(dimension):>12,.0f}")

# %%
predict(
    "A linear model over 100 float32 parameters with delta = 0.05. What does the "
    "uniform-deviation bound guarantee about the true error at n = 1,000 — and "
    "is that the same kind of answer it gives at n = 1,000,000?",
    answer="",  # <- fill in
    confidence="",  # sure / fairly sure / guessing
)

# %% [markdown]
# ## 2. Trace — instantiate the bound at realistic sizes

# %%
TRAINING_ERROR = 0.08
DELTA = 0.05
SETTINGS = [(100, 1_000), (1000, 10_000), (100, 5_000), (10, 5_000),
            (100, 50_000), (100, 1_000_000)]

print(f"training error {TRAINING_ERROR}, delta {DELTA}\n")
print(f"{'d':>6}  {'n':>10}  {'epsilon':>10}  {'bound on true error':>20}  "
      f"{'informative?':>12}")
rows = {}
for dimension, n in SETTINGS:
    epsilon = deviation_from_log(log_class_size(dimension), n, DELTA)
    bound = TRAINING_ERROR + epsilon
    informative = bound < 1.0
    rows[(dimension, n)] = {"epsilon": epsilon, "bound": bound,
                            "informative": informative}
    print(f"{dimension:>6}  {n:>10,}  {epsilon:>10.3f}  {bound:>20.3f}  "
          f"{str(informative):>12}")

vacuous = [key for key, row in rows.items() if not row["informative"]]

print(f"\nsettings where the bound is >= 1 and therefore vacuous: {len(vacuous)} "
      f"of {len(SETTINGS)}")
print(f"  {vacuous}")

checkpoint("the bound is vacuous in some realistic settings", len(vacuous) > 0,
           f"{len(vacuous)} of {len(SETTINGS)}")
checkpoint("a 100-parameter model on 1,000 examples gets no guarantee",
           not rows[(100, 1_000)]["informative"],
           f"bound = {rows[(100, 1_000)]['bound']:.2f} — every probability is "
           f"already at most 1")
checkpoint("the bound is still TRUE there", True,
           "nothing is wrong with the theorem; the guarantee is simply empty")
checkpoint("and it is informative in others",
           rows[(100, 1_000_000)]["informative"]
           and rows[(10, 5_000)]["informative"],
           f"n = 1,000,000 gives {rows[(100, 1_000_000)]['bound']:.3f}; "
           f"d = 10 at n = 5,000 gives {rows[(10, 5_000)]['bound']:.3f}")
checkpoint("so 'is there a bound?' is the wrong question",
           len(vacuous) > 0 and len(vacuous) < len(SETTINGS),
           "the same formula is empty in one regime and tight in another — only "
           "the arithmetic at YOUR n decides which")

# %%
resolve(
    "A linear model over 100 float32 parameters with delta = 0.05. What does the "
    "uniform-deviation bound guarantee about the true error at n = 1,000 — and "
    "is that the same kind of answer it gives at n = 1,000,000?",
    "matched",  # matched / diverged / partial
)

# %%
reveal(
    "A linear model over 100 float32 parameters with delta = 0.05. What does the "
    "uniform-deviation bound guarantee about the true error at n = 1,000 — and "
    "is that the same kind of answer it gives at n = 1,000,000?",
    """
    At n = 1,000 it guarantees the true error is at most **1.14**. Since every
    error rate is at most 1 by definition, the bound has told you nothing. At
    n = 1,000,000 the same formula gives **0.113**, which is a real guarantee.

    Read the first one carefully, because the natural reaction is that something
    went wrong. Nothing did. The theorem is correct, the arithmetic is correct, and
    "true error ≤ 1.14 with probability at least 95%" is *true*. It is also true of
    a model that outputs coin flips, and of one that has never seen the data. A
    statement that holds for every possible hypothesis distinguishes none of them.

    So **true** and **informative** come apart, and only one of them is a property
    of the theorem. The theorem always supplies the first. Whether you get the
    second depends on numbers you bring: the class size, the sample size, and the
    confidence you asked for.

    Where the number comes from is worth working out. A linear model over 100
    float32 parameters has 2^(32·101) representable settings, so `ln|H|` is about
    **2,240** — the log of an astronomically large number is merely large. Divide by
    2n and take a square root: at n = 1,000 that is √(2244/2000) ≈ 1.06, and at
    n = 1,000,000 it is √(2244/2000000) ≈ 0.033. The whole difference between an
    empty guarantee and a useful one is that division.

    That is the mechanism, and it is a *uniform* deviation bound doing exactly what
    it says: it holds simultaneously for all hypotheses, so it must be loose enough
    to cover the worst one. You are paying for hypotheses your training never
    considered.

    Which sets up the honest reading. This bound is not a tool for estimating your
    model's error — a held-out set does that far better, and bench `m25-s4` covers
    what that requires. The bound is a statement about *how the sample size, the
    class capacity, and the confidence level trade against one another*. It tells
    you that capacity is not free and roughly what it costs. Reading it as a
    numerical prediction about your model is the category error the session names.

    So the reviewable question is never "is there a bound?" but **"is the bound
    non-vacuous at my n?"** — one line of arithmetic that almost nobody runs, and
    that this bench exists to make routine. Two of the six settings here fail it
    and four pass, which is the useful shape of the answer: not "bounds are
    vacuous", but "this one is vacuous *there* and informative *here*, and you can
    tell which in a single evaluation".
    """,
)

# %% [markdown]
# ## 3. Trace — how much data would it take?

# %%
def required_n(dimension: int, target_epsilon: float, delta: float = DELTA) -> int:
    log_size = log_class_size(dimension)
    return math.ceil((log_size + math.log(2 / delta)) / (2 * target_epsilon ** 2))


print(f"{'d':>6}  {'n for eps=0.1':>16}  {'n for eps=0.05':>16}  "
      f"{'n for eps=0.01':>16}")
requirements = {}
for dimension in (10, 100, 1000):
    row = {target: required_n(dimension, target) for target in (0.1, 0.05, 0.01)}
    requirements[dimension] = row
    print(f"{dimension:>6}  {row[0.1]:>16,}  {row[0.05]:>16,}  {row[0.01]:>16,}")

print(f"\nquartering epsilon costs 16x the data: "
      f"{requirements[100][0.05] / requirements[100][0.1]:.0f}x for halving, "
      f"{requirements[100][0.01] / requirements[100][0.05]:.0f}x for fifthing")

checkpoint("the sample requirement grows linearly in the parameter count",
           abs(requirements[1000][0.1] / requirements[100][0.1]
               - log_class_size(1000) / log_class_size(100)) < 0.05,
           "ln|H| is linear in d, and n is linear in ln|H|")
checkpoint("it grows quadratically as epsilon shrinks",
           abs(requirements[100][0.05] / requirements[100][0.1] - 4) < 0.1,
           "halving epsilon costs 4x the data")
checkpoint("a 1000-parameter model needs a lot for a tight bound",
           requirements[1000][0.01] > 10_000_000,
           f"{requirements[1000][0.01]:,} examples for epsilon = 0.01")

# %% [markdown]
# ## 4. Review and verify — audit five statements

# %%
STATEMENTS = {
    "a": "The bound is true at d = 100, n = 5,000.",
    "b": "The bound tells us something useful at d = 100, n = 5,000.",
    "c": "The model's true error is probably near its training error.",
    "d": "Capacity costs sample size, roughly linearly in ln|H|.",
    "e": "A held-out estimate would be tighter than this bound here.",
}
for key, text in STATEMENTS.items():
    print(f"{key}. {text}")


def supported(key: str) -> bool:
    """True when this bench's arithmetic supports the statement."""
    raise NotImplementedError("Separate a true bound from an informative one")


# %%
check("supported", supported,
      [(("a",), True), (("b",), False), (("c",), False), (("d",), True),
       (("e",), False)])
print()
print("(e) is the trap for the careful reader. A held-out estimate almost")
print("certainly IS tighter — but nothing in this bench measured one, so the")
print("statement is unsupported HERE even though it is very likely true. Refusing")
print("a claim you believe is the discipline; bench m25-s4 is where the held-out")
print("evidence would have to come from.")

# %% [markdown]
# ## 5. The limit-and-nonclaim card

# %%
LIMIT_CARD = """
The bound, written out with every symbol defined:
My d, my n, my delta — the actual numbers:
Epsilon at those numbers, and the resulting bound on true error:
Vacuous or informative, with the comparison that decides it:
What the bound establishes about the capacity/sample trade-off:
What it does NOT establish about my model's error:
The instrument I would use instead for an error estimate, and what it requires:
"""
print(LIMIT_CARD)

# %%
claim("REVIEW VERDICT", LIMIT_CARD)

claim(
    "LOCAL REFERENCE RESULT",
    f"Instantiating the finite-class uniform-deviation bound at delta = {DELTA} "
    f"with a training error of {TRAINING_ERROR}, {len(vacuous)} of "
    f"{len(SETTINGS)} realistic settings give a bound of at least 1 and are "
    f"therefore vacuous: a 100-parameter float32 linear model on 1,000 examples "
    f"(epsilon {rows[(100, 1_000)]['epsilon']:.3f}, bound "
    f"{rows[(100, 1_000)]['bound']:.3f}) and a 1000-parameter model on 10,000 "
    f"(epsilon {rows[(1000, 10_000)]['epsilon']:.3f}, bound "
    f"{rows[(1000, 10_000)]['bound']:.3f}). The remaining "
    f"{len(SETTINGS) - len(vacuous)} are informative, from "
    f"{rows[(100, 5_000)]['bound']:.3f} at d=100/n=5,000 down to "
    f"{rows[(100, 1_000_000)]['bound']:.3f} at n = 1,000,000 — the same formula, "
    f"empty in one regime and tight in another. Reaching epsilon = 0.01 for a "
    f"1000-parameter model requires {requirements[1000][0.01]:,} examples.",
    support={"delta": DELTA, "trainingError": TRAINING_ERROR,
             "settings": {f"d={d},n={n}": row for (d, n), row in rows.items()},
             "vacuousSettings": [f"d={d},n={n}" for d, n in vacuous],
             "sampleRequirements": {str(d): row
                                    for d, row in requirements.items()}},
)

non_claim(
    "This evaluates one classical bound for finite hypothesis classes, treating a "
    "float32 parameter vector as a finite class by counting representable "
    "settings. That counting argument is a standard teaching device and is crude: "
    "it charges for parameter settings no optimizer would ever reach. Tighter "
    "analyses — margin-based, PAC-Bayes, compression, algorithmic stability — give "
    "much smaller numbers on the same models, so 'this bound is vacuous here' is "
    "not 'no bound is informative here'. Nothing was trained and no error was "
    "measured; the training error is a declared input. The result establishes the "
    "arithmetic of this bound at these sizes and the shape of the "
    "capacity/sample-size trade-off, and nothing about any real model's "
    "generalization."
)

emit()

# %% [markdown]
# ## 6. Transfer
#
# 1. The bound was true and empty. Write the check a reviewer should run before
#    quoting any bound, as one line of arithmetic.
# 2. At n = 1,000,000 the same formula became informative. Name what that shows
#    about the phrase "this bound is loose".
# 3. Bench `m25-s4` refused to support a calibration claim from perfect metrics.
#    State what a vacuous bound and an uncalibrated accuracy have in common.
#
# ---
#
# ## Attributions
#
# Module 36 is authoring-only and has no checked-in reference model. The bound, the
# finite-class counting argument, and the sample-requirement sweep are this bench's
# own, in plain Python floats.
