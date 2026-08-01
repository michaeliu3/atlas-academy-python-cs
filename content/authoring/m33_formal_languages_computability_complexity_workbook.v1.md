# M33 candidate workbook — Formal Languages, Computability & Complexity

**Authoring-only private study pack.** This is a complete draft for
instructor-led study in the designated Codex chats. It intentionally lives
outside the portal reader route; private study does not change the course
graph, availability, prerequisite policy, source-map binding, release state,
publication claim, or Core credit.

**Knowledge arc:** systems, languages, and AI-era reasoning

**Academic prerequisites:** M05 cost models and algorithm analysis; M11
algorithms and reductions; M23 programming languages and bounded evaluation;
M27 discrete mathematics, logic, and proof.

**Primary outcome:** You can read a claim about syntax, computation, or
complexity and reconstruct its exact object, machine/question, quantifiers,
resource model, proof obligation, counterexample, and practical non-claim.
You will be able to inspect an AI-generated explanation or a small recognizer
trace critically rather than accepting a label such as “regular,”
“undecidable,” or “NP-complete” on authority.

This is not a six-session promise to master every automata theorem, proof
system, programming-language semantics, or open problem in complexity theory.
It is a rigorous foundation for reading, debugging, and directing formal
reasoning.

---

## How this module stays connected

### The working invariant

> A formal conclusion is credible only when its **object**, **machine or
> question**, **quantifiers**, **resource model**, **argument**, and
> **boundary** are visible.

~~~mermaid
%% atlas-diagram-id: m33-formal-claim-route
%% atlas-diagram-title: The M33 route from strings to bounded conclusions
%% atlas-diagram-alt: A finite alphabet forms strings. A named language, grammar, or machine gives a formal object. A precisely stated question and proof obligation lead to a resource claim or limit, followed by a practical non-claim rather than automatic authority.
flowchart LR
  A["Alphabet and finite strings"] --> B["Language, grammar, or recognizer"]
  B --> C["Machine model and decision question"]
  C --> D["Witness, invariant, reduction, or diagonal argument"]
  D --> E["Resource or decidability conclusion"]
  E --> F["Practical boundary and next question"]
~~~

**Text alternative:** First name the finite strings under discussion. Then say
whether a grammar generates them, a recognizer classifies them, or a machine
answers a particular question. A proof requires a witness, construction,
invariant, reduction, or contradiction under named assumptions. A resource or
limit conclusion still does not decide whether a particular implementation is
useful, safe, authorized, or fast on one instance.

| Earlier learning | M33 reuses it for | M33 adds |
| --- | --- | --- |
| M05 | input size, cost models, asymptotic language, and the difference between an observed trace and a theorem | a complexity-claim card that names the encoding and practical non-claim |
| M11 | invariants, exhaustive search, reductions, and correctness obligations | a directed reduction proof skeleton |
| M23 | syntax, parsing, evaluation, environment, and authority boundaries | a language–machine separation sheet |
| M27 | quantifiers, countermodels, induction, and proof writing | a formal-claim ledger with a witness or counterexample |

### Core evidence card

Keep this small card beside every claim. It prevents a theorem name from
replacing an argument.

~~~text
Claim type: membership / regularity / decidability / reduction / complexity
Alphabet, encoding, and formal language or problem:
Grammar, recognizer, machine, or verifier model:
Question and quantifiers: which inputs and which outcomes?
Resource convention: time, space, reduction type, and input measure:
Argument shape: construction, invariant, witness, reduction, or contradiction:
Smallest counterexample or nearby false claim:
What this conclusion does not predict about code, an instance, or authority:
Forward use:
~~~

---

## Prerequisite retrieval

Answer without notes, then repair the smallest missing link. These are not
grades.

1. Give an invariant that distinguishes a finite test run from a proof about
   all inputs.
2. In a reduction from problem A to problem B, which direction lets a solver
   for B solve A? Why?
3. Why are parsing a program, evaluating a program, and authorizing a program
   three different operations?

If 1 is fragile, revisit M27. If 2 is fragile, revisit M11. If 3 is fragile,
revisit M23. If your cost argument names neither input measure nor machine,
revisit M05 before Session 5.

---

