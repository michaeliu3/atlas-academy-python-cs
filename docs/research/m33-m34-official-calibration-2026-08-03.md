# M33–M34 official calibration — 2026-08-03

## Scope and boundary

This is a narrow, read-only check of the current **authoring-only** M33 and
M34 workbooks, their claim routes, and their learner-facing source links.
It compares the present six-session cores with official primary or
institutional material; it does not change curriculum content, graph state,
reader access, contracts, releases, or learner evidence. All links below were
accessed **2026-08-03**. Atlas remains link-only and original-paraphrase: no
source prose, figures, assignments, or code may be reused without a separate
asset-level review.

## Alignment found

| Pack | Current alignment | Calibration routes |
| --- | --- | --- |
| **M33 — Formal Languages, Computability & Complexity** | The connected route from formal objects through automata, computability, reductions, and complexity is mathematically sound at its stated scope. The CFG/PDA, pumping-lemma quantifiers, diagonal argument, VC-to-IS construction, and `HALT_TM <=m A_TM` reasoning are appropriately bounded. | MIT [18.404J Theory of Computation notes](https://ocw.mit.edu/courses/18-404j-theory-of-computation-fall-2020/pages/lecture-notes/) and Stanford [CS103 reference](https://web.stanford.edu/class/archive/cs/cs103/cs103.1132/reference/). |
| **M34 — Classical AI: Search, Constraints & Decision** | State formulation before search; the A* counterexample; CSP propagation, relaxation, planning, solver-status, and finite-horizon MDP distinctions are sound. The CP-SAT status wording matches the official documentation. | UC Berkeley [CS188 informed search](https://inst.eecs.berkeley.edu/~cs188/textbook/search/informed.html), [CSP filtering](https://inst.eecs.berkeley.edu/~cs188/textbook/csp/filtering.html), [MDPs](https://inst.eecs.berkeley.edu/~cs188/textbook/mdp/markov-decision-processes.html), [CMU 15-887 planning](https://www.cs.cmu.edu/~mmv/planning/schedule.html), and [OR-Tools CP-SAT](https://developers.google.com/optimization/cp/cp_solver). |

## Concrete repairs applied after this audit

1. **M34 Session 5 source route:** `S34-08` now uses Berkeley CS188's official
   [Decision Networks page](https://inst.eecs.berkeley.edu/~cs188/textbook/vpis/decision-networks.html).
   The publisher source remains historical background, not the formula-reading
   route.
2. **M34 Session 5 NIST route:** the learner-facing entry now uses the direct
   official HTTPS [NIST AI RMF 1.0 PDF](https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.100-1.pdf),
   while a DOI may remain a citation record.
3. **M33 Session 4 malformed-input reduction branch:** the workbook now makes
   the referent explicit: a malformed *source* string is outside `VC`, while
   `2#2#0,1` is outside `IS` but remains in `VC`.
4. **M34 Session 2 A* guarantee table:** the no-reopen graph-search row now
   carries a finite/stated termination regime alongside its consistency and
   nonnegative-cost conditions, matching the scoped treatment in Hart,
   Nilsson, and Raphael's
   [primary paper](https://doi.org/10.1109/TSSC.1968.300136).
5. **M34 Session 4 state-update table:** the header now says “explicit field
   updates,” and the text names symbolic as well as numeric assignments, so a
   location transition is not misleadingly presented as arithmetic.
6. **M34 Session 4 state semantics:** the archive card now separates a fact
   assigned false by a declared closed-world state from a missing observation
   and a wholly unmodelled factor. The learner predicts whether a silent
   key-location sensor authorizes a false state fact, then must add an
   observation/belief boundary, revise the representation, or withdraw the
   plan claim. This uses CMU 15-887 as a link-only calibration route and does
   not add a POMDP, solver, or real-world planning lab.

## Deliberate limits and release boundary

No expansion is indicated: the packs deliberately adapt term-length
proof/problem-set and programming sequences into original, small
proof/trace/design artifacts and supportive oral discussion. They do **not**
claim coverage of every advanced formal-language, planning, game, graphical
model, or reinforcement-learning topic, university-course equivalence, or
learner mastery.

M33 and M34 remain authoring-only. This finding is not a source approval,
module-contract review, accessibility/voice-chat check, CI or deployment
record, GitHub release/provenance receipt, Notion write, or publication
decision. Those require separate evidence before either module can be called
published or complete.
