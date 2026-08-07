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
# # Bench m02-s4 — recurrence-and-stack-cost claim
#
# **Session 2.4 — Call shape and resource cost.** Rungs: **trace** (primary), map.
#
# Bench `m05-s3` shows that total calls and peak stack depth rank differently
# across recursive shapes, and leaves one question as transfer work: *memoizing
# Fibonacci collapses total calls — what happens to peak frames?*
#
# This bench answers it, and the answer is the reason memoization is a trade
# rather than a free win.
#
# **Requires:** Python 3.12+. Standard library only.

# %%
from _fixture import CallTrace, fib_iterative, fib_memoized, fib_naive  # noqa: E402

import sys  # noqa: E402

from atlas_bench import (  # noqa: E402
    bench, check, checkpoint, claim, emit, non_claim, predict, resolve, reveal,
)

assert sys.version_info >= (3, 12)
sys.setrecursionlimit(20000)

bench(module=2, session=4, emits="recurrence-and-stack-cost claim",
      rungs=["trace", "map"])

# %% [markdown]
# ## 1. Three implementations of one recurrence

# %%
predict(
    "Memoizing Fibonacci collapses total calls from exponential to linear. What "
    "happens to the PEAK number of simultaneous frames — it also collapses, it "
    "stays about the same, or it gets worse?",
    answer="",  # <- fill in
    confidence="",  # sure / fairly sure / guessing
)

# %% [markdown]
# ## 2. Trace — calls and frames, separately

# %%
N = 22
measurements = {}

for label, function in (("naive", fib_naive), ("memoized", fib_memoized),
                        ("iterative", fib_iterative)):
    trace = CallTrace()
    value = function(N, trace)
    measurements[label] = {"value": value, "calls": trace.total, "peak": trace.peak}

print(f"fib({N})")
print(f"{'variant':>12}  {'result':>8}  {'total calls':>12}  {'peak frames':>12}")
for label, data in measurements.items():
    print(f"{label:>12}  {data['value']:>8}  {data['calls']:>12,}  {data['peak']:>12,}")

checkpoint("all three agree on the answer",
           len({d["value"] for d in measurements.values()}) == 1)
checkpoint("memoization collapses total calls",
           measurements["memoized"]["calls"] < measurements["naive"]["calls"] / 100,
           f"{measurements['naive']['calls']:,} -> {measurements['memoized']['calls']:,}")
checkpoint("but peak frames barely moves",
           measurements["memoized"]["peak"] >= measurements["naive"]["peak"] * 0.8,
           f"{measurements['naive']['peak']} -> {measurements['memoized']['peak']}")
checkpoint("only the iterative version collapses depth",
           measurements["iterative"]["peak"] == 1)

# %%
resolve(
    "Memoizing Fibonacci collapses total calls from exponential to linear. What "
    "happens to the PEAK number of simultaneous frames — it also collapses, it "
    "stays about the same, or it gets worse?",
    "matched",  # matched / diverged / partial
)

# %%
reveal(
    "Memoizing Fibonacci collapses total calls from exponential to linear. What "
    "happens to the PEAK number of simultaneous frames — it also collapses, it "
    "stays about the same, or it gets worse?",
    """
    It stays about the same — roughly n either way.

    Memoization removes *repeated* subproblems. It does not shorten the longest
    chain of dependencies: computing fib(n) still requires fib(n-1), which
    requires fib(n-2), all the way down. That chain is the stack, and nothing
    about caching makes it shorter.

    So the two costs move independently:

    | | total calls | peak frames |
    |---|---|---|
    | naive | exponential | ~n |
    | memoized | ~n | **~n** |
    | iterative | ~n | **1** |

    Memoization trades *time* for *space* — twice over, in fact. It adds a table
    holding n entries, and it keeps the O(n) stack. The iterative version is the
    one that changes the space story, because it removes the recursion rather
    than accelerating it.

    The practical consequence is the failure mode: a memoized recursive solution
    can be fast and still exceed the recursion limit, because the limit is about
    depth and memoization does not touch depth. "It was too slow so I added a
    cache" and "it crashed so I added a cache" are different problems, and only
    the first one has that solution.

    This is what workbook section 4 means by keeping the recurrence and the stack
    claim separate. The recurrence T(n) = T(n-1) + T(n-2) + 1 describes work. The
    depth is a different reading of the same call tree, and one bound does not
    imply the other.
    """,
)

