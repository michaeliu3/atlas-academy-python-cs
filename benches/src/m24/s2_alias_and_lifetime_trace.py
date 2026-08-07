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
# # Bench m24-s2 — alias and lifetime trace
#
# **Session 24.2 — Objects, aliases, and lifetime.** Rungs: **review and verify**
# (primary), trace.
#
# `module24_reference.py` models reference counting over a *declared* object
# graph, and says so: its `SweepResult` carries a `limitation` field, and the
# function is documented as modelling release "without claiming CPython
# exactness."
#
# This bench takes that disclaimer seriously and tests it. The model is a clean
# arithmetic account of who points at what. The interpreter is not. Finding
# exactly where they part company — and confirming the reference was right to
# hedge — is the session's work.
#
# **Requires:** Python 3.12+. Standard library only.

# %%
import sys
from pathlib import Path

_start = Path.cwd()
for _candidate in (_start, *list(_start.parents)[:4]):
    if (_candidate / "atlas_bench").is_dir():
        sys.path.insert(0, str(_candidate))
        _benches_root = _candidate
        break
else:  # pragma: no cover
    raise RuntimeError(f"atlas_bench not found from {_start}")

# Import and probe the checked-in reference model; never reimplement it.
sys.path.insert(0, str(_benches_root.parent / "public" / "downloads"))

from atlas_bench import (  # noqa: E402
    bench, check, checkpoint, claim, emit, non_claim, predict, resolve, reveal,
)
from module24_reference import (  # noqa: E402
    ObjectGraph, collect_unreachable_cycles, reachable_nodes, reference_count_sweep,
)

assert sys.version_info >= (3, 12)

bench(
    module=24,
    session=2,
    emits="alias and lifetime trace",
    rungs=["review-and-verify", "trace"],
)

# %% [markdown]
# ## 1. What the model says
#
# An Atlas-shaped graph: a root holds a catalog, the catalog holds two events,
# and one detached pair points only at each other.

# %%
GRAPH = ObjectGraph(
    edges={
        "root": ("catalog",),
        "catalog": ("event_a", "event_b"),
        "event_a": (),
        "event_b": (),
        "orphan_x": ("orphan_y",),
        "orphan_y": ("orphan_x",),
    },
    roots=frozenset({"root"}),
)

sweep = reference_count_sweep(GRAPH)
print("reference counts:", dict(sweep.reference_counts))
print("remaining        :", sweep.remaining)
print("collected        :", sweep.collected)
print("reachable        :", reachable_nodes(GRAPH))
print("unreachable cycle:", collect_unreachable_cycles(GRAPH))
print()
print("the model's own limitation:")
print(" ", sweep.limitation)

# %%
checkpoint(
    "the orphan pair is unreachable from any root",
    "orphan_x" not in reachable_nodes(GRAPH) and "orphan_y" not in reachable_nodes(GRAPH),
)
checkpoint(
    "yet refcount alone does not free it — each holds the other at count 1",
    dict(sweep.reference_counts)["orphan_x"] >= 1,
    "which is why a cycle collector exists at all",
)

# %% [markdown]
# ## 2. Prediction
#
# The model gives every node an integer count. Now ask the interpreter for the
# same quantity on real objects.

# %%
predict(
    "sys.getrefcount() on a freshly created list returns a small number. What "
    "does it return for None, 0, and the empty string — a small number, a large "
    "one, or something else entirely?",
    answer="",  # <- fill in
    confidence="",  # sure / fairly sure / guessing
)

# %% [markdown]
# ## 3. Trace — ask the interpreter

# %%
fresh = ["evt-1", "evt-2"]
alias = fresh  # a second name for the same object

samples = {
    "fresh list": fresh,
    "list + one alias": alias,
    "None": None,
    "0": 0,
    "1": 1,
    "'' (empty str)": "",
    "True": True,
}

print(f"{'object':>18}  {'getrefcount':>14}")
counts = {}
for label, obj in samples.items():
    counts[label] = sys.getrefcount(obj)
    print(f"{label:>18}  {counts[label]:>14,}")

immortal_threshold = 2 ** 30
immortals = [name for name, value in counts.items() if value > immortal_threshold]
print(f"\nabove 2**30: {immortals or 'none'}")

# %%
resolve(
    "sys.getrefcount() on a freshly created list returns a small number. What "
    "does it return for None, 0, and the empty string — a small number, a large "
    "one, or something else entirely?",
    "diverged",  # matched / diverged / partial
)

