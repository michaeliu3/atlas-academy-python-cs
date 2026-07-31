# ADR 0002: Reserve `published` for verified, deployed learner releases

**Status:** Accepted — 2026-07-31

## Context

ADR 0001 correctly separated reader access, route availability, contract
maturity, and release evidence. Its first implementation nevertheless used
`availability: "published"` for reader-visible legacy workbooks whose v3
contracts and release evidence were still incomplete. That vocabulary made an
availability fact look like a pedagogical and release claim.

The current course must remain usable while its legacy material is retrofitted;
removing the 28 readable workbooks would hide useful learning paths without
creating the missing evidence.

## Decision

The active canonical graph retains its v2 path and adds `legacy-open`:

- `legacy-open` means learner-material-ready, full-reader legacy material with
  a `legacy-v1` / `legacy-baseline` contract and unrecorded release evidence.
- `published` means learner-material-ready, full-reader material with a
  verified v3 contract and a deployed-recorded release record.
- a verified contract must use `published` availability; M25/M26 remain
  preview-only until their prerequisite chain is verified.

The graph validator, v3 registry, generated manifest, browser-progress policy,
diagnostic routing, reader surfaces, and companion prompts enforce or project
these facts. Current CI continues to run `validate:course:inputs`, which
traverses that graph and the v3 registry; it therefore rejects a proposed
`published` module that lacks full promotion evidence.

## Consequences

Existing workbooks remain available as honest study material, but the current
published count is zero. `validate:course:strict` remains a broader future
gate: it will fail until every non-preview learner route module is verified.
Historical v1 graphs, readiness audits, release records, and provenance
snapshots retain their original wording as evidence of their own time rather
than being rewritten to match this current model.
