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

## Continue M31–M36 after Session 1

Use this same short bridge for **M31, M32, M33, M34, M35, and M36**. It keeps a
session artifact, uncertainty, and next question visible when the learner moves
between the Study Partner and Teaching Assistant chats. These remain private,
authoring-only rehearsals—not a grade, release, unlock, or credit.

### Sessions 2–5 — Study Partner → TA checkpoint

In the designated **Study Partner** chat, paste the relevant workbook section
and say. Replace each bracketed field before sending:

```text
Continue M[31–36], Session [2–5] — [workbook session title]. The named Output
for this session is [exact artifact name]. Work only from the attached or named
section. Before you explain, ask me to predict the result and give my confidence
(0–100). Help me read or construct the artifact, change one premise, and name
one assumption or non-claim. Do not invent an experiment, source, result, or
tool execution. Use readable equations, labelled code, or compact traces with a
prose/ASCII fallback if rendering is uncertain. End with this compact TA
handoff: session and Output; attempted reasoning; prediction versus observation;
smallest artifact; one assumption or non-claim; unresolved misconception or
question; and the smallest suggested next action.
```

The learner may take that handoff to the **Teaching Assistant** for an optional
short checkpoint. The TA repairs one fragile model, reviews the actual artifact,
asks one changed-premise or transfer question, and returns one concrete repair
or next action. This is a constructive checkpoint, not the module oral defense
and not a score.

### Session 6 — supportive Teaching Assistant oral defense

Use the same Study Partner handoff after the final session, but identify the
completed dossier or packet and the learner's remaining uncertainty. Then use
the module's Teaching Assistant prompt for its **supportive Teaching Assistant
oral defense**: explanation, hint ladder, counterexample or changed premise,
transfer, reflection, and a learner-controlled evidence summary. It must stay
adaptive and non-grading; no fluent answer alone proves mastery.

For either path, say `records on` only when the learner wants the configured
concise-note policy, its approved integration is available, and the session is
substantive. Say `off-record` or `pause records` to keep the session out of that
policy. Never claim that a Notion write, voice transcript, formatting event,
publication, or completion occurred without direct evidence.

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

### Start the M32 private session

M32 remains a private, authoring-only instructor-led pack. Start it only after
the connected M12, M17, M19, M24/M28, and M31 ideas are available for repair;
this begins a learning conversation, not a portal route, grade, or completion
record. In the designated **Study Partner** chat, say `records on` only if you
want the configured concise Notion-note policy to apply. Then send or say:

```text
Start M32, Session 1 — Map responsibility before optimizing a boundary. Before
Session 1, give me the five short prerequisite retrieval checks below and direct
me to the named bridge if my reasoning is fragile. Then help me build a Boundary
Contract Map: public interface, ownership/lifetime, layout/alias/copy/residency,
version scope, and one non-claim. Make me predict one consequence of changing a
layout or lifetime premise. For every multiple-choice diagnostic, ask for my
A–D answer and 0–100 confidence before explaining it. Use readable code,
equations, and timelines with prose/ASCII fallbacks; do not grade me. End with
the smallest evidence artifact and uncertainty for the Teaching Assistant.
```

**M32 prerequisite retrieval.** Before Session 1, answer without notes: (1)
the narrowest Python-to-numerical-kernel interface and the ownership/error facts
that cross it; (2) one array operation through memory access and what remains
unknown without a named timing boundary; (3) why equal shape does not guarantee
equal mutation, traversal, cost, or numerical behavior; (4) when an
asynchronously used buffer can be reused; and (5) what one finite-difference /
autodiff agreement does not validate. If these are fragile, bridge through M12,
M17, M24/M28, M19, or M31 respectively. Do not begin by installing a framework;
this is a repair route, not a gate or grade.

