# Module 34 — Classical AI: Search, Constraints & Decision

**Hidden review candidate — not learner-delivered.** This is the fixed
learner-material scope for a future qualified review. M34 remains
authoring-only, hidden from the reader manifest, and unrecorded for release.
This file does not change the course graph, availability, prerequisite policy,
source-map binding, release state, publication claim, or Core credit. It does
not satisfy or bypass M33, open M35, or grant authority to a solver.

**Knowledge arc:** systems, formal reasoning, and AI-era design

**Academic prerequisites:** M10 graphs and networks; M11 algorithms; M30
probability and scientific inference; M31 optimization and information; M33
formal languages, computability, and complexity.

**Primary outcome:** You can formulate a small search, constraint, planning,
or decision problem before choosing a method; read a frontier/solver trace
without overstating it; reconstruct theorem assumptions and counterexamples;
and explain where a formal recommendation stops and accountable human review
begins.

This module is not a promise that a toy graph, CSP, utility table, planner, or
solver status models an outside world correctly. It is a foundation for
reading, debugging, and directing classical AI systems before neural or agent
methods are introduced.

---

## How this module stays connected

### The working invariant

> A classical AI recommendation is only as good as its declared
> **representation**, **allowed actions**, **objective/constraints**,
> **uncertainty model**, **algorithm conditions**, **finite evidence**, and
> **accountability boundary**.

~~~mermaid
%% atlas-diagram-id: m34-classical-ai-evidence-route
%% atlas-diagram-title: The M34 route from a narrative to a bounded decision claim
%% atlas-diagram-alt: An accountable owner turns a narrative into states, observations, actions, goals, costs, constraints, and utilities. A search, CSP, planner, relaxation, or decision calculation is checked against theorem and implementation conditions. The result becomes a bounded recommendation with an abstention or review point, not automatic authority.
flowchart LR
  A["Narrative and accountable owner"] --> B["State, observation, action, goal, cost"]
  B --> C["Constraints, uncertainty, and utility boundary"]
  C --> D["Search, CSP, planner, or decision method"]
  D --> E["Theorem conditions + implementation trace"]
  E --> F["Bounded recommendation, abstention, or review"]
~~~

**Text alternative:** Begin with a person accountable for the formulation.
Make the state, observations, legal actions, goal, costs, constraints, and
uncertainty visible. Then choose an algorithm and state its mathematical and
implementation conditions. A finite run can support a bounded observation; it
does not establish that the representation captured reality, that a utility
table represents affected people, or that a result is authorized to act.

| Earlier learning | M34 reuses it for | M34 adds |
| --- | --- | --- |
| M10 | graphs, reachability, frontiers, shortest-path relaxation | state representations and their missing-variable failures |
| M11 | algorithm design, invariants, complexity, reductions | evidence tables for search/CSP/planning claims |
| M30 | conditional probability, expectation, uncertainty, experiment criticism | a belief-versus-utility decision card |
| M31 | objective, feasible set, relaxation, finite convergence evidence | a constraint/objective/relaxation sheet |
| M33 | encodings, reductions, formal limits, practical non-claims | a solver-limit and complexity boundary card |

### Claim/source labels

Compact labels such as `M34-C01 -> S34-01, S34-04–S34-05, S34-18` point to the
relevant claim and original/official reading route in the [M34 candidate source
ledger](../source-maps/module34_classical_ai_search_constraints_decision.md).
They are navigation aids, not borrowed proof text, a canonical graph
source-map binding, or release evidence: the named assumptions, original
derivation, and non-claim still control what may be concluded.

### Core evidence card

Use this before, during, and after a calculation.

~~~text
Decision owner and synthetic/non-consequential setting:
State, observation, action, transition, goal, and cost:
Constraints, domains, and omitted variables:
Search/CSP/planning/decision method and exact variant:
Decision-model scope: one-shot or sequential; if sequential, state/action/transition/reward-horizon-policy:
Theorem assumptions and implementation choices:
Fixture, queue/tie/seed/tolerance/time-limit details:
Observed trace, certificate, bound, or explicit unavailable evidence:
Counterexample and practical non-claim:
Abstention, escalation, or review point:
Forward handoff:
~~~

---

## Prerequisite retrieval

Answer briefly before looking back. Repair is directional, not punitive.

1. Why can two graph encodings of one story produce different legal paths?
2. Under what edge-cost and duplicate-policy conditions is a search
   optimality claim meaningful?
3. For a minimization problem, how does relaxing constraints change the
   feasible region and bound direction?
4. Why can a most-probable state imply a different action than a
   maximum-expected-utility choice?
5. What exact formal object must a complexity or reduction claim name?

Bridge through M10/M11 for 1–2, M31 for 3, M30 for 4, and M33 for 5. Do not
begin by importing a solver library.

---

## Session 1 — Model a state before searching it

**Launch:** With the Study Partner, list the state variables, actions, costs, observations, and one omitted factor before choosing a search method.

### Core question

**What information must be in a state for an algorithm to make a valid next
move in the model?**

**Claim/source trace:** `M34-C01 -> S34-01, S34-04–S34-05, S34-18` — the state,
actions, costs, observations, and planning representation need declared
omissions before an algorithmic claim can be read.

Use a fictional, non-consequential archive-retrieval setting. There are three
rooms: Entry, Vault, and Exit. A learner must retrieve a labelled box from the
Vault, but the Vault door requires a key and moving consumes one unit of
energy. The only observable signal is a light that says whether the key rack
appears occupied; it may not reveal the actual key state.

A state-space model can be written as

\[
P=(S,A,T,s_0,G,c,O),
\]

where \(S\) is the state set, \(A\) legal actions, \(T\) transition relation,
\(s_0\) initial state, \(G\) goal predicate, \(c\) path cost, and \(O\)
observation model.

### Prediction before reveal

Compare these two state encodings:

\[
s_{\mathrm{thin}}=(\text{room}), \qquad
s_{\mathrm{useful}}=(\text{room},\text{has\_key},\text{energy}).
\]

Predict which encoding can tell whether “open Vault” is legal after visiting
the same room twice with different resources.

<details>
<summary>Reveal after writing your prediction.</summary>

**Reveal:** room alone is not sufficient. If possession or energy changes the
future legal actions, the two histories cannot be safely merged as one graph
node. The useful state does not prove the model is complete; it exposes the
variables it has chosen to retain.

</details>

### World, observation, and belief are different objects

The phrase “the light says the rack is occupied” hides three different
objects. A **world state** records what is true in the declared model, such as
`key-at-rack`. An **observation** records what the agent receives, such as
`key-rack-light=lit`. A **belief state** would summarize uncertainty over
possible world states after a declared prior and observation-update rule.
Do not silently replace any one with another.

Inspect `m34ObservationBoundaryCard()`. Its two synthetic worlds have the
same `lit` observation, but `take-key` is legal in only one. Predict whether
the light alone can be used as the `take-key` precondition.

