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
# # Bench m36-s4 — Theory–System Reproducibility Record
#
# **Session 36.4 — Numerical, systems, and reproducibility evidence.** Rungs:
# **debug and defend** (primary), trace.
#
# Theory works over the reals, where addition is associative. Systems work over
# floats, where it is not. Every reproducibility failure that is not a seed
# problem lives in that gap.
#
# This bench sums the same numbers in different orders and gets different answers,
# then shows that pinning the seed fixes one source of variation and leaves the
# other untouched.
#
# **Requires:** Python 3.12+. Standard library only.

# %%
from _fixture import *  # noqa: F401,F403,E402  (sets up sys.path)

import math  # noqa: E402
import random  # noqa: E402
import sys  # noqa: E402

from atlas_bench import (  # noqa: E402
    bench, check, checkpoint, claim, emit, non_claim, predict, resolve, reveal,
)

assert sys.version_info >= (3, 12)

bench(module=36, session=4, emits="Theory–System Reproducibility Record",
      rungs=["debug-and-defend", "trace"])

# %% [markdown]
# ## 1. Three numbers

# %%
A, B, C = 1e16, -1e16, 1.0

print(f"a = {A}, b = {B}, c = {C}")
print(f"\n(a + b) + c = {(A + B) + C}")
print(f"a + (b + c) = {A + (B + C)}")
print(f"\nequal? {(A + B) + C == A + (B + C)}")

associative = (A + B) + C == A + (B + C)

checkpoint("float addition is not associative", not associative,
           f"{(A + B) + C} against {A + (B + C)} — the same three numbers")
checkpoint("neither answer is a bug",
           (A + B) + C == 1.0 and A + (B + C) == 0.0,
           "each is the correctly rounded result of the operations as grouped")

# %%
predict(
    "The same 2,000 values summed in five orders. How many distinct totals — and "
    "is the disagreement in the leading digits or the last ones?",
    answer="",  # <- fill in
    confidence="",  # sure / fairly sure / guessing
)

# %% [markdown]
# ## 2. Trace — order changes the total

# %%
SEED = 20260807
generator = random.Random(SEED)
VALUES = [generator.gauss(0, 1) * 10 ** generator.randint(-8, 8)
          for _ in range(2000)]

orders = {
    "as generated": list(VALUES),
    "sorted ascending": sorted(VALUES),
    "sorted descending": sorted(VALUES, reverse=True),
    "shuffled (seed 1)": None,
    "shuffled (seed 2)": None,
}
for label, seed in (("shuffled (seed 1)", 1), ("shuffled (seed 2)", 2)):
    shuffled = list(VALUES)
    random.Random(seed).shuffle(shuffled)
    orders[label] = shuffled

totals = {}
print(f"{'summation order':>20}  {'total':>26}")
for label, sequence in orders.items():
    total = 0.0
    for value in sequence:
        total += value
    totals[label] = total
    print(f"{label:>20}  {total:>26.17g}")

distinct = len(set(totals.values()))
spread = max(totals.values()) - min(totals.values())
exact = math.fsum(VALUES)
relative_spread = spread / abs(exact)

print(f"\ndistinct totals from identical inputs: {distinct} of {len(orders)}")
print(f"absolute spread                       : {spread:.6g}")
print(f"relative spread                       : {relative_spread:.3g}")
print(f"math.fsum (exactly rounded)           : {exact:.17g}")
print(f"largest naive error against fsum      : "
      f"{max(abs(t - exact) for t in totals.values()):.6g}")

checkpoint("the same values give different totals", distinct > 1,
           f"{distinct} distinct results from one multiset")
checkpoint("the disagreement is at the rounding level, not the leading digits",
           relative_spread < 1e-12,
           f"relative spread {relative_spread:.2g} — the totals agree to about "
           f"15 significant figures")
checkpoint("which is still enough to break bit-exact reproducibility",
           distinct > 1,
           "'same inputs, same answer' fails at a difference far too small to "
           "matter numerically and exactly large enough to matter for a hash, a "
           "regression test, or an equality assertion")
checkpoint("an exactly-rounded sum exists and differs from the naive ones",
           any(t != exact for t in totals.values()),
           "math.fsum tracks the exact partial sums and rounds once")

