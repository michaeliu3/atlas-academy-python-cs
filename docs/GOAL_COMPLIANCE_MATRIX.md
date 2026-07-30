# Atlas goal-compliance matrix

This is the living evidence matrix for the Atlas completion goal. A checkmark
means only that the cited implementation/test evidence exists; it does not turn
time spent into a degree, a guarantee of mastery, or a claim that an external
release succeeded. `In progress` means the boundary is known and tracked.

| Goal clause | Status | Implementation / test evidence | Still required before completion |
| --- | --- | --- | --- |
| One canonical graph with distinct prerequisites and route navigation | Implemented | `content/course/course-graph.v1.json`, `lib/course-catalog.ts`, `scripts/course-graph.mjs`, `tests/course-graph.test.mjs` | Audit every route, dashboard, and documentation surface against the graph as later modules publish. |
| No silent path around M31–M36 before M25/M26 synthesis | Implemented for current portal | Graph marks M25/M26 `preview`; reader/route derive released links from the graph; rendered-route tests | Reweave M25/M26 only after strict M31–M36 evidence exists. |
| Versioned module contract and release gate | In progress — audited legacy inventory, not reviewed contracts | `content/course/contracts/module-contracts.v1.json`; draft-only M21/M27 v2 pointers; the allowlisted, 16-criterion `legacy-module-contract-audit.v1.json`; `scripts/validate-course.mjs`; and contract/audit mutation tests | Convert M1–M30 inventories into reviewed contracts; add full contracts for M31–M36; make the strict gate pass. A resolved pointer, audit hash, or draft record is not review or publication evidence. |
| Six connected sessions and source maps | Structural baseline, now canonical-workbook-bound | The legacy audit validates the manifest-selected workbook, six unique ordered Session 1–6 anchors, graph source-map agreement, and generated audit report | Review actual progression, source claims, access dates, licenses, reuse status, and quality per module. |
| First-principles / code-reading / debugging / transfer / rigorous math | In progress | The legacy audit separately inventories first principles, code-reading/debugging/design, prediction, transfer, and the full rigor bundle (definitions, assumptions, derivations/proofs, counterexamples, numerical experiments); all remain non-approval evidence | Attach module-specific reviewed evidence and use it to complete derivations/counterexamples/numerical experiments where relevant. |
| Confidence-aware diagnostic, retrieval, project, oral defense, TA, Study Partner | In progress | Existing diagnostic/oral-defense code, `/learning-partners` copyable TA/Study Partner startup packages, and draft M21/M27 evidence pointers | Build standardized companions, adaptive text oral flow, review records, and module evidence/rubrics for every published module. |
| M31–M36 and reworked M25/M26 | In progress — audited authoring-only boundary | Graph reserves modules/dependency order; the bridge is graph-validated; `M31_M36_PUBLICATION_READINESS_AUDIT.v1.json` is validated against its exact historical Git graph/manifest snapshot and records an explicit “Do not publish” verdict for every advanced module | Author source maps, workbooks, studios/models/tests, contracts, and release evidence; keep modules authoring-only until strict release conditions are met, then reweave M25/M26. |
| Intake, bridges, 60/90/180-day operational route | Partially implemented — 20-probe confidence-aware intake and published-foundation bridge model | `lib/diagnostic-model.js`, `app/diagnostic/DiagnosticExperience.tsx`, `tests/diagnostic-model.test.mjs`, `tests/rendered-html.test.mjs`, and `docs/LEARNER_ROUTE_PLANS.md` | Establish validated-instrument evidence and per-module review/operational records. The intake never unlocks or simulates authoring-only M31–M36. |
| Notion workflow with explicit learner consent | In progress | Local-first portal and existing documentation | Verify/update Notion templates, manual export packets, and consent boundary; no automatic writes. |
| Visual clarity, accessibility, keyboard/screen-reader/performance checks | In progress | Existing visual studios/reader; Mermaid retains safe structural labels and an honest technical-source fallback; `e2e/accessibility.spec.ts` plus the Linux `browser-accessibility` CI job add a strict Chromium/axe gate; `content/course/client-performance-budget.v1.json`, `scripts/validate-client-performance-budget.mjs`, and `tests/client-performance-budget.test.mjs` enforce reviewed raw emitted-asset, initial-entry, and code-split-studio limits | Record a successful Linux browser run, add per-diagram concise prose equivalents, and retrofit earlier modules. The artifact budget is intentionally not a network, device, or real-user performance claim; route/field performance evidence remains separate. The harness is bounded automated evidence, not a completed accessibility review. |
| Local progress privacy, rendering safety, and headers | In progress | Shared versioned codec, forged-record regressions, conservative response-header tests, explicit Markdown/SVG/Mermaid allowlists, and malicious-rendering regressions | Verify production headers and continue adversarial/browser coverage; this is not a security-clean claim. |
| Deterministic, allowlisted, hashable content inputs | Implemented for checked-in course inputs and teaching-download output | `scripts/sync-modules.mjs`, `content/course/release-inputs.v1.json`, the hashed legacy-audit input, `vite.config.ts`, generated-artifact checks, and release-input tests | Tie each deployment to an exact reviewed Git commit and release ledger; extend the allowlist only through reviewed, deterministic inputs. |
| Strict TypeScript, dependency risk triage, bounded lab truth | In progress | `wrangler.jsonc`, generated Worker types, strict local typecheck, GitHub Actions run 30568694668, and `docs/DEPENDENCY_RISK_REGISTER.md` | Verify Dependabot's default-branch refresh for the runtime candidate; document bounded OS/process labs accurately; retain the two development-path risks until compatible upstream remediation is verified. |
| Auditable GitHub releases and preserved change history | In progress | Additive Git commits on the review branch; `docs/RELEASE_PROVENANCE.md` records historical GitHub Release/tag facts and the failed browser candidate separately from release success | Verify GitHub branch protection/CI/release facts, maintain additive commits and reviewable PRs, record the next exact-commit CI result, and verify private deployment separately. |

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
