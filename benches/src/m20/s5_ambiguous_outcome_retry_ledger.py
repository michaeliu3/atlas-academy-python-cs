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
# # Bench m20-s5 — ambiguous-outcome retry ledger
#
# **Session 20.5 — Retry is an epistemic problem before it is a loop.** Rungs:
# **review and verify** (primary), debug and defend.
#
# The session's title names the whole difficulty. Before you can write `for
# attempt in range(3)`, you have to answer a question about *knowledge*: after a
# failed call, what do you actually know about the server?
#
# This bench runs the reference model's classifier over every client-local failure
# and finds that the answer is the same for all of them — including the one that
# feels like a certainty.
#
# **Requires:** Python 3.12+. Standard library only.

# %%
from _fixture import *  # noqa: F401,F403,E402  (sets up sys.path)

import sys  # noqa: E402

from atlas_bench import (  # noqa: E402
    bench, check, checkpoint, claim, emit, non_claim, predict, resolve, reveal,
)
from module20_reference import (  # noqa: E402
    ClientObservation, IdempotencyConflict, IdempotencyLedger,
    classify_client_observation, make_publish_request, request_digest,
)

assert sys.version_info >= (3, 12)

bench(module=20, session=5, emits="ambiguous-outcome retry ledger",
      rungs=["review-and-verify", "debug-and-defend"])

# %% [markdown]
# ## 1. One request, four ways the call can end

# %%
REQUEST = make_publish_request(operation_id="op-publish-1", snapshot_id="snap-a")
DIGEST = request_digest(REQUEST)

print(f"operation id  : {REQUEST.operation_id}")
print(f"request digest: {DIGEST}")

FAILURES = ["TIMEOUT", "CONNECTION_ERROR", "MALFORMED_RESPONSE"]

# %%
predict(
    "Three client-side failures: a timeout, a connection error, and a malformed "
    "response. Which of them tells the client that the server did NOT publish?",
    answer="",  # <- fill in
    confidence="",  # sure / fairly sure / guessing
)

# %% [markdown]
# ## 2. Verify — classify every client-local failure

# %%
outcomes = {}
for kind in FAILURES:
    observation = ClientObservation(kind=kind, operation_id=REQUEST.operation_id,
                                    request_digest=DIGEST)
    outcome = classify_client_observation(observation)
    outcomes[kind] = outcome
    print(f"{kind:>20}  ->  {outcome.classification:<10}  "
          f"decision={outcome.decision}  replayed={outcome.replayed}")

print(f"\nevidence scope: {outcomes['TIMEOUT'].evidence_scope}")

classifications = {outcome.classification for outcome in outcomes.values()}

checkpoint("every client-local failure classifies the same way",
           len(classifications) == 1,
           f"all three are {classifications.pop()}")
checkpoint("none of them reports a server decision",
           all(outcome.decision is None for outcome in outcomes.values()),
           "the classifier refuses to invent a remote non-effect")
checkpoint("a connection error is not treated as 'nothing happened'",
           outcomes["CONNECTION_ERROR"].classification
           == outcomes["TIMEOUT"].classification,
           "the connection can fail AFTER the server committed, while the "
           "response is in flight")

# %%
resolve(
    "Three client-side failures: a timeout, a connection error, and a malformed "
    "response. Which of them tells the client that the server did NOT publish?",
    "matched",  # matched / diverged / partial
)

# %%
reveal(
    "Three client-side failures: a timeout, a connection error, and a malformed "
    "response. Which of them tells the client that the server did NOT publish?",
    """
    None of them. All three classify as `UNKNOWN`, with `decision=None`.

    The timeout is the easy case — everyone accepts that a slow server might
    still be working. The **connection error** is the one that costs people
    money, because it feels like proof. The socket broke. Nothing came back.
    Surely the request never landed?

    Trace where a connection can break. The client sends. The request arrives.
    The server validates it, writes the publication, commits, and begins sending
    `201 Created`. *Then* the connection drops. From the client's side this is
    indistinguishable from a request that never arrived — same exception, same
    stack trace, same absence of a response. The publication exists. The client
    has no way to know.

    This is the fundamental asymmetry of a network call: **you observe your own
    side of it.** A response is evidence about the server. The absence of a
    response is evidence about your socket, and about nothing else. The classifier
    encodes exactly this, and the discipline worth stealing is what it does *not*
    return: there is no `NOT_PUBLISHED` classification available, because no
    client-local observation could justify one.

    Which reframes what a retry is. `for attempt in range(3)` is not a resilience
    pattern; it is a **claim** — that re-sending is harmless, that the first
    attempt either did nothing or can be safely repeated. Under `UNKNOWN` that
    claim is unfounded by default. Retrying a publish that already succeeded
    publishes twice. Retrying a payment charges twice.

    So the retry loop is the last thing you write, not the first. What makes it
    legitimate is the *idempotency key*, which section 3 exercises: the server
    binds an operation ID to the digest of the request that first used it, so a
    replay of an identical request returns the original decision instead of making
    a second one. The retry becomes safe not because the client learned anything —
    it still knows nothing — but because the server was built so that not knowing
    is survivable.

    And notice the third case in section 3. Reusing an operation ID with a
    *different* request is not a replay; it is a distinct operation wearing
    another's key, and the ledger raises rather than guessing which one the caller
    meant. An idempotency key that accepted it would silently return the wrong
    decision for the wrong request — worse than duplicating, because it looks like
    success.

    Bench `m16-s5` reached the same conclusion inside a database: retry after an
    uncertain outcome is `CALLER_DECISION`, not `SAME_IDENTITY`, unless identity is
    derived from content. Here the network makes the uncertainty unavoidable rather
    than merely possible.
    """,
)

