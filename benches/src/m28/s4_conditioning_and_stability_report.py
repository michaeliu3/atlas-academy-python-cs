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
# # Bench m28-s4 — conditioning and stability report
#
# **Session 28.4 — SVD, low-rank approximation, conditioning, and stable
# computation.** Rungs: **debug and defend** (primary), trace.
#
# The session's declared output separates a *problem's* conditioning from an
# *algorithm's* stability. Those are constantly conflated, and the conflation is
# usually diagnosed backwards: a wrong answer appears, the code gets blamed, and
# the code was fine.
#
# The reference solves both systems **exactly**, in rational arithmetic. There is
# no unstable step anywhere in it. So whatever amplification appears belongs to
# the problem, and the bench can prove it does.
#
# **Requires:** Python 3.12+. Standard library only.

# %%
from _fixture import (  # noqa: E402  (sets up sys.path)
    BASELINE_RHS, ILL_CONDITIONED, PERTURBED_RHS, WELL_CONDITIONED,
)

import sys  # noqa: E402
from fractions import Fraction  # noqa: E402

from atlas_bench import (  # noqa: E402
    bench, check, checkpoint, claim, emit, non_claim, predict, resolve, reveal,
)
from module28_reference import (  # noqa: E402
    condition_report_2x2, decimal_cancellation_demo, rhs_sensitivity_2x2,
)

assert sys.version_info >= (3, 12)

bench(module=28, session=4, emits="conditioning and stability report",
      rungs=["debug-and-defend", "trace"])

# %% [markdown]
# ## 1. Trace — a matrix that looks harmless

# %%
report = condition_report_2x2(ILL_CONDITIONED)
benign = condition_report_2x2(WELL_CONDITIONED)

print(f"matrix            : {ILL_CONDITIONED}")
print(f"determinant       : {report.determinant}  (exact, nonzero)")
print(f"singular values   : {report.singular_values[0]:.6f}, {report.singular_values[1]:.3e}")
print(f"condition number  : {report.condition_number_2:,.0f}")
print(f"singular?         : {report.is_singular}")
print()
print(f"identity matrix condition number: {benign.condition_number_2:.1f}")

checkpoint("the matrix is invertible", not report.is_singular)
checkpoint("yet its condition number is enormous",
           report.condition_number_2 > 10_000,
           f"{report.condition_number_2:,.0f} against 1.0 for the identity")

# %%
predict(
    "Perturbing the right-hand side by one part in ten million, with the system "
    "solved EXACTLY in rational arithmetic, changes the solution by roughly what "
    "relative amount — the same order, a thousand times more, or ten thousand "
    "times more?",
    answer="",  # <- fill in
    confidence="",  # sure / fairly sure / guessing
)

# %% [markdown]
# ## 2. Perturb the input, solve exactly

# %%
sensitivity = rhs_sensitivity_2x2(ILL_CONDITIONED, BASELINE_RHS, PERTURBED_RHS)

print(f"baseline rhs      : {BASELINE_RHS}   -> solution {sensitivity.baseline_solution}")
print(f"perturbed rhs     : {tuple(str(v) for v in PERTURBED_RHS)}")
print(f"                    -> solution {sensitivity.perturbed_solution}")
print()
print(f"relative rhs change     : {sensitivity.relative_rhs_change:.3e}")
print(f"relative solution change: {sensitivity.relative_solution_change:.3e}")
print(f"observed amplification  : {sensitivity.observed_amplification:,.0f}x")
print(f"condition-number bound  : {sensitivity.condition_bound:,.0f}")
print(f"bound respected         : {sensitivity.obeys_condition_bound}")

checkpoint("the amplification is four orders of magnitude",
           sensitivity.observed_amplification > 1_000)
checkpoint("and it stays under the condition-number bound",
           sensitivity.obeys_condition_bound,
           "the bound is tight, not merely true")

# %%
resolve(
    "Perturbing the right-hand side by one part in ten million, with the system "
    "solved EXACTLY in rational arithmetic, changes the solution by roughly what "
    "relative amount — the same order, a thousand times more, or ten thousand "
    "times more?",
    "diverged",  # matched / diverged / partial
)

# %%
reveal(
    "Perturbing the right-hand side by one part in ten million, with the system "
    "solved EXACTLY in rational arithmetic, changes the solution by roughly what "
    "relative amount — the same order, a thousand times more, or ten thousand "
    "times more?",
    """
    About twenty thousand times more — and there is no floating point anywhere
    in the calculation.

    That is the whole session in one number. Both solutions are exact rationals.
    No rounding occurred, no algorithm made a choice, nothing was truncated. The
    input moved by 3.5e-07 and the answer moved by 7.1e-03.

    The amplification is a property of the **problem**. The matrix maps a whole
    range of very different inputs onto nearly the same output — its smallest
    singular value is 5e-05 against a largest of 2.0 — so inverting it must map
    nearly-identical inputs back onto very different answers. The condition
    number, 40,002, is exactly the worst-case statement of that, and the observed
    amplification sits just under it.

    Why this matters for debugging: when a numerical result looks wrong, the
    reflex is to suspect the code. Here the code is provably innocent — it is
    exact. Rewriting the solver, switching libraries, or raising the precision
    would change nothing, because the sensitivity is in the question being asked.

    **Conditioning** is how much the true answer moves when the true input moves.
    **Stability** is how much extra error the algorithm adds on top. A stable
    algorithm on an ill-conditioned problem still gives you a bad answer, and it
    is not the algorithm's fault. Diagnosing which one you have is the first
    move, not the last.
    """,
)

