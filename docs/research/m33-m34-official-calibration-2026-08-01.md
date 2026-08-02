# M33–M34 official calibration — 2026-08-01

## Scope and truth boundary

This is a compact, read-only calibration of the current M33/M34 authoring
workbooks, their source maps, authoring-delivery maps, and candidate evidence.
It assesses learning scope against official course material; it does **not**
approve a source, change an availability state, create a learner route, or
establish release, mastery, or university-equivalence evidence. Both modules
remain authoring-only as their existing evidence records state.

All sources below were accessed **2026-08-01**. Use them as learner links and
scope checks only. Atlas should keep its original explanations, examples,
visuals, prompts, and fixtures; do not copy course notes, slides, assignments,
solutions, code, or figures without an asset-level permission decision. MIT
OCW is licensed material but still requires the relevant attribution and
asset-level license review; Stanford explicitly reserves its course materials.

## Compact official calibration corpus

| Module | Official material | What it confirms for Atlas |
| --- | --- | --- |
| M33 | [MIT 6.045J](https://ocw.mit.edu/courses/6-045j-automata-computability-and-complexity-spring-2011/) | The central sequence is appropriate: finite automata → computation models/limits → reducibility → P versus NP/NP-completeness. Its broader circuits, randomness, cryptography, learning, and quantum topics are not a mandate to expand one six-session module. |
| M33 | [Stanford CS103, Winter 2026](https://web.stanford.edu/class/archive/cs/cs103/cs103.1264/) | A proof-first route from discrete mathematics to computability and complexity is a suitable standard for Atlas’s definition, counterexample, and oral-explanation emphasis. |
| M33 | [CMU 15-251 schedule](https://www.cs.cmu.edu/~arielpro/15251f15/schedule.html) and [Georgia Tech CS4510, Spring 2026](https://faculty.cc.gatech.edu/~ladha/S26/4510/) | DFA/Turing-machine/undecidability/time-complexity/reduction/P-vs-NP sequencing is sound. Georgia Tech’s CFG/PDA material identifies the one small formal-language bridge noted below. |
| M34 | [Berkeley CS188 informed search](https://inst.eecs.berkeley.edu/~cs188/textbook/search/informed.html) and [MDPs](https://inst.eecs.berkeley.edu/~cs188/textbook/mdp/markov-decision-processes.html) | The state-model → search → CSP → MDP/decision route is coherent. The material specifically supports the workbook’s distinction between A* variants, duplicate/reopen policy, finite horizon, and discounting. |
| M34 | [Stanford CS221, Spring 2026](https://cs221.stanford.edu/) and [CMU 07-280 MDP notes](https://www.cs.cmu.edu/~07280/notes/mdps/index.html) | Search, constraint satisfaction, MDPs, problem formulation, and the state/action/transition/reward/policy distinction are appropriate foundations before ML. |
| M34 | [MIT 6.034](https://ocw.mit.edu/courses/6-034-artificial-intelligence-fall-2010/) and [Georgia Tech CS6601](https://omscs.gatech.edu/cs-6601-artificial-intelligence) | The module’s first-principles focus on representations and problem solving is suitably rigorous; it should remain a bounded classical-AI foundation rather than absorb a full ML or term-long implementation course. |

## What is already strong

- **M33** has the right connected argument: language/syntax/semantics → finite
  evidence → decidability boundary → directed reductions → scoped complexity
  claims. Its DFA/NFA/regular-expression/CFG ladder, distinguishing-family
  proof, encoded diagonal argument, and reduction-direction counterexample
  match the proof discipline expected by the calibration sources.
- **M34** correctly makes representation precede algorithm selection, then
  makes frontier policy, heuristic conditions, CSP locality, relaxation,
  planning status, uncertainty, utility, and authority distinct. The explicit
  A* no-reopen counterexample, arc-consistency counterexample, solver-status
  matrix, and finite-horizon Bellman contrast are unusually good
  understanding-first choices.
- Both candidates already provide six connected sessions, prediction before
  reveal, code/design reading, counterexamples, diagnostics/retrieval,
  dossiers, source traces, and TA/Study Partner prompts. Their delivery maps
  correctly preserve prerequisite order (`M33 → M34`) and their candidate
  evidence correctly declines to treat structure or a fixture as a learner
  release.

## Resolved learner-impacting repair

### M33: constructive witness for the key language-class claim

The formal-model ladder states that
\(L_= = \{0^n1^n \mid n\ge0\}\) is context-free and not regular. The
workbook now directly supplies the corresponding compact CFG witness under
**“Constructive witness — a CFG for \(L_=\)”**:
\(S \rightarrow 0S1 \mid \epsilon\), with the derivation
\(S \Rightarrow 0S1 \Rightarrow 00S11 \Rightarrow 0011\). It explains that
this witnesses context-freeness while the later distinguishability argument
addresses the separate finite-state/regular-language limit.

This resolves the earlier missing-witness finding without expanding scope.
PDA equivalence, pumping-lemma variants, and closure-property proofs remain
optional depth rather than an added required unit.

## Delivery gap that should not be papered over

The material is still a hidden authoring candidate. The learner-facing
experience required by Atlas—readable equation/code whiteboard in a live chat,
constructive TA oral defense, and equivalent accessible text flow—has not been
demonstrated by the source map, delivery map, or fixtures. The lean next check
is one rendered M33 chat/voice pilot, then M34, with a learner-approved concise
summary. This is a real learning-quality/release-evidence gap, not a reason to
claim either module is published.

## Deliberate non-gaps

Do not inflate M33 with the rest of a term-long theory survey (circuits,
randomness, cryptography, quantum computation) or M34 with games, Bayesian
networks, reinforcement learning, and full solver implementation. Those are
valid later/optional depth, not missing core material for these two connected
modules. After the small M33 witness, prioritize a substantive human review
and real delivery check over new registries, tests, or metadata.
