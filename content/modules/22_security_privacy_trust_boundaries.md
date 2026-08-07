# Module 22 — Security, Privacy & Trust Boundaries

> **Arc IV — Machine, network, trust, and responsibility**
> **Bridge:** Module 21 taught that asynchronous and distributed evidence can be
> incomplete. Module 22 asks a prior question: which input, identity, authority,
> and evidence may Atlas trust enough to act on?

**Primary outcome:** You can read a security-sensitive Python system as a
sequence of narrow decisions. You will distinguish a supplied claim from a
validated format, an authenticated subject, an authorization decision, a safe
context-specific adapter plan, a redacted evidence record, and a real-world
security conclusion.

This is advanced material, explained from first principles. It does not teach
you how to attack systems or handle real secrets. It teaches you how to see
where a system hands out authority and how to stop a generated patch from
quietly handing out more.

---

## How to study this module

Use the same compact loop for every session:

1. Read the fixed Atlas incident and predict the strongest defensible claim.
2. Trace the diagram or code fragment before reading the explanation.
3. Label each step as data, validation, authority, effect, or evidence.
4. Run only the fixed local reference scenarios and read their packet.
5. Explain the nearest tempting overclaim in plain language.
6. Save the session artifact in your notes before continuing.

You are not being trained to memorize a checklist. When someone says “this is
trusted,” ask:

> Trusted by whom, for what action, on which resource, for which tenant and
> purpose, for how long, through which boundary, with what remaining unknowns?

### The exact cumulative invariant

> **Atlas accepts an external value only as data until the receiving boundary
> validates its shape, size, provenance, and permitted meaning. Every
> security-sensitive effect has an authenticated subject, an explicit
> authorization decision scoped to action, resource, tenant, and purpose, and
> a redacted decision record. Untrusted data never selects arbitrary code,
> process execution, filesystem escape, database structure, network authority,
> or a raw secret-bearing log field. Release artifacts have declared dependency
> and build provenance; incident evidence is minimised and labelled with what
> it does and does not prove. A safe automatic denial/defer path explains the
> next accessible action and escalates unresolved authority to the named
> owner.**

This is an Atlas teaching contract. It is not a complete security product,
compliance program, sandbox, cryptographic protocol, identity provider,
vulnerability-management system, or legal opinion.

### Claim labels

| Label | What it means | What it does not mean |
|---|---|---|
| **[INPUT CLAIM]** | Atlas received a value. | The value is true, safe, or authoritative. |
| **[VALIDATED FORMAT]** | A declared shape, type, or limit check passed. | The data has a permitted business meaning. |
| **[AUTHENTICATED]** | A named verifier produced a scoped subject result. | That subject may perform every action. |
| **[AUTHORIZED]** | A policy permits one named tuple. | The permit applies elsewhere or forever. |
| **[LOCAL OBSERVATION]** | This process observed a limited event. | Other systems saw the same event. |
| **[ATLAS MODEL]** | A deterministic course fixture produced a result. | A production service has the same property. |
| **[REDACTED LOCAL EVIDENCE]** | Minimum record remains for stated purpose. | It is complete audit or legal compliance. |
| **[UNKNOWN]** | Present evidence does not settle a fact. | The desired outcome failed or succeeded. |

### Runtime evidence card

~~~text
Reference: module22_reference.py
Tests:     test_module22_reference.py
Runtime:   local CPython 3.14.6 evidence environment
Checks:    30 behavioral tests
Scenarios: 13 fixed names only
Effects:   no network, file, archive, database, subprocess, package, or real credential action
~~~

**Runtime artifacts:** [download the local reference model](/downloads/module22_reference.py)
and [download the 30 behavioral tests](/downloads/test_module22_reference.py).

From the work directory, inspect a fixed packet:

~~~text
python module22_reference.py incident_unknown
python test_module22_reference.py
~~~

The packet can truthfully say:

~~~text
input_trace_label: INPUT_CLAIM
authorization_outcome: DENIED_AUTHENTICATION
remote_outcome: UNKNOWN_REMOTE
real_effect: NO_EFFECT
limitations: local model; not a live security assessment
~~~

That final line is part of the evidence, not a disclaimer to skip.

---

## 1. Position in the knowledge system

### 1.1 The bridge from Modules 20 and 21

Module 20 separated endpoint, bytes, frame, request, server decision, matching
reply, and client knowledge. Module 21 added owned tasks, cancellation, retry
identity, trace correlation, partial failure, and distributed claim limits.

Module 22 preserves all of those boundaries.

~~~mermaid
%% atlas-diagram-id: m22-trust-boundary-knowledge-route
%% atlas-diagram-title: Network observations become bounded security decisions before later language capabilities
%% atlas-diagram-alt: Module 20 supplies endpoints and replies, and Module 21 adds tasks, retries, traces, and UNKNOWN. Module 22 treats each received value as an input claim, then bounds parsing, authorization, adapters, and redacted evidence before Module 23 exposes a narrow language capability.
flowchart LR
    M20["M20: endpoint, bytes, request, reply"] --> M21["M21: task, retry, trace, UNKNOWN"]
    M21 --> C["A trace or operation ID correlates declared observations"]
    C --> B["M22: receiver treats it as INPUT CLAIM"]
    B --> P["parse + validate bounded meaning"]
    P --> A["authenticate + authorize exact tuple"]
    A --> E["narrow local adapter plan"]
    E --> R["redacted evidence + human recovery"]
    R --> M23["M23: grammar, bounded evaluator, narrow capability"]
~~~

### 1.2 The fixed Atlas incident

Atlas receives a delayed importer request after an asynchronous collector
already recorded UNKNOWN_REMOTE. The request has a well-formed trace field,
operation ID, source label, archive metadata, resume-state format, query value,
transformation request, and diagnostics.

A generated patch takes dangerous shortcuts:

~~~python
# Read as a claim audit. Do not run or repair it by adding string checks.
subject = packet["trace_id"]                    # correlation promoted to identity
state = load_external_object(packet["state"])   # data promoted to Python authority
extract_into_workspace(packet["archive"])       # metadata promoted to filesystem effect
query = "SELECT ... " + packet["label"]         # value promoted to SQL structure
run_transform(packet["transform"])               # label promoted to process authority
audit_log(repr(packet))                          # full request promoted to durable evidence
~~~

No malicious payload is necessary to see the problem. Each line skips a
decision. The question for the module is:

> Which boundary must make this value meaningful, who owns that decision, and
> what is the smallest effect or evidence Atlas may safely produce?

### 1.3 Six decision states, not one word called trusted

