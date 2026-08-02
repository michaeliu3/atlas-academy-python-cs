# Module 26 — Systems Capstone, Open-Source Stewardship & Oral Architecture Defense: Primary-Source Map

## Document status

- **Purpose:** primary-source, claim, architecture, release, human-impact, and
  teaching map for the Module 26 learner workbook, visual capstone studio,
  deterministic reference model, TA sessions, study-partner prompts, final
  dossier, and oral architecture defense.
- **Course position:** **Prospective only:** once the M31–M36 evidence chain
  and Module 25's own gate are satisfied, Module 26 concludes planned days
  56–60 of the 60-day Atlas Core. It follows Module 25,
  *Evidence-Grounded Intelligent and Human-Centered Systems*, after the
  M27–M36 mathematics, theory, systems-for-learning, AI, ML, and
  learning-theory bridge. Module 25 established that a score, generated
  proposal, or accessible-looking interface does not own authority and does not
  prove benefit. Module 26 asks: **what evidence makes a versioned release
  argument reviewable, recoverable, and honest?**
- **Research snapshot:** **2026-07-30**. Links refer to official, primary, or
  author-maintained sources available on that date. Vendor docs, standards
  status, platform capabilities, and licenses can change; a capstone records
  exact versions, configuration, and date actually used.
- **Evidence hierarchy:** (1) standards and official product documentation for
  their own contracts; (2) original university/SEI sources for architecture and
  pedagogy; (3) the capstone's own repository, tests, CI, and release records;
  and (4) clearly-labelled Atlas course models. A green badge, model response,
  diagram, PR comment, or source map has no authority outside its named scope.
- **Pedagogical bias:** read before writing. The learner recovers architecture
  from a bounded codebase, predicts failure, challenges a release claim, reads
  an agent-generated diff as untrusted input, and defends a decision with
  evidence. In the AI era the durable skill is knowing what a system does, why
  it is allowed to do it, how to test that claim, and how to stop or reverse it.
- **Default project boundary:** the capstone uses the existing private course
  repository, original materials, deterministic synthetic local fixtures, and
  the bounded M25 decision-support scenario. It must not ingest real learner
  histories, secrets, credentials, external model outputs, production
  telemetry, public contributions, or live personal data by default. An optional
  AI/agent may propose a small, redacted, fixed-context change but cannot select
  data, grant permissions, call arbitrary tools, write learner state, merge,
  deploy, publish, or override human review.
- **Copyright/access boundary:** Atlas explanations, diagrams, fixtures, tests,
  prompts, questions, and capstone artifacts are original. External material is
  linked and narrowly paraphrased. Do not copy lecture slides, assignments,
  solutions, figures, standard text, product docs, templates, incident reports,
  or generated model output wholesale. Check the named source's license and
  access conditions before reuse.

This is an instructor-facing research and evidence boundary, not the
learner-facing workbook. It tells instructors, TAs, study partners, and coding
agents what Module 26 may claim, what must support it, and which limits must
remain visible.

---

## Executive teaching decision

A final project is often taught as a polishing sprint: make a demo look smooth,
pass a few tests, write a README, and present success. That sequence rewards
surface fluency, hides tradeoffs, and makes AI-generated code especially
dangerous because a plausible patch can look finished before its contract,
data, authority, and recovery path are understood.

Module 26 turns one deliberately narrow vertical slice into a versioned evidence
bundle. The learner must trace a claim from purpose through code and operations
to a limitation, rather than merely point at a functioning screen.

~~~text
bounded human need + non-goal + accountable release owner
    → recovered architecture and named contracts
    → alternatives / ADRs / quality-attribute scenarios
    → independently reviewed minimal change and test strategy
    → reproducible build + exact source/artifact/dependency evidence
    → staged private release + verification + rollback/incident path
    → accessibility, privacy, and human-impact observation
    → dossier + oral defense + explicit unknowns
~~~

### M24 evidence thread → M31–M36 synthesis gate → M25 → M26

This table compares connected **evidence roles**, not next/previous navigation.
M24 supplies a systems-evidence thread; the M31–M36 chain supplies the
advanced mathematics, systems-for-learning, AI/ML, and learning-theory bridge;
M25 remains preview-gated until that prerequisite and its own review evidence
exist. M26 follows only after M25's gate.

| Boundary | Module 24 gives the learner | Module 25 adds after M31–M36 | Module 26 must defend |
|---|---|---|---|
| Claim | A performance conclusion needs a named workload, layer, mechanism, and uncertainty. | A decision-support conclusion needs a purpose, data/candidate/model/policy contract, evaluation scope, and human-control boundary. | A release claim needs an owner, source version, representation/contract, appropriate evidence, cost/failure boundary, and explicit limitation. |
| Architecture | Runtime, interpreter, native boundary, allocation, and operating-system layers stay distinct. | Data, candidate generation, ranker/model, interface, authorization, and mutation stay distinct. | Purpose, context, code/runtime, data/trust, deployment/recovery, and change/release views are connected without pretending one diagram proves all. |
| Evidence | A timer/profile/trace/OS metric measures a narrow phenomenon. | Offline metric, accessibility check, human-use observation, risk review, and agent trace measure different phenomena. | Test result, review, artifact digest, deployment verification, rollback drill, and oral explanation each support only their bounded claim. |
| Human effect | Faster code is not automatically better for a person or system. | A better score is not automatically useful, understandable, fair, private, accessible, or safe. | A polished release is not automatically maintainable, secure, inclusive, recoverable, or worthy of adoption. |
| AI assistance | An agent's performance explanation is a hypothesis until verified. | A model/LLM proposal is not truth, provenance, permission, or action authority. | Agent-generated code, review feedback, tests, and release prose remain untrusted proposals until a named human independently reviews the diff and evidence. |

### Required Atlas capstone invariant

> **A capstone release is a versioned evidence bundle, not a polished demo.
> Each consequential claim has a named owner, representation or contract,
> appropriate test or observation, cost and failure boundary, security/privacy
> implication, human-impact evaluation, and explicit limitation. Agent-generated
> work remains an untrusted proposal until independently reviewed and verified.**

This is an **Atlas teaching contract**, not a statement that a small project is
production-ready, secure, accessible to every person and assistive-technology
combination, legally compliant, privacy-preserving, free of defects or known
vulnerabilities, SLSA-conformant, WCAG-conformant, or suitable for a
consequential setting.

---

## Scope ownership and hard boundaries

### Module 26 owns

- selecting one coherent, intentionally small vertical slice and writing a
  charter before adding features: user need, stakeholder, non-goal, owner,
  success evidence, harm/failure condition, and stop/rollback trigger;
- recovering an **as-built** architecture from repository, tests, generated
  artifacts, CI configuration, and release records rather than narrating an
  aspirational system;
- creating five linked architecture maps: purpose/context; code/runtime
  responsibilities; data/trust/authority; deployment/operations; and
  change/release/ownership;
- expressing key rules as contracts, invariants, examples, counterexamples,
  tests, and observable failure modes;
- recording consequential alternatives, decisions, consequences, review owner,
  and supersession state through concise ADRs or an equivalent original ledger;
- reviewing a bounded change as a maintainer: intent, diff, tests, dependency
  effect, security/privacy/accessibility implication, alternatives, and missing
  evidence;
- treating AI/agent patches, review feedback, generated tests, explanations,
  and release prose as proposals with provenance questions—not authoritative
  results;
- designing a test strategy that separates deterministic behavior,
  integration/contract behavior, failure/recovery behavior, static checks,
  human-use/accessibility observations, and performance/evaluation evidence;
- producing reproducibility/supply-chain evidence appropriate to the project:
  exact commit, declared environment, dependency record, build/test commands and
  results, artifact identity, and caveats;
- describing a private release path with approvals, target, verification,
  monitoring signal, rollback owner/known-good version, incident note, and
  bounded postmortem; and
- producing an oral architecture defense that answers what the system does and
  does not do, why tradeoffs were chosen, what evidence supports them, who has
  authority, what fails first, and how recovery works.

### Module 26 mentions but does not teach deeply

