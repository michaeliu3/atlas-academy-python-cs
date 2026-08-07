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
# # Bench m08-s3 — key-contract repair note
#
# **Session 8.3 — Keys are behavioral contracts.** Rungs: **debug and defend**
# (primary), trace.
#
# A dictionary entry that is simultaneously stored and unreachable. No exception,
# no warning, and `len()` still says one.
#
# **Requires:** Python 3.12+. Standard library only.

# %%
from _fixture import FrozenTopic, MutableTopic  # noqa: E402

import sys  # noqa: E402

from atlas_bench import (  # noqa: E402
    bench, check, checkpoint, claim, emit, non_claim, predict, resolve, reveal,
)

assert sys.version_info >= (3, 12)

bench(module=8, session=3, emits="key-contract repair note",
      rungs=["debug-and-defend", "trace"])

# %% [markdown]
# ## 1. Insert, then edit the key

# %%
topic = MutableTopic("recursion", "Recursion")
index = {topic: 42}

before = {
    "len": len(index),
    "in": topic in index,
    "lookup": index.get(topic),
}
print(f"before mutation: {before}")

# %%
predict(
    "The key object is mutated so its slug — and therefore its hash — changes, "
    "while the dict is not touched. Afterwards, what does `topic in index` "
    "return, and what does len(index) return?",
    answer="",  # <- fill in
    confidence="",  # sure / fairly sure / guessing
)

# %% [markdown]
# ## 2. Trace — the entry is stored and unreachable

# %%
topic.slug = "recursion-v2"

after = {
    "len": len(index),
    "in": topic in index,
    "lookup": index.get(topic),
    "iteration": [k.slug for k in index],
    "values": list(index.values()),
}
print(f"after mutation : {after}")

checkpoint("the dict still reports one entry", after["len"] == 1)
checkpoint("but the key is no longer found", after["in"] is False)
checkpoint("and lookup returns nothing", after["lookup"] is None)
checkpoint("while iteration still yields it", after["iteration"] == ["recursion-v2"],
           "stored, visible on iteration, unreachable by lookup")

# %%
resolve(
    "The key object is mutated so its slug — and therefore its hash — changes, "
    "while the dict is not touched. Afterwards, what does `topic in index` "
    "return, and what does len(index) return?",
    "diverged",  # matched / diverged / partial
)

# %%
reveal(
    "The key object is mutated so its slug — and therefore its hash — changes, "
    "while the dict is not touched. Afterwards, what does `topic in index` "
    "return, and what does len(index) return?",
    """
    `topic in index` is False. `len(index)` is 1. Both are correct.

    A dict places an entry in a bucket chosen from the key's hash **at insertion
    time**. Nothing re-examines that placement afterwards. Mutating the key
    changes what `hash(topic)` returns now, so lookup probes a different bucket —
    one that does not contain the entry — and reports it missing.

    The entry itself is untouched. `len` counts entries, so it says one.
    Iteration walks the storage directly rather than hashing anything, so the key
    is right there and yields its new slug. The dict is internally consistent and
    externally lying.

    What makes this worse than a crash:

    - **No error is raised.** Nothing in the language detects it, because nothing
      is watching the key for changes. The failure surfaces later, somewhere else,
      as a missing record.
    - **It is not recoverable by re-inserting.** Inserting the same object again
      adds a *second* entry, in the new bucket, and now `len` is 2 with the
      original value stranded.
    - **The invariant is on the key, not the dict.** The requirement is that a
      key's hash never changes while it is in a hash-based container. Python
      enforces this for its own immutable types by making them immutable, and
      cannot enforce it for yours.

    That is why `__hash__` on a mutable object is a contract violation waiting to
    happen rather than a style preference. The repair is not to remember not to
    mutate — it is to make mutation impossible, so the obligation cannot be
    forgotten by someone who never read this note.
    """,
)

# %% [markdown]
# ## 3. It gets worse — re-inserting

# %%
index[topic] = 43
print(f"after re-insert: len={len(index)}  values={sorted(index.values())}")
print(f"                keys={[k.slug for k in index]}")

checkpoint("re-inserting creates a second entry", len(index) == 2)
checkpoint("and the original value is stranded", 42 in index.values(),
           "reachable by iteration, unreachable by any key")

# %% [markdown]
# ## 4. Debug and defend — the repair

# %%
def survives_mutation_attempt(topic_class) -> bool:
    """True when the key cannot be mutated out of its bucket."""
    key = topic_class("recursion", "Recursion")
    store = {key: 42}
    try:
        key.slug = "recursion-v2"
    except (AttributeError, TypeError):
        return key in store          # mutation refused: still findable
    return key in store              # mutation allowed: probably lost


def hash_is_stable(topic_class) -> bool:
    """True when hash() cannot change over an object's lifetime."""
    key = topic_class("recursion", "Recursion")
    first = hash(key)
    try:
        key.slug = "changed"
    except (AttributeError, TypeError):
        pass
    return hash(key) == first


check("survives_mutation_attempt", survives_mutation_attempt,
      [((MutableTopic,), False), ((FrozenTopic,), True)])
check("hash_is_stable", hash_is_stable,
      [((MutableTopic,), False), ((FrozenTopic,), True)])

REPAIR_NOTE = """
The contract a dict key must satisfy, stated precisely:
Which half of the contract the mutable key broke, and when:
Why len() and iteration disagreed with lookup:
Why 'remember not to mutate keys' is the weaker repair:
"""
print(REPAIR_NOTE)

# %% [markdown]
# ## 5. The note

# %%
claim("DEFENDED REPAIR", REPAIR_NOTE)

claim(
    "COUNTEREXAMPLE",
    f"After mutating a key in place, the dict reports len {after['len']} and "
    f"iteration yields the key, while `in` returns {after['in']} and lookup "
    f"returns {after['lookup']}. Re-inserting the same object produces a second "
    f"entry and strands the original value.",
    support={"before": before,
             "after": {k: v for k, v in after.items()},
             "afterReinsert": {"len": len(index), "values": sorted(index.values())}},
)

non_claim(
    "This exercises one container and one mutation. It shows a hash-based lookup "
    "cannot survive a key whose hash changes; it says nothing about sets, about "
    "keys whose __eq__ rather than __hash__ is unstable, or about what any "
    "particular dict implementation does on resize — the entry might be "
    "rediscovered or lost differently there."
)

emit()

# %% [markdown]
# ## 6. Transfer
#
# 1. `len` and `in` disagreed and both were correct. Write the rule about which
#    dict operations consult the hash.
# 2. Freezing the key made the bug unrepresentable. Name the general technique and
#    one place elsewhere in this course it applies.
# 3. Session 2 builds keys that all collide. Is a collision the same kind of
#    problem as an unstable hash, or a different one?
#
# ---
#
# ## Attributions
#
# Authored for this course. Module 8 has no checked-in reference model.
