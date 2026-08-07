# Module 0 diagnostic — research and design boundary

**Reviewed:** 2026-07-30  
**Purpose:** support a short, low-stakes placement conversation for one learner
inside the connected Atlas Academy curriculum.

## What this diagnostic is

The Module 0 diagnostic is a **formative routing instrument**. It samples
important mental models, records confidence, identifies the misconception
represented by a selected distractor, and points to the earliest published
course section that can repair or stabilize that model.

It is not:

- a standardized test;
- a psychometrically validated concept inventory;
- an exam grade;
- proof that a module can be skipped;
- a measure of intelligence or programming potential.

A correct multiple-choice response is only one signal. High-confidence correct
responses still receive a later transfer check; low-confidence correct
responses receive explanation or retrieval; high-confidence incorrect
responses receive priority counterexamples and delayed isomorphic retrieval.

## Scope map for the 20-probe intake (v2)

The diagnostic uses one deliberately chosen primary probe for each requested
foundation, plus connected Python/CS probes that distinguish nearby
misconceptions. Every learner-facing repair link below resolves to a published
module. The last column is a release boundary, not an invitation to bypass it.

| Foundation | Primary probe | Published bridge | Advanced-release boundary |
| --- | --- | --- | --- |
| Python | `python-state-aliasing` | M1 values, state, and execution | None; later Python probes remain connected evidence, not a waiver. |
| Algorithms/data structures | `cost-hidden-membership` | M5 cost models | None; representation and graph questions retain their academic prerequisites. |
| Systems | `memory-locality-cache-lines` | M17 memory hierarchy and locality | None; M18–M24 remain their own published, prerequisite-aware systems branch. |
| Discrete mathematics | `quantifier-scope-countermodel` | M27 logic and countermodels | None; recursive proof questions offer an earlier related signal. |
| Linear algebra | `linear-algebra-basis-coordinates` | M28 vectors, coordinates, and rank | None; a correct coordinate trace does not establish numerical-stability mastery. |
| Calculus | `calculus-gradient-local-change` | M29 derivatives and local approximation | M31 is authoring-only; no M31 route is emitted. |
| Probability | `probability-conditional-evidence` | M30 probability models | None; a Bayes trace is not broad inference mastery. |
| Optimization | `optimization-feasible-descent` | M29 constrained extrema | M31 is authoring-only; the bridge names it as unavailable and begins in published mathematics. |
| AI/ML | `ml-evaluation-leakage` | M30 design, criticism, and robustness | M35 is authoring-only; the bridge names it as unavailable and begins in published inference. |

This mapping is a curriculum-design decision, not evidence that the 20 items
form a validated concept inventory. Its item-level definitions, derivations,
counterexamples, and published repair context are in the named Atlas modules;
their source ledgers carry the subject-matter citations and reuse boundaries.

## Subject-matter probe ledger (v2 additions)

The following rows make the seven subject-matter additions independently
auditable. The questions, feedback, diagrams, and examples remain original
Atlas material; each external source is linked as a teaching/reference source,
not copied into the portal. **Ledger review date:** 2026-07-30. The access date
is the originating module source map's research snapshot, rather than a claim
that this ledger freshly re-accessed every external asset.

