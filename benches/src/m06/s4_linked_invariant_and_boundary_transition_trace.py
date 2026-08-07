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
# # Bench m06-s4 — linked-invariant and boundary-transition trace
#
# **Session 6.4 — Derive linked order and its invariants.** Rungs: **debug and
# defend** (primary), trace.
#
# A three-clause invariant checked after every state transition. Four transitions
# are clean. One is not, and the trace names both the transition and the clause —
# which is more than "the queue is broken" and is what a repair needs.
#
# **Requires:** Python 3.12+. Standard library only.

# %%
from _fixture import LinkedQueue  # noqa: E402

import sys  # noqa: E402

from atlas_bench import (  # noqa: E402
    bench, check, checkpoint, claim, emit, non_claim, predict, resolve, reveal,
)

assert sys.version_info >= (3, 12)

bench(module=6, session=4, emits="linked-invariant and boundary-transition trace",
      rungs=["debug-and-defend", "trace"])

# %% [markdown]
# ## 1. The invariant, one clause per property
#
# - **acyclic** — following `next` terminates;
# - **tail reachable** — `tail` is on the chain from `head`, and is last;
# - **length agrees** — the counted nodes equal the stored length.

# %%
TRANSITIONS = [
    ("empty -> one", lambda q: q.append("a")),
    ("one -> two", lambda q: q.append("b")),
    ("two -> one", lambda q: q.evict()),
    ("one -> empty", lambda q: q.evict()),
    ("empty -> one (again)", lambda q: q.append("c")),
]

predict(
    "The queue keeps head, tail, and length. Which boundary transition is most "
    "likely to break an invariant clause — filling up, or emptying out?",
    answer="",  # <- fill in
    confidence="",  # sure / fairly sure / guessing
)

# %% [markdown]
# ## 2. Trace — check all three clauses after every transition

# %%
queue = LinkedQueue()
trace = [{"step": "start", **queue.check_rep()}]

print(f"{'transition':>22}  {'acyclic':>8}  {'tail reachable':>15}  {'length agrees':>14}")
print(f"{'start':>22}  {str(trace[0]['acyclic']):>8}  "
      f"{str(trace[0]['tail reachable']):>15}  {str(trace[0]['length agrees']):>14}")

for label, action in TRANSITIONS:
    action(queue)
    state = {"step": label, **queue.check_rep()}
    trace.append(state)
    print(f"{label:>22}  {str(state['acyclic']):>8}  "
          f"{str(state['tail reachable']):>15}  {str(state['length agrees']):>14}")

failures = [
    (s["step"], clause)
    for s in trace
    for clause in ("acyclic", "tail reachable", "length agrees")
    if not s[clause]
]

print(f"\nviolations: {failures}")

first_step, first_clause = failures[0]
later = [f for f in failures if f[0] != first_step]

checkpoint("the FIRST violation is the emptying transition",
           first_step == "one -> empty", first_step)
checkpoint("and the first clause to fail is the tail pointer",
           first_clause == "tail reachable", first_clause)
checkpoint("the damage then PROPAGATES into the next transition",
           len(later) > 0,
           f"{len(later)} further violation(s): {later}")
checkpoint("acyclicity never breaks at all",
           not any(clause == "acyclic" for _, clause in failures),
           "the chain stays walkable throughout — it is simply wrong")

# %%
resolve(
    "The queue keeps head, tail, and length. Which boundary transition is most "
    "likely to break an invariant clause — filling up, or emptying out?",
    "matched",  # matched / diverged / partial
)

