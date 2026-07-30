# Module 30 — Probability, Statistics & Scientific Inference

**Arc VI — Mathematical foundations for uncertain, data-bearing, and learning systems**

> **Bridge:** M27 taught quantified claims, counting, proof repair, and the
> difference between a counterexample and a universal argument. M28 taught
> covariance-shaped geometry, projections, conditioning, and representation.
> M29 taught integrals, limits, convergence, and the discipline of naming the
> hypotheses that permit an operation. M30 turns those tools toward uncertain
> systems: before a number can support a decision, what population, target,
> sampling or assignment process, model, procedure, uncertainty statement, and
> failure boundary must be visible?

**Primary outcome:** You can read a probability or statistical argument from
first principles. You can state its target quantity and probability model,
trace conditioning/Bayes/expectation/likelihood/interval/test/resampling code,
distinguish a theorem from a finite simulation or API return, expose a missing
sampling/design/independence/missingness assumption, and make a limited,
evidence-grounded scientific or engineering recommendation.

This is a rigorous connected first pass—not a claim of full measure theory,
asymptotic statistics, causal inference, advanced MCMC, semiparametrics, or
high-dimensional theory mastery in six sessions. The target is advanced
reader, reviewer, and design readiness: reconstruct the main move, identify
the assumption it needs, find a failure case, and say what evidence would be
needed next.

---

## How to study this module

### The working invariant

> **An inference claim is credible only after its population or target unit,
> estimand, data-generating and sampling/assignment process, probability
> model, finite procedure, uncertainty statement, and decision boundary are
> named. A model, simulated output, estimate, posterior, p-value, interval,
> and causal claim are different kinds of evidence.**

The word *conditional* should stay visible. A probability conditioned on a
test result, a subgroup, a time window, an inclusion event, a design, or an
observed history answers a different question. Removing the condition often
creates the most persuasive-looking error in data science and AI work.

### Evidence labels

| Label | What it can establish | What it does not establish |
| --- | --- | --- |
| **[DEFINITION / MODEL]** | A sample space, distribution, random variable, conditional relation, estimand, likelihood, prior, or loss under declared conventions. | That a real population or data collector follows the model. |
| **[THEOREM / PROOF]** | A law of large numbers, CLT approximation regime, concentration bound, or inferential property from named assumptions. | That a finite data set/code path meets IID, boundedness, identifiability, or sampling hypotheses. |
| **[PROCEDURE]** | The stated behavior of an interval, test, resampling rule, estimator, or design under its procedure contract. | A probability that a fixed null is true, a causal effect, practical importance, or authority to act. |
| **[LIBRARY CONTRACT]** | Inputs, outputs, versioned method choices, RNG/resampling settings, and documented behavior of a named API. | That the chosen statistic/model/design is valid. |
| **[FINITE EXPERIMENT]** | This recorded fixture, seed, data schema, run, and observed comparison. | A population law, a universal theorem, or a real-world conclusion. |
| **[AI PROPOSAL]** | A candidate derivation, test, code review, visualization, or analysis plan. | Correctness, source authority, valid assumptions, or permission to skip review. |

### The six-step learning loop

1. **Name the target.** What population/unit, outcome, estimand, decision, and
   loss or consequence matter?
2. **Name the uncertain model.** What are the sample space, random variables,
   law, conditioning information, support, and independence/dependence claims?
3. **Name the data path.** How were units sampled, assigned, measured,
   filtered, joined, retried, deduplicated, or made missing?
4. **Derive before calculating.** Use Bayes, total expectation, a sampling
   distribution, likelihood, posterior, test/interval definition, or a bound.
5. **Find a boundary.** Change a base rate, dependence pattern, selection
   rule, prior, model support, resampling unit, or stopping rule and say what
   breaks.
6. **Transfer the judgment.** Decide what limited scientific, product, ML, or
   systems action the evidence supports—and what it explicitly does not.

Typing is intentionally secondary. You will read a small bounded model and
run fixed fixtures, but the central work is to make the probability/design
argument audible and inspectable.

### Pace guard: one spine, optional depth

Each session has one **core trace** to reconstruct without notes and one
**optional deepening**. Keep the recurring inference card fixed:

~~~text
Population / target unit / estimand:
Observed unit, sampling frame, and assignment mechanism:
Random variables, event structure, and model:
Estimator / likelihood / posterior / test procedure:
IID, dependence, missingness, measurement, and model assumptions:
Finite computation: seed, version, filtering, denominator, stopping rule:
Uncertainty statement and its interpretation:
Decision supported / explicitly not supported:
What would change the claim:
~~~

If a session feels dense, preserve the core trace and postpone the optional
depth. Never replace a missing assumption with a fluent calculation.

---

## 1. Position in the knowledge system

### 1.1 What M30 deepens rather than repeats

| Earlier seed | M30 deepening | Why it matters later |
| --- | --- | --- |
| M4/M27 sample spaces, conditional probability, counting, quantifiers, proof | Probability laws, random variables, joint/conditional structure, asymptotic and finite-sample claims, counterexamples to informal inference. | An expected runtime, Bayesian update, confidence statement, or ML metric needs a declared probability model. |
| M28 vectors, projections, PSD matrices, conditioning | Multivariate laws, covariance, linear regression/model matrices, high-dimensional nonuniqueness. | Covariance geometry is not causality, identification, or a stable out-of-sample model. |
| M29 integrals, transformations, convergence, interchange discipline | Expectation as integral, distribution transformation, LLN/CLT/concentration conditions, Monte Carlo error. | A simulation that settles is weaker than a named theorem/bound and may converge to the wrong target. |
| M17–M24 runtime, collection, concurrency, network, trust, language evidence | Data provenance, sampling units, duplicate/drop/retry hazards, RNG/reproducibility, privacy and authority boundaries. | Systems behavior can violate an inference assumption before any statistic is computed. |

### 1.2 Prerequisite and forward map

~~~mermaid
flowchart LR
    M27["M27: definitions, quantifiers, counting"] --> M30["M30: probability, inference + scientific evidence"]
    M28["M28: covariance geometry, least squares, conditioning"] --> M30
    M29["M29: expectation/integration, convergence conditions"] --> M30
    M30 --> M31["M31: likelihood objectives, optimization, information"]
    M30 --> M32["M32: RNG, arrays, scientific Python, accelerators"]
    M30 --> M34["M34: Bayesian networks, HMMs, decisions"]
    M30 --> M35["M35: model evaluation, calibration, shift"]
    M30 --> M36["M36: concentration, generalization, lower bounds"]
    M30 --> M25["M25: evidence-grounded AI synthesis"]
~~~

**Text equivalent:** M27 supplies precise events and proof language. M28
supplies data-matrix and covariance geometry. M29 supplies expectation,
integration, convergence, and numerical caution. M30 turns all three into a
probability-to-inference chain. M31 owns objectives/optimization/information;
M32 owns production scientific computing; M34 owns richer decision models;
M35/M36 own ML evaluation and learning theory. M25/M26 remain final synthesis,
not prerequisites.

### 1.3 Entry retrieval

Answer in short notes before beginning.

1. Why is “the average test result was 0.7” not a population-probability
   statement until the target population and sampling process are named?
2. Why can a covariance matrix be PSD while a fitted coefficient vector is
   nonunique?
