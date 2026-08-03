# Module 25 — Evidence-Grounded Intelligent & Human-Centered Systems

> **Arc V — Languages, intelligence, and integration**
> **Bridge:** Module 24 taught a hard engineering habit: a benchmark, profile,
> or generated optimization is not an authority. This module applies the same
> habit to a score, model, retrieval result, visualization, or AI-generated
> suggestion. Atlas may become more helpful only if its help remains
> inspectable, bounded, and under the learner's control.

> **Expanded Atlas Core gate:** In the 60-day prerequisite-first route, do not
> use M25 as the final synthesis until M27–M36 have supplied the needed formal
> and empirical evidence: discrete proof/complexity, numerical linear algebra,
> calculus/analysis, probability/statistics, optimization/information,
> systems-for-learning, formal limits, classical AI, ML evaluation, and learning
> theory. This preview workbook remains readable now; its final-synthesis
> claim is intentionally gated on those future verified artifacts rather than inferred
> from a score or an agent explanation.

> **Preview boundary:** M25 is readable as a bounded preparation workbook.
> Until the direct prerequisites have learner-ready release evidence and M25's
> own contract/review evidence exists, its Studio, dossier, and rehearsal below
> are specifications for later use—not an unlocked synthesis, oral-defense,
> project, completion, or release-evidence claim.

> Preview mode now: you may create only a `PREVIEW ONLY` gate card and one future-M26 question.
> Do not use the later studio, dossier, oral-defense, project, or Module 26 handoff/unlock language as current learner work.

**Full-module outcome — after the gate opens:** You can read an intelligent-feature proposal as a chain
of purpose, authorized data, representation, candidate generation, score or
model, evaluation, explanation, human decision, and evidence. You can detect
leakage, distinguish a score from a calibrated probability, choose an
evaluation that matches a stated decision, review an AI-assisted patch, and
decide whether a feature is ready, not ready, or intentionally out of scope.

This is not a catalogue of AI libraries, prompt tricks, or model APIs. It is a
decision-support module. The fixed Atlas incident is simple enough to trace:
the system has several plausible next learning actions and a generated patch
wants to choose one automatically from past events and engagement clicks.
The patch may identify a useful pattern, encode leakage, amplify a bad
objective, expose private data, make an inaccessible interface, or all of
these at once. We do not get to call it intelligent before we name the
decision and collect the right evidence.

---

## How to study this module

> **Preview reading boundary:** The six-session material below is an
> orientation map for after the gate opens. Until then, create only the named
> `PREVIEW ONLY` gate card and one future-M26 question; do not turn the later
> loop, studio, dossier, rehearsal, project, or handoff into current work.

Use this loop in every session:

1. State the person, task, and decision before naming a model.
2. Label the current fact: declared need, authorized data, representation,
   score/model output, evaluation, human observation, policy decision, or
   unknown.
3. Predict the next boundary before revealing the trace or diagram.
4. Read a fixed code path, case packet, or accessible interface sketch.
5. Name one missing denominator, control, authority, or user-control path.
6. Write a bounded decision: accept, revise, defer, or reject.

The durable question is:

> Which person is being helped to make which decision, from what authorized
> evidence, under what uncertainty and cost, with what meaningful ability to
> correct or refuse the system?

### The exact cumulative invariant

> **Atlas may present a versioned, purpose-scoped suggestion only from
> authorized minimal data, a declared candidate set, and a named policy or
> model. Every suggestion preserves provenance, model/policy version,
> evaluation scope, and limitations; it exposes an accessible explanation and
> a meaningful override. A score never silently changes learner state, grants
> authority, proves truth, establishes causality, turns a click into ground
> truth, or turns an AI-generated proposal into an approved action.**

This is an Atlas teaching contract. It is not a clinical, educational, hiring,
credit, safety, or legal decision system; a fairness certification; a
production MLOps platform; a guarantee that a model is unbiased; or a claim
that an external model provider has seen, retained, or acted on nothing.

### Evidence labels

| Label | What it can establish | What it cannot establish |
|---|---|---|
| **[DECLARED USER NEED]** | A named person/task, desired outcome, non-goal, and harm hypothesis. | That a chosen metric, model, or interface helps in practice. |
| **[AUTHORIZED DATA]** | A data source is allowed for one stated purpose under the declared privacy/retention boundary. | That the data is representative, true, unbiased, or suitable as a label. |
| **[REPRESENTATION CONTRACT]** | A feature, candidate, label, schema, or transformation has declared shape and meaning. | That a model generalizes or a human understands it. |
| **[BASELINE OR MODEL OUTPUT]** | One named algorithm produced a score, ranking, class, or text proposal from declared inputs. | A probability, explanation of cause, permission, fact, or user decision. |
| **[EVALUATION UNDER MANIFEST]** | A metric/result for a declared split, population, runtime, threshold, and method. | A universal quality claim, future benefit, absence of harm, or deployment outcome. |
| **[HUMAN OBSERVATION]** | A named participant or reviewer performed/said something in a bounded study or usability task. | A population-wide preference, learning gain, consent for new purposes, or ground truth. |
| **[POLICY / AUTHORITY DECISION]** | A trusted owner approved one scoped action after the stated checks. | That the model is correct, fair, accessible, or secure. |
| **[UNKNOWN]** | Current evidence does not settle the question. | That the desired conclusion is false. |

### Runtime evidence card

~~~text
Reference: module25_reference.py (local deterministic casebook)
Tests:     test_module25_reference.py (28 behavioral seams)
Scope:     evidence-review model, not a model trainer, LLM client, or service
Runtime:   local Python evidence environment
Effects:   no network, filesystem input, external model, prompt, credential,
           learner-data, package, database, or remote-code action
Tooling I/O: the CLI accepts one enumerated scenario and writes one JSON packet
             to stdout; the behavioral test harness imports the checked-in
             local model. Those bounded tooling operations are not model effects.
Input:     fixed scenario names only
Core rule: score/output is advisory data; policy and learner control remain
           separate owners
~~~

**Runtime artifacts:** [download the local reference model](/downloads/module25_reference.py)
and [download the behavioral tests](/downloads/test_module25_reference.py).

The reference casebook uses eight fixed scenarios across six boundaries:

1. a decision-contract rejection;
2. temporal-leakage rejection;
3. a transparent baseline rank;
4. a score-versus-probability boundary;
5. a held-out evaluation card;
6. explanation and learner override;
7. an untrusted agent action request; and
8. a bounded agent-proposal review.

It makes evidence review visible. It does not train a model, evaluate a real
learner, call a provider, collect a prompt, or make a production decision.

---

## 1. Position in the knowledge system

### 1.1 The connected route

~~~mermaid
%% atlas-diagram-id: m25-connected-route
%% atlas-diagram-title: The M25 evidence route into a human-controlled decision
%% atlas-diagram-alt: Earlier modules provide logic, cost models, data contracts, systems reliability, authorization, language boundaries, and runtime evidence. These feed a declared need, candidate set, evaluation, score or model proposal, accessible human decision, and then the gated M26 capstone.
flowchart LR
    M4["M4: probability,<br/>logic, relations"] --> N["declared need + outcome"]
    M5["M5: cost and<br/>measurement"] --> E["evaluation manifest"]
    M8["M8–M11: index,<br/>graph, ranking"] --> C["candidate set + baseline"]
    M12["M12–M16: contracts,<br/>tests, data"] --> D["lineage + data contract"]
    M20["M20–M21: API,<br/>async, partial failure"] --> O["observation boundary"]
    M22["M22: privacy,<br/>authority, accessibility"] --> A["authorized data + control"]
    M23["M23: bounded query<br/>and representation"] --> D
    M24["M24: runtime<br/>evidence"] --> E
    N --> C
    D --> C
    C --> S["score/model proposal"]
    E --> S
    A --> H["accessible human decision"]
    S --> H
    H --> M26["M26: maintained<br/>capstone + defense"]