## Session 1 — Languages are objects; syntax is not authority

### Core question

**What exactly is being classified before we ask whether it can be computed?**

Let \(\Sigma\) be a finite alphabet. The notation \(\Sigma^*\) means all
finite strings over that alphabet, including the empty string
\(\epsilon\). A formal language is simply a set
\(L \subseteq \Sigma^*\). It is not a user interface, an interpreter, a
safety policy, or a statement that some text is true.

For example, over \(\Sigma=\{0,1\}\), let

\[
L_{\mathrm{ordered}}=\{0^i1^j \mid i,j\geq0\}.
\]

It contains the empty string, 000, 111, and 0011; it excludes 010. A grammar
is a different formal object. One grammar for balanced parentheses is

\[
S \rightarrow (S)S \mid \epsilon.
\]

The grammar says which strings can be derived. It says nothing yet about what
a string means after parsing.

### Formal-model ladder — choose the smallest proven scope

Before seeing the ladder, classify these three language claims: `0*1*`,
balanced parentheses, and \(L_{=}={0^n1^n\mid n\geq0}\). Which can be
described with finite state alone, and which need a nesting/counting relation?

<details>
<summary>Reveal after making a model prediction.</summary>

| Formal object | What it can retain or express | Exact scope and boundary |
| --- | --- | --- |
| DFA | one declared finite state after each symbol | recognizes regular languages |
| NFA | finitely many possible branches; a deterministic simulation can track a finite subset | recognizes exactly the regular languages too—not a larger language class than a DFA |
| ordinary formal regular expression | union, concatenation, and Kleene star as a finite notation | denotes exactly a regular language; a production “regex” engine may add non-formal extensions, so its name alone proves nothing |
| context-free grammar (CFG) | productions such as \(S\rightarrow(S)S\mid\epsilon\), which can express recursive nesting | defines a context-free language; it does not by itself define evaluation, policy, or authority |

Every regular language is context-free, but \(L_{=}\) is context-free and not
regular. This is a relation between language classes, not a promise that a
particular parser implementation is correct or that every real-language feature
fits a CFG.

</details>

### Tiny derivation trace — syntax before meaning

For the balanced-parentheses grammar above, derive `()()` without skipping the
remaining nonterminal:

\[
S \Rightarrow (S)S \Rightarrow ()S \Rightarrow ()(S)S
  \Rightarrow ()()S \Rightarrow ()().
\]

**Text/tree reading:** the root \(S\) creates one matched pair and a trailing
\(S\); that trailing \(S\) creates the second pair. This is a witness that this
one string is derivable under this one grammar. It does not establish a semantic
result, safe evaluation, or authority to act.

### Prediction before reveal

Two snippets both satisfy a toy assignment grammar:

~~~text
x = 2
x = 1 / 0
~~~

Before revealing any interpretation, label the claims that grammar membership
can support: “the token sequence has the required shape,” “the expression
will return a number,” “the action is allowed,” or “the program is safe.”

<details>
<summary>Reveal after writing your prediction.</summary>

**Reveal:** only the first claim follows from grammar membership. Evaluation
requires a semantic relation and an environment; authorization requires a
separate policy and accountable decision process.

</details>

### Read the recognizer, not its name

The following tiny function tries to classify strings in
\(L_{\mathrm{ordered}}\). Do not rewrite it yet. Trace the state after every
symbol.

~~~python
TRANSITIONS = {
    ("zeroes", "0"): "zeroes",
    ("zeroes", "1"): "ones",
    ("ones", "1"): "ones",
}

def ordered_bits(text: str) -> bool:
    state = "zeroes"
    for symbol in text:
        state = TRANSITIONS.get((state, symbol), "zeroes")
    return state in {"zeroes", "ones"}
~~~

Predict the result for 010. Then inspect the default branch.

<details>
<summary>Reveal after writing your prediction.</summary>

**Reveal:** the default silently returns to zeroes, so the function accepts
010. The bug is not an exotic theorem failure: an absent transition was
treated as a permissive recovery. A correct recognizer should reject an
unknown transition explicitly.

~~~python
def ordered_bits_checked(text: str) -> bool:
    state = "zeroes"
    for symbol in text:
        next_state = TRANSITIONS.get((state, symbol))
        if next_state is None:
            return False
        state = next_state
    return state in {"zeroes", "ones"}
