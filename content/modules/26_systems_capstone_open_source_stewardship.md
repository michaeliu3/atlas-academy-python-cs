# Module 26 — Systems Capstone, Open-Source Stewardship & Oral Architecture Defense

**Arc V — Languages, intelligence, and integrated systems defense**

> **Intended bridge after prerequisite evidence exists:** Module 25 ends with a
> bounded decision-support feature and an evidence packet. This module then
> asks the harder systems question: can that feature live inside a maintained
> product without borrowing authority from a demo, a green check, a benchmark,
> an agent, or a polished interface?

## Preview boundary — portal preview and private guided-study gate

This is a full orientation preview in the portal, not an unlocked Days 56–60
capstone or a source of synthesis credit. Its prerequisite path includes the
authoring-only M31–M36 chain through Module 25. Read it to see the eventual
integration standard; do not treat its project, studio, or oral-defense
material as a substitute for the unavailable prerequisite evidence.

> **Portal preview mode now:** you may make only a `REHEARSAL ONLY` framing
> card. Do not use the later studio, project, oral defense, or
> `RELEASE`/`REVISE`/`DEFER`/`ROLLBACK` language as a current capstone decision.
>
> **Private guided-study evidence gate:** In the learner-designated Teaching
> Assistant and Study Partner chats, the full six-session M26 work may begin
> only after the learner supplies a private M25 Next-Step Evidence Dossier with
> Advanced Evidence Annex, the actual M31–M36 named dossier/packet outputs and
> TA handoffs behind that annex, and relevant M27–M30 artifacts or explicit
> `[UNAVAILABLE — …]` markers that narrow or defer the affected claim. A fluent
> model summary is never a receipt. This permits only a learner-owned,
> simulated/local `RELEASE`/`REVISE`/`DEFER`/`ROLLBACK` recommendation. It does
> not change the graph or portal access, grant route/Core credit, authorize a
> real deployment, publish a capstone, or establish release status or mastery.

**Private guided Days 56–60 of the 60-day Atlas Core—only after the private
guided-study evidence gate is met**

**Intended private-study outcome only after that evidence gate is met:** You
can make and defend a bounded simulated/local release recommendation for one
Atlas capability (or a comparable open-source contribution proposal). You can
trace the claim through representation, algorithms, contracts, tests, data,
runtime, network, trust, human control, packaging, maintenance, and known
unknowns.

This is not a last-minute build marathon. It is an advanced evidence exercise:
read the system, recover its architecture, diagnose a failure, review a
change, decide whether the evidence warrants a release, and defend tradeoffs
under a changed constraint.

---

## How to study this module

> **Preview reading boundary:** In the portal, the six-session orientation
> material below is for after the prerequisite gate opens. In preview mode,
> make only the `REHEARSAL ONLY` framing card; do not use the later layers,
> project, studio, oral defense, or release-decision language as current
> capstone work. In the designated private chats, the private guided-study
> evidence gate above permits the same six sessions as current learning work;
> the resulting decision remains simulated/local and never changes portal or
> release state.

### The exact cumulative invariant

> **Atlas may be released only as a versioned, bounded capability when its
> claimed behavior, accountable owner, architecture, authority/data boundary,
> tests and observations, rollback path, and known limits can be traced. No
> demonstration, passing CI run, benchmark, scan, external dependency, or
> AI-generated summary authorizes a release by itself. Deferring or narrowing a
> release is an engineering success when the required evidence is absent.**

This is an Atlas teaching contract. It is not a certification, a production
readiness verdict, a claim that deployment occurred, a guarantee of security,
accessibility, reliability, legal compliance, or user benefit, or permission
for a model or agent to change a system.

### Read each case in three layers

The capstone is deliberately rigorous but not deliberately hard to read. Every
case follows the same order:

1. **Decision layer** — What must be decided now? State the release claim,
   invariant, owner, and one unresolved risk in plain language.
2. **Mechanism layer** — Read one small execution trace, dependency path, diff,
   or test that could make the decision true or false.
3. **Audit layer** — Inspect the evidence scope, versions, limitations,
   alternatives, provenance, and next falsifier.

Do not start on the audit layer. A long architecture document before a concrete
question produces the appearance of sophistication without a model of the
system.

### Visual hierarchy and cognitive-load rules

When you make a capstone document, slide, diagram, or portal view:

- put the current **claim**, **invariant**, **evidence status**, and **open
  risk** in a persistent top strip;
- use one primary question per view, not a dashboard of all course concepts;
- make the decision question visually largest, the mechanism second, and the
  provenance/details available on demand;
- keep explanatory prose to short paragraphs and code traces to the smallest
  relevant path;
- label evidence consistently with text and shape, not color alone;
- give every diagram a title, scope, legend, relationship labels, and a text
  equivalent;
- use familiar semantic labels rather than decorative badges:
  **[CONTRACT]**, **[MECHANISM]**, **[TESTED BEHAVIOR]**,
  **[OBSERVATION]**, **[DECISION]**, and **[UNKNOWN]**.

The goal is not visual minimalism for its own sake. The goal is to put the
right complexity in front of you at the right time.

### What counts as learning here

For each session:

1. Predict the release decision before opening the trace.
2. Identify the layer that owns the relevant fact.
3. Read a fixed code path, test, incident, or diff.
4. Name the smallest missing artifact that would change your decision.
5. Update one shared release dossier.
6. Explain one backward connection and one forward consequence.

Typing is useful only when it exposes a mechanism. Reading, tracing,
debugging, designing, delegating, reviewing, and defending are the primary
skills.

---

## 1. Position in the knowledge system

### 1.1 The prerequisite and forward map

Module 26 does not ask you to repeat Modules 0–25. It asks you to bring their
artifacts into one release argument.

| Prior artifact, not a topic name | What it contributes to the capstone | What M26 must make you defend |
|---|---|---|
| M0 diagnostic and retrieval record | A visible map of what you know, what remains uncertain, and where to retrieve it. | Why an uncertainty is acknowledged rather than hidden by confidence. |
| M1–M5 state trace, specification, proof sketch, and cost model | A stated behavior, invariant, termination/correctness argument, and resource boundary. | Why the capability does what it claims and what it costs in the declared model. |
| M6–M11 representation, index/graph, and algorithm decision memo | The data structure, candidate set, dependency path, and complexity tradeoff behind the behavior. | Why this representation and algorithm are suitable for the workload and failure mode. |
| M12–M16 API contract, test suite, package boundary, schema, and transaction trace | A changeable software boundary with validation, persistence, recovery, and atomicity evidence. | Why a request, migration, retry, or failure preserves the stated invariant. |
| M17–M22 execution, OS, concurrency, protocol, partial-failure, and trust dossier | A model of resources, races, remote uncertainty, authentication/authorization, privacy, and failure recovery. | Which component owns a failure, who may act, and what remains outside the system's authority. |
| M23–M24 language/runtime evidence | Meaning-preserving query/representation behavior and scoped performance evidence. | Why a local observation is not promoted into a universal claim. |
| M27–M31 formal mathematics, inference, and optimization evidence | Definitions, assumptions, derivations, numerical boundaries, statistical models, and information/optimization tradeoffs. | Why a mathematical or empirical claim is valid only under its stated model, data, and finite-precision conditions. |
| M32–M36 systems-for-learning, formal limits, AI, ML, and learning-theory evidence | Cross-layer execution evidence, reductions, search/decision formulation, evaluation manifests, generalization/limit arguments, and reliability boundaries. | Why an apparent model result does not silently become a deployable guarantee, authority, or human benefit. |
| M25 human-centered evidence packet | An accessible, bounded decision surface with authority, provenance, explanation, uncertainty, and override evidence. | Why a suggestion remains contestable and does not become a command or a user benefit claim. |

~~~mermaid
%% atlas-diagram-id: m26-prerequisite-release-evidence
%% atlas-diagram-title: Advanced course artifacts converge on the M26 release decision
%% atlas-diagram-alt: Retrieval evidence, software foundations, data structures, contracts, systems, trust, semantics, mathematics, advanced AI/ML evidence, and the M25 human-control packet combine into a release claim, architecture thread, failure and authority boundary, evidence ledger, and a bounded release decision with a maintenance handoff.
flowchart LR
    R["M0 retrieval + uncertainty map"] --> C["release claim + owner"]
    S["M1–M5 state, proof, cost artifacts"] --> I["invariant + workload"]
    A["M6–M11 representation / algorithm memo"] --> X["architecture thread"]
    D["M12–M16 contracts, tests, transaction trace"] --> X
    O["M17–M22 systems / trust dossier"] --> F["failure + authority boundary"]
    H["M23–M24 semantics + runtime evidence"] --> E["evidence ledger"]
    Q["M27–M31 mathematical / statistical evidence"] --> E
    T["M32–M36 AI / ML / theory evidence"] --> E
    U["M25 human-control packet"] --> E
    C --> X
    I --> X
    X --> F
    F --> E
    E --> B["M26 release decision + defense"]
    B --> M["maintained product / responsible contribution"]