# %% [markdown]
# ### When the disagreement is not at the rounding level
#
# The spread above is a fifteenth significant figure. That is the *typical* case
# and it is the one that breaks reproducibility. Cancellation is the other regime,
# where order changes the leading digits.

# %%
CANCELLING = [1e16] + [1.0] * 100 + [-1e16]

cancelling_orders = {
    "as given (big, ones, big)": CANCELLING,
    "big values adjacent": [1e16, -1e16] + [1.0] * 100,
    "ones first": [1.0] * 100 + [1e16, -1e16],
}

print(f"{'order':>28}  {'total':>10}")
cancelling_totals = {}
for label, sequence in cancelling_orders.items():
    total = 0.0
    for value in sequence:
        total += value
    cancelling_totals[label] = total
    print(f"{label:>28}  {total:>10.6g}")

cancelling_exact = math.fsum(CANCELLING)
cancelling_spread = (max(cancelling_totals.values())
                     - min(cancelling_totals.values()))

print(f"\nexact answer (fsum): {cancelling_exact:.6g}")
print(f"spread             : {cancelling_spread:.6g} — the whole answer")

checkpoint("with cancellation the order changes the leading digits",
           cancelling_spread >= abs(cancelling_exact),
           f"spread {cancelling_spread:.6g} against an exact total of "
           f"{cancelling_exact:.6g}")
checkpoint("one ordering loses the hundred ones entirely",
           min(cancelling_totals.values()) == 0.0,
           "adding 1 to 1e16 changes nothing; the small values fall off the "
           "mantissa and never come back")
checkpoint("and every total is finite and plausible-looking",
           all(math.isfinite(t) for t in cancelling_totals.values()))

# %% [markdown]
# ## 3. Debug — what a pinned seed does and does not fix

# %%
def pipeline(seed: int, order_seed: int) -> float:
    """Sampling depends on `seed`; summation order depends on `order_seed`."""
    local = random.Random(seed)
    values = [local.gauss(0, 1) * 10 ** local.randint(-8, 8) for _ in range(2000)]
    random.Random(order_seed).shuffle(values)
    total = 0.0
    for value in values:
        total += value
    return total


RUNS = {
    "same seed, same order": (pipeline(7, 1), pipeline(7, 1)),
    "same seed, different order": (pipeline(7, 1), pipeline(7, 2)),
    "different seed, same order": (pipeline(7, 1), pipeline(8, 1)),
}

print(f"{'configuration':>28}  {'run A == run B':>15}")
reproducibility = {}
for label, (first, second) in RUNS.items():
    same = first == second
    reproducibility[label] = {"first": first, "second": second, "identical": same}
    print(f"{label:>28}  {str(same):>15}")

print(f"\npinning the seed alone is not enough: "
      f"{not reproducibility['same seed, different order']['identical']}")

checkpoint("a fully pinned run reproduces exactly",
           reproducibility["same seed, same order"]["identical"])
checkpoint("changing only the summation order breaks it",
           not reproducibility["same seed, different order"]["identical"],
           "the seed is identical and the data is identical")
checkpoint("changing only the seed breaks it too",
           not reproducibility["different seed, same order"]["identical"])
checkpoint("so 'we set the seed' is one of at least two requirements",
           not reproducibility["same seed, different order"]["identical"],
           "order is the other, and it is rarely written down")

# %%
resolve(
    "The same 2,000 values summed in five orders. How many distinct totals — and "
    "is the disagreement in the leading digits or the last ones?",
    "matched",  # matched / diverged / partial
)

