# Module Teaching Packs

Atlas keeps Markdown and structured metadata as the canonical course source.
The module teaching-pack registry binds that source to the two designated
Codex chats, the learner PDF, the portal reader, and the local code/project
work.

## Registry

The generated registry is
[`content/course/module-teaching-packs.v1.json`](../content/course/module-teaching-packs.v1.json).
It covers all 36 graph modules and records, for each module:

- the graph-bound workbook and availability boundary;
- six workbook session anchors;
- a source-bound TA lecture pack with a copyable launch card for prediction,
  bounded code/trace, whiteboard, changed-premise moves, and handoff;
- a source-bound Study Partner project pack with a copyable launch card for
  design, learner prediction, visible partner-authored patches, honest tests,
  failure injection, review, and handoff;
- a project slice tied to a cumulative arc project;
- a code fixture or explicit non-execution boundary;
- the 60/90/180-day route labels and per-session chat delivery timing;
- evidence, retrieval, forward handoff, and rendering fields.

The registry is a contract and coverage index. `prepared-derived` means the
launch card is generated from the canonical workbook, guide, and project slice
and is ready to copy into the designated chat; `adaptationRequired: true` keeps
the live session responsive to the learner rather than pretending a script is
evidence. It is not learner evidence and it does not claim that a test, run, or
Notion write occurred. `derived-locator` remains visible where a source-bound
code slice still needs a local fixture, while `local-release-pipeline` means
the PDF can be generated and validated without committing binary output.

The six-project spine and evidence-gated M26 capstone are canonical in
[`content/course/arc-projects.v1.json`](../content/course/arc-projects.v1.json).

## Commands

```text
pnpm generate:teaching-packs
pnpm check:teaching-packs
pnpm validate:teaching-packs
pnpm generate:arc-projects
pnpm check:arc-projects
pnpm validate:arc-projects
pnpm generate:coverage
pnpm check:coverage
pnpm generate:chat-cards
pnpm check:chat-cards
```

The generated per-module status table is
[`docs/MODULE_DELIVERY_COVERAGE.md`](MODULE_DELIVERY_COVERAGE.md). It keeps
launch-card readiness distinct from executed learner evidence and from the
local PDF release manifest.

The human-readable session cards are
[`docs/CHAT_LAUNCH_CARDS.md`](CHAT_LAUNCH_CARDS.md); the JSON registry remains
the authoritative source for every field.

The validator is deliberately cheap enough for ordinary development. It
checks graph parity, six-session coverage, role boundaries, project fields,
code execution boundaries, launch-card completeness, and preview/authoring-only
restrictions. PDF generation and visual inspection remain separate local
release checks; the registry does not pretend that a PDF render or learner
interaction happened merely because a launch card exists.

## Role boundary

The Teaching Assistant is the lecture and oral-defense owner. The Study
Partner is the collaborative implementation owner and may write visible code
patches after the learner states the design brief and prediction. Neither role
may invent execution output, a test result, a benchmark, a deployment, a
Notion write, or a mastery claim.