~~~

### 1.1A The advanced-evidence annex

The capstone does not ask for a ceremonial appendix of M27–M36 topic names. It
asks for one exact contribution from each advanced artifact that is relevant to
the release claim. If an artifact is unavailable because the learner pack is
still authoring-only, the correct dossier entry is
**[UNAVAILABLE — DEFER OR NARROW CLAIM]**. Do not reproduce a theorem,
benchmark, agent answer, or test result as a substitute.

| Module | Capstone artifact to attach or cite | Capstone question it must answer | Boundary retained in M26 |
| --- | --- | --- | --- |
| M27 | proof/claim ledger with countermodel | Which invariant, quantifier, or implication in the release claim is actually justified? | A few passing cases do not prove a universal property. |
| M28 | representation and numerical-stability note | Which representation, conditioning, precision, or distance assumption affects correctness? | A numerical output is not automatically stable or meaningful. |
| M29 | limit/derivative/convergence scope sheet | Which continuous or iterative conclusion is valid under which domain and assumptions? | A finite trace or small derivative is not a global guarantee. |
| M30 | inference/evaluation manifest | Which population, data-generation story, uncertainty, and alternative explanation bound an empirical claim? | A metric is not causality, benefit, or universal quality. |
| M31 | optimization/information evidence dossier | Which objective, hard constraint, proxy gap, and stopping/support condition make the algorithmic result interpretable? | A minimized loss does not decide what should be released. |
| M32 | execution-transfer/reproducibility dossier | Which dtype, layout, device, seed, profiling, memory, or semantic-oracle fields make the system observation reproducible? | A local accelerator result is not a portable operational guarantee. |
| M33 | Formal Limits Claim Packet | What exact encoding, reduction, resource model, or complexity limit constrains the capability? | A timeout or a theory label does not decide a particular product outcome. |
| M34 | Classical AI Search, Constraints & Decision Packet | Which state, action, constraint, search/solver condition, uncertainty model, and authority boundary shaped the proposed behavior? | A solver/planner recommendation is not self-authorizing. |
| M35 | **Machine Learning & Representation Dossier** | Which representation, baseline, split, shift test, objective, and failure slice support the learned component? | A validation result is not generalization, calibration, or user benefit. |
| M36 | **Statistical Learning Theory & Reliable Deep-Learning Systems Dossier**, with its **Limit-and-Nonclaim Card**, **Theory–System Reproducibility Record**, and **Monitoring Extension to Reliable-Learning Evidence Map** | Which guarantee/limitation survives the declared distribution, precision, implementation, and deployment conditions? | A theorem or benchmark is not a release certificate. |

The M25 handoff supplies the human-control side of this annex: user purpose,
decision authority, accessible explanation, meaningful override, retention
boundary, and evidence ledger. The release decision must remain **REVISE** or
**DEFER** when the exact advanced claim being relied upon has no learner-ready
artifact.

### 1.1B Advanced Claim Join — one claim, one consequence

The annex becomes useful only when an upstream field changes the capstone
decision. For the fixed optional next-action feature, the baseline display may
remain a bounded orientation case. The stronger claim—“a learned order improves
the next action”—must be narrowed or deferred unless the following join is
filled from inspected learner-ready artifacts.

| Capstone subclaim | Exact upstream receipt | Assumption that can fail | Release consequence if it fails |
| --- | --- | --- | --- |
| The optimized rank expresses the intended choice | M31 **Optimization and Information Evidence Dossier**: objective, hard constraint, proxy gap, stopping/support boundary | the objective is a valid proxy for the declared user outcome | **DEFER** learned-order claim; retain a transparent baseline only |
| The observed execution result can be compared | M32 **Scientific Python & Accelerators Dossier**: semantic oracle, dtype/layout/device/seed and environment record | the compared runs preserve the same semantics and stated environment | **REVISE** reproduction record before using a performance or model comparison |
| A formal or complexity statement applies | M33 **Formal Limits Claim Packet**: encoding, reduction direction, resource model | the product actually makes that formal claim | **NARROW** the claim or mark the formal row not relied upon; do not decorate the dossier |
| Candidate eligibility and decision policy are explicit | M34 **Classical AI Search, Constraints & Decision Packet**: state, candidate set, constraint, uncertainty, authority | the candidate set and constraint remain the ones evaluated | **REVISE** formulation; no solver/planner output may authorize action |
| A learned proposal outperforms a baseline under scope | M35 **Machine Learning & Representation Dossier**: split, baseline, failure slice, shift result | data relation, representation, and evaluation population still hold | **DEFER** broader benefit/generalization claim; display only the bounded evidence |
| A reliability or monitoring statement survives its scope | M36 **Statistical Learning Theory & Reliable Deep-Learning Systems Dossier**, with its **Limit-and-Nonclaim Card**, **Theory–System Reproducibility Record**, and **Monitoring Extension to Reliable-Learning Evidence Map**: theorem/non-claim, shift monitor, stop owner | distribution, precision, implementation, and human-control assumptions hold | **NARROW**, **DEFER**, or **DISABLE** according to the named stop condition |

Each row must cite one narrow claim, one assumption, one counterexample or
non-claim, and one release consequence. A missing row does not become a
generated summary. It means **[UNAVAILABLE — DEFER OR NARROW CLAIM]**. The
M31–M36 packs remain authoring-only in the portal. In the private guided route,
they may contribute only when the learner supplies their actual named outputs
and handoffs through the private evidence gate; that is not learner credit,
release proof, or a reason to unlock this portal preview.

### 1.2 The forward connection

The forward path is maintenance:

~~~text
versioned release claim
    → monitored / inspectable behavior
    → reported defect or changed assumption
    → triage and reproducer
    → bounded patch and review
    → regression evidence and rollback plan
    → revised claim, documentation, and ownership
~~~

Whether you continue Atlas or contribute to an established Python project, the
same discipline applies: a useful contribution is an auditable change that
someone else can understand, test, maintain, and reverse.

### 1.3 Five-day placement

| Day | Capstone pressure | Sessions | Dossier increment |
|---|---|---|---|
| 56 | Define the release rather than the feature wish. | 1 | Release contract and pre-mortem |
| 57 | Recover the real architecture and ownership boundaries. | 2 | Architecture thread and dependency closure |
| 58 | Trace a failure across persistence, concurrency, and remote uncertainty. | 3 | Incident report and regression specification |
| 59 | Review the patch, supply chain, and operational evidence. | 4 and 5 | Change review, evidence ledger, rollback/canary plan |
| 60 | Decide, hand off, and defend under challenge. | 6 | Final release dossier and oral defense |

The default workday remains evidence-first: retrieval and prediction; a
first-principles model and trace; unfamiliar-code or architecture reading;
debugging or patch review; dossier production; then TA checkout.

---

## 2. The fixed Atlas release case

The synthetic Atlas capstone fixture models a study-event history, prerequisite
graph, local persistence boundary, and the Module 25 optional next-step
suggestion. A request arrives:

> “Show an optional next study action after a learner records a session. Keep
> the event durable, avoid duplicate effects on retry, preserve the learner's
> control, and make the change maintainable.”

That request is intentionally underspecified. It contains at least six distinct
questions:

~~~text
1. What event and state transition are promised?
2. Which representation and algorithm calculate eligible actions?
3. Which transaction / idempotency boundary protects retry?
4. What does the network caller observe when a response is lost?
5. What data, model output, or tool authority is prohibited?
6. What evidence justifies release, deferment, or rollback?
~~~

### Two valid delivery tracks

Choose one track, but use the same dossier and rubric.

| Track | Scope | Evidence requirement |
|---|---|---|
| **Atlas integration (default)** | Finish one bounded vertical slice in the course system. | Trace the capability through architecture, tests, failure handling, trust, and maintenance. |
| **Open-source stewardship** | Make a comparable small contribution to an established Python project. | Confirm that the project is active, ground the task in a documented issue/request, read project norms, reproduce a bounded issue, propose/review a patch, respect maintainers' authority, and document the evidence. |

