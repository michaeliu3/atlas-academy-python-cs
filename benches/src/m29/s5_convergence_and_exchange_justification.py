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
# # Bench m29-s5 — convergence and exchange justification
#
# **Session 29.5 — Sequences, series, pointwise versus uniform convergence, and
# legal exchanges.** Rungs: **trace** (primary), recognize.
#
# "As n gets large the approximation becomes exact" is the sentence this session
# exists to break. It is true at every fixed point and false uniformly, and the
# reference computes both quantities exactly so the difference is a column of
# numbers rather than an argument.
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
from module29_reference import power_sequence_uniformity_report  # noqa: E402

assert sys.version_info >= (3, 12)

bench(module=29, session=5, emits="convergence and exchange justification",
      rungs=["trace", "recognize"])

# %% [markdown]
# ## 1. The sequence
#
# $f_n(x) = x^n$ on $[0, 1]$. At every fixed $x < 1$ the values fall to zero. At
# $x = 1$ they stay at one.

# %%
predict(
    "For every fixed x in [0,1), x^n falls to 0. Does the WORST error over the "
    "whole interval also fall to 0 as n grows?",
    answer="",  # <- fill in
    confidence="",  # sure / fairly sure / guessing
)

# %% [markdown]
# ## 2. Trace — pointwise error against supremum error

# %%
POINT = Fraction(9, 10)
# The reference bounds its index at 2..64 and refuses outside that, so the sweep
# stays inside its declared domain rather than asking it to extrapolate.
INDICES = (2, 4, 8, 16, 32, 64)

print(f"tracking the fixed point x = {POINT}")
print(f"{'n':>4}  {'|f_n(x) - 0| at x=0.9':>22}  {'sup error on [0,1]':>19}  {'witness x':>12}")
pointwise, suprema = [], []
for n in INDICES:
    report = power_sequence_uniformity_report(n, POINT)
    pointwise.append(float(report.pointwise_error))
    suprema.append(float(report.supremum_error_on_unit_interval))
    print(f"{n:>4}  {float(report.pointwise_error):>22.6f}  "
          f"{float(report.supremum_error_on_unit_interval):>19.6f}  "
          f"{float(report.near_endpoint_witness):>12.4f}")

last = power_sequence_uniformity_report(INDICES[-1], POINT)

checkpoint("the pointwise error falls toward zero",
           pointwise[-1] < pointwise[0] / 100)
checkpoint("the supremum error does not move at all",
           all(value == 1.0 for value in suprema),
           "it is exactly 1 for every n")
checkpoint("the reference reports non-uniform convergence",
           not last.converges_uniformly_on_unit_interval)
checkpoint("and the supremum is never attained",
           not last.supremum_is_attained,
           "there is no worst point — only a worse one, nearer to 1")

# %%
resolve(
    "For every fixed x in [0,1), x^n falls to 0. Does the WORST error over the "
    "whole interval also fall to 0 as n grows?",
    "diverged",  # matched / diverged / partial
)

# %%
reveal(
    "For every fixed x in [0,1), x^n falls to 0. Does the WORST error over the "
    "whole interval also fall to 0 as n grows?",
    """
    No. The supremum error is exactly 1 for every n, forever.

    Both facts are true at once, and they are different statements:

    - **Pointwise:** fix x, then let n grow. For any x < 1, x^n falls to 0. Every
      row of the middle column shows this.
    - **Uniform:** let n grow, then ask for the worst x. However large n is, there
      is a point close enough to 1 that x^n is still near 1. The witness column
      shows that point sliding toward 1 as n grows — 0.75, then 0.99, then
      0.9996 — always staying ahead.

    The order of the quantifiers is the whole difference. Pointwise convergence
    picks x first and lets n respond. Uniform convergence demands one n that works
    for every x simultaneously, and no such n exists here.

    Notice also that the supremum is never *attained*: `supremum_is_attained` is
    False. There is no worst point, only an unbounded supply of worse ones. That
    is why the limit function is discontinuous at 1 while every f_n is continuous
    — continuity survives uniform limits and does not survive pointwise ones.

    This is what makes an "exchange" illegal. Swapping a limit with an integral,
    a derivative, or another limit is a theorem *conditional on uniformity*. Here
    the condition fails, so the exchange is not merely unproven — it can give the
    wrong answer, and the discontinuity at x=1 is where it does.
    """,
)

