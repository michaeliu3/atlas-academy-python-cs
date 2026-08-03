# Module 31 — Optimization & Information: Candidate Source Ledger

## Scope and truth boundary

This ledger belongs to the fixed, **hidden review candidate** at
[content/modules/31_optimization_information.md](../modules/31_optimization_information.md).
It lets a future qualified reviewer inspect the candidate's claims and source
routes without substituting the separate instructor planning map or authoring
workbook.

It is not a review approval, learner route, release record, course-equivalence
claim, or learner-mastery record. M31 remains authoring-only and hidden until
the canonical graph, contract evidence, qualified review, interaction,
accessibility, CI, deployment, and provenance requirements agree.

The candidate uses independently authored Atlas explanations, diagrams,
fixtures, code-reading tasks, diagnostics, oral prompts, and dossiers. The
links below are for study and provenance; they do not authorize copying
third-party prose, exercises, figures, slide layouts, solutions, code, data,
or videos.

## Claim and session map

| Candidate claim | Sessions | What the source route checks | Candidate boundary |
| --- | --- | --- | --- |
| C01: an objective ranks a declared feasible set, not an undisclosed real-world goal | 1 | formulation, feasible-set, unit, sensitivity, and trade-off vocabulary | A proxy objective cannot choose whose values count or grant authority to act. |
| C02–C03: derivative and curvature conclusions depend on domain, regularity, and convexity | 2 | first/second-order conditions, convexity, strong convexity, smoothness, and conditioning | A finite grid, approximate gradient, or one solver run is not a global theorem. |
| C04: primal/dual and KKT claims need stated construction and regularity | 3 | Lagrangians, weak/strong duality, constraint qualifications, and certificates | A small numerical gap does not prove assumptions, model validity, or globality. |
| C05: a solver trace is bounded implementation evidence | 4 | algorithm conditions plus documented solver/DCP contracts | A success flag or accepted grammar is not a proof or a valid decision model. |
| C06: noisy or nonconvex updates need sampling, oracle, and stationarity boundaries | 5 | stochastic-approximation and nonconvex theorem scopes | Loss reduction or a small gradient does not establish a good basin or population result. |
| C07–C08: entropy, KL, mutual information, and ELBO encode declared distributions and directions | 6 | information-theory definitions and variational-inference identities | An improved ELBO or information estimate is not exact inference, causality, fairness, or safety. |

## Source ledger

