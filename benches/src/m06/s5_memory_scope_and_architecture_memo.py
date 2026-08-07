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
# # Bench m06-s5 — memory-scope and architecture memo
#
# **Session 6.5 — Locality, memory, and architecture reading.** Rungs: **trace**
# (primary), map.
#
# The workbook says to use `sys.getsizeof` only after predicting what it excludes.
# That instruction is unfollowable on a page — you cannot be wrong about a number
# you never see. Here you predict, then read it.
#
# **Requires:** Python 3.12+. Standard library only.

# %%
from _fixture import StudyEvent, make_events  # noqa: E402

import sys  # noqa: E402
import time  # noqa: E402

from atlas_bench import (  # noqa: E402
    bench, check, checkpoint, claim, emit, measure, non_claim, predict, resolve, reveal,
)

assert sys.version_info >= (3, 12)

bench(module=6, session=5, emits="memory-scope and architecture memo",
      rungs=["trace", "map"])

# %% [markdown]
# ## 1. Prediction

# %%
COUNT = 10_000
events = make_events(COUNT)

predict(
    f"A list of {COUNT:,} StudyEvent objects, each with a topic string, an int, "
    f"and a tag tuple. Roughly what will sys.getsizeof(list) report — tens of "
    f"kilobytes, hundreds of kilobytes, or megabytes?",
    answer="",  # <- fill in
    confidence="",  # sure / fairly sure / guessing
)

# %% [markdown]
# ## 2. Trace — measure each layer separately

# %%
list_only = sys.getsizeof(events)
one_event = sys.getsizeof(events[0])
one_topic = sys.getsizeof(events[0].topic)
one_tags = sys.getsizeof(events[0].tags)

deep = list_only + sum(
    sys.getsizeof(e) + sys.getsizeof(e.topic) + sys.getsizeof(e.tags)
    for e in events
)

print(f"sys.getsizeof(list)            : {list_only:>12,} bytes")
print(f"  bytes per element in the list: {list_only / COUNT:>12.1f}")
print(f"  a pointer on this build       : {sys.getsizeof(events) // COUNT:>12} (approx)")
print()
print(f"sys.getsizeof(one StudyEvent)  : {one_event:>12,}")
print(f"sys.getsizeof(its topic str)   : {one_topic:>12,}")
print(f"sys.getsizeof(its tags tuple)  : {one_tags:>12,}")
print()
print(f"summed one level deep          : {deep:>12,} bytes")
print(f"ratio deep / list-only         : {deep / list_only:>12.1f}x")

checkpoint("the list itself is tens of kilobytes",
           list_only < 200_000)
checkpoint("the objects it refers to are an order of magnitude more",
           deep > list_only * 10,
           f"{deep / list_only:.1f}x")
checkpoint("per-element cost in the list is pointer-sized",
           7 <= list_only / COUNT <= 9,
           f"{list_only / COUNT:.1f} bytes — one pointer, not one event")

# %%
resolve(
    f"A list of {COUNT:,} StudyEvent objects, each with a topic string, an int, "
    f"and a tag tuple. Roughly what will sys.getsizeof(list) report — tens of "
    f"kilobytes, hundreds of kilobytes, or megabytes?",
    "diverged",  # matched / diverged / partial
)

# %%
reveal(
    f"A list of {COUNT:,} StudyEvent objects, each with a topic string, an int, "
    f"and a tag tuple. Roughly what will sys.getsizeof(list) report — tens of "
    f"kilobytes, hundreds of kilobytes, or megabytes?",
    """
    Tens of kilobytes — about eight bytes per element, whatever the elements are.

    A Python list does not contain its elements. It contains an array of
    *pointers* to them, and `sys.getsizeof` reports the size of the object you
    handed it and nothing it refers to. Eight bytes per slot is one pointer on a
    64-bit build. Fill the same list with integers, with strings, or with
    thousand-field objects and the number barely moves.

    Summing one level deeper — the events, their topic strings, their tag tuples —
    lands an order of magnitude higher, and even that is an undercount: the tag
    tuple is itself a pointer array, and its strings are shared rather than
    counted once each.

    This is the memory-scope question the session is named for. "How much memory
    does this list use?" has no answer until you say **whose** memory:

    - the list object alone — a header plus a pointer array;
    - the list plus everything uniquely reachable from it — the usual intent, and
      the hard one, because *uniquely* requires knowing what else holds a
      reference;
    - the process's resident set — which includes the interpreter, the allocator's
      unreturned arenas, and every other object alive.

    `sys.getsizeof` answers only the first. Reporting it as the second is the
    error, and it under-reports by whatever factor the payload happens to be.

    The architectural consequence: an indirection is a decision about where cost
    lives. The list's uniform eight bytes per slot is what makes it cheap to
    resize and reorder, and it is exactly why traversing it touches memory
    scattered across the heap rather than one contiguous run.
    """,
)

