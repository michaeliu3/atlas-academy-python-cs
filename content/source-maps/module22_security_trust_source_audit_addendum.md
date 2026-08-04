# Module 22 — Security, Privacy, and Trust Boundaries — Source-Audit Addendum

**Audit date:** 2026-07-30  
**Scope:** source ownership, claim linkage, version/status freshness, reuse
decisions, bounded-model limits, and release-truth checks for the existing
Module 22 workbook, visual studio, source map, and reference downloads.

This is an instructor-facing, **authoring-only** audit record. It is not
learner-facing textbook copy, a human-quality approval, release evidence, or
a publication decision. It is **not a public learner download or release-evidence-policy artifact**;
it is not learner-downloadable. The
canonical M22 source map is itself an authoring boundary, not a public
learner-downloadable ledger. A non-promoting structural packet may include
this addendum as a **hashable internal release input** without public delivery,
approval, or publication. That mechanical inclusion does **not** change M22's
legacy-audit status, human-review status, availability, route position, release
evidence, or publication state.

## Verdict

M22 has a useful security-and-privacy source spine only when each owner is
kept in its proper scope:

- Python 3.14.6 documentation owns narrowly scoped library contracts and
  their stated warnings, not an application threat model or production
  assurance;
- NIST sources own their named framework, risk, incident-response, and
  digital-identity guidance, not an Atlas compliance or legal conclusion;
- RFC and standards records own a named protocol/status vocabulary, not an
  Atlas authentication, authorization, tenant, or purpose decision;
- PyPA, W3C, and OWASP sources own their bounded installer, publishing,
  accessibility, or verification material, not a claim that Atlas is secure,
  conformant, or certified; and
- Atlas fixtures own only their finite, deterministic local behavior.

The central discipline is evidence classification. A field can be
well-formed without being trusted; a transport peer can be authenticated
without being an authorized application subject; an authenticated subject can
be denied a tenant/action/resource/purpose decision; a local audit event can
be useful without constituting containment; and a reference-model result can
be illustrative without describing a deployment.

Use original Atlas explanations, diagrams, traces, diagnostics, exercises,
and code. Link to and paraphrase external materials. Do not copy substantial
documentation prose, standards text, paper figures, university slides, labs,
assignments, recordings, tests, or solutions.

## Audit basis and status correction

The canonical map is
[module22_security_trust_source_map.md](module22_security_trust_source_map.md).
It records the session architecture, source cards, claim matrix, and licensing
route. The Module 22 workbook supplies stable learner-facing external links,
but neither the canonical map nor this addendum is an allowlisted public
source-map download. Identity of a checked-in file or its hash is not approval
of its claims, licenses, accessibility, or learner experience.