~~~mermaid
%% atlas-diagram-id: m22-claim-to-redacted-evidence-state
%% atlas-diagram-title: A received claim reaches a narrow plan or a bounded rejection with redacted evidence
%% atlas-diagram-alt: A received input claim first passes declared format and limit checks. A valid format is authenticated, then either authorized for a context-limited adapter plan or rejected by policy; malformed, unauthorized, and unsafe requests all end in redacted evidence rather than unbounded execution.
stateDiagram-v2
    [*] --> InputClaim
    InputClaim --> ValidatedFormat: declared shape and limit check
    ValidatedFormat --> Authenticated: named verifier result
    ValidatedFormat --> RejectedFormat: malformed, unknown, or oversized
    Authenticated --> Authorized: exact policy tuple permits
    Authenticated --> DeniedAuthorization: no matching rule
    Authorized --> AdapterPlan: context policy permits fake plan
    Authorized --> RejectedAdapterPolicy: unsafe sink boundary
    AdapterPlan --> RedactedEvidence
    RejectedFormat --> RedactedEvidence
    DeniedAuthorization --> RedactedEvidence
    RejectedAdapterPolicy --> RedactedEvidence
    RedactedEvidence --> [*]
~~~

**Stopping line:** A parser result, authentication result, authorization result,
and safe adapter plan are different facts. The local reference does not open a
file, extract an archive, run SQL, launch a process, install a package, or make
a connection. Its strongest success result is a fake plan.

---

## 2. Session 1 — Trust-boundary atlas: what can Atlas lose, and where does meaning change?

### Pressure

“The request arrived through Atlas with the same trace ID as the earlier task.
It is already part of the trusted system.”

No. Arrival tells you that some receiving boundary has a value. It does not
tell you who produced it, whether that producer had permission, or what an
adapter may do with it.

### Derive a control from first principles

Before naming a library, ask six questions:

1. What valuable thing can be harmed?
2. Who or what can influence this boundary?
3. What does the receiver actually know rather than merely receive?
4. What authority would a decision hand out?
5. What must remain true after retry, delay, failure, or review?
6. What evidence is legitimate to retain?

~~~mermaid
%% atlas-diagram-id: m22-importer-trust-boundaries
%% atlas-diagram-title: An importer crosses explicit parsing, worker, adapter, review, and evidence boundaries
%% atlas-diagram-alt: A supplied importer request enters the Atlas API for parsing and limits, carries only correlation through a queue, and reaches a policy-bound worker. That worker selects fixed database, archive, transform, release-review, and redacted-evidence paths rather than handing the request unrestricted authority.
flowchart LR
    U["Supplied importer request: INPUT CLAIM"] --> API["Atlas API: parse and limits"]
    API --> Q["Module 21 queue/task: correlation only"]
    Q --> W["import worker: policy boundary"]
    W --> D["database adapter: fixed statement plus values"]
    W --> F["archive policy: metadata only"]
    W --> T["transform adapter: enum plus typed arguments"]
    W --> P["release review: source, build, publisher"]
    W --> L["evidence store: redacted fields only"]
    U -. trace and operation ID .-> Q
~~~

### Boundary card

| Element | Atlas example | Required question |
|---|---|---|
| Asset | published learning guide and learner access | What harm follows if this changes incorrectly? |
| Influencer | upstream source, retrying client, operator, dependency, bug | Who can supply or change the value? |
| Claim | trace ID, tenant label, source name, archive member | What has been asserted, not proven? |
| Protected effect | publish, read, write, transform, retain | Who may cause this exact effect? |
| Boundary owner | parser, policy evaluator, narrow adapter, reviewer | Where must decision be enforced? |
| Evidence | reason code, policy version, redacted reference | What minimum record supports review? |

### Code-reading lab S1 — trace promotion

~~~python
def choose_subject(packet):
    return packet["trace_id"]
~~~

Predict before reading on:

A. The trace is authenticated because Atlas emitted it earlier.<br>
B. The trace can correlate local observations but needs separate identity evidence.<br>
C. A trace proves the request is authorized for this tenant.<br>
D. A trace proves the remote importer completed.

<details>
<summary>Reveal after recording your answer and confidence.</summary>

**Best answer:** B. Trace correlation is useful but it is not identity,
authorization, or remote completion.

</details>

### Prediction checkpoint — correlation is not authority

Use a fresh, fixed local packet: it has the same `trace_id` as an earlier
import attempt, but no subject evidence or policy decision. Before opening the
reveal, write one choice and confidence from 1 (guessing) to 4 (could explain
the boundary):

- A. The trace proves the caller is the earlier subject.
- B. The trace permits this tenant's requested effect.
- C. The trace is correlation input until another boundary establishes more.
- D. The trace proves the remote importer did not act.

<details>
<summary>Reveal after recording your prediction and confidence</summary>

**C** is the strongest allowed claim. A trace can connect local observations,
but it does not establish identity, authorization, or a remote effect. If your
answer was A, B, or D, redraw the distinction between a received value, an
identity assertion, an exact authorization tuple, and an observed effect.

</details>

### Trace-disposition card — context is not a credential

An inbound `traceparent` / `tracestate` needs a boundary disposition, not a
promotion. The boundary owner chooses to **drop** it, **restart** a local
context, or **continue** only a permitted context after format, size, privacy,
and trust rules. Treat `tracestate` as opaque vendor data, not a safe raw log
field. A redacted local correlation reference and policy version can support
diagnosis; separately verified identity and authorization still govern every
protected effect.

### Session artifact

Complete this sentence in your notes:

> At the **[boundary]**, Atlas receives **[input claim]**. Before it may cause
> **[effect]** on **[asset]**, **[owner]** must validate **[needed evidence]**
> and apply **[authority tuple or policy]**. It may retain only **[minimum record]**.

---

### Session 1 output — trust-boundary atlas

One atlas marks every point where Atlas data changes hands, and states what meaning can be lost at each.

## 3. Session 2 — Identity-to-decision ladder: who may cause this effect?

### Pressure

“The session is valid, so let the worker publish.”

This confuses two questions:

- **Authentication:** Which subject does a declared verifier associate with
  presented evidence under its stated trust model?
- **Authorization:** May that subject perform this action on this resource for
  this tenant and purpose under this policy version now?

A badge reader may establish that a badge was accepted. A room policy decides
whether that badge opens this room now. A camera record is not a room lock.

### The authority tuple

Atlas does not have a generic authorized Boolean. It evaluates:

~~~text
subject
+ tenant
+ resource
+ action
+ purpose or audience
+ policy version
+ freshness or revocation observation
= one narrow decision
~~~

~~~mermaid
%% atlas-diagram-id: m22-authorization-tuple-decision
%% atlas-diagram-title: Authorization resolves an exact canonical tuple through a versioned explicit rule
%% atlas-diagram-alt: A presented claim is verified for a scoped subject, canonical tenant and resource, action and purpose, then policy version and freshness. An explicit matching rule authorizes only that tuple; otherwise the system denies, defers, or escalates while retaining redacted decision evidence.
flowchart TD
    C["Presented claim"] --> V["Declared verifier"]
    V --> S["Scoped subject result"]
    S --> T["canonical tenant"]
    T --> R["canonical resource"]
    R --> A["action plus purpose"]
    A --> PV["policy version plus freshness"]
    PV --> D{"explicit rule?"}
    D -->|yes| P["AUTHORIZED for exact tuple"]
    D -->|no or unavailable| N["DENY, DEFER, or ESCALATE"]
    P --> E["redacted decision evidence"]
    N --> E
