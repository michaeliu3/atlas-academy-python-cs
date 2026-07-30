# Module 21 — Asynchronous and Distributed Systems: Primary-Source Map

## Document status

- **Purpose:** authoritative research, claim, licensing, and teaching map for
  the Module 21 learner workbook, reference model, visual studio, and TA
  materials.
- **Course position:** follows Module 20, *Networks and Application
  Protocols*. It carries Module 19's local-concurrency discipline and Module
  20's network-knowledge discipline into one larger question: how should a
  program coordinate work whose execution, observation, and effects may be
  separated by time, queues, and machines?
- **Evidence policy:** use official Python 3.14 documentation and Final PEPs
  for public Python behaviour; RFC/W3C specifications for protocol and trace
  formats; original research papers for formal distributed-systems models;
  public university material only for pedagogy and sequence. A course page is
  never the authority for a Python or protocol contract.
- **Research snapshot:** **2026-07-30**. Links were public at this date.
  Status is recorded where a source is historical, updated, or a living
  specification.
- **Target runtime:** Python **3.14.6**. Public API promises are kept separate
  from CPython implementation observations, operating-system scheduling,
  cloud-provider behaviour, and a remote service's own contract.
- **Pedagogical bias:** architecture reading, trace reconstruction, debugging,
  state modelling, and review of generated patches matter more than typing a
  large distributed service. Every exercise must name what a local observation
  does and does not establish.
- **Copyright policy:** all eventual explanations, diagrams, code, incident
  fixtures, and assessment items are original. Link to standards, papers, and
  course pages; do not copy substantial prose, figures, slides, assignments,
  labs, or solutions.

This is a research boundary, not the learner-facing lesson. It records what
Module 21 may responsibly claim, what it must label as an Atlas teaching
model, and where it must stop.

---

## Executive teaching decision

Module 20 ended with a deliberately uncomfortable conclusion: a client timeout
does not reveal whether a remote service did nothing, rejected a request,
recorded a decision, or replied too late. Module 21 must **not** answer that
uncertainty by saying “use `async`,” “use a queue,” or “add replicas.” Each of
those adds another boundary with its own locally observable states.

The module's connected spine is:

```text
local coroutine intent
    → explicitly owned asyncio Task
    → cooperative suspension / resumption at await boundaries
    → structured TaskGroup ownership and cancellation scope
    → bounded in-process queue and stream write-buffer pressure
    → request/message identity across an RPC or message boundary
    → remote admission, decision, reply, and duplicate-handling policy
    → partial failure and an explicitly UNKNOWN client outcome
    → causal relation, not a fictional global clock
    → separately named replica-visible / acknowledged / committed claims
    → correlated traces and evidence with declared observation scope
```

The key learning move is to put **two state machines beside each other**:

| Plane | Example fact | It does *not* establish |
|---|---|---|
| Local execution | an `asyncio.Task` was cancelled, timed out, or left a `TaskGroup` | a remote request was unsent, a worker stopped, or a server rolled back |
| Local pressure | `Queue.put()` blocked, or `StreamWriter.drain()` resumed | that a broker, peer, replica, or database is healthy or caught up |
| Remote effect | a named server/replica logged or applied an operation | that all replicas agree or that the client saw a reply |
| Cross-system knowledge | a validated matching reply or declared status lookup was observed | a universal exactly-once, security, or durability guarantee |

### Recommended capstone invariant

> Every Atlas dispatch has one stable operation ID, canonical request digest,
> deadline, and evidence record. Local work is admitted through a bounded,
> explicitly owned async pipeline; every admitted local item receives one
> terminal local accounting record. Cancellation is cleaned up and propagated
> according to the owning structured scope, but is never mislabeled as a remote
> rollback. Every remote retry retains the same operation identity and is
> classified separately from a transport write, a server/replica observation,
> a matching reply, and an unresolved outcome. A trace context correlates
> declared observations; it does not authenticate them, make them complete, or
> prove causality, durability, or replicated agreement.

This is an **Atlas teaching contract**. It is not a production distributed
queue, a consensus implementation, a transaction manager, a TLS/authentication
scheme, or a claim of global exactly-once processing.

---

## Scope ownership and hard boundaries

### Module 21 owns

- the difference between a coroutine object, a scheduled `asyncio.Task`, a
  Future/awaitable, and an OS thread/process or remote service;
- cooperative scheduling in one event-loop thread, explicit yield points,
  task ownership, task lifetime, structured concurrency, and grouped errors;
- local cancellation requests, cleanup, timeout semantics, shielding, and the
  difference among `timeout()`, `wait_for()`, and `wait()`;
- bounded in-process work queues, task acknowledgement, graceful versus
  immediate shutdown, stream read boundaries, and write-buffer flow control;
- the distinction among **local admission/backpressure**, transport flow
  control, remote queue/broker admission, and service capacity;
- RPC/message vocabulary: schema/version, correlation/operation identity,
  request/reply matching, duplicate handling, retry budgets, and explicit
  delivery/effect claims;
- partial failure as a reasoning model: slow, partitioned, crashed, and
  unreachable histories can be observationally indistinguishable to a client;
- Lamport's happens-before relation as a causal partial order, not a wall-clock
  total order;
- a learner-level map of replication and consistency contracts—linearizability,
  convergence/eventual claims, availability, partitions, safety, and liveness—
  with precise stopping lines;
- trace context, task context, correlation fields, and evidence packets that
  state their observation point, schema, limitations, and redaction policy.

### Module 21 mentions but does not implement deeply

- event-loop low-level transports/protocols, `select`/IOCP details, and CPython
  event-loop internals;
- workers in threads/processes/interpreters, only as a bridge back to Module
  19; `asyncio.to_thread()` is not a distributed-worker system;
- actor, broker, pub/sub, or stream-processing frameworks as examples of
  message boundaries, not comparative vendor training;
- vector clocks, leases, gossip, leader election, replicated logs, quorums,
  transactions, CRDTs, and consensus as carefully labelled preview vocabulary;
- HTTP, RPC, TCP, and queue protocol mechanics already established in Module
  20, reused only through their stated boundaries.

### Deferred to later modules or explicitly out of scope

- **Module 22 — Security:** TLS/certificate verification, authentication,
  authorization, message signing, trust boundaries, tenants, secrets,
  adversarial replay/DoS, and whether a trace/header is trustworthy.
- **Module 24 — CPython internals and performance:** implementation details of
  loop selector wakeups, GIL release, allocator behaviour, CPU profiling,
  benchmark methodology, and platform-specific event-loop throughput claims.
