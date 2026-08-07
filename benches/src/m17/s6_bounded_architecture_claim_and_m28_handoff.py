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
# # Bench m17-s6 — bounded architecture claim and M28 handoff
#
# **Session 17.6 — Review the incident and defend a bounded claim.** Rungs:
# **review and verify** (primary), debug and defend.
#
# An assistant times two implementations, runs one after the other, and reports
# the faster. This bench asks whether the experiment could have said anything
# else — by measuring the *order effect* the uncrossed design confounds with the
# result.
#
# **Requires:** Python 3.12+. Standard library only.

# %%
from _fixture import *  # noqa: F401,F403,E402  (sets up sys.path)

import sys  # noqa: E402

from atlas_bench import (  # noqa: E402
    bench, check, checkpoint, claim, emit, non_claim, predict, resolve, reveal,
)
from module17_reference import (  # noqa: E402
    counterbalanced_schedule, counterbalanced_timings, deterministic_permutation,
    priority_codes, sequential_order, timing_cells,
)

assert sys.version_info >= (3, 12)

bench(module=17, session=6, emits="bounded architecture claim and M28 handoff",
      rungs=["review-and-verify", "debug-and-defend"])

# %% [markdown]
# ## 1. The generated claim
#
# > "I timed both access orders. Sequential is faster, so the locality model is
# > confirmed on this machine."

# %%
SIZE, BLOCKS, CALLS = 60, 6, 400
codes = priority_codes(SIZE)
orders = {
    "sequential": sequential_order(SIZE),
    "permuted": deterministic_permutation(SIZE),
}

schedule = counterbalanced_schedule(BLOCKS)
print(f"counterbalanced schedule ({BLOCKS} blocks):")
for block, (pattern, condition) in enumerate(schedule[:8], start=1):
    print(f"  block {block}: {pattern} -> {condition}")
print("  ...")

# %%
predict(
    "The assistant ran each implementation once, one after the other. Before "
    "looking at any result — is there a systematic difference between a "
    "first-timed block and a later one?",
    answer="",  # <- fill in
    confidence="",  # sure / fairly sure / guessing
)

# %% [markdown]
# ## 2. Verify — measure the order effect itself

# %%
trials = counterbalanced_timings(codes, orders, 5, blocks=BLOCKS, number=CALLS)
cells = timing_cells(trials)

print(f"{'cell':>48}  {'n':>3}  {'median s/call':>14}")
for name in sorted(cells):
    cell = cells[name]
    print(f"{name:>48}  {cell['count']:>3}  {cell['median_seconds_per_call']:>14.3e}")

first_cells = {k: v for k, v in cells.items() if "first-timed" in k}
later_cells = {k: v for k, v in cells.items() if "later-timed" in k}

exposure_effect = {}
for condition in orders:
    first = cells.get(f"{condition}.first-timed-block-for-condition")
    later = cells.get(f"{condition}.later-timed-block-for-condition")
    if first and later:
        exposure_effect[condition] = (
            first["median_seconds_per_call"] / later["median_seconds_per_call"]
        )

print(f"\nfirst-exposure penalty by condition (first / later):")
for condition, ratio in exposure_effect.items():
    print(f"  {condition:>12}: {ratio:.3f}x")

between_conditions = (
    cells["sequential.later-timed-block-for-condition"]["median_seconds_per_call"]
    / cells["permuted.later-timed-block-for-condition"]["median_seconds_per_call"]
)
largest_order_effect = max(abs(r - 1.0) for r in exposure_effect.values())

print(f"\nbetween-condition ratio (later blocks only): {between_conditions:.3f}x")
print(f"largest order effect                       : {largest_order_effect:.3%}")

checkpoint("the design crosses condition with position",
           len(first_cells) == len(later_cells) == len(orders),
           "each condition appears both first and later, so the two are separable")
checkpoint("the order effect is quantified rather than assumed",
           all(0.5 < r < 2.0 for r in exposure_effect.values()),
           f"{largest_order_effect:.2%} here — small, and now known to be small")
checkpoint("it is the same magnitude as the between-condition difference",
           abs(between_conditions - 1.0) < 0.10,
           f"{abs(between_conditions - 1.0):.2%} — neither difference is large "
           f"in this apparatus")

# %%
resolve(
    "The assistant ran each implementation once, one after the other. Before "
    "looking at any result — is there a systematic difference between a "
    "first-timed block and a later one?",
    "matched",  # matched / diverged / partial
)

