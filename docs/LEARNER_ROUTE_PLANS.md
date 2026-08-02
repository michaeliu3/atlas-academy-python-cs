# Atlas learner route plans: 60, 90, and 180 days

> **Planning status — 2026-07-31.** This is a learner-facing planning policy,
> not a second course graph and not a release claim. The canonical source of
> truth for module order, academic prerequisites, reader access, route
> availability, contract state, and release state is
> [`content/course/course-graph.v2.json`](../content/course/course-graph.v2.json).
> When this document and that graph differ, the graph wins.

Atlas is designed as one connected argument: values and claims make data
structures intelligible; representation and cost make algorithms defensible;
contracts and tests make software durable; machines, math, and uncertainty
bound later systems and AI claims. The route should therefore adapt its
*calendar*, not silently drop its reasoning obligations.

This document separates four things that are easy to confuse:

1. **A calendar plan** — how much focused time a learner can protect.
2. **A reader/Core access boundary** — what may be read today and what can
   count as a route step.
3. **Release/provenance evidence** — what has actually been recorded about a
   deployment or review.
4. **Learner evidence** — what a particular learner can explain, trace,
   repair, and transfer.

Finishing a calendar is not evidence by itself. Nor is a green test, fluent
speech, or an AI-generated patch.

## Read the reader/Core access boundary first

The current graph defines 36 modules. Reader access, route availability,
contract state, and release state mean different things from a learner's
personal progress.

<!-- atlas-course-status:start -->
**Canonical availability (generated from `course-graph.v2.json`):**
**36** defined modules; **30** reader-visible; **28** open for study.
- **28** `legacy-open` (M1–M24, M27–M30); full reader access, review pending.
- **0** `published` (—); only verified, deployed releases count here.
- **2** `preview` (M25–M26); reference-only, never route credit.
- **6** `authoring-only` (M31–M36); hidden from the learner reader.
- Contract states: **30** legacy baselines; **0** verified.
<!-- atlas-course-status:end -->

## Choose the study surface before choosing a calendar

Atlas deliberately separates two ways to use the same canonical sequence:

- **Private guided course — the primary learning mode.** Work through the
  designated Codex Study Partner and Teaching Assistant chats; use the
  [private guided learning route](PRIVATE_GUIDED_LEARNING_ROUTE.md) for the
  complete chat-led sequence, including the six M31–M36 private draft packs.
  Those packs remain authoring-only in the portal and create no portal access,
  Core credit, review, or publication claim. M25/M26 remain guided
  reference-preview/rehearsal material, not synthesis or capstone credit.
- **Portal/open-material route — the visual and reference mode.** The
  calendar plans below schedule only reader-visible open material. They are a
  truthful availability plan, not a substitute for the private guided route or
  a way to unlock authoring-only material.

Open legacy material is suitable for study while its full module-contract
review remains pending. Reference previews are orientation only and do not
create synthesis or capstone credit. In the **portal/open-material route**,
authoring-only modules must not be scheduled as Core steps, simulated, or
self-certified as Atlas completion. Designated private chat-led draft study is
separate and carries the same no-credit/no-release boundary. In the graph,
`published` is reserved for a verified contract with recorded deployment
evidence—not a learner-completion signal.

The intended full narrative in the canonical route is:

```text
M1–M5 → M27 → M6–M11 → M12–M16 → M17 → M28–M30 → M31
       → M18–M24 → M32–M36 → M25 → M26
```

There are two maps inside that narrative:

- **Academic prerequisites** are the concepts that must be available before a
  module can be meaningfully attempted.
- **Previous/next route navigation** is the designed explanatory order. It
  does not erase the academic map, and a card being readable is never a
  completion signal.

M18–M24 are open legacy material with full reader access and academically reachable from
M17 through their own prerequisite chain. A learner may use them as an
explicitly labelled **open systems branch** after M17. That is useful
preparation; it is not a substitute for M31, does not change the canonical
route, and does not advance the learner into M32–M36, M25, or M26.

## Choose a pace from evidence, not optimism

The graph supplies reference-reading minutes, not a verified end-to-end time
study for every legacy workbook. The 28 currently open legacy workbooks contain
about **27 hours of reference reading** before tracing, derivation,
counterexamples, diagnostics, oral defenses, and project evidence. Treat the
following bands as planning hypotheses, then recalibrate after the first
seven days.

