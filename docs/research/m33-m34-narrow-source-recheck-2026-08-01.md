# M33–M34 narrow primary-source recheck — 2026-08-01

**Scope.** This is a small authoring calibration check, not a release review.
It rechecks the formal-model, planning, and solver-status boundaries named
below. M33 and M34 remain authoring-only; nothing here changes the graph,
route, contract, learner availability, or university-equivalence boundary.
Atlas should link and independently paraphrase these sources, not copy their
notes, slides, figures, examples, assignments, or solutions without separate
asset-level review.

## M33 — formal languages, computability, and complexity

| Narrow issue | Official/primary sources accessed 2026-08-01 | Recheck conclusion and authoring action |
| --- | --- | --- |
| Formal-object through finite-state scope | [MIT 6.045J](https://ocw.mit.edu/courses/6-045j-automata-computability-and-complexity-spring-2011/) and [Stanford CS103 Spring 2026 course archive](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/) | The current-quarter route confirms the language → automaton → computability → reduction → complexity progression. The previously checked `.1134/reference/` archive is a historical anchor only. The paired-encoding diagonal and the well-formed-instance VC→IS boundary are correctly scoped. **No mathematical correction required.** |
| Readability of interface-shaped sketches | The same formal-method sources calibrate the distinction between a machine model and a concrete API. | `run_for_at_most` and `verifies_vertex_cover` are explanatory interface sketches, not self-contained programs. **Action:** mark them as `text` pseudocode; retain the separately bounded DFA reference as the runnable fixture. |
| Claim traceability | The existing M33 source dossier already maps C01–C10 to S33-01–S33-07. | **Action:** expose compact claim/source labels at the relevant sessions so the learner can follow a conclusion back to its formal assumptions and source route. |

## M34 — classical AI, search, constraints, and decision

| Narrow issue | Official/primary sources accessed 2026-08-01 | Recheck conclusion and authoring action |
| --- | --- | --- |
| Reduction provenance | R. M. Karp, [*Reducibility Among Combinatorial Problems*](https://doi.org/10.1007/978-1-4684-2001-2_9) (1972) | The earlier S34-10 URL mistakenly resolved to Tarjan's depth-first-search paper. **Action:** repair the ledger link to Karp's chapter DOI; keep link-only/original transformations. |
| Planning-state reasoning | [Berkeley CS188 informed search](https://inst.eecs.berkeley.edu/~cs188/textbook/search/informed.html), [CSP filtering](https://inst.eecs.berkeley.edu/~cs188/textbook/csp/filtering.html), and the original [STRIPS paper](https://doi.org/10.1016/0004-3702(71)90010-5) | The existing A*, CSP, relaxation, expected-utility, and two-stage backup examples are correct and bounded. **Action:** add one fixed state/action trace so state variables, effects, energy, and a changed time/capacity contract become inspectable before a planner is named. |
| Solver statuses | [OR-Tools CP-SAT status documentation](https://developers.google.com/optimization/cp/cp_solver) | `OPTIMAL`, `FEASIBLE`, `INFEASIBLE`, `MODEL_INVALID`, and `UNKNOWN` have distinct model-level meanings. **Action:** add a status matrix with a real-world/model-adequacy/authority non-claim for every row. |

## Boundary retained

The sources calibrate definitions, proof obligations, and pedagogical sequence.
They do not establish a deployment decision, source-asset reuse permission,
term-long course equivalence, learner completion, mastery, or authority for an
AI/solver output. Recheck moving documentation, framework versions, and any
learner-facing delivery route before a future review or release decision.
