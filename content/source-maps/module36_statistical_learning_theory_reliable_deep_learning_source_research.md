# Module 36 — Statistical Learning Theory & Reliable Deep-Learning Systems: Primary-Source Research

## Status, scope, and non-publication boundary

**Status on 2026-07-31:** instructor-facing, **authoring-only** research for a
planned Module 36. This is not a learner workbook, canonical source map,
structured module contract, review record, release input, studio, diagnostic,
oral-defense implementation, route change, or proof of learner competence.

The canonical graph still records M36 as `authoring-only` with hidden reader
access, a `null` source-map field, no studio, and a v3 contract state of
`not-started`. Its academic prerequisites remain M29, M31, M32, M33, and M35;
its declared forward handoff remains M25. This dossier changes none of those
facts. It must not unlock M36, M25, or M26; create a claim that a prerequisite
has been satisfied; or turn a source link into evidence that any learner-facing
artifact has been reviewed or released.

In particular, this research does **not** establish a theorem for a learner's
chosen model or data, an empirical benchmark result, calibration under a real
deployment distribution, robustness to a named attack or shift, reproducibility
across devices, an operational monitoring program, or permission to use an AI
system in a consequential setting. It also creates no Codex chat, GPT Live
session, Notion record, voice rendering, or successful write claim.

All sources below are research anchors, not copy sources. Future Atlas material
must use original prose, diagrams, derivations, code, fixtures, and data unless
an asset-level reuse review records an exact permission. The future module still
requires its full module contract, human review, accessibility evidence, CI,
GitHub provenance, and release evidence before it can be marked review-ready
or verified.

## The connected teaching argument

Module 36 is not a collection of bound names or deep-learning recipes. Its
through-line is a limited theory-to-system claim:

~~~text
target question and decision boundary
  -> population, loss, representation, and hypothesis-class assumptions
  -> empirical risk, optimization trace, and a stated generalization argument
  -> capacity/limit theorem with its quantifiers and non-conclusion
  -> finite experiment with numerical, data, and environment identity
  -> shift, calibration, monitoring, intervention, and human authority boundary
  -> evidence packet that M25 may later synthesize only after its own gates
~~~

**Text alternative:** A small training loss is one observation in a larger
chain. Before calling a system reliable, a learner must identify the target
relation, the population and sampling assumptions, what the loss measures, the
model class, the optimization and numerical procedure, the finite evidence, the
failure conditions, and who may act when evidence changes. A theorem can narrow
a claim; it does not certify a deployment.

The canonical prerequisites give each link a prior foundation:

| Incoming module | M36 reuses | M36 adds without replacing it |
| --- | --- | --- |
| M29 — Calculus & Continuous Change | derivatives, limits, smoothness domains, and convergence language | an assumption-scope sheet that prevents exchanging limits, expectations, derivatives, and finite observations without conditions |
| M31 — Optimization & Information | objective, stochastic update, constraint, and convergence distinctions | a ledger that separates approximation, estimation, optimization, and deployment/reliability evidence |
| M32 — Systems Languages, Scientific Python & Accelerators | precision, autodiff, asynchronous execution, environment, and benchmark discipline | a theory-to-system reproducibility record with nonportable boundaries |
| M33 — Formal Languages, Computability & Complexity | quantified definitions, reductions, resource limits, and explicit non-claims | a theorem-limit card that resists both theorem denial and theorem overreach |
| M35 — Machine Learning & Representation | representation, evaluation, calibration, shift, observability, and authority boundaries | a reliable-learning evidence map joining mathematical, empirical, systems, and human-control evidence |

## Exact canonical bridge and forward handoff

This is a planning projection of the current M36 bridge, not a certification
of any incoming artifact or a substitute for the graph.

