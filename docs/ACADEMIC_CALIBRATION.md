# Academic calibration

Atlas is calibrated against rigorous open university material so that its
connected route has comparable **intellectual scope and standards of evidence**
where feasible. It is not equivalent to enrollment, faculty feedback, graded
coursework, peer learning, academic credit, or a degree.

The baseline calibration corpus was checked on **2026-08-01**. Targeted
follow-up notes record their own later access dates. Sources are used as
link-only comparison anchors: Atlas links to and paraphrases them, but does not
copy assignments, slides, recordings, solutions, or figures without
asset-specific permission review.

| Atlas range | Calibration note | Main comparison anchors |
| --- | --- | --- |
| M1–M18 | [Foundations](research/academic-calibration-foundations.md) | MIT 6.0001, 6.042J, 6.006, 6.046J, 6.102, 6.004, 6.1810; CMU 15-122, 15-213, 15-445; Georgia Tech CS 6515/6200. |
| M19–M26 | [Systems and synthesis](research/academic-calibration-systems-synthesis.md) | MIT 6.1810, 6.172, 6.005; CMU 15-440; Stanford CS144/CS229; Berkeley CS161/CS164; Georgia Tech CS 6200. |
| M27–M36 | [Mathematics and AI](research/academic-calibration-math-ai.md) | MIT 6.042J, 18.06, 18.100B, 18.600, 6.7220, 6.045J, 6.034, 6.036, 9.520, 6.7960; CMU 15-213/15-451/10-301; Stanford EE364a/CS149/CS229; Berkeley CS188; Georgia Tech CS 6515/6601/7641. |

## Targeted review evidence

The range notes establish the overall comparison standard. These focused
reviews record a concrete material audit and its resulting action; they do not
claim institutional equivalence.

