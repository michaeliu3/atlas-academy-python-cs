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
# # Bench m06-s3 — growth-and-capacity evidence card
#
# **Session 6.3 — Make growth visible.** Rungs: **recognize** (primary), trace.
#
# Bench `m05-s4` measures what growth *costs*: total element copies, amortized to
# a constant. This bench asks a different question about the same object — what
# the capacity sequence actually is, and which half of what you observe is a
# language guarantee versus one interpreter's arithmetic.
#
# **Requires:** Python 3.12+. Standard library only.

# %%
from _fixture import capacity_ladder  # noqa: E402

import sys  # noqa: E402

from atlas_bench import (  # noqa: E402
    bench, check, checkpoint, claim, emit, non_claim, predict, resolve, reveal,
)

assert sys.version_info >= (3, 12)

bench(module=6, session=3, emits="growth-and-capacity evidence card",
      rungs=["recognize", "trace"])

# %% [markdown]
# ## 1. Prediction

# %%
predict(
    "A list grows by reallocating. Each reallocation multiplies its capacity by "
    "roughly what factor — 2, or something else?",
    answer="",  # <- fill in
    confidence="",  # sure / fairly sure / guessing
)

# %% [markdown]
# ## 2. Trace — the capacity ladder in slots

# %%
POINTER = 8
EMPTY = sys.getsizeof([])
ladder = capacity_ladder(2_000)

print(f"empty list header: {EMPTY} bytes")
print(f"{'length':>8}  {'bytes':>8}  {'slots':>7}  {'factor':>7}")
slots = []
for index, (length, size) in enumerate(ladder[:14]):
    capacity = (size - EMPTY) // POINTER
    slots.append(capacity)
    factor = capacity / slots[index - 1] if index and slots[index - 1] else float("nan")
    print(f"{length:>8}  {size:>8}  {capacity:>7}  "
          f"{factor if factor == factor else 0:>7.3f}")

