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
# # Bench m34-s3 — Constraint–Objective–Relaxation Sheet
#
# **Session 34.3 — Constraints and relaxations change the mathematical object.**
# Rungs: **debug and defend** (primary), review and verify.
#
# Constraint propagation is the workhorse of every CSP solver, and arc
# consistency is the standard first thing to run. It prunes domains, it is fast,
# and it is **sound** — it never removes a value that belongs to a solution.
#
# It is also **incomplete**, and the gap between those two words is where people
# put their trust by mistake. This bench builds a CSP that is fully arc-consistent
# with every domain non-empty, and has **no solutions at all**.
#
# **Requires:** Python 3.12+. Standard library only.

# %%
from _fixture import *  # noqa: F401,F403,E402  (sets up sys.path)

import sys  # noqa: E402
from itertools import product  # noqa: E402

from atlas_bench import (  # noqa: E402
    bench, check, checkpoint, claim, emit, non_claim, predict, resolve, reveal,
)

assert sys.version_info >= (3, 12)

bench(module=34, session=3, emits="Constraint–Objective–Relaxation Sheet",
      rungs=["debug-and-defend", "review-and-verify"])

# %% [markdown]
# ## 1. A three-colouring problem
#
# Four variables, each with the domain `{r, g, b}`, and a not-equal constraint on
# every pair — a 4-clique. Four mutually adjacent regions cannot be coloured with
# three colours, so this has no solution. Arc consistency does not notice.

# %%
VARIABLES = ("a", "b", "c", "d")
DOMAIN = ("r", "g", "b")
EDGES = [(x, y) for i, x in enumerate(VARIABLES) for y in VARIABLES[i + 1:]]


def not_equal(value_x, value_y) -> bool:
    return value_x != value_y


print(f"variables: {VARIABLES}")
print(f"domain   : {DOMAIN}")
print(f"constraints ({len(EDGES)} pairs, all not-equal): {EDGES}")

# %% [markdown]
# ## 2. Arc consistency
#
# A value `v` for `x` is **supported** when some value for `y` satisfies the
# constraint. AC-3 deletes unsupported values until nothing changes.

# %%
def arc_consistent(domains: dict) -> dict:
    domains = {variable: set(values) for variable, values in domains.items()}
    queue = [(x, y) for x, y in EDGES] + [(y, x) for x, y in EDGES]
    removals = 0
    while queue:
        x, y = queue.pop(0)
        revised = False
        for value in sorted(domains[x]):
            if not any(not_equal(value, other) for other in domains[y]):
                domains[x].discard(value)
                removals += 1
                revised = True
        if revised:
            queue.extend((z, x) for z in VARIABLES if z != x)
    return {"domains": domains, "removals": removals}


def solutions(domains: dict) -> list:
    found = []
    for assignment in product(*(sorted(domains[v]) for v in VARIABLES)):
        mapping = dict(zip(VARIABLES, assignment))
        if all(not_equal(mapping[x], mapping[y]) for x, y in EDGES):
            found.append(mapping)
    return found


# %%
predict(
    "Run arc consistency on a 4-clique with three colours. Does any domain become "
    "empty — and how many solutions does the problem actually have?",
    answer="",  # <- fill in
    confidence="",  # sure / fairly sure / guessing
)

# %% [markdown]
# ## 3. Debug — propagate, then enumerate

# %%
initial = {variable: set(DOMAIN) for variable in VARIABLES}
propagated = arc_consistent(initial)
exhaustive = solutions(propagated["domains"])

print(f"{'variable':>10}  {'domain before':>16}  {'domain after':>16}")
for variable in VARIABLES:
    print(f"{variable:>10}  {str(sorted(DOMAIN)):>16}  "
          f"{str(sorted(propagated['domains'][variable])):>16}")

print(f"\nvalues removed by propagation: {propagated['removals']}")
print(f"any domain empty            : "
      f"{any(not values for values in propagated['domains'].values())}")
print(f"solutions found by exhaustive search: {len(exhaustive)}")

checkpoint("propagation removes nothing", propagated["removals"] == 0)
checkpoint("every domain is still full",
           all(values == set(DOMAIN)
               for values in propagated["domains"].values()))
