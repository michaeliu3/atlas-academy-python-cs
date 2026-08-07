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
# # Bench m20-s2 — frame admission trace
#
# **Session 20.2 — Transport carries bytes, not your request.** Rungs: **debug and
# defend** (primary), trace.
#
# The session's title is the claim, and it is the one every new network programmer
# has to be talked out of exactly once: a stream delivers *bytes*, and nothing
# about a send corresponds to a receive.
#
# This bench gives each reader the stream its own sender would have written —
# three requests, bare JSON against length-prefixed — and delivers both under the
# same eight chunk patterns. No socket is involved: `FrameDecoder` is a pure state
# machine over chunks, and the chunk boundaries are the whole subject.
#
# **Requires:** Python 3.12+. Standard library only.

# %%
from _fixture import *  # noqa: F401,F403,E402  (sets up sys.path)

import json  # noqa: E402
import sys  # noqa: E402

from atlas_bench import (  # noqa: E402
    bench, check, checkpoint, claim, emit, non_claim, predict, resolve, reveal,
)
from module20_reference import (  # noqa: E402
    DEFAULT_MAX_FRAME_BYTES, FrameDecoder, FrameTooLarge, IncompleteFrameError,
    encode_frame, make_publish_request, serialize_publish_request,
)

assert sys.version_info >= (3, 12)

bench(module=20, session=2, emits="frame admission trace",
      rungs=["debug-and-defend", "trace"])

# %% [markdown]
# ## 1. Three requests, one byte stream

# %%
REQUESTS = [make_publish_request(operation_id=f"op-{n}", snapshot_id=f"snap-{n}")
            for n in (1, 2, 3)]
PAYLOADS = [serialize_publish_request(request) for request in REQUESTS]
FRAMES = [encode_frame(payload) for payload in PAYLOADS]

# Two senders, three identical requests. The naive sender writes the JSON and
# nothing else; the framed sender prefixes each body with its length. Each
# reader is given the stream its own sender produced — comparing a JSON reader
# against framed bytes would be a strawman, since it would fail on the header
# alone and never reach the interesting question.
UNFRAMED = b"".join(PAYLOADS)
STREAM = b"".join(FRAMES)

print(f"payloads       : {[len(p) for p in PAYLOADS]} bytes each")
print(f"unframed stream: {len(UNFRAMED)} bytes — just the three JSON documents")
print(f"framed stream  : {len(STREAM)} bytes — each body behind a 4-byte "
      f"big-endian length")
print(f"\nfirst 12 framed bytes: {STREAM[:12]!r}")
print(f"  the leading {STREAM[:4].hex()} is {int.from_bytes(STREAM[:4], 'big')} "
      f"— the body length, arriving before any body")


def split(stream: bytes, sizes) -> list[bytes]:
    """Cut the stream into chunks of the given sizes, remainder last."""
    chunks, offset = [], 0
    for size in sizes:
        chunks.append(stream[offset:offset + size])
        offset += size
    if offset < len(stream):
        chunks.append(stream[offset:])
    return [chunk for chunk in chunks if chunk]


BODY = len(PAYLOADS[0])
FRAME = len(FRAMES[0])

