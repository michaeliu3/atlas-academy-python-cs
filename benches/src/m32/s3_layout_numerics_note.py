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
# # Bench m32-s3 — Layout-Numerics Note
#
# **Session 32.3 — Treat array metadata as part of the algorithm.** Rungs: **trace**
# (primary), debug and defend.
#
# Two arrays with the same shape and the same dtype look interchangeable, and a
# function signature cannot tell them apart. **Strides** can, and the difference
# decides whether an operation copies, whether a mutation propagates, and whether
# a C library can accept the buffer at all.
#
# This bench builds four arrays that share shape-and-dtype with a base array and
# differ in every way that matters.
#
# **Requires:** Python 3.12+ and `numpy` (on the bench dependency allowlist).

# %%
from _fixture import *  # noqa: F401,F403,E402  (sets up sys.path)

import sys  # noqa: E402

import numpy as np  # noqa: E402

from atlas_bench import (  # noqa: E402
    bench, check, checkpoint, claim, emit, non_claim, predict, resolve, reveal,
)

assert sys.version_info >= (3, 12)

# numpy is declared in the registry's `dependencies`, not here — `bench()` takes
# only the session identity, and the allowlist is enforced by validate:benches.
bench(module=32, session=3, emits="Layout-Numerics Note",
      rungs=["trace", "debug-and-defend"])

# %% [markdown]
# ## 1. One buffer, several views

# %%
BASE = np.arange(12, dtype=np.int64).reshape(3, 4)

VIEWS = {
    "base": BASE,
    "columns reversed": BASE[:, ::-1],
    "transposed": BASE.T,
    "every other column": BASE[:, ::2],
    "explicit copy": np.ascontiguousarray(BASE[:, ::-1]),
}

print(f"{'array':>20}  {'shape':>8}  {'dtype':>7}  {'strides':>12}  "
      f"{'C-contig':>9}  {'shares memory':>13}")
metadata = {}
for label, array in VIEWS.items():
    shares = bool(np.shares_memory(BASE, array))
    metadata[label] = {"shape": array.shape, "dtype": str(array.dtype),
                       "strides": array.strides,
                       "contiguous": bool(array.flags["C_CONTIGUOUS"]),
                       "sharesMemory": shares}
    print(f"{label:>20}  {str(array.shape):>8}  {str(array.dtype):>7}  "
          f"{str(array.strides):>12}  {str(array.flags['C_CONTIGUOUS']):>9}  "
          f"{str(shares):>13}")

reversed_view = VIEWS["columns reversed"]
copy = VIEWS["explicit copy"]

same_shape_dtype = [
    label for label, row in metadata.items()
    if row["shape"] == BASE.shape and row["dtype"] == str(BASE.dtype)
]
print(f"\narrays with the SAME shape and dtype as the base: {same_shape_dtype}")

# %%
predict(
    "`BASE[:, ::-1]` has the same shape and the same dtype as `BASE`. Does it have "
    "the same bytes, and does writing to `BASE` change it?",
    answer="",  # <- fill in
    confidence="",  # sure / fairly sure / guessing
)

# %% [markdown]
# ## 2. Trace — what shape and dtype do not tell you

# %%
print(f"BASE            strides {BASE.strides}")
print(f"columns reversed strides {reversed_view.strides}  <- negative last stride")
print(f"\nsame shape : {BASE.shape == reversed_view.shape}")
print(f"same dtype : {BASE.dtype == reversed_view.dtype}")
print(f"same sum   : {BASE.sum() == reversed_view.sum()}")
print(f"same bytes : {BASE.tobytes() == reversed_view.tobytes()}")
print(f"C-contiguous: {BASE.flags['C_CONTIGUOUS']} against "
      f"{reversed_view.flags['C_CONTIGUOUS']}")

checkpoint("shape and dtype are identical",
           BASE.shape == reversed_view.shape and BASE.dtype == reversed_view.dtype)
checkpoint("the strides are not",
           BASE.strides != reversed_view.strides,
           f"{BASE.strides} against {reversed_view.strides} — the last stride is "
           f"negative")
checkpoint("the bytes are not identical either",
           BASE.tobytes() != reversed_view.tobytes(),
           "tobytes() materialises in C order, so it reflects the traversal, not "
           "the buffer")
checkpoint("the view is not C-contiguous",
           not reversed_view.flags["C_CONTIGUOUS"],
           "a C function expecting a contiguous int64 buffer cannot take this "
           "pointer")

# %% [markdown]
# ## 3. Debug — the aliasing the signature hides

# %%
before_view = int(reversed_view[0, -1])
before_copy = int(copy[0, -1])

BASE[0, 0] = 99