# %% [markdown]
# ## 3. Now the other failure — an algorithm that loses information
#
# Cancellation is the stability side. The quantities are benign, the subtraction
# is exact in principle, and the *storage* destroys the answer.

# %%
cancellation = decimal_cancellation_demo(
    Fraction(1_000_000_001, 1000), 1_000_000, significant_digits=8
)

print(f"left  (exact)     : {float(cancellation.left):.4f}")
print(f"right (exact)     : {float(cancellation.right):.4f}")
print(f"stored at 8 digits: {float(cancellation.rounded_left)} and "
      f"{float(cancellation.rounded_right)}")
print()
print(f"exact difference  : {float(cancellation.exact_difference)}")
print(f"computed difference: {float(cancellation.rounded_difference)}")
print(f"absolute error    : {float(cancellation.absolute_error)}")

checkpoint("both operands round to the same stored value",
           cancellation.rounded_left == cancellation.rounded_right)
checkpoint("so the computed difference is exactly zero",
           cancellation.rounded_difference == 0,
           "every significant digit of the answer was destroyed")
checkpoint("while the true difference is nonzero",
           cancellation.exact_difference != 0,
           f"{float(cancellation.exact_difference)}")

# %% [markdown]
# ## 4. Debug and defend — which is which?
#
# Two failures, two different causes. Assign each correctly.

# %%
SYMPTOMS = {
    "a": "Solution moves 20,000x more than the input, computed in exact arithmetic.",
    "b": "A difference of 0.001 computes as exactly 0 at 8 significant digits.",
    "c": "Raising the working precision fixes the problem.",
    "d": "Rewriting the solver with a better algorithm fixes the problem.",
}
for key, text in SYMPTOMS.items():
    print(f"{key}. {text}")


def diagnosis(key: str) -> str:
    """One of: conditioning, stability, neither."""
    raise NotImplementedError("Diagnose each symptom")


# %%
check("diagnosis", diagnosis,
      [(("a",), "conditioning"), (("b",), "stability"),
       (("c",), "stability"), (("d",), "stability")])
print()
print("(a) is the trap: it is the largest error of the four and the only one no")
print("code change can repair.")

DEFENCE = """
The observation that rules out an unstable implementation in case (a):
Why raising precision would not help there:
What WOULD reduce the error, if anything:
"""
print(DEFENCE)

# %% [markdown]
# ## 5. The record

# %%
claim("DEFENDED REPAIR", DEFENCE)

claim(
    "FINITE EXPERIMENT",
    f"On an exactly-solved 2x2 system with condition number "
    f"{report.condition_number_2:,.0f}, a relative right-hand-side change of "
    f"{sensitivity.relative_rhs_change:.2e} produced a relative solution change "
    f"of {sensitivity.relative_solution_change:.2e} — an amplification of "
    f"{sensitivity.observed_amplification:,.0f}x, within the condition bound.",
    support={"conditionNumber": report.condition_number_2,
             "singularValues": list(report.singular_values),
             "relativeRhsChange": sensitivity.relative_rhs_change,
             "relativeSolutionChange": sensitivity.relative_solution_change,
             "amplification": sensitivity.observed_amplification,
             "bound": sensitivity.condition_bound},
)

claim(
    "FINITE EXPERIMENT",
    "Subtracting 1000000 from 1000000.001 at eight significant digits yields "
    "exactly 0 against a true difference of 0.001 — total loss of significance.",
    support={"exactDifference": float(cancellation.exact_difference),
             "computedDifference": float(cancellation.rounded_difference),
             "significantDigits": cancellation.significant_digits},
)

non_claim(
    "The cancellation model is a base-10 significant-digit rule in exact "
    "rationals, and says so: it is not an IEEE-754 emulator and predicts no "
    "specific hardware behaviour. The condition number is itself a "
    "floating-point estimate of the singular values. Neither result benchmarks a "
    "real solver or establishes what any library would do with this matrix."
)

emit()

# %% [markdown]
# ## 6. Transfer
#
# 1. Case (a) had no floating point at all. Write the one-sentence rule about
#    what a wrong numerical answer does *not* tell you about the code.
# 2. The condition number was 40,002 and the observed amplification 20,001 —
#    within a factor of two. Explain why the bound is worth stating even though
#    it was not attained.
# 3. Which of the two failures would a unit test comparing against a known
#    answer catch, and which would it miss?
#
# ---
#
# ## Attributions
#
# Probes `public/downloads/module28_reference.py` — `condition_report_2x2`,
# `rhs_sensitivity_2x2`, `decimal_cancellation_demo`, and their exact-rational
# arithmetic. Not reimplemented. The diagnosis exercise and the paired
# conditioning/stability contrast are this bench's own.
