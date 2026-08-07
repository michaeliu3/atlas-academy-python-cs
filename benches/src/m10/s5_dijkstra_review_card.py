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
# # Bench m10-s5 — Dijkstra review card
#
# **Session 10.5 — Dijkstra coordinates heap currency and finalization.** Rungs:
# **review and verify** (primary), trace.
#
# The session's declared output *is* a review verdict. Two claims about a
# lazy-deletion Dijkstra get audited here: that its heap holds at most V entries,
# and that it handles a negative edge by failing loudly.
#
# Neither survives.
#
# **Requires:** Python 3.12+. Standard library only.

# %%
from _fixture import NEGATIVE, WEIGHTED, HeapTrace, dijkstra  # noqa: E402

import sys  # noqa: E402

from atlas_bench import (  # noqa: E402
    bench, check, checkpoint, claim, emit, non_claim, predict, resolve, reveal,
)

assert sys.version_info >= (3, 12)

bench(module=10, session=5, emits="Dijkstra review card",
      rungs=["review-and-verify", "trace"])

# %% [markdown]
# ## 1. The generated claim
#
# An assistant supplies this implementation and asserts:
#
# > "Lazy deletion keeps the heap bounded by the number of vertices, giving
# > O(E log V). Negative edges raise an error."

# %%
trace = HeapTrace()
distances = dijkstra(WEIGHTED, "s", trace)
vertices = len(WEIGHTED)

print(f"graph: {WEIGHTED}")
print(f"shortest distances: {distances}")
print(f"finalization order: {trace.finalized}")
print()
print(f"vertices          : {vertices}")
print(f"heap pushes       : {trace.pushes}")
print(f"heap pops         : {trace.pops}")
print(f"stale pops        : {trace.stale_pops}")
print(f"max occupancy     : {trace.max_occupancy}")

checkpoint("the shortest distance to g is 3, not 11",
           distances["g"] == 3,
           "the fewest-edges route costs 11")

# %%
predict(
    "The implementation pushes a new heap entry instead of decreasing a key. "
    "Can the heap ever hold more entries than the graph has vertices?",
    answer="",  # <- fill in
    confidence="",  # sure / fairly sure / guessing
)

# %% [markdown]
# ## 2. Verify claim one — is the heap bounded by V?

# %%
DENSE = {
    "s": [("a", 1), ("b", 2), ("c", 3)],
    "a": [("b", 1), ("c", 1), ("d", 1)],
    "b": [("c", 1), ("d", 1)],
    "c": [("d", 1)],
    "d": [],
}

dense_trace = HeapTrace()
dijkstra(DENSE, "s", dense_trace)

print(f"dense graph vertices: {len(DENSE)}")
print(f"  heap pushes       : {dense_trace.pushes}")
print(f"  max occupancy     : {dense_trace.max_occupancy}")
print(f"  stale pops        : {dense_trace.stale_pops}")

checkpoint("pushes exceed the vertex count",
           dense_trace.pushes > len(DENSE),
           f"{dense_trace.pushes} pushes for {len(DENSE)} vertices")
checkpoint("stale entries are popped and discarded",
           dense_trace.stale_pops > 0,
           f"{dense_trace.stale_pops} pops hit an already-finalized node")

# %% [markdown]
# ## 3. Verify claim two — the negative edge

# %%
negative_trace = HeapTrace()
try:
    negative_result = dijkstra(NEGATIVE, "s", negative_trace)
    negative_outcome = "returned normally"
except Exception as error:  # noqa: BLE001 - the claim is that it raises
    negative_result, negative_outcome = None, f"raised {type(error).__name__}"


def true_shortest(graph, source):
    """Exhaustive shortest paths over a tiny graph, negative edges allowed."""
    nodes = list(graph)
    best = {n: float("inf") for n in nodes}
    best[source] = 0
    for _ in range(len(nodes)):
        for u in nodes:
            for v, w in graph.get(u, ()):
                if best[u] + w < best[v]:
                    best[v] = best[u] + w
    return best


truth = true_shortest(NEGATIVE, "s")
print(f"graph with a negative edge: {NEGATIVE}")
print(f"outcome        : {negative_outcome}")
print(f"dijkstra says  : {negative_result}")
print(f"true distances : {truth}")

wrong = {k: (negative_result.get(k), truth[k])
         for k in truth
         if negative_result is not None and negative_result.get(k) != truth[k]}
print(f"disagreements  : {wrong}")

checkpoint("it does not raise", negative_outcome == "returned normally")
checkpoint("and it returns a wrong answer",
           len(wrong) > 0,
           f"{wrong} — silently, with no signal")

# %%
resolve(
    "The implementation pushes a new heap entry instead of decreasing a key. "
    "Can the heap ever hold more entries than the graph has vertices?",
    "matched",  # matched / diverged / partial
)

