# Module 32 — Systems Languages, Scientific Python & Accelerators: Candidate Source Ledger

## Scope and truth boundary

This ledger belongs to the fixed, **hidden review candidate** at
[content/modules/32_systems_languages_scientific_python_accelerators.md](../modules/32_systems_languages_scientific_python_accelerators.md).
It lets a future qualified reviewer inspect the candidate's claims and source
routes without substituting the separate instructor research dossier or
authoring workbook.

It is not a review approval, learner route, release record, course-equivalence
claim, hardware-support promise, benchmark result, or learner-mastery record.
M32 remains authoring-only and hidden until the canonical graph, contract
evidence, qualified review, safe interaction, accessibility, CI, deployment,
and provenance requirements agree. Its M31 prerequisite remains a hidden,
authoring-only prerequisite; selecting M32 does not satisfy or bypass it.

Atlas materials remain independently authored: explanations, diagrams,
fixtures, code-reading tasks, diagnostics, oral prompts, and dossiers. The
links below are for study and provenance only. They do not authorize copying
third-party prose, exercises, figures, code, benchmark results, slide layouts,
videos, or data.

## Claim and session map

| Candidate claim | Sessions | What the source route checks | Candidate boundary |
| --- | --- | --- | --- |
| M32-C01–C02: a public/native boundary and buffer descriptor are explicit contracts | 1 | API, version, ownership, layout, and release semantics | A public interface or no-copy path is not safety, portability, or performance evidence. |
| M32-C03–C04: shape, dtype, strides, aliasing, and broadcasting affect meaning and cost | 3 | array layout, copies/views, and allocation-risk vocabulary | Equal shape or a compact expression does not prove equal behavior or speed. |
| M32-C05–C07: dispatch, transfer, work, wait, and readiness are separate events | 2, 4 | backend-specific execution, streams, events, and timing boundaries | An enqueue time or one trace does not prove overlap or hardware-independent speed. |
| M32-C08–C09: autodiff and precision operate under declared computational/numerical contracts | 5 | differentiation, dtype, and finite-check scope | A gradient match does not validate the objective, convergence, or system design. |
| M32-C10–C12: reproducibility and benchmark claims need a versioned environment and protocol | 6 | sources of variation, ABI/build constraints, and measurement design | A seed, profiler percentage, or local build is not portable evidence. |

## Source ledger