3. What is the difference between a finite simulation trace and a convergence
   theorem?
4. Why does conditioning on an event with probability zero need special care?

If 1 or 4 is fragile, bridge through M27. If 2 is fragile, bridge through M28.
If 3 is fragile, bridge through M29. Do not start with an API or test name.

---

## 2. One story: the Atlas evidence lab

Atlas is evaluating a **synthetic, non-consequential** retrieval-prompt
simulator. It does not infer ability, diagnose a person, assign a grade, or
authorize an intervention. It lets a design team practice questions such as:

- What is the target outcome: a next-day voluntary recall event, a score, a
  time cost, or an aggregate study-path preference?
- Which units are in the target population, which are observed, and why?
- What does a prompt’s apparent association with recall mean after history,
  timing, missing records, and selection are considered?
- What is the difference between a posterior update, a confidence interval, a
  p-value, a bootstrap range, and a decision rule?
- How would duplicate events, retries, clustering, post-hoc metrics,
  nonresponse, or an unrecorded prior change the conclusion?

~~~mermaid
flowchart TD
    Q["Question + estimand"] --> P["Population / sampling or assignment"]
    P --> D["Observed data + provenance"]
    D --> M["Probability or statistical model"]
    M --> A["Estimator / posterior / test / simulation"]
    A --> C["Uncertainty + diagnostic / sensitivity"]
    C --> R["Bounded recommendation"]
    R --> H["Human authority, revision, and record"]
~~~

**Text equivalent:** A useful question first names the target and population.
Only then can a sampling/assignment mechanism produce observed data. The model
and procedure create an uncertainty statement; a diagnostic/sensitivity check
limits it; a human decides whether the remaining evidence supports a reversible
action. No arrow lets a score or model decide by itself.

### Inference-card example

~~~text
Target: difference in next-day voluntary recall probability for a synthetic prompt policy.
Observed unit: one consented simulated prompt opportunity, not a learner identity.
Design: fictional randomized assignment before the outcome window; no re-use of a unit.
Model: Bernoulli outcome conditional on declared policy and recorded baseline stratum.
Procedure: predeclared difference in proportions plus interval; fixed primary metric.
Assumptions: correct assignment log, no interference, outcome observed equally, no post-hoc filtering.
Finite record: fixture version, seed, sample count, excluded rows, code revision.
Statement: an uncertainty description for this simulation/design, not proof of benefit in real learners.
Decision: whether a small, reversible, consented follow-up study is worth designing.
~~~

---

## 3. Session 1 — From a story to a probability model

### Core trace

~~~text
population/process → sample space → events and random variables → joint law
→ marginal or conditional question → Bayes update → boundary on interpretation
~~~

### 3.1 Model before arithmetic

A **sample space** `Omega` lists possible outcomes of a declared experiment.
An **event** is a set of outcomes. A probability model assigns a number to
each event, preserving nonnegativity, total mass one, and additivity over
disjoint events. A **random variable** maps an outcome to a quantity such as a
binary recall indicator, a duration, a count, or a vector of measurements.

The model is not the world. “Each simulated prompt has probability 1/2 of a
success” is a model statement. “Half the observed records succeeded” is a
finite observation. “The prompt causes success” is a much stronger causal
statement requiring design and execution evidence.

### 3.2 Joint, marginal, and conditional are different questions

Suppose `H` means a synthetic prompt is helpful under its declared model and
`+` means an observed synthetic signal is positive. A joint table is one
model of their co-occurrence:

| | `+` | `-` | marginal |
| --- | ---: | ---: | ---: |
| `H` | 0.009 | 0.001 | 0.010 |
| `not H` | 0.0495 | 0.9405 | 0.990 |
| marginal | 0.0585 | 0.9415 | 1 |

- `P(H)` is a prior/base-rate model claim: `0.010`.
- `P(+ | H)` is sensitivity in this declared model: `0.9`.
- `P(H | +)` is the reverse conditional question: after a positive signal,
  what is the modeled probability of `H`?

Bayes’ rule is an accounting identity once the joint model is declared:

~~~text
P(H | +) = P(+ | H) P(H) / P(+)
         = 0.9 * 0.01 / 0.0585
         = 2 / 13  (about 0.154)
~~~

The result is not “the positive signal is 15.4% true.” It is conditional on
the definitions, base rate, measurement model, and selected population. Change
the base rate, sensitivity, false-positive rate, or inclusion event and the
answer changes.

### Prediction gate

Before revealing the calculation, predict: if the false-positive rate is held
fixed and the base rate becomes smaller, does `P(H | +)` rise, fall, or remain
unchanged? Then state which term in Bayes’ rule forced your answer.

### 3.3 Independence, mutual exclusion, and conditional independence

Events are **mutually exclusive** when they cannot co-occur: `P(A and B)=0`.
They are **independent** when learning one leaves the probability of the other
unchanged: `P(A and B)=P(A)P(B)`. Nontrivial mutually exclusive events cannot
both be independent. A model can make two events conditionally independent
only after a named condition `C`: `P(A and B | C)=P(A | C)P(B | C)`.

Do not infer conditional independence from a low correlation, a neat diagram,
or an agent’s suggestion. It is a structural/model claim that must be defended
from process knowledge or a formal model.

### 3.4 Code-reading lab — conditional direction and denominator

Read this deliberately small function before running it:

~~~python
def posterior_given_positive(prior_helpful, sensitivity, false_positive):
    evidence = sensitivity * prior_helpful + false_positive * (1 - prior_helpful)
    return sensitivity * prior_helpful / evidence
~~~

Trace each name:

| Name | Mathematical role | Question to audit |
| --- | --- | --- |
| `prior_helpful` | `P(H)` | Which population/time window produced this base rate? |
| `sensitivity` | `P(+ | H)` | How were `+` and `H` labeled and validated? |
| `false_positive` | `P(+ | not H)` | Is the negative class comparable and complete? |
| `evidence` | `P(+)` | Does the denominator match the same population/selection event? |
| return value | `P(H | +)` | Is a probability update being misread as a causal or policy conclusion? |

**Debugging investigation:** An AI changes the return line to
`prior_helpful * sensitivity`. What number is now returned? Why is it a joint
probability rather than a posterior? What test fixture would catch the change?

### Optional deepening

For continuous variables, a density value is not itself the probability of an
exact point. Conditioning on zero-probability events needs a regular
conditional-distribution framework. M30 uses finite or density-integral
fixtures; M29’s integration and measure-aware handoff tells you not to divide
blindly by zero.

### Session checkpoint

Write an inference card for one Atlas signal. Include its target population,
sample space, event definitions, direction of conditioning, and one fact that
would make the update invalid.

---

## 4. Session 2 — Expectation, variation, covariance, and information

### Core trace

~~~text
law of X → expectation / variation → joint law → covariance and conditioning
→ transformed quantity or conditional expectation → interpretation boundary
~~~

### 4.1 Expectation is a model-weighted quantity

For a discrete variable `X`, `E[X] = sum_x x P(X=x)`. For a continuous law it
is an integral, when the required integrability holds. It is not automatically
the value a single run will return, the arithmetic mean of arbitrary observed
data, or a guarantee that the corresponding real quantity exists.

For a Bernoulli variable `X` with `P(X=1)=p`,