~~~

This is a concept/evidence map, not next/previous navigation. The full
canonical route reaches M31 before M18–M24. From M24, the downstream navigation
segment is **M24 → M32 → M33 → M34 → M35 → M36 → M25 → M26**. M24 is a required
systems-evidence thread, not M25's immediate navigation predecessor; the direct
M25 prerequisites in the graph have a transitive evidence closure of M27–M36.

### 1.1A The expanded-route evidence gate

The original 26-module route established the software, systems, and trust
boundaries visible above. The expanded 60-day Atlas Core adds a second evidence
spine before M25 becomes its final AI-system synthesis:

| Required earlier evidence | Why M25 needs it | What cannot be skipped |
|---|---|---|
| M27 discrete mathematics and M33 formal limits | Lets the learner distinguish a valid argument, a reduction/complexity boundary, and a plausible explanation. | A fluent AI-generated proof or solver claim is not evidence. |
| M28–M31 linear algebra, analysis, probability/statistics, optimization, and information | Lets the learner read assumptions, numerical conditioning, uncertainty, inference, objectives, constraints, and information losses. | A model metric or optimizer trace does not replace the model/data assumptions. |
| M32 systems languages, scientific Python, and accelerators | Lets the learner trace layout, precision, reproducibility, profiling, and distributed execution claims. | A GPU result does not make a numerical or operational claim portable. |
| M34–M36 classical AI, ML, and learning theory | Lets the learner formulate a decision, evaluate a model, test for shift/leakage, and read a guarantee or limitation. | A validation score does not become authority, causal benefit, or a deployment guarantee. |

At this gate, the learner must be able to name which earlier artifact supports a
claim, which assumption remains fragile, and what observation would change the
release decision. If a named depth module is still in authoring, this is an
honest reason to use M25 as a bounded preparation workbook rather than declare
the full Core synthesis complete.

### 1.1B The advanced-artifact weave

M25 is not allowed to treat M27–M36 as a list of impressive topic names. A
final-synthesis dossier must use each earlier module as a specific kind of
evidence and preserve its limitation. Until a learner-ready artifact exists,
write **[UNAVAILABLE — PRESERVE PREVIEW GATE]** rather than inventing an
equivalent claim from an AI summary, a test result, or a familiar buzzword.

| Earlier module | Artifact M25 must inspect | Where it changes the intelligent-feature decision | What M25 must refuse to infer |
| --- | --- | --- | --- |
| M27 discrete mathematics | proof/claim ledger, countermodel, and stated quantifiers | checks whether a model, metric, or policy claim actually follows from its premises | a finite positive example proves a universal property |
| M28 linear algebra and numerical stability | representation/conditioning note | checks transformations, embeddings, precision, and distance claims | a vector output is stable or meaningful because it has many dimensions |
| M29 calculus and real analysis | derivative, limit, and convergence-scope sheet | distinguishes an optimization observation from a valid local/global conclusion | a small gradient or a converged trace validates the product objective |
| M30 probability and inference | uncertainty/evaluation manifest | names the population, split, denominator, uncertainty, and alternative explanation | a score, posterior, or held-out result proves causality or user benefit |
| M31 optimization and information | objective/constraint/evidence dossier | tests proxy gaps, feasible-set changes, stopping criteria, and information-loss claims | optimizing a loss automatically chooses the right action |
| M32 systems and scientific execution | execution-transfer/reproducibility dossier | records dtype, layout, device, seed, resource, profiling, and semantic-oracle boundaries | a fast accelerator result is portable, numerically identical, or operationally safe |
| M33 formal limits | Formal Limits Claim Packet | checks encoding, reduction direction, complexity claim, and practical boundary | a timeout, failed run, or theorem label decides the usefulness of this instance |
| M34 classical AI | problem-formulation/search/constraint/decision packet | separates candidates, state, constraints, uncertainty, search result, and authority | a planner, CSP, or expected-utility output is self-authorizing |
| M35 machine learning | **Machine Learning & Representation Dossier** | checks baseline, data split, shift, objective, observability, and failure slices | a validation metric generalizes, is calibrated, or improves a learner's outcome |
| M36 learning theory and reliable deep learning | **Statistical Learning Theory & Reliable Deep-Learning Systems Dossier**, with its **Limit-and-Nonclaim Card**, **Theory–System Reproducibility Record**, and **Monitoring Extension to Reliable-Learning Evidence Map** | bounds generalization, reliability, precision, distribution, and deployment claims | a theorem, benchmark, or green reliability check is a release guarantee |

The working synthesis move is deliberately small:

~~~text
M25 decision claim
    -> cite one earlier artifact that supports one narrow part
    -> name its assumptions and non-claim
    -> add a new local observation only if it tests the same scoped question
    -> retain human control, abstention, and the next falsifier
~~~

For example, a next-step suggestion may cite M35 for an evaluation manifest,
M31 for its proxy-objective boundary, M32 for its reproducibility record,
M33 for a complexity non-claim, M34 for its candidate/constraint formulation,
and M36 for generalization limits. None of those artifacts authorizes a
learner-state mutation or a consequential decision.

### 1.1C One advanced-evidence synthesis rehearsal

After the gate opens, do not merely attach ten summaries. Revisit the fixed
next-step suggestion in Section 1.2 and write one **evidence receipt** for
each relevant earlier artifact. The narrow claim under review is:

> “For a declared synthetic fixture, Atlas may display a reversible local
> next-step suggestion with its reason and alternatives. It does not claim that
> the suggested action improves learning, diagnoses ability, or changes a plan.”

| Earlier evidence | Exact receipt to inspect | Narrow contribution to the same decision | Assumption / non-claim retained |
| --- | --- | --- | --- |
| M27 discrete mathematics | proof/claim ledger and countermodel | Makes any invariant or implication in the displayed reason explicit. | Passing fixtures do not prove a universal route property. |
| M28 linear algebra | representation/stability note | Names the representation and precision condition behind a similarity or distance statement. | A vector is not meaningful or stable merely because it has many coordinates. |
| M29 calculus/analysis | limit/derivative/convergence scope sheet | Separates a local optimization observation from a global product conclusion. | A small derivative or finite trace is not a benefit claim. |
| M30 probability/inference | inference and evaluation manifest | Declares population, time split, denominator, uncertainty, and alternative explanation. | A held-out score is not causality or user benefit. |
| M31 optimization/information | **Optimization and Information Evidence Dossier** | Exposes the ranking objective, hard constraints, proxy gap, and stopping/support boundary. | Lower loss does not choose the right human action. |
| M32 systems execution | **Scientific Python & Accelerators Dossier** | Records semantic oracle, dtype/layout/device/seed, and reproducibility conditions for an execution claim. | A local fast result is not portable, numerically identical, or operationally safe. |
| M33 formal limits | **Formal Limits Claim Packet** | States any encoding, reduction direction, resource model, or complexity claim actually used. | A timeout or theorem label does not decide this product outcome. If no formal claim is used, say so rather than decorating the dossier. |
| M34 classical AI | **Classical AI Search, Constraints & Decision Packet** | Separates candidate eligibility, constraints, state, uncertainty, and policy authority. | A solver or planner output is not self-authorizing. |
| M35 machine learning | **Machine Learning & Representation Dossier** | Supplies the baseline, split, representation, failure slice, and shift evidence for a learned proposal. | A validation result is not calibrated generalization or learner benefit. |
| M36 reliable learning | **Statistical Learning Theory & Reliable Deep-Learning Systems Dossier**, with its **Limit-and-Nonclaim Card**, **Theory–System Reproducibility Record**, and **Monitoring Extension to Reliable-Learning Evidence Map** | Names the theorem/limit scope, monitoring hypothesis, stop owner, and deployment non-claim. | A guarantee or benchmark is not a release certificate. |

