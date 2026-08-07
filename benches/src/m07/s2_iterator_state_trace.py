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
# # Bench m07-s2 — iterator-state trace
#
# **Session 7.2 — The iterator protocol exposes demand.** Rungs: **review and
# verify** (primary), trace.
#
# Two `take` implementations produce identical output lists. One pulls exactly
# what it yields; the other pulls one item more. Output equality cannot tell them
# apart, and on an expensive or infinite source the difference is the whole design.
#
# **Requires:** Python 3.12+. Standard library only.

# %%
from _fixture import BrokenTake, CountingSource, TakeIterator  # noqa: E402

import sys  # noqa: E402

from atlas_bench import (  # noqa: E402
    bench, check, checkpoint, claim, emit, non_claim, predict, resolve, reveal,
)

assert sys.version_info >= (3, 12)

bench(module=7, session=2, emits="iterator-state trace",
      rungs=["review-and-verify", "trace"])

# %% [markdown]
# ## 1. Identical output

# %%
K = 3
outputs = {}
pulls = {}
for name, cls in (("TakeIterator", TakeIterator), ("BrokenTake", BrokenTake)):
    source = CountingSource(list(range(10)))
    outputs[name] = list(cls(source, K))
    pulls[name] = source.pulls

print(f"taking {K} items from a 10-item source")
for name in outputs:
    print(f"  {name:>14}: output {outputs[name]}   pulls {pulls[name]}")

checkpoint("the two outputs are identical",
           outputs["TakeIterator"] == outputs["BrokenTake"])

# %%
predict(
    "Both produced the same three items. Did both pull the same number of items "
    "from the source?",
    answer="",  # <- fill in
    confidence="",  # sure / fairly sure / guessing
)

# %% [markdown]
# ## 2. Trace — count the pulls

# %%
checkpoint("TakeIterator pulls exactly what it yields",
           pulls["TakeIterator"] == K, f"{pulls['TakeIterator']} pulls for {K} items")
checkpoint("BrokenTake pulls one more",
           pulls["BrokenTake"] == K + 1, f"{pulls['BrokenTake']} pulls for {K} items")

# %%
resolve(
    "Both produced the same three items. Did both pull the same number of items "
    "from the source?",
    "diverged",  # matched / diverged / partial
)

# %%
reveal(
    "Both produced the same three items. Did both pull the same number of items "
    "from the source?",
    """
    No. `TakeIterator` pulls 3; `BrokenTake` pulls 4.

    `BrokenTake` peeks before deciding whether to stop — it fetches the next item
    and only then checks whether it has already yielded enough. The extra item is
    fetched, discarded, and never appears in the output, so the returned list is
    identical and the source has been advanced one step further than the caller
    asked for.

    On a list of ten integers this is invisible and free. The design cost appears
    the moment the source is anything else:

    - **An expensive source** — each pull is a database round trip or a decode.
      One wasted pull per `take` is a real cost that no output assertion reveals.
    - **A shared source** — a second consumer reading the same iterator starts one
      item later than it should, and the item vanishes entirely.
    - **An infinite or blocking source** — the extra pull may not return at all.
      A `take(3)` from a stream that has produced exactly three items so far will
      block on the fourth, having yielded nothing wrong.

    So the protocol's contract is not only *what* comes out but *how much demand*
    goes in. That is what "the iterator protocol exposes demand" means: `__next__`
    is the unit of demand, and counting calls is the only way to see it.

    Output equality is the weakest observation available here, which is the same
    lesson `m01-s4` reaches from ownership and `m02-s5` from repeated calls. Three
    different mechanisms, one conclusion about what a passing equality assertion
    establishes.
    """,
)

# %% [markdown]
# ## 3. Where it actually breaks — a shared source
#
# The extra pull is invisible until somebody else reads the same iterator. Then
# the peeked item is simply gone.

# %%
def two_consumers(cls, k: int):
    """First consumer takes k; the second reads whatever remains."""
    shared = iter(CountingSource(list(range(10))))
    first = list(cls(shared, k))
    second = list(shared)
    return first, second