~~~text
E[X] = p
Var(X) = E[(X - p)^2] = p(1-p)
~~~

The first formula is linear: `E[aX+bY]=aE[X]+bE[Y]` when expectations exist.
It does **not** let you move a nonlinear function inside: usually
`E[g(X)] != g(E[X])`.

### 4.2 Covariance connects M28 geometry to uncertainty

`Cov(X,Y)=E[XY]-E[X]E[Y]` measures joint second-moment structure under the
declared law. A covariance matrix is PSD because its quadratic form is the
variance of a linear combination. That mathematical fact does not establish
independence, causality, fairness, stable estimation, or a unique regression
coefficient.

Zero covariance is weaker than independence except under additional model
conditions (for example, some jointly Gaussian settings). Correlation is a
scale-normalized covariance when the variances are positive; it is not a
causal effect size.

### 4.3 Conditional expectation and the total-expectation repair

If a prompt outcome depends on a recorded stratum `S`, then

~~~text
E[X] = sum_s E[X | S=s] P(S=s)
~~~

This is not an invitation to condition on every available column. Conditioning
on a selection/collider/after-outcome variable can manufacture an association.
First draw the process and say which variables are observed before assignment,
which are outcomes, and which enter inclusion.

### 4.4 Transformations and multivariate laws

A transformation needs a declared input law and map. In a continuous density
route, a change of variables needs support and a one-to-one/piecewise map plus
the appropriate Jacobian factor. In code, an array transform also needs shape,
axis, units, dtype, and missing-value semantics. A histogram after a transform
is a finite visualization, not a derivation of its distribution.

### 4.5 Common distributions and the multivariate-Gaussian bridge

A distribution family is a **conditional model**, not a decorative name. Start
with support, unit, sampling/arrival mechanism, and parameter meaning before
using a PMF, density, or library constructor.

| Family | Compact model statement | Ask before using it | It does **not** establish |
| --- | --- | --- | --- |
| Bernoulli(`p`) | one declared binary outcome | What makes the outcome binary and what population fixes `p`? | That repeated rows are independent or identically distributed. |
| Binomial(`n`, `p`) | count across `n` declared Bernoulli trials | Are there exactly `n` comparable trials with a common `p`? | That a batch of duplicated, clustered, or selected rows is a binomial sample. |
| Geometric(`p`) | trials until first success in a declared sequence | Does the memoryless repeated-trial model fit the mechanism? | That arbitrary elapsed time has a geometric law. |
| Poisson(`lambda`) | count in a named exposure/window | Is exposure recorded and are rate/independent-increment claims credible? | That every nonnegative count is Poisson. |
| Uniform(`a`, `b`) | equal density over a bounded support | Why are values equally plausible over this support? | That an unbounded or selected process is “random enough.” |
| Exponential(`lambda`) | nonnegative waiting time with a memoryless model | Is a constant hazard / memoryless arrival approximation defensible? | That every latency, failure time, or queue delay is exponential. |
| Normal(`mu`, `sigma^2`) | continuous location-and-scale model | What behavior, scale, tails, and measurement support it? | That a bell-shaped plot proves normality or validates an inference procedure. |

**M28 bridge — multivariate normal.** A declared `d`-vector model is

~~~text
X ~ Normal_d(mu, Sigma),      E[X] = mu,      Cov(X) = Sigma.
Y = A X + b  =>  Y ~ Normal(A mu + b, A Sigma A^T).
~~~

Here `mu` is a vector and `Sigma` is symmetric positive semidefinite (PSD):
M28's eigenvalue/principal-minor language says every variance
`v^T Sigma v` must be nonnegative. Positive definite `Sigma` gives the usual
full-dimensional density; PSD `Sigma` can describe a degenerate Gaussian
concentrated on a lower-dimensional subspace. A covariance ellipse is a model
geometry, not a causal diagram.

Partition `X = (X_1, X_2)` and `Sigma` into compatible blocks. The marginal
law of `X_1` uses `mu_1, Sigma_11`. If `Sigma_22` is invertible, the declared
conditional model is

~~~text
X_1 | X_2=x_2 ~ Normal(
  mu_1 + Sigma_12 Sigma_22^{-1}(x_2 - mu_2),
  Sigma_11 - Sigma_12 Sigma_22^{-1} Sigma_21
).
~~~

This is a conditional-model calculation—not evidence that a scatterplot,
histogram, or fitted covariance makes the observed population Gaussian. A
singular conditioning block, selection, missingness, mixtures, heavy tails,
or time dependence changes the available argument.

### Code-reading micro-fixture — affine Gaussian claims are conditional

The bounded reference model evaluates only a tiny, declared bivariate fixture:

~~~python
mean = (1, 2)
covariance = ((2, 1), (1, 2))  # symmetric PSD
transform = ((1, 1), (1, -1))

report = bivariate_normal_affine_report(mean, covariance, transform, (0, 0))
# declared E[Y] = (3, -1); declared Cov(Y) = ((6, 0), (0, 2))
~~~

Read the `A Sigma A^T` path before running it. Which statement is earned?

A. The original data must be Gaussian because the covariance is PSD.  
B. Under the declared bivariate-Gaussian and affine-map model, the transformed
mean and covariance have the reported values.  
C. Zero transformed covariance proves the two transformed quantities are
independent in every population.  
D. A covariance matrix identifies a causal effect.

**Repair:** B. PSD is a structural requirement for a covariance model; normality,
independence, representativeness, and causality require additional arguments.

### Code-reading lab — a denominator hides a population choice

~~~python
def mean_observed_delay(rows):
    delays = [row["delay"] for row in rows if row["delay"] is not None]
    return sum(delays) / len(delays)
~~~

This calculates a mean over **observed nonmissing rows**. It does not establish
the mean delay for all assigned units. Read the code aloud and ask:

1. What unit is one `row`? Can one person create several rows?
2. Why is a value missing? Is it related to the delay or outcome?
3. Were retries, drops, and duplicate messages removed before this function?
4. Are units, time zones, and censoring rules consistent?
5. What target estimand would make this denominator correct?

### Optional deepening — finite Markov and martingale vocabulary

A finite Markov chain says the next-state law depends on a declared current
state through a transition matrix; it does **not** say observations are
independent. A martingale says the conditional next expectation equals the
current value with respect to a declared information history. Optional stopping,
mixing, ergodic, and convergence claims require further conditions. The bounded
model exposes a tiny exact transition trace, not a general theorem engine.

### Session checkpoint

From one joint table, compute a marginal, one conditional distribution,
`E[X]`, `E[Y]`, and covariance. Then write one sentence that states what the
covariance does *not* establish.

---

## 5. Session 3 — Repetition, convergence, concentration, and Monte Carlo

### Core trace

~~~text
population law + sampling/dependence contract → estimator → finite run
→ LLN / CLT / named bound → recorded error statement → non-claim
~~~

### 5.1 Three statements often blurred together