| ID | Stable learner-facing source | Claim linkage and rationale | Access record and reuse status |
| --- | --- | --- | --- |
| S32-01 | Python, [Extending Python with C or C++](https://docs.python.org/3.14/extending/extending.html), [C API stability](https://docs.python.org/3.14/c-api/stable.html), and [free-threaded extension support](https://docs.python.org/3/howto/free-threading-extensions.html) | M32-C01; public/native boundaries, stable ABI distinctions, and explicit build-target scope. | Accessed 2026-07-31. PSF License v2. Link-only/original paraphrase; pin Python minor version and build target for a concrete claim. |
| S32-02 | Python, [buffer protocol](https://docs.python.org/3.14/c-api/buffer.html) and [memoryview](https://docs.python.org/3/library/stdtypes.html#memory-views) | M32-C02; shape, strides, format, contiguity request, lifetime, and release duties. | Accessed 2026-07-31; rechecked 2026-08-02. PSF License v2. Link-only/original diagrams and fixtures. |
| S32-03 | NumPy, [ndarray](https://numpy.org/doc/2.3/reference/generated/numpy.ndarray.html), [array layout](https://numpy.org/doc/2.3/reference/arrays.ndarray.html), [copies and views](https://numpy.org/doc/2.3/user/basics.copies.html), [shares_memory](https://numpy.org/doc/2.3/reference/generated/numpy.shares_memory.html), and [may_share_memory](https://numpy.org/doc/2.3/reference/generated/numpy.may_share_memory.html) | M32-C03; versioned layout, alias/copy, and ownership vocabulary for the fixed NumPy observation. | Accessed 2026-07-31. NumPy BSD-3-Clause. Link-only/original examples; recheck NumPy 2.3.5 behavior before release. |
| S32-04 | NumPy, [broadcasting](https://numpy.org/doc/stable/user/basics.broadcasting.html), [interoperability](https://numpy.org/doc/stable/user/basics.interoperability.html), and [performant multi-core code](https://numpy.org/doc/stable/user/basics.performant_code.html) | M32-C03–C04; broadcasting rules, array boundaries, intermediate-allocation risk, and native-thread context. | Accessed 2026-07-31. NumPy BSD-3-Clause. Link-only; no imported benchmarks or diagrams. |
| S32-05 | SciPy, [tutorial](https://docs.scipy.org/doc/scipy/tutorial/index.html) and [Array API capability caveats](https://docs.scipy.org/doc/scipy/dev/api-dev/array_api.html) | M32-C04; function-, version-, backend-, and device-specific scientific-computing capability. | Accessed 2026-07-31. SciPy BSD-3-Clause. Link-only; never turn documentation into blanket GPU support. |
| S32-06 | Cython, [compilation](https://cython.readthedocs.io/en/stable/src/userguide/source_files_and_compilation.html), [typed memoryviews](https://cython.readthedocs.io/en/3.1.x/src/userguide/memoryviews.html), and [parallelism](https://cython.readthedocs.io/en/latest/src/userguide/parallelism.html) | M32-C01–C02 and C11; compilation, buffer layouts, and ownership reasoning. | Accessed 2026-07-31; typed-memoryview route rechecked 2026-08-03. Cython Apache-2.0. Link-only/original examples; documentation code samples are not automatically reusable. |
| S32-07 | Numba, [performance guidance](https://numba.readthedocs.io/en/stable/user/performance-tips.html) and [numba-cuda status](https://nvidia.github.io/numba-cuda/) | M32-C04 and C09; compiled CPU alternatives and numerical/ordering assumptions. | Accessed 2026-07-31; performance route rechecked 2026-08-03. Numba is BSD-2-Clause; numba-cuda is BSD-2-Clause according to its project license and must be rechecked before release. Link-only; maintenance-only CUDA status is not a durable platform recommendation. |
| S32-08 | NVIDIA, [programming model and memory hierarchy](https://docs.nvidia.com/cuda/cuda-programming-guide/01-introduction/programming-model.html) and [asynchronous execution](https://docs.nvidia.com/cuda/cuda-programming-guide/02-basics/asynchronous-execution.html) | M32-C05–C06; host/device memory, streams, events, and configuration-sensitive overlap. | Accessed 2026-08-04. Proprietary documentation. Link-only; do not reproduce code, figures, or performance claims. |
| S32-09 | AMD, [HIP overview](https://rocm.docs.amd.com/projects/HIP/en/docs-6.1.0/) and [ROCm compatibility matrix](https://rocm.docs.amd.com/en/develop/compatibility/compatibility-matrix.html) | M32-C05–C06 and C11; backend/portability boundaries and explicit hardware matrices. | Accessed 2026-07-31. Component licenses and platform support vary. Link-only; no universal AMD/NVIDIA/OS claim. |
| S32-10 | JAX, [jit](https://docs.jax.dev/en/latest/_autosummary/jax.jit.html), [asynchronous dispatch](https://docs.jax.dev/en/latest/async_dispatch.html), and [installation matrix](https://docs.jax.dev/en/latest/installation.html) | M32-C05–C07; staged computation, readiness boundaries, warm-up, and backend constraints. | Accessed 2026-07-31. JAX Apache-2.0. Link-only; pin JAX/XLA/backend versions for a concrete observation. |
| S32-11 | JAX, [default dtypes and X64](https://docs.jax.dev/en/latest/default_dtypes.html) and [automatic differentiation](https://docs.jax.dev/en/latest/automatic-differentiation.html) | M32-C08–C09; dtype policy, finite numerical scope, and differentiation of a declared computation. | Accessed 2026-07-31. JAX Apache-2.0. Link-only/original finite-difference examples. |
| S32-12 | PyTorch, [CUDA semantics](https://docs.pytorch.org/docs/stable/notes/cuda.html), [autograd mechanics](https://docs.pytorch.org/docs/stable/notes/autograd.html), and [torch.compile](https://docs.pytorch.org/docs/stable/generated/torch.compile.html) | M32-C05–C08; asynchronous execution, named inter-stream dependency and storage-lifetime handling in a pinned backend, reverse-mode history, graph breaks, and framework-specific constraints. | Accessed 2026-07-31; stream/lifetime reading rechecked 2026-08-03. PyTorch BSD-3-Clause. Link-only; pin framework, driver, compiler, device, and backend. |
| S32-13 | PyTorch, [reproducibility](https://docs.pytorch.org/docs/stable/notes/randomness.html), [C++/CUDA extensions](https://docs.pytorch.org/docs/stable/cpp_extension.html), and [HIP semantics](https://docs.pytorch.org/docs/main/notes/hip.html) | M32-C10–C11; bounded determinism, ABI/build constraints, and backend differences. | Accessed 2026-07-31. PyTorch BSD-3-Clause. Link-only; no copied configuration recipes or binary-distribution claim. |
| S32-14 | CMU, [15-418/15-618 schedule](https://www.cs.cmu.edu/~418/schedule.html) | Sessions 2–6; instructional calibration for locality, communication, synchronization, heterogeneous execution, and completion-aware measurement. | Accessed 2026-08-02. No blanket course-asset license. Link-only; manual recheck required because automated requests can be blocked. |
| U32 | [Stanford CS149 Parallel Computing](https://cs149.stanford.edu/) and [MIT 12.010 Computational Methods of Scientific Programming](https://ocw.mit.edu/courses/12-010-computational-methods-of-scientific-programming-fall-2024/) | Sessions 1–6; university-course calibration for parallel work distribution, scientific-programming evidence, reproducibility, and workload-sensitive measurement. | Accessed 2026-08-02. Link-only/original Atlas work. These routes do not promise identical labs, hardware, grading, or institutional equivalence. |

## Review checklist for these routes

Before a future M32 release, recheck every URL, source version, access date,
license/reuse notice, framework/backend condition, and claim link against the
exact candidate commit. Sources calibrate scope and define contracts; they do
not supply the learner's hardware, a production benchmark, a safe arbitrary
code runner, a release decision, or evidence of competence.

The focused [2026-08-03 official calibration](../../docs/research/m31-m32-official-calibration-2026-08-03.md)
records the scope check and its remaining delivery-evidence boundary. It is not
a source-map selection, review approval, or release record.
