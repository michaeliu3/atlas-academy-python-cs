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
# # Bench m31-s4 — Solver-Selection Rationale
#
# **Session 31.4 — Read stopping evidence, not solver mythology.** Rungs: **debug
# and defend** (primary), review and verify.
#
# A solver returns. That is the entire content of "it converged" in most code: the
# loop ended. Whether it ended because the iterate stopped moving, because it ran
# out of iterations, or because the numbers stopped being finite is a *different*
# question, and one that a bare return value cannot answer.
#
# This bench runs the same minimizer on the same objective from the same start,
# changing only the step size, and finds three completely different outcomes
# reported identically.
#
# **Requires:** Python 3.12+. Standard library only — no numerical library, so
# every figure here is reproducible arithmetic.

# %%
from _fixture import *  # noqa: F401,F403,E402  (sets up sys.path)

import math  # noqa: E402
import sys  # noqa: E402

from atlas_bench import (  # noqa: E402
    bench, check, checkpoint, claim, emit, non_claim, predict, resolve, reveal,
)

assert sys.version_info >= (3, 12)

bench(module=31, session=4, emits="Solver-Selection Rationale",
      rungs=["debug-and-defend", "review-and-verify"])

# %% [markdown]
# ## 1. A convex objective and a naive minimizer
#
# `f(x) = x²`, whose minimum is at 0 and whose gradient is `2x`. As easy as an
# optimization problem gets: convex, smooth, one dimension, known answer.

# %%
def objective(x: float) -> float:
    return x * x


def gradient(x: float) -> float:
    return 2 * x


# 120 is chosen so the converging run can actually reach the gradient tolerance
# below (it needs ~86 iterations at this step size) and the diverging run can
# reach the divergence bound (~76). A budget too small for its own criteria makes
# every run report "budget exhausted", which would hide the distinction this
# bench exists to draw.
MAX_ITERATIONS = 120
START = 1.0


def minimize(step: float, start: float = START,
             max_iterations: int = MAX_ITERATIONS) -> dict:
    """Gradient descent that reports 'completed' whenever the loop ends."""
    x = start
    history = [x]
    for _ in range(max_iterations):
        x = x - step * gradient(x)
        history.append(x)
    return {"status": "completed", "iterations": max_iterations,
            "x": x, "f": objective(x), "history": history}


# %%
predict(
    "Three step sizes — 0.1, 1.0, and 1.1 — on f(x) = x² from x = 1. All three "
    "run the same 120 iterations and return status 'completed'. What is the final "
    "x in each case?",
    answer="",  # <- fill in
    confidence="",  # sure / fairly sure / guessing
)

# %% [markdown]
# ## 2. Debug — three step sizes, one status

# %%
STEPS = {"0.1 (converging)": 0.1, "1.0 (oscillating)": 1.0,
         "1.1 (diverging)": 1.1}

runs = {label: minimize(step) for label, step in STEPS.items()}

print(f"{'step':>20}  {'status':>10}  {'iterations':>10}  {'final x':>16}  "
      f"{'f(x)':>16}")
for label, run in runs.items():
    print(f"{label:>20}  {run['status']:>10}  {run['iterations']:>10}  "
          f"{run['x']:>16.6g}  {run['f']:>16.6g}")

statuses = {run["status"] for run in runs.values()}
iterations = {run["iterations"] for run in runs.values()}

print(f"\ndistinct statuses reported: {statuses}")
print(f"distinct iteration counts : {iterations}")

converging = runs["0.1 (converging)"]
oscillating = runs["1.0 (oscillating)"]
diverging = runs["1.1 (diverging)"]

checkpoint("all three report the same status", statuses == {"completed"})
checkpoint("and the same iteration count", len(iterations) == 1)
checkpoint("the small step actually converges",
           abs(converging["x"]) < 1e-9, f"x = {converging['x']:.3g}")
checkpoint("the unit step oscillates without ever moving closer",
           abs(abs(oscillating["x"]) - 1.0) < 1e-12,
           f"x = {oscillating['x']:.3g} — it has been bouncing between 1 and -1 "
           f"for all 60 iterations")
checkpoint("the large step diverges",
           not math.isfinite(diverging["x"]) or abs(diverging["x"]) > 1e3,
           f"x = {diverging['x']:.6g}")

# %% [markdown]
# ### What the iterate actually did

# %%
print(f"{'iteration':>10}  {'step 0.1':>14}  {'step 1.0':>10}  {'step 1.1':>16}")
for index in (0, 1, 2, 3, 10, 40, 80, 120):
    print(f"{index:>10}  {converging['history'][index]:>14.6g}  "
          f"{oscillating['history'][index]:>10.3g}  "
          f"{diverging['history'][index]:>16.6g}")

