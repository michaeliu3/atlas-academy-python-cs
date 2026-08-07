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
# # Bench m32-s5 — Autodiff-Execution Trace
#
# **Session 32.5 — Read autodiff as a program with a numerical contract.** Rungs:
# **trace** (primary), debug and defend.
#
# Automatic differentiation is not symbolic differentiation and it is not finite
# differences. It is a **program transformation**: it runs the same operations,
# carrying derivative values alongside, and the result is exact to floating-point
# rounding rather than approximate.
#
# The contract that comes with it is the interesting part, and this bench probes
# where it holds — and where a gradient check passes on a wrong gradient.
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

bench(module=32, session=5, emits="Autodiff-Execution Trace",
      rungs=["trace", "debug-and-defend"])

# %% [markdown]
# ## 1. Forward-mode autodiff in twenty lines
#
# A dual number carries a value and a derivative. Every operation is overloaded to
# propagate both, so running the function *is* differentiating it.

# %%
class Dual:
    __slots__ = ("value", "derivative")

    def __init__(self, value: float, derivative: float = 0.0) -> None:
        self.value = value
        self.derivative = derivative

    def __add__(self, other):
        other = other if isinstance(other, Dual) else Dual(other)
        return Dual(self.value + other.value,
                    self.derivative + other.derivative)

    __radd__ = __add__

    def __mul__(self, other):
        other = other if isinstance(other, Dual) else Dual(other)
        return Dual(self.value * other.value,
                    self.derivative * other.value + self.value * other.derivative)

    __rmul__ = __mul__

    def __sub__(self, other):
        other = other if isinstance(other, Dual) else Dual(other)
        return Dual(self.value - other.value,
                    self.derivative - other.derivative)

    def sin(self):
        return Dual(math.sin(self.value), math.cos(self.value) * self.derivative)

    def exp(self):
        e = math.exp(self.value)
        return Dual(e, e * self.derivative)


def f(x):
    """f(x) = x*sin(x) + exp(2x). Works on floats and on Duals unchanged."""
    sin_x = x.sin() if isinstance(x, Dual) else math.sin(x)
    exp_2x = (2 * x).exp() if isinstance(x, Dual) else math.exp(2 * x)
    return x * sin_x + exp_2x


def exact_derivative(x: float) -> float:
    return math.sin(x) + x * math.cos(x) + 2 * math.exp(2 * x)


POINT = 0.7
autodiff = f(Dual(POINT, 1.0)).derivative
exact = exact_derivative(POINT)

print(f"f(x) = x*sin(x) + exp(2x)   at x = {POINT}")
print(f"  value                : {f(Dual(POINT, 1.0)).value:.12f}")
print(f"  forward-mode autodiff: {autodiff:.12f}")
print(f"  hand-derived exact   : {exact:.12f}")
print(f"  difference           : {abs(autodiff - exact):.3e}")

checkpoint("autodiff matches the hand-derived derivative to rounding",
           abs(autodiff - exact) < 1e-12,
           f"{abs(autodiff - exact):.2e} — not an approximation with a step size")
checkpoint("the same function ran unchanged on Duals",
           abs(f(POINT) - f(Dual(POINT, 1.0)).value) < 1e-12,
           "no separate derivative code was written; the operators carry it")

# %%
predict(
    "A finite-difference gradient check compares against this exact derivative. "
    "Sweep the step size h from 1e-1 down to 1e-14. Does the agreement improve "
    "the whole way?",
    answer="",  # <- fill in
    confidence="",  # sure / fairly sure / guessing
)

# %% [markdown]
# ## 2. Trace — the gradient check's own error curve

# %%
print(f"{'h':>9}  {'forward difference':>19}  {'error':>12}  "
      f"{'central difference':>19}  {'error':>12}")
sweep = {}
for exponent in range(1, 15):
    h = 10.0 ** -exponent
    forward = (f(POINT + h) - f(POINT)) / h
    central = (f(POINT + h) - f(POINT - h)) / (2 * h)
    sweep[h] = {"forward": forward, "forwardError": abs(forward - exact),
                "central": central, "centralError": abs(central - exact)}
    print(f"{h:>9.0e}  {forward:>19.9f}  {abs(forward - exact):>12.3e}  "
          f"{central:>19.9f}  {abs(central - exact):>12.3e}")

best_forward = min(sweep, key=lambda h: sweep[h]["forwardError"])
best_central = min(sweep, key=lambda h: sweep[h]["centralError"])
smallest = min(sweep)

print(f"\nbest forward-difference step : {best_forward:.0e} "
      f"(error {sweep[best_forward]['forwardError']:.2e})")
print(f"best central-difference step : {best_central:.0e} "
      f"(error {sweep[best_central]['centralError']:.2e})")
print(f"error at the smallest step   : "
      f"{sweep[smallest]['forwardError']:.2e} forward")