~~~

### Rigor card — authorization is a predicate, not a property of a trace

### Definitions

A verifier turns a presented claim into a scoped subject or a
failure. A separate policy then evaluates one explicit tuple:

```text
verify(claim) -> subject | failure
allow(subject, tenant, resource, action, purpose, policy_version, freshness)
  -> PERMIT | DENY | DEFER
```

A trace ID may correlate observations, but it is not by itself a subject,
authority grant, or protected effect.

### Assumptions and boundary

Tuple fields are canonicalized before policy evaluation; the
policy version and freshness/revocation rule are named; and the decision owner
enforces the result at the narrow effect boundary. A receiving API, a log line,
or an encrypted transport does not silently satisfy those assumptions.

### Derivation and proof idea

Authorization must depend on the exact action and
resource because a verified subject can be permitted for one effect and denied
for another. Therefore a correct decision cannot be derived from correlation
alone; it needs the verified subject plus the full scoped tuple at the point
where an effect would occur.

### Counterexample and numerical experiment

Under one declared illustrative policy,
the same trace ID can lead to different decisions because the tuple changed:

| Trace | subject | tenant/action | illustrative result | Why |
| --- | --- | --- | --- | --- |
| `T-17` | `editor-1` | `atlas-a` / publish | `PERMIT` | exact policy rule matches |
| `T-17` | `editor-1` | `atlas-b` / publish | `DENY` or `DEFER` | same correlation, different protected effect |

This two-row policy check is not a security assessment or a claim about any
real identity provider; it makes the missing decision inputs visible.

### What Module 21 contributes

A retry uses a stable operation ID because one intended distributed operation
may have several attempts. That identity does **not** make the ID a bearer
credential. If a different authenticated subject reuses it, Atlas applies
policy again. A remote outcome after timeout can remain UNKNOWN; a later status
query is another protected action.

### Code-reading lab S2 — valid subject, wrong target

~~~python
if authenticated_subject:
    return publish(request.tenant, request.resource)
~~~

| Needed comparison | Why it matters |
|---|---|
| subject ↔ tenant | A subject may belong to one tenant but not another. |
| subject ↔ resource | A tenant-wide idea may still not cover this record. |
| subject ↔ action | Read, transform, and publish are different effects. |
| subject ↔ purpose | Evidence accepted for one service may not transfer. |
| policy version/freshness | Current decision policy may differ from historical evidence. |

### Freshness is a separate question

An expiry field can be useful. It does not prove non-revocation, correct clocks,
global propagation, or replay resistance. If required freshness evidence is
unavailable, Atlas needs declared policy:

| Outcome | What Atlas may say | What it must not say |
|---|---|---|
| Deny | “This action was not automatically permitted.” | “The subject is malicious.” |
| Defer | “More evidence is required before action.” | “Authority is valid because checking is inconvenient.” |
| Escalate | “A named owner must review this case.” | “Escalation proves permission.” |

### Session artifact

Create a four-row authority table:

| Subject evidence | Tenant | Resource | Action | Purpose | Freshness | Policy result |
|---|---|---|---|---|---|---|
| authenticated fixture worker | atlas-learning | guide-042 | publish | reconcile-import | current model state | permitted model plan |
| authenticated fixture worker | another tenant | guide-042 | publish | reconcile-import | current model state | deny |
| unknown subject | atlas-learning | guide-042 | publish | reconcile-import | unknown | deny, defer, or escalate |
| same operation ID, different subject | atlas-learning | guide-042 | status | recovery | current model state | new policy decision |
+
---

### Session 2 output — identity-to-decision ladder

One ladder traces a request from claimed identity to authorized effect, naming the rung where authority is actually decided.

## 4. Session 3 — Data-to-authority pipeline: why one sanitize box cannot protect every sink

### Pressure

“We validated the API request, so the fields are safe everywhere downstream.”

A value has no one universal safe form. It can be safe as text, unsafe as a
file path, valid as a database value, invalid as a SQL identifier, and
inappropriate to retain in an audit record. The receiving context owns the
next decision.

### The pipeline

~~~mermaid
%% atlas-diagram-id: m22-validate-canonicalize-authorize-pipeline
%% atlas-diagram-title: External data becomes an authorized narrow plan only after bounded validation and policy
%% atlas-diagram-alt: An external representation is checked for syntax, shape, and size; semantic rules then produce canonical form within a resource budget. A context-specific adapter policy either authorizes a narrow plan or returns a bounded rejection, and both paths yield redacted local evidence.
flowchart LR
    I["external representation"] --> S["syntax, shape, size"]
    S --> M["schema and semantic rule"]
    M --> C["canonical form and resource budget"]
    C --> X["context-specific adapter policy"]
    X --> A["authorized narrow plan"]
    X --> R["bounded rejection"]
    A --> E["redacted local evidence"]
    R --> E
~~~

Do not replace the middle of this diagram with “sanitize.” That word hides
which meaning, length, representation, resource budget, and effect are being
checked.

### Five safe code-reading boundaries

| Sink | Tempting promotion | Atlas rule | Local reference evidence |
|---|---|---|---|
| Resume state | data → general object loader | accept only declared primitive fixture format before any loader exists | REJECTED_RESUME_FORMAT |
| Archive | metadata → filesystem effect | inspect path, link type, member count, and size first | archive policy result or metadata plan only |
| Database | value → SQL structure | fixed statement shape plus separate bound value | QueryPlan with no connection |
| Transform | label → process authority | prior policy permit plus allowlisted enum and typed fake adapter | fake transform plan or deny |
| URL/XML/parser | text → universal semantic safety | declare grammar, destination, and resource policy | bounded design requirement |

### Resume-state boundary

The Python documentation warns that general object serialization formats are
not a generic boundary for data from an untrusted or unauthenticated source.
The lesson is not “find a cleverer serializer.” It is:

> Before a format can select an interpreter-like loader, decide whether that
> format is acceptable at all for this boundary.

The course model accepts only primitive-json as a fixed fixture label. It never
calls a loader.

### Archive boundary

Python 3.14 has a safer default data filter for tar extraction, but its
documentation still requires applications to inspect untrusted archives and
choose their own policy. A filter is mitigation, not universal proof.

The model handles metadata only:

~~~text
member path: lesson.txt       kind: file       size: 16
member path: ../outside.txt   kind: file       size: 8
member path: C:/outside.txt   kind: file       size: 8
member path: notes-link       kind: symlink    size: 0
~~~

No archive is opened. No filesystem is touched. The question is purely: which
metadata violates Atlas policy before any effect is possible?