~~~

This finite trace is useful debugging evidence. It does not prove that the
implementation and the mathematical language agree for every possible input.

</details>

### Design inspection

Write three columns for a tiny language feature:

| Question | Example answer | Does it establish authority? |
| --- | --- | --- |
| syntax | Is x = 1 / 0 a well-formed assignment? | No |
| semantics | Does it evaluate in this environment? | No |
| policy | May this action run with these capabilities? | This is the authority question itself |

An AI agent can propose a parser or policy. You must ask which column its
claim belongs in.

### Output: Language–Machine Separation Sheet

Choose one small text format or toy language and record:

1. alphabet and tokenization;
2. language/grammar membership rule;
3. separate semantic question;
4. separate evaluation and authority boundary;
5. one malformed or syntactically valid-but-failing counterexample; and
6. a sentence beginning, “Parsing this text does not establish …”

**Transfer:** M34 will require the same separation when a planner input file
is accepted but the state/action model may still be incomplete.

---

## Session 2 — Finite state needs finite evidence

### Core question

**What can a finite-state recognizer remember, and how do we prove a limit?**

A deterministic finite automaton (DFA) is

\[
D=(Q,\Sigma,\delta,q_0,F),
\]

where \(Q\) is a finite state set, \(\delta\) maps each state/symbol pair to a
next state, \(q_0\) is the start state, and \(F\) is the accepting set. The
extended transition function consumes one symbol at a time. A language is
regular if a DFA accepts exactly its members.

Consider a DFA for strings with an even number of 1 symbols. Its state means
“even count so far” or “odd count so far”; the state is a compressed summary
of the history relevant to this particular membership question.

| Input | Predicted state trace | Accept? |
| --- | --- | --- |
| \(\epsilon\) | even | yes |
| 1 | even → odd | no |
| 1011 | even → odd → odd → even → odd | no |
| 1010 | even → odd → odd → even → even | yes |

### Prediction before reveal

Suppose a teammate says: “I tested a ten-state DFA on 100 examples of
\(L_{=}=\{0^n1^n\mid n\geq0\}\), so the language is probably regular.”
Predict the one missing quantifier.

<details>
<summary>Reveal after writing your prediction.</summary>

**Reveal:** regularity is an existence claim about one finite machine that
works for **all** strings. A finite test suite provides observations about a
candidate implementation; it cannot settle the universal claim.

</details>

### NFA-to-DFA subset construction — track possible states

An NFA does not need a separate physical thread for each possible path. Its
mathematical transition on a prefix is a **set of possible states**. For this
original NFA over `0,1`, recognize strings ending in `01`:

| NFA state | on `0` | on `1` |
| --- | --- | --- |
| `q0` (start) | `{q0,q1}` | `{q0}` |
| `q1` | `∅` | `{q2}` |
| `q2` (accepting) | `∅` | `∅` |

The subset construction makes those sets the states of a DFA. From `{q0}`,
reading `0` reaches `{q0,q1}`; reading the next `1` reaches `{q0,q2}`. The
constructed DFA accepts exactly when its subset contains `q2`. Thus `01` and
`101` accept, while `010` returns to `{q0,q1}` and rejects.

<details>
<summary>Predict before revealing the construction trace.</summary>

Starting from `{q0}`, write the three reachable subset states for the empty
prefix, `0`, and `01`. Is the resulting construction evidence that an NFA
engine uses parallel hardware or that every real regular-expression engine has
the same semantics?

**Reveal:** the reachable states are `{q0}`, `{q0,q1}`, and `{q0,q2}`. This is
a finite mathematical simulation of this exact NFA; it is neither a
parallel-execution claim nor a claim about an extended production regex engine.

</details>

### A distinguishability proof idea

For distinct nonnegative \(i\) and \(j\), compare prefixes \(0^i\) and
\(0^j\). The suffix \(1^i\) distinguishes them:

\[
0^i1^i \in L_{=}, \qquad 0^j1^i \notin L_{=} \quad (j\ne i).
\]

