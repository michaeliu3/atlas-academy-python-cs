# Private guided learning route

Atlas has two intentionally distinct access modes:

- The **portal** is the visual reader, diagnostic, studio, and reference
  surface. Its canonical graph still controls what is open, preview-only, or
  authoring-only.
- The **private guided route** is how the course owner works through the full
  connected sequence with the designated Codex Teaching Assistant and Study
  Partner chats. It may use the six private advanced study packs below, but it
  does not change their portal availability, create route credit, or make a
  publication claim.

This is one route, not a second curriculum. If this page and
[`course-graph.v2.json`](../content/course/course-graph.v2.json) ever differ
about prerequisites or portal access, the graph wins.

## Full connected sequence

```text
M1–M5 → M27 → M6–M11 → M12–M16 → M17 → M28–M30 → M31
       → M18–M24 → M32–M36 → M25 → M26
```

The ordering is deliberate: discrete proof and algorithmic models precede
data structures; durable software precedes systems evidence; mathematical
models precede optimization; systems execution precedes advanced AI/ML; and
the final AI/systems modules integrate prior evidence rather than replacing it.

| Window | Connected focus | Learner artifact |
| --- | --- | --- |
| Day 1 | Diagnostic, pace choice, record boundary | One bridge decision and a first retrieval date. |
| Days 2–9 | M1–M5, then M27 | State trace, proof/counterexample, and cost claim. |
| Days 10–17 | M6–M11 | Representation/invariant trace and algorithm-choice defense. |
| Days 18–25 | M12–M16 | Contract, regression/review evidence, and data/transaction boundary. |
| Days 26–34 | M17, M28–M30, then M31 | Execution/mathematical assumptions and optimization evidence card. |
| Days 35–44 | M18–M24, then M32 | Cross-layer trace, resource/authority boundary, and reproducibility card. |
| Days 45–53 | M33–M36 | Formal-limit, search/decision, ML-evaluation, and reliability dossiers. |
| Days 54–55 | M25 reference-preview orientation | Evidence-grounded AI/human-control questions; no invented prerequisite or synthesis credit. |
| Days 56–60 | M26 pre-capstone rehearsal preview | Architecture-defense rehearsal and a bounded next-specialization plan; this is not the capstone. |

The 60-day plan is a demanding first pass. Use the existing
[90- and 180-day pacing rules](LEARNER_ROUTE_PLANS.md) whenever a proof, trace,
or retrieval needs more time. That document's portal/open-material schedules
are an availability plan; this page remains the full private chat-led sequence.
Expanding the calendar is a repair, not failure.

## Private advanced study packs

These six packs are structured for private instructor-led study. They remain
**authoring-only in the portal**: they are not reader-visible, published,
reviewed-release material, or evidence that a learner has completed the
advanced chain.

| Module | Private study pack | Use it to build |
| --- | --- | --- |
| M31 | [Optimization & Information](../content/authoring/m31_optimization_information_workbook.v1.md) | Formulation, constraints, finite optimization evidence, and information trade-offs. |
| M32 | [Systems Languages, Scientific Python & Accelerators](../content/authoring/m32_systems_languages_scientific_python_accelerators_workbook.v1.md) | Array/ownership/execution traces, numerical policy, and reproducible measurements. |
| M33 | [Formal Languages, Computability & Complexity](../content/authoring/m33_formal_languages_computability_complexity_workbook.v1.md) | Formal claims, reductions, limits, and complexity boundaries. |
| M34 | [Classical AI: Search, Constraints & Decision](../content/authoring/m34_classical_ai_search_constraints_decision_workbook.v1.md) | State formulation, search/constraint evidence, and bounded decision support. |
| M35 | [Machine Learning & Representation](../content/authoring/m35_machine_learning_representation_workbook.v1.md) | Representation, split/evaluation discipline, debugging, and model evidence. |
| M36 | [Learning Theory & Reliable Deep-Learning Systems](../content/authoring/m36_statistical_learning_theory_reliable_deep_learning_workbook.v1.md) | Theorem scope, reliability, shift, monitoring, and human-control boundaries. |

For each pack, work one session at a time. Paste or attach only the relevant
section to the designated chat when the chat cannot see the private repository;
do not ask it to invent missing sources, experiments, or results.

### Start the first M31 pilot

