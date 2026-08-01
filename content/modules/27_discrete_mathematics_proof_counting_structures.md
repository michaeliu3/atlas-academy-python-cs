# Module 27 — Discrete Mathematics, Proof, Counting & Structures

**Arc VI — Mathematical foundations for algorithms, systems, and AI**

> **Bridge:** Modules 1–5 taught you to trace Python state, write contracts,
> use an introductory proof vocabulary, and state a cost model. This module
> returns to those ideas at full mathematical resolution. It asks what must be
> true for a claim to be meaningful, what makes an argument valid for every
> object in its declared domain, and how discrete structure becomes an
> algorithm, a constraint, or an AI-era design decision.

**Primary outcome:** You can state a formal claim with its domain and
assumptions; build or repair a proof; construct a minimal counterexample; model
relations, recurrence, graph, order, and modular arithmetic precisely; and
separate that mathematical work from a Python trace, API contract, or benchmark.

This is not a symbol-speed test and it is not a replacement for a proof-based
mathematics course. It is a rigorous first pass that makes later linear
algebra, probability, optimization, formal languages, classical AI, machine
learning, and systems arguments readable. Durable proof fluency comes from
months of reconstruction and feedback after the 60-day Core.

---

## How to study this module

### The working invariant

> **A mathematical claim is not established by a plausible explanation, an
> AI-generated proof, a few passing examples, a diagram, or a program run. A
> defensible claim names its domain and definitions, states its assumptions,
> gives a valid argument or identifies the theorem relied on, exposes a
> boundary or counterexample, and separates the formal result from an
> implementation or empirical observation.**

Keep this sentence visible when you read code, ask an agent for a proof, or
inspect a graph drawing. It is a teaching contract, not a theorem about the
world. It does not mean that every useful engineering decision needs a formal
proof; it means that the kind of evidence must match the claim.

### Read the labels before the mathematics

The same word can refer to a model, code, and a measurement. These labels make
the difference explicit:

| Label | What it says | What it does not say |
| --- | --- | --- |
| **[DEFINITION / MODEL]** | We choose a precise meaning inside a declared mathematical domain. | Python, a database, or the physical world automatically has that meaning. |
| **[THEOREM / PROOF]** | The conclusion follows from the stated hypotheses in that model. | The hypotheses hold in your product, or a program implements the model. |
| **[CODE CONTRACT]** | A named function promises behavior under named preconditions. | The contract is true, complete, or a proof of a broad theorem. |
| **[FINITE TRACE]** | These inputs produced this result in this execution. | Every allowed input will do so. |
| **[AI PROPOSAL]** | A draft explanation, proof, implementation, or counterexample is available for review. | It is authority or independent evidence. |

### The same learning loop, six times

1. **Predict.** Make a claim before the reveal. Write your confidence.
2. **Name the model.** What are the objects, domain, relation, or cost?
3. **Expose a boundary.** Find the smallest counterexample or missing
   assumption.
4. **Reconstruct.** Read or repair an argument one inference at a time.
5. **Trace cautiously.** Use a finite executable model to inspect a consequence.
6. **Transfer.** Decide what the model changes in a program, system, or AI
   design.

Typing is deliberately secondary. You will write a few small predicates and
proof fragments, but most work is reading, drawing, tracing, explaining,
debugging, and reviewing an agent's proposed argument.

---

## 1. Position in the knowledge system

### 1.1 What M27 deepens rather than repeats

M4 introduced logic, sets, relations, graphs, proof, a small counting and
probability foundation. M5 introduced cost models, asymptotic language, and
recurrences for algorithm analysis. M27 does not repeat their vocabulary as a
list. It makes their hidden obligations explicit:

| Earlier seed | M27 deepening | Why the distinction matters later |
| --- | --- | --- |
| “If … then …” | Quantifier scope, valid inference, converse/countermodel, formal domain. | A statistical or security claim can fail because its domain was silently changed. |
| Induction and invariant | Complete base coverage, strengthened hypothesis, structural constructors, initialization/preservation/use, extremal choice. | Correctness, loop reasoning, termination, reductions, and learning-theory arguments all use these shapes. |
| A recurrence / Big O | Base conditions, solution method, generating-function coefficients, and eventual quantified bounds under a cost model. | A plot or a few values cannot support a general performance or convergence claim. |
| A graph edge | Connectivity, tree conditions, matching variant, partial order, closure, and witness. | Search, routing, prerequisites, constraints, causal claims, and planning depend on the exact edge meaning. |

### 1.2 Prerequisite and forward map

~~~mermaid
%% atlas-diagram-id: m27-prerequisite-forward-map
%% atlas-diagram-title: M27 prerequisite and conceptual-forward map
%% atlas-diagram-alt: M2, M4, and M5 feed M27; M27 strengthens formal reasoning for later algorithms, mathematics, AI/ML, and synthesis connections without opening a learner route to preview-only capstones.
flowchart LR
    M2["M2: recursion + introductory induction"] --> M27["M27: discrete proof depth"]
    M4["M4: logic, relations, graphs"] --> M27
    M5["M5: cost model + recurrence seed"] --> M27
    M27 --> A["M6–M11: algorithms and data structures"]
    M27 --> LA["M28: linear algebra + numerical models"]
    M27 --> P["M29–M31: calculus, probability, optimization"]
    M27 --> FL["M33: formal languages + complexity"]
    M27 --> AI["M34–M36: AI, ML, learning theory"]
    M27 --> C["M26: capstone evidence and oral defense"]
~~~

### 1.3 Entry retrieval

Answer aloud or in three short notes before reading further.

1. State the difference between an implication and its converse. Give a
   two-object counterexample if they differ.
2. For a loop invariant, what must be true before the loop, after each
   iteration, and at exit?
3. In \(T(n)=2T(n/2)+n\), what other information is needed before the
   recurrence defines a cost?
4. Why can a benchmark be valuable evidence without proving a \(\Theta\)
   bound?

If 1–2 are fragile, skim M4. If 3–4 are fragile, skim M5. Do not push forward
by memorizing a template; these are the objects M27 will refine.

---

## 2. One story: the Atlas compatibility planner

We will use one fictional but realistic problem throughout.

Atlas contains learning tasks. A planner needs to decide whether tasks can
coexist in a schedule, whether prerequisites can be satisfied, and which
constraints rule out a proposed plan. A team also wants to use an AI agent to
draft explanations of the plan. Before any implementation, the team must be
able to say exactly what it is claiming.

~~~text
task names + declared prerequisite relation + chosen schedule
    → formal claim about allowed schedules
    → proof / counterexample / finite model
    → algorithmic or product decision
~~~

The fixed story is intentionally small. The mathematics is not about a course
planner; it is about the reusable shapes behind dependency managers, job
schedulers, authorization policies, network routes, database constraints,
formal languages, and model assumptions.

### 2.1 A claim card before a solution

Use this card for every exercise and agent proposal:

~~~text
Claim:
Domain:
Definitions:
Assumptions:
What must be shown or refuted:
Method / theorem:
Smallest boundary case:
Formal conclusion:
Implementation or empirical consequence:
Non-claim:
~~~

An AI may fill the card first. Your task is to mark every blank it guessed.
That is not bureaucracy: a missing domain or assumption is often the bug.

---

## 3. Session 1 — Definitions, logic, and countermodels

### Pressure

“Every learner can take some next task” and “there is one next task every
learner can take” sound similar. They are different specifications. A
recommendation engine, a compiler, and a proof can all fail when a phrase such
as “every,” “some,” “only,” or “unless” changes scope.

### First principle: a claim needs an interpretation

**[DEFINITION / MODEL]** A proposition is a statement that has a truth value
under a fixed interpretation. A predicate is a proposition-shaped expression
with free variables whose truth depends on values from a domain.

Let \(T\) be the finite set of Atlas tasks. Define:

- \(P(x)\): task \(x\) is present in the schedule;
- \(R(x,y)\): \(x\) is an immediate prerequisite of \(y\);
- \(B(x,y)\): \(x\) occurs before \(y\) in the schedule.

Then the partial-schedule policy from M4 can be written:

\[
\forall x\in T\;\forall y\in T,\quad
(R(x,y)\land P(y))\Rightarrow(P(x)\land B(x,y)).
\]

Read it in layers: pick any two tasks; if the first is an immediate
prerequisite of the second and the second appears, then the first also appears
and comes earlier. The definition does not decide whether all tasks must
appear. That is a separate product policy.

### 3.1 Implication: the forbidden row

**[DEFINITION / MODEL]** \(A\Rightarrow B\) is false only when \(A\) is true
and \(B\) is false. It does not say that \(A\) caused \(B\), happened first, or
is the only way \(B\) can be true.

| Form | Meaning | Logical status relative to \(A\Rightarrow B\) |
| --- | --- | --- |
| \(A\Rightarrow B\) | original claim | given |
| \(\lnot B\Rightarrow\lnot A\) | contrapositive | equivalent |
| \(B\Rightarrow A\) | converse | may be false |
| \(\lnot A\Rightarrow\lnot B\) | inverse | may be false |

**[COUNTEREXAMPLE]** “If a task is scheduled, it has been mastered” does not
imply “if a task has been mastered, it is scheduled today.” A learner may know
the task but choose review, rest, or a different project.

The counterexample does not prove a new policy. It refutes only the converse.

### 3.2 Quantifier order is a dependency structure

Compare:

\[
\forall x\in T\;\exists y\in T,\; R(x,y)
\qquad\text{and}\qquad
\exists y\in T\;\forall x\in T,\; R(x,y).
\]

The left says each task has some dependent (possibly a different one each
time). The right says one fixed task depends on every task. A schedule graph
with \(a\to c\) and \(b\to d\) can make the left plausible for a selected
domain while immediately refuting the right. Read quantifiers left to right:
the earlier variable may constrain the later choice.

### 3.3 Negation is a witness generator

To negate a universal, expose the one object that fails:

\[
\lnot(\forall x,\;Q(x)) \equiv \exists x,\;\lnot Q(x).
\]

Thus the negation of the partial-schedule policy is:

\[
\exists x\in T\;\exists y\in T,\quad
R(x,y)\land P(y)\land(\lnot P(x)\lor\lnot B(x,y)).
\]

This tells a debugger what a useful failure record looks like: a specific
prerequisite, dependent, and schedule witness. “Validation failed” is less
useful because it hides the counterexample.

### 3.4 Sets, functions, and relations without representation confusion

**[DEFINITION / MODEL]** A set records distinct membership, not order or
duplicates. A relation from \(A\) to \(B\) is a subset of \(A\times B\). A
function \(f:A\to B\) is a relation that gives every member of \(A\) exactly
one output in \(B\).

A Python function is not automatically a mathematical function: it may raise,
read time, mutate state, use randomness, or return different values across
calls. A Python set is a useful representation of a mathematical set under a
specified equality/hash contract; it is not the definition of a set.

| Object | Mathematical question | Atlas example |
| --- | --- | --- |
| \(A\subseteq B\) | Is every element of A also in B? | Are all scheduled tasks declared course tasks? |
| \(A\times B\) | Which ordered pairs are possible? | Which prerequisite–dependent pairs could be declared? |
| relation \(R\) | Which pairs actually hold? | Immediate prerequisite edges. |
| total function \(f:A\to B\) | Does each allowed input get exactly one output? | A stable task-to-module owner assignment. |
| injection | Can two inputs share an output? | Can two task IDs claim one unique storage key? |
| surjection | Is every target reached? | Does every required skill have an owning task? |

### 3.5 Relation properties are testable definitions

For a relation \(R\) on a set \(A\):

| Property | Formal definition | Small boundary |
| --- | --- | --- |
| reflexive | \(\forall x\in A,\;xRx\) | A prerequisite relation normally fails this: a task does not immediately require itself. |
| symmetric | \(xRy\Rightarrow yRx\) | \(a\to b\) without \(b\to a\) refutes symmetry. |
| antisymmetric | \(xRy\land yRx\Rightarrow x=y\) | A two-way edge between distinct tasks refutes it. |
| transitive | \(xRy\land yRz\Rightarrow xRz\) | Immediate edges need not be transitive; their closure may be. |
| equivalence | reflexive, symmetric, transitive | “same prerequisite bundle” can be an equivalence only if all three are proved. |

An equivalence relation partitions a set into equivalence classes. This is
useful when multiple syntactic task labels mean the same semantic objective.
But normalizing labels is a product rule, not a theorem: define it, test it,
and document collisions.

### Predict before reveal — the two quantifiers

Let the domain be \(\{a,b\}\). Let \(Likes(x,y)\) mean “task x can be paired
with task y in one session.” Suppose \(Likes(a,a)\), \(Likes(a,b)\), and
\(Likes(b,b)\) hold, but \(Likes(b,a)\) does not.

Before revealing, decide which is true:

A. \(\forall x\exists y,\ Likes(x,y)\) only  
B. \(\exists y\forall x,\ Likes(x,y)\) only  
C. both  
D. neither

<details>
<summary>Reveal after writing your prediction.</summary>

**Reveal:** A is true: choose a for x=a and b for x=b. B is also true:
choose y=b, which both a and b like. Change the relation so only
\(Likes(a,a)\) and \(Likes(b,b)\) hold: A stays true but B becomes false. The
model, not the symbol count, decides the answer.

</details>

### Session 1 code-reading task

Read the function contract before tracing it:

~~~python
def classify_relation(
    domain: frozenset[str],
    pairs: frozenset[tuple[str, str]],
) -> dict[str, bool]:
    """Classify a finite relation whose pairs must lie in domain × domain."""
    ...
~~~

Questions:

1. Which finite-domain assumption makes exhaustive checking possible?
2. Why is a result saying “transitive” about these stored pairs not the same
   as “the program found every real prerequisite”?
3. Construct the smallest input that is antisymmetric but not symmetric.
4. Which condition would make the word “equivalence” legal?

The downloadable model later in this module provides one answer. Read it as a
finite checker for a declared relation, not as a theorem prover.

---

## 4. Session 2 — Proof construction, induction, invariants, and extremal choice

### Pressure

A proof can look polished while assuming its conclusion, skipping a base case,
or proving a neighboring claim. An AI-generated proof is especially dangerous
here: locally fluent sentences can conceal a quantifier jump.

### 4.1 Direct proof, contrapositive, and contradiction

Choose a method because it fits the logical shape.

| Goal shape | Productive move | Common failure |
| --- | --- | --- |
| \(A\Rightarrow B\) with usable structure in A | Assume A and derive B directly. | Restating B instead of deriving it. |
| \(A\Rightarrow B\) where \(\lnot B\) is concrete | Prove \(\lnot B\Rightarrow\lnot A\). | Accidentally proving the inverse. |
| A statement incompatible with a negation | Assume the negation and derive a contradiction. | Treating “this feels impossible” as a contradiction. |
| \(\forall n\in\mathbb N,\ P(n)\) | Cover bases, state induction hypothesis, prove the next case. | Using \(P(n+1)\) before deriving it. |

**[THEOREM / PROOF]** A finite directed graph with a topological order has no
directed cycle.

**Proof idea (contrapositive):** Suppose the graph has a directed cycle. A
topological order would put each edge's source before its target. Follow those
strict-before requirements around the cycle. The starting vertex would need to
appear before itself, impossible in a strict order.

**Assumptions to name:** edges are directed; “topological order” means every
edge points forward; the cycle has at least one edge. The proof does not say an
arbitrary implementation finds such an order, nor does it show a graph drawing
was correctly transcribed.