**M32 time budget.** Provisionally budget **7–9 focused hours** for a
minimum-evidence first pass, or **12–16 hours** when you inspect the four
reference cards, complete the dossier, and rehearse the oral defense. Use the
90-day route if the first-week calibration already shows that the 60-day pace
would force you to skip the evidence work.

### M32 bounded reference-card set

Use these deterministic cards for code-reading and discussion. A chat with
repository access may inspect `lib/m32-systems-evidence-fixture.js`; otherwise
paste the relevant row rather than asking it to invent a backend, install a
framework, or claim a GPU/NumPy observation. They are local teaching fixtures,
not measurements of the learner's machine.

| Question | Fixed card | Bounded observation |
| --- | --- | --- |
| Does equal shape prove a safe handoff? | `m32LayoutHandoffTrace()` | Base and reversed-column layouts have the same shape but different strides; the declared positive-contiguous consumer accepts the base layout and rejects the reversed one. This is not an actual array-library, buffer-protocol, or GPU trace. |
| Does a broadcast expression prove an allocation? | `m32PairwiseTemporaryCard({ n: 4, k: 3, d: 2 })` | Logical difference shape is `[4, 3, 2]` (24 elements); output shape is `[4, 3]` (12 elements). It does not show whether a particular backend materializes that temporary. |
| When may a buffer be reused? | `m32BufferReuseTimeline("after-enqueue")` | Reuse is unsafe after enqueue and only becomes safe at the declared `after-kernel-complete` point. This is not a CUDA, HIP, JAX, or PyTorch execution trace. |
| Does a scalar gradient check validate a framework graph? | `m32ScalarReverseModeTrace({ theta: 1, x: 2, y: 1 })` | The manual analytic gradient and central-difference estimate are both `4` for this scalar fixture; that does not validate a framework graph, mutation behavior, or numerical policy. |

For each row, ask which observation is finite, which contract or assumption is
still missing, and which broad claim must remain withdrawn.

### Start the M33 private session

M33 remains a private, authoring-only instructor-led pack. In the designated
**Study Partner** chat, say `records on` only if you want the configured concise
Notion-note policy to apply. Then send or say:

```text
Start M33, Session 1 — Languages are objects; syntax is not authority. Before
Session 1, give me the three short prerequisite retrieval checks below and
direct me to the named bridge if my reasoning is fragile. Help me build a formal
claim card with alphabet/input domain, object, invariant or witness, and one
non-claim. Make me predict how one change in input, machine, or reduction
direction changes the conclusion. For every multiple-choice diagnostic, ask for
my A–D answer and 0–100 confidence before explaining it. Use readable formal
notation, code, and a prose/ASCII fallback; do not grade me. End with the
smallest proof/counterexample artifact and uncertainty for the Teaching
Assistant.
```

**M33 prerequisite retrieval.** Before Session 1, answer without notes: (1)
an invariant separating a finite test run from a proof about all inputs; (2)
the direction of a reduction that lets a solver for B solve A; and (3) why
parsing, evaluating, and authorizing a program are distinct. Bridge through
M27, M11, or M23 respectively; before Session 5, repair an unnamed input
measure or machine model through M05. This is a repair route, not a gate or
grade.

**M33 time budget.** Provisionally budget **6–8 focused hours** for a
minimum-evidence first pass, or **10–14 hours** for proof reconstruction,
counterexamples, and the dossier/oral rehearsal. Work one session at a time;
use the 90-day route if a faster calendar would make you skip the formal
argument.

### M33 bounded reference card

A chat with repository access may inspect `lib/m33-formal-languages-reference-model.js`.
Otherwise paste this exact card: `traceM33EvenOnesDfa("1010")` produces states
`even → odd → odd → even → even`; the final state is accepting. Its domain is a
binary string of at most 32 symbols. It illustrates one declared two-state
parity DFA—not a proof of regularity, undecidability, DFA equivalence, or a
claim about arbitrary input parsers. Ask what the transition table establishes
and what proof obligation remains.

### Start the M34 private session

