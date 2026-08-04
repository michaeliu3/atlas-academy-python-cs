# M6–M11 official calibration follow-up — 2026-08-03

**Scope.** This is a narrow, source-linked check of two proposed teaching
improvements. It changes no learner route, release state, source contract, or
mastery claim. The sources below were accessed on **2026-08-03**. They
calibrate rigor and learning-evidence habits; they do not make Atlas a
university course or authorize reuse of external course assets.

## Official primary sources checked

| Source | What it establishes for this decision |
| --- | --- |
| MIT [6.006 resource index](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/pages/resource-index/) | One connected undergraduate sequence places data structures, sorting, hashing, trees/heaps, graph search, weighted paths, and dynamic programming in a shared learning spine with lectures, recitations, and problem practice. It does not prescribe an Atlas artifact. |
| CMU [15-122 course information and syllabus](https://www.cs.cmu.edu/~15122/syllabus.shtml) | Correct-by-design work should account for application context and connect abstraction, correctness, complexity, modularity, data structures, and algorithms. It calibrates a cross-component reading exercise; it does not mandate a particular dossier. |
| MIT [6.046J syllabus](https://ocw.mit.edu/courses/6-046j-design-and-analysis-of-algorithms-spring-2015/pages/syllabus/) and [Lecture 6: Randomization](https://ocw.mit.edu/courses/6-046j-design-and-analysis-of-algorithms-spring-2015/resources/lecture-6-randomization-matrix-multiply-quicksort/) | Rigorous algorithm work includes invariant/inductive correctness arguments, design-paradigm selection, graph modeling, and randomized-algorithm analysis that distinguishes algorithmic randomness from probabilistic inputs. It supplies a rigor benchmark, not a reservoir-sampling implementation. |
| Python [3.14 `random` documentation](https://docs.python.org/3.14/library/random.html) | `Random` is a deterministic pseudorandom generator; `randrange` selects from a declared range and its implementation aims at equal distribution; a reused seed supports a reproducible sequence under the documented scope. The API documentation does **not** prove the mathematical independence/conditional-uniform model used in an algorithm proof. |

## Calibration decisions

| Proposed improvement | Claim and judgment | Minimal original revision |
| --- | --- | --- |
| **Cumulative M6→M10 architecture-reading dossier** | **Real Atlas continuity gap; adaptation, not missing university-topic coverage.** The workbooks already cover the individual structures and M11 draws their dependency map, but no learner artifact currently makes one path through M6 history representation → M7 bounded ingestion → M8 indexing → M9 priority/order → M10 prerequisite graph explicit and reviewable. MIT 6.006 supports treating these topics as a connected spine; CMU 15-122 supports evaluating their joint correctness/context/cost consequences. Neither source demands the exact Atlas format. | In `content/modules/11_algorithm_design_paradigms.md`, add a compact 20–30 minute original dossier immediately after **§16 “Read the planner in dependency order”**. It should require one handoff table with: public contract, representation invariant, named resource/cost model, one failure boundary, and a changed-premise consequence for each of the five links. Reuse existing snippets/artifacts; do not add a new registry, implementation project, or high-volume exercise set. |
| **Reservoir-sampling probability assumptions** | **Real but small rigor gap.** M11 §12 correctly gives an inductive conclusion, but it names its “mathematical uniform-choice model” only after using the survival probability. MIT 6.046J’s randomized-analysis standard supports making the probabilistic model separate from the program. Python’s docs support the API/reproducibility boundary but cannot be used as proof that a particular run establishes uniformity or independence. | In `content/modules/11_algorithm_design_paradigms.md` **§12, immediately before “[MATHEMATICAL CLAIM]”**, define a finite prefix and an ideal draw model. For example, if \(\mathcal H_{k-1}\) is prior history, state \(\Pr(U_k=j\mid\mathcal H_{k-1})=1/k\) for each \(j\in\{0,\ldots,k-1\}\); fresh independent uniform draws are one sufficient implementation model. Then label the induction as conditional on that assumption, while retaining the existing note that a deterministic seed is only debugging/reproducibility evidence. |

## Adaptation and reuse boundary

Both recommendations keep Atlas's examples, diagrams, code, diagnostics, and
learner artifacts original. The institutional sources are used only to
calibrate topic linkage and proof discipline; Python documentation is used only
for its public API boundary. Link or briefly paraphrase with attribution; do
not copy lectures, slides, exercises, problem sets, solutions, transcripts, or
course-specific assessment workflows. MIT OCW's terms and individual asset
licenses must be checked before any reuse beyond this link/cite-only boundary.

## Structural clarity continuation

On 2026-08-03, the same MIT 6.006 and CMU 15-122 sources were rechecked for a
small M8/M9 presentation repair. The workbooks already teach lookup → index →
collision/equality and ordered question → invariant → representation; named
first-principles derivations now make those existing reasoning paths easier to
find and rehearse. This is an aligned clarity adaptation, not new scope,
assessment, release evidence, or institutional-equivalence claim.