# %%
reveal(
    "The queue keeps head, tail, and length. Which boundary transition is most "
    "likely to break an invariant clause — filling up, or emptying out?",
    """
    Emptying out — and only the *tail reachable* clause.

    `evict` sets `head = node.next`. When the last node leaves, that correctly
    makes `head` None, and `length` correctly reaches zero. It never touches
    `tail`, which keeps pointing at the node that was just removed. The queue now
    claims to be empty and holds a reference to a departed node.

    At that moment only *one* clause fails. The chain from `head` is empty, so it
    is trivially acyclic. The counted nodes equal the stored length, because both
    are zero. Two thirds of the invariant is satisfied by a structure that is
    definitely wrong.

    Then watch the trace continue. The next `append` sees `tail is None` as
    False, takes the non-empty branch, and writes `tail.next = node` — attaching
    the new node to a node nothing else references. Now **two** clauses fail:
    the tail is still unreachable, and the counted length no longer matches.

    That escalation is the useful part:

    - **The first violated clause locates the defect.** `tail reachable` at
      `one -> empty` names the line to fix. The later failures are consequences,
      and chasing them leads you to `append`, which is innocent.
    - **The last visible error is the worst place to start.** By the time
      `length agrees` fails, two operations have run and the original mistake is
      off-screen. The workbook's rule — identify the first invalid inference, not
      the last visible error — is exactly this, and a per-transition trace is
      what makes it findable.
    - **Boundary transitions are where invariants die.** Empty-to-one and
      one-to-empty are the interesting states. A test that appends ten items and
      evicts five never visits either.
    - **A single boolean would have said less.** One `False` tells you the object
      is broken. Three named clauses across five transitions tell you it is the
      tail pointer, on the emptying transition, and that everything after is
      fallout.
    """,
)

# %% [markdown]
# ## 3. Debug and defend — the downstream corruption

# %%
corrupt = LinkedQueue()
corrupt.append("x")
corrupt.evict()          # tail now dangles
corrupt.append("y")

print(f"after evict-to-empty then append:")
print(f"  head value    : {corrupt.head.value if corrupt.head else None}")
print(f"  tail value    : {corrupt.tail.value if corrupt.tail else None}")
print(f"  length        : {corrupt.length}")
print(f"  clauses       : {corrupt.check_rep()}")

checkpoint("the queue reports length 1", corrupt.length == 1)
checkpoint("but the invariant is still violated",
           not all(corrupt.check_rep().values()),
           "the dangling tail propagates into the next append")


# %%
class RepairedQueue(LinkedQueue):
    """Same behaviour, with the emptying transition handled."""

    def evict(self) -> object:
        raise NotImplementedError("Implement evict so all three clauses survive")


def survives_all_transitions(queue_class) -> bool:
    subject = queue_class()
    if not all(subject.check_rep().values()):
        return False
    for _, action in TRANSITIONS:
        action(subject)
        if not all(subject.check_rep().values()):
            return False
    return True


check("survives all transitions", survives_all_transitions,
      [((LinkedQueue,), False), ((RepairedQueue,), True)])

DEFENCE = """
The FIRST transition and clause to fail, and why that pair locates the defect:
Which later violations are consequences rather than causes:
What the next append does with the stale pointer:
Why appending and evicting in the middle would never have found this:
"""
print(DEFENCE)

# %% [markdown]
# ## 4. The trace

# %%
claim("DEFENDED REPAIR", DEFENCE)

claim(
    "COUNTEREXAMPLE",
    f"Across five boundary transitions the linked queue first violates its "
    f"invariant at {first_step}, in the {first_clause} clause alone. The damage "
    f"then propagates: the following transition violates {len(later)} further "
    f"clause-checks while acyclicity never fails at any point.",
    support={"trace": trace, "violations": failures,
             "firstViolation": [first_step, first_clause],
             "propagated": later},
)

non_claim(
    "Five transitions on one structure. This locates a boundary defect, and shows "
    "that the first violated clause names the cause while later ones are fallout; "
    "it does not establish that the repaired queue is correct under every "
    "operation sequence, and it tests no concurrent access at all."
)

emit()

# %% [markdown]
# ## 5. Transfer
#
# 1. Two of three clauses held in a definitely-broken state. Write the rule about
#    what a partially-satisfied invariant tells you.
# 2. The defect needed empty-to-one after one-to-empty. Name the general shape of
#    test case that finds boundary bugs.
# 3. Bench `m03-s3` found an invariant false *during* an operation. Is this the
#    same failure or a different one?
#
# ---
#
# ## Attributions
#
# Authored for this course. Module 6 has no checked-in reference model.