Neither track requires a public deployment, real learner data, secrets, or
external AI access. If these would be needed to make the claim, mark the claim
as **[UNKNOWN]** and choose a safer local fixture or defer the release.

> **Private guided-route constraint:** In the designated chats, use the Atlas
> integration track or a local-only external review/proposal. Public submission,
> maintainer contact, or modification to an external project is outside this
> private guided route, requires the learner's separate choice, and is not a
> requested course artifact or evidence.

### External-track selection check

Choose the open-source track only when all three facts are inspectable:

1. **Active project:** record one recent release, commit, issue, or contribution
   activity signal and the route by which a contributor would work.
2. **Tracked need:** link or quote the title of one documented issue/request
   that the bounded reproducer or proposal addresses. Do not manufacture an
   issue after the fact.
3. **Authority boundary:** name the maintainer/community route and what remains
   their decision.

If any fact is unavailable, choose the Atlas integration track instead. The
local track is not a lesser substitute: it is the correct privacy-safe route
when there is no active project, no documented need, or no appropriate public
interaction. A public submission, merge, contact, or endorsement is never
required.

### Stewardship Boundary — required only for the external track

Open-source stewardship is not “send a patch and hope it merges.” Before any
public interaction, create one small boundary record:

~~~text
project and exact version/commit inspected:
activity evidence and contribution route (recent release, commit, issue, or contribution activity):
documented issue/request tied to this task:
issue or bounded problem, reproducer, and affected behavior:
contribution, license, security, and communication routes read:
maintainer / reviewer authority and what the learner may not decide:
smallest local patch or review proposal:
tests, evidence, and documentation expected by the project:
submission status: not submitted / draft / submitted / feedback observed:
explicit non-claim: no merge, maintainer endorsement, deployment, or project-wide quality claim:
~~~

Public submission is optional. A private, well-scoped reproducer or review
proposal can demonstrate the reasoning. Never upload secrets, private records,
or a generated patch that you cannot explain; a maintainer's capacity and
project norms remain external boundaries, not grading targets.

### The release admission question

Before writing or asking an agent for code, fill this sentence:

> For **[named user task]**, release **[bounded capability/version]** only if
> **[named invariant]** is protected by **[mechanism/owner]**, demonstrated by
> **[tests/observations under scope]**, and reversible through **[rollback or
> disable path]**. It does not establish **[non-claim]**.

If you cannot fill one blank honestly, you do not yet have a build request.

---

## 3. Session 1 — Release claims begin with a boundary

### Pressure

“The feature works on my machine” is not a release claim. It leaves out the
user task, the source of truth, the owner, the threat boundary, and the path
back when the claim fails.

### First principle: a release is a controlled promise

At minimum, a capability has:

~~~text
input + current state + declared rule
    → state transition / response
    → observable evidence
    → owner who may change, disable, or reverse it
~~~

The feature code is only one component of that promise. A test can establish
one behavior under its fixture. A benchmark can establish one measurement under
its workload. A reviewer can approve a change under a policy. None inherits the
other's conclusion.

### Build the release contract

| Field | Atlas example | Review question |
|---|---|---|
| User task | Record a study session and inspect an optional next action. | Whose task is improved? |
| Capability | Idempotent local event recording plus a visible, optional suggestion. | What is inside the versioned boundary? |
| Invariant | One logical event produces at most one durable record and never silently changes a study plan. | What must remain true after retries and failures? |
| Owner | Learner owns acceptance; maintainer owns release/rollback; transaction owner owns durable write. | Who can decide each action? |
| Baseline | Record the event and show prerequisite context without a suggestion. | What happens without the new feature? |
| Non-goal | No ability diagnosis, live model call, schedule mutation, or production benefit claim. | What tempting conclusion is prohibited? |
| Rollback | Hide the new display path or route to baseline while preserving readable records. | How is harmful behavior stopped? |

### Code-reading lab — locate the hidden promise

Read this deliberately incomplete handler. Do not repair it yet.

~~~python
def record_and_suggest(event, store, ranker):
    store.append(event)
    suggestion = ranker.top_action(event.learner_id)
    store.replace_plan(event.learner_id, suggestion)
    return {"saved": True, "next": suggestion}
~~~

Answer in order:

1. Which line claims durability, and what evidence does it lack?
2. Which line crosses from a suggestion to an authority-bearing action?
3. What happens if the caller retries after receiving no response?
4. Which contract field would make the final line safe to display but unsafe to
   execute?

### Session artifact

Create a one-page **Release Contract and Pre-Mortem**:

~~~text
release claim:
user task:
baseline:
state / invariant:
owners and authority boundaries:
failure scenario most likely to break the invariant:
rollback / disable route:
strongest allowed claim:
explicit non-claim:
first artifact needed before implementation:
~~~

### TA check

The TA asks: “If the UI is beautiful and the test passes, what fact is still
missing before release?” A strong answer names the missing owner, scope,
failure path, or evidence—not merely “more testing.”

---

## 4. Session 2 — Architecture is a traceable set of responsibilities

### Pressure

A folder tree tells you where files live. It does not tell you who owns state,
who can mutate it, which dependency can fail, or why a response is trustworthy.

### First principle: zoom changes the question, not the system

Use only the architecture view needed to answer the current question.

~~~mermaid
%% atlas-diagram-id: m26-architecture-thread
%% atlas-diagram-title: One Atlas request crosses interface, API, local state, graph, policy, and log boundaries
%% atlas-diagram-alt: A learner records a session through the Atlas interface. The interface sends a validated request to an event API. The API owns durable writes and reads the progress store, consults the prerequisite graph, applies a transparent ranking policy, returns an optional suggestion, and records a structured local audit outcome.
flowchart LR
    P["Learner\nperson"] -->|records session| UI["Atlas interface\ncontainer"]
    UI -->|validated request| API["event API\ncomponent"]
    API -->|atomic append / lookup| DB["event + progress store\ncontainer"]
    API -->|eligible modules| G["prerequisite graph\ncomponent"]
    G --> R["transparent ranking policy\ncomponent"]
    R --> UI
    API -->|audit outcome| L["structured local log\nobservation boundary"]
~~~

This is a context-and-container story. Zoom into a component only when the
question needs a data structure, contract, transaction, or algorithm. Do not
put every class on one diagram.

### Architecture thread worksheet

For one request path, write:

~~~text
entry point:
validated input:
state read:
state write:
algorithm / representation used:
remote or asynchronous boundary:
authority / privacy boundary:
observable result:
recovery or rollback point:
owner for each state-changing step:
~~~

### Code-reading lab — map a dependency direction

~~~python
class NextActionService:
    def __init__(self, repository, policy):
        self.repository = repository
        self.policy = policy

    def propose(self, learner_key):
        state = self.repository.load_progress(learner_key)
        candidates = state.prerequisite_graph.available_actions()
        return self.policy.rank(candidates, state)
~~~

Trace this from the caller backward:

- Which object owns durable data?
- Which method creates a candidate set before a ranking exists?
- Which line would become unsafe if the policy gained direct repository write
  access?
- What is the smallest interface contract that would let a test replace the
  repository without changing the policy?

### Session artifact

Create an **Architecture Thread Map** with:

- one system context or container view;
- one focused dynamic request/failure trace;
- a legend defining people, containers, components, storage, and external
  boundaries;
- labeled arrows that say what moves or what depends on what;
- a text equivalent;
- one “not shown because it is not needed for this decision” note.

### TA check

Ask the TA to point at any arrow. Explain its protocol, data shape, owner,
failure mode, and what evidence would show that it behaved as claimed.

---

## 5. Session 3 — A retry is a systems event, not a duplicate line of code

### Pressure

The network can lose a response after a server commits work. A caller then
cannot distinguish “the server did nothing” from “the server succeeded but I
did not hear it.” This is a partial-failure problem, not a user-interface
problem.

### First principle: preserve a logical event across attempts

One logical action may have several delivery attempts:

~~~text
logical event e-204
    attempt 1: request reaches server → durable commit → response lost
    attempt 2: caller retries       → server must recognize e-204

required invariant:
    durable_effects(e-204) <= 1
~~~

The system does not “solve the network.” It defines a stable event identity,
an atomic ownership boundary, a response/recovery contract, and evidence of
what occurred.

### Failure playback

