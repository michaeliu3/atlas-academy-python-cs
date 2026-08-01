# M11–M16 legacy remediation source brief

**Method.** Re-read the current M11–M16 workbooks, Arc II/III source maps, and
the existing [M11–M16 calibration review](academic-calibration-m11-m16-source-review.md)
on **2026-08-01**. The packs already contain connected sessions, prediction,
code/design review, diagnostics, retrieval, projects, oral guides, and source
boundaries. The genuine gap is not six missing topic surveys: it is one
explicit learner-evidence chain across the durable-software arc, plus one
small M11 proof-to-scope extension.

| Module | Actual high-value gap | Official calibration relevance | Smallest remediation |
| --- | --- | --- | --- |
| **M11 — Algorithm Design Paradigms** | The workbook teaches proofs and has a rich source route, but it has no named optional proof/counterexample extension that deliberately hands deeper complexity limits to M33. The existing review's P1 correctly identifies this boundary. | MIT [6.046J](https://ocw.mit.edu/courses/6-046j-design-and-analysis-of-algorithms-spring-2015/pages/syllabus/) explicitly expects rigorous correctness proofs, asymptotic analysis, and design-paradigm selection; it is a calibration standard, not an assignment to copy. | Add one 20-minute original extension after the strategy defense: state the model, prove a recurrence/greedy condition *or* give the smallest counterexample, state the cost claim, then label reductions/NP-completeness as M33 territory. |
| **M12 — Modules, APIs, Types, and Dependency Direction** | Its architecture dossier and forward prose make the API/port boundary clear, but the exact API law/dependency arrow to preserve is not named as an input to M13's contract dossier. The evidence chain is implicit. | MIT [6.102 objectives](https://web.mit.edu/6.102/www/sp26/general/) connect interfaces, representation independence, specifications, testing, and multi-module systems. | At the existing architecture-dossier/TA-handoff location, add a 2–3 line **carry-forward boundary card**: public observation, behavioral law, dependency arrow, and unresolved risk that M13 must test. |
| **M13 — Specifications, Testing, Debugging, and Observability** | The evidence-defense disposition memo forwards to M14, but it does not explicitly preserve the M12 boundary card alongside the chosen claim, regression, and evidence limit. | MIT [6.102 testing](https://web.mit.edu/6.102/www/sp26/classes/02-testing/) and [debugging](https://web.mit.edu/6.102/www/sp26/classes/13-debugging/) calibrate the specification → finite evidence → investigation loop. | Add one line to the existing TA/Study-Partner handoff: attach the M12 boundary card and name the M13 contract clause, regression, missing observation, and nonclaim that M14 must preserve. |
| **M14 — Software Design and Change** | The module produces an excellent change packet and M15 handoff, but it does not name which M13 regression/observation and M12 public promise travel with the staged change. A learner can describe a clean refactor without its evidence ancestry. | MIT [6.102 code review](https://web.mit.edu/6.102/www/sp26/classes/03-code-review/) and Georgia Tech [CS 6310](https://omscs.gatech.edu/cs-6310-software-architecture-and-design) both calibrate architecture/design review as evidence-led, not pattern-name-led. | Add a compact **change-and-rollback card** beside the existing handoff: preserved public promise, linked M13 regression, commit/reversal condition, and M15 durability question. |
| **M15 — Files, Serialization, Packaging, and Delivery** | The release packet is detailed, but it does not visibly assemble the M12 boundary, M13 regression, and M14 change decision into the local artifact/release receipt. The release can otherwise read as a packaging-only exercise. | Stanford [CS 45](https://web.stanford.edu/class/cs45/) calibrates tool, version-control, build, and debugging practice; PyPA's [packaging flow](https://packaging.python.org/en/latest/flow/) confirms the source-to-artifact-to-environment sequence. | In the existing evidence tree, add one short **artifact/release receipt** template that points to the earlier boundary, regression, change/ref, digest, clean-install result, rollback limit, and M16 handoff. |
| **M16 — Relational Data and Transactions** | Its project consumes the M15 bundle and is strong on engine/configuration evidence, but the dossier does not require a first-page upstream chain from boundary → claim/evidence → change → artifact → transaction. That makes the connected-system philosophy less visible at the capstone of this arc. | CMU [15-445/645](https://15445.courses.cs.cmu.edu/spring2026/assignments.html) sequences SQL, indexes, execution, transactions, and recovery as connected systems work. Atlas remains a bounded Python/SQLite learning model, not a BusTub replacement. | Add a first-page **upstream evidence chain** to the existing reconciliation dossier, with links or labels for the four prior artifacts and a statement of the named engine/configuration boundary. Do not add a required PostgreSQL server lab. |

## Freshness and scope decision

- The M12 workbook's university ledger still links the Spring 2025 MIT 6.102
  archive while the Arc III map and current calibration use Spring 2026. Refresh
  that link (or label the older one as an archive); it is a source-freshness
  correction, not a changed teaching claim.
- M13–M16 have no defensible missing core-topic hole from this review. Their
  remaining evidence gap is human enactment: a learner should carry the five
  small cards through one real guided route and have the TA challenge the chain.
  Do not manufacture new labs, metadata, or theory sections to simulate that.
- No workbook rewrite, registry, contract, dashboard, or new test layer is
  justified. These are six tiny content/handoff inserts in existing locations;
  a later learner pilot should review their clarity before any lifecycle claim.

## Source and reuse boundary

The cited pages are official, first-party calibration sources rechecked on
**2026-08-01**. Link and briefly paraphrase only. Keep all Atlas diagrams,
examples, tasks, code, diagnostics, and handoff cards original; do not copy
course prose, slides, assignments, solutions, autograders, or review workflows.
The comparison supports rigorous topic and evidence expectations where the
learner completes artifacts. It does not establish enrollment, staff feedback,
grading, credit, certification, degree status, or university-equivalent
outcomes.

## Implementation record

On **2026-08-01**, the reviewed lean remediation was applied to the workbooks:
M11 gained an optional original model/proof/counterexample boundary that routes
formal hardness questions to M33; M12's MIT links were refreshed to the Spring
2026 source set and its existing dossier gained a boundary card; M13–M16 gained
one connected handoff trail using existing artifacts. No registry, dashboard,
new project, release, learner-route promotion, university-equivalence, or
learner-mastery claim was created by this content batch.