If a DFA reached the same state after \(0^i\) and \(0^j\), then every common
suffix would have the same result. But this suffix gives different results.
There are infinitely many pairwise distinguishable prefixes and only finitely
many DFA states, so no DFA recognizes \(L_{=}\).

This is a proof shape, not a slogan that “it needs memory.” Its assumptions
are a fixed finite alphabet, ordinary DFA semantics, and the stated language.

### Debugging probe

An AI assistant offers this assertion:

~~~text
Because a stack can count unmatched zeroes, any language using counts is
nonregular.
~~~

Find the counterexample. The language “strings with an even number of zeroes”
uses a count but needs only parity, so it is regular. The proof question is
not whether a human description mentions counting; it is whether finitely
many machine states can preserve the needed distinction.

### Output: Formal-Claim Countermodel Ledger

Make a ledger for one language claim:

| Field | Your entry |
| --- | --- |
| language, alphabet, and membership rule | |
| proposed machine class | |
| witness family or construction | |
| exact distinguishing suffix / invariant | |
| nearby false claim and counterexample | |
| what finite traces can and cannot show | |

**Transfer:** In M34, a bounded search trace can expose an implementation
bug, but it cannot replace the stated conditions of a completeness or
optimality theorem.

### Bounded reference fixture — trace before claim

Use `lib/m33-formal-languages-reference-model.js` and its focused test as a
small code-reading exercise. Before calling `traceM33EvenOnesDfa("1010")`,
write the state trace and acceptance prediction. Then inspect the returned
trace: every state has a declared parity meaning, and the runner refuses
non-binary or over-long exercise input. This fixture checks one named DFA only;
it is neither a regularity proof nor an undecidability oracle.

---

## Session 3 — Grammar questions and semantic limits are different questions

### Core question

**When does a machine answer the question we asked, and when does it only
answer a smaller syntactic question?**

A recognizer for a language accepts members, but on a nonmember it may reject
or run forever. A decider halts on every input and accepts exactly the
members. Those words matter whenever an observation is missing:

~~~text
“It did not return” might mean nonmembership, a bug, a resource limit,
or a recognizer that has not halted. It is not automatically a proof.
~~~

The balanced-parentheses grammar from Session 1 answers a syntactic membership
question. The question “does this program halt on its input?” is semantic: it
concerns behavior of an encoded machine/program under an execution model.

### Prediction before reveal

Read this bounded evaluator:

~~~python
def run_for_at_most(program, input_value, steps):
    machine = program.initial_state(input_value)
    for _ in range(steps):
        if machine.halted:
            return "halted"
        machine = machine.step()
    return "unknown"
~~~

If it returns unknown, is the program proved not to halt?

<details>
<summary>Reveal after writing your prediction.</summary>

**Reveal:** no. The function decides only whether it observed halting within
the declared step budget and model. It gives a useful finite diagnostic, not a
universal halting decider.

</details>

### A halting-style diagonal boundary

Assume, for contradiction, that a total procedure
\(H(M,w)\) correctly says whether every encoded machine \(M\) halts on input
\(w\). Construct \(D(x)\):

1. ask \(H(x,x)\);
2. if it says “halts,” loop forever;
3. otherwise halt.

Because \(D\) has an encoding, consider \(D(D)\). If \(H(D,D)\) says “halts,”
then \(D(D)\) loops. If it says “does not halt,” then \(D(D)\) halts. Either
case contradicts the assumed total correctness of \(H\).

The argument depends on a model able to encode and simulate the construction,
and on \(H\) being total and correct for all encoded pairs. It does not say
that a finite whitelist of known scripts cannot be checked, nor that a timeout
proves a result about arbitrary programs.

### Counterexample: syntax is not a semantic property

“Contains a loop token” is a syntactic predicate. “Terminates” is a semantic
property. A program can contain a loop and halt; another can contain no
literal while token yet diverge through recursion. Do not use a Rice-style
theorem statement as decoration: first state the encoded
partial-computable-function model and the semantic property.

### Output: Machine–Question–Scope Table

For three questions—grammar membership, bounded execution, and a semantic
program property—record:

1. formal input;
2. machine/model;
3. whether total termination is required;
4. evidence a finite run supplies;
5. claim that would require a proof; and
6. one scope counterexample.

