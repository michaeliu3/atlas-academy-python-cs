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
# # Bench m15-s1 — representation boundary trace
#
# **Session 15.1 — One event crosses text, byte, and path boundaries.** Rungs:
# **trace** (primary), debug and defend.
#
# "The same value" is not a property a value has. It is a claim about a specific
# equivalence, and every boundary a value crosses gets to disagree about which
# equivalence it means.
#
# This bench takes two pairs that are *obviously* the same, and follows them across
# equality, length, bytes, hashing, dict identity, and JSON. Both pairs come apart,
# in different places, and one of them silently loses data on the way out.
#
# **Requires:** Python 3.12+. Standard library only.

# %%
from _fixture import *  # noqa: F401,F403,E402  (sets up sys.path)

import hashlib  # noqa: E402
import json  # noqa: E402
import sys  # noqa: E402
import unicodedata  # noqa: E402

from atlas_bench import (  # noqa: E402
    bench, check, checkpoint, claim, emit, non_claim, predict, resolve, reveal,
)

assert sys.version_info >= (3, 12)

bench(module=15, session=1, emits="representation boundary trace",
      rungs=["trace", "debug-and-defend"])

# %% [markdown]
# ## 1. Two pairs that look identical

# %%
NFC = unicodedata.normalize("NFC", "café")
NFD = unicodedata.normalize("NFD", "café")

print("pair 1 — the same word, two normal forms:")
print(f"  NFC: {NFC!r}")
print(f"  NFD: {NFD!r}")
print(f"  rendered, side by side: {NFC}  {NFD}   <- indistinguishable")

print(f"\npair 2 — a boolean and an integer:")
print(f"  True == 1: {True == 1}")
print(f"  isinstance(True, int): {isinstance(True, int)}")

# %%
predict(
    "Build a dict with BOTH members of each pair as keys. How many entries does "
    "each dict end up with — and what does json.dumps produce for them?",
    answer="",  # <- fill in
    confidence="",  # sure / fairly sure / guessing
)

# %% [markdown]
# ## 2. Trace — follow pair 1 across six boundaries

# %%
unicode_boundaries = {
    "== equality": NFC == NFD,
    "same length": len(NFC) == len(NFD),
    "same utf-8 bytes": NFC.encode("utf-8") == NFD.encode("utf-8"),
    "same sha-256": (hashlib.sha256(NFC.encode()).hexdigest()
                     == hashlib.sha256(NFD.encode()).hexdigest()),
    "same dict key": len({NFC: 1, NFD: 2}) == 1,
    "same JSON text": json.dumps(NFC) == json.dumps(NFD),
}

print(f"{'boundary':>20}  {'agrees?':>8}  detail")
print(f"{'== equality':>20}  {str(NFC == NFD):>8}")
print(f"{'length':>20}  {str(len(NFC) == len(NFD)):>8}  "
      f"{len(NFC)} against {len(NFD)} code points")
print(f"{'utf-8 bytes':>20}  {str(NFC.encode() == NFD.encode()):>8}  "
      f"{len(NFC.encode())} against {len(NFD.encode())} bytes")
print(f"{'sha-256':>20}  {str(unicode_boundaries['same sha-256']):>8}  "
      f"{hashlib.sha256(NFC.encode()).hexdigest()[:12]}... against "
      f"{hashlib.sha256(NFD.encode()).hexdigest()[:12]}...")
print(f"{'dict key':>20}  {str(unicode_boundaries['same dict key']):>8}  "
      f"{{NFC: 1, NFD: 2}} has {len({NFC: 1, NFD: 2})} entries")
print(f"{'JSON':>20}  {str(unicode_boundaries['same JSON text']):>8}  "
      f"{json.dumps(NFC)} against {json.dumps(NFD)}")

checkpoint("the two forms render identically to a human", True,
           "nothing on screen distinguishes them")
checkpoint("and disagree at every mechanical boundary",
           not any(unicode_boundaries.values()),
           f"{sum(1 for v in unicode_boundaries.values() if not v)} of "
           f"{len(unicode_boundaries)} boundaries say 'different'")
checkpoint("normalizing both to one form makes them agree",
           unicodedata.normalize("NFC", NFD) == NFC,
           "the repair is to pick a form at the boundary, not to compare harder")

# %% [markdown]
# ## 3. Debug — follow pair 2, and watch a key disappear

# %%
mixed = {True: "from True", 1: "from 1"}
mixed_json = json.dumps({True: 1, 1: 2})

print(f"{{True: 'from True', 1: 'from 1'}}")
print(f"  entries : {len(mixed)}")
print(f"  keys    : {list(mixed.keys())}  (types: "
      f"{[type(k).__name__ for k in mixed]})")
print(f"  values  : {list(mixed.values())}")
print(f"\njson.dumps({{True: 1, 1: 2}}) = {mixed_json}")

surviving_key = list(mixed.keys())[0]
surviving_value = list(mixed.values())[0]

