# Module 20 — Networks and Protocols: Primary-Source Map

## Document status

- **Purpose:** authoritative research, claim, licensing, and teaching map for
  the Module 20 learner workbook, local reference model, visual studio, and
  TA materials.
- **Course position:** follows Module 19, *Concurrency and Parallelism*;
  precedes Module 21, *Asynchronous and Distributed Systems*; connects to
  Module 22, *Security*, and Module 24, *CPython Internals and Performance*.
- **Evidence policy:** primary protocol standards, official Python 3.14
  documentation, and public university course materials.  University sources
  help select a pedagogical sequence; specifications and Python documentation
  own technical claims.
- **Research snapshot:** **2026-07-30**. Links are public and were checked at
  that date. An Internet-Draft is labelled as such rather than silently
  promoted to a standard.
- **Target language/runtime:** Python 3.14.6. Public Python APIs are separated
  from CPython, operating-system, router, or packet-capture implementation
  details.
- **Pedagogical bias:** protocol reading, trace interpretation, architecture,
  debugging, model construction, and evidence review take priority over
  typing a large network service.
- **Copyright policy:** all descriptions and diagrams in the eventual course
  are original paraphrases. Link to RFCs and university material; do not copy
  substantial prose, diagrams, slides, labs, or solutions.

This file is deliberately not a learner-facing chapter. It sets a precise
boundary for the chapter: what can be claimed, who owns the claim, and where
the lesson must stop.

---

## Executive teaching decision

Module 20 should not begin with `socket.socket()`, an HTTP client library, or
a catalogue of network acronyms. It begins with an apparently simple local
claim and progressively asks what it proves:

> A locally deterministic Atlas publication candidate is ready. What changes
> when its result must cross a name, endpoint, transport, framing, server,
> response, retry, and audit boundary?

The connected spine is:

```text
local publication candidate
    → URI/API intent and name resolution
    → endpoint candidate: address + transport port
    → transport contract: byte stream or datagram
    → explicit message framing and incremental parsing
    → HTTP/API interpretation and application admission
    → server-local decision record
    → response observation or ambiguous client outcome
    → stable operation identity, retry, and status lookup
    → correlated evidence with a declared scope
```

Each arrow deliberately weakens a tempting but invalid inference. A local
`sendall()` return, a TCP acknowledgement, an HTTP response, and a durable
Atlas decision are distinct observations with distinct owners. The Atlas
capstone therefore uses one narrow, local idempotency ledger and one bounded
frame decoder rather than pretending to implement a production Internet
stack.

### Recommended capstone invariant

> Every Atlas remote publication operation has one stable operation ID and
> canonical request digest. The client records the name-resolution and
> endpoint-attempt boundary, sends only a complete declared request framing,
> and never infers remote receipt, parsing, decision, commit, or
> acknowledgement from a local send, connection close, timeout, or retry. The
> server admits a complete valid request, records one decision for the pair
> (operation ID, request digest) before returning a response, replays that
> decision for an identical duplicate, and rejects reuse of the operation ID
> with a different digest. Only a valid matching response or a subsequent
> declared status lookup can confirm the server's recorded decision; every
> ambiguous client outcome remains explicitly UNKNOWN until resolved.

This is an **Atlas application contract** over a finite local model. It is
not a guarantee of Internet delivery, endpoint identity, security, crash-safe
durability beyond the declared Module 18 boundary, global exactly-once work,
or distributed agreement.

---

## Scope ownership and hard boundaries

### Module 20 owns

- the distinction among a URI/name, an address, a port, an endpoint candidate,
  a transport peer, and an application/service identity;
- DNS at the resolver/cache/candidate level, rather than a hostname-to-one-IP
  cartoon;
- TCP as an ordered reliable byte-stream contract and UDP as an unreliable
  datagram contract;
- transport chunks versus application messages, declared framing, bounded
  incremental parsing, partial reads, and partial-write API boundaries;
- connection/close/error vocabulary at a client-visible level;
- HTTP semantics, HTTP/1.1 framing as a version-specific example, status
  meanings, versioned API contracts, and structured error boundaries;
- timeouts, ambiguous completion, retry policy, operation identity,
  idempotency, and a server-local replay/conflict rule;
- evidence scopes: client observation, server observation, packet/trace
  observation, application decision, and unknown;
