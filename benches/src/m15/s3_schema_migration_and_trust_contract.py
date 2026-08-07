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
# # Bench m15-s3 — schema migration and trust contract
#
# **Session 15.3 — A schema version becomes a migration and trust decision.**
# Rungs: **debug and defend** (primary), review and verify.
#
# A version field in a serialized record looks like metadata. It is a **contract**,
# and the interesting question is what a reader does with a version it has never
# seen.
#
# There are only three possible policies, and this bench runs all three against
# the same six records. Two of them lose data silently. The third refuses, and the
# refusal is the feature.
#
# **Requires:** Python 3.12+. Standard library only.

# %%
from _fixture import *  # noqa: F401,F403,E402  (sets up sys.path)

import json  # noqa: E402
import sys  # noqa: E402

from atlas_bench import (  # noqa: E402
    bench, check, checkpoint, claim, emit, non_claim, predict, resolve, reveal,
)

assert sys.version_info >= (3, 12)

bench(module=15, session=3, emits="schema migration and trust contract",
      rungs=["debug-and-defend", "review-and-verify"])

# %% [markdown]
# ## 1. Six records, three schema versions
#
# The reader was written against **v2**. It knows v1 (and how to migrate it) and
# has never heard of v3.

# %%
RECORDS = [
    {"schema": 1, "id": "r1", "label": "alpha", "score": 4},
    {"schema": 1, "id": "r2", "label": "beta", "score": 2},
    {"schema": 2, "id": "r3", "label": "gamma", "confidence": 0.8},
    {"schema": 2, "id": "r4", "label": "delta", "confidence": 0.4},
    # v3 added a field the reader has never seen, and it is load-bearing.
    {"schema": 3, "id": "r5", "label": "epsilon", "confidence": 0.9,
     "retracted": True},
    {"schema": 3, "id": "r6", "label": "zeta", "confidence": 0.7,
     "retracted": False},
]

KNOWN = 2

print(f"{'id':>4}  {'schema':>6}  fields")
for record in RECORDS:
    print(f"{record['id']:>4}  {record['schema']:>6}  "
          f"{sorted(k for k in record if k not in {'id', 'schema'})}")

print(f"\nthe reader understands schema 1 (via migration) and schema {KNOWN}.")
print(f"schema 3 adds 'retracted', which changes whether a record COUNTS.")

# %%
predict(
    "Three reader policies: ignore the version, accept anything at or below the "
    "known version, or refuse anything unrecognised. Each computes a mean "
    "confidence over the records it accepts. Which answers are wrong, and which "
    "of those is wrong SILENTLY?",
    answer="",  # <- fill in
    confidence="",  # sure / fairly sure / guessing
)

# %% [markdown]
# ## 2. Debug — run all three policies

# %%
def migrate_v1(record: dict) -> dict:
    """v1 stored an integer score 0-5; v2 stores a float confidence 0-1."""
    migrated = {k: v for k, v in record.items() if k != "score"}
    migrated["schema"] = 2
    migrated["confidence"] = record["score"] / 5
    return migrated


def read_ignoring_version(records):
    """Policy A: there is a version field and nobody looks at it."""
    accepted = [migrate_v1(r) if r.get("schema") == 1 else r for r in records]
    return {"accepted": accepted, "rejected": []}


def read_accepting_older(records):
    """Policy B: accept anything at or below the version I know."""
    accepted, rejected = [], []
    for record in records:
        version = record.get("schema")
        if version == 1:
            accepted.append(migrate_v1(record))
        elif version == KNOWN:
            accepted.append(record)
        else:
            rejected.append(record["id"])
    return {"accepted": accepted, "rejected": rejected}


def read_refusing_unknown(records):
    """Policy C: refuse the whole batch if any version is unrecognised."""
    unknown = [r["id"] for r in records if r.get("schema") not in {1, KNOWN}]
    if unknown:
        return {"accepted": [], "rejected": unknown, "refused_batch": True}
    return read_accepting_older(records)


def mean_as_v2_reader(accepted) -> float | None:
    """What the v2 reader computes. It has never heard of 'retracted'."""
    if not accepted:
        return None
    return sum(r["confidence"] for r in accepted) / len(accepted)


def mean_as_v3_reader(accepted) -> float | None:
    """What a reader that understands v3 computes: retracted records do not count."""
    live = [r for r in accepted if not r.get("retracted", False)]
    if not live:
        return None
    return sum(r["confidence"] for r in live) / len(live)


POLICIES = {
    "A ignore the version": read_ignoring_version,
    "B accept <= known": read_accepting_older,
    "C refuse unknown": read_refusing_unknown,
}