<details>
<summary>Reveal after writing your prediction.</summary>

**Reveal:** no. The observation is compatible with both a present key and an
absent key. A fully observable model must retain `key-at-rack`; a partially
observable model must also declare how observations update belief and when
feedback arrives. This card supplies neither a probability model nor an
update rule.

</details>

### Logic / representation boundary — one countermodel, not a logic unit

The same card evaluates the one propositional claim
`light-lit -> key-at-rack` in its two declared worlds. The
`key-absent-light-lit` world is a countermodel: its light is lit while the key
is absent, so the implication is false. This is a compact finite
model-checking boundary for inspecting a representation claim. It is not a
resolution procedure, a first-order logic survey, a general model checker, or
evidence that a real sensor is reliable.

### Code-reading and debugging task

Read this candidate successor function before fixing it:

~~~python
def successors(state):
    room, has_key = state
    if room == "Entry":
        return [("Vault", has_key)]
    if room == "Vault" and has_key:
        return [("Exit", has_key)]
    return []
~~~

What is omitted? Energy is missing from the representation, transition, and
cost. The function may return a route that violates the declared resource
rule. Merely adding a cost number outside the state would not repair repeated
state detection: two visits to Vault with different remaining energy have
different futures.

### Representation comparison

| Encoding choice | What it makes easy | What it can silently lose |
| --- | --- | --- |
| room only | a small graph drawing | key, energy, time, safety, or changing permissions |
| room + key + energy | legal-action checks and resource traces | uncertainty about the key rack or omitted external events |
| full physical narrative | realism in prose | a finite, inspectable algorithmic state space |

### Output: State-Space Model Card

Create a card for the archive story or another synthetic system:

1. state variables and units;
2. observations versus hidden facts;
3. actions, preconditions, effects, and costs;
4. goal predicate and an explicit omitted-factor list;
5. two alternative encodings and the behavior they change; and
6. one sentence beginning, “This state model does not establish …”

**Transfer:** M35 will need the same discipline when a learned representation
turns raw observations into features or states.

---

## Session 2 — Search traces need their theorem conditions

**Launch:** Trace one frontier policy, then name the cost, heuristic, duplicate-handling, and termination assumptions needed for its claim.

### Core question

**What does a frontier policy optimize, and under what assumptions?**

**Claim/source trace:** `M34-C02–M34-C03 -> S34-01–S34-02, S34-18` — frontier and
heuristic guarantees depend on named cost, duplicate, termination, and A*
variant conditions.

Take the finite graph:

~~~text
S --1--> A --10--> G
S --5--> B --1--> G
S --1--> C --1--> D --1--> G
~~~

Breadth-first search prefers fewer edges, so it can return \(S\to A\to G\)
with two edges and total cost 11 before it considers the three-edge route
\(S\to C\to D\to G\) with total cost 3. It is minimum action count only for
the stated unweighted/unit-step representation. Uniform-cost search (UCS)
ranks frontier paths by accumulated declared cost \(g\) and needs a
nonnegative-cost, well-defined duplicate/termination policy for its usual
guarantee.

### Completeness is not optimality

**Completeness** means a named search variant returns *some* solution when one
exists under its stated search-space, termination, duplicate-handling, and
fair-expansion conditions. **Optimality** means it returns a least-declared-cost
solution under its additional cost-domain, goal-test, heuristic, and reopen
conditions. A method can have one guarantee without the other, and a finite
trace establishes neither theorem by itself. Name which guarantee—if any—a
claim is using before you reuse it.

### Prediction before reveal

Suppose the frontier contains \(A\) with \(g=1\) and \(B\) with \(g=5\).
Predict what UCS expands first. Then imagine that the graph contains a
negative-cost edge discovered later. Which familiar proof step becomes
unavailable?

<details>
<summary>Reveal after writing your prediction.</summary>

**Reveal:** UCS expands \(A\) first. The proof that a removed lowest-cost path
cannot later be beaten depends on the named nonnegative-cost condition. A
negative edge can invalidate that reasoning; an observed successful run does
not restore the theorem.

</details>

### Heuristics: definition before reputation

Let \(h^*(n)\) be the least remaining cost to a goal in the named model. For
this course's conventional nonnegative-cost setting, record the full audit

\[
0\le h(n)\le h^*(n).
\]

The upper inequality is admissibility; the lower inequality is a declared
convention here, not a substitute for specifying the cost domain. A heuristic
is admissible when

\[
h(n)\le h^*(n)
\]

for every relevant state. It is consistent when

\[
h(n)\le c(n,n')+h(n')
\]

for every stated transition, with \(h(g)=0\) at a goal. Consistency gives
\(g(n)+h(n)\le g(n')+h(n')\) along an edge, which is one ingredient in common
A-star graph-search arguments. Name the exact A-star variant and reopen policy;
do not say merely “A-star is optimal.”

### Small exact-distance audit

For this fixture, suppose exact remaining costs are:

| State | \(h^*(n)\) | candidate \(h(n)\) |
| --- | --- | --- |
| A | 10 | 8 |
| B | 1 | 2 |
| G | 0 | 0 |

Predict which row falsifies admissibility.

<details>
<summary>Reveal after writing your prediction.</summary>

**Reveal:** at B, \(2>1\). One overestimate is enough. A heuristic can still
find a useful route, but the stated optimality guarantee is forfeited.

</details>

### Relaxed-model heuristic audit — derive, then re-audit

Do not call a number “admissible” by reputation. In the archive model, form a
relaxation that removes only the declared key precondition of `open-vault`—`has-key=true`—while retaining the same states, edge costs, and goal. Every original route remains legal in the relaxed model, so its exact
remaining cost is a lower bound:

\[
h_{\mathrm{relaxed}}(n)\le h^*(n).
\]

That containment argument—not a successful search run—is what makes this
particular relaxed distance admissible for the declared original graph.

**Predict before reveal.** Suppose a zero-cost `emergency-exit` action is
added to the original graph but the relaxed graph and its old distances are
left unchanged. Can the old heuristic still be reused without an audit?

<details>
<summary>Reveal after naming the relation that changed.</summary>

**Reveal:** no. The new original route need not exist in the old relaxation;
at a state with a new zero-cost exit, an old positive relaxed distance can
overestimate the new \(h^*\). An old heuristic can overestimate after a model change.
Rebuild the relaxation or re-prove that every new original route is
represented before carrying an admissibility claim forward.

</details>

### Read the priority policy

~~~python
def choose_next(frontier):
    return frontier.pop()  # candidate claims this is uniform-cost search
~~~

This is last-in-first-out behavior, not a lowest-\(g\) policy. Before writing
more code, specify priority key, tie rule, duplicate policy, goal test timing,
cost domain, and whether a state may be reopened.

### Exact counterexample — admissible is not enough for no-reopen graph search

