# Live Codex learning workflow

Atlas has four deliberately separate surfaces:

<!-- live-codex-workflow: boundaries -->

| Surface | Job | What it does not claim to control |
| --- | --- | --- |
| Atlas portal | Course map, workbooks, studios, diagnostics, text oral-defense route, and copyable role briefs | Voice, microphone access, live-chat rendering, platform transcript retention, or external Notion writes |
| Teaching Assistant Codex chat | First-principles teaching, code/design reasoning, and the supportive post-module oral defense | Pass/fail grading or a claim that spoken fluency proves mastery |
| Study Partner Codex chat | Live concept discussion, retrieval, brainstorming, code-reading, and low-pressure practice | The formal oral-defense role or grading |
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

If you choose to use voice or live rendering, you may manually check the exact
two chats: start a voice session, request one display equation and one fenced
Python trace, and verify that the visible fallback remains readable after the
conversation. That is optional platform acceptance evidence—not an Atlas portal
test and never a prerequisite for normal study or the accessible text workflow.

## Module-specific follow-on contexts

Set up each designated role once from the portal's **Learning Partners** page.
After working through an open legacy workbook, its oral-defense panel offers two
module-specific follow-on contexts: one for the Teaching Assistant's
supportive defense and one for the Study Partner's rehearsal. Each is derived
from the canonical course graph's academic prerequisites and declared forward
handoff, plus a versioned teaching guide for the module.

The packet is a useful conversation starting point, not completion evidence,
a route unlock, a platform integration, or a claim that the underlying module
contract has been reviewed. Reference-preview pages do not expose full-module
follow-on contexts; authoring-only guide content is not shipped into the public
reader. The M25/M26 portal exception exposes only copyable
**preview-preparation** cards—never a full oral defense, studio, project,
route unlock, or completion claim. Separately, after the learner supplies the
  private guided route's named upstream dossiers and handoffs, the designated
  chats may begin the full M25 workbook prompts. M26 additionally requires the
  resulting M25 Next-Step Evidence Dossier, Advanced Evidence Annex, and
  carried-forward receipts. That private evidence gate does not alter portal
  access, route/Core credit, publication, release status, or the
  record/whiteboard policy below.

## Learner-authorized Notion notes

The default portal privacy boundary stays local-first: it does not initiate a
Notion request or send learner data anywhere. A portable copyable prompt stays
in `keep local` mode, because pasting it into an unrelated chat must not grant
record authority. In the learner-designated Teaching Assistant and Study
Partner chats with their configured private destination, the learner can
authorize an automatic concise Notion note after a substantive learning
conversation.

<!-- live-codex-workflow: activation -->

The documented designated-chat role policy is
`automatic-after-substantive-session`. Before a role may request an automatic
note, say “records on” in that designated chat **for the current substantive
session**. Say “end session” to close automatic session-summary authorization:
the role must not request, create, or claim a further session note unless the
learner later says `records on` for a new substantive session. An explicitly
requested correction or deletion remains separately authorized. The policy
permits at most one concise note for the current substantive session only when
all four conditions hold:

The chat should visibly acknowledge `records on` and `end session` as
**chat-level intent** to start or close this configured policy, not as proof
that a write or platform setting took effect. It should likewise acknowledge
`pause records` or `off-record` as chat-level intent to stop the policy;
neither acknowledgement is a claim of platform enforcement.

1. the conversation is in the designated TA or Study Partner chat;
2. that chat's private Notion destination is configured and reachable;
3. the learning conversation is substantive; and
4. records are not paused and the material is not marked off-record.

Treat a conversation as substantive only when all three are present:

1. a named module or learning topic;
2. learner reasoning, a concrete evidence artifact, a misconception, or a
   counterexample; and
3. a learner-controlled next action or cross-role handoff.

A greeting, scheduling exchange, or isolated administrative question is not a
substantive session and does not qualify for a note under this role policy.

The role policy never authorizes a note after every exchange or for a greeting.
“Automatic” does not prove that a write worked: neither role may claim a note
was saved without direct evidence of the successful write. If access is
unavailable or a write is not directly evidenced, it must say that no write is
verified and leave this ready-to-paste local packet in the visible chat:

```text
Notion write unverified — local session note
No Notion write is verified. Copy only this concise, learner-approved summary if useful.
- Date / role / module or topic:
- Question and prediction:
- Whiteboard trace: definition, derivation, code/architecture observation, or counterexample:
- Misconception, uncertainty, or boundary:
- Smallest next action and cross-role handoff:
Do not include raw voice, full transcripts, credentials, sensitive data, or off-record material.
```

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
off-record in Notion. The learner can say “end session”, “pause records”,
“off-record”, “correct [note]”, or “delete [note]” at any time. `end session`
closes automatic session-summary authorization; an explicit correction or
deletion request remains separately learner-authorized. The role policy treats
a pause or off-record request as a no-write request until the learner explicitly
re-enables it; the chat must not claim platform enforcement. A correction or
deletion request is completed only if direct evidence confirms it; otherwise
the chat must say no correction or deletion is verified. The target
page/database is configured in the designated chats rather than embedded in the
portal or repository.

Only after direct evidence of a successful save may the chat report the concise
note title and date, plus a link only if the platform provides one. If deletion
access is unavailable or a result cannot be verified, it must say no deletion is verified and direct the
learner to delete or archive the note in their own Notion UI; it never implies
that an unavailable deletion succeeded.

## Handoff rule

The Teaching Assistant owns the formal oral-defense conversation. The Study
Partner may prepare the learner with a non-grading rehearsal and should hand
off only the current question, attempted reasoning, uncertainty, and a possible
defense focus. Both roles keep the learner in control of the next action.
