# Module 34 — Classical AI: Search, Constraints & Decision: Primary-Source Research

## Status, scope, and non-publication boundary

**Status:** instructor-facing, **authoring-only** research input for planned
Module 34. It is not a learner workbook, structured module contract,
release-input record, review approval, provenance ledger, deployment record, or
publication decision.

The canonical course graph still describes M34 as authoring-only, with its
source map unset, planned release evidence, and unmet source and release
blockers. This document does **not** change the graph, manifest, route,
navigation, availability, prerequisite policy, contract state, deployment,
Notion workflow, or learner access. It does not make M34 navigable,
review-ready, released, or a prerequisite a learner can satisfy. In
particular, it does not unlock M35, M25, or M26.

**Research access dates:** S34-01 through S34-12 were accessed on 2026-07-31;
S34-10 and S34-13 were rechecked on 2026-08-01; targeted authoring-calibration
routes S34-14 through S34-17 were checked on 2026-08-02. This note uses original
papers, an original primary work, official documentation/repositories, or official
standards guidance only. It is link-and-original-paraphrase research. Atlas
must not copy source prose, pseudocode, figures, tables, benchmark results,
datasets, branding, or code into a future learner asset without a separate
asset-level reuse review. A source that is openly reachable is not automatic
permission to reproduce it. Publisher pages, framework documentation, and
standards also change; a future release must recheck exact versions, terms,
and stable links.

Nothing below proves that a future search implementation is correct, that a
heuristic is safe, that a solver found an optimum, that a plan is feasible in a
physical setting, that an expected-utility model represents affected people,
or that a computed recommendation has authority to act. Those are separate
mathematical, implementation, empirical, and governance questions.

## The connected teaching argument

Module 34 is not a catalogue of named algorithms or a claim that “AI decides.”
It develops one connected chain:

~~~text
narrative need and accountable decision owner
  -> stated variables: state, observation, action, transition, goal, cost
  -> explicit constraints, uncertainty model, and values/utility boundary
  -> exact search / heuristic / CSP / planner / relaxation choice
  -> theorem conditions, implementation contract, and bounded experiment
  -> result, certificate or limitation, counterexample, and human review point
  -> limited handoff to M35 representation and learning
~~~

**Text alternative:** A problem does not become well-defined because a solver
accepts an input file. First describe what counts as a state, which actions are
legal, what can be observed, what success and cost mean, and who is permitted
to revise those choices. Only then choose a search or constraint method. A
proof may establish a property of that formal model under named assumptions; a
run may establish only a finite observation of one implementation. Neither
settles whether the model omitted a harm, captured someone’s utility, or is
authorized for a consequential action.

The module preserves the course’s AI-era reasoning philosophy: an agent can
propose formulations, traces, tests, and code changes, but the learner must
read the representation, reconstruct the invariant, seek a counterexample,
and state what evidence does and does not support. Code writing is useful only
after the model and evidence boundary are understood.

## Exact canonical bridge and forward handoff

This research routes evidence through the checked-in M34
"m31-m36-prerequisite-session-bridge.v1.json" plan. It does not modify that
plan or replace its prerequisite evidence.

| Incoming module and inherited evidence | First canonical consuming session | M34 use | Required artifact boundary |
| --- | --- | --- | --- |
| **M10 — Graphs and networks**: graph representation, reachability, traversal frontier, shortest-path relaxation, dependency order | **M34-S01** | Make a narrative state/action model explicit before treating it as a graph. | The state-space model card names representation alternatives and failure cases; it is not proof that a graph captures the world. |
| **M11 — Algorithms**: exhaustive/heuristic/dynamic/backtracking/randomized structure and proof obligations | **M34-S02** | Match frontier policy, heuristic condition, and proof obligation to a stated objective. | The search-strategy evidence table distinguishes a valid theorem scope from an observed run. |
| **M30 — Probability and scientific inference**: conditional models, expectation, uncertainty, estimation, experiment criticism | **M34-S05** | Separate belief model from utility/loss and the allowed action set. | The decision-under-uncertainty card records sensitivity and unmodeled outcomes; it is not a warrant for a decision. |
| **M31 — Optimization and information**: objective, feasible set, dual/relaxation view, convergence/approximation scope | **M34-S03** | Compare a CSP or planning objective with a relaxation without hiding which problem changed. | The constraint-objective-relaxation sheet labels feasibility, bound direction, and trade-off; a relaxed answer need not be implementable. |
| **M33 — Formal languages, computability, and complexity**: formal statement, reduction, decidability/complexity scope | **M34-S04** | Use encoding and worst-case limits as modeling evidence, not as a blanket practical verdict. | The CSP-limit claim card names the encoded problem, transformation direction, theorem, and practical non-claim. |