# %%
reveal(
    "The assistant ran each implementation once, one after the other. Before "
    "looking at any result — is there a systematic difference between a "
    "first-timed block and a later one?",
    """
    There is one, and in this apparatus it is small — around one percent. The
    important part is that you now *know* it is small, and could not have known
    without crossing the design.

    The effect comes from everything that differs between a cold start and a
    warmed-up process: freshly touched code paths, allocation patterns that have
    not settled, branch-prediction and cache state the first pass builds for the
    second to inherit. Nothing about it concerns which implementation is better.

    Notice the sizes. The order effect here is about the same magnitude as the
    difference between the two conditions. That is the uncomfortable finding: in
    an uncrossed run, the confound would have been as large as the signal.

    Now consider the assistant's design. It ran A, then B. Whatever the exposure
    effect is — one percent or twenty — it lands entirely on A. So the comparison
    is not "A versus B"; it is "A-going-first versus B-going-second". Those two
    factors are **confounded**: no analysis of that data can separate them,
    because the design never varied one while holding the other fixed.

    That is why the schedule alternates ABBA and BAAB. Each condition appears
    first in some blocks and later in others, so the position effect averages out
    across conditions instead of loading onto one. The crossing is what makes the
    difference between conditions interpretable at all.

    The review verdict follows, and it is stronger than "the result is
    unreliable": **the uncrossed experiment could not have produced evidence
    either way.** Had it reported that permuted was faster, that would have been
    equally unsupported. A design that cannot distinguish two explanations does
    not weakly support one — it supports neither, and re-running it more times
    makes the confounded estimate more precise without making it less confounded.

    The bounded claim this bench can defend is therefore narrow: *under this
    counterbalanced schedule and this call count, the per-call medians are X and
    Y, with a measured first-exposure penalty of Z.* Anything about the host CPU's
    cache hierarchy is Module 28's territory and needs a different instrument.
    """,
)

# %% [markdown]
# ## 3. Review and verify — audit four statements

# %%
CLAIMS = {
    "a": "The first timed block for a condition differs from later blocks.",
    "b": "Running A then B, once each, shows which implementation is faster.",
    "c": "Repeating the uncrossed A-then-B experiment more times fixes it.",
    "d": "Counterbalancing lets the position effect average out across conditions.",
}
for key, text in CLAIMS.items():
    print(f"{key}. {text}")


def supported(key: str) -> bool:
    """True when this bench's evidence supports the claim."""
    raise NotImplementedError("Audit the four claims")


# %%
check("supported", supported,
      [(("a",), True), (("b",), False), (("c",), False), (("d",), True)])
print()
print("(c) is the one people get wrong: more repetitions of a confounded design")
print("give a tighter estimate of the wrong quantity.")

# %% [markdown]
# ## 4. The bounded claim

# %%
BOUNDED_CLAIM = """
The measurement, with its schedule, call count, and environment:
The first-exposure penalty I measured, stated separately from any comparison:
The claim I am willing to defend:
The claim the uncrossed experiment could have supported (and why it is 'none'):
What belongs to M28 rather than here:
"""
print(BOUNDED_CLAIM)

# %%
claim("REVIEW VERDICT", BOUNDED_CLAIM)

claim(
    "LOCAL REFERENCE RESULT",
    f"Under a {BLOCKS}-block counterbalanced schedule at {CALLS} calls per trial, "
    f"the first timed block for a condition differs from later blocks by at most "
    f"{largest_order_effect:.2%}, and the between-condition ratio on later blocks "
    f"is {between_conditions:.3f}x — an order effect of the same magnitude as the "
    f"signal, measured independently of it.",
    support={"size": SIZE, "blocks": BLOCKS, "calls": CALLS,
             "schedule": [list(pair) for pair in schedule],
             "cells": {k: {"count": v["count"],
                           "median": v["median_seconds_per_call"]}
                       for k, v in cells.items()},
             "exposureEffect": exposure_effect,
             "betweenConditionRatio": between_conditions,
             "largestOrderEffect": largest_order_effect},
)

non_claim(
    "These timings come from one process on one machine with one interpreter and "
    "no control over other load. They establish that an order effect exists in "
    "this apparatus and that an uncrossed design confounds it with the "
    "comparison; they do not measure cache behaviour, do not generalise to other "
    "hardware, and do not establish that either access order is faster in any "
    "setting outside this schedule."
)

emit()

# %% [markdown]
# ## 5. Transfer
#
# 1. More repetitions did not fix the confound. Write the rule about what
#    repetition improves and what it cannot.
# 2. The uncrossed design could have "proved" either answer. Name the general
#    property that makes an experiment capable of being wrong.
# 3. Bench `m17-s4` produced exact miss counts from a declared model. State which
#    of the two benches could support a claim about this laptop, and why neither
#    quite does.
#
# ---
#
# ## Attributions
#
# Probes `public/downloads/module17_reference.py` — `counterbalanced_schedule`,
# `counterbalanced_timings`, `timing_cells`, `priority_codes`,
# `sequential_order`, `deterministic_permutation`. Not reimplemented. The
# exposure-effect analysis and the claim audit are this bench's own.
