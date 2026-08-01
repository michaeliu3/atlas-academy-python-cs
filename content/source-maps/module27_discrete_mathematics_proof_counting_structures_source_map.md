# Module 27 — Discrete Mathematics, Proof, Counting & Structures: Source Map

## Document status

- **Purpose:** source, claim, licensing, and teaching map for the Module 27
  workbook, proof/counterexample studio, visual diagrams, diagnostics,
  reference-model exercises, TA sessions, study-partner prompts, and the first
  mathematical mastery gate in Atlas Core.
- **Course position:** M27 is the mathematical bridge between the existing
  Python/algorithms core and M28–M36. It gives the learner a language for
  stating assumptions, constructing proofs, modeling a finite structure,
  counting alternatives, and recognizing when a program is only an experiment
  rather than a proof. It unlocks linear algebra, probability, optimization,
  formal languages, classical AI, machine learning, and the re-positioned final
  evidence/capstone synthesis.
- **Research snapshot:** **2026-07-30**. URLs, editions, course materials, and
  licenses were checked on that date. Pin a source revision or access date in a
  learner artifact when the exact wording, exercise, code, or edition matters.
- **Reader-first rule:** this map supports demanding mathematics, not a
  shortcut around it. The portal should state the formal definition first,
  then a plain-language model, a minimal counterexample, a worked proof or
  trace, and a transfer task. A visual is an aid to attention; it is never the
  proof.
- **Copyright boundary:** Atlas explanations, diagrams, counterexamples,
  question stems, answer explanations, Python fixtures, proof repairs, and
  project briefs must be original. Link to and narrowly paraphrase external
  material. Do not copy substantial text, figures, lecture slides, homework,
  solutions, proof scripts, or textbook exercises unless a source card below
  expressly permits that use and the actual distribution/license obligations
  have been checked.

This is an instructor-facing source and evidence boundary, not a learner-facing
textbook. It records what a source is qualified to support and, just as
important, what it cannot establish.

---

## Executive teaching decision

Programming learners often encounter discrete mathematics as a collection of
symbols: a few truth tables, a recurrence template, a graph vocabulary list,
and a few complexity mnemonics. That produces a damaging gap. A learner may
write a program that seems to work on ten inputs without being able to state
its contract, show why it terminates, prove what it returns, distinguish a
counterexample from an exception, or say which assumption made the result true.

M27 instead builds one chain of reasoning:

~~~text
precise vocabulary and domains
    → statements with quantifiers and countermodels
    → proof obligations and valid inference steps
    → induction / structural induction / invariant as state reasoning
    → counting and recurrence as a model of alternatives or cost
    → graphs, matchings, posets, and lattices as visible relations
    → asymptotic and number-theoretic claims with named assumptions
    → code trace or finite experiment that tests a consequence,
      never substitutes for the general argument
~~~

### Required M27 invariant

> **A mathematical claim is not established by a plausible explanation, an
> AI-generated proof, a few passing examples, a diagram, or a program run. A
> defensible claim names its domain and definitions, states its assumptions,
> gives a valid argument or identifies the theorem relied on, exposes a
> boundary or counterexample, and separates the formal result from the
> implementation or empirical observation.**

This is an Atlas teaching contract. It does not claim that one accelerated
module gives durable proof fluency, that a proof assistant validates an
informal problem statement, that an enumeration is feasible for arbitrary
input, or that an asymptotic class predicts a real program's runtime without a
cost model and workload.

### Evidence hierarchy for this module

| Rank | Source type | What it is allowed to support | What it cannot settle alone |
| --- | --- | --- | --- |
| 1 | A stated definition plus a checked proof or a cited theorem with its hypotheses | A mathematical result in the stated model. | Whether the learner can reconstruct the reasoning; whether code implements that model. |
| 2 | Official university course material and author-maintained open text | Scope, sequencing, notation, worked examples, and pedagogical framing. | A universal standard merely because a prestigious course used it. |
| 3 | Official language/tool documentation | A documented Python or Lean API/semantics in the named version. | A general theorem, an algorithmic complexity guarantee not documented there, or a cross-language property. |
| 4 | A finite Python trace, visualizer output, or simulation | What happened for the named inputs, version, and environment. | A universal statement, average-case conclusion, or proof of correctness. |
| 5 | AI-generated explanation, proof, translation, code, or review | A hypothesis, draft, or candidate counterexample to inspect. | Authority, correctness, citation validity, or permission to skip independent verification. |

Mathematics does not have a single web-page owner comparable to a programming
API. The sources below are authorities for their *own editions, course
materials, and software contracts*. A theorem used in Atlas remains contingent
on its exact statement and assumptions; the learner must still inspect or
reconstruct the proof appropriate to the module.

---

## Coverage ledger: every required topic has a source-backed learning move

