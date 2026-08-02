# Academic calibration — mathematics and AI arcs (M27–M36)

## Scope, method, and truth boundary

This is a compact material-level calibration pass for Atlas's mathematics and
AI arc. It compares named Atlas session artifacts with official university
course pages, syllabi, notes, lectures, or assignment routes—not merely course
titles. The foundation and M27–M36 pass was accessed on **2026-08-01**; the
design-only extension calibration below was rechecked on **2026-08-02**.

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
| **M31 — Optimization & Information** | MIT [6.7220/15.084 Nonlinear Optimization](https://ocw.mit.edu/courses/6-7220j-nonlinear-optimization-spring-2025/) and its [lecture-note route](https://ocw.mit.edu/courses/6-7220j-nonlinear-optimization-spring-2025/pages/lecture-notes/); Stanford [EE364a Convex Optimization I](https://web.stanford.edu/class/ee364a/); MIT [6.441 Information Theory lecture notes](https://ocw.mit.edu/courses/6-441-information-theory-spring-2016/pages/lecture-notes/) | [M31 candidate workbook](../../content/authoring/m31_optimization_information_workbook.v1.md): Sessions 1–3 require formulation, stationarity, feasibility, certificates, and a compact primal/dual reading; Sessions 4–6 separate stopping evidence, stochastic assumptions, and information trade-offs in an `Optimization and Information Evidence Dossier`. | **Aligned and adapted:** convex formulation, KKT/duality conditions, stochastic-estimator assumptions, and information measures are read before they are trusted. **Gap:** no full 6.7220/EE364a/6.441 proof and problem-set volume; retain narrow derivations and obtain source/reuse plus private-guided review before any release decision. |
| **M32 — Systems Languages, Scientific Python & Accelerators** | CMU [15-213 Introduction to Computer Systems](https://www.cs.cmu.edu/~213/); MIT [6.172 Performance Engineering of Software Systems](https://ocw.mit.edu/courses/6-172-performance-engineering-of-software-systems-fall-2018/); Stanford [CS149 Parallel Computing](https://cs149.stanford.edu/); MIT [12.010 Computational Methods of Scientific Programming](https://ocw.mit.edu/courses/12-010-computational-methods-of-scientific-programming-fall-2024/) | [M32 candidate workbook](../../content/authoring/m32_systems_languages_scientific_python_accelerators_workbook.v1.md): boundary contracts, execution-transfer traces, a versioned NumPy observation/documentation bridge, an optional documented PyTorch CUDA reading lens, layout/numerics, buffer ownership, autodiff traces, and a systems dossier across Sessions 1–6. | **Aligned and adapted:** programmer-visible execution, locality/layout, synchronization, performance evidence, accelerator boundaries, and reproducible scientific-computing reasoning. **Gap:** no claim of speedup, portability, overlap, or race freedom from one card/run; platform-specific semantics, accessibility/source review, and release review remain separate. |
| **M33 — Formal Languages, Computability & Complexity** | MIT [6.045J syllabus and problem-set route](https://ocw.mit.edu/courses/6-045j-automata-computability-and-complexity-spring-2011/pages/syllabus/); Stanford [CS103 course materials](https://web.stanford.edu/class/archive/cs/cs103/cs103.1264/); CMU [15-251 Foundations of Theoretical Computer Science](https://www.cs.cmu.edu/~arielpro/15251f15/schedule.html); Georgia Tech [CS 4510 Formal Languages and Automata](https://faculty.cc.gatech.edu/~ladha/S26/4510/) and [CS 6515 Intro to Graduate Algorithms](https://omscs.gatech.edu/cs-6515-intro-graduate-algorithms) | [M33 candidate workbook](../../content/authoring/m33_formal_languages_computability_complexity_workbook.v1.md): language/machine separation, a constructive CFG witness for \(\{0^n1^n\}\), a bounded NFA-to-DFA construction trace, finite-state countermodels, a halting-to-acceptance mapping reduction, and complexity-claim cards culminating in a `Formal Limits Claim Packet`. | **Aligned and adapted:** formal objects, constructions, reductions, and complexity reasoning remain explicit while AI-generated proof/reduction text is treated as untrusted input. **Gap:** six sessions cannot reproduce term-long theorem/problem-set practice or full formal-language breadth; retain visible quantifiers, a counterexample, and a formal-model boundary before accepting a conclusion. |
| **M34 — Classical AI: Search, Constraints & Decision** | UC Berkeley [CS 188 textbook](https://inst.eecs.berkeley.edu/~cs188/textbook/) with [search](https://inst.eecs.berkeley.edu/~cs188/textbook/search/summary.html), [CSP](https://inst.eecs.berkeley.edu/~cs188/textbook/csp/summary.html), and [MDP](https://inst.eecs.berkeley.edu/~cs188/textbook/mdp/markov-decision-processes.html) routes; MIT [6.034 Artificial Intelligence syllabus](https://ocw.mit.edu/courses/6-034-artificial-intelligence-spring-2005/pages/syllabus/); Georgia Tech [CS 6601 Artificial Intelligence](https://omscs.gatech.edu/cs-6601-artificial-intelligence) scope route | [M34 candidate workbook](../../content/authoring/m34_classical_ai_search_constraints_decision_workbook.v1.md): state models, search-condition traces, CSP propagation/ordering, constraints/relaxations, planning limits, one-shot utility/authority separation, and a `Classical AI Search, Constraints & Decision Packet`. | **Aligned and adapted:** state-space search, constraints, and decision reasoning preserve their mathematical conditions while each result carries a human-authority boundary. **Gap:** Atlas does not reproduce CS188/6.034/CS6601 project breadth or full sequential-decision algorithms; one-shot expected utility is not an MDP policy. |
| **M35 — Machine Learning & Representation** | CMU [10-301/601 Introduction to Machine Learning](https://www.cs.cmu.edu/~mgormley/courses/10601/); MIT [6.036 Introduction to Machine Learning](https://ocw.mit.edu/courses/6-036-introduction-to-machine-learning-fall-2020/); Stanford [CS229 materials](https://cs229.stanford.edu/materials.html-full); Georgia Tech [CS 7641 Machine Learning](https://omscs.gatech.edu/cs-7641-machine-learning) | [M35 candidate workbook](../../content/authoring/m35_machine_learning_representation_workbook.v1.md): representation assumptions, shared-information baseline/model-family comparison, a compact model-family boundary map, split/selection/metric/calibration/shift plan, Bernoulli negative-log-likelihood and ridge-shrinkage/selection cards, compact forward/backward trace, debugging/observability matrix, and a responsible-ML dossier. | **Aligned and adapted:** representation, inductive bias, formulation, regularization/model-selection evidence, evaluation, generalization, and decision-making under uncertainty are foregrounded before model celebration. **Gap:** no full training corpus, hands-on breadth survey, RL/unsupervised sequence, or university-scale reports; the linked materials are comparison anchors, not copied assignments or evidence of public access. |
| **M36 — Statistical Learning Theory & Reliable Deep-Learning Systems** | MIT [9.520 Statistical Learning Theory and Applications](https://ocw.mit.edu/courses/9-520-statistical-learning-theory-and-applications-spring-2006/) (lecture notes and assignments); MIT [6.7960 Deep Learning](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/) (readings, notes, videos, homework, and final-project route); CMU [10-301/601 Introduction to Machine Learning](https://www.cs.cmu.edu/~mgormley/courses/10601/); Stanford [CS229 materials](https://cs229.stanford.edu/materials.html-full) and [CS329S Machine Learning Systems Design](https://bulletin.stanford.edu/courses/2230771) scope route | [M36 candidate workbook](../../content/authoring/m36_statistical_learning_theory_reliable_deep_learning_workbook.v1.md): fully specified synthetic population relations, assumption scope, optimization/generalization gap, finite-class proof skeleton with a numeric sample-bound card and fixed-versus-adaptive selection repair, compact fixed-network trace, reproducibility record, contrasting shift/monitoring map, and synthesis-facing reliability dossier. | **Aligned and adapted:** selected uniform-convergence/learning-theory reasoning, model-selection evidence boundaries, autodiff/deep-learning foundations, numerical evidence, monitoring, and human-controlled reliability are connected explicitly. **Gap:** no full graduate proof sequence or deep-learning lab/project; do not claim universal reliability, and keep authoring-only until source, accessibility, teaching-flow, and release review agree. |

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

## Scope Matrix and design-only extension calibration

The learner-facing Scope Matrix maps the attached Levels 1–9 inventory into
Core targets, scoped exposure, post-Core specialization, and explicit deferral.
Its canonical v3 benchmark records the source fingerprint plus a compact
24-heading crosswalk to the non-deferred Matrix rows, so an omitted inventory
heading or unanchored Matrix topic fails validation. This is a coverage index,
not a claim that every target is learner-accessible, released, or mastered.
The four routes below are **design-only**: they calibrate a future 90/180-day
specialization after Core prerequisites and do not schedule, release, or imply
mastery of additional Atlas modules.

| Post-Core route | Official calibration checked | Bounded evidence boundary |
| --- | --- | --- |
| Mathematical, Algorithms & Theory Deepening | MIT [6.854 Advanced Algorithms](https://ocw.mit.edu/courses/6-854j-advanced-algorithms-fall-2005/), MIT [6.045J](https://ocw.mit.edu/courses/6-045j-automata-computability-and-complexity-spring-2011/pages/syllabus/), and Georgia Tech [CS 6515](https://omscs.gatech.edu/cs-6515-intro-graduate-algorithms) | One proof/algorithm/numerical-claim dossier with assumptions, counterexample, and oral defense; not a mathematics or theory degree sequence. |
| Deep Learning & ML Systems | MIT [6.7960 Deep Learning](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/), Stanford [CS329S](https://web.stanford.edu/class/cs329s/), and Georgia Tech [CS 7643](https://omscs.gatech.edu/cs-7643-deep-learning) | One reproducible bounded training/inference dossier; no inferred GPU, distributed-training, or production-reliability capability. |
| Probabilistic Modeling, Sequential Decision-Making & RL | CMU [10-708 Probabilistic Graphical Models](https://www.cs.cmu.edu/~pradeepr/708/), UC Berkeley [CS 285 Deep RL](https://rail.eecs.berkeley.edu/deeprlcourse/index.html), and UC Berkeley [CS 188 MDP route](https://inst.eecs.berkeley.edu/~cs188/textbook/mdp/markov-decision-processes.html) | One bounded inference or decision-model dossier with uncertainty and reward assumptions; not a general policy, control, or safe-RL guarantee. |
| Foundation Models, Generative AI & NLP | MIT [6.S087 Foundation Models and Generative AI](https://ocw.mit.edu/courses/6-s087-foundation-models-and-generative-ai-january-iap-2024/), Stanford [CS224N](https://web.stanford.edu/class/cs224n/), and MIT [6.7960](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/) | One language/model evaluation dossier with provenance, metric, red team, and human override; not LLM-training, alignment, security, or NLP-specialist evidence. |

The book and resource lists in the Levels 1–9 inventory remain reference
families for selecting a targeted repair. They are not copied coursework or a
claim that reading a listed text establishes coverage.

## Honest conclusion

M27–M36 now has an official-source, material-linked calibration pass spanning
MIT, Stanford, UC Berkeley, and Georgia Tech. It supports comparable
intellectual rigor and clearer next-step choices where feasible; it does not
establish university-course equivalence, durable mastery after sixty days, or
permission to publish the authoring-only advanced packs.
