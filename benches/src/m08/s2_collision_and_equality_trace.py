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
# # Bench m08-s2 — collision-and-equality trace
#
# **Session 8.2 — Hashing, collisions, and equality.** Rungs: **trace**
# (primary), map.
#
# Open addressing resolves a collision by probing onward. Deletion therefore has
# a subtlety that looks like an implementation detail and is actually a
# correctness requirement: clearing a slot severs the chain that other keys are
# standing on.
#
# The bench searches for the smallest sequence that exposes it.
#
# **Requires:** Python 3.12+. Standard library only.

# %%
from _fixture import EMPTY, TOMBSTONE, FixedHash, OpenAddressed  # noqa: E402

import sys  # noqa: E402
from itertools import permutations  # noqa: E402

from atlas_bench import (  # noqa: E402
    bench, check, checkpoint, claim, emit, non_claim, predict, resolve, reveal,
)

assert sys.version_info >= (3, 12)

bench(module=8, session=2, emits="collision-and-equality trace",
      rungs=["trace", "map"])

# %% [markdown]
# ## 1. Three keys, one bucket

# %%
A, B, C = FixedHash(3, "a"), FixedHash(3, "b"), FixedHash(3, "c")

table = OpenAddressed(capacity=8)
for key in (A, B, C):
    table.insert(key)

print(f"all three hash to bucket {hash(A) % 8}")
print(f"slots: {[('EMPTY' if s is EMPTY else 'TOMB' if s is TOMBSTONE else s) for s in table.slots]}")
print(f"all three found: {[table.contains(k) for k in (A, B, C)]}")

checkpoint("collisions are resolved by probing onward",
           all(table.contains(k) for k in (A, B, C)),
           "three keys, one bucket, all reachable")

# %%
predict(
    "Delete the FIRST of the three colliding keys by writing an empty marker into "
    "its slot. Are the other two still findable?",
    answer="",  # <- fill in
    confidence="",  # sure / fairly sure / guessing
)

# %% [markdown]
# ## 2. Trace — delete the middle of a probe chain

# %%
wrong = OpenAddressed(capacity=8)
for key in (A, B, C):
    wrong.insert(key)
wrong.delete_wrong(A)

right = OpenAddressed(capacity=8)
for key in (A, B, C):
    right.insert(key)
right.delete_right(A)


def render(t: OpenAddressed) -> list[str]:
    return ["EMPTY" if s is EMPTY else "TOMB" if s is TOMBSTONE else str(s)
            for s in t.slots]


print(f"{'':>18}  {'slots':<52}  found B, C")
print(f"{'clears the slot':>18}  {str(render(wrong)):<52}  "
      f"{[wrong.contains(k) for k in (B, C)]}")
print(f"{'writes a tombstone':>18}  {str(render(right)):<52}  "
      f"{[right.contains(k) for k in (B, C)]}")

checkpoint("clearing the slot loses the other two keys",
           not wrong.contains(B) and not wrong.contains(C),
           "they are still in the table and unreachable")
checkpoint("the tombstone keeps them findable",
           right.contains(B) and right.contains(C))
checkpoint("the deleted key is gone either way",
           not wrong.contains(A) and not right.contains(A))

# %%
resolve(
    "Delete the FIRST of the three colliding keys by writing an empty marker into "
    "its slot. Are the other two still findable?",
    "diverged",  # matched / diverged / partial
)

# %%
reveal(
    "Delete the FIRST of the three colliding keys by writing an empty marker into "
    "its slot. Are the other two still findable?",
    """
    No. Both become unreachable, while remaining in the table.

    Lookup in an open-addressed table probes forward from the key's bucket and
    **stops at the first genuinely empty slot** — that is the only signal that
    says "this key was never inserted, stop looking". Keys B and C were placed
    further along the chain precisely because A's slot was taken. Clearing A's
    slot puts an early stop signal in front of them, so the probe halts before
    reaching either one.

    The tombstone exists to say something the empty marker cannot: *nothing lives
    here now, but keep going, because something might live further along.* It is a
    third state, and the table needs all three:

    - **empty** — never used; a probe may stop.
    - **occupied** — holds a key; compare and continue if it does not match.
    - **tombstone** — was used and is not now; a probe must continue, and an
      insert may reuse the slot.

    Two general points worth carrying:

    - **Deletion is where open addressing gets hard.** Insert and lookup are
      straightforward. It is removal that has to preserve a property — probe-chain
      continuity — that nothing in the deleted key's own state records.
    - **The damage is invisible locally.** After `delete_wrong(A)` the table is
      internally consistent: every slot holds a legal value, the count could be
      adjusted correctly, and A is genuinely gone. What broke is a relationship
      *between* slots, and no single-slot check can see it.

    That is also why tombstones are not free. They accumulate, they lengthen probe
    chains, and a table full of them degrades toward linear scanning — which is
    why real implementations compact or resize rather than tombstoning forever.
    """,
)

