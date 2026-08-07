# Module 10 — Graph Algorithms and Network Models — Source-Audit Addendum

**Audit date:** 2026-08-04  
**Scope:** source roles, claim linkage, access/reuse boundaries, and
candidate-only structural evidence for the existing M10 workbook. This is an
instructor-facing audit record, not a teaching-quality approval, release
decision, credential, or permission to reuse external assets.

## Candidate boundary

M10 remains `legacy-open` for learner access, `legacy-baseline` for its
contract state, and `unrecorded` for release. This addendum can support a
non-promoting structural candidate only. It does not establish university
equivalence, learner understanding, human review, CI, deployment, publication,
oral-defense, GPT Live, Notion, or mastery evidence.

Atlas owns its graph snapshots, diagrams, traces, code-reading tasks,
diagnostics, experiments, dossiers, and prompts. External material is linked
and paraphrased only. Do not copy lectures, slides, figures, assignments,
solutions, assessments, prose, or source code into Atlas merely because it is
publicly available.

## Source and reuse ledger

| ID | Owner and stable learner-facing link | Intended claim scope | Access / reuse status |
| --- | --- | --- | --- |
| **U01** | MIT OpenCourseWare: [6.006 resource index](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/pages/resource-index/) and [Lecture 9, BFS](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/resources/mit6_006s20_lec9/) | Undergraduate calibration for adjacency representation, BFS layers, unweighted shortest paths, and `V/E` analysis. It does not certify Atlas as an MIT course. | Accessed 2026-08-02. Link and paraphrase only; no OCW asset is imported. Recheck current terms, attribution, and academic-integrity boundaries before proposed reuse. |
| **U02** | MIT OpenCourseWare: [Lecture 10, DFS](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/resources/lecture-10-depth-first-search/) | DFS traversal, finishing order, directed-cycle reasoning, and topological-order context. It does not validate a particular Atlas cycle witness or implementation. | Accessed 2026-08-02. Link and paraphrase only; no lecture note, figure, exercise, or solution is reproduced. |
| **U03** | MIT OpenCourseWare: [Lectures 11–13 in the 6.006 resource index](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/pages/resource-index/) | Weighted paths, relaxation, Bellman–Ford, Dijkstra, and the restriction-based choice among them. | Accessed 2026-08-02. Link-only calibration; no source code or instructional asset is imported. A theorem still needs its stated graph and data-contract assumptions. |
| **U06** | MIT OpenCourseWare: [Lecture 14, Johnson's Algorithm](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/7d7d5c35490f41b7b037cafbda7019ad_MIT6_006S20_lec14.pdf) | Transfer-level calibration for all-pairs shortest paths by reweighting with Bellman–Ford-derived potentials before repeated Dijkstra runs. It does not add an Atlas implementation or relax the stated finite-graph and proof assumptions. | Accessed 2026-08-02. Link and paraphrase only; no note, figure, exercise, proof, or code is imported. Recheck current OCW terms and attribution before any proposed reuse. |
| **U04** | MIT OpenCourseWare: [6.042J readings](https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/pages/readings/) | Graph, path, connectivity, partial-order, invariant, and proof vocabulary. It does not supply all implementation or storage semantics. | Accessed 2026-08-02. Link and paraphrase only; recheck terms before any exact reuse. |
| **U05** | MIT OpenCourseWare: [6.046J Lecture 12, Minimum Spanning Trees](https://ocw.mit.edu/courses/6-046j-design-and-analysis-of-algorithms-spring-2015/4a7fdddff3bc419c70bb470106a1663a_MIT6_046JS15_lec12.pdf) | Cut/exchange reasoning, Kruskal, Prim, disjoint sets, and spanning-tree versus path-tree distinction. It is not authority for an Atlas graph-policy choice. | Accessed 2026-08-02. Link and paraphrase only; no notes, diagrams, or problem materials are copied. |
| **U07** | MIT OpenCourseWare: [6.046J Lecture 13, Incremental Improvement: Max Flow, Min Cut](https://ocw.mit.edu/courses/6-046j-design-and-analysis-of-algorithms-spring-2015/resources/lecture-13-incremental-improvement-max-flow-min-cut/) and [recitation-notes route](https://ocw.mit.edu/courses/6-046j-design-and-analysis-of-algorithms-spring-2015/pages/recitation-notes/) | Undergraduate calibration for capacity/conservation definitions, residual augmenting paths, the max-flow/min-cut proof idea, and matching transfer. It does not validate an Atlas flow implementation or production throughput claim. | Accessed 2026-08-04. Link and paraphrase only; no lecture, figure, exercise, solution, or source code is copied. |
| **P01** | Python Software Foundation: [`collections.deque`](https://docs.python.org/3.14/library/collections.html#collections.deque) | Documented endpoint operations used by the BFS frontier mechanism. It does not prove BFS correctness or a full application performance claim. | Accessed 2026-08-02. Link and paraphrase only; no documentation prose or examples are imported. Recheck the [Python license](https://docs.python.org/3/license.html) before any exact reuse. |
| **P02** | Python Software Foundation: [`heapq`](https://docs.python.org/3.14/library/heapq.html) | Heap invariant, min-heap operations, tie-ordering concern, and the documented stale-entry update pattern. It does not make Dijkstra safe for negative edges. | Accessed 2026-08-02. Link and paraphrase only; no documentation code or text is copied. |
| **P03** | Python Software Foundation: [mapping types — `dict`](https://docs.python.org/3.14/library/stdtypes.html#mapping-types-dict) and [set types](https://docs.python.org/3.14/library/stdtypes.html#set-types-set-frozenset) | Portable container semantics for the learner-facing graph/evidence state model. It does not promise a specific runtime layout or universal operation cost. | Accessed 2026-08-02. Link and paraphrase only; distinct algorithmic and performance claims remain model-qualified. |

## Claim linkage and stopping lines

| Workbook location | Claim or learner artifact | Source route | Required stopping line |
| --- | --- | --- | --- |
| Graph question, representation, Session 1 | vertices, edge direction/multiplicity/weight policy, representation decision, and qualified `V/E` costs | `U01`, `U04`, `P03` | A representation can change the mathematical input. Container semantics do not prove a database, network, or runtime cost. |
| BFS, Session 2 | layer trace, parent witness, shortest unweighted path, and component partition | `U01`, `P01` | FIFO supplies the layer argument only under the stated discovery/edge model. A returned path needs independent edge verification. |
| DFS, Session 3 | active/finished state, cycle witness, and topological-order evidence | `U02`, `U04` | A global seen set does not by itself distinguish an active back edge from a finished cross edge. Mutable input needs a snapshot/version boundary. |
| Relaxation and path selection, Sessions 4–5 | relaxation trace, negative-cycle scope, Dijkstra finalization, and stale-entry reasoning | `U03`, `P02` | A heap operation does not prove greedy safety; Dijkstra requires the nonnegative-weight premise and authoritative logical distance state. |
| All-pairs connection | Johnson reweighting as a transfer reading: preserve shortest-path comparisons while changing weights before repeated source searches | `U06` | This module does not implement or benchmark Johnson's algorithm; the connection does not remove its finite-graph, Bellman–Ford, Dijkstra, or proof obligations. |
| Spanning forest, Session 6 | cut/exchange argument, Kruskal/Prim trace, and disjoint-set distinction | `U05`, `U04` | A disjoint-set parent is not an original graph edge, and an MST/forest solves a different objective from a source-path tree. |
| Network-flow bridge, Session 6 | capacity/conservation model, residual forward/reverse state, augmenting-path trace, flow value, and cut certificate | `U07`, `U04` | A capacity is not a shortest-path weight; a locally feasible flow is not a maximum-flow claim without a residual stop rule or cut evidence. |
| Numerical experiment and architecture studio | named graph family, representation, timing boundary, snapshot, patch review, and verifier | Atlas-original experiment and review prompts; `U01`–`U05` for model calibration | A measurement does not prove a theorem, generalize across representations/runtimes, validate source freshness, or justify an unchecked generated patch. |

## License and reuse boundary

The source roles are deliberately narrow: MIT material calibrates rigorous
undergraduate models, proof traditions, and the network-flow bridge; Python documentation bounds public
library/container claims. None grants a credential, makes Atlas equivalent to
an institutional course, or turns external assets into Atlas content.

If anyone proposes exact wording, a figure, an exercise, a solution, a video,
or source code for reuse, pause this workflow and separately verify current
license, attribution, academic-integrity, and distribution terms. Public
availability is not reuse approval.

## Stable learner links

Use a ledger link only after an Atlas attempt and with one question: graph
model/proof vocabulary (`U04`); BFS or DFS trace (`U01`, `U02`); weighted-path
selection (`U03`); all-pairs reweighting connection (`U06`); MST reasoning (`U05`);
flow residual/cut reasoning (`U07`); documented deque behavior (`P01`);
heap/stale-entry mechanism (`P02`); or Python container semantics (`P03`).
These links are not an answer key, a reading pile, or authority to bypass M9
or M11.

## Source-selection rationale

This source spine preserves the module's first-principles sequence: define the
graph question, preserve its information, assign a frontier/edge schedule or
residual update, state an invariant, produce a witness/certificate, and qualify cost. It joins formal graph
and algorithm sources to official Python contracts while keeping Atlas's
readable diagrams, traces, code review, and evidence workflow original.

## Release and review questions still open

- Recheck living URLs, documentation versions, access dates, and reuse terms
  before later human review or a release claim.
- Inspect every learner-facing theorem, Python behavior, complexity,
  measurement, visual, diagnostic, and source statement; resolving a link is
  not validation of its correctness or teaching quality.
- Test real keyboard, screen-reader, browser, and whiteboard experience; a
  text alternative and local structural check are not a completed
  accessibility review.
- Treat every TA, Study Partner, GPT Live, or Notion interaction as separate
  learner-controlled evidence. This addendum neither causes nor proves one.
- Keep any M10 candidate non-promoting until qualified review, a reviewed
  source commit, source-commit CI, deployment evidence, and release records
  exist.