One receipt may support only one narrow fragment of the claim. When the required
learner-ready artifact has not been inspected, write **[UNAVAILABLE — DEFER OR
NARROW CLAIM]**. Current authoring-only packs are private guided drafts, not
release evidence or learner credit. In the current preview, the stronger
learned-order claim therefore stays deferred; only the transparent baseline is
an orientation case.

### 1.2 The fixed Atlas incident

Atlas already has a prerequisite graph, a review scheduler, a local
transactional event history, and a bounded read/query path. A product request
says:

> “When a learner opens Atlas, show the next useful action so they do not have
> to decide from a long list.”

A generated patch proposes this shortcut:

~~~python
# Deliberately flawed review fixture — not a production recommendation.
def choose_next_action(learner, events, model):
    ranked = sorted(
        learner.available_actions,
        key=lambda action: model.predict(
            features(events, action, learner.engagement_clicks)
        ),
        reverse=True,
    )
    learner.current_action = ranked[0]
    return ranked[0]
~~~

The code is short because it hides most of the system:

| Hidden promotion | What the patch silently assumes | What a review must ask |
|---|---|---|
| Events → features | Historical records have stable, authorized meaning for this purpose. | Which fields, time window, missing-value rule, and retention policy apply? |
| Click → label | Exposure and clicking measure successful learning. | Was the item shown? Did the learner have a meaningful alternative? What outcome is actually intended? |
| Model score → rank | Scores are comparable across candidates and learners. | What is the candidate set, baseline, tie rule, calibration status, and distribution boundary? |
| Rank → mutation | Top score is permission to overwrite a learner's current choice. | Who owns the decision and how can the learner inspect, reject, or undo it? |
| Passing test → benefit | A deterministic unit test proves user value. | What evaluation and human observation justify that claim? |

The course response is deliberately more explicit:

~~~text
declared user task and non-goal
  → purpose-scoped, minimized data contract
  → candidate generation and visible baseline
  → named feature/model/ranking representation
  → held-out evaluation + uncertainty + runtime cost
  → accessible explanation and learner override
  → separately authorized state change, if the learner requests one
  → redacted evidence, limitation, and release decision
~~~

**Stopping line:** a predicted score is not a decision. A fluent answer is not
a fact. A retrieved document is not validated evidence. A user interaction is
not automatically a label. A higher metric is not automatically a better
human outcome.

### 1.3 The three decisions that must remain separate

~~~text
1. Inference decision
   “Given declared inputs, what score, rank, or proposal does this mechanism emit?”

2. Product-policy decision
   “When may Atlas show, suppress, delay, or label that proposal?”

3. Human/authority decision
   “What may this person choose, approve, change, or refuse?”
~~~

The model may participate only in the first decision. A policy owner and
learner control own the other two. This separation preserves the Module 22
trust boundary even when an LLM, classifier, ranker, or recommender is added.

---

## 2. Session 1 — A score is not a useful outcome

### Pressure

“The system recommends the top item, so it is helping.”

That statement has skipped from a computation to a claim about a person. We
need an outcome and a comparison before we choose a feature, model, or metric.

### Derive decision support from a real choice

Suppose a learner sees ten possible next actions. Atlas does not need to
replace the learner; it needs to reduce decision friction without hiding
important tradeoffs. Start with an ordinary decision contract:

| Field | Example Atlas answer |
|---|---|
| Person and task | A learner chooses one next review or prerequisite action. |
| Desired outcome | The learner can make an informed, reversible next-step choice. |
| Non-goal | Atlas does not diagnose ability or force a schedule. |
| Baseline | Show the existing ordered list and prerequisite context. |
| Candidate harm | A confident-looking recommendation hides alternatives or uses a stale record. |
| Human control | Show reason/evidence, allow dismissal and choice, preserve no automatic mutation. |
| Evidence needed | Offline ranking comparison plus a bounded usability observation. |

The result is a smaller, testable claim:

> “For the declared local fixture, Atlas can present a reversible next-step
> suggestion with a visible reason and alternatives.”

It is not:

> “Atlas knows what this learner should do.”

### The decision-support ladder

~~~mermaid
%% atlas-diagram-id: m25-decision-support-ladder
%% atlas-diagram-title: Decision support keeps model output separate from human choice
%% atlas-diagram-alt: A person and task establish a baseline and candidate set. A score proposes an ordering, while evaluation and authorization constrain the display. An accessible human decision produces only bounded, redacted evidence rather than an automatic state change.
flowchart LR
    U["person + task<br/>[DECLARED USER NEED]"] --> B["existing baseline"]
    B --> C["declared candidates"]
    C --> P["score / rank proposal<br/>[MODEL OUTPUT]"]
    P --> X["explanation + uncertainty"]
    X --> H["learner chooses, dismisses,<br/>or requests an action"]
    H --> R["bounded, redacted evidence"]
~~~

### Prediction exercise

Which statement is the narrowest useful first feature goal?

A. “Use AI to make learners study more.”  
B. “Train the most accurate model possible.”  
C. “For a declared candidate set, display one reversible suggestion with its
reason and alternatives.”  
D. “Automatically set the next action whenever confidence is high.”

<details>
<summary>Reveal after writing your prediction.</summary>

**Reveal:** C. A and B do not name a person-facing decision or safety
boundary. D gives a score authority it has not earned.

</details>

### Code-reading lab — find the missing owner

Read the generated patch in Section 1.2. Mark where each question should be
owned:

1. Which actions are candidates?
2. Which data is allowed to influence the score?
3. What does one score mean?
4. When can an interface show the proposal?
5. Who can make a state-changing choice?
6. What evidence remains after dismissal?

Then redraw the code as six components. Do not repair the ranking yet. The
first repair is to stop one function from owning the entire system.

### Session artifact

Create a one-page **Decision Contract** with the fields in the table above,
one concrete counterexample, and this sentence:

> “If the suggestion is wrong, Atlas must still allow the learner to ______.”

### TA check

The TA asks: “What existing behavior is your baseline, and what harm would
make a higher click rate a worse result?” A response that names only a model
metric returns to this session. A response that names a user task, baseline,
and harm moves forward.

---

## 3. Session 2 — Data becomes a claim only through lineage

### Pressure

“The history is already in the database, so it is valid training data.”

Stored data has a schema and origin. It does not automatically have consent,
stable meaning, representative coverage, a suitable label, or a legitimate
future-use purpose.

### First-principles lineage model

An event can support different questions at different times. Make every
transformation visible:

~~~mermaid
%% atlas-diagram-id: m25-lineage-time-boundary
%% atlas-diagram-title: Event lineage and the temporal evaluation boundary
%% atlas-diagram-alt: A study event enters a validated store, then a past-only feature builder, an explicitly defined label/outcome, a time-aware split, an evaluation record, and a minimized observation. Each arrow names a separate time, purpose, or authority boundary.
flowchart LR
    E["StudyEvent<br/>time, action, confidence"] --> V["validated event store"]
    V --> F["feature builder<br/>past-only window"]
    V --> L["declared outcome/label<br/>observed later"]
    F --> S["train / validate / test split"]
    L --> S
    S --> M["baseline or model"]
    M --> Q["ranked proposal"]
    Q --> A["purpose-scoped display"]
    A --> O["minimized observation"]
~~~

### Feature, label, and outcome are different things