| Required area | Formal nucleus that must appear | Best open/primary route | Mandatory learner move | Implementation / application boundary |
| --- | --- | --- | --- | --- |
| Propositional and predicate logic | Syntax, valuation/interpretation, implication, quantifier scope, free/bound variables. | S05, S01, S03 | Build a countermodel for a false universal claim; repair a quantifier-order error. | A Boolean expression is a program value; it is not automatically a model of an English claim. |
| Sets, functions, relations, equivalence | Membership, subset, product, total function, injective/surjective/bijective, relation properties, equivalence classes. | S05, S01, S03, S04 | Translate a data-contract sentence into a relation; classify it and produce a smallest failing pair. | Python `dict`/`set` behavior is an implementation/API question, not the definition of a relation. |
| Direct proof, contradiction, contrapositive | Implication, negation, witness, universal instantiation, contradiction, proof by cases. | S04, S05, S01 | Proof-reading: label every assumption and inference; repair one invalid proof. | A test case can refute a universal claim but normally cannot prove one. |
| Induction, structural induction, invariants, extremal arguments | Base case, induction hypothesis, induction step; recursive constructor; invariant initialization/preservation/use; well-founded measure; extremal choice. | S01, S02, S04, S06, S15 | Derive a loop invariant from a trace and prove initialization/preservation/postcondition; explain a failed induction hypothesis. | Unit tests show selected transitions; invariant proof covers all allowed transitions in its model. |
| Counting, permutations, combinations | Addition/product rules, bijection/double counting, inclusion–exclusion, binomial coefficients, pigeonhole principle. | S01, S03, S07 | Give the sample space and explain why cases are disjoint; validate a small count by enumeration without treating it as proof. | `math.comb` reports a documented result; enumeration can become infeasible exponentially. |
| Recurrences, generating functions | Recurrence with base conditions; solution/check; ordinary generating function as formal coefficient encoding. | S01, S03, S07, S09 | Derive a recurrence from a decomposition; verify candidate solution against base and recurrence; extract coefficients in a small case. | A symbolic/numeric series computation depends on representation and truncation. |
| Graphs, trees, connectivity, matchings | Graph/digraph, walk/path/cycle, tree, connected components, bipartite graph, matching, alternating path, Hall-type condition where taught. | S01, S02, S03, S07 | Read adjacency data, trace a search, state a graph invariant, and diagnose a greedy matching counterexample. | A visual graph or `graphlib` dependency order does not prove an input satisfies a theorem's hypotheses. |
| Partial orders and lattices | Reflexive/antisymmetric/transitive; comparability, Hasse diagram, least upper bound, greatest lower bound, meet/join, lattice. | S01, S05, S08 | Build a Hasse diagram from a relation; find an incomparable pair; prove or refute existence of a meet/join. | A topological order is one linear extension of a DAG, not a proof that every relation is a total order. |
| Asymptotic notation | Eventual bounds, quantifiers in `O`, `Ω`, `Θ`; cost model; recurrence/asymptotic connection. | S01, S07, S13, S14 | Negate an asymptotic claim precisely; choose constants and threshold or give a counterexample. | Wall-clock timing is an observation influenced by machine, interpreter, inputs, allocations, caches, and measurement method. |
| Basic number theory | Divisibility, gcd, Bézout-style reasoning where used, congruence, modular inverse, primes. | S01, S02, S03, S10 | Trace Euclid's algorithm; prove a modular implication with stated modulus; state when inverse exists. | `pow(a, -1, m)` has Python's documented preconditions and is not a cryptographic-system proof. |

### Deliberate exclusions and handoffs

- M27 introduces only the lattice vocabulary necessary to reason about posets,
  meet/join, Boolean-style structure, and later abstraction. It does **not**
  claim a full course in universal algebra, domain theory, or advanced lattice
  theory.
- M27 introduces proof methods and basic logic. M33 later treats formal
  languages, computability, reductions, and complexity in their own model;
  this module must not silently teach a partial theory-of-computation course.
- M27 may use finite enumerations to discover or falsify conjectures. It must
  make the finite-domain boundary explicit, then require the appropriate proof
  or counterexample for the general statement.
- Probability belongs principally to M30. Counting examples here may prepare
  sample-space reasoning but must not impersonate probability instruction.

---

## Source cards

The tags below distinguish **primary/first-party** ownership from secondary
exposition. In this context, an author-maintained open textbook is primary to
its own exposition; it is not an original research source for every theorem it
states.

### S01 — MIT 6.042J, *Mathematics for Computer Science* (Spring 2015)

- **Owner and status:** Massachusetts Institute of Technology OpenCourseWare;
  first-party university course publication. It is an undergraduate course
  source, not a mathematical specification.