# Each pattern is described once and sized per stream, so "one message per
# chunk" means the same thing to both readers.
DELIVERIES = {
    "whole stream in one chunk": (lambda n, f: [n * f]),
    "exactly one message per chunk": (lambda n, f: [f] * n),
    "two messages coalesced, then one": (lambda n, f: [2 * f]),
    "one byte at a time": (lambda n, f: [1] * (n * f)),
    "7-byte chunks": (lambda n, f: [7] * (n * f // 7 + 1)),
    "split two bytes in": (lambda n, f: [2]),
    "split five bytes in": (lambda n, f: [5]),
    "split one byte before a boundary": (lambda n, f: [f - 1]),
}

# %%
predict(
    "The same three requests, each sender writing its own stream, delivered under "
    "eight chunk patterns. A reader that calls json.loads per chunk, and a "
    "length-prefixed FrameDecoder. How many of the eight does each get right?",
    answer="",  # <- fill in
    confidence="",  # sure / fairly sure / guessing
)

# %% [markdown]
# ## 2. Debug — run both readers over every delivery pattern

# %%
def naive_reader(chunks) -> dict:
    """One chunk is one message. The assumption, written out."""
    decoded, failures = [], 0
    for chunk in chunks:
        try:
            decoded.append(json.loads(chunk.decode("utf-8")))
        except Exception:  # noqa: BLE001
            failures += 1
    return {"messages": len(decoded), "failures": failures}


def framed_reader(chunks) -> dict:
    """The decoder owns its buffer and emits only complete payloads."""
    decoder = FrameDecoder(max_frame_bytes=DEFAULT_MAX_FRAME_BYTES)
    emitted = []
    try:
        for chunk in chunks:
            emitted.extend(decoder.feed(chunk))
        decoder.finish()
    except (FrameTooLarge, IncompleteFrameError) as error:
        return {"messages": len(emitted), "failures": 1,
                "error": type(error).__name__}
    return {"messages": len(emitted), "failures": 0,
            "exact": [bytes(p) for p in emitted] == PAYLOADS}


print(f"{'delivery pattern':>34}  "
      f"{'naive msgs':>10}  {'naive fails':>11}  "
      f"{'framed msgs':>11}  {'framed fails':>12}")

results = {}
for label, sizer in DELIVERIES.items():
    naive = naive_reader(split(UNFRAMED, sizer(len(PAYLOADS), BODY)))
    framed = framed_reader(split(STREAM, sizer(len(FRAMES), FRAME)))
    results[label] = {"naive": naive, "framed": framed}
    print(f"{label:>34}  "
          f"{naive['messages']:>10}  {naive['failures']:>11}  "
          f"{framed['messages']:>11}  {framed['failures']:>12}")

naive_correct = [label for label, row in results.items()
                 if row["naive"]["messages"] == 3 and row["naive"]["failures"] == 0]
framed_correct = [label for label, row in results.items()
                  if row["framed"]["messages"] == 3 and row["framed"]["failures"] == 0]

print(f"\nnaive reader correct on : {len(naive_correct)} of {len(DELIVERIES)}")
print(f"framed reader correct on: {len(framed_correct)} of {len(DELIVERIES)}")

checkpoint("the framed reader recovers all three requests every time",
           len(framed_correct) == len(DELIVERIES))
checkpoint("and the payloads are byte-identical to what was sent",
           all(row["framed"].get("exact") for row in results.values()))
checkpoint("the naive reader fails on almost every pattern",
           len(naive_correct) <= 1,
           f"correct only on: {naive_correct or 'nothing'}")
coalesced = results["two messages coalesced, then one"]["naive"]
by_byte = results["one byte at a time"]["naive"]

checkpoint("including when it receives MORE than one message at once",
           coalesced["messages"] < 3,
           f"{coalesced['messages']} parsed, {coalesced['failures']} failed — two "
           f"entirely valid requests lost to one logged error")
checkpoint("and single-byte chunks make it parse messages that were never sent",
           by_byte["messages"] > len(PAYLOADS),
           f"{by_byte['messages']} 'messages' from a 3-message stream: every lone "
           f"digit in the payload is valid JSON")

# %%
resolve(
    "The same three requests, each sender writing its own stream, delivered under "
    "eight chunk patterns. A reader that calls json.loads per chunk, and a "
    "length-prefixed FrameDecoder. How many of the eight does each get right?",
    "matched",  # matched / diverged / partial
)

# %%
reveal(
    "The same three requests, each sender writing its own stream, delivered under "
    "eight chunk patterns. A reader that calls json.loads per chunk, and a "
    "length-prefixed FrameDecoder. How many of the eight does each get right?",
    """
    The framed reader gets all eight. The naive reader gets one — the single
    pattern where the chunk boundaries happen to coincide with the message
    boundaries.

    That one pattern is the problem, because it is the one you will observe.

    On a local connection with small messages, the transport very often does
    deliver exactly what was written, in one piece, in order. So the naive reader
    works. It works in development, it works in the integration test, it works in
    the demo, and it fails in production on a slower link, a larger payload, or a
    busier moment — with a `JSONDecodeError` on data that is not corrupt.

    It fails in three directions, and people guard against one.

    **Under-delivery** is the familiar one: a chunk arrives holding half a message.
    `json.loads` raises, and at least it raises loudly.

    **Over-delivery** is worse. Two whole messages arrive in a single chunk. There
    is no partial data, nothing is truncated, every byte is valid — and
    `json.loads` still fails, because two concatenated JSON documents are not a
    JSON document. The run above parsed **1 message and logged 1 error** for a
    chunk containing two perfectly good requests. A reader written to `try/except`
    around the parse and "skip bad messages" discards both and reports one
    problem.

    **Spurious success** is the one nobody expects, and the byte-at-a-time row is
    where it shows: **142 successful parses** from a three-message stream. Every
    lone digit in the payload — a version number, a timestamp component, a length
    — is by itself a valid JSON document. The reader did not raise. It did not
    log. It handed 142 integers upstream as though they were requests. A failure
    rate is no help here, because these are counted as successes.

    So the naive reader can lose valid messages while reporting an error, and
    invent messages while reporting none. Both from the same 639 bytes.

    Now what the decoder does, which is worth stating as a mechanism rather than a
    library call. It reads a 4-byte big-endian length, then **waits** until that
    many body bytes have arrived, regardless of how many `feed` calls it takes. It
    owns a buffer across calls, so a chunk that ends mid-length-prefix is fine —
    the two bytes sit in the buffer until the other two arrive. And when a chunk
    carries more than one frame, the loop keeps emitting until the buffer no longer
    holds a complete one.

    The stream never told it where the messages were. The **protocol** did, because
    the sender wrote the length before the body. That is what framing is: not a
    parsing technique, but a prior agreement that makes the boundaries recoverable
    from a medium that does not preserve them.

    Two design details in this decoder deserve attention, and section 3 shows
    them. `max_frame_bytes` means a declared length is checked *before* any
    allocation — a peer claiming a four-gigabyte body gets refused rather than
    obliged. And an error is **terminal**: the decoder refuses to keep parsing
    after a protocol violation, rather than resynchronising on a stream whose
    framing it can no longer trust. Both are admission decisions, which is why this
    session's artifact is called an admission trace.
    """,
)

# %% [markdown]
# ## 3. Debug — the two admission decisions

# %%
oversized = (10_000).to_bytes(4, "big") + b"x" * 100
bounded = FrameDecoder(max_frame_bytes=4_096)
admission = {}
try:
    bounded.feed(oversized)
    admission["oversized"] = "accepted"
except FrameTooLarge:
    admission["oversized"] = "FrameTooLarge"

reuse = "reused without error"
try:
    bounded.feed(encode_frame(b"{}"))
except Exception as error:  # noqa: BLE001
    reuse = type(error).__name__
admission["reuse after error"] = reuse

truncated = FrameDecoder(max_frame_bytes=DEFAULT_MAX_FRAME_BYTES)
truncated.feed(STREAM[:-5])
try:
    truncated.finish()
    admission["stream ends mid-frame"] = "accepted"
except IncompleteFrameError:
    admission["stream ends mid-frame"] = "IncompleteFrameError"

print(f"{'situation':>24}  {'decoder response':>24}")
for situation, response in admission.items():
    print(f"{situation:>24}  {response:>24}")

print(f"\na declared body of 10,000 bytes was refused against a "
      f"{4_096}-byte bound after reading 4 header bytes and allocating nothing "
      f"for the body.")

checkpoint("an oversized declared length is refused",
           admission["oversized"] == "FrameTooLarge",
           "the bound is checked against the DECLARED length, before allocation")
checkpoint("the decoder refuses to be reused after a protocol error",
           admission["reuse after error"] == "DecoderTerminalError",
           "it does not pretend it can resynchronise on a stream it mis-parsed")
checkpoint("a stream ending mid-frame is an error, not a silent short read",
           admission["stream ends mid-frame"] == "IncompleteFrameError")

# %% [markdown]
# ## 4. Recognize — what does a completed `recv` tell you?

# %%
STATEMENTS = {
    "a": "The bytes returned are a prefix of what the peer sent.",
    "b": "The bytes returned are one message.",
    "c": "The peer has finished sending.",
    "d": "No message was lost.",
}
for key, text in STATEMENTS.items():
    print(f"{key}. {text}")


def established_by_a_read(key: str) -> bool:
    """True when one completed read establishes this."""
    raise NotImplementedError("Separate what the transport promises from what you want")


# %%
check("established_by_a_read", established_by_a_read,
      [(("a",), True), (("b",), False), (("c",), False), (("d",), False)])
print()
print("(a) is the entire guarantee: bytes, in order, no duplicates, no gaps.")
print("Every other property in this list is something a PROTOCOL has to add on")
print("top, and the length prefix is the smallest thing that adds (b).")

# %% [markdown]
# ## 5. The admission trace

# %%
ADMISSION_TRACE = """
What one completed read guarantees, stated as the transport's actual promise:
The framing rule, written so another implementer could match it:
The delivery pattern that made the naive reader look correct:
The over-delivery case, and what a 'skip bad messages' handler would have done:
The two admission bounds, and what each one refuses before allocating:
Why a decoder error is terminal rather than recoverable:
"""
print(ADMISSION_TRACE)

# %%
claim("DEFENDED REPAIR", ADMISSION_TRACE)

claim(
    "LOCAL REFERENCE RESULT",
    f"Three requests written two ways — {len(UNFRAMED)} bytes of bare JSON and "
    f"{len(STREAM)} bytes of length-prefixed frames — delivered under "
    f"{len(DELIVERIES)} chunk patterns. A reader calling json.loads per chunk "
    f"recovers all three in {len(naive_correct)} pattern(s); it parses "
    f"{coalesced['messages']} and errors once when two messages coalesce, and "
    f"reports {by_byte['messages']} successful parses under one-byte chunks. "
    f"FrameDecoder recovers all three, byte-identical, in {len(framed_correct)} "
    f"of {len(DELIVERIES)}. A declared body length "
    f"above max_frame_bytes raises FrameTooLarge before the body is read, reuse "
    f"after that error raises DecoderTerminalError, and a stream ending mid-frame "
    f"raises IncompleteFrameError.",
    support={"streamBytes": len(STREAM),
             "frameBytes": [len(f) for f in FRAMES],
             "deliveries": {label: {"naive": row["naive"],
                                    "framedMessages": row["framed"]["messages"],
                                    "framedFailures": row["framed"]["failures"]}
                            for label, row in results.items()},
             "naiveCorrect": naive_correct,
             "framedCorrect": len(framed_correct),
             "admission": admission},
)

non_claim(
    "No socket, no network, and no peer is involved: the chunk patterns are "
    "constructed rather than observed. That is what makes the result exact — every "
    "split is tested, not sampled — and it is also the limit. This establishes "
    "that a length-prefixed decoder is chunk-boundary independent and that a "
    "one-chunk-one-message reader is not. It measures no throughput, models no "
    "TCP behaviour, says nothing about which chunk patterns a real network "
    "produces or how often, and does not establish that this framing is the right "
    "protocol for any particular system."
)

emit()

# %% [markdown]
# ## 6. Transfer
#
# 1. The naive reader was correct on one pattern out of eight and that is the one
#    you observe in development. Write the rule this implies about testing a
#    protocol reader.
# 2. Over-delivery failed on entirely valid data. Name what a `try/except` around
#    the parse would have cost, and why the loss is silent.
# 3. Bench `m19-s1` found 18 of 20 legal schedules violating an invariant while the
#    test passed. State what that and this bench's one-correct-pattern have in
#    common.
#
# ---
#
# ## Attributions
#
# Probes `public/downloads/module20_reference.py` — `FrameDecoder`, `encode_frame`,
# `make_publish_request`, `serialize_publish_request`. Not reimplemented. The
# delivery patterns, the naive reader, and the admission probes are this bench's
# own.