| Term | Question it answers | Example | Common error |
|---|---|---|---|
| Feature | What information does the mechanism receive at decision time? | Time since last review. | Including a future completion result. |
| Label/outcome | What later fact evaluates a prediction? | A declared follow-up recall check. | Treating “clicked” as proof of learning. |
| Target | What is the model asked to estimate? | Probability that a stated review outcome occurs. | Changing the target after seeing metric results. |
| Policy outcome | What product result matters? | Learner can choose a useful next step without coercion. | Treating model accuracy as the full outcome. |

### The time-arrow test

For a time-indexed learning system, draw a vertical decision line:

~~~text
past events ──────── | decision time | ─────── future outcome
available feature    | suggestion    | label/evaluation only
~~~

If a value crosses from the right side into a left-side feature, the model may
know the answer before it is supposed to predict it. That is leakage. A random
split is not automatically wrong, but it must be justified against the
deployment history and correlations. A temporal question normally needs a
temporal holdout.

### Code-reading lab — the flattering evaluation

~~~python
# Deliberately flawed evaluation fixture.
rows = build_rows(all_events)
train, test = random_split(rows)
model.fit(train.features, train.completed_next_review)
report(model, test)
~~~

Ask:

1. Does build_rows include only facts known at the decision time?
2. Can rows from one learner or event sequence leak across the split?
3. Does random splitting resemble the future deployment question?
4. What does completed_next_review actually measure?
5. Is any included field unauthorized for this purpose?

Replace none of the code yet. First write a data contract that says what
would make the evaluation invalid.

### Data-readiness veto

Before a row can become training or evaluation material, name its label origin
and likely error path. A missing, selectively observed, or post-decision label
can change the question rather than merely reduce sample size. For the fixed
case, ask whether a learner saw the item, could decline it, had time to act,
and whether the later recall check actually measures the intended outcome.

Write a **do-not-train/defer trigger** such as: “Do not fit or compare a model
until the label origin, missingness/selection mechanism, and decision-time
availability are specified.” This is an evidence boundary, not a data-cleaning
ritual or a claim about a real learner population.

### Session artifact

Create a **Lineage and Split Card**:

~~~text
decision time:
authorized source fields:
feature definitions:
label/outcome definition:
label origin, likely error, and exposure/selection risk:
candidate population:
train / validation / held-out rule:
known missingness or selection risk:
do-not-train/defer trigger:
retention/redaction rule:
strongest allowed claim:
~~~

### TA check

The TA moves one fact from “future outcome” to “feature.” Explain exactly why
the evidence changes. If the answer is only “that is cheating,” restate the
time/availability model in plain language.

---

## 4. Session 3 — Candidates, rankers, and models do different jobs

### Pressure

“The model gave it 0.93, so it should be first.”

A number cannot be interpreted until we know which candidates it was compared
against, which objective it approximates, whether it is calibrated, and which
policy turns a rank into an interface action.

### Start with an inspectable baseline

Atlas already has useful non-ML machinery:

- Module 9's priority/scheduling structures;
- Module 10's prerequisite graph;
- Module 11's explicit objective and tie policy;
- Module 16's durable state;
- Module 23's narrow, authorized metric/query boundary.

A baseline can combine declared facts without hiding them:

~~~text
candidate score =
    3 × overdue-review flag
  + 2 × prerequisite-unlocks value
  + 1 × learner-selected priority
  - 4 × invalid-or-unavailable flag
~~~

The arithmetic is not a law of learning. It is an Atlas policy with visible
weights, valid domains, tie rule, and test cases. Its main teaching value is
that we can trace it before comparing it with a learned alternative.

### Candidate generation, scoring, ranking, and policy

~~~mermaid
%% atlas-diagram-id: m25-candidate-score-policy
%% atlas-diagram-title: Candidate generation, scoring, ranking, and policy are distinct
%% atlas-diagram-alt: A candidate generator produces eligible actions. A baseline or model assigns scores, a stable rank applies a tie rule, policy selects a display, and the learner can choose or override. M22 authorization constrains the display path.
flowchart LR
    G["candidate generator<br/>M9/M10 constraints"] --> S["baseline or model score"]
    S --> R["stable rank + tie rule"]
    R --> P["product display policy"]
    P --> H["learner choice / override"]
    H --> W["optional state-change workflow"]
    A["M22 authorization"] --> W
~~~

### A small model is still a model

For one optional learned alternative, use a fixed, readable linear score:

~~~text
raw = b
    + w1 × overdue_days
    + w2 × prerequisite_unblocks
    - w3 × recent_exposure
probability-like output = sigmoid(raw)
~~~

The calculation creates a number. It does not prove:

- the weights were trained appropriately;
- the output is calibrated;
- the variables cause an outcome;
- scores are comparable outside the evaluated population;
- one model should override the transparent baseline;
- an automated action is permitted.

### Code-reading lab — recover the model boundary

~~~python
def rank(candidates, scorer):
    scored = [
        (candidate, scorer.score(candidate))
        for candidate in candidates
        if candidate.is_available
    ]
    return sorted(scored, key=lambda pair: (-pair[1], pair[0].stable_id))
~~~

Trace one input with three candidates. Then identify:

1. the candidate eligibility owner;
2. the scorer contract;
3. the stable tie rule;
4. the missing score-range/meaning contract;
5. the code location where a display policy must be added;
6. why changing scorer output cannot quietly mutate a learner record.

### AI-era review prompt

An agent proposes replacing the baseline with an embedding/LLM ranking call.
Before discussing library choice, require it to state:

- the exact candidate objects and data allowed into the request;
- how each candidate is represented and redacted;
- the fallback if the provider is unavailable or uncertain;
- how a response is evaluated against the same baseline;
- why the response cannot choose tools, permissions, or state changes;
- the cost, retention, and supplier assumptions that remain unknown.

If it cannot answer these questions, the proposal is not yet a model design.

### Session artifact

Create a **Ranker Boundary Map** containing candidate contract, baseline,
optional model contract, score label, tie rule, display policy, learner
override, and prohibited automatic effects.

---

## 5. Session 4 — Evaluation, calibration, and uncertainty

### Pressure

“Accuracy went up, therefore the feature works.”

A metric is an instrument, not a verdict. It answers a question only for the
population, split, threshold, and loss it actually measures.

### Choose the metric from the product question

| Product question | Candidate evidence | Required qualifier |
|---|---|---|
| Does the top of the list contain a later-positive item? | precision@k / recall@k under declared labels | k, population, exposure, label definition, temporal split |
| Does a binary classifier separate declared classes? | confusion matrix, precision, recall, false-positive/negative costs | threshold, base rate, split, and costs |
| Does a reported 0.8 behave like a probability? | calibration/reliability analysis | population, bins/sample uncertainty, holdout/calibration method |
| Is a new model better than the transparent baseline? | paired comparison under the same candidate and split manifest | baseline definition and uncertainty |
| Can the interface be used to make the intended choice? | task observation plus accessibility review | participant/task scope; no broad population claim |
| Does it fit the runtime budget? | Module 24-style controlled measurements | runtime, host, workload, metric scope |

### Calibration is a contract about a number

If Atlas calls a number “80% likely,” the label implies a relationship between
reported values and observed outcomes. A score ordered from high to low may be
useful for ranking without being calibrated. Conversely, a calibrated
probability does not establish that the chosen action will cause the outcome.

~~~mermaid
%% atlas-diagram-id: m25-calibration-control
%% atlas-diagram-title: A raw score, calibration evidence, and human choice are different claims
%% atlas-diagram-alt: A raw score can support ordering. Separate calibration evidence can support a probability interpretation for a stated population. A policy chooses a display, and a human makes the final choice.
flowchart LR
    S["raw score"] --> R["may support ordering"]
    S --> C["separate calibration evidence"]
    C --> P["probability label only<br/>within declared population"]
    P --> D["display/decision policy"]
    D --> H["human choice"]
