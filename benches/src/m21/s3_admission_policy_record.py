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
# # Bench m21-s3 — admission policy record
#
# **Session 21.3 — Bounded admission makes overload a policy decision.** Rungs:
# **trace** (primary), review and verify.
#
# An unbounded queue does not fail under overload. That is the problem. It accepts
# everything, reports no error, and quietly converts a throughput deficit into
# unbounded latency — so the system is "up" while every response is worthless.
#
# This bench runs both admission policies against the same arrival pattern and the
# same consumer rate, and measures where the overload went — including the part
# that is usually skipped: what bounding admission *costs*.
#
# It is a **declared queueing model** driven by a single logical clock, executed
# on the event loop but not timed by it. Every number below is arithmetic and
# identical on any machine. Section 2's non-claim says what that buys and what it
# gives up.
#
# **Requires:** Python 3.12+. Standard library only.

# %%
from _fixture import *  # noqa: F401,F403,E402  (sets up sys.path)

import asyncio  # noqa: E402
from collections import deque  # noqa: E402
import sys  # noqa: E402

from atlas_bench import (  # noqa: E402
    bench, check, checkpoint, claim, emit, non_claim, predict, resolve, reveal,
    run_async,
)

assert sys.version_info >= (3, 12)

bench(module=21, session=3, emits="admission policy record",
      rungs=["trace", "review-and-verify"])

# %% [markdown]
# ## 1. The apparatus
#
# 30 requests arrive, one per tick. The consumer completes one every **three**
# ticks. Arrival rate exceeds service rate by 3×, which is overload by definition,
# and no amount of queueing changes that.
#
# The only question is what the system does about it.

# %%
ARRIVALS = 30
SERVICE_TICKS = 3
CAPACITY = 4


async def run_admission(capacity: int | None) -> dict:
    """One run of the declared queueing model. `capacity=None` is unbounded.

    A single logical clock drives both arrival and service, so the result is
    arithmetic and identical on every machine. An earlier version let a producer
    coroutine and a consumer coroutine each advance a shared counter; the numbers
    that produced depended on interleaving and were not defensible.
    """

    queue: deque = deque()
    admitted, rejected, completed, depths = [], [], [], []
    in_service: list | None = None
    tick = 0

    while tick < ARRIVALS * SERVICE_TICKS + SERVICE_TICKS:
        tick += 1

        if tick <= ARRIVALS:                       # one arrival per tick
            if capacity is not None and len(queue) >= capacity:
                rejected.append(tick)
            else:
                admitted.append(tick)
                queue.append({"id": tick, "arrived_at": tick})

        if in_service is None and queue:           # the single consumer
            in_service = [queue.popleft(), SERVICE_TICKS]
        if in_service is not None:
            in_service[1] -= 1
            if in_service[1] == 0:
                item = in_service[0]
                completed.append({"id": item["id"],
                                  "ticks_in_system": tick - item["arrived_at"] + 1})
                in_service = None

        depths.append(len(queue))
        await asyncio.sleep(0)

    latencies = [row["ticks_in_system"] for row in completed]
    return {"admitted": len(admitted), "rejected": len(rejected),
            "completed": len(completed), "peakDepth": max(depths),
            "finalDepth": depths[-1],
            "firstLatency": latencies[0], "lastLatency": latencies[-1],
            "latencies": latencies}


# %%
predict(
    "Requests arrive three times faster than they can be served. One run uses an "
    "unbounded queue, one rejects anything arriving when four are already waiting. "
    "Which run reports an error, and what happens to the last request's latency in "
    "the other?",
    answer="",  # <- fill in
    confidence="",  # sure / fairly sure / guessing
)

# %% [markdown]
# ## 2. Trace — run both policies

# %%
results = {
    "unbounded queue": run_async(run_admission(None)),
    f"bounded at {CAPACITY}": run_async(run_admission(CAPACITY)),
}

print(f"{'policy':>18}  {'admitted':>8}  {'rejected':>8}  {'peak depth':>10}  "
      f"{'first latency':>13}  {'last latency':>12}")
for label, row in results.items():
    print(f"{label:>18}  {row['admitted']:>8}  {row['rejected']:>8}  "
          f"{row['peakDepth']:>10}  {row['firstLatency']:>13}  "
          f"{row['lastLatency']:>12}")

unbounded = results["unbounded queue"]
bounded = results[f"bounded at {CAPACITY}"]

growth = unbounded["lastLatency"] / unbounded["firstLatency"]
print(f"\nunbounded: the last request waited {growth:.1f}x as long as the first")
print(f"bounded  : last/first = "
      f"{bounded['lastLatency'] / bounded['firstLatency']:.1f}x, and "
      f"{bounded['rejected']} requests were told no")

checkpoint("the unbounded run rejects nothing", unbounded["rejected"] == 0,
           "no error is raised, logged, or returned anywhere")
checkpoint("and its latency grows without bound",
           unbounded["lastLatency"] > 5 * unbounded["firstLatency"])