print(f"autodiff error               : {abs(autodiff - exact):.2e}")

checkpoint("the finite-difference error does not fall monotonically",
           sweep[smallest]["forwardError"] > sweep[best_forward]["forwardError"],
           "shrinking h past the optimum makes the estimate worse")
checkpoint("there is an interior optimum",
           best_forward not in (max(sweep), min(sweep)),
           f"h = {best_forward:.0e} — truncation error falls with h, "
           f"cancellation error rises")
checkpoint("central differences do better, and still have an optimum",
           sweep[best_central]["centralError"]
           < sweep[best_forward]["forwardError"]
           and best_central not in (max(sweep), min(sweep)))
checkpoint("autodiff beats every finite-difference step",
           abs(autodiff - exact) < sweep[best_central]["centralError"],
           "no step size to tune, and no truncation term at all")

# %%
resolve(
    "A finite-difference gradient check compares against this exact derivative. "
    "Sweep the step size h from 1e-1 down to 1e-14. Does the agreement improve "
    "the whole way?",
    "matched",  # matched / diverged / partial
)

# %%
reveal(
    "A finite-difference gradient check compares against this exact derivative. "
    "Sweep the step size h from 1e-1 down to 1e-14. Does the agreement improve "
    "the whole way?",
    """
    No. The error falls, reaches a minimum around `h ≈ 1e-8`, and then **rises**
    again — by the smallest steps it is worse than it was at `1e-4`.

    Two errors are in competition and they move in opposite directions.
    **Truncation** is the mathematical error of approximating a limit by a finite
    step, and it shrinks as `h` shrinks. **Cancellation** is a floating-point
    error: `f(x + h) - f(x)` subtracts two nearly equal numbers, and the smaller
    `h` gets, the more of the significant digits cancel, leaving the difference
    dominated by rounding. Dividing that by a tiny `h` amplifies it.

    Their sum has an interior minimum, around the square root of machine epsilon
    for forward differences — which is where the sweep lands. Central differences
    do better because their truncation term is second order rather than first, so
    the balance shifts, but the U-shape is the same and there is still a step size
    to get wrong.

    Autodiff has neither term. It is not approximating a limit; it is applying the
    chain rule to the operations the program actually performs. Its only error is
    the ordinary floating-point rounding of those operations, which is why the
    difference from the hand-derived value here is at the 1e-16 level and there is
    no `h` to tune.

    Now the part that matters for reviewing a gradient check, and it is why this
    sits in a session about **contracts**. A gradient check compares two things and
    reports agreement. If it disagrees, one of them is wrong and you do not know
    which — and the finite-difference side has a tunable knob that changes its
    answer. That is a bad position to be in, because the natural response to a
    failing check is to adjust the tolerance or the step until it passes.

    Worse, section 3 shows the check *passing* on a gradient that is wrong. If the
    error is small relative to the tolerance, or lies in a direction the check does
    not probe, agreement is not evidence of correctness — it is evidence that two
    things agree to within a number you chose.

    That is the same structure as bench `m12-s4`'s `isinstance` against a Protocol,
    and bench `m13-s2`'s mutation survivors: a check that answers a narrower
    question than the confidence people take from it. The repair is the same too —
    state what the check establishes, which here is "these two estimates agree at
    this point, to this tolerance, at this step size", and not "the gradient is
    correct".
    """,
)

# %% [markdown]
# ## 3. Debug — a gradient check that passes on a wrong gradient

# %%
def wrong_derivative(x: float) -> float:
    """Correct except for a term that is tiny near this point."""
    return exact_derivative(x) + 1e-7 * math.cos(50 * x)


TOLERANCES = (1e-3, 1e-5, 1e-7, 1e-9)
CHECK_STEP = 1e-6

central_estimate = (f(POINT + CHECK_STEP) - f(POINT - CHECK_STEP)) / (2 * CHECK_STEP)
check_error = abs(wrong_derivative(POINT) - central_estimate)
true_error = abs(wrong_derivative(POINT) - exact)

print(f"the wrong gradient differs from the truth by {true_error:.3e}")
print(f"the finite-difference estimate at h={CHECK_STEP:.0e} differs from it by "
      f"{check_error:.3e}\n")

print(f"{'tolerance':>11}  {'check passes?':>14}  {'gradient correct?':>18}")
verdicts = {}
for tolerance in TOLERANCES:
    passes = check_error < tolerance
    verdicts[tolerance] = passes
    print(f"{tolerance:>11.0e}  {str(passes):>14}  {'no':>18}")

misleading = [t for t, passed in verdicts.items() if passed]

print(f"\ntolerances at which a wrong gradient passes: "
      f"{[f'{t:.0e}' for t in misleading]}")