This audit rechecked direct primary-source status on 2026-07-30. It corrects
one material drift in the older source map: RFC 8446 is now marked obsolete by
the RFC Editor, with [RFC 9846](https://www.rfc-editor.org/info/rfc9846/) as
the current TLS 1.3 specification. [RFC 9325](https://www.rfc-editor.org/info/rfc9325/)
remains BCP 195 baseline TLS/DTLS deployment guidance, but its record names
RFC 9852 and RFC 10015 as updates. The workbook and canonical map now direct
learners to the successor/status route instead of calling RFC 8446/RFC 9325
unqualified current guidance.

| Audit fact | Evidence checked on 2026-07-30 | Consequence |
| --- | --- | --- |
| Python runtime boundary | Official Python 3.14 documentation identified release 3.14.6. | Keep every standard-library statement version-scoped; do not turn a Python, CPython, OS, or configuration observation into a universal security guarantee. |
| Standards freshness | RFC 8446 is obsolete; RFC 9846 is its TLS 1.3 successor. RFC 9325 has later updates. SP 800-61r3 and SP 800-63-4 are final 2025 publications. | Link the exact edition/status record and recheck at review time; a standards link does not select a deployment configuration or authorize an effect. |
| Assessment boundary | WCAG 2.2 is a 2024 W3C Recommendation and OWASP ASVS 5.0.0 is a 2025 stable release. | Treat them as scoped design/verification references. Automated tests or a checklist do not establish conformance or certification. |
| Bounded local model | The M22 reference model/tests use named synthetic Atlas fixtures and fake adapters. | A fixture result is not a real network, shell, archive, database, identity-provider, package-index, or incident result. |

## Source and reuse ledger

Each link below is a stable external source a learner or reviewer can inspect.
The course decision remains link and paraphrase unless an asset-level review
records narrower approved reuse. Public access is not reuse permission.

| ID | Owner/source and stable link | Claim linkage | Access, status, and reuse decision |
| --- | --- | --- | --- |
| **P22-01** | Python Software Foundation: [secrets](https://docs.python.org/3.14/library/secrets.html) and [hmac](https://docs.python.org/3.14/library/hmac.html) | Sessions 2 and 4: cryptographic randomness, digest comparison, MAC purpose, secret lifecycle. | Python 3.14.6 documentation under PSF License v2; documentation examples/recipes have an additional 0BSD grant. Link/paraphrase and use original examples by default. `DEFAULT_ENTROPY` can change; `compare_digest` avoids relevant content-based short-circuiting but is not a universal protocol/security proof. |
| **P22-02** | Python Software Foundation: [hashlib](https://docs.python.org/3.14/library/hashlib.html) and [ssl](https://docs.python.org/3.14/library/ssl.html) | Session 4: password-verifier concepts, hashes, client context, certificate, and hostname scope. | Same PSF/0BSD boundary. Link/paraphrase. `create_default_context()` is usually safer than direct context construction, not universally secure; TLS peer verification is separate from application authorization. |
| **P22-03** | Python Software Foundation: [pickle](https://docs.python.org/3.14/library/pickle.html), [marshal](https://docs.python.org/3.14/library/marshal.html), [ast](https://docs.python.org/3.14/library/ast.html), and [tarfile](https://docs.python.org/3.14/library/tarfile.html) | Session 3: object-deserialization, literal/resource, and archive boundaries. | Same PSF/0BSD boundary. Link/paraphrase. `ast.literal_eval()` does not execute Python code but is not a complete resource-safety boundary; Python 3.14's `tarfile` data filter does not remove the need for inspection and resource/destination policy. |
| **P22-04** | Python Software Foundation: [subprocess](https://docs.python.org/3.14/library/subprocess.html), [sqlite3](https://docs.python.org/3.14/library/sqlite3.html), and [audit events](https://docs.python.org/3.14/library/audit_events.html) | Sessions 3, 5, and 6: process authority, parameter binding, and observation scope. | Same PSF/0BSD boundary. Link/paraphrase. Explicit shell use transfers quoting/policy responsibility to an application; parameter binding does not authorize a query; interpreter audit hooks are not a sandbox. |
| **S22-01** | NIST: [Cybersecurity Framework 2.0](https://www.nist.gov/publications/nist-cybersecurity-framework-csf-20), [SSDF SP 800-218 v1.1](https://csrc.nist.gov/pubs/sp/800/218/final), and [SP 800-61r3](https://csrc.nist.gov/pubs/sp/800/61/r3/final) | Sessions 5 and 6: governance, secure development, incident learning, recovery, and improvement. | CSF 2.0 is an outcome taxonomy; SSDF is high-level guidance; SP 800-61r3 is final April 2025. Cite the named edition and do not imply certification, compliance, or legal advice. |
| **S22-02** | NIST: [Privacy Framework 1.0](https://www.nist.gov/privacy-framework/privacy-framework) and [Digital Identity Guidelines SP 800-63-4](https://csrc.nist.gov/pubs/sp/800/63/4/final) | Sessions 2, 5, and 6: risk to people, authentication scope, and evidence-minimising incident review. | Link/paraphrase. SP 800-63-4 is final July 2025 and its authentication language belongs to its digital-identity scope; Atlas's subject/tenant/action/resource/purpose decision tuple is an Atlas teaching model, not a universal NIST authorization definition. Do not label Privacy Framework 1.1 final. |
| **R22-01** | IETF: [RFC 9846 TLS 1.3](https://www.rfc-editor.org/rfc/rfc9846.html), [RFC 8446 status](https://www.rfc-editor.org/info/rfc8446/), and [BCP 195 / RFC 9325 status](https://www.rfc-editor.org/info/rfc9325/) | Session 4: transport-security and peer/certificate/hostname discussion. | RFC 9846 is Proposed Standard; RFC 8446 is obsolete. RFC 9325 remains baseline TLS/DTLS deployment guidance with later updates. Link/paraphrase under IETF Trust terms; check status pages before relying on detailed configuration. TLS does not establish an Atlas application user, tenant, purpose, or authorization decision. |
| **R22-02** | IETF: [RFC 9700 / BCP 240](https://www.rfc-editor.org/info/rfc9700/) and [RFC 9106 Argon2](https://www.rfc-editor.org/info/rfc9106/) | Session 4: scoped tokens, replay/redirect context, and password-verifier background. | Link/paraphrase under IETF Trust terms. RFC 9700 is an OAuth security BCP example, not an Atlas OAuth/OIDC implementation requirement. RFC 9106 is IRTF Informational; do not inherit timeless production parameters or a password-service prescription. |
| **E22-01** | PyPA: [pip secure installs](https://pip.pypa.io/en/stable/topics/secure-installs/) and [PyPI Trusted Publishers security model](https://docs.pypi.org/trusted-publishers/security-model/) | Session 5: dependency hashes, publishing identity, release provenance, and remaining unknowns. | Link/paraphrase; no documentation reuse license was established in this audit. Current pip guidance makes hash checking a narrow integrity control rather than a source/publisher/runtime guarantee; `--no-require-hashes` means all-dependency enforcement belongs to the selected hash-checking mode. Trusted Publishers use short-lived OIDC-derived publishing tokens, not a code-safety or provenance attestation. |
| **W22-01** | W3C: [WCAG 2.2](https://www.w3.org/TR/WCAG22/) | Session 5: non-colour signals, focus, keyboard access, readable interaction, and alternatives. | 12 December 2024 Recommendation. Link/paraphrase and use original diagrams. Named criteria and a combination of automated and human evaluation are required for a scoped conformance claim; a single browser run is not conformance evidence. |
| **F22-01** | OWASP: [Application Security Verification Standard 5.0.0](https://owasp.org/www-project-application-security-verification-standard/) | Whole-module coverage framing and dossier review questions. | Link/paraphrase. The ASVS repository is CC BY-SA 4.0; do not copy/adapt requirement tables without attribution/share-alike analysis. Use versioned ASVS IDs only; it is verification framing, not Atlas certification. |
| **U22-01/U22-02** | [MIT 6.033](https://web.mit.edu/6.033/www/) and [Stanford CS155](https://cs155.stanford.edu/) | Course sequence, design communication, sections, and projects as pedagogical inspiration. | Public university course pages; link only. Do not redistribute slides, labs, assignments, starter code, tests, recordings, solutions, or grading material. They are not Python/security contract authority. |
| **A22-model** | Atlas files `public/downloads/module22_reference.py` and `public/downloads/test_module22_reference.py` | Sessions 1–6: boundary labels, identity/authorization separation, no-promotion rules, crypto-purpose cards, release evidence, and redacted incident reconstruction. | Original course artifacts. Treat each output as a finite fixture/model result only; no external network, package install, archive extraction, database, shell, real secret, or live identity service is exercised. |

## Six-session claim linkage

This is a structural authoring aid, not a human review of the workbook, studio,
or diagnostic quality. It keeps each session's stopping line visible when a
later packet maps a local heading to this source record.

| Session | First-principles question | Source linkage | Mandatory stopping line |
| --- | --- | --- | --- |
| **1 — Trust-boundary atlas** | Which asset, actor, boundary, evidence, and harm are actually being named before a control is chosen? | P22-03, P22-04, S22-01, A22-model | A valid-looking trace, source label, or operation field is a claim/input until a stated boundary validates it; formatting is not identity, authority, or outcome. |
| **2 — Identity-to-decision ladder** | What distinct evidence connects a claimant, authenticator, subject, tenant, action, resource, purpose, and freshness? | P22-01, S22-02, A22-model | Authentication does not decide an Atlas authorization tuple, and a past or local decision is not automatically current for another resource, tenant, or action. |
| **3 — Data-to-authority pipeline** | Which syntax, schema, semantic, resource, and authority controls must happen before each sink? | P22-03, P22-04, A22-model | A parser, sanitizer, parameter binder, archive filter, or fake adapter is not a universal security boundary or permission to effect a change. |
| **4 — Cryptographic purpose map** | What specific property, key/trust model, lifecycle, and residual risk does a primitive serve? | P22-01, P22-02, R22-01, R22-02, A22-model | A digest, MAC, random token, TLS channel, or password verifier does not by itself authorize an action, select a policy, or demonstrate a production deployment's security. |
| **5 — Release provenance and human impact** | What source, dependency, builder, identity, review, privacy, accessibility, and downstream-harm evidence belongs in a release decision? | S22-01, S22-02, E22-01, W22-01, F22-01, A22-model | A local hash, OIDC token, test, checklist, or accessibility scan is scoped evidence; none alone proves source quality, no vulnerability, conformance, approval, or safe human impact. |
| **6 — Privacy-aware incident reconstruction** | Which facts, hypotheses, unknowns, data-minimisation choices, and recovery actions can a redacted record support? | P22-04, S22-01, S22-02, A22-model | An audit event is local observation, not containment; redacted fixture evidence does not prove a remote history, real incident, legal conclusion, or complete remediation. |

## Preserved audit ambiguities and non-claims

The legacy audit remains `humanQualityReview: "not-reviewed"`. The six
unresolved statuses below must stay intact. A heading, pointer, existing
studio, shared oral flow, source record, or test can make later review easier;
none substitutes for qualified review of learner-facing work, outcomes, and
accessibility.

| Legacy criterion | Status that remains | Why this addendum cannot promote it |
| --- | --- | --- |
| **rigor bundle**: definitions, assumptions, derivations, proof ideas, counterexamples, and numerical experiments | **ambiguous** | Source ownership does not prove that the workbook has a coherent, accurate, appropriately scoped, reviewed rigor bundle. |
| **code-reading/debugging/design** | **ambiguous** | Relevant labs and a bounded model are pointers, not qualified evidence that code-reading, debugging, and architectural-design work is adequate. |
| **prediction before reveal** | **ambiguous** | A visible prompt or studio control is not evidence that a learner's prediction and confidence are consistently captured before explanation/reveal. |
| **transfer task** | **ambiguous** | A Module 23 handoff or dossier heading does not prove a reviewed transfer task with a valid acceptance/evidence rubric. |
| **confidence diagnostic/misconceptions** | **ambiguous** | A confidence-labelled diagnostic is not a verified misconception-routing workflow, explanation set, or learner repair record. |
| **supportive oral defense** | **ambiguous** | Shared oral infrastructure and session prose do not verify a module-specific, psychologically safe, adaptive oral-defense protocol. |

The prerequisite/forward map, six-session pointers, first-principles pointer,
source-ledger pointer, visual/text-equivalent pointer, retrieval pointer,
project/rubric pointers, TA prompt, Study Partner prompt, and forward handoff
remain structural pointers where the immutable legacy audit already records
them as present. This addendum neither changes those records nor upgrades the
six ambiguous criteria.

## Evidence language and bounded-model controls

| Evidence label | It can establish | It cannot establish by itself |
| --- | --- | --- |
| Python 3.14 documentation | The named version's documented library behavior and warning. | A production configuration, an application threat model, a remote effect, or a complete safety property. |
| NIST/RFC/W3C/OWASP document | A scoped model, framework, standard, status, or verification reference for its exact edition. | Atlas policy, legal compliance, formal conformance, a live configuration, or a human approval. |
| PyPA installer/publisher documentation | A named installer/publishing control and its stated boundary. | Trusted source, dependency safety, a benign build, a reviewed workflow, or runtime safety. |
| Atlas reference/test result | The named finite fixture's local result under its recorded environment. | A live archive, shell, database, identity provider, package index, network peer, incident, or learner mastery. |
| Trace, log, audit event, or redacted incident record | A scoped observation with a stated provenance/retention boundary. | Caller identity, authorization, containment, complete causality, a remote effect, or a legal conclusion. |
| AI proposal | A candidate diagram, patch, trace, test, or explanation to inspect. | Source authority, correctness, permission to reuse, an approved security design, or sufficient evidence for a broader claim. |

The bounded reference model must remain local and inert: no actual endpoint,
DNS lookup, socket/HTTP client, listener, object deserializer, archive
extraction, database connection, subprocess, package install, real secret, or
identity-provider call is represented as an exercised runtime fact. Its
fixtures may demonstrate a classification or policy decision under named
synthetic inputs. They are review objects, not production controls.

## Release-truth checks and unresolved provenance

None of these checks becomes satisfied merely because this addendum exists or
its hash is recorded.

| Check | Current audit observation | Required action before an approval or release claim |
| --- | --- | --- |
| Source freshness | Python versions, RFC status, NIST publication status, PyPA guidance, W3C recommendations, OWASP releases, and rights notices can change. | Recheck direct URLs, editions, status records, access dates, and reuse notices at human review time. |
| Learner-visible claim linkage | The map links claims to source families, but that does not prove every workbook/studio sentence retains the correct source class and stopping line. | Sample and review visible claims, diagrams, prompts, and links session by session. |
| Asset and reuse inventory | This document approves no non-original external asset import. | Record owner, exact URL/version, access date, license/notice, attribution, modification, distribution decision, and reviewer for every shipped non-original asset. |
| Bounded reference model | The model/tests are finite teaching artifacts with deliberately limited scope. | Run declared tests, inspect execution/import/effect boundaries, record environment/result, and preserve the limitation in a reviewed ledger. |
| Human quality and accessibility review | Source correctness and passing automated checks are not teaching-quality, psychological-safety, or assistive-technology approval. | Conduct and record qualified module, source, accessibility, and learner-experience review. |
| Release/deployment truth | A checked-in source record can be hashable and a GitHub CI run can be source-head-attached. | Bind exact reviewed commit, CI, review, limitations, deployment version, and verified private deployment separately; do not infer one fact from another. |

## Forward handoff

M23 must receive the distinction between text, parsed structure, evaluation,
capability, and authority. M22 deliberately does **not** license arbitrary
Python evaluation, establish a sandbox, select a production authorization
service, prescribe a TLS/OAuth/Argon2 deployment, offer legal advice, or
claim security/accessibility certification. A later module must name its
grammar, resource limits, evaluator semantics, capability boundary, source
version, and evidence stopping line explicitly.

## 2026-08-03 structural clarity follow-up

The current canonical audit now maps M22's authorization-predicate rigor card
and input-to-effect reading/debugging/design checkpoint as **pointer-present**.
They use the existing fake-adapter boundary and add no live target, exploit,
source/reuse approval, security certification, human review, release, or
learner-mastery claim.