Keep the graph, heuristic, and operational choices together. Let the positive
edge costs be

~~~text
S --3--> A --1--> G
S --1--> B --1--> A
~~~

The true remaining costs are `h*(S)=3`, `h*(A)=1`, `h*(B)=2`, and `h*(G)=0`.
Use the candidate heuristic `h(S)=3`, `h(A)=0`, `h(B)=2`, and `h(G)=0`. It is
admissible, but it is inconsistent on `B -> A` because

\[
h(B)=2 > 1+0=c(B,A)+h(A).
\]

Now name a particular graph-search variant: priority `f=g+h`; ties choose `A`
before `B`; test a goal when it is removed from the frontier; replace an
already-open frontier entry when a strictly lower `g` is found (and discard a
stale higher-`g` entry if it is later removed); and discard a later better path
to an already closed state. Expanding `S` puts `A` and `B` at equal `f=3`, so
the tie rule closes `A` with `g=3` and inserts `G` with cost 4. Expanding `B`
finds a better `A` path with `g=2`, but the no-reopen policy discards it. The
no-reopen result has cost `4`.

If the same trace reopens `A`, the declared open-frontier rule replaces `G`
with its lower cost `g=3` before the goal is removed. The reopened result has
cost `3`, the actual shortest-path cost in this declared graph. This does not
say that every inconsistent heuristic fails or that every reopen implementation
is correct; it makes the missing premise visible.

<details>
<summary>Predict before revealing the policy consequence.</summary>

Which fact is doing the damage: the words “A-star,” admissibility alone, the
`A`-before-`B` tie rule, or the rule that refuses to reopen a closed state?
Which detail would you have to record before reusing any theorem claim?

**Reveal:** the failure needs this combined graph, heuristic, tie, goal-test,
open-frontier update, and no-reopen policy. Record the exact search variant and
duplicate/reopen rule; no label or one successful run substitutes for them.

</details>

### A-star guarantee regime audit

Use this as a theorem-condition checklist, not a slogan or a substitute for a
proof of a particular implementation.

| Declared variant | Conditions that must stay visible | What this table does not establish |
| --- | --- | --- |
| tree search without global closed-state pruning | nonnegative edge costs; \(0\le h\le h^*\); declared frontier/goal-removal rule; a finite or otherwise stated termination regime | that a graph-search implementation inherits the same result |
| graph search with best-\(g\) replacement and reopening | the tree-search conditions plus a lower-\(g\) path can replace/reopen an earlier state; stale higher-\(g\) entries are handled deliberately | that an arbitrary “reopen” implementation is correct or efficient |
| graph search that never reopens a closed state | the named duplicate/goal-test rules plus \(h(g)=0\), consistency, the declared nonnegative-cost model, and a finite or otherwise stated termination regime | that admissibility alone protects a no-reopen implementation |

The fixed counterexample above belongs in the third row: it changes the
closed-state policy, so an admissibility label alone cannot carry the theorem.

### Output: Search-Strategy Evidence Table

Compare BFS, UCS, and a named A-star variant:

| Method | state/edge model | frontier key | guarantee claimed (completeness / optimality / neither) | theorem conditions | finite trace observed | non-claim |
| --- | --- | --- | --- | --- | --- | --- |

Include one adversarial graph—weighted edges for BFS or an overestimating
heuristic for A-star—and explain which premise it changes.

**Transfer:** A learned score in M35 may guide a search or ranking process, but
it does not inherit a guarantee unless its assumptions and evaluation match
the theorem.

### Bounded reference fixture — frontier policy

Use `lib/m34-classical-ai-reference-fixture.js` before accepting a code label.
Predict the next entry chosen by the declared lowest-accumulated-cost policy
and by last-in-first-out policy, then inspect
`chooseM34DeclaredFrontierEntry(...)`. Name the still-missing tie, duplicate,
goal-test, cost-domain, and reopen rules. The fixture chooses between exactly
two entries; it is not an implementation of UCS or a graph-search theorem.
Then inspect `m34AStarNoReopenCounterexample()` as a fixed four-state trace;
it does not traverse a learner-supplied graph or implement general A-star.

---

## Session 3 — Constraints and relaxations change the mathematical object

**Launch:** Mark which candidates are feasible in the original model and which values are only relaxation bounds before reading a solver result.

### Core question

**Which candidates are actually feasible, and which values are only bounds?**

**Claim/source trace:** `M34-C04, M34-C06 -> S34-03, S34-06–S34-07, S34-18` — local
propagation, solver status, and a relaxation bound do not by themselves prove
feasibility in the original model.

A finite constraint satisfaction problem can be written as

\[
(X,D,C),
\]

with variables \(X\), domains \(D\), and constraints \(C\). A propagation
step may remove a value lacking local support. That is useful local evidence,
not a general certificate that a global solution exists.

### Counterexample: local consistency is not global satisfiability

Give \(X,Y,Z\) each domain \(\{\text{red},\text{blue}\}\), and impose
pairwise “different” constraints around a three-cycle. Every color can have a
local supporting different color at a neighbor, yet no two-color assignment
satisfies all three inequalities. Arc consistency is not a universal solver.

### CSP as partial-assignment search

Make the solver architecture visible before naming a heuristic. A CSP search
state is a **partial assignment**; an action chooses one unassigned variable
and one currently legal value; a goal is a complete assignment satisfying all
constraints. MRV and LCV choose among those actions—they do not replace the
state, action, or goal contract.

An **AC-3 queue** holds directed constraint arcs. Revising \(X_i\to X_j\)
removes a value of \(X_i\) only when no value still in \(X_j\) supports it. If
that removal changes a domain, re-enqueue relevant neighboring arcs toward
\(X_i\); an empty domain means the current partial-assignment branch must
backtrack. Forward checking is a lighter policy: after an assignment, it
prunes directly affected future domains but does not by itself promise global
arc consistency.

This turns “propagation” into a reviewable sequence: state, branch, queue
policy, domain change, and backtrack condition. It does not build or claim a
general CSP solver.

### Fixed AC-3 queue/requeue trace

Inspect `m34Ac3RequeueCard()` before treating “propagation” as a black box.
For \(A,B\in\{1,2\}\), \(C\in\{2\}\), and constraints \(A<B\), \(B<C\),
start with queue `B->C`:

| Queue step | Domain change | Why the next arc is queued |
| --- | --- | --- |
| process `B->C` | remove \(B=2\): it has no larger support in \(C=\{2\}\) | because \(B\)'s domain changed, re-enqueue `A->B` |
| process `A->B` | remove \(A=1,2\): neither is below the only remaining \(B=1\) | \(A\)'s domain is empty, so this branch is inconsistent and must backtrack |

The direction matters: when \(B\) changes, re-enqueue predecessors whose
support depended on \(B\), not an arbitrary nearby arc. This fixed trace is
not a general AC-3 implementation or a global-satisfiability proof.

