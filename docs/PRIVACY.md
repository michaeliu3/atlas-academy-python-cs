# Privacy

## What belongs in Git

- original course material and original diagrams;
- fixed, synthetic, redacted teaching fixtures;
- source maps and publicly reachable source links;
- deterministic models/tests with no external effects;
- generic roadmap and release notes.

## What does not belong in Git

- Notion page exports, IDs, private notes, or learner journal content;
- diagnostics tied to a real person;
- credentials, API keys, tokens, cookies, headers, or deployment archives;
- raw learning events, production data, or external service responses;
- embedded runtime binaries, build output, editor caches, or local logs.

## Local storage in the portal

Interactive studios may persist only whitelisted local choices such as a view,
answer selection, confidence, and whether an explanation is revealed. They
must never persist source text, event records, names, policy decisions,
capability-like values, or secrets.

## Learner-controlled copies and prints

Copying or printing a learner summary is manual and requires the learner to
review the current concise draft first. The oral-defense, diagnostic, and M19
evidence surfaces keep this approval only in temporary page state and bind it
to the exact text being copied. If the draft changes, the prior approval is no
longer valid. The diagnostic's print path opens only its concise learning brief,
not the full result ledger.

This is a user-interface consent boundary, not a claim that a browser can stop
someone from selecting visible text manually. The portal never creates a Notion
write. The two learner-designated external Codex learning chats may
automatically create one concise record only after the learner says `records on`
in that exact designated chat for the current substantive conversation.
Saying `end session` closes automatic session-summary authority. A prior
`records on` never carries into a new or ambiguously resumed substantive
session; records are off until a fresh visible `records on` in that session.
An explicit correction or deletion remains separately authorized.
Portable copied prompts remain local.
They must exclude raw voice, sensitive data, credentials, and off-record
material, and may claim a saved note only with direct evidence. See [the live
Codex workflow](LIVE_CODEX_LEARNING_WORKFLOW.md).

## Publication decision

The repository is private by default. Before making any part public, review
the source history, generated content, downloadable artifacts, issue tracker,
release notes, and deployment configuration for personal or sensitive data.