# %% [markdown]
# ## 3. The failure memoization does not prevent

# %%
DEPTH = 3000
results = {}
for label, function in (("memoized", fib_memoized), ("iterative", fib_iterative)):
    trace = CallTrace()
    try:
        function(DEPTH, trace)
        results[label] = f"completed, peak frames {trace.peak:,}"
    except RecursionError:
        results[label] = f"RecursionError at depth ~{trace.peak:,}"

sys.setrecursionlimit(1000)
deep = CallTrace()
try:
    fib_memoized(2000, deep)
    limited = "completed"
except RecursionError:
    limited = f"RecursionError at peak {deep.peak:,}"
sys.setrecursionlimit(20000)

print(f"at n={DEPTH} with a raised limit:")
for label, outcome in results.items():
    print(f"  {label:>10}: {outcome}")
print(f"\nmemoized at n=2000 with the DEFAULT limit of 1000: {limited}")

checkpoint("the memoized version is bounded by the recursion limit",
           limited.startswith("RecursionError"),
           "a cache makes it fast, not shallow")

# %% [markdown]
# ## 4. Map — which claim does each measurement support?

# %%
CLAIMS = {
    "a": "Memoization changes the time recurrence.",
    "b": "Memoization changes the stack-depth bound.",
    "c": "The iterative version changes the stack-depth bound.",
    "d": "A fast implementation cannot hit the recursion limit.",
}
for key, text in CLAIMS.items():
    print(f"{key}. {text}")


def supported(key: str) -> bool:
    """True when this bench's measurements support the claim."""
    raise NotImplementedError("Audit the four claims")


# %%
check("supported", supported,
      [(("a",), True), (("b",), False), (("c",), True), (("d",), False)])

# %% [markdown]
# ## 5. The claim

# %%
COST_CLAIM = """
The recurrence, with its base case:
The work bound it implies, and how memoization changes it:
The stack-depth bound, stated separately:
Which of the two memoization does NOT change, and why:
"""
print(COST_CLAIM)

# %%
claim("DERIVATION", COST_CLAIM)

claim(
    "FINITE EXPERIMENT",
    f"At n={N}, naive Fibonacci made {measurements['naive']['calls']:,} calls at "
    f"peak depth {measurements['naive']['peak']}; memoized made "
    f"{measurements['memoized']['calls']:,} calls at peak depth "
    f"{measurements['memoized']['peak']}; iterative made "
    f"{measurements['iterative']['calls']} call at depth "
    f"{measurements['iterative']['peak']}. The memoized version still raises "
    f"RecursionError at n=2000 under the default limit.",
    support={"n": N, "measurements": measurements, "deepLimitOutcome": limited},
)

non_claim(
    "One value of n and one recursion limit. This shows memoization leaves depth "
    "proportional to n on this recurrence; it does not establish that for every "
    "recurrence, and a divide-and-conquer shape would give logarithmic depth "
    "memoized or not."
)

emit()

# %% [markdown]
# ## 6. Transfer
#
# 1. Bench `m05-s3` showed total calls and peak frames ranking differently across
#    shapes. This bench shows one optimisation moving only one of them. State the
#    general rule connecting the two findings.
# 2. Name a workload where the memoized version is the wrong choice *because* of
#    its depth.
# 3. Session 3 asks for a termination argument. Which of the three variants needs
#    one, and which is obviously terminating?
#
# ---
#
# ## Attributions
#
# Authored for this course. Module 2 has no checked-in reference model.
# Deliberately complements `m05-s3` rather than repeating it: that bench compares
# recursive *shapes*, this one measures what a single optimisation moves.
