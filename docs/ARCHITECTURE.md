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
    M --> D["public/downloads<br>local models + tests"]
    L --> R["Module reader"]
    I["Interactive visual studios"] --> R
    D --> V["learner inspection + behavioral tests"]
    R --> P["private deployed portal"]
    P -. "manual, learner-controlled capture only" .-> N["Notion records and learning workflow"]
~~~

## Main surfaces

- The app directory contains the portal shell, course reader, diagnostic, and
  client-side visual studios. Studios use fixed data, accessibility-first
  controls, and local device state only.
- The deployed portal has no Notion runtime integration or automatic
  portal-to-Notion data flow. Learners and the instructor may capture approved
  learning evidence manually in the separate private Notion workflow.
- The checked-in `content/course/course-graph.v1.json` is the canonical course
  catalog. It separates academic prerequisites from route order and records
  lifecycle, learner availability, source-map, studio, mastery-gate, and
  release-evidence references. Route views and the generated reader manifest
  derive from it; no page or synchronizer may reconstruct its own prerequisite
  graph.
- The content/modules directory and content/source-maps directory are
  checked-in, release-canonical course material. Synchronization reads only
  these repository-local inputs; it never falls back to an adjacent authoring
  workspace. No published workbook or source map exists only outside this
  repository.
- The public/downloads directory contains deterministic local reference models
  and behavioral tests. Only files explicitly listed by the versioned
  `content/course/release-input-policy.v1.json` are release-canonical; CI
  rejects tracked download artifacts that have not been reviewed into that
  policy, and the production build prunes unallowlisted download output. They
  use fixed in-memory fixtures and make no external effect.
- The scripts/sync-modules.mjs program validates the course graph, then
  generates the library manifest, module source projection, and a sorted
  SHA-256 release-input ledger. It does not copy external artifacts. The
  manifest and release-input ledger are generated projections, not curriculum
  input.
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

The versioned module-contract registry adds a distinct migration layer between
content and release. Its structural baseline is intentionally not a claim that
all pedagogical, source, accessibility, or oral-defense evidence has been
human-verified; the strict gate remains the publication standard.