| Tool | Core claim | Typical missing condition | What it does not say |
| --- | --- | --- | --- |
| **LLN** | Averages converge to an expectation under stated assumptions. | IID or an appropriate weaker dependence/integrability regime. | How close one finite sample is with a chosen probability. |
| **CLT** | A normalized estimator has an approximately normal distribution in an asymptotic regime. | A correct normalization and regularity/variance conditions. | That data are normal, that `n` is automatically large enough, or that a tail probability is exact. |
| **Markov inequality** | A nonnegative random quantity has a mean-based upper-tail bound. | `X >= 0`, `E[X] < infinity`, and threshold `t > 0`. | A variance-sensitive or two-sided deviation statement. |
| **Chebyshev inequality** | A finite-variance random quantity has a mean-centered deviation bound. | `Var(X) < infinity` and threshold `t > 0`. | A sharp bounded-variable or IID exponential tail rate. |
| **Concentration bound** | A finite tail probability is bounded under named conditions. | Boundedness/sub-Gaussian/moment and independence or a suitable dependence condition. | That the data collector/model meets those conditions. |

Markov's inequality begins with only nonnegativity and a finite mean:

~~~text
X >= 0, E[X] < infinity, t > 0  =>  P(X >= t) <= E[X] / t.
~~~

Chebyshev applies the same idea to the nonnegative squared deviation
`(X - E[X])^2`, so it needs finite variance and gives
`P(|X - E[X]| >= t) <= Var(X) / t^2`. It can be broadly applicable but loose.
Chernoff/Hoeffding use sharper exponential behavior under bounded/independent
structure. Bernstein can use both a boundedness condition and variance scale.
State the theorem name and hypotheses; do not call every decreasing curve a
“concentration result.”

For IID Bernoulli observations `X_i in {0, 1}` with mean `p`, sample size
`n >= 1`, and `epsilon > 0`, one named Hoeffding statement is

~~~text
P(|mean(X_1,...,X_n) - p| >= epsilon) <= 2 exp(-2 n epsilon^2).
~~~

It does not check whether telemetry rows are IID. Reused learners, clustered
devices, prompt interference, retries, and time drift can make `n` much less
informative than the row count suggests.

### 5.2 Monte Carlo is an estimator, not a spell

A Monte Carlo estimate needs:

~~~text
target quantity; proposal/sampling law; estimator; RNG and seed; draw count;
independence/dependence structure; stopping rule; numerical representation;
observed error estimate or analytic comparison; limitation.
~~~

A fixed seed supports reproducibility of a computation. It does not prove that
the pseudorandom stream resembles the intended law in the use case, that the
model represents a population, or that an adaptive stopping rule is harmless.

### Prediction gate

Two simulations have the same visible number of rows. In one, every row is an
independent synthetic draw; in the other, each group of ten rows repeats one
latent user state. Which simulation has more effective information for a
mean-estimation claim, and what assumption distinguishes them?

### Code-reading lab — finite output versus convergence claim

~~~python
def estimate_rate(draws):
    return sum(draws) / len(draws)

rates = [estimate_rate(run) for run in simulated_runs]
print(rates[-1])
~~~

The final printed rate is a finite observation. To turn it into a reliable
statement, identify the target expectation, each run’s generation law, whether
the denominator is valid, the seed/RNG/version, whether `simulated_runs` are
independent, and a theorem/bound/interval with its assumptions. A plot that
looks stable is a useful question generator—not a proof.

### Session checkpoint

For one fixed fixture, record `n`, target, observed estimate, declared law,
one relevant LLN/CLT/bound statement, a counterexample to its assumptions, and
the strongest conclusion you will *not* make.

---

## 6. Session 4 — Models, likelihood, estimation, and criticism

### Core trace

~~~text
target + sampling/design → statistical model and parameter → likelihood
→ estimator or posterior → bias/variance/identifiability check → model criticism
~~~

### 6.1 A statistical model names the data-generating claim

A statistical model is not just a function call. It names observations, a
parameter or predictive quantity, a family of possible laws, and a relation
between them. Before optimizing or fitting, ask:

1. What is the population/unit and target estimand or predictive task?
2. What is random, what is treated as fixed, and what support is possible?
3. Which rows are sampled/assigned/observed, and are they conditionally
   independent in the proposed model?
4. Is the parameter identifiable from this design and model?
5. What loss/decision will use the estimate, and how could the model fail?

### 6.2 Bernoulli likelihood, MLE, MAP, and posterior are different objects

For `k` successes in `n` declared independent Bernoulli trials with parameter
`p`, the likelihood as a function of `p` is

~~~text
L(p; k, n) = choose(n, k) p^k (1-p)^(n-k),   0 <= p <= 1.
~~~

Taking a log where the terms are defined gives

~~~text
log L(p) = constant + k log(p) + (n-k) log(1-p).
~~~

Its interior derivative is `k/p - (n-k)/(1-p)`. Setting it to zero yields
the MLE `p_hat = k/n` when the boundary cases are handled separately. This is
a derivation inside a model; it does not show that the trials are independent,
that `p` is stable, or that `p_hat` is a safe decision score.

With a declared Beta(`alpha`, `beta`) prior, the posterior for the same
conjugate model is Beta(`alpha+k`, `beta+n-k`). A **posterior** is a probability
distribution over the parameter conditional on the prior and likelihood.
A **MAP** maximizes that posterior density; it is not identical to MLE and can
be sensitive to parameterization/prior. A **likelihood** ranks parameters for
observed data; it is not a probability distribution over parameters until a
prior and normalization are supplied.

The familiar Beta MAP formula
`(alpha_post - 1) / (alpha_post + beta_post - 2)` is an **interior** formula:
it applies only when both posterior parameters exceed one. A posterior such as
Beta(1, 2) has its unique MAP at the boundary `p=0`; Beta(2, 1) has it at
`p=1`; other parameter combinations can be flat or have two boundary modes.
When reading an AI-produced Bayesian helper, distinguish “unique interior
mode,” “unique boundary mode,” and “non-unique mode”—do not let `None` erase
the mathematical case.

### 6.3 Bias, variance, consistency, and efficiency need a target

An estimator is assessed relative to a declared parameter, model class, loss,
and sample-size regime.

| Word | Precise question | Shortcut to reject |
| --- | --- | --- |
| Bias | What is `E[estimate] - target` under which law? | “Unbiased therefore best.” |
| Variance / MSE | How variable is the estimator; what bias–variance tradeoff follows under this loss? | “Lower variance always means less error.” |
| Consistency | Does it approach the target as the relevant sample size grows under named assumptions? | “Consistent means accurate at this n.” |
| Efficiency | Efficient relative to which comparison class/bound and regularity regime? | “Efficient means faster code.” |

A deliberately biased shrinkage rule can lower MSE on a stated model. The
right question is not “is bias bad?” but “which target, loss, and evidence
justify this bias–variance tradeoff?”

### 6.4 Sufficiency and exponential-family boundaries

A statistic is **sufficient** only for a named model and parameter, typically
via a factorization argument. It is not a universal lossless summary for every
future task. Exponential-family structure can make certain sufficient
statistics and likelihood calculations tractable, but support and regularity
conditions still matter.

The only safe move in this first pass is to state the model, parameter,
candidate summary, and factorization route; do not label a dashboard feature
“sufficient” because it is convenient.

### 6.5 Code-reading lab — likelihood is not posterior

~~~python
def bernoulli_log_likelihood(successes, trials, p):
    return successes * log(p) + (trials - successes) * log(1 - p)

def choose_parameter(grid, successes, trials):
    return max(grid, key=lambda p: bernoulli_log_likelihood(successes, trials, p))
