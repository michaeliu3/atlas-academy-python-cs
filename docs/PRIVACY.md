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

## Publication decision

The repository is private by default. Before making any part public, review
the source history, generated content, downloadable artifacts, issue tracker,
release notes, and deployment configuration for personal or sensitive data.
