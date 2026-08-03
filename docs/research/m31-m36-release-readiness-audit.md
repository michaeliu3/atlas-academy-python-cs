# M31–M36 release-readiness audit (historical 2026-08-01)

> **Current-state correction (2026-08-03):** This document preserves the
> pre-candidate audit as provenance. It must not be used as the current file
> inventory. Since this audit, each M31–M36 module gained a fixed hidden
> `review-candidates/mNN.v1.json` selector, a checked-in candidate workbook
> under `content/modules/`, and a candidate source ledger. They remain
> authoring-only, hidden, unreleased, and unreviewed. See the current
> [study-ready gap audit](m31-m36-study-ready-gap-audit.md) for the authoritative
> inventory and next gates.

**Scope (2026-08-01):** a read-only audit of the six hidden advanced packs,
their authoring contracts, delivery maps, companions, graph state, and
existing promotion path. This is not a content review, release approval, or
permission to change availability.

## Historical audited state (2026-08-01)

M31–M36 are consistently **`authoring-only` / hidden / unreleased** in the
canonical graph at
[`content/course/course-graph.v2.json`](../../content/course/course-graph.v2.json).
They have `sourceMap: null`, `studioId: null`, and no entries in
[`content/modules/manifest.json`](../../content/modules/manifest.json). M25
and M26 remain preview-only; nothing here creates a bypass.

Each module does have a substantial hidden authoring pack: a six-session
workbook, source/reuse research, an output-anchored delivery map, a scoped TA /
Study Partner companion, and a bounded reference fixture with focused tests.
Those are structural authoring inputs, not learner-ready or release evidence.

| Module | Hidden workbook and source research | Delivery / companion / fixture |
| --- | --- | --- |
| M31 | `content/authoring/m31_optimization_information_workbook.v1.md`; `content/source-maps/module31_optimization_information_source_map.md`; `content/source-maps/module31_optimization_information_source_audit.md` | `content/course/contracts/authoring-delivery/m31.v1.json`; `content/course/contracts/companions/m31.v1.json`; `lib/m31-optimization-authoring-model.js`; `tests/m31-optimization-authoring-model.test.mjs` |
| M32 | `content/authoring/m32_systems_languages_scientific_python_accelerators_workbook.v1.md`; `content/source-maps/module32_systems_languages_scientific_python_accelerators_source_research.md` | `content/course/contracts/authoring-delivery/m32.v1.json`; `content/course/contracts/companions/m32.v1.json`; `lib/m32-systems-evidence-fixture.js`; `tests/m32-systems-evidence-fixture.test.mjs`; non-promoting `evidence/m32.v1.json` and Git-index preflight |
| M33 | `content/authoring/m33_formal_languages_computability_complexity_workbook.v1.md`; `content/source-maps/module33_formal_languages_computability_complexity_source_research.md` | `content/course/contracts/authoring-delivery/m33.v1.json`; `content/course/contracts/companions/m33.v1.json`; `lib/m33-formal-languages-reference-model.js`; `tests/m33-formal-languages-reference-model.test.mjs`; non-promoting `evidence/m33.v1.json` and Git-index preflight |
| M34 | `content/authoring/m34_classical_ai_search_constraints_decision_workbook.v1.md`; `content/source-maps/module34_classical_ai_search_constraints_decision_source_research.md` | `content/course/contracts/authoring-delivery/m34.v1.json`; `content/course/contracts/companions/m34.v1.json`; `lib/m34-classical-ai-reference-fixture.js`; `tests/m34-classical-ai-reference-fixture.test.mjs`; non-promoting `evidence/m34.v1.json` and Git-index preflight |
| M35 | `content/authoring/m35_machine_learning_representation_workbook.v1.md`; `content/source-maps/module35_machine_learning_statistical_learning_ai_eval_source_research.md` | `content/course/contracts/authoring-delivery/m35.v1.json`; `content/course/contracts/companions/m35.v1.json`; `lib/m35-m36-signal-routing-fixture.js`; `tests/m35-m36-signal-routing-fixture.test.mjs`; non-promoting `evidence/m35.v1.json` and Git-index preflight |
| M36 | `content/authoring/m36_statistical_learning_theory_reliable_deep_learning_workbook.v1.md`; `content/source-maps/module36_statistical_learning_theory_reliable_deep_learning_source_research.md` | `content/course/contracts/authoring-delivery/m36.v1.json`; `content/course/contracts/companions/m36.v1.json`; `lib/m35-m36-signal-routing-fixture.js`; `tests/m35-m36-signal-routing-fixture.test.mjs`; non-promoting `evidence/m36.v1.json` and Git-index preflight |

The common structural records are
[`content/course/contracts/advanced-module-contracts.v1.json`](../../content/course/contracts/advanced-module-contracts.v1.json),
[`content/course/contracts/module-contract-registry.v3.json`](../../content/course/contracts/module-contract-registry.v3.json),
and
[`content/course/m31-m36-prerequisite-session-bridge.v1.json`](../../content/course/m31-m36-prerequisite-session-bridge.v1.json).
All six retained-adapter records are `authoring-only`; their instructional
criteria are only `pointer-present`, every human-review dimension is `pending`,
and release evidence is `planned` with no release record.