**Transfer:** M34’s solver statuses must distinguish “no solution under this
bounded model,” “time limit reached,” “unknown,” and “the real problem was
never encoded.”

---

## Session 4 — A reduction is a directed proof, not a resemblance

### Core question

**What must a problem transformation preserve before it transfers a
conclusion?**

A polynomial-time many-one reduction from A to B is a total map
\(f\) such that

\[
x\in A \iff f(x)\in B,
\]

and \(f\) is computable within the stated polynomial bound. The arrow is
purposeful: if B had a decider, applying \(f\) and then that decider would
decide A.

### A small exact transformation

Let VC be the decision language “a graph \(G\) has a vertex cover of size at
most \(k\).” Let IS be “a graph \(G\) has an independent set of size at least
\(t\).” For a graph with vertex set \(V\),

\[
(G,k) \mapsto (G, |V|-k)
\]

has the intended relationship:

\[
G \text{ has a cover of size }\le k
\iff
G \text{ has an independent set of size }\ge |V|-k.
\]

The complement of a vertex cover is an independent set, and vice versa. This
does not prove either problem is hard by itself; it demonstrates the structure
an actual reduction must expose.

### A computability mapping reduction — halting becomes acceptance

The same direction discipline also matters outside polynomial complexity. Let
`HALT_TM` contain well-formed encodings `⟨M,w⟩` for which machine `M` halts on
input `w`; let `A_TM` contain encodings `⟨N,y⟩` for which machine `N` accepts
input `y`. In shorthand, the reduction is `HALT_TM \le_m A_TM`.

For a well-formed `⟨M,w⟩`, construct `N` and output `⟨N,ε⟩`. `N` ignores its
own input, simulates `M` on `w`, and accepts if and only if that simulation
halts. Therefore:

\[
\langle M,w\rangle\in\mathrm{HALT}_{TM}
\iff
\langle N,\epsilon\rangle\in\mathrm{A}_{TM}.
\]

If the input encoding is malformed, map it to a fixed no-instance such as
`⟨Loop,ε⟩`, where `Loop` never accepts. That makes the mapping total rather
than silently defining it only for convenient inputs. A decider for `A_TM`
would then decide `HALT_TM`, so this construction transfers the known
undecidability boundary in the intended direction. It does not identify a
production program’s behavior or turn one simulated run into a theorem.

<details>
<summary>Predict before revealing the iff cases.</summary>

If `M` rejects `w` but halts, does `N` accept its own input? If `M` loops on
`w`, which side of the displayed iff is false?

**Reveal:** `N` accepts in the first case because this source language asks
whether `M` **halts**, not whether it accepts. In the looping case, `N` loops
and does not accept, so both membership statements are false. The target
machine must preserve exactly the source question.

</details>

### Prediction before reveal

A proposed implementation says:

~~~python
def vertex_cover_to_independent_set(graph, k):
    return graph, k
~~~

For a graph with six vertices and \(k=2\), predict whether the target
threshold is correct.

<details>
<summary>Reveal after writing your prediction.</summary>

**Reveal:** it should be \(6-2=4\), not \(2\). The input object has not merely
been reused; a mathematical relationship has to be preserved in the right
direction.

</details>

### Read a proof skeleton

~~~text
Source language A:
Target language B:
Input encoding and size measure:
Transformation f(x):
Why f is total and computable:
Forward direction: x in A implies f(x) in B:
Reverse direction: f(x) in B implies x in A:
Consequence if B had the named solver:
Resource and practical non-claim:
~~~

An AI-generated reduction often fails in a very ordinary place: it maps only
yes-instances, reverses the arrow, silently changes optimization to decision,
or omits encoding size. Do not accept an attractive analogy as an iff proof.

### Counterexample to reversed direction

Showing \(B\leq_m^p A\) says a solver for A can solve B. It does not, by
itself, show B is at least as hard as A. The direction must start from the
known hard source when the goal is a hardness transfer.

### Output: Reduction-Proof Skeleton

Write a full skeleton for the vertex-cover/independent-set relation or a
smaller original relation. Include a hand-checked yes and no instance. Mark
one sentence that is a theorem consequence and one that is only a practical
non-claim.

