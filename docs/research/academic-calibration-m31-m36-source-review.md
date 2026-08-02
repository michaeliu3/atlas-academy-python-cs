# Academic calibration — M31–M36 authoring-only source review

## Scope and truth boundary

This concise review compares the six private candidate workbooks in
[`content/authoring`](../../content/authoring/) with the corresponding source
research, contracts, and prerequisite bridge. Official course pages below were
checked on **2026-08-01** for scope, prerequisites, proof/derivation habits,
and the kind of learner evidence expected—not for material to copy.

**All six packs remain authoring-only and hidden in the active course graph.**
This note makes no publication, review, routing, contract, learner-readiness,
or mastery decision. It is not evidence of enrollment, faculty feedback,
grading, credit, a degree, or equivalence to any university course.

## Official calibration anchors

| Official material | Calibration use |
| --- | --- |
| MIT OCW [6.251J Introduction to Mathematical Programming](https://ocw.mit.edu/courses/6-251j-introduction-to-mathematical-programming-fall-2009/) and Stanford [EE364a Convex Optimization I](https://web.stanford.edu/class/ee364a/) | M31’s formulation → geometry/conditions → duality/certificates → algorithm/evidence progression. |
| CMU [15-418/15-618 Parallel Computer Architecture and Programming](https://www.cs.cmu.edu/~418/) | M32’s machine-model, data movement, parallelism, measurement, and systems-design reasoning. |
| MIT OCW [6.045J Automata, Computability, and Complexity](https://ocw.mit.edu/courses/6-045j-automata-computability-and-complexity-spring-2011/), Stanford [CS103](https://web.stanford.edu/class/archive/cs/cs103/cs103.1264/), and Georgia Tech [CS 4510 Formal Languages and Automata](https://faculty.cc.gatech.edu/~ladha/S26/4510/) | M33’s automata, decidability, reductions, proof discipline, and complexity sequence. |
| Stanford [CS221 AI](https://web.stanford.edu/class/archive/cs/cs221/cs221.1192/) and UC Berkeley [CS 188](https://inst.eecs.berkeley.edu/~cs188/) | M34’s state-space search, heuristics, CSPs, MDPs, decision-making, and AI-system modeling. |
| MIT OCW [6.036 Introduction to Machine Learning](https://ocw.mit.edu/courses/6-036-introduction-to-machine-learning-fall-2020/), CMU [10-301/601](https://www.cs.cmu.edu/~mgormley/courses/10601/), Stanford [CS229 materials](https://cs229.stanford.edu/materials.html-full), and Georgia Tech [CS 7641](https://omscs.gatech.edu/cs-7641-machine-learning) | M35’s formulation, representation, learning objectives, validation, regularization, model selection, and defensible analysis. |
| MIT OCW [6.7960 Deep Learning](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/) and MIT OCW [9.520 Statistical Learning Theory & Applications](https://ocw.mit.edu/courses/9-520-statistical-learning-theory-and-applications-spring-2006/) | M36’s generalization, capacity, theorem scope, deep-learning reliability, and reproducibility boundaries. |

## Material-level result

| Pack | What the candidate workbook demonstrably covers | Alignment and deliberate boundary |
| --- | --- | --- |
| **M31 — Optimization & Information** | Six connected sessions go from objective/constraint formulation through convexity, stationarity/KKT and dual certificates, stopping evidence, stochastic assumptions/counterexamples, and information/ELBO identities. It requires prediction, model/code reading, a numerical experiment, a dossier, diagnostic, and constructive oral defense. | The formulation/duality/evidence spine is well aligned in kind with MIT/Stanford optimization teaching, and M28/M30 prerequisites are actively reused. It intentionally does **not** stand in for full convex-analysis proofs, broad solver implementation, or the term-scale problem volume of those courses. The information segment is a disciplined bridge, not a full information-theory course. |
| **M32 — Systems Languages, Scientific Python & Accelerators** | Sessions trace API/ownership boundaries, dispatch versus completion, layout/views/temporaries/dtype, buffer reuse, autodiff, a versioned NumPy documentation bridge, and an optional PyTorch CUDA reading lens, then assemble a bounded reproducibility defense. Each asks for a trace, counterexample, code/design inspection, or evidence card rather than a performance slogan. | The architecture-first and measurement-first reasoning matches the CMU parallel-systems standard especially well. The optional lens is explanatory, not a real NumPy/CUDA/HIP/JAX/PyTorch lab; the module cannot claim hardware behavior, portability, speedup, or a systems-programming implementation experience. |
| **M33 — Formal Languages, Computability & Complexity** | Sessions distinguish syntax from semantics, give a constructive CFG witness for \(\{0^n1^n\}\), use NFA-to-DFA construction and distinguishability, separate grammar from semantic limits, make reductions directional, and distinguish verifier/search and formal family from one run. The packet and oral protocol require a narrow formal claim and a nonclaim. | This preserves the proof/counterexample/reduction habits expected by MIT, Stanford, and Georgia Tech theory routes, without compressing the material into definitions alone. It intentionally omits the full quantity of theorem proofs, problem sets, machine constructions, and graded proof feedback in a semester theory course. Future release review should still check every displayed proof skeleton for formal correctness. |
| **M34 — Classical AI: Search, Constraints & Decision** | The sequence moves state-model choice → search conditions/heuristic counterexample → CSP/relaxation → planning/encoding limit → MDP versus one-shot utility → a defended design dossier. It uses exact small traces, changed-premise tasks, and a human-impact/authority stopping line. | It is strongly aligned with Stanford CS221 and Berkeley CS188’s modeling/search/CSP/MDP order, while being more explicit about evidence and human authority. It deliberately does not replace their multi-project agent implementations, probabilistic-model breadth, game/RL units, or staff evaluation. |
| **M35 — Machine Learning & Representation** | The workbook begins with representation loss/inductive bias, then baseline choice and a compact model-family boundary map, leakage/splits/metrics/calibration/shift, likelihood/autodiff/regularization/reproducibility, debugging/observability, and a responsible dossier. It includes a one-line limitation proof, fixed numerical traces, a diagnostic, and oral-defense handoff. | The prerequisite-aware progression is comparable in intellectual shape to MIT/CMU/Stanford/Georgia Tech ML foundations: formulate before fitting, compare baselines, protect evaluation, then reason about objective and operations. It intentionally does not provide full hands-on breadth across model families, real data projects, experimental iteration, or peer/staff critique; the synthetic dossier must never be described as a deployed-model evaluation. |
| **M36 — Statistical Learning Theory & Reliable Deep-Learning Systems** | Sessions make the population/risk assumptions explicit; separate optimization, estimation, and generalization gaps; derive a finite-class/union-bound proof skeleton and numerical theorem card; record numerical/reproducibility scope; then reason about shift, monitoring, calibration, and bounded human control. The final dossier requires an assumption repair, counterexample, theorem/observation distinction, and next measurement. | This is a sound selected low-graduate bridge to MIT’s generalization/theory material and the formal-guarantee portions of CMU/Stanford ML. It explicitly refuses to treat a finite-class theorem as a deep-network or deployment guarantee. It intentionally omits measure-theoretic learning theory, broader capacity frameworks, full deep-learning architecture training, and empirical benchmark replication. |

## Connected-system finding

```text
M31: formulate an objective and state what a certificate can prove
  -> M32: state what execution and measurement evidence can prove
  -> M33: state what a formal model, reduction, or resource class can prove
  -> M34: state what a search/constraint/decision model authorizes
  -> M35: state what data, representation, objective, and evaluation support
  -> M36: state what a learning theorem, system observation, monitor, and human owner support
```

The packs consistently preserve the same epistemic discipline: a low loss, a
trace, a proof name, a passing fixture, or an AI-generated explanation is not
by itself a stronger claim. This is a genuine connected adaptation of the
official-course standards toward code reading, debugging, design review, and
AI-era reasoning.

## Lean authoring priorities before any release decision

1. **Keep the current M32 boundary honest.** Either retain an inspectable
   simulated fixture or choose one deliberately bounded, version-pinned local
   experiment with an accessible non-accelerator fallback; do not create a
   broad device matrix or promise performance.
2. **Proof-check M31/M33/M36 as one focused expert pass.** Verify displayed
   conditions, directions, quantifiers, and counterexamples against their
   cited sources before a release review. This is quality control, not a new
   metadata layer.
3. **Preserve the dossiers and oral defenses as evidence, not substitutes for
   institutional assessment.** They are the right accelerated-course
   adaptation; real-data, large implementation, peer, and faculty-feedback
   differences remain deliberate limitations.

## Reuse and conclusion

Use the linked official pages as link-and-paraphrase calibration anchors only.
Keep Atlas explanations, diagrams, traces, code, diagnostics, and projects
original. Do not copy slides, lecture notes, assignments, solutions, figures,
datasets, autograders, or course workflows without an asset-specific rights
decision. MIT OCW material carries its displayed license terms; treat the
remaining institutional material as link-only unless a particular asset grants
reuse permission.

The six candidate packs are academically coherent, rigorously scoped, and
appropriately connected to their cited prerequisites. Their remaining gaps are
the honest differences from a semester-based university experience and the
authoring/release work still required—not evidence that any pack is ready to
publish.
