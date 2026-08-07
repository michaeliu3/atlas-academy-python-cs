# Module 31 — Optimization & Information — Source Audit

**Research timestamp:** baseline 2026-07-30; focused calibration follow-up
2026-08-02  
**Scope:** unconstrained and constrained optimization, convexity, convergence
conditions, Lagrangians/duality/KKT, stochastic and nonconvex boundaries,
entropy/KL/information measures, variational objectives, and the planned M31
workbook, studio, bounded reference model, TA clinic, Study Partner handoff,
and constructive oral defense.  
**Status:** instructor-facing research/provenance audit for an
**authoring-only** module. It is not publication evidence, a claim that M31 is
implemented, or permission to reproduce third-party teaching material.

## Verdict

M31 should teach one connected argument, not a list of solvers, formulas, or
information-theory slogans:

```text
decision / scientific question
  → variables, units, target, and authority boundary
  → objective, feasible set, probability model, or information functional
  → geometry and assumptions (smoothness, convexity, support, regularity)
  → algorithm / iterate / finite-precision representation
  → certificate, residual, dual gap, or bounded convergence claim
  → sensitivity, counterexample, and information/decision trade-off
  → limited action and an evidence record
```

An objective is a mathematical proxy, not the real-world goal. A small gradient,
low training loss, feasible-looking point, solver `success` flag, DCP acceptance,
or low KL divergence does not by itself establish global optimality, valid
constraints, calibrated uncertainty, causal benefit, fairness, safety, or
authority to act. The lesson’s central habit is therefore:

> Before optimizing, name *what is being traded*, *which assumptions make the
> trade-off meaningful*, *which finite computation was performed*, and *what
> the result still cannot establish*.

The instructional spine is MIT **6.251J** for formulation/duality-aware
mathematical programming, MIT **6.253** and Stanford **EE364a** for convex
analysis, optimality, duality, and algorithms, and MIT **6.441** for entropy,
divergence, mutual information, variational characterizations, and
rate-distortion. Primary papers make stochastic/nonconvex and variational
inference boundaries explicit. Official SciPy and CVXPY documentation are
implementation-contract sources, never substitutes for the mathematical
conditions of a theorem.

Atlas must author its own explanations, diagrams, numerical fixtures, code
traces, diagnostics, projects, and oral questions. It may link to sources and
narrowly paraphrase their ideas; it must not copy their lectures, figures,
exercise wording, solutions, source code, datasets, or slide layouts.

## Connected prerequisite bridge

M31 is academically after M28, M29, and M30. Each arrow must be visible in the
workbook, studio, source map, route metadata, and forward handoff rather than
being silently assumed.

| Incoming evidence | What M31 reuses | What M31 adds without skipping the bridge |
| --- | --- | --- |
| **M28 — Linear Algebra, Numerical Stability & Representation** | Vectors, matrices, norms, inner products, projections, PSD matrices, eigenvalues, linear systems, conditioning, and the distinction between a problem’s conditioning and an algorithm’s stability. | An objective maps a representation to an ordered value; gradients/Hessians and quadratic forms inherit coordinate/metric/shape choices. Convexity, strong convexity, smoothness, least-squares geometry, and preconditioning become conditional geometric claims. A well-conditioned local algebra step is not proof that the modeled objective, data, or constraints are correct. |
| **M29 — Calculus, Real Analysis & Continuous Change** | Domains, limits, local linear maps, derivatives, gradients/Jacobians/Hessians, chain rule, Taylor remainder, compactness, and numerical approximation/error discipline. | First- and second-order necessary/sufficient conditions become statements about named domains and regularity. Gradient/Newton/trust-region reasoning must state differentiability, Lipschitz/curvature/line-search conditions, initial point, and finite-precision boundary. Constraint qualifications and duality do not follow merely because derivatives can be written down. |
| **M30 — Probability, Statistics & Scientific Inference** | Expectations, likelihood/MAP, sampling/data-generating assumptions, uncertainty, resampling, concentration vocabulary, model criticism, and the distinction between a theorem, procedure, API, simulation, and decision. | Empirical risk, regularization, stochastic gradients, likelihood objectives, entropy/KL, and ELBOs are tied to a declared probability law and population target. A minibatch trace, seed, and loss curve are finite evidence; convergence of an optimizer does not validate a likelihood, estimate, posterior family, or decision cost. |

### Forward connections

