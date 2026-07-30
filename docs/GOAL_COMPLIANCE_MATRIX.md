# Atlas goal-compliance matrix

This is the living evidence matrix for the Atlas completion goal. A checkmark
means only that the cited implementation/test evidence exists; it does not turn
time spent into a degree, a guarantee of mastery, or a claim that an external
release succeeded. `In progress` means the boundary is known and tracked.

| Goal clause | Status | Implementation / test evidence | Still required before completion |
| --- | --- | --- | --- |
| One canonical graph with distinct prerequisites and route navigation | Implemented | `content/course/course-graph.v1.json`, `lib/course-catalog.ts`, `scripts/course-graph.mjs`, `tests/course-graph.test.mjs` | Audit every route, dashboard, and documentation surface against the graph as later modules publish. |
| No silent path around M31–M36 before M25/M26 synthesis | Implemented for current portal | Graph marks M25/M26 `preview`; reader/route derive released links from the graph; rendered-route tests | Reweave M25/M26 only after strict M31–M36 evidence exists. |
| Versioned module contract and release gate | In progress | `content/course/contracts/module-contracts.v1.json`, draft-only `module-contract-evidence.v2.json` pilots for M21/M27, `scripts/validate-course.mjs`, `scripts/module-contract-evidence.mjs`, and `tests/course-contract.test.mjs` | Convert M1–M30 from legacy structural inventories to reviewed contracts; add full contracts for M31–M36; make strict gate pass. Draft pointer resolution is not review or publication evidence. |
| Six connected sessions and source maps | Structural baseline only | Contract validator checks one checked-in workbook, Sessions 1–6, source-map path, graph handoff | Review actual progression, source claims, access dates, licenses, and reuse status per module. |
| First-principles / code-reading / debugging / transfer / rigorous math | In progress | Existing workbooks and studios; contract registry records pending human review | Attach module-specific evidence, derivations/counterexamples/numerical experiments where relevant, and reviewer approval. |
| Confidence-aware diagnostic, retrieval, project, oral defense, TA, Study Partner | In progress | Existing diagnostic/oral-defense code, `/learning-partners` copyable TA/Study Partner startup packages, and draft M21/M27 evidence pointers | Build standardized companions, adaptive text oral flow, review records, and module evidence/rubrics for every published module. |
| M31–M36 and reworked M25/M26 | In progress — authoring scaffold only | Graph reserves modules and dependency order; `content/course/m31-m36-prerequisite-session-bridge.v1.json` is graph-validated by `scripts/advanced-module-bridge.mjs` and `tests/course-contract.test.mjs` | Author source maps, workbooks, studios/models/tests, contracts, and release evidence; keep modules authoring-only until strict release conditions are met, then reweave M25/M26. |
| Intake, bridges, 60/90/180-day operational route | In progress | Current route and diagnostic surfaces | Validate coverage, adaptive recommendations, catch-up policy, extensions, and learner evidence records. |
| Notion workflow with explicit learner consent | In progress | Local-first portal and existing documentation | Verify/update Notion templates, manual export packets, and consent boundary; no automatic writes. |
| Visual clarity, accessibility, keyboard/screen-reader/performance checks | In progress | Existing visual studios/reader; Mermaid retains safe structural labels and an honest technical-source fallback; `e2e/accessibility.spec.ts` plus the Linux `browser-accessibility` CI job add a strict Chromium/axe gate | Record a successful Linux browser run, add per-diagram concise prose equivalents, establish performance budgets, and retrofit earlier modules. The harness is bounded automated evidence, not a completed accessibility review. |
| Local progress privacy, rendering safety, and headers | In progress | Shared versioned codec, forged-record regressions, conservative response-header tests, explicit Markdown/SVG/Mermaid allowlists, and malicious-rendering regressions | Verify production headers and continue adversarial/browser coverage; this is not a security-clean claim. |
| Deterministic, allowlisted, hashable content inputs | Implemented for checked-in course inputs and teaching-download output | `scripts/sync-modules.mjs`, `content/course/release-inputs.v1.json`, `vite.config.ts`, `tests/release-inputs.test.mjs` | Tie each deployment to an exact reviewed Git commit and release ledger; extend allowlist as contract paths become explicit. |
| Strict TypeScript, dependency risk triage, bounded lab truth | In progress | `wrangler.jsonc`, generated Worker types, strict local typecheck, GitHub Actions run 30568694668, and `docs/DEPENDENCY_RISK_REGISTER.md` | Verify Dependabot's default-branch refresh for the runtime candidate; document bounded OS/process labs accurately; retain the two development-path risks until compatible upstream remediation is verified. |
| Auditable GitHub releases and preserved change history | In progress | `docs/CONTENT_AUTHORING.md`, `CONTRIBUTING.md`, `CHANGELOG.md`, `docs/DEPLOYMENT.md` | Verify GitHub branch protection/CI/release facts, maintain additive commits and reviewable PRs, and create the provenance ledger. |

## Evidence interpretation

- **Structural baseline**: automation has checked file/graph/session/path facts.
- **Reviewed contract**: a human has attested to the teaching, source,
  accessibility, and assessment evidence required by the v1 contract.
- **Release evidence**: the exact deployed Git commit, CI run, review,
  limitations, version, and changelog entry have been recorded and are
  independently reachable.

The strict contract gate is expected to fail while the table contains
`In progress` rows. That failure is a safeguard, not a reason to weaken the
gate or rewrite the course history.