handoff = {}
for name, cls in (("TakeIterator", TakeIterator), ("BrokenTake", BrokenTake)):
    first, second = two_consumers(cls, K)
    handoff[name] = {"first": first, "second_starts_at": second[0], "second_len": len(second)}
    print(f"{name:>14}: first {first}  then second consumer sees {second}")

lost = (handoff["BrokenTake"]["second_starts_at"]
        - handoff["TakeIterator"]["second_starts_at"])

checkpoint("both first consumers got the same items",
           handoff["TakeIterator"]["first"] == handoff["BrokenTake"]["first"])
checkpoint("but the second consumer starts one item later after BrokenTake",
           lost == 1,
           f"resumes at {handoff['BrokenTake']['second_starts_at']} instead of "
           f"{handoff['TakeIterator']['second_starts_at']}")
checkpoint("and one item is lost entirely",
           handoff["BrokenTake"]["second_len"]
           == handoff["TakeIterator"]["second_len"] - 1,
           "the peeked item was consumed and never delivered to anyone")

# %% [markdown]
# ## 4. Trace — iterable is not iterator

# %%
data = [1, 2, 3]
iter_a, iter_b = iter(data), iter(data)
it = iter(data)

print(f"iter(list) is iter(list) : {iter_a is iter_b}")
print(f"iter(iterator) is itself : {iter(it) is it}")
print(f"next(iter_a), next(iter_b): {next(iter_a)}, {next(iter_b)}")

checkpoint("two iterators over one list are independent objects",
           iter_a is not iter_b)
checkpoint("but an iterator returns itself from __iter__",
           iter(it) is it,
           "which is why a for-loop over an iterator consumes it")

# %% [markdown]
# ## 5. Review and verify — audit four claims

# %%
CLAIMS = {
    "a": "The two implementations are interchangeable.",
    "b": "They produce the same output on a 10-item source.",
    "c": "A test asserting on the output list would distinguish them.",
    "d": "Counting __next__ calls on the source distinguishes them.",
}
for key, text in CLAIMS.items():
    print(f"{key}. {text}")


def supported(key: str) -> bool:
    """True when this bench's evidence supports the claim."""
    raise NotImplementedError("Audit the four claims")


# %%
check("supported", supported,
      [(("a",), False), (("b",), True), (("c",), False), (("d",), True)])

# %% [markdown]
# ## 6. The trace

# %%
STATE_TRACE = """
The demand each implementation places on its source, as a number:
The input on which they stop being interchangeable:
Why an output assertion cannot separate them:
The observation that can:
"""
print(STATE_TRACE)

# %%
claim("REVIEW VERDICT", STATE_TRACE)

claim(
    "COUNTEREXAMPLE",
    f"Two take implementations return identical output "
    f"({outputs['TakeIterator']}) while pulling {pulls['TakeIterator']} and "
    f"{pulls['BrokenTake']} items respectively. On a shared source, a second "
    f"consumer resumes at {handoff['BrokenTake']['second_starts_at']} after "
    f"BrokenTake against {handoff['TakeIterator']['second_starts_at']} after "
    f"TakeIterator, losing one item entirely.",
    support={"outputs": outputs, "pulls": pulls, "sharedSourceHandoff": handoff},
)

non_claim(
    "Pull counts here come from an instrumented in-memory source. They establish "
    "that the two implementations place different demand on a source, not what "
    "that costs for any particular source — a database round trip and a list "
    "index differ by orders of magnitude, and this bench measures neither."
)

emit()

# %% [markdown]
# ## 7. Transfer
#
# 1. Output was equal and behaviour was not. Name the third case, beyond an
#    expensive source and a shared source, where the extra pull is fatal.
# 2. `iter(it) is it` makes a for-loop consume an iterator. State the bug that
#    property makes possible.
# 3. Benches `m01-s4`, `m02-s5`, and this one all end at the same conclusion about
#    equality assertions. Write it once, generally.
#
# ---
#
# ## Attributions
#
# Authored for this course. Module 7 has no checked-in reference model.
