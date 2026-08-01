# M33–M34 focused candidate review

**Scope (2026-08-01):** A bounded academic-calibration and study-quality review
of the private, authoring-only M33/M34 workbooks against their existing
source-research maps. The two bounded revisions below were then applied in the
follow-up authoring batch. It neither changes availability, graph/route/manifest
state, M25/M26 gating, release evidence, nor makes a university-equivalence or
learner-mastery claim.

## Official calibration checked

| Module | Official source (accessed 2026-08-01) | Narrow use |
| --- | --- | --- |
| M33 | [MIT 6.045J resources](https://ocw.mit.edu/courses/6-045j-automata-computability-and-complexity-spring-2011/download/) | automata → computability → reductions → complexity sequence |
| M33 | [Stanford CS103](https://web.stanford.edu/class/archive/cs/cs103/cs103.1264/) | proof-first definitions, reductions, and complexity boundaries |
| M33 | [CMU FLAC](https://www.cs.cmu.edu/~flac/) | finite-state, hierarchy, computability, and complexity scope |
| M33 | [Georgia Tech CS4510](https://faculty.cc.gatech.edu/~ladha/S26/4510/) | formal limits and easy-versus-hard framing |
| M34 | [Berkeley CS188](https://inst.eecs.berkeley.edu/~cs188/) | search, A*, CSP, planning, and MDP sequence |
| M34 | [CMU 15-281](https://www.cs.cmu.edu/~15281/) | representation, problem solving, uncertainty, and decision scope |
| M34 | [Stanford CS221](https://web.stanford.edu/class/archive/cs/cs221/cs221.1186/index.html) | formal search/CSP/MDP problem-solving standard |
| M34 | [MIT 6.034 assignments](https://ocw.mit.edu/courses/6-034-artificial-intelligence-fall-2010/pages/assignments/) | code-supported search and CSP progression |

The existing [M33 source map](../../content/source-maps/module33_formal_languages_computability_complexity_source_research.md)
and [M34 source map](../../content/source-maps/module34_classical_ai_search_constraints_decision_source_research.md)
already provide the primary-paper, official-documentation, claim, and reuse
ledger. This pass adds course-level calibration only; it does not copy assets.

## Already strong

- **M33** follows the right intellectual chain: formal objects and syntax →
  finite-state evidence → computability boundary → directed reductions →
  complexity claims. The `0^n1^n` distinction argument, total-mapping warning,
  and theorem-versus-bounded-trace discipline are mathematically sound and well
  matched to proof-first undergraduate materials.
- **M34** starts with representation before algorithms, then connects search,
  constraints/relaxations, planning limits, and uncertainty to accountable
  decision boundaries. Its fixed A* counterexample, arc-consistency
  counterexample, fractional-relaxation check, and one-shot-versus-MDP contrast
  favor reading/debugging/assumption repair over label memorization.

## Two high-value corrections — applied

| Exact revision point | Applied revision and reason |
| --- | --- |
| [`content/authoring/m33_formal_languages_computability_complexity_workbook.v1.md` — Session 3, “A halting-style diagonal boundary”](../../content/authoring/m33_formal_languages_computability_complexity_workbook.v1.md#session-3--grammar-questions-and-semantic-limits-are-different-questions) | Made the encoding convention visible in the displayed diagonal: `H` now decides paired valid encodings `⟨M,w⟩`, and the self-application uses `H(⟨D⟩,⟨D⟩)` and `D(⟨D⟩)` rather than shorthand `H(D,D)` / `D(D)`. The existing totality and self-application assumptions remain, with malformed strings handled by the named language convention. This removes a small but consequential object-versus-encoding ambiguity without adding theorem scope. |
| [`content/authoring/m34_classical_ai_search_constraints_decision_workbook.v1.md` — Session 2, immediately after the BFS/UCS guarantee paragraph and in “Search-Strategy Evidence Table”](../../content/authoring/m34_classical_ai_search_constraints_decision_workbook.v1.md#session-2--search-traces-need-their-theorem-conditions) | Added a compact distinction: **completeness** means returning a solution when one exists under named search-space/termination/duplicate conditions; **optimality** means returning a least-cost solution under named cost, goal-test, heuristic, and reopen conditions. Each evidence-table row must now identify which guarantee, if either, it claims. CS188/15-281/CS221 treat these as separate claims; the workbook had emphasized optimality conditions while leaving completeness implicit in its session promise. |

No further correction is proposed in this bounded pass. Both packs remain
authoring-only pending their separate contract, accessibility, route, source,
review, and release evidence.