- full formal methods, model checking, distributed tracing, chaos engineering,
  formal threat modeling, production observability, incident command, legal
  compliance, accessibility certification, licensing law, enterprise supply
  chain assessment, penetration testing, or SRE staffing;
- large-scale canary infrastructure, multi-region deployment, signed package
  distribution, hardware roots of trust, build-platform hardening, formal SLSA
  level certification, SBOM lifecycle operations, or vulnerability disclosure
  programs; and
- AI governance, red teaming, model evaluation, data governance, retrieval, or
  external LLM deployment beyond Module 25's bounded proposal-only treatment.

### Deferred or explicitly out of scope

- **No public-release requirement:** a private source repository and owner-only
  learning portal are valid capstone targets. Public visibility, open-source
  licensing, external contributions, production users, a package registry, or a
  cloud deployment require a separately scoped decision and review.
- **No unbounded agent requirement:** the learner may demonstrate an AI-assisted
  review protocol without invoking a live model, sending repository content to a
  provider, or giving an agent write/deploy privileges.
- **No false operational theater:** a simulated failure/recovery drill is useful
  local evidence. It is not proof of an incident-response program, penetration
  test, or production rollback capability.
- **No degree-equivalence claim:** the course supplies a rigorous integrated
  foundation and a design/reading path. It cannot replace a multi-year degree,
  supervised research, or every specialist CS field.

### Required non-claims

Every workbook, TA response, review, release note, diagram, and agent-generated
patch must reject these category errors:

- “The architecture diagram is the architecture.” A map is a scoped
  representation and must be checked against code, configuration, execution,
  and its stated audience/concern.
- “The README says it works.” Documentation is a claim until a specific build,
  test, or observation supports it.
- “The test suite is green, so the system is correct/secure/private/accessible.”
  Tests support only the behaviors, environment, and failure modes they cover.
- “The workflow ran, so the artifact came from this source.” Source, build
  inputs, artifact identity, signer/attestation where used, and verification
  path are separate evidence.
- “A hash, SBOM, or attestation proves the software is safe.” These can support
  bounded identity, origin, or composition claims; they do not prove correctness,
  absence of vulnerabilities, suitability, or trustworthy intent.
- “A required review means the right person understood the change.” Platform
  enforcement can route/gate review, but review quality needs a named question,
  evidence, and accountable reviewer.
- “An AI review found no problem, therefore there is no problem.” Official
  guidance requires careful validation and human review; a model may miss or
  invent issues.
- “The user could click the feature, so it is accessible.” Keyboard behavior,
  semantics, focus, names/states, browser/assistive-technology scope, and user
  observation have distinct evidence.
- “The privacy policy/data inventory makes it private.” Data purpose,
  minimization, retention, access, disclosure, and threat boundaries need their
  own evidence; a framework is not legal compliance.
- “Rollback exists because the command is documented.” A known-good version,
  authority, trigger, data/state implications, verification, and a scoped drill
  must be named.
- “A postmortem proves the root cause and prevents recurrence.” It records an
  inquiry and follow-up commitments; causal certainty needs stronger evidence.
- “We used C4, ADR, WCAG, SLSA, NIST, or ATAM, therefore we conform.” Naming a
  framework or borrowing a template is not certification or endorsement.

---

## First-principles evidence taxonomy

### The eight fields of a defensible capstone claim

| Field | Atlas meaning | Minimum evidence question | It does **not** establish by itself |
|---|---|---|---|
| **Claim** | A narrow statement the team is willing to defend. | What exact sentence could be false? | A mission slogan or feature list. |
| **Owner** | Person/role allowed to accept risk, approve, or reverse the claim. | Who can say yes/no and who can recover? | That the owner understands every implementation detail. |
| **Representation / contract** | Map, interface, invariant, schema, ADR, policy, or release record that makes a claim inspectable. | Where is the boundary stated? | Behavior itself. |
| **Test / observation** | Repeatable test, review, trace, measurement, accessibility check, deployment verification, or human-use observation. | What was observed, by whom, on which version/environment? | Every neighboring property not tested. |
| **Cost / failure boundary** | Resources, tradeoff, likely failure, fallback, and recovery constraint. | What gets worse, fails first, or costs more? | That failure is impossible. |
| **Security / privacy implication** | Asset, trust boundary, data purpose, access/authority, dependency, or disclosure concern. | What must not cross the boundary and who may cross it? | Security/legal/privacy compliance. |
| **Human-impact evaluation** | Scoped observation of comprehension, control, accessibility, burden, or foreseeable harm. | Who/task/version was considered and what remains unknown? | Universal usability, fairness, benefit, or endorsement. |
| **Limitation / release state** | Scope, uncertainty, known issue, residual risk, or rollback condition. | What would falsify or revoke the claim? | Permission to hide an unfavorable result. |

### Claim labels for every visual, notebook, PR, and defense

| Label | Meaning | Example | It does **not** mean |
|---|---|---|---|
| **[SYSTEM MAP]** | Scoped representation of responsibilities/relationships. | This container map is checked against named folders and runtime entry points. | It captures every dependency or dynamic path. |
| **[CONTRACT]** | Behavior, authority, or data boundary stated beside code. | Only explicit approval can write plan state. | Implementation always enforces it. |
| **[ADR / TRADEOFF]** | Decision, context, alternatives, consequences, owner, and status. | Local deterministic policy avoids out-of-scope external inference. | The decision is eternal or globally optimal. |
| **[DETERMINISTIC TEST]** | Result of named local fixture/command. | This input is rejected by this version's validation function. | All realistic/adversarial inputs are covered. |
| **[CI OBSERVATION]** | Workflow result for commit, matrix, commands, and environment. | Python 3.12 and 3.14 passed this target on this commit. | Artifact is deployable everywhere or free of defects. |
| **[PROVENANCE / COMPOSITION]** | Evidence relating source, build input, artifact, dependency set, or signer. | Release dossier names SHA, lockfile, build command, and digest. | Code is safe, correct, or independently reviewed. |
| **[ACCESSIBILITY OBSERVATION]** | Scoped keyboard, semantic, AT, or manual check. | Tested tab sequence/names worked in declared build/browser. | Full WCAG conformance or universal usability. |
| **[HUMAN-IMPACT OBSERVATION]** | Observation of a user/task/decision boundary. | A learner could find and reject the proposal in a script. | Population-wide benefit, fairness, or causal impact. |
| **[OPERATIONS DRILL]** | Named release, failure, rollback, or recovery exercise. | Owner restored known-good local version and verified it. | A production incident program or zero downtime. |
| **[SECURITY / PRIVACY RISK]** | Named asset, concern, control, residual risk, and review owner. | Synthetic data avoids personal learning records; advisories remain visible. | A security-clean or compliant system. |
| **[COURSE MODEL]** | Intentional original simplification for learning. | Five-map dossier represents a compact system. | A complete enterprise architecture method. |
| **[UNKNOWN]** | Fact deliberately left unproven. | Future diverse user benefit is unknown. | A favorable assumption. |

### Claim-to-evidence matrix

| Review question | First appropriate evidence | Supports a bounded statement | Does **not** settle |
|---|---|---|---|
| What is in the system and where does a flow cross boundaries? | Source-guided map, entry-point trace, test/config inspection, named uncertainty. | Reviewed version has described responsibilities/paths. | All runtime behavior, scale, security, or future changes. |
| Why choose this design rather than another? | ADR with context, alternatives, consequences, owner, status. | Decision was made for stated reasons under constraints. | It is globally best or remains valid forever. |
| Does implementation enforce a narrow contract? | Deterministic examples/counterexamples, contract test, readable source path. | Version behaves as declared for named cases. | All inputs, integrations, or human outcomes. |
| Does a PR meet its stated intent? | Intent statement, focused diff, human review, appropriate tests, unresolved-question log. | Reviewer assessed this change against criteria. | No latent defect or complete security. |
| Did build/test targets run? | CI run ID, exact commit, matrix, command/log/artifact summary. | Those targets produced recorded status. | All platforms/tests or release correctness. |
| Can artifact be related to source/build inputs? | Version/tag, source SHA, dependency/build record, digest/attestation, verification. | Artifact has stated identity/origin evidence. | Correctness, no malicious source, or suitability. |
| Can a person understand/decline/recover? | Task script, keyboard/semantic inspection, limitation, human-use observation, issue list. | Result for tested task/build/person scope. | Broad accessibility, benefit, or no harm. |
| What happens if evidence changes or failure appears? | Rollback card, known-good version, owner, trigger, recovery test, incident note. | Reviewed drill followed this path. | Continuous availability or organizational resilience. |