Metadata preflight is not an effect-time guarantee. If a future product ever
extracts, an operation owner must enforce member policy immediately before each
effect into an owned destination, keep resource/collision/link limits, and
account for or clean up partial output after failure. Atlas deliberately does
none of that here: it remains a metadata-only exercise, not an extraction lab.

### Database boundary

A value belongs in a placeholder. Statement structure is an application
decision.

~~~python
statement = "SELECT record_id FROM atlas_records WHERE label = :label"
parameters = {"label": "intro-python"}

# The course model records this plan. It does not open a database.
~~~

Parameter binding helps separate a value from statement structure. It does not
decide whether a subject has database rights, whether a record belongs to the
tenant, or whether publication is the right business action.

### Process boundary

The Python subprocess documentation makes an architectural distinction:
Python does not silently choose a shell, but an application that explicitly
hands work to shell processing owns the quoting and security policy. Atlas does
not demonstrate a shell. It uses a fake adapter:

~~~text
required before plan: PERMITTED_MODEL_PLAN for exact authority tuple
approved operation enum: normalize_text
typed source label: catalog
result: APPROVED_FAKE_TRANSFORM_PLAN
process started: false
~~~

### Code-reading lab S3 — find the first promotion

Classify each line as parse, validate, bind, authorize, effect, or evidence.

~~~python
label = packet["query_label"]
statement = "SELECT record_id FROM atlas_records WHERE label = " + label
~~~

The second line is not validation. It lets a value select statement structure.
The correct repair begins with a fixed statement shape, separate value binding,
and a separate authorization decision.

### Code-reading, debugging, and design checkpoint — one input, three separate decisions

**Read.** Trace where `packet["query_label"]` changes from received data into
statement structure. **Debug.** Name the first false promotion: an external
value now selects SQL structure before a boundary has constrained it.
**Design.** Keep the statement shape fixed, bind the label as a value, require
the exact authority decision before creating the local fake `QueryPlan`, and
retain only redacted decision evidence.

Use four bounded acceptance checks: statement shape does not change when the
label changes; parameters may change without becoming structure; a
cross-tenant denial creates no plan; and retained evidence contains no raw
label. Parameter binding is still not authorization for another tenant's
effect. This is a code-reading and design exercise against the fake adapter,
not a database target or an attack demonstration.

### Session artifact — five no-promotion rules

Finish these statements:

- Resume state may not select **[loader]** until **[format policy]** accepts it.
- Archive metadata may not select **[filesystem effect]** until **[path/link/count/size policy]** accepts it.
- Database value may not select **[statement structure]**; **[parameter binding]** and **[authorization]** remain separate.
- Transform name may not select **[process authority]**; only **[prior permit + enum + typed adapter]** may form a plan.
- Parser result may not select **[another context]** without that context's **[meaning/resource policy]**.

---

### Session 3 output — sink-specific encoding map

One map shows why a single sanitize step cannot protect sinks with different grammars, and assigns an encoding to each.

## 5. Session 4 — Cryptographic purpose map: what does this primitive actually establish?

### Pressure

“The value is encoded, hashed, or signed, so it is secure.”

Security mechanisms have purposes and assumptions. Treating them as magic
stickers creates serious design errors.

~~~mermaid
%% atlas-diagram-id: m22-security-property-mechanism-selection
%% atlas-diagram-title: Security mechanisms follow the needed property and still do not replace authorization
%% atlas-diagram-alt: A required property leads to a distinct mechanism: reviewed randomness for hard-to-guess values, a slow salted verifier for passwords, a MAC for shared-key integrity, peer and certificate policy for transport, or a declared public-key identity system. Each still feeds a separate authorization decision.
flowchart TD
    N["What property is needed?"] --> R["hard-to-guess value"]
    N --> K["password verifier"]
    N --> M["message integrity under shared key"]
    N --> T["authenticated transport peer/channel"]
    N --> P["public-key identity/signature system"]
    R --> A["reviewed random API plus lifecycle"]
    K --> B["slow salted verifier/KDF plus current review"]
    M --> C["MAC plus shared-key trust model"]
    T --> D["peer, certificate, hostname policy"]
    P --> E["declared issuer/key/distribution model"]
    A --> X["authorization still separate"]
    B --> X
    C --> X
    D --> X
    E --> X
~~~

### Purpose map

| Need | Mechanism family | What it can support | What it cannot silently support |
|---|---|---|---|
| Hard-to-guess temporary value | cryptographically strong randomness | unpredictable value generation under lifecycle policy | permission to use resource |
| Password checking | salted slow verifier/KDF concept | non-recoverable verifier design | general authorization system |
| Integrity with shared secret | HMAC or another MAC | message integrity/authenticity under stated key model | encryption, public signature, policy decision |
| Safer digest comparison | compare_digest | avoids ordinary content-dependent early comparison behavior in relevant use | correct protocol, key distribution, rate control, safe logging |
| Transport peer/channel | TLS context and certificate/hostname policy | declared transport relationship | user role, tenant policy, request semantics |
| Public-key identity | signature system with declared keys/issuer | scoped identity/integrity claim under ecosystem | arbitrary authorization everywhere |

### The local HMAC fixture

The reference uses a static **fixture MAC key** and deterministic HMAC check to
show that changed bounded request meaning yields a mismatch. This is a
microscope, not a production token format.

~~~text
fixture assertion result: MATCH or MISMATCH
scope: ATLAS MODEL
not claimed: encryption, production authentication, authorization, replay prevention,
             signature/non-repudiation, key storage, key rotation, or live identity
~~~

A MAC uses a shared secret. It is not a public-key signature. Do not call it a
signature in explanations.

### TLS scope

The Python SSL documentation recommends a default client context for ordinary
client use because it enables peer certificate validation and hostname checking
under its documented default policy. A direct context needs deliberate review.

That supports a narrow claim:

> Atlas reviewed a static configuration for peer verification, hostname
> verification, and a declared CA source. No connection was attempted.

It does not support a claim about application user authority, tenant policy, or
real peer completion.

### Code-reading lab S4 — purpose audit

~~~python
if digest == request["digest"]:
    return "authorized"
~~~

Name the missing layers:

1. Which digest, key, or provenance model is this?
2. Is comparison appropriate for the relevant secret comparison?
3. What subject is authenticated, if any?
4. Which tenant/resource/action/purpose policy is still required?
5. What fields must not be logged?

### Session artifact — purpose cards

For each row in the purpose map, write:

~~~text
need → mechanism → trust assumption → evidence → nonclaim → lifecycle owner
~~~

If you cannot fill the nonclaim, you are likely over-promoting the mechanism.

---

### Session 4 output — cryptographic purpose map

One map states what each primitive establishes — confidentiality, integrity, authenticity, or freshness — and what it does not.

## 6. Session 5 — Release provenance and human impact: what must be true to ship responsibly?

### Pressure

“The dependency is pinned and the denial panel is polished, so the release is
secure and user-safe.”

