# M1–M5 legacy remediation source brief

**Method.** Read the current learner workbooks and their official calibration
cards against the study-ready standard on **2026-08-01**. The arc already has a
connected six-session spine, diagnostics, retrieval, oral guides, artifacts,
and source/reuse cards. These are the smallest genuine learning improvements;
they do **not** justify a rewrite, a new registry, or a claim of university
equivalence.

| Module | Evidence-backed gap | Official calibration relevance | Smallest high-value remediation |
| --- | --- | --- | --- |
| **M1 — Values, State, and Execution** | Its stated scope-resolution outcome is not taught through a worked lexical-lookup trace: Session 2 lists environments/scope, but no global/enclosing/local shadowing or `nonlocal` prediction case appears. | [MIT 6.100L calendar](https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/pages/calendar/) explicitly sequences bindings, functions, environments, and scope; [CMU 15-122 objectives](https://www.cs.cmu.edu/~15122/syllabus.shtml) include tracing imperative execution. | Add one compact **predict → binding/environment diagram → testable conclusion** case in Session 2: shadow a name, contrast local rebinding with `nonlocal`, and refute “a callee rebinds the caller's name.” |
| **M2 — Functions, Recursion, and Induction** | Termination evidence is strong for finite trees, but the only completed well-founded argument uses a node-count measure. A learner can overgeneralize termination as a tree-only or one-natural-number technique. | [MIT 6.042J syllabus](https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/pages/syllabus/) names well-founded ordering, induction, correctness, and termination reasoning. | Add one Session-3 transfer: interval recursion or a lexicographic pair; require the domain, decreasing measure, failing branch, and short proof skeleton. Keep it an extension, not a new submodule. |
| **M3 — Abstraction, Interfaces, and ADTs** | The workbook explains that structural typing cannot establish behavioral laws and mentions a malicious `ReversingStore`, but the law-breaking implementation remains optional rather than required evidence. | [MIT 6.102 ADTs](https://web.mit.edu/6.102/www/sp26/classes/06-abstract-data-types/) and its [AF/RI reading](https://web.mit.edu/6.102/www/sp26/classes/07-abstraction-functions-rep-invariants/) ground behavioral contracts, representation independence, and rep-exposure reasoning. | Promote one tiny type-compatible but law-breaking store to a required trace/test: map the failed observer-based sequence to append order, snapshot stability, observer purity, or exposure. No new test framework. |
| **M4 — Logic, Sets, Relations, Graphs, and Proof** | The product-rule wording says a following **independent** decision has `b` choices; this risks conflating combinatorial branch counting with the later probabilistic independence concept, which the workbook correctly calls a model claim. | [MIT 6.042J official readings](https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-fall-2010/pages/readings/) cover counting and probability as distinct foundations. | Replace the wording with “each first-stage choice has the same number of continuations,” then add one unequal-branch counterexample and sum-of-branch-counts repair before the probability section. |
| **M5 — Cost Models and Algorithm Analysis** | Its teaching harness returns only `min(samples)` even though its own review checklist requires reporting sample spread and warns against the fastest number alone. This models an overconfident evidence habit. | [MIT 6.006 syllabus](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/pages/syllabus/) calibrates performance modeling/analysis; [CMU 15-122 objectives](https://www.cs.cmu.edu/~15122/syllabus.shtml) include practical-efficiency testing at multiple input sizes. | Return raw samples or a tiny result record and show median plus min/max (or spread); explain why a minimum may be a useful lower-noise observation but cannot stand alone. Keep the existing small harness. |

## Priority and scope decision

The five compact remediations were applied as one connected foundation batch:
M1 supplies a scope prediction trace; M2 adds a lexicographic termination
transfer; M3 makes the law-breaking structural implementation required
evidence; M4 repairs the counting/probability boundary with a counterexample;
and M5 retains raw timing samples and reports median/minimum/maximum. Each
workbook also now maps its six sessions to a claim, learner artifact, and
existing source route.

This is authoring evidence, not a human-quality review, learner pilot,
release record, or promotion of the legacy-baseline lifecycle. Preserve the
existing connected sequence, source cards, accessible diagrams, TA/Study
Partner guides, and global minimum-evidence checklist. Do not turn the full
institutional courses, their problem sets, or their grading volume into
implied Atlas requirements.

## Source and reuse boundary

All cited pages are official, first-party calibration sources accessed
**2026-08-01**. Use them by stable link and brief paraphrase only. Keep Atlas
explanations, code, diagrams, prompts, diagnostics, and remediation examples
original; do not copy lecture prose, assignments, figures, solutions, or
assessment materials. These comparisons support comparable conceptual rigor
where learner evidence exists, not enrollment, credit, teaching, grading, or
degree equivalence.
