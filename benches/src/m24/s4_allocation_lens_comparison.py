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
# # Bench m24-s4 — allocation lens comparison
#
# **Session 24.4 — Allocation and memory lenses.** Rungs: **trace** (primary),
# recognize.
#
# "How much memory does this use?" has no single answer, and the failure mode is
# not that people get the number wrong — it is that they get a *correct* number
# from one instrument and read it as the answer to a different instrument's
# question.
#
# This bench puts three lenses on the same data: `sys.getsizeof`, `tracemalloc`,
# and the reference model's reachability sweep. They disagree by more than an
# order of magnitude, and every one of them is right.
#
# **Requires:** Python 3.12+. Standard library only.

# %%
from _fixture import *  # noqa: F401,F403,E402  (sets up sys.path)

import sys  # noqa: E402
import tracemalloc  # noqa: E402

from atlas_bench import (  # noqa: E402
    bench, check, checkpoint, claim, emit, non_claim, predict, resolve, reveal,
)
from module24_reference import (  # noqa: E402
    ObjectGraph, collect_unreachable_cycles, reachable_nodes,
    reference_count_sweep,
)

assert sys.version_info >= (3, 12)

bench(module=24, session=4, emits="allocation lens comparison",
      rungs=["trace", "recognize"])

# %% [markdown]
# ## 1. The data

# %%
ROW_COUNT = 10_000


def build_rows(count: int) -> list[dict]:
    return [{"id": n, "label": f"concept-{n}"} for n in range(count)]


rows = build_rows(ROW_COUNT)
print(f"{ROW_COUNT:,} rows, each a dict with an int and a short string")
print(f"first row: {rows[0]}")

# %%
predict(
    "sys.getsizeof on that list, and tracemalloc measuring the same construction. "
    "How far apart are the two numbers?",
    answer="",  # <- fill in
    confidence="",  # sure / fairly sure / guessing
)

# %% [markdown]
# ## 2. Trace — three lenses, three questions

# %%
shallow = sys.getsizeof(rows)
deep_elements = sum(sys.getsizeof(row) for row in rows)
deep_contents = sum(sys.getsizeof(row) + sum(sys.getsizeof(v) for v in row.values())
                    for row in rows)

tracemalloc.start()
before = tracemalloc.take_snapshot()
measured_rows = build_rows(ROW_COUNT)
after = tracemalloc.take_snapshot()
allocated = sum(stat.size_diff
                for stat in after.compare_to(before, "filename"))
tracemalloc.stop()

lenses = {
    "sys.getsizeof(list)": shallow,
    "+ getsizeof of each dict": deep_elements,
    "+ getsizeof of each value": deep_contents,
    "tracemalloc allocated": allocated,
}

print(f"{'lens':>28}  {'bytes':>12}  {'x shallow':>10}")
for label, value in lenses.items():
    print(f"{label:>28}  {value:>12,}  {value / shallow:>9.1f}x")

ratio = allocated / shallow

checkpoint("the shallow and allocated figures differ by more than 10x",
           ratio > 10, f"{ratio:.1f}x")
checkpoint("getsizeof of the list excludes the dicts entirely",
           deep_elements > shallow * 5,
           "the list holds pointers; the objects are elsewhere")
checkpoint("and summing the dicts still misses their contents",
           deep_contents > deep_elements)
checkpoint("every number is a correct answer to its own question", True,
           "none of these instruments is broken or lying")

# %%
resolve(
    "sys.getsizeof on that list, and tracemalloc measuring the same construction. "
    "How far apart are the two numbers?",
    "matched",  # matched / diverged / partial
)