# %% [markdown]
# ## 3. Debug — what makes the retry safe

# %%
ledger = IdempotencyLedger()

first = ledger.apply(REQUEST)
replay = ledger.apply(REQUEST)

print(f"{'attempt':>28}  {'decision':>12}  {'replayed':>9}")
print(f"{'first publish':>28}  {first.decision:>12}  {str(first.replayed):>9}")
print(f"{'identical retry':>28}  {replay.decision:>12}  {str(replay.replayed):>9}")

conflicting = make_publish_request(operation_id=REQUEST.operation_id,
                                   snapshot_id="snap-DIFFERENT")
conflict = "accepted"
try:
    ledger.apply(conflicting)
except IdempotencyConflict as error:
    conflict = f"IdempotencyConflict: {error}"
print(f"{'same key, different request':>28}  {conflict}")

checkpoint("the first attempt publishes", first.decision == "PUBLISHED")
checkpoint("an identical retry returns the SAME decision, not a second one",
           replay.decision == first.decision and replay.replayed is True,
           "the server publishes once; the client may ask as often as it likes")
checkpoint("the replay is marked as a replay",
           first.replayed is not True and replay.replayed is True,
           "the server distinguishes the two even though the client cannot")
checkpoint("reusing the key for a different request is refused",
           conflict.startswith("IdempotencyConflict"),
           "not a replay — a different operation wearing another's key")

# %% [markdown]
# ## 4. Review and verify — audit a retry policy

# %%
POLICIES = {
    "a": "On TIMEOUT, retry the identical request with the same operation ID.",
    "b": "On CONNECTION_ERROR, assume nothing happened and send a fresh request "
         "with a new operation ID.",
    "c": "On MALFORMED_RESPONSE, retry with the same operation ID.",
    "d": "After three UNKNOWN attempts, report success because one probably "
         "landed.",
    "e": "After three UNKNOWN attempts, query the server for the operation ID's "
         "decision.",
}
for key, text in POLICIES.items():
    print(f"{key}. {text}")


def sound(key: str) -> bool:
    """True when this policy is justified by what the client can know."""
    raise NotImplementedError("Audit each policy against the UNKNOWN classification")


# %%
check("sound", sound,
      [(("a",), True), (("b",), False), (("c",), True), (("d",), False),
       (("e",), True)])
print()
print("(b) is the expensive one, and it is what most hand-written clients do.")
print("A new operation ID discards the only thing that made the retry safe, so a")
print("request that DID land is now published twice under two different keys.")
print("(e) is the repair: the client cannot deduce the outcome, so it asks.")

# %% [markdown]
# ## 5. The retry ledger

# %%
RETRY_LEDGER = """
What each client-local failure establishes about the server, in one line each:
Why a connection error is not evidence of a non-effect:
The idempotency key, and what it is derived from:
What the server does with a replay, and how it tells a replay from a first attempt:
What happens when a key is reused for a different request, and why refusing beats guessing:
My retry policy, with the precondition that makes it sound:
The case I would escalate rather than retry, and the query I would send instead:
"""
print(RETRY_LEDGER)

# %%
claim("REVIEW VERDICT", RETRY_LEDGER)

claim(
    "LOCAL REFERENCE RESULT",
    f"classify_client_observation returns UNKNOWN with decision=None for all "
    f"{len(FAILURES)} client-local failure kinds — timeout, connection error, and "
    f"malformed response — offering no classification that would assert a remote "
    f"non-effect. Against the single-owner idempotency ledger, a first publish "
    f"records {first.decision} with replayed={first.replayed}, an identical retry "
    f"returns the same decision with replayed={replay.replayed}, and reusing the "
    f"operation ID with a different snapshot raises IdempotencyConflict.",
    support={"operationId": REQUEST.operation_id, "requestDigest": DIGEST,
             "classifications": {kind: {"classification": o.classification,
                                        "decision": o.decision,
                                        "replayed": o.replayed}
                                 for kind, o in outcomes.items()},
             "evidenceScope": outcomes["TIMEOUT"].evidence_scope,
             "ledger": {"first": {"decision": first.decision,
                                  "replayed": first.replayed},
                        "replay": {"decision": replay.decision,
                                   "replayed": replay.replayed},
                        "keyReuse": conflict}},
)

non_claim(
    "No network, no socket, and no peer: the failure kinds are declared inputs to "
    "a classifier, not observed outcomes. That is what makes the result exact — "
    "every kind is classified, none sampled — and it is the limit. This "
    "establishes what the reference model's decision procedure returns and what "
    "its ledger does with a replay. It measures no latency, no failure rate, and "
    "no real service's idempotency behaviour, and the ledger is explicitly "
    "single-owner and sequential: a concurrent adapter must serialize the whole "
    "lookup-and-write transition, which Module 19 shows a dictionary does not do "
    "for you."
)

emit()

# %% [markdown]
# ## 6. Transfer
#
# 1. Three different failures carried identical information. Write the rule this
#    implies about branching a retry policy on exception type.
# 2. The classifier had no `NOT_PUBLISHED` value to return. Name what that absence
#    buys, and what it costs a caller who wanted a simple answer.
# 3. Bench `m16-s5` classified an uncertain outcome as `CALLER_DECISION`. State
#    what a database commit and a network call have in common that makes both
#    answers the same.
#
# ---
#
# ## Attributions
#
# Probes `public/downloads/module20_reference.py` — `classify_client_observation`,
# `ClientObservation`, `IdempotencyLedger`, `make_publish_request`,
# `request_digest`. Not reimplemented. The failure sweep and the policy audit are
# this bench's own.
