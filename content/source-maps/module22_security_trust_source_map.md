# Module 22 — Security, Privacy, and Trust Boundaries: Primary-Source Map

## Document status

- **Purpose:** research, claim, licensing, and teaching map for the Module 22
  learner workbook, visual studio, TA sessions, and Atlas hardening checkpoint.
- **Course position:** follows Module 21, *Asynchronous and Distributed
  Systems*. Module 21 established that a timeout, trace ID, and local task
  result do not settle remote effect or provenance. Module 22 asks: **who may
  cause which effect, using what evidence, across which boundary?**
- **Forward connection:** Module 23, *Languages, Interpreters, and CPython*,
  turns the same boundary into a small safe language: input has grammar,
  meaning, bounded resources, and explicitly granted capabilities. It must not
  treat arbitrary Python evaluation as a query mechanism.
- **Evidence policy:** Python 3.14.6 public documentation is authoritative for
  standard-library behaviour. NIST and IETF/W3C sources anchor standards and
  risk-management claims. PyPA documents installer and publishing behaviour.
  OWASP ASVS is used only as verification framing. University pages are used
  only for pedagogical sequence.
- **Research snapshot:** **2026-07-30**. Links were public on this date. A
  standard or guide is not a substitute for a deployment-specific risk
  assessment, legal advice, or a production security review.
- **Pedagogical bias:** learners read system diagrams, configuration diffs,
  schemas, logs, and generated patches before writing code. Exercises test
  inference boundaries and defensible decisions, not exploit construction.
- **Safety boundary:** Atlas uses deterministic local fixtures, inert strings,
  fake adapters, and configuration review. It contains no exploit payloads,
  real endpoint scanning, credential testing, or bypass instructions.
- **Copyright policy:** explanations, diagrams, fixtures, tests, and
  assessments are original. Link and paraphrase external material; do not copy
  substantial prose, figures, slides, assignments, or solutions.

This is an authoring boundary, not the learner-facing lesson. It records what
the module may responsibly claim, what must be labelled as an Atlas model, and
what later material owns.

---

## Executive teaching decision

Module 21 leaves a useful discomfort: after a local timeout, a client may know
only that its own wait ended. A trace header can correlate observations, but
does not prove who supplied it. A repeated operation ID can help
reconciliation, but does not grant a right to perform an operation.

Module 22 must not respond with a disconnected list of security vocabulary. It
builds one connected chain:

~~~text
asset and harm hypothesis
    → trust-boundary map
    → claimed identity versus authenticated identity
    → authorization for action, resource, tenant, and time
    → least authority and explicit capability hand-off
    → parsing, validation, canonicalization, and resource limits
    → database, filesystem, archive, process, and network boundaries
    → secret lifecycle and standard cryptographic primitive selection
    → dependency, build, release, and provenance evidence
    → privacy, accessibility, fairness, licensing, and professional judgment
    → redacted evidence, incident response, recovery, and learning
    → Module 23 small language rather than arbitrary execution
~~~

### M21 → M22 → M23 connected sequence

| Boundary | Module 21 gives the learner | Module 22 adds | Module 23 makes concrete |
|---|---|---|---|
| Request identity | An operation ID and trace context correlate declared observations. | Neither identifier authenticates a caller or authorizes an action. | A query has a parsed identity and explicit evaluation context; it cannot inherit authority from a string. |
| Unknown outcome | A local timeout can leave a remote outcome UNKNOWN. | Reconciliation/status lookup itself needs authenticated, authorized, privacy-aware access. | An evaluator records a bounded result or failure without inventing external effect. |
| Queue/message boundary | A message can be duplicated, delayed, or observed locally only. | Headers and message fields are untrusted until a relevant boundary validates them. | Grammar and type checks reject malformed meaning before evaluation. |
| Async evidence | Traces and logs are scoped observations. | Evidence must be minimised, redacted, access-controlled, and never mistaken for a sandbox. | The interpreter emits a small, structured, redacted evaluation record. |
| Remote side effect | Retry and idempotency require a named contract. | Each side effect requires subject, action, resource, tenant, purpose, and outcome policy. | The evaluator receives a narrow capability, not ambient filesystem, network, or process authority. |

