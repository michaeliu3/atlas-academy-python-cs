# Module 33 — Formal Languages, Computability & Complexity: Primary-Source Research

## Status, scope, and non-publication boundary

**Status:** instructor-facing, **authoring-only** research input for planned
Module 33. It is not a learner workbook, canonical source map, structured
module contract, release-input record, review approval, provenance record, or
publication decision.

The canonical graph still describes M33 as authoring-only, with `sourceMap:
null`, `studioId: null`, and planned release evidence. This file does **not**
change the graph, manifest, reader route, navigation, availability,
prerequisite policy, contract state, deployment, or Notion workflow. It does
not make M33 readable, navigable, release-ready, or a prerequisite a learner
can satisfy. Source links guide later authoring; they are not evidence that a
future recognizer/proof studio, diagnostic, retrieval flow, dossier, oral
defense, accessibility review, CI run, or learner mastery exists.

**Research access date:** 2026-07-31. The source set deliberately uses original
papers or official university materials. This note is original explanation and
link-only research. Atlas must not copy source prose, theorem proofs, figures,
slides, problem sets, code, scans, or exercises into a future learner asset
without a separate asset-level reuse decision. A citation is not a license;
historical importance is not a reuse grant; and an implementation trace is not
a proof of a theorem.

## The connected teaching argument

Module 33 is not a vocabulary tour of DFA, CFG, Turing machines, and NP. It
answers one connected question: **what kind of object is being described, what
machine/question is allowed, and what conclusion follows under the stated
model?**

~~~text
finite alphabet and strings
  -> a language (which strings count as members)
  -> grammar or recognizer (a syntactic mechanism)
  -> a machine/question pair (what is to be decided)
  -> a proof obligation (witness, invariant, reduction, or diagonal argument)
  -> a resource model (time, space, encoding, reduction type)
  -> a bounded conclusion and practical non-claim
~~~

**Text alternative:** A grammar can generate or describe strings; a recognizer
can classify strings under its machine model; a decider must halt on every
input; a semantic property is a different question from syntax; and a
complexity class adds a resource bound to a decision problem. None of these
objects automatically grants program authority, predicts a benchmark, or
settles whether a particular real input is easy.

This separation connects the earlier course rather than replacing it:

| Incoming evidence | M33 must reuse it for | M33 adds without replacing it |
| --- | --- | --- |
| **M05 — cost models and asymptotics** | Input measure, operation model, recurrences, lower-bound caution, and the difference between a count and a measurement. | A formal complexity-claim card that names a machine/encoding/reduction model and a practical non-claim. |
| **M11 — algorithms and reductions** | Exhaustive search as an executable specification, dynamic-programming state graphs, correctness arguments, approximation boundaries, and directed transformations. | A reduction proof skeleton that separates a computable transformation from a resemblance or a solver call. |
| **M23 — programming languages and bounded evaluation** | Syntax versus semantics, parsing, trees, environments/evaluation rules, interpreters, and capability boundaries. | A language–machine separation sheet that distinguishes grammar membership, program behavior, and authority. |
| **M27 — discrete mathematics and proof** | Definitions, quantifiers, induction/invariants, relations, countermodels, counting, recurrence, graph, and elementary number-theoretic reasoning. | A formal-claim ledger with an explicit witness/counterexample, proof obligation, and theorem-scope label. |

The graph’s declared forward module is **M34**. M34 and M36 are planned direct
academic consumers of M33 concepts; that fact is not learner routing and does
not make M33 available before its own gates are met.

## Canonical bridge preserved exactly

The canonical M33 bridge declares the academic prerequisite module IDs
`["m05", "m11", "m23", "m27"]` and forward module ID `m34`. The exact incoming
bridge order is important because it prevents a learner from treating a proof
template as a vocabulary trick:

| Prerequisite | First consuming session | Exact forward artifact | Boundary repaired |
| --- | --- | --- | --- |
| **M05** | `m33-s05` | `m33-complexity-claim-card` | A polynomial-time classification is neither “practically fast” nor an observed runtime. |
| **M11** | `m33-s04` | `m33-reduction-proof-skeleton` | A reduction needs a computable, correctly directed transformation; an analogy is not one. |
| **M23** | `m33-s01` | `m33-language-machine-separation-sheet` | Grammar membership, program meaning, and permitted evaluation/authority are distinct. |
| **M27** | `m33-s02` | `m33-formal-claim-countermodel-ledger` | Finitely many tests or an ill-quantified proof do not establish a universal language/machine claim. |

