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
