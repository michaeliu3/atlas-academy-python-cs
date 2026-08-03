# Module 31 — Optimization & Information: Instructor Source Map

## Status, use, and truth boundary

**Authoring status:** planning material for an **authoring-only** module.
This map is an instructor-facing design and provenance aid. It is not a
learner-ready workbook, a module-contract approval, a release record, or
evidence that M31 is published. It must not be used to add M31 to a manifest,
change the canonical graph, or make its route navigable.

**Research snapshot:** baseline 2026-07-30, with a focused calibration
follow-up on 2026-08-02. Recheck every URL, version, license, and asset-level
reuse notice before a future release. The detailed evidence review is [the M31
source audit](module31_optimization_information_source_audit.md).

**Authoring rule:** Atlas may link to and narrowly paraphrase the sources below.
Atlas explanations, diagrams, examples, code traces, diagnostics, prompts, and
project materials must be independently written. Do not copy lecture notes,
slides, problem sets, solutions, figures, datasets, videos, textbook prose, or
source-code examples without an asset-specific permission review.

## The one connected argument

~~~text
decision or scientific question
  -> owner, variables, units, target, and authority boundary
  -> objective, feasible set, probability model, or information functional
  -> geometry and assumptions
  -> algorithm, representation, and finite computation
  -> residual, certificate, or bounded convergence statement
  -> sensitivity, counterexample, and information trade-off
  -> limited recommendation with an inspectable evidence record
~~~

**Text alternative:** Optimization is not “run a solver.” It first turns a
decision into explicit variables, constraints, and a trade-off. Mathematical
structure then determines which local, global, or convergence statements are
available. A finite implementation produces only bounded run evidence; it does
not validate the proxy objective, data model, affected people, or authority to
act. Information quantities add another declared trade-off rather than a
universal score of intelligence or value.

The six sessions preserve this dependency chain:

1. formulate the object before selecting an algorithm;
2. establish what local calculus and convex geometry can justify;
3. add constraints, dual bounds, and certificates;
4. read algorithm traces as conditional finite evidence;
5. expose sampling noise and nonconvex limits;
6. reconnect probability, information, and approximation in one evidence
   dossier.

## Prerequisite bridge and forward handoff

| Incoming module | Required retrieval evidence before M31 authoring moves on | What M31 adds |
| --- | --- | --- |
| M28 — Linear Algebra, Numerical Stability & Representation | For a quadratic, identify gradient and Hessian; explain why a poorly conditioned Hessian can slow or distort an iterative computation. | Objective geometry, curvature, least-squares structure, and an explicit distinction between problem conditioning and a solver trace. |
| M29 — Calculus, Real Analysis & Continuous Change | Give a stationary-point counterexample and name a regularity/domain assumption needed for a derivative-based conclusion. | First/second-order conditions, convexity/smoothness, constrained local reasoning, and convergence claims with named hypotheses. |
| M30 — Probability, Statistics & Scientific Inference | Contrast a full gradient with a mini-batch estimate, separating estimator randomness from observed run variation. | Empirical-risk objectives, stochastic approximation, entropy/KL, and variational objectives with population/finite-run boundaries. |

| Handoff | Artifact to preserve | Boundary |
| --- | --- | --- |
| M32 — Systems Languages, Scientific Python & Accelerators | Shape/dtype/axis, solver configuration, random-stream, and profiling fields from the M31 evidence record. | An accelerator or autodiff trace does not establish a theorem or a valid model. |
| M33 — Computation, Complexity & Limits | Problem encoding, feasibility/certificate language, and oracle-cost questions. | M31 does not prove broad hardness classes or lower bounds. |
| M34 — Classical AI | Objective/constraint/utility and uncertainty cards. | M31 does not replace search, planning, graphical-model, or decision-system treatment. |
| M35/M36 — ML, learning theory, and reliable deep-learning systems | Optimization-versus-generalization distinction; reproducible stochastic evidence; information/approximation limits. | Lower loss, a stationary point, or an ELBO does not establish calibration, robustness, fairness, reliability, or deployment value. |
| M25/M26 — later synthesis/capstone | An owner-aware objective/constraint/certificate record with known limits. | A formulation cannot choose whose utility counts or provide authority for a consequential action. |