**Transfer:** M34 uses the same skeleton when it discusses a CSP/planning
encoding. A solver run is not a reduction proof.

---

## Session 5 — Complexity classes classify formal families, not one run

### Core question

**What is the object of a complexity statement?**

Under a stated deterministic machine convention and input encoding,
\(\mathrm{P}\) contains decision languages decidable in polynomial time.
\(\mathrm{NP}\) can be described using a polynomial-time verifier \(V\) and a
polynomial \(p\):

\[
x\in L \iff \exists y,\ |y|\le p(|x|),\ V(x,y)=1.
\]

An NP-completeness claim requires both:

1. membership in NP under the declared verifier/encoding convention; and
2. a correctly directed polynomial reduction from a known NP-hard language.

It is not a label for “a problem that looked hard in a notebook.”

### Prediction before reveal

An engineer reports: “My backtracking solver timed out after 30 seconds on
this 40-variable input, so the problem is NP-complete.”

Which requirements are still absent: the problem family, decision encoding,
resource model, reduction, membership argument, or all of them?

<details>
<summary>Reveal after writing your prediction.</summary>

**Reveal:** all of them. The run is an observation of one implementation,
machine, limit, instance, ordering, and representation. It may motivate a
question; it cannot supply a classification theorem.

</details>

### Code-reading task: verifier versus search

~~~python
def verifies_vertex_cover(graph, chosen):
    return (
        len(chosen) <= graph.limit
        and all(u in chosen or v in chosen for (u, v) in graph.edges)
    )
~~~

This can be read as a certificate checker for one encoding. To make a
membership argument, name the certificate size bound, input representation,
and cost of checking every edge. It is not enough to say “the function is
short.”

### Numerical observation boundary

You may make a small table of a bounded enumerator:

| input size \(n\) | candidates in a binary brute-force fixture |
| --- | --- |
| 4 | 16 |
| 8 | 256 |
| 12 | 4096 |

The table explains why enumeration can grow rapidly for this fixture. It is
not a lower bound, a complexity classification, or a forecast for every
algorithm and input distribution.

### Complexity-Claim Card

For any claim, fill in:

| Required field | Example of a disciplined entry |
| --- | --- |
| decision problem | “Does this encoded graph have a cover of size at most k?” |
| size measure | bit length of the explicit graph encoding and k |
| model | deterministic verifier / polynomial many-one reduction |
| theorem evidence | named membership proof plus named directed reduction |
| observed evidence | separate bounded trace or benchmark |
| practical boundary | special cases, heuristics, constants, data distribution, and open questions remain separate |

State explicitly: \(\mathrm{P}\stackrel{?}{=}\mathrm{NP}\) remains unresolved.
No product or benchmark result in this workbook settles it.

### Output: Complexity-Claim Card

Create a card for one decision problem, including a valid non-claim about a
specific program. Then ask: “What would falsify my claimed theorem scope?”

**Transfer:** M34 can use complexity theory to label an encoded search/CSP
family, never to declare that a particular real task is impossible or that a
timeout proves infeasibility.

---

## Session 6 — Defend one narrow formal claim

### Core question

**Can another person inspect your definitions, proof shape, and boundary
without having to trust your confidence?**

Choose exactly one narrow claim:

- membership for a named grammar or DFA;
- regularity/nonregularity using a stated construction or distinguishing family;
- a bounded-execution versus semantic-limit distinction;
- a small directed reduction; or
- a precise complexity-class statement with its missing proof obligations
  visible.

Do not combine every theorem in the module. A strong small claim with visible
assumptions teaches more than a catalogue of names.

### Output: Formal Limits Claim Packet

Your dossier must contain:

1. the formal object: alphabet, encoding, language/problem, and question;
2. the selected grammar/machine/verifier/resource model;
3. an original trace, construction, or proof skeleton;
4. one named assumption and where it is used;
5. one counterexample or deliberately nearby false claim;
6. a finite debugging or numerical observation if it is relevant, labelled as
   a finite observation rather than a theorem;
7. a practical non-claim; and
8. a forward handoff: one M34 representation/search/CSP claim that must keep
   the same evidence boundary.

### Acceptance rubric