A release is a chain of evidence, not a badge. A user experience is part of
safety, not decoration added afterward.

### Provenance chain

~~~mermaid
%% atlas-diagram-id: m22-release-provenance-chain
%% atlas-diagram-title: Release trust depends on linked source, review, build, publisher, deployment, and recovery evidence
%% atlas-diagram-alt: A source change is connected to review evidence, dependency declaration, local integrity control, build-environment and publisher assumptions, and a release artifact. Deployment and recovery review then connect that artifact to user impact and a support path, making the trust chain inspectable rather than automatic.
flowchart LR
    S["source change"] --> R["review evidence"]
    R --> D["dependency declaration"]
    D --> H["local integrity control"]
    H --> B["build environment assumption"]
    B --> P["publisher identity assumption"]
    P --> A["release artifact"]
    A --> G["deployment/recovery review"]
    G --> U["user impact and support path"]
~~~

Break one link and state what remains unknown.

| Evidence present | Helpful conclusion | Still unknown |
|---|---|---|
| pinned version | one requested version is named | source review, publisher/build trust, runtime behavior |
| local package hash | installer can detect changed expected artifact in that model | publisher identity, vulnerabilities, safe runtime behavior |
| trusted publishing pattern | short-lived publishing identity can reduce long-lived credential exposure | every source change and dependency is trustworthy |
| release test passed | named local behavior passed | deployment configuration, user impact, future histories |
| audit log exists | scoped observation was retained | completeness, containment, right to retain data |

The local reference review uses four static declarations: local hash,
source-distribution review, publisher identity, and build provenance. A
complete fixture review returns REVIEWED_RELEASE_PLAN. It still does not
install, publish, or prove supply-chain safety.

### Privacy: risk to people, not only secrecy

Ask:

- What data is necessary for this feature or investigation?
- Why is it collected, and for what retention/access policy?
- Could a reduced record still support debugging?
- Could a denial or appeal message leak another tenant's information?
- Who is harmed if data is wrong, excessive, inaccessible, or unavailable?

Redacting a screen after a full packet has been retained is not the same as
collecting less, retaining less, or limiting access.

### Accessibility and fair user outcomes

A safe automatic denial should still provide usable, privacy-minimized next
steps.

| Requirement | Why it matters |
|---|---|
| text labels in addition to color | state remains understandable without one sensory channel |
| visible keyboard focus | user can operate and inspect decision path |
| contrast and resize-friendly text | evidence and recovery remain legible |
| clear reason category, not secret details | user can act without receiving sensitive internal information |
| named escalation owner | uncertainty receives accountable review rather than abandonment |

Do not claim formal WCAG conformance from one module. Treat these as
evidence-backed design requirements whose complete evaluation has its own scope.

### Code-reading lab S5 — review the release and denial

~~~text
release manifest:
  has_local_hash: true
  source_distribution_reviewed: false
  publisher_identity_declared: false
  build_provenance_declared: false

denial panel:
  red text only
  shows raw diagnostic value
  has no next action or escalation owner
~~~

What should Atlas say?

A. “Secure release; user cannot proceed.”<br>
B. “Hash proves source and publisher are trusted.”<br>
C. “Release review is incomplete; outcome needs named recovery and accessible
   explanation.”<br>
D. “Log more raw diagnostics to help support.”

<details>
<summary>Reveal after recording your answer and confidence.</summary>

**Best answer:** C.

</details>

### Session artifact — consequence ledger

| Decision/release field | Benefit | Possible harm | Minimum evidence | Owner |
|---|---|---|---|---|
| dependency hash | detects specified artifact change | false sense of full provenance | local integrity result + limits | release reviewer |
| denied import | prevents automatic uncertain effect | blocks a learner or operator | reason category + recovery path | policy owner |
| diagnostic trace | supports correlation | mistaken for identity or retained too broadly | redacted correlation label | incident owner |
| user message | explains next action | leaks tenant/system detail if excessive | minimal accessible wording | product/support owner |
+
---

### Session 5 output — release provenance record

One record states what must be true about an artifact's origin before it ships, and who owns each claim.

## 7. Session 6 — Privacy-aware incident reconstruction: how do we learn without overclaiming?

### Pressure

“The log shows a timeout and policy denial, so we know what happened.”

A local timeout is a Module 21 observation. A local authentication or
authorization denial is a local decision record. Neither settles remote importer
history, proves successful containment, or permits an unbounded status query.

### Facts, hypotheses, and unknowns

~~~mermaid
%% atlas-diagram-id: m22-facts-hypotheses-unknown-recovery
%% atlas-diagram-title: Redacted facts, hypotheses, and visible unknowns guide bounded recovery and improvement
%% atlas-diagram-alt: A redacted local timeline splits into facts that can be labeled, compatible hypotheses, and visible UNKNOWNs. Facts and hypotheses support a bounded containment or recovery candidate, while unknowns require an authorized status check or escalation; both routes lead to improvement and regression testing.
flowchart TD
    L["redacted local timeline"] --> F["facts we can label"]
    L --> H["compatible hypotheses"]
    L --> U["UNKNOWN remains visible"]
    F --> C["bounded containment/recovery candidate"]
    H --> C
    U --> A["new authorized status check or escalation"]
    C --> I["improvement and regression test"]
    A --> I
~~~

For the fixed model:

| Item | Label | Correct statement |
|---|---|---|
| local timeout fired | [LOCAL OBSERVATION] | Atlas stopped waiting locally. |
| authentication denial | [LOCAL OBSERVATION] | The verifier did not accept evidence under fixture policy. |
| authorization denial | [LOCAL OBSERVATION] | Policy did not permit this exact tuple. |
| remote importer effect | [UNKNOWN] | Several histories may remain compatible. |
| later status lookup | [AUTHORIZATION REQUIRED] | It is a new protected operation. |
| local packet | [REDACTED LOCAL EVIDENCE] | It supports scoped review, not complete history. |

### Audit is observation, not containment

Python audit hooks can provide useful observation opportunities. The Python
documentation warns that interpreter-level hooks are not a sandbox and may be
bypassed by malicious code. Therefore this claim is correct:

~~~text
audit hook proposal → LOCAL OBSERVATION
audit hook proposal → NOT_A_SANDBOX
~~~

If you need containment, state the real containment boundary. Do not rename
observation “security” and hope it becomes enforcement.

### Incident packet template

~~~text
Scenario:
Facts observed locally:
Hypotheses still compatible:
UNKNOWN facts:
Automatic effect taken: none or named safe effect
Required authorization for next check:
Redacted evidence retained:
Privacy and accessibility concern:
Escalation owner:
Recovery action:
Learning action and regression test:
Claim boundary:
~~~

The local model packets use a fixed closed schema: model/schema/run IDs,
canonical request digest, parser/authentication/authorization/adapter/release
labels, policy/trace scope, privacy/accessibility outcome, escalation owner,
facts, hypotheses, unknowns, and explicit limitation. They deliberately omit
raw assertion, query, archive payload, transform arguments, endpoint, and user
record.

