# Module 14 — Software Design and Change — Source-Audit Addendum

**Audit date:** 2026-08-02  
**Scope:** source roles, claim linkage, access/reuse boundaries, and
candidate-only structural evidence for the existing M14 workbook. This is an
instructor-facing audit record, not a teaching-quality approval, release
decision, credential, or permission to reuse external assets.

## Candidate boundary

M14 remains `legacy-open` for learner access, `legacy-baseline` for its
contract state, and `unrecorded` for release. This addendum supports only a
non-promoting structural candidate. It does not establish university
equivalence, learner understanding, human review, CI, deployment, publication,
oral-defense completion, GPT Live behavior, Notion activity, or mastery.

Atlas owns its pressure maps, state tables, code-reading tasks, reference
model, diagnostics, dossiers, diagrams, and prompts. External material is
linked and paraphrased only. Do not copy lectures, slides, figures,
assignments, solutions, assessments, prose, or source code into Atlas merely
because it is publicly available.

## Source and reuse ledger

| ID | Owner and stable learner-facing link | Intended claim scope | Access / reuse status |
| --- | --- | --- | --- |
| **U01** | MIT 6.102: [Abstract Data Types](https://web.mit.edu/6.102/www/sp26/classes/06-abstract-data-types/) and [Interfaces & subtyping](https://web.mit.edu/6.102/www/sp26/classes/08-interfaces-subtyping/) | Representation independence, public observations, and behavioral-subtype obligations. They do not choose an Atlas decomposition or prove a refactor preserves every operational property. | Accessed 2026-08-02. Link and paraphrase only; no course asset is imported. Recheck terms and attribution before proposed reuse. |
| **U02** | MIT 6.102: [Code review](https://web.mit.edu/6.102/www/sp26/classes/03-code-review/) and [Git 1: version control](https://web.mit.edu/6.102/www/sp26/tools/git-1-version-control/) | Evidence-led review and undergraduate Git workflow calibration. They do not make a local review policy universal or approve an Atlas patch. | Accessed 2026-08-02. Link and paraphrase only; no exercise, solution, or workflow policy is copied. |
| **P01** | Git: [Git Objects](https://git-scm.com/book/en/v2/Git-Internals-Git-Objects) and [`git bisect`](https://git-scm.com/docs/git-bisect) | Parent-linked commit objects, movable refs, and reproducible good/bad classification. They do not prove a predicate is deterministic or a local repository is a backup. | Accessed 2026-08-02. Link and paraphrase only; Git documentation owns command semantics. |
| **P02** | Google Engineering Practices: [code-review guide](https://google.github.io/eng-practices/review/) | One public organizational example for design, tests, clarity, and review discussion. It is not universal architecture law or a guarantee that defects are found. | Accessed 2026-08-02. Link and paraphrase only; keep local policy separate from portable reasoning. |
| **U03** | Georgia Tech: [CS 6300 — Software Development Process](https://omscs.gatech.edu/cs-6300-software-development-process) | Independent course-level calibration for quality, evolution, and process. It does not reproduce a team course, its assignments, or its assessment standard. | Accessed 2026-08-02. Link and paraphrase only; recheck course terms before any reuse. |

## Claim linkage and stopping lines

| Workbook location | Claim or learner artifact | Source route | Required stopping line |
| --- | --- | --- | --- |
| Sessions 1–2: pressure, observations, decomposition | Preservation ledger, responsibility table, change-axis comparison, rejected alternative | `U01` | A representation-independent interface does not by itself select an owner or prove every observed behavior is preserved. |
| Session 3: state, retry, and failure | Transition table, behavioral-subtype counterexample, retry atomicity/cost boundary | `U01`; Atlas-original traces | A valid subtype pattern or a passing trace does not establish repeatability, idempotency, or universal retry safety. |
| Sessions 4–5: staged change and review | Commit storyboard, compatibility window, review findings, bisect predicate | `U02`, `P01`, `P02` | A Git graph or green test does not prove semantic equivalence, review quality, remote backup, or a reliable good/bad classifier. |
| Session 6: design defense and M15 handoff | Change-and-rollback card, residual uncertainty, durable-boundary question | `U01`–`U03`; Atlas-original dossier | A source link, agent explanation, or oral conversation is not independent review, release approval, or mastery evidence. |

## License and reuse boundary

MIT and Georgia Tech sources calibrate course-level software-construction
concepts; Git owns Git semantics; Google describes one organization’s review
practice. None grants a credential, makes Atlas equivalent to an institutional
course, or turns external assets into Atlas content.

If anyone proposes exact wording, a figure, an exercise, a solution, a video,
or source code for reuse, pause and separately verify current license,
attribution, academic-integrity, and distribution terms. Public availability is
not reuse approval.

## Stable learner links

Open one link only after an Atlas attempt and with one question: public
observation/representation (`U01`), evidence-led review (`U02`/`P02`),
commit/reference model or bisect predicate (`P01`), or course-level process
calibration (`U03`). These links are not an answer key or permission to bypass
M13 or M15.

## Visual and text-alternative review boundary

M14’s Mermaid blocks carry local ID, title, and concise text-alternative
metadata for the shared reader. That resolves a structural reader input only;
it does not establish semantic rendering, keyboard behavior, screen-reader
experience, cognitive load, or learner comprehension.

## Release and review questions still open

- Recheck living URLs, access dates, and reuse terms before later human review
  or any release claim.
- Inspect every design, Git, review, visual, diagnostic, and source statement;
  a resolved link is not a correctness or teaching-quality approval.
- Test real keyboard, screen-reader, browser, and chat-whiteboard experience.
- Treat TA, Study Partner, GPT Live, and Notion behavior as separate
  learner-controlled evidence.
- Keep this candidate non-promoting until qualified review, a reviewed source
  commit, source-commit CI, deployment evidence, and release records exist.