checkpoint("so the CSP is arc-consistent",
           not any(not values for values in propagated["domains"].values()))
checkpoint("and it has no solutions whatsoever", exhaustive == [],
           f"{len(DOMAIN) ** len(VARIABLES)} candidate assignments, all "
           f"violating some pair")

# %%
resolve(
    "Run arc consistency on a 4-clique with three colours. Does any domain become "
    "empty — and how many solutions does the problem actually have?",
    "matched",  # matched / diverged / partial
)

# %%
reveal(
    "Run arc consistency on a 4-clique with three colours. Does any domain become "
    "empty — and how many solutions does the problem actually have?",
    """
    No domain shrinks by even one value, and there are **zero** solutions.

    Arc consistency is doing exactly what it promises. It asks a *pairwise*
    question: for each value of `a`, is there some value of `b` that differs from
    it? With three colours and a not-equal constraint the answer is always yes —
    pick either of the other two. Every value is supported, so nothing is removed,
    and propagation reaches a fixed point immediately.

    But the problem is unsolvable for a reason no pair can see. Four mutually
    adjacent variables need four distinct colours, and there are three. That is a
    property of the whole 4-clique, and arc consistency never examines more than
    two variables at a time. The obstruction is real, structural, and invisible to
    the instrument.

    So **sound** and **complete** come apart, and it is worth being exact about
    which is which. Arc consistency is *sound*: every value it removes genuinely
    belongs to no solution, so it can never make a solvable problem look
    unsolvable. It is *incomplete*: a fixed point with all domains non-empty does
    not mean a solution exists. One direction of the implication holds and the
    other does not.

    That asymmetry is the practical content. An empty domain after propagation is
    a **proof** of unsatisfiability — trustworthy, and cheap. Non-empty domains
    after propagation are **not** a proof of satisfiability, and reading them that
    way is the error. A solver that stopped here and reported "consistent" would
    be reporting the absence of a pairwise contradiction and letting the caller
    hear something much stronger.

    Which is why propagation is a *pruning* step and not a decision procedure. The
    search still has to happen; propagation only makes it smaller. Every real
    solver alternates the two, and the reason it alternates is exactly this bench's
    result — propagation alone can sit at a fixed point on an unsatisfiable problem
    forever.

    The general shape has appeared throughout this course. Bench `m12-s4` found
    `isinstance` checking names and being read as checking behaviour. Bench
    `m33-s2` found a bounded search that proves a lower bound and not its converse.
    Each time: an instrument answering a narrower question than the one its result
    gets used for, and each time the repair is the same — state which question, and
    which direction of the implication you are entitled to.
    """,
)

# %% [markdown]
# ## 4. Verify — where propagation does earn its keep

# %%
def with_fixed(variable: str, value: str) -> dict:
    domains = {v: set(DOMAIN) for v in VARIABLES}
    domains[variable] = {value}
    return domains


SCENARIOS = {
    "4-clique, 3 colours, nothing fixed": {v: set(DOMAIN) for v in VARIABLES},
    "4-clique, 3 colours, a = r": with_fixed("a", "r"),
    "triangle only (a, b, c), 3 colours":
        {v: set(DOMAIN) for v in VARIABLES},
}

print(f"{'scenario':>36}  {'removed':>7}  {'empty domain':>12}  {'solutions':>9}")
scenario_rows = {}
for label, domains in SCENARIOS.items():
    if label.startswith("triangle"):
        saved_edges = list(EDGES)
        EDGES[:] = [(x, y) for x, y in saved_edges if "d" not in (x, y)]
    outcome = arc_consistent(domains)
    found = solutions(outcome["domains"])
    empty = any(not values for values in outcome["domains"].values())
    scenario_rows[label] = {"removed": outcome["removals"], "empty": empty,
                            "solutions": len(found)}
    print(f"{label:>36}  {outcome['removals']:>7}  {str(empty):>12}  "
          f"{len(found):>9}")
    if label.startswith("triangle"):
        EDGES[:] = saved_edges

clique = scenario_rows["4-clique, 3 colours, nothing fixed"]
triangle = scenario_rows["triangle only (a, b, c), 3 colours"]

checkpoint("the unsatisfiable clique is never detected by propagation",
           not clique["empty"] and clique["solutions"] == 0)