~~~

Trace this carefully:

- `p` must lie strictly between 0 and 1 for this particular log expression.
- The function chooses a grid-based MLE approximation, not an exact proof of a
  unique optimum or a Bayesian posterior.
- It assumes the likelihood form is appropriate; it does not check trial
  dependence, repeated units, shifting `p`, mislabeled outcomes, or selection.
- The grid resolution is an algorithmic choice. M31 will own general
  optimization/convergence questions; M30 owns the target/model evidence.

**Debugging investigation:** A patch changes `successes` to `trials` in the
first term. Which likelihood is now encoded? What tiny fixture exposes the
error? Which test would detect that a result is monotone in the wrong data?

### 6.6 Linear, GLM, and logistic model reading

Linear regression is linear in parameters, not a claim that the world is
linear. A generalized linear model names a response law, systematic component,
and link. Logistic regression models a conditional **log-odds** relation under
its specification:

~~~text
log( q / (1-q) ) = beta_0 + beta_1 x_1 + ... + beta_d x_d.
~~~

Applying a logistic transform produces a number between zero and one. It is
not thereby calibrated, a causal probability change, fair, transportable, or
authorized for individual action. Audit data splitting, features, missingness,
units, treatment of time, leakage, calibration, and decision consequences.

### Session checkpoint

Derive the Bernoulli MLE or Beta posterior update on a small fixture. Then
write three separate sentences: what the likelihood says, what the posterior
says under its prior, and what neither says about a real intervention.

---

## 7. Session 5 — Intervals, tests, multiplicity, and resampling

### Core trace

~~~text
estimand + planned design → sampling/assignment distribution → procedure
→ interval / test / error target → multiple-testing or resampling contract
→ interpretation boundary
~~~

### 7.1 Confidence intervals and credible intervals answer different questions

A frequentist confidence interval is a **procedure** with a repeated-sampling
coverage property under its model/design assumptions. In one realized data set,
the parameter is fixed in the usual interpretation and the interval is the
procedure’s output. It is not automatically a 95% posterior probability that
the fixed parameter lies inside.

A Bayesian credible interval describes posterior mass after a declared prior
and likelihood. It is not automatically a frequentist 95% coverage statement.
Both can be useful; neither removes the need to name population, selection,
measurement, model, and decision consequences.

The bounded model’s `standard_error_interval_report` deliberately asks you to
provide the estimate, standard error, and critical multiplier. It calculates
the arithmetic but refuses to pretend it derived a valid standard error or
coverage guarantee.

### 7.2 Hypothesis tests and p-values

A p-value is a tail probability for a test statistic under a named null model,
sampling/assignment procedure, and test definition. It is **not**:

- the probability that the null is true;
- the probability that results happened “by chance” with no model qualifier;
- an effect size, practical importance, replication probability, or decision;
- a license to ignore selective reporting, optional stopping, or many tests.

Before calculating a p-value, write the estimand, null/alternative, test
statistic, tail direction, sampling/assignment/exchangeability argument,
alpha/error budget, stopping rule, analysis-plan timing, and reporting plan.
Non-rejection is not proof of equivalence or acceptance of a null.

### 7.3 Type-I error, Type-II error, and power

For a predeclared decision rule, type-I error is its false-positive probability
under the null model; power is its rejection probability under a named
alternative. Power depends on effect size, variance/distribution, sample size,
alpha, design, test, measurement quality, and the actual execution path. It is
not a property of a test name alone, and post-hoc “observed power” is not a
replacement for an uncertainty analysis.

The bounded reference model enumerates a tiny binomial rule exactly so you can
see the two probabilities change when an assumed alternative changes.

### 7.4 Multiple testing changes the error question

If many hypotheses are investigated, “p below 0.05” must be connected to a
family and an error target. A Bonferroni threshold addresses one family-wise
error route. Benjamini–Hochberg is an FDR-control procedure under its stated
valid-p-value/dependence conditions. Neither makes post-hoc feature selection,
metric shopping, subgroup fishing, or hidden repetitions disappear.

Prediction question: three p-values are `0.01`, `0.04`, and `0.20` with
alpha `0.05`. Which are unadjusted discoveries? Which survive Bonferroni? What
additional condition would be needed before you advertise an FDR conclusion?

### 7.5 Bootstrap and permutation methods are model-based too

- A **bootstrap** resamples observation units to approximate a sampling
  distribution under an IID/appropriate resampling-unit model. It cannot repair
  biased selection, invalid labels, time/dependence structure, or an undefined
  estimand.
- A **permutation/randomization test** uses a null-compatible exchangeability
  or assignment mechanism. The unit, pairing, blocking, and exact-versus-Monte
  Carlo distinction matter.

Read an API result as a procedure contract: the method, sample/resample count,
RNG, statistic, alternative, axes, and finite-precision behavior must all be
recorded. An API return does not establish the data/design assumptions.

### Code-reading lab — a small but invalid decision path

~~~python
if p_value < 0.05:
    publish("prompt policy improves learning")
else:
    publish("no effect")
~~~

Repair this as prose before changing code:

1. Which estimand, target population, and effect size are being claimed?
2. How were units sampled/assigned and outcomes measured?
3. Was the p-value from a predeclared test and one hypothesis family?
4. Which uncertainty interval, sensitivity, and practical benefit/harm matter?
5. What does non-rejection leave unresolved?
6. Who has authority to make a policy decision, and can the action be
   reversible/appealable?

### Session checkpoint

Create an **inference contract** for a synthetic A/B fixture. It must name an
estimand, null/alternative, statistic, assignment/exchangeability claim,
error target, resampling unit, seed/method, stopping/reporting rule, and the
strongest statement that the procedure cannot support.

---

## 8. Session 6 — Design, criticism, missingness, robustness, and dimension

### Core trace

~~~text
scientific question → estimand → sampling/assignment and measurement design
→ analysis plan → diagnostics / sensitivity / counterexample → uncertainty
→ bounded decision and authority record
~~~

### 8.1 Experimental design comes before analysis

Randomization can support a particular causal contrast only when the target,
assignment, execution, outcome measurement, interference/attrition behavior,
and analysis plan are documented. A data table cannot retrospectively create a
sampling frame or consent. For each proposed comparison, name:

- population, eligibility/inclusion/exclusion, and sampling frame;
- unit of assignment and unit of analysis; clustering, pairing, blocking, and
  interference assumptions;
- primary estimand/outcome, measurement window, and practical decision cost;
- assignment mechanism, implementation log, primary analysis, error budget,
  missing-data plan, and stopping/reporting policy;
- privacy, minimization, human authority, reversal, and appeal boundaries.

Association can be useful predictive evidence without establishing a causal
effect. A model score does not authorize an intervention.

### 8.2 Missingness and selection are model claims

`MCAR`, `MAR`, and `MNAR` are claims about a missingness mechanism—not labels
that observed values alone prove. An NA mask cannot reveal the missing values
that would distinguish a nonignorable process. Imputation is a modeling choice,
not recovery of truth. Record why data are missing, which variables predict
missingness, how conclusions change across sensitivity cases, and which target
is no longer identifiable without external information.

### 8.3 Misspecification and robustness

