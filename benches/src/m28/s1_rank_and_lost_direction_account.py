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
# # Bench m28-s1 — rank and lost-direction account
#
# **Session 28.1 — Vectors, spaces, coordinates, rank, and lost directions.**
# Rungs: recognize, trace.
#
# The session's declared output states what a map's rank is *and which directions
# its action destroys*. The second half is the part a page struggles with: the
# lost direction is a concrete vector, and here it is produced rather than
# described.
#
# **Requires:** Python 3.12+. Standard library only.

# %%
from _fixture import RANK_DEFICIENT  # noqa: E402  (sets up sys.path)

import sys  # noqa: E402
from fractions import Fraction  # noqa: E402

from atlas_bench import (  # noqa: E402
    bench, check, checkpoint, claim, emit, non_claim, predict, resolve, reveal,
)
from module28_reference import analyze_matrix  # noqa: E402

assert sys.version_info >= (3, 12)

bench(module=28, session=1, emits="rank and lost-direction account",
      rungs=["recognize", "trace"])

# %% [markdown]
# ## 1. Recognize — three columns, how much information?

# %%
for row in RANK_DEFICIENT:
    print("  ", row)

predict(
    "This 3x3 matrix has three columns and no zero entries. Is its rank 3?",
    answer="",  # <- fill in
    confidence="",  # sure / fairly sure / guessing
)

# %% [markdown]
# ## 2. Trace — ask the reference

# %%
report = analyze_matrix(RANK_DEFICIENT)

print(f"rank            : {report.rank}")
print(f"pivot columns   : {report.pivot_columns}")
print(f"free columns    : {report.free_columns}")
print(f"null space basis: {tuple(tuple(str(v) for v in vec) for vec in report.null_space_basis)}")
print()
print("row-reduced echelon form:")
for row in report.rref:
    print("  ", tuple(str(v) for v in row))

checkpoint("rank is 2, not 3", report.rank == 2)
checkpoint("so one column is redundant", len(report.free_columns) == 1)
checkpoint("and the null space is non-trivial",
           len(report.null_space_basis) == 1,
           "there is a direction the map sends to zero")

# %% [markdown]
# ### Verify the lost direction directly
#
# A null-space vector is not a certificate until you apply the matrix to it.

# %%
def matvec(matrix, vector):
    return tuple(sum(Fraction(a) * b for a, b in zip(row, vector)) for row in matrix)


lost = report.null_space_basis[0]
image = matvec(RANK_DEFICIENT, lost)
print(f"lost direction  : {tuple(str(v) for v in lost)}")
print(f"A @ lost        : {tuple(str(v) for v in image)}")

checkpoint("the matrix sends the lost direction to exactly zero",
           all(v == 0 for v in image),
           "information in this direction cannot be recovered from the output")

# %%
resolve(
    "This 3x3 matrix has three columns and no zero entries. Is its rank 3?",
    "diverged",  # matched / diverged / partial
)

# %%
reveal(
    "This 3x3 matrix has three columns and no zero entries. Is its rank 3?",
    """
    No — the rank is 2. Column three is column one plus column two, so it adds
    no direction the first two did not already span.

    Column count is a fact about how the data is *written down*. Rank is a fact
    about how much of the space the map actually reaches. They coincide only when
    no column is a combination of the others, and nothing about the way a matrix
    looks tells you which case you are in — every entry here is nonzero and no
    two rows are obviously related.

    The null space makes the loss concrete. The vector (-1, -1, 1) is sent to
    exactly the zero vector, so any two inputs differing by a multiple of it
    produce identical output. Whatever that direction encoded is not merely
    hard to recover; it is not present in the output at all.

    This is what "lost direction" means, and it is why the session asks for the
    vector rather than the number. A rank of 2 tells you something was lost. The
    null-space basis tells you *what*.
    """,
)

# %% [markdown]
# ## 3. Trace — rank is not a robust quantity
#
# Perturb one entry by one part in a trillion.