| Forward module | M31 contribution | Boundary M31 must preserve |
| --- | --- | --- |
| **M32 — Systems Languages, Scientific Python & Accelerators** | Shape/dtype/axis contracts, vectorized objective evaluation, autodiff traces, reproducible pseudo-random streams, solver configuration, and profiling of optimization work. | M32 owns runtime/back-end/accelerator behavior. M31 does not turn an API result, GPU trace, or seed into a theorem. |
| **M33 — Computation, Complexity & Limits** | Optimization problems as formal inputs; feasibility, certificates, reductions, oracle costs, and the distinction between an algorithmic guarantee and practical termination. | M31 uses simple complexity/cost language but does not establish broad complexity classes, hardness reductions, or oracle lower bounds. |
| **M34 — Classical AI** | Objectives, constraints, utility/cost modeling, information under uncertainty, and a discipline for separating search/planning model assumptions from solver behavior. | M31 does not replace search, graphical-model, MDP/POMDP, planning, or decision-theory treatment. |
| **M35 — Machine Learning & Representation** | Losses, regularization, empirical versus population risk, stochastic optimization, information/representation trade-offs, and a basis for reading optimization code. | Lower training loss, a stationary point, or an ELBO is not a generalization, calibration, robustness, fairness, or deployment guarantee. |
| **M36 — Statistical Learning Theory & Reliable Deep-Learning Systems** | Convergence-language discipline, optimization-versus-generalization separation, information/variational vocabulary, and numerical/implementation evidence records. | M36 owns learning-theory guarantees, deep-learning reliability, distribution-shift evaluation, and system-level safety/reliability arguments. |
| **M25/M26 — Evidence-grounded systems/capstone** | Every system objective needs an owner, target, constraint/authority boundary, evidence/certificate, failure mode, and revisable decision. | An optimization formulation cannot decide whose utility counts or supply authority for a consequential action. |

## Recommended source set

S01–S10 below were checked on 2026-07-30; S11 was checked in the focused
2026-08-02 calibration follow-up. **Link-only** means Atlas may cite and direct
learners to the source but must not import its prose, figures, exercise/problem
wording, solutions, videos, code, or datasets into the deployable product. A
freely readable source is not blanket reuse permission.