### 4.2 Ordinary induction is a chain of permissions

To prove \(P(n)\) for every \(n\ge n_0\):

1. **Base coverage:** prove \(P(n_0)\) (and any other bases the step needs).
2. **Induction hypothesis:** assume \(P(k)\) for an arbitrary \(k\ge n_0\).
3. **Induction step:** derive \(P(k+1)\) from the hypothesis and definitions.
4. **Conclusion:** state the quantified domain reached.

**[THEOREM / PROOF]** For \(n\ge0\), the sum of the first n nonnegative
integers is \(0+1+\cdots+n=n(n+1)/2\).

**Base n=0:** left side is 0; right side is \(0(1)/2=0\).

**Step:** assume the formula for arbitrary k. Then

\[
0+\cdots+k+(k+1)
=\frac{k(k+1)}2+(k+1)
=\frac{(k+1)(k+2)}2.
\]

That is the formula at k+1. The conclusion is valid for every nonnegative
integer because base and step cover the declared chain.

**[COUNTEREXAMPLE]** “The formula works for n=0, 1, and 2; therefore it works
for all n” checks three traces but supplies no step. It is evidence about
three values, not an induction proof.

### 4.3 Strong induction when the next object needs several earlier ones

Sometimes \(P(k+1)\) requires all \(P(0),\dots,P(k)\), not just \(P(k)\).
Strong induction explicitly assumes the whole earlier prefix. It is logically
valid because the ordinary induction principle can be applied to the stronger
claim “all cases up to n hold.”

Use it only when the decomposition needs it. “Strong” means a stronger
hypothesis, not a more persuasive tone.

### 4.4 Structural induction follows constructors, not numbers

An expression grammar may be:

~~~text
Expr ::= number
       | add(Expr, Expr)
       | negate(Expr)
~~~

To prove a property of every Expr:

- prove it for a number;
- assuming it for e1 and e2, prove it for add(e1,e2);
- assuming it for e, prove it for negate(e).

There is no hidden “next integer.” The constructors define what can exist.
This later becomes essential for syntax trees, recursively defined data,
inductive types, dynamic programming states, and formal languages.

### 4.5 Loop invariants: induction over execution states

Consider a task-selection scan:

~~~python
best = None
for task in candidates:
    if best is None or score(task) > score(best):
        best = task
return best
~~~

**[DEFINITION / MODEL]** A loop invariant is a property true before the loop
and preserved by every iteration. It supports a postcondition only together
with initialization, preservation, termination, and the condition known when
the loop ends.

A good invariant is:

> After processing the first i candidates, best is a maximum-score task among
> those i candidates (or None exactly when i is zero).

| Obligation | Argument sketch | What a short trace cannot replace |
| --- | --- | --- |
| Initialization | Before processing, i=0 and best=None. | Proof for every empty-prefix state. |
| Preservation | Compare the next task with the previous maximum. Either keep a maximum or replace it with a no-smaller one. | Proof for every allowed score arrangement. |
| Termination | A finite iterator advances until no candidates remain. | A guarantee for an unbounded or side-effecting iterator. |
| Use | At exit, i equals the candidate count, so best is maximum among all candidates. | A policy for ties, missing scores, or external mutation unless specified. |

This is ordinary induction disguised as state reasoning. M19 will use the
same form over concurrent histories; M34 will use it to justify search
invariants; M36 will use it in algorithmic arguments.

### 4.6 Extremal arguments make “choose the first/least” legal

An extremal argument begins by choosing a minimal or maximal object from a
finite nonempty set, then shows that choice cannot have a forbidden property.

**Example proof idea:** A finite DAG has a vertex with no incoming edge.
Assume every vertex has an incoming edge. Start anywhere and repeatedly follow
an incoming edge. Finiteness forces a repeated vertex, forming a directed
cycle, contradiction. Equivalently, choose a vertex with a longest backwards
path; an incoming edge would extend it.

Notice the dependency: finiteness is not decoration. Remove it and an infinite
chain can have no first vertex. State the domain before using “choose a
minimal.”

### Proof repair lab

An agent writes:

> “Every schedule generated by repeatedly choosing a zero-in-degree task is
> valid. Base: the empty schedule is valid. Step: choose any next task. It has
> zero in-degree, so it is valid. Thus all schedules are valid.”

Repair it before asking for code.

1. **Missing invariant:** all scheduled tasks respect their prerequisite
   edges; remaining unscheduled tasks retain the correct induced graph.
2. **Missing domain:** finite graph; zero in-degree is computed in the
   remaining graph; each chosen task is appended exactly once.
3. **Missing preservation argument:** a zero-in-degree remaining task has no
   unscheduled prerequisite, and already scheduled prerequisites lie earlier.
4. **Missing boundary:** if the remaining graph has a cycle, there may be no
   zero-in-degree task.
5. **Correct conclusion:** this establishes a valid order when the process
   consumes every vertex; it does not establish that arbitrary “choose any
   task” behavior is valid.

### Session 2 oral micro-rehearsal

Say the loop-invariant argument without symbols:

> “Before the scan, I have seen no candidates, so no maximum has to exist.
> After each candidate, I either keep the best of the old prefix or replace it
> with a candidate no worse than that best. When no candidates remain, the
> prefix is the whole input. This depends on a finite, stable candidate
> sequence and a score comparison policy.”

If this explanation feels unclear, do not add notation. Draw prefixes of size
0, 1, and 2 and state the invariant at each.
---

## 5. Session 3 — Counting, recurrences, generating functions, and asymptotics

### Pressure

Counting determines how many possibilities an algorithm, a search process, or
a privacy threat model must distinguish. A recurrence makes recursive work or
a discrete process precise. Neither becomes valid because the first few values
look right.

### 5.1 Addition, product, bijection, and pigeonhole

**[DEFINITION / MODEL]** The addition rule counts a union of **disjoint**
cases. The product rule counts a sequence of choices with a well-defined
choice set at each stage. A bijection proves two finite sets have the same size
by giving an invertible one-to-one correspondence.

| Rule | Safe form | Boundary that breaks a careless use |
| --- | --- | --- |
| Addition | \( |A\cup B|=|A|+|B| \) if \(A\cap B=\varnothing\). | “Tasks requiring proof or graphs” double-counts tasks requiring both. |
| Product | a choices then b choices yields ab ordered pairs. | The second choice may depend on the first; count the actual branch sizes. |
| Bijection | Map each object to exactly one distinct object and back. | A rule that loses information is not a bijection. |
| Pigeonhole | More objects than boxes force a shared box. | You must name the objects, boxes, and mapping; “many” is not a bound. |

**Inclusion–exclusion:** for two finite sets,
\[
|A\cup B|=|A|+|B|-|A\cap B|.
\]
The subtraction repairs overlap. Use it only after naming the sets and why
their intersection is the double-counted region.

**Pigeonhole transfer:** If 13 learner submissions are assigned one of 12
monthly review slots, at least two share a month. The theorem says nothing
about whether sharing is fair, safe, or an acceptable product policy. It
certifies a combinatorial fact about the declared mapping.

### 5.2 Binomial coefficients derive from a recurrence

\(\binom nk\) counts k-element subsets of an n-element set. It satisfies

\[
\binom nk=\binom{n-1}{k}+\binom{n-1}{k-1}
\]

for \(0<k<n\), with edge conditions \(\binom n0=\binom nn=1\).

**Proof idea:** fix one distinguished element. A k-subset either omits it
(choose k from the other n-1) or includes it (choose k-1 from the other n-1).
The cases are disjoint and exhaustive.

The recurrence without its edge conditions is incomplete. For example,
\(a_n=a_{n-1}+a_{n-2}\) describes infinitely many sequences until values such
as \(a_0\) and \(a_1\) are supplied.

