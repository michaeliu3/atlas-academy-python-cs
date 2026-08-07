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
# # Bench m08-s4 — qualified-cost card
#
# **Session 8.4 — Cost without overclaiming.** Rungs: **recognize** (primary),
# trace.
#
# "Dictionary lookup is O(1)" is true under an assumption nobody states. This
# bench builds keys that violate it and watches the constant-time claim
# straighten into a line with slope 1.
#
# **Requires:** Python 3.12+, matplotlib.

# %%
from _fixture import EQ_CALLS, CollisionKey  # noqa: E402

import sys  # noqa: E402

from atlas_bench import (  # noqa: E402
    bench, check, checkpoint, claim, classify_growth, emit, growth_ratios,
    measure, non_claim, predict, resolve, reveal,
)

assert sys.version_info >= (3, 12)

bench(module=8, session=4, emits="qualified-cost card",
      rungs=["recognize", "trace"])

# %% [markdown]
# ## 1. Two dictionaries, same size, different keys

# %%
SIZES = [250, 500, 1000, 2000]

normal = {n: {i: i for i in range(n)} for n in SIZES}
colliding = {n: {CollisionKey(i): i for i in range(n)} for n in SIZES}

print(f"built dictionaries of sizes {SIZES}")
print(f"every CollisionKey hashes to {hash(CollisionKey(0))}")

# %%
predict(
    "Dictionary lookup is described as expected constant time. If every key "
    "hashes to the same bucket, what happens to lookup cost as n grows?",
    answer="",  # <- fill in
    confidence="",  # sure / fairly sure / guessing
)

# %% [markdown]
# ## 2. Trace — count equality calls per lookup

# %%
print(f"{'n':>6}  {'__eq__ calls for the last key':>30}")
eq_counts = []
for n in SIZES:
    EQ_CALLS.clear()
    _ = colliding[n][CollisionKey(n - 1)]
    eq_counts.append(len(EQ_CALLS))
    print(f"{n:>6}  {len(EQ_CALLS):>30,}")

ratios = [b / a for a, b in zip(eq_counts, eq_counts[1:])]
print(f"\ndoubling ratios of equality calls: {[f'{r:.2f}' for r in ratios]}")

checkpoint("equality calls grow with n",
           eq_counts[-1] > eq_counts[0] * 4)
checkpoint("and roughly double when n doubles",
           all(1.5 < r < 2.5 for r in ratios),
           "linear probing through every colliding key")

# %% [markdown]
# ### And in wall-clock time

# %%
# A FIXED number of lookups per measurement, independent of n. A single lookup
# is far below the clock's resolution, and timing one would classify noise.
# Holding the count fixed means total time tracks per-lookup cost directly.
LOOKUPS = 300


def time_normal(n: int) -> None:
    table = normal[n]
    for i in range(LOOKUPS):
        table[i % n]


def time_colliding(n: int) -> None:
    table = colliding[n]
    probe = CollisionKey(n - 1)
    for _ in range(LOOKUPS):
        table[probe]


normal_times = measure(time_normal, SIZES, repeats=20)
colliding_times = measure(time_colliding, SIZES, repeats=3)

print(f"{LOOKUPS} lookups per measurement")
print(f"{'n':>6}  {'int keys (us)':>14}  {'colliding keys (us)':>20}")
for n, a, b in zip(SIZES, normal_times, colliding_times):
    print(f"{n:>6}  {a * 1e6:>14.1f}  {b * 1e6:>20.1f}")

print(f"\nint keys       -> {classify_growth(SIZES, normal_times)}")
print(f"colliding keys -> {classify_growth(SIZES, colliding_times)}")

normal_ratio = normal_times[-1] / normal_times[0]
colliding_ratio = colliding_times[-1] / colliding_times[0]
print(f"\nn grew 8x. int-key time grew {normal_ratio:.1f}x; "
      f"colliding-key time grew {colliding_ratio:.1f}x")

checkpoint("integer-key lookup barely moves as n grows 8x",
           normal_ratio < 2.0, f"{normal_ratio:.1f}x")
checkpoint("colliding-key lookup grows with n",
           colliding_ratio > 4.0, f"{colliding_ratio:.1f}x")