- **URLs:**
  - [course home](https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/)
  - [syllabus and learning outcomes](https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/pages/syllabus/)
  - [reading sequence](https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/pages/readings/)
  - [course textbook PDF](https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/mit6_042js15_textbook.pdf)
  - [MIT OCW license/terms](https://ocw.mit.edu/pages/privacy-and-terms-of-use/)
- **Evidence class:** **primary for MIT's course design and stated outcomes**;
  strong first-party university source for a connected discrete-math-for-CS
  route.
- **What it supports exactly:** a course sequence connecting definitions,
  proofs, sets/functions/relations, state-machine invariants, elementary number
  theory, graphs/partial orders/matchings, counting, recurrences, asymptotics,
  and later probability. The syllabus explicitly makes proof evaluation,
  induction, invariant/termination reasoning, graph models, asymptotics, and
  counting learning outcomes.
- **Course use:** use it as the backbone for M27's six-session dependency
  order and as a source of *topic sequence*, not copied prose. Link selected
  chapters as optional primary reading. Rebuild diagrams, proof repairs, and
  diagnostics in original Atlas language and notation where possible.
- **Reuse/licensing:** OCW publishes its materials under CC BY-NC-SA 4.0 as
  described in its terms, subject to item-specific notices and third-party
  restrictions. Because a course page can include a separately copyrighted
  textbook/resource, check the exact asset before reuse. Default to links and
  original paraphrase; do not import textbook pages, solutions, or figures into
  the portal merely because they are reachable on OCW.
- **Claim boundary:** MIT using an approach is evidence of a respected
  undergraduate sequence, not proof that this course yields mastery in 60
  days or that every theorem/notation choice is canonical.

### S02 — MIT 6.042J course notes and in-class problem sequence (Fall 2005)

- **Owner and status:** MIT OpenCourseWare; first-party historical course
  publication by MIT faculty.
- **URLs:**
  - [course readings](https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-fall-2005/pages/readings/)
  - [lecture-note index](https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-fall-2005/pages/lecture-notes/)
  - [course syllabus/outcomes](https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-fall-2005/pages/syllabus/)
  - [MIT OCW license/terms](https://ocw.mit.edu/pages/privacy-and-terms-of-use/)
- **Evidence class:** **primary for that course's teaching artifacts**;
  supplementary to S01 rather than a competing syllabus.
- **What it supports exactly:** a useful source ordering for proof, predicates
  and sets, induction, binary relations, graphs, elementary number theory,
  state-machine invariants/termination, sums/products/asymptotics, counting,
  and generating functions. The notes distinguish lecture material, in-class
  problems, and solutions—an important design cue for prediction before
  explanation.
- **Course use:** adapt the *interaction pattern*: a short preparation prompt,
  a team/TA proof attempt, targeted feedback, and a repair. Write new Atlas
  problems and illustrations rather than copying its question/solution pairs.
- **Reuse/licensing:** same OCW CC BY-NC-SA framework and asset-specific
  caution as S01. Link to source material; use no slide or solution image
  without checking exact attribution/license and compatibility with Atlas's
  distribution.
- **Claim boundary:** a historical problem solution is a worked argument, not
  a learner's evidence of independent proof construction.

### S03 — Oscar Levin, *Discrete Mathematics: An Open Introduction*, 4th edition

- **Owner and status:** Oscar Levin / University of Northern Colorado
  mathematics professor; author-maintained open textbook and source repository.
- **URLs:**
  - [current HTML text and license statement](https://discrete.openmathbooks.org/dmoi4.html)
  - [download/source-repository page](https://discrete.openmathbooks.org/download.php)
  - [source repository](https://github.com/oscarlevin/discrete-book)
- **Evidence class:** **primary to the author's open exposition**; an
  open-textbook source, not original source authority for standard theorems.
- **What it supports exactly:** introductory counting, sequences and
  recurrences, induction, symbolic logic/proofs, graph theory including
  bipartite matching, generating functions, and introductory number theory. It
  also provides inquiry-oriented prompts that fit prediction-before-reveal
  design.
- **Course use:** use as the most broadly adaptable open reading companion.
  Map selected chapters to Sessions 1–5; use its topic boundaries to avoid
  treating generating functions as a detached trick. Prefer original Atlas
  examples involving API contracts, dependency graphs, scheduling, and
  state-machine traces.
- **Reuse/licensing:** the current fourth edition states **CC BY-NC-SA 4.0**.
  Attribution, noncommercial use, and share-alike obligations matter. Do not
  paste text/figures/exercises into an Atlas repository or deployable portal
  unless the project distribution and derivative obligations have been reviewed
  carefully. Link and paraphrase by default; original Atlas visualizations are
  safer.
- **Claim boundary:** a solved exercise or investigation can support a
  pedagogical analogy; it is not a substitute for a formal proof in the
  learner's own submission.

### S04 — Richard Hammack, *Book of Proof*, third edition

- **Owner and status:** Richard Hammack, Virginia Commonwealth University;
  author-maintained open proof textbook.
- **URLs:**
  - [author's book page and table of contents](https://richardhammack.github.io/BookOfProof/)
  - [AIM Open Textbook Initiative record](https://textbooks.aimath.org/textbooks/approved-textbooks/hammack/)
- **Evidence class:** **primary to the author's proof exposition**; high-value
  proof-language companion, not a formal specification.
- **What it supports exactly:** sets, conditional statements, direct proof,
  contrapositive, contradiction, induction, relations, functions, and
  cardinality in a proof-transition course. Its organization is especially
  useful for separating a claim, a given condition, a target, and the argument
  that connects them.
- **Course use:** use it to calibrate M27 proof vocabulary and to design
  short proof-reading/repair tasks before harder CS applications. The TA can
  require a learner to identify where an implication direction flips, a
  quantifier becomes illegal, or a base case is missing.
- **Reuse/licensing:** the author's site permits sharing with attribution but
  describes noncommercial/no-derivative restrictions; the AIM record identifies
  CC BY-NC-ND. Treat the content as **link-and-paraphrase only** unless the
  exact current license and intended use have been reviewed. Do not modify,
  crop, or republish passages/figures/exercises.
- **Claim boundary:** a polished proof template can teach structure but must
  not turn into a fill-in-the-blank ritual; learners need novel transfers and
  counterexamples.

### S05 — Open Logic Project, *Sets, Logic, Computation* and Open Logic Text

- **Owner and status:** Open Logic Project; collaboratively authored,
  open-source logic/formal-methods text. Primary to its own formal exposition
  and source code.
- **URLs:**
  - [*Sets, Logic, Computation*](https://slc.openlogicproject.org/)
  - [Open Logic Project license](https://openlogicproject.org/olp-license/)
  - [current build index](https://builds.openlogicproject.org/)
  - [natural-deduction proof checker](https://proofs.openlogicproject.org/)
- **Evidence class:** **primary/open source for this text and checker**;
  strong source for formal syntax, semantics, proof systems, sets, relations,
  functions, orders, graphs, and trees.
- **What it supports exactly:** the distinction among syntax, interpretation,
  validity, consequence, proof, and countermodel; formal treatments of sets,
  functions as relations, equivalence relations, and orders. The proof checker
  exposes a particular Fitch-style natural-deduction system, not every proof
  calculus.
- **Course use:** use as the precise logic companion for Session 1 and proof
  repair in Session 2. Let learners first reason on paper, then optionally
  encode one bounded propositional/first-order derivation to see which local
  rule is unsupported. Make a countermodel screen reader-friendly as a table
  and prose explanation, not only a diagram.
- **Reuse/licensing:** unless otherwise noted, website content is **CC BY 4.0**
  with attribution and change indication. The proof-checker code is separately
  GPLv3. Atlas can link to the checker; do not copy its code into a differently
  licensed project without a license review. Even CC BY content should be
  attributed and reused sparingly to keep Atlas's explanation original.
- **Claim boundary:** a checker accepts/declines a formalized argument in its
  rule system. It does not prove that the English statement was formalized
  correctly, that unstated domain assumptions hold, or that a program conforms
  to the theorem.

### S06 — Lean 4 documentation and *Theorem Proving in Lean 4*

- **Owner and status:** Lean project / Lean FRO and named authors; official
  language and tutorial documentation.
- **URLs:**
  - [*Theorem Proving in Lean 4*](https://docs.lean-lang.org/theorem_proving_in_lean4/)
  - [propositions and proofs chapter](https://docs.lean-lang.org/theorem_proving_in_lean4/Propositions-and-Proofs/)
  - [induction and recursion chapter](https://docs.lean-lang.org/theorem_proving_in_lean4/Induction-and-Recursion/)
  - [Lean Language Reference](https://lean-lang.org/doc/reference/latest/)
  - [Lean source repository and license](https://github.com/leanprover/lean4)
- **Evidence class:** **primary official documentation** for Lean's stated
  language/tool behavior in a named version.
- **What it supports exactly:** propositions-as-types, explicit proof goals,
  quantifiers/equality, inductive types, induction/recursion, and the idea that
  a small kernel checks proof terms in Lean's formal system. It supports an
  optional formalization lens for structural induction, not a replacement for
  M27's informal proof pedagogy.
- **Course use:** optional “AI-era verification microscope.” After the learner
  writes a human proof, encode one tiny theorem such as list-length append or
  a simple logical validity. Require them to explain the statement, induction
  variable, base case, and why placeholders/axioms invalidate evidence.
- **Reuse/licensing:** Lean code is Apache-2.0; documentation and tutorial
  assets may have their own repository notices. Link by default and verify the
  exact material's license before copying prose/code. Never include a proof
  containing `sorry`, unreviewed axioms, or a version-unpinned dependency as
  final proof evidence.
- **Claim boundary:** kernel checking is powerful evidence for the encoded
  theorem under the imported foundations; it does not establish informal
  intent, specification adequacy, or absence of bad assumptions.

### S07 — Jeff Erickson, *Algorithms*

- **Owner and status:** Jeff Erickson, University of Illinois Urbana-Champaign;
  author-maintained course textbook used for Illinois theoretical-CS courses.
- **URLs:**
  - [book and permissions page](https://jeffe.cs.illinois.edu/teaching/algorithms/index.html)
  - [book chapter index](https://jeffe.web.engr.illinois.edu/teaching/algorithms/index.html)
- **Evidence class:** **primary to the author's algorithm exposition** and
  licensing terms; high-trust university source for recurrences, graph
  algorithms, matching/flow context, and proof-based algorithm analysis.
- **What it supports exactly:** recursive specification, recurrence solving,
  proof-driven algorithm design, basic graph algorithms, graph search, and
  matching/flow connections needed to make M27 serve later algorithm modules.
- **Course use:** use as a forward bridge rather than duplicate the algorithms
  arc. Have the learner read a short recursive or graph-algorithm fragment,
  state its invariant/precondition, derive a recurrence, and separate
  correctness from complexity. Use it as optional deep reading for matching and
  asymptotics.
- **Reuse/licensing:** the textbook is **CC BY 4.0**; other notes on the site
  are CC BY-NC-SA 4.0. Identify which asset is being reused, provide
  attribution/change indication, and prefer original illustrations. Do not
  assume all linked material inherits the book license.
- **Claim boundary:** algorithm pseudocode plus an informal sketch does not
  establish a complexity bound unless the model, recurrence, and proof are
  stated. A matching implementation is not automatically maximum merely
  because it returns a matching.

### S08 — Thomas W. Judson, *Abstract Algebra: Theory and Applications*

- **Owner and status:** Thomas W. Judson / University of Puget Sound and
  author-maintained open textbook project.
- **URLs:**
  - [current project/home page](https://judsonbooks.org/abstract-algebra-theory-and-applications/)
  - [open-source and GFDL explanation](https://abstract.ups.edu/abstract.ups.edu/)
  - [current HTML edition](https://judsonbooks.org/aata-files/aata-html/aata.html)
- **Evidence class:** **primary to the author's algebra exposition**; a
  suitably rigorous, optional depth source for lattices/Boolean algebra.
- **What it supports exactly:** a transition from partial orders to lattices
  and Boolean-algebra examples, with exercises and accessible HTML production.
  It supports the M27 definition of a lattice as a poset where each relevant
  pair has a join and meet, plus later links to logic and program/specification
  design.
- **Course use:** keep lattice scope deliberately small: draw Hasse diagrams,
  test join/meet existence, contrast a poset that is not a lattice, then show
  why this vocabulary reappears in type/order/design settings. Reserve advanced
  universal-algebra sections for post-Core deep dives.
- **Reuse/licensing:** its open-source edition is distributed under the GNU
  Free Documentation License (GFDL), with notices/conditions that must travel
  with modified redistribution. Link and paraphrase by default; do not copy a
  chapter/figure into Atlas unless the exact edition and GFDL obligations have
  been reviewed.
- **Claim boundary:** Boolean notation and a lattice diagram are not evidence
  that a given software type hierarchy or permissions system forms a lattice;
  the set, order relation, and required joins/meets must be proved.

### S09 — Herbert S. Wilf, *generatingfunctionology*

- **Owner and status:** Herbert S. Wilf / University of Pennsylvania author
  archive, with publisher copyright notices retained.
- **URLs:**
  - [official download and permission terms](https://www2.math.upenn.edu/~wilf/DownldGF.html)
  - [linked PDF edition](https://www2.math.upenn.edu/~wilf/gfologyLinked2.pdf)
- **Evidence class:** author-hosted educational text; **not open-licensed for
  general remixing** despite free access.
- **What it supports exactly:** generating functions as a serious tool for
  encoding sequences and solving/counting recurrences. It is an optional
  deepening resource after the learner can already derive a recurrence and
  check base cases.
- **Course use:** present one ordinary generating-function story visually:
  “coefficient at `x^n` means count of size-`n` objects.” Let the learner derive
  a small product and compare coefficients with enumeration. Keep formal-power-
  series versus analytic-convergence distinctions explicit.
- **Reuse/licensing:** the official page allows reproduction only for valid
  educational purposes of institutions and prohibits profit/commercial use and
  reposting the file. **Do not redistribute, embed, copy figures, or make it a
  portal download.** Link to the official page and paraphrase original Atlas
  examples only.
- **Claim boundary:** manipulating a generating function formally does not
  license analytic convergence arguments; state whether the object is a formal
  series or an analytic function.

### S10 — Python 3.14 standard-library math/combinatorics/graph APIs

- **Owner and status:** Python Software Foundation / CPython documentation;
  official language-library documentation.
- **URLs:**
  - [`math`](https://docs.python.org/3.14/library/math.html)
  - [`itertools`](https://docs.python.org/3.14/library/itertools.html)
  - [`graphlib`](https://docs.python.org/3.14/library/graphlib.html)
  - [`pow` built-in](https://docs.python.org/3.14/library/functions.html#pow)
  - [Python documentation/license history](https://docs.python.org/3.14/license.html)
- **Evidence class:** **primary official API source** for named Python 3.14
  library behavior, error conditions, and documented examples.
- **What it supports exactly:** `math.comb`, `math.perm`, `factorial`, `gcd`,
  `lcm`, and `isqrt`; iterator-producing combinations/permutations/product;
  `TopologicalSorter` for dependency order; and the three-argument `pow`
  modular-inverse precondition/behavior. It also supports a concrete distinction
  between a mathematical count and lazy enumeration.
- **Course use:** provide code-reading, not typing-first, activities:
  1. predict when `combinations` and `math.comb` agree and why positions versus
     values matter;
  2. trace Euclid-style gcd/modular-inverse preconditions before using `pow`;
  3. inspect a dependency graph, predict a topological-order failure boundary,
     and state why a topological sort is not a proof of general DAG theory.
- **Reuse/licensing:** Python documentation and software use the PSF License;
  documentation examples/recipes have an additional 0BSD grant described by
  the license page. Attribute version/source and check any incorporated
  third-party notice. Prefer original fixtures and short API-linked snippets
  rather than copying large documentation sections.
- **Claim boundary:** these APIs document Python's behavior, not the
  complexity of all operations, mathematical truth outside input conditions,
  correctness of a user-supplied model, or behavior of other Python versions/
  implementations.

### S11 — Velleman, *How to Prove It: A Structured Approach*, third edition

- **Owner and status:** Daniel J. Velleman / Cambridge University Press;
  commercially published reference standard, not open courseware.
- **URL:** [publisher page](https://www.cambridge.org/highereducation/books/how-to-prove-it/6D2965D625C6836CD4A785A2C843B3DA)
- **Evidence class:** respected **secondary/reference text** and standard
  anchor for proof pedagogy, logic, relations, functions, induction, and basic
  number theory.
- **What it supports exactly:** a quality benchmark for the scope and rigor of
  a proof transition course; it should inform prerequisite/terminology checks,
  not become a hidden required purchase.
- **Course use:** use its table of contents as a syllabus cross-check. Ensure
  M27 covers proof construction and proof reading before borrowing advanced
  notation in later modules. Recommend through library/legitimate access for a
  learner who wants extra proofs.
- **Reuse/licensing:** commercial copyright. Link/bibliographically cite only;
  no copied prose, exercises, solutions, figures, or scans.
- **Claim boundary:** its reputation is not a license and is not evidence that
  an Atlas learner has mastered proof construction.

### S12 — Kenneth H. Rosen, *Discrete Mathematics and Its Applications*, 8th edition

- **Owner and status:** Kenneth H. Rosen / McGraw Hill; commercially published
  comprehensive discrete-mathematics reference.
- **URL:** [publisher page](https://www.mheducation.com/highered/product/discrete-mathematics-and-its-applications-rosen.html)
- **Evidence class:** respected **secondary/reference text** and breadth
  benchmark; publisher page confirms its topics rather than granting content
  reuse.
- **What it supports exactly:** a scope cross-check spanning logic/proofs,
  sets/functions, number theory, induction/recursion, counting, relations,
  graphs, trees, and computation modeling.
- **Course use:** use only as an instructor checklist and optional library
  reference. Its broad table of contents helps ensure M27 does not omit
  relations, number theory, or graph/tree vocabulary while rushing toward AI.
- **Reuse/licensing:** commercial copyright. Link/cite only. Do not reproduce
  pages, examples, exercise wording, figures, Connect content, or solutions.
- **Claim boundary:** matching chapter headings is not meaningful proof of
  conceptual coverage; Atlas must still provide definition, proof, boundary,
  and transfer evidence for each required topic.

### S13 — Graham, Knuth, and Patashnik, *Concrete Mathematics*, second edition

- **Owner and status:** Ronald L. Graham, Donald E. Knuth, Oren Patashnik /
  Pearson/Addison-Wesley; commercially published standard.
- **URLs:**
  - [Stanford author page and errata](https://www-cs-faculty.stanford.edu/~knuth/gkp.html)
  - [publisher page](https://www.pearson.com/en-us/subject-catalog/p/concrete-mathematics-a-foundation-for-computer-science/P200000000288/9780201558029)
- **Evidence class:** respected **secondary/reference text** for sums,
  recurrences, asymptotics, and discrete manipulation.
- **What it supports exactly:** a depth/rigor benchmark for recurrence
  derivation, sums, and generating-function-adjacent reasoning. It helps set
  the standard that an algorithmic expression should be derived and checked,
  not memorized as a recipe.
- **Course use:** use solely as an instructor/advanced-learner anchor. M27's
  required route should remain readable with open sources; recommend legitimate
  library access for optional deep practice after the Core.
- **Reuse/licensing:** commercial copyright. Link/cite only; no copied
  exercises, diagrams, prose, answer keys, or scans.
- **Claim boundary:** a sophisticated manipulation technique does not fix an
  incorrectly modeled recurrence or unstated base condition.

### S14 — CLRS, *Introduction to Algorithms*, fourth edition

- **Owner and status:** Cormen, Leiserson, Rivest, Stein / MIT Press;
  commercially published algorithms standard.
- **URL:** [MIT Press fourth-edition page](https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/)
- **Evidence class:** respected **secondary/reference text**; an algorithmic
  bridge standard, not a reusable source of course assets.
- **What it supports exactly:** scope and vocabulary for asymptotic analysis,
  recurrence equations, graph/matching algorithms, and proof-based algorithm
  reasoning that later Atlas modules will develop.
- **Course use:** use it to ensure M27's forward handoff teaches assumptions,
  asymptotic quantifiers, recurrence derivation, graph abstraction, and
  matching vocabulary correctly. Link an optional legitimate-access reading;
  do not turn M27 into a CLRS substitute.
- **Reuse/licensing:** commercial copyright. Link/cite only; no copied
  pseudocode, figures, exercise text, tables, or protected instructor assets.
- **Claim boundary:** a cited algorithm textbook is not evidence a learner can
  trace, prove, debug, or select an algorithm in a new context.

### S15 — Harm Derksen, *Problem Solving*, discrete extremal principle notes

- **Owner and status:** Harm Derksen, University of Michigan faculty-hosted
  course notes; first-party faculty teaching material with no explicit general
  reuse license visible in the source.
- **URL:** [chapter on the extremal principle](https://sites.lsa.umich.edu/hderksen/wp-content/uploads/sites/614/2018/05/ProblemSolving-1.pdf)
- **Evidence class:** **primary to the author's course-note exposition**;
  targeted supplementary source for the extremal-principle technique rather
  than a general discrete-math text.
- **What it supports exactly:** the finite/discrete extremal pattern: choose an
  object maximizing or minimizing a real-valued quantity over a finite
  candidate set, then use the fact that a permissible perturbation cannot be
  more extreme. It offers graph-flavored proof examples, which makes the
  connection to cuts/matchings and algorithmic local changes concrete.
- **Course use:** give an original finite-state or graph-cut problem. Require
  the learner to identify (a) the candidate set, (b) why an extremal element
  exists, (c) the chosen potential/objective, (d) a perturbation, and (e) the
  contradiction or bound. Contrast this with an invalid “choose the biggest”
  argument on an infinite/unbounded set.
- **Reuse/licensing:** **link and paraphrase only**. No explicit broad reuse
  license was located with the note; do not copy its problem statements,
  solutions, figures, or pages into Atlas.
- **Claim boundary:** an extremal argument needs an existence condition and a
  correctly defined objective/order. “Choose a maximum” is not legal merely
  because a quantity appears large in a finite experiment.

---

## Source-to-session design

The module needs six connected sessions, not six isolated topic dumps. This
sequence makes the dependence visible and keeps cognitive load proportional to
the actual formal difficulty.

| Session | Driving question | Formal work | Primary reading/source mix | Reader-first interaction and evidence |
| --- | --- | --- | --- | --- |
| 1. Claims, domains, and countermodels | “What exactly would make this statement true or false?” | Propositions, predicates, quantifiers, sets, functions, relations, equivalence. | S05 + S01; S03 as open companion. | Start with one ambiguous product/data claim, force domain/quantifier choices, then reveal a two-element countermodel. Learner records the difference between an English sentence, its formalization, and a Python predicate. |
| 2. Proof as a checked chain | “What must be true at every line for the conclusion to follow?” | Direct proof, cases, contrapositive, contradiction, induction, structural induction, invariants, extremal/well-founded reasoning. | S04 + S01/S02 + S15; S06 optional. | Give a deliberately almost-correct proof. Learner marks assumptions, invalid inference, missing case, and repaired version before seeing feedback. A loop trace becomes invariant initialization/preservation/use. |
| 3. Count, decompose, encode, and bound | “Which objects are we counting, and why is every object counted exactly once?” | Addition/product rules, bijections, inclusion–exclusion, pigeonhole, recurrence/base cases, ordinary generating functions, `O/Ω/Θ`. | S01 + S03 + S07 + S09; S10 code trace. | Learner labels the sample space, compares a `math.comb` value with enumerated positions, derives a recurrence, checks a coefficient claim in a small formal-series case, and names the finite-experiment boundary. |
| 4. Relationships at scale | “Which connection pattern is guaranteed, and which merely looks plausible?” | Graphs/trees/connectivity, bipartite graphs/matchings, relation graphs. | S01/S02 + S03 + S07. | Read an adjacency structure, make a BFS/DFS prediction, build an alternating-path explanation, and refute a greedy matching claim with a minimal graph. |
| 5. Partial information and modular reasoning | “When does ‘before’ form an order, and when does a modular claim have a witness?” | Partial orders, Hasse diagrams, lattices; divisibility, gcd, congruence, modular inverse. | S05 + S08 + S01/S02; S10. | Learner derives a Hasse diagram from pair facts, finds a missing join, then proves a modular step and tests `pow` only after checking the gcd condition. |
| 6. Integrate the models | “What evidence distinguishes a proof, a counterexample, a trace, and an AI proposal?” | Capstone proof/counterexample dossier, AI-proposal review, constructive oral defense. | S01 + S14; earlier session artifacts. | Learner defends one proof, one counterexample, one trace, and one implementation boundary without treating the oral conversation as a formal grade. |

### Session-to-future-module handoff

| M27 result | Later use |
| --- | --- |
| Definitions/quantifiers/proof repair | M28–M31 derivations; M33 formal languages/complexity; M36 theorem assumptions. |
| Induction, structural induction, loop invariants | Algorithms, recursive data, interpreters, operating systems, distributed-system safety arguments. |
| Counting/recurrences/asymptotics | Probability/M30, algorithm analyses, ML sample/computational tradeoffs, systems capacity reasoning. |
| Graphs/matchings/partial orders | Search/planning/M34, dependency/concurrency models, DAG scheduling, flow and matching in algorithms. |
| Number theory/modular reasoning | Security/cryptography context, hashing, algebraic and programming-language reasoning. |
| Formal-vs-code-vs-observation distinction | Every later mathematical/AI module and the final evidence/capstone synthesis. |

---

## Formal model, implementation, and observation labels

Every M27 artifact should display one of these labels close to the relevant
claim. This prevents a learner from mixing layers silently.

| Label | Meaning | Example | Explicit non-claim |
| --- | --- | --- |
| **[DEFINITION]** | Chosen mathematical meaning with a named domain. | “`R` is an equivalence relation on `S` iff it is reflexive, symmetric, and transitive.” | A Python relation-like object already has those properties. |
| **[THEOREM / PROOF]** | Result in a stated model, with assumptions and proof/attribution. | “If the loop invariant holds initially and is preserved, it holds at termination.” | The implementation terminates or meets the postcondition without checking its transition model. |
| **[COUNTEREXAMPLE]** | A valid instance that refutes a universal statement or implication. | One graph where a greedy matching is not maximum. | Every similar algorithm fails, or a different theorem is false. |
| **[CODE CONTRACT]** | Named API/language behavior in a pinned version. | Python 3.14 documents `math.comb(n, k)` input/output conditions. | The result makes the associated counting proof unnecessary. |
| **[FINITE TRACE]** | Observation for the listed inputs/environment. | Enumeration confirms a count for `n ≤ 6`. | A proof for all `n`; feasibility for large `n`. |
| **[COURSE MODEL]** | Intentional simplification built for learning. | A six-node dependency graph for an architecture example. | A complete production dependency model. |
| **[AI PROPOSAL]** | Untrusted draft from a model/agent. | An LLM suggests an induction step. | A proof or citation until independently checked. |

### Required counterexamples and boundaries

The workbook should create original, minimal examples for each of these—not
copy a textbook's chosen figure or exercise.

1. A true-looking implication whose converse is false.
2. A swapped quantifier claim (`∀x ∃y` versus `∃y ∀x`) with a two-element
   model.
3. A relation that is reflexive/transitive but not symmetric; one that is
   symmetric/transitive but not reflexive; and a partial order with
   incomparable elements.
4. An induction proof whose base case is insufficient or whose induction
   hypothesis is too weak.
5. A loop that passes a few tests but violates its invariant on a later state.
6. A count that overcounts because cases overlap, plus a count that undercounts
   because order was discarded.
7. A recurrence whose formula agrees for early `n` but fails a base condition
   or recurrence step.
8. A graph in which a locally plausible matching is not maximum.
9. A poset in which a pair has no least upper bound or no greatest lower bound,
   so it is not a lattice.
10. A timing plot where a small-input observation cannot distinguish two
    asymptotic claims.
11. A modular inverse request where `gcd(a, m) ≠ 1`, showing that `pow`'s
    precondition matters.

---

## Code-reading and numerical-experiment sources

M27 must use code to clarify a model, not make programming output the evidence
of mathematical mastery.

### A. Counting: formula versus enumeration

- **Read:** the documented behavior of `math.comb`, `itertools.combinations`,
  `itertools.permutations`, and `itertools.product` in S10.
- **Task:** before execution, answer:
  1. what is an element of the sample space?
  2. are identities carried by positions or values?
  3. is order meaningful?
  4. can the iterator materialize every case safely?
- **Trace:** compare an original small enumeration against `math.comb(n, k)`;
  record only a finite agreement, then write the bijection/counting argument.
- **Boundary:** duplicate values, repeated positions, lazy iterator consumption,
  and large `n` are all different questions. Do not explain `n choose k` by
  “Python produced it.”

### B. Recurrence and invariant: intended state versus observed state

- **Read:** a compact original function that constructs a sequence or performs
  a graph traversal. Give it a precondition, state variables, and a target
  property before running it.
- **Task:** write an invariant in three parts: initialization, preservation,
  use at termination. Then identify the measure that rules out nontermination
  if one is needed.
- **Trace:** show two iterations in a memory/runtime trace with values that
  make the invariant visible; include a textual table for accessibility.
- **Boundary:** the trace is a teaching aid. The universal conclusion comes
  only from the complete argument over all legal transitions.

### C. Graph dependencies: partial order, not a universal schedule proof

- **Read:** S10's `graphlib.TopologicalSorter` contract and an original tiny
  dependency fixture.
- **Task:** determine the relation, identify whether it is acyclic, predict a
  valid order, and state what a cycle says about the particular dependency
  model.
- **Trace:** contrast a Hasse-style reduced relation with a directed-edge list;
  explain that many valid linear extensions may exist.
- **Boundary:** an API output witnesses one order for one encoded graph. It
  does not show real-world dependencies are complete, a build is reproducible,
  or an arbitrary relation is a poset.

### D. Number theory: named preconditions before an API call

- **Read:** S10's `math.gcd` and three-argument `pow` documentation.
- **Task:** trace Euclid's algorithm, derive the gcd condition for a modular
  inverse, then predict whether the call is defined for a chosen pair.
- **Trace:** record divisibility/congruence steps next to the Python result.
- **Boundary:** code tests an instance. It does not establish security,
  primality, cryptographic suitability, constant-time behavior, or a general
  theorem without a proof.

---

## Assessment and mastery-gate design backed by the source map

### Efficient diagnostic patterns

Use short multiple-choice questions where each alternative exposes a distinct
model error. Each answer explanation must state the formal reason, why the
attractive alternatives fail, and what bridge activity follows—not merely show
the right letter.

| Misconception to diagnose | Better question shape | Evidence of understanding |
| --- | --- | --- |
| “Implication means causation or biconditional.” | Give four candidate converses/contrapositives and a small domain. | Learner identifies the logically equivalent statement and produces a countermodel for another. |
| “Examples prove universals.” | Show several passing values plus a candidate proof step. | Learner selects the missing universal argument and states why tests are insufficient. |
| “Induction means assume what you want.” | Present base, hypothesis, and step choices. | Learner identifies exactly which `n` is assumed and what must be proved for `n+1`. |
| “All relations are functions/orders.” | Provide a tiny pair set. | Learner checks the required properties in the correct direction. |
| “Multiply counts whenever tasks occur together.” | Describe overlapping case categories. | Learner spots non-disjointness or non-independent choice. |
| “A recurrence without base conditions is defined.” | Give two same-form recurrences with different bases. | Learner explains why the sequences differ. |
| “A graph drawing proves a graph property.” | Give an edge list and an attractive picture. | Learner reasons from formal adjacency/path requirements. |
| “`O(f)` means approximately f.” | Ask for a negation or constants/threshold. | Learner writes/says the eventual-bound structure. |
| “Modular division always works.” | Ask whether an inverse exists before calling an API. | Learner invokes the gcd condition and exhibits/denies a witness. |

### First mathematical mastery gate: proof, trace, counterexample, transfer

The completion gate should be a short written/oral packet, not an exam of
routine calculations. It requires all five parts:

1. **Definition and assumptions:** state a relation/function/graph or
   recurrence precisely, including domain and base conditions.
2. **Proof or proof repair:** construct or repair a direct, contrapositive,
   contradiction, induction, structural-induction, or invariant argument. The
   learner labels the role of each premise and step.
3. **Counterexample:** give a minimal counterexample to a nearby false claim
   and explain which hypothesis was removed or conclusion strengthened.
4. **Code/model reading:** predict a bounded Python trace (counting, dependency
   graph, or number theory), run it, and distinguish what the result observes
   from what the proof establishes.
5. **Transfer/oral defense:** apply the same reasoning to a new algorithm,
   data contract, scheduling graph, or AI-system claim. Name one thing that an
   AI proposal could get wrong and how it would be verified.

#### Mastery rubric

| Dimension | Bridge | Ready to advance | Strong first-pass evidence |
| --- | --- | --- | --- |
| Definitions | Uses terms informally or changes domain mid-argument. | States most required objects/properties with minor notation help. | States domain, quantifiers, and assumptions precisely; identifies a boundary. |
| Proof reasoning | Gives examples or plausible prose in place of implication. | Has a valid outline but needs help with cases/base/quantifiers. | Produces/reconstructs a valid chain and locates a subtle invalid step. |
| Counterexamples | Finds unrelated edge cases. | Gives a correct counterexample with prompting. | Finds a minimal counterexample and explains the failed hypothesis. |
| Code reading | Reports output without a model. | Predicts simple output and names one limitation. | Connects contract/trace/invariant to result and refuses an overclaim. |
| Transfer | Repeats a memorized format. | Chooses an appropriate method with hints. | Selects/defends a proof model or graph/counting abstraction in a new scenario. |

No score alone advances the learner. A result at **Bridge** triggers a focused
repair session; **Ready to advance** permits the next module with a spaced
review note; **Strong first-pass evidence** supports faster pacing but not a
claim of durable mastery.

---

## Teaching-assistant and study-partner source use

### Teaching Assistant: proof and derivation coach

Use the source map to avoid premature answers. The TA should:

1. ask for the domain, definitions, and quantifiers before manipulating a
   symbol;
2. ask the learner to name the proof obligation and intended conclusion;
3. request a minimal counterexample when an implication/definition is false;
4. distinguish a valid proof from a plausible story, a trace, or an API result;
5. diagnose whether an induction failure is a bad base, weak hypothesis,
   missing invariant, or unspecified transition; and
6. when using a cited source, identify whether it is a theorem/exposition, an
   API contract, or a finite experiment and restate its boundary.

Reusable TA prompt fragment:

> Do not give the completed proof first. Ask me to state the universe/domain,
> definitions, assumptions, and target. Then ask which proof method is
> appropriate and why. If my argument fails, locate the first invalid inference
> or missing case, give the smallest useful counterexample or trace, and let me
> repair it. Separate a theorem, its hypotheses, a Python/Lean API contract,
> and an experiment. Treat an AI-generated proof as a draft requiring an
> independent line-by-line check.

### Study Partner: Socratic reading and retrieval partner

The Study Partner should run 5–10 minute retrieval rounds, not lecture.

1. show a small relation/graph/recurrence and ask for definitions before names;
2. request a prediction before code or visualization is revealed;
3. ask “what is the smallest counterexample?” and “what assumption makes the
   theorem legal?”;
4. alternate a proof-reading line with a code-reading line; and
5. rehearse a one-minute oral explanation of one invariant, one count, one
   Hasse diagram, and one overclaim to reject.

Reusable Study Partner prompt fragment:

> Be a Socratic proof-and-code-reading partner. Ask one short question at a
> time. Make me retrieve definitions, assumptions, and the next proof
> obligation before you explain. Challenge a hidden assumption in my graph,
> recurrence, data model, or AI-generated proof. Ask for a counterexample and
> a prediction-before-reveal. Do not equate a few tests, a visualizer, or a
> proof-assistant check with the whole claim; ask what has actually been
> established.

---

## Reuse, accessibility, and release-policy matrix

| Source family | Default portal action | Permissible reuse posture | Must not do |
| --- | --- | --- | --- |
| MIT OCW (S01–S02) | Link curated readings and describe original Atlas activity. | CC BY-NC-SA material may be reused only after exact asset/attribution/noncommercial/share-alike review. | Assume a linked textbook/third-party item is automatically reusable; copy solutions/slides wholesale. |
| CC BY text (S05, S07 book) | Link and cite; create original diagrams/activities. | Limited adapted material with attribution and changed-material notice after checking exact asset/license. | Lose attribution or mix a separately licensed asset under the wrong terms. |
| CC BY-NC-SA text (S03; some S07 notes) | Link by default; original Atlas paraphrase. | Reuse only when noncommercial/share-alike implications are accepted and recorded. | Put adapted material into an incompatible license/distribution or imply commercial permission. |
| No-derivative / restricted download (S04, S09) | Official link only. | Read and paraphrase original Atlas content. | Alter, embed, republish, or redistribute text/PDF/figures. |
| GFDL material (S08) | Link and cite. | Reuse only with complete GFDL compliance review, notices, and derivative conditions. | Copy a section without carrying required license obligations. |
| Faculty notes without an explicit reuse license (S15) | Official link and original Atlas activity. | Paraphrase a method after attribution. | Treat free web access as an adaptation/republication license. |
| Commercial references (S11–S14) | Bibliographic/official purchase-or-library link only. | Tiny attributable quotation only when legally appropriate; usually avoid. | Copy prose, exercises, diagrams, pseudocode, answer keys, or scans. |
| Python/Lean documentation (S06, S10) | Pin version and link the exact page. | Use short API snippets only under verified documentation/code terms with attribution. | Present API behavior as a language-independent theorem or rely on an unpinned tool result. |

### Accessibility rules for source-derived learning material

- Build original SVG/HTML diagrams with a text-equivalent relation table,
  edge list, or proof outline. Do not use a source image as the only
  explanation.
- Pair mathematical notation with spoken/plain-language reading. For example,
  say “for every element `x` there exists…” and label quantifier scope in the
  DOM.
- Use progressive disclosure: definition → one example → counterexample →
  proof obligation → full proof, instead of placing a full dense proof beside a
  new diagram.
- Use color as a redundant cue only; links/edges/cases need labels, shapes,
  text, and keyboard-readable state.
- Make every interactive choice reversible and explain why plausible wrong
  answers fail. Avoid time pressure or gamification that rewards guessing.
- A source's own accessibility claim or HTML output is not proof that Atlas's
  adapted portal is accessible. Test Atlas's rendered artifact separately.

---

## Source audit and update checklist

Before publishing an M27 lesson, studio, notebook, or download:

1. **Coverage:** confirm each row in the coverage ledger has a formal
   definition, plain-language model, counterexample, proof/derivation or proof
   idea, code/model reading where appropriate, misconception check, and
   transfer task.
2. **Attribution:** retain a source link beside every nontrivial externally
   grounded claim. Record exact edition/version/access date where a source can
   change.
3. **License:** identify the exact asset, not just the hosting site. If there
   is doubt, use an original diagram/example and link the source.
4. **Mathematical honesty:** name assumptions, quantify the claim, distinguish
   theorem/proof from implementation and observation, and include a nearby
   counterexample.
5. **AI boundary:** no generated proof, citation, theorem statement, or code
   is accepted until a human can explain and independently verify it. Tool
   output stays an `AI PROPOSAL` or `FINITE TRACE` unless stronger evidence is
   supplied.
6. **Visual/accessibility:** all graph/Hasse/relation/trace visuals get text
   equivalents; equations get a meaningful prose reading; interactions work
   without color, pointer precision, or motion.
7. **Forward connection:** state the next named module/use—M28 linear
   structure, M30 probability, M31 optimization, M33 theory, M34 search, M35
   ML, M36 learning theory, or final evidence/capstone synthesis—rather than
   leaving a topic as a standalone puzzle.

### Recommended bibliography record for learner-facing pages

Use a compact source footer, for example:

> Source route: MIT OCW 6.042J (course structure), Open Logic Project
> (logic/relations), Levin (open discrete-math reading), and Python 3.14 docs
> (code contract). Atlas definitions, examples, diagrams, questions, and
> explanations are original. See the M27 source map for licenses and claim
> boundaries.

This footer is a navigation aid, not a claim that a source endorsed Atlas or
that all source material has been copied into the course.
