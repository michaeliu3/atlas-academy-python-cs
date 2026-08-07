# Module 27 — Source-Audit Addendum

**Audit date:** 2026-07-30  
**Scope:** audit of `module27_discrete_mathematics_proof_counting_structures_source_map.md` before authoring the full M27 workbook. This is a source, claim-boundary, and reuse audit—not learner-facing course copy.

## Verdict

The existing map has a sound academic spine. Keep its evidence hierarchy and its insistence that a proof, an implementation/API contract, and a finite experiment establish different things. The main corrective action is **asset-level licensing**: a university course page, its PDF textbook, a source repository, and a hosted exercise bank can carry different permissions.

Use original Atlas prose, diagrams, counterexamples, proof repairs, and code. Cite/link the sources below; adapt or reproduce material only when the exact asset’s license has been recorded in the module source card.

## Recommended learner-facing source set

| Role | Primary/open source and direct URL | What it can support in M27 | Reuse decision |
| --- | --- | --- | --- |
| **Main mathematical spine** | [MIT 6.1200J *Mathematics for Computer Science* — Spring 2024 readings](https://ocw.mit.edu/courses/6-1200j-mathematics-for-computer-science-spring-2024/pages/readings/) and its linked [MCS textbook](https://courses.csail.mit.edu/6.042/) | A coherent undergraduate progression: predicates/sets/proofs; induction and state-machine invariants; asymptotics/recurrences; divisibility and modular arithmetic; graphs, matching, connectivity, trees, DAGs; relations and counting. The course page identifies the textbook as **CC BY-SA**. | Prefer original Atlas explanations. The current MCS text’s stated **CC BY-SA** license applies to that textbook; generic MIT OCW material is **CC BY-NC-SA 4.0** unless an asset states otherwise. Do not collapse those licenses into one rule. |
| **Interactive discrete-math companion** | Oscar Levin, [*Discrete Mathematics: An Open Introduction*, 4th ed.](https://discrete.openmathbooks.org/dmoi4.html), including [bipartite matchings](https://discrete.openmathbooks.org/dmoi4/sec_matchings.html) | Logic, proof methods, graphs/matchings, counting, sequences, generating functions, and elementary number theory in an inquiry-oriented undergraduate presentation. | The published 4th-edition site states **CC BY-NC-SA 4.0**. Attribute, indicate changes, preserve compatible share-alike terms, and do not assume commercial reuse. The repository’s `edition`-branch license currently differs, so treat the public 4th-edition asset’s own notice as controlling until a specific source revision is pinned and reviewed. |
| **Formal-logic precision** | [Open Logic Project license](https://openlogicproject.org/olp-license/), [*Sets, Logic, Computation*](https://slc.openlogicproject.org/), and [proof checker](https://proofs.openlogicproject.org/) | Syntax/semantics, validity, countermodels, relations, and a concrete natural-deduction practice surface. | Website content is **CC BY 4.0 unless otherwise noted**. Attribute and mark changes. Label the checker as one formal proof system; acceptance there is not a claim about every informal proof or theorem prover. |
| **Proof-writing companion** | Richard Hammack, [*Book of Proof*, 3rd ed.](https://richardhammack.github.io/BookOfProof/) | Direct, contrapositive, contradiction, induction, relations, functions, counting, and elementary number theory; useful for proof-repair language. | The site identifies the work as **CC BY-NC-ND 4.0**. Link and cite; do not adapt, remix, or copy exercises/figures into Atlas. Free access is not permission to create derivatives. |
| **Algorithms bridge** | Jeff Erickson, [*Algorithms*](https://jeffe.cs.illinois.edu/teaching/algorithms/index.html) | Recurrence-solving and proof-by-induction appendices; graph/flow context; careful algorithmic proof habits and cost-model handoff. | The **textbook** is **CC BY 4.0**; the author’s *other lecture notes* are **CC BY-NC-SA 4.0**. Record which asset is used; do not assign the textbook’s license to the notes. |
| **Generating-functions depth** | Herbert S. Wilf, [*generatingfunctionology* download/terms](https://www2.math.upenn.edu/~wilf/DownldGF.html) | Optional depth on ordinary generating functions and the distinction between formal coefficient reasoning and analytic convergence. | **Link-only by default.** The hosted second edition permits limited educational reproduction, prohibits commercial use and re-hosting, and is not an open adaptation license. Let MIT/Levin carry required learner material. |
| **Lattice anchor** | Thomas W. Judson, [*Abstract Algebra: Theory and Applications*](https://judsonbooks.org/abstract-algebra-theory-and-applications/) and [source `COPYING`](https://raw.githubusercontent.com/twjudson/aata/master/COPYING) | Narrow M27 treatment of posets, meet/join, lattices, and Boolean-algebra vocabulary; its source license explicitly says GFDL 1.3+ with no invariant/front/back-cover text. | Link/cite by default. Before reusing any source asset, retain the required GFDL material and verify the specific revision. Keep M27 at finite-poset/meet/join level; do not imply a course in abstract algebra or domain theory. |
| **Optional proof-assistant laboratory** | [*Theorem Proving in Lean 4*](https://lean-lang.org/theorem_proving_in_lean4/) and [Lean 4 license](https://github.com/leanprover/lean4/blob/master/LICENSE) | Tiny, explicit examples of inductive types, structural induction, and machine-checked proof terms. | Lean 4 is **Apache-2.0**. A checked Lean term verifies the statement in the stated Lean environment and imported axioms; it does not replace a learner’s human proof explanation or justify an unexamined model. |

## Claim boundaries the workbook must make visible

| Topic | Safe learner-facing claim | Required boundary / counterexample |
| --- | --- | --- |
| Logic and proof | A proof derives a conclusion from stated definitions, domain, assumptions, and valid inference. A countermodel can refute a universal claim. | A truth table only applies to a finite propositional formula; it is not a proof of a quantified claim over an unstated domain. A plausible prose explanation or many examples is not a proof. |
| Induction, structural induction, invariants | Ordinary induction needs a base case and a valid step over the declared natural-number domain. Structural induction must cover each constructor. A loop invariant supports a postcondition only with initialization, preservation, termination, and the correct exit condition. | A trace checks finitely many executions. It does not establish preservation for every reachable state. “Assume (P(n)), prove (P(n+1))” is invalid if the needed hypothesis is stronger or the base coverage is incomplete. |
| Counting and recurrences | Addition/product rules require a disjoint case split or a well-defined product construction; bijections must be specified and invertible. A recurrence requires recurrence relation **and base conditions**. | Do not sum overlapping cases without inclusion–exclusion. Do not treat a pattern in the first few values as a recurrence proof or a closed form. |
| Generating functions | State whether a generating function is used as a **formal power series** (coefficient algebra) or an analytic power series (which needs convergence conditions). Check base/coefficient identities. | Algebraic manipulation of formal series does not by itself establish analytic convergence, interchange of limits, or a numerical approximation guarantee. |
| Graphs, trees, matching | Define the graph model and the matching variant. Hall’s condition is an iff theorem for a **bipartite** graph and requires the neighborhood inequality for **every subset of the specified side**. | A maximal matching need not be maximum. A locally appealing greedy choice need not yield a maximum matching. A graph drawing is not a proof that the theorem’s hypotheses hold. |
| Posets and lattices | A partial order is reflexive, antisymmetric, and transitive. A lattice has a least upper bound and greatest lower bound for **every pair**. A Hasse diagram omits transitive edges. | Do not call a relation a total order because one displayed pair is comparable; do not call a poset a lattice merely because it has a top and bottom or because some pairs have meets/joins. |
| Asymptotics and recurrence analysis | (f\in O(g)), (\Omega(g)), and (\Theta(g)) are eventual quantified statements under a stated cost model. Recurrence analysis must name the recurrence, base conditions, and relevant assumptions. | Wall-clock timing is an observation tied to an input, machine, language runtime, and measurement method—not a proof of an asymptotic bound or a portability guarantee. |
| Number theory | State the domain and modulus. For a positive modulus (m), (a) has a modular inverse exactly when \(\gcd(a,m)=1\); Euclid/extended Euclid explains the witness. | A successful API call, small test, or modular arithmetic fact is not a cryptographic security proof. In particular, call out the precondition before any `pow(a, -1, m)` demonstration. |

## Audit corrections and authoring checks

1. **Promote MIT 6.1200J for learner links.** It is a current, first-party undergraduate offering with an explicit reading order. Retain 6.042J 2015/2005 as archival cross-checks, but do not pretend that a historic course page is a current specification.
2. **Split MIT licenses by asset.** The 2024 MIT course page says its linked *Mathematics for Computer Science* textbook is CC BY-SA; MIT OCW’s general terms say CC BY-NC-SA 4.0. The existing source map’s “check the exact asset” caveat is correct and must remain operational in each source card.
3. **Pin Levin’s edition before adaptation.** The 4th-edition public site says CC BY-NC-SA 4.0, while the repository’s `edition` branch currently exposes a different CC BY-SA license file. This is not a reason to reuse under the looser term; it is a reason to link/pin the intended asset and use the published edition’s displayed notice until clarified.
4. **Preserve the existing link-only policy for Hammack and Wilf.** Hammack is CC BY-NC-ND; Wilf’s download terms allow limited educational reproduction but prohibit commercial reproduction/re-hosting. Neither is a safe source for transformed Atlas diagrams or rewritten exercise banks.
5. **Keep theorem scope narrow and checked.** Use Hall’s theorem only after learners name bipartition, neighborhood (N(S)), quantified subset (S), and matching side. Use lattice vocabulary only after learners test all pairs for meet/join. State `O`/`Theta` quantifiers and cost model before plotting timings.
6. **Attach a source card to every non-original figure, exercise, proof snippet, or code example.** Record title, author/owner, exact URL, version/commit if available, access date, license, attribution text, whether altered, and the actual distribution decision. A source page’s broad license never automatically covers third-party images, assessment banks, or solutions linked from it.

## Minimal M27 source bundle by session

| Session | Default reading / evidence source | Optional depth |
| --- | --- | --- |
| 1 — definitions, logic, models | MIT MCS proofs; Open Logic Project | Lean propositions and quantifiers |
| 2 — proof construction, induction, invariants | MIT MCS proofs/state machines; original Atlas proof repairs | *Book of Proof* (link-only) |
| 3 — counting, recurrences, generating functions, asymptotics | MIT MCS counting/recurrences/asymptotics; Levin; Wilf for optional depth | Erickson appendices |
| 4 — graphs, trees, connectivity, and matchings | MIT MCS graphs/matching; Levin matching section | Erickson graph/flow chapters |
| 5 — partial orders, lattices, and elementary number theory | MIT MCS partial orders and number theory; Judson lattice vocabulary | Lean micro-lab |
| 6 — integrate the models: proof dossier and AI review | Original Atlas synthesis using the preceding scoped sources | Optional learner-selected source rereading |

## Evidence language to preserve in the portal

Use labels consistently:

- **Definition/model:** applies only to its declared mathematical domain.
- **Theorem/proof:** applies only under its stated hypotheses.
- **Code/API contract:** applies to the named library/version, not automatically to the mathematical model.
- **Finite experiment:** reports only the observed inputs/environment.
- **AI proposal:** a draft to check, never source authority.

That vocabulary is the bridge from M27’s proof literacy to M28–M36: it prevents a correct-looking trace, a formalization with hidden assumptions, or an AI-generated derivation from being mistaken for a universally established result.
