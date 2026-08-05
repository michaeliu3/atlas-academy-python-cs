# Module 11 — Algorithm Design Paradigms — Source-Audit Addendum

**Audit date:** 2026-08-02  
**Scope:** source roles, claim linkage, access/reuse boundaries, and
candidate-only structural evidence for the existing M11 workbook. This is an
instructor-facing audit record, not a teaching-quality approval, release
decision, credential, or permission to reuse external assets.

## Candidate boundary

M11 remains `legacy-open` for learner access, `legacy-baseline` for its
contract state, and `unrecorded` for release. This addendum can support a
non-promoting structural candidate only. It does not establish university
equivalence, learner understanding, human review, CI, deployment, publication,
oral-defense, GPT Live, Notion, or mastery evidence.

Atlas owns its strategy contracts, diagrams, traces, code-reading tasks,
diagnostics, numerical comparisons, dossiers, and prompts. External material
is linked and paraphrased only. Do not copy lectures, slides, figures,
assignments, solutions, assessments, prose, or source code into Atlas merely
because it is publicly available.

## Source and reuse ledger

| ID | Owner and stable learner-facing link | Intended claim scope | Access / reuse status |
| --- | --- | --- | --- |
| **U01** | MIT OpenCourseWare: [6.046J Lecture 2 — Divide & Conquer](https://www.ocw.mit.edu/courses/6-046j-design-and-analysis-of-algorithms-spring-2015/7463c413c944ed72b46a3c3d02b49448_MIT6_046JS15_lec02.pdf) | Decomposition, complete-combine obligations, recurrences, and induction-style reasoning. It does not prove an Atlas split is independent or preserves its shared constraints. | Accessed 2026-08-02. Link and paraphrase only; no OCW asset is imported. Recheck terms and attribution before proposed reuse. |
| **U02** | MIT OpenCourseWare: [6.006 Lecture 15 — Recursive Algorithms](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/9eb3e9a51a7b5b60b0f67c2277f8b0ee_MIT6_006S20_lec15.pdf) | Call trees, overlapping subproblem DAGs, state/recurrence/base/order, memoization, and bottom-up reuse. It does not validate an Atlas state key or value policy. | Accessed 2026-08-02. Link and paraphrase only; no note, exercise, figure, or solution is reproduced. |
| **U03** | MIT OpenCourseWare: [6.046J Lecture 12 — Greedy Algorithms & MST](https://ocw.mit.edu/courses/6-046j-design-and-analysis-of-algorithms-spring-2015/4a7fdddff3bc419c70bb470106a1663a_MIT6_046JS15_lec12.pdf) | Cut/exchange proof patterns for safe local commitment. It does not justify a value/ratio priority for Atlas. | Accessed 2026-08-02. Link and paraphrase only; no lecture asset is imported. |
| **U04** | MIT OpenCourseWare: [6.046J Lecture 6 — Randomized Algorithms](https://www.ocw.mit.edu/courses/6-046j-design-and-analysis-of-algorithms-spring-2015/cb55cb123a557eed0738a1187a452c24_MIT6_046JS15_lec06.pdf) | Expected-time/error contracts and Las Vegas/Monte Carlo distinctions. It does not establish Python-randomness security or an Atlas randomized guarantee. | Accessed 2026-08-02. Link and paraphrase only; recheck terms before exact reuse. |
| **U05** | MIT OpenCourseWare: [6.046J Lecture 17 — Approximation Algorithms](https://www.ocw.mit.edu/courses/6-046j-design-and-analysis-of-algorithms-spring-2015/a4a7f356ba3e65a00ad2bdcfed6e0f35_MIT6_046JS15_lec17.pdf) | Approximation-ratio proof vocabulary and lower/upper-bound reasoning. It does not give an Atlas heuristic a quality guarantee. | Accessed 2026-08-02. Link and paraphrase only; no notes, diagrams, or assessments are copied. |
| **U07** | Carnegie Mellon University: [15-451/651 Lecture 20 — Streaming Algorithms](https://www.cs.cmu.edu/~15451-s24/lectures/lecture20-streaming.pdf) | Arrivals-only streaming model, bounded summaries, and heavy-hitter candidate/error reasoning. It does not make an Atlas first-pass counter exact or establish a deployment guarantee. | Accessed 2026-08-04. Link and original paraphrase only; no lecture asset, figure, exercise, solution, or code is imported. |
| **U08** | Stanford University: [CS 368 — Algorithmic Techniques for Big Data](https://web.stanford.edu/class/cs368/) | Scope calibration for streaming, sketching, and compact data summaries; it signals optional advanced depth rather than the full M11 requirement. | Accessed 2026-08-04. Link and paraphrase only; no course asset is imported. |
| **P01** | Python Software Foundation: [`functools.cache`](https://docs.python.org/3.14/library/functools.html#functools.cache), [`random`](https://docs.python.org/3.14/library/random.html), and [`itertools`](https://docs.python.org/3.14/library/itertools.html) | Public Python mechanisms for memoization, pseudorandom experiments, and bounded combinatorial oracles. They do not prove algorithmic correctness, a distribution guarantee, or security suitability. | Accessed 2026-08-02. Link and paraphrase only; recheck the [Python license](https://docs.python.org/3/license.html) before exact reuse. |
| **U06** | MIT OpenCourseWare: [6.006 resource index](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/pages/resource-index/) and Carnegie Mellon University: [15-122 course information](https://www.cs.cmu.edu/~15122/syllabus.shtml) | A connected data-structures-and-algorithms sequence and correct-by-design cross-component reasoning. Neither source mandates the Atlas M6→M10 dossier or validates an Atlas architecture. | Accessed 2026-08-03. Link and paraphrase only; no lecture, assignment, figure, assessment, or solution is imported. |

## Claim linkage and stopping lines

| Workbook location | Claim or learner artifact | Source route | Required stopping line |
| --- | --- | --- | --- |
| Sessions 1–2: formulation, exhaustive oracle, divide/combine, greedy choice | Candidate/feasibility/objective contract, tiny oracle, combine obligation, exchange proof, and minimal counterexample | `U01`, `U03` | A successful enumeration or benchmark does not prove a greedy rule, and a proof pattern does not validate a different Atlas model. |
| Session 3: DP state DAG | State sentence, recurrence, base cases, evaluation order, reconstruction, and pseudopolynomial cost boundary | `U02`, `P01` | Repeated calls alone do not license caching; the state must preserve every future-relevant distinction. |
| Session 4: search/pruning | Safe feasibility prune, optimistic bound, and state-sufficiency argument | Atlas-original traces; `U01`–`U03` for proof calibration | A prune removes descendants and needs its own invariant; a local reference run cannot establish it universally. |
| Session 5: streaming, randomness/approximation | One-pass state and heavy-hitter candidate guarantee, probability contract, reproducibility boundary, lower/upper certificate, and 1/2 proof boundary | `U04`, `U05`, `U07`, `U08`, `P01` | A first-pass counter is not an exact frequency, a seed is not a distribution proof, and an example/benchmark grants no approximation ratio. |
| Session 6: agent-directed review | Strategy dossier, independent verifier, model-limit ledger, and changed-premise defense | Atlas-original review prompts; `U01`–`U05` for calibration | An agent explanation, green tests, or a source link is not independent proof, review, or a human policy decision. |
| §16.6: Arc II architecture-reading dossier | One M6→M10 handoff table and evidence-boundary conclusion | Atlas-original scaffold; `U06` calibrates connected-sequence and cross-component reasoning | A completed table does not prove an implementation, full-route completion, reviewer approval, or a valid later planner model. |

## License and reuse boundary

MIT material calibrates rigorous undergraduate algorithm models and proof
traditions; Python documentation bounds public API claims. Neither grants a
credential, makes Atlas equivalent to an institutional course, or turns
external assets into Atlas content.

If anyone proposes exact wording, a figure, an exercise, a solution, a video,
or source code for reuse, pause this workflow and separately verify current
license, attribution, academic-integrity, and distribution terms. Public
availability is not reuse approval.

## Stable learner links

Open one ledger link only after an Atlas attempt and with one question:
divide/combine obligation (`U01`); state/DAG/reconstruction (`U02`); safe local
choice (`U03`); probability contract (`U04`); approximation-bound argument
(`U05`); streaming state/error boundary (`U07`, `U08`); or documented Python
mechanism (`P01`). These links are not an answer key, a reading pile, or
authority to bypass M10 or M12.

## Visual and text-alternative review boundary

M11's ten Mermaid blocks carry local ID, title, and concise text-alternative
metadata for the shared reader. The workbook now also provides a visible
`Text equivalent — strategy selection from contract to evidence` route for its
two overview diagrams. This resolves a current structural reader pointer only;
it does not establish semantic rendering, keyboard behavior, screen-reader
experience, cognitive load, or learner comprehension.

## Release and review questions still open

- Recheck living URLs, documentation versions, access dates, and reuse terms
  before later human review or a release claim.
- Inspect every learner-facing theorem, Python behavior, complexity,
  probability, measurement, visual, diagnostic, and source statement;
  resolving a link is not validation of its correctness or teaching quality.
- Test real keyboard, screen-reader, browser, and whiteboard experience; a
  text alternative and local structural check are not a completed
  accessibility review.
- Treat every TA, Study Partner, GPT Live, or Notion interaction as separate
  learner-controlled evidence. This addendum neither causes nor proves one.
- Keep any M11 candidate non-promoting until qualified review, a reviewed
  source commit, source-commit CI, deployment evidence, and release records
  exist.
