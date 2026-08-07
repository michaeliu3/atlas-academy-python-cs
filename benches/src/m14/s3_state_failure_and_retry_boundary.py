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
# # Bench m14-s3 — state, failure, and retry boundary
#
# **Session 14.3 — Enforce state and failure boundaries.** Rungs: **debug and
# defend** (primary), review and verify.
#
# A retry decorator is three lines and looks like it belongs anywhere. It does
# not. **Where** you wrap decides which side effects happen more than once, and
# that is a property of the operation rather than of the decorator.
#
# This bench runs the same four-step publish under two retry boundaries and counts
# what each side effect did.
#
# **Requires:** Python 3.12+. Standard library only.

# %%
from _fixture import *  # noqa: F401,F403,E402  (sets up sys.path)

import sys  # noqa: E402
from collections import Counter  # noqa: E402

from atlas_bench import (  # noqa: E402
    bench, check, checkpoint, claim, emit, non_claim, predict, resolve, reveal,
)

assert sys.version_info >= (3, 12)

bench(module=14, session=3, emits="state, failure, and retry boundary",
      rungs=["debug-and-defend", "review-and-verify"])

# %% [markdown]
# ## 1. A four-step publish, with one flaky step

# %%
class TransientError(RuntimeError):
    """The kind of failure a retry is supposed to be for."""


class Publisher:
    """Four steps. Only `notify` is flaky; the other three always succeed."""

    def __init__(self, failures_before_success: int = 2) -> None:
        self.ledger: list[str] = []
        self._remaining_failures = failures_before_success
        self._next_id = 1

    def reserve_id(self) -> str:
        identifier = f"pub-{self._next_id}"
        self._next_id += 1
        self.ledger.append("reserve_id")
        return identifier

    def write_record(self, identifier: str) -> None:
        self.ledger.append("write_record")

    def notify_subscribers(self, identifier: str) -> None:
        self.ledger.append("notify_subscribers")
        if self._remaining_failures > 0:
            self._remaining_failures -= 1
            raise TransientError("subscriber endpoint unavailable")

    def confirm(self, identifier: str) -> None:
        self.ledger.append("confirm")

    def publish(self) -> str:
        identifier = self.reserve_id()
        self.write_record(identifier)
        self.notify_subscribers(identifier)
        self.confirm(identifier)
        return identifier


def retry(operation, attempts: int = 3):
    """The three-line decorator, applied wherever it is put."""
    last = None
    for _ in range(attempts):
        try:
            return operation()
        except TransientError as error:
            last = error
    raise last

# %%
predict(
    "`notify_subscribers` fails twice before succeeding. Wrap the whole `publish` "
    "in a 3-attempt retry. How many times does each of the four steps run, and how "
    "many publication IDs get reserved?",
    answer="",  # <- fill in
    confidence="",  # sure / fairly sure / guessing
)

# %% [markdown]
# ## 2. Debug — retry the whole operation

# %%
coarse = Publisher()
coarse_id = retry(coarse.publish)
coarse_counts = Counter(coarse.ledger)

print(f"retry wrapped around publish()\n")
print(f"{'step':>20}  {'times run':>9}")
for step in ("reserve_id", "write_record", "notify_subscribers", "confirm"):
    print(f"{step:>20}  {coarse_counts[step]:>9}")
print(f"\nreturned id      : {coarse_id}")
print(f"ids reserved     : {coarse_counts['reserve_id']}")
print(f"records written  : {coarse_counts['write_record']}")

checkpoint("the operation eventually succeeds", coarse_id is not None)
checkpoint("the flaky step ran three times",
           coarse_counts["notify_subscribers"] == 3)
checkpoint("but so did the two steps before it",
           coarse_counts["reserve_id"] == coarse_counts["write_record"] == 3,
           "they never failed, and they ran on every attempt anyway")
