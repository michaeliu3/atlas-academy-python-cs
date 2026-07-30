# Module 29 — Calculus, Real Analysis & Continuous Change

**Arc VI — Mathematical foundations for continuous, probabilistic, and learning systems**

> **Bridge:** M28 made a representation claim answerable: name the spaces,
> coordinates, metric, algorithm, and numerical boundary before accepting a
> matrix result. M29 asks the continuous analogue: when a quantity changes,
> what does a limit, derivative, integral, approximation, or convergence claim
> actually say—and which hypotheses make it legal to move an operation through
> a limit, integral, derivative, or expectation?

**Primary outcome:** You can read continuous-change arguments from first
principles: state a limit with its quantifiers, use continuity and compactness
carefully, derive local linear/Taylor approximations, interpret gradients,
Jacobians, Hessians, integrals, coordinate changes, constrained extrema, and
sequences/series; and separate an exact theorem from a floating-point
approximation, autodiff trace, numerical solver result, or data-model claim.

This is a rigorous, connected first pass—not a promise of full real-analysis,
measure-theory, differential-equations, or optimization mastery in six
sessions. The aim is advanced code-reading and design readiness: you can
reconstruct a derivation, identify a missing hypothesis, find a counterexample,
and ask what numerical and empirical evidence an AI-assisted implementation
still needs.

---

## How to study this module

### The working invariant

> **A continuous-change conclusion is trustworthy only after the domain,
> limiting process, norm or metric, regularity assumptions, approximation or
> algorithm, and error boundary are named. A finite sample, symbolic
> derivative, autodiff result, numerical integral, and theorem are different
> kinds of evidence.**

Keep the word *uniform* visible. A pointwise statement says each fixed input
eventually behaves. A uniform statement supplies one stage that works across a
declared set. The difference is often exactly what lets a continuous, integral,
or derivative conclusion transfer through a limiting process.

### Evidence labels

| Label | What it establishes | What it does not establish |
| --- | --- | --- |
| **[DEFINITION / MODEL]** | A metric, limit, derivative, integral, sequence, objective, coordinate map, or continuous-time model under declared conventions. | That a real system obeys the model or that units/coordinates are meaningful. |
| **[THEOREM / PROOF]** | A conclusion from named hypotheses, such as continuity on a compact interval, differentiability, uniform convergence, or an integrable dominating function. | That a finite algorithm meets the hypotheses or that one plot/data set proves the theorem. |
| **[ALGORITHM / NUMERICS]** | A specified finite-difference, quadrature, optimizer, or ODE procedure under named arithmetic, tolerance, step policy, and error interpretation. | An exact derivative/integral, a universal error bound, or a causal model. |
| **[LIBRARY CONTRACT]** | Documented inputs, outputs, tolerances, and API behavior for a named version. | The mathematical assumptions, stability in every regime, or an appropriate objective. |
| **[FINITE EXPERIMENT]** | An observed result for stated data, machine, dtype, implementation, and configuration. | A universal limit, convergence result, scientific explanation, or decision authority. |
| **[AI PROPOSAL]** | A candidate derivation, test, visualization, or patch worth tracing. | Proof, source authority, correct implementation, or permission to omit assumptions. |

### The six-step learning loop

1. **Name the objects.** What is the domain, codomain, metric/norm, unit,
   coordinate convention, and limiting variable?
2. **State the claim precisely.** Is it pointwise, uniform, local, global,
   exact, asymptotic, or a finite computation?
3. **Derive before calculating.** Use the definition, a chain rule, a Taylor
   remainder, a change-of-variables determinant, or a convergence theorem.
4. **Find a boundary.** Construct a discontinuity, nondifferentiable point,
   nonuniform sequence, singular coordinate map, unstable finite difference,
   or invalid exchange of operations.
5. **Read the computation.** Trace shape, unit, dtype, tolerance, step size,
   stopping policy, and what the library/agent actually promises.
6. **Transfer the judgment.** Decide what the claim changes in a scientific
   model, ML representation, controller, simulation, or Atlas design—and what
   it still cannot justify.

Typing is intentionally secondary. You will run small exact fixtures and read
a bounded model, but the central work is explaining a derivation, auditing a
continuous-code path, comparing hypotheses, and repairing a claim.

### Pace guard: one spine, optional depth

Every session names one **core trace** that you should be able to reconstruct
without notes, and one **optional deepening** for a second pass. The recurring
architecture panel is deliberately the same throughout:

~~~text
specification/domain → representation/units → mathematical condition
→ finite procedure → evidence boundary → human or engineering decision
~~~

This keeps the advanced material connected without pretending that every
theorem must be memorized in one sitting. If a session feels dense, preserve
the core trace and postpone the deepening; do not replace a missing condition
with a fluent summary.

---

## 1. Position in the knowledge system

### 1.1 What M29 deepens rather than repeats

| Earlier seed | M29 deepening | Why it matters later |
| --- | --- | --- |
| M4/M27 definitions, quantifiers, proof, and counterexamples | \(\varepsilon\)-\(\delta\) limits, quantified convergence, proof obligations, and smallest counterexamples. | “Close enough” needs a set, a metric, and quantified error before it can support a theorem. |
| M5 cost models and asymptotics | Asymptotic approximation error, convergence rate, local versus global behavior, and step-size trade-offs. | A fast calculation can converge to the wrong object or lose accuracy. |
| M17/M24 finite representation and runtime evidence | Floating-point cancellation, ordering, dtype, numerical APIs, and measured behavior. | A symbolic expression and a machine calculation are not interchangeable. |
| M28 vector spaces, norms, matrices, conditioning, and PCA | Euclidean/induced norms, linear maps as first approximations, Jacobians/Hessians, PSD curvature, and stability. | Gradients, constrained optimization, statistical approximation, autodiff, and learning theory depend on this bridge. |

### 1.2 Prerequisite and forward map

~~~mermaid
flowchart LR
    M27["M27: definitions, quantifiers, proof"] --> M29["M29: limits, derivatives + convergence"]
    M28["M28: norms, maps, conditioning"] --> M29
    M29 --> M30["M30: expectation, convergence, inference"]
    M29 --> M31["M31: gradients, constraints, convergence"]
    M29 --> M32["M32: array/autodiff/accelerator execution"]
    M29 --> M35["M35: loss surfaces + representation learning"]
    M29 --> M36["M36: generalization and convergence conditions"]
    M29 --> M25["M25: evidence-grounded AI synthesis"]
~~~

**Text equivalent:** M27 supplies quantified claims and proof repair. M28
supplies norms, linear maps, conditioning, and shape-aware representation.
M29 combines them to reason about continuous change and approximation. M30
owns probability, measure, expectation, and statistical inference; M31 owns
optimization and convergence algorithms; M32 owns production autodiff and
accelerators. M25/M26 remain final synthesis modules, not prerequisites for
this mathematical bridge.

