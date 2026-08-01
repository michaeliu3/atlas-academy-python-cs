# Academic calibration — M11–M16 source review

## Scope, method, and truth boundary

This is a targeted review of the actual Atlas materials for
[M11 — Algorithm Design Paradigms](../../content/modules/11_algorithm_design_paradigms.md),
[M12 — Modules, APIs, Types, and Dependency Direction](../../content/modules/12_modules_apis_types_dependencies.md),
[M13 — Specifications, Testing, Debugging, and Observability](../../content/modules/13_specifications_testing_debugging_observability.md),
[M14 — Software Design and Change](../../content/modules/14_software_design_and_change.md),
[M15 — Files, Serialization, Packaging, and Delivery](../../content/modules/15_files_serialization_packaging_delivery.md),
and [M16 — Relational Data and Transactions](../../content/modules/16_relational_data_transactions.md).
It also inspects the current [Arc II source map](../../content/source-maps/arc_ii_source_map.md)
and [Arc III source map](../../content/source-maps/arc_iii_source_map.md), including
their session routing, source boundaries, and deliberate deferrals.

The official university sources below were accessed on **2026-08-01**. This is a
comparison of scope, intellectual habits, and learner evidence—not a claim of
enrollment, instructor or peer feedback, contact hours, grading, credit,
certification, a degree, professional readiness, or equivalence to any cited
course. The review makes no curriculum, source-map, manifest, test, or portal
change. It records evidence and limited next-revision priorities only.

## Official calibration corpus