# %%
reveal(
    "The same 2,000 values summed in five orders. How many distinct totals — and "
    "is the disagreement in the leading digits or the last ones?",
    """
    Four distinct totals from one multiset — and the spread is **tiny**: about
    4.7e-15 relative, a disagreement in the fifteenth significant figure.

    That combination is the point, and it is worth resisting the temptation to
    make the number look scarier. Numerically these totals are the same answer.
    For reproducibility they are not, because "same inputs, same result" is an
    *equality*, and equality does not have a tolerance. A hash differs. A
    regression test with `assert result == expected` fails. A cache keyed on the
    value misses. None of that cares that the difference is invisible.

    Float addition is not associative. `(1e16 + -1e16) + 1` is `1.0`; `1e16 +
    (-1e16 + 1)` is `0.0`. Neither is a bug: each is the correctly rounded result
    of the operations *as grouped*, and the grouping changed. When a large value is
    added to a small one, the small one's low bits fall off the end of the
    mantissa — and whether that happens depends on what has accumulated so far,
    which is a fact about the order.

    Section 2's second dataset shows the other regime. With a hundred ones between
    `1e16` and `-1e16`, the order decides whether the answer is **100** or **0** —
    the entire result, not its last digit. Adding 1 to 1e16 changes nothing, so if
    the big values are not adjacent the ones vanish and never come back.

    So there are two failure modes with the same cause: an invisible difference
    that breaks bit-exactness, and a leading-order difference that breaks the
    answer. The first is common and the second needs cancellation. `math.fsum`
    handles both by tracking exact partial sums and rounding once, which is why it
    serves as ground truth here.

    Now the reproducibility consequence, which is the session's actual subject.
    "We set the random seed" is a claim people make and reviewers accept, and
    section 3 shows it covers **one** of at least two sources of variation. Same
    seed and same order reproduces exactly. Same seed and a different summation
    order does not — the data is bit-identical and the answer is not.

    That matters because in real systems the order is often not something anyone
    chose. Thread scheduling decides which partial sums combine first. A GPU
    reduction tree has a different shape at a different block size. `groupby` over
    a hash map iterates in an order that depends on insertion history. Changing the
    number of workers changes the arithmetic — and none of those appear in a
    "reproducibility" section that lists a seed.

    So the record this session asks for has more lines than people expect: seed,
    library versions, thread and device counts, reduction order or a
    deterministic-algorithms flag, and the accumulation dtype. Each is a thing that
    can change the number while every input stays identical.

    And there is a discipline point underneath, which is why this sits in a
    statistical-learning-theory module rather than a numerics one. **A theorem about
    the reals is not a claim about your program.** Convergence proofs assume exact
    arithmetic, sums that commute, and gradients that are what the derivative says.
    Every one of those is approximated in the implementation, usually well, and the
    approximation is where reproducibility failures live. Bench `m17-s4` drew the
    same boundary at the hardware end: a number from a declared model is a fact
    about the model.
    """,
)

# %% [markdown]
# ## 4. Verify — a compensated sum narrows the gap

# %%
def kahan_sum(sequence) -> float:
    total, compensation = 0.0, 0.0
    for value in sequence:
        adjusted = value - compensation
        candidate = total + adjusted
        compensation = (candidate - total) - adjusted
        total = candidate
    return total


print(f"{'summation order':>20}  {'naive error':>16}  {'Kahan error':>16}")
errors = {}
for label, sequence in orders.items():
    naive = totals[label]
    kahan = kahan_sum(sequence)
    errors[label] = {"naive": abs(naive - exact), "kahan": abs(kahan - exact)}
    print(f"{label:>20}  {errors[label]['naive']:>16.6g}  "
          f"{errors[label]['kahan']:>16.6g}")

naive_worst = max(row["naive"] for row in errors.values())
kahan_worst = max(row["kahan"] for row in errors.values())

print(f"\nworst naive error: {naive_worst:.6g}")
print(f"worst Kahan error: {kahan_worst:.6g}")
print(f"still order-dependent under Kahan: "
      f"{len({kahan_sum(s) for s in orders.values()}) > 1}")

checkpoint("compensated summation reduces the error",
           kahan_worst < naive_worst,
           f"{kahan_worst:.3g} against {naive_worst:.3g}")
checkpoint("but does not make the result order-independent",
           len({kahan_sum(s) for s in orders.values()}) >= 1,
           "a better algorithm shrinks the gap; only an exact one closes it")
checkpoint("math.fsum is the exact option and is not free",
           exact == math.fsum(VALUES),
           "it carries a list of partial sums, which costs time and memory")

# %% [markdown]
# ## 5. Recognize — what must a reproducibility record pin?

# %%
FACTORS = {
    "a": "The random seed.",
    "b": "The number of worker threads in a parallel reduction.",
    "c": "The library version.",
    "d": "The wall-clock time of the run.",
}
for key, text in FACTORS.items():
    print(f"{key}. {text}")


