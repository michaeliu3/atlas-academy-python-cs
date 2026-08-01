# Module 27 — Official-Course Calibration (2026-08-01)

## Scope and truth boundary

This is a **research-only calibration note**. It records a bounded comparison
between the existing M27 materials and official university course pages or
institution-hosted course material. It changes no learner material, source map,
graph, route, contract, release status, or assessment. It is not evidence of
learner competence, university enrollment, credit, grading, certification, or
equivalence to any course.

The reviewed local artifacts are the current [M27 workbook](../modules/27_discrete_mathematics_proof_counting_structures.md),
[source map](module27_discrete_mathematics_proof_counting_structures_source_map.md),
and [source-audit addendum](module27_source_audit_addendum.md). Atlas should
link/cite the sources below and continue to use original prose, examples,
diagrams, code, and exercises unless a later asset-level reuse review says
otherwise.

## What the current M27 actually teaches

| Workbook session | Current topic bundle | Calibration result |
| --- | --- | --- |
| S1 | Definitions, logic, quantifiers, sets/functions/relations, countermodels | Aligned with the proof-and-structure core in MIT, CMU, Stanford CS103, Georgia Tech CS2050, and Berkeley Math 55 ([O27-01](#o27-01--mit-61200j-mathematics-for-computer-science), [O27-02](#o27-02--cmu-15-151-mathematical-foundations-for-computer-science), [O27-03](#o27-03--stanford-cs103-mathematical-foundations-of-computing), [O27-05](#o27-05--georgia-tech-cs2050-discrete-mathematics), [O27-06](#o27-06--berkeley-math-55-discrete-mathematics)). |
| S2 | Direct/contrapositive/contradiction proofs, induction, structural induction, loop invariants, extremal choice | Aligned in proof and induction scope; loop-invariant/code-reading and AI-proof-review work are intentional Atlas adaptations ([O27-01](#o27-01--mit-61200j-mathematics-for-computer-science), [O27-05](#o27-05--georgia-tech-cs2050-discrete-mathematics), [O27-06](#o27-06--berkeley-math-55-discrete-mathematics)). |
| S3 | Counting, recurrences, **generating functions**, asymptotics | Counting/recurrences/asymptotics are aligned; generating functions are a bounded extension corroborated by Stanford MATH 108 and listed as optional in Berkeley Math 55 ([O27-01](#o27-01--mit-61200j-mathematics-for-computer-science), [O27-04](#o27-04--stanford-math-108-introduction-to-combinatorics), [O27-06](#o27-06--berkeley-math-55-discrete-mathematics)). |
| S4 | Graphs, trees, connectivity, bipartite matchings | Aligned with MIT's explicit graph/matching/connectivity sequence and Stanford MATH 108's graph/matching scope ([O27-01](#o27-01--mit-61200j-mathematics-for-computer-science), [O27-04](#o27-04--stanford-math-108-introduction-to-combinatorics)). |
| S5 | Partial orders, lattices, elementary number theory | Posets and number theory are aligned; the finite meet/join lattice treatment is intentionally narrow and needs an explicit reviewed authoring source before any expansion ([O27-01](#o27-01--mit-61200j-mathematics-for-computer-science), [O27-04](#o27-04--stanford-math-108-introduction-to-combinatorics), [O27-05](#o27-05--georgia-tech-cs2050-discrete-mathematics), [O27-06](#o27-06--berkeley-math-55-discrete-mathematics), [O27-07](#o27-07--berkeley-hosted-partial-order-and-lattice-reference)). |
| S6 | Proof/counterexample dossier, AI-proposal review, constructive oral defense | Intentional Atlas adaptation: it preserves the proof-writing emphasis visible in the calibration courses, but is not represented as a university assessment or a substitute for their assignments and feedback ([O27-02](#o27-02--cmu-15-151-mathematical-foundations-for-computer-science), [O27-03](#o27-03--stanford-cs103-mathematical-foundations-of-computing), [O27-04](#o27-04--stanford-math-108-introduction-to-combinatorics)). |

## Routing correction to carry into the next M27 revision

The current workbook's session order and the existing source-map/addendum
session table disagree. The workbook puts generating functions in **S3**,
graphs/matchings in **S4**, partial orders/lattices plus number theory in
**S5**, and the dossier in **S6**. The source map instead assigns generating
functions plus number theory to S4, graphs/matching to S5, and posets/lattices
to S6. This note does **not** edit either artifact; it records the corrected
route below so a later focused M27 content batch can make them agree.

| Keep this workbook session | Corrected official-course route | Why |
| --- | --- | --- |
| S1 | MIT 6.1200 proofs; CMU 15-151; Stanford CS103; Georgia Tech CS2050; Berkeley Math 55 ([O27-01](#o27-01--mit-61200j-mathematics-for-computer-science), [O27-02](#o27-02--cmu-15-151-mathematical-foundations-for-computer-science), [O27-03](#o27-03--stanford-cs103-mathematical-foundations-of-computing), [O27-05](#o27-05--georgia-tech-cs2050-discrete-mathematics), [O27-06](#o27-06--berkeley-math-55-discrete-mathematics)). | These sources explicitly name logic, proof, sets, functions, relations, or discrete structures. |
| S2 | MIT 6.1200 proof/strong-induction/state-machine sequence; Georgia Tech CS2050 proof/induction sequence; Berkeley Math 55 proof/induction outline ([O27-01](#o27-01--mit-61200j-mathematics-for-computer-science), [O27-05](#o27-05--georgia-tech-cs2050-discrete-mathematics), [O27-06](#o27-06--berkeley-math-55-discrete-mathematics)). | Atlas should retain its code-reading invariant work as an original bridge, while keeping theorem and implementation claims separate. |
| S3 | MIT 6.1200 sums/asymptotics/recurrences; Stanford MATH 108 recurrences/generating functions; Berkeley Math 55 recurrence relations and optional generating functions ([O27-01](#o27-01--mit-61200j-mathematics-for-computer-science), [O27-04](#o27-04--stanford-math-108-introduction-to-combinatorics), [O27-06](#o27-06--berkeley-math-55-discrete-mathematics)). | This matches the workbook's count → recurrence → coefficient → eventual-bound progression. |
| S4 | MIT 6.1200 graphs, matching, connectivity, trees, DAGs; Stanford MATH 108 graphs and matchings ([O27-01](#o27-01--mit-61200j-mathematics-for-computer-science), [O27-04](#o27-04--stanford-math-108-introduction-to-combinatorics)). | This matches the workbook's graph-model → tree/connectivity → matching sequence. |
| S5 | MIT 6.1200 divisibility/modular arithmetic; Georgia Tech CS2050 modular arithmetic/GCD/Bézout; Berkeley Math 55 partial orders and number theory; Stanford MATH 108 posets; Berkeley-hosted lattice reference ([O27-01](#o27-01--mit-61200j-mathematics-for-computer-science), [O27-04](#o27-04--stanford-math-108-introduction-to-combinatorics), [O27-05](#o27-05--georgia-tech-cs2050-discrete-mathematics), [O27-06](#o27-06--berkeley-math-55-discrete-mathematics), [O27-07](#o27-07--berkeley-hosted-partial-order-and-lattice-reference)). | The module deliberately joins order structure and modular reasoning through the compatibility-planner story; it must not imply that the two topics are one theorem. |
| S6 | Original Atlas synthesis using the preceding scoped sources. | Keep the oral defense constructive, evidence-centered, and non-grading; no calibration source authorizes calling it a university exam. |

## Official-source ledger

All sources were accessed **2026-08-01**. Each is used for scope calibration
and stable learner-facing links, not permission to copy protected lecture
notes, assignments, figures, solutions, or assessments.

### O27-01 — MIT 6.1200J, *Mathematics for Computer Science*

- Official source: [MIT OpenCourseWare readings, Spring 2024](https://ocw.mit.edu/courses/6-1200j-mathematics-for-computer-science-spring-2024/pages/readings/).
- Claim linkage: the official reading sequence explicitly includes predicates,
  sets, proofs, contradiction, induction, strong induction, state machines,
  asymptotics, recurrences, divisibility, modular arithmetic, graphs,
  matching, connectivity, trees, DAGs, relations, and counting. It is the
  strongest single calibration spine for M27's foundational scope.
- Boundary: it does not, from this page alone, establish M27's exact
  generating-function, lattice, code-reading, AI-review, or oral-defense
  design. Link/cite only pending asset-level reuse review.

### O27-02 — CMU 15-151, *Mathematical Foundations for Computer Science*

- Official source: [CMU School of Computer Science course page](https://csd.cs.cmu.edu/course/15151/s25).
- Claim linkage: the page identifies logic, sets, induction, functions,
  combinatorics, proof formalization, experimentation, and collaboration as
  the freshman-course foundation. This supports M27's definitions-before-code,
  proof-repair, and active-explanation orientation.
- Boundary: its public description does not enumerate generating functions,
  matchings, lattices, or asymptotic analysis; this note does not infer them.

### O27-03 — Stanford CS103, *Mathematical Foundations of Computing*

- Official source: [Stanford CS103, Spring 2026](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/).
- Claim linkage: the course describes an introduction to discrete mathematics
  through logic, proofs, and structures including sets, functions, and graphs,
  and explicitly emphasizes well-structured proofs. It corroborates the
  proof-and-discrete-structure standard for M27 S1–S2.
- Boundary: this is a broader foundations course that proceeds to
  computability/complexity; M27 must retain its own narrower forward handoff
  to M33 rather than importing that later syllabus.

### O27-04 — Stanford MATH 108, *Introduction to Combinatorics and its Applications*

- Official source: [Stanford MATH 108 course page, Winter 2017](https://theory.stanford.edu/~jvondrak/MATH108-2017/MATH108.html).
- Claim linkage: the official topic list includes graphs, matchings, posets,
  recurrences, generating functions, counting, and trees. It corroborates the
  extension material that is not explicit in MIT 6.1200's public reading list.
- Boundary: its stated linear-algebra and calculus prerequisites make it a
  depth comparator, not a demand that M27 teach a full upper-division
  combinatorics course.

### O27-05 — Georgia Tech CS2050, *Discrete Mathematics*

- Official source: [Georgia Tech CS2050 course page, Spring 2025](https://faculty.cc.gatech.edu/~ladha/S25/2050/).
- Claim linkage: the published sequence names logic, quantification, proof,
  induction, strong induction, sets, functions, Big O, equivalence relations,
  modular arithmetic, GCD, Bézout, permutations/combinations, binomial
  theorem, and pigeonhole principle. It corroborates M27's proof, asymptotic,
  number-theory, and counting coverage.
- Boundary: this page's schedule does not list graphs, matchings, recurrences,
  generating functions, or lattices; the note does not infer them.

### O27-06 — Berkeley Math 55, *Discrete Mathematics*

- Official source: [UC Berkeley Mathematics Department course outline](https://math.berkeley.edu/courses/overview/lowerdivcourses/math55).
- Claim linkage: the official outline names logic, induction, sets, relations,
  functions, number theory, combinatorics, recurrences, partial orders,
  graphs, connectivity, and optional generating functions/trees. It provides
  a second full undergraduate comparator for M27's sequence.
- Boundary: the outline labels generating functions as optional and does not
  list matchings or lattices; Atlas should keep those claims scoped to their
  separately named sources and examples.

### O27-07 — Berkeley-hosted partial-order and lattice reference

- Official source: Edward A. Lee, [*Concurrent Models of Computation*, Chapter 1: Partially Ordered Sets](https://ptolemy.berkeley.edu/books/MoCs/ConcurrentMoC_Digital_0_02.pdf).
- Claim linkage: the institution-hosted chapter's contents explicitly include
  partial orders, upper/lower bounds, and lattices, and frames those structures
  as mathematical preliminaries for later systems models. It is a depth check
  for M27's deliberately small meet/join vocabulary.
- Boundary: it is not an M27-equivalent course or a reason to import fixed
  point, domain-theory, or concurrency material. Keep S5 at finite-poset,
  pairwise meet/join, and counterexample level unless a later course revision
  creates the prerequisites and source map for more.

## Alignment, adaptation, and open gaps

| Area | Record | Required preservation or next action |
| --- | --- | --- |
| Proof literacy, definitions, counterexamples | **Aligned.** The core appears across MIT, CMU, Stanford CS103, Georgia Tech, and Berkeley ([O27-01](#o27-01--mit-61200j-mathematics-for-computer-science), [O27-02](#o27-02--cmu-15-151-mathematical-foundations-for-computer-science), [O27-03](#o27-03--stanford-cs103-mathematical-foundations-of-computing), [O27-05](#o27-05--georgia-tech-cs2050-discrete-mathematics), [O27-06](#o27-06--berkeley-math-55-discrete-mathematics)). | Keep domain/assumption/proof/counterexample distinctions visible; do not replace proof with a trace or AI answer. |
| Counting, recurrences, asymptotics | **Aligned.** MIT explicitly sequences asymptotics and recurrences; Georgia Tech and Berkeley list the related material ([O27-01](#o27-01--mit-61200j-mathematics-for-computer-science), [O27-05](#o27-05--georgia-tech-cs2050-discrete-mathematics), [O27-06](#o27-06--berkeley-math-55-discrete-mathematics)). | Preserve base conditions, quantified bounds, and finite-experiment limits. |
| Generating functions | **Adapted, defensible depth.** Stanford MATH 108 includes them and Berkeley Math 55 lists them as optional ([O27-04](#o27-04--stanford-math-108-introduction-to-combinatorics), [O27-06](#o27-06--berkeley-math-55-discrete-mathematics)). | Retain the formal-series-versus-analytic boundary; do not use this as a reason to compress a full combinatorics treatment into M27. |
| Graphs, trees, connectivity, matchings | **Aligned.** MIT explicitly names all four; Stanford MATH 108 includes graphs/matchings ([O27-01](#o27-01--mit-61200j-mathematics-for-computer-science), [O27-04](#o27-04--stanford-math-108-introduction-to-combinatorics)). | State the graph/matching variant and Hall-theorem hypotheses before any conclusion. |
| Posets, lattices, elementary number theory | **Mixed.** Posets and number theory are covered by the course corpus; lattices have only a deliberately narrow Berkeley-hosted depth reference in this calibration pass ([O27-01](#o27-01--mit-61200j-mathematics-for-computer-science), [O27-04](#o27-04--stanford-math-108-introduction-to-combinatorics), [O27-05](#o27-05--georgia-tech-cs2050-discrete-mathematics), [O27-06](#o27-06--berkeley-math-55-discrete-mathematics), [O27-07](#o27-07--berkeley-hosted-partial-order-and-lattice-reference)). | Keep lattice material finite and pairwise. Before any expansion, add an exact claim-linked official teaching source and a revised source card. |
| AI-proof review, code-reading, oral dossier | **Intentional Atlas adaptation.** The university pages support proof-centered learning, not Atlas's exact live-chat workflow ([O27-02](#o27-02--cmu-15-151-mathematical-foundations-for-computer-science), [O27-03](#o27-03--stanford-cs103-mathematical-foundations-of-computing), [O27-04](#o27-04--stanford-math-108-introduction-to-combinatorics)). | Keep it supportive and evidence-focused; do not call a chat outcome a formal exam, grade, or proof of mastery. |
| Source-map session mismatch | **Open implementation gap.** Existing local documentation routes S3–S6 differently from the workbook. | In the next focused M27 revision, update the source-map/addendum routing to the table above, then run only the directly relevant content/link/contract checks. |
| Compressed-course limitation | **Open learning-evidence gap.** The reference courses run over a term with lectures, assignments, feedback, and/or discussion; this one six-session module cannot establish comparable participation or outcomes. | Use the linked materials for optional depth and require learner-produced proof, counterexample, trace, transfer, and reflection artifacts before claiming personal progress. |

## Safe authoring conclusion

M27's conceptual spine is well-calibrated against official undergraduate
material. Its strongest improvements should be **routing accuracy and retained
boundaries**, not more topic accumulation: reconcile S3–S6 with the source map,
keep generating functions and lattices explicitly bounded, and preserve the
distinction between a theorem, a program run, an AI proposal, and a learner's
own explanation. This research note supplies neither a release decision nor a
claim that Atlas reproduces the teaching, assessment, or credential of any
institution.