### Prediction before reveal — propagation and branching trace

Use the tiny CSP \(A,B\in\{1,2\}\), \(C\in\{1,2,3\}\), with constraints
\(A<C\) and \(B<C\). Before revealing the trace, predict:

1. which value arc consistency removes before any assignment;
2. after the declared alphabetical MRV tie-break chooses \(A\), whether LCV
   prefers \(A=1\) or \(A=2\); and
3. whether this local work alone proves that every related CSP is satisfiable.

<details>
<summary>Reveal the declared propagation and MRV/LCV trace.</summary>

Arc consistency removes \(C=1\): it has no smaller supporting value in either
\(A\) or \(B\). It leaves \(A,B\in\{1,2\}\) and \(C\in\{2,3\}\). All domains
now have size two, so the stated MRV tie-break selects \(A\). LCV compares its
legal values: \(A=1\) deletes no value from \(C\), while \(A=2\) deletes
\(C=2\), so choose \(A=1\). Forward checking leaves \(C\in\{2,3\}\); the next
MRV tie-break selects \(B\), and LCV similarly chooses \(B=1\). Choosing
\(C=2\) completes this particular solution.

This is a trace of declared propagation, tie rules, and branching—not evidence
that arc consistency or MRV/LCV solves arbitrary CSPs. The preceding odd-cycle
counterexample still has local support without a global solution.

</details>

### Relaxation from first principles

For the synthetic maximization problem

\[
\max 2x+2y
\quad\text{such that}\quad
2x+2y\le3,\quad x,y\in\{0,1\},
\]

the feasible binary solutions have objective at most 2. If we relax
\(x,y\in\{0,1\}\) to \(0\le x,y\le1\), then \(x=1,y=0.5\) has value 3 but is
not a legal binary assignment. For a maximization problem, enlarging the
feasible set gives an upper bound. For minimization, the relaxed infimum is a
lower bound:

\[
F\subseteq F_{\mathrm{relax}}
\Longrightarrow
\inf_{x\in F_{\mathrm{relax}}}f(x)\le
\inf_{x\in F}f(x).
\]

### Prediction before reveal

A solver returns \(x=1,y=0.5\) and status “optimal” for the relaxation.
Predict which of these are justified: “the original binary problem is solved,”
“the relaxed objective is an upper bound for the maximization problem,” or
“the candidate needs a feasibility check in the original model.”

<details>
<summary>Reveal after writing your prediction.</summary>

**Reveal:** the second and third. A status and a number refer to the model
actually sent to the solver, not a different original model.

</details>

### Code-reading task

~~~python
def is_original_solution(x, y):
    return 0 <= x <= 1 and 0 <= y <= 1 and 2*x + 2*y <= 3
~~~

What does this fail to check? Integrality. A model check that omits
\(x,y\in\{0,1\}\) can incorrectly bless the relaxed candidate as an original
solution. Add the domain condition explicitly; do not hide it in a comment.

### Output: Constraint–Objective–Relaxation Sheet

For one synthetic CSP or optimization fixture, record:

1. variables, finite domains, constraints, and objective direction;
2. a propagation trace or rejected-value explanation;
3. original and relaxed feasible regions;
4. bound direction and candidate feasibility check;
5. one locally supported but globally impossible or fractional counterexample;
6. a repair/rounding proposal labelled as a new argument, not an automatic
   equivalence.

**Transfer:** M35's loss function and surrogate metric may be useful
relaxations or proxies; they do not automatically represent the deployment
constraint or human goal.

### Bounded reference fixture — relaxation status

Before calling `evaluateM34BinaryRelaxationCandidate({ x: 1, y: 0.5 })`,
predict which checks pass in the relaxed and original binary models. Inspect
the returned feasible assignments and bound explanation, then state why the
fractional witness cannot be handed to a user as an original solution. The
fixture is a finite synthetic status check, not a general solver, rounding
method, proof system, or decision recommendation.

---

## Session 4 — Planning and solver limits must be stated, not guessed

**Launch:** Map the symbolic state update, constraints, solver status, and one unencoded cause that the system therefore cannot know.

### Core question

**What does a planner or CSP solver know, and what has never been encoded?**

**Claim/source trace:** `M34-C05, M34-C07 -> S34-03–S34-05, S34-09–S34-10`
— planning/constraint encodings and a directed reduction set the scope of a
solver or complexity claim.

A simple planning action has named preconditions and effects. For the archive
fixture:

~~~text
take-key
  precondition: room = Entry and key-at-rack
  effect: has-key = true and key-at-rack = false

move-to-vault
  precondition: room = Entry and energy >= 1
  effect: room = Vault and energy decreases by 1

open-vault
  precondition: room = Vault and has-key = true and energy >= 1
  effect: vault-open = true and energy decreases by 1
~~~

### State-update card — name what changes and what persists

For Boolean facts, use one declared frame convention: facts not named by an
action persist. With an add list and delete list, the Boolean part of the
transition is

\[
T(s,a) = (s \setminus Del(a)) \cup Add(a).
\]

Any changed state field—numeric or symbolic—needs a visible assignment rather
than an implied reset.

| Action | Add / delete effects | Explicit field updates | Declared persistence |
| --- | --- | --- | --- |
| `take-key` | add `has-key`; delete `key-at-rack` | energy unchanged | room and `vault-open` persist |
| `move-to-vault` | no Boolean add/delete | `energy := energy - 1`; room becomes Vault | `has-key`, `key-at-rack`, and `vault-open` persist |
| `open-vault` | add `vault-open` | `energy := energy - 1` | room and key facts persist |

**Predict before reveal.** A candidate trace leaves `key-at-rack=true` after
`take-key` and silently resets energy to 2 after `move-to-vault`. Which
add/delete, numeric-update, or persistence rule did it violate?

<details>
<summary>Reveal after identifying the first bad state update.</summary>

**Reveal:** the first line violates the delete effect; the second invents a
numeric reset absent from the transition contract. A planner trace is only as
valid as its state update convention. The table is a compact reading aid, not
a PDDL interpreter or a proof that this archive narrative is adequate.

</details>

### Fixed planning trace — state and action effects

Before revealing the trace, predict whether the three actions reach the goal
from

\[
s_0=(\text{room=Entry},\ \text{key-at-rack=true},\ \text{has-key=false},\
\text{energy=2},\ \text{vault-open=false}).
\]

<details>
<summary>Reveal after recording your predicted state changes.</summary>

| state | chosen action | visible change | next state |
| --- | --- | --- | --- |
| $s_0$ | `take-key` | key leaves the rack; learner now has the key | $s_1=(\text{Entry},\text{false},\text{true},2,\text{false})$ |
| $s_1$ | `move-to-vault` | room changes; one energy unit is spent | $s_2=(\text{Vault},\text{false},\text{true},1,\text{false})$ |
| $s_2$ | `open-vault` | vault opens; final energy unit is spent | $s_3=(\text{Vault},\text{false},\text{true},0,\text{true})$ |