| Calendar | Focused time | Approximate calendar capacity | Best use | Select it when |
| --- | --- | --- | --- | --- |
| **60-day accelerated first pass** | 20–25 hours/week | 171–214 hours | A tightly scoped minimum-evidence pass through available material, with short artifacts and protected buffers. | You can reliably protect 3.5–4.5 focused hours on five or six days each week and your first-week evidence averages at most about 5.5 hours per module. |
| **90-day sustainable route** | 13–17 hours/week | 167–219 hours | The recommended default: the same connected open-material path with more time for retrieval, project revision, and repair. | You have other obligations, need mathematical rebuilding, or expect to revisit hard models more than once. |
| **180-day durable route** | 7–10 hours/week | 180–257 hours | Deliberate study, spaced recall, larger dossiers, and specialization exploration. | You want retention and architecture judgment to matter more than speed, or the first-week measurement exceeds the 90-day budget. |

The total-hour ranges overlap on purpose. The longer calendars buy spacing,
recovery, and better evidence—not a smaller version of the course. The
**90-day route is the sensible default** until actual study data says the
60-day pace is sustainable.

### Seven-day calibration rule

For the diagnostic, M1, and the first prerequisite repair, record only:

- focused minutes (not hours merely open in a browser);
- whether you could complete the minimum evidence below without rushing;
- the one model that stayed fragile after explanation; and
- the next retrieval date.

At day 7, choose the shortest route for which you have not had to omit a
proof/trace, prediction, transfer task, or oral reflection. If the average
minimum-evidence module exceeds roughly 5.5 hours, move from 60 to 90 days.
If it exceeds roughly 7 hours or recovery is repeatedly needed, move to 180
days. This is a change of calendar, not a failure.

## Start with the diagnostic, but do not overread it

The current Module 0 diagnostic is a confidence-aware route generator. It
samples **20 reasoning models** across Python execution and design,
algorithms/data structures, systems/execution layers, discrete mathematics and
proof, linear algebra, calculus, probability, optimization foundations, and
AI/ML evaluation reasoning. Repair signals link only to exact **open legacy**
sections in M1–M17 and M27–M30. It distinguishes **ready to transfer**,
**verify and strengthen**, and **repair first**; it does not issue a grade or
permission to skip dependencies.

The intake is broad, not a psychometrically validated placement examination or
a comprehensive mastery measure. Each item requires an answer and behavioral
confidence before feedback; a high-confidence answer is still a hypothesis to
test with a trace, explanation, or changed case. The optimization and AI/ML
probes name M31 and M35 only as **authoring-only future extensions**. Their
adaptive bridges begin with open legacy calculus, linear-algebra, probability,
or inference foundations and do not open, unlock, or self-certify M31–M36.

| Diagnostic signal | Next learning move | What not to do |
| --- | --- | --- |
| Correct, high confidence | Do one transfer prompt or changed-assumption explanation, then keep the prerequisite order. | Do not mark the whole module complete or skip its forward connections. |
| Correct, low/medium confidence | Read the linked section, produce a one-sentence model and one counterexample, then retrieve it the next day. | Do not treat uncertainty as a reason to reread everything. |
| Incorrect at any confidence | Use the exact linked bridge: draw/trace the smallest case, state why the chosen answer fails, and retry a changed case. | Do not hide the signal by changing the answer after reveal. |
| Incorrect, high confidence | Make this the first TA topic: name the confident but wrong rule, replace it with the smallest valid rule, and schedule two retrievals. | Do not accelerate the dependent module until the replacement model transfers. |

The portal keeps diagnostic progress in the current browser unless the learner
chooses to copy or print the learning brief. It does not automatically write
the result to Notion.

## Portal/open-material 60/90/180-day routes

### 60 days — accelerated open-material first pass

This is the fastest honest **portal/open-material** version of the course. It
can cover reader-visible material only as a **minimum-evidence first pass**;
it cannot turn M31–M36 into completed work or turn M25/M26 previews into a
capstone. If you are using the designated chats for the full private course,
follow the [private guided learning route](PRIVATE_GUIDED_LEARNING_ROUTE.md)
instead; that still does not unlock portal modules or create review/release
credit.

| Calendar window | Connected focus | Access-aware decision |
| --- | --- | --- |
| Day 1 | Module 0 diagnostic, pace selection, learning-record setup | Route repair signals to their exact open-material sections. |
| Days 2–9 | M1–M5, then M27 | Build execution, recursion, abstraction, proof, and cost before choosing structures. |
| Days 10–17 | M6–M11 | Connect representation and local invariants to algorithmic strategy. |
| Days 18–25 | M12–M16 | Make contracts, tests, delivery, persistence, and transactions preserve meaning over time. |
| Days 26–34 | M17, M28–M30 | Connect execution to linear structure, continuous change, uncertainty, and evidence. M31 remains a visible authoring/access stop. |
| Days 35–44 | M18–M24 as the labelled open systems branch | Study OS, concurrency, networks, trust, languages, and runtime evidence from M17. Do not represent this branch as completing M31 or as entering M32. |
| Days 45–53 | Retrieval, debugging, and dossier revision | No reader-open or verified M32–M36 substitute exists today. Private authoring drafts remain hidden and do not count toward this open-material route; revisit claims, math, and systems evidence instead. |
| Days 54–55 | Optional M25 preview orientation | If read, record questions and assumptions only. It produces no synthesis credit. |
| Days 56–60 | Pre-capstone evidence bundle and constructive oral rehearsal | Build a learner-owned dossier from open material. This is **not** the M26 capstone or a release defense. |

