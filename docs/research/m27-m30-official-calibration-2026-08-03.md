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
| **M28 — linear algebra and stability** | Spaces/maps, projection and least squares, spectral/SVD reasoning, conditioning, and PCA are appropriately hypothesis-aware. The normal-equation warning and its rectangular condition-ratio bridge are mathematically scoped. | MIT [18.06SC syllabus](https://ocw.mit.edu/courses/18-06sc-linear-algebra-fall-2011/pages/syllabus/) includes subspaces, projections, least squares, eigenstructure, PSD matrices, and SVD. |
| **M29 — calculus and analysis** | Limits, compactness, MVT/Taylor, integration/change of variables, differentiability, uniform convergence, legal exchanges, Lagrange candidates, and Euler boundaries are correctly scoped. No high-value factual repair was found. | MIT [18.100A readings](https://ocw.mit.edu/courses/18-100a-introduction-to-analysis-fall-2012/pages/readings/) provides the matching proof-aware sequence through continuity, Taylor, integration/FTC, uniform convergence, and interchange material. |
| **M30 — probability and inference** | The probability-model, expectation, convergence, likelihood, interval/test, resampling, design, and missingness boundaries are sound. Its empirical-gradient handoff and M36 retrieval route now surface the necessary probability distinction precisely. | MIT [18.600 lecture notes](https://ocw.mit.edu/courses/18-600-probability-and-random-variables-fall-2019/pages/lecture-notes/) sequence expectation, covariance, conditional expectation, LLN, and CLT. |

## Focused repairs — implemented in the current materials/companion

1. **M28 now defines the rectangular condition ratio before using it.**
   [M28 §6.3–§6.5](../../content/modules/28_linear_algebra_numerical_stability_representation.md)
   now states that a full-column-rank rectangular matrix uses the nonzero
   singular-value ratio \(\sigma_{\max}(A)/\sigma_{\min}(A)\) before giving
   \(\kappa_2(A^\mathsf TA)=\kappa_2(A)^2\), while retaining the QR/SVD
   boundary. This is a first-principles clarity repair, not a claim that every
   rectangular least-squares sensitivity is exhausted by one scalar condition
   number.
   MIT [18.085's official solution](https://math.mit.edu/classes/18.085/summer2016/pset2016/pset5solution.pdf)
   derives the squared-singular-value relation and the resulting conditioning
   warning.

2. **M30 now makes its sampling vocabulary a named M31 bridge.**
   Its forward handoff states that, for a declared finite empirical objective,
   a uniformly sampled, correctly weighted mini-batch average of per-example
   gradients can target the full empirical gradient under a named sampling and
   conditional-history contract. It explicitly does not establish descent,
   convergence, or population-risk improvement; M31 continues to own SGD
   definitions and convergence analysis. MIT [6.7220 Lecture 15](https://ocw.mit.edu/courses/6-7220j-nonlinear-optimization-spring-2025/mit6_7220_s25_lec15.pdf)
   makes exactly this distinction between the empirical objective, a
   conditional unbiased estimator, and a mini-batch rule.

3. **M36's finite-average retrieval now routes to M30.**
   The M36 authoring workbook, generated hidden candidate, and companion name M30
   for the finite-average versus population-expectation distinction, retaining
   M29 for regularity, M33 for quantifiers, M31 for optimization, M32 for
   execution, and M35 for evaluation/shift. M30 supplies the bridge: a sample
   average is an estimator/finite observation, while an expectation and an LLN
   or finite bound require a stated law and conditions. MIT [18.600](https://ocw.mit.edu/courses/18-600-probability-and-random-variables-fall-2019/pages/lecture-notes/)
   separates expectation from LLN/CLT, while MIT [6.080 Lecture 20](https://ocw.mit.edu/courses/6-080-great-ideas-in-theoretical-computer-science-spring-2008/838468541460ee9c1d08eb36c1921d30_lec20.pdf)
   makes the independent-sample/distribution/high-probability quantifiers
   explicit. This is a routing correction, not a claim that M36 is released or
   a request to add PAC theory to M30.

## Intentionally scoped omissions

- No expansion to full numerical-linear-algebra algorithms, real analysis,
  measure theory, ODE/PDE methods, causal inference, advanced Bayesian
  computation, or PAC/VC theory.
- No audit of M31–M36 beyond the exact prerequisite/retrieval surfaces needed
  to test continuity from M27–M30.
- No equivalence claim to university enrollment, assessment, credit, learner
  mastery, source approval, publication, or release readiness.

## Disposition

The legacy mathematical core is aligned for its stated role. The three focused
continuity repairs are present; no remaining content action follows from this
note. Preserve the existing theorem/procedure/finite-observation boundaries.
This calibration supplies no source approval, review, release, or availability
decision.