checkpoint("two distinct-looking keys collapse into one", len(mixed) == 1)
checkpoint("the surviving KEY is the first one written",
           surviving_key is True and type(surviving_key) is bool,
           f"{surviving_key!r} of type {type(surviving_key).__name__}")
checkpoint("and the surviving VALUE is the last one written",
           surviving_value == "from 1",
           "the key object is not replaced; only the value is")
checkpoint("JSON renders that key as the string \"true\"",
           mixed_json == '{"true": 2}',
           "a bool key becomes text, so the round trip cannot restore either "
           "original key")

# %% [markdown]
# ### The round trip

# %%
round_tripped = json.loads(mixed_json)
print(f"before: {{True: 1, 1: 2}}")
print(f"after : {round_tripped}")
print(f"key type before: bool/int      key type after: "
      f"{type(list(round_tripped)[0]).__name__}")

checkpoint("the round trip does not restore the original",
           round_tripped != {True: 1, 1: 2}
           and list(round_tripped)[0] == "true")
checkpoint("and nothing raised at any point", True,
           "no exception, no warning — a key was lost and a type was changed")

# %%
resolve(
    "Build a dict with BOTH members of each pair as keys. How many entries does "
    "each dict end up with — and what does json.dumps produce for them?",
    "matched",  # matched / diverged / partial
)

# %%
reveal(
    "Build a dict with BOTH members of each pair as keys. How many entries does "
    "each dict end up with — and what does json.dumps produce for them?",
    """
    The Unicode pair gives **two** entries. The boolean pair gives **one**. Both
    answers are surprising, and they are surprising in opposite directions.

    Start with `café`. The two strings look identical because they *are* the same
    word — NFC stores `é` as one code point, NFD stores it as `e` followed by a
    combining acute accent. Your terminal renders both the same way, deliberately.
    But they are 4 and 5 code points, 5 and 6 UTF-8 bytes, they hash differently,
    they are different dict keys, and they serialize to different JSON. Every
    mechanical boundary says "different"; only the rendering says "same".

    This is not a curiosity. macOS filesystems have historically normalized to NFD
    and Linux does not, so a filename written on one and looked up on the other
    misses — with a `FileNotFoundError` naming a file you can see in the directory
    listing. A username typed on a phone and compared against a database is the
    same failure. And a content hash over unnormalized text means two byte-identical
    documents that differ only in normalization get different digests, so
    deduplication silently fails.

    Now `True` and `1`, which fail the other way. `bool` is a subclass of `int`,
    `True == 1`, and `hash(True) == hash(1)`. So a dict cannot hold both: the
    second assignment finds the existing key and **updates its value while keeping
    the original key object**. That asymmetry is the part worth memorising — you
    end up with the *first* key and the *last* value, which is a combination
    neither line of code wrote.

    Then JSON makes it worse. `json.dumps` renders a boolean key as the string
    `"true"`, so `{True: 1, 1: 2}` becomes `{"true": 2}`. Parse that back and you
    have a string key. The original was an int or a bool depending on which line
    you read; the round trip produces neither. Two keys went in, one string came
    out, and at no point did anything raise.

    The general shape is the session's whole subject: **"the same" is relative to
    an equivalence, and each boundary picks its own.** Python's `==`, a hash table,
    a UTF-8 encoder, a SHA-256 digest, a JSON serializer, and a filesystem are six
    different judges, and they do not have to agree. Code that says "these are the
    same value" without naming which judge has asserted nothing checkable.

    The repair is not to compare more carefully. It is to **normalize at the
    boundary** — pick NFC (or NFD) when text enters, pick a key type before it
    reaches a serializer — so that only one equivalence is ever in play downstream.
    Bench `m16-s2` found SQLite converting a NaN to NULL on the way in; this is the
    same class of event, except here nothing converts anything and the loss happens
    because two things were equal when you needed them distinct.
    """,
)

# %% [markdown]
# ## 4. Debug — where normalization has to happen

# %%
INCOMING = [NFD, NFC, "cafe", unicodedata.normalize("NFD", "café")]

raw_distinct = len(set(INCOMING))
normalized_distinct = len({unicodedata.normalize("NFC", value)
                           for value in INCOMING})

print(f"four incoming values, two of them the same word in different forms:")
for value in INCOMING:
    print(f"  {value!r}  ({len(value)} code points)")

print(f"\ndistinct as received : {raw_distinct}")
print(f"distinct normalized  : {normalized_distinct}")

digests_raw = {hashlib.sha256(v.encode()).hexdigest() for v in INCOMING}
digests_norm = {hashlib.sha256(unicodedata.normalize("NFC", v).encode()).hexdigest()
                for v in INCOMING}

print(f"\ndistinct sha-256 as received: {len(digests_raw)}")
print(f"distinct sha-256 normalized : {len(digests_norm)}")

checkpoint("deduplication over raw text overcounts",
           raw_distinct > normalized_distinct,
           f"{raw_distinct} against {normalized_distinct} — the same word counted "
           f"twice")