after_view = int(reversed_view[0, -1])
after_copy = int(copy[0, -1])

print(f"writing BASE[0, 0] = 99\n")
print(f"{'array':>20}  {'element before':>15}  {'element after':>14}  "
      f"{'changed':>8}")
print(f"{'columns reversed':>20}  {before_view:>15}  {after_view:>14}  "
      f"{str(before_view != after_view):>8}")
print(f"{'explicit copy':>20}  {before_copy:>15}  {after_copy:>14}  "
      f"{str(before_copy != after_copy):>8}")

checkpoint("the view sees the write", after_view == 99)
checkpoint("the copy does not", after_copy == before_copy)
checkpoint("and nothing in shape or dtype distinguished them",
           metadata["columns reversed"]["shape"]
           == metadata["explicit copy"]["shape"]
           and metadata["columns reversed"]["dtype"]
           == metadata["explicit copy"]["dtype"],
           "same shape, same dtype, opposite aliasing behaviour")

BASE[0, 0] = 0  # restore, so later cells read the original values

# %%
resolve(
    "`BASE[:, ::-1]` has the same shape and the same dtype as `BASE`. Does it have "
    "the same bytes, and does writing to `BASE` change it?",
    "matched",  # matched / diverged / partial
)

# %%
reveal(
    "`BASE[:, ::-1]` has the same shape and the same dtype as `BASE`. Does it have "
    "the same bytes, and does writing to `BASE` change it?",
    """
    Different bytes, and yes — writing to `BASE` changes it, because it *is*
    `BASE`. No data was copied.

    A numpy array is a pointer to a buffer plus **metadata**: shape, dtype, and
    strides. Slicing with `::-1` does not move anything; it hands back a new array
    object pointing at the same buffer with the last stride negated, `(32, 8)`
    becoming `(32, -8)`. Traversal now walks backwards through memory that was
    never rearranged.

    So `tobytes()` differs while the underlying buffer is byte-identical, and both
    facts are true at once. `tobytes()` reports what a C-order traversal *would*
    produce, which is a statement about the strides, not about the allocation.

    Three consequences follow, and each one is a real failure mode.

    **Aliasing.** The view and the base are the same memory, so a write through
    either is visible through the other. `np.ascontiguousarray` breaks that by
    copying — and the copy has identical shape and dtype, so a function signature,
    a type annotation, and an `isinstance` check all see the same thing while the
    two behave oppositely. This is bench `m12-s4`'s finding in a numerical costume:
    a structural check that verifies names and not behaviour.

    **Contiguity.** The reversed view is not C-contiguous. A C or Fortran routine
    that takes a raw pointer and assumes a fixed element step cannot accept it, so
    the wrapper must either reject it or silently copy. Silently copying is the
    common choice, which turns a "zero-copy" pipeline into one that allocates on
    every call — invisibly, because the result is correct.

    **Performance.** Same element count, same arithmetic, different memory access
    order. Bench `m17-s4` measured what access order does to a declared cache
    model: identical work, four times the misses. This is that mechanism, arriving
    through a slice you did not think of as an algorithmic choice.

    The rule the session is after: **array metadata is part of the algorithm.**
    Shape and dtype describe what the values mean; strides describe how they are
    reached, and that decides copying, aliasing, and whether a foreign library can
    look at the buffer at all. A review that reads only shape and dtype has read
    the type and not the layout.
    """,
)

# %% [markdown]
# ## 4. Trace — which operations preserve the view?

# %%
OPERATIONS = {
    "reshape(4, 3)": lambda a: a.reshape(4, 3),
    "transpose": lambda a: a.T,
    "slice [:, :2]": lambda a: a[:, :2],
    "astype(int64)": lambda a: a.astype(np.int64),
    "ravel()": lambda a: a.ravel(),
    "+ 0": lambda a: a + 0,
}

print(f"{'operation':>18}  {'shares memory with BASE':>24}  {'C-contiguous':>12}")
operations = {}
for label, operation in OPERATIONS.items():
    try:
        result = operation(BASE)
        shares = bool(np.shares_memory(BASE, result))
        operations[label] = {"shares": shares,
                             "contiguous": bool(result.flags["C_CONTIGUOUS"])}
        print(f"{label:>18}  {str(shares):>24}  "
              f"{str(result.flags['C_CONTIGUOUS']):>12}")
    except Exception as error:  # noqa: BLE001
        operations[label] = {"error": type(error).__name__}
        print(f"{label:>18}  {type(error).__name__:>24}")

viewing = [k for k, v in operations.items() if v.get("shares")]
copying = [k for k, v in operations.items() if v.get("shares") is False]