**Reveal:** under exactly these Boolean/action/energy assumptions,
`take-key → move-to-vault → open-vault` reaches $s_3$, where `vault-open`
is true. This is a finite trace, not a planner implementation or proof about a
different action model.

</details>

Now change the formal language: suppose every action takes one time tick but
the access window has capacity for only two ticks. The same three-action trace
needs three ticks, so it fails before `open-vault`; adding the time variable,
duration preconditions, and a failure/closure transition is required. Likewise,
if a new requirement adds a second item while the carrier has capacity one,
the state must represent carried items and the old trace supplies neither a
legal load action nor a capacity proof. A plan does not survive a changed
state/action/resource contract merely because its earlier action names still
look plausible.

### Prediction before reveal

An implementation compresses every non-success status to “infeasible”:

~~~python
def human_label(status):
    if status == "optimal":
        return "solution found"
    return "infeasible"
~~~

If a solver hit a time limit or the model was interrupted, what false
conclusion does this function introduce?

<details>
<summary>Reveal after writing your prediction.</summary>

**Reveal:** it turns unknown/limited execution into a claim that no model
solution exists. Status, model feasibility, objective/bound, and external
semantics are separate layers.

</details>

### CP-SAT status matrix — a model result is not a world conclusion

For a named CP-SAT model, use the documented status vocabulary precisely:

| Status | Narrow model-level meaning | It still does **not** establish |
| --- | --- | --- |
| `OPTIMAL` | An optimal feasible solution was found for the encoded model. | That the encoding, data, objectives, or solution are appropriate, safe, authorized, or optimal outside the model. |
| `FEASIBLE` | A feasible solution was found, but optimality is not known. | Optimality, model adequacy, practical feasibility, or authority to act. |
| `INFEASIBLE` | The encoded problem was proven infeasible. | That the real situation is impossible, that an omitted action/variable does not matter, or that a different model is infeasible. |
| `MODEL_INVALID` | The supplied model failed validation. | A statement about solvability, a theorem, or a real-world constraint. |
| `UNKNOWN` | No solution was found and infeasibility was not proven before a configured stop, such as a time, memory, or custom limit. | Infeasibility, optimality, complexity classification, model correctness, or a real-world conclusion. |

These labels describe one solver's relation to one declared input. Read the
version, parameters, stopping condition, and model alongside the status; none
turns a formal result into a decision authorization.

### Formal limit and encoding boundary

M33's reduction discipline applies here. A complexity claim must name a
decision language, encoding and size measure, reduction direction, resource
model, and theorem scope. “Our schedule has many constraints” or “the solver
timed out” is not a classification proof.

Use this check before repeating a solver claim:

~~~text
What is the decision version of the problem?
How are states, actions, constraints, and numeric values encoded?
Which map f transforms a known source problem to the target?
Why is f total, correctly directed, and resource bounded?
Which theorem conclusion follows?
Which practical result does not follow?
~~~

### Debugging / design inspection

Take a plan that assumes instantaneous actions. Add a one-unit action duration
and a capacity-one resource. Ask which precondition/effect, state variable,
and schedule conflict must change. If the old plan still appears valid, the
implementation may be ignoring the new model field.

### Output: CSP/Planning Limit Claim Card

State:

1. exact decision/optimization/search formulation;
2. encoding and model assumptions;
3. solver status vocabulary and what each status does not mean;
4. a named formal result or an explicit “theorem not supplied” label;
5. one bounded trace;
6. one unmodelled factor; and
7. a practical mitigation, abstention, or escalation condition.

**Transfer:** M35 must distinguish an observed training/evaluation result from
the claim that a learned model captures the actual decision problem.

---

## Session 5 — Belief, utility, and authority are different inputs

**Launch:** Write belief, utility, and decision authority in separate lines; predict how changing one can change an action without changing the others.

### Core question

**How can a likely state lead to a different action than a utility-aware
choice?**

**Claim/source trace:** `M34-C08–M34-C09 -> S34-08, S34-11–S34-13, S34-18` —
expected-utility and MDP structures are conditional models; neither turns a
numerical result into authority to act.

For a finite model with evidence \(e\), expected utility can be written as

\[
EU(a\mid e)=\sum_s p(s\mid e)u(a,s).
\]

This is a conditional mathematical ranking given a state space, probability
model, action set, utility/loss table, and action constraints. It is not a
discovery of moral truth, consent, fairness, or decision authority.

### A synthetic decision table

After a fictional sensor signal, suppose:

\[
p(\text{clear}\mid e)=0.7,\qquad
p(\text{blocked}\mid e)=0.3.
\]

The most probable state is clear. Compare two actions:

| Action | \(u(a,\text{clear})\) | \(u(a,\text{blocked})\) | Expected utility |
| --- | --- | --- | --- |
| dispatch a simulated retrieval bot | 6 | -8 | \(0.7(6)+0.3(-8)=1.8\) |
| inspect the simulated record first | 2 | 2 | \(2\) |

The maximum-a-posteriori state is clear, yet inspection has higher expected
utility in this toy table. The result changes if probabilities, utilities, or
allowed actions change.

### Prediction before reveal

Hold the posterior probabilities fixed. If the cost of a blocked dispatch
changes from -8 to -2, predict whether the recommended action can change.

<details>
<summary>Reveal after writing your prediction.</summary>

**Reveal:** yes. The belief model stayed fixed, but the utility model changed.
Confusing a posterior with a decision rule hides whose losses and constraints
were supplied.

</details>

### Code-reading task

~~~python
def choose_action(posterior):
    most_likely = max(posterior, key=posterior.get)
    return "dispatch" if most_likely == "clear" else "inspect"
~~~

This chooses from a maximum-probability state only. It cannot reproduce the
expected-utility comparison because it has no utility table or constrained
action set. That is a model mismatch, not a minor implementation style issue.

### One-shot expected utility is not an MDP policy