print(f"{'policy':>22}  {'accepted':>8}  {'rejected':>22}  {'mean confidence':>15}")
outcomes = {}
for label, policy in POLICIES.items():
    result = policy(RECORDS)
    mean = mean_as_v2_reader(result["accepted"])
    outcomes[label] = {"accepted": len(result["accepted"]),
                       "rejected": result["rejected"],
                       "mean": mean,
                       "refusedBatch": result.get("refused_batch", False)}
    print(f"{label:>22}  {len(result['accepted']):>8}  "
          f"{str(result['rejected']):>22}  "
          f"{'n/a' if mean is None else f'{mean:.4f}':>15}")

# The answer a v3-aware reader would compute: migrate v1, keep v2, and honour
# v3's retracted flag.
correct = mean_as_v3_reader([migrate_v1(r) if r["schema"] == 1 else r
                           for r in RECORDS])
print(f"\nwhat a v3-aware reader computes: {correct:.4f}")
print(f"  (r5 is retracted, so it is excluded from the mean)")

a_mean = outcomes["A ignore the version"]["mean"]
b_mean = outcomes["B accept <= known"]["mean"]

checkpoint("policy A silently includes a retracted record",
           abs(a_mean - correct) > 1e-9,
           f"{a_mean:.4f} against the correct {correct:.4f} — 'retracted' was "
           f"just an unknown key, so it was carried along and ignored")
checkpoint("policy B silently drops both v3 records",
           outcomes["B accept <= known"]["rejected"] == ["r5", "r6"]
           and abs(b_mean - correct) > 1e-9,
           f"{b_mean:.4f} — a smaller, cleaner-looking dataset that is missing "
           f"data it never mentions having skipped")
checkpoint("neither A nor B raises anything",
           a_mean is not None and b_mean is not None)
checkpoint("policy C refuses the batch",
           outcomes["C refuse unknown"]["refusedBatch"]
           and outcomes["C refuse unknown"]["mean"] is None,
           "the only policy that produces no number rather than a wrong one")

# %%
resolve(
    "Three reader policies: ignore the version, accept anything at or below the "
    "known version, or refuse anything unrecognised. Each computes a mean "
    "confidence over the records it accepts. Which answers are wrong, and which "
    "of those is wrong SILENTLY?",
    "matched",  # matched / diverged / partial
)

# %%
reveal(
    "Three reader policies: ignore the version, accept anything at or below the "
    "known version, or refuse anything unrecognised. Each computes a mean "
    "confidence over the records it accepts. Which answers are wrong, and which "
    "of those is wrong SILENTLY?",
    """
    Both A and B produce a wrong number, and both do it silently. Only C produces
    no number, which is why it is the one to ship.

    **Policy A** ignores the version entirely. It reads `confidence` off every
    record, including `r5`, whose `retracted: True` it has never heard of and
    therefore treats as an unremarkable extra key. The retracted record is counted
    in the mean. Nothing is missing, nothing raises, and the answer is wrong
    because a field the reader could not interpret was *load-bearing*.

    This is the failure mode of "be liberal in what you accept" applied without
    limit. Unknown fields are not always decoration. Sometimes they are the field
    that says this record does not count, or that the units changed, or that the
    value is an estimate. A reader that skips what it cannot understand has decided
    those cases do not exist.

    **Policy B** looks much more careful and is wrong in the opposite direction. It
    checks the version, refuses what it does not know, and drops both v3 records —
    including `r6`, which is a perfectly good live record. The result is a smaller
    dataset that *looks* clean. There is no error, no warning, and no marker on the
    output saying "computed over 4 of 6 records". The mean is now over a
    non-random subset: specifically, the newest records, which are exactly the ones
    most likely to differ from the old.

    That last point is the one worth taking away. Version-based filtering does not
    drop records at random. It drops the *recent* ones, so the surviving sample is
    systematically stale — and the more the schema has moved, the more stale it is.
    A metric computed this way drifts further from the truth as the system evolves,
    while never once failing.

    **Policy C** refuses. Not "returns 0", not "returns partial results with a
    warning" — refuses to produce a number at all. That feels unhelpful, and it is
    the only honest option available, because the reader genuinely cannot know what
    `retracted` means. Any number it produced would be a guess wearing a decimal
    point.

    The trust contract underneath is what makes this decidable at all: a producer
    must promise that **a version change means the reader may not guess**, and a
    reader must promise to **refuse rather than approximate**. Without that pairing,
    the version field is decoration. With it, C is not a limitation — it is the
    reader correctly reporting that its evidence is insufficient, which is the same
    move as bench `m24-s6`'s `INSUFFICIENT_EVIDENCE` and bench `m25-s4`'s
    `calibration_supported=False`.

    And the practical repair is not "always refuse". It is to make the *policy* an
    explicit, reviewable decision per field: which unknown additions are safe to
    ignore, and which force a refusal. That is a contract the producer has to write
    down, and a version number alone does not carry it.
    """,
)

# %% [markdown]
# ## 3. Verify — what the wire format does and does not preserve

