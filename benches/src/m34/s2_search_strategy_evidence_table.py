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
# # Bench m34-s2 — Search-Strategy Evidence Table
#
# **Session 34.2 — Search traces need their theorem conditions.** Rungs: **debug
# and defend** (primary), review and verify.
#
# A* "finds the optimal path" is a theorem with a **precondition**: the heuristic
# must never overestimate. Drop that condition and A* still runs, still terminates,
# still returns a path — a shorter search for a longer route, with nothing in the
# output marking the difference.
#
# This bench runs the same search with four heuristics on the same graph and puts
# cost against nodes expanded, so the trade is visible as two numbers rather than
# one verdict.
#
# **Requires:** Python 3.12+. Standard library only.

# %%
from _fixture import *  # noqa: F401,F403,E402  (sets up sys.path)

import heapq  # noqa: E402
import sys  # noqa: E402

from atlas_bench import (  # noqa: E402
    bench, check, checkpoint, claim, emit, non_claim, predict, resolve, reveal,
)

assert sys.version_info >= (3, 12)

bench(module=34, session=2, emits="Search-Strategy Evidence Table",
      rungs=["debug-and-defend", "review-and-verify"])

# %% [markdown]
# ## 1. A four-node graph with two routes to the goal
#
# `s -> a -> b -> g` costs 3. The direct edge `s -> b` costs 5, so going through
# it costs 6. A heuristic that badly overestimates `a` will steer into the
# expensive route and — with a closed set — never come back.

# %%
GRAPH = {
    "s": {"a": 1, "b": 5},
    "a": {"b": 1},
    "b": {"g": 1},
    "g": {},
}

# True shortest distance from each node to the goal. This is what an admissible
# heuristic must not exceed.
TRUE_COST_TO_GOAL = {"s": 3, "a": 2, "b": 1, "g": 0}

HEURISTICS = {
    "zero (Dijkstra)": {n: 0 for n in GRAPH},
    "perfect": dict(TRUE_COST_TO_GOAL),
    "admissible, weak": {"s": 1, "a": 1, "b": 1, "g": 0},
    "inadmissible": {"s": 0, "a": 8, "b": 1, "g": 0},
}

print(f"{'node':>5}  {'true cost to goal':>17}  " +
      "  ".join(f"{name:>16}" for name in HEURISTICS))
for node in GRAPH:
    row = "  ".join(f"{HEURISTICS[name][node]:>16}" for name in HEURISTICS)
    print(f"{node:>5}  {TRUE_COST_TO_GOAL[node]:>17}  {row}")


def is_admissible(heuristic) -> bool:
    """Never overestimates the true remaining cost."""
    return all(heuristic[n] <= TRUE_COST_TO_GOAL[n] for n in GRAPH)


print()
for name, heuristic in HEURISTICS.items():
    offenders = [n for n in GRAPH if heuristic[n] > TRUE_COST_TO_GOAL[n]]
    print(f"{name:>18}: admissible = {is_admissible(heuristic)}"
          + (f"  (overestimates at {offenders})" if offenders else ""))

# %% [markdown]
# ## 2. A*

# %%
def a_star(heuristic) -> dict:
    """Textbook A* *graph search*: a node is expanded at most once.

    The closed set is what makes this the common implementation and what makes
    admissibility load-bearing. A variant that re-opens nodes when a cheaper path
    appears is far more forgiving — it recovers the optimum here even with the
    broken heuristic — which is precisely why "we use A*" does not identify the
    guarantee you have.
    """
    frontier = [(heuristic["s"], 0, "s", ["s"])]
    closed: set[str] = set()
    best_known = {"s": 0}
    expanded = 0
    while frontier:
        _, cost, node, path = heapq.heappop(frontier)
        if node == "g":
            return {"cost": cost, "path": path, "expanded": expanded}
        if node in closed:
            continue
        closed.add(node)
        expanded += 1
        for neighbour, step in GRAPH[node].items():
            if neighbour in closed:
                continue
            new_cost = cost + step
            if new_cost < best_known.get(neighbour, float("inf")):
                best_known[neighbour] = new_cost
                heapq.heappush(
                    frontier,
                    (new_cost + heuristic[neighbour], new_cost, neighbour,
                     path + [neighbour]),
                )
    return {"cost": None, "path": None, "expanded": expanded}


