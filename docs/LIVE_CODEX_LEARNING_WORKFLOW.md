# Live Codex learning workflow

Atlas has four deliberately separate surfaces:

<!-- live-codex-workflow: boundaries -->

| Surface | Job | What it does not claim to control |
| --- | --- | --- |
| Atlas portal | Course map, workbooks, studios, diagnostics, text oral-defense route, and copyable role briefs | Voice, microphone access, live-chat rendering, platform transcript retention, or external Notion writes |
| Teaching Assistant Codex chat | First-principles teaching, code/design reasoning, and the supportive post-module oral defense | Pass/fail grading or a claim that spoken fluency proves mastery |
| Study Partner Codex chat | Live concept discussion, retrieval, brainstorming, code-reading, and low-pressure rehearsal | The formal oral-defense role or grading |
| Notion | Concise, structured learning notes and handoffs | Raw voice/transcript archive, surveillance, or automatic proof of progress |

## Voice and whiteboard protocol

Use a learner-created, voice-enabled Codex chat when the platform makes it
available. Prefer the highest selectable live quality/reasoning setting, but
the learner and platform—not Atlas—own that setting. A text-only oral-defense
route remains available in the portal.

While speaking, both partners keep the visible chat usable as a whiteboard:

- put important equations in the chat platform's supported display-math form;
- define symbols and give a line-by-line prose or ASCII fallback when rendering
  is uncertain;
- put code in language-labelled fenced blocks and trace state explicitly;
- use small labelled tables or diagrams only when they clarify a relation; and
- never rely on speech-only or visual-only explanation.

Before relying on this workflow, manually check the exact two chats: start a
voice session, request one display equation and one fenced Python trace, and
verify that the visible fallback remains readable after the conversation. That
is platform acceptance evidence, not an Atlas portal test.

## Learner-authorized Notion notes

The default portal privacy boundary stays local-first: it does not initiate a
Notion request or send learner data anywhere. The reusable chat package starts
with `Record mode: keep local`. A learner may explicitly configure the
designated Teaching Assistant and Study Partner chats to create a concise
Notion session note after a substantive learning conversation.

<!-- live-codex-workflow: activation -->

The exact enabled mode is `configured-notion-session-note`. It may create a
note only when all four conditions hold:

1. the exact enabled record mode has been selected;
2. the conversation is in the designated TA or Study Partner chat;
3. that chat's private Notion destination is configured and reachable; and
4. the learner ends a substantive session or asks for its concise summary.

The chat creates at most one concise note per substantive session, never a note
after every exchange. “Configured” does not prove that a write worked: until
the actual two chats have passed the manual platform acceptance check, neither
role may claim a note was saved. If access is unavailable, it says so plainly
and keeps the summary local.

For a configured record, keep only:

1. date, role, module/topic, and the learner's question;
2. a compact whiteboard trace: definition, derivation, code/architecture
   observation, or counterexample;
3. prediction, reasoning evidence, uncertainty, and smallest next action; and
4. a cross-agent handoff when it helps.

The Teaching Assistant also records the oral-defense prompt, repair, transfer,
and constructive next step. The Study Partner records discussion, rehearsal,
and any TA handoff. Neither record is a grade, a raw transcript, or proof of
mastery.

<!-- live-codex-workflow: controls -->

Never place credentials, raw voice, sensitive personal data, or material marked
off-record in Notion. The learner can say “pause records”, “off-record”,
“correct [note]”, or “delete [note]” at any time. A pause or off-record request
prevents a write until the learner explicitly re-enables it; a correction or
deletion request is completed only if the configured access allows it, and the
chat must say plainly if it could not complete the request. The target
page/database is configured in the designated chats rather than embedded in the
portal or repository.

## Handoff rule

The Teaching Assistant owns the formal oral-defense conversation. The Study
Partner may prepare the learner with a non-grading rehearsal and should hand
off only the current question, attempted reasoning, uncertainty, and a possible
defense focus. Both roles keep the learner in control of the next action.
