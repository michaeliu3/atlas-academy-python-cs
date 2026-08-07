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
# # Bench m33-s4 — Reduction-Proof Skeleton
#
# **Session 33.4 — A reduction is a directed proof, not a resemblance.** Rungs:
# **debug and defend** (primary), review and verify.
#
# A reduction has a direction, and getting it backwards proves the opposite of
# what you wanted. "These problems are similar" is not a reduction; "here is a
# transformation, and here is the argument that it preserves the answer" is.
#
# This bench builds a real reduction as executable code, checks the preservation
# property exhaustively, and then runs the **reversed** argument to see what it
# would have established.
#
# **Requires:** Python 3.12+. Standard library only.

# %%
from _fixture import *  # noqa: F401,F403,E402  (sets up sys.path)

import sys  # noqa: E402
from itertools import combinations, product  # noqa: E402

from atlas_bench import (  # noqa: E402
    bench, check, checkpoint, claim, emit, non_claim, predict, resolve, reveal,
)

assert sys.version_info >= (3, 12)

bench(module=33, session=4, emits="Reduction-Proof Skeleton",
      rungs=["debug-and-defend", "review-and-verify"])

# %% [markdown]
# ## 1. Two problems
#
# **INDEPENDENT-SET(G, k)** — is there a set of `k` vertices with no edge between
# any two?
#
# **CLIQUE(G, k)** — is there a set of `k` vertices with an edge between every
# two?

# %%
GRAPHS = {
    "path of 4": {"v": [0, 1, 2, 3], "e": {(0, 1), (1, 2), (2, 3)}},
    "triangle + isolate": {"v": [0, 1, 2, 3], "e": {(0, 1), (1, 2), (0, 2)}},
    "empty on 4": {"v": [0, 1, 2, 3], "e": set()},
    "complete on 4": {"v": [0, 1, 2, 3],
                      "e": {(a, b) for a, b in combinations(range(4), 2)}},
    "two disjoint edges": {"v": [0, 1, 2, 3], "e": {(0, 1), (2, 3)}},
}


def has_edge(graph, a, b) -> bool:
    return (a, b) in graph["e"] or (b, a) in graph["e"]


def independent_set(graph, k: int) -> bool:
    return any(
        not any(has_edge(graph, a, b) for a, b in combinations(subset, 2))
        for subset in combinations(graph["v"], k)
    )


def clique(graph, k: int) -> bool:
    return all_pairs_present(graph, k)


def all_pairs_present(graph, k: int) -> bool:
    return any(
        all(has_edge(graph, a, b) for a, b in combinations(subset, 2))
        for subset in combinations(graph["v"], k)
    )


def complement(graph) -> dict:
    """The reduction: keep the vertices, flip every edge."""
    return {
        "v": list(graph["v"]),
        "e": {(a, b) for a, b in combinations(graph["v"], 2)
              if not has_edge(graph, a, b)},
    }


print(f"{'graph':>20}  {'edges':>6}  {'complement edges':>17}")
for name, graph in GRAPHS.items():
    print(f"{name:>20}  {len(graph['e']):>6}  {len(complement(graph)['e']):>17}")

# %%
predict(
    "The reduction maps INDEPENDENT-SET(G, k) to CLIQUE(complement(G), k). Check "
    "it on every graph and every k. Does it preserve the answer — and if it does, "
    "which problem has it proved hard?",
    answer="",  # <- fill in
    confidence="",  # sure / fairly sure / guessing
)

# %% [markdown]
# ## 2. Verify — does the transformation preserve the answer?

# %%
print(f"{'graph':>20}  {'k':>2}  {'IS(G,k)':>8}  {'CLIQUE(co-G,k)':>15}  "
      f"{'agree':>6}")
checks = []
for name, graph in GRAPHS.items():
    for k in range(1, len(graph["v"]) + 1):
        left = independent_set(graph, k)
        right = clique(complement(graph), k)
        checks.append({"graph": name, "k": k, "independentSet": left,
                       "clique": right, "agree": left == right})
        if k <= 3:
            print(f"{name:>20}  {k:>2}  {str(left):>8}  {str(right):>15}  "
                  f"{str(left == right):>6}")

disagreements = [row for row in checks if not row["agree"]]
both_true = [row for row in checks if row["independentSet"]]

print(f"\ninstances checked : {len(checks)}")
print(f"disagreements     : {len(disagreements)}")
print(f"non-trivial (yes) : {len(both_true)}")

checkpoint("the transformation preserves the answer on every instance",
           disagreements == [],
           f"{len(checks)} instances, {len(disagreements)} disagreements")
