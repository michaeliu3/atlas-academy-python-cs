# Module 36 — Statistical Learning Theory & Reliable Deep-Learning Systems: Candidate Source Ledger

## Scope and truth boundary

This ledger belongs to the fixed, **hidden review candidate** at
[content/modules/36_statistical_learning_theory_reliable_deep_learning.md](../modules/36_statistical_learning_theory_reliable_deep_learning.md).
It lets a future qualified reviewer inspect the candidate's claims and source
routes without substituting the instructor research dossier or authoring
workbook.

It is not a review approval, learner route, release record, course-equivalence
claim, theorem proof, robustness certificate, data-permission decision, or
learner-mastery record. M36 remains authoring-only and hidden until the
canonical graph, contract evidence, qualified review, interaction,
accessibility, CI, deployment, and provenance requirements agree. Its
prerequisites M29, M31, M32, M33, and M35 remain required; selecting this file
neither satisfies them nor opens M25 or M26.

Atlas explanations, diagrams, synthetic fixtures, theorem cards, diagnostics,
oral prompts, and dossiers are independently authored. The links below are for
study and provenance; they do not authorize copying third-party prose, proofs,
figures, tables, slides, exercises, code, data, weights, benchmarks,
recordings, or grading artifacts.

## Claim and session map

| Candidate claim | Sessions | What the source route checks | Candidate boundary |
| --- | --- | --- |
| M36-C01: population risk, empirical risk, class, loss, and sample are named before a learning claim | 1 | definition, quantifier, and sampling relation | A finite fit is not a population or deployment result. |
| M36-C02, C04–C05: approximation, estimation, optimization, capacity, and deep-learning claims have different assumptions | 2–3 | gap decomposition, theorem hypotheses, and counterexample scope | A theorem label or training loss does not prove a system generalizes. |
| M36-C03, C07: numerical experiment and reproducibility have bounded environment/protocol conditions | 4 | framework, precision, backend, device, seed, and comparison record | A repeat or seed does not establish cross-platform identity or scientific validity. |
| M36-C06, C08–C09: calibration, shift, monitoring, and authority require separate evidence and response ownership | 5–6 | named shift relation, observable, intervention, and governance boundary | A metric/alert does not diagnose cause or authorize action. |

## Source ledger