| ID | Owner/source and stable URL | Claim linkage and rationale | Access date / license and reuse decision |
| --- | --- | --- | --- |
| **S01** | Dimitris Bertsimas, MIT OpenCourseWare, [6.251J Introduction to Mathematical Programming](https://ocw.mit.edu/courses/6-251j-introduction-to-mathematical-programming-fall-2009/) and its [lecture-note index](https://ocw.mit.edu/courses/6-251j-introduction-to-mathematical-programming-fall-2009/pages/lecture-notes/). | Formulation, linear-optimization geometry, duality, sensitivity, robust and large-scale optimization, interior-point, semidefinite, and discrete-optimization context. It is the practical formulation/duality anchor—not a license to treat every applied problem as a linear program. | Accessed 2026-07-30. MIT OCW material is ordinarily [CC BY-NC-SA 4.0](https://ocw.mit.edu/pages/privacy-and-terms-of-use/) except where an asset says otherwise. Link/cite and author original Atlas material; inspect asset-level notices before any adaptation and do not copy problems/exams/solutions. |
| **S02** | Dimitri Bertsekas, MIT OpenCourseWare, [6.253 Convex Analysis and Optimization](https://ocw.mit.edu/courses/6-253-convex-analysis-and-optimization-spring-2012/), [syllabus](https://ocw.mit.edu/courses/6-253-convex-analysis-and-optimization-spring-2012/pages/syllabus/), and [lecture notes](https://ocw.mit.edu/courses/6-253-convex-analysis-and-optimization-spring-2012/resources/lecture-notes/). | Convexity, duality, saddle-point theory, and convex-optimization algorithms. Use it to locate proof-aware conditions behind subgradients, conjugacy, duality, and convergence—not to imply the full graduate course fits into M31. | Accessed 2026-07-30. MIT OCW **CC BY-NC-SA 4.0** baseline with asset-level caveat. Link-only/original Atlas exposition by default; no imported homework, exams, solutions, or figures. |
| **S03** | Stanford University, [EE364a / CME364a Convex Optimization I](https://web.stanford.edu/class/ee364a/). | A current university-course specification for convex sets/functions/problems, least squares, LP/QP/SDP, optimality conditions, duality, interior-point methods, DCP, and applications. The listed linear algebra/probability/Python prerequisites validate the M28/M30 bridge. | Accessed 2026-07-30. The course page does not grant a blanket asset license; its linked textbook is separately copyrighted. **Link-only.** Do not reproduce slides, videos, homework, exams, answer keys, or course visual design. |
| **S04** | Stephen Boyd and Lieven Vandenberghe, [*Convex Optimization* author/Stanford page](https://web.stanford.edu/~boyd/cvxbook/). | A stable, coherent reference for convex sets/functions, primal/dual problems, KKT conditions, equality/inequality-constrained methods, and numerical algorithms. It supports notation and theorem lookup after the M31 concept card is clear. | Accessed 2026-07-30. The authors’ page states that copyright is held by Cambridge University Press. **Link-only** despite web availability; do not reproduce book text, figures, exercises, solutions, or code without separate permission. |
| **S05** | Yury Polyanskiy and Yihong Wu, MIT OpenCourseWare, [6.441 Information Theory](https://ocw.mit.edu/courses/6-441-information-theory-spring-2016/) and [lecture-note index](https://ocw.mit.edu/courses/6-441-information-theory-spring-2016/pages/lecture-notes/). | Formal source for entropy/divergence, mutual information, conditional information, data processing, variational characterizations of divergence, information projections, saddle-point/rate-distortion viewpoints, and hypothesis-testing boundaries. It supports the information half of M31 without pretending that entropy is merely a loss-function decoration. | Accessed 2026-07-30. MIT OCW **CC BY-NC-SA 4.0** baseline, subject to per-asset notices. Link/cite and write original explanation/visuals/code; do not copy notes, problem sets, exams, or their solutions. |
| **S06** | David M. Blei, Alp Kucukelbir, and Jon D. McAuliffe, [*Variational Inference: A Review for Statisticians* (author-hosted PDF)](https://www.cs.columbia.edu/~blei/papers/BleiKucukelbirMcAuliffe2017.pdf) and [published DOI](https://doi.org/10.1080/01621459.2017.1285773). | Primary scholarly anchor for variational inference as optimization over an approximating family using KL divergence, mean-field assumptions, stochastic optimization, and its unresolved/approximation boundaries. It grounds the ELBO identity and does not support a generic claim that variational inference is exact. | Accessed 2026-07-30. Published-version rights are publisher-controlled; the author-hosted manuscript has no blanket reuse license stated here. **Link-only.** Do not reproduce text, figures, tables, proofs, or examples. |
| **S07** | Herbert Robbins and Sutton Monro, [*A Stochastic Approximation Method*](https://doi.org/10.1214/aoms/1177729586). | Original source for stochastic approximation. Use as a provenance anchor for the fact that a noisy/root-finding iteration needs named stochastic conditions and step-size reasoning—not a magic “SGD converges” slogan. | Accessed 2026-07-30. Journal/publisher rights apply. **Link-only.** Cite only the scope actually used and retain all convergence assumptions in Atlas-authored paraphrase. |
| **S08** | Saeed Ghadimi and Guanghui Lan, [*Stochastic First- and Zeroth-order Methods for Nonconvex Stochastic Programming*](https://doi.org/10.1137/120880811) and [author preprint record](https://arxiv.org/abs/1309.5549). | Primary nonconvex/stochastic boundary: under stated smoothness/noise/oracle conditions, an algorithm can target an approximate stationary point; that is weaker than a global-optimum result. It supplies a precise antidote to loss-curve overclaims. | Accessed 2026-07-30. SIAM publication rights / arXiv distribution do not authorize wholesale reuse. **Link-only.** Do not copy equations, proofs, figures, or experimental setups; Atlas examples must be independently authored. |
| **S09** | SciPy Developers, [`scipy.optimize.minimize`](https://docs.scipy.org/doc/scipy/reference/generated/scipy.optimize.minimize.html), [`trust-constr`](https://docs.scipy.org/doc/scipy/reference/optimize.minimize-trustconstr.html), and [licensing guidance](https://docs.scipy.org/doc/scipy/dev/core-dev/index.html#licensing). | Versioned Python API contracts for scalar objectives, initial points, derivatives, bounds/constraints, methods, and documented stopping/tolerance fields. `trust-constr` exposes a Lagrangian-gradient and constraint-violation termination rule; that is implementation evidence, not a universal KKT certificate. | Accessed 2026-07-30. SciPy is modified **BSD 3-clause** unless a source file says otherwise. Direct code reuse requires required notices; Atlas defaults to original short examples and pins package/version. A returned status never validates the objective/model/constraints. |
| **S10** | CVXPY authors, [Disciplined Convex Programming tutorial](https://www.cvxpy.org/tutorial/dcp/) and [Apache-2.0 project license](https://www.cvxpy.org/version/1.2/license/index.html). | Official implementation source for DCP expression/shape/curvature checking and a useful code-reading contrast: a grammar may conservatively reject a mathematically convex expression, and its acceptance is not a real-world model validation. | Accessed 2026-07-30. CVXPY publishes an **Apache-2.0** project license; verify current/third-party notices before reusing a specific asset. Atlas examples remain original. DCP acceptance is an implementation-level structural result, not proof of data, units, constraints, solver result, or deployment safety. |
| **S11** | CMU, [10-725 Convex Optimization](https://stat.cmu.edu/~siva/teaching/725/). | Focused course-sequence calibration for M31 Session 2’s least-squares/conditioning card and Session 4’s exact-gradient versus projected/stochastic theorem boundary; it also cross-checks the KKT/duality and nonconvex progression. It does not source a theorem proof or authorize reused course assets. | Accessed 2026-08-02. The course page provides no blanket asset license. **Link-only**; keep all Atlas fixtures, derivations, prose, diagrams, questions, and code original. Do not copy notes, assignments, figures, solutions, or code. |

### Source selection boundary

The sources serve different kinds of claims:

| Evidence level | Can support | Cannot support by itself |
| --- | --- | --- |
| Formal theorem/proof or primary research result (S02, S05–S08) | A conclusion for the named mathematical objects, hypotheses, oracle/model, and conclusion metric. | That Atlas’s finite code, dtype, data, objective, or deployment meets those hypotheses. |
| University/open course (S01–S05) | A coherent instructional sequence, notation, scope, and authoritative course context. | Permission to copy all assets, a guarantee of learner mastery, or a library-behavior promise. |
| Official library documentation (S09–S10) | Inputs, outputs, shape/solver/tolerance semantics, and a named version’s documented behavior. | Global optimality, KKT applicability, statistical validity, ethical legitimacy, or a theorem beyond the API contract. |
| Bounded Atlas numerical model | Behavior of a named fixture, seed, machine/browser, dtype, solver configuration, and run. | A universal convergence result, population conclusion, or real-world benefit. |
| AI-generated derivation, code, or explanation | A candidate artifact to inspect, test, and improve. | Authority, correctness, provenance, missing assumptions, or permission to reuse external material. |

## Claim and assumption boundaries

The planned workbook, studio, diagnostic, project, TA session, and oral defense
must keep these distinctions explicit.

| Topic | Safe learner-facing statement | Required hypotheses, counterexample, or evidence label |
| --- | --- | --- |
| Objective, variables, and feasible set | Optimization chooses a candidate from a declared domain/feasible set according to a declared objective. The objective encodes a trade-off; it is not automatically the real-world goal. | Name decision owner, variables/units, population/time scope, objective terms, constraint type, weight/penalty meaning, and who can change each term. Counterexample: a low numerical loss with omitted harm, proxy drift, or a violated hard constraint. |
| Local versus global minima | A local minimum is relative to a neighborhood and domain; a global minimum is relative to the whole feasible set. Convex geometry can make local/global statements coincide under stated conditions. | Name the feasible set, topology/norm, differentiability/convexity assumptions, and whether an existence result is needed. A plot/finite grid cannot establish globality in an unrestricted domain. |
| Unconstrained first-order condition | At an interior local minimizer of a differentiable objective, the gradient must vanish. For a differentiable convex objective, a zero gradient certifies a global minimizer; stronger assumptions can give uniqueness. | State differentiability, interior/domain condition, convexity, and norm/coordinate convention. Counterexamples: a stationary saddle, maximum, flat non-minimum, or boundary optimum. `grad == 0` in floating point means only a tolerance-based observation. |
| Second-order reasoning | A Hessian/curvature condition can classify a sufficiently regular local point or provide a local model; positive semidefiniteness alone need not prove a strict local minimum. | State twice differentiability/neighborhood and exact condition used; distinguish Hessian eigenvalues of a finite matrix from a global functional claim. Include a semidefinite/flat or higher-order counterexample. |
| Convexity, strong convexity, smoothness | Convexity bounds a function by its chords; strong convexity and Lipschitz-gradient smoothness are quantitative assumptions that can yield uniqueness/rates for specified methods. | Name domain, norm, constants, differentiability/subgradient version, and how a bound is established. Never infer global convexity or a rate from sampled curvature or one successful solver run. |
| Gradient, proximal, Newton, and line/trust-region methods | An algorithm produces an iterate sequence according to a specified update rule and information source. A convergence theorem connects that sequence to an objective/residual only under named conditions. | Record update, step-size/line-search/trust-region rule, exact/inexact derivative, initial point, lower-bound/existence condition, smoothness/convexity/strong-convexity assumptions, stopping criterion, and quantity claimed to converge. A monotone-looking objective trace is a finite experiment, not the theorem. |
| Constraints and feasibility | Equality, inequality, bound, integer, and probabilistic/chance constraints have different geometry and solution concepts. Penalizing a constraint changes the problem unless an exact equivalence is proved under stated conditions. | Write primal problem, sign conventions, feasibility residual/norm, domain, and hard-versus-soft status. Counterexample: a low penalized objective with material constraint violation. Do not replace a feasibility certificate with a visually plausible point. |
| Lagrangian, weak duality, and strong duality | A Lagrangian introduces multipliers to relate a constrained primal problem to a dual bound. Weak duality is a bound relation under its defined primal/dual construction; zero duality gap/strong duality require additional conditions. | State primal/dual definitions, feasible domains, sign convention, finiteness/attainment assumptions, and the named regularity condition (for example an appropriate Slater condition in a convex setting). A numerical small gap is finite evidence, not a proof that all assumptions or modeling choices are valid. |
| KKT conditions | KKT combines primal feasibility, dual feasibility, stationarity, and complementary slackness. It can be necessary under an applicable constraint qualification; with the appropriate convexity/regularity conditions it can be sufficient for global optimality. | Name differentiability/subgradient setting, constraint qualification, convexity, multiplier convention, and solver tolerance. In a nonconvex problem, a KKT point need not be globally optimal; in a degenerate problem KKT may fail to be necessary. |
| Regularization and multi-objective scalarization | Adding \(\lambda R(\theta)\) or scalarizing several objectives selects a new trade-off problem, not an automatically better or neutral solution. | Name the base loss, regularizer/units, parameterization, scale, \(\lambda\), validation/selection procedure, and affected stakeholders. A regularization weight is neither a moral preference nor a generalization guarantee by itself. |
| Stochastic optimization | A stochastic update uses a random/noisy estimate of some target direction or objective. Under specific conditions it may obtain an expectation/high-probability/stationarity guarantee. | State target population objective, sampling mechanism, estimator bias/unbiasedness, variance/tail/dependence assumptions, minibatch, RNG/seed, step schedule, stopping rule, and guarantee metric. A loss reduction in one seeded run is not convergence, consistency, or a population result. |
| Nonconvex optimization | In a general nonconvex landscape, a converged/stationary point need not be globally optimal and may depend on initialization, parameterization, noise, and stopping policy. | State smoothness/oracle/constraint assumptions and whether the result concerns objective value, gradient norm, stationarity, local minimum, saddle avoidance, or global minimum. Use a small multiple-start counterexample; do not promise that “SGD escapes all bad minima.” |
| Entropy | For a declared discrete distribution and log base, entropy measures average self-information in bits/nats. Differential entropy is a different object with different invariance/sign behavior. | State random variable, distribution/support, log base/units, and discrete versus continuous setting. Entropy is not a universal measure of “usefulness,” “complexity,” privacy, or epistemic uncertainty. |
| KL divergence and cross-entropy | \(D_{KL}(p\Vert q)\) compares named distributions in a chosen direction; it is nonnegative under the relevant support/integrability conditions and is generally asymmetric, possibly infinite. Cross-entropy identities require the corresponding support/expectation conditions. | State which distribution is target/model, support/absolute-continuity condition, direction, log base, empirical versus population measure, and finite-sample estimator. Counterexample: swapped KL direction or model assigning zero mass where target has mass. |
| Mutual information and data processing | Mutual information is defined from a joint law and its marginals; a data-processing statement needs the named Markov/conditional-independence structure. | State joint distribution, variables, conditioning, and sampling/model assumptions. Correlation, a learned representation, or a mutual-information estimate does not establish causality, privacy, semantic understanding, or an intervention effect. |
| Variational inference / ELBO | When the required distributions and expectations exist, the ELBO identity relates log evidence to an approximation gap expressed as \(D_{KL}(q(z)\Vert p(z\mid x))\). Maximizing ELBO improves that reverse-KL objective within a chosen family. | State generative model, observed data, latent variables, variational family/support, KL direction, approximation family, estimator, and optimization boundary. An optimized ELBO does not mean exact posterior inference, calibrated uncertainty, correct model specification, or mode coverage. |
| Information/representation trade-offs | Objectives such as distortion plus a weighted information term express a specified mathematical trade-off under a declared distribution, distortion, and coefficient. | State data-generating law, encoder/decoder/reconstruction space, distortion/utility, coefficient and units, finite-sample estimator, and stakeholder trade-off. A chosen weight cannot silently define human value, fairness, privacy, or safety. |

## Source-to-six-session map

The six sessions must be connected: formulation creates the object; geometry
makes a claim about it; constraints add certificates; algorithms make it
computable; stochastic/nonconvex settings expose limits; information and
variational objectives reunite probabilistic modeling with optimization.

| Session | First-principles question and required concepts | Core sources | Original Atlas evidence move and boundary |
| --- | --- | --- | --- |
| **1 — What are we allowed to optimize?** | What decision is represented by variables, objective, feasible set, and trade-off? Distinguish minimization/maximization, hard/soft constraints, units/scales, feasibility, and objective-versus-goal. | S01, S03; M28/M30 bridge. | Read a small resource-allocation formulation, annotate owner/units/constraints, then repair a proxy objective that omits a hard safety condition. Prediction before reveal: decide whether a penalty has changed the original problem. |
| **2 — Why do local equations sometimes prove global claims?** | Connect M29 local linearization to first-/second-order conditions, convex sets/functions, strong convexity, smoothness, subgradient intuition, and quadratic geometry. | S02–S04; M28/M29 bridge. | Code-read a two-dimensional least-squares/regularized objective. Predict the next gradient step and classify three stationary points. Include a boundary/saddle counterexample and distinguish analytic derivative, AD trace, and finite difference. |
| **3 — How do constraints become certificates?** | Build Lagrangians; distinguish primal/dual; cover weak/strong duality, regularity, KKT components, complementary slackness, sensitivity/shadow-price language, and failure cases. | S01–S04. | Hand-derive a tiny convex constrained problem with every sign convention visible; test primal/dual feasibility and residuals. Oral prompt: identify the missing constraint qualification before claiming strong duality. |
| **4 — What does an algorithm’s stopping record mean?** | Trace gradient, projected/proximal, Newton, and trust-region/line-search ideas; formulate convergence statements and numerical/stopping evidence. | S02–S04, S09–S10; M28/M29 numerical boundary. | Compare the same small convex objective under two initial points/step rules and record objective, gradient/residual, feasibility, dtype, tolerance, and condition warning. A `success` flag is labeled “implementation result,” not “proof.” |
| **5 — What changes when gradients are noisy or the landscape is nonconvex?** | Connect M30 sampling to empirical risk, minibatches, stochastic approximation, initialization, stationarity, saddle/local/global distinctions, and validation separation. | S07–S08; S03 for stochastic-programming context; M30 bridge. | Read a deliberately flawed SGD trace (biased batch sampler, leaked validation choice, or unsupported convergence claim), predict the failure, and repair its evidence record. Compare multiple fixed-seed initializations without treating them as a theorem. |
| **6 — What is information buying or losing?** | Define entropy, KL, cross-entropy, mutual information, information projection, ELBO, and a distortion/information or fit/complexity trade-off. Relate probability model, objective, approximation family, and decision boundary. | S05–S06; M30 bridge. | Produce an Optimization & Information Evidence Dossier: derive a small discrete KL/ELBO identity with support labels; audit a variational or regularized objective; state what an improved finite objective does and does not establish. Close with a constructive oral defense and forward handoff. |

## Numerical, code-reading, and reference-model boundaries

M31 is understanding-first. Computational work is used to make an argument
inspectable; it is not a contest to type an optimizer from scratch.

### Required evidence record for every numerical card

```text
decision/scientific question and owner
variables, units, domain, objective, constraints, and claimed trade-off
mathematical category: smooth/nonsmooth; convex/nonconvex; deterministic/stochastic
theorem or heuristic label, with named assumptions and conclusion metric
algorithm/update rule; initialization; derivative/oracle source; step/penalty rule
representation: library/version, dtype, shapes, axis convention, backend, hardware-sensitive note
fixed synthetic fixture or approved local data contract; RNG algorithm/seed/minibatch rule
stopping criteria, tolerances, iteration/evaluation budget, objective/residual/constraint trace
analytic or independent check when available; conditioning and finite-precision warning
what was observed, what was proved, what is assumed, and what a new run could falsify
```

### Code-reading rules

- Use small, original fixtures: for example a two-variable constrained quadratic,
  a visibly ill-conditioned least-squares system, a double-well nonconvex toy
  objective, and a finite categorical distribution. Do not import external
  course data, homework, or solution code.
- A card using `scipy.optimize.minimize` must expose the `fun`, `x0`, method,
  `jac`/`hess` source, bounds/constraints, options/tolerances, result fields,
  and SciPy version. Its reading task asks whether the stop condition addresses
  objective improvement, Lagrangian-gradient residual, feasibility, a trust
  radius, or a barrier parameter.
- A CVXPY card must distinguish: (1) the mathematical formulation, (2) its
  DCP grammar classification, (3) canonicalization/selected solver behavior,
  and (4) the external decision claim. `is_dcp()` is neither an objective audit
  nor a certificate that a solution is useful or correctly measured.
- An AD card must say that a program derivative relies on the named primitives,
  dtype/backend, control-flow semantics, and input domain. It should compare an
  analytic directional check and a carefully chosen finite-difference check;
  it must not equate an AD gradient with model validity.
- A stochastic card must hold data fixture and seed visible, use learner-chosen
  repeated runs where useful, and distinguish a reported mean/variation from a
  population guarantee. It must never transmit code/data or execute arbitrary
  user code.
- A bounded reference model may calculate fixed examples only. It must have no
  network, filesystem, subprocess, package-install, database, credential,
  arbitrary-code, or hidden model-call behavior. Its limitations must be
  learner-visible.

## Deliberate exclusions and handoffs

- M31 provides an advanced bridge, not a complete graduate sequence in convex
  analysis, nonlinear programming, variational analysis, optimal control,
  stochastic control, operations research, information theory, or Bayesian
  computation.
- It can introduce the definition and purpose of subgradients, conjugates,
  proximal maps, Fenchel/Lagrangian duality, and KKT under small examples. It
  does not promise full proofs of separation theorems, general constraint
  qualifications, variational inequalities, saddle-point theory, or all
  primal-dual algorithm rates.
- It can show standard convergence *templates* and prove/read a small result
  only with all conditions on the page. It does not claim a universal rate for
  GD/SGD/Adam-like methods, universal saddle escape, global nonconvex
  optimality, or solver-independent floating-point reproducibility.
- It treats entropy/KL/mutual information and a finite ELBO/rate-distortion
  story rigorously enough to reveal direction/support/approximation trade-offs.
  It does not cover complete coding theorems, measure-theoretic information
  theory, universal compression, advanced variational families, MCMC, normalizing
  flows, or information-bottleneck/deep-representation research in full.
- M32 owns accelerators, compiler/runtime behavior, distributed numerical
  systems, and extensive scientific-Python/JAX/PyTorch implementation detail.
- M33 owns computability/complexity theory and formal hardness/lower-bound
  arguments. M34 owns planning/search/decision systems. M35/M36 own the ML
  algorithm catalog, generalization theory, learning-system reliability, and
  deployment evaluation.

## Original-material and learner-privacy policy

1. **Atlas material stays original.** Write fresh prose, diagrams, tables,
   code traces, Python fixtures, quizzes, projects, TA prompts, Study Partner
   prompts, oral-defense branches, and visual styling. Sources are cited for
   study and provenance, not copied into the product.
2. **No hidden textbook/course substitution.** Do not reproduce MIT/Stanford
   lecture slides, videos/transcripts, problem/exam sets, solutions, textbook
   figures, or distinctive worked examples. A derived idea must be re-explained
   in an independently constructed example and linked to its source.
3. **License review precedes asset reuse.** Before retaining any non-original
   asset, record owner, exact URL/version/page, access date, license,
   attribution, modification status, third-party notices, distribution decision,
   and whether the private deployment’s use is compatible with the license.
4. **No surveillance by pedagogy.** The studio stores only optional, minimal,
   local progress using the shared progress codec. It sends no learner data,
   code, voice, transcript, or project work to a network service. Any Notion
   export/write is learner-approved and limited to a concise evidence summary.
5. **AI remains a proposal source.** A Teaching Assistant or Study Partner may
   suggest a derivation, counterexample, code trace, or revision. The learner
   must inspect assumptions, test a small case, and choose whether to retain a
   short evidence note; AI output is not an authority or a source ledger entry.

## Release checklist

- [ ] The canonical graph has M31 as authoring-only until its structured module
  contract, learner material, studio/equivalent interaction, source-map link,
  tests, oral-defense flow, and release evidence all pass. This audit alone
  does not change lifecycle status.
- [ ] M28 → M29 → M30 → M31 arrows and their exact bridge claims appear in the
  route, module metadata, workbook, studio, prerequisite display, and forward
  handoff. Navigation must not silently bypass them.
- [ ] Six connected sessions each include prediction before reveal,
  first-principles explanation, code-reading/debugging/design work, transfer,
  retrieval prompt, and confidence-aware diagnostic evidence—not a detached
  solver tutorial.
- [ ] Every theorem/claim card names objects/domain, assumptions, conclusion,
  condition type (necessary/sufficient/heuristic/API/finite experiment), and a
  counterexample or removed-assumption prompt.
- [ ] Every constrained card distinguishes hard constraints from penalties,
  shows primal feasibility/residuals and sign conventions, and never calls a
  numerical point “KKT/global optimum” without the named conditions/certificate.
- [ ] Every convergence card records its algorithm, initialization, derivative
  source, step/tolerance/budget, required regularity/oracle assumptions, and
  convergence quantity. It distinguishes objective decrease, stationarity,
  feasibility, dual gap, local/global optimality, and a solver stop flag.
- [ ] Every entropy/KL/ELBO card states distribution/support, log base/units,
  KL direction, population versus empirical measure, approximation family, and
  what an optimized surrogate does not establish.
- [ ] Numerical cards expose fixture, seed, library/version, dtype, shapes,
  tolerances, backend note, output/residuals, independent check where possible,
  finite-precision caveat, and a failure/sensitivity case.
- [ ] All diagrams have semantic structure plus concise learner-facing prose or
  table alternatives; visuals support keyboard use, screen readers,
  reduced-motion/forced-colors modes, and no mouse/timed/audio-only requirement.
- [ ] Diagnostic MCQs are original, confidence-aware, and map each distractor
  to a misconception plus targeted repair. The project/dossier has acceptance
  criteria and an evidence rubric.
- [ ] The oral defense is psychologically safe and constructive: learner
  consent, GPT Live if available, an equivalent accessible text route, hint
  ladder, counterexample, transfer question, reflection, no pass/fail framing,
  and a learner-controlled evidence summary. The TA and Study Partner packages
  are M31-specific and hand off to M32/M33/M34/M35/M36 appropriately.
- [ ] All cited URLs, licenses, versions, and asset-level notices are rechecked
  at release. The source ledger records rationale, claim linkage, access date,
  reuse decision, and stable learner-facing links.
- [ ] Module-contract validation, lint, strict typecheck, unit/teaching-model
  tests, build, link checks, accessibility/browser checks, and relevant
  security/provenance gates pass on the exact reviewed Git commit. Record CI
  run, source ref, known limitations, changelog entry, and deployment evidence
  before describing M31 as published.

## Instructor decision rule

Ask first: **“What exactly would have to be true for this optimization or
information number to justify the claim you are making?”** If the learner has
an objective but no decision owner, request the affected party and trade-off.
If they have a gradient but no domain/regularity statement, request the
theorem’s hypotheses. If they have a KKT-looking tuple but no constraint
qualification/convexity argument, request the missing condition. If they have
a loss curve, DCP check, solver status, KL estimate, or ELBO but no
representation/probability/finite-run record, request the implementation
contract and a sensitivity case. If they propose an action, request authority,
benefit/harm, reversibility, monitoring, and a reason to revise.

M31 succeeds when the learner can turn “the optimizer/information metric says
this” into a compact, inspectable argument: what was modeled, which geometry
or probability law carried the claim, which algorithm and finite computation
produced the number, which assumption could fail, and which limited decision
the evidence actually earns.