checkpoint("the gradient is genuinely wrong", true_error > 0)
checkpoint("and the check passes at loose tolerances",
           len(misleading) > 0,
           f"{[f'{t:.0e}' for t in misleading]} — the defect is smaller than the "
           f"tolerance, so agreement says nothing about it")
checkpoint("a tight enough tolerance would catch it",
           not all(verdicts.values()),
           "but choosing that tolerance requires knowing how large the defect is")
checkpoint("autodiff would have had no such defect to hide",
           abs(autodiff - exact) < true_error,
           f"its error is {abs(autodiff - exact):.2e}, below the defect being "
           f"missed — the transformation cannot introduce a wrong term")

# %% [markdown]
# ## 4. Recognize — what does a passing gradient check establish?

# %%
CLAIMS = {
    "a": "The two estimates agree at this point, to this tolerance.",
    "b": "The analytic gradient is correct at this point.",
    "c": "The analytic gradient is correct everywhere.",
    "d": "The finite-difference estimate is accurate.",
}
for key, text in CLAIMS.items():
    print(f"{key}. {text}")


def established_by_a_passing_check(key: str) -> bool:
    """True when a passing gradient check establishes this."""
    raise NotImplementedError("State what agreement between two estimates buys")


# %%
check("established_by_a_passing_check", established_by_a_passing_check,
      [(("a",), True), (("b",), False), (("c",), False), (("d",), False)])
print()
print("(a) is the whole of it, and every qualifier in that sentence is doing")
print("work. (d) is the one people forget: the check has TWO sides, and the")
print("finite-difference side has its own error curve with a step size you chose.")
print("Agreement is symmetric — it does not say which side was right.")

# %% [markdown]
# ## 5. The autodiff execution trace

# %%
AUTODIFF_TRACE = """
The function, and the operations autodiff actually transformed:
The derivative it produced, against a hand-derived value:
The finite-difference sweep, with the step size that minimised error:
Why smaller steps stopped helping:
The tolerance my gradient check uses, and how I chose it:
What a passing check establishes, with every qualifier stated:
The defect size my check could not have detected:
"""
print(AUTODIFF_TRACE)

# %%
claim("COURSE MODEL", AUTODIFF_TRACE)

claim(
    "LOCAL REFERENCE RESULT",
    f"Forward-mode autodiff on f(x) = x·sin(x) + exp(2x) at x = {POINT} returns "
    f"{autodiff:.12f} against a hand-derived {exact:.12f}, differing by "
    f"{abs(autodiff - exact):.2e}. A finite-difference sweep over 14 step sizes "
    f"has an interior optimum: forward differences are best at h = "
    f"{best_forward:.0e} with error {sweep[best_forward]['forwardError']:.2e}, "
    f"and at h = {smallest:.0e} the error has risen to "
    f"{sweep[smallest]['forwardError']:.2e}. A deliberately wrong gradient "
    f"differing from the truth by {true_error:.2e} passes a central-difference "
    f"check at {len(misleading)} of {len(TOLERANCES)} tolerances.",
    support={"point": POINT, "autodiff": autodiff, "exact": exact,
             "autodiffError": abs(autodiff - exact),
             "sweep": {f"{h:.0e}": v for h, v in sweep.items()},
             "bestForwardStep": best_forward, "bestCentralStep": best_central,
             "wrongGradientError": true_error,
             "checkStep": CHECK_STEP, "checkError": check_error,
             "verdicts": {f"{t:.0e}": p for t, p in verdicts.items()}},
)

non_claim(
    "This is forward-mode autodiff over a five-operation scalar function, "
    "implemented in twenty lines of operator overloading. It establishes that the "
    "transformation is exact to rounding here and that finite differences have an "
    "interior optimal step — both standard results, measured rather than quoted. "
    "It says nothing about reverse mode, which is what real training uses and has "
    "a completely different cost structure: forward mode costs one pass per INPUT "
    "and reverse mode one per output, which is why a million-parameter model is "
    "differentiated in reverse. It does not exercise control flow, where autodiff "
    "differentiates the branch actually taken and not the function; nor "
    "non-differentiable points, where it returns a subgradient or a one-sided "
    "value without saying so. It measures no memory, which is reverse mode's real "
    "cost."
)

emit()

# %% [markdown]
# ## 6. Transfer
#
# 1. The gradient-check error had an interior minimum. Write what that implies
#    about a failing check, and the tempting response it rules out.
# 2. A wrong gradient passed at three tolerances. Name what a passing check
#    establishes, with every qualifier.
# 3. Bench `m32-s3` found shape and dtype not determining aliasing. State what that
#    and a gradient check have in common as narrow instruments.
#
# ---
#
# ## Attributions
#
# Module 32 is authoring-only and has no checked-in reference model. The dual-number
# implementation, the step-size sweep, and the wrong-gradient probe are this
# bench's own, in plain Python floats.