~~~

### Denominators and uncertainty

A report that says “9 of 10 predictions were correct” has omitted the
population, class balance, sampling rule, threshold, and uncertainty. Ask:

- Out of which candidate opportunities?
- Which predictions were shown to a person?
- What counts as positive, negative, unavailable, or abstained?
- What did the baseline do on the same cases?
- Which segment, time window, or new condition is not represented?
- How much could a small sample move the reported value?

Do not manufacture precision from a tiny fixture. A confidence interval,
resampling method, or sample-size limitation is evidence of uncertainty, not a
failure of the project.

### Code-reading lab — reject the wrong conclusion

~~~text
Model A: 92% accuracy
Model B: 90% accuracy
Decision: deploy Model A
~~~

The report is incomplete. Write the questions needed before a decision:

1. What is the baseline class rate?
2. What is the false-positive and false-negative consequence?
3. Were both evaluated on the same temporal holdout and candidate set?
4. Does either output claim to be a probability?
5. Does either degrade an important slice or accessibility path?
6. What runtime/retention cost did M24-style evidence reveal?

### M24 handoff — model cost is a separate claim

A lower model-evaluation loss does not prove lower latency or memory use. A
faster local inference sample does not prove better ranking. Record model
version, runtime, host, candidate count, warm-up, metric boundary, and
retention/caching policy separately from statistical evaluation. One evidence
card may cite another; it cannot absorb its scope.

### Session artifact

Create an **Evaluation Card**:

~~~text
claim and decision:
baseline:
population/candidate rule:
temporal or other split:
label/outcome:
metrics and denominators:
threshold/rank/display rule:
uncertainty and unsupported slices:
slice/temporal-shift challenge and display/revise/defer consequence:
runtime/resource manifest:
privacy/retention effect:
strongest allowed conclusion:
next falsifier:
~~~

### TA check

The TA asks: “What would have to be true before you call this number a
probability?” Then changes either the base rate, population, time window, or
threshold and asks which conclusion survives.

---

## 6. Session 5 — Explanations, accessibility, and meaningful control

### Pressure

“We added a chart and an explanation, so the AI is transparent.”

A visual explanation can be inaccessible, misleading, or merely a plausible
story. A text explanation can expose data or imply causality. Transparency is
not a decoration; it is a product contract tied to what the person can
actually decide.

### Derive the decision card

An Atlas suggestion should let the learner answer four ordinary questions:

1. What is Atlas suggesting?
2. Which declared facts contributed to the visible reason?
3. What uncertainty, limitation, or alternative matters?
4. What can I choose, change, dismiss, or inspect next?

~~~mermaid
%% atlas-diagram-id: m25-accessible-decision-card
%% atlas-diagram-title: The accessible decision card gives a reason, limitation, alternatives, and control
%% atlas-diagram-alt: Suggestion identity leads to a plain-language reason, a limit or uncertainty label, alternatives, and controls. The same information is available by text and assistive-technology paths; feedback does not automatically become a reward label.
flowchart TB
    I["suggestion identity"] --> R["plain-language reason"]
    R --> L["limit / uncertainty label"]
    L --> A["alternatives + learner controls"]
    A --> F["bounded feedback observation"]
    T["text equivalent + keyboard<br/>and assistive-technology path"] --- I
    T --- R
    T --- L
    T --- A
~~~

### Explanation categories

| Explanation | What it may honestly say | What it must not imply |
|---|---|---|
| Input/rule trace | “This item is overdue and unlocks a declared prerequisite.” | “These facts caused your learning result.” |
| Model feature summary | “This score used these versioned inputs.” | “The model understands you.” |
| Comparison | “This item ranked above these eligible alternatives under this policy.” | “All other actions are wrong.” |
| Limit | “This suggestion uses a fixed local fixture / limited history.” | “The system has no uncertainty.” |
| Provenance | “This text came from a named, reviewed source bundle.” | “Retrieved text is automatically true or current.” |

### Accessible visualization rule

For every chart, color, animation, and hover-only detail, provide an
equivalent semantic path:

- a heading and concise purpose;
- a text/table summary of the comparison;
- labels that do not rely on color alone;
- keyboard-operable controls with visible focus;
- no required drag gesture or timed reaction;
- readable contrast, zoom, and reduced-motion behavior;
- an explicit error/empty/unknown state.

Automated checks can find some defects. They cannot prove that a person
understood a suggestion, that the explanation is useful, or that the product
caused a positive outcome. Include a bounded task observation.

### Feedback is not an automatic label

A learner may dismiss a suggestion because it is wrong, badly timed, already
completed elsewhere, emotionally unhelpful, inaccessible, or simply not the
current priority. “Accepted,” “dismissed,” and “ignored” require separate
event meanings, optional collection, retention policy, and a way for the
learner to inspect or withdraw the record where the product policy requires
it.

### Code-reading lab — repair a coercive card

~~~text
Recommended now: Recursion
Confidence: 93%
[Start now]
~~~

List what is missing. A minimum repair must add a human-readable reason,
uncertainty/limit, alternatives, a dismiss/choose-later path, and semantic
controls. It must not claim “93% confidence” unless Session 4 evidence
supports that exact label.

### Session artifact

Create an **Accessible Decision Card Specification** with:

- content hierarchy and text equivalent;
- reason, limitation, and alternative wording;
- keyboard and screen-reader control behavior;
- explicit user controls and no-auto-mutation rule;
- feedback-event meanings and privacy rule;
- one bounded usability task and one nonclaim.

### TA check

The TA role-plays a learner who cannot use color, a mouse, or a confidence
label. Explain how the same decision can still be understood and controlled.
If the answer is “add a tooltip,” redraw the decision card.

---

## 7. Session 6 — AI/agent proposals are systems, not authorities

### Pressure

“The assistant retrieved documents and wrote a good answer. Let it update the
learner plan.”

A generative model can synthesize, rank, or draft. It does not inherit the
right to choose records, tools, permissions, facts, or state changes. The
Module 22 boundary still applies; the Module 23 distinction between text,
structure, and authority still applies; the Module 24 demand for scoped
evidence still applies.

### A bounded AI-assistance architecture

~~~mermaid
%% atlas-diagram-id: m25-bounded-ai-assistance
%% atlas-diagram-title: Bounded AI assistance keeps proposal generation separate from action authority
%% atlas-diagram-alt: A learner request is validated, then a fixed authorized context builder feeds a model or retrieval adapter. Output validation and provenance produce a proposal for learner choice. A separate evaluation harness records limits; no model proposal receives automatic state-changing authority.
flowchart LR
    Q["learner request<br/>[INPUT DATA]"] --> V["validate intent + scope"]
    V --> C["fixed context builder<br/>authorized, redacted facts"]
    C --> M["model or retrieval adapter<br/>proposal only"]
    M --> E["output validation + provenance label"]
    E --> D["accessible decision card"]
    D --> H["learner approval / rejection"]
    H --> W["separately authorized workflow"]
    P["tool/capability policy"] --> W
    X["evaluation harness + limits"] --> M
~~~

### Retrieval, generation, and tool use are different boundaries

| Mechanism | Useful question | Dangerous shortcut to reject |
|---|---|---|
| Retrieval | Which reviewed source fragments are relevant to a request? | “A retrieved fragment proves the final answer.” |
| Generation | Can a model draft a bounded explanation from the supplied context? | “Fluent output is verified fact.” |
| Tool call | Can a trusted policy grant one narrow capability after validation? | “Model text selects any tool or argument.” |
| Agent patch | Can an agent propose a constrained code change? | “The agent's summary or tests prove the design.” |