- **A later advanced distributed-systems extension:** a complete replicated
  state machine, Raft/Paxos, quorum design, transactions/2PC, database
  isolation, CRDT merge laws, lease/failure-detector algorithms, and formal
  verification. Module 21 gives the conceptual boundary required to read such
  material; it does not pretend to teach or implement it in one chapter.

### Required non-claims

The workbook and reference model must explicitly reject all of these:

- “`async` makes Python code parallel or preemptive.”
- “An `await` returns control at any point in a CPU-bound calculation.”
- “A successful `TaskGroup` exit proves all external side effects happened.”
- “Cancelling an `asyncio.Task` cancels a server operation, a thread, a process,
  or a database transaction.”
- “A timeout says the remote operation failed or was undone.”
- “`shield()` makes an operation safe, atomic, durable, or externally
  unstoppable.”
- “`asyncio.Queue(maxsize)` is a global distributed-backpressure guarantee.”
- “`Queue.join()` means every side effect downstream of a worker is durable.”
- “`StreamWriter.drain()` means the peer parsed, validated, or committed a
  message.”
- “RPC is a local function call with a slower return.”
- “A reply, tracing header, message ID, or wall-clock timestamp supplies an
  ordering proof for all distributed events.”
- “A trace ID proves a complete trace, an authorized caller, a correct causal
  tree, or the outcome of an operation.”
- “At-least-once, at-most-once, and exactly-once have one universal meaning
  without a named persistence, duplicate, crash, and observation scope.”
- “Replication is backup” or “eventual consistency means no correctness
  contract.”
- “CAP means choosing any two of three desirable letters.”
- “FLP says consensus cannot be useful in real systems.”

---

## Exact continuity from Modules 19 and 20

### What Module 19 contributed

Module 19 established that local concurrency needs a clear ownership model,
bounded admission, terminal accounting, and synchronization around shared
state. `asyncio` changes the scheduling mechanism; it does not erase that
discipline. A single event loop can interleave many tasks, and every task still
needs an owner, a terminal state, and a resource-cleanup path.

### What Module 20 contributed

Module 20 established that client-side write, transport receipt, parsing,
server decision, client reply, and durable effect are different claims. Module
21 preserves every one of those boundaries. A task timeout or cancellation is
**additional local execution evidence**, not a way to infer a remote outcome.

### M20 → M21 bridge incident

Start from the Atlas Module 20 trace:

```text
client uses operation op-0007
client sends a framed request
server may record PUBLISHED
client timeout occurs before a matching response is parsed
```

Then show this generated “async repair”:

```python
async with asyncio.timeout(0.3):
    await client.publish(request)
return "publish failed"
```

The `TimeoutError` is a local outcome for the containing task. It does not
reduce the histories consistent with the Module 20 timeout. The correct repair
must include (1) an explicit deadline and cancellation scope, (2) a stable
operation identity and retry policy, and (3) a status/evidence path that can
leave the result **UNKNOWN**.

### Two-plane state vocabulary

| Label | Permitted meaning | Prohibited promotion |
|---|---|---|
| `LOCAL_TASK_CANCEL_REQUESTED` | `Task.cancel()` arranged a `CancelledError` at a later event-loop opportunity | the coroutine, worker, or server definitely stopped |
| `LOCAL_TIMEOUT` | a documented timeout helper exceeded its local deadline semantics | remote work definitely did not happen |
| `LOCAL_QUEUE_ACCEPTED` | this process admitted an item to its `asyncio.Queue` | a remote broker/worker accepted it |
| `LOCAL_QUEUE_ACKNOWLEDGED` | an in-process consumer called `task_done()` for that item | its downstream side effect is durable |
| `STREAM_BUFFER_DRAINED_TO_LOW_WATERMARK` | local write-buffer flow control allowed writing to resume | peer application receipt/validation/commit |
| `REMOTE_SERVER_OBSERVATION` | a specified server recorded an event at a specified point | client observation, other replicas, or security proof |
| `MATCHING_RESPONSE` | the client parsed a response that matches stated operation identity/digest | agreement beyond the named service contract |
| `TRACE_CORRELATION` | recorded observations share declared trace/correlation fields | a complete causal proof or an authoritative audit trail |
| `UNKNOWN` | available evidence cannot distinguish remaining histories | “failed,” “rolled back,” or “safe to duplicate” |

---

## First-principles model for the learner workbook

### 1. Own the work before distributing it

The first lesson is not `async def` syntax. It is an ownership question:

```text
who created this work?
who keeps it reachable?
who waits for it?
who observes grouped failure?
who requests cancellation?
who performs cleanup?
what external effect might outlive local ownership?
```

For related work, the course should lead with `async with asyncio.TaskGroup()`
instead of detached `create_task()` calls. The standard library documents that
the event loop keeps weak references to tasks; a standalone task without a
separate strong reference may disappear while still executing. This makes
“fire-and-forget” an architecture decision requiring an explicit owner and
evidence path, not a harmless coding shorthand.

### 2. Cooperative concurrency is a local scheduling contract

An event loop runs one task at a time in its thread. A task that awaits a
Future suspends; the loop can then run other tasks, callbacks, or I/O handling.
That supports a simple first-principles model:

```text
running task
    ├─ executes ordinary Python until it blocks/yields
    ├─ awaits an awaitable → suspended / not using its loop turn
    └─ returns, raises, or propagates cancellation → terminal local outcome
```

This is excellent for overlapping non-blocking I/O. It does not turn long
CPU-bound Python code into a yielding task, and it does not parallelize a
single event loop's Python handlers. If work crosses into a thread/process, use
the Module 19 ownership/cancellation vocabulary again.

### 3. Structured concurrency makes a local failure topology visible

`TaskGroup` owns a family of related tasks and waits for them on context exit.
When a child first fails with a non-cancellation exception, the group cancels
the remaining children; after waiting, it raises an `ExceptionGroup` or
`BaseExceptionGroup` as appropriate. This supplies a meaningful local claim:

> The owner has observed the completion/cancellation/error outcome of every
> task it placed in this structured scope.

It does **not** supply a remote all-or-nothing transaction. The learner must
trace an external send before the child failure and preserve the operation ID
for reconciliation.

### 4. Cancellation is a request with cleanup semantics