| Required prerequisite | First consuming session | Inherited distinction that must remain visible | Planned forward artifact |
| --- | --- | --- |
| M29 | M36-S01 | Differentiability and an asymptotic/large-sample statement each have a variable, domain, and regularity conditions. | `m36-assumption-scope-sheet` |
| M31 | M36-S02 | Optimizing a finite objective is not evidence of population risk or operational reliability. | `m36-optimization-generalization-gap-ledger` |
| M33 | M36-S03 | A theorem is a quantified implication with assumptions and an explicit set of non-conclusions. | `m36-limit-and-nonclaim-card` |
| M32 | M36-S04 | Precision, data order, backend, runtime, and device can affect an observed experiment and what reproducibility means. | `m36-theory-system-reproducibility-record` |
| M35 | M36-S01 | Representation, data relation, evaluation, calibration, shift, observability, and decision authority are separate evidence layers. | `m36-reliable-learning-evidence-map` |

### Planned six-session spine

| Canonical session | Connected progression | Planned evidence |
| --- | --- | --- |
| **M36-S01 — What learning claims mean: risk, representation, data, and assumptions** | Translate a reported model result into a target distribution, loss, hypothesis class, representation, sample relation, and regularity assumptions before discussing a guarantee. | Assumption-scope sheet and initial reliable-learning evidence map |
| **M36-S02 — Optimization, estimation, and generalization are different gaps** | Separate objective minimization, approximation, finite-sample estimation, optimization, and deployment evidence using a loss-only counterexample. | Optimization–generalization gap ledger |
| **M36-S03 — Capacity, learnability, computational limits, and theorem scope** | Read PAC/VC, stability, or margin language as a precise conditional claim; distinguish statistical possibility from efficient construction and deployment safety. | Limit-and-nonclaim card |
| **M36-S04 — Reliable deep-learning systems: numerical, systems, and reproducibility evidence** | Connect a mathematical/empirical comparison to data identity, dtype, backend, stochasticity, environment, and a bounded repeat protocol. | Theory-system reproducibility record |
| **M36-S05 — Shift, robustness, monitoring, and bounded human control** | Turn a static result into a lifecycle claim with a shift hypothesis, observable, threshold, intervention, and authority boundary. | Extended reliable-learning evidence map |
| **M36-S06 — Reliable learning systems dossier and bridge to synthesis** | Defend one small, synthetic, evidence-bounded learning-system claim across assumptions, theorem scope, experiment, systems constraints, monitoring, and human control. | Reliable Deep-Learning Systems Dossier and learner-controlled oral-defense summary |

M36's planned forward packet is: **assumptions, optimization/generalization
gaps, theorem limits, reproduction record, shift/monitoring plan, authority
boundary, and oral-defense reflection.** Its forward module M25 remains a
reference preview until the canonical graph, contract, review, and release
evidence say otherwise; this file cannot change that state.

## Primary-source ledger and reuse boundary

S36-01–S36-14 were accessed on **2026-07-31**; S36-15–S36-17 were checked on
**2026-08-01**. “Link/cite only” means the source may guide a future author
but does not grant Atlas permission to reproduce prose, formulas, figures,
code, data, benchmarks, videos, course exercises, or brand assets. A future
structured source ledger must add a learner-facing claim link and asset decision
for every actual use.

