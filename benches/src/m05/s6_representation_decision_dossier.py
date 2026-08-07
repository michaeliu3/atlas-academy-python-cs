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
# # Bench m05-s6 — representation decision dossier
#
# **Session 5.6 — Architecture, delegation, and decision.** Rungs: **review and
# verify** (primary), design and delegate, transfer.
#
# The session maps *"a route planner whose graph lookup performs a database round
# trip"* and exits with a dossier that separates algorithmic-operation claims from
# adapter or I/O costs, preserves semantics, records evidence and uncertainty, and
# **rejects one claim the evidence cannot support.**
#
# That last obligation is the bench. Everything before it exists to make the
# rejection well-founded rather than reflexive.
#
# **Requires:** Python 3.12+. Standard library only.

# %%
import sys
import time
from pathlib import Path

_start = Path.cwd()
for _candidate in (_start, *list(_start.parents)[:4]):
    if (_candidate / "atlas_bench").is_dir():
        sys.path.insert(0, str(_candidate))
        break
else:  # pragma: no cover
    raise RuntimeError(f"atlas_bench not found from {_start}")

from atlas_bench import (  # noqa: E402
    Counter, bench, check, checkpoint, claim, emit, measure, non_claim,
    predict, resolve, reveal,
)

assert sys.version_info >= (3, 12)

bench(
    module=5,
    session=6,
    emits="representation decision dossier",
    rungs=["review-and-verify", "design-and-delegate", "transfer"],
)

# %% [markdown]
# ## 1. The planner, with the adapter made visible
#
# Workbook §12 puts a performance boundary between the domain and the adapter.
# Here the adapter is a stub with a declared latency, so operation count and
# wall-clock can be separated instead of conflated.

# %%
ADAPTER_LATENCY_S = 0.0005  # a modest round trip


class GraphAdapter:
    """Stands in for a database-backed neighbour lookup."""

    def __init__(self, edges: dict[int, list[int]], counter: Counter) -> None:
        self._edges = edges
        self._counter = counter

    def neighbours(self, node: int) -> list[int]:
        self._counter.hit("round-trip")
        time.sleep(ADAPTER_LATENCY_S)
        return self._edges.get(node, [])


def plan_route(start: int, goal: int, adapter: GraphAdapter, counter: Counter) -> list[int] | None:
    """Breadth-first route search. One adapter call per dequeued node."""
    from collections import deque

    frontier = deque([[start]])
    seen = {start}
    while frontier:
        path = frontier.popleft()
        counter.hit("node-expanded")
        node = path[-1]
        if node == goal:
            return path
        for neighbour in adapter.neighbours(node):
            if neighbour not in seen:
                seen.add(neighbour)
                frontier.append(path + [neighbour])
    return None


# A wide, shallow graph: 1 -> 2..41, each of those -> a few leaves.
EDGES: dict[int, list[int]] = {1: list(range(2, 42))}
for parent in range(2, 42):
    EDGES[parent] = [parent * 100, parent * 100 + 1]
GOAL = 41 * 100 + 1

# %%
predict(
    "The planner expands ~42 nodes. Will its wall-clock time be dominated by the "
    "algorithm's operation count or by the adapter's round trips?",
    answer="",
    confidence="",
)

# %%
counter = Counter()
adapter = GraphAdapter(EDGES, counter)
start = time.perf_counter()
route = plan_route(1, GOAL, adapter, counter)
elapsed = time.perf_counter() - start

round_trips = counter.counts.get("round-trip", 0)
expanded = counter.counts.get("node-expanded", 0)
adapter_time = round_trips * ADAPTER_LATENCY_S

print(f"route found        : {route}")
print(f"nodes expanded     : {expanded}")
print(f"adapter round trips: {round_trips}")
print(f"wall clock         : {elapsed * 1000:.1f} ms")
print(f"attributable to I/O: {adapter_time * 1000:.1f} ms "
      f"({100 * adapter_time / elapsed:.0f}%)")

# %%
resolve(
    "The planner expands ~42 nodes. Will its wall-clock time be dominated by the "
    "algorithm's operation count or by the adapter's round trips?",
    "matched",  # matched / diverged / partial
)

# %%
reveal(
    "The planner expands ~42 nodes. Will its wall-clock time be dominated by the "
    "algorithm's operation count or by the adapter's round trips?",
    """
    By the round trips, overwhelmingly — well over 90% of wall clock.

    The algorithmic work is a few dozen deque operations and set lookups:
    microseconds. Each adapter call costs half a millisecond, and there is one per
    expanded node. The domain cost model is correct and irrelevant.

    This is workbook section 12's boundary made numeric. Two different claims live
    here and they are not interchangeable:

    - "the planner expands O(V + E) nodes" — a claim about the algorithm,
      verifiable by counting, true regardless of where the data lives;
    - "the planner takes 21 ms" — a claim about this deployment, true only for
      this latency, this graph, and this adapter.

    Optimising the traversal from BFS to something cleverer would improve the
    first and barely touch the second. Batching forty round trips into one would
    invert it. Knowing which number you are trying to move is the entire decision,
    and an O() symbol will not tell you.
    """,
)