### Module 23 handoff

Module 23 will build a small query/policy language. It inherits a strict
security contract:

~~~text
input text
→ grammar
→ parser
→ typed/canonical representation
→ bounded evaluation environment
→ narrow capability
→ result/error with redacted evidence
~~~

An input string is not a Python expression. An abstract syntax tree is not a
capability. A successful parse is not an authorization result.

### Transfer task — one new sink, same boundary rule

A fictional local reporting repair proposes a new `report_format` field. Do
not implement or call a renderer. Instead, make a five-box whiteboard trace:

```text
received report_format claim
→ declared fixed representation
→ exact policy decision
→ fixed local rendering effect
→ redacted evidence and nonclaim
```

For each arrow, name the owner and the fact that must still be established.
Then change one premise: the same value now names a report for another tenant.
Predict the first boundary that must reject, defer, or escalate it. This is a
transfer exercise, not permission to contact a service or a route around
Module 23's prerequisites.

### Conversational oral defense — M22

The Teaching Assistant leads this supportive, post-module conversation; the
Study Partner may rehearse the same ideas but does **not** administer or grade
the defense. Begin with one learner-selected claim, a prediction about its
strongest supported conclusion, and confidence from 1 to 4. The aim is to make
reasoning visible and repairable, never to produce a pass/fail result.

Use the visible chat as a readable whiteboard. Write a labelled trace such as
`claim → boundary → decision → protected effect → redacted evidence`. If an
equation or notation helps, use supported inline or display math, define every
symbol, and give a plain-language or ASCII fallback; put code or state traces
in a language-labelled fence and then summarize them in prose. Do not rely on
speech, color, or an unlabelled diagram alone.

### Hint ladder

Start with: “Which value is only a claim?” Then ask which boundary owns the
next decision, which authority tuple is still missing, and which smallest
local observation could narrow the conclusion. Offer one small prompt at a
time rather than replacing the learner's reasoning.

### Counterexample turn

Change exactly one premise: a trace matches but the tenant changes, a valid
MAC appears but the policy denies, or a local timeout occurs while remote
status remains UNKNOWN. Ask which earlier conclusion no longer follows and
which nonclaim must remain visible.

### Transfer turn

Move the same boundary model to the fictional `report_format` repair above.
The learner explains why parsing, a fixed enum, authentication, authorization,
and a renderer answer distinct questions. Keep all examples synthetic and
local.

### Reflection and learner-controlled evidence summary

End with the learner's chosen claim, prediction/confidence, repaired boundary
trace, one remaining uncertainty, and one next retrieval action. The learner
controls whether to keep that compact summary; this workbook does not assert
that any chat, voice session, or external record occurred.

### Session artifact

Write a one-page incident reconstruction. Your final paragraph must contain one
sentence beginning “Atlas does not know whether…”. Keeping UNKNOWN visible is a
mastery skill.

---

### Session 6 output — trust and release dossier

One dossier reconstructs an incident without overclaiming: what was observed, what was inferred, and what remains unknown.

## 8. Atlas Trust Control Room — visual studio text equivalent

The portal reader provides six prediction-before-reveal views. This text route
gives the same facts without depending on animation or color.

| View | Your prediction | Evidence revealed | Nonclaim |
|---|---|---|---|
| **Trust-boundary atlas** | Matching trace arrives. What is established? | supplied correlation value crossed a boundary | trace is not identity or permission |
| **Identity-to-decision ladder** | Valid session requests another tenant’s release. What remains? | exact policy tuple and freshness decision | authentication is not authorization |
| **Data-to-authority pipeline** | API validation passed. May input select archive, SQL, or process effect? | every sink needs its own boundary | one sanitize step is not universal |
| **Cryptographic purpose map** | Value is MACed or TLS-protected. What may Atlas say? | mechanism-specific scope and assumptions | crypto/channel fact is not policy permit |
| **Release-provenance chain** | Dependency hash matches. What remains unknown? | source/review/build/publisher chain | integrity control is not full trust |
| **Privacy-aware incident timeline** | Timeout and denial appear in a log. What is known? | local facts, hypotheses, UNKNOWN, recovery | evidence is not complete history or containment |

For every view:

- select one answer and confidence 1–4 before reveal;
- examine supported claim and nearest tempting overclaim;
- use arrows, Home, and End to move among tabs;
- treat exploration coverage as views examined, never mastery;
- local progress stores only answer choice, confidence, and reveal state;
- use reset to repeat prediction with no free-form personal or secret input.

---

## 9. Eight-level problem ladder

| Level | Task | Evidence of understanding |
|---:|---|---|
| 1 | Label claims, facts, effects, and UNKNOWN in a short incident. | You do not call trace identity. |
| 2 | Draw the importer trust-boundary map. | Every arrow has data, owner, and effect. |
| 3 | Build exact authorization tuple for proposed release. | You identify default deny and missing information. |
| 4 | Read patch and mark first data-to-authority promotion. | You name correct receiving boundary. |
| 5 | Compare random, KDF, MAC, TLS, and signature purposes. | You state a nonclaim for each. |
| 6 | Audit fictional provenance and user-facing denial. | You preserve privacy/accessibility/recovery tradeoffs. |
| 7 | Direct agent to make one local fake-adapter repair and verify it. | Brief forbids real targets, secrets, and effects. |
| 8 | Defend incident dossier across M20, M21, M22, and M23. | You explain sources, limits, and next owner. |

---

## 10. Confidence-aware diagnostic — eight fast, deep checks

Record confidence from 1 (guessing) to 4 (could teach it). A high-confidence
wrong answer triggers a boundary redraw. A low-confidence correct answer
triggers a contrast explanation.

### Q1 — Correlation

A request has same trace ID as an earlier collector attempt. What follows?

A. Sender is authenticated.<br>
B. Sender is authorized to retry.<br>
C. Atlas has correlation input until relevant trust model validates more.<br>
D. Remote effect is known.

<details>
<summary>Reveal after recording your answer and confidence.</summary>

**Answer:** C. Trace correlation is not identity, authorization, or remote
completion.

</details>

### Q2 — Authentication versus authorization

A verifier accepts subject evidence. Subject requests another tenant’s publish
action. What must Atlas do next?

A. Permit because authentication succeeded.<br>
B. Evaluate exact tenant/resource/action/purpose/policy decision.<br>
C. Treat trace as proof of tenant membership.<br>
D. Ask database to decide from a string.

<details>
<summary>Reveal after recording your answer and confidence.</summary>

**Answer:** B. Authentication and authorization answer different questions.

</details>

### Q3 — Input boundary

A request was well-formed at API. Which statement is strongest?

A. Archive may now be extracted anywhere.<br>
B. Values may build SQL structure.<br>
C. Every receiving context still needs meaning and resource policy.<br>
D. It may select a Python object loader.