~~~mermaid
%% atlas-diagram-id: m26-retry-failure-playback
%% atlas-diagram-title: A retry must preserve one logical durable event
%% atlas-diagram-alt: A client submits event e-204 to the event API. The API commits it to storage, but the response is lost. The client retries with the same event identity. The API and store recognize the already committed logical event and return the prior outcome without creating a second durable effect.
sequenceDiagram
    participant C as client
    participant A as event API
    participant S as durable store
    C->>A: record(event_id=e-204)
    A->>S: commit e-204
    S-->>A: committed
    A--xC: response lost
    C->>A: retry e-204
    A->>S: lookup / constrained insert e-204
    S-->>A: existing committed event
    A-->>C: same logical outcome, no second effect
~~~

### Debugging lab — find the race

~~~python
def record_once(event, repository):
    if not repository.has_event(event.event_id):
        repository.append(event)
        repository.update_progress(event)
    return repository.get_result(event.event_id)
~~~

Two workers can interleave between the check and append. Answer these before
writing a fix:

1. What exactly is the compound operation that must be protected?
2. Which invariant is violated if both workers pass the check?
3. Why is a process-local lock not automatically enough for every deployment
   shape?
4. Where should a failure injection go to test the response-lost case?
5. What evidence would distinguish a duplicate request from a new event?

### Incident card

Create a **Failure Playback Card**:

| Field | Required statement |
|---|---|
| Trigger | The concrete event that starts the incident. |
| Symptom | What the user or operator can observe. |
| Hidden state | What might already have happened. |
| Invariant | The precise property at risk. |
| Boundary owner | Transaction, queue, API, caller, or policy owner. |
| Reproducer | A deterministic fixture, schedule, or fault injection. |
| Regression evidence | The test that must fail before the repair and pass after it. |
| Residual uncertainty | What the fixture still does not establish. |

### Session artifact

Add a traced incident and a proposed regression test to the release dossier.
Do not claim exactly-once delivery in a distributed system unless your contract,
protocol, storage, and scope actually establish it. In this module, the safer
claim is usually narrower: one declared logical event has at most one durable
effect within the stated local transaction boundary.

---

## 6. Session 4 — A patch is a supply-chain and ownership proposal

### Pressure

A small-looking change can add a dependency, expand a capability, bypass a
review, break a rollback path, or let an AI-generated suggestion become an
unexamined authority.

### First principle: change must be inspectable, constrained, and reversible

Before accepting a patch, separate four facts:

| Layer | Question | Insufficient substitute |
|---|---|---|
| Source | Which versioned lines and dependencies changed? | “The summary says it is safe.” |
| Behavior | Which contract/test/trace changes? | “CI is green.” |
| Authority | Who may merge, deploy, call a tool, or mutate state? | “The agent is confident.” |
| Recovery | How is harm detected, limited, and reversed? | “We can fix it later.” |

### Patch-reading lab — recover the hidden dependency

~~~diff
 def render_release_note(packet):
-    return local_template(packet)
+    return hosted_agent.summarize(packet)

 workflow:
-  uses: actions/checkout@<pinned-revision>
+  uses: some-action/checkout-helper@main
~~~

Do not debate style first. Ask:

1. Which new data recipient, retention boundary, availability dependency, and
   supply-chain reference appear?
2. What provenance would the output need before a human can treat it as a
   reviewable proposal?
3. Why does an action reference at a moving branch name weaken a reproducible
   release argument?
4. What is the smallest local alternative that preserves the user-facing
   purpose?

### Patch review protocol

Use this order:

~~~text
1. State the intended behavior and invariant.
2. Read the changed boundary before the implementation detail.
3. List added authority, data recipients, dependencies, and failure modes.
4. Trace one success and one failure path.
5. Require a test, evidence card, or policy owner for each meaningful claim.
6. Decide: accept boundedly, revise, defer, or reject.
~~~

### AI-era boundary

An AI system may propose a patch, draft a test, or summarize a trace. Its
output is untrusted input. It cannot:

- choose the release scope;
- grant its own tool, write, merge, deployment, or permission capability;
- convert generated tests into independent evidence;
- turn a retrieved source into verified fact;
- make a privacy, security, accessibility, or user-benefit conclusion.

The learner owns the review. A maintainer or other named authority owns any
external action.

### Session artifact

Create a **Change and Supply-Chain Review**:

~~~text
change intent:
files / packages / workflow references affected:
behavioral contract affected:
new or changed authority:
data / privacy recipient boundary:
tests and evidence required:
dependency / provenance check:
rollback or disable plan:
release recommendation:
non-claim:
~~~

---

## 7. Session 5 — Operational evidence is scoped evidence

### Pressure

“It passed locally” does not show that a release is safe for all workloads.
“It is faster” does not tell you which layer improved, whether the result is
representative, or whether a human task improved.

### First principle: every observation needs a question and a boundary

The release decision needs several kinds of evidence that must remain separate:

| Claim type | Evidence that can support it | What it cannot establish alone |
|---|---|---|
| Correctness under a fixture | Unit/integration/regression test with declared preconditions. | All real workloads or user benefit. |
| Resource behavior | Module 24-style workload, host/runtime/version, metric, warm-up, and limitation. | Algorithmic improvement, universal latency, or safety. |
| Change safety | Review, protected merge policy, dependency/provenance inspection, reproducible build evidence. | Absence of every vulnerability or compromise. |
| Recovery readiness | Named trigger, owner, disable/rollback procedure, and observable signal. | That an incident will never happen. |
| Human control | Keyboard/semantic task trace, plain explanation, refusal/correction path. | Broad accessibility conformance or learning gain. |
| Intelligent feature behavior | Candidate/policy/model version, data scope, evaluation/limitation. | Truth, causality, permission, or an automatic action. |

### Evidence ledger

Use a ledger, not a generic “quality score.”

~~~text
claim:
claim owner:
artifact / test / observation:
fixture or workload:
version / environment / threshold:
result:
scope:
limitation:
next falsifier:
release consequence if evidence changes:
~~~

### Rigor card — a release claim is a conjunction of scoped evidence

### Definition — a scoped release claim is a conjunction

For a fixed local fixture, write a release claim as a
conjunction, not a score:

~~~text
R_fixture = declared behavior ∧ traceable evidence ∧ recovery boundary ∧ human-control boundary
~~~

This is a minimal fixed-fixture teaching model, not a full release-admission
checklist. A real evidence ledger still needs named owners, authority/data and
architecture boundaries, version/scope, and known limits.

### Derivation / proof idea — an unsupported conjunct blocks promotion

Each conjunct has its own owner, artifact, scope, and limitation. If one
conjunct is unsupported, then `R_fixture` is unsupported: a conjunction cannot
be promoted by the strength of its other terms. This is a proof idea about the
declared Boolean claim, not proof that a real service is safe to release.

### Assumption boundary — one logical event and one atomic boundary

Let `e-204` name one logical request. Assume that both attempts carry that same
stable identifier and that a uniqueness-enforced conditional idempotency record
and its effect share one atomic transaction boundary. Under those assumptions,
two attempts can yield one durable effect:

### Numerical experiment — two attempts and one durable effect

~~~text
attempt 1: e-204 absent -> atomically record e-204 and create effect  -> durable effects = 1
attempt 2: e-204 present -> return the recorded result     -> durable effects = 1
~~~

The numerical observation is `2 attempts / 1 logical event / 1 durable effect`.
It supports only that named fixture and transaction boundary; it does not claim
global exactly-once delivery, a distributed guarantee, or operational release
readiness.

### Counterexample — check-then-append can duplicate an effect

A convenient check-then-append sequence can interleave:

~~~text
attempt A: check e-204 absent
attempt B: check e-204 absent
attempt A: append effect
attempt B: append effect
~~~

Now the same `2 attempts / 1 logical event` fixture has `2 durable effects`.
The behavior and recovery conjuncts are no longer supported, so the correct
release consequence is **narrow, defer, or repair the transaction boundary**—
not “the tests mostly passed.”

### Fill the Advanced Claim Join before promoting an intelligent-feature claim

Use the Section 1.1B table as a linked part of this ledger when the capstone
relies on optimization, execution, formal, classical-AI, ML, or learning-theory
evidence. Ask a deliberately uncomfortable question:

> Which exact upstream field would change your release decision if its
> assumption failed?

