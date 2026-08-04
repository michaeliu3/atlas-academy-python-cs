# M35–M36 official calibration follow-up — 2026-08-02

## Scope and truth boundary

This is a narrow, source-calibration review of the actual M35/M36 authoring
workbooks, their delivery maps, companions, source research, and canonical
graph. It is **not** a learner-route review, an accessibility or human-pilot
review, a release decision, or evidence of learner mastery. Both modules are
still `authoring-only`, hidden from the reader, with `sourceMap: null`, no
studio, and an unrecorded release in
[`course-graph.v2.json`](../../content/course/course-graph.v2.json). Nothing
in this note unlocks M35, M36, M25, or M26.

The sources below were checked on **2026-08-02**. They calibrate intellectual
scope and sequencing; Atlas retains original prose, synthetic fixtures,
derivations, diagrams, prompts, and evidence cards. It must link and
paraphrase rather than copy course notes, assignments, solutions, figures,
videos, code, datasets, or assessment assets.

## Official calibration corpus

| Official source | What it calibrates here | Reuse / access boundary |
| --- | --- | --- |
| [MIT 6.036 — Introduction to Machine Learning](https://ocw.mit.edu/courses/6-036-introduction-to-machine-learning-fall-2020/) | Formulation, representation, over-fitting/generalization, supervised learning, and reinforcement-learning breadth. M35 is aligned to the *evidence-first* part of that progression, not the complete course survey. | Link-only. MIT OCW and individual asset notices govern any future reuse; no course asset was copied. |
| [CMU 10-301/601 — Introduction to Machine Learning](https://www.cs.cmu.edu/~mgormley/courses/10601/) | A high-standard bridge from expressive power and inductive bias through preprocessing, regularization/model selection, theory, experiment design, and ML systems. The stated prerequisites also support M35/M36's use of M28–M32 and M33 rather than silently reteaching them. | Link-only. Public course pages are a calibration route, not permission to reproduce course materials or a claim of CMU-equivalent instruction, grading, feedback, or outcomes. |
| [Stanford CS229 — current course page](https://cs229.stanford.edu/) and [archived public syllabus](https://cs229.stanford.edu/syllabus-new.html) | The supervised-model, neural-network, model-selection, learning-theory, unsupervised, and sequential-decision breadth against which M35 explicitly declares a compact boundary. The public syllabus also confirms a sequence from setup through optimization, evaluation, learning theory, and projects. | Link-only. The current course says its materials require Stanford affiliation; do not treat it as an open asset source or reproduce archived handouts/assignments. |
| [MIT 9.520 — Statistical Learning Theory and Applications](https://ocw.mit.edu/courses/9-520-statistical-learning-theory-and-applications-spring-2006/) | M36's population/empirical distinction, regularization, and generalization-bound scope. The course's stability/VC coverage shows why Atlas correctly calls its finite-class Hoeffding route a deliberately narrower first-principles card. | Link-only. The source is an upper-level graduate benchmark, not evidence that a six-session module supplies its full theorem or project sequence. |
| [MIT 6.7960 — Deep Learning](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/) | M35's backprop/autodiff entry point and M36's distinction among generalization theory, numerical execution, architectures, and out-of-distribution questions. Its broad architecture/application program confirms Atlas must not imply a full deep-learning survey. | Link-only. MIT OCW asset notices apply; Atlas's two-layer trace remains an original bounded reading exercise, not a substitute for the course's notes, projects, or framework work. |
| [Georgia Tech CS 7641 — Machine Learning](https://omscs.gatech.edu/cs-7641-machine-learning) | The connected supervised → unsupervised → sequential-decision progression and a portfolio of defensible analyses. It supports the later specialization routes, while reinforcing that M35/M36 should not pretend to complete all three strands in the accelerated core. | Link-only. Private repositories/Canvas and course assessments are not Atlas sources or delivery evidence. |
| [NIST AI RMF 1.0](https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-ai-rmf-10) | The limited governance vocabulary used in M35/M36: monitoring, response, and accountable human control are organizational evidence layers, not consequences of a score or theorem. | Link/cite only. It is voluntary, non-sector-specific guidance—not legal advice, certification, or deployment authorization. |

## Actual connected spine: alignment and boundaries

The workbooks' prerequisite maps agree with the canonical graph. The following
is an authoring assessment of the actual six-session content, not evidence that
the prerequisite material is published, understood, or accessible to a learner.

| Module / session | Existing first-principles move and inherited distinction | Calibration judgment |
| --- | --- | --- |
| **M35-S1** — representation | Uses M28 to make a representation collision a one-line limitation proof before a model name, then treats preprocessing and numerical conditions as part of `phi`. | Aligned with MIT/CMU/Stanford emphasis on formulation, representation, and inductive bias. Stronger than a catalog of embeddings because it makes discarded information inspectable. |
| **M35-S2** — formulation and baselines | Uses M34's task, information, cost, and decision-owner distinctions before comparing dummy/rule/simple learned alternatives; the equal-information family card distinguishes expressivity from selection or deployment claims. | Aligned and deliberately adapted. The existing breadth map already names linear, tree/rule, kernel, neural, unsupervised, and sequential families with their changed evidence contracts. No survey expansion is warranted. |
| **M35-S3** — evaluation | Uses M30 for target relation, group/time split, leakage, metric, calibration, selection reuse, and one synthetic shift. | Aligned with official-course model-selection/experimental-design standards. The existing split contract and equal-accuracy/different-probability card correctly prevent a score, Brier value, or reliability plot from becoming a population or decision claim. |
| **M35-S4** — objective and systems | Uses M31/M32 to derive Bernoulli negative log likelihood, distinguish regularization from selection, inspect finite differences/autodiff, and record reproducibility conditions. | Aligned with backpropagation and practical ML expectations. It is intentionally a readable trace rather than an unbounded framework-training assignment. |
| **M35-S5** — debugging | Uses M13/M30 to move from aggregate regression to a claim–probe–counterexample–owner matrix. | Well adapted to AI-era code/design review. It preserves observability and failure probes instead of pretending a dashboard diagnoses cause. |
| **M35-S6** — dossier and authority | Uses M22 to separate model documentation/evaluation from permission, legitimacy, or human authority; the dossier carries all six-session artifacts into M36. | Aligned with the NIST boundary and appropriately non-consequential/synthetic. No local learner-facing content correction found. |
| **M36-S1** — claim scope | Uses M29/M35 to distinguish `R_P(h)` from a finite empirical average and to name representation, loss, class, sampling, and procedure assumptions before calculation. | Aligned with MIT 9.520's theory-first standard while reducing notation load through a synthetic relation and an explicit scope sheet. |
| **M36-S2** — distinct gaps | Uses M29/M31/M35 to separate approximation, estimation/generalization, optimization, and operational reliability rather than treating a loss curve as a universal answer. | Aligned with CMU/MIT expectations; particularly valuable for reviewing AI-generated training claims. |
| **M36-S3** — theorem scope | Uses M33/M35 for a finite-class, bounded-loss, IID Hoeffding-plus-union-bound proof skeleton, PAC quantifiers, adaptive-selection repair, a dependent-sample counterexample, and an explicit non-claim. | Correctly calibrated as a *finite-class route*, not VC theory, arbitrary-neural-network theory, or a reliability certificate. Full MIT 9.520/6.7960 breadth remains optional/post-core depth. |
| **M36-S4** — systems evidence | Uses M32/M35 to separate a numerical-order observation and fixed-network trace from reproducibility or scientific-validity claims. | Aligned with MIT 6.7960's coupling of deep-learning theory and implementation, without overclaiming framework portability. |
| **M36-S5** — shift and monitoring | Carries M35's evaluation boundary into input-mixture, conditional/label-relation, and measurement/representation shifts; distinguishes input-time from delayed-label evidence and keeps threshold, owner, intervention, appeal, and stop boundary visible. | Strongly aligned with the reliability/monitoring goal. It appropriately rejects autonomous remediation and treats monitoring as a hypothesis with blind spots. |
| **M36-S6** — dossier and synthesis handoff | Integrates assumptions, gap ledger, theorem scope, reproduction record, and a human-controlled monitoring plan before the M25 preview-only handoff. | Aligned; the final artifact now preserves the Session 5 monitoring boundary below. The forward packet is not an unlock or deployment recommendation. |

## Resolved minimal learner-facing repair

**M36 final dossier now retains the monitoring timing and blind-spot
distinction learned in Session 5.**

Session 5 correctly requires the learner to label a monitor as *input-time* or
*delayed-label* evidence, name label availability/detection lag, compare two
shift mechanisms, and say which one a chosen observable can miss. In Session
6, the prior final dossier could ask only for a named perturbation, observable,
threshold, ownership, response, and stop boundary. A final artifact could
therefore omit the causal timing/boundary that prevents an input monitor from
being mistaken for immediate error detection.

The smallest warranted correction is now encoded in M36 Session 6's required
artifact 5, plus one matching acceptance-rubric phrase:

> **Suggested artifact wording:** “Name two declared synthetic shift
> mechanisms; mark the chosen observable as input-time or delayed-label
> evidence, state label availability/detection lag and one mechanism it can
> miss, then record the threshold, false-alarm/miss trade-off, owner,
> intervention, and stop boundary.”

> **Suggested rubric wording:** “The monitoring claim states its evidence
> timing, one blind spot, and the accountable response—not merely a metric and
> threshold.”

This is a dossier-preservation edit, not a new reliability unit, dashboard,
studio, or release gate. It makes the final evidence artifact match the
existing Session 5 lesson and the source-ledger's stated monitoring-plan
standard.

## Deliberate non-gaps and remaining evidence

- **Do not add full implementations of clustering, trees, kernels, RL,
  architectures, VC theory, stability theory, or deep-learning projects to
  M35/M36.** Official courses cover those topics over terms with feedback and
  broader practice. Atlas already labels them as optional depth or later
  specialization; adding them here would break the connected 60-day core.
- **Do not promote the workbooks on the basis of this review.** Their graph
  state, null canonical learner source maps, missing learner-facing delivery,
  accessibility review, designated-chat pilot, human source review, CI and
  release/provenance evidence remain separate open work.
- **Do not claim university equivalence or mastery.** This calibration shows
  comparable *scope discipline and reasoning standards* where Atlas actually
  teaches a topic; it cannot reproduce enrollment, teaching staff, peer work,
  feedback cycles, assessments, credit, or the broad term-long work in the
  cited courses.

## Conclusion

M35 and M36 are coherent, advanced **authoring candidates** with a sound
M28/M30/M31/M32/M33/M34 → M35 → M36 → M25 knowledge route. M35 needs no
content expansion in this pass. M36 received only the final-dossier preservation
repair above. The highest-value next work remains learner-delivery and review
evidence—not more metadata or a wider syllabus.
