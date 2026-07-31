# Module 29 — Calculus, Real Analysis & Continuous Change: Source Map

## Document status

- **Purpose:** source, claim, licensing, and teaching map for the M29 workbook,
  Limits, Change & Convergence Studio, diagnostic, Continuous-Change Evidence
  Dossier, bounded Python teaching model, oral defense, TA/Study Partner
  routines, the direct forward handoff to M30, and later conceptual bridges to
  M31–M32.
- **Course position:** M29 follows M27's quantified proof/counterexample
  boundary and M28's norm, linear-map, and finite-representation boundary. In
  the learner route it follows M28 and its canonical forward module is M30;
  its academic prerequisites remain M27 and M28. M31–M36 are later conceptual
  consumers, not previous/next navigation or a learner-path bypass.
- **Research snapshot:** **2026-07-30**. Exact URLs, editions, licenses, and
  API behavior must be rechecked before reusing an external asset, quoting a
  source, or making a current-library claim.
- **Reader-first rule:** preserve mathematical difficulty while making the
  reasoning path visible: declared object/metric → precise claim/quantifiers →
  derivation/theorem → smallest counterexample → finite algorithm/API boundary
  → design transfer. A graph, animation, or code run earns attention only when
  it exposes assumptions; it never replaces proof or error analysis.
- **Copyright boundary:** Atlas prose, diagrams, fixtures, code-reading cases,
  diagnostics, counterexamples, project briefs, studio designs, and oral
  prompts are original. Link to and narrowly paraphrase external resources.
  Do not copy substantial prose, figures, slides, videos, exercises,
  solutions, datasets, or source code without asset-level licensing,
  attribution, modification, and distribution review.

This is an instructor-facing evidence record, not a learner-facing textbook or
a claim that six sessions produce full real-analysis, measure-theory,
differential-equations, numerical-analysis, or optimization mastery.

---

## Executive teaching decision

Calculus becomes disconnected when it is taught as a series of commands:
differentiate, integrate, find a gradient, plug in a Taylor series, call a
solver, then trust the plot. That route hides the common object: a declared
function/map between spaces with a chosen topology/metric, whose local or
limiting property may be approximated by a finite program but is not defined
by that program.

M29 instead builds this chain:

~~~text
domain, codomain, units, coordinate convention, metric/norm
    → quantified limit, continuity, compactness, local/global scope
    → derivative as a local linear map; MVT/Taylor remainder
    → integral as controlled accumulation; multiple region and coordinate map
    → gradient/Jacobian/Hessian and chain rule under a declared convention
    → sequences/series; pointwise versus uniform convergence
    → legal conditions for exchanging a limit, derivative, integral, expectation
    → constrained candidates and continuous-time/ODE approximation
    → finite difference, quadrature, autodiff, or solver evidence
    → bounded representation/design decision with human-impact non-claim
~~~

### Required M29 invariant

> **A continuous-change conclusion is trustworthy only after the domain,
> limiting process, norm or metric, regularity assumptions, approximation or
> algorithm, and error boundary are named. A finite sample, symbolic
> derivative, autodiff result, numerical integral, and theorem are different
> kinds of evidence.**

This contract refuses several shortcuts: a finite plot is not a continuity
proof; a derivative does not give global linear behavior; a numerical solver
status does not validate an ODE model; an AD gradient does not prove the graph
captures the intended objective; and an expectation/interchange cannot be
licensed by a large-looking simulation alone.

### Evidence hierarchy

