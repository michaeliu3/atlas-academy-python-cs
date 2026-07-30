# Module 30 — Probability, Statistics & Scientific Inference — Source-Audit Addendum

**Research timestamp:** 2026-07-30  
**Scope:** probability, mathematical statistics, scientific inference,
resampling, model criticism, and introductory high-dimensional estimation for
the planned M30 workbook, studio, reference model, TA session, and oral
defense. This is an instructor-facing provenance and claim-boundary audit—not
learner-facing textbook copy.

## Verdict

M30 should teach one connected transformation rather than a shelf of named
tests:

```text
real-world question
  → target population / decision / loss
  → probability model and data-generating assumptions
  → sampling or experimental design
  → observed finite data
  → estimator, interval, test, posterior, or simulation
  → diagnostic / sensitivity / counterexample
  → bounded decision and uncertainty record
```

Probability supplies a language for a *declared* uncertain model. Statistics
uses finite, imperfect observations to learn or act under that model. Neither
a p-value, a posterior, a resample, a simulation, nor an AI-generated chart
can repair an undefined target, unrepresentative sample, hidden selection
mechanism, false likelihood, unsupported exchangeability claim, or an
unexamined decision cost.

The main teaching spine should be MIT's undergraduate **18.600** for the
probability sequence, MIT **18.05** for first-pass applied inference, and MIT
**18.650** plus Penn State **STAT 415** for mathematical-statistics structure.
MIT **6.436J** is the proof-aware extension for conditional expectation,
measure/integration language, convergence, Markov chains, and martingales.
NIST is the practical anchor for study planning, tests, intervals, and power;
MIT **18.S997** and **18.465** make high-dimensional and robustness boundaries
visible before learners overgeneralize a tidy low-dimensional model.

Atlas should author its own explanations, diagrams, fixtures, code-reading
prompts, diagnostic MCQs, project specification, and oral-defense questions.
It should link to sources and use original examples instead of reproducing
lecture slides, problems, solutions, figures, or proprietary textbook content.

The essential evidence discipline is:

> A theorem under named probabilistic assumptions, a statistical guarantee
> under a sampling/model regime, an implementation/API contract, a finite
> simulation, and a real-world conclusion are distinct claims. They require
> distinct evidence.

## Connected prerequisite bridge

