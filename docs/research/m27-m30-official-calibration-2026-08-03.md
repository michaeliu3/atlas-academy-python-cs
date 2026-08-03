# M27–M30 official calibration — 2026-08-03

## Scope and release boundary

This is a narrow, research-only calibration of the current legacy M27–M30
workbooks and the minimum handoffs needed before M31–M36. All external routes
below were accessed **2026-08-03** and are official university material. This
note changes no workbook, source map, graph, contract, learner route, access,
review, or release claim. It preserves the existing legacy boundary for
M27–M30 and does not make M31–M36 available or complete. Atlas remains
link/cite-only and uses original prose, examples, prompts, and code.

## Alignment confirmed

| Module | Current calibration result | Primary academic route |
| --- | --- | --- |
| **M27 — discrete mathematics** | The proof/quantifier, induction/invariant, recurrence/asymptotic, modular-arithmetic, graph, and matching spine is sound at its declared introductory scope. No new factual repair was found. | MIT [6.1200J readings](https://ocw.mit.edu/courses/6-1200j-mathematics-for-computer-science-spring-2024/pages/readings/) explicitly sequence proof, induction, recurrences, number theory, graphs, matching, connectivity, and probability. |
| **M28 — linear algebra and stability** | Spaces/maps, projection and least squares, spectral/SVD reasoning, conditioning, and PCA are appropriately hypothesis-aware. The normal-equation warning is mathematically right; one definition-level bridge below would remove a notation gap. | MIT [18.06SC syllabus](https://ocw.mit.edu/courses/18-06sc-linear-algebra-fall-2011/pages/syllabus/) includes subspaces, projections, least squares, eigenstructure, PSD matrices, and SVD. |
| **M29 — calculus and analysis** | Limits, compactness, MVT/Taylor, integration/change of variables, differentiability, uniform convergence, legal exchanges, Lagrange candidates, and Euler boundaries are correctly scoped. No high-value factual repair was found. | MIT [18.100A readings](https://ocw.mit.edu/courses/18-100a-introduction-to-analysis-fall-2012/pages/readings/) provides the matching proof-aware sequence through continuity, Taylor, integration/FTC, uniform convergence, and interchange material. |
| **M30 — probability and inference** | The probability-model, expectation, convergence, likelihood, interval/test, resampling, design, and missingness boundaries are sound. The necessary probability content is already present, but two later retrieval routes do not surface it precisely enough. | MIT [18.600 lecture notes](https://ocw.mit.edu/courses/18-600-probability-and-random-variables-fall-2019/pages/lecture-notes/) sequence expectation, covariance, conditional expectation, LLN, and CLT. |

## Focused repairs — not applied

1. **Define the rectangular condition ratio before using it.**
   [M28 §6.3–§6.5](../../content/modules/28_linear_algebra_numerical_stability_representation.md)
   (`content/modules/28_linear_algebra_numerical_stability_representation.md:604–641`)
   defines \(\kappa_2(A)\) only for an invertible square matrix, then states
   \(\kappa_2(A^\mathsf TA)=\kappa_2(A)^2\) for full-column-rank \(A\).
   The identity is correct when the rectangular two-norm ratio is explicitly
   defined as \(\sigma_{\max}(A)/\sigma_{\min}(A)\). Add that one sentence
   before the normal-equations identity; retain the existing QR/SVD boundary.
   MIT [18.085's official solution](https://math.mit.edu/classes/18.085/summer2016/pset2016/pset5solution.pdf)
   derives the squared-singular-value relation and the resulting conditioning
   warning. This is a first-principles clarity repair, not a claim that every
   rectangular least-squares sensitivity is exhausted by one scalar condition
   number.

2. **Make M30's existing sampling vocabulary a named M31 bridge.**
   M30's Monte-Carlo contract (`content/modules/30_probability_statistics_scientific_inference.md:510–546`)
   contains the needed estimator/sampling/dependence vocabulary, but its
   forward handoff (`:1307–1312`) does not name the full-gradient versus
   mini-batch-estimate distinction that M31 immediately retrieves
   (`content/authoring/m31_optimization_information_workbook.v1.md:108–116`).
   Add a two-line *forward* card only: for a declared finite empirical
   objective, a uniformly sampled, correctly weighted mini-batch average of
   per-example gradients can target the full empirical gradient under a named
   sampling and conditional-history contract; it establishes neither descent,
   convergence, nor population-risk improvement. M31 should continue to own
   SGD definitions and convergence analysis. MIT [6.7220 Lecture 15](https://ocw.mit.edu/courses/6-7220j-nonlinear-optimization-spring-2025/mit6_7220_s25_lec15.pdf)
   makes exactly this distinction between the empirical objective, a
   conditional unbiased estimator, and a mini-batch rule.

3. **Route M36's finite-average retrieval to M30.**
   M36 asks “Why is a finite average loss different from a population
   expectation?” but its current map and retrieval omit M30
   (`content/authoring/m36_statistical_learning_theory_reliable_deep_learning_workbook.v1.md:107–136`);
   its companion maps the first retrieval to M29 instead
   (`content/course/contracts/companions/m36.v1.json:25`). M30 already gives
   the correct bridge in §4.1 and §5.1 (`:309–323`, `:475–505`): a sample
   average is an estimator/finite observation, while an expectation and an
   LLN or finite bound require a stated law and conditions. Add M30 to that
   conceptual prerequisite map and route this first retrieval to M30; keep
   M29 for regularity, M33 for quantifiers, M31 for optimization, M32 for
   execution, and M35 for evaluation/shift. MIT [18.600](https://ocw.mit.edu/courses/18-600-probability-and-random-variables-fall-2019/pages/lecture-notes/)
   separates expectation from LLN/CLT, while MIT [6.080 Lecture 20](https://ocw.mit.edu/courses/6-080-great-ideas-in-theoretical-computer-science-spring-2008/838468541460ee9c1d08eb36c1921d30_lec20.pdf)
   makes the independent-sample/distribution/high-probability quantifiers
   explicit. This is a routing correction, not a request to add PAC theory to
   M30.

## Intentionally scoped omissions

- No expansion to full numerical-linear-algebra algorithms, real analysis,
  measure theory, ODE/PDE methods, causal inference, advanced Bayesian
  computation, or PAC/VC theory.
- No audit of M31–M36 beyond the exact prerequisite/retrieval surfaces needed
  to test continuity from M27–M30.
- No equivalence claim to university enrollment, assessment, credit, learner
  mastery, source approval, publication, or release readiness.

## Disposition

The legacy mathematical core is aligned for its stated role. Preserve the
existing theorem/procedure/finite-observation boundaries and apply only the
three small, future-focused repairs above in a separately authorized content
batch. This calibration supplies no release or availability decision.
