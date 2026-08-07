# Module 8 — Hashing, Dictionaries, Sets, and Indexing — Source-Audit Addendum

**Audit date:** 2026-08-02  
**Scope:** source roles, claim linkage, access/reuse boundaries, and
candidate-only structural evidence for the existing M8 workbook. This is an
instructor-facing audit record, not a learner textbook, quality approval,
release decision, or authorization to reuse external assets.

## Candidate boundary

M8 remains `legacy-open` for learner access, `legacy-baseline` for its
contract state, and `unrecorded` for release. This addendum may be referenced
by a non-promoting structural candidate, but it records declared source
pointers and boundaries only. It does not approve the workbook, establish
university equivalence, verify learner understanding, or create CI,
deployment, publication, oral-defense, GPT Live, Notion, or mastery evidence.

Atlas owns its lookup traces, diagrams, code-reading tasks, diagnostics,
experiments, index design, dossiers, and conversation prompts. External
material is linked and paraphrased only. Do not copy lectures, slides,
figures, assignments, solutions, assessments, prose, or source code into
Atlas merely because it is publicly available.

## Source and reuse ledger

| ID | Owner and stable learner-facing link | Intended claim scope | Access / reuse status |
| --- | --- | --- | --- |
| **P01** | Python Software Foundation: [data model — `object.__hash__`](https://docs.python.org/3.14/reference/datamodel.html#object.__hash__) | Portable equality/hash implication, mutable equality-based objects, and hash-randomization boundary. It does not prescribe a table layout, collision probability, durable identifier, or worst-case cost. | Accessed 2026-08-02. Link and paraphrase only; consult the [Python license](https://docs.python.org/3/license.html) before any exact reuse. Atlas imports no prose, examples, figures, or source. |
| **P02** | Python Software Foundation: [mapping type `dict`](https://docs.python.org/3.14/library/stdtypes.html#mapping-types-dict) and [set types](https://docs.python.org/3.14/library/stdtypes.html#set-types-set-frozenset) | Portable mapping/set behavior, hashable-key requirement, documented dictionary order, and unordered-set boundary. It does not supply an asymptotic guarantee or CPython probe rule. | Accessed 2026-08-02. Link and paraphrase only; recheck current license/attribution terms before any proposed reuse. |
| **P03** | Python Software Foundation: [`PYTHONHASHSEED`](https://docs.python.org/3.14/using/cmdline.html#envvar-PYTHONHASHSEED) | Process hash-seeding and reproducibility vocabulary for the warning that built-in string hashes are not durable identity. It is not a collision generator or cryptographic specification. | Accessed 2026-08-02. Link and paraphrase only; no documentation text or code is copied. |
| **U01** | MIT OpenCourseWare: [6.006 Lecture 4 — Hashing notes](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/ce9e94705b914598ce78a00a70a1f734_MIT6_006S20_lec4.pdf) | Undergraduate calibration for direct addressing, collisions, randomized/universal-hashing models, load, and expected-amortized analysis. It calibrates scope; it does not certify Atlas as an MIT course or validate every Atlas implementation choice. | Accessed 2026-08-02. Link-only calibration; no MIT lecture asset is imported. Recheck current OCW attribution, noncommercial, share-alike, and academic-integrity terms before any future reuse. |
| **U02** | Pat Morin: [Open Data Structures, Ch. 5 — Hash Tables](https://opendatastructures.org/ods-python/5_1_ChainedHashTable_Hashin.html) and [§5.3 — Hash Codes](https://opendatastructures.org/ods-python/5_3_Hash_Codes.html) | Rigorous reference for a chained representation, resizing, and equality-compatible hash-code construction. It is not evidence for CPython implementation details or a copied Atlas assessment. | Accessed 2026-08-02. Link-only; no prose, exercises, figures, answers, or code are imported. Verify current attribution/license compatibility before any proposed reuse. |
| **C01** | CPython: [`v3.14.6` `Objects/dictobject.c`](https://github.com/python/cpython/blob/v3.14.6/Objects/dictobject.c) | Pinned implementation reading for one open-addressed dictionary design, slot/probe commentary, and implementation vocabulary. | Accessed 2026-08-02. Link and paraphrase only; no CPython code is imported. This is version-specific evidence, not a Python-language promise; recheck tag and license before future reuse. |

## Claim linkage and stopping lines

| Workbook location | Claim or learner artifact | Source route | Required stopping line |
| --- | --- | --- | --- |
| Position, definitions, Session 1 | Repeated lookup motivates an index; direct addressing trades `Θ(U)` space for direct position access; hashing reduces a sparse universe to candidate regions | `U01`; Atlas original traces | The teaching model is not a production storage guarantee, and a small candidate region does not itself decide key equality or cost. |
| Collision traces, Session 2 | Pigeonhole collisions, chaining/probing families, tombstone trace, and equality confirmation | `U01`, `U02`; Atlas original five-slot trace | A course-model tombstone/probe trace is not CPython's table formula or a license to discard original keys. |
| Key contract, Session 3 | `x == y ⇒ hash(x) == hash(y)`, false converse, stable equality-relevant key state, and `dict`/`set` behavior | `P01`, `P02` | Portable behavior does not make `hash()` a durable identifier, prescribe an object's representation, or make every immutable container hashable. |
| Cost, resize, Session 4 | Load factor, expected collision work, adversarial worst case, geometric resizing, and expected-amortized wording | `U01`, `U02` | Expected and amortized are distinct qualifiers. State the randomness, load, key work, input case, and growth policy; do not turn the result into a universal Python or security guarantee. |
| Inverted index, Session 5 | Token-to-posting invariant, conjunction proof, empty-query policy, and language-versus-CPython separation | `P02`; Atlas original index/proof | Mapping/set semantics do not choose tokenization, ranking, persistence, transactionality, or a recovery policy. |
| Adversarial review, Session 6 | Process-local hash boundary, collision fixture, derived-state recovery, and reject-`hash(token)` patch review | `P03`, `C01`; Atlas original tests/prompts | A fixed seed is not a collision attack; a pinned CPython source reading is not portable API or deployment evidence. |
| M9 handoff | Equality index versus ordered-query need | Atlas original bridge; `U01` for data-structure calibration | M9 is the only canonical forward handoff. This packet neither establishes readiness nor authorizes a prerequisite bypass. |

## License and reuse boundary

The source roles are intentionally separated: official Python documentation
bounds portable language/library claims; MIT and Open Data Structures calibrate
algorithmic depth; CPython supplies a pinned implementation observation. None
grants a credential, makes a compressed Atlas route equivalent to another
institution's course, or turns external material into Atlas content.

If anyone proposes exact wording, a figure, exercise, solution, video, or
source code for reuse, pause this workflow and separately verify current
license, attribution, academic-integrity, compatibility, and distribution
terms. Public availability is not reuse approval.

## Stable learner links

Use a ledger link after an Atlas attempt and with a concrete question:
algorithmic lookup/collision/cost assumptions (`U01`, `U02`); equality/hash
and `dict`/`set` semantics (`P01`, `P02`); process-seed boundary (`P03`); or
pinned dictionary implementation reading (`C01`). These links are not an
answer key, an undirected reading pile, or authority to skip the Atlas
derivation or testing evidence.

## Source-selection rationale

This small source spine preserves M8's connected first-principles route:
repeated scans expose a relationship worth materializing; direct addressing
exposes sparse space; hash compression creates collisions; equality preserves
semantic identity; stated load/randomness/growth assumptions qualify cost; and
the inverted index makes the trade-off architectural. The Atlas workbook keeps
the readable traces, counterexamples, proof prompts, and agent-review work
original while making portable and CPython-specific claims visibly distinct.

## Release and review questions still open

- Recheck living URLs, versions, access dates, and reuse terms before any
  future human review or release claim.
- Inspect each learner-facing Python, algorithmic, CPython, security, proof,
  diagnostic, and numerical-experiment statement; resolving a link does not
  validate correctness or teaching quality.
- Test actual keyboard, screen-reader, browser, and whiteboard experience;
  a text alternative and local renderer test are not a complete accessibility
  review.
- Treat every TA, Study Partner, GPT Live, or Notion interaction as separate
  learner-controlled evidence. This addendum neither causes nor proves one.
- Keep M8 candidate-only until qualified review, a reviewed source commit,
  source-commit CI, deployment evidence, and release records exist.