### Numerical experiment: formula versus enumeration

**Predict before reveal.** For four labelled tasks, predict the number of
two-task review pairs. State whether you expect the formula
\(\binom{4}{2}\), a direct enumeration, and the row-sum identity to agree, and
name one reason they might disagree in a program.

Use two deliberately small, inspectable calculations:

~~~python
from itertools import combinations

tasks = ("a", "b", "c", "d")
enumerated_pairs = tuple(combinations(tasks, 2))
formula_count = binomial_coefficient(4, 2)
row_sum = sum(binomial_coefficient(4, k) for k in range(5))
~~~

The expected finite checks are `len(enumerated_pairs) == formula_count == 6`
and `row_sum == 16 == 2**4`. Inspect the actual six pairs, not only the
count: an off-by-one domain, a repeated task, or an unordered/ordered-pair
confusion can preserve a plausible number while changing the claim.

**Boundary:** this finite experiment is a debugging and model-checking aid. It
does not prove Pascal's recurrence for every \(n,k\), establish an asymptotic
bound, or validate a production implementation for huge inputs. The proof
still needs the disjoint include/exclude partition and stated edge conditions.

### 5.3 Recurrence: relation, domain, and base conditions

State all three:

~~~text
Quantity: T(n), cost in a declared operation model.
Domain: n is a positive power of two.
Base: T(1) = c.
Relation: T(n) = 2T(n/2) + n for n > 1.
~~~

This recurrence models two half-size subproblems plus n local work. A
recursion-tree argument gives \(\Theta(n\log n)\) under that model:

- level 0 costs n;
- level 1 costs \(2(n/2)=n\);
- every level costs n;
- there are \(\log_2 n+1\) levels.

**[THEOREM / PROOF boundary]** The conclusion is about the recurrence and its
assumptions. It is not automatically a measured Python runtime. A call can
have allocation, interpreter, cache, I/O, and input-distribution costs beyond
the chosen local-work term.

### 5.4 Generating functions: encode a sequence by coefficients

For a sequence \(a_0,a_1,\ldots\), its ordinary generating function is the
formal series

\[
A(x)=\sum_{n\ge0}a_nx^n.
\]

Use this first as **formal coefficient algebra**. Multiplying two series
corresponds to a convolution of coefficients. For example, the coefficient of
\(x^n\) in \(1/(1-x)=1+x+x^2+\cdots\) is 1 in the formal-power-series sense.

**Boundary:** algebra with formal series does not by itself prove analytic
convergence, justify a numerical approximation, or permit swapping limits.
Those are analysis questions in M29. In M27, say which coefficient you are
extracting and check the base coefficient.

**Tiny derivation:** Let \(F_n\) satisfy \(F_0=0,F_1=1\), and
\(F_n=F_{n-1}+F_{n-2}\). Multiplying the recurrence by \(x^n\) and summing
carefully yields

\[
F(x)=x+xF(x)+x^2F(x),
\quad\text{so}\quad
F(x)=\frac{x}{1-x-x^2}.
\]

The algebra is useful because it packages every recurrence equation into one
object. Do not memorize the fraction; reconstruct the missing initial terms
that create the lone x.

### 5.5 Asymptotic notation is quantified and eventual

**[DEFINITION / MODEL]** For nonnegative functions on sufficiently large
integers, \(f\in O(g)\) means there exist constants \(c>0\) and \(n_0\) such
that for every \(n\ge n_0\), \(f(n)\le c\,g(n)\).

\(\Omega(g)\) reverses the eventual inequality; \(\Theta(g)\) means both an
upper and lower bound. The notation omits neither the domain nor the cost
model. “One loop” is not a proof of \(O(n)\), and a runtime plot cannot prove
the quantified statement.

**Proof sketch:** \(3n^2+10n+7\in O(n^2)\). For \(n\ge1\),
\[
3n^2+10n+7\le 3n^2+10n^2+7n^2=20n^2.
\]
Choose \(c=20,n_0=1\). A lower bound such as \(3n^2\le3n^2+10n+7\) gives
\(\Omega(n^2)\); together they give \(\Theta(n^2)\).

**[FINITE TRACE boundary]** Timing values at n=100, 200, and 400 may be
consistent with a model. They cannot show the required inequality for every
large n, nor identify an implementation's primitive operation costs.

### Session 3 code-reading task

Study the model function:

~~~python
def binomial_coefficient(n: int, k: int) -> int:
    """Return C(n, k) for nonnegative n and 0 <= k <= n."""
    ...
~~~

Trace n=0, n=1, and n=4. Then answer:

1. Which base case prevents an empty previous row from being indexed?
2. Which combinatorial partition justifies the interior addition?
3. What does an integer result establish? What does it not establish about a
   memory-safe, fast, or numerically stable implementation at huge n?
4. How could you independently check the row sum \(\sum_k\binom nk=2^n\)?

---

## 6. Session 4 — Graphs, trees, connectivity, and matchings

### Pressure

A picture with dots and arrows is not yet a graph model. Whether an edge is
directed, weighted, temporal, causal, or a declared prerequisite changes the
question an algorithm answers.

### 6.1 The graph model comes before the algorithm

**[DEFINITION / MODEL]** A graph is \(G=(V,E)\). In a directed graph,
\(E\subseteq V\times V\). In an undirected graph, an edge is an unordered
two-element subset (under a simple-graph convention).

Name:

- **walk:** consecutive edges, repetitions allowed;
- **path:** a walk without repeated vertices under the chosen convention;
- **cycle:** a nonempty closed path;
- **connected:** every pair has a path in an undirected graph;
- **strongly connected:** directed paths exist both ways for every pair;
- **tree:** a connected undirected graph with no cycle;
- **DAG:** a directed graph with no directed cycle.

The same adjacency data can represent different models. A social connection is
not necessarily causation. A network link is not delivery. A prerequisite edge
is not an estimate of learning time.

### 6.2 Trees: three equivalent finite characterizations

For a finite undirected graph with n vertices, each of the following is
equivalent to being a tree:

1. connected and acyclic;
2. connected with n-1 edges;
3. acyclic with n-1 edges;
4. exactly one simple path between every pair of vertices.

Do not use this theorem by pattern recognition alone. It needs a finite,
undirected, simple-graph convention. A directed prerequisite graph can be a
DAG but is not automatically a tree, even if its drawing looks hierarchical.

### 6.3 Connectivity is a reachability claim

A traversal returns evidence about the represented graph. Given an edge list,
you can use BFS/DFS in M10 to compute reachable vertices. The theorem-level
meaning is:

> If the representation exactly contains the intended graph and traversal
> marks exactly reachable vertices, then the marked set describes reachability
> in that model.

Every italicized condition matters. A parser could omit an edge; a graph could
be stale; “reachable” could fail to mean “authorized,” “safe,” or “will
respond.” M20–M22 revisit this distinction at systems boundaries.

### 6.4 Matchings: maximal is not maximum

**[DEFINITION / MODEL]** A matching is a set of edges with no shared endpoint.
A matching is **maximal** if no edge can be added without violating the
condition. It is **maximum** if no other matching contains more edges.

**[COUNTEREXAMPLE]** In the three-edge path:

~~~text
left p — right 1
left p — right 2
left q — right 2
~~~

The single edge \(p\text{—}2\) is maximal: adding either remaining edge
shares p or 2. But it is not maximum, because \(\{p\text{—}1,q\text{—}2\}\)
has two edges. A locally valid greedy choice can block a better global result.

This is a reusable AI-era review habit: a local score, agent action, or
greedy selection can be admissible without being optimal.

### 6.5 Hall's theorem has a sharply bounded scope

**[THEOREM / PROOF]** For a finite bipartite graph with left part L and right
part R, there is a matching that covers every vertex of L exactly when, for
every subset \(S\subseteq L\), its neighborhood satisfies
\[
|N(S)|\ge |S|.
\]