- local-only pure-model, loopback, and `socketpair()`-style demonstrations.

### Module 20 mentions but does not teach deeply

- IP packet/header mechanics, TCP states, flow/congestion-control concepts,
  and DNS wire syntax as short source-reading context;
- HTTP/2 and HTTP/3 only to avoid teaching HTTP/1.1 chunk framing as universal;
- browser Fetch as a client API boundary, not as evidence about TCP or a
  server's durable state;
- versioning, correlation identifiers, and problem-detail payloads only as
  observable API design tools.

### Deferred to Module 21 — Async and Distributed Systems

- `asyncio`, event loops, coroutines, task groups, cancellation scopes, async
  queues, and async streams;
- replica coordination, consensus, leader election, leases, partial failure
  as system-wide fault models, distributed transactions, CRDTs, and clocks;
- end-to-end distributed delivery or exactly-once claims;
- application-level backpressure as a broad distributed-system control loop.

Module 20 can truthfully say that an outcome is unknown and show a bounded
retry/idempotency protocol. It must stop before presenting that small rule as
distributed-systems correctness.

### Deferred to Module 22 — Security

- TLS handshake and certificate verification;
- authentication, authorization, secret handling, request signing, hostile
  input, DoS mitigation, and production network exposure;
- trusted-proxy configuration and source-IP security policy;
- threat modelling or a claim that a port/name/address establishes identity.

### Deferred to Module 24 — CPython Internals and Performance

- CPython socket wrapper internals, GIL release behaviour around particular
  system calls, object allocation in parsers, and microbenchmarking mechanics;
- platform-specific kernel buffer, scheduler, or NIC explanation.

---

## Exact continuity from Module 19

Module 19 ended with a bounded local parallel indexer: partitions are
accounted for, a single reducer produces a deterministic result, and Module
18's publication gate validates and records a local artifact. None of that is
automatically a network fact.

### Invariant carried forward

> Every admitted partition has exactly one terminal accounting record, and
> the published index is the deterministic reduction of all and only validated
> terminal shard results; synchronization orders shared-state transitions,
> never substitutes for semantic validation or Module 18 publication evidence.

Module 20 preserves that invariant and adds a remote boundary. A server may
receive zero, one, or more requests that refer to the same local candidate.
The client may see zero or one response even when a server-local decision was
recorded. The new lesson is therefore about *knowledge*, not a replacement for
Module 19's local concurrency reasoning.

### M19 → M20 bridge exercise

Start with a completed local publication candidate and this generated patch:

```python
send_publish(candidate)
if timed_out:
    return "nothing happened"
```

Ask the learner to enumerate possible histories consistent with exactly the
same client timeout:

1. no complete request reached the service;
2. a complete request reached the service but failed validation;
3. the service recorded and committed a decision, then its response was lost;
4. a resolver result directed the retry to a different candidate endpoint.

The output string asserts more than the client knows. The repair is not “add
sleep” or “retry faster.” It is a declared evidence/retry/idempotency protocol.

---

## First-principles claim-and-evidence model

### 1. Intent, name, address, port, endpoint, service

| Term | Minimal defensible meaning | It does **not** prove |
|---|---|---|
| URI/API target | a resource/interaction identifier and request intent | a direct path to one machine or one live application |
| DNS name | a name resolved through cache/resolver/name-server machinery | one permanent address or reachability |
| IP address | a network-layer interface identifier or candidate route target | an authenticated application identity |
| transport port | a demultiplexing value in a transport endpoint/session | which program, tenant, or authenticated service answered |
| endpoint candidate | an address/port/family/protocol result considered by the client | a successful connection or an application decision |
| TCP peer | the remote endpoint that participated in a transport connection | parsing, business validation, or durable Atlas commit |
| Atlas service decision | a defined server-local application state transition | global exactly-once delivery or endpoint security |

### 2. Transport, message, and parser

| Observation or mechanism | What it can support | What it cannot support alone |
|---|---|---|
| TCP receive buffer / `recv()` result | some byte sequence became locally available | one complete application request |
| declared length prefix and complete buffer | a complete frame under that protocol model | valid Atlas schema or semantic authorization |
| UDP datagram | one delivered datagram boundary | delivery, order, no duplicate, or application commit |
| HTTP/1.1 parsed request | an HTTP/1.1 message under its framing rules | that the request's domain operation committed |
| server validation/decision record | a server-local stated result | that the client saw it |

