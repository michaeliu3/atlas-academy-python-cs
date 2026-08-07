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
# # Bench m01-s2 — environment trace and scope claim
#
# **Session 1.2 — Evaluation, calls, and environments.** Rungs: **trace**
# (primary), map.
#
# A scope table tells you which name resolves where. It cannot show you that two
# closures are looking at *the same object* — and that object, the cell, is what
# makes "captures the variable, not the value" mean something.
#
# **Requires:** Python 3.12+. Standard library only.

# %%
from _fixture import *  # noqa: F401,F403,E402  (sets up sys.path)

import sys  # noqa: E402

from atlas_bench import (  # noqa: E402
    bench, check, checkpoint, claim, emit, non_claim, predict, resolve, reveal,
)

assert sys.version_info >= (3, 12)

bench(module=1, session=2, emits="environment trace and scope claim",
      rungs=["trace", "map"])

# %% [markdown]
# ## 1. One enclosing binding, two closures


# %%
def make_session_counter():
    """Return three functions that all close over the same `total`."""
    total = 0

    def read():
        return total

    def add(minutes):
        nonlocal total
        total += minutes

    def rebind_local(minutes):
        total = minutes          # a NEW local; no nonlocal declaration
        return total

    return read, add, rebind_local


read, add, rebind_local = make_session_counter()

# %%
predict(
    "add() declares `nonlocal total`; rebind_local() does not. After calling "
    "add(30) then rebind_local(500), what does read() return?",
    answer="",  # <- fill in
    confidence="",  # sure / fairly sure / guessing
)

# %% [markdown]
# ## 2. Trace — the cells themselves

# %%
print(f"read.__code__.co_freevars       : {read.__code__.co_freevars}")
print(f"add.__code__.co_freevars        : {add.__code__.co_freevars}")
print(f"rebind_local.__code__.co_freevars: {rebind_local.__code__.co_freevars}")
print(f"rebind_local.__code__.co_varnames: {rebind_local.__code__.co_varnames}")
print()
print(f"read.__closure__ : {read.__closure__}")
print(f"add.__closure__  : {add.__closure__}")
print(f"rebind_local.__closure__: {rebind_local.__closure__}")

shared = read.__closure__[0] is add.__closure__[0]
print(f"\nread and add share the SAME cell object: {shared}")

checkpoint("read and add close over the same cell", shared,
           "not equal values — the identical object")
checkpoint("rebind_local closes over nothing",
           rebind_local.__closure__ is None,
           "`total` there is a local, so there is no free variable to capture")
checkpoint("and `total` appears in its co_varnames instead",
           "total" in rebind_local.__code__.co_varnames)

# %% [markdown]
# ### Watch the cell's contents change

# %%
cell = read.__closure__[0]
trace = [("start", cell.cell_contents, read())]
add(30)
trace.append(("after add(30)", cell.cell_contents, read()))
rebound = rebind_local(500)
trace.append(("after rebind_local(500)", cell.cell_contents, read()))
add(12)
trace.append(("after add(12)", cell.cell_contents, read()))

print(f"{'step':>24}  {'cell_contents':>14}  {'read()':>8}")
for label, contents, value in trace:
    print(f"{label:>24}  {contents:>14}  {value:>8}")
print(f"\nrebind_local returned {rebound}, and the cell never saw it.")

# %%
resolve(
    "add() declares `nonlocal total`; rebind_local() does not. After calling "
    "add(30) then rebind_local(500), what does read() return?",
    "matched",  # matched / diverged / partial
)

# %%
reveal(
    "add() declares `nonlocal total`; rebind_local() does not. After calling "
    "add(30) then rebind_local(500), what does read() return?",
    """
    30. `rebind_local(500)` changed nothing the other two can see.

    Without `nonlocal`, assigning to `total` makes it a **local** of
    `rebind_local`. Python decides this at compile time from the presence of an
    assignment, not at run time — which is why `total` appears in that function's
    `co_varnames` and its `__closure__` is `None`. It never captured anything.

    `read` and `add` are different: neither assigns without declaring, so `total`
    stays a free variable and both capture the enclosing binding. And they do not
    capture a *copy* — `read.__closure__[0] is add.__closure__[0]` is True. One
    cell object, two references to it. That is what "closures capture the
    variable, not the value" actually means, and `is` is the only way to see it.

    So the environment is not a table of names to values that each function got a
    snapshot of. It is a set of shared mutable cells, and which functions share
    which cell is fixed when the enclosing function runs.

    The practical consequence, and the reason this trips people: adding an
    assignment to a function silently changes how a name resolves throughout that
    entire function, including *before* the assignment line. A read that worked
    yesterday becomes an UnboundLocalError today, and nothing about the read
    changed.
    """,
)

# %% [markdown]
# ### The retroactive consequence

# %%
def read_then_assign():
    try:
        first = total     # noqa: F821 - `total` is local because of the line below
        return ("read succeeded", first)
    except UnboundLocalError as error:
        return ("UnboundLocalError", str(error))
    total = 1             # noqa: F841 - unreachable, and yet decisive


total = 100  # a module-level binding that looks like it should be found
outcome, detail = read_then_assign()
print(f"module-level total = {total}")
print(f"read_then_assign() -> {outcome}: {detail}")

checkpoint("the read fails even though the assignment is unreachable",
           outcome == "UnboundLocalError",
           "scope is decided by compilation, not by execution order")

# %% [markdown]
# ## 3. Map — classify four names

# %%
CASES = {
    "a": "`total` inside read()",
    "b": "`total` inside add()",
    "c": "`total` inside rebind_local()",
    "d": "`total` inside read_then_assign()",
}
for key, text in CASES.items():
    print(f"{key}. {text}")


def kind(key: str) -> str:
    """One of: free, local."""
    raise NotImplementedError("Classify each name")


# %%
check("kind", kind,
      [(("a",), "free"), (("b",), "free"), (("c",), "local"), (("d",), "local")])

# %% [markdown]
# ## 4. The claim

# %%
SCOPE_CLAIM = """
What read() and add() share, stated as an object rather than a value:
The rule that decides whether a name is local, and when it is applied:
The observation that proves sharing rather than equality:
"""
print(SCOPE_CLAIM)

# %%
claim("DEFINITION / MODEL", SCOPE_CLAIM)

claim(
    "CPYTHON OBSERVATION",
    f"read() and add() hold the identical cell object "
    f"(read.__closure__[0] is add.__closure__[0] -> {shared}); rebind_local has "
    f"__closure__ None and carries `total` in co_varnames. Rebinding without "
    f"`nonlocal` left the cell at {trace[2][1]}.",
    support={"sharedCell": shared,
             "trace": [(label, contents, value) for label, contents, value in trace],
             "rebindLocalClosure": rebind_local.__closure__},
)

non_claim(
    "`__closure__` and `cell_contents` are CPython implementation surfaces, not "
    "language guarantees. The scoping rule they expose is guaranteed; the ability "
    "to inspect a cell object is not, and another implementation may represent "
    "the same semantics differently."
)

emit()

# %% [markdown]
# ## 5. Transfer
#
# 1. The unreachable assignment still broke the read. State the general rule about
#    when Python decides a name's scope.
# 2. `read` and `add` share a cell. Name one bug that becomes possible because of
#    sharing and impossible with per-function copies.
# 3. Session 4 shows two logs following a caller's edit. Is that the same kind of
#    sharing as this cell, or a different one?
#
# ---
#
# ## Attributions
#
# Authored for this course. Module 1 has no checked-in reference model.
