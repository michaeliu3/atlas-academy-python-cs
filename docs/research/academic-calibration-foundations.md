# Academic calibration — foundations (M1–M18)

## Purpose and boundary

This note calibrates Atlas's first eighteen modules against a small set of
official university course sources. It is a content-and-method comparison, not
an accreditation, enrollment, assessment, staffing, credit, or degree claim.
Atlas's 60-day route cannot reproduce the contact hours, supervised projects,
peer work, or formal assessment of these courses.

Atlas is intentionally Python-first and AI-era: it emphasizes reading unfamiliar
code, tracing state, recovering architecture, checking assumptions, debugging,
and reviewing agent-generated changes. Those adaptations are Atlas design
choices, not claims about how the cited courses teach or assess learners.

Sources were checked on 2026-08-01. They are official course or university
pages; linked material is for study and comparison, not copied into Atlas.

## Atlas outline coverage inspected

| Arc | Atlas modules |
|---|---|
| Python computation and formal foundations | M1 Values/State/Execution; M2 Functions/Recursion/Induction; M3 ADTs; M4 Logic/Sets/Relations/Proof |
| Algorithms and data structures | M5 Cost Models; M6 Representation/Memory/Sequences; M7 Stacks/Queues/Iteration; M8 Hashing; M9 Trees/Heaps/Sorting; M10 Graphs; M11 Algorithm Design |
| Software construction | M12 Modules/APIs/Types; M13 Specifications/Testing/Debugging; M14 Design/Change; M15 Files/Serialization/Packaging/Delivery |
| Data and systems | M16 Relational Data/Transactions; M17 Computer Architecture/Execution; M18 Operating Systems |

## Calibration map

