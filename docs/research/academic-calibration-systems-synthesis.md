# Academic calibration — systems and synthesis (M19–M26)

**Scope.** This is a compact curriculum-calibration note for the Atlas module
outlines reviewed on **2026-08-01**. The university pages below were accessed
on **2026-08-01**. They are comparison anchors for conceptual scope and
teaching sequence—not evidence of enrollment, credit, faculty feedback,
assessment integrity, lab equivalence, certification, or a degree.

Atlas deliberately keeps the difficult intellectual work while changing its
mode: learners read traces and designs, predict before reveal, audit
AI-generated changes, state assumptions and limits, and defend evidence in a
constructive conversation. The canonical course graph, rather than this note,
controls availability and release status.

| Atlas module | Official university calibration source(s) | What Atlas aligns with | Deliberate AI-era adaptation | Genuine boundary / action |
| --- | --- | --- | --- | --- |
| **M19 — Concurrency and parallelism** | [MIT 6.1810 Operating System Engineering](https://pdos.csail.mit.edu/6.1810/2025/schedule.html); [CMU 15-440/640 Distributed Systems](https://www.andrew.cmu.edu/course/15-440/) | Coordination, locking, thread switching, scheduling, and the difference between local concurrent work and a system-wide outcome. | A learner reads schedules and ownership diagrams, predicts race/progress outcomes, separates Python runtime behavior from proof, and reviews an agent patch against an invariant. | This is not a kernel/C-atomics or formal-verification course. Keep runtime/version claims explicit; make deeper OS-lab and memory-model work optional rather than implying it was completed. |
| **M20 — Networks and application protocols** | [Stanford CS144 Introduction to Computer Networking](https://web.stanford.edu/class/cs144/) | Layered network reasoning, reliable transport, routing context, and the distinction between protocol mechanisms and application behavior. | Atlas centers byte framing, request identity, retries, unknown outcomes, and a readable evidence ledger instead of treating a successful API call as proof of a remote effect. | It does not construct a full TCP stack, router, or congestion-control implementation. Preserve the M20 → M21/M22 handoff for partial failure and trust/security claims. |
| **M21 — Async and distributed systems** | [CMU 15-440/640 Distributed Systems](https://www.andrew.cmu.edu/course/15-440/) | Resource scarcity, concurrency, naming, imperfect communication, failure, and the design/debugging of distributed systems. | Structured-concurrency traces make ownership, cancellation, backpressure, correlation, and uncertainty inspectable before an agent proposal is trusted. | The core does not substitute for multi-node fault injection, consensus proofs, or production operations. Keep those as explicitly bounded extension work and never infer remote agreement from a local trace. |
| **M22 — Security, privacy, and trust boundaries** | [UC Berkeley CS 161 Computer Security](https://www2.eecs.berkeley.edu/Courses/CS161/index.html) | Cryptography, authentication, access control, OS/network/software security, and defensive programming as connected concerns. | Rather than reward a security-sounding answer, Atlas has the learner follow data into authority, identify a threat boundary, reject unjustified agent capability, and state privacy/evidence limits. | This cannot certify secure code or replace adversarial testing, cryptographic protocol work, or a security review. Retain explicit nonclaims and an optional deeper security route. |
| **M23 — Programming languages and interpreters** | [UC Berkeley CS 164 Programming Languages and Compilers](https://www2.eecs.berkeley.edu/Courses/CS164/) | Scanning, parsing, semantic analysis, runtime organization, interpreters/compilers, and the relationship between a language construct and its meaning. | The small interpreter is a code-reading/design exercise: text becomes an AST, semantics are made explicit, and capabilities stay narrow rather than being hidden behind `eval` or an AI suggestion. | Atlas is not a full compiler, type-systems, or formal-semantics course, and its bounded evaluator is not a security sandbox. Keep those limits visible. |
| **M24 — CPython performance and memory** | [MIT 6.172 Performance Engineering of Software Systems](https://ocw.mit.edu/courses/6-172-performance-engineering-of-software-systems-fall-2018/) | Controlled performance analysis, algorithms, caching, parallelism, and scalable-systems reasoning. | Atlas substitutes CPython-source-aware observation, memory-lens selection, falsifiable experiments, and review of an AI optimization patch for “make it faster” folklore. | MIT's course is C-based; Atlas does not inherit its native-code scope. Results remain tied to the exact CPython/runtime/workload and must not become universal Python claims. |
| **M25 — Evidence-grounded intelligent systems** | [Stanford CS229 Machine Learning](https://cs229.stanford.edu/) | The mathematical and practical ML landscape: supervised/unsupervised learning, learning theory, evaluation, and real-world application. | Atlas begins from the decision boundary: data lineage, calibration, uncertainty, accessibility, human override, and agent authority matter alongside a model score. | Formal ML mathematics, optimization, and substantial model-training depth remain dependent on the advanced M31–M36 chain. Until those prerequisite evidence packs are published, M25 must remain preview/locked—not a completed ML claim. |
| **M26 — Systems capstone and open-source stewardship** | [MIT 6.005 Software Construction](https://ocw.mit.edu/courses/6-005-software-construction-spring-2016/) | Specifications, invariants, testing, concurrency reasoning, and software that remains understandable as it changes. | The capstone asks for an architecture/evidence argument: inspect an agent contribution, prove bounded release claims, record provenance and human impact, and leave a truthful handoff. | A private course cannot supply public maintainer feedback, a production rollout, or operational certification. M26 must remain preview/locked until M27–M36 prerequisite evidence exists; its release evidence must say exactly what was and was not observed. |

## Use and reuse boundary

The linked pages are official university sources used only for comparison and
learner-facing routing. Atlas should link to and paraphrase them; it must not
copy assignments, slides, solutions, recordings, grading material, or visual
assets without a source-specific permission review. Course pages can change,
so module source ledgers—not this calibration note—should retain the claim
link, rationale, access date, and reuse status for any released module.

## Release implication

This calibration supports a coherent progression, not an equivalence claim.
It reinforces the active release boundary: **M25 and M26 are synthesis
material after the advanced M27–M36 evidence chain, not early-navigation
shortcuts.** Any portal, schedule, or handoff that presents them otherwise
should be corrected in the canonical course graph.