For the fixed case, a good answer may be: “If the M35 shifted-slice result or
M31 proxy boundary fails, we do not release a learned order. We keep or return
to the optional transparent baseline.” This is not a lesser outcome—it is the
correct use of evidence.

### Code-reading lab — reject the convenient metric

~~~python
def release_ready(metrics):
    return (
        metrics.tests_passed
        and metrics.mean_latency_ms < 50
        and metrics.ai_score > 0.8
    )
~~~

Why is this insufficient?

- A mean hides tail behavior and workload scope.
- Passing tests lacks the preconditions and failure modes being tested.
- An AI score lacks a declared meaning, evaluation scope, and authority.
- The expression has no owner, rollback condition, or human-control evidence.

Rewrite the *decision model*, not merely the Boolean expression: what separate
evidence cards, owners, and unknowns must a release board inspect?

### Canarying as a thought experiment, not a simulated deployment

For a real service, a gradual, bounded exposure can help compare a release
candidate against a control under a declared evaluation process. In this course
you will not claim to have performed a canary. Instead, write a **Canary/Disable
Plan**:

~~~text
change isolated:
eligible exposure boundary:
signals and their denominators:
stop / rollback condition:
who has authority to stop:
what evidence is still unavailable locally:
~~~

The plan demonstrates that you understand progressive release and rollback; it
does not demonstrate production safety.

### Session artifact

Add the evidence ledger, Advanced Claim Join when relevant, and an
operational/rollback plan to the release dossier. Mark every unperformed
observation **[UNKNOWN]** rather than inventing a result.

---

## 8. Session 6 — The defense tests the architecture, not presentation skill

### Pressure

A slide deck can conceal a missing owner, an unmeasured tradeoff, or a claim
that outruns its evidence. An oral defense makes the architecture answer back.

### First principle: quality attributes conflict

A choice that improves one quality can constrain another:

~~~text
local cache
    → lower repeated lookup cost
    → staleness / invalidation / privacy retention questions

asynchronous retry
    → resilience to a transient failure
    → duplicate-effect / observability / ordering questions

external AI summary
    → faster draft production
    → provenance / retention / availability / authority questions
~~~

The correct answer is rarely “always use” or “never use.” It is a bounded
choice with a quality scenario, evidence, owner, alternative, and known cost.

### Architecture-defense board

~~~mermaid
%% atlas-diagram-id: m26-defense-board
%% atlas-diagram-title: The M26 evidence board supports release, revise/defer, or rollback
%% atlas-diagram-alt: A release claim leads to an architecture thread. Tests and incident traces, security and authority review, operational and rollback evidence, and human-control/accessibility evidence feed a claim ledger. The named owner chooses bounded release, revise/defer for a repairable gap, or rollback/disable for an active harm or invariant break.
flowchart TD
    Q["release claim"] --> A["architecture thread"]
    A --> T["tests + incident trace"]
    A --> S["security / authority review"]
    A --> O["operational evidence + rollback"]
    A --> H["human-control / accessibility evidence"]
    T --> L["claim ledger"]
    S --> L
    O --> L
    H --> L
    L --> D{"release decision"}
    D -->|evidence sufficient within scope| R["RELEASE BOUNDEDLY"]
    D -->|repairable gap| V["REVISE / DEFER"]
    D -->|active harm or invariant break| B["ROLL BACK / DISABLE"]
~~~

### Defense format

Prepare a seven-minute defense, then answer five minutes of changed-constraint
questions.

1. State the user task, release claim, baseline, and non-goal.
2. Walk one request through the architecture and name state/authority owners.
3. Explain one representation/algorithm/cost choice.
4. Replay one failure and the invariant/regression evidence.
5. Explain one trust/privacy or supply-chain boundary.
6. Present the evidence ledger: what supports the decision and what remains
   unknown.
7. State the release/defer/rollback decision and maintenance handoff.

Your reviewer then changes one premise: the request retries, the dependency is
unavailable, the metric regresses in one slice, the user refuses the suggestion,
or an agent asks for a write capability. Re-evaluate the decision aloud.

One changed-constraint question must target the **Advanced Claim Join**: “Which
exact upstream field changes your release decision if its assumption fails?”
The learner should name the revised bounded decision, not recite a theorem or
model label.

### Session artifact

Finish the **Release Dossier and Oral Defense Packet**. A high-quality defer
decision with a sharp evidence gap is stronger than an enthusiastic release
claim with invented certainty.

---

## 9. The Integrated Release Studio

The six studio views follow the module's narrative. They are not six unrelated
mini-apps.

| View | Decision layer | Mechanism layer | Audit layer | Dossier effect |
|---|---|---|---|---|
| 1. Release Brief | What exactly may be released? | Release contract and baseline. | Owner, non-goal, rollback, unknowns. | Establishes claim boundary. |
| 2. System Threads | Which components make the claim true? | Focused context/container/dynamic map. | Data, protocol, dependency, authority labels. | Establishes architecture thread. |
| 3. Failure Playback | Where can the invariant fail? | Fixed request/retry/transaction timeline. | Reproducer, regression test, residual uncertainty. | Establishes incident evidence. |
| 4. Red-Team Patch Bay | Does this change cross a hidden boundary? | Small diff/workflow/package trace. | Dependency, provenance, authority, rollback checks. | Establishes change decision. |
| 5. Evidence Ledger | What does each result actually prove? | Test, metric, task, and runtime cards. | Scope, denominator, version, limitation, next falsifier. | Establishes release evidence. |
| 6. Release Board | Release, revise/defer, or disable? | Claim ledger and quality scenarios. | Challenge card, decision owner, maintenance plan. | Produces oral defense/handoff. |

### Prediction-before-reveal interaction pattern

Every view uses the same accessible, prediction-first sequence:

1. show a single short incident or decision;
2. ask for a multiple-choice judgment plus confidence;
3. reveal the minimal trace only after the prediction;
4. show the strongest justified conclusion and why plausible alternatives fail;
5. make detailed code, sources, and artifacts available in an audit drawer;
6. return one small structured artifact to the persistent dossier.

Do not gate evidence behind correctness. A wrong answer is a repair opportunity:
show the counterexample, point to the earlier artifact, and schedule a
regression retrieval prompt.

### Diagram and accessibility contract

Each visual must have:

- a descriptive heading and scope;
- text labels for node/arrow meaning;
- keyboard-reachable controls with visible focus;
- semantic state for selected, expanded, warning, and disabled controls;
- a text equivalent for a diagram or timeline;
- a non-motion path and reduced-motion support;
- no reliance on color, hover, or a dense image to communicate the decision.

An accessible control is not merely a styled button. It must let a person
inspect the claim, make or change the relevant local choice, and understand the
result.

---

## 10. Confidence-aware diagnostic

For every question, choose an answer and mark confidence: **guess**,
**somewhat**, **strong**, or **certain**. Reveal the explanation only after
committing. A high-confidence miss routes to the named artifact, not a generic
lecture.

### Q1 — Release authority

A pull request has passing unit tests, a green dependency scan, and an
AI-generated release note. Which is the strongest conclusion?

A. The feature is production-ready because three independent signals agree.  
B. The change may satisfy the tested checks; release authority still needs a
named owner, scoped evidence, and rollback decision.  
C. The AI release note is sufficient documentation because it summarizes the
diff.  
D. A scan and tests prove the absence of security and operational risk.

<details>
<summary>Reveal after recording your answer and confidence.</summary>

**Best answer: B.** Tests, scans, and generated prose can be useful artifacts,
but each establishes a narrow fact. They do not merge into authority.

**Why the alternatives fail:** A turns several partial observations into a
universal conclusion. C promotes generated text into reviewed evidence. D
mistakes detection under a scope for proof that all risks are absent.
</details>

### Q2 — Retry and durable effects

After a timeout, a client repeats an event submission with the same event ID.
What property should the design most directly protect?

A. Every network packet is delivered exactly once.  
B. The event's durable effect occurs at most once within the declared storage
boundary.  
C. The user never sees a timeout.  
D. The server never performs a lookup.

<details>
<summary>Reveal after recording your answer and confidence.</summary>

**Best answer: B.** The system cannot control every network outcome; it can
bound its durable state transition by identity, transaction, and recovery
contract.

**Why the alternatives fail:** A overclaims distributed guarantees. C hides a
user-observable partial failure instead of modeling it. D removes a mechanism
that can support idempotent recovery.
</details>

### Q3 — Architecture view selection

You must explain why a dependency outage prevents a suggestion but cannot
corrupt the durable study event. Which artifact is most useful first?

