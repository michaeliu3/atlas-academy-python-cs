# Module 4 — Logic, Sets, Relations, Graphs, and Proof — Source-Audit Addendum

**Audit date:** 2026-08-02
**Scope:** source roles, claim linkage, access/reuse boundaries, and the
candidate-only structural evidence for the existing M4 workbook. This is an
instructor-facing audit record, not a learner textbook, quality approval,
release decision, or authorization to reuse external assets.

## Candidate boundary

M4 remains `legacy-open` for learner access, `legacy-baseline` for its
contract state, and `unrecorded` for release. This addendum may be referenced
by a non-promoting structural candidate, but it proves only that declared
local source pointers can resolve together. It does not approve the workbook,
establish university equivalence, verify learner understanding, or create CI,
deployment, publication, oral-defense, GPT Live, Notion, or mastery evidence.

Atlas owns the prerequisite-planner narrative, examples, diagrams, code,
diagnostics, studios, and prompts. External material is linked and
paraphrased only. Do not copy lectures, slides, figures, assignments,
solutions, assessments, or source code into Atlas merely because they are
publicly available.

## Source and reuse ledger

| ID | Owner and stable learner-facing link | Intended claim scope | Access / reuse status |
| --- | --- | --- | --- |
| **P01** | Python Software Foundation: [Data Structures](https://docs.python.org/3.14/tutorial/datastructures.html) | Language-level list, set, and dictionary behavior used as possible representations of mathematical collections or route positions. It is not authority for the mathematical definitions of sets, relations, graphs, probability, or proof. | Accessed 2026-08-02. Link and paraphrase. See the [Python license page](https://docs.python.org/3.14/license.html) before any exact reuse; Atlas ships original examples. |
| **U01** | MIT OpenCourseWare: [6.042J Mathematics for Computer Science](https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/) | Undergraduate calibration for definitions, proofs, sets, functions, relations, graphs, counting, and discrete probability as connected computer-science foundations. | Accessed 2026-08-02. Link-only calibration; do not copy course prose, exercises, figures, lecture notes, solutions, or assessment material. Recheck terms before future asset reuse. |
| **U02** | MIT OpenCourseWare: [6.042J readings](https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-fall-2010/pages/readings/) | Direct reading route for propositions, proof patterns, induction, graph theory, directed graphs, relations, counting, and probability. It calibrates scope; it does not validate every Atlas explanation or learner response. | Accessed 2026-08-02. Link-only; course notes and PDFs remain their owners' material and are not imported into Atlas. |
| **U03** | MIT OpenCourseWare: [6.006 Introduction to Algorithms](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/) | Calibration for carrying a graph model and explicit size assumptions into later algorithmic correctness and cost analysis. It is a later continuation, not a substitute for M5 or M10. | Accessed 2026-08-02. Link-only; no reuse permission is inferred from public access. |
| **C01** | Composing Programs: [course text](https://www.composingprograms.com/) | Optional connected-programming perspective after the Atlas model attempt. It is not a normative Python or discrete-mathematics specification. | Accessed 2026-08-02. Link-only until licensing and exact asset scope are separately reviewed; no prose, diagrams, exercises, or code are imported. |

## Claim-to-source and session map

| Workbook location | Claim or learner artifact | Source route | Required stopping line |
| --- | --- | --- | --- |
| First-principles derivation and Sessions 1–2 | Bounded domain, proposition/predicate, implication, quantifier order, negation witness, set/relation map | `U01`/`U02` for discrete-mathematics calibration | A formula or a true example establishes only its stated claim under its stated interpretation; it does not choose a product policy or prove an implementation refines the model. |
| Session 3 | Directed prerequisite graph, immediate edge versus transitive closure, cycle/topological-order witness | `U02`; `U03` for later algorithmic continuation | A graph theorem applies to the represented graph and edge convention. Missing edges, mutable source data, or an unstated cycle policy require separate evidence. |
| Session 4 | Proof method, branch-count condition, probability-model boundary, finite experiment | `U01`/`U02` | Counting, probability, and simulation require named sample-space or branching assumptions. A finite run does not prove a universal theorem or validate an unstated probability model. |
| Sessions 5–6 | Python representation trace, route-validator contract, minimal mismatch, independent cycle witness, review request | Atlas original code plus `P01` for representation vocabulary | A test, a convincing patch, or a class name does not establish complete graph data, mathematical correctness, complexity, or a learner's understanding. |
| M5 handoff | Vertex/edge/input-size model and cost question | `U03` as calibration only | M4 does not claim an algorithmic complexity result, implementation of graph traversal, or readiness to bypass M5. |

## License and reuse boundary

Source roles remain deliberately separate. Python documentation owns
language-level representation vocabulary. MIT material calibrates discrete
mathematics and algorithm breadth. The optional text offers a second
perspective, not a replacement authority. None of these sources grants a
credential, converts course assets into Atlas content, or establishes that a
compressed route equals a degree program.

If an external asset, exact wording, exercise, figure, solution, or code is
ever proposed for reuse, pause this workflow and separately verify the current
license, attribution, academic-integrity, and distribution terms.

## Stable learner links

Use the ledger links only after an Atlas attempt and with a concrete question:
proof/quantifier/relation/graph foundations (`U01`/`U02`); later graph and
algorithm framing (`U03`); Python collection behavior (`P01`); or an optional
connected-programming explanation (`C01`). They are not an undirected reading
pile and do not supply an answer key for the Atlas portfolio.

## Source-selection rationale

The source spine supports first-principles learning without disguising
calibration as equivalence. The official Python reference handles language
facts; MIT sources set a rigorous undergraduate benchmark for mathematical
reasoning; Atlas owns the readable prerequisite-planner problem, visual
models, code-reading tasks, and evidence prompts. The learner can therefore
ask: *what kind of claim is this, and what evidence could support it?*

## Release and review questions still open

- Recheck living documentation versions, URLs, and reuse terms before a later
  human review or release claim.
- Inspect every M4 learner-facing mathematical claim, visual, diagnostic, and
  numerical example against its source role; resolving links alone do not
  validate the statement.
- Test the actual learner experience with keyboard and screen-reader users;
  metadata and a local renderer test are not a complete accessibility review.
- Treat any TA, Study Partner, GPT Live, or Notion interaction as separate
  learner-controlled evidence. This addendum neither causes nor proves one.
- Keep an eventual M4 packet non-promoting until qualified review,
  source-commit CI, deployment evidence, and release records exist.