| Evidence | Strong evidence looks like | Repair prompt |
| --- | --- | --- |
| definitions | object, encoding, and question are unambiguous | “Which string or input is quantified over?” |
| proof | each witness, arrow, or contradiction is tied to an assumption | “Where did totality, finiteness, or direction enter?” |
| counterexample | it changes one premise and genuinely breaks the shortcut | “Can a small finite case disprove your informal rule?” |
| computation | trace/model/status fields are visible and narrowly interpreted | “What did this run observe rather than prove?” |
| transfer | the M34 handoff keeps an explicit practical boundary | “What formal fact does not choose a real-world action?” |

---

## Confidence-aware diagnostic and spaced review

Choose an answer and record confidence **before** reading its explanation.
Confidence is evidence for your review queue, never a grade.

1. A parser accepts a string. What follows?
   - A. The program terminates safely.
   - B. The string satisfied the parser’s declared syntactic condition.
   - C. The action is authorized.
   - D. A semantic property has been proved.

<details>
<summary>Reveal after recording your answer and confidence.</summary>

**Answer: B.** Repair: syntax, behavior, and authority are distinct layers.
</details>

2. A DFA has passed 10,000 test strings for a language. What is strongest?
   - A. The language is regular.
   - B. The DFA is correct on all strings.
   - C. The implementation passed this bounded test suite.
   - D. The language requires a stack.

<details>
<summary>Reveal after recording your answer and confidence.</summary>

**Answer: C.** Repair: finite observations do not settle a universal
regularity or correctness claim.
</details>

3. A run reaches a step budget without halting. What is justified?
   - A. The program never halts.
   - B. The bounded evaluator observed no halt within its declared budget.
   - C. The halting problem is decidable.
   - D. The input is not in the language.

<details>
<summary>Reveal after recording your answer and confidence.</summary>

**Answer: B.** Repair: bounded execution is not a total semantic decider.
</details>

4. To transfer hardness from known-hard A to target B, the key reduction
   direction is:
   - A. B to A.
   - B. A to B, with a computable iff-preserving map.
   - C. either direction if examples look similar.
   - D. a benchmark from B.

<details>
<summary>Reveal after recording your answer and confidence.</summary>

**Answer: B.** Repair: follow the solver consequence through the arrow.
</details>

5. A solver timed out on one instance. Which conclusion is supported?
   - A. The encoded family is NP-complete.
   - B. No solution exists.
   - C. This configured run hit its declared limit.
   - D. P is not NP.

<details>
<summary>Reveal after recording your answer and confidence.</summary>

**Answer: C.** Repair: distinguish runtime evidence from a formal theorem.
</details>

**Review schedule:** Retrieve the working invariant and one counterexample
after 1, 3, 7, 14, and 30 days. On days 7 and 30, change one premise: make a
machine finite, reverse a reduction, change a step bound, or change the input
encoding. Update your evidence card rather than erasing the earlier answer.

---

## Supportive oral defense and live-learning handoff

The Teaching Assistant uses this after the dossier. It is an encouraging
conversation, not a pass/fail exam. You may pause, request a hint, write
instead of speak, or correct the evidence summary.

### Teaching Assistant prompt — M33

~~~text
You are Atlas Academy's M33 Teaching Assistant. Begin with the learner's
Formal Limits Claim Packet, not a score. Ask them to define one object, state
one quantifier or machine assumption, and walk through one proof step or
counterexample. Ask for a prediction before revealing a correction. If an
argument is fragile, use a hint ladder: ask for the formal question; change
one premise; offer a tiny counterexample; then help repair the claim. Use the
visible chat as an accessible whiteboard: define notation, use supported
display equations with a short prose or ASCII fallback, and show code in
language-labelled fences. End with a learner-controlled summary of defended
claim, repaired misconception, inspected evidence, remaining uncertainty, and
the M34 handoff. Do not grade, assert a live-chat setting, or save a raw
transcript.
~~~

### Hint ladder

1. “What exact set of strings or encoded inputs are we discussing?”
2. “Which machine/question must work for all inputs, and which fact is only a
   bounded trace?”
3. “Can you change one premise and make the shortcut fail?”
4. “Now restate the smallest defensible conclusion and its non-claim.”

### Study Partner prompt — M33

