# Module 21 - Async and Distributed Systems - Source-Audit Addendum

**Audit date:** 2026-07-30  
**Scope:** source ownership, claim linkage, access and reuse decisions,
bounded-model limits, and release-truth checks for the existing Module 21
workbook, visual studio, source map, and reference downloads.

This is an instructor-facing audit record, not learner-facing textbook copy, a
human-quality approval, release evidence, or a publication decision. It is an
**authoring-only** record, not a public learner download or release-evidence-policy artifact.
The canonical source map remains the learner-facing source artifact; this
addendum is not a learner-facing source artifact or a replacement for that
delivery. A non-promoting packet may hash this addendum internally without
public delivery, approval, or publication. That mechanical inclusion may make
the file a hashable internal release input, but it is not a learner delivery,
quality approval, release-evidence claim, or publication. This addendum does **not** change
the M21 legacy-audit status, human-review status, availability, route position,
release evidence, or publication state.

## Verdict

M21 has a sound source spine only when the reader keeps the evidence owners
separate:

- Python 3.14.6 documentation owns narrowly scoped local asyncio, queue,
  stream, context, and debugging behavior;
- PEP 654 owns the historical/design context for grouped concurrent failures,
  while current Python documentation owns current runtime behavior;
- IETF and W3C material owns specified protocol or correlation vocabulary, not
  Atlas application policy or a record of what a remote service did;
- original research papers own their stated distributed-systems models and
  assumptions, not simplified slogans or vendor guarantees;
- MIT and Brown course pages support sequence and optional further study, not
  API/protocol authority or permission to copy teaching assets; and
- the Atlas reference model owns only the behavior of its named finite,
  deterministic fixtures.

The module's central discipline is to distinguish local scheduling, local
queue accounting, a declared remote observation, a matching response, a
correlation field, an evidence-limited model result, and an unobserved or
unknown history. A task exit, timeout, drain, trace ID, or one replica
observation does not collapse those categories.

Use original Atlas explanations, diagrams, traces, diagnostics, exercises, and
code examples. Link to and paraphrase external material. Do not copy
substantial documentation prose, standards text, paper proofs or figures,
university slides, labs, assignments, tests, recordings, or solutions.

## Audit basis and access record

The canonical map is
[module21_async_distributed_source_map.md](module21_async_distributed_source_map.md).
It records a 2026-07-30 research snapshot, targets Python 3.14.6, and holds
the detailed source-to-session architecture. The public delivery mirror is
public/downloads/module21_async_distributed_source_map.md. At this audit, both
maps had SHA-256
ea16503c78bf4cee8d1c71c5a1eabcccff6c1638480b58e9e218e2a7c12e807c.
Hash equality is an identity check, not approval of claims, licenses, learner
experience, or release state.

| Audit fact | Evidence checked on 2026-07-30 | Consequence |
| --- | --- | --- |
| Python runtime boundary | The map names Python 3.14.6; official docs are versioned at the Python 3.14 route. | Keep every public API claim version-scoped. Do not promote a CPython, OS, scheduler, or remote-service observation to a Python-language contract. |
| Protocol and tracing boundary | RFC 5531 has been updated by RFC 9289; RFC 9110 section 9.2.2 defines intended-effect idempotence; Trace Context and OpenTelemetry define correlation vocabulary. | State the exact standard/version and retain its stopping line. Neither a standard nor a correlation header supplies Atlas policy, trust, delivery, or global-effect evidence. |
| Theory boundary | Lamport, Chandra-Toueg, Herlihy-Wing, Gilbert-Lynch, and FLP give named models with hypotheses. | Name the model and assumptions before using a conclusion. Do not turn a paper title into a general product claim. |
| Bounded local model | The downloadable Module 21 reference and test files use synthetic, finite Atlas cases. | A fixture result is a local teaching-model result, not real RPC, scheduler, consensus, durability, performance, or learner-mastery evidence. |

## Source and reuse ledger