# %%
reveal(
    "The implementation pushes a new heap entry instead of decreasing a key. "
    "Can the heap ever hold more entries than the graph has vertices?",
    """
    Yes. Both generated claims are false, and they fail for different reasons.

    **The heap bound.** Lazy deletion never removes the stale entry when a
    shorter path is found — it pushes a second entry for the same vertex and
    skips the old one on the way out. So the heap holds up to one entry *per
    edge relaxation*, not per vertex, and pushes exceed V on any graph where a
    vertex is improved more than once. The complexity is still O(E log E), which
    equals O(E log V) up to a constant since E is at most V squared — so the
    stated bound happens to be right while the stated reason is wrong. That is
    the most dangerous kind of review finding: a correct conclusion resting on a
    false premise, which stops being correct the moment someone changes the code.

    **The negative edge.** It does not raise. It returns, and the answer is
    wrong. Dijkstra finalizes a vertex the moment it is popped, on the assumption
    that no later path can improve it — an assumption that holds only when every
    edge is non-negative. Give it a negative edge and it commits to a distance
    before the shorter route through that edge has been discovered. Nothing
    detects this, because finalization is exactly the step that stopped looking.

    So the review verdict on this patch is: **reject**, and not for the reason the
    author would expect. The code is a correct implementation of an algorithm
    whose precondition the caller can violate silently. Adding an
    `if weight < 0: raise` at relaxation time is the minimum, and even that is a
    runtime check for what is really a specification: *this function requires a
    non-negative-weight graph.*

    The exhaustive comparison is what made the second finding checkable. Without
    an independent oracle, "the answer looks plausible" is all a reviewer has —
    and it did look plausible.
    """,
)

# %% [markdown]
# ## 4. Review and verify — audit four statements

# %%
CLAIMS = {
    "a": "The heap holds at most V entries.",
    "b": "The implementation is O(E log V).",
    "c": "Negative edges cause an error.",
    "d": "Negative edges cause a silently wrong answer.",
}
for key, text in CLAIMS.items():
    print(f"{key}. {text}")


def supported(key: str) -> bool:
    """True when this bench's evidence supports the claim."""
    raise NotImplementedError("Audit the four claims")


# %%
check("supported", supported,
      [(("a",), False), (("b",), True), (("c",), False), (("d",), True)])
print()
print("(a) is false and (b) is true — the bound holds for a reason the author")
print("did not give. A review that accepted (a) would have accepted (b) for the")
print("wrong reason, and missed that the argument is load-bearing.")

# %% [markdown]
# ## 5. The review card

# %%
REVIEW_CARD = """
Verdict (accept / reject / accept with changes):
Claim one, and the measurement that refutes it:
Claim two, and the oracle that refutes it:
The precondition the code does not state:
The smallest change that would make the precondition checkable:
"""
print(REVIEW_CARD)

# %%
claim("REVIEW VERDICT", REVIEW_CARD)

claim(
    "COUNTEREXAMPLE",
    f"On a graph of {len(DENSE)} vertices the lazy-deletion heap took "
    f"{dense_trace.pushes} pushes with {dense_trace.stale_pops} stale pops, "
    f"exceeding the claimed V bound. On a graph with one negative edge the "
    f"implementation {negative_outcome} and disagreed with an exhaustive oracle "
    f"at {wrong}.",
    support={"weighted": {"distances": distances, "pushes": trace.pushes,
                          "stalePops": trace.stale_pops,
                          "maxOccupancy": trace.max_occupancy,
                          "finalized": trace.finalized},
             "dense": {"vertices": len(DENSE), "pushes": dense_trace.pushes,
                       "stalePops": dense_trace.stale_pops},
             "negative": {"outcome": negative_outcome,
                          "dijkstra": negative_result, "truth": truth,
                          "disagreements": wrong}},
)

non_claim(
    "The oracle is an exhaustive relaxation over a five-vertex graph, so it "
    "settles this instance and proves nothing in general. The push counts come "
    "from two hand-built graphs and do not establish a worst-case bound — showing "
    "the claimed bound is violated needs only one counterexample, but the true "
    "bound needs an argument this bench does not make."
)

emit()

# %% [markdown]
# ## 6. Transfer
#
# 1. Claim (b) was true and its stated justification false. Write the rule about
#    reviewing a conclusion versus reviewing its argument.
# 2. The negative edge produced no signal. Name the general category of defect
#    that a return value cannot reveal.
# 3. Bench `m04-s4` uses exhaustion as an oracle over a bounded domain. State what
#    both benches needed before they could review anything.
#
# ---
#
# ## Attributions
#
# Authored for this course. Module 10 has no checked-in reference model.