| Review | Scope | Resulting action |
| --- | --- | --- |
| [M1–M5 foundations review](research/academic-calibration-m1-m5-source-review.md), [official learner-route recheck](research/m1-m5-official-source-review-2026-08-01.md), and [proof/asymptotics follow-up](research/m4-m5-proof-asymptotics-calibration-2026-08-03.md) | State, recursion/induction, ADTs, proof, and cost models against official MIT and CMU anchors. | **Aligned/adapted.** The direct arbitrary-instance proof and instantiated `Θ` bound now make the proof-to-cost bridge explicit; concise learner-facing source cards retain what practice scale remains deferred. |
| [M6–M10 data-structures review](research/academic-calibration-m6-m10-source-review.md) and [official learner-route recheck](research/m6-m10-official-source-review-2026-08-01.md) | Representation, restricted interfaces, hashing, ordered structures, and graph algorithms against official MIT, CMU, Stanford, Georgia Tech, and Berkeley anchors. | **Aligned/adapted.** Retain the open-addressing deletion prediction/repair trace; defer broader tree families, flow, routing, and institutional-scale implementation volume. |
| [M11–M16 algorithms-and-durable-systems review](research/academic-calibration-m11-m16-source-review.md) and [M6–M11 follow-up](research/m6-m11-official-calibration-followup-2026-08-03.md) | Algorithm design, interfaces, specifications, change, delivery, and transactions against official MIT, CMU, Stanford, Georgia Tech, and Berkeley anchors. | Preserve the M11 scope handoff and reuse one visible evidence thread across M12–M15; M11 now states the ideal probability model before its reservoir-sampling induction and carries a compact M6→M10 five-handoff architecture-reading dossier. |
| [M17–M20 architecture-to-protocol review](research/academic-calibration-m17-m20-source-review.md) and [official learner-route recheck](research/m17-m20-official-source-review-2026-08-01.md) | Execution, OS mediation, concurrency, and application protocols against official MIT, CMU, Stanford, Georgia Tech, and Berkeley anchors. | **Aligned/adapted.** Preserve the connected representation → mediation → concurrency → protocol chain and its explicit boundaries; defer kernel/C/C++, lock-free/GPU/MPI, routing/BGP/SDN, and full production-network depth. |
| [M21–M24 distributed-to-runtime review](research/academic-calibration-m21-m24-source-review.md) | Distributed coordination, trust, bounded evaluation, and runtime evidence against official MIT, CMU, Stanford, Georgia Tech, Berkeley, and Python anchors. | Keep the scope boundaries; offer one optional local M24 measurement receipt rather than adding a second tracking system. |
| [M25–M26 synthesis-preview review](research/academic-calibration-m25-m26-synthesis-review.md) and [2026-08-03 primary-source follow-up](research/m25-m26-primary-source-calibration-followup-2026-08-03.md) | Advanced evidence integration, human-centered AI, system stewardship, and architecture defense against official MIT, CMU, Stanford, Georgia Tech, and Berkeley anchors. | Keep the previews gated, align M35/M36 receipt names with the candidate packs, preserve the active v2 graph as the sole route truth, and require an active-project/documented-need check for M26's optional external stewardship track. |
| [M27 discrete-mathematics review](../content/source-maps/module27_discrete_mathematics_official_course_calibration_2026-08-01.md) | Logic, proof, counting, recurrence, graph, poset, asymptotic, and number-theory progression against official MIT, CMU, Stanford, Georgia Tech, and Berkeley anchors. | Correct the source-map and audit routing so sessions 3–6 match the published workbook sequence. |
| [M28–M30 mathematical-core review](research/academic-calibration-m28-m30-source-review.md) | Linear algebra/stability, proof-aware calculus/analysis, and probability/statistics/inference against official MIT, CMU, Stanford, Georgia Tech, and Berkeley anchors. | Keep the connected core and use named numerical-analysis, real-analysis/ODE/PDE, and advanced-statistics boundaries for later depth. |
| [M31–M36 authoring-only review](research/academic-calibration-m31-m36-source-review.md), followed by the current [M31–M32](research/m31-m32-official-calibration-2026-08-01.md), [M33–M34](research/m33-m34-official-calibration-2026-08-01.md), [M35–M36](research/m35-m36-official-calibration-2026-08-01.md), [M33–M34 follow-up](research/m33-m34-official-calibration-2026-08-03.md), [M35–M36 follow-up](research/m35-m36-official-calibration-2026-08-03.md), and independent [M31–M32](research/m31-m32-independent-official-calibration-2026-08-01.md) / [M33–M36](research/m33-m36-independent-primary-calibration-2026-08-01.md) checks | Optimization through reliable-learning systems against official MIT, CMU, Stanford, Georgia Tech, Berkeley, and relevant platform owners. | Keep every pack hidden/authoring-only. The current pass found no additional theory expansion worth adding; it refreshed M33's Stanford CS103 link, bounded M34's goal-test claim, and made M35's sampling-unit/stable-loss reasoning explicit while preserving the remaining learner-delivery, rendered-review, and release evidence gaps. |
| [M31–M32 focused candidate review](research/m31-m32-focused-candidate-review.md) | Optimization/information and scientific Python/accelerators against MIT, Stanford, CMU, and NumPy primary material. | Add a theorem-versus-trace bridge to M31 and an explicit fair-comparison row to M32; preserve authoring-only status. |
| [M31 source recheck](research/m31-source-recheck-2026-08-01.md) | A focused source/reuse recheck against MIT 6.251J, Stanford EE364a, and MIT 6.441 before a possible M31 review candidate. | Retain the existing original-material and link-only boundaries; no workbook correction or release claim follows from the recheck. |
| [M33–M34 focused candidate review](research/m33-m34-focused-candidate-review.md) | Formal-language limits and classical AI search/decision against MIT, Stanford, CMU, Georgia Tech, and Berkeley anchors. | Make the diagonal encoding explicit; distinguish search completeness from optimality; and separate model-false, unknown, and unmodelled planning facts; preserve authoring-only status. |
| [M35–M36 focused candidate review](research/m35-m36-focused-candidate-review.md) | ML evaluation and reliable-learning reasoning against MIT, CMU, Stanford, Georgia Tech, and Berkeley anchors. | Make group/time splitting, theorem notation, and delayed-label monitoring explicit; preserve authoring-only status. |
| [M31/M36 math audit](research/m31-m36-math-proof-audit.md) and [M33 formal audit](research/m33-formal-proof-audit.md) | Displayed optimization, learning-theory, and reduction claims in the hidden advanced workbooks. | Correct the M36 calibration-domain qualifier and the M33 well-formed-instance reduction scope; retain authoring-only status. |

## What calibration means in Atlas

For each major authoring or revision batch, compare the Atlas module with a
small relevant set of official sources:

1. **Prerequisite and scope:** Does the module enter at the right point in the
   connected route, and does it name what it does not cover?
2. **Depth:** Are definitions, assumptions, derivations or proof ideas,
   counterexamples, and numerical/empirical boundaries present where relevant?
3. **Practice:** Does the work include code/design reading, prediction,
   debugging, transfer, and a compact dossier rather than mere recall?
4. **Adaptation:** Does the AI-era workflow improve inspection and judgment
   without treating generated code or fluent explanation as evidence?
5. **Gap decision:** Mark the topic as aligned, intentionally adapted, or an
   explicit future extension; do not hide a gap behind a prestigious citation.

The range and targeted source-backed notes record those decisions and honest
boundaries for every module range. Use them to improve an actual learning gap,
not to create an additional contract or metadata system.

## Material-level review sample — this authoring pass

The notes above establish **scope calibration**. This smaller table records the
actual learner material sampled during this pass; it is not a claim that every
exercise, project, or feedback loop reproduces an institutional course. Each
sample links one concrete Atlas artifact to a relevant official comparison and
leaves the next real gap visible.

