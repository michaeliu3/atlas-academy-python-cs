# Module 33 — Formal Languages, Computability & Complexity: Candidate Source Ledger

## Scope and truth boundary

This ledger belongs to the fixed, **hidden review candidate** at
[content/modules/33_formal_languages_computability_complexity.md](../modules/33_formal_languages_computability_complexity.md).
It lets a future qualified reviewer inspect the candidate's claims and source
routes without substituting the instructor research dossier or authoring
workbook.

It is not a review approval, learner route, release record,
course-equivalence claim, theorem proof, or learner-mastery record. M33
remains authoring-only and hidden until the canonical graph, contract
evidence, qualified review, interaction, accessibility, CI, deployment, and
provenance requirements agree. Its prerequisites M05, M11, M23, and M27
remain required; selecting this file neither satisfies them nor opens M34 or
M36.

Atlas explanations, diagrams, construction traces, proof audits, diagnostics,
oral prompts, and dossiers are independently authored. The links below are
for study and provenance; they do not authorize copying third-party prose,
proofs, exercises, figures, slides, code, data, recordings, or grading
artifacts.

## Claim and session map

| Candidate claim | Sessions | What the source route checks | Candidate boundary |
| --- | --- | --- | --- |
| M33-C01 and C04: language, grammar, syntax, semantics, and authority are distinct objects | 1, 3 | formal object, grammar/machine question, encoding, and semantic scope | Parsing or a grammar result does not authorize execution or prove semantic behavior. |
| M33-C02 and C03: a finite automaton and a regularity/nonregularity proof require a named model and quantified argument | 2 | state, alphabet, transition, witness, and proof hypotheses | A few traces, an unlabeled diagram, or “needs memory” intuition is not a theorem. |
| M33-C05–C07: recognizer, decider, diagonal, and Rice-style claims depend on exact machine and totality assumptions | 3 | machine/question pairs, effective encoding, quantifiers, and nontrivial semantic-property scope | A timeout or source-text property does not establish undecidability. |
| M33-C08: a reduction is an explicitly directed computable transformation | 4 | source/target, map, resource bound, iff proof, and direction | Similarity or a reversed arrow does not establish hardness. |
| M33-C09–C10: complexity and completeness classify encoded formal decision families | 5, 6 | input encoding, resource model, verifier/membership, and declared reduction | A benchmark, timeout, or “combinatorial” label is not a complexity classification. |

## Source ledger