`Task.cancel()` schedules a `CancelledError` into a coroutine on a later
event-loop cycle; the coroutine can clean up, and technically can suppress the
request. The recommended discipline is `try`/`finally` cleanup followed by
propagating `CancelledError`. `TaskGroup` and `asyncio.timeout()` themselves
use cancellation internally, so indiscriminately swallowing it can break their
structure.

The worksheet should ask the learner to label four different actions:

| Action | Local scope | What it says about remote work |
|---|---|---|
| `Task.cancel()` | requests coroutine cancellation | nothing by itself |
| `asyncio.timeout()` | cancels the current task in its context and converts that local cancellation to `TimeoutError` outside the context | nothing by itself |
| `asyncio.wait_for(aw, t)` | on timeout, cancels the awaited task/future and waits for cancellation; elapsed wait may exceed `t` | nothing by itself |
| `asyncio.wait(..., timeout=t)` | returns pending tasks without cancelling them | nothing by itself |
| `asyncio.shield(aw)` | protects the awaited work from cancellation propagated by its caller; the caller still sees cancellation | nothing by itself |

### 5. Backpressure is a chain of capacities, not one call

The lesson's four pressure layers must remain separate:

```text
producer rate
  → [bounded asyncio.Queue] local admission / memory bound
  → [worker semaphore or TaskGroup] local concurrency bound
  → [StreamWriter write buffer + drain] local transport-buffer flow control
  → [remote broker/service/replica] separately specified remote admission
```

`asyncio.Queue(maxsize=N)` makes `put()` wait once the **local in-process**
queue reaches capacity. Its unfinished-task counter is only discharged by a
consumer's `task_done()` call. `shutdown(immediate=True)` may unblock `join()`
after dropping queued work; the docs explicitly say this violates the usual
join invariant. Therefore Atlas uses a non-immediate drain or makes the
dropped-item accounting explicit.

For streams, `write()` can enqueue into the internal write buffer. `drain()`
waits when that buffer reaches its high watermark until it returns below the
low watermark. That is vital local flow-control evidence, not a peer-application
acknowledgement. Similarly, `read(n)` is a request for *up to* `n` bytes;
`readexactly(n)` is a bounded framing tool whose early EOF is reported as
`IncompleteReadError` with a partial payload.

### 6. RPC/message boundaries retain network uncertainty

An RPC facade may serialize an argument, send a request, await a reply, and
return a value. The surrounding syntax is intentionally pleasant; the actual
boundary includes schema/version compatibility, bytes, remote execution,
failure, duplicate handling, reply matching, and timeout policy. The ONC RPC
specification directly notes that remote calls differ from local calls in error
handling, side effects/address-space separation, performance, and
authentication. It also makes the key retry point explicit: with an
unreliable transport, timeout/retransmission/duplicate policy belongs to the
application; after a retransmission without a reply, the client cannot infer
how many times a procedure ran.

For Atlas, every asynchronous `publish()` call must carry the same stable
operation ID and canonical digest from Module 20. A message/RPC contract must
name, at minimum:

```text
message schema + version
operation/correlation identity and payload binding
sender admission and retry budget/deadline
receiver validation, durable-decision boundary, and duplicate table retention
reply/status schema and matching rule
delivery/effect claim, observation point, and unresolved/unknown outcome
```

### 7. Causality precedes clock arithmetic

Lamport's model supplies the simplest defensible ordering idea: events have a
causal partial order. A process-local sequence is ordered; send precedes the
corresponding receive; transitive closure gives *happens-before*. Events that
are not ordered this way can be concurrent, even if one wall clock happens to
display an earlier time. Logical clocks can create a total order consistent
with causality, but the reverse inference is invalid: a lower/higher timestamp
does not by itself establish a causal relationship.

Teach a compact incident graph, not an implementation of distributed clocks:

```text
client send ──► service A receive ──► A enqueue
      │                                  │
      └── client timeout                  └── service B consume

The timeout and B's consume may be incomparable from the client's evidence.
```

### 8. Replication changes the claim that must be made

The module gives learners a contract vocabulary rather than a hand-wavy
“consistent database” label:

| Contract phrase | Safe learner-level meaning | Must not be implied |
|---|---|---|
| **single server decision** | one named service reports a decision under its stated contract | replication, durability after crash, or client observation |
| **linearizable operation** | an implementation claims each operation appears to take effect at some point between invocation and response, respecting real-time order of non-overlapping operations | availability during partitions, a free implementation, or every database feature |
| **convergence/eventual claim** | a system states the conditions under which replicas that stop receiving new updates will converge | read-your-writes, conflict freedom, or immediate visibility |
| **available response** | a system defines a response policy for the stated failure model | a correct/consistent response under every partition |
| **consensus/atomic broadcast** | named processes use a specific protocol and assumptions to agree/order | that an arbitrary queue, trace, or retry loop solved agreement |

The course should show the safety/liveness distinction behind CAP rather than
the “pick two” cartoon. A partition-prone system cannot simultaneously promise
the relevant atomic read/write safety and a response to every request in the
formal model. FLP sharpens another boundary: purely asynchronous deterministic
consensus with even one crash failure cannot guarantee termination. Real
systems add assumptions, timeouts, failure detectors, randomization, or
operational trade-offs; none of those turns a timeout into proof that a peer is
dead.

### 9. Observability is evidence design, not a magic truth layer

Use two correlation mechanisms, and label both carefully:

- A Python `ContextVar` can carry a task-local correlation value through
  `asyncio` without leaking values between asynchronous tasks. It is useful for
  instrumentation within one process.
- W3C Trace Context defines HTTP headers that propagate trace context between
  services; `traceparent` contains a version, trace ID, parent ID, and flags.
  It standardizes correlation propagation, not the correctness or completeness
  of a trace.

OpenTelemetry's API defines a span as an operation within a trace and gives
separate client/server and producer/consumer span kinds. That is useful to
make request/reply versus deferred-message boundaries visible. A trace still
needs explicit data hygiene: use low-cardinality operation names, avoid
secrets/raw payloads, record sampling/absence/clock limitations, and never
elevate client-provided fields to a security fact.

---

## Official Python 3.14.6 source atlas

### P21-01 — `asyncio` overview and task model

