# M31–M32 official calibration audit — 2026-08-01

**Scope.** This is a small, learner-impact audit of the current M31 and M32
authoring workbooks, their source/delivery/evidence records, the canonical
graph, and the private guided route. It checks a focused set of official
university and platform sources accessed on **2026-08-01**. It does not change
the graph, source-map selection, contract state, route, release state, or
availability. Atlas must link to and independently paraphrase these materials;
it must not copy course assets, documentation prose, figures, examples,
assignments, or solutions.

## Current truth boundary

Both modules are substantial six-session **authoring-only** private drafts.
The graph keeps M31 and M32 hidden, with no selected canonical source map or
studio and unrecorded release evidence. The private guided route permits an
instructor-led chat to use the drafts, but that is not a reviewed pack, route
credit, a completed learner session, a release, or university-equivalent
instruction.

## Calibration corpus

| Source | What it calibrates | Relevant comparison |
| --- | --- | --- |
| [Stanford EE364a: Convex Optimization I](https://web.stanford.edu/class/ee364a/) | Convex sets/functions/problems, optimality conditions, duality, algorithms, and a prerequisite level that assumes linear algebra/probability. | M31 deliberately selects the connected foundation: formulation, curvature, KKT/duality conditions, finite algorithm evidence, and non-claim discipline. It does not pretend to reproduce EE364a's full breadth or assessment. |
| [MIT 6.441: Information Theory](https://ocw.mit.edu/courses/6-441-information-theory-spring-2010/) | Entropy/information definitions, coding and channel contexts, and graduate-level quantitative treatment. | M31's support/log-base/KL, binary mutual-information/rate-distortion, and ELBO boundaries are an appropriately narrow bridge into information reasoning rather than a substitute for a full information-theory course. |
| [Boyd & Vandenberghe, *Convex Optimization*](https://web.stanford.edu/~boyd/cvxbook/) | The theorem-facing reference for convexity, KKT, duality, and numerical methods. | The M31 claims remain properly conditional: the smooth-descent card names its segment/domain, the KKT example names convexity and strict feasibility, and finite solver status is never treated as a certificate. |
| [CMU 15-418/618 schedule](https://www.cs.cmu.edu/~418/schedule.html) | Locality/communication/contention, GPUs/CUDA, workload-driven evaluation, performance measurement, memory consistency, synchronization, and heterogeneous parallelism. | M32 follows the same causal chain at a smaller scale: public contract → representation → dispatch/ownership → numerics → measurement → bounded conclusion. It intentionally favors code-reading and architecture evidence over a large CUDA implementation. |
| [Python buffer protocol](https://docs.python.org/3/c-api/buffer.html) and [NumPy copies and views](https://numpy.org/doc/stable/user/basics.copies.html) | Producer/consumer requests, shape/strides/contiguity/lifetime, and the distinction between array metadata, views, and copies. | M32's Session 1 and 3 correctly require a named consumer contract and lifetime before a no-copy claim; its fixed NumPy observation is explicitly CPU-only and version-scoped. |
| [CUDA asynchronous execution](https://docs.nvidia.com/cuda/cuda-programming-guide/02-basics/asynchronous-execution.html) and [PyTorch reproducibility](https://docs.pytorch.org/docs/stable/notes/randomness.html) | Dispatch versus completion, stream/event boundaries, and the limits of seeds/deterministic settings across releases, platforms, and CPU/GPU paths. | M32 correctly treats submission timing as distinct from completed work and a seed as insufficient reproducibility evidence. It does not claim an unobserved GPU result or portability. |

## Findings by module

### M31 — Optimization & Information

**Verified strengths.** The current workbook is a coherent first-principles
adaptation of the calibration sources. Its sequence is especially strong for
the stated learning philosophy: formulate a proxy before selecting a solver;
separate local geometry from global/constrained claims; derive and limit a tiny
KKT certificate; distinguish theorem, API contract, and finite trace; then
connect stochastic estimates, information quantities, and a variational
objective to an evidence dossier. It includes original derivations,
counterexamples, code-reading/debugging, prediction before reveal,
confidence-aware repair, retrieval, transfer, and a supportive oral-defense
handoff.

**No learner-facing conceptual correction is currently indicated.** In
particular, the recent precision additions are present: the descent statement
names the segment/domain of smoothness, the KKT fixture states its strict
feasibility/convexity scope, rate-distortion is limited to its named binary
source/distortion regime, and the ELBO identity states its support/family
boundary. Adding interior-point methods, semidefinite programming, broad
coding theory, or optimizer surveys merely to mimic a university catalogue
would dilute this 60-day route rather than repair a gap.

**Remaining learner-impact gap.** The prompt and workbook have not yet been
validated through a real learner-owned designated-chat M31 session. A written
oral guide is not evidence that a learner can follow the displayed derivation,
read the code/table cards, or receive useful misconception repair.

**Minimal next edit/evidence.** Do not rewrite the lesson. During existing
review-ready work, run one voluntary M31 Session 1 or Session 3 pilot with the
Study Partner and then the TA; inspect only the learner-controlled summary for
equation/code readability, the hint ladder, and one forward handoff. Recheck
moving SciPy/CVXPY documentation only if a concrete library card is added or
changed; a source-link refresh alone is not a content rewrite.

### M32 — Systems Languages, Scientific Python & Accelerators

**Verified strengths.** M32 is well calibrated to systems/parallel-computing
standards without presenting vendor knowledge as understanding. It makes a
public API and ownership contract precede performance; separates submission,
completion, and result observation; makes shape/dtype/strides/aliasing part of
the algorithm; asks learners to reason about buffer last use; scopes autodiff
to a declared computation; and requires an environment, oracle, raw-observation
and non-claim record. The M32 NumPy 2.3.5 fixture now correctly distinguishes
the exact-but-potentially-expensive `shares_memory` check from the conservative
`may_share_memory` check. Its reproducibility prompts align with PyTorch's
explicit warning that identical seeds do not guarantee cross-release,
cross-platform, or CPU/GPU identity.

**Exact gap 1 — generic traces are not a concrete backend explanation.** The
generic request-to-observation and buffer-ownership timelines are pedagogically
right, but they cannot establish which API call waits, which stream is used, or
which object retains storage in JAX, PyTorch, CUDA, HIP, or another backend.
The workbook appropriately avoids claiming otherwise; the missing learner aid
is a single *chosen optional lens*, not a multi-framework survey or a required
GPU lab.

**Minimal edit.** In the existing Session 2/4 reading route, add one original
two-column mapping for either JAX *or* PyTorch (selected only when a reviewed
platform is available): abstract event/ownership field → the named documented
API concept. Keep the current generic timeline and CPU/text fallback. Link to
the official documentation rather than copying its code, and label the card as
backend/version scoped. Do not unlock M32 or claim a learner's machine has that
backend.

**Exact gap 2 — frozen observation and moving documentation need an explicit
learner bridge.** The only real observation is correctly pinned to NumPy 2.3.5,
while its learner reading links intentionally point to the moving stable NumPy
manual (currently v2.5). That is safe only when a learner can distinguish
"what this fixture observed" from "what current documentation describes."

**Minimal edit.** Add one short version row beside the Session 3 observation:
runtime/library version; matching versioned-documentation URL when available;
stable-doc access date; and the statement that a matching semantic oracle must
be rerun before extrapolating the result. This is a reproducibility clarification,
not a new benchmark or platform claim.

**Exact gap 3 — no reviewed real delivery evidence.** M32 has an excellent
CPU-only representation card, but no completed learner-chat readability review
and no selected, versioned platform-specific interaction. It must not be called
an accelerator lab until one exists. Any future hardware measurement needs the
workbook's existing full evidence card (environment, input/oracle, warm-up,
clock/readiness boundary, raw observations, alternatives, and non-claim), not
a synthetic performance number.

## Recommended order

1. Keep M31 content unchanged; review it through one real, learner-approved
   chat pilot using its existing evidence dossier and oral protocol.
2. Add the smallest M32 backend-specific reading lens only after choosing its
   optional supported platform; retain CPU-only and text alternatives.
3. Add the M32 version/documentation bridge, then review the frozen workbook,
   visual alternatives, diagnostics, and chat flow through the existing
   review-ready process.
4. Preserve the current authoring-only graph/route boundary until the existing
   human-review, delivery, provenance, and release evidence is genuinely
   available. None of these sources support a claim of enrolment equivalence,
   credit, certification, universal mastery, hardware availability, or a
   general performance result.

## Reuse and evidence boundary

This audit adds calibration evidence only. University courses calibrate topic
depth and pedagogy; CPython, NumPy, CUDA, and PyTorch documentation calibrate
the behavior of their own named interfaces. Neither type of source substitutes
for a versioned Atlas experiment, learner result, source-asset clearance, or
release record.