M34 remains a private, authoring-only instructor-led pack. In the designated
**Study Partner** chat, say `records on` only if you want the configured concise
Notion-note policy to apply. Then send or say:

```text
Start M34, Session 1 — Model a state before searching it. Before Session 1,
give me the five short prerequisite retrieval checks below and direct me to the
named bridge if my reasoning is fragile. Then help me state the state, actions,
costs, observations, uncertainty, authority boundary, and one non-claim before
choosing an algorithm. Make me predict one consequence of changing an encoding,
duplicate policy, constraint, or utility. For every multiple-choice diagnostic,
ask for my A–D answer and 0–100 confidence before explaining it. Use readable
state tables, code, math, and prose/ASCII fallbacks; do not grade me. End with
the smallest evidence artifact and uncertainty for the Teaching Assistant.
```

**M34 prerequisite retrieval.** Before Session 1, answer without notes: (1)
why two graph encodings of one story can have different legal paths; (2) which
edge-cost and duplicate-policy conditions support a search-optimality claim;
(3) how a minimization relaxation changes feasible region and bound direction;
(4) why MAP and maximum expected utility can select different actions; and (5)
which formal object a complexity or reduction claim must name. Bridge through
M10/M11, M31, M30, and M33 as indicated. Do not begin by importing a solver;
this is a repair route, not a gate or grade.

**M34 time budget.** Provisionally budget **7–9 focused hours** for a
minimum-evidence first pass, or **12–16 hours** for search/constraint/decision
traces, counterexamples, and the dossier/oral rehearsal.

### M34 bounded reference-card set

A chat with repository access may inspect `lib/m34-classical-ai-reference-fixture.js`;
otherwise paste only the relevant row. These are fixed reasoning cards, not
general solvers, planners, or decision authority.

| Question | Fixed card | Bounded observation |
| --- | --- | --- |
| What does this frontier policy decide? | `chooseM34DeclaredFrontierEntry("lowest-accumulated-cost")` | It selects A (`g=1`, order 0) over B (`g=5`, order 1); the policy is still incomplete without priority, ties, duplicates, goal test, cost domain, and reopen rules. Last-in-first-out selects B. |
| What does a relaxation certify? | `evaluateM34BinaryRelaxationCandidate({ x: 1, y: 0.5 })` | Objective `3`; it is shared/relaxed feasible but not original-binary feasible. The original maximum is `2`, while the relaxation upper bound is `3`; this is not an LP/IP solver or rounding recommendation. |
| Why can no-reopen A* fail? | `m34AStarNoReopenCounterexample()` | Its admissible but inconsistent heuristic has `h(B)=2 > c(B,A)+h(A)=1`; the fixed no-reopen result has cost `4`, while reopening finds `3`. This is not a general A* conclusion. |
| Why is an action not just its most-probable state? | `m34TwoStageMdpBackupCard()` | At horizon 2, `Q(inspect)=1.5` versus `safe=1.2`, so the fixed initial policy inspects. This is not a general MDP planner, belief-state model, or authority claim. |

### Start the M35 private session

M35 remains a private, authoring-only instructor-led pack. In the designated
**Study Partner** chat, say `records on` only if you want the configured concise
Notion-note policy to apply. Then send or say:

```text
Start M35, Session 1 — Representation, inductive bias, and what a model can
discard. Before Session 1, give me the six entry-retrieval checks below and
direct me to the named bridge if my reasoning is fragile. Help me state the
representation, target, baseline information boundary, split/evaluation
relation, evidence, authority boundary, and one non-claim before discussing a
model. Make me predict one consequence of changing a feature, split, metric,
shift, seed, precision, or authority. For every multiple-choice diagnostic,
ask for my A–D answer and 0–100 confidence before explaining it. Use readable
math, labelled code, and prose/ASCII fallbacks; do not grade me. End with the
smallest ML-evidence artifact and uncertainty for the Teaching Assistant.
```

