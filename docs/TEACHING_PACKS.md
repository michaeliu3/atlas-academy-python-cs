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
- a TA lecture scaffold with prediction, bounded code/trace, whiteboard, and
  changed-premise moves;
- a Study Partner AI-pair-programming scaffold that explicitly permits visible
  partner-authored patches while keeping specification, review, and evidence
  learner-owned;
- a project slice tied to a cumulative arc project;
- a code fixture or explicit non-execution boundary;
- evidence, retrieval, forward handoff, and rendering fields.

The registry is a contract and coverage index, not a claim that a scaffold is
already a fully curated lecture or project. `scaffold`, `derived-locator`, and
`not-generated` states remain visible until the corresponding learner material
is authored and reviewed.

## Commands

```text
pnpm generate:teaching-packs
pnpm check:teaching-packs
pnpm validate:teaching-packs
```

The validator is deliberately cheap enough for ordinary development. It
checks graph parity, six-session coverage, role boundaries, project fields,
code execution boundaries, and preview/authoring-only restrictions. A future
promotion gate may require every `scaffold` and `not-generated` value to be
replaced, but this focused contract does not pretend that content curation or
PDF rendering has happened merely because the registry exists.

## Role boundary

The Teaching Assistant is the lecture and oral-defense owner. The Study
Partner is the collaborative implementation owner and may write visible code
patches after the learner states the design brief and prediction. Neither role
may invent execution output, a test result, a benchmark, a deployment, a
Notion write, or a mastery claim.

