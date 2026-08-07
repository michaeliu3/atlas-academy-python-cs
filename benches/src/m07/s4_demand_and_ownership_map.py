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
# # Bench m07-s4 — demand-and-ownership map
#
# **Session 7.4 — Lazy pipelines and ownership.** Rungs: **debug and defend**
# (primary), map.
#
# Laziness buys bounded memory. It does not buy ownership, and the two get
# conflated: a pipeline that hands out the batch it is holding is lazy and
# unsafe at the same time.
#
# **Requires:** Python 3.12+. Standard library only.

# %%
from _fixture import batches, ingest_eager, ingest_lazy  # noqa: E402

import sys  # noqa: E402

from atlas_bench import (  # noqa: E402
    bench, check, checkpoint, claim, emit, non_claim, peak_memory, predict,
    resolve, reveal,
)

assert sys.version_info >= (3, 12)

bench(module=7, session=4, emits="demand-and-ownership map",
      rungs=["debug-and-defend", "map"])

# %% [markdown]
# ## 1. Map — what each pipeline retains

# %%
COUNT, SIZE = 400, 200


def consume_eager() -> int:
    source = (list(b) for b in batches(COUNT, SIZE))
    return sum(len(b) for b in ingest_eager(source))


def consume_lazy() -> int:
    source = (list(b) for b in batches(COUNT, SIZE))
    return sum(len(b) for b in ingest_lazy(source))


eager_peak = peak_memory(consume_eager)
lazy_peak = peak_memory(consume_lazy)

print(f"eager peak traced memory: {eager_peak:>12,} bytes")
print(f"lazy  peak traced memory: {lazy_peak:>12,} bytes")
print(f"ratio                   : {eager_peak / lazy_peak:>12.1f}x")

checkpoint("the lazy pipeline peaks lower", lazy_peak < eager_peak)
checkpoint("and the difference is large",
           eager_peak / lazy_peak > 2,
           f"{eager_peak / lazy_peak:.1f}x")

# %%
predict(
    "The lazy pipeline yields each batch instead of copying it. Does the consumer "
    "own the batch it receives?",
    answer="",  # <- fill in
    confidence="",  # sure / fairly sure / guessing
)

# %% [markdown]
# ## 2. Debug — mutate what was delivered

# %%
stored: list[list[int]] = [[1, 2, 3], [4, 5, 6]]


def lazy_source():
    """Hands out the stored batch itself."""
    for batch in stored:
        yield batch


def copying_source():
    """Hands out a copy the consumer owns."""
    for batch in stored:
        yield list(batch)


results = {}
for name, source in (("lazy_source", lazy_source), ("copying_source", copying_source)):
    stored[:] = [[1, 2, 3], [4, 5, 6]]
    delivered = next(iter(source()))
    delivered.append(999)                    # the consumer edits what it got
    results[name] = {
        "consumer_saw": list(delivered),
        "producer_now": [list(b) for b in stored],
        "leaked": stored[0] == delivered,
    }
    print(f"{name:>16}: producer's first batch is now {results[name]['producer_now'][0]}")

checkpoint("the non-copying pipeline leaks its internal state",
           results["lazy_source"]["leaked"],
           "the consumer's append changed the producer's list")
checkpoint("the copying pipeline does not",
           not results["copying_source"]["leaked"])

# %%
resolve(
    "The lazy pipeline yields each batch instead of copying it. Does the consumer "
    "own the batch it receives?",
    "matched",  # matched / diverged / partial
)