| Institution and official material | Calibration role in this review |
| --- | --- |
| MIT [6.006 — Introduction to Algorithms syllabus](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/pages/syllabus/) and [resource index](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/pages/resource-index/) | Undergraduate prerequisite order, mathematical modeling, data-structure/algorithm relationship, performance analysis, and lecture/recitation/problem practice for M11. |
| MIT [6.046J — Design and Analysis of Algorithms syllabus](https://ocw.mit.edu/courses/6-046j-design-and-analysis-of-algorithms-spring-2015/pages/syllabus/) and [lecture notes](https://ocw.mit.edu/courses/6-046j-design-and-analysis-of-algorithms-spring-2015/pages/lecture-notes/) | A deeper algorithm-design benchmark for divide-and-conquer, randomization, dynamic programming, greedy methods, incremental improvement, and complexity. |
| Stanford [CS 161 — Design and Analysis of Algorithms](https://web.stanford.edu/class/archive/cs/cs161/cs161.1172/) and [course schedule](https://web.stanford.edu/class/archive/cs/cs161/cs161.1182/schedule.html) | Independent confirmation that recurrence/asymptotic reasoning, divide-and-conquer, randomized methods, dynamic programming, greedy proofs, and graph applications belong to one progression. |
| UC Berkeley [CS 170 — Efficient Algorithms and Intractable Problems](https://cs170.org/) | A current rigorous route from greedy and dynamic programming into linear programming and NP-completeness; useful for setting M11's boundary rather than compressing later theory into it. |
| MIT [6.102 — Software Construction objectives](https://web.mit.edu/6.102/www/sp26/general/), [testing](https://web.mit.edu/6.102/www/sp26/classes/02-testing/), [specifications](https://web.mit.edu/6.102/www/sp26/classes/04-specifications/), [debugging](https://web.mit.edu/6.102/www/sp26/classes/13-debugging/), and [code review](https://web.mit.edu/6.102/www/sp26/classes/03-code-review/) | Interfaces, representation independence, specifications, tests, debugging, static reasoning, Git, feedback, and change-ready software across M12–M14. |
| MIT [6.005 — Software Construction reading index](https://ocw.mit.edu/courses/6-005-software-construction-spring-2016/pages/readings/) | An open sequence linking testing, review, version control, specifications, and design; it calibrates conceptual sequencing, not Python-specific mechanics. |
| Georgia Tech [CS 6300 — Software Development Process](https://omscs.gatech.edu/cs-6300-software-development-process) and [CS 6310 — Software Architecture and Design](https://omscs.gatech.edu/cs-6310-software-architecture-and-design) | Software process, quality, evolution, architecture views, components, design principles, and design review as a complementary benchmark for M12–M15. |
| Stanford [CS 45 — Software Tools](https://web.stanford.edu/class/archive/cs/cs45/cs45.1234/) | A toolchain-oriented reference for version control, build systems/DevOps, debugging, containers, and environment awareness relevant to M15's delivery boundary. |
| CMU [15-445/645 — Intro to Database Systems syllabus](https://15445.courses.cs.cmu.edu/spring2026/syllabus.html), [schedule](https://15445.courses.cs.cmu.edu/spring2026/schedule.html), and [assignment sequence](https://15445.courses.cs.cmu.edu/spring2026/assignments.html) | A rigorous data-model → indexes/execution/optimization → concurrency → recovery progression, plus a boundary between conceptual database competence and cumulative systems implementation. |
| UC Berkeley [CS 186 — Introduction to Database Systems](https://cs186berkeley.net/), [database-design notes](https://cs186berkeley.net/notes/note13/), [transactions/concurrency](https://cs186berkeley.net/notes/note11/), and [recovery](https://cs186berkeley.net/notes/note14/) | Relational design, FDs/normalization, concurrency, recovery, and an independent undergraduate database-course reference for M16. The notes describe themselves as incomplete, so their official lectures remain the course's source of truth. |

The university materials calibrate course scope and intellectual expectations.
For Python import behavior, typing, I/O, packaging, SQLite, PostgreSQL, and
PyPA semantics, the Arc III map correctly uses the owning technical
specification or official project documentation. A university course page is
not a replacement for the normative source of a version-specific mechanism.

## Material-level calibration

| Module | Evidence reviewed and calibration finding | Atlas adaptation and explicit boundary |
| --- | --- | --- |
| **M11 — algorithm design** | The six-session route moves from problem formulation and a tiny exhaustive oracle to divide/combine obligations and greedy exchange/counterexample reasoning, DP state/reconstruction, backtracking/pruning, randomized/approximation contracts, and an evidence-backed strategy defense. That matches the design-paradigm core visible in MIT 6.006/6.046J, Stanford CS161, and Berkeley CS170. The Arc II map correctly routes learner attention to a bounded DP segment rather than assigning a survey of algorithms. | Atlas makes strategy selection, an independent verifier, changed assumptions, and review of an agent's recurrence/proof obligation central. It is not a university problem-set/recitation cadence. Max flow, linear programming, reductions, NP-completeness, and university-scale proof volume remain later or optional work; M11 should not imply they are complete before M33. |
| **M12 — modules, APIs, types, and dependency direction** | The workbook explicitly separates runtime import execution, public observation, static type evidence, and dependency direction. Its import-cycle trace, compatibility card, type-evidence boundary note, client-owned port map, and architecture dossier align with MIT 6.102's interfaces, representation independence, and change-ready systems; Georgia Tech CS6310 adds an architecture/design-review benchmark. | Python import, Protocol, and entry-point material is deliberately more language-specific than MIT's TypeScript examples and is appropriately grounded in Python, typing, and PyPA sources. The module does not supply a semester of teammate review or every checker/deployment case; static acceptance remains scoped evidence, not behavioral proof. |
| **M13 — specifications, testing, debugging, and observability** | The sequence from ambiguous importer policy → declarative contract → input partitions → layered finite evidence → minimal reproduction → falsifiable hypothesis → safe observability → regression aligns directly with MIT 6.102 material. Its claim-to-test matrix, failure dossier, signal/privacy sheet, and evidence-defense memo are more substantive than a tool survey. | Atlas adds privacy-aware low-cardinality signals, independent verification, and agent-patch review. Those are useful adaptations, not claims about an institution's assessment model. Production telemetry backends, distributed tracing, systematic concurrent testing, and formal verification remain intentionally out of scope. |
| **M14 — software design and change** | The workbook derives design from change pressure, preserves stated observations before refactoring, compares decompositions, models state/failure boundaries, stages compatibility, explains the Git object graph, and reviews a bounded patch. This reflects MIT 6.102/6.005's link among specifications, review, version control, and readiness for change; Georgia Tech CS6300/6310 independently support process, evolution, architecture, and design review. | Atlas uses one coherent solo codebase and an agent-generated patch so the learner practices architecture recovery and evidence-led review. It cannot reproduce staff/peer feedback, team negotiation, integration ownership, or organization-scale legacy change. A supportive oral defense is reflection evidence, not a university code-review substitute. |
| **M15 — files, serialization, packaging, and delivery** | The workbook carries the prior contract/change argument across text/bytes, schema/migration, files, built artifacts, installed commands, and reversible release decisions. MIT software-construction sources, Georgia Tech's process framing, and Stanford CS45 support the need for lifecycle and toolchain evidence; exact Unicode, packaging, and release assertions are correctly delegated to current Python/PyPA sources in Arc III. | Atlas's durable-boundary record, clean-environment artifact inspection, migration/failure timeline, and agent release-patch review emphasize reading and verifying artifacts rather than memorizing package commands. CI/CD operations, tool-specific lock semantics, supply-chain programs, deployment infrastructure, and long-lived release ownership remain environment-specific extensions. |
| **M16 — relational data and transactions** | The module's progression—facts/FDs/keys/normalization → constraints and narrow port → result contracts → indexes and plans → transactions/schedules/retry → recovery/backup—matches CMU 15-445/645 and Berkeley CS186. Its cumulative dossier asks for schema reasoning, result contracts, plan evidence, two-connection schedules, recovery evidence, and a bounded architecture defense: strong evidence forms for an accelerated course. | Atlas intentionally uses a small Python/SQLite adapter and cross-checks it against PostgreSQL concepts rather than asking the learner to implement a storage engine, executor, or concurrency-control system in C++. CMU's cumulative BusTub projects and database-internals depth are extensions, not implied outcomes. Distributed transactions, replication, and production operations remain deferred. |

## Connected-system finding

The inspected sequence preserves one dependency chain rather than a survey:

    M11 model + strategy evidence
      → M12 policy/mechanism boundary
      → M13 specification + finite evidence
      → M14 reviewable, reversible change
      → M15 durable/releasable artifact
      → M16 shared durable state, transactions, and recovery evidence

That chain compares well with the cited institutions' topical order while
remaining intentionally different in method: Atlas weights code reading,
prediction, counterexamples, architecture recovery, and directing or reviewing
bounded agent work more heavily. In the inspected material, no contradiction
was found between the stated module scope, source-map deferrals, and this
calibration. This is not a claim that every external URL, interactive studio,
accessibility surface, or release requirement has been exhaustively audited.

## Prioritized, lean next-revision priorities

1. **P1 — preserve M11's proof-to-scope handoff.** Keep one optional,
   explicitly linked university-style proof/problem extension after the M11
   strategy defense, while routing reductions, NP-completeness, and deeper
   intractability to M33. This adds practice without compressing Berkeley CS170
   or a full algorithm course into M11.

2. **P2 — reuse one evidence thread across M12–M15.** Make existing outputs
   visibly compose into one small change record: M12 API/port card → M13
   contract and regression evidence → M14 reviewed Git change → M15 built
   artifact and rollback statement. It should reference existing outputs rather
   than create a second project or metadata system. This is the leanest response
   to the university courses' repeated practice-and-feedback model.

3. **P3 — make the M15 toolchain record term-specific and mandatory for its
   release exercise.** Preserve one compact card recording Python,
   frontend/backend, resolver or lock state, platform, artifact hashes, and
   access date for relevant PyPA specifications. That guards against rapid
   packaging-tool drift without pretending that a university or toolchain
   guarantees reproducibility.

4. **P4 — retain M16's bounded DBMS boundary in learner-facing handoffs.** Keep
   the required SQLite version/configuration, plan, schedule, and
   backup/restore evidence; offer CMU/Berkeley database internals as an optional
   next route. Do not turn the module into a partial BusTub clone or copy course
   projects.

## Reuse, academic integrity, and conclusion

The sources above are linked calibration material. Atlas should continue to
write original explanations, diagrams, cases, diagnostics, prompts, code, and
projects. Do not copy or adapt protected lecture text, slides, assignments,
solutions, autograders, staff-only material, or peer-work workflows without an
explicit license and permission check. MIT OCW identifies
[CC BY-NC-SA 4.0](https://ocw.mit.edu/pages/privacy-and-terms-of-use/) for
covered material; MIT 6.102 pages identify CC BY-SA 4.0. Preserve attribution,
license conditions, and asset-level exceptions. Berkeley CS170, CMU 15-445,
Berkeley CS186, Stanford CS45, and Georgia Tech material should be treated as
linked/cited calibration sources unless a specific asset supplies reuse terms.

This review supports a rigorous, connected M11–M16 learning route with clear
adaptations and explicit limits. It does not establish university equivalence,
credit, a degree, universal mastery, or a release-complete Atlas product.

