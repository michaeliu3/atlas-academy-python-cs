# Module 34 — Classical AI: Search, Constraints & Decision: Candidate Source Ledger

## Scope and truth boundary

This ledger belongs to the fixed, **hidden review candidate** at
[content/modules/34_classical_ai_search_constraints_decision.md](../modules/34_classical_ai_search_constraints_decision.md).
It lets a future qualified reviewer inspect the candidate's claims and source
routes without substituting the instructor research dossier or authoring
workbook.

It is not a review approval, learner route, release record, course-equivalence
claim, solver authorization, theorem proof, or learner-mastery record. M34
remains authoring-only and hidden until the canonical graph, contract evidence,
qualified review, interaction, accessibility, CI, deployment, and provenance
requirements agree. Its prerequisites M10, M11, M30, M31, and M33 remain
required; selecting this file neither satisfies them nor opens M35, M25, or
M26.

Atlas explanations, diagrams, construction traces, proof audits, diagnostics,
oral prompts, and dossiers are independently authored. The links below are for
study and provenance; they do not authorize copying third-party prose,
pseudocode, proofs, figures, slides, exercises, code, data, recordings, or
grading artifacts.

## Claim and session map

| Candidate claim | Sessions | What the source route checks | Candidate boundary |
| --- | --- | --- | --- |
| M34-C01: state, observation, action, transition, goal, and cost are distinct model choices | 1 | formal state-space/planning representation and omitted-variable audit | A formal encoding does not establish that it captures the world. |
| M34-C02–C03: search traces need a named variant, cost convention, duplicate policy, and heuristic condition | 2 | shortest-path / A-star model, frontier policy, and theorem scope | A returned route or finite trace is not an optimality certificate by itself. |
| M34-C04 and C06: local consistency, solver status, and relaxation each have limited meanings | 3 | CSP propagation, documented solver contract, convex grammar, and feasibility/bound direction | A locally consistent, accepted, or relaxed candidate need not solve the original problem. |
| M34-C05 and C07: planning and complexity claims depend on formal encoding and assumptions | 4 | STRIPS/PDDL semantics, reduction direction, and encoded-problem scope | A timeout or source file does not prove infeasibility, hardness, or field feasibility. |
| M34-C08–C09: uncertainty, utility, authority, and sequential policy are separate inputs | 5, 6 | preference/decision assumptions, MDP structure, and accountable-review boundary | A numerical ranking does not discover legitimacy, consent, or permission to act. |

## Source ledger