The sole declared forward handoff is **M35 — Machine Learning &
Representation**. M34 passes the exact planned
**problem-formulation packet**: state/representation, objective/constraints,
search or solver rationale, uncertainty model, and limit/human-impact
boundaries. M35 must not treat this packet as data quality, learned-model
validity, calibration, deployment authorization, or an M34 release signal.

## Primary-source ledger and reuse boundary

Entries S34-01–S34-12 were accessed on 2026-07-31; S34-10 and S34-13 were
rechecked on 2026-08-01; S34-14 through S34-17 were checked on 2026-08-02.
“Link-only/original paraphrase” is intentional even when a project repository
has an open-source license:
documentation, examples, figures, test data, and third-party portions can have
different rights. Each future learner-facing claim must pin the exact source
revision or edition it relies on.

| ID | Primary or official source and stable learner-facing link | Owner | Narrow authoring use | License / reuse status |
| --- | --- | --- | --- | --- |
| S34-01 | E. W. Dijkstra, [“A Note on Two Problems in Connexion with Graphs”](https://doi.org/10.1007/BF01386390) (1959) | Original author; Springer-hosted journal record | Historical primary source for a shortest-path formulation and the need to state weight assumptions. It supports a source-reading contrast with M10/M11, not a copy of the algorithm. | Publisher-hosted original. No reusable Atlas asset is assumed; link/cite and write original derivations/fixtures only. |
| S34-02 | P. E. Hart, N. J. Nilsson, and B. Raphael, [“A Formal Basis for the Heuristic Determination of Minimum Cost Paths”](https://doi.org/10.1109/TSSC.1968.300136) (1968) | Original authors; IEEE | Primary source for the relationship between path cost, heuristic estimates, admissibility/monotonicity terminology, and stated optimality conditions. | IEEE-published original. Link-only/original paraphrase; do not reproduce diagrams, prose, or pseudocode. Recheck edition/correction details before a theorem card. |
| S34-03 | A. K. Mackworth, [“Consistency in Networks of Relations”](https://doi.org/10.1016/0004-3702(77)90007-8) (1977) | Original author; Elsevier/Artificial Intelligence | Primary source for CSP relation-network framing and node/arc/path consistency as preprocessing/inference rather than a universal solution certificate. | Elsevier-published original. Link-only/original examples and diagrams; no source-asset reuse assumed. |
| S34-04 | R. E. Fikes and N. J. Nilsson, [“STRIPS: A New Approach to the Application of Theorem Proving to Problem Solving”](https://doi.org/10.1016/0004-3702(71)90010-5) (1971) | Original authors; Elsevier/Artificial Intelligence | Primary source for a planning representation with actions, preconditions, effects, and search over formalized problem states. | Elsevier-published original. Link-only/original planning fixtures; not a license to import the paper’s examples or figures. |
| S34-05 | M. Fox and D. Long, [“PDDL2.1: An Extension to PDDL for Expressing Temporal Planning Domains”](https://doi.org/10.1613/jair.1129) (2003) | Original authors; Journal of Artificial Intelligence Research | Primary source for the fact that a planning language’s semantics and expressivity matter when time, numeric quantities, and resources are introduced. | Journal/original paper. Atlas remains link-only/original-paraphrase; review the exact article’s current reuse terms before any asset reuse. |
| S34-06 | Google, [OR-Tools CP-SAT solver documentation](https://developers.google.com/optimization/cp/cp_solver), [source documentation index](https://github.com/google/or-tools/tree/stable/ortools/sat/docs), and [repository license](https://github.com/google/or-tools/blob/stable/LICENSE) | Google / OR-Tools contributors | Official implementation-facing contrast: a model declares variables, constraints, and optionally an objective; solver status and returned values must be interpreted through the API’s documented contract. | OR-Tools repository is Apache-2.0. Atlas uses link-only/original examples by default; direct source/code reuse requires preserving notices and separate package/version review. A solver API is not a correctness or legitimacy certificate. |
| S34-07 | CVXPY authors, [Disciplined Convex Programming tutorial](https://www.cvxpy.org/tutorial/dcp/) and [project license](https://github.com/cvxpy/cvxpy/blob/master/LICENSE) | CVXPY contributors | Official contrast between mathematical convexity, a DCP grammar’s acceptance/rejection, and solver invocation; supports an implementation-reading exercise about relaxations. | CVXPY is Apache-2.0. Link-only/original examples and original mathematical diagrams; verify dependencies and notices before any reuse. DCP acceptance does not validate a decision model. |
| S34-08 | J. von Neumann and O. Morgenstern, [*Theory of Games and Economic Behavior* publisher-hosted original-work material](https://assets.press.princeton.edu/about_pup/PUP100/book/2cNeumann.pdf) (1944) | Original authors; Princeton University Press | Primary foundational work for the conditional claim that, under named preference axioms and a stated lottery model, expected-utility representation is a mathematical model of preference. | Publisher-hosted material. Link/cite and use original finite examples only; no text, tables, or figures may be copied without a separate rights review. |
| S34-09 | S. A. Cook, [“The Complexity of Theorem-Proving Procedures”](https://doi.org/10.1145/800157.805047) (1971) | Original author; ACM | Primary source for reduction-based complexity reasoning and the importance of the transformed decision problem’s precise definition. | ACM-published original. Link-only/original proofs and reductions; no source-text reuse assumed. |
| S34-10 | R. M. Karp, [“Reducibility Among Combinatorial Problems”](https://doi.org/10.1007/978-1-4684-2001-2_9) (1972) | Original author; Springer chapter record | Primary source for many-one reduction practice and why a classification is tied to an encoded problem family rather than a single solver run. | Publisher-hosted original. Link-only/original transformations and small instances. |
| S34-11 | NIST, [Artificial Intelligence Risk Management Framework (AI RMF 1.0), NIST AI 100-1](https://doi.org/10.6028/NIST.AI.100-1) and [official PDF](https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.100-1.pdf) | U.S. National Institute of Standards and Technology | Official guidance for treating human oversight, context of use, harms, accountability, and risk controls as design/review concerns rather than assuming a model output has authority. | Official NIST publication. Use link-only/original paraphrase pending asset-level review. It is voluntary framework guidance, not a legal determination or an authorization for any particular action. |
| S34-12 | MIT OpenCourseWare, [18.600 Probability and Random Variables lecture notes](https://ocw.mit.edu/courses/18-600-probability-and-random-variables-fall-2019/pages/lecture-notes/) | Massachusetts Institute of Technology | Official course source used only as a bridge back to M30 for finite expectation/conditional-probability notation; it does not supply M34’s decision-legitimacy claim. | MIT OCW materials are generally CC BY-NC-SA 4.0 subject to item notices. Atlas remains link-and-original-paraphrase; no copied notes, figures, or exercises. |
| S34-13 | Carnegie Mellon University, [07-280 AI/ML I Markov Decision Process notes](https://www.cs.cmu.edu/~07280/notes/mdps/index.html) | CMU course staff; official university-hosted course notes | Calibration for the structural distinction between a sequential MDP—states, actions, transition model, reward/objective, and policy—and a one-shot expected-utility table. | Course notes are linked for study only. No blanket asset-reuse permission has been recorded; Atlas uses original notation, examples, and boundary explanation. |
| S34-14 | MIT, [6.034 Recitation 6: Planning and Search](https://courses.csail.mit.edu/6.034s/handouts/spring12/recitation6-planning.pdf) | MIT course staff; official course handout | Direct support for deriving an admissible heuristic from a relaxed problem whose optimal cost is no larger than the original’s, including the deliberate omission of STRIPS delete lists. Supports a relaxed-heuristic audit with the changed problem made explicit. | Course handout is linked for calibration. No blanket asset-level reuse is inferred; Atlas uses **link-only/original paraphrase** and no copied exercises, diagrams, or code. |
| S34-15 | Stanford, [CS221 Course Scheduling assignment](https://web.stanford.edu/class/archive/cs/cs221/cs221.1192/assignments/scheduling/index.html) | Stanford course staff; official university-hosted course assignment | Direct code-reading calibration for backtracking over partial assignments, pruning a zero-contribution extension, and AC-3-style propagation after an assignment until domains stop changing. | Assignment is linked for study only. Atlas uses **link-only/original paraphrase** and must not reproduce its problem, code, tests, or solution structure. |
| S34-16 | MIT OpenCourseWare, [6.825 Lecture 10: Planning](https://ocw.mit.edu/courses/6-825-techniques-in-artificial-intelligence-sma-5504-fall-2002/1184a975225bdbab3e3d215bf173bde1_Lecture10FinalPart1.pdf) | MIT course staff; official graduate AI lecture note | Supports an explicit state-result relation, the frame problem, and STRIPS precondition/add/delete effects. It calibrates an original state-update card that labels persistence as a modeling convention instead of silently treating omitted facts as real-world invariants. | MIT OCW material is linked solely for calibration. Atlas remains **link-only/original paraphrase**; no copied slides, figures, examples, or prose without asset-level review. |
| S34-17 | Stanford, [CS221 Markov Decisions handout](https://web.stanford.edu/~cpiech/cs221/handouts/markovDecisions.html) | Stanford course staff; official university-hosted course handout | Direct support for auditing the Markov conditional-independence assumption, state/action/transition-model assumptions, and the finite-horizon versus specialized infinite-horizon distinction. | Course handout is linked for study. No blanket Atlas reuse permission is recorded; **link-only/original paraphrase** and independently authored examples only. |

### Targeted 2026-08-02 calibration routing

| Planned M34 addition | Claim-linked source route | Authoring boundary preserved |
| --- | --- | --- |
| Relaxed heuristics | S34-14 states the relaxation/optimal-cost relation and its delete-list example. | An original audit must name the original and relaxed action model, goal, and cost before transferring a lower-bound claim; it must not call a fast heuristic admissible from a run alone. |
| CSP partial-assignment search and propagation | S34-15 supplies a code-reading route from partial assignments through pruning to repeated domain propagation. | An original trace must show assignment and domain changes separately, and must not treat local propagation as a global-solution certificate. |
| Planning state update and frame convention | S34-16 covers result states, explicit effects, and the frame problem. | State which facts are added, deleted, retained, unknown, or out of model; no STRIPS convention becomes a claim about physical persistence. |
| MDP Markov and horizon audit | S34-17 makes the conditional-independence, discrete-state, known-start/legal-action, and horizon assumptions explicit. | An original audit must name state sufficiency, transition/reward model, horizon or return convention, and policy scope; it must not relabel a one-shot expected-utility table as a sequential policy. |

### What this ledger does not establish

No source row proves:

- that a learner’s representation has the right state variables, action
  semantics, cost units, constraints, observations, or utility;
- that an implementation’s queue ordering, duplicate-state policy, arithmetic,
  or termination behavior matches a theorem’s hypotheses;
- that a locally consistent CSP has a global solution, or that a solver
  status/result has any meaning beyond the exact documented API/run
  conditions;
- that a relaxation’s candidate can be executed in the original problem;
- that a probability model is calibrated, that a utility represents affected
  people, or that an expected value is the ethically or legally permitted
  action;
- that worst-case hardness predicts the observed difficulty of one instance;
  or
- that NIST guidance, an AI recommendation, or a human clicking “approve”
  supplies legitimate authority.

Those claims need independently reviewed formal statements, code/experiment
records, context-specific domain expertise, accountable decision ownership,
and—where applicable—legal, institutional, or consent-based authority.

## Definitions, assumptions, proof ideas, and counterexamples

The following is an authoring ledger. It gives a future instructor a compact
first-principles path, not a ready learner lesson or theorem proof.

| ID | Definition or narrow claim | Assumptions that must be made visible | Proof idea / inspection move | Required counterexample or boundary |
| --- | --- | --- | --- | --- |
| M34-C01 | A deterministic state-space model can be written as \(P=(S,A,T,s_0,G,c,O)\): states, actions, transition relation/function, initial state, goal predicate, path-cost rule, and observation model. | Specify whether the transition is deterministic/partial, whether action cost is additive, which facts are hidden/observed, the representation’s granularity, and which real-world factors are outside the state. | Derive two non-isomorphic state encodings for the same story, then trace how each changes legal actions and repeated-state detection. | A map location alone is not a state if key possession, fuel, time, or a safety condition changes future legal actions. A formal state is not evidence of a complete world model. |
| M34-C02 | Breadth-first search is a minimum-action-count procedure only for a stated unweighted/unit-step representation; uniform-cost search ranks frontier paths by accumulated stated cost. | State graph/tree search, duplicate policy, finite branching/termination conditions, edge-cost domain, queue ordering/tie behavior, and what “optimal” means. | For a finite graph with nonnegative costs, inspect the invariant that a removed lowest-cost path has no cheaper undiscovered competing path under the named implementation. | BFS can choose a two-edge route costing 200 over a three-edge route costing 3. A negative-cost edge invalidates the usual uniform-cost reasoning. A found path is not an optimality certificate when conditions are unstated. |
| M34-C03 | Let h-star(n) be the true least remaining cost in the stated model. A heuristic is **admissible** when it never exceeds \(h^*(n)\); a future card may additionally impose \(h(n)\ge0\) as a named convention. It is **consistent** when \(h(n)\le c(n,n')+h(n')\) for every stated transition, with \(h(g)=0\) for a goal. | Define goal set, reachable states, cost convention, finite/infinite setting, whether negative costs are prohibited, heuristic domain, and duplicate/reopen policy. | From consistency, derive \(g(n)+h(n)\le g(n')+h(n')\) along a transition; then identify which A* graph-search closed-set argument relies on that monotonicity. A future theorem card must name its exact A* variant. | A heuristic can be admissible yet inconsistent; a no-reopen implementation needs stronger conditions than merely “it seemed to work.” An overestimating heuristic may find a route quickly but forfeits the claimed optimality guarantee. |
| M34-C04 | A finite CSP is \((X,D,C)\): variables, domains, and constraints over subsets of variables. Local consistency removes values/tuples that lack required local support. | Name variables, finite domains, relation arity, propagation rule, search branching, and whether the task is feasibility, enumeration, or optimization. | Read a propagation trace: for each value removed, identify the supporting constraint and witness that disappeared. Separate a sound local pruning step from a global solution proof. | Three variables, each with domain {red, blue}, joined in an odd cycle with pairwise “different” constraints can be arc-consistent while globally unsatisfiable. Local consistency is not a general global-satisfiability certificate. |
| M34-C05 | A classical planning model associates action preconditions/effects with a formal state and seeks a sequence satisfying the stated goal. STRIPS/PDDL syntax or a planner input is a representation, not reality. | Specify closed/open-world convention, action duration/resource semantics, concurrency, exogenous events, observation/replanning policy, and whether action effects are complete. | Compare an action model before and after adding a resource or temporal precondition; identify which previous plan becomes invalid because the formal language changed. | A plan valid under instantaneous, deterministic actions need not remain valid when fuel, time, interaction, or an unmodeled event is introduced. PDDL acceptance is not field feasibility. |
| M34-C06 | For a minimization problem, relaxing constraints enlarges the feasible region: if \(F\subseteq F_{\mathrm{relax}}\) and the objective is unchanged, then \(\inf_{x\in F_{\mathrm{relax}}} f(x)\le\inf_{x\in F} f(x)\). The relaxed value can be a lower bound; its candidate need not lie in \(F\). For maximization the bound direction reverses. | Name optimization direction, objective, all original/relaxed constraints, feasibility tolerance, integrality/domain, solver status, and whether a rounding/repair map preserves constraints. | Draw nested feasible regions and check membership before comparing values. Ask the learner to label a number as feasible objective, bound, surrogate score, or unsupported claim. | Dropping integrality can return x=1/2 for a binary decision. Penalizing a hard constraint changes the problem unless an exact-equivalence condition is proved. |
| M34-C07 | A reduction/complexity statement classifies a precisely encoded problem family under a named resource model; it does not directly predict one instance’s runtime or usefulness. | State decision/optimization/search formulation, input encoding/size measure, transformation direction, correctness of the transformation, complexity class, and theorem scope. | Make the learner write x -> f(x), then show both directions of the yes/no preservation required by the named reduction before applying any class label. | “NP-complete” does not mean no useful heuristic, bound, special case, or small-instance solution exists. A timeout does not prove infeasibility, unsatisfiability, or hardness. |
| M34-C08 | Under a stated finite belief model, action set, and utility/loss function, a decision rule may compare \(EU(a\mid e)=\sum_s p(s\mid e)u(a,s)\). That is a conditional mathematical ranking, not a discovered moral fact or a sequential MDP policy. | Name state/outcome space, conditioning evidence, probability source/uncertainty, utility elicitation/scale, action constraints, affected stakeholders, omitted outcomes, and sensitivity ranges. For an MDP claim additionally name the state/action model, transition distribution, reward/cost, horizon or return objective, and policy class. | Change one probability, utility, or feasible action at a time; distinguish a change in belief from a change in value. Then contrast the terminal one-shot table with a policy that must act after a named transition. | The most probable state need not imply the action with highest expected utility. Repeating a one-shot selector does not itself supply a transition model, long-run objective, or valid policy. A utility table built by one operator cannot be presented as consent, fairness, or collective legitimacy. |
| M34-C09 | A search, CSP, planner, or expected-utility system can recommend a candidate only inside its declared technical and governance envelope. Human oversight must be designed as accountable review, intervention, escalation, and evidence—not ceremonial approval. | Name decision owner, authority source, use context, affected parties, harm/rights constraints, allowed automation level, abstention/escalation rule, logging/redaction, appeal/revision path, and evaluation conditions. | Ask “who may change this objective, veto this action, and investigate this failure?” Then inspect a counterfactual where the recommendation is numerically strong but violates a hard policy or consent boundary. | An accurate or optimal result does not authorize a hiring, medical, financial, safety, disciplinary, or other consequential action. NIST AI RMF guidance is not a legal decision or a substitute for domain governance. |

### Precision notes for future theorem cards

1. Do not write “A* is optimal” without the graph/tree variant, cost domain,
   heuristic condition, termination condition, duplicate policy, and whether
   nodes may be reopened. The source history is useful; the learner-facing
   proof must be an original, scoped derivation.
2. Do not write “consistent means admissible” without stating a goal/terminal
   condition and the transition model. The useful consequence to derive is the
   nondecreasing f=g+h condition along each declared edge.
3. Do not write “arc consistency solves a CSP.” It can be a sound local
   pruning procedure and still leave a globally impossible problem.
4. Do not write “the solver says optimal.” Read the documented status,
   objective/bound fields, limits, tolerance, model version, and the external
   semantics of the variables before making a smaller claim.
5. Do not turn a utility calculation into an instruction that a person must
   accept. Preferences, stakeholders, rights, policy, and authority are not
   latent variables the optimizer can infer without accountable process.

## Likely six-session source routing

This table follows the exact canonical M34 session spine. It is a planning map
only: it creates no workbook, studio, diagnostic, review record, TA package,
Study Partner package, oral-defense runtime, or release evidence.

| Canonical session and prerequisites | Source route | Understanding-first / code-reading move | Planned evidence and explicit non-claim |
| --- | --- | --- | --- |
| **M34-S01 — Problem formulation: states, actions, goals, costs, and observations** (**M10**) | S34-01, S34-04, S34-05 | Start with a small original “archive retrieval” story. Before an algorithm name appears, ask the learner to mark what must be a state feature, which action has a precondition, and what observation fails to reveal. Compare two encodings and debug a missing key/energy variable. | **State-space model card.** It does not assert that the story’s state/cost/goal captures a real operating environment or chooses a search method. |
| **M34-S02 — Search strategies, heuristics, and evidence of completeness or optimality** (**M10, M11**) | S34-01, S34-02 | Code-read original trace tables for BFS, uniform-cost, and A*; predict the next frontier before reveal. Require a heuristic audit against a tiny exact-distance oracle and identify whether a no-reopen implementation can rely on consistency. | **Search-strategy evidence table.** It does not claim universal completeness/optimality, a speedup, or correctness outside the named finite model and implementation. |
| **M34-S03 — Constraints, optimization, relaxations, and explanation** (**M11, M31**) | S34-03, S34-06, S34-07 | Read a deliberately flawed original scheduling model. Classify variables, domains, hard constraints, objective, and relaxed constraints before seeing a solver call. Diagnose a fractional or penalized answer that is attractive but unusable. | **Constraint-objective-relaxation sheet.** It does not equate a solver status, DCP check, relaxation bound, or rounded candidate with feasibility in the original problem. |
| **M34-S04 — Planning/CSP limits: encoding, reductions, and solver boundaries** (**M33**) | S34-03–S34-05, S34-09, S34-10 | Give a tiny planning/CSP encoding and a claimed reduction. Ask the learner to find the missing transformation direction or input-size assumption, then distinguish timeout, infeasible, unknown, and unmodeled cases. | **CSP-limit claim card.** It does not infer practical impossibility, unsatisfiability, or a M33 prerequisite completion from one code run. |
| **M34-S05 — Uncertainty, utility, and decision under incomplete information** (**M30, M31**) | S34-08, S34-11, S34-12, S34-13 | Work through a finite original belief/utility table. Ask for a prediction before changing one likelihood, one utility, or one action constraint; then show why maximum a-posteriori state and maximum expected utility can differ, and why a one-shot table is not a sequential MDP policy. | **Decision-under-uncertainty card.** It does not claim calibrated beliefs, valid utility elicitation, social agreement, fairness, consent, authority to act, or an MDP/policy result. |
| **M34-S06 — Classical AI design dossier and oral defense** (**M10, M11, M30, M31, M33**) | S34-01–S34-12 | Assemble one narrow original model. The learner reads an AI-generated candidate formulation critically, repairs one hidden assumption, produces a counterexample, and explains when to abstain/escalate. The future TA oral defense uses supportive prompts, hints, and transfer rather than pass/fail framing. | **Classical AI Search, Constraints & Decision Dossier and learner-controlled oral-defense summary.** It is neither an automatic unlock nor evidence of a live chat, a deployed feature, expert sign-off, or real-world decision approval. |

Each future session must contain prediction before reveal, a compact
first-principles explanation, reading/debugging/design inspection, a
counterexample, retrieval and spaced-review prompts, a transfer task, and a
learner-controlled artifact. An AI agent may offer hypotheses; it cannot
silently fill missing assumptions or turn an answer into evidence.

## Misconception and repair map

| Likely misconception | Productive correction / retrieval prompt |
| --- | --- |
| “Every planning problem is just a shortest path on a fixed graph.” | Ask which state variables, action effects, observations, resources, and objectives changed the graph itself. |
| “A heuristic is admissible because it is clever or fast.” | Ask for h-star, the inequality to check, the goal/cost definition, and one state that would falsify the bound. |
| “If A* returned a route, it proved it was best.” | Ask which A* variant ran, whether its heuristic and duplicate policy satisfy the stated theorem, and what the run itself observed. |
| “Arc consistency means the schedule is solvable.” | Use the odd-cycle two-color counterexample and ask for the distinction between local support and a full assignment. |
| “A solver’s status string means the model is right.” | Separate API status, model feasibility, objective/bound evidence, external semantics, and decision authority. |
| “A relaxation gives a legal answer to the original problem.” | Require the learner to test the candidate against every original constraint before interpreting its objective value. |
| “NP-complete means we should give up.” | Ask for the encoded problem, size regime, special structure, approximation/bound needs, and the exact result a practical system needs. |
| “The most likely state tells us what action to choose.” | Have the learner change action costs/utilities while holding posterior beliefs fixed, then observe the choice can change. |
| “Expected utility objectively discovers what people value.” | Ask who supplied utility, which stakeholders/outcomes were omitted, whose authority constrains actions, and how disagreement is handled. |
| “Human oversight means a person presses approve after the model speaks.” | Ask who can intervene, veto, appeal, correct data/model assumptions, and accept accountability at the actual decision point. |

## Bounded project and numerical-experiment plan

The intended future project is a **synthetic archive-retrieval and
maintenance-scheduling dossier**, not an automation demo. The setting contains
only invented rooms, labelled boxes, resource slots, and an explicitly
synthetic noisy observation; it must not make decisions about real people or
operate physical equipment.

The dossier would require these original learner artifacts:

1. a state/action/observation/goal/cost card with an explicit omitted-factor
   list;
2. a small finite graph with a verified exact-distance oracle for selected
   states;
3. a search table comparing one uninformed and one heuristic method, including
   queue/frontier semantics, heuristic condition, expanded-state count, and
   a counterexample;
4. a small CSP with variables/domains/constraints, a propagation trace, and
   one globally inconsistent yet locally supported comparison;
5. an optimization/relaxation sheet with original and relaxed feasible sets,
   objective/bound direction, candidate feasibility check, and repair/nonclaim;
6. a finite belief/utility/action table with one sensitivity analysis and a
   named abstention/escalation condition;
7. a formal-limit card naming the exact encoded decision problem, a reduction
   or theorem pointer, a practical mitigation, and what the result does not
   tell us; and
8. a learner-controlled, short oral-defense evidence summary for a supportive
   Codex Teaching Assistant session, plus a handoff packet for M35.

### Experiment and project non-claims

Even if every artifact is internally consistent, it must **not** claim:

- that an implementation is generally faster, complete, optimal, sound, or
  robust beyond its stated inputs, version, arithmetic, and theorem
  conditions;
- that one search trace establishes a computational-complexity result;
- that a planner’s action model predicts physical execution, safety, or
  resource availability;
- that a toy probability table is calibrated or that a toy utility table
  represents real people;
- that an objective has captured rights, fairness, consent, or all harms;
- that a student, TA, Study Partner, model, or portal may authorize an external
  action; or
- that the oral discussion is an examination, grade, pass/fail gate, or proof
  of mastery.

Any future numerical experiment must record the exact model, source revision,
language/runtime/package versions, input generation, queue/tie policy,
randomness/seed, numerical type/tolerance, termination/limit parameters,
semantic oracle, raw observations, comparison condition, and alternative
explanations. The portal and portable copied prompts keep this record
local-first; only the designated Codex chats may create at most one bounded
concise Notion session note under the active policy. That note must not contain
a raw transcript and no saved-note claim is valid without direct evidence.

## Research gaps and release blockers this file does not close

1. **Canonical source map remains null.** This research is not yet the
   graph-bound, structured M34 source ledger required by the module contract.
   Every learner-facing claim needs a reviewed source/claim link, stable pin,
   reuse record, and release evidence.
2. **M33 prerequisite evidence remains unavailable.** M34’s formal-limits
   session cannot pretend that the learner has satisfied authoring-only M33;
   future route gating must preserve that academic prerequisite.
3. **No reviewed M34 module contract exists.** A private M34 workbook now
   contains six draft sessions, diagnostics/retrieval, a dossier rubric, and
   TA/Study Partner oral material. Its prerequisite/forward map, source
   binding, accessibility review, module contract, and release evidence are
   still not canonical learner-route or publication evidence.
4. **No tested learner studio exists.** A local deterministic fixture/test now
   makes two declared frontier-policy and binary-relaxation decisions
   inspectable, without accepting learner code or acting as a general solver.
   It is not a browser-accessible search/CSP/decision studio with a full input
   allowlist, accessibility review, and failure-mode documentation. A future
   studio must not execute arbitrary code or access undeclared network, package,
   credential, or filesystem capabilities.
5. **No theorem or solver validation has occurred.** Future cards must
   independently test the exact A*/CSP/planner/relaxation implementation
   against a reference oracle and stated theorem hypotheses. A copied
   “standard algorithm” is not verification.
6. **No decision-governance review has occurred.** Utility elicitation,
   stakeholder impact, authority, oversight, escalation, appeal, policy,
   privacy, and lawful context need domain-specific review; NIST guidance does
   not supply it.
7. **No accessibility or live-learning evidence exists.** This note does not
   provide diagrams with text alternatives, keyboard/screen-reader checks,
   readable equation/code whiteboards, GPT Live availability, or equivalent
   accessible text conversation.
8. **No privacy, Notion, deployment, CI, GitHub provenance, or release
   evidence exists.** This authoring note changes none of the local-first
   consent boundary, release-input hashes, CI results, GitHub review state, or
   deployed private portal.
9. **M25/M26 remain preview-only.** This research cannot reweave synthesis or
   lift the M31–M36 completion gate.

## Authoring checklist before M34 can be reviewed

- [ ] Recheck every primary/official source URL, edition/revision, access date,
      publisher/project reuse terms, and any third-party asset notices.
- [ ] Create a contract-bound source ledger that maps each lesson claim,
      formula, code sample, diagram, and experiment to a source or original
      derivation and records its non-claim.
- [ ] Author original, accessible state-space, frontier, CSP, relaxation, and
      decision diagrams with adjacent concise prose alternatives; do not use
      screenshots or copied textbook figures.
- [ ] Implement small deterministic reference models/oracles and regression
      tests for edge costs, duplicate policy, heuristic condition, CSP
      propagation, solver status, bound direction, and utility sensitivity.
- [ ] Make every solver interaction input-bounded, versioned, local-first,
      safe to cancel, and explicit about capacity/resource limits.
- [ ] Build confidence-aware diagnostics and retrieval that ask learners to
      diagnose assumptions and counterexamples, rather than recognize names.
- [ ] Provide a supportive, adaptive oral-defense protocol through the Codex
      Teaching Assistant and an equivalent accessible text workflow, with
      readable code/equation/diagram whiteboard conventions. It must produce a
      learner-controlled evidence summary rather than a pass/fail verdict.
- [ ] Keep M34 authoring-only until its canonical contract, route gating,
      accessibility, privacy, provenance, CI, GitHub commit/review evidence,
      and honest release status are independently verified.

This note intentionally leaves M34’s source-map and release blockers open. Its
contribution is a connected, source-conscious authoring path that preserves
formal rigor while refusing to turn a model, computation, or recommendation
into unsupported authority.
