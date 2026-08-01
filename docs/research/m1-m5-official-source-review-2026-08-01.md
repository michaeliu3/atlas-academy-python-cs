# M1–M5 official-source review

**Scope.** This concise calibration checks the existing M1–M5 workbooks against
official MIT and CMU material accessed **2026-08-01**. It calibrates topic order
and evidence expectations; it does not assert enrollment, faculty feedback,
credit, degree, grading, or institutional equivalence.

| Atlas material calibrated | Official source and claim supported | Judgment |
| --- | --- | --- |
| **M1 — Values, State, and Execution**, Sessions 1–4: object/binding traces, environments, aliasing prediction, contracts, and the shared-state regression artifact | [MIT 6.100L calendar](https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/pages/calendar/) sequences objects, types, variables, bindings, functions/environments/scope, mutation, aliasing/cloning, debugging, and assertions. [CMU 15-122 learning objectives](https://www.cs.cmu.edu/~15122/syllabus.shtml) require tracing small imperative programs and using contracts, assertions, and invariants for safety/correctness. | **Aligned, adapted.** Atlas preserves the reasoning core in Python and emphasizes prediction/code reading. It deliberately defers CMU's C/C0, Unix, and full assignment volume. |
| **M2 — Functions, Recursion, and Induction**, Sessions 1–5: function contracts, call-frame traces, structural decrease, termination/induction, recurrence and debugging artifacts | The MIT 6.100L calendar explicitly joins functions/environments with recursion and inductive reasoning. [MIT 6.042J syllabus](https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/pages/syllabus/) names induction, well-founded ordering, and correctness/termination reasoning among its outcomes; CMU 15-122 likewise expects termination arguments for loops and recursion. | **Aligned, adapted.** Atlas makes the execution → recursion → proof → cost connection explicit. Repeated institutional-scale recursion problem practice remains intentionally outside this six-session pack. |
| **M3 — Abstraction, Interfaces, and ADTs**, Sessions 1–6: EventStore contract, representation change, AF/RI, rep-exposure debugging, and patch review | [MIT 6.102, Abstract Data Types](https://web.mit.edu/6.102/www/sp26/classes/06-abstract-data-types/) defines ADTs through operations and representation independence. [MIT 6.102, Abstraction Functions & Rep Invariants](https://web.mit.edu/6.102/www/sp26/classes/07-abstraction-functions-rep-invariants/) defines AF and RI, requires precise documentation, and connects `checkRep`/rep exposure to implementation responsibility. CMU 15-122 requires distinguishing specification from implementation and defending interfaces/abstractions. | **Aligned, adapted.** Atlas retains the conceptual obligations while using Python `Protocol`/runtime checks rather than MIT's TypeScript examples. Full static-checking and team-review infrastructure are deferred to later engineering modules. |
| **M4 — Logic, Sets, Relations, Graphs, and Proof**, Sessions 1–5: quantified prerequisite claims, relation/graph model, proof/counterexample work, and proof-versus-test evidence table | [MIT 6.042J syllabus](https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/pages/syllabus/) covers definitions/proofs, sets, functions, relations, graphs, induction, fallacious reasoning, and graph models for connectivity/constraints. Its [official readings](https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-fall-2010/pages/readings/) separately route proofs, induction, graph theory, directed graphs, relations, asymptotics, and recurrences. | **Aligned, compressed.** The workbook supplies the necessary proof-to-algorithm bridge; number theory, full counting, and discrete probability are intentionally deferred to the mathematical bridge/advanced route rather than mislabeled as complete coverage of a full discrete-math term. |
| **M5 — Cost Models and Algorithm Analysis**, Sessions 1–6: counted-operation model, bounds/cases, recurrence tree, amortized/space account, measurement reconciliation, and AI-claim review | [MIT 6.006 syllabus](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/pages/syllabus/) requires Python and discrete-math foundations including logic, relations, proofs, recursion, graphs, and probability, then introduces mathematical modeling and performance analysis. CMU 15-122 explicitly expects Big-O, complexity-class comparison, amortized-analysis reasoning, and practical-efficiency tests at varying input sizes. | **Aligned, adapted.** Atlas correctly treats measurement as evidence rather than proof and carries operation assumptions across abstraction boundaries. The breadth of 6.006 data structures/algorithm paradigms and its institutional problem-set depth are deferred to M6 onward. |

## Cross-module finding

The Atlas path is academically coherent: execution/bindings (M1) support call
frames and progress arguments (M2); contracts become data abstractions (M3);
logic/proof supplies universal claims (M4); modeled operations become resource
claims (M5). MIT 6.006's published prerequisite structure independently
supports that ordering. The meaningful limitation is practice scale and
institutional feedback, not an identified conceptual gap in this gateway pack.

## Reuse boundary

All cited sources are **link-only calibration sources**. Atlas should retain
original explanations, diagrams, code, prompts, diagnostics, and artifacts;
do not copy lecture prose, figures, assignments, solutions, or course-specific
assessment materials. Check each source/asset's current license and
academic-integrity terms before any reuse beyond linking and brief paraphrase.
