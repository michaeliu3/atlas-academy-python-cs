# M31–M32 narrow primary-source recheck — 2026-08-01

**Scope.** This is a small authoring calibration check, not a release review.
It rechecks only the theorem/API boundaries named below against official
sources. M31 and M32 remain authoring-only; nothing here changes the graph,
route, contract, or learner availability. Atlas should link and independently
paraphrase these sources—do not copy notes, slides, figures, examples, or
solutions without a separate asset-level review. This is not a claim of
university-equivalent instruction, assessment, credit, or outcomes.

## M31 — optimization and information

| Narrow issue | Official source accessed 2026-08-01 | Recheck conclusion and authoring boundary |
| --- | --- | --- |
| KKT and Slater | [Boyd & Vandenberghe, *Convex Optimization*, §§5.2–5.5](https://web.stanford.edu/~boyd/cvxbook/bv_cvxbook.pdf) | For differentiable convex problems with convex inequality functions and affine equalities, a point satisfying KKT is sufficient for primal/dual optimality. Slater is a constraint qualification: strict feasibility in the relative interior (with the usual affine-inequality refinement) gives strong duality and dual attainment, hence KKT necessity as well. The M31 quadratic with one affine inequality and strictly feasible `(0, 0)` is within this narrow regime. Keep the distinction: a numerical multiplier/gap, an integer/chance/nonconvex variant, or an unverified solver status is not that certificate. **No mathematical correction required.** |
| Smooth descent versus projection | [MIT 6.7220/15.084 Lecture 7, *Gradient descent and descent lemmas*](https://www.mit.edu/~gfarina/2024/67220s24_L07_gradient_descent/L07.pdf) and [Lecture 14, *Projected gradient descent and mirror descent*](https://www.mit.edu/~gfarina/2025/67220s25_L14_mirror_descent/L14.pdf) | The quadratic upper bound for an L-smooth function on the relevant convex domain yields the workbook's unconstrained step inequality: substituting `x+ = x - eta grad f(x)` gives the displayed `eta(1 - L eta / 2)` decrease; `0 < eta <= 1/L` gives the weaker `eta/2` form. A Euclidean projection is unique for a named closed convex set, and projected-gradient analysis has its own hypotheses/residual. Current separation of the two is correct. **Recommended micro-clarification:** say that the L-smooth bound covers the segment from `x` to `x+`; do not imply it transfers automatically to the projected/nonsmooth/inexact case. |
| Rate-distortion and ELBO | [MIT 6.441 Chapter 24, rate-distortion achievability](https://ocw.mit.edu/courses/6-441-information-theory-spring-2016/aaa8d18ddecde45f97134d3f3dcee4a3_MIT6_441S16_chapter_24.pdf), [MIT 6.441 Chapter 25, evaluating R(D)](https://ocw.mit.edu/courses/6-441-information-theory-spring-2016/5721b7df786b416dadad7c7bb3364d00_MIT6_441S16_chapter_25.pdf), and [Blei, Kucukelbir & McAuliffe, *Variational Inference: A Review for Statisticians*](https://www.cs.columbia.edu/~blei/papers/BleiKucukelbirMcAuliffe2017.pdf) | The binary `R(D)=1-h_2(D)` card is correct only for the stated uniform i.i.d. Bernoulli source, Hamming distortion, `0 <= D <= 1/2`, and asymptotic fixed-rate average-distortion setting; it is not a noisy-channel capacity, finite-code score, or product-harm criterion. For a fixed observation and fixed joint-model parameters, the ELBO identity is correctly scoped to the declared variational distribution/family, compatible support/reference measure, and finite expectations: maximizing it minimizes `KL(q || posterior)` *within that family*, not model misspecification, calibration, or decision value. **No mathematical correction required.** |

## M32 — NumPy representation and allocation scope

| Narrow issue | Official NumPy source accessed 2026-08-01 | Recheck conclusion and authoring boundary |
| --- | --- | --- |
| Views, copies, and alias checks | [Copies and views](https://numpy.org/doc/stable/user/basics.copies.html), [`numpy.shares_memory`](https://numpy.org/doc/stable/reference/generated/numpy.shares_memory.html), and [`numpy.may_share_memory`](https://numpy.org/doc/stable/reference/generated/numpy.may_share_memory.html) | In NumPy, basic indexing creates views and advanced indexing creates copies; reshape can be either. `shares_memory(a, b)` with its default `max_work=-1` solves element overlap exactly but can be exponentially slow; `may_share_memory` is a bounds-based "might" test and may return true without an overlapping element. Neither result proves that a non-NumPy consumer accepted the array without conversion/copy, nor settles lifetime, writability, device transfer, or backend behavior. **Recommended addition:** make this exact-versus-conservative distinction a tiny Session 3 diagnostic rather than treating `.base` as a universal no-copy proof. |
| Strides and contiguity | [`ndarray.strides`](https://numpy.org/doc/stable/reference/generated/numpy.ndarray.strides.html), [`ndarray.flags`](https://numpy.org/doc/stable/reference/generated/numpy.ndarray.flags.html), and [`numpy.ascontiguousarray`](https://numpy.org/doc/stable/reference/generated/numpy.ascontiguousarray.html) | Strides are byte steps per axis; they are not themselves a universal proof of C/F contiguity, ownership, compatibility, or cost. Inspect the relevant layout flags as well. `ascontiguousarray` can return the same C-contiguous object or make a C-contiguous copy, depending on the actual input. The workbook's negative-stride and lower-level-consumer cautions are correct. |
| Broadcasting and temporaries | [Broadcasting](https://numpy.org/doc/stable/user/basics.broadcasting.html) and [`numpy.broadcast_to`](https://numpy.org/doc/stable/reference/generated/numpy.broadcast_to.html) | Broadcasting is shape semantics, not an automatic materialization rule: `broadcast_to` returns a readonly, typically non-contiguous view whose elements can share locations. A specific NumPy expression can nevertheless produce a large result/intermediate; the documented vector-quantization example identifies such a large `diff` array as computationally inefficient. The current `points[:, None, :] - centers[None, :, :]` wording—logical `(n, k, d)` shape, then backend/allocation evidence—is appropriately narrow. **Keep it; do not rewrite it as “broadcasting always allocates.”** |

## Authoring action

Apply only the two small clarifications above if this batch revises the
workbooks: (1) name the smoothness domain/segment around M31's exact descent
step, and (2) add the `shares_memory` versus `may_share_memory` distinction to
M32's array-inspection exercise. They improve precision without expanding the
module scope or creating a hardware/performance claim. Recheck moving NumPy
documentation and any pinned runtime version again before a learner-facing
release.