| ID | Stable learner-facing source | Claim linkage and rationale | Access record and reuse status |
| --- | --- | --- | --- |
| S33-01 | MIT OpenCourseWare, [6.045J Automata, Computability, and Complexity](https://ocw.mit.edu/courses/6-045j-automata-computability-and-complexity-spring-2011/) and [lecture-note index](https://ocw.mit.edu/courses/6-045j-automata-computability-and-complexity-spring-2011/pages/lecture-notes/) | C01–C10; connected undergraduate sequence for automata, decidability, reductions, complexity, and NP-completeness. | Accessed 2026-07-31. CC BY-NC-SA 4.0 baseline subject to asset notices. Link-only/original paraphrase; do not copy individual course assets. |
| S33-02 | Rabin and Scott, [Finite Automata and Their Decision Problems](https://doi.org/10.1147/rd.32.0114) | C02–C03; historical/model context for finite automata and named decision questions. | Accessed 2026-07-31. Publisher record with no checked Atlas reuse license. Citation/link and original examples only. |
| S33-03 | Chomsky, [Three Models for the Description of Language](https://doi.org/10.1109/TIT.1956.1056813) | C01 and C04; historical grammar-model comparison for syntax and generative mechanisms. | Accessed 2026-07-31. IEEE publication; no asset-reuse permission recorded. Citation/link and original grammar/parse examples only. |
| S33-04 | Turing, [On Computable Numbers](https://doi.org/10.1112/plms/s2-42.1.230) | C05–C06; historical machine/description model and an undecidability boundary. | Accessed 2026-07-31. Publisher record; exact asset reuse is not cleared. Citation/link and original proof presentation only. |
| S33-05 | Rice, [Classes of Recursively Enumerable Sets and Their Decision Problems](https://doi.org/10.1090/S0002-9947-1953-0053041-6) | C07; scope of semantic-property undecidability under named computability assumptions. | Accessed 2026-07-31. AMS publication; no asset-reuse permission recorded. Citation/link and original counterexamples only. |
| S33-06 | Cook, [The Complexity of Theorem-Proving Procedures](https://doi.org/10.1145/800157.805047) | C08–C10; historical anchor for polynomial reducibility and completeness claims. | Accessed 2026-07-31. ACM rights apply. Citation/link and original reduction fixture only. |
| S33-07 | Karp, [Reducibility Among Combinatorial Problems](https://doi.org/10.1007/978-1-4684-2001-2_9) | C08–C10; many-one reduction and completeness under the stated formal model. | Accessed 2026-07-31. Springer rights apply. Citation/link and original examples only. |
| S33-08 | Stanford, [CS103 Mathematical Foundations of Computing](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/) | Sessions 1–5; proof-first calibration for automata, computability, and complexity sequence. | Accessed 2026-08-01. Course assets have no blanket reuse permission. Link-only/original paraphrase. |
| S33-09 | Carnegie Mellon University, [15-251 Foundations of Theoretical Computer Science schedule](https://www.cs.cmu.edu/~arielpro/15251f15/schedule.html) | Sessions 2–4; comparison route for automata, computability, reductions, and theorem-scale proof practice. | Accessed 2026-08-01. No blanket license/reuse grant is inferred. Link-only/original examples. |
| S33-10 | Georgia Tech, [CS 4510 Formal Languages and Automata](https://faculty.cc.gatech.edu/~ladha/S26/4510/) | Sessions 2–4; formal-language and automata calibration complementary to the proof cards. | Accessed 2026-08-01. Course page is link-only; do not copy assets without separate review. |
| S33-11 | MIT OpenCourseWare, [18.404J Theory of Computation lecture-note index](https://ocw.mit.edu/courses/18-404j-theory-of-computation-fall-2020/pages/lecture-notes/) | Sessions 1–3; regex/NFA/DFA, CFG/PDA, pumping-lemma, and undecidability progression. | Accessed 2026-08-02. MIT OCW license is subject to asset notices. Link-only/original traces and proof audits. |
| S33-12 | Stanford, [CS103 Theorem and Definition Reference](https://web.stanford.edu/class/archive/cs/cs103/cs103.1132/reference/) | Sessions 1–3; definitions for formal objects, subset construction, stack-based PDA, pumping, verifier, and diagonal encoding. | Accessed 2026-08-02; rechecked 2026-08-03. No blanket reuse permission. Link-only/original paraphrase and examples. |
| S33-13 | MIT OpenCourseWare, [6.046J Lecture 17: Complexity and NP-completeness](https://ocw.mit.edu/courses/6-046j-design-and-analysis-of-algorithms-spring-2012/b4562881f2af637e09e806450e9b62c8_MIT6_046JS12_lec17.pdf) | Session 5; decision, certificate/verifier, search, and optimization distinctions. | Accessed 2026-08-02; rechecked 2026-08-03. Link-only/original comparison table; do not copy the lecture’s content. |
| U33 | Georgia Tech, [CS 6515 Intro to Graduate Algorithms](https://omscs.gatech.edu/cs-6515-intro-graduate-algorithms) | Sessions 4–5; advanced calibration for proof-aware algorithm analysis, reductions, and complexity reasoning. | Accessed 2026-08-01. Link-only/original exercises; not a substitute for term-long work or feedback. |

## Review checklist for these routes

Before a future M33 release, recheck every URL, source version, access date,
license/reuse notice, theorem phrasing, and source-to-claim link against the
exact candidate commit. University and primary-source routes calibrate
instructional scope and formal definitions; they do not grant reuse,
automatically prove the candidate's arguments, establish learner competence,
or make a practical product decision.

The focused [2026-08-03 official calibration](../../docs/research/m33-m34-official-calibration-2026-08-03.md)
records the scope check and its remaining delivery-evidence boundary. It is not
a source-map selection, review approval, or release record.
