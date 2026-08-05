# Atlas goal-compliance matrix

This is the detailed historical release-hardening evidence matrix for the Atlas
completion goal. For the active course-authoring view, use the concise
[course completion snapshot](COURSE_COMPLETION_SNAPSHOT.md). A checkmark
means only that the cited implementation/test evidence exists; it does not turn
time spent into a degree, a guarantee of mastery, or a claim that an external
release succeeded. `In progress` means the boundary is known and tracked.
This is an evidence inventory, not the final goal-completion audit.

> **Current material correction — 2026-08-02:** M31–M36 each have a private
> six-session authoring workbook and a non-promoting hidden review-candidate
> selector; their v3 contract state is `authoring-only`. M25/M26 remain
> preview-safe synthesis/capstone material. Older rows that describe missing
> advanced workbooks or `not-started` advanced contracts refer to historical
> release-gate work and are superseded for course-authoring progress by the
> snapshot above. In broad contract rows, remaining M31–M36 “implementation”
> means reviewed learner-delivery/release evidence, not missing authoring
> material.
>
> **Registry-count clarification — 2026-08-04:** the current v3 registry
> reports 30 `legacy-baseline`, six `authoring-only`, zero `not-started`, and
> zero `verified` entries. Any older `authoring-only/not-started` wording in
> this historical matrix is superseded by this dated count.