For this route, reserve at least one short buffer block every week. When a
buffer is used, move a later nonessential reading or optional preview—not the
next prerequisite repair—into the buffer.

### 90 days — sustainable, recommended open-material path

This is the default plan for a learner who wants the same foundations without
forcing a proof, trace, or explanation into a rushed slot. It uses the same
reader/Core access boundary as the 60-day plan.

| Days | Focus | Evidence emphasis |
| --- | --- | --- |
| 1–14 | Diagnostic, M1–M5, M27 | Explicit state traces, termination/proof repair, cost argument. |
| 15–35 | M6–M11 | Representation comparison, invariant recovery, algorithm-choice defense. |
| 36–49 | M12–M16 | API/data boundary, regression test, transaction or serialization trace. |
| 50–63 | M17, M28–M30 | Numerical/architecture assumption, derivation, counterexample, and uncertainty statement. |
| 64–77 | M18–M24 open systems branch | Cross-layer trace, failure boundary, trust decision, runtime observation. |
| 78–90 | Retrieval, revisions, preview orientation only if useful | One revised dossier, two delayed oral defenses, and a next specialization question. |

At current reader/Core access status, the last two weeks are deliberately not
filled with unverified reader-route M31–M36 coursework. Private authoring
drafts do not change this open-material boundary. If any module later becomes
verified and reader-open, insert it only after its canonical reader access,
availability, validated contract, and release/provenance evidence all support
that claim; then recalculate the plan.

### 180 days — durable understanding and specialization readiness

Use this route to let models decay and be rebuilt. The extra time is not a
license to drift through unrelated topics; each month must connect back to a
named artifact and a delayed retrieval.

| Days | Focus | Evidence emphasis |
| --- | --- | --- |
| 1–30 | M0, M1–M5, M27 | Explain state, contracts, induction, proof, counterexample, and cost without the workbook open. |
| 31–60 | M6–M11 | Compare data-structure/algorithm choices against a concrete workload and repair a flawed trace. |
| 61–90 | M12–M17 | Read a small architecture end-to-end: interface, test, artifact, data ownership, execution boundary. |
| 91–120 | M28–M30 | Maintain a proof/derivation/numerical-experiment notebook and challenge at least one model assumption. |
| 121–150 | M18–M24 open systems branch | Build a cross-layer incident or design dossier with evidence limits and human/trust boundaries. |
| 151–180 | Retrieval, portfolio revision, access-gated extension | Re-defend selected work after delay. If M31–M36 remain authoring-only, use this time for evidence revision, source reading, or a bounded specialization—not a fabricated equivalent module. |

When the advanced chain is genuinely verified published with the necessary contract and
release evidence, the 180-day route is the best place to add it: preserve the
canonical order M31, then M18–M24, then M32–M36, followed by reworked M25 and
M26. Do not pre-book a release date.

## Minimum learner evidence for one module

This checklist is a **learner-owned minimum**, not a claim that every current
legacy module has already passed the full publication contract. It keeps the
course focused on reading, reasoning, debugging, design, and transfer rather
than typing volume.

| Evidence | A compact, acceptable record |
| --- | --- |
| Prerequisite retrieval | State one prerequisite model from memory and use it on a small changed case. |
| Six-session spine | Visit the six connected sessions in order; for each, note the model gained and the forward question it creates. Compress examples, not the dependency logic. |
| Prediction before reveal | Preserve one pre-run trace, proof prediction, or design choice and compare it with the revealed result. |
| Boundary work | Give one assumption, counterexample, failure mode, or numerical limitation that keeps the claim honest. |
| Code/design reading | Annotate one unfamiliar snippet, architecture edge, test failure, or data path: what is promised, owned, observed, and still unknown? |
| Diagnostic signal | Answer with confidence before reveal; keep the explanation and misconception tag if a repair was needed. |
| Transfer artifact | Produce one small trace, proof sketch, experiment, test/patch review, ADR, threat note, or dossier page with an acceptance statement. |
| Oral defense and review | Hold a constructive 5–15 minute conversation: model, evidence, counterexample, transfer, reflection, and smallest next bridge. Schedule retrieval at +1 day, +7 days, and +21 days unless a module gives a more specific interval. |

