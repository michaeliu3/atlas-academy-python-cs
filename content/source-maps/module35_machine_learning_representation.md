# Module 35 — Machine Learning & Representation: Candidate Source Ledger

## Scope and truth boundary

This ledger belongs to the fixed, **hidden review candidate** at
[content/modules/35_machine_learning_representation.md](../modules/35_machine_learning_representation.md).
It lets a future qualified reviewer inspect the candidate's claims and source
routes without substituting the instructor research dossier or authoring
workbook.

It is not a review approval, learner route, release record, course-equivalence
claim, data-permission decision, model-deployment decision, theorem proof, or
learner-mastery record. M35 remains authoring-only and hidden until the
canonical graph, contract evidence, qualified review, interaction,
accessibility, CI, deployment, and provenance requirements agree. Its
prerequisites M13, M22, M28, M30, M31, M32, and M34 remain required; selecting
this file neither satisfies them nor opens M36, M25, or M26.

Atlas explanations, diagrams, synthetic fixtures, derivations, diagnostics,
oral prompts, and dossiers are independently authored. The links below are for
study and provenance; they do not authorize copying third-party prose, figures,
tables, slides, exercises, code, data, weights, benchmarks, recordings, or
grading artifacts.

## Claim and session map

| Candidate claim | Sessions | What the source route checks | Candidate boundary |
| --- | --- | --- | --- |
| M35-C01: representation preserves some information and discards other information under a task relation | 1 | representation choice, preprocessing, geometry, and information budget | A representation does not discover meaning or validate a task. |
| M35-C02: a baseline and learned model need comparable information and evaluation boundaries | 2 | baseline purpose, objective, shared split, and failure comparison | A higher score does not establish value, causality, or use authority. |
| M35-C03–C05: evaluation, calibration, uncertainty, and shift need a named population/relation | 3 | split design, leakage, reliability estimate, and shift scope | A finite metric does not guarantee generalization or robustness. |
| M35-C06–C07: objective, autodiff, regularization, execution, and reproducibility are different evidence layers | 4 | likelihood/optimization relation, framework contract, random-state/environment limits | A gradient or repeated seed does not validate the objective or future behavior. |
| M35-C08: debugging and observability must inspect data/model/metric/system failure modes | 5 | validation, testing, coupling, and probe design | A dashboard or passing pipeline is not a safety or production certificate. |
| M35-C09: a model card and governance evidence expose boundaries rather than grant authority | 6 | reporting, use context, risk, accountability, and prohibited-use boundary | Documentation does not authorize a consequential decision. |

## Source ledger