### 3. Evidence ladder

| Evidence label | Strongest justified conclusion | Required stopping line |
|---|---|---|
| **[CLIENT OBSERVATION]** | this client call returned, timed out, closed, or parsed these bytes | do not invent remote effect or non-effect |
| **[PYTHON 3.14 CONTRACT]** | public Python API documents this local-call behaviour | do not infer peer application state |
| **[PACKET/TRACE OBSERVATION]** | a capture at a stated observation point contains a stated trace | it may be incomplete, asymmetric, encrypted, or outside server-app scope |
| **[IETF STANDARD]** | a protocol-standard semantic is defined within its scope | it is not an Atlas product policy or a Python API result |
| **[SERVER OBSERVATION]** | this server recorded receipt/validation/decision | it does not prove client observation or another replica's state |
| **[ATLAS SPEC]** | this declared Atlas request/response/status contract says so | it is not Internet-wide exactly-once or security proof |
| **[UNKNOWN]** | current evidence cannot distinguish the remaining histories | never convert it into “failed” or “rolled back” |

### Claims the learner must reject

- “A hostname is the server.”
- “A port proves which service answered.”
- “A DNS result proves the endpoint is reachable.”
- “A TCP packet/segment is an application message.”
- “One `recv()` returns one request.”
- “`sendall()` means the remote application received it.”
- “A TCP acknowledgement proves the service processed it.”
- “A TCP retransmission is an HTTP/API retry.”
- “No response means the server did nothing.”
- “A 504 proves the origin did not commit.”
- “Safe means no side effects such as logging.”
- “Idempotent means the same response, logs, timing, or billing records.”
- “`Retry-After` guarantees the next attempt will succeed.”
- “`Idempotency-Key` is already a finalized universal HTTP standard.”
- “A `Forwarded` header is a trustworthy audit trail by itself.”

---

## University-source atlas

University material supplies a carefully sequenced way to make protocol
layers visible. The workbook may link to it for optional reading; its technical
claims are rechecked against the sources below.

### U20-01 — Stanford CS144: Introduction to Computer Networking

