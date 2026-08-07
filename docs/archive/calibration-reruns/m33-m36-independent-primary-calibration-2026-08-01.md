# Independent M33–M36 primary-source calibration — 2026-08-01

## Scope and truth boundary

This is a read-only calibration of the four current authoring-only workbooks,
not publication, learner-route, accessibility, chat-delivery, Notion, or
mastery evidence. It sampled the actual definitions, derivations,
counterexamples, numerical cards, and source boundaries in M33–M36. Every
source below was accessed on **2026-08-01**. Atlas should keep original prose,
examples, diagrams, fixtures, and prompts; these links are calibration and
learner-reading routes, not permission to copy notes, assignments, figures,
solutions, code, or assessments.

## Official calibration corpus

| Area | Official / primary route | What it calibrates |
| --- | --- | --- |
| M33 formal languages, computability, complexity | [MIT 6.045J](https://ocw.mit.edu/courses/6-045j-automata-computability-and-complexity-spring-2011/), [Stanford CS103 (Spring 2026)](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/), [Georgia Tech CS4510](https://faculty.cc.gatech.edu/~ladha/S26/4510/) | Proof-first formal objects; automata, computability, reductions, P/NP, and the distinct CFG/PDA bridge. |
| M34 classical AI | [Berkeley CS188 search](https://inst.eecs.berkeley.edu/~cs188/textbook/search/informed.html), [CSPs](https://inst.eecs.berkeley.edu/~cs188/textbook/csp/), and [MDPs](https://inst.eecs.berkeley.edu/~cs188/textbook/mdp/markov-decision-processes.html); [MIT 6.034](https://ocw.mit.edu/courses/6-034-artificial-intelligence-fall-2010/) | State modelling, search guarantees, constraints, planning, sequential decision, and representation. |
| M35 ML foundations | [MIT 6.036](https://ocw.mit.edu/courses/6-036-introduction-to-machine-learning-fall-2020/), [CMU 10-301/601](https://www.cs.cmu.edu/~mgormley/courses/10601/), and [Stanford CS229 materials](https://cs229.stanford.edu/materials.html-full) | Formulation, representation, inductive bias, model selection, supervised/unsupervised/RL breadth, learning theory, and experimental design. |
| M36 learning theory and reliable DL | [MIT 9.520](https://ocw.mit.edu/courses/9-520-statistical-learning-theory-and-applications-spring-2006/) and its [VC-dimension notes](https://ocw.mit.edu/courses/9-520-statistical-learning-theory-and-applications-spring-2006/resources/class17/), [MIT 6.7960](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/), and [CMU 10-301/601](https://www.cs.cmu.edu/~mgormley/courses/10601/) | Generalization, VC/stability/regularization, deep-learning theory, reproducibility, and the gap between theorem conditions and systems evidence. |
| Reliability implementation boundary | [scikit-learn calibration](https://scikit-learn.org/stable/modules/calibration.html), [PyTorch reproducibility (2.9)](https://docs.pytorch.org/docs/2.9/notes/randomness.html), and [NIST AI RMF 1.0](https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-ai-rmf-10) | Independent calibration data, bounded reproducibility claims, and voluntary risk-management vocabulary—not deployment approval. |

## Findings

| Module | Assessment | Evidence checked in the candidate workbook | High-value action |
| --- | --- | --- | --- |
| **M33** | **Aligned, deliberately compact.** Its path—formal objects and syntax → finite-state evidence → computability/semantic limits → directed reductions → scoped complexity—matches the MIT/Stanford/Georgia Tech spine. The sampled CFG witness, DFA/NFA distinction, total-map reduction construction, and `P` versus `NP` non-claim are mathematically well scoped. | The workbook distinguishes recognizer from decider, makes malformed encodings explicit in the diagonal/reduction exercises, and never turns an observed run into a theorem. | Retain the existing boundary: one CFG construction is **not** PDA/CFG equivalence, pumping-lemma, closure, circuit, or hierarchy competence. These are sensible optional depth, not a six-session-core defect. Keep the learner-facing route on the current Spring 2026 CS103 archive. |
| **M34** | **Aligned, deliberately bounded.** Berkeley confirms the state/action/transition/reward/horizon formulation and distinguishes search, CSP, and MDP material. The no-reopen A* example is correct for its named tie/goal/duplicate policy; the local-consistency and one-shot-versus-sequential-decision boundaries are valuable understanding-first choices. | The lesson names nonnegative-cost, heuristic, goal-test, and reopen conditions instead of treating “A*” as a guarantee; it separates a solver/model status from a world conclusion and a posterior from authority. | Do not add games, Bayesian networks, RL algorithms, or full solver implementation merely to resemble a term-long AI survey. Preserve the precise stated search variant whenever the counterexample is rendered or discussed orally. |
| **M35** | **Aligned as an evidence-first ML foundation; adapted rather than equivalent to an introductory ML course.** MIT/CMU/Stanford support the representation → objective → evaluation/generalization sequence. The calibration, held-out preprocessing, selection-reuse, and reproducibility cautions are especially appropriate for AI-era code review. | The population-calibration relation is correctly separated from a finite Brier comparison; the workbook correctly requires a target relation before a splitter and treats model selection as part of the evidence procedure. | Keep the existing model-family breadth map and explicit non-equivalence boundary. It is not a substitute for CMU/MIT-scale training and analysis of classification, regression, clustering, RL, and real-data experimental reports. That breadth belongs to optional depth or later projects, not a rushed core rewrite. |
| **M36** | **Aligned as a theorem-scope and reliability module; intentionally narrower than a full statistical-learning or deep-learning course.** MIT 9.520 confirms the role of VC/function-class complexity; MIT 6.7960 and CMU confirm that modern DL spans far more architecture, theory, and project work than one module can claim. | The finite-class bounded-IID Hoeffding-plus-union-bound derivation, numerical ceiling, realizable-PAC quantifier card, dependent-sample counterexample, and population-calibration formulation are correct within their displayed assumptions. The monitoring table correctly distinguishes input-time from delayed-label evidence. | Preserve the explicit **finite-class / bounded loss / IID** label beside every theorem card. It must not be rendered as a VC proof, a bound for an arbitrary neural network, a reproducibility guarantee, or a reliability/deployment certificate. Pin a concrete framework/version/device only when a future release makes an implementation claim; current PyTorch explicitly does not guarantee reproducibility across releases or platforms. |

## Cross-module conclusion and genuine remaining gap

No sampled mathematical or factual lesson claim requires a content correction.
The four workbooks form a coherent M33 → M34 → M35 → M36 chain and already
make their strongest needed distinctions visible: formal proof versus trace,
model versus world, score versus calibration, and theorem versus system
reliability.

The material is nevertheless **authoring-only**. Official courses provide
multi-week feedback, broader algorithmic practice, and assessment context that
a source link cannot recreate. The remaining high-value evidence is therefore
not more source metadata or a broader syllabus: run a designated accessible
Study Partner/TA learner pilot, use the stated constructive oral-defense flow,
and record only learner-approved concise evidence. Until that happens, do not
claim learner readiness, university equivalence, or an M25/M26 unlock.
