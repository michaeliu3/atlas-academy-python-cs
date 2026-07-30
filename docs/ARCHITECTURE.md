# Architecture

## Purpose

Atlas Academy is a visual course portal plus a set of deterministic teaching
artifacts. Its architecture keeps learner-facing explanation, interactive
prediction, local model evidence, and source claims separate.

~~~mermaid
flowchart LR
    S["Source maps and original workbooks"] --> M["module synchronization"]
    M --> L["content/modules<br>rendered course library"]
    M --> D["public/downloads<br>local models + tests"]
    L --> R["Module reader"]
    I["Interactive visual studios"] --> R
    D --> V["learner inspection + behavioral tests"]
    R --> P["private deployed portal"]
    P --> N["Notion records and learning workflow"]
~~~

## Main surfaces

- The app directory contains the portal shell, course reader, diagnostic, and
  client-side visual studios. Studios use fixed data, accessibility-first
  controls, and local device state only.
- The content/modules directory and content/source-maps directory are
  checked-in, release-canonical course material. In the production authoring
  workspace, synchronization can refresh the same artifacts from an adjacent
  course source directory; a standalone GitHub clone uses its checked-in copy
  as the editable source of truth. No published workbook or source map exists
  only outside this repository.
- The public/downloads directory contains the checked-in, release-canonical
  deterministic local reference models and behavioral tests. They use fixed
  in-memory fixtures and make no external effect.
- The scripts/sync-modules.mjs program synchronizes the library manifest,
  module source, and downloadable teaching artifacts.
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