### Atlas incident — deliberately defensive and local

Atlas receives a delayed importer request after the Module 21 client has
already recorded an UNKNOWN outcome. The request contains a syntactically valid
trace field, operation ID, source label, archive, and resume-state field. A
generated patch:

1. treats the trace field as evidence of the user identity;
2. restores resume state with a general Python object deserializer;
3. extracts the supplied archive into a workspace without a declared policy;
4. builds a database query from a learner-controlled label;
5. asks a shell-backed helper to transform the import; and
6. logs the complete request to make debugging easier.

No malicious input is supplied and no outside system is contacted. Learners
identify authority promotions, not how to defeat them:

- a correlation field became identity without authentication;
- identity, tenant, action, and resource were never checked together;
- data could select an interpreter, filesystem effect, SQL structure, process
  invocation, and log contents;
- a secret or private field could become durable evidence; and
- a dependency/release chain was not part of the trust story.

### Recommended capstone invariant

> Atlas accepts an external value only as data until the receiving boundary
> validates its shape, size, provenance, and permitted meaning. Every
> security-sensitive effect has an authenticated subject, an explicit
> authorization decision scoped to action, resource, tenant, and purpose, and
> a redacted decision record. Untrusted data never selects arbitrary code,
> process execution, filesystem escape, database structure, network authority,
> or a raw secret-bearing log field. Release artifacts have declared dependency
> and build provenance; incident evidence is minimised and labelled with what
> it does and does not prove.

This is an **Atlas teaching contract**, not a claim that a short Python
exercise is a complete security product, compliance program, sandbox,
cryptographic protocol, identity provider, or vulnerability-management system.

---

## Scope ownership and hard boundaries

### Module 22 owns

- threat modelling in terms of assets, actors, trust boundaries, harm,
  assumptions, mitigations, residual risk, and evidence;
- the distinction among claimed identity, authentication, authorization,
  session, tenant, capability, and audit/correlation field;
- least privilege / least authority as an architectural design question;
- trust treatment for request metadata, proxy headers, trace context,
  operation IDs, messages, files, URLs, archives, and package artifacts;
- input processing as syntax, schema, semantic, canonical, resource, and
  context checks rather than a vague “sanitize input” step;
- safe context-specific boundaries for deserialization, archives, database
  values, subprocesses, TLS configuration, XML, and audit evidence;
- secret generation, password-verifier concepts, integrity/authenticity versus
  confidentiality, and the rule to use reviewed standard primitives and
  protocols rather than inventing cryptography;
- dependency/install/build/release provenance and a small hardened-release
  evidence packet;
- privacy risk, data minimisation, retention and access questions,
  accessibility review, fairness/bias questions, intellectual-property
  awareness, responsible reporting, and incident-response preparation.

### Module 22 mentions but does not implement deeply

- TLS, OAuth, OIDC, WebAuthn, signed tokens, password-hashing services,
  key-management systems, and package attestations as system integrations;
- OS permissions, containers, virtual machines, browser policy, database
  roles, and cloud IAM as enforcement-layer examples;
- denial-of-service and abuse controls only as bounded-resource/risk design,
  never as adversarial traffic exercises;
- law, regulation, organisational policy, and compliance mappings only as
  contexts for seeking qualified advice.

### Deferred to later modules or explicitly out of scope

- **Module 23:** formal grammars, parsing strategy, AST design, interpreter
  semantics, type environments, resource metering, and safe query-language
  implementation. Module 22 provides its security requirements.
- **Module 24:** CPython internals, native-extension trust, allocator and
  memory-protection details, performance measurement, and audit-hook internals.
- **Specialist study:** penetration testing, vulnerability research, offensive
  tooling, cryptographic proofs, full identity-provider implementation,
  production incident command, compliance certification, and legal advice.

### Required non-claims

The workbook, visual studio, and TA must explicitly reject all of these:

- A trace ID, request ID, header, or log entry proves who sent a request.
- TLS authenticates every application user or automatically authorizes an
  application action.
- Authentication means the subject may do every action they ask for.
- A user role alone is enough; tenant, resource, action, purpose, and policy
  no longer matter.
