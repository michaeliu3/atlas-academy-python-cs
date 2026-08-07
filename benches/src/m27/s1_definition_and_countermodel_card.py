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
# # Bench m27-s1 — definition and countermodel card
#
# **Session 27.1 — Definitions, logic, and countermodels.** Rungs: recognize, trace.
#
# The session asks for a definition stated precisely *and* the smallest
# countermodel that separates it from a near-miss. A workbook can print a
# countermodel. Only a search can establish it is the smallest — which is what
# makes it a witness rather than an anecdote.
#
# **Requires:** Python 3.12+. Standard library only.

# %%
from _fixture import *  # noqa: F401,F403,E402  (sets up sys.path)

import sys  # noqa: E402
from itertools import combinations, product  # noqa: E402

from atlas_bench import (  # noqa: E402
    bench, check, checkpoint, claim, emit, non_claim, predict, resolve, reveal,
)
from module27_reference import classify_relation  # noqa: E402

assert sys.version_info >= (3, 12)

bench(module=27, session=1, emits="definition and countermodel card",
      rungs=["recognize", "trace"])

# %% [markdown]
# ## 1. Recognize — three properties, one definition
#
# An equivalence relation is reflexive, symmetric, and transitive. Drop any one
# and the definition changes. Which drop is easiest to overlook?

# %%
predict(
    "What is the smallest node count for which a relation can be reflexive and "
    "transitive but NOT an equivalence relation — 1, 2, or 3?",
    answer="",  # <- fill in
    confidence="",  # sure / fairly sure / guessing
)

# %% [markdown]
# ## 2. Trace — search every relation on 1, 2, and 3 nodes

# %%
def search_smallest_witness():
    """Smallest reflexive+transitive relation that is not an equivalence."""
    for size in (1, 2, 3):
        nodes = tuple(str(i + 1) for i in range(size))
        all_pairs = list(product(nodes, nodes))
        required = [(n, n) for n in nodes]
        optional = [p for p in all_pairs if p[0] != p[1]]
        for count in range(len(optional) + 1):
            for extra in combinations(optional, count):
                pairs = required + list(extra)
                report = classify_relation(nodes, pairs)
                if (report.reflexive and report.transitive
                        and not report.is_equivalence_relation):
                    return nodes, tuple(pairs), report
    return None


nodes, pairs, witness = search_smallest_witness()
print(f"smallest witness: nodes={nodes} pairs={pairs}")
print(f"  reflexive={witness.reflexive} symmetric={witness.symmetric} "
      f"transitive={witness.transitive}")
print(f"  equivalence={witness.is_equivalence_relation}  "
      f"partial order={witness.is_partial_order}")
print(f"  symmetry counterexample: {witness.symmetry_counterexample}")

checkpoint("the witness has two nodes, not one or three", len(nodes) == 2)
checkpoint("it fails on symmetry alone", witness.reflexive and witness.transitive
           and not witness.symmetric)
checkpoint("the reference names the offending pair",
           witness.symmetry_counterexample is not None,
           f"{witness.symmetry_counterexample}")

# %%
resolve(
    "What is the smallest node count for which a relation can be reflexive and "
    "transitive but NOT an equivalence relation — 1, 2, or 3?",
    "matched",  # matched / diverged / partial
)

# %%
reveal(
    "What is the smallest node count for which a relation can be reflexive and "
    "transitive but NOT an equivalence relation — 1, 2, or 3?",
    """
    Two.

    On one node the only reflexive relation is {(1,1)}, which is symmetric and
    transitive by having nothing to violate. Every property holds vacuously, so
    one node cannot separate anything — a fact worth noticing, because vacuous
    truth is where most sloppy definitions survive.

    On two nodes, {(1,1), (2,2), (1,2)} is reflexive and transitive and not
    symmetric: 1 relates to 2 but 2 does not relate to 1. That single missing
    pair is the whole separation, and the reference hands it back as
    `symmetry_counterexample`.

    Notice what the same relation *is*: a partial order. Reflexive, transitive,
    antisymmetric. So the witness does not merely break equivalence — it lands on
    a different named structure, which is the useful form of a countermodel. It
    does not just say "not an equivalence"; it says "this is an order instead."

    That is why the session wants the *smallest* one. A large counterexample
    proves the same thing while hiding which property did the work.
    """,
)

# %% [markdown]
# ## 3. Recognize — classify four relations
#
# For each, name the strongest structure it satisfies.

# %%
RELATIONS = {
    "a": (("1", "2", "3"), [("1", "1"), ("2", "2"), ("3", "3")]),
    "b": (("1", "2"), [("1", "1"), ("2", "2"), ("1", "2"), ("2", "1")]),
    "c": (("1", "2"), [("1", "1"), ("2", "2"), ("1", "2")]),
    "d": (("1", "2", "3"), [("1", "2"), ("2", "3")]),
}
for key, (ns, ps) in RELATIONS.items():
    print(f"{key}. nodes={ns} pairs={ps}")


def strongest(key: str) -> str:
    """One of: equivalence, partial-order, neither."""
    raise NotImplementedError("Classify each relation")


# %%
check("strongest", strongest,
      [(("a",), "equivalence"), (("b",), "equivalence"),
       (("c",), "partial-order"), (("d",), "neither")])
print()
print("(d) is the trap: it is antisymmetric and looks order-like, but it is")
print("neither reflexive nor transitive — (1,3) is missing.")

# %%
report_d = classify_relation(*RELATIONS["d"])
print(f"reference on (d): reflexive={report_d.reflexive} "
      f"transitive={report_d.transitive} "
      f"missing transitive pairs={report_d.missing_transitive_pairs}")

# %% [markdown]
# ## 4. The card

# %%
COUNTERMODEL_CARD = """
Definition, stated precisely:
The near-miss it is separated from:
The smallest countermodel, and the single property it violates:
What structure the countermodel is instead:
"""
print(COUNTERMODEL_CARD)

# %%
claim("DEFINITION / MODEL", COUNTERMODEL_CARD)

claim(
    "COUNTEREXAMPLE",
    f"The smallest reflexive-and-transitive non-equivalence has {len(nodes)} "
    f"nodes: {pairs}, failing symmetry at "
    f"{witness.symmetry_counterexample}; it is a partial order.",
    support={"nodes": list(nodes), "pairs": [list(p) for p in pairs],
             "symmetryCounterexample": list(witness.symmetry_counterexample),
             "isPartialOrder": witness.is_partial_order},
)

non_claim(
    "The search covered relations on at most three nodes. That establishes "
    "minimality among those, not a general theorem about relation size, and it "
    "says nothing about relations whose separating property is transitivity "
    "rather than symmetry — a different search."
)

emit()

# %% [markdown]
# ## 5. Transfer
#
# 1. On one node every property held vacuously. Name one place elsewhere in this
#    course where a vacuous case makes a wrong definition look correct.
# 2. The countermodel was also a partial order. Write the one-sentence rule about
#    what makes a countermodel useful rather than merely valid.
#
# ---
#
# ## Attributions
#
# Probes `public/downloads/module27_reference.py` — `classify_relation` and its
# `symmetry_counterexample` / `missing_transitive_pairs` fields. Not
# reimplemented. The minimality search and the classification exercise are this
# bench's own.