| Probe ID | Claim linkage and local evidence | Stable teaching source | Accessed | License / reuse decision | Claim boundary |
| --- | --- | --- | --- | --- | --- |
| `memory-locality-cache-lines` | M17 source map §3.2, cache unit 14; M17 locality/cost session material. Checks the reasoning that address-order traversal can reuse fetched cache lines. | [MIT 6.004, Caches and the Memory Hierarchy](https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/pages/c14/) | 2026-07-29 | Link and attribute; use original Atlas trace/question wording. Do not copy slides, media, or substantial course assets without an asset-level license review. | A locality hypothesis, not cache-miss counts, wall-clock speed, or behavior on a particular CPU, runtime, or workload. |
| `quantifier-scope-countermodel` | M27 source map §S05 and six-session route, Session 1. Checks that quantifier order changes witness dependency and that a finite countermodel can refute a universal claim. | [Open Logic Project, *Sets, Logic, Computation*](https://slc.openlogicproject.org/) · [license](https://openlogicproject.org/olp-license/) | 2026-07-30 | Website content is CC BY 4.0 unless noted; attribute and indicate changes if reused. Atlas uses original wording/examples and links to, but does not copy, GPLv3 proof-checker code. | Not evidence that an English requirement was formalized correctly or that a program satisfies the formal statement. |
| `linear-algebra-basis-coordinates` | M28 source map §S02 and six-session route, Session 1. Checks the definition-level distinction between a vector and coordinates relative to a declared basis. | [Axler, *Linear Algebra Done Right*, fourth edition](https://linear.axler.net/LADR4e.pdf) | 2026-07-30 | The displayed PDF states CC BY-NC 4.0; default to link-only/original prose, diagrams, and questions. Do not import exercises or figures without specific reuse review. | Not numerical-stability evidence, an embedding semantics claim, or ML-performance evidence. |
| `calculus-gradient-local-change` | M29 source map §S01 and six-session route, Session 2. Checks derivative as a local linear approximation and the exact quadratic-remainder calculation. | [MIT 18.01SC, Single Variable Calculus](https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/) | 2026-07-30 | MIT OCW CC BY-NC-SA 4.0 baseline, subject to asset notices; link/cite and write original fixtures/questions. Do not copy exercises, exams, solutions, or figures. | A derivative at one point is not a global monotonicity or finite-step guarantee. |
| `optimization-feasible-descent` | M29 source map §S02 and six-session route, Session 6. Checks that a proposed descent point must satisfy the declared feasible set before its objective value is compared. | [MIT 18.02SC, Partial Derivatives](https://ocw.mit.edu/courses/18-02sc-multivariable-calculus-fall-2010/pages/2.-partial-derivatives/) | 2026-07-30 | Same MIT OCW link-only/original-material decision as above; the Atlas constraint example is original. | Not a convergence, KKT, global-optimality, or authoring-only M31 readiness claim. |
| `probability-conditional-evidence` | M30 source map §S01 and six-session route, Session 1. Checks Bayes' denominator as the marginal probability of the observed positive under the declared model. | [MIT 18.600, Probability and Random Variables lecture notes](https://ocw.mit.edu/courses/18-600-probability-and-random-variables-fall-2019/pages/lecture-notes/) | 2026-07-30 | MIT OCW CC BY-NC-SA 4.0 baseline subject to asset notices; link/cite and create original explanations/visuals. | Not real clinical validity, posterior truth, independence, or a decision rule. |
| `ml-evaluation-leakage` | M30 source map Session 6 and forward handoff; M30 source-audit addendum §S08 and sessions 5–6. Checks the need to declare deployment target, dependence, split, and leakage boundary before trusting a metric. | [NIST experimental-design overview](https://itl.nist.gov/div898/handbook/pri/section1/pri11.htm) · [NIST model/data-quality first steps](https://itl.nist.gov/div898/handbook/ppc/section4/ppc41.htm) | 2026-07-30 | Attribute NIST and inspect exact assets for notices. Atlas uses original prose/diagrams and does not imply NIST endorsement. | Not a quantified optimism estimate, proof of poor deployment performance, or replacement for later M35 evaluation material. |

Every row is linked to a published repair module. The diagnostic does not link
to, unlock, or simulate the authoring-only advanced modules.

## Evidence-to-design map

| Research or teaching claim | Design consequence |
|---|---|
| Prior-knowledge assessment can expose gaps and misconceptions and help connect previous knowledge to new material. | Administer the diagnostic before choosing the personalized entry route; route every flagged response into the dependency graph. |
| Computing concept inventories use deliberately developed distractors to reveal particular misconceptions. | Give every incorrect option its own misconception tag and explanation; do not attach one generic explanation to an entire question. |
| A validated assessment requires deliberate concept selection, misconception discovery, item development, and validation evidence. | Describe this course-specific tool as a formative placement studio, not a validated standardized inventory. Preserve results as hypotheses for an instructor interview. |
| Low-stakes retrieval improves retention when it is followed by corrective and preferably explanatory feedback. | Require commitment before showing answers; provide the correct model, explain the selected distractor, and add a small transfer prompt after completion. |
| Multiple-choice questions can quickly test higher-order reasoning when they use plausible parallel distractors and focus on one concept. | Use short code traces, contract reviews, algorithm-assumption decisions, and failure classifications rather than syntax trivia. |
| Confidence judgments can be informative, but repeatedly requesting confidence alone does not necessarily teach accurate self-monitoring. | Define confidence behaviorally (“guessed,” “partly reasoned,” “can explain and reject alternatives”), separate correctness from confidence, and turn each quadrant into a concrete learning action. |
| Formative assessment should create actionable feedback for both learner and instructor. | Produce a copyable learning brief containing response, confidence, misconception signal, and ordered repair route; never reduce the result to one weighted score. |

## Authoritative and primary sources

1. Cornell Center for Teaching Innovation,
   [Assessing Prior Knowledge & Addressing Learning Gaps](https://teaching.cornell.edu/teaching-resources/assessment-evaluation/assessing-prior-knowledge-addressing-learning-gaps).
   Recommends short, ungraded pre-assessments using common misconceptions to
   identify prior knowledge and guide support.
2. Caceffo, Wolfman, Booth, and Azevedo,
   [Developing a Computer Science Concept Inventory for Introductory Programming](https://doi.org/10.1145/2839509.2844559),
   SIGCSE 2016. Develops distractors from observed student misunderstandings
   and discusses the validation burden for computing concept inventories.
3. Tew and Guzdial,
   [The FCS1: A Language Independent Assessment of CS1 Knowledge](https://people.cs.vt.edu/~kafura/CS6604/Papers/FCS1-Assessment-CS1-Knowledge.pdf).
   Provides a useful comparison point for disciplined assessment development;
   Atlas does not claim equivalent validation.
4. Ali et al.,
   [Taking Stock of Concept Inventories in Computing Education](https://icer2023.acm.org/details/icer-2023-papers/29/Taking-Stock-of-Concept-Inventories-in-Computing-Education-A-Systematic-Literature-R),
   ICER 2023. Reviews 65 computing-education papers and distinguishes existing
   inventories from the smaller subset with validation evidence.
5. MIT Teaching + Learning Lab,
   [Help Students Retain, Organize and Integrate Knowledge](https://tll.mit.edu/teaching-resources/how-to-teach/help-students-retain-organize-and-integrate-knowledge/).
   Connects low-stakes retrieval, misconception discovery, and elaborated
   corrective feedback.
6. Carnegie Mellon Eberly Center,
   [Retrieval Practice for Improved Learning](https://www.cmu.edu/teaching/resources/instructionalstrategies/activelearningstrategies/retrievalpractice/index.html).
   Summarizes evidence for retrieval practice and emphasizes matching the form
   of retrieval to the intended learning outcome.
7. Cornell Center for Teaching Innovation,
   [Polling Tips](https://teaching.cornell.edu/learning-technologies/assessment-tools/classroom-polling/polling-tips).
   Recommends concise questions, misconception-oriented polling, and complete
   explanations for correct and incorrect choices.
8. MIT OpenCourseWare,
   [Tips for Assessment Construction](https://ocw.mit.edu/courses/res-7-005-biology-teaching-assistant-ta-training-fall-2021/session-7_tips-for-assessment-construction.pdf).
   Gives construction guidance for plausible, parallel multiple-choice
   distractors focused on one concept.
9. Carnegie Mellon Eberly Center,
   [Formative vs. Summative Assessment](https://www.cmu.edu/teaching/assessment/basics/formative-summative.html).
   Defines formative assessment as low-stakes evidence used to improve both
   learning and instruction.

## Course-specific inference policy

The diagnostic samples a wide dependency graph with a small number of items.
Therefore:

1. one response may flag a route, but it cannot establish mastery of a module;
2. an incorrect answer routes to the earliest relevant prerequisite, not to a
   disconnected topic list;
3. a correct answer with weak confidence triggers explanation or an isomorphic
   retrieval item;
4. a correct high-confidence answer triggers a transfer interview before any
   compression decision;
5. results remain on the learner’s device unless the learner explicitly copies
   the learning brief into an Instructor or TA conversation.

## Revision loop

After each real administration, preserve only pedagogically useful evidence:

- which distractors were selected;
- how the learner explained the choice;
- whether the confidence label matched the explanation;
- whether the routed section repaired the model;
- whether an isomorphic later prompt transferred.

Revise distractors from observed reasoning, not from a desire to make questions
harder. Any future claim of reliability or validity requires a separate,
appropriately designed study.
