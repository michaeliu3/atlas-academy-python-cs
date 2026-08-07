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
# # Bench m30-s5 — inference boundary report
#
# **Session 30.5 — Intervals, tests, multiplicity, and resampling.** Rungs:
# **review and verify** (primary), trace.
#
# The session's declared output states what an interval or test establishes, and
# what multiplicity does to that claim. This bench runs six comparisons, finds
# four "significant" results, and then watches every one of them disappear.
#
# **Requires:** Python 3.12+. Standard library only.

# %%
from _fixture import ALPHA, P_VALUES  # noqa: E402  (sets up sys.path)

import sys  # noqa: E402
from fractions import Fraction  # noqa: E402

from atlas_bench import (  # noqa: E402
    bench, check, checkpoint, claim, emit, non_claim, predict, resolve, reveal,
)
from module30_reference import multiple_testing_report  # noqa: E402

assert sys.version_info >= (3, 12)

bench(module=30, session=5, emits="inference boundary report",
      rungs=["review-and-verify", "trace"])

# %% [markdown]
# ## 1. Six comparisons, one threshold

# %%
print(f"alpha = {float(ALPHA)}")
print(f"{'comparison':>12}  {'p-value':>9}  {'p < alpha?':>11}")
for index, p in enumerate(P_VALUES):
    print(f"{index:>12}  {float(p):>9.2f}  {'yes' if p < ALPHA else 'no':>11}")

# %%
predict(
    "Four of six comparisons have p < 0.05. After correcting for having run six "
    "tests, how many survive — four, two, or none?",
    answer="",  # <- fill in
    confidence="",  # sure / fairly sure / guessing
)

# %% [markdown]
# ## 2. Trace — apply the corrections

# %%
report = multiple_testing_report(list(P_VALUES), ALPHA)

print(f"unadjusted rejections    : {report.unadjusted_rejections}")
print(f"Bonferroni threshold     : {float(report.bonferroni_threshold):.5f}")
print(f"Bonferroni rejections    : {report.bonferroni_rejections or '()  — none'}")
print(f"Benjamini-Hochberg       : {report.benjamini_hochberg_rejections or '()  — none'}")

checkpoint("four comparisons clear the raw threshold",
           len(report.unadjusted_rejections) == 4)
checkpoint("none survives Bonferroni",
           len(report.bonferroni_rejections) == 0,
           f"threshold drops from {float(ALPHA)} to "
           f"{float(report.bonferroni_threshold):.5f}")
checkpoint("none survives Benjamini-Hochberg either",
           len(report.benjamini_hochberg_rejections) == 0,
           "and BH is the more permissive of the two")

# %%
resolve(
    "Four of six comparisons have p < 0.05. After correcting for having run six "
    "tests, how many survive — four, two, or none?",
    "diverged",  # matched / diverged / partial
)

# %%
reveal(
    "Four of six comparisons have p < 0.05. After correcting for having run six "
    "tests, how many survive — four, two, or none?",
    """
    None. Not one of the four.

    Bonferroni divides the threshold by the number of comparisons: 0.05 / 6 =
    0.00833. The smallest p-value here is 0.01, which does not clear it. So every
    "significant" finding was significant only relative to a threshold that
    assumed one test had been run.

    Benjamini-Hochberg is the more permissive procedure — it controls the false
    *discovery* rate rather than the family-wise error rate, and usually rejects
    more. It also rejects nothing here. When the lenient correction and the
    strict one agree, the finding is not close.

    The uncomfortable part is that nothing about any individual comparison
    changed. Each p-value is exactly what it was. What changed is the *question*:
    "is this comparison surprising?" and "is the most surprising of six
    comparisons surprising?" are different questions, and the second one is the
    one you actually asked by running six.

    This is why the session's declared output is a *boundary* report. A p-value
    establishes something about one comparison under one hypothesis. It says
    nothing about a selection procedure applied over a family, and reporting the
    smallest of six as though it were the only one is the most common way that
    boundary gets crossed silently.

    The reference is careful about its own scope too: these are arithmetic
    threshold procedures, and its `limitation` field says the guarantees need
    their own family, dependence, and selection conditions. A correction applied
    to the wrong family is not a correction.
    """,
)

