# Module 25 — Evidence-Grounded Intelligent and Human-Centered Systems: Source-Audit Addendum

**Audit date:** 2026-07-31  
**Scope:** source ownership, claim linkage, current/version status, reuse
decisions, preview-route truth, bounded-model limits, learner-facing
corrections, and release-truth checks for the existing Module 25 workbook,
source map, visual-studio specification, and reference downloads.

## Status and delivery boundary

This is an instructor-facing, **authoring-only** audit record. It is not
learner-facing textbook copy, a human-quality approval, release evidence, or a
publication decision. It is **not a public learner download or
release-evidence-policy artifact**; it is not learner-downloadable. The
canonical M25 source map is likewise an authoring boundary rather than a
configured M25 learner download.

The non-promoting M25 structural packet now includes this addendum as a
**hashable internal release input**, deliberately allowed by its contract and
release-input ledger. That mechanical inclusion does **not** change M25's
legacy-audit status, human-review status, preview availability, route position,
release evidence, deployment state, or publication state. A Git-tracked path
or hash never automatically makes the canonical map or this addendum a
learner-facing delivery artifact.

M25 remains legacy-baseline material with preview availability in the canonical
graph. Its readability does not make it an unlocked final synthesis, a
completed project, a completed oral defense, or a handoff that can unlock
Module 26.

## Canonical route reconciliation

M25 has these **direct academic prerequisites** in the canonical graph:
**M22, M24, M30, M31, M34, M35, and M36**. Their transitive prerequisite and
evidence closure includes all M27–M36.

The full canonical route reaches M31 before M18–M24. The downstream navigation
segment from M24 is:

> **M24 → M32 → M33 → M34 → M35 → M36 → M25 → M26**

M24 is a required systems-evidence thread: it teaches that a runtime result
needs a named workload, mechanism, observation layer, and uncertainty boundary.
It is not M25's immediate previous-navigation route; M24 hands forward to M32.
The workbook's M27–M36 evidence spine is therefore coherent as a **transitive
closure**, not a second, contradictory list of direct prerequisites. M25's
forward connection to M26 remains preview-only until the advanced chain and
M25 itself have the evidence required by the canonical contract and release
policy.

## Source and reuse ledger

Each card records a narrow claim owner and a link/reuse decision. The default
is link and paraphrase; use original Atlas prose, diagrams, fixtures,
diagnostics, source annotations, and code. Public access does not grant a
license to copy a source's prose, figures, assignments, slides, recordings,
tests, solutions, datasets, or model outputs.