- **Source:** [CS144 course site](https://cs144.github.io/)
- **Use:** canonical undergraduate implementation arc. Its labs move through a
  byte stream, TCP receiver/sender, network interface, IP router, and a TCP
  implementation. This supports the course's decision to start with a small
  byte-stream/frame model before a convenience HTTP client.
- **Teaching use:** ask the learner what guarantee the byte-stream abstraction
  adds and what application framing it still does not provide.
- **Boundary:** course projects and handouts are not copied; no Stanford lab
  solution or grading requirement enters Atlas.

### U20-02 — UC Berkeley CS 168 textbook

- **Source:** [Computer Networks: A Systems Approach / CS 168 textbook](https://textbook.cs168.io/)
- **Use:** coherent systems-networking vocabulary: layering, addressing,
  reliable delivery, congestion, DNS, TCP/UDP, and HTTP.
- **Teaching use:** link the module's one incident across layers rather than
  presenting DNS, TCP, and HTTP as unrelated lists.
- **Boundary:** the course material is maintained educational content, not an
  RFC. The workbook paraphrases it and uses original diagrams. The site's
  stated CC BY-SA terms must be followed if any material is ever reused.

### U20-03 — MIT 6.829 / networked-systems background

- **Source:** [MIT OCW 6.829 Computer Networks](https://ocw.mit.edu/courses/6-829-computer-networks-fall-2002/)
- **Use:** optional historical university reading for layering and end-to-end
  design intuition.
- **Boundary:** it is not used for current HTTP/Python status claims; its age
  makes current RFCs and Python documentation mandatory authorities.

### University-source selection verdict

Use Stanford's implementation progression and Berkeley's systems framing to
teach an integrated story. Use current IETF and Python sources for every
learner-visible behavioural claim. The course never needs to reproduce a
university slide or write a mini-TCP stack to obtain undergraduate rigor.

---

## Official Python 3.14.6 source atlas

### P20-01 — `socket`: local API contract

- **Source:** [Python 3.14 `socket` documentation](https://docs.python.org/3.14/library/socket.html)
- **Use for:** `socket()`, address families, `getaddrinfo()`,
  `create_connection()`, `settimeout()`, `send()`, `sendall()`, `recv()`,
  shutdown, close, `socketpair()`, and exception vocabulary.

Allowed learner-facing claims:

- `getaddrinfo()` returns address information that can yield multiple
  connection candidates; a program should not reduce that to a permanent
  “hostname = one machine” model.
- `create_connection()` is a convenience for attempting connections to a host
  and port; it does not define an application-level handshake or service
  identity.
- `send()` may send fewer bytes than supplied, so a caller that needs a whole
  buffer must account for partial progress.
- `sendall()` continues sending until all data is sent or an error occurs; on
  error, its API does not provide the amount, if any, already sent. Its timeout
  is a maximum total send duration, not a per-chunk progress/remote-effect
  guarantee. A successful local call does not document an application-level
  remote receipt, parse, or commit.
- `recv()` returning bytes is local delivery from a socket buffer; it is not a
  message delimiter. A zero-length return indicates the peer has closed the
  connection side associated with receiving, after buffered bytes are read.
- timeout behaviour concerns the caller's blocking operation. A timeout is a
  local observation, not a statement that a remote operation was undone.
- `socketpair()` is a local connected-socket tool suitable for
  no-external-network exercises. Any observed chunking is runtime-scoped;
  deterministic chunk inputs belong to a finite model, not to the socket API.

Required wording boundary:

> Python documents a local socket API. It does not turn local return values or
> exceptions into proof of an arbitrary remote application's state.

### P20-02 — Python `selectors` (optional inspection boundary)

- **Source:** [Python 3.14 `selectors` documentation](https://docs.python.org/3.14/library/selectors.html)
- **Use:** optional reading for readiness-versus-completion reasoning only.
- **Allowed claim:** readiness mechanisms tell a program when a registered
  file object may be ready for a selected operation; they do not perform
  semantic message parsing or establish a remote commit.
- **Boundary:** event-loop architecture and production async networking are
  deliberately deferred to Module 21.

### P20-03 — Python `http`/`urllib` documentation (optional client context)

- **Sources:** [HTTP modules](https://docs.python.org/3.14/library/http.html),
  [`urllib.request`](https://docs.python.org/3.14/library/urllib.request.html)
- **Use:** optional API-reading context after the learner has derived framing
  and response/evidence boundaries manually.
- **Boundary:** a high-level client handles protocol mechanics but cannot
  manufacture Atlas idempotency, application decision evidence, or a safe
  retry policy. `http.server` is explicitly not a production-security
  teaching target.

### Python documentation reuse

- **Source:** [Python history and license](https://docs.python.org/3.14/license.html)
- Python software/documentation uses the PSF license; documentation examples,
  recipes, and code are additionally under 0BSD. Link to API docs and use
  original exercises. Retain attribution/license notices if a code example is
  ever reused verbatim.

---

## Internet protocol source atlas

### I20-01 — URI intent versus a literal path

- **Source:** [RFC 3986, §1.2.2](https://www.rfc-editor.org/rfc/rfc3986.html#section-1.2.2)
- **Allowed claim:** a URI identifies a resource and a means of interacting
  with it; dereferencing may involve network lookup and intermediaries.
- **Teaching use:** begin with API intent instead of drawing a URL as a wire
  address.
- **Do not claim:** a URI itself identifies one current machine, a secure
  endpoint, or a durable operation.

### I20-02 — Addresses and ports

- **Sources:** [RFC 8200, §2](https://www.rfc-editor.org/rfc/rfc8200.html#section-2),
  [RFC 4291, §2](https://www.rfc-editor.org/rfc/rfc4291.html#section-2), and
  [RFC 6335, §3](https://www.rfc-editor.org/rfc/rfc6335.html#section-3)
- **Allowed claim:** IP addresses identify interfaces or sets of interfaces;
  transport ports demultiplex transport sessions and, with address/protocol
  data, identify a transport session.
- **Teaching use:** make a compact `name ≠ address ≠ port ≠ authenticated
  service` diagram.
- **Do not claim:** a port number proves one named application/tenant or
  authenticates a peer.

### I20-03 — DNS as distributed cached resolution

- **Sources:** [RFC 1034, §2.4](https://www.rfc-editor.org/rfc/rfc1034.html#section-2.4),
  [RFC 1035, §§2.2 and 4.1](https://www.rfc-editor.org/rfc/rfc1035.html#section-4.1),
  [RFC 9499, §5](https://www.rfc-editor.org/rfc/rfc9499.html#section-5)
- **Allowed claims:** DNS includes a tree of names, resource records, name
  servers, and resolvers; a resolver may use cached information and multiple
  remote queries; a TTL is a maximum cache interval, not a promise that every
  cache retains a result until that instant.
- **Teaching use:** give a resolver trace with two candidate addresses and a
  cached answer. The learner must label it as resolution evidence, not
  reachability or service-identity evidence.
- **Do not claim:** a DNS answer proves a path is live, which endpoint will
  actually accept a connection, or a fixed one-to-one hostname/IP mapping.

### I20-04 — TCP and UDP transport boundaries

- **TCP source:** [RFC 9293, §2.2](https://www.rfc-editor.org/rfc/rfc9293.html#section-2.2),
  with the non-record-marker boundary in
  [§3.9.1.1](https://www.rfc-editor.org/rfc/rfc9293.html#section-3.9.1.1)
- **UDP sources:** [RFC 768](https://www.rfc-editor.org/rfc/rfc768.html) and
  [RFC 8085, §§1 and 3](https://www.rfc-editor.org/rfc/rfc8085.html#section-3)

Allowed claims:

- TCP provides applications a reliable, in-order byte stream; its transport
  mechanisms detect errors/loss and retransmit. This does **not** preserve the
  sender's application message boundaries.
- TCP's PSH flag is not an application record marker and cannot rescue a
  `one recv = one request` design.
- UDP preserves delivered datagram boundaries but does not supply guaranteed
  delivery, ordering, duplicate protection, connection establishment, or
  inherent congestion control for an application.

Teaching boundary:

> A TCP retransmission timer is transport machinery; an Atlas retry can repeat
> an application operation. They are not the same action and cannot be merged
> into one “reliable request” story.

### I20-05 — Real framing example: DNS over TCP

- **Sources:** [RFC 1035, §4.2](https://www.rfc-editor.org/rfc/rfc1035.html#section-4.2)
  and [RFC 7766, §§7–8](https://www.rfc-editor.org/rfc/rfc7766.html#section-8)
- **Allowed claims:** DNS can use UDP or TCP; DNS-over-TCP uses an explicit
  two-octet message length field. A server must not close merely because the
  first read lacks a complete DNS message. Pipelined TCP DNS responses are
  correlated by message identifiers/question data rather than assuming read
  order is a semantic guarantee.
- **Teaching use:** this is the standards-backed precedent for the local
  length-prefixed `FrameDecoder`. The reference model is **not** a DNS parser.
- **Do not teach:** RFC 1035's historical 512-byte UDP wording as a universal
  modern DNS limit; later DNS extensions change that context.

### I20-06 — Acknowledgements, close, and ambiguous absence of a response

- **Sources:** [RFC 9293, §§3.1 and 3.10.7](https://www.rfc-editor.org/rfc/rfc9293.html#section-3.10.7),
  [RFC 9112, §§9.3.1 and 9.5](https://www.rfc-editor.org/rfc/rfc9112.html#section-9.5)
- **Allowed claim:** a TCP acknowledgement describes transport receive-state
  progress, not an application/business acknowledgement. HTTP connections may
  close asynchronously; a peer can close while a request/response interaction
  is ambiguous.
- **Teaching use:** the Atlas evidence ladder explicitly distinguishes local
  write, transport receipt, HTTP response, and server decision record.
- **Do not claim:** a captured ACK proves Atlas parsed a complete request or
  stored a result; lack of a response proves Atlas did nothing.

### I20-07 — HTTP semantics and HTTP/1.1 framing

- **Semantics owner:** [RFC 9110](https://www.rfc-editor.org/rfc/rfc9110.html)
- **HTTP/1.1 syntax/framing owner:** [RFC 9112](https://www.rfc-editor.org/rfc/rfc9112.html)

Allowed claims:

- HTTP supplies request/response semantics shared across HTTP versions;
  major HTTP versions have distinct wire framing.
- Safe methods mean the client did not request state change; incidental side
  effects such as logging can still occur.
- `Content-Type` expresses a media type/processing model, not a proof that an
  Atlas schema/business invariant validated.
- HTTP/1.1 body-length/framing rules are specific to HTTP/1.1. In particular,
  close-delimited response bodies have an ambiguity between complete response
  and network truncation that a protocol must account for.
- Conditional `If-Match`/validator use may protect a representation update
  from lost update; it does not create exactly-once execution.

Teaching boundary:

> Use RFC 9110 for semantics and RFC 9112 only when teaching HTTP/1.1 parsing.
> Never apply HTTP/1.1 chunking or connection assumptions unchanged to HTTP/2
> or HTTP/3.

### I20-08 — Retry, idempotency, and status code boundaries

- **Primary source:** [RFC 9110, §9.2.2](https://www.rfc-editor.org/rfc/rfc9110.html#section-9.2.2)
- **Status sources:** [RFC 9110 §§10.2.3, 15.5.9, 15.6.4, and 15.6.5](https://www.rfc-editor.org/rfc/rfc9110.html#section-15),
  [RFC 6585, §4](https://www.rfc-editor.org/rfc/rfc6585.html#section-4)

Allowed claims:

- HTTP idempotency means the *intended effect* of multiple identical requests
  is the same as one; it does not require identical responses, logs, timing,
  or incidental records.
- A client may retry an idempotent request after a communication failure before
  reading a response. Automatic retry of non-idempotent requests needs a
  separate specific guarantee/design.
- `408` says the server did not receive a complete request in its wait period;
  `503` denotes temporary overload/maintenance and may include `Retry-After`;
  `504` says a gateway/proxy did not receive a timely upstream response; `429`
  signals rate limiting and may include `Retry-After`.

Required stopping lines:

- A `504` does not prove an origin did not commit.
- `Retry-After` suggests timing; it does not promise success.
- HTTP method names alone do not establish a domain's idempotency policy.
- Atlas has a retry budget, response validator, status lookup, and stable
  operation ID because the client must classify knowledge rather than assume
  completion.

### I20-09 — Idempotency-Key current-status boundary

- **Source:** [draft-ietf-httpapi-idempotency-key-header-07](https://datatracker.ietf.org/doc/html/draft-ietf-httpapi-idempotency-key-header-07)
- **Status at research snapshot:** expired Internet-Draft, **not** a published
  RFC or universal final HTTP standard.
- **Teaching use:** Atlas may choose an `Idempotency-Key`-style field as an
  explicit application contract. It must declare scope, canonical payload
  binding, retention/expiry, concurrent-duplicate behaviour, replay result,
  and conflict response for same ID/different digest.
- **Do not claim:** a standard header name by itself creates safe retries or
  any global exactly-once property.

### I20-10 — Structured API errors and forwarding metadata

- **Sources:** [RFC 9457, §§3–4](https://www.rfc-editor.org/rfc/rfc9457.html#section-3),
  [RFC 7239, §8.1](https://www.rfc-editor.org/rfc/rfc7239.html#section-8.1)
- **Allowed claims:** problem details offer a structured HTTP error interface,
  not an internal debugging dump. Forwarding metadata can be modified by a
  client or intermediary and needs a deployment-specific trusted-proxy policy.
- **Teaching use:** Atlas uses stable public problem types and operation IDs,
  never stack traces, private endpoints, or untrusted `Forwarded` data as an
  audit truth.
- **Security boundary:** trust/proxy/authentication design belongs in Module
  22.

### I20-11 — Browser/Fetch optional boundary

- **Source:** [WHATWG Fetch Standard](https://fetch.spec.whatwg.org/)
- **Use:** only when the HTML studio explains a browser-level fetch result.
- **Boundary:** browser “network error” encompasses browser policy and client
  behaviour; it is not a TCP trace or an Atlas server guarantee. Use the live
  standard for authority and label a captured revision only as a dated
  reference.

---

## Source-backed teaching architecture

### Session sequence

1. **A name is not a remote effect.** URI/name → resolver/cache → endpoint
   candidate. Diagnose a log that calls a candidate address “the server.”
2. **Transport carries bytes, not your request.** Compare a TCP byte stream
   with UDP datagrams; reconstruct a length-prefixed frame across arbitrary
   chunks.
3. **A response is evidence with a scope.** Separate local write, TCP receipt,
   response parse, and server-local decision. Classify the timeout incident as
   unknown.
4. **HTTP gives semantics; Atlas still owns policy.** Design a narrow request,
   response/problem, version, and status contract without importing HTTP/1.1
   framing into all HTTP versions.
5. **Retry is an epistemic problem before it is a loop.** Derive stable
   operation ID, canonical digest, server ledger, replay, conflict, deadline,
   and status lookup from the ambiguous completion trace.
6. **Make network knowledge auditable.** Build a compact evidence packet that
   labels observations and names the unresolved boundary.

### Required visual studio views

- **Name → candidate:** drag labels into name/address/port/endpoint/service;
  reveal what a DNS result does and does not establish.
- **Stream → frame:** feed arbitrary chunks into an incremental buffer and
  observe why a frame emits only after its declared body is present.
- **Evidence ladder:** rank local send, TCP ACK, HTTP response, server ledger,
  and status lookup without permitting an unjustified promotion.
- **HTTP contract builder:** select semantics/status/problem/version fields;
  reject a method-name-only idempotency claim.
- **Ambiguous outcome:** compare histories consistent with the same timeout;
  construct a safe same-ID retry and lookup decision.
- **Patch auditor:** label generated claims as contract, observation,
  hypothesis, or unknown; demand a bounded repair and trace.

### Assessment doctrine

Use confidence-aware multiple-choice questions for fast diagnostics, but make
every explanation ask for the exact inference boundary. A correct guess with
low confidence triggers a short contrast trace; a high-confidence wrong answer
triggers a counterexample. The project is judged largely on reading,
architecture, trace reasoning, tests, evidence labelling, and review of an
agent-generated patch—not typing volume.

---

## Runnable-reference contract and reproducibility

The reference model is intentionally local-only. Its pedagogical seams are:

1. a `FrameDecoder` that reassembles bounded length-prefixed frames from
   arbitrary chunks and rejects incomplete/oversized input as a terminal source
   error;
2. one joined sequential `AtlasPublicationServer` path: complete frame → JSON
   parse → typed field set → version/method/target/digest validation →
   single-owner ledger → server response;
3. an `IdempotencyLedger` with exactly three outcomes: first decision,
   identical replay, and same-ID/different-digest conflict. Its get/decision/
   set transition is explicitly single-owner; concurrent ownership is a Module
   19 concern;
4. a client-outcome classifier that calls timeout/connection/malformed-response
   **UNKNOWN** instead of manufacturing a remote rollback; and
5. a deterministic trace/CLI that distinguishes a server-local decision from
   whether the client observed a matching response and records model endpoint,
   framing/fixture digests, test-run status, and limitations without raw data.

The reference must have tests for split/coalesced frames, byte-partition sweep
through the joined admission path, declared-size/terminal behaviour, incomplete
source, typed/version/digest rejection before ledger change, identical retry,
conflict, new-ID distinct operation, timeout ambiguity, matching/nonmatching/
malformed response, and status lookup resolution. It is a finite teaching
model; it does not call the public network, perform TLS, implement HTTP/DNS,
guarantee durability, or claim conformance to a real peer.

Every local evidence record must include:

```text
module/version + Python version
scenario/fixture ID + deterministic inputs
command + complete outcome
evidence label/scope + known limitation
```

---

## Licensing and access ledger

| Source family | Course treatment |
|---|---|
| IETF RFCs | Link and paraphrase. RFC prose/figures are subject to IETF Trust copyright rules; reproduce neither substantial text nor figures. Retain attribution/required notices if a small permitted excerpt is ever used. |
| Internet-Drafts | Link with visible document status/date. They are evolving work items, not final protocol authority. |
| Python documentation / CPython | Link to the versioned docs. Python documentation/examples have PSF/0BSD licensing terms as described above; preserve notices if reused. |
| Stanford/Berkeley/MIT material | Link and paraphrase. Do not redistribute slides, assignments, figures, or solutions. Respect each source's stated license (including Berkeley's CC BY-SA context if reuse is contemplated). |
| WHATWG Fetch | Link and paraphrase under its stated CC BY 4.0/source-code terms; do not confuse a browser API standard with server/network evidence. |

The final learner workbook should use original diagrams and compact source
links beside claims. A citation gives the learner an authority to inspect; it
does not turn a layer-specific fact into a stronger guarantee.