The canonical graph currently retains M18 as M31’s declared forward handoff.
This source map does not reinterpret or mutate that graph fact. The direct
academic consumers above are planning connections, not learner navigation.

## Source ledger and reuse decisions

| ID | Stable source | Claim role in M31 | Reuse decision |
| --- | --- | --- | --- |
| S01 | [MIT 6.251J: Introduction to Mathematical Programming](https://ocw.mit.edu/courses/6-251j-introduction-to-mathematical-programming-fall-2009/) and [lecture-note index](https://ocw.mit.edu/courses/6-251j-introduction-to-mathematical-programming-fall-2009/pages/lecture-notes/) | Formulation, feasible sets, linear-programming geometry, duality, sensitivity, and optimization context. | MIT OCW normally uses CC BY-NC-SA 4.0 subject to asset notices. Link/cite; make original Atlas explanations and examples. |
| S02 | [MIT 6.253: Convex Analysis and Optimization](https://ocw.mit.edu/courses/6-253-convex-analysis-and-optimization-spring-2012/) and [lecture notes](https://ocw.mit.edu/courses/6-253-convex-analysis-and-optimization-spring-2012/resources/lecture-notes/) | Convexity, subgradients, duality, saddle-point language, and proof-aware conditions. | Link-only/original exposition by default; do not import notes, homework, exams, figures, or solutions. |
| S03 | [Stanford EE364a / CME364a: Convex Optimization I](https://web.stanford.edu/class/ee364a/) | Course-level sequence for convex sets/functions/problems, optimality, duality, and algorithms. | Link-only. The page does not grant blanket rights for course assets or linked textbook content. |
| S04 | [Boyd and Vandenberghe, Convex Optimization](https://web.stanford.edu/~boyd/cvxbook/) | Coherent theorem and notation cross-check for convexity, KKT, primal/dual problems, and numerical methods. | Link-only; the book is copyrighted by Cambridge University Press. |
| S05 | [MIT 6.441: Information Theory](https://ocw.mit.edu/courses/6-441-information-theory-spring-2016/) and [lecture-note index](https://ocw.mit.edu/courses/6-441-information-theory-spring-2016/pages/lecture-notes/) | Entropy, divergence, mutual information, variational characterizations, and rate-distortion viewpoints. | Link/cite and author original explanations/visuals/code; asset notices govern any reuse. |
| S06 | [Blei, Kucukelbir, and McAuliffe: Variational Inference](https://www.cs.columbia.edu/~blei/papers/BleiKucukelbirMcAuliffe2017.pdf), [DOI](https://doi.org/10.1080/01621459.2017.1285773) | ELBO/KL direction, approximating-family assumptions, and variational-inference limits. | Link-only; do not reproduce paper text, equations, figures, tables, or examples. |
| S07 | [Robbins and Monro: A Stochastic Approximation Method](https://doi.org/10.1214/aoms/1177729586) | Provenance for conditional stochastic-approximation reasoning and step-size assumptions. | Link-only under journal/publisher rights; use original short paraphrases with assumptions visible. |
| S08 | [Ghadimi and Lan: Nonconvex Stochastic Programming](https://doi.org/10.1137/120880811), [preprint record](https://arxiv.org/abs/1309.5549) | Boundary between approximate stationarity and global optimization in stated nonconvex stochastic settings. | Link-only; do not copy equations, proofs, figures, or experimental setups. |
| S09 | [SciPy minimize](https://docs.scipy.org/doc/scipy/reference/generated/scipy.optimize.minimize.html) and [trust-constr](https://docs.scipy.org/doc/scipy/reference/optimize.minimize-trustconstr.html) | Versioned contracts for objective/derivative/constraint inputs, options, and stop fields. | SciPy is generally BSD-3-Clause; Atlas examples remain original and must pin the version before code reuse. |
| S10 | [CVXPY DCP tutorial](https://www.cvxpy.org/tutorial/dcp/) and [Apache-2.0 license](https://www.cvxpy.org/version/1.2/license/index.html) | DCP grammar, shape/curvature checking, and implementation-versus-mathematics contrast. | Cite the API and make original examples. DCP acceptance is not a real-world or solver certificate. |
| S11 | [CMU 10-725 Convex Optimization](https://stat.cmu.edu/~siva/teaching/725/) | A course-sequence calibration cross-check for least-squares conditioning, exact-gradient versus projected/stochastic theorem scopes, KKT/duality, and nonconvex boundaries in the new M31 S02/S04 cards. | Accessed 2026-08-02. The course page grants no blanket asset license. **Link-only**; Atlas keeps its fixture, derivation, and prose original and does not copy notes, assignments, figures, code, or solutions. |

S01–S10 were accessed in the linked audit on 2026-07-30; S11 was added in the
focused 2026-08-02 calibration follow-up. Before future publication, recheck
every URL/version/license, preserve claim linkage and access dates, and bind
the reviewed learner-facing selection to the structured source ledger. A freely
readable page is not a blanket reuse grant.

## Claim, assumption, and counterexample ledger

| ID | Learner-facing claim that may be authored | Assumptions that must appear next to it | Required counterexample or boundary |
| --- | --- | --- | --- |
| C01 | An objective ranks feasible candidates according to a declared proxy trade-off. | Owner, variables, units, domain, hard/soft constraints, objective weights, time/population scope. | Low loss can coexist with omitted harm, proxy drift, or a violated hard constraint. |
| C02 | At an interior local minimum of a differentiable objective, the gradient is zero; for a differentiable convex objective, zero gradient certifies global minimality. | Interior/domain condition, differentiability, convexity, coordinate/norm convention. | Saddle, maximum, flat non-minimum, and boundary optimum; floating-point near-zero is a tolerance observation. |
| C03 | Curvature, strong convexity, and smoothness can support local models, uniqueness, or a specified method’s rate. | Named domain/norm/constants and exact differentiability or subgradient setting. | Positive-semidefinite curvature alone need not give a strict minimum; sampled curvature is not a global bound. |
| C04 | A Lagrangian/dual construction can give bounds; KKT can be necessary or sufficient only under named regularity and convexity conditions. | Primal/dual domains, sign convention, feasibility, attainment/constraint qualification, multiplier convention. | Small numerical gap or a solver status is finite evidence, not proof of strong duality, valid modeling, or KKT applicability. |
| C05 | An update rule creates a sequence; a convergence theorem connects that sequence to a stated quantity under stated conditions. | Initialization, derivative/oracle source, step/line-search/trust rule, lower bound, smoothness/convexity/noise conditions, stopping quantity. | A monotonically decreasing trace or success flag is not a universal convergence theorem. |
| C06 | A stochastic gradient is a random estimator with a named target; an unbiased estimate can still have consequential variance or dependence. | Sampling mechanism, population objective, bias/variance/tail/dependence assumptions, seed, minibatch, step schedule, metric. | One favorable seed/run is not a population, consistency, or finite-time guarantee. |
| C07 | Entropy, KL, and mutual information are distribution-specific mathematical quantities. | Random variables, support, log base/units, KL direction, joint/conditional law, empirical versus population measure. | Swapped KL direction or zero model mass on target support; entropy/MI does not prove causality, privacy, usefulness, or understanding. |
| C08 | Maximizing an ELBO improves a reverse-KL objective within a chosen variational family. | Generative model, observed/latent variables, family/support, expectation estimator, KL direction, optimization boundary. | Improved ELBO does not prove exact posterior inference, mode coverage, calibrated uncertainty, or correct model specification. |

Use claim labels in every planned theorem card, code annotation, visual
caption, diagnostic rationale, dossier row, and oral-defense note. The label is
not a proof: it tells the reviewer which assumptions and non-claims must be
visible.

## Six-session authoring route

| Session | First-principles progression | Original understanding-first learning move | Prediction, retrieval, and transfer evidence | Sources |
| --- | --- | --- | --- | --- |
| M31-S01 — Objectives, variables, constraints, and geometry | Translate a bounded resource-allocation decision into variables, units, objective terms, feasible set, and authority boundary before discussing a solver. Connect M28 geometry and conditioning. | Annotate a tiny original two-variable formulation; code-read a wrong penalty that silently replaces a hard constraint. | Predict whether the penalty changed the problem; retrieve gradient/Hessian meaning; transfer by repairing a proxy objective with an omitted safety constraint. Produce the objective-geometry sheet. | S01, S03; M28 bridge |
| M31-S02 — Local reasoning: derivatives, stationarity, curvature, and feasibility | Move from M29’s local derivative facts to first-/second-order conditions, convexity, strong convexity, smoothness, and quadratic geometry. | Read a compact least-squares-plus-regularizer trace; compare analytic directional derivative, autodiff claim, and finite-difference check. | Predict the next gradient step; classify a saddle/boundary/flat stationary point; transfer by stating the missing condition in an overclaimed local-minimum assertion. Produce the stationarity-counterexample ledger. | S02–S04, S11; M28/M29 bridge |
| M31-S03 — Convex structure, dual views, and certificates | Add constrained problems without erasing S01/S02 assumptions: primal feasibility, Lagrangian signs, weak duality, strong-duality conditions, KKT components, and residuals. | Derive an original tiny convex constrained quadratic by hand; inspect a deliberately incomplete certificate. | Predict whether a proposed multiplier/sign pair is feasible; retrieve four KKT components; transfer by naming the missing constraint qualification before a strong-duality claim. Produce the primal/dual claim table. | S01–S04 |
| M31-S04 — Projected updates, step rules, and bounded convergence evidence | Turn a declared constrained problem into iterative evidence. Read a projected-gradient update beside an exact-gradient rate card, keeping each method's objective, constraint, and gradient assumptions visible. | Inspect the bounded projected-gradient trace and the separate exact-gradient rate card; inspect SciPy/CVXPY contract boundaries without treating them as theorem certificates. | Predict which stopping quantity changes; retrieve the theorem-versus-run distinction; transfer by naming why the rate card cannot be inherited by the projected or stochastic trace. Produce the solver-selection rationale. | S02–S04, S09–S11; M28/M29 bridge |
| M31-S05 — Stochastic optimization and nonconvex limits | Connect M30 sampling and uncertainty to empirical risk, mini-batches, stochastic approximation, initialization, stationarity, and validation separation. | Debug an original flawed SGD evidence card with a biased sampler or a leaked validation decision; compare multiple fixed-seed runs. | Predict the hidden failure; retrieve estimator target/bias/variance facts; transfer by replacing an unsupported “converged” statement with a bounded observation. Produce the stochastic-information experiment card. | S07–S08; M30 bridge |
| M31-S06 — Information trade-offs and evidence defense | Reunite the probability model, optimization target, approximation family, finite computation, and decision boundary through entropy, KL, MI, ELBO, and distortion/fit trade-offs. | Derive a small finite categorical KL identity with support labels; audit an original variational or regularized objective. | Predict what changing KL direction or a trade-off weight changes; retrieve support/log-base/family conditions; transfer by explaining what an improved objective still cannot establish. Produce the Optimization & Information Evidence Dossier and learner-controlled oral summary. | S05–S06; M30 bridge |

Every session must preserve the sequence: prediction before reveal; short
first-principles explanation; code-reading, debugging, or design inspection;
counterexample; retrieval; transfer; and a compact evidence artifact. It is
not a solver-typing sequence.

## Numerical, code-reading, and reference-model boundary

The future M31 studio or equivalent interaction may use only small,
independently authored, bounded fixtures. Suitable examples include a
two-variable constrained quadratic, an ill-conditioned least-squares system, a
double-well objective with multiple starts, and a finite categorical
distribution. Do not import third-party homework data, solutions, code, or
datasets.

Every numerical card must expose:

~~~text
question and decision owner
variables, units, domain, objective, constraints, and claimed trade-off
category: smooth/nonsmooth; convex/nonconvex; deterministic/stochastic
claim label, assumptions, and conclusion metric
algorithm/update; initialization; derivative or oracle source; step/penalty rule
fixture/data contract; library/version; dtype; shapes/axes; backend; RNG/seed
stopping condition, tolerances, evaluation budget, and objective/residual traces
independent or analytic check when available; conditioning/finite-precision note
observed result; proven result; assumptions; sensitivity case; non-claim
~~~

Specific code-reading constraints:

- A SciPy card names fun, x0, method, jac/hess source, bounds/constraints,
  options/tolerances, result fields, and exact SciPy version. A return status
  is an implementation observation, not a global-optimality claim.
- A CVXPY card separates mathematical formulation, DCP grammar result,
  canonicalization/solver behavior, and external decision claim. is_dcp()
  cannot validate units, data, objectives, people, or a solver output.
- An autodiff card names primitives, dtype/backend, control-flow/domain
  boundary, plus one analytic directional and finite-difference comparison.
- A stochastic card holds fixture, sampling rule, seed, repeated-run summary,
  and validation boundary visible. It does not transmit learner code or data.
- A bounded reference model has no network, filesystem, subprocess, package
  installation, credential, arbitrary-code, database, or hidden model-call
  capability. It only calculates fixed examples and displays its limitations.

## Visual and accessible-explanation authoring brief

Every instructional diagram must have semantic headings, keyboard-accessible
controls when interactive, visible focus, no color-only meaning, reduced-motion
respect, and a concise text alternative adjacent to it. Source/technical
diagram text alone is not an adequate teaching alternative.

| Planned visual | Question it answers | Required concise prose/table alternative |
| --- | --- | --- |
| Objective geometry sheet | What is optimized, over which feasible region, and in what units? | List variables, domain, hard constraints, each objective term/weight/unit, owner, and the selected candidate’s residuals. |
| Local-to-global landscape panel | Why does a stationary point need more evidence? | Compare four labeled cases: interior convex zero-gradient, saddle, flat non-minimum, and constrained boundary optimum; state the condition that changes the conclusion. |
| Primal/dual certificate bridge | Which quantities support a constrained claim? | Table with primal feasibility, dual feasibility, stationarity, complementary slackness, gap/residual, required regularity, and what a finite tolerance does not prove. |
| Algorithm trace ledger | What did this finite solver run show? | Ordered table of update, initialization, step rule, objective, gradient/residual, constraint violation, stop reason, dtype/tolerance, and non-claim. |
| Noisy-gradient ensemble | How do repeated stochastic runs differ from a theorem? | Table of fixed fixture, seeds, mean/spread, sampling rule, target, bias/variance assumptions, and untested population claim. |
| Information trade-off map | What does a KL/ELBO/distortion change actually mean? | State distributions/support, direction/log base, approximation family or distortion, coefficient/units, observed change, and unresolved model/decision boundary. |

## Diagnostic, retrieval, and misconception design

Future diagnostics should be short, original, multiple-choice, and
confidence-aware. Require a prediction and confidence selection before feedback;
record only learner-controlled local progress.

| Diagnostic target | Plausible misconception to map | Repair move |
| --- | --- | --- |
| Gradient/stationarity | “Zero gradient always proves a minimum.” | Give saddle and boundary cases; ask for domain/convexity conditions. |
| Penalty and feasibility | “A large penalty is the same as a hard constraint.” | Compare a low penalized objective with material residual violation. |
| Duality/KKT | “A small solver gap proves strong duality/KKT.” | Ask for primal/dual construction, regularity, and tolerance boundary. |
| Convergence trace | “Objective decreased, so the algorithm converged globally.” | Label initialization, finite budget, theorem assumptions, and target quantity. |
| Stochastic update | “Unbiased means reliable in one run.” | Separate target, variance/tails/dependence, and repeated-run evidence. |
| KL/ELBO | “Smaller KL or larger ELBO proves correct knowledge.” | Reverse KL direction/support and approximation-family counterexamples. |

Spaced-review prompts should revisit the M28 conditioning distinction, M29
stationarity conditions, M30 expectation/sampling boundary, then require the
learner to explain an M31 claim without looking at the formula.

## Optimization & Information Evidence Dossier

The future project is a compact, inspectable dossier—not a large coding exam.
It uses one synthetic bounded decision/scientific model and one information or
stochastic trade-off card. A learner may use AI to propose a trace or
counterexample, but must inspect it, test a small case, and retain only a
short evidence note they endorse.

| Dossier section | Minimum acceptance evidence | Does not establish |
| --- | --- | --- |
| Formulation and authority | Owner, variables/units, feasible set, objective terms, hard/soft constraints, affected trade-off, and authority/revision boundary. | That the proxy captures all values or authorizes action. |
| Mathematical claim card | Claim label; object/domain; assumptions; derivation/proof idea; one counterexample with a removed assumption. | A broader theorem than the stated hypotheses. |
| Certificate or algorithm card | Primal/dual or update record, initialization, derivative/oracle source, stop rule, residual/gap/gradient quantity, and finite-precision note. | Global optimum, feasibility, or convergence beyond the named evidence. |
| Stochastic/information card | Sampling law/seed/repeated-run summary or distributions/support/log base/KL direction/family; sensitivity case. | Population truth, causality, exact inference, privacy, or usefulness. |
| Recommendation and handoff | Limited next step, known limits, monitoring/revision trigger, and one M32/M33/M34/M35/M36 handoff question. | A final irreversible decision. |

The rubric is constructive: identify present evidence, missing conditions, and
the smallest next check. It is not pass/fail framing.

## TA, Study Partner, and oral-defense protocol

| Role | Required behavior | Must not do |
| --- | --- | --- |
| Teaching Assistant | Ask first for object/domain, owner, assumptions, and claim level; use a hint ladder: identify object -> expose missing condition -> work a smaller synthetic case -> ask learner to restate the bounded claim. Help debug a trace by separating theorem, API contract, and finite observation. | Supply an uninspected proof, silently fill in missing assumptions, call a solver result a certificate, or turn the interaction into surveillance. |
| Study Partner | Read a learner’s claim card aloud in plain language; ask “what would make this false?”; swap a counterexample, then request a one-sentence forward handoff. | Act as an answer key, assign a grade, or pressure disclosure of private data/code/voice. |
| Oral defense | Offer GPT Live only when available and an equal text conversation route. With consent, choose one dossier claim, ask a prediction, follow with an adaptive counterexample and transfer question, then invite reflection. End with a learner-controlled concise evidence summary and recommended next step. | Use pass/fail wording, timed performance pressure, raw transcript retention, or a claim that spoken fluency equals mastery. |

Suggested oral sequence:

1. “Which decision or scientific question does your objective stand in for,
   and what has it left outside?”
2. “Name the narrowest claim your gradient, certificate, or trace supports.”
3. “Which assumption carries that claim? What changes when it is removed?”
4. “Show one counterexample, sensitivity result, or alternate initialization.”
5. “What would M32, M33, M34, M35, or M36 need before relying on this result?”
6. “What evidence do you want to retain, and what is your smallest next check?”

## Release and provenance gates

Keep every item unchecked until an exact reviewed commit supplies the evidence:

- [ ] Canonical graph remains truthful and authoring-only until the full
  structured M31 contract passes; this map alone cannot populate sourceMap or
  release evidence.
- [ ] A source ledger links every learner-facing claim, records access date,
  license/reuse decision, rationale, stable URL, and any asset-level
  attribution/modification decision.
- [ ] Six original connected sessions, workbook, studio or equivalent,
  bounded reference model, diagnostic/retrieval flow, dossier rubric, TA/Study
  Partner prompts, and accessible oral-defense route exist and pass review.
- [ ] Every visual has a concise instructional prose/table alternative, and
  accessibility/browser checks cover the actual interaction rather than only
  source text.
- [ ] Numerical models and teaching-model tests cover their declared
  counterexamples, tolerance/conditioning cases, and safety boundaries.
- [ ] Contract lint, strict typecheck, lint, tests, build, link checks,
  accessibility checks, security/provenance checks, release ledger, reviewed
  Git commit, CI run, changelog entry, and deployment evidence agree.

Until those gates pass, M31 remains planning-only. This map improves
authoring traceability; it does not change learner availability.