**M35 entry retrieval.** Before Session 1, answer without notes: (1) one
claim/failure probe that could falsify a stated ML observation; (2) a pair of
inputs a representation collapses even though the task must distinguish them;
(3) why a baseline needs the same information boundary and split as a learned
model; (4) the difference between lower training objective and lower target
population risk; (5) two non-source-code variables that can change training;
and (6) why a model card cannot authorize a decision. Bridge through M13, M28,
M34, M30/M31, M32, and M22 respectively. This is a repair route, not a gate or
grade.

**M35 time budget.** Provisionally budget **7–9 focused hours** for a
minimum-evidence first pass, or **12–16 hours** for the evaluation/shift plan,
training evidence, dossier, and oral rehearsal.

### M35 bounded reference-card set

A chat with repository access may inspect `lib/m35-m36-signal-routing-fixture.js`;
otherwise paste the relevant card. All rows are fully synthetic and finite;
they do not describe people, a trained production model, or a deployment.

| Question | Fixed card | Bounded observation |
| --- | --- | --- |
| Can a downstream model recover discarded information? | `m35RepresentationCollisionWitness()` | Two witnesses have the same representation but different labels, so a deterministic downstream predictor cannot separate that pair from the representation alone. This is not a generalization theorem. |
| Is a score comparison fair when information differs? | `m35BaselineComparison()` | `constant-one` and `signal-only` each have accuracy `0.5`; the disclosed synthetic rule using signal and context has `1`. The card compares different information budgets; it does not train or select a model. |
| Does equal accuracy imply equal probability behavior? | `m35CalibrationContrast()` | Both fixed cards have accuracy `0.75`, while Brier scores are `0.1875` and `0.2451`. This is not a population-calibration guarantee. |

### Start the M36 private session

M36 remains a private, authoring-only instructor-led pack. In the designated
**Study Partner** chat, say `records on` only if you want the configured concise
Notion-note policy to apply. Then send or say:

```text
Start M36, Session 1 — Risk, representation, data, and assumption scope. Before
Session 1, give me the five entry-retrieval checks below and direct me to the
named bridge if my reasoning is fragile. Help me state the population/sample
relation, loss, hypothesis class, theorem or finite-evidence scope, systems
variables, response owner, stop condition, and one non-claim before a
reliability claim. Make me predict one consequence of changing sampling,
precision, reduction order, shift, or authority. For every multiple-choice
diagnostic, ask for my A–D answer and 0–100 confidence before explaining it.
Use readable notation, code, and prose/ASCII fallbacks; do not grade me. End
with the smallest reliable-learning artifact and uncertainty for the Teaching
Assistant.
```

**M36 entry retrieval.** Before Session 1, answer without notes: (1) why a
finite average loss differs from a population expectation; (2) why optimizer
convergence does not establish generalization; (3) what makes “with high
probability” incomplete; (4) one way unchanged source can produce different
runs; and (5) why a shift monitor needs a response owner and stop condition.
Bridge through M29, M31, M33, M32, and M35 respectively. This is a repair
route, not a gate or grade.

**M36 time budget.** Provisionally budget **8–10 focused hours** for a
minimum-evidence first pass, or **14–18 hours** for theorem reconstruction,
reproducibility/monitoring evidence, dossier, and oral rehearsal.

### M36 bounded reference-card set

A chat with repository access may inspect `lib/m35-m36-signal-routing-fixture.js`;
otherwise paste the relevant row. These cards keep a theorem, finite
observation, execution scope, and authority decision separate.

