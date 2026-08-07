# Module 20 — Networks and Application Protocols — Source-Audit Addendum

**Audit date:** 2026-07-30  
**Scope:** source ownership, claim linkage, access/reuse decisions, and
release-truth checks for the existing M20 workbook, source map, visual studio,
and bounded reference model. This is an instructor-facing audit record, not
learner-facing textbook copy, a quality approval, or a publication decision.
It is currently an **authoring-only** record: it is not a release-input-policy
artifact or a public learner download. A later structural packet may cite it
only while retaining its non-promotion boundary.

## Verdict

M20 already has a coherent primary-source spine: versioned Python
documentation owns local API claims; IETF RFCs own protocol semantics within
their stated scope; university material supplies an undergraduate teaching
sequence; and the Atlas reference model owns only its deliberately finite
model behavior. Preserve that separation.

The module's central lesson is a source-discipline lesson as much as a
networking lesson: a local `sendall()` result, an observed TCP trace, an HTTP
response, a server-local ledger entry, and a durable distributed fact are
different propositions. They require different evidence. No citation may
promote one of those propositions into another.

Use original Atlas prose, diagrams, synthetic traces, code-reading prompts,
diagnostics, and exercises. Link to outside material and paraphrase it. Do not
copy substantial RFC, Internet-Draft, university, or documentation prose,
figures, slides, labs, assessments, or solutions. This addendum gives a later
structural candidate source/reuse pointers; it does **not** change the
legacy-audit status, human-quality-review state, release evidence, availability,
or publication state of M20.

## Audit basis and access record

The canonical map is
[`module20_networks_protocols_source_map.md`](module20_networks_protocols_source_map.md).
It declares a research snapshot of 2026-07-30 and records the source-level
teaching architecture and licensing ledger. This addendum rechecks the
highest-risk time-sensitive item—the `Idempotency-Key` draft—at the same audit
date and preserves the source map's versioned Python 3.14.6 boundary.

