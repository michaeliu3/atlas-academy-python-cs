# Academic calibration — M1–M5 source review

## Scope, method, and truth boundary

This is a targeted source-and-material review of the first five Atlas
workbooks. It compares their stated outcomes, artifacts, and instructional
sequence with official university course pages and materials accessed on
**2026-08-01**. It is not a claim of enrollment, faculty feedback, contact
hours, assessment equivalence, credit, a degree, or durable mastery.

The reviewed Atlas material is [M1: Values, State, and Execution](../../content/modules/01_values_state_execution.md),
[M2: Functions, Recursion, and Induction](../../content/modules/02_functions_recursion_induction.md),
[M3: Abstraction, Interfaces, and ADTs](../../content/modules/03_abstraction_interfaces_adts.md),
[M4: Logic, Sets, Relations, Graphs, and Proof](../../content/modules/04_logic_sets_relations_graphs_proof.md),
and [M5: Cost Models and Algorithm Analysis](../../content/modules/05_cost_models_algorithm_analysis.md),
plus the existing [curriculum source map](../../content/source-maps/python_curriculum_sources.md)
and [foundations calibration](academic-calibration-foundations.md). The M1–M5
workbooks already carry their own learner-facing source sections; this note
does not alter them or copy outside exercises, notes, figures, or solutions.

## Material-level calibration

| Atlas module | Official material checked | Alignment, adaptation, and boundary |
| --- | --- | --- |
| **M1 — execution and state** | MIT [6.100L's calendar](https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/pages/calendar/) explicitly sequences Python objects/types/variables/bindings, environments/scope, mutation/aliasing, debugging, and assertions. CMU [15-122 learning objectives](https://www.cs.cmu.edu/~15122/syllabus.shtml) require tracing small imperative programs and using contracts, invariants, and tests to reason about safety and correctness. UC Berkeley [CS 61A Discussion 1](https://cs61a.org/disc/disc01/disc01.pdf) explicitly asks learners to describe a process and test it on examples before treating it as code. | Atlas's object/binding traces, aliasing prediction, mutation contracts, and regression-test artifact are a close conceptual fit. It deliberately adapts C0/C-style imperative reasoning to Python objects and shifts most evidence toward code reading, prediction, and explanation. It does not supply CMU's C/C0, Unix, or institutional problem volume. |
| **M2 — functions, recursion, and induction** | MIT [6.042J](https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/pages/syllabus/) lists induction, well-founded ordering, and termination/correctness reasoning among its outcomes. Stanford [CS106B](https://web.stanford.edu/class/cs106b/index.html) names recursion, algorithm analysis, and data abstraction as connected programming-abstraction topics; Berkeley's [CS 61A recursion discussion](https://cs61a.org/disc/disc03/disc03.pdf) supplies a current base-case/decomposition practice route. | Atlas connects a call-frame trace to a termination measure, induction hypothesis, recurrence, and debugging case. That is a sound dependency order. The language and evaluation style differ from Stanford and Berkeley, and the six-session module cannot stand in for their repeated problem practice. |
| **M3 — ADTs and interfaces** | MIT [6.102 Abstract Data Types](https://web.mit.edu/6.102/www/sp26/classes/06-abstract-data-types/) explicitly introduces ADTs and representation independence. Its [abstraction-functions and representation-invariants reading](https://web.mit.edu/6.102/www/sp26/classes/07-abstraction-functions-rep-invariants/) defines AF and RI and treats representation exposure as a design concern. CMU 15-122 also expects learners to distinguish specification from implementation and defend interfaces and abstractions. | Atlas's EventStore contract, AF/RI trace, representation-exposure debugging, and behavioral patch review align with those central ideas. The deliberate adaptation is Python protocols and runtime limits rather than TypeScript or C interfaces. Static checking, API syntax, and test tools remain implementation-specific rather than proof substitutes. |
| **M4 — logic, sets, relations, graphs, and proof** | MIT 6.042J's outcomes include logical notation, sets, relations, induction, graph models, countering fallacious reasoning, and well-founded correctness/termination arguments. MIT [6.006](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/pages/syllabus/) lists this discrete-mathematics knowledge as a prerequisite for algorithm study. | Atlas correctly uses quantified contracts, counterexamples, relations, graph models, and a proof-versus-test distinction as the bridge from software claims to algorithm reasoning. Counting and probability appear as foundations only; deeper discrete mathematics is explicitly revisited in M27. One accelerated module cannot match a full discrete-mathematics term's proof volume. |
| **M5 — cost models and analysis** | MIT 6.006 describes mathematical modeling, algorithms/data structures, and performance measures/analysis techniques. CMU 15-122 expects Big-O analysis, asymptotic classes, amortized analysis, practical-efficiency experiments, and applying those analyses to new programs. Georgia Tech [CS 6515](https://omscs.gatech.edu/cs-6515-intro-graduate-algorithms) treats recurrence solving, asymptotic analysis, discrete mathematics, and undergraduate algorithm design as prerequisites for later graduate work. | Atlas's input model, counted operation, case analysis, recurrence, amortized argument, and measurement-reconciliation workflow aligns well with the undergraduate foundation that later algorithms assumes. Its explicit warning that measurements are not proofs is an appropriate AI-era adaptation. It does not claim the breadth or proof/problem-set depth of 6.006 or the graduate content of CS 6515. |

## Cross-module finding

The dependency chain is coherent: M1's execution/state model supports M2's
frame traces; M2's contracts and induction become M3's abstraction reasoning;
M4 supplies the formal language for those contracts; M5 turns the same modeled
operations into resource claims. This is also consistent with MIT 6.006's
published prerequisite order: Python experience plus discrete mathematics
before algorithm analysis. [MIT 6.006 syllabus](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/pages/syllabus/)

The distinctive Atlas adaptation—prediction before reveal, unfamiliar-code
reading, counterexample construction, small evidence artifacts, and supportive
oral defense—is visible in each reviewed workbook. It should remain an
adaptation, not be presented as the cited institutions' assessment model.

## Recommended next revision priority

**P1 — make the existing sources mechanically session-addressable before
adding theory.** Add a small Arc-I/M1–M5 source ledger or derive one from the
canonical contract so that every core session points to one official source,
one Atlas artifact, and one explicit `aligned`, `adapted`, or `deferred` note.
This preserves the current connected sequence while making its evidence easier
to audit.

**P2 — protect the proof-to-cost bridge.** At the M4→M5 handoff, retain one
completed quantified proof or counterexample and one cost argument with an
input model, operation count, and measurement limitation. MIT 6.042J makes
rigorous conclusions and proof construction core outcomes, while CMU 15-122
pairs correctness reasoning with practical-efficiency experiments; a quiz
selection alone is not sufficient evidence. [MIT 6.042J syllabus](https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/pages/syllabus/)
[CMU 15-122 syllabus](https://www.cs.cmu.edu/~15122/syllabus.shtml)

**P3 — keep advanced extensions visibly optional.** Use Stanford CS106B and
Georgia Tech CS 6515 as scope and prerequisite anchors for recursion/data
abstraction/analysis extensions, not as material to compress into M1–M5.
Their different languages, support structures, and depth are reasons to link
to a bounded next step rather than imply equivalence. [Stanford CS106B](https://web.stanford.edu/class/cs106b/index.html)
[Georgia Tech CS 6515](https://omscs.gatech.edu/cs-6515-intro-graduate-algorithms)

## Reuse and integrity note

The external pages above are calibration and learner-link sources. Atlas should
continue to write original explanations, diagrams, prompts, diagnostics, and
artifacts; link to a university exercise only when its local license and
academic-integrity terms have been checked.