A. A full class diagram of every module.  
B. A focused dynamic trace showing the event commit, the dependency call, and
the fallback path.  
C. A folder tree.  
D. A screenshot of the user interface.

<details>
<summary>Reveal after recording your answer and confidence.</summary>

**Best answer: B.** The question is about order, ownership, and failure
containment, so a small dynamic trace is the right abstraction.

**Why the alternatives fail:** A creates cognitive load without clarifying the
event sequence. C says little about runtime ownership. D can show a symptom but
not the boundary that protects state.
</details>

### Q4 — Patch and supply-chain review

A patch replaces a pinned workflow action with a reference to a moving branch
and adds a new package. What is the strongest next step?

A. Merge because the package has many downloads.  
B. Reject all third-party dependencies permanently.  
C. Inspect the changed provenance/dependency boundary, license/security
information, tests, and rollback effect before deciding.  
D. Ask an agent to summarize the package repository and merge if the summary is
positive.

<details>
<summary>Reveal after recording your answer and confidence.</summary>

**Best answer: C.** A dependency or workflow change is a reviewable supply-chain
and maintenance change, not an automatic rejection or acceptance.

**Why the alternatives fail:** A confuses popularity with suitability. B is an
absolute rule that ignores legitimate bounded use. D leaves authority and
verification with untrusted generated text.
</details>

### Q5 — Performance evidence

A local benchmark shows a lower mean latency after adding a cache. What may the
team claim?

A. The release is faster for all users.  
B. The cache improved the specified local benchmark under its declared
workload/runtime, subject to the measurement's limits.  
C. The algorithm is asymptotically better.  
D. The cache is safe to store any learner record.

<details>
<summary>Reveal after recording your answer and confidence.</summary>

**Best answer: B.** It preserves the workload, mechanism, and measurement
boundary from Module 24.

**Why the alternatives fail:** A expands the population and workload without
evidence. C changes a runtime observation into a complexity proof. D confuses
performance with privacy/retention authorization.
</details>

### Q6 — Human control and intelligence

A ranking policy returns a top suggestion with a high score. Which action is
inside the policy's authority by default?

A. Overwrite the learner's schedule.  
B. Grant an agent a calendar-writing tool.  
C. Present a labeled, optional suggestion with explanation and a meaningful
alternative or dismissal path.  
D. Treat the learner's click as ground truth for future training.

<details>
<summary>Reveal after recording your answer and confidence.</summary>

**Best answer: C.** A ranked output can support a bounded display policy only
when the decision contract permits it.

**Why the alternatives fail:** A and B cross authority boundaries. D erases
exposure, intent, friction, and feedback meaning.
</details>

### Q7 — Evidence gap

A security review, local tests, and architecture map are complete, but no one
can name how a harmful release would be disabled. Which outcome is strongest?

A. Release because the feature is probably safe.  
B. Defer or revise until a named rollback/disable path and owner exist.  
C. Remove the architecture map because it did not solve the gap.  
D. Add more UI polish so users can report a problem.

<details>
<summary>Reveal after recording your answer and confidence.</summary>

**Best answer: B.** A missing recovery path is a release-evidence gap, not a
reason to invent confidence.

**Why the alternatives fail:** A turns probability into authority. C discards
useful evidence rather than addressing the missing evidence. D may improve
reporting but does not create a bounded recovery mechanism.
</details>

### Q8 — Oral defense under changed constraints

During a defense, the reviewer says the external model provider is unavailable
and its retention terms are unknown. What is the strongest response?

A. Continue because the model was accurate in a demo.  
B. State the fallback, remove the provider-dependent claim, and re-evaluate the
release under the local/baseline path.  
C. Claim the provider is safe because it is widely used.  
D. Let the agent decide whether it needs its own provider call.

<details>
<summary>Reveal after recording your answer and confidence.</summary>

**Best answer: B.** A defense is successful when it can narrow a claim as a
constraint changes.

**Why the alternatives fail:** A substitutes a demo for availability and
privacy evidence. C substitutes popularity for a contract. D lets a model mint
capability and authority.
</details>

### Diagnostic routing

| Miss pattern | Retrieve | Repair task |
|---|---|---|
| Authority is assigned to a score, CI result, or agent | M22 and M25 artifacts | Write an owner/capability matrix for the disputed action. |
| Retry is treated as a duplicate line rather than a distributed event | M16, M19, M20, M21 artifacts | Draw the event-attempt timeline and state the durable invariant. |
| A diagram is too detailed or too vague | M12–M14 architecture artifacts and C4 reading | Replace one overloaded diagram with one scoped static and one dynamic view. |
| A benchmark or test becomes a universal claim | M5 and M24 evidence cards | Add scope, workload/fixture, limitation, and next falsifier. |
| A patch is accepted from a summary | M13, M15, M22, M25 review artifacts | Trace new dependencies, authority, test coverage, and rollback before deciding. |

---

## 11. Problem ladder and integrated project

### Problem ladder

| Level | Capstone problem | Evidence of understanding |
|---|---|---|
| 1. Recognize | Label a statement as contract, mechanism, test, observation, decision, or unknown. | Correct label plus non-claim. |
| 2. Trace | Predict the result of one request/retry/failure timeline. | Step-by-step state/owner explanation. |
| 3. Map | Recover one architecture thread from unfamiliar code. | Labeled dependency and authority map. |
| 4. Modify | Add one constraint without breaking the invariant. | Small design change plus regression condition. |
| 5. Debug and defend | Diagnose a duplicate-effect, stale-state, or authority bug. | Reproducer, root cause, repair boundary, and test. |
| 6. Design and delegate | Write a bounded implementation brief for an agent or collaborator. | Contract, acceptance tests, prohibited authority, review plan. |
| 7. Review and verify | Inspect a patch/workflow/dependency proposal. | Evidence-based accept, revise, defer, or reject decision. |
| 8. Transfer | Defend the same release logic in Atlas or an unfamiliar open-source project. | A changed-constraint oral explanation. |

### Transfer task — defend the same logic under a changed constraint

Apply the release contract, owner, invariant, evidence ledger, and rollback
logic to one unfamiliar project or capability. Change exactly one premise—a
dependency outage, retry, shifted metric slice, user refusal, or unavailable
advanced artifact—then defend the narrowest release, revise/defer, or rollback
decision still supported by the evidence.

### Project — Atlas Release Dossier / Open-Source Stewardship Track

> **Full private-module project:** Use this only after the private
> guided-study evidence gate is satisfied. In the portal preview, create only
> the `REHEARSAL ONLY` framing card; do not create a release dossier.

Produce one integrated dossier for a single vertical capability. It can be a
small but genuine Atlas slice or a comparable contribution to an existing
project. It must be deeper than a README and narrower than “finish the whole
application.”

**Required artifacts**

1. **Release contract and quality scenario** — user task, baseline,
   version/scope, invariant, owners, non-goals, risk, rollback/disable plan,
   plus one stakeholder/stimulus/context/response-measure scenario with two
   options, the chosen tradeoff, rejected alternative, and rollback consequence.
2. **Architecture thread** — one context/container view and one dynamic
   request/failure trace with text equivalents.
3. **Code-reading dossier** — annotated route through unfamiliar code; identify
   representation, algorithm, contract, and state boundaries.
4. **Incident/reproducer** — a deterministic failure case, expected invariant,
   regression test or precise test plan, and residual uncertainty.
5. **Change review** — bounded diff/patch plan, dependency/provenance/security
   review, agent boundary where applicable, and a decision.
6. **Evidence ledger** — claim, owner, artifact, scope, version, limitation,
   next falsifier, and release consequence.
7. **Maintenance handoff** — documentation update, issue/triage path, rollback
   or disable procedure, observable signals, and open questions.
8. **Oral defense packet** — seven-minute architecture explanation and five
   changed-constraint prompts with prepared evidence anchors.
9. **Advanced-evidence annex** — for each M27–M36 artifact actually relied
   upon, name the exact claim, assumption, counterexample/limitation,
   version/scope, and release consequence. Mark unavailable artifacts
   **[UNAVAILABLE — DEFER OR NARROW CLAIM]**; never replace them with a
   plausible generated summary.
10. **Advanced Claim Join** — for every advanced claim that matters to the
    decision, cite the exact upstream field, the assumption that can fail, and
    the revised release/revise/defer/disable consequence.