# %%
predict(
    "Four heuristics on the same graph. The inadmissible one overestimates badly "
    "on the cheap route and underestimates on the expensive one. What path does "
    "A* return with it, and does anything in the result say it is wrong?",
    answer="",  # <- fill in
    confidence="",  # sure / fairly sure / guessing
)

# %% [markdown]
# ## 3. Debug — run all four

# %%
OPTIMAL_COST = 3

print(f"{'heuristic':>18}  {'admissible':>10}  {'cost':>5}  {'expanded':>8}  path")
runs = {}
for name, heuristic in HEURISTICS.items():
    outcome = a_star(heuristic)
    runs[name] = {**outcome, "admissible": is_admissible(heuristic),
                  "optimal": outcome["cost"] == OPTIMAL_COST}
    print(f"{name:>18}  {str(runs[name]['admissible']):>10}  "
          f"{outcome['cost']:>5}  {outcome['expanded']:>8}  "
          f"{' -> '.join(outcome['path'])}")

admissible_runs = {k: v for k, v in runs.items() if v["admissible"]}
inadmissible = runs["inadmissible"]

print(f"\ntrue optimal cost: {OPTIMAL_COST}")
print(f"every admissible heuristic found it: "
      f"{all(v['optimal'] for v in admissible_runs.values())}")
print(f"the inadmissible one returned cost {inadmissible['cost']} "
      f"after expanding {inadmissible['expanded']} nodes")

checkpoint("every admissible heuristic returns the optimal cost",
           all(v["optimal"] for v in admissible_runs.values()),
           f"{[k for k in admissible_runs]} all cost {OPTIMAL_COST}")
checkpoint("the inadmissible one does not",
           not inadmissible["optimal"],
           f"cost {inadmissible['cost']} against an optimum of {OPTIMAL_COST}")
checkpoint("and it expanded FEWER nodes to get there",
           inadmissible["expanded"] < runs["zero (Dijkstra)"]["expanded"],
           f"{inadmissible['expanded']} against "
           f"{runs['zero (Dijkstra)']['expanded']} — it looks more efficient")
checkpoint("a better heuristic expands fewer nodes among the admissible ones",
           runs["perfect"]["expanded"] <= runs["zero (Dijkstra)"]["expanded"],
           f"perfect {runs['perfect']['expanded']}, "
           f"weak {runs['admissible, weak']['expanded']}, "
           f"zero {runs['zero (Dijkstra)']['expanded']}")

# %%
resolve(
    "Four heuristics on the same graph. The inadmissible one overestimates badly "
    "on the cheap route and underestimates on the expensive one. What path does "
    "A* return with it, and does anything in the result say it is wrong?",
    "matched",  # matched / diverged / partial
)

