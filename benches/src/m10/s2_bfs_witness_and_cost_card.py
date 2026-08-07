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
# # Bench m10-s2 — BFS witness-and-cost card
#
# **Session 10.2 — FIFO layers create shortest unweighted evidence.** Rungs:
# **trace** (primary), map.
#
# Two BFS variants differing in *when* a vertex is marked discovered. Both find
# every reachable vertex. One enqueues each vertex once; the other enqueues it
# once per incoming edge and leaves a parent map that is no longer a shortest-path
# witness.
#
# **Requires:** Python 3.12+. Standard library only.

# %%
from _fixture import bfs_parents  # noqa: E402

import sys  # noqa: E402

from atlas_bench import (  # noqa: E402
    bench, check, checkpoint, claim, emit, non_claim, predict, resolve, reveal,
)

assert sys.version_info >= (3, 12)

bench(module=10, session=2, emits="BFS witness-and-cost card",
      rungs=["trace", "map"])

# %% [markdown]
# ## 1. A graph with many routes to one vertex

# %%
FAN_IN = {
    "s": [("a", 1), ("b", 1), ("c", 1)],
    "a": [("t", 1)],
    "b": [("t", 1)],
    "c": [("t", 1)],
    "t": [],
}
print(f"graph: {FAN_IN}")
print("three one-edge routes from s reach t in two edges each")

# %%
predict(
    "One BFS marks a vertex discovered when it is enqueued; the other waits until "
    "it is dequeued. Do both enqueue the same number of vertices?",
    answer="",  # <- fill in
    confidence="",  # sure / fairly sure / guessing
)

# %% [markdown]
# ## 2. Trace — count enqueues under each policy

# %%
eager_parent, eager_count = bfs_parents(FAN_IN, "s", discover_at_dequeue=False)
late_parent, late_count = bfs_parents(FAN_IN, "s", discover_at_dequeue=True)

print(f"{'policy':>24}  {'enqueues':>9}  parent map")
print(f"{'discover at enqueue':>24}  {eager_count:>9}  {eager_parent}")
print(f"{'discover at dequeue':>24}  {late_count:>9}  {late_parent}")

checkpoint("both reach every vertex",
           set(eager_parent) == set(late_parent) == set(FAN_IN))
checkpoint("the eager policy enqueues each vertex once",
           eager_count == len(FAN_IN),
           f"{eager_count} enqueues for {len(FAN_IN)} vertices")
checkpoint("the late policy enqueues more",
           late_count > eager_count,
           f"{late_count} — once per incoming edge")

# %%
resolve(
    "One BFS marks a vertex discovered when it is enqueued; the other waits until "
    "it is dequeued. Do both enqueue the same number of vertices?",
    "diverged",  # matched / diverged / partial
)

# %%
reveal(
    "One BFS marks a vertex discovered when it is enqueued; the other waits until "
    "it is dequeued. Do both enqueue the same number of vertices?",
    """
    No. Marking at enqueue puts each vertex in the queue exactly once. Marking at
    dequeue puts it in once **per incoming edge**.

    The window is the gap between a vertex being queued and being processed.
    During that gap it is not yet marked, so every other vertex that discovers it
    queues it again. On a fan-in like this one, `t` is queued three times — and on
    a dense graph it is queued once per predecessor, which turns a linear queue
    into a quadratic one.

    Two separate costs come out of one mistake:

    - **Work.** The queue grows with edges rather than vertices. Every duplicate
      is eventually dequeued and re-expanded, so the running time carries a
      factor nothing in the algorithm's description predicts.
    - **The witness.** The parent map is supposed to be a shortest-path witness:
      following parents from any vertex back to the source reconstructs a
      minimum-edge route. Under the late policy each re-discovery overwrites the
      parent, so the map records the *last writer* rather than the first — and the
      last writer is whichever predecessor happened to be dequeued last, not the
      one on a shortest path.

    The second is the harder failure to notice, because the distances can still
    come out right. Layer order is preserved by the FIFO queue whether or not
    duplicates exist, so a BFS that only reports depths looks entirely correct.
    It is the *witness* that quietly stops being a witness, and only reconstructing
    a path exposes it.

    That is why the session's declared output pairs "witness" with "cost". They
    are two claims about the same traversal, they fail independently, and the
    marking policy decides both.
    """,
)

# %% [markdown]
# ## 3. Trace — does the witness still reconstruct a shortest path?