| Atlas arc | Official university calibrators | What Atlas aligns with | Atlas's AI-era adaptation | Genuine gap or boundary to address |
|---|---|---|---|---|
| **M1–M2: state, functions, recursion** | [MIT 6.0001 — Introduction to Computer Science and Programming in Python](https://ocw.mit.edu/courses/6-0001-introduction-to-computer-science-and-programming-in-python-fall-2016/); [CMU 15-122 — Principles of Imperative Computation](https://www.cs.cmu.edu/~15122/syllabus.shtml) | Python computation provides the language bridge; CMU explicitly frames imperative programming around correct-by-design implementations, abstraction, correctness, complexity, and modularity. | State and call-frame traces, prediction before execution, failure reproduction, and review of small AI-generated patches replace typing-volume as the main evidence. | Atlas does not supply CMU's C/C0 practice or its full graded problem volume. Treat Python fluency and proof-by-trace as evidence, not as equivalent systems-language competence. |
| **M3, M12–M15: abstraction, APIs, testing, design, delivery** | [MIT 6.102 — Software Construction](https://web.mit.edu/6.102/www/sp26/); [CMU 15-122](https://www.cs.cmu.edu/~15122/syllabus.shtml) | MIT 6.102's published sequence includes interfaces/subtyping, equality, recursive data types, debugging, concurrency, mutual exclusion, and networking; Atlas maps its earlier software-construction foundations to ADTs, module boundaries, types, tests, change, and delivery. | Architecture recovery, bounded agent briefs, diff review, evidence-led debugging, and explicit non-goals make the learner responsible for changes that an agent may help implement. | Packaging, CI, supply-chain, and release tooling are ecosystem-specific and change quickly. Keep M15's claims versioned and add tool-specific practice only when the learner's target environment is known. |
| **M4: discrete mathematical language** | [MIT 6.042J — Mathematics for Computer Science](https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/) | The official scope covers definitions, proofs, sets, functions, relations, graphs, counting, and discrete probability—the mathematical language Atlas uses for contracts, counterexamples, and algorithms. | Proof ideas are attached to code representations and tests: distinguish theorem, model, implementation evidence, and untested assumption. | A 60-day core cannot match a full term's proof and problem-set volume. Continuous mathematics and deeper probability/linear algebra remain separate later-route material, not implied M4 mastery. |
| **M5–M10: analysis, structures, and graph algorithms** | [MIT 6.006 — Introduction to Algorithms syllabus](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/pages/syllabus/); [Georgia Tech CS 6515 — Intro to Graduate Algorithms](https://omscs.gatech.edu/cs-6515-intro-graduate-algorithms) | MIT names dynamic arrays, heaps, balanced BSTs, hash tables, sorting, graph searching, dynamic programming, mathematical modeling, and performance analysis. Georgia Tech explicitly treats dynamic programming, divide-and-conquer, graph algorithms, max flow, linear programming, and NP complexity as a higher-depth continuation with discrete mathematics and asymptotic-analysis prerequisites. Atlas maps the foundation across M5–M10 with explicit assumptions and invariants. | The learner reads code and architecture before modifying it, traces counterexamples, verifies witnesses independently, and challenges unsupported agent performance claims. | Atlas cannot replace the full MIT problem-set/recitation cadence or Georgia Tech's graduate depth. Network flow, richer graph variants, and proof depth should remain optional extensions rather than silently inferred coverage. |
| **M11: algorithm-design paradigms** | [MIT 6.046J — Design and Analysis of Algorithms](https://ocw.mit.edu/courses/6-046j-design-and-analysis-of-algorithms-spring-2015/) | The course's published intermediate scope includes divide-and-conquer, randomization, dynamic programming, greedy algorithms, incremental improvement, and complexity; Atlas uses these as strategy-selection tools. | Instead of pattern-name recall, the learner states the model, selects a strategy from structure, changes assumptions, and reviews an agent's proposed recurrence or proof obligation. | Formal complexity theory, reductions, and NP-completeness deserve a later dedicated treatment (M33), not an overclaim from M11's introductory exposure. |
| **M16: relational data and transactions** | [CMU 15-445/645 — Intro to Database Systems](https://15445.courses.cs.cmu.edu/spring2026/syllabus.html) | CMU's stated objectives include relational algebra, SQL, functional dependencies/normal forms, indexes, concurrency control, recovery, and critical comparison of database architectures—directly aligned with M16's relational, transaction, and recovery arc. | Atlas concentrates on reading query/transaction boundaries, reasoning about isolation and retry evidence, and reviewing Python-facing design choices rather than outsourcing database meaning to an ORM or agent. | M16 is not a disk-oriented DBMS implementation course and does not reproduce BusTub-scale C++ projects. Query optimizer and storage-engine implementation remain extension work. |
| **M17: architecture and execution stack** | [MIT 6.004 — Computation Structures](https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/); [CMU 15-213 — Introduction to Computer Systems](https://www.cs.cmu.edu/~213/) | MIT 6.004 covers digital abstraction, logic, finite-state machines, instruction sets, procedures/stacks, caches, and virtual memory. CMU 15-213 supplies the programmer's view of machine code, arithmetic, performance, and memory. | Atlas traces one Python operation across levels while labelling model, language guarantee, interpreter observation, and hardware hypothesis separately. | Atlas does not substitute for C/assembly, hardware-construction, or cache-lab practice. Offer those as an optional systems extension before claiming low-level fluency. |
| **M18: operating systems** | [MIT 6.1810 — Operating System Engineering overview](https://pdos.csail.mit.edu/6.1810/2025/overview.html); [Georgia Tech CS 6200 — Introduction to Operating Systems](https://omscs.gatech.edu/cs-6200-introduction-operating-systems) | MIT explicitly covers virtual memory, file systems, threads, context switches, kernels, interrupts, system calls, IPC, and hardware/software coordination. Georgia Tech foregrounds OS support for concurrency/synchronization, CPU/memory/I/O resource management, and distributed services. Atlas maps those ideas to resource mediation, processes, memory, files, authority, and shutdown. | Bounded user-space models, architecture reading, and failure timelines build correct mental models before any privileged or destructive system work. | Atlas does not include xv6 kernel labs, C/C++ multithread/RPC projects, or multiprocessor-kernel implementation. It must describe its OS/process labs as bounded models and provide an opt-in systems path for deeper practice. |

## How to use the calibration

1. Use Atlas as the connected primary path; use a cited source only when its
   specific model or exercise deepens the current module.
2. Record evidence at the right level: a trace, proof sketch, counterexample,
   design decision, review memo, or oral explanation—not merely a completed
   code generation.
3. Route a gap to an explicit extension rather than inflating a module claim.
   The 90-day and 180-day plans are the appropriate place for university-scale
   problem volume, C/assembly/xv6 labs, DBMS implementation, and advanced
   algorithms.

## Honest conclusion

The M1–M18 sequence is well calibrated to rigorous undergraduate foundations:
discrete reasoning, algorithms, software construction, databases, architecture,
and operating systems. Its distinctive contribution is the connected,
code-reading and AI-review workflow. The calibration supports targeted study;
it does **not** establish course-credit equivalence, a degree, universal mastery,
or production readiness.