all_slots = [(sys.getsizeof([]) and (size - EMPTY) // POINTER) for _, size in ladder]
factors = [b / a for a, b in zip(all_slots, all_slots[1:]) if a]
steady = factors[3:]
mean_factor = sum(steady) / len(steady)

print(f"\nreallocations over 2,000 appends: {len(ladder)}")
print(f"mean growth factor after the first few: {mean_factor:.3f}")

checkpoint("growth is geometric, not additive",
           1.05 < mean_factor < 1.5,
           f"{mean_factor:.3f} — a constant bump would need hundreds of steps")
checkpoint("and the factor is NOT 2",
           mean_factor < 1.5,
           "doubling is the textbook illustration, not this implementation")

# %%
resolve(
    "A list grows by reallocating. Each reallocation multiplies its capacity by "
    "roughly what factor — 2, or something else?",
    "diverged",  # matched / diverged / partial
)

# %%
reveal(
    "A list grows by reallocating. Each reallocation multiplies its capacity by "
    "roughly what factor — 2, or something else?",
    """
    About 1.125, not 2.

    CPython grows a list by roughly `new = length + (length >> 3) + constant` —
    an eighth more, plus a small fixed amount. That is geometric, so the
    amortized argument holds, but the factor is nowhere near the doubling that
    textbooks use to illustrate it.

    Two facts sit on top of each other here, and telling them apart is the whole
    session:

    - **Geometric growth is the load-bearing property.** Any factor strictly
      above 1 makes the total copy work linear and the amortized cost constant.
      This is what the guarantee actually needs, and it would survive a change to
      1.5 or 2.
    - **The factor 1.125 is not a guarantee.** It is one implementation's
      arithmetic. Nothing documents it, another interpreter may choose
      differently, and a future CPython may retune it. Writing code whose
      correctness or performance depends on it is depending on an accident.

    A smaller factor trades space for time: less slack memory per list, more
    reallocations. Doubling wastes up to half the allocation and reallocates
    less often. Neither is obviously right, which is exactly why it is a tuning
    decision rather than a specification.

    Note also what the ladder is measured in. Dividing by pointer size converts
    bytes to **slots**, and slots are the unit the growth policy operates on. The
    byte figures include a fixed header that would otherwise distort the early
    factors — the same reason the mean skips the first few steps, where the
    constant term dominates the multiplicative one.
    """,
)

# %% [markdown]
# ## 3. Recognize — portable or not?

# %%
STATEMENTS = {
    "a": "Appending to a list is amortized constant time.",
    "b": "A list's capacity grows by about one eighth on each reallocation.",
    "c": "A list stores pointers, so capacity is counted in pointer-sized slots.",
    "d": "sys.getsizeof([]) returns the same number on every Python build.",
}
for key, text in STATEMENTS.items():
    print(f"{key}. {text}")


def is_portable(key: str) -> bool:
    """True when the statement is a language-level guarantee rather than an
    observation about this interpreter."""
    raise NotImplementedError("Classify each statement")


# %%
check("is_portable", is_portable,
      [(("a",), True), (("b",), False), (("c",), False), (("d",), False)])
print()
print("(c) is the interesting one: it is true here and it is a representation")
print("choice, not a language rule. A list is a sequence; nothing requires a")
print("contiguous pointer array.")

# %% [markdown]
# ## 4. What a constant-bump policy would cost

# %%
def reallocations_for(policy, appends: int) -> int:
    capacity, count = 0, 0
    for length in range(1, appends + 1):
        if length > capacity:
            capacity = policy(capacity)
            count += 1
    return count


geometric = reallocations_for(lambda c: max(4, int(c * 1.125) + 6), 2_000)
constant = reallocations_for(lambda c: c + 8, 2_000)

print(f"reallocations over 2,000 appends")
print(f"  observed (CPython)      : {len(ladder)}")
print(f"  modelled geometric 1.125: {geometric}")
print(f"  modelled constant +8    : {constant}")

checkpoint("a constant bump needs far more reallocations",
           constant > len(ladder) * 5,
           "which is what turns amortized constant into amortized linear")

# %% [markdown]
# ## 5. The evidence card

# %%
CARD = """
The observed capacity sequence, in slots:
The portable claim it supports:
The non-portable observation it also produced, and why I will not rely on it:
What would change if the factor were 2 instead:
"""
print(CARD)

# %%
claim("DEFINITION / MODEL", CARD)

claim(
    "CPYTHON OBSERVATION",
    f"Over 2,000 appends the list reallocated {len(ladder)} times with a mean "
    f"capacity factor of {mean_factor:.3f} — geometric, and well below the "
    f"doubling used to illustrate the amortized argument.",
    support={"reallocations": len(ladder), "meanFactor": mean_factor,
             "firstSlots": all_slots[:10], "emptyHeaderBytes": EMPTY},
)

claim(
    "COURSE MODEL",
    f"A constant-bump growth policy modelled over the same 2,000 appends needs "
    f"{constant} reallocations against {geometric} for a geometric one, which is "
    f"the difference between amortized constant and amortized linear appending.",
    support={"observed": len(ladder), "geometricModel": geometric,
             "constantModel": constant},
)

non_claim(
    "The 1.125 factor is an observation of one interpreter on one build, not a "
    "documented behaviour. The slot conversion assumes 8-byte pointers, which is "
    "a property of this build. And this bench measures capacity, not time — what "
    "the geometric policy costs in copies is `m05-s4`'s question, not this one's."
)

emit()

# %% [markdown]
# ## 6. Transfer
#
# 1. Two facts came from one measurement, and only one is portable. Write the
#    rule for separating them in a report.
# 2. The factor could be 2 without changing the guarantee. Name what *would*
#    change, and who would notice.
# 3. Bench `m05-s4` measured copies per append on the same object. State the
#    question each bench answers, in one sentence each.
#
# ---
#
# ## Attributions
#
# Authored for this course. Module 6 has no checked-in reference model.
# Deliberately complements `m05-s4`: that bench measures amortized cost, this one
# measures the capacity policy that makes the amortization work.