~~~text
You are Atlas Academy's M33 Study Partner. Lead a non-grading live discussion
or text rehearsal about formal languages, computability, and complexity.
Treat the visible chat as a readable whiteboard: define notation; use concise
equations with a prose/ASCII fallback; place code in labelled fences; and make
traces, proof arrows, and counterexamples readable after the call. Invite the
learner to inspect an AI-generated proof or recognizer claim, identify a
missing assumption, reverse one arrow, or create a smallest counterexample.
End with a concise TA handoff: strongest insight, unresolved misconception,
artifact, and next question. Do not turn rehearsal into grading.
~~~

### Learner-controlled evidence summary

Use this short card after a conversation:

~~~text
Defended claim:
Assumption or quantifier repaired:
Trace/proof/counterexample inspected:
Still uncertain:
Next retrieval or M34 handoff:
~~~

You may correct, decline to save, or keep the card locally. It is not a
transcript, an automatic unlock, or evidence that a voice session occurred.

### Forward handoff

M34 receives your **Limits Claim Packet**: formal definitions, an annotated
reduction or counterexample, an encoding/cost-model boundary, and a practical
interpretation limit. M34 must preserve the distinction between a bounded
solver run and a theorem about a precisely encoded problem family.

---

## Source and reuse boundary

This workbook uses original explanations, fixtures, diagrams, and code. It
does not reproduce source prose, figures, lecture slides, problem sets, or
solutions. The reading routes below were checked on **2026-08-01**.

### Learner-facing source links

| Source | Session/claim linkage | Reuse boundary |
| --- | --- | --- |
| [MIT 6.045J Automata, Computability, and Complexity](https://ocw.mit.edu/courses/6-045j-automata-computability-and-complexity-spring-2011/) and its [syllabus/problem-set route](https://ocw.mit.edu/courses/6-045j-automata-computability-and-complexity-spring-2011/pages/syllabus/) | Sessions 1–5: formal languages, finite automata, machines, decidability, mapping reductions, and complexity. | Link-only/original Atlas examples and proof explanations; individual MIT OCW assets have their own notices. |
| [Stanford CS103 Mathematical Foundations of Computing](https://web.stanford.edu/class/archive/cs/cs103/cs103.1264/) | Sessions 1–5: proof-first finite automata, computability, and complexity sequence; use it to calibrate the NFA/DFA and reduction bridges, not to copy its assignments. | Stanford course assets remain Stanford material; link-only/original Atlas traces and explanations. |
| [CMU 15-251 Foundations of Theoretical Computer Science schedule](https://www.cs.cmu.edu/~arielpro/15251f15/schedule.html) and [Georgia Tech CS 4510 Formal Languages and Automata](https://faculty.cc.gatech.edu/~ladha/S26/4510/) | Sessions 2–4: finite automata, computability, and reductions as comparison anchors for the two compact construction traces. | University-hosted routes are linked for study only; Atlas does not copy lectures, problem sets, answers, tools, or grading artifacts. |
| [Georgia Tech CS 6515 Intro to Graduate Algorithms](https://omscs.gatech.edu/cs-6515-intro-graduate-algorithms) | Sessions 4–5: proof-aware algorithm analysis, reductions, and complexity reasoning used as an advanced calibration route. | Link-only/original Atlas exercises; it is not a substitute for the course’s term-long work or feedback. |
| [Cook’s 1971 complexity paper](https://doi.org/10.1145/800157.805047) and [Karp’s reduction paper](https://doi.org/10.1007/978-1-4684-2001-2_9) | Sessions 4–5: historical/primary anchors for reduction direction and encoded problem families. | Publisher records are link/citation only; do not copy proof prose, figures, or problem sets. |

For the fuller source-to-claim ledger, access/reuse cautions, and primary-source
map, use the instructor-facing [M33 primary-source research
map](../source-maps/module33_formal_languages_computability_complexity_source_research.md).

## Candidate release boundary

Before this draft may move into the released portal learner route, it still needs its
contract-bound source ledger, reviewed accessible interaction or equivalent
activity, diagnostic/review integration, source/visual review, candidate CI
and release evidence, deployment provenance, and human approval. Until then
it remains an authoring artifact—not a published module or a learner-mastery
claim.