latency_bound = (CAPACITY + 1) * SERVICE_TICKS
print(f"\nbounding admission at {CAPACITY} bounds latency at "
      f"({CAPACITY} waiting + 1 in service) x {SERVICE_TICKS} = {latency_bound} ticks")

checkpoint("the bounded run rejects some arrivals", bounded["rejected"] > 0)
checkpoint("and every admitted request stays under the bound the capacity implies",
           max(bounded["latencies"]) <= latency_bound,
           f"worst was {max(bounded['latencies'])} against a bound of "
           f"{latency_bound} — the queue length IS the latency budget")
checkpoint("the unbounded run blows through that same bound",
           unbounded["lastLatency"] > latency_bound,
           f"{unbounded['lastLatency']} ticks, with no bound to exceed")
checkpoint("both complete everything they admitted",
           unbounded["completed"] == unbounded["admitted"]
           and bounded["completed"] == bounded["admitted"])
checkpoint("and the bounded run served FEWER requests in total",
           bounded["completed"] < unbounded["completed"],
           f"{bounded['completed']} against {unbounded['completed']} — bounding "
           f"admission is a real trade, not a free win")

# %%
resolve(
    "Requests arrive three times faster than they can be served. One run uses an "
    "unbounded queue, one rejects anything arriving when four are already waiting. "
    "Which run reports an error, and what happens to the last request's latency in "
    "the other?",
    "matched",  # matched / diverged / partial
)

# %%
reveal(
    "Requests arrive three times faster than they can be served. One run uses an "
    "unbounded queue, one rejects anything arriving when four are already waiting. "
    "Which run reports an error, and what happens to the last request's latency in "
    "the other?",
    """
    The bounded run reports errors. The unbounded run reports none, and its last
    request waits many times longer than its first.

    Read the unbounded column as a monitoring dashboard would. Zero errors. Zero
    rejections. Every request eventually completed. Availability: one hundred
    percent. By every metric that counts *failures*, the system is healthy — and
    the last caller waited long enough that whoever sent that request has given up,
    retried, or closed the tab.

    That is what an unbounded queue does. It cannot fail, so it converts a
    throughput problem into a latency problem, and latency is the one failure mode
    that does not show up as a failure. The queue depth grows monotonically because
    arrivals exceed service — nothing about a bigger buffer changes the arithmetic.
    A buffer does not add capacity. It adds delay, and hides the shortfall inside
    it.

    The bounded run makes the same shortfall visible, at the same instant it
    occurs, to the party who can do something about it — and every admitted request
    is then served within a latency the capacity *determines*: four waiting plus one
    in service, times three ticks each, is fifteen. Every admitted request came in
    under it. The queue length is not a buffer size, it is a latency budget, and
    choosing it is choosing the worst case you are willing to promise.

    Now the part that is easy to oversell, and this bench measured it rather than
    skipping it: **the bounded run completed fewer requests.** Fourteen against
    thirty. Bounding admission is a real trade, not a free win. In a run that ends,
    the unbounded queue eventually drains and everything gets served — late, but
    served. What you buy by rejecting is a bounded promise to whoever you *did*
    admit, paid for by the people you turned away. That is a policy choice with a
    loser, and pretending otherwise is how "add backpressure" gets waved through
    review without anyone naming who absorbs it.

    Which is why the session's title says overload becomes a **policy decision**.
    An unbounded queue has not avoided the decision; it has made one, silently, and
    chosen the worst option — serve everyone eventually, in arrival order,
    regardless of whether the answer is still wanted. Bounding the queue forces the
    decision into the open, where it can be argued about: reject the newest, drop
    the oldest, shed by priority, apply backpressure to the producer.

    Backpressure is the one worth naming, because it is the only option that
    addresses the cause. Rejecting arrivals protects the *server*. Propagating the
    refusal upstream, so the producer slows down, protects the whole system — and
    it is only possible if the boundary is bounded, because an unbounded queue has
    no signal to propagate.

    One honest note on this apparatus. Ticks, not seconds: the consumer takes
    exactly three ticks per item and arrivals are exactly one per tick, so these
    numbers are arithmetic rather than measurement, and they would be identical on
    any machine. Real overload has variable service times, bursty arrivals, and
    retries that make the arrival rate depend on the latency — which is the
    feedback loop that turns a slow system into a collapsed one, and which this
    model does not have.
    """,
)

# %% [markdown]
# ## 3. Trace — where the latency comes from

# %%
print(f"{'request':>8}  {'unbounded ticks':>16}  {'bounded ticks':>14}")
for index in range(0, min(len(unbounded["latencies"]),
                          len(bounded["latencies"])), 3):
    print(f"{index:>8}  {unbounded['latencies'][index]:>16}  "
          f"{bounded['latencies'][index]:>14}")

unbounded_monotone = all(
    b >= a for a, b in zip(unbounded["latencies"], unbounded["latencies"][1:]))
bounded_spread = max(bounded["latencies"]) - min(bounded["latencies"])
bounded_plateau = bounded["latencies"][CAPACITY + 1:]

