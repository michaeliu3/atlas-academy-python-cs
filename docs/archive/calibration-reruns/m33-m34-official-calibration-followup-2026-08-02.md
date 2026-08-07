# M33–M34 official calibration follow-up — 2026-08-02

## Scope and truth boundary

This is a focused calibration of the current **authoring-only** M33/M34
workbooks, their delivery maps, source ledgers, and private guided-learning
route. It assesses whether the intended six-session learning path preserves a
rigorous undergraduate spine; it does not approve sources or assets, change a
module state, create learner access, establish mastery, or claim equivalence
to enrollment in a university course.

All sources below were accessed **2026-08-02**. They are linked as calibration
and reading routes. Atlas must keep its own explanations, traces, diagrams,
prompts, and examples; it must not copy notes, assignments, solutions, code,
or figures without a separate asset-level reuse decision.

## Official calibration corpus

| Route | Official source | Narrow calibration use |
| --- | --- | --- |
| Formal theory | MIT [6.045J Automata, Computability, and Complexity syllabus](https://ocw.mit.edu/courses/6-045j-automata-computability-and-complexity-spring-2011/pages/syllabus/) | Confirms the finite-automata → computability → reductions → P/NP spine, proof-writing prerequisite, and the difference between a six-session core and a term of problem sets. |
| Formal theory | Stanford [CS103 Mathematical Foundations of Computing](https://web.stanford.edu/class/archive/cs/cs103/cs103.1264/) | Confirms that clean proofs, computability, and complexity belong in one connected route rather than as disconnected vocabulary. Stanford retains rights to its course materials; use link-only/original paraphrase. |
| Classical AI | UC Berkeley [CS188 textbook](https://inst.eecs.berkeley.edu/~cs188/textbook/), including [search](https://inst.eecs.berkeley.edu/~cs188/textbook/search/summary.html), [CSP](https://inst.eecs.berkeley.edu/~cs188/textbook/csp/csps.html), and [MDP](https://inst.eecs.berkeley.edu/~cs188/textbook/mdp/markov-decision-processes.html) routes | Confirms the state-model → search → CSP → sequential-decision progression and the need to keep representation, search policy, constraints, and policy claims distinct. |
| Classical AI | MIT [6.034 Artificial Intelligence syllabus](https://ocw.mit.edu/courses/6-034-artificial-intelligence-fall-2010/pages/syllabus/) | Confirms that classical AI normally combines problem solving, representation, and code-supported work; Atlas adapts that to original traces, design review, and bounded fixtures. |
| Workload / prerequisite check | Georgia Tech [CS 6601 Artificial Intelligence](https://omscs.gatech.edu/cs-6601-artificial-intelligence) | Confirms the relevant prerequisite family—algorithms, Python, calculus, probability, linear algebra, and substantial program reading/modification—and that a six-session core cannot claim a full AI course survey. |

## Findings against the actual packs

| Pack | Aligned | Deliberately adapted | Genuine learner-route gap |
| --- | --- | --- | --- |
| **M33 — Formal Languages, Computability & Complexity** | The workbook and delivery map form a sound chain: formal objects and syntax/semantics; finite-state construction and a nonregularity argument; decider/recognizer and halting boundary; directed reductions; then P/NP claim discipline. It requires definitions, assumptions, counterexamples, proof skeletons, bounded code traces, and a defended claim packet. | It replaces a term-long proof/problem-set sequence with original, small proof reconstructions, prediction, code reading, and an oral explanation. CFG/PDA depth, pumping-lemma variants, circuits, randomness, cryptography, and quantum topics remain deliberately outside this six-session core. That is an honest scope choice, not a defect. | No further local content change is warranted. The shared M31–M36 continuation card now supplies the Session 2–6 Study Partner → TA workflow; live delivery/review evidence remains separate. |
| **M34 — Classical AI: Search, Constraints & Decision** | The workbook correctly makes state formulation precede algorithm choice, then separates search conditions, CSP locality, relaxation/bound direction, planning/solver status, and decision/authority. Its fixed A* counterexample, CSP/relaxation reasoning, and two-stage Bellman contrast are appropriate understanding-first evidence. | It deliberately does not try to reproduce a full CS188/6.034/CS6601 sequence of large programming assignments, adversarial-game methods, logical inference, graphical models, or RL. The bounded fixtures are inspection aids, not general solvers or deployment claims. | The final decision artifact now makes its one-shot-versus-sequential scope durable: a sequential claim carries state, action, transition, reward/cost, horizon, and continuation-policy fields; a one-shot claim explicitly withholds those claims. |

## Resolved lean revisions

1. **Shared Session 2–6 chat route.** The private guided route now has one
   reusable M31–M36 continuation card: Sessions 2–5 produce a prediction,
   confidence, named output, assumption/non-claim, and optional non-grading TA
   checkpoint; Session 6 leads to the supportive oral defense. It avoids six
   redundant per-module tables while preserving the M33 → M34 bridge. M34
   Session 4 already names M33 as an academic prerequisite and applies its
   reduction/encoding discipline before a solver-status or complexity claim.

2. **Durable decision-model boundary.** M34's Session 5 card and Session 6
   dossier now require a `one-shot` or `sequential` label. A sequential claim
   must name state, action, transition, reward/cost, horizon, and continuation
   policy; a one-shot claim must say it does not establish a transition model
   or policy. This is a narrow evidence repair, not an MDP/RL unit or a
   decision-authority claim.

## Bounded conclusion and open evidence

No wholesale M33 or M34 content expansion is indicated by this calibration.
Their mathematical and classical-AI cores are connected, rigorous for the
stated accelerated role, and intentionally narrower than the cited term-long
courses. The two lean revisions above improve delivery continuity and final
decision-model evidence; they do not close release blockers.

M33 and M34 remain authoring-only. This note does not prove a reviewed learner
contract, selected canonical source map, accessible live/chat rendering,
actual TA or Study Partner delivery, Notion write, human pilot, CI/deployment
record, university-course equivalence, or learner mastery. Those require
separate evidence before either module may be represented as published or
complete.
