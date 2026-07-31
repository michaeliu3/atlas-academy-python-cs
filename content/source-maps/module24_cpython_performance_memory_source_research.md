# Module 24 — CPython, Performance, and Memory: Primary-Source Research Note

## Status and scope

- **Status:** authoring-only research input; non-promoting.
- **Research access date:** 2026-07-30.
- **Purpose:** constrain Module 24 explanations, source-reading prompts, and
  experiment language. It does not change learner routing, contract status,
  review state, publication state, deployment state, or a security claim.
- **Method:** use the Python 3.14 documentation for documented interfaces and
  the official CPython `v3.14.6` tag for implementation reading. The tagged
  tree identifies itself as Python 3.14.6; the moving `main` branch is not the
  course's code-reading baseline. [CPython v3.14.6](https://github.com/python/cpython/tree/v3.14.6)

## Source ledger

All entries are read as primary sources on 2026-07-30. “Link-only/paraphrase”
means this note copies no external source code, prose, figures, or benchmark
results. For Python documentation and CPython source, consult the official
[PSF License v2](https://docs.python.org/3.14/license.html) before any reuse
beyond that boundary; PEP entries are also link-only/paraphrase pending any
separate reuse review.

| Source | Owner | Exact claim boundary | Access date | Reuse/license note |
|---|---|---|---|---|
| [Language reference](https://docs.python.org/3.14/reference/index.html) | Python Software Foundation (PSF) | Source-language semantics and syntax only; not layout, opcode, allocator, or speed guarantees. | 2026-07-30 | Link-only/paraphrase; see PSF License v2. |
| [`id()`](https://docs.python.org/3.14/library/functions.html#id) | PSF | Identity during an object's lifetime; CPython's address interpretation is implementation-specific. | 2026-07-30 | Link-only/paraphrase; see PSF License v2. |
| [`sys`](https://docs.python.org/3.14/library/sys.html#sys.getrefcount) | PSF | `getrefcount()` and `getsizeof()` API limits, including temporary-reference and direct-size boundaries. | 2026-07-30 | Link-only/paraphrase; see PSF License v2. |
| [`gc`](https://docs.python.org/3.14/library/gc.html) | PSF | Optional cyclic-collector API, documented version changes, and stated collection scope. | 2026-07-30 | Link-only/paraphrase; see PSF License v2. |
| [`tracemalloc`](https://docs.python.org/3.14/library/tracemalloc.html) | PSF | Traced Python allocation blocks, snapshots, and tracer overhead; not process-wide memory accounting. | 2026-07-30 | Link-only/paraphrase; see PSF License v2. |
| [`timeit`](https://docs.python.org/3.14/library/timeit.html) | PSF | Small-snippet timing behavior, timer/GC policy, repetitions, and interference caveats. | 2026-07-30 | Link-only/paraphrase; see PSF License v2. |
| [`profile` / `cProfile`](https://docs.python.org/3.14/library/profile.html) | PSF | Deterministic-profiling scope and the documented reason it is not a benchmark. | 2026-07-30 | Link-only/paraphrase; see PSF License v2. |
| [`dis`](https://docs.python.org/3.14/library/dis.html) | PSF | CPython-bytecode inspection and its explicit cross-version/VM limits. | 2026-07-30 | Link-only/paraphrase; see PSF License v2. |
| [CPython `v3.14.6` source tag](https://github.com/python/cpython/tree/v3.14.6) and [`Python/specialize.c`](https://github.com/python/cpython/blob/v3.14.6/Python/specialize.c) | Python core developers / PSF | Version-pinned implementation reading only; no claim about an unrecorded local binary or another tag. | 2026-07-30 | Link-only/paraphrase; see PSF License v2. |
| [PEP 659](https://peps.python.org/pep-0659/) | Python Steering Council / PEP authors | Design rationale for the specializing adaptive interpreter; not a measured result for an Atlas workload. | 2026-07-30 | Link-only/paraphrase; no PEP text copied. |
| [PEP 683](https://peps.python.org/pep-0683/) | Python Steering Council / PEP authors | CPython immortal-object design and its private implementation boundary. | 2026-07-30 | Link-only/paraphrase; no PEP text copied. |
| [PEP 703](https://peps.python.org/pep-0703/), [free-threading HOWTO](https://docs.python.org/3.14/howto/free-threading-python.html), and [What's New in 3.14](https://docs.python.org/3.14/whatsnew/3.14.html) | Python Steering Council / PSF | Free-threaded build behavior and configuration; no workload-independent throughput claim. | 2026-07-30 | Link-only/paraphrase; no PEP text copied; see PSF License v2 for docs. |
| [PEP 744](https://peps.python.org/pep-0744/) and [What's New in 3.14 — JIT](https://docs.python.org/3.14/whatsnew/3.14.html#jit-compiler) | PEP authors / PSF | JIT status, availability, and documented workload dependence; not a default-runtime or speed guarantee. | 2026-07-30 | Link-only/paraphrase; no PEP text copied; see PSF License v2 for docs. |

## Findings for Module 24

1. **Separate language law from CPython evidence.** Use the [Python Language
   Reference](https://docs.python.org/3.14/reference/index.html) for
   source-level semantics, while treating a `dis` listing as a CPython-only
   observation: the [official `dis` documentation](https://docs.python.org/3.14/library/dis.html)
   explicitly calls bytecode an implementation detail and disclaims
   cross-version and cross-VM stability. This is the reason every layout,
   opcode, allocator, or timing observation needs an implementation/version
   label.

2. **Use `id()` for a bounded alias observation, not an object history.** The
   official [`id()` contract](https://docs.python.org/3.14/library/functions.html#id)
   says the value is unique and constant only during an object's lifetime and
   can be reused by non-overlapping lifetimes; the address interpretation is
   explicitly a CPython implementation detail. It cannot establish durable
   identity across lifetimes or a portable memory layout.

3. **Treat `sys.getrefcount()` as a clue, never a leak verdict.** The
   [documented API](https://docs.python.org/3.14/library/sys.html#sys.getrefcount)
   includes the call's temporary argument reference, and the [same `sys`
   documentation](https://docs.python.org/3.14/library/sys.html#sys.getrefcount)
   warns that immortal-object counts may not reflect actual references. PEP
   683 further identifies immortality as a CPython-private, version-changeable
   design. [PEP 683](https://peps.python.org/pep-0683/)

4. **Cyclic GC is a separate, version-sensitive subsystem.** The [official
   `gc` documentation](https://docs.python.org/3.14/library/gc.html) says the
   optional collector supplements reference counting; its 3.14 notes include
   a 3.14.5 change to generation-1 behavior. A notebook must therefore name
   the exact Python patch version and must not treat `gc.collect()` as a claim
   that all released memory returned to the operating system.

5. **Keep shallow size distinct from retained or process memory.** The
   [`sys.getsizeof()` documentation](https://docs.python.org/3.14/library/sys.html#sys.getsizeof)
   limits its result to memory directly attributed to one object and notes
   third-party extension behavior is implementation-specific. It cannot by
   itself support an RSS, transitive-retention, allocator, or native-library
   claim.

6. **Use `tracemalloc` for its named layer only.** The [official
   `tracemalloc` documentation](https://docs.python.org/3.14/library/tracemalloc.html)
   scopes it to Python-allocated memory blocks, says snapshots omit blocks
   allocated before tracing began, and notes that more stored frames increase
   tracer memory/CPU overhead. Interpret a trace as an allocation-attribution
   observation, not total process, native, GPU, or RSS accounting.

7. **Time a declared scenario with a declared GC policy.** The [official
   `timeit` documentation](https://docs.python.org/3.14/library/timeit.html)
   says timing temporarily disables cyclic GC by default and returns repeated
   results whose higher values can reflect external interference. A reported
   timing must retain workload, runtime, warm-up, repeat vector, timer, and
   GC-policy provenance rather than stand in for an application-wide speedup.

8. **Profile to form a hypothesis, not to certify a comparison.** The
   [official profiler documentation](https://docs.python.org/3.14/library/profile.html)
   explicitly says the profilers are for execution profiles rather than
   benchmarking and warns that their overhead is asymmetric when comparing
   Python with C-level functions. A hot entry is a next investigation target,
   not a causal performance conclusion.

9. **Pin source reading and specialization claims.** The [official CPython
   `v3.14.6` tag](https://github.com/python/cpython/tree/v3.14.6) is the
   reproducible source-reading anchor; [`specialize.c` at that tag](https://github.com/python/cpython/blob/v3.14.6/Python/specialize.c)
   exposes specialization accounting, while [PEP 659](https://peps.python.org/pep-0659/)
   describes adaptive instructions. Together they support only a
   version-labelled hypothesis about a mechanism—not a claim that a local run
   specialized, used a particular instruction sequence, or became faster.

10. **Free-threaded builds are distinct measurement configurations.** [PEP
    703](https://peps.python.org/pep-0703/) describes changes to reference
    counting, memory management, container thread safety, and locking; the
    [3.14 free-threading HOWTO](https://docs.python.org/3.14/howto/free-threading-python.html)
    documents workload/hardware-dependent single-thread overhead and different
    memory-management characteristics. Never fold a free-threaded result into
    the GIL-enabled baseline without separately recording the build and
    workload.

11. **The JIT is neither a default assumption nor an answer key.** [PEP
    744](https://peps.python.org/pep-0744/) remains a Draft, and the [3.14
    release notes](https://docs.python.org/3.14/whatsnew/3.14.html#jit-compiler)
    describe the JIT as early-stage with workload-dependent performance and no
    free-threaded support. A learner must check availability and enablement on
    the actual executable, then measure an equivalent workload.

## Bounded reference-model and CLI I/O wording

Local-source inspection shows that the reference model accepts only an
enumerated fixed scenario and explicitly refuses caller-provided programs;
its command-line wrapper parses that scenario and prints one JSON packet to
standard output. [Reference model](../../public/downloads/module24_reference.py)
The accompanying test imports the local model and captures stdout/stderr.
[Behavioral seam test](../../public/downloads/test_module24_reference.py)

Use this precise wording: **the core model is a deterministic, bounded
teaching model with no caller-provided program or data path; its CLI/test
harness still has bounded process I/O (argument selection, local import, and
JSON written to stdout).** It is therefore neither a no-I/O model nor a
sandbox, a profiler, or evidence about a real CPython run.

The fixed scope cards return **COURSE_MODEL** and name the evidence a later
real observation would need; they do not fabricate CPython, timing,
allocation-trace, or OS-process observations. A matched manifest returns
**MANIFEST_READY**, meaning only that the comparison protocol is internally
described. It remains a deferral until a separately captured result carries
its runtime, options, workload, raw result, and other required provenance.

## Explicit uncertainty and nonclaims

- These sources document interfaces, proposals, and a tagged implementation;
  they do not measure any learner host, local Python binary, dependency set,
  operating-system state, CPU, allocator configuration, or workload.
- A CPython source or bytecode observation is not a Python-language,
  cross-version, cross-VM, hardware, or performance guarantee. [Official
  `dis` boundary](https://docs.python.org/3.14/library/dis.html)
- No conclusion here establishes a speedup, memory reduction, leak, resource
  release, semantic equivalence, portability, production suitability, or
  user-impact improvement. Such claims require a separately declared contract
  and experiment.
- This is an authoring research input only. It makes no publication, review,
  deployment, release, accessibility-certification, or security-cleanliness
  assertion.