Do not build prompt-injection demonstrations in this workbook. The defensive
design lesson is sufficient: untrusted content, retrieved text, model output,
and user text remain data; none may alter authority, developer constraints,
or capability selection.

### AI-patch review

An agent proposes:

~~~text
1. Send every event note to an external model.
2. Let the model return a JSON action.
3. Automatically apply that action when its confidence is above 0.9.
4. Store the full prompt/response for future training.
~~~

Reject the proposal before implementation. It violates, at minimum:

- data minimization and purpose limitation;
- context/provenance review;
- output-as-authority promotion;
- uncalibrated confidence interpretation;
- learner override and accessibility requirements;
- retention/redaction policy;
- evaluation and supplier/failure boundaries.

Write a smaller alternative: a local fixed-fixture explanation proposal that
has no tool access, no state mutation, no real notes, a named fallback, and a
human acceptance step. Its usefulness still requires evaluation; its safety
still requires the earlier boundaries.

### Release decision table

| Outcome | Minimum evidence | Example |
|---|---|---|
| **ACCEPT (bounded)** | decision contract, lineage, transparent baseline, evaluation card, accessible control, privacy review, limitation | local suggestion is shown with alternatives and cannot change state automatically |
| **REVISE** | useful mechanism but missing evidence/control | score may rank fixtures, but probability label and feedback policy are unsupported |
| **DEFER** | plausible idea lacks representative data/evaluation or runtime/supplier boundary | external-model feature has no consent, retention, or failure plan |
| **REJECT** | authority, privacy, accessibility, or semantic violation | model response directly mutates learner schedule |

### Session artifact

Create a **proposal-boundary packet** containing a capability ledger, one
rejected-action test, a redacted/local-only fallback, and an evidence-card
release recommendation. While M25 is preview-gated, this is a preparation
artifact only: it creates no oral-defense, project, completion, or release
credit and cannot unlock Module 26.

### TA and Study Partner rehearsal

The TA asks:

1. What exact human decision is supported?
2. Which data may enter the mechanism, and why?
3. What does the score/output establish—and not establish?
4. Which evaluation result supports the display?
5. How can the learner refuse, correct, or undo it?
6. Which capability remains outside the model's reach?

The Study Partner becomes an overconfident assistant. They make one false
claim—“retrieved means true,” “confidence means probability,” “a click is a
label,” “the model can update state,” or “the chart is accessible.” The learner
must identify the boundary, state a counterexample, and propose the next
evidence-producing action.

---

## 8. Intelligent Systems Evidence Studio

When M25 is eligible after its gate, its visual studio is a fixed, accessible
**Intelligent Systems Evidence Studio**, not a live model dashboard. The current
preview records this interaction specification; it does not expose a completed
studio, mastery record, or final-synthesis route.

~~~text
declared learner task
    ↓
authorized / minimized data
    ↓
candidates + transparent baseline
    ↓
optional bounded model proposal
    ↓
evaluation, uncertainty, and runtime evidence
    ↓
accessible explanation + learner control
    ↓
scoped evidence and capstone handoff
~~~

It has six prediction-first views:

1. **Decision contract** — name person, task, baseline, harm, and non-goal
   before selecting a model.
2. **Lineage inspector** — move a field across the decision-time boundary and
   predict whether it becomes leakage, an unauthorized feature, or a label.
3. **Ranker trace** — compare candidate generation, transparent baseline, and
   optional model output while showing tie rules and nonclaims.
4. **Evaluation board** — choose a metric, denominator, split, and uncertainty
   label; distinguish score order from calibrated probability.
5. **Decision-card review** — inspect accessible text equivalents, alternatives,
   overrides, and feedback meanings.
6. **Agent boundary** — trace validated request, fixed context, proposal,
   output validation, human choice, and separate workflow authority.

Every visual fact has a text equivalent. Controls use native buttons, visible
focus, keyboard operation, reduced motion, and only whitelisted local progress
state. The studio accepts no prompt, personal note, real model response,
training data, credential, or network request.

---

## 9. Confidence-aware diagnostic

Choose an answer, record confidence, then explain the missing evidence before
reading the rationale.

### Q1 — Purpose

Which is the best first claim for an Atlas next-step feature?

A. “The model will know what the learner should study.”  
B. “A top-ranked item may be written directly to the schedule.”  
C. “For a declared candidate set, Atlas can show a reversible suggestion with
its reason and alternatives.”  
D. “The feature maximizes engagement.”

<details>
<summary>Reveal after recording your answer and confidence.</summary>

**Answer: C.** It names the bounded task and preserves human control. A and D
are vague/overclaiming. B grants an inference result authority it does not own.
</details>

### Q2 — Leakage

Which field is invalid as a feature for a prediction made on Monday?

A. The number of reviews completed before Monday.  
B. The prerequisite graph version available on Monday.  
C. The learner's recall result recorded on Wednesday.  
D. The candidate's stable identifier.

<details>
<summary>Reveal after recording your answer and confidence.</summary>

**Answer: C.** Wednesday's result is future information for a Monday
prediction. It may be a declared later outcome/label, not an available feature.
</details>

### Q3 — Score versus probability

A ranker emits 0.82 for one candidate. What may be concluded immediately?

A. The learner has an 82% chance of success.  
B. The candidate ranks above every possible action.  
C. The named mechanism emitted 0.82 for this candidate under its input
contract.  
D. Atlas may automatically select the action.

<details>
<summary>Reveal after recording your answer and confidence.</summary>

**Answer: C.** Calibration and an outcome definition are needed for A. The
candidate set and tie rule constrain B. D is a policy/authority decision.
</details>

### Q4 — Baseline

Why is a transparent baseline required before a more complex model claim?

A. All models are forbidden.  
B. It supplies a comparable existing method and exposes whether added
complexity improves the stated decision under the same evidence conditions.  
C. It makes evaluation unnecessary.  
D. It proves a model is unfair.

<details>
<summary>Reveal after recording your answer and confidence.</summary>

**Answer: B.** A baseline is a reference point, not a verdict. It supports a
like-for-like comparison and makes complexity/cost visible.
</details>

### Q5 — Evaluation

Model A has higher accuracy than Model B on a held-out set. What is still
needed before showing Model A's numeric output as a confidence percentage?

A. A better name for the model.  
B. Calibration evidence for the declared outcome/population and a display
policy.  
C. A larger font.  
D. Direct permission to mutate learner state.

<details>
<summary>Reveal after recording your answer and confidence.</summary>

**Answer: B.** Accuracy and calibration answer different questions. A
probability label also needs a policy decision. D remains separate.
</details>

### Q6 — Feedback

A learner dismisses a suggestion. Which conclusion is safest?

A. The suggestion was objectively wrong.  
B. The learner rejected the display at that time; the product must define what,
if anything, this observation means and may retain.  
C. The model should always lower this item's score.  
D. The learner has revoked every data permission.

<details>
<summary>Reveal after recording your answer and confidence.</summary>

**Answer: B.** A dismissal has several possible meanings. It is not automatic
ground truth, a training rule, or a universal consent signal.
</details>

### Q7 — Accessibility

Which decision-card feature is required even when the chart is visually clear?

A. A color gradient with more shades.  
B. An equivalent text/table explanation and keyboard-operable alternatives.  
C. A longer model name.  
D. A hidden hover tooltip.

<details>
<summary>Reveal after recording your answer and confidence.</summary>

**Answer: B.** A chart cannot be the only semantic path. Color-only and
hover-only information exclude users and make the decision harder to audit.
</details>

### Q8 — AI-era authority