# %%
reveal(
    "Four heuristics on the same graph. The inadmissible one overestimates badly "
    "on the cheap route and underestimates on the expensive one. What path does "
    "A* return with it, and does anything in the result say it is wrong?",
    """
    It returns `s -> b -> g` at cost **6**, against an optimum of **3** — and it
    expands 2 nodes where Dijkstra expands 3. Nothing in the result says anything
    is wrong.

    That combination is what makes the failure expensive. The search terminated
    normally. It returned a genuine path: those edges exist, the cost is correctly
    computed, and every number in the output is accurate. Read the trace and it
    looks like a *better* run than the admissible ones, because the headline
    efficiency metric — nodes expanded — improved.

    So a benchmark comparing heuristics on expansion count alone would rank the
    broken one first. You need **both** columns, and the cost column is the one
    that carries the correctness claim.

    The mechanism is a single inequality. A* explores by `f = g + h`, and its
    optimality proof needs `h(n) ≤` the true remaining cost, for every `n`. This
    heuristic assigns **8** to `a`, whose true remaining cost is 2. So `a` looks
    like an 9-cost prospect while `b` — reached directly for 5 — looks like a 6.
    A* pops `b` first, **closes** it at cost 5, and expands to the goal.

    The closed set is what makes the damage permanent. When `a` is finally popped
    and offers `b` at cost 2 — genuinely cheaper — `b` is already closed, so the
    improvement is discarded unexamined. The search then returns the 6-cost path
    it had committed to.

    That detail matters more than it looks. A variant that *re-opens* a closed node
    when a cheaper path arrives recovers the optimum here even with this broken
    heuristic. So "we use A*" does not identify which guarantee you have: the
    textbook graph-search form needs the precondition, the re-opening form is more
    forgiving and pays for it in repeated work, and the two are both called A*.

    Two details worth keeping.

    First, the zero heuristic is admissible — 0 never overestimates a
    non-negative cost — which is why plain Dijkstra is A* with `h = 0` and is
    optimal for free. The heuristic is purely an efficiency device: it can only
    reduce how much you explore, never change *which answer is correct*, and that
    is exactly the property overestimation destroys.

    Second, on a graph this small the three admissible heuristics all expand the
    same 3 nodes — there is nothing to prune. The efficiency payoff from a tighter
    admissible bound is real and needs a bigger search space to show; what this
    graph isolates is the *correctness* half, which is the half with a
    precondition.

    Which gives the reviewable question. Not "is this heuristic good?" but **"what
    is the argument that it never overestimates?"** That argument is a proof
    obligation attached to the heuristic, and it usually goes unstated — a
    straight-line distance under a metric where movement is not straight-line, a
    hand-tuned weight, a learned estimator with no bound at all. Each of those runs
    fine and each voids the theorem.

    Bench `m14-s5` found bisect returning a confident wrong commit when its
    monotonicity precondition failed. Same shape: an algorithm whose guarantee has
    a condition the tool cannot check, returning a well-formed answer either way.
    """,
)

# %% [markdown]
# ## 4. Verify — the precondition, checked directly

# %%
print(f"{'heuristic':>18}  {'max overestimate':>17}  {'optimal result':>14}")
violations = {}
for name, heuristic in HEURISTICS.items():
    excess = max(heuristic[n] - TRUE_COST_TO_GOAL[n] for n in GRAPH)
    violations[name] = {"maxOverestimate": excess, "optimal": runs[name]["optimal"]}
    print(f"{name:>18}  {excess:>17}  {str(runs[name]['optimal']):>14}")

print(f"\nheuristics with a positive overestimate: "
      f"{[k for k, v in violations.items() if v['maxOverestimate'] > 0]}")
print(f"heuristics that returned a suboptimal path: "
      f"{[k for k, v in violations.items() if not v['optimal']]}")

checkpoint("the two lists coincide exactly",
           [k for k, v in violations.items() if v["maxOverestimate"] > 0]
           == [k for k, v in violations.items() if not v["optimal"]],
           "on this graph, overestimating is precisely what broke optimality")
checkpoint("the check is cheap and local",
           len(GRAPH) == len(TRUE_COST_TO_GOAL),
           "one comparison per node — far cheaper than the search it protects")
checkpoint("but it needs the true costs, which is what you were searching for",
           TRUE_COST_TO_GOAL["s"] == OPTIMAL_COST,
           "so this check is available in a bench and not at runtime — the real "
           "obligation is a proof about the heuristic, not a table")

# %% [markdown]
# ## 5. Review and verify — audit four heuristics

# %%
PROPOSALS = {
    "a": "Straight-line distance, on a grid where movement is 4-directional.",
    "b": "Straight-line distance, on a grid where movement is 8-directional "
         "with diagonal cost 1.",
    "c": "Zero everywhere.",
    "d": "A learned estimate of remaining cost, trained on solved instances.",
}
for key, text in PROPOSALS.items():
    print(f"{key}. {text}")