## Actual gaps and non-gaps

- **Missing at this audit date for a reviewed private-learning pack:** no M31–M36
  `content/course/contracts/review-candidates/<module>.v1.json` selector or
  `content/course/contracts/reviews/<module>.v1.json` approval record exists.
  M31 and M32 each have a non-promoting authoring evidence record and
  Git-index preflight:
  [`content/course/contracts/evidence/m31.v1.json`](../../content/course/contracts/evidence/m31.v1.json),
  [`content/course/contracts/evidence/m32.v1.json`](../../content/course/contracts/evidence/m32.v1.json),
  [`content/course/contracts/evidence/m33.v1.json`](../../content/course/contracts/evidence/m33.v1.json),
  [`content/course/contracts/evidence/m34.v1.json`](../../content/course/contracts/evidence/m34.v1.json),
  [`content/course/contracts/evidence/m35.v1.json`](../../content/course/contracts/evidence/m35.v1.json),
  and [`content/course/contracts/evidence/m36.v1.json`](../../content/course/contracts/evidence/m36.v1.json).
  They are not review-ready evidence.
- **Intentionally absent until portal publication:** canonical learner
  workbooks under `content/modules/`, graph source-map/studio selections,
  manifest entries, reader access, and release/provenance records. Their
  absence is currently correct, not a defect.
- **No promotion-path gap:** the existing v3 registry already implements the
  `review-ready` (hidden) and `verified` (published) states in
  [`scripts/module-contract-registry.mjs`](../../scripts/module-contract-registry.mjs).
  The existing
  [`scripts/hidden-review-candidate.mjs`](../../scripts/hidden-review-candidate.mjs)
  and review/evidence schemas are the right seams; do not create another
  registry or delivery-map format.
- **Historical-audit boundary:**
  [`docs/M31_M36_PUBLICATION_READINESS_AUDIT.v1.json`](../M31_M36_PUBLICATION_READINESS_AUDIT.v1.json)
  is explicitly a 2026-07-30 / `a89fcae…` negative snapshot. Preserve it as
  provenance; it cannot describe the newer M32–M36 packs or prove current
  readiness.

| Priority | Finding | Evidence / impact | Confidence / next step |
| --- | --- | --- | --- |
| Watch | The packs are not yet reviewed private learning material. | At this audit date, no candidate selectors, review records, or promotion-ready evidence packages existed; a chat could consult a draft but could not honestly call it reviewed. | High. Complete the existing hidden `review-ready` workflow. |
| Critical for portal publication | No advanced module can truthfully be published now. | The graph/manifest/release evidence deliberately withhold every M31–M36 learner route. | High. Complete the existing `verified` workflow only after review-ready evidence. |
| Info | The older readiness audit is not current-state proof. | It is pinned to its recorded historical commit and is preserved as provenance. | High. Retain it; use this note and future reviewed evidence for present state. |

## Lean route forward

1. **Prepare one reviewed hidden candidate per module, in the existing three
   authoring cohorts (M31–32, M33–34, M35–36).** Reconcile the workbook and
   source ledger against the relevant official course calibration, then create
   the existing candidate selector, full evidence record, and human review
   record. Reuse the current delivery map, companion, and fixture where the
   review confirms they are adequate; add only a real correction or missing
   learning artifact.
2. **Use `review-ready` as the private guided-learning target.** Mark a module
   review-ready in the existing v3 registry only after its criteria and eight
   human-review dimensions are approved. It remains graph-hidden, absent from
   the manifest, and outside the portal reader, but the designated Teaching
   Assistant and Study Partner can use its frozen workbook, companion, and
   dossier/oral protocol as a reviewed private study pack. This grants neither
   Core credit nor a learner-visible release.
3. **Publish only through the existing `verified` transition.** Keep the
   reviewed candidate byte-for-byte fixed, then select that same workbook in
   `content/modules/` and the manifest, assign the reviewed source map/studio
   in the graph, require `learner-material-ready` / full / published /
   deployed-recorded state, and bind exact Git commit, CI, private deployment,
   source review, limitations, and changelog/provenance evidence. Release in
   route order M31 → M32 → M33 → M34 → M35 → M36; only then rework M25 and
   M26. Use normal additive GitHub commits and pushes.

## Audit checks and boundaries

- Passed direct structural validation of the advanced authoring contract via
  `scripts/advanced-module-contract.mjs` and all M31–M36 companions via
  `scripts/module-learning-companion.mjs` on 2026-08-01.
- The broader `scripts/validate-course.mjs --require-git-tracked` was not used
  as current proof because the worktree contained uncommitted changes to
  `docs/COURSE_COMPLETION_SNAPSHOT.md`; its Git-index snapshot correctly
  stopped with `WORKTREE_DIVERGED`. This is an audit-environment boundary, not
  a failure of the advanced packs.
- No browser, accessibility, Live-voice, visual equation-rendering, human
  source review, or deployment check was run here. A structural pass does not
  establish pedagogical quality, university equivalence, learner mastery,
  platform behavior, security, or release readiness.