The oral defense may use the designated voice-enabled Teaching Assistant Codex
chat where available or the equivalent text conversation. It is an encouraging
rehearsal, not a pass/fail exam. In the two learner-designated chats with a
configured private record, the role handoff authorizes at most one automatic
concise Notion evidence note only after the learner says `records on` in that
exact designated chat and a substantive learning conversation ends; never save
raw voice or a full transcript, and never claim the note was saved without direct
evidence.

## Catch-up without breaking the chain

Use the smallest repair that restores the model. Repeating a whole module by
default is as wasteful as skipping it.

1. **Missed one study block:** move it into the next planned buffer. Do not
   double the next day or erase retrieval.
2. **One fragile model:** complete the linked diagnostic bridge, a smallest
   trace/counterexample, and a next-day retrieval before taking the dependent
   session.
3. **Two or more fragile core models in one module:** pause its forward
   handoff, ask the TA to repair one model at a time, and revise the module
   artifact. Resume once you can explain the repair under one changed
   assumption.
4. **A week behind or repeated buffers exhausted:** move to the 90- or
   180-day calendar. Keep completed evidence; do not manufacture a fresh
   start or delete uncertainty.
5. **A release stop:** never replace M31–M36 with a preview, a generic online
   tutorial, or an AI summary and call it Atlas completion. Reallocate time to
   spaced retrieval, project revision, or clearly external study with its own
   provenance label.

The TA repairs mental models and reviews evidence; the Study Partner runs
short retrieval and changed-premise rounds. Start them in separate chats using
the portal's [Learning Partners](/learning-partners) packages. Neither role
awards a grade.

## Dossiers, reviews, and the capstone boundary

Let artifacts accumulate into a small evidence portfolio rather than a pile
of unrelated exercises.

| Arc | Suggested learner-owned dossier increment |
| --- | --- |
| Claims and algorithms | A state trace, invariant/proof sketch, counterexample, and cost comparison. |
| Durable software and data | A contract, regression test or debugging note, data/ownership boundary, and design decision. |
| Mathematics and inference | A derivation with assumptions, a numerical experiment, and a statement separating theorem/model/result. |
| Systems and trust | A cross-layer trace, failure/authority boundary, observation limit, and repair or rollback decision. |
| Pre-capstone bundle | A versioned claim, supporting evidence, known limitation, human impact, and next falsifier. It is a rehearsal until M26 is genuinely verified published. |

Review a small sample rather than rereading every page: one day later, one
week later, three weeks later, and at the next arc gate. In each review, start
from memory, then use the workbook only to repair the gap. A later revised
artifact is stronger evidence than an unchanged checklist.

## Learner-controlled records and privacy

Keep the record small enough to be useful:

| Field | Example |
| --- | --- |
| Route and date | `90-day / week 4 / 2026-08-xx` |
| Module and session | `M9, session 3 — heap invariant` |
| Evidence pointer | A local note, redacted screenshot, repository commit, or one-sentence proof/trace. |
| Confidence and repair | `medium; confused heap order with sorted order; repaired with two insert traces` |
| Next bridge and retrieval date | `compare heap vs ordered list; +7 days` |
| Record decision | `kept local`, `manually copied`, or `designated Codex → automatic concise Notion session note` |

Portal progress is local-first: Atlas itself does not write or export to
Notion. The learner-designated Codex chats may automatically make at most one
concise Notion session note only after the learner says `records on` in that
exact designated chat and a substantive learning conversation ends in their
configured private record. Keep secrets, raw voice/transcripts, personal
diagnostics, and private notes out of Git; a successful write still needs
direct evidence. See the [live Codex learning workflow](LIVE_CODEX_LEARNING_WORKFLOW.md)
and the [goal-compliance matrix](GOAL_COMPLIANCE_MATRIX.md) for the remaining
implementation work.

## What this plan does and does not promise

Atlas is benchmarked against rigorous university/open-course ideas, but a
60-, 90-, or 180-day plan is **not** a degree, academic credit, a formal
prerequisite waiver, employment guarantee, or proof of universal mastery.
It is a structured opportunity to build evidence-backed competence.

Current uncertainty remains material:

- M1–M30 are legacy structural baselines while full module-contract review
  remains incomplete; the active unified v3 registry records zero verified
  modules, and a learner's evidence and the release audit are separate facts.
- The 20-probe intake now samples the requested foundations, but remains a
  course-specific formative instrument rather than a validated placement test;
  per-module operational records and systematic review evidence are still
  being completed.
- M31–M36 have no promised release date; M25/M26 stay reader-visible previews
  without Core credit until the advanced chain becomes verified published with the
  necessary evidence and their synthesis work is reweaved.
- Real time depends on prior knowledge, accessibility needs, energy, project
  scope, and how many explanations need repair.

The defensible outcome is therefore: *I can show what I modelled, tested,
repaired, and still consider uncertain.* That is stronger—and more useful in
an AI-assisted engineering environment—than a claim that a calendar made the
knowledge permanent.