<details>
<summary>Reveal after recording your answer and confidence.</summary>

**Answer:** C. Parsing is not universal semantic or authority validation.

</details>

### Q4 — Parameter binding

Why use fixed SQL statement shape with separate bound value?

A. It automatically grants database access.<br>
B. It keeps value from selecting statement structure in that context.<br>
C. It proves value came from trusted user.<br>
D. It makes all queries safe regardless of policy.

<details>
<summary>Reveal after recording your answer and confidence.</summary>

**Answer:** B. Authorization and business rules remain separate.

</details>

### Q5 — Cryptographic purpose

A fixture HMAC matches. What is best conclusion?

A. Request is encrypted and authorized.<br>
B. HMAC is public signature with non-repudiation.<br>
C. Under fixture key model, bounded message matched; policy is still separate.<br>
D. Remote importer certainly executed.

<details>
<summary>Reveal after recording your answer and confidence.</summary>

**Answer:** C. MAC has a key/trust model and does not decide authorization.

</details>

### Q6 — TLS scope

A static client TLS configuration has peer verification and hostname checking.
What may Atlas claim?

A. Application user is authorized.<br>
B. Static configuration review found declared transport policy fields.<br>
C. Every request field is safe.<br>
D. Peer completed a real connection.

<details>
<summary>Reveal after recording your answer and confidence.</summary>

**Answer:** B. Reference opens no connection, and TLS is not app policy.

</details>

### Q7 — Provenance

A dependency hash matches requirements file. What remains unknown?

A. Nothing; it proves entire supply chain.<br>
B. Source review, publisher/build assumptions, vulnerability posture, and
   runtime behavior still need separate evidence.<br>
C. Package cannot run code.<br>
D. User experience is accessible.

<details>
<summary>Reveal after recording your answer and confidence.</summary>

**Answer:** B. Local integrity control is valuable but narrow.

</details>

### Q8 — Incident evidence

A redacted local packet records timeout and authorization denial. What is
correct next statement?

A. Remote importer effect did not happen.<br>
B. Log is a sandbox.<br>
C. Remote effect can remain UNKNOWN; later status check needs authorization and
   evidence scope.<br>
D. Store full raw request forever to be safe.

<details>
<summary>Reveal after recording your answer and confidence.</summary>

**Answer:** C. Preserve uncertainty and minimize retained data.

</details>

### Misconception map — nearest tempting overclaims

| Tempting shortcut | Repair question | Return route |
|---|---|---|
| “The trace identifies the caller.” | What independent evidence binds a subject to this request? | Session 1 and Session 2 |
| “Authentication permits the effect.” | Which tenant/resource/action/purpose/policy tuple still needs a decision? | Session 2 |
| “It parsed, so every sink is safe.” | Which receiving context gives the value a new meaning or effect? | Session 3 |
| “A MAC or TLS decision grants policy.” | What mechanism-specific claim is supported, and what policy claim remains separate? | Session 4 |
| “The packet tells the whole incident.” | Which facts are observed, which are hypotheses, and which remain UNKNOWN? | Session 6 |

---

## 11. Cumulative project — Atlas Trust & Release Dossier

### Scenario

Review a generated hardening patch for the fixed delayed importer. You may not
contact a live service, use real credentials, deserialize an external object,
extract archive, run process, install package, or test third-party target.

### Required deliverables

1. **Trust map:** asset, actor, boundary, claim, protected effect, harm,
   assumption, and owner for importer.
2. **Decision table:** subject, tenant, resource, action, purpose, policy,
   freshness, permit/deny/defer/escalate result.
3. **Five sink cards:** resume state, archive metadata, database value,
   transform adapter, and evidence record.
4. **Crypto and TLS explanation:** purpose, trust assumption, evidence, and
   nonclaim. No custom protocol.
5. **Release and user-impact review:** source/dependency/build/publisher gaps,
   privacy/minimization, accessibility, fairness question, attribution, and
   recovery path.
6. **Executable evidence:** run named local scenarios and attach redacted
   packets plus behavioral test result.
7. **Agent brief:** specify local-only fake-adapter task, acceptance tests,
   prohibited effects, and review criteria.
8. **Oral defense:** connect M20 endpoint evidence, M21 UNKNOWN, M22 trust
   boundary, and M23 grammar/capability handoff.

### Minimal agent brief

~~~text
Implement only requested local pure-function seam.
Use fixed synthetic fixtures; no external requests, secrets, file access,
archive extraction, database connection, subprocess, package install, or
network target.
Expose public decision/evidence interface and tests at that interface.
State every nonclaim and preserve UNKNOWN when evidence is incomplete.
~~~

### Review rubric

| Criterion | Weight |
|---|---:|
| exact boundary and authority-tuple reasoning | 25% |
| code/architecture reading and patch review | 20% |
| local evidence, tests, UNKNOWN, and limitations | 20% |
| provenance, privacy, accessibility, professional judgment | 15% |
| agent direction/review/verification plan | 12% |
| narrow implementation quality | 8% |
+
---

## 12. TA sessions, Study Partner protocol, and retrieval

### TA intake rule

Bring one named claim, one code path, and one prediction. The TA asks:

1. What asset and effect are at stake?
2. What boundary receives data?
3. Which field is only a claim?
4. What exact authority tuple is missing or wrong?
5. What can local evidence establish, and what remains UNKNOWN?
6. What smallest local test distinguishes claim from overclaim?

The TA will not ask you to paste secrets or conduct a real security test.

### TA studios

| Studio | You bring | We do |
|---|---|---|
| Trace is trust | short handler | classify correlation, identity, authorization, evidence |
| Sink audit | generated importer patch | find first data-to-authority promotion |
| Crypto purpose | mechanism claim | separate purpose, assumption, nonclaim |
| Release decision | fictional manifest and denial UI | identify provenance, privacy, accessibility, recovery gaps |
| Incident reconstruction | redacted packet | separate fact, hypothesis, UNKNOWN, next authorized check |

### Study Partner routine — 20 to 30 minutes

1. Redraw Module 21 → Module 22 chain from memory.
2. State one example of parse ≠ authorization.
3. Give one safe adapter rule for archive, SQL, process, or evidence.
4. Explain one crypto nonclaim.
5. Read one incident fact and state nearest remaining UNKNOWN.
6. End with accessible recovery message and escalation owner.

### Retrieval schedule

| When | Prompt |
|---|---|
| next day | Why is trace ID not identity? |
| three days | Draw authority tuple and default-deny branch. |
| one week | Compare parameter binding, archive policy, and fake process adapter. |
| two weeks | Explain HMAC, TLS, and release hash without overclaiming. |
| one month | Reconstruct incident and hand it to Module 23. |

---

## 13. Resource route and source discipline

Read sources as contracts and evidence, not substitutes for explanation.

### Python 3.14 public contracts

