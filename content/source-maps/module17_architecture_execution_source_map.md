# Module 17 research map — computer architecture and the execution stack

**Audit date:** 2026-07-29  
**Teaching baseline:** Python and standard-library documentation pinned to
3.14.6; CPython source pinned to commit
[`c63aec69bd59c55314c06c23f4c22c03de76fe45`](https://github.com/python/cpython/tree/c63aec69bd59c55314c06c23f4c22c03de76fe45);
RISC-V unprivileged ISA pinned to the ratified 2026-01-20 release where a
versioned link is available.

This file is the claim and reading audit behind Module 17. It is not the learner
workbook. The workbook’s Atlas case, diagrams, traces, questions, simulator
examples, code, and assessment are original synthesis.

---

## 1. Research question and stopping rule

The module must answer one connected question:

> When a Python operation produces a result and an elapsed-time observation,
> what representations and state transitions connect source semantics to
> instructions, processor state, memory hierarchy, and I/O—and which evidence
> can support a claim at each layer?

The source route must be deep enough to derive:

```text
bits
→ Boolean transformation
→ clocked state
→ instruction-set contract
→ processor implementation
→ addressed memory
→ memory hierarchy and locality
→ thin Python-runtime bridge
→ I/O boundary
→ bounded performance explanation
```

Stop before:

- operating-system mechanisms such as processes, scheduling, page tables,
  filesystems, permissions, signals, and shutdown (Module 18);
- program-level interleavings, locks, threads/processes, the GIL, deadlock, and
  parallel model choice (Module 19);
- interpreter implementation depth such as frames, reference counting, cyclic
  GC, object layout, specialization design, profilers, and native/vectorized
  optimization (Module 24).

Module 17 may **observe** CPython bytecode, shallow sizes, a named retained
object graph, live allocation deltas, and elapsed-time vectors only to
demonstrate evidence boundaries. It must not teach those tools as a complete
CPython performance model.

---

## 2. Curriculum coverage audit

### 2.1 CS2023

The joint ACM/IEEE-CS/AAAI
[CS2023 report](https://csed.acm.org/wp-content/uploads/2025/11/CS2023-Report.htm)
defines Architecture and Organization as a distinct knowledge area and lists:

- digital logic and digital systems;
- machine-level data representation;
- assembly-level machine organization;
- memory hierarchy;
- interfacing and communication;
- functional organization;
- performance and energy efficiency;
- heterogeneous and secure architectures, with sustainability concerns.

The [CS2023 knowledge-area index](https://csed.acm.org/knowledge-areas/) also
places Architecture and Organization beside Operating Systems, Networking,
Parallel and Distributed Computing, Security, and Systems Fundamentals. That
supports the course’s decision to teach the machine first but keep later system
mechanisms in their own dependency-respecting modules.

**M17 coverage decision**

| CS2023 architecture area | M17 treatment | Boundary |
|---|---|---|
| Digital logic | truth tables, gates, mux, adder, combinational vs sequential state | transistor/electrical implementation is linked enrichment |
| Representation | width, signedness, finite range, byte order, alignment contract | full floating-point analysis was introduced in M6 and is retrieved, not repeated |
| Assembly organization | ISA state, load/store, branch, PC, registers, a declared toy calling convention | no platform ABI memorization |
| Memory hierarchy | cache lines, tag/index/offset, locality, misses, AMAT, latency/bandwidth | no claim that the Python lab measures hardware misses |
| I/O | controller/device and software boundary; request is not physical transfer | syscall/filesystem/page-cache mechanisms open in M18 |
| Functional organization | fetch/decode/execute/memory/writeback model and pipelining | implementation-specific out-of-order depth is enrichment |
| Performance/energy | CPU-time equation, experiment design, uncertainty, energy as an omitted cost | no unsupported energy measurement |
| Heterogeneity/security | name as consequences of non-universal architecture | detailed GPU/accelerator/security architecture is later/optional |

### 2.2 ABET

The current
[ABET Computing Accreditation Commission criteria for 2026–2027](https://www.abet.org/accreditation/accreditation-criteria/criteria-for-accrediting-computing-programs-2026-2027/)
require breadth and depth in up-to-date fundamental and advanced computing,
analysis of complex computing problems, design/evaluation of computing
solutions, communication, professional judgment, and a comprehensive
integrating experience.

M17 therefore assesses more than recognition:

- decode and trace;
- recover an architecture from code and diagrams;
- analyze a performance claim;
- design a controlled observation;
- communicate uncertainty;
- review an agent patch;
- transfer the model to the living Atlas system.

The ABET criteria are a coverage and evidence check, not a claim that this
self-directed course is accredited.

---

## 3. First-principles construction route

### 3.1 Nand2Tetris

| Primary source | Use in M17 | Reading/academic-integrity boundary |
|---|---|---|
| [Project 1 — Boolean Logic](https://www.nand2tetris.org/project01) | gates and bitwise composition | read background/objective; do not publish or reproduce project solutions |
| [Project 2 — Boolean Arithmetic](https://www.nand2tetris.org/project02) | half/full adders and ALU pressure | use the dependency idea; Atlas diagrams and exercises remain original |
| [Project 3 — Memory](https://www.nand2tetris.org/project03) | combinational output versus clocked state, registers, RAM | no submitted HDL or solution repository |
| [Project 4 — Machine Language](https://www.nand2tetris.org/project04) | assembly as symbolic form of a machine-language contract; program/data/I/O trace | do not copy the Mult/Fill solutions |
| [Project 5 — Computer Architecture](https://www.nand2tetris.org/project05) | CPU, memory, instruction memory, and a complete stored-program computer | use as a conceptual dependency route, not as a replacement assignment |
| [Nand2Tetris license and request](https://www.nand2tetris.org/license) | licensing and academic-integrity authority | materials are CC BY-NC-SA 3.0; maintainers explicitly request that project solutions not be posted publicly |

**Read budget:** 60–90 minutes across the five project backgrounds, stopping
before implementation files.  
**Produce:** one original bits → gates → register → CPU dependency map and a
four-transition Atlas toy trace.  
**Do not produce:** HDL implementations of their assignments.

Nand2Tetris supplies the cleanest constructive answer to “why these machine
parts exist?” It is intentionally simpler than a current CPU. The workbook must
label the Hack-style construction as a pedagogical machine, not as the
microarchitecture inside Michael’s computer.

### 3.2 MIT 6.004 Computation Structures

MIT OpenCourseWare’s
[6.004 Computation Structures](https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/)
provides an undergraduate dependency sequence from information and digital
abstraction through logic, state, performance, ISA, assembly, procedures,
processor design, caches, pipelining, virtual memory, and devices.

Targeted route:

| Course unit | Use | Stop rule |
|---|---|---|
| [4 — Combinational Logic](https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/pages/c04/) and [5 — Sequential Logic](https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/pages/c05/) | current-input functions versus clocked state | no transistor timing derivation required for core mastery |
| [7 — Performance Measures](https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/pages/c07/) | latency, throughput, and cost vocabulary | Atlas evidence still comes from its recorded protocol |
| [9 — Designing an Instruction Set](https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/pages/c09/) and [10 — Assembly Language](https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/pages/c10/) | ISA as software-visible state-transition contract | RISC-V defines the concrete ISA example |
| [12 — Procedures and Stacks](https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/pages/c12/) | call/return and a declared convention | do not equate architectural stack with CPython evaluation stack |
| [13 — Building the Beta](https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/pages/c13/) | datapath/control and instruction realization | Beta is a teaching processor, not the learner’s hardware |
| [14 — Caches and the Memory Hierarchy](https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/pages/c14/) | locality, cache organizations, line/block reasoning, write trade-offs | use a tiny original cache trace; no slide copying |
| [15 — Pipelining the Beta](https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/pages/c15/) | overlapping stages and hazards; CPI is not automatically one | out-of-order speculation is optional enrichment |
| [16 — Virtual Memory](https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/pages/c16/) | only the handoff fact that addresses cross another translation/ownership boundary | page tables, faults, replacement, and protection belong to M18 |
| [18 — Devices and Interrupts](https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/pages/c18/) | only the device/controller/interrupt pressure | detailed interrupt and OS handling belongs to M18 |

**Read budget:** 2.5 hours of selected annotated material/video segments,
weighted toward units 9, 13, 14, and 15.  
**Produce:** datapath annotation, six-instruction trace, tiny-cache worksheet,
and one “what this model omits” card.

MIT OCW pages indicate a Creative Commons license. This course links to the
material and creates new Atlas explanations and diagrams. Recheck the exact
license and attribution requirements before reusing any media or substantial
text.

### 3.3 Berkeley CS 61C

The [CS 61C course notes](https://notes.cs61c.org/) expose a useful modern
sequence:

```text
number representation
→ C and memory
→ RISC-V
→ calling convention
→ digital logic
→ CPU
→ pipelining
→ caches
→ performance programming
→ virtual memory
```

Use:

- [Elements of RISC-V](https://notes.cs61c.org/content/rv-intro/elements/) for
  register/memory/instruction vocabulary;
- [Memory Hierarchy, Revisited](https://notes.cs61c.org/content/caches-intro/memory-hierarchy/)
  for the capacity/speed/cost hierarchy and the distinct managers of
  register↔memory, cache↔memory, and memory↔storage movement.

**Read budget:** 60 minutes.  
**Produce:** compare the Berkeley route with the Atlas execution-stack diagram
and identify where the OS becomes the next prerequisite.  
**Guardrail:** course notes support concepts; concrete RISC-V guarantees come
from the ratified specification.

---

## 4. Instruction-set authority

### 4.1 Ratified RISC-V unprivileged ISA

Use the official
[RISC-V Unprivileged ISA index, version 20260120](https://docs.riscv.org/reference/isa/unpriv/unpriv-index.html)
and the versioned
[RV32I base integer chapter](https://docs.riscv.org/reference/isa/v20260120/unpriv/rv32.html).

Claims supported:

- an ISA is a software-visible contract, not one processor implementation;
- RV32I is a load-store architecture: loads/stores access memory while integer
  arithmetic operates on registers;
- the base has byte-addressed memory;
- load/store effective addresses combine a base register and immediate offset;
- the environment defines legal address regions and some misaligned-access
  behavior;
- endianness describes the ordering of bytes in multibyte transfers;
- branches and jumps alter control-flow state.

M17 uses a **declared RISC-V-like teaching trace** for priority codes. If the
trace uses only real RV32I mnemonics, each meaning must match this versioned
spec. It must still be labeled pedagogical and must not be called the native
code emitted for the Python function.

Read:

1. introduction/ISA overview;
2. programmer-visible registers;
3. instruction formats at recognition level;
4. integer computational instructions;
5. load/store;
6. conditional branches and jumps.

**Read budget:** 90 minutes.  
**Produce:** PC/register/memory state table for a six- to ten-instruction loop.  
**Stop:** privileged modes, CSRs, page translation, atomic extension, and weak
memory-model depth are not prerequisites for this module.

### 4.2 ISA versus microarchitecture

The RISC-V specification constrains visible instruction behavior. It does not
promise:

- a five-stage implementation;
- one cycle per instruction;
- a cache organization;
- branch-predictor behavior;
- a fixed native instruction sequence for Python;
- equal performance across compliant implementations.

Use the official current
[Intel® 64 and IA-32 Architectures Software Developer Manuals](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-sdm.html)
only as optional contrast showing that a production ISA/manual family contains
far more state and behavior than the teaching machine. Do not copy manual
figures or infer Intel behavior on non-Intel machines.

---

## 5. Thin Python execution bridge

### 5.1 `dis`: observable bytecode, not native ISA

Python 3.14.6
[`dis`](https://docs.python.org/3.14/library/dis.html) states that it analyzes
CPython bytecode and explicitly warns that bytecode is an implementation detail
that may change across Python VMs and releases.

Safe uses:

- list logical instructions for the executing runtime;
- inspect arguments, jumps, source positions, and stack effects;
- compare two functions in the same recorded runtime;
- show that one source expression expands into multiple runtime operations.

Unsafe promotions:

- “this is the CPU instruction stream”;
- “this opcode count equals retired native instructions”;
- “these opcodes prove cache behavior”;
- “the same names/order hold on every Python version.”

The workbook should avoid grading an exact opcode list. The reference candidate
records implementation and patch version and treats opnames as observations.

### 5.2 CPython interpreter source pin

Pinned targets:

- [CPython 3.14.6 source tree at `c63aec69…`](https://github.com/python/cpython/tree/c63aec69bd59c55314c06c23f4c22c03de76fe45);
- [`InternalDocs/interpreter.md`](https://github.com/python/cpython/blob/c63aec69bd59c55314c06c23f4c22c03de76fe45/InternalDocs/interpreter.md);
- [`Python/bytecodes.c`](https://github.com/python/cpython/blob/c63aec69bd59c55314c06c23f4c22c03de76fe45/Python/bytecodes.c);
- [`Python/ceval.c`](https://github.com/python/cpython/blob/c63aec69bd59c55314c06c23f4c22c03de76fe45/Python/ceval.c).

Claims supported at this pin:

- the compiler produces a code object containing bytecode and static metadata;
- the interpreter executes code using dynamic frame state;
- the bytecode interpreter is a stack machine operating largely on object
  references;
- CPython bytecode and the hardware ISA are different instruction layers;
- interpreter implementation is C/native software that itself executes through
  the machine.

**Bounded read:** the first overview, instruction decoding, and evaluation-stack
sections of `interpreter.md`; read one simple instruction definition in
`bytecodes.c`; stop.

**Budget:** 45 minutes.  
**Question:** which part is Python language meaning, CPython implementation,
native compiled software, ISA contract, and processor execution?  
**Produce:** a five-layer ownership table.

Do not teach the call-stack implementation, frame materialization,
specialization families, reference ownership, allocator internals, or object
layouts here. Those are pinned reading targets for Module 24.

### 5.3 Three “stacks” that must not collapse

| Name | M17 meaning | Boundary |
|---|---|---|
| CPython evaluation stack | runtime operand stack described by CPython at the pinned version | observe only; M24 explains internals |
| function/call stack | nested call/return state under a runtime or architectural convention | use a declared toy convention |
| memory hierarchy | storage levels/copies between registers, caches, DRAM, and storage | not a “stack of function calls” |

The processor may also have a stack pointer by convention. Its existence does
not make Python frames identical to contiguous native stack frames.

---

## 6. Representation and measurement authorities

### 6.1 Byte encoding

Python 3.14.6
[`struct`](https://docs.python.org/3.14/library/struct.html) supports explicit
byte order, size, and alignment prefixes:

- `@`: native order, size, and alignment;
- `=`: native order with standard size and no alignment padding;
- `<`: little-endian standard;
- `>`: big-endian standard;
- `!`: network big-endian standard.

Use:

- show the same unsigned 16-bit value as big- and little-endian bytes;
- require matching encoder/decoder contracts;
- connect M15’s portable-format decision to machine representation.

Do not infer arbitrary CPython object layout from `struct.pack`.

Python 3.14.6
[`array`](https://docs.python.org/3.14/library/array.html) documents a compact
homogeneous sequence whose actual machine representation depends on the C
implementation; `itemsize` reports the internal bytes per item. That makes it
useful for a recorded representation experiment, not a universal layout claim.

### 6.2 Shallow versus retained size

Python 3.14.6
[`sys.getsizeof`](https://docs.python.org/3.14/library/sys.html#sys.getsizeof)
reports bytes directly attributed to an object and does **not** include objects
it refers to. It is implementation-specific and can be incomplete for
third-party extension types.

The reference candidate may add an original, cycle-safe graph walk with a
strictly named edge policy. Its result must be called an **estimate of that
named reachable Python graph**, not total memory.

Required labels:

- aliases count once;
- cycles terminate;
- which container edges are followed;
- extension-owned buffers, allocator arenas, interpreter state, RSS, page
  cache, and hardware traffic are excluded unless independently observed.

This is a bridge back to M6 representation. Deep object/allocator analysis is
M24.

### 6.3 Live Python allocations

Python 3.14.6
[`tracemalloc`](https://docs.python.org/3.14/library/tracemalloc.html) traces
Python memory allocations, supports snapshots and differences, records
tracebacks, and uses domain 0 for allocations made by Python.

Safe claim:

> Between these two snapshots, while this root remained live, tracemalloc
> attributed this live size/block difference to the named source scope.

Not safe:

- total allocations ever performed;
- RSS or total process memory;
- every C-extension/native allocation;
- memory bandwidth;
- hardware cache traffic or miss count;
- page-cache state.

### 6.4 Timing

Python 3.14.6
[`timeit`](https://docs.python.org/3.14/library/timeit.html) provides repeated
timing of small code snippets and avoids several common setup errors. Its
documented boundaries matter:

- setup is outside the timed statement;
- callable timing adds call overhead;
- cyclic GC is temporarily disabled by default during each timed run;
- other programs can interfere;
- repeat returns the full result vector;
- the minimum is commonly interpreted as a lower bound in the typical case;
- the whole vector and common sense still matter.

M17’s report may include:

- full per-call repeat vector;
- minimum as a lower-bound observation;
- median/range as descriptive summaries, not a universal statistical model;
- warm-up choice;
- order of workloads;
- runtime/OS/machine labels;
- semantic oracle.

It may not say:

- the minimum is the “true” time;
- warm-up guarantees a stable CPU/cache state;
- repeated timings identify the cause;
- one ratio transfers to another machine or Python version.

Python 3.14.6
[`platform`](https://docs.python.org/3.14/library/platform.html) supports
recording implementation, Python patch, compiler, OS, release, and machine
labels, while noting that several outputs are platform-dependent and may be
unavailable. The evidence packet must also name what it did not record:
frequency/power state, cache geometry, background load, native compiler flags,
and hardware counters.

---

## 7. Memory hierarchy and cache reasoning

### 7.1 Transferable model

Use the MIT 6.004 and Berkeley CS 61C cache materials to derive:

- small/fast/expensive versus large/slower/cheaper storage levels;
- temporal locality: recently used data may be reused;
- spatial locality: nearby addresses may be used soon;
- a cache transfers blocks/lines, not abstract Python objects;
- tag/index/offset decomposition in a named toy cache;
- compulsory, capacity, and conflict pressures at conceptual level;
- direct-mapped versus associative lookup trade-offs;
- writes require an explicit strategy;
- latency, throughput, and bandwidth are not synonyms.

For a one-level teaching cache:

\[
T_{\text{avg}} =
T_{\text{hit}} +
r_{\text{miss}} \times P_{\text{miss}}
\]

This is a model under named meanings of hit time, miss rate, and miss penalty.
Real hierarchies are nested, overlap work, prefetch, queue, and vary by
implementation.

### 7.2 Tiny simulator authority

An original direct-mapped simulator may establish the hit/miss sequence of
**its own declared model**:

- address width;
- byte-addressed input;
- line size;
- line count/set count;
- empty initial state;
- read-only access sequence;
- no prefetch/coherence/write policy.

It does not measure Michael’s CPU. The strongest educational contrast is:

```text
simulated cache event under declared model
≠ hardware counter from the executing machine
≠ elapsed-time observation
```

### 7.3 Sequential versus permuted Atlas traversal

A fixed contiguous priority-code buffer and two valid permutations support an
original investigation:

- same kernel;
- same values;
- same visit count;
- same result;
- same asymptotic \(\Theta(n)\) work;
- different address order.

Sequential access creates a locality hypothesis. A deterministic permutation
creates a contrasting hypothesis. Local timings alone do not establish actual
cache misses because interpreter work, indexing, boxing/conversion, branch
behavior, page state, CPU frequency, and interference remain possible causes.

The lab should therefore separate:

1. formal same-result proof;
2. toy-cache prediction;
3. runtime bytecode observation;
4. local elapsed-time vector;
5. optional platform counter evidence;
6. bounded causal language.

---

## 8. I/O and OS handoff sources

MIT 6.004 units 16–18 and CS 61C’s hierarchy route justify the boundary:

```text
language operation
→ runtime/library work
→ OS request boundary
→ memory/page-cache/controller/device possibilities
```

The official Linux kernel
[`/proc` filesystem documentation](https://docs.kernel.org/filesystems/proc.html)
and
[memory-management concepts](https://docs.kernel.org/admin-guide/mm/concepts.html)
are optional evidence that an OS exposes separate process/memory observations
and mediates another layer of the hierarchy.

Use only to say:

- a process and its address space have OS-managed state;
- some platform tools can expose counters or maps under named permissions;
- OS-visible metrics are not CPU-cache events by definition.

Do not teach `/proc` as portable Python, and do not require Linux on Michael’s
Windows machine. Module 18 will derive process, virtual-memory, system-call,
filesystem, scheduling, protection, and page-cache mechanisms.

Optional hardware counters must use platform-authoritative documentation and
must report availability/permissions. If no counter is available, the correct
result is “hypothesis remains unmeasured,” not a synthetic claim.

---

## 9. Atlas experiment and code-reading implications

### 9.1 Driving incident

Use a disposable synthetic export from Module 16. Derive a bounded numerical
projection; never benchmark the production database or private learning
history.

Two complementary probes may coexist:

1. **Access-order probe:** same packed codes and same kernel; sequential versus
   deterministic-permuted visit order.
2. **Representation probe:** same ordered confidence values and same explicit
   scan shape; `list[float]` versus `array('d')`.

The access-order probe teaches locality most cleanly. The representation probe
triangulates shallow/retained/live-allocation evidence and demonstrates that a
performance difference can have several simultaneous runtime and machine
explanations.

Neither probe promises which variant wins.

### 9.2 Evidence ladder

| Level | Evidence | Strongest permitted statement |
|---|---|---|
| Semantic | result oracle and permutation validation | the compared executions meet the tested result contract |
| Representation | explicit encoding, type/itemsize, named object-graph estimate | the values are represented differently under documented/runtime-recorded contracts |
| Runtime | `dis` inventory at exact implementation/patch | this runtime reports these logical instructions |
| Allocation | scoped `tracemalloc` snapshots | these live traced Python blocks differ in this scope |
| Timing | complete repeat vectors and provenance | elapsed observations differ or overlap under this protocol |
| Toy architecture | hand trace/cache simulator | the declared model produces this state/hit sequence |
| Hardware | counter evidence, if independently available | this machine/tool reported these events under this setup |
| Causal | crossed/controlled experiment plus alternatives | one explanation is supported more strongly, with named remaining alternatives |

### 9.3 Suspicious agent patch

The review target should contain multiple layer collapses:

- gathers values into a new list but omits construction cost;
- times baseline first/cold and candidate after warm-up;
- saves only the fastest candidate run;
- changes trial count;
- checks output after rather than before timing;
- says “cache hit” without a counter or cache layer;
- calls CPython bytecode “assembly”;
- generalizes one machine’s ratio.

The learner’s task is to split:

- correct semantic refactor;
- potentially useful representation choice;
- unfair experiment;
- unsupported causal prose.

### 9.4 Reference implementation requirements

The standalone candidate should be standard-library only and include:

- environment/provenance record without host/user identity;
- explicit-endian `struct` round trip;
- version-scoped `dis` inventory;
- cycle-safe/alias-safe named retained-size estimator;
- scoped `tracemalloc` snapshot deltas;
- complete `timeit` repeat vectors;
- optional sequential/permuted kernel and toy-cache model;
- JSON mode;
- semantic, invalid-input, cycles, aliases, deterministic-schema, and
  claim-boundary tests;
- an explicit `does_not_establish`/unmeasured-hypotheses section.

It must never infer hardware events from elapsed time.

---

## 10. Source-use and licensing policy

| Source family | Use policy |
|---|---|
| Nand2Tetris | link and attribute; follow CC BY-NC-SA 3.0; do not publish project solutions; use original Atlas exercises |
| MIT OpenCourseWare | link and attribute; consult exact CC terms before reuse; do not copy slides/media into the portal without a separate license check |
| Berkeley course notes | link for directed reading; use original synthesis/examples; recheck repository/site license before reuse |
| RISC-V specification | link to ratified/versioned authority; paraphrase behavior; verify specification/repository license before reproducing figures or tables |
| Python docs/CPython | Python docs state PSF License v2, with documentation examples additionally under Zero-Clause BSD; CPython source remains under its repository license; link/pin and write original probes |
| Linux kernel docs | link/paraphrase; consult kernel documentation licensing before reuse |
| Intel manuals | link as vendor authority/contrast; do not reproduce figures or imply behavior on another ISA |
| CS2023/ABET | use for coverage audit and links; do not imply accreditation or endorsement |

All learner-facing diagrams should be original Mermaid/SVG/HTML constructions.
Quoted language must remain minimal; paraphrase and cite instead.

---

## 11. Claim ledger

### 11.1 Safe claims

- A bit pattern needs width and interpretation to denote a numeric value.
- Combinational logic depends on current inputs; sequential state adds memory
  of earlier transitions under a clock/storage model.
- An ISA specifies software-visible state transitions; a microarchitecture
  implements them.
- In a load-store ISA, register arithmetic and memory updates are separate;
  memory changes through an explicit store.
- Instruction count, cycles per instruction, and cycle time are distinct
  contributors to CPU time.
- Pipelining overlaps stages; it does not make every instruction take one cycle
  or turn one core into program-level concurrency.
- Memory hierarchy exploits locality but introduces misses and transfer costs.
- A toy cache simulator establishes only its declared model’s results.
- CPython bytecode is not the hardware ISA.
- `dis` output is implementation/version specific.
- `getsizeof` is shallow.
- A named retained-size traversal is a scoped graph estimate.
- `tracemalloc` snapshots do not represent every form of process or hardware
  memory activity.
- A full timing vector under recorded provenance is an empirical observation.
- Equal \(\Theta(n)\) classes can have different constants, data movement, and
  elapsed behavior.
- A language-level I/O call is not necessarily one physical device transfer.
- CPU cache, OS page cache, database cache, and application cache are distinct.

### 11.2 Never say without stronger evidence

- “These bytes are negative” without signedness/width.
- “The value is stored in little-endian” when referring to an abstract integer
  rather than an encoding.
- “This Python line is one CPU instruction.”
- “Bytecode is assembly/native code.”
- “The ISA specifies the cache and pipeline.”
- “A five-stage diagram is how this computer must work.”
- “Pipelining is the same as Python threads.”
- “One instruction takes one cycle.”
- “Both loops are \(O(n)\), so they take the same time.”
- “Contiguous means cache-resident.”
- “The faster run proves fewer cache misses.”
- “Warm-up clears all noise.”
- “The minimum timing is the universal true time.”
- “`getsizeof` is total memory.”
- “`tracemalloc` measures RSS or hardware traffic.”
- “One `read(1)` causes one disk access.”
- “WAL/database pages are the CPU cache.”
- “The result transfers to every CPU, OS, runtime, version, or workload.”

---

## 12. Freshness and lab checklist

Before teaching or publishing a new reference trace:

- [ ] record audit date;
- [ ] record exact Python implementation and patch;
- [ ] keep Python docs on `/3.14/` while 3.14.6 is the baseline;
- [ ] pin CPython source to the matching peeled commit;
- [ ] regenerate `dis` observations after any Python change;
- [ ] never grade exact opnames across versions;
- [ ] record OS/release, machine label, pointer width, byte order, and compiler;
- [ ] record data size, digest/seed, threshold, and visit-order identity;
- [ ] validate result equivalence and permutation before timing;
- [ ] separate construction/loading from the kernel;
- [ ] record warm-up, GC policy, timing order, repeat, and number;
- [ ] preserve full raw timing vectors;
- [ ] label local and supplied reference-machine evidence separately;
- [ ] keep cache geometry/results labeled as toy model unless a real counter
  source is named;
- [ ] record unavailable counter evidence rather than infer it;
- [ ] use only disposable synthetic data;
- [ ] do not require privileged cache flushes or unsafe native tools;
- [ ] recheck RISC-V links for the ratified version;
- [ ] recheck curriculum criteria annually;
- [ ] recheck all licenses before incorporating anything beyond links,
  attribution, minimal quotation, and original synthesis;
- [ ] preserve M18, M19, and M24 stopping rules.

---

## 13. Directed learner route

### Before Session 1

1. Nand2Tetris Projects 1–3 backgrounds.
2. `struct` byte-order table.
3. M6 representation retrieval.

Produce: one representation card and gates→register dependency sketch.

### Before Session 2

1. Nand2Tetris Projects 4–5 backgrounds.
2. RISC-V RV32I introduction, registers, load/store, branch.
3. MIT 6.004 units 9, 12, and 13 selected material.

Produce: six-instruction PC/register/memory trace and a call/return trace under
the declared convention.

### Before Session 3

1. MIT 6.004 cache unit.
2. CS 61C memory-hierarchy note.
3. Python `dis` implementation-detail warning.
4. `timeit` repeat/GC/interpretation notes.

Produce: toy-cache prediction, evidence-layer matrix, and rewritten bounded
claim.

### Optional architecture-reading challenge

Read the pinned CPython `InternalDocs/interpreter.md` overview, instruction
decoding, and evaluation-stack sections for no more than 45 minutes.

Question:

> Which state belongs to Python semantics, CPython runtime, native software,
> ISA, processor, OS, and device?

Stop before following frames, specialization, object ownership, allocator, or
GC internals. Save those questions for Module 24.

---

## 14. Final source-audit self-explanation

Without notes, answer:

> Why do bits require a contract? How do gates and clocked registers create a
> machine state? What does an ISA promise that a microarchitecture does not?
> Why do loads, arithmetic, and stores change different state? How can stages
> overlap without making an instruction free or creating Python-level
> concurrency? How do cache lines and locality alter a cost model? Why is
> CPython bytecode neither Python source nor hardware ISA? What do `dis`,
> `getsizeof`, `tracemalloc`, a toy-cache trace, and a timing vector each
> observe—and what can none of them establish alone? Finally, where does the
> I/O request cross into the operating-system questions reserved for Module 18,
> and which CPython mechanisms remain reserved for Module 24?

