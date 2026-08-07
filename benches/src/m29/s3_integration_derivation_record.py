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
# # Bench m29-s3 — integration derivation record
#
# **Session 29.3 — Integration, the Fundamental Theorem, multiple integrals, and
# change of variables.** Rungs: **trace** (primary), map.
#
# A returned error *estimate* and a measured convergence *rate* are different
# objects. This bench halves the partition repeatedly in exact arithmetic and
# measures the rate directly, so the exponent is observed rather than quoted.
#
# **Requires:** Python 3.12+. Standard library only.

# %%
import sys
from fractions import Fraction
from pathlib import Path

_start = Path.cwd()
for _candidate in (_start, *list(_start.parents)[:4]):
    if (_candidate / "atlas_bench").is_dir():
        sys.path.insert(0, str(_candidate))
        _benches_root = _candidate
        break
else:  # pragma: no cover
    raise RuntimeError(f"atlas_bench not found from {_start}")

sys.path.insert(0, str(_benches_root.parent / "public" / "downloads"))

from atlas_bench import (  # noqa: E402
    bench, check, checkpoint, claim, emit, non_claim, predict, resolve, reveal,
)
from module29_reference import composite_trapezoid_quadratic_report  # noqa: E402

assert sys.version_info >= (3, 12)

bench(module=29, session=3, emits="integration derivation record",
      rungs=["trace", "map"])

# %% [markdown]
# ## 1. The integral, exactly
#
# $\int_0^1 x^2 \, dx = 1/3$ by the Fundamental Theorem. The trapezoid rule
# approximates it, and the reference computes both in exact rationals.

# %%
predict(
    "Doubling the number of trapezoid panels halves the step size. By what "
    "factor does the error shrink — 2 or 4?",
    answer="",  # <- fill in
    confidence="",  # sure / fairly sure / guessing
)

# %% [markdown]
# ## 2. Trace — halve the step, measure the error

# %%
PANELS = (1, 2, 4, 8, 16, 32)

print(f"{'panels':>7}  {'step':>8}  {'estimate':>14}  {'exact':>7}  {'error':>14}")
errors = []
for count in PANELS:
    report = composite_trapezoid_quadratic_report(1, 0, 0, 0, 1, count)
    errors.append(report.absolute_error)
    print(f"{count:>7}  {str(report.step):>8}  {str(report.trapezoid_estimate):>14}  "
          f"{str(report.exact_integral):>7}  {str(report.absolute_error):>14}")

ratios = [float(a / b) for a, b in zip(errors, errors[1:])]
print(f"\nerror ratios on halving the step: {[f'{r:.4f}' for r in ratios]}")

checkpoint("every ratio is exactly 4",
           all(a == b * 4 for a, b in zip(errors, errors[1:])),
           "exact rational arithmetic — not approximately 4")
checkpoint("so the error is second order in the step",
           all(abs(r - 4.0) < 1e-12 for r in ratios))

# %%
resolve(
    "Doubling the number of trapezoid panels halves the step size. By what "
    "factor does the error shrink — 2 or 4?",
    "matched",  # matched / diverged / partial
)

# %%
reveal(
    "Doubling the number of trapezoid panels halves the step size. By what "
    "factor does the error shrink — 2 or 4?",
    """
    Exactly 4 — and "exactly" is doing real work here, because the arithmetic is
    rational. The errors are 1/6, 1/24, 1/96, 1/384, 1/1536: each precisely a
    quarter of the one above it, with no rounding anywhere.

    The trapezoid rule is second order: its error scales as h². Halve h and the
    error falls by 2² = 4. A learner who answers "2" is reasoning from "half the
    step, half the error", which would be a first-order rule — the rule for a
    method that approximates with constants rather than with lines.

    The distinction the session cares about is between two things that get
    conflated:

    - an **error estimate** is a number the routine hands back for one run;
    - a **convergence rate** is an exponent you get by observing several runs.

    The exponent is a property of the method. The estimate is a property of one
    call. Only the exponent tells you what a finer grid will buy, and you cannot
    read it off a single result no matter how precise that result is.

    Note also what the reference refuses to claim. Its `limitation` says this is
    one quadratic on one finite interval, and that the exact error proves nothing
    about singular integrands, adaptive rules, or floating-point code. A rate
    measured on a smooth polynomial is the best case; near a singularity the
    exponent degrades, and the same method would show a different slope.
    """,
)

# %% [markdown]
# ## 3. Map — where does the second order come from?
#
# The trapezoid rule is exact for straight lines. Its error therefore depends on
# curvature — the second derivative — and vanishes when there is none.

# %%
print(f"{'integrand':>18}  {'panels':>7}  {'error':>10}")
for label, (a, b, c) in (("x^2 (curved)", (1, 0, 0)),
                         ("2x + 1 (linear)", (0, 2, 1)),
                         ("constant 5", (0, 0, 5))):
    for count in (1, 4):
        report = composite_trapezoid_quadratic_report(a, b, c, 0, 1, count)
        print(f"{label:>18}  {count:>7}  {str(report.absolute_error):>10}")

linear = composite_trapezoid_quadratic_report(0, 2, 1, 0, 1, 1)
checkpoint("the rule is exact on a straight line at one panel",
           linear.absolute_error == 0,
           "no curvature, no error — the error term is about the second derivative")

# %% [markdown]
# ## 4. The record

# %%
RECORD = """
The exact value, and the theorem that supplies it:
The measured convergence rate, and how many runs it took to measure:
Why that rate is a property of the method rather than of this integrand:
The integrand feature that would degrade it:
"""
print(RECORD)

# %%
claim("DERIVATION", RECORD)

claim(
    "THEOREM / PROOF",
    f"Composite trapezoid on x^2 over [0,1] gives exact errors "
    f"{[str(e) for e in errors]} for {list(PANELS)} panels — each exactly one "
    f"quarter of the previous, confirming second-order convergence.",
    support={"panels": list(PANELS), "errors": [str(e) for e in errors],
             "ratios": ratios, "exactIntegral": "1/3"},
)

claim(
    "FINITE EXPERIMENT",
    "The rule is exact at one panel on a linear integrand, so its error term "
    "depends on curvature rather than on interval length alone.",
    support={"linearError": str(linear.absolute_error)},
)

non_claim(
    "One quadratic on one finite interval. The reference says so: this exact "
    "error proves nothing about singular integrands, adaptive rules, or "
    "floating-point implementations. A measured rate on a smooth polynomial is "
    "the best case, and the exponent degrades near a singularity."
)

emit()

# %% [markdown]
# ## 5. Transfer
#
# 1. The ratio was exactly 4 in rational arithmetic. Session 2 measured a rate in
#    floating point and found it stopped holding. State what the difference
#    between those two experiments isolates.
# 2. The rule was exact on a line. Name the property of an integrand that
#    determines a quadrature rule's error, and say why it is not smoothness alone.
# 3. You measured an exponent from six runs. How many would you need to detect
#    that the exponent had degraded, and what would you look at?
#
# ---
#
# ## Attributions
#
# Probes `public/downloads/module29_reference.py` —
# `composite_trapezoid_quadratic_report` and its exact `absolute_error` /
# `exact_integral` fields. Not reimplemented. The halving sweep, the ratio
# measurement, and the curvature contrast are this bench's own.