Use this only after naming:

1. the bipartition;
2. the side to be covered;
3. \(N(S)\), the vertices adjacent to at least one member of S;
4. the universal quantifier over **every** subset of that side.

Checking only single vertices is not enough. Two left tasks can each have one
possible mentor, yet both may point to the same mentor and fail for their
two-element subset. A rendered bipartite graph is not proof that Hall's
condition holds.

### 6.6 A small graph proof and a code boundary

**[THEOREM / PROOF]** Every finite tree with at least two vertices has at least
two leaves.

**Proof idea:** choose a longest simple path. Its endpoints cannot have an
unused neighbor; otherwise that neighbor would extend the path. Thus both
endpoints have degree one (under the tree definition).

**Boundary:** the proof depends on finite connected acyclic undirected graph.
In a directed graph, “leaf” needs a new definition. In an infinite tree, a
longest path may not exist.

### Session 4 studio task

Open the **Proof & Counterexample Workbench** above this reader after it
appears. In its matching pane:

1. predict whether the displayed greedy matching is maximum;
2. state your confidence;
3. inspect the augmenting-path witness after reveal;
4. say which word—maximal or maximum—your initial explanation used;
5. write one new graph where greedy *does* happen to find a maximum matching,
   then explain why that success is not a theorem about every graph.


---

## 7. Session 5 — Partial orders, lattices, and elementary number theory

### Pressure

“Before,” “more specific than,” “contains,” and “divides” all form orders in
some settings, but not necessarily total orders. Treating a partial order as a
single ranked list creates false choices and impossible constraints.

### 7.1 Partial orders distinguish comparable from incomparable

**[DEFINITION / MODEL]** A partial order \(\preceq\) on a set A is reflexive,
antisymmetric, and transitive. A total order adds comparability: for every
a,b, either \(a\preceq b\) or \(b\preceq a\).

The subset relation \(\subseteq\) on sets is a partial order. The sets
\(\{proof\}\) and \(\{graphs\}\) are incomparable: neither is a subset of the
other. This is useful, not a defect. It represents two independent
requirements.

A **Hasse diagram** displays a finite poset after omitting reflexive and
transitive edges. Its visual absence of an edge does not mean the relation is
false; it may be implied by a chain.

### 7.2 Lattices require every pair to have a meet and join

For elements a and b in a poset:

- a **lower bound** is below both;
- the **greatest lower bound** (meet) is \(a\wedge b\);
- an **upper bound** is above both;
- the **least upper bound** (join) is \(a\vee b\).

**[DEFINITION / MODEL]** A lattice is a poset in which every pair has a meet
and a join. Having a top and bottom element is not enough. Having a meet/join
for one attractive pair is not enough.

The power set of a fixed set, ordered by subset, is a lattice:
\[
A\wedge B=A\cap B,\qquad A\vee B=A\cup B.
\]

**[COUNTEREXAMPLE]** Build a poset with two incomparable elements that have
two different minimal upper bounds and no least one. It is a valid poset but
not a lattice. The workbench can present a finite case; the formal definition
is still “every pair.”

### 7.3 Divisibility gives a number-theory order

For positive integers, write \(a\mid b\) when \(b=ak\) for some integer k.
This relation is reflexive, antisymmetric on positive integers, and transitive,
so it is a partial order.

For positive divisors of a fixed positive integer n, the meet is gcd and the
join is lcm. Restricting the domain matters: all positive integers under
divisibility do not form a lattice in the same simple finite sense needed for
this module.

### 7.4 GCD, Bézout, and modular inverses

**[DEFINITION / MODEL]** \(a\equiv b\pmod m\) means m divides \(a-b\).
For positive m, an integer x is a modular inverse of a modulo m when
\[
ax\equiv1\pmod m.
\]

**[THEOREM / PROOF]** a has an inverse modulo positive m exactly when
\(\gcd(a,m)=1\).

**Proof idea:** If \(\gcd(a,m)=1\), Bézout's identity gives integers x,y with
\(ax+my=1\); reduce modulo m to get \(ax\equiv1\). Conversely, if
\(ax\equiv1\), any common divisor of a and m divides the left side and hence
divides 1, so the gcd is 1.

**[CODE CONTRACT boundary]** Python's modular-inverse form
<code>pow(a, -1, m)</code> is a versioned API behavior and raises when an
inverse does not exist. It demonstrates a particular computation under its
contract; it is not a cryptographic security proof and it does not remove the
need to check a positive modulus and gcd precondition in your own domain model.

### 7.5 A number-theory trace

Find the inverse of 7 modulo 26.

~~~text
26 = 3·7 + 5
 7 = 1·5 + 2
 5 = 2·2 + 1

1 = 5 - 2·2
  = 5 - 2·(7 - 5)
  = 3·5 - 2·7
  = 3·(26 - 3·7) - 2·7
  = 3·26 - 11·7
~~~

Thus \(-11\) is an inverse; modulo 26 that is 15. Check:
\(7\cdot15=105\equiv1\pmod{26}\).

**[FINITE TRACE]** This establishes the calculation for 7 and 26. The
theorem establishes the general iff statement under the named conditions.

### Session 5 code-reading task

Read the model signature:

~~~python
def modular_inverse(value: int, modulus: int) -> int:
    """Return x in range(modulus) with value*x congruent to 1 modulo modulus.

    Raises ValueError unless modulus > 1 and gcd(value, modulus) is 1.
    """
    ...
~~~

Before running it:

1. Predict the result of modular_inverse(7, 26): it should return 15.
2. Predict the error condition for modular_inverse(6, 15).
3. Explain why Python's modular operation is an implementation mechanism while
   Bézout supplies the mathematical reason.
4. Name one unsafe conclusion to reject: “the inverse exists, therefore this
   protocol is secure.”

---

## 8. Session 6 — Integrate the models: proof dossier and AI review

### Pressure

An agent can draft a correct-looking proof, find an example, write a function,
and plot a curve in seconds. It cannot choose your intended domain, detect
every hidden premise, or be the accountable owner of a claim. This final
session practices human verification under time pressure without turning the
work into an exam.

### 8.1 The Atlas proof dossier

Choose one of these cases:

| Case | Central claim | Required mathematics |
| --- | --- | --- |
| Prerequisite planner | A proposed course order is valid or contains a witness violation. | Relations, DAG/order, invariant, finite code contract. |
| Reviewer assignment | Every critical task can receive a distinct reviewer, or a bottleneck is exposed. | Bipartite graph, matching, Hall boundary, counterexample. |
| Duplicate-safe identifier | An identifier can be transformed and reversed modulo m only under a stated condition. | GCD, Bézout, modular inverse, implementation boundary. |
| Search cost decision | A planner's candidate enumeration will or will not fit a declared budget. | Counting, recurrence/asymptotics, finite benchmark boundary. |
| Constraint vocabulary | A set of task requirements has a least common refinement or does not. | Poset, meet/join, lattice counterexample. |

Build the dossier in this order:

1. **Claim card.** State domain, symbols, assumptions, and non-claim.
2. **Minimal counterexample.** Make a false converse, missing hypothesis, or
   greedy failure visible.
3. **Proof or theorem reconstruction.** Label definition, inference,
   conclusion, and where an external theorem enters.
4. **Finite reference trace.** Use the module27_reference.py download only on
   declared finite inputs. Preserve its input and output.
5. **Code/architecture review.** Identify representation, algorithmic
   responsibility, and contract boundary.
6. **Transfer.** Explain a consequence for an AI agent, system design, or
   future module.
7. **Oral defense.** Explain the argument, accept a changed premise, and
   choose one smallest next bridge.

### 8.2 Review an AI proposal as a proof editor

Give an agent this bounded prompt:

> Model task prerequisites as a finite directed graph. State whether a proposed
> schedule is valid, give one witness if not, and explain the asymptotic cost
> under adjacency-list and position-dictionary assumptions. Do not infer
> missing course edges or claim that tests prove the result. Put every
> assumption and base condition in the response.

Then audit it:

| Review question | What a strong answer includes |
| --- | --- |
| What is the domain? | finite vertex set, directed edges, schedule convention, duplicate policy |
| What does “valid” quantify over? | every represented edge whose dependent is scheduled, or a declared complete-route policy |
| Is the proof method legal? | base/step or invariant obligations, no circular conclusion |
| Can a claim be refuted? | smallest edge/schedule or graph witness |
| What does the code prove? | nothing by itself; tests a finite implementation against selected contracts |
| Is a complexity claim scoped? | representation, operation costs, size parameters, case |
| What changes the conclusion? | cycle, missing edge, altered duplicate policy, different graph/storage model |

Reject “It is correct because I tested it” and “the proof is obvious” with the
same question: **which universal statement, under which assumptions, did that
actually establish?**

### 8.3 Six-session synthesis table

| Session | Model built | Prediction / repair | Artifact | Forward bridge |
| --- | --- | --- | --- | --- |
| 1 | domains, predicates, sets, functions, relations | quantifier-order countermodel | claim card + relation classification | specifications, constraints, data models |
| 2 | proof methods, induction, structural induction, invariant, extremal choice | repair a flawed topological-order proof | proof annotation | algorithm correctness and program state |
| 3 | counting, recurrence, generating function, asymptotics | identify missing base condition / cost model | recurrence and bound sheet | algorithm selection, combinatorial search |
| 4 | graph, tree, connectivity, matching | maximal-vs-maximum counterexample | graph witness sheet | M10, M34, networks and routing |
| 5 | poset, lattice, divisibility, modular inverse | meet/join or inverse precondition | order / Euclid trace | algebra, security boundaries, formal models |
| 6 | evidence integration and AI review | what premise changes the result? | Atlas proof dossier + oral summary | M28–M36 and M26 capstone |

---

## 9. Proof & Counterexample Workbench

The portal provides an interactive **Proof & Counterexample Workbench** for
this module. It is a local teaching surface, not a grader or proof assistant.
It uses synthetic finite cases, preserves no voice or transcript, and gives a
text-equivalent explanation for every visual relationship.

Use it in this order:

1. Choose a claim in the **quantifier and countermodel** pane.
2. Make a prediction and select confidence before seeing the counterexample.
3. In the **invariant repair** pane, identify the missing proof obligation.
4. In the **structure witness** pane, distinguish a locally legal matching,
   order, or graph step from the global property it fails to establish.
5. Copy only your concise reflection after you decide whether to save it in
   Notion. The portal does not silently record it.

The workbench is intentionally narrow. It helps you inspect one finite
mechanism; it cannot prove an arbitrary theorem, validate an external graph,
or establish the correctness of an AI-generated argument.

---

## 10. Problem ladder — from recognition to design judgment

### A. Recognize

For eight statements, mark definition, theorem hypothesis, proof step,
implementation contract, finite observation, or AI proposal. Rewrite one
unlabeled statement so its evidence category is visible.

### B. Countermodel

Negate each claim and construct the smallest witness:

1. “Every scheduled task has all prerequisites.”
2. “Every maximal matching is maximum.”
3. “Every poset with a top and bottom is a lattice.”
4. “If an implementation timed 2 ms, it is \(\Theta(n)\).”

### C. Proof reading

Annotate a supplied induction proof. Circle every base case, induction
hypothesis, use of the hypothesis, algebraic step, and conclusion. If one is
missing, write the smallest repair rather than a new proof.

### D. Trace

Use the reference model to classify a relation, find a cycle or topological
order, validate two matchings, and calculate two modular inverse cases. For
each output, write the general claim it illustrates and the stronger claim it
does **not** establish.

### E. Derive

Choose one:

- derive Pascal's recurrence from the include/exclude partition;
- solve a small recurrence with its bases;
- prove a loop invariant for selecting a minimum;
- show the modular-inverse iff statement from Bézout;
- prove that a finite tree has two leaves.

### F. Debug

An agent's scheduler checks only adjacent items in a proposed route. Construct
the smallest non-adjacent prerequisite it wrongly accepts. Write the corrected
predicate before asking for code.

### G. Design

Design a reviewer-assignment service. State:

- graph vertices and which side of a bipartition each belongs to;
- edge meaning and whether it is current/authorized/available;
- matching objective;
- the Hall-type bottleneck evidence you would need;
- duplicate, privacy, and human-override policies;
- what a successful finite test cannot establish.

### H. Transfer

Choose one future-facing challenge:

- **M28:** explain why linear independence is a definition plus a proof
  obligation, not a visual intuition about arrows.
- **M30:** state why a probability model needs a sample space and conditions
  before Bayes' rule becomes a product decision.
- **M33:** outline the shape of a reduction without reversing the implication.
- **M34:** defend an admissible A* heuristic by identifying the theorem's
  domain and counterexample boundary.
- **M35/M36:** distinguish a finite benchmark result from a generalization
  statement and name the data/model assumptions needed.

---

## 11. Confidence-aware diagnostic

Record **guess**, **somewhat**, **strong**, or **certain** confidence before
revealing each answer. A high-confidence error is a useful target for repair,
not a penalty.

### Question 1 — quantifier scope

Which statement correctly negates “Every accepted route contains all of its
declared prerequisites”?

A. No accepted route contains a prerequisite.  
B. At least one accepted route omits at least one declared prerequisite.  
C. Every rejected route contains a prerequisite.  
D. At least one prerequisite appears in every route.

<details>
<summary>Reveal after recording your answer and confidence.</summary>

**Answer: B.** Negating a universal produces an existential witness and
negates the inner property.

- A says much more than the negation.
- C changes accepted to rejected.
- D changes both quantifier order and predicate.

</details>

### Question 2 — relation and function

Which statement about a mathematical function \(f:A\to B\) is required?

A. Every value in B must be used.  
B. Each value in A receives exactly one value in B.  
C. No two values in A may share an output.  
D. The implementation must be a Python function.

<details>
<summary>Reveal after recording your answer and confidence.</summary>

**Answer: B.** A total function assigns exactly one output to every input in
its domain.

- A is surjectivity, which is stronger.
- C is injectivity, also stronger.
- D confuses a language construct with a mathematical definition.

</details>

### Question 3 — proof form

To prove \(P\Rightarrow Q\), which claim is logically equivalent?

A. \(Q\Rightarrow P\)  
B. \(\lnot P\Rightarrow\lnot Q\)  
C. \(\lnot Q\Rightarrow\lnot P\)  
D. \(P\Leftrightarrow Q\)

<details>
<summary>Reveal after recording your answer and confidence.</summary>

**Answer: C.** This is the contrapositive.

- A is the converse.
- B is the inverse.
- D adds the converse, making a stronger claim.

</details>

### Question 4 — induction/invariant

Which omission makes this loop-invariant argument invalid: “The invariant held
after three traced iterations, so it holds after every iteration”?

A. The invariant needs an initialization and a preservation argument.  
B. The code needs an import.  
C. A loop can never be reasoned about formally.  
D. The invariant is automatically a recurrence.

<details>
<summary>Reveal after recording your answer and confidence.</summary>

**Answer: A.** A trace samples a few states. An invariant needs a proof that it
holds initially and is preserved for every allowed iteration, plus termination
and exit reasoning when used for a postcondition.

- B is irrelevant.
- C is false.
- D mixes distinct concepts.

</details>

### Question 5 — counting and recurrence

Why is \(a_n=a_{n-1}+a_{n-2}\) not a complete specification of a sequence?

