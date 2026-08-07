# Module 29 — Source-Audit Addendum

**Research timestamp:** 2026-07-30  
**Scope:** rigorous calculus, introductory real analysis, multivariable
differentiation, numerical approximation, automatic differentiation, and an
ODE/error boundary for the M29 workbook and studio. This is an
instructor-facing source, claim, and reuse audit—not learner-facing textbook
copy or a publication/review approval.

## Non-promotion and canonical route boundary

This addendum records sources, reuse decisions, and claim boundaries. It does
not change the canonical graph, manifest, availability, lifecycle,
`releaseEvidence`, deployed-download policy, human-review state, or module
publication status. A resolved source pointer remains structural evidence; it
does not establish source quality, accessibility quality, learner mastery, or
release readiness.

The canonical graph controls route truth. M29 has academic prerequisites
**M27** and **M28** and a direct forward handoff to **M30**. M31–M36 are later
conceptual consumers, not M29 previous/next navigation, and M25/M26 retain
their own synthesis prerequisites. This audit must never be used to imply an
authoring-only bypass or a changed learner route.

## Verdict

M29 should teach *continuous change as a chain of increasingly precise
models*: a function; a limit statement with quantified scope; a local linear
approximation; an accumulated quantity; a limiting process on functions; and
then a finite program that approximates one or more of those objects. The
spine should be **MIT 18.01SC** and **MIT 18.02SC** for the first
computational pass, **MIT 18.100A** plus Jiří Lebl's openly licensed *Basic
Analysis I* for proof-level foundations, and **MIT 18.335J** plus
*Fundamentals of Numerical Computation* (FNC) for the numerical boundary.

Use NumPy, SciPy, and JAX documentation only for the documented contract of a
specific library API. None of those libraries is a source for a theorem about
all real functions, all numerical algorithms, or an application's scientific
model. Atlas should write its own explanations, diagrams, counterexamples,
fixtures, code-reading prompts, and oral-defense questions.

The essential evidence discipline is:

> A theorem about a declared mathematical object, a conclusion about a
> discretization/algorithm, a documented library behavior, and an observed
> run are different claims. They need different hypotheses and different
> evidence.

## Prerequisite bridge from M27 and M28