M30 belongs after [M27 — Discrete Mathematics, Proof, Counting &
Structures](https://atlas-academy-python-cs.michaelliumingchang.chatgpt.site/modules/27-discrete-mathematics-proof-counting-structures),
[M28 — Linear Algebra, Numerical Stability &
Representation](https://atlas-academy-python-cs.michaelliumingchang.chatgpt.site/modules/28-linear-algebra-numerical-stability-representation),
and [M29 — Calculus, Real Analysis & Continuous
Change](https://atlas-academy-python-cs.michaelliumingchang.chatgpt.site/modules/29-calculus-real-analysis-continuous-change).
The route must show these arrows rather than merely list the modules.

| Incoming evidence | What M30 reuses | What M30 adds without skipping the bridge |
| --- | --- | --- |
| **M27: logic, counting, quantifiers, proof repair, asymptotics, graphs** | The learner can state a sample space/event claim, count a finite model, distinguish a counterexample from evidence for a universal claim, and read a limiting statement's quantifiers. | Probability spaces make event algebra precise; independence and conditional independence become model assumptions rather than visual impressions. A confidence level, type-I error, consistency claim, or concentration bound is quantified and cannot be inferred from a single favorable run. |
| **M28: vectors, matrices, projections, least squares, PSD covariance, conditioning** | The learner can read a data matrix, projection, norm, covariance-shaped matrix, least-squares solution, and numerical-stability warning. | Multivariate distributions, covariance, linear regression, GLMs, PCA/model matrices, and high-dimensional estimation make each object a statistical claim with a sampling regime. `X.T @ X` being invertible or numerically solvable is neither identification, causal validity, nor out-of-sample performance. |
| **M29: integrals, transformations, limits, Taylor/local approximation, uniformity** | The learner can distinguish a continuous mathematical object from a finite computation and request hypotheses before exchanging limits, integrals, or derivatives. | Expectation is an integral under a stated law; density transformation uses a declared map/Jacobian; LLN/CLT/concentration have different modes/rates/assumptions. Likelihood-based asymptotics and Monte Carlo error are not automatic consequences of a plot that “settles.” |

### Forward connections

| Forward module | M30 contribution |
| --- | --- |
| **M31 — Optimization & Information** | Negative log-likelihood, MAP, regularization, score/curvature intuition, uncertainty-aware objectives, entropy/KL, and the distinction between an estimator's target and an optimizer's stopping condition. M31 owns general convergence, duality/KKT, and information-theory proofs. |
| **M32 — Systems Languages, Scientific Python & Accelerators** | Reproducible random-number streams, vectorized simulation, finite dtype/shape/axis contracts, resampling cost, seeded fixtures, and safe library-reading habits. M30 does not claim a library output is a theorem. |
| **M34 — Classical AI** | Conditional independence, Bayesian networks, hidden-state/Markov ideas, decision under uncertainty, and Monte Carlo boundaries become prerequisites for HMMs, MDPs/POMDPs, and probabilistic reasoning. |
| **M35 — Machine Learning & Representation** | Train/validation/test separation, sampling, loss/target, bias–variance, calibration, regularization, resampling, leakage, distribution shift, and model criticism are the evidence layer beneath predictive ML. M30 does not duplicate the catalog of ML algorithms. |
| **M36 — Statistical Learning Theory & Reliable Deep-Learning Systems** | LLN/CLT versus finite-sample concentration, high-dimensional assumptions, minimax language, and the gap between empirical success and a generalization theorem. M36 owns PAC/VC/Rademacher/stability and deep-learning reliability. |
| **M25/M26 — human-centered evidence/capstone** | Every Atlas analytic feature needs a target population, data lineage, uncertainty statement, test/evaluation plan, failure mode, authority boundary, and a learner-explainable rationale. |

## Recommended source set

All URLs below were checked on 2026-07-30. “Link-only” means Atlas may cite
and direct learners to the source but should not import its prose, figures,
exercise wording, solutions, video, or datasets into the deployable project.

| ID | Owner/source and exact URL | Authoritative scope for Atlas | License / reuse decision |
| --- | --- | --- | --- |
| **S01** | Scott Sheffield, MIT OCW, [18.600 Probability and Random Variables](https://ocw.mit.edu/courses/18-600-probability-and-random-variables-fall-2019/) and [lecture-note index](https://ocw.mit.edu/courses/18-600-probability-and-random-variables-fall-2019/pages/lecture-notes/) | The undergraduate probability backbone: axioms/events, conditional probability/Bayes/independence, discrete and continuous RVs, expectation/variance, joint distributions, conditional expectation, moment-generating functions, weak/strong LLN, CLT, finite Markov chains, and introductory martingales. | MIT OCW material is [CC BY-NC-SA 4.0](https://ocw.mit.edu/pages/privacy-and-terms-of-use/). Attribute, link the license, mark changes, and honor NC/SA terms if adapting an exact asset; inspect asset-specific notices. Default: link/cite and write original Atlas explanations/questions/visuals. Do not copy problem or exam material. |
| **S02** | Yury Polyanskiy, MIT OCW, [6.436J/15.085J Fundamentals of Probability](https://ocw.mit.edu/courses/6-436j-fundamentals-of-probability-fall-2018/) and [lecture-note index](https://ocw.mit.edu/courses/6-436j-fundamentals-of-probability-fall-2018/pages/lecture-notes/) | Proof-aware extension: probability measures, conditioning/independence, expectation and abstract integration, product measure/Fubini, derived distributions/transforms, random-vector convergence, LLNs, uniform integrability, stochastic processes, Markov chains, and martingales. The course explicitly includes interchange of limits and expectations. | Same MIT OCW **CC BY-NC-SA 4.0** baseline and asset-level caveat as S01. It is a deepening/reference route, not a license to copy notes or a mandate to teach full measure theory in M30. |
| **S03** | Jeremy Orloff and Jennifer French Kamrin, MIT OCW, [18.05 Introduction to Probability and Statistics](https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/) | First applied connection between probability and statistics: random variables/distributions, Bayesian inference, hypothesis testing, confidence intervals, and linear regression. Its active-learning organization is a useful design reference, but Atlas creates its own interaction design. | MIT OCW **CC BY-NC-SA 4.0** baseline. Link/cite; create original applets, visual treatments, examples, quizzes, and code. Do not reproduce course assessments, reading questions, videos, or their solutions. |
| **S04** | Philippe Rigollet, MIT OCW, [18.650 Statistics for Applications](https://ocw.mit.edu/courses/18-650-statistics-for-applications-fall-2016/), [syllabus](https://ocw.mit.edu/courses/18-650-statistics-for-applications-fall-2016/pages/syllabus/), and [lecture-slide index](https://ocw.mit.edu/courses/18-650-statistics-for-applications-fall-2016/pages/lecture-slides/) | A coherent undergraduate statistical-theory route: parametric inference, MLE, method of moments, parametric testing/goodness of fit, regression, Bayesian statistics, PCA, and GLMs. The syllabus states the key learning goal—formulate a real statistical problem mathematically and understand limitations of methods. | MIT OCW **CC BY-NC-SA 4.0**. Treat slides/videos as link-only by default; do not copy visual layouts, examples, homework, or tests. Atlas can build a fresh likelihood-to-decision evidence model informed by this sequence. |
| **S05** | Penn State STAT ONLINE, [STAT 415 Introduction to Mathematical Statistics](https://online.stat.psu.edu/statprogram/stat415), [point estimation](https://online.stat.psu.edu/stat415/lesson/1), [sufficiency](https://online.stat.psu.edu/stat415/lesson/24), [power/likelihood-ratio route](https://online.stat.psu.edu/stat415/section/10), and [nonparametric/resampling route](https://online.stat.psu.edu/stat415/section/8) | Definitions/learning sequence for MLE, unbiasedness, confidence intervals, tests/power, sufficient statistics/factorization, exponential-family criterion, regression, Bayesian methods, nonparametric methods, and resampling. It is especially valuable for making “good estimator” properties conditional on a target and a model. | Penn State marks course content **CC BY-NC 4.0** except where otherwise noted. Link/cite and make original materials; do not reuse content in any way that conflicts with commercial/deployment uncertainty, and check page-level exceptions. |
| **S06** | Philippe Rigollet, MIT OCW, [18.S997 High-Dimensional Statistics](https://ocw.mit.edu/courses/18-s997-high-dimensional-statistics-spring-2015/), [lecture-note index](https://ocw.mit.edu/courses/18-s997-high-dimensional-statistics-spring-2015/pages/lecture-notes/), and [syllabus](https://ocw.mit.edu/courses/18-s997-high-dimensional-statistics-spring-2015/pages/syllabus/) | Finite-sample high-dimensional route: sub-Gaussian tails/Chernoff bounds, least squares and high-dimensional linear regression, misspecified linear models, oracle inequalities, covariance/matrix estimation, PCA, and minimax lower bounds. The published prerequisites also expose the bridge from real analysis, linear algebra, probability, and mathematical statistics. | MIT OCW **CC BY-NC-SA 4.0**. Use as a link-only deepening source unless specific asset licensing is reviewed; construct original small-data counterexamples rather than copying proof/problem sequences. |
| **S07** | Richard Dudley, MIT OCW, [18.465 Topics in Statistics: Nonparametrics and Robustness syllabus](https://ocw.mit.edu/courses/18-465-topics-in-statistics-nonparametrics-and-robustness-spring-2005/pages/syllabus/) and [lecture-note index](https://ocw.mit.edu/courses/18-465-topics-in-statistics-nonparametrics-and-robustness-spring-2005/pages/lecture-notes/) | Advanced boundary source for ranks/order statistics, outliers, breakdown points, M-estimators/consistency, spatial medians, and the fact that robustness is a declared resistance property—not a generic synonym for “works on bad data.” | MIT OCW **CC BY-NC-SA 4.0**; link/cite, make original explanations and robust-vs-fragile fixtures. The course is a deepening source, not evidence that a particular modern pipeline is robust. |
| **S08** | NIST/SEMATECH, [e-Handbook of Statistical Methods](https://itl.nist.gov/div898/handbook/index2.htm), [experimental design overview](https://itl.nist.gov/div898/handbook/pri/section1/pri11.htm), [test/CI introduction](https://itl.nist.gov/div898/handbook/prc/section1/prc1.htm), [test/power discussion](https://itl.nist.gov/div898/handbook/eda/section3/eda35.htm), [bootstrap caution](https://itl.nist.gov/div898/handbook/eda/section3/bootplot.htm), and [model/data-quality first steps](https://itl.nist.gov/div898/handbook/ppc/section4/ppc41.htm) | Practical scientific-inference source: preplanned experimental factors/responses, sampling/data-quality checks, test/interval interpretation, error/power trade-offs, model assumptions, and bootstrap limits. It supplies a real-world design-and-diagnosis lens rather than a theorem source for arbitrary data. | [NIST copyright guidance](https://www.nist.gov/copyrights-disclaimers) says NIST information is generally public information unless marked otherwise. Attribute NIST; inspect each exact asset for third-party/copyright notices; retain notices for software. Atlas still defaults to original diagrams/prose and does not represent NIST as endorsing Atlas. |
| **S09** | OpenIntro, [*Introduction to Modern Statistics*](https://www.openintro.org/book/ims/) and [license](https://www.openintro.org/license/) | Reader-friendly applied route for data collection, multivariable exploration, regression, simulation/randomization inference, bootstrap, CLT-based inference, and sample-size/power context. It is a helpful readability/active-learning check alongside the proof-aware MIT spine. | Most OpenIntro statistics resources are **CC BY-SA 3.0**, but exceptions include some teacher-only/asset-specific materials, branding, covers, and images. Default to link-only/original Atlas material to avoid license/branding ambiguity; if adapting an exact permitted asset, comply with attribution/SA requirements and use no OpenIntro branding. |
| **S10** | SciPy Developers, [`scipy.stats.bootstrap`](https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.bootstrap.html), [`permutation_test`](https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.permutation_test.html), and [`monte_carlo_test`](https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.monte_carlo_test.html) | Named API input/output/seed/resampling/memory contracts only. Useful for code reading after a learner specifies a target statistic, sampling/exchangeability assumption, exact-versus-randomized procedure, and reproducibility record. | SciPy project code/docs are [BSD 3-clause](https://docs.scipy.org/doc/scipy/dev/core-dev/index.html#licensing) absent an explicit exception. Pin the tested version, retain notices for code reuse, and keep Atlas examples original. A returned CI/p-value/result is not a theorem, causal claim, design validation, or guarantee outside the documented contract. |
| **S11** | Primary-paper anchors: Efron, [“Bootstrap Methods: Another Look at the Jackknife” (1979)](https://projecteuclid.org/journals/annals-of-statistics/volume-7/issue-1/Bootstrap-Methods-Another-Look-at-the-Jackknife/10.1214/aos/1176344552.full); Benjamini & Hochberg, [“Controlling the False Discovery Rate” (1995)](https://doi.org/10.1111/j.2517-6161.1995.tb02031.x); Rubin, [“Inference and Missing Data” (1976)](https://doi.org/10.1093/biomet/63.3.581); White, [“Maximum Likelihood Estimation of Misspecified Models” (1982)](https://doi.org/10.2307/1912526); Huber, [“Robust Estimation of a Location Parameter” (1964)](https://doi.org/10.1214/aoms/1177703732); Tibshirani, [“Regression Shrinkage and Selection via the Lasso” (1996)](https://doi.org/10.1111/j.2517-6161.1996.tb02080.x) | Original scholarly anchors for bootstrap, FDR control, missing-data theory, quasi-MLE under misspecification, robust M-estimation, and regularized estimation. They help prevent simplified folklore from replacing the conditions of the actual result. | **Link-only.** Publisher/platform terms and copyright control reuse; do not reproduce prose, tables, figures, proofs, or exercise wording. Cite a paper only for the result it actually establishes and preserve its assumptions, version, and scope. |

## Claim boundaries the M30 workbook and studio must preserve

| Topic | Safe learner-facing statement | Required hypotheses, counterexample, or evidence label |
| --- | --- | --- |
| Probability laws, sample spaces, and random variables | A probability model assigns probabilities to events in a declared sample space; a random variable is a measurable numerical/function-valued description of an outcome. | A probability assignment is a **model**, not a frequency fact by itself. Name the population/process, outcome space, event, units, and whether the mechanism is physical, sampling-based, subjective, or computational. Do not silently replace a finite equiprobable model with a real sampling frame. |
| Joint, marginal, and conditional distributions | A joint law encodes a model for variables together; marginalization and conditioning answer different questions about that model. | Distinguish (P(A\mid B)) for (P(B)>0) from a regular conditional distribution on continuous/zero-probability events. A correlation, a joint plot, or a conditional average does not establish causal dependence or conditional independence. |
| Bayes and conditional independence | Bayes' rule updates a declared prior by a declared likelihood/evidence model; conditional independence is a structural claim that can simplify a joint model. | State prior, likelihood, evidence, parameter/latent variables, and the conditioning event. “Posterior probability” does not eliminate sensitivity to prior, likelihood, selection, measurement, or model misspecification. Conditional independence is not implied by pairwise correlation or a convenient graph. |
| Expectation, variance, covariance, and transformations | Expectation summarizes a random quantity under its declared law; variance/covariance describe second-moment variation; a transformation carries a distribution through a declared map. | Expectation needs integrability; variance/covariance need the relevant second moments. Zero covariance does not generally imply independence. For density changes, name support, one-to-one/piecewise mapping, and Jacobian where required. A sample mean/variance is an estimator, not the population quantity. |
| LLN, CLT, and concentration | LLN describes convergence of averages under stated conditions; the CLT describes a normalized distributional approximation; concentration gives a finite-sample tail bound with a named tail/dependence condition. | State the mode of convergence, iid/dependence/finite-moment or bounded/sub-Gaussian/martingale assumptions, normalization, and sample regime. The CLT is not a small-​sample error certificate; Chebyshev, Chernoff, Hoeffding, and Bernstein have different premises and rates. A confidence interval derived from one is not a universal guarantee. |
| Conditional expectation, martingales, and Markov chains | Conditional expectation is a random quantity measurable with respect to available information; a martingale has zero conditional drift under a filtration; a Markov chain models a next-state conditional law. | Do not reduce conditional expectation to “plug in a condition” when the conditioning object is a sigma-algebra. A Markov property is not independence; stationary distribution, convergence/mixing, reversibility, and optional stopping each require additional conditions. |
| Monte Carlo | Monte Carlo estimates a specified expectation/probability by an explicitly sampled finite procedure and reports stochastic error/reproducibility details. | Record target, proposal/sampler, seed/RNG/version, sample count, dependence, estimator, stopping rule, uncertainty estimate, and diagnostic. IID Monte Carlo's usual error reasoning does not automatically transfer to correlated MCMC, rare events, adaptive sampling, or biased simulators. Simulation validates code on a fixture—not the real-world model. |
| Statistical models and sampling | A statistical model links a target population/process and a distribution for observable data; a sampling/design story tells what population the data represent. | Name estimand, observational unit, inclusion/assignment mechanism, time window, measurement process, exclusions, missingness, and intended use. Convenience samples, filtering, label construction, and attrition can invalidate a population claim even when computation is exact. |
| Bias, variance, consistency, and efficiency | Bias, variance, MSE, consistency, and efficiency are properties of an estimator relative to a stated target, model class, loss, and sample-size regime. | Unbiased is not automatically low-MSE or preferable; consistency is asymptotic and does not prove finite-sample quality; “efficient” needs a declared comparison class/bound and regularity conditions. Show a biased shrinkage estimator that can reduce MSE. |
| MLE, MAP, Bayesian inference, sufficiency, exponential families | Likelihood ranks parameter values for observed data; MLE maximizes it; MAP adds a declared prior; Bayesian inference represents uncertainty by a posterior. Sufficiency is a model-specific factorization/information statement. | Likelihood is not a probability distribution over parameters until a prior/normalization is supplied. State parameter space, identifiability, support, data independence assumptions, prior, and existence/uniqueness. MAP is parameterization-sensitive; separation/nonidentifiability can make MLE fail. A sufficient statistic is not a universal lossless summary, and exponential-family shortcuts need their support/regularity conditions. |
| Confidence intervals, tests, and multiple testing | A frequentist CI/test is a procedure whose long-run behavior is defined under a sampling/model regime. Multiple-testing control names a family, target error rate, and rule. | A 95% CI is not automatically a 95% posterior-probability statement about one fixed parameter. A p-value is not (P(H_0\mid\text{data})), effect size, practical importance, or replication probability; non-rejection is not acceptance. FWER and FDR differ, and Benjamini–Hochberg requires its stated dependence/valid-p-value conditions. |
| Linear, GLM, and logistic models | Linear regression is linear in declared parameters; a GLM specifies a response law, systematic component, and link; logistic regression models log-odds under its specification. | State unit, outcome, features, link, loss/likelihood, intercept, interaction/offset, treatment of missingness, and prediction versus explanatory/causal purpose. A log-odds coefficient is not generally a risk difference; a fitted line/odds ratio neither proves a cause nor ensures calibration, fairness, transportability, or good out-of-sample performance. |
| Bootstrap and permutation procedures | Bootstrap resamples to approximate a sampling distribution under a stated data-generating/sampling regime; a permutation test uses a null-compatible exchangeability/assignment mechanism. | A resample cannot repair biased selection, dependent observations, invalid labels, or an ill-defined estimand. Name resampling unit, pairing/block/time structure, number of resamples, RNG, CI/test variant, and degeneracy/failure behavior. Exact versus Monte Carlo randomization must be labeled. |
| Experimental design and power | A scientific study is designed before analysis around estimand, assignment/sampling mechanism, measurement, effect size, error budget, and decision consequences; power is conditional on an alternative/design. | Randomization helps establish a particular causal contrast only when execution/measurement/attrition conditions are recorded. Power is not a property of a test alone: it depends on effect size, variance, (n), alpha, design, and analysis plan. Do not use post-hoc “observed power” as a substitute for uncertainty analysis. |
| Misspecification, missing data, and robustness | Model criticism asks how conclusions change when distributional, functional, sampling, or missingness assumptions fail. Robust procedures can limit sensitivity to particular perturbations/outliers. | MCAR/MAR/MNAR are assumptions about a missingness mechanism, not values visible from an NA mask; imputation is a modeling choice, not recovery of truth. Quasi-MLE and robust losses still target a declared pseudo-true/robust quantity under conditions. Robustness to outliers does not solve selection bias, causal confounding, privacy, or harmful labels. |
| High-dimensional estimation | When effective dimension can rival/exceed sample size, estimation needs an explicit structural assumption—e.g., sparsity, low rank, restricted geometry, or prediction-only goal—and finite-sample evaluation. | (p>n) makes ordinary least squares nonunique without extra structure. Regularization trades bias and variance; selected variables need not be “the true causes.” State scaling, feature preprocessing, tuning/validation split, condition/restricted-eigenvalue-style assumption if invoking a theorem, and leakage boundary. |

## Six-session source routing proposal

This is a source-and-learning-move proposal, not a substitute for the eventual
source-audited workbook. It intentionally lets a learner first predict a
claim, then inspect a diagram/code trace/data fixture, then state the
assumption that made the move valid.

| Session | First-principles question and required concepts | Default source route | Original Atlas artifact / evidence move |
| --- | --- | --- | --- |
| **1 — What is a probability claim about?** | How do a target process, sample space, event, random variable, distribution, expectation, variance, covariance, and transformation turn an uncertain situation into a mathematical object? Include joint/marginal laws and a “same mean, different risk” counterexample. | S01; S02 for measure/integration boundary; M27/M29 bridge. | Construct a probability-model card for an Atlas study-event feature. Label outcome, units, population/process, law, target quantity, and what the model does **not** establish. Trace a discrete joint table to marginals/conditionals before using code. |
| **2 — What changes when information arrives?** | How do conditioning, Bayes, conditional independence, conditional expectation, multivariate distributions, and transformations encode “what is known”? | S01, S02, S03. | Read a small evidence-ranking or diagnostic model. Predict a posterior ordering, identify a hidden conditional-independence assumption, then repair an invalid conditional-probability claim. Distinguish a probability update from a causal explanation. |
| **3 — When can repetition earn confidence?** | How do LLN, CLT, Chebyshev/Chernoff/Hoeffding/Bernstein-style bounds, martingale/Markov-chain ideas, and Monte Carlo make finite uncertainty statements? | S01, S02, S06; M29 operation-exchange bridge. | Compare a finite simulation trace with an analytic target and a named bound. Record seed, estimator, (n), model assumptions, observed error, and one failure case. Explain why “the curve settled” is weaker than a bound. |
| **4 — From data to an estimator, posterior, or model** | What are a statistical model, sampling distribution, bias/variance/MSE, consistency/efficiency, likelihood/MLE, MAP, posterior, sufficient statistic, and exponential family? | S04, S05, S01; M28 least-squares bridge. | Annotate a short likelihood/MAP/logistic-code trace: what is data, parameter, prior, objective, and return value? Compare two estimators on a fixed fixture and state why a biased one may have lower MSE. |
| **5 — What exactly does an inferential procedure guarantee?** | How do CIs, tests, p-values, type-I/II error, power, family-wise/FDR control, bootstrap, and permutation procedures connect to a planned study? | S03, S05, S08, S09, S10, S11. | Produce an “inference contract” that names estimand, null/alternative, test statistic, sampling/assignment claim, alpha, effect size, error target, resampling unit, seed, and reporting boundary. Diagnose a tempting but invalid p-value/CI/multiple-testing statement. |
| **6 — Can this model survive contact with data and a decision?** | How do linear/GLM/logistic models, experimental design, missing data, misspecification, robust statistics, and high-dimensional regularization alter what one can responsibly claim? | S04–S08, S11; M28/M31/M35 handoff. | Build a Scientific-Inference Evidence Dossier: data/design map, model card, prediction-before-reveal result, residual/sensitivity or counterexample, uncertainty record, limit statement, and decision/authority boundary. Use it in a constructive oral defense. |

## Coverage ledger: every required topic has a source-backed learning move

| Required area | Formal nucleus | Source route | Mandatory learning move | Implementation / evidence boundary |
| --- | --- | --- | --- | --- |
| Probability laws, RVs, distributions | Probability space; measurable RV; pmf/pdf/cdf/support. | S01, S02, S03 | Translate a story into outcome/event/RV/law; identify an impossible or incomplete law. | A histogram, random seed, or observed frequency is not a proof of the law. |
| Joint/marginal/conditional/multivariate laws | Joint law, marginalization, conditional law, covariance. | S01, S02 | Compute two marginals/conditionals from one joint fixture; explain a Simpson-style conditioning risk. | Correlation and conditional association do not establish cause or independence. |
| Bayes and independence | Product rule, Bayes rule, conditional independence graph. | S01–S03 | Repair a base-rate error and list the prior/likelihood/evidence used. | Posterior calculations inherit model/prior/measurement error. |
| Expectation/variance/transforms | Integral/sum; moments; covariance; pushforward/change of variables; MGF. | S01, S02, M29 | Separate population expectation from sample statistic; trace a transformed RV's support. | Moments/integrals may not exist; zero covariance ≠ independence. |
| LLN/CLT/concentration | Mode of convergence; standardization; finite tail inequality. | S01, S02, S06 | Classify an inference claim as LLN, CLT, or a bound and name assumptions. | No “large enough” without a regime/error argument. |
| Conditional expectation/martingales/Markov chains | Conditional expectation/filtration; martingale; transition kernel/matrix. | S01, S02 | Draw information flow and a transition matrix; name the missing convergence/stopping condition. | Markov ≠ independent; optional stopping/mixing need assumptions. |
| Monte Carlo | Estimator, variance/SE, RNG, dependence/stopping. | S01, S02, S10 | Log seed/target/estimate/error interval for an original fixed fixture. | MCMC/rare-event/adaptive cases are later/deeper unless assumptions are made explicit. |
| Statistical model and sampling | Population, estimand, sampling/assignment, measurement process. | S03, S04, S08, S09 | Write a data-generating/design diagram before computing. | An analysis method cannot manufacture representativeness or causality. |
| Bias/variance/consistency/efficiency | Bias, variance, MSE; asymptotic consistency; comparison class/bound. | S04, S05, S06 | Compare two fixed estimators and give target/loss/regime. | Unbiased/consistent/efficient are not generic praise words. |
| MLE/MAP/Bayesian | Likelihood/posterior; prior; estimator; identifiability. | S04, S05 | Annotate a Bernoulli/Beta or Gaussian toy model from data to MLE/MAP/posterior. | Likelihood is not a parameter probability; MAP is not parameterization invariant. |
| Sufficiency/exponential families | Factorization theorem/exponential form under support conditions. | S05 | Decide whether a proposed summary is sufficient for a declared model and parameter. | “Sufficient” does not mean sufficient for any task/model/loss. |
| CIs/tests/multiple testing | Coverage, null/alternative, error rates, p-value, FWER/FDR. | S03–S05, S08, S11 | Interpret one CI/test/multiple-testing output without overclaiming. | Coverage/p-values depend on the procedure and assumptions; preanalysis choices matter. |
| Linear/GLM/logistic models | Model matrix; conditional mean/distribution/link; likelihood. | S04, S05, S08 | Read dimensions/units/link and separate fitted association from intervention claim. | Linear-in-parameters is not “world is linear”; log odds ≠ probability effect. |
| Bootstrap/permutation | Resampling distribution; exchangeability/randomization null. | S08–S11 | Choose resampling unit and diagnose violated pairing/block/dependence. | Resampling does not fix biased/invalid/selected data. |
| Experimental design/power | Estimand, randomization/blocking, alpha/beta/effect size/sample size. | S08, S09, S05 | Design a tiny comparison study and defend the power inputs/decision cost. | No causal conclusion or power claim without the actual design/execution story. |
| Misspecification/missingness/robustness | Pseudo-true parameter; missingness mechanism; influence/breakdown/M-estimator. | S06–S08, S11 | Perform a sensitivity comparison after an outlier, changed link, or missingness scenario. | Robustness is limited to named perturbations and does not solve selection/ethics/causality. |
| High-dimensional estimation | Effective dimension, regularization, structural assumptions, finite-sample risk. | S06, S11 | Compare least squares and ridge/lasso-like reasoning on a small (p\ge n) fixture; name the tradeoff. | Tuning/selection/evaluation must be separated; sparse coefficients are not causal proof. |

## Deliberate exclusions and handoffs

- M30 gives a rigorous working foundation through measure-aware probability,
  inference, resampling, model criticism, and introductory high-dimensional
  estimation. It does **not** claim a complete graduate sequence in measure
  theory, stochastic calculus, advanced MCMC, causal inference, survival
  analysis, Bayesian nonparametrics, semiparametrics, or decision theory.
- M30 can state and use conditional expectation/martingale/Markov-chain
  definitions with simple finite examples. It does not establish general
  ergodic, optional-stopping, or mixing-time theorems beyond hypotheses the
  workbook actually names.
- M31 owns general optimization algorithms/convergence, constrained duality,
  entropy/KL/information-theory proofs, and variational inference. M30 provides
  likelihood, MAP, regularization, and evidence vocabulary.
- M32 owns full scientific-Python/JAX/PyTorch runtime behavior, accelerators,
  parallel RNG architecture, dtype/layout performance, and deployment. M30
  requires fixed fixtures, seed/version records, and code-reading contracts.
- M34 owns Bayesian networks, HMMs, decision theory, MDPs/POMDPs, planning,
  and multi-agent uncertainty. M30 establishes their probability language.
- M35/M36 own ML model catalog, validation under distribution shift,
  generalization theory, online learning, and deep-learning reliability. M30
  rejects the inference shortcuts that would otherwise make later evaluation
  decorative.

## Source-to-claim hierarchy

| Evidence level | Can support | Cannot support by itself |
| --- | --- | --- |
| 1. A theorem/proof source with named assumptions | A mathematical conclusion for its declared objects and hypotheses. | A different distribution, sampling mechanism, code path, finite precision, or decision context. |
| 2. University/open course source | A coherent instructional sequence, notation, worked route, and context for a theorem. | Permission to copy all assets; a guarantee of mastery or current library behavior. |
| 3. Government scientific-methods guidance | A practical procedure/design/checklist under its scope. | A universal inferential theorem, legal/ethical approval, or fit to a different study. |
| 4. Official library documentation | Inputs, outputs, algorithm options, versioned behavior, and reproducibility controls of a named API. | Model correctness, valid sampling/exchangeability, causal interpretation, or a general statistical theorem. |
| 5. Bounded Atlas model/simulation | Behavior for a named fixture, seed, dtype, algorithm, and run. | A population guarantee or real-world conclusion. |
| 6. AI-generated derivation/code/review | A candidate argument, test, diagram, or patch to inspect. | Authority, correctness, provenance, missing assumptions, or permission to reuse source material. |

## Numerical and simulation evidence policy

Every M30 computational card should name:

```text
scientific/decision question and estimand
population/process and sampling or assignment mechanism
probability/statistical model and assumptions
data schema, units, time window, exclusions, missingness treatment
estimator/test/interval/posterior/simulator and exact formula or API version
RNG algorithm/seed, sample or resample count, dependence and stopping rule
representation: dtype, shape, axis/observation convention, preprocessing
observed output plus analytic/independent check where available
what is theorem, model assumption, API contract, finite experiment, or AI proposal
failure/sensitivity case and the strongest conclusion the evidence does not earn
```

Use synthetic, fixed, non-sensitive fixtures by default. The studio should not
send data, run network requests, accept arbitrary executable code, collect raw
voice/transcripts, or write personal content to Notion. Keep only optional,
minimal, local progress state; a learner chooses whether a concise evidence
summary is recorded.

## Release checklist

- [ ] M27, M28, and M29 arrows appear in workbook, studio, route metadata, and
  source map; M30's learner navigation is after M29 and before M31.
- [ ] Every theorem/panel names the object, target, assumptions, conclusion,
  and a removed-assumption counterexample or sensitivity prompt.
- [ ] Every statistic is paired with its estimand/population/design—not only a
  formula or library function.
- [ ] Every simulation/resampling result exposes target, seed, sample count,
  resampling unit/dependence, method, and a limitation.
- [ ] Visuals have an accessible text/semantic-table alternative, prediction
  before reveal, confidence capture, keyboard support, reduced-motion/forced-
  color support, and no timed/mouse-only/audio requirement.
- [ ] Diagnostic items are original confidence-aware MCQs. Each has an answer,
  reason, plausible alternative failure, assumption boundary, and targeted
  repair—not merely a calculation key.
- [ ] Project, TA, Study Partner, and oral defense require a model/design,
  derivation or code trace, uncertainty/assumption check, counterexample or
  sensitivity analysis, transfer, and reflection. GPT Live Chat is preferred
  for the 15–20 minute constructive oral defense, with an equivalent text
  conversation and revision/hint route.
- [ ] A bounded reference model has no network, filesystem, subprocess,
  database, credential, package-install, or arbitrary-code behavior. Its
  limitations are visible to learners.
- [ ] Sources record owner, exact URL, access date, license/reuse decision, and
  asset-level caveat. Atlas distributes original materials, not copied lecture
  or paper content.

## Instructor decision rule

Ask first: **“What would have had to happen for this number to mean what you
say it means?”** If the learner has a calculation but no estimand, request the
target. If they have a likelihood but no sampling/design story, request the
data-generating model. If they have a p-value, posterior, bootstrap interval,
or simulation but no assumptions, request the procedure contract and a failure
case. If they have a statistically significant or accurate-looking output but
propose an action, request effect size, uncertainty, benefit/harm, affected
people, authority, alternatives, and reversibility.

M30 succeeds when the learner can turn “the model/test/agent says this” into a
small, inspectable argument: what was modeled, what was observed, which
assumption carried the inference, how it could fail, and what limited decision
the evidence actually supports.