| Goal clause | Status | Implementation / test evidence | Still required before completion |
| --- | --- | --- | --- |
| One canonical graph with distinct prerequisites and route navigation | Implemented — v2 active | `content/course/course-graph.v2.json`, `lib/course-catalog.ts`, `scripts/course-graph.mjs`, the generated manifest, `docs/COURSE_STATUS.md`, and `tests/course-graph.test.mjs`. The generated status projection is checked from the graph rather than duplicated in this matrix. The model separates lifecycle, reader access, availability, contract state, and release state; canonical invariants reserve `published` for a verified contract with deployed-recorded release evidence. The v1 graph survives only as the exact historical M31–M36 readiness-audit fixture. | Audit every route, dashboard, and documentation surface against the graph as later modules publish. |
| Levels 1–9 scope truth and post-Core depth | Implemented structurally; delivery remains intentionally mixed | The canonical graph contains a versioned 63-topic Scope Matrix across Levels 1–9. Its v4 benchmark pins the learner-supplied inventory's SHA-256 fingerprint and indexes all **362** atomic learning targets—355 direct Master/Study targets plus seven explicit Level-2 AI-research additions—by source line, directive, same-level Atlas target, and checked section rollup. `tests/course-graph.test.mjs` rejects missing/duplicate source lines, an unmapped atomic target, a cross-level mapping, and drift between an atomic mapping and its heading rollup. [`app/route/ScopeMatrix.tsx`](../app/route/ScopeMatrix.tsx) keeps the everyday route concise and links to the on-demand source-target → Atlas-target → current-delivery crosswalk, alongside graph-derived target depth, module/session and source route, evidence artifact, and four prerequisite-gated design-only tracks; the built route test confirms authoring-only M31 is not linked as a reader page. [`research/academic-calibration-math-ai.md`](research/academic-calibration-math-ai.md) records official MIT, CMU, Stanford, Georgia Tech, and Berkeley calibration routes. | The crosswalk proves a calibrated target map, not delivery, learner access, completion, mastery, review, or release. Do not turn a target label, preview, bridge, or authoring-only pack into any of those claims. Conduct one specialization at a time only after its prerequisites and the underlying learner-delivery/release evidence are real. |
| No silent path around M31–M36 before M25/M26 synthesis | Implemented for portal and private route | Graph grants M25/M26 preview reader access and `preview` availability; reader/route derive links from the graph and label them reference-only, with no Core credit or inferred progress. Rendered-route tests cover the boundary; M24's canonical workbook/source map names its M32 authoring-only forward boundary rather than treating M25/M26 as a direct continuation. The private route separately requires actual learner-supplied M31–M36 dossiers/packets, relevant M27–M30 evidence or explicit unavailable markers, and TA handoffs before M25 can begin; M26 additionally requires the resulting M25 Next-Step Evidence Dossier, Advanced Evidence Annex, and carried-forward receipts. | Preserve the portal preview boundary and private evidence gate. Neither may be treated as publication, release evidence, route/Core credit, or mastery. |
| Versioned module contract and release gate | In progress — active unified v3 registry, no verified modules | `content/course/contracts/module-contract-registry.v3.json`, `scripts/module-contract-registry.mjs`, `scripts/module-review-evidence.mjs`, `scripts/hidden-review-candidate.mjs`, `scripts/module-evidence-preflight.mjs`, `scripts/legacy-candidate-preflight-profiles.mjs`, `scripts/verify_teaching_model_exercises.py`, and focused regression tests bind every canonical module to the same 18 criteria and validate graph/manifest parity. M12/M13 are a separate current structural candidate cohort: `content/course/contracts/module-contract-candidate-packets.v1.json`, `content/course/contracts/evidence/m12.v1.json`, `content/course/contracts/evidence/m13.v1.json`, `content/course/contracts/evidence/preflight/m12.v1.json`, `content/course/contracts/evidence/preflight/m13.v1.json`, `content/course/contracts/companions/m12.v1.json`, and `content/course/contracts/companions/m13.v1.json` bind current local instructional pointers, direct studios, bounded models, and canonical M12 → M13 → M14 handoffs while preserving each module's `legacy-baseline`/unrecorded tuple and the immutable historical audit. M18–M24 form a candidate-only systems cohort alongside M27–M30 mathematics: each scoped record resolves all 18 structural criteria; a versioned profile freezes the typed packet, candidate-boundary hash, source-ledger scope, studio, visual test, companion, and derived evidence/preflight records from one Git-index snapshot. The profile-derived records are hashed in the deterministic input ledger; they cannot grant review, verification, release, deployment, publication, chat/Notion activity, or learner mastery. M18–M24's new reader-visible oral/repair routes are current unreviewed candidate material: they do not constitute qualified learner-facing review, a live session, or release evidence. Course-content and source-ledger inputs must use the manifest/graph-selected paths; a canonical Python model must bind its exact CI-discovered test plus the CI runtime verifier, which requires actual paired reference-model code execution while the discovered suite runs. Candidate inputs must be Git-tracked, clean against the Git index, and locally contained; the loader accepts only a canonical path. A future hidden review-ready candidate additionally requires a fixed module-scoped selector that freezes its future workbook, source-ledger, and visual scope from the same Git-index generation; the evidence record must bind its exact root selector input before review, it cannot substitute an authoring workbook/map, and a later verified manifest/source map must match it. The synchronizer may use only a deterministic pre-write manifest projection after every other promotion input is clean and staged; ordinary/strict/complete validation still requires the exact Git-index manifest. The cohort locks stable non-binding release wording and its members' legacy-baseline/unrecorded tuples, while the canonical graph rejects any recorded release for a non-verified module. Future review-ready modules still need a module-scoped record and digest-bound human review; a verified release additionally preserves that bundle from an earlier review-ready commit and binds candidate blobs, source-commit CI evidence, graph record ID, scoped release documents, and deployment version. The registry truthfully reports 30 `legacy-baseline`, zero `verified`, and six authoring-only/not-started entries. The immutable legacy audit/packets, draft M21/M27 v2 pointers, retained advanced-v1 authoring adapter, and prerequisite/session bridge remain migration adapters or historical evidence; the adapter freezes authoring inputs but cannot enter review-ready/published state or serve as promotion evidence. | Review and promote M1–M30 through v3; complete M31–M36 implementation/review evidence; make strict and then complete validation pass. This cohort's structural preflight is not human review, learner mastery, CI, deployment, security, or publication evidence. Local structural checks do not independently verify GitHub CI/review or private deployment. |
| Six connected sessions and source maps | Structural baseline, now canonical-workbook-bound | The legacy audit validates the manifest-selected workbook, six unique ordered Session 1–6 anchors, graph source-map agreement, and generated audit report. The packet linter additionally requires every declared forward artifact to resolve to a typed `session-output` pointer at a visible H3 inside its matching session; mutation tests reject unbound or misplaced output pointers. Source-artifact copies deterministically deliver selected canonical maps/addenda to allowlisted downloads links; regression tests reject retired research links and stale copies. M29's canonical map and existing delivered addendum additionally name its M27/M28 academic prerequisites, direct M30 handoff, and non-promotion boundary. M20 has an authoring-only source-audit ledger with source/reuse/claim boundaries that preserves the historical missing `work/` path while recording the current singular `public/downloads` model/test source; the non-promoting packet hashes it as an internal release input but it is not a delivered map, review, or contract promotion. M19 has an authoring-only source/reuse/claim ledger that records its current source/reuse/claim boundaries. M21 and M22 retain their historical six-ambiguity audit snapshots, while the current structural audit now resolves M21's rigor card and M22's rigor/code-reading pointers; their source ledgers remain internal inputs rather than review or release evidence. M22 also preserves the regression-tested correction from obsolete RFC 8446/ambiguous RFC 9325 language to the current RFC 9846/status route. M23 now has an authoring-only source/reuse/claim ledger that records current boundaries and corrects tagged CPython source drift, local implementation evidence, fixed-parse/separate-disassembly provenance, and bounded CLI/test-harness I/O wording. M23's non-promoting packet hashes the addendum as an internal input, while its map/addendum remain configured authoring inputs rather than learner-download artifacts. None of these ledgers is review or contract promotion. | Review actual progression, source claims, access dates, licenses, reuse status, and quality per module. A resolved session-output pointer records location/sequence, not learner-produced evidence or source review. |
| M32 primary-source research | Authoring-only research/workbook evidence; portal and release blockers remain unmet | `content/source-maps/module32_systems_languages_scientific_python_accelerators_source_research.md`, `content/authoring/m32_systems_languages_scientific_python_accelerators_workbook.v1.md`, its delivery map, companion, evidence/preflight records, bounded fixture/tests, and the [M31–M32 readiness review](research/m31-m32-authoring-readiness-review-2026-08-01.md) preserve a first-party source/reuse ledger, original six-session learning pack, claim–assumption–counterexample boundaries, hardware-aware non-claims, diagnostics, dossier, oral guide, and TA/Study Partner handoff. | This authoring input does not set M32's canonical source map or release state; the pack also does not set its learner reader route, studio, review-ready v3 state, CI/deployment provenance, benchmark claim, or mastery claim. A focused human/reuse/rendered-accessibility review and learner-approved delivery evidence must precede any module-specific release decision. |
| M33–M36 primary-source research and authoring packs | Authoring-only research/workbook evidence; portal and release blockers remain unmet | `content/source-maps/module33_formal_languages_computability_complexity_source_research.md`, `module34_classical_ai_search_constraints_decision_source_research.md`, `module35_machine_learning_statistical_learning_ai_eval_source_research.md`, `module36_statistical_learning_theory_reliable_deep_learning_source_research.md`, the four authoring workbooks/delivery maps/companions/evidence-preflights, bounded fixtures/tests, and the [M33–M34 readiness review](research/m33-m34-authoring-readiness-review-2026-08-01.md) plus [M35–M36 focused review](research/m35-m36-focused-candidate-review.md) preserve original teaching arguments, first-principles definitions, theorem/claim assumptions, counterexamples, diagnostics, dossier/oral flows, and the active designated-chat privacy distinction. | These packs leave graph `sourceMap: null`, `authoring-only`/hidden route status, authoring-only v3 contract state, unrecorded release state, and the M25/M26 preview boundary unchanged. They are not reviewed portal modules, module release evidence, benchmark evidence, platform-write proof, or evidence of learner mastery. Review M33, then M34, then M35 in prerequisite order; conduct real rendered/chat delivery and release evidence one selected module at a time. |
| M24 runtime-evidence truth boundary | Implemented as an authoring-only audit repair plus non-promoting structural packet | `content/source-maps/module24_cpython_performance_memory_source_research.md`, `content/source-maps/module24_cpython_performance_memory_source_audit_addendum.md`, `content/course/contracts/legacy-module-contract-packets.v1.json`, `tests/module24-source-audit-addendum.test.mjs`, `tests/legacy-module-contract-packet.test.mjs`, `public/downloads/test_module24_reference.py`, and the M24 candidate-only companion/evidence/preflight constrain the M24 model to course-model/evidence-requirement cards; a matching manifest is not a measurement/patch acceptance; CLI/test-harness I/O, illustrative-bytecode status, M24 → authoring-only M32 route, PEP 744 Draft/JIT/free-threading, `resource`, and pinned-source boundaries are regression tested. The packet resolves 43 typed pointers, including six session-output bindings; it hash-binds the internal addendum (not the authoring-only research note), and the current audit now maps its reader-facing visual-text and Teaching Assistant anchors as structural pointers. Its oral pointer remains unreviewed; these anchors do not change that audit, review, or release state. | Obtain qualified source, accessibility, and learner-facing review of the current oral route. Do not infer publication or review from the repair, pointer resolution, candidate preflight, or hash. |
| M25 preview source/route truth boundary | Implemented as an authoring-only audit repair plus non-promoting structural packet; preview preserved | `content/source-maps/module25_evidence_grounded_intelligent_systems_source_audit_addendum.md`, the canonical M25 map/workbook, `content/course/contracts/legacy-module-contract-packets.v1.json`, `tests/module25-source-audit-addendum.test.mjs`, `tests/legacy-module-contract-packet.test.mjs`, and generated release-input hashes distinguish direct M22/M24/M30/M31/M34–M36 prerequisites from the M27–M36 transitive evidence closure; eliminate the false M24 → M25 navigation claim; keep M25/M26 preview-gated; refresh scikit-learn, NIST Privacy Framework, MCP, OWASP, university/reuse, and bounded CLI/test-harness I/O records; bind six visible session outputs; and hash-bind the internal addendum without making it learner-downloadable. The 43-pointer packet retains one intentional prerequisite/forward-map ambiguity; its visible fixed-fixture rigor card is a structural pointer only, while prediction, transfer, confidence-diagnostic, and supportive-oral pointers remain unreviewed. | Obtain qualified source/accessibility/learner-facing review of the existing M25 oral-defense route. Do not infer publication, release, project/oral credit, learner mastery, or security clearance from the source audit, generated hash, or resolved anchor. |
| First-principles / code-reading / debugging / transfer / rigorous math | In progress | The unified v3 registry carries separate criteria for first principles, code-reading/debugging/design, prediction, transfer, and the full rigor bundle (definitions, assumptions, derivations/proofs, counterexamples, numerical experiments). Its legacy evidence remains non-approval evidence and the former free-form “verified” path fails closed. M8/M9 now expose named first-principles routes, and M11–M13 map reader-visible text equivalents while retaining `legacy-baseline`/unrecorded contract and release states. M12/M13's current structural packets, evidence records, and preflights map their declared six-session software sequence and bounded reference-model evidence without promoting those states. M18, M19, M20, M21, M22, M23, M24, M25, M27, M28, M29, and M30 have typed, non-promoting structural packets with 513 resolved pointers across their workbooks/source maps/addenda, including an output pointer inside every declared session, while retaining their current generated audit states. M25/M26 now also expose bounded fixed-fixture rigor cards without weakening their preview gate. Current per-module pointer and ambiguity states are projected by `docs/LEGACY_MODULE_CONTRACT_AUDIT.md` (**478 P / 2 A / 0 M**); structural pointers remain neither human review nor release evidence. | Preserve the historical audit facts while attaching module-specific reviewed evidence in v3; complete derivations/counterexamples/numerical experiments where relevant. |
| Confidence-aware diagnostic, retrieval, project, oral defense, TA, Study Partner | In progress — designated live-chat roles, graph-bound open-material contexts, and a versioned automatic-note policy | Existing diagnostic/oral-defense code, `/learning-partners` copyable TA/Study Partner startup packages, `content/course/live-codex-learning-workflow.v2.json`, `content/course/module-companion-guides.v1.json`, `content/course/contracts/companions/m12.v1.json`, `m13.v1.json`, `m18.v1.json`, `m19.v1.json` through `m24.v1.json`, `m29.v1.json`, `m31.v1.json`, `scripts/module-companion-guides.mjs`, `scripts/module-learning-companion.mjs`, `lib/module-companion-package-builder.mjs`, and browser/unit regressions distinguish the Teaching Assistant's supportive oral-defense duty from the Study Partner's non-grading live discussion/rehearsal duty. M12/M13's current candidate companions bind exact global-guide entries and the canonical M12 → M13 → M14 handoffs, but remain `legacy-baseline`/unrecorded and non-promoting; they do not overwrite the historical audit or prove a live/voice session, formatting, a chat handoff, Notion write, review, or mastery. M18–M24's frozen candidate companions bind their exact global guide entry and canonical forward handoff; M24's M32 boundary stays authoring-only/hidden. Their visible current candidate protocols require prediction/confidence, hint, counterexample/changed-premise repair, transfer/reflection, and a learner-controlled readable text-whiteboard summary, but they do not prove a live/voice session, formatting, a chat handoff, Notion write, review, or mastery. Open module readers receive only their own server-derived context packet, with prerequisites and forward handoff taken from the canonical graph; preview pages omit it and authoring-only guide data is not sent to the public reader. The v2 policy keeps portable copied prompts local while authorizing at most one automatic concise note after a substantive conversation only in the configured designated chats, with pause/off-record controls, whiteboard fallbacks, and direct-evidence requirements. On 2026-08-03, the exact designated chats received their role handoffs and each returned a no-record text-whiteboard response; this confirms prompt delivery and role acknowledgement only, not the on-screen renderer, Live behavior, or Notion behavior. It is not review, release, learner access, or mastery evidence. | Build equivalent module-scoped companion evidence, adaptive text oral flow, review records, and module evidence/rubrics for every future promotion. Manually verify the exact platform chats' voice, formatting, and actual note-write behavior before recording it as acceptance evidence. |
| M31–M36 and reworked M25/M26 | Material-ready for designated Codex chats — six academically calibrated, portal-hidden advanced packs and an evidence-gated private synthesis route | The v3 registry retains six authoring-only/unrecorded **release-contract** entries, while the canonical graph separately declares each pack `ready` for `designated-codex-chats`; server-side validation binds its workbook, source ledger, and companion without exposing those paths in the portal. Each has a private six-session workbook, delivery map, companion, source research, confidence/retrieval/dossier/oral material, and a Git-index-bound non-promoting evidence preflight; bounded M31–M36 fixtures make selected reasoning traces inspectable without creating portal learner access. [`M31_M36_PUBLICATION_READINESS_AUDIT.v1.json`](archive/publication-readiness/M31_M36_PUBLICATION_READINESS_AUDIT.v1.json) preserves the historical “Do not publish” verdict, while the [study-ready gap audit](research/m31-m36-study-ready-gap-audit.md), [M31–M32 readiness review](research/m31-m32-authoring-readiness-review-2026-08-01.md), [M33–M34 readiness review](research/m33-m34-authoring-readiness-review-2026-08-01.md), and the current [three-batch calibration pass](research/m31-m32-official-calibration-2026-08-01.md) ([M33–M34](research/m33-m34-official-calibration-2026-08-01.md), [M35–M36](research/m35-m36-official-calibration-2026-08-01.md)) distinguish study readiness from release evidence. The private route can use full M25/M26 workbooks only after actual learner M31–M36 dossiers/packets, relevant M27–M30 evidence or unavailable markers, and TA handoffs; this creates no prerequisite, synthesis, or capstone credit. | Do not promote a structural preflight or private learning pack. Select a module in prerequisite order, freeze its reviewed candidate, and conduct human source/reuse/learning-quality and rendered-accessibility review before any portal or release decision. Bind exact CI, deployment, limitation, changelog, and provenance evidence before any release; preserve the private evidence gate and portal preview boundary. |
| Intake, bridges, 60/90/180-day operational route | Partially implemented — 20-probe confidence-aware intake and open-material bridge model | `lib/diagnostic-model.js`, `lib/diagnostic-progress-codec.js`, `app/diagnostic/DiagnosticExperience.tsx`, `tests/diagnostic-model.test.mjs`, `tests/diagnostic-progress-codec.test.mjs`, `e2e/accessibility.spec.ts`, `tests/rendered-html.test.mjs`, and `docs/LEARNER_ROUTE_PLANS.md`. The v3 browser record has exactly the 20 fixed choice/confidence/revealed triads; a valid v2 attempt is projected once after a current-first read, while navigation, completion, timestamps, results, and export consent remain in memory. | Establish validated-instrument evidence and per-module review/operational records. The intake never unlocks or simulates authoring-only M31–M36. |
| Notion workflow with explicit learner consent | In progress — local-first portal plus designated-chat automatic-note policy | `content/course/manual-learning-record-workflow.v1.json`, `content/course/live-codex-learning-workflow.v2.json`, `scripts/manual-learning-record-workflow.mjs`, `docs/LEARNER_RECORD_WORKFLOW.md`, `docs/LIVE_CODEX_LEARNING_WORKFLOW.md`, focused mutation tests, and approval-gated portal evidence surfaces. The portal kit gives the learner ten connected, minimal-data templates; the guide and manifest are hashed release inputs. Atlas itself does not make a Notion request. The policy authorizes only the designated Teaching Assistant/Study Partner chats, with a reachable configured private destination, to automatically create one concise session summary only after the learner says `records on` in that exact designated chat for the current substantive session; `end session` closes automatic session-summary authority until a new `records on`, while an explicit correction or deletion remains separately authorized. It excludes raw voice, sensitive data, and off-record material, preserves pause/correction/deletion controls, provides a ready-to-paste unavailable-write packet, and requires direct evidence before a saved-note claim. | Manually verify actual configured chat-to-Notion writes, correction/deletion/pause handling, and exact platform behavior. Do not claim portal automation, raw-transcript retention, or automatic mastery tracking. |
| Visual clarity, accessibility, keyboard/screen-reader/performance checks | In progress | Existing visual studios/reader; Mermaid retains safe structural labels and an honest technical-source fallback; `e2e/accessibility.spec.ts` plus the Linux `browser-accessibility` CI job add a strict Chromium/axe gate. [Run 30587015926](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30587015926) passed all 17 targeted browser checks on merge candidate `85306aa` from source head `b8b9a88`, including next-question keyboard focus. M19 has a graph-declared direct reader studio and a persistent keyboard-operable disclosure control; focused browser checks cover its closed/open state, focus retention, direct-reader Axe scope, evidence-panel Axe scope, and local-progress behavior. M12/M13 now have graph-declared, non-promoting direct reader studios with keyboard/Axe-focused source tests; this is local structural evidence only, not a completed review or browser-CI claim. Its fourteen-entry performance policy measures the reader/portal launch shell and explicitly records the deferred lab boundary rather than treating it as free. `content/course/client-performance-budget.v1.json`, `scripts/validate-client-performance-budget.mjs`, and `tests/client-performance-budget.test.mjs` enforce reviewed raw emitted-asset, initial-entry, and code-split-studio limits. | Add per-diagram concise prose equivalents and retrofit earlier modules. Future candidates need their own Linux browser run. The artifact budget is intentionally not a network, device, or real-user performance claim; route/field performance evidence remains separate. The harness is bounded automated evidence, not a completed accessibility review. |
| Local progress privacy, rendering safety, and headers | In progress — browser-progress policy/linter and 14-surface migration implemented | `content/course/browser-progress-surfaces.v1.json`, `content/course/browser-progress-owner-bindings.v2.json`, `scripts/browser-progress-surface-policy.mjs`, `lib/browser-progress-storage.js`, `lib/local-progress-codec.js`, the dedicated M18–M30/intake codec modules, `tests/browser-progress-surface-policy.test.mjs`, per-surface lifecycle tests, and `e2e/accessibility.spec.ts`. The v1 surface policy retains its historical `{moduleId, lifecycle}` owner schema; the separately versioned v2 owner-binding policy maps every active surface to the canonical route and current availability. Both are hashed release inputs, and the validator scans authored `app`/`lib` ASTs: only the browser adapter may touch literal, static element-access, or `Reflect.get` Web Storage references; declared clients must use static named seam/lifecycle calls; `sessionStorage`, `Storage.clear()`, duplicate/unversioned keys, forbidden data classes, undeclared clients, and incomplete reset/migration declarations fail validation. The adapter reports denied writes/removals; current-first intake/M23/M24/M26 migrations retain a valid legacy record unless the replacement write succeeds, and learner messages distinguish unavailable browser storage from a successful save/clear. M18 retires broad v2 state; M19 retires broad v2 state; M20–M22/M25/M27–M30 now keep only meaningful fixed-gate evidence and clear malformed/blank/default state; intake stores only 20 fixed triads. Every current record remains optional, local, bounded, and untrusted—not mastery, authorization, identity, Notion, oral-defense, route-unlock, or pass/fail evidence. Conservative response-header tests, explicit Markdown/SVG/Mermaid allowlists, and malicious-rendering regressions remain in place. | Verify production headers, conduct further adversarial/browser coverage and a real assistive-technology review, maintain the policy as new studios appear, and retain the open dependency-risk register. This is not a security-clean claim. |
| Deterministic, allowlisted, hashable content inputs | Implemented for checked-in course inputs and teaching-download output | `scripts/sync-modules.mjs`, `content/course/release-inputs.v1.json`, the active v3 module-contract registry, hashed legacy audit, M31 contract/maps, the manual learning-record workflow and its learner guide, and the explicitly bounded M31–M36 readiness-audit provenance input; `vite.config.ts`, generated-artifact checks, and release-input tests | Tie each deployment to an exact reviewed Git commit and release ledger; extend the allowlist only through reviewed, deterministic inputs. A provenance hash is not a deployment or publication claim. |
| Strict TypeScript, dependency risk triage, bounded lab truth | In progress | `wrangler.jsonc`, generated Worker types, strict local typecheck, pinned third-party Action commit SHAs in Course CI, GitHub Actions run 30568694668, `content/course/release-evidence-policy.v1.json`, the static on-demand verifier safety tests, and `docs/DEPENDENCY_RISK_REGISTER.md`. On 2026-07-31, current-branch `pnpm audit --prod --json` was empty; the scoped `minimatch@3` → `brace-expansion@1.1.17` override removed the local high development-path finding and lint passed. The remaining local full-audit finding is the explicitly triaged development-only `drizzle-kit` legacy-esbuild path. The local verifier and on-demand read-only metadata verifier constrain source-head-attached run/job metadata only; neither makes an execution-ref or deployment assertion. | Run the read-only verifier manually for a reviewed release candidate, then separately design an immutable workflow-body/execution-ref evidence link. Verify Dependabot's default-branch refresh for all candidate remediations, recheck the remaining Drizzle/esbuild path, document bounded OS/process labs accurately, and never label the repository security-clean without current evidence. |
| Auditable GitHub releases and preserved change history | In progress | A direct GitHub REST readback on 2026-07-30 confirmed that `main` and the active review branch reject force-pushes/deletion, require linear history, and apply those rules to administrators; `main` strictly requires `Browser accessibility acceptance` alongside its portal/Python checks. Additive Git commits remain on the review branch; `docs/RELEASE_PROVENANCE.md` records historical GitHub Release/tag facts, failed browser candidates, successful [run 30594396737](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30594396737) for source head `3f291c7` and merge candidate `e2f1170`, successful [run 30599351278](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30599351278) for source head `8ac2318`, successful [run 30600295144](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30600295144) for source head `a8b466c`, successful [run 30601352266](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30601352266) for source head `0fc55ad`, successful [run 30602705021](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30602705021) for source head `3be7919`, successful [run 30605192980](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30605192980) for source head `67b9ac8`, successful [run 30606925539](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30606925539) for source head `07a5fbe`, and successful [run 30608930763](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30608930763) for source head `95ee127`, each with a bounded source-head-only distinction. | Keep protection settings under review, maintain additive commits and reviewable PRs, record equivalent evidence for future candidates, and verify private deployment separately. |

