# Atlas course completion snapshot

> **Updated 2026-08-01.** This is the concise status record for the active
> course-authoring goal. It separates usable learning material from portal
> access, release evidence, and learner mastery. The detailed
> [goal-compliance matrix](GOAL_COMPLIANCE_MATRIX.md) remains the historical
> release-hardening record; it is not the best summary of current learning
> progress.

| Goal area | Current evidence | Status and honest boundary |
| --- | --- | --- |
| Connected knowledge system and canonical route | `course-graph.v2.json` separates academic prerequisites, navigation, availability, and release state; M25/M26 remain preview-gated after M31–M36. | Implemented for the portal; route logic must be rechecked whenever availability changes. |
| M1–M30 learner materials | Thirty legacy workbooks provide six-session spines, sources, diagnostics, projects, and connected forward links. This batch added direct TA/Study Partner handoffs to the older operational gaps and made M4/M5 diagnostic explanations prediction-gated. | Usable study material; legacy release-contract review is intentionally separate and incomplete. |
| M31–M36 advanced extension | Six private authoring workbooks exist under `content/authoring/`, each with connected sessions, sources, diagnostics, project/dossier, oral-defense, TA/Study Partner, and forward-handoff material. M33–M36 include source-calibrated formal, AI, ML, and learning-theory reasoning traces; focused M31/M33/M36 proof audits corrected two condition/scope gaps. | Prepared for bounded private guided use, but authoring-only/hidden in the portal. A uniform M32–M36 authoring-contract cohort remains before any learner-visible/reviewed-release decision. |
| M25/M26 synthesis and capstone | Both reader-visible previews were reweaved around advanced-evidence dependencies and use preview-safe TA/Study Partner prompts. | Learning material exists, but they remain preview-only and cannot create premature synthesis/capstone credit. |
| Guided Codex learning | Separate reusable TA and Study Partner packages, module contexts, whiteboard protocol, and supportive oral-defense flow exist. The two learner-designated chats have received their role handoffs. | Operational design is complete; actual Live quality, voice, math rendering, and text fallback remain platform behavior to observe in the exact chats. |
| Learner-route walkthrough | On 2026-08-01, a local production browser walkthrough at commit `d33d89e` confirmed the portal’s explorer-versus-core distinction, Codex-chat handoff, explicit M31–M36 authoring-only boundary, and M25/M26 reference-preview gates. | This is one representative browser/DOM path, not evidence of voice quality, assistive-technology behavior, learner completion, or university equivalence. |
| Notion learning record | Local-first portal plus a conditional designated-chat concise-note policy, privacy controls, templates, and existing Notion hub. On 2026-08-01, one text-only QA in each designated chat completed a non-sensitive `QA — safe to delete` note creation; the TA then inserted and re-fetched one correction on its own QA page. | Creation and correction are observed for a non-sensitive QA page. The available integration exposed no archive/delete action; `pause records` is the supplied in-chat pause instruction, but its effect has not been observed. Visual rendering and Live voice behavior remain unverified; no raw transcripts or sensitive data should be stored. |
| Visual readability and accessibility | `pnpm validate:mermaid-alternatives` now reports **245/245** reader diagrams with IDs, titles, concise alternatives, and visible prose equivalents. | Authored diagram coverage is complete; broader assistive-technology and representative browser review remain separate work. |
| Academic calibration | [Academic calibration index](ACADEMIC_CALIBRATION.md), range notes, targeted M1–M36 official-source reviews, and a representative material-level review sample cover M1–M36. | Scope and targeted material-level calibration are complete for this pass; they support targeted improvement, not institutional equivalence. Revisit only when a genuine content gap is found. |
| 60/90/180-day plans | `LEARNER_ROUTE_PLANS.md` gives pace, evidence, buffers, and catch-up rules; `PRIVATE_GUIDED_LEARNING_ROUTE.md` connects the private advanced packs without changing portal gates. | The 60-day version is a rigorous first pass, not a mastery or degree promise. |
| Privacy, safety, build, and Git history | Existing local-first, sanitization, build/type/lint, and Git protections remain in place; [Course CI run 30705102840](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30705102840) recorded the M33–M36 source head in a passing four-job PR merge candidate. | Release-grade hardening and dependency-risk follow-up are deliberately deferred unless a concrete learner/privacy/security issue requires them. Use only additive commits and normal pushes; the CI result is not a release, deployment, security-clean, or complete-accessibility claim. |

## Remaining work before the goal can be claimed complete

1. Run a private learner walkthrough through a representative module using the
   exact Study Partner, Teaching Assistant, oral-defense, and Notion workflow;
   observe the effect of `pause records` and, if the integration later exposes
   it, archive/delete only a future explicitly safe QA record—never learner data.
2. Before any M31–M36 release decision, recheck the named source-calibration
   boundaries and correct any newly found concrete proof or experiment issue;
   do not add infrastructure merely to mark a checklist.
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
