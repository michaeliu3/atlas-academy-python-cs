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
# # Bench m10-s3 — DFS cycle-or-order evidence card
#
# **Session 10.3 — DFS finishing state exposes cycles and order.** Rungs:
# **recognize** (primary), trace.
#
# A visited set is the obvious way to avoid re-walking a node. It is also
# insufficient for detecting a cycle, and the counterexample is a three-vertex
# graph with no cycle in it at all.
#
# **Requires:** Python 3.12+. Standard library only.

# %%
from _fixture import (  # noqa: E402
    CYCLIC, DIAMOND_TAIL, coloured_has_cycle, seen_only_has_cycle,
)

import sys  # noqa: E402
from itertools import combinations, product  # noqa: E402

from atlas_bench import (  # noqa: E402
    bench, check, checkpoint, claim, emit, non_claim, predict, resolve, reveal,
)

assert sys.version_info >= (3, 12)

bench(module=10, session=3, emits="DFS cycle-or-order evidence card",
      rungs=["recognize", "trace"])

# %% [markdown]
# ## 1. Two detectors, one graph

# %%
print(f"DIAMOND_TAIL: {DIAMOND_TAIL}   (a -> c <- b; no cycle)")
print(f"CYCLIC      : {CYCLIC}")

# %%
predict(
    "A cycle detector that reports a cycle whenever it reaches an already-seen "
    "node — what does it say about a -> c <- b, which has no cycle?",
    answer="",  # <- fill in
    confidence="",  # sure / fairly sure / guessing
)

# %% [markdown]
# ## 2. Trace — run both detectors from a root reaching both branches

# %%
ROOTED_DIAMOND = {"root": ["a", "b"], **DIAMOND_TAIL}

results = {}
for name, graph in (("diamond (no cycle)", ROOTED_DIAMOND), ("cyclic", CYCLIC)):
    root = "root" if "root" in graph else "a"
    results[name] = {
        "seen_only": seen_only_has_cycle(graph, root),
        "coloured": coloured_has_cycle(graph, root),
    }
    # str() before padding: a bool formatted with a width spec prints as 1/0.
    print(f"{name:>20}: seen-only says {str(results[name]['seen_only']):<6} "
          f"coloured says {results[name]['coloured']}")

checkpoint("the seen-only detector reports a cycle in an acyclic graph",
           results["diamond (no cycle)"]["seen_only"] is True,
           "a false positive on a three-vertex DAG")
checkpoint("the coloured detector does not",
           results["diamond (no cycle)"]["coloured"] is False)
checkpoint("both agree on the genuinely cyclic graph",
           results["cyclic"]["seen_only"] and results["cyclic"]["coloured"])

# %%
resolve(
    "A cycle detector that reports a cycle whenever it reaches an already-seen "
    "node — what does it say about a -> c <- b, which has no cycle?",
    "matched",  # matched / diverged / partial
)

# %%
reveal(
    "A cycle detector that reports a cycle whenever it reaches an already-seen "
    "node — what does it say about a -> c <- b, which has no cycle?",
    """
    It reports a cycle. There is none.

    A visited set answers "have I been here before?" A cycle detector needs a
    different question: "am I here *right now*, further up my own path?" Those
    coincide only when the graph is a tree, and diverge the moment two paths
    reach the same node — which is what a shared child is, and what a DAG is full
    of.

    Reaching `c` from `a` and again from `b` is not a cycle. It is a diamond: two
    routes to one destination, both finite, both terminating. The seen-only
    detector cannot tell that from a genuine loop because it has thrown away the
    distinction between *visited at some point* and *on the current stack*.

    The three-colour scheme keeps both:

    - **white** — not yet reached;
    - **grey** — reached, and the recursion is still inside it; an edge here is a
      **back edge**, and back edges are exactly the cycles;
    - **black** — reached and finished; an edge here is a cross or forward edge,
      and means nothing about cycles.

    The finishing step is the load-bearing part, and it is easy to omit. If a node
    is never moved from grey to black, every completed branch stays on the path
    forever and the detector degenerates into the seen-only version.

    Note also what the false positive costs. A validator that rejects DAGs would
    reject most real prerequisite graphs — including the perfectly workable
    shared-prerequisite graph from `m04-s3` — so the failure mode is not a missed
    cycle but a refusal to accept valid input.
    """,
)

# %% [markdown]
# ## 3. Trace — search for the smallest false positive

# %%
def smallest_false_positive():
    """The smallest acyclic graph the seen-only detector rejects."""
    for size in (2, 3, 4):
        nodes = [chr(ord("a") + i) for i in range(size)]
        edges = [(u, v) for u, v in product(nodes, nodes) if u != v]
        for count in range(1, len(edges) + 1):
            for chosen in combinations(edges, count):
                graph = {n: [] for n in nodes}
                for u, v in chosen:
                    graph[u].append(v)
                root = nodes[0]
                if coloured_has_cycle(graph, root):
                    continue                      # genuinely cyclic, skip
                if seen_only_has_cycle(graph, root):
                    return size, {k: v for k, v in graph.items() if v}
    return None


found = smallest_false_positive()
print(f"smallest acyclic graph the seen-only detector rejects: {found}")

checkpoint("a false positive needs only three vertices",
           found is not None and found[0] == 3,
           str(found[1]) if found else "")

# %% [markdown]
# ## 4. Recognize — what does each edge kind mean?

# %%
EDGES = {
    "a": "An edge to a node not yet reached.",
    "b": "An edge to a node currently on the recursion stack.",
    "c": "An edge to a node already finished.",
    "d": "A second edge into the same node from a different parent.",
}
for key, text in EDGES.items():
    print(f"{key}. {text}")


def implies_cycle(key: str) -> bool:
    """True when that edge kind proves a cycle exists."""
    raise NotImplementedError("Classify each edge kind")


# %%
check("implies_cycle", implies_cycle,
      [(("a",), False), (("b",), True), (("c",), False), (("d",), False)])
print()
print("Only (b) — the back edge — is evidence. (d) is what the seen-only")
print("detector mistakes for one.")

# %% [markdown]
# ## 5. The evidence card

# %%
EVIDENCE_CARD = """
The question a visited set answers:
The question a cycle detector must answer:
The three colours and what an edge into each one establishes:
The false positive I produced, as a concrete graph:
Which is worse for a prerequisite validator, a false positive or a false negative:
"""
print(EVIDENCE_CARD)

# %%
claim("DEFINITION / MODEL", EVIDENCE_CARD)

claim(
    "COUNTEREXAMPLE",
    f"On the acyclic graph {found[1] if found else DIAMOND_TAIL}, a seen-only "
    f"detector reports a cycle while a three-colour detector correctly reports "
    f"none. Three vertices suffice, and both detectors agree on a genuinely "
    f"cyclic graph.",
    support={"results": results, "smallestFalsePositive": found},
)

non_claim(
    "Two detectors on small graphs. This establishes that a visited set is not a "
    "cycle test — one counterexample is enough — and nothing about the cost of "
    "either traversal, about undirected graphs where the parent edge needs "
    "special handling, or about detecting all cycles rather than one."
)

emit()

# %% [markdown]
# ## 6. Transfer
#
# 1. Both detectors agreed on the cyclic graph. State why agreeing on positives
#    says nothing about a detector's correctness.
# 2. Omitting the grey-to-black step degrades one detector into the other.
#    Explain what that says about where the information lives.
# 3. Bench `m04-s3` separates a shared prerequisite from a cycle. Which detector
#    does that bench's `cycle_witness` correspond to?
#
# ---
#
# ## Attributions
#
# Authored for this course. Module 10 has no checked-in reference model.