11. **Stewardship Boundary** *(external track only)* — record project/version,
    activity evidence, contribution and security routes, the documented
    issue/request and reproducer, maintainer authority, local review evidence,
    submission status, and the explicit no-merge/no-endorsement/non-deployment
    boundary. If no active project or documented need is available, switch to
    the Atlas integration track rather than inventing external stewardship.

### Release decisions are not pass/fail theater

| Decision | When it is strong | Example |
|---|---|---|
| **RELEASE BOUNDEDLY** | The stated scope has a coherent contract, evidence, owner, and recovery path. | Local optional display is enabled behind a reversible route; no claim is made about broad user benefit. |
| **REVISE** | The direction is valid but a specific design or test gap is repairable. | Add a unique durable event boundary and its retry regression test. |
| **DEFER** | A meaningful claim depends on evidence or authority not available in the capstone. | External model integration lacks a retention, failure, or consent boundary. |
| **DISABLE / ROLL BACK** | An active invariant break or harm requires containment. | A retry can create duplicate durable progress records. |

### Acceptance rubric

| Dimension | Emerging | Capstone-ready |
|---|---|---|
| Scope | Describes a large ambition. | Names one versioned capability, baseline, non-goal, and release owner. |
| Architecture | Draws boxes without responsibility. | Traces state, data, protocol, dependency, authority, and failure ownership through one real path. |
| Mechanism | Says “it works” or copies an agent explanation. | Reads the relevant code/trace and explains representation, invariant, algorithm/cost, and contract. |
| Failure reasoning | Lists generic risks. | Reproduces one concrete failure, names the invariant, and supplies a regression test/plan plus residual uncertainty. |
| Change stewardship | Treats the diff as implementation detail. | Reviews dependency, provenance, authority, tests, compatibility, documentation, and rollback. |
| Evidence | Collects screenshots/checkmarks. | Separates test, observation, measurement, decision, scope, limitation, and next falsifier. |
| Quality tradeoff | Names only a preferred tool or slogan. | States stakeholder, stimulus/context, response measure/bound, two options, rejected alternative, and rollback consequence. |
| Advanced integration | Invokes theorem, model, performance, or reliability vocabulary without an artifact. | Uses the exact M27–M36 Claim Join field, retains its assumptions/non-claim, and changes the release/revise/defer/disable decision when it fails or is unavailable. |
| Open-source stewardship | Equates opening a pull request with a successful contribution. | Respects project/license/security routes and maintainer authority; records local evidence, submission status, and no-merge/no-endorsement/non-deployment boundary. |
| Human/trust judgment | Treats security/accessibility/AI as a checklist. | Names the person/owner, control path, data/authority limit, and consequence of disagreement or failure. |
| Defense | Repeats prepared prose. | Revises a bounded conclusion when a reviewer changes a premise. |

### Humane but advanced standard

The difficulty is in connected reasoning, not in suffering through avoidable
scope. You may reduce the feature surface, use synthetic/local fixtures, take
the defer decision, request a staged hint, or choose the open-source track.

You may not remove the invariant, counterexample, test/failure reasoning,
cost/quality tradeoff, authority boundary, or oral defense. A smaller honest
system with a defended evidence packet is advanced work. A large uncontrolled
demo is not.

---

## 12. Teaching team protocol

### Instructor role

The instructor keeps the capstone coherent:

- begins each session with the release claim and the current evidence gap;
- chooses one concrete incident or patch rather than presenting a tour of
  tools;
- asks “what fact would change your decision?” before explaining;
- prevents a result from being promoted across layers;
- judges the quality of the argument, not the volume of code.

### TA guide

The TA owns diagnosis and repair, not solution delivery.

| Moment | TA prompt | Staged hint ladder |
|---|---|---|
| Release frame | “Who owns this decision, and what can they reverse?” | 1. Name the claim. 2. Name the owner. 3. Name the invariant. 4. Show the missing contract field. |
| Architecture trace | “What crosses this arrow, and what fails if it does not return?” | 1. Locate entry/state/effect. 2. Mark the boundary. 3. Supply a minimal counterexample. 4. Ask for the smallest test/trace. |
| Incident debug | “What can already be true when the caller sees a timeout?” | 1. Draw attempts. 2. Separate logical event from delivery. 3. Identify compound state change. 4. Ask for durable evidence. |
| Patch review | “What authority or recipient did this change add?” | 1. Read changed boundary. 2. List new dependency/capability. 3. Compare to contract. 4. Require rollback/evidence. |
| Defense | “What would make you defer?” | 1. Change one premise. 2. Ask for scope. 3. Ask for alternative. 4. Ask for next falsifier. |

The TA maintains a short misconception log and schedules a regression prompt
for high-confidence misses.

### Study Partner routine

The Study Partner is a cooperative adversarial reviewer, not a cheerleader or
an answer key.

For each 20-minute rehearsal:

1. The learner gives a 90-second claim-and-invariant explanation.
2. The Study Partner asks one architecture-thread question.
3. The Study Partner changes one premise: retry, dependency outage, stale
   data, permission, metric, accessibility path, or agent request.
4. The learner says whether the decision remains, narrows, defers, or rolls
   back.
5. The Study Partner asks for the exact artifact supporting that answer.
6. Both record one unknown and one retrieval prompt.

Useful Study Partner questions:

- “What state may already have changed?”
- “Who owns that action?”
- “What alternative did you compare?”
- “What does this test not establish?”
- “What would let a user refuse or correct the result?”
- “Which new dependency, recipient, or capability did the patch add?”
- “What is your rollback trigger, and who may pull it?”

### Teaching Assistant oral-defense prompt — M26

### Supportive hint and repair ladder

Move from the learner's claim to its owner, invariant, evidence row, changed
premise, counterexample, and narrowed decision. Offer the smallest useful hint
before an explanation; the full prompt below supplies the exact conversation
sequence.

~~~text
You are Atlas Academy's M26 Teaching Assistant. Use this full-module
oral-defense prompt only after the private guided-study evidence gate is met:
the learner supplies the private M25 dossier/annex, the actual M31–M36 named
outputs and handoffs, and relevant M27–M30 artifacts or explicit unavailable
markers. During the portal-preview path, use only the `REHEARSAL ONLY` framing
card; do not conduct an oral defense or make a release/revise/defer/rollback
decision. Conduct a supportive, non-pass/fail architecture conversation only
after the learner has prepared a Release Dossier and its advanced-evidence
annex. Start with the simulated/local release claim, owner, invariant, and
defer/rollback path. Ask the learner to trace one
request through the architecture, defend one representation/algorithm or
learning-system evidence claim, replay one failure, and distinguish one
observed result from what it does not establish. Then change one premise:
retry, dependency outage, resource/precision change, distribution shift,
theorem assumption, user refusal, permission boundary, or unavailable M27–M36
artifact. Ask for a prediction before correcting. Use a hint ladder: locate
the evidence row; identify its scope/assumption; offer a counterexample;
ask which exact upstream field changes the decision; require a narrower
simulated/local release/revise/defer/rollback recommendation. Use the visible chat
as an accessible whiteboard: define symbols, provide equation prose/ASCII
fallbacks, put code in labelled fences, and make architecture diagrams/traces
readable after the conversation. End with a learner-controlled evidence
summary and maintenance handoff. Do not grade, claim platform voice settings,
authorize a real deployment, or save a raw transcript.
~~~

### Learner-controlled evidence summary

End with the learner's defended decision, evidence anchor, repaired premise,
remaining uncertainty, next falsifier, and maintenance handoff. It is a
constructive architecture-learning summary, not a grade, release approval, or
raw transcript.

### Study Partner live-rehearsal prompt — M26

~~~text
You are Atlas Academy's M26 Study Partner. Use this full-module rehearsal
prompt only after the private guided-study evidence gate is met: the learner
supplies the private M25 dossier/annex, the actual M31–M36 named outputs and
handoffs, and relevant M27–M30 artifacts or explicit unavailable markers.
During the portal-preview path, use only the `REHEARSAL ONLY` framing card; do
not issue a capstone decision or TA handoff. Run a non-grading architecture
rehearsal for the learner's bounded simulated/local capstone claim. Use the visible chat as a
readable whiteboard: give diagrams a title and prose alternative, define
notation, use concise labelled tables, and put code/diffs in language-labelled
fences. Ask for a 90-second claim-and-invariant explanation, then challenge
one M27–M36 evidence row: ask what it supports, which assumption it needs,
what counterexample or non-claim applies, and whether the release decision
changes when the artifact is unavailable. Change one operational or human
premise and require a bounded simulated/local release, revise, defer, or
rollback recommendation.
End with a compact TA handoff: strongest insight, unresolved misconception,
exact dossier anchor, decision status, and next falsifier. Do not administer
the formal oral defense or manufacture missing evidence.
~~~