# %%
resolve(
    "Dictionary lookup is described as expected constant time. If every key "
    "hashes to the same bucket, what happens to lookup cost as n grows?",
    "matched",  # matched / diverged / partial
)

# %%
reveal(
    "Dictionary lookup is described as expected constant time. If every key "
    "hashes to the same bucket, what happens to lookup cost as n grows?",
    """
    It becomes linear. The equality-call count doubles when n doubles, and the
    timing follows.

    The O(1) claim rests on an assumption that is almost never written down
    beside it: **hashes are well distributed over the table**. When they are, a
    lookup probes a constant number of slots regardless of how many keys exist.
    When every key hashes to 0, a lookup walks the whole probe chain and compares
    against every colliding key in turn — which is a linear scan with extra steps.

    Nothing here is a defect in the dictionary. The implementation behaves exactly
    as specified; the specification was conditional and the condition was
    violated. That is the difference between a bug and an unstated assumption, and
    the session's declared output is a *qualified* cost card because the
    qualification is the content.

    A complete cost claim needs four parts:

    - the **operation** — lookup;
    - the **bound** — constant;
    - the **case** — expected, not worst;
    - the **assumption** — hashes distribute; equality is cheap; the key's hash is
      stable while stored.

    Drop the fourth and you have a claim that cannot be falsified by any input,
    because every counterexample gets dismissed as "unrealistic". Keep it and the
    claim becomes checkable — which is exactly what this bench did.

    The adversarial case is not hypothetical either. Hash-collision denial of
    service works precisely by supplying keys chosen to collide, which is why
    Python randomises string hashing per process. Module 22 owns that thread; the
    part that belongs here is that the cost model has a precondition an attacker
    can choose to violate.
    """,
)

# %% [markdown]
# ## 3. Recognize — qualify four claims

# %%
CLAIMS = {
    "a": "Dictionary lookup is O(1).",
    "b": "Dictionary lookup is expected O(1) when hashes distribute well.",
    "c": "Dictionary lookup is worst-case O(1).",
    "d": "Dictionary lookup is O(1) in the number of keys, given cheap equality "
         "and well-distributed hashes.",
}
for key, text in CLAIMS.items():
    print(f"{key}. {text}")


def is_well_qualified(key: str) -> bool:
    """True when the claim states enough to be checkable."""
    raise NotImplementedError("Judge each claim")


# %%
check("is_well_qualified", is_well_qualified,
      [(("a",), False), (("b",), True), (("c",), False), (("d",), True)])
print()
print("(c) is not merely unqualified — it is false, as the measurements show.")

# %% [markdown]
# ## 4. The cost card

# %%
COST_CARD = """
Operation:
Bound:
Case (best / worst / expected / amortized):
Assumptions, listed so each could be violated by a specific input:
The input that violates the one I consider most fragile:
"""
print(COST_CARD)

# %%
claim("COURSE MODEL", COST_CARD)

claim(
    "FINITE EXPERIMENT",
    f"With every key hashing to the same bucket, equality calls per lookup grew "
    f"{eq_counts} across n = {SIZES} — roughly doubling with n — and measured "
    f"lookup classified as {classify_growth(SIZES, colliding_times)} against "
    f"{classify_growth(SIZES, normal_times)} for integer keys.",
    support={"sizes": SIZES, "equalityCalls": eq_counts, "ratios": ratios,
             "normalSeconds": normal_times, "collidingSeconds": colliding_times},
)

non_claim(
    "This measures one adversarial hash function against one benign one. It shows "
    "the constant-time claim is conditional, not that any real key distribution "
    "approaches this case, and not what CPython's collision handling costs in "
    "general — the probe strategy and resize policy are implementation details "
    "this bench does not read."
)

emit()

# %% [markdown]
# ## 5. Transfer
#
# 1. The dictionary was not defective and the claim was still wrong. State the
#    general distinction.
# 2. Your cost card lists assumptions. Name which of them an attacker controls.
# 3. Bench `m05-s2` audits underspecified performance statements. Which of the
#    four claims above would it have flagged, and on what grounds?
#
# ---
#
# ## Attributions
#
# Authored for this course. Module 8 has no checked-in reference model.
