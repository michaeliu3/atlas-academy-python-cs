# Module 35 — Machine Learning & Representation: Primary-Source Research

## Status, scope, and non-publication boundary

**Status on 2026-07-31:** authoring-only research. This is a planning dossier,
not a learner workbook, canonical source map, module-contract record, release
record, assessment, studio, route change, or proof of learner competence.

The canonical graph currently describes M35 as **Machine Learning &
Representation**, `authoring-only`, `readerAccess: hidden`, with an
`unrecorded` release state, a `null` source-map field, no studio, and a v3 contract state
of `authoring-only`. Those facts remain unchanged. This note must not be used to
mark M35 published, review-ready, available, or complete.

In particular, this research does **not**:

- unlock M35, M36, M25, or M26;
- alter the graph, manifest, reader route, schedule, contract registry,
  release state, deployment record, or provenance approval; a deterministic
  hash refresh only identifies the changed checked-in research input and is
  not release evidence;
- establish that M31, M32, or M34 (all required M35 prerequisites) has been
  released with learner-ready evidence;
- grant reuse rights for a paper, code, dataset, checkpoint, figure, model
  card, benchmark, or documentation example;
- create a Codex Teaching Assistant or Study Partner handoff, conduct an oral
  defense, use GPT Live, write Notion notes, or demonstrate a voice/whiteboard
  interaction; or
- make a prediction, benchmark, calibration result, fairness result, model
  score, or deployment claim about any real population.

The intended future learner material remains subject to the full versioned
module contract, human review, accessibility checks, source review, privacy
boundary, CI, GitHub provenance, and release evidence. This note keeps those
requirements visible while collecting primary and first-party sources that a
future author can inspect.

## The connected teaching argument

M35 should not be a catalogue of model names. Its through-line is a bounded
claim about a learning system:

`data-generating process → representation → baseline/model → objective and training → evaluation under stated conditions → observable failure probes → human-controlled use boundary → M36`

The sequence links earlier modules rather than replacing them:

1. **M28** supplies geometry, projections, conditioning, and representation
   loss. A representation is a deliberate information-preserving and
   information-discarding map, not a discovered ground truth.
2. **M34** requires a problem formulation and classical baseline before a
   learned alternative. A rule, search, constraint, or dummy predictor reveals
   what added learning actually changes.
3. **M30** turns a dataset and split into a limited empirical statement; it
   supplies uncertainty, calibration, dependence, leakage, and shift language.
4. **M31** separates an optimization objective from a deployment objective.
   M35 makes that separation concrete in a model and training trace.
5. **M32** makes autodiff, execution, precision, random state, and
   reproducibility part of the system evidence rather than invisible framework
   magic.
6. **M13** turns an aggregate score into testable data/model/metric/operation
   claims with failure probes.
7. **M22** supplies provenance, authority, privacy, and human-impact
   boundaries that a loss, calibration curve, or model card cannot settle.

The direct academic handoff is **M36 — Statistical Learning Theory & Reliable
Deep-Learning Systems**. M35 should hand it an evidence packet, not an
unqualified assertion that a learned system generalizes or is ready for use.

## Exact canonical bridge and forward handoff

The table below mirrors the current canonical M35 bridge. It records planning
facts only; it does not certify the listed prerequisite modules or artifacts.

| Required prerequisite | First consuming M35 session | Required inherited distinction | Planned forward artifact |
| --- | --- | --- | --- |
| M13 — Software Engineering & Quality | M35-S05 | A passing pipeline or aggregate score is not a complete specification; data, model, metric, and operational claims need separate observations and failure probes. | `m35-ml-claim-test-observability-matrix` |
| M22 — Security, Privacy, Ethics & Software Responsibility | M35-S06 | Data permission, inference, human decision authority, privacy, and accountability are distinct boundaries. | `m35-data-authority-impact-boundary-map` |
| M28 — Linear Algebra, Numerical Stability & Representation | M35-S01 | Geometry, projections, factorization, conditioning, and loss of representation information have task-dependent consequences. | `m35-representation-assumption-sheet` |
| M30 — Probability, Statistics & Scientific Inference | M35-S03 | Sampling, split design, uncertainty, calibration, missingness, resampling, and dependence limit an evaluation claim. | `m35-evaluation-and-shift-plan` |
| M31 — Optimization & Information | M35-S04 | Objective, regularization, stochastic updates, and convergence language do not by themselves establish task success. | `m35-objective-optimization-generalization-trace` |
| M32 — Systems Languages, Scientific Python & Accelerators | M35-S04 | Tensor layout, precision, execution, autodiff, measurement, and environment variables belong in reproducibility evidence. | `m35-training-systems-reproducibility-card` |
| M34 — Classical AI: Search, Constraints & Decision | M35-S02 | A learned system does not remove the need for a formulation, baseline, cost/constraint analysis, or explanation boundary. | `m35-classical-learning-baseline-comparison` |

### Planned six-session spine

| Canonical session | Connected progression | Planned evidence |
| --- | --- | --- |
| **M35-S01 — Representation, inductive bias, and what a model can discard** | Make retained and lost structure visible before fitting a model; connect a feature/embedding choice to geometry and task assumptions. | Representation-assumption sheet |
| **M35-S02 — Problem formulation and classical baselines before learned models** | Compare rules, search/constraint methods, dummy predictors, and simple learned baselines to expose the real objective and decision boundary. | Classical-learning baseline comparison |
| **M35-S03 — Data-generating process, splits, metrics, uncertainty, and shift** | Turn a dataset into a bounded evaluation statement with population, leakage, calibration, subgroup, and future-shift limits. | Evaluation-and-shift plan |
| **M35-S04 — Learning dynamics: objectives, autodiff, optimization, and training systems** | Read training as coupled mathematics and systems behavior: objective, gradient, precision, optimizer trace, random state, and reproducibility. | Objective–optimization–generalization trace; training-systems reproducibility card |
| **M35-S05 — ML debugging, observability, and evidence that can fail usefully** | Specify claims, design slice/failure probes, and update beliefs from observations rather than chase one score. | ML claim–test–observability matrix |
| **M35-S06 — Responsible ML representation dossier and oral defense** | Defend a deliberately narrow design with representation, data authority, evaluation, systems evidence, uncertainty, and human-control boundaries. | Machine Learning & Representation Dossier; learner-controlled oral-defense summary |