- Validation once at a UI makes later parser, archive, database, process, or
  network boundaries safe.
- Encoding, escaping, parameter binding, canonicalization, validation, and
  authorization are interchangeable.
- A hash is encryption, a MAC is a signature, or a digest proves trusted origin
  without a stated key/provenance model.
- A Python audit hook is a sandbox. Python documentation expressly rejects
  that interpretation.
- A Python deserializer, archive filter, literal parser, or subprocess API
  turns untrusted input into safe input by itself.
- A successful local test proves a security property for all deployment
  configurations.
- A package version pin, remote hash, or release badge alone proves a supply
  chain is trustworthy.
- Redacting a screen is the same as minimising collection, restricting
  retention, or controlling access.
- Accessibility, fairness, privacy, licensing, and professional conduct are
  cosmetic additions after architecture is complete.

---

## First-principles model: facts, decisions, and authority

### The six questions before a control

Every Module 22 review begins with:

1. **What valuable thing can be harmed?** Data, availability, integrity,
   money, learning records, identity, safety, trust, or opportunity.
2. **Who or what can influence this boundary?** A person, process, service,
   package, device, network peer, operator, or accident.
3. **What does the receiver actually know?** Separate a supplied claim from
   evidence that the receiver validates.
4. **What authority would a decision hand out?** Read, write, delete,
   transform, execute, publish, observe, or retain.
5. **What must still be true after failure, retry, delay, or review?** Name
   the invariant and residual uncertainty.
6. **What evidence is legitimate to keep?** Preserve reason/action/outcome and
   provenance while avoiding raw secrets and unnecessary personal data.

### Boundary vocabulary

| Term | Learner-facing meaning | It does not automatically imply |
|---|---|---|
| Claim | A supplied statement such as a name, role, trace field, or tenant label. | Truth, authenticity, current validity, or permission. |
| Authentication | Evidence that a claimant controls an authenticator associated with an account or identity context. | Authorization for a resource/action; NIST treats this separately. |
| Authorization | A decision to permit a subject to perform a particular action on a particular resource under policy. | Identity proofing, safe input, or durable completion. |
| Trust boundary | A point where a component must not assume another component’s data, identity, or authority without an explicit contract. | A network boundary only; it can exist between functions, processes, tenants, repositories, or humans. |
| Capability / authority | The concrete ability to cause an effect. | A correct reason for granting it. |
| Correlation | A way to connect observations such as trace/operation IDs. | Authentication, authorization, causality proof, or complete evidence. |
| Audit evidence | A scoped record of an observation or decision. | A sandbox, proof of full history, or permission to retain sensitive data indefinitely. |

### Evidence labels for every diagram and exercise

| Label | Meaning | Example |
|---|---|---|
| [INPUT CLAIM] | Received but not yet trusted. | A request header says “administrator”. |
| [VALIDATED FORMAT] | Shape/schema check passed. | An operation ID has permitted characters and length. |
| [AUTHENTICATED] | Relevant authentication mechanism completed under a named trust model. | A verified session maps to a subject. |
| [AUTHORIZED] | Policy allowed one named action/resource/tenant/purpose. | A subject may upload to this learner workspace. |
| [LOCAL OBSERVATION] | The current process observed an event. | A local archive policy rejected a member. |
| [ATLAS MODEL] | A deterministic teaching fixture result. | Fake release gate reports a missing local hash. |
| [UNKNOWN] | Evidence does not settle the fact. | A remote side effect after a timeout remains unresolved. |

---

## Required visual-studio views

The learner-facing HTML must present these as original, keyboard-accessible,
high-contrast interactive diagrams. Colour is never the only signal; each
state has a text label and a short plain-language explanation.

1. **Trust-boundary atlas:** map importer, proxy, API, queue, worker,
   database, filesystem, package index, build runner, and evidence store.
   Clicking an arrow identifies data, claimed provenance, current authority,
   validation needed, and effect if it is wrong. Prediction: a trace field is
   [INPUT CLAIM], not [AUTHENTICATED] or [AUTHORIZED].

