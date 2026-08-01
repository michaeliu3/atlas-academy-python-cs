# M33–M34 authoring readiness review — 2026-08-01

**Scope.** A bounded, read-only review of the two hidden authoring packs,
their delivery maps, source research, candidate evidence, and focused tests.
It distinguishes the quality of a draft study pack from a reviewed learner
release. It does not change graph state, routing, contracts, source-map
selection, deployment, or M25/M26 gating.

## Concise verdict

| Module | Draft learning quality | Release truth |
| --- | --- | --- |
| **M33 — Formal Languages, Computability & Complexity** | **Strong connected authoring candidate.** Its six sessions move from formal objects to finite-state limits, computability, reductions, complexity, and a narrowly defended claim. It has original derivations, counterexamples, code-reading, prediction-before-reveal, a dossier, diagnostic/retrieval, one accessible-diagram alternative, and TA/Study Partner prompts. | **Not study-ready as a reviewed learner module; authoring-only and hidden.** It has no canonical learner source-map binding, learner route/manifest, reviewed delivery candidate, human-quality review, release CI/deployment record, or evidence of live delivery. |
| **M34 — Classical AI: Search, Constraints & Decision** | **Strong connected authoring candidate.** It starts with representation before algorithms, then makes search conditions, CSP/relaxation boundaries, planning/status limits, and belief/utility/authority distinct. It includes explicit counterexamples, bounded fixtures, a cumulative dossier, diagnostic/retrieval, accessible-diagram alternative, and TA/Study Partner prompts. | **Not study-ready as a reviewed learner module; authoring-only and hidden.** It has the same delivery/release gaps and must not bypass M33, which remains an authoring-only academic prerequisite. |

The correct conclusion is **no major content rewrite is currently indicated**.
The next work is to turn two high-quality drafts into reviewed private
learning packs in prerequisite order—not to publish them or add more parallel
metadata.

## Calibration and source/reuse check

The following official sources were rechecked on **2026-08-01**. Atlas should
link and independently paraphrase them; it must not copy their notes, slides,
figures, assignments, solutions, code, or other assets without a separate
asset-level permission decision.

| Module | Sources checked | Alignment / intentional adaptation |
| --- | --- | --- |
| M33 | [MIT 6.045J](https://ocw.mit.edu/courses/6-045j-automata-computability-and-complexity-spring-2011/) confirms the automata → Turing/computability → reducibility → P/NP sequence; [Stanford CS103](https://web.stanford.edu/class/archive/cs/cs103/cs103.1264/) confirms a current proof-first route across discrete mathematics, computability, and complexity. | Aligned to the core proof/model sequence. It intentionally does **not** reproduce a full term's circuits, randomness, cryptography, quantum-computing, or graded-proof workload; that is appropriate to this module's stated 60-day role, not a missing lesson. |
| M34 | [Berkeley CS188 informed search](https://inst.eecs.berkeley.edu/~cs188/textbook/search/informed.html) confirms the representation/search/CSP/MDP learning spine and the need to separate A* variants and conditions; [OR-Tools CP-SAT documentation](https://developers.google.com/optimization/cp/cp_solver) confirms the five status meanings used in the workbook. | Aligned to the stated search, constraint, planning, and decision scope. It intentionally leaves adversarial games, logic/knowledge representation, graphical models, and reinforcement learning outside this module rather than turning it into a survey; later modules carry the learning/representation extension. |

The existing authoring ledgers also link primary historical sources (including
Turing, Cook, Karp, Dijkstra, Hart–Nilsson–Raphael, Mackworth, STRIPS, and
von Neumann–Morgenstern) and record link-only/original-paraphrase boundaries.
They are strong authoring research, **not** the graph-bound canonical
learner-source maps required for a future review or release.

## Evidence actually checked

- Both workbooks have six connected sessions, typed output anchors in
  `content/course/contracts/authoring-delivery/`, prerequisite/forward
  handoffs, module-specific companion prompts, source routes, and explicit
  candidate-release boundaries.
- M33's finite DFA fixture and M34's deterministic frontier, relaxation,
  A* no-reopen, and two-step Bellman fixtures are useful code-reading
  evidence. They deliberately do **not** claim to be theorem checkers,
  general solvers, learner studios, or deployment evidence.
- `node --test tests/m33-m34-evidence-preflight.test.mjs
  tests/m33-formal-languages-reference-model.test.mjs
  tests/m34-classical-ai-reference-fixture.test.mjs` passed **26/26** on
  2026-08-01. This proves structural candidate binding and selected bounded
  examples; it does not prove pedagogy, accessibility, live-chat behavior,
  source correctness, or release readiness.
- The canonical graph remains correct: M33/M34 are
  `authoring-only`/`hidden`, with `sourceMap: null`, `studioId: null`, and
  unrecorded releases. Their preflight documents explicitly preserve that
  non-promotion boundary.

## High-value gaps and lean remediation order

1. **Create reviewed hidden candidates, M33 before M34.** Use the existing
   review-ready pathway to freeze each actual workbook, bind a canonical
   learner source ledger, and conduct one substantive human review of
   proof/claim accuracy, source/reuse, assessment/dossier quality, and
   module-specific TA/Study Partner prompts. Do not promote a pointer-present
   evidence record as approval. M34's review must retain the M33 prerequisite
   gate.
2. **Review real delivery, not another document layer.** Render representative
   sessions and test the authored visual/text alternatives, keyboard/screen
   reader behavior, and readable code/equation whiteboard in one designated
   chat pilot per module. Exercise a constructive oral-defense prompt and the
   text-equivalent path; save only a learner-approved concise summary under
   the existing Notion boundary. Current prompts and fixtures do not prove
   this occurred.
3. **Release only after the reviewed pack is fixed and evidence is real.** If
   portal publication is later desired, add the reviewed learner material,
   canonical source-map/studio-or-equivalent decision, route/manifest binding,
   focused accessibility checks, exact-commit CI, private deployment,
   limitations, changelog, and provenance record through normal additive
   GitHub commits. Until then, retain both packs as hidden private drafts and
   keep M25/M26 preview-gated.

## Release truth

M33 and M34 are suitable for **instructor-led private draft study only**.
They are not reviewed modules, published portal modules, university-equivalent
courses, learner-mastery evidence, or permission to unlock M35/M25/M26. The
smallest honest next milestone is a reviewed hidden M33 candidate, followed by
M34—not a graph or release-state change.