| GitHub Actions cost control | Partially implemented — the optimized workflow is recorded on the reviewable history ref but not yet the active PR path | [`ACTIONS_COST_AUDIT_2026-08-03.md`](ACTIONS_COST_AUDIT_2026-08-03.md) identifies repeated non-draft PR synchronizations as the cost driver; no schedule, OS multiplier, or retry policy was found, and the intended Python 3.12/3.14 pair plus browser gate remain. A 2026-08-04 readback records `converted_to_draft` handling and no Course-CI `workflow_dispatch` on history ref `0e3a51d`, while Draft PR #21 remains at `54b894f` with its older workflow. | Use a safe non-rewriting path to converge the correction to the review/default-branch flow, then obtain one normally requested full gate. Do not remove required branch-protection checks or manually dispatch CI merely to create reassurance evidence. |

| Mermaid visual alternatives | Structural coverage complete; broader accessibility review remains in progress | `lib/mermaid-accessibility.mjs`, `app/modules/[slug]/MermaidDiagram.tsx`, and `scripts/validate-mermaid-alternatives.mjs` define a title/text-alternative convention, render concise prose visibly, associate it with the sanitized SVG, and scan every reader diagram. The current scan reports **245/245 complete and 0 incomplete**: every Mermaid block now has an ID, title, concise text alternative, and immediate visible prose equivalent. `tests/m19-m24-mermaid-accessibility.test.mjs` protects the M19–M24 cohort, while `e2e/accessibility.spec.ts` checks rendered SVG-to-alternative behavior on a selected route. | Keep alternatives current as diagrams change; extend manual assistive-technology and representative browser checks. Complete authored alternatives are not by themselves a completed accessibility review. |

