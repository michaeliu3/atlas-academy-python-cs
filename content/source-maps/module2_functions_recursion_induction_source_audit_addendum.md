# Module 2 — Functions, Recursion, and Induction — Source-Audit Addendum

**Audit date:** 2026-08-02  
**Scope:** source roles, claim linkage, access/reuse boundaries, and the
candidate-only structural evidence for the existing M2 workbook. This is an
instructor-facing audit record, not a learner textbook, quality approval,
release decision, or authorization to reuse external assets.

## Candidate boundary

M2 remains `legacy-open` for learner access, `legacy-baseline` for its
contract state, and `unrecorded` for release. This addendum may be referenced
by a non-promoting structural candidate, but it proves only that declared
local source pointers can resolve together. It does not approve the workbook,
establish university equivalence, verify a learner's understanding, or create
CI, deployment, publication, oral-defense, GPT Live, or Notion evidence.

Atlas owns the note-tree narrative, code, diagrams, diagnostics, studios, and
prompts. External material is used as linked, paraphrased calibration. Do not
copy lectures, slides, figures, assignments, solutions, assessments, or source
code into Atlas merely because they are available online.

## Source and reuse ledger

| ID | Owner and stable learner-facing link | Intended claim scope | Access / reuse status |
| --- | --- | --- | --- |
| **P01** | Python Software Foundation: [execution model](https://docs.python.org/3.14/reference/executionmodel.html) and [`sys.getrecursionlimit`](https://docs.python.org/3.14/library/sys.html#sys.getrecursionlimit) | Python code blocks, execution frames, name binding, scope vocabulary, and the interpreter recursion-limit boundary. These are the normative references when M2 makes a Python-language or standard-library claim. | Accessed 2026-08-02. Link and paraphrase. See the [Python license page](https://docs.python.org/3.14/license.html) before any exact reuse; Atlas ships original examples. |
| **U01** | MIT OpenCourseWare: [6.042J Mathematics for Computer Science syllabus](https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/pages/syllabus/) | Undergraduate calibration for rigorous definitions, induction, well-founded ordering, correctness/termination reasoning, and recurrence-based growth claims. It is not authority for Python runtime behavior. | Accessed 2026-08-02. Link-only calibration; do not copy prose, exercises, figures, lecture notes, solutions, or assessment material. Recheck terms before future asset reuse. |
| **U02** | MIT OpenCourseWare: [6.006 Introduction to Algorithms](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/) | Calibration for connecting algorithmic call structure to performance measures and later recurrence analysis. It is a preview source here, not a substitute for M5's full cost treatment. | Accessed 2026-08-02. Link-only; no reuse permission is inferred from public access. |
| **U03** | UC Berkeley CS 61A: [Discussion 3](https://cs61a.org/disc/disc03/) | Optional explain-first recursion practice after the Atlas trace and proof attempt. The page is a rolling Summer 2026 teaching surface, not a frozen course authority. | Accessed 2026-08-02. Link-only, optional, and recheckable; do not copy questions or solutions into Atlas. |
| **C01** | Composing Programs: [Recursive Functions](https://www.composingprograms.com/pages/17-recursive-functions.html) | Optional second explanation of recursive decomposition, mutual/tree recursion, and partitions after the learner has attempted the Atlas model. It is not a normative Python specification. | Accessed 2026-08-02. Link-only until licensing and exact asset scope are separately reviewed; no prose, diagrams, exercises, or code are imported. |

## Claim-to-source and session map

| Workbook location | Claim or learner artifact | Source route | Required stopping line |
| --- | --- | --- | --- |
| First-principles derivation and Sessions 1–2 | Function object/frame trace; recursive contract; base case, smaller call, and combination | `P01` for Python frame vocabulary; `C01` only as a second explanation | A trace shows the stated program on the shown input; it is not a proof of every call path, resource claim, or implementation detail. |
| Session 3 | Finite-tree domain, decreasing measure, structural-induction proof | `U01` for proof and well-foundedness calibration | A base case alone does not prove termination; the argument stops if the input violates the tree/domain assumption. |
| Session 4 | Recurrence, total calls, maximum active depth, recursion-limit boundary | `U02` for algorithmic calibration; `P01` for the interpreter-limit vocabulary | Mathematical termination and runtime feasibility are different claims. Do not infer a portable memory layout, safe recursion limit, or production suitability from a small example. |
| Session 5 | Shared default accumulator reproduction and minimal repair | Atlas original code; `P01` only for the relevant execution vocabulary | The repair's correctness still needs a contract, a regression, and stated ownership; it does not prove a general ban on mutation. |
| Session 6 / M3 handoff | Bounded agent task, review, unproven-claim question, and abstraction connection | Atlas workbook and evidence route | A proposed patch or a review conversation is not verified behavior, learner mastery, or permission to bypass M3's prerequisite route. |

## License and reuse boundary

The sources support calibration and linked further study, not source-asset
import. Source authority is intentionally separated: Python documentation owns
Python-language and standard-library terminology; MIT sources calibrate
mathematical and algorithmic breadth; Berkeley and Composing Programs provide
optional pedagogical comparison. None of them grants an Atlas learner a degree
or converts public course materials into Atlas content.

If an external asset, exact wording, exercise, figure, solution, or code is
ever proposed for reuse, pause this course workflow and separately verify the
current license, attribution, academic-integrity, and distribution terms.

## Stable learner links

Use the links in the ledger only after an Atlas attempt and with a concrete
question: Python frames and recursion limits (`P01`); induction and
well-founded reasoning (`U01`); cost models (`U02`); an optional recursion
explanation (`C01`); or optional practice (`U03`). The links are not an
undirected reading pile and may change, especially the rolling CS 61A page.

## Source-selection rationale

The source spine makes the course's reasoning visible. Official Python
documentation anchors language facts. MIT material calibrates proof and
algorithm standards without being presented as a credential. Optional sources
offer a second explanation only after the learner forms a prediction. Atlas
then owns its connected problem, visual models, code-reading tasks, and
evidence prompts.

This keeps the central question precise: *what kind of claim am I making, and
what evidence could support it?* It also protects the distinction between a
rigorous accelerated route and a formal university course.

## Release and review questions still open

- Recheck living documentation versions, URLs, and reuse terms before a later
  human review or release claim.
- Inspect every M2 learner-facing statement, visual, diagnostic, and numerical
  claim against its source role; a resolving link alone does not validate it.
- Test the actual learner experience with keyboard and screen-reader users;
  metadata and a local renderer test are not a complete accessibility review.
- Treat any TA, Study Partner, GPT Live, or Notion interaction as separate
  learner-controlled evidence. This addendum neither causes nor proves one.
- Keep an eventual M2 packet non-promoting until qualified review,
  source-commit CI, deployment evidence, and release records exist.