A. It needs a programming language.  
B. It needs at least enough base values and a domain.  
C. Recurrences only describe exponential processes.  
D. It has no plus sign.

<details>
<summary>Reveal after recording your answer and confidence.</summary>

**Answer: B.** The relation permits many sequences until bases and domain are
declared.

- A confuses a mathematical model with an implementation.
- C is false.
- D is irrelevant.

</details>

### Question 6 — matching

Which statement is always true?

A. Every maximal matching is maximum.  
B. Every maximum matching is maximal.  
C. A greedy matching is always maximum in a bipartite graph.  
D. Hall's condition only needs to be checked for singleton subsets.

<details>
<summary>Reveal after recording your answer and confidence.</summary>

**Answer: B.** If a maximum matching could be extended, it was not maximum.

- A fails on the three-edge path.
- C needs extra structure not supplied.
- D misses a possible multi-vertex bottleneck.

</details>

### Question 7 — lattice

A finite poset has a top element and a bottom element. What follows?

A. It is necessarily a lattice.  
B. Every pair necessarily has a meet and join.  
C. It may still fail to be a lattice because some pair lacks a meet or join.  
D. It is necessarily a total order.

<details>
<summary>Reveal after recording your answer and confidence.</summary>

**Answer: C.** Lattice requires a meet and join for every pair.

- A and B overclaim.
- D confuses partial order with total order.

</details>

### Question 8 — asymptotics

A program's runtime roughly quadruples when input size doubles over four
measured sizes. What is the strongest justified conclusion?

A. The program is proved \(\Theta(n^2)\).  
B. The observation is consistent with quadratic growth under that experiment.  
C. The source must have two nested loops.  
D. Hardware cannot affect the measurement.

<details>
<summary>Reveal after recording your answer and confidence.</summary>

**Answer: B.** The measurements are useful but scoped evidence.

- A promotes a finite observation into a quantified proof.
- C infers syntax from a trend.
- D ignores the runtime and measurement environment.

</details>

### Question 9 — modular inverse

For positive modulus m, when does a have a multiplicative inverse modulo m?

A. Always.  
B. Exactly when \(a>m\).  
C. Exactly when \(\gcd(a,m)=1\).  
D. Exactly when a is prime.

<details>
<summary>Reveal after recording your answer and confidence.</summary>

**Answer: C.** Bézout supplies the witness when the gcd is one.

- A fails for 6 modulo 15.
- B is unrelated.
- D is neither necessary nor sufficient as stated.

</details>

### Question 10 — evidence boundary

A finite Python checker reports that a relation on six named tasks is
transitive. What has it established?

A. Every real prerequisite relation is transitive.  
B. The named finite pairs satisfy the checker's transitivity definition, if
its input contract and implementation are correct.  
C. The task graph has no cycle.  
D. The code is portable across all Python implementations.

<details>
<summary>Reveal after recording your answer and confidence.</summary>

**Answer: B.** The result is conditional and finite.

- A overgeneralizes the domain.
- C does not follow from transitivity.
- D is a separate implementation claim.

</details>

### Question 11 — generating functions

When you manipulate an ordinary generating function as a formal power series,
what is the safe conclusion?

A. Its numerical series converges for every real x.  
B. A coefficient identity follows from valid formal-series algebra.  
C. A numerical approximation is automatically stable.  
D. It establishes a probability distribution.

<details>
<summary>Reveal after recording your answer and confidence.</summary>

**Answer: B.** Formal power-series reasoning supports coefficient identities.

- A needs analytic convergence conditions.
- C needs numerical analysis and conditioning.
- D needs a separately defined probability model.

</details>

### Interpret the pattern, not the score

| Pattern | Next action |
| --- | --- |
| Q1–Q3 fragile | Rebuild implication, function, negation, and countermodel with two objects. |
| Q4 fragile | Put initialization, preservation, termination, and use on a proof-repair card. |
| Q5, Q8, or Q11 fragile | Put recurrence bases, cost model, and formal-versus-finite boundary on every analysis sheet. |
| Q6–Q7 fragile | Draw three tiny graphs/posets and say exactly which definition fails. |
| Q9 fragile | Run extended Euclid by hand once, then state the precondition before calling an API. |
| Q10 fragile | Label model, contract, trace, and theorem separately in your dossier. |
| High confidence + wrong | Explain why the distractor felt compelling; construct its smallest counterexample. |

---

## 12. Atlas project — Proof, Counterexample & Constraint Dossier

### Brief

Create a reader-first dossier for one real or synthetic constrained decision:
a prerequisite plan, reviewer assignment, resource schedule, dependency graph,
or modular identifier rule. The goal is not a large application. The goal is a
claim another person can inspect, challenge, and revise.

### Required evidence

| Deliverable | Acceptance criteria |
| --- | --- |
| Claim card | Domain, definitions, assumptions, objective, non-claim, and named owner are visible. |
| Visual model | One small graph, relation table, Hasse diagram, recurrence tree, or number-theory trace with title, scope, legend, and text equivalent. |
| Counterexample | Smallest witness for a tempting false converse, greedy rule, missing condition, or invalid inference. |
| Proof / derivation | Complete enough to audit: every theorem hypothesis, base/step or invariant obligation, and conclusion is named. |
| Code-reading evidence | Annotated read of the reference model or a small unfamiliar implementation; distinguishes mathematical model from API/representation choices. |
| Finite trace | Inputs, observed output, and the universal claim it does not establish. |
| Agent review | Original bounded agent prompt; three verified claims; one correction or rejected overclaim. |
| Transfer memo | A one-page connection to one later M28–M36 module or to a system/AI design decision. |
| Oral evidence summary | Models demonstrated, fragile ideas, repaired misconception, confidence, one retrieval prompt, and smallest next bridge. |

### Rubric: multi-evidence, never pass/fail

| Dimension | Beginning evidence | Developing evidence | First-pass ready evidence |
| --- | --- | --- | --- |
| Model | Names terms informally. | States most objects but leaves scope ambiguous. | Names domain, relation/operation, assumptions, and non-claim. |
| Reasoning | Gives examples only. | Has a proof outline with a gap. | Reconstructs a valid proof/derivation or a clear counterexample. |
| Boundary | Treats output as proof. | Names one limitation after prompting. | Separates theorem, implementation, and trace; supplies a falsifier. |
| Design judgment | Chooses a method by familiarity. | Names a tradeoff. | Matches method to structure, objective, and safety/evidence boundary. |
| Explanation | Recites a definition. | Explains a worked case. | Handles a changed premise, repair, and novel transfer. |

“First-pass ready” means ready to build on this module, not permanently
mastered. If the evidence conflicts—for example, smooth oral explanation but
an invalid counterexample—return to the smallest failed component.

---

## 13. TA session and study-partner session

### Teaching Assistant — proof and derivation clinic

The TA is a coach and reviewer, not a person who completes the proof for you.
Start each meeting with:

~~~text
Claim:
My domain and assumptions:
My proof method and why:
The exact line I distrust:
One counterexample I tried:
Confidence:
~~~

The TA follows this sequence:

1. Ask you to read the formal definition aloud in plain language.
2. Ask which quantified object is arbitrary and which is a witness.
3. Ask for a countermodel before offering a correction.
4. Request the missing base, induction hypothesis, invariant,
   representation assumption, or theorem condition.
5. Give a bounded hint ladder: vocabulary → tiny instance → diagram →
   partial skeleton → one revealed step.
6. Ask you to repair the argument and transfer it to a new case.
7. Record only an approved concise learning summary; do not store raw voice.

**TA rubric:** conceptual model; correctness of reasoning; stated
assumptions/evidence; counterexample/debugging skill; transfer/design judgment;
reflection and confidence calibration.

Likely misconceptions:

