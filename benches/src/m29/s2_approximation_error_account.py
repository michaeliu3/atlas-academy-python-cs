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
# # Bench m29-s2 — approximation error account
#
# **Session 29.2 — Derivatives, mean value, Taylor approximation, and finite
# differences.** Rungs: **debug and defend** (primary), trace.
#
# The session's declared output is an account stating an approximation *together
# with its error term and valid range*. The workbook can state the truncation
# bound. It cannot show you that the bound stops predicting reality below a
# certain step size — because the effect that takes over does not exist in
# mathematics, only in floating point.
#
# `module29_reference.py` computes in **exact rational arithmetic**
# (`Exact = Fraction`). That makes it an oracle rather than a competitor: it
# gives the truncation error with no roundoff at all, so anything the float
# computation does differently is roundoff, isolated.
#
# **Requires:** Python 3.12+, matplotlib. Standard library otherwise.

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

# Import and probe the checked-in reference model; never reimplement it.
sys.path.insert(0, str(_benches_root.parent / "public" / "downloads"))

from atlas_bench import (  # noqa: E402
    bench, check, checkpoint, claim, emit, non_claim, predict, resolve, reveal,
)
from module29_reference import quadratic_finite_difference_report  # noqa: E402

assert sys.version_info >= (3, 12)

bench(
    module=29,
    session=2,
    emits="approximation error account",
    rungs=["debug-and-defend", "trace"],
)

# %% [markdown]
# ## 1. What the exact oracle says
#
# For $f(x) = x^2$ at $x = 2$, the derivative is $4$. The forward difference
# $\frac{f(x+h) - f(x)}{h}$ has truncation error exactly $h$; the centered
# difference $\frac{f(x+h) - f(x-h)}{2h}$ is **exact for a quadratic** — its
# truncation error is identically zero at every step.
#
# Confirm both from the reference before touching floats.

# %%
STEPS = [Fraction(1, 10 ** k) for k in range(1, 17)]

print(f"{'h':>8}  {'forward err (exact)':>21}  {'centered err (exact)':>22}")
exact_forward, exact_centered = [], []
for k, h in zip(range(1, 17), STEPS):
    report = quadratic_finite_difference_report(1, 0, 0, 2, h)
    exact_forward.append(float(report.forward_signed_error))
    exact_centered.append(float(report.centered_signed_error))
    if k in (1, 4, 8, 12, 16):
        print(f"1e-{k:<6}  {float(report.forward_signed_error):>21.3e}  "
              f"{float(report.centered_signed_error):>22.3e}")

checkpoint(
    "exact forward error falls monotonically with h",
    all(a > b for a, b in zip(exact_forward, exact_forward[1:])),
)
checkpoint(
    "exact centered error is identically zero for a quadratic",
    all(err == 0.0 for err in exact_centered),
    "so any nonzero float centered error below is pure roundoff",
)

# %% [markdown]
# ## 2. Prediction
#
# Now the same two formulas in ordinary `float`.

# %%
predict(
    "In float arithmetic, as h shrinks from 1e-1 to 1e-16, does the forward "
    "difference error keep falling, level off, or rise again?",
    answer="",  # <- fill in
    confidence="",  # sure / fairly sure / guessing
)

# %% [markdown]
# ## 3. Trace — the same computation in floating point


# %%
def f(x: float) -> float:
    return x * x


def forward_difference(x: float, h: float) -> float:
    return (f(x + h) - f(x)) / h


def centered_difference(x: float, h: float) -> float:
    return (f(x + h) - f(x - h)) / (2 * h)


TRUE_DERIVATIVE = 4.0
float_forward, float_centered = [], []

print(f"{'h':>8}  {'forward err':>12}  {'centered err':>13}  {'exact says':>11}")
for k in range(1, 17):
    h = 10.0 ** -k
    fwd = abs(forward_difference(2.0, h) - TRUE_DERIVATIVE)
    ctr = abs(centered_difference(2.0, h) - TRUE_DERIVATIVE)
    float_forward.append(fwd)
    float_centered.append(ctr)
    print(f"1e-{k:<6}  {fwd:>12.3e}  {ctr:>13.3e}  {exact_forward[k - 1]:>11.3e}")

best = min(range(len(float_forward)), key=lambda i: float_forward[i])
print(f"\nforward error is smallest at h = 1e-{best + 1}, not at the smallest h")

# %%
resolve(
    "In float arithmetic, as h shrinks from 1e-1 to 1e-16, does the forward "
    "difference error keep falling, level off, or rise again?",
    "diverged",  # matched / diverged / partial
)

# %% [markdown]
# ### Plot it

# %%
import matplotlib.pyplot as plt  # noqa: E402

steps = [10.0 ** -k for k in range(1, 17)]
fig, ax = plt.subplots(figsize=(7, 4.5))
ax.plot(steps, float_forward, "o-", label="forward (float)")
ax.plot(steps, [e if e > 0 else 1e-20 for e in exact_forward], "--",
        label="forward (exact oracle)")
ax.plot(steps, [c if c > 0 else 1e-20 for c in float_centered], "s-",
        label="centered (float)")
ax.axvline(2.2e-8, ls=":", color="grey")
ax.text(2.6e-8, max(float_forward) * 0.2, r" $\sqrt{\epsilon}$", fontsize=9)
ax.set(xscale="log", yscale="log", xlabel="step h", ylabel="absolute error",
       title="Truncation falls, roundoff rises")
ax.invert_xaxis()
ax.legend()
ax.grid(True, which="both", alpha=0.3)
plt.tight_layout()
plt.show()

