# M31–M32 primary-source calibration follow-up — 2026-08-03

## Scope and truth boundary

This is a compact, independent calibration follow-up for the current M31 and
M32 **authoring-only** workbooks. It does not select a canonical learner
source map, publish either module, open a route, establish a learner outcome,
or claim equivalence to a university course. Atlas materials remain
independently authored and link-first: do not copy course prose, assignments,
slides, figures, solutions, code, or benchmarks without an asset-specific
reuse review.

The review inspected the two workbooks, their six-session authoring-delivery
maps, candidate source ledgers, and the prior 2026-08-03 calibration note.
The comparisons below are based on the official sources rechecked on this
date; previous notes were not treated as proof of current source state.

## Official primary-source routes rechecked

All links below were accessed **2026-08-03**.

| Area | Primary source | Narrow use in this review | Reuse boundary |
| --- | --- | --- | --- |
| M31 constrained optimization | [MIT 6.7220/15.084, Lecture 7: Lagrange Multipliers and KKT Conditions](https://ocw.mit.edu/courses/6-7220j-nonlinear-optimization-spring-2025/resources/mit6_7220_s25_lec07_pdf/) | Feasibility, dual lower bounds, strong duality, Slater-style qualification, KKT, and the fact that strong duality is not automatic. | MIT OCW terms and individual asset notices govern reuse. Link-only; retain original Atlas exposition and fixtures. |
| M31 constrained optimization | [Stanford EE364a: Convex Optimization I](https://web.stanford.edu/class/ee364a/) and [duality/KKT slides](https://web.stanford.edu/class/ee364a/lectures/duality.pdf) | The course's linear progression from convex objects to optimality and duality; the slides' explicit primal, dual, lower-bound, qualification, and KKT route. | No blanket course-asset reuse right was identified. Link-only; do not reproduce course slides, assignments, or solutions. |
| M31 information theory | [MIT 6.441 lecture-note index](https://ocw.mit.edu/courses/6-441-information-theory-spring-2016/pages/lecture-notes/) | Entropy/divergence, mutual information, and the broader rate-distortion/coding sequence that bounds M31's intended depth. | MIT OCW terms and individual asset notices govern reuse. Link-only; original Atlas derivations only. |
| M32 parallel execution | [CMU 15-418/15-618 schedule](https://www.cs.cmu.edu/~418/schedule.html) | Work distribution, locality/communication/contention, GPU/CUDA, workload-driven evaluation, performance measurement, synchronization, and heterogeneous parallelism. | No blanket course-asset reuse right was identified. Link-only; do not reproduce labs, slides, recordings, or benchmark claims. |
| M32 systems-language and performance boundary | [CMU 15-213 Introduction to Computer Systems](https://csd.cs.cmu.edu/15213-introduction-to-computer-systems) and [MIT 6.172 Performance Engineering](https://ocw.mit.edu/courses/6-172-performance-engineering-of-software-systems-fall-2018/) | A programmer's view of execution, memory, portability, robustness, caching, parallelism, and evidence-based performance work. These calibrate M32's contract/representation/measurement order without turning it into a C/C++ or compiler course. | Link-only; do not reproduce course assignments, project code, slides, benchmarks, or solutions. |
| M32 scientific programming | [MIT 12.010 Computational Methods of Scientific Programming](https://ocw.mit.edu/courses/12-010-computational-methods-of-scientific-programming-fall-2024/) | Code design, algorithm verification, language/tool trade-offs, numerical work, documentation, version control, sharing, and reproducible practice. | MIT OCW terms and individual asset notices govern reuse. Link-only; original Atlas examples and dossiers only. |
| M32 public/native boundary | [Python 3.14 buffer protocol](https://docs.python.org/3.14/c-api/buffer.html) | Producer/consumer roles, shape/strides, contiguity requests, negative strides, and the paired release duty after a successful acquisition. | Python documentation is PSF-licensed, but this course remains link-only/original-paraphrase. Pin interpreter/build target for any concrete claim. |
| M32 array representation | [NumPy 2.3 copies and views](https://numpy.org/doc/2.3/user/basics.copies.html) | Array metadata, views, copies, indexing, reshape, contiguity, and the difference between semantic and storage questions. | NumPy is BSD-3-Clause. Link-only/original teaching fixtures; retain the existing NumPy 2.3.5 observation boundary. |
| M32 asynchronous execution and reproducibility | [JAX asynchronous dispatch](https://docs.jax.dev/en/latest/async_dispatch.html), [Python `venv`](https://docs.python.org/3/library/venv.html), and [PyTorch reproducibility](https://docs.pytorch.org/docs/main/notes/randomness.html) | Submission versus readiness/observation, interpreter/environment boundaries, and the non-portability of same-seed claims across releases, platforms, and CPU/GPU paths. | Project documentation changes with releases. Link-only/original explanations; pin version, backend, device, and settings before an execution claim. |

## Comparison findings

| Atlas topic and evidence | Comparison against the source route | Status |
| --- | --- | --- |
| **M31 prerequisites and progression.** M28–M30 supply linear algebra/numerical stability, calculus/analysis, and probability before the workbook moves from formulation and geometry through KKT, finite traces, stochastic limits, and information. | Stanford EE364a expects strong linear algebra and probability and then develops a substantially longer convex-optimization sequence. Atlas's prerequisite route is appropriate for its narrower bridge and explicitly adds calculus and probability retrieval before use. | **Aligned, intentionally adapted.** M31 should not claim to compress EE364a, MIT 6.7220, or a full nonlinear-optimization sequence. |
| **M31 KKT/duality proof idea.** The workbook makes the primal, dual function, matching values, KKT conditions, convexity, and strict-feasibility witness visible. Its finite example separates direct matching-witness evidence, the explicit Slater route to strong duality/necessity, and the separate all-affine-constraint qualification route. | MIT and Stanford both make the lower-bound/duality construction and qualification conditions central. The Atlas proof idea is mathematically appropriate for one inspectable convex fixture, while the source courses cover many additional regimes and methods. | **Aligned at bridge depth.** The remaining pedagogical risk is ritual use of the KKT checklist, not missing a broad optimizer survey. |
| **M31 information.** The workbook derives entropy/KL/MI from declared distributions, separates the uniform-input BSC calculation from asymptotic rate-distortion, and treats ELBO as a model-and-family identity with support limits. | MIT 6.441 proceeds onward to source/channel coding, converses, and broader rate-distortion theory. M31 correctly uses those topics as a depth boundary rather than presenting its one finite derivation as the course's operational coding content. | **Aligned, intentionally scoped exposure.** Source/channel coding, coding theorems, and a full variational-inference algorithm sequence remain post-core study, not an M31 gap. |
| **M32 public/native and array contracts.** Sessions 1 and 3 require rank, dtype, format, shape, strides, contiguity, alias/copy state, lifetime, and an adversarial negative-stride case before a no-copy claim. | Python's buffer documentation makes the descriptor and release duty source-owned facts; NumPy's documentation distinguishes metadata-changing views from duplicated storage. | **Technically aligned.** Concrete release claims still require pinned versions and the named real environment; the CPU-only fixture is correctly not generalized to arbitrary consumers/backends. |
| **M32 execution, measurement, and ownership.** Sessions 2 and 4 distinguish submission, transfer, queue/stream, work, dependency, wait, and legal reuse; Session 3 requires a semantic oracle and workload-aware measurement card. | CMU 15-418/618's sequence puts locality, CUDA, workload-driven performance, measurement, and synchronization in a much larger lab-based setting. Atlas reproduces the reasoning sequence, not its hardware/lab workload. | **Aligned, deliberately non-equivalent.** CPU/text traces remain the required base; GPU or framework lenses must stay optional and version-pinned. |
| **M32 systems-language target.** The opening outcome asks the learner to read and reason about a Python/native or array/autodiff boundary, name evidence limits, and reject unsupported performance claims; it explicitly excludes C/C++ extension, CUDA/HIP, compiler, GPU-administration, and vendor-tool expertise. | CMU 15-213 and MIT 6.172 use substantially more implementation, debugging, architecture, and performance-project work. They confirm that M32 should keep the intellectual order—contract, representation, execution, measurement—while staying a bounded reasoning bridge. | **Aligned, intentionally adapted.** No new compiler, vendor, or benchmark lab is warranted; the visible scope boundary is a feature, not missing coverage. |
| **M32 reproducibility dossier.** Session 6 records source revision, packages, runtime, backend, OS/device/driver, data identity, timing boundary, raw observations, a non-claim, and an adversarial control-versus-one-delta row that keeps the semantic oracle fixed. | MIT 12.010 pairs verification with documentation/version-control/reproducible practice. PyTorch expressly limits cross-release, cross-platform, and CPU/GPU reproducibility even with identical seeds. | **Aligned, intentionally bounded.** The delta can be a design-only protocol when a safe alternate environment is unavailable; it makes the portability boundary observable without becoming a production reproducibility or release claim. |

The largest unresolved issue is **delivery evidence**, not curriculum breadth:
both modules are still authoring-only. A source-calibrated workbook is not
learner access, a successful oral session, a released module, or evidence of
competence.

The additional CMU 15-213 / MIT 6.172 calibration does not justify another
content expansion: M32 already states the intended support tier directly.
Learners inspect a contract and reason from a bounded fixture; they do not
thereby gain native-build, hardware, benchmark, or portability competence.

## High-leverage content improvements — applied in `cc5c85b`

The four narrow repairs below were applied to the M31/M32 candidate modules and
their matching private authoring workbooks in commit `cc5c85b`, with focused
traceability regression coverage. They strengthen prediction, counterexample,
and transfer reasoning; they do **not** create a learner route, source approval,
human review, chat-delivery record, or release evidence.

1. **M31 Session 3: require a two-route certificate comparison.** Add one
   tiny output/oral-defense row distinguishing (a) a direct matching
   primal/dual-witness proof for the exact fixture from (b) a theorem route
   using convexity plus a named qualification. Then remove the strict-feasible
   witness as a changed premise and require the learner to withdraw only the
   theorem route they can no longer justify. This makes the existing correct
   prose harder to recite mechanically.

2. **M31 Session 6: promote the BSC-versus-rate-distortion distinction into
   retrieval.** Use a compact four-field card—source law, channel or
   distortion law, quantity, and asymptotic/one-use regime—then change one
   field and ask which formula must be withdrawn. This reinforces the existing
   non-conflation warning without adding a coding-theory survey.

3. **M32 Session 3: add a CPU-only stride-to-locality hypothesis card.**
   Starting from the existing shape/dtype/stride trace, have the learner draw
   consecutive logical accesses and identify whether they are contiguous,
   strided, reversed, or blocked. Label any cache/performance conclusion as a
   hypothesis requiring a named workload and completed measurement. This
   connects array metadata to CMU's locality reasoning without inventing cache
   counters or requiring accelerator hardware.

4. **M32 Session 6: add an adversarial reproduction-delta row.** Alongside
   the existing capsule, compare one same-environment rerun with one
   deliberately changed variable—library version, dtype, backend, data order,
   or synchronization policy. The learner must keep the semantic oracle
   fixed, report what did and did not change, and state the remaining
   non-portability claim. A design-only table is valid when no suitable
   hardware is available.

## Deliberate non-additions

Do not add a full interior-point/nonlinear-programming survey, source/channel
coding course, vendor benchmark, required CUDA environment, copied university
lab, or a new data/service layer. Those would inflate the module beyond its
connected first-principles role without closing its actual delivery boundary.

## Next review boundary

Before any M31/M32 learner-release decision, recheck the source URLs, exact
versions, access/reuse notices, source-to-claim links, candidate commit, and
the four recommendations actually selected. Then validate one bounded,
learner-approved chat/whiteboard delivery with the existing privacy boundary;
record only a learner-controlled summary, never a raw transcript or a
mastery claim.
