# Module 30 — Probability, Statistics & Scientific Inference: Source Map

## Purpose and use boundary

This is the learner-facing source and provenance map for the Module 30
workbook, Probability & Inference Studio, diagnostic, *Uncertainty & Inference
Evidence Dossier*, bounded Python reference model, TA clinic, Study Partner
routine, and constructive oral defense.

- **Research snapshot:** 2026-07-30. Recheck URLs, editions, licenses, and
  current library behavior before reusing an asset or making a version-specific
  claim.
- **Route position:** M27 → M28 → M29 → **M30** → M31/M32/M34/M35/M36, with
  M27 and M29 as direct proof/analysis prerequisites and M28 as the visible
  geometry/covariance bridge.
- **Copyright rule:** Atlas prose, diagrams, code traces, fixtures, quizzes,
  project prompts, and oral questions are original. Sources are linked and
  narrowly paraphrased; do not copy course notes, exercises, exams, figures,
  slides, videos, datasets, or paper text without asset-level permission.
- **Full audit:** [M30 source-audit addendum](module30_probability_statistics_scientific_inference_source_audit_addendum.md)
  records the coverage ledger, claim boundaries, research rationale, and release
  checklist in more depth.

## The connected source spine

```text
target population / estimand
  → sample space and probability model
  → joint/conditional structure and expectation
  → sampling or assignment design
  → estimator, likelihood, posterior, interval, test, or simulation
  → diagnostic, counterexample, or sensitivity analysis
  → limited decision with an uncertainty record
```

The crucial distinction is not between “math” and “code.” It is between a
definition/theorem under named hypotheses, a statistical procedure under a
sampling/model regime, a library contract, a finite computation, and a
real-world claim. None automatically upgrades into the next.

## Source cards