print(f"\nunbounded latency is monotonically non-decreasing: {unbounded_monotone}")
print(f"unbounded worst                                  : "
      f"{max(unbounded['latencies'])} ticks and still climbing")
print(f"bounded worst                                    : "
      f"{max(bounded['latencies'])} ticks, against a bound of {latency_bound}")
print(f"bounded latency after the queue fills             : "
      f"{sorted(set(bounded_plateau))} ticks")

checkpoint("unbounded latency never recovers", unbounded_monotone,
           "there is no point in the run at which the backlog shrinks")
checkpoint("bounded latency reaches a plateau instead of a slope",
           len(set(bounded_plateau)) <= 2,
           f"once the queue is full every admitted request waits the same "
           f"{sorted(set(bounded_plateau))} ticks")
checkpoint("that plateau is the capacity, restated as time",
           max(bounded_plateau) <= latency_bound)

# %% [markdown]
# ## 4. Review and verify — audit the overload responses

# %%
RESPONSES = {
    "a": "Increase the queue size to 10,000.",
    "b": "Reject arrivals when the queue is full.",
    "c": "Propagate the refusal upstream so the producer slows down.",
    "d": "Add a second consumer.",
    "e": "Add a timeout so old queued requests are discarded.",
}
for key, text in RESPONSES.items():
    print(f"{key}. {text}")


def addresses_the_shortfall(key: str) -> bool:
    """True when this changes the arrival/service arithmetic, not just its symptom."""
    raise NotImplementedError("Separate capacity from admission from concealment")


# %%
check("addresses_the_shortfall", addresses_the_shortfall,
      [(("a",), False), (("b",), False), (("c",), True), (("d",), True),
       (("e",), False)])
print()
print("(b) is the interesting refusal. Bounding the queue is the right change and")
print("it does NOT address the shortfall — it makes it visible. That is worth a")
print("great deal and is a different thing, which is why (c) is a separate line:")
print("only propagating the refusal changes the arrival rate.")

# %% [markdown]
# ## 5. The admission policy record

# %%
POLICY_RECORD = """
Arrival rate and service rate, with the resulting deficit:
The admission policy, stated as a rule a reviewer could implement:
What a caller receives when refused, and how it can tell refusal from failure:
The latency the unbounded version produced, and why no error was raised:
Where backpressure is propagated to, and what the producer does with it:
What this apparatus does not model, and why that matters for the real system:
"""
print(POLICY_RECORD)

# %%
claim("COURSE MODEL", POLICY_RECORD)

claim(
    "LOCAL REFERENCE RESULT",
    f"In a declared single-clock queueing model with {ARRIVALS} arrivals at one "
    f"per tick and a consumer taking {SERVICE_TICKS} ticks per item, an unbounded "
    f"queue rejects "
    f"{unbounded['rejected']} requests, reaches a peak depth of "
    f"{unbounded['peakDepth']}, and its last completed request waits "
    f"{unbounded['lastLatency']} ticks against the first request's "
    f"{unbounded['firstLatency']} — a {growth:.1f}x increase, monotonically "
    f"non-decreasing throughout. Bounding admission at {CAPACITY} rejects "
    f"{bounded['rejected']} requests, holds every admitted request under the "
    f"{latency_bound}-tick bound the capacity implies (worst "
    f"{max(bounded['latencies'])}), and plateaus at "
    f"{sorted(set(bounded_plateau))} ticks once the queue fills — while completing "
    f"{bounded['completed']} requests against the unbounded run's "
    f"{unbounded['completed']}.",
    support={"arrivals": ARRIVALS, "serviceTicks": SERVICE_TICKS,
             "capacity": CAPACITY,
             "results": {k: {kk: vv for kk, vv in v.items() if kk != "latencies"}
                         for k, v in results.items()},
             "unboundedLatencies": unbounded["latencies"],
             "boundedLatencies": bounded["latencies"],
             "unboundedMonotone": unbounded_monotone,
             "boundedSpread": bounded_spread},
)

non_claim(
    "Time here is counted in consumer ticks with a fixed service cost and a fixed "
    "arrival rate, so these figures are arithmetic rather than measurement and "
    "would be identical on any machine. That is deliberate, and it is also the "
    "limit: the model has no variable service time, no bursty arrivals, no client "
    "timeouts, and no retries — and retries are what make the arrival rate depend "
    "on the latency, which is the feedback loop that turns a slow system into a "
    "collapsed one. It measures no real server, no memory growth, and no cost of "
    "the queue itself."
)

emit()

# %% [markdown]
# ## 6. Transfer
#
# 1. The unbounded run had a perfect error rate. Write the rule this implies about
#    choosing what to monitor.
# 2. Bounding the queue was correct and did not fix the deficit. Name what it did
#    accomplish, in one sentence a reviewer could check.
# 3. Bench `m21-s2` found a guarantee that was real and read too strongly. State
#    what "zero errors" and "the group failed" have in common as claims.
#
# ---
#
# ## Attributions
#
# Module 21's reference model has no admission probe, so the queue, the tick
# accounting, and the two policies are this bench's own — run on the real
# `asyncio` event loop, in process, with no I/O.