# %% [markdown]
# ## 3. Review and verify — audit four reports of this analysis

# %%
CLAIMS = {
    "a": "Comparison 0 is significant at the 0.05 level.",
    "b": "We found four significant effects out of six comparisons.",
    "c": "Bonferroni was too conservative here; Benjamini-Hochberg would have "
         "found something.",
    "d": "Running the four surviving comparisons again on new data would settle it.",
}
for key, text in CLAIMS.items():
    print(f"{key}. {text}")


def supported(key: str) -> bool:
    """True when this bench's evidence supports the claim as written."""
    raise NotImplementedError("Audit the four claims")


# %%
check("supported", supported,
      [(("a",), True), (("b",), False), (("c",), False), (("d",), True)])
print()
print("(a) is true and (b) is false, from the same six numbers — the difference")
print("is whether the sentence mentions that six comparisons were run.")

# %% [markdown]
# ## 4. Trace — how far does the threshold have to move?

# %%
print(f"{'family size':>12}  {'Bonferroni threshold':>21}  {'rejections':>11}")
for family_size in (1, 2, 3, 4, 6):
    subset = list(P_VALUES[:family_size])
    sub = multiple_testing_report(subset, ALPHA)
    print(f"{family_size:>12}  {float(sub.bonferroni_threshold):>21.5f}  "
          f"{len(sub.bonferroni_rejections):>11}")

print()
print("The same p-value is significant or not depending on how many other")
print("questions you asked. That is a fact about the procedure, not the data.")

# %% [markdown]
# ## 5. The boundary report

# %%
BOUNDARY = """
What comparison 0's p-value establishes, stated so it survives multiplicity:
What it does not establish:
The family I am correcting over, and why that is the right family:
What would make me revise this:
"""
print(BOUNDARY)

# %%
claim("REVIEW VERDICT", BOUNDARY)

claim(
    "FINITE EXPERIMENT",
    f"Of six comparisons, {len(report.unadjusted_rejections)} clear an "
    f"uncorrected threshold of {float(ALPHA)}; after correction for the family "
    f"of six, Bonferroni admits {len(report.bonferroni_rejections)} and "
    f"Benjamini-Hochberg admits {len(report.benjamini_hochberg_rejections)}.",
    support={"pValues": [str(p) for p in P_VALUES],
             "alpha": str(ALPHA),
             "unadjusted": list(report.unadjusted_rejections),
             "bonferroniThreshold": str(report.bonferroni_threshold),
             "bonferroni": list(report.bonferroni_rejections),
             "benjaminiHochberg": list(report.benjamini_hochberg_rejections)},
)

non_claim(
    "These are arithmetic threshold procedures over six declared p-values. They "
    "establish nothing about whether the p-values were computed correctly, "
    "whether the tests were independent, or whether the family of six is the "
    "right family — a correction applied to the wrong family is not a "
    "correction. The reference states the same limitation itself."
)

emit()

# %% [markdown]
# ## 6. Transfer
#
# 1. Claim (a) was true and claim (b) false from the same six numbers. Write the
#    rule about what a report must mention for a p-value to mean what it says.
# 2. The threshold moved with family size alone. Name the decision that quietly
#    sets the family size in a real analysis.
# 3. Which module's vocabulary would you use to describe "the procedure that
#    selected which result to report" as part of the system under test?
#
# ---
#
# ## Attributions
#
# Probes `public/downloads/module30_reference.py` — `multiple_testing_report`,
# its Bonferroni and Benjamini-Hochberg procedures in exact rational arithmetic,
# and its `limitation` field. Not reimplemented. The family-size sweep and the
# claim audit are this bench's own.
