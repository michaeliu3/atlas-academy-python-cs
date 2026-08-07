# M31–M32 focused candidate review

**Scope (2026-08-01):** A read-only academic-calibration and study-quality
review of the two private authoring workbooks and their source maps. The two
bounded revisions below were then applied in the follow-up authoring batch.
This uses official material to check intellectual sequence and evidence habits,
not to copy course assets or claim enrollment, grading, credit, equivalence,
release, or learner mastery.

## Official calibration checked

| Official source (accessed 2026-08-01) | Narrow calibration use |
| --- | --- |
| MIT OCW [6.251J — Introduction to Mathematical Programming](https://ocw.mit.edu/courses/6-251j-introduction-to-mathematical-programming-fall-2009/) | formulation, duality, algorithms, sensitivity |
| Stanford [EE364a — Convex Optimization I](https://web.stanford.edu/class/ee364a/) | convex structure, optimality conditions, duality, computation under stated assumptions |
| MIT OCW [6.441 — Information Theory lecture notes](https://ocw.mit.edu/courses/6-441-information-theory-spring-2016/pages/lecture-notes/) | entropy/divergence, mutual information, and rate-distortion boundaries |
| CMU [15-418/15-618 schedule](https://www.cs.cmu.edu/~418/schedule.html) | locality, communication/contention, workload-driven evaluation, measurement/tuning, synchronization, heterogeneous systems |
| MIT OCW [12.010 — Computational Methods of Scientific Programming](https://ocw.mit.edu/courses/12-010-computational-methods-of-scientific-programming-fall-2024/) | scientific-program verification, reproducibility, and evidence dissemination |
| NumPy [copies and views](https://numpy.org/doc/stable/user/basics.copies.html) | behavioral authority for array alias/copy claims; university courses calibrate scope, not this API behavior |

## Already strong

- **M31** has the right connected spine: formulation and proxy boundaries →
  local/convex conditions → KKT/duality witnesses → finite solver evidence →
  stochastic and information limits. Its KKT mini-case and ELBO/support
  boundaries make theorem, implementation, and decision claims visibly
  different.
- **M32** correctly starts with contract and representation rather than tool
  labels, then connects execution/ownership, numerical checks, measurement,
  and a bounded dossier. Its array and asynchronous examples make the common
  “returned / vectorized / fast” overclaims inspectable without pretending that
  a CPU fixture is a CUDA or framework experiment.

## Two high-value authoring corrections — applied

| Exact revision point | Applied revision and reason |
| --- | --- |
| [`content/authoring/m31_optimization_information_workbook.v1.md` — Session 4, immediately after the projected-gradient update and trace requirements](../../content/authoring/m31_optimization_information_workbook.v1.md#session-4--read-stopping-evidence-not-solver-mythology) | Added one short, original **theorem-versus-trace card** that derives the descent inequality for an *unconstrained* (L)-smooth function and a stated (0<\eta\leq 1/L), then explicitly separates it from the constrained projected update. It defines a projected-gradient mapping and asks what a small mapping/residual can and cannot show when smoothness is lost or an optimum is on a boundary. This supplies the missing quantitative bridge from Session 2’s (L)-smoothness to Session 4’s update rule while preserving the existing rule that a finite trace is not a convergence theorem. |
| [`content/authoring/m32_systems_languages_scientific_python_accelerators_workbook.v1.md` — Session 3, “Output: Performance Evidence Card”](../../content/authoring/m32_systems_languages_scientific_python_accelerators_workbook.v1.md#output-performance-evidence-card) | Added a tiny comparison row for each pair of variants: same semantic oracle/quality threshold, useful-work unit, whether the reported metric is latency or throughput, included/excluded transfer/compile/synchronization work, and the baseline denominator. It asks for one prediction about how changing workload size could alter the metric before measurement. The card already required variants and raw timing; this makes comparison fairness and the meaning of a speedup explicit, matching CMU’s workload-driven measurement emphasis without adding hardware labs or universal performance claims. |

## Boundary

This is an **authoring review only**. It does not alter the graph, portal,
manifest, routing, contract/release status, or M25/M26 gating; it is not human
review, accessibility validation, live-chat delivery evidence, CI/deployment
evidence, or proof that either candidate is ready to publish.

## 2026-08-02 calibration follow-up — applied authoring improvements

This follow-up rechecked a small official corpus before the next M31–M32
revision batch. Sources calibrate intellectual scope and sequence only; Atlas
links and paraphrases rather than copying lectures, slides, assignments,
figures, code, or solutions.

| Source accessed 2026-08-02 | Narrow use in this revision |
| --- | --- |
| [Stanford EE364a](https://web.stanford.edu/class/ee364a/) and [CMU 10-725](https://stat.cmu.edu/~siva/teaching/725/) | M31: least-squares/conditioning, exact-gradient versus projected/stochastic theorem scopes, and the relation among gradient, KKT, and nonconvex reasoning. |
| MIT OCW [6.253 Convex Analysis and Optimization](https://ocw.mit.edu/courses/6-253-convex-analysis-and-optimization-spring-2012/) and MIT OCW [6.441 Information Theory](https://www.ocw.mit.edu/courses/6-441-information-theory-spring-2016/resources/lecture-notes/) | M31: retain a bounded proof/information bridge rather than expand into a graduate sequence; support and variational-family conditions remain visible. |
| [Stanford CS149, Fall 2025](https://gfxcourses.stanford.edu/cs149/fall25), [CMU 15-418/618 schedule](https://www.cs.cmu.edu/~418/schedule.html), and MIT OCW [12.010](https://ocw.mit.edu/courses/12-010-computational-methods-of-scientific-programming-fall-2024/) | M32: locality, work distribution, synchronization, completed-work measurement, scientific-program verification, and reproducibility boundaries. |
| [SciPy Array API capability caveats](https://docs.scipy.org/doc/scipy/dev/api-dev/array_api.html), [JAX asynchronous dispatch](https://docs.jax.dev/en/latest/async_dispatch.html), and [PyTorch CUDA semantics](https://docs.pytorch.org/docs/stable/notes/cuda.html) | M32: frame backend/function/device capability and readiness/precision semantics as named documentation questions, not universal GPU claims. |

| Revision | Why it closes a real learning gap |
| --- | --- |
| M31 Session 2 now has a fixed `2x2` ridge-conditioning card with units/scaling, a finite-difference check, and a feature-rescaling counterexample. | The Scope Matrix calls conditioning and numerical stability core; the existing draft mentioned them but did not make the ridge trade-off inspectable. |
| M31 Session 4 now pairs the descent statement with a fixed quantitative exact-gradient rate card and a changed-premise withdrawal. | Learners can now distinguish an actual theorem hypothesis set and bound from a finite projected/stochastic trace. |
| M31 Session 6 now uses a two-state ELBO equality/support-mismatch card and a three-step disclosure map. | The symbolic identity becomes inspectable without introducing a framework/VAE lab or diluting its support/approximation boundary. |
| M32 Session 2 now requires a cost decomposition/prediction and contrasts JAX staged readiness with PyTorch CUDA stream vocabulary. | It makes workload, locality, transfer, launch, and readiness reasoning explicit without assuming hardware or API equivalence. |
| M32 Session 3 now includes a SciPy/Array-API capability question; Sessions 5–6 now require the M31 objective/constraint/convergence artifact and a redacted reproduction capsule. | “Scientific Python” and optimization-to-systems transfer are now visible, while backend availability, reproducibility, and privacy remain scoped. |
| The Scope Matrix now names distributed data parallelism as an M35-led boundary instead of implying replica/collective mastery from M32's single-buffer/stream work. | This corrects an overclaim without adding a premature distributed-training lab. |

The follow-up remains **authoring-only**. It grants no reader route, hidden
review-ready status, source-map selection, studio, deployment, publication,
learner evidence, or university-equivalence claim. The next legitimate stage
is independent source/pedagogical/accessibility review and a bounded,
learner-approved pilot—not a release by documentation alone.