| Audit fact | Evidence | Consequence |
| --- | --- | --- |
| Canonical source-map delivery mirror | `content/source-maps/module20_networks_protocols_source_map.md` and `public/downloads/module20_networks_protocols_source_map.md` had the same SHA-256 at audit: `2975977EC4B10365E77F9269FAA3D5E99389B7EF3DB89FCA9A9597D6F0B79AF2`. | A later release check must repeat the equality check after either file changes; equality does not approve the map's claims. |
| Python runtime/documentation target | The source map and workbook name Python 3.14.6. | Keep any API card version-scoped. A newer docs page, runtime, OS, or socket implementation requires a fresh review. |
| `Idempotency-Key` draft | [draft-ietf-httpapi-idempotency-key-header-07](https://datatracker.ietf.org/doc/html/draft-ietf-httpapi-idempotency-key-header-07) was an **expired Internet-Draft** on 2026-07-30 (its page says it expired 2026-04-18). | Treat it only as work in progress and recheck the Datatracker before every release. It is not a final RFC, a universal header guarantee, or authority for Atlas's application policy. |
| Bounded local model | `public/downloads/module20_reference.py` and `public/downloads/test_module20_reference.py` are tracked learner downloads; rendered-page tests inspect both. | Their behavior is a finite Atlas model/test result. It is not a DNS/TCP/HTTP implementation, public-network result, security claim, or production-service guarantee. |

## Source and reuse ledger

The canonical source map records a 2026-07-30 access snapshot for the linked
material. This addendum rechecked the Python license boundary, the
`Idempotency-Key` draft status, and the visible CS144/CS168 reuse information
on that date; the remaining rows preserve the source map's existing
source-to-claim linkage. “Link and paraphrase” is the default distribution
decision. It does not authorize embedding an external asset merely because the
page is public.

| ID | Owner/source and stable learner-facing link | Claim linkage | Reuse decision |
| --- | --- | --- | --- |
| **P20-01** | Python Software Foundation, [Python 3.14 `socket`](https://docs.python.org/3.14/library/socket.html), [selectors](https://docs.python.org/3.14/library/selectors.html), [HTTP modules](https://docs.python.org/3.14/library/http.html), and [history/license](https://docs.python.org/3.14/license.html) | Sessions 1–3: `getaddrinfo`, `create_connection`, partial `send`, `sendall`, `recv`, timeout, close, and `socketpair` are local API contracts. Optional readiness/client API reading belongs after the byte/frame distinction. | Python software and documentation are under the PSF License Version 2; documentation examples/recipes/code are additionally 0BSD from Python 3.8.6 onward. Link and use original examples by default. If any exact code/documentation asset is reused, retain the applicable notices, record the exact version/asset, and check incorporated third-party notices. |
| **I20-URI** | IETF Trust, [RFC 3986 §1.2.2](https://www.rfc-editor.org/rfc/rfc3986.html#section-1.2.2) | Session 1: a URI identifies an interaction/resource intent; dereferencing can involve lookup/intermediaries. | Link and paraphrase. It does not establish a current machine, secure endpoint, or application decision. |
| **I20-endpoint** | IETF Trust, [RFC 8200 §2](https://www.rfc-editor.org/rfc/rfc8200.html#section-2), [RFC 4291 §2](https://www.rfc-editor.org/rfc/rfc4291.html#section-2), and [RFC 6335 §3](https://www.rfc-editor.org/rfc/rfc6335.html#section-3) | Session 1: distinguish name, address/interface, transport port, endpoint candidate, and authenticated service. | Link and paraphrase. A port or address is not proof of the application/tenant/peer identity. |
| **I20-DNS** | IETF Trust, [RFC 1034 §2.4](https://www.rfc-editor.org/rfc/rfc1034.html#section-2.4), [RFC 1035 §§2.2 and 4.1](https://www.rfc-editor.org/rfc/rfc1035.html#section-4.1), and [RFC 9499 §5](https://www.rfc-editor.org/rfc/rfc9499.html#section-5) | Session 1: resolution, cache, resource-record, and candidate reasoning; a DNS answer is not reachability or service identity evidence. | Link and paraphrase. Use original candidate tables/traces; do not treat a TTL as a promise about every cache or a single name-to-address mapping. |
| **I20-transport** | IETF Trust, [RFC 9293 §2.2](https://www.rfc-editor.org/rfc/rfc9293.html#section-2.2) and [§3.9.1.1](https://www.rfc-editor.org/rfc/rfc9293.html#section-3.9.1.1), [RFC 768](https://www.rfc-editor.org/rfc/rfc768.html), and [RFC 8085 §§1 and 3](https://www.rfc-editor.org/rfc/rfc8085.html#section-3) | Session 2: TCP's ordered reliable byte-stream contract versus UDP's delivered-datagram boundary. | Link and paraphrase. Neither transport fact establishes an Atlas request, parse, authorization, decision, or business commit. The TCP PSH flag is not an application record delimiter. |
| **I20-framing** | IETF Trust, [RFC 1035 §4.2](https://www.rfc-editor.org/rfc/rfc1035.html#section-4.2) and [RFC 7766 §§7–8](https://www.rfc-editor.org/rfc/rfc7766.html#section-8) | Session 2: standards-backed example of explicit length framing and incomplete reads; motivation for the Atlas `FrameDecoder`. | Link and paraphrase. The Atlas decoder is original and is not a DNS parser or a claim of DNS conformance. |
| **I20-ACK-close** | IETF Trust, [RFC 9293 §§3.1 and 3.10.7](https://www.rfc-editor.org/rfc/rfc9293.html#section-3.10.7) and [RFC 9112 §§9.3.1 and 9.5](https://www.rfc-editor.org/rfc/rfc9112.html#section-9.5) | Session 3: transport acknowledgement/close, response ambiguity, and why timeout/close stay `UNKNOWN` without a matching application-level observation. | Link and paraphrase. A trace observation has a named capture point and cannot become proof of a server application's decision. |
| **I20-HTTP** | IETF Trust, [RFC 9110](https://www.rfc-editor.org/rfc/rfc9110.html), [RFC 9112](https://www.rfc-editor.org/rfc/rfc9112.html), [RFC 9457](https://www.rfc-editor.org/rfc/rfc9457.html), [RFC 7239 §8.1](https://www.rfc-editor.org/rfc/rfc7239.html#section-8.1), and [RFC 6585 §4](https://www.rfc-editor.org/rfc/rfc6585.html#section-4) | Sessions 3–5: HTTP semantics/status meaning, version-specific HTTP/1.1 framing, problem details, forwarding metadata, and selected status/retry boundaries. | Link and paraphrase. RFC 9110 semantics do not supply a domain retry policy; RFC 9112 framing must not be silently applied to HTTP/2 or HTTP/3; `Forwarded` is not audit truth without the M22 trust policy. |
| **I20-draft** | IETF Trust/authors, [draft-ietf-httpapi-idempotency-key-header-07](https://datatracker.ietf.org/doc/html/draft-ietf-httpapi-idempotency-key-header-07) | Session 5: a current-work-in-progress design vocabulary for key scope, payload binding, expiry, conflict, and duplicate handling. | **Link-only, work-in-progress.** Do not quote/copy its prose or call it a final standard. Before any learner-facing claim or header naming update, record the then-current Datatracker status and exact revision. |
| **U20-01** | Stanford, [CS144: Introduction to Computer Networking](https://cs144.github.io/) | Whole-module pedagogical sequence: byte stream → TCP components → network interface/router context, supporting an inspectable first-principles arc rather than a framework-first tour. | Link only. The audit page did not show a reusable license notice; do not copy labs, handouts, diagrams, assignments, tests, or solutions. It is a teaching-sequence source, not authority for current API/protocol behavior. |
| **U20-02** | Peyrin Kao / UC Berkeley, [CS 168 textbook](https://textbook.cs168.io/) | Whole-module systems framing: layering, addressing, routing, reliable delivery, DNS/TCP/UDP/HTTP vocabulary, and an integrated incident narrative. | The site displays [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). Atlas still defaults to link/original paraphrase. Any reuse needs attribution, change marking, compatible share-alike handling, and an asset-level check—especially for linked slides/PDFs or third-party material. The site labels the notes beta, so RFCs remain technical authority. |
| **U20-03** | MIT OpenCourseWare, [6.829 Computer Networks](https://ocw.mit.edu/courses/6-829-computer-networks-fall-2002/) | Optional historical reading for layered/end-to-end design intuition. | Link only. It is not a current HTTP/Python specification; inspect the exact asset and OCW/third-party terms before reuse. |
| **W20-01** | WHATWG, [Fetch Standard](https://fetch.spec.whatwg.org/) | Optional browser-client interpretation in the HTML studio. | Link and paraphrase under the source's stated terms; do not use a browser “network error” as a TCP trace, an Atlas server result, or a general endpoint guarantee. |

For RFCs and Internet-Drafts, the current distribution decision is deliberately
conservative: link/paraphrase only. Their copyright notices point to the IETF
Trust legal provisions; code components have separate notice requirements.
No external prose/figure/code component is recorded as imported by this
addendum.

## Six-session claim linkage

This table ties each teaching move to the source class that can actually
support it. It should guide a later packet's source pointers, not substitute
for a human review of the corresponding workbook or studio surface.

| Session | First-principles question | Sources that may support the lesson | Required stopping line / counterexample |
| --- | --- | --- | --- |
| **1 — A name is not a remote effect** | What does a local resolver result establish before a connection or application interaction occurs? | `I20-URI`, `I20-endpoint`, `I20-DNS`, `P20-01`, `U20-01`, `U20-02` | A URI/name/address/port/candidate is not one authenticated, reachable service. A resolver result can coexist with connection failure or a different candidate on retry. |
| **2 — Transport carries bytes, not your request** | When does a byte sequence become one declared application message? | `I20-transport`, `I20-framing`, `P20-01`, `U20-01` | One receive may be partial or contain multiple frames; TCP transport boundaries and an Atlas message boundary are different. The DNS-over-TCP example is not the Atlas protocol. |
| **3 — A response is evidence with a scope** | Which observations distinguish local write, transport progress, response parse, and a server-local decision? | `I20-ACK-close`, `I20-HTTP`, `P20-01`, Atlas reference model | Timeout, close, malformed response, or a packet trace can leave multiple compatible histories. It cannot prove no remote work occurred. |
| **4 — HTTP gives semantics; Atlas still owns policy** | Which meaning comes from HTTP and which must the application declare? | `I20-HTTP`, `I20-draft`, `W20-01` (optional) | HTTP method/status/media-type semantics do not define Atlas digest binding, replay/conflict behavior, retention, authorization, trust, or exactly-once processing. HTTP/1.1 framing is not universal HTTP framing. |
| **5 — Retry is an epistemic problem before it is a loop** | How does a stable operation ID plus canonical request meaning preserve ambiguity rather than hide it? | RFC 9110 within `I20-HTTP`, `I20-draft`, Atlas reference model | The draft can motivate a design but does not mandate Atlas policy. Same-ID/same-digest replay is a server-local Atlas rule, not a distributed exactly-once guarantee. A changed digest must conflict under the stated local model. |
| **6 — Make network knowledge auditable** | How do source labels, trace scope, and a bounded model let a reviewer reject an overclaim? | Source map's evidence ladder and runnable-reference contract; all prior source IDs; `U20-02` for teaching sequence | A passing fixture/test identifies one model result. It cannot establish public-network behavior, endpoint identity, TLS/security, durability, replica state, latency cause, or a learner's mastery. |

## Source-to-claim and evidence hierarchy

| Evidence label | It can establish | It cannot establish by itself |
| --- | --- | --- |
| **Python 3.14 contract** | A documented local API behavior for the named version. | A remote peer's parse, decision, identity, durability, or observation. |
| **IETF standard** | A scoped protocol semantic under the RFC's terminology and version. | Atlas application policy, a particular implementation's behavior, a capture result, or a security guarantee outside its hypotheses. |
| **Internet-Draft** | A dated work-in-progress proposal and vocabulary. | A final standard, stable interoperable behavior, or a release-ready API guarantee. |
| **University reading** | An instructional sequence, terminology, and pedagogical framing. | A current protocol specification, a license for linked assets, or a runtime fact. |
| **Atlas specification** | The declared ID/digest/frame/ledger/response policy of this finite learning model. | Internet-wide exactly-once delivery, consensus, authentication, crash-safe durability, or production interoperability. |
| **Local reference/test result** | Behavior of a named fixture, model version, command, and environment. | A theorem, RFC conformance, public-network observation, performance cause, or real service outcome. |
| **Client/server/trace observation** | Facts visible at the stated observation owner and point. | Facts beyond that point or an unobserved remote effect. |
| **AI proposal** | A candidate incident explanation, source interpretation, patch, diagram, or test to inspect. | Source authority, correctness, provenance, or permission to reuse material. |

## Reuse and provenance controls

1. **Record asset-level facts before reuse.** For every non-original item that
   could be shipped, store owner/author, exact URL, RFC/edition/revision,
   access date, license or legal notice, attribution text, modification status,
   source excerpt/figure/code identity, and distribution decision. A page-level
   license never automatically covers linked third-party slides, assignments,
   solutions, images, or datasets.
2. **Write original teaching assets.** Do not import RFC diagrams, packet
   captures, university slides/labs/solution content, browser-spec prose, or
   Python documentation examples as the default. Atlas's length-frame traces,
   timeout histories, evidence ladder, exercises, quizzes, and visual states
   must remain original and synthetic.
3. **Pin volatile sources.** The `Idempotency-Key` work item is volatile. A
   review must record its exact Datatracker revision/status before the workbook
   links to it as current work; if it later becomes an RFC, update the wording
   and source card instead of retroactively treating this draft as a standard.
4. **Separate evidence ownership in code and diagrams.** A diagram should
   visibly label client observation, server observation, protocol semantics,
   Atlas policy, model result, hypothesis, and `UNKNOWN`. Do not use source
   citations as decorations after the evidence labels have been blurred.
5. **Keep the model bounded.** The downloadable reference must continue to
   avoid public network access, listeners, DNS queries, TLS, packet capture,
   subprocesses, filesystem side effects beyond declared local behavior, and
   arbitrary code. Tests must state their fixture/model limitations.

## Reference-model source truth

### Historical audit observation (2026-07-30)

At the audit snapshot, the learner workbook called
`work/module20_reference.py` its canonical workspace source, but that path was
absent from the tracked revision. The tracked model and paired tests were
already `public/downloads/module20_reference.py` and
`public/downloads/test_module20_reference.py`. This is a preserved historical
finding, not retroactive evidence that the earlier learner command worked.

### Current source-truth repair

The singular canonical checked-in learner model is now
`public/downloads/module20_reference.py`, with
`public/downloads/test_module20_reference.py` as its paired behavioral test.
The portal serves those exact tracked files. The `public/downloads` directory
names the learner delivery route; it is not a generated mirror or a second
source that can drift from an undisclosed `work/` copy. Current learner commands
are written from the repository root and point to those paths explicitly.

This repair corrects source provenance and reproducibility only. It does
**not** change M20's legacy-audit status, human review, accessibility evidence,
availability, release evidence, or publication state.

## Release-truth checks and unresolved provenance

The following are necessary checks for a later M20 structural candidate or
release review. None is satisfied merely by this document existing.

| Check | Current audit observation | Required action before an approval claim |
| --- | --- | --- |
| **Reference-model canonical source** | **Historical observation (2026-07-30):** the workbook named absent `work/module20_reference.py` as canonical. **Current repair:** `public/downloads/module20_reference.py` and its paired test are the singular tracked learner source, and workbook commands now name that repository-root path. | At any later approval review, record the reviewed commit, model/test hashes, test command/environment/result, and the finite-model limitation. This repair is not source review, human approval, release evidence, or publication. |
| **External source freshness** | Python is version-scoped and the `Idempotency-Key` draft is expired. University pages and WHATWG are living material. | Recheck direct URLs, exact versions/editions, draft/RFC status, and license notices at release time. Update source cards and learner wording when they change. |
| **Claim linkage in visible surfaces** | The source map has strong source-family linkage; a structural pointer alone cannot prove every workbook/studio sentence preserves it. | Review every learner-visible source-backed assertion against its source ID and stopping line; test for labels/links, not just headings. |
| **License/reuse verification** | This audit authorizes no external asset import. The workbook says diagrams/traces/code/exercises are original, but that needs release review. | Inventory repository assets and verify that any non-original asset has an asset-level card and notices. Retain the link-only default for uncertain material. |
| **Human quality/accessibility review** | The legacy audit still has ambiguous evidence for rigor bundle, visual text alternatives, diagnostic misconception map, and supportive oral protocol. | Keep those audit states unchanged until a qualified review checks the actual learner experience and records evidence. |
| **Model boundary** | The rendered test asserts that the downloaded reference does not import common networking clients; that is useful but not a full safety/provenance certification. | Run the declared reference tests, inspect dependency/import/process/network boundaries, record the command/environment/output, and label the result as a finite model test. |

## Minimum reviewer evidence packet

Before a future release changes M20's truth state, the reviewer should be able
to read one compact packet containing:

```text
reviewed Git commit and deployed version
canonical source-map hash and public-download hash
source cards with exact URLs/revisions/access dates/reuse decisions
current Python docs version and current Idempotency-Key/RFC status
workbook/studio claim-to-source sampling, including at least one stopping line per session
reference-model canonical path, delivered-file hash, test command, environment, result, and limitation
asset/reuse inventory with any required attribution/notices
human review findings for source quality, accessibility, and learner-facing clarity
known limits, unresolved discrepancies, owner, and next review date
```

## Evidence language to carry into M21–M24

- **Protocol standard:** a statement about the named specification's scoped
  semantics, not a record of this system's history.
- **Python API contract:** a statement about the named public API/version, not
  evidence of the peer application's state.
- **Atlas policy/model:** a declared local teaching rule, not a distributed or
  security guarantee.
- **Trace observation:** a fact at a stated collection point, not all facts at
  every layer.
- **Finite experiment:** this fixture/environment/result, not a claim about
  every OS, library, network, or workload.
- **AI proposal:** a useful candidate to inspect against the source boundary,
  counterexample, and model—not an authority.

This language is M20's explicit handoff: M21 must reason about async and
distributed coordination; M22 must establish trust/security boundaries; and
M24 must establish implementation/performance attribution. M20 should leave
those claims visibly unresolved rather than borrowing their authority from a
socket call, RFC citation, or passing local test.

## 2026-08-03 structural clarity follow-up

The current canonical audit now maps M20's operation-ID rigor card, linear
visual text route, and adaptive oral-defense protocol as **pointer-present**.
They clarify the existing server-local model without adding an external source,
changing a reuse decision, or claiming response delivery, human review,
learner evidence, release, or publication.
