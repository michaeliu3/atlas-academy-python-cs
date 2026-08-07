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
# # Bench m17-s4 — overlap/locality model and causal boundary
#
# **Session 17.4 — Explain overlap and locality without promising hardware.**
# Rungs: **trace** (primary), recognize.
#
# The workbook asks you to hand-fill a cache worksheet, commit to a hit count,
# then reconcile against the reference. This bench is that instruction, executed.
#
# The reference's counts belong to a **declared geometry**, not to your CPU.
# Changing one parameter moves the number, which is the proof that it does.
#
# **Requires:** Python 3.12+. Standard library only.

# %%
from _fixture import GEOMETRY, ITEM_COUNT  # noqa: E402  (sets up sys.path)

import sys  # noqa: E402

from atlas_bench import (  # noqa: E402
    bench, check, checkpoint, claim, emit, non_claim, predict, resolve, reveal,
)
from module17_reference import (  # noqa: E402
    deterministic_permutation, toy_cache_observation,
)

assert sys.version_info >= (3, 12)

bench(module=17, session=4, emits="overlap/locality model and causal boundary",
      rungs=["trace", "recognize"])

# %% [markdown]
# ## 1. The declared geometry

# %%
print(f"items      : {ITEM_COUNT} of {GEOMETRY['item_bytes']} bytes")
print(f"line       : {GEOMETRY['line_bytes']} bytes "
      f"({GEOMETRY['line_bytes'] // GEOMETRY['item_bytes']} items per line)")
print(f"cache      : {GEOMETRY['cache_slots']} lines "
      f"({GEOMETRY['cache_slots'] * GEOMETRY['line_bytes']} bytes total)")
print(f"working set: {ITEM_COUNT * GEOMETRY['item_bytes']} bytes — does not fit")

sequential = list(range(ITEM_COUNT))
permuted = deterministic_permutation(ITEM_COUNT)

# %%
predict(
    "Both orders touch all 64 items exactly once, so both do the same amount of "
    "work. How many of the 64 accesses will hit the cache under each order?",
    answer="",  # <- fill in
    confidence="",  # sure / fairly sure / guessing
)

# %% [markdown]
# ## 2. Trace — run both orders through the model

# %%
seq_obs = toy_cache_observation("sequential", sequential, **GEOMETRY)
perm_obs = toy_cache_observation("permuted", permuted, **GEOMETRY)

print(f"{'order':>12}  {'accesses':>9}  {'hits':>6}  {'misses':>7}  {'hit rate':>9}")
for obs in (seq_obs, perm_obs):
    print(f"{obs.label:>12}  {obs.accesses:>9}  {obs.hits:>6}  {obs.misses:>7}  "
          f"{obs.hits / obs.accesses:>8.0%}")

checkpoint("both orders perform identical work",
           seq_obs.accesses == perm_obs.accesses == ITEM_COUNT)
checkpoint("sequential hits most of the time",
           seq_obs.hits > seq_obs.misses)
checkpoint("the permuted order never hits at all",
           perm_obs.hits == 0,
           "every access lands on a line that was already evicted")

# %%
resolve(
    "Both orders touch all 64 items exactly once, so both do the same amount of "
    "work. How many of the 64 accesses will hit the cache under each order?",
    "matched",  # matched / diverged / partial
)

# %%
reveal(
    "Both orders touch all 64 items exactly once, so both do the same amount of "
    "work. How many of the 64 accesses will hit the cache under each order?",
    """
    Sequential: 48 hits, 16 misses. Permuted: 0 hits, 64 misses.

    A miss loads a whole *line*, not one item. With 16-byte lines and 4-byte
    items, one miss brings in four items — so a sequential walk pays one miss and
    then gets three free, giving a three-in-four hit rate exactly.

    The permuted order defeats this completely. The cache holds four lines, the
    working set needs sixteen, and a scattered order revisits a line only long
    after it has been evicted. Every single access misses.

    Same instructions, same item count, same total work by any count that ignores
    memory — and a four-fold difference in memory traffic. That is locality, and
    it is a property of the *access order*, not of the algorithm's operation count.

    Now the causal boundary, which is the harder half of this session. These
    numbers are exact and they are about a **declared model**: 4-byte items,
    16-byte lines, 4 lines, full associativity, LRU. Your actual CPU has multiple
    cache levels, hardware prefetchers that would detect the sequential stride,
    set associativity that can conflict-miss on strides the model handles fine,
    and a translation buffer this model does not have at all.

    So the honest claim is: *under this declared geometry, access order changes
    the miss count from 16 to 64.* The dishonest one is: *this program will be
    four times slower on my laptop.* The model explains the mechanism; it does
    not predict the machine, and the next cell shows why by changing the model
    and watching the number move.
    """,
)