| Rank | Evidence type | It may support | It cannot settle alone |
| --- | --- | --- | --- |
| 1 | Definitions plus proof/theorem under stated hypotheses | Exact conclusion on the declared domain/metric/function class. | Whether code, data, or a real system satisfies the hypotheses. |
| 2 | First-party university/open-author material | A coherent undergraduate/proof-aware learning sequence and notation route. | A universal canonical order or right to reuse every asset. |
| 3 | Numerical-analysis source with an explicit model/error statement | Discretization, conditioning/stability vocabulary, and specified algorithmic scope. | Other algorithms, versions, hardware, tolerance policy, or model validity. |
| 4 | Official library documentation | Named API inputs, axes, tolerances, returns, and documented procedure. | A theorem, global accuracy, causal interpretation, or suitable objective. |
| 5 | Bounded model, notebook, visualizer, or benchmark | Behavior for named fixture, representation, method, dtype, and run. | A universal limit/convergence theorem or real-world conclusion. |
| 6 | AI-generated derivation/code/review | A candidate proof, patch, test, or visualization to inspect. | Authority, correct hypotheses, provenance, or permission to omit verification. |

---

## Coverage ledger: every required topic has a source-backed learning move

| Required area | Formal nucleus | Open / primary route | Mandatory learning move | Implementation / evidence boundary |
| --- | --- | --- | --- | --- |
| Single-variable limits and \(\varepsilon\)-\(\delta\) | Quantifier order; punctured neighborhoods; one/two-sided/domain boundary. | S01, S03, S04 | Repair a swapped-quantifier claim; prove one affine limit; create a removable-discontinuity counterexample. | A graph or finite grid is a finite experiment, not a universal neighborhood proof. |
| Continuity, IVT, EVT, compactness, introductory metric spaces | Metric/open ball; continuity; compact domain; intermediate/extreme-value hypotheses. | S03, S04 | Name the metric/domain; distinguish closed-and-bounded in \(\mathbb R^n\) from general compactness; remove one hypothesis. | Plotted smoothness is not continuity; a bounded/open or unbounded/closed domain can change existence of extrema. |
| Derivative, MVT, Taylor expansion/remainder | Difference quotient; Fréchet/local-linear remainder; MVT hypotheses; Taylor error. | S01, S03, S04 | Derive a finite difference for a polynomial and bound/interpret a Taylor remainder on a named interval. | Symbolic/algebraic derivative and finite-difference estimate are different claims; step-size and cancellation matter. |
| Riemann integration, FTC, multiple integrals | Controlled sums; interval/region; accumulation units; FTC regularity. | S01, S02, S03, S04 | Draw a region before iterated bounds; distinguish analytic integral from quadrature. | A return value/error estimate is a procedure observation, not integrability/model validation. |
| Change of variables | Regular coordinate map, Jacobian, absolute determinant, domain partition/injectivity. | S02, S03 | Map a unit square through a 2D linear transform; explain orientation and area factor. | A determinant zero/many-to-one map requires a revised argument; axes/units carry semantics. |
| Partial derivatives, gradients, Jacobians, Hessians, chain rule | Differential as linear map; metric-dependent gradient; coordinate convention; second-order form. | S02, S03, S04 | Narrate shapes of a batched loss, its unbatched Jacobian, and a chain-rule product; explain a Hessian test boundary. | Existing partials need not imply differentiability; an array shape match is not semantic correctness. |
| Constrained extrema | Regular equality constraint; \(\nabla f=\lambda\nabla g\); feasibility/boundary/classification. | S02, S03 | Derive circle constrained candidates and distinguish candidate from optimum. | A stationary/regularity equation is not a global optimization result or policy objective. |
| Sequences and series | Metric convergence; partial sums; absolute/convergence conditions. | S03, S04 | Show term-to-zero is necessary but not sufficient; write partial-sum/tail contract. | A terminating loop and floating sum do not prove series/uniform convergence. |
| Pointwise versus uniform convergence; operation exchanges | Quantifier order; supremum error; uniform limit continuity; named interchange theorems. | S03, S04 | Use \(x^n\) on \([0,1]\) and \([0,r]\); request a missing derivative/integral/expectation hypothesis. | Pointwise convergence alone does not preserve continuity, integral, derivative, or expectation exchange. |
| Expectations/integrals interchange boundary | Dominated/Fubini/Tonelli-style conditions are named future routes, not magic. | S03, S04, M30 handoff | Classify an AI claim and name a theorem/hypothesis route; no fake proof beyond course scope. | M29 does not claim full measure/probability theory; M30 owns expectation/measurability/inference. |
| Numerical differentiation/integration | Discretization/truncation/roundoff/conditioning; method/tolerance contract. | S05, S06, S07, S08 | Compare analytic, finite-difference, and quadrature evidence; label theorem/API/experiment. | Smaller step not universally better; API error estimates are not global proof. |
| Automatic differentiation | JVP/VJP/gradient of a declared program graph; implementation/semantic boundary. | S09 | Audit reduction axis, shape, branch, dtype, and objective before accepting an AD gradient. | AD does not validate a model, objective, nonsmooth branch, or optimizer stability. |
| ODE initial-value approximation | Rate law + initial condition; method/step/local/global error boundary. | S05, S06, S08 | Compare Euler step sizes on an exact small fixture; write an ODE evidence memo. | `success`, adaptive steps, or one smooth trace is not model validation/existence/uniqueness/global accuracy proof. |

