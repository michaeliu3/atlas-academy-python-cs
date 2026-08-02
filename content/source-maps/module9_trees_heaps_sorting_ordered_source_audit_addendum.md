# Module 9 — Trees, Heaps, Sorting, and Ordered Search — Source-Audit Addendum

**Audit date:** 2026-08-02  
**Scope:** source roles, claim linkage, access/reuse boundaries, and
candidate-only structural evidence for the existing M9 workbook. This is an
instructor-facing audit record, not a learner textbook, quality approval,
release decision, or permission to reuse external assets.

## Candidate boundary

M9 remains `legacy-open` for learner access, `legacy-baseline` for its
contract state, and `unrecorded` for release. This addendum may be referenced
by a non-promoting structural candidate, but it records only declared source
pointers and boundaries. It does not approve the workbook, establish
university equivalence, verify learner understanding, or create CI,
deployment, publication, oral-defense, GPT Live, Notion, or mastery evidence.

Atlas owns its operation ledgers, traces, diagrams, code-reading tasks,
diagnostics, experiments, dossiers, and conversation prompts. Every external
resource below is linked and paraphrased only. Do not copy lectures, slides,
figures, assignments, solutions, assessments, prose, or source code into
Atlas merely because it is publicly available.

## Source and reuse ledger

| ID | Owner and stable learner-facing link | Intended claim scope | Access / reuse status |
| --- | --- | --- | --- |
| **U01** | MIT OpenCourseWare: [6.006 Lecture 3: Sorting](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/resources/mit6_006s20_lec3/) | Undergraduate calibration for ordered operations, sorted arrays, comparison sorting, and operation tradeoffs. It does not certify Atlas as an MIT course. | Accessed 2026-08-02. MIT OCW terms identify a [CC BY-NC-SA 4.0](https://live.ocw.mit.edu/pages/privacy-and-terms-of-use/) baseline; Atlas is link-and-paraphrase only and imports no course asset. Recheck attribution, NC, SA, and current terms before any reuse. |
| **U02** | MIT OpenCourseWare: [6.006 Lecture 5: Linear Sorting](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/resources/mit6_006s20_lec5/) | Calibration for direct-address, counting, tuple, and radix sorting under bounded-key assumptions. It does not make a linear bound apply to arbitrary Python records. | Accessed 2026-08-02. Link-and-paraphrase only; no exercises, solutions, figures, or code are reused. Recheck the course and asset-specific terms before any proposed reuse. |
| **U03** | MIT OpenCourseWare: [6.006 Lecture 6: Binary Trees, Part 1](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/resources/mit6_006s20_lec6/) | Tree vocabulary, traversals, BST operations, and height-sensitive reasoning. It does not guarantee balance for every tree-shaped object. | Accessed 2026-08-02. Link-and-paraphrase only under the stated OCW boundary; Atlas retains original diagrams and traces. |
| **U04** | MIT OpenCourseWare: [6.006 Lecture 7: Binary Trees, Part 2: AVL](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/resources/mit6_006s20_lec7/) | AVL height, rotations, and local-repair reasoning. It does not license a copied rotation implementation or prove an Atlas patch correct. | Accessed 2026-08-02. Link-and-paraphrase only; recheck attribution and academic-integrity constraints before any reuse. |
| **U05** | MIT OpenCourseWare: [6.006 Lecture 8: Binary Heaps](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/resources/mit6_006s20_lec8/) | Priority-queue operations, implicit complete-tree representation, sift repairs, heapify, and heap sort. It does not make a heap a sorted sequence or an identity index. | Accessed 2026-08-02. Link-and-paraphrase only; no MIT figures, slides, assignments, or answers are included. |
| **P01** | Python Software Foundation: [`heapq`](https://docs.python.org/3.14/library/heapq.html) | Portable min/max heap invariant, public operations, empty behavior, `heapify`, combined-operation distinction, and documented priority-queue tie-breaking considerations. It is not authority for an Atlas stale-generation policy. | Accessed 2026-08-02. Link and paraphrase only under the [PSF License Version 2](https://docs.python.org/3/license.html); no documentation prose, examples, or code are copied. |
| **P02** | Python Software Foundation: [`bisect`](https://docs.python.org/3.14/library/bisect.html) | Insertion-point partition behavior, `key=`, and the distinction between logarithmic search and list-insertion movement. It is not a thread-safety or full ordered-index contract. | Accessed 2026-08-02. Link-and-paraphrase only; recheck terms before exact reuse. |
| **P03** | Python Software Foundation: [Sorting HOWTO](https://docs.python.org/3.14/howto/sorting.html), [`sorted`](https://docs.python.org/3.14/library/functions.html#sorted), and [`list.sort`](https://docs.python.org/3.14/library/stdtypes.html#list.sort) | Public sorting behavior, key functions, stability, reverse ordering, and the `sorted`/in-place distinction. It does not expose a portable Timsort implementation contract. | Accessed 2026-08-02. Link-and-paraphrase only; Atlas examples and questions are original. |
| **P04** | Python Software Foundation: [data model — rich comparisons](https://docs.python.org/3.14/reference/datamodel.html#object.__lt__) | Comparison-protocol vocabulary and the `NotImplemented` boundary. It does not make heterogeneous records comparable or define a product's tie policy. | Accessed 2026-08-02. Link-and-paraphrase only; no prose, examples, or code are imported. |
| **C01** | CPython: [`v3.14.6` `Lib/heapq.py`](https://github.com/python/cpython/blob/v3.14.6/Lib/heapq.py) | Pinned code-reading target for sift and heapify mechanics. Helper names, branching, and file shape are versioned implementation observations, not Python-language guarantees. | Accessed 2026-08-02. Link-and-paraphrase only; no CPython source is copied. Recheck the tag and license before any future reuse or broader claim. |
| **C02** | CPython: [`v3.14.6` `Objects/listobject.c`](https://github.com/python/cpython/blob/v3.14.6/Objects/listobject.c) | Bounded later reading for list sorting and contiguous-reference operations. It does not define Python sorting semantics or behavior in another runtime. | Accessed 2026-08-02. Link-and-paraphrase only; treat it as a pinned observation and recheck the tag/license before reuse. |

## Claim linkage and stopping lines

| Workbook location | Claim or learner artifact | Source route | Required stopping line |
| --- | --- | --- | --- |
| Ordered-question first principle; Session 1 | operation recovery, key/direction/duplicate/tie policy, and representation choice | `U01`, `U03`, `U05`; Atlas operation ledger | A chosen container is not a specification. Hash identity, successor, minimum, global sequence, and prefix completion remain different operation contracts. |
| Trees/BSTs/AVL; Sessions 2–3 | recursive tree model, BST region invariant, height-qualified cost, rotation order/reachability/metadata argument | `U03`, `U04`; Atlas original symbolic traces | `Θ(h)` is not automatically `Θ(log n)`. A local rotation needs an in-order, reachability, and metadata argument; it is not a universal balanced-tree implementation. |
| Sorted arrays and heaps; Session 4 | `bisect` partition behavior, list movement distinction, heap invariant, parent/child repair, heapify model, and bounded source reading | `P01`, `P02`, `C01` | A heap only orders ancestors against children and a `bisect` search does not make list insertion logarithmic. CPython helper shape must not become an Atlas public API. |
| Sorting; Session 5 | permutation/order/stability obligations, key/reverse policy, comparison lower-bound scope, and bounded-key escape | `U01`, `U02`, `P03`, `P04` | The comparison lower bound assumes comparison-only information; counting/radix bounds require a declared finite key universe and resource cost. A sorted value sequence alone need not preserve multiplicity or stable record order. |
| Trie/prefix model; Session 5 | shared-prefix representation, normalization policy, and prefix plus visited/output work | Atlas original model; `U01` only for ordered-operation calibration | A trie is not a universal ordered index. Its cost depends on a stated child-map model, normalization, visited subtree work, and returned output; it does not establish relevance ranking. |
| Scheduler, code studio, and Session 6 | authoritative identity map, versioned stale heap entries, compaction, rebuildable trie, bounded agent brief, and patch review | Atlas original architecture, prompts, and tests; `P01` for public heap mechanics | A plausible patch or green output-only test does not establish same-priority currency, compaction equivalence, source authority, concurrency safety, CI, deployment, or release evidence. M10 is the only canonical forward handoff. |

## License and reuse boundary

The source roles remain distinct. MIT materials calibrate rigorous
undergraduate algorithms scope. Python documentation bounds portable language
and standard-library claims. CPython source supplies a pinned implementation
observation. Atlas owns its integrated scheduling/prefix problem, diagrams,
prompts, and evidence workflow. None grants a credential, establishes that a
compressed Atlas route equals an institutional course, or licenses external
assets for unreviewed inclusion.

If an external asset, exact wording, exercise, figure, solution, video, or
source code is proposed for reuse, pause this workflow and separately verify
the current license, attribution, academic-integrity, compatibility, and
distribution terms. Public availability is not reuse approval.

## Stable learner links

Use one ledger link after an Atlas attempt and with a concrete question:
ordered-operation choice (`U01`); bounded-key escape (`U02`); BST model
(`U03`); rotation argument (`U04`); heap model (`U05`); public Python heap,
bisect, sorting, or comparison behavior (`P01`–`P04`); or the pinned heap/list
implementation reading (`C01`–`C02`). These links are not an answer key, an
undirected reading pile, or authority to skip the Atlas derivation.

## Required wording traps

- A BST has a height-dependent search path; it is not automatically balanced.
- A heap returns one extremum efficiently but is not a fully sorted array or a
  logarithmic arbitrary-search index.
- `bisect` identifies an insertion point; list movement can still dominate an
  insertion.
- Python's stable sorting behavior is a public contract; internal algorithm
  details and CPython source are not a portable contract.
- The comparison-sorting lower bound is model-relative. Counting/radix sorting
  adds bounded-key assumptions and space costs.
- Trie completion needs a normalization policy and output-sensitive cost. It
  neither establishes ranking semantics nor makes a prefix socially neutral.
- Lazy deletion trades cheaper updates for stale physical entries, cleanup
  work, and space. A revision is an Atlas currency policy, not a `heapq`
  feature.

## Source-selection rationale

This source spine supports a first-principles path: name the ordered client
question, state the key and policy, derive the smallest invariant that makes
the operation efficient, then test the invariant against a counterexample and
one real architecture trace. MIT sources calibrate the mathematical models;
official Python docs bound public behavior; CPython source makes one
implementation layer inspectable without turning it into a language promise.
Atlas keeps the readable scheduling, prefix, review, and oral-defense work
original.

## Release and review questions still open

- Recheck living URLs, versions, access dates, and reuse terms before any
  future human review or release claim.
- Inspect every learner-facing mathematical, Python-semantic, CPython,
  diagnostic, visual, and numerical-experiment claim; resolving a link does
  not validate it or its teaching quality.
- Test real keyboard, screen-reader, browser, and whiteboard experience; text
  alternatives and a local renderer check are not a completed accessibility
  review.
- Treat any TA, Study Partner, GPT Live, or Notion interaction as separate
  learner-controlled evidence. This addendum neither causes nor proves one.
- Keep M9 candidate-only until qualified review, a reviewed source commit,
  source-commit CI, deployment evidence, and release records exist.