M31 remains a private, authoring-only instructor-led pack; this starts a
learning conversation, not a release, grade, or completion record. In the
designated **Study Partner** chat, first say `records on` only if you want its
configured concise Notion-note policy to apply. Then send or say:

```text
Start M31, Session 1 — Formulate before you optimize. I will build the
Objective Geometry Sheet. Before Session 1, give me the three short M28/M29/M30
retrieval checks below and direct me to the named bridge if my reasoning is
fragile. Then ask me to state the variables, feasible set, objective,
observable evidence, and one non-claim before you correct me. Make me predict
one consequence of changing a constraint. For every multiple-choice diagnostic,
ask for my A–D answer and 0–100 confidence before explaining it. Use readable
display math with defined notation and a short prose fallback; do not grade me.
End with the smallest uncertainty or evidence artifact to bring to the Teaching
Assistant.
```

Keep the session local by omitting `records on` or saying `off-record`.
After the M31 dossier, use the workbook's Teaching Assistant prompt for the
supportive oral defense; do not treat a Session 1 rehearsal as the module exam.

**M31 prerequisite retrieval.** Before Session 1, answer without notes: (1)
what a quadratic gradient and Hessian say locally, and why poor conditioning
can change an iterative computation without changing its mathematical
minimizer; (2) one stationary-point counterexample and the regularity/domain
condition needed for a derivative-based conclusion; and (3) the difference
between a full gradient and a mini-batch estimate, including what one favorable
finite run cannot establish. If these are fragile, bridge through M28, M29, or
M30 respectively before continuing. This is a repair route, not a gate or
grade.

**M31 time budget.** Budget about **6–8 focused hours** for a minimum-evidence
first pass, or **10–14 hours** when you re-derive the arguments, inspect the
traces, and complete the dossier/oral rehearsal. If the first-week calibration
in the pace guide already exceeds its threshold, choose the 90-day route rather
than skimming the mathematics.

### M31 bounded reference-trace card

Use this small, deterministic Session 4 card for code-reading and discussion;
it is an equivalent interaction, not a solver recommendation or a portal
studio. A chat with repository access may inspect
`lib/m31-optimization-authoring-model.js`; otherwise paste this card into the
chat rather than asking it to invent a trace.

| Fixture | Fixed input | Evidence to inspect |
| --- | --- | --- |
| Two-variable constrained quadratic | `m31ProjectedGradientTrace({ initialPoint: { x: 0, y: 0 }, stepSize: 0.25, iterations: 6 })` | Seven rows. Iteration 0 is `(0, 0)`, objective `5`, residual `-1`, no projection. Iteration 1 is `(0.75, 0.25)`, objective `2.125`, residual `0`, projected from raw candidate `(1, 0.5)`. Iteration 6 is approximately `(0.9921875, 0.0078125)`, objective `2.00012207`, residual `0`, with projection. |

Ask: which fields show feasibility, which show only a finite objective trace,
and which missing premise would be needed for a convergence or decision claim?
The card establishes one exact update rule on one toy fixture; it does not
establish a general convergence theorem, solver comparison, numerical
robustness, proxy validity, or authority to decide.

## How the chats run a module

1. **Study Partner first:** explain one model, draw one trace or derivation,
   change one premise, and name the uncertainty.
2. **Teaching Assistant next:** repair the fragile model, review code/design or
   proof evidence, then conduct the supportive oral defense.
3. **Visible whiteboard:** use display math with defined notation, labelled code
   blocks, state traces, and a prose/ASCII fallback whenever rendering is
   uncertain.
4. **One concise record:** after the learner says `records on` in that exact
   designated chat, when its approved Notion integration is working and the
   session is substantive, it may create one compact note. Otherwise keep the
   ready-to-paste summary in chat. Never treat a claimed write as successful
   without direct evidence.

See [Live Codex learning workflow](LIVE_CODEX_LEARNING_WORKFLOW.md) for role,
voice, whiteboard, and privacy boundaries.

The [academic calibration index](ACADEMIC_CALIBRATION.md) gives the relevant
official-course comparison notes for the whole route; use it to deepen a real
gap, not to duplicate a university course wholesale.

## Honest boundaries

- M25/M26 remain reader-visible previews until the advanced chain has the
  required release evidence; private study use does not unlock or publish them.
- A completed calendar, fluent oral explanation, green test, or AI-generated
  patch is not mastery by itself.
- The course is calibrated against rigorous open-course ideas, not equivalent
  to enrollment, academic credit, or a degree.