checkpoint("two publication IDs were reserved and abandoned",
           coarse_counts["reserve_id"] == 3 and coarse_id == "pub-3",
           "pub-1 and pub-2 exist, are unreferenced, and nothing will clean "
           "them up")

# %% [markdown]
# ## 3. Debug — move the boundary

# %%
class StepRetryingPublisher(Publisher):
    """The same four steps; the retry sits around the step that can fail."""

    def publish(self) -> str:
        identifier = self.reserve_id()
        self.write_record(identifier)
        retry(lambda: self.notify_subscribers(identifier))
        self.confirm(identifier)
        return identifier


fine = StepRetryingPublisher()
fine_id = fine.publish()
fine_counts = Counter(fine.ledger)

print(f"{'step':>20}  {'whole-operation':>16}  {'step-level':>11}")
for step in ("reserve_id", "write_record", "notify_subscribers", "confirm"):
    print(f"{step:>20}  {coarse_counts[step]:>16}  {fine_counts[step]:>11}")

print(f"\nreturned id: {coarse_id} against {fine_id}")

checkpoint("both boundaries eventually succeed",
           coarse_id is not None and fine_id is not None)
checkpoint("both retry the flaky step the same number of times",
           coarse_counts["notify_subscribers"]
           == fine_counts["notify_subscribers"] == 3,
           "the retry policy is identical; only its position changed")
checkpoint("the step-level boundary reserves exactly one id",
           fine_counts["reserve_id"] == 1)
checkpoint("and writes exactly one record",
           fine_counts["write_record"] == 1,
           "the steps that could not fail no longer run repeatedly")

# %%
resolve(
    "`notify_subscribers` fails twice before succeeding. Wrap the whole `publish` "
    "in a 3-attempt retry. How many times does each of the four steps run, and how "
    "many publication IDs get reserved?",
    "matched",  # matched / diverged / partial
)

# %%
reveal(
    "`notify_subscribers` fails twice before succeeding. Wrap the whole `publish` "
    "in a 3-attempt retry. How many times does each of the four steps run, and how "
    "many publication IDs get reserved?",
    """
    Every step runs three times, and three IDs are reserved. Two of them —
    `pub-1` and `pub-2` — are now sitting in the system, referenced by nothing,
    and no code path will ever clean them up.

    The retry did exactly what a retry does. `notify_subscribers` failed twice and
    succeeded on the third attempt, which is the behaviour anyone would want. The
    cost is that `reserve_id` and `write_record` came along for the ride — steps
    that never failed, have no reason to be repeated, and are not idempotent.

    That is the whole lesson, and the number makes it concrete: **the retry
    boundary decides which side effects become plural.** It is not a property of
    the decorator, which is identical in both runs and retries the flaky step
    exactly three times either way. It is a property of *where the decorator was
    attached*, and moving it changed the ID count from 3 to 1 while changing
    nothing about the retry policy.

    Now the part that makes this hard to catch in review. The coarse version
    **works**. It returns a valid ID, the record is written, subscribers are
    notified, and the caller sees a success. Every test asserting "publish returns
    an ID and the record exists" passes. The damage — two orphaned reservations —
    is invisible from the return value and shows up much later as a slow leak in
    an ID space, or as a reconciliation report that does not balance.

    So the review question is not "does this retry work?" but **"which steps are
    inside the boundary, and is each of them safe to repeat?"** In this operation:
    `reserve_id` allocates and is not safe. `write_record` writes and is not safe
    unless keyed on something stable. `notify_subscribers` is the only step that
    both fails and is safe to repeat, and it is therefore the only step the
    boundary should contain.

    The general rule that survives past retries: a retry is safe exactly when
    everything inside it is idempotent. If something inside is not, you have two
    honest choices — shrink the boundary until only idempotent work is inside, or
    make the non-idempotent work idempotent, which usually means deriving its
    identity from content rather than from a counter. Bench `m16-s5` measured that
    second route: an import keyed on the bundle's content replayed safely, and the
    same import keyed on the run duplicated itself.

    And there is a third choice worth naming because it is often correct: do not
    retry at all, and let the caller decide. Bench `m20-s5` found that after an
    ambiguous failure the client genuinely cannot know what happened — in which
    case an automatic retry is a guess with side effects.
    """,
)