- [secrets](https://docs.python.org/3.14/library/secrets.html) — strong random
  values and secure comparison purpose.
- [hmac](https://docs.python.org/3.14/library/hmac.html) and
  [hashlib](https://docs.python.org/3.14/library/hashlib.html) — keyed integrity
  and password-verifier concepts, with explicit key/lifecycle assumptions.
- [ssl](https://docs.python.org/3.14/library/ssl.html) — TLS context,
  certificate, and hostname-verification scope.
- [pickle](https://docs.python.org/3.14/library/pickle.html),
  [marshal](https://docs.python.org/3.14/library/marshal.html), and
  [ast](https://docs.python.org/3.14/library/ast.html) — parser/object-loading
  boundaries and resource policy.
- [subprocess](https://docs.python.org/3.14/library/subprocess.html),
  [sqlite3](https://docs.python.org/3.14/library/sqlite3.html), and
  [tarfile](https://docs.python.org/3.14/library/tarfile.html) — process
  authority, value binding, and archive policy boundaries.
- [XML security note](https://docs.python.org/3.14/library/xml.html) and
  [audit events](https://docs.python.org/3.14/library/audit_events.html) —
  resource risk and observation scope.

### Standards and lifecycle sources

- [NIST Cybersecurity Framework 2.0](https://www.nist.gov/publications/nist-cybersecurity-framework-csf-20)
  — govern, identify, protect, detect, respond, recover as connected work.
- [NIST SSDF](https://csrc.nist.gov/pubs/sp/800/218/final) and
  [NIST incident response guidance](https://csrc.nist.gov/pubs/sp/800/61/r3/final)
  — secure development and learning/recovery lifecycle.
- [NIST Privacy Framework](https://www.nist.gov/privacy-framework) and
  [NIST Digital Identity Guidelines, SP 800-63-4 final](https://csrc.nist.gov/pubs/sp/800/63/4/final)
  — privacy risk to people and authentication scope.
- [TLS 1.3, RFC 9846](https://www.rfc-editor.org/rfc/rfc9846.html),
  [BCP 195 TLS/DTLS guidance status](https://www.rfc-editor.org/info/rfc9325/),
  and [OAuth 2.0 security BCP](https://www.rfc-editor.org/rfc/rfc9700.html) —
  advanced integration context, not Atlas implementation requirements.
- [pip secure installs](https://pip.pypa.io/en/stable/topics/secure-installs/)
  and [PyPI Trusted Publishers](https://docs.pypi.org/trusted-publishers/) —
  limited release-boundary examples.
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/) — visible focus, non-colour-only
  information, contrast, and readable interaction requirements.

For pedagogy only, this module takes sequence inspiration from
[MIT 6.033](https://web.mit.edu/6.033/www/) and
[Stanford CS155](https://cs155.stanford.edu/). It does not copy their
assignments, slides, labs, or solutions.

### Licensing note

Explanations, diagrams, fixtures, source snippets, quizzes, and project are
original. Link to and paraphrase public sources above. Python docs and examples
have their published license terms; preserve required attribution when reusing
any small excerpt. Do not redistribute university course material or substantial
standards text.

---

## 14. Handoff — what Module 22 deliberately leaves open

Atlas now knows how to keep an input string from silently becoming authority.
But growing policies and queries still need a language:

~~~text
input text
→ grammar
→ parser
→ typed/canonical representation
→ bounded evaluation environment
→ narrow capability
→ result/error with redacted evidence
~~~

Module 23 derives this language from first principles. It keeps Module 22's
central rule:

> A parsed expression is data until a declared evaluator gives it bounded
> meaning and a narrow, authorized capability.


## Bench pack

**Bench pack:** `m22` — sparse, two benches. CPython 3.12 floor.
**Emits:** one bench record per benched session, naming that session's declared output.

Bench packs are sparse by policy: a session gets a bench only where running code
reveals something reading cannot. Nothing in this pack opens a connection, extracts
an archive, runs a shell, or contacts anything — the reference model reports
`connection_opened=False` and `adapter_called=False`, because the decisions under
test are decisions about *metadata and structure*, made before any effect.

### Bench 2 — identity-to-decision ladder

**Session:** 2. **Rungs:** review and verify, recognize.
**Executes:** one authenticated subject against a policy context with six
dimensions — subject, tenant, resource, action, purpose, policy version. Varying
**any single one** while holding the other five fixed is refused, and
authentication succeeds in all six cases: a genuine user of the wrong tenant, the
right tenant and wrong document, read-instead-of-delete, the same read for a
different *purpose*, and a decision evaluated under a superseded policy version.
The model names the two refusals differently — `DENIED_AUTHENTICATION` against
`DENIED_AUTHORIZATION` — so the ladder is in the vocabulary rather than in the
documentation, and a permitted decision returns an *effect scope* rather than a
boolean, keeping what was permitted attached to the permission.

The result: authorization is a decision about a **tuple**, not about a user, so
caching "this user is allowed" has discarded five of six dimensions.

**Cannot establish:** anything about a real authorization system. Nothing is
authenticated for real, no credential is verified, and the model covers no role
inheritance, delegation, or revocation.

### Bench 3 — sink-specific encoding map

**Session:** 3. **Rungs:** debug and defend, recognize.
**Executes:** one string — carrying a traversal, an SQL quote, and a script tag —
sent to five sinks. The reference planner refuses it at a **character allowlist**
before parameterization is reached; with that allowlist removed, binding alone
still keeps it out of the statement text, so for the value sink the allowlist is
defence in depth rather than the defence. As an **SQL identifier** the relationship
inverts exactly: binding produces a query that sorts by a constant rather than by
the column (no error, no injection, and not the query anyone wanted), interpolation
places the string into executable SQL, and the allowlist becomes the *only* control
that refuses it. The archive policy rejects it as a member path without extracting.
HTML escaping neutralises the angle brackets and leaves the traversal completely
intact — an encoder for the wrong grammar is not a partial defence.

The result worth carrying: **the same mechanism is redundant in one sink and
load-bearing in the next**, so ranking defences as strong or weak in the abstract is
what produces a codebase that parameterizes diligently and interpolates its column
names.

**Cannot establish:** a successful exploit against any real system. It enumerates no
application's actual sinks, and says nothing about second-order injection or
grammars whose parsers disagree with their specifications — where real incidents
usually live.

### Sessions without a bench

- **Session 1** — the trust-boundary atlas is a design argument about where the
  boundaries are.
- **Session 4** — cryptographic purpose selection is an argument about which
  primitive answers which question. Running one would demonstrate that a library
  computes, not that the choice was right.
- **Session 5** — qualifies on the rubric and ranked below this pack's cut.
- **Session 6** — a trust and release dossier consuming the earlier sessions.

### Bench pack completion record

Records under `benches/records/m22-s*.json`. Each names its session output, carries
at least one labelled claim, and states exactly one thing its evidence cannot support.
