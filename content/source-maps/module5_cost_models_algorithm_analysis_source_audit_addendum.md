# Module 5 — Cost Models and Algorithm Analysis — Source-Audit Addendum

**Audit date:** 2026-08-02  
**Scope:** source roles, claim linkage, access/reuse boundaries, and the
candidate-only structural evidence for the existing M5 workbook. This is an
instructor-facing audit record, not a learner textbook, quality approval,
release decision, or authorization to reuse external assets.

## Candidate boundary

M5 remains `legacy-open` for learner access, `legacy-baseline` for its
contract state, and `unrecorded` for release. This addendum may be referenced
by a non-promoting structural candidate, but it proves only that declared
local source pointers can resolve together. It does not approve the workbook,
establish university equivalence, verify learner understanding, or create CI,
deployment, publication, oral-defense, GPT Live, Notion, or mastery evidence.

Atlas owns its deduplication narrative, traces, diagrams, code-reading tasks,
diagnostics, experiments, dossiers, and prompts. External material is linked
and paraphrased only. Do not copy lectures, slides, figures, assignments,
solutions, assessments, or source code into Atlas merely because they are
publicly available.

## Source and reuse ledger

| ID | Owner and stable learner-facing link | Intended claim scope | Access / reuse status |
| --- | --- | --- | --- |
| **P01** | Python Software Foundation: [`timeit` documentation](https://docs.python.org/3.14/library/timeit.html) | Official vocabulary and bounded guidance for timing small Python snippets, repeated runs, setup boundaries, and timing caveats. It is not authority for an asymptotic proof or a production benchmark design. | Accessed 2026-08-02. Link and paraphrase only; consult the [Python license](https://docs.python.org/3.14/license.html) before any exact reuse. Atlas ships original examples and instructions. |
| **P02** | Python Software Foundation: [`time.perf_counter`](https://docs.python.org/3.14/library/time.html#time.perf_counter) | Reference for the high-resolution performance-counter terminology used by the small teaching harness. It does not promise comparable measurements across machines, workloads, or runtimes. | Accessed 2026-08-02. Link and paraphrase only; no source code, prose, or figures are imported. Recheck terms before future asset reuse. |
| **P03** | Python Wiki: [Time Complexity](https://wiki.python.org/moin/TimeComplexity) | Implementation-oriented context for common container-operation assumptions. It is CPython-oriented context, not a language-wide performance guarantee or substitute for a named workload. | Accessed 2026-08-02. Link-only until exact terms and a proposed reuse scope are separately reviewed; no table, prose, or example is copied. |
| **U01** | MIT OpenCourseWare: [6.006 Introduction to Algorithms syllabus](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/pages/syllabus/) | Undergraduate calibration for mathematical modeling of computational problems, elementary data structures, algorithms, performance measures, and analysis techniques. It calibrates breadth; it does not certify that Atlas is an MIT course. | Accessed 2026-08-02. Link-only calibration; do not copy course prose, lecture notes, videos, figures, exercises, solutions, or assessments. Recheck terms before any future asset reuse. |
| **U02** | MIT OpenCourseWare: [6.042J Mathematics for Computer Science syllabus](https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/pages/syllabus/) | Undergraduate calibration for definitions, proofs, counting, probability, and deriving closed-form or asymptotic expressions from series and recurrences. It does not validate every Atlas derivation or learner explanation. | Accessed 2026-08-02. Link-only calibration; no public availability implies permission to copy course content. Recheck terms before any future asset reuse. |

## Claim linkage and stopping lines

| Workbook location | Claim or learner artifact | Source route | Required stopping line |
| --- | --- | --- | --- |
| First-principles derivation; Sessions 1–2 | Input family, counted resource, primitive-operation model, exact count, `O`/`Omega`/`Theta` distinction, case and assumption | `U01` for algorithm-analysis calibration; `U02` for quantified definitions, proof habits, and recurrence/asymptotic foundation | A familiar label, one loop, or one successful run does not establish a bound. The claim needs a stated model and appropriate derivation. |
| Sessions 3–4 | Recurrence, base condition, recursion tree, aggregate amortized account, output/auxiliary/stack/retained-space separation | `U01`/`U02` as calibration | A recursion tree or aggregate account applies only to the stated recurrence, base cases, representation, and operation assumptions. It does not predict wall-clock time. |
| Session 5; prediction and numerical-experiment anchors | Repeated timing, timing boundary, raw samples, ratios, environment, uncertainty, model–measurement mismatch | `P01`/`P02`; `P03` only for CPython-oriented context | A finite timing run is an observation of one implementation, machine, runtime, input family, and measurement method. It cannot prove an asymptotic theorem or portability guarantee. |
| Session 6; code-reading/debugging/design anchors | Hidden list membership, representation trade-off, semantic equivalence, adapter boundary, reviewed generated benchmark claim | Atlas original code and prompts; `P03` only for qualified implementation context; `U01` for broader algorithm framing | A faster implementation, chart, or generated explanation is not an optimization unless public semantics, workload, and cost assumptions remain explicit. Adapter/I/O costs require separate systems evidence. |
| M27 handoff | Cost card carrying an input model, bound idea, evidence boundary, confidence, and uncertainty | `U02`/`U01` as rigorous calibration | M27 is the only canonical forward handoff. This M5 packet neither establishes readiness nor authorizes bypass of M27 or later prerequisites. |

## License and reuse boundary

The source roles stay deliberately separate. Python documentation supplies
language and timing vocabulary. The Python Wiki supplies implementation context
with a narrower guarantee boundary. MIT sources calibrate rigorous undergraduate
algorithm and discrete-mathematics scope. None grants a credential, turns
external assets into Atlas content, or establishes that a compressed route
equals a degree program.

If an external asset, exact wording, exercise, figure, solution, or code is
ever proposed for reuse, pause this workflow and separately verify the current
license, attribution, academic-integrity, and distribution terms.

## Stable learner links

Use a ledger link only after an Atlas attempt and with a concrete question:
analysis breadth and performance-model framing (`U01`); definitions, proofs,
counting, recurrences, and asymptotics (`U02`); timing setup and repeated-run
limits (`P01`/`P02`); or CPython-oriented container-operation context (`P03`).
They are not an undirected reading pile or an answer key for the Atlas dossier.

## Source-selection rationale

The source spine supports first-principles learning without disguising
calibration as equivalence. Official Python sources bound implementation-facing
timing language; MIT sources set a rigorous undergraduate reference for
mathematical modeling and proof-aware analysis; Atlas owns the readable
deduplication problem, visual models, code-reading prompts, and evidence
workflow. The learner can therefore ask: *what is counted, under which model,
and what observation could challenge it?*

## Release and review questions still open

- Recheck living documentation versions, URLs, and reuse terms before a later
  human review or release claim.
- Inspect every M5 learner-facing mathematical and Python-performance claim,
  visual, diagnostic, and numerical example against its source role; resolving
  links alone does not validate the statement.
- Test actual keyboard, screen-reader, browser, and whiteboard experience;
  metadata and a local renderer test are not a complete accessibility review.
- Treat any TA, Study Partner, GPT Live, or Notion interaction as separate
  learner-controlled evidence. This addendum neither causes nor proves one.
- Keep an eventual M5 packet non-promoting until qualified review,
  source-commit CI, deployment evidence, and release records exist.