checkpoint("removing one variable makes the problem satisfiable",
           triangle["solutions"] > 0,
           f"{triangle['solutions']} solutions once d is dropped — the "
           f"obstruction was the fourth mutually adjacent variable")
checkpoint("propagation still removed nothing there either",
           triangle["removed"] == 0,
           "arc consistency is equally silent on the solvable version, which is "
           "why its silence carries no information")

# %% [markdown]
# ## 5. Review and verify — what does a propagation result license?

# %%
OUTCOMES = {
    "a": "Propagation emptied a domain.",
    "b": "Propagation reached a fixed point with all domains non-empty.",
    "c": "Propagation removed 40% of the values.",
    "d": "Propagation left every domain at full size.",
}
for key, text in OUTCOMES.items():
    print(f"{key}. {text}")


def proves_something(key: str) -> bool:
    """True when this outcome PROVES a satisfiability fact."""
    raise NotImplementedError("Judge each propagation outcome as a proof")


# %%
check("proves_something", proves_something,
      [(("a",), True), (("b",), False), (("c",), False), (("d",), False)])
print()
print("(a) is the only proof, and it proves UNsatisfiability. (b) is the one this")
print("bench refutes directly. (c) and (d) are both about how much work was done,")
print("which is a statement about the propagator's leverage on this instance and")
print("not about whether a solution exists.")

# %% [markdown]
# ## 6. The constraint–objective–relaxation sheet

# %%
RELAXATION_SHEET = """
The original problem, with variables, domains, and every constraint:
The propagator I ran, and the question it asks:
Its result, and the direction of implication it licenses:
The obstruction it could not see, and the arity that would have been needed:
Why an empty domain is a proof and a non-empty one is not:
The relaxation I would solve instead, and what its optimum bounds:
What I must still search for after propagation stops:
"""
print(RELAXATION_SHEET)

# %%
claim("DEFENDED REPAIR", RELAXATION_SHEET)

claim(
    "LOCAL REFERENCE RESULT",
    f"On a {len(VARIABLES)}-variable clique with domain {list(DOMAIN)} and "
    f"not-equal constraints on all {len(EDGES)} pairs, arc consistency removes "
    f"{propagated['removals']} values, leaves every domain at full size, and "
    f"terminates arc-consistent — while exhaustive enumeration of all "
    f"{len(DOMAIN) ** len(VARIABLES)} assignments finds {len(exhaustive)} "
    f"solutions. Dropping one variable makes the same propagator equally silent "
    f"on a problem that has {triangle['solutions']} solutions, so its silence "
    f"distinguishes nothing.",
    support={"variables": list(VARIABLES), "domain": list(DOMAIN),
             "edges": [list(e) for e in EDGES],
             "removals": propagated["removals"],
             "domainsAfter": {v: sorted(values) for v, values
                              in propagated["domains"].items()},
             "solutionCount": len(exhaustive),
             "candidateAssignments": len(DOMAIN) ** len(VARIABLES),
             "scenarios": scenario_rows},
)

non_claim(
    "This is one four-variable CSP with a three-value domain and binary "
    "constraints, propagated with a textbook AC-3 and checked by enumerating all "
    "81 assignments. It establishes that arc consistency is incomplete and that "
    "this instance is the counterexample. It does not establish anything about "
    "stronger consistency levels — path consistency or k-consistency would detect "
    "this clique, at higher cost — nor about propagation's practical value, which "
    "is real and is measured in search-tree size rather than in decisions. It "
    "measures no runtime and models no objective function, so the "
    "relaxation half of this session's artifact is argued rather than executed "
    "here."
)

emit()

# %% [markdown]
# ## 7. Transfer
#
# 1. The propagator was silent on a solvable problem and an unsolvable one alike.
#    Write the rule this implies about reading a "no contradiction found" result.
# 2. One direction of the implication holds and the other does not. Name both
#    directions precisely, and say which one a solver may act on.
# 3. Bench `m33-s2` found a bounded search proving a lower bound and not its
#    converse. State the property these two instruments share.
#
# ---
#
# ## Attributions
#
# Module 34 is authoring-only and has no checked-in reference model. The CSP, the
# AC-3 propagator, and the exhaustive oracle are this bench's own.