# %%
resolve(
    "Three step sizes — 0.1, 1.0, and 1.1 — on f(x) = x² from x = 1. All three "
    "run the same 120 iterations and return status 'completed'. What is the final "
    "x in each case?",
    "matched",  # matched / diverged / partial
)

# %%
reveal(
    "Three step sizes — 0.1, 1.0, and 1.1 — on f(x) = x² from x = 1. All three "
    "run the same 120 iterations and return status 'completed'. What is the final "
    "x in each case?",
    """
    Essentially 0, exactly ±1, and something astronomically large. All three
    reported `completed` after 120 iterations.

    The status field is not lying. The loop *did* complete — it ran its 120
    iterations and returned. It is answering "did the loop finish?", which is a
    question about control flow, and being read as "did we find a minimum?", which
    is a question about the iterate. Those come apart completely here, and the
    return value has no way to signal it.

    The three behaviours come from one inequality. For `f(x) = x²` the update is
    `x ← x(1 − 2α)`, so the iterate is multiplied by `(1 − 2α)` every step:

    At `α = 0.1` the factor is 0.8, so the iterate shrinks geometrically toward 0.
    Converged.

    At `α = 1.0` the factor is exactly −1. The iterate flips sign and keeps its
    magnitude: 1, −1, 1, −1, forever. After 120 iterations it is exactly as far
    from the minimum as when it started, and `f(x)` is exactly the value it began
    with. Nothing improved, nothing broke, and nothing in the return value
    distinguishes this from success.

    At `α = 1.1` the factor is −1.2, so the magnitude grows by 20% per step.
    A hundred and twenty steps of that is 1.2¹²⁰ ≈ 3.2 billion.

    The oscillating case is the one worth dwelling on, because the diverging one is
    at least *loud* — an enormous number or an overflow tends to get noticed
    downstream. The oscillating run returns a perfectly ordinary, finite, plausible
    number. It has an objective value. It would pass a sanity check for
    finiteness, for magnitude, for type. It is simply the answer you started with.

    So what would a real stopping report have to contain? At minimum: **why** the
    loop ended, as a named reason rather than a status. Section 3 adds three — the
    gradient norm fell below a tolerance, the iterate exceeded a divergence bound,
    or the budget ran out — and the three runs then separate cleanly: the
    converging run stops itself at iteration 87 on its own criterion, the diverging
    run is caught at 77, and only the oscillating run runs the budget out. Just as
    importantly, the budget has to be large enough for the criteria to fire; a
    budget of 60 would have made all three report "exhausted" and hidden exactly
    the distinction the report exists to draw.

    Everything after that is the same discipline the rest of this course applies to
    measurements. A tolerance is a declared threshold, so a result is *relative to
    it* — "converged" always means "converged to within the tolerance I chose". A
    gradient norm near zero locates a stationary point, which for a convex objective
    is a minimum and for a general one might be a saddle. And "the solver
    converged" without a tolerance, a criterion, and a reason is bench `m12-s6`'s
    failure again: a narrow instrument's result widened in the summary.
    """,
)

# %% [markdown]
# ## 3. Verify — a stopping report that distinguishes the three

# %%
GRADIENT_TOLERANCE = 1e-8
DIVERGENCE_BOUND = 1e6


def minimize_with_reason(step: float, start: float = START,
                         max_iterations: int = MAX_ITERATIONS,
                         gradient_tolerance: float = GRADIENT_TOLERANCE,
                         divergence_bound: float = DIVERGENCE_BOUND) -> dict:
    """The same loop, reporting WHY it stopped."""
    x = start
    for iteration in range(1, max_iterations + 1):
        if not math.isfinite(x):
            return {"reason": "non-finite iterate", "iterations": iteration,
                    "x": x, "converged": False}
        if abs(x) > divergence_bound:
            return {"reason": "iterate exceeded divergence bound",
                    "iterations": iteration, "x": x, "converged": False}
        current_gradient = gradient(x)
        if abs(current_gradient) <= gradient_tolerance:
            return {"reason": "gradient below tolerance", "iterations": iteration,
                    "x": x, "converged": True}
        x = x - step * current_gradient
    return {"reason": "iteration budget exhausted", "iterations": max_iterations,
            "x": x, "converged": False}


print(f"{'step':>20}  {'converged':>9}  {'iterations':>10}  {'reason':>26}")
reported = {}
for label, step in STEPS.items():
    outcome = minimize_with_reason(step)
    reported[label] = outcome
    print(f"{label:>20}  {str(outcome['converged']):>9}  "
          f"{outcome['iterations']:>10}  {outcome['reason']:>26}")

reasons = {outcome["reason"] for outcome in reported.values()}

checkpoint("the three runs now report different reasons",
           len(reasons) > 1, f"{sorted(reasons)}")
checkpoint("only the converging run claims convergence",
           reported["0.1 (converging)"]["converged"]
           and not reported["1.0 (oscillating)"]["converged"]
           and not reported["1.1 (diverging)"]["converged"])
