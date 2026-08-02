# Module 32 — Systems Languages, Scientific Python & Accelerators: Primary-Source Research

## Status, scope, and non-publication boundary

**Status:** instructor-facing, **authoring-only** research input for planned
Module 32. It is not a learner workbook, structured module contract,
release-input record, review approval, provenance ledger, or publication
decision.

The canonical course graph still describes M32 as authoring-only, with its
source map unset and its release blockers unmet. This file does **not** change
the graph, manifest, route, navigation, availability, prerequisite policy,
contract state, deployment, or Notion workflow. It does not make M32
navigable, release-ready, or a prerequisite a learner can satisfy. Source links
are evidence for future authoring, not evidence that a future studio,
diagnostic, oral-defense flow, accessibility review, or benchmark is complete.

**Research access date:** 2026-07-31. This note uses first-party
documentation, standards-facing project documentation, or official project
repositories only. It is link-and-original-paraphrase research: Atlas must not
copy source prose, code, figures, benchmarks, slide material, or tutorials into
future learner material without separate asset-level reuse review. Moving
documentation remains a moving target; any future publication must pin the
actual framework, runtime, driver, compiler, and source revision for each
claim.

**Targeted recheck:** S32-02 was rechecked on **2026-08-02** against the
current Python 3.14 C-API buffer-protocol reference before adding the original
native code-reading card. The card remains original Atlas material and does not
reuse its documentation example or imply a compiled-extension claim.

## The connected teaching argument

Module 32 is not a survey of “fast Python” or a catalogue of accelerator
brands. It answers one connected systems question:

~~~text
scientific question and correctness criterion
  -> public Python/native boundary and ownership contract
  -> array representation (shape, dtype, strides, alias/copy state)
  -> host request, dispatch, transfer, kernel, and synchronization history
  -> numerical/autodiff/compilation assumptions
  -> versioned environment and bounded measurement protocol
  -> observed result, alternate explanations, and a limited claim
~~~

**Text alternative:** A short array expression is only the top layer. Before
calling it efficient or correct, a learner must identify its data contract,
where the data lives, who may mutate or reuse it, what eventually waits for
the result, which numerical representation is used, and what was actually
measured. A successful result neither proves a portable speedup nor validates a
mathematical objective or hardware-independent architecture.

This keeps the canonical bridge intact:

| Incoming evidence | M32 must reuse it for | M32 adds without replacing it |
| --- | --- | --- |
| M12 — API contracts and design | Public promises, error/ownership boundaries, dependency direction | A boundary map across Python orchestration, array representation, native kernel, and result validation |
| M17 — architecture and execution | Memory hierarchy, locality, layer-specific explanations | A host-to-device execution/transfer trace and one falsifiable bottleneck prediction |
| M19 — concurrency and parallelism | Histories, synchronization, ownership, nondeterminism | A buffer-ownership timeline with legal reuse points and a failure probe |
| M24 — CPython/performance evidence | Version labels, profiler limits, controlled comparison | A benchmark card that separates a Python-level observation from a native/device mechanism |
| M28 — linear algebra and numerical stability | Shapes, representations, dtype/conditioning distinctions | A layout-and-numerics note tied to one actual operation |
| M31 — optimization and information | Objective/gradient/convergence boundaries | An autodiff execution trace with an analytic or finite-difference cross-check |

The graph’s declared next module remains M33. M35 and M36 are planned academic
consumers of M32 concepts; that planning relationship is not learner routing.

## Primary-source ledger and reuse boundary

S32-01–S32-13 below were accessed on 2026-07-31, except the explicitly
rechecked S32-02; S32-14 was added in the focused 2026-08-02 calibration
follow-up. “Link-only/original paraphrase” is the current Atlas decision even
where the underlying project is open source: it avoids silently carrying
source, documentation, figure, sample, or attribution obligations into a
future course asset.