### Deliberate exclusions and handoffs

- M29 introduces metric-space vocabulary and selects real-analysis theorems
  needed to read CS/AI mathematics. It does not claim a complete course in
  set-theoretic topology, measure theory, Lebesgue integration, functional
  analysis, PDEs, manifolds, or dynamical systems.
- M30 owns probability spaces, random variables, measurable functions,
  expectation, law/central-limit theory, concentration, statistics, and
  inference. M29 only teaches the discipline for requesting an interchange
  theorem and its hypotheses.
- M31 owns convex/nonconvex/constrained optimization, duality/KKT, algorithms,
  convergence rates, and information theory. M29 introduces local curvature
  and Lagrange candidate reasoning as the conceptual prerequisite.
- M32 owns production NumPy/SciPy/JAX/PyTorch semantics, accelerator/mixed
  precision, performance, reproducible environments, and deployed solver/AD
  code. M29 treats dtype, shape, step size, and tolerance as an evidential
  contract.
- M35/M36 own statistical learning, optimization behavior, evaluation,
  generalization, and theory. M29 rejects gradient/simulation/PCA-style
  interpretation shortcuts before those modules expand them.

---

## Source cards

### S01 — MIT 18.01SC, *Single Variable Calculus* (Fall 2010)

- **Owner/status:** Massachusetts Institute of Technology OpenCourseWare;
  first-party university calculus sequence.
