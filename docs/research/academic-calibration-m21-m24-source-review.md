# Academic calibration — M21–M24 source review

## Scope, method, and truth boundary

This targeted review compares the actual Atlas materials for
[M21 — Async and Distributed Systems](../../content/modules/21_async_distributed_systems.md),
[M22 — Security, Privacy, and Trust Boundaries](../../content/modules/22_security_privacy_trust_boundaries.md),
[M23 — Programming Languages and Interpreters](../../content/modules/23_programming_languages_interpreters.md),
and [M24 — CPython, Performance, and Memory Evidence](../../content/modules/24_cpython_performance_memory.md)
with their source maps, local-reference boundaries, projects, diagnostics,
oral-defense prompts, and forward handoffs.

The official sources below were accessed on **2026-08-01**. They calibrate
scope, prerequisite order, intellectual habits, and learner evidence. This is
not a claim of enrollment, contact hours, staff or peer feedback, grading,
credit, a degree, professional readiness, or equivalence to any institution.
It makes no curriculum, source-map, manifest, route, or release change.

## Official calibration corpus

| Institution and official material | Calibration role |
| --- | --- |
| MIT [6.5840 — Distributed Systems](https://pdos.csail.mit.edu/6.5840/) and [schedule](https://pdos.csail.mit.edu/6.824/schedule.html); CMU [15-440 — Distributed Systems](https://www.cs.cmu.edu/~dga/15-440/F10/) | Fault tolerance, replication, consistency, locking, concurrency, scheduling, imperfect communication, instrumentation, and substantial system-design/debugging work for M21. CMU's page is archival but remains an official course record. |
| Stanford [CS155 — Computer and Network Security](https://cs155.stanford.edu/info.html), UC Berkeley [CS 161 textbook](https://textbook.cs161.org/), and Georgia Tech [CS 6035 — Introduction to Information Security](https://cs6035.omscs.gatech.edu/) | Secure-system principles, access control, cryptography, privacy, web/network security, incident response, and project-based investigation for M22. |
| Stanford [CS242 — Programming Languages](https://web.stanford.edu/class/cs242/coursework.html), CMU [15-312 — Foundations of Programming Languages](https://www.cs.cmu.edu/~fp/courses/15312-f03/), Georgia Tech [CS 8803-O08 — Compilers: Theory and Practice](https://www.omscs.gatech.edu/cs-8803-o08-compilers-theory-and-practice), and UC Berkeley [CS 164 — Programming Languages and Compilers](https://inst.eecs.berkeley.edu/~cs164/) | Formal language description, semantics, environments, types, abstract machines, compiler phases, and substantial implementation work for M23. |
| MIT OCW [6.172 — Performance Engineering of Software Systems](https://ocw.mit.edu/courses/6-172-performance-engineering-of-software-systems-fall-2018/) and UC Berkeley [CS 61C memory-hierarchy notes](https://notes.cs61c.org/content/caches-intro/memory-hierarchy/) | Semantic correctness, controlled performance analysis, caching/locality, profiling, and measurement for M24. |
| Python [3.14 documentation](https://docs.python.org/3.14/) and the version-pinned CPython route recorded in the [M24 source map](../../content/source-maps/module24_cpython_performance_memory_source_map.md) | Owning technical authority for Python/CPython claims. University courses calibrate teaching sequence; they do not replace a versioned API or implementation source. |

## Material-level calibration

| Module | Evidence reviewed and calibration finding | Atlas adaptation and explicit boundary |
| --- | --- | --- |
| **M21 — async and distributed systems** | Sessions move coherently from local task ownership and structured cancellation through admission bounds, retries/operation identity, causal order, and consistency/availability claims. The dossier requires four distinct state machines, same-ID replay/conflict evidence, scenario packets, a partial-order graph, agent-patch review, and oral defense. This builds the reasoning habits behind the MIT/CMU systems routes. | MIT/CMU also require real protocol implementations, replication, long debugging cycles, and staff feedback. Atlas intentionally uses an inspectable local model and never promotes a `TaskGroup`, trace ID, timeout, or passing test into remote durability/agreement. That is an appropriate stated 60-day boundary, not an unacknowledged gap. |
| **M22 — security, privacy, and trust** | The trust map names asset, actor, boundary, protected effect, harm, assumption, and owner; the authority tuple, sink cards, crypto/TLS purpose card, provenance/user-impact review, redacted packets, and oral defense support the secure-design reasoning expected by the cited security courses. | The broader courses add exploit classes, memory safety, web/network protocols, full cryptographic constructions, and VM/target-specific labs. Atlas deliberately excludes live targets, real credentials, exploit construction, and security-assessment claims. Its existing trust-map artifact already supplies the lean threat-model core; a second checklist system would duplicate it. |
| **M23 — programming languages and interpreters** | The six sessions connect grammar/lexing to ASTs, operational meaning, lexical environments/closures, contracts, capability-bounded evaluation, resource budgets, and implementation observations. The dossier asks for a grammar/AST card, semantic trace, earliest-failure matrix, capability scope, `eval` review, redacted evidence, and an M24 question. That coheres with the Stanford/CMU PL spines and the compiler sources' text → syntax → semantic-analysis → runtime progression. | The cited courses extend into formal proofs, polymorphism, continuations, abstract machines, full compiler stages, and much larger implementation work. M23 correctly says it is not a general-purpose service, proof of language safety, or compiler; formal-language/complexity depth belongs to M33 rather than being silently compressed here. No immediate content expansion is justified. |
| **M24 — CPython, performance, and memory evidence** | It begins with semantic invariants, then separates object graphs/lifetime, cyclic collection/resource ownership, allocation and OS-memory lenses, version-pinned source/bytecode observations, and controlled comparison design. The Runtime Evidence Dossier requires a semantic baseline/candidate table, retention map, CPython source card, metric omissions, measurement manifest, AI-patch review, rollback condition, and falsifier. This aligns with MIT 6.172's evidence-before-optimization posture and Berkeley CS61C's distinction between a hardware model and a program-level claim. | MIT 6.172 adds machine-specific profiling, cache work, C projects, and sustained empirical iteration. Atlas correctly refuses invented performance results, but the current core ends with a fixed sample packet rather than a learner-captured measurement. This is the one concrete depth opportunity below. |

## Connected-system finding

```text
M21: incomplete coordination and bounded distributed claims
  → M22: which received claim/identity/authority may cause an effect
  → M23: how a restricted language represents and evaluates a permitted request
  → M24: which runtime or measurement evidence can justify an optimization decision
```

The sequence retains each prior stopping line: a timeout is not a remote fact;
a parse result is not permission; a version-specific bytecode or memory number
is not a language or production guarantee. Prediction-before-reveal work,
diagnostics, projects, oral defenses, and explicit nonclaims make this a
connected code-reading/design/debugging route rather than an API survey. No
contradictory prerequisite or scope claim was found in these workbooks.

## One lean next-revision priority

1. **P1 — offer a bounded optional M24 measurement receipt.** Reuse the
   existing baseline/candidate fixture and manifest vocabulary for one
   learner-run, local-only probe: record interpreter/build, OS, workload ID,
   warm-up/GC choice, repetitions, selected metric, result, and one nonclaim.
   The learner can decline it and use the fixed packet. Do not collect it
   automatically, establish a course benchmark, or create deployment work.

**Follow-through (2026-08-01):** M24 now includes this optional, local-only
receipt and preserves the fixed casebook as an equally valid route. It asks
for a redacted summary only if the learner chooses to discuss it and keeps raw
profiles, paths, payloads, and machine identifiers local.

All other differences from the cited courses—full replication labs, offensive
security work, formal PL proofs/compiler back ends, and hardware/C performance
projects—are deliberate Atlas boundaries, not items to cram into the 60-day
route.

## Reuse, academic integrity, and conclusion

The sources are linked calibration material. Keep Atlas prose, diagrams,
cases, diagnostics, code, and prompts original; do not copy lecture text,
slides, assignments, solutions, starter code, exams, autograders, or staff
workflows without asset-level permission. MIT OCW identifies
[CC BY-NC-SA 4.0](https://ocw.mit.edu/pages/privacy-and-terms-of-use/) for
covered material. Treat other university materials as link-and-paraphrase
sources unless a particular asset grants reuse rights.

This review supports M21–M24 as a rigorous connected accelerated sequence with
one optional empirical deepening. It does not establish university equivalence,
credit, a degree, universal mastery, or a release-complete Atlas product.