Every model can be wrong in a way that matters. Change one assumption at a
time: distributional tail, link function, measurement rule, support,
independence, time trend, selection, or an outlier. Then say which conclusion
is stable and which is not.

Robustness is not a synonym for “works on bad data.” A median can be less
sensitive than a mean to a particular outlier fixture; it does not cure
selection bias, causal confounding, harmful labels, missingness, or privacy
harm. State the perturbation class and target before calling an estimator
robust.

### 8.4 High-dimensional estimation exposes an identification boundary

When feature count `p` can meet or exceed observation count `n`, ordinary
least-squares coefficients may be nonunique without extra structure. A
regularizer/structural assumption (sparsity, low rank, restricted geometry,
prediction-only target, or prior) changes the problem and introduces a
bias–variance/selection tradeoff. A selected feature is not automatically a
cause, stable explanation, or portable variable.

Connect this to M28: a design matrix has rank at most `min(n, p)`. Connect it
to M31: regularization is an objective/constraint choice. Connect it to M35:
tuning and evaluation must be separated to avoid leakage and selection bias.

### Code-reading lab — design audit across systems boundaries

~~~python
events = load_events(after="2026-07-01")
treated = [e for e in events if e["policy"] == "new"]
control = [e for e in events if e["policy"] == "old"]
effect = mean(e["recall"] for e in treated) - mean(e["recall"] for e in control)
~~~

Before computing `effect`, trace the architecture:

| Boundary | Question |
| --- | --- |
| M18/M19 lifecycle and concurrency | Could retries, delayed writes, shared workers, or partial shutdown duplicate/drop events? |
| M20/M21 network and partial failure | Did one policy have a different delivery/retry/timeout path that changes who is observed? |
| M22 trust and privacy | Is the event lineage consented, minimized, access-scoped, and appropriate for this purpose? |
| M28/M29 representation and approximation | Are units, encoding, time windows, missing values, and numerical summaries valid? |
| M30 design | Was `policy` randomized? Are groups comparable? Which target and estimand match this subtraction? |
| M35 evaluation | Is there leakage, subgroup selection, unplanned metric choice, or distribution shift? |

The subtraction is an observed association until the required design and data
contracts are present.

### Session checkpoint

Write one smallest counterexample or sensitivity case for a proposed Atlas
analysis: a changed base rate, dependent cluster, missing-not-at-random path,
outlier, post-hoc metric, nonunique high-dimensional fit, or failed assignment
log. State which sentence in the final report must be weakened.

---

## 9. Probability & Inference Studio — six prediction gates

The interactive studio uses only fixed synthetic fixtures. It stores only
local choice/confidence/reveal state; it has no raw learner text, no voice
capture, no remote model call, no personal data collection, and no timed
interaction.

| Studio view | Predict before reveal | What the visual makes visible | Text alternative / boundary |
| --- | --- | --- | --- |
| 1. Events and base rates | Which posterior changes when a base rate changes? | Conditional tree and joint-table flow. | Semantic table with the same masses; no causal conclusion. |
| 2. Distribution and variation | Which two groups can share a mean but differ in uncertainty? | PMF, expectation, variance, covariance, units. | Exact table and calculation trace; zero covariance is not independence. |
| 3. Samples and convergence | Which trace has more effective information and why? | Fixed sample means, dependence warning, named LLN/CLT/bound labels. | Values/assumptions table; a finite trace is not a theorem. |
| 4. Likelihood and posterior | Does the likelihood, prior, or posterior move when a count changes? | Tiny Bernoulli likelihood and Beta update. | Formula/parameter table; no real-world validation. |
| 5. Intervals and procedures | Which statement is a valid p-value/CI/posterior/multiple-testing interpretation? | Procedure cards with an error target and resampling unit. | Explicit interpretation text; no pass/fail score. |
| 6. Design and decision | What assumption failure weakens the proposed recommendation first? | Design map, attrition/multiplicity/missingness/sensitivity choices. | Checklist and human-authority boundary. |

Every view includes keyboard-operable controls, visible focus, semantic text,
reduced-motion and forced-color support, and an answer-specific repair.

---

## 10. Confidence-aware diagnostic — 12 high-value checks

For every item, select **guess / somewhat sure / strong / certain** before
revealing the explanation. A high-confidence miss triggers a short targeted
bridge and a later retrieval prompt, not a penalty.

### Q1 — Statistic, estimand, and population

A table shows that 63% of records with nonmissing outcomes had `recall=1`.
Which statement is strongest?

A. The population recall probability is 0.63.  
B. The observed nonmissing-record proportion is 0.63; a population claim needs
the target and sampling/missingness process.  
C. The new policy causes recall 63% of the time.  
D. The event is independent because the sample is large.

### Q2 — Conditional direction and base rate

Which expression answers “given a positive signal, how likely is `H`?”

A. `P(+ | H)`  
B. `P(H) P(+ | H)`  
C. `P(H | +)`  
D. `P(+) / P(H)`

### Q3 — Exclusivity versus independence

Two nonzero-probability events cannot occur together. Which is true?

A. They are independent because neither affects the other.  
B. They cannot be independent because their joint probability is zero but the
product of their positive probabilities is not.  
C. They are conditionally independent given any event.  
D. They have correlation zero.

### Q4 — Expectation and nonlinear transforms

Which identity is always safe when the expectations exist?

A. `E[g(X)] = g(E[X])` for every function `g`.  
B. `E[X^2] = (E[X])^2`.  
C. `E[aX + bY] = aE[X] + bE[Y]`.  
D. `Var(X+Y) = Var(X)+Var(Y)` without any covariance condition.

### Q5 — Covariance and causal claims

An analysis finds zero covariance between `X` and `Y`. What follows?

A. `X` and `Y` are independent.  
B. `X` does not cause `Y`.  
C. The declared joint model has zero second-moment covariance; independence or
causality needs additional conditions/evidence.  
D. A linear regression coefficient must be zero in every adjusted model.

### Q6 — LLN, CLT, and finite evidence

Which statement best distinguishes the LLN from the CLT?

A. LLN says finite data are normal; CLT says averages converge.  
B. LLN concerns convergence of averages under assumptions; CLT concerns an
asymptotically normalized sampling distribution under its assumptions.  
C. They are names for the same theorem.  
D. Either validates the data-generating model once a plot settles.

### Q7 — Concentration-bound boundary

You quote a Hoeffding bound for an average of binary telemetry rows. What is
the most important audit question?

A. Which chart color was used?  
B. Whether the rows satisfy the bound’s boundedness and relevant independence
or dependence assumptions.  
C. Whether the final observed average is close to 0.5.  
D. Whether an AI wrote the formula.

### Q8 — Likelihood, MLE, MAP, posterior

Which statement is correct?

A. A likelihood is already a probability distribution over parameters.  
B. An MLE maximizes a likelihood; a MAP incorporates a declared prior; a
posterior requires model plus prior normalization.  
C. A MAP is always equal to the MLE.  
D. A posterior eliminates model misspecification.

### Q9 — Confidence interval interpretation

A valid 95% frequentist interval is produced by a specified procedure. Which
statement is safe?

A. There is a 95% probability the fixed parameter lies in this realized range.  
B. In repeated use under the stated regime, the procedure covers the fixed
parameter 95% of the time.  
C. The interval proves practical importance.  
D. The interval proves the sample is representative.