# %% [markdown]
# ## 3. Map — the cost of that indirection
#
# Two traversals, both Θ(n), both touching every element once. One reads a
# contiguous array of machine integers; the other chases pointers to objects.

# %%
import array  # noqa: E402

contiguous = array.array("q", range(COUNT))
scattered = [StudyEvent(f"t{i}", i) for i in range(COUNT)]


def scan_contiguous(_: int) -> int:
    return sum(contiguous)


def scan_scattered(_: int) -> int:
    return sum(e.minutes for e in scattered)


contiguous_time = measure(scan_contiguous, [0], repeats=20)[0]
scattered_time = measure(scan_scattered, [0], repeats=20)[0]

print(f"contiguous array scan : {contiguous_time * 1e6:>9.1f} us")
print(f"pointer-chasing scan  : {scattered_time * 1e6:>9.1f} us")
print(f"ratio                 : {scattered_time / contiguous_time:>9.1f}x")

checkpoint("both are linear in the same n", True,
           "the difference is not a complexity difference")
checkpoint("the scattered traversal is measurably slower",
           scattered_time > contiguous_time)

print()
print("This ratio is a HYPOTHESIS about locality and attribute lookup, not a")
print("measurement of cache behaviour. The scan also does attribute access and")
print("a generator step that the array scan does not, and this bench cannot")
print("separate those causes.")

# %% [markdown]
# ## 4. Map — classify four statements

# %%
STATEMENTS = {
    "a": f"sys.getsizeof(events) is about {list_only:,} bytes.",
    "b": "The events list uses about that much memory in total.",
    "c": "Replacing StudyEvent with a larger object would raise "
         "sys.getsizeof(events).",
    "d": "The pointer-chasing scan is slower because of cache misses.",
}
for key, text in STATEMENTS.items():
    print(f"{key}. {text}")


def is_supported(key: str) -> bool:
    """True when this bench's evidence supports the statement."""
    raise NotImplementedError("Classify each statement")


# %%
check("is_supported", is_supported,
      [(("a",), True), (("b",), False), (("c",), False), (("d",), False)])
print()
print("(d) is the trap: the timing is real and the CAUSE is not established.")
print("Attribution needs an experiment that varies locality alone.")

# %% [markdown]
# ## 5. The memo

# %%
MEMO = """
What sys.getsizeof counts, stated precisely:
The three different questions 'how much memory' could mean:
The measured indirection cost, and the causes this bench cannot separate:
The architectural trade the pointer array buys:
"""
print(MEMO)

# %%
claim("DEFINITION / MODEL", MEMO)

claim(
    "CPYTHON OBSERVATION",
    f"A list of {COUNT:,} objects reports {list_only:,} bytes from "
    f"sys.getsizeof — {list_only / COUNT:.1f} per element, pointer-sized — while "
    f"summing one level deep gives {deep:,} bytes, {deep / list_only:.1f}x more.",
    support={"count": COUNT, "listOnly": list_only, "deepSum": deep,
             "bytesPerElement": list_only / COUNT,
             "oneEvent": one_event, "oneTopic": one_topic},
)

claim(
    "HYPOTHESIS",
    f"A pointer-chasing scan measured {scattered_time / contiguous_time:.1f}x a "
    f"contiguous scan at the same n. Locality is a plausible contributor; "
    f"attribute lookup and generator overhead are confounded with it here.",
    support={"contiguousSeconds": contiguous_time,
             "scatteredSeconds": scattered_time,
             "ratio": scattered_time / contiguous_time},
)

non_claim(
    "The timing ratio does not establish cache behaviour. The two scans differ in "
    "locality, in attribute access, and in iteration machinery, and this bench "
    "varies all three at once. Any claim about cache misses needs an experiment "
    "that holds the other two fixed — which Module 17 has the vocabulary for."
)

emit()

# %% [markdown]
# ## 6. Transfer
#
# 1. `sys.getsizeof` answered a narrower question than the one asked. Write the
#    rule about tools that answer a question adjacent to yours.
# 2. The timing was real and its cause was not established. Name the experiment
#    that would isolate locality.
# 3. Bench `m05-s4` measured amortized copies on the same object. State what that
#    bench establishes that this one does not, and the reverse.
#
# ---
#
# ## Attributions
#
# Authored for this course. Module 6 has no checked-in reference model.
# Deliberately complements `m05-s4`: that bench measures amortized time, this one
# asks what the representation actually stores.