- “I checked three cases, so induction is unnecessary.”
- “The converse must be true because it sounds natural.”
- “A maximal matching is the biggest one.”
- “A Hasse diagram contains every relation edge.”
- “The recurrence pattern tells me the base case.”
- “A green test proves the theorem.”
- “The modular inverse function makes a security claim.”

### Study Partner — rehearsal without grading

The Study Partner may run a short, supportive rehearsal:

1. “State your claim in one sentence; I will ask only what each noun means.”
2. “Give me the smallest object that would make it false.”
3. “What did you assume before the first induction/loop step?”
4. “What would change your mind about this graph, recurrence, or API output?”
5. “Show a finite trace, then tell me what it cannot establish.”
6. “Now move the same structure into a new setting: an ML evaluation, search
   heuristic, database constraint, or network policy.”

The Study Partner does not grade. It celebrates a revision as evidence of
thinking and directs persistent confusion back to the TA or source reading.

---

## 14. Conversational oral defense — M27

This replaces a traditional coding or written exam. Use GPT Live Chat if
available, or the equivalent text conversation. You may pause, rerecord,
request a hint, use notes/diagrams/code, say “I do not know,” and revise. The
goal is a visible model and one next action, not speed, polished speech, or a
binary score.

### Agenda (12–18 minutes)

1. **Invitation and model.** “Choose one relation, recurrence, graph, or
   modular claim. What are its objects and formal definition?”
2. **Trace or derive.** “Walk me through one proof step, invariant,
   recurrence base, or Euclid calculation. Why does that step follow?”
3. **Boundary.** “Give the smallest counterexample to a tempting neighboring
   claim. What assumption prevents it in your real claim?”
4. **Prediction before reveal.** “Here is a finite graph or output. Predict
   what follows before I show the witness. How confident are you?”
5. **Repair.** “I changed one premise: the graph is no longer bipartite / the
   relation no longer has a base condition / the schedule can duplicate
   tasks. What breaks first?”
6. **Transfer.** “How would this proof habit change an AI-agent proposal,
   ML result, or system design?”
7. **Reflection.** “What would change your mind? What is one smallest next
   bridge?”

### Hint ladder

1. Restate the domain and the exact claim.
2. Draw a two- or three-object instance.
3. Ask which definition or theorem hypothesis is missing.
4. Supply a partially labeled proof skeleton or countermodel.
5. Reveal one step, then ask you to finish the next.

### End-of-defense evidence summary

With your approval, save only:

~~~text
M27 oral-defense date:
Central model demonstrated:
Trace / derivation reconstructed:
Counterexample or failure boundary handled:
Transfer discussed:
Confidence and calibration:
Fragile or unresolved idea:
Misconception repaired:
One retrieval prompt:
Smallest next bridge:
~~~

Do not save raw audio, unnecessary transcript, personal content, or a bare
pass/fail label. Oral explanation is one evidence stream alongside retrieval,
code/model reading, dossier evidence, and later transfer.

---

## 15. Spaced review and mastery gate

### Retrieval queue

| When | Prompt |
| --- | --- |
| Next day | Negate one universal claim and produce its witness without notes. |
| +3 days | Repair a broken induction or loop-invariant proof in five lines. |
| +7 days | Derive one counting recurrence and name all base conditions. |
| +14 days | Explain maximal versus maximum matching and draw the three-edge counterexample. |
| Before M28 | State which mathematical claims are theorem, finite calculation, numerical observation, and API contract. |
| Before M30/M31 | Explain why a formal manipulation or code result needs assumptions before it becomes an inference or optimization conclusion. |

### Arc gate

Advance when you can, without a template:

- state a finite-domain claim with correct quantifier order;
- construct a countermodel to an invalid converse;
- repair one proof using a named missing obligation;
- derive or explain a recurrence with base conditions;
- distinguish a graph/order/matching definition from a plausible picture;
- state a modular-inverse precondition and its proof idea;
- explain what a finite program trace establishes and what it cannot;
- transfer the discipline to a later mathematical, AI, or systems claim.

If one item is missing, slow the route at that seam. The right repair is
usually a tiny object, a single proof paragraph, or a new trace—not re-reading
the entire module.

---

## 16. Sources, licensing, and a responsible reading route

Atlas prose, diagrams, counterexamples, questions, proof repairs, and code
fixtures in this module are original. These sources support deeper study; use
their own notices rather than assuming that a university page grants one
license to every linked asset.

The deployed [M27 source map](/downloads/module27_discrete_mathematics_proof_counting_structures_source_map.md)
and [source-audit addendum](/downloads/module27_source_audit_addendum.md) are
synchronized from the canonical course records. Together they show the
source-to-session route, claim boundaries, access dates, and reuse cautions;
they support evaluation of this module's references but do not turn linked
material into Atlas content or grant broader reuse rights.

| Resource | Why use it | Reuse boundary |
| --- | --- | --- |
| [MIT 6.1200J Mathematics for Computer Science — readings](https://ocw.mit.edu/courses/6-1200j-mathematics-for-computer-science-spring-2024/pages/readings/) and the linked [MCS text](https://courses.csail.mit.edu/6.042/) | Main undergraduate spine for proofs, state machines, counting, recurrences, graphs, matching, orders, and modular arithmetic. | The linked MCS text states CC BY-SA; generic OCW material is generally CC BY-NC-SA 4.0 unless the specific asset says otherwise. Check the actual asset before reuse. |
| [Discrete Mathematics: An Open Introduction, 4th ed.](https://discrete.openmathbooks.org/dmoi4.html) | Inquiry-oriented companion for logic, graphs, matching, counting, generating functions, and number theory. | The published 4th-edition site states CC BY-NC-SA 4.0. Link and attribute; do not assume a repository branch has the same terms. |
| [Open Logic Project: Sets, Logic, Computation](https://slc.openlogicproject.org/) and [license](https://openlogicproject.org/olp-license/) | Formal logic precision and optional proof practice. | Site content is CC BY 4.0 unless noted. A proof checker validates only its stated system/environment. |
| [Richard Hammack, Book of Proof](https://richardhammack.github.io/BookOfProof/) | Clear supplementary proof-writing practice. | CC BY-NC-ND 4.0: link/cite; do not adapt or reproduce its exercises/figures. |
| [Jeff Erickson, Algorithms](https://jeffe.cs.illinois.edu/teaching/algorithms/index.html) | Recurrences, induction, graphs, and algorithm-proof habits. | The textbook is CC BY 4.0; separate lecture notes can have different terms. Verify the exact asset. |
| [Judson, Abstract Algebra: Theory and Applications](https://judsonbooks.org/abstract-algebra-theory-and-applications/) | Narrow lattice vocabulary and finite-order context. | Link by default; its source is GFDL 1.3+ with obligations that must be checked before reuse. |
| [Theorem Proving in Lean 4](https://lean-lang.org/theorem_proving_in_lean4/) | Optional micro-lab for structural induction and checked proof terms. | Lean is Apache-2.0; a checked term does not replace model review or human explanation. |
| [Wilf, generatingfunctionology](https://www2.math.upenn.edu/~wilf/DownldGF.html) | Optional depth on generating functions. | Link-only by default; hosted terms are not a broad open adaptation license. |

### Instructor decision rule

Advance when you can turn a natural-language claim into a model with named
domain and assumptions; use a proof, counterexample, or finite trace for the
right scope; repair a gap rather than hiding it; and explain how this changes a
design decision. Familiar symbols, green tests, fast answers, and polished
agent prose are not enough.

## Forward handoff — M27 to M6

Carry one precise invariant, one proof/counterexample, and one representation
choice into **M6**. Arrays, linked structures, and later algorithms are not
separate from discrete mathematics: their correctness depends on the same
domain, relation, induction, and counting habits. In the Study Partner chat,
rehearse one invariant under a changed operation; in the TA chat, defend why a
finite test trace is useful evidence but not a universal proof.
