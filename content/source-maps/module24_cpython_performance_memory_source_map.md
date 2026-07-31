# Module 24 — CPython, Performance, and Memory: Primary-Source Map

## Document status

- **Purpose:** primary-source, claim, experiment, licensing, and teaching map
  for the Module 24 learner workbook, visual studio, reference-model tests,
  TA sessions, performance report, and Atlas optimization checkpoint.
- **Course position:** Module 24 follows Module 23, *Programming Languages,
  Interpreters, and Bounded Evaluation*. Module 23 established that source
  text, ASTs, and bytecode observations do not substitute for a semantic
  contract or an authority boundary. Module 24 asks: **given one fixed,
  correct semantic workload, what evidence supports a narrow claim about its
  cost?**
- **Canonical forward connection: Module 32, _Systems Languages, Scientific
  Python & Accelerators_.** Module 32 is authoring-only in the current course
  release, so Module 24 ends the readable runtime-evidence path rather than
  unlocking a next Core module. The later M25/M26 preview workbooks reuse this
  discipline only after the M31–M36 chain; they are not Module 24's direct
  learner path. A faster pipeline that changes outputs, privileges, privacy,
  accessibility, or an uncertainty label has not preserved the Atlas contract.
- **Semantic baseline:** Python 3.14 language and standard-library
  documentation. Language-reference material owns source-level semantics, not
  a specific object layout, bytecode sequence, allocation policy, timer
  result, or throughput figure.
