# M17–M20 official-source review

**Scope.** This is a focused calibration of the existing Arc IV workbooks,
not a content rewrite. The official pages below were checked on
**2026-08-01**. They calibrate sequence, conceptual rigor, and the kind of
evidence a learner should produce; they do **not** establish enrollment,
contact hours, staff feedback, grading, credit, a degree, or durable mastery.

University courses are not the authority for version-specific technical
claims. The workbooks' RISC-V, Python/CPython, POSIX/platform, and IETF
sources remain the authorities for those claims.

## Official calibration spine

| Official public calibration source | What it checks in this review |
| --- | --- |
| [MIT 6.004 Computation Structures](https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/) | The first-principles architecture spine: digital abstraction, combinational and sequential logic, ISA/assembly, procedures and stacks, processor design, caches, pipelining, virtual memory, synchronization, and communication. |
| [UC Berkeley CS 61C](https://cs61c.org/) | A current machine-structures route through number representation, RISC-V, calling conventions, datapaths, pipelining, caches, performance, and virtual memory. |
| [Carnegie Mellon 15-213/15-503](https://www.cs.cmu.edu/~213/) | The systems-programmer continuity check across machine code, performance, memory organization, networking technology/protocols, and supporting concurrent computation. |
| [MIT 6.1810 Operating System Engineering](https://pdos.csail.mit.edu/6.1810/2025/overview.html) | Mechanism reading for system calls, virtual memory, files, threads, context switches, kernels, interrupts, IPC, and the bounded xv6 teaching system. |
| [Stanford CS111 Operating Systems Principles](https://web.stanford.edu/class/cs111/) | The sequence from processes and dispatch through synchronization, scheduling, virtual memory, filesystems, and crash recovery. |
| [UC Berkeley CS 162](https://cs162.org/) | Undergraduate systems breadth: protection, processes/I/O, threads, synchronization, scheduling, virtual memory, and systems programming. |
| [Carnegie Mellon 15-418/15-618](https://www.cs.cmu.edu/~418/) | The advanced parallel-performance boundary: machine characteristics, work distribution, locality, contention, and hardware/software tradeoffs. |
| [Stanford CS144 Introduction to Computer Networking](https://cs144.github.io/) | A staged implementation route from byte streams through TCP and network interfaces, useful for calibrating framing, state, and debugging pressure. |
| [UC Berkeley CS 168 textbook](https://textbook.cs168.io/) | The connected Internet-systems map: layers, routing, transport/TCP, congestion, DNS, HTTP, TLS, and end-to-end design. |
| [Georgia Tech CS 6250 Computer Networks](https://omscs.gatech.edu/cs-6250-computer-networks) | A breadth/depth boundary for the Internet stack, routing, SDN, BGP, measurement, and network-security-adjacent work. |

## Existing Atlas sessions and evidence

| Existing Atlas sessions and evidence | Official scope calibration | Judgment and intentional boundary |
| --- | --- | --- |
| **M17 — Computer Architecture and the Execution Stack.** The six-session path is: **S1** *Make bits earn their meaning*; **S2** *Derive remembered state from current-input logic*; **S3** *Read instructions as state transitions*; **S4** *Explain overlap and locality without promising hardware*; **S5** *Bridge Python to the machine one owned layer at a time*; **S6** *Review the incident and defend a bounded claim*. Evidence includes representation/state traces, a datapath annotation and six-instruction trace, a small declared cache simulation, source/bytecode layer separation, a recorded measurement protocol, and the **Atlas architecture and performance evidence dossier**. | MIT 6.004 supplies the connected logic → state → ISA → procedures → datapath → caches/pipeline sequence. Berkeley CS61C adds a current RISC-V, calling-convention, datapath, pipeline, and cache context. CMU 15-213 checks the programmer-facing connection between machine code, memory organization, performance, and later systems work. | **Aligned, adapted.** Atlas deliberately uses inspectable state and cache models, code reading, and evidence-limited performance claims instead of an HDL CPU, a C/assembly implementation sequence, or a claim about the learner's physical cache. CMOS/logic minimization, full processor construction, compiler implementation, host-counter attribution, and deep runtime performance are deferred; virtual-memory mechanism becomes M18's responsibility. |
| **M18 — Operating Systems and Resource Mediation.** The path is: **S1** *Why a mediator exists*; **S2** *Program, process, lifecycle, and scheduling*; **S3** *Virtual memory and fault classification*; **S4** *Names, open resources, caches, and authority*; **S5** *Shutdown as a fallible protocol*; **S6** *Publication, recovery, and evidence defense*. Evidence includes lifecycle and owner traces, a declared page/fault model, open-resource/authority analysis, interruption classifications, a safe durable-worker reference, and the **Atlas durable-worker evidence dossier**. | MIT 6.1810 provides the closest mechanism-reading standard: controlled kernel mediation, system calls, page tables, files, context switches, coordination, and xv6-sized implementation evidence. Stanford CS111 checks the ordering of processes/scheduling, VM/paging, filesystems, and crash recovery. Berkeley CS162 checks the broader protection, I/O, threads, synchronization, scheduling, and VM context; CMU 15-213 supplies the systems-programmer bridge. | **Aligned, adapted.** A bounded, inspectable Python worker and selected xv6 reading substitute for a semester-long C kernel project. The module does not imply kernel implementation fluency, portable OS behavior beyond named authorities, or that a model trace is a host observation. Fine-grained interleavings move to M19; remote/distributed failure and network protocols move to M20–M21; security design remains a later responsibility. |
| **M19 — Concurrency and Parallelism.** The path is: **S1** *A second worker creates histories*; **S2** *Protect one logical transition*; **S3** *Predicates, permits, and item ownership*; **S4** *Progress can fail*; **S5** *Choose the Python execution model from first principles*; **S6** *Atlas multi-worker evidence defense*. Evidence includes a sequential oracle, adversarial interleaving traces, a lock/linearization analysis, a condition/semaphore/queue ownership table, a wait-for cycle detector, workload/model decision records, and the **Atlas multi-worker correctness dossier** with a constructive oral defense. | Stanford CS111 and Berkeley CS162 calibrate locks, conditions, deadlock, scheduling, and synchronization. MIT 6.1810 supplies a small-system locking/code-reading benchmark. CMU 15-213 checks the systems and concurrent-computation continuity; CMU 15-418/618 establishes the higher parallel-performance standard involving machine characteristics and software/hardware tradeoffs. | **Aligned, adapted.** Atlas makes sequential meaning, histories, ownership, safety, conditional liveness, and evidence explicit before any speed claim. It uses finite models and Python-scoped runtime reading rather than claiming C/C++ atomic semantics or cache-coherence behavior. Full language memory models, lock-free algorithms, GPU/MPI programming, coherence protocol design, and large-scale performance experiments are intentional advanced extensions—not evidence missing from the core. |
| **M20 — Networks and Application Protocols.** The path is: **S1** *A name is not a remote effect*; **S2** *Transport carries bytes, not your request*; **S3** *A response is evidence with a scope*; **S4** *HTTP gives semantics; Atlas still owns policy*; **S5** *Retry is an epistemic problem before it is a loop*; **S6** *Make network knowledge auditable*. Evidence includes an endpoint-attempt map, byte/frame traces from a small incremental decoder, compatible timeout histories, a server-local idempotency ledger, local model tests, and the **Atlas network/protocol evidence dossier** with oral defense. | Stanford CS144's byte-stream → TCP route calibrates the pressure behind explicit framing, state, and debugging. Berkeley CS168 supplies the connected Internet vocabulary for layering, addressing, transport, DNS, HTTP, reliability, and congestion. CMU 15-213 confirms networking/protocols as part of the systems continuum. Georgia Tech CS6250 is used chiefly as a boundary check: routing, SDN, BGP, measurement, and network-security breadth are substantial further work. | **Aligned, adapted.** Atlas uses original, small client/server models to reason about what a local client can and cannot know; IETF and Python sources, not university course pages, govern technical protocol/API claims. It does not teach router construction, TCP congestion-control algorithms, BGP/SDN, TLS/authentication, production network measurement, or global exactly-once semantics. Those omissions are explicit scope boundaries, not hidden claims. |

## Connected finding

The four modules form one systems argument rather than four topic lists:

```text
M17 representation and execution layers
  → M18 local resource mediation and durable publication
  → M19 overlapping histories, synchronization, and model choice
  → M20 remote uncertainty, framing, and application-protocol knowledge
```

This order follows the intellectual direction of the cited systems courses.
Atlas's adaptation is in its evidence method: prediction, code reading,
counterexamples, bounded experiments, architecture review, and a supportive
oral defense take priority over large volumes of handwritten implementation.
The resulting artifacts can be evidence of learning; they do not substitute
for institutional enrollment, staff assessment, or credentials.

## Reuse boundary

All sources in this review are **link/cite-only calibration sources**. Keep
Atlas explanations, diagrams, code, exercises, diagnostics, and dossiers
original. Do not copy or redistribute course prose, slides, figures,
assignments, lab handouts, solutions, exam items, autograders, or protected
course-specific assets.

MIT OCW materials carry published terms and Creative Commons conditions, but
this review grants no reuse permission; confirm the current terms and the
license of each asset before reuse. Treat live MIT 6.1810, CMU, Stanford,
Berkeley, and Georgia Tech materials as link/paraphrase-only unless a
specific asset has an independently verified reuse grant. In particular, do
not reproduce course or lab solutions. The linked courses calibrate scope and
pedagogy; the module source ledgers retain responsibility for technical,
version, license, and freshness claims.