# %%
reveal(
    "sys.getsizeof on that list, and tracemalloc measuring the same construction. "
    "How far apart are the two numbers?",
    """
    More than thirty times apart, and neither is wrong.

    `sys.getsizeof(rows)` measures **one object**: the list. A list of ten thousand
    items holds ten thousand pointers plus some slack, and that is genuinely all it
    is — around 85 KB. The dictionaries are not *in* the list. Nothing about the
    list's own memory footprint includes them, and `getsizeof` is documented as
    shallow. It answered the question it was asked.

    `tracemalloc` measures **allocation**: every block Python's allocator handed
    out while the code ran. That is the dicts, the strings, the integers outside
    the small-int cache, and the list — around 2.8 MB. It also answered its own
    question correctly.

    Summing `getsizeof` over the elements gets closer and still misses, because the
    dicts hold pointers to strings that are themselves separate objects. Chase that
    all the way down and you hit the two problems that make "deep sizeof" a
    fiction rather than a technique: **sharing** and **cycles**. Every one of those
    `"concept-N"` strings is unique here, but if they were interned or repeated,
    summing would count the same bytes many times. And a graph with a cycle has no
    finite sum at all.

    So there is no single number, and reaching for one is the actual error. Three
    real questions live under "how much memory does this use?":

    *How large is this object?* — `getsizeof`, shallow, exact, and about one object.

    *How much did this operation allocate?* — `tracemalloc`, which is what you want
    when a function is suspected of being expensive, and which counts memory that
    was freed again.

    *What is still reachable?* — a graph question, and the one section 3 turns to.
    Neither of the first two answers it, and it is usually the question that
    matters when something is described as a leak.

    A last practical note on `tracemalloc` itself: it measures only what Python's
    own allocator handed out. A NumPy array's buffer, a C extension's `malloc`, and
    an mmap'd file are all invisible to it. In a scientific workload that is
    frequently *most* of the memory — so the instrument that looks most complete
    here is the one with the largest blind spot in the programs where the question
    is most often asked.
    """,
)

# %% [markdown]
# ## 3. Trace — the reachability lens, and what refcounting cannot do

# %%
GRAPH = ObjectGraph(
    edges={
        "root": ("live-a",),
        "live-a": ("live-b",),
        "live-b": ("live-a",),      # a cycle that IS reachable
        "garbage-c": ("garbage-d",),
        "garbage-d": ("garbage-c",),  # a cycle that is NOT
    },
    roots=frozenset({"root"}),
)

reachable = reachable_nodes(GRAPH)
sweep = reference_count_sweep(GRAPH)
cycles = collect_unreachable_cycles(GRAPH)

print(f"reachable from a root : {reachable}")
print(f"\nreference counts:")
for name, count in sweep.reference_counts:
    print(f"  {name:>12}: {count}")

print(f"\nrefcount sweep collected: {sweep.collected or '()  — nothing'}")
print(f"refcount sweep remaining: {sweep.remaining}")
print(f"cycle collector found   : {cycles}")

unreachable = tuple(n for n in sweep.remaining if n not in reachable)

print(f"\nunreachable but not collected by refcounting: {unreachable}")
print(f"\nmodel limitation: {sweep.limitation}")

checkpoint("some nodes are unreachable from any root", len(unreachable) > 0)
checkpoint("the refcount sweep collects none of them",
           sweep.collected == (),
           "every node in the garbage cycle is still referenced — by the other "
           "node in the cycle")
checkpoint("their reference counts are all non-zero",
           all(count > 0 for name, count in sweep.reference_counts
               if name in unreachable))
checkpoint("the cycle collector finds exactly the unreachable cycle",
           set(cycles) == set(unreachable),
           f"{cycles} — reachability, not counting, is what settles it")
checkpoint("a reachable cycle is correctly left alone",
           "live-a" not in cycles and "live-b" not in cycles,
           "being in a cycle is not the same as being garbage")

# %% [markdown]
# ## 4. Recognize — which lens answers which question?

# %%
QUESTIONS = {
    "a": "How large is this one dict?",
    "b": "Did this function allocate more than the last version did?",
    "c": "Why is this process's memory still growing?",
    "d": "How much memory does this NumPy array's buffer use?",
}
for key, text in QUESTIONS.items():
    print(f"{key}. {text}")