print(f"\nreturned a view : {viewing}")
print(f"returned a copy : {copying}")

checkpoint("some operations return views and some copy",
           len(viewing) > 0 and len(copying) > 0)
checkpoint("astype always copies, even to the same dtype",
           operations["astype(int64)"]["shares"] is False,
           "the dtype is unchanged and a full allocation happens anyway")
checkpoint("arithmetic always copies", operations["+ 0"]["shares"] is False,
           "adding zero is a whole new buffer")
checkpoint("nothing in the call syntax says which is which", True,
           "`a.reshape(...)` and `a.astype(...)` read identically and differ "
           "in whether they allocate")

# %% [markdown]
# ## 5. Recognize — what does shape-and-dtype establish?

# %%
CLAIMS = {
    "a": "The two arrays hold the same number of elements.",
    "b": "The two arrays hold the same values.",
    "c": "Writing to one cannot affect the other.",
    "d": "A C routine expecting a contiguous buffer will accept either.",
}
for key, text in CLAIMS.items():
    print(f"{key}. {text}")


def established_by_shape_and_dtype(key: str) -> bool:
    """True when matching shape and dtype establish this."""
    raise NotImplementedError("Judge what the metadata actually pins down")


# %%
check("established_by_shape_and_dtype", established_by_shape_and_dtype,
      [(("a",), True), (("b",), False), (("c",), False), (("d",), False)])
print()
print("(a) is all you get. (b) is false because shape says nothing about values.")
print("(c) and (d) are the expensive ones, and both are decided by strides and")
print("the buffer pointer — neither of which appears in a shape-and-dtype check,")
print("a type annotation, or an isinstance test.")

# %% [markdown]
# ## 6. The layout-numerics note

# %%
LAYOUT_NOTE = """
The arrays involved, with shape, dtype, strides, and contiguity for each:
Which of them share a buffer, and how I determined that:
The operation that produced a view, and the one that produced a copy:
What a function signature could and could not have told me:
The aliasing hazard in my own pipeline, and where it enters:
Where a silent copy would happen at a foreign-library boundary:
The claim I can make from shape and dtype alone, stated exactly:
"""
print(LAYOUT_NOTE)

# %%
claim("COURSE MODEL", LAYOUT_NOTE)

claim(
    "LOCAL REFERENCE RESULT",
    f"On numpy {np.__version__}, BASE[:, ::-1] has the same shape "
    f"{BASE.shape} and dtype {BASE.dtype} as its base and differs in strides "
    f"({BASE.strides} against {reversed_view.strides}), is not C-contiguous, and "
    f"shares memory with the base — so a write to BASE[0, 0] is visible through "
    f"it while an ascontiguousarray copy with identical shape and dtype is "
    f"unaffected. tobytes() differs between base and view although the underlying "
    f"buffer is the same allocation. Of {len(OPERATIONS)} operations, "
    f"{len(viewing)} return views and {len(copying)} allocate, including "
    f"astype to the dtype the array already has.",
    support={"numpyVersion": np.__version__,
             "metadata": {k: {**v, "shape": list(v["shape"]),
                              "strides": list(v["strides"])}
                          for k, v in metadata.items()},
             "aliasing": {"viewBefore": before_view, "viewAfter": after_view,
                          "copyBefore": before_copy, "copyAfter": after_copy},
             "operations": operations,
             "viewing": viewing, "copying": copying},
)

non_claim(
    "This is numpy's documented view-and-stride behaviour on one small int64 array "
    "on this platform. It establishes that shape and dtype do not determine "
    "aliasing, contiguity, or byte order of traversal, and which of six operations "
    "allocate. It measures no performance whatsoever — the access-order cost is "
    "argued from bench m17-s4's declared cache model, not timed here — touches no "
    "accelerator, and says nothing about device memory, host-device transfer, or "
    "kernel dispatch, which the workbook itself concedes are a CPU-only imagined "
    "queue in this module. Which operations return views is a numpy implementation "
    "detail that has changed across versions and is not a language guarantee."
)

emit()

# %% [markdown]
# ## 7. Transfer
#
# 1. A view and a copy shared shape and dtype and behaved oppositely. Write the
#    rule this implies about type annotations on array parameters.
# 2. `astype` to the same dtype still allocated. Name what that costs in a
#    pipeline that calls it defensively, and the check that would reveal it.
# 3. Bench `m12-s4` found `isinstance` verifying names rather than behaviour. State
#    what a shape-and-dtype check and a runtime-checkable Protocol have in common.
#
# ---
#
# ## Attributions
#
# Module 32 is authoring-only and has no checked-in reference model. The views, the
# aliasing probe, and the view-versus-copy sweep are this bench's own, on `numpy`.