# %%
reveal(
    "In float arithmetic, as h shrinks from 1e-1 to 1e-16, does the forward "
    "difference error keep falling, level off, or rise again?",
    """
    It falls, bottoms out around h ≈ 1e-8, then RISES — and by h = 1e-16 it is
    worse than it was at h = 1e-1.

    Two errors are in play and they move in opposite directions.

    **Truncation error** is the mathematics: the forward difference approximates
    the derivative to within O(h), so this term falls linearly with h. The exact
    oracle shows it alone, and it falls monotonically all the way down — no
    bottom, no rise.

    **Roundoff error** is the arithmetic. `f(x+h) - f(x)` subtracts two nearly
    equal floats. Their difference has far fewer significant digits than either
    operand — catastrophic cancellation — and then you divide that damaged
    quantity by a tiny h, which amplifies the damage by 1/h. This term *grows*
    as h shrinks, roughly as ε/h.

    Total error is about h + ε/h, minimised where the two are equal: at
    h ≈ √ε ≈ 1.5e-8. That is the dotted line, and it is where the measured
    minimum lands.

    The centered difference makes the point unarguable. Its truncation error is
    *identically zero* for a quadratic — the exact oracle confirms 0 at every
    step. So every nonzero number in the float centered column is roundoff and
    nothing else. There is no approximation being made, and the answer is still
    wrong.

    The engineering consequence: "use a smaller step for more accuracy" is false
    below √ε, and no amount of mathematical care fixes it, because the error is
    not mathematical. This is why the session's declared output demands an error
    term *and a valid range* — a bound without a range is a claim about a
    computation nobody performs.
    """,
)

# %% [markdown]
# ## 4. Debug and defend — pick a step and justify it
#
# A repair without a defence is a guess that happened to work.


# %%
def recommended_step() -> float:
    """Return the step you would use for a forward difference in float64.

    Justify it in DEFENCE below. The acceptance test is not "smallest error on
    this function" — it is that your reasoning survives a different f.
    """
    raise NotImplementedError("Choose a step and defend it")


# %%
check(
    "recommended_step is in the sane band, not merely small",
    lambda: 1e-10 < recommended_step() < 1e-5,
    [((), True)],
)

DEFENCE = """
The step I chose, and the quantity it balances:
Why a smaller step is worse rather than better:
What would change this answer for a different f or a different precision:
"""
print(DEFENCE)

# %% [markdown]
# ## 5. Transfer check — does the rule survive a different function?
#
# The bench so far used a quadratic, where the centered difference is exact.
# Repeat the sweep on `sin` via the reference's Taylor machinery is Session 2's
# other half; here just confirm the U-curve is not an artefact of `x**2`.

# %%
import math  # noqa: E402

sin_errors = []
for k in range(1, 17):
    h = 10.0 ** -k
    estimate = (math.sin(1.0 + h) - math.sin(1.0)) / h
    sin_errors.append(abs(estimate - math.cos(1.0)))

sin_best = min(range(len(sin_errors)), key=lambda i: sin_errors[i])
print(f"sin: error smallest at h = 1e-{sin_best + 1}  (quadratic: 1e-{best + 1})")
checkpoint(
    "the minimum is near sqrt(machine epsilon) for both functions",
    5 <= sin_best + 1 <= 10 and 5 <= best + 1 <= 10,
    "so the U-curve is a property of float subtraction, not of x**2",
)

# %% [markdown]
# ## 6. The record

# %%
claim("DEFENDED REPAIR", DEFENCE)

claim(
    "THEOREM / PROOF",
    "In exact rational arithmetic the forward-difference error for x**2 at x=2 "
    "equals h exactly and falls monotonically; the centered-difference error is "
    "identically zero at every step.",
    support={"steps": [f"1e-{k}" for k in range(1, 17)],
             "exactForward": exact_forward, "exactCentered": exact_centered},
)

claim(
    "FINITE EXPERIMENT",
    f"In float64 the same forward difference reaches its minimum error at "
    f"h=1e-{best + 1} and is worse at 1e-16 than at 1e-1; the centered "
    f"difference, whose truncation error is provably zero, is also nonzero — "
    f"that residue is entirely roundoff.",
    support={"floatForward": float_forward, "floatCentered": float_centered,
             "minimumAtStep": f"1e-{best + 1}", "sinMinimumAtStep": f"1e-{sin_best + 1}"},
)

non_claim(
    "Sixteen steps on two functions at one precision do not establish that the "
    "optimum is at sqrt(epsilon) in general. The balance point depends on the "
    "magnitude of f and of its second derivative, and on the precision — in "
    "float32 it sits several decades higher. What is established is that the "
    "error stops being described by the truncation bound, not where every "
    "function's optimum lies."
)

emit()

# %% [markdown]
# ## 7. Transfer
#
# 1. The centered difference had zero truncation error and a nonzero answer.
#    State in one sentence what that proves about the relationship between a
#    mathematical bound and a computed result.
# 2. Session 5 is about pointwise versus uniform convergence. Which of the two
#    errors here — truncation or roundoff — behaves like a pointwise limit, and
#    which does not converge at all?
# 3. You defended a step size. Name the observation that would make you change
#    it, and say why "the error got smaller on my test function" is not that
#    observation.
#
# ---
#
# ## Attributions
#
# Probes the checked-in reference model
# `public/downloads/module29_reference.py` — `quadratic_finite_difference_report`
# and its exact-rational `Exact = Fraction` arithmetic — as the truncation
# oracle. The reference model is not reimplemented here. The float sweep, the
# roundoff isolation, and the sin cross-check are this bench's own.