The table above is a **one-shot** choice: condition on \(e\), rank one allowed
action, and score the stated outcome. It does not say what state follows or
what action will be taken later. An MDP-policy claim needs a state space,
available actions, transition model \(P(s'\mid s,a)\), reward/cost definition,
a horizon or discounted/average-return objective, and a policy such as
\(\pi(a\mid s)\).

Predict whether calling `choose_action(posterior)` once per minute turns the
function into an MDP policy.

<details>
<summary>Reveal after writing your boundary.</summary>

**Reveal:** no. Repetition alone supplies neither a transition model nor a
long-run objective or state-contingent policy. A one-step table is an MDP
special case only when its terminal/horizon and transition/reward assumptions
are explicitly declared. If state is partly observed, a belief update and
observation model are further assumptions—not facts supplied by one posterior.

</details>

### Markov-sufficiency and horizon audit

An MDP state must retain what is needed to determine the next-state/reward
distribution under the declared action. Imagine two histories both displayed
as `s0`, but the sensor was recently calibrated in one and stale in the other.
If `inspect` then leads to different clear/blocked distributions, the displayed
state is not Markov-sufficient for this decision model.

**Predict before reveal.** Is it enough to keep the convenient label `s0`, or
must you augment the state with the relevant reliability/history information,
state a belief/partial-observation model, or withdraw the MDP claim?

<details>
<summary>Reveal after choosing the smallest defensible repair.</summary>

**Reveal:** the model must make the relevant state information or belief
explicit, or it cannot reuse the MDP backup as stated. The card below is
**finite-horizon, undiscounted**: it has two decision stages, terminal values
at stage 1, and no infinite-horizon or discount-factor claim. Changing the
horizon, state, observation process, transition, reward, or action set creates
a different calculation.

</details>

### A two-step Bellman backup

Here is the smallest sequential contrast. At state `s0`, action `inspect` has
an immediate reward of `-0.5` (equivalently, an immediate cost of `0.5`) and
transitions to `clear` or `blocked` with probability `0.5` each. At the final
stage, `dispatch`/`wait` rewards are `3`/`1` in `clear` and `-3`/`1` in
`blocked`; therefore

\[
V_1(\text{clear})=3,\qquad V_1(\text{blocked})=1.
\]

The two-stage backup is

\[
Q_0(s_0,\text{inspect})=-0.5+0.5(3)+0.5(1)=1.5.
\]

This particular terminal policy assumes that, after `inspect`, the
observation becomes `clear` or `blocked` before the terminal action. If that
successor state remained hidden, “dispatch in clear and wait in blocked” would
not be an available state-contingent policy without a belief-state model and a
different backup. Inspect the `observationModel` on
`m34TwoStageMdpBackupCard()`; it makes this assumption visible instead of
smuggling it in through the table.

Compare a terminal `safe` action with value `1.2`. Under this exact
finite-horizon, undiscounted objective, the initial policy chooses `inspect`, then chooses `dispatch` in
`clear` and `wait` in `blocked`. That state-contingent continuation is what a
one-shot table lacks.

<details>
<summary>Predict before revealing the policy boundary.</summary>

If the initial expected value says `inspect`, may you stop writing the policy
there? What becomes invalid if the horizon, transition probabilities, action
set, or terminal rewards change?

**Reveal:** no. A policy includes the later state/action choices as well as the
initial action. Changing any declared component creates a different MDP and
needs a new backup; it is not repaired by repeatedly calling a one-shot
selector.

</details>

Use `m34TwoStageMdpBackupCard()` only to inspect this arithmetic and its stated
scope. It is not a general MDP planner, learned policy, or authority to act.

### Human-impact boundary

For any consequential context, do not turn this toy calculation into action.
Ask:

- who supplied the probability estimate and how uncertain is it?
- whose values appear in the utility table, and who is omitted?
- which rights, policy constraints, consent requirements, or harms are not
  tradeable utilities?
- who can veto, revise, appeal, or investigate the recommendation?

An AI system can draft a calculation; it cannot silently manufacture the
missing authority.

### Output: Decision-under-Uncertainty Card

Create a synthetic card with:

1. a decision artifact explicitly labelled `one-shot` or `sequential`;
2. finite state/outcome/action space;
3. probability source and uncertainty note;
4. utility/loss assumptions and omitted stakeholders/outcomes;
5. expected-utility calculation;
6. one one-variable sensitivity analysis;
7. a constraint or abstention rule that overrides a numerical ranking; and
8. a sentence beginning, “This calculation does not authorize …”

A one-shot artifact must state that it does not establish a transition model or
policy. A sequential artifact must name state, action, transition, reward/cost,
horizon, and continuation policy. It may use the fixed two-step card to inspect
one declared backup, but it must not claim a general planner, learned policy,
or authority to act.

**Transfer:** M35 adds learned estimates and representations; it does not make
the authority and value questions disappear.

---

## Session 6 — Defend a classical AI design dossier

**Launch:** Draft a one-sentence recommendation, then attach its representation, algorithm conditions, evidence, limitation, accountable owner, and next falsifier.

### Core question

**Can a reviewer trace a recommendation back through its representation,
algorithm conditions, evidence, and accountable boundary?**

**Claim/source trace:** `M34-C01–M34-C09 -> S34-01–S34-13` — the dossier
reconnects model, theorem conditions, finite evidence, and governance
boundaries; it is not source approval or release evidence.

Use only the synthetic archive-retrieval and maintenance-scheduling setting,
or another clearly invented non-consequential system. Do not build a tool that
decides for real people, operates equipment, accesses accounts, or supplies
professional advice.

### Output: Classical AI Search, Constraints & Decision Packet

Submit one connected packet containing:

1. a state/action/observation/goal/cost card and omitted-factor list;
2. a finite graph and exact-distance oracle for selected states;
3. one search evidence table comparing an uninformed and a heuristic method;
4. a small CSP with variables/domains/constraints, propagation trace, and
   locally-consistent/global-inconsistent comparison;
5. an original and relaxed optimization sheet with bound direction and
   feasibility check;
6. a planning or solver-status boundary card;
7. a decision artifact explicitly labelled `one-shot` or `sequential`; a
   one-shot artifact must state that it does not establish a transition model or
   policy, while a sequential artifact must name state, action, transition,
   reward/cost, horizon, and continuation policy;
8. a formal-limits card naming an encoded problem and a practical non-claim;
9. an accountable review/abstention condition; and
10. a learner-controlled oral-defense summary and M35 handoff.

### Acceptance rubric

| Evidence | Strong evidence looks like | Repair prompt |
| --- | --- | --- |
| representation | state, observations, actions, and omitted variables are explicit | “What future behavior changes if this feature is omitted?” |
| algorithm | frontier key, duplicate policy, theorem conditions, and trace are separate | “What condition does your guarantee require?” |
| constraints | original versus relaxed model and feasibility are visible | “Is this a legal candidate or only a bound?” |
| uncertainty | probability and utility assumptions are distinct, with sensitivity | “Did a belief change or a value change?” |
| decision model | one-shot versus sequential scope is labelled; a sequential claim includes a continuation policy | “Which transition, horizon, or later action would change this claim?” |
| limits | status, encoding, theorem scope, and practical non-claim are named | “What did the run observe rather than prove?” |
| governance | review, abstention, intervention, and accountability are concrete | “Who may veto or revise this action?” |

### Design-review exercise

Ask an AI agent to propose a one-paragraph archive planner model. Do not accept
it immediately. Highlight:

1. one missing state variable or observation;
2. one theorem condition it did not name;
3. one solver-status overclaim;
4. one missing stakeholder/authority boundary; and
5. one counterexample that changes the recommendation.

The learner's job is to direct and review the AI proposal, not to type a
larger unexamined implementation.

---

## Confidence-aware diagnostic and spaced review

Choose and record confidence before revealing the explanation. A low
confidence answer is a useful review target, not a failure.

1. A state is represented only by current room, but key possession changes
   legal actions. What is the strongest conclusion?
   - A. Room-only is always sufficient because rooms are nodes.
   - B. The representation can merge histories with different futures.
   - C. The search algorithm is automatically wrong.
   - D. Adding a larger heuristic fixes the missing state variable.

<details>
<summary>Reveal after recording your answer and confidence.</summary>

**Answer: B.** Repair: representation determines whether repeated states are
semantically safe to merge.
</details>

2. Breadth-first search returns a route with two edges and cost 20. Another
   route has three edges and cost 3. What is supported?
   - A. BFS found the cheapest-cost route.
   - B. BFS is faulty because it prefers fewer edges.
   - C. BFS may be correct for unit-step count while not optimizing the stated cost.
   - D. The graph has no solution.

<details>
<summary>Reveal after recording your answer and confidence.</summary>

**Answer: C.** Repair: name the objective and edge model.
</details>

3. A relaxation of a binary maximization problem returns a fractional value
   with a larger objective. What should happen next?
   - A. Deploy the fractional candidate.
   - B. Treat it as an original feasible solution.
   - C. Label its value as a relaxation bound and check original feasibility.
   - D. Conclude the solver is wrong.

<details>
<summary>Reveal after recording your answer and confidence.</summary>

**Answer: C.** Repair: the relaxed and original feasible sets differ.
</details>

4. A solver returns after a time limit. What may be concluded?
   - A. The original problem is infeasible.
   - B. The configured run stopped at its declared limit.
   - C. The encoded family is NP-complete.
   - D. The planner's model matches reality.

<details>
<summary>Reveal after recording your answer and confidence.</summary>

**Answer: B.** Repair: a status does not collapse model, theorem, and
external-world claims.
</details>

5. The most likely state is clear, but inspect has higher expected utility.
   Why?
   - A. Probability is invalid.
   - B. Expected utility also depends on utilities and allowed actions.
   - C. Maximum probability is always irrelevant.
   - D. The calculation grants authority to dispatch.

<details>
<summary>Reveal after recording your answer and confidence.</summary>

**Answer: B.** Repair: belief, value, and authority are separate inputs.
</details>

**Review schedule:** Retrieve the working invariant after 1, 3, 7, 14, and
30 days. On days 7 and 30, change one premise: add a hidden state variable,
introduce a negative edge, restore integrality, alter a time limit, or vary
one utility. Predict before you recalculate.

---

## Supportive oral defense and live-learning handoff

The Teaching Assistant conducts this after the dossier. It is a constructive
conversation, never a rigid coding or written exam. You may request hints,
pause, answer in text, and revise the evidence summary.

### Teaching Assistant prompt — M34

~~~text
You are Atlas Academy's M34 Teaching Assistant. Begin with the learner's
Classical AI Search, Constraints & Decision Packet, not a score. Ask the
learner to define one state variable, trace one frontier or propagation
decision, name one theorem/feasibility assumption, and distinguish one bounded
result from an authorization claim. Ask for a prediction before revealing a
correction. Use a hint ladder: inspect the formal object; change one premise;
show a small counterexample; then help the learner repair the narrowest claim.
Use the visible chat as an accessible whiteboard: define notation, use
supported display equations with prose or ASCII fallback, use language-labelled
code fences, and make traces/tables readable after a live call. End with a
learner-controlled evidence summary and a M35 handoff. Do not grade, claim
voice/rendering settings, or store a raw transcript.
~~~

### Hint ladder

1. “What is your state, objective, and legal action set?”
2. “Which assumption lets this search/relaxation/status statement follow?”
3. “Change one variable: edge cost, domain, time limit, utility, or hidden
   observation. What breaks?”
4. “State the smallest supported recommendation and its abstention boundary.”

### Study Partner prompt — M34

~~~text
You are Atlas Academy's M34 Study Partner. Lead a non-grading live discussion
or text rehearsal about search, CSPs, planning, optimization boundaries, and
decision under uncertainty. Treat the visible chat as a readable whiteboard:
define every symbol, use concise equations with prose/ASCII fallback, put code
in labelled fences, and preserve readable frontier/constraint/utility traces.
Invite the learner to review an AI-generated formulation, find a missing state
variable, change one theorem premise, diagnose a solver-status overclaim, or
run a sensitivity thought experiment. End with a concise TA handoff: strongest
insight, unresolved misconception, dossier artifact, and next question. Do
not turn rehearsal into grading or pretend a recommendation is authorized.
~~~

### Learner-controlled evidence summary

~~~text
Representation/claim defended:
Assumption, counterexample, or status distinction repaired:
Trace/derivation/experiment inspected:
Remaining uncertainty or omitted factor:
Abstention/review point:
M35 handoff:
~~~

You may correct, decline to save, or keep this summary locally. It is not a
transcript, pass/fail result, automatic unlock, or proof that a live voice
session occurred.

### Forward handoff

M35 receives your **problem-formulation packet**: state/representation,
objective/constraints, search or solver rationale, uncertainty model,
counterexample, and human-impact boundary. Learning from data can alter the
representation or estimate, but it must not erase the evidence and authority
questions made visible here.

---

## Source and reuse boundary

This workbook uses original explanations, fixtures, diagrams, and code. It does
not reproduce source prose, figures, course slides, problem sets, or solutions.
The established reading routes below were checked on **2026-08-01**; targeted
model-construction routes were rechecked on **2026-08-02**.

### Learner-facing source links

| Source | Session/claim linkage | Reuse boundary |
| --- | --- | --- |
| [UC Berkeley CS188 Introduction to Artificial Intelligence](https://inst.eecs.berkeley.edu/~cs188/) with its [informed-search route](https://inst.eecs.berkeley.edu/~cs188/textbook/search/informed.html), [CSP-filtering route](https://inst.eecs.berkeley.edu/~cs188/textbook/csp/filtering.html), [decision-networks route](https://inst.eecs.berkeley.edu/~cs188/textbook/vpis/decision-networks.html), and [MDP route](https://inst.eecs.berkeley.edu/~cs188/textbook/mdp/markov-decision-processes.html) | Sessions 1–5: state/observation boundaries, the exact distinction between admissibility/consistency in graph search, propagation/requeue direction, conditional expected utility, planning, and sequential-decision scope. | Link-only/original Atlas fixtures; do not copy course projects, slides, solutions, or autograder material. |
| [MIT 6.034 Artificial Intelligence](https://ocw.mit.edu/courses/6-034-artificial-intelligence-fall-2010/) | Sessions 1–5: knowledge/problem solving, search, and AI representations as a connected conceptual route. | MIT OCW assets have their own notices; link-only/original Atlas explanations and diagrams. |
| [Georgia Tech CS 6601 Artificial Intelligence](https://omscs.gatech.edu/cs-6601-artificial-intelligence) | Sessions 1–6: algorithms, probability, linear algebra, and AI application scope used to calibrate prerequisites and transfer. | Link-only/original Atlas exercises; not equivalent to term-long project work or instructor feedback. |
| [CMU 07-280 AI/ML I: Markov Decision Process notes](https://www.cs.cmu.edu/~07280/notes/mdps/index.html) | Session 5: distinction between a one-shot expected-utility comparison and a sequential MDP policy with state transitions and an objective over time. | Course-staff notes are a reading route only; Atlas uses an original boundary example and does not copy notes, figures, exercises, or code. |
| [OR-Tools CP-SAT documentation](https://developers.google.com/optimization/cp/cp_solver) and the [NIST AI RMF 1.0 PDF](https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.100-1.pdf) | Sessions 3–6: solver-status interpretation and the separation of model output, risk evidence, and authority. | Documentation/framework sources are linked for reading; original Atlas models and decision cards remain distinct. |
| [MIT 6.034 Planning and Search](https://courses.csail.mit.edu/6.034s/handouts/spring12/recitation6-planning.pdf) and [MIT 6.825 Planning lecture](https://ocw.mit.edu/courses/6-825-techniques-in-artificial-intelligence-sma-5504-fall-2002/1184a975225bdbab3e3d215bf173bde1_Lecture10FinalPart1.pdf) | Sessions 2 and 4: relaxed heuristic lower bounds; state transitions, add/delete effects, and frame conventions. | Targeted 2026-08-02 calibration only; link-only/original Atlas audits and synthetic traces. |
| [Stanford CS221 scheduling assignment](https://web.stanford.edu/class/archive/cs/cs221/cs221.1192/assignments/scheduling/index.html) and [Markov Decisions handout](https://web.stanford.edu/~cpiech/cs221/handouts/markovDecisions.html) | Sessions 3 and 5: partial-assignment propagation; Markov-sufficiency and finite-horizon assumptions. | Link-only/original Atlas explanations; do not copy assignment or handout assets. |

### Claim-linked session routes

The routes below make each session's compact trace above inspectable. They use
only the existing M34 ledger IDs and links; read them as sources for original
Atlas reasoning, not as copied exercises, source approval, or publication
evidence.

| Session | Claim/source route | Learner reading route |
| --- | --- | --- |
| M34-S01 | `M34-C01 -> S34-01, S34-04–S34-05, S34-18` | [S34-01 — Dijkstra](https://doi.org/10.1007/BF01386390); [S34-04 — STRIPS](https://doi.org/10.1016/0004-3702(71)90010-5); [S34-05 — PDDL2.1](https://doi.org/10.1613/jair.1129); [S34-18 — Berkeley CS188](https://inst.eecs.berkeley.edu/~cs188/textbook/) |
| M34-S02 | `M34-C02–M34-C03 -> S34-01–S34-02, S34-14, S34-18` | [S34-01 — Dijkstra](https://doi.org/10.1007/BF01386390); [S34-02 — Hart, Nilsson, and Raphael](https://doi.org/10.1109/TSSC.1968.300136); [S34-14 — MIT 6.034 planning/search](https://courses.csail.mit.edu/6.034s/handouts/spring12/recitation6-planning.pdf); [S34-18 — Berkeley informed search](https://inst.eecs.berkeley.edu/~cs188/textbook/search/informed.html) |
| M34-S03 | `M34-C04, M34-C06 -> S34-03, S34-06–S34-07, S34-15, S34-18` | [S34-03 — Mackworth](https://doi.org/10.1016/0004-3702(77)90007-8); [S34-06 — OR-Tools CP-SAT](https://developers.google.com/optimization/cp/cp_solver); [S34-07 — CVXPY DCP](https://www.cvxpy.org/tutorial/dcp/); [S34-15 — Stanford CS221 CSP route](https://web.stanford.edu/class/archive/cs/cs221/cs221.1192/assignments/scheduling/index.html); [S34-18 — Berkeley CSP filtering](https://inst.eecs.berkeley.edu/~cs188/textbook/csp/filtering.html) |
| M34-S04 | `M34-C05, M34-C07 -> S34-03–S34-05, S34-09–S34-10, S34-16` | [S34-03 — Mackworth](https://doi.org/10.1016/0004-3702(77)90007-8); [S34-04 — STRIPS](https://doi.org/10.1016/0004-3702(71)90010-5); [S34-05 — PDDL2.1](https://doi.org/10.1613/jair.1129); [S34-09 — Cook](https://doi.org/10.1145/800157.805047); [S34-10 — Karp](https://doi.org/10.1007/978-1-4684-2001-2_9); [S34-16 — MIT 6.825 planning](https://ocw.mit.edu/courses/6-825-techniques-in-artificial-intelligence-sma-5504-fall-2002/1184a975225bdbab3e3d215bf173bde1_Lecture10FinalPart1.pdf) |
| M34-S05 | `M34-C08–M34-C09 -> S34-08, S34-11–S34-13, S34-17, S34-18` | [S34-08 — Berkeley decision networks](https://inst.eecs.berkeley.edu/~cs188/textbook/vpis/decision-networks.html); [S34-11 — NIST AI RMF PDF](https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.100-1.pdf); [S34-12 — MIT 18.600 notes](https://ocw.mit.edu/courses/18-600-probability-and-random-variables-fall-2019/pages/lecture-notes/); [S34-13 — CMU MDP notes](https://www.cs.cmu.edu/~07280/notes/mdps/index.html); [S34-17 — Stanford CS221 Markov Decisions](https://web.stanford.edu/~cpiech/cs221/handouts/markovDecisions.html); [S34-18 — Berkeley MDP](https://inst.eecs.berkeley.edu/~cs188/textbook/mdp/markov-decision-processes.html) |
| M34-S06 | `M34-C01–M34-C09 -> S34-01–S34-18` | Revisit the applicable session route, then use the [M34 candidate source ledger](../source-maps/module34_classical_ai_search_constraints_decision.md) to check its narrower use and reuse boundary. |

For the candidate's claim-linked original/official source routes and reuse
cautions, use the adjacent [M34 candidate source
ledger](../source-maps/module34_classical_ai_search_constraints_decision.md).

## Candidate release boundary

Before this candidate can move into the released portal learner route, it still
needs the versioned review-ready delivery map, full source/claim/accessibility
review, a bounded interactive implementation or equivalent interaction,
learner-facing diagnostic/review record, module evidence and review records,
exact candidate CI evidence, deployment provenance, and human approval. Until
then it is a hidden review candidate—not a completed module, solver
authorization, or learner-mastery claim.