### Q10 — P-values and many analyses

A team tried 40 outcomes after seeing the data and reports the smallest
unadjusted p-value. What repair is needed first?

A. Round the p-value to more decimals.  
B. Name the hypothesis family, selection path, error target, and a valid
multiple-testing/reporting procedure.  
C. Call the smallest p-value a posterior probability.  
D. Treat every other outcome as a replication.

### Q11 — Bootstrap or permutation?

Which choice is correct?

A. Bootstrap resampling repairs selection bias automatically.  
B. A permutation test needs a null-compatible exchangeability/assignment
argument and an appropriate resampling unit.  
C. A p-value from either method is the probability that the null is true.  
D. A fixed RNG seed proves the method is valid.

### Q12 — Missingness and high dimension

An observational model has 20 features, 8 rows, and outcome values missing
more often after a poor experience. Which statement is strongest?

A. Ordinary least squares has unique coefficients because software returned
some numbers.  
B. The missingness is MAR because a missingness column exists.  
C. `p > n` and outcome-linked missingness require explicit structural and
missingness assumptions/sensitivity analysis; neither is solved by a fit call.  
D. Lasso-selected features prove causes.

### Diagnostic repair key

| Q | Correct | Why it is correct | Repair for plausible wrong answer |
| ---:| --- | --- | --- |
| 1 | B | It names the observed denominator and requests the path to the target population. | A confuses a statistic with an estimand; C adds causality; D adds an untested independence claim. |
| 2 | C | It conditions `H` on the observed positive evidence. | A reverses the question; B is a joint probability; D is not a conditional probability rule. |
| 3 | B | Positive marginal probabilities make the product positive while the joint is zero. | A confuses exclusivity with noninteraction; C/D do not follow. |
| 4 | C | Linearity is the relevant expectation law. | A/B fail for nonlinear transforms; D requires zero covariance or another condition. |
| 5 | C | Zero covariance is a limited second-moment statement. | A/B/D upgrade it to independence, causality, or an adjusted-model claim. |
| 6 | B | The two results answer different asymptotic questions. | A reverses them; C/D erase assumptions. |
| 7 | B | A theorem’s hypotheses are part of the claim. | C is an observation, not a premise; A/D are irrelevant. |
| 8 | B | It separates the likelihood, optimization target, prior, and posterior. | A/C/D remove a required ingredient or limitation. |
| 9 | B | This is the usual procedure-based coverage interpretation. | A is a Bayesian-sounding statement; C/D are stronger claims. |
| 10 | B | The family and selection route determine the error question. | A changes presentation; C/D change meanings rather than procedure. |
| 11 | B | Exchangeability/assignment and resampling unit are substantive assumptions. | A/C/D give resampling or seeds magical authority. |
| 12 | C | It makes rank/nullity and missingness assumptions explicit. | A/B/D are common overclaims from software output or selected variables. |

---

## 11. Project — Uncertainty & Inference Evidence Dossier

### Brief

Build a rigorous dossier for one **synthetic, non-consequential** Atlas
question. It may concern a fictional prompt policy, aggregate workflow signal,
or simulator—not a real learner, diagnosis, eligibility decision, or sensitive
attribute. The goal is not to produce a favorable conclusion. It is to make a
limited inference argument inspectable and repairable.

### Required artifacts

1. **Completed inference card.** Population/unit, estimand, data path,
   model/conditions, procedure, computation record, uncertainty, decision and
   non-decision.
2. **Model and derivation.** Derive one of: Bayes update, expectation/total
   expectation, covariance statement, a concentration step, Bernoulli
   likelihood/MLE/MAP/posterior, interval/test/power rule, or resampling
   argument. Label theorem/model/procedure/finite computation separately.
3. **Code/model reading trace.** Audit a compact data/inference path for
   denominator, unit, seed/version, filter, duplicate/retry, shape/axis,
   missingness, likelihood/return value, and decision-language errors.
4. **Finite fixture.** Use the bounded reference model or an equally small
   deterministic synthetic trace. Record inputs and outputs; do not promote it
   into a population or causal conclusion.
5. **Counterexample or sensitivity.** Change one base rate, prior, dependence,
   selection/missingness assumption, resampling unit, outcome definition,
   outlier, model link, or high-dimensional structural assumption.
6. **Uncertainty and recommendation.** State the narrow conclusion, its
   uncertainty, the authority boundary, and one reversible next evidence step.
7. **Forward map.** Give one bridge each to M31, M35, and M36 plus one systems
   collection/provenance boundary from M17–M24.

### Acceptance criteria

| Evidence | Accept when | Do not accept |
| --- | --- | --- |
| Target | Population/unit, estimand, and decision cost are distinct and visible. | “We measured a metric” with no target or authority boundary. |
| Mathematics | The derivation has defined quantities, conditions, and a checked transition. | Formula substitution without a model or assumptions. |
| Code reading | The data/model path is narrated in terms of units, denominator, version, and return contract. | A screenshot/metric with no trace. |
| Uncertainty | The interval/test/posterior/bound is interpreted within its procedure/model. | “Significant/probable” used as a decision or causal proof. |
| Criticism | One smallest failure case weakens a precise conclusion. | Generic disclaimer with no changed claim. |
| Human impact | The evidence supports only a limited, reversible action with explicit authority. | Automated eligibility, diagnosis, grading, or sensitive profiling. |

---

## 12. TA clinic and Study Partner routine

### Teaching Assistant — 25–35 minute inference clinic

1. Ask the learner to state the target population, unit, estimand, and a data
   collection/assignment story before naming a method.
2. Ask for one Bayes/expectation/concentration/likelihood/interval/test step in
   the learner’s own words. Request the assumption that licenses each arrow.
3. Read five to ten lines of data or inference code together. Trace units,
   denominator, sampling/selection, missingness, seed, version, shape/axis,
   and return contract.
4. Present one boundary: base-rate reversal, dependence, selection, prior
   sensitivity, multiplicity, post-hoc stopping, missingness, outlier, or
   nonunique high-dimensional fit. Give the smallest helpful hint.
5. End with a transfer to ML evaluation, scientific simulation, telemetry, or
   experimental design, and agree on one retrieval prompt.

The TA does not grade speech speed, accent, notation style, or confidence. It
records only learner-approved concise evidence: demonstrated model, fragile
assumption, repaired misconception, retrieval prompt, and next bridge.

### Study Partner — 10-minute no-grading rehearsal

1. Name population, target, unit, and model before looking at a number.
2. Predict a posterior, expectation, concentration direction, likelihood move,
   or interval interpretation before reveal.
3. Ask, “What is conditioned on?” and “What would change your mind?”
4. Read one code fragment and state its denominator, seed/version, assumptions,
   and strongest non-claim.
5. Choose one smallest counterexample and one future-module handoff.

The Study Partner rehearses reasoning and accountability; it never assigns
mastery or collects private material.

---

## 13. Conversational oral defense — M30

This replaces a traditional coding or written exam. Use GPT Live Chat when it
is available, with an equivalent text conversation at every stage. You may
pause, rephrase, use notes, draw a probability tree/design map, inspect a
small fixture, request a hint, or return after review.

### Invitation and agenda (15–20 minutes)

