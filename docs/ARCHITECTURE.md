# Architecture

## Purpose

Atlas Academy is a visual course portal plus a set of deterministic teaching
artifacts. Its architecture keeps learner-facing explanation, interactive
prediction, local model evidence, and source claims separate.

~~~mermaid
flowchart LR
    G["Versioned canonical course graph"] --> M["module synchronization"]
    S["Source maps and original workbooks"] --> M
    M --> L["content/modules<br>rendered course library"]
    M --> D["public/downloads<br>local models, tests + selected source maps"]
    L --> R["Module reader"]
    I["Interactive visual studios"] --> R
    D --> V["learner inspection + behavioral tests"]
    R --> P["private portal"]
    P -. "copyable role protocols" .-> C["designated Codex learning chats"]
    C -. "designated-chat concise notes" .-> N["Notion records and learning workflow"]
~~~

## Main surfaces

- The app directory contains the portal shell, course reader, diagnostic, and
  client-side visual studios. Studios use fixed data, accessibility-first
  controls, and local device state only.
- The portal has no Notion runtime integration or automatic
  portal-to-Notion data flow. The learner may use the manual private Notion
  workflow, while the two designated external Codex learning chats may
  automatically create concise session notes only after the learner says
  `records on` in that exact designated chat and a substantive conversation
  ends in their configured private record. Portable copied prompts remain local. That
  external workflow does not grant the portal microphone, voice, transcript,
  or Notion-write capability, and a saved-note claim still requires direct
  evidence.
- The checked-in `content/course/course-graph.v2.json` is the canonical course
  catalog. It separates academic prerequisites from route order and records
  source-map, studio, mastery-gate, and five independent truth facets:
  lifecycle, reader access, route availability, contract state, and release
  state.
  Route views and the generated reader manifest derive from it; no page or
  synchronizer may reconstruct its own prerequisite graph.
- The five state facets prevent an overloaded `published` label from making a
  false claim. `readerAccess` says whether material is hidden, previewable, or
  fully readable; `availability` distinguishes open legacy material from a
  verified published release; `contract` records pedagogical-evidence maturity;
  and `release` records deployment/provenance maturity. A reader visit is not
  Core progression, and `legacy-open` material is deliberately not a published
  module. The graph enforces `published` only with a verified contract and
  deployed-recorded release evidence. M25/M26 have preview reader access and
  route availability: they are reference-only material, never synthesis/
  capstone credit. [ADR 0002](adr/0002-reserve-published-for-verified-release.md)
  records the migration without rewriting historical evidence.
- Module companions deliberately have two layers: the all-module guide
  registry supplies server-derived reader context, while an individually
  versioned `content/course/contracts/companions/mNN.v1.json` record is
  required as evidence for a future review-ready or verified promotion. The
  latter binds one exact guide entry by digest and must follow the graph's
  academic forward handoff; it does not itself open a reader, create a chat,
  write Notion, or establish learner progress.
- `advanced-module-contracts.v1.json` is a retained M31–M36 authoring adapter:
  it freezes authoring inputs and prerequisite topology only. It cannot enter
  review-ready or published state, inspect or govern live learner material, or
  serve as promotion evidence. The unified v3 registry owns future module
  evidence, digest-bound review, release provenance, and availability changes.
- The content/modules directory and content/source-maps directory are
  checked-in, release-canonical course material. Synchronization reads only
  these repository-local inputs; it never falls back to an adjacent authoring
  workspace. No learner-readable workbook or source map exists only outside this
  repository.
- The public/downloads directory contains deterministic local reference models
  and behavioral tests, plus selected learner-facing source maps/addenda. Only files explicitly listed by the versioned
  `content/course/release-input-policy.v1.json` are release-canonical; CI
  rejects tracked download artifacts that have not been reviewed into that
  policy, and the production build prunes unallowlisted download output. They
  use fixed in-memory fixtures and make no external effect. Declared
  source-map/addendum copies are synchronized byte-for-byte from canonical
  repository inputs.
