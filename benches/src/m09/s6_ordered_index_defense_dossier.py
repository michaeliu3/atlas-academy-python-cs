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
# # Bench m09-s6 — ordered-index defense dossier
#
# **Session 9.6 — Coordinate indexes, direct an agent, defend the system.**
# Rungs: **design and delegate** (primary), transfer.
#
# Two indexes now describe the same records — the scheduler from Session 4 and
# the prefix index from Session 5. The module's exit question is what happens
# when they disagree.
#
# **Requires:** Python 3.12+. Standard library only.

# %%
import sys
from pathlib import Path

_start = Path.cwd()
for _candidate in (_start, *list(_start.parents)[:4]):
    if (_candidate / "atlas_bench").is_dir():
        sys.path.insert(0, str(_candidate))
        break
else:  # pragma: no cover
    raise RuntimeError(f"atlas_bench not found from {_start}")

from atlas_bench import (  # noqa: E402
    bench, check, checkpoint, claim, emit, non_claim, predict, resolve, reveal,
)
from _fixture import REVIEWS, Review, review_priority  # noqa: E402

assert sys.version_info >= (3, 12)

bench(module=9, session=6, emits="ordered-index defense dossier",
      rungs=["design-and-delegate", "transfer"])

# %% [markdown]
# ## 1. Two indexes, one record set
#
# A deliberately naive coordinator: a priority list and an id map, updated
# separately. Find the window where they disagree.


# %%
class NaiveCoordinator:
    """Keeps a priority-ordered list and an id->Review map. Updates are not atomic."""

    def __init__(self) -> None:
        self.ordered: list[Review] = []
        self.by_id: dict[str, Review] = {}

    def add(self, review: Review) -> None:
        self.ordered.append(review)
        self.ordered.sort(key=review_priority)
        self.by_id[review.concept_id] = review

    def remove(self, concept_id: str) -> None:
        """Removes from the id map first, then the ordered list."""
        self.by_id.pop(concept_id, None)
        # A reader arriving here sees an id map that has forgotten the review
        # and an ordered list that still schedules it.
        self.ordered = [r for r in self.ordered if r.concept_id != concept_id]

    def next_review(self) -> Review | None:
        return self.ordered[0] if self.ordered else None

    def consistent(self) -> bool:
        return {r.concept_id for r in self.ordered} == set(self.by_id)


# %%
predict(
    "remove() updates two indexes in sequence. Between the two statements, which "
    "index is authoritative — and what does a reader observe?",
    answer="",
    confidence="",
)

# %%
coordinator = NaiveCoordinator()
for review in REVIEWS:
    coordinator.add(review)

checkpoint("consistent before removal", coordinator.consistent())

# Reproduce the window explicitly: run only the first statement of remove().
target = coordinator.next_review().concept_id
coordinator.by_id.pop(target, None)
mid = {
    "next_review_says": coordinator.next_review().concept_id,
    "by_id_knows_it": target in coordinator.by_id,
    "consistent": coordinator.consistent(),
}
print(f"mid-removal state: {mid}")
checkpoint("the two indexes disagree mid-removal", not coordinator.consistent())

coordinator.ordered = [r for r in coordinator.ordered if r.concept_id != target]
checkpoint("consistent after removal completes", coordinator.consistent())

# %%
resolve(
    "remove() updates two indexes in sequence. Between the two statements, which "
    "index is authoritative — and what does a reader observe?",
    "matched",  # matched / diverged / partial
)

# %%
reveal(
    "remove() updates two indexes in sequence. Between the two statements, which "
    "index is authoritative — and what does a reader observe?",
    """
    Neither is authoritative, and that is the defect.

    Between the two statements, `next_review()` still returns the removed review
    while `by_id` has already forgotten it. A caller that asks "what is next" and
    then looks the answer up by id gets a KeyError on a review the scheduler just
    recommended — a failure that reads like a race even in single-threaded code.

    The repair is not "reorder the statements". Reordering moves the window; it
    does not close it. The fix is to name one index as the source of truth and
    derive the other, or to make the pair update atomically. Until one of those is
    chosen, "the scheduler says X" is not a claim about the system, only about one
    of its indexes.

    This is the ordering contract from Session 1 reappearing at system scale. A
    contract that governs one structure says nothing about two.
    """,
)

# %% [markdown]
# ## 2. Design and delegate — the bounded brief
#
# Workbook §14's discipline. A brief that cannot be reviewed is not a brief.

# %%
AGENT_BRIEF = """
Task:
Files in scope:
Prohibited scope:
Behaviour that must not change:
Acceptance evidence, stated as a checkable property rather than a description:
"""
print(AGENT_BRIEF)
print("A good brief here forbids changing the ordering policy and states")
print("acceptance as 'consistent() holds at every observable point', which the")
print("checks above can settle. 'Make the indexes consistent' is not acceptance")
print("evidence — it restates the goal.")

# %% [markdown]
# ## 3. Review the delegated result
#
# An assistant returned four statements about its repair.

# %%
AGENT_CLAIMS = {
    "a": "Removing from the ordered list first eliminates the inconsistency.",
    "b": "consistent() returning True after remove() proves the repair is correct.",
    "c": "Deriving the ordered list from by_id on demand removes the window entirely.",
    "d": "The repair makes the coordinator safe for concurrent readers.",
}
for key, text in AGENT_CLAIMS.items():
    print(f"{key}. {text}")


def sound(key: str) -> bool:
    """True when the claim follows from this bench's evidence."""
    raise NotImplementedError("Audit the four claims")


# %%
check("sound", sound, [(("a",), False), (("b",), False), (("c",), True), (("d",), False)])
print()
print("(b) is the one worth dwelling on: a post-condition check cannot detect a")
print("window that opens and closes between calls. The check passed before the")
print("removal and after it, and the system was still wrong in between.")

# %% [markdown]
# ## 4. The dossier

# %%
DEFENSE = """
Which index I made authoritative, and why:
The window I closed, and how I know it is closed:
The claim I reject, and the evidence it would need:
What this dossier does not establish about concurrent access:
"""
print(DEFENSE)

# %%
claim("AI PROPOSAL", AGENT_BRIEF)
claim("REVIEW VERDICT", DEFENSE)

claim(
    "COUNTEREXAMPLE",
    f"Mid-removal, next_review() returned {mid['next_review_says']!r} while by_id "
    f"had already dropped it (consistent={mid['consistent']}).",
    support=mid,
)

non_claim(
    "This is a single-threaded reproduction. It shows the window exists in "
    "program order; it says nothing about what concurrent readers observe, which "
    "needs the memory-model and interleaving reasoning of Module 19. Closing this "
    "window does not make the coordinator thread-safe."
)

emit()

# %% [markdown]
# ## 5. Transfer — the module's exit
#
# 1. Session 1 asked for four ordering decisions about one structure. Write the
#    fifth decision two coordinated indexes require.
# 2. `consistent()` passed before and after and missed the defect. Name the class
#    of bug that post-condition checks structurally cannot find.
# 3. Which module will supply the vocabulary for the concurrent version of this
#    problem, and what will it add that this bench could not?
#
# ---
#
# ## Attributions
#
# Authored for this course. No external material vendored.