| ID | Owner/source and stable link | Claim linkage | Access, status, and reuse decision |
| --- | --- | --- | --- |
| **P25-01** | [scikit-learn model selection](https://scikit-learn.org/stable/model_selection.html), [common pitfalls](https://scikit-learn.org/stable/common_pitfalls.html#data-leakage), [calibration](https://scikit-learn.org/stable/modules/calibration.html), [model evaluation](https://scikit-learn.org/stable/modules/model_evaluation.html), [NDCG](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.ndcg_score.html), and [DummyClassifier](https://scikit-learn.org/stable/modules/generated/sklearn.dummy.DummyClassifier.html) | Sessions 2–4: fitting/evaluation separation, leakage, calibration scope, metric/denominator limits, ranking, and transparent baseline vocabulary. | The mutable stable route displayed **1.9.0** on 2026-07-31. It is not a reproducibility pin; executable use must name its installed version. scikit-learn is BSD-3-Clause; link/paraphrase and use original fixtures unless a later asset review records copied-code notices. Library documentation does not choose an Atlas time boundary, target, or policy. |
| **P25-02** | [NIST AI RMF 1.0 (AI 100-1)](https://doi.org/10.6028/NIST.AI.100-1), [Generative AI Profile (AI 600-1)](https://doi.org/10.6028/NIST.AI.600-1), [Privacy Framework](https://www.nist.gov/privacy-framework), and [SP 800-207](https://doi.org/10.6028/NIST.SP.800-207) | Sessions 1, 2, and 6: voluntary risk vocabulary, confabulation boundary, privacy/data-processing context, and distinct policy decision/enforcement roles. | Accessed 2026-07-31. NIST presented Privacy Framework 1.1 as an **Initial Public Draft**, not a final framework. Link/paraphrase; do not imply NIST endorsement, certification, legal advice, or a guarantee about a particular model/provider. Check each publication's notices before quotation or reuse. |
| **P25-03** | [WCAG 2.2](https://www.w3.org/TR/WCAG22/), [WAI-ARIA APG Disclosure](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/), and [accessible names/descriptions guidance](https://www.w3.org/WAI/ARIA/apg/practices/names-and-descriptions/) | Session 5: text alternatives, contrast/color, keyboard operation, focus, named controls, expanded state, and readable status/error paths. | Accessed 2026-07-31. Link/paraphrase under the applicable W3C document-license/notice route; do not copy substantial figures/tables or claim broad WCAG conformance from this module's checks. ARIA cannot make an unjustified recommendation meaningful or safe. |
| **P25-04** | [Model Context Protocol specification — 2025-11-25](https://modelcontextprotocol.io/specification/2025-11-25) and [Authorization — 2025-11-25](https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization) | Session 6: consent/control, untrusted tool metadata, tool-safety, capability/authorization, data exposure, and approval boundaries. | Accessed 2026-07-31. This is a dated protocol reading, not an Atlas dependency, implementation, or conformance claim. Link/paraphrase only; review the exact version and its license before implementation/reuse. Protocol requirements cannot prove a tool is harmless, content is true, or a user intended an effect. |
| **P25-05** | [OWASP Top 10 for Large Language Model Applications — v2025](https://owasp.org/www-project-top-10-for-large-language-model-applications/assets/PDF/OWASP-Top-10-for-LLMs-v2025.pdf) | Session 6: secondary vocabulary for prompt injection, insecure output handling, sensitive-information disclosure, excessive agency, and overreliance. | Accessed 2026-07-31. This is dated community guidance, not primary law, a formal standard, or a complete threat model. Link/paraphrase, observe current attribution terms, and never claim security compliance or immunity from a listed risk. |
| **P25-06** | [Järvelin & Kekäläinen (2002)](https://doi.org/10.1145/582415.582418), [Guo et al. (2017)](https://proceedings.mlr.press/v70/guo17a.html), [Gebru et al. (2018)](https://arxiv.org/abs/1803.09010), [Mitchell et al. (2019)](https://arxiv.org/abs/1810.03993), [Amershi et al. (2019)](https://doi.org/10.1145/3290605.3300233), and [Sculley et al. (2015)](https://proceedings.neurips.cc/paper_files/paper/2015/hash/86df7dcfd896fcaf2674f757a2463eba-Abstract.html) | Sessions 2–5: ranking/evaluation assumptions, calibration, documentation patterns, human-AI interaction, and system-level ML debt. | Original papers are used for their stated ideas and historical/empirical scope only. Link and narrowly paraphrase; do not copy figures, tables, datasets, experimental results, or paper prose as Atlas assets. A paper does not establish a benefit, calibration, fairness, or reliability result for Atlas. |
| **U25-01/U25-02** | [MIT 18.05](https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/), [Berkeley CS 188](https://inst.eecs.berkeley.edu/~cs188/), [Stanford CS229](https://cs229.stanford.edu/), [MIT 6.036](https://ocw.mit.edu/courses/6-036-introduction-to-machine-learning-fall-2020/), [Stanford IR book](https://nlp.stanford.edu/IR-book/), and the [Stanford CS221 catalog entry](https://bulletin.stanford.edu/courses/1057301) | Sequence and vocabulary for probability/statistics, search/decision, ML, ranking, and advanced study after the bounded local course model. | Public/course/catalog access and restrictions can change; CS221's catalog entry is not course material, and CS229 materials may be access-limited. Link only. Do not reproduce lectures, slides, assignments, solutions, autograders, starter code, recordings, grading schemes, or content beyond the applicable terms. These sources do not own Atlas's policy or evaluation claims. |
| **A25-model** | Atlas [reference model](../../public/downloads/module25_reference.py), [behavioral seams](../../public/downloads/test_module25_reference.py), and EvidenceGroundedStudio | Sessions 1–6: fixed contract rejection, leakage rejection, transparent ranking, score/probability boundary, evaluation card, override, and agent-proposal review. | Original course artifacts. They use small synthetic fixtures and no live model, provider, network, learner record, credential, database, or arbitrary tool/code/data path. They do not train/evaluate a real model, measure a learner, provide an accessibility certification, authorize a state change, or establish a production result. |

## Six-session claim linkage

This is a structural authoring crosswalk, not a human review of the workbook,
studio specification, diagnostic, accessibility, assessment, or psychology of
the learning flow.

| Session | Workbook anchor | Source/claim connection | Mandatory stopping line |
| --- | --- | --- | --- |
| **1 — A score is not a useful outcome** | Session 1 | P25-02/A25-model: decision owner, non-goal, human override, and a scoped review vocabulary come before model selection. | A filled decision contract or a model fixture does not show that a model is needed, useful, fair, approved, or ready to deploy. |
| **2 — Data becomes a claim through lineage** | Session 2 | P25-01/P25-02/P25-06/A25-model: availability time, leakage, data card, purpose, label, split, and privacy boundary. | A row, click, feature, pipeline, or random split does not establish a valid target, representative data, future benefit, or consent for another use. |
| **3 — Candidates, rankers, and models** | Session 3 | P25-01/P25-06/A25-model: baseline, candidate set, ranking trace, metric assumptions, and ML-system coupling. | A score, rank, or simple baseline is neither a probability, causal result, user benefit, nor permission to mutate learner state. |
| **4 — Evaluation, calibration, and uncertainty** | Session 4 | P25-01/P25-06/A25-model: target, split, denominator, reliability/calibration, uncertainty, and separate runtime-cost evidence. | A better metric or calibration card is scoped offline evidence, not a guarantee about an individual, a future distribution, accessibility, or authority. |
| **5 — Explanations, accessibility, and control** | Session 5 | P25-03/P25-06/A25-model: visible limitation, native/semantic controls, keyboard path, explanation, dismissal, and override. | A chart, tooltip, single automated test, or ARIA attribute alone does not establish usable explanation, broad conformance, or meaningful choice. |
| **6 — AI/agent proposals are not authorities** | Session 6 | P25-02/P25-04/P25-05/A25-model: redacted context, proposal/result validation, capability allowlist, separate policy, explicit approval, provenance, and fallback. | A retrieved/model/tool output, protocol, agent summary, or passing fixture cannot grant authority, prove a claim, supply consent, or make an external action safe. |

## Bounded reference-model and preview truth

The core **run_scenario** teaching model accepts only one enumerated scenario
name and returns a finite synthetic packet. It has no caller-provided prompt,
learner record, filesystem input, package/database/network access, external
model/provider, credential, arbitrary code/data, tool call, or state mutation
path. Its output is advisory evidence for a course discussion, not a trained
or calibrated model result.

The surrounding tooling is not literally no-I/O: the CLI parses one enumerated
argument, imports the checked-in local module, and writes one JSON packet to
standard output; the behavioral test harness imports the local model from a
checked-in path. Those bounded operations are local tooling I/O, not learner
data processing or model effects. The browser studio may retain optional
browser-local progress; it does not create a remote learner record or make a
Notion request. This audit does not treat that local storage as a deployment,
privacy-review, or shared-codec approval.

The preview's Studio, dossier, TA/Study Partner rehearsal, Session 6 packet,
and structurally mapped M25 oral-defense route remain preview-only instructional
material. They do not establish an operational learner-delivered studio or oral
outcome, learner mastery record, project acceptance, or M26 unlock merely
because files exist.

## Learner-facing correction record

1. The workbook/source map now distinguish M24's evidence contribution from
   navigation: M24 routes forward to M32, and M25 is gated synthesis after
   M31–M36. Direct prerequisites and their M27–M36 transitive closure are both
   named without inventing a bypass.
2. The source map now uses MCP **2025-11-25**, not the superseded 2025-06-18
   source card, and labels it as a protocol reading rather than Atlas
   conformance/implementation.
3. The audit records scikit-learn stable as observed **1.9.0**, NIST Privacy
   Framework 1.1 as an **Initial Public Draft**, and OWASP LLM Top 10 **v2025**
   as supplementary community guidance. None is a frozen executable pin or a
   certification source.
4. The runtime card now separates the fixed no-external-effect teaching model
   from its bounded CLI/test-harness local I/O.
5. Session 6 has a visible Session artifact anchor for a later structural
   packet. It is an output-location correction, not oral-defense, project,
   review, release, or publication evidence.

## Preserved audit ambiguities and review boundary

The immutable legacy audit marks M25's human quality as **not-reviewed** and
retains one **ambiguous** criterion: the preview-gated prerequisite/forward
map. Prediction, transfer,
confidence-diagnostic, and supportive-oral pointers are present structurally,
but a source ledger, version check, fixed local model, resolved anchor, or this
addendum does not substitute for qualified learner-facing review.

| Legacy criterion | Status that remains | Why this audit cannot promote it |
| --- | --- | --- |
| **prerequisite/forward map** | **ambiguous** | The canonical route is now stated accurately, but prerequisite evidence includes authoring-only M31/M34–M36 and preview gating remains; this is not learner-ready release evidence. |
| **rigor bundle**: definitions, assumptions, derivations/proof ideas, counterexamples, and numerical experiments | **pointer-present** | The visible workbook now has a bounded **Rigor card — conditional evidence-to-decision inference** with a five-item `0.8` fixture, stated assumptions, derivation, shifted-slice counterexample, and narrow decision consequence. This is a structural pointer only; it does not establish reviewed statistical correctness, accessibility, learner comprehension, release evidence, or mastery. |

The six-session spine, first-principles pointer, rigor-bundle pointer,
code-reading/debugging/design
pointers, prediction pointer, source-ledger pointer, accessible-visual/text
alternative pointer, retrieval pointer, project/rubric pointers, TA pointer,
Study Partner pointer, supportive-oral pointer, and forward handoff remain
structural pointers. This record neither changes their status nor upgrades the
remaining prerequisite/forward-map ambiguity into learner-facing review,
release evidence, or mastery.

## Release-truth checks and unresolved provenance

| Check | Current audit observation | Required action before an approval or release claim |
| --- | --- | --- |
| Source freshness | Stable/documentation pages, draft statuses, protocol revisions, community guidance, university access, and licenses can change. | Recheck direct URLs, editions, access dates, status, terms, and claim applicability at human review time. |
| Learner-visible source linkage | The workbook uses selected links/downloads; the canonical map and this addendum are authoring artifacts. | Review every learner-visible claim, link, visual, prompt, label, and download; deliberately decide any new delivery surface. |
| Asset/reuse inventory | No non-original external asset is approved by this audit. | Record owner, exact URL/version, access date, license/notice, attribution, modification, distribution decision, and reviewer for any shipped non-original asset. |
| Preview route | M25/M26 stay preview-only behind authoring-only prerequisite evidence. | Complete/review/release M31–M36, reweave M25, pass its own contract/provenance checks, then separately review M26. |
| Bounded model/studio | The local model and studio specification are deterministic teaching artifacts with bounded tooling/local progress behavior. | Run declared tests, inspect effects and UI interaction, record environment/results, and preserve course-model versus real-system distinctions. |
| Human quality/accessibility/oral review | The one preview-gated prerequisite/forward-map ambiguity and the structurally mapped but unreviewed M25 oral-defense route remain unresolved. | Preserve the exact statuses until qualified review records learner-facing evidence, including accessible interaction, cognitive clarity, and a supportive adaptive oral flow. |
| Provenance chain | A path, source card, test, or hash alone does not prove delivery, reviewability, CI, deployment, or a release. | Bind a reviewed Git commit, source ref, exact CI run, source review, limitations, and any verified deployment fact without changing publication by implication. |

## Evidence language for the later M25 synthesis

- A score, probability interpretation, rank, recommendation, decision,
  authorization, and state mutation are different claims with distinct
  evidence owners.
- An offline metric needs a target, population/time/split, denominator,
  baseline, uncertainty, and limitation; it is not a benefit, causal, fairness,
  deployment, or authority claim.
- Context, retrieval, tool metadata/output, and model output are untrusted
  data until a separate validation, policy, and explicit human-approval path
  constrains their use.
- A local course model can make evidence requirements inspectable; it cannot
  silently become a learner profile, trained model, production MLOps system,
  accessibility certification, external agent, or release approval.