### Five maps and six visual representations

Module 26 uses a compact original dossier because different concerns need
different representations. Its canonical learning sequence is fixed across the
workbook, source map, and studio: **Release Brief**, **System Threads**,
**Failure Playback**, **Red-Team Patch Bay**, **Evidence Ledger**, and
**Release Board & Defense**. The order moves from promise, to mechanism, to a
concrete failure, to a proposed repair, to the evidence needed for a decision.

The approach is compatible with the public framing of
[ISO/IEC/IEEE 42010:2022](https://www.iso.org/standard/74393.html): architecture
description is about viewpoints, model kinds, stakeholders, and concerns, not
one universal picture. The C4 model supplies a readable zoom vocabulary, but
Atlas does not claim formal C4 or ISO conformance.

| Dossier map | Studio representation | Question it answers | Required contents | Validation move |
|---|---|---|---|---|
| **1. Purpose + context** | Release Brief | Who needs what, who owns consequences, and what is outside the system? | Need, stakeholder, non-goal, external actors, assets, authority edge, quality attributes. | Point from each relation to source/config or mark it unknown. |
| **2. Code + runtime responsibilities** | System Threads | Which components own which rule, and how does one flow travel? | Entry point, modules, interfaces/contracts, state, errors, runtime boundary. | Trace one success and one rejection/failure path through actual code/tests. |
| **3. Data + trust + authority** | System Threads + Evidence Ledger | Which data exists, why, when, and who may read/write/approve? | Synthetic/real status, purpose, provenance, transformation, secret/policy/approval gates. | Mark every transfer authorized, prohibited, or unknown. |
| **4. Deployment + operations** | Failure Playback + Release Board | What runs where, what signal says healthy enough, and how is it recovered? | Version, artifact, target, config/secrets boundary, verification, known-good release, rollback owner/trigger. | Rehearse one scoped failure/recovery path. |
| **5. Change + release + stewardship** | Red-Team Patch Bay + Release Board & Defense | How does a proposal become reviewed, attributable, maintainable? | Intent/PR, reviewer/owner, CI, dependency/license note, release/tag, contribution/security route. | Follow one change from intent to merge/release evidence. |

Original text equivalent:

~~~text
Need + owner + non-goal
        │  [Release Brief]
        ▼
entry point → components/contracts → data & authority boundary
        │             │                       │
        │             └── test / failure trace ┘
        ▼
versioned source → review/CI → artifact → private deployment
        │                                      │
        └── ADR / source / dependency ledger   ├── verification signal
                                               ├── accessibility + human check
                                               └── owner-led rollback path
                                                        │
                                                        ▼
                                      dossier + oral defense + limitation
~~~

### Architecture-recovery protocol

The protocol is inspired by the CMU/SEI observation that existing systems often
need their as-built architecture reconstructed. It is intentionally smaller than
a professional reconstruction engagement.

1. **Start from question, not directory tree.** State need, owner, meaningful
   non-goal, and one consequential flow.
2. **Find executable evidence.** Locate entry points, tests, configuration,
   generated artifact/release metadata, and critical data/state definitions.
3. **Draw only what can be pointed to.** Every relation gets a source path,
   command/result, config record, or an explicit unknown label.
4. **Trace a happy and unhappy path.** Follow a permitted event and a
   rejected/failed event; architecture appears in recovery paths too.
5. **Compare intent to as-built behavior.** If README, ADR, or diagram
   conflicts with code/config/test, record the conflict rather than choosing
   the prettier story.
6. **Review hostilely helpfully.** Ask: “What data/control crosses here? Who
   owns it? What test would reveal this map is stale?”

### Bounded vertical slice

The default capstone integrates—but does not extend beyond—the M25 Next-Step
Evidence Studio:

~~~text
synthetic transactional event data
    → time-valid candidate builder / prerequisite graph
    → deterministic transparent ranking policy
    → authorized local read boundary
    → accessible suggestion + explanation + human override
    → separate approval / no automatic write boundary
    → minimized evidence record
    → reviewed, CI-tested, privately released version with recovery plan
~~~

An optional LLM/agent can act only as a fixed, redacted proposal source during
the **change** stage. It never replaces the deterministic runtime policy, selects
data, holds credentials, approves a proposal, or carries out a release. The
capstone remains meaningful when no LLM runs.

---

## Primary-source ledger

Every source below is used only for its stated narrow claim. Each date/status is
recorded because implementation documentation and platform behavior can change.

### A. Architecture recovery, decision records, and tradeoffs

#### A1. ISO/IEC/IEEE 42010:2022 — architecture descriptions

Primary source: [ISO/IEC/IEEE 42010:2022 — Software, systems and enterprise —
Architecture description](https://www.iso.org/standard/74393.html).

- **Status/date:** International Standard, Edition 2, published November 2022.
- **Narrow use:** architecture descriptions are shaped by stakeholders,
  concerns, viewpoints, and model kinds. This supports the rule that every
  Atlas map names its audience, concern, scope/version, evidence, and unknowns.
- **Teaching move:** in System Threads, learner assigns every map relationship
  a source/config/test anchor or an explicit unknown label.
- **Boundary:** the public abstract says the standard does not prescribe one
  architecting process, notation, technique, tool, or storage format. Atlas
  therefore claims neither ISO 42010 conformance nor a complete standard-based
  architecture method.
- **Access/reuse:** ISO's full text is paid and copyrighted. Link/narrowly
  paraphrase public metadata only; do not reproduce standard text, diagrams,
  tables, or imply certification.

#### A2. C4 model — structural zoom and legible notation

Primary sources: [C4 model — diagrams](https://c4model.com/diagrams) and
[C4 model — notation](https://c4model.com/diagrams/notation).

- **Status/date:** official creator-maintained living documentation, accessed
  2026-07-30. It presents system context, container, component, and code views,
  plus dynamic/deployment supporting views.
- **Narrow use:** diagrams should change zoom for audience and include readable
  scope/legend/element types. This grounds the purpose of System Threads, not a
  generic box-and-arrow aesthetic.
- **Teaching move:** use an original context/container-like map plus original
  dynamic trace; omit levels that add no decision value.
- **Boundary:** C4 is notation-independent guidance. It does not make a diagram
  complete, secure, accurate, or sufficient for data/authority/accessibility/
  release concerns.
- **Access/reuse:** C4 states that its website and example diagrams are
  [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Atlas still draws
  original diagrams, attributes the model, and does not trace screenshots.

#### A3. CMU/SEI — reconstructing an as-built architecture

Primary source: [Software Architecture Reconstruction: Practice Needs and
Current Approaches](https://www.sei.cmu.edu/library/software-architecture-reconstruction-practice-needs-and-current-approaches/),
CMU/SEI-2002-TR-024.

- **Status/date:** CMU Software Engineering Institute technical report,
  August 2002; authoritative for its research framing, not a current standard.
- **Narrow use:** existing systems can require reconstruction to reflect their
  as-built architecture. It grounds Atlas's instruction to validate maps
  against code, tests, configuration, execution, and release artifacts.
- **Teaching move:** the Evidence Ledger shows a claimed/observed pair; the
  learner marks a conflict rather than fabricating coherence.
- **Boundary:** a capstone exercise is not a complete professional architecture
  reconstruction engagement.
- **Access/reuse:** link and paraphrase; do not reuse report figures or bulk
  text without checking CMU/SEI terms.

#### A4. CMU/SEI ATAM — tradeoff scenarios and defense questions

Primary sources: [Architecture Tradeoff Analysis Method
collection](https://www.sei.cmu.edu/library/architecture-tradeoff-analysis-method-collection/)
and [The Architecture Tradeoff Analysis Method](https://www.sei.cmu.edu/library/the-architecture-tradeoff-analysis-method-2/).

- **Status/date:** CMU/SEI collection (2018) and original white paper (1998).
- **Narrow use:** quality attributes interact; scenarios, risks, sensitivity
  points, and tradeoff points make a design argument inspectable.
- **Teaching move:** conduct an **ATAM-inspired mini-review**: one owner, small
  stakeholder cards, two quality-attribute scenarios, one risk, one
  sensitivity/tradeoff point, and a follow-up observation. The oral defense
  must include a rejected alternative.
- **Boundary:** fuller ATAM evaluations involve trained evaluators and multiple
  stakeholders over days. Never call the course activity a formal ATAM,
  certification, or proof of quality.
- **Access/reuse:** create original scenario cards, prompts, and diagrams; link
  and paraphrase rather than copy forms/figures.

#### A5. ADRs — decisions, status, and future maintainers

Primary sources: [Michael Nygard, Documenting Architecture
Decisions](https://www.cognitect.com/blog/2011/11/15/documenting-architecture-decisions),
[MADR](https://adr.github.io/madr/), and [ADR
templates](https://adr.github.io/adr-templates/).

- **Status/date:** Nygard original 2011; MADR is a maintained project, accessed
  2026-07-30.
- **Narrow use:** an ADR records a significant decision with context/forces,
  decision, status, and consequences. MADR adds useful structured alternatives,
  pros/cons, decision maker, and confirmation concepts.
- **Teaching move:** Atlas ADRs require context, options, decision,
  consequences, owner, status, confirmation/falsifier, and review/supersession
  date. A decision ledger powers the Red-Team Patch Bay and defense.
- **Boundary:** an ADR records rationale; it does not prove implementation,
  exhaustive alternatives, or ongoing validity.
- **Access/reuse:** Nygard's page states a CC0-style waiver. MADR's
  [repository license](https://github.com/adr/madr/blob/develop/LICENSE) is
  MIT OR CC0-1.0. Preserve notices for reused template text; Atlas prefers its
  own lean evidence-ledger wording.

#### A6. MIT OpenCourseWare 6.005 — evidence-oriented software construction

Primary sources: [MIT 6.005 Software
Construction](https://ocw.mit.edu/courses/6-005-software-construction-spring-2016/)
and its [syllabus](https://ocw.mit.edu/courses/6-005-software-construction-spring-2016/pages/syllabus/).

- **Status/date:** undergraduate MIT course, Spring 2016.
- **Narrow use:** specifications, invariants, testing, code review, feedback,
  and revision offer a university-quality pedagogical reference for the
  capstone's read–predict–review–revise cycle.
- **Teaching move:** retain the reasoning method but use original Python/system
  fixtures rather than porting course assignments.
- **Boundary:** it is pedagogical context, not an Atlas grading prescription or
  a claim that Module 26 replicates MIT 6.005.
- **Access/reuse:** [MIT OCW terms](https://ocw.mit.edu/pages/privacy-and-terms-of-use/)
  list CC BY-NC-SA 4.0. Link/paraphrase; do not copy slides, problem sets,
  quizzes, solutions, figures, or grading design.

### B. Stewardship, pull-request review, and AI-generated changes

#### B1. GitHub reviews, CODEOWNERS, and protected branches

Primary sources: [About pull request
reviews](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/reviewing-changes-in-pull-requests/about-pull-request-reviews),
[About code owners](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners),
and [About protected
branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches).

- **Status/date:** living official GitHub documentation, accessed 2026-07-30.
- **Narrow use:** PR review enables discussion/approval/requested changes;
  CODEOWNERS can route responsibility; protected branches/rulesets can require
  reviews, status checks, conversation resolution, and restrictions.
- **Teaching move:** every material change has an intent/non-goal, named review
  questions, affected-map links, review owner, test evidence, unresolved item,
  and post-merge release/evidence link.
- **Boundary:** gates do not prove review depth, reviewer independence,
  appropriate checks, safety, or current configuration. Plan/settings may vary.
- **Access/reuse:** link/paraphrase moving vendor docs; do not copy screenshots
  or bulk text. Record actual repository configuration.

#### B2. Open-source stewardship versus public code

Primary sources: [Best practices for
repositories](https://docs.github.com/en/enterprise-cloud%40latest/repositories/creating-and-managing-repositories/best-practices-for-repositories),
[Setting up a project for healthy
contributions](https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions),
and [Licensing a
repository](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository).

- **Status/date:** living official GitHub documentation, accessed 2026-07-30.
- **Narrow use:** README, license, contribution guidelines, code of conduct,
  security policy, and review route communicate expectations. A repository
  without a license is not automatically open source.
- **Teaching move:** Release Brief contains a stewardship decision card:
  visibility, intended audience, license status or decision not to license,
  contribution route, vulnerability-reporting boundary, ownership, and
  maintenance limit.
- **Boundary:** health files do not create a healthy community, grant legal
  advice, eliminate maintainer burden, or mean a private course project accepts
  external contributions.
- **Access/reuse:** use vendor guidance for mechanics only; it is not legal
  counsel.

#### B3. GitHub guidance on AI-generated code

Primary sources: [Review AI-generated
code](https://docs.github.com/en/copilot/tutorials/review-ai-generated-code)
and [About GitHub Copilot code
review](https://docs.github.com/en/copilot/concepts/agents/code-review).

- **Status/date:** living official GitHub documentation, accessed 2026-07-30.
- **Narrow use:** official guidance says to validate AI feedback carefully and
  supplement it with human review. Its review tutorial frames function, intent,
  code quality, dependencies, AI-specific pitfalls, collaboration, and
  automation.
- **Teaching move:** any agent output begins as **proposal**. In Red-Team Patch
  Bay the learner states intent/non-goal before reading it, inspects full
  surrounding code/diff, identifies changed contracts/data/permissions/
  dependencies, produces a counterexample or test, and records human
  acceptance/revision/rejection with rationale.
- **Boundary:** availability, model behavior, plans, and preview status change.
  Neither AI feedback nor human review guarantees all issues are found. A tool
  comment cannot approve, merge, deploy, or own a risk decision.

#### B4. Original Atlas agent-review protocol

This protocol is an Atlas teaching model informed by the sources above and M25,
not an external standard.

| Stage | Learner action | Retained evidence | Rejection trigger |
|---|---|---|---|
| **Frame** | State intended change, non-goal, contract, authority/data boundary, and likely failure before prompt/output. | Change card + map links. | Goal depends on hidden data, privileges, or undefined success. |
| **Read** | Inspect full diff and surrounding call sites; reconstruct flow, not summary. | Review notes/annotated diff. | Unexplained side effect, unrelated refactor, secret/data exposure, or opaque dependency. |
| **Challenge** | Produce adversarial input, counterexample, test idea, or alternative. | Failing test/observation or stated gap. | “It looks right” is the only support. |
| **Verify** | Run/inspect contract, test, static check, build, and relevant accessibility/security/privacy seams. | Exact command/result/version + limitation. | Result cannot be reproduced or does not exercise the seam. |
| **Decide** | Named human accepts, requests revision, or rejects. | ADR/review decision + owner. | Agent output is treated as approval/authority. |
| **Release** | Re-run evidence on exact commit and retain recovery route. | Release dossier/verification note. | Source, artifact, and target cannot be related. |

### C. Tests, continuous integration, supply chain, and provenance

#### C1. Python CI and test mechanics

Primary sources: [Building and testing Python — GitHub
Docs](https://docs.github.com/en/actions/tutorials/build-and-test-code/python),
[pytest fixtures](https://docs.pytest.org/en/stable/explanation/fixtures.html),
and [pytest parametrization](https://docs.pytest.org/en/stable/how-to/parametrize.html).

- **Status/date:** living official docs, accessed 2026-07-30.
- **Narrow use:** CI can declare Python-version matrices and execute commands
  for a revision; fixtures and parametrization make setup/dependency scope and
  multiple named cases visible.
- **Teaching move:** Evidence Ledger records source SHA, Python versions,
  dependency-install method, commands/results, fixture/data boundary, contract
  and failure seam tested, and the fact each result does not establish.
- **Boundary:** green matrices/parameterized suites support only the configured
  cases/environments. They do not prove complete coverage, correctness, release
  identity, security, user benefit, or all platforms.
- **Access/reuse:** pin actual tool/package versions for runnable artifacts.
  Write original fixtures/tests/descriptions and comply with any license for
  copied code.

#### C2. Artifact attestations and SLSA provenance

Primary sources: [GitHub artifact
attestations](https://docs.github.com/en/actions/how-tos/secure-your-work/use-artifact-attestations/use-artifact-attestations),
[SLSA v1.2 requirements](https://slsa.dev/spec/v1.2/requirements), and
[SLSA v1.2 provenance](https://slsa.dev/spec/v1.2/provenance).

- **Status/date:** GitHub docs are living; SLSA v1.2 pages identify their
  requirements as **Approved**; accessed 2026-07-30.
- **Narrow use:** attestations can establish claims about where/how a build
  occurred and are independently verifiable under their platform conditions.
  SLSA distinguishes source from build provenance and describes provenance as
  verifiable information relating artifact to origin, time, and process.
- **Teaching move:** use four explicit rungs:
  “named source revision → recorded/reproducible build → artifact identity →
  independently checked provenance evidence.” Learner states the highest rung
  actually achieved. An attestation is optional; core evidence may be a digest
  plus exact source/build record.
- **Boundary:** do not claim a SLSA level without all relevant requirements.
  Provenance does not prove source correctness, absence of vulnerabilities,
  trustworthy intent, or safe runtime. GitHub attestation availability can
  depend on plan/repository conditions.
- **Access/reuse:** SLSA pages use Linux Foundation Community Specification
  License 1.0. Link/paraphrase and preserve status/version; do not copy
  specification text or claim compliance.

#### C3. NIST SSDF, supply-chain risk, and SPDX

Primary sources: [NIST SP 800-218 Secure Software Development Framework
v1.1](https://csrc.nist.gov/pubs/sp/800/218/final), [NIST SP 800-161 Rev. 1
Cybersecurity Supply Chain Risk Management](https://csrc.nist.gov/pubs/sp/800/161/r1/upd1/final),
and [SPDX specifications](https://spdx.dev/use/specifications/).

- **Status/date:** SP 800-218 v1.1 Final (February 2022); SP 800-161 Rev. 1
  has updates through November 2024; SPDX official page lists 3.0 as current
  at the research snapshot.
- **Narrow use:** secure development/supply-chain risk need documented,
  risk-based practices. An SBOM is a composition record that can name packages,
  versions, relationships, origins, and license/security references.
- **Teaching move:** a dependency/security card names asset/dependency/source,
  intended role, known advisory or uncertainty, update/acceptance decision,
  owner, and follow-up. A readable lockfile/dependency inventory is core; a
  formal SBOM is optional.
- **Boundary:** frameworks are voluntary/high-level; an SBOM is not a
  vulnerability scan, legal clearance, security guarantee, or full account of
  runtime/generated components. Do not say “security-clean.”
- **Access/reuse:** cite NIST report number/version/date; do not imply NIST
  certification/endorsement or legal advice. Respect SPDX/tool licenses and
  notices if using actual generators.


### D. Deployment, recovery, incident learning, and release board

#### D1. GitHub deployment environments

Primary sources: [Deploying with GitHub
Actions](https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/control-deployments)
and [Managing environments for
deployment](https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/manage-environments).

- **Status/date:** living official GitHub documentation, accessed 2026-07-30.
- **Narrow use:** environments can organize targets, branch restrictions,
  deployment protection rules, approval, concurrency, and secrets access. They
  distinguish an environment label from a full release-assurance system.
- **Teaching move:** Release Board names target, release/rollback owner,
  sequencing concern, secrets boundary, deployed source/artifact, post-deploy
  verification, and known-good version.
- **Boundary:** behavior/availability varies by plan and configuration. A
  protected environment does not guarantee appropriate rollback, prevent all
  errors, or make a private release public.

#### D2. Google SRE release and canary thinking

Primary sources: [Release Engineering](https://sre.google/sre-book/release-engineering/)
and [Canarying Releases](https://sre.google/workbook/canarying-releases/).

- **Status/date:** first-party Google SRE book/workbook material, accessed
  2026-07-30.
- **Narrow use:** repeatable builds, versioned releases, release-gating test
  targets, staged signals, and deliberate rollback decisions are stronger
  release reasoning than an unrepeatable manual deploy.
- **Teaching move:** create a **release decision card**: known-good version,
  candidate version, signal, threshold, release owner, pause/rollback owner,
  recovery path, and verification after recovery. If no traffic exists, use an
  original synthetic behavior/health check rather than pretending to run a
  production canary.
- **Boundary:** Google-scale practices are not requirements for a small course
  site. Canarying/rollout control does not itself protect data, prevent defects,
  or establish human benefit.
- **Access/reuse:** link/paraphrase and write original local drills; do not copy
  production case studies/templates or imply Google endorsement.

#### D3. NIST SP 800-61r3 and postmortem learning

Primary sources: [NIST SP 800-61 Rev. 3, Incident Response Recommendations and
Considerations for Cybersecurity Risk Management](https://csrc.nist.gov/pubs/sp/800/61/r3/final)
and [Google SRE, Blameless Postmortem for System
Resilience](https://sre.google/sre-book/postmortem-culture/).

- **Status/date:** NIST SP 800-61r3 Final, April 2025; Google SRE book chapter
  is first-party operational guidance, accessed 2026-07-30.
- **Narrow use:** incident response belongs in a wider risk-management lifecycle;
  a postmortem can record impact, mitigation, contributing causes, and
  follow-up, with a learning rather than blame focus.
- **Teaching move:** Failure Playback produces a scoped incident/drill card:
  detection signal, affected claim, authority, containment/rollback, preserved
  evidence, recovery verification, uncertainty, and one owner/date for
  follow-up.
- **Boundary:** a course drill is neither a real incident-response program nor
  a claim of causal certainty/prevention. Do not invent incidents, root causes,
  or production guarantees.
- **Access/reuse:** cite report/date and link. Do not imply NIST certification
  or reproduce substantial text/figures.

### E. Accessibility, privacy, human impact, and AI-era boundaries

#### E1. WCAG 2.2 and W3C evaluation guidance

Primary sources: [Web Content Accessibility Guidelines
2.2](https://www.w3.org/TR/WCAG22/), [W3C Accessibility Guidelines Evaluation
Methodology 2.0](https://www.w3.org/TR/wcag-em-2/), [WCAG-EM
overview](https://www.w3.org/WAI/test-evaluate/conformance/wcag-em/), and
[WAI-ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/).

- **Status/date:** WCAG 2.2 is a W3C Recommendation (October 2023). WCAG-EM 2.0
  is a W3C Group Note (23 July 2026); the APG is living guidance. Status
  matters.
- **Narrow use:** WCAG makes conformance claims scope-sensitive; W3C evaluation
  guidance distinguishes scoped/manual evaluation and reporting from an
  automated check. APG helps inspect interaction semantics but is not normative
  WCAG.
- **Teaching move:** Failure Playback includes a complete human-control task:
  keyboard route, visible focus, names/roles/states, explanation/limitation,
  reject/override, browser/AT scope if used, finding, and unresolved issue.
- **Boundary:** one keyboard check or automated scan cannot establish full
  conformance or usability across people/technologies. Accessibility conformance
  is not identical to fairness, benefit, or human-centered design.
- **Access/reuse:** W3C material is governed by the [W3C Document License
  (2023)](https://www.w3.org/copyright/document-license-2023/). Use original
  tests/diagrams/explanations; preserve attribution/status if copying permitted
  portions and do not reproduce whole criteria/tables.

#### E2. NIST Privacy Framework

Primary sources: [NIST Privacy Framework](https://www.nist.gov/privacy-framework)
and [Privacy Framework FAQ](https://www.nist.gov/privacy-framework/frequently-asked-questions).

- **Status/date:** Version 1.0, January 2020; official site accessed
  2026-07-30. Newer draft work must not be silently represented as final.
- **Narrow use:** Identify-P, Govern-P, Control-P, Communicate-P, and Protect-P
  support vocabulary for data processing risk and privacy engineering concerns.
- **Teaching move:** Evidence Ledger contains data inventory: field/source,
  purpose, allowed use, retention/deletion intent, location/access,
  synthetic/real status, owner, and residual uncertainty. Default is no real
  learner data.
- **Boundary:** a framework/inventory is not legal compliance, consent,
  fairness, security, or low-risk proof. No personal data should be introduced
  merely to make the project feel realistic.
- **Access/reuse:** name version/date; link/paraphrase narrowly, no certification
  or legal claim.

#### E3. NIST AI RMF and Generative AI Profile, only if generative AI exists

Primary sources: [NIST AI RMF 1.0 (NIST AI
100-1)](https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-ai-rmf-10),
[AI RMF Core](https://airc.nist.gov/airmf-resources/airmf/5-sec-core/), and
[Generative AI Profile (NIST AI
600-1)](https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence).

- **Status/date:** AI RMF 1.0 published January 2023; GenAI Profile Final July
  2024. NIST's AIRC says AI RMF 1.0 is being revised, so versions must stay
  visible.
- **Narrow use:** Govern, Map, Measure, and Manage give vocabulary for roles,
  intended use, impacts, TEVV, and accountable go/no-go decisions. The GenAI
  profile applies only if the capstone truly has a generative component.
- **Teaching move:** Red-Team Patch Bay requires a capability ledger: purpose,
  fixed/redacted input, model/version if known, output status, validation,
  excluded tools/data/authority, human reviewer, refusal/fallback, and retained
  evidence.
- **Boundary:** these are voluntary risk-management sources, not certification.
  They do not make an agent trustworthy, grant authorization, or replace review,
  privacy controls, security tests, or human accountability.

---

## Source-to-studio alignment

| Six-view representation | Core evidence question | Primary source anchors | Required course boundary |
|---|---|---|---|
| **Release Brief** | What purpose, non-goal, owner, quality attribute, stewardship status, and release claim are proposed? | ISO 42010, Nygard ADR, MIT 6.005, GitHub repository/licensing guidance. | A brief is not validation, legal advice, or a public/open-source declaration. |
| **System Threads** | What actually happens across code, runtime, data, trust, and authority boundaries? | C4, CMU/SEI reconstruction, ISO 42010, M25 contracts. | Diagram must point to code/config/tests or say unknown; it is not the system. |
| **Failure Playback** | What signal reveals a problem, who stops/reverses it, what version is known-good, and what human task is affected? | Google SRE, NIST SP 800-61r3, WCAG/WCAG-EM. | Local drill is not a production incident program or accessibility certification. |
| **Red-Team Patch Bay** | Is a human or agent patch justified, bounded, independently checked, and safely stewarded? | GitHub PR/CODEOWNERS/protected branches, GitHub AI review guidance, ADRs. | Agent output cannot approve, authorize, merge, deploy, or prove. |
| **Evidence Ledger** | Which source, contract, test, CI observation, dependency, artifact, person, and limit supports each claim? | GitHub Actions, pytest, SLSA, NIST SSDF, SPDX, Privacy Framework. | Tests/provenance/composition each support narrow claims, never a generic quality score. |
| **Release Board & Defense** | Can a reviewer trace source → review/CI → artifact → private target → verification → recovery and challenge tradeoff? | GitHub environments/attestations, SLSA, ATAM, NIST sources. | Release evidence does not create certification, universal suitability, or clean security claim. |

---

## Teaching sequence and session claim boundaries

### Shared capstone story

The learner inherits an existing private Atlas decision-support portal. It has a
bounded synthetic event/ranking flow, accessible decision card, proposal-only AI
boundary, test artifacts, and protected source workflow. The work is not “add
more AI.” It is to make the release argument legible, challengeable, and
recoverable.

### Session 26.1 — Release Brief: bound slice and claim ledger

**Question:** What human need may this release address, and what is it prohibited
from deciding or changing?

- Reuse M25 decision contract, human override, data minimization, and
  no-automatic-mutation boundary.
- Write owner, stakeholder, user task, non-goal, success evidence,
  harm/failure condition, privacy boundary, and stop/rollback condition.
- Turn each consequential release claim into the eight-field evidence record.

**Source cards:** NIST Privacy Framework; NIST AI RMF only if AI is included;
MIT 6.005.  
**Prediction prompt:** “If ranking works on a fixture but a person rejects it,
which claim changed?”  
**Required answer:** separate implementation behavior, human-use observation,
and authority/decision boundary.

### Session 26.2 — System Threads: recover as-built architecture and tradeoff

**Question:** Can every arrow be traced to code, configuration, test, or an
explicit unknown?

- Recover five maps from entry points, contracts, tests, configuration, and
  release artifacts; do not begin from AI-generated diagram prose.
- Trace one successful suggestion and one rejected/blocked path.
- Create two quality-attribute scenarios and an ADR with a rejected alternative.

**Source cards:** ISO 42010 public scope, C4, CMU/SEI reconstruction, ATAM.  
**Prediction prompt:** “A map says Policy owns writes, but UI calls a write
function directly. Which artifact wins?”  
**Required answer:** neither alone; record conflict and inspect executable path.

### Session 26.3 — Failure Playback: release, recover, and evaluate people

**Question:** If a version surprises, harms, or fails a person, who can stop it,
restore a known-good version, and explain the evidence?

- Make private release card with owner, target, version, verification signal,
  known-good rollback version, trigger, and data/state implications.
- Rehearse scoped rollback/near-miss deterministically when no live deployment
  exists.
- Evaluate a complete accessibility/human-control task and record scope,
  finding, and unresolved issue.

**Source cards:** GitHub environments, Google SRE release/canary, NIST SP
800-61r3, Google postmortem, WCAG/WCAG-EM, NIST Privacy Framework.  
**Prediction prompt:** “Page load succeeds. What is left before ‘healthy’?”  
**Required answer:** declared contract/task, accessibility/human control,
source/artifact relation, relevant privacy/security boundary, limitation, and
recovery readiness.

### Session 26.4 — Red-Team Patch Bay: steward a change

**Question:** What would make a maintainer accept or reject a minimal change?

- State intent/non-goal before reading an AI or human patch.
- Read full diff and affected call sites; update maps/ADRs when a boundary
  changes.
- Inspect data/authority/dependency/accessibility consequences and create a
  counterexample/test, not only a happy-path demonstration.
- Record acceptance/revision/rejection with named human owner.

**Source cards:** GitHub PR reviews/CODEOWNERS/protected branches, GitHub AI
review guidance, MIT 6.005.  
**Prediction prompt:** “A model refactor makes existing tests pass. First
question?”  
**Required answer:** identify changed contract/data/authority and missing
falsifier; inherited tests alone are insufficient.

### Session 26.5 — Evidence Ledger: test, build, and prove only what you have

**Question:** Which claim does each test/workflow/artifact record support, and
which attractive claim remains unproven?

- Build contract-led test matrix: deterministic rule, rejected action,
  integration boundary, generated/published artifact parity, accessibility seam,
  and selected performance/evaluation evidence.
- Run declared Python matrix and record command, environment, source revision,
  and result.
- Trace source → dependency/build inputs → artifact identity; optionally
  attest/verify only if platform conditions allow it.

**Source cards:** GitHub Actions Python, pytest, SLSA, GitHub attestations, NIST
SSDF/SP 800-161, SPDX.  
**Prediction prompt:** “A release asset digest matches. What is established?”  
**Required answer:** identity relative to compared bytes, not source origin,
correctness, lack of vulnerabilities, or user benefit.

### Session 26.6 — Release Board & Defense: hand off maintainable version

**Question:** Can a reviewer challenge the strongest claim and still find owner,
evidence, limitation, and recovery path?

- Assemble dossier and narrative: need/non-goal, maps, tradeoff, change review,
  tests/provenance, release/recovery, human impact, unknowns.
- Deliver hostilely helpful defense with a rejected alternative, failed
  prediction, residual risk, and next evidence to collect.
- Produce handoff plus 30/90-day maintenance/learning plan.

**Source cards:** ATAM, ADR sources, GitHub stewardship, all prior evidence
cards.  
**Prediction prompt:** “What is stronger: ‘everything works,’ ‘CI is green,’ or
a scoped versioned release claim with limitation?”  
**Required answer:** the versioned claim; strength is traceability and honesty,
not sweeping certainty.


---

## Atlas capstone evidence bundle

### Required bundle contents

| Bundle item | Minimum contents | Evidence label | Required limitation |
|---|---|---|---|
| **1. Release Brief** | Purpose, stakeholder, owner, non-goal, system boundary, claims, harm/failure, success evidence, unknowns. | [CONTRACT], [UNKNOWN] | Charter is not product validation. |
| **2. System Threads** | Five maps, success/failure trace, source/test/config anchors, version/scope, unknowns. | [SYSTEM MAP] | Maps go stale and omit behavior outside inspected scope. |
| **3. Decision ledger** | ADR context, alternatives, decision, consequence, owner, status, confirmation/review date. | [ADR / TRADEOFF] | Rationale does not prove implementation or current validity. |
| **4. Patch-review packet** | Intent/non-goal, focused diff, affected contracts, independent review, AI proposal status if relevant, unresolved questions. | [CONTRACT], [ADR / TRADEOFF] | Review may miss defects; it is not a security audit. |
| **5. Evidence Ledger** | Fixture/data boundary, tests/failures, commands, Python/environment, results, non-claims. | [DETERMINISTIC TEST], [CI OBSERVATION] | Green tests remain scoped observations. |
| **6. Security/privacy/composition card** | Asset/data/dependency inventory, purpose/access/retention, advisory/uncertainty, decision/owner/follow-up. | [SECURITY / PRIVACY RISK], [PROVENANCE / COMPOSITION] | No certification, legal conclusion, or “clean” claim. |
| **7. Failure Playback** | Exact commit/version/artifact, target, verification, known-good version, rollback trigger/owner/path, drill note. | [PROVENANCE / COMPOSITION], [OPERATIONS DRILL] | Scoped drill is not proof of production resilience. |
| **8. Human-impact observation** | Complete task, build/version, method, result, evaluator/participant scope, issue/limitation, override/control. | [ACCESSIBILITY OBSERVATION], [HUMAN-IMPACT OBSERVATION] | No universal accessibility/usability/benefit claim. |
| **9. Stewardship/handoff** | Visibility/license decision, README/architecture route, contribution/security route if in scope, owners, maintenance limit. | [ADR / TRADEOFF] | Documents do not create a community or accept outside work automatically. |
| **10. Release Board & Defense** | Five-minute narrative plus Q&A about tradeoff, proof, unknown, authority, failure, rollback, next falsifier. | all relevant labels | Articulate presentation is not evidence without records. |

### Minimum release claim template

> **On** “date”, **owner** “role/name” released “version/artifact” from source
> “commit” to “private target” for bounded purpose “purpose/non-goal”. The claim
> “claim” is supported by “contract/map”, “test or observation and scope”, and
> “verification”. It costs/risks “failure boundary”, has privacy/security/
> accessibility implication “boundary”, and remains limited by “unknown/residual
> risk”. If “trigger”, “owner” will “rollback/recovery action” to “known-good
> version” and record “follow-up evidence”.

### Oral architecture defense card

The defense is an original Atlas assessment informed by ATAM-style
quality-attribute scenarios and ADR discipline. It is not external
certification. The learner answers:

1. **Purpose:** What human need does this release address, who owns it, and what
   is it explicitly forbidden to decide or change?
2. **Architecture:** Trace one event from entry point through data, policy, UI,
   authority, and state boundary. Which map/evidence supports each step?
3. **Decision:** Which alternative was rejected? Which quality attribute or
   boundary would it improve/worsen, and what evidence supports the tradeoff?
4. **Change:** How was the last material patch independently challenged,
   especially if an agent proposed it?
5. **Evidence:** Which test/CI/provenance record supports the strongest claim,
   and which fact does it not establish?
6. **People:** Can a person understand, decline, correct, and operate the
   proposal in declared accessibility scope? What is unknown?
7. **Safety:** What data/authority/dependency boundary is most likely to be
   misunderstood, and who may approve/override it?
8. **Recovery:** What fails first, which signal detects it, who can stop/roll it
   back, and how is known-good recovery verified?
9. **Learning:** What initial prediction was wrong, and what smallest next
   experiment/review reduces the highest remaining uncertainty?

---

## Visual, assessment, and safety authoring brief

The six views must make relationships legible before asking a question. Use
original diagrams, text equivalents, high contrast, visible focus,
keyboard-reachable controls, reduced-motion support, and local-only learning
state. Do not execute learner source, call a live model, collect telemetry,
expose secrets/private source, or mutate learner progress without a separate
transparent local choice.

### Confidence-aware multiple-choice diagnostics

| Prompt | Best understanding demonstrated | Misconception rejected |
|---|---|---|
| A component map says Policy owns plan writes, but UI directly calls a write function. What does the dossier say? | Record claimed/as-built conflict and trace executable path before trusting either. | “The diagram wins because it is architecture.” |
| A PR has approvals and green checks. What remains explicit? | Intent, risk boundary, review scope, exact commit, and unknowns. | “Required review proves the right decision.” |
| An agent suggests a dependency upgrade. First action? | Identify purpose, lock/composition change, security/license/runtime implication, and independent test. | “Accept it because agent cited a CVE.” |
| Release asset digest matches. What can be said? | Bytes match compared digest record; source/build origin needs further evidence. | “Artifact is correct and secure.” |
| Private page loads after deployment. What remains? | Declared behavior/task, accessibility/human control, source/artifact relation, relevant boundaries, limitation, recovery readiness. | “HTTP success equals healthy.” |
| Keyboard check passes in one browser. What remains true? | It is a scoped observation; full conformance/usability remains unproven. | “Keyboard pass means WCAG-conformant.” |
| Rollback command exists but no known-good version named. What is missing? | Recoverable target/version plus verification, owner, and trigger. | “Any earlier commit is safe rollback.” |
| Agent-generated test passes. What must be asked? | Which contract/failure it exercises, how it could fail, and what remains untested. | “Generated test is independent validation.” |

### TA and Study Partner prompts

- If learner says “the diagram shows it,” request source/config/test anchor and
  version.
- If they say “all tests pass,” request contract, data scope, environment,
  failure mode, and the result's non-claim.
- If they say “the AI made the change,” ask who selected intent, who read the
  diff, what capability/data boundary changed, and who owns merge/release.
- If they say “we have provenance,” ask whether it is source, build, artifact,
  dependency, attestation, or verification evidence—and what it cannot prove.
- If they say “we rolled back,” request known-good version, owner, trigger,
  state/data caveat, verification, and follow-up.
- If they say “it is accessible,” request complete task, keyboard/focus/
  semantic evidence, browser/AT scope, human observation, and unresolved issue.
- If they say “we are open source,” ask for visibility, license, contribution
  route, security-report boundary, maintainer capacity, and whether source code
  is merely public.

---

## Licensing, reuse, and access ledger

| Material | Allowed Atlas use | Attribution / reuse boundary |
|---|---|---|
| ISO/IEC/IEEE 42010 public catalogue | Link and narrowly paraphrase public abstract/status. | Full standard is paid/copyrighted; no copied text/figures/tables or conformance claim. |
| C4 model | Link/attribute zoom/diagram vocabulary; create original maps. | Site/examples CC BY 4.0; do not copy screenshots or suggest endorsement. |
| CMU/SEI reconstruction/ATAM | Link/paraphrase recovery/views/tradeoff ideas. | No reused figures/forms/report prose; mini-review is not formal ATAM. |
| MIT OCW 6.005 | Link for sequencing/vocabulary; create original Python work. | CC BY-NC-SA 4.0; do not transplant assignments, solutions, slides, or grading material. |
| Nygard ADR/MADR | Link/credit ADR framing; original ledger or properly attributed template. | Nygard page has waiver; MADR MIT OR CC0. Preserve applicable notices. |
| GitHub docs | Link/paraphrase platform mechanics and current limitations. | Living/vendor-specific; no bulk copy/screenshots, certification, or legal conclusions. |
| pytest docs | Link/paraphrase test mechanics and pin actual version when run. | Use original fixtures/descriptions; follow license for copied code. |
| NIST publications | Link/narrowly paraphrase with report/version/date. | No NIST endorsement/certification/legal claim; check notices before reproducing. |
| SLSA/SPDX | Link version/status and use vocabulary in original cards. | No level/compliance claim without full verification; preserve license/notices. |
| Google SRE | Link/paraphrase release/recovery learning; original local drills. | No copied case studies/templates or Google-scale sufficiency claim. |
| W3C WCAG/WAI | Link criteria/guidance; original UI/testing scripts. | Follow W3C Document License; no partial-check conformance claim. |
| Atlas artifacts | Original workbook, studio, fixtures, evidence records. | Keep source links, versions, fixture provenance, boundaries, and limits nearby. |

### Asset policy

- Draw original architecture, trace, ADR, provenance, review, and recovery
  diagrams with text equivalents. Never screenshot or trace third-party course,
  standard, product, or incident material.
- Use original synthetic fixtures and label results as local fixture
  observations rather than claims about people or production.
- Do not embed credentials, private source details, CI logs containing secrets,
  user records, public issue content, agent transcripts, or third-party outputs
  without separate privacy/license review.
- Decoration must reveal—not conceal—scope, owner, source version, limitation,
  failure/recovery path, and unknown. A green badge is never an all-purpose
  release-ready signal.

---

## Workbook-author acceptance checklist

### Conceptual coherence

- [ ] Begins with need, stakeholder/owner, non-goal, authority boundary, and
  stop/failure condition—not a feature list, model, or tool.
- [ ] Returns to one vertical slice/evidence bundle; never becomes detached
  survey of GitHub, diagrams, DevOps, security, or AI tools.
- [ ] Retrieves M12–16 contracts/tests/data/transactions, M17 architecture,
  M18–21 systems/distributed boundaries, M22 trust/privacy, M23 language,
  M24 performance, and M25 human-centered decision boundaries as relevant.
- [ ] When a capstone makes an optimization, execution, formal, classical-AI,
  ML, or learning-theory claim, retrieves the exact M31–M36 evidence field,
  states its assumption/non-claim, and records the release consequence if it
  fails; unavailable authoring-only material narrows or defers the claim.
- [ ] Uses all six views and five maps to connect, not fragment, knowledge.
- [ ] Oral defense includes rejected alternative, evidence scope, owner,
  unknown, and recovery path.

### Evidence and release integrity

- [ ] Every map relation has source/test/config/execution evidence or explicit
  unknown label.
- [ ] Every ADR has context, options, decision, consequences, owner, status,
  confirmation/falsifier, and review/supersession path.
- [ ] Agent component is optional, fixed-context/redacted/proposal-only, with
  no direct authority/credentials/arbitrary tools/data selection/merge/deploy.
- [ ] Tests name fixtures/data scope, commands, versions, behavior/failure seam,
  result, and non-claim.
- [ ] Source, build input, artifact identity, dependency/composition,
  attestation if any, and verification stay distinct.
- [ ] Release card names source/artifact/version, owner, target, verification,
  known-good release, rollback trigger/path, state/data caveat, and follow-up.
- [ ] Residual advisories/uncertainties remain visible; never claim
  “security-clean,” “risk-free,” or unverified framework conformance.

### Human and production quality

- [ ] Default remains deterministic/synthetic with no personal data, live model
  prompt, secret, production telemetry, or automatic action.
- [ ] Privacy card names purpose, source, allowed use, retention/deletion,
  access, owner, and unknown—not legal compliance.
- [ ] Accessibility task includes keyboard/focus/semantic evidence,
  explanation/limitation, dismiss/override, scope, and unresolved issue.
- [ ] Local postmortem/drill is not falsely presented as real incident or
  resilience proof.
- [ ] Stewardship distinguishes private, public, open-source license,
  contribution route, security route, and maintainer capacity.
- [ ] All diagrams, prompts, fixtures, questions, release cards, and examples
  are original and source/rights notes remain nearby.

---

## Compact source index

### Architecture and decisions

- [ISO/IEC/IEEE 42010:2022](https://www.iso.org/standard/74393.html)
- [C4 model — diagrams](https://c4model.com/diagrams)
- [C4 model — notation](https://c4model.com/diagrams/notation)
- [CMU/SEI — Software Architecture Reconstruction](https://www.sei.cmu.edu/library/software-architecture-reconstruction-practice-needs-and-current-approaches/)
- [CMU/SEI — ATAM collection](https://www.sei.cmu.edu/library/architecture-tradeoff-analysis-method-collection/)
- [Michael Nygard — Documenting Architecture Decisions](https://www.cognitect.com/blog/2011/11/15/documenting-architecture-decisions)
- [MADR](https://adr.github.io/madr/)
- [MIT OCW 6.005 Software Construction](https://ocw.mit.edu/courses/6-005-software-construction-spring-2016/)

### Review, tests, provenance, and stewardship

- [GitHub PR reviews](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/reviewing-changes-in-pull-requests/about-pull-request-reviews)
- [GitHub CODEOWNERS](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners)
- [GitHub protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [GitHub review AI-generated code](https://docs.github.com/en/copilot/tutorials/review-ai-generated-code)
- [GitHub Actions Python CI](https://docs.github.com/en/actions/tutorials/build-and-test-code/python)
- [pytest fixtures](https://docs.pytest.org/en/stable/explanation/fixtures.html)
- [GitHub artifact attestations](https://docs.github.com/en/actions/how-tos/secure-your-work/use-artifact-attestations/use-artifact-attestations)
- [SLSA v1.2 requirements](https://slsa.dev/spec/v1.2/requirements)
- [NIST SP 800-218 SSDF](https://csrc.nist.gov/pubs/sp/800/218/final)
- [NIST SP 800-161 Rev. 1](https://csrc.nist.gov/pubs/sp/800/161/r1/upd1/final)
- [SPDX specifications](https://spdx.dev/use/specifications/)
- [GitHub repository best practices](https://docs.github.com/en/enterprise-cloud%40latest/repositories/creating-and-managing-repositories/best-practices-for-repositories)

### Operations, people, and AI boundaries

- [GitHub deployment environments](https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/manage-environments)
- [Google SRE — Release Engineering](https://sre.google/sre-book/release-engineering/)
- [Google SRE — Canarying Releases](https://sre.google/workbook/canarying-releases/)
- [NIST SP 800-61r3](https://csrc.nist.gov/pubs/sp/800/61/r3/final)
- [Google SRE — Postmortem Culture](https://sre.google/sre-book/postmortem-culture/)
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [WCAG-EM](https://www.w3.org/TR/wcag-em-2/)
- [WAI-ARIA APG](https://www.w3.org/WAI/ARIA/apg/)
- [NIST Privacy Framework](https://www.nist.gov/privacy-framework)
- [NIST AI RMF 1.0](https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-ai-rmf-10)
- [NIST AI 600-1 Generative AI Profile](https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence)

## Final research verdict

Module 26 makes the course's first-principles and AI-era philosophy operational.
The learner's final accomplishment is not a fluent demo or the fact that a
machine produced code. It is the ability to make a bounded technical claim that
another person can inspect, challenge, reproduce where appropriate, decline,
recover, and maintain:

~~~text
purpose + non-goal + accountable owner
    + as-built architecture / contract / decision evidence
    + independent review of every AI or human proposal
    + tests and observations matched to their actual claims
    + versioned source/build/artifact/release trail
    + privacy, security, accessibility, and human-impact boundary
    + known-good rollback and learning path
    + explicit limitation / next falsifier
    = a defensible versioned evidence bundle
~~~

That is the final standard: understand the system deeply enough to describe its
architecture, defend its tradeoffs, challenge automated output, release it with
a recovery path, and admit exactly what remains unknown.