| ID | Stable learner-facing source | Claim linkage and rationale | Access record and reuse status |
| --- | --- | --- | --- |
| S36-01 | Vapnik and Chervonenkis, [Uniform Convergence of Relative Frequencies](https://mlanthology.org/misc/1971/vapnik1971misc-uniform/) | C01/C04; class-level deviation under named class/sample/probability assumptions. | Accessed 2026-07-31. Historic paper; link/cite only; no translation/proof/figure reuse. |
| S36-02 | Valiant, [A Theory of the Learnable](https://dl.acm.org/doi/10.1145/1968.1972) | C04; PAC accuracy/confidence/sample/resource quantifiers. | Accessed 2026-07-31. ACM publication; link/cite only; no excerpts/examples reuse. |
| S36-03 | Shalev-Shwartz et al., [Learnability, Stability and Uniform Convergence](https://www.jmlr.org/papers/v11/shalev-shwartz10a.html) | C04; counterweight to slogan-level uniform-convergence reasoning. | Accessed 2026-07-31. JMLR paper; link/cite only; not a universal deep-learning theorem. |
| S36-04 | Bartlett, Foster, and Telgarsky, [Spectrally-normalized Margin Bounds](https://proceedings.neurips.cc/paper/2017/hash/b22b257ad0519d4500539da3c8bcf4dd-Abstract.html) | C05; complexity, margin, experiment, and scope separation. | Accessed 2026-07-31. NeurIPS record; link/cite only; no constants/figures/benchmark reuse. |
| S36-05 | Zhang et al., [Understanding Deep Learning Requires Rethinking Generalization](https://openreview.net/forum?id=Sy8gdB9xx) ([arXiv fallback](https://arxiv.org/abs/1611.03530)) | C05; counterexample to simplistic capacity/regularization stories. | Accessed 2026-07-31. OpenReview/arXiv paper; link/cite only; experiments do not establish an Atlas-system property. |
| S36-06 | Belkin et al., [Reconciling Modern ML Practice and the Classical Bias–Variance Trade-Off](https://www.pnas.org/doi/10.1073/pnas.1903070116) | C02/C05; bounded double-descent discussion. | Accessed 2026-07-31. PNAS article; link/cite only; no universal curve or reliability claim. |
| S36-07 | Guo et al., [On Calibration of Modern Neural Networks](https://proceedings.mlr.press/v70/guo17a.html) | C06; accuracy versus population calibration relation. | Accessed 2026-07-31. Proceedings paper; link/cite only; no shift/deployment guarantee. |
| S36-08 | Ovadia et al., [Can You Trust Your Model's Uncertainty?](https://proceedings.neurips.cc/paper_files/paper/2019/hash/8558cb408c1d76621371888657d2eb1d-Abstract.html) | C06/C08; calibration/uncertainty under named shifts. | Accessed 2026-07-31. NeurIPS record; link/cite only; not a reliability certificate. |
| S36-09 | Koh et al., [WILDS](https://proceedings.mlr.press/v139/koh21a.html) | C08; named training/test relation differences beyond one IID score. | Accessed 2026-07-31. Proceedings paper; link/cite only; no data/scores/benchmark reuse. |
| S36-10 | Pineau et al., [Improving Reproducibility in Machine Learning Research](https://www.jmlr.org/papers/v22/20-303.html) | C07; reproducibility checklist as evidence discipline. | Accessed 2026-07-31. JMLR paper; link/cite only; not bitwise identity or publication approval. |
| S36-11 | PyTorch, [reproducibility](https://docs.pytorch.org/docs/stable/notes/randomness.html) and [numerical accuracy](https://docs.pytorch.org/docs/stable/notes/numerical_accuracy.html) | C07; framework/precision/nondeterminism checklist. | Accessed 2026-07-31. BSD-3-Clause project; link-only/original reproduction cards; pin exact release. |
| S36-12 | NIST, [AI Risk Management Framework 1.0](https://doi.org/10.6028/NIST.AI.100-1) | C08/C09; measurement, management, governance, and intended-use vocabulary. | Accessed 2026-07-31. Official guidance; link/cite only; not law, certification, or approval. |
| S36-13 | MIT OpenCourseWare, [6.7960 Deep Learning: Generalization Theory](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/resources/mit6_7960f24_lec06_mp4/) | Sessions 2–3; scope calibration for generalization/overparameterization/VC limits. | Accessed 2026-07-31. MIT OCW item notices apply; link-only/original materials. |
| S36-14 | MIT OpenCourseWare, [9.520 VC-dimension notes](https://ocw.mit.edu/courses/9-520-statistical-learning-theory-and-applications-spring-2006/resources/class17/) | Session 3; function-class complexity/VC-style definitions. | Accessed 2026-07-31. MIT OCW notices apply; link/cite only unless asset review records otherwise. |
| S36-15 | Carnegie Mellon University, [10-301/601 Introduction to Machine Learning](https://www.cs.cmu.edu/~mgormley/courses/10601/) | Session 3; regularization/model selection and formal-guarantee limits. | Accessed 2026-08-01. Course materials link/cite only; no lecture/assignment/data reuse. |
| S36-16 | Stanford, [CS229 course materials](https://cs229.stanford.edu/materials.html-full) | Session 3; learning-theory and selection sequence. | Accessed 2026-08-01. Link/cite only; no notes, assignments, figures, or solutions. |
| S36-17 | Hoeffding, [Probability Inequalities for Sums of Bounded Random Variables](https://doi.org/10.1080/01621459.1963.10500830) | Session 3; fixed-hypothesis bounded-IID concentration step. | Accessed 2026-08-01. Journal article; link/cite only; original theorem card and derivation. |
| S36-18 | Carnegie Mellon University, [10-806 PAC and efficiency notes](https://www.cs.cmu.edu/~avrim/ML07/lect1207.pdf) | Session 3; realizable PAC quantifiers and separate time/sample requirement. | Accessed 2026-08-02. Course notes link-only/original-paraphrase; no theorem/exercise/proof reuse. |
| S36-19 | MIT OpenCourseWare, [6.080 PAC Learning](https://ocw.mit.edu/courses/6-080-great-ideas-in-theoretical-computer-science-spring-2008/838468541460ee9c1d08eb36c1921d30_lec20.pdf) | Session 3; sample guarantee versus fitting-efficiency boundary. | Accessed 2026-08-02. MIT OCW notices apply; link-only/original notation/proof sketch. |
| S36-20 | MIT OpenCourseWare, [6.7960 Lecture 17: OOD Generalization](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/mit6_7960_f24_lec17.pdf) | Session 5; declared perturbation threat set versus broader named shift relation. | Accessed 2026-08-02. MIT OCW notices apply; link-only/original synthetic card and non-claims. |

## Review checklist for these routes

Before a future M36 release, recheck every URL, source version, access date,
license/reuse notice, theorem wording, numerical claim, framework contract, and
source-to-claim link against the exact candidate commit. University, standards,
documentation, and primary-source routes calibrate instructional scope and
formal definitions; they do not grant reuse, automatically prove the
candidate's arguments, establish learner competence, validate a learning
system, or authorize a decision.