# %%
def path_via_parents(parent, target: str) -> list[str]:
    path, node = [], target
    while node is not None:
        path.append(node)
        node = parent.get(node)
    return list(reversed(path))


eager_path = path_via_parents(eager_parent, "t")
late_path = path_via_parents(late_parent, "t")

print(f"eager parent map path to t: {eager_path}  ({len(eager_path) - 1} edges)")
print(f"late  parent map path to t: {late_path}  ({len(late_path) - 1} edges)")

checkpoint("the eager witness reconstructs a two-edge path",
           len(eager_path) - 1 == 2)
checkpoint("the late witness happens to as well, on this graph",
           len(late_path) - 1 == 2,
           "the layer structure saved it here — that is luck, not a guarantee")

# %% [markdown]
# ### A graph where the late witness is wrong

# %%
UNEVEN = {
    "s": [("a", 1), ("b", 1)],
    "a": [("t", 1)],
    "b": [("c", 1)],
    "c": [("t", 1)],
    "t": [],
}
uneven_eager, _ = bfs_parents(UNEVEN, "s", discover_at_dequeue=False)
uneven_late, _ = bfs_parents(UNEVEN, "s", discover_at_dequeue=True)

eager_uneven_path = path_via_parents(uneven_eager, "t")
late_uneven_path = path_via_parents(uneven_late, "t")

print(f"graph: {UNEVEN}")
print(f"eager path to t: {eager_uneven_path}  ({len(eager_uneven_path) - 1} edges)")
print(f"late  path to t: {late_uneven_path}  ({len(late_uneven_path) - 1} edges)")

checkpoint("the eager witness finds the two-edge route",
           len(eager_uneven_path) - 1 == 2)
checkpoint("the late witness records a longer one",
           len(late_uneven_path) - 1 > 2,
           "the last writer was on the three-edge route")

# %% [markdown]
# ## 4. Map — which claim does each policy support?

# %%
CLAIMS = {
    "a": "Every reachable vertex is found.",
    "b": "Each vertex is enqueued at most once.",
    "c": "The parent map reconstructs a minimum-edge path.",
    "d": "The reported depth of each vertex is its true distance.",
}
for key, text in CLAIMS.items():
    print(f"{key}. {text}")


def holds_for_late_policy(key: str) -> bool:
    """True when the discover-at-dequeue policy supports the claim."""
    raise NotImplementedError("Map each claim")


# %%
check("holds_for_late_policy", holds_for_late_policy,
      [(("a",), True), (("b",), False), (("c",), False), (("d",), True)])
print()
print("(d) surviving is what makes this hard to catch: distances stay correct")
print("while the witness stops witnessing.")

# %% [markdown]
# ## 5. The witness-and-cost card

# %%
CARD = """
The two policies, stated as when a vertex is marked:
The cost claim each supports, with the enqueue counts:
The witness claim each supports:
The graph on which the late witness fails, and the path it produced:
Why a depth-only test would pass on both:
"""
print(CARD)

# %%
claim("DEFINITION / MODEL", CARD)

claim(
    "COUNTEREXAMPLE",
    f"On a three-way fan-in, discover-at-enqueue makes {eager_count} enqueues "
    f"against {late_count} for discover-at-dequeue. On an uneven graph the late "
    f"policy's parent map reconstructs a "
    f"{len(late_uneven_path) - 1}-edge path to t where a "
    f"{len(eager_uneven_path) - 1}-edge path exists.",
    support={"fanIn": {"eagerEnqueues": eager_count, "lateEnqueues": late_count,
                       "eagerParents": eager_parent, "lateParents": late_parent},
             "uneven": {"eagerPath": eager_uneven_path,
                        "latePath": late_uneven_path}},
)

non_claim(
    "Two small graphs. They show the marking policy changes enqueue count and can "
    "corrupt the parent witness; they do not establish the worst-case blow-up "
    "factor, and they say nothing about BFS on weighted graphs, where neither "
    "policy produces a shortest-path witness at all."
)

emit()

# %% [markdown]
# ## 6. Transfer
#
# 1. Distances stayed correct while the witness broke. State what that implies
#    about testing a traversal by its reported depths.
# 2. The extra enqueues came from a window between two events. Name another place
#    in this course where a gap between two operations is the defect.
# 3. Bench `m10-s5` finds Dijkstra committing too early. Compare what each
#    algorithm relies on being true at the moment it commits.
#
# ---
#
# ## Attributions
#
# Authored for this course. Module 10 has no checked-in reference model.