- **Implementation baseline:** **CPython 3.14.6**, pinned to the official
  [v3.14.6 source tag](https://github.com/python/cpython/tree/v3.14.6).
  A CPython source reading or local run is evidence only for the named
  interpreter build, version, configuration, workload, and host.
- **Research snapshot:** **2026-07-30**. Python documentation links target
  Python 3.14.6 where the versioned page is available. The CPython tag, not
  the moving main branch, is the reproducible code-reading anchor.
- **Evidence policy:** official Python documentation, accepted PEPs, the
  pinned CPython source tree, named operating-system API documentation, and
  official NumPy documentation are authoritative only for their stated
  boundaries. University sources inform pedagogical sequencing and systems
  vocabulary; they do not establish Python or CPython behavior.
- **Pedagogical bias:** learners first read a workload contract, inspect a
  code path, predict a measurement, and distinguish observations from
  explanations. They make small, reversible implementation changes only after
  a baseline and use an independent semantic oracle. Typing speed and
  leaderboard microseconds are not the learning objective.
- **Safety and privacy boundary:** all exercises use deterministic synthetic
  fixtures and local measurements. No production records, secrets, telemetry,
  remote services, privilege changes, unsafe native memory writes, allocator
  replacement, process limits, or benchmark results from an unknown machine
  enter the course artifact. A profiler file or memory snapshot is treated as
  potentially sensitive path/source metadata and is summarised or redacted.
- **Copyright policy:** explanations, diagrams, workloads, fixtures,
  experiment reports, source annotations, and assessments are original.
  External material is linked and carefully paraphrased. Do not copy
  substantial documentation prose, CPython source, university slides,
  assignments, figures, benchmark suites, solutions, or licensed datasets.

This is an authoring boundary, not the learner-facing workbook. It specifies
which claims Module 24 may make, the evidence each needs, and the limits that
must remain visible in every visual, quiz, TA response, model comment, and
optimization report.

---

## Executive teaching decision

The usual performance story starts too late: it opens a profiler, finds a hot
line, replaces it, and calls a shorter elapsed time an improvement. That skips
the central systems question: *what changed, on which workload, at which
layer, while preserving which behavior?*

Module 24 carries forward four connected invariants:

1. **Module 5 — cost model:** asymptotic work and constants are different
   claims. A lower-order algorithmic improvement can dominate, but an
   asymptotic label does not predict a particular run time.
2. **Module 6/7/8/9 — representation:** a list, dict, generator, tree, or
   sorted sequence embodies different ownership, allocation, locality, and
   access tradeoffs. Their language-level behavior is not a promise of one
   internal layout.
3. **Module 13/14/17 — evidence and layers:** a test, trace, bytecode
   listing, frame, operating-system counter, and CPU sample observe different
   layers. None is a universal explanation by itself.
4. **Module 23 — semantics and authority:** an optimization is acceptable
   only when it preserves the named result/error/effect/privacy contract. A
   CPython observation must never make an implementation detail into language
   law.

The course therefore teaches this repeatable chain:

~~~text
semantic contract + independent oracle + fixed workload family
    → environment/build/provenance header
    → baseline measurements at deliberately named layers
    → code-reading hypothesis
    → one scoped intervention
    → semantic regression and measurement replay
    → attribution table: algorithm | CPython | allocation | native/OS | unknown
    → bounded conclusion, counterexample, and next experiment
~~~

### M23 → M24 → M32 (authoring-only) connected sequence

| Boundary | Module 23 gives the learner | Module 24 adds | Later M25 preview reuses after M31–M36 |
|---|---|---|---|
| Meaning | An AST/bytecode display is not language semantics. | An unchanged result must be demonstrated before a cost comparison means anything. | A model score or ranking is not a user benefit without an evaluation contract. |
| Implementation | A disassembly is a version-labelled CPython observation. | Frames, specialization, reference counting, GC, and allocators are studied as CPython/build observations. | Library/model/runtime behavior becomes an explicitly versioned system component. |
| Evidence | A local evaluator result is a bounded model observation. | A timed run, allocation trace, and OS counter each support different narrow claims. | Offline metric, usability observation, and impact review each have a separate scope. |
| Authority/privacy | A language should not gain authority from source text. | Instrumentation and reports avoid raw data, sensitive paths, and unbounded artifact capture. | Data/model/agent boundaries retain minimisation and human oversight. |
| Change | A repaired evaluator needs tests and a clear invariant. | An optimization is a change proposal with a semantic oracle, benchmark protocol, and rollbackable diff. | A helpful feature needs technical, human, and governance evidence. |

Module 32 is the canonical forward module, but it is authoring-only today.
The M25/M26 materials in the final column are later preview-only synthesis
connections, not a direct M24 route or a prerequisite bypass.

### Required Atlas checkpoint invariant

> **Atlas calls a change an optimization only after a named semantic contract
> and independent oracle agree on the allowed workload. Its report records the
> exact interpreter/build, host and OS facts, dependency versions, workload,
> warm-up policy, repeats, timer/measurement layer, profiler or allocation
> evidence, and uncertainty. It attributes a result only to mechanisms the
> evidence can distinguish, labels CPython and OS/native observations
> separately from language guarantees, and preserves privacy, safety,
> accessibility, and existing failure behavior.**

This is an **Atlas teaching contract**. It is not a promise of a universally
fast implementation, a stable CPython internal ABI, a leak-free process, a
native-code safety proof, a production capacity plan, an energy measurement,
or a replacement for workload-specific performance engineering.

---

## Scope ownership and hard boundaries

### Module 24 owns

- the causal difference between a semantic contract, workload model,
  measurement, hypothesis, intervention, and conclusion;
- reproducibility headers: Python/CPython version, implementation, executable
  identity, build/configuration signal, dependency versions, operating system,
  architecture, timer, repeats, warm-up, workload seed/shape, and source
  revision;
- code objects, frames, and bytecode as version-labelled CPython
  observations, including careful use of disassembly and trusted fixed source;
- CPython reference-counting concepts, strong/borrowed-reference language in
  the C API, immortal-object caveats, object lifetime, finalization hazards,
  and why Python-level reference counts are diagnostic clues rather than a
  leak verdict;
- cyclic garbage collection, tracked objects, thresholds, generations, and
  point-release sensitivity in the CPython 3.14 series;
- direct object-size observation, object-graph ownership, allocation tracing,
  retained versus peak memory, and the distinctions among Python allocations,
  native allocations, allocator pools/arenas, virtual address space, and
  resident process memory;
- measurement with time.perf_counter, timeit, cProfile/pstats, tracemalloc,
  gc, and selected platform evidence, including each instrument's
  perturbation and blind spots;
- allocation and representation hypotheses using simple fixed Atlas fixtures;
- CPython adaptive bytecode/specialization as source-reading and
  disassembly-observation material, not an opcode-memorisation exercise;
- native/vectorized boundary reasoning: data conversion, copy/view/ownership,
  dispatch, call overhead, threading configuration, result equivalence, and
  cross-platform evidence;
- the CPython 3.14 free-threaded and experimental-JIT variants only as
  separately configured, separately measured comparison targets;
- an evidence-based optimization report that separates algorithmic, runtime,
  allocator, native library, and operating-system explanations.

### Module 24 mentions but does not teach deeply

- CPU instruction selection, branch prediction, cache hierarchy, NUMA,
  virtual memory, compiler flags, processor power states, thermal behavior,
  disk I/O, syscall tracing, kernel schedulers, and hardware performance
  counters;
- CPython interpreter generation, micro-operations, JIT implementation,
  per-object locking, biased/deferred reference counting, extension ABI
  design, C compiler optimization, allocator replacement, and debug builds;
- NumPy array layout, ufunc dispatch, SIMD, BLAS/GPU kernels, and
  multi-threaded native libraries as optional comparison seams;
- profiling systems such as pyperf, perf, ETW, Instruments, VTune, or
  flamegraphs as later/optional tools whose own documentation and host
  configuration must be recorded;
- capacity planning, SLOs, load testing, production observability, and
  cost/energy accounting as systems/operations work.

### Deferred or explicitly out of scope

- **Later preview-only synthesis (Modules 25–26):** statistical/model
  evaluation, data-quality uncertainty, ranking/recommendation tradeoffs,
  human factors, accessibility, visualization, oversight, and a
  production-like release argument. These modules sit after the M31–M36 chain
  and are not Module 24's forward route.
- **Specialist study:** C-extension authoring, memory-corruption debugging,
  custom allocator hooks, benchmark-suite governance, OS/kernel tracing,
  hardware-counter analysis, compiler/JIT development, GPU programming,
  production load tests, and operating-system resource control.
- **Never an exercise:** timing untrusted code, changing a global allocator,
  disabling safety checks to obtain a score, using an unbounded production
  dataset, collecting another user's process data, or claiming security,
  fairness, accessibility, or capacity improvement from a local microbenchmark.

### Required non-claims

Every learner-facing artifact, TA answer, visual, and generated patch must
reject the following statements:

- “Python promises that this expression takes this long or stores this many
  bytes.” The language specification does not make such a promise.
- “A disassembly proves the exact CPU instructions, the number of cycles, or
  performance on another CPython release, VM, or machine.”
- “A smaller big-O expression means this finite workload is faster without a
  measurement, or a microbenchmark proves the better algorithm.”
- “One elapsed-time result proves a causal speedup.” It may be affected by
  setup, input shape, warm-up, GC, background work, scheduling, caches,
  compiler/build choices, native libraries, and measurement overhead.
- “The current timeit default includes GC behavior.” Python documentation
  states that timeit temporarily disables cyclic GC by default.
- “A cProfile table is a benchmark or a precise comparison between Python and
  C/native time.” Python documents profiling overhead and its asymmetry at
  the Python/C boundary.
- “sys.getsizeof reports a container's transitive memory, process RSS, or
  memory held by native extensions.” It reports direct size only and
  third-party extension behavior is implementation-specific.
- “tracemalloc peak equals process RSS or all native/GPU/library allocation.”
  It traces memory blocks allocated by Python and has its own storage cost.
- “A large sys.getrefcount value proves a leak or counts all live owners.”
  The call introduces a temporary reference and immortal objects can have
  deliberately nonliteral counts.
- “Reference counting means cyclic GC is irrelevant,” or “gc.collect proves
  the process returned memory to the operating system.”
- “The three GC thresholds, generation behaviour, and free-list effects are
  timeless CPython facts.” The 3.14 documentation records point-release
  changes; the exact interpreter patch version must be named.
- “A Python object header or list growth policy is a stable public ABI or a
  portable Python implementation property.”
- “Adaptive bytecode/specialization, a free-threaded build, or an
  experimental JIT automatically makes this program faster.”
- “Native/vectorized code is automatically equivalent, faster, zero-copy,
  thread-safe, or free of serialization/transfer overhead.”
- “numpy.vectorize means compiled vectorization.” NumPy documents it as a
  convenience wrapper whose implementation is essentially a Python loop.
- “An AI-generated optimization explanation is evidence.” It is a hypothesis
  until the source, contract, and recorded experiment support it.

---

## First-principles evidence taxonomy

### The seven questions before any optimization claim

Every performance review begins with these questions in order:

1. **What externally observable contract must remain true?** Name normal
   output, ordering, errors, determinism, mutation/effect rules, privacy, and
   resource limits. If an accepted change alters one, it is a redesign, not
   merely an optimization.
2. **What workload family represents the question?** Name input size,
   distribution, ordering, data type, hot/cold state, concurrency, fixture
   seed, and excluded cases. A single convenient input is not a workload
   family.
3. **What is measured?** Wall time, CPU time, call count, Python allocation
   trace, direct object size, retained graph, OS working set, or native-library
   counter are different quantities.
4. **What environment produced it?** Record interpreter/version/build,
   operating system, architecture, executable, dependencies, process
   configuration, relevant environment variables, and source revision.
5. **What does the instrument actually observe?** Identify its layer,
   overhead, exclusions, resolution, and data sensitivity.
6. **Which mechanism is proposed?** Algorithmic work, Python call count,
   object creation, allocation lifetime, representation, interpreter path,
   native kernel, I/O, scheduler, or unknown.
7. **What would falsify the explanation?** State a workload, instrument, or
   controlled variation that could distinguish the hypothesis from a
   plausible alternative.

### Claim labels required in diagrams, notebooks, and reports

| Label | What it means | Example | It does not mean |
|---|---|---|---|
| [LANGUAGE GUARANTEE] | Python language/reference contract. | Equal function inputs follow the stated program semantics. | A CPython opcode, allocation count, or elapsed time is fixed. |
| [STDLIB CONTRACT] | A documented standard-library API behavior. | timeit uses perf_counter by default and disables GC while timing unless re-enabled. | The outcome generalizes to a whole application. |
| [CPYTHON 3.14.6 OBSERVATION] | A fact observed via the pinned source, dis, or named local build. | This build's trusted function displays a particular disassembly. | The effect is portable or stable across releases/builds. |
| [MEASUREMENT] | A recorded result from one named experiment. | Five repeats on one fixture have this result vector. | The result explains its own cause or predicts every host. |
| [OS/NATIVE OBSERVATION] | A host/API/library-specific measurement or documented behavior. | Windows process counters report a named value for this process. | It equals Python allocation tracing or language memory. |
| [COURSE MODEL] | An intentional simplified representation. | A diagram treats a retained object graph as arrows between nodes. | It is CPython's exact heap, ABI, or allocator implementation. |
| [HYPOTHESIS] | A falsifiable proposed mechanism. | Fewer temporary Python objects may reduce traced allocations for this workload. | It is a conclusion before controlled evidence. |
| [UNKNOWN] | Evidence deliberately does not settle a fact. | Whether a native wheel uses a particular CPU path on another host. | Missing detail is permission to invent an explanation. |

### Observation-layer matrix

| Question | Appropriate first evidence | Supports a bounded statement | Does not settle |
|---|---|---|---|
| Did outputs/errors/effects remain equivalent? | Independent semantic oracle, regression suite, selected property/contract cases. | The tested contract cases agree. | Universal correctness or user-impact equivalence. |
| Which Python calls dominate this run? | cProfile and pstats on the named workload. | Call/count and profiled-time evidence for that run. | Exact CPU cycles, native-kernel cost, or a benchmark score. |
| Which Python allocation sites grew between phases? | tracemalloc snapshots/diffs started early enough. | Traced Python-block attribution with the recorded frame depth. | Total process/native/GPU memory or all retained ownership. |
| How large is this immediate object? | sys.getsizeof plus type/version label. | Direct size as documented for this object/build. | Transitive graph size, allocator slack, RSS, or a portable layout. |
| Is this object currently GC-tracked? | gc.is_tracked on the named interpreter/object. | Current collector-tracking observation. | Reachability, future tracking state, or all references. |
| What bytecode does this trusted function expose? | dis with Python/CPython version and options recorded. | A CPython implementation observation. | Language law, native machine code, or a performance conclusion. |
| Did process memory change at the OS layer? | Named OS/process API or host tool with exact metric/units. | That tool's process counter at selected moments. | A causal allocation source or equality with tracemalloc. |
| Did a native/vectorized variant help? | Equivalent outputs plus end-to-end measurement, library/version/thread configuration, conversion/copy accounting. | A result for that exact native boundary and workload. | A general claim about vectorization or all array shapes. |

### Required experiment record

Every measured table, chart, or prose conclusion must have a nearby compact
header equivalent to:

~~~text
claim_id: M24-...
semantic_contract: result/error/effect cases and oracle revision
workload: shape, seed, sizes, distribution, order, warm-up/cold policy
variants: source revisions and the one intended intervention
runtime: implementation, Python patch version, executable, cache tag, build flags
host: OS release, architecture, relevant CPU/process configuration
dependencies: exact native/vectorized library versions if used
measurement: metric, instrument/options, units, repeats, raw result location
controls: GC policy, process isolation, profiling/tracing on or off
privacy: fixture sensitivity and redaction decision
conclusion: bounded comparative statement
alternatives: plausible explanations not eliminated
next_falsifier: one test or measurement that could change the conclusion
~~~

An artifact with an attractive chart but no equivalent header is an
unclassified observation, not a course performance result.

---

## Primary-source ledger

### Python 3.14.6 public contracts

| ID | Primary source | What Module 24 may use it to say | Boundary |
|---|---|---|---|
| P24-01 | [Python language reference](https://docs.python.org/3.14/reference/index.html) and [data model](https://docs.python.org/3.14/reference/datamodel.html) | Python source semantics and object/protocol contracts belong to the language/reference layer. | No performance, memory-layout, bytecode, or CPU-cost guarantee follows. |
| P24-02 | [dis](https://docs.python.org/3.14/library/dis.html) | dis analyzes CPython bytecode; CPython documentation explicitly calls bytecode an implementation detail that may change across releases and VMs. | Trusted local snippets only; never assert fixed opcode sequences in cross-version tests. |
| P24-03 | [time](https://docs.python.org/3.14/library/time.html) and [timeit](https://docs.python.org/3.14/library/timeit.html) | perf_counter is the default timeit timer; timeit repeats work and temporarily disables GC by default. The docs advise inspecting repeat results and explain external interference. | Record whether measuring elapsed or process time and whether GC is intentionally enabled. |
| P24-04 | [profile and cProfile](https://docs.python.org/3.14/library/profile.html) | cProfile/profile provide deterministic profiling; the docs distinguish profiling from benchmarking and describe overhead/accuracy limits. | A profile identifies investigation targets, not a final comparative speed claim. |
| P24-05 | [tracemalloc](https://docs.python.org/3.14/library/tracemalloc.html) | tracemalloc traces Python-allocated memory blocks, can compare snapshots, and records a configurable traceback depth. | Never relabel its totals as process RSS, all native memory, or a leak proof. |
| P24-06 | [gc](https://docs.python.org/3.14/library/gc.html) | The optional cyclic collector supplements reference counting; tracking, collection, thresholds, callbacks, and debug interfaces have documented limits. | The current 3.14.6 docs include 3.14.5 generation/threshold changes; every GC claim names the patch version. |
| P24-07 | [sys](https://docs.python.org/3.14/library/sys.html) | getsizeof is direct-only; getrefcount includes a temporary argument reference and immortal objects invalidate literal-count intuition; _getframe is CPython-specific. | Do not use these as portable ownership/layout or total-memory APIs. |
| P24-08 | [platform](https://docs.python.org/3.14/library/platform.html) and [sysconfig](https://docs.python.org/3.14/library/sysconfig.html) | A report can capture implementation/version/platform/build metadata through documented interfaces. | Metadata is provenance, not a claim that two hosts are controlled experiments. |
| P24-09 | [Python support for free threading](https://docs.python.org/3.14/howto/free-threading-python.html) and [thread safety guarantees](https://docs.python.org/3.14/library/threadsafety.html) | Free-threaded CPython is a distinct build/runtime configuration; package compatibility and GIL state matter. | It is not the default course baseline and cannot rescue an unsafe concurrent design. |
| P24-10 | [What is new in Python 3.14](https://docs.python.org/3.14/whatsnew/3.14.html) | Python 3.14 officially supports free-threaded builds and offers an experimental JIT in some official binaries/configurations. | JIT availability/enablement and performance are per build/workload; no course baseline assumes either. |

### CPython C-API and implementation sources

| ID | Primary source | What Module 24 may use it to say | Boundary |
|---|---|---|---|
| C24-01 | [Reference counting C API](https://docs.python.org/3.14/c-api/refcounting.html) | Strong-reference acquisition/release is the C-API ownership vocabulary; immortal objects and free-threaded caveats constrain literal refcount reasoning. | It is C-extension/API material, not a recommendation to mutate Python object headers. |
| C24-02 | [Memory management C API](https://docs.python.org/3.14/c-api/memory.html) | CPython's private heap and allocator domains have a layered design; documented defaults differ between regular and free-threaded builds. | Do not infer a particular allocation layout, arena state, or process footprint from a high-level Python program. |
| C24-03 | [Cyclic GC support C API](https://docs.python.org/3.14/c-api/gcsupport.html) | Cycle collection depends on support from container object types that participate in the protocol. | The C API does not make individual Python objects' tracking/lifetime a language guarantee. |
| C24-04 | [Thread states and the GIL C API](https://docs.python.org/3.14/c-api/threads.html) | Attached thread state, GIL-enabled versus free-threaded configuration, and extension/native boundaries require explicit reasoning. | It does not prove application-level data-race safety or throughput. |
| C24-05 | [PEP 659](https://peps.python.org/pep-0659/) | The specializing adaptive interpreter is CPython implementation design/rationale. | No current M24 test asserts an exact specialization transition or numerical speedup. |
| C24-06 | [PEP 683](https://peps.python.org/pep-0683/) | Immortal-object design explains why refcount values may be nonliteral. | Do not teach a fixed immortal-object set or use it as a leak detector. |
| C24-07 | [PEP 703](https://peps.python.org/pep-0703/) and [PEP 779](https://peps.python.org/pep-0779/) | Free-threading changes implementation and compatibility assumptions; it requires separately labelled comparison evidence. | Neither PEP makes a specific Atlas workload faster. |
| C24-08 | [PEP 744](https://peps.python.org/pep-0744/) | CPython's JIT is an implementation effort with explicit experimental/status and workload caveats. | Do not use it as a generic performance prescription. |
| C24-09 | [CPython v3.14.6 tag](https://github.com/python/cpython/tree/v3.14.6) | The exact code-reading baseline is public and version-pinned. | Source reading establishes no fact about an unrecorded local binary or another tag. |

### Operating-system and native/vectorized sources

| ID | Primary source | Teaching use | Boundary |
|---|---|---|---|
| O24-01 | [Windows GetProcessMemoryInfo](https://learn.microsoft.com/en-us/windows/win32/api/psapi/nf-psapi-getprocessmemoryinfo) | On the course's Windows path, demonstrate that an OS API reports a named process-memory counter structure. | The report must name the exact field/units/API; it is not interchangeable with Python allocations, virtual memory, or retained object graphs. |
| O24-02 | [Python resource](https://docs.python.org/3.14/library/resource.html) | Contrast Unix resource accounting/limits with the Windows course path. | This module is Unix-only; do not provide Windows recipes or cross-OS equivalence claims through it. |
| N24-01 | [NumPy performant-code guide](https://numpy.org/doc/stable/user/basics.performant_code.html) | Optional native/vectorized experiments must make data shape, copies, dtype, library version, and thread configuration visible. | An external package is not a course prerequisite or a universal solution. |
| N24-02 | [NumPy vectorize](https://numpy.org/doc/stable/reference/generated/numpy.vectorize.html) | Counter the misconception that every API called vectorize executes a compiled vector loop; NumPy documents this helper as convenience rather than performance. | No conclusion about a different NumPy ufunc, BLAS backend, or native library follows. |
| N24-03 | [NumPy NEP 38](https://numpy.org/neps/nep-0038-SIMD-optimizations.html) | Optional source reading: native dispatch can be conditioned by CPU and build support. | SIMD path, dispatch choice, and result speed must be observed with an exact NumPy wheel/host, never presumed. |

### University sources: pedagogy and systems vocabulary only

| ID | Source | Use in Module 24 | Non-use |
|---|---|---|---|
| U24-01 | [MIT 6.172, Performance Engineering of Software Systems](https://ocw.mit.edu/courses/6-172-performance-engineering-of-software-systems-fall-2018/) | Sequence the module as design/review/measurement/report rather than a trick catalogue; use its project-review spirit as inspiration. | Do not copy assignments, handouts, benchmark code, videos, solutions, grading rules, or performance claims into Atlas. |
| U24-02 | [UC Berkeley CS 61C memory-hierarchy notes](https://notes.cs61c.org/content/caches-intro/memory-hierarchy/) | Explain why data layout/locality is a systems hypothesis whose relevance must be measured at the right layer. | Do not make CPU/cache numeric claims for the learner's unrecorded host or substitute this for CPython memory evidence. |
| U24-03 | [UC Berkeley CS 61C AMAT notes](https://notes.cs61c.org/content/caches-intro/amat/) | Provide optional prerequisite refresh on the difference between an analytic memory model and a program measurement. | Do not apply the course's assumed hardware parameters to Atlas. |

University materials influence ordering and questions, not the authority of
Python semantics, CPython internals, Windows metrics, or NumPy implementation
behavior.

---

## Claim-to-source matrix

The following matrix is the claim ledger that workbook writers, TA agents, and
reviewers must use. “Evidence required” means the minimum evidence to say the
claim; stronger words require stronger, explicitly added evidence.

| Claim ID | Allowed claim | Source and evidence required | Classification | Prohibited extension |
|---|---|---|---|---|
| M24-C01 | Python source semantics are evaluated according to the named language contract; cost is a separate question. | P24-01 plus an Atlas contract/oracle. | [LANGUAGE GUARANTEE] plus [COURSE MODEL] | “The language promises this timing/layout.” |
| M24-C02 | This trusted function's displayed bytecode is a CPython 3.14.6 observation. | P24-02, C24-09, exact dis options/output, local runtime header. | [CPYTHON 3.14.6 OBSERVATION] | “All Python implementations execute this way.” |
| M24-C03 | This variant's repeat vector was lower under this stated timeit/perf_counter protocol. | P24-03, raw repeats, workload, variants, runtime/host header. | [MEASUREMENT] | “It is faster everywhere” or “GC was represented” when default GC was disabled. |
| M24-C04 | This named Python call path dominated the chosen cProfile run. | P24-04, profile configuration, workload, pstats result. | [MEASUREMENT] | “It consumes this many CPU cycles” or “native work is absent.” |
| M24-C05 | Traced Python allocations changed between named snapshots. | P24-05, start point, traceback depth, snapshots/diff, redaction. | [MEASUREMENT] | “Process RSS changed by the same amount” or “this proves a leak.” |
| M24-C06 | getsizeof reports the direct size of this object in this run. | P24-07, type/value/runtime header. | [STDLIB CONTRACT] plus [MEASUREMENT] | “This is the total graph/process size.” |
| M24-C07 | getrefcount is a CPython diagnostic observation with temporary-reference and immortal-object caveats. | P24-07 and C24-01. | [CPYTHON 3.14.6 OBSERVATION] | “The count identifies the number of real owners or a leak.” |
| M24-C08 | A cycle may require the optional cyclic collector in addition to reference counting. | P24-06 and C24-03, followed by a named local fixture/test. | [STDLIB CONTRACT] plus [MEASUREMENT] | “Calling collect returns memory to the OS” or “all objects are tracked.” |
| M24-C09 | Allocator behavior is CPython build/configuration-specific; regular and free-threaded builds may differ. | C24-02 and runtime build metadata. | [CPYTHON 3.14.6 OBSERVATION] | “Every CPython uses pymalloc/mimalloc in this way.” |
| M24-C10 | This process counter changed according to a named OS API/tool. | O24-01 or named alternative, field/units/timestamps, host header. | [OS/NATIVE OBSERVATION] | “Python code allocated exactly this many bytes.” |
| M24-C11 | The optional free-threaded comparison ran under a separately evidenced configuration. | P24-09, C24-04/C24-07, build/GIL/runtime header, semantic oracle, measurement. | [CPYTHON 3.14.6 OBSERVATION] plus [MEASUREMENT] | “Threads are now correct/faster by default.” |
| M24-C12 | The experimental JIT is available/enabled only if the exact build reports it; any effect is workload-specific. | P24-10, C24-08, local availability record, semantic oracle, measurement. | [CPYTHON 3.14.6 OBSERVATION] plus [MEASUREMENT] | “JIT makes Python generally fast” or “is present in every 3.14 executable.” |
| M24-C13 | An optional native/vectorized variant produced equivalent outputs and a named end-to-end result. | N24-01/N24-02/N24-03, pinned package version, copy/conversion accounting, library thread settings, semantic oracle, measurement. | [OS/NATIVE OBSERVATION] plus [MEASUREMENT] | “Vectorization” explains an unmeasured speedup. |
| M24-C14 | The proposed mechanism remains a hypothesis if at least one plausible alternative was not controlled or measured. | Experiment record, alternatives/falsifier field. | [HYPOTHESIS] or [UNKNOWN] | An agent or reviewer may silently upgrade it to a conclusion. |

---

## Pinned CPython 3.14.6 source-reading map

### Reproducible pin and method

Use the [official CPython v3.14.6 tag](https://github.com/python/cpython/tree/v3.14.6)
for all source links and annotate every note with:

~~~text
implementation: CPython
source_tag: v3.14.6
artifact: exact path and revision
claim_level: source-reading observation, not public contract
question: what mechanism is this code trying to expose?
nonclaim: what cannot be inferred from this excerpt?
~~~

Read only the smallest relevant region after a learner has predicted the
mechanism. Do not paste large source excerpts into the workbook or web studio.
The target is architectural reading: identify data ownership, control flow,
invariants, and interfaces, then map the observation back to the experiment.

### Source snippet targets

| Target | Learner question | Allowed takeaway | Mandatory non-claim |
|---|---|---|---|
| [Include/internal/pycore_frame.h](https://github.com/python/cpython/blob/v3.14.6/Include/internal/pycore_frame.h) | Which frame representations are internal to this CPython tag, and why does a logical call frame not imply one stable public heap layout? | Frames have implementation representations beneath Python's call semantics. | Frame fields/addresses/size are portable Python API. |
| [Python/ceval.c](https://github.com/python/cpython/blob/v3.14.6/Python/ceval.c) | Where does this source connect evaluation/thread-state concerns, and what layer is still hidden? | Interpreter evaluation is an implementation layer between bytecode and hardware. | An excerpt maps one source line to a fixed CPU instruction count. |
| [Python/bytecodes.c](https://github.com/python/cpython/blob/v3.14.6/Python/bytecodes.c) | How are bytecode/micro-op definitions organised, and why can dis output change across releases? | The bytecode interpreter is generated/maintained implementation machinery. | A learner can infer a stable opcode curriculum or performance formula. |
| [Python/specialize.c](https://github.com/python/cpython/blob/v3.14.6/Python/specialize.c) | Which feedback/specialization concepts are present in this tag, and what would a measurement need to establish? | Specialization is a plausible CPython mechanism worth an observed, version-labelled investigation. | A source symbol proves specialization occurred in this run or caused a particular speedup. |
| [Objects/object.c](https://github.com/python/cpython/blob/v3.14.6/Objects/object.c) and [Include/object.h](https://github.com/python/cpython/blob/v3.14.6/Include/object.h) | How do object/type/reference-count concepts appear in the implementation versus the C-API ownership contract? | C-level lifetime management involves conventions and internal representation. | Python code should mutate refcounts or expect a universal header layout. |
| [Modules/gcmodule.c](https://github.com/python/cpython/blob/v3.14.6/Modules/gcmodule.c) and [InternalDocs/garbage_collector.md](https://github.com/python/cpython/blob/v3.14.6/InternalDocs/garbage_collector.md) | What does the collector track/collect, and why are gc API results observational rather than a heap diagram? | Cycle collection is a distinct CPython subsystem with version-sensitive policy. | One gc result accounts for all process memory or all reachable references. |
| [Objects/obmalloc.c](https://github.com/python/cpython/blob/v3.14.6/Objects/obmalloc.c) | Which allocator abstractions/pools exist in this tag, and which layer must an experiment measure before attributing RSS? | Allocation policy can make object lifetime, traced blocks, and OS residency diverge. | A high-level allocation count yields a fixed arena/RSS result. |
| [Objects/listobject.c](https://github.com/python/cpython/blob/v3.14.6/Objects/listobject.c) | How can an implementation growth strategy support amortized reasoning without becoming a public layout promise? | A source reading can motivate an allocation hypothesis for a list-heavy workload. | Exact resize thresholds/bytes will remain stable or apply to all Python VMs. |
| [Python/jit.c](https://github.com/python/cpython/blob/v3.14.6/Python/jit.c) | If an eligible build exposes a JIT, what runtime/build checks and experiment controls are required? | The experimental JIT is a separately scoped CPython implementation path. | It is part of every 3.14.6 runtime or improves this workload. |

### Source-reading prompts

For each target, the learner should answer in a two-column note:

| Read the code for | Then write |
|---|---|
| data representation | Which representation or ownership relation is visible? |
| control boundary | What event/condition chooses a path? |
| version/configuration | Which tag/build assumptions make this a CPython observation? |
| experiment bridge | What measurable consequence would the source suggest, without predicting an outcome? |
| uncertainty | Which allocator, OS, compiler, CPU, native-library, or workload facts remain unobserved? |

The workbook must not use a source screenshot as decoration. Every source
target needs a prediction, a constrained question, a non-claim, and a
measurement or design decision that follows from it.

---

## Teaching sequence and session claim boundaries

The sessions form one investigation instead of a collection of profiling
tools. A single synthetic Atlas cohort-summary workload travels through every
session. It begins as a correct, deliberately allocation-heavy reference
implementation and receives one carefully bounded change at a time.

### Shared local scenario

Atlas computes a redacted concept summary from immutable synthetic learning
events. The public contract names:

- accepted event schema and deterministic order;
- count/sum/mean semantics, including empty and invalid cases;
- stable tagged errors and no mutation of input;
- redacted evidence fields only;
- a generated, fixed-seed fixture family with small/medium/large,
  sorted/shuffled, and low/high-cardinality shapes.

It deliberately excludes real learner records, databases, network calls,
wall-clock policy, production metadata, and UI rendering. A second,
structurally different oracle recomputes the required results from the public
contract. The optimization target can therefore be assessed as **semantic
equivalence plus cost evidence**, not merely as an attractive patch.

| Session | Connected question | Required source/observation | What may be claimed after session | What must remain unclaimed |
|---|---|---|---|---|
| 24.1 — Cost is a claim | What result/error/effect must not change, and what workload represents the problem? | M5/M13/M23 retrieval; public contract; independent oracle; workload matrix. | The experiment has a declared semantic boundary and workload family. | Any speed/memory explanation. |
| 24.2 — Runtime provenance | Which interpreter, build, host, dependencies, and controls could change the result? | P24-08 plus a captured local header; distinction between course baseline and optional variants. | This run is reproducibly described enough to compare with another similarly recorded run. | Two different machines/builds are controlled equivalents. |
| 24.3 — Frames and bytecode | What does trusted source → code object/frame → dis expose, and at what layer? | P24-02, P24-07, C24-09; one fixed local snippet and source target. | A specific CPython 3.14.6 dis/frame observation is labelled correctly. | Opcode count, frame layout, or CPU cost is language law. |
| 24.4 — Values, ownership, and direct size | Why do references, aliases, container edges, and direct size differ from total retained memory? | P24-07 and C24-01; small object graph and getsizeof/getrefcount probes. | The learner can state direct-size and refcount caveats for the named probe. | A graph/process memory total or leak verdict. |
| 24.5 — Cycles, collector, and allocation | When does reference counting release an object, when can a cycle persist, and what do GC/tracemalloc observe? | P24-05, P24-06, C24-02/C24-03; deterministic cycle fixture and snapshot protocol. | A tagged local observation distinguishes GC tracking, cyclic collection, and traced Python allocation. | OS-memory reclamation, all-object coverage, or stable generation folklore. |
| 24.6 — Measure before changing | Which metric answers the question, and what do timeit/cProfile/tracemalloc perturb or omit? | P24-03/P24-04/P24-05; baseline repeat vector, profile, snapshots. | A baseline table reports named quantities and its blind spots. | A causally complete explanation. |
| 24.7 — One intervention, competing explanations | Is an algorithmic/data-structure/object-creation change equivalent, and which evidence shifts? | One narrowly scoped patch; oracle, regression, repeat/profile/allocation replay. | A bounded comparative result and a ranked hypothesis set. | A universal optimization or explanation beyond controlled variables. |
| 24.8 — Native/vectorized and runtime variants | Where do conversion, copies, native dispatch, threading, free-threading, or JIT configuration enter? | N24-01/N24-02/N24-03 and P24-09/P24-10 only when adapter exists. | An exact optional variant can be compared end-to-end with explicit environment evidence. | Native/vectorized/free-threaded/JIT as a synonym for faster. |
| 24.9 — Evidence review and handoff | Can another reviewer reproduce, challenge, and safely use the conclusion? | Complete report; source map claim labels; TA review rubric. | The project makes one defensible narrow recommendation and one explicit unknown. | A capacity, accessibility, security, or human-benefit conclusion not separately evaluated. |

### Session-level reading rule

Each session must use a **source card** with:

1. source ID and link;
2. exact claim classification;
3. a learner prediction before reveal;
4. the one sentence that Atlas may paraphrase;
5. the nearby non-claim;
6. one observation or test that would be needed to move from source reading
   to a local result.

This keeps difficult implementation material legible without turning the
course into disconnected documentation fragments.

---

## Atlas optimization checkpoint and evidence bundle

### Required variants

The project must compare no more than three variants at a time:

1. **Reference:** intentionally clear, contract-correct implementation.
2. **Algorithm/representation candidate:** a change that plausibly reduces
   repeated work or temporary-object creation while preserving public results.
3. **Optional native/runtime candidate:** only if a pinned local adapter and
   appropriate dependency/build evidence exist. Its conversion/copy/setup
   costs must remain in the end-to-end measurement.

Do not combine several changes in one comparison. If a generated patch changes
both the algorithm and the data representation, split it or label the
mechanism **unknown/confounded**.

### Minimum evidence bundle

| Artifact | Required content | What it establishes | What it does not establish |
|---|---|---|---|
| Contract + oracle | Result, error, mutation/effect, order, redaction cases; independent recomputation. | Selected semantic equivalence evidence. | Full formal proof. |
| Workload ledger | Sizes, seeds, distributions, order, fixture generator, intended use case. | The comparison's input scope. | Production representativeness. |
| Provenance header | CPython patch/build, executable, OS/architecture, source/dependency revisions, process controls. | Reproduction context. | Cross-host equivalence. |
| Timing record | Raw repeat values, timer, GC policy, warm-up, setup placement, units. | A bounded timing comparison. | A causal mechanism or capacity forecast. |
| Profile record | Profiler type/options and top call relationships for one run. | Where to investigate in that run. | Benchmark-quality timing or native CPU cost. |
| Allocation record | tracemalloc start/frame depth, snapshots/diffs, direct-size probes where relevant. | Traced Python allocation evidence. | RSS/all native allocations/retention proof. |
| OS/native record | Named tool/API/library version and exact field/settings, only if used. | Layer-specific host/native observation. | Equality with Python-level evidence. |
| Attribution table | Candidate mechanisms, supporting evidence, alternatives, unknowns, next falsifier. | Honest causal reasoning. | Certainty by omission. |
| Review note | What the agent proposed, what the learner verified/rejected, and why. | Human oversight of AI assistance. | That an agent's summary is trustworthy alone. |

### Required conclusion template

~~~text
For [workload family] on [exact CPython/build/host], variant [B] produced
[named measurement comparison] relative to [A], while [named oracle/tests]
agreed on [listed contract cases]. The evidence is consistent with
[one/two mechanisms] because [profile/allocation/source-reading link].
It does not isolate [plausible alternative], does not predict [other
workload/host/implementation], and should next be challenged by [falsifier].
~~~

### Attribution discipline

| Explanation class | Example wording | Evidence needed | Do not collapse it into |
|---|---|---|---|
| Algorithmic | “This candidate avoids repeated linear scans in the declared workload.” | Code review, complexity argument, oracle, size-family timing. | “CPython got faster.” |
| Representation/allocation | “This candidate creates fewer traced temporary Python blocks for this fixture.” | Snapshot diff, source review, equivalent result. | “RSS falls by that amount.” |
| CPython runtime | “This CPython 3.14.6 run exposed this dis/profile behavior.” | Version-labelled observation and controlled comparison. | Language guarantee or exact cause without experiment. |
| Native/vectorized | “The pinned native variant improved end-to-end time for contiguous float input after conversion costs.” | Package/build/thread/configuration record, oracle, end-to-end timing. | Generic “NumPy/SIMD is faster.” |
| OS/system | “The named Windows counter changed during the measured process phase.” | Exact API metric/units/timing and host record. | Python allocation source or user-visible capacity. |
| Hypothesis | “Allocation churn may contribute.” | A proposed discriminating experiment. | A finished explanation. |

### Performance report review rubric

The reviewer should assess *argument quality*, not merely whether a candidate
is faster in a screenshot.

| Review question | Strong evidence | Insufficient evidence |
|---|---|---|
| Did the change preserve behavior? | Contract cases, independent oracle, error/effect/ordering checks. | Same value on one happy-path input. |
| Is the comparison fair? | One scoped intervention, workload ledger, equivalent setup, provenance header. | Two unrelated scripts or unrecorded host states. |
| What quantity changed? | Correctly named timer/profile/allocation/OS metric with raw data. | A generic memory or performance number. |
| Is a mechanism distinguished? | Evidence connects source hypothesis to controlled observation and names alternatives. | A plausible story after seeing a chart. |
| Are system/native boundaries honest? | Conversion, copies, dependencies, threads, build, and OS counter semantics are visible. | “The library is in C, therefore it is fast.” |
| Is the conclusion reusable? | Bounded wording, counter-workload, next falsifier, explicit unknown. | Universal prediction, causal certainty, or an AI-generated assertion. |

---

## Visual-studio and assessment authoring brief

### Required visual views

The HTML studio should use original diagrams, keyboard-reachable controls,
visible focus, text equivalents, high contrast, reduced-motion support, and
prediction → confidence → reveal interactions. It must never execute user
source or run an uncontrolled benchmark in the browser.

1. **Claim-stack lens** — A statement travels through semantic contract,
   workload, provenance, timer/allocation/profile/OS evidence, hypothesis,
   and conclusion cards. Learner labels the strongest defensible statement.
2. **Runtime-layer map** — Source semantics → code object/frame → CPython
   bytecode/adaptive implementation → C/native boundary → OS process → CPU
   hardware. Each arrow displays its evidence type and blind spots.
3. **Ownership and retention theatre** — An original graph shows aliases,
   container edges, a cycle, reference-count release, optional cyclic
   collection, direct size, and a separate process-memory-unknown boundary.
4. **Measurement laboratory** — Learner selects timeit, cProfile,
   tracemalloc, getsizeof, gc, or an OS counter for a question, then sees
   what it supports and omits. It must explicitly reveal the timeit GC
   default and profiler perturbation.
5. **Attribution board** — Baseline/candidate table with raw repeat vectors,
   semantic oracle, snapshot difference, profile clue, competing causes, and
   next falsifier. The board prevents a conclusion until all required cells
   are present.
6. **Native-boundary ledger** — A path separates Python-to-array conversion,
   copies/views, dispatch, native kernel, thread configuration, return
   conversion, and end-to-end output. Learner predicts which omitted cost
   invalidates a vectorization claim.

### Confidence-aware diagnostics

Questions must be multiple choice with one best answer, a confidence rating,
and an explanation that points to the evidence label rather than merely the
right vocabulary.

| Prompt | Best understanding demonstrated | Misconception rejected |
|---|---|---|
| A cProfile table puts a Python wrapper at the top. What should happen next? | Treat it as an investigation lead, inspect workload/call graph, and use an appropriate timing comparison. | “The profile proves the wrapper's CPU cost is the optimization.” |
| Two timeit variants differ but one allocates cycles. What must the report state? | Whether GC was disabled/re-enabled and why that suits the claim. | “timeit automatically measures normal GC behavior.” |
| getsizeof on a list is smaller than the sum of objects reachable from it. Which statement is defensible? | Direct size is not transitive size; choose a graph/tracing/OS observation based on the question. | “getsizeof is broken” or “this is process memory.” |
| getrefcount is high for a value. Which conclusion is valid? | It is a CPython diagnostic observation with temporary-reference/immortal caveats. | “It proves a memory leak/owner count.” |
| A disassembly changes after a Python patch release. What changed? | A version-specific CPython implementation observation; semantics may still be unchanged. | “The Python language changed” or “one output is faster.” |
| A NumPy vectorize wrapper is proposed. Which verification is required? | Verify semantic equivalence and end-to-end measurement; do not assume native compiled iteration. | “The word vectorize guarantees speed.” |
| A native variant shows less tracemalloc growth but more OS working set. What is the right conclusion? | The instruments observe different layers; report both and keep mechanism uncertain. | “One instrument is wrong” or “memory objectively went down.” |
| A free-threaded/JIT build wins on one fixture. What is still required? | Exact build/GIL/JIT status, semantic oracle, broader workload/compatibility limits, and narrow wording. | “This is now the course default performance result.” |

### TA and study-partner protocol

| Moment | Instructor | TA | Study Partner |
|---|---|---|---|
| Before measurement | Names the contract, workload, and one source card. | Requests a prediction, confidence, metric, and non-claim. | Restates the proposed causal chain in plain language. |
| During source reading | Reveals the smallest pinned snippet after prediction. | Asks “which layer does this line belong to?” and “what would you measure next?” | Draws the source → observation → conclusion chain with the learner. |
| During a profile/trace | Keeps source, configuration, and privacy boundary visible. | Asks what the instrument excludes and whether it perturbs the result. | Challenges any jump from correlation to cause. |
| After a candidate patch | Checks oracle and regression evidence before performance. | Runs an attribution checklist and asks for one competing explanation. | Plays skeptical reviewer: “Would it still hold if input order/host/build changed?” |
| At handoff | Assesses the evidence bundle and uncertainty statement. | Identifies the smallest next falsifier. | Helps articulate an oral defense that separates fact, observation, and hypothesis. |

TA repair prompts:

- If the learner says “dis proves it is faster,” ask for a version label, a
  workload/timing protocol, and one mechanism not visible in dis.
- If they say “tracemalloc is memory,” ask “memory at which layer?” and place
  Python blocks, native heap, and OS working set on separate cards.
- If they say “GC fixed the leak,” ask whether object reachability, retained
  ownership, traced blocks, and OS residency were each observed.
- If they say “the agent optimized it,” request the contract delta, diff
  scope, raw measurement, source support, and uneliminated alternative.
- If they say “NumPy/free-threading/JIT is faster,” ask for exact package/build
  configuration, end-to-end conversion cost, and a counter-workload.

---

## Licensing, reuse, and access ledger

| Material | Allowed Atlas use | Attribution/reuse rule |
|---|---|---|
| Python 3.14 documentation | Link and paraphrase narrowly; cite the source card near the claim. | Python docs state the PSF License Version 2, with examples/recipes additionally under 0BSD. Do not bulk-copy pages or examples; retain attribution if a permitted excerpt is ever necessary. |
| CPython v3.14.6 source | Link to a small pinned target; use original explanation/diagram and, only if essential, a very short annotated excerpt. | CPython is distributed under the PSF License. Preserve notices and exact tag/path when copying permitted material; prefer links over excerpts. Internal headers/source are not a stable public interface. |
| PEPs | Link and paraphrase a relevant design/status boundary. | Check each PEP's stated copyright/license before any quotation. Do not reproduce a PEP as course prose. |
| Microsoft Learn Windows API documentation | Link for OS-counter naming and semantics on the Windows path. | Follow the page's Microsoft terms; write original procedures/diagrams and do not republish page content. |
| NumPy documentation/NEPs | Optional source cards for a pinned package experiment only. | Follow NumPy's current documentation/source license for the exact release; record the package version and write original exercises. |
| MIT OCW and Berkeley course materials | Link as pedagogical context only. | Respect each page/asset's current license and course terms. Do not copy slides, videos, assignments, figures, solutions, code, or grading material. |
| Atlas workbooks/studio/model/report | Original course artifacts. | Keep source-map links, runtime labels, fixture provenance, and measurement headers in the repository. |

### Asset policy for the artistic HTML course

- Draw original runtime, ownership, and evidence diagrams; do not trace or
  embed external lecture figures.
- Prefer CSS/SVG/HTML and original captions. Any third-party visual asset
  needs a separate license record, accessible description, and rationale.
- Link an external source card instead of embedding a screenshot of
  documentation, profiler output with user paths, or CPython source.
- Generate charts from deterministic synthetic raw measurements stored with
  the exact experiment record; label them as local measurements, not general
  facts.

---

## Workbook-author acceptance checklist

### Conceptual coherence

- [ ] The workbook begins with contract/workload/provenance before any timing
  tool, bytecode card, or optimization patch.
- [ ] Every session returns to the same Atlas summary workload and the same
  semantic oracle rather than introducing a disconnected microbenchmark.
- [ ] Module 5 algorithmic reasoning, Module 6–9 representations, Module 13
  evidence, Module 17 layers, Module 19 execution configuration, and Module
  23 semantics are explicitly retrieved.
- [ ] The later-preview note says that technical speed is not human benefit,
  accessibility, fairness, or responsible AI evaluation—and does not present
  M25/M26 as Module 24's direct forward route.

### Source and version accuracy

- [ ] Every Python claim links to Python 3.14 documentation and is labelled
  language contract, standard-library contract, or CPython observation.
- [ ] Every implementation source link uses the v3.14.6 tag, never main,
  unpinned GitHub search, or a stale release.
- [ ] Every dis/frame/refcount/allocator/specialization/JIT statement carries
  a CPython/version/configuration caveat.
- [ ] GC material states the 3.14.6 baseline and does not reuse pre-3.14.5
  generation/threshold folklore as timeless fact.
- [ ] Free-threading and experimental JIT remain optional comparison targets
  unless a particular local adapter is executed and audited.

### Measurement integrity

- [ ] Every chart/table has a full experiment header, raw result location,
  unit, repeat/warm-up policy, workload, and environment provenance.
- [ ] The timing route says whether it measures elapsed or process time and
  whether GC was enabled during timing.
- [ ] Profiling is used to choose questions, not as a substitute for a
  controlled timing conclusion.
- [ ] tracemalloc, getsizeof, refcount, GC, native-library, and OS metrics
  are never merged into an unlabeled generic memory number.
- [ ] Every intervention passes an independent semantic oracle before a
  performance result is shown.
- [ ] At least one competing explanation and one next falsifier remain visible
  in every conclusion.

### Safety, privacy, and learning design

- [ ] Fixtures are synthetic, deterministic, bounded, and free of secrets,
  real learner data, raw production traces, and sensitive filesystem paths.
- [ ] No exercise changes allocator hooks, unsafe native memory, process
  limits, global interpreter behavior, or production configuration.
- [ ] AI assistance is framed as proposal generation and review; it cannot
  upgrade a hypothesis to evidence.
- [ ] Visuals are accessible and interactive through prediction/reveal rather
  than passive, unlabelled decoration.
- [ ] Diagnostic questions assess layer attribution and causal reasoning, not
  opcode names or hand-typed benchmark boilerplate.
- [ ] External material is paraphrased and linked according to the ledger.

---

## Compact source index

### Python and CPython

- [Python 3.14 language reference](https://docs.python.org/3.14/reference/index.html)
- [Python 3.14 data model](https://docs.python.org/3.14/reference/datamodel.html)
- [dis](https://docs.python.org/3.14/library/dis.html)
- [timeit](https://docs.python.org/3.14/library/timeit.html)
- [profile and cProfile](https://docs.python.org/3.14/library/profile.html)
- [tracemalloc](https://docs.python.org/3.14/library/tracemalloc.html)
- [gc](https://docs.python.org/3.14/library/gc.html)
- [sys](https://docs.python.org/3.14/library/sys.html)
- [platform](https://docs.python.org/3.14/library/platform.html)
- [sysconfig](https://docs.python.org/3.14/library/sysconfig.html)
- [Reference counting C API](https://docs.python.org/3.14/c-api/refcounting.html)
- [Memory management C API](https://docs.python.org/3.14/c-api/memory.html)
- [Cyclic GC support C API](https://docs.python.org/3.14/c-api/gcsupport.html)
- [Thread states and GIL C API](https://docs.python.org/3.14/c-api/threads.html)
- [Free-threading HOWTO](https://docs.python.org/3.14/howto/free-threading-python.html)
- [What is new in Python 3.14](https://docs.python.org/3.14/whatsnew/3.14.html)
- [CPython v3.14.6 source](https://github.com/python/cpython/tree/v3.14.6)
- [PEP 659](https://peps.python.org/pep-0659/)
- [PEP 683](https://peps.python.org/pep-0683/)
- [PEP 703](https://peps.python.org/pep-0703/)
- [PEP 779](https://peps.python.org/pep-0779/)
- [PEP 744](https://peps.python.org/pep-0744/)

### Native/OS and university context

- [Windows GetProcessMemoryInfo](https://learn.microsoft.com/en-us/windows/win32/api/psapi/nf-psapi-getprocessmemoryinfo)
- [NumPy performant code](https://numpy.org/doc/stable/user/basics.performant_code.html)
- [NumPy vectorize](https://numpy.org/doc/stable/reference/generated/numpy.vectorize.html)
- [NumPy NEP 38](https://numpy.org/neps/nep-0038-SIMD-optimizations.html)
- [MIT 6.172](https://ocw.mit.edu/courses/6-172-performance-engineering-of-software-systems-fall-2018/)
- [Berkeley CS 61C memory hierarchy](https://notes.cs61c.org/content/caches-intro/memory-hierarchy/)
- [Berkeley CS 61C AMAT](https://notes.cs61c.org/content/caches-intro/amat/)

## Final research verdict

Module 24 can responsibly be demanding without pretending that runtime
internals are simple or that measurement makes uncertainty disappear. The
learner's durable skill is a disciplined performance argument:

~~~text
preserved semantics
    + representative bounded workload
    + reproducible environment
    + layer-appropriate observation
    + controlled intervention
    + competing explanations
    + explicit unknowns
    = a reviewable, evidence-based optimization claim
~~~

That is the right foundation for reading AI-generated performance patches,
debugging production-like systems, and deciding when “faster” is actually a
useful, trustworthy engineering conclusion.