M29 follows [M27 — Discrete Mathematics, Proof, and Formal Reasoning](https://atlas-academy-python-cs.michaelliumingchang.chatgpt.site/modules/27-discrete-mathematics-proof-counting-structures)
and [M28 — Linear Algebra, Numerical Stability & Representation](https://atlas-academy-python-cs.michaelliumingchang.chatgpt.site/modules/28-linear-algebra-numerical-stability-representation).
The route should show both arrows, not merely list the modules.

| Incoming evidence | What M29 reuses | What M29 adds without skipping the bridge |
| --- | --- | --- |
| **M27: quantified claims, proof repair, counterexample, recurrence/asymptotic reasoning** | A learner can parse the order of “for every” and “there exists,” identify a missing hypothesis, and test a universal claim with a counterexample. | Epsilon–delta definitions, sequence convergence, continuity, and uniform convergence turn that proof language into a metric/inequality discipline. A graph or many sampled points never proves a limit statement. |
| **M28: vectors, norms, linear maps, matrices, conditioning, finite representation** | A learner can name a vector space, use a norm/inner product, read a Jacobian-shaped array, and distinguish an exact statement from a finite-precision experiment. | Differentiability is introduced as the existence of a best local **linear map**. The gradient/Jacobian/Hessian are representations under declared coordinates and inner product; numerical derivatives and AD are compared against that mathematical derivative. |
| **M28 numerical-stability boundary** | A learner knows “conditioning of the problem” and “stability of an algorithm” are not synonyms. | M29 applies the distinction to cancellation in difference quotients, quadrature error estimates, and step-size/error control for ODE initial-value problems. |

## Recommended source set

All URLs below were checked on 2026-07-30. “Link-only” means Atlas may cite
and direct learners to the source but should not import its prose, figures,
exercise wording, solution material, or datasets into the deployable project.

| ID | Owner/source and exact URL | Authoritative scope for Atlas | License / reuse decision |
| --- | --- | --- | --- |
| **S01** | David Jerison et al., MIT OCW, [18.01SC Single Variable Calculus](https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/) and [syllabus](https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/pages/syllabus/) | A self-study sequence through functions, limits/continuity, differentiation, Mean Value Theorem, definite integrals, the Fundamental Theorem of Calculus, numerical integration, improper integrals, and Taylor series. It is the first-pass instructional spine, not a formal mathematical specification. | MIT OCW material is published under [CC BY-NC-SA 4.0](https://ocw.mit.edu/pages/privacy-and-terms-of-use/). Attribute, link the license, mark changes, honor noncommercial/share-alike terms, and inspect each item for third-party notices. Prefer original Atlas exposition and diagrams; do **not** copy problem/exam banks or solutions. |
| **S02** | Denis Auroux et al., MIT OCW, [18.02SC Multivariable Calculus syllabus](https://ocw.mit.edu/courses/18-02sc-multivariable-calculus-fall-2010/pages/syllabus/) and [partial-derivatives unit](https://ocw.mit.edu/courses/18-02sc-multivariable-calculus-fall-2010/pages/2.-partial-derivatives/) | The connected undergraduate route from vector/matrix language to partial derivatives, tangent approximation, chain rule, gradient, directional derivatives, constrained differentials, multiple integrals, and vector-calculus context. | Same MIT OCW **CC BY-NC-SA 4.0** baseline and asset-level caveat as S01. Cite/link; create original visualizations and questions rather than reproducing course PDFs, videos, recitations, or assessments. |
| **S03** | Casey Rodriguez, MIT OCW, [18.100A Real Analysis](https://ocw.mit.edu/courses/18-100a-real-analysis-fall-2020/), [syllabus](https://ocw.mit.edu/courses/18-100a-real-analysis-fall-2020/pages/syllabus/), and [lecture notes/readings](https://ocw.mit.edu/courses/18-100a-real-analysis-fall-2020/pages/lecture-notes-and-readings/) | The proof-level sequence needed here: real-number completeness; sequences/series; limits and continuity; IVT/EVT; derivative/MVT/Taylor; Riemann integration/FTC; and pointwise versus uniform convergence plus interchange-of-limit conditions. MIT explicitly describes it as a proof-building analysis course. | Same MIT OCW **CC BY-NC-SA 4.0** baseline. Course PDFs can contain separate attributions or permissions; use Atlas-authored proofs, examples, and oral prompts unless a specific asset has been cleared. |
| **S04** | Jiří Lebl, [*Basic Analysis I: Introduction to Real Analysis*, v6.3 PDF](https://www.jirka.org/ra/realanal.pdf) and [author-maintained site](https://www.jirka.org/ra/) | A readable, rigorous reference for real numbers, sequences/series, function limits, continuity, EVT/IVT, derivatives/MVT/Taylor, Riemann integration/FTC, sequences of functions, and introductory metric-space compactness. Its own table of contents also provides a clean source map for the M29 proof ladder. | The current PDF front matter declares a **dual CC BY-NC-SA 4.0 / CC BY-SA 4.0** license and requires derivatives to retain at least one compatible license and be prominently marked. Because the Atlas project may be deployed/reused in uncertain contexts, default to link/cite and original exposition. If any excerpt is adapted, record exact version/page, author, chosen compatible license, attribution, and modification status. |
| **S05** | Steven G. Johnson, MIT OCW, [18.335J Introduction to Numerical Methods](https://ocw.mit.edu/courses/18-335j-introduction-to-numerical-methods-spring-2019/) and [lecture 1: Newton's method/accuracy](https://ocw.mit.edu/courses/18-335j-introduction-to-numerical-methods-spring-2019/0a734ecc94b60a26213488e68588bc8d_MIT18_335JS19_lec1.pdf) | The numerical-analysis bridge: approximate real-number computation, accuracy/efficiency, floating point, backward error, conditioning, stability, and surveyed numerical integration. Use it to prevent “the computer returned a number” from replacing an error argument. | MIT OCW **CC BY-NC-SA 4.0**, subject to source-specific notices. Link/cite by default; do not copy course notes, homework, or images into Atlas. |
| **S06** | Tobin A. Driscoll and Richard J. Braun, [*Fundamentals of Numerical Computation*](https://fncbook.com/), [finite differences](https://fncbook.com/finitediffs/), [numerical integration](https://fncbook.com/chapter5-1/), [IVP overview](https://fncbook.com/overview-5/), and [adaptive Runge–Kutta](https://fncbook.com/adaptive-rk/) | A coherent free online treatment of discretization, finite-difference differentiation, numerical integration, initial-value problems, local/global error discussion, and adaptive step selection. It is especially useful after M28 because it makes “continuous function → finite representation → linear algebra” explicit. | **Link-only by default.** The [SIAM front matter](https://epubs.siam.org/doi/pdf/10.1137/1.9781611975086.fm?download=true) distinguishes reuse terms for parts of the work; free web access is not blanket permission to copy text/figures/code. Treat the book and its source code as separately licensed assets, and verify an exact page/file before reuse. |
| **S07** | NumPy Developers, [`numpy.gradient`](https://numpy.org/doc/stable/reference/generated/numpy.gradient.html) and [NumPy license](https://numpy.org/doc/stable/license.html) | The documented behavior of a finite-difference gradient over sampled N-dimensional arrays, including spacing/axis conventions and stated accuracy conditions. It is useful for code-reading about shape, spacing, boundaries, and a finite array—not for proving differentiability. | NumPy is **BSD 3-clause**. Cite the precise documentation version used. Direct software-code reuse requires retaining the required notices; Atlas should keep examples original and should not present docs/API output as a theorem or hardware-independent guarantee. |
| **S08** | SciPy Developers, [`scipy.differentiate.derivative`](https://docs.scipy.org/doc/scipy/reference/generated/scipy.differentiate.derivative.html), [`scipy.integrate.quad`](https://docs.scipy.org/doc/scipy/reference/generated/scipy.integrate.quad.html), [`scipy.integrate.solve_ivp`](https://docs.scipy.org/doc/scipy/reference/generated/scipy.integrate.solve_ivp.html), and [licensing guidance](https://docs.scipy.org/doc/scipy/dev/core-dev/index.html#licensing) | The named APIs' input/output, tolerance, error-estimate, method, and shape contracts. In particular, `derivative` is for an elementwise real scalar function, `quad` returns an error estimate, and `solve_ivp` approximates an IVP under a chosen method/tolerances. | SciPy's core documentation states **modified BSD 3-clause** for project code/docs absent an explicit exception. Record the exact version and API signature. Never copy a code example by implication, and never upgrade a reported `success`, error estimate, or tolerance target into a proof of global error, model validity, or all-platform behavior. |
| **S09** | JAX maintainers, [automatic-differentiation guide](https://docs.jax.dev/en/latest/automatic-differentiation.html), [JVP/VJP guide](https://docs.jax.dev/en/latest/jacobian-vector-products.html), and [official repository/license](https://github.com/jax-ml/jax) | A concrete, current implementation contract for reading reverse-/forward-mode AD code: `grad`, Jacobian-vector products, vector-Jacobian products, and higher-order transforms. It is the implementation bridge to later optimization and ML modules, not the mathematical definition of a derivative. | JAX source is **Apache-2.0**; its documentation is an official reference but should be treated link-only unless an exact asset's reuse terms are reviewed. Use original Atlas code and state version/backend/dtype. An AD trace establishes a derivative of the program under its supported semantics, not the correctness of a model or a theorem about a nonsmooth/domain-invalid computation. |

## Claim boundaries the M29 workbook and studio must preserve

| Topic | Safe learner-facing statement | Required hypotheses, counterexample, or evidence label |
| --- | --- | --- |
| Functions, limits, and epsilon–delta | A limit is a quantified local claim about inputs sufficiently close to a point (with the domain and puncture convention stated). Epsilon–delta reasoning is how a graph-level intuition becomes a proof. | State the domain, limit point, and all quantifiers. A finite plot/table/sample trace is a **finite experiment**, not a proof. Do not silently replace a two-sided limit with a one-sided/domain-restricted limit. |
| Continuity, compactness, IVT, and EVT | Continuity preserves limiting behavior. On a compact domain, a continuous real-valued function attains extrema; on an interval, a continuous real-valued function takes intermediate values. | In \(\mathbb R^n\), “closed and bounded” characterizes compactness, but that shortcut is not a universal metric-space definition. IVT needs a continuous function on an interval; EVT needs a compact domain. Show counterexamples when openness, boundedness, or continuity is removed. |
| Derivative, MVT, and Taylor approximation | The derivative is a local linear approximation. In several variables, differentiability means an error that is small relative to the input perturbation after subtracting a linear map. | Differentiability implies continuity, not conversely. The Mean Value Theorem needs continuity on \([a,b]\) and differentiability on \((a,b)\). A Taylor remainder/error bound requires stated smoothness, interval, order, and remainder form; a polynomial fit is not automatically a valid bound. |
| Riemann integration and FTC | The Riemann integral models accumulated value via limiting sums; the FTC connects integration and differentiation under its stated regularity assumptions. | Do not assert every bounded function is Riemann integrable. State interval/continuity or another sufficient integrability condition. Separate “an antiderivative exists/has the named derivative” from “a numerical quadrature produced an approximation.” |
| Sequences, series, and uniform convergence | Pointwise convergence says each fixed input eventually converges; uniform convergence supplies one stage that works across the declared domain. It is the missing condition in many safe limit-interchange arguments. | Pointwise convergence alone does **not** generally preserve continuity, integrals, derivatives, or interchange of limits. State the exact theorem used; uniform convergence of functions, and suitable derivative/base-point conditions when differentiating a sequence, are different requirements. The M-test is sufficient, not necessary. |
| Gradient, Jacobian, Hessian, and multivariable differentiation | With a chosen Euclidean inner product, the gradient represents the derivative of a scalar function; a Jacobian represents a linear map in chosen coordinates; a Hessian is a second-order object. | Partial derivatives existing at a point need not imply differentiability. Continuous partial derivatives on a suitable neighborhood are a common sufficient condition, not the definition. Hessian symmetry/mixed-partial claims require their regularity assumptions. A gradient's components change with coordinates/metric even when the underlying differential is the same object. |
| Numerical differentiation and integration | Finite differences and quadrature approximate declared mathematical targets under a discretization, dtype, grid/step, tolerance, and algorithm. Error can combine truncation/discretization, roundoff, conditioning, and model/input error. | Smaller \(h\) is not monotonically better in floating-point difference quotients because cancellation/roundoff can dominate. `numpy.gradient`, SciPy `derivative`, and `quad` return implementation-specific results/error estimates; record inputs, shape, spacing, dtype, version, tolerances, and a comparison target when available. |
| Automatic differentiation | AD propagates local derivative rules through a program; forward mode naturally produces JVPs and reverse mode VJPs/gradients for suitable program shapes. It avoids finite-difference step-size selection but does not remove mathematical assumptions. | An AD result is a **program/implementation claim** for a specified library, version, dtype, backend, primitives, and trace. It does not prove the modeled phenomenon is differentiable, that a branch/rounding/nondifferentiable operation encodes the intended derivative, or that the resulting optimization is well-conditioned. Compare it to an analytic derivative and directional finite-difference check where appropriate. |
| ODE IVPs, error, and adaptive step size | An IVP specifies a rate law plus initial data. A numerical solver constructs an approximate trajectory with a chosen method and a local error-control policy. | State the RHS, initial condition, interval, norm/tolerances, method, and stiffness/regularity assumptions. Local error control or `solve_ivp.success` is not a blanket global-error theorem, an existence/uniqueness proof, model validation, or a guarantee to detect all events. Adaptive steps are a resource/error strategy, not magic stability. |

## Minimum source routing for the six connected sessions

| Session | First-principles question and required concepts | Default evidence sources | Atlas learning move / artifact |
| --- | --- | --- | --- |
| **1 — What does “arbitrarily close” mean?** | How do a domain, function, norm/distance, limit, epsilon–delta statement, and continuity constrain a claim? Cover compactness in \(\mathbb R^n\), IVT, EVT, and failure cases. | S03, S04; S01 for first-pass intuition; M27 proof bridge. | Repair three statements with swapped quantifiers or missing domain hypotheses. Produce a claim card that separates graph evidence from a proof skeleton. |
| **2 — Derivative, MVT, Taylor, and finite differences** | How does a limit become a local linear map, and why does a Taylor remainder not equal a finite-precision guarantee? Cover derivative, MVT, Taylor/remainder, finite-difference truncation, cancellation, and a numerical boundary. | S01, S03, S04, S05, S06, S07; M28 stability bridge. | Derive a polynomial difference quotient; compare a named Taylor remainder with a finite-difference/dtype claim; repair a broken interval/smoothness/error explanation. |
| **3 — Accumulation, regions, and coordinate change** | How do Riemann accumulation, FTC, multiple-integral regions, change of variables, and quadrature connect? | S01, S02, S03, S04, S05, S06, S08. | Draw a region before writing iterated bounds; trace a one-to-one coordinate map and its absolute Jacobian factor; audit an integral API claim for units and tolerance. |
| **4 — Continuous change in many coordinates** | How does M28's linear-map model become partials, differentiability, directional derivative, gradient, Jacobian, Hessian, chain rule, and local second-order approximation? | S02, S03, S04, S07, S09; M28 norm/linear-map bridge. | Annotate the shapes and meaning of a small loss function, its gradient, and Jacobian; use a partials-without-continuity counterexample; distinguish AD of a program from a model theorem. |
| **5 — Sequences, uniformity, and legal exchanges** | How do sequences/series converge, why are pointwise and uniform different, and which named conditions allow continuity/integral/derivative/expectation moves? | S03, S04; M27 counterexample methods; M30 handoff. | Use \(x^n\) on \([0,1]\) and \([0,r]\); defend a uniform-integration proof step; request precise derivative or dominated-convergence hypotheses rather than a larger sample. |
| **6 — Constraints, ODE approximation, and dossier** | How do constrained candidates and an ODE IVP turn local information into a decision-relevant finite trace? Cover Lagrange conditions, Euler approximation, local/global error boundary, and evidence-aware reporting. | S02, S05, S06, S08; S03/S04 for existence/uniqueness context. | Produce a Continuous-Change Evidence Dossier: model, feasibility/initial data, method/tolerance, trace comparison, failure/uncertainty case, and an oral defense of what the result cannot prove. |

## Authoring and release checks

1. **Preserve the prerequisite arrows.** Every M29 page/studio must visibly
   connect M27's quantifiers/counterexamples and M28's norms/linear maps/stability
   to the new material. Never introduce a gradient merely as a list of partial
   derivatives without the local-linear-map bridge.
2. **Keep proof scope visible.** A theorem panel should expose object/domain,
   hypotheses, conclusion, and at least one “removing this hypothesis” prompt.
   A learner may defer a proof detail, but not hide the condition that makes the
   statement true.
3. **Make continuous/discrete boundaries inspectable.** Every numerical panel
   should show the mathematical target, representation, method, input scale,
   dtype, step/grid/tolerance, returned estimate, and what remains unknown.
4. **Do not use copyrighted exercises as diagnostics.** Write original
   confidence-aware multiple-choice prompts, counterexamples, proof repairs,
   code-reading tasks, project criteria, and oral-defense branches. Link to
   external assignments rather than importing them.
5. **Treat diagnostics as retrieval, not a gate by surprise.** The oral
   defense should begin with learner consent and a constructive prompt, allow a
   text equivalent, show the misconception being repaired, and store only a
   learner-approved short evidence summary—not raw voice or a full transcript.
6. **Pin implementation evidence.** An API/code-reading card names library,
   version, backend, dtype, shapes, input fixture, tolerance/step rule, and
   relevant system condition. A reference model stays bounded and labels
   outputs “finite teaching experiment,” not “proof” or “production solver.”
7. **Preserve source provenance.** For any non-original asset retained in the
   repository, record owner, exact URL, edition/version, access date, license,
   attribution, modification status, and distribution decision. A source being
   freely readable does not itself authorize reuse.

## Evidence language to carry into M30–M36

- **Definition/theorem:** valid only over the declared domain, metric/norm,
  regularity, and hypotheses.
- **Proof sketch:** identifies the inference and every unresolved lemma; it is
  not a proof merely because an AI supplied plausible steps.
- **Numerical-method claim:** valid only for the posed problem, discretization,
  perturbation/error model, algorithm, and analysis assumptions.
- **Library/API contract:** valid only for the named package version, backend,
  dtype, signature, and documented behavior.
- **Finite experiment:** reports this input, fixture, execution environment,
  and observed comparison; it does not establish a universal, causal, or
  real-world claim.
- **AI proposal:** a candidate proof, derivation, implementation, or diagnosis
  that must be checked against the relevant theorem, source contract, and
  counterexample before it becomes course evidence.

M29 therefore gives M30 and M31 a disciplined language for likelihoods,
gradients, objectives, convergence, numerical implementation, and uncertainty
without confusing symbolic fluency or an AI-generated gradient with a valid
mathematical or engineering conclusion.