| ID | Source | What it contributes | Reuse boundary |
| --- | --- | --- | --- |
| S01 | [MIT 18.600 Probability and Random Variables](https://ocw.mit.edu/courses/18-600-probability-and-random-variables-fall-2019/) and its [lecture notes](https://ocw.mit.edu/courses/18-600-probability-and-random-variables-fall-2019/pages/lecture-notes/) | Undergraduate probability spine: events, conditional probability, common discrete/continuous and multivariate-normal models, expectation, joint laws, LLN/CLT, Markov and Chebyshev inequalities, Markov chains, martingales. | MIT OCW course material is normally CC BY-NC-SA 4.0 subject to asset notices. Link/cite and build original explanations and visuals. |
| S02 | [MIT 6.436J Fundamentals of Probability](https://ocw.mit.edu/courses/6-436j-fundamentals-of-probability-fall-2018/) and [lecture notes](https://ocw.mit.edu/courses/6-436j-fundamentals-of-probability-fall-2018/pages/lecture-notes/) | Proof-aware route for probability measures, conditional expectation, integration, convergence, Markov chains, and martingales. | Same MIT OCW baseline; deepening/reference only, not a mandate to copy notes or teach full measure theory. |
| S03 | [MIT 18.05 Introduction to Probability and Statistics](https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/) | First applied bridge through random variables, Bayesian inference, tests, intervals, and regression. | MIT OCW CC BY-NC-SA 4.0 baseline. Atlas interaction design and questions remain original. |
| S04 | [MIT 18.650 Statistics for Applications](https://ocw.mit.edu/courses/18-650-statistics-for-applications-fall-2016/) and [syllabus](https://ocw.mit.edu/courses/18-650-statistics-for-applications-fall-2016/pages/syllabus/) | Parametric inference, likelihood/MLE, tests, regression, Bayesian statistics, PCA, and GLMs. | Link/cite; treat slides, exercises, and videos as link-only by default. |
| S05 | [Penn State STAT 415](https://online.stat.psu.edu/statprogram/stat415), [point estimation](https://online.stat.psu.edu/stat415/lesson/1), [sufficiency](https://online.stat.psu.edu/stat415/lesson/24), and [power/likelihood route](https://online.stat.psu.edu/stat415/section/10) | Mathematical-statistics structure: estimator properties, likelihood, intervals/tests/power, sufficient statistics, exponential families, resampling. | Penn State marks course content CC BY-NC 4.0 except where noted; link and use original assets because deployment/reuse needs asset-specific review. |
| S06 | [MIT 18.S997 High-Dimensional Statistics](https://ocw.mit.edu/courses/18-s997-high-dimensional-statistics-spring-2015/) | Concentration, high-dimensional regression/misspecification, covariance estimation, PCA, and minimax boundaries. | MIT OCW CC BY-NC-SA 4.0 baseline; link-only deepening unless a specific asset is cleared. |
| S07 | [MIT 18.465 Nonparametrics and Robustness](https://ocw.mit.edu/courses/18-465-topics-in-statistics-nonparametrics-and-robustness-spring-2005/pages/syllabus/) | Robustness, outliers, rank/order methods, and the need to name a perturbation class. | Link/cite only; create original mean/median and sensitivity fixtures. |
| S08 | [NIST/SEMATECH e-Handbook](https://itl.nist.gov/div898/handbook/index2.htm), [design overview](https://itl.nist.gov/div898/handbook/pri/section1/pri11.htm), [tests/intervals](https://itl.nist.gov/div898/handbook/prc/section1/prc1.htm), and [power](https://itl.nist.gov/div898/handbook/eda/section3/eda35.htm) | Practical experimental design, uncertainty, power, diagnostic, and data-quality language. | Attribute NIST and inspect individual asset notices; Atlas uses original prose/diagrams. |
| S09 | [OpenIntro Introduction to Modern Statistics](https://www.openintro.org/book/ims/) and [license](https://www.openintro.org/license/) | Reader-friendly simulation, randomization, bootstrap, regression, and study-design route. | Most materials are CC BY-SA 3.0 but exceptions apply; default to links/original material and no OpenIntro branding. |
| S10 | [SciPy `bootstrap`](https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.bootstrap.html), [`permutation_test`](https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.permutation_test.html), and [`monte_carlo_test`](https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.monte_carlo_test.html) | Versioned API contracts for named resampling methods only. | SciPy’s BSD licensing does not turn an API result into a theorem, valid design, or causal conclusion. Pin a version before code reuse. |
| S11 | [Efron (1979)](https://projecteuclid.org/journals/annals-of-statistics/volume-7/issue-1/Bootstrap-Methods-Another-Look-at-the-Jackknife/10.1214/aos/1176344552.full), [Benjamini–Hochberg (1995)](https://doi.org/10.1111/j.2517-6161.1995.tb02031.x), [Rubin (1976)](https://doi.org/10.1093/biomet/63.3.581), [White (1982)](https://doi.org/10.2307/1912526), [Huber (1964)](https://doi.org/10.1214/aoms/1177703732), [Tibshirani (1996)](https://doi.org/10.1111/j.2517-6161.1996.tb02080.x) | Original anchors for bootstrap, FDR, missingness, misspecified likelihood, robustness, and regularized estimation. | Publisher-controlled / link-only. Cite only the result actually used and preserve its assumptions. |
| S12 | MIT [6.7220 Lecture 15](https://ocw.mit.edu/courses/6-7220j-nonlinear-optimization-spring-2025/mit6_7220_s25_lec15.pdf) | Conditional unbiased-estimator and mini-batch distinction at the M30 → M31 bridge. | Accessed 2026-08-03. MIT OCW link/cite only; M30 uses an original two-line bridge and does not reproduce the lecture or claim SGD convergence. |

## Six-session source routing

| Session | First-principles question | Core sources | Original Atlas evidence move |
| --- | --- | --- |
| 1. Probability models and conditional structure | What is a probability claim about, and how do joint/marginal/conditional laws alter a claim? | S01–S03 | Build a probability-model card; trace a joint table and repair a base-rate error. |
| 2. Expectation, variation, and information | How does a law turn into expectation, covariance, conditional expectation, and a transformed quantity? | S01–S02, M28/M29 | Separate an estimator from a population quantity; audit units, denominator, and a conditional claim. |
| 3. Repetition, convergence, and simulation | When does repetition earn a quantitative uncertainty statement? | S01–S02, S06, S10 | Compare a finite fixture, LLN/CLT language, and a named concentration bound; record seed and assumptions. |
| 4. Models, likelihood, and estimation | How do data, parameter, likelihood, MLE/MAP/posterior, bias, and identifiability differ? | S04–S05 | Annotate a Bernoulli/Beta and logistic-code trace; make a model-criticism counterexample. |
| 5. Intervals, tests, and resampling | What does an interval, p-value, power calculation, FDR procedure, bootstrap, or permutation test actually guarantee? | S03, S05, S08–S11 | Write an inference contract and diagnose an invalid interpretation. |
| 6. Design, criticism, and responsible decision | Can a model survive missingness, selection, outliers, high dimension, and a decision boundary? | S04–S08, S11 | Produce the evidence dossier and a sensitivity/authority boundary. |

## Read in layers

1. **Core:** M30 workbook and studio; complete prediction gates, code traces,
   compact diagnostic, dossier, and oral defense.
2. **Proof-aware depth:** MIT 18.600/6.436J for a formal probability or
   convergence claim used in the workbook.
3. **Inference depth:** MIT 18.650 and Penn State STAT 415 for likelihood,
   estimator, interval, test, and regression structure.
4. **Scientific-practice depth:** NIST and OpenIntro for design, resampling,
   diagnostic practice, and reader-friendly contrasts.
5. **Advanced boundaries:** high-dimensional, robustness, and original-paper
   sources only after the core card and counterexample are clear.

## Claim ladder for every computation

| Evidence kind | Can establish | Cannot establish alone |
| --- | --- | --- |
| Definition or theorem | A result for named objects and hypotheses. | That code/data/reality meet those hypotheses. |
| Statistical procedure | A stated long-run/error property under its sampling/model regime. | A posterior fact, cause, practical benefit, or decision authority. |
| API contract | Documented behavior of a named package/version. | Valid sampling, exchangeability, calibration, or inference theorem. |
| Finite experiment or simulation | A reproducible result for the recorded fixture/run. | A universal or population conclusion. |
| AI proposal | A candidate derivation, patch, test, or visualization. | Authority, correct assumptions, provenance, or a finished review. |

## Forward handoff

- **M31:** likelihood/MAP become objectives; M30 keeps the target, data model,
  and uncertainty boundary visible. Under a named conditional sampling rule, a
  mini-batch average can estimate a fixed empirical gradient; M31 owns
  optimization, convergence, and information-theory claims.
- **M32:** fixed fixtures, seed/version records, shape/axis conventions, and
  resampling cost become scientific-Python implementation evidence.
- **M34:** conditional independence, Markov language, and uncertainty models
  become prerequisites for graphical models and decision systems.
- **M35/M36:** data splits, calibration, uncertainty, concentration, model
  criticism, and high-dimensional assumptions become the guardrails for ML and
  learning-theory claims.

## Download and provenance reminder

The workbook links here and to the full addendum. External material is linked
for study, not copied into Atlas. If a future release adapts any external asset,
record its exact source, version, license, attribution, changes, and
distribution decision first.