### 1.3 Entry retrieval

Before continuing, answer in short notes.

1. Why is five nearby values not a proof of a limit?
2. What information does a norm add before calling two vectors “close”?
3. Why can \(A^\mathsf TA\) be PSD without being invertible?
4. What does a condition number leave unresolved about a particular algorithm?

If 1 is fragile, bridge through M27. If 2–4 are fragile, bridge through M28.
Do not turn this module into formula lookup before these models are audible.

---

## 2. One story: the Atlas calibration lab

Atlas is testing a consented, synthetic calibration panel for an explanatory
tool. The panel takes a bounded numeric input—say a simulated cue strength,
time budget, or signal level—and displays an approximate response curve,
rate-of-change explanation, accumulated exposure, and a proposed safe next
action. It must not infer talent, diagnose a learner, or turn a smooth plotted
curve into a causal or policy conclusion.

The design team wants to answer questions such as:

- Does an observed smooth-looking graph justify continuity near a boundary?
- Does a derivative estimate mean the response will change linearly over a
  whole interval?
- Can an integral of a synthetic rate be called a real-world outcome?
- May a limit, derivative, integral, or expectation be exchanged after a
  model is refined?
- Is a finite-difference or adaptive solver discrepancy a property of the
  mathematical model, numerical procedure, data, or interface?

~~~text
declared domain + units + metric + regularity assumptions
    → exact function / continuous-time model / objective
    → limit, derivative, integral, coordinate map, or convergence claim
    → finite algorithm with dtype, tolerance, and step policy
    → bounded evidence for an Atlas explanation or design decision
~~~

### 2.1 Continuous-change card

Use this card before accepting an equation, plot, notebook cell, library
result, or agent-generated derivation.

~~~text
Objects, domain/codomain, units, and coordinate convention:
Metric/norm and what “near” means:
Exact function, sequence, integral, ODE, or objective:
Claim type: local/global; pointwise/uniform; theorem/algorithm/experiment:
Hypotheses and limiting process:
Approximation/algorithm, dtype, step/tolerance/stopping policy:
Observed evidence and error estimate:
Counterexample, failure mode, or non-claim:
Decision supported and decision not supported:
~~~

The card blocks two AI-era errors: a beautiful Taylor expansion used outside
its approximation region, and a library output treated as proof that a model
is continuous, convergent, or appropriate for a human decision.

---

## 3. Session 1 — Limits, continuity, metric spaces, and compactness

### Pressure

An agent plots a curve at 10,000 points and says, “It is continuous.” A graph
is finite evidence about a renderer and selected samples. Continuity is a
local quantified property of a declared function and topology/metric.

### First principle: a limit controls every sufficiently close input

For a function \(f:D\to\mathbb R\), saying

\[
\lim_{x\to a}f(x)=L
\]

means: for every \(\varepsilon>0\), there exists \(\delta>0\) such that for
every \(x\in D\), \(0<|x-a|<\delta\) implies \(|f(x)-L|<\varepsilon\).
The exclusions and order of choices matter. The learner/opponent chooses the
desired output accuracy \(\varepsilon\); the prover supplies a sufficiently
small input radius \(\delta\); then *every* allowed nearby input must work.

For \(f(x)=3x+2\) at \(a=4\), choose \(\delta=\varepsilon/3\). If
\(0<|x-4|<\delta\), then

\[
|(3x+2)-14|=3|x-4|<3\delta=\varepsilon.
\]

This is not a ritual. It exposes why a finite list of samples cannot decide a
universal neighborhood statement.

### 3.1 Metric-space language is the portable version

A metric space \((X,d)\) gives a nonnegative distance satisfying identity,
symmetry, and triangle inequality. An open ball is
\(B_r(a)=\{x:d(x,a)<r\}\). Replace absolute values with metrics to define
convergence and continuity:

\[
x_n\to x \quad\Longleftrightarrow\quad
\forall\varepsilon>0\;\exists N\;\forall n\ge N,
d(x_n,x)<\varepsilon.
\]

M28's norms produce metrics, for example \(d(x,y)=\lVert x-y\rVert_2\).
But a feature vector's numeric distance is a model choice: scale, units,
weights, missingness, and coordinate convention can alter the geometry.

### 3.2 Continuity is a limit through the function

\(f\) is continuous at \(a\) if, for each \(\varepsilon>0\), a
\(\delta>0\) makes \(d_X(x,a)<\delta\) imply
\(d_Y(f(x),f(a))<\varepsilon\). Differentiability implies continuity; the
converse is false. \(f(x)=|x|\) is continuous at 0 but has no two-sided
derivative there.

Keep three statements distinct:

| Statement | What it requires | Typical misuse |
| --- | --- | --- |
| \(\lim_{x\to a}f(x)=L\) | nearby domain values approach \(L\) | assuming it fixes \(f(a)\) |
| \(f(a)=L\) | a value is defined | assuming the surrounding limit exists |
| continuity at \(a\) | both plus equality | inferring it from a smooth plot |

**Counterexample:** Define \(f(x)=(x^2-1)/(x-1)\) for \(x\ne1\) and
\(f(1)=0\). The nearby formula equals \(x+1\), so the limit at 1 is 2, but
the declared value is 0. The removable discontinuity is a model/definition
boundary, not numerical noise.

### 3.3 Compactness turns local evidence into global conclusions—when earned

In \(\mathbb R^n\), a set is compact exactly when it is closed and bounded
(Heine–Borel). Do not generalize that characterization to every metric space.
What compactness buys in a standard real-analysis setting includes:

- a continuous real-valued function on a compact set attains a maximum and
  minimum (Extreme Value Theorem);
- a continuous function on a compact set is uniformly continuous;
- every sequence in a compact metric space has a convergent subsequence with
  limit in the set (sequential compactness in metric spaces).

The hypothesis is a resource. A locally valid Taylor estimate, a bounded
parameter box, and a globally safe UI range are different claims; none implies
the other without a stated bridge.

### 3.4 Intermediate Value Theorem: a sign change is a root *bracket*, not a root value

**Core trace.** If \(f\) is continuous on \([a,b]\) and a target \(y\) lies
between \(f(a)\) and \(f(b)\), then some \(c\in[a,b]\) satisfies \(f(c)=y\).
For a root, set \(y=0\). The theorem explains why a continuous sign-changing
interval is a valid *bracket*; it does not identify a unique root, certify a
derivative, or convert a finite table into continuity.

**Code-reading boundary.** A bisection routine may repeatedly halve a bracket
only after the function/domain contract and a sign-change check are explicit.
When it stops, report the interval width, residual, tolerance, endpoint
policy, dtype, and whether a NaN or discontinuity was encountered. A small
residual is not by itself a proof that the intended physical model has a root.