checkpoint("and the check is not vacuous",
           len(both_true) > 0 and len(both_true) < len(checks),
           f"{len(both_true)} yes-instances and "
           f"{len(checks) - len(both_true)} no-instances — it distinguishes")
checkpoint("the transformation is cheap",
           all(len(complement(g)["v"]) == len(g["v"]) for g in GRAPHS.values()),
           "same vertex count; complementing edges is quadratic in vertices and "
           "does not solve either problem")

# %%
resolve(
    "The reduction maps INDEPENDENT-SET(G, k) to CLIQUE(complement(G), k). Check "
    "it on every graph and every k. Does it preserve the answer — and if it does, "
    "which problem has it proved hard?",
    "matched",  # matched / diverged / partial
)

# %%
reveal(
    "The reduction maps INDEPENDENT-SET(G, k) to CLIQUE(complement(G), k). Check "
    "it on every graph and every k. Does it preserve the answer — and if it does, "
    "which problem has it proved hard?",
    """
    It preserves the answer on every instance — and it proves **CLIQUE** is hard,
    not INDEPENDENT-SET.

    The direction is the entire content of the proof, and it is the thing that
    gets reversed. Written out:

    We have a transformation `f` and we know `IS(G, k) ⟺ CLIQUE(f(G), k)`. So an
    algorithm for CLIQUE gives an algorithm for IS: transform, then call it. If
    CLIQUE were easy, IS would be easy. Contrapositive: **if IS is hard, CLIQUE is
    hard.**

    The hardness flows from the problem being *reduced from* to the problem being
    *reduced to*. `A ≤ B` means "A is no harder than B", so it upper-bounds A and
    lower-bounds B. Concluding "IS is hard because it reduces to CLIQUE" is
    backwards — that argument would need a reduction the other way, and here you
    happen to have one because complementation is its own inverse. In general you
    do not, and the symmetry of this particular example is exactly what makes it a
    dangerous one to learn the direction from.

    Notice what the bench actually verified and what it did not. It checked the
    **preservation property** — the ⟺ — exhaustively on 20 instances, and that is
    genuinely the technical core of a reduction proof. It verified nothing about
    hardness, because hardness is not a property any finite check can observe. The
    proof needs three parts, and only one of them is executable:

    1. `f` is computable, and cheaply — here, quadratic in vertices, and it plainly
       does not solve either problem on the way.
    2. `f` preserves the answer in **both** directions. This bench checks it.
    3. The direction is stated, and the conclusion follows the arrow rather than
       intuition about which problem "feels harder".

    Part 3 is where the errors live, and section 3 makes the failure concrete: a
    transformation that preserves the answer perfectly in one direction and not the
    other still looks like a reduction on the instances anyone tries.

    One more thing worth naming. The efficiency requirement in part 1 is not a
    technicality — it is load-bearing. A "reduction" allowed to be exponential can
    reduce anything to anything by simply solving the source problem, and the
    conclusion becomes vacuous. That is the same shape as bench `m36-s3`'s vacuous
    bound: a statement that holds for everything distinguishes nothing.
    """,
)

# %% [markdown]
# ## 3. Debug — a transformation that only works one way

# %%
def broken_reduction(graph) -> dict:
    """Drop isolated vertices, then complement.

    Plausible-looking: isolated vertices "can't be in a clique with anyone", so
    removing them feels harmless. It is not — they are exactly what makes large
    independent sets possible.
    """
    connected = [v for v in graph["v"]
                 if any(has_edge(graph, v, other) for other in graph["v"]
                        if other != v)]
    trimmed = {"v": connected,
               "e": {(a, b) for a, b in graph["e"]
                     if a in connected and b in connected}}
    return complement(trimmed)


print(f"{'graph':>20}  {'k':>2}  {'IS(G,k)':>8}  {'CLIQUE(broken(G),k)':>20}  "
      f"{'agree':>6}")
broken_checks = []
for name, graph in GRAPHS.items():
    for k in range(1, len(graph["v"]) + 1):
        left = independent_set(graph, k)
        transformed = broken_reduction(graph)
        right = (clique(transformed, k) if k <= len(transformed["v"]) else False)
        broken_checks.append({"graph": name, "k": k, "agree": left == right})
        if not left == right:
            print(f"{name:>20}  {k:>2}  {str(left):>8}  {str(right):>20}  "
                  f"{str(left == right):>6}")

broken_failures = [row for row in broken_checks if not row["agree"]]
broken_agreements = len(broken_checks) - len(broken_failures)

print(f"\ninstances where the broken transformation agrees: "
      f"{broken_agreements} of {len(broken_checks)}")