## Current private-study delivery clarification

The M31–M36 designated-chat materials are ready for normal private study
without a separate learner rehearsal or pilot; use their private authoring
workbooks. M25/M26 retain their prerequisite-gated portal preview boundary,
while the private route may use their full workbooks only after the learner
supplies named M31–M36 dossiers/packets, relevant M27–M30 evidence or explicit
unavailable markers, and TA handoffs. This is a delivery-mode clarification,
not a portal promotion: the canonical graph continues to control portal reader
access, preview status, prerequisites, release claims, and credit boundaries.
Voice, equation rendering, and Notion behavior remain platform facts to report
only when directly observed, not prerequisites for starting the course.

## Dated operational-state supersession — 2026-08-04

The following facts supersede older present-tense references in this historical
matrix without erasing their dated evidence:

- The live workflow now defaults records **off** for a new or ambiguously
  resumed substantive session until the learner gives a fresh visible
  `records on` in that designated chat. The portal still cannot enforce an
  external Codex/Notion write; this is a validated instruction and prompt
  boundary, not platform-behavior evidence.
- Current review-candidate `pnpm audit --prod --json` exits zero after scoped
  PostCSS/brace-expansion/fast-uri repairs. The full local audit remains one
  high and five moderate development-tooling findings: Drizzle's legacy
  esbuild loader and Miniflare's exact Undici pin. The dependency risk register
  gives their compatibility constraints and next actions; `main` still has five
  open Dependabot alerts pending normal merge and recalculation.