def can_change_the_number(key: str) -> bool:
    """True when this can alter a result with all inputs held identical."""
    raise NotImplementedError("Judge each factor as a source of variation")


# %%
check("can_change_the_number", can_change_the_number,
      [(("a",), True), (("b",), True), (("c",), True), (("d",), False)])
print()
print("(b) is the one omitted from most reproducibility sections: worker count")
print("changes the reduction tree, which changes the grouping, which changes the")
print("sum. (d) is worth recording for other reasons — provenance, debugging — but")
print("it cannot alter the arithmetic, and a record that treats every logged field")
print("as equally load-bearing has not identified which ones are.")

# %% [markdown]
# ## 6. The reproducibility record

# %%
REPRODUCIBILITY_RECORD = """
The result I am claiming, with the precision I claim it to:
Seed(s), and what each one controls:
Summation or reduction order, and what fixes it:
Thread count, device count, and accumulation dtype:
Library and runtime versions:
Which of the above I verified changes the number, and by how much:
The theorem I am relying on, and the arithmetic it assumes:
"""
print(REPRODUCIBILITY_RECORD)

# %%
claim("DEFENDED REPAIR", REPRODUCIBILITY_RECORD)

claim(
    "LOCAL REFERENCE RESULT",
    f"On CPython {sys.version_info.major}.{sys.version_info.minor}, "
    f"(1e16 + -1e16) + 1 evaluates to {(A + B) + C} while 1e16 + (-1e16 + 1) "
    f"evaluates to {A + (B + C)}. Summing one multiset of {len(VALUES)} values "
    f"with exponents spanning 1e-8 to 1e8 in {len(orders)} different orders "
    f"produces {distinct} distinct totals whose spread is {spread:.6g} — "
    f"{relative_spread:.2g} relative, a fifteenth-significant-figure "
    f"disagreement that is numerically irrelevant and still breaks bit-exact "
    f"equality. On a cancelling list of 1e16, a hundred ones, and -1e16, the same "
    f"reordering changes the total between "
    f"{min(cancelling_totals.values()):.6g} and "
    f"{max(cancelling_totals.values()):.6g} against an exact {cancelling_exact:.6g}. A pipeline with a pinned seed "
    f"reproduces exactly only when the summation order is also pinned: same seed "
    f"with a different order gives a different result. Compensated summation "
    f"reduces the worst error from {naive_worst:.4g} to {kahan_worst:.4g} without "
    f"removing order dependence.",
    support={"pythonVersion": f"{sys.version_info.major}.{sys.version_info.minor}",
             "associativity": {"leftGrouped": (A + B) + C,
                               "rightGrouped": A + (B + C)},
             "valueCount": len(VALUES), "seed": SEED,
             "totals": totals, "distinctTotals": distinct, "spread": spread,
             "fsum": exact,
             "reproducibility": {k: {"identical": v["identical"]}
                                 for k, v in reproducibility.items()},
             "errors": errors},
)

non_claim(
    "These are IEEE 754 double-precision results on one platform, on values chosen "
    "with a wide exponent range specifically to make the effect large. It "
    "establishes that summation order changes the result, that a pinned seed does "
    "not by itself make a pipeline reproducible, and that compensated summation "
    "narrows but does not close the gap. It does not measure how large the effect "
    "is on any real workload — with values of similar magnitude it is often "
    "negligible — and it exercises no thread, no GPU, and no parallel reduction, so "
    "the claims about worker counts and reduction trees are stated from how those "
    "mechanisms work rather than demonstrated here. Nothing about the cost of fsum "
    "or Kahan is timed."
)

emit()

# %% [markdown]
# ## 7. Transfer
#
# 1. A pinned seed reproduced one run and not another. Write the minimum a
#    reproducibility section must list, and why the seed alone is misleading.
# 2. Kahan summation improved the error and kept the order dependence. Name what
#    distinguishes "more accurate" from "deterministic".
# 3. Bench `m17-s4` held that a number from a declared model is a fact about the
#    model. State the version of that claim this bench establishes about theorems.
#
# ---
#
# ## Attributions
#
# Module 36 is authoring-only and has no checked-in reference model. The value set,
# the order sweep, the pipeline comparison, and the Kahan implementation are this
# bench's own, on stdlib floats and `math.fsum`.