checkpoint("the oscillating run is honest about running out of budget",
           reported["1.0 (oscillating)"]["reason"] == "iteration budget exhausted"
           and reported["1.0 (oscillating)"]["iterations"] == MAX_ITERATIONS,
           "no criterion was ever met; the loop simply ended")
checkpoint("the diverging run is stopped by the divergence bound, early",
           reported["1.1 (diverging)"]["reason"]
           == "iterate exceeded divergence bound"
           and reported["1.1 (diverging)"]["iterations"] < MAX_ITERATIONS,
           f"caught at iteration {reported['1.1 (diverging)']['iterations']} "
           f"instead of running the full budget")
checkpoint("and the converging run stops early too, on its own criterion",
           reported["0.1 (converging)"]["iterations"] < MAX_ITERATIONS,
           f"gradient tolerance met at iteration "
           f"{reported['0.1 (converging)']['iterations']}")

# %% [markdown]
# ## 4. Recognize — what does each stopping reason establish?

# %%
REASONS = {
    "a": "The gradient norm fell below the tolerance.",
    "b": "The iterate stopped moving.",
    "c": "The iteration budget ran out.",
    "d": "The function value stopped decreasing.",
}
for key, text in REASONS.items():
    print(f"{key}. {text}")


def evidence_of_a_stationary_point(key: str) -> bool:
    """True when this reason is evidence that a stationary point was reached."""
    raise NotImplementedError("Judge each stopping reason as evidence")


# %%
check("evidence_of_a_stationary_point", evidence_of_a_stationary_point,
      [(("a",), True), (("b",), False), (("c",), False), (("d",), False)])
print()
print("(b) is the one that looks conclusive and is not: the iterate stops moving")
print("when the STEP times the gradient is small, and a tiny step size makes that")
print("true anywhere. (d) is the same trap — a plateau, a step that overshoots")
print("symmetrically, and a genuine minimum all stop the value decreasing. Only")
print("(a) is about the objective's own geometry rather than the solver's state.")

# %% [markdown]
# ## 5. The solver-selection rationale

# %%
RATIONALE = """
The objective, and what is known about it before any solver runs:
The solver, its step size, and why that step size:
The stopping criterion, with its tolerance written as a number:
The reason the run actually ended, quoted from the report:
What that reason establishes, and what it does not:
The run that returned a plausible number and had not converged, and how I would
have noticed:
What I would report to a reviewer instead of 'it converged':
"""
print(RATIONALE)

# %%
claim("DEFENDED REPAIR", RATIONALE)

claim(
    "LOCAL REFERENCE RESULT",
    f"On f(x) = x² from x = {START}, gradient descent run for {MAX_ITERATIONS} "
    f"iterations returns status 'completed' for step sizes 0.1, 1.0, and 1.1 "
    f"alike, with identical iteration counts. The final iterates are "
    f"{converging['x']:.3g}, {oscillating['x']:.3g}, and "
    f"{diverging['x']:.6g} — converged, oscillating between ±1 with the objective "
    f"unchanged from its starting value, and diverged. A stopping report that "
    f"names its reason separates them into {len(reasons)} distinct outcomes, and "
    f"only the first claims convergence.",
    support={"objective": "x^2", "start": START,
             "maxIterations": MAX_ITERATIONS,
             "naive": {label: {"status": run["status"],
                               "iterations": run["iterations"],
                               "finalX": run["x"], "finalF": run["f"]}
                       for label, run in runs.items()},
             "withReason": reported,
             "distinctStatuses": sorted(statuses),
             "distinctReasons": sorted(reasons)},
)

non_claim(
    "This is one-dimensional gradient descent on a single convex quadratic with a "
    "known closed-form minimum, in plain Python floats. It establishes that a "
    "status field reporting loop completion cannot distinguish convergence from "
    "oscillation from divergence, and that naming the stopping reason does. It "
    "measures no real optimizer, models no line search, momentum, adaptive step "
    "size, or constraint handling, and says nothing about non-convex objectives "
    "where a small gradient norm is compatible with a saddle point rather than a "
    "minimum. The step-size thresholds here follow from this objective's curvature "
    "and do not transfer."
)

emit()

# %% [markdown]
# ## 6. Transfer
#
# 1. Three outcomes shared one status. Write the rule this implies about any
#    library function that returns 'success'.
# 2. The oscillating run returned a finite, plausible number. Name the check that
#    would have caught it, and say why a finiteness check would not.
# 3. Bench `m24-s6` refused to convert a measurement into a decision. State what
#    'converged' and 'this patch is faster' have in common as claims.
#
# ---
#
# ## Attributions
#
# Module 31 is authoring-only and has no checked-in reference model. The objective,
# the two minimizers, and the stopping-reason taxonomy are this bench's own, in
# plain Python floats with no numerical library.