- Active Draft PR #21 reached `b69bfa8` with the cost-controlled Course CI.
  Run `30905783135` skipped hosted jobs before runner allocation. This replaces
  the old “not yet active” statement, but is neither a full gate nor release
  evidence; a review-ready batch must still receive its normal gate.

## Dated full-gate supersession — 2026-08-04

The later additive source head
[`a5bf821`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/a5bf821ed3f1b7f52f039b0706d45d34561ec41a)
received the normal non-draft pull-request Course CI run
[`30958237679`](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30958237679)
and passed Portal quality gate (including 285 bounded live source-link checks),
Node apparatus validation (416/416), both Python teaching-model jobs, and
Browser accessibility acceptance (63/63 Chromium/axe routes). The run checked
generated merge candidate `16ffa9142ca6c840999b6cfa31eed580cabfb973` for the
recorded source head.

This supersedes only the older “no current-head apparatus/browser run” wording
in the active compliance snapshot. It does not promote any module, replace
human or assistive-technology review, close dependency alerts, prove Notion or
voice behavior, establish a private deployment, or establish learner mastery.

## Current source-head revalidation — 2026-08-04

The current additive source head
[`601296d`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/601296deafd3ef4c44c98a0b088c67e198a62952)
received the normal non-draft pull-request Course CI run
[`30959390181`](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30959390181)
and passed the portal gate, live source-link checks, Node apparatus (416/416),
both Python teaching-model jobs, and browser accessibility (63/63). This
revalidation refreshes the generated current-truth header; it does not promote
modules or establish human review, private deployment, Notion/voice behavior,
security clearance, publication, or learner mastery.

## Latest source-head gate — 2026-08-04

The next additive source head
[`1a0e4da`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/1a0e4dae0c525832225293e13698b11f833f1b14)
received Course CI run
[`30961057821`](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30961057821)
and passed the portal gate, live source-link checks, Node apparatus (416/416),
both Python teaching-model jobs, and browser accessibility (63/63). This is
the newest automated source-head evidence; it does not promote modules or
establish human review, private deployment, Notion/voice behavior, security
clearance, publication, or learner mastery.

## Evidence interpretation

- **Structural baseline**: automation has checked file/graph/session/path facts.
- **Evidence pointer**: a bounded structural reference, not a teaching-quality
  approval; see [`CONTEXT.md`](../CONTEXT.md) for the controlled vocabulary.
- **Reviewed contract**: a human has attested to the teaching, source,
  accessibility, and assessment evidence required by the v1 contract.
- **Release evidence**: the exact deployed Git commit, CI run, review,
  limitations, version, and changelog entry have been recorded and are
  independently reachable.

The strict contract gate is expected to fail while the table contains
`In progress` rows. That failure is a safeguard, not a reason to weaken the
gate or rewrite the course history.

## Dated chat and Notion role-delivery record — 2026-08-04

The two existing designated Codex chats received and acknowledged their
role-specific Atlas contracts: the Teaching Assistant owns first-principles
instruction and the constructive oral defense; the Study Partner owns live
discussion, retrieval, code-reading, debugging, and non-grading rehearsal. The
compact [role-delivery record](LIVE_CODEX_ROLE_DELIVERY_2026-08-04.md) records
the opaque thread references without retaining a transcript.

The connected Notion workspace and existing learner-controlled record pages
were fetched successfully. No learner note was written during this audit,
because `records on` was not enabled and no substantive learning session took
place. Live voice quality, equation/code rendering, a consented note write, and
pause/correction/deletion behavior remain explicitly unverified.

## Dated advanced-copy parity control — 2026-08-04

The M31–M36 copy boundary now records the selected duplication-control design:
the authoring workbooks are canonical and the hidden review candidates are
generated derivatives. The parity test enforces the six unique mappings and
allows only the candidate preamble, source-ledger relative-link rewrite, and
candidate release-boundary footer. This closes the source-drift control gap;
it does not promote the candidates, complete human review, or change their
authoring-only/portal-hidden status.

## Dated recorded-gate wording correction — 2026-08-04

The generated matrix now labels the 416-test apparatus and 63-route
Chromium/axe results as the **latest recorded full-gate** evidence rather than
calling them current-head checks. The local branch has later additive commits
and has not received a hosted rerun; this wording prevents historical CI from
being mistaken for verification of the current branch.

## Dated designated-chat reachability readback — 2026-08-04

