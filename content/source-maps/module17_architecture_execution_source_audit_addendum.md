# Module 17 — Computer Architecture and the Execution Stack — Source-Audit Addendum

**Audit date:** 2026-08-02  
**Scope:** source roles, claim linkage, access/reuse boundaries, and
candidate-only structural evidence for the existing M17 workbook. This is an
instructor-facing audit record, not an architecture certification, performance
result, release decision, or permission to reuse external assets.

## Candidate boundary

M17 remains `legacy-open` for learner access, `legacy-baseline` for its
contract state, and `unrecorded` for release. This addendum supports only a
non-promoting structural candidate. It does not establish a live experiment,
hardware-counter observation, source-commit CI, deployment, publication,
oral-defense completion, GPT Live behavior, Notion activity, or learner
mastery.

Atlas owns its teaching machine, Atlas case, diagrams, traces, code,
diagnostics, experiments, dossiers, and prompts. External materials are linked
and paraphrased only. Do not copy lectures, slides, figures, assignments,
solutions, assessments, prose, media, or source code merely because they are
publicly reachable.

## Source and reuse ledger

| ID | Owner and stable learner-facing link | Intended claim scope | Access / reuse status |
| --- | --- | --- | --- |
| **C01** | ACM/IEEE-CS/AAAI [CS2023 report](https://csed.acm.org/wp-content/uploads/2025/11/CS2023-Report.htm) and [knowledge-area index](https://csed.acm.org/knowledge-areas/); [ABET CAC 2026–2027 criteria](https://www.abet.org/accreditation/accreditation-criteria/criteria-for-accrediting-computing-programs-2026-2027/) | Architecture-and-organization coverage, neighboring-system boundaries, and rigor calibration. They do not certify Atlas or a learner. | Accessed 2026-08-02. Link and paraphrase only; do not imply accreditation, endorsement, or institutional equivalence. |
| **U01** | Nand2Tetris [Projects 1–5](https://www.nand2tetris.org/course) and [license/request](https://www.nand2tetris.org/license) | First-principles route from Boolean logic through arithmetic, memory, machine language, and a stored-program computer. It does not identify the host CPU's microarchitecture. | Accessed 2026-08-02. Link and paraphrase only; project materials are CC BY-NC-SA 3.0 and maintainers request that solutions not be published. Atlas exercises and diagrams remain original. |
| **U02** | MIT OpenCourseWare [6.004 Computation Structures](https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/), including [combinational logic](https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/pages/c4/), [sequential logic](https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/pages/c5/), [instruction sets](https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/pages/c9/), [processor design](https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/pages/c13/), [caches](https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/pages/c14/), and [pipelining](https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/pages/c15/) | Logic/state, ISA, datapath/control, cache, and pipeline vocabulary; pedagogical model calibration. It does not prove a specific current processor behaves like Beta or a five-stage diagram. | Accessed 2026-08-02. Link and paraphrase only; recheck the exact OCW license and attribution terms before reusing any asset or substantial text. |
| **U03** | Berkeley CS 61C [course notes](https://notes.cs61c.org/), [Elements of RISC-V](https://notes.cs61c.org/content/rv-intro/elements/), and [Memory Hierarchy, Revisited](https://notes.cs61c.org/content/caches-intro/memory-hierarchy/) | Modern sequence for representation, RISC-V, processor organization, locality, and the boundary where operating-system questions begin. It does not define the formal ISA contract. | Accessed 2026-08-02. Link and paraphrase only; use original Atlas synthesis and recheck site/repository terms before reuse. |
| **S01** | RISC-V International [Unprivileged ISA index, version 20260120](https://docs.riscv.org/reference/isa/unpriv/unpriv-index.html) and [RV32I base integer chapter](https://docs.riscv.org/reference/isa/v20260120/unpriv/rv32.html) | Software-visible ISA-state, load/store, addressing, byte-order, branch, and jump claims used by the declared RISC-V-like trace. It does not prescribe a cache, pipeline, native Python code sequence, or host implementation. | Accessed 2026-08-02. Link and paraphrase only; retain version labels and verify current specification/repository reuse terms before reproducing figures or tables. |
| **P01** | Python 3.14 [`dis`](https://docs.python.org/3.14/library/dis.html), [`struct`](https://docs.python.org/3.14/library/struct.html), [`array`](https://docs.python.org/3.14/library/array.html), [`sys.getsizeof`](https://docs.python.org/3.14/library/sys.html#sys.getsizeof), [`tracemalloc`](https://docs.python.org/3.14/library/tracemalloc.html), [`timeit`](https://docs.python.org/3.14/library/timeit.html), and [`platform`](https://docs.python.org/3.14/library/platform.html) | Documented Python-level observation and representation boundaries: byte order, shallow size, traced allocations, repeated timing, and provenance labels. They do not establish RSS, cache events, universal bytecode names, or causal hardware explanations. | Accessed 2026-08-02. Link and paraphrase only; recheck the [Python documentation license](https://docs.python.org/3/license.html) before exact reuse. |
| **P02** | CPython 3.14.6 source pinned at [`c63aec69…`](https://github.com/python/cpython/tree/c63aec69bd59c55314c06c23f4c22c03de76fe45), [`InternalDocs/interpreter.md`](https://github.com/python/cpython/blob/c63aec69bd59c55314c06c23f4c22c03de76fe45/InternalDocs/interpreter.md), [`Python/bytecodes.c`](https://github.com/python/cpython/blob/c63aec69bd59c55314c06c23f4c22c03de76fe45/Python/bytecodes.c), and [`Python/ceval.c`](https://github.com/python/cpython/blob/c63aec69bd59c55314c06c23f4c22c03de76fe45/Python/ceval.c) | Version-scoped distinction among Python semantics, CPython bytecode/frame machinery, native interpreter software, ISA, and processor. It does not turn CPython implementation details into language guarantees or teach the full M24 runtime scope. | Accessed 2026-08-02. Link/pin/paraphrase only; retain the exact revision and inspect the repository license before any code or figure reuse. |
| **K01** | Linux kernel [`/proc` documentation](https://docs.kernel.org/filesystems/proc.html) and [memory-management concepts](https://docs.kernel.org/admin-guide/mm/concepts.html) | Optional evidence that OS-managed process/memory observations are distinct from CPU-cache observations. It does not make Linux tooling portable or required. | Accessed 2026-08-02. Link and paraphrase only; consult licensing before reuse and route mechanisms to M18. |

## Claim linkage and stopping lines

| Workbook location | Claim or learner artifact | Source route | Required stopping line |
| --- | --- | --- | --- |
| Sessions 1–2: bits, Boolean transformation, clocked state | Width/signedness/byte-order cards, gates→adder→register map, and next-state trace | `U01`, `U02`, `P01` | A byte sequence, truth table, or finite-width teaching register does not reveal a Python object layout, real electrical timing, or the host machine's implementation. |
| Session 3: ISA state and calling convention | PC/register/memory table, RISC-V-like loop, and toy call/return trace | `U01`, `U02`, `U03`, `S01` | An instructional trace is not native code for a Python function; an ISA contract does not specify one microarchitecture or a complete platform ABI. |
| Session 4: pipeline and locality model | Hazard annotation, CPU-time factor table, and declared toy-cache trace | `U02`, `U03`, `S01` | A five-stage or toy-cache result proves only its declared model; elapsed time, contiguity, and Big-O do not prove cache hits, misses, or a hardware cause. |
| Session 5: Python execution bridge and I/O handoff | Cross-layer ownership map, `dis` observation, three-stack comparison, and I/O request trace | `P01`, `P02`, `K01` | CPython bytecode is neither Python semantics nor host assembly; a language-level read request does not establish one disk transfer, process state, page behavior, or device event. |
| Session 6: evidence protocol and agent-patch review | Semantic preflight, raw alternating timing vector, claim rewrite, and discriminating next-step proposal | `P01`, `U02`, `U03` | A local timing vector is an observation under named provenance, not a universal winner, a causal cache measurement, human review, release approval, or mastery evidence. |
| M17→M18/M19/M24 handoff | Boundaries for OS mechanisms, concurrency, and CPython runtime internals | `U02`, `P02`, `K01` | Naming a later layer is not teaching, testing, or completing it; preserve M18, M19, and M24 prerequisite boundaries. |

## License and reuse boundary

These sources calibrate a rigorous progression and support bounded documented
claims. They do not grant a credential, make Atlas equivalent to an
institutional course, or convert external assets into Atlas material.

If anyone proposes exact wording, a figure, an exercise, a solution, a video,
or source code for reuse, pause and separately verify current license,
attribution, academic-integrity, and distribution terms. Public availability is
not reuse approval. In particular, do not distribute Nand2Tetris project
solutions and do not treat a source pin as permission to copy CPython code.

## Stable learner links

Open one source only after an Atlas attempt: first-principles construction
(`U01`), course-model calibration (`U02`/`U03`), formal ISA behavior (`S01`),
version-scoped Python/CPython observation (`P01`/`P02`), or optional OS
boundary context (`K01`). These links are neither an answer key nor permission
to bypass M16, M18, M19, or M24.

## Visual and text-alternative review boundary

M17’s Mermaid blocks carry local IDs, titles, and concise text-alternative
metadata for the shared reader. That is structural reader input only; it does
not establish semantic rendering, keyboard behavior, screen-reader experience,
cognitive load, live-chat whiteboard rendering, or learner comprehension.

## Release and review questions still open

- Recheck living course/docs/specification links, the CPython pin, versions,
  licenses, and reuse terms before later human review or any release claim.
- Record runtime, OS, hardware/machine labels, workload, semantic oracle,
  schedule, raw timing vectors, and unavailable measurements before making any
  performance statement.
- Test browser/accessibility and real chat-whiteboard behavior separately.
- Treat TA, Study Partner, GPT Live, and Notion behavior as separate,
  learner-controlled evidence; do not infer automatic persistence or voice
  settings from this document.
- Keep this candidate non-promoting until qualified review, a reviewed source
  commit, source-commit CI, deployment evidence, and release records exist.
