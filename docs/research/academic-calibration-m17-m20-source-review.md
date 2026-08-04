# Academic calibration — M17–M20 source review

## Scope, method, and truth boundary

This targeted review inspects the actual Atlas workbooks for
[M17 — Computer Architecture and the Execution Stack](../../content/modules/17_computer_architecture_execution_stack.md),
[M18 — Operating Systems and Resource Mediation](../../content/modules/18_operating_systems_resource_mediation.md),
[M19 — Concurrency and Parallelism](../../content/modules/19_concurrency_parallelism.md),
and [M20 — Networks and Application Protocols](../../content/modules/20_networks_application_protocols.md),
along with their existing source maps and stated handoffs. Official university
materials below were accessed on **2026-08-01**.

This compares topic sequence, intellectual habits, and learner evidence. It
does not claim enrollment, contact hours, faculty/peer feedback, grading,
credit, certification, degree status, universal mastery, or equivalence to a
cited institution. It makes no course, portal, release, or source-map change.

## Official calibration corpus

| Institution and official material | Calibration use |
| --- | --- |
| MIT [6.004 Computation Structures](https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/) and [calendar](https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/pages/calendar/) | First-principles order from digital abstraction, combinational/sequential logic, FSMs, performance and ISA through stacks, processor implementation, caches, pipelining, virtual memory, concurrency, and communication. |
| UC Berkeley [CS 61C course notes](https://notes.cs61c.org/) | A modern RISC-V route covering number representation, synchronous digital systems, single-cycle CPU, pipelining, caches, performance programming, and virtual memory. |
| MIT [6.1810 Operating System Engineering schedule](https://pdos.csail.mit.edu/6.S081/2025/schedule.html) and [lock lab](https://pdos.csail.mit.edu/6.S081/2025/labs/lock.html) | System calls, page tables, faults, locking, thread switching, coordination, networking, filesystems, crash recovery, and evidence-led changes to a bounded teaching system. |
| Stanford [CS111 Operating Systems Principles](https://web.stanford.edu/class/cs111/) and [calendar](https://web.stanford.edu/class/cs111/calendar) | Processes, synchronization, paging, filesystems, and crash recovery, with code-reading/implementation assignments as a depth benchmark. |
| UC Berkeley [CS 162 catalog description](https://www2.eecs.berkeley.edu/Courses/CS162/) | Undergraduate systems breadth: processes, synchronization, memory, scheduling, files/I/O, protection, security, and privacy. |
| Carnegie Mellon [15-418/618 Parallel Computer Architecture and Programming](https://www.cs.cmu.edu/~418/) and [schedule](https://www.cs.cmu.edu/~418/schedule.html) | Work distribution, locality, contention, performance measurement, coherence, consistency, synchronization, and hardware/software tradeoffs. It is used to set M19's advanced boundary, not to compress a parallel-computing course into it. |
| Stanford [CS144 Introduction to Computer Networking](https://cs144.github.io/) and [course handout](https://cs144.github.io/logistics.pdf) | Layering, encapsulation, reliable communication, TCP state/byte-stream reasoning, debugging, and staged implementation as a networking benchmark. |
| UC Berkeley [CS 168 textbook](https://textbook.cs168.io/) and Georgia Tech [CS 6250 Computer Networks](https://omscs.gatech.edu/cs-6250-computer-networks) | Internet-stack breadth and the explicit boundary to routing, congestion control, SDN, measurement, and network-security depth. |

The university sources calibrate rigor and pedagogical scope. The existing
Python, CPython, RISC-V, POSIX/platform, and IETF references remain the
authorities for version-specific API, ISA, OS, and protocol claims.

## Material-level result

| Module | Alignment and evidence | Intentional adaptation / remaining boundary |
| --- | --- | --- |
| **M17 — architecture and execution stack** | Its six-session progression covers representation, combinational versus clocked state, ISA-visible state, calls/stacks, pipeline hazards, locality, cache models, and evidence-limited performance analysis. The state traces, cache simulator, prediction-before-reveal work, source/bytecode separation, and architecture dossier match the conceptual chain in MIT 6.004 and Berkeley CS61C. | Atlas deliberately does not ask the learner to build an HDL CPU, study CMOS/logic minimization in depth, implement a compiler, or claim host-cache events from elapsed time. Virtual memory and OS mechanisms are correctly handed to M18; advanced runtime performance is deferred to M24. This is a scoped adaptation, not a missing claim. |
| **M18 — OS resource mediation** | The workbook derives mediation from finite resources, then moves through process lifecycle/scheduling, virtual memory, files/open-resource identity, authority, shutdown, visibility/durability, and recovery. Its executable durable-worker dossier and xv6/Python source-reading boundaries are well aligned in kind with MIT 6.1810, Stanford CS111, and Berkeley CS162. | It substitutes a safe, inspectable Python worker and bounded xv6 reading for a semester-long C kernel project. Program-level interleavings, socket protocols, distributed failure, security design, and CPython internals remain visibly owned by M19–M24. It therefore does not imply kernel-implementation fluency. |
| **M19 — concurrency and parallelism** | The route starts with a sequential specification, then makes histories, ownership, linearizability, locks, conditions, queues, deadlock, execution-model choice, work/span, and evidence review explicit. This matches the conceptual expectations in MIT's locking work, Stanford CS111, and the work-distribution/locality/contention/performance thread in CMU 15-418. The multi-worker dossier asks for a deterministic oracle, adversarial traces, a model choice, and a bounded oral defense rather than a superficial speedup claim. | M19 deliberately stops short of C/C++ atomic programming, cache-coherence protocol design, a complete language memory model, GPU/MPI programming, and large-scale performance experiments. Those are legitimate advanced extensions; Python documentation and the stated POSIX boundary prevent overclaiming their semantics. |
| **M20 — networks and application protocols** | The sequence distinguishes name/address/identity, transport bytes/application frames, client observations/server decisions, HTTP semantics/domain policy, retry/idempotency, and auditable evidence. Its framing state machine, ambiguous-timeout histories, local ledger, code review, and protocol dossier align with the reasoning and debugging pressure of Stanford CS144 while retaining IETF/Python sources for normative claims. | It intentionally does not teach a router, congestion-control algorithm, BGP/SDN, TLS/authentication, or global distributed exactly-once semantics. Stanford CS144, Berkeley CS168, and Georgia Tech CS6250 confirm those as substantial separate depth; M21/M22 own the relevant next boundaries. |

## Connected-system finding

The reviewed arc is a coherent systems chain:

```text
M17 representation and execution layers
  → M18 local resource mediation and durable state
  → M19 overlapping histories and progress/correctness evidence
  → M20 remote uncertainty, framing, and application-protocol knowledge
```

The chain is comparable in intellectual direction to the cited undergraduate
routes while deliberately weighting architecture recovery, code reading,
counterexamples, bounded experiments, and review of agent-generated patches
more heavily than volume of handwritten implementation. Each workbook contains
connected sessions, prediction-before-reveal work, debugging/design review,
diagnostics, a dossier/project, and a supportive oral-defense path.

## Calibration conclusion and lean action

**No genuine core-content gap requiring an M17–M20 authoring change was found
in this review.** The substantial differences from full institutional courses
(HDL/kernel/network-stack construction, multithreaded C atomics, GPU/MPI,
routing/congestion, staff/peer feedback, and graded project volume) are
already explicit scope boundaries rather than silently omitted outcomes.

The only ongoing requirement is release truth: retain those boundaries in
learner-facing handoffs and source ledgers, keep original Atlas diagrams,
traces, prompts, and code, and link/paraphrase rather than reproduce protected
lectures, slides, assignments, figures, lab solutions, or autograders. In
particular, Stanford course material is protected by its stated terms; any
asset-level reuse from MIT, Berkeley, CMU, or Georgia Tech requires a separate
license check.

## 2026-08-03 clarity follow-up

Re-reading the same MIT/Berkeley/CMU/Stanford-calibrated spine led to small
whiteboard cards, not new systems scope. M17 now names the semantic-contract to
machine-claim route, a linear text route through the execution stack, and a
bytecode-versus-hardware evidence check. M18 now makes finite-resource mediation,
the four OS responsibilities, and the owner/transition/claim/evidence distinction
easier to reconstruct. These remain original Atlas explanations with explicit
model/platform limits; they do not claim a kernel lab, host observation, release,
or university-equivalent outcome.