| Connected arc | Atlas material sampled | Official comparison anchor | Decision and next content move |
| --- | --- | --- | --- |
| M1–M5 computation, proof, and cost | [M4 understanding check](../content/modules/04_logic_sets_relations_graphs_proof.md) and [M5 cost-model derivation](../content/modules/05_cost_models_algorithm_analysis.md) | [MIT 6.042J](https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/) and [Georgia Tech CS 6515](https://omscs.gatech.edu/cs-6515-intro-graduate-algorithms) | **Adapted.** The artifacts require quantified claims, counterexamples, recurrences, and cost assumptions; optional university-scale proof/problem volume remains a gap. |
| M6–M11 structures and algorithms | [M9 ordered-structure dossier](../content/modules/09_trees_heaps_sorting_ordered.md) and [M11 strategy selection](../content/modules/11_algorithm_design_paradigms.md) | [MIT 6.006](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/pages/syllabus/) and [Georgia Tech CS 6515](https://omscs.gatech.edu/cs-6515-intro-graduate-algorithms) | **Aligned and adapted.** Invariant recovery and code reading are stronger than pattern recall; M11 now requires a prediction before its exhaustive-search and reconstruction answers. Max-flow and university-scale proof sets remain extensions. |
| M12–M16 durable software and data | [M13 specification-trace work](../content/modules/13_specifications_testing_debugging_observability.md) and [M16 transaction work](../content/modules/16_relational_data_transactions.md) | [MIT 6.102](https://web.mit.edu/6.102/www/sp26/) and [CMU 15-445/645](https://15445.courses.cs.cmu.edu/spring2026/syllabus.html) | **Adapted.** Contract, regression, and transaction evidence are present; full team delivery and storage-engine implementation are outside the core. |
| M17–M24 machine, OS, distributed, and runtime evidence | [M18 resource-mediation workbook](../content/modules/18_operating_systems_resource_mediation.md) and [M24 runtime-evidence dossier](../content/modules/24_cpython_performance_memory.md) | [MIT 6.1810](https://pdos.csail.mit.edu/6.1810/2025/overview.html), [CMU 15-440](https://www.andrew.cmu.edu/course/15-440/), and [Georgia Tech CS 6200](https://omscs.gatech.edu/cs-6200-introduction-operating-systems) | **Adapted.** The materials make resource, partial-failure, and measurement boundaries inspectable; kernel, C/C++, and multi-node labs remain optional depth. |
| M27–M31 mathematical foundations and optimization | [M27 proof dossier](../content/modules/27_discrete_mathematics_proof_counting_structures.md), [M30 inference audit](../content/modules/30_probability_statistics_scientific_inference.md), and [M31 private pack](../content/authoring/m31_optimization_information_workbook.v1.md) | [MIT 6.042J](https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/), [MIT 18.600](https://ocw.mit.edu/courses/18-600-probability-and-random-variables-fall-2019/pages/syllabus/), and [Stanford EE364a](https://web.stanford.edu/class/ee364a/) | **Aligned with explicit boundary.** Proof, uncertainty, and solver assumptions are visible; term-length problem volume and released M31 review remain gaps. |
| M32–M34 systems languages, limits, and classical AI | [M32 private pack](../content/authoring/m32_systems_languages_scientific_python_accelerators_workbook.v1.md), [M33 private pack](../content/authoring/m33_formal_languages_computability_complexity_workbook.v1.md), and [M34 private pack](../content/authoring/m34_classical_ai_search_constraints_decision_workbook.v1.md) | [CMU 15-213](https://www.cs.cmu.edu/~213/), [Stanford CS149](https://cs149.stanford.edu/), [MIT 6.045J](https://ocw.mit.edu/courses/6-045j-automata-computability-and-complexity-spring-2011/pages/syllabus/), [Stanford CS103 (Spring 2026)](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/), and [Berkeley CS188](https://inst.eecs.berkeley.edu/~cs188/textbook/) | **Authoring-only instructor-led drafts; review and release evidence pending.** The drafts supply bounded layout, formal-model, search, and solver evidence work; GPU, theorem, and solver claims remain explicitly conditional. |
| M35–M36 learning and reliability | [M35 private pack](../content/authoring/m35_machine_learning_representation_workbook.v1.md) and [M36 private pack](../content/authoring/m36_statistical_learning_theory_reliable_deep_learning_workbook.v1.md) | [CMU 10-301/601](https://www.cs.cmu.edu/~mgormley/courses/10601/), [MIT 6.036](https://ocw.mit.edu/courses/6-036-introduction-to-machine-learning-fall-2020/), [Stanford CS229](https://cs229.stanford.edu/materials.html-full), [MIT 9.520](https://ocw.mit.edu/courses/9-520-statistical-learning-theory-and-applications-spring-2006/), and [Georgia Tech CS 7641](https://omscs.gatech.edu/cs-7641-machine-learning) | **Adapted.** Evaluation, leakage, selection, shift, theorem scope, and human-control evidence are foregrounded; sustained model-training/report feedback and reader release remain gaps. |
