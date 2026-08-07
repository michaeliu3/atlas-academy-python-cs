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
# # Bench m09-s2 — BST path-and-proof trace
#
# **Session 9.2 — Recursive shape becomes ordered search.** Rungs: **debug and
# defend** (primary), trace.
#
# Workbook §7.1 states the representation invariant. A written invariant you
# never check is a wish, so you write the checker — then find the defect in an
# insert that looks correct and passes a weaker check.
#
# *Problem framing and test trees adapted from
# [donnemartin/interactive-coding-challenges](https://github.com/donnemartin/interactive-coding-challenges)
# `graphs_trees/bst_validate` (Apache-2.0), pinned at `358f2cc`.*
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
from _fixture import Node, height, inorder, insert  # noqa: E402

assert sys.version_info >= (3, 12)

bench(module=9, session=2, emits="BST path-and-proof trace",
      rungs=["debug-and-defend", "trace"])

# %% [markdown]
# ## 1. Make the invariant executable
#
# **Constraints** — settle these before coding, the donnemartin habit:
#
# - Duplicates? **No.** RI clause 4 says keys are unique.
# - Is `None` valid? **Yes**, the empty tree satisfies the RI vacuously.
# - Fits in memory? **Yes.**
#
# The trap: checking each node against its immediate children is *not* the RI.
# Clause 2 says *every* key in the left subtree, not just the child.


# %%
def validate_bst(node: Node | None) -> bool:
    """True if `node` satisfies the workbook section 7.1 representation invariant."""
    raise NotImplementedError("Implement validate_bst")


# %%
valid_tree = Node(5, Node(3, Node(2)), Node(8, Node(6)))
invalid_tree = Node(5, Node(3, Node(2), Node(9)), Node(8, Node(7)))
shallow_trap = Node(5, Node(3, right=Node(6)))  # 6 > 5 but is a LEFT descendant

check(
    "validate_bst",
    validate_bst,
    [
        ((None,), True),
        ((Node(1),), True),
        ((valid_tree,), True),
        ((invalid_tree,), False),
        ((shallow_trap,), False),
    ],
)
print()
print("If shallow_trap passed while invalid_tree failed, you wrote the")
print("parent-child check rather than the invariant. Re-read RI clause 2.")

# %% [markdown]
# ## 2. Debug — an insert that looks right


# %%
def insert_broken(root: Node | None, key: int) -> Node:
    """Intentionally defective. One clause is wrong."""
    if root is None:
        return Node(key)
    if key < root.key:
        root.left = insert_broken(root.left, key)
    else:
        root.right = insert_broken(root.right, key)
    return root


# %%
predict(
    "insert_broken differs from the correct insert only in its else branch. "
    "Which RI clause does it violate, and would validate_bst detect it?",
    answer="",
    confidence="",
)

# %%
broken = None
for k in [5, 3, 8, 3, 5]:
    broken = insert_broken(broken, k)
keys = inorder(broken)

correct = None
for k in [5, 3, 8, 3, 5]:
    correct = insert(correct, k)

print(f"insert_broken in-order: {keys}")
print(f"insert        in-order: {inorder(correct)}")
checkpoint("RI clause 4 (keys unique) holds for the broken insert",
           len(keys) == len(set(keys)),
           f"{len(keys) - len(set(keys))} duplicate(s)")
checkpoint("RI clause 4 holds for the correct insert",
           len(inorder(correct)) == len(set(inorder(correct))))

# %%
resolve(
    "insert_broken differs from the correct insert only in its else branch. "
    "Which RI clause does it violate, and would validate_bst detect it?",
    "matched",  # matched / diverged / partial
)

# %%
reveal(
    "insert_broken differs from the correct insert only in its else branch. "
    "Which RI clause does it violate, and would validate_bst detect it?",
    """
    It violates clause 4 — keys are unique — and a *strict* validate_bst does
    detect it, but only because duplicates end up on the right where clause 3
    also fails.

    The `else` branch swallows `key == root.key` along with `key > root.key`, so
    an equal key is inserted as a right descendant. In-order traversal then shows
    3 and 5 twice.

    Two things worth separating:

    1. The defect is in *what the else branch covers*, not in what it does.
       `else` after `if key < root.key` means "greater OR equal", and the
       invariant has no place for "equal".
    2. A validator written as "left subtree keys are less than or equal" would
       pass this tree. The checker and the insert would then agree with each
       other and both disagree with the workbook's RI — which is why the
       invariant is stated in the module and not inferred from the code.

    The repair is an explicit `elif key > root.key:` with no else, so an equal
    key is neither inserted nor silently dropped into the wrong subtree.
    """,
)

# %% [markdown]
# ## 3. Defend the repair
#
# A repair without a defence is a guess that happened to work.

# %%
DEFENCE = """
The defect, stated as a clause violation:
The repair, and why it cannot reintroduce the defect:
What a weaker validator would have missed, and why:
"""
print(DEFENCE)

# %% [markdown]
# ## 4. Trace — the search path is the proof

# %%
tree = None
for k in [50, 30, 70, 20, 40, 60, 80]:
    tree = insert(tree, k)

target = 60
node, path = tree, []
while node is not None and node.key != target:
    path.append(node.key)
    node = node.left if target < node.key else node.right
path.append(node.key if node else None)

print(f"search path for {target}: {' -> '.join(str(k) for k in path)}")
print(f"comparisons: {len(path) - 1}, tree height: {height(tree)}, keys: {len(inorder(tree))}")
print()
print("Each comparison discarded an entire subtree. That is the invariant doing")
print("work: without clause 2 and 3, no comparison could rule anything out.")

# %% [markdown]
# ## 5. The record

# %%
claim("DEFENDED REPAIR", DEFENCE)

claim(
    "COUNTEREXAMPLE",
    f"Inserting [5, 3, 8, 3, 5] with the defective else branch yields {keys}, "
    f"violating RI clause 4; the correct insert yields {inorder(correct)}.",
    support={"broken": keys, "correct": inorder(correct)},
)

non_claim(
    "A passing validate_bst says the order invariant holds. It says nothing "
    "about shape: a degenerate chain of n nodes satisfies every clause of the RI "
    "and still costs O(n) per search. Balance is not part of this invariant."
)

emit()

# %% [markdown]
# ## 6. Transfer
#
# 1. Write the one-sentence statement of what a representation invariant does
#    *not* constrain.
# 2. Session 3 is about rotations. Which of the RI's four clauses must a rotation
#    preserve, and which may it freely change?
#
# ---
#
# ## Attributions
#
# Problem framing, constraint questions, and the valid/invalid test trees adapted
# from [donnemartin/interactive-coding-challenges](https://github.com/donnemartin/interactive-coding-challenges)
# `graphs_trees/bst_validate`, Apache-2.0, © 2015 Donne Martin, pinned at
# `358f2cc60426d5c4c3d7d580910eec9a7b393fa9`. Narrative, the `shallow_trap` case,
# the broken-insert exercise, and all Atlas framing are this course's own.
