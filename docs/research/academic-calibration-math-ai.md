# Academic calibration — mathematics and AI arcs (M27–M36)

**Purpose.** This is a compact, topic-level calibration of the Atlas
mathematics and AI arc against official university course pages, consulted on
2026-08-01. It is an authoring guide, not a claim of enrollment, credit,
contact hours, grading, a degree, or equivalence to any course below.

M27–M30 are learner-visible workbooks. M31–M36 each have a candidate
authoring workbook, but remain hidden/authoring-only in the canonical graph;
their rows therefore name a private guided-use and review boundary rather than
a released learner route.

## How to read the map

- **Alignment** means that the Atlas outline substantially overlaps a named
  course's published topic scope; it does not mean all proofs, assignments, or
  depth are replicated.
- **AI-era adaptation** preserves the mathematics while shifting practice
  toward reading generated code/results, checking assumptions, debugging
  traces, comparing evidence, and explaining a decision orally.
- **Gap** names the smallest real curriculum addition needed. It is not a
  reason to add another portal, contract, or release subsystem.

## Module map

| Atlas module | Official course anchors | Alignment and AI-era adaptation | Genuine gap / next content move |
| --- | --- | --- | --- |
| **M27 — Discrete Mathematics, Proof, Counting & Structures** | MIT [6.042J Mathematics for Computer Science](https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/pages/syllabus/) | Definitions, proof, induction, relations, graphs, counting, recurrences, asymptotics, and number theory align with the published discrete-mathematics spine. Atlas adds code-reading countermodels, proof repair, and a conversational defense of assumptions. | Keep the module's proof dossier small but require one fully written proof and one counterexample; do not imply that finite tests establish a universal statement. |
| **M28 — Linear Algebra, Numerical Stability & Representation** | MIT [18.06 Linear Algebra](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/) and [18.335J Introduction to Numerical Methods](https://ocw.mit.edu/courses/18-335j-introduction-to-numerical-methods-spring-2019/pages/syllabus/) | Vector spaces, linear maps, eigenstructure, positive-definite matrices, SVD, conditioning, and stability connect to the two published scopes. Atlas uses array-pipeline review and numerical experiments to distinguish a mathematical object from its implementation. | Add one bounded QR/linear-solve versus normal-equations comparison with a condition/accuracy explanation; do not make hardware-speed claims. |
| **M29 — Calculus, Real Analysis & Continuous Change** | MIT [18.01SC Single Variable Calculus](https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/pages/syllabus/) and [18.100B Real Analysis](https://ocw.mit.edu/courses/18-100b-real-analysis-spring-2025/) | Limits, continuity, differentiation, integration, sequences/series, convergence, and proof-sensitive analysis map to the published calculus and analysis progression. Atlas connects Taylor/finite-difference/autodiff reading to explicit hypotheses and remainder/error boundaries. | Preserve a clear boundary between intuition and proof: add a short epsilon-style or quantified convergence proof before using uniform-convergence/interchange claims. |
| **M30 — Probability, Statistics & Scientific Inference** | MIT [18.600 Probability and Random Variables](https://ocw.mit.edu/courses/18-600-probability-and-random-variables-fall-2019/pages/syllabus/) | Probability models, conditional probability, distributions, expectation, joint laws, LLN, and CLT align directly. Atlas extends into inference, resampling, uncertainty, and scientific claim review by asking what population, split, and decision are actually named. | A 60-day core cannot be a full mathematical-statistics sequence. Retain explicit sampling-model assumptions for likelihood, intervals, tests, and resampling; add one end-to-end synthetic inference audit. |
| **M31 — Optimization & Information** | Stanford [EE364a Convex Optimization I](https://web.stanford.edu/class/ee364a/) and MIT [6.441 Information Theory](https://ocw.mit.edu/courses/6-441-information-theory-spring-2010/) | Formulation, feasibility, optimality conditions, duality scope, numerical stopping evidence, entropy, and information trade-offs are appropriate anchors. The candidate workbook adapts them into model/solver-output reading rather than solver worship or large-framework coding. | The candidate workbook needs private guided use and source/reuse/learner-facing review; keep its conditions-first duality/KKT card and finite information derivation bounded rather than claiming a general solver guarantee. |
| **M32 — Systems Languages, Scientific Python & Accelerators** | Stanford [CS149 Parallel Computing](https://cs149.stanford.edu/) and MIT [12.010 Computational Methods of Scientific Programming](https://ocw.mit.edu/courses/12-010-computational-methods-of-scientific-programming-fall-2024/) | Parallel hardware/software trade-offs, accelerators, Python/scientific computing, code design, verification, and reproducibility give an appropriate benchmark. The candidate workbook narrows this to ownership, transfers, dtype/layout, numerical behavior, and evidence-aware performance reading. | Private guided use must choose a bounded CPU-first fixture and accessible fallback. Do not claim a GPU speedup, overlap, portability, or race freedom from one run; reader release remains a separate review decision. |
| **M33 — Formal Languages, Computability & Complexity** | MIT [6.045J Automata, Computability, and Complexity](https://ocw.mit.edu/courses/6-045j-automata-computability-and-complexity-spring-2011/pages/syllabus/) | Formal languages, finite automata, Turing machines, decidability, reductions, complexity, and their proof forms align with the official syllabus. The candidate workbook makes an AI-generated proof or reduction an object of inspection, keeping finite traces separate from theorem evidence. | Review the existing theorem cards with their quantifiers and counterexamples visible. Do not treat timeouts, benchmarks, or a recognizer demo as evidence of undecidability or a complexity classification. |
| **M34 — Classical AI: Search, Constraints & Decision** | UC Berkeley [CS 188 Introduction to Artificial Intelligence](https://inst.eecs.berkeley.edu/~cs188/) and MIT [6.034 Artificial Intelligence](https://ocw.mit.edu/courses/6-034-artificial-intelligence-fall-2010/) | State-space formulation, search, heuristics, constraints, knowledge/problem solving, and decision reasoning align with the official courses. The candidate workbook adds explicit omissions, solver-status critique, uncertainty/utility boundaries, and human authority checks. | Exercise its synthetic search/CSP/decision dossier in a guided session with a verified small oracle. State completeness/optimality conditions and keep real-world authority outside the model before any reader release. |
| **M35 — Machine Learning & Representation** | Stanford [CS229 Machine Learning](https://cs229.stanford.edu/), MIT [6.036 Introduction to Machine Learning](https://ocw.mit.edu/courses/6-036-introduction-to-machine-learning-fall-2020/), and Georgia Tech [CS 7641 Machine Learning](https://omscs.gatech.edu/cs-7641-machine-learning) | Representation, learning-problem formulation, overfitting/generalization, supervised/unsupervised learning, neural networks, and learning-system reasoning match the published descriptions. Georgia Tech's current outline also makes Python, linear algebra, probability, calculus, defensible analyses, and linked supervised/unsupervised/sequential-decision artifacts explicit. The candidate workbook prioritizes baseline comparison, data/split inspection, training traces, and failed-useful evaluation evidence. | Run its synthetic workflow in private guided use: require a baseline, leakage check, target-population statement, and uncertainty/shift limitation before interpreting a model comparison. |
| **M36 — Statistical Learning Theory & Reliable Deep-Learning Systems** | MIT [9.520 Statistical Learning Theory and Applications](https://ocw.mit.edu/courses/9-520-statistical-learning-theory-and-applications-spring-2006/) and [6.7960 Deep Learning](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/) | Generalization, regularization, stability/VC-style bounds, neural networks, autodiff, and deep-learning theory/application form the benchmark. The candidate workbook adds reproducibility, shift, monitoring, and human-control boundaries so a theorem or metric is not mistaken for deployment approval. | Review its finite theorem pack and synthetic reproduction record in a guided session. Do not claim a universal deep-learning reliability guarantee; reader release remains separate from authoring availability. |

## Cross-arc decisions

1. **Use and review the existing candidate workbooks before adding infrastructure.** M31–M36 already have six-session authoring workbooks with diagnostics and guided-learning handoffs. The remaining boundary is private guided use, source/reuse and learner-facing review, and an explicit later reader-release decision—not absent course content.
2. **Keep proof and measurement boundaries explicit.** M27/M29/M33/M36 need stated assumptions and a counterexample; M28/M30/M31/M32/M35 need a defined numerical or empirical claim and a named non-claim.
3. **Use AI as a review object.** The distinctive Atlas move is not “use an AI answer as an authority”; it is to predict, inspect, find missing assumptions, test a small counterexample, and explain the repair to the TA or Study Partner.
4. **Treat the 60-day route as a rigorous first pass.** These anchors justify depth and sequencing, not a claim of university-course equivalence or durable mastery after sixty days.

## Source policy

Every link above is an official MIT OpenCourseWare, Stanford, or UC Berkeley
course page. They are used as link-only curriculum anchors. Future learner
materials should retain their own source/reuse review and use original Atlas
prose, examples, figures, code, and assessments unless a specific asset license
has been reviewed.