- **Sources:** [asyncio overview](https://docs.python.org/3.14/library/asyncio.html)
  and [Coroutines and Tasks](https://docs.python.org/3.14/library/asyncio-task.html)
- **Status:** official Python 3.14.6 public documentation.
- **Use for:** `async`/`await`, coroutine objects, `create_task`, Task lifecycle,
  cooperative scheduling, task ownership, `TaskGroup`, `gather`, cancellation,
  timeout/wait primitives, `shield`, cross-thread submission, and
  `to_thread`.

Allowed learner-facing claims:

- `asyncio` writes concurrent code with `async`/`await`; a task is a
  Future-like object running a coroutine in an event loop.
- A task awaiting a Future suspends its coroutine. Event loops schedule
  cooperatively: one task runs at a time, and while it awaits, the loop may run
  other tasks, callbacks, or I/O operations.
- `asyncio.create_task()` schedules a coroutine in the running loop and
  returns a task. The caller needs a strong reference for deliberately
  detached work because the loop keeps weak task references.
- A `TaskGroup` is an async context manager; its exit waits for all its tasks.
  The first non-`CancelledError` child failure cancels the remaining group
  tasks and failures are combined into an exception group after the group has
  waited. It was added in Python 3.11; in 3.14 `create_task()` passes keyword
  arguments to the loop task factory.
- `asyncio.gather()` and `TaskGroup` are not interchangeable. With default
  `return_exceptions=False`, a first exception propagates out of `gather()`
  while other awaitables continue; `TaskGroup` supplies the stronger
  sibling-cancellation behaviour for a structured family.
- `Task.cancel()` is a request: it schedules `CancelledError` for a later loop
  cycle. The task can clean up and can technically suppress it, so `cancel()`
  does not guarantee terminal cancellation.
- Coroutines should usually use `try`/`finally` and re-propagate an explicitly
  caught `CancelledError`. `CancelledError` subclasses `BaseException`.
  Swallowing it can interfere with `TaskGroup` and `asyncio.timeout()`;
  ordinary user code should not call `uncancel()`.
- `asyncio.timeout()` cancels the **current local task** on expiry and changes
  that cancellation into `TimeoutError` outside its context. Its deadline is
  measured by the event loop clock.
- `asyncio.wait_for()` cancels its awaited task/future on timeout and waits for
  that cancellation to settle, so wall-clock elapsed time may exceed the
  requested timeout. By contrast, `asyncio.wait()` returns pending items on
  timeout without cancelling them.
- `asyncio.shield()` prevents cancellation propagated from the caller into the
  protected awaitable, but the cancelled caller still receives
  `CancelledError`. It neither creates a remote cancellation protocol nor
  makes the protected effect atomic.
- `asyncio.to_thread()` runs a callable in a separate thread and propagates the
  current `contextvars.Context`. The docs position it primarily for I/O-bound
  functions that would otherwise block the event loop; normal GIL-enabled
  CPython limits CPU-bound Python gains.

Required stopping line:

> These are public **local Python execution** contracts. None says that an RPC,
> socket operation, thread function, process, remote queue, server handler, or
> database transaction has a matching cancellation, deadline, or rollback
> outcome.

Teaching uses:

- draw a TaskGroup ownership tree and identify every `await` where cancellation
  can be delivered;
- compare `gather`, `TaskGroup`, and an intentionally owned detached task by
  failure propagation, lifetime, evidence, and cleanup;
- diagnose the false patch “timeout means publish failed”; and
- ask learners to label which parts of an incident are local task state versus
  remote operation state.

### P21-02 — `asyncio.Queue`: bounded local admission and accounting

- **Source:** [Queues](https://docs.python.org/3.14/library/asyncio-queue.html)
- **Status:** official Python 3.14.6 public documentation.
- **Use for:** FIFO queues, `maxsize`, `put`, `get`, `task_done`, `join`, and
  graceful/immediate shutdown.

Allowed learner-facing claims:

- `asyncio.Queue` is intended for async/await code and is not thread-safe.
- With a positive `maxsize`, `await put()` blocks while the local queue is full
  until an item is removed; a nonpositive maximum is unbounded.
- Its local queue size is known, unlike `queue.Queue`'s thread-racy size
  estimate. That does not make it a reservation or an observation of remote
  capacity.
- Each successful queued work item increases the unfinished-task count;
  `task_done()` later acknowledges local processing, and `join()` unblocks
  when the count reaches zero.
- `shutdown(immediate=False)` rejects new puts while allowing already queued
  items to drain. `shutdown(immediate=True)` drains items and can unblock
  `join()` even though no work was performed, violating the usual `join()`
  invariant. Shutdown and `QueueShutDown` were added in Python 3.13.
- Queue methods have no timeout parameter; use an explicit async timeout
  wrapper and model the resulting cancellation/unfinished-work policy.

Required stopping line:

> An `asyncio.Queue` is one in-process coordination object. It does not expose
> broker durability, cross-process delivery, global capacity, retry semantics,
> or the completion of a downstream remote effect.

Teaching uses:

- visualise `created → queued → claimed → locally acknowledged` and ask which
  transition a worker should not claim on cancellation;
- compare graceful drain with immediate shutdown in a trace; and
- require a capacity budget: queue size, worker count, deadline, and what is
  rejected/dropped/reconciled when capacity is exhausted.

### P21-03 — `asyncio` streams: partial reads and local write-buffer flow control

- **Source:** [Streams](https://docs.python.org/3.14/library/asyncio-stream.html)
- **Status:** official Python 3.14.6 public documentation.
- **Use for:** `open_connection`, `start_server`, `StreamReader`,
  `StreamWriter`, `read`, `readexactly`, `write`, `drain`, close, and
  `wait_closed`.

Allowed learner-facing claims:

- Streams are high-level async/await-ready primitives for network connections;
  `open_connection()` returns reader/writer objects and `start_server()` passes
  such a pair to a connection callback.
- `read(n)` reads **up to** `n` bytes. `readexactly(n)` is available when a
  protocol's framing requires exactly `n` bytes; early EOF raises
  `IncompleteReadError`, which exposes partial bytes.
- `StreamWriter.write()` attempts an immediate write and otherwise can queue
  data in an internal write buffer. It should be paired with `await drain()`.
- `drain()` is documented local flow control: when the write buffer reaches its
  high watermark it waits until the buffer drains to its low watermark.
- `close()` followed by `wait_closed()` provides a local connection-close
  lifecycle and waits for the underlying connection to close/flush local
  buffered data.

Required stopping line:

> Stream buffer state, a returned `drain()`, and local connection close are
> not application framing, peer parsing, authentication, server decision, or
> durable remote-effect evidence. Retain Module 20's message parser and
> outcome-classification boundary.

Teaching uses:

- adapt the Module 20 frame decoder to `readexactly` only after learners
  identify its declared length and bounded-size rule;
- show a writer-buffer high/low-watermark trace alongside a separate remote
  service capacity trace; and
- make learners flag code that treats `read(4096)` as a complete request.

### P21-04 — asyncio synchronization and cross-thread boundary

- **Sources:** [Synchronization Primitives](https://docs.python.org/3.14/library/asyncio-sync.html),
  [asyncio and free-threaded Python](https://docs.python.org/3.14/library/asyncio-threading.html),
  and the task API's [`run_coroutine_threadsafe`](https://docs.python.org/3.14/library/asyncio-task.html#scheduling-from-other-threads).
- **Status:** official Python 3.14.6 public documentation; the free-threaded
  guide describes current 3.14 support and is not a language-wide performance
  promise.

Allowed learner-facing claims:

- asyncio locks/events/conditions/semaphores are designed for asyncio tasks,
  are not thread-safe, and their methods do not take a timeout argument.
- asyncio 3.14 has first-class free-threaded-Python support, but a single event
  loop still runs its Python task handlers serially in that loop's thread.
- In a multi-threaded async application, each thread should own its loop;
  tasks/futures created in one thread should not be awaited/manipulated from a
  different thread. Use the documented thread-safe bridge APIs for crossing
  that boundary.
- `run_coroutine_threadsafe()` submits a coroutine to a specified loop from a
  different OS thread and returns a `concurrent.futures.Future`.

Required stopping line:

> A task lock is not a cross-thread lock, and neither is a distributed lock.
> Free-threaded support does not turn asyncio state, wall clocks, or remote
> side effects into safe shared global objects.

### P21-05 — `contextvars` and asyncio debugging: local observability tools

- **Sources:** [contextvars](https://docs.python.org/3.14/library/contextvars.html)
  and [Developing with asyncio](https://docs.python.org/3.14/library/asyncio-dev.html).
- **Status:** official Python 3.14.6 public documentation.
- **Use for:** per-task correlation scope, debug mode, wrong-thread mistakes,
  slow-callback detection, selector timing, unawaited-coroutine warnings, and
  thread-safe callback bridges.

Allowed learner-facing claims:

- Context variables are natively supported by asyncio. They prevent
  context-managed state from bleeding between concurrent async code in the way
  a `threading.local()` approach can.
- `asyncio` debug mode can flag non-thread-safe API use from a wrong thread,
  log slow I/O-selector operations and slow callbacks, and support development
  diagnosis. It is evidence about the local runtime under a stated debug
  configuration.
- A loop generally runs all its callbacks and tasks in one thread; while a task
  runs, no other task can run in that same thread. Code from another thread
  needs the documented thread-safe scheduling route.

Required stopping line:

> A context variable or debug log can correlate local work. It is not a
> distributed trace format, a security credential, an audit source of truth,
> or proof that another process received the same value.

### P21-06 — PEP 654: grouped concurrent failures

- **Source:** [PEP 654 — Exception Groups and `except*`](https://peps.python.org/pep-0654/)
- **Status:** Final Standards Track PEP, Python 3.11.
- **Use for:** language-level `ExceptionGroup`, `BaseExceptionGroup`, and
  `except*`; the motivation explicitly includes better task spawning APIs.

Allowed learner-facing claims:

- Exception groups represent multiple unrelated exceptions propagating
  together; `except*` handles matching subgroups.
- In structured-concurrency examples, a learner needs to inspect more than one
  failure leaf and preserve group structure/evidence rather than catch a
  single convenient error and discard the rest.

Required stopping line:

> An exception group reports local concurrent failure paths. It does not order
> external effects, establish a single root cause, or prove that all remote
> work was cancelled.

---

## Distributed-systems, protocol, and observability source atlas

### D21-01 — ONC RPC as a precise historical/current RPC boundary

- **Sources:** [RFC 5531 — ONC RPC v2](https://www.rfc-editor.org/rfc/rfc5531.html)
  and its [status page](https://www.rfc-editor.org/info/rfc5531/).
- **Status:** Standards Track/Draft Standard document from 2009, **updated by
  RFC 9289**. Use its RPC model and transport/semantics discussion as a
  carefully labelled protocol case study, not a generic modern-RPC mandate.
- **Use for:** request/reply matching, versioning, RPC-vs-local boundary,
  transport independence, timeout/retransmission/duplicate policy, and
  explicit semantics.

Allowed learner-facing claims:

- A remote procedure call has client and server sides, a call message and a
  reply message; client/server are transaction roles rather than permanent
  labels for a machine.
- The RFC describes important differences from local calls: network/server
  error handling, nonshared address spaces/side effects, latency, and
  authentication concerns.
- Its RPC protocol does not itself provide generic reliability or procedure
  execution semantics. When using an unreliable transport, applications need
  timeout, retransmission, and duplicate-detection policies.
- If a retransmitted call receives no reply, the client cannot infer how many
  times the procedure executed. The document describes server-side retention of
  transaction identity as a way to obtain some execute-at-most-once behaviour.
- Procedures, parameters, results, and versions belong in the specific
  application protocol; a generated client stub does not eliminate that design
  responsibility.

Required stopping line:

> RFC 5531 is one RPC protocol model. Its wording does not establish an
> application-independent exactly-once guarantee, a modern framework's
> semantics, end-to-end security, or a policy for Atlas.

Teaching use:

- Ask the learner to turn a false local-looking function signature into an
  explicit request/identity/response/unknown-outcome contract.

### D21-02 — Module 20's HTTP and idempotency continuation

- **Sources:** [RFC 9110 §9.2.2 (idempotent methods)](https://www.rfc-editor.org/rfc/rfc9110.html#section-9.2.2),
  the Module 20 source map, and its Atlas local reference model.
- **Status:** RFC 9110 is an IETF Standards Track HTTP semantics source;
  Module 20's Atlas invariant is a course-local contract.
- **Use for:** carry forward the distinction among retrying a request,
  operation identity, duplicate detection, valid matching response, and
  unknown completion.

Allowed learner-facing claim:

> HTTP/idempotency vocabulary can guide an Atlas retry policy, but an async
> timeout, task cancellation, or message queue never silently upgrades that
> policy into global delivery or exactly-once execution.

### D21-03 — Lamport: causal partial order and logical clocks

- **Source:** Leslie Lamport, [*Time, Clocks, and the Ordering of Events in a
  Distributed System*](https://www.microsoft.com/en-us/research/publication/time-clocks-ordering-events-distributed-system/), CACM 1978.
- **Status:** original research paper, hosted by the author's later Microsoft
  Research page. Historical but foundational; not a protocol specification.
- **Use for:** happens-before, concurrent/incomparable events, logical-clock
  intuition, and the difference between causality and physical timestamps.

Allowed learner-facing claims:

- Distributed events have a causal partial order: one event precedes another
  when it can causally affect it.
- Logical timestamps can be used to create a total order consistent with that
  causal order.
- A total order chosen for processing/reporting is extra structure; it should
  not be presented as a discovery of all real-world causal relationships.

Required stopping line:

> A trace timestamp, a log sequence number, or a Lamport-style number is not a
> universal clock-synchronization proof. Module 21 uses a small event graph,
> not a production clock algorithm.

### D21-04 — Chandra and Toueg: failure detectors are assumptions with errors

- **Source:** Tushar Chandra and Sam Toueg, [*Unreliable Failure Detectors for
  Reliable Distributed Systems*](https://ecommons.cornell.edu/entities/publication/7948ff49-7263-49f8-a29b-d062e7cbb240), Cornell technical report 95-1535 / later journal work.
- **Status:** original research/technical-report record. It formalises a
  model; it is not an operational-monitoring product manual.
- **Use for:** completeness/accuracy vocabulary, why suspicion differs from
  fact, and why timeouts/heartbeats must expose a policy and a reconciliation
  path.

Allowed learner-facing claims:

- The paper introduces unreliable failure detectors for asynchronous systems
  with crash failures and characterises them using completeness and accuracy.
- A failure-detection mechanism can make mistakes; an architecture should not
  mislabel a timeout or missed heartbeat as direct proof of a permanent remote
  crash.

Required stopping line:

> Module 21 will not implement a formal failure detector, membership service,
> lease, or leader-election algorithm. It uses this source to prevent the
> naive “timeout = dead server” inference.

### D21-05 — Herlihy and Wing: linearizability is a named strong contract

- **Source:** Maurice Herlihy and Jeannette Wing, [*Linearizability: A
  Correctness Condition for Concurrent Objects*](https://www.cs.cmu.edu/~wing/publications/HerlihyWing90.pdf), TOPLAS 1990.
- **Status:** original peer-reviewed research paper, hosted by the author’s
  university page. It defines a correctness condition; it is not a claim that
  every replica/database offers it.
- **Use for:** a precise definition of a strong operation-level consistency
  claim and a bridge from Module 19's local abstract-object reasoning to a
  named distributed contract.

Allowed learner-facing claims:

- Linearizability gives the illusion that an operation takes effect at some
  point between its invocation and response, subject to the object's legal
  sequential specification and real-time constraints for non-overlapping
  operations.
- It is a property to specify, implement, and test against—not a synonym for
  “probably fresh” or a promise automatically obtained from a replicated
  storage product.

Required stopping line:

> Atlas may label an operation “server-local applied” or “specified as
> linearizable” only when its model states exactly which object and
> invocation/response boundaries are covered. Module 21 does not implement or
> prove a linearizable replicated object.

### D21-06 — Gilbert and Lynch: the CAP boundary is safety versus liveness

- **Source:** Seth Gilbert and Nancy Lynch, [*Perspectives on the CAP
  Theorem*](https://groups.csail.mit.edu/tds/papers/Gilbert/Brewer2.pdf), MIT
  CSAIL technical paper.
- **Status:** author-hosted research explanation by the formal-theorem authors;
  use it to state the formal boundary, not as a vendor decision chart.
- **Use for:** atomic read/write shared-object model, partition-prone systems,
  safety versus liveness, and rejection of the “choose two” mnemonic.

Allowed learner-facing claims:

- The CAP argument concerns a particular formal model in which a service
  implements an atomic read/write object while partitions are possible.
- Consistency/atomicity is treated as a safety property; availability is a
  liveness property about eventually responding.
- The useful engineering lesson is to state which safety and response
  properties are retained under which failures, rather than treating the three
  words as interchangeable product features.

Required stopping line:

> Do not teach “pick any two of C, A, P.” Network partitions are not a product
> option, and CAP is not a complete performance, latency, database-isolation,
> or architecture-evaluation framework.

### D21-07 — FLP and consensus preview

- **Source:** Michael Fischer, Nancy Lynch, and Michael Paterson,
  [*Impossibility of Distributed Consensus with One Faulty Process*](https://groups.csail.mit.edu/tds/papers/Lynch/jacm85.pdf),
  JACM 1985.
- **Status:** original theoretical research. Read only a short guided excerpt
  or authoritative course note; do not make the learner reproduce the proof in
  this module.
- **Use for:** the correct scope of the phrase “asynchronous consensus
  impossibility.”

Allowed learner-facing claim:

> In the fully asynchronous deterministic model with even one crash failure,
> a consensus algorithm cannot guarantee termination. This is why actual
> systems make additional assumptions or trade-offs; it is not a claim that
> practical agreement protocols cannot work.

Required stopping line:

> The capstone must not advertise its bounded async pipeline, idempotency
> table, or trace IDs as consensus, a replicated log, or a solution to FLP.

### D21-08 — W3C Trace Context: cross-service correlation format

- **Source:** [W3C Trace Context](https://www.w3.org/TR/trace-context/).
- **Status:** W3C Recommendation (latest page includes editorial updates after
  the 2020 Recommendation); use the versioned Recommendation link in learner
  citations when stable wording matters.
- **Use for:** `traceparent` fields, propagation rules, malformed-field
  handling, sampling caveat, and trace-context mutation across HTTP hops.

Allowed learner-facing claims:

- Trace Context standardises HTTP headers/value formats for passing tracing
  context among services.
- Version `00`'s `traceparent` format contains version, 16-byte trace ID,
  8-byte parent ID, and flags. Invalid IDs are rejected/ignored according to
  the specified processing model.
- Sampling flags are recommendations, not a guarantee that every service has
  recorded data. A service may need to restart trace context at a security
  boundary.

Required stopping line:

> A propagated trace context supports correlation under a stated instrumentation
> policy. It does not guarantee trustworthy provenance, complete recording,
> parent/child causality in an arbitrary application, or authorization. Those
> trust issues belong to Module 22.

### D21-09 — OpenTelemetry trace API: observation roles, not business truth

- **Source:** [OpenTelemetry Trace API specification](https://opentelemetry.io/docs/specs/otel/trace/api/)
  and [OpenTelemetry overview](https://opentelemetry.io/docs/specs/otel/overview/).
- **Status:** living project specification; record its release/version when a
  learner artifact depends on exact field names. The source owner is the
  OpenTelemetry project, not Python or the IETF.
- **Use for:** spans, trace/span context, client/server versus
  producer/consumer roles, events, attributes, and links.

Allowed learner-facing claims:

- A span represents an operation within a trace and records a span context,
  timing, attributes, events, status, and relations.
- Client/server span kinds model request/response; producer/consumer kinds
  model deferred work. This is useful visual vocabulary for not confusing a
  queued message with a synchronous RPC response.
- Trace/span context can be propagated across process boundaries to group
  observations.

Required stopping line:

> OpenTelemetry roles label observations; they do not prove that a message was
> delivered once, that two clocks agree, that an external effect committed, or
> that values are safe to export.

---

## University-source atlas

University material determines the teaching progression but never substitutes
for an API/specification/paper where a precise technical claim is at stake.

### U21-01 — MIT 6.5840: fault tolerance, replication, and consistency

- **Source:** [MIT 6.5840 Distributed Systems, Spring 2026](https://pdos.csail.mit.edu/6.5840/)
  and its [schedule](https://pdos.csail.mit.edu/6.824/schedule.html).
- **Use:** establishes a credible upper-level progression from fault tolerance
  and replication into consistency, transactions, Spanner, chain replication,
  verification, and case studies.
- **Teaching use:** Module 21 adopts the same discipline of reading a system
  claim, its fault model, and its evidence before treating an implementation as
  correct.
- **Boundary:** the Atlas workbook links to public pages/papers only; it does
  not reproduce MIT labs, answers, exam questions, or slides.

### U21-02 — Brown CS1380/1385/2380: composition from serialization to RPC, groups, and storage

- **Source:** [Brown Distributed Systems course](https://cs.brown.edu/courses/csci1380/)
  and [milestone progression](https://cs.brown.edu/courses/csci1380/milestones/).
- **Use:** its sequence—serialization, actors/RPCs, node groups/gossip,
  distributed storage, distributed processing, cloud deployment—supports an
  integrated architecture-first order rather than a disconnected feature list.
- **Teaching use:** Module 21's capstone moves from one operation's identity
  and local async pipeline to a small replica/evidence model; it does not ask
  the learner to reimplement a cloud search engine.
- **Boundary:** Brown's project material is not copied. The Atlas course uses
  original examples and its own assessment/rubric.

### University-source selection verdict

Use MIT to show why fault model, replication, and consistency belong in one
connected systems arc. Use Brown to show why serialization/RPC/node-group/
storage concepts compose into an architecture. Use Python docs, RFCs/W3C
specifications, and original papers to ground every behaviour/guarantee. This
keeps the course rigorous while avoiding a miniature, disconnected re-creation
of several university syllabi.

---

## Source-backed teaching architecture

### Recommended session sequence

1. **One loop, many owned tasks.** Derive coroutine → task → await → local
   scheduling; inspect a frozen event loop caused by CPU work and distinguish
   it from Module 19's parallelism.
2. **Failure has a shape.** Build a `TaskGroup` ownership tree; trace grouped
   exceptions, cancellation delivery, cleanup, `timeout`, `wait_for`, `wait`,
   and `shield` without claiming external cancellation.
3. **Pressure is local until a contract crosses the boundary.** Model bounded
   queue admission, acknowledgment, graceful drain, stream frame reads, and
   write-buffer watermarks. Identify every unbounded queue and every missing
   `task_done()`/deadline.
4. **An async RPC is still a network operation.** Read an API facade and
   reconstruct schema/version, operation ID/digest, retry budget, duplicate
   policy, remote decision boundary, matching reply, and status lookup.
5. **Timeouts create partial-failure histories.** Given the same local timeout,
   enumerate delay, partition, crash, duplicate, and late-reply histories.
   Classify the outcome as confirmed/rejected/unknown only with stated
   evidence.
6. **Order is causal before it is chronological.** Draw a happens-before graph
   from sends/receives/local events; compare a trace ID, wall timestamps, and a
   logical sequence without promoting any of them to a universal clock.
7. **Replication changes the definition of done.** Choose among explicitly
   named single-server, replica-applied, linearizable, convergence, and
   response-under-partition claims. Diagnose CAP/FLP overclaims.
8. **Make an incident explain itself.** Construct a privacy-aware evidence
   packet: local task state, queue depth, retry identity, declared remote
   observations, trace correlation, test/model provenance, unresolved
   histories, and next reconciliation action.

### Required visual-studio views

- **Task orchard:** a keyboard-accessible task-ownership tree. Learners select
  which owner waits, cancels, logs, and holds a strong reference; reveal the
  `TaskGroup`/detached-task consequences.
- **Cancellation microscope:** a timeline where a deadline injects local
  cancellation at an `await`; learners distinguish cleanup, task terminal
  state, a shielded child, and remote operation UNKNOWN.
- **Pressure pipeline:** sliders for producer rate, bounded queue capacity,
  worker concurrency, stream-buffer watermarks, and remote capacity. Only the
  first three are local model facts; reveal where evidence ends.
- **RPC reality check:** turn a deceptively local `await publish(x)` into a
  request/reply state machine with identity/digest, retry, duplicate, response
  validation, and status lookup.
- **Causality board:** connect process-local order and send→receive edges;
  the visual refuses to infer a causal edge from wall-clock order or shared
  trace ID alone.
- **Replica claim ladder:** rank `accepted`, `one node applied`, `matching
  reply`, `specified linearizable result`, and `convergence under stated
  conditions`; inspect the missing assumptions behind each promotion.
- **Evidence packet auditor:** label fields as `[LOCAL RUNTIME]`, `[ATLAS
  MODEL]`, `[SERVER OBSERVATION]`, `[TRACE CORRELATION]`, `[IETF/W3C SPEC]`,
  or `[UNKNOWN]`; reject raw secrets/payloads and unscoped “success” labels.

### Capstone shape — Atlas Dispatch and Reconciliation Lab

The reference should remain a deterministic **finite model**, primarily for
reading, debugging, and review. It should not make real network calls or claim
to be an RPC framework.

```text
bounded async intake
  → supervised TaskGroup of dispatch workers
  → scripted request/reply transport seam
  → stable operation ID + canonical digest from Module 20
  → scripted remote observation / lost reply / duplicate / late reply
  → local evidence store + optional declared status lookup
  → causal-event ledger and replica-claim labels
```

Required model seams:

1. **Owned local work:** every accepted job has a task/queue/accounting record;
   the model can show a bug such as an unacknowledged queue item or detached
   task without a strong owner.
2. **Cancellation boundary:** a local deadline cancels a model task at an
   explicit await point. The trace must show that remote decision state remains
   independent unless a separate scripted server observation says otherwise.
3. **Pressure boundary:** queue capacity and worker count are explicit; the
   model records rejected/admission-blocked/abandoned paths. It must never
   label local `drain` as remote completion.
4. **Delivery/effect boundary:** scripted modes include no remote admission,
   remote decision plus lost reply, duplicate same ID/digest replay,
   same-ID/different-digest conflict, and late matching reply/status lookup.
5. **Causality boundary:** an event ledger has process-local sequence and
   explicit send→receive edges; it may render a partial order but must not
   invent a total physical order.
6. **Replication boundary:** at most use `node-A applied` and `node-B
   unobserved`/`node-B applied` labels with declared assumptions. It must not
   claim consensus, quorum, durability after crash, or linearizability unless
   a test/model actually states and proves that narrow property.
7. **Evidence boundary:** JSON output includes model/version, Python version,
   fixture/digest, command, task/queue state, operation identity, declared
   evidence scope, trace/correlation data, redaction/limitations, and explicit
   unknowns. No real endpoints, tokens, raw payloads, or environment secrets.

Suggested test matrix:

```text
Task ownership      : nested group waits; background task strong reference policy
Cancellation        : cleanup/rethrow; timeout local-only; wait vs wait_for; shield
Pressure            : bounded put blocks/rejects; exact task_done accounting; graceful vs immediate shutdown
Streams/frame       : split/readexactly/incomplete frame; drain label remains local
Delivery/effect     : no admission; lost reply; same-id replay; conflict; late reply; status resolves/does not resolve
Causality           : local sequence + send/receive graph; incomparable events stay incomparable
Replica claims      : one-node observation is not global; labels match fixture
Evidence            : deterministic schema/provenance; no sensitive fields; UNKNOWN preserved
```

### Assessment doctrine

- Use short confidence-aware multiple choice for diagnostics. Every option must
  test an **inference boundary**, not syntax recall. A high-confidence wrong
  answer triggers a one-minute counter-trace; a low-confidence correct answer
  triggers a contrast explanation.
- Require code reading: find the implicit unbounded queue, detached task,
  cancellation swallow, false `drain`/reply claim, replay bug, or ambiguous
  trace field in a generated patch.
- Grade the capstone primarily on architecture map, state/causality traces,
  invariant, narrow tests, evidence packet, limitations, and an agent-patch
  review. Typing volume is not a learning objective.
- Require every final claim to name one of: local task result, local queue
  accounting, model/server observation, matching client response, named
  consistency contract, trace correlation, or UNKNOWN.

---

## Claim-to-source matrix for authoring and TA use

| Learner-visible claim | Owning source | Mandatory qualifier |
|---|---|---|
| One event-loop task runs at a time and yields at awaited Futures | P21-01 Python task docs | local loop/thread only; no preemptive/parallel claim |
| TaskGroup waits for owned tasks and cancels siblings on first non-cancellation failure | P21-01 + P21-06 | local structured scope; remote effects remain separate |
| `Task.cancel()` is a request, not guaranteed terminal cancellation | P21-01 | no remote cancellation inference |
| `timeout`, `wait_for`, `wait`, and `shield` have different local semantics | P21-01 | deadline/timeout is not a remote outcome |
| Positive `asyncio.Queue.maxsize` blocks local `put` and `join` depends on `task_done` | P21-02 | not broker/global capacity/durability |
| `drain()` is local write-buffer flow control | P21-03 | not peer parse/commit evidence |
| Async locks/queues are not cross-thread synchronization | P21-04 | certainly not distributed locks |
| ContextVars/debug mode correlate/diagnose local runtime work | P21-05 | not security/audit/global truth |
| RPC differs materially from local calls; retries need duplicate policy | D21-01 + D21-02 | application protocol names its guarantees |
| Happens-before is a causal partial order | D21-03 | timestamps/trace IDs do not prove all causality |
| Failure suspicion has accuracy/completeness assumptions | D21-04 | timeout ≠ proven crash |
| Linearizability is a named operation contract | D21-05 | do not attribute it to unmodelled replicas |
| CAP frames a safety/liveness boundary under partitions | D21-06 | not “pick two” |
| Trace Context/OTel standardise correlation vocabulary | D21-08 + D21-09 | correlation ≠ completeness/trust/delivery proof |

---

## Licensing and access ledger

| Source family | Status/access | Course treatment |
|---|---|---|
| Python 3.14 docs / CPython-linked source | Public; [PSF License v2 and documentation terms](https://docs.python.org/3.14/license.html). Documentation examples/recipes/code have an additional 0BSD grant. | Link and paraphrase. Reuse only small attributed examples when pedagogically essential; retain notices required by the source. |
| PEP 654 | Final, public; the PEP states it is public domain or CC0-1.0, whichever is more permissive. | Link and paraphrase; preserve status/version. Do not treat older PEP rationale as a replacement for current public docs. |
| IETF RFCs (RFC 5531 / RFC 9110) | Public RFC Series; RFC 5531 is updated by RFC 9289 and carries IETF Trust terms. | Link and paraphrase. Do not reproduce substantial prose, diagrams, or protocol text; retain required notices for any code component. |
| W3C Trace Context | Public W3C Recommendation / editorially updated technical report; page states W3C permissive document-license rules. | Link and paraphrase; cite the versioned Recommendation for frozen wording. Do not confuse propagation format with trust/security. |
| OpenTelemetry specification | Public living project specification. | Link and paraphrase; record exact spec version for any field-level artifact and inspect repository license before reusing prose/code. |
| Lamport, Chandra–Toueg, Herlihy–Wing, Gilbert–Lynch, FLP papers | Public author/university/technical-report access may coexist with ACM/IEEE/journal copyright. | Link and paraphrase only. Do not copy figures, proofs, or substantial text. State that a model applies under its assumptions. |
| MIT / Brown course pages | Public university teaching material; course/lab content remains institution/instructor material. | Link for optional route/sequence; do not redistribute slides, assignments, solutions, grading materials, or recordings. |

The learner workbook should cite sources near the claim they support. A link
lets a learner inspect the contract; it never expands a local/scope-limited
claim into a broader system guarantee.