# %%
ROUND_TRIP = {"schema": 2, "id": "r7", "label": "eta", "confidence": 0.5,
              "tags": ("a", "b"), "count": 3}

encoded = json.dumps(ROUND_TRIP)
decoded = json.loads(encoded)

print(f"before: {ROUND_TRIP}")
print(f"after : {decoded}")
print(f"\nequal? {ROUND_TRIP == decoded}")
print(f"  tags type: {type(ROUND_TRIP['tags']).__name__} -> "
      f"{type(decoded['tags']).__name__}")

checkpoint("the round trip is not equal", ROUND_TRIP != decoded)
checkpoint("a tuple came back as a list",
           isinstance(ROUND_TRIP["tags"], tuple)
           and isinstance(decoded["tags"], list),
           "JSON has one sequence type; Python has several")
checkpoint("and nothing raised", decoded["tags"] == ["a", "b"],
           "the values survived; the type did not, and no schema version "
           "records that")

# %% [markdown]
# ## 4. Review and verify — classify four schema changes

# %%
CHANGES = {
    "a": "Add an optional field readers may ignore.",
    "b": "Add a field that marks a record as retracted.",
    "c": "Change 'confidence' from a 0-5 int to a 0-1 float.",
    "d": "Rename 'label' to 'title'.",
}
for key, text in CHANGES.items():
    print(f"{key}. {text}")


def safe_for_an_old_reader(key: str) -> bool:
    """True when a reader that does not know this change still computes correctly."""
    raise NotImplementedError("Judge each change from the OLD reader's position")


# %%
check("safe_for_an_old_reader", safe_for_an_old_reader,
      [(("a",), True), (("b",), False), (("c",), False), (("d",), False)])
print()
print("(b) and (c) are the dangerous pair, and they fail differently. (b) is an")
print("ADDITION that an old reader ignores and must not — the shape this bench")
print("measured. (c) keeps the field name and changes its meaning, so an old")
print("reader parses it happily and is off by a factor of five. (d) at least")
print("fails loudly with a KeyError, which makes it the safest of the three.")

# %% [markdown]
# ## 5. The migration and trust contract

# %%
TRUST_CONTRACT = """
The version field, and what a change to it obliges a reader to do:
Each policy, with the number it produced and how it was wrong:
Which policy's error is systematic rather than random, and in which direction:
The unknown field that was load-bearing, and why 'ignore what you don't know' failed:
What the wire format silently changed, that no version number records:
The per-field policy I would write down, and who has to publish it:
The refusal I am willing to ship, and what makes it better than a partial answer:
"""
print(TRUST_CONTRACT)

# %%
claim("DEFENDED REPAIR", TRUST_CONTRACT)

claim(
    "LOCAL REFERENCE RESULT",
    f"Over {len(RECORDS)} records spanning three schema versions, a reader that "
    f"ignores the version computes a mean confidence of {a_mean:.4f} by counting a "
    f"record whose unrecognised 'retracted' flag was set; a reader that accepts "
    f"only known-or-older versions computes {b_mean:.4f} after silently dropping "
    f"both newest records; and the correct value is {correct:.4f}. Neither wrong "
    f"answer raises. Only the refusing policy returns no number. Separately, a "
    f"tuple field survives a JSON round trip as a list, with no schema version "
    f"recording the change.",
    support={"records": RECORDS, "knownVersion": KNOWN,
             "correctMean": correct,
             "policies": outcomes,
             "roundTrip": {"before": {k: (list(v) if isinstance(v, tuple) else v)
                                      for k, v in ROUND_TRIP.items()},
                           "after": decoded,
                           "equal": ROUND_TRIP == decoded}},
)

non_claim(
    "This is six hand-written records and three hand-written reader policies over "
    "stdlib json; no file is written and no real schema registry is consulted. It "
    "establishes that two plausible reader policies produce wrong numbers without "
    "raising, and that version-based filtering drops the newest records rather "
    "than a random subset. It does not establish how often real schemas make "
    "load-bearing additions, evaluates no actual serialization library's "
    "compatibility guarantees, and says nothing about formats with declared schema "
    "evolution rules — Avro, Protobuf, and Parquet all address exactly this, and "
    "comparing them is the design work this bench only motivates."
)

emit()

# %% [markdown]
# ## 6. Transfer
#
# 1. Two policies gave wrong answers and neither raised. Write the property a
#    reader must have before "ignore unknown fields" is safe.
# 2. Version filtering dropped the newest records. Name why that is worse than
#    dropping a random 33%, in one sentence about the resulting metric.
# 3. Bench `m25-s4` found a card that refused to support a calibration claim. State
#    what that refusal and policy C have in common.
#
# ---
#
# ## Attributions
#
# Module 15 has no checked-in reference model. The records, the three reader
# policies, and the change classification are this bench's own, on stdlib `json`.
