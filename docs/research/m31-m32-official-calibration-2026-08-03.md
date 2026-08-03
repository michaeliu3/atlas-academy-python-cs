# M31–M32 official calibration — 2026-08-03

## Scope and truth boundary

This is a focused calibration of the current **authoring-only** M31 and M32
workbooks. Line anchors refer to the worktree read on 2026-08-03. It does not
approve a learner route, source-map binding, release, hardware access, learner
mastery, or university-equivalent instruction. Atlas remains link-only and
original-paraphrase material; do not copy course assets, documentation prose,
code, figures, assignments, or solutions without an asset-level reuse review.

## Official primary sources checked

All sources below were accessed **2026-08-03**.

| Source | Calibration use |
| --- | --- |
| [Stanford EE364a](https://web.stanford.edu/class/ee364a/), [Boyd & Vandenberghe, *Convex Optimization*](https://web.stanford.edu/~boyd/cvxbook/), and [CMU 10-725](https://stat.cmu.edu/~siva/teaching/725/) | Convexity, first-order/projected/stochastic methods, duality, KKT, and the distinction between a bounded six-session bridge and a full graduate optimization course. |
| [MIT 6.441 lecture notes](https://ocw.mit.edu/courses/6-441-information-theory-spring-2016/pages/lecture-notes/) | Entropy, divergence, mutual information, rate-distortion, and the depth intentionally outside M31. |
| [CMU 15-418/618 schedule](https://www.cs.cmu.edu/~418/schedule.html) and [MIT 12.010](https://ocw.mit.edu/courses/12-010-computational-methods-of-scientific-programming-fall-2024/) | Locality, GPU/CUDA, synchronization, workload-driven measurement, scientific-programming verification, and reproducibility. |
| [Python buffer protocol](https://docs.python.org/3.14/c-api/buffer.html) and [NumPy 2.3 `shares_memory`](https://numpy.org/doc/2.3/reference/generated/numpy.shares_memory.html) | Source-owned requirements for buffer release/contiguity and exact-versus-conservative alias checks. |
| [JAX asynchronous dispatch](https://docs.jax.dev/en/latest/async_dispatch.html) and [PyTorch CUDA semantics](https://docs.pytorch.org/docs/main/notes/cuda.html) | Named readiness, stream ordering, synchronization, and stream-aware storage lifetime. |

## Findings and minimal repairs

### 1. M31 KKT/Slater explanation — precision refinement

**Anchor:** M31 lines **448–451** and **503–510**.

The example is mathematically sound: it gives a differentiable convex objective,
an affine inequality, a strictly feasible point, and matching primal/dual
witnesses. It could nevertheless leave a careful learner with the wrong causal
story: in this convex differentiable case, the displayed KKT conditions are
sufficient for the stated global optimum; Slater's condition supplies the
regularity route to strong duality/dual attainment and KKT necessity. The
matching witnesses also establish the tiny result directly.

**Applied repair:** the paired authoring workbook and hidden candidate now say
explicitly that KKT is sufficient in this differentiable convex setting, while
Slater provides the strong-duality/dual-attainment and necessity route; the
matching primal/dual witnesses independently prove the tiny fixture. No
interior-point or full-duality survey was added.

### 2. M31 information-theory boundaries — no factual gap found

**Anchor:** M31 lines **996–1006** and **1031–1100**.

MIT 6.441 covers the broader entropy/MI/rate-distortion sequence. The workbook
correctly confines `R(D)=1-h_2(D)` to the uniform IID binary/Hamming/asymptotic
case, keeps it separate from the binary-channel calculation, and states the
support, model-family, and integrability boundaries of the ELBO identity.

**Decision:** preserve this focused bridge. Source/channel coding, converses,
and a full variational-inference algorithm survey are deliberate out-of-scope
depth, not a reason to enlarge the module.

### 3. M32 buffer and async claims — technically aligned; add one ownership lens

**Anchor:** M32 lines **278–341**, **476–510**, and **812–947**.

The buffer exercise correctly requires one `PyBuffer_Release` for each
successful acquisition and treats a strided view as distinct from a flat
C-contiguous array. The execution contrast also correctly separates JAX
readiness from PyTorch stream ordering. PyTorch's official CUDA semantics adds
one especially valuable concrete lifetime lesson: a side-stream consumer may
need both an explicit dependency (for example, a stream wait) and a
stream-aware storage-lifetime record.

**Applied repair:** the paired authoring workbook and hidden candidate now add
one short, original, link-only side-stream review card to Session 4: producer
stream → named dependency/wait → consumer stream → storage retained through
its last use → legal reuse. It presents `wait_stream` and `record_stream` only
as pinned-version documentation terms, not a GPU requirement, executable
recipe, or claim that the learner has CUDA.

### 4. The remaining high-value gap is delivery evidence, not curriculum breadth

**Anchor:** M31 lines **1418–1425** and M32 lines **1110–1248**, **1563–1572**.

Both workbooks now have original code-reading, counterexamples, diagnostics,
dossiers, and constructive oral prompts. Neither source corpus proves that the
designated-chat delivery is readable or useful for a real learner.

**Next evidence:** run one voluntary, learner-approved M31 or M32 chat pilot
using the existing equation/code/timeline material and record only the
learner-controlled summary: one misunderstanding repaired, one accessibility
or whiteboard observation, and one forward handoff. This is not a release,
grade, automatic record write, or basis to change authoring-only status.