# %% [markdown]
# ## 3. Trace — search for the smallest failing sequence

# %%
def sequence_fails(order: tuple, deleted, capacity: int = 8) -> bool:
    """Insert in `order`, delete `deleted` with the wrong strategy, then check
    every surviving key is still findable."""
    t = OpenAddressed(capacity=capacity)
    for key in order:
        t.insert(key)
    t.delete_wrong(deleted)
    return any(not t.contains(k) for k in order if k is not deleted)


smallest = None
for size in (1, 2, 3):
    keys = [A, B, C][:size]
    for order in permutations(keys):
        for deleted in order:
            if sequence_fails(order, deleted):
                smallest = (size, [str(k) for k in order], str(deleted))
                break
        if smallest:
            break
    if smallest:
        break

print(f"smallest failing sequence: {smallest}")

two_key_failures = [
    (tuple(str(k) for k in order), str(deleted))
    for order in permutations([A, B])
    for deleted in order
    if sequence_fails(order, deleted)
]
one_key_failures = [
    (str(k),) for k in (A,) if sequence_fails((k,), k)
]
print(f"one-key failures: {one_key_failures or 'none'}")
print(f"two-key failures: {two_key_failures}")

checkpoint("one key is not enough",
           len(one_key_failures) == 0,
           "with nothing behind it, clearing the slot severs no chain")
checkpoint("two colliding keys ARE enough",
           smallest is not None and smallest[0] == 2,
           f"{smallest[1]}, deleting {smallest[2]}")
checkpoint("and it fails whichever of the two was inserted first",
           len(two_key_failures) == 2,
           "the earlier key's slot is the one the later key probes through")

# %% [markdown]
# ## 4. Map — the three slot states

# %%
BEHAVIOURS = {
    "a": "A probe reaching this slot may stop and report 'not found'.",
    "b": "A probe reaching this slot must compare and continue if it does not match.",
    "c": "An insert may place a new key in this slot.",
    "d": "This slot currently holds a live key.",
}
for key, text in BEHAVIOURS.items():
    print(f"{key}. {text}")


def holds_for_tombstone(key: str) -> bool:
    """True when the behaviour applies to a tombstone slot."""
    raise NotImplementedError("Map the tombstone's behaviour")


# %%
check("holds_for_tombstone", holds_for_tombstone,
      [(("a",), False), (("b",), True), (("c",), True), (("d",), False)])
print()
print("The tombstone shares (c) with empty and (b) with occupied, and matches")
print("neither completely — which is why two states are not enough.")

# %% [markdown]
# ## 5. The trace

# %%
COLLISION_TRACE = """
How a collision is resolved, in one sentence:
What a probe uses as its stop signal:
Why deleting by clearing breaks keys that were never touched:
The three slot states, and the behaviour each must produce:
What tombstones cost, and what real tables do about it:
"""
print(COLLISION_TRACE)

# %%
claim("DEFINITION / MODEL", COLLISION_TRACE)

claim(
    "COUNTEREXAMPLE",
    f"With three keys colliding in one bucket, deleting the first by clearing its "
    f"slot makes the other two unreachable while they remain in the table; "
    f"writing a tombstone instead keeps both findable. The smallest failing "
    f"sequence needs only {smallest[0]} colliding keys, and fails whichever was "
    f"inserted first.",
    support={"smallestFailing": smallest, "twoKeyFailures": two_key_failures,
             "wrongSlots": render(wrong), "rightSlots": render(right)},
)

non_claim(
    "This is a fixed-capacity table with linear probing and no resize. It shows "
    "why deletion needs a third slot state; it says nothing about how CPython's "
    "dict actually handles deletion, about quadratic or double-hashing probe "
    "sequences, or about when tombstone accumulation forces a rebuild."
)

emit()

# %% [markdown]
# ## 6. Transfer
#
# 1. The table was internally consistent and wrong. State what kind of property
#    a per-slot check cannot verify.
# 2. One key never failed and two always could. Explain why the minimum is two,
#    in terms of what stands behind the cleared slot.
# 3. Bench `m08-s4` measures the cost of collisions. State how tombstone
#    accumulation would show up in that measurement.
#
# ---
#
# ## Attributions
#
# Authored for this course. Module 8 has no checked-in reference model.
