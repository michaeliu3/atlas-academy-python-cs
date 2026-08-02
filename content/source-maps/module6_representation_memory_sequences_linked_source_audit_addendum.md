# Module 6 — Representation, Memory, Sequences, and Linked Structures — Source-Audit Addendum

**Audit date:** 2026-08-02  
**Scope:** source roles, claim linkage, access/reuse boundaries, and
candidate-only structural evidence for the existing M6 workbook. This is an
instructor-facing audit record, not a learner textbook, quality approval,
release decision, or permission to reuse external assets.

## Candidate boundary

M6 remains `legacy-open` for learner access, `legacy-baseline` for its
contract state, and `unrecorded` for release. This addendum may be referenced
by a non-promoting structural candidate, but it only records declared source
pointers and boundaries. It does not approve the workbook, establish
university equivalence, verify learner understanding, or create CI,
deployment, publication, oral-defense, GPT Live, Notion, or mastery evidence.

Atlas owns its original traces, diagrams, code-reading prompts, diagnostics,
experiments, dossiers, and conversation prompts. Every external resource below
is linked and paraphrased only. Do not copy lectures, slides, figures,
assignments, solutions, assessments, prose, or source code into Atlas merely
because it is publicly available.

## Source and reuse ledger

| ID | Owner and stable learner-facing link | Intended claim scope | Access / reuse status |
| --- | --- | --- | --- |
| **U01** | MIT OpenCourseWare: [6.006 Lecture 2: Data Structures and Dynamic Arrays](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/resources/lecture-2-data-structures-and-dynamic-arrays/) | Undergraduate calibration for the interface/data-structure distinction, Word-RAM bridge, arrays, linked structures, dynamic growth, and model-level operation tables. It does not certify Atlas as an MIT course. | Accessed 2026-08-02. Link and paraphrase only; no MIT asset is imported. Recheck current OCW terms, attribution, and academic-integrity boundaries before any proposed reuse. |
| **U02** | Carnegie Mellon: [15-122 syllabus](https://www.cs.cmu.edu/~15122/syllabus.shtml) | Calibration for specification, contracts, invariants, and amortized reasoning. It is not direct technical evidence for each Atlas memory-diagram, linked-structure, or array claim, and it does not validate learner responses. | Accessed 2026-08-02. Link-only calibration; no course material is reproduced. Terms and an exact reuse scope would require separate review. |
| **U03** | UC Berkeley CS61C: [Caches II notes](https://notes.cs61c.org/content/caches-ii/) | Mechanism vocabulary for temporal/spatial locality and cache-block intuition. It supports a hypothesis, not a Python performance guarantee. | Accessed 2026-08-02. Link-only calibration; no figures, prose, exercises, or answers are imported. Recheck terms before any future reuse. |
| **P01** | Python Software Foundation: [data model—objects, values, and types](https://docs.python.org/3.14/reference/datamodel.html#objects-values-and-types) | Portable terms for object identity, value, mutability, references, and the language/implementation boundary; `id` is not a universal physical-address promise and reclamation timing is implementation-dependent. | Accessed 2026-08-02. Link and paraphrase only; see the [Python license](https://docs.python.org/3.14/license.html) before any exact reuse. Atlas ships original examples and explanations. |
| **P02** | Python Software Foundation: [sequence types](https://docs.python.org/3.14/library/stdtypes.html#sequence-types-list-tuple-range) | Portable behavior of sequence, list, tuple, `bytes`, and `bytearray`; not a physical-layout or complexity promise. | Accessed 2026-08-02. Link and paraphrase only; no documentation prose or examples are copied. Recheck license/attribution before future asset reuse. |
| **P03** | Python Software Foundation: [copy—shallow and deep copy](https://docs.python.org/3.14/library/copy.html#shallow-and-deep-copy-operations) | Definitions and caveats for new outer compound objects with shared references versus recursive copying, including recursive-object and over-copying concerns. | Accessed 2026-08-02. Link and paraphrase only; no source code, prose, or figures are imported. |
| **P04** | Python Software Foundation: [`sys.getsizeof`](https://docs.python.org/3.14/library/sys.html#sys.getsizeof) | Boundary for direct object size, referred-object exclusions, and implementation-specific measurement limits. | Accessed 2026-08-02. Link and paraphrase only; not authority for total retained graph size or cross-runtime comparison. |
| **P05** | Python Software Foundation: [`timeit`](https://docs.python.org/3.14/library/timeit.html) | Bounded vocabulary for repeated timing of small snippets and measurement setup; not an asymptotic proof or production benchmark protocol. | Accessed 2026-08-02. Link and paraphrase only; record the actual interpreter, machine, workload, and exclusions for every Atlas experiment. |
| **P06** | Python Software Foundation: [`tracemalloc`](https://docs.python.org/3.14/library/tracemalloc.html) | Bounded tracing vocabulary for Python-allocated memory blocks and allocation snapshots; it does not measure every process, native, shared, or retained-graph cost. | Accessed 2026-08-02. Link and paraphrase only; state what tracing is active and what it omits before comparing observations. |
| **C01** | CPython: [`v3.14.6` `Include/cpython/listobject.h`](https://github.com/python/cpython/blob/v3.14.6/Include/cpython/listobject.h) | Pinned implementation observation for the list object’s used size, allocation, and element-pointer storage. | Accessed 2026-08-02. Link and paraphrase only; no CPython code is copied. This is CPython-specific source evidence, not a Python-language promise; recheck its license and tag before reuse. |
| **C02** | CPython: [`v3.14.6` `Objects/listobject.c`](https://github.com/python/cpython/blob/v3.14.6/Objects/listobject.c) | Pinned implementation reading for resize and over-allocation mechanisms. Exact rendered line ranges may move; the tag and file identify the evidence. | Accessed 2026-08-02. Link and paraphrase only; no CPython code is imported. It must not be generalized to alternate implementations or future versions without review. |

## Claim linkage and stopping lines

| Workbook location | Claim or learner artifact | Source route | Required stopping line |
| --- | --- | --- | --- |
| Definition, assumptions, derivation/proof idea; Session 2 | Sequence value, representation, RI/AF, fixed-width base-plus-offset indexing, and shift count | `U01` for the simplified model; `P02` only for portable sequence behavior | The model does not describe every Python runtime. Constant-time indexing follows only from its stated slot, address, and bounds assumptions. |
| Counterexample; Session 4 | Head/tail linked path, boundary transition, known-location qualification, and stale-tail diagnosis | Atlas original trace and prompts; `U02` for invariant/specification calibration | A linked structure is not inherently faster. Unknown-position insertion needs traversal unless the necessary node/reference is already available. |
| Numerical experiment; Session 5 | Locality hypothesis, direct-size scope, allocation tracing scope, repeated samples, interpreter/machine/workload record, and excluded payload work | `U03`, `P04`, `P05`, and `P06` | One observation cannot prove an asymptotic theorem, universal cache claim, total process-memory account, or portable Python behavior. M17 later supplies a fuller machine model. |
| Python language labels; Sessions 1 and 3 | Object/reference terms, list/tuple/bytes behavior, shallow versus deep copy, snapshot boundary, `id`, and reclamation boundary | `P01`, `P02`, `P03` | Portable behavior must be stated at the documentation level; it does not entail a C field name, allocation formula, physical address, immediate reclamation event, or deep-copy guarantee for every graph. |
| CPython labels; Session 3 and source-reading exercises | `PyListObject`, used size, allocated capacity, element-pointer vector, and resize reading | `C01`, `C02` | These are pinned `v3.14.6` observations only. M24 later deepens CPython internals; alternate implementations may differ. |
| Code-reading/design and Session 6 | `HistoryBuffer` contract, representation independence, queue-like workload, bounded agent review, and M7 handoff | Atlas original architecture slice; `U01`/`U02` for scope calibration | A benchmark or generated patch cannot choose a representation without preserved public behavior, RI evidence, stated workload, and review. M7 is the only canonical forward handoff. |

## License and reuse boundary

The source roles are deliberately separated: Python documentation supplies
portable semantics and measurement boundaries; CPython source supplies a
pinned implementation observation; MIT/CMU/Berkeley material calibrates
rigorous undergraduate breadth. None grants a credential, makes Atlas
equivalent to another institution’s course, or turns external assets into
Atlas content.

If anyone proposes exact wording, a figure, an exercise, a solution, a video,
or source code for reuse, pause this workflow and separately verify current
license, attribution, academic-integrity, and distribution terms. Public
availability is not reuse approval.

## Stable learner links

Use a ledger link only after an Atlas attempt and with a concrete question:
array/linked representation model (`U01`); invariant and specification
discipline (`U02`); locality mechanism (`U03`); portable object/sequence/copy
behavior (`P01`–`P03`); direct-size, tracing, and timing limits (`P04`–`P06`); or pinned
CPython list implementation (`C01`–`C02`). These links are not an answer key,
an undirected reading pile, or authority to skip the Atlas derivation.

## Required wording traps

- `id(x)` distinguishes an object during its lifetime; it is not a universal
  physical-memory-address guarantee, and deleting a name is not a language
  guarantee of immediate object reclamation.
- CPython list contiguity concerns a region of **references**, not necessarily
  contiguous payload objects. Its growth rule is a pinned implementation
  observation, not a Python-language guarantee.
- `sys.getsizeof` and `tracemalloc` answer bounded measurement questions. Name
  the root, tracing state, interpreter, shared payload policy, and omissions
  before treating either number as memory evidence.
- A deep copy has graph and customization caveats; it is not a synonym for
  safety. A linked splice is constant-time only after the needed location or
  predecessor reference is available.

## Source-selection rationale

This small source spine supports a first-principles route while keeping claims
honest. It joins rigorous undergraduate algorithms and imperative-computation
calibration to official Python language references, then makes the CPython and
machine boundaries visible rather than silent. Atlas keeps the integrated
event-history problem, visual explanations, code-review exercises, and
evidence workflow original.

## Release and review questions still open

- Recheck living URLs, versions, access dates, and reuse terms before any
  future human review or release claim.
- Inspect every learner-facing mathematical, language-semantic, CPython,
  locality, diagnostic, visual, and numerical-experiment statement; resolving
  a link does not validate its correctness or teaching quality.
- Test real keyboard, screen-reader, browser, and whiteboard experience; a
  text alternative and local structural check are not a completed
  accessibility review.
- Treat every TA, Study Partner, GPT Live, or Notion interaction as separate
  learner-controlled evidence. This addendum neither causes nor proves one.
- Keep M6 candidate-only until qualified review, a reviewed source commit,
  source-commit CI, deployment evidence, and release records exist.
