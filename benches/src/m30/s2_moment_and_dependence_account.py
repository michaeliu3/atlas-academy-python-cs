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
# # Bench m30-s2 — moment and dependence account
#
# **Session 30.2 — Expectation, variation, covariance, and information.** Rungs:
# **recognize** (primary), trace.
#
# The session's declared output states expectation, variation, and dependence —
# *and what each does not tell you about the other*. This bench builds the
# distribution where the gap is total: covariance exactly zero, dependence
# absolute.
#
# **Requires:** Python 3.12+. Standard library only.

# %%
from _fixture import JOINT, X_VALUES, Y_VALUES  # noqa: E402  (sets up sys.path)

import sys  # noqa: E402

from atlas_bench import (  # noqa: E402
    bench, check, checkpoint, claim, emit, non_claim, predict, resolve, reveal,
)
from module30_reference import joint_distribution_report  # noqa: E402

assert sys.version_info >= (3, 12)

bench(module=30, session=2, emits="moment and dependence account",
      rungs=["recognize", "trace"])

# %% [markdown]
# ## 1. The joint distribution
#
# X is uniform on {-1, 0, 1}. Y is X squared — so Y is determined completely by X.

# %%
print(f"{'':>6}  {'y=0':>8}  {'y=1':>8}")
for x, row in zip(X_VALUES, JOINT):
    print(f"x={x:>3}  {str(row[0]):>8}  {str(row[1]):>8}")

# %%
predict(
    "Y is a deterministic function of X — knowing X tells you Y exactly. What is "
    "the covariance between them?",
    answer="",  # <- fill in
    confidence="",  # sure / fairly sure / guessing
)

# %% [markdown]
# ## 2. Trace — ask the reference

# %%
report = joint_distribution_report(
    [list(row) for row in JOINT], list(X_VALUES), list(Y_VALUES), 0
)

print(f"E[X]                 : {report.expectation_x}")
print(f"E[Y]                 : {report.expectation_y}")
print(f"Cov(X, Y)            : {report.covariance}")
print(f"x marginal           : {tuple(str(v) for v in report.x_marginal)}")
print(f"y marginal           : {tuple(str(v) for v in report.y_marginal)}")
print(f"factors as independent: {report.factors_as_independent}")

checkpoint("the covariance is exactly zero", report.covariance == 0)
checkpoint("but the joint does NOT factor as independent",
           not report.factors_as_independent,
           "so zero covariance and independence are different properties")

# %% [markdown]
# ### Knowing X pins down Y

# %%
print(f"conditioning on y = {report.conditioned_y_value}")
print(f"  P(condition)      : {report.probability_of_condition}")
print(f"  X | Y=0 distribution: {tuple(str(v) for v in report.conditional_x_given_y)}")

conditional = report.conditional_x_given_y
degenerate = sum(1 for p in conditional if p != 0)
checkpoint("conditioning on Y collapses X to a single value",
           degenerate == 1,
           "if X and Y were independent this would equal the marginal")

# %%
resolve(
    "Y is a deterministic function of X — knowing X tells you Y exactly. What is "
    "the covariance between them?",
    "diverged",  # matched / diverged / partial
)

# %%
reveal(
    "Y is a deterministic function of X — knowing X tells you Y exactly. What is "
    "the covariance between them?",
    """
    Exactly zero.

    Covariance measures *linear* co-movement: E[XY] − E[X]E[Y]. Here X is
    symmetric about zero, so E[X] = 0, and E[XY] = E[X·X²] = E[X³], which is also
    zero by the same symmetry. Both terms vanish and the covariance is 0 — not
    approximately, exactly.

    Meanwhile Y is a function of X. Tell me X and I know Y with certainty. That
    is the strongest dependence two variables can have, and the covariance
    reports nothing.

    The reason is that the relationship is a parabola, and a parabola has no
    linear component when it is centred. Covariance is blind to it by
    construction, not by accident or by insufficient data.

    Two consequences worth carrying:

    - **"Uncorrelated" is not "independent."** The implication runs one way only:
      independence forces zero covariance, and zero covariance forces nothing.
      Here `factors_as_independent` is False while the covariance is 0, and the
      reference reports both because they are genuinely separate facts.
    - **A correlation of zero is a statement about a summary, not the joint
      distribution.** Conditioning on Y collapsed X onto a single value — the
      dependence is visible immediately in the conditional and invisible in the
      moment.

    This is why the session asks for expectation, variation, *and* dependence
    separately, and asks what each fails to tell you. A moment is a projection of
    the distribution, and projections lose things.
    """,
)

# %% [markdown]
# ## 3. Recognize — classify four statements

# %%
STATEMENTS = {
    "a": "Cov(X, Y) = 0 in this distribution.",
    "b": "X and Y are independent in this distribution.",
    "c": "If X and Y were independent, their covariance would be zero.",
    "d": "A correlation coefficient of 0 means the variables carry no information "
         "about each other.",
}
for key, text in STATEMENTS.items():
    print(f"{key}. {text}")


def is_true(key: str) -> bool:
    """True when this bench's evidence supports the statement."""
    raise NotImplementedError("Classify each statement")


# %%
check("is_true", is_true,
      [(("a",), True), (("b",), False), (("c",), True), (("d",), False)])
print()
print("(c) is the true direction of the implication and (d) is its false")
print("converse. This distribution is the counterexample to (d).")

# %% [markdown]
# ## 4. The account

# %%
ACCOUNT = """
E[X], E[Y], and Cov(X, Y):
What the covariance establishes:
What it does not establish, with this distribution as the witness:
The quantity that WOULD have detected the dependence:
"""
print(ACCOUNT)

# %%
claim("DEFINITION / MODEL", ACCOUNT)

claim(
    "COUNTEREXAMPLE",
    f"With X uniform on {X_VALUES} and Y = X squared, Cov(X, Y) = "
    f"{report.covariance} exactly while the joint does not factor as "
    f"independent; conditioning on Y collapses X to a single value.",
    support={"expectationX": str(report.expectation_x),
             "expectationY": str(report.expectation_y),
             "covariance": str(report.covariance),
             "factorsAsIndependent": report.factors_as_independent,
             "conditionalXGivenY": [str(v) for v in report.conditional_x_given_y]},
)

non_claim(
    "One three-point distribution refutes 'zero covariance implies "
    "independence' — a single counterexample is sufficient for that. It "
    "establishes nothing about how often the two coincide in practice, and "
    "nothing about which dependence measures would detect this case; mutual "
    "information would, but this bench did not compute it."
)

emit()

# %% [markdown]
# ## 5. Transfer
#
# 1. Covariance was blind because the relationship had no linear component.
#    Name one other summary statistic in this course that is blind by
#    construction rather than by insufficient data.
# 2. The implication runs one way. Write both directions out and mark which is a
#    theorem and which is a fallacy.
# 3. Session 5 corrects p-values for multiplicity. What does that correction
#    assume about dependence between the tests, and does this bench's
#    distribution satisfy it?
#
# ---
#
# ## Attributions
#
# Probes `public/downloads/module30_reference.py` — `joint_distribution_report`
# and its `covariance` / `factors_as_independent` / `conditional_x_given_y`
# fields, in exact rational arithmetic. Not reimplemented. The Y = X squared
# fixture and the statement classification are this bench's own.