| ID | Primary / first-party source | Narrow authoring use and claim linkage | License / reuse status |
| --- | --- | --- | --- |
| S36-01 | V. Vapnik and A. Chervonenkis, [“On the Uniform Convergence of Relative Frequencies of Events to Their Probabilities”](https://mlanthology.org/misc/1971/vapnik1971misc-uniform/) (1971) | Historical primary source for the move from one empirical frequency to a uniform class-level deviation question. Supports M36-C01/C04 only with class, sample, probability, and limit assumptions shown. | Historic paper hosted by ML Anthology; **link/cite only** pending rights review. Do not copy translation, proof, or figures. |
| S36-02 | L. Valiant, [“A Theory of the Learnable”](https://dl.acm.org/doi/10.1145/1968.1972) (CACM, 1984) | Primary PAC-learning framing for accuracy/confidence/sample/resource quantifiers. Supports M36-C04's distinction between statistical learnability and a real system claim. | ACM publication; **link/cite only**. Do not treat access to a paper as a license for instructional excerpts or examples. |
| S36-03 | S. Shalev-Shwartz et al., [“Learnability, Stability and Uniform Convergence”](https://www.jmlr.org/papers/v11/shalev-shwartz10a.html) (JMLR, 2010) | Primary result that makes a useful counterweight to slogan-level uniform-convergence reasoning in the general learning setting. Supports M36-C04's theorem-scope exercise. | JMLR paper; **link/cite only** pending asset review. Future material must not overstate the paper's setting as a universal deep-learning theorem. |
| S36-04 | P. Bartlett, D. Foster, and M. Telgarsky, [“Spectrally-normalized Margin Bounds for Neural Networks”](https://proceedings.neurips.cc/paper/2017/hash/b22b257ad0519d4500539da3c8bcf4dd-Abstract.html) (NeurIPS, 2017) | Primary deep-network bound example for reading a complexity measure, margin condition, empirical investigation, and scope separately. Supports M36-C05. | NeurIPS-hosted paper; **link/cite only**. Do not reuse figures, bound constants, or benchmark conclusions as Atlas evidence. |
| S36-05 | C. Zhang et al., [“Understanding Deep Learning Requires Rethinking Generalization”](https://openreview.net/forum?id=Sy8gdB9xx) (ICLR, 2017) | Primary empirical/theoretical challenge to simplistic capacity and regularization stories. Supports M36-C05's counterexample to “fit implies a simple explanation.” | OpenReview paper; **link/cite only**. Its experiments do not establish a general property of a learner's architecture, data, or optimizer. |
| S36-06 | P. Belkin et al., [“Reconciling Modern Machine-Learning Practice and the Classical Bias–Variance Trade-Off”](https://www.pnas.org/doi/10.1073/pnas.1903070116) (PNAS, 2019) | Primary reference for a bounded double-descent discussion and the need to state model/data/procedure rather than apply a one-curve story universally. Supports M36-C02/C05. | PNAS article; **link/cite only** pending specific reuse review. No chart or empirical curve is a universal reliability finding. |
| S36-07 | C. Guo et al., [“On Calibration of Modern Neural Networks”](https://proceedings.mlr.press/v70/guo17a.html) (ICML/PMLR, 2017) | Primary source for separating classification accuracy from a population calibration relation and for a bounded temperature-scaling comparison. Supports M36-C06. | Proceedings paper; **link/cite only**. A calibration technique does not authorize a decision or promise behavior under shift. |
| S36-08 | Y. Ovadia et al., [“Can You Trust Your Model's Uncertainty? Evaluating Predictive Uncertainty Under Dataset Shift”](https://proceedings.neurips.cc/paper_files/paper/2019/hash/8558cb408c1d76621371888657d2eb1d-Abstract.html) (NeurIPS, 2019) | Primary empirical evidence for asking how uncertainty/calibration behavior changes under named shifts. Supports M36-C06/C08. | NeurIPS-hosted paper; **link/cite only**. It is neither a universal uncertainty guarantee nor a reliability certificate. |
| S36-09 | P. Koh et al., [“WILDS: A Benchmark of in-the-Wild Distribution Shifts”](https://proceedings.mlr.press/v139/koh21a.html) (ICML/PMLR, 2021) | Primary benchmark framing for why training/test relation differences should be named, measured, and not reduced to one IID score. Supports M36-C08. | Proceedings paper; **link/cite only**. Do not import data, scores, or benchmark claims into Atlas without separate data/license review. |
| S36-10 | J. Pineau et al., [“Improving Reproducibility in Machine Learning Research”](https://www.jmlr.org/papers/v22/20-303.html) (JMLR, 2021) | Primary report on reproducibility practices/checklists as evidence discipline. Supports M36-C07, not bitwise identity or a publication approval. | JMLR paper; **link/cite only** pending exact asset review. |
| S36-11 | [PyTorch reproducibility documentation](https://docs.pytorch.org/docs/stable/notes/randomness.html) and [numerical-accuracy documentation](https://docs.pytorch.org/docs/stable/notes/numerical_accuracy.html) | First-party current framework documentation for a bounded environment/precision/nondeterminism checklist. Supports M36-C07; exact behavior must be pinned to a future release. | [PyTorch BSD-3-Clause](https://github.com/pytorch/pytorch/blob/main/LICENSE); link-only/original reproduction cards and examples. No framework guarantee is extrapolated across versions, commits, or platforms. |
| S36-12 | NIST, [Artificial Intelligence Risk Management Framework (AI RMF 1.0)](https://doi.org/10.6028/NIST.AI.100-1) (2023) | Official framework for separating measurement, management, governance, monitoring, and intended use. Supports M36-C08/C09 as a planning vocabulary, not law, certification, or domain authority. | NIST publication; **link/cite only pending asset and third-party-material review**. Its voluntary framework does not approve a system. |
| S36-13 | MIT OpenCourseWare, [6.7960 Deep Learning, Lec. 06: Generalization Theory](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/resources/mit6_7960f24_lec06_mp4/) (2024) | University-course benchmark for future scope: generalization theory, overparameterization, double descent, and VC-dimension limits. It is a coverage reference, not a replacement course or copied learning asset. | Check the course's displayed MIT OCW license and individual asset notices before reuse. Atlas should link and author independently. |
| S36-14 | MIT OpenCourseWare, [9.520 Statistical Learning Theory & Applications, VC-dimension notes](https://ocw.mit.edu/courses/9-520-statistical-learning-theory-and-applications-spring-2006/resources/class17/) | University-level source for teaching sequencing around function-class complexity and VC-style definitions. Supports scope review for M36-S03 only. | Check MIT OCW and individual material notices before reuse; link/cite only unless an exact asset decision is recorded. |
| S36-15 | Carnegie Mellon University, [10-301/601 Introduction to Machine Learning](https://www.cs.cmu.edu/~mgormley/courses/10601-f25/) (Fall 2025) | Official university-course benchmark joining regularization/model selection with formal learning guarantees and their limits. Supports M36-S03’s fixed-versus-adaptive selection repair. | Course material is **link/cite only**. Do not copy lectures, assignments, solutions, figures, or data; create original Atlas proofs, examples, and cards. |
| S36-16 | Stanford, [CS229 Machine Learning course materials](https://cs229.stanford.edu/materials.html-full) | Official course-material route for learning theory and regularization/model-selection sequencing. Supports M36-S03 calibration without claiming access, enrollment, or equivalence. | **Link/cite only**. Some material may have its own access or reuse constraints; do not copy notes, assignments, figures, or solutions. |
| S36-17 | W. Hoeffding, [“Probability Inequalities for Sums of Bounded Random Variables”](https://doi.org/10.1080/01621459.1963.10500830) (JASA, 1963) | Primary source for the explicitly named fixed-hypothesis bounded-IID concentration step in M36-S03. It supports only the finite-class, bounded-loss Hoeffding-plus-union-bound card after its assumptions are stated. | Journal article; **link/cite only**. Create original theorem cards and derivations; do not copy proof text, constants presentation, or examples. |

### What this ledger does *not* establish

No source row proves that a prospective future lesson has the right theorem
statement, assumptions, proof, model, data, code, environment, benchmark,
monitoring threshold, or decision policy. It also does not establish that a
paper is exhaustive/current, a library behavior is stable, a model is safe, a
data relation is IID, a bound is tight, an experiment is reproducible, or an
organization has authority to deploy a result. The learner-facing source map
must be built and reviewed separately.

## First-principles definitions and derivation aids

These are authoring notes, not final lesson text. They are deliberately
explicit about where a conclusion stops.

1. **Population and empirical risk.** For a named distribution \(P\) over
   examples \(Z=(X,Y)\), a hypothesis \(h\), and a stated loss \(\ell\), write
   \[
   R_P(h)=\mathbb{E}_{Z\sim P}[\ell(h,Z)],\qquad
   \widehat R_S(h)=\frac{1}{n}\sum_{i=1}^{n}\ell(h,z_i).
   \]
   The first object concerns an explicit distribution and loss; the second is
   a finite sample calculation. The notation does not grant an IID assumption,
   make the chosen loss appropriate, or identify a deployment population.
2. **A gap decomposition is an explanation request, not an identity with
   one privileged form.** A future lesson may distinguish approximation,
   estimation/generalization, and optimization gaps against declared reference
   classes/solutions. It must name the comparator, data relation, objective,
   and algorithm. A low \(\widehat R_S\) alone leaves each other link open.
3. **Uniform deviation and capacity.** A VC/PAC-style statement typically
   controls a quantity like \(\sup_{h\in\mathcal H}|R_P(h)-\widehat R_S(h)|\)
   with probability at least \(1-\delta\), given stated sampling, loss/class,
   complexity, and sample-size conditions. It is not a per-person guarantee,
   a proof of data quality, or an execution-time/energy/safety guarantee.
4. **Optimization is a separate computation.** Given a finite objective
   \(L_S(\theta)\), an update such as
   \(\theta_{t+1}=\theta_t-\eta_t g_t\) describes an implemented algorithm,
   where \(g_t\) may be stochastic and numerically approximate. A stationary
   gradient, stable loss curve, or finite-difference agreement does not prove
   that \(L_S\) measures the target outcome or that its optimizer reaches a
   population optimum.
5. **Calibration is conditional and population-scoped.** For a binary score
   \(q(X)\), an idealized relation can be written
   \(\Pr(Y=1\mid q(X)=a)=a\) for applicable \(a\) and a named population.
   A finite reliability diagram is an estimate under binning and sample limits;
   it does not establish decision quality, fairness, or calibration after
   distribution shift.
6. **Reproduction versus reliability.** Repeating a result under a declared
   source/data/environment/seed/tolerance protocol can constrain a narrow
   implementation claim. Reliability requires additional evidence about the
   future input relation, failure detection, response, authority, and impact.
   Neither implies the other.

## Claim, assumption, derivation, and counterexample ledger

| ID | Bounded future claim | Assumptions/evidence that must be visible | Prediction/derivation move | Counterexample or explicit non-claim |
| --- | --- | --- | --- |
| M36-C01 | An empirical-loss observation is a finite statement about declared examples, model, loss, and computation; it does not itself equal population or deployment risk. | Target relation, unit, loss, data collection/split, representation, hypothesis class, exact sample, preprocessing fit boundary, and numerical procedure. | Show two datasets with identical training loss but different held-out/shift behavior; ask which assumptions would be needed to compare them to \(R_P\). | Low or zero training loss does not prove a correct objective, IID sampling, calibration, causal validity, or reliable behavior. |
| M36-C02 | Approximation, estimation, optimization, and operational gaps can be tracked as distinct evidence questions. | Comparator/reference class, optimization objective, algorithm/termination, sample relation, metric, uncertainty procedure, and use context. | Give a converged optimization trace and ask which gap it reduces evidence for, then identify two gaps it leaves unmeasured. | A gap ledger is not an exact universal decomposition, and a converged optimizer does not establish generalization or fitness for use. |
| M36-C03 | A finite experiment supports an observation only under its stated data, code, environment, precision, seed, and measurement protocol. | Source/data revision, versions, device/runtime, dtype, deterministic settings, data order, random generators, repeats, tolerance, semantic oracle, and raw results. | Before a rerun, ask which values could change while source code does not; choose one falsifier or replication condition. | Matching one run or one seed is not cross-platform reproducibility, a causal explanation, or a general benchmark conclusion. |
| M36-C04 | PAC/VC or stability claims constrain a mathematical learning setting when their quantified assumptions hold. | Definition of example/loss/class, sampling model, probability/confidence, complexity/stability condition, sample-size regime, and computational assumptions where relevant. | Hide one assumption from a theorem card and ask the learner to predict the invalid inference; then restore it and state one non-conclusion. | A finite VC dimension or a bound does not prove that a real dataset follows the model, that an algorithm is efficient, or that a high-impact use is justified. |
| M36-C05 | A modern deep-learning bound or empirical generalization study should be read as a scoped attempt to explain specified models, quantities, and experiments. | Exact architecture, parameterization/normalization, norm/margin/complexity term, data, optimizer, sample, experiment, and theorem conditions. | Compare a model that fits random labels with one that fits signal; ask which theorem/experiment quantities are measured and which story remains unsupported. | Parameter count, norm, margin, or a cited paper alone is not a universal explanation, an architecture ranking, or a system-reliability certificate. |
| M36-C06 | Accuracy, loss, confidence, calibration, uncertainty, and decision cost are different evidence types and may change under shift. | Population/slice, labels and latency, probability semantics, metric/estimator, binning/interval, shift hypothesis, threshold/cost, and response policy. | Give equal-accuracy synthetic predictors with differing score distributions; predict what a reliability table can reveal before seeing it. | IID calibration does not imply shifted calibration, valid uncertainty, safe abstention, or an authorized action. |
| M36-C07 | Determinism/reproducibility controls can narrow known sources of variation for a pinned environment, often with performance or coverage trade-offs. | Framework and driver versions, hardware/backend, dtype, RNGs, worker/data ordering, deterministic flags, tolerated equality, and unsupported operations. | Predict whether an observed difference could arise from accumulation order, backend choice, data order, or stochastic state before choosing a check. | A fixed seed does not guarantee identical CPU/GPU or version results; deterministic settings do not prove numerical correctness or scientific validity. |
| M36-C08 | Shift/robustness evidence is bounded by the named shift, data relation, metric, and intervention policy. | Source/deployment relation, shift taxonomy/hypothesis, labeled feedback, monitoring statistic, threshold, false-alarm/miss trade-off, owner, and stop/escalation path. | Change one synthetic nuisance or class-prior variable; require the learner to predict a metric shift and name what the perturbation fails to represent. | Passing a benchmark, adversarial test, or one shift simulation does not establish robustness to all future changes or safe automatic remediation. |
| M36-C09 | Monitoring and governance can make reliability evidence/action boundaries inspectable but cannot replace domain authority or eliminate residual risk. | Intended/prohibited use, affected parties, owner, review/escalation/appeal route, data authority, monitoring scope, intervention controls, and uncertainty. | Label a proposed claim as observation, assumption, control, or authority decision; ask which requires accountable human/domain action. | An RMF, dashboard, model card, or oral defense is not legal approval, consent, fairness proof, or certification. |

## Likely six-session source routing

The following source routing follows the canonical M36 session spine. It does
not create a workbook, studio, test, or oral-defense surface.

| Session and prerequisite bridge | Source route | Understanding-first/code-reading move | Planned artifact and non-claim |
| --- | --- | --- | --- |
| **M36-S01 — What learning claims mean** (M29, M35) | S36-01–S36-03, S36-07–S36-09 | Start with a tiny synthetic learning claim. Before any formula, ask the learner to mark the population, sample, loss, representation, hypothesis class, and missing assumption; only then reveal empirical/population risk notation. | **Assumption-scope sheet.** It does not say a synthetic relation represents a real population or that a stated loss is the correct decision objective. |
| **M36-S02 — Optimization, estimation, and generalization gaps** (M29, M31, M35) | S36-04–S36-06 | Code-read an original fixed-length training trace and a held-out observation. Ask which claim is supported by a gradient/loss change and which remains unanswered. | **Optimization–generalization gap ledger.** It does not claim convergence, population optimality, or a valid deployment decision. |
| **M36-S03 — Capacity, learnability, computational limits, and theorem scope** (M33, M35) | S36-01–S36-05, S36-14–S36-17 | Build a finite-hypothesis, bounded-loss, IID Hoeffding proof skeleton: fixed-hypothesis concentration, union bound, a numeric \(K,\varepsilon,\delta,n\) card, a PAC-quantifier contrast, and a fixed-versus-adaptive selection repair. Then remove IID with a cloned-sample counterexample and state what the restored result still cannot decide. | **Limit-and-nonclaim card.** It does not turn a finite-class theorem name into a guarantee about an arbitrary neural network, data source, or user. |
| **M36-S04 — Numerical, systems, and reproducibility evidence** (M32, M35) | S36-10–S36-11 | Read a fixed two-layer ReLU forward/backward trace and an original environment record with one unpinned variable. Predict a plausible difference between two runs, then choose the smallest added record/check rather than a blanket "set the seed" response. | **Theory-system reproducibility record.** It does not promise bitwise matching, validate framework/autodiff behavior, or validate an experiment's scientific/reliability claim. |
| **M36-S05 — Shift, robustness, monitoring, and bounded human control** (M31, M32, M35) | S36-07–S36-12 | Contrast an input-mixture shift, a conditional/label-relation shift, and a representation/measurement shift before revealing an intervention plan. Require a named observable, threshold, false-positive/false-negative trade-off, owner, and stop condition for each claimed mechanism. | **Reliable-learning evidence map.** It does not certify detection, robustness, causal diagnosis, or autonomous authority. |
| **M36-S06 — Reliable learning systems dossier and bridge to synthesis** (M29, M31, M32, M33, M35) | S36-01–S36-17 | Assemble a small synthetic dossier. A supportive TA oral discussion asks the learner to repair one assumption, explain one counterexample, distinguish a theorem from an observation, and choose a next uncertainty-reducing measurement. | **Reliable Deep-Learning Systems Dossier and learner-controlled oral-defense summary.** It is not a pass/fail result, platform-live evidence, Notion-write proof, or M25/M26 unlock. |

Every future session should preserve prediction before reveal, compact
first-principles explanation, code-reading/debugging/design inspection, an
explicit counterexample, retrieval and spaced review, a transfer task, and a
visible learner-controlled artifact. The emphasis is reading claims and system
evidence, not typing large framework programs.

## Bounded project and numerical-experiment plan

The future project should use a fully synthetic, checked-in signal-routing
setting. It must not train or deploy a model about people; ingest personal,
medical, employment, education, financial, biometric, or proprietary data;
call external services; make recommendations; or publish weights/benchmarks.

### Proposed question

For a declared synthetic population and a named simulated shift, what limited
evidence supports or weakens a claim about a small representation/model's
loss, calibration, and failure behavior—and what remains unknown before anyone
could rely on it?

| Evidence artifact | Minimum acceptance evidence | Explicit non-claim |
| --- | --- | --- |
| Assumption-scope sheet | Target/synthetic relation, variables, loss, class, sample/split, regularity/limit regime, and every unknown. | That a finite simulation supplies a real population or theorem condition. |
| Gap ledger | Objective, reference/comparator, optimization trace, validation observation, generalization/operational questions, and evidence status. | That any one optimization or validation number resolves every gap. |
| Theorem-limit card | Formal statement in original wording, quantified assumptions, conclusion, proof idea, one counterexample/edge case, and explicit non-conclusion. | That the card proves the theorem or applies it to a deployed system. |
| Reproduction record | Generator/code revision, dependencies, hardware/backend, dtype, seed/RNG/data order, deterministic settings, tolerance, raw repeats, and semantic oracle. | Cross-platform bitwise identity, causal explanation, or universal reproducibility. |
| Shift/monitoring plan | Synthetic shift design, observables, calibration/metric/slice, threshold and uncertainty, false alarm/miss discussion, owner, intervention, and stop/escalation boundary. | That the plan detects all shifts, prevents harm, or authorizes automatic action. |
| Supportive oral-defense summary | Learner-selected explanation, prediction, corrected misconception, counterexample, transfer question, uncertainty, and next action. | A grade, mastery proof, raw transcript, voice record, or automatic Notion export. |

### Numerical experiments worth building later

1. **Empirical versus target relation.** Generate two small synthetic data
   histories with similar training loss but different held-out/shift outcomes.
   Fix source, generator, seed, model, loss, split, and metrics. The learner
   predicts which missing assumption blocks a population claim. Do not present
   the result as an estimate for any real population.
2. **Gap ledger trace.** Use a tiny differentiable model with an analytic or
   central-finite-difference check at fixed points. Vary one optimization
   setting and hold data/model/metric fixed; record the objective, gradient,
   stopping rule, numeric precision, observed validation result, and possible
   alternate explanations. This is an implementation-reading exercise, not a
   generalization benchmark.
3. **Capacity/theorem-scope counterexample.** Construct a small finite class
   or interval classifier with a manually inspectable labeling/complexity
   example. Ask the learner to expose which sample, class, and probability
   conditions are needed before a uniform-deviation implication could be used.
   The fixture must not claim to prove a general theorem.
4. **Reproduction and shift card.** Run an original toy model over a small
   matrix of seed, data order, dtype, and one synthetic nuisance shift. Record
   full environment identity, raw results, tolerances, and a monitoring/action
   proposal. Explain why a repeat or one shift does not prove reliable future
   operation.

The Atlas portal remains local-first and must not transmit any of these
artifacts automatically. A portable copied chat prompt stays local by default.
Under the active designated-chat workflow, the learner-designated Codex
Teaching Assistant or Study Partner may instead create at most one concise,
privacy-bounded session note after a substantive conversation, unless records
are paused or material is off-record. That separate bounded note never includes
raw voice or full transcripts, does not turn this dossier into a source map or
release input, and cannot be claimed saved without direct evidence.

## Research gaps and release blockers this file does not close

1. **M36's canonical source-map field remains null.** This is not the
   structured, learner-facing source map required by a future module contract.
2. **The prerequisites are not release evidence.** M31, M32, M33, and M35
   remain authoring-only. M36 cannot replace their contracts, source review,
   or learner evidence.
3. **No reviewed M36 learner-route artifact exists.** A private M36 workbook
   now supplies six draft sessions, visual alternatives, diagnostics/retrieval,
   a project rubric, and TA/Study Partner oral material. A shared bounded
   fixture/test now supplies a finite-risk/named-relation probe and a current
   JavaScript reduction-order probe. It still lacks a canonical learner-route
   binding, reviewed evidence, a safe learner studio, and release evidence;
   the fixture is neither a theorem review nor a general reliability model.
4. **No theorem or experiment has been independently reviewed for a lesson.**
   Future claims need exact theorem statements/proofs or original derivations,
   explicit conditions, source/asset review, and a scope/non-claim adjacent to
   each learner-facing result.
5. **No external reliability approval exists.** A benchmark, model card,
   reproducibility checklist, AI RMF, or oral discussion is not a certification,
   legal determination, or authorization for consequential deployment.
6. **No release/provenance evidence is present.** This note gives neither CI
   success for a future M36 artifact nor a private deployment, GitHub release,
   source-review approval, performance/accessibility review, or security claim.

## Authoring checklist before M36 can be reviewed

- [ ] Recheck every source URL, version, license/reuse decision, access date,
      theorem statement, and empirical scope; build the structured source
      ledger with exact learner-facing claim linkage.
- [ ] Build original, accessible diagrams and adjacent text alternatives for
      every risk/gap/theorem/system relationship; never use copied paper or
      course figures as a shortcut.
- [~] A shared local fixture/test now provides fixed finite-risk/relation,
      finite-class sample-bound, and reduction-order probes with explicit
      numerical and scope boundaries. A
      broader reviewed experiment, complete semantic-oracle coverage, learner
      studio, and release evidence remain to be completed.
- [ ] Require prediction before reveal and expose proof ideas, counterexamples,
      limitations, uncertainty, and transfer tasks rather than memorized bound
      names or loss curves.
- [ ] Provide a supportive TA oral-defense protocol and an equivalent text
      conversation workflow; use neither as an automatic unlock or pass/fail
      exam, and record only learner-controlled bounded evidence.
- [ ] Preserve the M25/M26 preview gate until their separate academic
      prerequisites, contract/review, source, route, accessibility, provenance,
      and release evidence agree.

This dossier intentionally leaves M36 authoring-only. Its contribution is a
source-conscious path for a rigorous future module without making present
course, system, or reliability claims stronger than the evidence.