A direct Codex-app readback found a recent realtime response in both existing
designated chats: the Teaching Assistant answered an audio check and the Study
Partner returned a short greeting exchange. This is bounded channel
reachability evidence only. It is not a substantive module lesson, oral
defense, whiteboard-rendering observation, learner evidence, or Notion write;
the repository retains no raw transcript or audio.

## Dated Dependabot alert reconciliation — 2026-08-04

An authenticated `gh api` readback of protected default branch `main` at
`33fadbd49b0e33900f21aba06ed40845c3cbd641` returned 11 open Dependabot alert
records: five high and six medium. The feature-branch push separately printed
GitHub's summary of 12 vulnerabilities (six high, six moderate). The generated
matrix and dependency register now use the explicit 11-record API inventory,
while preserving the push-summary discrepancy as unresolved evidence rather
than claiming a security-clean state. Local `pnpm audit --prod --json` remains
clean on the reviewed lockfile candidate; the full local audit remains
non-zero for development tooling.

## Dated path-aware Actions gating — 2026-08-05

The Course CI classifier now emits explicit portal and browser scopes. On
non-draft pull requests, documentation-only changes skip the expensive Portal
and Browser jobs; content, application, test, dependency, workflow, and
generated-input changes retain the relevant checks. `main` pushes still run the
full post-merge Portal and Browser verification, and the required job names are
unchanged. The workflow SHA and release-input ledger were regenerated together
so this cost correction remains hash-bound and reviewable.

## Dated draft-review PR and external Actions blocker — 2026-08-05