**Optional deepening.** Uniqueness needs another hypothesis, such as strict
monotonicity on the interval. Newton-like updates make different local claims
and can leave the bracket or fail near a flat derivative.

### Session 1 code-reading task

Read this review smell:

```python
def continuous_enough(xs, ys, threshold=0.01):
    return max(abs(b - a) for a, b in zip(ys, ys[1:])) < threshold
```

The code can report one finite adjacent-difference observation. It does not
know the domain between samples, x-spacing, units, function definition,
measurement noise, discontinuities between samples, or a metric-space proof.
Repair the claim rather than the theorem: call it a *finite sampled variation
check* and record inputs, grid, units, threshold, and what it cannot establish.

---

## 4. Session 2 — Derivatives, mean value, Taylor approximation, and finite differences

### Pressure

“The gradient says move this way” hides several questions: derivative of what
function, at which point, in what coordinates/units, over what step size, and
with what numerical error? A derivative is a local linear claim, not a global
promise or a human objective.

### 4.1 Derivative as the best local linear approximation

For a scalar function,

\[
f'(a)=\lim_{h\to0}\frac{f(a+h)-f(a)}{h}.
\]

Equivalent local-linear language is

\[
f(a+h)=f(a)+f'(a)h+r(h),\qquad \frac{r(h)}{h}\to0.
\]

The remainder is the meaning. A tangent line is good only relative to a
declared neighborhood and error scale. For vector-valued \(F\), M28's linear
map returns: differentiability at \(x\) means a linear map \(DF(x)\) makes
\(F(x+h)-F(x)-DF(x)h\) small relative to \(\lVert h\rVert\).

### 4.2 Mean Value Theorem: a hypothesis-sensitive bridge

If \(f\) is continuous on \([a,b]\) and differentiable on \((a,b)\), there
exists \(c\in(a,b)\) with

\[
f'(c)=\frac{f(b)-f(a)}{b-a}.
\]

It connects average and instantaneous rate. It does **not** name the point
\(c\), license differentiation at an endpoint/cusp, or establish a result
when continuity/differentiability conditions fail. Use M27's proof habit:
state every interval and regularity hypothesis before applying the theorem.

### 4.3 Taylor's theorem: approximation plus a remainder contract

When \(f\) has enough derivatives near \(a\),

\[
f(a+h)=\sum_{k=0}^{n}\frac{f^{(k)}(a)}{k!}h^k+R_n(h).
\]

Under an appropriate \((n+1)\)-derivative hypothesis, the Lagrange form says
\(R_n(h)=f^{(n+1)}(\xi)h^{n+1}/(n+1)!\) for some \(\xi\) between \(a\) and
\(a+h\). The nontrivial task is bounding the unseen \(f^{(n+1)}(\xi)\) on the
relevant interval. “Higher degree” is not automatically better outside a
named region or with finite precision.

Example: \(e^h=1+h+h^2/2+R_2(h)\). On \(|h|\le0.1\), a bound such as
\(|R_2(h)|\le e^{0.1}|h|^3/6\) makes the approximation error inspectable.
The bound is a theorem under the stated function/interval; a decimal evaluated
by a library is a separate numerical observation.

### 4.4 Finite differences expose a trade-off, not a magic step size

Forward difference

\[
D_hf(x)=\frac{f(x+h)-f(x)}{h}
\]

has truncation error typically proportional to \(|h|\) for a smooth function.
Centered difference

\[
\frac{f(x+h)-f(x-h)}{2h}
\]

has a smaller leading truncation term under stronger smoothness. But in finite
arithmetic, subtraction can cancel and division by tiny \(h\) amplifies
rounding/error. A teaching-scale model is

\[
\text{total error}\approx C_1h^p+C_2\frac{u}{h},
\]

where \(u\) is an arithmetic/measurement scale—not a universal formula.
Smaller \(h\) can first help and then hurt.

### Session 2 prediction before reveal