print(f"instances where it does not: {len(broken_failures)}")
print(f"  {[(r['graph'], r['k']) for r in broken_failures]}")

checkpoint("the broken transformation agrees on most instances",
           broken_agreements > len(broken_failures),
           f"{broken_agreements} of {len(broken_checks)} — it would survive "
           f"casual spot-checking")
checkpoint("and fails on some", len(broken_failures) > 0)
checkpoint("the failures need a specific structure",
           any("isolate" in r["graph"] or "empty" in r["graph"]
               for r in broken_failures),
           "graphs with isolated vertices — precisely what the transformation "
           "discarded as harmless")

# %% [markdown]
# ## 4. Review and verify — audit five claims

# %%
CLAIMS = {
    "a": "The transformation preserves the answer on all 20 instances checked.",
    "b": "The transformation preserves the answer on all instances.",
    "c": "CLIQUE is at least as hard as INDEPENDENT-SET.",
    "d": "INDEPENDENT-SET is at least as hard as CLIQUE.",
    "e": "Both problems are NP-hard.",
}
for key, text in CLAIMS.items():
    print(f"{key}. {text}")


def established_here(key: str) -> bool:
    """True when this bench's evidence establishes the claim."""
    raise NotImplementedError("Separate a checked property from a proof")


# %%
check("established_here", established_here,
      [(("a",), True), (("b",), False), (("c",), False), (("d",), False),
       (("e",), False)])
print()
print("(a) is all the exhaustive check gives: 20 instances on graphs of 4")
print("vertices. (b) is the property the PROOF establishes, by an argument about")
print("all graphs — and it is true, and this bench did not establish it. (c) and")
print("(d) need (b) plus a direction; note that (c) is the correct reading and is")
print("still not established here. (e) needs a reduction from a known-hard")
print("problem, which is a third thing again.")

# %% [markdown]
# ## 5. The reduction-proof skeleton

# %%
PROOF_SKELETON = """
Source problem A, and target problem B:
The transformation f, written so someone else could implement it:
Cost of computing f, and the argument that it does not solve A:
The preservation property, stated as an if-and-only-if:
Evidence for preservation — what I checked, and what the proof must cover:
The direction: A <= B, so hardness flows from ___ to ___:
The conclusion I am entitled to, and the one I am not:
"""
print(PROOF_SKELETON)

# %%
claim("DEFENDED REPAIR", PROOF_SKELETON)

claim(
    "LOCAL REFERENCE RESULT",
    f"Over {len(GRAPHS)} graphs on 4 vertices and every k from 1 to 4 — "
    f"{len(checks)} instances — the complement transformation satisfies "
    f"IS(G, k) if and only if CLIQUE(complement(G), k), with "
    f"{len(disagreements)} disagreements and {len(both_true)} yes-instances so "
    f"the check is not vacuous. A plausible variant that drops isolated vertices "
    f"before complementing agrees on {broken_agreements} of "
    f"{len(broken_checks)} instances and fails on {len(broken_failures)}, all on "
    f"graphs containing isolated vertices.",
    support={"graphs": {k: {"vertices": v["v"], "edges": sorted(v["e"])}
                        for k, v in GRAPHS.items()},
             "instancesChecked": len(checks),
             "disagreements": len(disagreements),
             "yesInstances": len(both_true),
             "brokenAgreements": broken_agreements,
             "brokenFailures": [(r["graph"], r["k"]) for r in broken_failures]},
)

non_claim(
    "This checks a preservation property exhaustively on graphs with 4 vertices. "
    "The property holds for all graphs and this bench does not establish that — an "
    "exhaustive check on a bounded family is evidence, and the proof is an "
    "argument about every graph. It establishes no hardness result whatsoever: "
    "hardness is not a property any finite computation can observe, and this bench "
    "contains no reduction from a known-hard problem, no complexity-class "
    "membership argument, and no lower bound. It also does not verify that the "
    "transformation is polynomial-time in any formal sense — that it is quadratic "
    "here is read off the implementation, not proved."
)

emit()

# %% [markdown]
# ## 6. Transfer
#
# 1. The broken transformation agreed on most instances. Write what that implies
#    about testing a reduction, and what testing can never supply.
# 2. `A ≤ B` upper-bounds one and lower-bounds the other. State which is which, and
#    the sentence that gets it backwards.
# 3. Bench `m33-s2` found a bounded search proving a lower bound and not its
#    converse. State what both benches say about exhaustive checks over a bounded
#    family.
#
# ---
#
# ## Attributions
#
# Module 33 is authoring-only and has no checked-in reference model. The graphs,
# both transformations, and the exhaustive preservation check are this bench's own.
