# Module 3 — Abstraction, Interfaces, and Abstract Data Types — Source-Audit Addendum

**Audit date:** 2026-08-02  
**Scope:** source roles, claim linkage, access/reuse boundaries, and the
candidate-only structural evidence for the existing M3 workbook. This is an
instructor-facing audit record, not a learner textbook, quality approval,
release decision, or permission to reuse external teaching material.

## Candidate boundary

M3 remains `legacy-open` for learner access, `legacy-baseline` for its
contract state, and `unrecorded` for release. This addendum may be bound by a
non-promoting structural candidate, which proves only that declared local
source pointers resolve together. It does not approve the workbook, establish
university-equivalent learning, verify learner understanding, or create CI,
deployment, publication, oral-defense, GPT Live, Notion, or mastery evidence.

The Atlas EventStore story, code, diagrams, diagnostic distractors, exercises,
agent-review prompts, and evidence artifacts are original course material.
Use the external material below through links and paraphrased calibration; do
not copy lectures, slides, figures, exercises, solutions, assessments, or
source code merely because they are publicly reachable.

## Source and reuse ledger

| ID | Owner and stable learner-facing link | Intended claim scope | Access / reuse status |
| --- | --- | --- | --- |
| **P01** | Python Software Foundation: [data model](https://docs.python.org/3.14/reference/datamodel.html), [`typing.Protocol`](https://docs.python.org/3.14/library/typing.html#typing.Protocol), and [`abc`](https://docs.python.org/3.14/library/abc.html) | Python object/type language, the documented `Protocol` and `@runtime_checkable` boundary, and abstract-base-class machinery. These are the normative sources when M3 makes a Python-library claim. | Accessed 2026-08-02. Link and paraphrase. The [Python license page](https://docs.python.org/3.14/license.html) identifies PSF License Version 2 and the additional 0BSD treatment for documentation examples/recipes/code from Python 3.8.6 onward. Atlas uses original examples; any exact reuse needs notice and separate review. |
| **P02** | Python typing specification: [Protocols](https://typing.python.org/en/latest/spec/protocol.html) and [PEP 544](https://peps.python.org/pep-0544/) | Static structural-subtyping rules and rationale used to distinguish a method surface from a behavioral ADT law. They do not prove a particular implementation satisfies its contracts. | Accessed 2026-08-02. Link-only technical reference; no text, examples, or assessments are imported. Treat a future checker/runtime/version choice as its own implementation decision. |
| **U01** | MIT 6.102 Software Construction: [Abstract Data Types](https://web.mit.edu/6.102/www/sp26/classes/06-abstract-data-types/) | Pedagogical calibration for operation-based ADTs, creator/producer/observer/mutator vocabulary, simple/adequate/coherent operations, representation independence, and observer-focused tests. | Accessed 2026-08-02. Link-only calibration; the course uses TypeScript, so Atlas makes no claim that its code or static-checking consequences transfer unchanged to Python. Do not reuse MIT prose, figures, exercises, or solutions. |
| **U02** | MIT 6.102 Software Construction: [Abstraction Functions & Rep Invariants](https://web.mit.edu/6.102/www/sp26/classes/07-abstraction-functions-rep-invariants/) | AF, RI, representation exposure, `checkRep`, preservation obligations, and benevolent representation changes. | Accessed 2026-08-02. Link and paraphrase only. Atlas's EventStore, list/tuple/chunk comparison, diagrams, and debugging examples are original; no reuse permission is inferred from public access. |
| **U03** | MIT 6.102 Software Construction: [Defining ADTs with Interfaces](https://web.mit.edu/6.102/www/sp26/classes/08-interfaces-subtyping/) | Calibration for separating an interface from behavioral substitutability. Atlas translates the conceptual boundary into Python, rather than importing TypeScript syntax or exercises. | Accessed 2026-08-02. Link-only; no course assets, assessment framing, or claims of course equivalence are imported. |
| **C01** | Composing Programs: [Data Abstraction](https://www.composingprograms.com/pages/22-data-abstraction.html) | Optional second explanation of abstraction barriers after the learner has attempted the Atlas representation-exposure trace. It is not authority for Python's typing or runtime behavior. | Accessed 2026-08-02. Link-only until licensing and exact asset scope are separately reviewed; no prose, diagrams, exercises, or code are imported. |

## Claim linkage and stopping lines

| Workbook location | Claim or learner artifact | Source route | Required stopping line |
| --- | --- | --- | --- |
| First-principles derivation, vocabulary, and Sessions 1–2 | abstract values, operation contracts/laws, operation classification, representation independence | `U01`; `C01` only as optional second explanation | An ADT is described by the specified observations; the Atlas EventStore is an illustrative original design, not an MIT exercise or a complete interface-design theory. |
| Sessions 1 and 3 | representation-exposure trace, AF, RI, proof obligations, and safe snapshot argument | `U02`; `P01` for Python object/model terms | AF/RI are reasoning tools. A diagram, `_check_rep()`, frozen dataclass, tuple, or a few examples does not prove deep ownership, security, or all implementation states. |
| Session 4 and diagnostic questions | `Protocol`, `@runtime_checkable`, ABC, special methods, and right-shape/wrong-law trace | `P01`; `P02` for static protocol framing | Structural compatibility and runtime attribute checks do not prove ordering, snapshot, failure, or temporal laws. Type annotations are not ordinary Python runtime enforcement. |
| Session 5 | architecture recovery, cached derived-state failure, minimal regression | Atlas original studio plus `U02` vocabulary | The Atlas service/store diagram is a teaching model. It does not claim persistence, transaction, concurrency, security, or production-cache correctness. |
| Session 6 and milestone | bounded agent specification, patch review, evidence rubric, oral discussion | Atlas original process; `U01`/`U02` only for vocabulary calibration | A plausible generated patch or confident explanation is not evidence. The workbook does not prove that a live chat, TA session, Notion note, CI run, or portfolio review occurred. |
| Numerical experiment and forward connections | list/tuple cost contrast and later database/network/concurrency/security connections | Atlas cost model and conceptual route; later modules own their technical sources | The \(n=1{,}000\) calculation is not a benchmark or a Python-runtime promise. M3 does not supply later modules' atomicity, durability, serialization, retry, or authority rules. |

## Source-selection rationale

The source spine keeps roles separate. MIT 6.102 calibrates the conceptual
sequence from contracts to ADTs, AF/RI, and interface-based substitution.
Official Python documentation and the typing specification own the claims
about Python mechanisms. The optional conceptual text provides a second
explanation only after learner prediction. Atlas owns the code, diagrams,
questions, activity design, and all claims about its own learning workflow.

This division makes the pedagogical standard inspectable without treating a
linked university course as a credential, reuse license, or proof that a
60-day route is equivalent to a degree program.

## Release and review questions still open

- Recheck living Python documentation, typing-specification versions, MIT URLs,
  and reuse terms before a later human review or release claim.
- Inspect every M3 claim, visual, diagnostic explanation, cost statement, and
  source link against its stated source role; link resolution is not a quality
  review.
- Test the actual learner route with keyboard and screen-reader users; Mermaid
  metadata and a local renderer test are not a complete accessibility review.
- Treat any TA, Study Partner, GPT Live, or Notion interaction as separate,
  learner-controlled evidence. This addendum neither causes nor proves one.
- Keep any M3 packet non-promoting until qualified review, source-commit CI,
  deployment evidence, and release records exist.