| Question | Fixed card | Bounded observation |
| --- | --- | --- |
| Does a finite risk observation establish a learning claim? | `m36LearningClaimProbe()` | In its fixed sample, always-zero risk is `0.75` and always-one risk is `0.25`; the named signal-only predictor has expected accuracy `0.5` under source-balanced and `0.75` under context-heavy relation. Neither is IID evidence or a generalization theorem. |
| What does one finite-class bound require? | `m36FiniteClassSampleBoundCard()` | With `K=8`, `epsilon=0.25`, and `delta=0.05`, the displayed union-bound calculation gives sufficient `n=47` under its named finite-class assumptions. It is not a deep-network bound. |
| Is numerical reduction associative on this machine? | `m36ReductionOrderProbe()` | The fixed current ECMAScript Number evaluation gives left `1` and right `0`; that is neither a failure of real-number algebra nor a cross-platform reproducibility claim. |

For every advanced card, ask which claim type it supports, which assumption is
still missing, and which broader claim must be withdrawn before moving forward.

## M25/M26 preview guides — preserve the synthesis gate

M25 and M26 are reader-visible **previews**, not shortcuts around the advanced
chain. Use the following small chat-led orientation/rehearsal only to make
missing evidence visible. It creates no module credit, capstone result, release
decision, oral-defense result, or Notion record unless the normal `records on`
conditions already apply.

### M25 evidence-synthesis orientation (45–60 minutes)

Use this only after studying the relevant prior material. It is a way to see
the final connection, not to claim an M25 synthesis before M31–M36 receive
reviewed learner evidence. In the designated **Study Partner** chat, send:

```text
Run the M25 evidence-synthesis orientation, not the M25 module or oral defense.
Help me examine the fixed Atlas next-step suggestion as a bounded preview. Ask
me to distinguish a score, a policy, a human decision, and an authority
boundary; then ask what M30/M31, M34, M35, and M36 evidence would each need to
contribute. I will mark any artifact I have not genuinely completed and
reviewed as [UNAVAILABLE — PRESERVE PREVIEW GATE]. Ask for one A–D answer and
0–100 confidence before every diagnostic explanation. Use a readable
whiteboard with defined notation, labelled code, and prose/ASCII fallbacks.
Do not turn the orientation into a grade, an unlock, a recommendation, or an
M26 handoff. End with one narrow question to carry forward.
```

The only permitted orientation artifact is a **preview gate card**: bounded
claim; baseline; human owner; evidence type that would be needed; missing or
unreviewed receipt; and the resulting `PREVIEW ONLY` decision. It must not
invent an M31–M36 result or claim benefit, calibration, generalization,
authority, or completion. A future full M25 pass should budget about **6–8
focused hours** for minimum evidence or **10–14 hours** for a deep dossier and
supportive TA rehearsal; use the 90- or 180-day route rather than compressing
that work into a preview window.

### M26 pre-capstone architecture rehearsal (60–90 minutes)

This rehearsal uses only already available evidence to practice framing a
maintainable system. It is not the M26 studio, project, final oral defense, or
release. In the designated **Study Partner** chat, send:

```text
Run the M26 pre-capstone architecture rehearsal, not the M26 capstone or oral
defense. I will choose one bounded Atlas vertical slice using evidence I can
actually inspect. First ask me for a claim, non-goal, owner, one request trace,
one failure/rollback boundary, and what upstream M25/M31–M36 receipts would be
needed before a release decision. Make me change one premise such as a retry,
permission, dependency, or data boundary and predict what becomes unknown. Ask
for an A–D answer and 0–100 confidence before every diagnostic explanation.
Use readable maps/tables/code with prose fallbacks. End with a `REHEARSAL ONLY`
card and one next falsifier; do not issue RELEASE, REVISE, DEFER, or ROLLBACK as
a capstone decision.
```

The permitted rehearsal card names only: claim, non-goal, owner, source/test
anchor, one trace, one failure boundary, missing advanced receipt, and next
falsifier. It carries no deployment, maintainer, accessibility-conformance,
security-clean, oral-defense, or learner-completion claim. A future genuine
M26 capstone should budget about **8–10 focused hours** for a minimum evidence
bundle or **14–18 hours** for a deeper dossier, maintenance handoff, and
constructive TA defense after M25 and the advanced receipt chain are reviewed.

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
