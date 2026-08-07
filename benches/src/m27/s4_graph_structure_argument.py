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
# # Bench m27-s4 — graph structure argument
#
# **Session 27.4 — Graphs, trees, connectivity, and matchings.** Rungs:
# **debug and defend** (primary), recognize.
#
# The workbook asks you to find a graph where a greedy matching is *maximal* but
# not *maximum*. It can assert such a graph exists. This bench searches the small
# graphs exhaustively and hands you the smallest one — then shows greedy
# succeeding on a graph that looks the same size, so that success cannot be
# mistaken for a theorem.
#
# **Requires:** Python 3.12+. Standard library only.

# %%
from _fixture import (  # noqa: E402  (sets up sys.path)
    GREEDY_LUCKY, GREEDY_UNLUCKY, PATH_EDGES, PATH_LEFT, PATH_RIGHT, greedy_matching,
)

import sys  # noqa: E402
from itertools import combinations  # noqa: E402

from atlas_bench import (  # noqa: E402
    bench, check, checkpoint, claim, emit, non_claim, predict, resolve, reveal,
)
from module27_reference import analyze_bipartite_matching  # noqa: E402

assert sys.version_info >= (3, 12)

bench(
    module=27,
    session=4,
    emits="graph structure argument",
    rungs=["debug-and-defend", "recognize"],
)

# %% [markdown]
# ## 1. Recognize — maximal is not maximum
#
# A matching is **maximal** when no further edge can be added. It is **maximum**
# when no larger matching exists anywhere. Greedy always achieves the first.

# %%
print(f"graph: left={PATH_LEFT} right={PATH_RIGHT}")
print(f"edges: {PATH_EDGES}")

predict(
    "Greedy takes edges in order and skips any whose endpoints are used. Can its "
    "result be maximal — no edge addable — and still be smaller than the largest "
    "matching in the same graph?",
    answer="",  # <- fill in
    confidence="",  # sure / fairly sure / guessing
)

# %% [markdown]
# ## 2. Run greedy under two edge orders

# %%
unlucky_order = (("x2", "y1"), ("x1", "y1"), ("x2", "y2"))
lucky_order = (("x1", "y1"), ("x2", "y2"), ("x2", "y1"))

results = {}
for label, order in (("middle edge first", unlucky_order), ("end edge first", lucky_order)):
    chosen = greedy_matching(PATH_EDGES, order)
    report = analyze_bipartite_matching(PATH_LEFT, PATH_RIGHT, PATH_EDGES, chosen)
    results[label] = report
    print(f"{label:>20}: chose {chosen}")
    print(f"{'':>20}  size={report.chosen_size} maximal={report.is_maximal} "
          f"maximum={report.is_maximum}  (best possible {report.maximum_size})")

# %%
checkpoint(
    "the unlucky order produces a MAXIMAL matching",
    results["middle edge first"].is_maximal,
    "no edge can be added — greedy cannot detect its mistake locally",
)
checkpoint(
    "and it is NOT maximum",
    not results["middle edge first"].is_maximum,
    f"size {results['middle edge first'].chosen_size} against a maximum of "
    f"{results['middle edge first'].maximum_size}",
)
checkpoint(
    "the lucky order reaches the maximum on the same graph",
    results["end edge first"].is_maximum,
    "so the difference is edge order, not graph structure",
)

# %%
resolve(
    "Greedy takes edges in order and skips any whose endpoints are used. Can its "
    "result be maximal — no edge addable — and still be smaller than the largest "
    "matching in the same graph?",
    "matched",  # matched / diverged / partial
)

# %%
reveal(
    "Greedy takes edges in order and skips any whose endpoints are used. Can its "
    "result be maximal — no edge addable — and still be smaller than the largest "
    "matching in the same graph?",
    """
    Yes, and the smallest witness is a three-edge path.

    Committing to the middle edge (x2, y1) consumes both x2 and y1. What remains
    is (x1, y1) — blocked, y1 is taken — and (x2, y2) — blocked, x2 is taken. So
    greedy stops at one edge, and it stops *correctly*: its result really is
    maximal. Nothing local tells it otherwise.

    The maximum is two: take the two end edges and leave the middle one out.
    Getting there requires declining an edge that was available, which is exactly
    the move a greedy rule cannot make.

    Two things worth separating, because they are the session's whole point:

    - **maximal** is a local property, checkable by looking at the result alone;
    - **maximum** is a global property, and checking it requires reasoning about
      matchings that were never built.

    A greedy algorithm certifies the first and says nothing about the second.
    And note the second run: the *same graph* with a different edge order gives
    the maximum. Greedy succeeding is therefore not evidence that greedy is
    correct — it is evidence about the input order, which is not a property of
    the problem.
    """,
)