# %% [markdown]
# ## 2. Design and delegate — the bounded brief
#
# Workbook §14. A brief that cannot be reviewed is not a brief. Write one whose
# acceptance criteria are checkable *by the counters above*, not by inspection.

# %%
AGENT_BRIEF = """
Task            :
Files in scope  :
Prohibited scope:
Behaviour that must not change :
Acceptance evidence (in counted operations, not in wall clock) :
"""
print(AGENT_BRIEF)
print("A good brief here forbids changing route semantics, and states acceptance")
print("as 'round-trips reduced to <= k for the same returned route', which the")
print("counter can settle. 'Make it faster' is not acceptance evidence.")

# %% [markdown]
# ## 3. Review and verify — audit four conclusions
#
# An assistant benchmarked the planner and reported these. Each is the kind of
# statement that survives a casual read. Mark the ones the evidence supports.

# %%
AGENT_CONCLUSIONS = {
    "a": "The planner is I/O-bound: over 90% of wall clock is adapter latency.",
    "b": "Switching from BFS to A* would roughly halve the planner's runtime.",
    "c": "The planner expands each reachable node at most once.",
    "d": "The planner is O(V + E) in adapter round trips, so it will scale to a "
         "graph a thousand times larger.",
}
for key, text in AGENT_CONCLUSIONS.items():
    print(f"{key}. {text}")


def supported_by_evidence(key: str) -> bool:
    """True when this bench's measurements support the conclusion as written."""
    raise NotImplementedError("Audit the four conclusions")


# %%
check(
    "supported_by_evidence",
    supported_by_evidence,
    [(("a",), True), (("b",), False), (("c",), True), (("d",), False)],
)

# %%
checkpoint(
    "each reachable node was expanded at most once",
    expanded <= len(EDGES) + sum(len(v) for v in EDGES.values()),
    f"expanded {expanded}; the `seen` set is what makes this hold",
)
checkpoint(
    "round trips equal nodes expanded, minus the early return",
    abs(round_trips - expanded) <= 1,
    f"{round_trips} round trips for {expanded} expansions",
)

# %% [markdown]
# ### Why (b) and (d) fail
#
# **(b)** predicts a speedup from an algorithmic change in a workload where the
# algorithm is under 10% of wall clock. Even eliminating traversal work entirely
# could not halve the runtime. It is the reasoning error the whole session exists
# to prevent: an improvement to the wrong cost.
#
# **(d)** starts from a correct operation-count claim and lands on a deployment
# claim. O(V + E) round trips at half a millisecond each is *forty thousand round
# trips*, or twenty seconds, on a graph a thousand times larger. The asymptotic
# claim is true and the scaling conclusion does not follow from it — the constant
# is the whole story, and asymptotic notation deliberately discards constants.

# %% [markdown]
# ## 4. The dossier

# %%
REJECTED_CLAIM = """
Claim I reject :
Evidence it would need :
What I would measure to settle it :
"""
print(REJECTED_CLAIM)

# %%
claim("AI PROPOSAL", AGENT_BRIEF)
claim("REVIEW VERDICT", REJECTED_CLAIM)

claim(
    "FINITE EXPERIMENT",
    f"Planning one route expanded {expanded} nodes and made {round_trips} adapter "
    f"round trips; {100 * adapter_time / elapsed:.0f}% of wall clock was adapter "
    f"latency at {ADAPTER_LATENCY_S * 1000:.1f} ms per call.",
    support={
        "nodesExpanded": expanded,
        "roundTrips": round_trips,
        "wallClockSeconds": elapsed,
        "adapterLatencySeconds": ADAPTER_LATENCY_S,
        "ioFraction": round(adapter_time / elapsed, 3),
    },
)

non_claim(
    "The adapter here is a sleep, not a database. It reproduces the *shape* of an "
    "I/O-dominated workload — fixed latency per call, no batching, no connection "
    "reuse, no variance — and nothing else. It cannot support any claim about a "
    "real database's behaviour under load, and the I/O fraction it produces is a "
    "consequence of the latency constant chosen above."
)

emit()

# %% [markdown]
# ## 5. Transfer — the module's exit
#
# 1. Separate the two claims for one system you actually use: name one cost that
#    an algorithmic change would move, and one that it would not.
# 2. You rejected conclusion (d), which was built from a *true* asymptotic claim.
#    State the general form of that error in one sentence.
# 3. Module 6 chooses representations. Which of the numbers in this dossier would
#    change if `seen` became a list instead of a set, and which would not?
#
# ---
#
# ## Attributions
#
# Authored for this course. No external material vendored.
