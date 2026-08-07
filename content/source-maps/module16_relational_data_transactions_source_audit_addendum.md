# Module 16 — Relational Data and Transactions — Source-Audit Addendum

**Audit date:** 2026-08-02  
**Scope:** source roles, claim linkage, access/reuse boundaries, and
candidate-only structural evidence for the existing M16 workbook. This is an
instructor-facing audit record, not a database-certification, release decision,
or permission to reuse external assets.

## Candidate boundary

M16 remains `legacy-open` for learner access, `legacy-baseline` for its
contract state, and `unrecorded` for release. This addendum supports only a
non-promoting structural candidate. It does not establish a live database run,
engine configuration, source-commit CI, deployment, publication, oral-defense
completion, GPT Live behavior, Notion activity, or learner mastery.

Atlas owns its relations, schema, schedules, code, diagrams, diagnostics,
experiments, dossiers, and prompts. External material is linked and
paraphrased only. Do not copy lectures, slides, figures, assignments, solutions,
assessments, prose, or source code merely because it is public.

## Source and reuse ledger

| ID | Owner and stable learner-facing link | Intended claim scope | Access / reuse status |
| --- | --- | --- | --- |
| **U01** | CMU 15-445/645: [Spring 2026 schedule](https://15445.courses.cs.cmu.edu/spring2026/schedule.html) and archived [Fall 2025 syllabus](https://15445.courses.cs.cmu.edu/fall2025/syllabus.html) | Course-level relational → storage → indexes → execution → transactions → recovery sequence and rigor calibration. The archived syllabus is not a current-course claim. | Accessed 2026-08-02. Link and paraphrase only; do not reproduce or undertake protected project/solution material. |
| **U02** | Berkeley CS 186: [Database Design](https://cs186berkeley.net/notes/note13/), [Query Optimization](https://cs186berkeley.net/notes/note10/), [Transactions & Concurrency](https://cs186berkeley.net/notes/note11/), and [Recovery](https://cs186berkeley.net/notes/note14/) | FDs, normalization, plan vocabulary, schedules, and recovery concepts. They do not specify SQLite or PostgreSQL product behavior. | Accessed 2026-08-02. Link and paraphrase only; course notes are calibration, not copied Atlas content. |
| **P01** | Python 3.14: [`sqlite3`](https://docs.python.org/3.14/library/sqlite3.html) | DB-API wrapper, connection/cursor/binding behavior, and documented transaction-control vocabulary. It does not identify the linked SQLite library or choose an application transaction boundary. | Accessed 2026-08-02. Link and paraphrase only; recheck the [Python license](https://docs.python.org/3/license.html) before exact reuse. |
| **P02** | SQLite: [Isolation](https://www.sqlite.org/isolation.html), [transactions](https://www.sqlite.org/lang_transaction.html), [WAL](https://www.sqlite.org/wal.html), and [`EXPLAIN QUERY PLAN`](https://www.sqlite.org/eqp.html) | Engine-specific reader/writer, journal, snapshot, and plan-interface claims. They do not transfer to PostgreSQL or a different SQLite build/configuration. | Accessed 2026-08-02. Link and paraphrase only; record exact linked version/configuration for an experiment. |
| **P03** | PostgreSQL 18: [constraints](https://www.postgresql.org/docs/18/ddl-constraints.html), [`EXPLAIN`](https://www.postgresql.org/docs/18/using-explain.html), [transaction isolation](https://www.postgresql.org/docs/18/transaction-iso.html), and [WAL introduction](https://www.postgresql.org/docs/18/wal-intro.html) | Product-specific constraint, plan, isolation, and recovery contrast. They do not establish equivalent SQLite behavior. | Accessed 2026-08-02. Link and paraphrase only; keep engine/version/configuration boundaries visible. |

## Claim linkage and stopping lines

| Workbook location | Claim or learner artifact | Source route | Required stopping line |
| --- | --- | --- | --- |
| Sessions 1–2: relation and port | Fact ownership, FDs/keys, lossless reasoning, constraints, repository boundary | `U01`, `U02`, `P01`, `P03` | A sample schema or legal DDL does not prove a relation is normalized for every pressure or that configuration-dependent constraints are enabled. |
| Sessions 3–4: query and plan | Result-contract cards, binding/allowlist distinction, plan prediction and keep/remove index decision | `U01`, `U02`, `P02`, `P03` | SQL text, an index, or a single plan output does not prove order, exact cost, stable selection, or cross-engine behavior. |
| Sessions 5–6: transaction and recovery | Two-connection schedule, retry/reconciliation record, interruption timeline, independent restore transcript | `U01`, `U02`, `P01`–`P03` | A local exception, commit, WAL, or copied file does not by itself prove isolation, durable recovery, backup, replicated safety, or an authorized retry. |
| Guided M16 defense and M17 handoff | Invariant/schedule/engine-limit defense and execution-layer question | Atlas-original dossier; `U01`–`U02` for calibration | A source link, agent explanation, or oral conversation is not a live engine test, human review, release approval, or mastery evidence. |

## License and reuse boundary

CMU and Berkeley calibrate rigorous database theory/sequence; Python, SQLite,
and PostgreSQL own their documented product claims. None grants a credential,
makes Atlas equivalent to an institutional course, or turns external assets into
Atlas content.

If anyone proposes exact wording, a figure, an exercise, a solution, a video,
or source code for reuse, pause and separately verify current license,
attribution, academic-integrity, and distribution terms. Public availability is
not reuse approval.

## Stable learner links

Open one link only after an Atlas attempt: sequence/theory calibration (`U01`/
`U02`), Python wrapper (`P01`), SQLite-specific observed mechanism (`P02`), or
PostgreSQL comparison (`P03`). These links are not an answer key or permission
to bypass M15 or M17.

## Visual and text-alternative review boundary

M16’s Mermaid blocks carry local ID, title, and concise text-alternative
metadata for the shared reader. That resolves a structural reader input only;
it does not establish semantic rendering, keyboard behavior, screen-reader
experience, cognitive load, a live database run, or learner comprehension.

## Release and review questions still open

- Recheck living engine docs, archived/current-course status, URLs, versions,
  and reuse terms before later human review or any release claim.
- Record OS, Python, linked SQLite, connection options, schema/data/statistics,
  and engine version before drawing plan/isolation conclusions.
- Test browser/accessibility and real chat-whiteboard behavior separately.
- Treat TA, Study Partner, GPT Live, and Notion behavior as separate
  learner-controlled evidence.
- Keep this candidate non-promoting until qualified review, a reviewed source
  commit, source-commit CI, deployment evidence, and release records exist.