- **URLs:**
  - [course home](https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/)
  - [syllabus](https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/pages/syllabus/)
  - [MIT OCW terms](https://ocw.mit.edu/pages/privacy-and-terms-of-use/)
- **Supports:** a connected introductory path through limits/continuity,
  derivative/MVT, integral/FTC, numerical integration, and Taylor series.
- **Course use:** optional deepening/reference sequence for Sessions 1–3;
  original Atlas explanations, fixtures, diagrams, and questions only.
- **Reuse/license:** MIT OCW identifies its own course material as CC BY-NC-SA
  4.0 subject to item-specific/third-party notices. Default: link + original
  paraphrase; do not import exercises, exams, solutions, or figures.
- **Claim boundary:** supplies a curriculum/explanatory route, not a proof
  specification or evidence of six-session mastery.

### S02 — MIT 18.02SC, *Multivariable Calculus* (Fall 2010)

- **Owner/status:** MIT OCW; first-party multivariable-calculus course.
- **URLs:**
  - [syllabus](https://ocw.mit.edu/courses/18-02sc-multivariable-calculus-fall-2010/pages/syllabus/)
  - [partial derivatives](https://ocw.mit.edu/courses/18-02sc-multivariable-calculus-fall-2010/pages/2.-partial-derivatives/)
  - [course home](https://ocw.mit.edu/courses/18-02sc-multivariable-calculus-fall-2010/)
  - [MIT OCW terms](https://ocw.mit.edu/pages/privacy-and-terms-of-use/)
- **Supports:** tangent approximations, partials, gradient/directional
  derivatives, chain rule, Lagrange multipliers, multiple integrals, and
  coordinate changes.
- **Course use:** Sessions 3–4 and constrained-extrema bridge in Session 6.
- **Reuse/license:** CC BY-NC-SA 4.0 baseline, with asset-specific checks;
  link/cite and create original visuals/questions by default.
- **Claim boundary:** a multivariable learning route does not establish an
  autodiff implementation's shapes, semantics, or stability.

### S03 — MIT 18.100A, *Real Analysis* (Fall 2020)

- **Owner/status:** MIT OCW; proof-oriented real-analysis course.
- **URLs:**
  - [course home](https://ocw.mit.edu/courses/18-100a-real-analysis-fall-2020/)
  - [syllabus](https://ocw.mit.edu/courses/18-100a-real-analysis-fall-2020/pages/syllabus/)
  - [lecture notes and readings](https://ocw.mit.edu/courses/18-100a-real-analysis-fall-2020/pages/lecture-notes-and-readings/)
  - [MIT OCW terms](https://ocw.mit.edu/pages/privacy-and-terms-of-use/)
- **Supports:** completeness, sequences/series, limits/continuity, IVT/EVT,
  derivative/MVT/Taylor, Riemann integration/FTC, and uniform convergence.
- **Course use:** proof-aware spine for Sessions 1, 2, and 5; optional
  deepening that keeps operation-exchange hypotheses visible.
- **Reuse/license:** CC BY-NC-SA 4.0 baseline; link + original paraphrase
  unless asset-level license/attribution is checked.
- **Claim boundary:** course notes are not a license to copy proof/exercise
  wording, and an analysis theorem still needs its exact hypotheses.

### S04 — Jiří Lebl, *Basic Analysis I: Introduction to Real Analysis* (v6.3)

- **Owner/status:** author-maintained, openly available proof-aware analysis
  text; primary to its own exposition.
- **URLs:**
  - [author site](https://www.jirka.org/ra/)
  - [v6.3 PDF](https://www.jirka.org/ra/realanal.pdf)
- **Supports:** sequences/series, limits, continuity, compactness, IVT/EVT,
  MVT/Taylor, Riemann/FTC, sequences of functions, and introductory metric
  spaces.
- **Course use:** a secondary notation/proof route and source map for the
  counterexample ladder.
- **Reuse/license:** current PDF front matter declares dual CC BY-NC-SA 4.0 /
  CC BY-SA 4.0. Default to link + original exposition; if adapting an asset,
  record exact version/page, attribution, compatible license, and changes.
- **Claim boundary:** a free PDF is not blanket permission to copy every
  exercise/figure or to call an external result applicable without conditions.

### S05 — MIT 18.335J, *Introduction to Numerical Methods* (Spring 2019)

- **Owner/status:** MIT OCW; first-party numerical-methods course.
- **URLs:**
  - [course home](https://ocw.mit.edu/courses/18-335j-introduction-to-numerical-methods-spring-2019/)
  - [lecture 1: Newton's method and accuracy](https://ocw.mit.edu/courses/18-335j-introduction-to-numerical-methods-spring-2019/0a734ecc94b60a26213488e68588bc8d_MIT18_335JS19_lec1.pdf)
  - [MIT OCW terms](https://ocw.mit.edu/pages/privacy-and-terms-of-use/)
- **Supports:** finite representation, accuracy/efficiency, floating point,
  backward error, conditioning, stability, integration/ODE numerical context.
- **Course use:** M28→M29 numerical boundary and Sessions 2, 3, and 6.
- **Reuse/license:** CC BY-NC-SA 4.0 baseline; link/cite only unless an exact
  asset is cleared.
- **Claim boundary:** numerical-analysis teaching material does not make a
  chosen library run or application model valid.

### S06 — Driscoll & Braun, *Fundamentals of Numerical Computation*

- **Owner/status:** author/press-maintained free web text; numerical
  computation spine.
- **URLs:**
  - [book home](https://fncbook.com/)
  - [finite differences](https://fncbook.com/finitediffs/)
  - [numerical integration](https://fncbook.com/chapter5-1/)
  - [IVP overview](https://fncbook.com/overview-5/)
  - [adaptive Runge–Kutta](https://fncbook.com/adaptive-rk/)
- **Supports:** discretization, finite-difference and quadrature behavior,
  IVPs, local/global error discussion, and adaptive step selection.
- **Course use:** original M29 fixtures and code-reading boundary source;
  never copy the book's code/figures by implication.
- **Reuse/license:** **link-only by default**. Free access is not blanket
  redistribution permission; verify exact text/figure/code asset and relevant
  SIAM terms before reuse.
- **Claim boundary:** a method's presentation does not guarantee behavior for
  a different step policy, dtype, solver, stiffness regime, or data model.

### S07 — NumPy Developers, `numpy.gradient`

- **Owner/status:** official NumPy API documentation.
- **URLs:**
  - [`numpy.gradient`](https://numpy.org/doc/stable/reference/generated/numpy.gradient.html)
  - [license](https://numpy.org/doc/stable/license.html)
- **Supports:** array/axis/spacing/edge-order contract for a finite-difference
  gradient of sampled N-dimensional data.
- **Course use:** code-reading boundary only; state API version, spacing,
  axis, dtype, and finite array.
- **Reuse/license:** NumPy is BSD 3-clause; retain notices for software reuse.
  Atlas examples remain original.
- **Claim boundary:** it does not prove differentiability, provide a theorem
  about a real function, or establish a model's units/semantics.

### S08 — SciPy Developers, differentiation/integration/IVP APIs

- **Owner/status:** official SciPy documentation.
- **URLs:**
  - [`scipy.differentiate.derivative`](https://docs.scipy.org/doc/scipy/reference/generated/scipy.differentiate.derivative.html)
  - [`scipy.integrate.quad`](https://docs.scipy.org/doc/scipy/reference/generated/scipy.integrate.quad.html)
  - [`scipy.integrate.solve_ivp`](https://docs.scipy.org/doc/scipy/reference/generated/scipy.integrate.solve_ivp.html)
  - [SciPy licensing guidance](https://docs.scipy.org/doc/scipy/dev/core-dev/index.html#licensing)
- **Supports:** current documented input/output/tolerance/method/error-estimate
  contracts for named procedures.
- **Course use:** library contract cards only; optional Session 3/6 deepening.
- **Reuse/license:** SciPy core documentation/code is modified BSD 3-clause
  absent an explicit exception; pin exact version and keep Atlas examples
  original.
- **Claim boundary:** `success`, a returned error estimate, or tolerance target
  is not global-error proof, model validation, or theorem applicability.

### S09 — JAX maintainers, automatic-differentiation documentation

- **Owner/status:** official JAX documentation/repository.
- **URLs:**
  - [automatic differentiation](https://docs.jax.dev/en/latest/automatic-differentiation.html)
  - [JVP/VJP guide](https://docs.jax.dev/en/latest/jacobian-vector-products.html)
  - [official repository and license](https://github.com/jax-ml/jax)
- **Supports:** code-reading vocabulary for forward/reverse mode, JVPs, VJPs,
  gradients, and higher-order transformations.
- **Course use:** Session 4 autodiff boundary, with M32 as the full runtime
  handoff.
- **Reuse/license:** JAX code is Apache-2.0; docs are official but retained
  link-only unless an exact asset's terms are reviewed. Atlas code is original.
- **Claim boundary:** AD produces an implementation-specific program derivative
  under supported semantics; it does not validate mathematical model/objective,
  branch choice, conditioning, backend precision, or human interpretation.

---

## Source-to-session and artifact map

| Workbook session | Core source route | Learner artifact | What Atlas does not copy or claim |
| --- | --- | --- | --- |
| 1. Limits, continuity, metric, compactness | S01, S03, S04 | claim card, \(\varepsilon\)-\(\delta\) repair, compactness counterexample | no copied lecture problem; finite plot ≠ proof |
| 2. Derivative, MVT, Taylor, finite differences | S01, S03, S04, S05, S06 | local-linear/Taylor error trace and `h` trade-off audit | no “tiny h” universal rule or exact finite result claim |
| 3. Integral, FTC, multiple region, coordinate change | S01, S02, S03, S04, S05, S06, S08 | region/units card, Jacobian area derivation, quadrature review | no numerical integral treated as integrability/model proof |
| 4. Gradient, Jacobian, Hessian, chain rule, AD boundary | S02, S03, S04, S07, S09 | batched shape/semantic trace and local-linear derivation | no gradient/AD trace called global improvement/objective validation |
| 5. Sequences/series, uniform convergence, operation exchanges | S03, S04 | \(x^n\) counterexample, theorem-hypothesis request, summation review | no pointwise/sampled behavior used to interchange operations |
| 6. Constraints, ODE approximation, evidence dossier | S02, S05, S06, S08 | Lagrange candidate audit, Euler step comparison, ODE memo | no solver status called model/existence/global accuracy proof |

### Numerical-experiment policy

Every M29 finite computational card must name:

~~~text
mathematical target and declared domain/norm/units
exact fixture or analytic comparison where available
representation: dtype, shape/axis convention, rounding model
procedure: formula/method/library version, step/grid/tolerance/stopping policy
observed output and independent residual/error comparison
what is a theorem, library contract, finite experiment, or AI proposal
failure case: cancellation, discontinuity, singularity, stiffness, nonuniformity,
or invalid semantic/objective inference
~~~

### Release checklist

- [ ] M27 and M28 academic-prerequisite arrows appear in the workbook, studio,
  route metadata, and source map; M29's canonical learner handoff is to M30.
  M31–M36 may be described only as later conceptual consumers, never as a
  navigation bypass.
- [ ] Every theorem panel names object/domain, hypotheses, conclusion, and a
  removed-hypothesis counterexample/prompt.
- [ ] Every calculus/numerics visual has a text alternative and does not reveal
  the conclusion before prediction/confidence.
- [ ] The studio uses semantic tables, accessible tabs/radios, focus styling,
  reduced-motion/forced-color support, local-only minimal progress, and no
  mouse-only/timed/audio requirement.
- [ ] Diagnostic questions are original, confidence-aware MCQs with an answer,
  reason, plausible-alternative failure, and boundary.
- [ ] Project, TA, Study Partner, and oral-defense routes require model,
  derivation/trace, counterexample/numerical boundary, transfer, and reflection;
  oral defense is GPT Live Chat preferred with an equivalent text route.
- [ ] Notion only receives learner-approved concise evidence; no raw voice,
  full transcript, or sensitive personal content.
- [ ] Bounded model/tests have no network, filesystem, process, database,
  package, credential, or arbitrary-code behavior; limitations are visible.
- [ ] Exact source URLs, owner/status, license/reuse decision, and asset-level
  boundaries are released with original Atlas materials.

---

## Instructor decision rule

Prefer the smallest true claim. If a learner has an elegant derivative but no
domain/units/metric, ask for the model. If they have an API output but no
procedure/tolerance/error interpretation, ask for the numerical evidence. If
they have a theorem but no checked hypotheses, ask for a counterexample. If
they have a smooth representation but propose a human-impact action, ask for
the missing causal, evaluation, consent, authority, and reversibility evidence.

M29 succeeds when the learner can turn “this curve/formula/solver looks right”
into a compact, inspectable argument with the exact condition that makes it
legal—and knows when that argument has not yet earned a design decision.