- The scripts/sync-modules.mjs program validates the course graph, then
  generates the library manifest, module source projection, a graph-derived
  course-status projection, and a sorted SHA-256 release-input ledger. It does
  not copy external artifacts. These projections are not curriculum input.
  Synchronization may copy declared internal source artifacts, but never
  fetches or copies an external artifact.
- The tests directory verifies the diagnostic model and rendered portal
  contract.

## Atlas knowledge spine

Every module evolves one cumulative system:

~~~text
study events
  → state + invariants
  → collections + algorithms
  → APIs + tests + architecture
  → durable data + transactions
  → execution + OS resources
  → concurrency + protocols + distributed evidence
  → security + trust boundaries
  → languages + runtime + intelligent human-centered system
  → defended capstone
~~~

## Evidence boundaries

The portal must distinguish:

1. a source/grammar/type/model observation from a production guarantee;
2. local test evidence from a remote-system claim;
3. user data from fixed teaching fixtures;
4. an authorization decision from input shape or identity alone;
5. a language rule from a CPython implementation observation;
6. a performance measurement from an intuition.

## Validation layers

| Layer | Evidence |
|---|---|
| Content | source maps, module checklists, rendered library manifest |
| Portal | lint, production build, rendered-page/interaction tests |
| Teaching models | standard-library behavioral test suites |
| Release | private deployment status, release note, known limitations |
| Learning | diagnostic, TA checkoff, Study Partner retrieval, capstone defense |

The active unified `module-contract-registry.v3.json` adds a distinct migration
layer between content and release. It has one entry per canonical module and
the same 18 criteria for every entry. The immutable legacy audit/packets and
advanced v1 authoring contract remain inputs to that registry, not competing
authorities or promotion paths.

<!-- atlas-course-status:start -->
**Canonical availability (generated from `course-graph.v2.json`):**
**36** defined modules; **30** reader-visible; **28** open for study.
- **28** `legacy-open` (M1–M24, M27–M30); full reader access, review pending.
- **0** `published` (—); only verified, deployed releases count here.
- **2** `preview` (M25–M26); reference-only, never route credit.
- **6** `authoring-only` (M31–M36); hidden from the learner reader.
- Contract states: **30** legacy baselines; **0** verified.
<!-- atlas-course-status:end -->

The structural baseline is intentionally not a claim that all pedagogical,
source, accessibility, or oral-defense evidence has been human-verified; the
strict gate remains the standard for a verified contract or release claim.

For future promotion, the registry does not trust criterion labels alone.
Review-ready requires a module-scoped evidence record that resolves all 18
criteria to Git-tracked local inputs, plus a digest-bound module review record.
For a hidden future learner candidate, the registry additionally resolves only
the fixed `content/course/contracts/review-candidates/mNN.v1.json` selector:
it freezes the eventual module workbook, source-ledger scope, and visual
Markdown scope from one clean Git-index snapshot without creating a manifest,
route, approval, or release. It cannot point at an instructor authoring
workbook or authoring-delivery map. The evidence record must bind that exact
selector as one `review-candidate-delivery` JSON-document-root input before
its digest-bound review can count. Verified additionally preserves that
bundle from an earlier review-ready commit and must match the frozen selector
to its manifest workbook and graph source map, then bind a strict candidate
commit, source-commit CI policy and evidence, unchanged candidate blobs,
matching graph release record, scoped provenance/source-review/limitation
documents, and an actual private deployment version. Those are auditable
boundaries, not claims of learner mastery or a security-clean system.

The sole pre-write exception is the module synchronizer's deterministic
manifest projection. After the future graph, registry, evidence, review, and
selector inputs are staged, it may compare its in-memory next manifest with
the frozen candidate scope in `integrity` mode. It cannot substitute graph,
registry, evidence, review, or selector facts, and normal course validation
returns to the exact clean Git-index manifest after the generated file is
staged.