def answered_by_getsizeof(key: str) -> bool:
    """True when sys.getsizeof is the right instrument."""
    raise NotImplementedError("Match each question to its lens")


# %%
check("answered_by_getsizeof", answered_by_getsizeof,
      [(("a",), True), (("b",), False), (("c",), False), (("d",), False)])
print()
print("(d) is the trap: getsizeof reports the ARRAY OBJECT, a small fixed header,")
print("and says nothing about the buffer — which is the entire point of the array.")
print("tracemalloc misses it too, for the same reason: it was not allocated by")
print("Python's allocator. Two instruments, one blind spot, no error message.")

# %% [markdown]
# ## 5. The lens comparison

# %%
LENS_COMPARISON = """
Lens | Question it answers | What it counts | What it cannot see
-----+---------------------+----------------+-------------------
     |                     |                |
     |                     |                |
     |                     |                |

The two numbers I compared, and the factor between them:
Why 'deep sizeof' is not a technique — the two problems it runs into:
Why the garbage cycle survived a reference-count sweep:
The question I actually had, and the lens that answers it:
The memory both Python lenses are blind to, and how I would measure it instead:
"""
print(LENS_COMPARISON)

# %%
claim("COURSE MODEL", LENS_COMPARISON)

claim(
    "LOCAL REFERENCE RESULT",
    f"For a list of {ROW_COUNT:,} small dicts on CPython "
    f"{sys.version_info.major}.{sys.version_info.minor}, sys.getsizeof reports "
    f"{shallow:,} bytes for the list alone while tracemalloc measures "
    f"{allocated:,} bytes allocated by the same construction — a factor of "
    f"{ratio:.1f}. Summing getsizeof over the elements gives {deep_elements:,} and "
    f"over their values {deep_contents:,}, both between the two. Separately, on a "
    f"declared object graph containing one reachable cycle and one unreachable "
    f"cycle, a reference-count sweep collects nothing — every node retains a "
    f"non-zero count from its cycle partner — while the cycle collector returns "
    f"exactly the unreachable pair {cycles}.",
    support={"rowCount": ROW_COUNT,
             "lenses": {k: v for k, v in lenses.items()},
             "ratio": ratio,
             "graph": {"reachable": list(reachable),
                       "referenceCounts": [list(pair) for pair
                                           in sweep.reference_counts],
                       "refcountCollected": list(sweep.collected),
                       "cycleCollectorFound": list(cycles),
                       "unreachable": list(unreachable)},
             "limitation": sweep.limitation},
)

non_claim(
    "The size figures are from one CPython build on one platform and would differ "
    "on another — object headers, dict layout, and allocator behaviour are all "
    "implementation details, not language guarantees. tracemalloc counts only "
    "blocks from Python's own allocator, so a NumPy buffer, a C extension's malloc, "
    "or an mmap is invisible to both instruments used here. The reachability result "
    "comes from the reference model's declared graph rule, whose own limitation "
    "string names what it omits: CPython collection timing, generations, "
    "finalizers, immortal objects, and allocator behaviour. Nothing here measures "
    "peak memory, fragmentation, or whether freed memory is returned to the "
    "operating system — which is usually why a process's resident size does not "
    "fall after a large object is released."
)

emit()

# %% [markdown]
# ## 6. Transfer
#
# 1. Three instruments disagreed by 32× and all were correct. Write the rule this
#    implies about quoting a memory number in a review.
# 2. The garbage cycle had non-zero reference counts throughout. Name what
#    reference counting alone can never reclaim, and why a second mechanism exists.
# 3. Bench `m17-s4` produced exact cache-miss counts from a declared geometry.
#    State what that bench and the reachability sweep have in common as evidence.
#
# ---
#
# ## Attributions
#
# Probes `public/downloads/module24_reference.py` — `ObjectGraph`,
# `reachable_nodes`, `reference_count_sweep`, `collect_unreachable_cycles`. Not
# reimplemented. The three-lens size comparison and the question sort are this
# bench's own, on stdlib `sys` and `tracemalloc`.