# %%
reveal(
    "sys.getrefcount() on a freshly created list returns a small number. What "
    "does it return for None, 0, and the empty string — a small number, a large "
    "one, or something else entirely?",
    """
    Something else entirely: an enormous constant, the same for all of them, and
    it never changes.

    Since 3.12 CPython makes certain objects **immortal** — `None`, `True`,
    `False`, small integers, the empty string, short interned strings. Their
    reference count is pinned to a sentinel value and the interpreter skips
    counting them altogether. Binding a thousand more names to `None` moves the
    number not at all.

    The reason is performance, not semantics: these objects are touched
    constantly, and in a free-threaded build every increment would be a
    contended atomic write. Making them uncountable removes the contention.

    What this costs you is the mental model. "Reference count tells me how many
    references exist" is false for an entire class of objects, and nothing in
    the source distinguishes them. `sys.getrefcount(x)` is not an oracle over
    the object graph; it is an implementation detail that happens to be exposed,
    and for immortals it is not even reporting a count.

    Note also, for the mortal case, that `getrefcount` reads one too high — its
    own argument is a reference. The 'fresh list' row is not the number of names
    you can see in this cell.

    So the reference model was right to hedge. Its integers are a *declared*
    model over a *declared* graph, and it says so in `limitation`. It is not
    describing CPython, and the moment you treat it as though it were, the
    immortal objects break it.
    """,
)

# %% [markdown]
# ## 4. Review and verify — audit four claims about the model
#
# Each statement is the kind a competent reader might make after seeing
# `reference_count_sweep`. Mark the ones this bench's evidence supports.

# %%
CLAIMS = {
    "a": "reference_count_sweep's integers are the counts CPython would hold for "
         "equivalent objects.",
    "b": "An object unreachable from any root is guaranteed to be freed by "
         "reference counting alone.",
    "c": "The model correctly separates reachability from reference count.",
    "d": "sys.getrefcount can be used to verify the model's integers empirically.",
}
for key, text in CLAIMS.items():
    print(f"{key}. {text}")


def supported(key: str) -> bool:
    """True when this bench's evidence supports the claim as written."""
    raise NotImplementedError("Audit the four claims")


# %%
check(
    "supported",
    supported,
    [(("a",), False), (("b",), False), (("c",), True), (("d",), False)],
)
print()
print("(b) is the one the graph settles: orphan_x and orphan_y are unreachable")
print("and both still carry a nonzero count. (d) is the subtle one — you cannot")
print("empirically verify the model with getrefcount when getrefcount does not")
print("report a count for an entire class of objects.")

# %% [markdown]
# ## 5. The record

# %%
AUDIT = """
The model's stated limitation, in my own words:
The specific object class that breaks a naive empirical check:
What I would need in order to verify the model against CPython at all:
"""
print(AUDIT)

# %%
claim("REVIEW VERDICT", AUDIT)

claim(
    "COURSE MODEL",
    f"Over the declared graph, reference_count_sweep reports "
    f"{dict(sweep.reference_counts)} and leaves {sweep.remaining} uncollected; "
    f"the unreachable cycle {collect_unreachable_cycles(GRAPH)} survives a "
    f"refcount-only sweep.",
    support={"referenceCounts": dict(sweep.reference_counts),
             "remaining": list(sweep.remaining),
             "reachable": list(reachable_nodes(GRAPH)),
             "unreachableCycles": list(collect_unreachable_cycles(GRAPH))},
)

claim(
    "CPYTHON OBSERVATION",
    f"On this interpreter sys.getrefcount returns an immortal sentinel above "
    f"2**30 for {', '.join(immortals) if immortals else 'no tested object'}, so "
    f"it does not report a reference count for those objects at all.",
    support={"counts": counts, "immortalThreshold": immortal_threshold,
             "immortals": immortals,
             "python": sys.version.split()[0]},
)

non_claim(
    "This observes one CPython build. Immortality is an implementation choice, "
    "not a language guarantee: which objects are immortal, and the sentinel "
    "value itself, may differ across versions and are absent on other "
    "implementations. The evidence refutes 'getrefcount reports a count for "
    "every object'; it does not establish which objects any other runtime "
    "treats this way."
)

emit()

# %% [markdown]
# ## 6. Transfer
#
# 1. The reference model carried a `limitation` field and this bench confirmed it
#    was needed. Write the one-sentence rule you now hold about models that
#    return integers.
# 2. Immortality exists to avoid contended atomic writes under free threading.
#    Which module will explain why that contention matters, and what will it add
#    that this bench could not?
# 3. `getrefcount` reads one too high even for mortal objects. Explain why that
#    is a property of the *call*, not of the object.
#
# ---
#
# ## Attributions
#
# Probes the checked-in reference model
# `public/downloads/module24_reference.py` — `ObjectGraph`,
# `reference_count_sweep`, `reachable_nodes`, `collect_unreachable_cycles` — and
# tests the disclaimer in its own `limitation` field. The reference model is not
# reimplemented. The immortal-object observation and the claim audit are this
# bench's own.