A model returns a valid-looking JSON instruction after reading retrieved text.
What is the correct next step?

A. Execute it because the format is valid.  
B. Treat it as a proposal; validate it against a fixed contract and require the
separate policy/human authority for any effect.  
C. Trust it if the model labels itself confident.  
D. Store the full prompt and response indefinitely.

<details>
<summary>Reveal after recording your answer and confidence.</summary>

**Answer: B.** Structure is not authority. Retrieval, generation, confidence,
and logging each need their own boundary and retention decision.
</details>

### Diagnostic routing

| Miss pattern | Repair route |
|---|---|
| outcome/baseline confusion | Module 4 probability/logic; Module 11 objectives; Session 1 |
| lineage/leakage confusion | Module 13 specifications; Module 16 data; Session 2 |
| score/model boundary confusion | Modules 8–11; Session 3 |
| metric/calibration/cost/shift confusion | Module 5; Module 24; M35–M36 evidence routes; Session 4 |
| explanation/accessibility/control confusion | Module 22; Session 5 |
| model/agent authority confusion | Modules 22–23; Session 6 |

---

## 10. Problem ladder and Atlas project

### Problem ladder

1. **Recognize:** label a statement as user need, authorized data, model
   output, evaluation, human observation, policy decision, or unknown.
2. **Trace:** follow one historical event through feature construction, a
   time split, scoring, display, and learner override.
3. **Map:** recover the candidate, scorer, policy, data, and authority
   boundaries in an unfamiliar generated feature patch.
4. **Modify:** change a transparent baseline's tie rule or reason label while
   preserving candidate and no-auto-mutation contracts.
5. **Debug and defend:** find leakage, an invalid denominator, a false
   probability claim, or an inaccessible control; justify the smallest repair.
6. **Design and delegate:** write a bounded agent brief for one display or
   evaluation adapter, with allowed data, prohibited effects, and acceptance
   evidence.
7. **Review and verify:** inspect the returned patch in dependency order,
   challenge the agent's claims, run independent checks, and record
   accept/revise/defer/reject with a limitation.
8. **Transfer:** apply the same model/policy/human separation to a search
   ranking, a dashboard, an external LLM assistant, or an unfamiliar
   open-source recommendation feature.

### Project — Atlas Next-Step Evidence Studio

> **Future full-module project:** Use this only after the M25 preview gate opens.
> In preview, create only the `PREVIEW ONLY` gate card; do not create a Module 26 handoff packet.

Produce an evidence dossier and a small, local/reproducible vertical slice,
not a production recommender race. The project includes:

### Next-Step Evidence Dossier

- a Decision Contract with user task, baseline, non-goal, harms, and human
  control;
- Lineage and Split Card using synthetic/redacted fixtures and a declared
  decision time;
- candidate-generation, transparent-baseline, and optional small-model map;
- score semantics, tie policy, and no-automatic-state-change assertion;
- Evaluation Card with metrics, denominators, split, uncertainty, runtime
  evidence, limitation, and next falsifier;
- accessible Decision Card specification with reason, limit, alternatives,
  keyboard/text path, dismissal/override, and feedback meaning;
- one bounded AI/agent patch brief and an evidence-based acceptance decision;
- privacy/retention review and a local-only/proposal-only fallback;
- a Module 26 handoff packet: architecture map, claim ledger, open questions,
  and release recommendation.

### Advanced Evidence Annex — required only after the preview gate opens

The final-synthesis version of this dossier also carries a short annex. It is
not a request to recreate ten modules. It is a traceability table: every
advanced artifact supplies one bounded claim, its assumptions, and its
non-claim to the feature decision.

| Evidence row | Minimum visible anchor | If the artifact is not learner-ready |
| --- | --- | --- |
| M27/M33 formal reasoning | claim, quantifiers/encoding, counterexample or reduction boundary | write **[UNAVAILABLE — no formal claim promoted]** |
| M28/M29 numerical reasoning | representation, numerical condition, derivative/limit scope | write **[UNAVAILABLE — no numerical/convergence claim promoted]** |
| M30/M35 empirical learning | population, split, baseline, uncertainty, shift/failure slice | write **[UNAVAILABLE — no benefit/generalization claim promoted]** |
| M31 objective and information | objective, constraint, proxy gap, stopping/support boundary | write **[UNAVAILABLE — no optimization-to-value inference]** |
| M32 execution | semantic oracle, precision/layout/device/seed/profiling note | write **[UNAVAILABLE — no portability/performance claim promoted]** |
| M34 classical AI | state/candidate/constraint/utility/authority formulation | write **[UNAVAILABLE — no planner/decision authority]** |
| M36 reliability | theorem/limit scope, reproducibility record, deployment non-claim | write **[UNAVAILABLE — no reliable-learning release claim]** |

In the current preview, this annex is an orientation template only. A blank
row is evidence of a gate, not a defect to paper over with generated prose.

### Cross-artifact conflict exercise — revise the claim, not the evidence

Suppose the M35 receipt shows a higher held-out ranking metric, but the M31
receipt shows that the objective optimizes a click proxy rather than the stated
learner outcome. M32 then reveals that the comparison changed dtype/layout and
cannot yet reproduce the same semantic result. M33 limits a claimed solver
guarantee, M34 changes the candidate constraint, and M36 withdraws an IID or
reliability conclusion after a named temporal shift.

Do not average these concerns into a confidence score. Fill this compact board:

| Evidence conflict | Smallest justified repair | Decision now | Next falsifier |
| --- | --- | --- | --- |
| Metric improved but the proxy/constraint is wrong | restore the decision contract or compare against a better-aligned baseline | **REVISE** or **DEFER** | a scoped outcome/utility observation |
| Reproduction or semantics changed | restore the declared execution condition before comparing | **DEFER** learned-order claim | semantic-oracle and environment record |
| Candidate, formal, or distribution premise changed | restate the candidate set, formal scope, or population | **NARROW** to the remaining supported display claim | counterexample or shifted-slice evaluation |

End with one counterexample and one revised claim. A fluent agent explanation,
green test, or higher metric cannot overrule the narrowest missing receipt.

The reference implementation may be mostly agent-generated only after the
learner has named the contracts and tests. Manual coding is limited to the
small portions that reveal a mechanism: candidate eligibility, deterministic
tie handling, a past-only feature boundary, a metric denominator, or an
accessible control state.

### Acceptance rubric

| Dimension | Emerging | Ready for Module 26 |
|---|---|---|
| User purpose | starts with a model/tool | names user task, baseline, harm, non-goal, and reversible choice |
| Data lineage | calls database rows “training data” | states availability time, authorized fields, outcome, split, and retention |
| Ranking/model | treats score as recommendation | separates candidates, score, rank, display policy, and state authority |
| Evaluation | reports one accuracy number | supplies metric, denominator, baseline, split, uncertainty, and nonclaim |
| Advanced synthesis | invokes mathematics, systems, or ML by reputation | attaches every relevant M27–M36 receipt, exposes one genuine evidence conflict, revises the claim under a changed premise, and preserves the preview gate when a receipt is unavailable |
| Human-centered design | adds visual polish after scoring | provides reason, limit, alternatives, accessible path, and meaningful override |
| AI-era judgment | accepts fluent output or green tests | bounds context/tools/effects and independently reviews patch evidence |
| Communication | announces a feature | gives claim, evidence, scope, limitation, and next falsifier |

---

## 11. Teaching team protocol

### TA guide

The TA does not begin by teaching a library call. Use this hint ladder:

1. **Purpose hint:** “Who is deciding what, and what exists before your
   feature?”
2. **Time hint:** “Draw the moment the suggestion is made. Which fact arrives
   only afterward?”