| ID | Primary source and stable learner-facing link | Owner | Narrow authoring use | License/reuse status |
| --- | --- | --- | --- | --- |
| S32-01 | [Extending Python with C or C++](https://docs.python.org/3.14/extending/extending.html), [C API stability](https://docs.python.org/3.14/c-api/stable.html), and [free-threaded extension support](https://docs.python.org/3/howto/free-threading-extensions.html) | Python Software Foundation (PSF) | A CPython extension can define native object types or call C/system interfaces. Limited API/Stable ABI, private API, and free-threaded extension support are distinct contracts. | [PSF License v2](https://docs.python.org/3.14/license.html). Link-only/original paraphrase; do not copy documentation or extension examples. Pin Python minor version and build target. |
| S32-02 | [Buffer protocol](https://docs.python.org/3.14/c-api/buffer.html) and [memoryview](https://docs.python.org/3/library/stdtypes.html#memory-views) | PSF | A buffer request can describe data, shape/strides, item size, format, writability, and ownership/release duties; contiguity is requested, not assumed. Rechecked 2026-08-02 for the original native code-reading card. | PSF License v2. Link-only/original diagrams and fixtures only. |
| S32-03 | [NumPy 2.3 ndarray](https://numpy.org/doc/2.3/reference/generated/numpy.ndarray.html), [array layout](https://numpy.org/doc/2.3/reference/arrays.ndarray.html), [copies/views](https://numpy.org/doc/2.3/user/basics.copies.html), [`shares_memory`](https://numpy.org/doc/2.3/reference/generated/numpy.shares_memory.html), and [`may_share_memory`](https://numpy.org/doc/2.3/reference/generated/numpy.may_share_memory.html) | NumPy Developers | An ndarray has homogeneous fixed-size elements and exposes dtype, shape, strides, layout flags, and a base/ownership relation. `shares_memory` is exact but can be expensive for difficult layouts; `may_share_memory` is conservative. The learner route distinguishes these versioned references from separately accessed moving stable documentation. | [NumPy BSD-3-Clause license](https://numpy.org/doc/stable/license.html). Link-only/original examples; the private M32 observation pins NumPy 2.3.5 and must be rechecked before a future lesson/release. |
| S32-04 | [NumPy broadcasting](https://numpy.org/doc/stable/user/basics.broadcasting.html), [interoperability](https://numpy.org/doc/stable/user/basics.interoperability.html), and [performant multi-core code](https://numpy.org/doc/stable/user/basics.performant_code.html) | NumPy Developers | Broadcast shape rules, array boundary mechanisms, intermediate-allocation risk, and possible interaction with native thread pools. | NumPy BSD-3-Clause. Link-only/original fixtures; no imported benchmark values or diagrams. |
| S32-05 | [SciPy tutorial](https://docs.scipy.org/doc/scipy/tutorial/index.html) and [Array API capability caveats](https://docs.scipy.org/doc/scipy/dev/api-dev/array_api.html) | SciPy Developers | Scientific algorithms supply a distinct layer above an array backend; compatibility is function-, backend-, and device-specific. | [SciPy BSD-3-Clause license](https://github.com/scipy/scipy/blob/main/LICENSE.txt). Link-only/original examples; never generalize capability notes into blanket GPU support. |
| S32-06 | [Cython compilation](https://cython.readthedocs.io/en/stable/src/userguide/source_files_and_compilation.html), [typed memoryviews](https://cython.readthedocs.io/en/3.1.x/src/userguide/memoryviews.html), and [parallelism](https://cython.readthedocs.io/en/latest/src/userguide/parallelism.html) | Cython contributors | An annotated Python/Cython source can be compiled through C/C++ into an extension; typed memoryviews model buffer layouts and native parallelism still needs an ownership argument. | [Cython Apache-2.0 license](https://github.com/cython/cython/blob/master/LICENSE.txt). Link-only/original examples; a documentation page is not automatically a code-sample reuse grant. |
| S32-07 | [Numba performance guidance](https://numba.readthedocs.io/en/stable/user/performance-tips.html) and [NVIDIA numba-cuda status](https://nvidia.github.io/numba-cuda/) | Numba contributors / NVIDIA | Compiled CPU loops are a contrasting path to vectorization; fast-math and parallel reductions need explicit numerical/ordering assumptions. The former built-in Numba CUDA path is not the durable course default. | [Numba BSD-2-Clause license](https://github.com/numba/numba/blob/main/LICENSE) and [numba-cuda BSD-2-Clause license](https://github.com/NVIDIA/numba-cuda/blob/main/LICENSE). Link-only/original examples. numba-cuda is maintenance-only through CUDA 13; do not frame it as a durable primary accelerator recommendation. |
| S32-08 | [CUDA heterogeneous programming and memory hierarchy](https://docs.nvidia.com/cuda/cuda-programming-guide/02-basics/heterogeneous-programming.html) and [asynchronous execution](https://docs.nvidia.com/cuda/cuda-programming-guide/02-basics/asynchronous-execution.html) | NVIDIA | The CUDA model distinguishes host/device memory and uses asynchronous streams/events; actual overlap depends on concrete hardware and software. | NVIDIA documentation is proprietary. Link-only/original paraphrase; do not reproduce code, figures, or performance claims. Pin a CUDA-guide release before publication. |
| S32-09 | [HIP overview](https://rocm.docs.amd.com/projects/HIP/en/docs-6.1.0/) and [ROCm compatibility matrix](https://rocm.docs.amd.com/en/develop/compatibility/compatibility-matrix.html) | AMD | HIP/ROCm gives a contrasting portability/backend boundary and demonstrates why hardware support belongs in an explicit matrix. | [ROCm licensing overview](https://rocm.docs.amd.com/en/develop/about/license.html). Link-only/original paraphrase; components and platform support vary, so do not imply universal AMD/NVIDIA/OS availability. |
| S32-10 | [JAX jit](https://docs.jax.dev/en/latest/_autosummary/jax.jit.html), [asynchronous dispatch](https://docs.jax.dev/en/latest/async_dispatch.html), and [installation matrix](https://docs.jax.dev/en/latest/installation.html) | JAX authors | A staged pure array computation can return a pending device value; meaningful timing requires a readiness boundary and compilation/warm-up must be separated. | [JAX Apache-2.0 license](https://github.com/jax-ml/jax/blob/main/LICENSE). Link-only/original examples; pin JAX/XLA/backend versions and installation constraints. |
| S32-11 | [JAX default dtypes and X64](https://docs.jax.dev/en/latest/default_dtypes.html) and [automatic differentiation](https://docs.jax.dev/en/latest/automatic-differentiation.html) | JAX authors | Dtype configuration can change representability and numerical behavior; grad differentiates a declared computation rather than validating its objective. | JAX Apache-2.0. Link-only/original examples and finite-difference fixtures. |
| S32-12 | [PyTorch CUDA semantics](https://docs.pytorch.org/docs/stable/notes/cuda.html), [autograd mechanics](https://docs.pytorch.org/docs/stable/notes/autograd.html), and [torch.compile](https://docs.pytorch.org/docs/stable/generated/torch.compile.html) | PyTorch contributors | GPU work is ordinarily asynchronous; reverse-mode history, graph breaks, dynamic shapes, and private saved-tensor details all constrain an execution explanation. | [PyTorch BSD-3-Clause license](https://github.com/pytorch/pytorch/blob/main/LICENSE). Link-only/original examples; pin framework, CUDA/ROCm, driver, compiler, and device. |
| S32-13 | [PyTorch reproducibility](https://docs.pytorch.org/docs/stable/notes/randomness.html), [C++/CUDA extensions](https://docs.pytorch.org/docs/stable/cpp_extension.html), and [HIP semantics](https://docs.pytorch.org/docs/main/notes/hip.html) | PyTorch contributors | Seeds/deterministic modes have bounded scope; an extension has compiler/ABI/target constraints; familiar torch.cuda syntax on a HIP build is not a CUDA-equivalence proof. | PyTorch BSD-3-Clause. Link-only/original checklists; no copied settings recipes or binary distribution without separate review. |
| S32-14 | CMU, [15-418/15-618 schedule](https://www.cs.cmu.edu/~418/schedule.html) | Course-sequence calibration for workload distribution, locality/communication, synchronization, heterogeneous execution, and completed-work measurement in Sessions 2–6. It calibrates scope, not a framework, hardware, benchmark, or theorem claim. | Accessed by manual browser review on 2026-08-02. The public course page grants no blanket asset license. **Link-only**; use original Atlas cards and do not copy course assets. Automated requests can receive a 403, so a future release must manually recheck the learner-facing link rather than equating a CI response with content availability. |

### What these sources do *not* establish

No ledger row proves that a learner’s machine has a GPU, that CUDA/ROCm is
available, that a specific array operation transfers or aliases data in a given
way, that a Python/native boundary has no copy, that a kernel runs
concurrently, that a compiled version is faster, or that a numerical result is
correct for a real decision. Such statements need an independently checked,
versioned experiment record with the actual hardware, driver, operating system,
package build, input, output oracle, timing boundary, raw observations, and
known alternatives.

## Claim, assumption, and counterexample ledger

Future learner-facing cards should name a claim ID, expose its assumptions next
to the result, and require the listed counterexample or falsifier. The row is a
review obligation, not a theorem or a performance guarantee.

| ID | Narrow claim that may be authored | Assumptions/evidence that must be visible | Required counterexample, probe, or non-claim |
| --- | --- | --- | --- |
| M32-C01 | A Python/native component boundary has a declared public input/output, error, ownership, and version contract. | Exact interpreter implementation/version, extension/framework API, dtype/shape/layout, ownership/release behavior, failure channel, and binary/build target. | A CPython C API feature is not a Python-language promise or a guarantee for PyPy/another build; private APIs and an unpinned extension are not portability evidence. |
| M32-C02 | A buffer descriptor can represent multi-dimensional data without an intermediate copy when exporter and consumer accept compatible request semantics. | Exporter/consumer, format, ndim, shape, strides, item size, readonly/writable request, contiguity request, lifetime, and paired release behavior. | A strided or negative-stride view invalidates a naive contiguous-byte traversal; a held view can prevent resizing, and no-copy does not erase lifetime obligations. |
| M32-C03 | Shape, dtype, strides, and alias/copy state jointly determine what an array operation means and what data it can touch. | Exact library/version, input arrays, axes, broadcasting rule, dtype promotion, view/copy relationship, and mutation policy. | Equal shapes do not imply equal strides, layout, aliasing, cost, or numerical behavior; a slice/view mutation can change a base array. |
| M32-C04 | Broadcasting/vectorized array operations can move elementwise work into an array library’s implementation, but the resulting algorithm can still allocate an expensive intermediate or call a different backend. | Shapes/axes, operand dtype/layout, output/allocation policy, library build, relevant native thread settings, and a semantic output oracle. | A compact expression that broadcasts to a huge result can use more memory and become slower; the label “vectorized” is not a measured speedup explanation. |
| M32-C05 | In a stated CUDA-, HIP-, or framework-specific configuration, host dispatch, device transfer, kernel execution, and host observation can be different events. | Backend, device, driver/runtime, stream, transfer path, input residency, synchronization point, and clock/instrument. | Timing only the enqueue path can understate completed work; a GPU route with transfers or small inputs need not beat a CPU route. |
| M32-C06 | Operations ordered in one stated stream form an ordered queue, while overlap and correct reuse across streams require explicit dependency/ownership reasoning. | Framework/backend stream semantics, buffer owner before/after enqueue, event/wait relation, mutation/reuse point, and error boundary. | A successful one-run output does not rule out stale reads, a write-after-read hazard, or an unintended synchronization; resource availability can prevent anticipated overlap. |
| M32-C07 | JAX jit and asynchronous dispatch change the evaluation/timing boundary; a readiness or host-observation boundary is needed for an execution-time measurement. | Exact JAX/XLA/backend version, compilation warm-up policy, array shapes/dtypes, dispatch/ready boundary, repeats, and raw timing record. | First-call compilation time is not steady-state execution time; unblocked dispatch time is not kernel-completion time. |
| M32-C08 | Autodiff differentiates the implemented computation under its framework’s rules; a gradient check can test a bounded claim about one chosen function and point. | Scalar target or declared cotangent, differentiability/domain conditions, values/shapes/dtypes, mutation/control-flow boundary, analytic or finite-difference comparator, tolerance, and seed if random. | A lower loss or finite gradient does not validate the objective, model, optimizer, precision choice, or real-world decision; undefined/nonsmooth operations require explicitly scoped behavior. |
| M32-C09 | Dtype/precision policy is part of the numerical contract and can change representability, rounding, overflow/underflow risk, and compatibility. | Framework dtype policy, backend/device support, accumulation behavior where relevant, tolerances, reference dtype/oracle, and conditioning context. | A result that matches at one small scale does not establish stable mixed-precision behavior; enabling a wider dtype can be unsupported or change cost. |
| M32-C10 | Reproducibility controls can constrain named sources of variation for a stated environment, but they do not create cross-version, cross-platform, or CPU/GPU identity. | Framework/runtime/dependency versions, device/driver, deterministic flags, all relevant random generators, data order, worker configuration, hardware and raw outputs/checksums. | Identical seed alone is not a reproducibility proof; a deterministic setting can alter performance or reject an operation with no deterministic implementation. |
| M32-C11 | A compiled or native extension route has explicit compiler, ABI, target-architecture, and dependency constraints. | Compiler/version, compile flags, Python and framework ABI, build system, target device/compute capability, runtime libraries, source revision, and clean-build verification. | A local successful build does not show that a wheel will load elsewhere; use of a framework-specific Python binding can conflict with a limited-API portability claim. |
| M32-C12 | A benchmark report states an observed comparison under one declared protocol, not the mechanism or a universal recommendation. | Question, variants, input layout/size, warm-up, timing boundary, repeats, statistic, hardware/OS/runtime/library header, power/thermal contention note, semantic oracle, and plausible alternatives. | A profiler percentage, one timing, or a chart without raw context cannot prove a bottleneck, a causally responsible optimization, or a general speedup. |

## Likely six-session source routing

This routing follows the canonical M32 prerequisite/session bridge exactly. It
is a planning map only; it does not create a workbook, project, diagnostic,
studio, or live oral-defense implementation.

| Canonical session and bridge | Source route | Understanding-first move | Planned evidence and non-claim |
| --- | --- | --- | --- |
| **M32-S01 — System boundaries: Python orchestration, native kernels, and scientific-array contracts** (M12) | S32-01–S32-06 | Present a tiny, original orchestration/kernel pseudocode boundary; have the learner label public inputs, dtype/shape/layout, owner, error behavior, and version assumption before revealing a proposed implementation. | **Boundary-contract map.** It does not assert that a real extension is safe, zero-copy, portable, or compiled. |
| **M32-S02 — Execution and transfer: from Python request to CPU, device, and memory hierarchy** (M17) | S32-08–S32-10, S32-12, S32-14 | Ask for a prediction of where an input lives and what would have to happen before a host can observe the result; then contrast dispatch time with a completion-aware measurement design. | **Execution-transfer trace with one falsifiable performance prediction.** It does not claim that a GPU route overlaps work or wins on the learner’s hardware. |
| **M32-S03 — Array layout, vectorization, numerical behavior, and measurement** (M24, M28) | S32-02–S32-07, S32-11 | Code-read two original array pipelines with equal shapes but different strides, views/copies, broadcasting intermediates, and dtypes; then inspect one fixed CPU-only NumPy 2.3.5 view/copy/broadcast result against a semantic oracle. Predict the semantic and cost risk before a controlled benchmark card. | **Layout-numerics note and performance-evidence card.** It labels the fixed observation as one named environment result and all timing as an observation, not a general law of vectorization. |
| **M32-S04 — Parallel execution, buffer ownership, and synchronization** (M19) | S32-01–S32-02, S32-06–S32-10, S32-12, S32-14 | Draw a host/device or multi-worker timeline, then inject one early-buffer-reuse or missing-event fault for the learner to diagnose. | **Buffer-ownership timeline and failure probe.** A passed output is not a proof of race freedom, liveness, or overlap. |
| **M32-S05 — Autodiff, kernels, precision, and optimization traces** (M28, M31) | S32-10–S32-12 | Read a small original scalar loss trace: values, shapes, dtype, graph/transform boundary, gradient, and a finite-difference check. Require the learner to name the claim that remains unproved after matching gradients. | **Autodiff-execution trace.** It does not turn a framework derivative into objective validity, convergence, or numerical-stability proof. |
| **M32-S06 — Reproducible accelerator systems architecture defense** (M12, M17, M19, M24, M28, M31) | S32-01–S32-14 | Assemble the prior artifacts into a deliberately narrow architecture-defense packet. The oral discussion asks what could change the result without changing the source code and what measurement would most reduce uncertainty. | **Scientific Python & Accelerators Dossier and learner-controlled oral-defense summary.** It is an evidence record, not a pass/fail exam, deployment approval, or portability guarantee. |

Every future session must preserve prediction before reveal, compact
first-principles explanation, code-reading/debugging/design inspection, a
counterexample, retrieval, transfer, and a learner-controlled artifact. The
focus is architectural interpretation and bounded evidence, not typing large
amounts of framework code.

## Required evidence record for any future experiment

Before a learner-facing timing, profiler, trace, or numerical-output card can
support a statement, it should expose at least:

~~~text
question and claimed comparison
semantic oracle / expected invariant
input fixture: shape, axes, dtype, layout, alias/copy status, units/redaction
implementation: source revision, Python/runtime, package/backend versions
build: compiler, ABI, flags, target architecture, native libraries
environment: OS, CPU/GPU, driver/runtime, device selection, thread settings
execution: host/device residency, stream/queue, transfer and synchronization points
numerics: precision policy, tolerances, conditioning/overflow sensitivity
measurement: warm-up, clock/event boundary, repeats, raw results, statistic
controls: seed, deterministic mode, GC/profiling state, background contention
result: observation; alternative explanations; next falsifier; explicit non-claim
~~~

The Atlas portal must not automatically transmit this record to Notion or any
other service. A learner may inspect, copy, redact, or explicitly approve an
export under the portal’s local-first consent boundary. Separately, the
learner-designated Codex Teaching Assistant or Study Partner chat may create
one concise, privacy-bounded session note under the active designated-chat
workflow; that exception does not turn this authoring note into a source map,
release input, or evidence that any write succeeded.

## Research gaps and release blockers this file does not close

1. **Choose a concrete, bounded platform.** M32 cannot make portable CUDA,
   ROCm, Metal, CPU, or cloud-device claims from this cross-platform research.
   A future lesson must choose its supported backend(s), exact device discovery
   behavior, and accessible fallback before it can supply a real studio.
2. **Pin every moving component.** Python, NumPy, SciPy, JAX, PyTorch, Cython,
   Numba, CUDA/HIP/ROCm, compilers, BLAS, drivers, and device architecture must
   be captured by exact version/build identifiers. Current links are research
   anchors, not release pins.
3. **Bounded local references and focused teaching tests now exist; no learner
    studio or platform model exists.** A private M32 workbook now supplies six
    draft sessions, diagnostics, a dossier rubric, and TA/Study Partner oral
    material. `lib/m32-systems-evidence-fixture.js` exposes only fixed
    layout/handoff metadata, logical temporary shapes, an event-label ownership
    timeline, and one scalar reverse-mode trace. Separately,
    `scripts/m32_numpy_layout_observation.py` is a pinned NumPy 2.3.5,
    CPU-only observation of named views, a copy, and a broadcasting result;
    `scripts/test_m32_numpy_layout_observation.py` fixes its narrow expected
    facts. Neither is a buffer-protocol, CUDA/HIP, JAX, or PyTorch model,
    semantic oracle for a real program, benchmark, or safe learner interaction.
    Any future lab must avoid arbitrary learner code, network/package
    installation, credentials, filesystem access beyond its declared scope, and
    undisclosed external model calls.
4. **Create the reviewed delivery and release binding.** The private draft does
   not yet bind its sessions, source linkage, visual alternatives, diagnostics,
   review records, dossier, or oral workflow to the canonical learner route,
   a reviewed module contract, or release evidence. Those boundaries remain
   required before publication.
5. **Gather real measurement evidence separately.** This research has no
   benchmark results. Performance, transfer, compiler, kernel, memory, and
   reproducibility claims require raw data and the full record above; sources
   can guide an experiment but cannot substitute for it.
6. **Resolve framework differences rather than flattening them.** JAX’s
   immutable asynchronous staged model and PyTorch’s eager/mutable tensor model
   are not interchangeable mental models. A future comparison must name what
   is held constant and what is intentionally different.
7. **Review source and asset reuse at release.** Open-source software licenses
   do not automatically authorize copying documentation, figures, test data,
   branding, or third-party portions. NVIDIA material is link-only unless a
   separate review says otherwise.
8. **Perform accessibility, privacy, and deployment verification.** This note
   supplies neither screen-reader/keyboard evidence nor a production security,
   performance-budget, privacy, Notion-integration, CI, GitHub-provenance, or
   deployment verification record.

## Authoring checklist before M32 can be reviewed

- [ ] Recheck every source’s stable URL, version, license/reuse decision, and
      access date; add claim linkage in the structured source ledger.
- [ ] Keep the canonical graph unchanged until an independent contract review
      records a truthful availability/release decision.
- [ ] Build original explanatory diagrams with adjacent concise text
      alternatives, not source screenshots or copied figures.
- [~] Shared local fixture/tests now make four symbolic M32 reasoning cards
      inspectable—layout/handoff, pairwise temporary shape, buffer last use,
      and scalar reverse-mode arithmetic—plus one pinned CPU-only NumPy 2.3.5
      view/copy/broadcast observation. Platform-specific semantic oracles,
      measurement evidence, learner interaction, and independent lesson review
      remain open.
- [ ] Bind every performance/numerical claim to a measured environment record,
      a semantic oracle, raw observations, and a stated non-claim.
- [ ] Provide a supportively adaptive oral-defense protocol through the Codex
      Teaching Assistant and an equivalent accessible text workflow; do not use
      an oral exchange as an automatic unlock or pass/fail gate.
- [ ] Preserve M25/M26 preview gating and M31–M36 authoring-only restrictions
      until their own contract, route, accessibility, provenance, and release
      evidence are independently complete.

This research note intentionally leaves the M32 source-map and release blockers
open. Its contribution is a source-conscious path for making the future module
more rigorous without making the current course description less truthful.