For \(f(x)=x^3\) at \(x=2\), predict whether the forward difference with
\(h=1/10\) over- or under-estimates \(f'(2)=12\). Derive:

\[
\frac{(2+h)^3-8}{h}=12+6h+h^2.
\]

It over-estimates for positive \(h\). That algebra is exact for this
polynomial; it does not validate arbitrary finite-difference code on noisy or
ill-conditioned data.

---

## 5. Session 3 — Integration, the Fundamental Theorem, multiple integrals, and change of variables

### Pressure

A library returns an integral with an error estimate. What has been integrated:
an exact mathematical function, a piecewise code branch, a sampled
interpolant, or an under-specified measurement? An accumulation has meaning
only with a domain, units, orientation/measure, and assumptions.

### 5.1 Definite integral as controlled accumulation

For a bounded function on \([a,b]\), Riemann sums divide the interval into
subintervals and accumulate height times width. Refining a partition is not by
itself a proof of integrability; upper/lower sums or an appropriate integrable
function class supplies the definition/theorem route.

Units offer a quick check: if a rate has units “events per minute,” its integral
over minutes has units “events.” The result is still a modelled accumulation,
not evidence that a synthetic Atlas rate measures an individual outcome.

### 5.2 Fundamental Theorem of Calculus joins local and accumulated change

In a standard single-variable form: if \(f\) is continuous on \([a,b]\) and
\(F(x)=\int_a^x f(t)\,dt\), then \(F'(x)=f(x)\). If \(F' = f\) with the
needed regularity, then \(\int_a^b f(x)\,dx=F(b)-F(a)\). Do not erase the
continuity/integrability conditions or confuse an antiderivative formula with a
numerical quadrature result.

### 5.3 Multiple integrals require a region and a measure

\(\iint_R g(x,y)\,dA\) accumulates over a declared region \(R\). Iterated
limits are a representation of that region, not decorative syntax. Draw or
describe the domain before changing order. Fubini/Tonelli-type exchanges need
their own hypotheses; M30 will make measure/probability assumptions explicit.

**Core trace:** Let
\(R=\{(x,y):0\le x\le1,\ x\le y\le1\}\). One correct representation is
\(\int_0^1\int_x^1g(x,y)\,dy\,dx\). Reversing the order requires re-describing
the same region: \(\int_0^1\int_0^y g(x,y)\,dx\,dy\). The order changed because
the bounds changed—not because integral symbols commute by typography.

**Optional deepening:** Tonelli/Fubini give conditions for order exchange in
broader settings. In this module, draw or state the region first and request a
named theorem before claiming an exchange outside the bounded fixture.

### 5.4 Change of variables: coordinates carry area/volume distortion

For a sufficiently regular (normally \(C^1\)), one-to-one coordinate map with
nonzero determinant on the relevant region,
\(T:U\to R\subset\mathbb R^n\), the full scalar formula is

\[
\int_{T(U)}g(x)\,dx=
\int_U g(T(u))\left|\det DT(u)\right|\,du.
\]

The formula includes

\[
\left|\det DT(u)\right|.
\]

The absolute determinant measures local volume scaling. For
\(T(u,v)=(u+v,u-v)\),

\[
DT=\begin{bmatrix}1&1\\1&-1\end{bmatrix},\qquad |\det DT|=2.
\]

The unit square in \((u,v)\) maps to a parallelogram of area 2. The sign
records orientation; the absolute value enters ordinary area. A singular or
many-to-one map requires a revised partition/argument—never silently divide
by a zero determinant.

**Core trace:** for \(g\equiv1\) and \(U=[0,1]^2\), the right-hand side is
\(\int_0^1\int_0^1 1\cdot2\,dv\,du=2\), agreeing with the image's area.
This is a fully named region, map, integrand, and determinant factor—not a
determinant-shaped mnemonic.

**Optional deepening:** If a map folds a region or is not injective, partition
it into valid pieces or use a theorem designed for multiplicity. Do not apply
one absolute determinant to overlapping coverage without an argument.

### 5.5 Numerical quadrature is a bounded procedure

Trapezoidal, Simpson, Gaussian, and adaptive rules choose/evaluate points
under stated assumptions. An adaptive routine's estimated error is a property
of its sample strategy and implementation conditions; sharp features,
discontinuities, cancellation, infinite domains, and tolerance choices can
break a naive interpretation. Report the integrand contract, interval, units,
method, dtype, tolerances, warning/status, and independent check where
available.

### Session 3 code-reading task

```python
area, estimate = quad(response_curve, 0.0, 1.0)
publish("total response", area)
```

Before accepting the label, ask: What is `response_curve` between calls? What
are its units? Is it continuous/integrable on this interval? What do `quad`'s
parameters and `estimate` mean for this version? Did any warnings, singular
points, event discontinuities, or domain transforms occur? “Total response” is
not a scientific or human-impact conclusion without this card.

---

## 6. Session 4 — Multivariable derivatives, gradients, Jacobians, Hessians, and code contracts

### Pressure

An agent proposes `loss.backward()` and labels the output “the gradient.” That
name is incomplete until the scalar objective, input coordinates, parameter
shape, reduction, units, differentiability, evaluation mode, and dtype are
named.

### 6.1 Gradient is a coordinate representation of a differential

For differentiable \(f:\mathbb R^n\to\mathbb R\) under the Euclidean inner
product,

\[
df_x(h)=\nabla f(x)^\mathsf T h.
\]

The gradient is the vector representing the linear functional with respect to
the chosen inner product. Change the metric, coordinates, units, or scaling,
and the steepest direction can change. For
\(f(x,y)=x^2+3xy\),

\[
\nabla f(x,y)=(2x+3y,3x).
\]

It predicts local change: \(f(x+h)\approx f(x)+\nabla f(x)^\mathsf Th\),
with an error that still needs a region/regularity statement.

### 6.1a Partials are probes; differentiability is a stronger local-map claim

The \(j\)-th partial \(\partial_j f(x)\) asks for change along one coordinate
axis with the others held fixed. Collecting partials is useful, but the formal
multivariable differentiability claim is stronger: there is a linear map
\(Df(x)\) such that

\[
\lim_{h\to0}\frac{f(x+h)-f(x)-Df(x)h}{\lVert h\rVert}=0.
\]

**Core trace / counterexample:** define

\[
q(x,y)=\begin{cases}
\dfrac{x^2y}{x^4+y^2},&(x,y)\ne(0,0),\\
0,&(x,y)=(0,0).
\end{cases}
\]

Both coordinate partials at the origin exist and equal 0, because the axes
make the numerator vanish. Along \(y=x^2\), however, \(q(x,x^2)=1/2\) for
\(x\ne0\); the function is not continuous at the origin, hence not
differentiable there. Axis probes are not a full-neighborhood argument.

**Optional deepening:** continuity of partial derivatives near a point is a
common sufficient route to differentiability; it is not the definition and
does not make every partial-derivative table meaningful without a domain.

### 6.2 Jacobian makes a vector map locally linear

For \(F:\mathbb R^n\to\mathbb R^m\), choose a convention and keep it visible.
Here rows are output components and columns input coordinates:

\[
J_F(x)_{ij}=\frac{\partial F_i}{\partial x_j}(x),\qquad
F(x+h)\approx F(x)+J_F(x)h.
\]

If your array convention stores observations as rows, a batch formula may use
right multiplication or transposes. Shape compatibility is not semantic
correctness.

~~~text
X: (batch, features)        rows are observations
W: (features, outputs)      columns index output coordinates
Y = X @ W: (batch, outputs) coordinate convention named
J_F(x): (outputs, inputs)   derivative of one unbatched map
~~~

The chain rule is composition of local linear maps:

\[
J_{G\circ F}(x)=J_G(F(x))J_F(x).
\]

Read it right-to-left like the data flow. An incorrect transpose can have a
compatible shape on square fixtures yet represent a different map.

### 6.3 Hessian: curvature needs direction and conditions

For a twice differentiable scalar function, the Hessian \(H_f(x)\) collects
second partials. In a regular setting, symmetry follows from equality of mixed
partials; do not assume it for an arbitrary table of numbers. The second-order
Taylor model is

\[
f(x+h)\approx f(x)+\nabla f(x)^\mathsf Th+
\tfrac12h^\mathsf TH_f(x)h.
\]

M28's PSD language returns: a positive-definite Hessian at a stationary point
can support a strict local-minimum conclusion under the standard local
conditions; an indefinite Hessian exposes a saddle direction; a semidefinite
test can be inconclusive. M31 will develop global/constrained optimization and
algorithmic convergence rather than smuggling them into this test.

### 6.4 Autodiff is a program transformation, not a theorem oracle

Automatic differentiation applies chain rules to the executed computation
graph. It can be more accurate than finite differences for that graph, but it
does not establish that the graph represents the intended objective, that a
nondifferentiable branch has one unique derivative, that a result is numerically
stable, or that a stochastic/data pipeline supports a scientific conclusion.

Read this boundary:

```python
loss = ((prediction - target) ** 2).mean()
loss.backward()
```

Ask: Which axes did `mean()` reduce? Are `prediction` and `target` aligned by
semantic feature/observation axes or accidentally broadcast? Is the loss scalar
per the objective? Which dtype/mixed-precision/reduction order is executing?
What is differentiated through, and what is treated as a constant?

---

## 7. Session 5 — Sequences, series, pointwise versus uniform convergence, and legal exchanges

### Pressure

“As \(n\) gets large, the approximation becomes exact” is a sentence with
missing quantifiers, domain, metric, and operation. The difference between
pointwise and uniform convergence determines whether continuity, an integral,
or a derivative can safely transfer to a limit.

### 7.1 Sequences and series: convergence is a quantified claim

A sequence \((x_n)\) in a metric space converges to \(x\) when every accuracy
ball around \(x\) eventually contains every later term. A series
\(\sum_{n=0}^\infty a_n\) converges when its partial sums converge. “Terms go
to zero” is necessary for a series to converge but not sufficient: the harmonic
series supplies the classic boundary.

Absolute convergence of a real/complex series is a powerful condition, but
never confuse it with every type of convergence needed for functions, integrals,
or numerical summation. Rearrangement and finite-precision accumulation add
their own boundaries.

### 7.2 Pointwise and uniform answer different questions

For functions \(f_n:E\to\mathbb R\):

\[
f_n\to f\ \text{pointwise}\iff
\forall x\in E\;\forall\varepsilon>0\;\exists N=N(x,\varepsilon)\;
\forall n\ge N,\ |f_n(x)-f(x)|<\varepsilon.
\]

Uniform convergence moves the \(N\) before the input:

\[
\forall\varepsilon>0\;\exists N=N(\varepsilon)\;\forall n\ge N\;
\forall x\in E,\ |f_n(x)-f(x)|<\varepsilon.
\]

For \(f_n(x)=x^n\) on \([0,1]\), the pointwise limit is 0 on \([0,1)\)
and 1 at \(x=1\). Each \(f_n\) is continuous, but the limit is discontinuous;
therefore convergence cannot be uniform on \([0,1]\). On \([0,r]\) with
\(0<r<1\), \(\sup_x|x^n|=r^n\to0\), so it *is* uniform. The declared domain
changes the answer.

### 7.3 Operations need their own interchange theorem

Use this discipline rather than a vague “limits commute” rule.

| Desired move | A common sufficient route | What is not enough |
| --- | --- | --- |
| Preserve continuity of a limit | continuous \(f_n\) plus uniform convergence | pointwise convergence alone |
| Exchange a limit and integral on a compact interval | uniform convergence plus appropriate integrability, or a named measure-theoretic theorem | a plot of partial sums |
| Differentiate a limit | stronger theorem: e.g., \(f_n\in C^1([a,b])\), \(f_n'\to g\) uniformly, and \(f_n(x_0)\) converges at one base point | pointwise derivative convergence alone |
| Exchange expectation and a limit | a named theorem such as dominated convergence with a measurable, integrable dominant bound, or another verified route | “the sample average looks stable” |

M30 will develop probability spaces, measurability, expectation, and the
probabilistic convergence modes. Here, learn to stop and request the missing
conditions instead of applying an illegal exchange.

### 7.3a One legal exchange, traced rather than named

**Core trace — uniform convergence and integration.** On a bounded interval,
suppose each \(f_n\) and \(f\) is integrable and
\(\sup_{x\in[a,b]}|f_n(x)-f(x)|\to0\). Then

\[
\left|\int_a^b f_n-\int_a^b f\right|
\le\int_a^b|f_n-f|
\le(b-a)\sup_{x\in[a,b]}|f_n-f|\to0.
\]

The same supremum bound that has one stage for the whole interval controls the
integral error. It is a proof route, not a slogan that all limits commute.

**Optional deepening — derivatives and expectation.** A standard derivative
route on \([a,b]\) asks that \(f_n\in C^1([a,b])\), that
\(f_n'\to g\) uniformly, and that the values \(f_n(x_0)\) converge at one base
point. Then \(f_n\to f\) uniformly for a differentiable \(f\) with \(f'=g\);
the derivative limit is continuous because it is a uniform limit of continuous
derivatives. For the future-facing expectation boundary, a dominated-convergence route requires measurable
\(X_n\), almost-sure convergence \(X_n\to X\), a measurable \(Y\) with
\(|X_n|\le Y\) almost surely, and \(\mathbb E|Y|<\infty\). M30 supplies the
measure/probability vocabulary and proof machinery; M29's correct move is to
request these conditions rather than infer them from a stable sample average.

### 7.4 Code-reading boundary: an infinite series is not a loop without a contract

```python
term = 1.0
total = 0.0
while abs(term) > tolerance:
    total += term
    term *= ratio
```

Ask whether `ratio` is fixed, whether \(|ratio|<1\), which error is being
bounded (next-term, tail, rounding, or model error), whether the loop can
terminate, and whether its tolerance is in output units. A successful loop
does not prove uniform convergence, nor does a closed-form series authorize a
reordered floating-point sum.

---

## 8. Session 6 — Constrained extrema, ODE approximation, and the continuous-change dossier

### Pressure

“The derivative is zero, so the model found the answer” confuses a necessary
condition with a global conclusion and ignores constraints, boundaries,
conditioning, numerical convergence, and the objective's human meaning.

### 8.1 Lagrange multipliers compare allowable directions

For a differentiable objective \(f\) restricted by a smooth equality
\(g(x)=0\), a regular constrained extremum (where \(\nabla g\ne0\)) must
satisfy

\[
\nabla f(x)=\lambda\nabla g(x),\qquad g(x)=0.
\]

The gradients are parallel because, along tangent feasible directions, the
first-order change in \(f\) vanishes. It is a candidate condition, not a
complete solution: include all constraints/boundaries, singular points,
feasibility, and comparison/classification.

For \(f(x,y)=x+y\) on \(x^2+y^2=1\), the candidates are
\((1/\sqrt2,1/\sqrt2)\) and \((-1/\sqrt2,-1/\sqrt2)\). The first maximizes
the stated objective; this exact geometry says nothing about which human
outcome an Atlas product should optimize.

### 8.2 ODEs turn a local rule into a trajectory—under assumptions

An initial-value problem has the form

\[
y'(t)=F(t,y(t)),\qquad y(t_0)=y_0.
\]

Existence, uniqueness, stiffness, and long-time behavior require hypotheses;
they are not guaranteed by writing a Python function. Forward Euler uses

\[
y_{k+1}=y_k+hF(t_k,y_k).
\]

For sufficiently regular, well-posed problems and a fixed finite interval,
Euler's global error is typically first order in \(h\). That statement does
not mean halving a step always halves observed error in finite precision or for
stiff/discontinuous/mis-specified dynamics. The error story joins local
truncation, global propagation, conditioning, stability, tolerance policy,
and representation—the exact distinction M28 taught.

### 8.3 Session 6 AI review

An agent proposes:

```python
for _ in range(steps):
    state = state + dt * dynamics(state)
return state
```

Do not ask first whether it runs. Ask: What is `state`'s coordinate/units
contract? Does `dynamics` return units per time? Is `dt` stable/accurate for
this model and time horizon? Is the process continuous, differentiable, or
event-driven? What error control, invariants, conservation law, constraint,
or reference solution exists? What decision would this simulation *not*
justify? M31/M32 will deepen optimization/solver and execution choices.

---

## 9. Continuous Change Studio

The companion **Limits, Change & Convergence Studio** is a local, fixed-fixture
investigation. It does not execute arbitrary learner code, call a remote model,
or store identity, voice, free text, or an oral transcript. It stores only a
choice, confidence, and reveal state in local browser storage when available.

Each view follows the same loop: declared objects → prediction → derivation or
counterexample → algorithm/library boundary → transfer question. It contains:

1. **Limit & continuity:** a removable-discontinuity fixture; distinguish a
   nearby limit, declared point value, and continuity.
2. **Derivative & Taylor:** local linear approximation and finite-difference
   trade-off; distinguish truncation from rounding/noise amplification.
3. **Integral & coordinates:** a two-dimensional linear coordinate map; predict
   why absolute Jacobian determinant changes area and why a region matters.
4. **Gradient & chain rule:** a stated scalar objective and vector-map shape
   contract; trace a Jacobian product before trusting a transposed array.
5. **Convergence:** \(x^n\) on \([0,1]\); distinguish pointwise from uniform
   convergence and identify an illegal continuity exchange.
6. **Constraint & trajectory:** Lagrange candidates and one Euler step-size
   claim; distinguish a candidate/finite trace from a global solver guarantee.

Every CSS visual has an adjacent text equivalent; matrices and fixtures are
real tables; tabs and answer choices support keyboard navigation; feedback is
not color-only; no timer, drag interaction, or score/pass-fail gate is used.
The downloadable bounded teaching model is a finite demonstration, not a proof
engine, numerical library, or production simulation service.

---

## 10. Problem ladder — recognition through design judgment

### A. Recognize

Label each claim **definition/model**, **theorem/proof**, **algorithm/numerics**,
**library contract**, **finite experiment**, or **AI proposal**:

1. “This sampled curve has no adjacent jump larger than 0.01.”
2. “A continuous real function on a compact interval has a maximum.”
3. “This adaptive quadrature call returned an estimate and reported error.”
4. “The agent says the expectation can enter the limit.”

### B. Counterexample

Give the smallest useful counterexample/boundary for each:

- continuity without differentiability;
- pointwise but not uniform convergence;
- positive diagonal entries without a PSD conclusion;
- a finite-difference step that is too small in finite arithmetic;
- stationary but nonoptimal or constrained-infeasible point.

### C. Proof reading

Repair: “\(f_n\) are continuous and \(f_n(x)\to f(x)\) for every \(x\), so
\(f\) is continuous.” State the additional condition or give the
\(x^n\)-on-\([0,1]\) counterexample.

### D. Trace

For \(F(x,y)=(x+y,xy)\), write \(J_F(1,2)\). Let
\(G(u,v)=u^2+v\); use the chain rule to compute the derivative of \(G\circ
F\) at \((1,2)\). State matrix shapes and the convention before multiplying.

### E. Derive

Derive the normal local quadratic model of a scalar function from the first
and second differentials. Name the Hessian condition that is sufficient for a
strict local minimum at a stationary point, and name what remains unresolved.

### F. Debug

Review a numerical derivative, quadrature, or ODE snippet. Identify whether
the primary error is a wrong mathematical object, a missing regularity
assumption, an invalid shape/unit contract, an ill-conditioned problem, an
algorithm/tolerance policy, or an overinterpreted experiment.

### G. Design

Choose a coordinate transform for a two-dimensional synthetic region. State
domain, invertibility/partition condition, Jacobian factor, units, numerical
method, error check, and decision boundary.

### H. Transfer

Audit an ML or scientific claim such as “the gradient was small,” “the
simulation converged,” “the Taylor approximation is accurate,” or “the sample
expectation commutes with the limit.” Specify the smallest additional evidence
or theorem hypothesis that would change your judgment.

---

## 11. Confidence-aware diagnostic

For each question, choose an answer and mark confidence: **guess / somewhat
sure / strong / certain**. A high-confidence miss identifies a model to repair;
it is not a penalty.

### Question 1 — quantified limit

For \(\lim_{x\to a}f(x)=L\), which order captures the definition?

- A. Choose one \(\delta\); samples choose \(\varepsilon\).
- B. For every \(\varepsilon>0\), choose \(\delta>0\), then every sufficiently
  close allowed \(x\) has \(f(x)\) close to \(L\). **Correct.**
- C. Verify 100 inputs close to \(a\).

**Why:** the quantified neighborhood, not a finite grid, establishes the
limit. The domain and excluded point still matter.

### Question 2 — continuity boundary

If \(\lim_{x\to a}f(x)=L\) but \(f(a)\ne L\), which statement is correct?

- A. \(f\) is continuous because the nearby limit exists.
- B. \(f\) is discontinuous at \(a\), although it may have a removable
  discontinuity. **Correct.**
- C. The limit is undefined because the point value differs.

**Why:** continuity requires the declared point value to equal the limit.

### Question 3 — local linearity

What does differentiability at \(a\) most directly provide?

- A. A global line that equals the function.
- B. A local linear map whose remainder is small relative to the input change.
  **Correct.**
- C. A guarantee that every finite difference is accurate.

**Why:** derivative information is local and its numerical estimation has
separate error trade-offs.

### Question 4 — Mean Value Theorem

Which conditions support the ordinary one-variable Mean Value Theorem on
\([a,b]\)?

- A. Differentiability only at endpoints.
- B. Continuity on \([a,b]\) and differentiability on \((a,b)\). **Correct.**
- C. A smooth-looking graph at selected points.

### Question 5 — finite differences

Why is “make \(h\) as small as possible” a poor universal policy?

- A. Smaller \(h\) always increases truncation error.
- B. Truncation can shrink while cancellation/rounding or noisy measurement
  amplification grows. **Correct.**
- C. Derivatives are undefined for polynomials.

### Question 6 — change of variables

For a regular one-to-one two-dimensional coordinate map, which factor adjusts
ordinary area?

- A. \(\det DT\) without regard to sign.
- B. \(|\det DT|\), with hypotheses/partitions stated. **Correct.**
- C. The largest entry of \(DT\).

### Question 7 — gradient semantics

Under the Euclidean inner product, what does \(\nabla f(x)\) represent?

- A. The exact global improvement direction for any step.
- B. The vector representing the derivative linear functional at \(x\).
  **Correct.**
- C. A proof that an objective is appropriate.

### Question 8 — Hessian boundary

At a stationary point, an indefinite Hessian supplies what evidence?

- A. A saddle direction, so not a local extremum under the standard smooth
  test. **Correct.**
- B. A global maximum.
- C. A proof that an optimizer failed.

### Question 9 — pointwise versus uniform

Why do \(f_n(x)=x^n\) on \([0,1]\) fail to converge uniformly to their
pointwise limit?

- A. Each \(f_n\) is discontinuous.
- B. The limit is discontinuous while uniform limits of continuous functions
  are continuous. **Correct.**
- C. The sequence has no pointwise limit.

### Question 10 — exchanging operations

Which is enough by itself to exchange a limit and an expectation?

- A. A large simulated sample looks stable.
- B. A named theorem whose hypotheses are verified, such as dominated
  convergence in its measure/probability setting. **Correct.**
- C. Each function is differentiable once.

### Question 11 — constrained extrema

What does \(\nabla f=\lambda\nabla g\) with \(g=0\) give at a regular
equality-constrained extremum?

- A. A candidate condition requiring feasibility, boundary/singularity, and
  classification checks. **Correct.**
- B. An automatic global optimum.
- C. A numerical stopping rule.

### Question 12 — ODE evidence

An Euler simulation with half the step size changes the final state. What can
you conclude immediately?

- A. The original continuous model is false.
- B. The finite procedure is step-size sensitive; inspect regularity,
  stability, tolerance, horizon, dtype, and a reference/error route. **Correct.**
- C. The new result is necessarily exact.

### Compact repair key — why the plausible alternatives fail

| Question | Why the tempting alternatives fail |
| --- | --- |
| 1 | A reverses the quantifier responsibility; C is finite sampling, not an all-nearby-input implication. |
| 2 | A omits the required equality \(f(a)=\lim_{x\to a}f(x)\); C confuses a point value with nearby behavior. |
| 3 | A turns a local map into a global identity; C erases the stencil, step, dtype, and noise/error contract. |
| 4 | A omits the interior derivative requirement and continuity; C observes appearance rather than interval hypotheses. |
| 5 | A has the truncation direction backwards for common stencils; C is false because polynomials are differentiable. |
| 6 | A loses orientation versus ordinary-area distinction; C ignores the full local map and its determinant. |
| 7 | A turns a first-order local direction into a global policy; C confuses a derivative fact with objective/decision validity. |
| 8 | B overclaims global optimality; C confuses curvature classification with an optimizer's execution history. |
| 9 | A is false because every \(x^n\) is continuous; C ignores the pointwise limit and the endpoint. |
| 10 | A gives an empirical observation, not a theorem route; C says nothing about convergence, measurability, or an integrable bound. |
| 11 | B omits feasibility/classification and possible boundaries; C mistakes a mathematical candidate equation for an algorithm policy. |
| 12 | A blames the continuous model without evidence; C turns one finite refinement into exactness. |

### Interpret the pattern, not the score

- Misses in 1–2: return to M27 quantifiers and M28 norms before advancing.
- Misses in 3–8: redo local-linear and coordinate-contract traces before M31.
- Misses in 9–10: rehearse quantifier order and interchange hypotheses before
  M30/M36.
- Misses in 11–12: repair candidate-versus-guarantee and numerical-model
  boundaries before M31/M32.

---

## 12. Atlas project — Continuous-Change Evidence Dossier

### Brief

Build a **Continuous-Change Evidence Dossier** for one bounded synthetic Atlas
calibration, simulation, feature transformation, or scientific-style signal
model. The deliverable is an evidence argument—not a polished dashboard and
not a claim about a person.

Choose one narrow question, such as: how a declared response curve changes near
a reference point; how a coordinate transform changes a synthetic region's
area; how an accumulated synthetic rate is computed; or how a constrained
continuous model produces candidate choices. State exactly what data/model is
synthetic and what no human/causal decision follows.

### Required evidence

1. A continuous-change card with domain, metric, units, coordinate convention,
   exact object, assumptions, and non-claim.
2. One derivation: \(\varepsilon\)-\(\delta\) limit/continuity, Taylor bound,
   Jacobian/chain rule, integral/change-of-variables, convergence theorem
   application, or constrained-extrema condition.
3. One exact small fixture plus one finite computational trace, explicitly
   labeled with their different evidential strength.
4. A numerical/code-review audit covering dtype, step/tolerance, shape/axis,
   stopping/error policy, and a reference/consistency check.
5. A smallest counterexample or failure mode for a tempting invalid inference.
6. A design decision supported, a decision explicitly *not* supported, and the
   next dependency bridge to M30, M31, M32, M35, or M36.

### Rubric: multi-evidence, never pass/fail

| Dimension | Strong evidence | Fragile pattern to repair |
| --- | --- | --- |
| Model | Domain, metric, units, coordinates, and quantity are unambiguous. | A smooth graph or array shape silently supplies semantics. |
| Derivation | Each theorem/approximation step names its hypothesis and error term. | Formula copied without conditions or limiting process. |
| Computation | Algorithm, dtype, tolerance/step, fixtures, and error scope are inspectable. | Library result called exact, convergent, or stable without evidence. |
| Boundary | Minimal counterexample distinguishes pointwise/uniform, local/global, model/algorithm, or candidate/optimum. | No counterexample; finite samples treated as proof. |
| Transfer | Recommendation changes a concrete later design while preserving non-claims. | Gradient/integral/simulation treated as a human decision. |
| Communication | Reader can trace the claim in a compact card, diagram, code path, and plain language. | Visual flourish obscures assumptions or error boundary. |

---

## 13. TA session and Study Partner session

### Teaching Assistant — analysis and numerical-review clinic

Run a 25–35 minute clinic after Session 4 or 5.

1. Ask the learner to say the \(\varepsilon\)-\(\delta\) or convergence
   quantifiers aloud for one real fixture.
2. Ask them to derive one local linear/Taylor/Jacobian step before numbers are
   revealed.
3. Present one tempting but invalid exchange of limit/integral/derivative; give
   the smallest hint needed to request a hypothesis or construct a counterexample.
4. Read five lines of numerical or autodiff code together. Narrate shapes,
   units, dtype, step/tolerance, and which claim is merely experimental.
5. End with a transfer: “What would this continuous claim *not* justify in an
   ML, scientific, or product decision?”

The TA does not grade speech, speed, notation style, or confidence. It records
only learner-approved concise evidence: model demonstrated, fragile condition,
repair, retrieval prompt, and next bridge.

### Study Partner — convergence and code-reading rehearsal

Run a 10-minute no-grading loop.

1. Name a domain, metric, and limiting process.
2. Predict a limit/derivative/Jacobian/area/convergence answer before reveal.
3. Ask for one missing hypothesis or smallest counterexample.
4. Read one code fragment and narrate its mathematical object, shapes, units,
   and finite error policy.
5. Ask one transfer and finish with: “What would change your mind?”

The Study Partner never assigns mastery. It helps make an internal model
audible and inspectable before TA/oral-defense conversation.

---

## 14. Conversational oral defense — M29

This replaces a traditional coding or written exam. Use GPT Live Chat when it
is available, with the fully equivalent text conversation available at every
stage. You may pause, rephrase, use notes, draw a graph/region, inspect a small
fixture, request a hint, or return after review.

### Invitation and agenda (15–20 minutes)

> “We are going to make one continuous-change model visible together. First
> you will explain it plainly; then you will derive or trace one mechanism;
> then we will test a boundary; then you will transfer it to a new setting. You
> may revise or ask for a hint at any time. We are looking for useful evidence
> and a next bridge, not a pass/fail label.”

1. **Central model.** Explain a limit/continuity, derivative/local linear map,
   integral/change-of-variables, or convergence claim with domain, metric,
   units, and quantifier order.
2. **Derive or trace.** Choose a Taylor/remainder, gradient/Jacobian chain
   rule, constrained-extrema condition, interchange theorem, or Euler/error
   step. Then audit one array/solver code path's shape, dtype, step/tolerance,
   and error boundary.
3. **Boundary.** Handle one: removable discontinuity, cusp, nonuniform limit,
   illegal exchange, singular coordinate map, finite-difference cancellation,
   constrained candidate, or step-size-sensitive ODE trace.
4. **Prediction before reveal.** Predict a nearby value, derivative direction,
   Jacobian effect, area factor, convergence mode, or numerical trade-off.
5. **Novel transfer.** Review an ML loss surface, scientific integral,
   simulation, or calibrated Atlas explanation. State assumptions, evidence,
   error model, tradeoff, and human-impact non-claim.
6. **Confidence reflection.** “What would change your mind about this
   continuous-change claim?”

### Constructive evidence lens — visible, adaptive, and non-scored

The instructor or TA listens for these six kinds of evidence. They are a
conversation map, not points, a ranking, or a pass/fail verdict:

| Evidence lens | What can count as evidence | Support if it is fragile |
| --- | --- | --- |
| Conceptual model | Plain-language distinction between limit, value, local map, accumulation, or convergence mode. | Return to one named object and ask for its domain/codomain before symbols. |
| Reasoning trace | A derivation, proof idea, Jacobian/product trace, or solver step in the learner's own order. | Freeze one step and ask what fact licenses the next arrow. |
| Assumptions and evidence | Regularity, region, units, metric, tolerance, theorem, or implementation contract is named. | Offer a short hypothesis menu and ask which item is still missing. |
| Debugging / counterexample | A smallest broken case or finite-code boundary separates a claim from a shortcut. | Change one condition—endpoint, cusp, singular map, or dtype—and predict again. |
| Transfer / design | The reasoning alters a concrete ML, simulation, or system decision without overclaiming. | Give two possible design choices and ask which evidence would distinguish them. |
| Reflection | The learner names confidence, an uncertainty, and a next retrieval target. | Normalize revision and ask, “What one observation or theorem would change your mind?” |

### Hint ladder — preserve agency before revealing

When you request help, the facilitator uses the least revealing useful rung:

1. **Orient:** restate the exact claim and ask you to name domain, target, and
   evidence type.
2. **Point:** highlight one definition, shape contract, or hypothesis without
   applying it.
3. **Constrain:** offer a simpler one-dimensional/small-matrix/one-step
   analogue or a choice of next operation.
4. **Partial trace:** demonstrate one legal transition, then hand the next
   step back to you.
5. **Model and repair:** show a complete solution only after you have
   attempted it; you then explain which condition made it work and transfer it.

### Misconception repair moments

If the learner says “the derivative is the function's slope everywhere,” ask:
“At which point and over which neighborhood is the linear approximation
claimed?” If they say “the limit can enter the expectation,” ask for a named
interchange theorem and its hypotheses. If they say “the solver converged,” ask
whether that means the iteration stopped, the numerical solution is accurate,
or the mathematical model is appropriate.

### End-of-defense evidence summary

With learner approval, record only:

~~~text
Continuous model and domain/metric demonstrated:
Derivation or code/solver trace reconstructed:
Hypotheses and units named:
Counterexample / approximation / numerical boundary handled:
Misconception repaired or still fragile:
Confidence calibration:
One retrieval prompt:
Smallest next bridge (M30 / M31 / M32 / M35 / M36):
~~~

No bare pass/fail verdict, raw voice recording, sensitive personal content, or
more transcript than needed for this learning record belongs in Notion.

---

## 15. Spaced review and mastery gate

### Retrieval queue

| When | Prompt |
| --- | --- |
| +1 day | State a limit/continuity definition and give a removable-discontinuity or cusp boundary. |
| +3 days | Derive a Taylor/local-linear error statement and explain the finite-difference trade-off. |
| +7 days | Draw a region, use a Jacobian determinant, and distinguish an exact integral from numerical quadrature. |
| +14 days | Contrast pointwise/uniform convergence and name a legal exchange theorem/hypothesis route. |
| +28 days | Audit a new gradient, expectation, simulation, or solver claim for units, shape, assumptions, and non-claims. |

### Continuous-change mastery gate

Before M30–M32, conduct the conversational oral defense through GPT Live Chat
or the fully equivalent text route. Prepare a short **Continuous-Change
Evidence Packet** as evidence for that conversation; it must include:

1. a precise limit/continuity or metric-space claim with quantified reasoning;
2. a derivative/Taylor/Jacobian/Hessian trace with an approximation boundary;
3. an integral/multiple-integral/change-of-variables or constrained-extrema
   derivation with stated conditions;
4. a pointwise/uniform/series or interchange analysis with a counterexample or
   named theorem hypothesis;
5. a code review that catches a shape, unit, derivative, tolerance, step-size,
   stopping, or evidence-boundary error; and
6. a transfer plan naming the next module that needs the model.

If evidence is fragile, slow the route and use a one- or two-dimensional exact
fixture plus a code-reading repair. Do not move forward because the notation
looks familiar.

---

## 16. Sources, licensing, and responsible reading route

The deployed [M29 source map](/downloads/module29_calculus_real_analysis_continuous_change_source_map.md)
and [source-audit addendum](/downloads/module29_calculus_real_analysis_source_audit_addendum.md)
record source owners, exact scope, licensing/reuse boundaries, asset-level
notes, and what each resource cannot establish.

Recommended order:

1. **MIT 18.01 / 18.02 and MIT OCW:** use for a connected undergraduate route
   from single-variable change to multivariable derivatives, integrals,
   coordinate changes, and constrained problems; link rather than reproduce
   course figures or problem sets.
2. **MIT 18.100 real analysis:** use for proof-aware limits, continuity,
   compactness, sequences/series, uniform convergence, and operation-exchange
   hypotheses.
3. **Author-maintained/open analysis text:** use for a second notation and
   proof route where its exact license permits; link and paraphrase by default.
4. **Official SciPy/NumPy documentation:** use only for API contracts and
   numerical-procedure boundaries, never as a theorem or model-validation
   authority.

### Instructor decision rule

Do not reproduce substantial third-party lectures, figures, problem sets,
solutions, code, or transcripts without asset-level license review. Atlas
prose, diagrams, fixtures, code-reading cases, diagnostics, studio design,
project brief, and oral-defense prompts are original. Link and narrowly
paraphrase sources; label every external claim by its actual evidential scope.