| ID | Stable learner-facing source | Claim linkage and rationale | Access record and reuse status |
| --- | --- | --- | --- |
| S01 | MIT OpenCourseWare, [6.251J Introduction to Mathematical Programming](https://ocw.mit.edu/courses/6-251j-introduction-to-mathematical-programming-fall-2009/) and [lecture-note index](https://ocw.mit.edu/courses/6-251j-introduction-to-mathematical-programming-fall-2009/pages/lecture-notes/) | C01, C04; formulation, feasible-set geometry, duality, sensitivity, and mathematical-programming context. | Accessed 2026-07-30. MIT OCW is ordinarily CC BY-NC-SA 4.0 subject to asset notices. Link/cite; Atlas examples and explanations remain original. |
| S02 | MIT OpenCourseWare, [6.253 Convex Analysis and Optimization](https://ocw.mit.edu/courses/6-253-convex-analysis-and-optimization-spring-2012/) and [lecture notes](https://ocw.mit.edu/courses/6-253-convex-analysis-and-optimization-spring-2012/resources/lecture-notes/) | C02–C05; convexity, subgradients, duality, saddle-point language, and conditional algorithms. | Accessed 2026-07-30. MIT OCW CC BY-NC-SA 4.0 baseline subject to asset notices. Link-only/original exposition by default; do not import course assets. |
| S03 | Stanford, [EE364a / CME364a Convex Optimization I](https://web.stanford.edu/class/ee364a/) | C01–C05; calibration for convex sets/functions/problems, optimality, duality, and algorithm progression. | Accessed 2026-07-30. No blanket license is granted for course assets or linked text. Link-only. |
| S04 | Stephen Boyd and Lieven Vandenberghe, [Convex Optimization](https://web.stanford.edu/~boyd/cvxbook/) | C02–C05; notation and theorem cross-check for convexity, KKT, primal/dual problems, and numerical methods. | Accessed 2026-07-30. Copyright is held by Cambridge University Press. Link-only. |
| S05 | MIT OpenCourseWare, [6.441 Information Theory](https://ocw.mit.edu/courses/6-441-information-theory-spring-2016/) and [lecture-note index](https://ocw.mit.edu/courses/6-441-information-theory-spring-2016/pages/lecture-notes/); Stanford [EE 376A Information Theory notes](https://web.stanford.edu/class/ee376a/files/scribes/lecture_notes.pdf) | C07; entropy, conditional entropy, mutual information, the declared uniform-input BSC derivation, variational characterizations, and rate-distortion viewpoints. | Rechecked 2026-08-03. MIT OCW CC BY-NC-SA 4.0 baseline subject to asset notices; Stanford course material is link-only. Atlas links/cites and uses original explanations; do not copy notes or assignments. |
| S06 | Blei, Kucukelbir, and McAuliffe, [Variational Inference: A Review for Statisticians](https://www.cs.columbia.edu/~blei/papers/BleiKucukelbirMcAuliffe2017.pdf) and [DOI](https://doi.org/10.1080/01621459.2017.1285773) | C08; ELBO/KL direction, variational-family assumptions, and approximation limits. | Accessed 2026-07-30. Publisher/author-hosted rights do not give blanket reuse permission. Link-only. |
| S07 | Robbins and Monro, [A Stochastic Approximation Method](https://doi.org/10.1214/aoms/1177729586) | C06; provenance for conditional noisy root-finding and step-size reasoning. | Accessed 2026-07-30. Journal/publisher rights apply. Link-only. |
| S08 | Ghadimi and Lan, [Nonconvex Stochastic Programming](https://doi.org/10.1137/120880811) and [preprint record](https://arxiv.org/abs/1309.5549) | C06; approximate stationarity under named smoothness/noise/oracle conditions rather than a global-optimum promise. | Accessed 2026-07-30. SIAM/arXiv availability does not authorize wholesale reuse. Link-only. |
| S09 | SciPy, [minimize](https://docs.scipy.org/doc/scipy/reference/generated/scipy.optimize.minimize.html) and [trust-constr](https://docs.scipy.org/doc/scipy/reference/optimize.minimize-trustconstr.html) | C04–C05; documented objective/derivative/constraint and stopping-field contracts. | Accessed 2026-07-30. SciPy is generally BSD-3-Clause; Atlas uses original examples and must pin a version before a concrete library claim. |
| S10 | CVXPY, [Disciplined Convex Programming tutorial](https://www.cvxpy.org/tutorial/dcp/) and [Apache-2.0 license](https://www.cvxpy.org/version/1.2/license/index.html) | C04–C05; DCP shape/curvature grammar and the boundary between structural checking and mathematical or real-world validity. | Accessed 2026-07-30. Cite the API; original Atlas examples only. DCP acceptance is not a solver, data, or decision certificate. |
| S11 | CMU, [10-725 Convex Optimization](https://stat.cmu.edu/~siva/teaching/725/) | C02–C06; calibration cross-check for conditioning, projected/stochastic method scope, KKT/duality, and nonconvex boundaries. | Accessed 2026-08-02. No blanket course-asset license. Link-only; no course material is reproduced. |

## Review checklist for these routes

Before a future M31 release, the reviewer must recheck every URL, source
version, access date, license/reuse notice, and source-to-claim link against
the exact candidate commit. University/open-course material calibrates
instructional scope; it does not promise institutional equivalence, grant
blanket reuse rights, or establish learner competence.