The additive branch is available for review as draft [PR #22](https://github.com/michaeliu3/atlas-academy-python-cs/pull/22).
Its Draft Course CI run [30971088254](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30971088254)
was rejected before runner allocation because GitHub reported failed recent
payments or an exceeded spending limit. Downstream jobs were skipped. This is
external billing state, not a passing gate, a code failure, or learner evidence.

## Dated Levels 1–9 delivery audit — 2026-08-05

The new `tests/levels-1-9-delivery-audit.test.mjs` check now audits all 63
Scope Matrix topic rows against the canonical graph. It confirms that all nine
levels are represented, every topic has graph-backed source and session
anchors, sessions stay within S1–S6, and authoring-only, preview, and ready
private-chat states are presented as delivery boundaries rather than coverage
or mastery. This is structural evidence; representative human source, visual,
and learner-facing calibration review remains open.

## Dated current-head draft content evidence — 2026-08-05

The additive branch head [`fd63dfb`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/fd63dfb0f9d2554b7fefb3c1b0eebaa661e4f101)
received Draft Course CI run [30975709181](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30975709181).
The classifier completed successfully and the draft content check passed its
91-test content suite; portal, apparatus, browser, and Python teaching-model
jobs were intentionally skipped by draft cost control. This updates the
current draft snapshot only. It is not a full-gate result, module promotion,
deployment, human review, Notion/voice evidence, or learner outcome.

## Dated canonical projection parity audit — 2026-08-05

The new `tests/canonical-projection-integrity.test.mjs` check compares the
reader manifest's state, route, prerequisite, source-map, and navigation fields
with `projectReaderModules(courseGraph)`. It passed together with the graph and
status suites, and confirms that hidden M31–M36 arc data is retained in the
canonical graph but not exposed in the reader manifest. Structural parity is
now recorded; representative rendered/dashboard review remains open.

## Dated M28–M31 mathematical-spine audit — 2026-08-05

The additive head [`d9dcc8a`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/d9dcc8aba28bc9d839bb76e31b5b23ffb8e28e96)
adds an explicit M31 bridge for the data-processing inequality,
maximum-entropy modeling, and coding interpretation, each with declared
assumptions and counterexamples. `tests/m28-m31-mathematical-spine.test.mjs`
now checks the named linear-algebra, calculus/analysis, probability/statistics,
optimization, and information-theory topics across M28–M31, while the existing
M30 breadth test remains in place. Local and Draft Course CI content validation
passed 94/94 tests in run [30976990411](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30976990411).
This is structural/content evidence; human theorem/derivation review,
assistive-technology review, module promotion, deployment, and learner evidence
remain open.

## Dated legacy contract evidence clarification — 2026-08-05

The additive head [`8065d40`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/8065d40aeb6fbf1cafedcd3f15a240f689ff2b2d) now cites the checked-in legacy contract audit and its
candidate-preflight tests. The audit resolves all 480 M1–M30 structural
criteria: 478 pointers are present, the only two ambiguous entries are the
intentional M25/M26 prerequisite-map boundaries, and no criterion is missing.
This improves the structural evidence boundary; every legacy entry remains
`legacy-baseline`/non-verified until module-specific human review, exact
source/CI/deployment provenance, and a recorded promotion decision exist. Draft
Course CI run [30977716814](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30977716814)
passed its content path with the expensive portal, apparatus, browser, and
teaching-model jobs intentionally skipped.

## Dated advanced source-ledger audit — 2026-08-05

The new `tests/advanced-source-ledger-audit.test.mjs` check binds every planned
source and claim marker in the M31–M36 authoring contracts to its checked-in
source document. It also requires stable links, access provenance, a license or
reuse boundary, and claim/rationale linkage for each module's source-ledger
input. This strengthens structural source evidence without treating research
files as human review, publication, or learner mastery.

## Dated Worker security-boundary checkpoint — 2026-08-05

The additive head [`b65ee26`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/b65ee26)
adds an apparatus regression proving that both the image-optimization and
ordinary application paths in `worker/index.ts` pass through the shared
security-header helper; the focused local test passed 3/3. The follow-up
provenance record is [`c7153a4`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/c7153a4b9f0892a08f1f5b2e298b6a09436b8176).
Draft Course CI run
[`30978304554`](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30978304554)
passed changed-file classification and the draft content path; apparatus,
browser, and teaching-model jobs were intentionally skipped. This does not
verify headers at the private deployment, close dependency alerts, or establish
security-clean status.

## Dated Actions supersession observation — 2026-08-05

Commit [`1012c58`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/1012c58)
records direct PR #22 evidence for the remaining Actions setup-cost boundary:
run [`30978504095`](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30978504095)
was cancelled after classification and Draft-content setup, while the next
run [`30978565589`](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30978565589)
was cancelled at the classifier boundary because GitHub reported a higher-
priority waiting request in the same concurrency group. This confirms
superseded-run cancellation is observed; it does not replace the future
required full non-draft gate or justify removing required checks.

## Dated release-input hash repair — 2026-08-05

Draft Course CI run
[`30978655480`](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30978655480)
correctly exposed a stale hash after the Actions-row update: the changed
`content/course/goal-compliance.v1.json` was not yet present in the
allowlisted release-input ledger. Commit
[`76b1f14`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/76b1f14)
regenerated the ledger, and local tracked-input, generated-artifact, and
matrix checks passed afterward. The failed run remains recorded as a real
source-integrity finding; it is not a release or passing CI claim.

## Dated repaired-source Draft content evidence — 2026-08-05

After commit [`76b1f14`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/76b1f14)
regenerated the release-input hash, Draft Course CI run
[`30978814516`](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30978814516)
passed changed-file classification and the full draft content path on head
[`e59db9f`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/e59db9f5a6b384c8452957dc28bab2b9f8ac07bb). The expensive portal,
apparatus, browser, and teaching-model jobs were intentionally skipped. This
confirms the repaired source-input boundary; it is not a full non-draft gate,
release, deployment, human review, or learner evidence.

## Dated final-audit surface — 2026-08-05

Commit [`1c9bd5f`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/1c9bd5f904fe50f3230a5fcf7dfab3ff5b79f6b2)
adds a current `docs/FINAL_AUDIT.md` that reconciles every generated matrix
requirement and explicitly separates complete, deferred, and uncertain
evidence. Its regression test passed locally, and Draft Course CI run
[`30979206934`](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30979206934)
passed the draft content path. The audit deliberately keeps the goal open
pending human, platform, deployment, and non-draft release evidence.

## Dated private-deployment header procedure — 2026-08-05

The additive head adds docs/DEPLOYMENT_HEADER_VERIFICATION.md, which defines a
manual, bounded observation procedure for both the ordinary Worker route and
the /_vinext/image route. The focused security-header suite passed 4/4,
including a regression that keeps the required header values and the
non-substitution claim visible. This is procedure and local-test evidence only;
the actual private deployment remains unverified.

Draft Course CI run
[30979754373](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30979754373)
passed changed-file classification and the draft content path for this
checkpoint. Portal, apparatus, browser, and teaching-model jobs were
intentionally skipped by draft cost control; this is not a deployment or
non-draft full-gate result.

## Dated live source-link transport audit — 2026-08-05

The live source audit checked all 1,068 source-map and calibration URLs and
recorded 1,038 HTTP 200, 4 HTTP 202, 4 HTTP 206, 3 HTTP 401, and 19 HTTP 403
responses. A fail-closed system-curl fallback handles the bundled Node
runtime's local trust-chain limitation without weakening TLS or treating
transport failure as reachability. This strengthens link-liveness evidence only;
the remaining citation, institutional-alignment, source-permission, and human
review boundaries remain open.

## Dated GPT Live High policy-binding checkpoint — 2026-08-05

Additive commit [`8b856cb`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/8b856cbf94945746132afb860ea0277fe1b14c58)
bound the learner-requested **GPT Live High** preference into the canonical
designated-chat workflow and validator, with a fail-closed regression test that
keeps the quality setting platform-owned. Draft Course CI run
[`30987956581`](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30987956581)
passed the changed-file classifier and Draft content feedback; the expensive
portal, apparatus, browser, and teaching-model jobs correctly skipped because
PR #22 remains draft. This is policy and structural evidence only: it does not
prove live voice rendering, a Notion write, deployment headers, human review,
module promotion, learner evidence, or a non-draft release gate.

## Dated M32 advanced-scope regression checkpoint — 2026-08-05

Additive commit [`094195f`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/094195f964a84d17ae95edd27ca1f6d6aaa6dc3a)
added a focused traceability guard for M32's required native boundary, Python,
autodiff, GPU, profiler, mixed-precision, and distributed-data-parallel
reading scope in both the canonical workbook and hidden candidate. Draft Course
CI run [`30988818302`](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30988818302)
passed the changed-file classifier and Draft content feedback. This strengthens
regression evidence only; M32 remains authoring-only and the human review,
learner delivery, deployment, release, and non-draft full-gate boundaries stay
open.

## Dated designated-chat role-binding checkpoint — 2026-08-05

Additive commit [`96a4427`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/96a4427571b9da0b967803d2caf2635d6c619e4b)
recorded the refreshed role binding delivered to the existing Teaching
Assistant and Study Partner realtime threads. A direct Codex-app readback
returned a concise acknowledgement from each chat, preserving records-off,
non-grading role boundaries, whiteboard formatting, the platform-owned GPT Live
High preference, and the ready-to-paste Notion fallback. Draft Course CI run
[`30989313009`](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30989313009)
passed the changed-file classifier and Draft content feedback. This confirms
role delivery only; substantive module teaching, voice/rendering, records-on
Notion behavior, human review, deployment, and release gates remain open.

## Dated calibration-snapshot and draft-content checkpoint — 2026-08-05

Commit [`6e0a02c`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/6e0a02ca71d77bce7043594555f99800e8a9ee2d)
aligned the learner-facing academic-calibration page with the 1,068-URL live
audit and corrected the deterministic source-audit fixture to use the current
2026-08-05 review date. Draft Course CI run
[`30982815817`](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30982815817)
passed the 95-test content path; portal, apparatus, browser, and teaching-model
jobs were intentionally skipped because PR #22 remains draft. The current
Mermaid scan is 246/246 complete. None of this is a full non-draft gate,
module promotion, private deployment, human review, or learner evidence.

## Dated current-audit provenance reconciliation — 2026-08-05

The current completion snapshot and final audit were reconciled to the latest
content-bearing snapshot [`49bda34`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/49bda3468e9dbd14ec934c5e60ac0b11b30d3e39)
and Draft Course CI run
[`30983252123`](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30983252123).
The subsequent documentation-only provenance head [`22f7e38`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/22f7e38b86815f55eb4da4f3ee165ba9c27d77a7)
also passed its classifier and 95-test content path in run
[`30984252292`](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30984252292),
while expensive apparatus, browser, Python, and portal jobs were skipped for
the draft PR. This removes stale “current head” ambiguity without changing
the open non-draft, deployment, human-review, platform, or learner-evidence
boundaries.

## Dated rendered-route truth audit — 2026-08-05

At additive head [`32a3114`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/32a3114e176d29fecd625b01f480b1e6180421a),
the bounded Node rendered-output audit passed 3/3: the truthful prerequisite-
first `/route`, the on-demand Levels 1–9 source crosswalk, and availability /
route-linkability parity against the generated manifest. This is current
route-projection evidence; it does not replace human visual, assistive-
technology, deployment, learner, or non-draft full-gate evidence.

## Dated Dependabot boundary refresh — 2026-08-05

An authenticated GitHub API readback against protected `main` at
`33fadbd49b0e33900f21aba06ed40845c3cbd641` still returned 11 open alerts (five
high, six medium), with the same package/advisory inventory recorded in the
dependency-risk register. The separate push summary still reports 12
vulnerabilities, so the discrepancy remains explicit. This refresh confirms
the current count only; candidate fixes are not resolved until normally merged
and recalculated by GitHub.

## Dated content-bearing Draft checkpoint refresh — 2026-08-05

The generated truth source now records dependency-refresh head
[`80f9ff6`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/80f9ff6658bd99332386fa7e66bb7c5f1721e544)
and Draft Course CI run
[`30985254418`](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30985254418)
as the latest **content-bearing** checkpoint. Its 95-test content path passed;
later documentation-only commits remain separately recorded. This is not a
non-draft full gate, module promotion, deployment, or learner evidence.

## Advanced-pack visual and code-reading density checkpoint — 2026-08-05

The canonical M31–M36 authoring workbooks now each carry a bounded visual map,
visible prose alternative, and code/native code-reading card. The hidden review
copies were regenerated from that single canonical body, and
`tests/m31-m36-pedagogy.test.mjs` now enforces the minimum surface. This is a
pedagogical improvement only: the six modules remain authoring-only, hidden,
unreviewed, and without release or learner evidence.

## Hosted advanced-pack content checkpoint — 2026-08-05

The content-bearing commit
[`a6add42`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/a6add42c0c135ec7e664af3241259d1df83f03f6)
passed Draft Course CI run
[`30986257553`](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30986257553):
structural contract and release-input validation, generated-artifact checks,
source freshness, and all 95 content tests passed. This is not a non-draft
full gate, module promotion, deployment, human review, or learner evidence.

## Dated live-chat quality-setting and provenance checkpoint — 2026-08-05

Additive commit
[`38b0bf2`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/38b0bf2f75807add636f9fb2e49c4032bfd04fb2)
names the learner-requested **GPT Live High** option in both designated
Teaching Assistant and Study Partner startup prompts and the whiteboard guide,
while keeping the voice-quality setting platform-owned and retaining the text
fallback. Its first hosted Draft run
[`30987062514`](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30987062514)
correctly failed because an allowlisted documentation input hash had not yet
been regenerated. Additive hash-refresh commit
[`a802275`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/a802275b0defb4cf9017e72ba252bb19ba590e8f)
and Draft run
[`30987245310`](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30987245310)
then passed structural/release-input checks, generated-artifact checks, source
freshness, and all 95 content tests. This remains Draft content evidence, not
a non-draft full gate, live voice/rendering observation, Notion write, module
promotion, deployment, or learner evidence.

## Dated test-runner cancellation checkpoint — 2026-08-05

Additive commit [`ff839b4`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/ff839b4)
hardened `scripts/run-course-tests.mjs` so SIGINT/SIGTERM forward to the
spawned test runner, Windows cancellation includes its worker tree, and signal
handlers are removed after exit. The focused lifecycle regression, local
96-test content suite, and 41-test graph/chat/advanced-pack apparatus selection
passed. Draft Course CI run
[`30990920229`](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30990920229)
passed changed-file classification and the Draft content path; expensive
portal, apparatus, browser, and teaching-model jobs were skipped because PR
#22 remains draft. This reduces orphaned work without changing required test
coverage, and it is not a non-draft full gate, deployment, human review,
learner evidence, or release claim.

## Dated Notion structure read-only checkpoint — 2026-08-05

A read-only workspace search and fetch confirmed the existing learner-owned
Notion structure: the course dashboard and knowledge map, lecture/module
notebooks, completion/evidence record, Live Codex Session Records page,
Assessments & Project Portfolio, TA Office Hours & Misconceptions, Study
Partner Journal, and Problem-Solving Lab. The fetched live-session page keeps
the records-off default, exact-chat `records on` gate, concise-note format,
whiteboard rendering convention, and unchecked live acceptance items visible.
This confirms page structure and policy text only; no learner record was
created or changed, and the actual records-on write/pause/end/delete behavior
remains open.

## Dated private-deployment access-boundary checkpoint — 2026-08-05

Read-only requests to the configured private Sites host returned HTTP 401 for
both `/` and `/_vinext/image` before the Worker application response. The
platform access boundary therefore prevented direct verification of the
repository's response-header policy. This records an authenticated-access
limitation only; it does not claim deployment success, header compliance, or
security cleanliness.

## Learner-led designated-chat kickoff checkpoint — 2026-08-05

The existing Teaching Assistant and Study Partner chats received a substantive
Module 30 kickoff through the canonical Atlas workflow. Each chat returned one
prediction-and-confidence prompt and is waiting for the learner's response.
Records remain off, no transcript or audio was copied, and no Notion write was
attempted. This proves session reachability and correct opening behavior only;
it does not prove learner evidence, a completed oral defense, voice/equation/code
rendering, or a saved note.

## Incremental Actions synchronize-classification checkpoint — 2026-08-05

The Course CI classifier now compares a pull-request `synchronize` event with
that event's previous PR head when GitHub supplies it, while preserving the
base-to-head range for opening/ready transitions and main pushes. This prevents
docs-only follow-ups on a stacked draft PR from re-running the historical
content feedback path. The classifier falls back to the conservative base range
when the previous-head field is absent; required checks and final verification
remain unchanged. Hosted savings still require a future docs-only synchronize
observation.

## Human-requirements phase waiver — 2026-08-05

The learner explicitly waived all human-only requirements for the current
phase. Human source/reuse/pedagogical/visual review, learner-led TA and Study
Partner sessions, oral-defense evidence, live rendering observation, and
learner-approved records-on Notion writes are therefore documented as
deferred rather than inferred complete. Automated contracts, focused tests,
privacy boundaries, dependency and deployment checks, additive provenance, and
the current non-draft release gate remain required; this waiver does not
permit a completion, mastery, certification, or university-equivalence claim.

## Current release-input binding checkpoint — 2026-08-05

Additive commit [`7951eba`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/7951ebaabab1b8d875b0f1bc087c1e234485b580)
refreshed the canonical SHA-256 binding for the changed Course CI workflow and
regenerated the release-input ledger. Draft Course CI run
[`30993424413`](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30993424413)
passed structural/release-input validation, generated-artifact and matrix
checks, source-link freshness, and Draft content feedback. The expensive
portal, apparatus, browser, and teaching-model jobs remained correctly skipped
under the draft policy; this is not a non-draft full gate or release claim.

## Latest dependency-alert refresh checkpoint — 2026-08-05

An authenticated `state=open` Dependabot API readback for protected `main`
commit [`33fadbd`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/33fadbd49b0e33900f21aba06ed40845c3cbd641)
returned two current alerts: high `fast-uri` (#50) and medium `postcss` (#49).
The compliance source and generated matrix now use this latest count; the
older 11-alert inventory remains preserved as historical evidence. The review
branch lockfile contains patched candidate versions, but no alert is called
resolved until a normal merge reaches `main` and GitHub recalculates.
The same additive head [`b52ad41`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/b52ad4195dfe21342880dfcfc613f3bab33d40c5)
passed the 96-test Draft content path in Course CI run
[`30994042442`](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30994042442);
the full portal, apparatus, browser, and teaching-model jobs remained skipped
because PR #22 is draft.
The compliance-pointer head [`3e76de4`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/3e76de40980ecc6b76a8933b2fff53cd6487639f)
also passed the 96-test Draft content path in run
[`30994244025`](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30994244025).
The current audit/provenance head [`8ec003b`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/8ec003bb9528e0c6be340723a4ba36c9aea5440b)
passed the same 96-test Draft content path in run
[`30994493344`](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30994493344).

## Latest current-truth full-gate checkpoint — 2026-08-05

The additive review-ready ref [`0f14e4d`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/0f14e4d891f84a6e199a6f1169b046a2e453a7e5)
passed normal non-draft Course CI run
[`31003327620`](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/31003327620):
portal quality, 422/422 Node apparatus tests, both Python teaching-model legs,
and 63/63 browser routes succeeded. The result updates current-truth
provenance only; it does not promote modules or establish deployment, human
review, Notion/voice behavior, or learner mastery.

## Bounded local apparatus attempt — 2026-08-05

The current clean head was given one bounded local
`scripts/run-course-tests.mjs --suite=apparatus` invocation. It exceeded the
120-second shell limit and was terminated with its identified Node worker tree;
no pass or failure is inferred. This reinforces that the current hosted record
is Draft content evidence, not a current apparatus/full-gate result.