# %%
epsilon = Fraction(1, 10 ** 12)
perturbed = [list(row) for row in RANK_DEFICIENT]
perturbed[2][2] = Fraction(perturbed[2][2]) + epsilon

perturbed_report = analyze_matrix(perturbed)
print(f"perturbation      : {float(epsilon):.0e} added to one entry")
print(f"rank before       : {report.rank}")
print(f"rank after        : {perturbed_report.rank}")
print(f"null space after  : {perturbed_report.null_space_basis or '(empty)'}")

checkpoint("a 1e-12 change raises the rank",
           perturbed_report.rank == report.rank + 1)
checkpoint("and the lost direction disappears entirely",
           len(perturbed_report.null_space_basis) == 0,
           "rank is a discontinuous function of the entries")

# %% [markdown]
# ## 4. Recognize — classify four statements

# %%
STATEMENTS = {
    "a": "A matrix with no zero entries has full rank.",
    "b": "The rank of this matrix is 2 in exact arithmetic.",
    "c": "Because the perturbed matrix has rank 3, it carries more information.",
    "d": "The null-space vector identifies inputs the map cannot distinguish.",
}
for key, text in STATEMENTS.items():
    print(f"{key}. {text}")


def is_true(key: str) -> bool:
    """True when this bench's evidence supports the statement."""
    raise NotImplementedError("Classify each statement")


# %%
check("is_true", is_true,
      [(("a",), False), (("b",), True), (("c",), False), (("d",), True)])
print()
print("(c) is the one worth arguing about: the perturbed matrix is *technically*")
print("rank 3, and a 1e-12 direction is not information anyone can use.")

# %% [markdown]
# ## 5. The account

# %%
ACCOUNT = """
The rank, and how it was established:
The direction the map destroys, as a vector:
What two inputs the map cannot tell apart, concretely:
Why the perturbed matrix's higher rank is not more information:
"""
print(ACCOUNT)

# %%
claim("DEFINITION / MODEL", ACCOUNT)

claim(
    "THEOREM / PROOF",
    f"The matrix has exact rank {report.rank} with null-space basis "
    f"{tuple(tuple(str(v) for v in vec) for vec in report.null_space_basis)}; "
    f"applying the matrix to that vector yields exactly zero.",
    support={"rank": report.rank,
             "pivotColumns": list(report.pivot_columns),
             "freeColumns": list(report.free_columns),
             "nullSpace": [[str(v) for v in vec] for vec in report.null_space_basis],
             "image": [str(v) for v in image]},
)

claim(
    "FINITE EXPERIMENT",
    f"Adding {float(epsilon):.0e} to a single entry raises the exact rank from "
    f"{report.rank} to {perturbed_report.rank} and empties the null space, so "
    f"rank is discontinuous in the entries.",
    support={"perturbation": float(epsilon),
             "rankBefore": report.rank, "rankAfter": perturbed_report.rank},
)

non_claim(
    "Exact rank is computed in rational arithmetic, so these results say nothing "
    "about what a floating-point routine would report. In floating point the "
    "question 'is this entry zero?' has no exact answer and rank becomes a "
    "tolerance choice — which is a decision, not a computation, and one this "
    "bench does not make."
)

emit()

# %% [markdown]
# ## 6. Transfer
#
# 1. Rank jumped on a 1e-12 perturbation. Write the one-sentence rule about
#    quantities that are defined by exact equality.
# 2. Session 4 separates a problem's conditioning from an algorithm's stability.
#    Which of the two does the near-rank-deficiency here predict?
# 3. The null-space vector named inputs the map cannot distinguish. Name the
#    equivalent object for a hash function, and say which module covers it.
#
# ---
#
# ## Attributions
#
# Probes `public/downloads/module28_reference.py` — `analyze_matrix` and its
# `rref` / `null_space_basis` / `pivot_columns` fields, in exact rational
# arithmetic. Not reimplemented. The null-space verification and the
# perturbation experiment are this bench's own.