# %% [markdown]
# ## 3. Watch the witness chase the endpoint

# %%
print(f"{'n':>5}  {'witness x':>14}  {'error there':>14}")
for n in (2, 10, 40, 64):
    report = power_sequence_uniformity_report(n, POINT)
    print(f"{n:>5}  {float(report.near_endpoint_witness):>14.8f}  "
          f"{float(report.near_endpoint_witness_error):>14.8f}")
print()
print("Each row is a point where f_n is still far from its limit. Increasing n")
print("does not remove such points; it only moves them closer to 1.")

# %% [markdown]
# ## 4. Recognize — which exchanges are justified?

# %%
STATEMENTS = {
    "a": "For each fixed x in [0,1), lim f_n(x) = 0.",
    "b": "f_n converges uniformly to 0 on [0,1].",
    "c": "The limit of f_n is continuous on [0,1].",
    "d": "Uniform convergence would have justified exchanging the limit and the "
         "integral.",
}
for key, text in STATEMENTS.items():
    print(f"{key}. {text}")


def is_true(key: str) -> bool:
    """True when this bench's evidence supports the statement."""
    raise NotImplementedError("Classify each statement")


# %%
check("is_true", is_true,
      [(("a",), True), (("b",), False), (("c",), False), (("d",), True)])
print()
print("(a) and (b) differ only in quantifier order, and one is true.")

# %% [markdown]
# ## 5. The justification

# %%
JUSTIFICATION = """
The convergence that holds, with its quantifiers in order:
The convergence that fails, and the witness that shows it:
The exchange I want to perform:
Whether it is legal here, and what would make it legal:
"""
print(JUSTIFICATION)

# %%
claim("DERIVATION", JUSTIFICATION)

claim(
    "THEOREM / PROOF",
    f"For f_n(x) = x^n on [0,1], the pointwise error at x={POINT} falls from "
    f"{pointwise[0]:.4f} to {pointwise[-1]:.2e} across n = {INDICES[0]}..{INDICES[-1]}, "
    f"while the supremum error stays exactly 1 at every n and is never attained.",
    support={"indices": list(INDICES), "point": str(POINT),
             "pointwiseErrors": pointwise, "supremumErrors": suprema,
             "convergesUniformly": last.converges_uniformly_on_unit_interval,
             "supremumAttained": last.supremum_is_attained},
)

non_claim(
    "This is an analytic fact about one named family, x^n on [0,1], obtained from "
    "its supremum rather than from a finite grid — the reference is explicit that "
    "it is not inferred by sampling. It says nothing about unrelated function "
    "sequences, and a different family can converge uniformly while looking "
    "similar pointwise."
)

emit()

# %% [markdown]
# ## 6. Transfer
#
# 1. Statements (a) and (b) differ only in quantifier order. Write both with the
#    quantifiers explicit and mark where they diverge.
# 2. The supremum was never attained. Explain why "take the maximum error" is not
#    a well-defined instruction here.
# 3. Session 2 found an error curve that fell and then rose. Is that a failure of
#    pointwise convergence, of uniform convergence, or of neither?
#
# ---
#
# ## Attributions
#
# Probes `public/downloads/module29_reference.py` —
# `power_sequence_uniformity_report` and its `supremum_error_on_unit_interval`,
# `near_endpoint_witness`, and `supremum_is_attained` fields, in exact rational
# arithmetic. Not reimplemented. The witness sweep and the statement
# classification are this bench's own.
