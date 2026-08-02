# Module 1 — Values, State, and Execution — Source-Audit Addendum

**Audit date:** 2026-08-02  
**Scope:** source roles, claim linkage, access/reuse boundaries, and the
candidate-only structural evidence for the existing M1 workbook. This is an
instructor-facing audit record, not a learner textbook, quality approval,
release decision, or authorization to reuse external assets.

## Candidate boundary

M1 remains `legacy-open` for learner access, `legacy-baseline` for its
contract state, and `unrecorded` for release. This addendum may be referenced
by a non-promoting structural candidate, but that only proves that declared
local source pointers resolve together. It does not approve the workbook,
establish a university-equivalence claim, verify a learner's understanding, or
create CI, deployment, publication, or Notion evidence.

The Atlas explanations, diagrams, object traces, code-reading comparison,
diagnostic distractors, prompts, and exercises are original course material.
Use external sources as links and paraphrased calibration. Do not copy
lectures, slides, figures, assignments, solutions, assessments, or source code
into Atlas merely because they are accessible online.

## Source and reuse ledger

| ID | Owner and stable learner-facing link | Intended claim scope | Access / reuse status |
| --- | --- | --- | --- |
| **P01** | Python Software Foundation: [execution model](https://docs.python.org/3.14/reference/executionmodel.html), [data model](https://docs.python.org/3.14/reference/datamodel.html), and [assignment statements](https://docs.python.org/3.14/reference/simple_stmts.html#assignment-statements) | Python names/bindings, execution blocks and frames, object identity/type/value, mutability, and assignment semantics. These are the normative references when M1 makes a Python language claim. | Accessed 2026-08-02. Link and paraphrase. The [Python license page](https://docs.python.org/3.14/license.html) identifies PSF License Version 2 and the additional 0BSD treatment for documentation examples/recipes/code from Python 3.8.6 onward. Atlas ships original examples; any exact reuse requires notice and separate review. |
| **U01** | MIT OpenCourseWare: [6.100L calendar](https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/pages/calendar/) | Pedagogical calibration for the sequence objects/bindings → environments/functions → mutation/aliasing → debugging/assertions. It is not Python language authority. | Accessed 2026-08-02. Link-only calibration; do not copy course prose, assignments, figures, lecture notes, solutions, or assessment material. Recheck the course page's terms before any future asset reuse. |
| **U02** | MIT 6.102: [Designing Specifications](https://web.mit.edu/6.102/www/sp26/classes/05-designing-specs/) | Declarative specifications, preconditions, postconditions, specification strength, and boundary reasoning used to frame M1's `normalize_event` contract. It does not specify Python alias semantics. | Accessed 2026-08-02. Link and paraphrase only; no MIT text, figures, exercises, or code are imported. The former M1 mutability URL was unavailable and is not used as an authoritative link. |
| **U03** | Carnegie Mellon: [15-122 Principles of Imperative Computation](https://www.cs.cmu.edu/~15122/) | Curriculum-level calibration for imperative state, invariants, and program reasoning. It is a breadth/sequence comparator, not a source for M1 wording or assessments. | Accessed 2026-08-02. Link-only; no reuse approval is inferred from public access. |
| **C01** | Composing Programs: [Mutable Data](https://www.composingprograms.com/pages/24-mutable-data.html) | Optional second conceptual explanation of identity, mutation, and shared state after a learner has attempted the Atlas trace. It is not a normative Python specification. | Accessed 2026-08-02. Link-only until licensing and exact asset scope are separately reviewed; no prose, diagrams, exercises, or code are imported. |

## Claim linkage and stopping lines

| Workbook location | Claim or learner artifact | Source route | Required stopping line |
| --- | --- | --- | --- |
| First-principles derivation and Session 1 | Object/binding graph, mutation versus rebinding, identity versus equality | `P01`; `C01` only for a second explanation | An object graph is an Atlas explanatory model, not a diagram of Python's physical memory layout. `id()` is implementation-dependent and not evidence of a portable address. |
| Session 2 | Environment trace, local/`nonlocal` claim, prediction before reveal | `P01` | A single trace establishes the result under the shown definitions and inputs, not every language or implementation detail that a learner might infer. |
| Session 3 and `normalize_event` | Preconditions, postconditions, frame condition, invariant | `U02` for specification vocabulary; `P01` for Python behavior | A contract states what must hold; it does not prove that this particular implementation satisfies the contract without appropriate evidence. |
| Session 4 | Event-log comparison, delayed-alias regression, smallest repair | Atlas original code plus `P01`/`U02` for terms | Reconstructing values is an Atlas design choice for this stated boundary. `frozen=True` is not deep or absolute immutability, and a tuple snapshot is not a universal storage policy. |
| Diagnostic Question 4 | `+=` and mutation reasoning | `P01` | Augmented assignment is operation- and type-dependent; do not generalize a list example to every object. |
| Diagnostic Question 8 / forward link | Read–compute–write transition before M19 | Atlas transition model; later M19 sources own concurrency specifics | M1 does not claim a GIL rule, atomicity guarantee, synchronization design, or runtime test result. |

## Source-selection rationale

The source spine intentionally separates roles. Official Python documentation
owns language claims. MIT and CMU material calibrate sequence, first-principles
framing, and specification vocabulary. The optional conceptual text gives a
second explanation without replacing the official language reference. Atlas
owns the examples, visual models, code-reading tasks, and course-specific
claims about its own activities.

This separation helps the learner ask a better question than “which source is
right?”: *what kind of claim am I making, and what evidence could support it?*
It also avoids presenting university course pages as permission to reuse their
protected teaching material or as proof that a 60-day course confers an
equivalent credential.

## Release and review questions still open

- Recheck living documentation versions, course URLs, and reuse terms before a
  later human review or release claim.
- Inspect every M1 learner-facing statement, visual, and diagnostic against
  the scoped source role; a source link alone does not validate the statement.
- Test the actual learner experience with keyboard and screen-reader users;
  metadata and a local renderer test are not a complete accessibility review.
- Treat any TA, Study Partner, GPT Live, or Notion interaction as separate
  learner-controlled evidence. This addendum neither causes nor proves one.
- Keep the M1 packet non-promoting until qualified review, source-commit CI,
  deployment evidence, and release records exist.
