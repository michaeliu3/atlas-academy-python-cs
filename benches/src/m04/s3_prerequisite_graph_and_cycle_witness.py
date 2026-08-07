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
# # Bench m04-s3 — prerequisite-graph and cycle witness
#
# **Session 4.3 — Give prerequisites a graph shape.** Rungs: **recognize**
# (primary), trace.
#
# "Every node has a `children` list" describes a *shape*. Whether that shape is a
# tree is a claim about reachability, and no amount of inspecting the field
# settles it. This bench builds a structure that passes the field check and is
# not a tree, and produces the witness that proves it.
#
# **Requires:** Python 3.12+. Standard library only.

# %%
from _fixture import (  # noqa: E402
    SHARED_AND_CYCLIC, SHARED_ONLY, TREE, child_count_validator, cycle_witness,
    reachable_twice,
)

import sys  # noqa: E402

from atlas_bench import (  # noqa: E402
    bench, check, checkpoint, claim, emit, non_claim, predict, resolve, reveal,
)

assert sys.version_info >= (3, 12)

bench(module=4, session=3, emits="prerequisite-graph and cycle witness",
      rungs=["recognize", "trace"])

# %% [markdown]
# ## 1. Three structures with identical field shape

# %%
GRAPHS = {"TREE": TREE, "SHARED_ONLY": SHARED_ONLY, "SHARED_AND_CYCLIC": SHARED_AND_CYCLIC}
for name, graph in GRAPHS.items():
    print(f"{name:>18}: {graph}")

# %%
predict(
    "A validator checks that every node has at most two children and every child "
    "name resolves. How many of the three structures does it accept?",
    answer="",  # <- fill in
    confidence="",  # sure / fairly sure / guessing
)

# %% [markdown]
# ## 2. Trace — the field check against the reachability check

# %%
print(f"{'structure':>18}  {'field check':>12}  {'shared child':>14}  {'cycle witness':>28}")
results = {}
for name, graph in GRAPHS.items():
    field_ok = child_count_validator(graph, "values")
    shared = reachable_twice(graph, "values")
    witness = cycle_witness(graph, "values")
    results[name] = {"field": field_ok, "shared": list(shared),
                     "cycle": list(witness) if witness else None}
    print(f"{name:>18}  {str(field_ok):>12}  {str(list(shared)):>14}  "
          f"{str(list(witness) if witness else None):>28}")

checkpoint("the field check accepts all three",
           all(r["field"] for r in results.values()),
           "including the one that is not a tree")
checkpoint("only the cyclic graph yields a cycle witness",
           results["SHARED_AND_CYCLIC"]["cycle"] is not None
           and results["SHARED_ONLY"]["cycle"] is None)
checkpoint("the shared child is detected without being called a cycle",
           results["SHARED_ONLY"]["shared"] == ["proof"]
           and results["SHARED_ONLY"]["cycle"] is None)

# %%
resolve(
    "A validator checks that every node has at most two children and every child "
    "name resolves. How many of the three structures does it accept?",
    "matched",  # matched / diverged / partial
)

# %%
reveal(
    "A validator checks that every node has at most two children and every child "
    "name resolves. How many of the three structures does it accept?",
    """
    All three — including the one with a cycle.

    The field check asks local questions: how many children does this node list,
    and do those names exist? Both are answerable by looking at one node at a
    time, and neither can express "is any node reachable twice" or "does any path
    return to where it started". Those are properties of the *graph*, and a
    per-node check has no access to them.

    Two distinct non-tree properties show up here, and conflating them is the
    common error:

    - **A shared child** — `proof` reachable from both `functions` and `logic`.
      The structure is still a DAG, still finite, still safe to traverse with a
      visited set. `SHARED_ONLY` is perfectly usable as a prerequisite graph.
    - **A cycle** — `proof` listing `values` as a child, closing the loop. Now a
      naive traversal never terminates, and "study the prerequisites first" has no
      valid order at all.

    A validator that reports "not a tree" for both is not useful, because only
    one of them is a defect. This is why the witness matters: `cycle_witness`
    returns the edge sequence, so the report says *which* path is impossible
    rather than that something somewhere is wrong.

    The colouring is what makes the distinction cheap. A second visit to a
    finished (black) node is a shared child; an edge back to a node still on the
    current path (grey) is a cycle. A single visited set collapses both into one
    verdict and gets `SHARED_ONLY` wrong.
    """,
)

# %% [markdown]
# ## 3. Recognize — write the property the field check is missing


# %%
def is_tree(graph: dict[str, list[str]], root: str) -> bool:
    """True when every node is reachable from root by exactly one path.

    Neither a shared child nor a cycle is allowed. Use the fixture's
    `cycle_witness` and `reachable_twice` rather than reimplementing them.
    """
    raise NotImplementedError("Implement the tree property")


# %%
check("is_tree", is_tree,
      [((TREE, "values"), True),
       ((SHARED_ONLY, "values"), False),
       ((SHARED_AND_CYCLIC, "values"), False)])


def is_valid_prerequisite_graph(graph: dict[str, list[str]], root: str) -> bool:
    """True when a study order exists: shared prerequisites fine, cycles not."""
    raise NotImplementedError("Implement the weaker, more useful property")


# %%
check("is_valid_prerequisite_graph", is_valid_prerequisite_graph,
      [((TREE, "values"), True),
       ((SHARED_ONLY, "values"), True),
       ((SHARED_AND_CYCLIC, "values"), False)])
print()
print("The second property is the one Atlas actually needs. `is_tree` rejects a")
print("perfectly workable graph, which is a false alarm rather than a check.")

# %% [markdown]
# ## 4. The witness

# %%
witness = results["SHARED_AND_CYCLIC"]["cycle"]
print(f"cycle witness: {' -> '.join(witness)}")
print()
print("A witness is checkable without rerunning the search: follow each edge and")
print("confirm it exists, then confirm the first and last node are the same.")

edges_exist = all(
    b in SHARED_AND_CYCLIC.get(a, ())
    for a, b in zip(witness, witness[1:])
)
checkpoint("every edge in the witness exists in the graph", edges_exist)
checkpoint("and the witness closes", witness[0] == witness[-1])

# %% [markdown]
# ## 5. The record

# %%
GRAPH_NOTE = """
The local property the field check verifies:
The global property it cannot express, and why:
The two distinct non-tree conditions, and which one is actually a defect:
The witness, and how a reader checks it without trusting my search:
"""
print(GRAPH_NOTE)

# %%
claim("DEFINITION / MODEL", GRAPH_NOTE)

claim(
    "COUNTEREXAMPLE",
    f"A per-node field check accepts all three structures, including "
    f"SHARED_AND_CYCLIC whose cycle witness is {' -> '.join(witness)}. A shared "
    f"child (SHARED_ONLY) is detected separately and is not a defect.",
    support={"results": results, "witness": witness, "witnessEdgesExist": edges_exist},
)

non_claim(
    "Three hand-built graphs of five nodes. They show a per-node check cannot "
    "decide a reachability property — one counterexample suffices — and nothing "
    "about how often real prerequisite data contains cycles, nor about the cost "
    "of the colouring traversal at scale."
)

emit()

# %% [markdown]
# ## 6. Transfer
#
# 1. The field check was not wrong, only local. State the general rule about what
#    per-element validation can establish about a structure.
# 2. `is_tree` rejects a usable graph. Name the cost of choosing a property that
#    is stronger than what you need.
# 3. A single visited set conflates the two conditions. Which module's traversal
#    vocabulary makes the grey/black distinction standard?
#
# ---
#
# ## Attributions
#
# Authored for this course. Module 4 has no checked-in reference model.