### Learner-controlled note boundary

The designated chat may create at most one small record of date, module/topic,
claim, architecture trace or whiteboard snapshot, prediction, evidence,
counterexample, uncertainty, decision, and next action only when all four
conditions hold: the learner said `records on` in that exact chat, the
configured private destination is reachable, the conversation was substantive,
and neither `pause records` nor `off-record` applies. Otherwise, make no write
and provide a copyable summary. A prior `records on` never carries into a new
or ambiguously resumed substantive session; records are off until a fresh
visible `records on` in that session. Never save raw voice transcripts, credentials,
sensitive records, or an unverified claim that a live session or Notion write
occurred.

---

## 13. Retrieval schedule and maintenance handoff

### Spaced review

| When | Prompt |
|---|---|
| End of Day 56 | State the release claim, non-goal, invariant, owner, and rollback path without notes. |
| Start of Day 58 | Draw the request/retry timeline and say where the durable-effect boundary lives. |
| End of Day 60 | Give the two-minute release/defer decision with one limitation and next falsifier. |
| Three days later | Review a fresh diff and identify the first authority, provenance, or rollback question. |
| Two weeks later | Re-run the oral defense after changing a dependency or workload assumption. |
| Six weeks later | Read a real issue/patch in the chosen project and produce one miniature evidence ledger. |

### Maintenance handoff template

~~~text
capability and version:
release decision and owner:
architecture thread:
invariant and regression evidence:
known operational / trust / human-impact limits:
disable or rollback route:
where an issue is reported and triaged:
documentation that must change with the code:
next likely change and its prerequisite review:
open questions:
~~~

The handoff is the forward connection of the course. It is how a system stays
understood after the original author, agent conversation, or demo is gone.

---

## 14. Source route, rationale, and reuse boundary

The resources below inform this workbook's vocabulary and review practices.
They are not a substitute for the learner's own architecture argument, and
they do not grant certification or compliance. The university calibration
routes below were rechecked on **2026-08-01**; revisit moving course pages and
terms before any reuse.

| Resource | Use in M26 | Reuse and licensing boundary |
|---|---|---|
| [ISO/IEC/IEEE 42010:2022 metadata](https://www.iso.org/standard/74393.html) | Use the distinction between an architecture and an architecture description; frame viewpoints, stakeholders, and concerns. | The standard is copyrighted and commercially distributed. Link to its metadata and paraphrase narrowly; do not reproduce the standard, tables, or templates. |
| [C4 model diagrams](https://c4model.com/diagrams) and [notation guidance](https://c4model.com/diagrams/notation) | Choose a context, container, component, dynamic, or deployment view by the question it answers; require titles, scopes, legends, and labeled relationships. | The C4 site identifies CC BY 4.0 for its site/examples. Prefer original Atlas diagrams and retain attribution/terms if material is reused. |
| [GitHub protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches), [dependency review](https://docs.github.com/en/code-security/concepts/supply-chain-security/dependency-review), and [artifact attestations](https://docs.github.com/en/actions/how-tos/secure-your-work/use-artifact-attestations/use-artifact-attestations) | Treat merges, dependency changes, and build provenance as reviewable boundaries. | Link and paraphrase current documentation. Do not claim a repository has controls configured unless they were actually inspected and verified. |
| [MIT 6.005 Software Construction](https://ocw.mit.edu/courses/6-005-software-construction-spring-2016/) | Reinforce invariants, specifications, testing, concurrent reasoning, and code that remains ready for change. | Use as a sequencing/reference route; do not reproduce course assignments, solutions, recordings, or grading materials without checking terms. |
| [CMU 15-313 Foundations of Software Engineering](https://www.cs.cmu.edu/~ckaestne/15313/2017/index.html) and its [Open Source Excursion](https://www.cs.cmu.edu/~ckaestne/15313/2016/extra/Homework6.pdf) | Calibrate the stewardship boundary: requirements, architecture, quality attributes, inspection, measurement, and a scoped open-source contribution workflow with an active-project and documented-need selection check. | Link and paraphrase only. Atlas does not supply a team, public maintainer feedback, a merged patch, or course credit. |
| [UC Berkeley CS169 Software Engineering](https://www2.eecs.berkeley.edu/Courses/CS169/) | Calibrate verification/validation, regression and integration testing, debugging, monitoring, maintainability, cost/quality reasoning, and substantial-project scope. | Link and paraphrase only; Atlas's local dossier is not a semester-long team project or deployment certification. |
| [Georgia Tech CS 6300 Software Development Process](https://omscs.gatech.edu/cs-6300-software-development-process) | Calibrate process, quality, and maintenance as software evolves. | The official route is a comparison anchor; do not reproduce restricted course content or claim its Java/team instruction. |
| [pytest documentation](https://docs.pytest.org/en/stable/) | Read assertion output, fixtures, parametrized cases, and failure-focused regression tests. | pytest is MIT licensed; keep license/attribution requirements if code is copied. Prefer original fixtures and examples. |
| [SLSA v1.2 requirements](https://slsa.dev/spec/v1.2/requirements) and [provenance](https://slsa.dev/spec/v1.2/provenance) | Discuss artifact provenance and verification as scoped supply-chain evidence. | Record the version/status used and link/paraphrase; do not claim a SLSA level without a real conformance assessment. |
| [NIST SSDF, SP 800-218](https://csrc.nist.gov/pubs/sp/800/218/final) and [NIST SP 800-61r3](https://csrc.nist.gov/pubs/sp/800/61/r3/final) | Frame secure development and incident-response/recovery planning as lifecycle work. | Treat NIST publications as guidance, not legal advice or a certification. Check notices and incorporated third-party material before reproducing content. |
| [Google SRE Workbook: Canarying Releases](https://sre.google/workbook/canarying-releases/) | Derive a bounded canary/disable plan and distinguish it from an actual rollout. | The workbook states a CC BY-NC-ND 4.0 license. Link and paraphrase; do not reproduce illustrations or imply that Atlas has run a production canary. |
| [WCAG 2.2](https://www.w3.org/TR/WCAG22/), [WAI-ARIA APG](https://www.w3.org/WAI/ARIA/apg/), and [W3C evaluation guidance](https://www.w3.org/WAI/test-evaluate/) | Require keyboard/semantic states, text equivalents, and scoped accessibility evaluation. | Follow the W3C Document License. Do not claim WCAG conformance without an appropriate scoped conformance process. |
| [NIST Privacy Framework](https://www.nist.gov/privacy-framework), [NIST AI RMF](https://www.nist.gov/itl/ai-risk-management-framework), and [Generative AI Profile](https://doi.org/10.6028/NIST.AI.600-1) | Keep data, authority, provenance, human control, and AI-output boundaries visible. | Treat these as risk-management vocabulary and guidance. They do not certify a model, provider, or system. |
| [CMU SEI Architecture Tradeoff Analysis Method](https://resources.sei.cmu.edu/asset_files/whitepaper/1998_019_001_29711.pdf) | Use quality scenarios and tradeoffs to structure the oral defense. | Link and paraphrase only; retain scholarly attribution and do not reproduce the paper's figures or workshop material wholesale. |

### Original-artifact policy

- Draw original architecture, sequence, evidence-ledger, and release-board
  diagrams with text equivalents.
- Use synthetic fixtures or records the learner is explicitly authorized to
  inspect. Never place credentials, private learner notes, raw Notion exports,
  or production data in a capstone packet.
- Keep source/version, scope, limitation, owner, and next falsifier adjacent to
  meaningful evidence.
- Do not present a green check, output screenshot, agent transcript, benchmark,
  or polished demo as a substitute for the release argument.

---

## Closing standard

The capstone does not ask, “Can you make a sophisticated-looking system?”

It asks:

~~~text
Can you state what the system may promise,
show how its mechanisms and boundaries support that promise,
identify how the promise can fail,
collect the right scoped evidence,
refuse unjustified authority,
and leave the next maintainer a truthful path forward?
~~~

That is the durable AI-era skill: not competing with agents at raw code volume,
but directing, reading, testing, constraining, explaining, and sometimes
rejecting systems with enough precision that the people affected by them retain
control.
