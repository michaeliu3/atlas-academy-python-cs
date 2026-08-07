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
| **M1 — execution and state** | MIT [6.100L's calendar](https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/pages/calendar/) sequences Python objects/types/variables/bindings, environments/scope, mutation/aliasing, debugging, and assertions. CMU [15-122 learning objectives](https://www.cs.cmu.edu/~15122/syllabus.shtml) require tracing small imperative programs and using contracts, invariants, and tests to reason about safety and correctness. The [Python 3.14 execution model](https://docs.python.org/3.14/reference/executionmodel.html) is the behavior authority for Atlas's frames, binding, lookup, and `nonlocal` claims. | Atlas's object/binding traces, aliasing prediction, mutation contracts, and regression-test artifact are a close conceptual fit. Its Session-2 lexical-scope prediction now gives the stated scope outcome direct learner evidence. It deliberately adapts C0/C-style imperative reasoning to Python objects and does not supply CMU's C/C0, Unix, or institutional problem volume. |
| **M2 — functions, recursion, and induction** | MIT [6.042J](https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/pages/syllabus/) lists induction, well-founded ordering, and termination/correctness reasoning among its outcomes. Stanford [CS106B's official schedule](https://web.stanford.edu/class/cs106b/schedule.html) connects recursion, abstraction, and algorithm analysis; Berkeley's [CS 61A recursion discussion](https://cs61a.org/disc/disc03/disc03.pdf) supplies a current base-case/decomposition practice route. The [Python recursion-limit documentation](https://docs.python.org/3.14/library/sys.html#sys.getrecursionlimit) is the runtime authority for the implementation boundary. | Atlas connects a call-frame trace to a termination measure, induction hypothesis, recurrence, and debugging case. Its lexicographic-measure transfer confirms that the termination model is not tree-only. The language and evaluation style differ from Stanford and Berkeley, and the six-session module cannot stand in for their repeated problem practice. |
| **M3 — ADTs and interfaces** | MIT [6.102 Abstract Data Types](https://web.mit.edu/6.102/www/sp26/classes/06-abstract-data-types/) explicitly introduces ADTs and representation independence. Its [abstraction-functions and representation-invariants reading](https://web.mit.edu/6.102/www/sp26/classes/07-abstraction-functions-rep-invariants/) defines AF and RI and treats representation exposure as a design concern. CMU 15-122 also expects learners to distinguish specification from implementation and defend interfaces and abstractions. The [Python `Protocol` reference](https://docs.python.org/3.14/library/typing.html#typing.Protocol) is the behavior authority for the structural-typing boundary. | Atlas's EventStore contract, AF/RI trace, representation-exposure debugging, and behavioral patch review align with those central ideas. The required right-shape/wrong-law `ReversingStore` trace now makes the central limitation of structural typing learner-visible. The deliberate adaptation is Python protocols and runtime limits rather than TypeScript or C interfaces. |
| **M4 — logic, sets, relations, graphs, and proof** | MIT 6.042J's outcomes include logical notation, sets, relations, induction, graph models, countering fallacious reasoning, and well-founded correctness/termination arguments. MIT [6.006](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/pages/syllabus/) lists this discrete-mathematics knowledge as a prerequisite for algorithm study. | Atlas correctly uses quantified contracts, counterexamples, relations, graph models, and a proof-versus-test distinction as the bridge from software claims to algorithm reasoning. Counting and probability appear as foundations only; deeper discrete mathematics is explicitly revisited in M27. One accelerated module cannot match a full discrete-mathematics term's proof volume. |
| **M5 — cost models and analysis** | MIT 6.006 describes mathematical modeling, algorithms/data structures, and performance measures/analysis techniques. CMU 15-122 expects Big-O analysis, asymptotic classes, amortized analysis, practical-efficiency experiments, and applying those analyses to new programs. Georgia Tech [CS 6515](https://omscs.gatech.edu/cs-6515-intro-graduate-algorithms) treats recurrence solving, asymptotic analysis, discrete mathematics, and undergraduate algorithm design as prerequisites for later graduate work. The [Python `perf_counter` reference](https://docs.python.org/3.14/library/time.html#time.perf_counter) is the authority for the timer API, not for a complexity claim. | Atlas's input model, counted operation, case analysis, recurrence, amortized argument, and measurement-reconciliation workflow aligns well with the undergraduate foundation that later algorithms assumes. Its raw-sample/median/minimum/maximum harness directly reinforces that measurements are evidence, not proofs. It does not claim the breadth or proof/problem-set depth of 6.006 or the graduate content of CS 6515. |

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

## Learner-facing review result

No additional theory or infrastructure is justified in this batch. The five
small learner-facing risks found in the prior calibration are now directly
addressed in the workbooks: M1 has a lexical-scope prediction trace; M2 has a
lexicographic termination transfer; M3 requires a type-compatible,
law-breaking implementation trace; M4 separates unequal branch counting from
probability independence; and M5 retains raw samples and reports
median/minimum/maximum. The M4→M5 handoff therefore retains both a completed
counterexample/proof-style argument and a cost argument with a stated input
model and measurement limit.

Keep Stanford CS106B and Georgia Tech CS6515 as optional depth and prerequisite
anchors, not content to compress into M1–M5. A new Arc-I source ledger or
registry would not add learner value here: each workbook already has a concise
session-to-source route and this review records the cross-module comparison.

## Reuse and integrity note

The external pages above are calibration and learner-link sources. Atlas should
continue to write original explanations, diagrams, prompts, diagnostics, and
artifacts; link to a university exercise only when its local license and
academic-integrity terms have been checked.
