# M31–M32 independent official calibration — 2026-08-01

## Scope and truth boundary

This is a compact, read-only calibration of the current M31 and M32 authoring
workbooks against official university material and the primary documentation
that owns the named technical interfaces. It does not change availability,
prerequisites, the learner route, release evidence, or the authoring-only
status of either module. It is not evidence of university-equivalent teaching,
credit, mastery, hardware access, or learner delivery.

All links below were accessed **2026-08-01**. They are calibration and reading
links only. Atlas should retain its original prose, diagrams, code, fixtures,
and exercises; do not copy course notes, slides, assignments, solutions,
figures, or documentation examples without an asset-level reuse decision.

## Primary calibration corpus

| Source | What it calibrates |
| --- | --- |
| [Stanford EE364a: Convex Optimization I](https://web.stanford.edu/class/ee364a/) | Convex sets/functions/problems, optimality conditions, duality, algorithms, and the prerequisite level of linear algebra, probability, and elementary Python. |
| [MIT 6.441: Information Theory lecture notes](https://ocw.mit.edu/courses/6-441-information-theory-spring-2016/pages/lecture-notes/) | Entropy, divergence, mutual information, rate-distortion, and the much broader graduate information-theory sequence. |
| [Stanford CS149: Parallel Computing](https://cs149.stanford.edu/) and [CMU 15-418/618 schedule](https://www.cs.cmu.edu/~418/schedule.html) | Hardware/software trade-offs, locality, communication, GPUs/CUDA, performance measurement, synchronization, and heterogeneous parallelism. |
| [MIT 12.010: Computational Methods of Scientific Programming](https://ocw.mit.edu/courses/12-010-computational-methods-of-scientific-programming-fall-2024/) and [MIT 6.172: Performance Engineering](https://ocw.mit.edu/courses/6-172-performance-engineering-of-software-systems-fall-2018/) | Code design and verification, Python/Julia/C++, reproducible work, version control, performance analysis, caching, and parallel programming. |
| [Python buffer protocol](https://docs.python.org/3.14/c-api/buffer.html) and [NumPy 2.3 copies/views](https://numpy.org/doc/2.3/user/basics.copies.html) | The source-owned vocabulary for producer/consumer duties, release, shape, strides, views, copies, and the limits of layout inferences. |

## Topic-by-topic assessment

| Module and topic | Judgment | Evidence and bounded conclusion |
| --- | --- | --- |
| M31: formulation, convexity, KKT, duality | **Aligned** | The objective → feasibility → local/global condition → certificate progression matches the intellectual spine of EE364a. The workbook's tiny affine-constraint KKT case names convexity and strict feasibility, then distinguishes a mathematical certificate from a solver status. |
| M31: iterative and stochastic optimization | **Adapted** | EE364a includes algorithmic treatment; Atlas deliberately teaches a finite trace as conditional evidence rather than trying to duplicate a term of convergence proofs, interior-point methods, or solver implementation. This is an appropriate 60-day adaptation, not a factual gap. |
| M31: entropy, KL, mutual information, rate-distortion | **Aligned, narrowly scoped** | MIT 6.441 explicitly covers information measures and rate-distortion. Atlas correctly confines `R(D)=1-h_2(D)` to the stated uniform IID binary/Hamming/asymptotic setting and separates it from noisy-channel mutual information. |
| M31: full information theory and variational inference breadth | **Deliberate gap** | Source/channel coding, converses, continuous measures, graphical-model algorithms, and full variational-inference methods are well beyond this six-session bridge. The current ELBO identity is suitably limited to a named model, support, family, and integrability boundary. Do not add a term-long survey merely to mirror MIT 6.441. |
| M32: Python/native boundary and arrays | **Aligned** | The workbook asks for a public contract, compatible buffer request, ownership/release, shape, dtype, strides, and a semantic oracle before a no-copy or compatibility claim. That matches the official Python/NumPy interface boundaries and is stronger than a generic “vectorization is fast” lesson. |
| M32: parallel execution, locality, synchronization | **Aligned and intentionally adapted** | CS149 and 15-418/618 treat the same causal concerns—work distribution, locality/communication, GPUs, measurement, and synchronization. Atlas focuses on reading an execution/ownership history and bounding a claim instead of requiring a CUDA implementation or device access. |
| M32: reproducibility and performance evidence | **Aligned** | MIT 12.010 and 6.172 support the module's emphasis on code verification, versioned environments, correctness oracles, and constrained performance conclusions. The dossier correctly requires a declared timing boundary, raw observation or an explicit “not measured,” alternatives, and a non-claim. |
| M32: systems-performance breadth | **Deliberate gap** | Quantitative speedup/work-span analysis, cache/coherence/consistency mechanisms, kernel implementation, and hardware-specific profiling remain earlier-module or optional-depth material. They should not be implied by a generic trace or silently imported into M32. |

## Corrections and next evidence

**No immediate learner-content correction is indicated.** The two highest-risk
mathematical boundaries are already explicit: M31's rate-distortion and ELBO
cards name their assumptions, and M32 does not convert an enqueue interval,
array shape, buffer view, or one timed observation into a portable performance
claim.

The next meaningful gap is **delivery evidence**, not additional theory or a
new framework survey. Before M31/M32 can be called learner-ready, review one
actual designated-chat pilot for equation/code/timeline readability and the
supportive oral-defense handoff. For M32, select and pin at most one optional
backend reading lens (for example PyTorch CUDA) only when its exact framework,
runtime, and device assumptions can be recorded; retain the current CPU/text
fallback. This is not a request to unlock either module or claim hardware
availability.