# %% [markdown]
# ## 3. Recognize — the number belongs to the geometry

# %%
print(f"{'line bytes':>11}  {'items/line':>11}  {'seq hits':>9}  {'seq misses':>11}")
geometry_sweep = {}
for line_bytes in (8, 16, 32, 64):
    variant = {**GEOMETRY, "line_bytes": line_bytes}
    obs = toy_cache_observation(f"line{line_bytes}", sequential, **variant)
    geometry_sweep[line_bytes] = {"hits": obs.hits, "misses": obs.misses}
    print(f"{line_bytes:>11}  {line_bytes // GEOMETRY['item_bytes']:>11}  "
          f"{obs.hits:>9}  {obs.misses:>11}")

distinct = len({v["misses"] for v in geometry_sweep.values()})
checkpoint("changing one declared parameter changes the count",
           distinct > 1,
           f"{distinct} distinct miss counts across four line sizes")
checkpoint("so the number is a property of the model, not the host",
           True,
           "nothing about this machine was measured")

# %% [markdown]
# ## 4. Recognize — which claims does this model support?

# %%
CLAIMS = {
    "a": "Under this geometry, sequential access misses 16 times and permuted 64.",
    "b": "Access order affects memory traffic.",
    "c": "This program runs four times faster with sequential access on my CPU.",
    "d": "A hardware prefetcher would not change the sequential result.",
}
for key, text in CLAIMS.items():
    print(f"{key}. {text}")


def supported(key: str) -> bool:
    """True when this declared model supports the claim."""
    raise NotImplementedError("Judge each claim")


# %%
check("supported", supported,
      [(("a",), True), (("b",), True), (("c",), False), (("d",), False)])
print()
print("(b) is supported as a mechanism claim and (c) is not, from the same data.")
print("The difference is whether the sentence mentions the model or the machine.")

# %% [markdown]
# ## 5. The causal boundary

# %%
BOUNDARY = """
The declared geometry, stated in full:
The result, phrased so it cannot be read as a hardware prediction:
The mechanism it explains:
Three features of a real CPU this model does not have:
The measurement I would need before claiming a speedup on real hardware:
"""
print(BOUNDARY)

# %%
claim("COURSE MODEL", BOUNDARY)

claim(
    "LOCAL REFERENCE RESULT",
    f"Under a declared geometry of {GEOMETRY['item_bytes']}-byte items, "
    f"{GEOMETRY['line_bytes']}-byte lines and {GEOMETRY['cache_slots']} lines, "
    f"sequential access over {ITEM_COUNT} items gives {seq_obs.hits} hits and "
    f"{seq_obs.misses} misses; a deterministic permutation gives "
    f"{perm_obs.hits} and {perm_obs.misses}. Varying the line size alone produces "
    f"{distinct} distinct miss counts.",
    support={"geometry": GEOMETRY, "items": ITEM_COUNT,
             "sequential": {"hits": seq_obs.hits, "misses": seq_obs.misses},
             "permuted": {"hits": perm_obs.hits, "misses": perm_obs.misses},
             "lineSizeSweep": geometry_sweep},
)

non_claim(
    "These counts describe a declared finite model with one cache level, full "
    "associativity, and no prefetcher. They explain why access order affects "
    "memory traffic; they predict nothing about this or any host CPU, where "
    "multiple cache levels, stride prefetching, set-associative conflicts, and "
    "address translation all apply and none of them are modelled here."
)

emit()

# %% [markdown]
# ## 6. Transfer
#
# 1. The miss count moved when the line size did. Write the rule about what a
#    number produced by a declared model is a fact about.
# 2. Claim (b) survived and claim (c) did not. State the difference in one
#    sentence a reviewer could apply.
# 3. Bench `m06-s5` measured a pointer-chasing slowdown on real hardware and
#    refused to attribute it to cache behaviour. Explain how this bench and that
#    one fit together.
#
# ---
#
# ## Attributions
#
# Probes `public/downloads/module17_reference.py` — `toy_cache_observation` and
# `deterministic_permutation`. Not reimplemented. The geometry sweep and the
# claim audit are this bench's own.