2. **Identity-to-decision ladder:** show claim → authentication evidence →
   subject → tenant → action → resource → policy → decision → redacted
   evidence. Toggle a valid login with an invalid tenant/resource/action; the
   visual refuses to promote authentication to authorization.

3. **Data-to-authority pipeline:** move an archive member, database value,
   command argument, URL, and configuration field through parse, schema,
   semantic rule, canonical form, resource limit, context-specific binding,
   authorization, and effect. It reveals that one generic “sanitize” box
   cannot replace those steps.

4. **Cryptographic purpose map:** contrast random token generation, password
   verification/KDF, integrity check/MAC, authenticated transport, and
   public-key identity. Each card gives purpose, key/trust assumption, what it
   protects, and what it does not protect.

5. **Release-provenance chain:** trace source repository → reviewed change →
   dependency specification → local hashes/artifact identity → build
   environment → publisher identity → release artifact → deployment review.
   Break a link and name what is still unproven.

6. **Privacy-aware incident timeline:** connect detection, triage, containment,
   recovery, communication, and learning to redacted evidence, owner, scope,
   and uncertainty. Reject any evidence packet that stores a raw token or
   unnecessary sensitive payload.

---

## Teaching sequence, sessions, and reading route

The sequence moves from **architecture and authority** to **mechanisms** to
**responsible operation**, so a learner never mistakes a library call for the
security model.

| Session | Connected question | Reading / observation activity | Artifact before moving on |
|---|---|---|---|
| 22.1 | What can Atlas lose or harm, and where does trust change? | Draw the Atlas boundary map and label Module 19–21 assumptions. | Asset, actor, boundary, harm, and assumption map. |
| 22.2 | What does the service know before it allows an effect? | Read an identity/policy decision trace; separate claim, authentication, authorization, tenant, and correlation. | Decision table with explicit deny/unknown states. |
| 22.3 | How does data gain meaning and then authority? | Code-read deserialization, archive, SQL, parser, and subprocess boundaries. | Data-to-authority diagram plus a no-promotion rule for each sink. |
| 22.4 | What security purpose does each primitive/configuration serve? | Compare Python secrets, HMAC, password-KDF, and TLS docs at the purpose/assumption level. | Cryptographic purpose cards; no home-grown crypto implementation. |
| 22.5 | What must be trusted to ship a change? | Inspect a fictional dependency/release manifest and provenance story. | Hardened-release checklist and incomplete-evidence labels. |
| 22.6 | What should Atlas collect, retain, expose, and make usable? | Privacy, accessibility, fairness, licensing, and consequence review of the same feature. | Data inventory, accessibility notes, stakeholder-impact review. |
| 22.7 | How do we prepare to investigate without overclaiming? | Reconstruct the local incident from redacted deterministic evidence. | Incident packet: facts, unknowns, containment hypothesis, recovery check, learning action. |
| 22.8 | What design constraint must the Module 23 language obey? | Review an unsafe evaluate-a-filter patch and replace it with grammar/capability requirements. | Security contract for parser/evaluator lab. |

### TA and study-partner protocol

- Ask the learner to state asset, boundary, authority, and evidence before
  naming a library or control.
- When a learner says “trusted”, ask: “trusted by whom, for what action, for
  how long, and with what evidence?”
- In generated-code review, classify each line as parse, validate, authorize,
  bind, effect, or evidence. Do not let a line silently perform several roles
  without an explanation.
- Use multiple-choice diagnostics for fast feedback, but require a short
  explanation of why the nearest tempting answer overclaims.
- Refuse exploit payloads, bypass instructions, real-target tests, or real
  secret handling. Redirect to the local Atlas model and defensive review.

---

## Primary-source ledger

### Python 3.14.6 public contracts