# %%
reveal(
    "The lazy pipeline yields each batch instead of copying it. Does the consumer "
    "own the batch it receives?",
    """
    No. It receives a reference to the producer's own list, and editing it edits
    the producer's state.

    These are two independent properties that a lazy pipeline is routinely
    assumed to bundle:

    - **Demand** — how much work is done before the consumer asks for it. The
      lazy version peaks far below the eager one because it never has all the
      batches alive at once. That is real and it is what laziness buys.
    - **Ownership** — who may modify the delivered object. Laziness says nothing
      about this. Yielding the internal list is *cheaper* than copying it, and
      cheapness is exactly why the mistake gets made.

    So "lazy" and "safe to hand out" are orthogonal, and the pipeline above is the
    quadrant people forget exists: bounded memory and shared mutable state.

    The repair is a copy at the boundary, and it costs something — the copying
    pipeline gives up part of the memory advantage that motivated laziness in the
    first place. That is the actual trade, and naming it is the session's work:
    you are choosing between the producer's memory and the consumer's freedom,
    and there is no configuration where both are free.

    An alternative is to change the contract rather than the code: yield a tuple,
    or document that the delivered batch is borrowed and must not be retained or
    modified. That costs nothing at runtime and moves the obligation to the
    consumer — which is a legitimate design, provided it is written down.
    """,
)

# %% [markdown]
# ## 3. Debug and defend — the cost of the repair

# %%
def consume_lazy_copying() -> int:
    source = (list(b) for b in batches(COUNT, SIZE))
    return sum(len(list(b)) for b in ingest_lazy(source))


copying_peak = peak_memory(consume_lazy_copying)
print(f"lazy, no copy   : {lazy_peak:>12,} bytes")
print(f"lazy, copying   : {copying_peak:>12,} bytes")
print(f"eager           : {eager_peak:>12,} bytes")

checkpoint("copying costs something",
           copying_peak >= lazy_peak)
checkpoint("but far less than going eager",
           copying_peak < eager_peak,
           "the trade is real and it is not all-or-nothing")

DEFENCE = """
What laziness bought, as a measured number:
What it did not buy:
The two repairs available, and what each costs:
The contract I would write if I chose not to copy:
"""
print(DEFENCE)

# %% [markdown]
# ## 4. Map — four pipeline properties

# %%
PROPERTIES = {
    "a": "Peak memory is bounded independently of the number of batches.",
    "b": "The consumer may safely retain a delivered batch.",
    "c": "The consumer may safely modify a delivered batch.",
    "d": "Work is performed only when the consumer asks for it.",
}
for key, text in PROPERTIES.items():
    print(f"{key}. {text}")


def holds_for_lazy_source(key: str) -> bool:
    """True when the non-copying lazy pipeline has that property."""
    raise NotImplementedError("Map each property")


# %%
check("holds_for_lazy_source", holds_for_lazy_source,
      [(("a",), True), (("b",), False), (("c",), False), (("d",), True)])
print()
print("(a) and (d) are what laziness gives. (b) and (c) are ownership, and the")
print("pipeline provides neither.")

# %% [markdown]
# ## 5. The map

# %%
claim("DEFENDED REPAIR", DEFENCE)

claim(
    "FINITE EXPERIMENT",
    f"Eager ingestion peaked at {eager_peak:,} traced bytes against "
    f"{lazy_peak:,} for the lazy pipeline ({eager_peak / lazy_peak:.1f}x). The "
    f"lazy pipeline delivers its internal list: a consumer's append changed the "
    f"producer's batch from [1, 2, 3] to "
    f"{results['lazy_source']['producer_now'][0]}.",
    support={"eagerPeak": eager_peak, "lazyPeak": lazy_peak,
             "copyingPeak": copying_peak, "ownership": results},
)

non_claim(
    "tracemalloc counts Python allocations only, so these peaks compare the two "
    "pipelines against each other and support no absolute memory claim. The "
    "ownership result is about one delivery of one mutable batch; an immutable "
    "payload would make the question disappear rather than answer it."
)

emit()

# %% [markdown]
# ## 6. Transfer
#
# 1. Laziness and ownership turned out to be independent. Name another pair of
#    properties in this course that get bundled in the same way.
# 2. Yielding a tuple would remove the problem. Explain what it costs and who pays.
# 3. Bench `m01-s4` found a store aliasing its caller's data. State what both
#    benches say about where a copy belongs.
#
# ---
#
# ## Attributions
#
# Authored for this course. Module 7 has no checked-in reference model.