| ID | Stable learner-facing source | Claim linkage and rationale | Access record and reuse status |
| --- | --- | --- | --- |
| S34-01 | Dijkstra, [A Note on Two Problems in Connexion with Graphs](https://doi.org/10.1007/BF01386390) | C01–C02; shortest-path formulation and stated weight assumptions. | Accessed 2026-07-31. Publisher record; link/cite and original derivations/fixtures only. |
| S34-02 | Hart, Nilsson, and Raphael, [A Formal Basis for the Heuristic Determination of Minimum Cost Paths](https://doi.org/10.1109/TSSC.1968.300136) | C02–C03; path cost, heuristic estimates, and qualified optimality conditions. | Accessed 2026-07-31. IEEE publication; link-only/original paraphrase and traces; recheck theorem version before release. |
| S34-03 | Mackworth, [Consistency in Networks of Relations](https://doi.org/10.1016/0004-3702(77)90007-8) | C04; relation-network framing and local consistency as inference, not a global certificate. | Accessed 2026-07-31. Elsevier publication; link-only/original examples and diagrams. |
| S34-04 | Fikes and Nilsson, [STRIPS](https://doi.org/10.1016/0004-3702(71)90010-5) | C01 and C05; actions, preconditions, effects, and state-space planning representation. | Accessed 2026-07-31. Elsevier publication; link-only/original planning fixtures. |
| S34-05 | Fox and Long, [PDDL2.1](https://doi.org/10.1613/jair.1129) | C01 and C05; semantics/expressivity when time, quantities, and resources enter a plan. | Accessed 2026-07-31. Journal article; link-only/original paraphrase; recheck exact reuse terms before release. |
| S34-06 | Google, [OR-Tools CP-SAT documentation](https://developers.google.com/optimization/cp/cp_solver) and [repository license](https://github.com/google/or-tools/blob/stable/LICENSE) | C04 and C06; model, solver-status, and returned-value contract reading. | Accessed 2026-07-31. Apache-2.0 repository, but Atlas remains link-only/original examples pending separate asset/package review. |
| S34-07 | CVXPY, [Disciplined Convex Programming tutorial](https://www.cvxpy.org/tutorial/dcp/) and [project license](https://github.com/cvxpy/cvxpy/blob/master/LICENSE) | C04 and C06; DCP grammar versus mathematical convexity, solver invocation, and relaxation reading. | Accessed 2026-07-31. Apache-2.0 project; link-only/original mathematical examples and diagrams. |
| S34-08 | UC Berkeley CS188, [Decision Networks](https://inst.eecs.berkeley.edu/~cs188/textbook/vpis/decision-networks.html) | C08; conditional expected-utility calculation under named state, evidence, action, utility, and probability assumptions. | Accessed 2026-08-03. University course material; link-only/original finite examples and no copied prose, figures, exercises, or code. |
| S34-09 | Cook, [The Complexity of Theorem-Proving Procedures](https://doi.org/10.1145/800157.805047) | C07; reduction-based complexity reasoning and exact transformed problem definition. | Accessed 2026-07-31. ACM publication; link-only/original proof and reduction sketches. |
| S34-10 | Karp, [Reducibility Among Combinatorial Problems](https://doi.org/10.1007/978-1-4684-2001-2_9) | C07; many-one reduction direction and encoded-family classification. | Accessed 2026-07-31; rechecked 2026-08-01. Springer record; link-only/original transformations. |
| S34-11 | NIST, [AI Risk Management Framework 1.0 PDF](https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.100-1.pdf) | C09; oversight, context, harms, accountability, and risk controls as design/review concerns. | Accessed 2026-08-03. Official guidance; link-only/original paraphrase; not legal advice or authorization. |
| S34-12 | MIT OpenCourseWare, [18.600 Probability and Random Variables lecture notes](https://ocw.mit.edu/courses/18-600-probability-and-random-variables-fall-2019/pages/lecture-notes/) | C08; bridge to M30 finite expectation and conditional-probability notation. | Accessed 2026-07-31. MIT OCW item notices apply; link-only/original examples and no copied notes/exercises. |
| S34-13 | Carnegie Mellon University, [07-280 AI/ML I Markov Decision Process notes](https://www.cs.cmu.edu/~07280/notes/mdps/index.html) | C08; sequential MDP structure versus a one-shot expected-utility table. | Accessed 2026-07-31; rechecked 2026-08-01. Course notes are link-only; original notation/examples only. |
| S34-14 | MIT, [6.034 Recitation 6: Planning and Search](https://courses.csail.mit.edu/6.034s/handouts/spring12/recitation6-planning.pdf) | C03 and C06; relaxed problem, delete-list omission, and admissible-heuristic audit. | Accessed 2026-08-02. Course handout is link-only; no copied exercises, diagrams, or code. |
| S34-15 | Stanford, [CS221 Course Scheduling assignment](https://web.stanford.edu/class/archive/cs/cs221/cs221.1192/assignments/scheduling/index.html) | C04; partial assignments, pruning, and repeated domain propagation. | Accessed 2026-08-02. Assignment is link-only; do not copy its problem, code, tests, or solution structure. |
| S34-16 | MIT OpenCourseWare, [6.825 Lecture 10: Planning](https://ocw.mit.edu/courses/6-825-techniques-in-artificial-intelligence-sma-5504-fall-2002/1184a975225bdbab3e3d215bf173bde1_Lecture10FinalPart1.pdf) | C05; state-result relation, frame problem, and add/delete effect convention. | Accessed 2026-08-02. MIT OCW item notices apply; link-only/original state-update cards. |
| S34-17 | Stanford, [CS221 Markov Decisions handout](https://web.stanford.edu/~cpiech/cs221/handouts/markovDecisions.html) | C08; Markov conditional-independence, transition/reward, and horizon assumptions. | Accessed 2026-08-02. Course handout is link-only; independently authored examples only. |
| S34-18 | UC Berkeley, [CS188 informed search](https://inst.eecs.berkeley.edu/~cs188/textbook/search/informed.html), [CSP filtering](https://inst.eecs.berkeley.edu/~cs188/textbook/csp/filtering.html), and [MDPs](https://inst.eecs.berkeley.edu/~cs188/textbook/mdp/markov-decision-processes.html) | C01–C04 and C08; state/observation, A-star duplicate-policy, AC-3 trace, and finite Bellman-card calibration. | Accessed 2026-08-02. Course material is link-only; do not copy prose, figures, exercises, pseudocode, or code. |

## Review checklist for these routes

Before a future M34 release, recheck every URL, source version, access date,
license/reuse notice, theorem phrasing, API contract, and source-to-claim link
against the exact candidate commit. University, standards, documentation, and
primary-source routes calibrate instructional scope and formal definitions; they
do not grant reuse, automatically prove the candidate's arguments, establish
learner competence, validate a real-world model, or authorize a decision.