| ID | Stable learner-facing source | Claim linkage and rationale | Access record and reuse status |
| --- | --- | --- | --- |
| S35-01 | Bengio, Courville, and Vincent, [Representation Learning](https://doi.org/10.1109/TPAMI.2013.50) | C01; representation choice and prior structure under stated task/data assumptions. | Accessed 2026-07-31. IEEE record; link/cite only and original examples. |
| S35-02 | scikit-learn, [decomposition / PCA guide](https://scikit-learn.org/stable/modules/decomposition.html) | C01; preprocessing, solver, input, and version affect an API claim. | Accessed 2026-07-31. BSD-3-Clause project; link-only/original fixtures; recheck API version. |
| S35-03 | Zinkevich, [Rules of Machine Learning](https://developers.google.com/machine-learning/guides/rules-of-ml) | C02, C06, C08; baseline-first and operational evidence as guidance, not theorem. | Accessed 2026-07-31. Google documentation; link/cite only; no copied rules/examples or endorsement claim. |
| S35-04 | scikit-learn, [`DummyClassifier`](https://scikit-learn.org/stable/modules/generated/sklearn.dummy.DummyClassifier.html) | C02; transparent feature-ignoring baseline. | Accessed 2026-07-31. BSD-3-Clause project; link-only/original code and expected-output fixture. |
| S35-05 | scikit-learn, [cross-validation guide](https://scikit-learn.org/stable/modules/cross_validation.html) | C03; split mechanism is part of evaluation design. | Accessed 2026-07-31. BSD-3-Clause project; link-only/original split diagrams; no IID guarantee. |
| S35-06 | scikit-learn, [common pitfalls](https://scikit-learn.org/stable/common_pitfalls.html) | C03; leakage/inconsistent-preprocessing counterexample. | Accessed 2026-07-31. BSD-3-Clause project; link-only/original experiment; no copied code/results. |
| S35-07 | Guo et al., [On Calibration of Modern Neural Networks](https://proceedings.mlr.press/v70/guo17a.html) | C04; calibration relation and bounded temperature-scaling comparison. | Accessed 2026-07-31. Proceedings paper; link/cite only; original calibration examples and diagrams. |
| S35-08 | Ovadia et al., [Can You Trust Your Model's Uncertainty?](https://proceedings.neurips.cc/paper_files/paper/2019/hash/8558cb408c1d76621371888657d2eb1d-Abstract.html) | C05; uncertainty/calibration must be checked under named shift. | Accessed 2026-07-31. NeurIPS record; link/cite only; no benchmark/data/code/result reuse. |
| S35-09 | PyTorch, [autograd mechanics](https://docs.pytorch.org/docs/stable/notes/autograd.html) | C07; reverse-mode graph versus objective validation. | Accessed 2026-07-31. BSD-3-Clause project; link-only/original trace and finite-difference check. |
| S35-10 | PyTorch, [reproducibility note](https://docs.pytorch.org/docs/stable/notes/randomness.html) | C07; seed does not ensure identity across releases/platforms/devices. | Accessed 2026-07-31. BSD-3-Clause project; link-only/original environment card. |
| S35-11 | Breck et al., [What's Your ML Test Score?](https://research.google/pubs/whats-your-ml-test-score-a-rubric-for-ml-production-systems/) | C08; testing/monitoring rubric as diagnostic framing. | Accessed 2026-07-31. Google Research record; link/cite only; not a certification scheme. |
| S35-12 | Breck et al., [Data Validation for Machine Learning](https://research.google/pubs/data-validation-for-machine-learning/) | C08; data validation and training-serving anomaly discussion. | Accessed 2026-07-31. Google Research record; link/cite only; no schemas, code, or production claims. |
| S35-13 | Mitchell et al., [Model Cards for Model Reporting](https://research.google/pubs/model-cards-for-model-reporting/) | C09; use-context/evaluation reporting boundary. | Accessed 2026-07-31. Google Research record; link/cite only; a card is not automatically truthful or deployable. |
| S35-14 | NIST, [AI Risk Management Framework 1.0](https://doi.org/10.6028/NIST.AI.100-1) | C09; governance, accountability, and authority distinction. | Accessed 2026-07-31. Official guidance; link/cite only pending asset review; not legal advice or approval authority. |
| S35-15 | Sculley et al., [Hidden Technical Debt in Machine Learning Systems](https://research.google/pubs/hidden-technical-debt-in-machine-learning-systems/) | C08; coupling and data-dependency observability lens. | Accessed 2026-07-31. Google Research/proceedings record; link/cite only; no defect claim from citation alone. |
| S35-16 | MIT OpenCourseWare, [6.036 Introduction to Machine Learning](https://ocw.mit.edu/courses/6-036-introduction-to-machine-learning-fall-2020/) | Sessions 1–5; scope calibration for learning, selection, and systems reasoning. | Accessed 2026-07-31. MIT OCW item notices apply; link-only/original materials. |
| S35-17 | Carnegie Mellon University, [10-301/601 Introduction to Machine Learning](https://www.cs.cmu.edu/~mgormley/courses/10601/) | Sessions 2–4; formulation, regularization, selection, and formal-guarantee scope. | Accessed 2026-07-31. Course material is link/cite only; no lectures, assignments, or data reuse. |
| S35-18 | Stanford, [CS229 course materials](https://cs229.stanford.edu/materials.html-full) | Sessions 1–4; supervised-learning and learning-theory sequencing. | Accessed 2026-07-31. Link/cite only; no notes, assignments, figures, or solutions. |
| S35-19 | Georgia Tech, [CS 7641 Machine Learning](https://omscs.gatech.edu/cs-7641-machine-learning) | Sessions 1–6; connected ML analysis and report-scope calibration. | Accessed 2026-07-31. Link/cite only; no course reports, feedback, or term-long work reuse. |
| S35-20 | scikit-learn, [probability calibration guide](https://scikit-learn.org/stable/modules/calibration.html) | C04; population calibration relation versus finite reliability estimate. | Checked 2026-08-01. BSD-3-Clause project; link-only/original tables; recheck documentation version. |
| S35-21 | scikit-learn, [`brier_score_loss`](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.brier_score_loss.html) | C03–C04; bounded probabilistic-loss convention. | Checked 2026-08-01. BSD-3-Clause project; link-only/original cards; lower score is not a policy. |
| S35-22 | MIT OpenCourseWare, [18.642 Topics in Mathematics with Applications in Finance](https://ocw.mit.edu/courses/18-642-topics-in-mathematics-with-applications-in-finance-fall-2024/) | C03; fit/validation/final-held-out-test distinction. | Accessed 2026-08-04. MIT OCW item notices apply; link-only/original rows, derivation, and code. |
| S35-23 | Carnegie Mellon University, [10-315 Chapter 1](https://www.cs.cmu.edu/~10315-s24/notes/ciml-v0_99-ch01.pdf) | C03; learning loss, unknown distribution, sample versus future loss. | Accessed 2026-08-02. Course notes are link-only/original-paraphrase; no prose, figures, or exercises reuse. |
| S35-24 | MIT OpenCourseWare, [6.7960 Lecture 17: Out-of-Distribution Generalization](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/mit6_7960_f24_lec17.pdf) | C05; same-relation versus named input/label/measurement shifts. | Accessed 2026-08-02. MIT OCW item notices apply; link-only/original diagrams and calculations. |
| S35-25 | MIT OpenCourseWare, [6.036 Introduction to Machine Learning](https://ocw.mit.edu/courses/6-036-introduction-to-machine-learning-fall-2020/), and Carnegie Mellon University, [10-301/601 Introduction to Machine Learning](https://www.cs.cmu.edu/~mgormley/courses/10601/) | C03, C09; Session 6 preflight calibrates the distinction between declared experiment evidence and a decision-authority assertion. The authority boundary remains C09/S35-14; the courses do not establish a deployment or authority claim. | Rechecked 2026-08-03. Link/cite only; original synthetic exercise, with no lectures, assignments, figures, data, recordings, or grading artifacts reused. |

## Review checklist for these routes

Before a future M35 release, recheck every URL, source version, access date,
license/reuse notice, equation, framework contract, and source-to-claim link
against the exact candidate commit. University, standards, documentation, and
primary-source routes calibrate instructional scope and formal definitions; they
do not grant reuse, automatically prove the candidate's argument, establish
learner competence, validate a data/model relation, or authorize a decision.

The focused [2026-08-03 official calibration](../../docs/research/m35-m36-official-calibration-2026-08-03.md)
records the scope check and its remaining delivery-evidence boundary. It is not
a source-map selection, review approval, or release record.