The exact declared forward handoff is M36. The planned packet is:
**representation assumptions, baseline comparison, evaluation/shift plan,
objective/training trace, reproducibility record, and data-authority boundary
map.** M36 may use that packet to reason about learning-theory scope and
reliable deep-learning systems; it must not treat it as a generalization proof.

## Primary-source ledger and reuse boundary

S35-01–S35-16 were accessed on **2026-07-31**; S35-17–S35-21 were checked on
**2026-08-01**; S35-22–S35-24 were checked on **2026-08-02**; and S35-25–S35-26
were checked on **2026-08-03**. “Link-only” is deliberate: until a human reviews exact version,
license, third-party notices, data terms, and asset-specific rights, Atlas may
cite and link to a source but must create its own prose, figures, code,
datasets, derivations, tests, and examples. A source’s existence is not a
release approval.

| ID | Primary / first-party source | Why it belongs in M35; bounded claim linkage | License / reuse status for future authoring |
| --- | --- | --- | --- |
| S35-01 | Y. Bengio, A. Courville, and P. Vincent, [“Representation Learning: A Review and New Perspectives”](https://doi.org/10.1109/TPAMI.2013.50) (IEEE TPAMI, 2013) | Primary research framing for why representation choice and prior structure matter. Supports M35-C01 only under named task and data assumptions. | IEEE-hosted publication; **link/cite only**. No permission to copy prose, figures, tables, or examples is recorded. |
| S35-02 | [scikit-learn decomposition / PCA guide](https://scikit-learn.org/stable/modules/decomposition.html) | First-party implementation documentation for a bounded PCA/code-reading contrast: components, preprocessing, solver, input, and version affect what an API call means. | [BSD-3-Clause project license](https://github.com/scikit-learn/scikit-learn/blob/main/COPYING); link-only/original fixtures. Recheck doc/API version before a lesson. |
| S35-03 | M. Zinkevich, [“Rules of Machine Learning: Best Practices for ML Engineering”](https://developers.google.com/machine-learning/guides/rules-of-ml) | First-party engineering guidance for baseline-first, observable metric, training-serving, and operational-boundary discussion. It supports M35-C02, C06, and C08 as guidance, not as a theorem. | Google-hosted documentation; **link/cite only**. Do not copy rules, examples, screenshots, or imply Google endorsement. |
| S35-04 | [scikit-learn `DummyClassifier` reference](https://scikit-learn.org/stable/modules/generated/sklearn.dummy.DummyClassifier.html) | First-party API reference showing a predictor that ignores input features and is intended as a simple baseline. Supports a transparent baseline comparison in M35-S02. | BSD-3-Clause project; link-only/original code and expected-output fixtures. Pin version and avoid copied documentation examples. |
| S35-05 | [scikit-learn cross-validation guide](https://scikit-learn.org/stable/modules/cross_validation.html) | First-party reference for split mechanisms and the fact that the choice of split is part of evaluation design. Supports M35-C03, not an IID or deployment guarantee. | BSD-3-Clause project; link-only/original split diagrams and synthetic fixtures. Recheck version and estimator-specific behavior. |
| S35-06 | [scikit-learn common pitfalls: inconsistent preprocessing and data leakage](https://scikit-learn.org/stable/common_pitfalls.html) | First-party source for the concrete warning that preprocessing learned using test information can make estimates optimistic. Supports the M35-S03 leakage counterexample. | BSD-3-Clause project; link-only/original experiment. Do not copy the documentation’s code, figure, or result. |
| S35-07 | C. Guo et al., [“On Calibration of Modern Neural Networks”](https://proceedings.mlr.press/v70/guo17a.html) (ICML/PMLR, 2017) | Original research source for a precise calibration discussion and bounded post-hoc temperature-scaling comparison. Supports M35-C04; it is not a guarantee outside a stated evaluation population. | Proceedings paper; **link/cite only**. Treat copyright/reuse as unreviewed; derive original calibration examples and diagrams. |
| S35-08 | Y. Ovadia et al., [“Can You Trust Your Model’s Uncertainty? Evaluating Predictive Uncertainty Under Dataset Shift”](https://proceedings.neurips.cc/paper_files/paper/2019/hash/8558cb408c1d76621371888657d2eb1d-Abstract.html) (NeurIPS, 2019) | Original empirical evidence that calibration and uncertainty behavior must be checked under shift, not inferred from one IID result. Supports M35-C05 with its benchmark’s scope retained. | NeurIPS-hosted paper; **link/cite only**. Do not reuse figures, benchmark outputs, data, code, or claims as Atlas results. |
| S35-09 | [PyTorch autograd mechanics](https://docs.pytorch.org/docs/stable/notes/autograd.html) | First-party framework explanation of reverse-mode operation-history graphs. Supports M35-C07’s distinction between computing a gradient and validating an objective. | [PyTorch BSD-3-Clause license](https://github.com/pytorch/pytorch/blob/main/LICENSE); link-only/original trace diagrams and finite-difference checks. Pin framework release. |
| S35-10 | [PyTorch reproducibility note](https://docs.pytorch.org/docs/stable/notes/randomness.html) | First-party warning that identical seeds do not promise identity across releases, commits, platforms, or CPU/GPU configurations. Supports M35-C07. | PyTorch BSD-3-Clause; link-only/original environment card. Recheck exact release and hardware-specific limitations. |
| S35-11 | E. Breck et al., [“What’s Your ML Test Score? A Rubric for ML Production Systems”](https://research.google/pubs/whats-your-ml-test-score-a-rubric-for-ml-production-systems/) (2016) | Original authors’ production-readiness rubric for testing and monitoring. Supports M35-C08 as a diagnostic framing, not a certification scheme. | Google Research / workshop record; **link/cite only**. No asset reuse or certification claim. |
| S35-12 | E. Breck et al., [“Data Validation for Machine Learning”](https://research.google/pubs/data-validation-for-machine-learning/) (SysML, 2019) | Primary systems paper on data validation and training/serving anomalies. Supports M35-C08’s data-observability and failure-probe plan. | Google Research record; **link/cite only**. Do not import code, schemas, metrics, or production claims. |
| S35-13 | M. Mitchell et al., [“Model Cards for Model Reporting”](https://research.google/pubs/model-cards-for-model-reporting/) (2019) | Original proposal for documenting use context, evaluation procedures, and relevant slices. Supports M35-C09’s documentation boundary. | Google Research / publisher record; **link/cite only**. A model-card-shaped document is not automatically truthful, sufficient, or deployable. |
| S35-14 | NIST, [Artificial Intelligence Risk Management Framework (AI RMF 1.0), NIST AI 100-1](https://doi.org/10.6028/NIST.AI.100-1) (2023) | Official framework for naming governance, mapping, measurement, and management activities. Supports M35-C09’s authority and accountability separation. | NIST publication. **Link/cite only pending exact reuse and third-party-material review**; its voluntary framework is not legal, domain, or approval authority. |
| S35-15 | D. Sculley et al., [“Hidden Technical Debt in Machine Learning Systems”](https://research.google/pubs/hidden-technical-debt-in-machine-learning-systems/) (NeurIPS, 2015) | Original systems paper for coupling, data dependencies, and debt discussion. Supports M35-C08’s architectural-observability lens. | Google Research / proceedings record; **link/cite only**. Do not reproduce figures or interpret a cited risk as evidence of a particular Atlas defect. |
| S35-16 | MIT OpenCourseWare, [6.036 Introduction to Machine Learning (Fall 2020)](https://ocw.mit.edu/courses/6-036-introduction-to-machine-learning-fall-2020/) | Official university-course benchmark for future scope review: supervised learning, model selection, neural networks, and learning-system reasoning. It is a coverage reference, not a replacement course or a source of copied teaching assets. | Check the course’s displayed [MIT OCW license terms](https://ocw.mit.edu/help/faq-fair-use/) and individual asset notices before reuse. Atlas should link and create original material. |
| S35-17 | Carnegie Mellon University, [10-301/601 Introduction to Machine Learning](https://www.cs.cmu.edu/~mgormley/courses/10601/) | Official university-course benchmark for problem formulation, regularization, model selection, and formal guarantees with their limits. Supports M35-S04’s fixed regularization/selection card. | Course material is **link/cite only**. Do not copy lectures, assignments, solutions, figures, or data; create original Atlas derivations and examples. |
| S35-18 | Stanford, [CS229 Machine Learning course materials](https://cs229.stanford.edu/materials.html-full) | Official course-material route for supervised learning, learning theory, and regularization/model selection sequencing. Supports M35-S04 scope review, not a claim of course equivalence. | **Link/cite only**. Some material may have its own access or reuse constraints; do not copy notes, assignments, figures, or solutions. |
| S35-19 | Georgia Tech, [CS 7641 Machine Learning](https://omscs.gatech.edu/cs-7641-machine-learning) | Official course route for connected supervised, unsupervised, and sequential-decision analysis with defensible reports. Supports M35’s dossier and scope-gap review. | **Link/cite only**. Atlas does not reproduce course reports, private repositories, feedback, or term-long project work. |
| S35-20 | [scikit-learn probability calibration guide](https://scikit-learn.org/stable/modules/calibration.html) | First-party documentation for separating a named population calibration relation from a finite reliability estimate. Supports M35-C04 and M35-S03; it does not make a finite card a calibration guarantee. | BSD-3-Clause project; link-only/original reliability tables and explanations. Recheck the documentation/API version before a concrete implementation claim. |
| S35-21 | [scikit-learn `brier_score_loss` reference](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.brier_score_loss.html) | First-party API reference for the Brier-score convention used only as a bounded finite probabilistic-forecast loss reading card. Supports M35-S03; a lower score alone is not a population-calibration ranking or decision policy. | BSD-3-Clause project; link-only/original fixed cards. Recheck the version and score convention before a concrete API claim. |
| S35-22 | MIT OpenCourseWare, [18.642 Lecture 23: Introduction to Machine Learning](https://ocw.mit.edu/courses/18-642-topics-in-mathematics-with-applications-in-finance-fall-2024/resources/mit18_642_f24_lec23/) | Official lecture route for the fit/train, validation comparison, and final held-out test distinction. Supports M35-S03's original fixed-partition trace and its leakage repair, not an IID, generalization, or deployment guarantee. | MIT OCW assets have their own notices; link-only/original Atlas rows, derivation, and code. Do not copy the lecture slides, prose, examples, or exercises. |
| S35-23 | Carnegie Mellon University, [10-315 *A Course in Machine Learning*, Chapter 1](https://www.cs.cmu.edu/~10315-s24/notes/ciml-v0_99-ch01.pdf) | Official course notes that define a learning problem with a loss and unknown data-generating distribution, distinguish sampled training data from expected future loss, and make the data relation explicit. Supports M35-C03's named synthetic generator/evaluation interpretation; it does not validate Atlas's particular rows or expected-accuracy calculation. | Course notes are **link-only/original-paraphrase**. Do not copy prose, figures, exercises, or examples; retain only Atlas's original generator, derivation, and fixture. |
| S35-24 | MIT OpenCourseWare, [6.7960 Lecture 17: Out-of-Distribution Generalization](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/mit6_7960_f24_lec17.pdf) | Official lecture route for separating the standard same-distribution setting from named deployment shifts, including label/measurement/location changes and features whose correlations need not persist. Supports M35-C05 and the M35-S03 shift interpretation, not a claim that accuracy must decline under every shift. | MIT OCW material is **link-only/original-paraphrase** pending asset review. Do not copy slides, images, examples, or empirical claims; use original Atlas diagrams and deterministic calculations. |
| S35-25 | UC Davis, [Bootstrap methods](https://cameron.econ.ucdavis.edu/slides/bootstrap_2022.pdf) | University lecture route for making the independent sampling unit explicit and distinguishing ordinary resampling from clustered or serially dependent settings. Supports M35-S03's original sampling-unit card, not a universally valid confidence interval or block rule. | **Link/cite only**; no permissive reuse status was identified. Do not copy slides, figures, worked examples, or prose. Keep Atlas's rows, calculation, and boundary original. |
| S35-26 | TensorFlow, [`sigmoid_cross_entropy_with_logits`](https://www.tensorflow.org/api_docs/python/tf/nn/sigmoid_cross_entropy_with_logits) | First-party derivation of an overflow-resistant logit-space binary cross-entropy form. Supports M35-S04's original code-reading card about numerical path versus loss identity; it does not support a calibration, generalization, or deployment claim. | TensorFlow documentation is CC BY 4.0 and code samples Apache 2.0; this Atlas card remains original and link/cite only pending full asset review. Preserve applicable attribution if any source asset is later reused. |

| S35-27 | scikit-learn, [Support Vector Machines](https://scikit-learn.org/stable/modules/svm.html) | First-party implementation reference for reading kernels, margins, regularization, scaling, and support-vector configuration. Supports the bounded M35-S02 SVM code-reading card, not a theorem about separation or a recommendation for deployment. | BSD-3-Clause project; link-only/original objective and configuration cards. Recheck API/version before making a concrete implementation claim. |
| S35-28 | scikit-learn, [Gradient Boosting](https://scikit-learn.org/stable/modules/ensemble.html#gradient-boosting) | First-party implementation reference for stagewise additive fitting, learning-rate/estimator trade-offs, base-learner depth, and early stopping. Supports the bounded M35-S02 boosting reading card, not a generalization or calibration guarantee. | BSD-3-Clause project; link-only/original update equations and configuration traces. Recheck API/version before a learner-facing code claim. |

### Targeted 2026-08-02 calibration

- **M35-S03 / M35-C03:** S35-23 routes the learner to an official account of
  an explicit data-generating distribution, sampled training data, and expected
  future loss. The Atlas signal/context label relation and any fixed
  train/validation/fresh-evaluation rows must remain an **original, named toy
  generator**, not an implied property of the source.
- **M35-S03 / M35-C05:** S35-24 routes the learner to the distinction between
  same-distribution evaluation and a named shift. Atlas must derive its
  signal-only expected-accuracy change from the stated synthetic relation and
  context frequencies, then label it a bounded calculation—not a robustness,
  deployment, or universal direction-of-change claim.

### Targeted 2026-08-04 model-family breadth closure

- **M35-S02 / M35-C02:** S35-16–S35-19 calibrate the connected
  supervised-learning sequence; S35-27 and S35-28 provide first-party API
  anchors for an original bias–variance, SVM, and boosting reading card.
  The learner must still name the information, representation, objective,
  selection budget, and evaluation relation before comparing families.
- **M35-S03/M35-S05 / M35-C04/C08:** the ranking and one-component ablation
  cards are evidence-design scaffolds. They do not convert a score ordering or
  component intervention into a causal, population, or deployment claim.

### Targeted 2026-08-03 M35-S06 preflight calibration

- **M35-S06:** [MIT 6.036](https://ocw.mit.edu/courses/6-036-introduction-to-machine-learning-fall-2020/)
  and [CMU 10-301/601](https://www.cs.cmu.edu/~mgormley/courses/10601/)
  were rechecked on 2026-08-03. The original synthetic preflight asks the
  learner to separate data relation, split/selection/fresh-evaluation evidence,
  metric/slice/cost, and decision authority before narrowing an AI-generated
  claim. This adapts the courses' representation/generalization and experiment-
  design expectations; it does not copy course material or establish a trained,
  deployed, calibrated, or authorized system.

### Targeted 2026-08-03 sampling-unit and stable-logit calibration

- **M35-S03 / M35-C03:** S35-25 supports an original card in which a learner
  declares the independently sampled object before interpreting a resampling or
  standard-error calculation. Atlas must state its IID Bernoulli-loss premise,
  then change the data relation to repeated entities or serial dependence. The
  repair is a separately justified independent-unit/dependence-aware plan or a
  withdrawal of the earlier interpretation—not a universal bootstrap,
  confidence-interval, or deployment claim.
- **M35-S04 / M35-C06:** S35-26 supports an original derivation from binary
  negative log likelihood to the stable logit-space expression
  \(\max(z,0)-zy+\log(1+\exp(-|z|))\). The card must distinguish exact loss
  algebra from finite-precision execution and must not imply that stable loss
  evaluation validates labels, data splitting, calibration, generalization, or
  use.

### What this ledger does *not* establish

The ledger does not establish that any source is exhaustive, current for a
future library release, legally reusable in a given jurisdiction, statistically
applicable to a future dataset, or suitable for a particular consequential use.
It deliberately avoids unreviewed datasets, model weights, third-party
benchmark packages, executable notebooks, and copied visual assets. A future
canonical source map must map every learner-facing claim, formula, source
excerpt, code sample, visual, dataset, and numerical experiment to a reviewed
source or original derivation.

## First-principles definition and derivation sheet

These are authoring aids, not final lesson text. They are written from first
principles so future materials can explain why each quantity is present and
where the inference stops.

1. **Data-generating setting.** Let (P_{\mathrm{target}}(X,Y)) name the
   intended population/time/process relation, not merely the downloaded table.
   A finite observed dataset (D=\{(x_i,y_i)\}_{i=1}^{n}\) is a sample with a
   collection, labeling, missingness, and dependence history. A future lesson
   must name that history before treating (D) as interchangeable with a
   target population.
2. **Representation and inductive bias.** A representation is a chosen map
   \(\phi_\theta: \mathcal X\to\mathcal Z\), followed by a predictor
   \(g_w: \mathcal Z\to\mathcal Y\). The composed predictor is
   \(f_{\theta,w}=g_w\circ\phi_\theta\). Architecture, feature engineering,
   preprocessing, invariances, loss, regularization, optimizer, and stopping
   rule each constrain which functions are easy or hard to fit. They are
   inductive choices, not evidence that \(\mathcal Z\) contains the
   semantically correct factors.
3. **A simple discard argument.** If two inputs (x_a,x_b) satisfy
   \(\phi(x_a)=\phi(x_b)\) but the target-relevant action differs, then every
   deterministic downstream (g\circ\phi\) gives the same output to both.
   This proves a limitation of that representation *for that declared task and
   pair*; it does not prove that a higher-dimensional or learned representation
   is universally better.
4. **Objective versus target risk.** For a stated loss \(\ell\), training
   often minimizes
   \[
   \widehat R_{\mathrm{train}}(f)=\frac{1}{n}\sum_{i=1}^{n}\ell(f(x_i),y_i)
   \quad\text{or}\quad
   \widehat R_{\mathrm{train}}(f)+\lambda\Omega(f).
   \]
   A decrease in this number is evidence about that data, loss,
   regularizer, numerical procedure, and observation—nothing more by itself.
   To connect it to a target risk \(R_{\mathrm{target}}(f)\), a future claim
   needs assumptions about sampling, target relation, split/selection,
   measurement, and model-selection procedure.
5. **Evaluation and calibration.** A metric maps predicted outputs and labels
   to a summary. Accuracy answers a different question from a proper score,
   error cost, subgroup measure, or calibration relation. For a probabilistic
   binary predictor \(\hat p(X)\), an ideal calibration statement has the
   conditional form \(\Pr(Y=1\mid\hat p(X)=q)=q\) for a named population and
   applicable values of \(q\). A binned empirical diagram estimates a limited
   version of that relation; it does not make the output a warranted belief or
   authorize a decision.
6. **Distribution shift.** If \(P_{\mathrm{train}}(X,Y)\ne
   P_{\mathrm{deploy}}(X,Y)\), then a result estimated under a training/held-out
   relation does not automatically identify deployment behavior. The notation
   tells the learner what changed; it does not diagnose the mechanism, bound
   loss, or choose a remedy.
7. **Training dynamics and autodiff.** Given a differentiable implemented
   scalar objective \(L(\theta)\), a first-order update can be written
   \(\theta_{t+1}=\theta_t-\eta_t\nabla_\theta L(\theta_t)\). Reverse-mode
   autodiff can efficiently compute derivatives of the implemented graph under
   its framework rules. A finite-difference comparison tests a local
   implementation claim; neither method proves that the loss represents the
   task, that an update is stable, or that a stationary point generalizes.
8. **Observability.** A claim such as “the system works” is underspecified.
   Break it into: data validity, feature/representation behavior, model output,
   metric/slice evidence, serving behavior, and human-action boundary. For each
   one, record an observable, a failure probe, an owner, and a response rule.

## Claim, assumption, derivation, and counterexample ledger

| ID | Bounded claim | Assumptions that must be named | Derivation / prediction-before-reveal move | Counterexample or non-claim |
| --- | --- | --- | --- |
| M35-C01 | A representation can make selected distinctions accessible to a downstream model while collapsing others. | Input measurement, preprocessing, map \(\phi\), task/label, population, downstream hypothesis class, and loss. | Give two points with the same representation; predict whether any deterministic downstream rule can separate their differing desired labels. Derive the answer from \(g(\phi(x_a))=g(\phi(x_b))\). | A representation that performs well on a training task can discard a subgroup, future, causal, or safety-relevant distinction. “Embedding” does not mean semantic truth. |
| M35-C02 | A dummy, rule, search, or simple linear baseline gives a comparison point only when its inputs, split, tuning budget, decision policy, and metric are aligned with the learned alternative. | Shared data provenance, feature availability time, split, preprocessing, hyperparameter search budget, metric, cost, and inference constraints. | Before seeing a score, ask what the no-feature or rule baseline is allowed to see and which error it makes predictably. | A weak or mismatched baseline can flatter a complex model; a baseline win does not establish deployment value or eliminate the need for monitoring. |
| M35-C03 | An empirical evaluation estimates behavior under its named data relation and selection procedure; split design can leak information or misrepresent a dependent future population. | Target population/time, unit of independence, split rule, preprocessing-fit boundary, tuning/selection steps, sample size, metric, and uncertainty method. | Compare “fit scaler before split” with “fit scaler inside training folds.” Predict which path exposes held-out statistics to training and why the score can be optimistic. | Random row splitting can overstate performance when repeated entities, time order, geography, or correlated records cross folds. A held-out score is not automatically unbiased for deployment. |
| M35-C04 | Accuracy, loss, calibration, ranking, subgroup behavior, and decision cost are distinct evaluations; calibration is a conditional population relation, not merely a high score. | Outcome/label definition, probability semantics, population, binning or estimator, confidence interval, slice policy, cost/threshold, and selection history. | Construct two classifiers with the same accuracy but different predicted probabilities; predict which reliability diagram can reveal miscalibration. | A 90% accurate classifier can be badly calibrated, and a well-calibrated score can still be useless under asymmetric costs, abstention needs, or shift. |
| M35-C05 | Validation under one distribution does not prove uncertainty quality, calibration, or error control under another distribution. | Source/deployment distributions, shift type, labeled evaluation availability, model/uncertainty method, metric, threshold, and temporal/environmental scope. | Keep model weights fixed while changing one synthetic nuisance or class prior; predict which observed metric can change and state what the experiment cannot isolate. | Post-hoc calibration that looks good IID can degrade under shift. One synthetic shift does not establish robustness to all shifts or identify a causal failure mechanism. |
| M35-C06 | A decrease in a declared training objective shows progress on the implemented optimization problem, not necessarily on target risk, calibration, fairness, usefulness, or authorization. | Exact loss/objective, regularizer, optimizer, schedule, precision, seed, stopping rule, data order, comparator, and target claim. | Read a one-step gradient trace and predict which scalar is guaranteed to be observed versus which deployment claim remains unsupported. | Training loss can fall while validation loss rises; a stationary gradient can occur at an unsuitable objective, saddle, numerical limit, or local solution. |
| M35-C07 | Autodiff and determinism settings provide bounded execution evidence, but framework gradients and a fixed seed do not make a result cross-platform reproducible or conceptually valid. | Framework/library/driver versions, hardware, dtype, deterministic settings, all random generators, data order, worker behavior, input identity, and tolerance. | Compare an analytic gradient to a central finite-difference estimate at one declared point; then predict which implementation mismatches that comparison can and cannot reveal. | Same seed can yield different results across versions/platforms; matching a gradient does not validate labels, representation, loss, optimizer, or deployment meaning. |
| M35-C08 | ML debugging improves when data, feature, model, metric, and operation claims have distinct observables, slices, failure probes, and response boundaries. | Claim owner, observable, data/model version, slice/threshold, freshness, alert policy, test oracle, and remediation authority. | Give a score regression with unchanged aggregate accuracy. Ask for a probe that distinguishes stale data, leakage, threshold change, subgroup shift, and serving skew before proposing a fix. | A dashboard without a decision rule is not observability; one passing end-to-end test does not prove data quality, causal explanation, or safe future operation. |
| M35-C09 | Documentation can make intended use, evaluation conditions, limitations, and governance questions inspectable, but it does not confer consent, fairness, legal authority, or safety. | Data provenance/terms, intended and prohibited use, affected parties, decision owner, human review/escalation, privacy/security controls, policy/law, and appeal/revision route. | Ask which statement in a proposed model card is observed evidence, which is an assumption, and which requires accountable human authority. | A model card, risk framework, or fairness metric cannot itself authorize a high-impact decision or establish legitimacy for an affected population. |

## Likely six-session source routing

This is a source-conscious authoring plan, not a completed six-session module.
Every future session still needs its own structured contract evidence, visible
outputs, original diagrams/text alternatives, diagnostics, retrieval records,
project rubric, TA/Study Partner prompt, and release proof.

| Canonical session and prerequisites | Source route | Understanding-first / code-reading move | Planned artifact and explicit non-claim |
| --- | --- | --- | --- |
| **M35-S01 — Representation, inductive bias, and what a model can discard** (**M28**) | S35-01, S35-02 | Start with a small original two-feature synthetic setting. Before any model is fitted, ask the learner to predict what a projection retains and loses; code-read a PCA/feature pipeline for centering, shape, solver, and component-count assumptions. | **Representation-assumption sheet.** It does not claim that PCA, an embedding, or more dimensions reveal semantically right features or preserve what a later task needs. |
| **M35-S02 — Problem formulation and classical baselines before learned models** (**M28, M34**) | S35-03, S35-04, S35-16–S35-19 | Present a narrow problem statement and an AI-generated model proposal. Hold the raw-input contract fixed across a single affine threshold, an engineered interaction, and a fixed two-ReLU card; then name the selection boundary before calling any score “test.” | **Classical-learning baseline comparison plus equal-information family card.** It does not claim a complex model is needed, a benchmark win is meaningful, a constructed toy rule was learned, or a baseline is operationally acceptable. |
| **M35-S03 — Data-generating process, splits, metrics, uncertainty, and shift** (**M30**) | S35-05–S35-08, S35-20–S35-24 | Code-read two deliberately near-identical evaluation pipelines; one leaks a fitted transform or entity/time information. Predict the optimistic path, then inspect metric/slice/calibration behavior under an explicit synthetic shift and derive its expected accuracy from the named toy generator. | **Evaluation-and-shift plan.** It does not estimate real-world performance, certify calibration, or replace domain-specific data/governance review. |
| **M35-S04 — Learning dynamics: objectives, autodiff, optimization, and training systems** (**M28, M31, M32**) | S35-03, S35-09, S35-10, S35-17–S35-19 | Derive one Bernoulli negative-log-likelihood card and one fixed ridge-shrinkage card, then read an original scalar loss trace and a fixed two-parameter-layer ReLU forward/backward trace with a visible zero-gradient path. Predict whether a finite-difference check, chain-rule calculation, loss decrease, or reused validation score validates a named stronger claim. | **Objective–optimization–generalization trace and reproducibility card.** They do not establish convergence, framework correctness, portability, generalization, or a correct objective. |
| **M35-S05 — ML debugging, observability, and evidence that can fail usefully** (**M13, M30**) | S35-03, S35-11, S35-12, S35-15 | Diagnose an aggregate-score regression using a small original evidence table. Require the learner to choose a data, representation, model, metric, slice, or serving probe before requesting a model change. | **ML claim–test–observability matrix.** It does not certify a pipeline, identify a root cause from one chart, or turn monitoring into autonomous action. |
| **M35-S06 — Responsible ML representation dossier and oral defense** (**M13, M22, M28, M30, M31, M32, M34**) | S35-01–S35-21 | Assemble a deliberately synthetic, bounded dossier. The learner criticizes an AI-generated claim, repairs an assumption, explains a counterexample, and specifies abstention/escalation. A future TA conversation must use supportive questions, hint ladders, transfer, and learner-controlled evidence—not pass/fail verdicts. | **Machine Learning & Representation Dossier and learner-controlled oral-defense summary.** It is neither an automatic unlock nor evidence of a live chat, Notion write, deployed model, external approval, or mastery. |

Each future session should include prediction before reveal, first-principles
explanation, code-reading/debugging/design inspection, a counterexample,
retrieval and spaced-review prompt, transfer task, and visible learner
artifact. AI assistance may generate hypotheses, but it cannot fill missing
data provenance, experimental controls, authority, or evidence.

## Misconception and repair map

| Likely misconception | Productive repair / retrieval prompt |
| --- | --- |
| “The model learns the important features automatically.” | Name \(\phi\), its inputs, the task, information it collapses, and a pair of inputs it cannot distinguish after representation. |
| “A high-dimensional embedding keeps all useful information.” | Ask “useful for which target, population, time, and downstream hypothesis class?” Then require one retained and one discarded direction. |
| “A complex learned model is the serious solution; a baseline is trivial.” | Specify a rule, dummy, or simple baseline with the same data/split/metric and state what comparison would change your belief. |
| “Cross-validation makes evaluation unbiased.” | Ask what is independent, when each feature is available, when transforms are fit, and whether entities/time can cross folds. |
| “Accuracy and confidence are almost the same thing.” | Construct two models with equal accuracy and different confidence distributions; state what calibration relation each violates or satisfies. |
| “Calibration on a held-out set means I can trust confidence in deployment.” | Name \(P_{\mathrm{train}}\), \(P_{\mathrm{test}}\), and \(P_{\mathrm{deploy}}\); introduce one shift and state the missing evidence. |
| “Lower training loss proves the model improved.” | Separate objective, optimization trace, validation observation, target risk, decision impact, and authority boundary. |
| “Autodiff is mathematical proof that the model is correct.” | Ask what function was differentiated, at which input/dtype/framework state, and what a finite-difference comparison cannot test. |
| “One seed makes training reproducible.” | List code/data/dependency/driver/hardware/precision/worker variables and define the exact equality or tolerance claim. |
| “A model card or AI RMF checklist makes the system responsible.” | Identify who has decision authority, who can intervene or appeal, what is prohibited, and which issue requires human/domain governance rather than a metric. |

## Bounded project and numerical-experiment plan

The future project should be a **synthetic signal-routing dossier**, not a
production model or a decision system about people. It may use an original,
checked-in generator for invented sensor states, messages, and labels. It must
not ingest personal, proprietary, medical, employment, education, financial,
biometric, or consequential decision data; call external services; recommend
or execute an external action; or ship learned weights.

### Proposed project question

For a named synthetic population and a stated simulated future shift, when does
a representation-plus-classifier outperform a dummy/rule/simple baseline on a
pre-registered metric—and what evidence is still missing before anyone could
rely on the result?

### Required original evidence artifacts

| Artifact | Minimum acceptance evidence | What it must *not* claim |
| --- | --- | --- |
| Data and provenance card | Generator source revision, seed policy, variables, label rule, excluded variables, simulated dependence/shift, and data-use boundary. | That synthetic data represents a real population or has valid permissions for external use. |
| Representation-assumption sheet | Input features, preprocessing-fit boundary, map \(\phi\), retained/lost distinctions, numerical/dtype assumptions, and one collision/counterexample. | That a learned or PCA representation is causal, fair, interpretable, or universally sufficient. |
| Baseline comparison | Dummy/rule/classical/simple learned alternatives, shared feature-availability time, matching split/tuning budget, metric, cost, and predicted failure mode. | That the highest score establishes an appropriate product/decision choice. |
| Evaluation-and-shift plan | Target statement, entity/time-aware split, metric suite, calibration/slice plan, uncertainty method, pre-specified shift, and stopping/selection rule. | That a finite held-out result equals target-deployment performance. |
| Objective/training trace | Exact loss, regularizer, update rule, hyperparameters, gradient/finite-difference check at a declared point, seed, precision, versions, and raw traces. | That a lower loss proves convergence, generalization, or correctness of the objective. |
| Observability matrix | Data/feature/model/metric/serving claim, expected range, slice, failure probe, response, owner, and abstention/escalation boundary. | That monitoring catches every failure or authorizes automated remediation. |
| Data-authority/impact map | Synthetic-data assertion, prohibited external use, human review boundary, unanswered impact questions, and M36 handoff. | That documentation itself provides consent, legal authority, fairness, safety, or approval. |
| Supportive oral-defense summary | Learner-selected claims, repair after hints, counterexample, transfer question, uncertainty, and next action. | A grade, pass/fail outcome, proof of mastery, record of a real voice conversation, or automatic Notion export. |

### Numerical experiments worth building later

1. **Representation collision.** Generate inputs with one signal dimension and
   one context dimension. Compare a representation that retains both to one
   that discards context. Hold the training relation fixed and change the
   context–label relation in a synthetic deployment split. Record the exact
   generator, seed, observed metrics, and alternative explanations. This makes
   “what a map cannot distinguish” observable without portraying the result as
   a real fairness or robustness finding.
2. **Leakage contrast.** Fit a transform before splitting in one synthetic
   pipeline and only on training folds in another. Keep model, seed, and metric
   identical. The learner predicts which estimate can be optimistic and reads
   the dependency path. The experiment must not imply that every preprocessing
   error behaves the same way or quantify leakage in a real dataset.
3. **Metric and calibration contrast.** Construct two synthetic probabilistic
   predictors with matching accuracy but different confidence behavior. Report
   accuracy, a proper score, a reliability table with sample counts, and a
   selected cost/threshold. State how small samples/bins limit the result and
   why the chart does not authorize an action.
4. **Objective/gradient/reproducibility trace.** Use a tiny bounded differentiable
   model with an analytic or central-finite-difference check at fixed points.
   Vary seed, data order, dtype, and one optimization setting; record source
   revision, runtime/package versions, hardware, deterministic settings,
   tolerances, raw outputs, and semantic oracle. The aim is to debug an
   implemented calculation—not to make a benchmark or general claim about a
   framework.

Every future numerical result must include the question, variants, data
generator/input identity, source revision, versions, hardware/runtime, seed and
randomness policy, precision, split/tuning protocol, compute/termination
limits, semantic oracle, raw observations, aggregation method, and viable
alternative explanations. The portal and portable copied prompts remain
local-first: the portal may not export a learner artifact to Notion or another
service without the learner’s explicit approval. Separately, under the active
workflow, only the learner-designated Codex Teaching Assistant or Study Partner
chat may create at most one concise, privacy-bounded Notion session note after
a substantive conversation; raw transcripts/voice stay excluded, records may
be paused or marked off-record, and no saved-note claim is valid without direct
evidence.

## Research gaps and release blockers this file does not close

1. **The canonical M35 source-map field remains null.** This research packet
   is not a graph-bound, claim-linked source ledger or a contract source-map.
2. **Academic prerequisites remain unavailable as release evidence.** M31,
   M32, and M34 are authoring-only, and M34 has its own advanced prerequisite
   dependencies. M35 cannot silently bypass or reinterpret those gates.
3. **No reviewed M35 contract exists.** A private M35 workbook now provides
   six draft sessions, typed outputs, diagnostics/retrieval, a dossier rubric,
   and TA/Study Partner oral material. Its source binding, review records,
   canonical learner route, and release evidence still require independent
   review.
4. **A bounded local reference fixture and focused teaching test now exist;
   no learner studio or release validation exists.**
   `lib/m35-m36-signal-routing-fixture.js` and its focused test expose only
   fixed synthetic representation collisions, information-budget baselines,
   probability-card behavior, and a scalar gradient comparison. They are not
   real data, a trained model, framework behavior, a benchmark, a population
   calibration claim, or a learner route. A future interaction must still be
   bounded, local-first, safe to cancel, and transparent about data/model/
   version limits; it must not execute arbitrary code or access undeclared
   network, package, credential, or filesystem capabilities.
5. **No data/model asset review has occurred.** Dataset provenance, licenses,
   model weights, benchmark terms, code, figures, fairness/privacy claims, and
   domain-specific consequences require independent review before reuse.
6. **No empirical or theorem validation has occurred.** Future lessons need
   original tests for split leakage, baseline alignment, metric implementation,
   calibration calculation, shift simulation, gradient checks, numerical
   tolerance, and reproducibility boundaries. A framework call is not a proof.
7. **No accessibility, live-learning, or whiteboard evidence exists.** This
   note supplies neither diagram text alternatives nor keyboard/screen-reader
   verification, nor direct evidence that a particular Codex chat can use GPT
   Live, render equations/code, or retain a readable conversation.
8. **No Notion activity is evidenced.** This note does not create, amend, or
   prove automatic notes, consent handling, off-record behavior, correction,
   deletion, or pause support in Notion/Codex.
9. **No privacy, security, CI, deployment, GitHub-review, or provenance record
   is created.** A local authoring note is not a tested release input or a
   deployed private portal.
10. **M36 and M25/M26 stay gated.** This research does not supply M35 learner
    evidence, so it cannot unlock M36 or reweave the preview-only synthesis
    modules.

## Authoring checklist before M35 can be reviewed

- [ ] Recheck every source’s stable URL, exact edition/version, author/publisher
      reuse terms, third-party notices, access date, and claim linkage.
- [ ] Build a canonical M35 source map that binds each future claim, formula,
      code sample, figure, dataset, and experiment to a reviewed source or an
      original derivation, with an explicit non-claim.
- [ ] Keep graph state, academic prerequisites, route gate, manifest, contract
      status, and release status unchanged until independent review says
      otherwise.
- [ ] Author six original, connected sessions with typed visible outputs and
      prediction-before-reveal, first-principles explanation, code-reading,
      debugging/design, transfer, retrieval, and spaced review in each.
- [ ] Create original accessible diagrams with adjacent concise prose
      alternatives; do not import screenshots, figures, datasets, or notebook
      outputs from the sources without a recorded reuse decision.
- [~] A shared bounded deterministic fixture/test now covers a representation
      collision, information-budget baseline contrast, finite probability-card
      behavior, one Bernoulli-likelihood derivation, one ridge-shrinkage card,
      and one scalar gradient check. Split leakage, named shift
      simulation, reproducibility records, a learner studio, and independent
      lesson review remain to be completed.
- [ ] Build confidence-aware diagnostics and evidence rubrics that test
      assumptions and counterexamples, not recognition of algorithm names.
- [ ] Create M35-specific Teaching Assistant and Study Partner packages. The
      TA’s future oral defense must be constructive, adaptive, and
      learner-controlled; the Study Partner rehearses/discusses rather than
      grades. Both must keep equations, prose/ASCII fallbacks, code fences,
      traces, and diagrams readable after a voice conversation.
- [ ] Obtain direct, platform-specific evidence before asserting a selected
      Codex live quality setting, voice behavior, rendered whiteboard, Notion
      write, retention behavior, or automatic learning record.
- [ ] Bind reviewed content to the v3 contract, source/review/provenance
      evidence, deterministic inputs, CI run, deploy record, changelog, and a
      normal additive GitHub commit/review trail before any promotion.
- [ ] Preserve the M31–M36 authoring-only boundary and M25/M26 preview gate
      until every required academic and release condition has independently
      passed.

This note intentionally leaves M35’s source-map and release blockers open. Its
value is a connected, source-conscious authoring path: it teaches learners to
read a learned system as a chain of assumptions and evidence, not as a score,
model name, or AI-generated answer that can speak for itself.