checkpoint("content hashing has the same failure",
           len(digests_raw) > len(digests_norm))
checkpoint("normalizing once at the boundary fixes both",
           normalized_distinct == len(digests_norm) == 2)

# %% [markdown]
# ## 5. Recognize — which judge is being asked?

# %%
SITUATIONS = {
    "a": "Two strings are `==` in Python.",
    "b": "Two strings produce the same SHA-256.",
    "c": "Two strings are the same dict key.",
    "d": "Two strings name the same file on disk.",
}
for key, text in SITUATIONS.items():
    print(f"{key}. {text}")


def implies_same_bytes(key: str) -> bool:
    """True when this establishes the two strings have identical UTF-8 bytes."""
    raise NotImplementedError("Name what each equivalence actually asserts")


# %%
check("implies_same_bytes", implies_same_bytes,
      [(("a",), True), (("b",), True), (("c",), True), (("d",), False)])
print()
print("(d) is the odd one out, and it goes the other way from the rest: two")
print("DIFFERENT byte strings can name the same file, because the filesystem may")
print("normalize, case-fold, or both. So the filesystem is the one judge that can")
print("say 'same' when Python says 'different' — which is why a path is not a")
print("string, and why round-tripping one through str comparison is unsafe.")

# %% [markdown]
# ## 6. The representation boundary trace

# %%
BOUNDARY_TRACE = """
The value, and every representation it takes on its way out:
Each boundary, with the equivalence it uses and the answer it gives:
The boundary where the two forms first diverge:
The key that was lost, with the key/value combination that survived:
Where I would normalize, and which form I would choose:
The claim 'these are the same value', rewritten to name its judge:
"""
print(BOUNDARY_TRACE)

# %%
claim("COURSE MODEL", BOUNDARY_TRACE)

claim(
    "LOCAL REFERENCE RESULT",
    f"On CPython {sys.version_info.major}.{sys.version_info.minor}, the NFC and NFD "
    f"forms of 'café' render identically and disagree at all "
    f"{len(unicode_boundaries)} mechanical boundaries tested: {len(NFC)} against "
    f"{len(NFD)} code points, {len(NFC.encode())} against {len(NFD.encode())} "
    f"UTF-8 bytes, different SHA-256 digests, distinct dict keys, and different "
    f"JSON text. Separately, {{True: 'from True', 1: 'from 1'}} yields "
    f"{len(mixed)} entry whose key is {surviving_key!r} (type "
    f"{type(surviving_key).__name__}) and whose value is {surviving_value!r} — the "
    f"first key with the last value — and json.dumps({{True: 1, 1: 2}}) produces "
    f"{mixed_json}, which round-trips to a string key. Nothing raised.",
    support={"pythonVersion": f"{sys.version_info.major}.{sys.version_info.minor}",
             "nfc": {"repr": NFC, "codePoints": len(NFC),
                     "utf8Bytes": len(NFC.encode()),
                     "sha256": hashlib.sha256(NFC.encode()).hexdigest()},
             "nfd": {"repr": NFD, "codePoints": len(NFD),
                     "utf8Bytes": len(NFD.encode()),
                     "sha256": hashlib.sha256(NFD.encode()).hexdigest()},
             "boundaryAgreement": unicode_boundaries,
             "boolIntCollision": {"entries": len(mixed),
                                  "survivingKey": repr(surviving_key),
                                  "survivingKeyType": type(surviving_key).__name__,
                                  "survivingValue": surviving_value,
                                  "json": mixed_json,
                                  "roundTripped": round_tripped},
             "deduplication": {"rawDistinct": raw_distinct,
                               "normalizedDistinct": normalized_distinct,
                               "rawDigests": len(digests_raw),
                               "normalizedDigests": len(digests_norm)}},
)

non_claim(
    "These are properties of CPython's str, dict, hashlib, and json on this "
    "version, exercised on two hand-chosen pairs. The Unicode normalization "
    "behaviour is standard and holds generally; the bool/int subclassing is a "
    "Python language fact. Nothing here touches a real filesystem, so the claim "
    "about macOS NFD and Linux path lookup is stated from documentation rather "
    "than measured — it is the reason the boundary matters, not a result of this "
    "bench. Nothing here covers case folding, locale-dependent collation, "
    "bidirectional text, or the security implications of confusable characters, "
    "each of which adds a judge this bench did not consult."
)

emit()

# %% [markdown]
# ## 7. Transfer
#
# 1. Six boundaries gave two different verdicts on "same". Write the rule this
#    implies about any code comment claiming two values are equal.
# 2. The surviving entry had the first key and the last value. Name what that
#    combination means for a `dict.update` on data from two sources.
# 3. Bench `m16-s2` found SQLite silently converting a NaN to NULL. State what that
#    and the lost dict key have in common, and how they differ.
#
# ---
#
# ## Attributions
#
# Module 15 has no checked-in reference model. The pairs, the six-boundary sweep,
# and the deduplication comparison are this bench's own, on stdlib `unicodedata`,
# `hashlib`, and `json`.
