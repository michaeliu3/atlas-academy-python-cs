# Academic calibration

Atlas is calibrated against rigorous open university material so that its
connected route has comparable **intellectual scope and standards of evidence**
where feasible. It is not equivalent to enrollment, faculty feedback, graded
coursework, peer learning, academic credit, or a degree.

All calibration sources were checked on **2026-08-01**. They are used as
link-only comparison anchors: Atlas links to and paraphrases them, but does not
copy assignments, slides, recordings, solutions, or figures without
asset-specific permission review.

| Atlas range | Calibration note | Main comparison anchors |
| --- | --- | --- |
| M1–M18 | [Foundations](research/academic-calibration-foundations.md) | MIT 6.0001, 6.042J, 6.006, 6.046J, 6.102, 6.004, 6.1810; CMU 15-122, 15-213, 15-445; Georgia Tech CS 6515/6200. |
| M19–M26 | [Systems and synthesis](research/academic-calibration-systems-synthesis.md) | MIT 6.1810, 6.172, 6.005; CMU 15-440; Stanford CS144/CS229; Berkeley CS161/CS164; Georgia Tech CS 6200. |
| M27–M36 | [Mathematics and AI](research/academic-calibration-math-ai.md) | MIT 6.042J, 18.06, 18.100B, 18.600, 6.045J, 6.034, 6.036, 9.520, 6.7960; Stanford EE364a/CS149/CS229; Berkeley CS188; Georgia Tech CS 6515/7641. |

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

The three source-backed notes record those decisions and honest boundaries for
every module range. Use them to improve an actual learning gap, not to create
an additional contract or metadata system.

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
| M12–M16 durable software and data | [M13 specification-trace work](../content/modules/13_testing_debugging_specification.md) and [M16 transaction work](../content/modules/16_relational_data_transactions.md) | [MIT 6.102](https://web.mit.edu/6.102/www/sp26/) and [CMU 15-445/645](https://15445.courses.cs.cmu.edu/spring2026/syllabus.html) | **Adapted.** Contract, regression, and transaction evidence are present; full team delivery and storage-engine implementation are outside the core. |
| M17–M24 machine, OS, distributed, and runtime evidence | [M18 resource-mediation workbook](../content/modules/18_operating_systems_resource_mediation.md) and [M24 runtime-evidence dossier](../content/modules/24_cpython_performance_memory.md) | [MIT 6.1810](https://pdos.csail.mit.edu/6.1810/2025/overview.html), [CMU 15-440](https://www.andrew.cmu.edu/course/15-440/), and [Georgia Tech CS 6200](https://omscs.gatech.edu/cs-6200-introduction-operating-systems) | **Adapted.** The materials make resource, partial-failure, and measurement boundaries inspectable; kernel, C/C++, and multi-node labs remain optional depth. |
| M27–M31 mathematical foundations and optimization | [M27 proof dossier](../content/modules/27_discrete_mathematics_proof_counting_structures.md), [M30 inference audit](../content/modules/30_probability_statistics_scientific_inference.md), and [M31 private pack](../content/authoring/m31_optimization_information_workbook.v1.md) | [MIT 6.042J](https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/), [MIT 18.600](https://ocw.mit.edu/courses/18-600-probability-and-random-variables-fall-2019/pages/syllabus/), and [Stanford EE364a](https://web.stanford.edu/class/ee364a/) | **Aligned with explicit boundary.** Proof, uncertainty, and solver assumptions are visible; term-length problem volume and released M31 review remain gaps. |
| M32–M34 systems languages, limits, and classical AI | [M32 private pack](../content/authoring/m32_systems_languages_scientific_python_accelerators_workbook.v1.md), [M33 private pack](../content/authoring/m33_formal_languages_computability_complexity_workbook.v1.md), and [M34 private pack](../content/authoring/m34_classical_ai_search_constraints_decision_workbook.v1.md) | [Stanford CS149](https://cs149.stanford.edu/), [MIT 6.045J](https://ocw.mit.edu/courses/6-045j-automata-computability-and-complexity-spring-2011/pages/syllabus/), and [Berkeley CS188](https://inst.eecs.berkeley.edu/~cs188/) | **Private-study ready, release review pending.** The drafts supply bounded evidence work; GPU, theorem, and solver claims remain explicitly conditional. |
| M35–M36 learning and reliability | [M35 private pack](../content/authoring/m35_machine_learning_representation_workbook.v1.md) and [M36 private pack](../content/authoring/m36_statistical_learning_theory_reliable_deep_learning_workbook.v1.md) | [Stanford CS229](https://cs229.stanford.edu/), [MIT 9.520](https://ocw.mit.edu/courses/9-520-statistical-learning-theory-and-applications-spring-2006/), and [Georgia Tech CS 7641](https://omscs.gatech.edu/cs-7641-machine-learning) | **Adapted.** Evaluation, leakage, shift, and human-control evidence are foregrounded; sustained model-training/report feedback and reader release remain gaps. |