> “We are going to make one inference argument visible together. First you
> will explain the target and model plainly; then you will derive or trace one
> step; then we will change an assumption; then you will transfer the result to
> a design decision. You may revise or request a hint at any time. We are
> collecting useful evidence and a next bridge, not a pass/fail label.”

1. **Central model.** Explain an inference card: population/unit, estimand,
   probability model, sampling/assignment path, and uncertainty target.
2. **Derive or trace.** Choose a Bayes/conditional-expectation/concentration/
   likelihood/MLE/MAP/interval/test/resampling step. Then audit one compact
   code path’s data unit, denominator, seed, selection, and return contract.
3. **Boundary.** Handle one: base-rate change, dependence, selection,
   misspecification, prior sensitivity, multiplicity, invalid exchangeability,
   missingness, contamination, or high-dimensional nonuniqueness.
4. **Prediction before reveal.** Predict how a posterior, variance, tail bound,
   likelihood, interval, p-value procedure, or design conclusion changes when
   one assumption changes.
5. **Novel transfer.** Review a proposed ML evaluation, telemetry analysis, or
   synthetic experiment. State the target, evidence, uncertainty, tradeoff,
   privacy/authority boundary, and strongest non-claim.
6. **Confidence reflection.** “What observation, theorem condition, or design
   record would change your mind about this claim?”

### Constructive evidence lenses — visible, adaptive, and non-scored

| Evidence lens | What can count as evidence | Support if fragile |
| --- | --- | --- |
| Model and target | Plain distinction between population, sample, unit, estimand, law, and procedure. | Return to the inference card and choose one line to make concrete. |
| Reasoning trace | A Bayes, expectation, likelihood, interval/test, or resampling argument in the learner’s order. | Freeze one arrow and ask what definition/assumption licenses it. |
| Sampling/design evidence | Assignment, sampling frame, dependence, measurement, selection, and missingness are named. | Offer a short design map and ask which arrow is undocumented. |
| Debugging/counterexample | A smallest base-rate/dependence/multiplicity/missingness or code-path repair. | Change one variable and ask for a prediction before calculation. |
| Transfer/design judgment | A limited recommendation connects evidence to a real system without overclaiming. | Compare two reversible next steps and ask what evidence distinguishes them. |
| Reflection | The learner names confidence, uncertainty, and a next retrieval target. | Normalize revision and ask, “What would change your mind?” |

### Hint ladder — preserve agency

1. **Orient:** restate the target, conditioning information, and evidence
   type; ask what is known versus assumed.
2. **Point:** highlight one term in the inference card, code trace, or formula
   without applying it.
3. **Constrain:** offer a two-outcome or two-group analogue, or a choice of
   two candidate assumptions.
4. **Partial trace:** demonstrate one legal step, then hand the next step back.
5. **Model and repair:** show a full route only after an attempt; the learner
   explains which condition made it valid and transfers it.

### Misconception-repair moments

If the learner says “the p-value is the chance the null is true,” ask: “Under
which null model and procedure is that tail probability defined?” If they say
“the bootstrap fixed bias,” ask for the original sampling frame and resampling
unit. If they say “the model predicts a probability,” ask for calibration,
population, shift, and decision evidence. If they say “the fit proves the
feature caused the outcome,” ask for the assignment/causal design path.

### End-of-defense evidence summary

With learner approval, store only:

~~~text
Population / estimand / probability model demonstrated:
Derivation or code/data trace reconstructed:
Sampling, selection, missingness, and procedure conditions named:
Counterexample / sensitivity / debugging boundary handled:
Misconception repaired or still fragile:
Confidence calibration:
One retrieval prompt:
Smallest next bridge (M31 / M32 / M34 / M35 / M36):
~~~

No bare pass/fail verdict, raw voice recording, sensitive personal content, or
more transcript than necessary belongs in Notion.

---

## 14. Spaced review and mastery gate

### Retrieval queue

| When | Prompt |
| --- | --- |
| +1 day | Draw a joint table and state the difference between `P(A|B)` and `P(B|A)`. |
| +3 days | Derive expectation/variance/covariance on a small law and name a non-claim. |
| +7 days | Classify a statement as LLN, CLT, or concentration; name its assumptions. |
| +14 days | Compare likelihood, MLE, MAP, posterior, confidence interval, p-value, and bootstrap range. |
| +28 days | Audit a new data/ML/system claim for target, sampling, selection, uncertainty, and authority. |

### Probability-and-inference mastery gate

Before M31–M36, conduct the conversational oral defense through GPT Live Chat
or the fully equivalent text route. Prepare an **Uncertainty & Inference
Evidence Packet** containing:

1. a probability model with sample space/event/RV and a Bayes or conditional
   structure trace;
2. an expectation/covariance/transformation or conditional-expectation
   argument with a population-versus-estimator distinction;
3. a repetition/Monte Carlo/LLN/CLT/concentration claim with a named
   assumption and finite-evidence boundary;
4. a likelihood/MLE/MAP/posterior or estimator-property analysis with an
   identifiability/misspecification check;
5. an interval/test/multiple-testing/bootstrap/permutation interpretation with
   its design/procedure contract;
6. a code/data review that catches denominator, unit, selection, duplicate,
   seed, missingness, dependence, or authority error; and
7. a transfer plan naming M31, M32, M34, M35, or M36.

If evidence is fragile, slow the route. Repair the inference card and use a
two-outcome/two-group exact fixture before adding library APIs or real data.

---

## 15. Sources, licensing, and responsible reading route

The deployed [M30 source map](/downloads/module30_probability_statistics_scientific_inference_source_map.md)
and [source-audit addendum](/downloads/module30_probability_statistics_scientific_inference_source_audit_addendum.md)
record source owners, exact scope, licensing/reuse boundaries, asset notes, and
the assumptions behind each advanced route.

Read the [bounded reference model](/downloads/module30_reference.py) and its
[behavioral test suite](/downloads/test_module30_reference.py) only after a
prediction gate or worked derivation. They expose small, exact fixtures for
code reading and assumption audits; they are not a theorem prover, statistical
package, causal estimator, or substitute for a declared data-generating model.

Recommended order:

1. **MIT 18.600 / 6.436J:** use for formal probability, conditional
   expectation, convergence, finite Markov chains, and martingale vocabulary.
2. **MIT 18.05 / 18.650 and Penn State STAT 415:** use for the probability to
   likelihood/inference/regression sequence; link rather than reproduce their
   assessments or examples.
3. **NIST and OpenIntro:** use as a reader-friendly scientific-design and
   resampling contrast; preserve the procedure conditions and licensing notes.
4. **MIT high-dimensional/robustness sources and original papers:** read after
   the core inference card is clear; do not turn a paper title into a claim
   without its assumptions.
5. **Official SciPy documentation:** use for a named API contract only after
   target, statistic, resampling unit, method, and version are declared.

### Instructor decision rule

Ask first: **“What would have had to happen for this number to mean what you
say it means?”** If the learner has a calculation but no estimand, request the
target. If they have a likelihood but no data-generating/sampling story, ask
for it. If they have a p-value, posterior, bootstrap interval, or simulation
but no assumptions, request the procedure contract and a failure case. If they
propose an action, request effect size, uncertainty, benefit/harm, affected
people, authority, alternatives, and reversibility.