# %% [markdown]
# ## 3. Search — is this really the smallest witness?
#
# The workbook asks for *a* witness. Establish that it is minimal by exhausting
# everything smaller.

# %%
def smallest_failing_graph(max_edges: int = 3):
    """Search bipartite graphs up to `max_edges` for a greedy failure.

    Returns (edges, greedy_order, greedy_size, maximum_size) for the first graph
    where some edge order makes greedy maximal-but-not-maximum, or None.
    """
    left, right = ("x1", "x2"), ("y1", "y2")
    universe = [(a, b) for a in left for b in right]
    for size in range(1, max_edges + 1):
        for edges in combinations(universe, size):
            for order in __import__("itertools").permutations(edges):
                chosen = greedy_matching(edges, order)
                report = analyze_bipartite_matching(left, right, edges, chosen)
                if report.is_matching and report.is_maximal and not report.is_maximum:
                    return edges, order, report.chosen_size, report.maximum_size
    return None


found = smallest_failing_graph(2)
print(f"any 2-edge witness? {found}")
found3 = smallest_failing_graph(3)
print(f"3-edge witness    : {found3[0] if found3 else None}")

checkpoint(
    "no two-edge graph makes greedy fail",
    found is None,
    "two disjoint edges are always both taken; two sharing a node cap at one",
)
checkpoint(
    "three edges suffice, and the witness is the path",
    found3 is not None and len(found3[0]) == 3,
    f"{found3[0] if found3 else ''}",
)

# %% [markdown]
# ## 4. Debug and defend
#
# The defence is the artifact. State it in terms the next reader can check.

# %%
DEFENCE = """
Why greedy's result is maximal, argued from the algorithm rather than the output:
Why maximality cannot be upgraded to maximality-plus-optimality by testing more graphs:
The structural feature of the witness that causes the failure:
"""
print(DEFENCE)

# %% [markdown]
# ## 5. The record

# %%
claim("DEFENDED REPAIR", DEFENCE)

claim(
    "COUNTEREXAMPLE",
    f"On the three-edge path {PATH_EDGES}, greedy taking the middle edge first "
    f"returns a maximal matching of size "
    f"{results['middle edge first'].chosen_size} against a maximum of "
    f"{results['middle edge first'].maximum_size}; the same graph under a "
    f"different edge order reaches the maximum.",
    support={
        "edges": list(PATH_EDGES),
        "unluckySize": results["middle edge first"].chosen_size,
        "luckySize": results["end edge first"].chosen_size,
        "maximumSize": results["middle edge first"].maximum_size,
    },
)

claim(
    "FINITE EXPERIMENT",
    "Exhausting all bipartite graphs on two-plus-two nodes with at most two "
    "edges finds no greedy failure; three edges do.",
    support={"twoEdgeWitness": None, "threeEdgeWitness": list(found3[0]) if found3 else None},
)

non_claim(
    "The exhaustive comparison is over a deliberately tiny universe — the "
    "reference model states its own bound at twelve edges. That greedy fails "
    "here does not establish how badly it can fail in general, and that no "
    "two-edge graph breaks it is a fact about two-edge graphs, not a lower bound "
    "argument."
)

emit()

# %% [markdown]
# ## 6. Transfer
#
# 1. Greedy succeeded under one edge order. Write the one-sentence rule about
#    what a successful run of a heuristic establishes.
# 2. The witness required declining an available edge. Name another algorithm in
#    this course whose correctness depends on *not* taking the locally best step.
# 3. `is_maximal` was checkable from the output alone; `is_maximum` was not.
#    Which of the two is a representation invariant, and which is a
#    specification?
#
# ---
#
# ## Attributions
#
# Probes the checked-in reference model
# `public/downloads/module27_reference.py` — `analyze_bipartite_matching` and its
# `_exhaustive_maximum_matching` witness. The reference model is not
# reimplemented. The greedy implementation, the edge-order contrast, and the
# minimality search are this bench's own.
