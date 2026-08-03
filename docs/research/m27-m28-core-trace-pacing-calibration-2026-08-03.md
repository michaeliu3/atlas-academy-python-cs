# M27–M28 core-trace and pacing calibration — 2026-08-03

## Purpose and boundary

This is a small, research-only input to a future learner-facing pacing card.
It changes no workbook, graph, contract, release state, route, or learner
claim. All sources below were accessed **2026-08-03** and are official
university material used for calibration and links only; Atlas should retain
original prose, examples, diagrams, code, and prompts.

| Module | Official calibration route | What it establishes — and what it does not |
| --- | --- | --- |
| M27 — discrete mathematics | MIT [6.1200J readings](https://ocw.mit.edu/courses/6-1200j-mathematics-for-computer-science-spring-2024/pages/readings/) sequence proofs, induction, asymptotics/recurrences, number theory, graphs, matching, connectivity, and counting. CMU [15-151](https://csd.cs.cmu.edu/course/15151/s25) names logic, sets, induction, functions, combinatorics, proof formalization, experimentation, and collaboration. | The present six-session proof → recurrence → graph/structure route is an appropriate introductory synthesis. Those sources spread the material across a term with problem work; they do not justify calling a six-session Atlas module equivalent to either course. |
| M28 — linear algebra, representation, and stability | MIT [18.06SC syllabus](https://ocw.mit.edu/courses/18-06sc-linear-algebra-fall-2011/pages/syllabus/) sequences subspaces, projections/least squares, eigenstructure, PSD matrices, SVD, change of basis, and pseudoinverses. MIT [18.335J syllabus](https://ocw.mit.edu/courses/18-335j-introduction-to-numerical-methods-spring-2019/pages/syllabus/) treats QR/SVD, stability, accuracy, IEEE floating point, and linear-algebra software as a later course after linear algebra; its [Week 2 notes](https://ocw.mit.edu/courses/18-335j-introduction-to-numerical-methods-spring-2019/pages/week-2/) explicitly distinguish conditioning, backward error, and forward error. MIT [18.065](https://ocw.mit.edu/courses/18-065-matrix-methods-in-data-analysis-signal-processing-and-machine-learning-spring-2018/) supplies the downstream SVD/PCA/data-analysis bridge. | M28's spaces/maps → projection → spectral hypotheses → SVD/conditioning → PCA spine is well chosen. Full numerical-linear-algebra algorithms, floating-point analysis, and a complete ML treatment are deliberately outside its core; the graduate source is a depth boundary, not a compressed requirement. |

MIT 18.06SC describes approximately 150 hours for its independent-study
course, while its individual sessions are still expected to take an hour or
more. That scale is evidence for conservative Atlas planning, not a basis for
an equivalence claim.

## Recommended learner-facing route (not yet applied)

| Module | Core trace: minimum evidence before moving on | Optional deepening after the trace | Conservative planning band |
| --- | --- | --- | --- |
| **M27** | Carry one claim through **definition/domain → prediction → proof or counterexample → recurrence/count with base conditions → graph or modular/ordering model → short transfer explanation**. The six sessions remain visible; the dossier must distinguish a general proof, a finite test, a code trace, and an AI proposal. | Formal-series generating functions beyond a small coefficient example; a full matching theorem proof; broader lattice theory; additional number-theory/cryptography applications. | **13–17 hours** for the core evidence route; **+7–11 hours** for one or more depth threads. |
| **M28** | Keep one named map/data matrix visible: **shape and field → rank/null direction → projection/least-squares derivation → symmetry/PSD hypothesis check → SVD/conditioning experiment → centered-and-scaled PCA explanation**. Every numerical conclusion names the norm, dtype/algorithm, and whether it is a theorem, API contract, or finite observation. | Proof-level spectral/SVD development; QR versus normal-equation numerical analysis; backward-stability/IEEE detail; broader tensor/matrix calculus; high-dimensional PCA practice. | **14–18 hours** for the core evidence route; **+9–14 hours** for one or more depth threads. |

These are planning envelopes, not measured learner times, hidden release
claims, or a replacement for the graph's `referenceReadMinutes`. They should
be shown as a *minimum-evidence path* plus optional depth, with the 90- and
180-day routes recommended whenever the learner cannot protect the core time.

## First-principles presentation rules for the lean batch

1. Put the core trace before the large reference workbook. Mark each optional
   depth branch explicitly; do not make the learner infer that a theorem proof,
   numerical experiment, and API call establish the same thing.
2. In M27, require a definition and a counterexample attempt before a proof
   template or an AI critique. In M28, define the map, spaces, norm, and
   perturbation/finite-precision model before displaying a condition number or
   plot.
3. Use one small, inspectable artifact per module: a claim ledger for M27 and
   a shape/norm/error ledger for M28. The TA can use it for a constructive oral
   defense; it is evidence for next-step guidance, never pass/fail grading.

This calibration recommends clearer pacing and progressive disclosure, not
topic removal, university-course substitution, or a claim of learner mastery.