Each URL below is a stable learner-facing link to a source that a reader can
inspect. The distribution decision for this project remains link and
paraphrase unless an asset-level review records a narrower approved reuse.
Public access alone is not reuse permission.

| ID | Owner/source and stable learner-facing link | Claim linkage | Access, status, and reuse decision |
| --- | --- | --- | --- |
| **P21-01** | Python Software Foundation, [asyncio tasks](https://docs.python.org/3.14/library/asyncio-task.html) | Sessions 1, 2, and 4: coroutine versus scheduled task, TaskGroup ownership, cancellation delivery, timeout, wait, and shield distinctions. | Python 3.14 docs; PSF License Version 2, with the documentation-code grant described on the [license page](https://docs.python.org/3.14/license.html). Link/paraphrase and use original examples by default. Local task semantics do not show a remote effect or rollback. |
| **P21-02** | Python Software Foundation, [asyncio queues](https://docs.python.org/3.14/library/asyncio-queue.html) | Session 3: bounded in-process admission, local put blocking, task_done, join, and shutdown accounting. | Python 3.14 docs; same PSF/0BSD boundary. Link/paraphrase. Queue capacity and accounting are not broker acceptance, remote durability, global backpressure, or completed downstream work. |
| **P21-03** | Python Software Foundation, [asyncio streams](https://docs.python.org/3.14/library/asyncio-stream.html) | Session 3: partial reads, readexactly failure, local write buffers, drain, close, and wait_closed. | Python 3.14 docs; same PSF/0BSD boundary. Link/paraphrase. Drain is local write-buffer flow control, not peer receipt, parse, validation, commit, or durability. |
| **P21-04** | Python Software Foundation, [asyncio synchronization primitives](https://docs.python.org/3.14/library/asyncio-sync.html) and [asyncio development guidance](https://docs.python.org/3.14/library/asyncio-dev.html) | Session 3: local primitive scope, event-loop/thread boundary, and debugging boundary. | Python 3.14 docs; same PSF/0BSD boundary. Link/paraphrase. Async primitives are not cross-thread or distributed locks, and debug signals are observations rather than a proof of every history. |
| **P21-05** | Python Software Foundation, [contextvars](https://docs.python.org/3.14/library/contextvars.html) | Sessions 1 and 5: context-local state and local observability. | Python 3.14 docs; same PSF/0BSD boundary. Link/paraphrase. Context propagation is not authorization, a complete audit record, a causal proof, or a distributed trace format. |
| **P21-06** | Python Enhancement Proposals, [PEP 654](https://peps.python.org/pep-0654/) | Session 2: ExceptionGroup and structured-concurrency rationale/history. | Final Standards Track PEP for Python 3.11; text states public domain or CC0-1.0, whichever is more permissive. Link/paraphrase and name status/version. Use current docs for current API behavior. |
| **D21-01** | IETF, [RFC 5531](https://www.rfc-editor.org/rfc/rfc5531.html), its [current record](https://www.rfc-editor.org/info/rfc5531/), and [RFC 9289](https://www.rfc-editor.org/rfc/rfc9289.html) | Session 4: remote-call versus local-call distinction, retry/duplicate policy, and ONC RPC as a scoped historical/current case. | RFC 5531 is updated by RFC 9289. Link/paraphrase under IETF Trust terms; inspect exact notices before reusing a code component. This is not a universal RPC, encryption, identity, or retry-policy guarantee. |
| **D21-02** | IETF, [RFC 9110 section 9.2.2](https://www.rfc-editor.org/rfc/rfc9110.html#section-9.2.2) | Session 4: intended-effect idempotence and why repeated request observation does not equal exactly-once. | Link/paraphrase under IETF Trust terms. HTTP idempotence does not choose Atlas identity, digest, retention, authorization, duplicate-observation, or replay policy. |
| **D21-03** | Leslie Lamport, [Time, Clocks, and the Ordering of Events in a Distributed System](https://www.microsoft.com/en-us/research/publication/time-clocks-ordering-events-distributed-system/) | Session 5: happens-before as a causal partial order. | Primary research publication; link/paraphrase only. Do not copy figures, proof text, or substantial prose. A timestamp or trace ID alone does not establish every causal relation. |
| **D21-04** | Chandra and Toueg, [Unreliable Failure Detectors for Reliable Distributed Systems](https://ecommons.cornell.edu/entities/publication/7948ff49-7263-49f8-a29b-d062e7cbb240) | Session 6: failure-detector accuracy and completeness assumptions. | Primary research record; link/paraphrase only and recheck the displayed rights notice for an exact asset. Suspicion or timeout is not a proven crash. |
| **D21-05** | Herlihy and Wing, [Linearizability: A Correctness Condition for Concurrent Objects](https://www.cs.cmu.edu/~wing/publications/HerlihyWing90.pdf) | Session 6: linearizability as a named, strong operation contract. | Primary paper access; link/paraphrase only. Do not copy proof/figure/text. One replica observation or one fixture cannot establish linearizability. |
| **D21-06** | Gilbert and Lynch, [Brewer's Conjecture and the Feasibility of Consistent, Available, Partition-Tolerant Web Services](https://groups.csail.mit.edu/tds/papers/Gilbert/Brewer2.pdf) | Session 6: CAP as an assumption-sensitive safety/liveness boundary. | Primary technical-paper access; link/paraphrase only. Do not teach “pick two” or use it to infer a product property without the stated model. |
| **D21-07** | Fischer, Lynch, and Paterson, [Impossibility of Distributed Consensus with One Faulty Process](https://groups.csail.mit.edu/tds/papers/Lynch/jacm85.pdf) | Session 6: consensus preview and why exact assumptions matter. | Primary paper access; link/paraphrase only. It is not an implementation guide, performance prediction, or claim that every retrying program is impossible. |
| **D21-08** | W3C, [Trace Context Recommendation, 2021-11-23](https://www.w3.org/TR/2021/REC-trace-context-1-20211123/) | Session 5: traceparent/tracestate correlation vocabulary. | Frozen Recommendation; its page points to the 2015 W3C Software and Document License. Link/paraphrase. Do not claim correlation establishes authenticity, completeness, delivery, or causality. |
| **D21-09** | OpenTelemetry, [Trace API specification](https://opentelemetry.io/docs/specs/otel/trace/api/) and [versioned-source license](https://raw.githubusercontent.com/open-telemetry/opentelemetry-specification/main/LICENSE) | Session 5: SpanContext and trace-observation vocabulary. | Living specification, observed as 1.59.0; repository license is Apache-2.0. Link/paraphrase and pin a tag or commit before any exact field-level reuse. A span is not business truth or a complete audit trail. |
| **U21-01/U21-02** | [MIT 6.5840](https://pdos.csail.mit.edu/6.5840/) and [Brown Distributed Systems](https://cs.brown.edu/courses/csci1380/) | Whole-module sequence and optional route from RPC/partial failure to replication and storage. | Public university course pages; link only. Do not redistribute slides, labs, assignments, tests, recordings, solutions, or grading material. They are not authority for Python/protocol contracts. |
| **A21-model** | Atlas files public/downloads/module21_reference.py and public/downloads/test_module21_reference.py | Sessions 1-6: synthetic task ownership, pressure, retry, unknown history, causality, and replica-claim cases. | Original course artifact. Treat every result as a finite named fixture/model outcome, with no external network, peer, durable store, or global distributed-system inference. |

## Six-session claim linkage

This is a structural authoring aid, not a human review of the workbook, studio,
or diagnostic quality. Every session must preserve its stopping line when a
later packet maps visible claims to these sources.

| Session | First-principles question | Source linkage | Mandatory stopping line |
| --- | --- | --- | --- |
| **1 - await releases control; it does not transfer responsibility** | Who owns a coroutine, a scheduled task, and the evidence of local completion? | P21-01, P21-05, A21-model | A local scheduled task or context value is not a request sent, accepted, or effected by a remote service. |
| **2 - structured lifetime gives a boundary, not magic rollback** | Which local owner waits, cancels, cleans up, and reports grouped failure? | P21-01, P21-06, A21-model | TaskGroup exit, cancellation, timeout, or ExceptionGroup is a local scope result; it does not prove a remote rollback or cancellation. |
| **3 - bounded admission makes overload a policy decision** | Which capacity, owner, acknowledgement, and buffer boundary are actually local? | P21-02, P21-03, P21-04, A21-model | A semaphore, queue, join, stream buffer, or drain result is not a remote-capacity, broker, peer-parse, or durability claim. |
| **4 - partial failure is an evidence problem before it is retry code** | Which histories remain compatible with one local timeout or missing reply? | P21-01, D21-01, D21-02, A21-model | A stable ID/digest is an Atlas teaching policy; a timeout cannot prove no remote effect, and idempotence cannot become universal exactly-once. |
| **5 - time is a local instrument; order is a declared relation** | What causal edge is actually known, and what is merely timestamp or trace correlation? | P21-05, D21-03, D21-08, D21-09, A21-model | A shared trace field, wall-clock order, or one observation point does not prove causality, trust, completeness, or delivery. |
| **6 - consistency and availability are choices with assumptions** | Which named contract could a replica observation support, under which model? | D21-04, D21-05, D21-06, D21-07, U21-01, U21-02, A21-model | One node applied, a synthetic collection cut, or a test pass is not consensus, linearizability, durability, availability, or global agreement. |

## Preserved audit ambiguities and non-claims

The existing legacy audit must retain all six unresolved statuses below. A
heading, pointer, existing interactive surface, or this source record can make
review easier; it cannot substitute for qualified review of learner-facing
work, outcomes, and accessibility.

| Legacy criterion | Status that remains | Why this addendum cannot promote it |
| --- | --- | --- |
| **rigor bundle**: definitions, assumptions, derivations, proof ideas, counterexamples, and numerical experiments | **ambiguous** | Source linkage does not establish that the required rigor was accurately selected, presented, or reviewed in the learner experience. |
| **code-reading/debugging/design** | **ambiguous** | Named code-reading labs and a bounded model are pointers, not qualified evidence that debugging and architectural-design work are adequate. |
| **prediction before reveal** | **ambiguous** | Visible prompts are not evidence that the interaction consistently captures a learner prediction before explanation or reveal. |
| **transfer task** | **ambiguous** | A dossier/project heading does not prove a reviewed transfer task with a valid acceptance/evidence rubric. |
| **confidence diagnostic/misconceptions** | **ambiguous** | A diagnostic surface is not a verified confidence workflow, explanation set, or misconception map. |
| **supportive oral defense** | **ambiguous** | The global oral guidance and M21 prompts do not verify a module-specific, psychologically safe, adaptive oral-defense protocol. |

M21's prerequisite/forward map, six-session pointers, source-map pointer,
visual/text-equivalent pointer, retrieval pointer, project pointer, TA prompt,
Study Partner prompt, and forward handoff remain structural pointers where the
legacy audit already records them as present. This addendum neither changes
those pointer records nor upgrades any of the six ambiguous criteria.

## Evidence language and bounded-model controls

| Evidence label | It can establish | It cannot establish by itself |
| --- | --- | --- |
| Python 3.14 documented API | The named version's documented local API behavior. | A remote peer's effect, scheduler fairness, application invariant, performance result, or behavior of another implementation/build. |
| PEP, RFC, W3C, or OTel specification | Scoped vocabulary/semantics for the named version or document. | Atlas policy, a capture result, security/trust, real deployment behavior, or a universal distributed guarantee. |
| Research model | A conclusion under its explicit model and assumptions. | A statement about an unmodelled deployment, provider, retry policy, protocol, or replica implementation. |
| Atlas reference/test result | The named finite fixture's local behavior under its recorded environment. | Real network/RPC behavior, remote admission/effect, durable state, consensus, exactly-once, performance, or learner mastery. |
| Trace, timestamp, or correlation field | A declared observation at its stated point. | Complete causal history, source identity, authorization, delivery, application decision, or replicated agreement. |
| AI proposal | A candidate trace, patch, explanation, test, or design to inspect. | Source authority, correctness, provenance, permission to reuse, or sufficient evidence for a broader claim. |

The reference model must remain bounded: no actual endpoint, DNS lookup,
socket/HTTP client, listener, broker, subprocess, external peer, or hidden
durable effect is represented as an exercised runtime fact. Its local
fixtures may demonstrate same-ID/same-digest replay, conflicting digest,
partial collection cut, local timeout/reconciliation state, local admission
limits, cancellation after a model decision, unknown mismatched response,
causal incomparability, one-replica insufficiency, incomplete local frame, and
TaskGroup ownership. Those are useful counterexamples and review objects, not
proofs about a production distributed system.

## Release-truth checks and unresolved provenance

None of the following checks becomes satisfied merely because this addendum
exists or its hash is recorded.

| Check | Current audit observation | Required action before an approval or release claim |
| --- | --- | --- |
| Source freshness | Python, RFC status, W3C/Otel specifications, university pages, and source rights can change. | Recheck direct URLs, versions/revisions, publication status, access dates, and reuse notices at review time. |
| Canonical/public map identity | The canonical map and its public download matched at the audit hash above. | Repeat deterministic copy/hash verification after either file changes; retain the reviewed commit. |
| Learner-visible claim linkage | The source map has a detailed architecture, but a source pointer does not prove every workbook/studio sentence retains the correct source class and stopping line. | Sample and review visible claims, diagrams, prompts, and links session by session. |
| Asset and reuse inventory | This document approves no non-original external asset import. | Record owner, exact URL/version, access date, license/notice, attribution, modification, distribution decision, and reviewer for every shipped non-original asset. |
| Bounded reference model | The downloadable model/tests are useful teaching artifacts with deliberately limited scope. | Run the declared tests, inspect execution/import/effect boundaries, record command/environment/result, and preserve the finite-model limitation in the release ledger. |
| Human quality and accessibility review | The six audit ambiguities above remain unresolved. | Keep their statuses unchanged until a qualified review records learner-facing evidence, including visual/text alternatives and oral interaction quality. |
| Provenance chain | A file path or hash alone does not prove delivery or reviewability. | Bind the reviewed Git commit, source ref, deployed private version, CI run, changelog, known limitations, and reviewer evidence without changing publication state by implication. |

## Evidence language to carry into M22-M24

- Local scheduling is not remote effect; local cancellation is not remote
  rollback.
- Queue accounting and stream flow control are local facts until a separately
  specified boundary provides additional evidence.
- A retry, reply, trace, or timestamp must name its observation owner and
  remaining compatible histories.
- A replica claim must name its contract and assumptions; a one-node
  observation is not a distributed agreement claim.
- Security, identity, confidentiality, authorization, untrusted input, and
  trace trust are M22 questions, not claims borrowed from an async API.
- CPython internals, OS event-loop mechanics, performance attribution, and
  benchmark conclusions are M24 questions, not claims borrowed from a finite
  model or an observed local run.

M21 should therefore hand M22 a precise uncertainty boundary and hand later
systems work an evidence discipline. It should not fill those open questions
with a source citation, a passing synthetic test, an AI-generated patch, or a
claim that a local await became a distributed guarantee.

## 2026-08-03 structural clarity follow-up

The current canonical audit now maps M21's timeout-indistinguishability rigor
card as **pointer-present**. It explains a bounded local evidence argument;
it does not introduce a distributed service, add source/reuse approval, or
establish human review, learner mastery, release, or publication.