# %% [markdown]
# ## 4. Verify — which steps are safe inside the boundary?

# %%
STEPS = {
    "a": "reserve_id — allocates the next number from a counter.",
    "b": "write_record — writes the row for the reserved id.",
    "c": "notify_subscribers — sends a notification for the id.",
    "d": "confirm — marks the publication complete.",
}
for key, text in STEPS.items():
    print(f"{key}. {text}")


def safe_to_repeat(key: str) -> bool:
    """True when running this step twice leaves the same state as running it once."""
    raise NotImplementedError("Judge each step's idempotence")


# %%
check("safe_to_repeat", safe_to_repeat,
      [(("a",), False), (("b",), True), (("c",), False), (("d",), True)])
print()
print("(b) and (d) are safe because they are keyed on an id that already exists —")
print("writing the same row twice, or confirming twice, changes nothing. (c) is")
print("the surprise: it is the step we RETRY, and it is not idempotent either.")
print("Subscribers receive the notification three times. The bench's boundary")
print("stops the ID leak and does not fix that — which is why an idempotency key")
print("has to reach the subscriber too, not just the publisher.")

# %% [markdown]
# ## 5. The boundary record

# %%
BOUNDARY_RECORD = """
The operation, decomposed into steps, with each step's idempotence:
The retry boundary as written, and everything inside it:
The side effect that became plural, and the count:
Why the coarse version passes its tests:
The boundary I would draw, and the step that is still not safe inside it:
For the step that remains unsafe: shrink, make idempotent, or do not retry?
"""
print(BOUNDARY_RECORD)

# %%
claim("DEFENDED REPAIR", BOUNDARY_RECORD)

claim(
    "LOCAL REFERENCE RESULT",
    f"A four-step publish whose third step fails twice before succeeding runs "
    f"every step {coarse_counts['reserve_id']} times when a 3-attempt retry wraps "
    f"the whole operation, reserving {coarse_counts['reserve_id']} publication IDs "
    f"and returning {coarse_id} — leaving pub-1 and pub-2 orphaned. Moving the "
    f"identical retry to wrap only the failing step leaves the flaky step's "
    f"attempt count unchanged at {fine_counts['notify_subscribers']} while "
    f"reducing reserve_id to {fine_counts['reserve_id']} and write_record to "
    f"{fine_counts['write_record']}. Both versions return successfully and the "
    f"coarse one raises nothing.",
    support={"coarse": dict(coarse_counts), "coarseReturnedId": coarse_id,
             "fine": dict(fine_counts), "fineReturnedId": fine_id,
             "retryAttempts": 3, "failuresBeforeSuccess": 2},
)

non_claim(
    "This is a hand-written four-step operation with a deterministic failure "
    "schedule, run in one process with no I/O. It establishes that the retry "
    "boundary determines which side effects repeat, and by how much, in this "
    "operation. It measures no real system's retry behaviour, models no backoff, "
    "jitter, timeout, or concurrent retry, and does not address what happens when "
    "the failure is not transient — where the same three attempts produce three "
    "sets of side effects and then raise anyway, which is the worse case this "
    "bench does not exercise."
)

emit()

# %% [markdown]
# ## 6. Transfer
#
# 1. The decorator was identical in both runs. Write the rule this implies about
#    reviewing a retry, in a form that does not mention the retry code at all.
# 2. The coarse version returned a valid ID and passed its tests. Name the
#    assertion that would have caught it.
# 3. Bench `m16-s5` made a replay safe by changing where identity came from. State
#    when that repair is preferable to shrinking the boundary.
#
# ---
#
# ## Attributions
#
# Module 14 has no checked-in reference model. The publisher, the retry helper, and
# the idempotence sort are this bench's own.
