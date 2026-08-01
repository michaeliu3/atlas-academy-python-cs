# Academic calibration — mathematics and AI arcs (M27–M36)

## Scope, method, and truth boundary

This is a compact material-level calibration pass for Atlas's mathematics and
AI arc. It compares named Atlas session artifacts with official university
course pages, syllabi, notes, lectures, or assignment routes—not merely course
titles. **Every university link below was accessed on 2026-08-01.**

The comparison is about intellectual scope, prerequisite logic, and evidence
standards. It is not a claim of enrollment, faculty feedback, contact hours,
grading, peer learning, credit, a degree, or equivalence to any course.

M27–M30 are reader-visible legacy workbooks. M31–M36 are candidate workbooks
for **private instructor-led draft study only**: they remain authoring-only and
hidden in the Atlas portal. Their use does not create portal access, Core
credit, publication, release readiness, or mastery evidence.

Atlas links to and paraphrases these sources. It does not copy their lecture
notes, slides, assignments, solutions, figures, recordings, or code without a
specific asset-level permission decision. The comparisons below use original
Atlas prose, examples, traces, and dossiers.

## Foundation check (M27–M30)

| Atlas module | Official material checked | Concrete Atlas comparison | Decision |
| --- | --- | --- | --- |
| **M27 — Discrete Mathematics, Proof, Counting & Structures** | MIT [6.042J syllabus](https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/pages/syllabus/) and [6.045J syllabus/problem-set route](https://ocw.mit.edu/courses/6-045j-automata-computability-and-complexity-spring-2011/pages/syllabus/) | The visible workbook's proof, induction, recurrence, counting, and counterexample work supplies the notation and proof-repair habits later reused by M33. | **Aligned:** discrete proof spine. **Adapted:** code countermodels and oral defense. **Gap:** retain one full written proof; finite tests never establish a theorem. |
| **M28 — Linear Algebra, Numerical Stability & Representation** | MIT [18.06 Linear Algebra](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/) and [18.335J Numerical Methods syllabus](https://ocw.mit.edu/courses/18-335j-introduction-to-numerical-methods-spring-2019/pages/syllabus/) | The visible workbook's linear-map, decomposition, conditioning, and numerical-experiment work supplies the shape/precision assumptions reused in M31, M32, and M35. | **Aligned:** core linear/numerical objects. **Adapted:** array-pipeline and stability inspection. **Gap:** keep a bounded QR-versus-normal-equations comparison rather than a hardware-performance claim. |
| **M29 — Calculus, Real Analysis & Continuous Change** | MIT [18.01SC Calculus syllabus](https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/pages/syllabus/) and [18.100B Real Analysis](https://ocw.mit.edu/courses/18-100b-real-analysis-spring-2025/) | The visible workbook's limit, derivative, integral, convergence, and numerical-boundary work supplies the hypotheses used by M31 optimization and M36 generalization reasoning. | **Aligned:** calculus-to-analysis bridge. **Adapted:** code-reading/Taylor-error checks. **Gap:** keep a quantified convergence proof before an interchange-of-limit claim. |
| **M30 — Probability, Statistics & Scientific Inference** | MIT [18.600 Probability syllabus](https://ocw.mit.edu/courses/18-600-probability-and-random-variables-fall-2019/pages/syllabus/) | The visible workbook's probability model, sampling/inference, uncertainty, and simulation evidence becomes the input-model discipline for M31, M35, and M36. | **Aligned:** probability and inference language. **Adapted:** synthetic inference audit. **Gap:** a 60-day core is not a full mathematical-statistics sequence. |

## Advanced depth-batch material comparison (M31–M36)

| Atlas module | Official material checked | Concrete Atlas material reviewed | Aligned / adapted / genuine gap |
| --- | --- | --- | --- |
| **M31 — Optimization & Information** | Stanford [EE364a Convex Optimization I](https://web.stanford.edu/class/ee364a/) and its [lecture-slide route](https://web.stanford.edu/class/ee364a/lectures.html); MIT [6.441 Information Theory lecture notes](https://ocw.mit.edu/courses/6-441-information-theory-spring-2016/pages/lecture-notes/) | [M31 candidate workbook](../../content/authoring/m31_optimization_information_workbook.v1.md): Sessions 1–3 require formulation, stationarity, feasibility, and conditional certificates; Sessions 4–6 separate stopping evidence, stochastic observations, and information trade-offs in an `Optimization and Information Evidence Dossier`. | **Aligned:** convex formulation/duality conditions and information measures. **Adapted:** read a solver record or derivation before trusting it. **Gap:** no full EE364a/6.441 proof and problem-set volume; retain narrow KKT/duality and information derivations, then obtain source/reuse and private-guided review before any release decision. |
| **M32 — Systems Languages, Scientific Python & Accelerators** | Stanford [CS149 Parallel Computing](https://cs149.stanford.edu/) (lecture schedule and programming-assignment route); MIT [12.010 Computational Methods of Scientific Programming](https://ocw.mit.edu/courses/12-010-computational-methods-of-scientific-programming-fall-2024/) | [M32 candidate workbook](../../content/authoring/m32_systems_languages_scientific_python_accelerators_workbook.v1.md): boundary contracts, execution-transfer traces, layout/numerics, buffer ownership, autodiff traces, and a bounded systems dossier across Sessions 1–6. | **Aligned:** parallel hardware/software trade-offs, locality, work distribution, accelerator boundaries, and reproducible scientific-computing evidence. **Adapted:** CPU-first traces and code review rather than a required GPU setup. **Gap:** no claim of speedup, portability, overlap, or race freedom from one run; choose a verified bounded fixture and complete accessibility/source review before release. |
| **M33 — Formal Languages, Computability & Complexity** | MIT [6.045J syllabus and problem-set route](https://ocw.mit.edu/courses/6-045j-automata-computability-and-complexity-spring-2011/pages/syllabus/); Georgia Tech [CS 6515 Intro to Graduate Algorithms](https://omscs.gatech.edu/cs-6515-intro-graduate-algorithms) | [M33 candidate workbook](../../content/authoring/m33_formal_languages_computability_complexity_workbook.v1.md): language/machine separation, finite-state countermodels, computability boundaries, reductions, and complexity-claim cards culminate in a `Formal Limits Claim Packet`. | **Aligned:** formal objects, reductions, and complexity reasoning. **Adapted:** inspect an AI-generated proof/reduction as untrusted input. **Gap:** six sessions cannot reproduce term-long theorem/problem-set practice; require visible quantifiers and a counterexample before accepting a formal conclusion. |
| **M34 — Classical AI: Search, Constraints & Decision** | UC Berkeley [CS 188 current course calendar/projects](https://inst.eecs.berkeley.edu/~cs188/); MIT [6.034 Artificial Intelligence](https://ocw.mit.edu/courses/6-034-artificial-intelligence-fall-2010/); Georgia Tech [CS 6601 Artificial Intelligence](https://omscs.gatech.edu/cs-6601-artificial-intelligence) | [M34 candidate workbook](../../content/authoring/m34_classical_ai_search_constraints_decision_workbook.v1.md): state models, search-condition traces, constraints/relaxations, planning limits, utility/authority separation, and a `Classical AI Search, Constraints & Decision Packet`. | **Aligned:** state-space search, constraints, decision reasoning, and their mathematical prerequisites. **Adapted:** each solver/search result carries a condition and human-authority boundary. **Gap:** Atlas does not reproduce CS188/6.034/CS6601 programming-project breadth; use a verified small oracle and keep completeness/optimality conditional. |
| **M35 — Machine Learning & Representation** | Stanford [CS229 Machine Learning](https://cs229.stanford.edu/) (scope and prerequisites); Georgia Tech [CS 7641 Machine Learning](https://omscs.gatech.edu/cs-7641-machine-learning) (supervised/unsupervised/RL progression and analysis reports) | [M35 candidate workbook](../../content/authoring/m35_machine_learning_representation_workbook.v1.md): representation assumptions, baseline comparison, split/metric/calibration/shift plan, optimization trace, debugging/observability matrix, and a responsible-ML dossier. | **Aligned:** representation, learning formulation, evaluation, generalization, and decision-making under uncertainty. **Adapted:** baseline, leakage, target population, shift, and failed-useful evidence precede model celebration. **Gap:** no full supervised training corpus or university-scale reports; the Stanford materials may require affiliate access, so do not imply public access or copied assignments. |
| **M36 — Statistical Learning Theory & Reliable Deep-Learning Systems** | MIT [9.520 Statistical Learning Theory and Applications](https://ocw.mit.edu/courses/9-520-statistical-learning-theory-and-applications-spring-2006/) (lecture notes and assignments); MIT [6.7960 Deep Learning](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/) (readings, notes, videos, homework, and final-project route) | [M36 candidate workbook](../../content/authoring/m36_statistical_learning_theory_reliable_deep_learning_workbook.v1.md): assumption scope, optimization/generalization gap, capacity/theorem card, reproducibility record, shift/monitoring map, and synthesis-facing reliability dossier. | **Aligned:** regularization/generalization bounds, stability/VC-style reasoning, autodiff/deep-learning foundations, and project-scale evidence expectations. **Adapted:** a theorem or metric is read alongside data, numerical, monitoring, and human-control limits. **Gap:** no full graduate proof sequence or deep-learning lab/project; do not claim universal reliability, and keep authoring-only until source, accessibility, teaching-flow, and release review agree. |

## Cross-arc decisions

1. **The comparison now points to real Atlas artifacts.** M31–M36 are not
   treated as a list of topics: each has a named six-session workbook and a
   concrete dossier/trace artifact compared with a university material route.
2. **The instructional adaptation is deliberate.** Atlas preserves difficult
   mathematical and systems reasoning while concentrating practice on reading,
   testing, debugging, and defending generated or unfamiliar work. That does
   not replace the longer proof, lab, project, or feedback cycles of the cited
   institutions.
3. **Georgia Tech is a comparison anchor, not a duplicate curriculum.** CS
   6515, CS 6601, and CS 7641 add official graduate-level algorithm, AI, and ML
   scope/prerequisite checks where they improve a real gap decision.
4. **Use a source to repair a named gap.** A learner or TA should select the
   relevant lecture/note/assignment route only when it deepens the current
   module; linked material is not copied into Atlas or treated as completion
   evidence.

## Honest conclusion

M27–M36 now has an official-source, material-linked calibration pass spanning
MIT, Stanford, UC Berkeley, and Georgia Tech. It supports comparable
intellectual rigor and clearer next-step choices where feasible; it does not
establish university-course equivalence, durable mastery after sixty days, or
permission to publish the authoring-only advanced packs.
