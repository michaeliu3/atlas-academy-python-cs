# Module 7 — Stacks, Queues, Iteration, and Lazy Computation — Source-Audit Addendum

**Audit date:** 2026-08-02  
**Scope:** source roles, claim linkage, access/reuse boundaries, and the
candidate-only structural evidence for the existing M7 workbook. This is an
instructor-facing audit record, not a learner textbook, quality approval,
release decision, or authorization to reuse external assets.

## Candidate boundary

M7 remains `legacy-open` for learner access, `legacy-baseline` for its
contract state, and `unrecorded` for release. This addendum may be referenced
by a non-promoting structural candidate, but it proves only that declared
local source pointers can resolve together. It does not approve the workbook,
establish university equivalence, verify learner understanding, or create CI,
deployment, publication, oral-defense, GPT Live, Notion, or mastery evidence.

Atlas owns its access-policy narrative, traces, diagrams, code-reading tasks,
diagnostics, experiments, dossiers, and prompts. External material is linked
and paraphrased only. Do not copy lectures, slides, figures, assignments,
solutions, assessments, or source code into Atlas merely because they are
publicly available.

## Source and reuse ledger

| ID | Owner and stable learner-facing link | Intended claim scope | Access / license / reuse status |
| --- | --- | --- | --- |
| **P01** | Python Software Foundation: [data model — iterator types](https://docs.python.org/3.14/reference/datamodel.html#iterator-types) | The iterator exhaustion and self-iterating protocol boundary. It does not say every iterable is replayable, finite, or indexable. | Accessed 2026-08-02. Python documentation is under the [PSF License Version 2](https://docs.python.org/3/license.html); Atlas uses a link and paraphrase only, with no imported prose, figures, or examples. |
| **P02** | Python Software Foundation: [`iter` and `next`](https://docs.python.org/3.14/library/functions.html#iter) | Built-in entry points for normal iterator acquisition and advancement, including `iter`'s callable/sentinel form and its legacy `__getitem__` fallback. It is not a complete streaming or concurrency specification. | Accessed 2026-08-02. Link and paraphrase only under the documented PSF-license boundary; recheck terms before any exact reuse. |
| **P03** | Python Software Foundation: [expressions — `yield`](https://docs.python.org/3.14/reference/expressions.html#yield-expressions) | Generator creation, first advancement, suspension, retained local state, resumption, and exhaustion. The separate generator-expression timing rule is also relevant. | Accessed 2026-08-02. Link and paraphrase only; no documentation code, prose, or figures are imported. Examples in Python documentation have additional licensing information at the linked license page. |
| **P04** | Python Software Foundation: [`collections.deque`](https://docs.python.org/3.14/library/collections.html#collections.deque) | End operations, `maxlen`, and the fact that a full bounded deque discards opposite-end items. It is not authority for a blocking, thread-coordination, or asynchronous backpressure guarantee. | Accessed 2026-08-02. Link and paraphrase only under the documented PSF-license boundary; the Atlas buffer model is original. |
| **P05** | Python Software Foundation: [`collections.abc`](https://docs.python.org/3.14/library/collections.abc.html) | Vocabulary for behavioral interfaces including `Iterable`, `Iterator`, and `Generator`. It does not replace tracing a particular object's consumption behavior. | Accessed 2026-08-02. Link and paraphrase only; no API table, prose, or examples are copied. |
| **U01** | MIT OpenCourseWare: [6.006 Lecture 2 — Data Structures and Dynamic Arrays](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/resources/lecture-2-data-structures-and-dynamic-arrays/) | Undergraduate calibration for interface versus representation and restricted sequence interfaces such as stacks and queues. It calibrates scope; it does not certify Atlas as an MIT course. | Accessed 2026-08-02. MIT OCW terms identify [CC BY-NC-SA 4.0](https://live.ocw.mit.edu/pages/privacy-and-terms-of-use/); Atlas remains link-only and does not reuse course materials. Recheck attribution, NC, SA, and current terms before any future reuse. |
| **U02** | UC Berkeley CS 61A: [Summer 2026 Discussion 5](https://cs61a.org/disc/disc05/disc05.pdf) | Current exercise tradition for tracing consumption, iterators, generator state, and lazy streams. It is calibration only, not an Atlas assessment or answer key. | Accessed 2026-08-02. Link-only; no source material is copied. Recheck the current course/PDF reuse terms before any proposed reuse rather than inferring permission from public availability. |
| **U03** | John DeNero: [Composing Programs §4.2, Implicit Sequences](https://www.composingprograms.com/pages/42-implicit-sequences.html) and its [license page](https://www.composingprograms.com/about.html) | Conceptual bridge from sequence abstraction to implicit sequences and retained generator execution state. It does not prove Atlas's batching, ownership, or failure contracts. | Accessed 2026-08-02. The text reports CC BY-SA 3.0; Atlas is link-and-paraphrase only and does not reuse exercises, prose, figures, solutions, or code. Recheck compatibility and attribution before any future reuse. |

## Claim linkage and stopping lines

| Workbook location | Claim or learner artifact | Source route | Required stopping line |
| --- | --- | --- | --- |
| Position, first principle, Session 1 | Stack/queue access law; interface versus representation; qualified `list`/`deque` choice | `U01`; `P04` for public deque behavior | A restricted access policy determines removal order, not a universal time bound, memory layout, safety property, or permission for raw-container clients to bypass the policy. |
| Iterator definitions, `TakeIterator`, Session 2 | Iterable/iterator distinction, exhaustion, no over-consumption, reusable versus one-shot traces | `P01`, `P02`, `P05` | `iter`'s legacy `__getitem__` fallback is compatibility behavior; an iterable is not thereby replayable, finite, sized, or indexable. Request counts must be observed on the named source. |
| Generators, prediction, Session 3 | Generator construction versus advancement, suspension, retained state, and exhaustion | `P03`; `U02`/`U03` as pedagogical calibration | Generator body effects normally occur on advancement, but a generator expression evaluates its leftmost iterable at creation. Neither fact implies bounded memory or a particular effect/failure policy for another API. |
| Laziness, ownership, Session 4 | Demand upstream, data downstream, immutable batch ownership, `O(B)` working-batch claim | Atlas original traces and tests; `U03` for the implicit-sequence model | Lazy code can retain input-sized state or materialize an input-sized result. The claim is only about named retained buffers under stated source/sink exclusions. |
| Capacity, `BoundedBuffer`, Session 5 | Capacity invariant, rejection-without-mutation, `deque(maxlen)` distinction, synchronous pull nonclaim | `P04`; Atlas original buffer model | A full `deque(maxlen)` discards an item and is not a reliable work-queue overflow policy. Single-threaded pull is not concurrent/asynchronous waiting, cancellation, or end-to-end backpressure. |
| Code studio, agent task, Session 6 | Reviewed patch, source-request and ownership evidence, bounded delegation | Atlas original code, prompts, and tests | A plausible patch, generated explanation, or green output-only test does not establish capacity, ownership, cleanup, retry, or source-commit release evidence. |
| M8 handoff | Access-policy/demand card carried into hashing and indexing | `U01` as data-structure calibration | M8 is the only canonical forward handoff. This packet neither establishes readiness nor authorizes bypass of M8 or later prerequisites. |

## License and reuse boundary

The source roles remain separate. Official Python documentation bounds public
language and library claims. MIT and Berkeley materials calibrate rigorous
undergraduate scope and problem tradition. Composing Programs offers a
well-known conceptual treatment. None grants a credential, establishes that a
compressed Atlas route equals an institutional course, or licenses external
assets for unreviewed inclusion.

If an external asset, exact wording, exercise, figure, solution, or code is
ever proposed for reuse, pause this workflow and separately verify the current
license, attribution, academic-integrity, compatibility, and distribution
terms. Public availability is not a reuse decision.

## Stable learner links

Use a ledger link after an Atlas attempt and with a concrete question:
stack/queue interface versus representation (`U01`); iterator protocol and
legacy `iter` boundary (`P01`, `P02`, `P05`); generator timing and retained
state (`P03`); lazy-sequence explanation (`U03`); or current trace practice
(`U02`). Use `P04` to verify deque and `maxlen` behavior, not to infer a
concurrency guarantee. These links are not an undirected reading pile or an
answer key for the Atlas dossier.

## Source-selection rationale

The source spine supports a first-principles path: constrain legal operations,
make one next-item request visible, distinguish creation from advancement,
then name capacity and ownership explicitly. Official documentation anchors
Python behavior; MIT and Berkeley resources calibrate undergraduate depth; the
Atlas workbook owns its readable code traces, diagrams, prompts, and evidence
workflow. This keeps the central question inspectable: *which request moves
which state, who owns retained work, and what does the observation not prove?*

## Release and review questions still open

- Recheck living documentation versions, URLs, access dates, and reuse terms
  before a later human review or release claim.
- Inspect every M7 learner-facing Python, complexity, ownership, and
  concurrency-boundary claim against its source role; resolving links alone
  does not validate the statement.
- Test actual keyboard, screen-reader, browser, and whiteboard experience;
  metadata and a local renderer test are not a complete accessibility review.
- Treat any TA, Study Partner, GPT Live, or Notion interaction as separate
  learner-controlled evidence. This addendum neither causes nor proves one.
- Keep an eventual M7 packet non-promoting until qualified review,
  source-commit CI, deployment evidence, and release records exist.