| ID | Source | Authoring use and required boundary |
|---|---|---|
| P22-01 | [secrets](https://docs.python.org/3.14/library/secrets.html) | Use for cryptographically strong random values and constant-time comparison purpose. Do not hard-code a claimed default token entropy; the docs say it may change. Passwords must not be stored recoverably. |
| P22-02 | [hmac](https://docs.python.org/3.14/library/hmac.html) | HMAC is keyed message authentication. Use the documented comparison helper for externally supplied digests; a MAC has a key/trust model and is not encryption or authorization. |
| P22-03 | [hashlib](https://docs.python.org/3.14/library/hashlib.html) | Use the documented collision warnings and password-KDF concepts, including PBKDF2 and scrypt. Do not turn historical numeric examples into a timeless course recommendation. |
| P22-04 | [ssl](https://docs.python.org/3.14/library/ssl.html) | Default client contexts have safer settings and certificate validation/hostname-checking defaults; direct context construction needs deliberate review. TLS transport/peer verification is not application-user authorization. |
| P22-05 | [pickle](https://docs.python.org/3.14/library/pickle.html) | The docs explicitly say only unpickle trusted data. Never present object deserialization as a generic way to read an external state file. |
| P22-06 | [marshal](https://docs.python.org/3.14/library/marshal.html) | The docs say it is not intended to be secure against erroneous or malicious construction and must not read unauthenticated/untrusted input. |
| P22-07 | [ast](https://docs.python.org/3.14/library/ast.html) | The literal-evaluation API does not execute Python code but docs warn of memory, C-stack, and CPU exhaustion. It is not a complete untrusted-input boundary. |
| P22-08 | [subprocess](https://docs.python.org/3.14/library/subprocess.html) | Python does not implicitly choose a shell, but an application that explicitly requests shell use owns safe quoting and policy. Atlas uses a fake command adapter, not a shell exercise. |
| P22-09 | [sqlite3](https://docs.python.org/3.14/library/sqlite3.html) | Bind values using placeholders rather than composing SQL strings. That protects value binding; it does not decide whether a subject may read/write a table. |
| P22-10 | [tarfile](https://docs.python.org/3.14/library/tarfile.html) | Python 3.14 defaults extraction to the data filter, but docs still require prior inspection for untrusted archives and say filters do not block all dangerous features. |
| P22-11 | [XML security note](https://docs.python.org/3.14/library/xml.html) | Use only to show parser/version and resource-risk questions; not to teach attack construction. Parser/version choice is one bounded dependency decision. |
| P22-12 | [sys.addaudithook](https://docs.python.org/3.14/library/sys.html#sys.addaudithook) and [audit events](https://docs.python.org/3.14/library/audit_events.html) | Audit hooks can collect or react to events, but Python states interpreter-level hooks are not a sandbox and may be bypassed by malicious code. Evidence is not containment. |

### Standards and authoritative ecosystem sources

| ID | Source | Authoring use and required boundary |
|---|---|---|
| S22-01 | [NIST CSF 2.0](https://www.nist.gov/publications/nist-cybersecurity-framework-csf-20) | Organise risk decisions around govern, identify, protect, detect, respond, and recover. The framework describes outcomes, not a universal implementation recipe. |
| S22-02 | [NIST SP 800-218 SSDF](https://csrc.nist.gov/pubs/sp/800/218/final) | Anchor secure-development, review, supplier, and recurrence-learning discussions. It is a high-level framework, not an Atlas compliance claim. |
| S22-03 | [NIST SP 800-61r3](https://csrc.nist.gov/pubs/sp/800/61/r3/final) | Anchor preparation, detection, response, recovery, and improvement as connected risk-management work. The course uses a fictional local incident only. |
| S22-04 | [NIST Privacy Framework](https://www.nist.gov/privacy-framework) | Treat privacy as managed risk to people, not only secrecy of a database field. Do not give jurisdiction-specific legal conclusions. |
| S22-05 | [NIST SP 800-63-4](https://pages.nist.gov/800-63-4/sp800-63.html) | Define authentication as a claimant demonstrating control of authenticators; distinguish it from authorization. Scope to digital identity guidance, not a generic application-login recipe. |
| R22-01 | [RFC 8446, TLS 1.3](https://www.rfc-editor.org/rfc/rfc8446.html) and [BCP 195 / RFC 9325](https://www.rfc-editor.org/rfc/rfc9325.html) | Link learners to transport-security protocol and current-use guidance. Do not teach a custom TLS protocol or reduce certificate verification to a checkbox. |
| R22-02 | [RFC 9700, OAuth 2.0 Security BCP](https://www.rfc-editor.org/rfc/rfc9700.html) | Use as an advanced example of scoped tokens, replay concerns, client authentication, and redirect/metadata assumptions. It is not a requirement to implement OAuth in Atlas. |
| R22-03 | [RFC 9106, Argon2](https://www.rfc-editor.org/rfc/rfc9106.html) | Optional deeper reading for password-verifier purpose and memory-hard design. It is informational and does not replace a current deployment-specific password-service decision. |
| S22-06 | [pip secure installs](https://pip.pypa.io/en/stable/topics/secure-installs/) | pip says default installs do not protect against remote tampering and may run arbitrary code from distributions; use local hash-checking as one release control, not proof of trustworthiness. |
| S22-07 | [PyPI Trusted Publishers](https://docs.pypi.org/trusted-publishers/) | Show short-lived OIDC-derived publishing identity as a release-boundary example; it does not vouch for every source change or dependency. |
| W22-01 | [WCAG 2.2](https://www.w3.org/TR/WCAG22/) | Require semantics, non-colour-only signalling, visible keyboard focus, resize-friendly text, and contrast as course-HTML acceptance criteria. WCAG conformance remains separately scoped. |
| F22-01 | [OWASP ASVS 5.0](https://owasp.org/www-project-application-security-verification-standard/) | Use as a coverage/checklist framing source only. Pair every behavioural claim with Python docs, NIST, IETF, W3C, or PyPA sources above. |

### University material: pedagogy only

| Source | What may be borrowed as a teaching pattern | What may not be inferred or copied |
|---|---|---|
| [MIT 6.033 Spring 2022](https://web.mit.edu/6.033/www/) | Its connected systems sequence and use of lecture, recitation, hands-on work, design communication, and feedback; it places security after OS, networking, and distributed systems. | Do not copy its hands-ons, design project, slides, assessment, answers, or treat a course page as a Python/security standard. |
| [Stanford CS155 Spring 2026](https://cs155.stanford.edu/) | Its stated focus on principles for building secure systems and use of sections/projects as pacing inspiration. | Do not copy labs, assignments, starter code, solutions, recordings, or offensive exercise content. |

---

## Claim-to-source matrix for authoring and TA use

| Learner-visible claim | Owning source | Mandatory qualifier |
|---|---|---|
| A syntactically valid trace/request ID is correlation data, not identity or permission. | M21 evidence boundary plus Atlas teaching model | Authentication and authorization need their own named evidence/policy. |
| Authentication establishes control of an authenticator associated with an identity context. | S22-05 | It does not decide access to a resource/action. |
| Authorization is a contextual policy decision. | S22-05 plus Atlas teaching model | Name subject, tenant, action, resource, purpose, policy version, and decision; no generic authorized badge. |
| The Python secrets module is appropriate for cryptographically strong random values. | P22-01 | Use reviewed APIs and a stated lifecycle; randomness does not authorize an action. |
| A secure comparison helper reduces content-dependent short-circuit timing behaviour for relevant digest comparisons. | P22-01 and P22-02 | It does not repair an incorrect protocol, wrong key, missing rate limit, or exposure elsewhere. |
| Password storage requires a salted, slow, irreversible verifier/KDF design, not reversible storage. | P22-01 and P22-03 | Parameters and service choice need current deployment-specific review. |
| TLS client configuration needs deliberate peer/certificate/hostname verification. | P22-04 and R22-01 | It protects a stated transport/peer relationship, not application roles, request semantics, or tenant policy. |
| Do not deserialize Python object data received from an untrusted/tampered source. | P22-05 and P22-06 | Signing/integrity checks require a correct key-distribution and trust model; safest course design avoids the format for external state. |
| The literal-evaluation API is not a complete safety boundary for untrusted input because resource exhaustion remains possible. | P22-07 | Module 23 owns purpose-built grammar, resource limits, and capability model. |
| Avoid composing SQL values into text; bind values as parameters/placeholders. | P22-09 | Parameter binding does not grant database rights or validate business rules. |
| Archive extraction needs inspection, destination, link/path, member-count, and size policy even in Python 3.14. | P22-10 | The data filter mitigates important cases but does not make arbitrary archives universally safe. |
| A subprocess call is an authority boundary; explicit shell invocation transfers quoting/security responsibility to the application. | P22-08 | Atlas uses a fake adapter and policy review rather than a shell exercise. |
| Audit hooks improve observation opportunities but are not containment/sandboxing. | P22-12 | Audit events may be incomplete for the desired threat model and evidence must be redacted. |
| Local dependency hashes help detect remote tampering in the installer model. | S22-06 | A hash alone does not establish source review, publisher identity, absence of vulnerabilities, or safe runtime behaviour. |
| Short-lived publishing identity can reduce exposure from long-lived release credentials. | S22-07 | It does not prove trusted workflow/source/repository inputs are benign. |
| Security, privacy, response, and recovery are lifecycle risk-management work. | S22-01 through S22-04 | These frameworks guide decisions; no course artifact asserts certification or legal compliance. |
| Course HTML must make information available without colour alone and retain keyboard-visible focus and legible contrast. | W22-01 | This is a design target; formal conformance requires separately scoped evaluation. |

---

## Defensive Atlas scenario and test matrix

All tests are deterministic, local, and non-destructive. They use code reading,
pure functions, mocks/fakes, static fixtures, manifest inspection, and
redacted synthetic records. No test contacts a live service, imports an
untrusted object, invokes a real shell command, extracts an archive, installs
a package, or handles a real secret.

| Scenario | Learner must reason about | Safe fixture and expected evidence |
|---|---|---|
| Correlation field looks well formed | Format validation is not authentication. | A fake request with a valid-shaped trace/operation field remains [INPUT CLAIM]; decision trace records identity evidence absent without retaining raw field. |
| Authentication succeeds but target tenant differs | Authentication and authorization are separate. | Stub identity maps to subject A; policy denies tenant B. Evidence has a policy reason code and redacted subject/tenant references. |
| Same tenant, wrong action/resource | Authorization is action/resource-specific. | Policy table permits read but denies publish. Learner identifies the false inference “logged in implies publish”. |
| Retried Module 21 operation | Stable operation ID is not a bearer credential. | Same ID with a different authenticated subject is denied or requires explicit policy; outcome stays separate from M21 remote UNKNOWN. |
| External resume state | Data must not select a Python deserializer. | Manifest parser rejects the object-state format before a loader is called; report names an untrusted-deserialization boundary. |
| Archive supplied by importer | Filtering, inspection, and resource policy differ. | Metadata-only fake member list includes an unexpected path/link/size/count. Policy rejects before a filesystem adapter receives a call. |
| Learner-controlled database value | Data belongs in value binding, not SQL structure. | Query-builder fake accepts a fixed statement shape plus separately recorded parameters; static review rejects string assembly. No database is run. |
| Transformation request | Process authority needs explicit adapter/policy. | Fake command adapter receives an approved operation enum and typed arguments, or reports policy denial; no shell/process launches. |
| Secret-bearing diagnostic field | Evidence must be useful without raw-secret retention. | Redaction unit test replaces token/password-like fixture values with a marker and keeps only reason/action/outcome metadata. |
| TLS configuration patch | Peer verification defaults/configuration need review. | A configuration object is inspected for an approved client-context policy and named hostname/CA decision; no connection occurs. |
| Audit-hook proposal | Observation is not sandboxing. | Code-reading question labels hook as [LOCAL OBSERVATION], then lists the missing containment layer. |
| Dependency lock/release manifest | Local integrity control and provenance are separate. | A release gate fails on missing local hash, unreviewed source distribution, or unspecified publisher identity; it labels remaining unknowns. |
| Privacy/accessibility review | Security is not only technical secrecy. | Data inventory flags unnecessary collection; HTML audit fixture requires text labels, keyboard focus, and contrast evidence. |
| Incident reconstruction | Do not overclaim from a trace/log. | Redacted timeline contains local timeout, policy deny, and missing remote confirmation; final report preserves UNKNOWN and proposes an authorized status check. |

### Completion criteria for the Atlas checkpoint

1. A threat model names assets, actors, trust boundaries, assumptions,
   mitigations, residual risks, and unanswered questions.
2. A decision function receives subject, tenant, action, resource, purpose,
   and policy inputs; it cannot accept a trace ID as identity.
3. The model has an allow-list syntax/schema/semantic/resource pipeline before
   each authority sink.
4. The model has no external object deserialization, archive extraction, real
   subprocess, live network call, or raw-secret logging.
5. Release evidence names dependencies, local integrity checks,
   publisher/build-provenance assumptions, review status, and known limits.
6. Incident evidence is redacted, scope-labelled, and preserves UNKNOWN.
7. The Module 23 handoff specifies grammar, bounded evaluation, and narrow
   capability requirements rather than arbitrary Python evaluation.

---

## Assessment doctrine and diagnostic examples

### What to assess

- **Architecture reading:** find the boundary where a trace field was promoted
  to identity, a role bypassed a tenant check, or a log became a secret store.
- **Evidence calibration:** distinguish validated format, authenticated
  subject, authorized decision, local observation, and UNKNOWN.
- **Patch review:** locate missing parameter binding, unsafe serialization,
  ambient subprocess authority, unsafe archive assumption, missing release
  evidence, or excessive evidence field.
- **Design explanation:** defend one small control by naming threat, asset,
  boundary, enforcement point, residual risk, and test evidence.
- **Professional reasoning:** identify the stakeholder harmed by excessive
  data, inaccessible interface, biased decision rule, or unlicensed reuse.

### Multiple-choice style

Every diagnostic has one best answer plus a short explanation of the nearest
overclaim. Example stems:

1. A request carries a trace ID matching a previous request. What is the most
   justified conclusion?
   - Correct reasoning: it is correlation input until the receiver applies a
     stated trust model; it does not prove caller identity or rights.

2. A verified session belongs to a user who can read their own workspace. They
   ask to publish another tenant’s release. What new decision is required?
   - Correct reasoning: a scoped authorization decision for target tenant,
     resource, and publish action.

3. A Python archive API has a safer default filter. Which statement remains
   true?
   - Correct reasoning: an application still needs untrusted-archive
     inspection and resource/destination policy.

4. A local package hash matches a requirements file. What is still unknown?
   - Correct reasoning: whether the chosen dependency/source/release process
     is appropriate and whether broader provenance/runtime behaviour is
     acceptable.

5. A local timeout fires after a request was sent. What must an incident record
   preserve?
   - Correct reasoning: remote effect can remain UNKNOWN; a later status query
     needs its own authentication/authorization and evidence label.

High-confidence wrong answers trigger a two-minute boundary redraw, not a
syntax drill. Low-confidence correct answers trigger a contrast explanation
between the correct claim and the nearest overclaim.

---

## Licensing and access ledger

| Source family | Status/access | Course treatment |
|---|---|---|
| Python 3.14 documentation | Public; [PSF License v2 and documentation terms](https://docs.python.org/3.14/license.html). Documentation examples/recipes have an additional 0BSD grant. | Link and paraphrase. Reuse only small attributed examples when truly needed; retain required notices. |
| NIST publications and frameworks | Public government publications/resources; individual pages state publication/status. | Link and paraphrase. Do not present an educational mapping as certification, policy, or legal advice. |
| IETF/IRTF RFCs | Public RFC Series under IETF Trust legal provisions stated in each RFC. | Link and paraphrase. Do not reproduce substantial prose, diagrams, or protocol text; retain required notices for any code component. |
| W3C WCAG | Public W3C technical report with document-license terms on the W3C site. | Link and paraphrase; create original accessible examples/diagrams. Cite exact recommendation/version for normative wording. |
| PyPA / pip / PyPI documentation | Public project documentation; inspect repository/site licensing before copying content. | Link and paraphrase. Use only fictional package/release fixtures. |
| OWASP ASVS | Public OWASP project material. | Use as coverage framing only; inspect current terms before reusing text. Do not copy requirement tables into course material. |
| MIT / Stanford course pages | Public university teaching pages; course materials remain institution/instructor material. | Link for optional sequence inspiration only. Do not redistribute slides, assignments, starter code, solutions, recordings, or lab content. |

The learner-facing workbook should put a source link beside each behavioural
claim. A link enables inspection of a contract; it never broadens a
scope-limited claim into a production guarantee.