3. **Representation hint:** “Is this a candidate, feature, label, score,
   policy, or state change?”
4. **Evidence hint:** “What is the denominator? What same-condition baseline
   would challenge the claim?”
5. **Human hint:** “How does a keyboard/screen-reader user understand and
   refuse this?”
6. **Authority hint:** “Which capability did the model actually receive, and
   which one did it not receive?”

Record high-confidence misconceptions as explicit regression prompts:

- “A high score is a high probability.”
- “A click proves a recommendation was useful.”
- “More data is automatically allowed data.”
- “A random split automatically predicts future behavior.”
- “A clear chart is accessible.”
- “A retrieved or generated answer may perform its own action.”

### Study Partner routine

Before each session, the Study Partner asks for a two-minute backward trace:

> “Take one M24 measurement claim and one M22 authorization fact. Where do
> they appear in today's decision-support chain, and what do they still not
> prove?”

After each session, switch roles:

1. one partner draws the relevant boundary map without notes;
2. the other changes one fact—time window, data purpose, base rate, candidate
   set, label, accessibility need, model availability, or authority;
3. the first partner names the broken claim and the smallest new evidence;
4. both record confidence and one future retrieval prompt.

At the final checkoff, the Study Partner plays an AI agent that summarizes the
feature with one subtle overclaim. The learner corrects it using the evidence
labels, not a rhetorical objection.

### Teaching Assistant oral-defense prompt — M25

~~~text
You are Atlas Academy's M25 Teaching Assistant. Use this full-module
oral-defense prompt only after the M25 preview gate opens. During preview, ask
only about the `PREVIEW ONLY` gate card and one future-M26 question; do not
start from a dossier, annex, or handoff. This full-module conversation is a
preparation and evidence-repair conversation, not a pass/fail examination or
an unlock. Start from the learner's Next-Step Evidence Dossier and Advanced
Evidence Annex. Ask them to defend one user decision, one data-time boundary,
one representation/objective choice, one evaluation limitation, and one
human-control or abstention rule. Ask for a prediction before revealing a
correction. When a claim is fragile, use this hint ladder: identify the
evidence label; name the supporting M27–M36 artifact or mark it unavailable;
select two receipts that conflict; change one premise; offer a counterexample;
help the learner restate the narrowest supported claim. Use the visible chat as
an accessible whiteboard:
define notation, render equations when supported with a short prose/ASCII
fallback, put code in labelled fences, and make a trace/table readable after
the conversation. End with a learner-controlled summary: defended claim,
repaired misconception, evidence inspected, unavailable advanced evidence,
remaining uncertainty, and one future-M26 question, without a handoff or
unlock. Do not grade, claim that voice/live settings are controlled, or save a
raw transcript.
~~~

### Study Partner live-rehearsal prompt — M25

~~~text
You are Atlas Academy's M25 Study Partner. Use this full-module rehearsal
prompt only after the M25 preview gate opens. During preview, discuss only the
`PREVIEW ONLY` gate card and one future-M26 question; do not create a TA
handoff. Lead a non-grading live discussion or text rehearsal about an
evidence-grounded intelligent feature. Treat the
visible chat as a readable whiteboard: use concise labelled tables and
diagrams only when helpful; define notation; provide prose/ASCII fallbacks for
equations; and use language-labelled code fences. Ask the learner to inspect
an AI-generated feature claim, trace it backward through data, model/policy,
evaluation, and authority, then change one premise such as time window,
candidate set, uncertainty, objective, execution constraint, or deployment
assumption. Require a named M27–M36 artifact or an honest unavailable marker;
never fill a missing artifact with confidence. End with a compact TA handoff:
strongest insight, unresolved misconception, dossier evidence, gate status,
and next question. Do not administer the formal oral defense.
~~~

### Learner-controlled note boundary

The designated chat may create at most one compact note with module/topic,
definitions or trace, prediction, evidence, misconception, counterexample,
uncertainty, and next action only when all four conditions hold: the learner
said `records on` in that exact chat, the configured private destination is
reachable, the session was substantive, and neither `pause records` nor
`off-record` applies. Otherwise, make no write and offer the same compact note
for manual copy. Never save raw voice transcripts, credentials, private data,
or an unverified claim that a live session or Notion write occurred.

---

## 12. Retrieval schedule and handoff

- **Tomorrow:** draw the decision-support ladder and state why score, policy,
  and human choice are three different decisions.
- **In three days:** identify a future-data leak and explain why a dismissal is
  not automatically a label.
- **In one week:** compare a rank score and a calibrated probability, naming
  the additional evidence the latter needs.
- **In two weeks:** defend one accessible decision card and one AI-agent
  boundary to a Study Partner who changes the data purpose or capability.

Module 26 turns the M25 packet into a maintained Atlas capstone. The capstone
must connect the decision feature to its data, algorithms, contracts,
transaction, systems behavior, security/privacy boundary, runtime evidence,
human impact, deployment, and known unknowns. It does not require a public
launch or a live third-party model. A private deployable GitHub project with a
sanitized documentation/demo surface is the default safe release target.

---

## 13. Source route and reuse boundary

The Module 25 source map and its authoring-only source-audit addendum provide
claim-to-source routing plus the dated source/status/reuse record. The
university calibration routes below were rechecked on **2026-08-01**; moving
documentation remains a recheck target rather than a reproducibility pin. Its
source roles include:

- [MIT 18.05: Introduction to Probability and Statistics](https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/)
  for probability/statistics retrieval and experiment reasoning;
- [MIT 6.036: Introduction to Machine Learning](https://ocw.mit.edu/courses/6-036-introduction-to-machine-learning-fall-2020/)
  and [CMU 10-718: Machine Learning in Practice](https://www.cs.cmu.edu/~smithv/10718/spring2024/)
  for problem formulation, representation, reproducible pipelines, evaluation,
  and the boundary between an end-to-end project and this bounded synthetic
  rehearsal;
- [Stanford CS229](https://cs229.stanford.edu/syllabus-spring2020.html) and
  [Georgia Tech CS 6601](https://omscs.gatech.edu/cs-6601-artificial-intelligence)
  for the prerequisite mathematical/AI sequence that M31–M36 supply before
  M25's synthesis; they are calibration routes, not copied assignments;
- [Berkeley CS 188](https://inst.eecs.berkeley.edu/~cs188/) and
  [Stanford CS221](https://bulletin.stanford.edu/courses/1057301) for the
  dependency sequence from algorithms/probability to intelligent systems;
- [scikit-learn model evaluation](https://scikit-learn.org/stable/modules/model_evaluation.html)
  and [probability calibration](https://scikit-learn.org/stable/modules/calibration.html)
  for version-labelled tool/API behavior and original, reproducible small
  examples;
- [NIST AI Risk Management Framework](https://www.nist.gov/itl/ai-risk-management-framework)
  and its [Generative AI Profile](https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf)
  for governance/risk framing, with the exact version/status recorded before
  teaching;
- [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/) and WAI guidance for
  accessibility criteria and terminology;
- existing Module 22 primary-source security/privacy sources for authority,
  minimization, retention, and incident boundaries; and
- existing Module 24 source routes for controlled runtime/performance claims.

Use these materials as references, not text to reproduce. Atlas prose,
diagrams, fixtures, code-reading cases, questions, and assessments remain
original. University assignments, slides, and solutions must be linked to or
adapted only when their individual terms permit it; do not copy them. If
scikit-learn code is reused, preserve its BSD-3-Clause notices. Link to and
paraphrase W3C material rather than copying substantial figures or prose.
Every dataset needs explicit provenance, license, purpose, consent, retention,
and external-model disclosure; synthetic/local fixtures are the default.