def guaranteed_admissible(key: str) -> bool:
    """True when the heuristic provably never overestimates."""
    raise NotImplementedError("Judge each proposal against the precondition")


# %%
check("guaranteed_admissible", guaranteed_admissible,
      [(("a",), True), (("b",), False), (("c",), True), (("d",), False)])
print()
print("(a) and (b) are the same formula and differ in the movement model: with")
print("4-directional movement the straight line is a lower bound, and with cheap")
print("diagonals it can exceed the true cost. The heuristic is not admissible or")
print("inadmissible on its own — only against a stated cost model. (d) is the one")
print("that ships: a learned estimator is accurate on average and bounded nowhere.")

# %% [markdown]
# ## 6. The search-strategy evidence table

# %%
EVIDENCE_TABLE = """
Strategy | Heuristic | Admissible? | Argument for it | Cost found | Nodes expanded
---------+-----------+-------------+-----------------+------------+---------------
         |           |             |                 |            |
         |           |             |                 |            |

The theorem I am relying on, with its precondition stated:
The argument that my heuristic satisfies that precondition:
The cost column and the expansion column, and why I need both:
What the run would look like if the precondition failed:
The cost model my heuristic is admissible with respect to:
"""
print(EVIDENCE_TABLE)

# %%
claim("DEFENDED REPAIR", EVIDENCE_TABLE)

claim(
    "LOCAL REFERENCE RESULT",
    f"On a {len(GRAPH)}-node weighted graph whose optimal path costs "
    f"{OPTIMAL_COST}, A* graph search with a closed set returns cost "
    f"{OPTIMAL_COST} under all {len(admissible_runs)} admissible heuristics and "
    f"cost {inadmissible['cost']} under an inadmissible one that overestimates "
    f"node 'a' by 6 — while expanding {inadmissible['expanded']} nodes against "
    f"Dijkstra's {runs['zero (Dijkstra)']['expanded']}, so it scores better on the "
    f"usual efficiency metric. The set of heuristics that overestimate and the set "
    f"that return a suboptimal path coincide exactly.",
    support={"graph": {k: dict(v) for k, v in GRAPH.items()},
             "trueCostToGoal": TRUE_COST_TO_GOAL,
             "optimalCost": OPTIMAL_COST,
             "heuristics": {k: dict(v) for k, v in HEURISTICS.items()},
             "runs": {k: {"cost": v["cost"], "path": v["path"],
                          "expanded": v["expanded"],
                          "admissible": v["admissible"], "optimal": v["optimal"]}
                      for k, v in runs.items()},
             "violations": violations},
)

non_claim(
    "This is one seven-node graph with hand-chosen weights and four hand-written "
    "heuristics. It establishes that A* returns a well-formed suboptimal answer "
    "when admissibility fails, and that expansion count alone ranks the broken "
    "heuristic first. It does not establish how often real heuristics are "
    "inadmissible, does not distinguish admissibility from the stronger "
    "*consistency* condition that graph-search A* actually needs to avoid "
    "re-expanding nodes, and measures no runtime — nodes expanded is a proxy for "
    "cost that ignores how expensive evaluating the heuristic itself is, which is "
    "sometimes the dominant term."
)

emit()

# %% [markdown]
# ## 7. Transfer
#
# 1. The broken heuristic won on the efficiency metric. Write the rule this implies
#    about benchmarking search strategies.
# 2. The precondition check needed the true costs. Name what that means for
#    validating a heuristic in production, and what has to replace the check.
# 3. Bench `m14-s5` found bisect confidently wrong when its precondition failed.
#    State the property these two algorithms share.
#
# ---
#
# ## Attributions
#
# Module 34 is authoring-only and has no checked-in reference model. The graph, the
# four heuristics, the A* implementation, and the admissibility check are this
# bench's own.