The direct M34 handoff is exactly:

> **Limits claim packet:** formal definitions, an annotated reduction or
> counterexample, cost-model boundary, and practical interpretation limit.

M34 is both the graph’s declared forward handoff and a direct academic
consumer. M36 separately names M33 as an academic prerequisite. Neither link
permits a learner to bypass M33 or turns an M33 research note into M34/M36
evidence.

## Primary/official source ledger and reuse boundary

All entries were accessed on **2026-07-31**. “Link-only/original paraphrase”
is the present Atlas decision even where a work can be read online. It avoids
silently importing copyright, attribution, exercise, figure, or proof-text
obligations into later material.

| ID | Primary or official source and stable learner-facing link | Owner / source role | Narrow claims this may support | License/reuse status |
| --- | --- | --- | --- | --- |
| S33-01 | [MIT 6.045J Automata, Computability, and Complexity](https://ocw.mit.edu/courses/6-045j-automata-computability-and-complexity-spring-2011/) and its [official lecture-note index](https://ocw.mit.edu/courses/6-045j-automata-computability-and-complexity-spring-2011/pages/lecture-notes/) | MIT OpenCourseWare; official undergraduate course material | Pedagogical sequence for DFAs/NFAs, nonregularity, Turing machines, decidability, mapping reducibility, Rice’s theorem, complexity, and NP-completeness; examples may be independently recreated. | Course site links [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/), but its note index says slides and scribe notes have separate permission provenance. **Link-only/original paraphrase** now; do not copy an individual slide, diagram, problem, or note without asset-level review. |
| S33-02 | Rabin & Scott, 1959, [*Finite Automata and Their Decision Problems*](https://doi.org/10.1147/rd.32.0114) | Original research article; IBM Journal of Research and Development | Finite automata as classifiers of finite tapes and the fact that decision questions must be tied to the given automaton/model. Supports Session 2 historical/model context. | Publisher landing record; no checked Atlas reuse license for text/figures. **Citation/link and original examples only.** |
| S33-03 | Chomsky, 1956, [*Three Models for the Description of Language*](https://doi.org/10.1109/TIT.1956.1056813) | Original research article; IRE/IEEE Transactions on Information Theory | Historical grammar-model comparison, including finite-state and phrase-structure framing. Supports the syntax/grammar scope in Sessions 1 and 3. | IEEE publication; no checked Atlas asset-reuse permission. **Citation/link and original grammar/parse examples only.** |
| S33-04 | Turing, 1937, [*On Computable Numbers, with an Application to the Entscheidungsproblem*](https://doi.org/10.1112/plms/s2-42.1.230) | Original research article; Proceedings of the London Mathematical Society | A rigorous historical machine/description model and an undecidability boundary. Supports the carefully scoped diagonal/halting-style discussion in Session 3. | Publisher landing record; exact asset reuse has not been cleared. **Citation/link and original proof presentation only.** Do not imply that a modern informal “halting problem” statement is a verbatim quotation or the whole result. |
| S33-05 | Rice, 1953, [*Classes of Recursively Enumerable Sets and Their Decision Problems*](https://doi.org/10.1090/S0002-9947-1953-0053041-6) | Original research article; Transactions of the American Mathematical Society | Scope for a semantic-property undecidability theorem, once the encoded partial-computable-function assumptions are stated. Supports Session 3’s semantic-limit boundary. | AMS-published article; no checked Atlas asset-reuse permission. **Citation/link and original counterexamples only.** |
| S33-06 | Cook, 1971, [*The Complexity of Theorem-Proving Procedures*](https://doi.org/10.1145/800157.805047) | Original research article; ACM STOC proceedings | Historical source for polynomial reducibility/completeness development. It anchors the distinction between the source’s reduction formulation and a later course’s explicitly declared reduction convention. | ACM records copyright and limited personal/classroom-copy language; no permission has been recorded to reproduce text, figures, or proof. **Citation/link and original reduction fixture only.** |
| S33-07 | Karp, 1972, [*Reducibility Among Combinatorial Problems*](https://doi.org/10.1007/978-1-4684-2001-2_9) | Original research article; *Complexity of Computer Computations* | Polynomial-time many-one reduction and a catalogue of completeness results under the stated model. Supports Session 5 completeness and encoding discipline. | Springer publication; no checked Atlas asset-reuse permission. **Citation/link and original examples only.** |

### What the ledger does *not* establish

No ledger row proves that a particular string parser is correct, that a
particular Python program implements a recognizer, that an LLM-generated
reduction is valid, that a solver timeout proves unsatisfiability, that an
instance is hard, that P differs from NP, or that a complexity classification
dictates a product choice. Those require a separate definition, encoding,
machine/resource model, proof or checked fixture, and explicitly stated
non-claim.

## First-principles definition sheet

The following are original Atlas formulations, intentionally compact enough to
use as a whiteboard and precise enough to expose what must be proved.

1. Let \(\Sigma\) be a finite alphabet. \(\Sigma^*\) is the set of all finite
   strings over \(\Sigma\), including the empty string \(\epsilon\). A **formal
   language** is a set \(L \subseteq \Sigma^*\). It is a mathematical set of
   strings—not a user interface, an interpreter, an authority policy, or a
   truth predicate.
2. A grammar can be represented as \(G=(V,\Sigma,R,S)\), with variables
   \(V\), terminals \(\Sigma\), productions \(R\), and start variable \(S\).
   \(L(G)\) is the strings derivable from \(S\). The grammar defines a
   syntactic language; it does not by itself choose a semantic interpretation
   or grant permission to evaluate text.
3. A deterministic finite automaton is
   \(D=(Q,\Sigma,\delta,q_0,F)\), where \(Q\) is finite and
   \(\delta:Q\times\Sigma\to Q\). It accepts \(w\) exactly when the extended
   transition function ends in \(F\). A language is **regular** when some DFA
   accepts it. This definition makes finite state, input alphabet, start
   state, and acceptance condition visible.
4. A **recognizer** for \(L\) accepts members of \(L\); on nonmembers it may
   reject or run forever. A **decider** halts on every input and accepts
   exactly the members of \(L\). Thus “I ran it and it did not return” is not
   evidence of non-membership, and “the parser accepted” is not evidence of a
   semantic property.
5. A **Turing-machine description/encoding** is a finite string naming a
   finite machine. A halting-style claim needs an explicit model that can
   encode and simulate the constructions in the proof. It is not a theorem
   about every finite menu of programs, every restricted language, or every
   practical timeout.
6. A polynomial-time many-one reduction
   \(A\leq_m^p B\) is a total, polynomial-time computable map \(f\) such that
   \(x\in A\iff f(x)\in B\). Its direction matters: a decider for \(B\),
   together with \(f\), gives a decider for \(A\). A different reduction type
   (for example, an oracle/Turing reduction) is not silently interchangeable
   with this one.
7. Under the standard deterministic-machine convention and a chosen input
   encoding, **P** is the set of decision languages decidable in polynomial
   time. **NP** can be stated as the set of
   languages with a polynomial-time verifier \(V\) and polynomial \(p\) for
   which \(x\in L\) iff there exists a certificate \(y\),
   \(|y|\le p(|x|)\), with \(V(x,y)\) accepting. A language \(B\) is
   NP-complete only after both membership in NP and the declared hardness
   reduction have been established.

These definitions receive source context from S33-01 through S33-07, but the
notation and examples above are authored here. A later learner page should
recheck all theorem phrasing against the actual selected source and state its
machine/encoding convention before presenting a proof.

## Proof shapes, assumptions, and counterexamples

### 1. Distinguishing behavior proves more than a handful of tests

For \(L_{=} = \{0^n1^n \mid n\ge0\}\), suppose a DFA recognizes \(L_{=}\). For
distinct \(i,j\), the prefixes \(0^i\) and \(0^j\) are distinguished by the
suffix \(1^i\):

\[
0^i1^i\in L_{=} \quad\text{but}\quad 0^j1^i\notin L_{=}.
\]

If two such prefixes reached the same DFA state, every common suffix would
have the same acceptance result—contradicting the displayed pair. There are
infinitely many pairwise distinguishable prefixes but only finitely many DFA
states, so no DFA recognizes \(L_=\). This is an original, compact
distinguishability proof shape for **M33-S02**; S33-01 and S33-02 supply the
automata context.

**Assumptions:** a finite-state deterministic recognizer, a fixed alphabet,
and the standard DFA/regular-language correspondence. **Counterexample to a
common shortcut:** testing \(\epsilon\), `01`, and `0011` cannot prove
regularity or nonregularity; it only tests those inputs. A future studio may
trace finitely many states as a debugging probe, never as proof of this
infinite claim.

### 2. A halting-style diagonal argument requires a total hypothetical decider

Assume, for contradiction, a total procedure \(H(M,w)\) correctly returns
whether encoded machine \(M\) eventually halts on input \(w\). Construct
\(D(x)\): if \(H(x,x)\) says “halts,” then loop forever; otherwise halt.
Since \(D\) itself has an encoding, consider \(D(D)\). If \(H(D,D)\) says it
halts, \(D(D)\) loops; if it says it does not halt, \(D(D)\) halts. Either
result contradicts the assumed correctness of \(H\).

**Assumptions:** the encoding accepts the constructed machine, \(H\) is total
and correct on all encoded machine/input pairs, and the model permits the
self-application used in the construction. This is a teaching-sized
halting-style boundary informed by S33-04 and S33-01, not a substitute for
reading the original historical result. **Counterexample to overreach:** a
terminating checker for a finite, explicitly enumerated list of programs does
not contradict undecidability; it is outside the universal claim.

### 3. A reduction is a directed proof, not a resemblance

To show that target \(B\) is at least as hard as known-hard source \(A\),
author a total computable transformation \(f\) with
\(x\in A\iff f(x)\in B\). If a decider for \(B\) existed, running \(f\) then
that decider would decide \(A\). The direction **source hard problem → target
problem** is therefore indispensable.

**Proof checklist:** state source/target languages, input encoding, algorithm
for \(f\), resource bound, both directions of the iff, and the result
transferred. **Counterexample:** reducing a target \(B\) to a known-hard
problem \(A\) may show that a solver for \(A\) can solve \(B\); it does not by
itself make \(B\) hard. S33-06 and S33-07 anchor the historical reduction
literature; this note deliberately names the modern many-one convention when
using it.

### 4. Completeness is a two-part claim, and theory has a practical boundary

For an NP-completeness claim about \(B\), show (a) \(B\in\mathrm{NP}\) under
the declared verification/encoding model, and (b) a correctly directed
polynomial reduction from a known NP-hard language to \(B\). S33-06 and
S33-07 are historical sources; neither licenses a bare label without those
two proof obligations.

**Counterexamples to common conclusions:**

- NP-complete does **not** mean every instance is slow, no useful exact or
  heuristic method exists, or a timeout proves no solution.
- Polynomial-time does **not** mean a particular input/implementation is
  cheap: degree, constants, encoding, memory, hardware, and input distribution
  still matter.
- The source set does **not** resolve \(\mathrm{P}\stackrel{?}{=}\mathrm{NP}\).
  Atlas must state the question as unresolved rather than teaching a preferred
  belief as a theorem.

## Claim, assumption, and counterexample ledger

Each future learner-facing claim should keep its scope beside the conclusion.
The rows below are authoring obligations, not released lessons or established
learner evidence.

| ID | Narrow claim that may be authored | Required visible assumptions / source anchors | Counterexample, falsifier, or non-claim |
| --- | --- | --- | --- |
| M33-C01 | A formal language is a specified subset of strings over a named alphabet; grammar membership is a syntactic judgment. | Alphabet, encoding/tokenization, grammar/recognizer, start/accept condition, and whether the question is membership, parsing, semantics, or authority. S33-01, S33-03. | Two syntactically valid programs can differ in behavior; grammar acceptance does not establish safety, termination, truth, or authorization. |
| M33-C02 | A finite automaton has finite control, so a regular-language claim must give a state/transition acceptance model or an equivalent construction. | Finite state set, input alphabet, start/accept states, transition meaning, and selected equivalence theorem. S33-01, S33-02. | A finite trace or a diagram with unlabeled transitions is not a recognizer proof; an unbounded nested/counting dependence can require more than finite control. |
| M33-C03 | A nonregularity conclusion can follow from an explicit distinguishing-family or another stated theorem with all hypotheses checked. | Named language, infinite family, distinguishing suffix/witness or theorem hypotheses, and quantifiers. S33-01, S33-02. | A few failed candidate DFAs, finite testing, or “it needs memory” intuition alone does not prove nonregularity. |
| M33-C04 | A grammar defines generated strings, while a machine model/semantic relation answers a separately declared computational question. | Grammar formalism, derivation/parse relation, semantic domain, evaluation assumptions, and any resource/capability boundary. S33-03, S33-01. | A context-free grammar need not decide a semantic property; parsing an expression does not approve executing it. |
| M33-C05 | A recognizer/decider claim must state behavior on both members and nonmembers, especially whether halting is guaranteed. | Machine encoding, input domain, acceptance/rejection/loop behavior, and exact decision question. S33-01, S33-04. | A program that accepts known positives but loops on a negative input may recognize but does not decide; an empirical timeout does not prove divergence. |
| M33-C06 | A halting-style undecidability proof is conditional on an assumed total, universally correct decider and a legal self-referential construction. | Chosen universal model, effective encoding, totality/correctness assumption, construction, and diagonal case analysis. S33-04, S33-01. | The result does not say every termination question for every restricted language, bounded machine, or finite input list is undecidable. |
| M33-C07 | Rice-style reasoning concerns nontrivial semantic properties of partial computable functions, not arbitrary textual/syntactic properties. | Computable enumeration/encoding, extensional semantic property, nontriviality, and theorem scope. S33-05, S33-01. | “Does this source contain the word `eval`?” is syntactic and does not become a Rice-theorem example; neither does a policy question become a semantic theorem merely by naming it. |
| M33-C08 | A many-one reduction transfers an algorithmic consequence in the direction fixed by its iff-preserving transformation. | Source/target language, total map, polynomial/other resource bound, iff proof, and direction. S33-06, S33-07, S33-01. | Reversed arrows and a black-box solver demonstration do not establish the target’s hardness. |
| M33-C09 | A complexity-class statement is about a named decision language, encoding, machine/resource measure, and asymptotic conclusion. | Input length/encoding, deterministic/nondeterministic model, time/space measure, reduction type, and worst-/average-/parameterized-case label. S33-01, S33-06, S33-07. | A single benchmark chart, timeout, or exponential-looking implementation does not classify a language. |
| M33-C10 | An NP-completeness claim needs both membership and hardness under the same declared convention. | Verifier/certificate or machine definition for membership; known-hard source, polynomial transformation, and iff for hardness. S33-06, S33-07, S33-01. | “It looks combinatorial,” an unsolved instance, or an unproved encoding is not NP-completeness evidence. |

## Likely six-session source routing

This plan follows the canonical M33 prerequisite/session bridge **exactly**. It
does not create a workbook, project, diagnostic, studio, review record, or
live oral-defense implementation.

| Canonical session, progression, and prerequisite IDs | Source route | Understanding-first move | Planned evidence and explicit non-claim |
| --- | --- | --- | --- |
| **M33-S01 / `m33-s01` — Languages, syntax, semantics, and machine models** — “Establish what a formal language is and separate it from an interpreter, a semantic property, and an authority boundary.” Uses `m23`. | S33-01, S33-03 | Give two tiny original language specifications and an interpreter policy. Ask the learner to label grammar membership, parse structure, semantic claim, and allowed action before seeing the answer. | **Language-machine separation sheet.** It does not certify a parser, decide semantics, or grant execution authority. |
| **M33-S02 / `m33-s02` — Finite automata, regularity, and proof by distinguishing behavior** — “Move from definitions to recognizers and non-regularity evidence with explicitly quantified witnesses.” Uses `m27`. | S33-01, S33-02 | Code-read a deliberately small transition table, predict accept/reject traces, then write a distinguishability witness for an unbounded-count language. | **Formal-claim countermodel ledger.** A state trace or finite test set is not a universal proof. |
| **M33-S03 / `m33-s03` — Grammars, machines, decidability, and semantic limits** — “Compare expressive mechanisms and state carefully which decision question a machine/model can answer.” Uses `m23`, `m27`. | S33-01, S33-03, S33-04, S33-05 | Contrast a grammar-membership question with a semantic/termination question. Require the learner to identify the universal model and totality assumption before reading the diagonal construction. | **Machine/question/scope table with a halting-style boundary case.** It does not turn an informal timeout into an undecidability proof or apply Rice-style reasoning to syntax. |
| **M33-S04 / `m33-s04` — Reductions and undecidability as directed proof tools** — “Turn a familiar problem transformation into a directed, computable proof argument rather than a similarity claim.” Uses `m11`, `m27`. | S33-01, S33-04, S33-06, S33-07 | Present a proposed transformation with one deliberately reversed arrow or missing iff clause. Ask the learner to repair/reject it before reveal. | **Reduction-proof skeleton and a reversed-direction counterexample.** It makes no hardness claim until all source, map, and proof obligations are supplied. |
| **M33-S05 / `m33-s05` — Complexity classes, completeness, and practical limits** — “Layer formal resource classes over explicit cost models while preserving the distinction between worst-case theory and practical evidence.” Uses `m05`, `m11`, `m27`. | S33-01, S33-06, S33-07 | Read an implementation/benchmark card and a formal class claim side by side. Ask which elements are required for the theorem and which are merely observed runtime facts. | **Complexity-claim card with a stated model and non-claim.** It does not infer a real-system performance guarantee or resolve P versus NP. |
| **M33-S06 / `m33-s06` — Formal limits dossier and oral defense** — “Defend a claim about expressibility, decidability, or complexity with definitions, proof structure, counterexamples, and a practical boundary.” Uses `m05`, `m11`, `m23`, `m27`. | S33-01–S33-07 | Assemble the six earlier artifacts into one narrow claim, then use an encouraging oral conversation: “Which exact assumption would make your conclusion fail?” | **Formal Languages, Computability & Complexity Dossier and learner-controlled oral-defense summary.** It is not a pass/fail exam, automatic unlock, or claim that theorem recall equals engineering judgment. |

Every later session must retain prediction before reveal, compact
first-principles explanation, code-reading/debugging/design inspection where
useful, a counterexample, retrieval, transfer, and a learner-controlled
artifact. The focus is reading and defending formal arguments, not typing a
large amount of code.

## Bounded implementation use: a debugger, not a theorem oracle

Formal-language and complexity claims are primarily symbolic, so M33 needs no
numerical experiment. A bounded implementation may still help a learner read
an architecture:

~~~text
given DFA transition table + finite test set
  -> trace state sequence
  -> compare accept/reject against a hand-specified oracle
  -> identify a transition/accept-state bug
~~~

This is useful for code reading, tracing, and debugging. It must display the
alphabet, transition table, test strings, expected outcomes, and trace. It
cannot establish that a machine recognizes an infinite language, validate a
reduction, decide halting, prove nonregularity, or infer a complexity class.
Any future recognizer/proof studio needs its own bounded input model,
accessibility alternative, safe execution boundary, and tests; no arbitrary
learner program execution is implied by this research.

## Suggested dossier evidence boundary

A future M33 dossier should require a learner to choose **one** narrow claim
and make its conditions inspectable:

~~~text
claim type: language membership / regularity / decidability / reduction / complexity
formal objects: alphabet, encoding, language, grammar or machine, question
model: state/memory/resource assumptions and what inputs are quantified over
argument: definition -> witness/construction -> proof obligations -> conclusion
counterexample: a nearby false claim and why its premise/direction fails
practical boundary: what the theorem/model does not predict about real code or instances
transfer: M34 state-space/CSP/search claim that must retain the same limit label
~~~

The Teaching Assistant’s later oral defense should be supportive rather than
adversarial: invite a learner to choose a claim, ask for one definition before
a proof step, offer a smaller counterexample/hint ladder, ask for a transfer to
M34, and let the learner revise a concise evidence summary. A Study Partner
can rehearse diagrams/equations/code traces on a readable whiteboard with a
prose fallback. This note does **not** create those module-specific prompts,
chat behavior, voice capability, or Notion export behavior.

Any evidence summary remains learner-controlled; the Atlas portal and portable
copied prompts stay local by default. Do not automatically transmit a raw oral
transcript, voice/audio recording, proof attempt, confidence signal, or
implementation trace to Notion or any external service. The designated Codex
chats may instead write only their separate bounded concise session note under
the active workflow; that does not authorize a transcript/export or prove any
write. A saved-note claim requires direct evidence.

## Research gaps and release blockers this file does not close

1. **Canonical source-map blocker remains open.** The graph still has
   `sourceMap: null`. This research is a starting ledger, not the reviewed,
   learner-facing source map required to resolve `m33-source-map-null`.
2. **Proof/source/reuse review remains open.** `m33-proof-source-boundaries-unreviewed`
   still requires checked proof fixtures, current stable links, source/license
   decisions, and asset-level review before any source material is reused.
3. **Learning artifacts are unbuilt.** `m33-learning-artifacts-unbuilt` remains
   true: no checked-in M33 workbook, bounded recognizer/proof studio,
   confidence-aware diagnostic, retrieval record, dossier rubric, or accessible
   oral-defense flow has been created by this note.
4. **Contract and provenance are unmet.** `m33-contract-and-provenance-unmet`
   remains true: M33 has no structured module-contract entry, its graph release
   evidence is still planned, and this note supplies no CI, review, deployment,
   or GitHub provenance record.
5. **Theorem scope needs review per lesson.** The source set does not license
   shortcuts such as “all semantic properties are undecidable,” “a grammar
   decides meaning,” “P means fast,” or “NP-complete means impossible.” Each
   future theorem needs its own formal statement, assumptions, proof boundary,
   and counterexample.
6. **No machine model has been chosen for an interactive studio.** A future
   recognizer, grammar, or reduction tool must state its finite input model,
   resource limits, deterministic handling of malformed input, safe rendering,
   and accessibility-equivalent text path. It must not execute arbitrary code
   or mistake a finite search for an undecidability oracle.
7. **No learner or production evidence exists.** This file does not supply
   a browser/keyboard/screen-reader check, performance budget, sanitization
   check, privacy review, source review, course CI run, human review, deploy
   version, or learner mastery evidence.
8. **M34’s handoff remains future work.** A correct limits claim packet is
   needed before M34 can teach CSP/search limits responsibly, but this research
   does not author M34 or create a learner route to it.

## Authoring checklist before M33 can be reviewed

- [ ] Recheck every source URL, theorem formulation, exact edition/version,
      license/reuse status, access date, and claim linkage. Keep original
      exposition and avoid source figures/proofs/exercises unless separately
      approved.
- [ ] Preserve the canonical graph’s authoring-only state until an independent
      v3 contract review makes a truthful availability/release decision.
- [ ] Build original, accessible diagrams with adjacent prose alternatives:
      grammar/derivation, automaton transition/trace, machine/question scope,
      reduction arrow, and complexity claim card.
- [ ] Provide a bounded recognizer/proof interaction with a transparent input
      model, prediction-before-reveal, an original oracle/fixture, malicious
      input handling, and no arbitrary code execution.
- [ ] Add confidence-aware diagnostics, retrieval/review records, acceptance
      criteria and rubric for the limits dossier, and code-reading/debugging/
      design tasks that cannot be satisfied by recognition alone.
- [ ] Create M33-specific Teaching Assistant and Study Partner packages plus a
      supportive oral-defense protocol and an equivalent accessible text path;
      do not use it as pass/fail framing or an automatic unlock.
- [ ] Bind the exact reviewed inputs to the v3 module evidence/review/release
      path, then independently verify CI, source review, Git history, private
      deployment, accessibility, privacy, and known limitations.
- [ ] Preserve M25/M26 preview gating and the M31–M36 authoring-only boundary
      until every module’s own contract, route, accessibility, provenance, and
      release evidence is independently complete.

This note intentionally leaves the M33 source-map and release blockers open.
Its contribution is a rigor- and source-conscious route from syntax to formal
limits to complexity claims, without turning current authoring evidence into a
learner-access or mastery claim.
