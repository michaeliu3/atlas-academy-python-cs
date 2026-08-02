# Atlas course completion snapshot

> **Updated 2026-08-02.** This is the concise status record for the active
> course-authoring goal. It separates usable learning material from portal
> access, release evidence, and learner mastery. The detailed
> [goal-compliance matrix](GOAL_COMPLIANCE_MATRIX.md) remains the historical
> release-hardening record; it is not the best summary of current learning
> progress.

| Goal area | Current evidence | Status and honest boundary |
| --- | --- | --- |
| Connected knowledge system and canonical route | `course-graph.v2.json` separates academic prerequisites, navigation, availability, and release state; M25/M26 remain preview-gated after M31–M36. The [current route truth audit](research/current-route-truth-audit.md) confirms that the course library is arc/reference browsing while `/route` is the prerequisite-first sequence. | Implemented for the portal; recheck the route whenever availability changes. |
| M1–M30 learner materials | Thirty legacy workbooks provide six-session spines, sources, diagnostics, projects, and connected forward links. The M1–M5 gateway now exposes compact official-source calibration cards and a source-to-artifact route; earlier work added direct TA/Study Partner handoffs to the older operational gaps and made M4/M5 diagnostic explanations prediction-gated. | Usable study material; legacy release-contract review is intentionally separate and incomplete. |
| M31–M36 advanced extension | Six private authoring workbooks exist under `content/authoring/`, each with connected sessions, sources, diagnostics, project/dossier, oral-defense, TA/Study Partner, and forward-handoff material. The focused official-source reviews for [M31–M32](research/m31-m32-focused-candidate-review.md), [M33–M34](research/m33-m34-focused-candidate-review.md), and [M35–M36](research/m35-m36-focused-candidate-review.md) applied bounded reasoning/evaluation refinements. The current [M31–M32](research/m31-m32-official-calibration-2026-08-01.md), [M33–M34](research/m33-m34-official-calibration-2026-08-01.md), and [M35–M36](research/m35-m36-official-calibration-2026-08-01.md) passes then made only four learner-impacting repairs: M32’s backend/version-reading clarity, an M33 CFG witness, an M35 model-family boundary map, and current CMU links. The 2026-08-02 follow-ups additionally preserve M34's one-shot/sequential decision-model evidence and M36's monitoring-dossier timing, blind-spot, response, and reproducibility-claim debugging evidence. Subsequent [M31–M32](research/m31-m32-authoring-readiness-review-2026-08-01.md) and [M33–M34](research/m33-m34-authoring-readiness-review-2026-08-01.md) checks confirm that the remaining gap is reviewed delivery evidence, not a missing workbook. M31–M36 have Git-index-bound, non-promoting authoring preflights; the [study-ready gap audit](research/m31-m36-study-ready-gap-audit.md) records the remaining source/accessibility/release and operational-delivery boundaries. | The source-calibrated authoring pass is complete, but these remain private instructor-led drafts: authoring-only/hidden in the portal and not learner-ready portal modules. A real learner-approved chat pilot and focused human candidate review are required before a module-specific release decision. |
| M25/M26 synthesis and capstone | Both reader-visible previews were reweaved around advanced-evidence dependencies, use preview-safe TA/Study Partner prompts, and now name the exact M35/M36 dossier evidence that their future synthesis will consume. | Learning material exists, but they remain preview-only and cannot create premature synthesis/capstone credit. |
| Guided Codex learning | Separate reusable TA and Study Partner packages, module contexts, whiteboard protocol, and supportive oral-defense flow exist. The two learner-designated chats have received their distinct role handoffs and a concise record-control addendum: explicit `records on` before a note, visible chat-level acknowledgement, a save locator only after evidence, and a manual delete/archive fallback. The portal and private route surface the first-time `records on` consent condition. | Operational instructions are complete; actual Live quality, voice, math rendering, text fallback, record activation, and deletion behavior remain platform behavior to observe in the exact chats. |
| Learner-route walkthrough | On 2026-08-01, a local production browser walkthrough at commit `d33d89e` confirmed the portal’s explorer-versus-core distinction, Codex-chat handoff, explicit M31–M36 authoring-only boundary, and M25/M26 reference-preview gates. | This is one representative browser/DOM path, not evidence of voice quality, assistive-technology behavior, learner completion, or university equivalence. |
| Notion learning record | Local-first portal plus a conditional designated-chat concise-note policy, privacy controls, templates, and existing Notion hub. Two non-sensitive `QA — safe to delete` pages exist, and the TA page contains a correction. First automatic recording requires `records on` in that exact chat; the role addendum treats controls as chat-level intent rather than proof of a write and supplies a manual delete/archive fallback. | Existence of the safe QA pages and correction is observed, but their exact-chat origin and first-time activation are not independently verified. The available integration exposed no archive/delete action; `pause records`, save locators, and manual fallback are instructed in-chat but their effects have not been observed. Visual rendering and Live voice behavior remain unverified; no raw transcripts or sensitive data should be stored. |
| Visual readability and accessibility | `pnpm validate:mermaid-alternatives` now reports **245/245** reader diagrams with IDs, titles, concise alternatives, and visible prose equivalents. | Authored diagram coverage is complete; broader assistive-technology and representative browser review remain separate work. |
| Academic calibration | [Academic calibration index](ACADEMIC_CALIBRATION.md), range notes, targeted M1–M36 official-source reviews, and learner-route rechecks for [M1–M5](research/m1-m5-official-source-review-2026-08-01.md), [M6–M10](research/m6-m10-official-source-review-2026-08-01.md), and [M17–M20](research/m17-m20-official-source-review-2026-08-01.md) cover M1–M36. | Scope and targeted material-level calibration are complete for this pass; they support targeted improvement, not institutional equivalence. Revisit only when a genuine content gap is found. |
| 60/90/180-day plans | `LEARNER_ROUTE_PLANS.md` gives pace, evidence, buffers, and catch-up rules; the [gateway evidence-hours roll-up](research/gateway-evidence-hours-rollup-2026-08-02.md) now makes the 60-day band an explicit 35–45-hour full-time intensive rather than an implausible 20–25-hour schedule; `PRIVATE_GUIDED_LEARNING_ROUTE.md` connects the private advanced packs without changing portal gates. | The 60-day version is a rigorous first pass, not a mastery or degree promise; move to the 90- or 180-day route rather than omitting evidence when capacity is lower. |
| Privacy, safety, build, and Git history | Existing local-first, sanitization, build/type/lint, and Git protections remain in place; [Course CI run 30741679780](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30741679780) recorded source head `2bccea0…` through the portal, Python 3.12/3.14, and browser-accessibility jobs. Current alert facts and candidate remediation are in the [dependency risk register](DEPENDENCY_RISK_REGISTER.md). | Protected-default-branch alert recalculation, the remaining Drizzle/esbuild path, and release-grade hardening remain pending. Use only additive commits and normal pushes; the CI result is not a release, deployment, security-clean, or complete-accessibility claim. |

## Remaining work before the goal can be claimed complete

1. Run a private learner walkthrough through a representative module using the
   exact Study Partner, Teaching Assistant, oral-defense, and Notion workflow.
   Start with `records on`; observe the acknowledgement, record activation,
   `pause records`, and save locator. If the integration later exposes it,
   archive/delete only a future explicitly safe QA record—never learner data;
   otherwise verify the manual delete/archive fallback wording.
2. Before any M31–M36 release decision, perform a focused human source/reuse
   and rendered-accessibility review of the selected candidate; correct only a
   concrete issue rather than adding infrastructure to mark a checklist.
3. Decide deliberately whether and how the private M31–M36 packs should move
   from authoring-only to a learner-visible release stage.
4. Conduct the final requirement-by-requirement audit after those operational
   and release-boundary decisions are evidenced.

## Deliberately deferred, not silently missing

- Formal publication/release certification for every legacy module.
- Portal-controlled voice, model-quality, equation-rendering, or Notion-write
  claims that require platform evidence.
- A public multi-user backend, additional dashboards, or an interactive studio
  for every module.
- Equating this private course with university enrollment, credit, a degree, or
  universal mastery.
